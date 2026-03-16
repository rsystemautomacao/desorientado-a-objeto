import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const COLLECTION = 'exercise_submissions';
const MAX_HISTORY = 10;

export interface ExerciseSubmissionDoc {
  userId: string;
  exerciseId: string;
  attempts: number;
  passed: boolean;
  bestPassedTests: number;
  totalTests: number;
  grade?: number;       // 0–10, set by admin
  gradeNote?: string;
  gradedAt?: string;
  lastCode: string;
  lastSubmittedAt: string;
  history: {
    code: string;
    passedTests: number;
    totalTests: number;
    passed: boolean;
    timestamp: string;
  }[];
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
      console.error('ExerciseSubmission API B64 parse failed.');
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('ExerciseSubmission API JSON parse failed.');
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

async function getUserIdFromToken(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return null;
  const token = authHeader.slice(7);
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });

    const { exerciseId, code, passedTests, totalTests, passed } = body as Record<string, unknown>;
    if (
      typeof exerciseId !== 'string' || !exerciseId ||
      typeof code !== 'string' ||
      typeof passedTests !== 'number' ||
      typeof totalTests !== 'number'
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const timestamp = new Date().toISOString();
    const isPassed = !!passed;
    const safeCode = code.slice(0, 50000); // max ~50 KB

    const newEntry = { code: safeCode, passedTests, totalTests, passed: isPassed, timestamp };

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection<ExerciseSubmissionDoc>(COLLECTION);

    const existing = await col.findOne({ userId, exerciseId });

    if (existing) {
      const newHistory = [newEntry, ...existing.history].slice(0, MAX_HISTORY);
      await col.updateOne(
        { userId, exerciseId },
        {
          $set: {
            lastCode: safeCode,
            lastSubmittedAt: timestamp,
            passed: isPassed || existing.passed,
            bestPassedTests: Math.max(passedTests, existing.bestPassedTests),
            totalTests,
            history: newHistory,
          },
          $inc: { attempts: 1 },
        }
      );
    } else {
      const doc: ExerciseSubmissionDoc = {
        userId,
        exerciseId,
        attempts: 1,
        passed: isPassed,
        bestPassedTests: passedTests,
        totalTests,
        lastCode: safeCode,
        lastSubmittedAt: timestamp,
        history: [newEntry],
      };
      await col.insertOne(doc);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('ExerciseSubmission API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
