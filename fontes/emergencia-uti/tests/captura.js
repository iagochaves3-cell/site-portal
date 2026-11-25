// Captura o texto de todos os elementos com id (e as linhas das tabelas) para uma matriz de pacientes.
// Uso: node captura.js <arquivo.html> <saida.json>
const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const RAIZ = path.resolve(__dirname, '..');
const fs = require('fs');
let CASOS = process.argv[4] ? JSON.parse(require('fs').readFileSync(process.argv[4], 'utf8')) : null;
const CASOS_PADRAO = [
  { peso: 3.5, idade: '15 dias', sexo: 'M' }, { peso: 5, idade: '2 meses', sexo: 'F' }, { peso: 9, idade: '10 meses', sexo: 'M' },
  { peso: 13, idade: '2 anos', sexo: 'F' }, { peso: 18, idade: '4 anos', sexo: 'M' }, { peso: 28, idade: '8 anos', sexo: 'F' },
  { peso: 50, idade: '14 anos', sexo: 'M' }, { peso: 70, idade: '30 anos', sexo: 'M' }, { peso: 60, idade: '30 anos', sexo: 'F' },
  { peso: 110, idade: '40 anos', sexo: 'M' }
];
const SELECTS = { desPct: ['3', '5', '10'], choqueSel: null, dvVol: ['50', '100'] };
(async () => {
  const [arq, saida] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.goto(/^https?:/.test(arq) ? arq : 'file://' + path.resolve(arq));
  await page.waitForTimeout(400);
  const out = { casos: [], erros };
  const dump = () => page.evaluate(() => {
    const r = {};
    document.querySelectorAll('[id]').forEach(el => {
      const t = el.tagName;
      if (t === 'SECTION' || t === 'MAIN' || t === 'DIALOG' || t === 'ASIDE' || t === 'HEADER' || t === 'NAV') return;
      if (t === 'TBODY') r[el.id] = Array.from(el.rows).map(row => Array.from(row.cells).map(c => c.textContent.replace(/[ \t\r\n\u00a0]+/g, ' ').trim()));
      else if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') r[el.id] = String(el.value);
      else r[el.id] = el.textContent.replace(/[ \t\r\n\u00a0]+/g, ' ').trim();
    });
    return r;
  });
  const setar = async (id, v) => page.evaluate(([id, v]) => {
    const el = document.getElementById(id); if (!el) return false;
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, [id, String(v)]);
  if (!CASOS) CASOS = CASOS_PADRAO;
  for (const c of CASOS) {
    await setar('sexo', c.sexo); await setar('idade', c.idade); await setar('peso', c.peso);
    await page.waitForTimeout(60);
    const reg = { caso: c, base: await dump(), variantes: {} };
    for (const v of SELECTS.desPct) { await setar('desPct', v); reg.variantes['desPct=' + v] = await page.evaluate(() => ({ defMl: document.getElementById('defMl').textContent, defH: document.getElementById('defH').textContent })); }
    await setar('desPct', '5');
    const tipos = await page.evaluate(() => Array.from(document.getElementById('choqueSel').options).map(o => o.value));
    for (const t of tipos) { await setar('choqueSel', t); reg.variantes['choque=' + t] = await page.evaluate(() => { const g = i => (document.getElementById(i) || {}).textContent || ''; return { chExp: g('chExp'), chVaso: g('chVaso'), chVasoCap: g('chVasoCap'), chTitulo: g('chTitulo') }; }); }
    await setar('choqueSel', tipos[0]);
    reg.variantes.atb = {};
    const sinds = await page.evaluate(() => Array.from(document.getElementById('atbSind').options).map(o => [o.value, o.text]));
    for (const [v, t] of sinds) { await setar('atbSind', v); reg.variantes.atb[t] = await page.evaluate(() => Array.from(document.getElementById('atbTab').rows).map(row => Array.from(row.cells).map(c => c.textContent.replace(/[ \t\r\n\u00a0]+/g, ' ').trim()))); }
    await setar('atbSind', sinds[0][0]);
    out.casos.push(reg);
  }
  fs.writeFileSync(saida, JSON.stringify(out, null, 1));
  console.log(saida, 'casos:', out.casos.length, 'erros de página:', erros.length, erros.slice(0, 3));
  await browser.close();
})();
