import { readFile } from 'node:fs/promises';
import { criarAmbiente } from './ambiente.mjs';
import { assert, contador, identidadeFalsa } from './util.mjs';

const S = 'atlas-preservacao', { passo, fim } = contador(S);
const base = JSON.parse(await readFile((process.env.PACOTES || '/home/claude/src/pkg') + '/atlas-preservacao/app/baseline.json', 'utf8'));
const a = await criarAmbiente({ sites: [S] });
try {
  const origin = a.origem(S);
  await passo('página inicial', async () => { const r = await a.pedir(S, '/'); assert.equal(r.status, 200); await r.text(); });
  await passo('sem entrada: 401 com a mensagem original (cabeçalhos forjados ignorados)', async () => {
    const r = await a.pedir(S, '/api/acervo', { headers: identidadeFalsa }); assert.equal(r.status, 401);
    assert.deepEqual(await r.json(), { error: 'Entre com a conta proprietária para consultar o histórico salvo.' });
  });
  const { cookie } = await a.entrar();
  await passo('com entrada: histórico salvo (vazio no banco novo)', async () => {
    const r = await a.pedir(S, '/api/acervo', { cookie }); assert.equal(r.status, 200); assert.deepEqual(await r.json(), { revisions: [] });
  });
  const projeto = { ...base[0].base, evidence: base[0].base.evidence + '\nRevisão de teste automatizado.' };
  await passo('gravação exige modo de edição', async () => {
    const r = await a.pedir(S, '/api/acervo', { method: 'POST', cookie, headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ base: 2, note: 'Teste', data: projeto }) });
    assert.equal(r.status, 403); await r.text();
  });
  await passo('nova revisão é gravada e volta no histórico; revisão concorrente é recusada', async () => {
    const h = { origin, 'content-type': 'application/json', 'x-atlas-mode': 'edit' };
    const r = await a.pedir(S, '/api/acervo', { method: 'POST', cookie, headers: h, body: JSON.stringify({ base: 2, note: 'Teste de gravação', data: projeto }) });
    const j = await r.json(); assert.equal(r.status, 201, JSON.stringify(j)); assert.equal(j.revision.number, 3); assert.equal(j.revision.id, projeto.id);
    const lista = await (await a.pedir(S, '/api/acervo', { cookie })).json(); assert.equal(lista.revisions.length, 1); assert.equal(lista.revisions[0].data.evidence, projeto.evidence);
    const dup = await a.pedir(S, '/api/acervo', { method: 'POST', cookie, headers: h, body: JSON.stringify({ base: 2, note: 'Concorrente', data: projeto }) }); assert.equal(dup.status, 409); await dup.text();
  });
} finally { await a.fechar(); }
fim();
