import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import CodeBlock from '@/components/CodeBlock';
import { interviewQuestions } from '@/data/interviewData';
import { Search, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function Interview() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => ['Todas', ...new Set(interviewQuestions.map((q) => q.category))], []);

  const filtered = useMemo(() => {
    return interviewQuestions.filter((q) => {
      const matchCat = catFilter === 'Todas' || q.category === catFilter;
      const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) || q.answer.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [catFilter, search]);

  const levelColors = { basico: 'bg-primary/10 text-primary', intermediario: 'bg-accent/10 text-accent', avancado: 'bg-destructive/10 text-destructive' };
  const levelLabels = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' };

  return (
    <Layout>
      <div className="container py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Perguntas de Entrevista</h1>
        <p className="text-muted-foreground mb-8">Prepare-se para processos seletivos com perguntas reais</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar pergunta..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

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
      </div>
    </Layout>
  );
}
