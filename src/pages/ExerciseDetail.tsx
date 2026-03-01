import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getExerciseById } from '@/data/exercises';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';
import {
  Play, Loader2, CheckCircle2, AlertCircle, XCircle,
  ChevronLeft, Lightbulb, RotateCcw, Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const JUDGE0_URL = 'https://ce.judge0.com';
const JAVA_LANGUAGE_ID = 91;

// ── Java Syntax Highlighter (same as TryItBox) ──
const JAVA_KEYWORDS = new Set([
  'abstract','assert','boolean','break','byte','case','catch','char','class','const',
  'continue','default','do','double','else','enum','extends','final','finally','float',
  'for','goto','if','implements','import','instanceof','int','interface','long','native',
  'new','package','private','protected','public','return','short','static','strictfp',
  'super','switch','synchronized','this','throw','throws','transient','try','void',
  'volatile','while','true','false','null','var','record','sealed','permits','yield',
]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightJava(code: string): string {
  const tokens: string[] = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const slice = end >= 0 ? code.slice(i, end + 2) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    } else if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    } else if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') { if (code[j] === '\\') j++; j++; }
      tokens.push(`<span style="color:#b45309">${escapeHtml(code.slice(i, j + 1))}</span>`);
      i = j + 1;
    } else if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'") { if (code[j] === '\\') j++; j++; }
      tokens.push(`<span style="color:#b45309">${escapeHtml(code.slice(i, j + 1))}</span>`);
      i = j + 1;
    } else if (code[i] === '@') {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      tokens.push(`<span style="color:#7c3aed">${escapeHtml(code.slice(i, j))}</span>`);
      i = j;
    } else if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (JAVA_KEYWORDS.has(word)) {
        tokens.push(`<span style="color:#7c3aed;font-weight:600">${escapeHtml(word)}</span>`);
      } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word)) {
        tokens.push(`<span style="color:#0369a1">${escapeHtml(word)}</span>`);
      } else {
        tokens.push(escapeHtml(word));
      }
      i = j;
    } else if (/\d/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\d.xXa-fA-FLlFfDd_]/.test(code[j])) j++;
      tokens.push(`<span style="color:#0d9488">${escapeHtml(code.slice(i, j))}</span>`);
      i = j;
    } else {
      tokens.push(escapeHtml(code[i]));
      i++;
    }
  }
  return tokens.join('');
}

// ── Judge0 helper (base64 + wait=true) ──
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string): string {
  try { return decodeURIComponent(escape(atob(b64))); } catch { return atob(b64); }
}

async function runJava(sourceCode: string, stdin = ''): Promise<{
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  status?: { id: number };
}> {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: toBase64(sourceCode),
      language_id: JAVA_LANGUAGE_ID,
      stdin: toBase64(stdin),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? err.error ?? `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (data.stdout) data.stdout = fromBase64(data.stdout);
  if (data.stderr) data.stderr = fromBase64(data.stderr);
  if (data.compile_output) data.compile_output = fromBase64(data.compile_output);
  return data;
}

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  visible: boolean;
  error?: string;
}

// Normalize output for comparison: trim, normalize line endings, remove trailing whitespace per line
function normalizeOutput(s: string): string {
  return s.split('\n').map((l) => l.trimEnd()).join('\n').trim();
}

const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  facil: { label: 'Fácil', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  medio: { label: 'Médio', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  dificil: { label: 'Difícil', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

// ── Auto-save helpers ──
function getDraftKey(exerciseId: string): string {
  return `desorientado-draft-${exerciseId}`;
}

function loadDraft(exerciseId: string, starterCode: string): string {
  try {
    const saved = localStorage.getItem(getDraftKey(exerciseId));
    // Only restore if it differs from starter code (means user actually wrote something)
    if (saved && saved !== starterCode) return saved;
  } catch { /* ignore */ }
  return starterCode;
}

function saveDraft(exerciseId: string, code: string) {
  try { localStorage.setItem(getDraftKey(exerciseId), code); } catch { /* ignore */ }
}

function clearDraft(exerciseId: string) {
  try { localStorage.removeItem(getDraftKey(exerciseId)); } catch { /* ignore */ }
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { completeExercise, saveExerciseAttempt } = useProgress();
  const exercise = useMemo(() => getExerciseById(id ?? ''), [id]);

  // Load saved draft (or starter code if no draft)
  const [code, setCode] = useState(() => loadDraft(exercise?.id ?? '', exercise?.starterCode ?? ''));
  const [hasDraft, setHasDraft] = useState(() => {
    if (!exercise) return false;
    try { const s = localStorage.getItem(getDraftKey(exercise.id)); return !!s && s !== exercise.starterCode; } catch { return false; }
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [compileError, setCompileError] = useState('');
  const [activeLine, setActiveLine] = useState(-1);

  // Auto-save code to localStorage on every change (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!exercise) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(exercise.id, code);
      setHasDraft(code !== exercise.starterCode);
    }, 500);
    return () => clearTimeout(saveTimerRef.current);
  }, [code, exercise]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const updateActiveLine = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const line = ta.value.substring(0, pos).split('\n').length;
    setActiveLine(line);
  }, []);

  const submitRef = useRef<() => void>();

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter → submit code
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitRef.current?.();
      return;
    }

    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = ta;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const linePrefix = value.substring(lineStart, start);
        const spacesToRemove = Math.min(4, linePrefix.length - linePrefix.trimStart().length, start - lineStart);
        if (spacesToRemove > 0) {
          const next = value.substring(0, lineStart) + value.substring(lineStart + spacesToRemove);
          setCode(next);
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = start - spacesToRemove;
            updateActiveLine();
          });
        }
      } else {
        const next = value.substring(0, start) + '    ' + value.substring(end);
        setCode(next);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
          updateActiveLine();
        });
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indent = currentLine.match(/^(\s*)/)?.[1] ?? '';
      const trimmed = value.substring(0, start).trimEnd();
      const extra = trimmed.endsWith('{') ? '    ' : '';
      const insertion = '\n' + indent + extra;
      const next = value.substring(0, start) + insertion + value.substring(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insertion.length;
        updateActiveLine();
      });
      return;
    }

    if (e.key === '}') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const beforeCursor = value.substring(lineStart, start);
      if (/^\s{4,}$/.test(beforeCursor)) {
        e.preventDefault();
        const dedented = value.substring(0, lineStart) + beforeCursor.substring(4) + '}' + value.substring(end);
        const newPos = start - 4 + 1;
        setCode(dedented);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = newPos;
          updateActiveLine();
        });
        return;
      }
    }
  }, [setCode, updateActiveLine]);

  if (!exercise) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Exercício não encontrado</h1>
          <Link to="/exercicios" className="text-primary hover:underline">Voltar para exercícios</Link>
        </div>
      </Layout>
    );
  }

  const diff = DIFF_LABELS[exercise.difficulty];

  const handleSubmit = async () => {
    if (running) return;
    setRunning(true);
    setResults(null);
    setCompileError('');

    const testResults: TestResult[] = [];

    try {
      for (const tc of exercise.testCases) {
        try {
          const result = await runJava(code, tc.input);

          // Compilation error — same for all tests, abort early
          if (result.status?.id === 6) {
            setCompileError(result.compile_output ?? 'Erro de compilação');
            setRunning(false);
            return;
          }

          const actual = normalizeOutput(result.stdout ?? '');
          const expected = normalizeOutput(tc.expectedOutput);
          const passed = actual === expected;
          const error = result.stderr?.trim() || undefined;

          testResults.push({
            input: tc.input,
            expected: tc.expectedOutput,
            actual: result.stdout?.trim() ?? '',
            passed,
            visible: tc.visible,
            error,
          });
        } catch {
          testResults.push({
            input: tc.input,
            expected: tc.expectedOutput,
            actual: '',
            passed: false,
            visible: tc.visible,
            error: 'Erro na API. Tente novamente.',
          });
        }
      }

      setResults(testResults);

      // Save result + award XP
      const passedCount = testResults.filter((r) => r.passed).length;
      const allPassed = passedCount === testResults.length;
      const score = `${passedCount}/${testResults.length}`;
      if (allPassed) {
        completeExercise(exercise.id, exercise.xpReward);
        clearDraft(exercise.id);
        setHasDraft(false);
      } else {
        saveExerciseAttempt(exercise.id, score);
      }
    } catch {
      setCompileError('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    setRunning(false);
  };

  submitRef.current = handleSubmit;

  const handleReset = () => {
    setCode(exercise.starterCode);
    clearDraft(exercise.id);
    setHasDraft(false);
    setResults(null);
    setCompileError('');
    setHintsShown(0);
  };

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const totalTests = exercise.testCases.length;
  const allPassed = results != null && passedCount === totalTests;

  return (
    <Layout>
      <div className="container py-8 max-w-5xl animate-fade-in">
        {/* Breadcrumb */}
        <Link to="/exercicios" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="h-4 w-4" />
          Voltar para exercícios
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${diff.color}`}>{diff.label}</span>
            <span className="text-xs text-muted-foreground">{exercise.xpReward} XP</span>
          </div>
          <p className="text-sm text-muted-foreground">{exercise.topicLabel}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left: Description */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-3">Enunciado</h2>
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {exercise.description}
              </div>
            </div>

            {/* Visible test cases */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-3">Exemplos</h2>
              <div className="space-y-3">
                {exercise.testCases.filter((tc) => tc.visible).map((tc, i) => (
                  <div key={i} className="text-sm rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="p-3">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">Entrada</div>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{tc.input || '(vazia)'}</pre>
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">Saída esperada</div>
                        <pre className="font-mono text-xs whitespace-pre-wrap">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {exercise.hints && exercise.hints.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    Dicas
                  </h2>
                  {hintsShown < exercise.hints.length && (
                    <Button variant="outline" size="sm" onClick={() => setHintsShown((h) => h + 1)}>
                      Revelar dica {hintsShown + 1}/{exercise.hints.length}
                    </Button>
                  )}
                </div>
                {hintsShown > 0 && (
                  <div className="space-y-2">
                    {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                      <div key={i} className="text-sm p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20 text-yellow-200/80">
                        <span className="font-medium text-yellow-400">Dica {i + 1}:</span>{' '}
                        <code className="text-xs bg-background/50 px-1 py-0.5 rounded">{hint}</code>
                      </div>
                    ))}
                  </div>
                )}
                {hintsShown === 0 && (
                  <p className="text-xs text-muted-foreground">Tente resolver sozinho primeiro!</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Editor + Results */}
          <div className="space-y-4">
            {/* Editor */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/20 bg-primary/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary text-sm">Seu código</span>
                  {hasDraft && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">rascunho salvo</span>}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Resetar
                  </Button>
                  <Button type="button" size="sm" onClick={handleSubmit} disabled={running} title="Ctrl+Enter">
                    {running
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Play className="h-4 w-4" />
                    }
                    <span className="ml-1.5">{running ? 'Avaliando...' : 'Submeter'}</span>
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <div className="relative rounded-lg border border-border bg-background overflow-hidden">
                  {/* Active line highlight */}
                  {activeLine > 0 && (
                    <div
                      className="absolute left-0 right-0 pointer-events-none z-[1]"
                      style={{
                        top: `calc(1rem + ${(activeLine - 1) * 1.625}em)`,
                        height: '1.625em',
                        background: 'hsl(var(--primary) / 0.08)',
                        borderLeft: '2px solid hsl(var(--primary) / 0.5)',
                      }}
                    />
                  )}
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 border-r border-border overflow-hidden pointer-events-none z-10">
                    <pre className="p-4 pr-2 text-right font-mono text-xs leading-[1.625] text-muted-foreground select-none">
                      {code.split('\n').map((_, i) => (
                        <span key={i} className={i + 1 === activeLine ? 'text-primary font-semibold' : ''}>
                          {i + 1}{'\n'}
                        </span>
                      ))}
                    </pre>
                  </div>
                  <pre
                    ref={preRef}
                    className="absolute inset-0 p-4 pl-14 font-mono text-sm leading-[1.625] whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-[2]"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: highlightJava(code) + '\n' }}
                  />
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => { setCode(e.target.value); updateActiveLine(); }}
                    onKeyDown={handleKeyDown}
                    onClick={updateActiveLine}
                    onKeyUp={updateActiveLine}
                    onFocus={updateActiveLine}
                    onBlur={() => setActiveLine(-1)}
                    onScroll={syncScroll}
                    className="relative w-full min-h-[300px] p-4 pl-14 font-mono text-sm leading-[1.625] bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg z-[3]"
                    style={{ color: 'transparent', caretColor: '#22c55e' }}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            {/* Compile error */}
            {compileError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <div className="flex items-center gap-2 mb-2 text-destructive font-semibold text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Erro de compilação
                </div>
                <pre className="text-xs font-mono whitespace-pre-wrap text-destructive/80">{compileError}</pre>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Summary */}
                <div className={`px-5 py-4 border-b border-border flex items-center gap-3 ${
                  allPassed ? 'bg-green-500/10' : 'bg-yellow-500/10'
                }`}>
                  {allPassed ? (
                    <>
                      <Trophy className="h-6 w-6 text-green-400" />
                      <div>
                        <div className="font-semibold text-green-400">Todos os testes passaram!</div>
                        <div className="text-xs text-muted-foreground">+{exercise.xpReward} XP</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-6 w-6 text-yellow-400" />
                      <div>
                        <div className="font-semibold text-yellow-400">{passedCount}/{totalTests} testes passaram</div>
                        <div className="text-xs text-muted-foreground">
                          {passedCount > 0 ? 'Quase lá! Verifique os testes que falharam.' : 'Revise sua lógica e tente novamente.'}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Individual results */}
                <div className="divide-y divide-border">
                  {results.map((r, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {r.passed
                          ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                          : <XCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className="font-medium text-sm">
                          Teste {i + 1}
                          {!r.visible && ' (oculto)'}
                        </span>
                      </div>
                      {r.visible ? (
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground mb-1">Entrada</div>
                            <pre className="font-mono bg-muted/50 rounded p-2 whitespace-pre-wrap">{r.input || '(vazia)'}</pre>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Esperado</div>
                            <pre className="font-mono bg-muted/50 rounded p-2 whitespace-pre-wrap">{r.expected}</pre>
                          </div>
                          <div>
                            <div className="text-muted-foreground mb-1">Sua saída</div>
                            <pre className={`font-mono rounded p-2 whitespace-pre-wrap ${
                              r.passed ? 'bg-green-400/10' : 'bg-red-400/10'
                            }`}>{r.actual || '(vazia)'}</pre>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {r.passed ? 'Passou!' : 'Falhou — teste oculto para evitar hardcoding.'}
                        </p>
                      )}
                      {r.error && !r.passed && (
                        <pre className="mt-2 text-xs font-mono text-red-400/80 whitespace-pre-wrap">{r.error}</pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
