import { getAll, markAllRead } from '@/lib/notifications';

export async function GET(req) {
  const authHeader = req.headers.get('x-admin-secret');
  if (authHeader !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return Response.json(getAll());
}

export async function POST(req) {
  const authHeader = req.headers.get('x-admin-secret');
  if (authHeader !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  markAllRead();
  return Response.json({ success: true });
}