/** Arithmetic research contract only. No clinical rubric is reproduced or assigned.
 * Requires six independently coded integer categories from a separately authorized,
 * named FSS rubric. NOT a clinical deployment, form, diagnosis or prognosis.
 */
export const DOMAINS=Object.freeze(['mentalStatus','sensory','communication','motor','feeding','respiratory']);
export const PROFILE='fss-pediatric-unweighted-six-domain-arithmetic';
function snapshot(raw,allowed){
 const data=Object.create(null),errors=[];
 if(raw===null||typeof raw!=='object')return {data,errors:['record']};
 try{if(Array.isArray(raw))errors.push('record');const p=Object.getPrototypeOf(raw);if(p!==Object.prototype&&p!==null)errors.push('record');}catch{errors.push('record');}
 let keys;try{keys=Reflect.ownKeys(raw);}catch{return {data,errors:['record']};}
 for(const k of keys){if(typeof k!=='string'||!allowed.includes(k)){errors.push('record');continue;}try{const d=Object.getOwnPropertyDescriptor(raw,k);if(!d||!Object.hasOwn(d,'value'))errors.push(k);else data[k]=d.value;}catch{errors.push(k);}}
 return {data,errors};
}
export function sumFssCategories(raw){
 const s=snapshot(raw,DOMAINS),errors=[...s.errors],components=Object.create(null);
 for(const k of DOMAINS){const v=s.data[k];if(typeof v!=='number'||!Number.isInteger(v)||v<1||v>5)errors.push(k);else components[k]=v;}
 const complete=errors.length===0;
 return {profile:PROFILE,complete,total:complete?DOMAINS.reduce((n,k)=>n+components[k],0):null,components,errors:[...new Set(errors)],interpretation:null,diagnosis:null,mortalityProbability:null,treatmentRecommendation:null};
}
export function compareFssCategories(raw){
 const s=snapshot(raw,['baseline','followup','samePersonConfirmed','sameRubricConfirmed','chronologyConfirmed']),errors=[...s.errors];
 for(const k of ['samePersonConfirmed','sameRubricConfirmed','chronologyConfirmed'])if(s.data[k]!==true)errors.push(k);
 const baseline=sumFssCategories(s.data.baseline),followup=sumFssCategories(s.data.followup);
 if(!baseline.complete)errors.push('baseline');if(!followup.complete)errors.push('followup');
 if(errors.length)return {complete:false,baselineTotal:null,followupTotal:null,delta:null,domainChanges:null,errors:[...new Set(errors)],newMorbidity:null};
 return {complete:true,baselineTotal:baseline.total,followupTotal:followup.total,delta:followup.total-baseline.total,domainChanges:Object.fromEntries(DOMAINS.map(k=>[k,followup.components[k]-baseline.components[k]])),errors:[],newMorbidity:null,limitation:'Manual confirmations do not certify identity, clinical coding, dates, time windows, or study eligibility. A net delta can conceal worsening in an individual domain.'};
}
