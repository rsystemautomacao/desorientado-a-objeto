import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, getApp, cert, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin/app';

/**
 * GET /api/auth-status
 * Diagnostico completo: parseia, valida e tenta inicializar o Firebase Admin.
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const env = getEnvDiagnostics();
  const b64Raw = getB64String();

  // Step 1: Parse JSON
  let parsed: Record<string, unknown>;
  let source: string;
  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      parsed = JSON.parse(json) as Record<string, unknown>;
      source = 'b64';
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return res.status(200).json({ ok: false, step: 'parse_b64', error: msg, env });
    }
  } else {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw || typeof raw !== 'string') {
      return res.status(200).json({ ok: false, step: 'env_missing', env });
    }
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
      source = 'json';
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return res.status(200).json({ ok: false, step: 'parse_json', error: msg });
    }
  }

  // Step 2: Validate fields
  const projectId = (parsed.project_id ?? parsed.projectId) as string | undefined;
  const privateKey = (parsed.private_key ?? parsed.privateKey) as string | undefined;
  const clientEmail = (parsed.client_email ?? parsed.clientEmail) as string | undefined;

  if (!privateKey || privateKey.length < 100) {
    return res.status(200).json({ ok: false, step: 'validate', error: 'private_key ausente ou curta', privateKeyLen: privateKey?.length ?? 0 });
  }
  if (!clientEmail) {
    return res.status(200).json({ ok: false, step: 'validate', error: 'client_email ausente' });
  }

  // Step 3: Check private_key format
  const keyStartsCorrectly = privateKey.startsWith('-----BEGIN');
  const keyHasNewlines = privateKey.includes('\n');

  // Step 4: Try cert() + initializeApp (API modular v13 — evita admin.apps undefined no Vercel)
  try {
    if (getApps().length > 0) {
      await deleteApp(getApp());
    }

    // Garante snake_case no JSON raw (cert() + google-auth-library precisam)
    if (!parsed.project_id && parsed.projectId) parsed.project_id = parsed.projectId;
    if (!parsed.private_key && parsed.privateKey) parsed.private_key = parsed.privateKey;
    if (!parsed.client_email && parsed.clientEmail) parsed.client_email = parsed.clientEmail;

    const pid = (parsed.project_id ?? 'desorientado-a-objetos') as string;

    initializeApp({
      credential: cert(parsed as ServiceAccount),
      projectId: pid,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack?.split('\n').slice(0, 8).join('\n') : undefined;
    return res.status(200).json({
      ok: false,
      step: 'cert_init',
      error: msg,
      stack,
      source,
      parsedKeys: Object.keys(parsed),
      hasType: !!parsed.type,
      projectId: projectId ?? null,
      privateKeyLen: privateKey.length,
      privateKeyFirst50: privateKey.substring(0, 50),
      keyStartsCorrectly,
      keyHasNewlines,
    });
  }

  // Step 5: Try verifyIdToken com token dummy para confirmar que o auth funciona
  let authModuleOk = false;
  try {
    await getAuth(getApp()).verifyIdToken('dummy-token-for-test');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    authModuleOk = msg.includes('Decoding') || msg.includes('must be a') || msg.includes('INVALID_ARGUMENT');
  }

  return res.status(200).json({
    ok: true,
    step: 'all_passed',
    authModuleOk,
    projectId: projectId ?? null,
    source,
    parsedKeys: Object.keys(parsed),
    hasType: !!parsed.type,
    privateKeyLen: privateKey.length,
    keyStartsCorrectly,
    keyHasNewlines,
  });
}
