// Casos que os arquivos publicados não cobrem: tipos xlsx/docx/gz/traineddata e a colisão
// "nome.html" x "nome/index.html". Compara o programa anterior (referência) com o módulo
// estático do adaptador (src/estatico.mjs), servindo uma árvore de arquivos sintética.
import { Miniflare, Response } from 'miniflare';
import { build } from 'esbuild';
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { assert, contador } from './util.mjs';

const { passo, fim } = contador('estático: casos sintéticos');
const raiz = await mkdtemp(path.join(os.tmpdir(), 'casos-'));
const arquivos = {
  'index.html': '<!doctype html><title>raiz</title>',
  'planilha.xlsx': 'PK\u0003\u0004 planilha', 'documento.docx': 'PK\u0003\u0004 documento',
  'dados.json.gz': '\u001f\u008b comprimido', 'modelo.traineddata': 'ocr',
  'pagina.html': '<p>arquivo pagina.html</p>', 'pagina/index.html': '<p>pasta pagina/</p>',
  'so-pasta/index.html': '<p>só pasta</p>', 'so-arquivo.html': '<p>só arquivo</p>',
  'MAIUSCULA.XLSX': 'PK', 'sem-extensao': 'x',
};
for (const [n, c] of Object.entries(arquivos)) { await mkdir(path.dirname(path.join(raiz, n)), { recursive: true }); await writeFile(path.join(raiz, n), c, 'latin1'); }
const saida = async request => {
  const url = new URL(request.url);
  const m = /^\/[^/]+\/[^/]+\/main\/casos\/(.*)$/.exec(decodeURIComponent(url.pathname));
  if (url.hostname !== 'raw.githubusercontent.com' || !m) return new Response('404: Not Found', { status: 404 });
  try { const corpo = await readFile(path.join(raiz, m[1])); return new Response(request.method === 'HEAD' ? null : corpo, { status: 200, headers: { etag: '"c"' } }); }
  catch { return new Response('404: Not Found', { status: 404 }); }
};
const aqui = path.dirname(new URL(import.meta.url).pathname);
const novoJs = (await build({ stdin: { contents: `import { servirEstatico } from ${JSON.stringify(path.join(aqui, '../src/estatico.mjs'))}; export default { fetch: servirEstatico };`, resolveDir: aqui, loader: 'js' }, bundle: true, format: 'esm', write: false, platform: 'neutral' })).outputFiles[0].text;
const base = { modules: true, compatibilityDate: '2026-05-15', bindings: { REPO: 'x/y', REF: 'main/casos' }, outboundService: saida };
const mf = new Miniflare({ cachePersist: false, workers: [
  { ...base, name: 'ref', scriptPath: path.join(aqui, 'estatico-v2-referencia.js'), routes: ['ref.local/*'] },
  { ...base, name: 'novo', script: novoJs, routes: ['novo.local/*'] },
] });
const resumo = async r => ({ status: r.status, tipo: r.headers.get('content-type'), local: (r.headers.get('location') || '').replace(/^https:\/\/[^/]+/, ''), sha: createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex') });
const pedir = async (host, c, method = 'GET') => resumo(await mf.dispatchFetch('https://' + host + c, { method, redirect: 'manual' }));
try {
  const casos = ['/planilha.xlsx', '/documento.docx', '/dados.json.gz', '/modelo.traineddata', '/MAIUSCULA.XLSX', '/sem-extensao', '/pagina', '/pagina/', '/pagina.html', '/so-pasta', '/so-pasta?x=1', '/so-arquivo', '/nada'];
  await passo('todas as respostas iguais à referência (GET e HEAD)', async () => {
    for (const c of casos) for (const m of ['GET', 'HEAD']) assert.deepEqual(await pedir('novo.local', c, m), await pedir('ref.local', c, m), m + ' ' + c);
  });
  await passo('tipos restaurados conferidos explicitamente', async () => {
    assert.equal((await pedir('novo.local', '/planilha.xlsx')).tipo, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    assert.equal((await pedir('novo.local', '/documento.docx')).tipo, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    assert.equal((await pedir('novo.local', '/dados.json.gz')).tipo, 'application/gzip');
    assert.equal((await pedir('novo.local', '/modelo.traineddata')).tipo, 'application/octet-stream');
  });
  await passo('colisão: /pagina entrega pagina.html (arquivo antes da pasta); só pasta redireciona', async () => {
    const p = await pedir('novo.local', '/pagina'); assert.equal(p.status, 200); assert.equal(p.sha, createHash('sha256').update(arquivos['pagina.html']).digest('hex'));
    const s = await pedir('novo.local', '/so-pasta?x=1'); assert.equal(s.status, 301); assert.equal(s.local, '/so-pasta/?x=1');
  });
} finally { await mf.dispose(); }
fim();
