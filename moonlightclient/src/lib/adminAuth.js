import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import { sessionOptions } from '@/lib/session';

export async function getAdminSession() {
  return await getIronSession(await cookies(), sessionOptions);
}

export async function verifyAdminSession() {
  const session = await getAdminSession();
  return session?.isAuthenticated === true;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (session?.isAuthenticated !== true) {
    return null;
  }
  return session;
}

export function unauthorizedJson() {
  return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
}
