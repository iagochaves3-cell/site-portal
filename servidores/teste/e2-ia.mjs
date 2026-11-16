// Fluxos reais no navegador (celular) com a OpenAI simulada: a tela publicada de cada site
// conversa com o servidor original remontado. Confere compatibilidade tela <-> servidor.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { criarAmbiente, SENHA, DOMINIO, CHAVE } from './ambiente.mjs';
import { abrirNavegador } from './navegador.mjs';
import { assert, contador } from './util.mjs';

const PORTA = 8443, { passo, fim } = contador('navegador: IA');
const sha = b => createHash('sha256').update(b).digest('hex');
const fonte = 'https://www.sbp.com.br/protocolo-teste';
const protocolo = {
  title: 'Bronquiolite viral aguda', summary: 'Resumo de teste do protocolo.', alerts: ['Alerta de teste'],
  sections: Array.from({ length: 25 }, (_, i) => ({ number: i + 1, points: ['Ponto do domínio ' + (i + 1)], source_ids: [1] })),
  medications: [{ name: 'Paracetamol', indication: 'Febre', regimen: '15 mg/kg/dose a cada 6 h', route: 'VO', presentation: 'Solução oral 200 mg/mL', preparation: 'Não se aplica', monitoring: 'Clínica', contraindications: 'Hipersensibilidade', renal_hepatic: 'Cautela em hepatopatia', off_label: 'Em bula', source_ids: [1],
    calculation: { basis: 'mg/kg/dose', dose: 15, absolute_max: 750, daily_max: 3000, doses_per_day: 4, stock_per_ml: 200, final_per_ml: null, duration_minutes: null, source_ids: [1] } }],
  sources: [{ id: 1, title: 'Protocolo de teste', url: fonte, publisher: 'SBP', date: '2026' }],
  limitations: ['Teste automatizado.'], review: { clinical: 'Conferência clínica de teste.', pharmaceutical: 'Conferência farmacêutica de teste.' },
};
const derm = { summary: 'Síntese de teste: quadro inflamatório em flexuras.', images: [{ number: 1, quality: 'adequate', findings: 'Mancha arredondada de teste.', limitations: 'Imagem sintética.' }], diagnoses: [], associations: [], alerts: [], questions: ['Há história de atopia?'], limitations: ['Teste automatizado.'] };
const raiox = { exam_label: 'Radiografia de tórax PA', document_datetime: null, estimated_age_group: 'infantil', estimated_sex: 'indeterminável', technique_quality: 'Técnica adequada.', findings: ['Parênquima pulmonar sem consolidações.'], historical_findings: [], impression: 'Sem alterações agudas evidentes.', differential_diagnoses: ['Sem diagnóstico diferencial adicional pelo exame.'], practical_summary: 'Radiografia sem alterações agudas.', chart_text: 'Radiografia de tórax sem alterações agudas evidentes.', critical_finding: false, critical_codes: [], critical_alert: null, safety_issue: null };
const mensagem = texto => [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: texto, annotations: [] }] }];
let passoAbordagem = 0, consultas = 0;
const openai = async p => {
  if (p.metodo === 'POST' && p.caminho === '/v1/responses') {
    const c = JSON.parse(p.corpo);
    if (c.model === 'gpt-5.4-2026-03-05') return { json: { id: 'resp_d', status: 'completed', output: mensagem(JSON.stringify(derm)) } };
    if (c.model === 'gpt-6.1-sol') { passoAbordagem++; return passoAbordagem % 2 === 1
      ? { json: { status: 'completed', output: [{ type: 'web_search_call', status: 'completed', action: { sources: [{ url: fonte, title: 'SBP — teste' }] } }] } }
      : { json: { status: 'completed', output: mensagem('Fundamentação resumida de teste, com fonte SBP.\n\nLimitações: teste automatizado.\n<<<BLOCO_FINAL_NAO_APLICAVEL>>>') } }; }
    if (c.model === 'gpt-5.5') return { json: { id: 'resp_g_' + (++consultas), status: 'queued' } };
    if (c.model === 'gpt-5.6') return { json: { id: 'resp_l_1', status: 'queued' } };
  }
  if (p.metodo === 'GET' && p.caminho.includes('/resp_g_')) return { json: { id: p.caminho.split('/').pop(), status: 'completed', output: [{ type: 'web_search_call', status: 'completed', action: { sources: [{ url: fonte }] } }, ...mensagem(JSON.stringify(protocolo))] } };
  if (p.metodo === 'GET' && p.caminho.includes('/resp_l_')) return { json: { id: 'resp_l_1', status: 'completed', output: mensagem(JSON.stringify(raiox)) } };
  return { status: 404, json: { error: { message: 'não previsto no teste' } } };
};

const a = await criarAmbiente({ porta: PORTA, openai });
const n = await abrirNavegador(PORTA);
const entrarPeloPortal = async page => {
  await page.goto('https://acesso-sites.' + DOMINIO + '/', { waitUntil: 'load' });
  await page.getByLabel('Senha de acesso').fill(SENHA); await page.getByRole('button', { name: 'Entrar' }).click(); await page.getByText('Acesso liberado').waitFor();
};
try {
  const page = await n.nova();

  await passo('Abordagens sem entrada: a tela mostra o aviso de função protegida; nada vai à OpenAI', async () => {
    await page.goto(a.origem('abordagem-clinica') + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.locator('textarea[name=question], #question').first().fill('Bronquiolite viral aguda');
    await page.getByRole('button', { name: 'Consultar' }).click();
    await page.getByText(/Função protegida por senha/).waitFor({ timeout: 15000 });
    assert.equal(a.registro.openai.length, 0);
    await page.screenshot({ path: '/tmp/e2-abordagem-sem-entrada.png' });
  });
  await passo('Guideliness sem entrada: a tela oferece "Entrar com ChatGPT"', async () => {
    await page.goto(a.origem('guideliness') + '/', { waitUntil: 'load' }); await page.waitForTimeout(1000);
    await page.locator('#diagnosis').fill('Bronquiolite viral aguda');
    await page.locator('#researchSubmit').click();
    await page.locator('#researchSignIn').waitFor({ state: 'visible', timeout: 15000 });
    assert.equal(a.registro.openai.length, 0);
  });

  await entrarPeloPortal(page);

  await passo('Abordagens com entrada: pergunta -> resposta com fonte na tela', async () => {
    await page.goto(a.origem('abordagem-clinica') + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.locator('textarea[name=question], #question').first().fill('Bronquiolite viral aguda');
    await page.getByRole('button', { name: 'Consultar' }).click();
    await page.getByText(/Fundamentação resumida de teste/).first().waitFor({ timeout: 20000 });
    const t = await n.texto(page); assert.match(t, /SBP/);
    await page.screenshot({ path: '/tmp/e2-abordagem.png' });
  });
  await passo('Guideliness com entrada: pesquisa -> revisão -> protocolo com dose calculada na tela', async () => {
    await page.goto(a.origem('guideliness') + '/', { waitUntil: 'load' }); await page.waitForTimeout(1000);
    await page.locator('#diagnosis').fill('Bronquiolite viral aguda'); await page.locator('#individualize > summary').click(); await page.locator('#age').fill('6 meses'); await page.locator('#weight').fill('7,5');
    await page.locator('#researchSubmit').click();
    await page.getByText('Dose calculada: 112,5 mg por dose').waitFor({ timeout: 30000 });
    assert.equal(consultas, 2, 'pesquisa + revisão');
    await page.screenshot({ path: '/tmp/e2-guideliness.png' });
  });
  await passo('Dermatologia com entrada: caso + fotografia -> síntese da IA na tela', async () => {
    await page.goto(a.origem('dermatologia') + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
    const numeros = page.locator('input[type=number]'); await numeros.nth(0).fill('6');
    await page.getByPlaceholder('Ex.: 16,5').fill('20');
    await page.locator('textarea').first().fill('Placas eritematosas pruriginosas em flexuras há 3 semanas.');
    await page.locator('input[type=file]').first().setInputFiles('teste/arquivos/foto.jpg');
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Enviar e analisar com IA' }).click();
    await page.waitForTimeout(1500);
    let t = await n.texto(page);
    if (!/Síntese de teste/.test(t)) { await page.screenshot({ path: '/tmp/e2-derm-meio.png', fullPage: false }); const b = await page.$$eval('button', bs => bs.filter(x => x.getBoundingClientRect().width > 0).map(x => x.textContent.trim().slice(0, 50))); console.log('     botões visíveis:', JSON.stringify(b.slice(0, 30))); }
    await page.getByText(/Síntese de teste/).first().waitFor({ timeout: 20000 });
    const p = a.registro.openai.filter(x => x.corpo && x.corpo.includes('gpt-5.4-2026-03-05')).at(-1); assert.equal(p.autorizacao, 'Bearer ' + CHAVE);
    const img = JSON.parse(p.corpo).input[0].content.find(x => x.type === 'input_image'); assert.match(img.image_url, /^data:image\/jpeg;base64,/);
    await page.screenshot({ path: '/tmp/e2-dermatologia.png' });
  });
  await passo('Laboratório e Raio X com entrada: PDF grande em partes -> laudo na tela', async () => {
    const original = await readFile('teste/arquivos/exame.pdf');
    await page.goto(a.origem('laboratorioeradiografia') + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.locator('button', { hasText: /^\s*Raio X\s*$/ }).first().click(); await page.waitForTimeout(500);
    await page.locator('input[type=file][aria-label="Anexar radiografias"]').setInputFiles('teste/arquivos/exame.pdf');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Preparar laudo' }).click();
    try { await page.getByText(/Sem alterações agudas evidentes/).first().waitFor({ timeout: 40000 }); }
    catch (e) { await page.screenshot({ path: '/tmp/e2-lab-falha.png', fullPage: true }); console.log('     texto:', (await n.texto(page)).slice(0, 900)); throw e; }
    const p = a.registro.openai.filter(x => x.corpo && x.corpo.includes('"gpt-5.6"')).at(-1); assert.equal(p.autorizacao, 'Bearer ' + CHAVE);
    const anexo = JSON.parse(p.corpo).input[1].content.find(x => x.type === 'input_file' || x.type === 'input_image');
    console.log('     anexo enviado à OpenAI como:', anexo.type, anexo.file_url ? 'link temporário' : (anexo.file_data ? 'conteúdo direto' : Object.keys(anexo).join(',')), '| partes gravadas:', a.registro.partes ?? '-');
    await page.screenshot({ path: '/tmp/e2-laboratorio.png' });
  });
  const graves = n.eventos.filter(e => !/^401 |status of 401|React error #418/.test(e));
  console.log('eventos não esperados:', JSON.stringify(graves, null, 1));
} finally { await n.fechar(); await a.fechar(); }
fim();
