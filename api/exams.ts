/**
 * Student exam API (consolidated):
 *
 * POST { action: "access", code: "ABC123" }  → validate code, return exam data
 * POST { action: "submit", examId, exerciseIndex, code, passedTests, totalTests, allPassed } → submit answer
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const EXAMS_COL = 'exams';
const SUBMISSIONS_COL = 'exam_submissions';

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
    } catch (e) { console.error('Exams student API B64 parse failed.'); throw e; }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try { return JSON.parse(raw) as Record<string, unknown>; }
  catch (e) { console.error('Exams student API JSON parse failed.'); throw e; }
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

async function verifyToken(req: VercelRequest): Promise<{ uid: string; email: string } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return null;
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(authHeader.slice(7));
    return { uid: decoded.uid, email: (decoded.email || '').trim().toLowerCase() };
  } catch { return null; }
}

function parseBody<T = Record<string, unknown>>(body: unknown): T | null {
  if (!body) return null;
  if (typeof body === 'string') { try { return JSON.parse(body) as T; } catch { return null; } }
  if (typeof body === 'object') return body as T;
  return null;
}

interface SubmissionDoc {
  examId: string;
  exerciseIndex: number;
  userId: string;
  userEmail: string;
  userName: string;
  code: string;
  passedTests: number;
  totalTests: number;
  allPassed: boolean;
  attemptNumber: number;
  submittedAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const body = parseBody(req.body) as Record<string, unknown> | null;
    if (!body) return res.status(400).json({ error: 'Invalid body' });

    const action = typeof body.action === 'string' ? body.action : '';

    const client = getMongoClient();
    const db = client.db(DB_NAME);

    // ── ACTION: access — validate code and return exam ──
    if (action === 'access') {
      const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
      if (!code || code.length < 4) return res.status(400).json({ error: 'Codigo invalido' });

      const exam = await db.collection(EXAMS_COL).findOne({ active: true, accessCodes: code });
      if (!exam) return res.status(404).json({ error: 'Codigo invalido ou prova inativa' });

      // Get student's existing submissions
      const submissions = await db.collection(SUBMISSIONS_COL)
        .find({ examId: String(exam._id), userId: user.uid })
        .toArray();

      const submissionCounts: Record<number, number> = {};
      for (const sub of submissions) {
        const idx = sub.exerciseIndex as number;
        submissionCounts[idx] = (submissionCounts[idx] || 0) + 1;
      }

      const exercises = (exam.exercises as Array<{
        title: string; description: string; starterCode: string;
        testCases: { input: string; expectedOutput: string; visible: boolean }[];
      }>).map((ex, idx) => ({
        title: ex.title,
        description: ex.description,
        starterCode: ex.starterCode,
        testCases: ex.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.visible ? tc.expectedOutput : '(oculto)',
          visible: tc.visible,
        })),
        submissionsUsed: submissionCounts[idx] || 0,
      }));

      return res.status(200).json({
        examId: String(exam._id),
        title: exam.title,
        description: exam.description,
        exercises,
        maxSubmissions: exam.maxSubmissions,
      });
    }

    // ── ACTION: submit — submit exercise answer ──
    if (action === 'submit') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      const exerciseIndex = typeof body.exerciseIndex === 'number' ? body.exerciseIndex : -1;
      const code = typeof body.code === 'string' ? body.code : '';
      const passedTests = typeof body.passedTests === 'number' ? body.passedTests : 0;
      const totalTests = typeof body.totalTests === 'number' ? body.totalTests : 0;
      const allPassed = typeof body.allPassed === 'boolean' ? body.allPassed : false;

      if (!examId || exerciseIndex < 0 || !code) {
        return res.status(400).json({ error: 'examId, exerciseIndex, and code are required' });
      }

      let exam;
      try {
        exam = await db.collection(EXAMS_COL).findOne({ _id: new ObjectId(examId), active: true });
      } catch {
        return res.status(400).json({ error: 'Invalid examId' });
      }
      if (!exam) return res.status(404).json({ error: 'Prova nao encontrada ou inativa' });

      const exercises = exam.exercises as unknown[];
      if (exerciseIndex >= exercises.length) {
        return res.status(400).json({ error: 'Exercicio invalido' });
      }

      const maxSubmissions = typeof exam.maxSubmissions === 'number' ? exam.maxSubmissions : 3;
      const existingCount = await db.collection(SUBMISSIONS_COL).countDocuments({
        examId, exerciseIndex, userId: user.uid,
      });

      if (existingCount >= maxSubmissions) {
        return res.status(429).json({
          error: `Limite de ${maxSubmissions} submissoes atingido para este exercicio`,
          submissionsUsed: existingCount,
          maxSubmissions,
        });
      }

      let userName = user.email;
      try {
        const profile = await db.collection('profiles').findOne({ userId: user.uid });
        if (profile?.nome) userName = profile.nome as string;
      } catch { /* use email as fallback */ }

      const submission: SubmissionDoc = {
        examId,
        exerciseIndex,
        userId: user.uid,
        userEmail: user.email,
        userName,
        code,
        passedTests: Math.max(0, Math.floor(passedTests)),
        totalTests: Math.max(0, Math.floor(totalTests)),
        allPassed,
        attemptNumber: existingCount + 1,
        submittedAt: new Date().toISOString(),
      };

      await db.collection<SubmissionDoc>(SUBMISSIONS_COL).insertOne(submission);

      return res.status(201).json({
        ok: true,
        attemptNumber: submission.attemptNumber,
        submissionsRemaining: maxSubmissions - submission.attemptNumber,
      });
    }

    // ── ACTION: tab-switch — record tab switch event ──
    if (action === 'tab-switch') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      const count = typeof body.count === 'number' ? body.count : 1;
      const timestamp = typeof body.timestamp === 'string' ? body.timestamp : new Date().toISOString();

      if (!examId) return res.status(400).json({ error: 'examId is required' });

      // Upsert: update the tab-switch record for this user+exam
      await db.collection('exam_tab_switches').updateOne(
        { examId, userId: user.uid },
        {
          $set: {
            examId,
            userId: user.uid,
            userEmail: user.email,
            totalSwitches: count,
            lastSwitchAt: timestamp,
            updatedAt: new Date().toISOString(),
          },
          $push: {
            events: { count, timestamp },
          } as Record<string, unknown>,
          $setOnInsert: {
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ ok: true, count });
    }

    // ── ACTION: cheat-attempt — record paste/copy/contextmenu/injection ──
    if (action === 'cheat-attempt') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      const type = typeof body.type === 'string' ? body.type : 'unknown';
      const count = typeof body.count === 'number' ? body.count : 1;
      const timestamp = typeof body.timestamp === 'string' ? body.timestamp : new Date().toISOString();

      if (!examId) return res.status(400).json({ error: 'examId is required' });

      await db.collection('exam_cheat_attempts').updateOne(
        { examId, userId: user.uid },
        {
          $set: {
            examId,
            userId: user.uid,
            userEmail: user.email,
            totalAttempts: count,
            updatedAt: new Date().toISOString(),
          },
          $push: {
            events: { type, count, timestamp },
          } as Record<string, unknown>,
          $setOnInsert: {
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ ok: true, count });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('Exams API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
