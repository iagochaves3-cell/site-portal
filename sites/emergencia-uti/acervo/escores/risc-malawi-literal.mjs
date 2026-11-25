/** Own factual adapter, attributed to Hooli et al. 2016/2018 (CC BY 4.0). Frozen reference unchanged. */
import {PROFILE,CONFIRMATIONS,evaluateRiscMalawi} from './risc-malawi-reference.mjs';
export {PROFILE};
export const riscMalawiFields=[
  {
    "id": "danger_signs",
    "label": "Há perigo atual, instabilidade ou piora que exige avaliação imediata?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim"
      },
      {
        "value": 0,
        "label": "Não, após avaliação atual"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Guarda local independente dos dados históricos e do total. Não inferir o estado atual de hipoxemia ou inconsciência registradas na admissão. Não aguardar o escore diante de emergência.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Perfil de cálculo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "risc-malawi-muac-2016-literal-v1",
        "label": "RISC-Malawi MUAC 2016 · admissão · literal completo"
      }
    ],
    "hint": "Cinco domínios, variante MUAC. Correção de 2018 da regressão apenas documental; sem probabilidade logística e sem troca automática por RISC, mRISC ou WAZ.",
    "group": "Versão"
  },
  {
    "id": "hospitalizedPneumoniaConfirmed",
    "label": "Pneumonia clínica hospitalizada confirmada?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Pneumonia clínica compatível com a referência Malawi/OMS, adjudicada por profissional, em criança hospitalizada. Não exige confirmação radiográfica ou bacteriana. Não é teste diagnóstico ou ambulatorial.",
    "group": "Preparo da admissão"
  },
  {
    "id": "admissionAssessmentConfirmed",
    "label": "Os dados são da avaliação de admissão?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Dados da avaliação de admissão hospitalar de referência; não usar piores valores de 24 horas nem misturar nova avaliação pós-tratamento. Confirmação manual, sem calendário verificado pela ficha.",
    "group": "Preparo da admissão"
  },
  {
    "id": "samePatientEpisodeConfirmed",
    "label": "Mesma criança, episódio e avaliação confirmados?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Idade e cinco domínios da mesma criança, episódio e avaliação. Fonte conhecida, sem necessidade de digitar identificadores pessoais.",
    "group": "Preparo da admissão"
  },
  {
    "id": "professionalAdjudicationConfirmed",
    "label": "Preparo e medidas revisados por profissional?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Profissional apto conferiu contexto, unidades, qualidade das medidas e categorias. A ficha não certifica prontuário, calendário ou plausibilidade clínica.",
    "group": "Preparo da admissão"
  },
  {
    "id": "noMissingImputationConfirmed",
    "label": "Nenhuma ausência foi imputada como normal ou zero?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Exige fontes conhecidas e nenhuma conversão de não medido, desconhecido ou impossível de avaliar em normal/zero, inclusive por terceiro. Não reproduz imputação múltipla da coorte. Não solicitar medidas/exames só para preencher o índice.",
    "group": "Preparo da admissão"
  },
  {
    "id": "spo2RoomAirMeasurementConfirmed",
    "label": "SpO₂ realmente medida em ar ambiente na admissão?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Registro real em ar ambiente na admissão. Oxigênio iniciado depois não invalida medida anterior pertinente. Apenas medida sob O₂ ou condição desconhecida impede o perfil. Não retirar suporte para medir nem inferir SpO₂ <90% porque recebeu O₂.",
    "group": "Preparo da admissão"
  },
  {
    "id": "spo2MeasurementValidConfirmed",
    "label": "Qualidade da SpO₂ e unidade percentual confirmadas?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Sinal e registro confiáveis em porcentagem. Artefato ou leitura incerta não é medida válida; confirmações não resolvem a lacuna 92<SpO₂<93%.",
    "group": "Preparo da admissão"
  },
  {
    "id": "muacMeasurementValidConfirmed",
    "label": "MUAC realmente medido e tecnicamente válido?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Circunferência braquial média com fonte e unidade conhecidas; não estimar por peso, IMC, WAZ ou categoria nutricional. MUAC 13,5 cm permanece lacuna mesmo com preparo confirmado.",
    "group": "Preparo da admissão"
  },
  {
    "id": "wheezeAssessedConfirmed",
    "label": "Presença ou ausência de sibilância estabelecida?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Presença ou ausência no exame efetivamente estabelecida; silêncio no prontuário não significa ausência.",
    "group": "Preparo da admissão"
  },
  {
    "id": "unconsciousnessAdjudicatedConfirmed",
    "label": "Presença ou ausência de inconsciência adjudicada?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim, confirmado por profissional"
      },
      {
        "value": 0,
        "label": "Não, requisito não satisfeito"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Adjudicação clínica profissional. Não converter automaticamente sonolência, prostração, AVPU ou Glasgow. Sedação ou confundimento que impeça decidir mantém o dado desconhecido.",
    "group": "Preparo da admissão"
  },
  {
    "id": "ageCompletedMonths",
    "label": "Idade na admissão (meses completos)",
    "type": "number",
    "min": 0,
    "max": 1200,
    "step": 1,
    "noPoints": true,
    "hint": "Inteiro de 2 a 59 meses completos para este perfil. Não converter mês em 30 dias, arredondar idade fracionária nem substituir pela idade atual. A ficha não recebe datas e não valida calendário.",
    "group": "Dados da admissão"
  },
  {
    "id": "spo2Percent",
    "label": "SpO₂ real em ar ambiente na admissão (%)",
    "type": "number",
    "min": 0,
    "max": 100,
    "step": "any",
    "noPoints": true,
    "hint": "<90: 7; 90–92 inclusive: 2; ≥93: 0 pontos. 92<SpO₂<93 é lacuna literal, sem total e sem arredondamento. Até seis casas decimais. Unidade %; não usar fração 0–1 como se fosse porcentagem.",
    "group": "Dados da admissão"
  },
  {
    "id": "muacCm",
    "label": "MUAC · circunferência braquial média (cm)",
    "type": "number",
    "min": 1e-06,
    "max": 50,
    "step": "any",
    "noPoints": true,
    "hint": "<11,5: 7; 11,5≤MUAC<13,5: 3; >13,5: 0 pontos. Exatamente 13,5 é conflito entre tabela e método, recusado. Se fonte em mm, converter explicitamente fora da ficha ÷10 sem arredondar: 135 mm=13,5 cm, ainda recusado. Teto 50 e seis casas são guardas técnicas locais, não plausibilidade certificada.",
    "group": "Dados da admissão"
  },
  {
    "id": "sex",
    "label": "Categoria de sexo registrada no modelo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "male",
        "label": "Masculino · 0 pontos"
      },
      {
        "value": "female",
        "label": "Feminino · 1 ponto"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Não inferir pelo nome, aparência ou outro campo. Usar a categoria efetivamente registrada na referência.",
    "group": "Dados da admissão"
  },
  {
    "id": "wheezePresent",
    "label": "Sibilância na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente · −2 pontos"
      },
      {
        "value": 0,
        "label": "Ausente, após exame · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Peso estatístico negativo legítimo. Não significa proteção individual, asma diagnosticada ou dispensa de avaliação respiratória.",
    "group": "Dados da admissão"
  },
  {
    "id": "unconscious",
    "label": "Inconsciência na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicada · 8 pontos"
      },
      {
        "value": 0,
        "label": "Ausente, adjudicada · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Dado clínico histórico, separado de perigo atual. Não inferir causalidade ou converter automaticamente escala de consciência; confundimento não resolvido impede atribuir normalidade.",
    "group": "Dados da admissão"
  }
];
const bools=new Set([...CONFIRMATIONS,'wheezePresent','unconscious']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(riscMalawiFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
 if(raw===null||typeof raw!=='object')return {data,issues:[{field:'profile',kind:'invalid',reason:'Objeto de dados obrigatório.'}],safeDanger:false};
 try{const p=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(p!==Object.prototype&&p!==null))invalid('profile','Protótipo não admitido.');}catch{invalid('profile','Falha ao ler protótipo.');}
 // Independent, single own safety descriptor: may preserve an alert, never recover completeness.
 let safetyDescriptor,safetyReadFailed=false;
 try{safetyDescriptor=Object.getOwnPropertyDescriptor(raw,'danger_signs');}catch{safetyReadFailed=true;invalid('danger_signs','Falha ao ler descritor próprio de segurança.');}
 const safeDanger=!!(safetyDescriptor&&Object.hasOwn(safetyDescriptor,'value')&&(safetyDescriptor.value===1||safetyDescriptor.value==='1'));
 let keys;try{keys=Reflect.ownKeys(raw);}catch{invalid('profile','Falha na primeira lista de chaves.');return {data,issues,safeDanger};}
 for(const k of keys){let d;if(k==='danger_signs'){if(safetyReadFailed)continue;d=safetyDescriptor;}else try{d=Object.getOwnPropertyDescriptor(raw,k);}catch{invalid(typeof k==='string'&&allowed.has(k)?k:'profile','Falha ao ler descritor.');continue;}
  if(typeof k!=='string'||!allowed.has(k)){invalid('profile','Campo não previsto.');continue;}if(!d||!Object.hasOwn(d,'value')){invalid(k,'Accessor recusado sem invocação.');continue;}data[k]=d.value;
 }
 return {data,issues,safeDanger};
}
function selection(v,f){if(typeof v!=='string'&&typeof v!=='number')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const o=f.options.find(o=>v===o.value||(typeof v==='string'&&v===String(o.value)));return o?{ok:true,value:o.value}:{ok:false};}
function decimal(v){if(typeof v!=='number'&&typeof v!=='string')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const t=String(v);if(!/^(?:0|[1-9]\d*)(?:[.,]\d{1,6})?$/.test(t))return {ok:false};return {ok:true,value:Number(t.replace(',','.'))};}
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar o RISC-Malawi. Perigo atual informado, independente do total e dos achados históricos da admissão.';
const pt=n=>String(n).replace('.',',');
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',unresolved_source:'Borda literal não resolvida · sem total',incomplete:'Informação insuficiente'};
function historicalText(r){
 if(r.urgentReviewRecommended===true)return 'Revisão prioritária de achado informado da admissão: '+r.urgentFindings.map(s=>s==='reported_spo2_below90'?'SpO₂ <90%':'inconsciência').join(' e ')+'. O preparo pode estar incompleto; a persistência atual não foi certificada. Verifique o contexto e o estado clínico atual, sem aguardar o total se houver emergência.';
 if(r.urgentReviewRecommended===false)return 'Ausência dos dois gatilhos históricos pesquisados (SpO₂ <90% e inconsciência) estabelecida nos dados informados, com seu preparo relevante confirmado. Isso não exclui outras urgências nem avalia o perigo atual.';
 return 'Avaliação dos dois gatilhos históricos incompleta ou não estabelecida; desconhecimento não equivale a ausência. Isso não é triagem clínica completa nem avaliação do estado atual.';
}
export function evaluateRiscMalawiAdapter(raw){
 const {data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of riscMalawiFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Segurança atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?decimal(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica na unidade declarada; sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'sem perigo após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluateRiscMalawi(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','outside_profile','unresolved_source','missing'],status=complete?'scored':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],historical=historicalText(r),alerts=[...(danger?[urgent]:[]),...(r.urgentReviewRecommended===true?[historical]:[])],level=danger?'high':'neutral';
 const local='Recorte local literal completo e sem imputação, sem validação ou calibração própria. Não pedir exames/medidas apenas para calcular nem retardar cuidado. O núcleo não valida calendário, identidade, prontuário ou plausibilidade clínica. Não há diagnóstico etiológico, probabilidade individual, decisão automática de suporte, antibiótico ou alta.';
 if(!complete){const reason=[statusLabels[finalStatus]+': nenhum total, componente ou indicador de limiar foi emitido.',...all.map(i=>(riscMalawiFields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,totalComplete:false,total:null,components:null,thresholds:null,interpretation:null,issues:all,errors,alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:statusLabels[finalStatus],reason,action:reason,audit:'RISC-Malawi MUAC 2016, cinco domínios da admissão. Ausências, preparo recusado ou bordas não resolvidas impedem a soma; não imputar normal/zero. '+historical+' '+local,breakdown:[]};}
 const names={oxygen:'SpO₂ em ar ambiente',nutrition:'MUAC',sex:'Categoria de sexo',wheeze:'Sibilância',unconsciousness:'Inconsciência'};
 const audit=`RISC-Malawi MUAC 2016, perfil ${PROFILE}. Avaliação de admissão hospitalar por pneumonia clínica compatível com a referência Malawi/OMS; idade ${input.ageCompletedMonths} meses completos na admissão. Mesma criança/episódio, preparo profissional e todas as dez confirmações estabelecidos. SpO₂ ${pt(input.spo2Percent)}% realmente medida em ar ambiente, sinal e unidade válidos; suporte iniciado depois não altera esse registro, sem retirar suporte para obter medida. MUAC ${pt(input.muacCm)} cm realmente medido, sem derivação de peso/IMC/WAZ. Sexo registrado: ${input.sex==='female'?'feminino':'masculino'}; sibilância ${input.wheezePresent?'presente':'ausente após exame'}; inconsciência ${input.unconscious?'presente':'ausente'}, clinicamente adjudicada na admissão. Nenhuma ausência, dado não medido/desconhecido ou impossível de avaliar imputado como normal/zero, inclusive externamente. Soma dos cinco domínios: ${Object.entries(r.components).map(([k,n])=>names[k]+' '+pt(n)).join(' + ')} = ${r.total} pontos; faixa −2 a 23, valores negativos legítimos. Limiar histórico ≥5: ${r.thresholds.atLeast5?'atingido':'não atingido'}; ≥8: ${r.thresholds.atLeast8?'atingido':'não atingido'}. São referências históricas separadas, sem categoria individual de segurança ou garantia de baixo risco abaixo deles. Sibilância com peso −2 não é proteção individual. ${historical} Segurança atual: ${safety}. ${local} MUAC 13,5 cm e 92<SpO₂<93% permanecem sem total, sem arredondar; teto MUAC 50 cm e seis casas são guardas técnicas locais. Correção de 2018 da logística apenas documental; nenhuma probabilidade foi calculada. Não há pontuação seriada ou delta.`;
 return {...r,displayValue:pt(r.total),errors:[],issues:[],alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:'Pontuação de admissão · limiares históricos',reason:null,action:`Limiar histórico ≥5: ${r.thresholds.atLeast5?'atingido':'não atingido'}; ≥8: ${r.thresholds.atLeast8?'atingido':'não atingido'}. A soma não gera probabilidade individual ou categoria universal de segurança. Abaixo dos limiares não autoriza alta. `+local,audit,breakdown:Object.entries(r.components).map(([key,n])=>({label:names[key],points:n,detail:pt(n)+' pontos'}))};
}
export const riscMalawiScore={...{
  "id": "risc-malawi-muac-2016",
  "name": "RISC-Malawi MUAC · pneumonia hospitalizada",
  "subtitle": "Admissão · 2016 · cinco domínios completos · limiares históricos",
  "specialty": "Pediatria",
  "specialties": [
    "Pediatria",
    "Pneumologia",
    "Terapia Intensiva"
  ],
  "aliases": [
    "RISC-Malawi",
    "Respiratory Index of Severity in Children Malawi",
    "MUAC",
    "circunferência braquial média",
    "pneumonia pediátrica"
  ],
  "population": "Pneumonia clínica hospitalizada · 2–59 meses completos na admissão",
  "range": "−2 a 23 pontos",
  "min": -2,
  "max": 23,
  "resultScale": false,
  "unit": "pontos",
  "reviewDate": "11/10/2026",
  "scope": "Prognóstico histórico de mortalidade durante a hospitalização por pneumonia clinicamente estabelecida, na variante MUAC de Hooli 2016. Referência derivada de 14.665 internações/464 óbitos em sete hospitais de Malawi (2011–2014), crianças de 2–59 meses. Este recorte local exige cinco domínios completos sem imputação e recusa bordas conflitantes, sem validação ou calibração próprias. Não é diagnóstico, risco pós-alta, avaliação ambulatorial ou instrumento de conduta automática. Idade, fontes, momento e vínculo são manualmente adjudicados; não há calendário validado.",
  "formula": "Somar cinco parcelas: SpO₂ em ar ambiente <90%=7, 90–92% inclusive=2, ≥93%=0; 92<SpO₂<93 sem ramo literal. MUAC <11,5 cm=7, 11,5≤MUAC<13,5=3, >13,5=0; exatamente 13,5 recusado por sobreposição/divergência de fonte. Categoria de sexo feminino=1, masculino=0; sibilância presente=−2, ausência examinada=0; inconsciência presente=8, ausência adjudicada=0. Total −2 a 23, incluindo −1 legítimo. São 72 estados e 26 totais inteiros atingíveis. Indicadores ≥5 e ≥8 somente referências históricas, sem classe universal ou probabilidade. Não truncar valores negativos, arredondar para encaixar faixas, converter oxigênio recebido em hipóxia ou substituir MUAC por WAZ. Correção de 2018 referente à regressão apenas documental.",
  "limits": "Recorte literal e completo: ausência não é normalidade/zero; sem imputação, prorrateio ou troca de versão. MUAC 13,5 cm e 92<SpO₂<93% impedem total. Só SpO₂ real em ar ambiente na admissão; medida anterior válida continua pertinente se O₂ iniciado depois. Não retirar suporte ou solicitar medidas/exames só para calcular. MUAC em cm, conversão externa explícita de mm÷10 sem arredondar; teto 50 cm e seis casas decimais são guardas técnicas locais, não plausibilidade certificada. Idade em meses completos 2–59 na admissão, sem mês=30 dias. Dados históricos de SpO₂<90/inconsciência requerem revisão; não certificam persistência atual. Ausência desses dois gatilhos não é triagem completa. Sibilância negativa na soma não garante proteção. Limiares históricos não autorizam alta, antibiótico, oxigênio ou retirada de suporte; nenhuma probabilidade individual ou certeza de morte. Transportabilidade/calibração limitadas, inclusive validações externas; subconjunto local sem validação própria. Não implementados RISC original HIV+/HIV−, mRISC, variante WAZ, regressão individual, recalibração ou delta. HIV não é variável e não é presumido negativo. Redação/código próprios, sem tradução validada ou endosso autoral.",
  "sources": [
    {
      "title": "Hooli et al. 2016 · método e tabelas 5/6 · pesos MUAC, bordas e limiares",
      "url": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0168126"
    },
    {
      "title": "Hooli et al. 2018 · correção da regressão, apenas documental",
      "url": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0193557"
    },
    {
      "title": "Rees et al. 2021 · validação externa; MUAC e WAZ são distintos",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8542381/"
    }
  ],
  "reuse": {
    "attribution": "Síntese factual e código próprios com atribuição a Hooli et al. 2016/2018, CC BY 4.0. Restrições locais de completude, bordas e apresentação explicitadas; sem endosso autoral ou tradução validada.",
    "license": "CC BY 4.0 nas fontes Hooli 2016/2018",
    "url": "https://creativecommons.org/licenses/by/4.0/"
  }
},fields:riscMalawiFields,safeCalculate:evaluateRiscMalawiAdapter,safeValidate:raw=>evaluateRiscMalawiAdapter(raw).errors,assessPartial:raw=>{const r=evaluateRiscMalawiAdapter(raw);return {level:r.level,alert:r.alerts.join(' ')||null};}};
export const riscMalawiScores=[riscMalawiScore];
