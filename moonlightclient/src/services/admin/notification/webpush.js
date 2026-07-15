import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'notifications.json');

export function getAll() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

export function addNotification(notification) {
  const all = getAll();
  all.unshift({
    id: Date.now().toString(),
    read: false,
    delivered: false,
    createdAt: new Date().toISOString(),
    ...notification,
  });
  fs.writeFileSync(filePath, JSON.stringify(all.slice(0, 200))); // keep last 200
  return all[0];
}

export function markDelivered(id) {
  const all = getAll();
  const updated = all.map((n) => (n.id === id ? { ...n, delivered: true } : n));
  fs.writeFileSync(filePath, JSON.stringify(updated));
}

export function markAllRead() {
  const all = getAll();
  const updated = all.map((n) => ({ ...n, read: true }));
  fs.writeFileSync(filePath, JSON.stringify(updated));
}