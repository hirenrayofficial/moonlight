import connectDB from '@/db/mongodb/db';
import Notification from '@/db/mongodb/notification';

export async function getAll() {
  await connectDB();
  return Notification.find().sort({ createdAt: -1 }).limit(200).lean();
}

export async function addNotification(notification) {
  await connectDB();
  const doc = await Notification.create({
    id: Date.now().toString(),
    read: false,
    delivered: false,
    createdAt: new Date(),
    ...notification,
  });
  return doc.toObject();
}

export async function markDelivered(id) {
  await connectDB();
  await Notification.findOneAndUpdate({ id }, { delivered: true });
}

export async function markAllRead() {
  await connectDB();
  await Notification.updateMany({}, { read: true });
}

export async function deleteAll() {
  await connectDB();
  await Notification.deleteMany({});
}

export async function deleteSingle(id) {
  await connectDB();
  await Notification.deleteOne({ _id:id });
}