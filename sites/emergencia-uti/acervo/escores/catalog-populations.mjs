// Navigation metadata reviewed against each existing profile on 13/10/2026.
// Groups locate instruments; the exact age, context and exclusions remain in each score.
// No age conversion or clinical eligibility is inferred from these labels.
import {novemberScores} from './november-catalog.mjs';
const memberships = [
  [["neonatal"], `
    apgar silverman snap2 snappe2 downes thompson-hie rodwell capurro-b capurro-a finnegan-qld finnegan-simplificado-devlin-2020 nsofa-neonatal trips-neonatal-2001
  `],
  [["neonatal","pediatria"], `
    capd phoenix nips pecarn-under2 pediatric-gcs comfort-b pim3 pelod2 rochester step-by-step nice-fever-traffic-light pecarn-febrile-cps2026 lab-score-fever is-wernovsky-1995 vis-gaies-2010 phoenix8-author-113 fss-pediatric-cpccrn pcpc-pediatric-br2023 popc-pediatric-br2023 prism-iv-prepared-2016 pecarn-cervical-lee2025
  `],
  [["neonatal","pediatria","adultos"], `
    wat1 psofa
  `],
  [["pediatria","adultos"], `
    chandler-orbital ottawa-knee niaid-faan-anaphylaxis-2006 ottawa-ankle pbmst-child-bloem2026 glasgow news2 scorad easi feverpain bishop puqe24 alvarado mcisaac kdigo-aki canadian-cspine ottawa-sah canadian-headct nexus-headct bacterial-meningitis-score csrs parc pedmidas gags melbourne-asset mpis-maekawa-2018 pass-gorelick-2004
  `],
  [["pediatria"], `
    mas-sjia-2016 kawasaki-complete-aha2024 ispad-dka-acidosis-2022 edc-dengue-2015-literal dhaka-2015 pram westley westley-rcht-2023 pas cds wang pts kristjansson flacc schwartz2009 pucai twist pecarn-over2 oxygenation-index osi pediatric-sirs kocher kocher-caird yale-observation gorelick-10 who-dehydration rdai sbs strongkids tal-modified sipa paed gorelick-4 umss raimondi pecarn-abdominal vesikari vesikari-modificado aairs-arnold-2012 cas-parkin-1996 jadas10-esr-2021 cjadas10-2021 wpcdai-2012-literal risc-malawi-muac-2016 prepare-pneumonia-mortality-2022 feast-pet-2015
  `],
  [["adultos"], `
    alt70-cellulitis-2017 qsofa curb65 crb65 wells-tvp wells-tep cha2ds2va pasi child-pugh ecog karnofsky air centor 4ts heart timi-nstemi timi-stemi has-bled h2fpef rcri perc geneva spesi pesi padua improve-vte improve-bleed sofa-original sofa2 rass bps four mrs ich hunt-hess wfns fisher-modified gbs rockall-clinical rockall-full phq9 phq2 gad7 gad2 4at sarcf katz nrs2002 ihs4 hurley stopbang mascc fib4 nyha bisap lrinec cows nihss ramsay riker-sas mmrc bode decaf rox apri aims65 asa apfel aldrete trts rts sic isth-dic2025 amsel nugent shock-index cpot gcs-p orbit atria-bleeding killip ckdepi2021 cockcroft-gault maddrey must conut isar-br uas7 salt das28-esr das28-crp cdai sdai asdas-crp asdas-esr saps2 apache2 mnutric gap mgap nexus-cspine iss scorten mst niss ariscat auditc-va abcd2 sirs-adult ccs-angina mehra meld3 kdigo-ckd mews rems cam-icu icdsc mrc-sum rsbi pf-ratio sf-ratio modified-shock-index age-shock-index murray-lis hacor add-rs sfsr oesil psi-port smart-cop idsa-ats-minor hestia years sgarbossa modified-sgarbossa lams rosier haps glasgow-imrie clinical-frailty-scale frail-scale braden morse meld-na nafld-fibrosis-score gahs charlson-mdcalc-restrito cage fagerstrom lawton-9 candida-score chads2 tvasi surgical-apgar mannheim-peritonitis dapsa cdapsa acr-eular-ra2010 duke-treadmill duke-alexander-1998 duke-mark-1991 acef-original bova adrop albi fatty-liver-index denova quick-pitt charlson-original-1987 cisne-adult-finite2012 oakland-complete-bsg2019 edacs-clinical-2014
  `],
];
export const SCORE_POPULATIONS = Object.freeze(Object.fromEntries(
  [...memberships, ...novemberScores.map(s => [s.populationGroups, s.id])].flatMap(([groups, ids]) => ids.trim().split(/\s+/).map(id => [id, Object.freeze([...groups])]))
));

export function applyPopulationNavigation(scores){
  const canonical=name=>/^terapia intensiva$/i.test(name)?'Terapia Intensiva':name;
  for(const score of scores){
    score.specialty=canonical(score.specialty);
    score.specialties=[...new Set((score.specialties||[score.specialty]).map(canonical))];
    score.populationGroups=SCORE_POPULATIONS[score.id]||score.populationGroups||[];
  }
}
