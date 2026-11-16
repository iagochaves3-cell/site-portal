// Substituto de 'cloudflare:workers' para testes locais (Node).
export class WorkerEntrypoint { constructor(ctx, env) { this.ctx = ctx; this.env = env; } }
export class DurableObject {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
}
export function criarArmazenamento() {
  const dados = new Map(); let alarme = null;
  return {
    alarmeEm: () => alarme,
    storage: {
      async get(k) { return dados.get(k); },
      async put(k, v) { if (typeof k === 'object') { for (const [a, b] of Object.entries(k)) dados.set(a, structuredClone(b)); } else dados.set(k, structuredClone(v)); },
      async delete(k) { dados.delete(k); },
      async deleteAll() { dados.clear(); },
      async setAlarm(t) { alarme = t; },
    },
  };
}
