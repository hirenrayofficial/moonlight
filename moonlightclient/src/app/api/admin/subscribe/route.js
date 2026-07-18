import { saveSubscription } from '@/services/admin/notification/subscription';
import { verifyAdminSession, unauthorizedJson } from '@/lib/adminAuth';

export async function POST(req) {
  if (!(await verifyAdminSession())) {
    return unauthorizedJson();
  }

  const sub = await req.json();
  await saveSubscription(sub);
  return Response.json({ success: true });
}