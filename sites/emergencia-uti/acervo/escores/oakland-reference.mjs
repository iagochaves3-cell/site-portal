/** Referência própria: Oakland completo, tabela BSG 2019; preparo literal local. */
export const PROFILE='oakland-complete-bsg2019-literal-v1';
export const CONFIRMATIONS=Object.freeze(['acuteLowerGiBleedingConfirmed','initialAssessmentConfirmed','samePatientEpisodeConfirmed','professionalReviewConfirmed','measurementsValidConfirmed','rectalExamAssessedConfirmed','preTransfusionHemostasisValuesConfirmed','noMissingImputationConfirmed']);
export const INTERPRETATION_FIELDS=Object.freeze(['currentClinicalReviewConfirmed','hemodynamicallyStable','bleedingSelfLimited','noOtherAdmissionIndication','noAdverseOutcomeYet']);
const KEYS=new Set(['profile',...CONFIRMATIONS,...INTERPRETATION_FIELDS,'ageCompletedYears','sex','previousLgibAdmission','bloodOnRectalExam','heartRateBpm','systolicBpMmHg','hemoglobinValue','hemoglobinUnit']);
const LIMITATION='Oakland completo: soma descritiva de sete domínios iniciais, tabela BSG2019, preparo local sem imputação. O limiar ≤8 só apoia avaliação profissional no contexto apropriado; não autoriza alta, não exclui doença grave, não fornece probabilidade individual e não prescreve tratamento. Dados e metadados são informados, não verificados em prontuário; não atrasar ressuscitação para preencher o índice.';
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
function canonical(n,min,max){return typeof n==='number'&&Number.isFinite(n)&&!Object.is(n,-0)&&/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(String(n))&&n>=min&&n<=max;}
function exactGl(value,unit){
 if(unit==='g/L')return Number.isInteger(value)?value:null;
 const [a,b='']=String(value).split('.'),den=10n**BigInt(b.length),num=BigInt(a+b)*10n;
 return num%den===0n?Number(num/den):null;
}
export function evaluateOakland(input){
 const {values:v,issues}=snapshot(input),contextIssues=[];
 const add=(field,kind,reason)=>issues.push({field,kind,reason});
 if(missing(v.profile))add('profile','missing','Perfil obrigatório.');else if(v.profile!==PROFILE)add('profile','invalid','Perfil incompatível.');
 for(const field of CONFIRMATIONS){
  if(missing(v[field]))add(field,'missing','Preparo não confirmado; não assumir normalidade.');
  else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório.');
  else if(!v[field])add(field,'outside_profile','Preparo/contexto obrigatório não estabelecido.');
 }
 for(const field of INTERPRETATION_FIELDS){
  if(missing(v[field]))contextIssues.push({field,kind:'unknown',reason:'Contexto do limiar não estabelecido.'});
  else if(typeof v[field]!=='boolean')add(field,'invalid','Metadado presente deve ser booleano, null ou ausente.');
  else if(!v[field])contextIssues.push({field,kind:'unavailable',reason:'Condição para interpretação favorável não satisfeita.'});
 }
 const number=(field,min,max,integer=true)=>{
  if(missing(v[field])){add(field,'missing','Dado não estabelecido.');return false;}
  if(!canonical(v[field],min,max)){add(field,'invalid','Número na unidade e limites técnicos locais, sem coerção.');return false;}
  if(integer&&!Number.isInteger(v[field])){add(field,'outside_profile','Recorte de valores inteiros registrados; não arredondar medida.');return false;}return true;
 };
 const ageOk=number('ageCompletedYears',0,130);
 if(ageOk&&v.ageCompletedYears<18)add('ageCompletedYears','outside_profile','Idade adulta ≥18 neste produto; recorte local, não limite universal da pesquisa.');
 if(missing(v.sex))add('sex','missing','Categoria registrada não estabelecida.');else if(v.sex!=='male'&&v.sex!=='female')add('sex','invalid','Categoria do modelo não reconhecida; não inferir.');
 for(const field of ['previousLgibAdmission','bloodOnRectalExam']){
  if(missing(v[field]))add(field,'missing','Presença ou ausência não estabelecida.');else if(typeof v[field]!=='boolean')add(field,'invalid','Booleano obrigatório.');
 }
 const hrOk=number('heartRateBpm',1,300),bpOk=number('systolicBpMmHg',1,300);
 let hbGl=null;
 const unitOk=v.hemoglobinUnit==='g/L'||v.hemoglobinUnit==='g/dL';
 if(missing(v.hemoglobinUnit))add('hemoglobinUnit','missing','Unidade obrigatória.');else if(!unitOk)add('hemoglobinUnit','invalid','Unidade deve ser g/L ou g/dL.');
 if(missing(v.hemoglobinValue))add('hemoglobinValue','missing','Hemoglobina não medida não é normalidade.');
 else if(!canonical(v.hemoglobinValue,0.000001,unitOk&&v.hemoglobinUnit==='g/dL'?30:300))add('hemoglobinValue','invalid','Número positivo, até seis casas e teto técnico local; conferir unidade.');
 else if(unitOk){hbGl=exactGl(v.hemoglobinValue,v.hemoglobinUnit);if(hbGl===null)add('hemoglobinValue','outside_profile','Conversão exata deve resultar em g/L inteiro; não arredondar faixas publicadas.');}
 // Estes achados informados mantêm-se visíveis mesmo com falha alheia; não certificam estado atual.
 const urgentFindings=[];
 const hrCaptured=canonical(v.heartRateBpm,1,300),bpCaptured=canonical(v.systolicBpMmHg,1,300);
 if(v.hemodynamicallyStable===false)urgentFindings.push('reported_hemodynamic_instability');
 if(bpCaptured&&v.systolicBpMmHg<90)urgentFindings.push('reported_initial_sbp_below90');
 if(hrCaptured&&bpCaptured&&v.heartRateBpm>=v.systolicBpMmHg)urgentFindings.push('reported_initial_shock_index_at_least_one');
 const urgencyPreparation=['initialAssessmentConfirmed','samePatientEpisodeConfirmed','professionalReviewConfirmed','measurementsValidConfirmed','preTransfusionHemostasisValuesConfirmed','noMissingImputationConfirmed','currentClinicalReviewConfirmed'];
 const reportedUrgencyAssessmentComplete=hrCaptured&&bpCaptured&&typeof v.hemodynamicallyStable==='boolean'&&urgencyPreparation.every(k=>v[k]===true);
 const urgentReviewRecommended=urgentFindings.length?true:reportedUrgencyAssessmentComplete?false:null;
 if(hrOk&&bpOk&&v.heartRateBpm>=v.systolicBpMmHg)contextIssues.push({field:'initialShockIndex',kind:'unavailable',reason:'SI≥1 retira interpretação favorável; igualdade1 é guarda local conservadora.'});
 if(bpOk&&v.systolicBpMmHg<90)contextIssues.push({field:'systolicBpMmHg',kind:'unavailable',reason:'PAS<90 retira interpretação favorável por guarda local, mesmo com bradicardia.'});
 const status=issues.some(x=>x.kind==='invalid')?'invalid':issues.some(x=>x.kind==='outside_profile')?'outside_profile':issues.length?'incomplete':'scored';
 const complete=status==='scored';let components=null,total=null;
 if(complete){
  components={age:v.ageCompletedYears<40?0:v.ageCompletedYears<70?1:2,sex:v.sex==='male'?1:0,previousAdmission:v.previousLgibAdmission?1:0,rectalBlood:v.bloodOnRectalExam?1:0,heartRate:v.heartRateBpm<70?0:v.heartRateBpm<90?1:v.heartRateBpm<110?2:3,systolicBp:v.systolicBpMmHg<90?5:v.systolicBpMmHg<120?4:v.systolicBpMmHg<130?3:v.systolicBpMmHg<160?2:0,hemoglobin:hbGl<70?22:hbGl<90?17:hbGl<110?13:hbGl<130?8:hbGl<160?4:0};
  total=Object.values(components).reduce((a,b)=>a+b,0);
 }
 const interpretationAvailable=complete&&contextIssues.length===0;
 const thresholdContextStatus=!complete?'score_unavailable':contextIssues.some(x=>x.kind==='unavailable')?'unavailable':contextIssues.length?'unknown':'available';
 return{profile:PROFILE,status,complete,totalComplete:complete,total,components,hemoglobinGL:complete?hbGl:null,interpretationAvailable,thresholdContextStatus,atOrBelow8:interpretationAvailable?total<=8:null,interpretation:interpretationAvailable?(total<=8?'Total dentro do limiar histórico ≤8; apenas apoio ao julgamento clínico e à avaliação de seguimento, sem autorização de alta.':'Total acima do limiar histórico ≤8; esta ferramenta não define conduta ou destino automaticamente.'):null,issues,contextIssues,urgentFindings,reportedUrgencyAssessmentComplete,urgentReviewRecommended,limitations:LIMITATION,individualProbability:null,automaticDisposition:null,automaticTreatment:null,calendarValidated:false,sourceDataValidated:false};
}
