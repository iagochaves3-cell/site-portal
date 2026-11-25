/** Own factual adapter for full Oakland, operational BSG 2019 table. Frozen kernel unchanged. */
import {PROFILE,CONFIRMATIONS,INTERPRETATION_FIELDS,evaluateOakland} from './oakland-reference.mjs';
export {PROFILE};
export const oaklandFields=[
  {
    "id": "danger_signs",
    "label": "Há perigo atual ou piora que exige avaliação imediata?",
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
    "hint": "Guarda local independente da soma e dos dados iniciais. Uma declaração de instabilidade atual no contexto também mantém alerta, mesmo que este campo seja Não/desconhecido. Não aguardar escore para cuidar.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Perfil de cálculo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "oakland-complete-bsg2019-literal-v1",
        "label": "Oakland completo · tabela BSG 2019 · preparo literal"
      }
    ],
    "hint": "Sete parcelas, incluindo toque retal real. Não trocar por variante sem toque, Glasgow-Blatchford, Rockall ou AIMS65 quando faltar um dado.",
    "group": "Versão"
  },
  {
    "id": "acuteLowerGiBleedingConfirmed",
    "label": "HDB aguda clinicamente adjudicada?",
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
    "hint": "Apresentação hospitalar/emergência com sangue vivo/escuro ou coágulos por via retal compatíveis com hemorragia digestiva baixa aguda. Origem alta continua possível, sobretudo na instabilidade. Não exige endoscopia positiva e não presume hemorroida; anemia crônica ou sangue oculto isolados não bastam.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "initialAssessmentConfirmed",
    "label": "Conjunto da avaliação inicial confirmado?",
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
    "hint": "Primeiro conjunto da apresentação, não piores/melhores valores posteriores nem melhora seletiva após tratamento. A ficha não valida datas, calendário ou prontuário.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "samePatientEpisodeConfirmed",
    "label": "Mesma pessoa e episódio inicial confirmados?",
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
    "hint": "Sete domínios da mesma pessoa e episódio inicial, com fontes conhecidas. Não é preciso informar identificadores pessoais nesta ficha.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "professionalReviewConfirmed",
    "label": "Rubrica e fontes revisadas por profissional?",
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
    "hint": "Profissional apto revisou história, exame, rubricas e unidades. O índice não diagnostica origem ou etiologia.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "measurementsValidConfirmed",
    "label": "FC, PAS e Hb reais e utilizáveis?",
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
    "hint": "Frequência cardíaca, pressão sistólica e hemoglobina medidas; qualidade e unidades conferidas. Não estimar normalidade nem substituir Hb por hematócrito ou PAS por PAM/diastólica.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "rectalExamAssessedConfirmed",
    "label": "Toque retal realizado e resultado adjudicado?",
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
    "hint": "Toque retal realmente realizado/documentado nesta avaliação inicial, com presença/ausência de sangue estabelecida. Não substituir por relato, teste fecal ou exame não realizado. Não fazer procedimento exclusivamente para completar índice se inadequado.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "preTransfusionHemostasisValuesConfirmed",
    "label": "Valores iniciais anteriores à transfusão/hemostasia?",
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
    "hint": "Guarda local adicional: vitais e amostra de Hb iniciais antes de transfusão/hemostasia. Resultado liberado depois pode representar coleta inicial verdadeira. Não certifica uma regra do original 2017 integral não lido. Não atrasar ressuscitação ou pedir exame só para calcular.",
    "group": "Preparo obrigatório da soma"
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
    "hint": "Exige confirmação explícita de que nenhum dado não medido, desconhecido ou não avaliável foi convertido em normal/zero, inclusive por sistema externo. Ausência ou negativa impede soma.",
    "group": "Preparo obrigatório da soma"
  },
  {
    "id": "currentClinicalReviewConfirmed",
    "label": "Uso do limiar revisto na situação atual?",
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
    "hint": "Profissional reviu a situação atual e confirmou pertinência do limiar com esse conjunto inicial. Dados históricos sozinhos não certificam estabilidade atual. Campo contextual: vazio/desconhecido preserva uma soma completa, mas a interpretação fica indisponível. Não é uma confirmação por padrão.",
    "group": "Contexto atual do limiar · separado da soma"
  },
  {
    "id": "hemodynamicallyStable",
    "label": "Estabilidade hemodinâmica atual estabelecida?",
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
    "hint": "Sim significa estabilidade atual clinicamente adjudicada. Selecionar “Não” declara instabilidade atual e gera alerta independente; se não foi possível estabelecer, use Desconhecido. FC/PAS ou SI isolados não certificam estabilidade, inclusive sob beta-bloqueador. Campo contextual: vazio/desconhecido preserva uma soma completa, mas a interpretação fica indisponível. Não é uma confirmação por padrão.",
    "group": "Contexto atual do limiar · separado da soma"
  },
  {
    "id": "bleedingSelfLimited",
    "label": "Sangramento cessou / está autolimitado atualmente?",
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
    "hint": "Persistência ou dúvida não permitem interpretar o limiar favoravelmente. Esse campo não é inferido de ausência de sangue no toque. Campo contextual: vazio/desconhecido preserva uma soma completa, mas a interpretação fica indisponível. Não é uma confirmação por padrão.",
    "group": "Contexto atual do limiar · separado da soma"
  },
  {
    "id": "noOtherAdmissionIndication",
    "label": "Ausência de outro motivo de internação confirmada?",
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
    "hint": "Julgamento profissional sobre comorbidades, medicamentos, investigação e seguimento. Soma não verifica rede de apoio nem acesso ao acompanhamento. Campo contextual: vazio/desconhecido preserva uma soma completa, mas a interpretação fica indisponível. Não é uma confirmação por padrão.",
    "group": "Contexto atual do limiar · separado da soma"
  },
  {
    "id": "noAdverseOutcomeYet",
    "label": "Nenhum componente adverso do desfecho já ocorreu?",
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
    "hint": "Rever neste episódio transfusão, hemostasia endoscópica/radiológica/cirúrgica, ressangramento e demais componentes. Evento já ocorrido impede aplicar favoravelmente o limiar, sem apagar soma histórica inicial válida. Campo contextual: vazio/desconhecido preserva uma soma completa, mas a interpretação fica indisponível. Não é uma confirmação por padrão.",
    "group": "Contexto atual do limiar · separado da soma"
  },
  {
    "id": "ageCompletedYears",
    "label": "Idade inicial (anos completos)",
    "min": 0,
    "max": 130,
    "step": 1,
    "hint": "Inteiro; recorte local adulto ≥18. Não arredondar idade contínua nem converter dias por 365. Teto 130 é guarda técnica local. A coorte JAMA 2020 incluiu ≥16 anos, sem tornar essa faixa operacional aqui.",
    "type": "number",
    "noPoints": true,
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "heartRateBpm",
    "label": "Frequência cardíaca inicial (bpm)",
    "min": 1,
    "max": 300,
    "step": 1,
    "hint": "Inteiro registrado, sem arredondar 89,5 para 90. <70: 0; 70–89: 1; 90–109: 2; ≥110: 3 pontos. Teto 300 é local, não plausibilidade certificada.",
    "type": "number",
    "noPoints": true,
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "systolicBpMmHg",
    "label": "Pressão arterial sistólica inicial (mmHg)",
    "min": 1,
    "max": 300,
    "step": 1,
    "hint": "Inteiro da mesma avaliação da FC. <90: 5; 90–119: 4; 120–129: 3; 130–159: 2; ≥160: 0 pontos. Teto 300 é local. PAS<90 impede interpretar favoravelmente o limiar, mesmo com bradicardia.",
    "type": "number",
    "noPoints": true,
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "hemoglobinValue",
    "label": "Hemoglobina da amostra inicial",
    "min": 1e-06,
    "max": 300,
    "step": "any",
    "hint": "Informar unidade explicitamente. g/L inteiro 1–300, ou g/dL cuja conversão exata ×10 produza esse inteiro (até 30 g/dL). 8,9 g/dL=89 g/L; 7,05 g/dL=70,5 g/L não pertence ao recorte. Não arredondar, usar epsilon ou inferir unidade pela magnitude. Tetos e precisão são locais.",
    "type": "number",
    "noPoints": true,
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "hemoglobinUnit",
    "label": "Unidade da hemoglobina",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "g/L",
        "label": "g/L"
      },
      {
        "value": "g/dL",
        "label": "g/dL"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Unidade obrigatória e conversão decimal exata. Trocar a unidade reinterpreta o número digitado; confira e corrija ambos, sem conversão silenciosa do campo. Hb g/L: <70=22; 70–89=17; 90–109=13; 110–129=8; 130–159=4; ≥160=0.",
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "sex",
    "label": "Categoria de sexo registrada no modelo",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "female",
        "label": "Feminino · 0 pontos"
      },
      {
        "value": "male",
        "label": "Masculino · 1 ponto"
      },
      {
        "value": -1,
        "label": "Desconhecida / não estabelecida"
      }
    ],
    "hint": "Não inferir pelo nome, aparência ou outro campo.",
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "previousLgibAdmission",
    "label": "Internação hospitalar prévia por HDB",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Sim · 1 ponto"
      },
      {
        "value": 0,
        "label": "Não, história conhecida · 0 pontos"
      },
      {
        "value": -1,
        "label": "Desconhecida / história insuficiente"
      }
    ],
    "hint": "É internação prévia por hemorragia digestiva baixa, não qualquer episódio de sangue nas fezes. Ausência precisa de história confiável.",
    "group": "Sete parcelas iniciais · unidades explícitas"
  },
  {
    "id": "bloodOnRectalExam",
    "label": "Sangue no toque retal inicial",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente · 1 ponto"
      },
      {
        "value": 0,
        "label": "Ausente, exame realizado · 0 pontos"
      },
      {
        "value": -1,
        "label": "Não realizado / não estabelecido"
      }
    ],
    "hint": "Resultado do toque desta avaliação, não inferido de relato, teste fecal ou ausência de descrição. Variante sem toque não é equivalente ao Oakland completo.",
    "group": "Sete parcelas iniciais · unidades explícitas"
  }
];
const bools=new Set([...CONFIRMATIONS,...INTERPRETATION_FIELDS,'previousLgibAdmission','bloodOnRectalExam']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(oaklandFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
 if(raw===null||typeof raw!=='object')return {data,issues:[{field:'profile',kind:'invalid',reason:'Objeto de dados obrigatório.'}],safeDanger:false,safeInstability:false};
 try{const p=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(p!==Object.prototype&&p!==null))invalid('profile','Protótipo não admitido.');}catch{invalid('profile','Falha ao ler protótipo.');}
 // Independent, single own safety descriptor: may preserve an alert, never recover completeness.
 let safetyDescriptor,safetyReadFailed=false,stabilityDescriptor,stabilityReadFailed=false;
 try{stabilityDescriptor=Object.getOwnPropertyDescriptor(raw,'hemodynamicallyStable');}catch{stabilityReadFailed=true;invalid('hemodynamicallyStable','Falha ao ler descritor próprio do contexto atual.');}
 const safeInstability=!!(stabilityDescriptor&&Object.hasOwn(stabilityDescriptor,'value')&&(stabilityDescriptor.value===0||stabilityDescriptor.value==='0')&&!Object.is(stabilityDescriptor.value,-0));
 try{safetyDescriptor=Object.getOwnPropertyDescriptor(raw,'danger_signs');}catch{safetyReadFailed=true;invalid('danger_signs','Falha ao ler descritor próprio de segurança.');}
 const safeDanger=!!(safetyDescriptor&&Object.hasOwn(safetyDescriptor,'value')&&(safetyDescriptor.value===1||safetyDescriptor.value==='1'));
 let keys;try{keys=Reflect.ownKeys(raw);}catch{invalid('profile','Falha na primeira lista de chaves.');return {data,issues,safeDanger,safeInstability};}
 for(const k of keys){let d;if(k==='danger_signs'){if(safetyReadFailed)continue;d=safetyDescriptor;}else if(k==='hemodynamicallyStable'){if(stabilityReadFailed)continue;d=stabilityDescriptor;}else try{d=Object.getOwnPropertyDescriptor(raw,k);}catch{invalid(typeof k==='string'&&allowed.has(k)?k:'profile','Falha ao ler descritor.');continue;}
  if(typeof k!=='string'||!allowed.has(k)){invalid('profile','Campo não previsto.');continue;}if(!d||!Object.hasOwn(d,'value')){invalid(k,'Accessor recusado sem invocação.');continue;}data[k]=d.value;
 }
 return {data,issues,safeDanger,safeInstability};
}
function selection(v,f){if(typeof v!=='string'&&typeof v!=='number')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const o=f.options.find(o=>v===o.value||(typeof v==='string'&&v===String(o.value)));return o?{ok:true,value:o.value}:{ok:false};}
function decimal(v){if(typeof v!=='number'&&typeof v!=='string')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const t=String(v);if(!/^(?:0|[1-9]\d*)(?:[.,]\d{1,6})?$/.test(t))return {ok:false};return {ok:true,value:Number(t.replace(',','.'))};}
const currentAlert='Priorize avaliação e suporte clínico imediato; não aguarde completar o Oakland. Perigo atual declarado na guarda local.';
const instabilityAlert='Instabilidade hemodinâmica atual informada no contexto: requer avaliação imediata, mesmo que a guarda local de perigo tenha sido marcada Não ou desconhecida. Não aguarde o escore.';
const pt=n=>String(n).replace('.',',');
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',incomplete:'Informação insuficiente para soma'};
const historicalText=r=>{const h=r.urgentFindings.filter(x=>x!=='reported_hemodynamic_instability');if(h.length)return 'Revisão prioritária de achado inicial informado: '+h.map(x=>x==='reported_initial_sbp_below90'?'PAS <90 mmHg':'FC≥PAS (índice de choque inicial ≥1)').join(' e ')+'. Pode ser registro histórico com preparo incompleto; a persistência atual não foi certificada. Reavaliar a situação atual, sem aguardar o total diante de emergência.';return r.urgentReviewRecommended===false?'Ausência dos gatilhos limitados pesquisados estabelecida nos dados capturados e no preparo relevante. Não exclui outras urgências nem evolução posterior.':'Os gatilhos limitados não equivalem a triagem completa; dados não estabelecidos permanecem desconhecidos. Avaliar a situação atual.';};
function contextText(r){return r.interpretationAvailable?r.interpretation:'Interpretação do limiar ≤8 indisponível ('+({score_unavailable:'soma indisponível',unknown:'contexto desconhecido',unavailable:'contexto não satisfeito'}[r.thresholdContextStatus]||r.thresholdContextStatus)+'). Nenhuma mensagem favorável ou flag de limiar é emitida. '+r.contextIssues.map(i=>(oaklandFields.find(f=>f.id===i.field)?.label||i.field)+': '+i.reason).join(' ');}
export function evaluateOaklandAdapter(raw){
 const {data,issues,safeDanger,safeInstability}=capture(raw),input=Object.create(null);let danger=safeDanger,instability=safeInstability,safety='desconhecida / não avaliada';
 for(const f of oaklandFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Guarda local atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?decimal(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica na unidade declarada; sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'negativa de perigo na guarda local':'desconhecida / não avaliada';}else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluateOakland(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','outside_profile','missing'],status=complete?'scored':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))];
 const history=historicalText(r),alerts=[...(danger?[currentAlert]:[]),...(instability?[instabilityAlert]:[]),...(r.urgentFindings.some(x=>x!=='reported_hemodynamic_instability')?[history]:[])],level=danger||instability?'high':'neutral';
 const local='Tabela operacional BSG 2019; sete itens incluindo toque retal real, precisão e preparo locais, sem imputação. Subconjunto sem calibração própria. Não há probabilidade individual, decisão automática de alta, investigação ou tratamento. Não atrasar ressuscitação nem fazer exame/procedimento exclusivamente para completar índice. Calendário, identidade e prontuário não são certificados.';
 if(!complete){const reason=[statusLabels[finalStatus]+': sem soma, componentes ou interpretação.',...all.map(i=>(oaklandFields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,totalComplete:false,total:null,components:null,hemoglobinGL:null,interpretationAvailable:false,thresholdContextStatus:'score_unavailable',atOrBelow8:null,interpretation:null,issues:all,errors,alerts,level,declaredCurrentDanger:danger?true:safety==='negativa de perigo na guarda local'?false:null,currentInstability:instability?true:input.hemodynamicallyStable===true?false:null,label:statusLabels[finalStatus],reason,action:reason,audit:'Oakland completo BSG 2019: dados iniciais incompletos/recusados ou tipos inválidos impedem soma. '+history+' '+local,breakdown:[]};}
 const names={age:'Idade',sex:'Categoria de sexo',previousAdmission:'Internação prévia por HDB',rectalBlood:'Sangue no toque retal',heartRate:'FC inicial',systolicBp:'PAS inicial',hemoglobin:'Hb inicial'},context=contextText(r),label=r.interpretationAvailable?(r.atOrBelow8?'Soma completa · referência histórica ≤8':'Soma completa · acima da referência ≤8'):'Soma completa · interpretação indisponível';
 const contextRows=INTERPRETATION_FIELDS.map(k=>(oaklandFields.find(f=>f.id===k).label)+': '+(input[k]===true?'Sim':input[k]===false?'Não':'desconhecido / não informado')).join('; ');
 const audit=`Oakland completo, tabela operacional BSG 2019, perfil ${PROFILE}. Sete parcelas da apresentação inicial hospitalar/emergência com HDB aguda clinicamente adjudicada. Idade ${input.ageCompletedYears} anos completos; ≥18 é recorte local. Sexo registrado ${input.sex==='female'?'feminino':'masculino'}; internação prévia por HDB ${input.previousLgibAdmission?'presente':'ausente com história conhecida'}; sangue no toque retal inicial realmente realizado ${input.bloodOnRectalExam?'presente':'ausente'}. FC ${input.heartRateBpm} bpm e PAS ${input.systolicBpMmHg} mmHg iniciais, sem arredondar. Hb ${pt(input.hemoglobinValue)} ${input.hemoglobinUnit} = ${r.hemoglobinGL} g/L por conversão decimal exata ${input.hemoglobinUnit==='g/dL'?'×10':'(unidade original g/L)'}, sem epsilon ou arredondamento. Oito confirmações de preparo estabelecidas: mesmo episódio, fontes e qualidade revistas, toque realizado, valores iniciais pré-transfusão/hemostasia e nenhuma imputação de não medido/desconhecido/não avaliável como normal/zero, inclusive externa. Resultado de Hb liberado depois pode representar amostra inicial anterior; não é troca de valores após melhora. Soma: ${Object.entries(r.components).map(([k,n])=>names[k]+' '+n).join(' + ')} = ${r.total}/35 pontos. Complete/totalComplete representam somente a soma. Contexto atual: ${contextRows}. ${context} SI inicial é comparado exatamente por FC≥PAS, sem razão arredondada; SI=1 e PAS<90 vedam interpretação favorável por guardas locais. ${history} Guarda local de perigo atual: ${safety}; instabilidade atual informada tem prioridade sobre uma negativa local. Desfecho composto de pesquisa: ressangramento, transfusão, hemostasia, morte hospitalar e readmissão por HDB em 28 dias; soma não comprova ausência futura. Valores disponíveis não verificam apoio, seguimento ou acesso à investigação. ${local} Não se aplica limiar ≤10 por padrão. Validações 2020/2025 sem toque não equivalem a este perfil; cortes divergentes ACG 2023 não são misturados. Original 2017 lido em resumo, sem alegar auditoria integral/pixels. Não há comparação longitudinal implementada.`;
 return {...r,displayValue:String(r.total),errors:[],issues:[],alerts,level,declaredCurrentDanger:danger?true:safety==='negativa de perigo na guarda local'?false:null,currentInstability:instability?true:input.hemodynamicallyStable===true?false:null,label,reason:null,action:context+' '+local,audit,breakdown:Object.entries(r.components).map(([key,n])=>({label:names[key],points:n,detail:n+' pontos'}))};
}
export const oaklandScore={...{
  "id": "oakland-complete-bsg2019",
  "name": "Oakland completo · hemorragia digestiva baixa",
  "subtitle": "BSG 2019 · sete parcelas · soma e contexto separados",
  "specialty": "Gastroenterologia",
  "specialties": [
    "Gastroenterologia",
    "Clínica médica"
  ],
  "aliases": [
    "Oakland",
    "Oakland Score",
    "hemorragia digestiva baixa",
    "HDB",
    "hematochezia"
  ],
  "population": "Adultos ≥18 anos completos · HDB aguda na apresentação hospitalar/emergência",
  "range": "0–35 pontos",
  "min": 0,
  "max": 35,
  "resultScale": false,
  "unit": "pontos",
  "reviewDate": "11/10/2026",
  "scope": "Soma prognóstica descritiva de sete domínios iniciais, incluindo toque retal, e referência histórica do limiar ≤8 em HDB aguda clinicamente adjudicada. Autoridade operacional: tabela BSG 2019, cotejada textualmente com JAMA 2020; original Oakland 2017 consultado em resumo, não íntegra/pixels auditados. Recorte local adulto ≥18, precisão inteira e dados completos reais sem imputação, sem calibração própria. Soma completa não significa interpretação contextual disponível nem aptidão para alta. Origem alta continua possível e requer avaliação clínica, sobretudo se instável. Não exige endoscopia positiva e não presume hemorroida.",
  "formula": "Somar sete parcelas BSG 2019: idade 18–39=0,40–69=1,≥70=2; sexo feminino=0/masculino=1; internação prévia por HDB ausente=0/presente=1; sangue no toque retal realizado ausente=0/presente=1; FC bpm <70=0,70–89=1,90–109=2,≥110=3; PAS mmHg <90=5,90–119=4,120–129=3,130–159=2,≥160=0; Hb g/L <70=22,70–89=17,90–109=13,110–129=8,130–159=4,≥160=0. Total 0–35. Hb g/dL×10 exato deve produzir g/L inteiro; 7,05 g/dL→70,5 g/L é recusado, sem arredondar. Idade/FC/PAS inteiras. Interpretação ≤8 somente se cinco contextos atuais verdadeiros, FC<PAS e PAS≥90; igualdade SI=1 é guarda local conservadora. Os operadores BSG≥ não são substituídos por cortes> da tabela ACG 2023. Nenhuma regressão ou probabilidade exportada.",
  "limits": "Nenhum dado ausente, não medido ou não avaliável vira normal/zero. Toque retal desconhecido não é negativo e não ativa versão sem toque. Oito confirmações obrigatórias à soma; cinco contextos atuais vazios/desconhecidos/negativos deixam interpretação/flag≤8 nulas mesmo com total 0. Tipo inválido de contexto invalida todo payload. PAS<90, SI≥1, instabilidade, sangramento persistente, outro motivo de internação ou desfecho adverso já ocorrido vedam interpretação favorável. Soma inicial histórica válida pode permanecer descritiva após transfusão/hemostasia; não usar melhora seletiva como dados iniciais. Preparação pré-transfusão/hemostasia é guarda local; coleta e liberação de Hb são momentos diferentes. Não atrasar ressuscitação, realizar toque inadequado ou solicitar exames só pelo índice. Adultos ≥18 e tetos 130 anos/FC 300/PAS 300/Hb 300 g/L são locais, não limites universais/plausibilidade certificada. Sem probabilidade individual, alta/prescrição/investigação automáticas ou garantia contra evento futuro. Desfecho composto inclui ressangramento, transfusão, hemostasia, morte hospitalar e readmissão em 28 dias, sem predizer isoladamente cada evento. Rede de apoio/seguimento dependem de avaliação externa. Validações 2020/2025 sem DRE não equivalem a este perfil; estudo 2026 consultado em resumo não valida automaticamente este subconjunto. Não misturar ACG 2023 ou adotar ≤10 por padrão. Síntese factual/código próprios; sem formulário/imagem/PDF externo, tradução validada ou endosso.",
  "sources": [
    {
      "title": "BSG 2019 · autoridade operacional, tabela 1 e contexto do limiar",
      "url": "https://www.bsg.org.uk/getattachment/6d80aa64-9d11-4923-8789-a2e9b08502ef/gutjnl-2018-317807.pdf%3Flang%3Den-US"
    },
    {
      "title": "Oakland et al. 2017 · identidade e desfecho, resumo primário",
      "url": "https://pubmed.ncbi.nlm.nih.gov/28651935/"
    },
    {
      "title": "Oakland et al. 2020 · cotejo textual dos pesos; validação sem toque não equivalente",
      "url": "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2767946"
    },
    {
      "title": "DiLena et al. 2025 · validação em emergência sem toque, contexto apenas",
      "url": "https://link.springer.com/article/10.1186/s12245-025-00815-5"
    }
  ],
  "reuse": {
    "attribution": "Redação factual e código próprios, atribuídos a Oakland e à BSG 2019. Sem reprodução de formulário, PDF ou arte editorial. JAMA 2020 declara CC BY; isso não certifica direitos de toda fonte ou software externo. Não localizada restrição proprietária específica do método nas fontes examinadas; sem alegação de endosso ou tradução validada."
  }
},fields:oaklandFields,safeCalculate:evaluateOaklandAdapter,safeValidate:raw=>evaluateOaklandAdapter(raw).errors,assessPartial:raw=>{const r=evaluateOaklandAdapter(raw);return {level:r.level,alert:r.alerts.join(' ')||null};}};
export const oaklandScores=[oaklandScore];
