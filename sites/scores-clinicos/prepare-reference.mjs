/** Referência própria: PREPARE mortalidade2022, Tabela3 com SpO₂, recorte literal. */
export const PROFILE='prepare-pneumonia-mortality-2022-table3-literal-v1';
export const CONFIRMATIONS=Object.freeze(['hospitalizedPneumoniaConfirmed','baselineAssessmentConfirmed','samePatientEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','measurementsValidConfirmed','spo2RoomAirConfirmed','wazWhoWeightForAgeConfirmed','wazDemographicsConsistentConfirmed','clinicalSignsAdjudicatedConfirmed']);
const KEYS=new Set(['profile',...CONFIRMATIONS,'ageCompletedMonths','sex','weightForAgeZ','temperatureC','respiratoryRate','lowerChestIndrawing','decreasedConsciousness','convulsions','cyanosis','spo2Percent']);
const LIMITATION='PREPARE mortalidade2022 com SpO₂: soma literal da Tabela3, dados basais hospitalares completos, recorte local sem imputação. Limiar≥5 é referência prognóstica histórica; valores menores não excluem morte ou deterioração. Não diagnostica pneumonia/etiologia, não calcula probabilidade individual e não determina tratamento, suporte ou alta. Confirmações não verificam prontuário, identidade, calendário nem estado atual.';
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
const canonical=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&!Object.is(n,-0)&&/^-?(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(String(n))&&n>=min&&n<=max;
export function evaluatePrepare(input){
 const{values:v,issues}=snapshot(input),add=(field,kind,reason)=>issues.push({field,kind,reason});
 if(missing(v.profile))add('profile','missing','Perfil obrigatório.');else if(v.profile!==PROFILE)add('profile','invalid','Perfil incompatível; sem troca automática de versão.');
 for(const field of CONFIRMATIONS){if(missing(v[field]))add(field,'missing','Preparo não confirmado.');else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório.');else if(!v[field])add(field,'outside_profile','Contexto/preparo local não estabelecido.');}
 const number=(field,min,max,integer=false)=>{if(missing(v[field])){add(field,'missing','Dado não estabelecido; ausência nunca normal.');return false;}if(!canonical(v[field],min,max)){add(field,'invalid','Número canônico na unidade e limites técnicos locais; até seis casas, sem coerção.');return false;}if(integer&&!Number.isInteger(v[field])){add(field,'outside_profile','Inteiro registrado obrigatório neste recorte; não arredondar.');return false;}return true;};
 const ageOk=number('ageCompletedMonths',0,216,true);
 if(ageOk&&(v.ageCompletedMonths<2||v.ageCompletedMonths>59))add('ageCompletedMonths','outside_profile','População de2–59meses completos na avaliação basal.');
 if(missing(v.sex))add('sex','missing','Categoria registrada não estabelecida.');else if(v.sex!=='male'&&v.sex!=='female')add('sex','invalid','Categoria do modelo não reconhecida; não inferir.');
 for(const field of ['lowerChestIndrawing','decreasedConsciousness','convulsions','cyanosis']){if(missing(v[field]))add(field,'missing','Presença ou ausência deve ser conhecida, mesmo quando a parcela é zero.');else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório.');}
 number('weightForAgeZ',-10,10);
 const tempOk=number('temperatureC',20,45),rrOk=number('respiratoryRate',0,200,true),spoOk=number('spo2Percent',0,100);
 if(rrOk&&v.respiratoryRate===0)add('respiratoryRate','outside_profile','FRzero exige revisão prioritária; não tratada como respiração normal.');
 if(tempOk&&v.temperatureC>37.9&&v.temperatureC<=38)add('temperatureC','unresolved_source','Tabela3:37,9<T≤38 sem ramo inequívoco; não completar pelo coeficiente zero nem arredondar.');
 if(spoOk&&v.spo2Percent>92&&v.spo2Percent<93)add('spo2Percent','unresolved_source','SpO₂entre92e93 sem ramo literal; não arredondar ou preencher por categoria adjacente.');
 const urgentFindings=[];
 if(canonical(v.spo2Percent,0,100)&&v.spo2Percent<90)urgentFindings.push('reported_baseline_spo2_below90');
 if(canonical(v.temperatureC,20,45)&&v.temperatureC<35.5)urgentFindings.push('reported_baseline_hypothermia');
 if(v.decreasedConsciousness===true)urgentFindings.push('reported_baseline_decreased_consciousness');
 if(v.convulsions===true)urgentFindings.push('reported_baseline_convulsions');
 if(v.cyanosis===true)urgentFindings.push('reported_baseline_cyanosis');
 if(canonical(v.respiratoryRate,0,200)&&v.respiratoryRate===0)urgentFindings.push('reported_zero_respiratory_rate');
 const urgencyPreparation=['baselineAssessmentConfirmed','samePatientEpisodeConfirmed','professionalAdjudicationConfirmed','noMissingImputationConfirmed','measurementsValidConfirmed','spo2RoomAirConfirmed','clinicalSignsAdjudicatedConfirmed'];
 const reportedUrgencyAssessmentComplete=canonical(v.spo2Percent,0,100)&&canonical(v.temperatureC,20,45)&&canonical(v.respiratoryRate,0,200)&&Number.isInteger(v.respiratoryRate)&&['decreasedConsciousness','convulsions','cyanosis'].every(k=>typeof v[k]==='boolean')&&urgencyPreparation.every(k=>v[k]===true);
 const urgentReviewRecommended=urgentFindings.length?true:reportedUrgencyAssessmentComplete?false:null;
 const status=issues.some(x=>x.kind==='invalid')?'invalid':issues.some(x=>x.kind==='outside_profile')?'outside_profile':issues.some(x=>x.kind==='unresolved_source')?'unresolved_source':issues.length?'incomplete':'scored';
 const complete=status==='scored';let components=null,total=null,atLeast5=null,respiratoryReference=null;
 if(complete){
  respiratoryReference=v.ageCompletedMonths<=11?50:40;
  components={age:v.ageCompletedMonths<=5?2:v.ageCompletedMonths<=11?1:0,sex:v.sex==='female'?1:0,weightForAge:v.weightForAgeZ< -3?3:v.weightForAgeZ<= -2?2:0,temperature:v.temperatureC<35.5?3:0,respiratoryRate:v.respiratoryRate>=respiratoryReference+20?1:0,lowerChestIndrawing:0,consciousness:v.decreasedConsciousness?1:0,convulsions:v.convulsions?2:0,cyanosis:v.cyanosis?2:0,oxygenation:v.spo2Percent<90?2:0};
  total=Object.values(components).reduce((a,b)=>a+b,0);atLeast5=total>=5;
 }
 return{profile:PROFILE,status,complete,totalComplete:complete,total,components,atLeast5,respiratoryReference,issues,urgentFindings,reportedUrgencyAssessmentComplete,urgentReviewRecommended,interpretation:complete?LIMITATION:null,limitations:LIMITATION,individualProbability:null,automaticDisposition:null,automaticTreatment:null,calendarValidated:false,sourceDataValidated:false};
}
