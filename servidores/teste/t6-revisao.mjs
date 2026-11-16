import { criarAmbiente } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'revisao-pediatrica-continua', { passo, fim } = contador(S);
const a = await criarAmbiente({ sites: [S] });
try {
  const origin = a.origem(S);
  await passo('página inicial', async () => { const r = await a.pedir(S, '/'); assert.equal(r.status, 200); await r.text(); });
  await passo('sem entrada: 401 com a mensagem original (cabeçalhos forjados ignorados)', async () => {
    const r = await a.pedir(S, '/api/workspace', { headers: identidadeFalsa }); assert.equal(r.status, 401);
    assert.deepEqual(await r.json(), { error: 'Entre com sua conta ChatGPT para acessar sua fila persistente.' });
  });
  const { cookie } = await a.entrar();
  let temas;
  await passo('com entrada: fila inicial criada e persistida no banco', async () => {
    const r = await a.pedir(S, '/api/workspace', { cookie }); const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j).slice(0, 300));
    assert.equal(j.persistent, true); assert.deepEqual(j.user, { name: 'Proprietário', id: 'proprietario' }); assert.ok(j.topics.length >= 1); temas = j.topics;
    const de_novo = await (await a.pedir(S, '/api/workspace', { cookie })).json(); assert.equal(de_novo.topics.length, temas.length); assert.deepEqual(de_novo.topics.map(t => t.id).sort(), temas.map(t => t.id).sort());
  });
  await passo('histórico de um tema', async () => {
    const r = await a.pedir(S, '/api/workspace?history=1&topicId=' + encodeURIComponent(temas[0].id), { cookie }); const j = await r.json();
    assert.equal(r.status, 200, JSON.stringify(j).slice(0, 300)); assert.ok(Array.isArray(j.history) && j.history.length >= 1);
  });
  await passo('gravação exige modo de edição explícito e origem do próprio painel', async () => {
    const corpo = JSON.stringify({ action: 'validate', topicId: temas[0].id, etag: temas[0].etag, reviewer: 'Teste', reason: 'Teste' });
    const semModo = await a.pedir(S, '/api/workspace', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json' }, body: corpo }); assert.equal(semModo.status, 403); await semModo.text();
    const fora = await a.pedir(S, '/api/workspace', { method: 'POST', cookie, headers: { origin: 'https://exemplo.com', 'content-type': 'application/json', 'x-review-edit': 'explicit' }, body: corpo }); assert.equal(fora.status, 403); await fora.text();
    const semEntrada = await a.pedir(S, '/api/workspace', { method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-review-edit': 'explicit' }, body: corpo }); assert.equal(semEntrada.status, 401); await semEntrada.text();
  });
  await passo('atualização de um tema grava nova versão (etag e histórico)', async () => {
    const t = temas[0];
    const conteudo = Object.fromEntries(['title', 'kind', 'specialty', 'priority', 'project', 'summary', 'scope', 'population', 'setting', 'owner', 'dueDate', 'status', 'evidence', 'recommendation', 'dose', 'conclusion', 'nextStep', 'references', 'blocks', 'issues', 'calculation'].map(k => [k, t[k]]));
    conteudo.summary = 'Resumo alterado pelo teste automatizado.';
    const r = await a.pedir(S, '/api/workspace', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json', 'x-review-edit': 'explicit' }, body: JSON.stringify({ action: 'update', topicId: t.id, etag: t.etag, content: conteudo, summary: 'Teste de gravação' }) });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j).slice(0, 500)); assert.equal(j.topic.summary, conteudo.summary); assert.ok(j.topic.etag > t.etag);
    const h = await (await a.pedir(S, '/api/workspace?history=1&topicId=' + encodeURIComponent(t.id), { cookie })).json(); assert.ok(h.history.length >= 2);
    const velho = await a.pedir(S, '/api/workspace', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json', 'x-review-edit': 'explicit' }, body: JSON.stringify({ action: 'update', topicId: t.id, etag: t.etag, content: conteudo, summary: 'Versão antiga' }) });
    assert.equal(velho.status, 409, 'edição sobre versão antiga é recusada'); await velho.text();
  });
} finally { await a.fechar(); }
fim();
