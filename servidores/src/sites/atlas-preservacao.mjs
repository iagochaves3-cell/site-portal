// Arquivo Atlas — rota original /api/acervo (histórico de revisões no banco D1).
import { criarWorker } from '../adaptador.mjs';
import * as acervo from 'fonte:atlas-preservacao/app/api/acervo/route.ts';

export default criarWorker({
  site: 'atlas-preservacao',
  rotas: { '/api/acervo': { metodos: acervo, acesso: 'original' } },
});
