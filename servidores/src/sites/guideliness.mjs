// Guideliness — servidor original (dist/server/index.js): /api/research e /mcp.
// As páginas continuam vindo dos arquivos publicados; só estas duas rotas vão ao servidor original.
import { criarWorker } from '../adaptador.mjs';
import original from 'fonte:guideliness/dist/server/index.js';

const semArquivos = env => ({ ...env, ASSETS: undefined });
export default criarWorker({
  site: 'guideliness',
  rotas: {
    '/api/research': { fetch: (request, env) => original.fetch(request, semArquivos(env)), acesso: 'original' },
    '/mcp': { fetch: (request, env) => original.fetch(request, semArquivos(env)), acesso: 'publico' },
  },
});
