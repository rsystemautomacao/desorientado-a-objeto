import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { pythonExercises } from '@/data/exercises-python';
import { cExercises } from '@/data/exercises-c';
import { Code2, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  facil:   { label: 'Fácil',   color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  medio:   { label: 'Médio',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  dificil: { label: 'Difícil', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

const MODULE_NAMES: Record<number, string> = {
  1: 'Fundamentos',
  2: 'Estruturas de Controle',
  3: 'Funções e Modularização',
  4: 'Estruturas de Dados',
  5: 'Avançado',
};

export default function LanguageTrail() {
  const { lang, label, routePrefix, color, accent } = useLanguage();

  const exercises = lang === 'python' ? pythonExercises : cExercises;

  const modules = useMemo(() => {
    const map = new Map<number, typeof exercises>();
    exercises.forEach((ex) => {
      if (!map.has(ex.moduleId)) map.set(ex.moduleId, []);
      map.get(ex.moduleId)!.push(ex);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [exercises]);

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Trilha — {label}</h1>
          <p className="text-muted-foreground">Siga a ordem ou vá direto ao que precisa</p>
        </div>

        {/* Modules */}
        <div className="space-y-8">
          {modules.map(([moduleId, exs], modIdx) => {
            const moduleName = MODULE_NAMES[moduleId] ?? `Módulo ${moduleId}`;
            return (
              <div key={moduleId}>
                {/* Module header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${accent} font-bold text-sm ${color}`}>
                    {moduleId}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{moduleName}</h2>
                    <p className="text-xs text-muted-foreground">{exs.length} exercício{exs.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Exercises in module */}
                <div className="ml-4 pl-6 border-l-2 border-border space-y-3">
                  {exs.map((ex) => {
                    const diff = DIFF_LABELS[ex.difficulty];
                    return (
                      <Link
                        key={ex.id}
                        to={`${routePrefix}/exercicio/${ex.id}`}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Code2 className={`h-4 w-4 shrink-0 ${color}`} />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{ex.title}</p>
                            <p className="text-xs text-muted-foreground">{ex.topicLabel}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${diff.color}`}>{diff.label}</span>
                          <span className="text-xs text-muted-foreground">{ex.xpReward} XP</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Connector to next module */}
                {modIdx < modules.length - 1 && (
                  <div className="ml-4 pl-6 flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <div className="w-0.5 h-4 bg-border ml-[-1px]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center">
          <BookOpen className={`h-8 w-8 mx-auto mb-3 ${color}`} />
          <h3 className="font-semibold mb-1">Quer praticar todos de uma vez?</h3>
          <p className="text-sm text-muted-foreground mb-4">Veja todos os exercícios com filtros por tópico e dificuldade.</p>
          <Link
            to={`${routePrefix}/exercicios`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${accent} ${color} hover:opacity-80`}
          >
            <Code2 className="h-4 w-4" />
            Ver todos os exercícios
          </Link>
        </div>
      </div>
    </Layout>
  );
}
