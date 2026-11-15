/** Referência de pesquisa, não adaptador clínico. Critérios adjudicados; ver contract.json. */
export const PROFILE = 'cisne-2015-adjudicated-finite2012-v1';
export const CONFIRMATIONS = Object.freeze(['adultConfirmed','solidTumorConfirmed','mildModerateChemotherapyConfirmed','outpatientOnsetConfirmed','febrileNeutropeniaConfirmed','initialAssessmentConfirmed','initialWindowConfirmed','initialStabilityConfirmed','currentStabilityConfirmed','noOtherAdmissionIndicationConfirmed','sameEpisodeInitialDataConfirmed','professionalAdjudicationConfirmed','initialGlucoseReviewed','diabetesStatusReviewed','alternativeGlucoseCausesReviewed','finite2012PreparationConfirmed']);
export const WEIGHTS = Object.freeze({ecogGe2:2,copd:1,chronicCardiovascularDisease:1,oralMucositisGe2:1,monocytesLt200:1,stressHyperglycemia:2});
const CRITERIA=Object.keys(WEIGHTS);
const KEYS=new Set(['profile',...CONFIRMATIONS,...CRITERIA]);
const WARNING='Neutropenia febril requer avaliação clínica urgente. Não aguarde esta soma para obter assistência. O CISNE não determina alta, antibiótico ou conduta automática.';
function snapshot(input) {
  const values=Object.create(null), issues=[];
  if(input===null || typeof input!=='object') return {values,issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
  try {
    const proto=Object.getPrototypeOf(input);
    if(proto!==Object.prototype && proto!==null) issues.push({field:'input',kind:'invalid',reason:'Protótipo não admitido.'});
    const descriptors=Object.getOwnPropertyDescriptors(input);
    for(const key of Reflect.ownKeys(descriptors)) {
      const d=descriptors[key];
      if(typeof key!=='string' || !KEYS.has(key)) {issues.push({field:'input',kind:'invalid',reason:'Campo não previsto.'});continue;}
      if(!Object.hasOwn(d,'value')) {issues.push({field:key,kind:'invalid',reason:'Accessor recusado sem invocação.'});continue;}
      values[key]=d.value;
    }
  } catch {issues.push({field:'input',kind:'invalid',reason:'Falha na leitura de descritores.'});}
  return {values,issues};
}
export function evaluateCisne(input) {
  const {values:v,issues}=snapshot(input);
  const missing=x=>x===null || x===undefined;
  if(missing(v.profile)) issues.push({field:'profile',kind:'missing',reason:'Perfil ausente.'});
  else if(v.profile!==PROFILE) issues.push({field:'profile',kind:'invalid',reason:'Perfil incompatível.'});
  for(const key of [...CONFIRMATIONS,...CRITERIA]) {
    if(missing(v[key])) issues.push({field:key,kind:'missing',reason:'Dado não confirmado.'});
    else if(typeof v[key]!=='boolean') issues.push({field:key,kind:'invalid',reason:'Exige booleano; não há coerção.'});
    else if(CONFIRMATIONS.includes(key) && v[key]===false) issues.push({field:key,kind:'outside_profile',reason:'Preparo ou elegibilidade não satisfeitos.'});
  }
  const unstable=v.initialStabilityConfirmed===false || v.currentStabilityConfirmed===false;
  const status=issues.some(x=>x.kind==='invalid')?'invalid':issues.some(x=>x.kind==='outside_profile')?'outside_profile':issues.length?'incomplete':'scored';
  const complete=status==='scored';
  const total=complete?CRITERIA.reduce((s,key)=>s+(v[key]?WEIGHTS[key]:0),0):null;
  const riskClass=total===null?null:total===0?'I':total<=2?'II':'III';
  return {profile:PROFILE,status,complete,total,riskClass,components:complete?Object.fromEntries(CRITERIA.map(key=>[key,v[key]?WEIGHTS[key]:0])):null,issues,clinicalAlert:{priority:unstable?'instability':'urgent_assessment',message:unstable?'Instabilidade informada: este perfil não se aplica; avaliação clínica imediata é prioritária. '+WARNING:WARNING},interpretation:complete?'Classe '+riskClass+' pelo CISNE. Risco de complicações não é nulo; decisão assistencial depende de avaliação e critérios adicionais.':null,individualProbability:null,automaticDisposition:null};
}
