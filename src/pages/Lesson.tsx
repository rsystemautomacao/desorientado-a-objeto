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
import type { QuizAttempt } from '@/lib/progressStore';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, StarOff, Target, Printer } from 'lucide-react';

const FEATURE_QUIZ_HISTORY =
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env &&
  (import.meta as any).env.VITE_FEATURE_QUIZ_HISTORY === 'true';

const FEATURE_LESSON_TIME =
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env &&
  (import.meta as any).env.VITE_FEATURE_LESSON_TIME === 'true';

function QuizHistorySection({ attempts }: { attempts: QuizAttempt[] }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="mt-4 text-xs text-muted-foreground">
        Histórico de tentativas (quando ativado) aparecerá aqui após você fazer o quiz.
      </div>
    );
  }
  const sorted = [...attempts].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return (
    <div className="mt-4 border-t border-border/60 pt-3">
      <p className="text-xs font-semibold text-muted-foreground mb-2">
        Histórico de tentativas (mais recentes primeiro)
      </p>
      <div className="max-h-40 overflow-y-auto text-xs">
        {sorted.map((att, idx) => {
          const date = new Date(att.timestamp);
          const label = Number.isNaN(date.getTime())
            ? att.timestamp
            : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          return (
            <div key={idx} className="flex items-center justify-between py-0.5 text-muted-foreground">
              <span>{label}</span>
              <span className="font-medium">
                {att.score}/{att.total} ({att.total > 0 ? Math.round((att.score / att.total) * 100) : 0}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const {
    progress,
    isCompleted,
    completeLesson,
    uncompleteLesson,
    isFavorite,
    toggleFavorite,
    saveQuizResult,
    addLessonTime,
  } = useProgress();

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

  // Tempo de estudo por aula (apenas quando a feature estiver ligada)
  if (FEATURE_LESSON_TIME) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const React = require('react') as typeof import('react');
    // usamos um efeito separado para não alterar a ordem dos hooks existentes
    // @ts-expect-error dynamic hook; mantido condicionalmente pela flag de build
    React.useEffect(() => {
      if (!id) return;
      const start = Date.now();
      return () => {
        const elapsedSec = Math.round((Date.now() - start) / 1000);
        if (elapsedSec >= 5) {
          addLessonTime(id, elapsedSec);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
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

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3">{lessonMeta.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">{lessonMeta.duration}</span>
              {FEATURE_LESSON_TIME && (
                <span className="text-xs text-muted-foreground">
                  Tempo estudado:{' '}
                  {progress.lessonTime && progress.lessonTime[id]
                    ? `${Math.round(progress.lessonTime[id] / 60)} min`
                    : 'N/D'}
                </span>
              )}
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
            {FEATURE_QUIZ_HISTORY && (
              <QuizHistorySection attempts={progress.quizHistory?.[id] ?? []} />
            )}
          </section>
        )}

        {/* Personal Notes */}
        <LessonNotes lessonId={id} />

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
