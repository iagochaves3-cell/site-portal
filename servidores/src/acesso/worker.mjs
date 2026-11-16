// acesso-sites — porta de entrada única dos sites com servidor próprio.
//
// O que faz:
//  1. Página de entrada por senha. Uma entrada vale para todos os sites
//     *.sites-pediatria.workers.dev, neste aparelho, por 30 dias.
//  2. Guarda, em segredos da Cloudflare, a chave da OpenAI e a senha de acesso.
//     Os sites pedem essas informações por ligação interna (service binding),
//     que não é alcançável pela internet.
//
// Segredos (definidos no painel da Cloudflare, nunca no código):
//   OPENAI_API_KEY   chave da API da OpenAI (do proprietário)
//   SENHA_DE_ACESSO  senha de entrada (mínimo de 8 caracteres)
//   SEGREDO_SESSAO   valor aleatório gerado na instalação (assina o cookie)
// Variáveis de texto: DOMINIO, USUARIO_ID, USUARIO_EMAIL, USUARIO_NOME, PORTAL
// Banco D1 (DB): tabela "tentativas" — limite de tentativas de senha.

import { WorkerEntrypoint } from 'cloudflare:workers';

const COOKIE = '__Secure-sp';
const DURACAO_S = 30 * 24 * 3600;
const LIMITE_POR_ORIGEM = 8;      // senhas erradas por origem a cada 15 minutos
const LIMITE_GERAL = 1000;        // senhas erradas no total por hora
const enc = new TextEncoder();

function valor(v) { return typeof v === 'string' ? v.trim() : ''; }
function configurado(v, minimo) { const s = valor(v); return s.length >= minimo && !/^PENDENTE/i.test(s); }
const temSenha = env => configurado(env.SENHA_DE_ACESSO, 8) && configurado(env.SEGREDO_SESSAO, 16);
const temChave = env => configurado(env.OPENAI_API_KEY, 20);
const dominio = env => valor(env.DOMINIO) || 'sites-pediatria.workers.dev';

function b64url(bytes) {
  let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function sha256(texto) { return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(texto))); }
function hex(bytes) { return [...bytes].map(b => b.toString(16).padStart(2, '0')).join(''); }

async function chaveDeAssinatura(env) {
  const material = await sha256(valor(env.SEGREDO_SESSAO) + '\u0000' + valor(env.SENHA_DE_ACESSO));
  return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function assinar(env, expira) {
  return b64url(await crypto.subtle.sign('HMAC', await chaveDeAssinatura(env), enc.encode('sessao:v1:' + expira)));
}
function iguais(a, b) {
  const x = enc.encode(a), y = enc.encode(b);
  if (x.byteLength !== y.byteLength) return false;
  return crypto.subtle.timingSafeEqual(x, y);
}
function lerCookie(cabecalho, nome) {
  for (const parte of String(cabecalho || '').split(';')) {
    const i = parte.indexOf('=');
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return '';
}

function usuario(env) {
  return {
    id: valor(env.USUARIO_ID) || 'proprietario',
    email: valor(env.USUARIO_EMAIL) || 'proprietario@' + dominio(env),
    nome: valor(env.USUARIO_NOME) || 'Proprietário',
  };
}

// Confere o cookie de sessão. Devolve o usuário ou null.
async function verificarSessao(env, cabecalhoCookie) {
  if (!temSenha(env)) return null;
  const token = lerCookie(cabecalhoCookie, COOKIE);
  const partes = token.split('.');
  if (partes.length !== 3 || partes[0] !== 'v1' || !/^\d{10,13}$/.test(partes[1])) return null;
  const expira = Number(partes[1]);
  if (!(expira > Date.now())) return null;
  if (!iguais(await assinar(env, partes[1]), partes[2])) return null;
  return usuario(env);
}

async function novoCookie(env) {
  const expira = String(Date.now() + DURACAO_S * 1000);
  const token = 'v1.' + expira + '.' + await assinar(env, expira);
  return COOKIE + '=' + token + '; Domain=' + dominio(env) + '; Path=/; Max-Age=' + DURACAO_S + '; Secure; HttpOnly; SameSite=Lax';
}
const cookieVazio = env => COOKIE + '=; Domain=' + dominio(env) + '; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax';

// Só aceita voltar para o próprio serviço ou para um site do mesmo domínio.
function destinoSeguro(env, bruto, origemPropria) {
  const texto = String(bruto || '');
  if (!texto) return '';
  try {
    if (texto.startsWith('/') && !texto.startsWith('//')) {
      const u = new URL(texto, origemPropria);
      return u.origin === origemPropria ? u.pathname + u.search : '';
    }
    const u = new URL(texto);
    const d = dominio(env);
    if (u.protocol !== 'https:' || u.username || u.password || u.port) return '';
    if (u.hostname !== d && !u.hostname.endsWith('.' + d)) return '';
    return u.href;
  } catch { return ''; }
}

// Limite de tentativas: grava só as senhas erradas.
async function contarErro(env, id, janela) {
  const linha = await env.DB.prepare(
    'INSERT INTO tentativas (id, janela, total, atualizado) VALUES (?, ?, 1, ?) ' +
    'ON CONFLICT(id) DO UPDATE SET total = total + 1, atualizado = excluded.atualizado RETURNING total'
  ).bind(id, janela, new Date().toISOString()).first();
  return Number(linha?.total ?? 0);
}
async function lerErros(env, id) {
  const linha = await env.DB.prepare('SELECT total FROM tentativas WHERE id = ?').bind(id).first();
  return Number(linha?.total ?? 0);
}
async function janelas(env, request) {
  const agora = new Date();
  const hora = agora.toISOString().slice(0, 13);
  const quarto = hora + ':' + String(Math.floor(agora.getUTCMinutes() / 15));
  const ip = request.headers.get('cf-connecting-ip') || 'desconhecido';
  const origem = hex(await sha256(valor(env.SEGREDO_SESSAO) + ':' + ip)).slice(0, 32);
  return { idOrigem: 'o:' + quarto + ':' + origem, janelaOrigem: quarto, idGeral: 'g:' + hora, janelaGeral: hora };
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function pagina(env, { titulo, corpo, status = 200, cookie }) {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(titulo)}</title>
<style>
:root{color-scheme:light dark;--fundo:#f4f6f9;--cartao:#fff;--texto:#16202c;--suave:#5b6878;--linha:#d5dbe3;--acao:#0b5cad;--acaoTexto:#fff;--erro:#b3261e;--ok:#17663a}
@media (prefers-color-scheme:dark){:root{--fundo:#0d1319;--cartao:#161e27;--texto:#e8eef5;--suave:#9aa8b8;--linha:#2b3744;--acao:#5aa9f5;--acaoTexto:#06121f;--erro:#ff8a80;--ok:#7bd8a0}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--fundo);color:var(--texto);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{width:100%;max-width:420px;background:var(--cartao);border:1px solid var(--linha);border-radius:14px;padding:26px 22px}
h1{font-size:1.3rem;line-height:1.25;margin:0 0 6px}
p{margin:0 0 14px;color:var(--suave)}
label{display:block;font-weight:600;margin:16px 0 6px}
input[type=password]{width:100%;font:inherit;padding:12px;border:1px solid var(--linha);border-radius:10px;background:transparent;color:inherit}
input[type=password]:focus{outline:3px solid color-mix(in srgb,var(--acao) 35%,transparent);border-color:var(--acao)}
button,.botao{display:inline-block;width:100%;margin-top:16px;padding:13px 16px;font:inherit;font-weight:600;text-align:center;text-decoration:none;border:0;border-radius:10px;background:var(--acao);color:var(--acaoTexto);cursor:pointer}
.botao.secundario{background:transparent;color:var(--acao);border:1px solid var(--linha)}
.aviso{margin:14px 0 0;padding:10px 12px;border-radius:10px;border:1px solid var(--linha);color:var(--texto);font-size:.95rem}
.aviso.erro{border-color:var(--erro);color:var(--erro)}
.aviso.ok{border-color:var(--ok);color:var(--ok)}
ul{margin:0 0 6px;padding-left:20px;color:var(--suave)}
small{display:block;margin-top:18px;color:var(--suave)}
</style>
</head>
<body>
<main>
${corpo}
</main>
</body>
</html>`;
  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    // form-action inclui os sites do domínio porque o Chrome aplica a regra também ao redirecionamento pós-envio.
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://*." + dominio(env) + "; frame-ancestors 'none'; base-uri 'none'",
    'x-frame-options': 'DENY',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'same-origin',
  });
  if (cookie) headers.append('set-cookie', cookie);
  return new Response(html, { status, headers });
}

function paginaEntrada(env, { destino, erro = '', status = 200 }) {
  const corpo = `<h1>Acesso aos sites</h1>
<p>Digite a senha de acesso para liberar, neste aparelho, as funções de inteligência artificial e os dados salvos dos sites.</p>
<form method="post" action="/entrar" autocomplete="on">
<input type="hidden" name="return_to" value="${esc(destino)}">
<label for="senha">Senha de acesso</label>
<input id="senha" name="senha" type="password" required autofocus autocomplete="current-password" maxlength="200">
${erro ? `<div class="aviso erro" role="alert">${esc(erro)}</div>` : ''}
<button type="submit">Entrar</button>
</form>
<small>A entrada vale por 30 dias neste aparelho e serve para todos os sites.</small>`;
  return pagina(env, { titulo: 'Acesso aos sites', corpo, status });
}

function paginaPendente(env) {
  const corpo = `<h1>Acesso ainda não configurado</h1>
<p>Falta definir a senha de acesso. Isso é feito uma única vez, pelo proprietário, no painel da Cloudflare:</p>
<ul>
<li>Workers &amp; Pages → <strong>acesso-sites</strong> → Settings → Variables and Secrets</li>
<li>Editar o segredo <strong>SENHA_DE_ACESSO</strong> (mínimo de 8 caracteres) e salvar</li>
</ul>
<small>Enquanto a senha não for definida, as funções que dependem de entrada ficam desligadas. O conteúdo aberto dos sites continua disponível.</small>`;
  return pagina(env, { titulo: 'Acesso ainda não configurado', corpo, status: 503 });
}

function paginaLiberado(env, { destino }) {
  const portal = valor(env.PORTAL) || 'https://portal.' + dominio(env) + '/';
  const corpo = `<h1>Acesso liberado</h1>
<p>Este aparelho está liberado para usar as funções de inteligência artificial e os dados salvos dos sites.</p>
<div class="aviso ok">Chave da OpenAI: ${temChave(env) ? 'configurada.' : 'ainda não configurada — as funções de IA informam isso na própria tela.'}</div>
${destino ? `<a class="botao" href="${esc(destino)}">Voltar ao site</a>` : `<a class="botao" href="${esc(portal)}">Abrir o Portal</a>`}
<a class="botao secundario" href="/sair">Sair deste aparelho</a>`;
  return pagina(env, { titulo: 'Acesso liberado', corpo });
}

function redirecionar(para, cookie) {
  const headers = new Headers({ location: para, 'cache-control': 'no-store' });
  if (cookie) headers.append('set-cookie', cookie);
  return new Response(null, { status: 303, headers });
}

async function entrar(request, env, url) {
  if (request.headers.get('origin') !== url.origin) return paginaEntrada(env, { destino: '', erro: 'Abra esta página diretamente e tente de novo.', status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 4096) return paginaEntrada(env, { destino: '', erro: 'Solicitação inválida.', status: 413 });
  let senha = '', destino = '';
  try {
    const form = await request.formData();
    senha = String(form.get('senha') ?? '');
    destino = destinoSeguro(env, form.get('return_to'), url.origin);
  } catch { return paginaEntrada(env, { destino: '', erro: 'Solicitação inválida.', status: 400 }); }
  if (!temSenha(env)) return paginaPendente(env);
  if (!env.DB) return paginaEntrada(env, { destino, erro: 'O controle de tentativas está indisponível. Tente mais tarde.', status: 503 });

  const j = await janelas(env, request);
  let bloqueado = false;
  try { bloqueado = (await lerErros(env, j.idOrigem)) >= LIMITE_POR_ORIGEM || (await lerErros(env, j.idGeral)) >= LIMITE_GERAL; }
  catch { return paginaEntrada(env, { destino, erro: 'O controle de tentativas está indisponível. Tente mais tarde.', status: 503 }); }
  if (bloqueado) return paginaEntrada(env, { destino, erro: 'Muitas tentativas. Aguarde 15 minutos e tente de novo.', status: 429 });

  const confere = iguais(hex(await sha256('senha:' + senha)), hex(await sha256('senha:' + valor(env.SENHA_DE_ACESSO))));
  if (!confere) {
    try { await contarErro(env, j.idOrigem, j.janelaOrigem); await contarErro(env, j.idGeral, j.janelaGeral); } catch {}
    return paginaEntrada(env, { destino, erro: 'Senha incorreta.', status: 401 });
  }
  return redirecionar(destino || '/', await novoCookie(env));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const caminho = url.pathname.replace(/\/+$/, '') || '/';

    if (caminho === '/estado' && request.method === 'GET') {
      const sessao = !!(await verificarSessao(env, request.headers.get('cookie')));
      return Response.json({ sessao, senha: temSenha(env), chave: temChave(env) }, { headers: { 'cache-control': 'no-store' } });
    }
    if (caminho === '/sair' && (request.method === 'GET' || request.method === 'POST')) {
      return redirecionar(destinoSeguro(env, url.searchParams.get('return_to'), url.origin) || '/', cookieVazio(env));
    }
    if (caminho === '/entrar' && request.method === 'POST') return entrar(request, env, url);
    if (caminho === '/' && (request.method === 'GET' || request.method === 'HEAD')) {
      const destino = destinoSeguro(env, url.searchParams.get('return_to'), url.origin);
      if (!temSenha(env)) return paginaPendente(env);
      if (await verificarSessao(env, request.headers.get('cookie'))) {
        return destino && destino !== '/' ? redirecionar(destino) : paginaLiberado(env, { destino: '' });
      }
      return paginaEntrada(env, { destino });
    }
    if (caminho === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
    return new Response('Página não encontrada', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  },
};

// Ligação interna: só os Workers da mesma conta com o vínculo "ACESSO" chamam estes métodos.
export class Interno extends WorkerEntrypoint {
  // Devolve { id, email, nome } quando o cookie recebido é uma sessão válida; senão, null.
  async sessao(cabecalhoCookie) {
    try { return await verificarSessao(this.env, cabecalhoCookie); } catch { return null; }
  }
  // Devolve a chave da OpenAI configurada pelo proprietário; null enquanto não houver.
  async chave() { return temChave(this.env) ? valor(this.env.OPENAI_API_KEY) : null; }
  async estado() { return { senha: temSenha(this.env), chave: temChave(this.env) }; }
  // Tudo de uma vez, para uma única chamada por requisição do site.
  async contexto(cabecalhoCookie) {
    return { usuario: await this.sessao(cabecalhoCookie), chave: await this.chave(), senha: temSenha(this.env) };
  }
}
