/**
 * Admin API: view exam submissions/results
 *
 * GET ?examId=xxx → returns all submissions for an exam, grouped by student
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMongoClient, DB_NAME, requireAdmin, setCors } from '../_db';

const SUBMISSIONS_COL = 'exam_submissions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const admin = await requireAdmin(req);
    if (!admin) return res.status(403).json({ error: 'Forbidden' });

    const examId = req.query.examId;
    if (typeof examId !== 'string' || examId.length < 10) {
      return res.status(400).json({ error: 'examId required' });
    }

    const client = getMongoClient();
    const submissions = await client.db(DB_NAME)
      .collection(SUBMISSIONS_COL)
      .find({ examId })
      .sort({ submittedAt: -1 })
      .toArray();

    // Group by student
    const byStudent: Record<string, {
      userId: string;
      userName: string;
      userEmail: string;
      submissions: Array<{
        exerciseIndex: number;
        code: string;
        passedTests: number;
        totalTests: number;
        allPassed: boolean;
        attemptNumber: number;
        submittedAt: string;
      }>;
    }> = {};

    for (const sub of submissions) {
      const uid = sub.userId as string;
      if (!byStudent[uid]) {
        byStudent[uid] = {
          userId: uid,
          userName: sub.userName as string,
          userEmail: sub.userEmail as string,
          submissions: [],
        };
      }
      byStudent[uid].submissions.push({
        exerciseIndex: sub.exerciseIndex as number,
        code: sub.code as string,
        passedTests: sub.passedTests as number,
        totalTests: sub.totalTests as number,
        allPassed: sub.allPassed as boolean,
        attemptNumber: sub.attemptNumber as number,
        submittedAt: sub.submittedAt as string,
      });
    }

    return res.status(200).json({
      students: Object.values(byStudent),
      totalSubmissions: submissions.length,
    });
  } catch (err) {
    console.error('Exam results error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
