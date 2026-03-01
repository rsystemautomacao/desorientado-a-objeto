import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

const DB_NAME = 'desorientado';

interface ProgressDoc {
  userId: string;
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
}

interface ProfileDoc {
  userId: string;
  nome: string;
}

// Same XP formulas as client-side (progressStore.ts)
const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_GREAT: 30,
  QUIZ_GOOD: 20,
  QUIZ_ATTEMPTED: 10,
};

function calcXp(doc: ProgressDoc): number {
  let xp = 0;
  const lessons = Array.isArray(doc.completedLessons) ? doc.completedLessons : [];
  xp += lessons.length * XP_REWARDS.LESSON_COMPLETE;

  const quizzes = doc.quizResults && typeof doc.quizResults === 'object' ? doc.quizResults : {};
  for (const r of Object.values(quizzes)) {
    if (!r || typeof r.score !== 'number' || typeof r.total !== 'number' || r.total === 0) continue;
    const pct = r.score / r.total;
    if (pct >= 0.8) xp += XP_REWARDS.QUIZ_GREAT;
    else if (pct >= 0.6) xp += XP_REWARDS.QUIZ_GOOD;
    else xp += XP_REWARDS.QUIZ_ATTEMPTED;
  }
  return xp;
}

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
      console.error('Leaderboard API B64 parse failed:', msg);
      throw e;
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') throw new Error('Firebase service account not configured.');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    console.error('Leaderboard API JSON parse failed.');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Optional auth — used to highlight current user's position
    let currentUserId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ') && authHeader.length > 60) {
      try {
        const app = getFirebaseApp();
        const decoded = await getAuth(app).verifyIdToken(authHeader.slice(7));
        currentUserId = decoded.uid;
      } catch {
        // Auth is optional — ignore errors
      }
    }

    const client = getMongoClient();
    const db = client.db(DB_NAME);
    const [progressList, profilesList] = await Promise.all([
      db.collection<ProgressDoc>('progress').find({}).toArray(),
      db.collection<ProfileDoc>('profiles').find({}).toArray(),
    ]);

    const profileByUserId = new Map<string, ProfileDoc>();
    for (const p of profilesList) {
      if (p.userId) profileByUserId.set(p.userId, p);
    }

    const ranked = progressList
      .map((doc) => {
        const profile = profileByUserId.get(doc.userId);
        const nome = profile?.nome?.trim() || '';
        // Privacy: show only first name
        const firstName = nome.split(/\s+/)[0] || 'Aluno';
        const xp = calcXp(doc);
        const lessonsCount = Array.isArray(doc.completedLessons) ? doc.completedLessons.length : 0;
        const quizzes = doc.quizResults && typeof doc.quizResults === 'object' ? doc.quizResults : {};
        const quizCount = Object.keys(quizzes).length;
        return {
          userId: doc.userId,
          name: firstName,
          xp,
          lessonsCount,
          quizCount,
        };
      })
      .filter((e) => e.xp > 0) // Only show students with activity
      .sort((a, b) => b.xp - a.xp);

    // Assign ranks (handle ties)
    const leaderboard = ranked.map((entry, i) => {
      const rank = i > 0 && ranked[i - 1].xp === entry.xp
        ? (ranked as Array<typeof entry & { rank: number }>)[i - 1]?.rank ?? i + 1
        : i + 1;
      return { ...entry, rank };
    });

    // Find current user's position
    let myRank: (typeof leaderboard)[number] | null = null;
    if (currentUserId) {
      const found = leaderboard.find((e) => e.userId === currentUserId);
      if (found) myRank = found;
    }

    // Return top 20 + current user's entry (strip userId for privacy)
    const top = leaderboard.slice(0, 20).map(({ userId: _uid, ...rest }) => rest);
    const me = myRank ? { rank: myRank.rank, name: myRank.name, xp: myRank.xp, lessonsCount: myRank.lessonsCount, quizCount: myRank.quizCount } : null;

    return res.status(200).json({ leaderboard: top, me, totalStudents: leaderboard.length });
  } catch (err) {
    console.error('Leaderboard API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
