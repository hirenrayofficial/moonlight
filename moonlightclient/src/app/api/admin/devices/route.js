import { NextResponse } from 'next/server';
import { requireAdminSession, unauthorizedJson } from '@/lib/adminAuth';
import connectDB from '@/db/mongodb/db';
import device from '@/db/mongodb/authbase/adminAuthbase';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return unauthorizedJson();

  try {
    await connectDB();
    const devices = await device
      .find({ userId: session.userId })
      .sort({ lastSeen: -1 })
      .lean();

    return NextResponse.json({ success: true, devices });
  } catch (err) {
    console.error('[admin/devices] failed to load devices:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to load device history.' },
      { status: 500 },
    );
  }
}
