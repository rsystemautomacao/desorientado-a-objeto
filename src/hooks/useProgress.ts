import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getProgressFromApi,
  saveProgressToApi,
  type Progress,
} from '@/lib/progressStore';

const STORAGE_KEY = 'desorientado-progress';

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  quizResults: {},
  favorites: [],
};

function loadLocalProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

function saveLocalProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
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
      const local = loadLocalProgress();
      user
        .getIdToken(true)
        .then((token) => getProgressFromApi(token))
        .then((p) => {
          const hasRemote = p.completedLessons.length > 0 || Object.keys(p.quizResults).length > 0 || p.favorites.length > 0;
          const hasLocal = local.completedLessons.length > 0 || Object.keys(local.quizResults).length > 0 || local.favorites.length > 0;
          if (!hasRemote && hasLocal) {
            setProgress(local);
            if (apiOkRef.current) {
              user.getIdToken(true).then((t) => saveProgressToApi(t, local).catch(() => { apiOkRef.current = false; }));
            }
          } else {
            setProgress(p);
          }
          setProgressLoaded(true);
        })
        .catch(() => {
          apiOkRef.current = false;
          setProgress(local);
          setProgressLoaded(true);
        });
    } else {
      setProgress(loadLocalProgress());
      setProgressLoaded(true);
    }
  }, [user?.uid, authLoading]);

  // Persistir: logado → API (com retry em caso de falha temporaria); deslogado → localStorage
  useEffect(() => {
    if (!progressLoaded || authLoading) return;
    // Sempre salva localmente como backup
    saveLocalProgress(progress);
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
    setProgress((p) => ({
      ...p,
      completedLessons: p.completedLessons.includes(id) ? p.completedLessons : [...p.completedLessons, id],
    }));
  }, []);

  const uncompleteLesson = useCallback((id: string) => {
    setProgress((p) => ({
      ...p,
      completedLessons: p.completedLessons.filter((l) => l !== id),
    }));
  }, []);

  const saveQuizResult = useCallback((lessonId: string, score: number, total: number) => {
    setProgress((p) => ({
      ...p,
      quizResults: { ...p.quizResults, [lessonId]: { score, total } },
    }));
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
