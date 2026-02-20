import { useState } from 'react';
import type { CodeFillExercise } from '@/data/types';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  exercise: CodeFillExercise;
  index: number;
}

export default function CodeFillExerciseBox({ exercise, index }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const correct = selectedIndex === exercise.correctIndex;
  const showResult = submitted && selectedIndex !== null;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setSubmitted(false);
  };

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Complete o código</span>
        {index > 0 && <span className="text-muted-foreground text-xs">({index + 1})</span>}
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-foreground/90">{exercise.instruction}</p>
        <div className="flex flex-wrap items-center gap-1.5 p-4 rounded-lg bg-code-bg border border-code-border font-mono text-sm min-h-[52px]">
          <span className="text-foreground/80 whitespace-pre">{exercise.snippetBefore}</span>
          <span className="inline-flex flex-wrap gap-1.5">
            {exercise.options.map((opt, i) => {
              const isSelected = selectedIndex === i;
              const isCorrectOpt = i === exercise.correctIndex;
              let btnClass = 'px-3 py-1.5 rounded border font-mono text-sm transition-colors ';
              if (!submitted) {
                btnClass += isSelected
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5';
              } else {
                if (isCorrectOpt) btnClass += 'border-primary bg-primary/20 text-primary';
                else if (isSelected && !correct) btnClass += 'border-destructive/50 bg-destructive/10 text-destructive';
                else btnClass += 'border-border bg-muted/30 text-muted-foreground opacity-70';
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={btnClass}
                  onClick={() => !submitted && setSelectedIndex(i)}
                  disabled={submitted}
                >
                  {opt}
                </button>
              );
            })}
          </span>
          <span className="text-foreground/80 whitespace-pre">{exercise.snippetAfter}</span>
        </div>
        {!submitted ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={selectedIndex === null}
            >
              Verificar resposta
            </Button>
          </div>
        ) : (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${correct ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'}`}>
            {correct ? <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />}
            <div className="text-sm">
              <p className={correct ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                {correct ? 'Correto!' : `Incorreto. O correto é "${exercise.options[exercise.correctIndex]}".`}
              </p>
              {exercise.explanation && <p className="text-muted-foreground mt-1">{exercise.explanation}</p>}
              <Button variant="ghost" size="sm" className="mt-2 h-8 text-xs" onClick={handleReset}>
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
