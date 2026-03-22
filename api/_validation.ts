/**
 * Server-side validation for progress data.
 *
 * All valid IDs and limits are hard-coded here so that the server
 * never trusts client-supplied values blindly.
 */

// ── Valid Lesson IDs (from src/data/modules.ts) ─────────────────────
export const VALID_LESSON_IDS = new Set([
  // Module 1 — Fundamentos
  'm1-intro', 'm1-variables', 'm1-operators', 'm1-ifelse', 'm1-switch',
  'm1-loops', 'm1-arrays', 'm1-matrices', 'm1-functions',
  // Module 2 — Intermediário
  'm2-io', 'm2-strings', 'm2-debug', 'm2-collections', 'm2-packages',
  // Module 3 — POO
  'm3-whatispoo', 'm3-classes', 'm3-attributes', 'm3-constructors',
  'm3-encapsulation', 'm3-static', 'm3-this', 'm3-inheritance',
  'm3-polymorphism', 'm3-abstraction', 'm3-interfaces', 'm3-composition',
  'm3-overloading', 'm3-access', 'm3-exceptions', 'm3-solid', 'm3-project',
]);

// ── Quiz questions per lesson (from src/data/quizData.ts) ───────────
// The QuizComponent picks at most 5 random questions, so valid total ≤ 5.
const QUIZ_MAX_TOTAL = 5;

// Lessons that actually have quizzes (all 31 lessons have quizzes)
export const LESSONS_WITH_QUIZZES = new Set(VALID_LESSON_IDS);

// ── Valid Exercise IDs (from src/data/exercises.ts) ─────────────────
export const VALID_EXERCISE_IDS = new Set([
  'ex-m1-var-01', 'ex-m1-var-02', 'ex-m1-var-03',
  'ex-m1-op-01', 'ex-m1-op-02',
  'ex-m1-if-01', 'ex-m1-if-02',
  'ex-m1-loop-01', 'ex-m1-loop-02', 'ex-m1-loop-03', 'ex-m1-loop-04',
  'ex-m1-arr-01', 'ex-m1-arr-02', 'ex-m1-arr-03',
  'ex-m1-func-01', 'ex-m1-func-02',
  'ex-m2-io-01',
  'ex-m2-str-01', 'ex-m2-str-02', 'ex-m2-str-03',
  'ex-m2-col-01', 'ex-m2-col-02',
  'ex-m3-class-01', 'ex-m3-class-02',
  'ex-m3-encap-01',
  'ex-m3-her-01', 'ex-m3-her-02',
  'ex-m3-poly-01',
  'ex-m3-iface-01',
  'ex-m3-abs-01',
  'ex-m3-comp-01',
  'ex-m3-exc-01', 'ex-m3-exc-02',
  'ex-m3-solid-01',
]);

// ── Valid activity types ────────────────────────────────────────────
export const VALID_ACTIVITY_TYPES = new Set([
  'lesson_complete',
  'quiz_complete',
  'exercise_complete',
]);

// ── Sanitisation helpers ────────────────────────────────────────────

/** Keep only recognised lesson IDs. */
export function sanitiseLessons(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (typeof id === 'string' && VALID_LESSON_IDS.has(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

/** Keep only valid quiz results with plausible scores. */
export function sanitiseQuizResults(
  results: unknown,
): Record<string, { score: number; total: number }> {
  if (!results || typeof results !== 'object') return {};
  const out: Record<string, { score: number; total: number }> = {};
  for (const [lessonId, val] of Object.entries(results as Record<string, unknown>)) {
    if (!LESSONS_WITH_QUIZZES.has(lessonId)) continue;
    if (!val || typeof val !== 'object') continue;
    const v = val as Record<string, unknown>;
    const score = typeof v.score === 'number' ? v.score : -1;
    const total = typeof v.total === 'number' ? v.total : -1;
    // total must be between 1 and QUIZ_MAX_TOTAL; score between 0 and total
    if (total < 1 || total > QUIZ_MAX_TOTAL) continue;
    const clampedScore = Math.max(0, Math.min(Math.floor(score), total));
    out[lessonId] = { score: clampedScore, total };
  }
  return out;
}

/** Keep only valid lesson IDs as favourites. */
export function sanitiseFavorites(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (typeof id === 'string' && VALID_LESSON_IDS.has(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

/** Keep only valid lesson IDs with reasonable time values (max 8 h per lesson). */
export function sanitiseLessonTime(
  times: unknown,
): Record<string, number> {
  if (!times || typeof times !== 'object') return {};
  const MAX_SECONDS = 8 * 3600; // 8 hours cap per lesson
  const out: Record<string, number> = {};
  for (const [lessonId, val] of Object.entries(times as Record<string, unknown>)) {
    if (!VALID_LESSON_IDS.has(lessonId)) continue;
    if (typeof val !== 'number' || !Number.isFinite(val) || val <= 0) continue;
    out[lessonId] = Math.min(Math.floor(val), MAX_SECONDS);
  }
  return out;
}

// ── XP Rewards (mirrors src/lib/progressStore.ts) ──────────────────
const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_GREAT: 30,    // ≥ 80%
  QUIZ_GOOD: 20,     // ≥ 60%
  QUIZ_ATTEMPTED: 10, // < 60%
} as const;

// Max XP per exercise (from exercises.ts, max is 25)
const MAX_EXERCISE_XP = 25;

/** Recalculate the correct XP from validated progress data. Never trust client XP. */
export function recalculateXp(
  completedLessons: string[],
  quizResults: Record<string, { score: number; total: number }>,
  completedExercises?: Record<string, { passed: boolean }>,
): number {
  let xp = 0;
  xp += completedLessons.length * XP_REWARDS.LESSON_COMPLETE;
  for (const r of Object.values(quizResults)) {
    if (r.total === 0) continue;
    const pct = r.score / r.total;
    if (pct >= 0.8) xp += XP_REWARDS.QUIZ_GREAT;
    else if (pct >= 0.6) xp += XP_REWARDS.QUIZ_GOOD;
    else xp += XP_REWARDS.QUIZ_ATTEMPTED;
  }
  if (completedExercises) {
    for (const [id, info] of Object.entries(completedExercises)) {
      if (info.passed && VALID_EXERCISE_IDS.has(id)) {
        xp += MAX_EXERCISE_XP; // conservative cap per exercise
      }
    }
  }
  return xp;
}

/** Sanitise streak: cap current/longest to plausible max (total lesson count). */
export function sanitiseStreak(
  streak: unknown,
): { current: number; longest: number; lastDate: string } {
  const def = { current: 0, longest: 0, lastDate: '' };
  if (!streak || typeof streak !== 'object') return def;
  const s = streak as Record<string, unknown>;
  const maxStreak = 365; // reasonable max
  const current = typeof s.current === 'number' ? Math.max(0, Math.min(Math.floor(s.current), maxStreak)) : 0;
  const longest = typeof s.longest === 'number' ? Math.max(0, Math.min(Math.floor(s.longest), maxStreak)) : 0;
  const lastDate = typeof s.lastDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.lastDate) ? s.lastDate : '';
  return { current, longest: Math.max(longest, current), lastDate };
}

/** Sanitise lastStudied: only valid lesson IDs with valid ISO date strings. */
export function sanitiseLastStudied(
  data: unknown,
): Record<string, string> {
  if (!data || typeof data !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [lessonId, val] of Object.entries(data as Record<string, unknown>)) {
    if (!VALID_LESSON_IDS.has(lessonId)) continue;
    if (typeof val !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(val)) continue;
    out[lessonId] = val;
  }
  return out;
}

/** Sanitise completedExercises: only valid exercise IDs. */
export function sanitiseCompletedExercises(
  data: unknown,
): Record<string, { passed: boolean; attempts?: number; bestScore?: string }> {
  if (!data || typeof data !== 'object') return {};
  const out: Record<string, { passed: boolean; attempts?: number; bestScore?: string }> = {};
  for (const [exId, val] of Object.entries(data as Record<string, unknown>)) {
    if (!VALID_EXERCISE_IDS.has(exId)) continue;
    if (!val || typeof val !== 'object') continue;
    const v = val as Record<string, unknown>;
    const passed = typeof v.passed === 'boolean' ? v.passed : false;
    const attempts = typeof v.attempts === 'number' && v.attempts >= 0 ? Math.min(Math.floor(v.attempts), 1000) : undefined;
    const bestScore = typeof v.bestScore === 'string' ? v.bestScore.slice(0, 20) : undefined;
    out[exId] = { passed, ...(attempts !== undefined && { attempts }), ...(bestScore !== undefined && { bestScore }) };
  }
  return out;
}

/** Validate an activity log entry. Returns a sanitised copy or null if invalid. */
export function sanitiseActivity(
  data: unknown,
): { type: string; lessonId: string; score?: number; total?: number } | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const type = typeof d.type === 'string' ? d.type : '';
  const lessonId = typeof d.lessonId === 'string' ? d.lessonId : '';

  if (!VALID_ACTIVITY_TYPES.has(type)) return null;

  // lesson_complete and quiz_complete require a valid lesson ID
  if (type === 'lesson_complete' || type === 'quiz_complete') {
    if (!VALID_LESSON_IDS.has(lessonId)) return null;
  }
  // exercise_complete requires a valid exercise ID
  if (type === 'exercise_complete') {
    if (!VALID_EXERCISE_IDS.has(lessonId)) return null;
  }

  const out: { type: string; lessonId: string; score?: number; total?: number } = {
    type,
    lessonId,
  };

  if (type === 'quiz_complete') {
    const score = typeof d.score === 'number' ? d.score : -1;
    const total = typeof d.total === 'number' ? d.total : -1;
    if (total < 1 || total > QUIZ_MAX_TOTAL) return null;
    out.score = Math.max(0, Math.min(Math.floor(score), total));
    out.total = total;
  }

  return out;
}
