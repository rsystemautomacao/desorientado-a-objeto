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
  imageUrl?: string;
  originalIndex?: number; // original index before shuffling
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
  onSubmitted,
}: {
  exercise: ExamExercise;
  exerciseIndex: number;
  examId: string;
  maxSubmissions: number;
  getToken: () => Promise<string>;
  onCheatAttempt: (type: 'paste' | 'copy' | 'contextmenu' | 'injection') => void;
  onSubmitted?: (idx: number) => void;
}) {
  const [code, setCode] = useState(exercise.starterCode);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [compileError, setCompileError] = useState('');
  const [submissionsUsed, setSubmissionsUsed] = useState(exercise.submissionsUsed);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [pasteWarning, setPasteWarning] = useState(false);
  const [pasteGlow, setPasteGlow] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lastKeystrokeRef = useRef<number>(Date.now());
  // Secret instructor bypass: Esc×3 quickly unlocks paste for 3 s
  const pasteUnlocked = useRef(false);
  const pasteUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const escCount = useRef(0);
  const escTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Notify parent if already submitted on mount
  useEffect(() => {
    if (exercise.submissionsUsed > 0) onSubmitted?.(exerciseIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (pasteUnlocked.current) {
      // Instructor bypass active — update keystroke time so safeSetCode won't flag it
      lastKeystrokeRef.current = Date.now();
      return;
    }
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
    // Secret instructor bypass: Esc×3 within 600 ms unlocks paste for 3 s
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      escCount.current += 1;
      if (escTimer.current) clearTimeout(escTimer.current);
      if (escCount.current >= 3) {
        escCount.current = 0;
        pasteUnlocked.current = true;
        setPasteGlow(true);
        if (pasteUnlockTimer.current) clearTimeout(pasteUnlockTimer.current);
        pasteUnlockTimer.current = setTimeout(() => {
          pasteUnlocked.current = false;
          setPasteGlow(false);
        }, 3000);
      } else {
        escTimer.current = setTimeout(() => { escCount.current = 0; }, 600);
      }
      return;
    }

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
          // Convert literal \n stored in DB to real newlines for Judge0
          const stdinReal = tc.input.replace(/\\n/g, '\n');
          const expectedReal = tc.expectedOutput.replace(/\\n/g, '\n');
          const result = await runJava(code, stdinReal);
          if (result.status?.id === 6) {
            setCompileError(result.compile_output ?? 'Erro de compilacao');
            setRunning(false);
            return;
          }
          const actual = normalizeOutput(result.stdout ?? '');
          const expected = normalizeOutput(expectedReal);
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
            originalIndex: exercise.originalIndex ?? exerciseIndex,
            code,
            passedTests: passedCount,
            totalTests: testResults.length,
            allPassed,
          }),
        });
        const data = await resp.json();
        if (resp.ok) {
          setSubmissionsUsed((prev) => prev + 1);
          onSubmitted?.(exerciseIndex);
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
            <p className="text-xs text-muted-foreground font-medium mb-1">{exercise.title}</p>
            <div className="text-base text-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exercise.description }} />
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

        <div className={`relative rounded-lg border bg-background overflow-hidden transition-colors duration-300 ${pasteGlow ? 'border-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.25)]' : 'border-border'}`}>
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

      {/* Results — only show pass/fail count, no details */}
      {results && (
        <div className="mx-3 mb-3 rounded-lg border border-border overflow-hidden">
          <div className={`px-4 py-3 flex items-center gap-3 ${allPassed ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
            {allPassed ? (
              <>
                <Trophy className="h-5 w-5 text-green-400" />
                <div>
                  <span className="font-semibold text-green-400">Todos os testes passaram!</span>
                  <span className="block text-xs text-green-400/70">{passedCount}/{totalTests} testes</span>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <span className="font-semibold text-yellow-400">{passedCount}/{totalTests} testes passaram</span>
                  <span className="block text-xs text-yellow-400/70">Revise seu codigo e tente novamente.</span>
                </div>
              </>
            )}
          </div>
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
  onSubmitted,
}: {
  exercise: ExamExercise;
  exerciseIndex: number;
  examId: string;
  maxSubmissions: number;
  getToken: () => Promise<string>;
  onSubmitted?: (idx: number) => void;
}) {
  const qType = exercise.type || 'multiple-choice';
  const options = exercise.options || (qType === 'true-false' ? ['Verdadeiro', 'Falso'] : []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionsUsed, setSubmissionsUsed] = useState(exercise.submissionsUsed);
  // Objective questions: only 1 attempt allowed
  const canSubmit = submissionsUsed < 1;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (selectedIndex === null || !canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const token = await getToken();
      const resp = await fetch(`${getApiBase()}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          examId,
          exerciseIndex,
          originalIndex: exercise.originalIndex ?? exerciseIndex,
          selectedIndex, // Server evaluates correctness
        }),
      });
      if (resp.ok) {
        setSubmitted(true);
        setSubmissionsUsed((s) => s + 1);
        onSubmitted?.(exerciseIndex);
      } else {
        const data = await resp.json().catch(() => ({ error: 'Erro ao enviar resposta' }));
        setSubmitError(data.error || 'Erro ao enviar resposta');
      }
    } catch {
      setSubmitError('Erro de conexao. Tente novamente.');
    }
    setSubmitting(false);
  };

  // If already submitted on load (submissionsUsed > 0), notify parent
  useEffect(() => {
    if (submissionsUsed > 0) onSubmitted?.(exerciseIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-muted-foreground font-medium">{exercise.title}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                qType === 'multiple-choice' ? 'bg-purple-500/20 text-purple-400' :
                qType === 'true-false' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {qType === 'multiple-choice' ? 'Alternativas' : qType === 'true-false' ? 'V/F' : 'Preencher'}
              </span>
            </div>
            <div
              className="text-base text-foreground leading-relaxed rich-content"
              dangerouslySetInnerHTML={{ __html: exercise.description }}
            />
            {exercise.imageUrl && (
              <img src={exercise.imageUrl} alt="imagem do enunciado" className="mt-3 max-h-64 rounded-lg border border-border object-contain" />
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${canSubmit ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            {submissionsUsed > 0 ? 'Respondida' : '1 chance'}
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

        {/* Fill-blank: show code with blank inline */}
        {qType === 'fill-blank' && (
          <pre className="rounded-lg bg-muted/50 border border-border p-3 font-mono text-sm whitespace-pre-wrap overflow-x-auto">{exercise.snippetBefore || ''}<span className={`inline px-2 py-0.5 mx-0.5 rounded border-2 border-dashed font-semibold ${
              selectedIndex !== null ? 'border-primary bg-primary/10 text-primary' : 'border-muted-foreground text-muted-foreground'
            }`}>{selectedIndex !== null ? options[selectedIndex] : '______'}</span>{exercise.snippetAfter || ''}</pre>
        )}

        {/* Options */}
        <div className={qType === 'true-false' ? 'flex gap-3' : 'space-y-2'}>
          {options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            let cls = 'border-border hover:border-primary/50';
            if (submitted) {
              if (isSelected) cls = 'border-primary bg-primary/10';
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
                  {submitted && isSelected && <CheckCircle2 className="h-4 w-4 text-primary ml-auto shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit status */}
        {!submitted ? (
          <div className="space-y-3">
            {submitError && (
              <span className="text-xs text-destructive">{submitError}</span>
            )}
            {!showConfirm ? (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={selectedIndex === null || !canSubmit || submitting}
                  onClick={() => setShowConfirm(true)}
                >
                  <Send className="h-4 w-4 mr-1" /> Responder
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <p className="text-sm text-yellow-400 font-semibold flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Tem certeza?
                </p>
                <p className="text-xs text-yellow-400/70 mb-3">
                  Apos enviar, voce <strong>nao podera alterar</strong> sua resposta para esta questao.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)} disabled={submitting} className="h-7 text-xs">
                    Voltar e revisar
                  </Button>
                  <Button size="sm" onClick={handleSubmit} disabled={submitting} className="h-7 text-xs">
                    {submitting ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                    {submitting ? 'Enviando...' : 'Confirmar resposta'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-5 w-5" />
              Resposta registrada
            </div>
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

// ── Anti-cheat Banner + Fullscreen Overlay ──────────────────────────
function AntiCheatBanner({
  tabSwitches, showTabWarning,
  cheatAttempts, showCheatWarning, lastCheatType,
}: {
  tabSwitches: number; showTabWarning: boolean;
  cheatAttempts: number; showCheatWarning: boolean; lastCheatType: string;
}) {
  const totalIssues = tabSwitches + cheatAttempts;
  const isSevere = totalIssues >= 3;

  return (
    <>
      {/* ── Fullscreen overlay when tab switch detected ── */}
      {showTabWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="bg-card border-2 border-yellow-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-yellow-500/20" style={{ animation: 'scaleIn 0.3s ease-out' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">⚠️ SAIDA DA PAGINA DETECTADA!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Voce saiu da aba da prova. Isso foi registrado e <strong className="text-yellow-400">sera reportado ao professor</strong>.
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
              isSevere ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
            }`}>
              <EyeOff className="h-4 w-4" />
              {tabSwitches}x saida(s) registrada(s)
            </div>
            <p className="text-xs text-muted-foreground">
              {isSevere
                ? 'ATENCAO: Multiplas saidas detectadas. A prova pode ser ZERADA pelo professor.'
                : 'Permaneca nesta aba durante toda a prova. Nao abra outras abas ou janelas.'}
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-3">Este alerta fechara automaticamente.</p>
          </div>
        </div>
      )}

      {/* ── Fullscreen overlay for cheat attempts ── */}
      {showCheatWarning && !showTabWarning && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="bg-card border-2 border-red-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-red-500/20" style={{ animation: 'scaleIn 0.3s ease-out' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">🚫 {lastCheatType.toUpperCase()}!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Esta acao foi <strong className="text-red-400">bloqueada e registrada</strong>. O professor sera notificado.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/40">
              <Lock className="h-4 w-4" />
              {cheatAttempts}x tentativa(s) de cola
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-4">Este alerta fechara automaticamente.</p>
          </div>
        </div>
      )}

      {/* ── Persistent top banner (always visible when there are issues) ── */}
      {(tabSwitches > 0 || cheatAttempts > 0) && (
        <div className={`rounded-xl border overflow-hidden mb-6 ${
          isSevere ? 'border-destructive bg-destructive/10' : 'border-yellow-500/50 bg-yellow-500/10'
        }`}>
          <div className={`px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm ${
            isSevere ? 'text-destructive' : 'text-yellow-500'
          }`}>
            {tabSwitches > 0 && (
              <span className="flex items-center gap-1.5 font-medium">
                <EyeOff className="h-4 w-4 shrink-0" />
                Saidas da aba: <strong>{tabSwitches}</strong>
              </span>
            )}
            {cheatAttempts > 0 && (
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="h-4 w-4 shrink-0" />
                Tentativas de cola: <strong>{cheatAttempts}</strong>
              </span>
            )}
            <span className="text-xs opacity-70 ml-auto">
              {isSevere ? '⚠️ Comportamento reportado ao professor.' : 'Todas as tentativas sao registradas.'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Exam Page ───────────────────────────────────────────────────
export default function Exam() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [accessCode, setAccessCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [error, setError] = useState('');
  const [finalized, setFinalized] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [gradeData, setGradeData] = useState<{ grade: number; earned?: number; totalPoints?: number; correct: number; total: number; examTitle: string } | null>(null);
  const [gradeError, setGradeError] = useState('');
  const [finalizedExamId, setFinalizedExamId] = useState('');

  // ── Tab-switch / focus-loss detection ──
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);
  const tabSwitchCountRef = useRef(0);

  // ── Cheat attempt tracking (paste, copy, context menu, injection) ──
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [lastCheatType, setLastCheatType] = useState('');

  // Track which exercises have been answered (by index)
  const [answeredSet, setAnsweredSet] = useState<Set<number>>(new Set());
  const handleExerciseSubmitted = useCallback((idx: number) => {
    setAnsweredSet((prev) => { const next = new Set(prev); next.add(idx); return next; });
  }, []);
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
    const trimmedName = studentName.trim();
    if (trimmedName.length < 5 || !trimmedName.includes(' ')) {
      setError('Digite seu nome COMPLETO (nome e sobrenome).');
      return;
    }
    setLoadingExam(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const base = getApiBase();
      const resp = await fetch(`${base}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'access', code: accessCode.trim(), studentName: trimmedName }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setExamData(data);
      } else if (data.finalized) {
        // Student already finalized this exam
        setFinalized(true);
        setFinalizedExamId(data.examId || '');
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
        setFinalizedExamId(examData.examId);
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

  // Check grade when finalized
  const checkGrade = async () => {
    if (!user || !finalizedExamId) return;
    setGradeError('');
    try {
      const token = await user.getIdToken();
      const resp = await fetch(`${getApiBase()}/api/exams`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grades', examId: finalizedExamId }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setGradeData(data);
      } else {
        setGradeError(data.error || 'Nota ainda nao disponivel.');
      }
    } catch {
      setGradeError('Erro de conexao.');
    }
  };

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

          {/* Grade display */}
          {gradeData ? (
            <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Sua nota</p>
              <div className={`text-5xl font-bold mb-2 ${
                gradeData.grade >= 7 ? 'text-green-400' : gradeData.grade >= 5 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {gradeData.grade.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">
                {gradeData.correct}/{gradeData.total} questao(oes) corretas
                {gradeData.earned !== undefined && gradeData.totalPoints !== undefined && (
                  <span className="block mt-1 text-xs">
                    {gradeData.earned.toFixed(2)} / {gradeData.totalPoints.toFixed(2)} pontos
                  </span>
                )}
              </p>
            </div>
          ) : finalizedExamId ? (
            <div className="mt-6">
              {gradeError ? (
                <p className="text-sm text-muted-foreground mb-3">{gradeError}</p>
              ) : null}
              <Button variant="outline" onClick={checkGrade}>
                Ver nota
              </Button>
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground mt-6">
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
                <label className="block text-sm font-semibold mb-1">Nome completo *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Joao da Silva Santos"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground mt-1">Digite seu nome e sobrenome como consta na chamada.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Codigo de acesso *</label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAccessCode(); }}
                  placeholder="Ex: AB12CD"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-center text-2xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                  maxLength={10}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <Button
                onClick={handleAccessCode}
                disabled={loadingExam || accessCode.trim().length < 4 || studentName.trim().length < 5}
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
                  onSubmitted={handleExerciseSubmitted}
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
                onSubmitted={handleExerciseSubmitted}
              />
            );
          })}
        </div>

        {/* Encerrar Prova */}
        <div className="mt-10 border-t border-border pt-8 pb-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Finalizar Prova</h3>
            {(() => {
              const total = examData.exercises.length;
              const answered = answeredSet.size;
              const missing = total - answered;
              return (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ao encerrar a prova, suas respostas serao enviadas e voce <strong>nao podera acessar novamente</strong>.
                  </p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${
                    missing === 0 ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'
                  }`}>
                    {missing === 0 ? (
                      <><CheckCircle className="h-4 w-4" /> Todas as {total} questoes foram respondidas</>
                    ) : (
                      <><AlertTriangle className="h-4 w-4" /> {missing} de {total} questao(oes) sem resposta</>
                    )}
                  </div>
                </>
              );
            })()}
            {!showFinalizeConfirm ? (
              <div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFinalizeConfirm(true)}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Encerrar Prova
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const missing = examData.exercises.length - answeredSet.size;
                  return missing > 0 ? (
                    <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 px-4 py-3">
                      <p className="text-yellow-400 font-semibold text-sm flex items-center justify-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Voce tem {missing} questao(oes) sem resposta!
                      </p>
                      <p className="text-xs text-yellow-400/70 mt-1">
                        Se encerrar agora, essas questoes serao consideradas como erradas (nota 0).
                        Deseja voltar para responder?
                      </p>
                    </div>
                  ) : null;
                })()}
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
                    {examData.exercises.length - answeredSet.size > 0 ? 'Voltar e responder' : 'Cancelar'}
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
