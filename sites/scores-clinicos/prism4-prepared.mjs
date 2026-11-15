/** Own UI adapter for the frozen PRISM IV regression; physiological scores are external. */
import {PROFILE,evaluatePrism4} from './prism4-reference.mjs';
export {PROFILE};
const select=(id,label,options,hint,group)=>({id,label,type:'select',noPoints:true,options:options.map(([value,label])=>({value,label})),hint,group});
const confirmations=[
 {
  "id": "nonNeonatalPicuConfirmed",
  "label": "UTIP não neonatal confirmada?",
  "hint": "UTIP não neonatal, incluindo paciente recém-nascido quando admitido nesse contexto; não extensão geral à UTI neonatal.",
  "group": "População e admissão"
 },
 {
  "id": "under18AtPicuAdmissionConfirmed",
  "label": "Idade menor de 18 anos na admissão UTIP confirmada?",
  "hint": "Idade cronológica menor de 18 anos na admissão UTIP, conforme recorte da coorte original; não idade atual nem contraindicação universal acima desse recorte.",
  "group": "População e admissão"
 },
 {
  "id": "firstPicuAdmissionThisHospitalizationConfirmed",
  "label": "Primeira admissão UTIP desta hospitalização confirmada?",
  "hint": "Primeira admissão de UTIP da hospitalização. Readmissão na mesma hospitalização não é nova observação independente do perfil. Refere-se à hospitalização da instituição de referência; passagem prévia por outra UTIP em outro hospital não equivale automaticamente a readmissão nesta hospitalização.",
  "group": "População e admissão"
 },
 {
  "id": "notMoribundFirst2hConfirmed",
  "label": "Confirmado que o paciente não preenche o critério original de moribundo nas primeiras 2 horas?",
  "hint": "Sim = o critério original de moribundo com sinais vitais incompatíveis com vida nas primeiras duas horas não é preenchido. Não = critério preenchido, fora deste perfil. Desconhecido = sem adjudicação suficiente. Não equivale a excluir automaticamente toda permanência menor de duas horas.",
  "group": "População e admissão"
 },
 {
  "id": "sameAdmissionConfirmed",
  "label": "Todos os componentes pertencem à mesma admissão e hospitalização?",
  "hint": "Idade, origem, antecedentes e ambos os subescores pertencem à mesma primeira admissão/hospitalização.",
  "group": "População e admissão"
 },
 {
  "id": "professionalAdjudicationConfirmed",
  "label": "Preparo e enquadramento adjudicados por profissional?",
  "hint": "Preparo conferido por profissional apto ao método; confirmação não substitui documentação nem resolve casos sem ramo.",
  "group": "População e admissão"
 },
 {
  "id": "ageBandAtAdmissionReviewed",
  "label": "Faixa etária na admissão revisada sem conversão artificial de meses?",
  "hint": "Faixa de dias/meses adjudicada na admissão. Mês não é convertido em 30 dias por este módulo.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "samplingCaseReviewed",
  "label": "Caso temporal literal e tipo de intervenção cardíaca revisados?",
  "hint": "Caso temporal literal foi examinado. Cateterismo diagnóstico não qualifica para deslocar a janela; casos não cobertos permanecem unresolved.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "observationWindowComplete",
  "label": "Janela de observação pertinente já encerrada?",
  "hint": "Janela pertinente encerrada e conjunto final preparado; não estimativa prospectiva a partir de janela parcial.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "subscoresPreparedForSelectedWindow",
  "label": "Ambos os subescores PRISM III estão preparados para a janela PRISM IV escolhida?",
  "hint": "Duas somas de pontos PRISM III previamente calculadas para janela PRISM IV selecionada, auditadas; não total isolado, valores brutos, escores III-12/24, APS ou pontos de outros instrumentos.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "physiologicalMissingPolicyReviewed",
  "label": "Política de dados fisiológicos ausentes/não avaliáveis revisada no processo externo?",
  "hint": "Processo externo documentou as fontes e as informações necessárias/aplicáveis. A revisão da política histórica não autoriza imputar normal/zero: a confirmação local separada de nenhuma imputação é obrigatória. Receber somas não certifica o preparo. Não solicitar exames adicionais somente para o índice.",
  "group": "Preparo externo e janela"
 },
 {id:'noMissingNormalImputationConfirmed',label:'Preparo completo sem imputar normalidade/zero a dados ausentes confirmado?',hint:'Guarda local obrigatória: fontes válidas e completas para todas as informações necessárias e aplicáveis, sem transformar dado não medido, desconhecido ou impossível de avaliar em normal/zero, inclusive nas duas somas externas. Ausência ou negativa impede estimativa. Zero realmente estabelecido continua válido. Não solicitar exames adicionais somente para calcular.',group:'Preparo externo e janela'},
 {
  "id": "neurologicalConfoundersReviewed",
  "label": "Confundidores neurológicos e fonte válida do estado neurológico revisados?",
  "hint": "Processo externo avaliou sedação, anestesia, bloqueio, alterações crônicas e fonte válida do estado neurológico conforme protocolo de preparo. GCS bruto não é subescore.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "eligibleMeasurementSourcesReviewed",
  "label": "Fontes e temporalidade das medidas elegíveis revisadas, sem dados intraoperatórios?",
  "hint": "Preparo exclui medidas intraoperatórias; usa fontes/locais/unidades e temporalidade apropriados. Para janela de admissão, exames podem vir de PS/enfermaria/PACU/outro serviço quando elegíveis. Não é auditado automaticamente.",
  "group": "Preparo externo e janela"
 },
 {
  "id": "primarySystemReviewed",
  "label": "Sistema primário responsável pela admissão UTIP adjudicado?",
  "hint": "Sistema responsável pela admissão UTIP foi adjudicado; comorbidade renal/hematológica/endócrina isolada não determina baixo risco.",
  "group": "Preparo externo e janela"
 }
];
const cases=[
 [
  "noQualifyingCardiacIntervention",
  "Sem intervenção cardíaca qualificante; inclui cateterismo meramente diagnóstico, sem outra intervenção qualificante. Janela: admissão."
 ],
 [
  "cardiacAgeUnder24hStayUnder12h",
  "Idade <24 h na admissão; permanência UTIP antes da intervenção <12 h. Janela: admissão."
 ],
 [
  "cardiacAgeUnder24hStay12hTo10d",
  "Idade <24 h; permanência prévia de 12 h até 10 dias. Janela: pós-intervenção."
 ],
 [
  "cardiacAge24hTo10dStay0To10d",
  "Idade 24 h até 10 dias; permanência prévia de 0 até 10 dias. Janela: pós-intervenção."
 ],
 [
  "cardiacAge24hTo10dStayOver10d",
  "Idade 24 h até 10 dias; permanência prévia >10 dias. Janela: admissão."
 ],
 [
  "cardiacAge11To30dStayUnder48h",
  "Idade 11–30 dias; permanência prévia <48 h. Janela: pós-intervenção."
 ],
 [
  "cardiacAge11To30dStayOver48h",
  "Idade 11–30 dias; permanência prévia >48 h. Janela: admissão."
 ],
 [
  "cardiacAge31To90dSurgeryStayUnder48h",
  "Idade 31–90 dias; cirurgia cardíaca; permanência prévia <48 h. Janela: pós-intervenção."
 ],
 [
  "cardiacAge31To90dInterventionalCathStayUnder48h",
  "Idade 31–90 dias; cateterismo intervencionista; permanência prévia <48 h. Janela: admissão."
 ],
 [
  "cardiacAge31To90dStayOver48h",
  "Idade 31–90 dias; cirurgia ou cateterismo intervencionista; permanência prévia >48 h. Janela: admissão."
 ],
 [
  "cardiacAgeOver90d",
  "Idade >90 dias na admissão; intervenção cardíaca, qualquer permanência prévia. Janela: admissão."
 ],
 [
  "unresolved",
  "Caso não resolvido pela fonte ou adjudicação incompleta · sem estimativa"
 ]
];
const binary=(id,label,hint)=>select(id,label,[[1,'Sim, estabelecido'],[0,'Não, ausência estabelecida'],[-1,'Desconhecido / não foi possível estabelecer']],hint,'Antecedentes e sistema primário');
export const prism4Fields=[
 select('danger_signs','Há instabilidade atual ou piora que exige avaliação imediata?',[[1,'Sim'],[0,'Não, após avaliação atual'],[-1,'Desconhecido / não avaliado']],'Guarda local independente do prognóstico e de antecedentes históricos. Não esperar a janela encerrar ou o cálculo diante de emergência. Não se deduz urgência de pontos, câncer ou RCP histórica.','Segurança atual'),
 select('profile','Perfil operacional',[[PROFILE,'PRISM IV · regressão 2016 com subescores preparados · recorte sem imputação']],'Não é o motor fisiológico bruto PRISM III, PRISM III-12/24, TOPICC tricotômico ou PRISM4-C. Os casos discordantes/sem ramo ficam sem estimativa.','Versão'),
 ...confirmations.map(f=>select(f.id,f.label,[[1,'Sim, confirmado por profissional'],[0,'Não, requisito não satisfeito'],[-1,'Desconhecido / preparo incompleto']],f.hint,f.group)),
 select('ageBand','Faixa de idade cronológica na admissão UTIP',[['under14d','0 a <14 dias'],['14d-under1mo','14 dias a <1 mês'],['1-under12mo','1 a <12 meses'],['12mo-under18y','≥12 meses e <18 anos'],[-1,'Desconhecida / não adjudicável']],'Mês não é convertido em 30 dias. Faixa já adjudicada na admissão, não idade atual. A confirmação manual não verifica datas nem idade biologicamente coerente por si.','Entradas da regressão'),
 select('admissionSource','Origem classificada do ingresso UTIP',[['otherHospital','Outro hospital'],['inpatient','Enfermaria / internação na instituição'],['emergency','Pronto-socorro'],['operatingRoomOrPacu','Sala operatória ou recuperação pós-anestésica'],[-1,'Desconhecida / não adjudicável']],'Não é a localização no momento do cálculo. Transferência via PS exige adjudicação; não há prioridade automática inventada entre ramos.','Entradas da regressão'),
 binary('cpr24hPrePicu','Massagem torácica fechada nas 24 h antes da admissão UTIP?','Definição da Tabela 3; dentro de 24 h, incluindo 24 h exatas na leitura operacional. Sem cálculo automático de calendário.'),
 binary('cprHospitalDefinition','Massagem torácica fechada pela definição hospitalar dos métodos?','Nas 24 h antes da hospitalização OU após a admissão hospitalar antes da UTIP. Serve como guarda de concordância; deve coincidir com a resposta ao campo pré-UTIP. Discordância entre definições impede a estimativa, sem escolher a mais favorável.'),
 binary('cancer','Câncer agudo ou crônico estabelecido?','Antecedente adjudicado separadamente do sistema primário. Câncer junto com sistema primário de baixo risco é possível clinicamente, mas este recorte recusa estimativa por divergência entre fontes.'),
 binary('lowRiskPrimarySystem','Sistema primário endócrino, hematológico, musculoesquelético ou renal?','Sistema responsável pela admissão UTIP, não comorbidade isolada. Não inferir automaticamente pelo nome de um diagnóstico secundário; associação com câncer fica sem estimativa neste perfil.'),
 select('samplingCase','Caso temporal literal já adjudicado',cases,'Cirurgia cardíaca/cateterismo intervencionista qualificantes, não cateterismo meramente diagnóstico. Idades 11–30 ou 31–90 dias com permanência prévia exatamente 48 h; idade <24 h com intervenção após >10 dias; idades fracionárias não enquadradas ou dados incertos: Caso não resolvido. Não arredondar para incluir. Nenhuma confirmação libera uma lacuna.','Seleção manual da janela'),
 select('collectionWindow','Janela efetivamente usada nos dois subescores',[['admission','Admissão: não laboratoriais 0–4 h; laboratórios −2 a +4 h'],['postintervention','Pós-intervenção: primeiras 4 h do cuidado UTIP após intervenção qualificante'],[-1,'Desconhecida / não confirmada']],'Deve corresponder ao caso temporal; não se preenche automaticamente. Na admissão, laboratório elegível pode vir de PS/enfermaria/PACU/outro serviço; sala operatória excluída. Pós-intervenção não ganha uma janela laboratorial −2 h.','Seleção manual da janela'),
 select('neurologicPoints','Subescore neurológico PRISM III previamente preparado',[[0,'0 pontos'],[5,'5 pontos'],[7,'7 pontos'],[11,'11 pontos'],[12,'12 pontos'],[16,'16 pontos'],[-1,'Desconhecido / não preparado']],'Soma de pontos de estado mental e pupilas no preparo externo para a janela escolhida. Não é GCS, não é dado bruto e não é inferido do total. Zero somente se realmente estabelecido; sedação/anestesia/bloqueio e alterações crônicas precisam ser revistos.','Subescores externos'),
 {id:'nonneurologicPoints',label:'Subescore não neurológico PRISM III previamente preparado',type:'number',min:0,max:58,step:1,noPoints:true,hint:'Inteiro 0–58, soma das demais contribuições preparada externamente para esta janela. Envelope conservador local, não valida todas as combinações fisiológicas. Não derivar subescore de um total isolado; dado ausente não é zero. Não solicitar exames apenas para completar o índice.',group:'Subescores externos'},
];
const bools=new Set([...confirmations.map(f=>f.id),'cpr24hPrePicu','cprHospitalDefinition','cancer','lowRiskPrimarySystem']);
function capture(raw){const data=Object.create(null),issues=[],allowed=new Set(prism4Fields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});if(raw===null||typeof raw!=='object')return {data,issues:[{field:'profile',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};try{const p=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(p!==Object.prototype&&p!==null))invalid('profile','Protótipo não admitido.');}catch{invalid('profile','Falha ao ler protótipo.');}let keys;try{keys=Reflect.ownKeys(raw);}catch{invalid('profile','Falha na primeira lista de chaves.');return {data,issues};}for(const k of keys){let d;try{d=Object.getOwnPropertyDescriptor(raw,k);}catch{invalid(typeof k==='string'&&allowed.has(k)?k:'profile','Falha ao ler descritor.');continue;}if(typeof k!=='string'||!allowed.has(k)){invalid('profile','Campo não previsto.');continue;}if(!d||!Object.hasOwn(d,'value')){invalid(k,'Accessor recusado sem invocação.');continue;}data[k]=d.value;}return {data,issues};}
function selection(v,f){if(typeof v!=='string'&&typeof v!=='number')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const o=f.options.find(o=>v===o.value||(typeof v==='string'&&v===String(o.value)));return o?{ok:true,value:o.value}:{ok:false};}
function integer(v){if(typeof v==='number')return Number.isSafeInteger(v)&&!Object.is(v,-0)?{ok:true,value:v}:{ok:false};if(typeof v!=='string'||!/^(?:0|[1-9]\d*)$/.test(v))return {ok:false};const n=Number(v);return Number.isSafeInteger(n)?{ok:true,value:n}:{ok:false};}
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde a janela de observação nem o cálculo do PRISM IV. Alerta de perigo atual informado, independente do prognóstico estatístico.';
const milliText=x=>{const sign=x<0?'−':x>0?'+':'',a=Math.abs(x);return sign+Math.floor(a/1000)+','+String(a%1000).padStart(3,'0');};
const ptPercent=x=>x.toFixed(4).replace('.',',');
const windowText={admission:'Admissão: variáveis não laboratoriais nas primeiras 0–4 h da UTIP; laboratório de −2 a +4 h, excluindo sala operatória.',postintervention:'Pós-intervenção: todas as variáveis nas primeiras 4 h do cuidado UTIP após intervenção qualificante; sem acrescentar −2 h laboratorial.'};
const statusLabel={invalid:'Entrada inválida',inconsistent:'Entradas incompatíveis',outside_profile:'Fora do perfil / preparo não satisfeito',unresolved_source:'Caso não resolvido neste recorte',incomplete:'Informação insuficiente'};
export function evaluatePrism4Adapter(raw){
 const {data,issues}=capture(raw),input=Object.create(null);let danger=false;
 for(const f of prism4Fields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Segurança atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?integer(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica da ficha obrigatória; sem coerção.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs')danger=p.value===1;else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluatePrism4(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','inconsistent','outside_profile','unresolved_source','missing'],status=complete?'estimated':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],alerts=danger?[urgent]:[],level=danger?'high':'neutral';
 if(!complete){const reason=[statusLabel[finalStatus]+': nenhum prognóstico numérico foi emitido.',...all.map(i=>(prism4Fields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,total:null,probability:null,percent:null,logit:null,logitMilli:null,physiologicTotal:null,contributionsMilli:null,collectionWindow:null,interpretation:null,issues:all,errors,alerts,level,label:statusLabel[finalStatus],reason,action:reason,audit:'PRISM IV, regressão publicada 2016, recorte concordante sem imputação com subescores externos. Nenhuma soma parcial, probabilidade ou categoria de risco validada. Ausências, discordância de RCP, câncer com sistema primário de baixo risco e caso temporal sem ramo não são resolvidos por arredondamento ou confirmação.',breakdown:[]};}
 const caseLabel=cases.find(([key])=>key===input.samplingCase)[1],window=windowText[input.collectionWindow],names={intercept:'Intercepto',age:'Faixa etária',admissionSource:'Origem da admissão',cpr:'RCP concordante',cancer:'Câncer',lowRiskPrimarySystem:'Sistema primário de baixo risco',neurologic:`Subescore neurológico ${input.neurologicPoints}×0,197`,nonneurologic:`Subescore não neurológico ${input.nonneurologicPoints}×0,163`};
 const rounded=ptPercent(r.percent),audit=`PRISM IV: regressão da Tabela 3 (Pollack 2016), recorte concordante. Subescores preparados externamente: neurológico ${input.neurologicPoints} e não neurológico ${input.nonneurologicPoints}; soma fisiológica preparada ${r.physiologicTotal} pontos (não é porcentagem nem motor bruto validado aqui). Caso: ${caseLabel} ${window} População e primeira admissão/hospitalização confirmadas; critério original de moribundo nas primeiras 2 h confirmado como não preenchido. Fontes, confundidores e política externa de dados ausentes revistos por profissional. Guarda local confirmada: fontes válidas completas para informações necessárias/aplicáveis, sem imputar normalidade ou zero por dado não medido, desconhecido ou impossível de avaliar, inclusive nas somas externas. O desempenho deste subconjunto sem imputação não foi validado especificamente pelas coortes citadas. Não solicitar exames adicionais apenas para calcular. RCP nas 24 h pré-UTIP e definição hospitalar concordantes; câncer e sistema de baixo risco não simultâneos neste recorte. Logit em milésimos: ${Object.entries(r.contributionsMilli).map(([key,value])=>names[key]+' '+milliText(value)).join('; ')}; soma ${r.logitMilli} milésimos = ${milliText(r.logitMilli)}. p=1/(1+exp(−logit)); estimativa do modelo de mortalidade hospitalar ≈${rounded}%. Percentual arredondado apenas na apresentação a quatro casas; a regressão e a conversão de p para % usam valores não arredondados. Essa resolução numérica não é precisão clínica ou certeza individual. Não se certificam fisiologia bruta, datas, identidade ou calibração contemporânea. Não orienta alta, recusa ou retirada de suporte.`;
 return {...r,total:r.percent,displayValue:'≈ '+rounded,errors:[],issues:[],alerts,level,label:'Estimativa do modelo de mortalidade hospitalar',reason:null,action:r.limitations+' Interpretação principalmente para comparação e ajuste de risco em grupos; não há limiar de conduta ou categoria de risco neste perfil. Quatro casas percentuais são apresentação numérica, não calibração individual comprovada.',audit,breakdown:Object.entries(r.contributionsMilli).map(([key,value])=>({label:names[key],points:value/1000,detail:milliText(value)+' no logit'}))};
}
export const prism4Score={id:'prism-iv-prepared-2016',name:'PRISM IV · regressão com subescores preparados',subtitle:'Mortalidade hospitalar · Tabela 3/2016 · recorte local sem imputação',specialty:'Pediatria',specialties:['Pediatria','Emergência e UTI'],aliases:['PRISM IV','PRISM4','Pediatric Risk of Mortality IV','Pollack 2016','CPCCRN'],population:'UTIP não neonatal · idade na admissão <18 anos · primeira admissão da hospitalização',range:'Estimativa de mortalidade hospitalar (%)',max:100,unit:'%',resultScale:false,reviewDate:'11/10/2026',scope:'Regressão publicada 2016, com dois subescores PRISM III previamente preparados para as janelas PRISM IV, não motor de fisiologia bruta. Recém-nascido a menor de 18 anos na admissão, em UTIP não neonatal, primeira admissão da hospitalização da instituição de referência. Transferência de outra UTIP/hospital não exclui automaticamente; readmissão nesta hospitalização e exclusão original de moribundo nas primeiras 2 h ficam fora. A avaliação é retrospectiva da janela pertinente encerrada, sem substituir assistência atual. Recorte local sem imputação de normalidade/zero por informação necessária/aplicável ausente, inclusive nas somas externas; não equivalente à população completa com a política histórica de missing. Seu desempenho específico não foi validado pelas coortes citadas.',fields:prism4Fields,
 formula:'Logit = −5,776 + idade + origem +1,082×RCP +0,766×câncer −1,697×sistema primário de baixo risco +0,197×pontos neurológicos +0,163×pontos não neurológicos. Idade: <14 dias +1,311; 14 dias a <1 mês +0,968; 1 a <12 meses +0,357; ≥12 meses 0. Origem: outro hospital +1,012; enfermaria +1,626; PS +0,693; sala operatória/PACU 0. p=1/(1+exp(−logit)), percentual=100×p. Coeficientes somados exatamente em milésimos; função logística em ponto flutuante é aproximação. Neuro: 0, 5, 7, 11, 12, 16; não neuro: inteiro 0–58, subescores preparados externamente. RCP só com concordância das duas definições; câncer+baixo risco simultâneos ficam sem estimativa por discordância documental. Caso/janela devem concordar: '+cases.map(([id,label])=>label).join(' ')+' Janela de admissão: não laboratoriais 0–4 h, laboratório −2 a +4 h; sala operatória excluída. Pós-intervenção: primeiras 4 h do cuidado UTIP, sem −2 h pré-intervenção.',
 limits:'Perfil restrito aos casos concordantes da Tabela 3/Pollack 2016. Não é PRISM III-12/24, modelo tricotômico TOPICC, PRISM4-C ou réplica integral da calculadora pública atual. Não calcula GCS, sinais vitais, gasometria, bioquímica ou pontos brutos; não deriva subescores de um total. Domínios dos subescores são guardas conservadoras, não validação de todas as combinações. Ausente, não medido, desconhecido ou impossível de avaliar não pode ter virado normal/zero no preparo externo: exige-se confirmação explícita de fontes válidas completas para informações necessárias/aplicáveis e nenhuma imputação. Ausência/negativa recusa a estimativa, mesmo com somas preenchidas. Zero realmente estabelecido é aceito. Recorte local mais estrito, não equivalente à coorte completa; desempenho deste subconjunto não validado especificamente. Não solicitar exames só para o escore. RCP discordante, câncer+baixo risco, caso cardíaco sem ramo (incluindo exatamente 48 h nas faixas 11–30/31–90 dias), <24 h com intervenção após >10 dias ou idade fracionária não enquadrada ficam sem estimativa; não arredondar para incluir. Guardas etárias/caso são parciais e não certificam calendário nem coerência biológica completa. Janela incompleta não permite estimativa prospectiva. Risco se refere à mortalidade até alta hospitalar, não alta da UTIP nem seguimento pós-transferência inferido. Validação externa pode mostrar calibração inadequada (inclusive estudo brasileiro 2025); estatística de grupos não é certeza individual. Sem faixas arbitrárias, diagnóstico, prescrição, alta ou recusa/retirada de suporte. Quatro casas exibidas não significam precisão clínica. Algoritmo PRISM IV declarado em domínio público pelos autores; artigos/formulários/código externo não foram copiados nem recebem licença geral por isso.',
 sources:[{title:'Pollack et al. 2016 · PRISM IV · Tabelas 2/3 e algoritmo em domínio público · DOI 10.1097/PCC.0000000000000558',url:'https://www.cpccrn.org/documents/2015_PMID26492059_Pollack.pdf'},{title:'Suplemento PRISM IV · categorias e definições; não coeficientes finais',url:'https://cdn-links.lww.com/permalink/pcc/a/pcc_17_1_2015_08_20_pollack_pccm-d-15-00182_sdc1.pdf'},{title:'Pollack et al. 2013 · janelas e fontes de dados',url:'https://www.cpccrn.org/documents/2013_PMID23628831_Pollack.pdf'},{title:'CPCCRN · calculadora PRISM IV consultada como fonte de divergências; código não incorporado',url:'https://www.cpccrn.org/calculators/prismivcalculator/'},{title:'CPCCRN · preparo PRISM III e domínios dos subescores; sem motor bruto nesta ficha',url:'https://www.cpccrn.org/calculators/prismiiicalculator/'},{title:'Rodrigues-Santos et al. 2025 · validação brasileira e limites de calibração',url:'https://pubmed.ncbi.nlm.nih.gov/40153553/'}],reuse:{attribution:'Implementação e redação factual próprias da regressão PRISM IV publicada por Pollack et al. 2016, algoritmo declarado em domínio público. Artigos, tabelas editoriais, formulários e código JavaScript CPCCRN não são reproduzidos; sem endosso autoral.'},safeCalculate:evaluatePrism4Adapter,safeValidate:raw=>evaluatePrism4Adapter(raw).errors,assessPartial:raw=>{const r=evaluatePrism4Adapter(raw);return {level:r.level,alert:r.alerts[0]||null};}};
export const prism4Scores=[prism4Score];
