/**
 * Student API: validate exam access code and return exam data
 *
 * POST { code: "ABC123" } → returns exam info (without test case answers for hidden tests)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMongoClient, DB_NAME, verifyToken, setCors, parseBody } from '../_db';

const COLLECTION = 'exams';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await verifyToken(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const body = parseBody(req.body) as Record<string, unknown> | null;
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
    if (!code || code.length < 4) return res.status(400).json({ error: 'Código inválido' });

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection(COLLECTION);

    // Find active exam that has this access code
    const exam = await col.findOne({
      active: true,
      accessCodes: code,
    });

    if (!exam) {
      return res.status(404).json({ error: 'Código inválido ou prova inativa' });
    }

    // Get student's existing submissions for this exam to track counts
    const submissions = await client.db(DB_NAME).collection('exam_submissions')
      .find({ examId: String(exam._id), userId: user.uid })
      .toArray();

    // Build submission counts per exercise index
    const submissionCounts: Record<number, number> = {};
    for (const sub of submissions) {
      const idx = sub.exerciseIndex as number;
      submissionCounts[idx] = (submissionCounts[idx] || 0) + 1;
    }

    // Return exam data — strip hidden test case expected outputs for security
    const exercises = (exam.exercises as Array<{
      title: string;
      description: string;
      starterCode: string;
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
  } catch (err) {
    console.error('Exam access error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
