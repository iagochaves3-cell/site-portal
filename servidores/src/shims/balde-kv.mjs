// Armazenamento temporário de anexos sobre Workers KV, com a mesma interface que o
// site Laboratório e Raio X usava no R2 (put, head, get, delete, list).
// Cada parte expira sozinha (TTL) pouco depois do prazo do envio.
function hex(bytes) { return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join(''); }

async function paraBytes(valor) {
  if (valor instanceof Uint8Array) return valor;
  if (valor instanceof ArrayBuffer) return new Uint8Array(valor);
  if (ArrayBuffer.isView(valor)) return new Uint8Array(valor.buffer, valor.byteOffset, valor.byteLength);
  return new Uint8Array(await new Response(valor).arrayBuffer());
}

export function baldeKV(kv) {
  if (!kv) return undefined;
  const descrever = (chave, meta) => ({ key: chave, size: Number(meta.size), etag: String(meta.etag) });
  return {
    async put(chave, valor, opcoes = {}) {
      const bytes = await paraBytes(valor);
      const etag = hex(await crypto.subtle.digest('SHA-256', bytes)).slice(0, 40);
      const prazo = Number(opcoes?.customMetadata?.expiresAt);
      const resta = Number.isFinite(prazo) ? Math.ceil((prazo - Date.now()) / 1000) + 600 : 7200;
      const meta = { size: bytes.byteLength, etag };
      await kv.put(chave, bytes, { expirationTtl: Math.min(Math.max(resta, 900), 3 * 3600), metadata: meta });
      return descrever(chave, meta);
    },
    async head(chave) {
      const { value, metadata } = await kv.getWithMetadata(chave, { type: 'stream' });
      if (!value || !metadata) return null;
      await value.cancel().catch(() => undefined);
      return descrever(chave, metadata);
    },
    async get(chave) {
      const { value, metadata } = await kv.getWithMetadata(chave, { type: 'stream' });
      if (!value || !metadata) return null;
      return { ...descrever(chave, metadata), body: value };
    },
    async delete(chaves) {
      for (const chave of Array.isArray(chaves) ? chaves : [chaves]) await kv.delete(chave);
    },
    async list(opcoes = {}) {
      const r = await kv.list({ prefix: opcoes.prefix, limit: opcoes.limit, cursor: opcoes.cursor });
      return { objects: r.keys.map(k => ({ key: k.name })), truncated: !r.list_complete, cursor: r.list_complete ? undefined : r.cursor };
    },
  };
}
