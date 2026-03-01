import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { exercises, getTopicsByModule } from '@/data/exercises';
import { modules } from '@/data/modules';
import { Code2, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/hooks/useProgress';

const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  facil: { label: 'Fácil', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  medio: { label: 'Médio', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  dificil: { label: 'Difícil', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function Exercises() {
  const { getExerciseData } = useProgress();
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDiff, setSelectedDiff] = useState<string>('');

  // Re-reads from localStorage on every render (cheap operation, ensures fresh data)
  const exerciseData = getExerciseData();
  const completed = useMemo(() => {
    return new Set(Object.entries(exerciseData).filter(([, v]) => v.passed).map(([k]) => k));
  }, [exerciseData]);
  const topicsByModule = useMemo(() => getTopicsByModule(), []);

  const availableTopics = useMemo(() => {
    if (selectedModule === 0) return [];
    return topicsByModule.find((m) => m.moduleId === selectedModule)?.topics ?? [];
  }, [selectedModule, topicsByModule]);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (selectedModule !== 0 && ex.moduleId !== selectedModule) return false;
      if (selectedTopic && ex.topic !== selectedTopic) return false;
      if (selectedDiff && ex.difficulty !== selectedDiff) return false;
      return true;
    });
  }, [selectedModule, selectedTopic, selectedDiff]);

  const stats = useMemo(() => {
    const total = exercises.length;
    const done = exercises.filter((e) => completed.has(e.id)).length;
    return { total, done };
  }, [completed]);

  return (
    <Layout>
      <div className="container py-8 max-w-5xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Exercícios</h1>
          </div>
          <p className="text-muted-foreground">
            Pratique Java com exercícios do básico ao avançado. Escreva código, submeta e receba avaliação instantânea.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" />
              {stats.done}/{stats.total} resolvidos
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtros:
          </div>

          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(Number(e.target.value));
              setSelectedTopic('');
            }}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value={0}>Todos os módulos</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.icon} {m.title}
              </option>
            ))}
          </select>

          {availableTopics.length > 0 && (
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Todos os tópicos</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          )}

          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Todas as dificuldades</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>

          {(selectedModule !== 0 || selectedTopic || selectedDiff) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedModule(0); setSelectedTopic(''); setSelectedDiff(''); }}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Nenhum exercício encontrado com esses filtros.
            </p>
          )}
          {filtered.map((ex) => {
            const diff = DIFF_LABELS[ex.difficulty];
            const isDone = completed.has(ex.id);
            const mod = modules.find((m) => m.id === ex.moduleId);
            return (
              <Link
                key={ex.id}
                to={`/exercicio/${ex.id}`}
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDone ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {isDone
                    ? <CheckCircle2 className="h-5 w-5 text-primary" />
                    : <Code2 className="h-5 w-5 text-muted-foreground" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{ex.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${diff.color}`}>
                      {diff.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{mod?.icon} {mod?.title}</span>
                    <span>·</span>
                    <span>{ex.topicLabel}</span>
                    <span>·</span>
                    <span>{ex.xpReward} XP</span>
                    <span>·</span>
                    <span>{ex.testCases.length} testes</span>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
