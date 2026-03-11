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
import { exercises as allExercises } from '@/data/exercises';

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
  completedExercises: {},
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(uid: string | null): string {
  return uid ? `${STORAGE_KEY_PREFIX}-${uid}` : STORAGE_KEY_PREFIX;
}

function resetAtKey(uid: string): string {
  return `desorientado-reset-at-${uid}`;
}

/** Remove todos os dados locais de progresso do aluno */
function clearLocalProgressData(uid: string) {
  [
    storageKey(uid),
    `desorientado-exercises-${uid}`,
    `desorientado-quiz-history-${uid}`,
    `desorientado-study-time-${uid}`,
  ].forEach((k) => localStorage.removeItem(k));
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

/**
 * Recalcula o XP mínimo que o aluno deveria ter baseado no progresso existente.
 * Usado para corrigir XP zerado de ações feitas antes do sistema de XP funcionar.
 */
function recalculateMinXp(p: Progress, uid: string | null): number {
  let xp = 0;

  // Aulas concluídas: 50 XP cada
  xp += p.completedLessons.length * XP_REWARDS.LESSON_COMPLETE;

  // Quizzes: 10-30 XP cada
  for (const result of Object.values(p.quizResults)) {
    xp += getQuizXp(result.score, result.total);
  }

  // Exercícios resolvidos: xpReward de cada exercício
  // Primeiro tenta usar completedExercises do próprio objeto de progresso (sincronizado com servidor)
  const exercisesFromState = p.completedExercises;
  if (exercisesFromState && Object.keys(exercisesFromState).length > 0) {
    for (const [exId, info] of Object.entries(exercisesFromState)) {
      if (info.passed) {
        const ex = allExercises.find((e) => e.id === exId);
        if (ex) xp += ex.xpReward;
      }
    }
  } else {
    // Fallback: lê do localStorage (compatibilidade com dados antigos)
    try {
      const key = `desorientado-exercises-${uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const data: Record<string, { passed: boolean }> = JSON.parse(raw);
        for (const [exId, info] of Object.entries(data)) {
          if (info.passed) {
            const ex = allExercises.find((e) => e.id === exId);
            if (ex) xp += ex.xpReward;
          }
        }
      }
    } catch { /* ignore */ }
  }

  return xp;
}

/** Corrige XP e streak se estiverem defasados em relação ao progresso real */
function fixProgressIfNeeded(p: Progress, uid: string | null): Progress {
  let fixed = p;

  // Fix XP
  const minXp = recalculateMinXp(p, uid);
  if (minXp > p.xp) {
    fixed = { ...fixed, xp: minXp };
  }

  // Fix streak: se tem atividade (aulas/quizzes) mas streak está zerado, inicializa
  const hasActivity = p.completedLessons.length > 0 || Object.keys(p.quizResults).length > 0;
  if (hasActivity && p.streak.current === 0 && !p.streak.lastDate) {
    fixed = {
      ...fixed,
      streak: updateStreak(p.streak), // sets current=1, lastDate=today
    };
  }

  return fixed;
}

export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const isSavingRef = useRef(false);
  const apiOkRef = useRef(true);
  const serverResetAtRef = useRef('');

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
        .then(({ progress: p, resetAt }) => {
          // Guarda o resetAt do servidor para usar nos saves
          serverResetAtRef.current = resetAt ?? '';

          // Se o servidor foi resetado após os dados locais, descarta tudo local
          const localResetAt = localStorage.getItem(resetAtKey(uid)) ?? '';
          if (resetAt && resetAt > localResetAt) {
            clearLocalProgressData(uid);
            localStorage.setItem(resetAtKey(uid), resetAt);
            // Importante: em um dispositivo novo, localResetAt pode estar vazio.
            // Nesse caso, nao devemos "zerar" o progresso do aluno — apenas limpar caches locais antigos
            // e seguir usando o progresso retornado pelo servidor.
          }

          const hasRemote = p.completedLessons.length > 0 || Object.keys(p.quizResults).length > 0 || p.favorites.length > 0;
          const hasLocal = effectiveLocal.completedLessons.length > 0 || Object.keys(effectiveLocal.quizResults).length > 0 || effectiveLocal.favorites.length > 0;
          if (!hasRemote && hasLocal) {
            // Servidor vazio: sobe dados locais, incluindo exercícios do localStorage
            let fixed = fixProgressIfNeeded(effectiveLocal, uid);
            if (!fixed.completedExercises || Object.keys(fixed.completedExercises).length === 0) {
              try {
                const exKey = `desorientado-exercises-${uid}`;
                const raw = localStorage.getItem(exKey);
                if (raw) {
                  const data = JSON.parse(raw) as Record<string, { passed: boolean; attempts: number; bestScore: string }>;
                  if (Object.keys(data).length > 0) fixed = { ...fixed, completedExercises: data };
                }
              } catch { /* ignore */ }
            }
            setProgress(fixed);
            if (apiOkRef.current) {
              user.getIdToken(true).then((t) => saveProgressToApi(t, fixed, serverResetAtRef.current).catch(() => { apiOkRef.current = false; }));
            }
          } else {
            // Servidor tem dados — sincroniza exercícios do servidor para localStorage
            // (garante que outro dispositivo veja os exercícios resolvidos corretamente)
            const serverExercises = p.completedExercises;
            if (serverExercises && Object.keys(serverExercises).length > 0) {
              try {
                const exKey = `desorientado-exercises-${uid}`;
                const localRaw = localStorage.getItem(exKey);
                const localEx: Record<string, { passed: boolean; attempts: number; bestScore: string }> = localRaw ? JSON.parse(localRaw) : {};
                // Mescla: servidor define quais passaram; dados locais de tentativas são preservados
                const merged = { ...serverExercises, ...localEx };
                localStorage.setItem(exKey, JSON.stringify(merged));
              } catch { /* ignore */ }
            }
            setProgress(fixProgressIfNeeded(p, uid));
          }
          setProgressLoaded(true);
        })
        .catch((err) => {
          // Log para diagnosticar problemas de multi-dispositivo (API /api/progress)
          console.error('useProgress: falha ao carregar progresso do servidor', err);
          apiOkRef.current = false;
          setProgress(fixProgressIfNeeded(effectiveLocal, uid));
          setProgressLoaded(true);
        });
    } else {
      setProgress(fixProgressIfNeeded(loadLocalProgress(null), null));
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
        .then((token) => saveProgressToApi(token, progress, serverResetAtRef.current))
        .then(() => { apiOkRef.current = true; })
        .catch((err) => {
          // Log para entender por que o progresso nao esta sendo salvo no servidor
          console.error('useProgress: falha ao salvar progresso no servidor', err);
          apiOkRef.current = false;
        })
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
      const isFirstAttempt = !p.quizResults[lessonId];
      // XP e streak apenas na primeira tentativa
      const xpGain = isFirstAttempt ? getQuizXp(score, total, true) : 0;
      return {
        ...p,
        quizResults: { ...p.quizResults, [lessonId]: { score, total } },
        xp: p.xp + xpGain,
        ...(isFirstAttempt ? { streak: updateStreak(p.streak) } : {}),
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
    // Verifica no localStorage se já foi resolvido (guard contra double-counting)
    try {
      const key = `desorientado-exercises-${user?.uid ?? 'anon'}`;
      const raw = localStorage.getItem(key);
      const data: Record<string, { passed: boolean; attempts: number; bestScore: string }> = raw ? JSON.parse(raw) : {};
      if (data[exerciseId]?.passed) return; // already awarded XP for this exercise
      data[exerciseId] = { ...data[exerciseId], passed: true };
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }

    // Log activity (fire-and-forget)
    if (user) user.getIdToken().then((t) => logActivity(t, { type: 'exercise_complete', lessonId: exerciseId }));

    // Adiciona XP + streak + marca exercício no estado principal (sincronizado com servidor)
    setProgress((p) => {
      const exercises = p.completedExercises ?? {};
      if (exercises[exerciseId]?.passed) return p; // guard no estado
      return {
        ...p,
        xp: p.xp + xpReward,
        streak: updateStreak(p.streak),
        completedExercises: {
          ...exercises,
          [exerciseId]: {
            passed: true,
            attempts: (exercises[exerciseId]?.attempts ?? 0) + 1,
            bestScore: exercises[exerciseId]?.bestScore ?? '',
          },
        },
      };
    });
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

    // Atualiza estado principal para sincronizar tentativas com o servidor
    setProgress((p) => {
      const exercises = p.completedExercises ?? {};
      const prev = exercises[exerciseId];
      return {
        ...p,
        completedExercises: {
          ...exercises,
          [exerciseId]: {
            passed: prev?.passed ?? false,
            attempts: (prev?.attempts ?? 0) + 1,
            bestScore: prev?.bestScore ?? score,
          },
        },
      };
    });
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
