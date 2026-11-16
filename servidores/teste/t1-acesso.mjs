import assert from 'node:assert/strict';
import { criarAmbiente, SENHA, DOMINIO } from './ambiente.mjs';

let ok = 0; const passo = async (nome, fn) => { await fn(); ok++; console.log('  ok  ' + nome); };
const a = await criarAmbiente({ sites: ['dermatologia'] });
try {
  await passo('página de entrada pede a senha', async () => {
    const r = await a.pedir('acesso-sites', '/');
    const t = await r.text();
    assert.equal(r.status, 200); assert.match(t, /Senha de acesso/); assert.match(r.headers.get('content-security-policy'), /default-src 'none'/);
  });
  await passo('/estado sem sessão', async () => {
    const r = await a.pedir('acesso-sites', '/estado');
    assert.deepEqual(await r.json(), { sessao: false, senha: true, chave: true });
  });
  await passo('senha errada -> 401, sem cookie', async () => {
    const r = await a.entrar('errada');
    assert.equal(r.status, 401); assert.equal(r.cabecalho, '');
  });
  await passo('POST de outra origem é recusado', async () => {
    const r = await a.pedir('acesso-sites', '/entrar', { method: 'POST', headers: { origin: 'https://exemplo.com', 'content-type': 'application/x-www-form-urlencoded' }, body: 'senha=' + SENHA });
    assert.equal(r.status, 403); assert.equal(r.headers.get('set-cookie'), null); await r.text();
  });
  let cookie = '';
  await passo('senha certa -> cookie do domínio inteiro, 30 dias', async () => {
    const r = await a.entrar(SENHA, 'https://dermatologia.' + DOMINIO + '/');
    assert.equal(r.status, 303); assert.equal(r.local, 'https://dermatologia.' + DOMINIO + '/');
    assert.match(r.cabecalho, /^__Secure-sp=v1\.\d+\.[A-Za-z0-9_-]+; Domain=sites-pediatria\.workers\.dev; Path=\/; Max-Age=2592000; Secure; HttpOnly; SameSite=Lax$/);
    cookie = r.cookie;
  });
  await passo('destino externo é descartado', async () => {
    const r = await a.entrar(SENHA, 'https://exemplo.com/roubo');
    assert.equal(r.local, '/');
    const r2 = await a.entrar(SENHA, 'https://sites-pediatria.workers.dev.exemplo.com/');
    assert.equal(r2.local, '/');
    const r3 = await a.entrar(SENHA, '//exemplo.com');
    assert.equal(r3.local, '/');
  });
  await passo('/estado com sessão', async () => {
    const r = await a.pedir('acesso-sites', '/estado', { cookie });
    assert.equal((await r.json()).sessao, true);
  });
  await passo('cookie adulterado não vale', async () => {
    for (const falso of [cookie.slice(0, -2) + 'xx', cookie.replace(/v1\.(\d+)\./, (m, e) => 'v1.' + (Number(e) + 1000) + '.'), '__Secure-sp=v1.9999999999999.AAAA', '__Secure-sp=']) {
      const r = await a.pedir('acesso-sites', '/estado', { cookie: falso });
      assert.equal((await r.json()).sessao, false, falso);
    }
  });
  await passo('com sessão, / devolve ao site de origem', async () => {
    const r = await a.pedir('acesso-sites', '/?return_to=' + encodeURIComponent('https://dermatologia.' + DOMINIO + '/x?y=1'), { cookie });
    assert.equal(r.status, 303); assert.equal(r.headers.get('location'), 'https://dermatologia.' + DOMINIO + '/x?y=1'); await r.text();
  });
  await passo('/sair apaga o cookie', async () => {
    const r = await a.pedir('acesso-sites', '/sair', { cookie });
    assert.equal(r.status, 303); assert.match(r.headers.get('set-cookie'), /^__Secure-sp=; Domain=sites-pediatria\.workers\.dev; Path=\/; Max-Age=0/); await r.text();
  });
  await passo('bloqueio após 8 senhas erradas da mesma origem', async () => {
    let ultimo = 0;
    for (let i = 0; i < 9; i++) ultimo = (await a.entrar('errada-' + i)).status;   // 1 erro anterior + 8 aqui
    assert.equal(ultimo, 429);
    assert.equal((await a.entrar(SENHA)).status, 429, 'mesmo a senha certa espera a janela');
  });
  await passo('ligação interna não é alcançável por HTTP', async () => {
    for (const c of ['/contexto', '/chave', '/sessao', '/Interno/chave']) { const r = await a.pedir('acesso-sites', c); assert.equal(r.status, 404); await r.text(); }
  });
} finally { await a.fechar(); }

const b = await criarAmbiente({ sites: ['dermatologia'], semSenha: true });
try {
  await passo('sem senha definida: página de pendência e nenhuma entrada', async () => {
    const r = await b.pedir('acesso-sites', '/'); assert.equal(r.status, 503); assert.match(await r.text(), /SENHA_DE_ACESSO/);
    const e = await b.entrar('PENDENTE'); assert.equal(e.status, 503); assert.equal(e.cabecalho, '');
    const e2 = await b.entrar(''); assert.equal(e2.cabecalho, '');
  });
} finally { await b.fechar(); }
console.log(ok + ' verificações passaram (acesso)');
