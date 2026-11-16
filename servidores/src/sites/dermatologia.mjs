// Dermatologia — rota original /api/analyze (análise por IA com fotografias).
import { criarWorker } from '../adaptador.mjs';
import * as analyze from 'fonte:dermatologia/app/api/analyze/route.ts';

export default criarWorker({
  site: 'dermatologia',
  rotas: { '/api/analyze': { metodos: analyze, acesso: 'original' } },
});
