/** Own factual adapter of George et al. 2015 Table 3; source CC BY 4.0. Frozen kernel unchanged. */
import {PROFILE,CONFIRMATIONS,evaluateFeastPet} from './feast-pet-reference.mjs';
export {PROFILE};
export const feastFields=[
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
    "hint": "Guarda local independente do total e de achados históricos. Não aguarde completar o índice diante de emergência; dados da admissão não comprovam persistência atual.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Perfil de cálculo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "feast-pet-2015-clinical-v1",
        "label": "FEAST PET clínico · Tabela 3/2015 · completo"
      }
    ],
    "hint": "Oito componentes completos. PETaL, regressão Cox, LODS e PEDIA são identidades distintas, sem troca automática por falta de dado ou disponibilidade de laboratório.",
    "group": "Versão"
  },
  {
    "id": "context",
    "label": "Qual observação de admissão está sendo representada?",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "hospital_admission",
        "label": "Admissão hospitalar inicial"
      },
      {
        "value": "hdu_admission",
        "label": "Admissão inicial na HDU / maior dependência"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "HDU pode ocorrer após transferência/cuidados na enfermaria, com referência temporal própria. Não misturar os dois momentos nem usar piores medidas tardias. Trocar contexto invalida resultado anterior; reveja/substitua todos os dados e confirmações para a observação escolhida antes de calcular novamente.",
    "group": "Contexto e idade"
  },
  {
    "id": "ageBand",
    "label": "Faixa cronológica na observação escolhida",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "2m_to_8m_inclusive",
        "label": "De 2 meses até 8 meses, inclusive"
      },
      {
        "value": "over_8m_under_12y",
        "label": "Mais de 8 meses e antes do 12º aniversário"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Recorte local conservador: ≥2 meses e <12 anos, confirmado profissionalmente. A fonte descreve 2 meses a 12 anos, sem regra universal de exclusão exatamente no aniversário. O limite de 8 meses guia a rubrica de prostração, não os cortes de FC. Sem mês=30 dias, truncamento, inferência funcional ou calendário automático.",
    "group": "Contexto e idade"
  },
  {
    "id": "clinicalContextReviewed",
    "label": "População, admissão e transportabilidade revisadas?",
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
    "hint": "Profissional conferiu população, contexto de admissão e limites de transporte do modelo. Não equivale a diagnóstico de sepse/choque, elegibilidade integral do ensaio ou validação para qualquer país/serviço.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "admissionObservationConfirmed",
    "label": "Observação realmente inicial do contexto escolhido?",
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
    "hint": "Dados representam a observação efetivamente inicial da admissão no contexto selecionado, não medidas tardias após intervenção naquele contexto, piores/melhores valores ou uma mistura de momentos. Intervenções anteriores e a referência temporal foram conferidas externamente; não há janela automática em minutos e não se usa a hora da digitação.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "sameChildEpisodeConfirmed",
    "label": "Mesma criança, episódio e observação confirmados?",
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
    "hint": "Os oito dados pertencem à mesma criança, episódio e observação de admissão. A API não verifica prontuário, identidade ou calendário.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "professionalAdjudicationConfirmed",
    "label": "Rubricas adjudicadas por profissional habilitado?",
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
    "hint": "Profissional familiarizado com as rubricas adjudicou os achados e as limitações. A fonte usou treinamento de triagem/avaliação de emergência; não é avaliação automática por leigo.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "noMissingImputationConfirmed",
    "label": "Nenhuma ausência imputada como normal ou zero?",
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
    "hint": "Nenhum dado não medido, desconhecido, impossível de avaliar ou externo foi transformado em normal, ausente ou zero. Ausência de sinal foi realmente estabelecida.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "measurementsValidConfirmed",
    "label": "Medidas reais, unidades e qualidade confirmadas?",
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
    "hint": "Temperatura, frequência cardíaca e enchimento capilar foram efetivamente obtidos em unidades canônicas com qualidade e temporalidade conferidas. Validade técnica do número não certifica plausibilidade clínica.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "axillaryTemperatureConfirmed",
    "label": "Temperatura realmente axilar confirmada?",
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
    "hint": "A temperatura informada é axilar. Não substituir oral/retal/timpânica por correção arbitrária nem herdar a definição de hipotermia de outro escore.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "consciousnessAdjudicatedConfirmed",
    "label": "Consciência adjudicada com idade e função habitual?",
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
    "hint": "Normal/prostração/coma segundo rubrica do estudo foram estabelecidos considerando idade, desenvolvimento e função habitual. Não inferir de incapacidade basal, de não mamar habitualmente, sedação, intubação ou GCS/AVPU; se não adjudicável, desconhecido.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "respiratoryFindingsAdjudicatedConfirmed",
    "label": "Desconforto e crepitações clinicamente adjudicados?",
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
    "hint": "Desconforto respiratório e crepitações foram avaliados clinicamente. Não deduzir desconforto apenas da FR nem converter toda respiração profunda ou sibilância em crepitação.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "pallorPulseAdjudicatedConfirmed",
    "label": "Palidez grave e pulso radial adjudicados?",
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
    "hint": "Palidez grave e volume do pulso radial foram avaliados. Não converter automaticamente hemoglobina, pressão arterial ou débito presumido em presença/ausência.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "axillaryTemperatureC",
    "label": "Temperatura axilar na admissão (°C)",
    "type": "number",
    "min": 20,
    "max": 45,
    "step": "any",
    "noPoints": true,
    "hint": "≤37=1; >37=0 pontos. Temperatura 37 ou 36,5 pontua sem significar emergência ou hipotermia por esse motivo. Não corrigir oral/retal/timpânica automaticamente; unidade °C axilar. Até seis casas; 20–45 é limite técnico local.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "heartRateBpm",
    "label": "Frequência cardíaca na admissão (batimentos/min)",
    "type": "number",
    "min": 0,
    "max": 350,
    "step": "any",
    "noPoints": true,
    "hint": "<80 ou ≥220=2; 80≤FC<105=1; 105≤FC<220=0 pontos. Cortes da Tabela 3 não mudam com idade; exatamente 220 pontua2, sem importar >220 da narrativa. Decimais são admitidos, sem arredondar. Zero recusa a soma e mantém aviso basal; teto350 é técnico local.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "capillaryRefillSeconds",
    "label": "Tempo de enchimento capilar na admissão (s)",
    "type": "number",
    "min": 0,
    "max": 30,
    "step": "any",
    "noPoints": true,
    "hint": "≥2=1; <2=0 pontos. Exatamente2 pontua sem disparar aviso de urgência apenas por isso; o gatilho limitado de revisão é >2. Não confundir o corte inclusivo da Tabela3 com critério de entrada no ensaio. Decimais até seis casas, sem arredondar; teto30 é técnico local.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "consciousness",
    "label": "Consciência: uma categoria profissional exclusiva",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "normal",
        "label": "Sem prostração nem coma, após avaliação · 0 pontos"
      },
      {
        "value": "prostrate",
        "label": "Prostração adjudicada · 1 ponto"
      },
      {
        "value": "coma",
        "label": "Coma adjudicado · 2 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não adjudicável"
      }
    ],
    "hint": "Prostração na rubrica: >8 meses, incapacidade de sentar ereto; ≤8 meses, incapacidade de mamar. Interpretar com desenvolvimento e função habitual: incapacidade basal ou não mamar habitualmente não define alteração aguda. Coma: incapacidade de localizar estímulo doloroso em exame profissional válido. Não converter GCS/AVPU, sedação/intubação ou outro exame automaticamente. Coma vale2, não1+2.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "respiratoryDistress",
    "label": "Desconforto respiratório na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Presença/ausência clinicamente estabelecida. A tabela não define algoritmo universal de combinação de sinais; não inferir apenas da FR, de dispositivo ou de respiração profunda.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "lungCrepitations",
    "label": "Crepitações pulmonares na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Sons adventícios inspiratórios em um ou ambos os campos, conforme rubrica de estertores/crepitações do estudo. Sibilância isolada não substitui crepitações. Achado isolado não é um gatilho local de urgência, o que não comprova benignidade.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "severePallor",
    "label": "Palidez grave na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Palidez intensa em língua, gengivas ou conjuntiva palpebral interna, profissionalmente estabelecida. Não é qualquer palidez nem Hb abaixo de corte inventado. A Tabela3 inclui palidez grave; a lista divergente de respiração profunda na Tabela4 não a substitui.",
    "group": "Oito componentes da admissão"
  },
  {
    "id": "weakRadialPulse",
    "label": "Pulso radial fraco na admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecido / não estabelecido"
      }
    ],
    "hint": "Baixo volume/fraco, segundo exame profissional. Preparo local explicita radial; não inferir de FC, pressão ou débito presumido. Se não avaliável conforme rubrica, mantenha desconhecido.",
    "group": "Oito componentes da admissão"
  }
];
const bools=new Set([...CONFIRMATIONS,'respiratoryDistress','lungCrepitations','severePallor','weakRadialPulse']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(feastFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
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
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar o FEAST PET. Perigo atual informado, independente da soma e dos achados históricos da admissão.';
const pt=n=>String(n).replace('.',',');
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',incomplete:'Informação insuficiente'};
const findingNames={reported_admission_hypothermia_below36:'temperatura axilar <36 °C',reported_zero_heart_rate:'FC zero',reported_admission_extreme_heart_rate:'FC <80 ou ≥220/min',reported_admission_capillary_refill_over2:'enchimento capilar >2 s',reported_admission_prostrate:'prostração',reported_admission_coma:'coma',reported_admission_respiratory_distress:'desconforto respiratório',reported_admission_severe_pallor:'palidez grave',reported_admission_weak_radial_pulse:'pulso radial fraco'};
const validationWarning='Os autores solicitaram validação multicêntrica africana fora dos centros FEAST antes da implementação. Esta referência aritmética não estabelece benefício clínico de adoção rotineira nem supera a necessidade de avaliação local.';
function historicalText(r){
 if(r.urgentReviewRecommended===true)return 'Revisão prioritária de achado informado da admissão: '+r.urgentFindings.map(s=>findingNames[s]).join('; ')+'. Preparo/qualidade podem estar incompletos ou recusados; a persistência no presente não foi certificada. Verifique a situação atual sem aguardar o total diante de emergência.';
 if(r.urgentReviewRecommended===false)return 'Ausência dos gatilhos históricos limitados pesquisados estabelecida nos dados e preparo pertinentes. Isso não exclui outros perigos, deterioração ou urgência atual. T≤37 e TEC≥2 pontuam, mas T37/TEC2 isolados não geram este aviso; crepitações isoladas também não o geram e não são por isso consideradas benignas.';
 return 'Avaliação dos gatilhos históricos limitada, incompleta ou não estabelecida; desconhecido não significa ausente. Não equivale à triagem clínica completa nem à avaliação atual.';
}
export function evaluateFeastAdapter(raw){
 const {data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of feastFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Segurança atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?decimal(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica na unidade declarada; até seis casas, sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'sem perigo após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluateFeastPet(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','outside_profile','missing'],status=complete?'scored':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],historical=historicalText(r),alerts=[...(danger?[urgent]:[]),...(r.urgentReviewRecommended===true?[historical]:[])],level=danger?'high':'neutral';
 const local='Recorte local completo e sem imputação, sem calibração própria. Confirmações não verificam fonte, identidade, calendário, plausibilidade ou condição clínica atual. Não solicitar exames ou atrasar cuidado apenas pelo índice. Não há diagnóstico, probabilidade individual, banda de risco ou decisão automática de bolus/fluidos, tratamento, internação, alta ou limitação de suporte. '+validationWarning;
 if(!complete){const reason=[statusLabels[finalStatus]+': nenhum total ou componente emitido.',...all.map(i=>(feastFields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,totalComplete:false,total:null,components:null,interpretation:null,issues:all,errors,alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:statusLabels[finalStatus],reason,action:reason,audit:'FEAST PET clínico 2015, Tabela3. Oito dados de admissão, perfil/contexto/faixa e dez confirmações necessários; ausência ou recusa impede soma. '+historical+' '+local,breakdown:[]};}
 const names={temperature:'Temperatura axilar',heartRate:'Frequência cardíaca',capillaryRefill:'Enchimento capilar',consciousness:'Consciência',respiratoryDistress:'Desconforto respiratório',lungCrepitations:'Crepitações',severePallor:'Palidez grave',weakPulse:'Pulso radial fraco'},context=input.context==='hospital_admission'?'admissão hospitalar inicial':'admissão inicial na HDU / maior dependência',age=input.ageBand==='2m_to_8m_inclusive'?'2 a 8 meses inclusive':'mais de 8 meses e antes do 12º aniversário',known=v=>v?'presente, adjudicado':'ausente, após avaliação',state={normal:'sem prostração nem coma, após avaliação',prostrate:'prostração adjudicada',coma:'coma adjudicado'}[input.consciousness];
 const audit=`FEAST PET clínico 2015, Tabela 3, perfil ${PROFILE}. Observação pontual: ${context}; faixa cronológica manualmente confirmada ${age}. Idade ≥2 meses e <12 anos é recorte local conservador, não regra universal de exclusão autoral no aniversário. Temperatura axilar ${pt(input.axillaryTemperatureC)} °C; FC ${pt(input.heartRateBpm)}/min; enchimento capilar ${pt(input.capillaryRefillSeconds)} s; consciência: ${state}; desconforto respiratório ${known(input.respiratoryDistress)}; crepitações ${input.lungCrepitations?'presentes, adjudicadas':'ausentes, após avaliação'}; palidez grave ${input.severePallor?'presente, adjudicada':'ausente, após avaliação'}; pulso radial fraco ${known(input.weakRadialPulse)}. Oito componentes conhecidos, dez confirmações profissionais estabelecidas: mesma criança/episódio/observação inicial, contexto/qualidade/fontes e rubricas revistos; nenhuma imputação de dado não medido, desconhecido ou impossível de avaliar como normal/ausente/zero, inclusive externamente. Contexto HDU pode seguir cuidados prévios na enfermaria; não misturar dados entre admissões, usar medidas tardias após intervenção naquele contexto ou selecionar piores valores. Não existe calendário validado, horário basal inventado ou janela universal de uma hora. Prostração depende da rubrica ≤8 meses (mamar) ou >8 meses (sentar ereto) com desenvolvimento/função habitual; não inferida por incapacidade basal, sedação, intubação ou GCS/AVPU. Coma é categoria exclusiva de incapacidade de localizar estímulo doloroso em avaliação válida, sem somar prostração. Soma: ${Object.entries(r.components).map(([k,n])=>names[k]+' '+n).join(' + ')} = ${r.total}/10 pontos. FC220 inclui2 e não varia com idade; temperatura axilar≤37 e TEC≥2 incluem1, sem arredondamento de decimais. T37/TEC2 não significam emergência isoladamente. Palidez grave da Tabela3 é mantida; respiração profunda da lista divergente da Tabela4 e peso não integram a soma. PETaL/lactato/pH/BUN não são acionados. ${historical} Segurança atual: ${safety}. ${local} Mortalidade precoce estudada: derivação até48h desde randomização; Kilifi até2dias por datas de admissão, sem hora de morte, não equivalência cronométrica comprovada. DerivaçãoFEAST3170; análise de controle integrada ao desenvolvimento; Kilifi5098 com PET calculável e HDU1053 sobreposta, não duas populações independentes. Limites técnicos locais20–45°C, FC>0..350 e TEC0..30, até seis casas; não certificam plausibilidade. Fonte George et al.2015, CC BY4.0, redação factual/código próprios; sem tradução validada, endosso, formulário externo ou alegação de inexistência de validações posteriores. Não há comparação seriada/delta implementados.`;
 return {...r,displayValue:String(r.total),errors:[],issues:[],alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:'Pontuação de admissão · prognóstico descritivo',reason:null,action:'Soma dos oito componentes; nenhum corte de conduta ou probabilidade individual foi calculado. Total zero não exclui perigo. '+local,audit,breakdown:Object.entries(r.components).map(([key,n])=>({label:names[key],points:n,detail:n+' pontos'}))};
}
export const feastScore={...{
  "id": "feast-pet-2015",
  "name": "FEAST PET · prognóstico pediátrico na admissão",
  "subtitle": "2015 · Tabela 3 clínica · oito componentes completos",
  "specialty": "Pediatria",
  "specialties": [
    "Pediatria",
    "Terapia Intensiva"
  ],
  "aliases": [
    "FEAST PET",
    "Paediatric Emergency Triage",
    "George 2015",
    "HDU"
  ],
  "population": "≥2 meses e antes do 12º aniversário · admissão hospitalar ou HDU selecionada",
  "range": "0–10 pontos",
  "min": 0,
  "max": 10,
  "resultScale": false,
  "unit": "pontos",
  "reviewDate": "11/10/2026",
  "scope": "Referência computacional descritiva da Tabela3 de George2015 para mortalidade precoce em contextos pediátricos de admissão estudados. Derivação em crianças gravemente doentes/febris com perfusão comprometida na África oriental; validação temporal em admissões gerais e subconjunto HDU de Kilifi. Não exige que toda admissão seja diagnosticada como sepse/choque. Recorte local de ≥2meses a antes de12anos, dados completos e preparo manual, sem calibração própria. Os autores solicitaram validação multicêntrica africana fora dos centros FEAST antes da implementação. A fidelidade aritmética não estabelece benefício de adoção rotineira nem supera avaliação local.",
  "formula": "Somar oito componentes da Tabela3: temperatura AXILAR≤37°C=1,>37=0; FC<80 ou≥220/min=2,80≤FC<105=1,105≤FC<220=0; enchimento capilar≥2s=1,<2=0; consciência sem prostração/coma=0,prostração=1,coma=2, uma categoria exclusiva; desconforto respiratório=1; crepitações=1; palidez grave=1; pulso fraco (radial no preparo local)=1. Ausência conhecida dos quatro sinais=0. Total0–10, sem bandas ou percentual. FC não ajustada por idade; decimais não arredondados. FCzero recusa total com aviso basal. Peso/respiração profunda não são parcelas finais; não importar a lista divergente da Tabela4 nem PETaL. T37 e TEC2 pontuam, mas não acionam urgência apenas pelo ponto.",
  "limits": "Dados ausentes/não medidos/não avaliáveis nunca viram normais ou zero, inclusive externos. Oito componentes, contexto, faixa e dez confirmações obrigatórios. Temperatura axilar real, sem correção automática de outros sítios. Prostração: >8meses incapacidade de sentar ereto; ≤8meses incapacidade de mamar, sempre contextualizar função habitual/desenvolvimento. Coma: incapacidade de localizar dor profissionalmente adjudicada; sem equivalência automática a GCS/AVPU, sedação ou intubação, sem somar coma+prostração. Crepitações não são sibilos; palidez grave não é Hb presumida; pulso radial fraco não é PAS/FC inferida. Admissão hospitalar e HDU são momentos distintos; HDU pode seguir cuidado prévio. Não usar piores valores, misturar momentos ou inventar janela universal de1h/calendário. Desfechos48h desde randomização versus2dias por datas em Kilifi não são equivalentes cronométricos provados. Coorte geral/HDU sobrepostas. T20–45,FC0–350,TEC0–30 e seis casas são guardas locais, não plausibilidade biológica; FCzero fora da soma. Achados históricos não certificam persistência atual; zero não afasta perigo. Sem porcentagem, bandas, diagnóstico, bolus/fluidos, tratamento, alta ou limitação de suporte automática. Os autores solicitaram validação multicêntrica africana fora dos centros FEAST antes da implementação; esta ficha não estabelece benefício de uso rotineiro ou calibração brasileira. Evidência posterior parcial não prova inexistência de outras validações completas. PETaL/Cox/comparação fora do escopo; código/texto próprios, sem tradução validada ou endosso.",
  "sources": [
    {
      "title": "George et al. 2015 · Tabela3, rubricas, população e ressalva de implementação",
      "url": "https://link.springer.com/article/10.1186/s12916-015-0407-3"
    },
    {
      "title": "Brals et al. 2024 · CHAIN: PET/PETaL excluídos por dados indisponíveis, não validação",
      "url": "https://jogh.org/2024/jogh-14-04235"
    }
  ],
  "reuse": {
    "attribution": "Síntese factual e código próprios com atribuição a George et al.2015, CC BY4.0. Recorte local/adaptação editorial explicitados; sem redistribuir PDF/tabela desenhada/formulário e sem tradução validada ou endosso autoral.",
    "license": "Fonte original George2015: CC BY4.0",
    "url": "https://creativecommons.org/licenses/by/4.0/"
  }
},fields:feastFields,safeCalculate:evaluateFeastAdapter,safeValidate:raw=>evaluateFeastAdapter(raw).errors,assessPartial:raw=>{const r=evaluateFeastAdapter(raw);return {level:r.level,alert:r.alerts.join(' ')||null};}};
export const feastScores=[feastScore];
