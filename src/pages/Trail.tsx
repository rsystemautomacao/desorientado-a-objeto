import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { modules } from '@/data/modules';
import { lessonContents } from '@/data/lessonContents';
import { useProgress } from '@/hooks/useProgress';
import { Search, CheckCircle2, Clock, Star, StarOff, AlertTriangle } from 'lucide-react';

/** Checks if search term matches lesson title OR body content */
function matchesSearch(lessonId: string, title: string, term: string): boolean {
  if (!term) return true;
  const lower = term.toLowerCase();
  if (title.toLowerCase().includes(lower)) return true;

  const content = lessonContents[lessonId];
  if (!content) return false;

  // Search in objectives
  if (content.objectives?.some((o) => o.toLowerCase().includes(lower))) return true;
  // Search in section titles and bodies
  if (content.sections?.some((s) => s.title.toLowerCase().includes(lower) || s.body.toLowerCase().includes(lower))) return true;
  // Search in summary
  if (content.summary?.some((s) => s.toLowerCase().includes(lower))) return true;

  return false;
}

export default function Trail() {
  const [filter, setFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const { isCompleted, isFavorite, toggleFavorite } = useProgress();

  const filteredModules = useMemo(() => {
    return modules
      .filter((m) => filter === 'todos' || m.level === filter)
      .map((m) => ({
        ...m,
        lessons: m.lessons.filter((l) =>
          matchesSearch(l.id, l.title, search)
        ),
      }))
      .filter((m) => m.lessons.length > 0);
  }, [filter, search]);

  const filters = [
    { value: 'todos', label: 'Todos' },
    { value: 'basico', label: '🟢 Básico' },
    { value: 'intermediario', label: '🟡 Intermediário' },
    { value: 'avancado', label: '🔴 Avançado (POO)' },
  ];

  return (
    <Layout>
      <div className="container py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Trilha de Aprendizado</h1>
        <p className="text-muted-foreground mb-8">Siga a ordem ou vá direto ao que precisa</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar no titulo e conteudo (ex: ArrayList, encapsulamento, try catch...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-10">
          {filteredModules.map((m) => {
            // Prerequisite check: suggest completing previous module first
            const prevModule = m.id > 1 ? modules.find((pm) => pm.id === m.id - 1) : null;
            const prevCompleted = prevModule ? prevModule.lessons.filter((l) => isCompleted(l.id)).length : 0;
            const prevTotal = prevModule ? prevModule.lessons.length : 0;
            const prevPct = prevTotal > 0 ? Math.round((prevCompleted / prevTotal) * 100) : 100;
            const showPrereq = prevModule && prevPct < 70;

            return (
            <div key={m.id}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{m.icon}</span> Módulo {m.id} — {m.title}
              </h2>
              {showPrereq && (
                <div className="flex items-start gap-2 p-3 mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-800 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Recomendamos concluir o <strong>{prevModule.icon} Modulo {prevModule.id} — {prevModule.title}</strong> antes
                    ({prevCompleted}/{prevTotal} aulas concluidas — {prevPct}%).
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {m.lessons.map((l, i) => {
                  const done = isCompleted(l.id);
                  const fav = isFavorite(l.id);
                  return (
                    <div key={l.id} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card card-hover group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <Link to={`/aula/${l.id}`} className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${done ? 'text-primary' : ''}`}>{l.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {l.duration}
                        </p>
                      </Link>
                      <button onClick={() => toggleFavorite(l.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        {fav ? <Star className="h-4 w-4 text-accent fill-accent" /> : <StarOff className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
