import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2, LogOut, User } from 'lucide-react';

const ADMIN_EMAIL = 'rsautomacao2000@gmail.com';
/** Chave padrão sempre aceita. Opcional: VITE_ADMIN_KEY para uma chave extra. */
const DEFAULT_ADMIN_KEY = 'desorientado-admin';
const EXTRA_ADMIN_KEY = (import.meta.env.VITE_ADMIN_KEY || '').trim();

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

  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
  const keyTrimmed = key.trim();
  const keyValid =
    keyTrimmed === DEFAULT_ADMIN_KEY || (EXTRA_ADMIN_KEY.length > 0 && keyTrimmed === EXTRA_ADMIN_KEY);

  // Quem não tem a chave correta na URL não pode saber que a página existe
  if (!keyValid) {
    return <NotFound />;
  }

  // Logado com outro email: tratar como 404
  if (!authLoading && user && !isAdmin) {
    return <NotFound />;
  }

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

  // Dashboard admin
  const totalLessons = 30;
  const totalQuizzes = Object.values(entries).reduce((acc, e) => acc + Object.keys(e.quizResults).length, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-14">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Histórico de estudo
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Alunos com progresso</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Aulas concluídas (total)</p>
                <p className="text-2xl font-bold">
                  {entries.reduce((acc, e) => acc + e.completedCount, 0)} / {entries.length * totalLessons}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Quizzes realizados</p>
                <p className="text-2xl font-bold">{totalQuizzes}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex flex-col gap-1">
                <h2 className="font-semibold">Por aluno</h2>
                <p className="text-xs text-muted-foreground">
                  Nome, Tipo, Curso e Série vêm do <strong>Perfil</strong> que o aluno preenche no site. Se estiver em branco, o aluno ainda não acessou a página Perfil.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left px-4 py-3 font-medium">Nome</th>
                      <th className="text-left px-4 py-3 font-medium">Tipo</th>
                      <th className="text-left px-4 py-3 font-medium">Curso</th>
                      <th className="text-left px-4 py-3 font-medium">Série/Sem.</th>
                      <th className="text-left px-4 py-3 font-medium">Aulas concluídas</th>
                      <th className="text-left px-4 py-3 font-medium">Quizzes</th>
                      <th className="text-left px-4 py-3 font-medium">Favoritos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          Nenhum dado de estudo ainda.
                        </td>
                      </tr>
                    ) : (
                      entries.map((e) => (
                        <tr key={e.userId} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-4 py-3" title={e.userId}>
                            {e.nome ? e.nome : <span className="text-muted-foreground">id: {e.userId.slice(0, 12)}…</span>}
                          </td>
                          <td className="px-4 py-3">{e.tipo || '—'}</td>
                          <td className="px-4 py-3">{e.curso || '—'}</td>
                          <td className="px-4 py-3">{e.serieOuSemestre || '—'}</td>
                          <td className="px-4 py-3">
                            {e.completedCount} / {totalLessons}
                          </td>
                          <td className="px-4 py-3">{Object.keys(e.quizResults).length}</td>
                          <td className="px-4 py-3">{e.favorites.length}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
