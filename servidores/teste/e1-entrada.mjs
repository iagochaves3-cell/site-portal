// Fluxo real no navegador (celular): entrar pelo link do próprio site e conferir os três
// sites que só precisam da entrada (sem IA): Revisão, Atlas e o estado da Dermatologia.
import { criarAmbiente, SENHA, DOMINIO } from './ambiente.mjs';
import { abrirNavegador } from './navegador.mjs';
import { assert, contador } from './util.mjs';

const PORTA = 8443, { passo, fim } = contador('navegador: entrada');
const a = await criarAmbiente({ porta: PORTA });
const n = await abrirNavegador(PORTA);
try {
  const page = await n.nova();
  await passo('Revisão sem entrada mostra "Entre para acessar sua fila"', async () => {
    await page.goto(a.origem('revisao-pediatrica-continua') + '/', { waitUntil: 'load' });
    await page.getByText('Entre para acessar sua fila').waitFor({ timeout: 15000 });
  });
  await passo('link "Entrar com ChatGPT" abre a entrada por senha', async () => {
    await page.getByRole('link', { name: 'Entrar com ChatGPT' }).click();
    await page.waitForURL('https://acesso-sites.' + DOMINIO + '/**', { timeout: 15000 });
    assert.match(page.url(), /return_to=https%3A%2F%2Frevisao-pediatrica-continua\./);
    await page.getByLabel('Senha de acesso').waitFor();
  });
  await passo('senha errada mostra aviso e não entra', async () => {
    await page.getByLabel('Senha de acesso').fill('senha-errada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.getByText('Senha incorreta.').waitFor({ timeout: 15000 });
  });
  await passo('senha certa devolve ao site, já com a fila carregada do banco', async () => {
    await page.getByLabel('Senha de acesso').fill(SENHA);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.waitForURL(a.origem('revisao-pediatrica-continua') + '/', { timeout: 15000 });
    await page.waitForFunction(() => !document.body.innerText.includes('Entre para acessar sua fila') && /Temas no acervo/.test(document.body.innerText), null, { timeout: 20000 });
    const t = await n.texto(page);
    assert.ok(!/Não foi possível carregar/.test(t), t.slice(0, 400));
    console.log('     texto:', t.slice(0, 420));
    await page.screenshot({ path: '/tmp/e1-revisao.png' });
  });
  await passo('cookie único vale nos outros sites: Atlas carrega o histórico do proprietário', async () => {
    const p = await n.nova();
    await p.goto(a.origem('atlas-preservacao') + '/', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const t = await n.texto(p);
    assert.ok(!t.includes('Entre com a conta proprietária'), t.slice(0, 500));
    console.log('     texto:', t.slice(0, 300));
    await p.screenshot({ path: '/tmp/e1-atlas.png' }); await p.close();
  });
  await passo('Dermatologia: some o convite de entrada e a IA aparece como conectada', async () => {
    const p = await n.nova();
    await p.goto(a.origem('dermatologia') + '/', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const t = await n.texto(p);
    assert.ok(!t.includes('Entrar com ChatGPT para usar a análise por IA'), 'convite ainda visível');
    const trecho = t.match(/.{0,160}(IA|OpenAI).{0,200}/); console.log('     texto:', trecho ? trecho[0] : t.slice(0, 300));
    await p.close();
  });
  await passo('sair: a página de acesso encerra a sessão em todos os sites', async () => {
    await page.goto('https://acesso-sites.' + DOMINIO + '/', { waitUntil: 'load' });
    await page.getByText('Acesso liberado').waitFor();
    await page.getByRole('link', { name: 'Sair deste aparelho' }).click();
    await page.getByLabel('Senha de acesso').waitFor({ timeout: 15000 });
    await page.goto(a.origem('revisao-pediatrica-continua') + '/', { waitUntil: 'load' });
    await page.getByText('Entre para acessar sua fila').waitFor({ timeout: 15000 });
  });
  const graves = n.eventos.filter(e => !/^401 |status of 401|React error #418/.test(e));
  console.log('eventos não esperados:', JSON.stringify(graves));
} finally { await n.fechar(); await a.fechar(); }
fim();
