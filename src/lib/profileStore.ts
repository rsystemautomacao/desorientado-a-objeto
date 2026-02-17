export interface Profile {
  nome: string;
  tipo: 'EM' | 'Superior';
  curso: string;
  serieOuSemestre: string;
  observacoes: string;
}

const DEFAULT: Profile = {
  nome: '',
  tipo: 'Superior',
  curso: '',
  serieOuSemestre: '',
  observacoes: '',
};

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  return typeof base === 'string' && base.length > 0 ? base.replace(/\/$/, '') : '';
}

export async function getProfileFromApi(token: string): Promise<Profile> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { ...DEFAULT };
  const data = await res.json();
  return {
    nome: typeof data.nome === 'string' ? data.nome : '',
    tipo: data.tipo === 'EM' || data.tipo === 'Superior' ? data.tipo : 'Superior',
    curso: typeof data.curso === 'string' ? data.curso : '',
    serieOuSemestre: typeof data.serieOuSemestre === 'string' ? data.serieOuSemestre : '',
    observacoes: typeof data.observacoes === 'string' ? data.observacoes : '',
  };
}

export async function saveProfileToApi(token: string, profile: Profile): Promise<void> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const err = new Error('Failed to save profile') as Error & { status?: number; code?: string };
    err.status = res.status;
    try {
      const body = await res.json();
      if (body && typeof body.code === 'string') err.code = body.code;
    } catch {}
    throw err;
  }
}
