// Concentrations from manufacturer professional labels, checked 2026-10-06 UTC.
export const FLUID_SOURCES = [
 {label:'Halex Istar · NaCl 0,9%, 10% e 20%',url:'https://halexistar.com.br/wp-content/uploads/2026/09/2-1261705.pdf'},
 {label:'Halex Istar · SF 0,9% em bolsas',url:'https://halexistar.com.br/produto/cloreto-de-sodio-2/'},
 {label:'Halex Istar · KCl 10% e 19,1%',url:'https://halexistar.com.br/wp-content/uploads/2026/09/2-191711617.pdf'},
 {label:'Halex Istar · Glicose 25% e 50%',url:'https://halexistar.com.br/wp-content/uploads/2026/09/2-15915313.pdf'},
 {label:'Fresenius Kabi · SG 5% e 10%',url:'https://www.fresenius-kabi.com/content/dam/fresenius-kabi/br/documents/bulas/medicamentos/Glicose%205-%20e%2010-%20-%20Bula%20Profissional%20de%20Sa%C3%BAde%20(122%20KB).pdf.coredownload.inline.pdf'}
];
export const FLUID_STOCKS = {
 glucose: [
  {id:'g5',label:'SG 5%',g:.05,mg:50,packs:'Frascos de 50, 100, 250, 500 e 1.000 mL'},
  {id:'g10',label:'SG 10%',g:.1,mg:100,packs:'Frascos de 250, 500 e 1.000 mL'},
  {id:'g25',label:'Glicose 25%',g:.25,mg:250,packs:'Ampola de 10 mL'},
  {id:'g50',label:'Glicose 50%',g:.5,mg:500,packs:'Ampolas de 10 e 20 mL'}
 ],
 sodium: [
  {id:'na09',label:'NaCl 0,9% (SF)',na:.154,mg:9,packs:'Ampolas de 10 e 20 mL; bolsas de 100, 250, 500 e 1.000 mL'},
  {id:'na10',label:'NaCl 10%',na:1.711,mg:100,packs:'Ampola de 10 mL'},
  {id:'na20',label:'NaCl 20%',na:3.422,mg:200,packs:'Ampola de 10 mL'}
 ],
 potassium: [
  {id:'k10',label:'KCl 10%',k:1.341,mg:100,packs:'Ampola de 10 mL'},
  {id:'k191',label:'KCl 19,1%',k:2.562,mg:191,packs:'Ampola de 10 mL'}
 ],
 base: [
  {id:'water',label:'Água para injeção',g:0,na:0},
  {id:'sg5',label:'SG 5%',g:.05,na:0},
  {id:'sg10',label:'SG 10%',g:.1,na:0},
  {id:'sf09',label:'SF 0,9%',g:0,na:.154}
 ]
};
export const DEFAULT_FLUID_STOCKS={glucoseStock:'g50',sodiumStock:'na20',potassiumStock:'k191',baseStock:'water'};
export function selectedFluidStocks(options={}) {
 const o={...DEFAULT_FLUID_STOCKS,...options};
 return Object.fromEntries(Object.entries({g:['glucose','glucoseStock'],na:['sodium','sodiumStock'],k:['potassium','potassiumStock'],base:['base','baseStock']}).map(([key,[group,field]])=>[key,FLUID_STOCKS[group].find(s=>s.id===o[field])]));
}
// Simultaneously solve glucose mass, sodium content, potassium content and volume.
// Base-fluid solutes are counted once; no stock is silently replaced.
export function prepareMaintenance(m,options={}) {
 const s=selectedFluidStocks(options);
 if(Object.values(s).some(x=>!x))return {error:'Selecione apresentações válidas para todos os componentes.'};
 if(!m||m.error||![m.daily,m.glucose,m.sodium,m.potassium].every(Number.isFinite)||m.daily<0||m.glucose<0||m.glucose>100||m.sodium<0||m.potassium<0)return {error:'Corrija os dados de volume e composição.'};
 if(m.daily===0)return {empty:true,message:'Outros aportes cobrem toda a meta de volume. Não há soro de manutenção IV a preparar; reavalie os aportes de eletrólitos e glicose.'};
 const volume=options.bagVolume??m.daily;
 if(!Number.isFinite(volume)||volume<.001||volume>m.daily)return {error:'O volume final do preparo deve ser de pelo menos 0,001 mL e não exceder o volume IV das 24 horas.'};
 const ratio=volume/m.daily,G=m.glucose*volume/100,N=m.sodium*ratio,K=m.potassium*ratio;
 const vk=K/s.k.k,den=1-s.base.g/s.g.g-s.base.na/s.na.na,num=volume-vk-G/s.g.g-N/s.na.na;
 let base;
 if(Math.abs(den)<1e-12){
  if(Math.abs(num)>1e-8)return {error:'As apresentações escolhidas não atingem as metas neste volume final. SG 5% sozinho não mantém glicose final de 5% ao receber eletrólitos; SF 0,9% sozinho não mantém Na final de 154 mEq/L ao receber glicose ou KCl. Escolha uma fonte mais concentrada ou uma solução pronta com a composição prescrita.'};
  base=0;
 }else base=num/den;
 const vg=(G-base*s.base.g)/s.g.g,vna=(N-base*s.base.na)/s.na.na;
 if([base,vg,vna,vk].some(v=>!Number.isFinite(v)||v < -1e-7))return {error:'Esta combinação não cabe no volume final com as metas prescritas. Selecione glicose/NaCl mais concentrados ou outra solução-base. Para usar SG 5% como base mantendo glicose final de 5%, selecione glicose 25% ou 50% como complemento. As metas não foram alteradas.'};
 const rows=[{label:s.g.label,volume:Math.max(0,vg),kind:'g'}, {label:s.na.label,volume:Math.max(0,vna),kind:'na'}, {label:s.k.label,volume:Math.max(0,vk),kind:'k'}, {label:s.base.label,volume:Math.max(0,base),kind:'base'}];
 if(rows.some(r=>r.volume>1e-8&&r.volume<.001))return {error:'Há componente abaixo de 0,001 mL, não mensurável com esta apresentação. Ajuste o volume do preparo ou use pré-diluição validada pela farmácia.'};
 const total=rows.reduce((sum,r)=>sum+r.volume,0),glucoseGrams=vg*s.g.g+base*s.base.g,sodium=vna*s.na.na+base*s.base.na,potassium=vk*s.k.k;
 const check=(a,b)=>Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(b));
 if(![check(total,volume),check(glucoseGrams,G),check(sodium,N),check(potassium,K)].every(Boolean))return {error:'Falha na conferência da composição. Reveja os dados.'};
 if(G===0&&N===0&&K===0)return {error:'Água sem solutos não pode ser administrada por via intravenosa. Defina a composição adequada.'};
 // Round the visible recipe to 0.001 mL and absorb rounding in its largest component.
 const displayTotal=Math.round(volume*1000)/1000;
 rows.forEach(r=>r.displayVolume=Math.round(r.volume*1000)/1000);
 const largest=rows.reduce((a,b)=>b.volume>a.volume?b:a);
 largest.displayVolume=Math.round((largest.displayVolume+displayTotal-rows.reduce((sum,r)=>sum+r.displayVolume,0))*1000)/1000;
 const fullBags=Math.floor((m.daily+1e-8)/volume),remainder=Math.max(0,m.daily-fullBags*volume);
 const warnings=[];
 if(rows.some(r=>r.volume>0&&r.volume<.1))warnings.push('Há alíquota inferior a 0,1 mL: usar preparo farmacêutico ou pré-diluição validada para mensuração precisa; não arredondar para zero.');
 if(K/volume*1000>40+1e-7)warnings.push('K final acima de 40 mEq/L: avaliar acesso venoso e preparo específico antes da administração; não tratar como manutenção periférica habitual.');
 if(m.potassium/24>20||m.potassium>200)warnings.push('Aporte de K excede 20 mEq/h ou 200 mEq/24 h, limites gerais da bula. Não usar este preparo como manutenção habitual; requer prescrição específica e monitorização intensiva.');
 if(m.glucose>10)warnings.push('Glicose final acima de 10%: avaliar osmolaridade e necessidade de acesso central.');
 return {rows,volume,displayTotal,total,baseVolume:base,glucoseGrams,sodium,potassium,glucosePercent:glucoseGrams/volume*100,sodiumPerL:sodium/volume*1000,potassiumPerL:potassium/volume*1000,rate:m.daily/24,hours:24*ratio,fullBags,remainder,warnings,stocks:s};
}
