import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plus, Trash2, Eye, EyeOff, Copy, RefreshCw, Loader2, ChevronDown, ChevronUp,
  FileText, CheckCircle2, XCircle, Code2, ClipboardList, Users, Lock, KeyRound,
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

// ── Exam Form Component ──────────────────────────────────────────────
function ExamForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: Exam;
  onSave: (data: { title: string; description: string; exercises: ExamExercise[]; maxSubmissions: number }) => void;
  onCancel: () => void;
  saving: boolean;
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

  const addExercise = () => {
    setExercises((prev) => [...prev, {
      title: `Exercicio ${prev.length + 1}`,
      description: '',
      starterCode: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Seu codigo aqui\n    }\n}',
      testCases: [{ input: '', expectedOutput: '', visible: true }],
    }]);
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
          <Button type="button" variant="outline" size="sm" onClick={addExercise}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar exercicio
          </Button>
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
        const resp = await fetch(`${base}/api/admin/exam-results?examId=${examId}`, {
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
        // Best result per exercise
        const bestByExercise: Record<number, { passedTests: number; totalTests: number; allPassed: boolean; attempts: number }> = {};
        for (const sub of student.submissions) {
          const existing = bestByExercise[sub.exerciseIndex];
          if (!existing || sub.passedTests > existing.passedTests) {
            bestByExercise[sub.exerciseIndex] = {
              passedTests: sub.passedTests,
              totalTests: sub.totalTests,
              allPassed: sub.allPassed,
              attempts: Math.max(sub.attemptNumber, existing?.attempts ?? 0),
            };
          } else {
            bestByExercise[sub.exerciseIndex] = {
              ...existing,
              attempts: Math.max(sub.attemptNumber, existing.attempts),
            };
          }
        }

        return (
          <div key={student.userId} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setExpandedStudent(isExpanded ? null : student.userId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{student.userName}</div>
                  <div className="text-xs text-muted-foreground">{student.userEmail}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Summary icons per exercise */}
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
                              {sub.allPassed
                                ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                                : <XCircle className="h-4 w-4 text-red-400" />
                              }
                              <span className="font-semibold">Ex. {sub.exerciseIndex + 1}</span>
                              <span className="text-muted-foreground">
                                Tentativa {sub.attemptNumber} &bull; {sub.passedTests}/{sub.totalTests} testes
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(sub.submittedAt).toLocaleString('pt-BR')}
                              </span>
                              <button
                                onClick={() => setExpandedCode(showCode ? null : codeKey)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <Code2 className="h-3 w-3" />
                                {showCode ? 'Ocultar' : 'Ver codigo'}
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'results'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [copiedCode, setCopiedCode] = useState('');

  const base = getApiBase();

  const fetchExams = useCallback(async () => {
    try {
      const token = await getToken();
      const resp = await fetch(`${base}/api/admin/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      if (resp.ok) setExams(data.exams || []);
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
      if (resp.ok) {
        await fetchExams();
        setView('list');
      }
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
      if (resp.ok) {
        await fetchExams();
        setView('list');
        setSelectedExam(null);
      }
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
      await fetch(`${base}/api/admin/exams?id=${exam.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
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
      if (resp.ok) {
        await fetchExams();
      }
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

  if (view === 'create') {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Nova Prova</h2>
        <ExamForm onSave={handleCreate} onCancel={() => setView('list')} saving={saving} />
      </div>
    );
  }

  if (view === 'edit' && selectedExam) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Editar: {selectedExam.title}</h2>
        <ExamForm initial={selectedExam} onSave={handleUpdate} onCancel={() => { setView('list'); setSelectedExam(null); }} saving={saving} />
      </div>
    );
  }

  if (view === 'results' && selectedExam) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Resultados: {selectedExam.title}</h2>
          <Button variant="outline" size="sm" onClick={() => { setView('list'); setSelectedExam(null); }}>
            Voltar
          </Button>
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
        <Button onClick={() => setView('create')} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Nova Prova
        </Button>
      </div>

      {/* Exam link info */}
      <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
        <p className="text-sm text-muted-foreground mb-1">
          Link para os alunos acessarem as provas:
        </p>
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
          <p className="text-sm mt-1">Clique em "Nova Prova" para comecar.</p>
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
