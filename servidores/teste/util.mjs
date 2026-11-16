import assert from 'node:assert/strict';
export { assert };
export function contador(titulo) {
  let ok = 0;
  const passo = async (nome, fn) => { try { await fn(); ok++; console.log('  ok  ' + nome); } catch (e) { console.log('  FALHOU  ' + nome); throw e; } };
  return { passo, fim: () => console.log(ok + ' verificações passaram (' + titulo + ')') };
}
export const jpegMinimo = 'data:image/jpeg;base64,' + Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0xff, 0xd9]).toString('base64');
export const identidadeFalsa = { 'oai-authenticated-user-id': 'invasor', 'oai-authenticated-user-email': 'invasor@exemplo.com', 'OAI-Authenticated-User-Full-Name': 'Invasor', 'oai-authenticated-user-full-name-encoding': 'percent-encoded-utf-8' };
