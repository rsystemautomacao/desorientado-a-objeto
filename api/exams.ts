/**
 * Student exam API (consolidated):
 *
 * POST { action: "access", code: "ABC123" }  → validate code, return exam data
 * POST { action: "submit", examId, exerciseIndex, code, passedTests, totalTests, allPassed } → submit answer
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getMongoClient, DB_NAME, verifyToken, setCors, parseBody } from './_db';

const EXAMS_COL = 'exams';
const SUBMISSIONS_COL = 'exam_submissions';

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
  setCors(res, 'POST, OPTIONS');
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

    return res.status(400).json({ error: 'Invalid action. Use "access" or "submit".' });
  } catch (err) {
    console.error('Exams API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
