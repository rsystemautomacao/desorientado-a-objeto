/**
 * Gera o valor em UMA LINHA para colar no Vercel em FIREBASE_SERVICE_ACCOUNT_JSON.
 * Uso: node scripts/vercel-env-service-account.js "C:\Users\richa\Downloads\sua-chave.json"
 */
import fs from 'fs';
const path = process.argv[2];
if (!path) {
  console.error('Uso: node scripts/vercel-env-service-account.js "C:\\caminho\\para\\sua-chave.json"');
  process.exit(1);
}
const json = fs.readFileSync(path, 'utf8');
const parsed = JSON.parse(json);
console.log(JSON.stringify(parsed));
