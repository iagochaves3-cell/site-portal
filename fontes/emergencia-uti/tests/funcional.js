// Testes funcionais da página montada. Uso: node funcional.js [url]
// O acervo é carregado por HTTP: rodar contra um servidor (python3 -m http.server na pasta dist) ou contra o site publicado.
const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const RAIZ = path.resolve(__dirname, '..');
const URL0 = process.argv[2] || 'http://127.0.0.1:8765/index.html';
const ORIGEM = new URL(URL0).origin;
let ok = 0; const falhas = [];
function t(nome, cond, extra) { if (cond) ok++; else falhas.push(nome + (extra !== undefined ? ' → ' + JSON.stringify(extra).slice(0, 200) : '')); }

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 850 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const erros = [], pedidos = [];
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', e => erros.push(e.message));
  page.on('request', r => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith('blob:') && u.split('#')[0] !== URL0.split('#')[0] && !u.startsWith(ORIGEM + '/acervo/')) pedidos.push(u); });
  await page.goto(URL0); await page.waitForTimeout(300);
  const $v = (id) => page.evaluate(i => { const e = document.getElementById(i); return e ? (('value' in e && e.tagName !== 'BUTTON' && e.tagName !== 'LI') ? e.value : e.textContent) : null; }, id);
  const setar = (id, v) => page.evaluate(([i, v]) => { const e = document.getElementById(i); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, String(v)]);
  const ativa = () => page.evaluate(() => Array.from(document.querySelectorAll('section.tab.active')).map(s => s.id));

  // 1. carga
  t('sem erros de cálculo na carga', (await page.evaluate(() => window.__erros.length)) === 0);
  t('abre no Painel', JSON.stringify(await ativa()) === '["t-painel"]', await ativa());
  t('receita com paciente de exemplo traz alerta', (await $v('altCopy')).startsWith('ATENÇÃO: PACIENTE DE EXEMPLO'));
  t('selo de exemplo visível', await page.isVisible('#pacExemplo'));

  // 2. navegação pelas 30 abas
  const links = await page.$$eval('#navGroups a', as => as.map(a => a.getAttribute('href').slice(1)));
  t('30 abas no menu', links.length === 30, links.length);
  for (const id of links) {
    await page.click(`#navGroups a[href="#${id}"]`); await page.waitForTimeout(40);
    const a = await ativa();
    const info = await page.evaluate(i => { const s = document.getElementById(i); return { h1: s.querySelector('h1').textContent.trim(), tit: document.title, hash: location.hash, cur: (document.querySelector('#navGroups a[aria-current]') || {}).hash, tri: s.querySelector('.trilha').textContent, acoes: s.querySelectorAll('.hero-head .actions button').length, y: window.scrollY }; }, id);
    t(`aba ${id} abre sozinha`, a.length === 1 && a[0] === id, a);
    t(`aba ${id}: título, hash e menu coerentes`, info.h1.length > 3 && info.hash === '#' + id && info.cur === '#' + id && info.tit.includes('Emergência') && info.acoes === 2 && info.tri.length > 3 && info.y === 0, info);
  }
  // próxima/anterior
  await page.goto(URL0 + '#t-painel'); await page.waitForTimeout(150);
  let passos = 0;
  while (passos < 30) { const prox = await page.$('section.tab.active .pn a[href]:last-child'); const txt = prox ? await prox.textContent() : ''; if (!txt.startsWith('Próxima')) break; await prox.click(); await page.waitForTimeout(30); passos++; }
  t('"Próxima" percorre as 30 abas', passos === 29 && (await ativa())[0] === 't-acervo', passos);
  await page.goBack(); await page.waitForTimeout(80);
  t('botão Voltar do navegador retorna à aba anterior', (await ativa())[0] === 't-calc', await ativa());
  await page.goto(URL0 + '#t-sala'); await page.reload(); await page.waitForTimeout(200);
  t('link direto com #t-sala abre a Sala vermelha', (await ativa())[0] === 't-sala');
  await page.goto(URL0 + '#nao-existe'); await page.reload(); await page.waitForTimeout(200);
  t('hash inválido cai no Painel', (await ativa())[0] === 't-painel');

  // 3. busca
  await page.fill('#navSearch', 'atropina'); await page.waitForTimeout(60);
  let vis = await page.$$eval('#navGroups a', as => as.filter(a => !a.hasAttribute('hidden')).map(a => a.getAttribute('href')));
  t('busca "atropina" filtra as abas', vis.includes('#t-sala') && vis.includes('#t-via') && vis.includes('#t-intox') && vis.length < 30 && !vis.includes('#t-docs'), vis);
  await page.fill('#navSearch', 'sufocacao xyz'); await page.waitForTimeout(60);
  t('busca sem resultado mostra aviso', await page.isVisible('#navVazio'));
  await page.fill('#navSearch', 'Westley'); await page.press('#navSearch', 'Enter'); await page.waitForTimeout(80);
  t('Enter na busca abre a primeira aba', ['t-escores', 't-diag'].includes((await ativa())[0]), await ativa());
  await page.fill('#navSearch', 'CETOACIDOSE'); await page.waitForTimeout(60);
  vis = await page.$$eval('#navGroups a', as => as.filter(a => !a.hasAttribute('hidden')).map(a => a.getAttribute('href')));
  t('busca ignora maiúsculas e acentos', vis.includes('#t-metab'), vis);
  await page.fill('#navSearch', ''); await page.waitForTimeout(40);

  // 4. pesos rápidos
  const pesos = await page.$$eval('#wBtns button', bs => bs.map(b => b.getAttribute('data-kg')));
  t('8 pesos rápidos', pesos.length === 8, pesos);
  for (const p of pesos) {
    await page.click(`#wBtns button[data-kg="${p}"]`); await page.waitForTimeout(40);
    const st = await page.evaluate(() => ({ peso: document.getElementById('peso').value, press: document.querySelector('#wBtns button[aria-pressed="true"]').getAttribute('data-kg'), idade: document.getElementById('idade').value, aviso: !document.getElementById('pacAviso').hasAttribute('hidden'), susp: document.body.className, ex: !document.getElementById('pacExemplo').hasAttribute('hidden') }));
    t(`peso rápido ${p} kg aplica peso, idade típica e tira o selo de exemplo`, st.peso === p && st.press === p && !st.aviso && st.susp === '' && !st.ex, st);
  }
  t('aviso flutuante informa o ajuste de idade', (await $v('toast')).includes('Idade ajustada'), await $v('toast'));

  // 5. validação do paciente
  await setar('peso', '');
  t('peso vazio suspende os cálculos', (await page.evaluate(() => document.body.className)) === 'sem-paciente' && (await page.isVisible('#pacAviso')));
  await setar('peso', '300');
  t('peso de 300 kg é recusado', (await page.evaluate(() => document.body.className)) === 'sem-paciente');
  await setar('peso', '18'); await setar('idade', 'abc');
  t('idade ilegível suspende os cálculos', (await page.evaluate(() => document.body.className)) === 'sem-paciente');
  for (const [txt, esp] of [['18 meses', '18 meses'], ['2a 6m', '2 anos e 6 meses'], ['20 dias', '20 dias (recém-nascido)'], ['RN', '0 dias (recém-nascido)'], ['4', '4 anos'], ['1 ano e meio', '18 meses'], ['3 semanas', '21 dias (recém-nascido)'], ['7,5 anos', '7 anos e 6 meses']]) {
    await setar('peso', '18'); await setar('idade', txt);
    const lido = await $v('pacIdade');
    t(`idade "${txt}" é lida como "${esp}"`, lido.includes('Idade lida: ' + esp + '.'), lido);
  }
  await setar('peso', '18'); await setar('idade', '30 anos');
  t('peso e idade incoerentes geram aviso', (await page.isVisible('#pacAviso')) && (await $v('pacAviso')).includes('não combinam'));
  await page.click('#btnIdadeTip'); await page.waitForTimeout(50);
  t('botão do aviso aplica a idade típica', (await $v('idade')) === '5 anos' && !(await page.isVisible('#pacAviso')), await $v('idade'));
  await setar('idade', '4 anos');

  // 6. tema
  const tema0 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.click('#btnTema');
  const tema1 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  t('botão alterna o tema', tema0 !== tema1 && ['dark', 'light'].includes(tema1));
  await page.reload(); await page.waitForTimeout(200);
  t('tema persiste após recarregar', (await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === tema1);
  const chaves = await page.evaluate(() => Object.keys(localStorage).sort().join(','));
  t('só tema e aba ficam salvos (nenhum dado de paciente)', chaves === 'eu.aba,eu.tema', chaves);
  t('paciente volta ao exemplo após recarregar', (await $v('peso')) === '18' && (await page.isVisible('#pacExemplo')));
  if (tema1 === 'dark') await page.click('#btnTema');

  // 7. copiar
  await page.goto(URL0 + '#t-sala'); await page.waitForTimeout(150);
  await page.click('section.tab.active [data-copy]'); await page.waitForTimeout(150);
  const cop = await page.evaluate(() => navigator.clipboard.readText());
  t('copiar carta: texto vai para a área de transferência', cop.includes('Adrenalina IV/IO (PCR) | 0,01 mg/kg | 0,18 mg | 1,8 mL') && cop.includes('Paciente: 18 kg, 4 anos, masculino') && cop.includes('Tubo traqueal sem cuff | 5,0 mm'), cop.slice(0, 300));
  t('cópia não leva botões nem navegação', !cop.includes('Imprimir') && !cop.includes('Próxima:'), '');
  t('aviso de cópia aparece', (await $v('toast')).includes('Copiado'));
  t('window.copyTab continua disponível', (await page.evaluate(() => typeof window.copyTab)) === 'function');

  // 8. documentos
  await page.goto(URL0 + '#t-docs'); await page.waitForTimeout(150);
  t('documento com paciente de exemplo mantém os marcadores de peso e idade', (await $v('docTxt')).includes('Idade: [IDADE]   Peso: [PESO] kg') && (await page.isVisible('#docAviso')), (await $v('docTxt')).slice(0, 120));
  await page.click('#wBtns button[data-kg="18"]'); await page.waitForTimeout(60);
  t('peso rápido no exemplo sugere a idade típica (5 anos para 18 kg)', (await $v('idade')) === '5 anos');
  await setar('idade', '4 anos');
  const mods = await page.$$eval('#docSel option', os => os.map(o => o.value));
  t('8 modelos de documento', mods.length === 8, mods);
  for (const m of mods) { await setar('docSel', m); const x = await $v('docTxt'); t(`modelo ${m} sem marcador de data/peso pendente`, x.length > 150 && !/\[(PESO|IDADE|SEXO|DATA|DATA HORA|HORA)\]/.test(x), x.slice(0, 80)); }
  t('aviso de exemplo some com paciente real', !(await page.isVisible('#docAviso')));
  await setar('docSel', 'transf');
  t('modelo preenchido com o paciente', (await $v('docTxt')).includes('Idade: 4 anos   Peso: 18 kg   Sexo: masculino'));
  await page.fill('#docTxt', 'TEXTO EDITADO PELO MÉDICO');
  await setar('docSel', 'atest'); await setar('docSel', 'transf');
  t('edição do documento é preservada ao trocar de modelo', (await $v('docTxt')) === 'TEXTO EDITADO PELO MÉDICO');
  await setar('peso', '22');
  t('edição é preservada ao mudar o paciente, com aviso', (await $v('docTxt')) === 'TEXTO EDITADO PELO MÉDICO' && (await page.isVisible('#docAviso')));
  await page.click('#docCopiar'); await page.waitForTimeout(120);
  t('copiar documento copia o texto editado', (await page.evaluate(() => navigator.clipboard.readText())) === 'TEXTO EDITADO PELO MÉDICO');
  await page.click('#docRestaurar'); await page.waitForTimeout(60);
  t('restaurar modelo atualiza o peso', (await $v('docTxt')).includes('Peso: 22 kg') && !(await page.isVisible('#docAviso')));
  await setar('peso', '18');

  // 9. receita de alta
  await page.goto(URL0 + '#t-alta'); await page.waitForTimeout(150);
  t('receita com paciente real não traz o alerta de exemplo', !(await $v('altCopy')).includes('PACIENTE DE EXEMPLO'));
  for (const cen of ['febre', 'ivas', 'gea', 'sib']) { await setar('altCen', cen); const x = await $v('altCopy'); t(`receita ${cen} gerada`, x.includes('Peso: 18 kg. Idade: 4 anos.') && x.includes('192') && x.length > 500, x.slice(0, 90)); }
  await setar('altCen', 'febre');
  let rec = await $v('altCopy');
  t('receita: paracetamol 18 gotas e dipirona 7 gotas (10 mg/kg) para 18 kg', rec.includes('dar 18 gotas pela boca a cada 6 horas se houver febre (37,8') && rec.includes('Dipirona gotas 500 mg/mL: dar 7 gotas'), rec.slice(0, 400));
  t('receita sem ibuprofeno por padrão', !rec.includes('Ibuprofeno'));
  await page.check('#altIbu'); rec = await $v('altCopy');
  t('ibuprofeno entra só quando marcado, com alerta de dengue', rec.includes('Ibuprofeno gotas 100 mg/mL: dar 18 gotas') && rec.includes('suspeita de dengue'));
  await setar('peso', '5'); await setar('idade', '2 meses'); rec = await $v('altCopy');
  t('lactente de 2 meses: sem dipirona e sem ibuprofeno', !rec.includes('Dipirona gotas') && rec.includes('Ibuprofeno: não usar antes dos 6 meses') && rec.includes('dar 5 gotas'), rec.slice(0, 500));
  await page.uncheck('#altIbu');
  await setar('altCen', 'gea'); rec = await $v('altCopy');
  t('diarreia aos 2 meses: zinco 10 mg e sem ondansetrona', rec.includes('Zinco: 10 mg') && !rec.includes('Ondansetrona') && rec.includes('50 a 100 mL'), rec.slice(0, 500));
  await setar('peso', '18'); await setar('idade', '4 anos'); rec = await $v('altCopy');
  t('diarreia aos 4 anos: zinco 20 mg, ondansetrona 4 mg (off label)', rec.includes('Zinco: 20 mg') && rec.includes('Ondansetrona 4 mg') && rec.includes('off label') && rec.includes('100 a 200 mL'));
  await setar('altCen', 'sib'); rec = await $v('altCopy');
  t('chiado: prednisolona 6 mL para 18 kg', rec.includes('Prednisolona 3 mg/mL: dar 6 mL'), rec.slice(0, 500));
  await setar('peso', '8'); await setar('idade', '7 meses'); rec = await $v('altCopy');
  t('chiado aos 7 meses: orientações de bronquiolite, sem salbutamol nem prednisolona', rec.includes('Bronquiolite') && !rec.includes('Salbutamol') && !rec.includes('Prednisolona') && (await page.isVisible('#altNota')), rec.slice(0, 300));
  await setar('peso', '18'); await setar('idade', '4 anos');
  t('nota ao médico some fora da faixa', !(await page.isVisible('#altNota')));
  await setar('altCen', 'ivas'); rec = await $v('altCopy');
  t('resfriado: lavagem nasal e spray de NaCl 3% após a lavagem', rec.includes('Lavagem nasal com soro fisiológico 0,9%: 10 mL') && rec.includes('Depois da lavagem, spray nasal de cloreto de sódio 3%'));
  await page.click('section.tab.active [data-copy]'); await page.waitForTimeout(120);
  t('copiar receita copia só a receita', (await page.evaluate(() => navigator.clipboard.readText())).startsWith('RECEITA E ORIENTAÇÕES DE ALTA'));

  // 10. diagnóstico
  await page.goto(URL0 + '#t-diag'); await page.waitForTimeout(150);
  for (const s of ['febre', 'tosse', 'dispneia']) await page.check(`#diagChecks input[value="${s}"]`);
  let hip = await page.$$eval('#diagOut .hip h4', hs => hs.map(h => h.textContent));
  t('febre + tosse + dispneia: pneumonia em 1º, até 5 hipóteses', hip.length >= 2 && hip.length <= 5 && hip[0].includes('Pneumonia') && hip[0].includes('3 de 3'), hip);
  await page.click('#diagLimpar');
  t('limpar seleção zera as hipóteses', (await $v('diagOut')).includes('Marque ao menos'));
  for (const s of ['febre', 'mialgia', 'rash']) await page.check(`#diagChecks input[value="${s}"]`);
  hip = await page.$$eval('#diagOut .hip h4', hs => hs.map(h => h.textContent));
  t('febre + mialgia + exantema: dengue em 1º', hip[0].includes('Dengue'), hip);

  // 11. gasometria
  await page.goto(URL0 + '#t-exames'); await page.waitForTimeout(150);
  t('gasometria padrão: AG 20, delta-delta 1, Na corrigido 141,5, PaCO₂ 30–34', (await $v('gaAG')).startsWith('20,0') && (await $v('gaDD')) === '1,00' && (await $v('gaNaC')).startsWith('141,5') && (await $v('gaWinter')).startsWith('30–34'), [await $v('gaAG'), await $v('gaDD'), await $v('gaNaC'), await $v('gaWinter')]);
  await setar('gaHco', '24'); await setar('gaCl', '104'); await setar('gaNa', '140');
  t('gasometria normal: sem delta-delta nem Winter', (await $v('gaDD')) === 'Não se aplica' && (await $v('gaWinter')).startsWith('Não se aplica') && (await $v('gaAG')).startsWith('12,0'));
  await setar('gaNa', '');
  t('gasometria sem sódio pede o dado', (await $v('gaInt')).includes('Informe'));

  // 12. diluições
  await page.goto(URL0 + '#t-dil'); await page.waitForTimeout(150);
  const nInf = await page.$$eval('#dvDrug option', os => os.length);
  t('27 fármacos na calculadora', nInf === 27, nInf);
  await page.selectOption('#dvDrug', { label: 'Dexmedetomidina' }); await page.waitForTimeout(50);
  t('trocar o fármaco ajusta dose inicial e unidade', (await $v('dvDose')) === '0.2' && (await $v('dvDoseLbl')).includes('mcg/kg/h') && (await $v('dvOut')) === '0,9 mL/h', [await $v('dvDose'), await $v('dvDoseLbl'), await $v('dvOut')]);
  await setar('dvVol', '100');
  t('100 mL dobra a vazão', (await $v('dvOut')) === '1,8 mL/h', await $v('dvOut'));
  await setar('dvDose', '5');
  t('dose fora da faixa é destacada', (await page.evaluate(() => document.getElementById('dvOut').parentNode.className)).includes('crit') && (await $v('dvCap')).includes('fora da faixa'));
  await setar('dvDose', '');
  t('dose vazia não calcula', (await $v('dvOut')) === '—');
  const regra = await page.$$eval('#dvRegra tr', rs => rs.map(r => r.cells[1].textContent.replace(/ /g, ' ')));
  t('regra por peso: 5,4, 54, 10,8 e 108 mg para 18 kg', JSON.stringify(regra) === '["5,4 mg","54 mg","10,8 mg","108 mg"]', regra);

  // 13. choques, antibióticos, repertório
  await page.goto(URL0 + '#t-choques'); await page.waitForTimeout(150);
  for (const [v, tit] of [['sep', 'Choque séptico'], ['ana', 'Choque anafilático'], ['hipo', 'Choque hipovolêmico'], ['card', 'Choque cardiogênico'], ['neu', 'Choque neurogênico'], ['obs', 'Choque obstrutivo']]) { await setar('choqueSel', v); t(`choque ${v}`, (await $v('chTitulo')) === tit && (await page.$$eval('#chDetail li', l => l.length)) >= 3 && (await $v('chVaso')).length > 2); }
  await setar('choqueSel', 'ana');
  t('anafilaxia: adrenalina IM 0,18 mg = 0,18 mL', (await $v('chVaso')) === '0,18 mg = 0,18 mL' && (await $v('chVasoLbl')).includes('IM'), await $v('chVaso'));
  await page.goto(URL0 + '#t-atb'); await page.waitForTimeout(150);
  const sinds = await page.$$eval('#atbSind option', os => os.map(o => o.value));
  t('17 síndromes', sinds.length === 17, sinds.length);
  for (const s of sinds) { await setar('atbSind', s); const f = await page.$$eval('#atbTab tr', rs => rs.map(r => r.cells.length)); t(`síndrome ${s}: 5 linhas de 10 colunas`, f.length === 5 && f.every(x => x === 10), f); }
  await page.goto(URL0 + '#t-repertorio'); await page.waitForTimeout(150);
  t('repertório com 67 medicamentos', (await page.$$eval('#repTab tr', r => r.length)) === 67);
  await page.fill('#repBusca', 'amox'); await page.waitForTimeout(60);
  t('busca "amox" no repertório: 3 linhas', (await page.$$eval('#repTab tr', r => r.length)) === 3);
  await page.fill('#repBusca', 'antitermico'); await page.waitForTimeout(60);
  t('busca por classe sem acento', (await page.$$eval('#repTab tr', r => r.length)) === 3, await page.$$eval('#repTab tr', r => r.length));
  await page.fill('#repBusca', 'qqqq'); await page.waitForTimeout(60);
  t('repertório sem resultado mostra aviso', (await $v('repTab')).includes('Nenhum medicamento'));
  await page.fill('#repBusca', '');

  // 14. correção, soro, ventilação
  await page.goto(URL0 + '#t-corr'); await page.waitForTimeout(150);
  await setar('coNa', '118'); await setar('coNaAlvo', '130');
  t('alvo mais de 8 mEq/L acima do atual gera alerta', (await $v('coAviso')).includes('mais de 24 h') && (await $v('coDef')) === '130 mEq', [await $v('coAviso'), await $v('coDef')]);
  await setar('coNaAlvo', '110');
  t('alvo abaixo do atual não calcula déficit', (await $v('coDef')).includes('Sem déficit'));
  await setar('coNa', '122'); await setar('coNaAlvo', '130');
  await page.goto(URL0 + '#t-soro'); await page.waitForTimeout(150);
  await setar('soNa', '10'); await setar('soK', '10');
  t('soro com 10 mEq de sódio é sinalizado como hipotônico', (await $v('soTon')).includes('hipotônica') && (await $v('soNaF')) === '20 mEq/L' && (await $v('soVol')).startsWith('2,9 mL de NaCl 20% e 3,9 mL de KCl'), [await $v('soNaF'), await $v('soVol')]);
  await setar('soK', '30');
  t('potássio acima de 40 mEq/L é sinalizado', (await $v('soTon')).includes('acima de 40'));
  await setar('soNa', '68'); await setar('soK', '13');
  await page.goto(URL0 + '#t-vm'); await page.waitForTimeout(150);
  await setar('peso', '70'); await setar('idade', '30 anos'); await setar('vmAlt', '180');
  t('adulto de 180 cm: peso predito 75,1 kg e VC 451 mL', (await $v('vmPeso')) === '75,1 kg' && (await $v('vmVt')) === '451 mL', [await $v('vmPeso'), await $v('vmVt')]);
  await setar('sexo', 'F'); await setar('vmAlt', '160');
  t('mulher de 160 cm: peso predito 52,4 kg', (await $v('vmPeso')) === '52,4 kg', await $v('vmPeso'));
  t('linha da faixa etária destacada', (await page.$$eval('#vmTab tr.atual', r => r.map(x => x.cells[0].textContent))).join() === 'Adolescente e adulto');
  await setar('sexo', 'M'); await setar('peso', '18'); await setar('idade', '4 anos'); await setar('vmAlt', '');

  // 15. imagens
  await page.goto(URL0 + '#t-img'); await page.waitForTimeout(150);
  await page.fill('#imgTexto', 'RX de tórax: opacidade em base direita com broncograma aéreo e seio costofrênico velado. Linhas B difusas.');
  await page.click('#btnAnalisa');
  const ach = await page.$$eval('#imgOut li', ls => ls.map(l => l.textContent));
  t('análise de laudo reconhece consolidação, derrame e padrão intersticial', ach.length === 3 && ach[0].includes('Consolidação') && !ach.join(' ').includes('Pneumotórax'), ach);
  await page.fill('#imgTexto', 'texto sem termos'); await page.click('#btnAnalisa');
  t('análise sem termos conhecidos orienta o usuário', (await $v('imgOut')).includes('Nenhum termo reconhecido'));

  // 16. impressão
  await page.goto(URL0 + '#t-sala'); await page.waitForTimeout(150);
  await page.emulateMedia({ media: 'print' });
  const imp = await page.evaluate(() => { const d = s => getComputedStyle(document.querySelector(s)).display; return { side: d('#side'), top: d('#topbar'), head: d('#printHead'), txt: document.getElementById('printHead').textContent, tabs: Array.from(document.querySelectorAll('section.tab')).filter(s => getComputedStyle(s).display !== 'none').length, btn: d('section.tab.active .actions') }; });
  t('impressão: só a aba ativa, com cabeçalho do paciente e sem menus', imp.side === 'none' && imp.top === 'none' && imp.head === 'block' && imp.tabs === 1 && imp.btn === 'none' && imp.txt.includes('Paciente: 18 kg, 4 anos, masculino') && imp.txt.includes('Sala vermelha'), imp);
  await page.emulateMedia({ media: 'screen' });

  // 16b. painéis acrescentados na integração
  const tx = async sel => ((await page.textContent(sel)) || '').replace(/\u00a0/g, ' ');
  await page.goto(URL0 + '#t-via'); await page.waitForTimeout(150);
  t('sedação para procedimento: 14 fármacos em 5 grupos', (await page.$$eval('#procTab tr', r => r.length)) === 19 && (await page.$$eval('#procTab tr.grp', r => r.length)) === 5);
  t('sedação: cetamina IV 18–36 mg = 0,36–0,72 mL para 18 kg', (await tx('#procTab')).includes('18–36 mg') && (await tx('#procTab')).includes('0,36–0,72 mL'));
  t('sequência rápida: atropina nas duas ampolas e cisatracúrio', (await tx('#viaTab')).includes('(ampola 0,5 mg/mL) ou') && (await tx('#viaTab')).includes('Cisatracúrio'), (await tx('#viaTab')).slice(0, 200));
  await page.goto(URL0 + '#t-intox'); await page.waitForTimeout(150);
  const tox = await tx('#toxTab');
  t('doses tóxicas: paracetamol 2,7 g (150 mg/kg) e 13,5 mL das gotas para 18 kg', tox.includes('2,7 g') && tox.includes('13,5 mL das gotas de 200 mg/mL'), tox.slice(0, 160));
  t('lista de agentes fatais em uma dose', (await page.$$eval('#toxUm li', l => l.length)) === 14);
  await page.goto(URL0 + '#t-vm'); await page.waitForTimeout(150);
  t('modos ventilatórios: 9 modos no seletor', (await page.$$eval('#modoSel option', o => o.length)) === 9);
  t('modo VCV: volume de 108–144 mL para 18 kg', (await tx('#modoVt')).includes('108–144 mL'), await tx('#modoVt'));
  await setar('modoSel', 'vafo'); await page.waitForTimeout(60);
  t('modo VAFO: frequência de 8–10 Hz para 18 kg e sem volume corrente', (await page.textContent('#modoOut')).includes('8–10 Hz') && !(await page.$('#modoVt')), (await page.textContent('#modoOut')).slice(0, 120));
  await setar('modoSel', 'vcv');
  t('prona e ECMO presentes', (await page.textContent('#t-vm')).includes('PROSEVA') && (await page.textContent('#t-vm')).includes('EOLIA'));

  // 16c. acervo integrado
  await page.goto(URL0 + '#t-proto'); await page.waitForTimeout(700);
  t('acervo: índice carrega com 735 itens em Protocolos', (await $v('acn-t-proto')).startsWith('735 itens'), await $v('acn-t-proto'));
  const cont = await page.evaluate(() => { const c = {}; (window.__acervoIdx || []).forEach(e => { c[e.g] = (c[e.g] || 0) + 1; }); return c; });
  const esperado = { proto: 110, tera: 362, neo: 87, pps: 266, mono: 498, esc: 486, trat: 161, soro: 15 };
  t('acervo: 1.985 itens nas oito coleções', Object.keys(esperado).every(k => cont[k] === esperado[k]) && Object.keys(cont).length === 8, cont);
  await page.fill('#acq-t-proto', 'bronquiolite'); await page.waitForTimeout(300);
  const bq = await page.$$eval('#acl-t-proto button', b => b.map(x => x.firstChild.textContent));
  t('acervo: busca traz primeiro os temas de bronquiolite e depois as combinações do Tratado', bq.length >= 3 && bq.slice(0, 3).every(x => x.startsWith('Bronquiolite')), bq);
  await page.click('#acl-t-proto button'); await page.waitForTimeout(500);
  t('acervo: abrir tema mostra título, origem e situação, e atualiza o endereço', (await page.textContent('#acr-t-proto h2')) === 'Bronquiolite' && (await page.textContent('#acr-t-proto')).includes('Situação declarada na origem') && (await page.evaluate(() => location.hash)) === '#t-proto/proto/p-bronquiolite');
  await page.click('#t-proto button[data-copy]'); await page.waitForTimeout(150);
  const copAc = await page.evaluate(() => window.__copiado || '');
  t('acervo: copiar leva o tema aberto, sem a lista de resultados', copAc.includes('Bronquiolite') && copAc.includes('Situação declarada') && !copAc.includes('Mostrar mais'), copAc.slice(0, 200));
  await page.click('#t-proto [data-ac-g="neo"]'); await page.waitForTimeout(150);
  t('acervo: filtro por origem (Neonatologia)', (await $v('acn-t-proto')).startsWith('Nada encontrado') || (await page.$$eval('#acl-t-proto small', s => s.every(x => x.textContent.startsWith('Neonatologia')))));
  await page.fill('#acq-t-proto', ''); await page.waitForTimeout(250);
  t('acervo: Neonatologia lista 87 capítulos', (await $v('acn-t-proto')).startsWith('87 itens'), await $v('acn-t-proto'));
  await page.click('#acm-t-proto'); await page.waitForTimeout(100);
  t('acervo: Mostrar mais amplia a lista', (await page.$$eval('#acl-t-proto li', l => l.length)) === 80);
  await page.goto(URL0 + '#t-proto/neo/n-sala-de-parto-e-transicao'); await page.reload(); await page.waitForTimeout(900);
  const figs = await page.$$eval('#acr-t-proto img', i => i.map(x => x.complete && x.naturalWidth > 0));
  t('acervo: link direto abre o capítulo neonatal com as duas figuras', figs.length === 2 && figs.every(Boolean), figs);
  await page.goto(URL0 + '#t-mono/pps/m-amoxicilina'); await page.reload(); await page.waitForTimeout(900);
  t('acervo: link direto abre a linha do Manual PPS', (await ativa())[0] === 't-mono' && (await page.textContent('#acr-t-mono')).includes('80–90 mg/kg/dia'));
  await page.goto(URL0 + '#t-calc'); await page.waitForTimeout(500);
  await page.fill('#acq-t-calc', 'glasgow'); await page.waitForTimeout(250); await page.press('#acq-t-calc', 'Enter'); await page.waitForTimeout(500);
  await page.click('#acr-t-calc [data-ac-calc]'); await page.waitForTimeout(2500);
  const fr = page.frames().find(f => f.url().includes('/acervo/escores/'));
  const ftxt = fr ? await fr.evaluate(() => document.body.innerText) : '';
  t('calculadora de escores abre dentro da aba, no escore escolhido', !!fr && fr.url().endsWith('#score/glasgow') && ftxt.includes('Glasgow'), fr && fr.url());
  await page.goto(URL0 + '#t-painel'); await page.waitForTimeout(200);
  await page.fill('#navSearch', 'cetoacidose'); await page.waitForTimeout(600);
  const na = await page.$$eval('#navAcervo a', a => a.map(x => x.getAttribute('href')));
  t('busca do menu também procura no acervo', (await page.isVisible('#navAcervo')) && na.length >= 3 && na.some(h => h === '#t-proto/proto/p-cetoacidose-diabetica'), na);
  await page.click('#navAcervo a[href="#t-proto/proto/p-cetoacidose-diabetica"]'); await page.waitForTimeout(800);
  t('resultado do acervo no menu abre o tema na aba certa', (await ativa())[0] === 't-proto' && (await page.textContent('#acr-t-proto h2')) === 'Cetoacidose diabética');
  await page.fill('#navSearch', ''); await page.waitForTimeout(80);
  await page.goto(URL0 + '#t-acervo'); await page.waitForTimeout(200);
  const tam = await page.evaluate(() => ['acGrupos', 'acRecon', 'acSites', 'acDrive'].map(i => document.getElementById(i).rows.length));
  t('aba Acervo e fontes: coleções, conferência, sites e documentos', JSON.stringify(tam) === '[8,15,30,7]', tam);

  // 16d. Guia de soroterapia e Tratado (Drive do autor)
  await page.goto(URL0 + '#t-soro'); await page.waitForTimeout(150);
  await setar('sexo', 'M'); await setar('idade', '18 meses'); await setar('peso', '10'); await page.waitForTimeout(120);
  const tri = await page.evaluate(() => Array.from(document.querySelectorAll('#soTrilhas tr')).map(r => Array.from(r.cells).map(c => c.textContent.replace(/ /g, ' '))));
  const lin = n => tri.find(r => r[0].startsWith(n)) || [];
  t('trilhas, exemplo do Guia (10 kg, 18 meses): OMS B 750 mL em 4 h a 188 mL/h (187,5 arredondado)', lin('OMS, Plano B')[1] === '750 mL em 4 h' && lin('OMS, Plano B')[2] === '188 mL/h', lin('OMS, Plano B'));
  t('trilhas: Plano C 600 mL/h por 30 min e 280 mL/h por 2 h 30 min', lin('OMS, Plano C')[2] === '600 mL/h por 30 min; depois 280 mL/h por 2 h 30 min', lin('OMS, Plano C'));
  t('trilhas: RCH venoso e NICE sem choque a 62,5 mL/h; NICE após choque a 83,3 mL/h', lin('RCH, venoso')[2] === '62,5 mL/h' && lin('NICE, venoso sem')[2] === '62,5 mL/h' && lin('NICE, venoso após')[2] === '83,3 mL/h', [lin('RCH, venoso')[2], lin('NICE, venoso após')[2]]);
  await page.fill('#pgPerdas', '80'); await page.waitForTimeout(80);
  const pg = await page.evaluate(() => ['pgR', 'pgV24', 'pgTig', 'pgBolsas'].map(i => document.getElementById(i).textContent.replace(/ /g, ' ')));
  t('plano gradual do Guia: 82,5 mL/h nas primeiras 4 h, 62,5 depois, 1580 mL, TIG 5,21 e 3 bolsas de 8 h', pg[0] === '82,5 mL/h nas primeiras 4 h; depois 62,5 mL/h' && pg[1] === '1580 mL' && pg[2].startsWith('5,21 mg/kg/min') && pg[3] === '3 bolsas: cada 500 mL dura 8 h; a última, 500 mL em 8 h', pg);
  await page.fill('#pgPerdas', '0'); await setar('peso', '9'); await page.fill('#pgAnt', '10'); await page.waitForTimeout(80);
  const pgB = await page.evaluate(() => ['pgDefOut', 'pgR'].map(i => document.getElementById(i).textContent.replace(/ /g, ' ')));
  t('caso B do Guia: déficit de 1000 mL (10%), 500 mL nas primeiras 24 h e 62,5 mL/h', pgB[0] === '1000 mL (10% do peso de 10 kg); 500 mL nas primeiras 24 h e 500 mL depois de reavaliar' && pgB[1] === '62,5 mL/h', pgB);
  await page.fill('#pgAnt', ''); await setar('peso', '18'); await setar('idade', '4 anos');
  const prep = async () => page.evaluate(() => Array.from(document.querySelectorAll('#ppTab tr')).map(r => Array.from(r.cells).map(c => c.textContent.replace(/ /g, ' ')).join(': ')));
  let pp = await prep();
  t('preparo: SF 447,6 + G50 50 + NaCl 20% 2,36 = 500 mL', pp.join('|') === 'Soro fisiológico 0,9%: 447,6 mL|Glicose 50%: 50 mL|NaCl 20%: 2,36 mL|Volume final: 500 mL', pp);
  t('preparo: conferência dá 9 mg/mL de NaCl e 50 mg/mL de glicose', (await $v('ppConf')).includes('= 9 mg/mL (0,9%)') && (await $v('ppConf')).includes('= 50 mg/mL (5%)'), await $v('ppConf'));
  await setar('ppEst', 'sg5'); await setar('ppNa', '100'); pp = await prep();
  t('preparo: SG 5% 450 + G50 5 + NaCl 10% 45', pp.join('|') === 'Soro glicosado 5%: 450 mL|Glicose 50%: 5 mL|NaCl 10%: 45 mL|Volume final: 500 mL', pp);
  await setar('ppNa', '200'); pp = await prep();
  t('preparo: SG 5% 475 + G50 2,5 + NaCl 20% 22,5', pp.join('|') === 'Soro glicosado 5%: 475 mL|Glicose 50%: 2,5 mL|NaCl 20%: 22,5 mL|Volume final: 500 mL', pp);
  await setar('ppGli', '2.5'); pp = await prep();
  t('preparo: SG 5% não chega a glicose 2,5% e o site avisa', pp.length === 1 && pp[0].startsWith('Este estoque não alcança'), pp);
  await setar('ppGli', '5'); await setar('ppEst', 'sf50'); await setar('ppK', '20'); pp = await prep();
  t('preparo com KCl 19,1% a 20 mEq/L: 3,91 mL (10 mEq) e NaCl recalculado', pp.join('|') === 'Soro fisiológico 0,9%: 443,6 mL|Glicose 50%: 50 mL|NaCl 20%: 2,54 mL|KCl 19,1%: 3,91 mL (10 mEq)|Volume final: 500 mL' && (await page.isVisible('#ppAviso')), pp);
  await setar('ppK', '0');
  await page.goto(URL0 + '#t-diag'); await page.waitForTimeout(150);
  await page.fill('#tsBusca', 'petéquias febre'); await page.waitForTimeout(900);
  let ts = await page.$$eval('#tsOut h4', h => h.map(x => x.textContent));
  t('Tratado: busca por "petéquias febre" traz a meningococcemia primeiro', ts.length >= 3 && ts[0].startsWith('17. Meningococcemia'), ts.slice(0, 3));
  await page.check('#diagChecks input[value="estridor"]'); await page.check('#diagChecks input[value="tosse"]');
  await page.click('#tsMarcados'); await page.waitForTimeout(300);
  ts = await page.$$eval('#tsOut h4', h => h.map(x => x.textContent));
  t('Tratado: sinais marcados (estridor e tosse) trazem o crupe entre os primeiros', ts.slice(0, 3).some(x => x.startsWith('5. Crupe')), ts.slice(0, 3));
  await page.click('#diagLimpar');
  await page.click('#tsOut a[href="#t-proto/trat/c-005"]'); await page.waitForTimeout(900);
  t('Tratado: "Abrir no acervo" mostra a combinação', (await ativa())[0] === 't-proto' && (await page.textContent('#acr-t-proto h2')).startsWith('Crupe viral'));
  await page.goto(URL0 + '#t-proto/trat/c-030'); await page.reload(); await page.waitForTimeout(900);
  const rel = await page.$$eval('#acr-t-proto .ac-ln a', a => a.map(x => x.getAttribute('href')));
  t('Tratado: combinação liga ao tema do acervo', rel.length >= 1 && /^#t-proto\/(proto|tera|neo)\//.test(rel[0]), rel);
  await page.click('#acr-t-proto .ac-ln a'); await page.waitForTimeout(900);
  t('Tratado: o link abre o protocolo relacionado', (await page.textContent('#acr-t-proto h2')).startsWith('Invaginação'));
  await page.goto(URL0 + '#t-proto/trat/c-correcoes'); await page.reload(); await page.waitForTimeout(900);
  t('Tratado: tabela com as 28 correções', (await page.$$eval('#acr-t-proto tbody tr', r => r.length)) === 28);
  await page.goto(URL0 + '#t-proto/soro/s-08-preparo'); await page.reload(); await page.waitForTimeout(900);
  t('Guia de soroterapia: página de preparo com a tabela de 8 opções e link para a calculadora', (await page.$$eval('#acr-t-proto tbody tr', r => r.length)) === 8 && !!(await page.$('#acr-t-proto a[href="#t-soro"]')));

  // 17. acessibilidade básica
  const a11y = await page.evaluate(() => {
    const semRotulo = Array.from(document.querySelectorAll('input,select,textarea')).filter(e => !(e.labels && e.labels.length) && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby')).map(e => e.id || e.outerHTML.slice(0, 60));
    const btnVazio = Array.from(document.querySelectorAll('button')).filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length;
    const h1s = Array.from(document.querySelectorAll('section.tab')).filter(s => s.querySelectorAll('h1').length !== 1).map(s => s.id);
    const semTh = Array.from(document.querySelectorAll('table.ref')).filter(t => !t.querySelector('thead th')).length;
    return { semRotulo, btnVazio, h1s, semTh, lang: document.documentElement.lang, img: Array.from(document.querySelectorAll('img')).filter(i => !i.alt).length };
  });
  t('todo campo tem rótulo', a11y.semRotulo.length === 0, a11y.semRotulo);
  t('botões com texto, um h1 por aba, tabelas com cabeçalho, idioma pt-BR', a11y.btnVazio === 0 && a11y.h1s.length === 0 && a11y.semTh === 0 && a11y.lang === 'pt-BR' && a11y.img === 0, a11y);

  await ctx.close();

  // 18. celular
  for (const largura of [390, 320]) {
    const m = await browser.newContext({ viewport: { width: largura, height: 780 }, hasTouch: true, isMobile: true });
    const p = await m.newPage(); await p.goto(URL0); await p.waitForTimeout(250);
    const transb = [];
    for (const id of links) {
      await p.evaluate(i => { location.hash = '#' + i; }, id); await p.waitForTimeout(40);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (sw > 1) transb.push(id + ':' + sw);
    }
    t(`${largura} px: nenhuma aba transborda na horizontal`, transb.length === 0, transb);
    const transbAc = [];
    for (const rota of ['t-proto/proto/p-bronquiolite', 't-mono/mono/f-haloperidol', 't-proto/neo/n-classificacao-e-exame-do-recem-nascido', 't-calc/esc/e-glasgow', 't-mono/pps/m-amoxicilina', 't-proto/soro/s-08-preparo', 't-proto/soro/s-11-glicose', 't-proto/trat/c-122']) {
      await p.evaluate(i => { location.hash = '#' + i; }, rota); await p.waitForTimeout(700);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const h2 = await p.evaluate(() => { const e = document.querySelector('section.tab.active .ac-leitor h2'); return e ? e.textContent : ''; });
      if (sw > 1 || !h2) transbAc.push(rota + ':' + sw + ':' + h2);
    }
    t(`${largura} px: itens do acervo abrem sem transbordar`, transbAc.length === 0, transbAc);
    if (largura === 390) await p.screenshot({ path: path.join(RAIZ, 'tests/shots/mob-acervo-pps.png') });
    if (largura === 390) {
      await p.evaluate(() => { location.hash = '#t-sala'; }); await p.waitForTimeout(80);
      t('celular: menu começa fechado', !(await p.evaluate(() => document.getElementById('side').className.includes('open'))));
      await p.click('#btnMenu'); await p.waitForTimeout(250);
      t('celular: botão Menu abre a gaveta', (await p.evaluate(() => document.getElementById('side').className.includes('open'))) && (await p.isVisible('#veu')));
      await p.click('#navGroups a[href="#t-via"]'); await p.waitForTimeout(250);
      t('celular: escolher a aba fecha a gaveta', !(await p.evaluate(() => document.getElementById('side').className.includes('open'))) && (await p.evaluate(() => document.querySelector('section.tab.active').id)) === 't-via');
      t('celular: editor do paciente começa recolhido', !(await p.isVisible('#peso')) && (await p.isVisible('#pacResumo')));
      await p.click('#pacResumo'); await p.waitForTimeout(100);
      t('celular: tocar no resumo abre o editor do paciente', await p.isVisible('#peso'));
      await p.fill('#peso', '9'); await p.waitForTimeout(60);
      t('celular: resumo acompanha o peso digitado', (await p.textContent('#pacPeso')) === '9 kg');
      const tabela = await p.evaluate(() => { const td = document.querySelector('#viaTab tr:not(.grp) td:nth-child(2)'); return { disp: getComputedStyle(td).display, rot: td.getAttribute('data-th') }; });
      t('celular: tabela vira ficha com rótulo em cada célula', tabela.disp === 'block' && tabela.rot === 'Dose por kg', tabela);
      const alvos = await p.evaluate(() => Array.from(document.querySelectorAll('section.tab.active button, section.tab.active select, section.tab.active input:not([type=checkbox]):not([type=file]), .topbar-row button, #wBtns button')).filter(e => e.offsetParent !== null).map(e => Math.round(e.getBoundingClientRect().height)).filter(h => h < 44));
      t('celular: alvos de toque com 44 px ou mais', alvos.length === 0, alvos);
      await p.screenshot({ path: path.join(RAIZ, 'tests/shots/mob-via-9kg.png') });
    }
    await m.close();
  }

  t('nenhum erro de console durante os testes', erros.length === 0, erros.slice(0, 3));
  t('nenhuma requisição externa', pedidos.length === 0, pedidos.slice(0, 3));
  await browser.close();
  console.log(`${ok} verificações aprovadas; ${falhas.length} reprovadas`);
  falhas.forEach(f => console.log('  - ' + f));
  process.exit(falhas.length ? 1 : 0);
})();
