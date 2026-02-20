/**
 * Gera partes de ~500 chars cada para as env vars do Vercel.
 * Partes menores evitam truncamento silencioso do Vercel.
 *
 * Uso: node scripts/vercel-env-service-account-b64-parts.js "C:\Users\richa\Downloads\sua-chave.json"
 */
import fs from 'fs';
const filePath = process.argv[2];
if (!filePath) {
  console.error('Uso: node scripts/vercel-env-service-account-b64-parts.js "C:\\caminho\\para\\sua-chave.json"');
  process.exit(1);
}
const json = fs.readFileSync(filePath, 'utf8');

// Valida que eh um JSON valido antes de codificar
try {
  const parsed = JSON.parse(json);
  if (!parsed.private_key || !parsed.client_email) {
    console.error('AVISO: O JSON nao parece ser uma Service Account valida (falta private_key ou client_email).');
  }
} catch {
  console.error('ERRO: O arquivo nao contem JSON valido.');
  process.exit(1);
}

const b64 = Buffer.from(json, 'utf8').toString('base64');
const PART_LEN = 500;
const parts = [];
for (let i = 0; i < b64.length; i += PART_LEN) {
  parts.push(b64.slice(i, i + PART_LEN));
}

process.stderr.write(`\nBase64 total: ${b64.length} chars, dividido em ${parts.length} partes de ate ${PART_LEN} chars.\n`);
process.stderr.write(`\nCrie as seguintes variaveis no Vercel (Settings > Environment Variables):\n\n`);

parts.forEach((part, i) => {
  const name = `FIREBASE_SERVICE_ACCOUNT_B64_PART${i + 1}`;
  process.stderr.write(`${name} (${part.length} chars):\n`);
  console.log(part);
  process.stderr.write('\n');
});

// Verifica se a decodificacao funciona
const reconstructed = parts.join('');
try {
  const decoded = Buffer.from(reconstructed, 'base64').toString('utf8');
  JSON.parse(decoded);
  process.stderr.write(`Verificacao: OK - ${parts.length} partes concatenadas geram JSON valido.\n`);
} catch (e) {
  process.stderr.write(`ERRO na verificacao: ${e instanceof Error ? e.message : e}\n`);
  process.exit(1);
}

// Remove variaveis antigas que nao sao mais necessarias
if (parts.length < 8) {
  process.stderr.write(`\nIMPORTANTE: Se voce tinha mais partes antes, REMOVA as variaveis PART${parts.length + 1} em diante do Vercel!\n`);
}
process.stderr.write('\nApos adicionar, faca Redeploy no Vercel.\n');
