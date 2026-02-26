import { useRef, type CSSProperties } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Award } from 'lucide-react';

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  moduleTitle: string;
  moduleIcon: string;
  moduleLevel: string;
  lessonCount: number;
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
};

export default function CertificateModal({
  open,
  onOpenChange,
  studentName,
  moduleTitle,
  moduleIcon,
  moduleLevel,
  lessonCount,
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const levelLabel =
    moduleLevel === 'basico'
      ? 'Fundamentos'
      : moduleLevel === 'intermediario'
        ? 'Intermediario'
        : 'Avancado';

  function handlePrint() {
    const content = certRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificado - ${moduleTitle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
            @media print {
              body { background: white; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <script>window.onload = function() { window.print(); };</script>
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
          <h1 style={s.title}>Certificado de Conclusao</h1>
          <div style={s.line} />
          <p style={s.text}>Certificamos que</p>
          <h2 style={s.name}>{studentName}</h2>
          <p style={s.text}>concluiu com exito o modulo</p>
          <h3 style={s.module}>{moduleTitle}</h3>
          <p style={s.details}>
            Nivel {levelLabel} &bull; {lessonCount} aulas completadas
          </p>
          <div style={s.line} />
          <p style={s.date}>{today}</p>
          <p style={s.platform}>Desorientado a Objetos</p>
          <p style={s.subtitle}>Plataforma de Ensino de Java & POO</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Certificado de Conclusao
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div ref={certRef}>{certContent}</div>

          <div className="flex justify-center mt-4">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
