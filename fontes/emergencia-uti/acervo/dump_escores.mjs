// Extrai o catálogo de escores do site Escores Clínicos (módulos do próprio autor) como dados.
// Uso: node dump_escores.mjs <pasta scores-clinicos> <saída.json>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [dir, saida] = process.argv.slice(2);
const m = await import(pathToFileURL(path.resolve(dir, 'scores.mjs')).href);
const out = m.scores.map(s => ({
  id: s.id, name: s.name, subtitle: s.subtitle, specialty: s.specialty, population: s.population, range: s.range, scope: s.scope,
  formula: s.formula, limits: s.limits,
  fields: (s.fields || []).map(f => ({ label: f.label, hint: f.hint || '', min: f.min, max: f.max, options: f.options ? f.options.map(o => [o.value, o.label]) : null })),
  bands: Array.isArray(s.bands) ? s.bands.filter(b => Array.isArray(b)).map(b => b.slice(0, 4)) : null,
  sources: (s.sources || []).map(x => ({ title: x.title, url: x.url })),
  aliases: s.aliases || [], keywords: (s.keywords || []).concat(s.searchTerms || []), conditions: s.conditions || [],
  suspenso: s.calculationSuspended ? (s.calculationSuspensionReason || 'Cálculo suspenso na origem.') : '',
  externo: !!s.externalCalculator,
  status: s.review_status === 'DOCUMENTAL_VALIDADO' ? 'Validado documentalmente na origem' + (s.reviewDate ? ' em ' + s.reviewDate : '') : (s.reviewDate ? 'Revisto na origem em ' + s.reviewDate : '')
}));
fs.writeFileSync(saida, JSON.stringify(out));
console.log('escores:', out.length, '| com faixas:', out.filter(s => s.bands && s.bands.length).length, '| suspensos:', out.filter(s => s.suspenso).length, '| revisão:', m.REVIEW_DATE);
