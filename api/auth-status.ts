import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getB64String, getEnvDiagnostics } from './_firebaseAdmin';

/**
 * GET /api/auth-status
 * Diagnostico (sem autenticacao): indica se a Service Account esta configurada e valida.
 */

function getParsedServiceAccount(): { parsed: Record<string, unknown>; source: 'json' | 'b64' } | { ok: false; reason: string; hint: string; b64Length?: number; env?: Record<string, number> } {
  const b64Raw = getB64String();
  const env = getEnvDiagnostics();

  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      const normalized = json.replace(/\\n/g, '\n');
      const parsed = JSON.parse(normalized) as Record<string, unknown>;
      return { parsed, source: 'b64' };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const hint = `Base64 com ${b64Raw.length} chars nao gerou JSON valido. Erro: ${msg}. Regenere com: node scripts/vercel-env-service-account-b64-parts.js sua-chave.json. env: ${JSON.stringify(env)}`;
      return { ok: false, reason: 'b64_invalid', hint, b64Length: b64Raw.length, env };
    }
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') {
    return { ok: false, reason: 'env_missing', hint: `Nenhum B64 valido. Defina PART1..PARTN ou FIREBASE_SERVICE_ACCOUNT_B64. env: ${JSON.stringify(env)}`, env };
  }

  const hasNewlines = raw.includes('\n') && !raw.trimStart().startsWith('{');
  if (hasNewlines) {
    return { ok: false, reason: 'json_multiline', hint: 'Use o JSON em uma unica linha ou use FIREBASE_SERVICE_ACCOUNT_B64 (Base64).' };
  }

  try {
    const normalized = raw.replace(/\\n/g, '\n');
    const parsed = JSON.parse(normalized) as Record<string, unknown>;
    return { parsed, source: 'json' };
  } catch {
    return { ok: false, reason: 'json_invalid', hint: 'JSON invalido. Use: node scripts/vercel-env-service-account-b64-parts.js sua-chave.json' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const result = getParsedServiceAccount();
  if (!('parsed' in result)) {
    const body: { ok: false; reason: string; hint: string; b64Length?: number; env?: Record<string, number> } = { ok: false, reason: result.reason, hint: result.hint };
    if (result.b64Length !== undefined) body.b64Length = result.b64Length;
    if (result.env) body.env = result.env;
    return res.status(200).json(body);
  }

  const parsed = result.parsed as { project_id?: string; projectId?: string; client_email?: string; private_key?: string };
  const projectId = parsed.project_id ?? parsed.projectId;
  const hasKey = typeof parsed.private_key === 'string' && parsed.private_key.length > 100;
  const hasEmail = typeof parsed.client_email === 'string' && parsed.client_email.includes('@');

  if (!hasKey || !hasEmail) {
    return res.status(200).json({
      ok: false,
      reason: 'key_incomplete',
      hint: 'O valor pode ter sido truncado. Regenere com: node scripts/vercel-env-service-account-b64-parts.js sua-chave.json',
    });
  }

  return res.status(200).json({
    ok: true,
    projectId: projectId ?? null,
    source: result.source,
  });
}
