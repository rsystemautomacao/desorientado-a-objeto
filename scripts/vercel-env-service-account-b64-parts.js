/**
 * Gera TRES linhas (PART1, PART2, PART3) de ~1200 chars cada para o Vercel
 * (PART2 estava truncando; 3 partes menores evitam isso).
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
const PART_LEN = 1200;
const part1 = b64.slice(0, PART_LEN);
const part2 = b64.slice(PART_LEN, PART_LEN * 2);
const part3 = b64.slice(PART_LEN * 2);
process.stderr.write('Abaixo: linha 1 = PART1, linha 2 = PART2, linha 3 = PART3. Crie as 3 variaveis no Vercel (FIREBASE_SERVICE_ACCOUNT_B64_PART1, PART2, PART3).\n\n');
console.log(part1);
console.log(part2);
console.log(part3);
