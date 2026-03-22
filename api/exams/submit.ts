/**
 * Student API: submit exercise answer for an exam
 *
 * POST { examId, exerciseIndex, code, passedTests, totalTests, allPassed }
 *
 * Validates:
 * - User is authenticated
 * - Exam exists and is active
 * - Student hasn't exceeded max submissions for this exercise
 * - Exercise index is valid
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getMongoClient, DB_NAME, verifyToken, setCors, parseBody } from '../_db';

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

    const examId = typeof body.examId === 'string' ? body.examId : '';
    const exerciseIndex = typeof body.exerciseIndex === 'number' ? body.exerciseIndex : -1;
    const code = typeof body.code === 'string' ? body.code : '';
    const passedTests = typeof body.passedTests === 'number' ? body.passedTests : 0;
    const totalTests = typeof body.totalTests === 'number' ? body.totalTests : 0;
    const allPassed = typeof body.allPassed === 'boolean' ? body.allPassed : false;

    if (!examId || exerciseIndex < 0 || !code) {
      return res.status(400).json({ error: 'examId, exerciseIndex, and code are required' });
    }

    const client = getMongoClient();
    const db = client.db(DB_NAME);

    // Validate exam exists and is active
    let exam;
    try {
      exam = await db.collection(EXAMS_COL).findOne({ _id: new ObjectId(examId), active: true });
    } catch {
      return res.status(400).json({ error: 'Invalid examId' });
    }
    if (!exam) return res.status(404).json({ error: 'Prova não encontrada ou inativa' });

    // Validate exercise index
    const exercises = exam.exercises as unknown[];
    if (exerciseIndex >= exercises.length) {
      return res.status(400).json({ error: 'Exercício inválido' });
    }

    // Check submission limit
    const maxSubmissions = typeof exam.maxSubmissions === 'number' ? exam.maxSubmissions : 3;
    const existingCount = await db.collection(SUBMISSIONS_COL).countDocuments({
      examId,
      exerciseIndex,
      userId: user.uid,
    });

    if (existingCount >= maxSubmissions) {
      return res.status(429).json({
        error: `Limite de ${maxSubmissions} submissões atingido para este exercício`,
        submissionsUsed: existingCount,
        maxSubmissions,
      });
    }

    // Get user display name from Firebase or profile
    let userName = user.email;
    try {
      const profile = await db.collection('profiles').findOne({ userId: user.uid });
      if (profile?.nome) userName = profile.nome as string;
    } catch { /* use email as fallback */ }

    // Save submission
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
  } catch (err) {
    console.error('Exam submit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
