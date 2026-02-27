import { useState, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import { interviewQuestions } from '@/data/interviewData';
import { Search, ChevronDown, ChevronUp, Lightbulb, PenLine, Eye, RotateCcw, CheckCircle2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'study' | 'practice';

export default function Interview() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [openId, setOpenId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('study');

  // Practice mode state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [practiceIndex, setPracticeIndex] = useState(0);

  const categories = useMemo(() => ['Todas', ...new Set(interviewQuestions.map((q) => q.category))], []);

  const filtered = useMemo(() => {
    return interviewQuestions.filter((q) => {
      const matchCat = catFilter === 'Todas' || q.category === catFilter;
      const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) || q.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [catFilter, search]);

  const shuffled = useMemo(() => {
    // Shuffle a copy using Fisher-Yates when entering practice mode
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, mode]); // re-shuffle when mode changes

  const handleReveal = useCallback((id: string) => {
    setRevealedIds((prev) => new Set(prev).add(id));
  }, []);

  const handlePracticeAnswer = useCallback((id: string, value: string) => {
    setPracticeAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const resetPractice = useCallback(() => {
    setPracticeAnswers({});
    setRevealedIds(new Set());
    setPracticeIndex(0);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setOpenId(null);
    if (m === 'practice') resetPractice();
  }, [resetPractice]);

  const practiceQuestions = mode === 'practice' ? shuffled : [];
  const currentPracticeQ = practiceQuestions[practiceIndex] ?? null;
  const practiceTotal = practiceQuestions.length;
  const practiceAnswered = revealedIds.size;

  const levelColors = { basico: 'bg-primary/10 text-primary', intermediario: 'bg-accent/10 text-accent', avancado: 'bg-destructive/10 text-destructive' };
  const levelLabels = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' };

  return (
    <Layout>
      <div className="container py-10 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">Perguntas de Entrevista</h1>
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => switchMode('study')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'study' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Eye className="h-3.5 w-3.5" /> Estudar
            </button>
            <button
              onClick={() => switchMode('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'practice' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <PenLine className="h-3.5 w-3.5" /> Praticar
            </button>
          </div>
        </div>
        <p className="text-muted-foreground mb-8">
          {mode === 'study'
            ? 'Prepare-se para processos seletivos com perguntas reais'
            : 'Escreva sua resposta antes de ver a correta — simule uma entrevista real'}
        </p>

        {/* Filters (both modes) */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar pergunta..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => { setCatFilter(c); if (mode === 'practice') resetPractice(); }} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ===== STUDY MODE ===== */}
        {mode === 'study' && (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div key={q.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <button onClick={() => setOpenId(openId === q.id ? null : q.id)} className="w-full flex items-center gap-3 p-5 text-left">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{q.question}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[q.level]}`}>{levelLabels[q.level]}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{q.category}</span>
                    </div>
                  </div>
                  {openId === q.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>
                {openId === q.id && (
                  <div className="px-5 pb-5 border-t border-border pt-4 space-y-4 animate-fade-in">
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-2">Resposta:</h4>
                      <p className="text-sm text-foreground/85 whitespace-pre-line">{q.answer}</p>
                    </div>
                    {q.code && <CodeBlock code={q.code} title="Exemplo" />}
                    <div className="flex gap-2 items-start p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground/80">{q.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== PRACTICE MODE ===== */}
        {mode === 'practice' && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${practiceTotal > 0 ? (practiceAnswered / practiceTotal) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{practiceAnswered}/{practiceTotal}</span>
              <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs" onClick={resetPractice}>
                <RotateCcw className="h-3 w-3" /> Recomecar
              </Button>
            </div>

            {/* Practice card */}
            {currentPracticeQ ? (
              <PracticeCard
                key={currentPracticeQ.id}
                q={currentPracticeQ}
                userAnswer={practiceAnswers[currentPracticeQ.id] ?? ''}
                revealed={revealedIds.has(currentPracticeQ.id)}
                onAnswer={handlePracticeAnswer}
                onReveal={handleReveal}
                levelColors={levelColors}
                levelLabels={levelLabels}
                index={practiceIndex}
                total={practiceTotal}
                onPrev={() => setPracticeIndex((i) => Math.max(0, i - 1))}
                onNext={() => setPracticeIndex((i) => Math.min(practiceTotal - 1, i + 1))}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma pergunta encontrada com esse filtro.
              </div>
            )}

            {/* Completed message */}
            {practiceTotal > 0 && practiceAnswered === practiceTotal && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                <p className="font-semibold text-lg">Parabens! Voce praticou todas as {practiceTotal} perguntas.</p>
                <p className="text-sm text-muted-foreground">Revise suas respostas navegando entre as perguntas, ou recomece para praticar novamente.</p>
                <Button variant="outline" className="gap-2" onClick={resetPractice}>
                  <Shuffle className="h-4 w-4" /> Embaralhar e recomecar
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

// ---------- Practice Card Component ----------

interface PracticeCardProps {
  q: { id: string; category: string; level: 'basico' | 'intermediario' | 'avancado'; question: string; answer: string; code?: string; tip: string };
  userAnswer: string;
  revealed: boolean;
  onAnswer: (id: string, value: string) => void;
  onReveal: (id: string) => void;
  levelColors: Record<string, string>;
  levelLabels: Record<string, string>;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function PracticeCard({ q, userAnswer, revealed, onAnswer, onReveal, levelColors, levelLabels, index, total, onPrev, onNext }: PracticeCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Question header */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[q.level]}`}>{levelLabels[q.level]}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{q.category}</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {index + 1} de {total}
          </span>
        </div>
        <p className="font-semibold text-base">{q.question}</p>
      </div>

      {/* User answer area */}
      <div className="px-5 pb-4 space-y-3">
        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <PenLine className="h-3.5 w-3.5" />
          Sua resposta:
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => onAnswer(q.id, e.target.value)}
          placeholder="Escreva como voce responderia numa entrevista..."
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[80px]"
          disabled={revealed}
        />

        {/* Reveal button */}
        {!revealed && (
          <Button
            onClick={() => onReveal(q.id)}
            className="gap-2"
            variant={userAnswer.trim().length > 0 ? 'default' : 'outline'}
          >
            <Eye className="h-4 w-4" />
            {userAnswer.trim().length > 0 ? 'Ver resposta esperada' : 'Pular e ver resposta'}
          </Button>
        )}

        {/* Revealed answer */}
        {revealed && (
          <div className="space-y-4 border-t border-border pt-4 animate-fade-in">
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2">Resposta esperada:</h4>
              <p className="text-sm text-foreground/85 whitespace-pre-line">{q.answer}</p>
            </div>
            {q.code && <CodeBlock code={q.code} title="Exemplo" />}
            <div className="flex gap-2 items-start p-3 rounded-lg bg-accent/5 border border-accent/20">
              <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">{q.tip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onPrev} disabled={index === 0} className="gap-1 text-xs">
          Anterior
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} disabled={index === total - 1} className="gap-1 text-xs">
          Proxima
        </Button>
      </div>
    </div>
  );
}
