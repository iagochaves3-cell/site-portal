// A single dimensional calculation engine shared by all visible tools.
export function number(value,{optional=false,min=0,inclusive=false}={}){
 const s=String(value??'').trim();
 if(!s&&optional)return null;
 if(!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(s))throw Error('Informe um número válido; use vírgula ou ponto para decimais.');
 const n=Number(s.replace(',','.'));
 if(!Number.isFinite(n)||(inclusive?n<min:n<=min))throw Error(inclusive?'O valor deve ser maior ou igual a '+min+'.':'O valor deve ser maior que '+min+'.');
 return n;
}
export const UNITS={mcg:{group:'mass',factor:1},mg:{group:'mass',factor:1000},g:{group:'mass',factor:1000000},mU:{group:'activity',factor:1},U:{group:'activity',factor:1000},mEq:{group:'equivalent',factor:1},mmol:{group:'molar',factor:1}};
export function convert(n,from,to){
 if(!UNITS[from]||!UNITS[to]||UNITS[from].group!==UNITS[to].group)throw Error('Unidades incompatíveis. Não há conversão universal entre massa, unidades, mEq e mmol.');
 return n*UNITS[from].factor/UNITS[to].factor;
}
export function calculateDose(input){
 const weight=number(input.weight),dose=number(input.dose),amount=number(input.amount),volume=number(input.volume);
 const single=!!input.single,interval=single?null:number(input.interval),times=single?1:24/interval;
 if(!single&&interval>24)throw Error('Para intervalos acima de 24 h, use o cálculo por administração e registre o intervalo por extenso.');
 if(!['kg-dose','kg-day','fixed'].includes(input.basis))throw Error('Selecione a base da dose.');
 if(input.basis==='kg-day'&&single)throw Error('Dose em mg/kg/dia exige intervalo.');
 const concentration=convert(amount,input.concentrationUnit,input.unit)/volume;
 const raw=input.basis==='fixed'?dose:input.basis==='kg-day'?dose*weight/times:dose*weight;
 const maxDose=number(input.maxDose,{optional:true}),maxDay=number(input.maxDay,{optional:true}),maxKgDay=number(input.maxKgDay,{optional:true});
 const caps=[maxDose,maxDay===null?null:maxDay/times,maxKgDay===null?null:maxKgDay*weight/times].filter(x=>x!==null);
 const cap=caps.length?Math.min(...caps):Infinity;
 const capped=Math.min(raw,cap);
 const exactVolume=capped/concentration;
 const step=number(input.step||'0.01');
 let practicalVolume=Math.round((exactVolume+Number.EPSILON)/step)*step;
 if(practicalVolume*concentration>cap+1e-8)practicalVolume=Math.floor((exactVolume+1e-12)/step)*step;
 practicalVolume=Number(practicalVolume.toPrecision(12));
 if(practicalVolume<=0)throw Error('Volume menor que a graduação informada. Escolha uma graduação compatível e confira a mensurabilidade.');
 const administered=practicalVolume*concentration;
 const delta=(administered-capped)/capped*100;
 if(Math.abs(delta)>5)throw Error('Arredondamento altera a dose em mais de 5%. Use graduação menor ou concentração adequada.');
 if(![raw,capped,concentration,exactVolume,practicalVolume,administered,delta].every(Number.isFinite))throw Error('Valor fora da faixa numérica operacional.');
 const reverseDose=convert(practicalVolume/volume*amount,input.concentrationUnit,input.unit);
 if(Math.abs(reverseDose-administered)>Math.max(1e-8,Math.abs(administered)*1e-10))throw Error('Falha na conferência reversa.');
 const reverse=reverseDose/weight;
 const dropFactor=number(input.dropFactor,{optional:true});
 return {weight,dose,raw,capped,cap:Number.isFinite(cap)?cap:null,cappedByLimit:raw>cap,concentration,exactVolume,practicalVolume,administered,unit:input.unit,times,interval,single,perKgDose:reverse,perDay:administered*times,perKgDay:reverse*times,delta,step,dropFactor,exactDrops:dropFactor?practicalVolume*dropFactor:null,reverseDose,mathOk:true};
}
export function calculateInfusion(i){
 const weight=number(i.weight),dose=number(i.dose),amount=number(i.amount),finalVolume=number(i.finalVolume);
 const stockAmount=number(i.stockAmount),stockVolume=number(i.stockVolume);
 const match=/^(mcg|mg|U|mU)\/kg\/(min|h)$/.exec(i.rateUnit);
 if(!match)throw Error('Selecione uma unidade clínica válida.');
 const [_,unit,time]=match;
 const finalConcentration=convert(amount,i.amountUnit,unit)/finalVolume;
 const stockConcentration=convert(stockAmount,i.stockUnit,i.amountUnit)/stockVolume;
 const drawVolume=amount/stockConcentration;
 if(drawVolume>finalVolume+1e-9)throw Error('O volume a aspirar excede o volume final. Reveja quantidade, concentração e preparo.');
 const mlh=dose*weight*(time==='min'?60:1)/finalConcentration;
 const reverse=convert(mlh/finalVolume*amount,i.amountUnit,unit)/(weight*(time==='min'?60:1));
 if(![mlh,reverse,drawVolume,finalConcentration].every(Number.isFinite))throw Error('Valor fora da faixa numérica operacional.');
 return {weight,dose,unit,time,mlh,reverse,drawVolume,diluentVolume:finalVolume-drawVolume,finalVolume,amount,amountUnit:i.amountUnit,finalConcentration,concentrationUnit:unit+'/mL',durationHours:finalVolume/mlh,consumption:[6,12,24].map(hours=>({hours,volume:mlh*hours,amount:convert(mlh*hours*finalConcentration,unit,i.amountUnit)})),mathOk:Math.abs(reverse-dose)<1e-9};
}
export function intermittent(volume,minutes){return number(volume)*60/number(minutes);}
export function concentration(amount,volume){return number(amount)/number(volume);}
export function bsa(weight,height){return Math.sqrt(number(weight)*number(height)/3600);}
export function norm(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
export function fmt(n,decimals=3){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:decimals,minimumFractionDigits:0});}
export function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
