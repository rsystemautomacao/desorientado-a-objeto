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
      return {
        ...p,
        completedLessons: [...p.completedLessons, id],
        xp: p.xp + XP_REWARDS.LESSON_COMPLETE,
        streak: updateStreak(p.streak),
        lastStudied: { ...p.lastStudied, [id]: todayStr() },
      };
    });
  }, []);

  const uncompleteLesson = useCallback((id: string) => {
    setProgress((p) => ({
      ...p,
      completedLessons: p.completedLessons.filter((l) => l !== id),
    }));
  }, []);

  const saveQuizResult = useCallback((lessonId: string, score: number, total: number) => {
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
  }, []);

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

  return {
    progress,
    completeLesson,
    uncompleteLesson,
    saveQuizResult,
    toggleFavorite,
    isCompleted,
    isFavorite,
  };
}
