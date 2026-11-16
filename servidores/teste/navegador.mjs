// Navegador de teste: Chrome sem interface apontado para o ambiente local, usando os
// endereços reais dos sites (https://<site>.sites-pediatria.workers.dev). Assim os cookies
// de sessão, as origens e os envios de arquivo se comportam como em produção.
import { createRequire } from 'node:module';
import { DOMINIO } from './ambiente.mjs';
const require = createRequire(process.env.PLAYWRIGHT_EM || '/opt/node-tools/node_modules/');
const { chromium, devices } = require('playwright');

export async function abrirNavegador(porta, { celular = true } = {}) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--ignore-certificate-errors', '--no-proxy-server', `--host-resolver-rules=MAP *.${DOMINIO}:443 127.0.0.1:${porta}, EXCLUDE localhost`] });
  const contexto = await browser.newContext({ ...(celular ? devices['Pixel 7'] : { viewport: { width: 1280, height: 900 } }), locale: 'pt-BR', ignoreHTTPSErrors: true });
  const eventos = [];
  const nova = async () => {
    const page = await contexto.newPage();
    page.on('console', m => { if (m.type() === 'error') eventos.push('console: ' + m.text().slice(0, 200)); });
    page.on('pageerror', e => eventos.push('erro de página: ' + String(e).slice(0, 200)));
    page.on('response', r => { const u = new URL(r.url()); if (u.hostname.endsWith(DOMINIO) && r.status() >= 400) eventos.push(r.status() + ' ' + r.request().method() + ' ' + u.hostname.split('.')[0] + u.pathname); });
    return page;
  };
  const texto = page => page.evaluate(() => (document.body ? document.body.innerText : '').replace(/\s+/g, ' ').trim());
  return { browser, contexto, nova, texto, eventos, fechar: () => browser.close() };
}
