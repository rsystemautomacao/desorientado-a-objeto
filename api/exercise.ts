/**
 * /api/exercise — unified exercise endpoint
 *
 * POST  (authenticated student): save an exercise submission
 * GET   ?userId=XXX (admin only): get all submissions for a student
 * PUT   (admin only): save a grade for a student's exercise
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const COLLECTION = 'exercise_submissions';
const MAX_HISTORY = 10;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

export interface ExerciseSubmissionDoc {
  userId: string;
  exerciseId: string;
  attempts: number;
  passed: boolean;
  bestPassedTests: number;
  totalTests: number;
  grade?: number;
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
      console.error('Exercise API B64 parse failed.');
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

async function getTokenInfo(req: VercelRequest): Promise<{ uid: string; email: string } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return null;
  const token = authHeader.slice(7);
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? '' };
  } catch {
    return null;
  }
}

function isAdmin(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── POST: student saves a submission ──────────────────────────────────────
  if (req.method === 'POST') {
    const info = await getTokenInfo(req);
    if (!info) return res.status(401).json({ error: 'Unauthorized' });

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

    const userId = info.uid;
    const timestamp = new Date().toISOString();
    const isPassed = !!passed;
    const safeCode = code.slice(0, 50000);
    const newEntry = { code: safeCode, passedTests, totalTests, passed: isPassed, timestamp };

    try {
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
              bestPassedTests: Math.max(passedTests as number, existing.bestPassedTests),
              totalTests,
              history: newHistory,
            },
            $inc: { attempts: 1 },
          }
        );
      } else {
        const doc: ExerciseSubmissionDoc = {
          userId, exerciseId, attempts: 1, passed: isPassed,
          bestPassedTests: passedTests as number, totalTests: totalTests as number,
          lastCode: safeCode, lastSubmittedAt: timestamp, history: [newEntry],
        };
        await col.insertOne(doc);
      }
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Exercise POST error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ── GET: admin fetches submissions for a student ──────────────────────────
  if (req.method === 'GET') {
    const info = await getTokenInfo(req);
    if (!info || !isAdmin(info.email)) return res.status(403).json({ error: 'Forbidden' });

    const userId = typeof req.query.userId === 'string' ? req.query.userId : null;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection(COLLECTION);
      const docs = await col.find({ userId }).sort({ lastSubmittedAt: -1 }).toArray();
      const submissions = docs.map(({ _id: _ignored, ...rest }) => rest);
      return res.status(200).json({ submissions });
    } catch (err) {
      console.error('Exercise GET error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ── PUT: admin saves a grade ──────────────────────────────────────────────
  if (req.method === 'PUT') {
    const info = await getTokenInfo(req);
    if (!info || !isAdmin(info.email)) return res.status(403).json({ error: 'Forbidden' });

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
    }

    const { userId, exerciseId, grade, gradeNote } = body as Record<string, unknown>;
    if (typeof userId !== 'string' || typeof exerciseId !== 'string') {
      return res.status(400).json({ error: 'userId and exerciseId are required' });
    }
    if (grade !== null && grade !== undefined && (typeof grade !== 'number' || grade < 0 || grade > 10)) {
      return res.status(400).json({ error: 'grade must be 0–10' });
    }

    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection(COLLECTION);
      const updateFields: Record<string, unknown> = { gradedAt: new Date().toISOString() };
      if (grade !== null && grade !== undefined) updateFields.grade = grade;
      if (typeof gradeNote === 'string') updateFields.gradeNote = gradeNote.slice(0, 500);

      const result = await col.updateOne({ userId, exerciseId }, { $set: updateFields }, { upsert: false });
      if (result.matchedCount === 0) return res.status(404).json({ error: 'Submission not found' });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Exercise PUT error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
