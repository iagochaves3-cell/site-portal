// Núcleo da IA alternativa dos sites (Cloudflare Workers AI) com a mesma interface
// da API de respostas da OpenAI (POST /v1/responses, GET /v1/responses/{id}).
//
// Usado quando o proprietário não configurou a chave da OpenAI. O código original
// de cada site continua o mesmo: ele "fala" com a OpenAI, e o envoltório do site
// desvia a chamada para cá.
//
// Etapas:
//   1. Anexos: imagens são lidas por um modelo de visão (transcrição fiel e descrição
//      sistemática); PDFs são convertidos em texto (AI.toMarkdown).
//   2. Busca: quando o pedido inclui a ferramenta web_search, gera consultas e busca
//      no PubMed (E-utilities do NCBI); as fontes encontradas voltam como
//      web_search_call.action.sources, como na OpenAI.
//   3. Resposta: modelo de texto com as instruções originais do site; JSON conferido
//      e ajustado ao esquema pedido (text.format json_schema); ferramentas de função
//      (function calling) devolvidas como function_call.

import { ajustarPorFormato, opcoesDoFormato, LIMITES } from './ajustes.mjs';

export const MODELOS_PADRAO = {
  texto: '@cf/openai/gpt-oss-120b',
  textoReserva: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  visao: '@cf/google/gemma-4-26b-a4b-it',
  visaoRapida: '@cf/meta/llama-4-scout-17b-16e-instruct',
  visaoReserva: '@cf/mistralai/mistral-small-3.1-24b-instruct',
  rapido: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  rapidoReserva: '@cf/openai/gpt-oss-20b',
};

export function modelos(env = {}) {
  const v = k => (typeof env[k] === 'string' && env[k].trim()) || '';
  return {
    texto: v('IA_MODELO_TEXTO') || MODELOS_PADRAO.texto,
    textoReserva: v('IA_MODELO_TEXTO_RESERVA') || MODELOS_PADRAO.textoReserva,
    visao: v('IA_MODELO_VISAO') || MODELOS_PADRAO.visao,
    visaoRapida: v('IA_MODELO_VISAO_RAPIDA') || MODELOS_PADRAO.visaoRapida,
    visaoReserva: v('IA_MODELO_VISAO_RESERVA') || MODELOS_PADRAO.visaoReserva,
    rapido: v('IA_MODELO_RAPIDO') || MODELOS_PADRAO.rapido,
    rapidoReserva: MODELOS_PADRAO.rapidoReserva,
  };
}

export const agora = () => Math.floor(Date.now() / 1000);
export function novoId(prefixo) {
  const b = crypto.getRandomValues(new Uint8Array(12));
  return prefixo + [...b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export class ErroIA extends Error {
  constructor(mensagem, status = 502, codigo = 'server_error') { super(mensagem); this.status = status; this.codigo = codigo; }
}

const COTA = /(neurons?|daily free allocation|4006|free allocation|quota|limite di[aá]rio)/i;
export const eCota = e => COTA.test(String(e?.message || e || ''));

// ---------------------------------------------------------------------------
// 1. Normalização do pedido (formato da API de respostas)

export function textoDe(conteudo) {
  if (typeof conteudo === 'string') return conteudo;
  if (!Array.isArray(conteudo)) return conteudo && typeof conteudo === 'object' && typeof conteudo.text === 'string' ? conteudo.text : '';
  return conteudo.map(c => {
    if (typeof c === 'string') return c;
    if (c && (c.type === 'input_text' || c.type === 'output_text' || c.type === 'text' || c.type === 'summary_text')) return String(c.text ?? '');
    return '';
  }).filter(Boolean).join('\n');
}

export function normalizar(pedido) {
  const sistema = [];
  const turnos = [];
  const anexos = [];
  const fontesPrevias = [];
  if (typeof pedido.instructions === 'string' && pedido.instructions.trim()) sistema.push(pedido.instructions);
  let entrada = pedido.input;
  if (typeof entrada === 'string') entrada = [{ role: 'user', content: entrada }];
  for (const item of Array.isArray(entrada) ? entrada : []) {
    if (!item || typeof item !== 'object') continue;
    const tipo = item.type || (item.role ? 'message' : '');
    if (tipo === 'message') {
      const papel = item.role;
      if (papel === 'system' || papel === 'developer') {
        const t = textoDe(item.content);
        if (!t) continue;
        if (turnos.length) turnos.push({ role: 'user', content: '[Instrução do sistema]\n' + t });
        else sistema.push(t);
        continue;
      }
      const partes = [];
      if (Array.isArray(item.content)) {
        for (const c of item.content) {
          if (c && c.type === 'input_image') {
            const n = anexos.push({ tipo: 'imagem', url: String(c.image_url || c.file_url || '') });
            partes.push(`[Anexo ${n}: imagem]`);
          } else if (c && c.type === 'input_file') {
            const n = anexos.push({ tipo: 'arquivo', dados: String(c.file_data || ''), url: String(c.file_url || ''), nome: String(c.filename || '') });
            partes.push(`[Anexo ${n}: documento${c.filename ? ' ' + c.filename : ''}]`);
          } else {
            const t = textoDe([c]);
            if (t) partes.push(t);
          }
        }
      } else {
        const t = textoDe(item.content);
        if (t) partes.push(t);
      }
      turnos.push({ role: papel === 'assistant' ? 'assistant' : 'user', content: partes.join('\n') });
    } else if (tipo === 'web_search_call') {
      for (const f of item.action?.sources || []) if (f && typeof f.url === 'string') fontesPrevias.push({ url: f.url, title: String(f.title || '') });
    } else if (tipo === 'function_call') {
      turnos.push({ role: 'assistant', content: '', tool_calls: [{ id: String(item.call_id || item.id || novoId('call_')), type: 'function', function: { name: String(item.name || ''), arguments: typeof item.arguments === 'string' ? item.arguments : JSON.stringify(item.arguments ?? {}) } }] });
    } else if (tipo === 'function_call_output') {
      turnos.push({ role: 'tool', tool_call_id: String(item.call_id || ''), content: typeof item.output === 'string' ? item.output : JSON.stringify(item.output ?? '') });
    }
    // reasoning e demais tipos: ignorados
  }
  return { sistema, turnos, anexos, fontesPrevias };
}

export function ferramentas(pedido) {
  const lista = Array.isArray(pedido.tools) ? pedido.tools : [];
  const busca = lista.find(t => t && /^web_search/.test(String(t.type || '')));
  const funcoes = lista.filter(t => t && t.type === 'function' && (t.name || t.function?.name)).map(t => {
    const f = t.function || t;
    return { type: 'function', function: { name: String(f.name), description: String(f.description || ''), parameters: f.parameters || { type: 'object', properties: {} } } };
  });
  const tc = pedido.tool_choice;
  const forcaBusca = !!busca && (tc === 'required' || (tc && typeof tc === 'object' && /^web_search/.test(String(tc.type || ''))));
  const dominios = Array.isArray(busca?.filters?.allowed_domains) ? busca.filters.allowed_domains.map(String) : [];
  return { busca: !!busca, forcaBusca, dominios, funcoes };
}

export function compactar(pedido, n, leitura) {
  const ft = ferramentas(pedido);
  const formato = pedido.text?.format || {};
  const pedidoMax = Number(pedido.max_output_tokens) || 4096;
  return {
    sistema: n.sistema,
    turnos: n.turnos,
    leitura: leitura || '',
    imagens: n.anexos.filter(a => a.tipo === 'imagem').length,
    esquema: formato.type === 'json_schema' && formato.schema ? formato.schema : null,
    nomeEsquema: formato.name || '',
    formatoJson: formato.type === 'json_object',
    busca: ft.busca,
    forcaBusca: ft.forcaBusca,
    dominios: ft.dominios,
    funcoes: ft.funcoes,
    fontesPrevias: n.fontesPrevias,
    max_tokens: Math.max(512, Math.min(pedidoMax, pedido.background ? 16000 : 8000)),
    fundoPlano: !!pedido.background,
  };
}

// ---------------------------------------------------------------------------
// 2. Chamada aos modelos (com reserva)

export function textoDaIA(r) {
  if (r == null) return '';
  if (typeof r === 'string') return r;
  if (typeof r.response === 'string') return r.response;
  if (r.response && typeof r.response === 'object') return JSON.stringify(r.response);
  const m = r.choices?.[0]?.message;
  if (m) return typeof m.content === 'string' ? m.content : (m.content ? JSON.stringify(m.content) : '');
  if (typeof r.output_text === 'string') return r.output_text;
  if (Array.isArray(r.output)) {
    const partes = [];
    for (const o of r.output) for (const c of o?.content || []) if (c?.type === 'output_text' && typeof c.text === 'string') partes.push(c.text);
    return partes.join('\n');
  }
  return '';
}

export function chamadasDaIA(r) {
  const lista = r?.tool_calls || r?.choices?.[0]?.message?.tool_calls || [];
  return Array.isArray(lista) ? lista.filter(Boolean) : [];
}

function somarUso(uso, r) {
  if (!uso) return;
  const u = r?.usage || {};
  uso.entrada += Number(u.prompt_tokens || u.input_tokens || 0) || 0;
  uso.saida += Number(u.completion_tokens || u.output_tokens || 0) || 0;
}

export async function executarModelo(env, lista, parametros, uso, registro) {
  let ultimo;
  for (const modelo of lista) {
    try {
      const r = await env.AI.run(modelo, parametros);
      somarUso(uso, r);
      if (registro) registro.modelo = modelo;
      return r;
    } catch (e) {
      ultimo = e;
      if (eCota(e)) throw new ErroIA('Limite diário gratuito da IA da Cloudflare atingido. Tente novamente amanhã ou configure a chave da OpenAI.', 429, 'insufficient_quota');
      console.error(JSON.stringify({ evento: 'falha_modelo', modelo, mensagem: String(e?.message || e).slice(0, 300) }));
    }
  }
  throw new ErroIA('A IA alternativa não respondeu: ' + String(ultimo?.message || ultimo || 'erro desconhecido').slice(0, 200), 502, 'server_error');
}

// ---------------------------------------------------------------------------
// 3. Anexos

export function deDataUrl(dados) {
  const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dados || '');
  if (!m) return null;
  const tipo = m[1] || 'application/octet-stream';
  if (!m[2]) return { tipo, bytes: new TextEncoder().encode(decodeURIComponent(m[3])) };
  const bin = atob(m[3]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { tipo, bytes };
}

export function paraDataUrl(bytes, tipo) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return 'data:' + (tipo || 'application/octet-stream') + ';base64,' + btoa(s);
}

const PROMPT_VISAO = `Você é um leitor de anexos médicos. Sua leitura será usada por outro modelo, que NÃO vê as imagens, para redigir o documento final. Faça uma leitura fiel e completa, em português do Brasil:
- Transcreva literalmente todo o texto legível: nomes dos exames, valores, unidades, intervalos de referência, sinalizações (H, L, *, setas), datas e horários de coleta, material/amostra, método e laboratório. Preserve números exatamente como impressos (vírgula decimal, separador de milhar). Omita nome, documentos e endereço do paciente.
- Se for radiografia ou outro exame de imagem: incidência/projeção, qualidade técnica (inspiração, rotação, penetração) e descrição sistemática dos achados (vias aéreas, pulmões, pleura, coração e mediastino, diafragma, ossos, partes moles, dispositivos), com localização e lateralidade; separe o que é visível do que é incerto.
- Se for fotografia clínica (pele ou lesão): morfologia (lesão elementar, cor, tamanho estimado, bordas, superfície, distribuição, localização, sinais associados) com termos técnicos.
- Use [ilegível] quando não conseguir ler. Nunca invente valores ou achados. Não dê conclusões além do que se vê.`;

async function imagemComoDataUrl(url) {
  if (/^data:/i.test(url)) return url;
  if (!/^https?:\/\//i.test(url)) throw new Error('imagem sem endereço válido');
  const r = await fetch(url);
  if (!r.ok) throw new Error('imagem indisponível (' + r.status + ')');
  return paraDataUrl(new Uint8Array(await r.arrayBuffer()), (r.headers.get('content-type') || 'image/jpeg').split(';')[0]);
}

// Leitura que exige interpretação (radiografia, fotografia clínica) usa o modelo de visão mais
// capaz; transcrição de laudos e resultados usa o mais rápido.
export function tarefaInterpretativa(pedido) {
  const nome = String(pedido?.text?.format?.name || '');
  const sistema = [pedido?.instructions || '', ...(Array.isArray(pedido?.input) ? pedido.input.filter(i => i && (i.role === 'developer' || i.role === 'system')).map(i => textoDe(i.content)) : [])].join(' ').slice(0, 20000);
  return /radiolog|xray|x-ray|derma/i.test(nome) || (!/laborat/i.test(nome) && /radiograf|dermatol|les[aã]o (de pele|cut[aâ]nea)/i.test(sistema));
}

async function lerImagem(env, anexo, contexto, uso, interpretativo) {
  const m = modelos(env);
  const url = await imagemComoDataUrl(anexo.url);
  const lista = interpretativo ? [m.visao, m.visaoRapida, m.visaoReserva] : [m.visaoRapida, m.visao, m.visaoReserva];
  const r = await executarModelo(env, lista, {
    messages: [
      { role: 'system', content: PROMPT_VISAO },
      { role: 'user', content: [{ type: 'text', text: 'Contexto informado (resumo do pedido):\n' + String(contexto || '').slice(0, 2500) }, { type: 'image_url', image_url: { url } }] },
    ],
    max_tokens: 3000,
    temperature: 0.1,
  }, uso);
  return textoDaIA(r).trim() || '[sem texto legível]';
}

async function documentoParaTexto(env, anexo) {
  let bytes, tipo = 'application/pdf';
  if (anexo.dados && anexo.dados.startsWith('data:')) {
    const d = deDataUrl(anexo.dados);
    if (!d) throw new Error('documento em formato inválido');
    bytes = d.bytes; tipo = d.tipo;
  } else if (/^https?:\/\//i.test(anexo.url || '')) {
    const r = await fetch(anexo.url);
    if (!r.ok) throw new Error('documento indisponível (' + r.status + ')');
    bytes = new Uint8Array(await r.arrayBuffer());
    tipo = (r.headers.get('content-type') || tipo).split(';')[0];
  } else throw new Error('documento sem conteúdo');
  const nome = anexo.nome || (tipo === 'application/pdf' ? 'documento.pdf' : 'documento');
  const [res] = await env.AI.toMarkdown([{ name: nome, blob: new Blob([bytes], { type: tipo }) }]);
  const texto = String(res?.data || '').trim();
  return texto ? texto.slice(0, 80000) : '[documento sem camada de texto (provavelmente digitalizado); não foi possível ler]';
}

export async function lerAnexos(env, anexos, contexto, uso, interpretativo = false) {
  if (!anexos.length) return '';
  const partes = await Promise.all(anexos.map(async (a, i) => {
    try {
      if (a.tipo === 'arquivo') return `--- Anexo ${i + 1} (documento${a.nome ? ' ' + a.nome : ''}) ---\n` + await documentoParaTexto(env, a);
      return `--- Anexo ${i + 1} (imagem) ---\n` + await lerImagem(env, a, contexto, uso, interpretativo);
    } catch (e) {
      if (e instanceof ErroIA && e.codigo === 'insufficient_quota') throw e;
      return `--- Anexo ${i + 1} ---\n[não foi possível ler este anexo: ${String(e?.message || e).slice(0, 160)}]`;
    }
  }));
  return partes.join('\n\n');
}

// ---------------------------------------------------------------------------
// 4. Busca (PubMed / NCBI E-utilities)

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const espera = ms => new Promise(r => setTimeout(r, ms));

function desfazerEntidades(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

async function obter(url, tentativas = 2) {
  let ultimo;
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'sites-pediatria/1.0 (Cloudflare Worker)' } });
      if (r.ok) return r;
      ultimo = new Error('HTTP ' + r.status);
      if (r.status !== 429 && r.status < 500) break;
    } catch (e) { ultimo = e; }
    await espera(700);
  }
  throw ultimo;
}

export async function pubmedBuscar(termo, quantos = 4) {
  const q = new URLSearchParams({ db: 'pubmed', retmode: 'json', retmax: String(quantos), sort: 'relevance', term: termo, tool: 'sites-pediatria' });
  const r = await obter(EUTILS + 'esearch.fcgi?' + q);
  const d = await r.json();
  return (d?.esearchresult?.idlist || []).map(String);
}

export function resumosDoXml(xml) {
  const mapa = {};
  for (const bloco of String(xml || '').split(/<PubmedArticle[\s>]/).slice(1)) {
    const pmid = /<PMID[^>]*>(\d+)<\/PMID>/.exec(bloco)?.[1];
    if (!pmid) continue;
    const partes = [...bloco.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)].map(m => {
      const rotulo = /Label="([^"]+)"/.exec(m[1])?.[1];
      return (rotulo ? rotulo + ': ' : '') + desfazerEntidades(m[2]);
    });
    mapa[pmid] = partes.join(' ');
  }
  return mapa;
}

export async function pubmedDetalhes(ids) {
  if (!ids.length) return [];
  const r = await obter(EUTILS + 'esummary.fcgi?' + new URLSearchParams({ db: 'pubmed', retmode: 'json', id: ids.join(','), tool: 'sites-pediatria' }));
  const s = await r.json();
  let resumos = {};
  try {
    await espera(350);
    const x = await obter(EUTILS + 'efetch.fcgi?' + new URLSearchParams({ db: 'pubmed', id: ids.join(','), rettype: 'abstract', retmode: 'xml', tool: 'sites-pediatria' }));
    resumos = resumosDoXml(await x.text());
  } catch (e) { console.error(JSON.stringify({ evento: 'pubmed_resumos_falhou', mensagem: String(e?.message || e).slice(0, 200) })); }
  return ids.map(id => {
    const it = s?.result?.[id];
    if (!it || !it.title) return null;
    return { url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`, title: desfazerEntidades(it.title).replace(/\.$/, ''), revista: desfazerEntidades(it.fulljournalname || it.source || ''), ano: String(it.pubdate || '').slice(0, 4), resumo: String(resumos[id] || '').slice(0, 900) };
  }).filter(Boolean);
}

const PROMPT_CONSULTAS = `Gere de 1 a 3 consultas de busca para o PubMed (em inglês; termos MeSH quando possível; curtas e específicas) que encontrem as melhores evidências para responder ao pedido abaixo: diretrizes, revisões sistemáticas e estudos de referência. Quando houver exames laboratoriais pediátricos, inclua uma consulta sobre intervalos de referência pediátricos (ex.: "reference intervals children <analito>"). Responda somente em JSON: {"consultas": ["..."]}.`;

// Exames laboratoriais comuns (português → termo em inglês) para buscar intervalos de referência pediátricos.
const ANALITOS = [
  [/hemoglobina|hemat[oó]crito|\bvcm\b|\bhcm\b|\brdw\b|eritr[oó]citos|hem[aá]cias/i, 'hemoglobin hematocrit red cell indices'],
  [/leuc[oó]citos|neutr[oó]filos|linf[oó]citos|eosin[oó]filos|mon[oó]citos/i, 'leukocyte differential count'],
  [/plaquetas/i, 'platelet count'],
  [/ferritina|ferro s[eé]rico|transferrina/i, 'ferritin iron'],
  [/creatinina|ureia/i, 'creatinine urea'],
  [/s[oó]dio|pot[aá]ssio|cloro|magn[eé]sio|f[oó]sforo|c[aá]lcio/i, 'electrolytes sodium potassium calcium phosphate'],
  [/\btgo\b|\btgp\b|\bast\b|\balt\b|transaminase|bilirrubina|fosfatase alcalina|\bggt\b/i, 'liver enzymes bilirubin alkaline phosphatase'],
  [/\bpcr\b|prote[ií]na c reativa|procalcitonina|\bvhs\b/i, 'C-reactive protein procalcitonin'],
  [/glicose|glicemia|hemoglobina glicada/i, 'glucose'],
  [/\btsh\b|\bt4\b|tireo/i, 'thyroid TSH free T4'],
  [/gasometria|\bph\b|bicarbonato|lactato/i, 'blood gas bicarbonate lactate'],
];
function consultasDeAnalitos(texto) {
  const termos = ANALITOS.filter(([re]) => re.test(texto)).map(([, t]) => t);
  if (!termos.length) return [];
  const saida = [];
  for (let i = 0; i < termos.length && saida.length < 2; i += 2) saida.push(`pediatric reference intervals (${termos.slice(i, i + 2).join(' OR ')}) children`);
  return saida;
}

function consultasReserva(texto) {
  const palavras = String(texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z]{5,}/g) || [];
  const vistas = [];
  for (const p of palavras) if (!vistas.includes(p)) vistas.push(p);
  return vistas.length ? [vistas.slice(0, 6).join(' ')] : [];
}

export async function pesquisar(env, c, uso) {
  const m = modelos(env);
  const pedidoUsuario = c.turnos.filter(t => t.role === 'user').map(t => t.content).join('\n').slice(-3500);
  const contexto = [pedidoUsuario, c.leitura ? 'Leitura dos anexos:\n' + c.leitura.slice(0, 2500) : '', 'Instruções do site (trecho):\n' + c.sistema.join('\n').slice(0, 1500)].filter(Boolean).join('\n---\n');
  let consultas = [];
  try {
    const r = await executarModelo(env, [m.rapido, m.rapidoReserva], {
      messages: [{ role: 'system', content: PROMPT_CONSULTAS }, { role: 'user', content: contexto }],
      response_format: { type: 'json_schema', json_schema: { type: 'object', additionalProperties: false, required: ['consultas'], properties: { consultas: { type: 'array', maxItems: 3, items: { type: 'string' } } } } },
      max_tokens: 1200, temperature: 0.1,
    }, uso);
    const j = extrairJson(textoDaIA(r));
    consultas = (Array.isArray(j?.consultas) ? j.consultas : []).map(x => String(x).trim()).filter(Boolean).slice(0, 3);
  } catch (e) { if (e instanceof ErroIA && e.codigo === 'insufficient_quota') throw e; }
  for (const q of consultasDeAnalitos((c.leitura || '') + '\n' + pedidoUsuario)) if (consultas.length < 4 && !consultas.includes(q)) consultas.push(q);
  if (!consultas.length) consultas = consultasReserva(pedidoUsuario);
  const ids = [];
  for (const q of consultas) {
    try { for (const id of await pubmedBuscar(q, 4)) if (!ids.includes(id)) ids.push(id); } catch (e) { console.error(JSON.stringify({ evento: 'pubmed_busca_falhou', mensagem: String(e?.message || e).slice(0, 200) })); }
    await espera(350);
  }
  let fontes = [];
  try { fontes = await pubmedDetalhes(ids.slice(0, 10)); } catch (e) { console.error(JSON.stringify({ evento: 'pubmed_detalhes_falhou', mensagem: String(e?.message || e).slice(0, 200) })); }
  return { consultas, fontes };
}

function mesclarFontes(a, b) {
  const saida = [];
  for (const f of [...a, ...b]) if (f && f.url && !saida.some(x => x.url === f.url)) saida.push(f);
  return saida.slice(0, 24);
}

// ---------------------------------------------------------------------------
// 5. JSON: extração e ajuste ao esquema

export function extrairJson(texto) {
  let t = String(texto ?? '').trim();
  if (!t) return undefined;
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const i = t.indexOf('{'), j = t.lastIndexOf('}');
  if (i >= 0 && j > i) { try { return JSON.parse(t.slice(i, j + 1)); } catch {} }
  return undefined;
}

const INVALIDO = Symbol('invalido');

function resolver(s, raiz) {
  let atual = s;
  for (let i = 0; i < 20 && atual && typeof atual.$ref === 'string'; i++) {
    const caminho = atual.$ref.replace(/^#\/?/, '').split('/').filter(Boolean).map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'));
    let alvo = raiz;
    for (const p of caminho) alvo = alvo?.[p];
    atual = alvo;
  }
  return atual || {};
}

function tiposDe(s) {
  if (Array.isArray(s.type)) return s.type;
  if (typeof s.type === 'string') return [s.type];
  if (s.properties) return ['object'];
  if (s.items) return ['array'];
  if (Array.isArray(s.enum)) return [...new Set(s.enum.map(v => v === null ? 'null' : typeof v === 'number' ? 'number' : typeof v))];
  return [];
}

const semAcento = v => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

function casaEnum(lista, v) {
  if (v === null || v === undefined) return lista.includes(null) ? null : undefined;
  const texto = typeof v === 'string' ? v : String(v);
  if (lista.includes(texto)) return texto;
  const alvo = semAcento(texto).replace(/\/+$/, '');
  return lista.find(e => typeof e === 'string' && semAcento(e).replace(/\/+$/, '') === alvo);
}

export function padrao(s, raiz) {
  s = resolver(s, raiz);
  const alts = s.anyOf || s.oneOf;
  if (alts) {
    const r = alts.map(a => resolver(a, raiz));
    if (r.some(a => tiposDe(a).includes('null'))) return null;
    return padrao(r[0], raiz);
  }
  const t = tiposDe(s);
  if (t.includes('null')) return null;
  if (s.const !== undefined) return s.const;
  if (Array.isArray(s.enum) && s.enum.length) return s.enum.find(v => /indetermin|nao informado|desconhecid/i.test(semAcento(v))) ?? s.enum[0];
  switch (t[0]) {
    case 'string': return 'Não informado';
    case 'number': case 'integer': return typeof s.minimum === 'number' ? s.minimum : 0;
    case 'boolean': return false;
    case 'array': return Array.from({ length: s.minItems || 0 }, () => padrao(s.items || {}, raiz));
    case 'object': { const o = {}; for (const k of s.required || Object.keys(s.properties || {})) o[k] = padrao((s.properties || {})[k] || {}, raiz); return o; }
  }
  return null;
}

function tipoDoValor(v) {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v;
}

function compativel(s, v) {
  const t = tiposDe(s);
  if (!t.length) return true;
  const tv = tipoDoValor(v);
  if (t.includes(tv)) {
    if (tv === 'string' && Array.isArray(s.enum) && !s.enum.includes(v)) return false;
    if (tv === 'string' && s.pattern) { try { if (!new RegExp(s.pattern, 'u').test(v)) return false; } catch {} }
    return true;
  }
  if (tv === 'integer' && t.includes('number')) return true;
  return false;
}

function chaveDe(caminho) { return String(caminho || '').replace(/^\./, '').replace(/\[\d+\]/g, '[]'); }
function limiteDe(mapa, caminho) {
  if (!mapa) return 0;
  const k = chaveDe(caminho);
  return mapa[k] || mapa[k.split('.').pop()] || 0;
}
function cortar(texto, max) {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  const espaco = corte.lastIndexOf(' ');
  return (espaco > max * 0.6 ? corte.slice(0, espaco) : corte).replace(/[\s,;:.-]+$/, '') + '…';
}

export function coagir(v, s, raiz, caminho = '', op = {}) {
  s = resolver(s, raiz);
  const alts = s.anyOf || s.oneOf;
  if (alts) {
    const r = alts.map(a => resolver(a, raiz));
    if (v === null || v === undefined || (typeof v === 'string' && !v.trim())) {
      if (r.some(a => tiposDe(a).includes('null'))) return null;
    }
    const exato = r.find(a => compativel(a, v));
    if (exato) return coagir(v, exato, raiz, caminho, op);
    const naoNulo = r.find(a => !tiposDe(a).includes('null'));
    const aceitaNulo = r.some(a => tiposDe(a).includes('null'));
    if (aceitaNulo && naoNulo && Array.isArray(naoNulo.enum) && casaEnum(naoNulo.enum, v) === undefined) return null;
    const res = naoNulo ? coagir(v, naoNulo, raiz, caminho, op) : null;
    if (res !== INVALIDO && naoNulo && compativel(naoNulo, res)) return res;
    return r.some(a => tiposDe(a).includes('null')) ? null : res;
  }
  if (s.const !== undefined) return s.const;
  const t = tiposDe(s);
  if (!t.length) return v === undefined ? null : v;
  if ((v === null || v === undefined) && t.includes('null')) return null;
  const principal = t.find(x => x !== 'null') || t[0];
  switch (principal) {
    case 'object': {
      const o = v && typeof v === 'object' && !Array.isArray(v) ? v : {};
      const props = s.properties || {};
      const saida = {};
      for (const [k, ps] of Object.entries(props)) {
        if (Object.prototype.hasOwnProperty.call(o, k)) {
          const c = coagir(o[k], ps, raiz, caminho + '.' + k, op);
          if (c === INVALIDO) return INVALIDO;
          saida[k] = c;
        } else if ((s.required || []).includes(k) || s.additionalProperties === false) {
          saida[k] = padrao(ps, raiz);
        }
      }
      if (s.additionalProperties !== false && !s.properties) return o;
      if (s.additionalProperties && typeof s.additionalProperties === 'object') {
        for (const [k, val] of Object.entries(o)) if (!(k in props)) saida[k] = coagir(val, s.additionalProperties, raiz, caminho + '.' + k, op);
      }
      return saida;
    }
    case 'array': {
      let a = Array.isArray(v) ? v : (v === null || v === undefined || v === '' ? [] : [v]);
      a = a.map((x, i) => coagir(x, s.items || {}, raiz, caminho + '[' + i + ']', op)).filter(x => x !== INVALIDO);
      if (typeof s.maxItems === 'number') a = a.slice(0, s.maxItems);
      const maxExtra = limiteDe(op.maxItens, caminho);
      if (maxExtra) a = a.slice(0, maxExtra);
      if (s.uniqueItems) a = a.filter((x, i) => a.findIndex(y => JSON.stringify(y) === JSON.stringify(x)) === i);
      while (typeof s.minItems === 'number' && a.length < s.minItems) a.push(padrao(s.items || {}, raiz));
      return a;
    }
    case 'string': {
      let texto = v === null || v === undefined ? '' : typeof v === 'string' ? v : typeof v === 'object' ? JSON.stringify(v) : String(v);
      if (Array.isArray(s.enum) && s.enum.length) {
        const achado = casaEnum(s.enum, texto);
        if (achado !== undefined) return achado;
        if (/url|link|href/i.test(caminho.split('.').pop() || '')) return INVALIDO;
        return padrao(s, raiz);
      }
      texto = texto.trim();
      const limite = limiteDe(op.limites, caminho);
      if (limite && texto.length > limite) texto = cortar(texto, limite);
      if (typeof s.maxLength === 'number' && texto.length > s.maxLength) texto = cortar(texto, s.maxLength);
      if (!texto) return t.includes('null') ? null : padrao(s, raiz);
      if (typeof s.minLength === 'number' && texto.length < s.minLength) texto = texto.padEnd(s.minLength, '.');
      if (s.pattern) { try { if (!new RegExp(s.pattern, 'u').test(texto) && t.includes('null')) return null; } catch {} }
      return texto;
    }
    case 'number': case 'integer': {
      let n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')) : typeof v === 'boolean' ? Number(v) : NaN;
      if (!Number.isFinite(n)) return t.includes('null') ? null : padrao(s, raiz);
      if (principal === 'integer') n = Math.round(n);
      if (typeof s.minimum === 'number' && n < s.minimum) n = t.includes('null') ? null : s.minimum;
      if (n !== null && typeof s.maximum === 'number' && n > s.maximum) n = t.includes('null') ? null : s.maximum;
      if (n !== null && typeof s.exclusiveMinimum === 'number' && n <= s.exclusiveMinimum) n = t.includes('null') ? null : s.exclusiveMinimum + (principal === 'integer' ? 1 : 1e-9);
      return n;
    }
    case 'boolean': {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string') return /^(true|sim|yes|verdadeiro|1)$/i.test(v.trim());
      return Boolean(v);
    }
    case 'null': return null;
  }
  return v;
}

// ---------------------------------------------------------------------------
// 6. Montagem das mensagens e da resposta

function blocoFontes(fontes) {
  const linhas = fontes.map((f, i) => `[${i}] ${f.title}${f.revista ? ' — ' + f.revista : ''}${f.ano ? ', ' + f.ano : ''}\nURL: ${f.url}${f.resumo ? '\nResumo: ' + f.resumo : ''}`);
  return `RESULTADOS DA BUSCA NA WEB (PubMed, consultado nesta execução). Use somente estas fontes ao citar referências e copie título e URL exatamente como aparecem abaixo. Se nenhuma servir para um ponto, não invente referência: diga que não foi localizada.\n\n${linhas.join('\n\n')}`;
}

function instrucaoEsquema(esquema) {
  return `FORMATO DE SAÍDA OBRIGATÓRIO: responda apenas com um único objeto JSON válido (sem texto antes ou depois, sem markdown) que siga exatamente o JSON Schema abaixo — todas as propriedades obrigatórias presentes, nenhuma propriedade extra, tipos e valores permitidos respeitados; use null onde o esquema permitir e a informação não existir.\n${JSON.stringify(esquema)}`;
}

export function montarMensagens(c, fontes) {
  const sistema = [...c.sistema];
  if (fontes.length) sistema.push(blocoFontes(fontes));
  else if (c.busca) sistema.push('BUSCA NA WEB: nenhuma fonte foi localizada nesta execução. Não invente referências nem links.');
  if (c.esquema) {
    sistema.push(instrucaoEsquema(c.esquema));
    const limites = LIMITES[c.nomeEsquema];
    if (limites) sistema.push('LIMITES DE TAMANHO (caracteres, por campo): ' + Object.entries(limites).map(([k, v]) => k + ' ≤ ' + v).join('; ') + '. Campos de texto obrigatórios nunca vazios.');
  }
  else if (c.formatoJson) sistema.push('Responda apenas com um objeto JSON válido.');
  const mensagens = [{ role: 'system', content: sistema.filter(Boolean).join('\n\n') }];
  const turnos = c.turnos.map(t => ({ ...t }));
  if (c.leitura) {
    const bloco = '\n\n=== LEITURA DOS ANEXOS (feita por um modelo de visão; você não vê os anexos diretamente — trate esta leitura como o conteúdo dos anexos) ===\n' + c.leitura;
    const k = turnos.map(t => t.role).lastIndexOf('user');
    if (k >= 0) turnos[k].content = String(turnos[k].content || '') + bloco; else turnos.push({ role: 'user', content: bloco.trim() });
  }
  if (!turnos.some(t => t.role === 'user')) turnos.push({ role: 'user', content: 'Prossiga conforme as instruções.' });
  return mensagens.concat(turnos);
}

// Citações no estilo 【n†endereço】 (padrão do gpt-oss) viram o endereço simples, que os sites transformam em link.
export function limparCitacoes(texto) {
  return String(texto || '').replace(/\u3010\d+\u2020(https?:\/\/[^\u3011\s]+)\u3011/g, ' $1').replace(/\u3010[^\u3011]{0,80}\u3011/g, '');
}

export function anotacoes(texto, fontes) {
  const lista = [];
  for (const f of fontes) {
    let p = -1;
    while ((p = texto.indexOf(f.url, p + 1)) !== -1) lista.push({ type: 'url_citation', url: f.url, title: f.title, start_index: p, end_index: p + f.url.length });
  }
  return lista.sort((a, b) => a.start_index - b.start_index);
}

async function gerarJson(env, mensagens, c, uso, registro) {
  const m = modelos(env);
  let bruto = '';
  try {
    bruto = textoDaIA(await executarModelo(env, [m.texto], { messages: mensagens, response_format: { type: 'json_schema', json_schema: c.esquema }, max_tokens: c.max_tokens, temperature: 0.2 }, uso, registro));
  } catch (e) { if (e instanceof ErroIA && e.codigo === 'insufficient_quota') throw e; }
  let obj = extrairJson(bruto);
  if (obj === undefined) {
    try { bruto = textoDaIA(await executarModelo(env, [m.texto, m.textoReserva], { messages: mensagens, max_tokens: c.max_tokens, temperature: 0.2 }, uso, registro)); } catch (e) { if (e instanceof ErroIA && e.codigo === 'insufficient_quota') throw e; }
    obj = extrairJson(bruto);
  }
  if (obj === undefined && bruto) {
    const r = await executarModelo(env, [m.texto, m.textoReserva], {
      messages: [{ role: 'system', content: 'Converta o conteúdo a seguir em um único objeto JSON válido que siga exatamente este JSON Schema. Responda somente com o JSON.\n' + JSON.stringify(c.esquema) }, { role: 'user', content: String(bruto).slice(0, 60000) }],
      max_tokens: c.max_tokens, temperature: 0,
    }, uso, registro);
    obj = extrairJson(textoDaIA(r));
  }
  if (obj === undefined) throw new ErroIA('A IA alternativa não devolveu um resultado estruturado válido. Tente novamente.', 502, 'server_error');
  const op = opcoesDoFormato(c.nomeEsquema);
  let ajustado = coagir(obj, c.esquema, c.esquema, '', op);
  if (ajustado === INVALIDO) ajustado = padrao(c.esquema, c.esquema);
  ajustado = ajustarPorFormato(c.nomeEsquema, ajustado, c);
  return JSON.stringify(ajustado);
}

export async function concluir(env, c, id, usoInicial) {
  const m = modelos(env);
  const uso = { entrada: usoInicial?.entrada || 0, saida: usoInicial?.saida || 0 };
  const registro = { modelo: m.texto };
  let fontes = (c.fontesPrevias || []).slice(0, 24);
  let consultas = [];
  let buscou = false;
  if (c.busca && (c.forcaBusca || !fontes.length)) {
    try {
      const r = await pesquisar(env, c, uso);
      fontes = mesclarFontes(fontes, r.fontes);
      consultas = r.consultas;
      buscou = true;
    } catch (e) {
      if (e instanceof ErroIA && e.codigo === 'insufficient_quota') throw e;
      console.error(JSON.stringify({ evento: 'busca_falhou', mensagem: String(e?.message || e).slice(0, 200) }));
    }
  }
  c.fontesEncontradas = fontes.map(f => f.url);
  const mensagens = montarMensagens(c, fontes);
  let texto = '';
  let chamadas = [];
  if (c.esquema) {
    texto = await gerarJson(env, mensagens, c, uso, registro);
  } else {
    const parametros = { messages: mensagens, max_tokens: c.max_tokens, temperature: 0.3 };
    if (c.funcoes.length) parametros.tools = c.funcoes;
    if (c.formatoJson) parametros.response_format = { type: 'json_object' };
    const r = await executarModelo(env, [m.texto, m.textoReserva], parametros, uso, registro);
    texto = limparCitacoes(textoDaIA(r));
    chamadas = c.funcoes.length ? chamadasDaIA(r) : [];
  }
  const saida = [];
  if (buscou) saida.push({ type: 'web_search_call', id: novoId('ws_'), status: 'completed', action: { type: 'search', query: consultas.join(' | '), sources: fontes.map(f => ({ type: 'url', url: f.url, title: f.title })) } });
  for (const tc of chamadas) {
    const fn = tc.function || tc;
    const args = typeof fn.arguments === 'string' ? fn.arguments : JSON.stringify(fn.arguments ?? {});
    saida.push({ type: 'function_call', id: novoId('fc_'), call_id: String(tc.id || novoId('call_')), name: String(fn.name || ''), arguments: args, status: 'completed' });
  }
  if ((texto && texto.trim()) || !chamadas.length) {
    saida.push({ type: 'message', id: novoId('msg_'), status: 'completed', role: 'assistant', content: [{ type: 'output_text', text: texto || '', annotations: c.esquema || c.formatoJson ? [] : anotacoes(texto || '', fontes) }] });
  }
  return {
    id, object: 'response', created_at: agora(), status: 'completed', error: null, incomplete_details: null,
    model: 'cloudflare-workers-ai/' + registro.modelo,
    output: saida,
    output_text: texto || '',
    usage: { input_tokens: uso.entrada, output_tokens: uso.saida, total_tokens: uso.entrada + uso.saida },
    metadata: { provedor: 'cloudflare-workers-ai', busca: buscou ? 'pubmed' : 'nenhuma' },
  };
}

// Pedido completo → resposta (leitura dos anexos, busca e geração).
export async function processar(env, pedido, id) {
  const n = normalizar(pedido);
  const uso = { entrada: 0, saida: 0 };
  const leitura = n.anexos.length ? await lerAnexos(env, n.anexos, contextoDoPedido(n), uso, tarefaInterpretativa(pedido)) : '';
  return concluir(env, compactar(pedido, n, leitura), id, uso);
}

export function contextoDoPedido(n) {
  const usuario = n.turnos.filter(t => t.role === 'user').map(t => t.content).join('\n');
  return (usuario + '\n' + n.sistema.join('\n').slice(0, 1200)).slice(0, 4000);
}
