import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { exercises as platformExercises } from '@/data/exercises';
import {
  Plus, Trash2, Eye, EyeOff, Copy, RefreshCw, Loader2, ChevronDown, ChevronUp, ChevronRight,
  FileText, CheckCircle2, XCircle, Code2, ClipboardList, Users, Lock, KeyRound,
  Database, Download, Search, Check, BookOpen, Edit3,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
interface TestCase {
  input: string;
  expectedOutput: string;
  visible: boolean;
}

interface ExamExercise {
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

interface BankQuestion {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  tags: string[];
  difficulty: string;
  createdAt: string;
  updatedAt: string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  exercises: ExamExercise[];
  accessCodes: string[];
  maxSubmissions: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudentResult {
  userId: string;
  userName: string;
  userEmail: string;
  tabSwitches?: number;
  lastTabSwitch?: string;
  cheatAttempts?: number;
  cheatEvents?: { type: string; timestamp: string }[];
  submissions: {
    exerciseIndex: number;
    code: string;
    passedTests: number;
    totalTests: number;
    allPassed: boolean;
    attemptNumber: number;
    submittedAt: string;
  }[];
}

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === 'string' && base.length > 0) return base.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

// ── Unified item for the import modal ──
interface ImportableItem {
  key: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  difficulty: string;
  topic: string;       // grouping label (topicLabel for platform, first tag for bank)
  source: 'banco' | 'plataforma';
}

// Topic ordering (same order as the course curriculum)
const TOPIC_ORDER: string[] = [
  'Entrada e Saída', 'Variáveis e Tipos', 'Operadores', 'Strings',
  'if/else e switch', 'Laços', 'Vetores e Matrizes', 'Funções (Métodos)',
  'Collections', 'Classes e Objetos', 'Encapsulamento', 'Herança',
  'Polimorfismo', 'Interfaces', 'Classes Abstratas', 'Composição',
  'Exceções', 'SOLID',
];

function topicSortIndex(topic: string): number {
  const idx = TOPIC_ORDER.findIndex((t) => t.toLowerCase() === topic.toLowerCase());
  return idx >= 0 ? idx : 999;
}

// ── Import Modal: grouped by topic ──────────────────────────────────
function ImportQuestionsModal({
  bankQuestions,
  onImport,
  onClose,
}: {
  bankQuestions: BankQuestion[];
  onImport: (selected: ExamExercise[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'banco' | 'plataforma'>('all');
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());

  // Build unified list
  const allItems: ImportableItem[] = [
    ...bankQuestions.map((q) => ({
      key: `bank-${q.id}`,
      title: q.title,
      description: q.description,
      starterCode: q.starterCode,
      testCases: q.testCases,
      difficulty: q.difficulty,
      topic: q.tags[0] || 'Sem categoria',
      source: 'banco' as const,
    })),
    ...platformExercises.map((ex) => ({
      key: `platform-${ex.id}`,
      title: ex.title,
      description: ex.description,
      starterCode: ex.starterCode,
      testCases: ex.testCases,
      difficulty: ex.difficulty,
      topic: ex.topicLabel,
      source: 'plataforma' as const,
    })),
  ];

  // Filter
  const filtered = allItems.filter((item) => {
    if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return item.title.toLowerCase().includes(s) || item.description.toLowerCase().includes(s) || item.topic.toLowerCase().includes(s);
  });

  // Group by topic
  const grouped: Record<string, ImportableItem[]> = {};
  for (const item of filtered) {
    const t = item.topic || 'Sem categoria';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(item);
  }
  const sortedTopics = Object.keys(grouped).sort((a, b) => topicSortIndex(a) - topicSortIndex(b));

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleTopic = (topic: string) => {
    setCollapsedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic); else next.add(topic);
      return next;
    });
  };

  // Select/deselect all in a topic
  const toggleAllInTopic = (topic: string) => {
    const items = grouped[topic] || [];
    const allSelected = items.every((i) => selected.has(i.key));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        items.forEach((i) => next.delete(i.key));
      } else {
        items.forEach((i) => next.add(i.key));
      }
      return next;
    });
  };

  const handleImport = () => {
    const items = allItems.filter((i) => selected.has(i.key));
    onImport(items.map((i) => ({
      title: i.title,
      description: i.description,
      starterCode: i.starterCode,
      testCases: i.testCases,
    })));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="font-semibold flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Importar Questoes
          </h3>
          <span className="text-xs text-muted-foreground">{selected.size} selecionada(s)</span>
        </div>

        {/* Search + filter */}
        <div className="px-4 py-2 border-b border-border shrink-0 flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por titulo, descricao ou assunto..."
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as 'all' | 'banco' | 'plataforma')}
            className="text-xs rounded border border-border bg-background px-2 py-1.5 focus:outline-none"
          >
            <option value="all">Todas as fontes</option>
            <option value="banco">Banco de questoes</option>
            <option value="plataforma">Exercicios da plataforma</option>
          </select>
        </div>

        {/* Grouped list */}
        <div className="flex-1 overflow-y-auto">
          {sortedTopics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Nenhuma questao encontrada.</p>
          ) : (
            sortedTopics.map((topic) => {
              const items = grouped[topic];
              const collapsed = collapsedTopics.has(topic);
              const selectedInTopic = items.filter((i) => selected.has(i.key)).length;
              const allInTopicSelected = selectedInTopic === items.length;

              return (
                <div key={topic} className="border-b border-border/50 last:border-b-0">
                  {/* Topic header */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 sticky top-0 z-[1]">
                    <button
                      onClick={() => toggleTopic(topic)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {collapsed
                        ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      }
                      <span className="font-semibold text-sm">{topic}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({items.length} questao(oes){selectedInTopic > 0 && `, ${selectedInTopic} selecionada(s)`})
                      </span>
                    </button>
                    <button
                      onClick={() => toggleAllInTopic(topic)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors shrink-0 ${
                        allInTopicSelected
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {allInTopicSelected ? 'Desmarcar todos' : 'Selecionar todos'}
                    </button>
                  </div>

                  {/* Items */}
                  {!collapsed && (
                    <div className="px-2 py-1 space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => toggle(item.key)}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                            selected.has(item.key) ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-muted/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected.has(item.key) ? 'bg-primary border-primary' : 'border-border'}`}>
                              {selected.has(item.key) && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{item.title}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                                  item.source === 'banco' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {item.source === 'banco' ? 'BANCO' : 'PLATAFORMA'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description || 'Sem descricao'}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {item.difficulty && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    item.difficulty === 'facil' ? 'bg-green-500/20 text-green-600' :
                                    item.difficulty === 'medio' ? 'bg-yellow-500/20 text-yellow-600' :
                                    'bg-red-500/20 text-red-600'
                                  }`}>{item.difficulty}</span>
                                )}
                                <span className="text-[10px] text-muted-foreground">{item.testCases.length} teste(s)</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border flex justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            size="sm"
            disabled={selected.size === 0}
            onClick={handleImport}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Importar {selected.size} questao(oes)
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Exam Form Component ──────────────────────────────────────────────
function ExamForm({
  initial,
  onSave,
  onCancel,
  saving,
  bankQuestions,
}: {
  initial?: Exam;
  onSave: (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number }) => void;
  onCancel: () => void;
  saving: boolean;
  bankQuestions: BankQuestion[];
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [maxSubmissions, setMaxSubmissions] = useState(initial?.maxSubmissions ?? 3);
  const [exercises, setExercises] = useState<ExamExercise[]>(
    initial?.exercises ?? [{
      title: 'Exercicio 1',
      description: '',
      starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }],
    }]
  );
  const [showImport, setShowImport] = useState(false);

  const addExercise = () => {
    setExercises((prev) => [...prev, {
      title: `Exercicio ${prev.length + 1}`,
      description: '',
      starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }],
    }]);
  };

  const handleImport = (imported: ExamExercise[]) => {
    setExercises((prev) => [...prev, ...imported]);
    setShowImport(false);
  };

  const updateExercise = (idx: number, field: string, value: string) => {
    setExercises((prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (idx: number) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const addTestCase = (exIdx: number) => {
    setExercises((prev) => prev.map((ex, i) =>
      i === exIdx ? { ...ex, testCases: [...ex.testCases, { input: '', expectedOutput: '', visible: true }] } : ex
    ));
  };

  const updateTestCase = (exIdx: number, tcIdx: number, field: string, value: string | boolean) => {
    setExercises((prev) => prev.map((ex, i) =>
      i === exIdx ? {
        ...ex,
        testCases: ex.testCases.map((tc, j) => j === tcIdx ? { ...tc, [field]: value } : tc),
      } : ex
    ));
  };

  const removeTestCase = (exIdx: number, tcIdx: number) => {
    setExercises((prev) => prev.map((ex, i) =>
      i === exIdx ? { ...ex, testCases: ex.testCases.filter((_, j) => j !== tcIdx) } : ex
    ));
  };

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Titulo da prova *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Ex: Prova 1 - Fundamentos de Java"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Descricao</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
            placeholder="Instrucoes gerais para os alunos..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Max submissoes por exercicio</label>
          <input
            type="number"
            value={maxSubmissions}
            onChange={(e) => setMaxSubmissions(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            min={1}
            max={100}
          />
        </div>
      </div>

      {/* Exercises */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Exercicios ({exercises.length})</h3>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Database className="h-4 w-4 mr-1" /> Importar questoes
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" /> Criar vazio
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, exIdx) => (
            <div key={exIdx} className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-primary">Exercicio {exIdx + 1}</span>
                {exercises.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(exIdx)} className="text-destructive h-7">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Titulo</label>
                  <input
                    type="text"
                    value={ex.title}
                    onChange={(e) => updateExercise(exIdx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Enunciado</label>
                  <textarea
                    value={ex.description}
                    onChange={(e) => updateExercise(exIdx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Descreva o que o aluno deve fazer..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Codigo inicial (template)</label>
                  <textarea
                    value={ex.starterCode}
                    onChange={(e) => updateExercise(exIdx, 'starterCode', e.target.value)}
                    className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Test cases */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold">Casos de teste ({ex.testCases.length})</label>
                    <Button variant="ghost" size="sm" onClick={() => addTestCase(exIdx)} className="h-6 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Teste
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {ex.testCases.map((tc, tcIdx) => (
                      <div key={tcIdx} className="flex items-start gap-2 p-2 rounded bg-background border border-border">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-muted-foreground mb-0.5">Entrada (stdin)</label>
                            <input
                              type="text"
                              value={tc.input}
                              onChange={(e) => updateTestCase(exIdx, tcIdx, 'input', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-border bg-muted/30 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                              placeholder="(vazio)"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted-foreground mb-0.5">Saida esperada</label>
                            <input
                              type="text"
                              value={tc.expectedOutput}
                              onChange={(e) => updateTestCase(exIdx, tcIdx, 'expectedOutput', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-border bg-muted/30 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                              placeholder="Hello World"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateTestCase(exIdx, tcIdx, 'visible', !tc.visible)}
                          className={`mt-4 p-1 rounded ${tc.visible ? 'text-primary' : 'text-muted-foreground'}`}
                          title={tc.visible ? 'Visivel para o aluno' : 'Oculto do aluno'}
                        >
                          {tc.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        {ex.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(exIdx, tcIdx)}
                            className="mt-4 p-1 text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave({ title, description, exercises, maxSubmissions })} disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          {initial ? 'Salvar alteracoes' : 'Criar prova'}
        </Button>
      </div>

      {showImport && (
        <ImportQuestionsModal
          bankQuestions={bankQuestions}
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

// ── Question Bank Manager ────────────────────────────────────────────
function QuestionBank({ getToken }: { getToken: () => Promise<string> }) {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BankQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const base = getApiBase();

  const fetchBank = useCallback(async () => {
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams?bank=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) setQuestions(data.questions || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [base, getToken]);

  useEffect(() => { fetchBank(); }, [fetchBank]);

  const handleImportFromPlatform = async () => {
    setImporting(true);
    try {
      const token = await getToken();
      // Get existing titles to avoid duplicates
      const existingTitles = new Set(questions.map((q) => q.title.toLowerCase()));
      const toImport = platformExercises.filter((ex) => !existingTitles.has(ex.title.toLowerCase()));

      if (toImport.length === 0) {
        alert('Todos os exercicios da plataforma ja estao no banco!');
        setImporting(false);
        return;
      }

      const mapped = toImport.map((ex) => ({
        title: ex.title,
        description: ex.description,
        starterCode: ex.starterCode,
        testCases: ex.testCases,
        tags: [ex.topicLabel, `modulo-${ex.moduleId}`],
        difficulty: ex.difficulty,
      }));

      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bank_import', questions: mapped }),
      });

      if (resp.ok) {
        const data = await resp.json();
        alert(`${data.inserted} questao(oes) importadas com sucesso!`);
        await fetchBank();
      }
    } catch { /* ignore */ }
    setImporting(false);
  };

  const handleSave = async (q: Partial<BankQuestion> & { title: string }) => {
    setSaving(true);
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bank_save',
          id: q.id,
          title: q.title,
          description: q.description || '',
          starterCode: q.starterCode || '',
          testCases: q.testCases || [],
          tags: q.tags || [],
          difficulty: q.difficulty || '',
        }),
      });
      if (resp.ok) {
        await fetchBank();
        setEditingId(null);
        setEditForm(null);
        setShowNew(false);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta questao do banco?')) return;
    try {
      const token = await getToken();
      await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bank_delete', id }),
      });
      await fetchBank();
    } catch { /* ignore */ }
  };

  const filtered = questions.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return q.title.toLowerCase().includes(s) || q.description.toLowerCase().includes(s) || q.tags.some((t) => t.toLowerCase().includes(s));
  });

  if (loading) return <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  // Editing/creating a question
  if (editForm || showNew) {
    const q = editForm || {
      id: '', title: '', description: '', starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }] as TestCase[],
      tags: [] as string[], difficulty: '', createdAt: '', updatedAt: '',
    };
    return <QuestionEditor question={q} onSave={handleSave} onCancel={() => { setEditingId(null); setEditForm(null); setShowNew(false); }} saving={saving} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Database className="h-5 w-5" />
          Banco de Questoes ({questions.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImportFromPlatform} disabled={importing}>
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <BookOpen className="h-3.5 w-3.5 mr-1" />}
            Importar dos exercicios
          </Button>
          <Button size="sm" onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nova questao
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por titulo, descricao ou tag..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{questions.length === 0 ? 'Banco de questoes vazio.' : 'Nenhuma questao encontrada.'}</p>
          <p className="text-sm mt-1">Use "Importar dos exercicios" para trazer as questoes existentes ou crie uma nova.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <div key={q.id} className="rounded-lg border border-border bg-card px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{q.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.description || 'Sem descricao'}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {q.difficulty && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      q.difficulty === 'facil' ? 'bg-green-500/20 text-green-600' :
                      q.difficulty === 'medio' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>{q.difficulty}</span>
                  )}
                  <span className="text-[10px] text-muted-foreground">{q.testCases.length} teste(s)</span>
                  {q.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-7" onClick={() => { setEditingId(q.id); setEditForm(q); }}>
                  <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => handleDelete(q.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Question Editor (for bank) ───────────────────────────────────────
function QuestionEditor({
  question,
  onSave,
  onCancel,
  saving,
}: {
  question: Partial<BankQuestion> & { title: string; testCases: TestCase[] };
  onSave: (q: Partial<BankQuestion> & { title: string }) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || '');
  const [starterCode, setStarterCode] = useState(question.starterCode || '');
  const [testCases, setTestCases] = useState<TestCase[]>(question.testCases);
  const [tags, setTags] = useState(question.tags?.join(', ') || '');
  const [difficulty, setDifficulty] = useState(question.difficulty || '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{question.id ? 'Editar Questao' : 'Nova Questao'}</h2>
      </div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Titulo *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Enunciado</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold mb-1">Dificuldade</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Sem dificuldade</option>
              <option value="facil">Facil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Dificil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tags (separadas por virgula)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="loops, arrays, modulo-1"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Codigo inicial</label>
          <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)}
            className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold">Casos de teste ({testCases.length})</label>
            <Button variant="ghost" size="sm" onClick={() => setTestCases((prev) => [...prev, { input: '', expectedOutput: '', visible: true }])} className="h-6 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Teste
            </Button>
          </div>
          <div className="space-y-2">
            {testCases.map((tc, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/20 border border-border">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-0.5">Entrada</label>
                    <input type="text" value={tc.input}
                      onChange={(e) => setTestCases((prev) => prev.map((t, j) => j === i ? { ...t, input: e.target.value } : t))}
                      className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono" placeholder="(vazio)" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted-foreground mb-0.5">Saida esperada</label>
                    <input type="text" value={tc.expectedOutput}
                      onChange={(e) => setTestCases((prev) => prev.map((t, j) => j === i ? { ...t, expectedOutput: e.target.value } : t))}
                      className="w-full px-2 py-1 rounded border border-border bg-background text-xs font-mono" />
                  </div>
                </div>
                <button type="button" onClick={() => setTestCases((prev) => prev.map((t, j) => j === i ? { ...t, visible: !t.visible } : t))}
                  className={`mt-4 p-1 rounded ${tc.visible ? 'text-primary' : 'text-muted-foreground'}`}
                  title={tc.visible ? 'Visivel' : 'Oculto'}>
                  {tc.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                {testCases.length > 1 && (
                  <button type="button" onClick={() => setTestCases((prev) => prev.filter((_, j) => j !== i))} className="mt-4 p-1 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave({ id: question.id, title, description, starterCode, testCases, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), difficulty })} disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          Salvar
        </Button>
      </div>
    </div>
  );
}

// ── Exam Results Viewer ──────────────────────────────────────────────
function ExamResults({ examId, exam, getToken }: { examId: string; exam: Exam; getToken: () => Promise<string> }) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await getToken();
        const base = getApiBase();
        const resp = await fetch(`${base}/api/admin/exams?results=${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (resp.ok) setResults(data.students || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchResults();
  }, [examId, getToken]);

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">Nenhuma submissao recebida ainda.</p>;
  }

  return (
    <div className="space-y-2">
      {results.map((student) => {
        const isExpanded = expandedStudent === student.userId;
        const bestByExercise: Record<number, { passedTests: number; totalTests: number; allPassed: boolean; attempts: number }> = {};
        for (const sub of student.submissions) {
          const existing = bestByExercise[sub.exerciseIndex];
          if (!existing || sub.passedTests > existing.passedTests) {
            bestByExercise[sub.exerciseIndex] = {
              passedTests: sub.passedTests, totalTests: sub.totalTests,
              allPassed: sub.allPassed, attempts: Math.max(sub.attemptNumber, existing?.attempts ?? 0),
            };
          } else {
            bestByExercise[sub.exerciseIndex] = { ...existing, attempts: Math.max(sub.attemptNumber, existing.attempts) };
          }
        }

        return (
          <div key={student.userId} className="rounded-lg border border-border overflow-hidden">
            <button onClick={() => setExpandedStudent(isExpanded ? null : student.userId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{student.userName}</div>
                  <div className="text-xs text-muted-foreground">{student.userEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Tab switch indicator */}
                {(student.tabSwitches ?? 0) > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    (student.tabSwitches ?? 0) >= 3
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    <EyeOff className="h-3 w-3" />
                    {student.tabSwitches} saida{(student.tabSwitches ?? 0) !== 1 ? 's' : ''}
                  </span>
                )}
                {/* Cheat attempts indicator */}
                {(student.cheatAttempts ?? 0) > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30"
                    title={(student.cheatEvents ?? []).map(e => `${e.type} - ${new Date(e.timestamp).toLocaleTimeString('pt-BR')}`).join('\n')}
                  >
                    <Lock className="h-3 w-3" />
                    {student.cheatAttempts} cola{(student.cheatAttempts ?? 0) !== 1 ? 's' : ''}
                  </span>
                )}
                <div className="flex gap-1">
                  {exam.exercises.map((_, i) => {
                    const best = bestByExercise[i];
                    if (!best) return <div key={i} className="w-5 h-5 rounded-full bg-muted border border-border text-[9px] flex items-center justify-center text-muted-foreground">{i+1}</div>;
                    return (
                      <div key={i} className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${best.allPassed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                        {i+1}
                      </div>
                    );
                  })}
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border bg-muted/10">
                {student.submissions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">Sem submissoes.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {student.submissions.map((sub, i) => {
                      const codeKey = `${student.userId}-${i}`;
                      const showCode = expandedCode === codeKey;
                      return (
                        <div key={i} className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              {sub.allPassed ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                              <span className="font-semibold">Ex. {sub.exerciseIndex + 1}</span>
                              <span className="text-muted-foreground">Tentativa {sub.attemptNumber} &bull; {sub.passedTests}/{sub.totalTests} testes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleString('pt-BR')}</span>
                              <button onClick={() => setExpandedCode(showCode ? null : codeKey)} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <Code2 className="h-3 w-3" /> {showCode ? 'Ocultar' : 'Ver codigo'}
                              </button>
                            </div>
                          </div>
                          {showCode && (
                            <pre className="mt-2 p-3 rounded bg-background border border-border text-xs font-mono overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                              {sub.code}
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main AdminExams Component ────────────────────────────────────────
export default function AdminExams({ getToken }: { getToken: () => Promise<string> }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'results' | 'bank'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [copiedCode, setCopiedCode] = useState('');

  const base = getApiBase();

  const fetchExams = useCallback(async () => {
    try {
      const token = await getToken();
      const [examsResp, bankResp] = await Promise.all([
        fetch(`${base}/api/admin/exams`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/api/admin/exams?bank=1`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (examsResp.ok) { const d = await examsResp.json(); setExams(d.exams || []); }
      if (bankResp.ok) { const d = await bankResp.json(); setBankQuestions(d.questions || []); }
    } catch { /* ignore */ }
    setLoading(false);
  }, [base, getToken]);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const handleCreate = async (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number }) => {
    setSaving(true);
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (resp.ok) { await fetchExams(); setView('list'); }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleUpdate = async (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number }) => {
    if (!selectedExam) return;
    setSaving(true);
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedExam.id, ...data }),
      });
      if (resp.ok) { await fetchExams(); setView('list'); setSelectedExam(null); }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleToggleActive = async (exam: Exam) => {
    try {
      const token = await getToken();
      await fetch(`${base}/api/admin/exams`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exam.id, active: !exam.active }),
      });
      await fetchExams();
    } catch { /* ignore */ }
  };

  const handleDelete = async (exam: Exam) => {
    if (!confirm(`Excluir a prova "${exam.title}" e todas as submissoes?`)) return;
    try {
      const token = await getToken();
      await fetch(`${base}/api/admin/exams?id=${exam.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await fetchExams();
    } catch { /* ignore */ }
  };

  const handleGenerateCode = async (exam: Exam) => {
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_code', examId: exam.id }),
      });
      if (resp.ok) await fetchExams();
    } catch { /* ignore */ }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const examLink = typeof window !== 'undefined' ? `${window.location.origin}/prova` : '/prova';

  // ── Render ──
  if (loading) return <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  if (view === 'bank') {
    return (
      <div>
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => setView('list')} className="text-muted-foreground">
            &larr; Voltar para provas
          </Button>
        </div>
        <QuestionBank getToken={getToken} />
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Nova Prova</h2>
        <ExamForm onSave={handleCreate} onCancel={() => setView('list')} saving={saving} bankQuestions={bankQuestions} />
      </div>
    );
  }

  if (view === 'edit' && selectedExam) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Editar: {selectedExam.title}</h2>
        <ExamForm initial={selectedExam} onSave={handleUpdate} onCancel={() => { setView('list'); setSelectedExam(null); }} saving={saving} bankQuestions={bankQuestions} />
      </div>
    );
  }

  if (view === 'results' && selectedExam) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Resultados: {selectedExam.title}</h2>
          <Button variant="outline" size="sm" onClick={() => { setView('list'); setSelectedExam(null); }}>Voltar</Button>
        </div>
        <ExamResults examId={selectedExam.id} exam={selectedExam} getToken={getToken} />
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Provas Online ({exams.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView('bank')}>
            <Database className="h-4 w-4 mr-1" /> Banco de Questoes
            {bankQuestions.length > 0 && <span className="ml-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{bankQuestions.length}</span>}
          </Button>
          <Button onClick={() => setView('create')} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nova Prova
          </Button>
        </div>
      </div>

      {/* Exam link info */}
      <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm text-muted-foreground mb-1">Link para os alunos acessarem as provas:</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">{examLink}</code>
          <button onClick={() => copyToClipboard(examLink)} className="text-primary hover:text-primary/80">
            <Copy className="h-4 w-4" />
          </button>
          {copiedCode === examLink && <span className="text-xs text-green-400">Copiado!</span>}
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma prova criada ainda.</p>
          <p className="text-sm mt-1">Clique em "Nova Prova" para comecar ou monte seu banco de questoes primeiro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div key={exam.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{exam.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${exam.active ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {exam.active ? 'ATIVA' : 'INATIVA'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {exam.exercises.length} exercicio(s) &bull; Max {exam.maxSubmissions} submissoes &bull; Criada em {new Date(exam.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedExam(exam); setView('results'); }}>
                    <Users className="h-3.5 w-3.5 mr-1" /> Resultados
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedExam(exam); setView('edit'); }}>
                    <FileText className="h-3.5 w-3.5 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(exam)}>
                    {exam.active ? <Lock className="h-3.5 w-3.5 mr-1" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                    {exam.active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(exam)} className="text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Access codes section */}
              <div className="px-5 py-3 bg-muted/20 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <KeyRound className="h-3.5 w-3.5" /> Codigos de acesso
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleGenerateCode(exam)} className="h-6 text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" /> Gerar novo codigo
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exam.accessCodes.map((code, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(code)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background border border-border text-sm font-mono hover:bg-muted transition-colors"
                      title="Clique para copiar"
                    >
                      {code}
                      <Copy className="h-3 w-3 text-muted-foreground" />
                      {copiedCode === code && <span className="text-[10px] text-green-400">!</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
