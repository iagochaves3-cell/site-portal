import { criarAmbiente } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'prescricao-integral', { passo, fim } = contador(S);
const a = await criarAmbiente({ sites: [S] });
try {
  const origin = a.origem(S);
  const json = { origin, 'content-type': 'application/json' };
  await passo('página inicial e motor do navegador servidos do repositório', async () => {
    const r = await a.pedir(S, '/'); assert.equal(r.status, 200); assert.match(await r.text(), /<html/i);
    const m = await a.pedir(S, '/clinical.mjs'); assert.equal(m.status, 200); assert.match(await m.text(), /ENGINE_VERSION/);
  });
  await passo('sem entrada: 401 com a mensagem original (cabeçalhos forjados ignorados)', async () => {
    for (const [c, op] of [['/api/protocols', {}], ['/api/whatsapp/status', {}], ['/api/clinical', { method: 'POST', body: '{"message":"/ajuda"}' }]]) {
      const r = await a.pedir(S, c, { ...op, headers: { ...identidadeFalsa, ...json } });
      assert.equal(r.status, 401, c); assert.deepEqual(await r.json(), { error: 'Autenticação necessária.' });
    }
  });
  const { cookie } = await a.entrar();
  await passo('protocolos: lista vazia no banco novo', async () => {
    const r = await a.pedir(S, '/api/protocols', { cookie }); assert.equal(r.status, 200); assert.deepEqual(await r.json(), []);
  });
  await passo('protocolo manual sem vínculo canônico é recusado (quarentena original)', async () => {
    const r = await a.pedir(S, '/api/protocols', { method: 'POST', cookie, headers: json, body: JSON.stringify({ diagnosis: 'Teste' }) });
    assert.equal(r.status, 400); assert.match((await r.json()).error, /quarentena/);
  });
  await passo('desativar protocolo grava no banco', async () => {
    const r = await a.pedir(S, '/api/protocols', { method: 'POST', cookie, headers: json, body: JSON.stringify({ action: 'disable', id: 'inexistente' }) });
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true });
  });
  await passo('motor clínico responde (ajuda e primeira mensagem de atendimento)', async () => {
    const r = await a.pedir(S, '/api/clinical', { method: 'POST', cookie, headers: json, body: JSON.stringify({ message: '/ajuda', session: null }) });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j)); assert.equal(j.code, 'help'); assert.ok(j.text.length > 20);
    const r2 = await a.pedir(S, '/api/clinical', { method: 'POST', cookie, headers: json, body: JSON.stringify({ message: 'criança de 2 anos, 12 kg, otite média aguda', session: null }) });
    const j2 = await r2.json(); assert.equal(r2.status, 200, JSON.stringify(j2)); assert.ok(j2.session && j2.session.id); assert.ok(typeof j2.text === 'string' && j2.text.length > 10);
    console.log('      código:', j2.code, '| início:', j2.text.slice(0, 90).replace(/\n/g, ' '));
  });
  await passo('motor clínico exige mesma origem', async () => {
    const r = await a.pedir(S, '/api/clinical', { method: 'POST', cookie, headers: { 'content-type': 'application/json' }, body: '{"message":"/ajuda"}' });
    assert.equal(r.status, 403); await r.text();
  });
  await passo('situação do WhatsApp: banco pronto, integração pendente de credenciais da Meta', async () => {
    const r = await a.pedir(S, '/api/whatsapp/status', { cookie }); const j = await r.json();
    assert.equal(r.status, 200); assert.equal(j.dbReady, true); assert.equal(j.configured, false); assert.equal(j.enabled, false); assert.equal(j.profileReady, true);
    assert.ok(j.missing.includes('WHATSAPP_ACCESS_TOKEN')); assert.ok(!j.missing.includes('WHATSAPP_DATA_KEY'));
  });
  await passo('cadastro do WhatsApp pessoal: número cifrado, comando de vínculo gerado', async () => {
    const r = await a.pedir(S, '/api/whatsapp/profile', { method: 'POST', cookie, headers: json, body: JSON.stringify({ phone: '(31) 99876-5432', confirmOwnNumber: true }) });
    const j = await r.json(); assert.equal(r.status, 200, JSON.stringify(j));
    assert.equal(j.profile.masked, '•••• 5432'); assert.match(j.profile.linkCommand, /^VINCULAR [0-9A-F]{16}$/); assert.equal(j.profile.verified, false);
    const linha = await (await a.mf.getD1Database('DB', S)).prepare('SELECT payload FROM wa_profiles').first();
    assert.ok(!linha.payload.includes('98765'), 'o número não pode ficar em texto aberto no banco');
  });
  await passo('webhook da Meta: verificação recusada e mensagens recusadas enquanto não houver credenciais', async () => {
    const g = await a.pedir(S, '/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=x&hub.challenge=1'); assert.equal(g.status, 403); await g.text();
    const p = await a.pedir(S, '/api/whatsapp/webhook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); assert.equal(p.status, 503); assert.equal(await p.text(), 'Integration not configured');
  });
} finally { await a.fechar(); }
fim();
