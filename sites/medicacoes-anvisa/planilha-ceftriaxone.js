(function(root){'use strict';
const BULA='https://www.blau.com/media/leaflet/ff29a2f2-2dba-41de-bafe-b2dcf0981f11-41d1e49d-7ee1-4cf9-be95-7b11dca4b625/Ceftri_9uoMT45.pdf',PCH='https://pch.health.wa.gov.au/-/media/Files/Hospitals/PCH/General-documents/Health-professionals/ChAMP-Monographs/Ceftriaxone.pdf';
const requirements={cefAllergy:'Sem hipersensibilidade à ceftriaxona/cefalosporinas/componentes nem reação grave prévia a betalactâmicos que exija avaliação especializada',cefAge:'Idade pós-menstrual acima de 44 semanas confirmada; sem condição neonatal ou hiperbilirrubinemia neonatal',cefClinical:'Indicação e esquema confirmados pelo prescritor; suscetibilidade, necessidade de associação e duração serão reavaliadas',cefPrior:'Nenhuma ceftriaxona administrada nas últimas 24 horas; não somar outro esquema de ceftriaxona',cefLine:'Sem cálcio IV simultâneo, mistura com outros medicamentos ou diluente com cálcio; acesso/compatibilidades e lavagem da via avaliados',cefMonitoring:'Monitorização e reavaliação disponíveis: função renal/hepática/hematológica em dose alta ou tratamento prolongado; observar alergia, diarreia e toxicidade'};
const diagnoses={'RGM-MED-001-02':['Pneumonia adquirida na comunidade grave — UTI, Carilion2025'],'RGM-MED-001-01':['Celulite bacteriana — esquema inicial usual selecionado','Linfadenite bacteriana — esquema inicial usual selecionado'],'RGM-MED-001-03':['Meningite bacteriana — esquema inicial diário, com avaliação de associações']};
const products=[['validated:ceftriaxoneBlau1g','Ceftriaxona Blau 1 g IV · registro 1163701740078 · preparo pediátrico 9,4 mL AD → 100 mg/mL (bula)']];
const num=v=>['string','number'].includes(typeof v)&&/^\d+(?:[.,]\d{1,3})?$/.test(String(v).trim())?Number(String(v).replace(',','.')):NaN;
function calculate(i){const fail=reason=>({ok:false,reason:'NÃO CALCULADO: '+reason});if(!i||typeof i!=='object'||Array.isArray(i))return fail('dados ausentes.');
 if(!diagnoses[i.scheme]||i.product!==products[0][0]||i.route!=='IV'||!diagnoses[i.scheme].includes(i.diagnosis))return fail('esquema, apresentação, indicação ou via sem vínculo validado.');
 const w=num(i.weight),a=num(i.age);if(!Number.isFinite(w)||w<=0||w>300||!Number.isFinite(a)||a<0||!['dias','meses','anos'].includes(i.unit))return fail('peso/idade/unidade inválidos.');
 // Do not turn a pediatric mg/kg regimen into an adult fixed-dose regimen silently.
 const exceedsAge=i.unit==='anos'?a>12:i.unit==='meses'?a>144:a>4380;
 if((i.unit==='dias'&&a<=31)||(i.unit==='meses'&&a<=1)||(i.unit==='anos'&&a<=1/12)||exceedsAge||w>=50)return fail('este vínculo exige acima de 1 mês até 12 anos, peso <50 kg e idade pós-menstrual confirmada; neonatos e transição adulta exigem outro esquema.');
 for(const [k,v] of Object.entries(requirements))if(i[k]!=='confirmed')return fail('confirmar: '+v+'.');
 if(!['usual','renal_lt10'].includes(i.cefRenal))return fail('definir condição renal/hepática; insuficiências concomitantes ou situação desconhecida exigem individualização.');
 const coefficient=i.scheme==='RGM-MED-001-03'?100:i.scheme==='RGM-MED-001-02'?75:50,cap=coefficient===100?4000:2000;
 if(i.cefRenal==='renal_lt10'&&coefficient>50)return fail('disfunção renal grave exige até 50 mg/kg/dia ou 2 g/dia (menor valor, PCH); não reduzir automaticamente o regime selecionado. Individualizar tratamento.');
 const dose=Math.min(w*coefficient,cap),stock=dose/100;
 const r={ok:true,doseMin:dose,doseMax:dose,stockMin:stock,stockMax:stock,coefficient,cap,capApplied:dose<w*coefficient,dailyTherapeutic:dose,exposure24h:dose,intervalHours:24,source:BULA,date:'2026-10-26',preparationReason:'Selecionar reconstituição pediátrica, diluente, concentração FINAL e tempo. NÃO ADMINISTRAR até completar o preparo.'};
 if(i.cefReconstitution!=='label100'){r.stockMin=undefined;r.stockMax=undefined;return r;}
 if(i.diluent&& !['sf09','sg5'].includes(i.diluent)){r.preparationReason='NÃO CALCULADO — INCOMPATÍVEL: Ringer/Hartmann/cálcio e lidocaína não são diluentes IV deste vínculo.';return r;}
 if(!['sf09','sg5'].includes(i.diluent)||!['20','40'].includes(i.finalConcentration)||i.minutes!=='30')return r;
 r.finalConcentration=Number(i.finalConcentration);r.finalVolume=dose/r.finalConcentration;r.diluentVolume=r.finalVolume-stock;r.rate=r.finalVolume*2;r.minutes=30;r.preparationReason=null;return r;
}
root.AnvisaCeftriaxoneClinical={calculate,requirements,products,diagnoses,BULA,PCH};if(typeof module!=='undefined')module.exports=root.AnvisaCeftriaxoneClinical;
})(typeof window!=='undefined'?window:globalThis);
