// Prescrição Integral — rotas originais de servidor:
//   /api/clinical          motor clínico determinístico (sem IA externa)
//   /api/protocols         protocolos clínicos revisados (banco D1)
//   /api/whatsapp/status   situação da integração com o WhatsApp
//   /api/whatsapp/profile  cadastro do WhatsApp pessoal (número cifrado no D1)
//   /api/whatsapp/webhook  entrada da Meta (aberta; conferida pela assinatura da Meta)
// As rotas conferem a identidade pelos cabeçalhos oai-*, que o adaptador preenche
// a partir da sessão do acesso-sites (cabeçalhos vindos de fora são descartados).
import { criarWorker } from '../adaptador.mjs';
import * as clinico from 'fonte:prescricao-integral/app/api/clinical/route.ts';
import * as protocolos from 'fonte:prescricao-integral/app/api/protocols/route.ts';
import * as waStatus from 'fonte:prescricao-integral/app/api/whatsapp/status/route.ts';
import * as waPerfil from 'fonte:prescricao-integral/app/api/whatsapp/profile/route.ts';
import * as waWebhook from 'fonte:prescricao-integral/app/api/whatsapp/webhook/route.ts';

export default criarWorker({
  site: 'prescricao-integral',
  rotas: {
    '/api/clinical': { metodos: clinico, acesso: 'original' },
    '/api/protocols': { metodos: protocolos, acesso: 'original' },
    '/api/whatsapp/status': { metodos: waStatus, acesso: 'original' },
    '/api/whatsapp/profile': { metodos: waPerfil, acesso: 'original' },
    '/api/whatsapp/webhook': { metodos: waWebhook, acesso: 'publico' },
  },
});
