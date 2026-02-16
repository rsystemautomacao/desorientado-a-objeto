import { Lightbulb, AlertTriangle } from 'lucide-react';

interface InfoBoxProps {
  type: 'tip' | 'warning';
  children: React.ReactNode;
}

export default function InfoBox({ type, children }: InfoBoxProps) {
  const styles = {
    tip: {
      container: 'border-primary/30 bg-primary/5',
      icon: <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />,
      label: 'Dica',
      labelColor: 'text-primary',
    },
    warning: {
      container: 'border-accent/30 bg-accent/5',
      icon: <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />,
      label: 'Atenção',
      labelColor: 'text-accent',
    },
  };

  const s = styles[type];

  return (
    <div className={`my-4 rounded-lg border p-4 ${s.container}`}>
      <div className="flex gap-3">
        {s.icon}
        <div>
          <p className={`font-semibold text-sm mb-1 ${s.labelColor}`}>{s.label}</p>
          <div className="text-sm text-foreground/80">{children}</div>
        </div>
      </div>
    </div>
  );
}
