// Envoltório dos seis sites com servidor próprio (módulo principal do Worker).
//
// Envolve, sem alterá-lo, o programa já implantado de cada site (módulo "worker.js":
// adaptador + código original do site) e decide, a cada requisição, qual IA atende.
//
// 1. Proprietário com sessão (entrou com a SENHA_DE_ACESSO) e chave da OpenAI
//    configurada (OPENAI_API_KEY no acesso-sites): as chamadas vão à OpenAI com a chave
//    do proprietário e o modelo original do site. Se a OpenAI recusar a criação da
//    resposta (sem crédito, chave inválida, modelo indisponível, limite, erro do
//    servidor ou falha de rede), o mesmo pedido é refeito no Worker ia-sites
//    (Cloudflare Workers AI), sem erro na tela. IA_RESERVA=desligada desliga a reserva.
//
// 2. Nos outros casos (sem sessão, ou sessão sem chave paga), o site recebe uma chave
//    interna aleatória (segredo IA_CHAVE_INTERNA) e as chamadas que o código original
//    faz a https://api.openai.com/v1/responses com essa chave são desviadas para o
//    ia-sites, por ligação interna (IA). Com a IA alternativa ligada, a chave paga
//    nunca é usada sem sessão: os sites estão abertos na internet.
//
// 3. Uso livre enquanto não houver senha: se o proprietário ainda não definiu a senha
//    de acesso, as funções que pediam entrada funcionam como se o proprietário tivesse
//    entrado (identidade "proprietario", a mesma do acesso-sites), sempre pela IA
//    gratuita, com ou sem chave paga cadastrada. Definida a senha, a proteção volta
//    sozinha. ACESSO_LIVRE=nao desliga esta regra.
//
// Nos dois caminhos, anexos do próprio site (por exemplo /api/file?token=...) são lidos
// aqui dentro e enviados embutidos (data URL). Respostas criadas pelo ia-sites (id
// resp_wai...) são sempre consultadas e canceladas no ia-sites.
//
// Variáveis: SITE_NOME, ACESSO_LIVRE (sim|nao), IA_ALTERNATIVA (ligada|desligada),
// IA_RESERVA (ligada|desligada), DONO_ID, DONO_EMAIL, DONO_NOME.

import site from './worker.js';
import { AsyncLocalStorage } from 'node:async_hooks';

const contexto = new AsyncLocalStorage();
const fetchOriginal = globalThis.fetch;
const OPENAI = 'https://api.openai.com/';
const CRIAR = /^\/v1\/responses\/?$/;
const DA_PONTE = /^\/v1\/responses\/resp_wai[^/]*(\/|$)/;

function enderecoDe(entrada) {
  if (typeof entrada === 'string') return entrada;
  if (entrada instanceof URL) return entrada.href;
  return entrada && typeof entrada.url === 'string' ? entrada.url : '';
}

function paraDataUrl(bytes, tipo) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return 'data:' + (tipo || 'application/octet-stream') + ';base64,' + btoa(s);
}

async function embutirAnexosProprios(corpo, est) {
  let pedido;
  try { pedido = JSON.parse(corpo); } catch { return corpo; }
  const tarefas = [];
  for (const item of Array.isArray(pedido.input) ? pedido.input : []) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const c of item.content) {
      const endereco = c && c.type === 'input_image' ? c.image_url : c && c.type === 'input_file' ? c.file_url : null;
      if (typeof endereco !== 'string' || !endereco.startsWith(est.origem + '/')) continue;
      tarefas.push((async () => {
        const r = await site.fetch(new Request(endereco, { method: 'GET' }), est.envSite, est.ctx);
        if (!r.ok) throw new Error('anexo do site indisponível (' + r.status + ')');
        const tipo = (r.headers.get('content-type') || 'application/octet-stream').split(';')[0].trim();
        const dados = paraDataUrl(new Uint8Array(await r.arrayBuffer()), tipo);
        if (c.type === 'input_image') c.image_url = dados;
        else { delete c.file_url; c.file_data = dados; if (!c.filename) c.filename = tipo === 'application/pdf' ? 'anexo.pdf' : 'anexo'; }
      })());
    }
  }
  if (!tarefas.length) return corpo;
  await Promise.all(tarefas);
  return JSON.stringify(pedido);
}

async function lerCorpo(entrada, opcoes, metodo) {
  let corpo = opcoes?.body !== undefined && opcoes?.body !== null
    ? opcoes.body
    : (entrada instanceof Request && metodo !== 'GET' && metodo !== 'HEAD' ? await entrada.clone().text() : undefined);
  if (corpo !== undefined && typeof corpo !== 'string') corpo = await new Response(corpo).text();
  return corpo;
}

function erroDeAnexo(e) {
  return Response.json({ error: { type: 'invalid_request_error', code: 'invalid_attachment', message: String(e?.message || e) } }, { status: 400 });
}

function ponte(est, u, metodo, corpo, sinal) {
  return est.env.IA.fetch(new Request('https://ia-sites.interno' + u.pathname + u.search, {
    method: metodo,
    headers: { 'content-type': 'application/json', 'x-site': est.site, 'x-cliente': est.ip },
    body: metodo === 'GET' || metodo === 'HEAD' ? undefined : corpo,
    signal: sinal,
  }));
}

async function motivoDaRecusa(r) {
  try { const j = await r.clone().json(); return String(j?.error?.code || j?.error?.type || '').slice(0, 60); } catch { return ''; }
}

globalThis.fetch = async function fetchComDesvio(entrada, opcoes) {
  const est = contexto.getStore();
  const endereco = enderecoDe(entrada);
  if (!est || !est.env.IA || !endereco.startsWith(OPENAI)) return fetchOriginal(entrada, opcoes);
  const cabecalhos = new Headers(opcoes?.headers || (entrada instanceof Request ? entrada.headers : undefined));
  const autorizacao = cabecalhos.get('authorization') || '';
  const paga = !!est.chavePaga && autorizacao === 'Bearer ' + est.chavePaga;
  // A chave paga só sai com sessão. Fora dela (inclusive se outra requisição simultânea
  // tiver trocado process.env.OPENAI_API_KEY), o pedido vai pela IA gratuita.
  const pagaSemSessao = !paga && !!est.chaveInterna && !!est.chavePagaCadastrada && autorizacao === 'Bearer ' + est.chavePagaCadastrada;
  const interna = (!!est.chaveInterna && autorizacao === 'Bearer ' + est.chaveInterna) || pagaSemSessao;
  if (!interna && !paga) return fetchOriginal(entrada, opcoes);

  const u = new URL(endereco);
  const metodo = String(opcoes?.method || (entrada instanceof Request ? entrada.method : 'GET')).toUpperCase();
  const sinal = opcoes?.signal || (entrada instanceof Request ? entrada.signal : undefined);

  // Chave interna, ou resposta criada pelo ia-sites: tudo pela ponte.
  if (interna || DA_PONTE.test(u.pathname)) {
    let corpo = await lerCorpo(entrada, opcoes, metodo);
    if (metodo === 'POST' && corpo && CRIAR.test(u.pathname)) {
      try { corpo = await embutirAnexosProprios(corpo, est); } catch (e) { return erroDeAnexo(e); }
    }
    return ponte(est, u, metodo, corpo, sinal);
  }

  // Chave paga do proprietário (só com sessão): OpenAI primeiro; reserva no ia-sites.
  if (metodo === 'POST' && CRIAR.test(u.pathname)) {
    let corpo = await lerCorpo(entrada, opcoes, metodo);
    if (corpo) { try { corpo = await embutirAnexosProprios(corpo, est); } catch (e) { return erroDeAnexo(e); } }
    let r = null, falha = null;
    try { r = await fetchOriginal(endereco, { method: 'POST', headers: cabecalhos, body: corpo, signal: sinal }); }
    catch (e) { if (sinal?.aborted) throw e; falha = e; }
    if (r && r.ok) return r;
    if (!est.reserva) { if (r) return r; throw falha; }
    const motivo = r ? r.status + ' ' + await motivoDaRecusa(r) : 'rede: ' + String(falha?.message || falha).slice(0, 80);
    console.warn(JSON.stringify({ evento: 'openai_recusou_reserva_ia_sites', site: est.site, motivo }));
    return ponte(est, u, 'POST', corpo, sinal);
  }
  return fetchOriginal(entrada, opcoes);
};

function dono(env) {
  return {
    id: env.DONO_ID || 'proprietario',
    email: env.DONO_EMAIL || 'proprietario@sites-pediatria.workers.dev',
    nome: env.DONO_NOME || 'Proprietário',
  };
}

export default {
  async fetch(request, env, ctx) {
    const iaLigada = String(env.IA_ALTERNATIVA || 'ligada').toLowerCase() !== 'desligada' && !!env.IA && !!env.IA_CHAVE_INTERNA;
    const est = {
      env, ctx,
      origem: new URL(request.url).origin,
      site: env.SITE_NOME || '',
      ip: request.headers.get('cf-connecting-ip') || '',
      chaveInterna: iaLigada ? env.IA_CHAVE_INTERNA : null,
      chavePaga: null,
      chavePagaCadastrada: null,
      reserva: false,
      envSite: env,
    };
    const acessoOriginal = env.ACESSO;
    if (acessoOriginal) {
      const livre = String(env.ACESSO_LIVRE || 'sim').toLowerCase() !== 'nao';
      const reserva = iaLigada && String(env.IA_RESERVA || 'ligada').toLowerCase() !== 'desligada';
      const acesso = {
        async contexto(cookie) {
          const r = (await acessoOriginal.contexto(cookie)) || {};
          const chavePaga = r.chave || null;
          if (chavePaga) est.chavePagaCadastrada = chavePaga;
          let usuario = r.usuario || null;
          let chave;
          if (usuario && chavePaga) { chave = chavePaga; est.chavePaga = chavePaga; est.reserva = reserva; }
          else if (iaLigada) chave = env.IA_CHAVE_INTERNA;
          else chave = chavePaga;
          if (!usuario && livre && !r.senha && iaLigada) usuario = dono(env);
          return { ...r, usuario, chave };
        },
        async chave() { return (await this.contexto('')).chave; },
      };
      est.envSite = { ...env, ACESSO: acesso };
    }
    return contexto.run(est, () => site.fetch(request, est.envSite, ctx));
  },
};
