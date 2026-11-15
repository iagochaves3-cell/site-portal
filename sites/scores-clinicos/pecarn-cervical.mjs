/** Own factual categorical adapter: Lee 2025 Box / PECARN author graphic 2024. Frozen kernel unchanged. */
import {PROFILE,CONFIRMATIONS,FINDINGS,evaluatePecarnCervical} from './pecarn-cervical-reference.mjs';
export {PROFILE};
export const cervicalFields=[
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
    "hint": "Guarda local independente da classificação e dos critérios históricos informados. Não aguardar a regra diante de emergência. Critério superior de avaliação anterior não certifica persistência atual.",
    "group": "Segurança atual"
  },
  {
    "id": "profile",
    "label": "Apresentação operacional",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "pecarn-cervical-lee2025-manual-v1",
        "label": "PECARN cervical · Lee 2025 / gráfico autoral 2024"
      }
    ],
    "hint": "Regra hierárquica sem soma. Sensibilidade cervical conforme Box / gráfico, sem restrição explícita à linha média. Diferença com posterior midline do resumo original 2024 preservada, sem alegar auditoria integral do original bloqueado.",
    "group": "Identidade e população"
  },
  {
    "id": "ageYearsCompleted",
    "label": "Idade na avaliação de referência (anos completos)",
    "type": "number",
    "min": 0,
    "max": 120,
    "step": 1,
    "noPoints": true,
    "hint": "0–17 anos neste perfil. Inteiro conhecido, sem arredondar, mês=30 dias ou calendário automático. Teto 120 é guarda técnica local. Idade ≥18 fora do perfil; transferência, abuso suspeito ou condição predisponente não são exclusões automáticas.",
    "group": "Identidade e população"
  },
  {
    "id": "bluntTraumaConfirmed",
    "label": "Trauma fechado conhecido ou suspeito confirmado?",
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
    "hint": "Trauma fechado conhecido ou suspeito foi estabelecido profissionalmente. Trauma exclusivamente penetrante fica fora do perfil; mecanismo desconhecido não é convertido automaticamente em trauma fechado.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "emergencyDepartmentAssessmentConfirmed",
    "label": "Avaliação profissional na emergência confirmada?",
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
    "hint": "Os achados foram adjudicados na avaliação da emergência. A regra não é aplicada automaticamente aos achados de observador pré-hospitalar, domicílio ou telefonema.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "referenceCohortCriteriaConfirmed",
    "label": "Enquadramento nos critérios de entrada da coorte revisto?",
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
    "hint": "Enquadramento da fonte Lee 2025 confirmado: criança trazida da cena por serviço de emergência, avaliada por equipe de trauma e/ou com imagem cervical solicitada na avaliação da emergência. Não solicitar imagem apenas para tornar o caso elegível. A API não verifica prontuário ou transporte.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "beforeCervicalImagingResultsConfirmed",
    "label": "Observação anterior ao conhecimento do resultado cervical?",
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
    "hint": "Guarda local: a observação utilizada foi estabelecida antes de conhecer o resultado da imagem cervical. Pode ser um registro anterior confiável, sem usar o diagnóstico conhecido para reconstruir negativos. Não é exclusão universal de transferidos ou de pessoas com imagem prévia; o momento de aquisição dos dados é o relevante.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "sameEpisodeAssessmentConfirmed",
    "label": "Mesma criança, episódio e avaliação de referência?",
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
    "hint": "Critérios referem-se à mesma criança e episódio de trauma e à avaliação de referência. A história de dor do episódio pode preceder a chegada, conforme a fonte; não apagar queixa porque ela melhorou depois nem misturar episódios. Não usar hora de digitação como hora do exame.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "professionalAdjudicationConfirmed",
    "label": "Critérios adjudicados por profissional de trauma pediátrico?",
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
    "hint": "Profissional familiarizado com as rubricas e avaliação de trauma pediátrico adjudicou os critérios. Não é roteiro de autoexame ou ferramenta para leigos.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "knownFindingsValidConfirmed",
    "label": "Achados apresentados como conhecidos são válidos?",
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
    "hint": "Os critérios apresentados como conhecidos foram efetivamente estabelecidos com fonte e qualidade adequadas. Critérios não avaliáveis permanecem desconhecidos. A confirmação não certifica automaticamente técnica de exame, observador ou documento.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "examinationLimitationsReviewedConfirmed",
    "label": "Limitações do exame e conflitos foram revistos?",
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
    "hint": "Foram revistas limitações por desenvolvimento, comunicação, função basal, sedação, bloqueio neuromuscular, intubação, dor, cooperação ou observações discordantes. Não deduzir resultado tranquilizador dessas condições. Se não for possível adjudicar o critério necessário, manter desconhecido.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "noMissingImputationConfirmed",
    "label": "Nenhuma ausência imputada como normal ou negativa?",
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
    "hint": "Nenhum critério não medido, desconhecido, não documentado ou impossível de avaliar foi convertido em ausente/normal/zero, inclusive no preparo externo. Uma condição clinicamente irrelevante para um ramo já determinado permanece desconhecida, sem preenchimento fictício.",
    "group": "Preparo obrigatório"
  },
  {
    "id": "consciousnessRisk",
    "label": "Consciência: categoria adjudicada, não GCS bruto",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": "high",
        "label": "Critério superior: GCS 3–8 ou AVPU U"
      },
      {
        "value": "altered",
        "label": "Sem critério superior; alteração mental intermediária"
      },
      {
        "value": "none",
        "label": "Ausência estabelecida de ambos os níveis de alteração"
      },
      {
        "value": -1,
        "label": "Desconhecida / não avaliável"
      }
    ],
    "hint": "Superior: GCS 3–8 OU AVPU U. Intermediária: GCS 9–14, AVPU V/P ou outros sinais de alteração mental, sem superior. GCS 15 sozinho não nega outros sinais. GCS/AVPU são alternativas, sem conversão automática; discordância ou exame não confiável exige adjudicação. Não selecionar a interpretação mais tranquilizadora.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "abnormalAirwayBreathingCirculation",
    "label": "Anormalidade de via aérea, respiração ou circulação",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Anormalidade de via aérea, respiração ou circulação no contexto traumático, conforme avaliação profissional. A fonte não fornece aqui limiares numéricos suficientes para um motor bruto de FC/PAS/SpO₂; não importar cortes de outros escores.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "focalNeurologicDeficit",
    "label": "Déficit neurológico focal",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Déficit neurológico focal ao exame. Localização, qualidade e relação com a observação precisam ser avaliadas; exame não realizado ou inviável não vira negativo.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "selfReportedNeckPain",
    "label": "Dor cervical autorreferida no episódio",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Dor cervical relatada pela própria criança no episódio avaliado. Não restringir à linha média neste perfil. Não verbal, silêncio, incapacidade de comunicar ou mera ausência de anotação não demonstram ausência de dor. Relato parental não substitui silenciosamente autorrelato.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "neckTenderness",
    "label": "Sensibilidade dolorosa cervical ao exame",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Sensibilidade dolorosa cervical no exame segundo a apresentação Lee 2025/gráfico autoral, sem restrição explícita à linha média. Não alegar equivalência integral à redação posterior midline do resumo original de 2024. O pacote não ensina manobras, mobilização ou provocação de dor.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "substantialHeadInjury",
    "label": "Lesão substancial de cabeça",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Lesão da cabeça que, por sua gravidade, justifica observação hospitalar internada ou intervenção cirúrgica. Não é qualquer escoriação, mecanismo de alta energia ou internação por motivo não relacionado à lesão. Fratura de crânio é exemplo no gráfico, não checklist diagnóstico automático.",
    "group": "Sete achados e hierarquia"
  },
  {
    "id": "substantialTorsoInjury",
    "label": "Lesão substancial de tronco",
    "type": "select",
    "noPoints": true,
    "options": [
      {
        "value": 1,
        "label": "Presente, adjudicado"
      },
      {
        "value": 0,
        "label": "Ausente, efetivamente estabelecido"
      },
      {
        "value": -1,
        "label": "Desconhecido / não avaliável"
      }
    ],
    "hint": "Lesão de tronco que justifica observação hospitalar internada ou cirurgia. Exemplos autorais incluem pneumotórax, sinais de lesão de órgão sólido, fratura torácica/lombar/sacral ou pélvica. Fratura isolada de osso longo não é convertida em lesão de tronco/distrativa de NEXUS.",
    "group": "Sete achados e hierarquia"
  }
];
const bools=new Set([...CONFIRMATIONS,...FINDINGS.slice(1)]);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(cervicalFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
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
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar a regra cervical. Perigo atual informado, independente da classificação e dos critérios históricos.';
const statusLabels={invalid:'Entrada inválida',outside_profile:'Fora do perfil / preparo não confirmado',incomplete:'Classificação ainda não determinada'};
const display={high_risk_criterion:'Critério superior identificado',cart_criterion_without_high_risk:'Critério intermediário identificado',no_listed_factors:'Nenhum fator listado identificado'};
const local='Apresentação Lee 2025 / gráfico autoral 2024, dados manualmente adjudicados e política local estrita de ausências, sem calibração própria. Não é soma, diagnóstico definitivo ou probabilidade individual. Nenhum ramo autoriza automaticamente imagem, retirada de imobilização, mobilização cervical, alta ou dispensa de avaliação. Ausência dos fatores não exclui lesão. Confirmações não verificam prontuário, identidade, calendário ou exame clínico.';
function historyText(r){if(r.reportedHighRiskCriterionPresent===true)return 'Critério superior informado na avaliação de referência requer revisão prioritária. O registro pode ser anterior, incompleto ou de qualidade não confirmada; não certifica persistência atual. Não aguarde classificação diante de emergência.';if(r.reportedHighRiskCriterionPresent===false)return 'Ausência dos três grupos superiores estabelecida nos dados/preparo pertinentes. Isso pode coexistir com critério intermediário ou desconhecidos inferiores; não significa ausência de urgência global, segurança ou dispensa de avaliação.';return 'Presença/ausência dos critérios superiores não estabelecida; desconhecimento não equivale a negativa nem a ausência de urgência.';}
export function evaluateCervicalAdapter(raw){
 const{data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of cervicalFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Guarda atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?integer(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Valor canônico obrigatório; idade inteira, seletores explícitos, sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]='__invalid_adapter_value__';continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'negativa de perigo após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const original=evaluatePecarnCervical(input),localInvalid=issues.some(i=>i.kind==='invalid');
 const r=localInvalid?{...original,reportedHighRiskAssessmentComplete:false,reportedHighRiskCriterionPresent:original.reportedHighRiskCriterionPresent===true?true:null,urgentReviewRecommended:original.reportedHighRiskCriterionPresent===true?true:null}:original;
 const all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','outside_profile','missing'],status=complete?'classified':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],history=historyText(r),alerts=[...(danger?[urgent]:[]),...(r.reportedHighRiskCriterionPresent===true?[history]:[])],level=danger?'high':'neutral';
 const named=id=>cervicalFields.find(f=>f.id===id)?.label??id;
 if(!complete){const reason=[statusLabels[finalStatus]+': nenhum ramo válido emitido.',...all.map(i=>named(i.field)+': '+i.reason),...alerts].join(' ');return{...r,status:finalStatus,complete:false,classificationComplete:false,branchDetermined:false,assessmentComplete:false,classification:null,rulePositive:null,total:null,components:null,interpretation:null,issues:all,errors,alerts,level,currentDanger:danger?true:safety==='negativa de perigo após avaliação atual'?false:null,label:statusLabels[finalStatus],reason,action:reason,audit:'PECARN cervical, apresentação Lee 2025/gráfico 2024. Critério superior capturado pode justificar aviso, mas falha de contexto/tipo/preparo impede classificação válida. '+history+' '+local,breakdown:[]};}
 const known=FINDINGS.filter(k=>!r.unresolvedFields.includes(k)),unknownNames=r.unresolvedFields.map(named),completeness=`Ramo determinado; ${known.length}/7 achados conhecidos. `+(r.findingsComplete?'Todos os sete dados foram estabelecidos, sem certificar exame global completo.':'Achados ainda desconhecidos: '+unknownNames.join('; ')+'. Não foram preenchidos como negativos e não alteram o ramo já determinado.'),describe=k=>input[k]===null?'Desconhecido / não avaliado':k==='consciousnessRisk'?({high:'critério superior de consciência',altered:'alteração mental intermediária, sem superior',none:'ausência estabelecida de ambos os níveis'})[input[k]]:input[k]?'Presente, adjudicado':'Ausente, efetivamente estabelecido';
 const audit=`PECARN cervical: apresentação operacional Lee 2025, Box / gráfico autoral 2024, perfil ${PROFILE}. Idade ${input.ageYearsCompleted} anos completos na avaliação ED de referência após trauma fechado. Nove confirmações profissionais estabelecidas: entrada da coorte, observação anterior ao conhecimento do resultado cervical, mesma criança/episódio, validade dos achados conhecidos, limitações do exame e nenhuma imputação de dado não documentado/não avaliável/desconhecido como normal ou negativo, inclusive externamente. Histórico confiável de dor no mesmo episódio pode preceder chegada e não deve ser apagado pela melhora. Categoria: ${display[r.classification]}. ${completeness} classificationComplete/complete/branchDetermined significam somente suficiência para o ramo; findingsComplete=${r.findingsComplete}; assessmentComplete=${r.assessmentComplete}, sem certificação de fonte ou exame global. Sete dados: ${FINDINGS.map(k=>named(k)+': '+describe(k)).join('; ')}. Critério superior prevalece; intermediário requer todos os superiores ausentes; ramo sem fatores exige todos os sete conhecidos negativos. Valor presente inválido nunca é ignorado, mesmo em posição dispensável da árvore. Consciência: GCS 3–8 ou AVPU U no ramo superior; GCS 9–14, AVPU V/P ou outros sinais mentais no intermediário sem superior. Não há conversão de GCS/AVPU nem negativa automática por GCS 15, sedação ou intubação. Criança não verbal não recebe dor ausente por silêncio; lesão substancial justifica observação hospitalar internada ou cirurgia, adjudicada, não qualquer escoriação. Sensibilidade cervical deste perfil não é restrita explicitamente à linha média; posterior midline do resumo original 2024 é divergência documental não resolvida. Original integral bloqueado não foi auditado nem obtido por outra rota. Lee 2025 reanalisa a mesma coorte, não é validação externa independente; 29 falsos negativos foram relatados e ausência de fatores não exclui lesão. Taxas de imagem são projeções, não efeito de implementação medido. ${history} Indicador histórico reportedHighRiskCriterionPresent (alias urgentReviewRecommended), escopo reported_upper_branch_criteria_only: ${r.reportedHighRiskCriterionPresent===null?'desconhecido':r.reportedHighRiskCriterionPresent?'positivo':'negativo somente para grupos superiores'}. Segurança atual declarada: ${safety}; não é inferida desse indicador. ${local} Transferência, suspeita de abuso ou condição predisponente não são exclusões automáticas; avaliação pré-hospitalar não é intercambiável automaticamente. Redação factual/código próprios, sem tradução validada ou endosso; Lee 2025 declara CC BY, sem atribuir essa licença ao gráfico institucional. Não há comparação longitudinal ou cálculo de calendário.`;
 return{...r,displayValue:display[r.classification],errors:[],issues:[],alerts,level,currentDanger:danger?true:safety==='negativa de perigo após avaliação atual'?false:null,label:`Classificação determinada · ${known.length}/7 achados conhecidos`,reason:null,action:completeness+' '+local,audit,breakdown:FINDINGS.map(k=>({label:named(k),points:null,detail:describe(k)}))};
}
export const cervicalScore={...{
  "id": "pecarn-cervical-lee2025",
  "name": "PECARN cervical · apresentação Lee 2025",
  "subtitle": "Trauma fechado pediátrico · hierarquia clínica / gráfico autoral 2024",
  "specialty": "Pediatria",
  "specialties": [
    "Pediatria",
    "Trauma e Ortopedia",
    "Neurologia"
  ],
  "aliases": [
    "PECARN cervical",
    "Cervical Spine Injury Prediction Rule",
    "lesão cervical",
    "trauma cervical"
  ],
  "population": "0–17 anos completos · trauma fechado · avaliação profissional na emergência",
  "range": "Três ramos hierárquicos · sem pontos",
  "unit": " ",
  "max": 0,
  "categorical": true,
  "resultScale": false,
  "reviewDate": "11/10/2026",
  "scope": "Classificação hierárquica diagnóstica de risco de lesão cervical após trauma fechado pediátrico. Apresentação operacional do Box de Lee 2025 e gráfico autoral PECARN 2024; nove confirmações, idade e sete achados agrupados adjudicados. Coorte de emergência em 18 centros pediátricos terciários dos EUA, entrada por EMS/equipe de trauma e/ou imagem solicitada na avaliação; não solicitar imagem só para tornar caso elegível. Ramo determinado não exige necessariamente todos os achados conhecidos, mas o ramo sem fatores exige todos negativos válidos. Não é diagnóstico definitivo, soma, probabilidade ou ordem de imagem.",
  "formula": "Hierarquia sem pontos: (1) consciência superior (GCS 3–8 ou AVPU U), anormalidade ABC OU déficit focal positivo → critério superior; pode determinar ramo mesmo com achados inferiores desconhecidos. (2) Com todos os superiores ausentes, alteração mental intermediária (GCS 9–14, AVPU V/P ou outros sinais), dor cervical autorreferida, sensibilidade cervical ao exame, lesão substancial de cabeça OU tronco → critério intermediário. (3) Todos os sete dados conhecidos negativos → sem fatores listados. Desconhecido que ainda pode alterar o ramo mantém incompleto. Campo presente malformado invalida mesmo se dispensável na hierarquia. Complete/classificationComplete/branchDetermined referem ramo; findingsComplete refere sete dados; assessmentComplete requer ambos. Total/componentes/probabilidade/ações automáticas são sempre nulos.",
  "limits": "Nenhum silêncio, exame inviável, dado não documentado ou não avaliável vira negativo/normal, inclusive externamente. Criança não verbal não recebe dor negativa automaticamente. GCS/AVPU são alternativas adjudicadas, não convertidas; GCS 15 sozinho não nega outros sinais. Limitações por desenvolvimento, função basal, sedação, intubação, cooperação ou conflito exigem revisão profissional. Não ensinar autoexame/manobras ou mobilização cervical. Lesão substancial justifica observação internada/cirurgia por gravidade, não qualquer ferimento; osso longo isolado não vira tronco/NEXUS. Neste perfil sensibilidade cervical não é restrita explicitamente à linha média; diferença com resumo original 2024 posterior midline permanece aberta. Original integral bloqueado não foi lido por outra rota. Lee 2025 é reanálise da mesma coorte com 29 falsos negativos, não validação externa; negativo não exclui lesão. Imagem projetada não demonstra benefício de implantação. Guarda local de observação antes do conhecimento do resultado, sem excluir automaticamente transferidos/imagem prévia/abuso/condições predisponentes. Idade inteira 0–17, teto técnico 120, sem calendário ou arredondar; trauma exclusivamente penetrante fora. Indicador histórico superior tem escopo limitado, não urgência atual global; perigo declarado permanece independente. Nenhum ramo autoriza TC/radiografia automática, retirada de colar, mobilização, alta ou dispensa de avaliação. Sem calibração individual própria, comparação ou mudança automática para TCE/abdome/NEXUS/CCR.",
  "sources": [
    {
      "title": "Lee et al. 2025 · Box operacional e reanálise da mesma coorte",
      "url": "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2842988"
    },
    {
      "title": "PECARN · gráfico autoral atualizado 04/06/2024, hierarquia",
      "url": "https://pecarn.org/wp-content/uploads/2024/06/EMS240529_CSpineGraphics_Full240605.pdf"
    },
    {
      "title": "Leonard et al. 2024 · original, resumo; diferença de sensibilidade posterior na linha média",
      "url": "https://pubmed.ncbi.nlm.nih.gov/38843852/"
    }
  ],
  "reuse": {
    "attribution": "Redação factual, código e adaptação próprios. Lee 2025 declara CC BY; não se transfere essa licença ao gráfico institucional. Nenhum PDF/formulário/imagem externo redistribuído; sem tradução clínica validada ou endosso. Original 2024 integral não auditado.",
    "license": "Lee 2025: CC BY; gráfico com licença distinta não presumida"
  }
},fields:cervicalFields,safeCalculate:evaluateCervicalAdapter,safeValidate:raw=>evaluateCervicalAdapter(raw).errors,assessPartial:raw=>{const r=evaluateCervicalAdapter(raw);return{level:r.level,alert:r.alerts.join(' ')||null};}};
export const cervicalScores=[cervicalScore];
