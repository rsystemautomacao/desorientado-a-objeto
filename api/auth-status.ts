import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/auth-status
 * Diagnostico (sem autenticacao): indica se a Service Account esta configurada e valida.
 */

function getB64String(): string | null {
  const partKeys = Array.from({ length: 8 }, (_, i) => `FIREBASE_SERVICE_ACCOUNT_B64_PART${i + 1}`);
  const parts: string[] = [];
  for (const key of partKeys) {
    const val = process.env[key];
    if (typeof val === 'string' && val.length > 0) parts.push(val.trim());
  }
  if (parts.length >= 2) {
    const joined = parts.join('').replace(/\s/g, '');
    if (joined.length > 100) return joined;
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (typeof one === 'string' && one.length > 100) return one.replace(/\s/g, '');
  return null;
}

function getEnvDiagnostics() {
  const partKeys = Array.from({ length: 8 }, (_, i) => `FIREBASE_SERVICE_ACCOUNT_B64_PART${i + 1}`);
  const env: Record<string, number> = {};
  for (const key of partKeys) {
    const val = process.env[key];
    const shortKey = key.replace('FIREBASE_SERVICE_ACCOUNT_B64_', '').toLowerCase() + 'Len';
    env[shortKey] = typeof val === 'string' ? val.length : 0;
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  env.singleLen = typeof one === 'string' ? one.length : 0;
  return env;
}

function getParsedServiceAccount(): { parsed: Record<string, unknown>; source: 'json' | 'b64' } | { ok: false; reason: string; hint: string; b64Length?: number; env?: Record<string, number> } {
  const b64Raw = getB64String();
  const env = getEnvDiagnostics();

  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      const parsed = JSON.parse(json) as Record<string, unknown>;
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
    const parsed = JSON.parse(raw) as Record<string, unknown>;
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
