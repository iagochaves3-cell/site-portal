/** Referência própria: FEAST PET clínico, George2015, Tabela3; dados completos. */
export const PROFILE='feast-pet-2015-clinical-v1';
export const AGE_BANDS=Object.freeze(['2m_to_8m_inclusive','over_8m_under_12y']);
export const CONTEXTS=Object.freeze(['hospital_admission','hdu_admission']);
export const CONFIRMATIONS=Object.freeze(['clinicalContextReviewed','admissionObservationConfirmed','sameChildEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','measurementsValidConfirmed','axillaryTemperatureConfirmed','consciousnessAdjudicatedConfirmed','respiratoryFindingsAdjudicatedConfirmed','pallorPulseAdjudicatedConfirmed']);
const KEYS=new Set(['profile',...CONFIRMATIONS,'ageBand','context','axillaryTemperatureC','heartRateBpm','capillaryRefillSeconds','consciousness','respiratoryDistress','lungCrepitations','severePallor','weakRadialPulse']);
const LIMITATION='FEAST PET clínico (2015): soma de oito componentes da Tabela 3, com dados de admissão completos e recorte local de 2 meses a antes do 12º aniversário. Prognóstico descritivo de mortalidade precoce nos contextos estudados. Não diagnostica sepse/choque nem fornece probabilidade individual ou decisão de fluidoterapia, tratamento ou alta. Zero não prova normalidade ou segurança. Confirmações não verificam fonte, identidade, calendário ou condição clínica atual.';
function snapshot(input){
 const values=Object.create(null),issues=[];
 if(input===null||typeof input!=='object')return{values,issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
 try{const p=Object.getPrototypeOf(input);if(p!==Object.prototype&&p!==null)issues.push({field:'input',kind:'invalid',reason:'Protótipo não admitido.'});}catch{issues.push({field:'input',kind:'invalid',reason:'Falha de protótipo; preservar apenas dados próprios efetivamente capturados.'});}
 let keys;try{keys=Reflect.ownKeys(input);}catch{issues.push({field:'input',kind:'invalid',reason:'Enumeração falhou; dados não capturados permanecem desconhecidos.'});return{values,issues};}
 for(const k of keys){
  if(typeof k!=='string'||!KEYS.has(k)){issues.push({field:'input',kind:'invalid',reason:'Campo não previsto.'});continue;}
  let d;try{d=Object.getOwnPropertyDescriptor(input,k);}catch{issues.push({field:k,kind:'invalid',reason:'Descritor falhou; sem releitura.'});continue;}
  if(!d||!Object.hasOwn(d,'value')){issues.push({field:k,kind:'invalid',reason:'Descritor de dados próprio obrigatório; accessor não invocado.'});continue;}
  values[k]=d.value;
 }
 return{values,issues};
}
const missing=v=>v===null||v===undefined;
const canonical=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&!Object.is(n,-0)&&/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(String(n))&&n>=min&&n<=max;
export function evaluateFeastPet(input){
 const{values:v,issues}=snapshot(input),add=(field,kind,reason)=>issues.push({field,kind,reason});
 if(missing(v.profile))add('profile','missing','Perfil obrigatório.');else if(v.profile!==PROFILE)add('profile','invalid','Perfil incompatível; sem troca automática por PETaL ou outro escore.');
 for(const field of CONFIRMATIONS){if(missing(v[field]))add(field,'missing','Preparo não estabelecido.');else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório.');else if(!v[field])add(field,'outside_profile','Contexto/preparo necessário não estabelecido.');}
 const enumeration=(field,list)=>{if(missing(v[field])){add(field,'missing','Categoria não conhecida.');return false;}if(typeof v[field]!=='string'||!list.includes(v[field])){add(field,'invalid','Categoria não prevista, sem conversão implícita.');return false;}return true;};
 enumeration('ageBand',AGE_BANDS);enumeration('context',CONTEXTS);enumeration('consciousness',['normal','prostrate','coma']);
 const number=(field,min,max)=>{if(missing(v[field])){add(field,'missing','Medida não estabelecida; nunca normal por ausência.');return false;}if(!canonical(v[field],min,max)){add(field,'invalid','Número canônico na unidade e limites técnicos locais; até seis casas, sem coerção ou arredondamento.');return false;}return true;};
 number('axillaryTemperatureC',20,45);const hrOk=number('heartRateBpm',0,350);number('capillaryRefillSeconds',0,30);
 if(hrOk&&v.heartRateBpm===0)add('heartRateBpm','outside_profile','FC zero exige avaliação prioritária, fora deste cálculo; não é ausência de medida nem normalidade.');
 for(const field of ['respiratoryDistress','lungCrepitations','severePallor','weakRadialPulse']){if(missing(v[field]))add(field,'missing','Presença ou ausência deve ser estabelecida.');else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório; não inferir de outro campo.');}
 const urgentFindings=[];
 if(canonical(v.axillaryTemperatureC,20,45)&&v.axillaryTemperatureC<36)urgentFindings.push('reported_admission_hypothermia_below36');
 if(canonical(v.heartRateBpm,0,350)&&(v.heartRateBpm<80||v.heartRateBpm>=220))urgentFindings.push(v.heartRateBpm===0?'reported_zero_heart_rate':'reported_admission_extreme_heart_rate');
 if(canonical(v.capillaryRefillSeconds,0,30)&&v.capillaryRefillSeconds>2)urgentFindings.push('reported_admission_capillary_refill_over2');
 if(v.consciousness==='prostrate'||v.consciousness==='coma')urgentFindings.push('reported_admission_'+v.consciousness);
 if(v.respiratoryDistress===true)urgentFindings.push('reported_admission_respiratory_distress');
 if(v.severePallor===true)urgentFindings.push('reported_admission_severe_pallor');
 if(v.weakRadialPulse===true)urgentFindings.push('reported_admission_weak_radial_pulse');
 const urgencyPreparation=['admissionObservationConfirmed','sameChildEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','measurementsValidConfirmed','axillaryTemperatureConfirmed','consciousnessAdjudicatedConfirmed','respiratoryFindingsAdjudicatedConfirmed','pallorPulseAdjudicatedConfirmed'];
 const reportedUrgencyAssessmentComplete=canonical(v.axillaryTemperatureC,20,45)&&canonical(v.heartRateBpm,0,350)&&canonical(v.capillaryRefillSeconds,0,30)&&['normal','prostrate','coma'].includes(v.consciousness)&&['respiratoryDistress','severePallor','weakRadialPulse'].every(k=>typeof v[k]==='boolean')&&urgencyPreparation.every(k=>v[k]===true);
 const urgentReviewRecommended=urgentFindings.length?true:reportedUrgencyAssessmentComplete?false:null;
 const status=issues.some(x=>x.kind==='invalid')?'invalid':issues.some(x=>x.kind==='outside_profile')?'outside_profile':issues.length?'incomplete':'scored';
 const complete=status==='scored';let components=null,total=null;
 if(complete){components={temperature:v.axillaryTemperatureC<=37?1:0,heartRate:v.heartRateBpm<80||v.heartRateBpm>=220?2:v.heartRateBpm<105?1:0,capillaryRefill:v.capillaryRefillSeconds>=2?1:0,consciousness:v.consciousness==='coma'?2:v.consciousness==='prostrate'?1:0,respiratoryDistress:v.respiratoryDistress?1:0,lungCrepitations:v.lungCrepitations?1:0,severePallor:v.severePallor?1:0,weakPulse:v.weakRadialPulse?1:0};total=Object.values(components).reduce((a,b)=>a+b,0);}
 return{profile:PROFILE,status,complete,totalComplete:complete,total,components,issues,urgentFindings,reportedUrgencyAssessmentComplete,urgentReviewRecommended,interpretation:complete?LIMITATION:null,limitations:LIMITATION,individualProbability:null,riskBand:null,automaticDisposition:null,automaticTreatment:null,calendarValidated:false,sourceDataValidated:false};
}
