import { createHash } from 'node:crypto';
import { criarAmbiente, CHAVE } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'laboratorioeradiografia', { passo, fim } = contador(S);
const PARTE = 768 * 1024;
const pdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(PARTE + 5000, 0x41), Buffer.from('\n%%EOF\n')]);   // 2 partes
const visitante = 'visitor_' + 'ab12'.repeat(8);
let estado = 'queued';
const openai = async p => {
  if (p.metodo === 'POST' && p.caminho === '/v1/responses') return { json: { id: 'resp_laudo_1', status: 'queued' } };
  if (p.metodo === 'POST' && p.caminho.endsWith('/cancel')) return { json: { id: 'resp_laudo_1', status: 'cancelled' } };
  return { json: { id: 'resp_laudo_1', status: estado } };
};

async function enviarArquivo(a, cookie, extra = {}) {
  const origin = a.origem(S), base = { origin, 'x-site-visitor-session': visitante, ...extra };
  const inicio = await a.pedir(S, '/api/upload', { method: 'POST', cookie, headers: { ...base, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', filename: 'exame.pdf', bytes: pdf.length, mime: 'application/pdf' }) });
  const ji = await inicio.json(); if (inicio.status !== 200) return { status: inicio.status, corpo: ji };
  const partes = [];
  for (let i = 0; i < ji.partCount; i++) {
    const r = await a.pedir(S, '/api/upload', { method: 'POST', cookie, headers: { ...base, 'content-type': 'application/octet-stream', 'x-upload-action': 'part', 'x-upload-token': ji.uploadToken, 'x-upload-part-index': String(i) }, body: pdf.subarray(i * PARTE, Math.min(pdf.length, (i + 1) * PARTE)) });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j)); partes.push(j.partId);
  }
  const fim = await a.pedir(S, '/api/upload', { method: 'POST', cookie, headers: { ...base, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'complete', uploadToken: ji.uploadToken, partIds: partes }) });
  return { status: fim.status, corpo: await fim.json(), inicio: ji, base };
}

const a = await criarAmbiente({ sites: [S], openai });
try {
  const origin = a.origem(S);
  await passo('página inicial', async () => { const r = await a.pedir(S, '/'); assert.equal(r.status, 200); await r.text(); });
  await passo('envio sem entrada: 401, nada gravado', async () => {
    const r = await enviarArquivo(a, undefined, identidadeFalsa); assert.equal(r.status, 401); assert.equal(r.corpo.code, 'acesso_restrito');
  });
  const { cookie } = await a.entrar();
  let arquivo;
  await passo('envio em partes: 2 partes gravadas e conferidas', async () => {
    arquivo = await enviarArquivo(a, cookie); assert.equal(arquivo.status, 200, JSON.stringify(arquivo.corpo));
    assert.equal(arquivo.inicio.partBytes, PARTE); assert.equal(arquivo.inicio.partCount, 2); assert.equal(arquivo.corpo.bytes, pdf.length); assert.match(arquivo.corpo.fileToken, /^v2\./);
  });
  await passo('/api/file entrega o arquivo idêntico (leitura pela OpenAI, sem cookie)', async () => {
    const r = await a.pedir(S, '/api/file?token=' + encodeURIComponent(arquivo.corpo.fileToken));
    const bytes = Buffer.from(await r.arrayBuffer()); assert.equal(r.status, 200); assert.equal(r.headers.get('content-type'), 'application/pdf'); assert.equal(bytes.length, pdf.length);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), createHash('sha256').update(pdf).digest('hex'));
    const h = await a.pedir(S, '/api/file?token=' + encodeURIComponent(arquivo.corpo.fileToken), { method: 'HEAD' }); assert.equal(h.status, 200); assert.equal(Number(h.headers.get('content-length')), pdf.length);
    const x = await a.pedir(S, '/api/file?token=' + encodeURIComponent(arquivo.corpo.fileToken.slice(0, -4) + 'AAAA')); assert.equal(x.status, 404); await x.text();
    const y = await a.pedir(S, '/api/file'); assert.equal(y.status, 404); await y.text();
  });
  let tarefa;
  await passo('laudo: pedido em segundo plano à OpenAI com link temporário do anexo', async () => {
    const f = new FormData();
    for (const [k, v] of Object.entries({ mode: 'xray', age: '4 anos', dateOfBirth: '', sex: 'masculino', weight: '16', examDetail: 'Radiografia de tórax PA', dateTime: '', context: 'Tosse e febre há 3 dias.', samePatientConfirmed: 'false', xrayAttachmentRelationship: '', xrayOutputMode: 'complete', xrayLineCount: '' })) f.set(k, v);
    f.append('uploadedFiles', arquivo.corpo.fileToken);
    const corpo = new Response(f);
    const r = await a.pedir(S, '/api/report', { method: 'POST', cookie, headers: { origin, 'x-site-visitor-session': visitante, 'content-type': corpo.headers.get('content-type') }, body: Buffer.from(await corpo.arrayBuffer()) });
    const j = await r.json(); assert.equal(r.status, 202, JSON.stringify(j)); assert.equal(j.pending, true); tarefa = j.jobToken;
    const p = a.registro.openai.at(-1); assert.equal(p.autorizacao, 'Bearer ' + CHAVE);
    const c = JSON.parse(p.corpo); assert.equal(c.model, 'gpt-5.6'); assert.equal(c.background, true); assert.equal(c.store, false);
    const anexo = c.input[1].content.find(x => x.type === 'input_file'); assert.ok(anexo.file_url.startsWith(origin + '/api/file?token='));
  });
  await passo('acompanhamento do laudo em andamento e cancelamento com limpeza', async () => {
    const h = { origin, 'x-site-visitor-session': visitante, 'content-type': 'application/json' };
    estado = 'in_progress';
    const r = await a.pedir(S, '/api/report', { method: 'POST', cookie, headers: h, body: JSON.stringify({ action: 'poll', jobToken: tarefa }) });
    const j = await r.json(); assert.equal(r.status, 202, JSON.stringify(j)); assert.equal(j.pending, true);
    const c = await a.pedir(S, '/api/report', { method: 'POST', cookie, headers: h, body: JSON.stringify({ action: 'cancel', jobToken: tarefa }) });
    assert.deepEqual(await c.json(), { cancelled: true });
    const f = await a.pedir(S, '/api/file?token=' + encodeURIComponent(arquivo.corpo.fileToken)); assert.equal(f.status, 404, 'anexo temporário removido após o cancelamento'); await f.text();
  });
  await passo('anexo com conteúdo diferente do tipo declarado é recusado', async () => {
    const base = { origin, 'x-site-visitor-session': visitante };
    const i = await (await a.pedir(S, '/api/upload', { method: 'POST', cookie, headers: { ...base, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', filename: 'falso.pdf', bytes: 2000, mime: 'application/pdf' }) })).json();
    const r = await a.pedir(S, '/api/upload', { method: 'POST', cookie, headers: { ...base, 'content-type': 'application/octet-stream', 'x-upload-action': 'part', 'x-upload-token': i.uploadToken, 'x-upload-part-index': '0' }, body: Buffer.alloc(2000, 0x42) });
    assert.equal(r.status, 415); assert.equal((await r.json()).code, 'file_signature_mismatch');
  });
} finally { await a.fechar(); }

const b = await criarAmbiente({ sites: [S], openai, acessoIA: 'aberto' });
try {
  await passo('ACESSO_IA=aberto reproduz o site original (sessão de visitante, sem senha)', async () => {
    const r = await enviarArquivo(b); assert.equal(r.status, 200, JSON.stringify(r.corpo));
  });
} finally { await b.fechar(); }

const c = await criarAmbiente({ sites: [S], semChave: true });
try {
  const { cookie } = await c.entrar();
  await passo('sem chave: "ainda não possui uma chave configurada"', async () => {
    const r = await enviarArquivo(c, cookie); assert.equal(r.status, 503); assert.equal(r.corpo.code, 'missing_openai_key');
  });
} finally { await c.fechar(); }
fim();
