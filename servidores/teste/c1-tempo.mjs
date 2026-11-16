// Estimativa de custo de processamento (tempo de parede no workerd local, OpenAI simulada
// com resposta imediata). Serve para comparar com o limite de CPU do plano gratuito (10 ms).
import { randomBytes } from 'node:crypto';
import { criarAmbiente } from './ambiente.mjs';

const mensagem = texto => [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: texto, annotations: [] }] }];
const derm = { summary: 'x', images: [], diagnoses: [], associations: [], alerts: [], questions: [], limitations: [] };
const openai = async p => {
  if (p.corpo && p.corpo.includes('gpt-5.4-2026-03-05')) { const n = JSON.parse(p.corpo).input[0].content.filter(c => c.type === 'input_image').length; return { json: { status: 'completed', output: mensagem(JSON.stringify({ ...derm, images: Array.from({ length: n }, (_, i) => ({ number: i + 1, quality: 'adequate', findings: 'a', limitations: 'b' })) })) } }; }
  return { json: { id: 'resp_l', status: 'queued' } };
};
const a = await criarAmbiente({ sites: ['dermatologia', 'laboratorioeradiografia', 'revisao-pediatrica-continua', 'guideliness'], openai });
const medir = async (rotulo, fn, n = 6) => { const t = []; for (let i = 0; i < n; i++) { const t0 = performance.now(); const r = await fn(); await r.arrayBuffer(); t.push(performance.now() - t0); if (i === 0 && r.status >= 400) console.log('   status', r.status); } t.sort((x, y) => x - y); console.log(rotulo.padEnd(62), 'mediana', t[Math.floor(n / 2)].toFixed(1).padStart(7), 'ms | mín', t[0].toFixed(1)); };
try {
  const { cookie } = await a.entrar();
  const jpeg = kb => { const b = randomBytes(kb * 1024); b[0] = 0xff; b[1] = 0xd8; b[2] = 0xff; b[b.length - 2] = 0xff; b[b.length - 1] = 0xd9; return 'data:image/jpeg;base64,' + b.toString('base64'); };
  const paciente = { years: '6', months: '', days: '', weight: '20', comorbidities: [], family: [], allergyStatus: 'unknown', allergies: '', medicines: '', pregnancy: 'unknown', description: 'Placas eritematosas.', duration: 'subacute', distribution: 'symmetric', site: '', features: [], redFlags: [] };
  const D = 'dermatologia', hd = { origin: a.origem(D), 'content-type': 'application/json' };
  await medir('estático: página inicial da Dermatologia', () => a.pedir(D, '/'));
  await medir('Dermatologia GET /api/analyze (estado)', () => a.pedir(D, '/api/analyze', { cookie }));
  for (const [n, kb] of [[0, 0], [1, 300], [3, 500], [5, 730]]) {
    const corpo = JSON.stringify({ patient: paciente, images: Array.from({ length: n }, () => ({ dataUrl: jpeg(kb) })) });
    await medir(`Dermatologia POST análise: ${n} foto(s) de ${kb} KB (corpo ${(corpo.length / 1e6).toFixed(2)} MB)`, () => a.pedir(D, '/api/analyze', { method: 'POST', cookie, headers: hd, body: corpo }));
  }
  const L = 'laboratorioeradiografia', vis = 'visitor_' + 'ab12'.repeat(8), hl = { origin: a.origem(L), 'x-site-visitor-session': vis };
  const parte = Buffer.concat([Buffer.from('%PDF-1.4\n'), randomBytes(768 * 1024 - 9)]);
  await medir('Laboratório: iniciar envio (token)', () => a.pedir(L, '/api/upload', { method: 'POST', cookie, headers: { ...hl, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', filename: 'e.pdf', bytes: parte.length * 2, mime: 'application/pdf' }) }));
  const ini = await (await a.pedir(L, '/api/upload', { method: 'POST', cookie, headers: { ...hl, 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start', filename: 'e.pdf', bytes: parte.length * 2, mime: 'application/pdf' }) })).json();
  await medir('Laboratório: gravar 1 parte de 768 KB', () => a.pedir(L, '/api/upload', { method: 'POST', cookie, headers: { ...hl, 'content-type': 'application/octet-stream', 'x-upload-action': 'part', 'x-upload-token': ini.uploadToken, 'x-upload-part-index': '0' }, body: parte }));
  const f = new FormData(); for (const [k, v] of Object.entries({ mode: 'xray', age: '4 anos', sex: 'masculino', context: 'Tosse.', samePatientConfirmed: 'false', xrayAttachmentRelationship: '', xrayOutputMode: 'complete' })) f.set(k, v);
  f.append('files', new File([randomBytes(1_100_000).fill(0xff, 0, 1).fill(0xd8, 1, 2).fill(0xff, 2, 3)], 'rx.jpg', { type: 'image/jpeg' }));
  const multi = new Response(f); const corpoMulti = Buffer.from(await multi.arrayBuffer());
  await medir('Laboratório: laudo com imagem direta de 1,1 MB', () => a.pedir(L, '/api/report', { method: 'POST', cookie, headers: { ...hl, 'content-type': multi.headers.get('content-type') }, body: corpoMulti }));
  const R = 'revisao-pediatrica-continua';
  await medir('Revisão GET /api/workspace (1ª vez cria a fila)', () => a.pedir(R, '/api/workspace', { cookie }));
  const G = 'guideliness';
  await medir('Guideliness POST /mcp tools/list', () => a.pedir(G, '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }));
} finally { await a.fechar(); }
