/**
 * Admin API: CRUD for exams (provas)
 *
 * GET    → list all exams
 * POST   → create a new exam
 * PUT    → update an exam (body.id required)
 * DELETE → delete an exam (?id=xxx)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getMongoClient, DB_NAME, requireAdmin, setCors, parseBody } from '../_db';
import crypto from 'crypto';

const COLLECTION = 'exams';

export interface ExamExercise {
  title: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string; visible: boolean }[];
}

export interface ExamDoc {
  title: string;
  description: string;
  exercises: ExamExercise[];
  accessCodes: string[];       // multiple codes, admin can regenerate
  maxSubmissions: number;      // max submissions per exercise per student
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function generateCode(): string {
  // 6-char alphanumeric uppercase, easy to read aloud
  return crypto.randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const admin = await requireAdmin(req);
    if (!admin) return res.status(403).json({ error: 'Forbidden' });

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection<ExamDoc>(COLLECTION);

    // ── GET: list exams OR get results for a specific exam ──
    if (req.method === 'GET') {
      // If ?results=examId, return submissions grouped by student
      const resultsFor = req.query.results;
      if (typeof resultsFor === 'string' && resultsFor.length >= 10) {
        const submissions = await client.db(DB_NAME)
          .collection('exam_submissions')
          .find({ examId: resultsFor })
          .sort({ submittedAt: -1 })
          .toArray();

        const byStudent: Record<string, {
          userId: string; userName: string; userEmail: string;
          submissions: Array<{ exerciseIndex: number; code: string; passedTests: number; totalTests: number; allPassed: boolean; attemptNumber: number; submittedAt: string }>;
        }> = {};

        for (const sub of submissions) {
          const uid = sub.userId as string;
          if (!byStudent[uid]) {
            byStudent[uid] = { userId: uid, userName: sub.userName as string, userEmail: sub.userEmail as string, submissions: [] };
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

        return res.status(200).json({ students: Object.values(byStudent), totalSubmissions: submissions.length });
      }

      // Default: list all exams
      const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
      const exams = docs.map((d) => ({
        id: String(d._id),
        title: d.title,
        description: d.description,
        exercises: d.exercises,
        accessCodes: d.accessCodes,
        maxSubmissions: d.maxSubmissions,
        active: d.active,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }));
      return res.status(200).json({ exams });
    }

    // ── POST: create exam ──
    if (req.method === 'POST') {
      const body = parseBody(req.body);
      if (!body) return res.status(400).json({ error: 'Invalid body' });

      // Check if this is a code-generation request
      if ((body as Record<string, unknown>).action === 'generate_code') {
        const examId = (body as Record<string, unknown>).examId;
        if (typeof examId !== 'string') return res.status(400).json({ error: 'examId required' });
        const newCode = generateCode();
        try {
          await col.updateOne(
            { _id: new ObjectId(examId) },
            { $push: { accessCodes: newCode }, $set: { updatedAt: new Date().toISOString() } },
          );
          return res.status(200).json({ code: newCode });
        } catch {
          return res.status(400).json({ error: 'Invalid examId' });
        }
      }

      const b = body as Record<string, unknown>;
      const title = typeof b.title === 'string' ? b.title.trim() : '';
      const description = typeof b.description === 'string' ? b.description.trim() : '';
      const maxSubmissions = typeof b.maxSubmissions === 'number' ? Math.max(1, Math.floor(b.maxSubmissions)) : 3;

      if (!title) return res.status(400).json({ error: 'Title is required' });

      const exercises: ExamExercise[] = [];
      if (Array.isArray(b.exercises)) {
        for (const ex of b.exercises) {
          if (!ex || typeof ex !== 'object') continue;
          const e = ex as Record<string, unknown>;
          exercises.push({
            title: typeof e.title === 'string' ? e.title.trim() : 'Sem título',
            description: typeof e.description === 'string' ? e.description.trim() : '',
            starterCode: typeof e.starterCode === 'string' ? e.starterCode : '',
            testCases: Array.isArray(e.testCases) ? (e.testCases as { input: string; expectedOutput: string; visible: boolean }[]).map((tc) => ({
              input: typeof tc.input === 'string' ? tc.input : '',
              expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
              visible: typeof tc.visible === 'boolean' ? tc.visible : true,
            })) : [],
          });
        }
      }

      const doc: ExamDoc = {
        title,
        description,
        exercises,
        accessCodes: [generateCode()],
        maxSubmissions,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await col.insertOne(doc);
      return res.status(201).json({ id: String(result.insertedId), ...doc });
    }

    // ── PUT: update exam ──
    if (req.method === 'PUT') {
      const body = parseBody(req.body) as Record<string, unknown> | null;
      if (!body || typeof body.id !== 'string') return res.status(400).json({ error: 'id required' });

      const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
      if (typeof body.title === 'string') updates.title = body.title.trim();
      if (typeof body.description === 'string') updates.description = body.description.trim();
      if (typeof body.active === 'boolean') updates.active = body.active;
      if (typeof body.maxSubmissions === 'number') updates.maxSubmissions = Math.max(1, Math.floor(body.maxSubmissions));
      if (Array.isArray(body.exercises)) {
        updates.exercises = (body.exercises as ExamExercise[]).map((ex) => ({
          title: typeof ex.title === 'string' ? ex.title.trim() : 'Sem título',
          description: typeof ex.description === 'string' ? ex.description.trim() : '',
          starterCode: typeof ex.starterCode === 'string' ? ex.starterCode : '',
          testCases: Array.isArray(ex.testCases) ? ex.testCases.map((tc) => ({
            input: typeof tc.input === 'string' ? tc.input : '',
            expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
            visible: typeof tc.visible === 'boolean' ? tc.visible : true,
          })) : [],
        }));
      }

      try {
        await col.updateOne({ _id: new ObjectId(body.id) }, { $set: updates });
        return res.status(200).json({ ok: true });
      } catch {
        return res.status(400).json({ error: 'Invalid id' });
      }
    }

    // ── DELETE: remove exam ──
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (typeof id !== 'string') return res.status(400).json({ error: 'id required' });
      try {
        await col.deleteOne({ _id: new ObjectId(id) });
        // Also clean up submissions
        await client.db(DB_NAME).collection('exam_submissions').deleteMany({ examId: id });
        return res.status(200).json({ ok: true });
      } catch {
        return res.status(400).json({ error: 'Invalid id' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin exams error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
