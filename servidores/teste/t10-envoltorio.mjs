import assert from 'node:assert/strict';
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(AQUI, '..', 'dist', 'teste-envoltorio.mjs');
await build({ entryPoints: [path.join(AQUI, '..', 'src', 'ia', 'envoltorio.mjs')], outfile: saida, bundle: true, format: 'esm', platform: 'node', plugins: [{ name: 'site', setup(b) { b.onResolve({ filter: /^\.\/worker\.js$/ }, () => ({ path: path.join(AQUI, 'site-simulado.mjs') })); } }], logLevel: 'error' });
let paraOpenAI = 0;
const fetchReal = globalThis.fetch;
const vistosOpenAI = [];
globalThis.fetch = async (u, o) => {
  if (String(u).startsWith('https://api.openai.com/')) {
    paraOpenAI++;
    const aut = new Headers(o?.headers).get('authorization') || '';
    vistosOpenAI.push({ url: String(u), aut, corpo: typeof o?.body === 'string' ? o.body : '' });
    if (aut === 'Bearer sk-sem-credito') return Response.json({ error: { type: 'insufficient_quota', code: 'insufficient_quota', message: 'sem crédito' } }, { status: 429 });
    if (aut === 'Bearer sk-rede') throw new TypeError('falha de rede simulada');
    return Response.json({ origem: 'openai' });
  }
  return fetchReal(u, o);
};
const { default: worker } = await import(pathToFileURL(saida).href + '?v=' + Date.now());
let ok = 0; const t = async (n, f) => { await f(); ok++; console.log('ok', n); };
const recebidos = [];
const IA = { fetch: async (req) => { recebidos.push({ url: req.url, corpo: await req.text(), site: req.headers.get('x-site') }); return Response.json({ origem: 'ia-sites' }); } };
const acesso = (estado) => ({ contexto: async () => ({ usuario: estado.usuario || null, chave: estado.chave || null, senha: !!estado.senha }) });
const base = { IA, IA_CHAVE_INTERNA: 'wai_interna_123', SITE_NOME: 'laboratorio' };
const req = (p) => new Request('https://lab.exemplo.dev' + p, { method: 'POST' });

await t('sem chave e sem senha: desvia para ia-sites, embute o anexo do próprio site e usa a identidade do proprietário', async () => {
  const env = { ...base, ACESSO: acesso({}) };
  const r = await (await worker.fetch(req('/api/report'), env, {})).json();
  assert.equal(r.origem, 'ia-sites'); assert.equal(paraOpenAI, 0);
  const c = JSON.parse(recebidos.at(-1).corpo);
  assert.equal(recebidos.at(-1).url, 'https://ia-sites.interno/v1/responses');
  assert.equal(recebidos.at(-1).site, 'laboratorio');
  const f = c.input[0].content[1];
  assert.equal(f.file_data, 'data:application/pdf;base64,JVBERg=='); assert.equal(f.file_url, undefined);
  const q = await (await worker.fetch(req('/quem'), env, {})).json();
  assert.equal(q.usuario.id, 'proprietario'); assert.equal(q.temChave, true);
});

await t('com chave da OpenAI do proprietário: nada é desviado', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono', senha: true, usuario: { id: 'proprietario' } }) };
  const n = recebidos.length;
  const r = await (await worker.fetch(req('/api/report'), env, {})).json();
  assert.equal(r.origem, 'openai'); assert.equal(recebidos.length, n); assert.equal(paraOpenAI, 1);
});

await t('com senha definida e sem sessão: não injeta identidade (proteção volta)', async () => {
  const env = { ...base, ACESSO: acesso({ senha: true }) };
  const q = await (await worker.fetch(req('/quem'), env, {})).json();
  assert.equal(q.usuario, null); assert.equal(q.temChave, true);
});

await t('ACESSO_LIVRE=nao e IA_ALTERNATIVA=desligada respeitados', async () => {
  const env = { ...base, ACESSO_LIVRE: 'nao', IA_ALTERNATIVA: 'desligada', ACESSO: acesso({}) };
  const q = await (await worker.fetch(req('/quem'), env, {})).json();
  assert.equal(q.usuario, null); assert.equal(q.temChave, false);
  const r = await worker.fetch(req('/api/report'), env, {});
  assert.equal(r.status, 503);
});

await t('chave forjada (diferente da interna) não é desviada', async () => {
  const env = { ...base, ACESSO: acesso({}) };
  const n = recebidos.length;
  const r = await globalThis.fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: 'Bearer wai_interna_123' }, body: '{}' });
  assert.equal((await r.json()).origem, 'openai', 'fora de uma requisição do site não há desvio');
  assert.equal(recebidos.length, n);
});

await t('chave paga com sessão: anexo do próprio site vai embutido também para a OpenAI', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono', senha: true, usuario: { id: 'proprietario' } }) };
  await worker.fetch(req('/api/report'), env, {});
  const c = JSON.parse(vistosOpenAI.at(-1).corpo);
  assert.equal(vistosOpenAI.at(-1).aut, 'Bearer sk-dono');
  assert.equal(c.input[0].content[1].file_data, 'data:application/pdf;base64,JVBERg==');
});

await t('chave paga e senha definida, sem sessão: usa a IA gratuita, nunca a chave paga', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono', senha: true }) };
  const antes = paraOpenAI;
  const r = await (await worker.fetch(req('/api/report'), env, {})).json();
  assert.equal(r.origem, 'ia-sites'); assert.equal(paraOpenAI, antes);
  const q = await (await worker.fetch(req('/quem'), env, {})).json();
  assert.equal(q.usuario, null);
});

await t('chave paga cadastrada sem senha: uso livre continua, pela IA gratuita (sem erro de senha)', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono' }) };
  const antes = paraOpenAI;
  const q = await (await worker.fetch(req('/quem'), env, {})).json();
  assert.equal(q.usuario.id, 'proprietario'); assert.equal(q.temChave, true);
  const r = await (await worker.fetch(req('/api/report'), env, {})).json();
  assert.equal(r.origem, 'ia-sites'); assert.equal(paraOpenAI, antes);
});

await t('OpenAI sem crédito (429): o mesmo pedido é refeito no ia-sites, com o anexo embutido', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-sem-credito', senha: true, usuario: { id: 'proprietario' } }) };
  const n = recebidos.length; const antes = paraOpenAI;
  const r = await worker.fetch(req('/api/report'), env, {});
  assert.equal(r.status, 200); assert.equal((await r.json()).origem, 'ia-sites');
  assert.equal(paraOpenAI, antes + 1); assert.equal(recebidos.length, n + 1);
  const c = JSON.parse(recebidos.at(-1).corpo);
  assert.equal(c.input[0].content[1].file_data, 'data:application/pdf;base64,JVBERg==');
});

await t('falha de rede na OpenAI: reserva no ia-sites', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-rede', senha: true, usuario: { id: 'proprietario' } }) };
  const r = await (await worker.fetch(req('/api/report'), env, {})).json();
  assert.equal(r.origem, 'ia-sites');
});

await t('IA_RESERVA=desligada: a recusa da OpenAI chega ao site sem reserva', async () => {
  const env = { ...base, IA_RESERVA: 'desligada', ACESSO: acesso({ chave: 'sk-sem-credito', senha: true, usuario: { id: 'proprietario' } }) };
  const n = recebidos.length;
  const r = await worker.fetch(req('/api/report'), env, {});
  assert.equal(r.status, 429); assert.equal(recebidos.length, n);
});

await t('consulta de resposta criada pela ponte (resp_wai…) com a chave paga vai ao ia-sites', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono', senha: true, usuario: { id: 'proprietario' } }) };
  const antes = paraOpenAI;
  const r = await (await worker.fetch(new Request('https://lab.exemplo.dev/api/consulta?id=resp_wai_abc', { method: 'GET' }), env, {})).json();
  assert.equal(r.origem, 'ia-sites'); assert.equal(paraOpenAI, antes);
  assert.equal(recebidos.at(-1).url, 'https://ia-sites.interno/v1/responses/resp_wai_abc');
  const r2 = await (await worker.fetch(new Request('https://lab.exemplo.dev/api/consulta?id=resp_openai_1', { method: 'GET' }), env, {})).json();
  assert.equal(r2.origem, 'openai'); assert.equal(paraOpenAI, antes + 1);
});

await t('chave paga usada em requisição sem sessão (process.env trocado por requisição simultânea): vai pela IA gratuita', async () => {
  const env = { ...base, ACESSO: acesso({ chave: 'sk-dono', senha: true }) };
  const antes = paraOpenAI; const n = recebidos.length;
  // a rota simulada lê a chave paga "de fora" do contexto da requisição
  const r = await (await worker.fetch(new Request('https://lab.exemplo.dev/api/chave-de-fora', { method: 'POST' }), env, {})).json();
  assert.equal(r.origem, 'ia-sites'); assert.equal(paraOpenAI, antes); assert.equal(recebidos.length, n + 1);
});

console.log(`\n${ok} verificações do envoltório: todas passaram.`);
