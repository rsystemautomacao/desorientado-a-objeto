import { useRef, type CSSProperties } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  moduleTitle: string;
  moduleIcon: string;
  moduleLevel: string;
  lessonCount: number;
  languageLabel?: string;
  completionDate?: string;  // e.g. "15 de março de 2025"
  totalHours?: string;      // e.g. "3 horas e 20 minutos"
}

// Inline styles for both preview and print
const s = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 12,
    borderRadius: 12,
  } as CSSProperties,
  border: {
    border: '3px solid rgba(255,255,255,0.5)',
    borderRadius: 8,
    padding: 6,
  } as CSSProperties,
  inner: {
    background: 'white',
    borderRadius: 6,
    padding: '40px 32px',
    textAlign: 'center' as const,
  } as CSSProperties,
  icon: { fontSize: 48, marginBottom: 8 } as CSSProperties,
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: 12,
  } as CSSProperties,
  line: {
    width: 120,
    height: 2,
    background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
    margin: '16px auto',
  } as CSSProperties,
  text: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  } as CSSProperties,
  name: {
    fontFamily: 'Georgia, serif',
    fontSize: 32,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: '8px 0 12px',
  } as CSSProperties,
  module: {
    fontSize: 20,
    fontWeight: 600,
    color: '#667eea',
    margin: '8px 0',
  } as CSSProperties,
  details: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  } as CSSProperties,
  date: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  } as CSSProperties,
  platform: {
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 700,
    color: '#764ba2',
    marginTop: 12,
  } as CSSProperties,
  subtitle: {
    fontSize: 11,
    color: '#999',
  } as CSSProperties,
  signatureArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  } as CSSProperties,
  signatureLine: {
    width: 180,
    height: 1,
    background: '#ccc',
    marginTop: 4,
  } as CSSProperties,
  signatureLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: 600,
  } as CSSProperties,
  signatureRole: {
    fontSize: 11,
    color: '#999',
  } as CSSProperties,
};

// Calligraphy signature using Great Vibes font
function SignatureSvg() {
  return (
    <div style={{ textAlign: 'center' as const }}>
      {/* Font import — only adds the <link> once via style injection */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}</style>
      <p style={{
        fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
        fontSize: 40,
        color: '#1a1a2e',
        margin: 0,
        lineHeight: 1.2,
        letterSpacing: '0.02em',
      }}>
        Richard Spanhol
      </p>
    </div>
  );
}

export default function CertificateModal({
  open,
  onOpenChange,
  studentName,
  moduleTitle,
  moduleIcon,
  moduleLevel,
  lessonCount,
  languageLabel = 'Java & POO',
  completionDate,
  totalHours,
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const levelLabel =
    moduleLevel === 'basico'
      ? 'Fundamentos'
      : moduleLevel === 'intermediario'
        ? 'Intermediário'
        : 'Avançado';

  const displayDate = completionDate ?? '—';

  function handleDownload() {
    const content = certRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificado — ${moduleTitle}</title>
          <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            }
            /* Force browsers to print background colors and gradients */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @media print {
              @page { margin: 0.5cm; size: A4 landscape; }
              body { background: white; margin: 0; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>
            document.fonts.ready.then(function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  const certContent = (
    <div style={s.container}>
      <div style={s.border}>
        <div style={s.inner}>
          <div style={s.icon}>{moduleIcon}</div>
          <h1 style={s.title}>Certificado de Conclusão</h1>
          <div style={s.line} />
          <p style={s.text}>Certificamos que</p>
          <h2 style={s.name}>{studentName}</h2>
          <p style={s.text}>concluiu com êxito o módulo</p>
          <h3 style={s.module}>{moduleTitle}</h3>
          <p style={s.details}>
            Nível {levelLabel} &bull; {lessonCount} aulas concluídas
            {totalHours ? ` \u2022 Carga horária: ${totalHours}` : ''}
          </p>
          <div style={s.line} />
          <p style={s.date}>Concluído em {displayDate}</p>

          {/* Signature area */}
          <div style={s.signatureArea}>
            <SignatureSvg />
            <div style={s.signatureLine} />
            <p style={s.signatureLabel}>Prof. Richard Spanhol</p>
            <p style={s.signatureRole}>Instrutor — Desorientado a Objetos</p>
          </div>

          <p style={s.platform}>Desorientado a Objetos</p>
          <p style={s.subtitle}>Plataforma de Programação — {languageLabel}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-0 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificado de Conclusão
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <div ref={certRef}>{certContent}</div>

          <div className="flex justify-center mt-4">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Certificado (PDF)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
