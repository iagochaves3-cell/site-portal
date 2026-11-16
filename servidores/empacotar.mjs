// Prepara os pacotes para transporte até a Cloudflare: gzip + AES-256-GCM.
// O repositório é público; o que vai para o ramo de transporte é só texto cifrado.
// Formato de cada arquivo: IV (12 bytes) + texto cifrado + marca de autenticação (16 bytes).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { existsSync } from 'node:fs';

const destino = process.argv[2];
const arquivoChave = new URL('./.chave-transporte', import.meta.url).pathname;
if (!existsSync(arquivoChave)) await writeFile(arquivoChave, randomBytes(32).toString('hex'), { mode: 0o600 });
const chave = Buffer.from((await readFile(arquivoChave, 'utf8')).trim(), 'hex');
const resumo = JSON.parse(await readFile(new URL('./dist/resumo.json', import.meta.url), 'utf8'));
await mkdir(destino, { recursive: true });
const indice = {};
for (const { nome, sha256, bytes } of resumo) {
  const claro = await readFile(new URL(`./dist/${nome}.js`, import.meta.url));
  if (createHash('sha256').update(claro).digest('hex') !== sha256) throw new Error('resumo desatualizado: ' + nome);
  const iv = randomBytes(12), cifra = createCipheriv('aes-256-gcm', chave, iv);
  const corpo = Buffer.concat([iv, cifra.update(gzipSync(claro, { level: 9 })), cifra.final(), cifra.getAuthTag()]);
  await writeFile(`${destino}/${nome}.bin`, corpo);
  indice[nome] = { sha256, bytes, pacote: corpo.length, sha256_pacote: createHash('sha256').update(corpo).digest('hex') };
}
await writeFile(new URL('./dist/indice-transporte.json', import.meta.url), JSON.stringify(indice, null, 1));
for (const [n, i] of Object.entries(indice)) console.log(n.padEnd(30), String(i.bytes).padStart(8), '->', String(i.pacote).padStart(7), 'bytes cifrados');
