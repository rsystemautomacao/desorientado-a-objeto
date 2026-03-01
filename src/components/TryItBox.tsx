import { useState, useRef, useCallback } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JUDGE0_URL = 'https://ce.judge0.com';
const JAVA_LANGUAGE_ID = 91; // Java (JDK 17.0.6)
const POLL_INTERVAL_MS = 800;
const MAX_POLL_ATTEMPTS = 30;

type RunState = 'idle' | 'running' | 'success' | 'error';

interface TryItBoxProps {
  initialCode: string;
  prompt?: string;
  className?: string;
}

// ── Simple Java Syntax Highlighter ──
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
  // Tokenize: strings, single-line comments, multi-line comments, keywords, numbers, rest
  const tokens: string[] = [];
  let i = 0;
  while (i < code.length) {
    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const slice = end >= 0 ? code.slice(i, end + 2) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // Single-line comment
    else if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const slice = end >= 0 ? code.slice(i, end) : code.slice(i);
      tokens.push(`<span style="color:#6b7280;font-style:italic">${escapeHtml(slice)}</span>`);
      i += slice.length;
    }
    // String literal
    else if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') { if (code[j] === '\\') j++; j++; }
      const slice = code.slice(i, j + 1);
      tokens.push(`<span style="color:#b45309">${escapeHtml(slice)}</span>`);
      i = j + 1;
    }
    // Char literal
    else if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== "'") { if (code[j] === '\\') j++; j++; }
      const slice = code.slice(i, j + 1);
      tokens.push(`<span style="color:#b45309">${escapeHtml(slice)}</span>`);
      i = j + 1;
    }
    // Annotation
    else if (code[i] === '@') {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      const slice = code.slice(i, j);
      tokens.push(`<span style="color:#7c3aed">${escapeHtml(slice)}</span>`);
      i = j;
    }
    // Word (keyword or identifier)
    else if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (JAVA_KEYWORDS.has(word)) {
        tokens.push(`<span style="color:#7c3aed;font-weight:600">${escapeHtml(word)}</span>`);
      } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word)) {
        // Likely a class name (starts uppercase, has lowercase)
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
      const slice = code.slice(i, j);
      tokens.push(`<span style="color:#0d9488">${escapeHtml(slice)}</span>`);
      i = j;
    }
    // Operators and punctuation
    else {
      tokens.push(escapeHtml(code[i]));
      i++;
    }
  }
  return tokens.join('');
}

// ── Submission helpers ──

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

function isTerminalStatus(statusId: number): boolean {
  return [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(statusId);
}

export default function TryItBox({ initialCode, prompt, className = '' }: TryItBoxProps) {
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value } = ta;

    // Tab → insert 4 spaces instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab: remove up to 4 leading spaces on current line
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

    // Enter → auto-indent: keep same indentation, add extra if line ends with {
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

    // } → auto-dedent: if the line is only whitespace + }, reduce indent
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

  const handleRun = async () => {
    setState('running');
    setOutput('');

    try {
      const createRes = await fetch(
        `${JUDGE0_URL}/submissions?base64_encoded=false`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: code,
            language_id: JAVA_LANGUAGE_ID,
            stdin: '',
          }),
        }
      );

      const createData = await createRes.json().catch(() => ({}));
      const token = createData.token;

      if (!createRes.ok || !token) {
        const errMsg = typeof createData.error === 'string' ? createData.error : createData.message ?? createData.errors?.join?.(' ') ?? '';
        setOutput(
          errMsg
            ? `API: ${errMsg}\n\nCopie o código e execute no seu computador se o erro persistir.`
            : `Erro na API (${createRes.status}). Tente novamente ou copie o código e execute no seu computador.`
        );
        setState('error');
        return;
      }

      const polled = await pollSubmission(token);
      setOutput(buildOutput(polled));
      setState(polled.status?.id === 3 ? 'success' : 'error');
    } catch {
      setOutput('Não foi possível executar. Verifique sua conexão ou copie o código e execute no seu IDE (ex: VS Code, IntelliJ).');
      setState('error');
    }
  };

  async function pollSubmission(token: string): Promise<{
    stdout?: string | null;
    stderr?: string | null;
    compile_output?: string | null;
    message?: string | null;
    status?: { id: number; description?: string };
  }> {
    for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      const res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status?.id != null && isTerminalStatus(data.status.id)) return data;
    }
    return { status: { id: 0, description: 'Timeout' }, message: 'Tempo esgotado. Tente novamente.' };
  }

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
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleReset}>
            Restaurar
          </Button>
          <Button type="button" size="sm" onClick={handleRun} disabled={state === 'running'}>
            {state === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">{state === 'running' ? 'Executando...' : 'Executar'}</span>
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
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/50 border-r border-border overflow-hidden pointer-events-none z-10">
            <pre className="p-4 pr-2 text-right font-mono text-xs leading-[1.625] text-muted-foreground select-none">
              {code.split('\n').map((_, i) => (
                <span key={i} className={i + 1 === activeLine ? 'text-primary font-semibold' : ''}>
                  {i + 1}{'\n'}
                </span>
              ))}
            </pre>
          </div>

          {/* Highlighted code (background layer) */}
          <pre
            ref={preRef}
            className="absolute inset-0 p-4 pl-14 font-mono text-sm leading-[1.625] whitespace-pre-wrap break-words overflow-hidden pointer-events-none z-[2]"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlightJava(code) + '\n' }}
          />

          {/* Textarea (foreground layer, transparent text) */}
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
            placeholder="Cole ou edite o código Java (classe com método main)..."
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
