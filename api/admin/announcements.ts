import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const COLLECTION = 'announcements';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

interface AnnouncementDoc {
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

function getB64String(): string | null {
  const partKeys = Array.from({ length: 8 }, (_, i) => `FIREBASE_SERVICE_ACCOUNT_B64_PART${i + 1}`);
  const parts: string[] = [];
  for (const key of partKeys) {
    const val = process.env[key];
    if (typeof val === 'string' && val.length > 0) parts.push(val.trim());
  }
  if (parts.length >= 2) {
    const joined = parts.join('').replace(/\s/g, '');
    if (joined.length > 100) return joined;
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (typeof one === 'string' && one.length > 100) return one.replace(/\s/g, '');
  return null;
}

function parseServiceAccountEnv(): Record<string, unknown> {
  const b64Raw = getB64String();
  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      return JSON.parse(json) as Record<string, unknown>;
    } catch (e) {
      console.error('Admin Announcements API B64 parse failed.');
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('Admin Announcements API JSON parse failed.');
    throw e;
  }
}

function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  const raw = parseServiceAccountEnv();
  if (!raw.project_id && raw.projectId) raw.project_id = raw.projectId;
  if (!raw.private_key && raw.privateKey) raw.private_key = raw.privateKey;
  if (!raw.client_email && raw.clientEmail) raw.client_email = raw.clientEmail;
  const projectId = (raw.project_id ?? 'desorientado-a-objetos') as string;
  return initializeApp({ credential: cert(raw as ServiceAccount), projectId });
}

async function requireAdminEmail(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return null;
  const token = authHeader.slice(7);
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    const email = (decoded.email || '').trim().toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
    return email === adminEmail ? email : null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const adminEmail = await requireAdminEmail(req);
    if (!adminEmail) return res.status(403).json({ error: 'Forbidden' });

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection<AnnouncementDoc>(COLLECTION);

    // GET — list all (including inactive)
    if (req.method === 'GET') {
      const docs = await col.find({}).sort({ createdAt: -1 }).limit(20).toArray();
      const announcements = docs.map((d) => ({
        id: String(d._id),
        message: d.message,
        type: d.type,
        active: d.active,
        createdAt: d.createdAt,
      }));
      return res.status(200).json({ announcements });
    }

    // POST — create new announcement
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
      }
      const message = typeof body?.message === 'string' ? body.message.trim() : '';
      const type = ['info', 'warning', 'success'].includes(body?.type) ? body.type : 'info';
      if (!message || message.length > 500) {
        return res.status(400).json({ error: 'Message required (max 500 chars)' });
      }
      const doc: AnnouncementDoc = { message, type, active: true, createdAt: new Date().toISOString() };
      const result = await col.insertOne(doc);
      return res.status(201).json({ id: String(result.insertedId), ...doc });
    }

    // DELETE — deactivate announcement
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (typeof id !== 'string' || id.length < 10) return res.status(400).json({ error: 'Invalid id' });
      try {
        await col.updateOne({ _id: new ObjectId(id) }, { $set: { active: false } });
      } catch {
        return res.status(400).json({ error: 'Invalid id format' });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin announcements error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
