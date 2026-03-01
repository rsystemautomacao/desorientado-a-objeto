import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getProgressFromApi,
  saveProgressToApi,
  updateStreak,
  getQuizXp,
  XP_REWARDS,
  type Progress,
} from '@/lib/progressStore';

const STORAGE_KEY_PREFIX = 'desorientado-progress';

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === 'string' && base.length > 0) return base.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Fire-and-forget: registra atividade no backend para timeline do admin */
async function logActivity(token: string, data: { type: string; lessonId: string; score?: number; total?: number }) {
  try {
    const base = getApiBase();
    await fetch(`${base}/api/activity`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // silently ignore — activity log is best-effort
  }
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  quizResults: {},
  favorites: [],
  xp: 0,
  streak: { current: 0, longest: 0, lastDate: '' },
  lastStudied: {},
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(uid: string | null): string {
  return uid ? `${STORAGE_KEY_PREFIX}-${uid}` : STORAGE_KEY_PREFIX;
}

function loadLocalProgress(uid: string | null): Progress {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

function saveLocalProgress(uid: string | null, p: Progress) {
  localStorage.setItem(storageKey(uid), JSON.stringify(p));
}

/** Migra dados da chave antiga (sem uid) para a chave do usuário, se existir */
function migrateOldLocalProgress(uid: string): Progress | null {
  try {
    const oldKey = STORAGE_KEY_PREFIX; // chave antiga compartilhada
    const raw = localStorage.getItem(oldKey);
    if (!raw) return null;
    const data = JSON.parse(raw) as Progress;
    const hasData = data.completedLessons?.length > 0 || Object.keys(data.quizResults ?? {}).length > 0;
    if (hasData) {
      // Move para a chave do usuário e remove a antiga
      saveLocalProgress(uid, data);
      localStorage.removeItem(oldKey);
      return data;
    }
    localStorage.removeItem(oldKey);
  } catch {}
  return null;
}

export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const isSavingRef = useRef(false);
  const apiOkRef = useRef(true);

  // Só chama a API quando o Auth já terminou de carregar (evita token inválido ao abrir a página)
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setProgressLoaded(false);
      apiOkRef.current = true;
      const uid = user.uid;
      const local = loadLocalProgress(uid);
      // Migra dados da chave antiga (sem uid) se existirem — só para o primeiro login
      const migrated = migrateOldLocalProgress(uid);
      const effectiveLocal = migrated ?? local;

      user
        .getIdToken(true)
        .then((token) => getProgressFromApi(token))
        .then((p) => {
          const hasRemote = p.completedLessons.length > 0 || Object.keys(p.quizResults).length > 0 || p.favorites.length > 0;
          const hasLocal = effectiveLocal.completedLessons.length > 0 || Object.keys(effectiveLocal.quizResults).length > 0 || effectiveLocal.favorites.length > 0;
          if (!hasRemote && hasLocal) {
            setProgress(effectiveLocal);
            if (apiOkRef.current) {
              user.getIdToken(true).then((t) => saveProgressToApi(t, effectiveLocal).catch(() => { apiOkRef.current = false; }));
            }
          } else {
            setProgress(p);
          }
          setProgressLoaded(true);
        })
        .catch(() => {
          apiOkRef.current = false;
          setProgress(effectiveLocal);
          setProgressLoaded(true);
        });
    } else {
      setProgress(loadLocalProgress(null));
      setProgressLoaded(true);
    }
  }, [user?.uid, authLoading]);

  // Persistir: logado → API (com retry em caso de falha temporaria); deslogado → localStorage
  useEffect(() => {
    if (!progressLoaded || authLoading) return;
    // Sempre salva localmente como backup (isolado por uid)
    saveLocalProgress(user?.uid ?? null, progress);
    if (user) {
      if (!apiOkRef.current) return;
      isSavingRef.current = true;
      user
        .getIdToken(true)
        .then((token) => saveProgressToApi(token, progress))
        .then(() => { apiOkRef.current = true; })
        .catch(() => { apiOkRef.current = false; })
        .finally(() => {
          isSavingRef.current = false;
        });
    }
  }, [user?.uid, progress, progressLoaded, authLoading]);

  const completeLesson = useCallback((id: string) => {
    setProgress((p) => {
      if (p.completedLessons.includes(id)) return p;
      // Log activity (fire-and-forget)
      if (user) user.getIdToken().then((t) => logActivity(t, { type: 'lesson_complete', lessonId: id }));
      return {
        ...p,
        completedLessons: [...p.completedLessons, id],
        xp: p.xp + XP_REWARDS.LESSON_COMPLETE,
        streak: updateStreak(p.streak),
        lastStudied: { ...p.lastStudied, [id]: todayStr() },
      };
    });
  }, [user]);

  const uncompleteLesson = useCallback((id: string) => {
    setProgress((p) => ({
      ...p,
      completedLessons: p.completedLessons.filter((l) => l !== id),
    }));
  }, []);

  const saveQuizResult = useCallback((lessonId: string, score: number, total: number) => {
    // Log activity (fire-and-forget)
    if (user) user.getIdToken().then((t) => logActivity(t, { type: 'quiz_complete', lessonId, score, total }));

    // Save to quiz history (localStorage only)
    try {
      const hKey = `desorientado-quiz-history-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(hKey);
      const history: Record<string, { score: number; total: number; date: string }[]> = raw ? JSON.parse(raw) : {};
      if (!history[lessonId]) history[lessonId] = [];
      history[lessonId].push({ score, total, date: new Date().toISOString() });
      // Keep last 10 attempts per lesson
      if (history[lessonId].length > 10) history[lessonId] = history[lessonId].slice(-10);
      localStorage.setItem(hKey, JSON.stringify(history));
    } catch { /* ignore */ }

    setProgress((p) => {
      const xpGain = getQuizXp(score, total);
      return {
        ...p,
        quizResults: { ...p.quizResults, [lessonId]: { score, total } },
        xp: p.xp + xpGain,
        streak: updateStreak(p.streak),
        lastStudied: { ...p.lastStudied, [lessonId]: todayStr() },
      };
    });
  }, [user]);

  const toggleFavorite = useCallback((id: string) => {
    setProgress((p) => ({
      ...p,
      favorites: p.favorites.includes(id)
        ? p.favorites.filter((f) => f !== id)
        : [...p.favorites, id],
    }));
  }, []);

  const isCompleted = useCallback((id: string) => progress.completedLessons.includes(id), [progress]);
  const isFavorite = useCallback((id: string) => progress.favorites.includes(id), [progress]);

  const getQuizHistory = useCallback((lessonId: string): { score: number; total: number; date: string }[] => {
    try {
      const hKey = `desorientado-quiz-history-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(hKey);
      if (!raw) return [];
      const history = JSON.parse(raw);
      return Array.isArray(history[lessonId]) ? history[lessonId] : [];
    } catch { return []; }
  }, [user?.uid]);

  /** Registra tempo de estudo (em segundos) para uma aula */
  const addStudyTime = useCallback((lessonId: string, seconds: number) => {
    if (seconds < 5) return; // ignore very short visits
    try {
      const key = `desorientado-study-time-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      const data: Record<string, number> = raw ? JSON.parse(raw) : {};
      data[lessonId] = (data[lessonId] ?? 0) + seconds;
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [user?.uid]);

  /** Retorna tempo total de estudo (em segundos) por aula */
  const getStudyTimes = useCallback((): Record<string, number> => {
    try {
      const key = `desorientado-study-time-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, [user?.uid]);

  /** Registra exercício completo e adiciona XP */
  const completeExercise = useCallback((exerciseId: string, xpReward: number) => {
    // Save to exercise-specific localStorage
    try {
      const key = `desorientado-exercises-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      const data: Record<string, { passed: boolean; attempts: number; bestScore: string }> = raw ? JSON.parse(raw) : {};
      if (data[exerciseId]?.passed) return; // already awarded XP for this exercise
      data[exerciseId] = {
        ...data[exerciseId],
        passed: true,
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }

    // Add XP + update streak via main progress
    if (user) user.getIdToken().then((t) => logActivity(t, { type: 'exercise_complete', lessonId: exerciseId }));
    setProgress((p) => ({
      ...p,
      xp: p.xp + xpReward,
      streak: updateStreak(p.streak),
    }));
  }, [user]);

  /** Registra tentativa de exercício (sem XP) */
  const saveExerciseAttempt = useCallback((exerciseId: string, score: string) => {
    try {
      const key = `desorientado-exercises-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      const data: Record<string, { passed: boolean; attempts: number; bestScore: string }> = raw ? JSON.parse(raw) : {};
      const prev = data[exerciseId];
      data[exerciseId] = {
        passed: prev?.passed ?? false,
        attempts: (prev?.attempts ?? 0) + 1,
        bestScore: prev?.bestScore ?? score,
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [user?.uid]);

  /** Retorna dados de exercícios completados */
  const getExerciseData = useCallback((): Record<string, { passed: boolean; attempts: number; bestScore: string }> => {
    try {
      const key = `desorientado-exercises-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, [user?.uid]);

  return {
    progress,
    completeLesson,
    uncompleteLesson,
    saveQuizResult,
    toggleFavorite,
    isCompleted,
    isFavorite,
    getQuizHistory,
    addStudyTime,
    getStudyTimes,
    completeExercise,
    saveExerciseAttempt,
    getExerciseData,
  };
}
