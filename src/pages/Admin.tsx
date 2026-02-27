import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { modules } from '@/data/modules';
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
  Sun,
  Moon,
} from 'lucide-react';

const ADMIN_EMAIL = 'rsautomacao2000@gmail.com';
const DEFAULT_ADMIN_KEY = 'desorientado-admin';
const EXTRA_ADMIN_KEY = (import.meta.env.VITE_ADMIN_KEY || '').trim();

const TOTAL_LESSONS = modules.reduce((acc, m) => acc + m.lessons.length, 0);

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

function StudentDetail({ entry }: { entry: StudyHistoryEntry }) {
  return (
    <div className="px-4 py-4 bg-muted/10 space-y-4">
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

// ---------- Main Component ----------

export default function Admin() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get('k') ?? '';
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [entries, setEntries] = useState<StudyHistoryEntry[]>([]);
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
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
              aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
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
          </>
        )}
      </main>
    </div>
  );
}

// ---------- Small components ----------

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

