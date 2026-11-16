import { criarAmbiente, CHAVE } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'abordagem-clinica', { passo, fim } = contador(S);
let chamadas = 0;
const openai = async () => {
  chamadas++;
  if (chamadas % 2 === 1) return { json: { status: 'completed', output: [{ type: 'web_search_call', status: 'completed', action: { sources: [{ url: 'https://www.sbp.com.br/documento-teste', title: 'SBP — documento de teste' }] } }] } };
  return { json: { status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Fundamentação resumida de teste, com fonte SBP.\n\nLimitações: teste automatizado.\n<<<BLOCO_FINAL_NAO_APLICAVEL>>>', annotations: [] }] }] } };
};
const corpo = JSON.stringify({ messages: [{ role: 'user', content: 'Bronquiolite viral aguda' }], mode: 'Resumo de plantão', context: { population: 'Pediátrica', age: '6 meses', weight: '7,5' } });

const a = await criarAmbiente({ sites: [S], openai });
try {
  const origin = a.origem(S), h = { origin, 'content-type': 'application/json' };
  await passo('página inicial', async () => { const r = await a.pedir(S, '/'); assert.equal(r.status, 200); assert.ok((await r.text()).length > 2000); });
  await passo('/api/status público, com chave e proteção ativas', async () => {
    const j = await (await a.pedir(S, '/api/status')).json();
    assert.equal(j.configured, true); assert.equal(j.protection, true); assert.equal(j.version, '1.1.3'); assert.deepEqual(j.knowledge, { enabled: true, runs: 0, topics: 0, lastUpdate: null });
  });
  await passo('chat sem entrada: 401, nada enviado à OpenAI', async () => {
    const r = await a.pedir(S, '/api/chat', { method: 'POST', headers: { ...h, ...identidadeFalsa }, body: corpo });
    const j = await r.json(); assert.equal(r.status, 401); assert.equal(j.code, 'acesso_restrito'); assert.match(j.error, /acesso-sites\.sites-pediatria\.workers\.dev/); assert.equal(a.registro.openai.length, 0);
  });
  const { cookie } = await a.entrar();
  await passo('chat com entrada: pesquisa, revisão e gravação no banco', async () => {
    const r = await a.pedir(S, '/api/chat', { method: 'POST', cookie, headers: h, body: corpo });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j));
    assert.match(j.text, /Fundamentação resumida/); assert.equal(j.sources[0].url, 'https://www.sbp.com.br/documento-teste'); assert.equal(j.persisted, true); assert.equal(j.priorVersions, 0); assert.equal(j.finalOutput.status, 'not-applicable');
    assert.equal(a.registro.openai.length, 2); assert.ok(a.registro.openai.every(p => p.autorizacao === 'Bearer ' + CHAVE));
    const p = JSON.parse(a.registro.openai[0].corpo); assert.equal(p.model, 'gpt-6.1-sol'); assert.equal(p.tools[0].type, 'web_search');
    const k = (await (await a.pedir(S, '/api/status')).json()).knowledge; assert.equal(k.runs, 1); assert.equal(k.topics, 1);
  });
  await passo('limite original de 8 consultas por hora continua valendo', async () => {
    let ultimo;
    for (let i = 0; i < 8; i++) { ultimo = await a.pedir(S, '/api/chat', { method: 'POST', cookie, headers: h, body: corpo }); if (i < 7) await ultimo.text(); }
    const j = await ultimo.json(); assert.equal(ultimo.status, 429); assert.equal(j.code, 'RATE_LIMIT_EXCEEDED');
  });
  await passo('origem diferente é recusada', async () => {
    const r = await a.pedir(S, '/api/chat', { method: 'POST', cookie, headers: { ...h, origin: 'https://exemplo.com' }, body: corpo }); assert.equal(r.status, 403); await r.text();
  });
} finally { await a.fechar(); }

const b = await criarAmbiente({ sites: [S], openai, acessoIA: 'aberto' });
try {
  await passo('ACESSO_IA=aberto reproduz o site original (sem senha, com limite)', async () => {
    const antes = b.registro.openai.length;
    const r = await b.pedir(S, '/api/chat', { method: 'POST', headers: { origin: b.origem(S), 'content-type': 'application/json' }, body: corpo });
    assert.equal(r.status, 200); await r.text(); assert.equal(b.registro.openai.length, antes + 2);
  });
} finally { await b.fechar(); }

const c = await criarAmbiente({ sites: [S], semChave: true });
try {
  const { cookie } = await c.entrar();
  await passo('sem chave: estado "aguardando conexão"', async () => {
    assert.equal((await (await c.pedir(S, '/api/status')).json()).configured, false);
    const r = await c.pedir(S, '/api/chat', { method: 'POST', cookie, headers: { origin: c.origem(S), 'content-type': 'application/json' }, body: corpo });
    assert.equal(r.status, 503); assert.equal((await r.json()).code, 'AI_NOT_CONFIGURED');
  });
} finally { await c.fechar(); }
fim();
