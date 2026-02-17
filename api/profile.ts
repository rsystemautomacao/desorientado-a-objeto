import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import * as admin from 'firebase-admin';

const DB_NAME = 'desorientado';
const COLLECTION = 'profiles';

export interface ProfileDoc {
  userId: string;
  nome: string;
  tipo: 'EM' | 'Superior';
  curso: string;
  serieOuSemestre: string;
  observacoes: string;
  updatedAt: string;
}

const DEFAULT_PROFILE: Omit<ProfileDoc, 'userId'> = {
  nome: '',
  tipo: 'Superior',
  curso: '',
  serieOuSemestre: '',
  observacoes: '',
  updatedAt: '',
};

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  const g = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!g._mongoClient) g._mongoClient = new MongoClient(uri);
  return g._mongoClient;
}

function getB64String(): string | null {
  const p1 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART1;
  const p2 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART2;
  const p3 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART3;
  const p4 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART4;
  const parts = [p1, p2, p3, p4].filter((p): p is string => typeof p === 'string' && p.length > 0);
  if (parts.length >= 3 && parts.reduce((s, p) => s + p.length, 0) > 3500) {
    return parts.join('').replace(/\s/g, '');
  }
  if (p1 && p2 && p3 && typeof p1 === 'string' && typeof p2 === 'string' && typeof p3 === 'string' && p1.length > 100 && p2.length > 10 && p3.length > 10) {
    return (p1 + p2 + p3).replace(/\s/g, '');
  }
  if (p1 && p2 && typeof p1 === 'string' && typeof p2 === 'string' && p1.length > 100 && p2.length > 10) {
    return (p1 + p2).replace(/\s/g, '');
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (one && typeof one === 'string' && one.length > 3500) return one.replace(/\s/g, '');
  if (one && typeof one === 'string' && one.length > 100) return one.replace(/\s/g, '');
  return null;
}

function parseServiceAccountEnv(): admin.ServiceAccount {
  const b64Raw = getB64String();
  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      const normalized = json.replace(/\\n/g, '\n');
      return JSON.parse(normalized) as admin.ServiceAccount;
    } catch (e) {
      console.error('FIREBASE_SERVICE_ACCOUNT_B64: decode/parse falhou.');
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_SERVICE_ACCOUNT_B64 is not set');
  const normalized = raw.replace(/\\n/g, '\n');
  try {
    return JSON.parse(normalized) as admin.ServiceAccount;
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON invalido. Use FIREBASE_SERVICE_ACCOUNT_B64 (script vercel-env-service-account-b64.js).');
    throw e;
  }
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();
  const parsed = parseServiceAccountEnv();
  const withSnake = parsed as admin.ServiceAccount & { private_key?: string; client_email?: string };
  if (!withSnake.private_key || !withSnake.client_email) {
    console.error('Chave incompleta. Use FIREBASE_SERVICE_ACCOUNT_B64.');
  }
  const projectId = parsed.projectId ?? (parsed as { project_id?: string }).project_id;
  return admin.initializeApp({
    credential: admin.credential.cert(parsed),
    projectId: projectId ?? 'desorientado-a-objetos',
  });
}

async function getUserIdFromToken(req: VercelRequest): Promise<{ userId: string } | { userId: null; code: string }> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Profile API: missing or invalid Authorization header');
    return { userId: null, code: 'NO_HEADER' };
  }
  const token = authHeader.slice(7);
  if (!token || token.length < 50) {
    console.error('Profile API: token too short or empty');
    return { userId: null, code: 'NO_HEADER' };
  }
  try {
    const app = getFirebaseAdmin();
    const decoded = await app.auth().verifyIdToken(token);
    return { userId: decoded.uid };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Profile API verifyIdToken failed:', msg);
    return { userId: null, code: 'TOKEN_VERIFY_FAILED' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const result = await getUserIdFromToken(req);
  if (!result.userId) {
    const code = 'code' in result ? result.code : 'TOKEN_INVALID';
    return res.status(401).json({ error: 'Unauthorized', code });
  }
  const userId = result.userId;

  if (req.method === 'GET') {
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProfileDoc>(COLLECTION);
      const doc = await col.findOne({ userId });
      const profile: ProfileDoc = doc
        ? {
            userId: doc.userId,
            nome: typeof doc.nome === 'string' ? doc.nome : '',
            tipo: doc.tipo === 'EM' || doc.tipo === 'Superior' ? doc.tipo : 'Superior',
            curso: typeof doc.curso === 'string' ? doc.curso : '',
            serieOuSemestre: typeof doc.serieOuSemestre === 'string' ? doc.serieOuSemestre : '',
            observacoes: typeof doc.observacoes === 'string' ? doc.observacoes : '',
            updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : '',
          }
        : { ...DEFAULT_PROFILE, userId };
      return res.status(200).json(profile);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to load profile' });
    }
  }

  if (req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const profile: ProfileDoc = {
      userId,
      nome: typeof body.nome === 'string' ? body.nome.slice(0, 200) : '',
      tipo: body.tipo === 'EM' || body.tipo === 'Superior' ? body.tipo : 'Superior',
      curso: typeof body.curso === 'string' ? body.curso.slice(0, 200) : '',
      serieOuSemestre: typeof body.serieOuSemestre === 'string' ? body.serieOuSemestre.slice(0, 100) : '',
      observacoes: typeof body.observacoes === 'string' ? body.observacoes.slice(0, 2000) : '',
      updatedAt: new Date().toISOString(),
    };
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProfileDoc>(COLLECTION);
      await col.updateOne({ userId }, { $set: profile }, { upsert: true });
      return res.status(200).json(profile);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to save profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
