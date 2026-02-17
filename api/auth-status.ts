import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/auth-status
 * Diagnóstico (sem autenticação): indica se FIREBASE_SERVICE_ACCOUNT_JSON está configurado e válido.
 * Use para conferir no navegador se o Vercel está lendo a variável corretamente.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') {
    return res.status(200).json({ ok: false, reason: 'env_missing' });
  }

  const hasNewlines = raw.includes('\n') && !raw.trimStart().startsWith('{');
  if (hasNewlines) {
    return res.status(200).json({ ok: false, reason: 'json_multiline', hint: 'Use o JSON em uma única linha no Vercel.' });
  }

  let parsed: { project_id?: string; projectId?: string; client_email?: string; private_key?: string };
  try {
    const normalized = raw.replace(/\\n/g, '\n');
    parsed = JSON.parse(normalized) as typeof parsed;
  } catch {
    return res.status(200).json({ ok: false, reason: 'json_invalid', hint: 'Cole o JSON minificado em uma única linha.' });
  }

  const projectId = parsed.project_id ?? parsed.projectId;
  const hasKey = typeof parsed.private_key === 'string' && parsed.private_key.length > 100;
  const hasEmail = typeof parsed.client_email === 'string' && parsed.client_email.includes('@');

  if (!hasKey || !hasEmail) {
    return res.status(200).json({
      ok: false,
      reason: 'key_incomplete',
      hint: 'O valor pode ter sido truncado. Use uma única linha e faça Redeploy.',
    });
  }

  return res.status(200).json({
    ok: true,
    projectId: projectId ?? null,
  });
}
