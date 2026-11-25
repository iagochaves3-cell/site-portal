/** Referência original de pesquisa. Regressão restrita com subescores externos; não calcula fisiologia. */
export const PROFILE='prism-iv-2016-table3-concordant-prepared-v2';
export const CONFIRMATIONS=Object.freeze(['nonNeonatalPicuConfirmed','under18AtPicuAdmissionConfirmed','firstPicuAdmissionThisHospitalizationConfirmed','notMoribundFirst2hConfirmed','sameAdmissionConfirmed','professionalAdjudicationConfirmed','ageBandAtAdmissionReviewed','samplingCaseReviewed','observationWindowComplete','subscoresPreparedForSelectedWindow','physiologicalMissingPolicyReviewed','noMissingNormalImputationConfirmed','neurologicalConfoundersReviewed','eligibleMeasurementSourcesReviewed','primarySystemReviewed']);
export const AGE_MILLI=Object.freeze({under14d:1311,'14d-under1mo':968,'1-under12mo':357,'12mo-under18y':0});
export const SOURCE_MILLI=Object.freeze({otherHospital:1012,inpatient:1626,emergency:693,operatingRoomOrPacu:0});
export const NEURO_VALUES=Object.freeze([0,5,7,11,12,16]);
export const SAMPLING_CASES=Object.freeze({
  noQualifyingCardiacIntervention:Object.freeze({window:'admission',ages:Object.freeze(Object.keys(AGE_MILLI))}),
  cardiacAgeUnder24hStayUnder12h:Object.freeze({window:'admission',ages:Object.freeze(['under14d'])}),
  cardiacAgeUnder24hStay12hTo10d:Object.freeze({window:'postintervention',ages:Object.freeze(['under14d'])}),
  cardiacAge24hTo10dStay0To10d:Object.freeze({window:'postintervention',ages:Object.freeze(['under14d'])}),
  cardiacAge24hTo10dStayOver10d:Object.freeze({window:'admission',ages:Object.freeze(['under14d'])}),
  cardiacAge11To30dStayUnder48h:Object.freeze({window:'postintervention',ages:Object.freeze(['under14d','14d-under1mo','1-under12mo'])}),
  cardiacAge11To30dStayOver48h:Object.freeze({window:'admission',ages:Object.freeze(['under14d','14d-under1mo','1-under12mo'])}),
  cardiacAge31To90dSurgeryStayUnder48h:Object.freeze({window:'postintervention',ages:Object.freeze(['1-under12mo'])}),
  cardiacAge31To90dInterventionalCathStayUnder48h:Object.freeze({window:'admission',ages:Object.freeze(['1-under12mo'])}),
  cardiacAge31To90dStayOver48h:Object.freeze({window:'admission',ages:Object.freeze(['1-under12mo'])}),
  cardiacAgeOver90d:Object.freeze({window:'admission',ages:Object.freeze(['1-under12mo','12mo-under18y'])})
});
const BOOLEAN_INPUTS=['cpr24hPrePicu','cprHospitalDefinition','cancer','lowRiskPrimarySystem'];
const KEYS=new Set(['profile',...CONFIRMATIONS,...BOOLEAN_INPUTS,'ageBand','admissionSource','samplingCase','collectionWindow','neurologicPoints','nonneurologicPoints']);
const LIMITATION='Estimativa de mortalidade hospitalar pelo modelo publicado de 2016, em subconjunto local mais restrito, com preparo sem imputação de ausência como normal e sem calibração própria. Não determina desfecho individual, diagnóstico, tratamento ou limitação de suporte. Calibração depende da população e da época.';
function snapshot(input){
 const values=Object.create(null),issues=[];
 if(input===null || typeof input!=='object') return {values,issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
 try {
  const proto=Object.getPrototypeOf(input);
  if(proto!==Object.prototype && proto!==null) issues.push({field:'input',kind:'invalid',reason:'Protótipo não admitido.'});
  const ds=Object.getOwnPropertyDescriptors(input);
  for(const k of Reflect.ownKeys(ds)){
   const d=ds[k];
   if(typeof k!=='string' || !KEYS.has(k)){issues.push({field:'input',kind:'invalid',reason:'Campo não previsto.'});continue;}
   if(!Object.hasOwn(d,'value')){issues.push({field:k,kind:'invalid',reason:'Accessor recusado sem invocação.'});continue;}
   values[k]=d.value;
  }
 }catch{issues.push({field:'input',kind:'invalid',reason:'Falha de reflexão contida.'});}
 return {values,issues};
}
export function evaluatePrism4(input){
 const {values:v,issues}=snapshot(input);
 const missing=x=>x===undefined || x===null;
 const issue=(field,kind,reason)=>issues.push({field,kind,reason});
 if(missing(v.profile)) issue('profile','missing','Perfil obrigatório.');
 else if(v.profile!==PROFILE) issue('profile','invalid','Perfil incompatível.');
 for(const k of [...CONFIRMATIONS,...BOOLEAN_INPUTS]){
  if(missing(v[k])) issue(k,'missing','Dado não estabelecido; não assumir falso/normal.');
  else if(typeof v[k]!=='boolean') issue(k,'invalid','Booleano obrigatório, sem coerção.');
  else if(CONFIRMATIONS.includes(k) && !v[k]) issue(k,'outside_profile','Critério de preparo/população não confirmado.');
 }
 for(const [k,options] of [['ageBand',Object.keys(AGE_MILLI)],['admissionSource',Object.keys(SOURCE_MILLI)],['collectionWindow',['admission','postintervention']]]){
  if(missing(v[k])) issue(k,'missing','Categoria não estabelecida.');
  else if(typeof v[k]!=='string' || !options.includes(v[k])) issue(k,'invalid','Categoria não reconhecida.');
 }
 if(missing(v.samplingCase)) issue('samplingCase','missing','Caso temporal não estabelecido.');
 else if(v.samplingCase==='unresolved') issue('samplingCase','unresolved_source','A tabela publicada não resolve este caso ou a adjudicação não foi concluída.');
 else if(typeof v.samplingCase!=='string' || !Object.hasOwn(SAMPLING_CASES,v.samplingCase)) issue('samplingCase','invalid','Caso temporal não reconhecido.');
 const validCase=typeof v.samplingCase==='string' && Object.hasOwn(SAMPLING_CASES,v.samplingCase)?SAMPLING_CASES[v.samplingCase]:null;
 if(validCase){
  if(typeof v.ageBand==='string' && Object.hasOwn(AGE_MILLI,v.ageBand) && !validCase.ages.includes(v.ageBand)) issue('samplingCase','inconsistent','Faixa etária incompatível com o caso temporal informado.');
  if(['admission','postintervention'].includes(v.collectionWindow) && v.collectionWindow!==validCase.window) issue('collectionWindow','inconsistent','Janela não corresponde ao caso temporal adjudicado.');
 }
 for(const k of ['neurologicPoints','nonneurologicPoints']){
  const n=v[k];
  if(missing(n)) issue(k,'missing','Subescore externo não estabelecido.');
  else if(typeof n!=='number' || !Number.isInteger(n) || Object.is(n,-0)) issue(k,'invalid','Pontos inteiros canônicos; sem texto, coerção ou zero negativo.');
  else if(k==='neurologicPoints'?!NEURO_VALUES.includes(n):(n<0 || n>58)) issue(k,'invalid','Subescore fora do domínio conservador deste perfil.');
 }
 if(typeof v.cpr24hPrePicu==='boolean' && typeof v.cprHospitalDefinition==='boolean' && v.cpr24hPrePicu!==v.cprHospitalDefinition) issue('cpr24hPrePicu','unresolved_source','As definições temporais de RCP não concordam neste caso; recorte local indisponível.');
 if(v.cancer===true && v.lowRiskPrimarySystem===true) issue('lowRiskPrimarySystem','unresolved_source','Câncer e sistema de baixo risco simultâneos: tabela e calculadora oficial divergem; recorte local indisponível.');
 const status=issues.some(i=>i.kind==='invalid')?'invalid':issues.some(i=>i.kind==='inconsistent')?'inconsistent':issues.some(i=>i.kind==='outside_profile')?'outside_profile':issues.some(i=>i.kind==='unresolved_source')?'unresolved_source':issues.length?'incomplete':'estimated';
 const complete=status==='estimated';
 let contributions=null,logitMilli=null,probability=null;
 if(complete){
  contributions={intercept:-5776,age:AGE_MILLI[v.ageBand],admissionSource:SOURCE_MILLI[v.admissionSource],cpr:v.cpr24hPrePicu?1082:0,cancer:v.cancer?766:0,lowRiskPrimarySystem:v.lowRiskPrimarySystem?-1697:0,neurologic:197*v.neurologicPoints,nonneurologic:163*v.nonneurologicPoints};
  logitMilli=Object.values(contributions).reduce((a,b)=>a+b,0);
  const z=logitMilli/1000;
  probability=z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
 }
 return {profile:PROFILE,status,complete,physiologicTotal:complete?v.neurologicPoints+v.nonneurologicPoints:null,logitMilli,logit:complete?logitMilli/1000:null,probability,percent:complete?100*probability:null,contributionsMilli:contributions,collectionWindow:complete?v.collectionWindow:null,issues,interpretation:complete?LIMITATION:null,limitations:LIMITATION,riskCategory:null,automaticTreatment:null,automaticCareLimitation:null,rawPhysiologyValidated:false,calendarValidated:false};
}
