import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { modules, getAllLessons } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileFromApi } from '@/lib/profileStore';
import { getLevel, getReviewSuggestions } from '@/lib/progressStore';
import CertificateModal from '@/components/CertificateModal';
import { Trophy, BookOpen, Target, Star, ArrowRight, Award, Flame, Zap } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';

export default function Dashboard() {
  const { progress, isCompleted } = useProgress();
  const { user } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [certModule, setCertModule] = useState<typeof modules[number] | null>(null);

  useEffect(() => {
    if (!user) return;
    user.getIdToken(true).then((token) =>
      getProfileFromApi(token).then((p) => setStudentName(p.nome || user.displayName || 'Aluno'))
    ).catch(() => setStudentName(user.displayName || 'Aluno'));
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
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-border bg-card p-6">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <p className="text-3xl font-bold">{completedCount}<span className="text-lg text-muted-foreground">/{totalLessons}</span></p>
            <p className="text-sm text-muted-foreground">Aulas concluídas</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Target className="h-8 w-8 text-accent mb-3" />
            <p className="text-3xl font-bold">{quizPct}%</p>
            <p className="text-sm text-muted-foreground">Acerto nos quizzes ({totalCorrect}/{totalQuestions})</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Trophy className="h-8 w-8 text-primary mb-3" />
            <p className="text-3xl font-bold">{pctTotal}%</p>
            <p className="text-sm text-muted-foreground">Progresso total</p>
          </div>
        </div>

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
