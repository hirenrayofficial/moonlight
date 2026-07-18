import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { getDb } from './mongodb';
import connectDB from '@/db/mongodb/db';
import device from '@/db/mongodb/authbase/adminAuthbase';
import Logs from '@/db/mongodb/authbase/accesslog';
import attemp from '@/db/mongodb/authbase/attempts';

// Real client IP, aware of a reverse proxy / platform load balancer
// (Vercel, nginx, Cloudflare) sitting in front of the Next.js server.
export function getClientIp(headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}

// A stable-ish fingerprint from things a normal browser sends consistently.
// Not foolproof (no client fingerprint is), but combined with IP + session
// history it's good enough to flag "new device" situations.
export function getDeviceFingerprint(headers) {
  const ip = getClientIp(headers);
  const ua = headers.get('user-agent') || '';
  const lang = headers.get('accept-language') || '';
  const raw = `${ip}|${ua}|${lang}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function parseDevice(headers) {
  const parser = new UAParser(headers.get('user-agent') || '');
  const result = parser.getResult();
  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    deviceType: result.device.type || 'desktop',
  };
}

// Builds the standard device-info object used across the app.
export function getDeviceInfo(headers) {
  const { browser, os, deviceType } = parseDevice(headers);
  return {
    ip: getClientIp(headers),
    userAgent: headers.get('user-agent') || '',
    fingerprint: getDeviceFingerprint(headers),
    browser,
    os,
    deviceType,
  };
}

// Suspicious / scripted-client User-Agent patterns.
const SUSPICIOUS_UA_PATTERNS = [
  /curl/i, /wget/i, /python-requests/i, /scrapy/i, /^$/,
  /headlesschrome/i, /phantomjs/i, /bot/i, /spider/i, /crawler/i,
];

export function looksLikeBotUA(userAgent) {
  if (!userAgent) return true;
  return SUSPICIOUS_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// Logs every page view and login attempt (success or failure) for audit purposes.
export async function logAccessEvent({ deviceInfo, event, usernameAttempted = null, reason = null }) {
  await connectDB();

  const ipfind = await Logs.findOne({ ipAddress: deviceInfo.ip })
  if (!ipfind) {
    await Logs.insertOne({
      usernameAttempted,
      ipAddress: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      deviceType: deviceInfo.deviceType,
      event, // 'page_view' | 'login_success' | 'login_failed' | 'bot_blocked'
      reason,
      createdAt: new Date(),
    });
  } else {
    return
  }

}

// Records or updates the (user, device) row and reports whether this
// was a brand-new device for that user.
async function ensureAdminDeviceIndexes() {
  await connectDB();

  const staleIndexes = [
    'userId_1',
    'deviceFingerprint_1',
    'ipAddress_1',
    'userAgent_1',
    'browser_1',
    'os_1',
  ];

  const indexes = await device.collection.indexes();
  for (const index of indexes) {
    if (staleIndexes.includes(index.name)) {
      try {
        await device.collection.dropIndex(index.name);
      } catch (err) {
        if (!/IndexNotFound|index not found/i.test(err.message)) {
          throw err;
        }
      }
    }
  }

  const hasCompound = indexes.some(
    (index) =>
      index.key &&
      index.key.userId === 1 &&
      index.key.deviceFingerprint === 1
  );

  if (!hasCompound) {
    await device.collection.createIndex(
      { userId: 1, deviceFingerprint: 1 },
      { unique: true, name: 'userId_1_deviceFingerprint_1' }
    );
  }
}

export async function recordDeviceForUser(userId, deviceInfo) {
  await ensureAdminDeviceIndexes();

  const existing = await device.findOne({ userId, deviceFingerprint: deviceInfo.fingerprint });

  if (existing) {
    await device.updateOne(
      { _id: existing._id },
      { $set: { lastSeen: new Date(), ipAddress: deviceInfo.ip } }
    );
    return { isNewDevice: false, device: existing };
  }

  const result = await device.insertOne({
    userId,
    deviceFingerprint: deviceInfo.fingerprint,
    ipAddress: deviceInfo.ip,
    userAgent: deviceInfo.userAgent,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    deviceType: deviceInfo.deviceType,
    firstSeen: new Date(),
    lastSeen: new Date(),
    isTrusted: false,
  });

  return { isNewDevice: true, device: { _id: result.insertedId } };
}

// Simple Mongo-backed sliding-window rate limiter, keyed by IP.
// Durable across server restarts/instances, unlike an in-memory Map.
export async function checkRateLimit(ip, { windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  await connectDB();
  const windowStart = new Date(Date.now() - windowMs);

  await attemp.insertOne({ ip, createdAt: new Date() });
  const count = await attemp.countDocuments({ ip, createdAt: { $gte: windowStart } });

  return { allowed: count <= max, count };
}
