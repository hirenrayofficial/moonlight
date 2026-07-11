import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sessionOptions } from '@/lib/session';
import User from '@/db/mongodb/usermodule'
import {
  getDeviceInfo,
  logAccessEvent,
  recordDeviceForUser,
  looksLikeBotUA,
  checkRateLimit,
} from '@/lib/device';
import connectDB from '@/db/mongodb/db';

const MIN_HUMAN_SUBMIT_MS = 1200; // nobody fills a login form in under ~1.2s

export async function POST(request) {
  const body = await request.json();
  const { username, password, csrf_token, form_rendered_at, hp_field } = body;

  const deviceInfo = getDeviceInfo(request.headers);
  console.log(deviceInfo)
  const session = await getIronSession(await cookies(), sessionOptions);

  const blockAsBot = async (reason) => {
    await logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason });
    return NextResponse.json({ error: 'Request rejected.' }, { status: 400 });
  };

  // --- Rate limiting -------------------------------------------------
  const { allowed } = await checkRateLimit(deviceInfo.ip, { windowMs: 15 * 60 * 1000, max: 10 });
  if (!allowed) {
    await logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason: 'rate_limit_exceeded' });
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  // --- Bot signals -----------------------------------------------------
  // Honeypot: real users never see/fill this field.
  if (hp_field && String(hp_field).trim() !== '') {
    return blockAsBot('honeypot_triggered');
  }

  // Timing: bots often submit unrealistically fast after the page "loads".
  const elapsed = Date.now() - Number(form_rendered_at);
  if (!form_rendered_at || elapsed < MIN_HUMAN_SUBMIT_MS) {
    return blockAsBot('submitted_too_fast');
  }

  if (looksLikeBotUA(deviceInfo.userAgent)) {
    return blockAsBot('suspicious_user_agent');
  }

  // --- CSRF + session-bound timing check --------------------------------
  // Confirms the form actually came from a session we issued via /api/session/init.
  if (
    !session.csrfToken ||
    csrf_token !== session.csrfToken ||
    String(session.formRenderedAt) !== String(form_rendered_at) ||
    !session.loginPageVisited
  ) {
    await logAccessEvent({ deviceInfo, event: 'bot_blocked', usernameAttempted: username, reason: 'invalid_or_missing_session_token' });
    return NextResponse.json({ error: 'Session expired, please reload the login page.' }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
  }

  // --- Credential check --------------------------------------------------
  await connectDB();
  const user = await User.findOne({ username });

  const fail = async (reason) => {
    await logAccessEvent({ deviceInfo, event: 'login_failed', usernameAttempted: username, reason });
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  };

  if (!user) return fail('unknown_username');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return fail('wrong_password');

  // --- Success: rotate session, record device, log event -----------------
  // iron-session cookies are encrypted client-side blobs (no server-side
  // session ID to "fixate"), but we still destroy + rebuild the session
  // content on privilege change as defense in depth.
  session.destroy();
  const freshSession = await getIronSession(await cookies(), sessionOptions);
  freshSession.userId = user._id.toString();
  freshSession.username = user.username;
  freshSession.isAuthenticated = true;
  freshSession.loginAt = Date.now();
  freshSession.lastActivity = Date.now();
  freshSession.ip = deviceInfo.ip;

  const { isNewDevice } = await recordDeviceForUser(user._id.toString(), deviceInfo);
  if (isNewDevice) {
    freshSession.newDeviceFlag = true;
    // Hook here: send an email/SMS alert to the admin about a new device login.
  }

  await freshSession.save();

  await logAccessEvent({ deviceInfo, event: 'login_success', usernameAttempted: username });

  return NextResponse.json({ ok: true, redirect: '/admin' });
}
