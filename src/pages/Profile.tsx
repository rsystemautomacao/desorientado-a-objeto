import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileFromApi, saveProfileToApi, type Profile } from '@/lib/profileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, profileComplete, refreshProfileStatus } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    nome: '',
    tipo: 'Superior',
    curso: '',
    serieOuSemestre: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isMandatoryFill = profileComplete === false;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    user
      .getIdToken(true)
      .then((token) => getProfileFromApi(token))
      .then((p) => {
        setProfile(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.uid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate mandatory fields
    if (!profile.nome.trim() || !profile.curso.trim() || !profile.serieOuSemestre.trim()) {
      toast.error('Preencha todos os campos obrigatórios (Nome, Curso, Série/Semestre).');
      return;
    }

    setSaving(true);
    user
      .getIdToken(true)
      .then((token) => saveProfileToApi(token, profile))
      .then(() => {
        toast.success('Perfil salvo com sucesso.');
        setSaving(false);
        refreshProfileStatus(profile);
        if (isMandatoryFill) {
          navigate('/trilha');
        }
      })
      .catch(async (err: Error & { status?: number; code?: string; detail?: string }) => {
        setSaving(false);
        if (err?.status === 401) {
          const detail = err.detail ?? err.code ?? '';
          toast.error(`Erro de autenticação: ${detail || 'token não aceito'}. Faça logout e entre novamente.`);
        } else {
          toast.error('Erro ao salvar. Tente novamente.');
        }
      });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          Perfil do Aluno
        </h1>
        <p className="text-muted-foreground mb-6">
          {isMandatoryFill
            ? 'Complete seu cadastro para liberar o acesso ao curso.'
            : 'Atualize seus dados a qualquer momento.'}
        </p>

        {isMandatoryFill && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Preencha seu perfil para continuar.</strong>{' '}
              Os campos Nome, Curso e Série/Semestre são obrigatórios para acessar o conteúdo do curso.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input
              id="nome"
              value={profile.nome}
              onChange={(e) => setProfile((p) => ({ ...p, nome: e.target.value }))}
              placeholder={user?.displayName ?? 'Seu nome'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Nível de ensino</Label>
            <Select
              value={profile.tipo}
              onValueChange={(value: 'EM' | 'Superior') => setProfile((p) => ({ ...p, tipo: value }))}
            >
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EM">Ensino Médio</SelectItem>
                <SelectItem value="Superior">Superior (graduação, etc.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curso">Curso ou área de interesse *</Label>
            <Input
              id="curso"
              value={profile.curso}
              onChange={(e) => setProfile((p) => ({ ...p, curso: e.target.value }))}
              placeholder="Ex: Ciência da Computação, Desenvolvimento Web..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serie">
              {profile.tipo === 'EM' ? 'Série *' : 'Semestre ou período *'}
            </Label>
            <Input
              id="serie"
              value={profile.serieOuSemestre}
              onChange={(e) => setProfile((p) => ({ ...p, serieOuSemestre: e.target.value }))}
              placeholder={
                profile.tipo === 'EM'
                  ? 'Ex: 2º ano, 3º ano'
                  : 'Ex: 3º semestre, 2º período'
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Outras informações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={profile.observacoes}
              onChange={(e) => setProfile((p) => ({ ...p, observacoes: e.target.value }))}
              placeholder="Objetivos, dúvidas, ou o que quiser anotar..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full sm:w-auto gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : isMandatoryFill ? (
              'Salvar e continuar'
            ) : (
              'Salvar perfil'
            )}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
