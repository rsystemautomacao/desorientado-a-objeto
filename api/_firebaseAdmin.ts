import * as admin from 'firebase-admin';

/**
 * Monta o Base64 completo a partir de PART1..PART8 ou da variavel unica FIREBASE_SERVICE_ACCOUNT_B64.
 * Aceita qualquer quantidade de partes (1-8).
 */
export function getB64String(): string | null {
  // Tenta juntar todas as partes existentes (PART1 a PART8)
  const partKeys = Array.from({ length: 8 }, (_, i) => `FIREBASE_SERVICE_ACCOUNT_B64_PART${i + 1}`);
  const parts: string[] = [];
  for (const key of partKeys) {
    const val = process.env[key];
    if (typeof val === 'string' && val.length > 0) {
      parts.push(val.trim());
    }
  }
  if (parts.length >= 2) {
    const joined = parts.join('').replace(/\s/g, '');
    if (joined.length > 100) return joined;
  }

  // Fallback: variavel unica
  const one = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (typeof one === 'string' && one.length > 100) {
    return one.replace(/\s/g, '');
  }

  return null;
}

/**
 * Decodifica e parseia o Service Account a partir de B64 ou JSON.
 */
export function parseServiceAccountEnv(): admin.ServiceAccount {
  const b64Raw = getB64String();
  if (b64Raw && b64Raw.length > 100) {
    try {
      let json = Buffer.from(b64Raw, 'base64').toString('utf8');
      // Remove BOM se existir
      if (json.charCodeAt(0) === 0xfeff) json = json.slice(1);
      const normalized = json.replace(/\\n/g, '\n');
      return JSON.parse(normalized) as admin.ServiceAccount;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`B64 decode/parse falhou (${b64Raw.length} chars). Erro: ${msg}`);
      // Mostra primeiros e ultimos caracteres para diagnostico
      console.error(`B64 inicio: ${b64Raw.slice(0, 20)}... fim: ...${b64Raw.slice(-20)}`);
      throw new Error(`FIREBASE_SERVICE_ACCOUNT_B64: decode/parse falhou (${b64Raw.length} chars): ${msg}`);
    }
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || typeof raw !== 'string') {
    throw new Error(
      'Nenhuma service account configurada. Defina FIREBASE_SERVICE_ACCOUNT_B64_PART1..N ou FIREBASE_SERVICE_ACCOUNT_B64 ou FIREBASE_SERVICE_ACCOUNT_JSON.'
    );
  }

  try {
    const normalized = raw.replace(/\\n/g, '\n');
    return JSON.parse(normalized) as admin.ServiceAccount;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON parse falhou:', msg);
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON invalido: ${msg}`);
  }
}

/**
 * Inicializa o Firebase Admin (singleton).
 */
export function getFirebaseAdmin(): admin.app.App {
  if (admin.apps.length > 0) return admin.app();

  const parsed = parseServiceAccountEnv();
  const sa = parsed as admin.ServiceAccount & { private_key?: string; client_email?: string; project_id?: string };

  if (!sa.private_key || !sa.client_email) {
    console.error('Service Account incompleta: falta private_key ou client_email.');
  }

  const projectId = parsed.projectId ?? sa.project_id;

  return admin.initializeApp({
    credential: admin.credential.cert(parsed),
    projectId: projectId ?? 'desorientado-a-objetos',
  });
}

/**
 * Informacoes de diagnostico sobre as env vars (para /api/auth-status).
 */
export function getEnvDiagnostics() {
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
