import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sessionOptions } from '@/lib/session';
import User from '@/db/mongodb/usermodule';
import {
  getDeviceInfo,
  logAccessEvent,
  recordDeviceForUser,
  looksLikeBotUA,
  checkRateLimit,
} from '@/lib/device';
import connectDB from '@/db/mongodb/db';

const MIN_HUMAN_SUBMIT_MS = 1200; // nobody fills a login form in under ~1.2s

// Wrap non-critical side effects (logging, device tracking) so a failure
// there never breaks the actual login response.
async function safe(fn, label) {
  try {
    return await fn();
  } catch (err) {
    console.error(`[login] non-critical failure in ${label}:`, err);
    return null;
  }
}

export async function POST(request) {
  let body;

  // --- Parse request body safely ---------------------------------------
  try {
    body = await request.json();
  } catch (err) {
    console.error('[login] failed to parse request body:', err);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { username, password, csrf_token, form_rendered_at, hp_field } = body || {};

  // --- Basic input validation (before touching device/session/db) ------
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
  }

  let deviceInfo;
  try {
    deviceInfo = getDeviceInfo(request.headers);
  } catch (err) {
    console.error('[login] failed to read device info:', err);
    return NextResponse.json({ error: 'Could not process request.' }, { status: 400 });
  }

  let session;
  try {
    session = await getIronSession(await cookies(), sessionOptions);
  } catch (err) {
    console.error('[login] failed to load session:', err);
    return NextResponse.json({ error: 'Session error, please reload the page.' }, { status: 500 });
  }

  const blockAsBot = async (reason) => {
    await safe(
      () => logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason }),
      'logAccessEvent(bot_blocked)'
    );
    return NextResponse.json({ error: 'Request rejected.' }, { status: 400 });
  };

  // --- Rate limiting -----------------------------------------------------
  try {
    const { allowed } = await checkRateLimit(deviceInfo.ip, { windowMs: 15 * 60 * 1000, max: 10 });
    if (!allowed) {
      await safe(
        () => logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason: 'rate_limit_exceeded' }),
        'logAccessEvent(rate_limit_exceeded)'
      );
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
  } catch (err) {
    // If the rate limiter itself fails (e.g. DB/Redis down), fail closed-ish:
    // log it, but don't let it crash the whole login flow.
    console.error('[login] rate limit check failed:', err);
    // Choose to continue rather than block legitimate users during an infra hiccup.
  }

  // --- Bot signals ---------------------------------------------------------
  try {
    if (hp_field && String(hp_field).trim() !== '') {
      return await blockAsBot('honeypot_triggered');
    }

    const elapsed = Date.now() - Number(form_rendered_at);
    if (!form_rendered_at || Number.isNaN(elapsed) || elapsed < MIN_HUMAN_SUBMIT_MS) {
      return await blockAsBot('submitted_too_fast');
    }

    if (looksLikeBotUA(deviceInfo.userAgent)) {
      return await blockAsBot('suspicious_user_agent');
    }
  } catch (err) {
    console.error('[login] bot-signal check failed:', err);
    return NextResponse.json({ error: 'Request rejected.' }, { status: 400 });
  }

  // --- CSRF + session-bound timing check ----------------------------------
  try {
    if (
      !session.csrfToken ||
      csrf_token !== session.csrfToken ||
      String(session.formRenderedAt) !== String(form_rendered_at) ||
      !session.loginPageVisited
    ) {
      await safe(
        () => logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason: 'invalid_or_missing_session_token' }),
        'logAccessEvent(invalid_session_token)'
      );
      return NextResponse.json({ error: 'Session expired, please reload the login page.' }, { status: 400 });
    }
  } catch (err) {
    console.error('[login] CSRF/session check failed:', err);
    return NextResponse.json({ error: 'Session expired, please reload the login page.' }, { status: 400 });
  }

  // --- DB connection ---------------------------------------------------
  try {
    await connectDB();
  } catch (err) {
    console.error('[login] database connection failed:', err);
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again shortly.' }, { status: 503 });
  }

  const fail = async (reason) => {
    await safe(
      () => logAccessEvent({ deviceInfo, event: 'login_failed', usernameAttempted: username, reason }),
      'logAccessEvent(login_failed)'
    );
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  };

  // --- Credential check ----------------------------------------------------
  let user;
  try {
    user = await User.findOne({ username });
  } catch (err) {
    console.error('[login] user lookup failed:', err);
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again shortly.' }, { status: 503 });
  }

  if (!user) return await fail('unknown_username');

  // Defensive: if a user record is somehow missing/corrupt a password hash,
  // bcrypt.compare would throw instead of just returning false.
  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (err) {
    console.error('[login] bcrypt compare failed:', err);
    return await fail('password_check_error');
  }

  if (!isMatch) return await fail('wrong_password');

  // --- Success: rotate session, record device, log event -------------------
  try {
    session.destroy();
  } catch (err) {
    // Not fatal — we're about to get a fresh session object anyway.
    console.error('[login] session.destroy() failed:', err);
  }

  let freshSession;
  try {
    freshSession = await getIronSession(await cookies(), sessionOptions);
    freshSession.userId = user._id.toString();
    freshSession.username = user.username;
    freshSession.isAuthenticated = true;
    freshSession.loginAt = Date.now();
    freshSession.lastActivity = Date.now();
    freshSession.ip = deviceInfo.ip;
  } catch (err) {
    console.error('[login] failed to build fresh session:', err);
    return NextResponse.json({ error: 'Could not complete login. Please try again.' }, { status: 500 });
  }

  // Device tracking is important but should never block a successful login
  // if e.g. a stray unique-index issue or transient DB hiccup occurs.
  const deviceResult = await safe(
    () => recordDeviceForUser(user._id.toString(), deviceInfo),
    'recordDeviceForUser'
  );
  if (deviceResult?.isNewDevice) {
    freshSession.newDeviceFlag = true;
    // Hook here: send an email/SMS alert to the admin about a new device login.
  }

  try {
    await freshSession.save();
  } catch (err) {
    console.error('[login] failed to save session:', err);
    return NextResponse.json({ error: 'Could not complete login. Please try again.' }, { status: 500 });
  }

  await safe(
    () => logAccessEvent({ deviceInfo, event: 'login_success', usernameAttempted: username }),
    'logAccessEvent(login_success)'
  );

  return NextResponse.json({ ok: true, redirect: '/admin' });
}