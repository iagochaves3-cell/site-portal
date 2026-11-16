import { criarAmbiente, CHAVE } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'guideliness', { passo, fim } = contador(S);
const fonte = 'https://www.sbp.com.br/protocolo-teste';
const protocolo = {
  title: 'Bronquiolite viral aguda', summary: 'Resumo de teste.', alerts: ['Alerta de teste'],
  sections: Array.from({ length: 25 }, (_, i) => ({ number: i + 1, points: ['Ponto do domínio ' + (i + 1)], source_ids: [1] })),
  medications: [{ name: 'Paracetamol', indication: 'Febre', regimen: '15 mg/kg/dose a cada 6 h', route: 'VO', presentation: 'Solução oral 200 mg/mL', preparation: 'Não se aplica', monitoring: 'Clínica', contraindications: 'Hipersensibilidade', renal_hepatic: 'Cautela em hepatopatia', off_label: 'Em bula', source_ids: [1],
    calculation: { basis: 'mg/kg/dose', dose: 15, absolute_max: 750, daily_max: 3000, doses_per_day: 4, stock_per_ml: 200, final_per_ml: null, duration_minutes: null, source_ids: [1] } }],
  sources: [{ id: 1, title: 'Protocolo de teste', url: fonte, publisher: 'SBP', date: '2026' }],
  limitations: ['Teste automatizado.'], review: { clinical: 'Conferência clínica de teste.', pharmaceutical: 'Conferência farmacêutica de teste.' },
};
const concluida = id => ({ id, status: 'completed', output: [{ type: 'web_search_call', status: 'completed', action: { sources: [{ url: fonte }] } }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(protocolo) }] }] });
let criadas = 0, andamento = true;
const openai = async p => {
  if (p.metodo === 'POST' && p.caminho === '/v1/responses') { criadas++; return { json: { id: 'resp_' + criadas, status: 'queued' } }; }
  if (p.metodo === 'GET') { const id = p.caminho.split('/').pop(); return { json: andamento ? { id, status: 'in_progress' } : concluida(id) }; }
  return { json: { id: 'x', status: 'cancelled' } };
};
const args = { diagnostico: 'Bronquiolite viral aguda', modo: 'Protocolo completo', populacao: 'Pediátrica', idade: '6 meses', cenario: 'Pronto-socorro', contexto_clinico: '', foco_especifico: '', peso_kg: 7.5 };
const nonce = '11111111-2222-4333-8444-555555555555';

const a = await criarAmbiente({ sites: [S], openai });
try {
  const origin = a.origem(S), h = { origin, 'content-type': 'application/json' };
  const post = (corpo, cookie, extra = {}) => a.pedir(S, '/api/research', { method: 'POST', cookie, headers: { ...h, ...extra }, body: JSON.stringify(corpo) });
  await passo('página inicial e arquivos do cliente', async () => {
    const r = await a.pedir(S, '/'); assert.equal(r.status, 200); await r.text();
    const m = await a.pedir(S, '/research-client.mjs'); assert.equal(m.status, 200); assert.match(m.headers.get('content-type'), /javascript/); await m.text();
  });
  await passo('pesquisa sem entrada: 401 com link de entrada', async () => {
    const r = await post({ action: 'start', args, nonce }, undefined, identidadeFalsa); const j = await r.json();
    assert.equal(r.status, 401); assert.equal(j.error, 'sign_in_required'); assert.equal(j.sign_in_url, '/signin-with-chatgpt?return_to=/'); assert.equal(a.registro.openai.length, 0);
  });
  await passo('/mcp público (somente consulta ao framework)', async () => {
    const r = await a.pedir(S, '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) });
    const j = await r.json(); assert.equal(r.status, 200); assert.deepEqual(j.result.tools.map(t => t.name), ['obter_politica_fontes', 'obter_framework_protocolos', 'montar_solicitacao_protocolo']);
    const c = await a.pedir(S, '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'obter_politica_fontes', arguments: {} } }) });
    const t = await c.text(); assert.ok(!t.includes(CHAVE)); assert.match(t, /online_research/);
  });
  const { cookie } = await a.entrar();
  let job;
  await passo('início da pesquisa: fila no banco e pedido à OpenAI em segundo plano', async () => {
    const r = await post({ action: 'start', args, nonce }, cookie); const j = await r.json();
    assert.equal(r.status, 202, JSON.stringify(j)); assert.equal(j.state, 'researching'); job = j.job_id;
    const p = a.registro.openai.at(-1); assert.equal(p.autorizacao, 'Bearer ' + CHAVE);
    const c = JSON.parse(p.corpo); assert.equal(c.model, 'gpt-5.5'); assert.equal(c.background, true); assert.equal(c.tools[0].type, 'web_search');
  });
  await passo('segunda pesquisa simultânea é barrada', async () => {
    const r = await post({ action: 'start', args, nonce: '99999999-2222-4333-8444-555555555555' }, cookie); assert.equal(r.status, 429); await r.text();
  });
  await passo('acompanhamento: em andamento -> revisão -> protocolo concluído', async () => {
    let r = await post({ action: 'poll', args, job_id: job }, cookie); assert.equal(r.status, 202); assert.equal((await r.json()).state, 'researching');
    andamento = false;
    r = await post({ action: 'poll', args, job_id: job }, cookie); let j = await r.json(); assert.equal(r.status, 202, JSON.stringify(j)); assert.equal(j.state, 'reviewing'); assert.equal(criadas, 2);
    r = await post({ action: 'poll', args, job_id: job }, cookie); j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j));
    assert.equal(j.state, 'completed'); assert.equal(j.framework_applied, true); assert.equal(j.evidence.sources, 1);
    const html = typeof j.protocol === 'string' ? j.protocol : JSON.stringify(j.protocol);
    assert.match(html, /Dose calculada: 112,5 mg por dose/);   // 15 mg/kg x 7,5 kg, calculado pelo servidor original
  });
  await passo('pesquisa de outra sessão não é visível sem entrada', async () => {
    const r = await post({ action: 'poll', args, job_id: job }); assert.equal(r.status, 401); await r.text();
  });
} finally { await a.fechar(); }

const c = await criarAmbiente({ sites: [S], semChave: true });
try {
  const { cookie } = await c.entrar();
  await passo('sem chave: "Pesquisa ainda não configurada"', async () => {
    const r = await c.pedir(S, '/api/research', { method: 'POST', cookie, headers: { origin: c.origem(S), 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', args, nonce }) });
    const j = await r.json(); assert.equal(r.status, 503); assert.equal(j.error, 'not_configured');
  });
} finally { await c.fechar(); }
fim();
