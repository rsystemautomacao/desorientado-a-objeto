/**
 * Gera duas linhas (PART1 e PART2) para colar no Vercel quando o valor inteiro
 * em Base64 é truncado (~3164 chars). Cada parte fica abaixo do limite.
 * Uso: node scripts/vercel-env-service-account-b64-parts.js "C:\Users\richa\Downloads\sua-chave.json"
 */
import fs from 'fs';
const path = process.argv[2];
if (!path) {
  console.error('Uso: node scripts/vercel-env-service-account-b64-parts.js "C:\\caminho\\para\\sua-chave.json"');
  process.exit(1);
}
const json = fs.readFileSync(path, 'utf8');
const b64 = Buffer.from(json, 'utf8').toString('base64');
const PART_LEN = 3000;
const part1 = b64.slice(0, PART_LEN);
const part2 = b64.slice(PART_LEN);
process.stderr.write('Abaixo: linha 1 = B64_PART1, linha 2 = B64_PART2. Crie FIREBASE_SERVICE_ACCOUNT_B64_PART1 e FIREBASE_SERVICE_ACCOUNT_B64_PART2 no Vercel.\n\n');
console.log(part1);
console.log(part2);
