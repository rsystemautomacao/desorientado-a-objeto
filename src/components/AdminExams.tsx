import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { exercises as platformExercises } from '@/data/exercises';
import {
  Plus, Trash2, Eye, EyeOff, Copy, RefreshCw, Loader2, ChevronDown, ChevronUp, ChevronRight,
  FileText, CheckCircle2, XCircle, Code2, ClipboardList, Users, Lock, KeyRound,
  Database, Download, Search, Check, BookOpen, Edit3, Shuffle, Clock, RotateCcw, AlertTriangle, ThumbsUp,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────
interface TestCase {
  input: string;
  expectedOutput: string;
  visible: boolean;
}

type QuestionType = 'code' | 'multiple-choice' | 'true-false' | 'fill-blank';

interface ExamExercise {
  type: QuestionType;
  title: string;
  description: string;
  points?: number;            // point value for this question
  // Code exercise fields
  starterCode: string;
  testCases: TestCase[];
  // Multiple choice / true-false / fill-blank fields
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;       // optional code to display with the question
  snippetBefore?: string;     // fill-blank: code before the blank
  snippetAfter?: string;      // fill-blank: code after the blank
  explanation?: string;
}

interface BankQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  // Objective question fields
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;
  snippetBefore?: string;
  snippetAfter?: string;
  explanation?: string;
  tags: string[];
  difficulty: string;
  subject?: SubjectKey;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

type SubjectKey = 'poo' | 'bi' | 'logica';

interface Exam {
  id: string;
  title: string;
  description: string;
  exercises: ExamExercise[];
  accessCodes: string[];
  maxSubmissions: number;
  maxQuestions: number | null;           // legacy / derived (sum)
  maxCodeQuestions: number | null;       // explicit code-question limit per student
  maxObjectiveQuestions: number | null;  // explicit objective-question limit per student
  active: boolean;
  gradesReleased: boolean;
  answersReleased: boolean;
  correctAnswersReleased: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  scoringMode: 'equal' | 'code-weighted' | 'manual';
  subject: SubjectKey;
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
  accessedAt?: string;
  finalizedAt?: string | null;
  finalized?: boolean;
  questionOrder?: number[] | null;
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
  type: QuestionType;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;
  snippetBefore?: string;
  snippetAfter?: string;
  explanation?: string;
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
  examSubject,
}: {
  bankQuestions: BankQuestion[];
  onImport: (selected: ExamExercise[]) => void;
  onClose: () => void;
  examSubject?: SubjectKey;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'banco' | 'plataforma'>('all');
  const [collapsedTopics, setCollapsedTopics] = useState<Set<string>>(new Set());

  // Questoes do banco filtradas pela materia da prova
  const filteredBank = bankQuestions.filter((q) =>
    !examSubject || (q.subject ?? 'poo') === examSubject
  );

  // Exercicios da plataforma só aparecem para POO (são todos Java/OO)
  const showPlatform = !examSubject || examSubject === 'poo';

  // Build unified list
  const allItems: ImportableItem[] = [
    ...filteredBank.map((q) => ({
      key: `bank-${q.id}`,
      type: q.type || 'code' as QuestionType,
      title: q.title,
      description: q.description,
      starterCode: q.starterCode,
      testCases: q.testCases,
      options: q.options,
      correctIndex: q.correctIndex,
      codeSnippet: q.codeSnippet,
      snippetBefore: q.snippetBefore,
      snippetAfter: q.snippetAfter,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.tags[0] || 'Sem categoria',
      source: 'banco' as const,
    })),
    ...(showPlatform ? platformExercises.map((ex) => ({
      key: `platform-${ex.id}`,
      type: 'code' as QuestionType,
      title: ex.title,
      description: ex.description,
      starterCode: ex.starterCode,
      testCases: ex.testCases,
      difficulty: ex.difficulty,
      topic: ex.topicLabel,
      source: 'plataforma' as const,
    })) : []),
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
    onImport(items.map((i) => {
      const base: ExamExercise = {
        type: i.type || 'code',
        title: i.title,
        description: i.description,
        starterCode: i.starterCode,
        testCases: i.testCases,
      };
      if (i.options) base.options = i.options;
      if (i.correctIndex !== undefined) base.correctIndex = i.correctIndex;
      if (i.codeSnippet) base.codeSnippet = i.codeSnippet;
      if (i.snippetBefore) base.snippetBefore = i.snippetBefore;
      if (i.snippetAfter) base.snippetAfter = i.snippetAfter;
      if (i.explanation) base.explanation = i.explanation;
      return base;
    }));
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
                                {item.type && item.type !== 'code' && (
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                                    item.type === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
                                    item.type === 'true-false' ? 'bg-green-500/20 text-green-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {item.type === 'multiple-choice' ? 'Alternativas' : item.type === 'true-false' ? 'V/F' : 'Preencher'}
                                  </span>
                                )}
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

// Helper: calculate point values based on scoring mode
// effectiveCount = maxQuestions when pool is active (each question worth 10/effectiveCount for equal mode)
function calcPointsPreview(exercises: ExamExercise[], mode: 'equal' | 'code-weighted' | 'manual', effectiveCount?: number): number[] {
  const n = exercises.length;
  if (n === 0) return [];
  if (mode === 'manual') {
    return exercises.map((ex) => ex.points ?? 0);
  }

  // For equal mode with an active pool: each question is worth 10/effectiveCount
  const eff = (mode === 'equal' && effectiveCount && effectiveCount > 0 && effectiveCount < n) ? effectiveCount : n;

  // Calculate raw weights
  const weights = mode === 'equal'
    ? exercises.map(() => 1)
    : exercises.map((ex) => (ex.type || 'code') === 'code' ? 2 : 1);
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  // For equal mode: each question = 10/eff (same for all, rounding adjusted on last)
  // For code-weighted: proportional weights over all n questions (pool doesn't change individual weights)
  const pts = mode === 'equal'
    ? exercises.map(() => Math.floor((10 / eff) * 100) / 100)
    : weights.map((w) => Math.floor((w / totalWeight) * 10 * 100) / 100);

  // Fix rounding remainder on last item so student's subset sums exactly to 10
  const effectivePts = pts.slice(0, eff);
  const sum = effectivePts.reduce((s, p) => s + p, 0);
  const diff = Math.round((10 - sum) * 100) / 100;
  pts[eff - 1] = Math.round((pts[eff - 1] + diff) * 100) / 100;
  return pts;
}

// ── Exam Form Component ──────────────────────────────────────────────
function ExamForm({
  initial,
  onSave,
  onCancel,
  saving,
  bankQuestions,
  defaultSubject,
}: {
  initial?: Exam;
  onSave: (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number; maxQuestions: number | null; maxCodeQuestions: number | null; maxObjectiveQuestions: number | null; shuffleQuestions: boolean; shuffleOptions: boolean; scoringMode: 'equal' | 'code-weighted' | 'manual'; subject: SubjectKey }) => void;
  onCancel: () => void;
  saving: boolean;
  bankQuestions: BankQuestion[];
  defaultSubject?: SubjectKey;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [maxSubmissions, setMaxSubmissions] = useState(initial?.maxSubmissions ?? 3);
  const [maxCodeQuestions, setMaxCodeQuestions] = useState<number>(initial?.maxCodeQuestions ?? 0);
  const [maxObjectiveQuestions, setMaxObjectiveQuestions] = useState<number>(initial?.maxObjectiveQuestions ?? 0);
  const [shuffleQuestions, setShuffleQuestions] = useState(initial?.shuffleQuestions ?? false);
  const [shuffleOptions, setShuffleOptions] = useState(initial?.shuffleOptions ?? false);
  const [scoringMode, setScoringMode] = useState<'equal' | 'code-weighted' | 'manual'>(initial?.scoringMode ?? 'equal');
  const [subject, setSubject] = useState<SubjectKey>(initial?.subject ?? defaultSubject ?? 'poo');
  const [exercises, setExercises] = useState<ExamExercise[]>(
    initial?.exercises ?? [{
      type: 'code',
      title: 'Exercicio 1',
      description: '',
      starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }],
    }]
  );
  const [showImport, setShowImport] = useState(false);

  const DEFAULT_CODE = 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}';

  const addExercise = (type: QuestionType = 'code') => {
    const num = exercises.length + 1;
    const base: ExamExercise = {
      type,
      title: type === 'code' ? `Exercicio ${num}` : `Questao ${num}`,
      description: '',
      starterCode: DEFAULT_CODE,
      testCases: [{ input: '', expectedOutput: '', visible: true }],
    };
    if (type === 'multiple-choice') {
      base.options = ['', '', '', ''];
      base.correctIndex = 0;
      base.codeSnippet = '';
      base.starterCode = '';
      base.testCases = [];
    } else if (type === 'true-false') {
      base.options = ['Verdadeiro', 'Falso'];
      base.correctIndex = 0;
      base.codeSnippet = '';
      base.starterCode = '';
      base.testCases = [];
    } else if (type === 'fill-blank') {
      base.options = ['', '', '', ''];
      base.correctIndex = 0;
      base.snippetBefore = '// codigo antes\n';
      base.snippetAfter = '\n// codigo depois';
      base.starterCode = '';
      base.testCases = [];
    }
    setExercises((prev) => [...prev, base]);
  };

  const handleImport = (imported: ExamExercise[]) => {
    setExercises((prev) => [...prev, ...imported]);
    setShowImport(false);
  };

  const updateExercise = (idx: number, field: string, value: unknown) => {
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

  const updateOption = (exIdx: number, optIdx: number, value: string) => {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const opts = [...(ex.options || [])];
      opts[optIdx] = value;
      return { ...ex, options: opts };
    }));
  };

  const addOption = (exIdx: number) => {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      return { ...ex, options: [...(ex.options || []), ''] };
    }));
  };

  const removeOption = (exIdx: number, optIdx: number) => {
    setExercises((prev) => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const opts = (ex.options || []).filter((_, j) => j !== optIdx);
      const correct = ex.correctIndex ?? 0;
      return { ...ex, options: opts, correctIndex: correct >= opts.length ? 0 : correct };
    }));
  };

  const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    'code': 'Codigo',
    'multiple-choice': 'Alternativas',
    'true-false': 'Verdadeiro/Falso',
    'fill-blank': 'Preencher trecho',
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
        <div>
          <label className="block text-sm font-semibold mb-1">Materia</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as SubjectKey)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="poo">Programacao Orientada a Objetos</option>
            <option value="bi">Business Intelligence</option>
            <option value="logica">Logica de Programacao</option>
          </select>
        </div>
      </div>

      {/* Shuffle + pool options */}
      <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Shuffle className="h-4 w-4 text-primary" />
          Embaralhamento e Pool de Questões
        </h4>

        {/* Per-type pool controls */}
        {(() => {
          const codeCount = exercises.filter((e) => e.type === 'code').length;
          const objCount = exercises.filter((e) => e.type !== 'code').length;
          const resolvedCode = maxCodeQuestions > 0 && maxCodeQuestions < codeCount ? maxCodeQuestions : null;
          const resolvedObj  = maxObjectiveQuestions > 0 && maxObjectiveQuestions < objCount ? maxObjectiveQuestions : null;
          const poolActive = resolvedCode !== null || resolvedObj !== null;
          const totalPerStudent = (resolvedCode ?? codeCount) + (resolvedObj ?? objCount);
          return (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Questões por aluno</span>
                {poolActive
                  ? <span className="text-xs text-green-500 font-medium">Pool ativo — cada aluno vê {totalPerStudent}/{exercises.length} questões</span>
                  : <span className="text-xs text-muted-foreground">Pool inativo — todos veem todas as {exercises.length} questões</span>
                }
              </div>

              {/* Code questions */}
              {codeCount > 0 && (
                <div className="flex items-center gap-3">
                  <Code2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-sm w-40 shrink-0">
                    Questões de código
                    <span className="block text-xs text-muted-foreground">{codeCount} disponíveis no pool</span>
                  </span>
                  <input
                    type="number"
                    value={maxCodeQuestions}
                    onChange={(e) => setMaxCodeQuestions(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min={0}
                    max={codeCount}
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">
                    {maxCodeQuestions === 0 || maxCodeQuestions >= codeCount
                      ? `todas (${codeCount})`
                      : <span className="text-green-500">{maxCodeQuestions} sorteadas</span>
                    }
                  </span>
                </div>
              )}

              {/* Objective questions */}
              {objCount > 0 && (
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="text-sm w-40 shrink-0">
                    Questões objetivas
                    <span className="block text-xs text-muted-foreground">{objCount} disponíveis no pool</span>
                  </span>
                  <input
                    type="number"
                    value={maxObjectiveQuestions}
                    onChange={(e) => setMaxObjectiveQuestions(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 px-2 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min={0}
                    max={objCount}
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">
                    {maxObjectiveQuestions === 0 || maxObjectiveQuestions >= objCount
                      ? `todas (${objCount})`
                      : <span className="text-green-500">{maxObjectiveQuestions} sorteadas</span>
                    }
                  </span>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                0 = exibir todas daquele tipo. Cada aluno recebe um subconjunto diferente dentro do tipo.
              </p>
            </div>
          );
        })()}

        {/* Shuffle checkboxes */}
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => setShuffleQuestions(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm">Embaralhar ordem das questões</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm">Embaralhar alternativas (múltipla escolha / preencher)</span>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">
          Cada aluno recebe uma ordem diferente. A resposta correta é mantida automaticamente.
        </p>
      </div>

      {/* Scoring / Points */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Pontuacao (nota de 0 a 10)
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="scoringMode" checked={scoringMode === 'equal'} onChange={() => setScoringMode('equal')} className="accent-primary" />
              <span className="text-sm">Dividir igualmente entre as questoes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="scoringMode" checked={scoringMode === 'code-weighted'} onChange={() => setScoringMode('code-weighted')} className="accent-primary" />
              <span className="text-sm">Codigo vale mais (peso 2x)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="scoringMode" checked={scoringMode === 'manual'} onChange={() => setScoringMode('manual')} className="accent-primary" />
              <span className="text-sm">Definir valor manualmente</span>
            </label>
          </div>

          {/* Show point summary */}
          {exercises.length > 0 && (() => {
            const codeCount2 = exercises.filter((e) => e.type === 'code').length;
            const objCount2  = exercises.filter((e) => e.type !== 'code').length;
            const resolvedCode2 = maxCodeQuestions > 0 && maxCodeQuestions < codeCount2 ? maxCodeQuestions : codeCount2;
            const resolvedObj2  = maxObjectiveQuestions > 0 && maxObjectiveQuestions < objCount2 ? maxObjectiveQuestions : objCount2;
            const totalPerStudent2 = resolvedCode2 + resolvedObj2;
            const poolActive = totalPerStudent2 < exercises.length;
            const effectiveCount = poolActive ? totalPerStudent2 : undefined;
            const pts = calcPointsPreview(exercises, scoringMode, effectiveCount);
            // For the total check: if pool active, sum over the effective subset (not all exercises)
            const eff = effectiveCount ?? exercises.length;
            const effectiveTotal = pts.slice(0, eff).reduce((s, p) => s + p, 0);
            return (
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">
                    Distribuicao de pontos{poolActive ? ` (por aluno: ${eff} questoes)` : ''}
                  </span>
                  <span className={`text-xs font-bold ${Math.abs(effectiveTotal - 10) < 0.01 ? 'text-green-400' : 'text-red-400'}`}>
                    Por aluno: {effectiveTotal.toFixed(2)} / 10
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exercises.map((ex, i) => {
                    const qType = ex.type || 'code';
                    const p = scoringMode === 'manual' ? (ex.points ?? pts[i]) : pts[i];
                    return (
                      <span key={i} className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                        qType === 'code' ? 'bg-blue-500/15 text-blue-400' :
                        qType === 'multiple-choice' ? 'bg-purple-500/15 text-purple-400' :
                        qType === 'true-false' ? 'bg-green-500/15 text-green-400' :
                        'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        Q{i+1}: {p.toFixed(2)}pt
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Exercises / Questions */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-semibold text-lg">Questoes ({exercises.length})</h3>
          <div className="flex gap-2 flex-wrap">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Database className="h-4 w-4 mr-1" /> Importar
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addExercise('code')}>
              <Code2 className="h-4 w-4 mr-1" /> Codigo
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addExercise('multiple-choice')}>
              <ClipboardList className="h-4 w-4 mr-1" /> Alternativas
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addExercise('true-false')}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> V/F
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => addExercise('fill-blank')}>
              <Edit3 className="h-4 w-4 mr-1" /> Preencher
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, exIdx) => {
            const qType = ex.type || 'code';
            return (
            <div key={exIdx} className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-primary">Questao {exIdx + 1}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    qType === 'code' ? 'bg-blue-500/20 text-blue-400' :
                    qType === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
                    qType === 'true-false' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>{QUESTION_TYPE_LABELS[qType]}</span>
                  {scoringMode === 'manual' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={ex.points ?? 0}
                        onChange={(e) => updateExercise(exIdx, 'points', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-16 px-1.5 py-0.5 rounded border border-border bg-background text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <span className="text-[10px] text-muted-foreground">pts</span>
                    </div>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {calcPointsPreview(exercises, scoringMode, (() => { const cc = exercises.filter(e => e.type === 'code').length; const oc = exercises.filter(e => e.type !== 'code').length; const rc = maxCodeQuestions > 0 && maxCodeQuestions < cc ? maxCodeQuestions : cc; const ro = maxObjectiveQuestions > 0 && maxObjectiveQuestions < oc ? maxObjectiveQuestions : oc; const tot = rc + ro; return tot < exercises.length ? tot : undefined; })())[exIdx]?.toFixed(2)}pt
                    </span>
                  )}
                </div>
                {exercises.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(exIdx)} className="text-destructive h-7">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {/* Title + Description (common to all types) */}
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
                  <label className="block text-xs font-semibold mb-1">{qType === 'code' ? 'Enunciado' : 'Pergunta'}</label>
                  <RichTextEditor
                    value={ex.description}
                    onChange={(html) => updateExercise(exIdx, 'description', html)}
                    placeholder={qType === 'code' ? 'Descreva o que o aluno deve fazer...' : 'Digite a pergunta...'}
                    minHeight="80px"
                  />
                </div>

                {/* ── CODE type ── */}
                {qType === 'code' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Codigo inicial (template)</label>
                      <textarea
                        value={ex.starterCode}
                        onChange={(e) => updateExercise(exIdx, 'starterCode', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
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
                              <button type="button" onClick={() => removeTestCase(exIdx, tcIdx)} className="mt-4 p-1 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── MULTIPLE CHOICE type ── */}
                {qType === 'multiple-choice' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Codigo (opcional, exibido acima das alternativas)</label>
                      <textarea
                        value={ex.codeSnippet || ''}
                        onChange={(e) => updateExercise(exIdx, 'codeSnippet', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="int x = 10; // opcional..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">Alternativas</label>
                      <div className="space-y-2">
                        {(ex.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateExercise(exIdx, 'correctIndex', optIdx)}
                              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                ex.correctIndex === optIdx ? 'border-green-500 bg-green-500/20' : 'border-border hover:border-primary/50'
                              }`}
                              title={ex.correctIndex === optIdx ? 'Resposta correta' : 'Marcar como correta'}
                            >
                              {ex.correctIndex === optIdx && <Check className="h-3 w-3 text-green-500" />}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(exIdx, optIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                              placeholder={`Alternativa ${String.fromCharCode(65 + optIdx)}`}
                            />
                            {(ex.options || []).length > 2 && (
                              <button type="button" onClick={() => removeOption(exIdx, optIdx)} className="p-1 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => addOption(exIdx)} className="mt-2 h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Alternativa
                      </Button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Explicacao (exibida apos responder)</label>
                      <input
                        type="text"
                        value={ex.explanation || ''}
                        onChange={(e) => updateExercise(exIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Porque a resposta correta e..."
                      />
                    </div>
                  </>
                )}

                {/* ── TRUE/FALSE type ── */}
                {qType === 'true-false' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Codigo (opcional)</label>
                      <textarea
                        value={ex.codeSnippet || ''}
                        onChange={(e) => updateExercise(exIdx, 'codeSnippet', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="int x = 10; // opcional..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">Resposta correta</label>
                      <div className="flex gap-3">
                        {['Verdadeiro', 'Falso'].map((label, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => updateExercise(exIdx, 'correctIndex', i)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                              ex.correctIndex === i
                                ? 'border-green-500 bg-green-500/20 text-green-400'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Explicacao (exibida apos responder)</label>
                      <input
                        type="text"
                        value={ex.explanation || ''}
                        onChange={(e) => updateExercise(exIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Porque a afirmacao e verdadeira/falsa..."
                      />
                    </div>
                  </>
                )}

                {/* ── FILL-BLANK type ── */}
                {qType === 'fill-blank' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Codigo antes do espaco em branco</label>
                      <textarea
                        value={ex.snippetBefore || ''}
                        onChange={(e) => updateExercise(exIdx, 'snippetBefore', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="int x = "
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Codigo depois do espaco em branco</label>
                      <textarea
                        value={ex.snippetAfter || ''}
                        onChange={(e) => updateExercise(exIdx, 'snippetAfter', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="; // resto do codigo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-2">Opcoes (marque a correta)</label>
                      <div className="space-y-2">
                        {(ex.options || []).map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateExercise(exIdx, 'correctIndex', optIdx)}
                              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                ex.correctIndex === optIdx ? 'border-green-500 bg-green-500/20' : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {ex.correctIndex === optIdx && <Check className="h-3 w-3 text-green-500" />}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(exIdx, optIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded border border-border bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                              placeholder={`Opcao ${optIdx + 1}`}
                            />
                            {(ex.options || []).length > 2 && (
                              <button type="button" onClick={() => removeOption(exIdx, optIdx)} className="p-1 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => addOption(exIdx)} className="mt-2 h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Opcao
                      </Button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Explicacao (opcional)</label>
                      <input
                        type="text"
                        value={ex.explanation || ''}
                        onChange={(e) => updateExercise(exIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => {
          const codePoolSize = exercises.filter((e) => e.type === 'code').length;
          const objPoolSize  = exercises.filter((e) => e.type !== 'code').length;
          const resolvedCode = maxCodeQuestions > 0 && maxCodeQuestions < codePoolSize ? maxCodeQuestions : null;
          const resolvedObj  = maxObjectiveQuestions > 0 && maxObjectiveQuestions < objPoolSize ? maxObjectiveQuestions : null;
          const totalPerStudent = (resolvedCode ?? codePoolSize) + (resolvedObj ?? objPoolSize);
          const effectiveCount = totalPerStudent < exercises.length ? totalPerStudent : undefined;
          const pts = calcPointsPreview(exercises, scoringMode, effectiveCount);
          const finalExercises = exercises.map((ex, i) => ({ ...ex, points: scoringMode === 'manual' ? (ex.points ?? 0) : pts[i] }));
          const maxQComputed = effectiveCount ?? null; // derived sum for legacy compat
          onSave({ title, description, exercises: finalExercises, maxSubmissions, maxQuestions: maxQComputed, maxCodeQuestions: resolvedCode, maxObjectiveQuestions: resolvedObj, shuffleQuestions, shuffleOptions, scoringMode, subject });
        }} disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          {initial ? 'Salvar alteracoes' : 'Criar prova'}
        </Button>
      </div>

      {showImport && (
        <ImportQuestionsModal
          bankQuestions={bankQuestions}
          onImport={handleImport}
          onClose={() => setShowImport(false)}
          examSubject={subject}
        />
      )}
    </div>
  );
}

// ── Question Bank Manager ────────────────────────────────────────────
const SUBJECT_LABELS: Record<SubjectKey, string> = { poo: 'POO', bi: 'Business Intelligence', logica: 'Logica de Programacao' };

function QuestionBank({ getToken }: { getToken: () => Promise<string> }) {
  const [questions, setQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BankQuestion | null>(null);
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('poo');

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
          type: q.type || 'code',
          title: q.title,
          description: q.description || '',
          starterCode: q.starterCode || '',
          testCases: q.testCases || [],
          options: q.options || [],
          correctIndex: q.correctIndex ?? 0,
          codeSnippet: q.codeSnippet || '',
          snippetBefore: q.snippetBefore || '',
          snippetAfter: q.snippetAfter || '',
          explanation: q.explanation || '',
          tags: q.tags || [],
          difficulty: q.difficulty || '',
          subject: q.subject || 'poo',
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
    if ((q.subject ?? 'poo') !== activeSubject) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return q.title.toLowerCase().includes(s) || q.description.toLowerCase().includes(s) || q.tags.some((t) => t.toLowerCase().includes(s));
  });

  if (loading) return <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;

  // Editing/creating a question
  if (editForm || showNew) {
    const q = editForm || {
      id: '', type: 'code' as QuestionType, title: '', description: '', starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }] as TestCase[],
      tags: [] as string[], difficulty: '', subject: activeSubject, createdAt: '', updatedAt: '',
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

      {/* Abas de materia */}
      <div className="flex gap-1 mb-4 border-b border-border">
        {(Object.entries(SUBJECT_LABELS) as [SubjectKey, string][]).map(([key, label]) => {
          const count = questions.filter((q) => (q.subject ?? 'poo') === key).length;
          return (
            <button
              key={key}
              onClick={() => { setActiveSubject(key); setSearch(''); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeSubject === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
              <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
            </button>
          );
        })}
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
          <p>{filtered.length === 0 && questions.filter(q => (q.subject ?? 'poo') === activeSubject).length === 0 ? `Nenhuma questao de ${SUBJECT_LABELS[activeSubject]} ainda.` : 'Nenhuma questao encontrada.'}</p>
          <p className="text-sm mt-1">{activeSubject === 'poo' ? 'Use "Importar dos exercicios" para trazer as questoes existentes ou crie uma nova.' : 'Crie uma nova questao para esta materia.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <div key={q.id} className="rounded-lg border border-border bg-card px-4 py-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{q.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                    (q.type || 'code') === 'code' ? 'bg-blue-500/20 text-blue-400' :
                    q.type === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
                    q.type === 'true-false' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {(q.type || 'code') === 'code' ? 'Codigo' : q.type === 'multiple-choice' ? 'Alternativas' : q.type === 'true-false' ? 'V/F' : 'Preencher'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.description ? q.description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() || 'Sem descricao' : 'Sem descricao'}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {q.difficulty && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      q.difficulty === 'facil' ? 'bg-green-500/20 text-green-600' :
                      q.difficulty === 'medio' ? 'bg-yellow-500/20 text-yellow-600' :
                      'bg-red-500/20 text-red-600'
                    }`}>{q.difficulty}</span>
                  )}
                  {(q.type || 'code') === 'code' && (
                    <span className="text-[10px] text-muted-foreground">{q.testCases.length} teste(s)</span>
                  )}
                  {q.type === 'multiple-choice' && (
                    <span className="text-[10px] text-muted-foreground">{(q.options || []).length} opcoes</span>
                  )}
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
  const [type, setType] = useState<QuestionType>((question as BankQuestion).type || 'code');
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || '');
  const [starterCode, setStarterCode] = useState(question.starterCode || '');
  const [testCases, setTestCases] = useState<TestCase[]>(question.testCases);
  const [tags, setTags] = useState(question.tags?.join(', ') || '');
  const [difficulty, setDifficulty] = useState(question.difficulty || '');
  const [subject, setSubject] = useState<SubjectKey>((question as BankQuestion).subject || 'poo');
  // Objective question fields
  const [options, setOptions] = useState<string[]>(question.options || (type === 'true-false' ? ['Verdadeiro', 'Falso'] : ['', '', '', '']));
  const [correctIndex, setCorrectIndex] = useState(question.correctIndex ?? 0);
  const [codeSnippet, setCodeSnippet] = useState(question.codeSnippet || '');
  const [snippetBefore, setSnippetBefore] = useState(question.snippetBefore || '');
  const [snippetAfter, setSnippetAfter] = useState(question.snippetAfter || '');
  const [explanation, setExplanation] = useState(question.explanation || '');
  const [imageUrl, setImageUrl] = useState((question as BankQuestion).imageUrl || '');

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'true-false') {
      setOptions(['Verdadeiro', 'Falso']);
      setCorrectIndex(0);
    } else if (newType === 'multiple-choice') {
      if (options.length < 2) setOptions(['', '', '', '']);
      setCorrectIndex(0);
    } else if (newType === 'fill-blank') {
      setOptions(['', '', '', '']);
      setCorrectIndex(0);
      if (!snippetBefore) setSnippetBefore('// codigo antes\n');
      if (!snippetAfter) setSnippetAfter('\n// codigo depois');
    }
  };

  const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    'code': 'Codigo',
    'multiple-choice': 'Alternativas',
    'true-false': 'Verdadeiro/Falso',
    'fill-blank': 'Preencher trecho',
  };

  const handleSaveClick = () => {
    const base: Partial<BankQuestion> & { title: string } = {
      id: question.id,
      type,
      title,
      description,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      difficulty,
      subject,
      starterCode: type === 'code' ? starterCode : '',
      testCases: type === 'code' ? testCases : [],
      imageUrl: imageUrl.trim() || undefined,
    };
    if (type === 'multiple-choice' || type === 'true-false' || type === 'fill-blank') {
      base.options = options;
      base.correctIndex = correctIndex;
      base.explanation = explanation;
    }
    if (type === 'multiple-choice' || type === 'true-false') {
      base.codeSnippet = codeSnippet;
    }
    if (type === 'fill-blank') {
      base.snippetBefore = snippetBefore;
      base.snippetAfter = snippetAfter;
    }
    onSave(base);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{question.id ? 'Editar Questao' : 'Nova Questao'}</h2>
      </div>
      <div className="space-y-3">
        {/* Subject selector */}
        <div>
          <label className="block text-sm font-semibold mb-1">Materia</label>
          <div className="flex gap-2">
            {([['poo', 'POO'], ['bi', 'Business Intelligence'], ['logica', 'Logica de Programacao']] as [SubjectKey, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSubject(key)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  subject === key
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border hover:bg-muted/50 text-muted-foreground'
                }`}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Type selector */}
        {!question.id && (
          <div>
            <label className="block text-sm font-semibold mb-1">Tipo da questao</label>
            <div className="flex gap-2 flex-wrap">
              {(['code', 'multiple-choice', 'true-false', 'fill-blank'] as QuestionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    type === t
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {t === 'code' && <Code2 className="h-3.5 w-3.5" />}
                  {t === 'multiple-choice' && <ClipboardList className="h-3.5 w-3.5" />}
                  {t === 'true-false' && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {t === 'fill-blank' && <Edit3 className="h-3.5 w-3.5" />}
                  {QUESTION_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show type badge when editing */}
        {question.id && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tipo:</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              type === 'code' ? 'bg-blue-500/20 text-blue-400' :
              type === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
              type === 'true-false' ? 'bg-green-500/20 text-green-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>{QUESTION_TYPE_LABELS[type]}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1">Titulo *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">{type === 'code' ? 'Enunciado' : 'Pergunta'}</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder={type === 'code' ? 'Descreva o que o aluno deve fazer...' : 'Digite a pergunta...'}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Imagem do enunciado (URL, opcional)</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... cole o link da imagem"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          {imageUrl.trim() && (
            <img src={imageUrl} alt="preview" className="mt-2 max-h-48 rounded-lg border border-border object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
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

        {/* ── CODE type fields ── */}
        {type === 'code' && (
          <>
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
          </>
        )}

        {/* ── MULTIPLE CHOICE type fields ── */}
        {type === 'multiple-choice' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Trecho de codigo (opcional)</label>
              <textarea value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Cole aqui um trecho de codigo para exibir junto com a pergunta (opcional)" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Alternativas ({options.length})</label>
                <Button variant="ghost" size="sm" onClick={() => setOptions((prev) => [...prev, ''])} className="h-6 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Opcao
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        correctIndex === i ? 'border-green-500 bg-green-500/20' : 'border-border hover:border-primary/50'
                      }`}
                      title="Marcar como correta"
                    >
                      {correctIndex === i && <Check className="h-3.5 w-3.5 text-green-500" />}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => setOptions((prev) => prev.map((o, j) => j === i ? e.target.value : o))}
                      className="flex-1 px-3 py-1.5 rounded border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Alternativa ${String.fromCharCode(65 + i)}`}
                    />
                    {options.length > 2 && (
                      <button type="button" onClick={() => {
                        setOptions((prev) => prev.filter((_, j) => j !== i));
                        if (correctIndex >= options.length - 1) setCorrectIndex(0);
                      }} className="p-1 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Clique no circulo para marcar a alternativa correta.</p>
            </div>
          </>
        )}

        {/* ── TRUE/FALSE type fields ── */}
        {type === 'true-false' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Trecho de codigo (opcional)</label>
              <textarea value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Cole aqui um trecho de codigo para exibir junto com a pergunta (opcional)" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Resposta correta</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectIndex(0)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    correctIndex === 0 ? 'border-green-500 bg-green-500/20 text-green-400 font-medium' : 'border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" /> Verdadeiro
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectIndex(1)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                    correctIndex === 1 ? 'border-red-500 bg-red-500/20 text-red-400 font-medium' : 'border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <XCircle className="h-4 w-4" /> Falso
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── FILL-BLANK type fields ── */}
        {type === 'fill-blank' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">Codigo antes do trecho em branco</label>
              <textarea value={snippetBefore} onChange={(e) => setSnippetBefore(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="// codigo que aparece antes do campo de preencher" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Codigo depois do trecho em branco</label>
              <textarea value={snippetAfter} onChange={(e) => setSnippetAfter(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm font-mono min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="// codigo que aparece depois do campo de preencher" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Opcoes de preenchimento ({options.length})</label>
                <Button variant="ghost" size="sm" onClick={() => setOptions((prev) => [...prev, ''])} className="h-6 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Opcao
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(i)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        correctIndex === i ? 'border-green-500 bg-green-500/20' : 'border-border hover:border-primary/50'
                      }`}
                      title="Marcar como correta"
                    >
                      {correctIndex === i && <Check className="h-3.5 w-3.5 text-green-500" />}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => setOptions((prev) => prev.map((o, j) => j === i ? e.target.value : o))}
                      className="flex-1 px-3 py-1.5 rounded border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Opcao ${i + 1}`}
                    />
                    {options.length > 2 && (
                      <button type="button" onClick={() => {
                        setOptions((prev) => prev.filter((_, j) => j !== i));
                        if (correctIndex >= options.length - 1) setCorrectIndex(0);
                      }} className="p-1 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Clique no circulo para marcar a opcao correta que preenche o trecho.</p>
            </div>
          </>
        )}

        {/* Explanation (for objective types) */}
        {type !== 'code' && (
          <div>
            <label className="block text-sm font-semibold mb-1">Explicacao (opcional, para referencia do professor)</label>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-border bg-background text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Por que esta e a resposta correta? (nao sera exibida ao aluno durante a prova)" />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSaveClick} disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
          Salvar
        </Button>
      </div>
    </div>
  );
}

// ── Exam Results Viewer ──────────────────────────────────────────────
function ExamResults({ examId, exam, getToken, onGradesToggle }: { examId: string; exam: Exam; getToken: () => Promise<string>; onGradesToggle: (patch?: Partial<Exam>) => void }) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [releasingGrades, setReleasingGrades] = useState(false);
  const [releasingAnswers, setReleasingAnswers] = useState(false);
  const [releasingCorrect, setReleasingCorrect] = useState(false);
  const [resettingUser, setResettingUser] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
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
  }, [examId, getToken]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const handleResetSession = async (student: StudentResult) => {
    if (!confirm(`Resetar a prova de "${student.userName}"?\n\nIsso apagara todas as submissoes, registros de saida de aba e tentativas de cola deste aluno. Ele podera refazer a prova do zero.`)) return;
    setResettingUser(student.userId);
    try {
      const token = await getToken();
      const base = getApiBase();
      await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_session', examId, userId: student.userId }),
      });
      await fetchResults();
    } catch { /* ignore */ }
    setResettingUser(null);
  };

  // Calculate grade for a student (0-10 scale)
  // Uses questionOrder (the subset this student actually received) if available
  const calcGrade = (student: StudentResult): number => {
    const indices = student.questionOrder ?? exam.exercises.map((_, i) => i);
    const n = indices.length;
    if (n === 0) return 0;
    let earned = 0;
    let totalPoints = 0;
    for (const idx of indices) {
      const pts = exam.exercises[idx]?.points ?? (10 / n);
      totalPoints += pts;
      const bestSub = student.submissions
        .filter((s) => s.exerciseIndex === idx)
        .sort((a, b) => b.passedTests - a.passedTests)[0];
      if (bestSub?.allPassed) earned += pts;
    }
    if (totalPoints === 0) return 0;
    return Math.round((earned / totalPoints) * 10 * 100) / 100;
  };

  const handleToggleGrades = async () => {
    setReleasingGrades(true);
    try {
      const token = await getToken();
      const base = getApiBase();
      const next = !exam.gradesReleased;
      await fetch(`${base}/api/admin/exams`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exam.id, gradesReleased: next }),
      });
      onGradesToggle({ gradesReleased: next });
    } catch { /* ignore */ }
    setReleasingGrades(false);
  };

  const handleToggleAnswers = async () => {
    setReleasingAnswers(true);
    try {
      const token = await getToken();
      const base = getApiBase();
      const next = !exam.answersReleased;
      await fetch(`${base}/api/admin/exams`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exam.id, answersReleased: next }),
      });
      onGradesToggle({ answersReleased: next });
    } catch { /* ignore */ }
    setReleasingAnswers(false);
  };

  const handleToggleCorrect = async () => {
    setReleasingCorrect(true);
    try {
      const token = await getToken();
      const base = getApiBase();
      const next = !exam.correctAnswersReleased;
      await fetch(`${base}/api/admin/exams`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exam.id, correctAnswersReleased: next }),
      });
      onGradesToggle({ correctAnswersReleased: next });
    } catch { /* ignore */ }
    setReleasingCorrect(false);
  };

  const exportToExcel = () => {
    // Build data rows
    const header = ['NOTAS', 'Nome Completo', 'Email', 'Pontos obtidos', 'Pontos total', 'Acertos', 'Total Questoes', 'Inicio', 'Fim', 'Duracao (min)', 'Saidas da aba', 'Tentativas de cola'];
    const dataRows = results.map((student) => {
      const grade = calcGrade(student);
      const indices = student.questionOrder ?? exam.exercises.map((_, i) => i);
      const n = indices.length;
      let correct = 0;
      let earned = 0;
      let totalPts = 0;
      for (const idx of indices) {
        const pts = exam.exercises[idx]?.points ?? (10 / n);
        totalPts += pts;
        const bestSub = student.submissions
          .filter((s) => s.exerciseIndex === idx)
          .sort((a, b) => b.passedTests - a.passedTests)[0];
        if (bestSub?.allPassed) { correct++; earned += pts; }
      }
      const startTime = student.accessedAt ? new Date(student.accessedAt).toLocaleString('pt-BR') : '';
      const endTime = student.finalizedAt ? new Date(student.finalizedAt).toLocaleString('pt-BR') : '';
      const duration = student.accessedAt && student.finalizedAt
        ? Math.round((new Date(student.finalizedAt).getTime() - new Date(student.accessedAt).getTime()) / 60000)
        : '';
      return [
        parseFloat(grade.toFixed(2)),
        student.userName || student.userEmail,
        student.userEmail,
        parseFloat(earned.toFixed(2)),
        parseFloat(totalPts.toFixed(2)),
        correct,
        n,
        startTime,
        endTime,
        duration,
        student.tabSwitches ?? 0,
        student.cheatAttempts ?? 0,
      ];
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const wsData = [header, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws['!cols'] = [
      { wch: 10 }, // NOTAS
      { wch: 32 }, // Nome Completo
      { wch: 32 }, // Email
      { wch: 16 }, // Pontos obtidos
      { wch: 14 }, // Pontos total
      { wch: 10 }, // Acertos
      { wch: 16 }, // Total Questoes
      { wch: 20 }, // Inicio
      { wch: 20 }, // Fim
      { wch: 15 }, // Duracao
      { wch: 14 }, // Saidas da aba
      { wch: 18 }, // Tentativas de cola
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Notas');

    const fileName = `notas-${exam.title.replace(/[^a-zA-Z0-9]/g, '-')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) return <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>;

  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">Nenhuma submissao recebida ainda.</p>;
  }

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${exam.gradesReleased ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
            {exam.gradesReleased ? '✓ Notas liberadas' : '— Notas ocultas'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${exam.answersReleased ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
            {exam.answersReleased ? '✓ Respostas liberadas' : '— Respostas ocultas'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${exam.correctAnswersReleased ? 'bg-purple-500/20 text-purple-400' : 'bg-muted text-muted-foreground'}`}>
            {exam.correctAnswersReleased ? '✓ Gabarito liberado' : '— Gabarito oculto'}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">{results.length} aluno(s)</span>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleGrades}
            disabled={releasingGrades}
            className={exam.gradesReleased ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-green-500/50 text-green-500 hover:bg-green-500/10'}
          >
            {releasingGrades ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
            {exam.gradesReleased ? 'Ocultar notas' : 'Liberar notas'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAnswers}
            disabled={releasingAnswers}
            className={exam.answersReleased ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-blue-500/50 text-blue-500 hover:bg-blue-500/10'}
          >
            {releasingAnswers ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <FileText className="h-3.5 w-3.5 mr-1" />}
            {exam.answersReleased ? 'Ocultar respostas' : 'Liberar respostas'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleCorrect}
            disabled={releasingCorrect}
            className={exam.correctAnswersReleased ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-purple-500/50 text-purple-500 hover:bg-purple-500/10'}
          >
            {releasingCorrect ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <ThumbsUp className="h-3.5 w-3.5 mr-1" />}
            {exam.correctAnswersReleased ? 'Ocultar gabarito' : 'Liberar gabarito'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel} className="ml-auto">
            <Download className="h-3.5 w-3.5 mr-1" /> Exportar Excel
          </Button>
        </div>
      </div>

      {/* Student results */}
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
                  <div className="flex items-center gap-3 mt-0.5">
                    {student.accessedAt && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        Inicio: {new Date(student.accessedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {student.finalizedAt && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        Fim: {new Date(student.finalizedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {student.accessedAt && student.finalizedAt && (() => {
                      const mins = Math.round((new Date(student.finalizedAt).getTime() - new Date(student.accessedAt).getTime()) / 60000);
                      return <span className="text-[10px] text-primary font-medium">({mins} min)</span>;
                    })()}
                    {student.finalized && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Finalizada</span>
                    )}
                    {!student.finalized && student.accessedAt && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">Em andamento</span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  calcGrade(student) >= 7 ? 'bg-green-500/20 text-green-400' :
                  calcGrade(student) >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {calcGrade(student).toFixed(1)}
                </span>
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
                {/* Reset session / Actions */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Permitir que este aluno refaca a prova
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetSession(student)}
                    disabled={resettingUser === student.userId}
                    className="text-xs h-7 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                  >
                    {resettingUser === student.userId ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <RotateCcw className="h-3 w-3 mr-1" />
                    )}
                    Resetar prova
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ── Main AdminExams Component ────────────────────────────────────────
const SUBJECTS: { key: SubjectKey; label: string; short: string }[] = [
  { key: 'poo', label: 'Programacao Orientada a Objetos', short: 'POO' },
  { key: 'bi', label: 'Business Intelligence', short: 'BI' },
  { key: 'logica', label: 'Logica de Programacao', short: 'Logica' },
];

export default function AdminExams({ getToken }: { getToken: () => Promise<string> }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [bankQuestions, setBankQuestions] = useState<BankQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'results' | 'bank'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('poo');

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

  const handleCreate = async (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number; maxQuestions: number | null; maxCodeQuestions: number | null; maxObjectiveQuestions: number | null; shuffleQuestions: boolean; shuffleOptions: boolean; scoringMode: 'equal' | 'code-weighted' | 'manual'; subject: SubjectKey }) => {
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

  const handleUpdate = async (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number; maxQuestions: number | null; maxCodeQuestions: number | null; maxObjectiveQuestions: number | null; shuffleQuestions: boolean; shuffleOptions: boolean; scoringMode: 'equal' | 'code-weighted' | 'manual'; subject: SubjectKey }) => {
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

  const handleDuplicate = async (exam: Exam) => {
    setSaving(true);
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${exam.title} (copia)`,
          description: exam.description,
          exercises: exam.exercises,
          maxSubmissions: exam.maxSubmissions,
          maxQuestions: exam.maxQuestions ?? null,
          maxCodeQuestions: exam.maxCodeQuestions ?? null,
          maxObjectiveQuestions: exam.maxObjectiveQuestions ?? null,
          shuffleQuestions: exam.shuffleQuestions,
          shuffleOptions: exam.shuffleOptions,
          scoringMode: exam.scoringMode,
          subject: exam.subject ?? 'poo',
        }),
      });
      if (resp.ok) await fetchExams();
    } catch { /* ignore */ }
    setSaving(false);
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
    const subjectInfo = SUBJECTS.find((s) => s.key === activeSubject)!;
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Nova Prova</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{subjectInfo.short}</span>
        </div>
        <ExamForm onSave={handleCreate} onCancel={() => setView('list')} saving={saving} bankQuestions={bankQuestions} defaultSubject={activeSubject} />
      </div>
    );
  }

  if (view === 'edit' && selectedExam) {
    const subjectInfo = SUBJECTS.find((s) => s.key === (selectedExam.subject ?? 'poo'))!;
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Editar: {selectedExam.title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">{subjectInfo.short}</span>
        </div>
        <ExamForm initial={selectedExam} onSave={handleUpdate} onCancel={() => { setView('list'); setSelectedExam(null); }} saving={saving} bankQuestions={bankQuestions} defaultSubject={selectedExam.subject ?? 'poo'} />
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
        <ExamResults examId={selectedExam.id} exam={selectedExam} getToken={getToken} onGradesToggle={async (patch) => { await fetchExams(); setSelectedExam((prev) => prev ? { ...prev, ...patch } : null); }} />
      </div>
    );
  }

  // List view
  const filteredExams = exams.filter((e) => (e.subject ?? 'poo') === activeSubject);
  const activeSubjectInfo = SUBJECTS.find((s) => s.key === activeSubject)!;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Provas Online
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

      {/* Subject tabs */}
      <div className="flex gap-1 mb-4 border-b border-border">
        {SUBJECTS.map((s) => {
          const count = exams.filter((e) => (e.subject ?? 'poo') === s.key).length;
          return (
            <button
              key={s.key}
              onClick={() => setActiveSubject(s.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition-colors ${
                activeSubject === s.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {s.short}
              {count > 0 && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeSubject === s.key ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Exam link info */}
      <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm text-muted-foreground mb-1">Link para os alunos acessarem as provas ({activeSubjectInfo.short}):</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">{examLink}</code>
          <button onClick={() => copyToClipboard(examLink)} className="text-primary hover:text-primary/80">
            <Copy className="h-4 w-4" />
          </button>
          {copiedCode === examLink && <span className="text-xs text-green-400">Copiado!</span>}
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma prova de {activeSubjectInfo.short} criada ainda.</p>
          <p className="text-sm mt-1">Clique em "Nova Prova" para comecar ou monte seu banco de questoes primeiro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
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
                    {(() => {
                      const codePool = exam.exercises.filter(e => e.type === 'code').length;
                      const objPool  = exam.exercises.filter(e => e.type !== 'code').length;
                      const hasCodeLimit = exam.maxCodeQuestions && exam.maxCodeQuestions < codePool;
                      const hasObjLimit  = exam.maxObjectiveQuestions && exam.maxObjectiveQuestions < objPool;
                      if (hasCodeLimit || hasObjLimit) {
                        const cPick = hasCodeLimit ? exam.maxCodeQuestions! : codePool;
                        const oPick = hasObjLimit  ? exam.maxObjectiveQuestions! : objPool;
                        return <><span className="text-primary font-medium">{cPick + oPick}/{exam.exercises.length} questões por aluno{codePool > 0 && objPool > 0 ? ` (${cPick} código + ${oPick} obj)` : ''}</span> &bull; </>;
                      }
                      return <>{exam.exercises.length} questão(ões) &bull; </>;
                    })()}
                    Max {exam.maxSubmissions} submissões &bull; Criada em {new Date(exam.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedExam(exam); setView('results'); }}>
                    <Users className="h-3.5 w-3.5 mr-1" /> Resultados
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedExam(exam); setView('edit'); }}>
                    <FileText className="h-3.5 w-3.5 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(exam)} disabled={saving} title="Duplicar prova">
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copiar
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
