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
  maxQuestions: number | null;       // legacy/derived sum — kept for backward compat
  maxCodeQuestions: number | null;   // explicit code-question limit per student
  maxObjectiveQuestions: number | null; // explicit objective-question limit per student
  active: boolean;
  gradesReleased: boolean;
  answersReleased: boolean;        // students can see their own answers per question
  correctAnswersReleased: boolean; // students can see the correct answer per question
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

        // Build session lookup: userId → { accessedAt, finalizedAt, finalized, questionOrder }
        const sessionMap: Record<string, { accessedAt: string; finalizedAt: string | null; finalized: boolean; questionOrder: number[] | null }> = {};
        for (const s of sessions) {
          sessionMap[s.userId as string] = {
            accessedAt: (s.accessedAt as string) || '',
            finalizedAt: (s.finalizedAt as string) || null,
            finalized: s.finalized === true,
            questionOrder: Array.isArray(s.questionOrder) ? (s.questionOrder as number[]) : null,
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
          questionOrder: number[] | null;
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
              questionOrder: sess?.questionOrder ?? null,
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
              questionOrder: sess?.questionOrder ?? null,
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
              questionOrder: sess?.questionOrder ?? null,
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
              questionOrder: Array.isArray(s.questionOrder) ? (s.questionOrder as number[]) : null,
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
        maxQuestions: d.maxQuestions ?? null,
        maxCodeQuestions: d.maxCodeQuestions ?? null,
        maxObjectiveQuestions: d.maxObjectiveQuestions ?? null,
        active: d.active,
        gradesReleased: d.gradesReleased ?? false,
        answersReleased: d.answersReleased ?? false,
        correctAnswersReleased: d.correctAnswersReleased ?? false,
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

      // ── Bank: patch question titles (fix titles that revealed answers) ──
      if (actionVal === 'bank_patch_titles') {
        const patches: { oldTitle: string; newTitle: string }[] = [
          // Lógica — títulos que entregavam a resposta
          { oldTitle: 'Q4 — Símbolo de fluxograma: receber dados', newTitle: 'Q4 — Identificando símbolos de fluxograma (I)' },
          { oldTitle: 'Q9 — Símbolo de fluxograma: decisão', newTitle: 'Q9 — Identificando símbolos de fluxograma (II)' },
          { oldTitle: 'Q11 — Fluxograma com loop: saída esperada (contagem)', newTitle: 'Q11 — Analisando fluxograma com repetição (I)' },
          { oldTitle: 'Q16 — Nomes dos símbolos do fluxograma', newTitle: 'Q16 — Identificando a sequência de símbolos' },
          { oldTitle: 'Q17 — Fluxograma com loop: saída esperada (fixo)', newTitle: 'Q17 — Analisando fluxograma com repetição (II)' },
          // BI — títulos que entregavam a resposta
          { oldTitle: 'Q9 — Área que processa grandes volumes', newTitle: 'Q9 — Identificando áreas de dados e seus focos' },
          { oldTitle: 'Q19 — Função print() em Python', newTitle: 'Q19 — Exibindo valores no console em Python' },
          { oldTitle: 'Q14 — Importação do Pandas', newTitle: 'Q14 — Importando bibliotecas em Python' },
          { oldTitle: 'Q12 — Dicionário Python: atualizar e adicionar campo', newTitle: 'Q12 — Manipulando dicionários em Python' },
          { oldTitle: 'Q25 — Soma de lista em Python', newTitle: 'Q25 — Operações com listas em Python' },
        ];
        let updated = 0;
        for (const { oldTitle, newTitle } of patches) {
          const r = await bankCol.updateOne({ title: oldTitle }, { $set: { title: newTitle, updatedAt: new Date().toISOString() } });
          if (r.modifiedCount > 0) updated++;
        }
        return res.status(200).json({ ok: true, updated, total: patches.length });
      }

      // ── Bank: seed Lógica de Programação questions (one-time) ──
      if (actionVal === 'bank_seed_logica') {
        const existing = await bankCol.countDocuments({ subject: 'logica' });
        const force = (body as Record<string, unknown>).force === true;
        if (existing > 0 && !force) {
          return res.status(200).json({ ok: false, message: `Ja existem ${existing} questoes de Logica. Envie force:true para reinserir.` });
        }
        const now = new Date().toISOString();
        // Gabarito Versao A: indices 0=A, 1=B, 2=C, 3=D
        const gabarito = [0,2,0,3,2,1,2,2,2,1,1,0,1,1,1,1,1,2,1,0];
        const logicaQuestions = [
          { title: 'Q1 — Números reais e casas decimais', description: 'Valores reais são todos os números com casa após a virgula, até mesmo o 1,0?', type: 'true-false', options: ['Verdadeiro','Falso'], tags: ['Tipos de Dados','Numérico'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q2 — Linguagem de programação', description: 'Qual tipo de linguagem permite que um programador (humano) escreva instruções que, após processamento, são compreendidas e executadas por um computador?', type: 'multiple-choice', options: ['Linguagem natural','Linguagem de máquina','Linguagem de programação','Linguagem de libras'], tags: ['Linguagem de Programação'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q3 — Conceito de sistema', description: 'É correto afirmar que um sistema é um conjunto maior de componentes (programas, hardware e dados) trabalhando juntos para um objetivo maior.', type: 'true-false', options: ['Verdadeiro','Falso'], tags: ['Sistemas','Conceitos'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q4 — Identificando símbolos de fluxograma (I)', description: 'Qual a funcionalidade do símbolo do paralelogramo (entrada de dados) em um fluxograma?\n\n[Símbolo mostrado na prova: paralelogramo]', type: 'multiple-choice', options: ['Tomar uma decisão de verdadeiro ou falso','Mostrar informações para o usuário','Fazer cálculos','Receber dados do usuário'], tags: ['Fluxograma','Símbolos'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q5 — Identificando números inteiros', description: 'Considerando os tipos de dados básicos em programação, marque a opção em que todos os valores representam números inteiros.', type: 'multiple-choice', options: ['11.0, 37, -1.5, 1','1.0, -11, 15, 37','11, 37, -98, -15','1.0, 8.0, 10, 15'], tags: ['Tipos de Dados','Inteiro'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q6 — Tipos de dados primitivos', description: 'Segundo o material apresentado em sala, quais os tipos de dados primitivos?', type: 'multiple-choice', options: ['Textos, Literais e boleanos','Numéricos, Literais e Booleanos','Valores, Textos e Verdadeiros','Numéricos, Reais e boleanos'], tags: ['Tipos de Dados','Primitivos'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q7 — Categoria de dados em Lógica', description: 'Em lógica de programação, qual das seguintes categorias de dados estamos usando atualmente?', type: 'multiple-choice', options: ['Tipos Abstratos','Tipos de Variáveis','Tipos Primitivos','Tipos de Complexos'], tags: ['Tipos de Dados'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q8 — Etapas do desenvolvimento de um programa', description: 'Marque a alternativa correta. Quais são as etapas do desenvolvimento de um programa?', type: 'multiple-choice', options: ['Analise, Fluxograma, Programação','Descrição Narrativa, Fluxograma, Programação','Analise, Algoritmo, Codificação','Entrada, Processamento, Saida'], tags: ['Algoritmo','Desenvolvimento'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q9 — Identificando símbolos de fluxograma (II)', description: 'Qual a funcionalidade do símbolo do losango em um fluxograma?\n\n[Símbolo mostrado na prova: losango]', type: 'multiple-choice', options: ['Indicar o início ou o fim do algoritmo.','Realizar operações matemáticas ou lógicas.','Representar um ponto de decisão, geralmente com duas saídas (verdadeiro/falso, sim/não).','Exibir informações ou resultados para o usuário.'], tags: ['Fluxograma','Símbolos'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q10 — Definição de programa', description: 'Qual das seguintes opções melhor define o que é um programa em lógica de programação?', type: 'multiple-choice', options: ['É um conjunto de sistemas operacionais interligados.','É a codificação de um algoritmo em uma linguagem de programação.','É um conjunto de algoritmos','É uma sequência de instruções lógicas para resolver um problema.'], tags: ['Programa','Algoritmo'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q11 — Analisando fluxograma com repetição (I)', description: 'Considerando o fluxograma apresentado (loop que conta de 1 a 10 e exibe "Lançar" ao fim), qual será a sequência de valores exibidos na saída?\n\n[Fluxograma mostrado na prova: loop com variável contador]', type: 'multiple-choice', options: ['1 2 3 4 5 6 7 8 9 10 Lançar','Será um loop infinito.','Lançar','10 9 8 7 6 5 4 3 2 1 Lançar'], tags: ['Fluxograma','Loop','Algoritmo'], difficulty: 'dificil', codeSnippet: '' },
          { title: 'Q12 — Definição de algoritmo', description: 'O que melhor define um algoritmo em Lógica de Programação?', type: 'multiple-choice', options: ['É uma sequencia de passos logicos e finitos que visa atingir um objetivo definido','É a parte visual de um software, onde o usuário interage.','É um passo a passo, mesmo que não seja lógico.','É um programa de computador escrito em uma linguagem específica.'], tags: ['Algoritmo'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q13 — Operadores: ==, >, =, %, //', description: 'Marque a alternativa que represente a sequencia logica indicada abaixo:\n==, >, =, %, //', type: 'multiple-choice', options: ['Atribuição, Menor, Igualdade, Resto da divisão, Divisão Inteira','Igualdade, Maior, Atribuição, Resto da divisão, Divisão Inteira','Igualdade, Menor, Atribuição, Resto da divisão, Divisão Simples','Atribuição, Maior, Igualdade, Resto da divisão, Divisão Inteira'], tags: ['Operadores'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q14 — Software vs Hardware', description: 'É correto afirmar que software é tudo aquilo que eu consigo pegar, e hardware é o que eu consigo interagir, mas sem tocar fisicamente?', type: 'true-false', options: ['Verdadeiro','Falso'], tags: ['Hardware','Software'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q15 — Tipos de algoritmos', description: 'Quantos, e quais são os tipos de algoritmos que estudaremos no decorrer desse ano?', type: 'multiple-choice', options: ['2 - Fluxograma e Programação','3 - Descrição Narrativa, Fluxograma e Programação','4 - Descrição Narrativa, Portugol, Fluxograma e Programação','3 - Portugol, Fluxograma e Programação'], tags: ['Algoritmo','Tipos'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q16 — Identificando a sequência de símbolos', description: 'Qual os nomes em sequencia, dos símbolos representados abaixo?\n\n[Símbolos mostrados na prova: Oval, Paralelogramo, Losango, Retângulo, Seta]', type: 'multiple-choice', options: ['Inicio/Fim, Entrada de dados, Decisão, Saída de dados, Sentido de Fluxo','Inicio/Fim, Entrada de dados, Decisão, Processamento, Sentido de Fluxo','Inicio/Fim, Saída de dados, Decisão, Processamento, Sentido de Fluxo','Inicio/Fim, Entrada de dados, Decisão, Processamento, Seta'], tags: ['Fluxograma','Símbolos'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q17 — Analisando fluxograma com repetição (II)', description: 'Considerando o fluxograma apresentado (loop que exibe "1" repetidamente até contador = 10, sem incremento), qual será a sequência de valores exibidos na saída?\n\n[Fluxograma mostrado na prova]', type: 'multiple-choice', options: ['Será um loop infinito.','1 1 1 1 1 1 1 1 1 1 Fim','1 2 3 4 5 6 7 8 9 10 Fim','Fim'], tags: ['Fluxograma','Loop'], difficulty: 'dificil', codeSnippet: '' },
          { title: 'Q18 — Conceito de variável', description: 'Qual das seguintes opções descreve corretamente o conceito de variável em programação?', type: 'multiple-choice', options: ['Um tipo de dado específico, como número inteiro ou texto.','Uma sequência de instruções lógicas para resolver um problema.','Um espaço de memória nomeado/identificado, utilizado para armazenar um valor que pode ser alterado durante a execução do programa.','Um comando que realiza uma operação matemática.'], tags: ['Variáveis','Memória'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q19 — Finalidade do computador', description: 'A finalidade de um computador é receber, manipular e armazenar dados.', type: 'true-false', options: ['Falso','Verdadeiro'], tags: ['Computador','Conceitos'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q20 — Literais char e String', description: 'É correto afirmar que, na maioria das linguagens de programação, os literais de caracteres (char) e os literais de string (String) são os principais tipos de dados utilizados para representar texto?', type: 'true-false', options: ['Verdadeiro','Falso'], tags: ['Tipos de Dados','String','Char'], difficulty: 'facil', codeSnippet: '' },
        ];
        const docs = logicaQuestions.map((q, i) => ({
          type: q.type,
          title: q.title,
          description: q.description,
          starterCode: '',
          testCases: [],
          options: q.options,
          correctIndex: gabarito[i],
          codeSnippet: q.codeSnippet || '',
          snippetBefore: '',
          snippetAfter: '',
          explanation: '',
          tags: q.tags,
          difficulty: q.difficulty,
          subject: 'logica',
          createdAt: now,
          updatedAt: now,
        }));
        const result = await bankCol.insertMany(docs);
        return res.status(201).json({ ok: true, inserted: result.insertedCount });
      }

      // ── Bank: seed BI questions (one-time) ──
      if (actionVal === 'bank_seed_bi') {
        const existing = await bankCol.countDocuments({ subject: 'bi' });
        const force = (body as Record<string, unknown>).force === true;
        if (existing > 0 && !force) {
          return res.status(200).json({ ok: false, message: `Ja existem ${existing} questoes de BI. Envie force:true para reinserir.` });
        }
        const now = new Date().toISOString();
        const gabarito = [2,2,1,0,0,0,1,0,3,3,3,0,2,1,2,2,1,3,3,1,2,1,0,0,0,2,0,1,3];
        const biQuestions = [
          { title: 'Q1 — Uso de dados: Spotify', description: 'Empresas e aplicativos utilizam dados para diversas finalidades. Qual das alternativas abaixo MELHOR descreve o motivo pelo qual o Spotify utiliza dados, de acordo com o material?', type: 'multiple-choice', options: ['Para registrar o desempenho em disciplinas e identificar dificuldades educacionais.','Para analisar o tempo de visualização de vídeos e recomendar novos conteúdos.','Para criar playlists personalizadas com base nos hábitos de escuta do usuário.','Para identificar a localização do usuário e sugerir rotas de deslocamento.'], tags: ['Dados','Aplicações'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q2 — Ética como vantagem competitiva', description: 'O documento enfatiza que a ética é uma vantagem competitiva no mercado de trabalho em dados. Qual das afirmações abaixo melhor explica por que a ética é crucial para o futuro profissional, de acordo com o material?', type: 'multiple-choice', options: ['A ética é importante apenas para evitar problemas legais, não impactando diretamente o crescimento da carreira.','A ética garante que o profissional será promovido rapidamente, independentemente de suas habilidades técnicas.','A prática ética constrói confiança, abre portas profissionais, atrai empresas que valorizam a integridade e prepara para as exigências regulatórias do mercado.','Profissionais éticos são valorizados apenas em pequenas empresas, não em grandes corporações.'], tags: ['Ética','Carreira'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q3 — Indentação no Python', description: 'No contexto da "Sintaxe Básica do Python", a indentação é descrita como uma "característica fundamental". Qual das seguintes afirmações melhor descreve a importância e a consequência da indentação no Python, em contraste com outras linguagens de programação que utilizam chaves ou delimitadores explícitos?', type: 'multiple-choice', options: ['A indentação é utilizada para definir comentários de múltiplas linhas e não tem impacto na estrutura lógica do programa, que é determinada por palavras-chave como "begin" e "end".','A indentação é uma característica fundamental que define blocos de código, substituindo o uso de chaves ou outros delimitadores, e é obrigatória para a correta interpretação e execução do programa.','No Python, a indentação é usada exclusivamente para otimização de performance, permitindo ao interpretador pré-compilar seções de código identadas de forma mais eficiente.','A indentação no Python é opcional e serve apenas para melhorar a estética do código, sem afetar sua execução, similar ao uso de chaves em C++ para blocos de código.'], tags: ['Python','Sintaxe'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q4 — Características de Dados Estruturados', description: 'Qual das seguintes características NÃO pertence aos Dados Estruturados, conforme descrito no documento?', type: 'multiple-choice', options: ['Sem formato predefinido.','Formato definido e previsível.','Ideais para análises numéricas.','Armazenados em bancos de dados relacionais.'], tags: ['Dados Estruturados'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q5 — Distinção entre Dados e Informação', description: 'De acordo com o material apresentado, qual a principal distinção entre Dados e Informação?', type: 'multiple-choice', options: ['Dados são informações brutas e sem contexto, enquanto informação é o dado com contexto e significado.','Informação é um conjunto de dados não estruturados, enquanto dados são estruturados.','Dados são sempre numéricos, enquanto informação é sempre textual.','Não há diferença significativa; os termos são sinônimos e podem ser usados de forma intercambiável.'], tags: ['Dados','Informação'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q6 — Análise de dados sobre produtos', description: 'O documento ressalta a importância dos dados na tomada de decisões em diversos setores. Em um cenário empresarial, qual a principal vantagem de analisar dados sobre produtos, conforme mencionado?', type: 'multiple-choice', options: ['Para otimizar o estoque, identificar produtos com alta saída e pontos fracos.','Para entender a preferência dos clientes e oferecer sugestões personalizadas.','Apenas para gerar relatórios anuais para acionistas.','Exclusivamente para monitorar a concorrência e copiar suas estratégias.'], tags: ['Tomada de Decisão','Negócios'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q7 — Elementos da Data Science', description: 'Data Science é uma área multidisciplinar que combina tecnologia, estatística e conhecimento de negócio. Qual das opções abaixo NÃO representa um dos elementos cruciais da Data Science, conforme descrito no material?', type: 'multiple-choice', options: ['Análise estatística para encontrar padrões.','Capacidade de identificar falhas em sistemas de segurança.','Tecnologia e programação para processar dados.','Conhecimento do negócio para aplicar soluções.'], tags: ['Data Science'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q8 — Python vs Java vs JavaScript', description: 'Ao comparar o Python com outras linguagens como Java e JavaScript, o documento aponta distinções claras. Qual das seguintes opções sintetiza corretamente a principal vantagem do Python em relação ao Java e ao JavaScript, destacando seus nichos de mercado e características chave?', type: 'multiple-choice', options: ['Python é valorizado pela sua simplicidade e desenvolvimento rápido, sendo forte em backend, ciência de dados, IA e automação, enquanto Java é robusto para corporativo/mobile e JavaScript domina o frontend e Node.js.','A principal vantagem do Python é seu controle de memória de baixo nível, permitindo otimizações que Java e JavaScript não conseguem alcançar, o que o torna ideal para jogos e sistemas embarcados.','Python oferece uma performance superior em aplicações móveis e corporativas devido à sua máquina virtual otimizada, enquanto Java e JavaScript são restritos a desenvolvimento web.','Java é mais versátil para scripts de automação e análise de dados complexos, e JavaScript é a linguagem preferida para prototipagem rápida de alto nível, superando o Python em ambos.'], tags: ['Python','Linguagens'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q9 — Identificando áreas de dados e seus focos', description: 'No contexto das quatro áreas de dados (Data Science, Data Analytics, Big Data, Business Intelligence), qual delas tem como foco principal "processar grandes volumes" de dados?', type: 'multiple-choice', options: ['Business Intelligence','Data Analytics','Data Science','Big Data'], tags: ['Big Data','Áreas de Dados'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q10 — Python 2 vs Python 3', description: 'Considerando a evolução histórica do Python, qual foi o marco mais significativo que diferenciou o Python 3 de seu predecessor, Python 2, tornando-o a versão recomendada para todos os projetos atuais, especialmente no que tange à manipulação de strings e caracteres especiais?', type: 'multiple-choice', options: ['A migração do modelo de gerenciamento de memória do Python 2, baseado em contagem de referências, para um novo sistema de coleta de lixo no Python 3.','A introdução de classes abstratas e interfaces no Python 3, que não existiam no Python 2, otimizando a arquitetura de grandes sistemas.','A inclusão de uma máquina virtual Just-In-Time (JIT) no Python 3, que compilava o código em tempo de execução para otimizar a performance.','O tratamento robusto de Unicode por padrão e a manipulação consistente de strings e bytes, que solucionaram problemas de compatibilidade e internacionalização presentes no Python 2.'], tags: ['Python','Histórico'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q11 — Relação entre áreas de dados', description: 'O documento enfatiza que todas as áreas ligadas a dados se conectam e se complementam. Qual das afirmações abaixo melhor descreve a relação entre Data Science, Data Analytics, Big Data e Business Intelligence, conforme o slide "O que você precisa guardar desta aula"?', type: 'multiple-choice', options: ['Apenas Data Science e Big Data são essenciais, enquanto as outras são subconjuntos menos relevantes.','São áreas distintas e independentes, com pouca interseção em suas metodologias e objetivos.','São etapas sequenciais de um processo único, onde uma área sempre precede a outra.','Elas se complementam e formam um ecossistema de dados, cada uma com seu foco específico, mas trabalhando em conjunto.'], tags: ['Ecossistema de Dados'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q12 — Manipulando dicionários em Python', description: "Em um pipeline de BI, você recebe um dicionário representando um produto: `produto = {'nome': 'Notebook', 'preco': 4500, 'estoque': 10}`. Qual das alternativas apresenta a forma correta de atualizar o preço para 4800 e adicionar um novo campo chamado 'categoria'?", type: 'multiple-choice', options: ["produto['preco'] = 4800; produto['categoria'] = 'Eletrônicos'","produto.preco = 4800; produto.categoria = 'Eletrônicos'","set(produto['preco'] = 4800); set(produto['categoria'] = 'Eletrônicos')","produto.update('preco', 4800); produto.add('categoria', 'Eletrônicos')"], tags: ['Python','Dicionários'], difficulty: 'medio', codeSnippet: "produto = {'nome': 'Notebook', 'preco': 4500, 'estoque': 10}" },
          { title: 'Q13 — Era dos Dados', description: 'O documento afirma que "Vivemos na Era dos Dados". Qual a implicação dessa afirmação para o dia a dia das pessoas, conforme descrito?', type: 'multiple-choice', options: ['Dados são relevantes apenas para profissionais de tecnologia, não para o público em geral.','Apenas grandes corporações e governos têm acesso e utilizam dados.','Praticamente todas as ações digitais geram e consomem dados constantemente, muitas vezes sem percepção.','A maioria das pessoas não interage com dados em seu dia a dia.'], tags: ['Era dos Dados'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q14 — Importando bibliotecas em Python', description: 'Considere que você está importando a biblioteca Pandas para manipular um arquivo CSV em um projeto de BI. Qual é o comando correto e mais utilizado pela comunidade para realizar essa importação?', type: 'multiple-choice', options: ['load pandas as pd','import pandas as pd','require pandas','using pandas as pd'], tags: ['Python','Pandas'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q15 — Mensagem final sobre dados', description: 'Qual das seguintes afirmações sobre a importância de entender dados está alinhada com a "Mensagem final" apresentada no material?', type: 'multiple-choice', options: ['A principal importância dos dados reside na sua capacidade de gerar lucro para empresas, sem impacto social.','Entender dados é uma habilidade restrita a cientistas de dados e não tem relevância para outras profissões.','É essencial para compreender o funcionamento do mundo digital e dominar o futuro, além de ser valorizado no mercado de trabalho.','A importância dos dados é um conceito passageiro e logo será substituído por novas tecnologias.'], tags: ['Dados','Mercado de Trabalho'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q16 — List comprehension com filtro', description: 'Ao trabalhar com o processamento de grandes volumes de dados, muitas vezes precisamos filtrar informações. Qual é a saída do seguinte código?\n\nlista = [10, 25, 40, 55]\nresultado = [x for x in lista if x > 30]\nprint(resultado)', type: 'multiple-choice', options: ['[True, True, False, False]','[10, 25]','[40, 55]','[30, 40, 55]'], tags: ['Python','List Comprehension'], difficulty: 'medio', codeSnippet: 'lista = [10, 25, 40, 55]\nresultado = [x for x in lista if x > 30]\nprint(resultado)' },
          { title: 'Q17 — Criador do Python', description: 'A linguagem Python foi criada por Guido van Rossum.', type: 'true-false', options: ['Falso','Verdadeiro'], tags: ['Python','Histórico'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q18 — Papel dos dados nas redes sociais', description: 'De acordo com o material, qual o papel dos dados nas redes sociais como Instagram, TikTok e YouTube?', type: 'multiple-choice', options: ['Principalmente para monetizar o conteúdo através de vendas diretas de produtos.','Exclusivamente para garantir a segurança dos dados pessoais dos usuários.','Apenas para registrar a quantidade de usuários ativos diariamente.','Para entender o comportamento do usuário, personalizar o feed e mostrar anúncios relevantes.'], tags: ['Dados','Redes Sociais'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q19 — Exibindo valores no console em Python', description: 'No contexto da análise de dados com Python, qual das seguintes funções é utilizada para exibir uma mensagem ou o valor de uma variável no console?', type: 'multiple-choice', options: ['display()','show()','output()','print()'], tags: ['Python','Funções'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q20 — Dados Não Estruturados: complexidade', description: 'No contexto de Dados Não Estruturados, o que os torna mais complexos de analisar em comparação com dados estruturados?', type: 'multiple-choice', options: ['Sua incapacidade de serem armazenados em qualquer sistema.','A ausência de um formato fixo e padrão de organização.','A necessidade de serem convertidos em dados estruturados antes de qualquer análise.','Eles são exclusivamente compostos por números, dificultando a interpretação textual.'], tags: ['Dados Não Estruturados'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q21 — Exemplo de dado estruturado educacional', description: 'Qual dos seguintes exemplos representa um DADO ESTRUTURADO no contexto educacional, de acordo com o material?', type: 'multiple-choice', options: ['Uma gravação em áudio de uma aula.','Um ensaio escrito livremente por um aluno.','O boletim de notas de um aluno, com disciplinas e médias em colunas definidas.','Uma foto da turma de formatura em alta resolução.'], tags: ['Dados Estruturados','Educação'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q22 — Bibliotecas para reconhecimento de imagem', description: 'O documento lista diversas "Bibliotecas Python Mais Populares" essenciais para diferentes áreas. Se um desenvolvedor estivesse focado em criar um sistema de recomendação complexo que envolvesse reconhecimento de imagem, qual combinação de bibliotecas seria mais apropriada para iniciar o projeto, considerando as informações fornecidas?', type: 'multiple-choice', options: ['NumPy e Matplotlib, devido à sua capacidade de manipulação numérica e visualização de dados, respectivamente.','TensorFlow e Scikit-learn, que são frameworks robustos para aprendizado de máquina, redes neurais e ML clássico, essenciais para sistemas de recomendação e reconhecimento de imagem.','Django e Requests, pois são ideais para desenvolvimento web e comunicação com APIs externas.','Pandas e Requests, excelentes para análise e manipulação de dados tabulares e requisições HTTP.'], tags: ['Python','Machine Learning','Bibliotecas'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q23 — Objetivo da atividade prática', description: 'O documento sugere uma atividade prática para analisar dados do cotidiano digital. Qual o principal objetivo dessa atividade?', type: 'multiple-choice', options: ['Identificar padrões e entender como seus próprios dados revelam informações sobre você.','Aprender a programar algoritmos complexos de análise de dados.','Desenvolver um novo aplicativo que colete dados de forma mais eficiente.','Comparar seus hábitos digitais com os de outras pessoas para determinar quem é mais produtivo.'], tags: ['Dados','Análise Prática'], difficulty: 'facil', codeSnippet: '' },
          { title: 'Q24 — O que NÃO é característica do BI', description: 'O Business Intelligence (BI) é fundamental para a tomada de decisões estratégicas nas empresas. Qual das seguintes atividades NÃO é uma característica principal do trabalho de BI, conforme o material?', type: 'multiple-choice', options: ['Criação de modelos preditivos complexos para o futuro.','Utilização de indicadores de desempenho para análise.','Criação de dashboards interativos para monitoramento.','Geração de relatórios automáticos sobre o desempenho.'], tags: ['Business Intelligence'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q25 — Operações com listas em Python', description: 'Dada a lista de faturamento semanal `vendas = [1200, 2500, 1800, 3100]`, qual comando Python retornaria corretamente a soma total deste faturamento para um relatório de BI?', type: 'multiple-choice', options: ['sum(vendas)','vendas.total()','aggregate(vendas)','vendas.sum()'], tags: ['Python','Funções'], difficulty: 'facil', codeSnippet: 'vendas = [1200, 2500, 1800, 3100]' },
          { title: 'Q26 — Atividades do Cientista de Dados', description: 'O documento descreve o papel do Cientista de Dados como um "explorador do mundo digital". Qual das alternativas abaixo NÃO representa uma de suas principais atividades?', type: 'multiple-choice', options: ['Uso de inteligência artificial e machine learning.','Análise profunda de grandes volumes de dados.','Desenvolvimento de dashboards e painéis gerenciais.','Criação de algoritmos e modelos preditivos.'], tags: ['Data Science','Carreira'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q27 — LGPD: dados sensíveis', description: 'A Lei Geral de Proteção de Dados (LGPD) do Brasil protege informações que podem identificar um indivíduo. Qual das opções a seguir é considerada uma informação sensível e requer proteção especial, conforme o documento?', type: 'multiple-choice', options: ['Dados de saúde e orientação sexual.','Nome completo e CPF.','Perfis em redes sociais e e-mail.','Histórico de navegação e compras online.'], tags: ['LGPD','Privacidade'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q28 — O que Data Analytics NÃO faz', description: 'O material apresenta um exemplo prático de Data Analytics no qual um coordenador escolar analisa o desempenho da turma. Qual das ações listadas abaixo representa o que o Data Analytics NÃO faz nesse cenário, de acordo com o texto?', type: 'multiple-choice', options: ['Gerar relatórios e gráficos para apresentar os resultados.','Prever as próximas notas dos alunos com base no histórico de desempenho.','Identificar as disciplinas onde a turma teve mais dificuldade.','Calcular as médias da turma em cada matéria.'], tags: ['Data Analytics'], difficulty: 'medio', codeSnippet: '' },
          { title: 'Q29 — Características do Python', description: 'Python é considerado uma linguagem:', type: 'multiple-choice', options: ['Exclusiva para jogos','Usada apenas em bancos','Antiga e sem uso atual','Fácil de aprender e com sintaxe simples','Difícil de aprender e com sintaxe complexa'], tags: ['Python'], difficulty: 'facil', codeSnippet: '' },
        ];
        const docs = biQuestions.map((q, i) => ({
          type: q.type,
          title: q.title,
          description: q.description,
          starterCode: '',
          testCases: [],
          options: q.options,
          correctIndex: gabarito[i],
          codeSnippet: q.codeSnippet || '',
          snippetBefore: '',
          snippetAfter: '',
          explanation: '',
          tags: q.tags,
          difficulty: q.difficulty,
          subject: 'bi',
          createdAt: now,
          updatedAt: now,
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
      // Explicit per-type pool limits (new system)
      const rawCodeQ = body.maxCodeQuestions;
      const rawObjQ  = body.maxObjectiveQuestions;
      const maxCodeQuestions      = typeof rawCodeQ === 'number' && rawCodeQ > 0 ? Math.floor(rawCodeQ) : null;
      const maxObjectiveQuestions = typeof rawObjQ  === 'number' && rawObjQ  > 0 ? Math.floor(rawObjQ)  : null;
      // Legacy derived sum kept for backward compat
      const rawMaxQ = body.maxQuestions;
      const maxQuestions = maxCodeQuestions !== null || maxObjectiveQuestions !== null
        ? (maxCodeQuestions ?? 0) + (maxObjectiveQuestions ?? 0) || null
        : (typeof rawMaxQ === 'number' && rawMaxQ > 0 ? Math.floor(rawMaxQ) : null);

      const doc: ExamDoc = {
        title,
        description,
        exercises,
        accessCodes: [generateCode()],
        maxSubmissions,
        maxQuestions,
        maxCodeQuestions,
        maxObjectiveQuestions,
        active: true,
        gradesReleased: false,
        answersReleased: false,
        correctAnswersReleased: false,
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
      if (typeof body.answersReleased === 'boolean') updates.answersReleased = body.answersReleased;
      if (typeof body.correctAnswersReleased === 'boolean') updates.correctAnswersReleased = body.correctAnswersReleased;
      if (typeof body.shuffleQuestions === 'boolean') updates.shuffleQuestions = body.shuffleQuestions;
      if (typeof body.shuffleOptions === 'boolean') updates.shuffleOptions = body.shuffleOptions;
      if (typeof body.scoringMode === 'string' && ['equal', 'code-weighted', 'manual'].includes(body.scoringMode)) updates.scoringMode = body.scoringMode;
      if (typeof body.maxSubmissions === 'number') updates.maxSubmissions = Math.max(1, Math.floor(body.maxSubmissions));
      // Explicit per-type limits (new system)
      if ('maxCodeQuestions' in body) updates.maxCodeQuestions = typeof body.maxCodeQuestions === 'number' && (body.maxCodeQuestions as number) > 0 ? Math.floor(body.maxCodeQuestions as number) : null;
      if ('maxObjectiveQuestions' in body) updates.maxObjectiveQuestions = typeof body.maxObjectiveQuestions === 'number' && (body.maxObjectiveQuestions as number) > 0 ? Math.floor(body.maxObjectiveQuestions as number) : null;
      // Legacy derived sum
      if ('maxQuestions' in body) updates.maxQuestions = typeof body.maxQuestions === 'number' && (body.maxQuestions as number) > 0 ? Math.floor(body.maxQuestions as number) : null;
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
