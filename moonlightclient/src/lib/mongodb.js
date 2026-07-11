import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/moonlight";
const dbName = process.env.MONGODB_DB || "admin_auth";

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. Copy .env.local.example to .env.local and fill it in.');
}

// In dev, Next.js hot-reloads modules, which would otherwise open a fresh
// MongoClient on every reload. Caching it on `global` avoids that.
let cached = global._mongoClientPromise;

if (!cached) {
  const client = new MongoClient(uri, { maxPoolSize: 10 });
  cached = client.connect();
  global._mongoClientPromise = cached;
}

export async function getDb() {
  const client = await cached;
  return client.db(dbName);
}

// Call once at startup (e.g. from the seed script) to make sure indexes exist.
export async function ensureIndexes() {
  const db = await getDb();
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('accessLogs').createIndex({ createdAt: -1 });
  await db.collection('accessLogs').createIndex({ ipAddress: 1, createdAt: -1 });
  await db.collection('trustedDevices').createIndex(
    { userId: 1, deviceFingerprint: 1 },
    { unique: true }
  );
}
