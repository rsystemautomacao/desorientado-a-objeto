import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StickyNote, Save, Trash2 } from 'lucide-react';

interface LessonNotesProps {
  lessonId: string;
}

const NOTES_PREFIX = 'dao-notes';

function getKey(uid: string | null, lessonId: string): string {
  return uid ? `${NOTES_PREFIX}-${uid}-${lessonId}` : `${NOTES_PREFIX}-${lessonId}`;
}

export default function LessonNotes({ lessonId }: LessonNotesProps) {
  const { user } = useAuth();
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Load note from localStorage
  useEffect(() => {
    const key = getKey(user?.uid ?? null, lessonId);
    const stored = localStorage.getItem(key);
    setNote(stored ?? '');
    setSaved(true);
    // Auto-expand if there's content
    if (stored && stored.trim().length > 0) setExpanded(true);
    else setExpanded(false);
  }, [lessonId, user?.uid]);

  const handleSave = useCallback(() => {
    const key = getKey(user?.uid ?? null, lessonId);
    if (note.trim()) {
      localStorage.setItem(key, note);
    } else {
      localStorage.removeItem(key);
    }
    setSaved(true);
  }, [note, lessonId, user?.uid]);

  const handleClear = useCallback(() => {
    const key = getKey(user?.uid ?? null, lessonId);
    localStorage.removeItem(key);
    setNote('');
    setSaved(true);
  }, [lessonId, user?.uid]);

  // Auto-save on blur
  const handleBlur = useCallback(() => {
    if (!saved) handleSave();
  }, [saved, handleSave]);

  return (
    <section className="mb-10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <StickyNote className="h-4 w-4" />
        Minhas Anotacoes
        {note.trim() && !expanded && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            tem notas
          </span>
        )}
      </button>

      {expanded && (
        <div className="rounded-xl border border-border bg-card p-4">
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); setSaved(false); }}
            onBlur={handleBlur}
            placeholder="Escreva suas anotacoes sobre esta aula aqui... (salvas localmente no seu navegador)"
            className="w-full min-h-[120px] bg-transparent text-sm resize-y border-none outline-none placeholder:text-muted-foreground/50"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {saved ? 'Salvo' : 'Nao salvo'}
            </span>
            <div className="flex gap-2">
              {note.trim() && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Limpar
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saved}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
              >
                <Save className="h-3 w-3" /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
