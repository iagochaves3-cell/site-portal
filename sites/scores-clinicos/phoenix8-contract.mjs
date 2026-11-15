/** Research-only executable contract, independently written from factual criteria.
 * Arithmetic profile: official CRAN phoenix 1.1.3, author tag 388b18e2d4dd236ad95b1e35b29dc7e62e33c50c.
 * Unlike the official data-set package, this contract NEVER maps missing to zero.
 * Not a clinical UI, diagnostic classifier, prospective EHR pipeline, or prediction model.
 */
export const PROFILE='phoenix8-author-arithmetic-1.1.3-strict-completeness';
export const PREPARATION='manual-contemporaneous-release113';
export const DRUGS=Object.freeze(['dopamine','dobutamine','epinephrine','norepinephrine','milrinone','vasopressin']);
export const AGE_BANDS=Object.freeze([
 {min:0,max:1,mapSevere:17,mapNormal:31,creatinine:0.8},
 {min:1,max:12,mapSevere:25,mapNormal:39,creatinine:0.3},
 {min:12,max:24,mapSevere:31,mapNormal:44,creatinine:0.4},
 {min:24,max:60,mapSevere:32,mapNormal:45,creatinine:0.6},
 {min:60,max:144,mapSevere:36,mapNormal:49,creatinine:0.7},
 {min:144,max:216,mapSevere:38,mapNormal:52,creatinine:1}
].map(Object.freeze));
const fields=['profile','preparation','ageMonths','postConceptionalWeeks','birthHospitalization','suspectedInfection','hoursSinceEncounter','contemporaneousConfirmed','respiratorySupport','respiratoryBasis','supportNotPerioperativeOnly','pao2Mmhg','spo2Percent','fio2Fraction','vasoactiveCount','lactateMmolL','mapMmhg','platelets10e9L','inr','dDimerMgLFEU','fibrinogenMgDl','gcsTotal','bilateralFixedPupils','glucoseMgDl','ancCellsPerUl','alcCellsPerUl','creatinineMgDl','totalBilirubinMgDl','altUl'];
const missing=v=>v===undefined||v===null||v==='';
function snapshot(raw){try{if(raw===null||typeof raw!=='object'||Array.isArray(raw))return null;const p=Object.getPrototypeOf(raw);if(p!==Object.prototype&&p!==null)return null;const d=Object.getOwnPropertyDescriptors(raw),out=Object.create(null);for(const k of Reflect.ownKeys(d)){if(typeof k!=='string'||!fields.includes(k)||!Object.hasOwn(d[k],'value'))return null;out[k]=d[k].value;}return out;}catch{return null;}}
function rat(v){const [m,e='0']=Number.prototype.toString.call(v).split('e');const [w,f='']=m.split('.');const p=Number(e)-f.length;const n=BigInt(w+f);return p>=0?[n*10n**BigInt(p),1n]:[n,10n**BigInt(-p)];}
const valid=(v,min=0,max=1e9,places=6)=>typeof v==='number'&&Number.isFinite(v)&&!Object.is(v,-0)&&v>=min&&v<=max&&rat(v)[1]<=10n**BigInt(places);
const lessRatio=(n,d,t)=>{const [a,b]=rat(n),[c,e]=rat(d);return a*e<BigInt(t)*c*b;};
const equalRatio=(n,d,t)=>{const [a,b]=rat(n),[c,e]=rat(d);return a*e===BigInt(t)*c*b;};
const sum=a=>a.reduce((x,y)=>x+y,0);
const none={respiratory:null,cardiovascular:null,coagulation:null,neurologic:null,endocrine:null,immunologic:null,renal:null,hepatic:null};
const notDiagnostic='Phoenix-8 descreve oito domínios de disfunção/suporte no contexto definido. Este perfil não usa ≥2 no total de oito órgãos para diagnóstico automático nem como critério do consenso Phoenix-4 de 2024; limiares operacionais estudados posteriormente exigem contexto próprio. Não é triagem, probabilidade individual nem indicação automática de tratamento ou alta. Dados ausentes não são normais.';
export function calculatePhoenix8(raw){
 const v=snapshot(raw),issues=[],warnings=[],notApplicable=[],components={...none},details={};
 const result=(status='incomplete',total=null,phoenix4Subtotal=null)=>({status,profile:PROFILE,preparation:PREPARATION,total,phoenix4Subtotal,components,details,issues,warnings,notApplicable,interpretation:notDiagnostic,sepsis:null,septicShock:null,mortalityProbability:null,treatmentRecommendation:null,dischargeRecommendation:null});
 if(!v){issues.push({field:'payload',reason:'Only a plain own-data record is accepted; no getters, arrays, inheritance or coercion.'});return result('invalid');}
 const bad=(f,reason)=>issues.push({field:f,reason});
 const number=(f,min=0,max=1e9,p=6)=>{if(!valid(v[f],min,max,p)){bad(f,'Known finite number in canonical unit and accepted precision required.');return false;}return true;};
 const bool=f=>{if(typeof v[f]!=='boolean'){bad(f,'Explicit true/false required.');return false;}return true;};
 if(v.profile!==PROFILE)bad('profile','Choose the explicitly versioned author-computational profile; no implicit fallback.');
 if(v.preparation!==PREPARATION)bad('preparation','This contract does not perform prospective EHR selection, carry-forward or imputation.');
 const ageOk=number('ageMonths',0,216),pcOk=number('postConceptionalWeeks',0,10000),birthOk=bool('birthHospitalization'),infectionOk=bool('suspectedInfection'),hourOk=number('hoursSinceEncounter',0,24),snapshotOk=bool('contemporaneousConfirmed'),supportOk=bool('supportNotPerioperativeOnly');
 if(ageOk&&v.ageMonths>=216)bad('ageMonths','Study population is <18 years, even though the author arithmetic helper accepts216.');
 if(pcOk&&v.postConceptionalWeeks<37)bad('postConceptionalWeeks','Excluded below37 postconceptional weeks at encounter start.');
 if(birthOk&&v.birthHospitalization)bad('birthHospitalization','Original birth hospitalization excluded.');
 if(infectionOk&&!v.suspectedInfection)bad('suspectedInfection','Outside the original infection-context research profile.');
 if(hourOk&&v.hoursSinceEncounter>=24)bad('hoursSinceEncounter','This profile is one observation in the first24h, half-open local window [0,24).');
 if(snapshotOk&&!v.contemporaneousConfirmed)bad('contemporaneousConfirmed','Do not combine independent worst values from different times.');
 if(supportOk&&!v.supportNotPerioperativeOnly)bad('supportNotPerioperativeOnly','Perioperative-only or unmapped support requires separate review.');
 const band=ageOk?AGE_BANDS.find(b=>v.ageMonths>=b.min&&v.ageMonths<b.max):undefined;
 // Explicitly absent support gives zero by the rubric, without inventing oxygen values.
 if(!['none','noninvasive','invasive'].includes(v.respiratorySupport))bad('respiratorySupport','Known support branch required.');
 else if(v.respiratorySupport==='none'){
  if(v.respiratoryBasis!=='not_applicable')bad('respiratoryBasis','Without respiratory support explicitly select not_applicable.');
  else{components.respiratory=0;notApplicable.push('pao2Mmhg','spo2Percent','fio2Fraction');}
 }else{
  if(!['pf','sf','both'].includes(v.respiratoryBasis))bad('respiratoryBasis','Select pf, sf or both valid contemporaneous ratios under the release113 OR rubric.');
  const usePf=['pf','both'].includes(v.respiratoryBasis),useSf=['sf','both'].includes(v.respiratoryBasis),fiOk=number('fio2Fraction',0.21,1,3);
  const pfOk=usePf?number('pao2Mmhg',0,2000):false,sfOk=useSf?number('spo2Percent',0,97):false;
  if(!usePf)notApplicable.push('pao2Mmhg');if(!useSf)notApplicable.push('spo2Percent');
  if(fiOk&&(usePf||useSf)&&(!usePf||pfOk)&&(!useSf||sfOk)){
   const under=(p,s)=>(usePf&&lessRatio(v.pao2Mmhg,v.fio2Fraction,p))||(useSf&&lessRatio(v.spo2Percent,v.fio2Fraction,s));
   components.respiratory=!under(400,292)?0:v.respiratorySupport!=='invasive'?1:under(100,148)?3:under(200,220)?2:1;
   details.pfRatio=usePf?v.pao2Mmhg/v.fio2Fraction:null;details.sfRatio=useSf?v.spo2Percent/v.fio2Fraction:null;
   if((usePf&&equalRatio(v.pao2Mmhg,v.fio2Fraction,200))||(useSf&&equalRatio(v.spo2Percent,v.fio2Fraction,220)))warnings.push('At P/F200 or S/F220 the author113 software uses strict < and may differ from the inclusive main clinical table.');
   if(v.respiratoryBasis==='both')warnings.push('Both valid ratios use the release113 OR rule. The September2026 work-in-progress prospective EHR selection chooses one by timestamps; this is not that pipeline.');
  }
 }
 // Ignored conditional fields are not converted to normal; reject malformed values if supplied.
 for(const f of notApplicable){
  if(missing(v[f])||v[f]==='NA'||v[f]==='N/A')continue;
  const canonical=f==='fio2Fraction'?valid(v[f],0.21,1,3):f==='spo2Percent'?valid(v[f],0,100):valid(v[f],0,2000);
  if(!canonical)bad(f,'Inactive data must be omitted/NA or a finite value in its canonical range/precision; no unit guessing or coercion.');
  else if(f==='fio2Fraction'&&v.respiratorySupport==='none'&&v[f]>0.21)bad(f,'FiO2 above room air contradicts contemporaneous absence of any respiratory support. Clear inactive data/markNA or correct support; never issue a reassuring zero.');
  else if(v.respiratorySupport!=='none'&&((f==='spo2Percent'&&v.respiratoryBasis==='pf'&&v[f]<=97)||(f==='pao2Mmhg'&&v.respiratoryBasis==='sf'))){bad('respiratoryBasis','A second known eligible contemporaneous ratio requires both under the release113 OR profile. Only clear/markNA a residual value if it is genuinely not applicable to this observation, then reconfirm preparation.');components.respiratory=null;}
 }
 const countOk=number('vasoactiveCount',0,6,0),lacOk=number('lactateMmolL',0,50),mapOk=number('mapMmhg',0,300);
 if(countOk&&lacOk&&mapOk&&band){const vaso=v.vasoactiveCount===0?0:v.vasoactiveCount===1?1:2,lac=v.lactateMmolL<5?0:v.lactateMmolL<11?1:2,map=v.mapMmhg<band.mapSevere?2:v.mapMmhg<band.mapNormal?1:0;details.cardiovascular={vasoactive:vaso,lactate:lac,map};components.cardiovascular=vaso+lac+map;if(v.mapMmhg>band.mapNormal-1&&v.mapMmhg<band.mapNormal)warnings.push('Continuous MAP lies in an interval where author113 and literal printed clinical thresholds differ. No rounding was applied.');}
 const coFields=['platelets10e9L','inr','dDimerMgLFEU','fibrinogenMgDl'];const coChecks=coFields.map(f=>number(f));
 if(coChecks.every(Boolean)){details.coagulation=[v.platelets10e9L<100,v.inr>1.3,v.dDimerMgLFEU>2,v.fibrinogenMgDl<100].map(Number);components.coagulation=Math.min(2,sum(details.coagulation));}
 const gcsOk=number('gcsTotal',3,15,0),pupilOk=bool('bilateralFixedPupils');if(gcsOk&&pupilOk)components.neurologic=v.bilateralFixedPupils?2:v.gcsTotal<=10?1:0;
 if(number('glucoseMgDl',0,2000))components.endocrine=v.glucoseMgDl<50||v.glucoseMgDl>150?1:0;
 const ancOk=number('ancCellsPerUl'),alcOk=number('alcCellsPerUl');if(ancOk&&alcOk)components.immunologic=v.ancCellsPerUl<500||v.alcCellsPerUl<1000?1:0;
 if(number('creatinineMgDl',0,50)&&band)components.renal=v.creatinineMgDl>=band.creatinine?1:0;
 const bilOk=number('totalBilirubinMgDl',0,100),altOk=number('altUl');if(bilOk&&altOk)components.hepatic=v.totalBilirubinMgDl>=4||v.altUl>102?1:0;
 const p4=[components.respiratory,components.cardiovascular,components.coagulation,components.neurologic],p8=Object.values(components);
 // Completeness is stricter than the dataset package, including redundant OR/cap inputs.
 // Partial component points never authorize a normal/negative conclusion or a final total.
 if(issues.length||p8.some(x=>x===null))return result('incomplete');
 return result('complete',sum(p8),sum(p4));
}
