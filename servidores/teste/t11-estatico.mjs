// Comparação lado a lado: o programa estático que os seis sites usavam (referência, cópia exata
// do que estava implantado) x os pacotes novos. Para tudo que não é rota de servidor, as respostas
// têm de ser idênticas: código, tipo, cabeçalhos e conteúdo.
import { Miniflare, Response } from 'miniflare';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { criarAmbiente, SITES, DOMINIO } from './ambiente.mjs';
import { assert, contador } from './util.mjs';

const CLONE = process.env.CLONE || '/home/claude/site-portal';
const { passo, fim } = contador('estático: novo x anterior');
const saida = async request => {
  const url = new URL(request.url);
  const m = /^\/[^/]+\/[^/]+\/main\/(.*)$/.exec(decodeURIComponent(url.pathname));
  if (url.hostname !== 'raw.githubusercontent.com' || !m) return new Response('404: Not Found', { status: 404 });
  try { const corpo = await readFile(path.join(CLONE, m[1])); return new Response(request.method === 'HEAD' ? null : corpo, { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', etag: '"teste"' } }); }
  catch { return new Response('404: Not Found', { status: 404 }); }
};
// SITES_TESTE=a,b limita os sites (útil quando falta o código original de algum deles).
const nomes = process.env.SITES_TESTE ? process.env.SITES_TESTE.split(',') : Object.keys(SITES);
const ref = new Miniflare({ cachePersist: false, workers: nomes.map(n => ({ name: 'ref-' + n, modules: true, scriptPath: new URL('./estatico-v2-referencia.js', import.meta.url).pathname, compatibilityDate: '2025-01-01', routes: [n + '.' + DOMINIO + '/*'], bindings: { REPO: 'iagochaves3-cell/site-portal', REF: 'main/sites/' + n }, outboundService: saida })) });
const novo = await criarAmbiente({ sites: nomes });
async function listar(dir, base = '') { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = base + '/' + e.name; if (e.isDirectory()) out.push(...await listar(path.join(dir, e.name), p)); else out.push(p); } return out; }
const resumo = async r => ({ status: r.status, tipo: r.headers.get('content-type'), cache: r.headers.get('cache-control'), nosniff: r.headers.get('x-content-type-options'), referrer: r.headers.get('referrer-policy'), etag: r.headers.get('etag'), local: r.headers.get('location'), sha: createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex') });
try {
  for (const n of nomes) {
    await passo(n + ': todos os arquivos e casos de borda respondem igual', async () => {
      const arquivos = await listar(path.join(CLONE, 'sites', n));
      const extras = ['/', '/index.html', '/pedwb', '/pedwb/', '/nao-existe', '/nao-existe.js', '/nao/existe/', '/_next', '/_next/static', '/%2e%2e/segredo', '/a/../b', '/.git/config', '/%E0%A4%A', '/index.html?x=1', '/favicon.ico', '/robots.txt', '/api', '/api/', '/apis/x', '/api/nao-existe', '/signin', '/callbacks'];
      let total = 0;
      for (const caminho of [...arquivos, ...extras]) for (const method of caminho === '/' || extras.includes(caminho) ? ['GET', 'HEAD', 'POST'] : ['GET']) {
        const url = 'https://' + n + '.' + DOMINIO + caminho.split('/').map((s, i) => i === 0 || caminho.startsWith('/%') || caminho.includes('?') ? s : encodeURIComponent(s)).join('/');
        const [a, b] = await Promise.all([ref.dispatchFetch(url, { method, redirect: 'manual' }), novo.mf.dispatchFetch(url, { method, redirect: 'manual' })]);
        assert.deepEqual(await resumo(b), await resumo(a), method + ' ' + caminho);
        total++;
      }
      console.log('     ' + total + ' respostas comparadas (' + arquivos.length + ' arquivos)');
    });
  }
} finally { await ref.dispose(); await novo.fechar(); }
fim();
