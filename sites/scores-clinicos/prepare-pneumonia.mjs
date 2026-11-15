/** Own factual adapter of PREPARE 2022 Table 3. Frozen research kernel remains byte-exact. */
import {PROFILE,CONFIRMATIONS,evaluatePrepare} from './prepare-reference.mjs';
export {PROFILE};
export const prepareFields=[
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
    "hint": "Guarda local independente dos dados basais e do total. Achados históricos não atestam persistência atual; não aguardar escore diante de emergência.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Perfil de cálculo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "prepare-pneumonia-mortality-2022-table3-literal-v1",
        "label": "PREPARE mortalidade 2022 · Tabela 3 com SpO₂ · completo"
      }
    ],
    "hint": "Dez entradas conhecidas e dez parcelas, incluindo tiragem com peso zero. Não trocar automaticamente por versão sem oximetria, adaptação WHO 2023, PREPARE hipoxemia ou RISC-Malawi.",
    "group": "Versão"
  },
  {
    "id": "hospitalizedPneumoniaConfirmed",
    "label": "Hospitalização por suspeita/pneumonia clínica adjudicada?",
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
    "hint": "Criança hospitalizada por suspeita/pneumonia clínica compatível com a definição de referência WHO Pocket Book 2013, adjudicada por profissional. Não diagnosticar pelo escore, não exigir etiologia bacteriana nem radiografia como substituto.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "baselineAssessmentConfirmed",
    "label": "Dados da mesma avaliação basal confirmados?",
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
    "hint": "Dados da avaliação basal/enrolamento desta hospitalização, não melhores/piores valores selecionados depois. Não há janela universal em horas estabelecida nesta fonte; confirmar a observação representada, sem usar hora de digitação.",
    "group": "Preparo basal obrigatório"
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
    "hint": "Todos os dados se referem à mesma criança, episódio e avaliação basal. A confirmação manual não verifica identidade, datas ou prontuário.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "professionalAdjudicationConfirmed",
    "label": "Rubricas e incertezas revisadas por profissional?",
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
    "hint": "Profissional apto conferiu contexto, rubricas, qualidade e incertezas. Uma confirmação não pode resolver uma lacuna literal conhecida.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "noMissingImputationConfirmed",
    "label": "Nenhuma ausência imputada como normal, negativa ou zero?",
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
    "hint": "Nenhum campo, WAZ ou preparo externo usa dado não medido/desconhecido/impossível de avaliar como normal, negativo ou zero. Ausência de manifestação foi realmente estabelecida.",
    "group": "Preparo basal obrigatório"
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
    "hint": "Valores realmente obtidos e válidos em suas unidades, com método e qualidade conferidos; não preencher por estimativa arbitrária ou arredondar para um ramo.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "spo2RoomAirConfirmed",
    "label": "SpO₂ basal real em ar ambiente confirmada?",
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
    "hint": "SpO₂ real da mesma avaliação basal medida em ar ambiente antes de suplementação. Oxigênio atual não exclui se esse registro verdadeiro prévio existe; nunca retirar suporte ou atrasar atendimento para obter o dado. Guarda local mais estrita que a coleta heterogênea original.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "wazWhoWeightForAgeConfirmed",
    "label": "WAZ peso-para-idade OMS preparado e conferido?",
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
    "hint": "WAZ é escore-z peso-para-idade preparado conforme padrão OMS pertinente à criança, não peso-para-estatura, IMC, MUAC ou diagnóstico de desnutrição convertido em valor.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "wazDemographicsConsistentConfirmed",
    "label": "Idade, sexo e peso do WAZ correspondem à avaliação basal?",
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
    "hint": "Idade, sexo registrado e peso usados no WAZ são os mesmos da avaliação basal. Este kernel não calcula WAZ nem verifica a matéria-prima.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "clinicalSignsAdjudicatedConfirmed",
    "label": "Sinais clínicos basais adjudicados?",
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
    "hint": "Tiragem inferior, inconsciência/consciência diminuída, convulsões e cianose adjudicadas na avaliação basal. Sem conversão automática de GCS/AVPU, sedação, epilepsia remota, simples diagnóstico ou achado incerto.",
    "group": "Preparo basal obrigatório"
  },
  {
    "id": "ageCompletedMonths",
    "label": "Idade basal (meses completos)",
    "type": "number",
    "min": 0,
    "max": 216,
    "step": 1,
    "noPoints": true,
    "hint": "Perfil de 2–59 meses completos; 2–5=2, 6–11=1 e 12–59=0 pontos. Inteiro, sem mês=30 dias, arredondamento ou idade atual substituída. Confirmação manual, sem calendário validado.",
    "group": "Dez dados basais conhecidos"
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
    "hint": "Usar a categoria documentada; não inferir por nome, aparência ou identidade de gênero. Outra/indeterminada não tem regra neste modelo.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "weightForAgeZ",
    "label": "WAZ · escore-z peso-para-idade OMS",
    "type": "number",
    "min": -10,
    "max": 10,
    "step": "any",
    "noPoints": true,
    "hint": "WAZ <−3=3; −3≤WAZ≤−2=2; >−2=0 pontos. −1 é valor conhecido legítimo, não marcador de ausência. Preparado externamente conforme OMS; não substituir por MUAC, IMC, peso-para-estatura ou rótulo nutricional. Até seis casas; −10..10 é limite técnico local, sem plausibilidade certificada.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "temperatureC",
    "label": "Temperatura basal (°C)",
    "type": "number",
    "min": 20,
    "max": 45,
    "step": "any",
    "noPoints": true,
    "hint": "<35,5=3; 35,5–37,9 inclusive=0; >38=0 pontos. Lacuna literal 37,9<T≤38 impede total, sem arredondamento. Não converter sítio/termômetro, Fahrenheit ou Kelvin automaticamente. Até seis casas; 20–45 é guarda técnica local.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "respiratoryRate",
    "label": "Frequência respiratória basal (respirações/min)",
    "type": "number",
    "min": 0,
    "max": 200,
    "step": 1,
    "noPoints": true,
    "hint": "Tabela 3: ≥70 aos 2–11 meses ou ≥60 aos 12–59 meses=1; demais FR positivas inteiras=0. Inclui exatamente 70/60, pois usa incremento ≥20 sobre 50/40; não mescla o >20 do texto dos métodos. FR zero impede total e preserva aviso basal. Sem arredondar/estimar; teto 200 é guarda local.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "lowerChestIndrawing",
    "label": "Tiragem inferior basal",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicada · 0 pontos"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Presença ou ausência deve ser efetivamente estabelecida. O peso zero não dispensa avaliar nem transforma ausência de registro em sinal ausente. Tiragem superior isolada não é conversão automática.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "decreasedConsciousness",
    "label": "Inconsciência OU consciência diminuída basal",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicada · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Preditor original inclui diminuição da consciência, não somente coma. Adjudicação profissional; não converter GCS/AVPU, sedação ou rótulo diagnóstico automaticamente. Confundimento não resolvido mantém desconhecido.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "convulsions",
    "label": "Convulsões na avaliação basal",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicada · 2 pontos"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Presença/ausência clinicamente adjudicada na avaliação basal. Não inventar janela universal em horas nem converter epilepsia remota ou evento incerto em presença/ausência.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "cyanosis",
    "label": "Cianose clínica basal",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicada · 2 pontos"
      },
      {
        "value": 0,
        "label": "Ausente, após avaliação · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Achado clínico adjudicado independentemente da SpO₂. Não inferir do oxímetro nem de registro ausente; a fonte não fecha algoritmo universal de subtipo neste conjunto.",
    "group": "Dez dados basais conhecidos"
  },
  {
    "id": "spo2Percent",
    "label": "SpO₂ basal real em ar ambiente (%)",
    "type": "number",
    "min": 0,
    "max": 100,
    "step": "any",
    "noPoints": true,
    "hint": "<90=2; 90–92 inclusive=0; 93–100=0 pontos. 92<SpO₂<93 é lacuna literal, sem total. Até seis casas e unidade %; não fração 0–1. Zero é valor matemático que exige conferência clínica extraordinária, nunca dado ausente. Não retirar O₂ para medir ou inferir hipóxia pelo suporte recebido.",
    "group": "Dez dados basais conhecidos"
  }
];
const bools=new Set([...CONFIRMATIONS,'lowerChestIndrawing','decreasedConsciousness','convulsions','cyanosis']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(prepareFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
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
function decimal(v){if(typeof v!=='number'&&typeof v!=='string')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const t=String(v);if(!/^-?(?:0|[1-9]\d*)(?:[.,]\d{1,6})?$/.test(t))return {ok:false};return {ok:true,value:Number(t.replace(',','.'))};}
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar o PREPARE. Perigo atual informado, independente da pontuação e dos achados basais históricos.';
const pt=n=>String(n).replace('.',',');
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',unresolved_source:'Lacuna literal não resolvida · sem total',incomplete:'Informação insuficiente'};
const findingNames={reported_baseline_spo2_below90:'SpO₂ <90%',reported_baseline_hypothermia:'temperatura <35,5 °C',reported_baseline_decreased_consciousness:'inconsciência/consciência diminuída',reported_baseline_convulsions:'convulsões',reported_baseline_cyanosis:'cianose',reported_zero_respiratory_rate:'FR zero'};
function historicalText(r){
 if(r.urgentReviewRecommended===true)return 'Revisão prioritária de achado basal informado: '+r.urgentFindings.map(s=>findingNames[s]).join('; ')+'. Preparo/qualidade podem estar incompletos ou recusados; não se certifica persistência atual. Verifique a situação clínica atual, sem aguardar o total diante de emergência.';
 if(r.urgentReviewRecommended===false)return 'Ausência dos seis gatilhos basais limitados pesquisados estabelecida nos dados informados, com preparo relevante confirmado. Isso não exclui outros perigos, deterioração ou urgência atual.';
 return 'Avaliação dos gatilhos basais limitada, incompleta ou não estabelecida; desconhecimento não equivale a ausência. Não é triagem clínica completa nem avaliação do estado atual.';
}
export function evaluatePrepareAdapter(raw){
 const {data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of prepareFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Segurança atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?decimal(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica na unidade declarada; até seis casas, sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'sem perigo após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluatePrepare(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','outside_profile','unresolved_source','missing'],status=complete?'scored':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],historical=historicalText(r),alerts=[...(danger?[urgent]:[]),...(r.urgentReviewRecommended===true?[historical]:[])],level=danger?'high':'neutral';
 const local='Recorte local literal, completo e sem imputação, sem validação/calibração próprias. Não pedir exames ou medidas apenas para calcular, retirar suporte ou retardar cuidado. Confirmações não validam calendário, identidade, prontuário, WAZ ou plausibilidade clínica. Não há diagnóstico, probabilidade individual, decisão automática de tratamento, suporte ou alta.';
 if(!complete){const reason=[statusLabels[finalStatus]+': nenhum total, componente ou indicador de limiar emitido.',...all.map(i=>(prepareFields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,totalComplete:false,total:null,components:null,atLeast5:null,respiratoryReference:null,interpretation:null,issues:all,errors,alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:statusLabels[finalStatus],reason,action:reason,audit:'PREPARE mortalidade hospitalar por pneumonia 2022, Tabela 3 com SpO₂. Dez dados basais e dez confirmações obrigatórios; ausência, recusa ou lacuna literal impede soma. '+historical+' '+local,breakdown:[]};}
 const names={age:'Idade basal',sex:'Categoria de sexo',weightForAge:'WAZ',temperature:'Temperatura',respiratoryRate:'Frequência respiratória',lowerChestIndrawing:'Tiragem inferior',consciousness:'Consciência diminuída/inconsciência',convulsions:'Convulsões',cyanosis:'Cianose',oxygenation:'SpO₂ em ar ambiente'};
 const known=v=>v?'presente, adjudicada':'ausente, após avaliação';
 const audit=`PREPARE mortalidade hospitalar por pneumonia 2022, Tabela 3 com SpO₂, perfil ${PROFILE}. Mesma avaliação basal de criança hospitalizada por suspeita/pneumonia clínica no contexto WHO 2013, clinicamente adjudicada; desfecho: mortalidade durante aquela hospitalização, não após alta. Idade ${input.ageCompletedMonths} meses completos, sexo registrado ${input.sex==='female'?'feminino':'masculino'}, WAZ ${pt(input.weightForAgeZ)} peso-para-idade OMS preparado externamente com idade/sexo/peso basais conferidos. WAZ −1 é valor conhecido legítimo. Temperatura ${pt(input.temperatureC)} °C; FR ${input.respiratoryRate}/min; SpO₂ basal ${pt(input.spo2Percent)}% real em ar ambiente. Suporte atual pode ter sido iniciado depois desse registro; nunca retirar suporte para medir. Tiragem inferior ${known(input.lowerChestIndrawing)}; inconsciência OU consciência diminuída ${known(input.decreasedConsciousness)}; convulsões ${input.convulsions?'presentes, adjudicadas':'ausentes, após avaliação'}; cianose clínica ${known(input.cyanosis)}. Dez confirmações de contexto, mesmo episódio/momento, fontes/qualidade, preparo WAZ e adjudicação profissional estabelecidas. Nenhum dado não medido/desconhecido/impossível de avaliar imputado como normal, negativo ou zero, inclusive externamente. Soma das dez parcelas: ${Object.entries(r.components).map(([k,n])=>names[k]+' '+n).join(' + ')} = ${r.total}/17 pontos. Tiragem inferior é conhecida e obrigatória mesmo com coeficiente zero. FR usa Tabela 3: incremento ≥20 sobre referência ${r.respiratoryReference}/min, portanto limiar ${r.respiratoryReference+20}/min inclusivo; não mistura o >20 dos métodos. Limiar histórico ≥5: ${r.atLeast5?'atingido':'não atingido'}; referência avaliada em coorte, sem faixa universal de segurança e sem excluir morte ou deterioração quando <5. ${historical} Segurança atual: ${safety}. ${local} WAZ −10..10, temperatura 20..45, FR inteira 1..200, precisão de seis casas e SpO₂ basal em ar ambiente são guardas locais, não calibração nova. 37,9<T≤38 °C e 92<SpO₂<93% permanecem lacunas sem total; sem arredondar. WHO 2023 omitiu temperatura/tiragem (0–14), não valida integralmente esta ficha 0–17; evidência externa queniana parcialmente acessível não certifica equivalência de cada entrada. Não há troca automática por modelo sem SpO₂, de hipoxemia ou RISC-Malawi, nem comparação seriada/delta implementados. Referência operacional obtida por extração textual prévia; não houve conferência visual de PDF. Texto factual e código próprios; fonte Rees 2022 declara CC BY-NC 4.0, sem redistribuição do artigo/formulário ou alegação de tradução validada.`;
 return {...r,displayValue:String(r.total),errors:[],issues:[],alerts,level,currentDanger:danger?true:safety==='sem perigo após avaliação atual'?false:null,label:'Pontuação basal · referência histórica ≥5',reason:null,action:`Limiar histórico ≥5: ${r.atLeast5?'atingido':'não atingido'}. Desfecho de referência: mortalidade naquela hospitalização. Abaixo de 5 não exclui morte ou deterioração. `+local,audit,breakdown:Object.entries(r.components).map(([key,n])=>({label:names[key],points:n,detail:n+' pontos'}))};
}
export const prepareScore={...{
  "id": "prepare-pneumonia-mortality-2022",
  "name": "PREPARE · mortalidade hospitalar por pneumonia",
  "subtitle": "2022 · Tabela 3 com SpO₂ · dez dados basais completos",
  "specialty": "Pediatria",
  "specialties": [
    "Pediatria",
    "Pneumologia",
    "Terapia Intensiva"
  ],
  "aliases": [
    "PREPARE",
    "pneumonia pediátrica",
    "WAZ",
    "peso para idade"
  ],
  "population": "Pneumonia clínica/suspeita hospitalizada · 2–59 meses completos na avaliação basal",
  "range": "0–17 pontos",
  "min": 0,
  "max": 17,
  "resultScale": false,
  "unit": "pontos",
  "reviewDate": "11/10/2026",
  "scope": "Prognóstico descritivo de mortalidade durante a hospitalização por pneumonia pediátrica. Perfil literal da Tabela 3 de Rees 2022 com SpO₂, derivado de 27.388 crianças/856 mortes em 11 estudos de 20 países de renda baixa/média. Dez entradas basais conhecidas, incluindo tiragem de peso zero. Recorte local de dados completos reais sem imputação, ar ambiente e ramos inequívocos; não foi recalibrado ou validado separadamente. Não é diagnóstico, etiologia, risco pós-alta ou avaliação ambulatorial. Momento e vínculo são manualmente confirmados, sem calendário automático.",
  "formula": "Somar dez parcelas da Tabela 3: idade 2–5 meses=2,6–11=1,12–59=0; sexo feminino=1,masculino=0; WAZ <−3=3,−3≤WAZ≤−2=2,>−2=0; temperatura °C <35,5=3,35,5–37,9 inclusive=0,>38=0; FR ≥70 aos 2–11 meses ou ≥60 aos 12–59=1, demais FR positivas inteiras=0; tiragem inferior conhecida presente/ausente=0; inconsciência OU consciência diminuída presente=1; convulsões=2; cianose clínica=2; SpO₂ <90%=2,90–92 inclusive=0,93–100=0. Ausências dos sinais pontuam zero somente se realmente estabelecidas. Total0–17. 37,9<T≤38 °C e 92<SpO₂<93% não têm ramo literal: sem total. WAZ−1 é válido e não é sentinel. FR usa ≥20 acima das referências50/40 da Tabela3, não >20 do método. Limiar≥5 é referência histórica de coorte, sem probabilidade ou conduta automática.",
  "limits": "Nunca imputar desconhecido, não medido ou não avaliável como normal/zero, inclusive em WAZ externo. Tiragem de coeficiente zero continua obrigatória. Não converter GCS/AVPU, sedação, epilepsia remota, cianose ou diagnósticos em sinais ausentes/presentes automaticamente; não inventar janela de horas para convulsões. SpO₂ basal verdadeira em ar ambiente é guarda local; medida pertinente anterior pode existir com O₂ atual, mas não retirar suporte ou atrasar atendimento para obter dado. WAZ peso-para-idade OMS, não MUAC/IMC/peso-estatura, calculado externamente com idade/sexo/peso conferidos. Até seis casas, idade/FR inteiras, tetos técnicos locais; não arredondar para preencher lacunas. FRzero impede total e mantém aviso basal. Valor numérico aceito não certifica plausibilidade clínica. Gatilhos basais não atestam persistência atual ou ausência de outros perigos; emergência atual tem guarda separada. Limiar<5 não garante sobrevivência/segurança ou autoriza alta. Sem probabilidade individual, diagnóstico, prescrição, retirada de suporte, comparação/delta ou troca automática de versão. WHO2023 omitiu temperatura/tiragem (0–14); sua validação não é equivalência integral desta ficha. Evidência queniana2025/2026 parcialmente acessível e restrita a2–24meses não certifica cada detalhe. Não implementados modelos sem oximetria ou PREPARE hipoxemia2025. Redação factual própria, sem tradução validada ou endosso.",
  "sources": [
    {
      "title": "Rees et al. 2022 · Tabela 3 com SpO₂; referência operacional",
      "url": "https://doi.org/10.1136/bmjgh-2021-008143"
    },
    {
      "title": "Awasthi et al. 2023 · validação com temperatura/tiragem omitidas, contexto apenas",
      "url": "https://pubmed.ncbi.nlm.nih.gov/37008263/"
    },
    {
      "title": "Gordon et al. 2025/2026 · evidência externa parcialmente acessível",
      "url": "https://pubmed.ncbi.nlm.nih.gov/40692486/"
    },
    {
      "title": "OMS · padrão peso-para-idade, preparo externo WAZ",
      "url": "https://www.who.int/tools/child-growth-standards/standards/weight-for-age"
    }
  ],
  "reuse": {
    "attribution": "Síntese factual e código próprios, atribuídos a Rees et al. 2022. Fonte editorial declara CC BY-NC 4.0; não se redistribuem artigo, formulário ou imagem. Sem licença geral alegada de software externo, tradução validada ou endosso autoral. Divergências e limites de acesso documentados.",
    "license": "Fonte editorial Rees 2022: CC BY-NC 4.0; implementação factual própria",
    "url": "https://creativecommons.org/licenses/by-nc/4.0/"
  }
},fields:prepareFields,safeCalculate:evaluatePrepareAdapter,safeValidate:raw=>evaluatePrepareAdapter(raw).errors,assessPartial:raw=>{const r=evaluatePrepareAdapter(raw);return {level:r.level,alert:r.alerts.join(' ')||null};}};
export const prepareScores=[prepareScore];
