import { useState } from 'react';
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

  const handleRun = async () => {
    setState('running');
    setOutput('');

    try {
      // Modo assíncrono apenas (evita 400 quando wait=true não é permitido)
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
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[220px] p-4 font-mono text-sm bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
          spellCheck={false}
          placeholder="Cole ou edite o código Java (classe com método main)..."
        />
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
