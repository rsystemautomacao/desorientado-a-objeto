import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { modules } from '@/data/modules';
import { exercises as allExercisesData } from '@/data/exercises';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BookOpen,
  Loader2,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  Download,
  BarChart3,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  GraduationCap,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
  Trophy,
  RefreshCw,
  Activity,
  Clock,
  Megaphone,
  Send,
  X,
  Info,
  AlertTriangle,
  PartyPopper,
  FileText,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Code2,
} from 'lucide-react';

const ADMIN_EMAIL = 'rsautomacao2000@gmail.com';
const DEFAULT_ADMIN_KEY = 'desorientado-admin';
const EXTRA_ADMIN_KEY = (import.meta.env.VITE_ADMIN_KEY || '').trim();

const TOTAL_LESSONS = modules.reduce((acc, m) => acc + m.lessons.length, 0);

interface AnnouncementEntry {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

interface ActivityEntry {
  userId: string;
  nome: string;
  type: 'lesson_complete' | 'quiz_complete' | 'exercise_complete';
  lessonId: string;
  score?: number;
  total?: number;
  timestamp: string;
}

interface StudyHistoryEntry {
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

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === 'string' && base.length > 0) return base.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

// ---------- Helpers ----------

function getModuleProgress(entry: StudyHistoryEntry, moduleId: number) {
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) return { completed: 0, total: 0, pct: 0 };
  const lessonIds = mod.lessons.map((l) => l.id);
  const completed = lessonIds.filter((id) => entry.completedLessons.includes(id)).length;
  return { completed, total: lessonIds.length, pct: mod.lessons.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0 };
}

function getAvgQuizScore(entry: StudyHistoryEntry): number {
  const results = Object.values(entry.quizResults);
  if (results.length === 0) return -1;
  const totalPct = results.reduce((acc, r) => acc + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0);
  return Math.round(totalPct / results.length);
}

function getLessonTitle(lessonId: string): string {
  for (const mod of modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson.title;
  }
  return lessonId;
}

function getModuleForLesson(lessonId: string): number {
  for (const mod of modules) {
    if (mod.lessons.some((l) => l.id === lessonId)) return mod.id;
  }
  return 0;
}

function scoreColor(pct: number): string {
  if (pct >= 80) return 'text-green-600';
  if (pct >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

function scoreBg(pct: number): string {
  if (pct >= 80) return 'bg-green-500/20 text-green-700';
  if (pct >= 60) return 'bg-yellow-500/20 text-yellow-700';
  return 'bg-red-500/20 text-red-700';
}

function barColor(pct: number): string {
  if (pct >= 80) return '#22c55e';
  if (pct >= 60) return '#eab308';
  return '#ef4444';
}

function progressBarColor(pct: number): string {
  if (pct >= 100) return 'bg-green-500';
  if (pct >= 50) return 'bg-blue-500';
  return 'bg-slate-400';
}

type SortKey = 'nome' | 'tipo' | 'curso' | 'serie' | 'completed' | 'm1' | 'm2' | 'm3' | 'quizAvg' | 'quizzes';
type SortDir = 'asc' | 'desc';

function sortEntries(entries: StudyHistoryEntry[], key: SortKey, dir: SortDir): StudyHistoryEntry[] {
  const mul = dir === 'asc' ? 1 : -1;
  return [...entries].sort((a, b) => {
    let va: string | number;
    let vb: string | number;
    switch (key) {
      case 'nome': va = (a.nome || a.userId).toLowerCase(); vb = (b.nome || b.userId).toLowerCase(); break;
      case 'tipo': va = a.tipo.toLowerCase(); vb = b.tipo.toLowerCase(); break;
      case 'curso': va = a.curso.toLowerCase(); vb = b.curso.toLowerCase(); break;
      case 'serie': va = a.serieOuSemestre.toLowerCase(); vb = b.serieOuSemestre.toLowerCase(); break;
      case 'completed': va = a.completedCount; vb = b.completedCount; break;
      case 'm1': va = getModuleProgress(a, 1).completed; vb = getModuleProgress(b, 1).completed; break;
      case 'm2': va = getModuleProgress(a, 2).completed; vb = getModuleProgress(b, 2).completed; break;
      case 'm3': va = getModuleProgress(a, 3).completed; vb = getModuleProgress(b, 3).completed; break;
      case 'quizAvg': va = getAvgQuizScore(a); vb = getAvgQuizScore(b); break;
      case 'quizzes': va = Object.keys(a.quizResults).length; vb = Object.keys(b.quizResults).length; break;
      default: va = 0; vb = 0;
    }
    if (typeof va === 'string') return va.localeCompare(vb as string) * mul;
    return ((va as number) - (vb as number)) * mul;
  });
}

function exportToCsv(entries: StudyHistoryEntry[]) {
  const headers = ['Nome', 'UserID', 'Tipo', 'Curso', 'Serie/Semestre', 'Aulas Concluidas', 'Total Aulas', 'M1 Fundamentos', 'M2 Intermediario', 'M3 POO', 'Quizzes Feitos', 'Media Quiz %', 'Favoritos'];
  const rows = entries.map((e) => {
    const m1 = getModuleProgress(e, 1);
    const m2 = getModuleProgress(e, 2);
    const m3 = getModuleProgress(e, 3);
    const avg = getAvgQuizScore(e);
    return [
      e.nome || '',
      e.userId,
      e.tipo || '',
      e.curso || '',
      e.serieOuSemestre || '',
      e.completedCount,
      TOTAL_LESSONS,
      `${m1.completed}/${m1.total}`,
      `${m2.completed}/${m2.total}`,
      `${m3.completed}/${m3.total}`,
      Object.keys(e.quizResults).length,
      avg >= 0 ? avg : '',
      e.favorites.length,
    ];
  });

  // Add per-lesson quiz scores
  const allLessons = modules.flatMap((m) => m.lessons);
  const quizHeaders = allLessons.map((l) => `Quiz: ${l.title}`);
  const quizRows = entries.map((e) =>
    allLessons.map((l) => {
      const r = e.quizResults[l.id];
      return r ? `${r.score}/${r.total}` : '';
    })
  );

  const fullHeaders = [...headers, ...quizHeaders];
  const fullRows = rows.map((r, i) => [...r, ...quizRows[i]]);
  const csv = [fullHeaders, ...fullRows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alunos-desorientado-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Sub-components ----------

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
  return dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
}

function MiniProgress({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${progressBarColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums whitespace-nowrap">{label}</span>
    </div>
  );
}

function exportStudentPdf(entry: StudyHistoryEntry) {
  const m1 = getModuleProgress(entry, 1);
  const m2 = getModuleProgress(entry, 2);
  const m3 = getModuleProgress(entry, 3);
  const avg = getAvgQuizScore(entry);
  const totalPct = Math.round((entry.completedCount / TOTAL_LESSONS) * 100);

  const modulesHtml = modules.map((mod) => {
    const prog = getModuleProgress(entry, mod.id);
    const lessonsHtml = mod.lessons.map((lesson) => {
      const done = entry.completedLessons.includes(lesson.id);
      const quiz = entry.quizResults[lesson.id];
      const qPct = quiz && quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : -1;
      const statusIcon = done ? '&#10003;' : '&#9675;';
      const statusColor = done ? '#16a34a' : '#9ca3af';
      const quizBadge = quiz
        ? `<span style="padding:1px 6px;border-radius:4px;font-size:11px;font-weight:600;${qPct >= 80 ? 'background:#dcfce7;color:#166534' : qPct >= 60 ? 'background:#fef9c3;color:#854d0e' : 'background:#fee2e2;color:#991b1b'}">${quiz.score}/${quiz.total}</span>`
        : '';
      return `<tr><td style="padding:4px 8px;color:${statusColor};font-size:14px;width:24px">${statusIcon}</td><td style="padding:4px 8px;font-size:13px;${done ? '' : 'color:#9ca3af'}">${lesson.title}</td><td style="padding:4px 8px;text-align:right">${quizBadge}</td></tr>`;
    }).join('');
    return `<div style="margin-bottom:20px"><h3 style="margin:0 0 8px;font-size:15px">${mod.icon} ${mod.title} <span style="font-weight:normal;color:#6b7280;font-size:13px">(${prog.completed}/${prog.total} — ${prog.pct}%)</span></h3><table style="width:100%;border-collapse:collapse">${lessonsHtml}</table></div>`;
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Relatorio - ${entry.nome || 'Aluno'}</title><style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:40px;color:#1f2937;line-height:1.5}
    h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:24px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:6px}
    .stats{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0}
    .stat{border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;min-width:120px}
    .stat-val{font-size:24px;font-weight:700}.stat-lbl{font-size:11px;color:#6b7280;text-transform:uppercase}
    .bar{height:8px;border-radius:4px;background:#e5e7eb;margin-top:4px}.bar-fill{height:100%;border-radius:4px}
    @media print{body{margin:20px}@page{margin:15mm}}
  </style></head><body>
    <h1>Relatorio do Aluno</h1>
    <p style="color:#6b7280;margin:0 0 20px;font-size:13px">DESorientado a Objetos — gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>

    <table style="font-size:13px;margin-bottom:20px">
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Nome:</td><td style="font-weight:600">${entry.nome || '-'}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Tipo:</td><td>${entry.tipo || '-'}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Curso:</td><td>${entry.curso || '-'}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#6b7280">Serie/Semestre:</td><td>${entry.serieOuSemestre || '-'}</td></tr>
    </table>

    <div class="stats">
      <div class="stat"><div class="stat-val">${entry.completedCount}/${TOTAL_LESSONS}</div><div class="stat-lbl">Aulas concluidas</div><div class="bar"><div class="bar-fill" style="width:${totalPct}%;background:${totalPct >= 100 ? '#22c55e' : '#3b82f6'}"></div></div></div>
      <div class="stat"><div class="stat-val">${avg >= 0 ? avg + '%' : '-'}</div><div class="stat-lbl">Media quizzes</div></div>
      <div class="stat"><div class="stat-val">${Object.keys(entry.quizResults).length}</div><div class="stat-lbl">Quizzes feitos</div></div>
      <div class="stat"><div class="stat-val">${totalPct}%</div><div class="stat-lbl">Progresso total</div></div>
    </div>

    <h2>Detalhamento por Modulo</h2>
    ${modulesHtml}

    ${entry.updatedAt ? `<p style="font-size:11px;color:#9ca3af;margin-top:24px">Perfil atualizado em ${new Date(entry.updatedAt).toLocaleDateString('pt-BR')}</p>` : ''}
  </body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }
}

function StudentDetail({ entry }: { entry: StudyHistoryEntry }) {
  return (
    <div className="px-4 py-4 bg-muted/10 space-y-4">
      {/* PDF export button */}
      <div className="flex justify-end">
        <button
          onClick={(e) => { e.stopPropagation(); exportStudentPdf(entry); }}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors"
        >
          <FileText className="h-3.5 w-3.5" /> Exportar PDF
        </button>
      </div>
      {/* Module breakdown */}
      {modules.map((mod) => {
        const prog = getModuleProgress(entry, mod.id);
        return (
          <div key={mod.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {mod.icon} {mod.title}
                <span className="text-muted-foreground font-normal ml-2">
                  {prog.completed}/{prog.total} aulas ({prog.pct}%)
                </span>
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {mod.lessons.map((lesson) => {
                const done = entry.completedLessons.includes(lesson.id);
                const quiz = entry.quizResults[lesson.id];
                const quizPct = quiz && quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : -1;
                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-md border ${done ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-background/50'}`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    <span className={`truncate flex-1 ${done ? '' : 'text-muted-foreground'}`} title={lesson.title}>
                      {lesson.title}
                    </span>
                    {quiz && (
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${scoreBg(quizPct)}`}>
                        {quiz.score}/{quiz.total}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Updated at */}
      {entry.updatedAt && (
        <p className="text-xs text-muted-foreground">
          Perfil atualizado em: {new Date(entry.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      )}
    </div>
  );
}

function QuizAnalyticsSection({ entries }: { entries: StudyHistoryEntry[] }) {
  const analytics = useMemo(() => {
    const lessonScores: Record<string, { totalPct: number; count: number }> = {};
    for (const entry of entries) {
      for (const [lessonId, result] of Object.entries(entry.quizResults)) {
        if (result.total === 0) continue;
        if (!lessonScores[lessonId]) lessonScores[lessonId] = { totalPct: 0, count: 0 };
        lessonScores[lessonId].totalPct += (result.score / result.total) * 100;
        lessonScores[lessonId].count++;
      }
    }
    return Object.entries(lessonScores)
      .map(([lessonId, data]) => ({
        lessonId,
        name: getLessonTitle(lessonId),
        shortName: getLessonTitle(lessonId).length > 25 ? getLessonTitle(lessonId).slice(0, 22) + '...' : getLessonTitle(lessonId),
        avgPct: Math.round(data.totalPct / data.count),
        students: data.count,
        moduleId: getModuleForLesson(lessonId),
      }))
      .sort((a, b) => a.avgPct - b.avgPct);
  }, [entries]);

  if (analytics.length === 0) return null;

  const hardest = analytics.slice(0, 3);
  const easiest = [...analytics].reverse().slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Desempenho nos Quizzes por Aula</h2>
      </div>
      <div className="p-4">
        {/* Highlights */}
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-xs font-medium text-red-600 mb-2">Mais dificeis (menor media)</p>
            {hardest.map((h) => (
              <div key={h.lessonId} className="flex items-center justify-between text-xs py-0.5">
                <span className="truncate mr-2" title={h.name}>{h.name}</span>
                <span className={`font-medium ${scoreColor(h.avgPct)}`}>{h.avgPct}%</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-xs font-medium text-green-600 mb-2">Mais faceis (maior media)</p>
            {easiest.map((h) => (
              <div key={h.lessonId} className="flex items-center justify-between text-xs py-0.5">
                <span className="truncate mr-2" title={h.name}>{h.name}</span>
                <span className={`font-medium ${scoreColor(h.avgPct)}`}>{h.avgPct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics} layout="vertical" margin={{ left: 160, right: 20, top: 5, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} />
              <YAxis
                type="category"
                dataKey="shortName"
                width={155}
                fontSize={10}
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Media']}
                labelFormatter={(label) => {
                  const item = analytics.find((a) => a.shortName === label);
                  return item ? item.name : label;
                }}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="avgPct" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {analytics.map((item) => (
                  <Cell key={item.lessonId} fill={barColor(item.avgPct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Media de acertos dos quizzes por aula (apenas alunos que fizeram o quiz)
        </p>
      </div>
    </div>
  );
}

// ---------- Exercise Analytics ----------

function ExerciseAnalyticsSection({ activities }: { activities: ActivityEntry[] }) {
  const analytics = useMemo(() => {
    // Count unique completions per exercise and total attempts from activity log
    const exerciseCompletions: Record<string, Set<string>> = {};
    for (const a of activities) {
      if (a.type === 'exercise_complete') {
        if (!exerciseCompletions[a.lessonId]) exerciseCompletions[a.lessonId] = new Set();
        exerciseCompletions[a.lessonId].add(a.userId);
      }
    }

    return allExercisesData.map((ex) => ({
      id: ex.id,
      title: ex.title,
      topic: ex.topicLabel,
      difficulty: ex.difficulty,
      completions: exerciseCompletions[ex.id]?.size ?? 0,
    })).sort((a, b) => b.completions - a.completions);
  }, [activities]);

  const totalExercises = allExercisesData.length;
  const exercisesAttempted = analytics.filter((e) => e.completions > 0).length;
  const totalCompletions = analytics.reduce((a, e) => a + e.completions, 0);
  const neverAttempted = analytics.filter((e) => e.completions === 0);
  const mostPopular = analytics.filter((e) => e.completions > 0).slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <Code2 className="h-4 w-4 text-purple-500" />
        <h2 className="font-semibold">Exercicios — Visao Geral</h2>
        <span className="ml-auto text-xs text-muted-foreground">{totalCompletions} resolucoes no total</span>
      </div>
      <div className="p-4">
        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-2xl font-bold">{exercisesAttempted}<span className="text-sm text-muted-foreground">/{totalExercises}</span></p>
            <p className="text-xs text-muted-foreground">exercicios ja resolvidos</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-2xl font-bold">{totalCompletions}</p>
            <p className="text-xs text-muted-foreground">resolucoes no total</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{neverAttempted.length}</p>
            <p className="text-xs text-muted-foreground">nunca resolvidos</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid gap-3 sm:grid-cols-2 mb-4">
          {mostPopular.length > 0 && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
              <p className="text-xs font-medium text-green-600 mb-2">Mais resolvidos</p>
              {mostPopular.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="truncate mr-2">{e.title}</span>
                  <span className="font-medium text-green-600 shrink-0">{e.completions} aluno{e.completions !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
          {neverAttempted.length > 0 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-medium text-red-600 mb-2">Nunca resolvidos ({neverAttempted.length})</p>
              {neverAttempted.slice(0, 5).map((e) => {
                const diffLabel = e.difficulty === 'facil' ? 'Facil' : e.difficulty === 'medio' ? 'Medio' : 'Dificil';
                return (
                  <div key={e.id} className="flex items-center justify-between text-xs py-0.5">
                    <span className="truncate mr-2">{e.title}</span>
                    <span className="text-muted-foreground shrink-0">{diffLabel}</span>
                  </div>
                );
              })}
              {neverAttempted.length > 5 && (
                <p className="text-[10px] text-muted-foreground mt-1">+ {neverAttempted.length - 5} mais...</p>
              )}
            </div>
          )}
        </div>

        {/* Per difficulty breakdown */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {(['facil', 'medio', 'dificil'] as const).map((d) => {
            const total = allExercisesData.filter((e) => e.difficulty === d).length;
            const solved = analytics.filter((e) => e.difficulty === d && e.completions > 0).length;
            const label = d === 'facil' ? 'Facil' : d === 'medio' ? 'Medio' : 'Dificil';
            const color = d === 'facil' ? 'text-green-500' : d === 'medio' ? 'text-yellow-500' : 'text-red-500';
            return (
              <span key={d} className="flex items-center gap-1">
                <span className={`font-medium ${color}`}>{label}:</span> {solved}/{total}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Feedback Analytics ----------

function FeedbackSection({ summary }: { summary: Record<string, { likes: number; dislikes: number }> }) {
  const data = useMemo(() => {
    const allLessons = modules.flatMap((m) => m.lessons);
    return allLessons.map((l) => {
      const fb = summary[l.id] ?? { likes: 0, dislikes: 0 };
      const total = fb.likes + fb.dislikes;
      const approval = total > 0 ? Math.round((fb.likes / total) * 100) : -1;
      return { id: l.id, name: getLessonTitle(l.id), ...fb, total, approval };
    }).filter((l) => l.total > 0)
      .sort((a, b) => a.approval - b.approval);
  }, [summary]);

  if (data.length === 0) return null;

  const needsAttention = data.filter((d) => d.approval >= 0 && d.approval < 60);
  const bestRated = [...data].filter((d) => d.approval >= 0).sort((a, b) => b.approval - a.approval).slice(0, 3);
  const totalVotes = data.reduce((a, d) => a + d.total, 0);
  const totalLikes = data.reduce((a, d) => a + d.likes, 0);
  const overallApproval = totalVotes > 0 ? Math.round((totalLikes / totalVotes) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Avaliacao das Aulas (Curtidas)</h2>
        <span className="ml-auto text-xs text-muted-foreground">{totalVotes} votos no total</span>
      </div>
      <div className="p-4">
        {/* Overall approval */}
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold">{overallApproval}%</div>
          <div className="text-sm text-muted-foreground">
            aprovacao geral
            <span className="ml-2">
              (<ThumbsUp className="h-3 w-3 inline" /> {totalLikes} / <ThumbsDown className="h-3 w-3 inline" /> {totalVotes - totalLikes})
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid gap-3 sm:grid-cols-2 mb-4">
          {needsAttention.length > 0 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                <ThumbsDown className="h-3 w-3" /> Precisam de atencao (aprovacao {'<'} 60%)
              </p>
              {needsAttention.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="truncate mr-2" title={d.name}>{d.name}</span>
                  <span className="font-medium text-red-500 shrink-0">{d.approval}% ({d.likes}/{d.total})</span>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-xs font-medium text-green-600 mb-2 flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> Mais curtidas
            </p>
            {bestRated.map((d) => (
              <div key={d.id} className="flex items-center justify-between text-xs py-0.5">
                <span className="truncate mr-2" title={d.name}>{d.name}</span>
                <span className="font-medium text-green-600 shrink-0">{d.approval}% ({d.likes}/{d.total})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full list */}
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            Ver todas as aulas avaliadas ({data.length})
          </summary>
          <div className="mt-2 space-y-1.5">
            {data.map((d) => {
              const barColor = d.approval >= 80 ? 'bg-green-500' : d.approval >= 60 ? 'bg-yellow-500' : 'bg-red-500';
              return (
                <div key={d.id} className="flex items-center gap-3 text-xs">
                  <span className="truncate w-44 shrink-0" title={d.name}>{d.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(d.approval, 3)}%` }} />
                  </div>
                  <span className="flex items-center gap-1 shrink-0 w-24 justify-end">
                    <ThumbsUp className="h-3 w-3 text-green-500" /> {d.likes}
                    <ThumbsDown className="h-3 w-3 text-red-500 ml-1" /> {d.dislikes}
                    <span className="font-medium ml-1">({d.approval}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

// ---------- Main Component ----------

export default function Admin() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get('k') ?? '';
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [entries, setEntries] = useState<StudyHistoryEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementEntry[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<Record<string, { likes: number; dislikes: number }>>({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // UI state
  const [sortKey, setSortKey] = useState<SortKey>('completed');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  const keyTrimmed = key.trim();
  const keyValid =
    keyTrimmed === DEFAULT_ADMIN_KEY || (EXTRA_ADMIN_KEY.length > 0 && keyTrimmed === EXTRA_ADMIN_KEY);

  if (!keyValid) return <NotFound />;
  if (!authLoading && user && !isAdmin) return <NotFound />;

  const loadHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const token = await user.getIdToken(true);
      const base = getApiBase();
      const url = `${base}/api/admin/study-history`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 403) { setHistoryError('Acesso negado. Verifique se ADMIN_EMAIL esta correto na Vercel.'); return; }
      if (res.status === 404) { setHistoryError('API do admin nao encontrada (404). Confira se o deploy inclui a pasta api/admin.'); return; }
      if (!res.ok) {
        const text = await res.text();
        let detail = '';
        try { const j = JSON.parse(text); detail = j.hint ? ` ${j.hint}` : j.message ? ` ${j.message}` : ''; }
        catch { if (text.length < 120) detail = ` ${text}`; }
        setHistoryError(`Erro ao carregar dados (${res.status}).${detail}`);
        return;
      }
      const data = await res.json();
      setEntries(data.entries ?? []);

      // Load activities + announcements + feedback (best-effort, don't block)
      try {
        const [actRes, annRes, fbRes] = await Promise.all([
          fetch(`${base}/api/admin/activities?limit=50`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/admin/announcements`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/api/feedback`),
        ]);
        if (actRes.ok) { const d = await actRes.json(); setActivities(d.activities ?? []); }
        if (annRes.ok) { const d = await annRes.json(); setAnnouncements(d.announcements ?? []); }
        if (fbRes.ok) { const d = await fbRes.json(); setFeedbackSummary(d.summary ?? {}); }
      } catch { /* ignore */ }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setHistoryError(`Erro de conexao: ${msg}`);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) loadHistory();
  }, [isAdmin, user?.uid]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch { setLoginError('E-mail ou senha incorretos.'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => { await signOut(auth); };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  // Login screen
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-center mb-4">Acesso restrito</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-muted-foreground mb-1">E-mail</label>
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-muted-foreground mb-1">Senha</label>
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" required autoComplete="current-password" />
            </div>
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ---------- Computed data ----------

  const tipos = [...new Set(entries.map((e) => e.tipo).filter(Boolean))];

  const filtered = entries.filter((e) => {
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const match = (e.nome || '').toLowerCase().includes(s) || (e.curso || '').toLowerCase().includes(s) || (e.serieOuSemestre || '').toLowerCase().includes(s) || e.userId.toLowerCase().includes(s);
      if (!match) return false;
    }
    if (filterTipo && e.tipo !== filterTipo) return false;
    return true;
  });

  const sorted = sortEntries(filtered, sortKey, sortDir);

  // Aggregates
  const totalCompletedLessons = entries.reduce((acc, e) => acc + e.completedCount, 0);
  const totalQuizzesDone = entries.reduce((acc, e) => acc + Object.keys(e.quizResults).length, 0);
  const avgCompletion = entries.length > 0 ? Math.round((totalCompletedLessons / (entries.length * TOTAL_LESSONS)) * 100) : 0;
  const allQuizScores = entries.flatMap((e) => Object.values(e.quizResults).map((r) => (r.total > 0 ? (r.score / r.total) * 100 : 0)));
  const avgQuizScore = allQuizScores.length > 0 ? Math.round(allQuizScores.reduce((a, b) => a + b, 0) / allQuizScores.length) : 0;
  const studentsCompleted100 = entries.filter((e) => e.completedCount >= TOTAL_LESSONS).length;

  const tdCls = 'px-3 py-2.5 text-sm';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Painel do Professor
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground truncate max-w-[180px]" title={user?.email ?? ''}>
              <User className="h-4 w-4 inline mr-1" />
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Error */}
        {historyError && (
          <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-sm flex flex-wrap items-center justify-between gap-3">
            <span className="text-destructive">{historyError}</span>
            <Button variant="outline" size="sm" onClick={() => loadHistory()}>Tentar novamente</Button>
          </div>
        )}

        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* ===== Stats Cards ===== */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <StatCard icon={<Users className="h-4 w-4" />} label="Alunos" value={entries.length} />
              <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Conclusao media" value={`${avgCompletion}%`} />
              <StatCard icon={<BookOpen className="h-4 w-4" />} label="Aulas concluidas" value={`${totalCompletedLessons}`} sub={`de ${entries.length * TOTAL_LESSONS}`} />
              <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Quizzes feitos" value={totalQuizzesDone} />
              <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Media quizzes" value={`${avgQuizScore}%`} color={scoreColor(avgQuizScore)} />
              <StatCard icon={<Trophy className="h-4 w-4" />} label="Concluiram tudo" value={studentsCompleted100} sub={`de ${entries.length}`} />
            </div>

            {/* ===== Inactive students alert ===== */}
            {(() => {
              const now = new Date();
              const INACTIVE_DAYS = 7;

              // Build a map of latest activity timestamp per user from activities data
              const lastActivityMap = new Map<string, string>();
              for (const a of activities) {
                const prev = lastActivityMap.get(a.userId);
                if (!prev || a.timestamp > prev) lastActivityMap.set(a.userId, a.timestamp);
              }

              const inactive = entries.filter((e) => {
                // Use the most recent date from: updatedAt (profile+progress) or last activity
                const lastActivity = lastActivityMap.get(e.userId);
                const candidates = [e.updatedAt, lastActivity].filter(Boolean) as string[];
                if (candidates.length === 0) return true; // no data at all
                const mostRecent = candidates.sort().pop()!;
                const diffDays = Math.floor((now.getTime() - new Date(mostRecent).getTime()) / 86400000);
                return diffDays >= INACTIVE_DAYS;
              }).map((e) => {
                const lastActivity = lastActivityMap.get(e.userId);
                const candidates = [e.updatedAt, lastActivity].filter(Boolean) as string[];
                if (candidates.length === 0) return { ...e, daysInactive: 999 };
                const mostRecent = candidates.sort().pop()!;
                const diffDays = Math.floor((now.getTime() - new Date(mostRecent).getTime()) / 86400000);
                return { ...e, daysInactive: diffDays };
              }).sort((a, b) => b.daysInactive - a.daysInactive);

              if (inactive.length === 0) return null;

              return (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-yellow-500/20 bg-yellow-500/10 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <h2 className="font-semibold text-yellow-800 text-sm">Alunos inativos ({inactive.length})</h2>
                    <span className="ml-auto text-[10px] text-yellow-700">sem atividade ha {INACTIVE_DAYS}+ dias</span>
                  </div>
                  <div className="p-3 max-h-[200px] overflow-y-auto">
                    <div className="space-y-1">
                      {inactive.slice(0, 15).map((e) => (
                        <div key={e.userId} className="flex items-center justify-between text-xs px-2 py-1 rounded hover:bg-yellow-500/10">
                          <span className="font-medium truncate mr-2">{e.nome || 'Sem nome'}</span>
                          <span className="text-yellow-700 shrink-0">
                            {e.daysInactive >= 999 ? 'nunca acessou' : `${e.daysInactive} dias`}
                          </span>
                        </div>
                      ))}
                      {inactive.length > 15 && (
                        <p className="text-[10px] text-muted-foreground text-center pt-1">+ {inactive.length - 15} mais</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===== Announcements ===== */}
            <AnnouncementsManager
              announcements={announcements}
              onUpdate={setAnnouncements}
              getToken={() => user!.getIdToken(true)}
            />

            {/* ===== Student Table ===== */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Toolbar */}
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center gap-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Por aluno
                </h2>
                <div className="flex-1" />
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 w-44"
                  />
                </div>
                {/* Filter Tipo */}
                {tipos.length > 0 && (
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="text-xs rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="">Todos os tipos</option>
                    {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
                {/* Actions */}
                <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={() => loadHistory()}>
                  <RefreshCw className="h-3 w-3" /> Atualizar
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={() => exportToCsv(filtered)}>
                  <Download className="h-3 w-3" /> CSV
                </Button>
              </div>

              <p className="px-4 py-1.5 text-[10px] text-muted-foreground border-b border-border/50">
                Clique no nome do aluno para expandir detalhes. Clique nos cabecalhos para ordenar. {filtered.length !== entries.length && <span className="font-medium">Mostrando {filtered.length} de {entries.length} alunos.</span>}
              </p>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="w-6 px-2" />
                      <ThSort label="Nome" sortKey="nome" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="Tipo" sortKey="tipo" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="Curso" sortKey="curso" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="Serie" sortKey="serie" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="Total" sortKey="completed" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="M1" sortKey="m1" currentKey={sortKey} dir={sortDir} onClick={handleSort} title="Fundamentos" />
                      <ThSort label="M2" sortKey="m2" currentKey={sortKey} dir={sortDir} onClick={handleSort} title="Intermediario" />
                      <ThSort label="M3" sortKey="m3" currentKey={sortKey} dir={sortDir} onClick={handleSort} title="POO" />
                      <ThSort label="Quiz Avg" sortKey="quizAvg" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                      <ThSort label="Quizzes" sortKey="quizzes" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-muted-foreground">
                          {entries.length === 0 ? 'Nenhum dado de estudo ainda.' : 'Nenhum aluno encontrado com esse filtro.'}
                        </td>
                      </tr>
                    ) : (
                      sorted.map((e) => {
                        const expanded = expandedUserId === e.userId;
                        const m1 = getModuleProgress(e, 1);
                        const m2 = getModuleProgress(e, 2);
                        const m3 = getModuleProgress(e, 3);
                        const avg = getAvgQuizScore(e);
                        return (
                          <Fragment key={e.userId}>
                            <tr
                              className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${expanded ? 'bg-muted/20' : ''}`}
                              onClick={() => setExpandedUserId(expanded ? null : e.userId)}
                            >
                              <td className="px-2 py-2.5">
                                {expanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                              </td>
                              <td className={tdCls} title={e.userId}>
                                {e.nome ? <span className="font-medium">{e.nome}</span> : <span className="text-muted-foreground">id: {e.userId.slice(0, 10)}...</span>}
                              </td>
                              <td className={tdCls}>{e.tipo || <span className="text-muted-foreground">-</span>}</td>
                              <td className={tdCls}>{e.curso || <span className="text-muted-foreground">-</span>}</td>
                              <td className={tdCls}>{e.serieOuSemestre || <span className="text-muted-foreground">-</span>}</td>
                              <td className={tdCls}>
                                <MiniProgress pct={Math.round((e.completedCount / TOTAL_LESSONS) * 100)} label={`${e.completedCount}/${TOTAL_LESSONS}`} />
                              </td>
                              <td className={tdCls}><MiniProgress pct={m1.pct} label={`${m1.completed}/${m1.total}`} /></td>
                              <td className={tdCls}><MiniProgress pct={m2.pct} label={`${m2.completed}/${m2.total}`} /></td>
                              <td className={tdCls}><MiniProgress pct={m3.pct} label={`${m3.completed}/${m3.total}`} /></td>
                              <td className={tdCls}>
                                {avg >= 0 ? <span className={`font-medium ${scoreColor(avg)}`}>{avg}%</span> : <span className="text-muted-foreground">-</span>}
                              </td>
                              <td className={tdCls}>{Object.keys(e.quizResults).length}</td>
                            </tr>
                            {expanded && (
                              <tr>
                                <td colSpan={11} className="p-0">
                                  <StudentDetail entry={e} />
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===== Quiz Analytics ===== */}
            <QuizAnalyticsSection entries={entries} />

            {/* ===== Exercise Analytics ===== */}
            <ExerciseAnalyticsSection activities={activities} />

            {/* ===== Feedback Analytics ===== */}
            <FeedbackSection summary={feedbackSummary} />

            {/* ===== Activity Timeline ===== */}
            <ActivityTimeline activities={activities} />
          </>
        )}
      </main>
    </div>
  );
}

// ---------- Small components ----------

function AnnouncementsManager({ announcements, onUpdate, getToken }: { announcements: AnnouncementEntry[]; onUpdate: (a: AnnouncementEntry[]) => void; getToken: () => Promise<string> }) {
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [sending, setSending] = useState(false);

  const activeAnn = announcements.filter((a) => a.active);
  const inactiveAnn = announcements.filter((a) => !a.active);

  const handleCreate = async () => {
    if (!msg.trim()) return;
    setSending(true);
    try {
      const token = await getToken();
      const base = getApiBase();
      const res = await fetch(`${base}/api/admin/announcements`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg.trim(), type }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate([{ id: data.id, message: data.message, type: data.type, active: true, createdAt: data.createdAt }, ...announcements]);
        setMsg('');
      }
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const token = await getToken();
      const base = getApiBase();
      await fetch(`${base}/api/admin/announcements?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(announcements.map((a) => a.id === id ? { ...a, active: false } : a));
    } catch { /* ignore */ }
  };

  const typeIcon = (t: string) => {
    if (t === 'warning') return <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />;
    if (t === 'success') return <PartyPopper className="h-3.5 w-3.5 text-green-600" />;
    return <Info className="h-3.5 w-3.5 text-blue-600" />;
  };

  const typeBorder = (t: string) => {
    if (t === 'warning') return 'border-yellow-500/30 bg-yellow-500/5';
    if (t === 'success') return 'border-green-500/30 bg-green-500/5';
    return 'border-blue-500/30 bg-blue-500/5';
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Avisos para os Alunos</h2>
        <span className="text-xs text-muted-foreground ml-auto">{activeAnn.length} ativo(s)</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Create form */}
        <div className="flex flex-col sm:flex-row gap-2">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Escreva um aviso para todos os alunos..."
            rows={2}
            maxLength={500}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
          <div className="flex sm:flex-col gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'info' | 'warning' | 'success')}
              className="text-xs rounded-md border border-border bg-background px-2 py-1.5 focus:outline-none"
            >
              <option value="info">Informacao</option>
              <option value="warning">Atencao</option>
              <option value="success">Parabens</option>
            </select>
            <Button size="sm" className="gap-1 text-xs" onClick={handleCreate} disabled={!msg.trim() || sending}>
              <Send className="h-3 w-3" /> {sending ? 'Enviando...' : 'Publicar'}
            </Button>
          </div>
        </div>

        {/* Active announcements */}
        {activeAnn.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Avisos ativos (visiveis no Dashboard dos alunos):</p>
            {activeAnn.map((a) => (
              <div key={a.id} className={`flex items-start gap-2 p-3 rounded-lg border ${typeBorder(a.type)}`}>
                <div className="mt-0.5">{typeIcon(a.type)}</div>
                <p className="flex-1 text-sm">{a.message}</p>
                <button onClick={() => handleDeactivate(a.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" title="Desativar aviso">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inactive (collapsed) */}
        {inactiveAnn.length > 0 && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">{inactiveAnn.length} aviso(s) desativado(s)</summary>
            <div className="mt-2 space-y-1">
              {inactiveAnn.map((a) => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded border border-border/50 opacity-60">
                  {typeIcon(a.type)}
                  <span className="truncate flex-1">{a.message}</span>
                  <span className="text-[10px]">{new Date(a.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

function ActivityTimeline({ activities }: { activities: ActivityEntry[] }) {
  if (activities.length === 0) return null;

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min atras`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atras`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'ontem';
    return `${days} dias atras`;
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Atividade Recente</h2>
        <span className="text-xs text-muted-foreground ml-auto">{activities.length} eventos</span>
      </div>
      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
        {activities.map((a, i) => {
          const isQuiz = a.type === 'quiz_complete';
          const pct = isQuiz && a.total && a.total > 0 ? Math.round(((a.score ?? 0) / a.total) * 100) : -1;
          return (
            <div key={`${a.userId}-${a.timestamp}-${i}`} className="flex items-start gap-3 px-4 py-3 text-sm">
              <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${isQuiz ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                {isQuiz ? <ClipboardList className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{a.nome || `id: ${a.userId.slice(0, 8)}...`}</span>
                  {' '}
                  {isQuiz ? (
                    <>
                      fez o quiz de <span className="font-medium">{getLessonTitle(a.lessonId)}</span>
                      {pct >= 0 && <span className={`ml-1 font-medium ${scoreColor(pct)}`}>({a.score}/{a.total})</span>}
                    </>
                  ) : (
                    <>concluiu <span className="font-medium">{getLessonTitle(a.lessonId)}</span></>
                  )}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {relativeTime(a.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{icon}<span className="text-[11px]">{label}</span></div>
      <p className={`text-xl font-bold ${color ?? ''}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function ThSort({ label, sortKey: sk, currentKey, dir, onClick, title }: { label: string; sortKey: SortKey; currentKey: SortKey; dir: SortDir; onClick: (k: SortKey) => void; title?: string }) {
  return (
    <th
      className="text-left px-3 py-2.5 font-medium text-xs whitespace-nowrap select-none cursor-pointer hover:bg-muted/40 transition-colors"
      onClick={() => onClick(sk)}
      title={title}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon active={currentKey === sk} dir={dir} />
      </span>
    </th>
  );
}

