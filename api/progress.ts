import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import * as admin from 'firebase-admin';

const DB_NAME = 'desorientado';
const COLLECTION = 'progress';

export interface ProgressDoc {
  userId: string;
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
}

const DEFAULT_PROGRESS: ProgressDoc = {
  userId: '',
  completedLessons: [],
  quizResults: {},
  favorites: [],
};

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  const globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  return globalWithMongo._mongoClient;
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();
  let serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  if (serviceAccount.includes('\n') && !serviceAccount.trimStart().startsWith('{')) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON: valor parece ter quebras de linha. No Vercel use o JSON em UMA so linha.');
  }
  serviceAccount = serviceAccount.replace(/\\n/g, '\n');
  let parsed: admin.ServiceAccount;
  try {
    parsed = JSON.parse(serviceAccount) as admin.ServiceAccount;
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON: JSON invalido. Cole o JSON minificado em uma unica linha.');
    throw e;
  }
  if (!parsed.private_key || !parsed.client_email) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON: falta private_key ou client_email. O valor foi truncado? Use uma unica linha.');
  }
  const projectId = parsed.projectId ?? (parsed as { project_id?: string }).project_id;
  return admin.initializeApp({
    credential: admin.credential.cert(parsed),
    projectId: projectId ?? 'desorientado-a-objetos',
  });
}

async function getUserIdFromToken(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Progress API: missing or invalid Authorization header');
    return null;
  }
  const token = authHeader.slice(7);
  if (!token || token.length < 50) {
    console.error('Progress API: token too short or empty');
    return null;
  }
  try {
    const app = getFirebaseAdmin();
    const decoded = await app.auth().verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Progress API verifyIdToken failed:', msg);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProgressDoc>(COLLECTION);
      const doc = await col.findOne({ userId });
      const progress: ProgressDoc = doc
        ? {
            userId: doc.userId,
            completedLessons: Array.isArray(doc.completedLessons) ? doc.completedLessons : [],
            quizResults: doc.quizResults && typeof doc.quizResults === 'object' ? doc.quizResults : {},
            favorites: Array.isArray(doc.favorites) ? doc.favorites : [],
          }
        : { ...DEFAULT_PROGRESS, userId };
      return res.status(200).json(progress);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to load progress' });
    }
  }

  if (req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body) as ProgressDoc;
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const progress: ProgressDoc = {
      userId,
      completedLessons: Array.isArray(body.completedLessons) ? body.completedLessons : [],
      quizResults: body.quizResults && typeof body.quizResults === 'object' ? body.quizResults : {},
      favorites: Array.isArray(body.favorites) ? body.favorites : [],
    };
    try {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection<ProgressDoc>(COLLECTION);
      await col.updateOne(
        { userId },
        { $set: progress },
        { upsert: true }
      );
      return res.status(200).json(progress);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to save progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
