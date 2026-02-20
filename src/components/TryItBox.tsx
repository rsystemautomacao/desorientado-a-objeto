import { useState } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

type RunState = 'idle' | 'running' | 'success' | 'error';

interface TryItBoxProps {
  initialCode: string;
  prompt?: string;
  className?: string;
}

export default function TryItBox({ initialCode, prompt, className = '' }: TryItBoxProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [state, setState] = useState<RunState>('idle');

  const handleRun = async () => {
    setState('running');
    setOutput('');

    try {
      // Piston espera arquivo com nome igual à classe pública; extrair nome da classe
      const publicClassMatch = code.match(/public\s+class\s+(\w+)/);
      const className = publicClassMatch ? publicClassMatch[1] : 'Main';
      const fileName = className + '.java';

      const res = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'java',
          version: '*',
          files: [{ name: fileName, content: code }],
          run_timeout: 10000,
        }),
      });

      if (!res.ok) {
        setOutput(`Erro na API (${res.status}). Tente novamente ou copie o código e execute no seu computador.`);
        setState('error');
        return;
      }

      const data = await res.json();

      if (data.compile?.stderr) {
        setOutput('Compilação:\n' + data.compile.stderr + (data.run?.stderr ? '\n\nExecução:\n' + data.run.stderr : ''));
        setState('error');
        return;
      }

      const runOut = data.run?.stdout ?? '';
      const runErr = data.run?.stderr ?? '';
      const combined = runOut + (runErr ? '\n[stderr]\n' + runErr : '');
      setOutput(combined.trim() || '(Nenhuma saída)');
      setState(runErr ? 'error' : 'success');
    } catch (e) {
      setOutput('Não foi possível executar. Verifique sua conexão ou copie o código e execute no seu IDE (ex: VS Code, IntelliJ).');
      setState('error');
    }
  };

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
