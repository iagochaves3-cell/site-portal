// Abordagens Clínicas — rotas originais /api/status e /api/chat (pesquisa clínica com IA).
// No site original o chat era aberto, com limite de 8 consultas por hora por conexão.
// Aqui o chat pede a entrada por senha (ACESSO_IA=senha); o limite original continua valendo.
import { criarWorker } from '../adaptador.mjs';
import * as status from 'fonte:abordagem-clinica/app/api/status/route.ts';
import * as chat from 'fonte:abordagem-clinica/app/api/chat/route.ts';

export default criarWorker({
  site: 'abordagem-clinica',
  rotas: {
    '/api/status': { metodos: status, acesso: 'publico' },
    '/api/chat': { metodos: chat, acesso: 'sessao' },
  },
});
