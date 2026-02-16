import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg border border-code-border bg-code-bg overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-code-border">
          <span className="text-xs text-muted-foreground font-mono">{title}</span>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      {!title && (
        <div className="flex justify-end px-4 py-1">
          <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto scrollbar-thin text-sm leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}
