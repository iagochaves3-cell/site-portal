const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const RAIZ = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const erros = [];
  for (const [nome, vp, tema] of [['desk-claro', { width: 1366, height: 800 }, 'light'], ['mob-claro', { width: 390, height: 844 }, 'light'], ['mob-escuro', { width: 390, height: 844 }, 'dark'], ['desk-escuro', { width: 1366, height: 800 }, 'dark']]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: tema, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') erros.push(nome + ' console: ' + m.text()); });
    page.on('pageerror', e => erros.push(nome + ' pageerror: ' + e.message));
    await page.goto('file://' + RAIZ + '/dist/index.html');
    await page.waitForTimeout(300);
    const e = await page.evaluate(() => window.__erros);
    if (e.length) erros.push(nome + ' __erros: ' + e.join(' | '));
    const abas = process.argv[2] ? process.argv[2].split(',') : ['t-painel', 't-sala'];
    for (const a of abas) {
      await page.evaluate(id => { location.hash = '#' + id; }, a);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(RAIZ, 'tests/shots', `${nome}-${a}.png`), fullPage: process.argv[3] === 'full' });
    }
    await ctx.close();
  }
  await browser.close();
  console.log(erros.length ? 'ERROS:\n' + erros.join('\n') : 'sem erros de console nem de cálculo');
})();
