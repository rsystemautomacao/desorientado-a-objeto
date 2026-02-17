import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/auth-status
 * Diagnóstico (sem autenticação): indica se FIREBASE_SERVICE_ACCOUNT_JSON está configurado e válido.
 * Use para conferir no navegador se o Vercel está lendo a variável corretamente.
 */
function getB64String(): string | null {
  const p1 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART1;
  const p2 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART2;
  if (p1 && p2 && typeof p1 === 'string' && typeof p2 === 'string' && p1.length > 100 && p2.length > 10) {
    return (p1 + p2).replace(/\s/g, '');
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (one && typeof one === 'string' && one.length > 3500) return one.replace(/\s/g, '');
  if (one && typeof one === 'string' && one.length > 100) return one.replace(/\s/g, '');
  return null;
}

function getParsedServiceAccount(): { parsed: Record<string, unknown>; source: 'json' | 'b64' } | { ok: false; reason: string; hint: string; b64Length?: number } {
  const b64Raw = getB64String();
  if (b64Raw && b64Raw.length > 100) {
    const b64 = b64Raw;
    try {
      let json = Buffer.from(b64, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      const normalized = json.replace(/\\n/g, '\n');
      const parsed = JSON.parse(normalized) as Record<string, unknown>;
      return { parsed, source: 'b64' };
    } catch {
      const hint =
        b64Raw.length < 3500
          ? `Base64 truncado (${b64Raw.length} chars). Se ja criou B64_PART1 e B64_PART2 no Vercel, faca REDEPLOY (Deployments → Redeploy) para as variaveis serem usadas. Senao, rode scripts/vercel-env-service-account-b64-parts.js e crie as duas variaveis, depois Redeploy.`
          : 'Base64 invalido. Use o script vercel-env-service-account-b64-parts.js e defina B64_PART1 e B64_PART2 no Vercel, depois Redeploy.';
      return { ok: false, reason: 'b64_invalid', hint, b64Length: b64Raw.length };
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
    const body: { ok: false; reason: string; hint: string; b64Length?: number } = { ok: false, reason: result.reason, hint: result.hint };
    if (result.b64Length !== undefined) body.b64Length = result.b64Length;
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
      hint: 'O valor pode ter sido truncado. Use FIREBASE_SERVICE_ACCOUNT_B64 (Base64).',
    });
  }

  return res.status(200).json({
    ok: true,
    projectId: projectId ?? null,
    source: result.source,
  });
}
