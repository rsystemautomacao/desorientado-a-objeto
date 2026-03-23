/**
 * Admin API: CRUD for exams (provas)
 *
 * GET    → list all exams
 * POST   → create a new exam
 * PUT    → update an exam (body.id required)
 * DELETE → delete an exam (?id=xxx)
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';
import { randomBytes } from 'crypto';

const DB_NAME = 'desorientado';
const COLLECTION = 'exams';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rsautomacao2000@gmail.com';

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
    } catch (e) { console.error('Exams API B64 parse failed.'); throw e; }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try { return JSON.parse(raw) as Record<string, unknown>; }
  catch (e) { console.error('Exams API JSON parse failed.'); throw e; }
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

async function requireAdmin(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) return false;
  try {
    const app = getFirebaseApp();
    const decoded = await getAuth(app).verifyIdToken(authHeader.slice(7));
    return (decoded.email || '').trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  } catch { return false; }
}

function parseBody<T = Record<string, unknown>>(body: unknown): T | null {
  if (!body) return null;
  if (typeof body === 'string') { try { return JSON.parse(body) as T; } catch { return null; } }
  if (typeof body === 'object') return body as T;
  return null;
}

export interface ExamExercise {
  type?: string; // 'code' | 'multiple-choice' | 'true-false' | 'fill-blank'
  title: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string; visible: boolean }[];
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;
  snippetBefore?: string;
  snippetAfter?: string;
  explanation?: string;
  points?: number;              // point value for this question
}

export interface ExamDoc {
  title: string;
  description: string;
  exercises: ExamExercise[];
  accessCodes: string[];       // multiple codes, admin can regenerate
  maxSubmissions: number;      // max submissions per exercise per student
  active: boolean;
  gradesReleased: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  scoringMode: string;         // 'equal' | 'code-weighted' | 'manual'
  subject: string;             // 'poo' | 'bi' | 'logica'
  createdAt: string;
  updatedAt: string;
}

function generateCode(): string {
  return randomBytes(4).toString('hex').slice(0, 6).toUpperCase();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const isAdmin = await requireAdmin(req);
    if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const client = getMongoClient();
    const col = client.db(DB_NAME).collection<ExamDoc>(COLLECTION);
    const bankCol = client.db(DB_NAME).collection('question_bank');

    // ── GET: list exams, results, OR question bank ──
    if (req.method === 'GET') {
      // ?bank=1 → list question bank
      if (req.query.bank === '1') {
        const questions = await bankCol.find({}).sort({ updatedAt: -1 }).toArray();
        return res.status(200).json({
          questions: questions.map((q) => ({
            id: String(q._id),
            type: q.type || 'code',
            title: q.title,
            description: q.description,
            starterCode: q.starterCode,
            testCases: q.testCases,
            options: q.options || [],
            correctIndex: q.correctIndex ?? 0,
            codeSnippet: q.codeSnippet || '',
            snippetBefore: q.snippetBefore || '',
            snippetAfter: q.snippetAfter || '',
            explanation: q.explanation || '',
            tags: q.tags || [],
            difficulty: q.difficulty || '',
            subject: q.subject || 'poo',
            createdAt: q.createdAt,
            updatedAt: q.updatedAt,
          })),
        });
      }

      // If ?results=examId, return submissions grouped by student + tab-switch data
      const resultsFor = req.query.results;
      if (typeof resultsFor === 'string' && resultsFor.length >= 10) {
        const [submissions, tabSwitches, cheatAttempts, sessions] = await Promise.all([
          client.db(DB_NAME)
            .collection('exam_submissions')
            .find({ examId: resultsFor })
            .sort({ submittedAt: -1 })
            .toArray(),
          client.db(DB_NAME)
            .collection('exam_tab_switches')
            .find({ examId: resultsFor })
            .toArray(),
          client.db(DB_NAME)
            .collection('exam_cheat_attempts')
            .find({ examId: resultsFor })
            .toArray(),
          client.db(DB_NAME)
            .collection('exam_sessions')
            .find({ examId: resultsFor })
            .toArray(),
        ]);

        // Build session lookup: userId → { accessedAt, finalizedAt, finalized }
        const sessionMap: Record<string, { accessedAt: string; finalizedAt: string | null; finalized: boolean }> = {};
        for (const s of sessions) {
          sessionMap[s.userId as string] = {
            accessedAt: (s.accessedAt as string) || '',
            finalizedAt: (s.finalizedAt as string) || null,
            finalized: s.finalized === true,
          };
        }

        // Build tab-switch lookup: userId → { totalSwitches, lastSwitchAt }
        const tabSwitchMap: Record<string, { total: number; lastAt: string }> = {};
        for (const ts of tabSwitches) {
          tabSwitchMap[ts.userId as string] = {
            total: (ts.totalSwitches as number) || 0,
            lastAt: (ts.lastSwitchAt as string) || '',
          };
        }

        // Build cheat-attempt lookup: userId → { total, events }
        const cheatMap: Record<string, { total: number; events: Array<{ type: string; timestamp: string }> }> = {};
        for (const ca of cheatAttempts) {
          cheatMap[ca.userId as string] = {
            total: (ca.totalAttempts as number) || 0,
            events: (ca.events as Array<{ type: string; timestamp: string }>) || [],
          };
        }

        const byStudent: Record<string, {
          userId: string; userName: string; userEmail: string;
          tabSwitches: number; lastTabSwitch: string;
          cheatAttempts: number; cheatEvents: Array<{ type: string; timestamp: string }>;
          accessedAt: string; finalizedAt: string | null; finalized: boolean;
          submissions: Array<{ exerciseIndex: number; code: string; passedTests: number; totalTests: number; allPassed: boolean; attemptNumber: number; submittedAt: string }>;
        }> = {};

        for (const sub of submissions) {
          const uid = sub.userId as string;
          if (!byStudent[uid]) {
            const tsData = tabSwitchMap[uid];
            const caData = cheatMap[uid];
            const sess = sessionMap[uid];
            byStudent[uid] = {
              userId: uid, userName: sub.userName as string, userEmail: sub.userEmail as string,
              tabSwitches: tsData?.total ?? 0, lastTabSwitch: tsData?.lastAt ?? '',
              cheatAttempts: caData?.total ?? 0, cheatEvents: caData?.events ?? [],
              accessedAt: sess?.accessedAt ?? '', finalizedAt: sess?.finalizedAt ?? null, finalized: sess?.finalized ?? false,
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

        // Also include students who only have tab-switches, cheat attempts, or sessions but no submissions
        for (const ts of tabSwitches) {
          const uid = ts.userId as string;
          if (!byStudent[uid]) {
            const caData = cheatMap[uid];
            const sess = sessionMap[uid];
            byStudent[uid] = {
              userId: uid, userName: (ts.userEmail as string) || uid, userEmail: (ts.userEmail as string) || '',
              tabSwitches: (ts.totalSwitches as number) || 0, lastTabSwitch: (ts.lastSwitchAt as string) || '',
              cheatAttempts: caData?.total ?? 0, cheatEvents: caData?.events ?? [],
              accessedAt: sess?.accessedAt ?? '', finalizedAt: sess?.finalizedAt ?? null, finalized: sess?.finalized ?? false,
              submissions: [],
            };
          }
        }
        for (const ca of cheatAttempts) {
          const uid = ca.userId as string;
          if (!byStudent[uid]) {
            const tsData = tabSwitchMap[uid];
            const sess = sessionMap[uid];
            byStudent[uid] = {
              userId: uid, userName: (ca.userEmail as string) || uid, userEmail: (ca.userEmail as string) || '',
              tabSwitches: tsData?.total ?? 0, lastTabSwitch: tsData?.lastAt ?? '',
              cheatAttempts: (ca.totalAttempts as number) || 0, cheatEvents: (ca.events as Array<{ type: string; timestamp: string }>) || [],
              accessedAt: sess?.accessedAt ?? '', finalizedAt: sess?.finalizedAt ?? null, finalized: sess?.finalized ?? false,
              submissions: [],
            };
          }
        }
        // Include students who accessed but didn't submit anything
        for (const s of sessions) {
          const uid = s.userId as string;
          if (!byStudent[uid]) {
            const tsData = tabSwitchMap[uid];
            const caData = cheatMap[uid];
            byStudent[uid] = {
              userId: uid, userName: (s.userName as string) || (s.userEmail as string) || uid, userEmail: (s.userEmail as string) || '',
              tabSwitches: tsData?.total ?? 0, lastTabSwitch: tsData?.lastAt ?? '',
              cheatAttempts: caData?.total ?? 0, cheatEvents: caData?.events ?? [],
              accessedAt: (s.accessedAt as string) || '', finalizedAt: (s.finalizedAt as string) || null, finalized: s.finalized === true,
              submissions: [],
            };
          }
        }

        return res.status(200).json({ students: Object.values(byStudent), totalSubmissions: submissions.length });
      }

      // Default: list all exams
      const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
      const validSubjects = ['poo', 'bi', 'logica'];
      const exams = docs.map((d) => ({
        id: String(d._id),
        title: d.title,
        description: d.description,
        exercises: d.exercises,
        accessCodes: d.accessCodes,
        maxSubmissions: d.maxSubmissions,
        active: d.active,
        gradesReleased: d.gradesReleased ?? false,
        shuffleQuestions: d.shuffleQuestions ?? false,
        shuffleOptions: d.shuffleOptions ?? false,
        scoringMode: d.scoringMode || 'equal',
        subject: typeof d.subject === 'string' && validSubjects.includes(d.subject) ? d.subject : 'poo',
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      }));
      return res.status(200).json({ exams });
    }

    // ── POST: create exam ──
    if (req.method === 'POST') {
      const body = parseBody(req.body);
      if (!body) return res.status(400).json({ error: 'Invalid body' });

      const actionVal = (body as Record<string, unknown>).action;

      // ── Bank: save question ──
      if (actionVal === 'bank_save') {
        const b = body as Record<string, unknown>;
        const title = typeof b.title === 'string' ? b.title.trim() : '';
        if (!title) return res.status(400).json({ error: 'title required' });

        const validTypes = ['code', 'multiple-choice', 'true-false', 'fill-blank'];
        const question: Record<string, unknown> = {
          type: typeof b.type === 'string' && validTypes.includes(b.type) ? b.type : 'code',
          title,
          description: typeof b.description === 'string' ? b.description.trim() : '',
          starterCode: typeof b.starterCode === 'string' ? b.starterCode : '',
          testCases: Array.isArray(b.testCases) ? (b.testCases as { input: string; expectedOutput: string; visible: boolean }[]).map((tc) => ({
            input: typeof tc.input === 'string' ? tc.input : '',
            expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
            visible: typeof tc.visible === 'boolean' ? tc.visible : true,
          })) : [],
          options: Array.isArray(b.options) ? (b.options as string[]).map((o) => typeof o === 'string' ? o : '') : [],
          correctIndex: typeof b.correctIndex === 'number' ? b.correctIndex : 0,
          codeSnippet: typeof b.codeSnippet === 'string' ? b.codeSnippet : '',
          snippetBefore: typeof b.snippetBefore === 'string' ? b.snippetBefore : '',
          snippetAfter: typeof b.snippetAfter === 'string' ? b.snippetAfter : '',
          explanation: typeof b.explanation === 'string' ? b.explanation : '',
          tags: Array.isArray(b.tags) ? (b.tags as string[]).filter((t) => typeof t === 'string') : [],
          difficulty: typeof b.difficulty === 'string' ? b.difficulty : '',
          subject: typeof b.subject === 'string' && ['poo', 'bi', 'logica'].includes(b.subject) ? b.subject : 'poo',
          updatedAt: new Date().toISOString(),
        };

        // Update existing or insert new
        if (typeof b.id === 'string' && b.id.length >= 10) {
          try {
            await bankCol.updateOne({ _id: new ObjectId(b.id) }, { $set: question });
            return res.status(200).json({ ok: true, id: b.id });
          } catch { return res.status(400).json({ error: 'Invalid id' }); }
        }

        const result = await bankCol.insertOne({ ...question, createdAt: new Date().toISOString() });
        return res.status(201).json({ ok: true, id: String(result.insertedId) });
      }

      // ── Bank: bulk import (multiple questions at once) ──
      if (actionVal === 'bank_import') {
        const items = (body as Record<string, unknown>).questions;
        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'questions array required' });

        const validTypes = ['code', 'multiple-choice', 'true-false', 'fill-blank'];
        const docs = items.map((item: Record<string, unknown>) => ({
          type: typeof item.type === 'string' && validTypes.includes(item.type) ? item.type : 'code',
          title: typeof item.title === 'string' ? item.title.trim() : 'Sem titulo',
          description: typeof item.description === 'string' ? item.description.trim() : '',
          starterCode: typeof item.starterCode === 'string' ? item.starterCode : '',
          testCases: Array.isArray(item.testCases) ? (item.testCases as { input: string; expectedOutput: string; visible: boolean }[]).map((tc) => ({
            input: typeof tc.input === 'string' ? tc.input : '',
            expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
            visible: typeof tc.visible === 'boolean' ? tc.visible : true,
          })) : [],
          options: Array.isArray(item.options) ? (item.options as string[]).map((o) => typeof o === 'string' ? o : '') : [],
          correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
          codeSnippet: typeof item.codeSnippet === 'string' ? item.codeSnippet : '',
          snippetBefore: typeof item.snippetBefore === 'string' ? item.snippetBefore : '',
          snippetAfter: typeof item.snippetAfter === 'string' ? item.snippetAfter : '',
          explanation: typeof item.explanation === 'string' ? item.explanation : '',
          tags: Array.isArray(item.tags) ? (item.tags as string[]).filter((t) => typeof t === 'string') : [],
          difficulty: typeof item.difficulty === 'string' ? item.difficulty : '',
          subject: typeof item.subject === 'string' && ['poo', 'bi', 'logica'].includes(item.subject) ? item.subject : 'poo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const result = await bankCol.insertMany(docs);
        return res.status(201).json({ ok: true, inserted: result.insertedCount });
      }

      // ── Bank: delete question ──
      if (actionVal === 'bank_delete') {
        const id = (body as Record<string, unknown>).id;
        if (typeof id !== 'string') return res.status(400).json({ error: 'id required' });
        try {
          await bankCol.deleteOne({ _id: new ObjectId(id) });
          return res.status(200).json({ ok: true });
        } catch { return res.status(400).json({ error: 'Invalid id' }); }
      }

      // Check if this is a code-generation request
      // ── Reset student session (allow re-take) ──
      if (actionVal === 'reset_session') {
        const b = body as Record<string, unknown>;
        const examId = typeof b.examId === 'string' ? b.examId : '';
        const userId = typeof b.userId === 'string' ? b.userId : '';
        if (!examId || !userId) return res.status(400).json({ error: 'examId and userId required' });

        // Remove session (so student can access again)
        await client.db(DB_NAME).collection('exam_sessions').deleteMany({ examId, userId });
        // Remove all submissions for this student on this exam
        await client.db(DB_NAME).collection('exam_submissions').deleteMany({ examId, userId });
        // Remove tab-switch and cheat records
        await client.db(DB_NAME).collection('exam_tab_switches').deleteMany({ examId, userId });
        await client.db(DB_NAME).collection('exam_cheat_attempts').deleteMany({ examId, userId });

        return res.status(200).json({ ok: true, message: 'Sessao resetada. O aluno pode refazer a prova.' });
      }

      if (actionVal === 'generate_code') {
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
          const exDoc: ExamExercise = {
            type: typeof e.type === 'string' ? e.type : 'code',
            title: typeof e.title === 'string' ? e.title.trim() : 'Sem título',
            description: typeof e.description === 'string' ? e.description.trim() : '',
            starterCode: typeof e.starterCode === 'string' ? e.starterCode : '',
            testCases: Array.isArray(e.testCases) ? (e.testCases as { input: string; expectedOutput: string; visible: boolean }[]).map((tc) => ({
              input: typeof tc.input === 'string' ? tc.input : '',
              expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
              visible: typeof tc.visible === 'boolean' ? tc.visible : true,
            })) : [],
          };
          // Add objective question fields
          if (Array.isArray(e.options)) exDoc.options = (e.options as string[]).map(o => typeof o === 'string' ? o : '');
          if (typeof e.correctIndex === 'number') exDoc.correctIndex = e.correctIndex;
          if (typeof e.codeSnippet === 'string') exDoc.codeSnippet = e.codeSnippet;
          if (typeof e.snippetBefore === 'string') exDoc.snippetBefore = e.snippetBefore;
          if (typeof e.snippetAfter === 'string') exDoc.snippetAfter = e.snippetAfter;
          if (typeof e.explanation === 'string') exDoc.explanation = e.explanation;
          if (typeof e.points === 'number') exDoc.points = Math.max(0, e.points);
          exercises.push(exDoc);
        }
      }

      const validSubjectsCreate = ['poo', 'bi', 'logica'];
      const doc: ExamDoc = {
        title,
        description,
        exercises,
        accessCodes: [generateCode()],
        maxSubmissions,
        active: true,
        gradesReleased: false,
        shuffleQuestions: body.shuffleQuestions === true,
        shuffleOptions: body.shuffleOptions === true,
        scoringMode: typeof body.scoringMode === 'string' && ['equal', 'code-weighted', 'manual'].includes(body.scoringMode) ? body.scoringMode : 'equal',
        subject: typeof b.subject === 'string' && validSubjectsCreate.includes(b.subject) ? b.subject : 'poo',
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
      if (typeof body.gradesReleased === 'boolean') updates.gradesReleased = body.gradesReleased;
      if (typeof body.shuffleQuestions === 'boolean') updates.shuffleQuestions = body.shuffleQuestions;
      if (typeof body.shuffleOptions === 'boolean') updates.shuffleOptions = body.shuffleOptions;
      if (typeof body.scoringMode === 'string' && ['equal', 'code-weighted', 'manual'].includes(body.scoringMode)) updates.scoringMode = body.scoringMode;
      if (typeof body.maxSubmissions === 'number') updates.maxSubmissions = Math.max(1, Math.floor(body.maxSubmissions));
      if (typeof body.subject === 'string' && ['poo', 'bi', 'logica'].includes(body.subject)) updates.subject = body.subject;
      if (Array.isArray(body.exercises)) {
        updates.exercises = (body.exercises as ExamExercise[]).map((ex) => {
          const exDoc: ExamExercise = {
            type: typeof ex.type === 'string' ? ex.type : 'code',
            title: typeof ex.title === 'string' ? ex.title.trim() : 'Sem título',
            description: typeof ex.description === 'string' ? ex.description.trim() : '',
            starterCode: typeof ex.starterCode === 'string' ? ex.starterCode : '',
            testCases: Array.isArray(ex.testCases) ? ex.testCases.map((tc) => ({
              input: typeof tc.input === 'string' ? tc.input : '',
              expectedOutput: typeof tc.expectedOutput === 'string' ? tc.expectedOutput : '',
              visible: typeof tc.visible === 'boolean' ? tc.visible : true,
            })) : [],
          };
          if (Array.isArray(ex.options)) exDoc.options = ex.options.map(o => typeof o === 'string' ? o : '');
          if (typeof ex.correctIndex === 'number') exDoc.correctIndex = ex.correctIndex;
          if (typeof ex.codeSnippet === 'string') exDoc.codeSnippet = ex.codeSnippet;
          if (typeof ex.snippetBefore === 'string') exDoc.snippetBefore = ex.snippetBefore;
          if (typeof ex.snippetAfter === 'string') exDoc.snippetAfter = ex.snippetAfter;
          if (typeof ex.explanation === 'string') exDoc.explanation = ex.explanation;
          if (typeof ex.points === 'number') exDoc.points = Math.max(0, ex.points);
          return exDoc;
        });
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
        await client.db(DB_NAME).collection('exam_tab_switches').deleteMany({ examId: id });
        await client.db(DB_NAME).collection('exam_cheat_attempts').deleteMany({ examId: id });
        await client.db(DB_NAME).collection('exam_sessions').deleteMany({ examId: id });
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
