import webpush from 'web-push';
import { addNotification, markDelivered } from '@/services/admin/notification/webpush';
import { getSubscription } from '@/services/admin/notification/subscription';
import Logs from '@/db/mongodb/authbase/accesslog'
import { getDeviceInfo } from '@/lib/device';
import connectDB from '@/db/mongodb/db';
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:ifyouthinkiamher@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BALi_sJ5bAV8rAXH1OAg8LN68D5t4FWs9jO2r8StLpGJGKcMGC4-7QI2PONkWgOuxs-wWfzTG60nTgbriRWTEd4',
  process.env.VAPID_PRIVATE_KEY || 'uZgNvCdUJmjcR6Xsxd1Jbd3O5EggTJUB0t_SxecP0uQ'
);

export async function POST(req) {
  await connectDB()
  const { page} = await req.json();
  const deviceInfo = getDeviceInfo(req.headers);


  const findExistuser = await Logs.findOne({ipAddress:deviceInfo.ip})
  if(findExistuser){
    return Response.json({ success: true });
  }

  // 1. Always log it, no matter what
  const notification = await addNotification({
    title: 'New visitor 👀',
    body: `Someone just visited: ${page || '/'}`,
    url: '/admin',
  });

  // 2. Try to push it live too (best effort — ok if this fails)
  const subscription = await getSubscription();
  if (subscription) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ title: notification.title, body: notification.body, url: notification.url })
      );
      await markDelivered(notification.id);
    } catch (err) {
      console.log('Push failed, but notification is saved for later:', err.message);
    }
  }

  return Response.json({ success: true });
}
