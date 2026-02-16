export interface Progress {
  completedLessons: string[];
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
}

const DEFAULT: Progress = {
  completedLessons: [],
  quizResults: {},
  favorites: [],
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
  };
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
