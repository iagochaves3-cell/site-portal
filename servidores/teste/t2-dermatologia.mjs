import { criarAmbiente, CHAVE, DOMINIO } from './ambiente.mjs';
import { assert, contador, jpegMinimo, identidadeFalsa } from './util.mjs';

const S = 'dermatologia', { passo, fim } = contador(S);
const paciente = { years: '6', months: '', days: '', weight: '20', comorbidities: [], family: [], allergyStatus: 'unknown', allergies: '', medicines: '', pregnancy: 'unknown', description: 'Placas eritematosas pruriginosas em flexuras há 3 semanas.', duration: 'subacute', distribution: 'symmetric', site: '', features: [], redFlags: [] };
const saidaIA = { summary: 'Quadro compatível com dermatite inflamatória em flexuras.', images: [{ number: 1, quality: 'limited', findings: 'Imagem de teste sem lesão avaliável.', limitations: 'Arquivo mínimo de teste.' }], diagnoses: [], associations: [], alerts: [], questions: ['Há história de atopia?'], limitations: ['Teste automatizado.'] };
const openai = async () => ({ status: 200, json: { id: 'resp_teste', status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(saidaIA) }] }] } });

const a = await criarAmbiente({ sites: [S], openai });
try {
  const origin = a.origem(S);
  await passo('página inicial continua vindo do repositório', async () => {
    const r = await a.pedir(S, '/'); const t = await r.text();
    assert.equal(r.status, 200); assert.match(r.headers.get('content-type'), /text\/html/); assert.ok(t.length > 5000); assert.equal(r.headers.get('cache-control'), 'public, max-age=300');
  });
  await passo('arquivo estático e 404 como antes', async () => {
    const r = await a.pedir(S, '/nao-existe.js'); assert.equal(r.status, 404); assert.equal(await r.text(), 'Pagina nao encontrada');
    const p = await a.pedir(S, '/', { method: 'POST' }); assert.equal(p.status, 405); await p.text();
  });
  await passo('sem entrada: 401 com a mensagem original', async () => {
    const r = await a.pedir(S, '/api/analyze'); assert.equal(r.status, 401);
    assert.deepEqual(await r.json(), { configured: false, error: 'Entre no site com sua conta para consultar a conexão.' });
  });
  await passo('identidade forjada em cabeçalho é descartada', async () => {
    const r = await a.pedir(S, '/api/analyze', { headers: identidadeFalsa }); assert.equal(r.status, 401); await r.text();
    const p = await a.pedir(S, '/api/analyze', { method: 'POST', headers: { ...identidadeFalsa, origin, 'content-type': 'application/json' }, body: JSON.stringify({ patient: paciente, images: [] }) });
    assert.equal(p.status, 401); await p.text(); assert.equal(a.registro.openai.length, 0);
  });
  await passo('"Entrar com ChatGPT" leva à entrada por senha e volta ao site', async () => {
    const r = await a.pedir(S, '/signin-with-chatgpt?return_to=%2F'); assert.equal(r.status, 302);
    assert.equal(r.headers.get('location'), 'https://acesso-sites.' + DOMINIO + '/?return_to=' + encodeURIComponent(origin + '/'));
    const x = await a.pedir(S, '/signin-with-chatgpt?return_to=' + encodeURIComponent('https://exemplo.com/')); assert.equal(x.headers.get('location'), 'https://acesso-sites.' + DOMINIO + '/?return_to=' + encodeURIComponent(origin + '/'));
    const s = await a.pedir(S, '/signout-with-chatgpt'); assert.match(s.headers.get('location'), /\/sair\?return_to=/);
  });
  const { cookie } = await a.entrar();
  await passo('com entrada: conexão configurada', async () => {
    const r = await a.pedir(S, '/api/analyze', { cookie }); assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { configured: true, provider: 'OpenAI', imageAnalysis: true });
    assert.match(r.headers.get('cache-control'), /no-store/);
  });
  await passo('POST sem Origin do próprio site é recusado', async () => {
    const r = await a.pedir(S, '/api/analyze', { method: 'POST', cookie, headers: { 'content-type': 'application/json' }, body: '{}' }); assert.equal(r.status, 403); await r.text();
  });
  await passo('análise completa: pedido chega à OpenAI com a chave e o modelo originais', async () => {
    const r = await a.pedir(S, '/api/analyze', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ patient: paciente, images: [{ dataUrl: jpegMinimo }] }) });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j));
    assert.equal(j.result.summary, saidaIA.summary); assert.equal(j.result.model, 'gpt-5.4-2026-03-05'); assert.equal(j.result.imageCount, 1);
    const p = a.registro.openai.at(-1); assert.equal(p.caminho, '/v1/responses'); assert.equal(p.autorizacao, 'Bearer ' + CHAVE);
    const corpo = JSON.parse(p.corpo); assert.equal(corpo.model, 'gpt-5.4-2026-03-05'); assert.equal(corpo.store, false); assert.equal(corpo.input[0].content.at(-1).image_url, jpegMinimo);
  });
  await passo('dados inválidos -> 400, sem chamada à OpenAI', async () => {
    const antes = a.registro.openai.length;
    const r = await a.pedir(S, '/api/analyze', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ patient: { ...paciente, extra: 1 }, images: [] }) });
    assert.equal(r.status, 400); await r.text(); assert.equal(a.registro.openai.length, antes);
  });
  await passo('método não previsto -> 405', async () => {
    const r = await a.pedir(S, '/api/analyze', { method: 'DELETE', cookie }); assert.equal(r.status, 405); assert.equal(r.headers.get('allow'), 'GET, HEAD, OPTIONS, POST'); await r.text();
  });
} finally { await a.fechar(); }

const b = await criarAmbiente({ sites: [S], semChave: true });
try {
  const { cookie } = await b.entrar();
  await passo('sem chave: site avisa que a IA não está ativada', async () => {
    const r = await b.pedir(S, '/api/analyze', { cookie }); assert.deepEqual(await r.json(), { configured: false, provider: 'OpenAI', imageAnalysis: false });
    const p = await b.pedir(S, '/api/analyze', { method: 'POST', cookie, headers: { origin: b.origem(S), 'content-type': 'application/json' }, body: JSON.stringify({ patient: paciente, images: [] }) });
    assert.equal(p.status, 503); assert.match((await p.json()).error, /ainda não ativada/);
  });
} finally { await b.fechar(); }
fim();
