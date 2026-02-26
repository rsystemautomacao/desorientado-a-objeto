export interface Progress {
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastDate: string; // ISO date string 'YYYY-MM-DD'
  };
}

const DEFAULT: Progress = {
  completedLessons: [],
  quizResults: {},
  favorites: [],
  xp: 0,
  streak: { current: 0, longest: 0, lastDate: '' },
};

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  return typeof base === 'string' && base.length > 0 ? base.replace(/\/$/, '') : '';
}

export async function getProgressFromApi(token: string): Promise<Progress> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) return { ...DEFAULT };
  const data = await res.json();
  return {
    completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
    quizResults: data.quizResults && typeof data.quizResults === 'object' ? data.quizResults : {},
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
    xp: typeof data.xp === 'number' ? data.xp : 0,
    streak: data.streak && typeof data.streak === 'object'
      ? {
          current: typeof data.streak.current === 'number' ? data.streak.current : 0,
          longest: typeof data.streak.longest === 'number' ? data.streak.longest : 0,
          lastDate: typeof data.streak.lastDate === 'string' ? data.streak.lastDate : '',
        }
      : { current: 0, longest: 0, lastDate: '' },
  };
}

// ── XP Rewards ──
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_GREAT: 30,    // ≥ 80%
  QUIZ_GOOD: 20,     // ≥ 60%
  QUIZ_ATTEMPTED: 10, // < 60%
} as const;

export function getQuizXp(score: number, total: number): number {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct >= 0.8) return XP_REWARDS.QUIZ_GREAT;
  if (pct >= 0.6) return XP_REWARDS.QUIZ_GOOD;
  return XP_REWARDS.QUIZ_ATTEMPTED;
}

// ── Streak Logic ──
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

export function updateStreak(streak: Progress['streak']): Progress['streak'] {
  const today = todayStr();
  if (streak.lastDate === today) return streak; // already counted today

  const gap = streak.lastDate ? daysBetween(streak.lastDate, today) : 999;
  const newCurrent = gap === 1 ? streak.current + 1 : 1;
  const newLongest = Math.max(streak.longest, newCurrent);

  return { current: newCurrent, longest: newLongest, lastDate: today };
}

// ── XP Level ──
export function getLevel(xp: number): { level: number; title: string; xpForNext: number; xpInLevel: number } {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  const titles = ['Iniciante', 'Aprendiz', 'Estudante', 'Praticante', 'Competente', 'Habilidoso', 'Experiente', 'Avancado', 'Expert', 'Mestre', 'Lenda'];
  let level = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) { level = i; break; }
  }
  const xpForNext = level < thresholds.length - 1 ? thresholds[level + 1] - thresholds[level] : 0;
  const xpInLevel = xp - thresholds[level];
  return { level, title: titles[level] ?? 'Lenda', xpForNext, xpInLevel };
}

export async function saveProgressToApi(token: string, progress: Progress): Promise<void> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/progress`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress),
  });
  if (!res.ok) throw new Error('Failed to save progress');
}
