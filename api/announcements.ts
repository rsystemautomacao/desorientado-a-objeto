import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const DB_NAME = 'desorientado';
const COLLECTION = 'announcements';

export interface AnnouncementDoc {
  _id?: unknown;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  const g = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!g._mongoClient) g._mongoClient = new MongoClient(uri);
  return g._mongoClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const client = getMongoClient();
    const col = client.db(DB_NAME).collection<AnnouncementDoc>(COLLECTION);
    const docs = await col.find({ active: true }).sort({ createdAt: -1 }).limit(10).toArray();
    const announcements = docs.map((d) => ({
      id: String(d._id),
      message: d.message,
      type: d.type,
      createdAt: d.createdAt,
    }));
    return res.status(200).json({ announcements });
  } catch (err) {
    console.error('Announcements API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
