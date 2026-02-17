import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * GET /api/auth-status
 * Diagnóstico (sem autenticação): indica se FIREBASE_SERVICE_ACCOUNT_JSON está configurado e válido.
 * Use para conferir no navegador se o Vercel está lendo a variável corretamente.
 */
function getB64String(): string | null {
  const p1 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART1;
  const p2 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART2;
  const p3 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART3;
  const p4 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART4;
  const parts = [p1, p2, p3, p4].filter((p): p is string => typeof p === 'string' && p.length > 0);
  if (parts.length >= 3 && parts.reduce((s, p) => s + p.length, 0) > 3500) {
    return parts.join('').replace(/\s/g, '');
  }
  if (p1 && p2 && p3 && typeof p1 === 'string' && typeof p2 === 'string' && typeof p3 === 'string' && p1.length > 100 && p2.length > 10 && p3.length > 10) {
    return (p1 + p2 + p3).replace(/\s/g, '');
  }
  if (p1 && p2 && typeof p1 === 'string' && typeof p2 === 'string' && p1.length > 100 && p2.length > 10) {
    return (p1 + p2).replace(/\s/g, '');
  }
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (one && typeof one === 'string' && one.length > 3500) return one.replace(/\s/g, '');
  if (one && typeof one === 'string' && one.length > 100) return one.replace(/\s/g, '');
  return null;
}

function getParsedServiceAccount(): { parsed: Record<string, unknown>; source: 'json' | 'b64' } | { ok: false; reason: string; hint: string; b64Length?: number; env?: { part1Len: number; part2Len: number; part3Len?: number; part4Len?: number; singleLen: number } } {
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
      const p1 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART1;
      const p2 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART2;
      const p3 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART3;
      const p4 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART4;
      const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
      const env = {
        part1Len: typeof p1 === 'string' ? p1.length : 0,
        part2Len: typeof p2 === 'string' ? p2.length : 0,
        part3Len: typeof p3 === 'string' ? p3.length : 0,
        part4Len: typeof p4 === 'string' ? p4.length : 0,
        singleLen: typeof one === 'string' ? one.length : 0,
      };
      const hint =
        b64Raw.length < 3500
          ? `Base64 truncado (${b64Raw.length} chars). Use 4 partes: rode o script e crie PART1 a PART4 no Vercel (~900 chars cada). env: part1=${env.part1Len} part2=${env.part2Len} part3=${env.part3Len} part4=${env.part4Len}.`
          : 'Base64 invalido. Rode scripts/vercel-env-service-account-b64-parts.js (4 partes) e defina PART1..PART4 no Vercel, depois Redeploy.';
      return { ok: false, reason: 'b64_invalid', hint, b64Length: b64Raw.length, env };
    }
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') {
    const p1 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART1;
    const p2 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART2;
    const p3 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART3;
    const p4 = process.env.FIREBASE_SERVICE_ACCOUNT_B64_PART4;
    const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
    const env = { part1Len: typeof p1 === 'string' ? p1.length : 0, part2Len: typeof p2 === 'string' ? p2.length : 0, part3Len: typeof p3 === 'string' ? p3.length : 0, part4Len: typeof p4 === 'string' ? p4.length : 0, singleLen: typeof one === 'string' ? one.length : 0 };
    return { ok: false, reason: 'env_missing', hint: 'Nenhum B64 valido. Defina PART1..PART4 (script gera 4 linhas) ou FIREBASE_SERVICE_ACCOUNT_JSON. env: ' + JSON.stringify(env), env };
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
      hint: 'O valor pode ter sido truncado. Use FIREBASE_SERVICE_ACCOUNT_B64 (Base64).',
    });
  }

  return res.status(200).json({
    ok: true,
    projectId: projectId ?? null,
    source: result.source,
  });
}
