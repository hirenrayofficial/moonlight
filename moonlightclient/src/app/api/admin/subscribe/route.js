import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'subscription.json');

export async function POST(req) {
  const sub = await req.json();
  fs.writeFileSync(filePath, JSON.stringify(sub));
  return Response.json({ success: true });
}