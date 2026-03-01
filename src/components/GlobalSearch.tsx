import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Code2, X } from 'lucide-react';
import { getAllLessons, modules } from '@/data/modules';
import { exercises } from '@/data/exercises';

interface SearchResult {
  type: 'lesson' | 'exercise';
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  const allLessons = getAllLessons();
  for (const l of allLessons) {
    const mod = modules.find((m) => m.id === l.moduleId);
    results.push({
      type: 'lesson',
      id: l.id,
      title: l.title,
      subtitle: `${mod?.icon ?? ''} ${mod?.title ?? ''} · ${l.duration}`,
      path: `/aula/${l.id}`,
    });
  }

  for (const ex of exercises) {
    results.push({
      type: 'exercise',
      id: ex.id,
      title: ex.title,
      subtitle: `${ex.topicLabel} · ${ex.difficulty === 'facil' ? 'Fácil' : ex.difficulty === 'medio' ? 'Médio' : 'Difícil'} · ${ex.xpReward} XP`,
      path: `/exercicio/${ex.id}`,
    });
  }

  return results;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return index
      .filter((item) => {
        const text = `${item.title} ${item.subtitle}`.toLowerCase();
        return terms.every((t) => text.includes(t));
      })
      .slice(0, 10);
  }, [query, index]);

  // Ctrl+K / Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const goTo = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      goTo(results[selectedIndex].path);
    }
  }, [results, selectedIndex, goTo]);

  // Reset selection when results change
  useEffect(() => { setSelectedIndex(0); }, [results]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Buscar (Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Buscar...</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-background border border-border rounded px-1 py-0.5">
          Ctrl K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Dialog */}
          <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-fade-in">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar aulas, exercícios..."
                className="flex-1 py-3.5 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 rounded hover:bg-muted">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-[300px] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Nenhum resultado para "{query}"
                  </p>
                ) : (
                  <div className="py-1">
                    {results.map((r, i) => (
                      <button
                        key={`${r.type}-${r.id}`}
                        onClick={() => goTo(r.path)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                          i === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          r.type === 'lesson' ? 'bg-primary/10' : 'bg-purple-500/10'
                        }`}>
                          {r.type === 'lesson'
                            ? <BookOpen className="h-4 w-4 text-primary" />
                            : <Code2 className="h-4 w-4 text-purple-500" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {r.type === 'lesson' ? 'Aula' : 'Exercício'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer hint */}
            {!query.trim() && (
              <div className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-4">
                <span>↑↓ navegar</span>
                <span>↵ abrir</span>
                <span>esc fechar</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
