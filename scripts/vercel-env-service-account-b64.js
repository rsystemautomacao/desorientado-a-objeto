/**
 * Gera o valor em BASE64 para colar no Vercel em FIREBASE_SERVICE_ACCOUNT_B64.
 * Evita problemas de aspas/barras que o Vercel às vezes altera no JSON.
 * Uso: node scripts/vercel-env-service-account-b64.js "C:\Users\richa\Downloads\sua-chave.json"
 */
import fs from 'fs';
const path = process.argv[2];
if (!path) {
  console.error('Uso: node scripts/vercel-env-service-account-b64.js "C:\\caminho\\para\\sua-chave.json"');
  process.exit(1);
}
const json = fs.readFileSync(path, 'utf8');
const b64 = Buffer.from(json, 'utf8').toString('base64');
console.log(b64);
