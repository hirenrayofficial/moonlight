import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { sessionOptions } from '@/lib/session';
import { getDeviceInfo, logAccessEvent } from '@/lib/device';

// Called by the login page as soon as it mounts. This is what "starts a
// session when the login page opens" — the session cookie is issued here,
// before any credentials are submitted, and every visit gets logged.
export async function GET(request) {
  const session = await getIronSession(await cookies(), sessionOptions);

  session.csrfToken = crypto.randomBytes(24).toString('hex');
  session.formRenderedAt = Date.now();
  session.loginPageVisited = true;
  await session.save();

  const deviceInfo = getDeviceInfo(request.headers);
  await logAccessEvent({ deviceInfo, event: 'page_view' });

  return NextResponse.json({
    csrfToken: session.csrfToken,
    formRenderedAt: session.formRenderedAt,
  });
}
