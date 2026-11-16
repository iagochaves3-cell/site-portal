// Adaptador dos sites com servidor próprio.
//
// Cada site continua sendo servido como antes (arquivos estáticos do repositório).
// As rotas de servidor do site original (/api/...) passam a ser atendidas aqui,
// pelo mesmo código que rodava na plataforma ChatGPT Sites, com três trocas:
//   1. "Entrar com ChatGPT"  -> entrada por senha no serviço acesso-sites;
//   2. identidade do usuário -> cabeçalhos oai-authenticated-user-* postos por este
//      adaptador somente depois de conferir a sessão (os que vierem de fora são
//      descartados);
//   3. chave da OpenAI       -> lida do serviço acesso-sites a cada requisição.

import { AsyncLocalStorage } from 'node:async_hooks';
import process from 'node:process';
import { servirEstatico } from './estatico.mjs';

// Dados da requisição em andamento (usados pelos substitutos de next/headers e cloudflare:workers).
export const requisicao = new AsyncLocalStorage();

const ENTRADA = '/signin-with-chatgpt';
const SAIDA = '/signout-with-chatgpt';
const RETORNO = '/callback';

const semCache = { 'cache-control': 'no-store, private', 'x-content-type-options': 'nosniff' };
const json = (corpo, status = 200, extra = {}) => Response.json(corpo, { status, headers: { ...semCache, ...extra } });

function urlDeAcesso(env) {
  return String(env.ACESSO_URL || 'https://acesso-sites.sites-pediatria.workers.dev').replace(/\/+$/, '');
}

// Aceita somente caminho relativo do próprio site.
function caminhoSeguro(valor) {
  const texto = String(valor || '/');
  if (!texto.startsWith('/') || texto.startsWith('//')) return '/';
  try {
    const u = new URL(texto, 'https://site.local');
    if (u.origin !== 'https://site.local') return '/';
    if ([ENTRADA, SAIDA, RETORNO].includes(u.pathname)) return '/';
    return u.pathname + u.search + u.hash;
  } catch { return '/'; }
}

async function contextoDeAcesso(request, env, precisaSessao) {
  const vazio = { usuario: null, chave: null, senha: false, disponivel: false };
  if (!env.ACESSO) return vazio;
  try {
    const cookie = precisaSessao ? request.headers.get('cookie') || '' : '';
    const r = await env.ACESSO.contexto(cookie);
    return { usuario: r?.usuario || null, chave: r?.chave || null, senha: !!r?.senha, disponivel: true };
  } catch (erro) {
    console.error(JSON.stringify({ evento: 'acesso_indisponivel', mensagem: String(erro?.message || erro).slice(0, 200) }));
    return vazio;
  }
}

// Remove qualquer identidade enviada de fora e põe a identidade conferida.
function comIdentidade(request, usuario) {
  const cabecalhos = new Headers(request.headers);
  for (const nome of [...cabecalhos.keys()]) if (nome.toLowerCase().startsWith('oai-')) cabecalhos.delete(nome);
  if (usuario) {
    cabecalhos.set('oai-authenticated-user-id', usuario.id);
    cabecalhos.set('oai-authenticated-user-email', usuario.email);
    cabecalhos.set('oai-authenticated-user-full-name', encodeURIComponent(usuario.nome));
    cabecalhos.set('oai-authenticated-user-full-name-encoding', 'percent-encoded-utf-8');
  }
  return new Request(request, { headers: cabecalhos });
}

function respostaRestrita(env, acesso) {
  const onde = urlDeAcesso(env);
  if (!acesso.disponivel || !acesso.senha) {
    return json({ error: 'Função protegida: o proprietário ainda não definiu a senha de acesso dos sites. Nenhuma consulta foi enviada.', code: 'acesso_nao_configurado' }, 503);
  }
  return json({
    error: 'Função protegida por senha. Abra ' + onde + ' , digite a senha de acesso e volte a esta página. Nenhuma consulta foi enviada.',
    code: 'acesso_restrito',
    sign_in_url: ENTRADA + '?return_to=/',
  }, 401);
}

function metodosPermitidos(metodos) {
  const lista = Object.keys(metodos).filter(m => /^(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS)$/.test(m) && typeof metodos[m] === 'function');
  if (lista.includes('GET') && !lista.includes('HEAD')) lista.push('HEAD');
  if (!lista.includes('OPTIONS')) lista.push('OPTIONS');
  return lista.sort();
}

async function executarRota(rota, request, env, ctx, config) {
  const acessoRota = rota.acesso || 'original';
  // 'sessao' pode ser liberado pelo proprietário com a variável ACESSO_IA=aberto (como no site original).
  const exigeSessao = acessoRota === 'sessao' && String(env.ACESSO_IA || 'senha').toLowerCase() !== 'aberto';

  let tratador = rota.fetch || null;
  if (!tratador) {
    const metodo = request.method.toUpperCase();
    tratador = rota.metodos[metodo];
    if (!tratador && metodo === 'HEAD') tratador = rota.metodos.GET;
    if (!tratador) {
      const permitidos = metodosPermitidos(rota.metodos).join(', ');
      if (metodo === 'OPTIONS') return new Response(null, { status: 204, headers: { allow: permitidos } });
      return new Response(null, { status: 405, headers: { allow: permitidos } });
    }
  }

  const acesso = await contextoDeAcesso(request, env, acessoRota !== 'publico');
  if (exigeSessao && !acesso.usuario) return respostaRestrita(env, acesso);

  const pedido = comIdentidade(request, acesso.usuario);
  const extra = { ...(config.preparar ? config.preparar(env, ctx) : {}) };
  if (acesso.chave) { extra.OPENAI_API_KEY = acesso.chave; process.env.OPENAI_API_KEY = acesso.chave; }
  else { extra.OPENAI_API_KEY = undefined; delete process.env.OPENAI_API_KEY; }

  const dados = { headers: pedido.headers, env, ctx, extra };
  try {
    let resposta = await requisicao.run(dados, () => tratador(pedido, rota.fetch ? { ...env, ...extra } : { params: Promise.resolve({}) }, ctx));
    if (!(resposta instanceof Response)) resposta = new Response(null, { status: 500 });
    if (request.method.toUpperCase() === 'HEAD' && resposta.body) resposta = new Response(null, resposta);
    if (!resposta.headers.has('cache-control')) {
      resposta = new Response(resposta.body, resposta);
      resposta.headers.set('cache-control', 'no-store');
    }
    return resposta;
  } catch (erro) {
    const marca = typeof erro?.digest === 'string' ? erro.digest : '';
    if (marca.startsWith('NEXT_REDIRECT;')) {
      const partes = marca.split(';');
      return new Response(null, { status: Number(partes[3]) || 307, headers: { location: partes[2], 'cache-control': 'no-store' } });
    }
    if (marca === 'NEXT_NOT_FOUND') return new Response('Página não encontrada', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...semCache } });
    console.error(JSON.stringify({ evento: 'erro_na_rota', site: config.site, caminho: new URL(request.url).pathname, mensagem: String(erro?.message || erro).slice(0, 300) }));
    return json({ error: 'Erro interno do servidor. Tente novamente.' }, 500);
  }
}

export function criarWorker(config) {
  const rotas = new Map(Object.entries(config.rotas));
  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      const caminho = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;

      if (caminho === ENTRADA) {
        const destino = url.origin + caminhoSeguro(url.searchParams.get('return_to'));
        return new Response(null, { status: 302, headers: { location: urlDeAcesso(env) + '/?return_to=' + encodeURIComponent(destino), 'cache-control': 'no-store' } });
      }
      if (caminho === SAIDA) {
        const destino = url.origin + caminhoSeguro(url.searchParams.get('return_to'));
        return new Response(null, { status: 302, headers: { location: urlDeAcesso(env) + '/sair?return_to=' + encodeURIComponent(destino), 'cache-control': 'no-store' } });
      }
      if (caminho === RETORNO) return new Response(null, { status: 302, headers: { location: url.origin + '/', 'cache-control': 'no-store' } });

      const rota = rotas.get(caminho);
      if (rota) return executarRota(rota, request, env, ctx, config);
      return servirEstatico(request, env, ctx);
    },
  };
}
