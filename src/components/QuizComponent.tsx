import { useState, useEffect, useMemo, useRef } from 'react';
import { QuizQuestion } from '@/data/types';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  onRetry?: () => void;
  passThreshold?: number; // 0–1, default 0.75
  earnedXp?: number;
  isFirstAttempt?: boolean;
  lessonAutoCompleted?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizComponent({ lessonId, questions, onComplete, onRetry, passThreshold = 0.75, earnedXp, isFirstAttempt, lessonAutoCompleted }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Unique nonce per mount — prevents browser form state restoration across sessions
  const sessionNonce = useRef(Math.random().toString(36).slice(2, 8));

  // Stabilize questions: only shuffle once on mount (or when question IDs change).
  const questionIdsKey = questions.map((q) => q.id).join(',');
  const stableQuestionsRef = useRef<{ key: string; items: QuizQuestion[] }>({ key: '', items: [] });

  const quizQuestions = useMemo(() => {
    if (stableQuestionsRef.current.key === questionIdsKey) {
      return stableQuestionsRef.current.items;
    }
    const shuffled = shuffle(questions).slice(0, 5);
    stableQuestionsRef.current = { key: questionIdsKey, items: shuffled };
    return shuffled;
  }, [questionIdsKey, questions]);

  // Safety net: reset quiz state when the lesson or questions change
  // (handles cases where React reuses the component instance across route changes)
  useEffect(() => {
    setSelected({});
    setSubmitted(false);
    sessionNonce.current = Math.random().toString(36).slice(2, 8);
  }, [lessonId, questionIdsKey]);

  const handleSubmit = () => {
    const finalScore = quizQuestions.reduce(
      (acc, q, i) => acc + (selected[i] === q.correct ? 1 : 0),
      0,
    );
    setSubmitted(true);
    onComplete?.(finalScore, quizQuestions.length);
  };

  const handleRetry = () => {
    setSelected({});
    setSubmitted(false);
    sessionNonce.current = Math.random().toString(36).slice(2, 8);
    onRetry?.();
  };

  const score = useMemo(() => {
    if (!submitted) return 0;
    return quizQuestions.reduce((acc, q, i) => acc + (selected[i] === q.correct ? 1 : 0), 0);
  }, [submitted, selected, quizQuestions]);

  // Radio name prefix unique to this lesson + session (prevents browser form state leaking)
  const radioPrefix = `q-${lessonId}-${sessionNonce.current}`;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        🧪 Teste seus Conhecimentos
      </h3>

      {quizQuestions.map((q, qi) => (
        <div key={q.id} className={`rounded-lg border p-5 ${submitted ? (selected[qi] === q.correct ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5') : 'border-border bg-card'}`}>
          <p className="font-medium mb-1">
            <span className="text-muted-foreground mr-2">{qi + 1}.</span>
            {q.question}
          </p>
          {q.code && (
            <pre className="my-2 p-3 rounded bg-code-bg border border-code-border text-xs font-mono overflow-x-auto">
              {q.code}
            </pre>
          )}
          <div className="space-y-2 mt-3">
            {q.options.map((opt, oi) => {
              const isSelected = selected[qi] === oi;
              const isCorrect = oi === q.correct;
              let optClass = 'border-border hover:border-primary/40 cursor-pointer';
              if (submitted) {
                if (isCorrect) optClass = 'border-primary bg-primary/10';
                else if (isSelected && !isCorrect) optClass = 'border-destructive bg-destructive/10';
                else optClass = 'border-border opacity-60';
              } else if (isSelected) {
                optClass = 'border-primary bg-primary/10';
              }

              return (
                <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${optClass} ${submitted ? 'cursor-default' : ''}`}>
                  <input
                    type="radio"
                    name={`${radioPrefix}-${qi}`}
                    checked={isSelected}
                    onChange={() => !submitted && setSelected({ ...selected, [qi]: oi })}
                    disabled={submitted}
                    className="sr-only"
                    autoComplete="off"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span>{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}
                  {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-destructive ml-auto" />}
                </label>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-3 p-3 rounded-lg bg-secondary text-sm">
              <span className="font-medium text-primary">Explicação:</span> {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selected).length < quizQuestions.length}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verificar Respostas
        </button>
      ) : (
        <div className="space-y-4">
          {/* Score */}
          <div className="text-center">
            <div className="text-3xl font-bold">{score}/{quizQuestions.length}</div>
            <div className="text-muted-foreground text-sm mt-1">
              {Math.round((score / quizQuestions.length) * 100)}% de acertos
            </div>
          </div>

          {/* Pass/fail feedback */}
          {(() => {
            const pct = score / quizQuestions.length;
            const passed = pct >= passThreshold;
            const thresholdPct = Math.round(passThreshold * 100);
            if (passed) {
              return (
                <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-center space-y-1">
                  <p className="font-semibold text-green-700 dark:text-green-400">
                    ✅ {lessonAutoCompleted ? 'Aula concluída automaticamente!' : 'Parabéns! Você atingiu a nota mínima.'}
                  </p>
                  {earnedXp != null && earnedXp > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-500">
                      +{earnedXp} XP{isFirstAttempt && pct >= 0.8 ? ' (bônus de primeira tentativa!)' : ''}
                    </p>
                  )}
                </div>
              );
            }
            return (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-center space-y-1">
                <p className="font-semibold text-destructive">
                  ❌ Você atingiu {Math.round(pct * 100)}% — mínimo exigido: {thresholdPct}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Revise o conteúdo e tente novamente para concluir a aula.
                </p>
                {earnedXp != null && earnedXp > 0 && (
                  <p className="text-sm text-muted-foreground">+{earnedXp} XP registrado.</p>
                )}
              </div>
            );
          })()}

          {/* Retry button */}
          <div className="flex justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
