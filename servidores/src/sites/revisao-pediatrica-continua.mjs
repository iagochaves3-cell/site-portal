// Revisão Pediátrica Contínua — rota original /api/workspace (fila persistente no banco D1).
import { criarWorker } from '../adaptador.mjs';
import * as workspace from 'fonte:revisao-pediatrica-continua/app/api/workspace/route.ts';

export default criarWorker({
  site: 'revisao-pediatrica-continua',
  rotas: { '/api/workspace': { metodos: workspace, acesso: 'original' } },
});
