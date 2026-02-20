import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const PROGRESS_COLLECTION = 'progress';
const PROFILES_COLLECTION = 'profiles';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

interface ProgressDoc {
  userId: string;
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
}

interface ProfileDoc {
  userId: string;
  nome: string;
  tipo: string;
  curso: string;
  serieOuSemestre: string;
  observacoes: string;
  updatedAt: string;
}

export interface StudyHistoryEntry {
  userId: string;
  email?: string;
  nome: string;
  tipo: string;
  curso: string;
  serieOuSemestre: string;
  completedLessons: string[];
  completedCount: number;
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
  updatedAt: string;
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
      const msg = e instanceof Error ? e.message : String(e);
      console.error('Admin API B64 parse failed:', msg);
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('Admin API JSON parse failed.');
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
  return initializeApp({
    credential: cert(raw as ServiceAccount),
    projectId,
  });
}

/** Verifica token e retorna email se for o admin; caso contrário retorna null. */
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
    if (!adminEmail) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const client = getMongoClient();
    const db = client.db(DB_NAME);
    const progressCol = db.collection<ProgressDoc>(PROGRESS_COLLECTION);
    const profilesCol = db.collection<ProfileDoc>(PROFILES_COLLECTION);

    const [progressList, profilesList] = await Promise.all([
      progressCol.find({}).toArray(),
      profilesCol.find({}).toArray(),
    ]);

    const profileByUserId = new Map<string, ProfileDoc>();
    for (const p of profilesList) {
      if (p.userId) profileByUserId.set(p.userId, p);
    }

    const entries: StudyHistoryEntry[] = progressList.map((doc) => {
      const profile = profileByUserId.get(doc.userId);
      return {
        userId: doc.userId,
        nome: profile?.nome ?? '—',
        tipo: profile?.tipo ?? '—',
        curso: profile?.curso ?? '—',
        serieOuSemestre: profile?.serieOuSemestre ?? '—',
        completedLessons: Array.isArray(doc.completedLessons) ? doc.completedLessons : [],
        completedCount: Array.isArray(doc.completedLessons) ? doc.completedLessons.length : 0,
        quizResults: doc.quizResults && typeof doc.quizResults === 'object' ? doc.quizResults : {},
        favorites: Array.isArray(doc.favorites) ? doc.favorites : [],
        updatedAt: profile?.updatedAt ?? '',
      };
    });

    entries.sort((a, b) => b.completedCount - a.completedCount);

    return res.status(200).json({ entries });
  } catch (err) {
    console.error('Admin study-history error:', err);
    const msg = process.env.NODE_ENV === 'production' ? undefined : (err instanceof Error ? err.message : String(err));
    return res.status(500).json({ error: 'Internal server error', ...(msg && { message: msg }) });
  }
}
