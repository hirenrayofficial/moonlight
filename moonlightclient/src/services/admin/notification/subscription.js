import connectDB from '@/db/mongodb/db';
import Subscription from '@/db/mongodb/subscription';

export async function getSubscription() {
  await connectDB();
  const doc = await Subscription.findOne({ key: 'default' }).lean();
  return doc?.subscription || null;
}

export async function saveSubscription(subscription) {
  await connectDB();
  const doc = await Subscription.findOneAndUpdate(
    { key: 'default' },
    { subscription, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return doc.toObject();
}
