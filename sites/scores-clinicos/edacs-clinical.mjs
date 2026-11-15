/** Own factual EDACS clinical adapter; frozen 2014/2016 reference unchanged. */
import {PROFILE,CONFIRMATIONS,RISK_FACTORS,SYMPTOMS,RED_FLAGS,evaluateEdacsClinical} from './edacs-clinical-reference.mjs';
export {PROFILE};
export const edacsFields=[
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
    "hint": "Guarda local atual, independente da soma e dos alertas da apresentação. Não aguarde completar o escore diante de emergência. Registro histórico não certifica persistência atual.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Perfil do componente clínico",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "edacs-clinical-2014-2016-manual-v1",
        "label": "EDACS clínico · pesos 2014 / explicitação 2016"
      }
    ],
    "hint": "Somente soma clínica com rubricas citadas de 2010. ECG, troponinas e EDACS-ADP não são executados; nenhuma variante automática.",
    "group": "Identidade e população"
  },
  {
    "id": "ageYearsCompleted",
    "label": "Idade na avaliação inicial (anos completos)",
    "type": "number",
    "min": 0,
    "max": 120,
    "step": 1,
    "noPoints": true,
    "hint": "Adultos a partir do 18º aniversário. Idade inteira conhecida, sem arredondar ou inferir calendário. Teto técnico 120 é local, não limite autoral universal. História pontua somente aos 18–50 anos inclusive.",
    "group": "Identidade e população"
  },
  {
    "id": "emergencyDepartmentAssessmentConfirmed",
    "label": "Avaliação profissional em pronto atendimento?",
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
    "hint": "Avaliação em pronto atendimento, por profissional apto; não autotriagem domiciliar.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "possibleCardiacSymptomsConfirmed",
    "label": "Possível causa coronariana com investigação médica pretendida?",
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
    "hint": "Apresentação com sintomas agudos compatíveis com possível causa coronariana, para a qual o médico pretende investigação adicional, conforme elegibilidade original. Não basta dor inespecífica sem esse contexto, e o índice não faz diagnóstico.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "symptomsAtLeastFiveMinutesConfirmed",
    "label": "Episódio sintomático com duração de pelo menos 5 minutos?",
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
    "hint": "Episódio sintomático com duração de pelo menos 5 minutos, segundo elegibilidade 2014; duração não é intervalo de coleta de troponina.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "initialPresentationAssessmentConfirmed",
    "label": "Dados da apresentação inicial do episódio?",
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
    "hint": "História/exame do episódio que motivou a apresentação inicial; não substituir por dor ou achados de outro episódio.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "sameEpisodeConfirmed",
    "label": "Mesma pessoa, avaliação e episódio confirmados?",
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
    "hint": "Idade, sintomas e história aplicável pertencem à mesma avaliação identificada externamente.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "professionalRubricReviewConfirmed",
    "label": "Rubricas deste perfil revisadas por profissional?",
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
    "hint": "Rubricas deste perfil foram aplicadas por profissional, incluindo CAD/família/tabagismo e dor reproduzida; não confirma leitura do S2 negado.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "patientReportReliableConfirmed",
    "label": "Relato efetivamente usado está suficientemente estabelecido?",
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
    "hint": "Os dados reportados efetivamente usados para determinar as parcelas estão suficientemente estabelecidos. Desconhecidos não decisivos podem permanecer desconhecidos, sem exigir confiabilidade fictícia. Fonte 2014 usou relato sem prontuário; eventual divergência com registro exige revisão, não negação automática.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "noMissingImputationConfirmed",
    "label": "Nenhum dado ausente imputado como normal, Não ou zero?",
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
    "hint": "Nenhum ausente, incerto, não examinado ou não conhecido foi preenchido como normal, não ou zero, inclusive por fonte/cálculo externo.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "maleSex",
    "label": "Sexo masculino, conforme preditor original",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Preditor sexo masculino conforme registro clínico aplicável ao escore original. Não inferir de nome, aparência ou identidade de gênero; codificação não estabelecida permanece desconhecida.",
    "group": "Parcela de sexo"
  },
  {
    "id": "knownCoronaryDisease",
    "label": "Antecedente de doença coronariana qualificável",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Antecedente anterior ao episódio de IAM, cirurgia de revascularização miocárdica ou intervenção coronária percutânea. Angina isolada, cálcio coronário ou suspeita de IAM atual não bastam para esse item. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "prematureFamilyHistory",
    "label": "História familiar prematura qualificável",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Relato qualificável de angina, IAM ou morte cardíaca súbita sem causa evidente em pai/mãe, irmão/irmã ou filho/filha, ocorrido antes dos 55 anos. Mesmo corte para familiar masculino/feminino neste perfil; idade 55 exata não atende. Parentesco, evento ou idade desconhecidos deixam o fator desconhecido. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "dyslipidaemia",
    "label": "História reportada de dislipidemia",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "História reportada de dislipidemia/colesterol elevado, estabelecida segundo entrevista profissional. Não diagnosticar por exame isolado, inventar limiar lipídico ou trocar tratamento em curso por ausência de história. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "diabetes",
    "label": "História reportada de diabetes",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "História reportada de diabetes. Controle atual, dieta ou glicemia normal não apagam história; hiperglicemia transitória isolada não a estabelece automaticamente. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "hypertension",
    "label": "História reportada de hipertensão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "História reportada de hipertensão. Pressão normal sob tratamento não a nega, e pressão elevada isolada na chegada não a cria automaticamente. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "currentSmoking",
    "label": "Uso de cigarros no mês anterior à admissão",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Uso de cigarros no mês anterior à admissão segundo a rubrica citada 2010. Não ampliar silenciosamente para 90 dias, qualquer uso vitalício ou vaporizador. Sem mês convertido em 30 dias; data limítrofe de cessação/exposição cuja categoria não possa ser estabelecida permanece desconhecida. Após 50 anos, esta história não contribui para a soma; o dado continua presente/ausente/desconhecido como registrado. Antes disso, via lógica suficiente pode fixar a parcela sem inventar os demais.",
    "group": "História condicional (18–50 anos)"
  },
  {
    "id": "diaphoresis",
    "label": "Diaforese associada ao episódio",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Sudorese aumentada em associação ao episódio de dor/desconforto que motivou a apresentação. Não atribuir por sintoma isolado de outra ocasião.",
    "group": "Sintomas do episódio"
  },
  {
    "id": "armOrShoulderRadiation",
    "label": "Irradiação para braço ou ombro",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Irradiação da dor/desconforto para braço ou ombro, relativa ao episódio de apresentação. Pescoço/mandíbula isolados não recebem esses 5 pontos, embora possam ser sintomas de SCA.",
    "group": "Sintomas do episódio"
  },
  {
    "id": "inspiratoryPain",
    "label": "Dor surge ou piora com inspiração",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "A dor do episódio surge ou piora com inspiração. Dispneia ou dor não relacionada não equivalem automaticamente.",
    "group": "Sintomas do episódio"
  },
  {
    "id": "palpationReproducesPain",
    "label": "Palpação reproduz a dor original",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Palpação do tórax reproduz a dor/desconforto original, com o mesmo caráter; sensibilidade incidental distinta não satisfaz. Exame não realizado não é resultado negativo.",
    "group": "Sintomas do episódio"
  },
  {
    "id": "abnormalVitalSigns",
    "label": "Sinais vitais anormais na apresentação",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Opcional para a soma, sem pontos. Achado informado do episódio inicial, não declaração de situação atual. Positivo mantém aviso de avaliação profissional; ausência não é segurança clínica global.",
    "group": "Alertas da apresentação (sem pontos)"
  },
  {
    "id": "ongoingPain",
    "label": "Dor persistente na apresentação",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Opcional para a soma, sem pontos. Achado informado do episódio inicial, não declaração de situação atual. Positivo mantém aviso de avaliação profissional; ausência não é segurança clínica global.",
    "group": "Alertas da apresentação (sem pontos)"
  },
  {
    "id": "crescendoPain",
    "label": "Dor crescente na apresentação",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, estabelecido"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliado"
      }
    ],
    "hint": "Opcional para a soma, sem pontos. Achado informado do episódio inicial, não declaração de situação atual. Positivo mantém aviso de avaliação profissional; ausência não é segurança clínica global.",
    "group": "Alertas da apresentação (sem pontos)"
  },
  {
    "id": "redFlagAssessmentValidConfirmed",
    "label": "Os três alertas da apresentação foram avaliados de forma válida?",
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
    "hint": "Opcional para a soma. Sim só confirma a qualidade dessa avaliação. Não/desconhecido/vazio impede afirmar ausência conjunta; positivo estabelecido continua visível. Nenhuma dessas respostas substitui a guarda atual.",
    "group": "Alertas da apresentação (sem pontos)"
  }
];
const bools=new Set([...CONFIRMATIONS,...RISK_FACTORS,...SYMPTOMS,...RED_FLAGS,'maleSex','knownCoronaryDisease','redFlagAssessmentValidConfirmed']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(edacsFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
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
function integer(v){if(typeof v!=='number'&&typeof v!=='string')return{ok:false};if(typeof v==='number'&&(!Number.isInteger(v)||Object.is(v,-0)))return{ok:false};if(!/^(?:0|[1-9]\d*)$/.test(String(v)))return{ok:false};return{ok:true,value:Number(v)};}
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar EDACS. Perigo atual declarado é independente da soma e dos achados da apresentação.';
const local='EDACS clínico: pesos finais 2014, explicitação autoral 2016 e rubricas citadas 2010. Política local sem imputação é mais estrita que a convenção histórica incerto=Não e não tem validação/calibração própria. Não é EDACS-ADP. ECG/troponinas, baixo risco, exclusão de SCA, probabilidade individual, alta ou tratamento automático não são determinados. Não pedir exames desnecessários nem atrasar avaliação/cuidado para completar a soma.';
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',incomplete:'Soma clínica incompleta'};
const named=id=>edacsFields.find(f=>f.id===id)?.label??id;
function historyAlert(r){if(r.reportedRedFlagPresent===true)return 'Alerta informado da apresentação requer avaliação profissional prioritária: '+r.reportedRedFlags.map(named).join('; ')+'. O registro pode ser anterior ou ter qualidade não confirmada; não certifica persistência atual. A soma, inclusive negativa, não neutraliza esse achado.';if(r.reportedRedFlagPresent===false)return 'Ausência dos três alertas da apresentação estabelecida nos dados/preparo pertinentes. Isso não demonstra ausência de outras urgências nem segurança clínica atual.';return 'Presença/ausência conjunta dos três alertas da apresentação não estabelecida; desconhecido não equivale a ausência de perigo.';}
const historyReasons={known_coronary_disease:'Antecedente coronariano qualificável estabelece +4 uma única vez, sem precisar imputar os fatores desconhecidos.',at_least_three_established_risk_factors:'Pelo menos três fatores positivos estabelecidos fixam +4 uma única vez, sem precisar inventar o antecedente coronariano ou fatores restantes.',fewer_than_three_even_if_unknown_factors_positive:'Antecedente coronariano negativo estabelecido e máximo possível de fatores abaixo de três fixam 0; os fatores desconhecidos continuam desconhecidos.',structurally_not_applicable_over_50:'Após 50 anos, a contribuição CAD/fatores é estruturalmente não aplicável e vale 0; isso não nega a história clínica.'};
export function evaluateEdacsAdapter(raw){
 const{data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of edacsFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Guarda atual não informada.'});else input[f.id]=null;continue;}const q=f.type==='number'?integer(v):selection(v,f);if(!q.ok){issues.push({field:f.id,kind:'invalid',reason:'Idade inteira e seletores canônicos obrigatórios, sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]='__invalid_adapter_value__';continue;}if(f.id==='danger_signs'){danger=q.value===1;safety=q.value===1?'perigo atual informado':q.value===0?'negativa após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=q.value===-1?null:bools.has(f.id)?q.value===1:q.value;}
 const original=evaluateEdacsClinical(input),bad=issues.some(i=>i.kind==='invalid'),r=bad?{...original,reportedRedFlagAssessmentComplete:false,reportedRedFlagPresent:original.reportedRedFlagPresent===true?true:null,urgentReviewRecommended:original.reportedRedFlagPresent===true?true:null}:original;
 const all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,status=complete?'scored':all.some(i=>i.kind==='invalid')?'invalid':all.some(i=>i.kind==='outside_profile')?'outside_profile':'incomplete',errors=[...new Set(all.map(i=>i.field))],historical=historyAlert(r),alerts=[...(danger?[urgent]:[]),...(r.reportedRedFlagPresent===true?[historical]:[])],level=danger?'high':'neutral';
 if(!complete){const reason=[statusLabels[status]+': nenhum total válido emitido.',...all.map(i=>named(i.field)+': '+i.reason),...alerts].join(' ');return{...r,status,complete:false,scoreComplete:false,total:null,scoreThreshold:null,findingsComplete:false,applicableScoreFindingsComplete:false,interpretation:null,issues:all,errors,alerts,level,currentDanger:danger?true:safety==='negativa após avaliação atual'?false:null,label:statusLabels[status],reason,action:reason,audit:'EDACS clínico sem soma válida. Parcelas eventualmente conhecidas não autorizam total parcial. '+historical+' '+local,breakdown:[]};}
 const unknown=r.unknownHistoryFields.map(named),history=historyReasons[r.historyResolution],bounds=`Fatores positivos possíveis: ${r.riskFactorCountBounds.minimum}–${r.riskFactorCountBounds.maximum} de 5.`,known=`História: ${6-r.unknownHistoryFields.length}/6 campos conhecidos. `+(unknown.length?'Ainda desconhecidos: '+unknown.join('; ')+'.':'Todos os seis campos históricos foram estabelecidos.'),threshold=r.total<16?'Total <16: apenas condição numérica histórica; não estabelece baixo risco.':'Total ≥16: não atende à condição numérica <16; não define conduta automática.',describe=k=>input[k]===null?'Desconhecido / não avaliado':input[k]?'Presente, estabelecido':'Ausente, efetivamente estabelecido';
 const audit=`EDACS clínico, pesos finais 2014 / explicitação autoral 2016, rubricas citadas de Cullen 2010. Perfil ${PROFILE}. Idade ${input.ageYearsCompleted} anos completos na avaliação inicial do episódio, oito confirmações profissionais estabelecidas: contexto de emergência/possível causa coronariana com investigação pretendida, sintomas ≥5 minutos, mesma apresentação, rubricas e relato usados revisados, nenhuma ausência imputada como normal/Não/zero inclusive no preparo externo. Sintoma do episódio não é apagado porque cessou. Total clínico ${r.total}, soma das sete parcelas, sem clamp de negativos. ${threshold} ${history} ${bounds} ${known} História registrada: ${['knownCoronaryDisease',...RISK_FACTORS].map(k=>named(k)+': '+describe(k)).join('; ')}. Soma completa não equivale a história/exame global completo: scoreComplete=${r.scoreComplete}; applicableScoreFindingsComplete=${r.applicableScoreFindingsComplete}; allHistoryFieldsKnown=${r.allHistoryFieldsKnown}. Na faixa 18–50 inclusive, CAD (IAM/CABG/PCI anterior) OU ≥3 dos cinco fatores adiciona 4 uma única vez; após 50 a parcela é NA, sem negar dados. Família: evento qualificável em parente direto antes de 55 anos, mesmo limite para homem/mulher; tabagismo é cigarro no mês anterior, sem mês=30 dias ou ampliação para vaporizador. Dor inspiratória (−4) pode coexistir com reprodução da dor original à palpação (−6); sensibilidade incidental não basta. ${historical} Alias urgentReviewRecommended descreve somente os três alertas históricos, escopo reported_presentation_red_flags_only, nunca urgência global. Segurança atual declarada: ${safety}. ${local} S1/S2 suplementares de 2014 negados e não lidos por outra rota; ADP 2016 é publicação distinta e fica documental. Dicionário 2010 tem erratum sinalizado cujo conteúdo não foi localizado; não se alega edição corrigida. Derivação e validação temporal nos mesmos dois hospitais Austrália/Nova Zelândia não garantem transposição universal; coortes externas são heterogêneas. Fonte 2014 sem licença geral aberta identificada; artigo 2016 CC BY-NC-ND 4.0, sem reprodução/adaptação do artigo ou formulário. Redação factual/código próprios, sem tradução validada ou endosso. Sem cálculo de calendário, comparação ou inferência de identidade.`;
 const labels={age:'Idade',maleSex:'Sexo masculino',conditionalHistory:'História condicional CAD/fatores',diaphoresis:'Diaforese',armOrShoulderRadiation:'Irradiação braço/ombro',inspiratoryPain:'Dor inspiratória',palpationReproducesPain:'Dor original reproduzida à palpação'};
 return{...r,displayValue:String(r.total),errors:[],issues:[],alerts,level,currentDanger:danger?true:safety==='negativa após avaliação atual'?false:null,label:'Soma clínica completa · sem classificação ADP',reason:null,action:threshold+' '+history+' '+bounds+' '+known+' '+local,audit,breakdown:Object.entries(r.components).map(([k,points])=>({label:labels[k],points,detail:String(points)+' pontos'+(k==='conditionalHistory'?' · '+history+' '+bounds:'' )}))};
}
export const edacsScore={...{
  "id": "edacs-clinical-2014",
  "name": "EDACS clínico · pesos 2014 / explicitação 2016",
  "subtitle": "Dor torácica no adulto · componente clínico, sem protocolo ADP",
  "specialty": "Cardiologia",
  "specialties": [
    "Cardiologia",
    "Emergência"
  ],
  "aliases": [
    "EDACS clínico",
    "Emergency Department Assessment of Chest pain Score",
    "dor torácica",
    "possível SCA"
  ],
  "population": "Adultos ≥18 anos · avaliação inicial no pronto atendimento · possível causa coronariana",
  "range": "−8 a 34 pontos · soma clínica",
  "unit": "pontos",
  "min": -8,
  "max": 34,
  "resultScale": false,
  "reviewDate": "11/10/2026",
  "scope": "Soma clínica EDACS de Than 2014, com explicitação autoral 2016 e rubricas citadas 2010. Adultos com sintomas ≥5 minutos compatíveis com possível causa coronariana e investigação médica pretendida, inclusive apresentações de maior risco. Não é EDACS-ADP, diagnóstico de SCA ou prevenção cardiovascular. Oito confirmações e sete parcelas; história condicional pode estar resolvida com dados ainda desconhecidos. 1.974 participantes na derivação e 608 na validação temporal nos mesmos dois hospitais Austrália/Nova Zelândia; sem extrapolação universal.",
  "formula": "Idade em anos completos: 18–45=2; 46–50=4; 51–55=6; 56–60=8; 61–65=10; 66–70=12; 71–75=14; 76–80=16; 81–85=18; ≥86=20. Sexo masculino +6. Somente aos 18–50 inclusive: CAD prévio qualificável OU ≥3 de cinco fatores +4 uma única vez. Após 50: parcela CAD/fatores 0 estruturalmente NA, sem negar a história. Diaforese +3; irradiação braço/ombro +5; dor inspiratória −4; dor original reproduzida à palpação −6. Soma −8..34 preserva negativos; −1 é resultado válido, não desconhecido. Os cinco fatores são família prematura, dislipidemia, diabetes, hipertensão e cigarro atual. CAD positivo ou mínimo de fatores ≥3 fixa +4; CAD negativo e máximo possível <3 fixa 0. Demais combinações desconhecidas não resolvidas impedem total. <16/≥16 é apenas comparação numérica, nunca baixo risco por si só.",
  "limits": "Nenhum ausente/incerto/não perguntado/não examinado vira normal, Não ou zero, inclusive externamente. Política local difere da convenção original incerto=Não e não possui calibração própria. Idade inteira conhecida; 18–120 é recorte com teto técnico local, sem arredondar/calendário. Dados desconhecidos dispensáveis permanecem explícitos; valor presente malformado invalida mesmo sem contribuição. História após 50 é NA apenas para a parcela, não ausente clinicamente. CAD exige IAM/CABG/PCI anterior, não suspeita atual/angina/cálcio isolados; família direta antes de 55 anos para ambos os sexos; cigarro no mês anterior, sem 30 dias fixos ou vaporizador automático. Dor índice e sintomas do episódio inicial, sem apagar por melhora posterior. Alertas da apresentação e perigo atual separados; soma baixa/negativa não neutraliza instabilidade. Sem ECG/troponina genérica, probabilidade, ADP, diagnóstico, alta, tratamento ou dispensa de exames automáticos. Suplementos 2014 negados não foram acessados; ADP 2016 distinto fica documental. Erratum do dicionário 2010 não localizado; não afirmar versão corrigida. Sem tradução validada, calibração local ou benefício de implementação demonstrado.",
  "sources": [
    {
      "title": "Than et al. 2014 · Box 3, pesos finais e preparo",
      "url": "https://www.openclinical.net/wp-content/uploads/2020/05/EDACSDecisionSupportforChestPain.pdf"
    },
    {
      "title": "Than et al. 2016 · Tabela 1, explicitação clínica; ADP distinto somente documental",
      "url": "https://eprints.whiterose.ac.uk/id/eprint/106429/1/1-s2.0-S0196064416000020-main.pdf"
    },
    {
      "title": "Cullen et al. 2010 · manuscrito citado de rubricas; erratum não localizado",
      "url": "https://scholarworks.indianapolis.iu.edu/bitstream/1805/4941/1/cullen-2010-a-comprehensive.pdf"
    }
  ],
  "reuse": {
    "attribution": "Código e redação factual próprios. 2014 sem licença geral aberta identificada; artigo 2016 CC BY-NC-ND 4.0 sem reproduzir/adaptar artigo ou formulário. Manuscrito 2010 público sem licença geral de reprodução conferida. Nenhum PDF/HTML/imagem/formulário externo redistribuído; sem tradução validada ou endosso.",
    "license": "Fatos em síntese própria; licenças dos artigos não transferidas ao produto"
  }
},fields:edacsFields,safeCalculate:evaluateEdacsAdapter,safeValidate:raw=>evaluateEdacsAdapter(raw).errors,assessPartial:raw=>{const r=evaluateEdacsAdapter(raw);return{level:r.level,alert:r.alerts.join(' ')||null};}};
export const edacsScores=[edacsScore];
