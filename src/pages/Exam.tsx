import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Play, Loader2, CheckCircle2, AlertCircle, XCircle,
  Lock, LogIn, ShieldCheck, Send, RotateCcw, Trophy,
  EyeOff, AlertTriangle, LogOut, CheckCircle,
} from 'lucide-react';

// ── Java Syntax Highlighter ──────────────────────────────────────────
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

// ── Judge0 helper ────────────────────────────────────────────────────
const JUDGE0_URL = 'https://ce.judge0.com';
const JAVA_LANGUAGE_ID = 91;

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string): string {
  try { return decodeURIComponent(escape(atob(b64))); } catch { return atob(b64); }
}

async function runJava(sourceCode: string, stdin: string) {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: toBase64(sourceCode),
      language_id: JAVA_LANGUAGE_ID,
      stdin: toBase64(stdin),
    }),
  });
  const data = await res.json();
  return {
    stdout: data.stdout ? fromBase64(data.stdout) : null,
    stderr: data.stderr ? fromBase64(data.stderr) : null,
    compile_output: data.compile_output ? fromBase64(data.compile_output) : null,
    status: data.status as { id: number } | undefined,
  };
}

function normalizeOutput(s: string): string {
  return s.split('\n').map((l) => l.trimEnd()).join('\n').trim();
}

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === 'string' && base.length > 0) return base.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

// ── Types ────────────────────────────────────────────────────────────
type QuestionType = 'code' | 'multiple-choice' | 'true-false' | 'fill-blank';

interface ExamExercise {
  type?: QuestionType; // defaults to 'code' for backward compatibility
  title: string;
  description: string;
  starterCode: string;
  testCases: { input: string; expectedOutput: string; visible: boolean }[];
  submissionsUsed: number;
  // Multiple choice / true-false / fill-blank
  options?: string[];
  correctIndex?: number;
  codeSnippet?: string;
  snippetBefore?: string;
  snippetAfter?: string;
  explanation?: string;
}

interface ExamData {
  examId: string;
  title: string;
  description: string;
  exercises: ExamExercise[];
  maxSubmissions: number;
}

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  visible: boolean;
  error?: string;
}

// ── Auto-close pairs ─────────────────────────────────────────────────
const AUTO_PAIRS: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };

// ── ExamExerciseEditor component ─────────────────────────────────────
function ExamExerciseEditor({
  exercise,
  exerciseIndex,
  examId,
  maxSubmissions,
  getToken,
  onCheatAttempt,
}: {
  exercise: ExamExercise;
  exerciseIndex: number;
  examId: string;
  maxSubmissions: number;
  getToken: () => Promise<string>;
  onCheatAttempt: (type: 'paste' | 'copy' | 'contextmenu' | 'injection') => void;
}) {
  const [code, setCode] = useState(exercise.starterCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [compileError, setCompileError] = useState('');
  const [submissionsUsed, setSubmissionsUsed] = useState(exercise.submissionsUsed);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [pasteWarning, setPasteWarning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lastKeystrokeRef = useRef<number>(Date.now());

  const canSubmit = submissionsUsed < maxSubmissions;

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

  // Block paste (Ctrl+V, right-click paste)
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 3000);
    onCheatAttempt('paste');
  }, [onCheatAttempt]);
  // Block copy (Ctrl+C) — prevent copying code to share
  const handleCopy = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 3000);
    onCheatAttempt('copy');
  }, [onCheatAttempt]);
  // Block drag-and-drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onCheatAttempt('paste');
  }, [onCheatAttempt]);
  // Block right-click context menu (prevents "Paste"/"Copy" option)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onCheatAttempt('contextmenu');
  }, [onCheatAttempt]);

  // Anti-cheat: detect large insertions via DevTools/extensions
  const safeSetCode = useCallback((newValue: string, fromKeyboard: boolean) => {
    if (!fromKeyboard) {
      const diff = Math.abs(newValue.length - code.length);
      const timeSinceLastKey = Date.now() - lastKeystrokeRef.current;
      if (diff > 20 && timeSinceLastKey > 100) {
        setPasteWarning(true);
        setTimeout(() => setPasteWarning(false), 3000);
        onCheatAttempt('injection');
        return;
      }
    }
    setCode(newValue);
  }, [code, onCheatAttempt]);

  // Track real keystrokes
  const handleKeyDownWrapper = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    lastKeystrokeRef.current = Date.now();
    handleKeyDown(e);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = ta;

    // Auto-close pairs
    if (e.key in AUTO_PAIRS) {
      const closing = AUTO_PAIRS[e.key];
      if ((e.key === '"' || e.key === "'") && start > 0 && /\w/.test(value[start - 1])) {
        // let default
      } else if ((e.key === '"' || e.key === "'") && value[start] === closing) {
        e.preventDefault();
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 1; updateActiveLine(); });
        return;
      } else {
        e.preventDefault();
        const next = value.substring(0, start) + e.key + closing + value.substring(end);
        safeSetCode(next, true);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 1; updateActiveLine(); });
        return;
      }
    }

    if ((e.key === ')' || e.key === ']') && value[start] === e.key) {
      e.preventDefault();
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 1; updateActiveLine(); });
      return;
    }

    if (e.key === 'Backspace' && start === end && start > 0) {
      const before = value[start - 1];
      const after = value[start];
      if (before in AUTO_PAIRS && AUTO_PAIRS[before] === after) {
        e.preventDefault();
        const next = value.substring(0, start - 1) + value.substring(start + 1);
        safeSetCode(next, true);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start - 1; updateActiveLine(); });
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const linePrefix = value.substring(lineStart, start);
        const spacesToRemove = Math.min(4, linePrefix.length - linePrefix.trimStart().length, start - lineStart);
        if (spacesToRemove > 0) {
          const next = value.substring(0, lineStart) + value.substring(lineStart + spacesToRemove);
          safeSetCode(next, true);
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start - spacesToRemove; updateActiveLine(); });
        }
      } else {
        const next = value.substring(0, start) + '    ' + value.substring(end);
        safeSetCode(next, true);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 4; updateActiveLine(); });
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

      if (trimmed.endsWith('{') && value[start] === '}') {
        const full = '\n' + indent + extra + '\n' + indent;
        const next = value.substring(0, start) + full + value.substring(start);
        safeSetCode(next, true);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + insertion.length; updateActiveLine(); });
        return;
      }

      const next = value.substring(0, start) + insertion + value.substring(end);
      safeSetCode(next, true);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + insertion.length; updateActiveLine(); });
      return;
    }

    if (e.key === '}') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const beforeCursor = value.substring(lineStart, start);
      if (/^\s{4,}$/.test(beforeCursor)) {
        e.preventDefault();
        if (value[start] === '}') {
          const dedented = value.substring(0, lineStart) + beforeCursor.substring(4) + value.substring(start);
          const newPos = start - 4;
          safeSetCode(dedented, true);
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = newPos; updateActiveLine(); });
        } else {
          const dedented = value.substring(0, lineStart) + beforeCursor.substring(4) + '}' + value.substring(end);
          const newPos = start - 4 + 1;
          safeSetCode(dedented, true);
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = newPos; updateActiveLine(); });
        }
        return;
      }
    }
  }, [safeSetCode, updateActiveLine]);

  const handleSubmit = async () => {
    if (running || !canSubmit) return;
    setRunning(true);
    setResults(null);
    setCompileError('');
    setSubmitStatus(null);

    const testResults: TestResult[] = [];

    try {
      for (const tc of exercise.testCases) {
        try {
          const result = await runJava(code, tc.input);
          if (result.status?.id === 6) {
            setCompileError(result.compile_output ?? 'Erro de compilacao');
            setRunning(false);
            return;
          }
          const actual = normalizeOutput(result.stdout ?? '');
          const expected = normalizeOutput(tc.expectedOutput);
          const passed = tc.visible ? actual === expected : (result.status?.id === 3);
          testResults.push({
            input: tc.input,
            expected: tc.expectedOutput,
            actual: result.stdout?.trim() ?? '',
            passed,
            visible: tc.visible,
            error: result.stderr?.trim() || undefined,
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

      // Submit to server
      const passedCount = testResults.filter((r) => r.passed).length;
      const allPassed = passedCount === testResults.length;

      try {
        const token = await getToken();
        const base = getApiBase();
        const resp = await fetch(`${base}/api/exams`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit',
            examId,
            exerciseIndex,
            code,
            passedTests: passedCount,
            totalTests: testResults.length,
            allPassed,
          }),
        });
        const data = await resp.json();
        if (resp.ok) {
          setSubmissionsUsed((prev) => prev + 1);
          setSubmitStatus(`Submissao ${data.attemptNumber} registrada! ${data.submissionsRemaining > 0 ? `Restam ${data.submissionsRemaining} tentativa(s).` : 'Nenhuma tentativa restante.'}`);
        } else {
          setSubmitStatus(data.error || 'Erro ao registrar submissao');
        }
      } catch {
        setSubmitStatus('Erro de conexao ao registrar submissao');
      }
    } catch {
      setCompileError('Erro de conexao. Verifique sua internet.');
    }

    setRunning(false);
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setResults(null);
    setCompileError('');
    setSubmitStatus(null);
  };

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const totalTests = results?.length ?? 0;
  const allPassed = results ? passedCount === totalTests : false;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-semibold text-lg">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${canSubmit ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              {submissionsUsed}/{maxSubmissions} submissoes
            </span>
          </div>
        </div>
        {/* Visible test cases */}
        {exercise.testCases.some((tc) => tc.visible) && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Casos de teste visiveis:</p>
            {exercise.testCases.filter((tc) => tc.visible).map((tc, i) => (
              <div key={i} className="text-xs font-mono bg-muted/50 rounded px-2 py-1 flex gap-4">
                <span><strong>Entrada:</strong> {tc.input || '(vazio)'}</span>
                <span><strong>Esperado:</strong> {tc.expectedOutput}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 gap-2">
          <span className="text-sm font-semibold text-primary">Seu codigo</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Resetar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={running || !canSubmit}
              title={canSubmit ? 'Executar e submeter' : 'Limite de submissoes atingido'}
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span className="ml-1.5">{running ? 'Avaliando...' : 'Submeter'}</span>
            </Button>
          </div>
        </div>

        <div className="relative rounded-lg border border-border bg-background overflow-hidden">
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
            className="absolute inset-0 p-4 pl-14 font-mono text-sm leading-[1.625] whitespace-pre-wrap overflow-hidden pointer-events-none z-[2]"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlightJava(code) + '\n' }}
          />
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => { safeSetCode(e.target.value, false); updateActiveLine(); }}
            onKeyDown={handleKeyDownWrapper}
            onPaste={handlePaste}
            onCopy={handleCopy}
            onCut={handleCopy}
            onDrop={handleDrop}
            onContextMenu={handleContextMenu}
            onClick={updateActiveLine}
            onKeyUp={updateActiveLine}
            onFocus={updateActiveLine}
            onBlur={() => setActiveLine(-1)}
            onScroll={syncScroll}
            className="relative w-full min-h-[250px] p-4 pl-14 font-mono text-sm leading-[1.625] bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg z-[3]"
            style={{ color: 'transparent', caretColor: '#22c55e' }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Paste/copy/injection warning */}
      {pasteWarning && (
        <div className="mx-3 mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive flex items-center gap-2 animate-pulse">
          <Lock className="h-4 w-4" />
          Copiar, colar ou injetar codigo nao e permitido. Essa tentativa foi registrada.
        </div>
      )}

      {/* Compile error */}
      {compileError && (
        <div className="mx-3 mb-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <div className="flex items-center gap-2 mb-1 text-destructive font-semibold text-sm">
            <AlertCircle className="h-4 w-4" /> Erro de compilacao
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap text-destructive/80">{compileError}</pre>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mx-3 mb-3 rounded-lg border border-border overflow-hidden">
          <div className={`px-4 py-3 border-b border-border flex items-center gap-3 ${allPassed ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
            {allPassed ? (
              <>
                <Trophy className="h-5 w-5 text-green-400" />
                <span className="font-semibold text-green-400">Todos os testes passaram!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">{passedCount}/{totalTests} testes passaram</span>
              </>
            )}
          </div>
          {results.map((r, i) => (
            <div key={i} className="px-4 py-2 border-b border-border last:border-0 text-xs">
              <div className="flex items-center gap-2">
                {r.passed ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                <span className="font-semibold">Teste {i + 1}</span>
                {!r.visible && <span className="text-muted-foreground">(oculto)</span>}
              </div>
              {r.visible && (
                <div className="mt-1 space-y-0.5 font-mono text-muted-foreground">
                  <div>Entrada: {r.input || '(vazio)'}</div>
                  <div>Esperado: {r.expected}</div>
                  <div>Obtido: {r.actual || '(vazio)'}</div>
                </div>
              )}
              {r.error && <div className="mt-1 text-destructive">{r.error}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Submit status */}
      {submitStatus && (
        <div className="mx-3 mb-3 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-sm text-primary flex items-center gap-2">
          <Send className="h-4 w-4" />
          {submitStatus}
        </div>
      )}

      {/* Limit reached */}
      {!canSubmit && (
        <div className="mx-3 mb-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Limite de submissoes atingido para este exercicio.
        </div>
      )}
    </div>
  );
}

// ── Objective Question Editor (multiple-choice, true-false, fill-blank) ──
function ExamObjectiveQuestion({
  exercise,
  exerciseIndex,
  examId,
  maxSubmissions,
  getToken,
}: {
  exercise: ExamExercise;
  exerciseIndex: number;
  examId: string;
  maxSubmissions: number;
  getToken: () => Promise<string>;
}) {
  const qType = exercise.type || 'multiple-choice';
  const options = exercise.options || (qType === 'true-false' ? ['Verdadeiro', 'Falso'] : []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionsUsed, setSubmissionsUsed] = useState(exercise.submissionsUsed);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const canSubmit = submissionsUsed < maxSubmissions;
  const correct = submitted && selectedIndex === exercise.correctIndex;

  const handleSubmit = async () => {
    if (selectedIndex === null || !canSubmit) return;
    setSubmitted(true);
    const isCorrect = selectedIndex === exercise.correctIndex;
    try {
      const token = await getToken();
      await fetch(`${getApiBase()}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          examId,
          exerciseIndex,
          code: `[Resposta objetiva] Opcao selecionada: ${selectedIndex} (${options[selectedIndex] || '?'})`,
          passedTests: isCorrect ? 1 : 0,
          totalTests: 1,
          allPassed: isCorrect,
        }),
      });
      setSubmissionsUsed((s) => s + 1);
      setSubmitStatus(isCorrect ? 'Correto!' : 'Incorreto');
    } catch {
      setSubmitStatus('Erro ao enviar resposta');
    }
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setSubmitStatus(null);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{exercise.title}</h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                qType === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
                qType === 'true-false' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {qType === 'multiple-choice' ? 'Alternativas' : qType === 'true-false' ? 'V/F' : 'Preencher'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${canSubmit ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            {submissionsUsed}/{maxSubmissions} submissoes
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Code snippet (if provided) */}
        {qType !== 'fill-blank' && exercise.codeSnippet && (
          <pre className="p-3 rounded-lg bg-muted/50 border border-border font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {exercise.codeSnippet}
          </pre>
        )}

        {/* Fill-blank: show code with blank */}
        {qType === 'fill-blank' && (
          <div className="rounded-lg bg-muted/50 border border-border p-3 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{exercise.snippetBefore || ''}</pre>
            <span className={`inline-block px-3 py-1 mx-1 rounded border-2 border-dashed font-semibold ${
              submitted
                ? correct ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-destructive bg-destructive/10 text-destructive'
                : selectedIndex !== null ? 'border-primary bg-primary/10 text-primary' : 'border-muted-foreground text-muted-foreground'
            }`}>
              {selectedIndex !== null ? options[selectedIndex] : '______'}
            </span>
            <pre className="whitespace-pre-wrap">{exercise.snippetAfter || ''}</pre>
          </div>
        )}

        {/* Options */}
        <div className={qType === 'true-false' ? 'flex gap-3' : 'space-y-2'}>
          {options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            const isCorrectOpt = i === exercise.correctIndex;
            let cls = 'border-border hover:border-primary/50';
            if (submitted) {
              if (isCorrectOpt) cls = 'border-green-500 bg-green-500/10';
              else if (isSelected) cls = 'border-destructive bg-destructive/10';
              else cls = 'border-border opacity-50';
            } else if (isSelected) {
              cls = 'border-primary bg-primary/10';
            }

            return (
              <button
                key={i}
                type="button"
                disabled={submitted || !canSubmit}
                onClick={() => setSelectedIndex(i)}
                className={`${qType === 'true-false' ? 'flex-1' : 'w-full'} text-left px-4 py-3 rounded-lg border-2 transition-colors ${cls}`}
              >
                <div className="flex items-center gap-3">
                  {qType !== 'true-false' && (
                    <span className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  <span className={`text-sm ${qType === 'fill-blank' ? 'font-mono' : ''}`}>{opt}</span>
                  {submitted && isCorrectOpt && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto shrink-0" />}
                  {submitted && isSelected && !isCorrectOpt && <XCircle className="h-4 w-4 text-destructive ml-auto shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit / Retry */}
        {!submitted ? (
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={selectedIndex === null || !canSubmit}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4 mr-1" /> Responder
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 text-sm font-semibold ${correct ? 'text-green-400' : 'text-destructive'}`}>
              {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {submitStatus}
              {exercise.explanation && (
                <span className="font-normal text-muted-foreground ml-2">— {exercise.explanation}</span>
              )}
            </div>
            {canSubmit && (
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Tentar novamente
              </Button>
            )}
          </div>
        )}
      </div>

      {!canSubmit && (
        <div className="mx-5 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2 text-sm text-destructive flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Limite de submissoes atingido.
        </div>
      )}
    </div>
  );
}

// ── Anti-cheat Banner ────────────────────────────────────────────────
function AntiCheatBanner({
  tabSwitches, showTabWarning,
  cheatAttempts, showCheatWarning, lastCheatType,
}: {
  tabSwitches: number; showTabWarning: boolean;
  cheatAttempts: number; showCheatWarning: boolean; lastCheatType: string;
}) {
  if (tabSwitches === 0 && cheatAttempts === 0 && !showTabWarning && !showCheatWarning) return null;

  const totalIssues = tabSwitches + cheatAttempts;
  const isSevere = totalIssues >= 3;

  return (
    <div className={`rounded-xl border overflow-hidden mb-6 transition-all ${
      isSevere ? 'border-destructive bg-destructive/10' : 'border-yellow-500/50 bg-yellow-500/10'
    }`}>
      {/* Persistent counters */}
      {(tabSwitches > 0 || cheatAttempts > 0) && (
        <div className={`px-4 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${
          isSevere ? 'text-destructive' : 'text-yellow-500'
        }`}>
          {tabSwitches > 0 && (
            <span className="flex items-center gap-1.5">
              <EyeOff className="h-4 w-4 shrink-0" />
              Saidas da aba: <strong>{tabSwitches}</strong>
            </span>
          )}
          {cheatAttempts > 0 && (
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 shrink-0" />
              Tentativas de cola: <strong>{cheatAttempts}</strong>
            </span>
          )}
          <span className="text-xs opacity-70">
            {isSevere ? 'Comportamento reportado ao professor.' : 'Todas as tentativas sao registradas.'}
          </span>
        </div>
      )}

      {/* Flash warning: tab switch */}
      {showTabWarning && (
        <div className="px-4 py-3 border-t border-yellow-500/30 bg-yellow-500/20 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0" />
          <div>
            <div className="font-semibold text-yellow-300 text-sm">Saida da pagina detectada!</div>
            <div className="text-xs text-yellow-400/80">Permaneca nesta aba durante toda a prova.</div>
          </div>
        </div>
      )}

      {/* Flash warning: cheat attempt */}
      {showCheatWarning && !showTabWarning && (
        <div className="px-4 py-3 border-t border-red-500/30 bg-red-500/20 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
          <div>
            <div className="font-semibold text-red-300 text-sm">{lastCheatType}!</div>
            <div className="text-xs text-red-400/80">Esta acao foi registrada e sera reportada ao professor.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Exam Page ───────────────────────────────────────────────────
export default function Exam() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [error, setError] = useState('');
  const [finalized, setFinalized] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  // ── Tab-switch / focus-loss detection ──
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const tabSwitchCountRef = useRef(0);

  // ── Cheat attempt tracking (paste, copy, context menu, injection) ──
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [lastCheatType, setLastCheatType] = useState('');
  const cheatAttemptsRef = useRef(0);

  const CHEAT_LABELS: Record<string, string> = {
    paste: 'Tentativa de colar',
    copy: 'Tentativa de copiar',
    contextmenu: 'Menu de contexto (botao direito)',
    injection: 'Injecao de codigo detectada',
  };

  const handleCheatAttempt = useCallback((type: 'paste' | 'copy' | 'contextmenu' | 'injection') => {
    cheatAttemptsRef.current += 1;
    setCheatAttempts(cheatAttemptsRef.current);
    setLastCheatType(CHEAT_LABELS[type] || type);
    setShowCheatWarning(true);
    setTimeout(() => setShowCheatWarning(false), 4000);

    // Report to server
    if (user && examData) {
      user.getIdToken().then((token) => {
        fetch(`${getApiBase()}/api/exams`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cheat-attempt',
            examId: examData.examId,
            type,
            count: cheatAttemptsRef.current,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [user, examData]);

  useEffect(() => {
    if (!examData || !user) return; // only track when exam is active

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the tab
        tabSwitchCountRef.current += 1;
        setTabSwitchCount(tabSwitchCountRef.current);

        // Fire-and-forget: report to server
        user.getIdToken().then((token) => {
          fetch(`${getApiBase()}/api/exams`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'tab-switch',
              examId: examData.examId,
              count: tabSwitchCountRef.current,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        }).catch(() => {});
      } else {
        // User came back — show warning flash
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 4000);
      }
    };

    const handleBlur = () => {
      // Also detect window blur (clicking outside browser)
      // Use a small delay to avoid false positives from alerts/modals
      setTimeout(() => {
        if (document.hidden) return; // already handled by visibilitychange
        tabSwitchCountRef.current += 1;
        setTabSwitchCount(tabSwitchCountRef.current);
        setShowTabWarning(true);
        setTimeout(() => setShowTabWarning(false), 4000);

        user.getIdToken().then((token) => {
          fetch(`${getApiBase()}/api/exams`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'tab-switch',
              examId: examData.examId,
              count: tabSwitchCountRef.current,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {});
        }).catch(() => {});
      }, 200);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [examData, user]);

  const handleAccessCode = async () => {
    if (!user || !accessCode.trim()) return;
    setLoadingExam(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const base = getApiBase();
      const resp = await fetch(`${base}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'access', code: accessCode.trim() }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setExamData(data);
      } else if (data.finalized) {
        // Student already finalized this exam
        setFinalized(true);
        setError('');
      } else {
        setError(data.error || 'Codigo invalido');
      }
    } catch {
      setError('Erro de conexao. Tente novamente.');
    }

    setLoadingExam(false);
  };

  const handleFinalize = async () => {
    if (!user || !examData || finalizing) return;
    setFinalizing(true);
    try {
      const token = await user.getIdToken();
      const base = getApiBase();
      const resp = await fetch(`${base}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finalize', examId: examData.examId }),
      });
      if (resp.ok) {
        setFinalized(true);
        setExamData(null);
        setShowFinalizeConfirm(false);
      }
    } catch { /* ignore */ }
    setFinalizing(false);
  };

  const getToken = useCallback(async () => {
    if (!user) throw new Error('Not authenticated');
    return user.getIdToken();
  }, [user]);

  // Not logged in
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container max-w-lg py-16 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Prova Online</h1>
          <p className="text-muted-foreground mb-6">
            Voce precisa estar logado com sua conta Google para acessar a prova.
          </p>
          <Button onClick={signInWithGoogle} size="lg">
            <LogIn className="h-5 w-5 mr-2" /> Entrar com Google
          </Button>
        </div>
      </Layout>
    );
  }

  // Exam already finalized
  if (finalized) {
    return (
      <Layout>
        <div className="container max-w-lg py-16 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Prova Encerrada</h1>
          <p className="text-muted-foreground mb-6">
            Sua prova foi encerrada com sucesso. Suas respostas foram registradas e enviadas ao professor.
          </p>
          <p className="text-sm text-muted-foreground">
            Nao e possivel acessar esta prova novamente.
          </p>
        </div>
      </Layout>
    );
  }

  // Logged in but no exam loaded — show access code form
  if (!examData) {
    return (
      <Layout>
        <div className="container max-w-lg py-16">
          <div className="text-center mb-8">
            <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Prova Online</h1>
            <p className="text-muted-foreground">
              Digite o codigo de acesso fornecido pelo professor.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Logado como: <strong>{user.email}</strong>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Codigo de acesso</label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAccessCode(); }}
                  placeholder="Ex: AB12CD"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-center text-2xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={10}
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <Button
                onClick={handleAccessCode}
                disabled={loadingExam || accessCode.trim().length < 4}
                className="w-full"
                size="lg"
              >
                {loadingExam ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                Acessar Prova
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Exam loaded — show exercises
  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Anti-cheat warning banner */}
        <AntiCheatBanner
          tabSwitches={tabSwitchCount} showTabWarning={showTabWarning}
          cheatAttempts={cheatAttempts} showCheatWarning={showCheatWarning} lastCheatType={lastCheatType}
        />

        {/* Exam header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Prova Online &bull; {user.email}
          </div>
          <h1 className="text-3xl font-bold mb-1">{examData.title}</h1>
          {examData.description && (
            <p className="text-muted-foreground">{examData.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Max {examData.maxSubmissions} submissao(oes) por exercicio &bull; {examData.exercises.length} exercicio(s)</span>
            <span className="flex items-center gap-1 text-yellow-500/70">
              <EyeOff className="h-3 w-3" />
              Saidas da aba sao monitoradas
            </span>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {examData.exercises.map((ex, idx) => {
            const qType = ex.type || 'code';
            if (qType === 'code') {
              return (
                <ExamExerciseEditor
                  key={idx}
                  exercise={ex}
                  exerciseIndex={idx}
                  examId={examData.examId}
                  maxSubmissions={examData.maxSubmissions}
                  getToken={getToken}
                  onCheatAttempt={handleCheatAttempt}
                />
              );
            }
            return (
              <ExamObjectiveQuestion
                key={idx}
                exercise={ex}
                exerciseIndex={idx}
                examId={examData.examId}
                maxSubmissions={examData.maxSubmissions}
                getToken={getToken}
              />
            );
          })}
        </div>

        {/* Encerrar Prova */}
        <div className="mt-10 border-t border-border pt-8 pb-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Finalizar Prova</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ao encerrar a prova, suas respostas serao enviadas e voce <strong>nao podera acessar novamente</strong>.
              Certifique-se de ter respondido todos os exercicios antes de encerrar.
            </p>
            {!showFinalizeConfirm ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFinalizeConfirm(true)}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Encerrar Prova
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3">
                  <p className="text-destructive font-semibold text-sm flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Tem certeza? Esta acao e irreversivel!
                  </p>
                  <p className="text-xs text-destructive/70 mt-1">
                    Voce nao podera voltar a esta prova depois de encerrar.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFinalizeConfirm(false)}
                    disabled={finalizing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleFinalize}
                    disabled={finalizing}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    {finalizing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    {finalizing ? 'Encerrando...' : 'Confirmar Encerramento'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
