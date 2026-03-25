import { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    curve: 'linear',
    htmlLabels: true,
    useMaxWidth: true,
  },
});

export default function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState(false);
  const rawId = useId();
  const uid = 'md' + rawId.replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    setError(false);
    mermaid
      .render(uid, chart)
      .then(({ svg }) => setSvg(svg))
      .catch(() => setError(true));
  }, [chart, uid]);

  if (error) return null;

  return (
    <div
      className="my-6 flex justify-center p-4 rounded-xl bg-white border border-border overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
