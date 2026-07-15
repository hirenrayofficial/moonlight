

import webpush from 'web-push';
import fs from 'fs';
import path from 'path';
import { addNotification, markDelivered } from '@/services/admin/notification/webpush';


webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:ifyouthinkiamher@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BALi_sJ5bAV8rAXH1OAg8LN68D5t4FWs9jO2r8StLpGJGKcMGC4-7QI2PONkWgOuxs-wWfzTG60nTgbriRWTEd4",
  process.env.VAPID_PRIVATE_KEY || "uZgNvCdUJmjcR6Xsxd1Jbd3O5EggTJUB0t_SxecP0uQ"
);

export async function POST(req) {
  const { page } = await req.json();

  // 1. Always log it, no matter what
  const notification = addNotification({
    title: 'New visitor 👀',
    body: `Someone just visited: ${page || '/'}`,
    url: '/admin',
  });

  // 2. Try to push it live too (best effort — ok if this fails)
  const subFilePath = path.join(process.cwd(), 'subscription.json');
  if (fs.existsSync(subFilePath)) {
    const subscription = JSON.parse(fs.readFileSync(subFilePath));
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ title: notification.title, body: notification.body, url: notification.url })
      );
      markDelivered(notification.id);
    } catch (err) {
      console.log('Push failed, but notification is saved for later:', err.message);
    }
  }

  return Response.json({ success: true });
}