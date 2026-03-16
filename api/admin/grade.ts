import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const COLLECTION = 'exercise_submissions';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

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
      console.error('AdminGrade B64 parse failed.');
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  return JSON.parse(raw) as Record<string, unknown>;
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

async function getAdminEmail(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return null;
  const token = authHeader.slice(7);
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const email = await getAdminEmail(req);
    if (!email || email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }

    const { userId, exerciseId, grade, gradeNote } = body as Record<string, unknown>;
    if (typeof userId !== 'string' || typeof exerciseId !== 'string') {
      return res.status(400).json({ error: 'userId and exerciseId are required' });
    }
    if (grade !== null && grade !== undefined && (typeof grade !== 'number' || grade < 0 || grade > 10)) {
      return res.status(400).json({ error: 'grade must be a number between 0 and 10' });
    }

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection(COLLECTION);

    const updateFields: Record<string, unknown> = {
      gradedAt: new Date().toISOString(),
    };
    if (grade !== null && grade !== undefined) updateFields.grade = grade;
    if (typeof gradeNote === 'string') updateFields.gradeNote = gradeNote.slice(0, 500);

    const result = await col.updateOne(
      { userId, exerciseId },
      { $set: updateFields },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Submission not found for this student/exercise' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('AdminGrade error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
