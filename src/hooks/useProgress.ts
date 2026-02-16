import { useState, useCallback, useEffect } from 'react';

interface Progress {
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
}

const STORAGE_KEY = 'java-master-progress';

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], quizResults: {}, favorites: [] };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

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
