import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import InfoBox from '@/components/InfoBox';
import QuizComponent from '@/components/QuizComponent';
import TryItBox from '@/components/TryItBox';
import CodeFillExerciseBox from '@/components/CodeFillExerciseBox';
import LessonNotes from '@/components/LessonNotes';
import { modules, getAdjacentLessons, getAllLessons } from '@/data/modules';
import { lessonContents } from '@/data/lessonContents';
import { quizQuestions } from '@/data/quizData';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, StarOff, Target, Printer, AlertTriangle, ThumbsUp, ThumbsDown, History } from 'lucide-react';

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  return typeof base === 'string' && base.length > 0 ? base.replace(/\/$/, '') : (typeof window !== 'undefined' ? window.location.origin : '');
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const { isCompleted, completeLesson, uncompleteLesson, isFavorite, toggleFavorite, saveQuizResult, getQuizHistory, addStudyTime } = useProgress();
  const { user } = useAuth();

  // Track study time
  const enterTimeRef = useRef(Date.now());
  useEffect(() => {
    enterTimeRef.current = Date.now();
    return () => {
      if (id) {
        const seconds = Math.floor((Date.now() - enterTimeRef.current) / 1000);
        addStudyTime(id, seconds);
      }
    };
  }, [id, addStudyTime]);

  // Feedback state
  const [myVote, setMyVote] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    if (!id) return;
    const base = getApiBase();
    const fetchFeedback = async () => {
      try {
        const headers: Record<string, string> = {};
        if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
        const r = await fetch(`${base}/api/feedback`, { headers });
        if (!r.ok) return;
        const d = await r.json();
        if (d?.summary?.[id]) {
          setLikes(d.summary[id].likes);
          setDislikes(d.summary[id].dislikes);
        }
        if (d?.myVotes?.[id]) {
          setMyVote(d.myVotes[id] as 'like' | 'dislike');
        }
      } catch { /* silent */ }
    };
    fetchFeedback();
  }, [id, user]);

  const handleVote = useCallback(async (vote: 'like' | 'dislike') => {
    if (!user || !id) return;
    const isUndo = myVote === vote;
    const newVote = isUndo ? 'none' : vote;

    // Optimistic update
    if (isUndo) {
      if (vote === 'like') setLikes((l) => Math.max(0, l - 1));
      else setDislikes((d) => Math.max(0, d - 1));
      setMyVote(null);
    } else {
      if (myVote === 'like') setLikes((l) => Math.max(0, l - 1));
      if (myVote === 'dislike') setDislikes((d) => Math.max(0, d - 1));
      if (vote === 'like') setLikes((l) => l + 1);
      else setDislikes((d) => d + 1);
      setMyVote(vote);
    }

    try {
      const token = await user.getIdToken();
      const base = getApiBase();
      await fetch(`${base}/api/feedback`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: id, vote: newVote }),
      });
    } catch { /* silent — optimistic update stays */ }
  }, [user, id, myVote]);

  if (!id) return null;

  const allLessons = getAllLessons();
  const lessonMeta = allLessons.find((l) => l.id === id);
  const content = lessonContents[id];
  const { prev, next } = getAdjacentLessons(id);
  const lessonQuiz = quizQuestions.filter((q) => q.lessonId === id);
  const done = isCompleted(id);
  const fav = isFavorite(id);
  const mod = modules.find((m) => m.id === lessonMeta?.moduleId);

  if (!lessonMeta) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Aula não encontrada</h1>
          <Link to="/trilha" className="text-primary hover:underline">Voltar à trilha</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-10 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/trilha" className="hover:text-foreground">Trilha</Link>
          <span>/</span>
          <span>Módulo {lessonMeta.moduleId} — {mod?.title}</span>
        </div>

        {/* Prerequisite warning */}
        {(() => {
          if (!mod || mod.id <= 1) return null;
          const prevMod = modules.find((m) => m.id === mod.id - 1);
          if (!prevMod) return null;
          const prevDone = prevMod.lessons.filter((l) => isCompleted(l.id)).length;
          const prevPct = Math.round((prevDone / prevMod.lessons.length) * 100);
          if (prevPct >= 70) return null;
          return (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-800 text-sm print:hidden">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Recomendamos concluir o <strong>{prevMod.icon} Modulo {prevMod.id} — {prevMod.title}</strong> antes
                ({prevDone}/{prevMod.lessons.length} concluidas).
                <Link to="/trilha" className="ml-1 underline hover:text-yellow-900">Ver trilha</Link>
              </p>
            </div>
          );
        })()}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3">{lessonMeta.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">{lessonMeta.duration}</span>
              <button
                onClick={() => done ? uncompleteLesson(id) : completeLesson(id)}
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-colors ${done ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {done ? 'Concluída' : 'Marcar como concluída'}
              </button>
              <button onClick={() => toggleFavorite(id)} className="p-1">
                {fav ? <Star className="h-5 w-5 text-accent fill-accent" /> : <StarOff className="h-5 w-5 text-muted-foreground hover:text-accent" />}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors print:hidden"
                title="Imprimir / Salvar como PDF"
              >
                <Printer className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Objectives */}
        {content?.objectives && (
          <div className="mb-8 p-5 rounded-xl border border-border bg-card">
            <h2 className="font-bold flex items-center gap-2 mb-3"><Target className="h-5 w-5 text-primary" /> Objetivos da Aula</h2>
            <ul className="space-y-1.5">
              {content.objectives.map((o, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Sections */}
        {content?.sections.map((s, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-xl font-bold mb-3">{s.title}</h2>
            <div className="text-foreground/85 leading-relaxed whitespace-pre-line text-sm">{s.body}</div>
            {s.code && <CodeBlock code={s.code} title="Java" />}
            {s.codeExplanation && (
              <div className="mt-2 p-4 rounded-lg bg-secondary text-sm text-foreground/80">
                <span className="font-semibold text-primary">Explicação: </span>{s.codeExplanation}
              </div>
            )}
            {s.tip && <InfoBox type="tip">{s.tip}</InfoBox>}
            {s.warning && <InfoBox type="warning">{s.warning}</InfoBox>}
            {s.tryItCode && (
              <div className="mt-6">
                <TryItBox initialCode={s.tryItCode} prompt={s.tryItPrompt} />
              </div>
            )}
          </section>
        ))}

        {/* With/Without POO Comparison */}
        {content?.withoutPoo && content?.withPoo && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">🔄 Com POO vs Sem POO</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-destructive mb-2">❌ Sem POO (Procedural)</h3>
                <CodeBlock code={content.withoutPoo} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">✅ Com POO</h3>
                <CodeBlock code={content.withPoo} />
              </div>
            </div>
            {content.comparisonExplanation && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                {content.comparisonExplanation}
              </div>
            )}
          </section>
        )}

        {/* Common Errors */}
        {content?.commonErrors && content.commonErrors.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">⚠️ Erros Comuns e Como Evitar</h2>
            <div className="space-y-3">
              {content.commonErrors.map((e, i) => (
                <div key={i} className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                  <p className="font-semibold text-sm text-accent">{e.title}</p>
                  <p className="text-sm text-foreground/80 mt-1">{e.description}</p>
                  {e.code && <CodeBlock code={e.code} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Complete o código */}
        {content?.codeFillExercises && content.codeFillExercises.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">✏️ Complete o código</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione o trecho correto para completar cada código e clique em <strong>Verificar resposta</strong>.
            </p>
            <div className="space-y-6">
              {content.codeFillExercises.map((ex, i) => (
                <CodeFillExerciseBox key={i} exercise={ex} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Experimente aqui — bloco da aula inteira */}
        {content?.tryItCode && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">🧪 Teste o que você aprendeu</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Edite o código abaixo, clique em <strong>Executar</strong> e veja o resultado. Você pode alterar valores, mensagens e experimentar à vontade.
            </p>
            <TryItBox initialCode={content.tryItCode} prompt={content.tryItPrompt} />
          </section>
        )}

        {/* Summary */}
        {content?.summary && (
          <section className="mb-10 p-5 rounded-xl border border-primary/20 bg-primary/5">
            <h2 className="font-bold mb-3">📝 O que Você Precisa Lembrar</h2>
            <ul className="space-y-1.5">
              {content.summary.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quiz */}
        {lessonQuiz.length > 0 && (
          <section className="mb-10 p-6 rounded-xl border border-border bg-card">
            <QuizComponent
              questions={lessonQuiz}
              onComplete={(score, total) => saveQuizResult(id, score, total)}
            />
          </section>
        )}

        {/* Quiz History */}
        {(() => {
          const history = getQuizHistory(id);
          if (history.length === 0) return null;
          return (
            <div className="mb-8 print:hidden">
              <details className="rounded-xl border border-border bg-card overflow-hidden">
                <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer hover:bg-muted/30 transition-colors text-sm font-medium">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Historico de tentativas ({history.length})
                </summary>
                <div className="px-5 pb-4">
                  <div className="space-y-1.5 mt-2">
                    {[...history].reverse().map((h, i) => {
                      const pct = h.total > 0 ? Math.round((h.score / h.total) * 100) : 0;
                      const color = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500';
                      const bg = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500';
                      return (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground w-16 shrink-0">
                            {new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`font-medium w-20 text-right ${color}`}>
                            {h.score}/{h.total} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>
            </div>
          );
        })()}

        {/* Personal Notes */}
        <LessonNotes lessonId={id} />

        {/* Feedback */}
        <div className="my-8 p-5 rounded-xl border border-border bg-card text-center print:hidden">
          <p className="text-sm font-medium mb-3">O que achou desta aula?</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleVote('like')}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                myVote === 'like'
                  ? 'border-green-500 bg-green-500/10 text-green-700'
                  : 'border-border hover:border-green-500/50 hover:bg-green-500/5 text-muted-foreground'
              }`}
              title={user ? 'Gostei' : 'Faca login para avaliar'}
            >
              <ThumbsUp className={`h-4 w-4 ${myVote === 'like' ? 'fill-green-500' : ''}`} />
              {likes > 0 && <span>{likes}</span>}
            </button>
            <button
              onClick={() => handleVote('dislike')}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                myVote === 'dislike'
                  ? 'border-red-500 bg-red-500/10 text-red-700'
                  : 'border-border hover:border-red-500/50 hover:bg-red-500/5 text-muted-foreground'
              }`}
              title={user ? 'Nao gostei' : 'Faca login para avaliar'}
            >
              <ThumbsDown className={`h-4 w-4 ${myVote === 'dislike' ? 'fill-red-500' : ''}`} />
              {dislikes > 0 && <span>{dislikes}</span>}
            </button>
          </div>
          {!user && <p className="text-xs text-muted-foreground mt-2">Faca login para avaliar</p>}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          {prev ? (
            <Link to={`/aula/${prev.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {prev.title}
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`/aula/${next.id}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
              {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
}
