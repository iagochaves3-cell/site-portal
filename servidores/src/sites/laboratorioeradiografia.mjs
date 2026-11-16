// Laboratório e Raio X — rotas originais /api/upload, /api/report e /api/file.
// O armazenamento temporário de anexos (R2 no original) usa Workers KV com a mesma interface.
// /api/file é lido pelos servidores da OpenAI com um token de uso único e prazo curto; por isso é público.
import { criarWorker } from '../adaptador.mjs';
import { baldeKV } from '../shims/balde-kv.mjs';
import * as upload from 'fonte:laboratorioeradiografia/app/api/upload/route.ts';
import * as report from 'fonte:laboratorioeradiografia/app/api/report/route.ts';
import * as file from 'fonte:laboratorioeradiografia/app/api/file/route.ts';

export default criarWorker({
  site: 'laboratorioeradiografia',
  preparar: env => ({ BUCKET: baldeKV(env.ENVIOS) }),
  rotas: {
    '/api/upload': { metodos: upload, acesso: 'sessao' },
    '/api/report': { metodos: report, acesso: 'sessao' },
    '/api/file': { metodos: file, acesso: 'publico' },
  },
});
