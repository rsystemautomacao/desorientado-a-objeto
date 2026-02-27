import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Loader2, LogOut, User, Search, Download, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  modules,
  getAllLessons,
} from '@/data/modules';
import {
  type StudyHistoryEntry,
  TOTAL_LESSONS,
  getProgressPct,
  getQuizAccuracy,
  getCurrentTrail,
  formatLastActivity,
  getAlerts,
  computeModuleDifficulty,
} from './adminUtils';

const ADMIN_EMAIL = 'rsautomacao2000@gmail.com';
/** Chave padrão sempre aceita. Opcional: VITE_ADMIN_KEY para uma chave extra. */
const DEFAULT_ADMIN_KEY = 'desorientado-admin';
const EXTRA_ADMIN_KEY = (import.meta.env.VITE_ADMIN_KEY || '').trim();

const PAGE_SIZE = 10;

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === 'string' && base.length > 0) return base.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export default function Admin() {
  const [searchParams] = useSearchParams();
  const key = searchParams.get('k') ?? '';
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [entries, setEntries] = useState<StudyHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [search, setSearch] = useState('');
  const [filterTrail, setFilterTrail] = useState<string>('all');
  const [filterProgress, setFilterProgress] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'progress' | 'lastActivity' | 'accuracy' | 'name'>('progress');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(0);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);

  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  const keyTrimmed = key.trim();
  const keyValid =
    keyTrimmed === DEFAULT_ADMIN_KEY || (EXTRA_ADMIN_KEY.length > 0 && keyTrimmed === EXTRA_ADMIN_KEY);

  const loadHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const token = await user.getIdToken(true);
      const base = getApiBase();
      const url = `${base}/api/admin/study-history`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setHistoryError('Acesso negado. Verifique se ADMIN_EMAIL está correto na Vercel.');
        return;
      }
      if (res.status === 404) {
        setHistoryError('API do admin não encontrada (404). Confira se o deploy inclui a pasta api/admin.');
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        let detail = '';
        try {
          const j = JSON.parse(text);
          if (j.hint) detail = ` ${j.hint}`;
          else if (j.message) detail = ` ${j.message}`;
        } catch {
          if (text.length < 120) detail = ` ${text}`;
        }
        setHistoryError(`Erro ao carregar dados (${res.status}).${detail}`);
        return;
      }
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setHistoryError(`Erro de conexão: ${msg}`);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) {
      loadHistory();
    }
  }, [isAdmin, user?.uid]);

  const filteredEntries = useMemo(() => {
    let list = [...entries];
    const searchLower = search.trim().toLowerCase();
    if (searchLower) {
      list = list.filter(
        (e) =>
          (e.nome && e.nome.toLowerCase().includes(searchLower)) ||
          e.userId.toLowerCase().includes(searchLower)
      );
    }
    if (filterTrail !== 'all') {
      const modId = parseInt(filterTrail, 10);
      list = list.filter((e) => {
        const trail = getCurrentTrail(e);
        const m = modules.find((mo) => mo.id === modId);
        return m && trail.includes(m.title);
      });
    }
    if (filterProgress !== 'all') {
      const [min, max] = filterProgress.split('-').map(Number);
      list = list.filter((e) => {
        const p = getProgressPct(e);
        return p >= min && p <= max;
      });
    }
    if (filterActive !== 'all') {
      const now = Date.now();
      const day = 1000 * 60 * 60 * 24;
      if (filterActive === 'active') {
        list = list.filter((e) => e.updatedAt && now - new Date(e.updatedAt).getTime() < 7 * day);
      } else {
        list = list.filter((e) => !e.updatedAt || now - new Date(e.updatedAt).getTime() >= 7 * day);
      }
    }
    const mult = sortDesc ? 1 : -1;
    list.sort((a, b) => {
      if (sortBy === 'name') {
        return mult * ((a.nome || a.userId).localeCompare(b.nome || b.userId));
      }
      if (sortBy === 'progress') {
        return mult * (getProgressPct(a) - getProgressPct(b));
      }
      if (sortBy === 'lastActivity') {
        const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return mult * (ta - tb);
      }
      if (sortBy === 'accuracy') {
        const aa = getQuizAccuracy(a) ?? -1;
        const ab = getQuizAccuracy(b) ?? -1;
        return mult * (aa - ab);
      }
      return 0;
    });
    return list;
  }, [entries, search, filterTrail, filterProgress, filterActive, sortBy, sortDesc]);

  const totalFiltered = filteredEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedEntries = useMemo(
    () => filteredEntries.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [filteredEntries, currentPage]
  );

  useEffect(() => {
    setPage(0);
  }, [search, filterTrail, filterProgress, filterActive]);

  // Early returns só depois de todos os hooks (evita React error #310)
  if (!keyValid) return <NotFound />;
  if (!authLoading && user && !isAdmin) return <NotFound />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setLoginError('E-mail ou senha incorretos.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Tela de login (apenas quando tem chave válida e não está logado como admin)
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-center mb-4">Acesso restrito</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-muted-foreground mb-1">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-muted-foreground mb-1">
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                autoComplete="current-password"
              />
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

  const totalQuizzes = entries.reduce((acc, e) => acc + Object.keys(e.quizResults).length, 0);
  const totalCompleted = entries.reduce((acc, e) => acc + e.completedCount, 0);
  const avgCompletionPct = entries.length > 0
    ? Math.round((totalCompleted / (entries.length * TOTAL_LESSONS)) * 100)
    : 0;
  const difficultModules = useMemo(() => computeModuleDifficulty(entries), [entries]);

  const exportCsv = () => {
    const headers = ['Nome', 'Trilha atual', 'Progresso %', 'Última atividade', 'Tempo total', 'Exercícios (quizzes)', 'Taxa de acerto %', 'Alertas'];
    const rows = filteredEntries.map((e) => {
      const alerts = getAlerts(e).join('; ');
      return [
        e.nome || e.userId,
        getCurrentTrail(e),
        String(getProgressPct(e)),
        formatLastActivity(e.updatedAt),
        'N/D',
        String(Object.keys(e.quizResults).length),
        getQuizAccuracy(e) ?? 'N/D',
        alerts,
      ];
    });
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `admin-alunos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const detailEntry = detailUserId ? entries.find((e) => e.userId === detailUserId) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Admin — Trilhas Java
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground truncate max-w-[180px]" title={user?.email ?? ''}>
              <User className="h-4 w-4 inline mr-1" />
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {historyError && (
          <div className="mb-4 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-sm flex flex-wrap items-center justify-between gap-3">
            <span className="text-destructive">{historyError}</span>
            <Button variant="outline" size="sm" onClick={() => loadHistory()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {historyLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Carregando dados dos alunos...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Total de alunos</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Alunos ativos (7 dias)</p>
                <p className="text-2xl font-bold">
                  {entries.filter((e) => e.updatedAt && (Date.now() - new Date(e.updatedAt).getTime()) < 7 * 24 * 60 * 60 * 1000).length}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Conclusão média</p>
                <p className="text-2xl font-bold">{avgCompletionPct}%</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Aulas concluídas (total)</p>
                <p className="text-2xl font-bold">
                  {totalCompleted} / {entries.length * TOTAL_LESSONS}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Módulos mais difíceis</p>
                <p className="text-sm font-medium mt-1">
                  {difficultModules.length === 0
                    ? '—'
                    : difficultModules.map((d) => `${d.moduleTitle} (${d.pct}%)`).join(', ')}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">Lista de alunos</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar nome ou ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 w-48"
                    />
                  </div>
                  <Select value={filterTrail} onValueChange={setFilterTrail}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Trilha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas trilhas</SelectItem>
                      {modules.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>{m.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterProgress} onValueChange={setFilterProgress}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Progresso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer</SelectItem>
                      <SelectItem value="0-25">0–25%</SelectItem>
                      <SelectItem value="26-50">26–50%</SelectItem>
                      <SelectItem value="51-75">51–75%</SelectItem>
                      <SelectItem value="76-100">76–100%</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterActive} onValueChange={setFilterActive}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos (7d)</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
                    <Download className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead>
                        <button type="button" className="font-medium hover:underline" onClick={() => { setSortBy('name'); setSortDesc(sortBy === 'name' ? !sortDesc : false); }}>Nome</button>
                      </TableHead>
                      <TableHead>Trilha atual</TableHead>
                      <TableHead>
                        <button type="button" className="font-medium hover:underline" onClick={() => { setSortBy('progress'); setSortDesc(sortBy === 'progress' ? !sortDesc : true); }}>Progresso %</button>
                      </TableHead>
                      <TableHead>
                        <button type="button" className="font-medium hover:underline" onClick={() => { setSortBy('lastActivity'); setSortDesc(sortBy === 'lastActivity' ? !sortDesc : true); }}>Última atividade</button>
                      </TableHead>
                      <TableHead>Tempo total</TableHead>
                      <TableHead>Exercícios</TableHead>
                      <TableHead>
                        <button type="button" className="font-medium hover:underline" onClick={() => { setSortBy('accuracy'); setSortDesc(sortBy === 'accuracy' ? !sortDesc : true); }}>Taxa acerto</button>
                      </TableHead>
                      <TableHead>Alertas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                          {entries.length === 0 ? 'Nenhum dado de estudo ainda.' : 'Nenhum aluno corresponde aos filtros.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedEntries.map((e) => {
                        const alerts = getAlerts(e);
                        return (
                          <TableRow
                            key={e.userId}
                            className="cursor-pointer hover:bg-muted/30"
                            onClick={() => setDetailUserId(e.userId)}
                          >
                            <TableCell title={e.userId}>
                              {e.nome ? e.nome : <span className="text-muted-foreground">id: {e.userId.slice(0, 12)}…</span>}
                            </TableCell>
                            <TableCell>{getCurrentTrail(e)}</TableCell>
                            <TableCell>{getProgressPct(e)}%</TableCell>
                            <TableCell>{formatLastActivity(e.updatedAt)}</TableCell>
                            <TableCell className="text-muted-foreground">N/D</TableCell>
                            <TableCell>{Object.keys(e.quizResults).length}</TableCell>
                            <TableCell>{getQuizAccuracy(e) ?? 'N/D'}%</TableCell>
                            <TableCell>
                              {alerts.length === 0 ? '—' : alerts.map((a) => (
                                <Badge key={a} variant="secondary" className="mr-1 mb-1 text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-0.5 inline" />
                                  {a}
                                </Badge>
                              ))}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground">
                    {totalFiltered} aluno(s) • Página {currentPage + 1} de {totalPages}
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          disabled={currentPage === 0}
                          onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <Button
                            variant={i === currentPage ? 'outline' : 'ghost'}
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setPage(i)}
                          >
                            {i + 1}
                          </Button>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          disabled={currentPage >= totalPages - 1}
                          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>

            {detailEntry && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailUserId(null)}>
                <div className="bg-card border border-border rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(ev) => ev.stopPropagation()}>
                  <div className="sticky top-0 px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                    <h3 className="font-semibold">Detalhe: {detailEntry.nome || detailEntry.userId}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setDetailUserId(null)}>Fechar</Button>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">ID: {detailEntry.userId}</p>
                    <p className="text-sm">Tipo: {detailEntry.tipo || '—'} • Curso: {detailEntry.curso || '—'} • Série: {detailEntry.serieOuSemestre || '—'}</p>
                    <p className="text-sm">Última atualização (perfil): {detailEntry.updatedAt ? new Date(detailEntry.updatedAt).toLocaleString('pt-BR') : 'N/D'}</p>
                    <div>
                      <h4 className="font-medium mb-2">Progresso por módulo</h4>
                      <div className="space-y-2">
                        {modules.map((m) => {
                          const done = m.lessons.filter((l) => detailEntry.completedLessons.includes(l.id)).length;
                          const pct = m.lessons.length > 0 ? Math.round((done / m.lessons.length) * 100) : 0;
                          return (
                            <div key={m.id}>
                              <div className="flex justify-between text-sm mb-0.5">
                                <span>{m.icon} {m.title}</span>
                                <span>{done}/{m.lessons.length} ({pct}%)</span>
                              </div>
                              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Quizzes por aula (acertos/total)</h4>
                      <ul className="text-sm space-y-1">
                        {Object.entries(detailEntry.quizResults).map(([lessonId, res]) => {
                          const lesson = getAllLessons().find((l) => l.id === lessonId);
                          const pct = res.total > 0 ? Math.round((res.score / res.total) * 100) : 0;
                          const weak = pct < 60;
                          return (
                            <li key={lessonId} className={weak ? 'text-amber-600 dark:text-amber-400' : ''}>
                              {lesson ? lesson.title : lessonId}: {res.score}/{res.total} ({pct}%) {weak && '• Dificuldade'}
                            </li>
                          );
                        })}
                        {Object.keys(detailEntry.quizResults).length === 0 && <li className="text-muted-foreground">Nenhum quiz realizado.</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Pontos de dificuldade</h4>
                      <p className="text-sm text-muted-foreground">
                        {Object.entries(detailEntry.quizResults)
                          .filter(([, r]) => r.total > 0 && r.score / r.total < 0.6)
                          .map(([lid]) => getAllLessons().find((l) => l.id === lid)?.title || lid)
                          .join(', ') || 'Nenhum (taxa > 60% nas aulas com quiz).'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
