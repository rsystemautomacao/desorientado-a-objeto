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
      const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : '';
      if (!code || code.length < 4) return res.status(400).json({ error: 'Codigo invalido' });

      const exam = await db.collection(EXAMS_COL).findOne({ active: true, accessCodes: code });
      if (!exam) return res.status(404).json({ error: 'Codigo invalido ou prova inativa' });

      const examId = String(exam._id);

      // Check if student already has a session
      const existingSession = await db.collection('exam_sessions').findOne({
        examId, userId: user.uid,
      });

      // If finalized, deny access
      if (existingSession?.finalized) {
        return res.status(403).json({
          error: 'Voce ja encerrou esta prova. Nao e possivel acessar novamente.',
          finalized: true,
          examId,
          finalizedAt: existingSession.finalizedAt,
        });
      }

      // Create or update session (mark as accessed)
      if (!existingSession) {
        await db.collection('exam_sessions').insertOne({
          examId,
          userId: user.uid,
          userEmail: user.email,
          userName: studentName,
          finalized: false,
          accessedAt: new Date().toISOString(),
          finalizedAt: null,
        });
      } else if (studentName && studentName !== existingSession.userName) {
        // Update name if provided and different
        await db.collection('exam_sessions').updateOne(
          { examId, userId: user.uid },
          { $set: { userName: studentName } },
        );
      }

      // Get student's existing submissions (keyed by ORIGINAL exercise index)
      const submissions = await db.collection(SUBMISSIONS_COL)
        .find({ examId, userId: user.uid })
        .toArray();

      const submissionCounts: Record<number, number> = {};
      for (const sub of submissions) {
        const idx = sub.exerciseIndex as number;
        submissionCounts[idx] = (submissionCounts[idx] || 0) + 1;
      }

      const rawExercises = exam.exercises as Array<{
        type?: string; title: string; description: string; starterCode: string;
        testCases: { input: string; expectedOutput: string; visible: boolean }[];
        options?: string[]; correctIndex?: number; codeSnippet?: string;
        snippetBefore?: string; snippetAfter?: string; explanation?: string;
      }>;

      const shouldShuffleQ = exam.shuffleQuestions === true;
      const shouldShuffleOpts = exam.shuffleOptions === true;

      // Determine or reuse shuffle order from session
      let questionOrder: number[] = Array.from({ length: rawExercises.length }, (_, i) => i);
      let optionOrders: Record<number, number[]> = {};

      // Seeded shuffle using Fisher-Yates with a simple seed
      function seededShuffle<T>(arr: T[], seed: string): T[] {
        const result = [...arr];
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
          h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
        }
        for (let i = result.length - 1; i > 0; i--) {
          h = ((h << 5) - h + i) | 0;
          const j = Math.abs(h) % (i + 1);
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }

      // Check if session already has a shuffle order (so reloads keep the same order)
      const sessionDoc = existingSession || await db.collection('exam_sessions').findOne({ examId, userId: user.uid });

      if (sessionDoc?.questionOrder && Array.isArray(sessionDoc.questionOrder)) {
        questionOrder = sessionDoc.questionOrder as number[];
        optionOrders = (sessionDoc.optionOrders || {}) as Record<number, number[]>;
      } else if (shouldShuffleQ || shouldShuffleOpts) {
        // Generate shuffle orders
        const seed = `${examId}-${user.uid}`;

        if (shouldShuffleQ) {
          questionOrder = seededShuffle(questionOrder, seed + '-questions');
        }

        if (shouldShuffleOpts) {
          for (let origIdx = 0; origIdx < rawExercises.length; origIdx++) {
            const ex = rawExercises[origIdx];
            const qType = ex.type || 'code';
            if ((qType === 'multiple-choice' || qType === 'fill-blank') && ex.options && ex.options.length > 1) {
              const optOrder = seededShuffle(
                Array.from({ length: ex.options.length }, (_, i) => i),
                seed + `-options-${origIdx}`
              );
              optionOrders[origIdx] = optOrder;
            }
          }
        }

        // Store in session for consistency on reload
        await db.collection('exam_sessions').updateOne(
          { examId, userId: user.uid },
          { $set: { questionOrder, optionOrders } },
        );
      }

      // Build exercises in shuffled order
      const exercises = questionOrder.map((origIdx) => {
        const ex = rawExercises[origIdx];
        const qType = ex.type || 'code';

        const mapped: Record<string, unknown> = {
          type: qType,
          title: ex.title,
          description: ex.description,
          starterCode: ex.starterCode || '',
          testCases: (ex.testCases || []).map((tc) => ({
            input: tc.input,
            expectedOutput: tc.visible ? tc.expectedOutput : '(oculto)',
            visible: tc.visible,
          })),
          submissionsUsed: submissionCounts[origIdx] || 0,
          originalIndex: origIdx,
        };

        // Add objective question fields
        if (qType !== 'code') {
          mapped.codeSnippet = ex.codeSnippet || '';
          mapped.snippetBefore = ex.snippetBefore || '';
          mapped.snippetAfter = ex.snippetAfter || '';

          // Shuffle options if needed
          const optOrder = optionOrders[origIdx];
          if (optOrder && ex.options) {
            mapped.options = optOrder.map((oi) => ex.options![oi]);
            // Map correctIndex to new position
            const origCorrect = ex.correctIndex ?? 0;
            mapped.correctIndex = optOrder.indexOf(origCorrect);
          } else {
            mapped.options = ex.options || [];
            mapped.correctIndex = ex.correctIndex ?? 0;
          }
        }

        return mapped;
      });

      return res.status(200).json({
        examId,
        title: exam.title,
        description: exam.description,
        exercises,
        maxSubmissions: exam.maxSubmissions,
      });
    }

    // ── ACTION: finalize — student finishes the exam permanently ──
    if (action === 'finalize') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      if (!examId) return res.status(400).json({ error: 'examId is required' });

      const result = await db.collection('exam_sessions').updateOne(
        { examId, userId: user.uid },
        {
          $set: {
            finalized: true,
            finalizedAt: new Date().toISOString(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Sessao nao encontrada' });
      }

      return res.status(200).json({ ok: true, finalized: true });
    }

    // ── ACTION: grades — check released grade ──
    if (action === 'grades') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      if (!examId) return res.status(400).json({ error: 'examId is required' });

      let exam;
      try {
        exam = await db.collection(EXAMS_COL).findOne({ _id: new ObjectId(examId) });
      } catch {
        return res.status(400).json({ error: 'Invalid examId' });
      }
      if (!exam) return res.status(404).json({ error: 'Prova nao encontrada' });
      if (!exam.gradesReleased) return res.status(403).json({ error: 'Notas ainda nao foram liberadas pelo professor.' });

      // Calculate grade
      const exercises = exam.exercises as unknown[];
      const totalQuestions = exercises.length;
      const submissions = await db.collection(SUBMISSIONS_COL)
        .find({ examId, userId: user.uid })
        .toArray();

      let correct = 0;
      for (let i = 0; i < totalQuestions; i++) {
        const best = submissions
          .filter((s) => s.exerciseIndex === i)
          .sort((a, b) => (b.passedTests as number) - (a.passedTests as number))[0];
        if (best?.allPassed) correct++;
      }
      const grade = Math.round((correct / Math.max(totalQuestions, 1)) * 10 * 100) / 100;

      return res.status(200).json({
        grade,
        correct,
        total: totalQuestions,
        examTitle: exam.title,
      });
    }

    // ── ACTION: submit — submit exercise answer ──
    if (action === 'submit') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      // originalIndex = the real index in the exam's exercise array (used when shuffled)
      const originalIndex = typeof body.originalIndex === 'number' ? body.originalIndex : -1;
      const exerciseIndex = originalIndex >= 0 ? originalIndex : (typeof body.exerciseIndex === 'number' ? body.exerciseIndex : -1);
      const code = typeof body.code === 'string' ? body.code : '';
      const passedTests = typeof body.passedTests === 'number' ? body.passedTests : 0;
      const totalTests = typeof body.totalTests === 'number' ? body.totalTests : 0;
      const allPassed = typeof body.allPassed === 'boolean' ? body.allPassed : false;

      if (!examId || exerciseIndex < 0 || !code) {
        return res.status(400).json({ error: 'examId, exerciseIndex, and code are required' });
      }

      // Check if student already finalized
      const session = await db.collection('exam_sessions').findOne({ examId, userId: user.uid });
      if (session?.finalized) {
        return res.status(403).json({ error: 'Prova ja foi encerrada. Nao e possivel submeter.' });
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
        // First try exam session name (typed by student before exam)
        const examSession = await db.collection('exam_sessions').findOne({ examId, userId: user.uid });
        if (examSession?.userName) {
          userName = examSession.userName as string;
        } else {
          // Fallback to profile
          const profile = await db.collection('profiles').findOne({ userId: user.uid });
          if (profile?.nome) userName = profile.nome as string;
        }
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
