/** Referência autoral: RISC-Malawi MUAC2016, pontuador literal restrito de admissão. */
export const PROFILE='risc-malawi-muac-2016-literal-v1';
export const CONFIRMATIONS=Object.freeze(['hospitalizedPneumoniaConfirmed','admissionAssessmentConfirmed','samePatientEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','spo2RoomAirMeasurementConfirmed','spo2MeasurementValidConfirmed','muacMeasurementValidConfirmed','wheezeAssessedConfirmed','unconsciousnessAdjudicatedConfirmed']);
const KEYS=new Set(['profile',...CONFIRMATIONS,'ageCompletedMonths','spo2Percent','muacCm','sex','wheezePresent','unconscious']);
const LIMITATION='Soma RISC-Malawi MUAC2016 em recorte local literal, completo e sem imputação. Prognóstico histórico de mortalidade durante a hospitalização por pneumonia; não diagnostica etiologia nem determina desfecho individual, alta, antibiótico ou suporte. Limiares5/8 são referências históricas, sem garantia de segurança abaixo deles. Não há probabilidade individual neste perfil.';
function snapshot(input){
 const values=Object.create(null),issues=[];
 if(input===null || typeof input!=='object')return{values,issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
 try{
  const proto=Object.getPrototypeOf(input);if(proto!==Object.prototype && proto!==null)issues.push({field:'input',kind:'invalid',reason:'Protótipo não admitido.'});
 }catch{issues.push({field:'input',kind:'invalid',reason:'Falha ao conferir protótipo; não impede preservar dados próprios efetivamente capturados.'});}
 let keys;
 try{keys=Reflect.ownKeys(input);}catch{issues.push({field:'input',kind:'invalid',reason:'Falha de enumeração; achados não capturados permanecem desconhecidos.'});return{values,issues};}
 for(const k of keys){
  if(typeof k!=='string' || !KEYS.has(k)){issues.push({field:'input',kind:'invalid',reason:'Campo não previsto.'});continue;}
  let d;
  try{d=Object.getOwnPropertyDescriptor(input,k);}catch{issues.push({field:k,kind:'invalid',reason:'Falha no descritor contida; sem releitura.'});continue;}
  if(!d){issues.push({field:k,kind:'invalid',reason:'Descritor próprio não estabelecido após enumeração.'});continue;}
  if(!Object.hasOwn(d,'value')){issues.push({field:k,kind:'invalid',reason:'Accessor recusado sem invocação.'});continue;}
  values[k]=d.value;
 }
 return{values,issues};
}
export function evaluateRiscMalawi(input){
 const{values:v,issues}=snapshot(input),missing=x=>x===null||x===undefined;
 const add=(field,kind,reason)=>issues.push({field,kind,reason});
 const canonical=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&!Object.is(n,-0)&&/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(String(n))&&n>=min&&n<=max;
 const numeric=(field,min,max)=>{
  if(missing(v[field])){add(field,'missing','Medida não estabelecida; ausência não é normalidade.');return false;}
  if(!canonical(v[field],min,max)){add(field,'invalid','Número canônico na unidade/faixa local, até seis casas, sem coerção.');return false;}return true;
 };
 if(missing(v.profile))add('profile','missing','Perfil obrigatório.');else if(v.profile!==PROFILE)add('profile','invalid','Perfil incompatível.');
 for(const k of CONFIRMATIONS){
  if(missing(v[k]))add(k,'missing','Preparo não confirmado.');else if(typeof v[k]!=='boolean')add(k,'invalid','Booleano obrigatório.');else if(!v[k])add(k,'outside_profile','Critério local de preparo/contexto não confirmado.');
 }
 if(missing(v.ageCompletedMonths))add('ageCompletedMonths','missing','Idade na admissão não estabelecida.');
 else if(typeof v.ageCompletedMonths!=='number'||!Number.isSafeInteger(v.ageCompletedMonths)||Object.is(v.ageCompletedMonths,-0)||v.ageCompletedMonths<0)add('ageCompletedMonths','invalid','Meses completos inteiros, sem converter mês em30dias nem arredondar.');
 else if(v.ageCompletedMonths<2||v.ageCompletedMonths>59)add('ageCompletedMonths','outside_profile','Modelo para2–59meses na admissão.');
 if(missing(v.sex))add('sex','missing','Categoria registrada não estabelecida.');else if(v.sex!=='male'&&v.sex!=='female')add('sex','invalid','Categoria do modelo não reconhecida; não inferir.');
 for(const k of ['wheezePresent','unconscious']){
  if(missing(v[k]))add(k,'missing','Presença ou ausência não estabelecida.');else if(typeof v[k]!=='boolean')add(k,'invalid','Booleano obrigatório.');
 }
 let oxygen=null,nutrition=null;
 if(numeric('spo2Percent',0,100)){
  if(v.spo2Percent<90)oxygen=7;else if(v.spo2Percent<=92)oxygen=2;else if(v.spo2Percent>=93)oxygen=0;
  else add('spo2Percent','unresolved_source','Valor entre92 e93% sem ramo literal; não arredondar.');
 }
 if(numeric('muacCm',0.000001,50)){
  if(v.muacCm<11.5)nutrition=7;else if(v.muacCm<13.5)nutrition=3;else if(v.muacCm>13.5)nutrition=0;
  else add('muacCm','unresolved_source','MUAC13,5cm: sobreposição na tabela e divergência com método; sem escolha automática.');
 }
 // Achados informados não desaparecem porque outro campo ou a elegibilidade está incompleto.
 const urgentFindings=[];
 if(canonical(v.spo2Percent,0,100)&&v.spo2Percent<90)urgentFindings.push('reported_spo2_below90');
 if(v.unconscious===true)urgentFindings.push('reported_unconsciousness');
 const urgencyPreparation=['admissionAssessmentConfirmed','samePatientEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','spo2RoomAirMeasurementConfirmed','spo2MeasurementValidConfirmed','unconsciousnessAdjudicatedConfirmed'];
 const reportedUrgencyAssessmentComplete=canonical(v.spo2Percent,0,100)&&typeof v.unconscious==='boolean'&&urgencyPreparation.every(k=>v[k]===true);
 const urgentReviewRecommended=urgentFindings.length>0?true:reportedUrgencyAssessmentComplete?false:null;
 const status=issues.some(i=>i.kind==='invalid')?'invalid':issues.some(i=>i.kind==='outside_profile')?'outside_profile':issues.some(i=>i.kind==='unresolved_source')?'unresolved_source':issues.length?'incomplete':'scored';
 const complete=status==='scored';let components=null,total=null,thresholds=null;
 if(complete){
  components={oxygen,nutrition,sex:v.sex==='female'?1:0,wheeze:v.wheezePresent?-2:0,unconsciousness:v.unconscious?8:0};
  total=Object.values(components).reduce((a,b)=>a+b,0);
  thresholds={atLeast5:total>=5,atLeast8:total>=8};
 }
 return{profile:PROFILE,status,complete,totalComplete:complete,total,components,thresholds,issues,urgentFindings,reportedUrgencyAssessmentComplete,urgentReviewRecommended,interpretation:complete?LIMITATION:null,limitations:LIMITATION,individualProbability:null,riskCategory:null,automaticDisposition:null,automaticTreatment:null,calendarValidated:false,sourceDataValidated:false};
}
