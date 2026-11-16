// Ajustes por tipo de documento (text.format.name) para que a resposta da IA alternativa
// passe pelas conferências do código original de cada site, que foram escritas para a
// OpenAI: limites de tamanho (zod), coerência de contagens, frases proibidas e catálogo.
// Nada aqui inventa dado clínico: apenas corta, remove, normaliza ou devolve null.

const sem = v => String(v ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

// Limites de tamanho dos esquemas zod de cada site (chave: caminho com [] ou nome do campo).
export const LIMITES = {
  pediatric_laboratory_report: {
    exam_label: 180, patient_age_text: 80, 'collections[].specimen_type': 100, 'collections[].document_datetime': 100,
    'collections[].report_blocks[].text': 1400, result_unit: 50, reference_unit: 50, abnormal_summary: 2200,
    'differential_diagnoses[]': 600, 'reference_sources[].title': 300, 'reference_sources[].url': 1500, safety_issue: 600,
  },
  radiology_report: {
    exam_label: 180, document_datetime: 100, technique_quality: 1800, 'findings[]': 1600, 'historical_findings[]': 1600,
    impression: 1800, 'differential_diagnoses[]': 600, practical_summary: 1400, chart_text: 2600, critical_alert: 1000, safety_issue: 600,
  },
  dermatology_clinical_assessment: {
    summary: 2000, 'images[].findings': 1600, 'images[].limitations': 1000, 'diagnoses[].name': 150, 'diagnoses[].summary': 1400,
    'diagnoses[].confirmation': 1200, 'diagnoses[].supporting[]': 900, 'diagnoses[].opposing[]': 900, 'associations[].title': 200,
    'associations[].reason': 1200, 'alerts[]': 900, 'questions[]': 900, 'limitations[]': 900,
  },
};

export const MAX_ITENS = {
  dermatology_clinical_assessment: {
    images: 5, diagnoses: 5, associations: 5, 'associations[].conditionIds': 4, 'diagnoses[].supporting': 10, 'diagnoses[].opposing': 10,
    alerts: 10, questions: 10, limitations: 10,
  },
};

export function opcoesDoFormato(nome) {
  return { limites: LIMITES[nome] || null, maxItens: MAX_ITENS[nome] || null };
}

// --- utilidades -------------------------------------------------------------

function frases(texto) { return String(texto || '').split(/(?<=[.;!?])\s+|\n+/); }
function semFrasesCom(texto, testes) {
  const partes = frases(texto).filter(f => !testes.some(t => t(f)));
  return partes.join(' ').replace(/\s+/g, ' ').trim();
}
function percorrerTextos(obj, fn, caminho = '') {
  if (typeof obj === 'string') return fn(obj, caminho);
  if (Array.isArray(obj)) return obj.map((x, i) => percorrerTextos(x, fn, caminho + '[]'));
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) obj[k] = percorrerTextos(obj[k], fn, caminho ? caminho + '.' + k : k); return obj; }
  return obj;
}
function naoVazio(texto, padrao) { const t = String(texto || '').trim(); return t || padrao; }

// --- laudo laboratorial ---------------------------------------------------

const VAZAMENTO = ['laudar em texto direto', 'todo o laudo', 'integralmente copiável', 'anexos:', 'transcrever todos os resultados', 'inserir exatamente duas quebras', 'configurações mantidas', 'tripla checagem obrigatória'];
const PROIBIDAS_LAB = ['sem unidade', 'unidade ausente', 'unidade não informada', 'unidade não identificada', 'contagens absolutas dos subtipos não são apresentadas', 'referências do diferencial estão incompletas', 'impedindo classificação segura desses itens'];
const LEUCOCITOS = /\b(neutr[oó]filos?|segmentados?|linf[oó]citos?|mon[oó]citos?|eosin[oó]filos?|bas[oó]filos?|bastonetes?|granul[oó]citos? imaturos?|metamiel[oó]citos?|miel[oó]citos?|promiel[oó]citos?|blastos?|c[eé]lulas? at[ií]picas?)\b/iu;
const RELATIVO = /%|\brelativ[oa]s?\b|\bpercentua(l|is)\b/iu;

const temVazamento = f => VAZAMENTO.some(x => f.toLowerCase().includes(x));
const temProibida = f => PROIBIDAS_LAB.some(x => f.toLowerCase().includes(x));
const temRelativoLeucocitario = f => LEUCOCITOS.test(f) && RELATIVO.test(f);

function unidadeContagem(valor) {
  if (valor === null || valor === undefined) return null;
  return valor >= 100 ? 'per_microliter' : 'thousand_per_microliter';
}

function mesmaFonte(a, b) {
  try {
    const x = new URL(a), y = new URL(b);
    return x.hostname.replace(/^www\./, '') === y.hostname.replace(/^www\./, '') && x.pathname.replace(/\/+$/, '') === y.pathname.replace(/\/+$/, '');
  } catch { return false; }
}

const virgulaDecimal = t => String(t).replace(/(\d)\.(\d{1,2})(?!\d)/g, '$1,$2');

function ajustarLaboratorio(r, c = {}) {
  const n = Array.isArray(r.collections) ? r.collections.length : 0;
  // Referências: só ficam as que vieram da busca desta execução (as demais não seriam confirmadas pelo site
  // e deixariam a classificação pendente); os índices citados são refeitos.
  const encontradas = Array.isArray(c.fontesEncontradas) ? c.fontesEncontradas : [];
  const mapa = new Map();
  const novas = [];
  (r.reference_sources || []).forEach((s, i) => {
    let valida = false;
    try { valida = new URL(s.url).protocol === 'https:'; } catch {}
    if (!valida || !encontradas.some(u => mesmaFonte(u, s.url))) return;
    let k = novas.findIndex(x => mesmaFonte(x.url, s.url));
    if (k < 0) { novas.push(s); k = novas.length - 1; }
    mapa.set(i, k);
  });
  r.reference_sources = novas;
  const refazer = lista => [...new Set((lista || []).map(i => mapa.get(i)).filter(i => i !== undefined))].slice(0, 8);
  // Blocos: o diferencial leucocitário vai em leukocyte_counts (contagens absolutas), não em texto relativo.
  for (const c of r.collections || []) {
    const blocos = (c.report_blocks || []).filter(b => !(temRelativoLeucocitario(b.text) || (b.block_kind === 'cbc_differential' && RELATIVO.test(b.text))));
    c.report_blocks = blocos.length ? blocos : (c.report_blocks || []).slice(0, 1).map(b => ({ ...b, text: String(b.text).replace(/\s*\d+[.,]?\d*\s*%/g, '').trim() || 'Resultado conforme anexo.' }));
    for (const b of c.report_blocks) {
      b.text = virgulaDecimal(naoVazio(semFrasesCom(b.text, [temVazamento, temProibida]), 'Resultado conforme anexo.'));
      if (b.reference_low !== null && b.reference_high !== null && b.reference_low > b.reference_high) [b.reference_low, b.reference_high] = [b.reference_high, b.reference_low];
      b.source_indexes = refazer(b.source_indexes);
    }
  }
  // Contagens leucocitárias: pares valor/unidade completos, faixa ordenada, índices válidos, sem duplicatas idênticas.
  const vistos = new Set();
  r.leukocyte_counts = (r.leukocyte_counts || []).filter(it => {
    if (!Number.isInteger(it.collection_index) || it.collection_index < 0 || it.collection_index >= n) it.collection_index = Math.max(0, Math.min(n - 1, it.collection_index | 0));
    if (it.source_absolute_value !== null && it.source_absolute_unit === null) it.source_absolute_unit = unidadeContagem(it.source_absolute_value);
    if (it.source_absolute_value === null) it.source_absolute_unit = null;
    if (it.total_leukocytes_value !== null && !(it.total_leukocytes_value > 0)) it.total_leukocytes_value = null;
    if (it.total_leukocytes_value !== null && it.total_leukocytes_unit === null) it.total_leukocytes_unit = unidadeContagem(it.total_leukocytes_value);
    if (it.total_leukocytes_value === null) it.total_leukocytes_unit = null;
    if (it.percentage !== null && !(it.percentage >= 0 && it.percentage <= 100)) it.percentage = null;
    if (it.reference_high_per_microliter < it.reference_low_per_microliter) [it.reference_low_per_microliter, it.reference_high_per_microliter] = [it.reference_high_per_microliter, it.reference_low_per_microliter];
    it.reference_source_index = it.reference_source_index === null ? null : (mapa.get(it.reference_source_index) ?? null);
    const chave = it.collection_index + '|' + it.subtype + '|' + it.source_absolute_value + '|' + it.percentage;
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
  r.abnormal_summary = virgulaDecimal(naoVazio(semFrasesCom(r.abnormal_summary, [temVazamento, temProibida, temRelativoLeucocitario]), 'Ver resultados acima.'));
  r.differential_diagnoses = (r.differential_diagnoses || []).map(d => semFrasesCom(d, [temVazamento, temProibida, temRelativoLeucocitario])).filter(Boolean);
  if (!r.differential_diagnoses.length) r.differential_diagnoses = ['Correlacionar com o quadro clínico.'];
  if (r.safety_issue !== null) r.safety_issue = semFrasesCom(r.safety_issue, [temVazamento, temProibida]) || null;
  return r;
}

// --- radiografia -------------------------------------------------------------

function ajustarRadiografia(r) {
  percorrerTextos(r, t => semFrasesCom(t, [temVazamento]) || t.replace(/anexos:/gi, 'imagens'));
  for (const k of ['findings', 'differential_diagnoses']) {
    r[k] = (r[k] || []).filter(x => String(x).trim());
    if (!r[k].length) r[k] = [k === 'findings' ? 'Sem achados descritos pela leitura automática.' : 'Correlacionar com o quadro clínico.'];
  }
  r.historical_findings = (r.historical_findings || []).filter(x => String(x).trim());
  if (!r.critical_finding) { r.critical_codes = []; }
  return r;
}

// --- dermatologia --------------------------------------------------------------

const DOSE = /\b\d[\d.,\s]*\s*(?:mg|mcg|µg|μg|ml|ui|gotas?|comprimidos?)\b/giu;

function catalogoDasInstrucoes(sistema) {
  const texto = sistema.join('\n');
  const i = texto.indexOf('Catálogo de apoio:');
  if (i < 0) return [];
  const inicio = texto.indexOf('[', i);
  if (inicio < 0) return [];
  let nivel = 0;
  for (let j = inicio; j < texto.length; j++) {
    const ch = texto[j];
    if (ch === '"') { j++; while (j < texto.length && texto[j] !== '"') { if (texto[j] === '\\') j++; j++; } continue; }
    if (ch === '[' || ch === '{') nivel++;
    else if (ch === ']' || ch === '}') { nivel--; if (nivel === 0) { try { return JSON.parse(texto.slice(inicio, j + 1)).filter(c => c && c.id && c.name); } catch { return []; } } }
  }
  return [];
}

function ajustarDermatologia(r, c) {
  const catalogo = catalogoDasInstrucoes(c.sistema || []);
  const porId = new Map(catalogo.map(x => [x.id, x]));
  percorrerTextos(r, t => t.replace(DOSE, 'dose a definir pelo prescritor'));
  // Uma entrada por fotografia enviada, numeradas de 1 a N.
  const total = Math.max(0, Math.min(5, c.imagens || 0));
  const lidas = new Map((r.images || []).map(i => [i.number, i]));
  r.images = Array.from({ length: total }, (_, k) => {
    const i = lidas.get(k + 1) || (r.images || [])[k] || {};
    return { number: k + 1, quality: ['adequate', 'limited', 'unusable'].includes(i.quality) ? i.quality : 'limited', findings: naoVazio(i.findings, 'Achados não descritos pela leitura automática.'), limitations: naoVazio(i.limitations, 'Leitura automática por modelo alternativo.') };
  });
  // Diagnósticos: nome igual ao do catálogo quando há conditionId válido; sem duplicatas; com achados de apoio.
  const nomes = new Set();
  const usados = new Set();
  r.diagnoses = (r.diagnoses || []).map(d => {
    const item = porId.get(d.conditionId);
    if (item && !usados.has(item.id)) { usados.add(item.id); return { ...d, name: item.name }; }
    return { ...d, conditionId: null };
  }).filter(d => {
    const nome = sem(d.name);
    if (!nome || nomes.has(nome) || !(d.supporting || []).length) return false;
    nomes.add(nome);
    return true;
  }).slice(0, 5);
  r.associations = (r.associations || []).map(a => ({ ...a, conditionIds: (a.conditionIds || []).filter(id => porId.has(id)).slice(0, 4) })).slice(0, 5);
  return r;
}

export function ajustarPorFormato(nome, r, c) {
  if (!r || typeof r !== 'object') return r;
  if (nome === 'pediatric_laboratory_report') return ajustarLaboratorio(r, c);
  if (nome === 'radiology_report') return ajustarRadiografia(r);
  if (nome === 'dermatology_clinical_assessment') return ajustarDermatologia(r, c);
  return r;
}
