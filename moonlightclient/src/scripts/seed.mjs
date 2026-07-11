// Run once: npm run seed
// Creates a default admin user if one doesn't already exist.
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'admin_auth';

if (!uri) {
  console.error('Missing MONGODB_URI. Copy .env.local.example to .env.local first.');
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection('users');

  await users.createIndex({ username: 1 }, { unique: true });

  const existing = await users.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user already exists — nothing to do.');
    return;
  }

  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  await users.insertOne({ username: 'admin', passwordHash, createdAt: new Date() });

  console.log('Created admin user -> username: admin, password: ChangeMe123! (CHANGE THIS IMMEDIATELY)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => client.close());
