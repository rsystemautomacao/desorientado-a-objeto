import { modules, getAllLessons } from '@/data/modules';

export const TOTAL_LESSONS = getAllLessons().length;
export const INACTIVE_DAYS = 14;

export interface StudyHistoryEntry {
  userId: string;
  nome: string;
  tipo: string;
  curso: string;
  serieOuSemestre: string;
  completedLessons: string[];
  completedCount: number;
  quizResults: Record<string, { score: number; total: number }>;
  favorites: string[];
  updatedAt: string;
}

export function getProgressPct(entry: StudyHistoryEntry, totalLessons: number = TOTAL_LESSONS): number {
  if (totalLessons <= 0) return 0;
  return Math.round((entry.completedCount / totalLessons) * 100);
}

export function getQuizAccuracy(entry: StudyHistoryEntry): number | null {
  const entries = Object.values(entry.quizResults);
  const total = entries.reduce((a, v) => a + v.total, 0);
  const score = entries.reduce((a, v) => a + v.score, 0);
  if (total === 0) return null;
  return Math.round((score / total) * 100);
}

export function getCurrentTrail(entry: StudyHistoryEntry): string {
  const all = getAllLessons();
  const lastCompleted = entry.completedLessons.length > 0
    ? entry.completedLessons[entry.completedLessons.length - 1]
    : null;
  if (!lastCompleted) return modules[0] ? `${modules[0].icon} ${modules[0].title}` : '—';
  const idx = all.findIndex((l) => l.id === lastCompleted);
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const module = next ? modules.find((m) => m.id === next.moduleId) : modules.find((m) => m.lessons.some((l) => l.id === lastCompleted));
  return module ? `${module.icon} ${module.title}` : '—';
}

export function formatLastActivity(updatedAt: string): string {
  if (!updatedAt || updatedAt.trim() === '') return 'N/D';
  try {
    const d = new Date(updatedAt);
    if (Number.isNaN(d.getTime())) return 'N/D';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  } catch {
    return 'N/D';
  }
}

export function getAlerts(entry: StudyHistoryEntry, inactiveDays: number = INACTIVE_DAYS): string[] {
  const alerts: string[] = [];
  const lastActivity = entry.updatedAt?.trim() ? new Date(entry.updatedAt) : null;
  if (lastActivity) {
    const days = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (days >= inactiveDays) alerts.push(`Parado há ${days} dias`);
  }
  const acc = getQuizAccuracy(entry);
  if (acc !== null && acc < 50) alerts.push('Taxa de acerto baixa');
  const pct = getProgressPct(entry);
  if (pct > 0 && pct < 100 && entry.completedCount > 0 && lastActivity) {
    const days = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (days >= 7) alerts.push('Progresso travado');
  }
  return alerts;
}

export function computeModuleDifficulty(entries: StudyHistoryEntry[]): { moduleTitle: string; pct: number }[] {
  const all = getAllLessons();
  const byModule = new Map<number, { score: number; total: number }>();
  for (const e of entries) {
    for (const [lessonId, res] of Object.entries(e.quizResults)) {
      const lesson = all.find((l) => l.id === lessonId);
      if (!lesson || res.total === 0) continue;
      const cur = byModule.get(lesson.moduleId) ?? { score: 0, total: 0 };
      cur.score += res.score;
      cur.total += res.total;
      byModule.set(lesson.moduleId, cur);
    }
  }
  return Array.from(byModule.entries())
    .map(([id, { score, total }]) => {
      const m = modules.find((mo) => mo.id === id);
      return { moduleTitle: m ? m.title : `M${id}`, pct: total > 0 ? Math.round((score / total) * 100) : 0 };
    })
    .filter((x) => x.pct > 0)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);
}
