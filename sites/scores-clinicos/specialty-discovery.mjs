// Organização clínica compartilhada, sem duplicar fichas ou alterar fórmulas.
export const PRIORITY_SPECIALTIES=['Pediatria','Dermatologia','Cirurgia geral','Clínica médica','Reumatologia','Cardiologia','Pneumologia','Infectologia'];
const groups={
 'Cirurgia geral':['pas','twist','rcri','asa','bisap','glasgow-imrie','haps','surgical-apgar','mannheim-peritonitis'],
 'Clínica médica':['qsofa','news2','curb65','crb65','wells-tvp','wells-tep','perc','geneva','pesi','spesi','years','hestia','heart','cha2ds2va','has-bled','4ts','sofa-original','sofa2','kdigo-aki','kdigo-ckd','fib4','child-pugh','maddrey','centor','feverpain','mcisaac','sarcf','nrs2002','stopbang','albi'],
 'Infectologia':['qsofa','sofa-original','sofa2','phoenix','psofa','pediatric-sirs','bacterial-meningitis-score','kocher','kocher-caird','rochester','rodwell','candida-score','mascc','cisne','curb65','crb65','psi-port','smart-cop','idsa-ats-minor','step-by-step','denova','pitt-bacteremia','quick-pitt'],
 'Cardiologia':['rcri','add-rs','sgarbossa','modified-sgarbossa','pesi','spesi','bova','duke-treadmill','acef'],
 'Pneumologia':['pram','westley','wang','kristjansson','rdai','tal-modified','downes','silverman','oxygenation-index','osi','pf-ratio','sf-ratio','h2fpef','wells-tep','perc','geneva','pesi','spesi','years','hestia','psi-port','smart-cop','idsa-ats-minor','hacor','murray-lis','bova','adrop','stopbang']
};
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[₂]/g,'2').replace(/[^a-z0-9]+/g,' ').trim();
export function applySpecialtyDiscovery(scores){
 for(const score of scores){
  for(const [specialty,ids] of Object.entries(groups))if(ids.includes(score.id))score.specialties.push(specialty);
  score.specialties=[...new Set(score.specialties)];
  if(score.specialties.includes('Clínica médica'))score.aliases.push('clínica geral','medicina interna');
  const seen=new Set();score.aliases=score.aliases.filter(alias=>{const key=norm(alias);if(seen.has(key))return false;seen.add(key);return true;});
 }
}
