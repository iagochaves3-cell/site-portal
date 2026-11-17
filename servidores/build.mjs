// Monta os Workers: adaptador + código original de servidor de cada site.
// Uso: node build.mjs [site ...]
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PKG = process.env.PACOTES || '/home/claude/src/pkg';
const SRC = path.join(AQUI, 'src');
const FONTES = {
  'dermatologia': path.join(PKG, 'dermatologia/dermatologia/source'),
  'abordagem-clinica': path.join(PKG, 'abordagem-clinica/abordagem-clinica/source'),
  'guideliness': path.join(PKG, 'guideliness/guideliness/source'),
  'laboratorioeradiografia': path.join(PKG, 'laboratorioeradiografia/laboratorioeradiografia/codigo_publicado'),
  'revisao-pediatrica-continua': path.join(PKG, 'revisao-pediatrica-continua'),
  'atlas-preservacao': path.join(PKG, 'atlas-preservacao'),
  'prescricao-integral': path.join(PKG, 'prescricao-integral/prescricao-integral/codigo_publicado'),
};

const substitutos = {
  name: 'substitutos',
  setup(b) {
    const doAdaptador = importador => importador.startsWith(SRC + path.sep);
    b.onResolve({ filter: /^cloudflare:workers$/ }, a => doAdaptador(a.importer)
      ? { path: a.path, external: true }
      : { path: path.join(SRC, 'shims/cloudflare-workers.mjs') });
    b.onResolve({ filter: /^next\/headers$/ }, () => ({ path: path.join(SRC, 'shims/next-headers.mjs') }));
    b.onResolve({ filter: /^next\/navigation$/ }, () => ({ path: path.join(SRC, 'shims/next-navigation.mjs') }));
    // import texto from "arquivo.txt?raw"  (recurso do Vite usado pelos sites)
    b.onResolve({ filter: /\?raw$/ }, a => ({ path: path.resolve(a.resolveDir, a.path.replace(/\?raw$/, '')), namespace: 'texto' }));
    b.onLoad({ filter: /.*/, namespace: 'texto' }, async a => ({ contents: await readFile(a.path, 'utf8'), loader: 'text' }));
    b.onResolve({ filter: /^fonte:/ }, a => {
      const [, site, resto] = /^fonte:([^/]+)\/(.*)$/.exec(a.path);
      return { path: path.join(FONTES[site], resto) };
    });
  },
};

async function montar(nome, entrada) {
  const saida = path.join(AQUI, 'dist', nome + '.js');
  const r = await build({
    entryPoints: [entrada], outfile: saida, bundle: true, format: 'esm', platform: 'neutral', target: 'es2022',
    mainFields: ['module', 'main'], conditions: ['workerd', 'worker', 'import', 'default'],
    nodePaths: [path.join(AQUI, 'node_modules')],
    external: ['node:*', 'cloudflare:*'],
    plugins: [substitutos], legalComments: 'none', charset: 'utf8', metafile: true, logLevel: 'warning',
    define: { 'import.meta.env.DEV': 'false' },
  });
  const texto = await readFile(saida);
  const entradas = Object.keys(r.metafile.inputs);
  return { nome, bytes: texto.length, sha256: createHash('sha256').update(texto).digest('hex'), arquivos: entradas.length,
    fontes: entradas.filter(e => !e.includes('node_modules') && !e.startsWith('src/')).length };
}

const alvos = process.argv.slice(2);
const todos = ['acesso-sites', ...Object.keys(FONTES)];
await mkdir(path.join(AQUI, 'dist'), { recursive: true });
const resumo = [];
for (const nome of (alvos.length ? alvos : todos)) {
  const entrada = nome === 'acesso-sites' ? path.join(SRC, 'acesso/worker.mjs') : path.join(SRC, 'sites', nome + '.mjs');
  resumo.push(await montar(nome, entrada));
}
await writeFile(path.join(AQUI, 'dist', 'resumo.json'), JSON.stringify(resumo, null, 1));
for (const r of resumo) console.log(r.nome.padEnd(30), String(r.bytes).padStart(9), 'bytes', r.sha256.slice(0, 16), `(${r.arquivos} módulos, ${r.fontes} do site)`);
