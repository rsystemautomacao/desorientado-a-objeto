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

      // maxQuestions: how many questions each student sees (null = all)
      const maxQ = typeof exam.maxQuestions === 'number' && exam.maxQuestions > 0 && exam.maxQuestions < rawExercises.length
        ? exam.maxQuestions as number
        : null;

      // Check if session already has a shuffle/selection order (reloads keep the same questions)
      const sessionDoc = existingSession || await db.collection('exam_sessions').findOne({ examId, userId: user.uid });

      if (sessionDoc?.questionOrder && Array.isArray(sessionDoc.questionOrder)) {
        // Reuse stored order — already accounts for selection + shuffle
        questionOrder = sessionDoc.questionOrder as number[];
        optionOrders = (sessionDoc.optionOrders || {}) as Record<number, number[]>;
      } else {
        const seed = `${examId}-${user.uid}`;

        // Step 1: If maxQuestions is set, randomly SELECT which questions this student gets.
        //         When the exam has mixed types (code + objective), selection is proportional
        //         so every student always receives the same ratio of each type.
        if (maxQ) {
          const allIndices = Array.from({ length: rawExercises.length }, (_, i) => i);

          // Group indices by question type
          const byType: Record<string, number[]> = {};
          for (const i of allIndices) {
            const t = (rawExercises[i].type as string | undefined) || 'code';
            if (!byType[t]) byType[t] = [];
            byType[t].push(i);
          }

          const types = Object.keys(byType);

          if (types.length <= 1) {
            // Single type — original behaviour: shuffle all, take first maxQ
            questionOrder = seededShuffle(allIndices, seed + '-selection').slice(0, maxQ);
          } else {
            // Multiple types: proportional selection (floor + largest-remainder distribution)
            const total = rawExercises.length;
            const slots = types.map((t) => {
              const exact = (byType[t].length / total) * maxQ;
              return { t, pick: Math.floor(exact), frac: exact - Math.floor(exact) };
            });
            // Distribute any remaining slots to types with the largest fractional part
            let rem = maxQ - slots.reduce((s, e) => s + e.pick, 0);
            slots.sort((a, b) => b.frac - a.frac);
            for (let i = 0; i < rem; i++) slots[i % slots.length].pick++;

            let selected: number[] = [];
            for (const { t, pick } of slots) {
              const shuffled = seededShuffle(byType[t], seed + '-selection-' + t);
              selected = selected.concat(shuffled.slice(0, Math.min(pick, byType[t].length)));
            }
            questionOrder = selected;
          }
        }

        // Step 2: Shuffle the order of the selected (or all) questions
        if (shouldShuffleQ) {
          questionOrder = seededShuffle(questionOrder, seed + '-questions');
        }

        // Step 3: Shuffle options for each selected question
        if (shouldShuffleOpts) {
          for (const origIdx of questionOrder) {
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
        if (maxQ || shouldShuffleQ || shouldShuffleOpts) {
          await db.collection('exam_sessions').updateOne(
            { examId, userId: user.uid },
            { $set: { questionOrder, optionOrders } },
          );
        }
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

        // Add objective question fields (NEVER send correctIndex to student!)
        if (qType !== 'code') {
          mapped.codeSnippet = ex.codeSnippet || '';
          mapped.snippetBefore = ex.snippetBefore || '';
          mapped.snippetAfter = ex.snippetAfter || '';

          // Shuffle options if needed
          const optOrder = optionOrders[origIdx];
          if (optOrder && ex.options) {
            mapped.options = optOrder.map((oi) => ex.options![oi]);
          } else {
            mapped.options = ex.options || [];
          }
          // correctIndex is NOT sent — answer evaluation happens server-side only
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

      // Calculate grade using points
      const exercises = exam.exercises as Array<{ title?: string; description?: string; type?: string; points?: number; options?: string[]; correctIndex?: number }>;
      const [submissions, gradeSession] = await Promise.all([
        db.collection(SUBMISSIONS_COL).find({ examId, userId: user.uid }).toArray(),
        db.collection('exam_sessions').findOne({ examId, userId: user.uid }),
      ]);

      // Use the student's actual question subset if pool was active
      const questionOrder: number[] | null = Array.isArray(gradeSession?.questionOrder) ? (gradeSession.questionOrder as number[]) : null;
      const optionOrders: Record<string, number[]> = (gradeSession?.optionOrders as Record<string, number[]>) ?? {};
      const indices = questionOrder ?? exercises.map((_, i) => i);
      const n = indices.length;

      let earned = 0;
      let totalPoints = 0;
      let correct = 0;
      for (const idx of indices) {
        const pts = exercises[idx]?.points ?? (10 / Math.max(n, 1));
        totalPoints += pts;
        const best = submissions
          .filter((s) => s.exerciseIndex === idx)
          .sort((a, b) => (b.passedTests as number) - (a.passedTests as number))[0];
        if (best?.allPassed) { correct++; earned += pts; }
      }
      const grade = totalPoints > 0 ? Math.round((earned / totalPoints) * 10 * 100) / 100 : 0;

      // Build per-question breakdown when answers or correct answers are released
      const answersReleased = exam.answersReleased ?? false;
      const correctAnswersReleased = exam.correctAnswersReleased ?? false;
      let questions: Array<{
        index: number;
        title: string;
        type: string;
        correct: boolean;
        studentAnswer?: string;
        correctAnswer?: string;
      }> | undefined;

      if (answersReleased || correctAnswersReleased) {
        questions = indices.map((idx) => {
          const ex = exercises[idx];
          const best = submissions
            .filter((s) => s.exerciseIndex === idx)
            .sort((a, b) => (b.passedTests as number) - (a.passedTests as number))[0];
          const isCorrect = best?.allPassed ?? false;
          const qType = ex?.type ?? 'code';
          const qTitle = ex?.title || ex?.description || `Questão ${idx + 1}`;

          let studentAnswer: string | undefined;
          let correctAnswer: string | undefined;

          if (answersReleased && best) {
            const code: string = best.code ?? '';
            if (qType !== 'code' && code.startsWith('[Resposta objetiva]')) {
              // Extract the selected option text from the stored string
              const match = code.match(/\((.+)\)$/);
              studentAnswer = match ? match[1] : code;
            } else if (qType === 'code') {
              studentAnswer = code;
            } else {
              studentAnswer = code;
            }
          }

          if (correctAnswersReleased && qType !== 'code') {
            // For objective questions, determine the correct option text
            const opts: string[] = ex?.options ?? [];
            const origCorrect = ex?.correctIndex ?? 0;
            // The correct option text (index in original array)
            correctAnswer = opts[origCorrect] ?? `Opção ${origCorrect + 1}`;
          } else if (correctAnswersReleased && qType === 'code') {
            correctAnswer = 'Todos os testes devem passar';
          }

          return {
            index: idx + 1,
            title: qTitle,
            type: qType,
            correct: isCorrect,
            ...(answersReleased ? { studentAnswer } : {}),
            ...(correctAnswersReleased ? { correctAnswer } : {}),
          };
        });
      }

      return res.status(200).json({
        grade,
        earned: Math.round(earned * 100) / 100,
        totalPoints: Math.round(totalPoints * 100) / 100,
        correct,
        total: n,
        examTitle: exam.title,
        answersReleased,
        correctAnswersReleased,
        ...(questions ? { questions } : {}),
      });
    }

    // ── ACTION: submit — submit exercise answer ──
    if (action === 'submit') {
      const examId = typeof body.examId === 'string' ? body.examId : '';
      // originalIndex = the real index in the exam's exercise array (used when shuffled)
      const originalIndex = typeof body.originalIndex === 'number' ? body.originalIndex : -1;
      const exerciseIndex = originalIndex >= 0 ? originalIndex : (typeof body.exerciseIndex === 'number' ? body.exerciseIndex : -1);
      const code = typeof body.code === 'string' ? body.code : '';
      let passedTests = typeof body.passedTests === 'number' ? body.passedTests : 0;
      let totalTests = typeof body.totalTests === 'number' ? body.totalTests : 0;
      let allPassed = typeof body.allPassed === 'boolean' ? body.allPassed : false;
      const selectedIndex = typeof body.selectedIndex === 'number' ? body.selectedIndex : -1;

      if (!examId || exerciseIndex < 0) {
        return res.status(400).json({ error: 'examId and exerciseIndex are required' });
      }

      // Check if student already finalized (atomic check)
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

      const exercises = exam.exercises as Array<{
        type?: string; options?: string[]; correctIndex?: number;
        testCases?: unknown[];
      }>;
      if (exerciseIndex < 0 || exerciseIndex >= exercises.length) {
        return res.status(400).json({ error: 'Exercicio invalido' });
      }

      const exerciseData = exercises[exerciseIndex];
      const qType = exerciseData.type || 'code';

      // For objective questions: enforce 1 submission limit server-side
      // For code questions: use exam's maxSubmissions
      const maxSubs = qType !== 'code' ? 1 : (typeof exam.maxSubmissions === 'number' ? exam.maxSubmissions : 3);
      const existingCount = await db.collection(SUBMISSIONS_COL).countDocuments({
        examId, exerciseIndex, userId: user.uid,
      });

      if (existingCount >= maxSubs) {
        return res.status(429).json({
          error: qType !== 'code'
            ? 'Questao objetiva permite apenas 1 resposta.'
            : `Limite de ${maxSubs} submissoes atingido para este exercicio`,
          submissionsUsed: existingCount,
          maxSubmissions: maxSubs,
        });
      }

      // For objective questions: evaluate correctness SERVER-SIDE
      let submittedCode = code;
      if (qType !== 'code' && selectedIndex >= 0) {
        // Determine correct index considering shuffle
        let serverCorrectIndex = exerciseData.correctIndex ?? 0;

        // If options were shuffled, map the student's selectedIndex back
        const optOrder = session?.optionOrders?.[String(exerciseIndex)] as number[] | undefined;
        if (optOrder && optOrder.length > 0) {
          // Student selected index N in the shuffled order
          // optOrder[N] gives the original option index
          // We need to check if optOrder[selectedIndex] === originalCorrectIndex
          const originalSelectedOption = selectedIndex < optOrder.length ? optOrder[selectedIndex] : -1;
          allPassed = originalSelectedOption === serverCorrectIndex;
        } else {
          allPassed = selectedIndex === serverCorrectIndex;
        }
        passedTests = allPassed ? 1 : 0;
        totalTests = 1;

        const opts = exerciseData.options || [];
        submittedCode = `[Resposta objetiva] Opcao selecionada: ${selectedIndex} (${opts[selectedIndex] || '?'})`;
      } else if (qType === 'code' && !code) {
        return res.status(400).json({ error: 'code is required for code exercises' });
      }

      let userName = user.email;
      try {
        if (session?.userName) {
          userName = session.userName as string;
        } else {
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
        code: submittedCode,
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
        submissionsRemaining: maxSubs - submission.attemptNumber,
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
