// ia-sites — IA alternativa dos sites, com a interface da API de respostas da OpenAI.
//
// Só é alcançado pelos sites, por ligação interna (service binding, ponto de entrada
// "Interno"). O endereço público responde 404, exceto /teste, protegido por um
// token cujo SHA-256 fica na variável TESTE_HASH, que roda casos fixos de verificação.
//
// Vínculos: AI (Workers AI), TRABALHOS (Durable Object TrabalhoIA, para os pedidos
// em segundo plano, "background": true).

import { DurableObject, WorkerEntrypoint } from 'cloudflare:workers';
import { processar, novoId, agora, ErroIA, modelos } from './nucleo.mjs';

const json = (corpo, status = 200) => Response.json(corpo, { status, headers: { 'cache-control': 'no-store' } });
const erro = (status, codigo, mensagem) => json({ error: { type: status === 429 ? 'insufficient_quota' : 'server_error', code: codigo, message: mensagem } }, status);

function erroDe(e) {
  if (e instanceof ErroIA) return erro(e.status, e.codigo, e.message);
  console.error(JSON.stringify({ evento: 'erro_interno', mensagem: String(e?.message || e).slice(0, 300) }));
  return erro(500, 'server_error', 'Falha interna da IA alternativa.');
}

const ESTADOS_PENDENTES = new Set(['queued', 'in_progress']);

// Pedidos de verificação (texto com a marca abaixo) guardam a última resposta para conferência
// pela rota /teste?caso=ultimo. Pedidos reais nunca são guardados.
const MARCA_TESTE = '[[TESTE-IA]]';
async function guardarTeste(env, resultado) {
  try { await env.TRABALHOS.get(env.TRABALHOS.idFromName('ultimo-teste')).guardarTeste(JSON.stringify(resultado)); } catch {}
}

export class TrabalhoIA extends DurableObject {
  // O pedido (com anexos embutidos) é guardado em partes de até 500 mil caracteres,
  // abaixo do limite por valor do armazenamento do Durable Object.
  async iniciar(id, texto) {
    const partes = {};
    let n = 0;
    for (let i = 0; i < texto.length; i += 500000) partes['p' + n++] = texto.slice(i, i + 500000);
    await this.ctx.storage.put({ id, n, estado: 'queued', criado: Date.now(), ...partes });
    await this.ctx.storage.setAlarm(Date.now() + 20);
  }

  async apagarPedido() {
    const n = (await this.ctx.storage.get('n')) || 0;
    for (let i = 0; i < n; i++) await this.ctx.storage.delete('p' + i);
  }

  async alarm() {
    const estado = await this.ctx.storage.get('estado');
    if (estado === 'queued') {
      await this.ctx.storage.put('estado', 'in_progress');
      const id = await this.ctx.storage.get('id');
      try {
        const n = (await this.ctx.storage.get('n')) || 0;
        let texto = '';
        for (let i = 0; i < n; i++) texto += (await this.ctx.storage.get('p' + i)) || '';
        const resultado = await processar(this.env, JSON.parse(texto), id);
        if (texto.includes(MARCA_TESTE)) await guardarTeste(this.env, resultado);
        if ((await this.ctx.storage.get('estado')) === 'in_progress') {
          await this.ctx.storage.put({ resultado: JSON.stringify(resultado), estado: 'completed' });
        }
      } catch (e) {
        const codigo = e instanceof ErroIA ? e.codigo : 'server_error';
        const mensagem = e instanceof ErroIA ? e.message : 'Falha interna da IA alternativa.';
        console.error(JSON.stringify({ evento: 'trabalho_falhou', codigo, mensagem: String(e?.message || e).slice(0, 300) }));
        await this.ctx.storage.put({ estado: 'failed', erro: { code: codigo, message: mensagem } });
      }
      await this.apagarPedido();
      await this.ctx.storage.setAlarm(Date.now() + 30 * 60 * 1000);
      return;
    }
    if (estado === 'in_progress') {
      // O processamento anterior foi interrompido (reinício do servidor): registra falha.
      await this.ctx.storage.put({ estado: 'failed', erro: { code: 'server_error', message: 'O processamento foi interrompido. Tente novamente.' } });
      await this.apagarPedido();
      await this.ctx.storage.setAlarm(Date.now() + 30 * 60 * 1000);
      return;
    }
    await this.ctx.storage.deleteAll();
  }

  async consultar() {
    const [id, estado, criado] = [await this.ctx.storage.get('id'), await this.ctx.storage.get('estado'), await this.ctx.storage.get('criado')];
    if (!id) return null;
    if (estado === 'completed') return JSON.parse(await this.ctx.storage.get('resultado'));
    const base = { id, object: 'response', created_at: Math.floor((criado || Date.now()) / 1000), status: estado, output: [], error: null, incomplete_details: null };
    if (estado === 'failed') base.error = (await this.ctx.storage.get('erro')) || { code: 'server_error', message: 'Falha.' };
    if (ESTADOS_PENDENTES.has(estado) && criado && Date.now() - criado > 14 * 60 * 1000) {
      base.status = 'failed';
      base.error = { code: 'server_error', message: 'O processamento excedeu o tempo limite.' };
    }
    return base;
  }

  // Pausa da chave paga (instância "estado-openai"): guarda, por impressão da chave (hash
  // parcial, nunca a chave), até quando a OpenAI fica pulada após recusar por crédito ou chave.
  async lerEstado(chave) { return (await this.ctx.storage.get('estado:' + chave)) || null; }
  async gravarEstado(chave, valor) { await this.ctx.storage.put('estado:' + chave, valor); }

  async guardarTeste(texto) { await this.ctx.storage.put('teste', texto); }
  async obterTeste() { return (await this.ctx.storage.get('teste')) || null; }

  async cancelar() {
    const id = await this.ctx.storage.get('id');
    if (!id) return null;
    const estado = await this.ctx.storage.get('estado');
    if (ESTADOS_PENDENTES.has(estado)) await this.ctx.storage.put('estado', 'cancelled');
    return { id, object: 'response', status: ESTADOS_PENDENTES.has(estado) ? 'cancelled' : estado };
  }
}

async function criar(env, pedido, texto) {
  const id = novoId('resp_wai');
  if (pedido.background) {
    // Responde na hora; leitura dos anexos, busca e geração ficam com o Durable Object.
    const stub = env.TRABALHOS.get(env.TRABALHOS.idFromName(id));
    await stub.iniciar(id, texto);
    return { id, object: 'response', created_at: agora(), status: 'queued', model: 'cloudflare-workers-ai/' + modelos(env).texto, output: [], error: null, incomplete_details: null };
  }
  const resultado = await processar(env, pedido, id);
  if (texto.includes(MARCA_TESTE)) await guardarTeste(env, resultado);
  return resultado;
}

async function atender(env, request) {
  const url = new URL(request.url);
  const caminho = url.pathname.replace(/\/+$/, '');
  const metodo = request.method.toUpperCase();
  try {
    if (caminho === '/v1/responses' && metodo === 'POST') {
      const texto = await request.text();
      let pedido;
      try { pedido = JSON.parse(texto); } catch { return erro(400, 'invalid_json', 'Corpo JSON inválido.'); }
      if (!pedido || typeof pedido !== 'object') return erro(400, 'invalid_request', 'Pedido inválido.');
      return json(await criar(env, pedido, texto));
    }
    if (caminho === '/estado-openai') {
      const chave = (url.searchParams.get('chave') || '').toLowerCase().replace(/[^0-9a-f]/g, '').slice(0, 32);
      if (!chave) return erro(400, 'invalid_request', 'Falta a impressão da chave.');
      const stub = env.TRABALHOS.get(env.TRABALHOS.idFromName('estado-openai'));
      if (metodo === 'GET') return json((await stub.lerEstado(chave)) || {});
      if (metodo === 'POST') {
        let v;
        try { v = await request.json(); } catch { return erro(400, 'invalid_json', 'Corpo JSON inválido.'); }
        const ate = Math.min(Number(v && v.ate) || 0, Date.now() + 60 * 60 * 1000);
        await stub.gravarEstado(chave, { ate, motivo: String((v && v.motivo) || '').slice(0, 120), quando: Date.now() });
        return json({ ok: true, ate });
      }
      return erro(405, 'method_not_allowed', 'Método não permitido.');
    }
    const m = /^\/v1\/responses\/(resp_[A-Za-z0-9_-]+)(\/cancel)?$/.exec(caminho);
    if (m) {
      if (!m[1].startsWith('resp_wai')) return erro(404, 'not_found', 'Resposta não encontrada.');
      const stub = env.TRABALHOS.get(env.TRABALHOS.idFromName(m[1]));
      const r = m[2] ? (metodo === 'POST' ? await stub.cancelar() : undefined) : (metodo === 'GET' ? await stub.consultar() : undefined);
      if (r === undefined) return erro(405, 'method_not_allowed', 'Método não permitido.');
      if (r === null) return erro(404, 'not_found', 'Resposta não encontrada.');
      return json(r);
    }
    return erro(404, 'not_found', 'Rota não encontrada.');
  } catch (e) {
    return erroDe(e);
  }
}

export class Interno extends WorkerEntrypoint {
  async fetch(request) { return atender(this.env, request); }
}

// ---------------------------------------------------------------------------
// Verificação (/teste): casos fixos, sem dados de pacientes.

const PNG_TESTE = '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';

async function sha256Hex(texto) {
  const b = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)));
  return [...b].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function casosDeTeste(env, caso) {
  const inicio = Date.now();
  const executar = async (pedido) => {
    const r = await atender(env, new Request('https://ia.interno/v1/responses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(pedido) }));
    let d = await r.json();
    if (d?.status === 'queued' || d?.status === 'in_progress') {
      for (let i = 0; i < 90 && (d.status === 'queued' || d.status === 'in_progress'); i++) {
        await new Promise(s => setTimeout(s, 2000));
        d = await (await atender(env, new Request('https://ia.interno/v1/responses/' + d.id, { method: 'GET' }))).json();
      }
    }
    return { http: r.status, status: d.status, erro: d.error || null, modelo: d.model, uso: d.usage, saida: (d.output || []).map(o => o.type === 'message' ? { tipo: 'message', texto: o.content?.[0]?.text?.slice(0, 1500), anotacoes: o.content?.[0]?.annotations?.length } : o.type === 'web_search_call' ? { tipo: 'web_search_call', consulta: o.action?.query, fontes: (o.action?.sources || []).slice(0, 5) } : { tipo: o.type, nome: o.name, args: o.arguments }) };
  };
  const esquema = { type: 'object', additionalProperties: false, required: ['exame', 'achados', 'gravidade'], properties: { exame: { type: 'string' }, achados: { type: 'array', minItems: 1, items: { type: 'string' } }, gravidade: { type: 'string', enum: ['leve', 'moderada', 'grave', 'indeterminável'] } } };
  const casos = {
    texto: () => executar({ model: 'x', input: [{ role: 'developer', content: 'Você é pediatra. Responda em português.' }, { role: 'user', content: [{ type: 'input_text', text: 'Hemoglobina 9,1 g/dL (ref. 11,5–15,5) em criança de 4 anos. Classifique.' }] }], text: { format: { type: 'json_schema', name: 't', strict: true, schema: esquema } }, max_output_tokens: 800 }),
    visao: () => executar({ model: 'x', input: [{ role: 'developer', content: 'Descreva o anexo.' }, { role: 'user', content: [{ type: 'input_text', text: 'Imagem de teste.' }, { type: 'input_image', image_url: 'data:image/png;base64,' + PNG_TESTE }] }], text: { format: { type: 'json_schema', name: 't', strict: true, schema: esquema } }, max_output_tokens: 600 }),
    busca: () => executar({ model: 'x', instructions: 'Responda em português, citando as fontes com URL.', input: 'Qual a dose de dexametasona oral para crupe viral em crianças?', tools: [{ type: 'web_search' }], tool_choice: { type: 'web_search' }, max_output_tokens: 1200 }),
    fundo: () => executar({ model: 'x', background: true, input: [{ role: 'developer', content: 'Você é pediatra. Responda em português.' }, { role: 'user', content: 'Ferritina 6 ng/mL em criança de 2 anos: interprete.' }], tools: [{ type: 'web_search', filters: { allowed_domains: ['pubmed.ncbi.nlm.nih.gov'] } }], tool_choice: 'auto', text: { format: { type: 'json_schema', name: 't', strict: true, schema: esquema } }, max_output_tokens: 1500 }),
    funcao: () => executar({ model: 'x', instructions: 'Use a ferramenta calcular_dose quando precisar calcular uma dose.', input: 'Calcule a dose de amoxicilina 50 mg/kg/dia para 12 kg, dividida em 2 tomadas.', tools: [{ type: 'function', name: 'calcular_dose', description: 'Calcula a dose total diária e por tomada.', parameters: { type: 'object', additionalProperties: false, required: ['mg_kg_dia', 'peso_kg', 'tomadas'], properties: { mg_kg_dia: { type: 'number' }, peso_kg: { type: 'number' }, tomadas: { type: 'integer' } } } }], tool_choice: 'auto', max_output_tokens: 600 }),
  };
  if (caso === 'ultimo') {
    const t = await env.TRABALHOS.get(env.TRABALHOS.idFromName('ultimo-teste')).obterTeste();
    return { ultimo: t ? JSON.parse(t) : null };
  }
  const lista = caso && casos[caso] ? [caso] : Object.keys(casos);
  const resultado = {};
  for (const k of lista) {
    const t = Date.now();
    try { resultado[k] = { ...(await casos[k]()), ms: Date.now() - t }; } catch (e) { resultado[k] = { falha: String(e?.message || e).slice(0, 300), ms: Date.now() - t }; }
  }
  return { modelos: modelos(env), ms: Date.now() - inicio, resultado };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/teste' && env.TESTE_HASH) {
      const token = request.headers.get('x-teste') || url.searchParams.get('token') || '';
      if (token && (await sha256Hex(token)) === env.TESTE_HASH) return json(await casosDeTeste(env, url.searchParams.get('caso')));
    }
    return new Response('Não encontrado', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  },
};
