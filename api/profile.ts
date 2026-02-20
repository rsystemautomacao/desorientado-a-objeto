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
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`B64 decode/parse falhou (${b64Raw.length} chars): ${msg}`);
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Nenhuma service account configurada.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON parse falhou.');
    throw e;
  }
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();
  const raw = parseServiceAccountEnv();

  // Garante que o JSON tenha os campos no formato snake_case que
  // google-auth-library e node-forge esperam internamente.
  // Passar o objeto raw completo (com type, auth_uri, token_uri, etc.)
  // é mais robusto do que extrair apenas 3 campos.
  if (!raw.project_id && raw.projectId) raw.project_id = raw.projectId;
  if (!raw.private_key && raw.privateKey) raw.private_key = raw.privateKey;
  if (!raw.client_email && raw.clientEmail) raw.client_email = raw.clientEmail;

  const projectId = (raw.project_id ?? 'desorientado-a-objetos') as string;

  return admin.initializeApp({
    credential: admin.credential.cert(raw as admin.ServiceAccount),
    projectId,
  });
}

async function getUserIdFromToken(req: VercelRequest): Promise<{ userId: string } | { userId: null; code: string; detail?: string }> {
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
    return { userId: null, code: 'TOKEN_VERIFY_FAILED', detail: msg };
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
    const detail = 'detail' in result ? (result as { detail?: string }).detail : undefined;
    return res.status(401).json({ error: 'Unauthorized', code, detail });
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
