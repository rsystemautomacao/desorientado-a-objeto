import { useState, useMemo } from 'react';
import { QuizQuestion } from '@/data/types';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizComponent({ questions, onComplete }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const quizQuestions = useMemo(() => shuffle(questions).slice(0, 5), [questions]);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return quizQuestions.reduce((acc, q, i) => acc + (selected[i] === q.correct ? 1 : 0), 0);
  }, [submitted, selected, quizQuestions]);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(score, quizQuestions.length);
  };

  const handleRetry = () => {
    setSelected({});
    setSubmitted(false);
  };

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
                    name={`q-${qi}`}
                    checked={isSelected}
                    onChange={() => !submitted && setSelected({ ...selected, [qi]: oi })}
                    disabled={submitted}
                    className="sr-only"
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
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">
            {score}/{quizQuestions.length} acertos
            {score === quizQuestions.length ? ' 🎉' : score >= 3 ? ' 👍' : ' 💪'}
          </div>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
