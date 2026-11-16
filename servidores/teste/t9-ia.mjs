// Testes locais da ponte de IA (sem rede): IA e PubMed simulados.
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(AQUI, '..', 'dist', 'teste-ia-sites.mjs');
await build({ entryPoints: [path.join(AQUI, '..', 'src', 'ia', 'ia-sites.mjs')], outfile: saida, bundle: true, format: 'esm', platform: 'neutral', alias: { 'cloudflare:workers': path.join(AQUI, 'stub-cloudflare-workers.mjs') }, logLevel: 'error' });
const mod = await import(pathToFileURL(saida).href + '?v=' + Date.now());
const stub = await import(pathToFileURL(path.join(AQUI, 'stub-cloudflare-workers.mjs')).href);
const nucleo = await import(pathToFileURL(path.join(AQUI, '..', 'src', 'ia', 'nucleo.mjs')).href);

let ok = 0; const t = async (nome, fn) => { await fn(); ok++; console.log('ok', nome); };

// IA simulada: registra chamadas e responde conforme o modelo/pedido.
const chamadas = [];
const AI = {
  async run(modelo, p) {
    chamadas.push({ modelo, p });
    const sistema = p.messages?.[0]?.content || '';
    if (/consultas de busca para o PubMed/.test(sistema)) return { response: { consultas: ['croup dexamethasone children'] }, usage: { prompt_tokens: 50, completion_tokens: 10 } };
    if (/leitor de anexos médicos/.test(sistema)) return { response: 'Hemoglobina 9,4 g/dL (ref. 11,5 a 15,5)', usage: { prompt_tokens: 300, completion_tokens: 40 } };
    if (p.tools?.length) return { response: null, tool_calls: [{ name: 'calcular_dose', arguments: { mg_kg_dia: 50, peso_kg: 12, tomadas: 2 } }], usage: { prompt_tokens: 80, completion_tokens: 20 } };
    if (p.response_format?.type === 'json_schema') return { response: { exame: 'Hemograma', achados: 'anemia', gravidade: 'Moderada', extra: 1 }, usage: { prompt_tokens: 100, completion_tokens: 30 } };
    return { response: 'Dexametasona 0,15 a 0,6 mg/kg dose única. Fonte: https://pubmed.ncbi.nlm.nih.gov/111/', usage: { prompt_tokens: 120, completion_tokens: 40 } };
  },
  async toMarkdown(docs) { return docs.map(d => ({ name: d.name, data: '# Laudo\nTSH 8,2 mUI/L' })); },
};

// PubMed simulado
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.includes('esearch.fcgi')) return Response.json({ esearchresult: { idlist: ['111', '222'] } });
  if (u.includes('esummary.fcgi')) return Response.json({ result: { 111: { title: 'Dexamethasone for croup.', fulljournalname: 'Cochrane', pubdate: '2018 Aug' }, 222: { title: 'Croup &amp; corticosteroids', source: 'Pediatrics', pubdate: '2020' } } });
  if (u.includes('efetch.fcgi')) return new Response('<PubmedArticleSet><PubmedArticle><MedlineCitation><PMID Version="1">111</PMID><Abstract><AbstractText Label="BACKGROUND">Croup is common &lt;5y.</AbstractText></Abstract></MedlineCitation></PubmedArticle></PubmedArticleSet>');
  return new Response('não', { status: 404 });
};

// Durable Object simulado
const objetos = new Map();
const TRABALHOS = {
  idFromName: n => n,
  get(id) {
    if (!objetos.has(id)) { const a = stub.criarArmazenamento(); const o = new mod.TrabalhoIA(a, env); o._a = a; objetos.set(id, o); }
    return objetos.get(id);
  },
};
const env = { AI, TRABALHOS };
const interno = new mod.Interno({}, env);
const post = corpo => interno.fetch(new Request('https://ia.interno/v1/responses', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) }));

const esquema = { type: 'object', additionalProperties: false, required: ['exame', 'achados', 'gravidade'], properties: { exame: { type: 'string' }, achados: { type: 'array', minItems: 1, items: { type: 'string' } }, gravidade: { type: 'string', enum: ['leve', 'moderada', 'grave'] } } };

await t('json_schema: ajusta ao esquema (array, enum, extra removido)', async () => {
  const r = await (await post({ input: [{ role: 'developer', content: 'x' }, { role: 'user', content: [{ type: 'input_text', text: 'Hb 9' }] }], text: { format: { type: 'json_schema', schema: esquema } } })).json();
  assert.equal(r.status, 'completed');
  const j = JSON.parse(r.output.at(-1).content[0].text);
  assert.deepEqual(j, { exame: 'Hemograma', achados: ['anemia'], gravidade: 'moderada' });
  assert.equal(r.output_text, r.output.at(-1).content[0].text);
});

await t('imagem e PDF: leitura de visão e conversão em texto chegam ao modelo de texto', async () => {
  chamadas.length = 0;
  const r = await (await post({ input: [{ role: 'user', content: [{ type: 'input_text', text: 'Lauda' }, { type: 'input_image', image_url: 'data:image/png;base64,AAAA' }, { type: 'input_file', filename: 'a.pdf', file_data: 'data:application/pdf;base64,JVBERi0=' }] }], text: { format: { type: 'json_schema', schema: esquema } } })).json();
  assert.equal(r.status, 'completed');
  const final = chamadas.find(c => c.p.response_format?.type === 'json_schema');
  const ultimo = final.p.messages.at(-1).content;
  assert.match(ultimo, /LEITURA DOS ANEXOS/); assert.match(ultimo, /Hemoglobina 9,4/); assert.match(ultimo, /TSH 8,2/);
});

await t('web_search: fontes do PubMed em web_search_call e anotações url_citation', async () => {
  const r = await (await post({ instructions: 'Cite.', input: 'dose dexametasona crupe', tools: [{ type: 'web_search' }], tool_choice: { type: 'web_search' } })).json();
  const ws = r.output.find(o => o.type === 'web_search_call');
  assert.ok(ws && ws.action.sources.length === 2);
  assert.equal(ws.action.sources[1].title, 'Croup & corticosteroids');
  const msg = r.output.find(o => o.type === 'message');
  assert.equal(msg.content[0].annotations.length, 1);
  assert.equal(msg.content[0].annotations[0].url, 'https://pubmed.ncbi.nlm.nih.gov/111/');
});

await t('function calling: devolve function_call com argumentos em texto', async () => {
  const r = await (await post({ input: 'calcule', tools: [{ type: 'function', name: 'calcular_dose', parameters: { type: 'object', properties: {} } }], tool_choice: 'auto' })).json();
  const fc = r.output.find(o => o.type === 'function_call');
  assert.equal(fc.name, 'calcular_dose'); assert.equal(JSON.parse(fc.arguments).peso_kg, 12); assert.ok(fc.call_id);
});

await t('conversa continuada: function_call_output e web_search_call anteriores viram contexto', async () => {
  chamadas.length = 0;
  const r = await (await post({ input: [{ role: 'user', content: 'calcule' }, { type: 'web_search_call', action: { sources: [{ url: 'https://exemplo.org/a', title: 'A' }] } }, { type: 'reasoning', encrypted_content: 'zz' }, { type: 'function_call', call_id: 'c1', name: 'calcular_dose', arguments: '{}' }, { type: 'function_call_output', call_id: 'c1', output: '{"mg_dia":600}' }, { type: 'message', role: 'developer', content: 'Revise.' }], tools: [{ type: 'web_search' }], tool_choice: 'auto' })).json();
  assert.equal(r.status, 'completed');
  const msgs = chamadas.at(-1).p.messages;
  assert.ok(msgs.some(m => m.role === 'tool' && m.content.includes('600')));
  assert.ok(msgs.some(m => m.role === 'assistant' && m.tool_calls));
  assert.match(msgs[0].content, /exemplo\.org\/a/);
  assert.ok(msgs.some(m => m.role === 'user' && /\[Instrução do sistema\]\nRevise\./.test(m.content)));
  assert.ok(!r.output.some(o => o.type === 'web_search_call'), 'não repete a busca quando já há fontes');
});

await t('background: queued → alarme → completed; consulta e cancelamento', async () => {
  const r = await (await post({ background: true, input: 'x', text: { format: { type: 'json_schema', schema: esquema } } })).json();
  assert.equal(r.status, 'queued'); assert.match(r.id, /^resp_wai[0-9a-f]+$/);
  let g = await (await interno.fetch(new Request('https://ia.interno/v1/responses/' + r.id))).json();
  assert.equal(g.status, 'queued');
  await objetos.get(r.id).alarm();
  g = await (await interno.fetch(new Request('https://ia.interno/v1/responses/' + r.id))).json();
  assert.equal(g.status, 'completed'); assert.equal(JSON.parse(g.output_text).gravidade, 'moderada');
  const r2 = await (await post({ background: true, input: 'y' })).json();
  const c = await (await interno.fetch(new Request('https://ia.interno/v1/responses/' + r2.id + '/cancel', { method: 'POST' }))).json();
  assert.equal(c.status, 'cancelled');
  const nf = await interno.fetch(new Request('https://ia.interno/v1/responses/resp_abc'));
  assert.equal(nf.status, 404);
});

await t('cota diária esgotada → 429 insufficient_quota', async () => {
  const antes = AI.run; AI.run = async () => { throw new Error('4006: you have used up your daily free allocation of 10,000 neurons'); };
  const r = await post({ input: 'x' }); const j = await r.json(); AI.run = antes;
  assert.equal(r.status, 429); assert.equal(j.error.code, 'insufficient_quota');
});

await t('coagir: esquema do laudo laboratorial (anyOf, null, padrão, inteiros, enums)', async () => {
  const LAB = { type: 'object', additionalProperties: false, required: ['exam_label', 'patient_date_of_birth_iso', 'collections', 'differential_diagnoses', 'reference_sources', 'safety_issue'], properties: { exam_label: { type: 'string' }, patient_date_of_birth_iso: { anyOf: [{ type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }, { type: 'null' }] }, collections: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, required: ['age_at_collection_days', 'report_blocks'], properties: { age_at_collection_days: { anyOf: [{ type: 'integer', minimum: 0 }, { type: 'null' }] }, report_blocks: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, required: ['text', 'block_kind', 'result_value', 'result_comparator'], properties: { text: { type: 'string' }, block_kind: { type: 'string', enum: ['cbc_differential', 'other'] }, result_value: { anyOf: [{ type: 'number' }, { type: 'null' }] }, result_comparator: { anyOf: [{ type: 'string', enum: ['<', '>', '='] }, { type: 'null' }] } } } } } } }, differential_diagnoses: { type: 'array', minItems: 1, items: { type: 'string' } }, reference_sources: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'url'], properties: { title: { type: 'string' }, url: { type: 'string' } } } }, safety_issue: { anyOf: [{ type: 'string' }, { type: 'null' }] } } };
  const bruto = { exam_label: 'Hemograma', patient_date_of_birth_iso: '12/03/2022', collections: [{ age_at_collection_days: '1620.4', report_blocks: [{ text: 'Hb 9,4', block_kind: 'Other', result_value: '9,4', result_comparator: 'igual', lixo: true }] }], differential_diagnoses: [], reference_sources: [{ title: 'X', url: 'https://pubmed.ncbi.nlm.nih.gov/1/' }] };
  const r = nucleo.coagir(bruto, LAB, LAB);
  assert.equal(r.patient_date_of_birth_iso, null);
  assert.equal(r.collections[0].age_at_collection_days, 1620);
  assert.deepEqual(r.collections[0].report_blocks[0], { text: 'Hb 9,4', block_kind: 'other', result_value: 9.4, result_comparator: null });
  assert.equal(r.differential_diagnoses.length, 1);
  assert.equal(r.safety_issue, null);
});

await t('coagir: url fora do enum remove o item (fontes restritas às encontradas)', async () => {
  const S = { type: 'object', additionalProperties: false, required: ['sources'], properties: { sources: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'url'], properties: { title: { type: 'string' }, url: { type: 'string', enum: ['https://a.org/1', 'https://b.org/2'] } } } } } };
  const r = nucleo.coagir({ sources: [{ title: 'A', url: 'https://a.org/1/' }, { title: 'Inventada', url: 'https://falsa.org/x' }] }, S, S);
  assert.deepEqual(r.sources, [{ title: 'A', url: 'https://a.org/1' }]);
});

await t('extrairJson: blocos markdown e texto ao redor', async () => {
  assert.deepEqual(nucleo.extrairJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(nucleo.extrairJson('Segue: {"a":2} fim'), { a: 2 });
  assert.equal(nucleo.extrairJson('sem json'), undefined);
});

await t('endereço público: 404 sem token de teste', async () => {
  const r = await mod.default.fetch(new Request('https://ia-sites.x/teste'), { TESTE_HASH: 'abc' });
  assert.equal(r.status, 404);
});

await t('background com imagem: responde na fila sem chamar modelo; leitura acontece no alarme', async () => {
  chamadas.length = 0;
  const r = await (await post({ background: true, input: [{ role: 'developer', content: 'Laudo laboratorial' }, { role: 'user', content: [{ type: 'input_text', text: 'Lauda' }, { type: 'input_image', image_url: 'data:image/png;base64,' + 'A'.repeat(1200000) }] }], text: { format: { type: 'json_schema', name: 'pediatric_laboratory_report', schema: esquema } } })).json();
  assert.equal(r.status, 'queued'); assert.equal(chamadas.length, 0, 'nenhuma chamada de IA antes de responder');
  const o = objetos.get(r.id);
  assert.equal(await o._a.storage.get('n'), 3, 'pedido guardado em 3 partes');
  await o.alarm();
  const g = await (await interno.fetch(new Request('https://ia.interno/v1/responses/' + r.id))).json();
  assert.equal(g.status, 'completed');
  const visao = chamadas.find(c => /leitor de anexos/.test(c.p.messages[0].content));
  assert.equal(visao.modelo, '@cf/meta/llama-4-scout-17b-16e-instruct', 'transcrição usa o modelo rápido');
  assert.equal(await o._a.storage.get('p0'), undefined, 'partes apagadas após concluir');
  assert.ok(g.usage.input_tokens >= 300, 'uso inclui a leitura dos anexos');
});

await t('tarefa interpretativa (radiografia) usa o modelo de visão mais capaz', async () => {
  assert.equal(nucleo.tarefaInterpretativa({ text: { format: { name: 'radiology_report' } } }), true);
  assert.equal(nucleo.tarefaInterpretativa({ text: { format: { name: 'pediatric_laboratory_report' } }, instructions: 'radiografia' }), false);
  assert.equal(nucleo.tarefaInterpretativa({ text: { format: { name: 'dermatology_clinical_assessment' } } }), true);
});

await t('ajustes do laudo laboratorial: limites, vazios, percentuais leucocitários e frases proibidas', async () => {
  const aj = await import(pathToFileURL(path.join(AQUI, '..', 'src', 'ia', 'ajustes.mjs')).href);
  const LAB = { type: 'object', additionalProperties: false, required: ['exam_label', 'collections', 'leukocyte_counts', 'abnormal_summary', 'differential_diagnoses', 'reference_sources', 'safety_issue'], properties: { exam_label: { type: 'string' }, collections: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, required: ['specimen_type', 'report_blocks'], properties: { specimen_type: { anyOf: [{ type: 'string' }, { type: 'null' }] }, report_blocks: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, required: ['text', 'block_kind', 'result_unit', 'reference_low', 'reference_high', 'source_indexes'], properties: { text: { type: 'string' }, block_kind: { type: 'string', enum: ['cbc_differential', 'other'] }, result_unit: { anyOf: [{ type: 'string' }, { type: 'null' }] }, reference_low: { anyOf: [{ type: 'number' }, { type: 'null' }] }, reference_high: { anyOf: [{ type: 'number' }, { type: 'null' }] }, source_indexes: { type: 'array', items: { type: 'integer' } } } } } } } }, leukocyte_counts: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['collection_index', 'subtype', 'source_absolute_value', 'source_absolute_unit', 'total_leukocytes_value', 'total_leukocytes_unit', 'percentage', 'reference_low_per_microliter', 'reference_high_per_microliter', 'reference_source_index'], properties: { collection_index: { type: 'integer' }, subtype: { type: 'string' }, source_absolute_value: { anyOf: [{ type: 'number' }, { type: 'null' }] }, source_absolute_unit: { anyOf: [{ type: 'string', enum: ['per_microliter', 'thousand_per_microliter', 'billion_per_liter'] }, { type: 'null' }] }, total_leukocytes_value: { anyOf: [{ type: 'number' }, { type: 'null' }] }, total_leukocytes_unit: { anyOf: [{ type: 'string', enum: ['per_microliter', 'thousand_per_microliter', 'billion_per_liter'] }, { type: 'null' }] }, percentage: { anyOf: [{ type: 'number' }, { type: 'null' }] }, reference_low_per_microliter: { type: 'number' }, reference_high_per_microliter: { type: 'number' }, reference_source_index: { anyOf: [{ type: 'integer' }, { type: 'null' }] } } } }, abnormal_summary: { type: 'string' }, differential_diagnoses: { type: 'array', minItems: 1, items: { type: 'string' } }, reference_sources: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'url'], properties: { title: { type: 'string' }, url: { type: 'string' } } } }, safety_issue: { anyOf: [{ type: 'string' }, { type: 'null' }] } } };
  const bruto = { exam_label: '  Hemograma  ', collections: [{ specimen_type: '  ', report_blocks: [{ text: 'Hemoglobina 9,4 g/dL', block_kind: 'other', result_unit: '', reference_low: 15.5, reference_high: 11.5, source_indexes: [0, 7] }, { text: 'Neutrófilos 72 % (10.656/mm³)', block_kind: 'cbc_differential', result_unit: '%', reference_low: null, reference_high: null, source_indexes: [] }] }], leukocyte_counts: [{ collection_index: 3, subtype: 'Neutrófilos', source_absolute_value: 10656, source_absolute_unit: null, total_leukocytes_value: '14.800', total_leukocytes_unit: null, percentage: 72, reference_low_per_microliter: 8000, reference_high_per_microliter: 1500, reference_source_index: 5 }], abnormal_summary: 'Anemia microcítica. Neutrófilos 72% acima do esperado. Anexos: 1 imagem. ' + 'x'.repeat(3000), differential_diagnoses: [], reference_sources: [{ title: 'A', url: 'https://pubmed.ncbi.nlm.nih.gov/1/' }, { title: 'B', url: 'não é url' }], safety_issue: '' };
  let r = nucleo.coagir(bruto, LAB, LAB, '', aj.opcoesDoFormato('pediatric_laboratory_report'));
  r = aj.ajustarPorFormato('pediatric_laboratory_report', r, { fontesEncontradas: ['https://pubmed.ncbi.nlm.nih.gov/1'] });
  assert.equal(r.exam_label, 'Hemograma');
  assert.equal(r.collections[0].specimen_type, null);
  assert.equal(r.collections[0].report_blocks.length, 1, 'bloco do diferencial relativo removido');
  const b = r.collections[0].report_blocks[0];
  assert.equal(b.result_unit, null); assert.deepEqual([b.reference_low, b.reference_high], [11.5, 15.5]); assert.deepEqual(b.source_indexes, [0]);
  const l = r.leukocyte_counts[0];
  assert.equal(l.collection_index, 0); assert.equal(l.source_absolute_unit, 'per_microliter'); assert.equal(l.total_leukocytes_value, 14800); assert.equal(l.total_leukocytes_unit, 'per_microliter');
  assert.deepEqual([l.reference_low_per_microliter, l.reference_high_per_microliter], [1500, 8000]); assert.equal(l.reference_source_index, null);
  assert.ok(r.abnormal_summary.length <= 2200, 'resumo dentro do limite');
  assert.ok(!/72%|Anexos:/i.test(r.abnormal_summary), 'sem percentual leucocitário nem vazamento');
  assert.equal(r.differential_diagnoses.length, 1); assert.equal(r.reference_sources.length, 1); assert.equal(r.safety_issue, null);
  assert.equal(b.text, 'Hemoglobina 9,4 g/dL', 'vírgula decimal');
  const r2 = aj.ajustarPorFormato('pediatric_laboratory_report', nucleo.coagir({ ...bruto, reference_sources: [{ title: 'Inventada', url: 'https://caliperproject.ca/x' }, { title: 'Achada', url: 'https://pubmed.ncbi.nlm.nih.gov/1/' }], collections: [{ specimen_type: null, report_blocks: [{ text: 'Hb 9.4', block_kind: 'other', result_unit: 'g/dL', reference_low: 11.5, reference_high: 15.5, source_indexes: [0, 1] }] }], leukocyte_counts: [{ ...bruto.leukocyte_counts[0], collection_index: 0, reference_source_index: 0 }] }, LAB, LAB, '', aj.opcoesDoFormato('pediatric_laboratory_report')), { fontesEncontradas: ['https://pubmed.ncbi.nlm.nih.gov/1'] });
  assert.deepEqual(r2.reference_sources.map(x => x.title), ['Achada'], 'fonte não encontrada na busca é removida');
  assert.deepEqual(r2.collections[0].report_blocks[0].source_indexes, [0], 'índice refeito (1 → 0)');
  assert.equal(r2.leukocyte_counts[0].reference_source_index, null, 'citação da fonte removida vira null');
});

await t('ajustes da dermatologia: uma entrada por foto, nomes do catálogo, sem doses', async () => {
  const aj = await import(pathToFileURL(path.join(AQUI, '..', 'src', 'ia', 'ajustes.mjs')).href);
  const sistema = ['Instruções...\nCatálogo de apoio:\n[{"id":"impetigo","name":"Impetigo"},{"id":"tinea","name":"Tinea corporis"}]\nReferências da base: []'];
  const r = aj.ajustarPorFormato('dermatology_clinical_assessment', { summary: 'Usar cefalexina 50 mg/kg/dia.', images: [{ number: 3, quality: 'ok', findings: '', limitations: 'x' }], diagnoses: [{ conditionId: 'impetigo', name: 'impetigo bolhoso', supporting: ['crostas'] }, { conditionId: 'xyz', name: 'Outra', supporting: ['a'] }, { conditionId: null, name: 'outra', supporting: ['b'] }, { conditionId: 'tinea', name: 'Tinea', supporting: [] }], associations: [{ conditionIds: ['impetigo', 'nao-existe'] }] }, { sistema, imagens: 2 });
  assert.equal(r.images.length, 2); assert.deepEqual(r.images.map(i => i.number), [1, 2]); assert.equal(r.images[0].quality, 'limited');
  assert.deepEqual(r.diagnoses.map(d => [d.conditionId, d.name]), [['impetigo', 'Impetigo'], [null, 'Outra']]);
  assert.deepEqual(r.associations[0].conditionIds, ['impetigo']);
  assert.ok(!/50 mg/.test(r.summary));
});

await t('citações 【n†url】 viram endereço simples', async () => {
  assert.equal(nucleo.limparCitacoes('Dose 0,6 mg/kg\u30107\u2020https://pubmed.ncbi.nlm.nih.gov/3285638/\u3011. Fim\u3010L1-L3\u3011'), 'Dose 0,6 mg/kg https://pubmed.ncbi.nlm.nih.gov/3285638/. Fim');
});

await t('pausa da chave paga: grava e lê por impressão; corpo inválido e falta de impressão recusados', async () => {
  const url = c => 'https://ia.interno/estado-openai' + (c ? '?chave=' + c : '');
  assert.deepEqual(await (await interno.fetch(new Request(url('ab12cd34ab12cd34')))).json(), {});
  const ate = Date.now() + 10 * 60 * 1000;
  const g = await (await interno.fetch(new Request(url('ab12cd34ab12cd34'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ate, motivo: '429 credit_balance_exhausted' }) }))).json();
  assert.equal(g.ok, true); assert.equal(g.ate, ate);
  const l = await (await interno.fetch(new Request(url('ab12cd34ab12cd34')))).json();
  assert.equal(l.ate, ate); assert.equal(l.motivo, '429 credit_balance_exhausted');
  assert.deepEqual(await (await interno.fetch(new Request(url('ffff0000ffff0000')))).json(), {});
  assert.equal((await interno.fetch(new Request(url('')))).status, 400);
  assert.equal((await interno.fetch(new Request(url('ab12'), { method: 'POST', body: 'x' }))).status, 400);
  const longe = await (await interno.fetch(new Request(url('ab12'), { method: 'POST', body: JSON.stringify({ ate: Date.now() + 999 * 3600000 }) }))).json();
  assert.ok(longe.ate <= Date.now() + 3600000 + 1000, 'pausa limitada a 1 hora');
});

console.log(`\n${ok} verificações da ponte de IA: todas passaram.`);
