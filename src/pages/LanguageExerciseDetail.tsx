import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPythonExerciseById } from '@/data/exercises-python';
import { getCExerciseById } from '@/data/exercises-c';
import { useProgress } from '@/hooks/useProgress';
import {
  Play, Loader2, CheckCircle2, AlertCircle, XCircle,
  ChevronLeft, Lightbulb, RotateCcw, Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DIFF_LABELS } from '@/constants/difficulty';

// ── Judge0 ──
const JUDGE0_URL = 'https://ce.judge0.com';

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
function fromBase64(b64: string): string {
  try { return decodeURIComponent(escape(atob(b64))); } catch { return atob(b64); }
}

async function runCode(languageId: number, sourceCode: string, stdin = '') {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: toBase64(sourceCode),
      language_id: languageId,
      stdin: toBase64(stdin),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  const data = await res.json();
  if (data.stdout) data.stdout = fromBase64(data.stdout);
  if (data.stderr) data.stderr = fromBase64(data.stderr);
  if (data.compile_output) data.compile_output = fromBase64(data.compile_output);
  return data;
}

// ── Simple syntax highlighter (Python + C keywords) ──
const PYTHON_KW = new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield','print','input','int','float','str','len','range','list','dict','set','tuple','type','bool']);
const C_KW = new Set(['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','inline','int','long','register','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while','include','define','printf','scanf','NULL','main']);

function escHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlightCode(code: string, lang: 'python' | 'c'): string {
  const kw = lang === 'python' ? PYTHON_KW : C_KW;
  const commentChar = lang === 'python' ? '#' : '//';
  const tokens: string[] = [];
  let i = 0;

  while (i < code.length) {
    // Block comment (C only)
    if (lang === 'c' && code[i] === '/' && code[i+1] === '*') {
      const end = code.indexOf('*/', i+2);
      const slice = end >= 0 ? code.slice(i, end+2) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escHtml(slice)}</span>`);
      i += slice.length; continue;
    }
    // Line comment
    if ((lang === 'c' && code[i] === '/' && code[i+1] === '/') ||
        (lang === 'python' && code[i] === '#')) {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escHtml(slice)}</span>`);
      i += slice.length; continue;
    }
    // Preprocessor (C)
    if (lang === 'c' && code[i] === '#') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#7c3aed">${escHtml(slice)}</span>`);
      i += slice.length; continue;
    }
    // String
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i+1;
      while (j < code.length && code[j] !== q) { if (code[j]==='\\') j++; j++; }
      tokens.push(`<span style="color:#b45309">${escHtml(code.slice(i,j+1))}</span>`);
      i = j+1; continue;
    }
    // Number
    if (/\d/.test(code[i])) {
      let j = i+1;
      while (j < code.length && /[\d.xXa-fA-FLlFfDd_]/.test(code[j])) j++;
      tokens.push(`<span style="color:#0d9488">${escHtml(code.slice(i,j))}</span>`);
      i = j; continue;
    }
    // Identifier / keyword
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i+1;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i,j);
      if (kw.has(word)) {
        tokens.push(`<span style="color:#7c3aed;font-weight:600">${escHtml(word)}</span>`);
      } else {
        tokens.push(escHtml(word));
      }
      i = j; continue;
    }
    tokens.push(escHtml(code[i])); i++;
  }
  return tokens.join('');
}

// ── Helpers ──
function normalizeOutput(s: string): string {
  return s.split('\n').map((l) => l.trimEnd()).join('\n').trim();
}

function getDraftKey(id: string) { return `desorientado-lang-draft-${id}`; }
function loadDraft(id: string, starter: string): string {
  try { const s = localStorage.getItem(getDraftKey(id)); if (s && s !== starter) return s; } catch { /**/ }
  return starter;
}
function saveDraft(id: string, code: string) { try { localStorage.setItem(getDraftKey(id), code); } catch { /**/ } }
function clearDraft(id: string) { try { localStorage.removeItem(getDraftKey(id)); } catch { /**/ } }

interface TestResult { input: string; expected: string; actual: string; passed: boolean; visible: boolean; error?: string; }

export default function LanguageExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang, label, judge0Id, routePrefix, color } = useLanguage();
  const { completeExercise, getExerciseData } = useProgress();

  const exercise = useMemo(() => {
    if (!id) return undefined;
    return lang === 'python' ? getPythonExerciseById(id) : getCExerciseById(id);
  }, [id, lang]);

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const submitRef = useRef<() => void>();
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

  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const updateActiveLine = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    setActiveLine(ta.value.substring(0, ta.selectionStart).split('\n').length);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => { e.preventDefault(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const handleContextMenu = useCallback((e: React.MouseEvent) => { e.preventDefault(); }, []);

  const AUTO_PAIRS: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submitRef.current?.(); return; }
    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = ta;

    if (e.key in AUTO_PAIRS) {
      const closing = AUTO_PAIRS[e.key];
      if ((e.key === '"' || e.key === "'") && start > 0 && /\w/.test(value[start-1])) { /* skip */ }
      else if ((e.key === '"' || e.key === "'") && value[start] === closing) {
        e.preventDefault();
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start+1; updateActiveLine(); });
        return;
      } else {
        e.preventDefault();
        const next = value.substring(0,start) + e.key + closing + value.substring(end);
        setCode(next);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start+1; updateActiveLine(); });
        return;
      }
    }
    if ((e.key === ')' || e.key === ']') && value[start] === e.key) {
      e.preventDefault();
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start+1; updateActiveLine(); });
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const ls = value.lastIndexOf('\n', start-1)+1;
        const lp = value.substring(ls, start);
        const rm = Math.min(4, lp.length - lp.trimStart().length, start-ls);
        if (rm > 0) { setCode(value.substring(0,ls)+value.substring(ls+rm)); requestAnimationFrame(() => { ta.selectionStart=ta.selectionEnd=start-rm; updateActiveLine(); }); }
      } else {
        setCode(value.substring(0,start)+'    '+value.substring(end));
        requestAnimationFrame(() => { ta.selectionStart=ta.selectionEnd=start+4; updateActiveLine(); });
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const ls = value.lastIndexOf('\n', start-1)+1;
      const indent = value.substring(ls, start).match(/^(\s*)/)?.[1] ?? '';
      const trimmed = value.substring(0,start).trimEnd();
      const extra = trimmed.endsWith('{') || (lang === 'python' && trimmed.endsWith(':')) ? '    ' : '';
      const insertion = '\n' + indent + extra;
      if (trimmed.endsWith('{') && value[start] === '}') {
        const full = '\n'+indent+extra+'\n'+indent;
        setCode(value.substring(0,start)+full+value.substring(start));
        requestAnimationFrame(() => { ta.selectionStart=ta.selectionEnd=start+insertion.length; updateActiveLine(); });
        return;
      }
      setCode(value.substring(0,start)+insertion+value.substring(end));
      requestAnimationFrame(() => { ta.selectionStart=ta.selectionEnd=start+insertion.length; updateActiveLine(); });
    }
  }, [setCode, updateActiveLine, lang]);

  if (!exercise) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Exercício não encontrado</h1>
          <Link to={`${routePrefix}/exercicios`} className="text-primary hover:underline">Voltar para exercícios</Link>
        </div>
      </Layout>
    );
  }

  const diff = DIFF_LABELS[exercise.difficulty];

  const handleSubmit = async () => {
    if (running) return;
    setRunning(true); setResults(null); setCompileError('');
    const testResults: TestResult[] = [];
    try {
      for (const tc of exercise.testCases) {
        try {
          const result = await runCode(judge0Id, code, tc.input);
          if (result.status?.id === 6) { setCompileError(result.compile_output ?? 'Erro de compilação'); setRunning(false); return; }
          const actual = normalizeOutput(result.stdout ?? '');
          const expected = normalizeOutput(tc.expectedOutput);
          testResults.push({ input: tc.input, expected: tc.expectedOutput, actual: result.stdout?.trim() ?? '', passed: actual === expected, visible: tc.visible, error: result.stderr?.trim() || undefined });
        } catch {
          testResults.push({ input: tc.input, expected: tc.expectedOutput, actual: '', passed: false, visible: tc.visible, error: 'Erro na API. Tente novamente.' });
        }
      }
      setResults(testResults);
      const passedCount = testResults.filter((r) => r.passed).length;
      if (passedCount === testResults.length) {
        clearDraft(exercise.id); setHasDraft(false);
        completeExercise(exercise.id, exercise.xpReward);
      }
    } catch {
      setCompileError('Erro de conexão. Verifique sua internet e tente novamente.');
    }
    setRunning(false);
  };

  submitRef.current = handleSubmit;

  const handleReset = () => { setCode(exercise.starterCode); clearDraft(exercise.id); setHasDraft(false); setResults(null); setCompileError(''); setHintsShown(0); };

  const passedCount = results?.filter((r) => r.passed).length ?? 0;
  const allPassed = results != null && passedCount === exercise.testCases.length;
  const alreadySolved = useMemo(() => getExerciseData()[exercise.id]?.passed === true, [exercise.id, getExerciseData]);

  return (
    <Layout>
      <div className="container py-8 max-w-5xl animate-fade-in">
        <Link to={`${routePrefix}/exercicios`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="h-4 w-4" />
          Voltar para exercícios de {label}
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${diff.color}`}>{diff.label}</span>
            <span className="text-xs text-muted-foreground">{exercise.xpReward} XP</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color} bg-current/10`}>{label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{exercise.topicLabel}</p>
        </div>

        {alreadySolved && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>Você já resolveu este exercício corretamente. Pode refazer quando quiser!</span>
          </div>
        )}

        <div className="grid gap-6">
          {/* Enunciado */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-3">Enunciado</h2>
              <div className="text-sm text-muted-foreground rich-content" dangerouslySetInnerHTML={{ __html: exercise.description }} />
            </div>

            {/* Exemplos */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold mb-3">Exemplos</h2>
              <div className="space-y-3">
                {exercise.testCases.filter((tc) => tc.visible).map((tc, i) => (
                  <div key={i} className="text-sm rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="p-3"><div className="text-xs text-muted-foreground mb-1 font-medium">Entrada</div><pre className="font-mono text-xs whitespace-pre-wrap">{tc.input || '(vazia)'}</pre></div>
                      <div className="p-3"><div className="text-xs text-muted-foreground mb-1 font-medium">Saída esperada</div><pre className="font-mono text-xs whitespace-pre-wrap">{tc.expectedOutput}</pre></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dicas */}
            {exercise.hints && exercise.hints.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-400" />Dicas</h2>
                  {hintsShown < exercise.hints.length && (
                    <Button variant="outline" size="sm" onClick={() => setHintsShown((h) => h+1)}>Revelar dica {hintsShown+1}/{exercise.hints.length}</Button>
                  )}
                </div>
                {hintsShown > 0 ? (
                  <div className="space-y-2">
                    {exercise.hints.slice(0, hintsShown).map((hint, i) => (
                      <div key={i} className="text-sm p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20 text-yellow-200/80">
                        <span className="font-medium text-yellow-400">Dica {i+1}:</span>{' '}
                        <code className="text-xs bg-background/50 px-1 py-0.5 rounded">{hint}</code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Tente resolver sozinho primeiro!</p>
                )}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/20 bg-primary/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary text-sm">Seu código</span>
                  {hasDraft && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">rascunho salvo</span>}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleReset}><RotateCcw className="h-3.5 w-3.5 mr-1" />Resetar</Button>
                  <Button type="button" size="sm" onClick={handleSubmit} disabled={running} title="Ctrl+Enter">
                    {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    <span className="ml-1.5">{running ? 'Avaliando...' : 'Submeter'}</span>
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <div className="relative rounded-lg border border-border bg-background overflow-hidden">
                  {activeLine > 0 && (
                    <div className="absolute left-0 right-0 pointer-events-none z-[1]" style={{ top:`calc(1rem + ${(activeLine-1)*1.625}em)`, height:'1.625em', background:'hsl(var(--primary) / 0.08)', borderLeft:'2px solid hsl(var(--primary) / 0.5)' }} />
                  )}
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 border-r border-border overflow-hidden pointer-events-none z-10">
                    <pre className="p-4 pr-2 text-right font-mono text-xs leading-[1.625] text-muted-foreground select-none">
                      {code.split('\n').map((_, i) => <span key={i} className={i+1===activeLine?'text-primary font-semibold':''}>{i+1}{'\n'}</span>)}
                    </pre>
                  </div>
                  <pre ref={preRef} className="absolute inset-0 p-4 pl-14 font-mono text-sm leading-[1.625] whitespace-pre-wrap overflow-hidden pointer-events-none z-[2]" aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: highlightCode(code, lang as 'python'|'c') + '\n' }} />
                  <textarea ref={textareaRef} value={code}
                    onChange={(e) => { setCode(e.target.value); updateActiveLine(); }}
                    onKeyDown={handleKeyDown} onPaste={handlePaste} onDrop={handleDrop} onContextMenu={handleContextMenu}
                    onClick={updateActiveLine} onKeyUp={updateActiveLine} onFocus={updateActiveLine}
                    onBlur={() => setActiveLine(-1)} onScroll={syncScroll}
                    className="relative w-full min-h-[300px] p-4 pl-14 font-mono text-sm leading-[1.625] bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg z-[3]"
                    style={{ color:'transparent', caretColor:'#22c55e' }} spellCheck={false} />
                </div>
              </div>
            </div>

            {compileError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <div className="flex items-center gap-2 mb-2 text-destructive font-semibold text-sm"><AlertCircle className="h-4 w-4" />Erro de compilação</div>
                <pre className="text-xs font-mono whitespace-pre-wrap text-destructive/80">{compileError}</pre>
              </div>
            )}

            {results && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className={`px-5 py-4 border-b border-border flex items-center gap-3 ${allPassed?'bg-green-500/10':'bg-yellow-500/10'}`}>
                  {allPassed ? (
                    <><Trophy className="h-6 w-6 text-green-400" /><div><div className="font-semibold text-green-400">Todos os testes passaram!</div><div className="text-xs text-muted-foreground">+{exercise.xpReward} XP</div></div></>
                  ) : (
                    <><AlertCircle className="h-6 w-6 text-yellow-400" /><div className="font-semibold text-yellow-400">{passedCount}/{exercise.testCases.length} testes passaram</div></>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {results.map((r, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {r.passed ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> : <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                        <span className="text-sm font-medium">{r.visible ? `Teste ${i+1}` : `Teste oculto ${i+1}`}</span>
                      </div>
                      {r.visible && (
                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          <div><div className="text-muted-foreground mb-1">Entrada</div><pre className="bg-muted p-2 rounded whitespace-pre-wrap">{r.input || '(vazia)'}</pre></div>
                          <div><div className="text-muted-foreground mb-1">Esperado</div><pre className="bg-muted p-2 rounded whitespace-pre-wrap">{r.expected}</pre></div>
                          {!r.passed && <><div className="col-span-2"><div className="text-muted-foreground mb-1">Obtido</div><pre className="bg-red-500/10 border border-red-500/20 p-2 rounded whitespace-pre-wrap">{r.actual || '(vazio)'}</pre></div></>}
                          {r.error && <div className="col-span-2"><div className="text-muted-foreground mb-1">Erro</div><pre className="bg-red-500/10 border border-red-500/20 p-2 rounded whitespace-pre-wrap text-red-400">{r.error}</pre></div>}
                        </div>
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
