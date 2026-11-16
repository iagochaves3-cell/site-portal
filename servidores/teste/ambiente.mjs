// Ambiente local de teste: os mesmos pacotes que vão para a Cloudflare rodam no workerd
// (Miniflare), com banco D1 e KV locais. As saídas para a internet são interceptadas:
//   raw.githubusercontent.com -> arquivos do clone local do repositório
//   api.openai.com            -> simulador controlado pelo teste
import { Miniflare, Response } from 'miniflare';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const DOMINIO = 'sites-pediatria.workers.dev';
export const SENHA = 'senha-de-teste-2026';
export const CHAVE = 'sk-teste-' + 'a'.repeat(40);
const REPO = 'iagochaves3-cell/site-portal';
const CLONE = process.env.CLONE || '/home/claude/site-portal';
const PKG = process.env.PACOTES || '/home/claude/src/pkg';
const DIST = new URL('../dist/', import.meta.url).pathname;

export const SITES = {
  'dermatologia': {},
  'abordagem-clinica': { d1: true, migracoes: ['abordagem-clinica/abordagem-clinica/source/drizzle/0000_ancient_terrax.sql', 'abordagem-clinica/abordagem-clinica/source/drizzle/0001_high_carmella_unuscione.sql'], segredos: { AI_RATE_LIMIT_SALT: 'sal-de-teste-123456' } },
  'guideliness': { d1: true, migracoes: ['guideliness/guideliness/source/dist/.openai/drizzle/0000_skinny_paibok.sql', 'guideliness/guideliness/source/dist/.openai/drizzle/0001_careless_lilandra.sql'] },
  'laboratorioeradiografia': { kv: true },
  'revisao-pediatrica-continua': { d1: true, migracoes: ['revisao-pediatrica-continua/drizzle/0000_cooing_satana.sql'] },
  'atlas-preservacao': { d1: true, migracoes: ['atlas-preservacao/drizzle/0000_strong_jane_foster.sql'] },
  'prescricao-integral': { d1: true, migracoes: ['prescricao-integral/prescricao-integral/codigo_publicado/drizzle/0000_dear_dakota_north.sql', 'prescricao-integral/prescricao-integral/codigo_publicado/drizzle/0001_easy_norman_osborn.sql'], segredos: { WHATSAPP_DATA_KEY: '0123456789abcdef'.repeat(4) } },
};
export const SQL_ACESSO = 'CREATE TABLE IF NOT EXISTS tentativas (id TEXT PRIMARY KEY NOT NULL, janela TEXT NOT NULL, total INTEGER NOT NULL DEFAULT 0, atualizado TEXT NOT NULL)';

export function comandos(sql) {
  return sql.split('--> statement-breakpoint').flatMap(bloco => bloco.split(/;\s*(?=CREATE |ALTER |DROP |INSERT )/i)).map(s => s.trim().replace(/;$/, '')).filter(Boolean);
}

export async function criarAmbiente({ openai, semChave = false, semSenha = false, acessoIA = 'senha', sites = Object.keys(SITES), porta = 0 } = {}) {
  const registro = { openai: [], github: [] };
  const saida = async request => {
    const url = new URL(request.url);
    if (url.hostname === 'raw.githubusercontent.com') {
      registro.github.push(url.pathname);
      const m = /^\/[^/]+\/[^/]+\/main\/(.*)$/.exec(decodeURIComponent(url.pathname));
      if (!m) return new Response('404: Not Found', { status: 404 });
      try {
        const corpo = await readFile(path.join(CLONE, m[1]));
        return new Response(request.method === 'HEAD' ? null : corpo, { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', etag: '"teste"' } });
      } catch { return new Response('404: Not Found', { status: 404 }); }
    }
    if (url.hostname === 'api.openai.com') {
      const corpo = request.method === 'GET' ? null : await request.text();
      const item = { metodo: request.method, caminho: url.pathname, autorizacao: request.headers.get('authorization'), corpo };
      registro.openai.push(item);
      const r = openai ? await openai(item) : { status: 500, json: { error: { message: 'sem simulador' } } };
      return new Response(JSON.stringify(r.json), { status: r.status || 200, headers: { 'content-type': 'application/json' } });
    }
    return new Response('saida bloqueada no teste: ' + url.hostname, { status: 599 });
  };
  const base = { modules: true, compatibilityDate: '2026-05-15', compatibilityFlags: ['nodejs_compat'], outboundService: saida };
  const workers = [{
    ...base, name: 'acesso-sites', scriptPath: DIST + 'acesso-sites.js', routes: ['acesso-sites.' + DOMINIO + '/*'],
    bindings: { OPENAI_API_KEY: semChave ? 'PENDENTE' : CHAVE, SENHA_DE_ACESSO: semSenha ? 'PENDENTE' : SENHA, SEGREDO_SESSAO: 'segredo-de-sessao-de-teste-0123456789', DOMINIO },
    d1Databases: { DB: 'acesso' },
  }];
  for (const nome of sites) {
    const s = SITES[nome];
    workers.push({
      ...base, name: nome, scriptPath: DIST + nome + '.js', routes: [nome + '.' + DOMINIO + '/*'],
      bindings: { REPO, REF: 'main/sites/' + nome, ACESSO_URL: 'https://acesso-sites.' + DOMINIO, ACESSO_IA: acessoIA, ...(s.segredos || {}) },
      serviceBindings: { ACESSO: { name: 'acesso-sites', entrypoint: 'Interno' } },
      ...(s.d1 ? { d1Databases: { DB: 'db-' + nome } } : {}),
      ...(s.kv ? { kvNamespaces: { ENVIOS: 'envios-' + nome } } : {}),
    });
  }
  const mf = new Miniflare({ workers, cachePersist: false, d1Persist: false, kvPersist: false, verbose: false, ...(porta ? { https: true, host: '127.0.0.1', port: porta } : {}) });
  await mf.ready;
  await (await mf.getD1Database('DB', 'acesso-sites')).prepare(SQL_ACESSO).run();
  for (const nome of sites) {
    const s = SITES[nome];
    if (!s.d1) continue;
    const db = await mf.getD1Database('DB', nome);
    for (const arquivo of s.migracoes) for (const c of comandos(await readFile(path.join(PKG, arquivo), 'utf8'))) await db.prepare(c).run();
  }
  const origem = nome => 'https://' + nome + '.' + DOMINIO;
  // Faz uma requisição como um navegador faria (sem seguir redirecionamentos).
  const pedir = (nome, caminho, { method = 'GET', headers = {}, body, cookie } = {}) => mf.dispatchFetch(origem(nome) + caminho, {
    method, body, redirect: 'manual', headers: { ...(cookie ? { cookie } : {}), ...headers }, ...(body && typeof body !== 'string' ? { duplex: 'half' } : {}),
  });
  async function entrar(senha = SENHA, destino = '') {
    const r = await pedir('acesso-sites', '/entrar', { method: 'POST', headers: { origin: origem('acesso-sites'), 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ senha, return_to: destino }).toString() });
    const cabecalho = r.headers.get('set-cookie') || '';
    await r.arrayBuffer();
    return { status: r.status, local: r.headers.get('location'), cabecalho, cookie: cabecalho.split(';')[0] };
  }
  return { mf, registro, origem, pedir, entrar, fechar: () => mf.dispose() };
}
