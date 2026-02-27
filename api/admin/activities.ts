import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const ACTIVITIES_COLLECTION = 'activities';
const PROFILES_COLLECTION = 'profiles';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

interface ActivityDoc {
  userId: string;
  type: 'lesson_complete' | 'quiz_complete';
  lessonId: string;
  score?: number;
  total?: number;
  timestamp: string;
}

interface ProfileDoc {
  userId: string;
  nome: string;
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
      console.error('Admin Activities API B64 parse failed.');
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('Admin Activities API JSON parse failed.');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const adminEmail = await requireAdminEmail(req);
    if (!adminEmail) return res.status(403).json({ error: 'Forbidden' });

    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const client = getMongoClient();
    const db = client.db(DB_NAME);
    const activitiesCol = db.collection<ActivityDoc>(ACTIVITIES_COLLECTION);
    const profilesCol = db.collection<ProfileDoc>(PROFILES_COLLECTION);

    const [activities, profiles] = await Promise.all([
      activitiesCol.find({}).sort({ timestamp: -1 }).limit(limit).toArray(),
      profilesCol.find({}, { projection: { userId: 1, nome: 1 } }).toArray(),
    ]);

    const nameByUserId = new Map<string, string>();
    for (const p of profiles) {
      if (p.userId && p.nome) nameByUserId.set(p.userId, p.nome);
    }

    const entries = activities.map((a) => ({
      userId: a.userId,
      nome: nameByUserId.get(a.userId) || '',
      type: a.type,
      lessonId: a.lessonId,
      score: a.score,
      total: a.total,
      timestamp: a.timestamp,
    }));

    return res.status(200).json({ activities: entries });
  } catch (err) {
    console.error('Admin activities error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
