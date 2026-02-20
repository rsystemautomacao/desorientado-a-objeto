import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import * as admin from 'firebase-admin';

const DB_NAME = 'desorientado';
const COLLECTION = 'progress';

export interface ProgressDoc {
  userId: string;
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
}

const DEFAULT_PROGRESS: ProgressDoc = {
  userId: '',
  completedLessons: [],
  quizResults: {},
  favorites: [],
};

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  const globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  return globalWithMongo._mongoClient;
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
      console.error(`B64 decode/parse falhou (${b64Raw.length} chars): ${msg}`);
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Nenhuma service account configurada.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON parse falhou.');
    throw e;
  }
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();
  const raw = parseServiceAccountEnv();
  const sa: admin.ServiceAccount = {
    projectId: (raw.project_id ?? raw.projectId ?? 'desorientado-a-objetos') as string,
    clientEmail: (raw.client_email ?? raw.clientEmail) as string,
    privateKey: (raw.private_key ?? raw.privateKey) as string,
  };
  return admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.projectId,
  });
}

async function getUserIdFromToken(req: VercelRequest): Promise<{ userId: string } | { userId: null; code: string }> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Progress API: missing or invalid Authorization header');
    return { userId: null, code: 'NO_HEADER' };
  }
  const token = authHeader.slice(7);
  if (!token || token.length < 50) {
    console.error('Progress API: token too short or empty');
    return { userId: null, code: 'NO_HEADER' };
  }
  try {
    const app = getFirebaseAdmin();
    const decoded = await app.auth().verifyIdToken(token);
    return { userId: decoded.uid };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Progress API verifyIdToken failed:', msg);
    return { userId: null, code: 'TOKEN_VERIFY_FAILED' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const result = await getUserIdFromToken(req);
  if (!result.userId) {
    const code = 'code' in result ? result.code : 'TOKEN_INVALID';
    return res.status(401).json({ error: 'Unauthorized', code });
  }
  const userId = result.userId;

  if (req.method === 'GET') {
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProgressDoc>(COLLECTION);
      const doc = await col.findOne({ userId });
      const progress: ProgressDoc = doc
        ? {
            userId: doc.userId,
            completedLessons: Array.isArray(doc.completedLessons) ? doc.completedLessons : [],
            quizResults: doc.quizResults && typeof doc.quizResults === 'object' ? doc.quizResults : {},
            favorites: Array.isArray(doc.favorites) ? doc.favorites : [],
          }
        : { ...DEFAULT_PROGRESS, userId };
      return res.status(200).json(progress);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to load progress' });
    }
  }

  if (req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body) as ProgressDoc;
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const progress: ProgressDoc = {
      userId,
      completedLessons: Array.isArray(body.completedLessons) ? body.completedLessons : [],
      quizResults: body.quizResults && typeof body.quizResults === 'object' ? body.quizResults : {},
      favorites: Array.isArray(body.favorites) ? body.favorites : [],
    };
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProgressDoc>(COLLECTION);
      await col.updateOne(
        { userId },
        { $set: progress },
        { upsert: true }
      );
      return res.status(200).json(progress);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to save progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
