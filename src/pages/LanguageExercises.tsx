import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { pythonExercises, getPythonTopicsByModule } from '@/data/exercises-python';
import { cExercises, getCTopicsByModule } from '@/data/exercises-c';
import { Code2, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/hooks/useProgress';

const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  facil: { label: 'Fácil', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  medio: { label: 'Médio', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  dificil: { label: 'Difícil', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function LanguageExercises() {
  const { lang, label, routePrefix, color } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDiff, setSelectedDiff] = useState<string>('');

  const { getExerciseData } = useProgress();
  const completed = useMemo(() => {
    const data = getExerciseData();
    return new Set(Object.entries(data).filter(([, v]) => v.passed).map(([k]) => k));
  }, [getExerciseData]);

  const exercises = lang === 'python' ? pythonExercises : cExercises;
  const topicsByModule = useMemo(
    () => (lang === 'python' ? getPythonTopicsByModule() : getCTopicsByModule()),
    [lang],
  );

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
  }, [exercises, selectedModule, selectedTopic, selectedDiff]);

  const modules = [...new Set(exercises.map((e) => e.moduleId))].map((id) => ({ id, label: `Módulo ${id}` }));

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Code2 className={`h-7 w-7 ${color}`} />
          <div>
            <h1 className="text-2xl font-bold">Exercícios de {label}</h1>
            <p className="text-sm text-muted-foreground">
              {exercises.length} exercício{exercises.length !== 1 ? 's' : ''} disponíve{exercises.length !== 1 ? 'is' : 'l'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedModule}
            onChange={(e) => { setSelectedModule(Number(e.target.value)); setSelectedTopic(''); }}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
          >
            <option value={0}>Todos os módulos</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          {availableTopics.length > 0 && (
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
            >
              <option value="">Todos os tópicos</option>
              {availableTopics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          <select
            value={selectedDiff}
            onChange={(e) => setSelectedDiff(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
          >
            <option value="">Todas as dificuldades</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
          {(selectedModule !== 0 || selectedTopic || selectedDiff) && (
            <Button variant="ghost" size="sm" onClick={() => { setSelectedModule(0); setSelectedTopic(''); setSelectedDiff(''); }}>
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Exercise list */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum exercício encontrado.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((ex) => {
              const diff = DIFF_LABELS[ex.difficulty];
              const isDone = completed.has(ex.id);
              return (
                <Link
                  key={ex.id}
                  to={`${routePrefix}/exercicio/${ex.id}`}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isDone ? 'bg-primary/20' : 'bg-muted'}`}>
                    {isDone
                      ? <CheckCircle2 className="h-5 w-5 text-primary" />
                      : <Code2 className={`h-5 w-5 ${color}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{ex.title}</p>
                    <p className="text-xs text-muted-foreground">{ex.topicLabel} · Módulo {ex.moduleId}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${diff.color}`}>{diff.label}</span>
                    <span className="text-xs text-muted-foreground">{ex.xpReward} XP</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
