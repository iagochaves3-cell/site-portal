// Substituto mínimo de "next/headers": devolve os cabeçalhos da requisição em andamento.
import { requisicao } from '../adaptador.mjs';

export async function headers() {
  const atual = requisicao.getStore();
  if (!atual) throw new Error('headers() chamado fora de uma requisição');
  return atual.headers;
}

export async function cookies() {
  const texto = (await headers()).get('cookie') || '';
  const mapa = new Map();
  for (const parte of texto.split(';')) {
    const i = parte.indexOf('=');
    if (i > 0) mapa.set(parte.slice(0, i).trim(), parte.slice(i + 1).trim());
  }
  return {
    get: nome => (mapa.has(nome) ? { name: nome, value: mapa.get(nome) } : undefined),
    has: nome => mapa.has(nome),
    getAll: () => [...mapa].map(([name, value]) => ({ name, value })),
  };
}
