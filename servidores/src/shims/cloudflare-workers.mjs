// Substituto de "cloudflare:workers" para o código original dos sites.
// "env" enxerga os vínculos reais do Worker e, por cima deles, os valores da
// requisição em andamento (chave da OpenAI vinda do serviço de acesso, armazenamento
// temporário etc.).
import * as real from 'cloudflare:workers';
import { requisicao } from '../adaptador.mjs';

const proprio = (objeto, nome) => !!objeto && Object.prototype.hasOwnProperty.call(objeto, nome);
function base() { const atual = requisicao.getStore(); return (atual && atual.env) || real.env || {}; }

export const env = new Proxy({}, {
  get(_alvo, nome) {
    const atual = requisicao.getStore();
    if (atual && proprio(atual.extra, nome)) return atual.extra[nome];
    return base()[nome];
  },
  has(_alvo, nome) {
    const atual = requisicao.getStore();
    if (atual && proprio(atual.extra, nome)) return atual.extra[nome] !== undefined;
    return nome in base();
  },
  ownKeys() {
    const atual = requisicao.getStore();
    return [...new Set([...Reflect.ownKeys(base()), ...(atual ? Reflect.ownKeys(atual.extra) : [])])];
  },
  getOwnPropertyDescriptor(_alvo, nome) {
    const valor = this.get(_alvo, nome);
    return valor === undefined ? undefined : { value: valor, enumerable: true, configurable: true, writable: false };
  },
});

export const WorkerEntrypoint = real.WorkerEntrypoint;
export const DurableObject = real.DurableObject;
export const RpcTarget = real.RpcTarget;
export function waitUntil(promessa) {
  const atual = requisicao.getStore();
  if (atual && atual.ctx) atual.ctx.waitUntil(promessa);
}
