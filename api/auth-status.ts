import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/auth-status
 * Diagnóstico (sem autenticação): indica se FIREBASE_SERVICE_ACCOUNT_JSON está configurado e válido.
 * Use para conferir no navegador se o Vercel está lendo a variável corretamente.
 */
function getParsedServiceAccount(): { parsed: Record<string, unknown>; source: 'json' | 'b64' } | { ok: false; reason: string; hint: string } {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64 && typeof b64 === 'string' && b64.length > 100) {
    try {
      const json = Buffer.from(b64, 'base64').toString('utf8');
      const normalized = json.replace(/\\n/g, '\n');
      const parsed = JSON.parse(normalized) as Record<string, unknown>;
      return { parsed, source: 'b64' };
    } catch {
      return { ok: false, reason: 'b64_invalid', hint: 'FIREBASE_SERVICE_ACCOUNT_B64 inválido. Gere de novo com: node scripts/vercel-env-service-account-b64.js "C:\\caminho\\sua-chave.json"' };
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') {
    return { ok: false, reason: 'env_missing', hint: 'Defina FIREBASE_SERVICE_ACCOUNT_JSON ou FIREBASE_SERVICE_ACCOUNT_B64 no Vercel.' };
  }
  const hasNewlines = raw.includes('\n') && !raw.trimStart().startsWith('{');
  if (hasNewlines) {
    return { ok: false, reason: 'json_multiline', hint: 'Use o JSON em uma única linha ou use FIREBASE_SERVICE_ACCOUNT_B64 (Base64).' };
  }
  try {
    const normalized = raw.replace(/\\n/g, '\n');
    const parsed = JSON.parse(normalized) as Record<string, unknown>;
    return { parsed, source: 'json' };
  } catch {
    return { ok: false, reason: 'json_invalid', hint: 'Use FIREBASE_SERVICE_ACCOUNT_B64 em vez de JSON: script scripts/vercel-env-service-account-b64.js gera o valor em Base64 (evita problema no Vercel).' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const result = getParsedServiceAccount();
  if (!('parsed' in result)) {
    return res.status(200).json({ ok: false, reason: result.reason, hint: result.hint });
  }
  const parsed = result.parsed as { project_id?: string; projectId?: string; client_email?: string; private_key?: string };
  const projectId = parsed.project_id ?? parsed.projectId;
  const hasKey = typeof parsed.private_key === 'string' && parsed.private_key.length > 100;
  const hasEmail = typeof parsed.client_email === 'string' && parsed.client_email.includes('@');

  if (!hasKey || !hasEmail) {
    return res.status(200).json({
      ok: false,
      reason: 'key_incomplete',
      hint: 'O valor pode ter sido truncado. Use FIREBASE_SERVICE_ACCOUNT_B64 (Base64).',
    });
  }

  return res.status(200).json({
    ok: true,
    projectId: projectId ?? null,
    source: result.source,
  });
}
