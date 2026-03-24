import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JUDGE0_URL = 'https://ce.judge0.com';

type RunState = 'idle' | 'running' | 'success' | 'error';

interface LangTryItBoxProps {
  initialCode: string;
  languageId: number;  // 71 = Python, 50 = C
  langLabel: string;   // 'Python' | 'C'
  prompt?: string;
  className?: string;
}

// ── Python Syntax Highlighter ──
const PYTHON_KEYWORDS = new Set([
  'False','None','True','and','as','assert','async','await','break','class',
  'continue','def','del','elif','else','except','finally','for','from','global',
  'if','import','in','is','lambda','nonlocal','not','or','pass','raise','return',
  'try','while','with','yield','print','input','len','range','int','float','str',
  'bool','list','dict','set','tuple','type','isinstance','enumerate','zip','map',
  'filter','sorted','reversed','sum','min','max','abs','round','open',
]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightPython(code: string): string {
  const tokens: string[] = [];
  let i = 0;
  while (i < code.length) {
    // Comment
    if (code[i] === '#') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // Triple-quoted string
    else if (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''") {
      const q = code.slice(i, i + 3);
      const end = code.indexOf(q, i + 3);
      const slice = end >= 0 ? code.slice(i, end + 3) : code.slice(i);
      tokens.push(`<span style="color:#b45309">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // String
    else if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q && code[j] !== '\n') {
        if (code[j] === '\\') j++;
        j++;
      }
      const slice = code.slice(i, j + 1);
      tokens.push(`<span style="color:#b45309">${escapeHtml(slice)}</span>`);
      i = j + 1;
    }
    // Word
    else if (/[a-zA-Z_]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (PYTHON_KEYWORDS.has(word)) {
        tokens.push(`<span style="color:#7c3aed;font-weight:600">${escapeHtml(word)}</span>`);
      } else {
        tokens.push(escapeHtml(word));
      }
      i = j;
    }
    // Number
    else if (/\d/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\d._xXa-fA-F]/.test(code[j])) j++;
      tokens.push(`<span style="color:#0d9488">${escapeHtml(code.slice(i, j))}</span>`);
      i = j;
    }
    else {
      tokens.push(escapeHtml(code[i]));
      i++;
    }
  }
  return tokens.join('');
}

// ── C Syntax Highlighter ──
const C_KEYWORDS = new Set([
  'auto','break','case','char','const','continue','default','do','double','else',
  'enum','extern','float','for','goto','if','inline','int','long','register',
  'restrict','return','short','signed','sizeof','static','struct','switch',
  'typedef','union','unsigned','void','volatile','while','NULL','true','false',
  'include','define','ifdef','ifndef','endif','pragma',
]);

function highlightC(code: string): string {
  const tokens: string[] = [];
  let i = 0;
  while (i < code.length) {
    // Preprocessor
    if (code[i] === '#') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#0369a1">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // Block comment
    else if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const slice = end >= 0 ? code.slice(i, end + 2) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // Line comment
    else if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // String
    else if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') { if (code[j] === '\\') j++; j++; }
      tokens.push(`<span style="color:#b45309">${escapeHtml(code.slice(i, j + 1))}</span>`);
      i = j + 1;
    }
    // Char literal
    else if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'") { if (code[j] === '\\') j++; j++; }
      tokens.push(`<span style="color:#b45309">${escapeHtml(code.slice(i, j + 1))}</span>`);
      i = j + 1;
    }
    // Word
    else if (/[a-zA-Z_]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (C_KEYWORDS.has(word)) {
        tokens.push(`<span style="color:#7c3aed;font-weight:600">${escapeHtml(word)}</span>`);
      } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word)) {
        tokens.push(`<span style="color:#0369a1">${escapeHtml(word)}</span>`);
      } else {
        tokens.push(escapeHtml(word));
      }
      i = j;
    }
    // Number
    else if (/\d/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\d.xXa-fA-FLlFfDd_]/.test(code[j])) j++;
      tokens.push(`<span style="color:#0d9488">${escapeHtml(code.slice(i, j))}</span>`);
      i = j;
    }
    else {
      tokens.push(escapeHtml(code[i]));
      i++;
    }
  }
  return tokens.join('');
}

function highlight(code: string, languageId: number): string {
  if (languageId === 71) return highlightPython(code);
  if (languageId === 50) return highlightC(code);
  return escapeHtml(code);
}

function buildOutput(data: {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { id: number; description?: string };
}): string {
  const statusId = data.status?.id;
  if (statusId === 6 && data.compile_output) {
    return 'Compilação:\n' + data.compile_output + (data.stderr ? '\n\n' + data.stderr : '');
  }
  const out = data.stdout ?? '';
  const err = data.stderr ?? '';
  const msg = data.message ?? '';
  const parts = [out, err ? `[stderr]\n${err}` : '', msg].filter(Boolean);
  return parts.join('\n').trim() || '(Nenhuma saída)';
}

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string): string {
  try { return decodeURIComponent(escape(atob(b64))); } catch { return atob(b64); }
}

async function runCode(sourceCode: string, languageId: number): Promise<{
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { id: number; description?: string };
}> {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: toBase64(sourceCode),
      language_id: languageId,
      stdin: toBase64(''),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = typeof err.error === 'string' ? err.error : err.message ?? '';
    throw new Error(msg || `HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.stdout) data.stdout = fromBase64(data.stdout);
  if (data.stderr) data.stderr = fromBase64(data.stderr);
  if (data.compile_output) data.compile_output = fromBase64(data.compile_output);
  if (data.message) data.message = fromBase64(data.message);
  return data;
}

export default function LangTryItBox({
  initialCode, languageId, langLabel, prompt, className = '',
}: LangTryItBoxProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [state, setState] = useState<RunState>('idle');
  const [activeLine, setActiveLine] = useState(-1);
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

  const runRef = useRef<() => void>();

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runRef.current?.();
      return;
    }

    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = ta;

    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = languageId === 71 ? '    ' : '    '; // 4 spaces for both
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
        const next = value.substring(0, start) + spaces + value.substring(end);
        setCode(next);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + spaces.length;
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
      // Add indent after : (Python) or { (C)
      const extra = (trimmed.endsWith(':') || trimmed.endsWith('{')) ? '    ' : '';
      const insertion = '\n' + indent + extra;
      const next = value.substring(0, start) + insertion + value.substring(end);
      setCode(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + insertion.length;
        updateActiveLine();
      });
      return;
    }

    // C: auto-dedent }
    if (e.key === '}' && languageId === 50) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const beforeCursor = value.substring(lineStart, start);
      if (/^\s{4,}$/.test(beforeCursor)) {
        e.preventDefault();
        const dedented = value.substring(0, lineStart) + beforeCursor.substring(4) + '}' + value.substring(end);
        setCode(dedented);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start - 4 + 1;
          updateActiveLine();
        });
        return;
      }
    }
  }, [setCode, updateActiveLine, languageId]);

  const handleRun = async () => {
    if (state === 'running') return;
    setState('running');
    setOutput('');

    try {
      const result = await runCode(code, languageId);
      setOutput(buildOutput(result));
      setState(result.status?.id === 3 ? 'success' : 'error');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setOutput(
        msg
          ? `API: ${msg}\n\nCopie o código e execute no seu computador se o erro persistir.`
          : 'Não foi possível executar. Verifique sua conexão ou copie o código para executar localmente.'
      );
      setState('error');
    }
  };

  runRef.current = handleRun;

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setState('idle');
  };

  return (
    <div className={`rounded-xl border-2 border-primary/30 bg-primary/5 overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-primary/20 bg-primary/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">Experimente aqui</span>
          {prompt && <span className="text-sm text-muted-foreground">— {prompt}</span>}
          <span className="text-xs text-muted-foreground ml-1">({langLabel})</span>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleReset}>
            Restaurar
          </Button>
          <Button type="button" size="sm" onClick={handleRun} disabled={state === 'running'} title="Ctrl+Enter">
            {state === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">{state === 'running' ? 'Executando...' : 'Executar'}</span>
          </Button>
        </div>
      </div>
      <div className="p-2">
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
            dangerouslySetInnerHTML={{ __html: highlight(code, languageId) + '\n' }}
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
            className="relative w-full min-h-[220px] p-4 pl-14 font-mono text-sm leading-[1.625] bg-transparent resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg z-[3]"
            style={{ color: 'transparent', caretColor: '#22c55e' }}
            spellCheck={false}
            placeholder={`Cole ou edite o código ${langLabel}...`}
          />
        </div>
      </div>
      {output && (
        <div className={`px-4 py-3 border-t border-border flex items-start gap-2 ${state === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-muted/50'}`}>
          {state === 'error' ? <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
          <pre className="text-sm whitespace-pre-wrap break-words font-mono flex-1">{output}</pre>
        </div>
      )}
    </div>
  );
}
