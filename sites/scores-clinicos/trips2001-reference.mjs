/** Own research reference for the literal 2001 TRIPS profile.
 * Not a site adapter, clinical validation, or continuous coverage claim.
 * No probability, diagnosis, treatment recommendation, or automatic comparison.
 */
export const TRIPS_PROFILE = 'TRIPS-2001-literal-restricted-v1';
const fields = new Set(['neonatalInterhospitalContextConfirmed','observationMoment','originMinutesAfterTeamArrival','destinationImmediateConfirmed','clinicalMeasurementsConfirmed','temperatureC','systolicMmHg','apnea','gasping','intubated','respiratoryRate','spo2Percent','responseCategory','responseAdjudicated']);
const absent = x => x === undefined || x === null;
const finite = x => typeof x === 'number' && Number.isFinite(x);
function snapshot(input, errors) {
  const out = Object.create(null);
  if (input === null || typeof input !== 'object' || Array.isArray(input)) { errors.push({field:'input',code:'DATA_OBJECT_REQUIRED'}); return out; }
  try {
    const proto = Object.getPrototypeOf(input);
    if (proto !== Object.prototype && proto !== null) errors.push({field:'input',code:'CUSTOM_PROTOTYPE'});
    const ds = Object.getOwnPropertyDescriptors(input);
    for (const k of Reflect.ownKeys(ds)) {
      const d=ds[k];
      if (typeof k !== 'string' || !fields.has(k)) { errors.push({field:'input',code:'UNRECOGNIZED_FIELD'}); continue; }
      if (!Object.prototype.hasOwnProperty.call(d,'value')) { errors.push({field:k,code:'ACCESSOR_REJECTED'}); continue; }
      out[k]=d.value;
    }
  } catch { errors.push({field:'input',code:'UNREADABLE_DATA_OBJECT'}); }
  return out;
}
function evaluate(input) {
  const errors=[];
  const x=snapshot(input,errors);
  const components={temperature:null,respiratory:null,systolic:null,response:null};
  const issue=(field,code)=>errors.push({field,code});
  const trueRequired=k=> { if(x[k]!==true)issue(k,absent(x[k])?'CONFIRMATION_MISSING':'CONFIRMATION_NOT_TRUE'); };
  trueRequired('neonatalInterhospitalContextConfirmed');
  trueRequired('clinicalMeasurementsConfirmed');
  if(x.observationMoment==='origin_team_arrival'){
    if(!finite(x.originMinutesAfterTeamArrival))issue('originMinutesAfterTeamArrival','FINITE_NUMBER_REQUIRED');
    else if(x.originMinutesAfterTeamArrival<0||x.originMinutesAfterTeamArrival>15)issue('originMinutesAfterTeamArrival','OUTSIDE_ORIGINAL_ORIGIN_WINDOW');
    if(!absent(x.destinationImmediateConfirmed))issue('destinationImmediateConfirmed','INACTIVE_METADATA_PRESENT');
  }else if(x.observationMoment==='destination_arrival'){
    trueRequired('destinationImmediateConfirmed');
    if(!absent(x.originMinutesAfterTeamArrival))issue('originMinutesAfterTeamArrival','INACTIVE_METADATA_PRESENT');
  }else issue('observationMoment','MOMENT_REQUIRED');
  if(!finite(x.temperatureC))issue('temperatureC','FINITE_NUMBER_REQUIRED');
  else if(x.temperatureC<=-273.15)issue('temperatureC','IMPOSSIBLE_TEMPERATURE');
  else if(x.temperatureC<36.1||x.temperatureC>37.6)components.temperature=8;
  else if((x.temperatureC>=36.1&&x.temperatureC<=36.5)||(x.temperatureC>=37.2&&x.temperatureC<=37.6))components.temperature=1;
  else if(x.temperatureC>=36.6&&x.temperatureC<=37.1)components.temperature=0;
  else issue('temperatureC','LITERAL_TEMPERATURE_GAP');
  if(!finite(x.systolicMmHg))issue('systolicMmHg','FINITE_NUMBER_REQUIRED');
  else if(x.systolicMmHg<0)issue('systolicMmHg','NEGATIVE_PRESSURE');
  else components.systolic=x.systolicMmHg<20?26:x.systolicMmHg<=40?16:0;
  const severeKeys=['apnea','gasping','intubated'];
  for(const k of severeKeys)if(!absent(x[k])&&typeof x[k]!=='boolean')issue(k,'BOOLEAN_REQUIRED');
  // Present but malformed residual data remains an error even in a severe branch.
  let rrValid=absent(x.respiratoryRate),spValid=absent(x.spo2Percent);
  if(!absent(x.respiratoryRate)){
    rrValid=finite(x.respiratoryRate)&&x.respiratoryRate>=0;
    if(!rrValid)issue('respiratoryRate','NONNEGATIVE_FINITE_NUMBER_REQUIRED');
  }
  if(!absent(x.spo2Percent)){
    spValid=finite(x.spo2Percent)&&x.spo2Percent>=0&&x.spo2Percent<=100;
    if(!spValid)issue('spo2Percent','PERCENT_0_100_REQUIRED');
  }
  if(severeKeys.some(k=>x[k]===true))components.respiratory=14;
  else if(severeKeys.every(k=>x[k]===false)){
    if(absent(x.respiratoryRate))issue('respiratoryRate','REQUIRED_WITHOUT_SEVERE');
    if(absent(x.spo2Percent))issue('spo2Percent','REQUIRED_WITHOUT_SEVERE');
    if(rrValid&&spValid&&!absent(x.respiratoryRate)&&!absent(x.spo2Percent)){
      if(x.respiratoryRate===0)issue('respiratoryRate','ZERO_RATE_CONFLICTS_WITH_CONFIRMED_NO_APNEA');
      else if(x.respiratoryRate>60||x.spo2Percent<85)components.respiratory=5;
      else if(x.respiratoryRate<60&&x.spo2Percent>85)components.respiratory=0;
      else issue('respiratoryRate','LITERAL_RESPIRATORY_GAP');
    }
  }else issue('apnea','SEVERE_PRESENCE_OR_ALL_ABSENT_MUST_BE_CONFIRMED');
  if(x.responseAdjudicated!==true)issue('responseAdjudicated','PROFESSIONAL_ADJUDICATION_REQUIRED');
  else if(x.responseCategory==='vigorous')components.response=0;
  else if(x.responseCategory==='lethargic')components.response=6;
  else if(x.responseCategory==='absent_seizure_relaxant')components.response=17;
  else issue('responseCategory','ORIGINAL_RESPONSE_CATEGORY_REQUIRED');
  const complete=errors.length===0&&Object.values(components).every(Number.isInteger);
  return {profile:TRIPS_PROFILE,status:complete?'scored':'incomplete',complete,total:complete?Object.values(components).reduce((a,b)=>a+b,0):null,components,errors,
    limitations:['Literal 2001 profile with explicit gaps.','Manual clinical preparation and response adjudication required.','No calibrated individual mortality probability or transport decision.'],
    interpretation:complete?'Soma dos quatro domínios da observação confirmada; não certifica segurança do transporte.':'Sem total: observação incompleta, em lacuna ou preparo não confirmado.'};
}
export function evaluateTrips2001(input) {
  try{return evaluate(input);}catch{return {profile:TRIPS_PROFILE,status:'incomplete',complete:false,total:null,components:{temperature:null,respiratory:null,systolic:null,response:null},errors:[{field:'input',code:'UNEXPECTED_INPUT_FAILURE'}],limitations:['Research reference only.'],interpretation:'Sem total: entrada não processável.'};}
}
