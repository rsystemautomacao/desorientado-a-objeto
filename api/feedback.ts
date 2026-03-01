import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';
const COLLECTION = 'feedback';

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
      console.error('Feedback API B64 parse failed:', msg);
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('Feedback API JSON parse failed.');
    throw e;
  }
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET: public summary of feedback per lesson (no auth)
    if (req.method === 'GET') {
      const client = getMongoClient();
      const col = client.db(DB_NAME).collection(COLLECTION);

      // Aggregate likes/dislikes per lessonId
      const pipeline = [
        { $group: {
          _id: '$lessonId',
          likes: { $sum: { $cond: [{ $eq: ['$vote', 'like'] }, 1, 0] } },
          dislikes: { $sum: { $cond: [{ $eq: ['$vote', 'dislike'] }, 1, 0] } },
        }},
      ];
      const results = await col.aggregate(pipeline).toArray();
      const summary: Record<string, { likes: number; dislikes: number }> = {};
      for (const r of results) {
        summary[r._id as string] = { likes: r.likes, dislikes: r.dislikes };
      }

      // If user is authenticated, also return their votes
      let myVotes: Record<string, string> = {};
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ') && authHeader.length > 60) {
        try {
          const app = getFirebaseApp();
          const decoded = await getAuth(app).verifyIdToken(authHeader.slice(7));
          const userFeedback = await col.find({ userId: decoded.uid }).toArray();
          for (const f of userFeedback) {
            myVotes[f.lessonId as string] = f.vote as string;
          }
        } catch { /* ignore auth errors for GET */ }
      }

      return res.status(200).json({ summary, myVotes });
    }

    // POST: submit or update vote (requires auth)
    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ') || authHeader.length < 60) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const app = getFirebaseApp();
      const decoded = await getAuth(app).verifyIdToken(authHeader.slice(7));
      const userId = decoded.uid;

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
      }

      const lessonId = body?.lessonId;
      const vote = body?.vote; // 'like' | 'dislike' | 'none' (remove vote)
      if (!lessonId || typeof lessonId !== 'string') {
        return res.status(400).json({ error: 'lessonId is required' });
      }
      if (!['like', 'dislike', 'none'].includes(vote)) {
        return res.status(400).json({ error: 'vote must be like, dislike, or none' });
      }

      const client = getMongoClient();
      const col = client.db(DB_NAME).collection(COLLECTION);

      if (vote === 'none') {
        await col.deleteOne({ userId, lessonId });
      } else {
        await col.updateOne(
          { userId, lessonId },
          { $set: { userId, lessonId, vote, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Feedback API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
