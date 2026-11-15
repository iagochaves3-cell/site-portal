/** Referência autoral de pesquisa: perfil literal restrito, avaliação pontual. */
export const PROFILE='wpcdai-2012-naspghan2014-literal-point-v1';
export const CONFIRMATIONS=Object.freeze(['crohnDiagnosisEstablished','professionalAdjudicationConfirmed','sameAssessmentConfirmed','historyPast7DaysConfirmed','labsClinicallyContemporaneousConfirmed','weightReferenceKnownConfirmed','weightReferenceIntervalReviewed','clinicalCriteriaUnambiguousConfirmed','noMissingNormalImputationConfirmed']);
export const CATEGORY_POINTS=Object.freeze({
 pain:Object.freeze({none:0,mild:10,'moderate-severe':20}),
 function:Object.freeze({well:0,'occasional-limitation':10,'frequent-limitation':20}),
 stools:Object.freeze({lowest:0,intermediate:7.5,highest:15}),
 perirectal:Object.freeze({none:0,indolent:7.5,active:15})
});
const MODES=['gain','voluntary-stable','involuntary-stable','voluntary-loss','involuntary-loss'];
const KEYS=new Set(['profile',...CONFIRMATIONS,'ageYears',...Object.keys(CATEGORY_POINTS),'eimPresent','esrMmH','albuminGdL','weightChange','weightLossPercent']);
const LIMITATION='Atividade clínica pelo índice wPCDAI, perfil literal restrito com cortes de 2012. Não diagnostica Crohn, não confirma cicatrização intestinal e não determina tratamento. Janelas, referência ponderal e categorias clínicas são adjudicadas por profissional; o programa não certifica o prontuário. Sem resposta longitudinal neste perfil.';
function snapshot(input){
 const values=Object.create(null),issues=[];
 if(input===null || typeof input!=='object') return {values,issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
 try{
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
export function evaluateWpcdai(input){
 const {values:v,issues}=snapshot(input),missing=n=>n===null || n===undefined;
 const add=(field,kind,reason)=>issues.push({field,kind,reason});
 const numeric=(field,min,max,maxExclusive=false)=>{
  const n=v[field];
  if(missing(n)){add(field,'missing','Medida não estabelecida.');return false;}
  if(typeof n!=='number' || !Number.isFinite(n) || Object.is(n,-0) || !/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(String(n)) || n<min || (maxExclusive?n>=max:n>max)){
   add(field,'invalid','Número canônico na unidade/faixa local, até seis casas decimais; sem coerção.');return false;
  }
  return true;
 };
 if(missing(v.profile)) add('profile','missing','Perfil obrigatório.');
 else if(v.profile!==PROFILE) add('profile','invalid','Perfil incompatível.');
 for(const k of CONFIRMATIONS){
  if(missing(v[k])) add(k,'missing','Confirmação não estabelecida; ausência não é normalidade.');
  else if(typeof v[k]!=='boolean') add(k,'invalid','Booleano obrigatório.');
  else if(!v[k]) add(k,'outside_profile','Preparo/escopo não confirmado para este recorte local.');
 }
 if(numeric('ageYears',0,120) && (v.ageYears<4 || v.ageYears>=18)) add('ageYears','outside_profile','Recorte operacional de 4 a menos de 18 anos na avaliação; não é contraindicação universal da escala.');
 for(const [k,m] of Object.entries(CATEGORY_POINTS)){
  if(missing(v[k])) add(k,'missing','Categoria clínica não estabelecida.');
  else if(typeof v[k]!=='string' || !Object.hasOwn(m,v[k])) add(k,'invalid','Categoria desconhecida; não são aceitos pontos livres.');
 }
 if(missing(v.eimPresent)) add('eimPresent','missing','Presença ou ausência de manifestações qualificadas não estabelecida.');
 else if(typeof v.eimPresent!=='boolean') add('eimPresent','invalid','Booleano obrigatório.');
 let esr=null,albumin=null,weight=null;
 if(numeric('esrMmH',0,300)) esr=v.esrMmH<20?0:v.esrMmH<=50?7.5:15;
 if(numeric('albuminGdL',0,10)){
  if(v.albuminGdL>=3.5) albumin=0;
  else if(v.albuminGdL>=3.1 && v.albuminGdL<=3.4) albumin=10;
  else if(v.albuminGdL<=3.0) albumin=20;
  else add('albuminGdL','unresolved_source','Valor no intervalo sem ramo publicado; não arredondar nem atribuir categoria externa.');
 }
 if(missing(v.weightChange)) add('weightChange','missing','Evolução ponderal não estabelecida.');
 else if(typeof v.weightChange!=='string' || !MODES.includes(v.weightChange)) add('weightChange','invalid','Evolução ponderal não reconhecida.');
 else if(v.weightChange.endsWith('-loss')){
  if(numeric('weightLossPercent',0,100,true)){
   const p=v.weightLossPercent;
   if(p===0) add('weightLossPercent','inconsistent','Perda declarada exige percentual positivo.');
   else if(v.weightChange==='voluntary-loss'){
    if(p>=10) add('weightLossPercent','unresolved_source','Perda voluntária de pelo menos 10% conflita entre ramos; sem prioridade inventada.');
    else weight=0;
   }else if(p>=1 && p<=9) weight=5;
   else if(p>=10) weight=10;
   else add('weightLossPercent','unresolved_source','Perda involuntária sem ramo literal; não arredondar.');
  }
 }else{
  if(!missing(v.weightLossPercent)) add('weightLossPercent','inconsistent','Percentual de perda não aplicável ao estado informado; não conservar valor residual.');
  weight=v.weightChange==='involuntary-stable'?5:0;
 }
 const status=issues.some(i=>i.kind==='invalid')?'invalid':issues.some(i=>i.kind==='inconsistent')?'inconsistent':issues.some(i=>i.kind==='outside_profile')?'outside_profile':issues.some(i=>i.kind==='unresolved_source')?'unresolved_source':issues.length?'incomplete':'scored';
 const complete=status==='scored';let components=null,total=null,classification=null;
 if(complete){
  components={pain:CATEGORY_POINTS.pain[v.pain],function:CATEGORY_POINTS.function[v.function],stools:CATEGORY_POINTS.stools[v.stools],esr,albumin,weight,perirectal:CATEGORY_POINTS.perirectal[v.perirectal],eim:v.eimPresent?10:0};
  total=Object.values(components).reduce((a,b)=>a+b,0);
  classification=total<12.5?'index-remission':total<=40?'mild':total<=57.5?'moderate':'severe';
 }
 return {profile:PROFILE,status,complete,totalComplete:complete,classificationAvailable:complete,total,components,classification,classificationProfile:'Turner2012-table5-strict',issues,interpretation:complete?LIMITATION:null,limitations:LIMITATION,endoscopicHealing:null,diagnosticProbability:null,automaticTreatment:null,response:null,calendarValidated:false,sourceDataValidated:false};
}
