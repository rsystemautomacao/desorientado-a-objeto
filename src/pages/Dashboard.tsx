import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { modules, getAllLessons } from '@/data/modules';
import { exercises } from '@/data/exercises';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileFromApi } from '@/lib/profileStore';
import { getLevel, getReviewSuggestions } from '@/lib/progressStore';
import CertificateModal from '@/components/CertificateModal';
import { Trophy, BookOpen, Target, Star, ArrowRight, Award, Flame, Zap, Info, AlertTriangle, PartyPopper, Medal, Crown, Users, Clock, Code2 } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';

export default function Dashboard() {
  const { progress, isCompleted, getStudyTimes, getExerciseData } = useProgress();
  const { user } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [certModule, setCertModule] = useState<typeof modules[number] | null>(null);
  const [announcements, setAnnouncements] = useState<{ id: string; message: string; type: string }[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ rank: number; name: string; xp: number; lessonsCount: number; quizCount: number }[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; name: string; xp: number; lessonsCount: number; quizCount: number } | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    if (!user) return;
    user.getIdToken(true).then((token) =>
      getProfileFromApi(token).then((p) => setStudentName(p.nome || user.displayName || 'Aluno'))
    ).catch(() => setStudentName(user.displayName || 'Aluno'));
  }, [user]);

  // Load announcements
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL
      ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
      : (typeof window !== 'undefined' ? window.location.origin : '');
    fetch(`${base}/api/announcements`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.announcements) setAnnouncements(d.announcements); })
      .catch(() => {});
  }, []);

  // Load leaderboard
  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL
      ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '')
      : (typeof window !== 'undefined' ? window.location.origin : '');
    const fetchLeaderboard = async () => {
      try {
        const headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }
        const r = await fetch(`${base}/api/leaderboard`, { headers });
        if (!r.ok) return;
        const d = await r.json();
        if (d?.leaderboard) setLeaderboard(d.leaderboard);
        if (d?.me) setMyRank(d.me);
        if (typeof d?.totalStudents === 'number') setTotalStudents(d.totalStudents);
      } catch { /* silent */ }
    };
    fetchLeaderboard();
  }, [user]);

  const allLessons = getAllLessons();
  const totalLessons = allLessons.length;
  const completedCount = progress.completedLessons.length;
  const pctTotal = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const quizEntries = Object.entries(progress.quizResults);
  const totalCorrect = quizEntries.reduce((a, [, v]) => a + v.score, 0);
  const totalQuestions = quizEntries.reduce((a, [, v]) => a + v.total, 0);
  const quizPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Spaced repetition review suggestions
  const reviewSuggestions = getReviewSuggestions(progress);
  const reviewLessons = reviewSuggestions
    .map((s) => ({ ...s, lesson: allLessons.find((l) => l.id === s.lessonId) }))
    .filter((s) => s.lesson);

  const favLessons = allLessons.filter((l) => progress.favorites.includes(l.id));

  return (
    <Layout>
      <div className="container py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Dashboard do Aluno</h1>

        {/* Announcements from teacher */}
        {announcements.length > 0 && (
          <div className="space-y-2 mb-6">
            {announcements.map((a) => {
              const styles = a.type === 'warning'
                ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-800'
                : a.type === 'success'
                ? 'border-green-500/40 bg-green-500/10 text-green-800'
                : 'border-blue-500/40 bg-blue-500/10 text-blue-800';
              const Icon = a.type === 'warning' ? AlertTriangle : a.type === 'success' ? PartyPopper : Info;
              return (
                <div key={a.id} className={`flex items-start gap-3 p-4 rounded-lg border ${styles}`}>
                  <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{a.message}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* XP & Streak bar */}
        {(() => {
          const lvl = getLevel(progress.xp);
          const pctXp = lvl.xpForNext > 0 ? Math.round((lvl.xpInLevel / lvl.xpForNext) * 100) : 100;
          return (
            <div className="rounded-xl border border-border bg-card p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-7 w-7 text-yellow-500" />
                  <div>
                    <p className="text-sm font-semibold">Nível {lvl.level} — {lvl.title}</p>
                    <p className="text-xs text-muted-foreground">{progress.xp} XP total{lvl.xpForNext > 0 ? ` • ${lvl.xpForNext - lvl.xpInLevel} XP para o próximo nível` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className={`h-6 w-6 ${progress.streak.current > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                  <div className="text-right">
                    <p className="text-lg font-bold">{progress.streak.current} dia{progress.streak.current !== 1 ? 's' : ''}</p>
                    <p className="text-xs text-muted-foreground">streak {progress.streak.longest > 0 ? `(recorde: ${progress.streak.longest})` : ''}</p>
                  </div>
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mt-3">
                <div className="h-full rounded-full bg-yellow-500 transition-all duration-500" style={{ width: `${pctXp}%` }} />
              </div>
            </div>
          );
        })()}

        {/* Stats */}
        {(() => {
          const studyTimes = getStudyTimes();
          const totalSeconds = Object.values(studyTimes).reduce((a, b) => a + b, 0);
          const exData = getExerciseData();
          const exCompleted = Object.values(exData).filter((e) => e.passed).length;
          const exTotal = exercises.length;
          const formatTime = (s: number) => {
            if (s < 60) return `${s}s`;
            const mins = Math.floor(s / 60);
            if (mins < 60) return `${mins}min`;
            const hrs = Math.floor(mins / 60);
            const remMins = mins % 60;
            return remMins > 0 ? `${hrs}h ${remMins}min` : `${hrs}h`;
          };
          return (
            <>
              <div className="grid sm:grid-cols-5 gap-4 mb-10">
                <div className="rounded-xl border border-border bg-card p-6">
                  <BookOpen className="h-8 w-8 text-primary mb-3" />
                  <p className="text-3xl font-bold">{completedCount}<span className="text-lg text-muted-foreground">/{totalLessons}</span></p>
                  <p className="text-sm text-muted-foreground">Aulas concluidas</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <Target className="h-8 w-8 text-accent mb-3" />
                  <p className="text-3xl font-bold">{quizPct}%</p>
                  <p className="text-sm text-muted-foreground">Acerto nos quizzes ({totalCorrect}/{totalQuestions})</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <Code2 className="h-8 w-8 text-purple-500 mb-3" />
                  <p className="text-3xl font-bold">{exCompleted}<span className="text-lg text-muted-foreground">/{exTotal}</span></p>
                  <p className="text-sm text-muted-foreground">Exercícios resolvidos</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <Trophy className="h-8 w-8 text-primary mb-3" />
                  <p className="text-3xl font-bold">{pctTotal}%</p>
                  <p className="text-sm text-muted-foreground">Progresso total</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <Clock className="h-8 w-8 text-blue-500 mb-3" />
                  <p className="text-3xl font-bold">{formatTime(totalSeconds)}</p>
                  <p className="text-sm text-muted-foreground">Tempo de estudo</p>
                </div>
              </div>

              {/* Study time per lesson (collapsible) */}
              {totalSeconds > 0 && (
                <div className="mb-10">
                  <details className="rounded-xl border border-border bg-card overflow-hidden">
                    <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-muted/30 transition-colors text-sm font-medium">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Tempo de estudo por aula
                    </summary>
                    <div className="px-5 pb-4 space-y-1.5 mt-1">
                      {allLessons
                        .filter((l) => studyTimes[l.id] > 0)
                        .sort((a, b) => (studyTimes[b.id] ?? 0) - (studyTimes[a.id] ?? 0))
                        .map((l) => {
                          const secs = studyTimes[l.id] ?? 0;
                          const maxSecs = Math.max(...Object.values(studyTimes));
                          const barPct = maxSecs > 0 ? Math.round((secs / maxSecs) * 100) : 0;
                          return (
                            <div key={l.id} className="flex items-center gap-3 text-xs">
                              <span className="truncate w-40 shrink-0" title={l.title}>{l.title}</span>
                              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${barPct}%` }} />
                              </div>
                              <span className="font-medium text-muted-foreground w-16 text-right">{formatTime(secs)}</span>
                            </div>
                          );
                        })}
                    </div>
                  </details>
                </div>
              )}
            </>
          );
        })()}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" /> Ranking da Turma
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {totalStudents} aluno{totalStudents !== 1 ? 's' : ''}
              </span>
            </div>

            {/* My position banner */}
            {myRank && myRank.rank > 3 && (
              <div className="flex items-center gap-3 p-3 mb-3 rounded-lg border border-primary/30 bg-primary/5">
                <span className="text-sm font-bold text-primary w-8 text-center">#{myRank.rank}</span>
                <span className="text-sm font-semibold flex-1">{myRank.name} (Voce)</span>
                <span className="text-xs font-medium text-yellow-600">{myRank.xp} XP</span>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {leaderboard.map((entry, i) => {
                const isMe = myRank && entry.rank === myRank.rank && entry.xp === myRank.xp;
                const medalColors = [
                  'text-yellow-500', // gold
                  'text-gray-400',   // silver
                  'text-amber-600',  // bronze
                ];
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      i > 0 ? 'border-t border-border' : ''
                    } ${isMe ? 'bg-primary/5' : ''}`}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center shrink-0">
                      {entry.rank <= 3 ? (
                        <Medal className={`h-5 w-5 ${medalColors[entry.rank - 1]}`} />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Name */}
                    <span className={`text-sm flex-1 ${entry.rank <= 3 ? 'font-bold' : 'font-medium'} ${isMe ? 'text-primary' : ''}`}>
                      {entry.name}{isMe ? ' (Voce)' : ''}
                    </span>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1" title="Aulas concluidas">
                        <BookOpen className="h-3.5 w-3.5" /> {entry.lessonsCount}
                      </span>
                      <span className="flex items-center gap-1" title="Quizzes feitos">
                        <Target className="h-3.5 w-3.5" /> {entry.quizCount}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm font-bold ${entry.rank === 1 ? 'text-yellow-600' : entry.rank === 2 ? 'text-gray-500' : entry.rank === 3 ? 'text-amber-600' : ''}`}>
                        {entry.xp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress per module */}
        <h2 className="text-xl font-bold mb-4">Progresso por Módulo</h2>
        <div className="space-y-4 mb-10">
          {modules.map((m) => {
            const done = m.lessons.filter((l) => isCompleted(l.id)).length;
            const pct = Math.round((done / m.lessons.length) * 100);
            const isModuleComplete = done === m.lessons.length;
            return (
              <div key={m.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{m.icon} Módulo {m.id} — {m.title}</h3>
                  <div className="flex items-center gap-3">
                    {isModuleComplete && (
                      <button
                        onClick={() => setCertModule(m)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        <Award className="h-4 w-4" />
                        Certificado
                      </button>
                    )}
                    <span className="text-sm text-muted-foreground">{done}/{m.lessons.length}</span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isModuleComplete ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {quizEntries.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Radial progress per module */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold mb-4">Progresso por Módulo</h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="30%" outerRadius="90%"
                  data={modules.map((m, i) => {
                    const done = m.lessons.filter((l) => isCompleted(l.id)).length;
                    const pctM = Math.round((done / m.lessons.length) * 100);
                    const colors = ['#22c55e', '#eab308', '#ef4444'];
                    return { name: `M${m.id}`, value: pctM, fill: colors[i] ?? '#667eea' };
                  })}
                  startAngle={180}
                  endAngle={0}
                  barSize={16}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'hsl(var(--secondary))' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                {modules.map((m, i) => {
                  const colors = ['#22c55e', '#eab308', '#ef4444'];
                  const done = m.lessons.filter((l) => isCompleted(l.id)).length;
                  return (
                    <div key={m.id} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
                      <span>M{m.id} ({done}/{m.lessons.length})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz scores bar chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold mb-4">Desempenho nos Quizzes</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={quizEntries.map(([id, v]) => {
                    const lesson = allLessons.find((l) => l.id === id);
                    const pctQ = Math.round((v.score / v.total) * 100);
                    return { name: lesson?.title?.slice(0, 15) ?? id, pct: pctQ, score: v.score, total: v.total };
                  })}
                  margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    formatter={(value: number, _: string, entry: { payload: { score: number; total: number } }) => [`${entry.payload.score}/${entry.payload.total} (${value}%)`, 'Acerto']}
                  />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                    {quizEntries.map(([id, v], i) => {
                      const pctQ = v.total > 0 ? v.score / v.total : 0;
                      const color = pctQ >= 0.8 ? '#22c55e' : pctQ >= 0.6 ? '#eab308' : '#ef4444';
                      return <Cell key={`cell-${i}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground text-center mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /> ≥80%
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mx-1 ml-3" /> ≥60%
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mx-1 ml-3" /> &lt;60%
              </p>
            </div>
          </div>
        )}

        {/* Spaced repetition review suggestions */}
        {reviewLessons.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">🔄 Sugestões de Revisão</h2>
            <p className="text-sm text-muted-foreground mb-3">Baseado no seu desempenho e tempo desde o último estudo:</p>
            <div className="space-y-2">
              {reviewLessons.map((s) => s.lesson && (
                <Link key={s.lessonId} to={`/aula/${s.lessonId}`} className="flex items-center justify-between p-4 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div>
                    <span className="text-sm font-medium">{s.lesson.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favLessons.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="h-5 w-5 text-accent fill-accent" /> Favoritos</h2>
            <div className="space-y-2">
              {favLessons.map((l) => (
                <Link key={l.id} to={`/aula/${l.id}`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card card-hover">
                  <span className="text-sm font-medium">{l.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {completedCount === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma aula concluída ainda. Comece sua jornada!</p>
            <Link to="/trilha" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Começar a Estudar <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
        {certModule && (
          <CertificateModal
            open={!!certModule}
            onOpenChange={(open) => { if (!open) setCertModule(null); }}
            studentName={studentName}
            moduleTitle={`Módulo ${certModule.id} — ${certModule.title}`}
            moduleIcon={certModule.icon}
            moduleLevel={certModule.level}
            lessonCount={certModule.lessons.length}
          />
        )}
      </div>
    </Layout>
  );
}
