import {calculateDose,number,fmt} from './core.mjs';
import {closureRegimens} from './medication-regimens-closure-20261005.mjs';

const blockedRegimenReasons=new Map(closureRegimens.filter(r=>r.prescriptionEmissionBlocked===true).map(r=>[r.id,r.prescriptionEmissionBlockReason]));
export function regimenPrescriptionBlockReason(r){
 return blockedRegimenReasons.get(r?.id)||(r?.prescriptionEmissionBlocked===true?(r.prescriptionEmissionBlockReason||'Emissão prescritiva bloqueada: falta contrato clínico suficiente para este esquema.'):'');
}

// Presentation units are explicit. Tablets, grams and actuations never become mL.
export function calculateQuantityDose(i){
 const weight=number(i.weight),dose=number(i.dose),strength=number(i.strength);
 const times=i.single?1:number(i.times||24/number(i.interval));
 if(!['fixed','kg-dose','kg-day'].includes(i.basis))throw Error('Base de dose inválida.');
 if(!['comprimido(s)','cápsula(s)','pastilha(s)','g','gota(s)','jato(s)','sachê(s)','supositório(s)'].includes(i.quantityUnit))throw Error('Unidade de administração inválida.');
 const raw=i.basis==='fixed'?dose:i.basis==='kg-dose'?dose*weight:dose*weight/times;
 const caps=[i.maxDose?number(i.maxDose):Infinity,i.maxDay?number(i.maxDay)/times:Infinity,i.maxKgDay?number(i.maxKgDay)*weight/times:Infinity];
 const cap=Math.min(...caps),capped=Math.min(raw,cap),step=number(i.step||1),exactQuantity=capped/strength;
 let quantity=Math.round((exactQuantity+1e-12)/step)*step;
 if(quantity*strength>cap+1e-8)quantity=Math.floor((exactQuantity+1e-12)/step)*step;
 quantity=Number(quantity.toPrecision(12));
 if(quantity<=0)throw Error('A apresentação não permite medir esta dose; escolha outra apresentação.');
 const administered=quantity*strength,delta=(administered-capped)/capped*100;
 if(Math.abs(delta)>5+1e-9)throw Error('Esta apresentação altera a dose em mais de 5%. Selecione uma concentração ou forma compatível.');
 const reverseDose=quantity*strength;
 if(![quantity,administered,raw,reverseDose].every(Number.isFinite))throw Error('Cálculo fora da faixa operacional.');
 return {kind:'quantity',weight,raw,capped,cap:Number.isFinite(cap)?cap:null,cappedByLimit:raw>cap,practicalQuantity:quantity,quantityUnit:i.quantityUnit,administered,unit:i.unit,times,interval:i.interval,single:!!i.single,perDay:administered*times,perKgDose:administered/weight,perKgDay:administered*times/weight,delta,reverseDose,mathOk:Math.abs(reverseDose-administered)<1e-9};
}

// Oral rehydration is measured in mL of prepared solution, never in a fictitious
// mass of drug. A course is not a dose to repeat at an hourly interval.
export function calculateFluidVolume(i){
 const weight=number(i.weight),factor=i.fluidBasis==='kg-course'?weight:1;
 if(!['fixed-event','kg-course'].includes(i.fluidBasis)||!(weight>0))throw Error('Base ou peso inválido para hidratação.');
 const min=number(i.volumeMin)*factor,max=number(i.volumeMax)*factor;
 const target=i.volumeTarget===undefined?null:number(i.volumeTarget)*factor;
 if(![min,max].every(Number.isFinite)||min<=0||max<min||target!==null&&(!Number.isFinite(target)||target<min||target>max))throw Error('Faixa de volume inválida.');
 const tidy=v=>Number(v.toPrecision(12));
 return {kind:'fluid',basis:i.fluidBasis,weight,minVolume:tidy(min),maxVolume:tidy(max),targetVolume:target===null?null:tidy(target),reverseMin:tidy(min/weight),reverseMax:tidy(max/weight),reverseTarget:target===null?null:tidy(target/weight),unit:'mL',mathOk:true};
}

export function prepareAdditionalRegimen(r,p,presentationIndex=0,durationChoice=''){
 const emissionBlockReason=regimenPrescriptionBlockReason(r);if(emissionBlockReason)throw Error(emissionBlockReason);
 const requiredChecks=r.requiredClinicalChecks||[];
 if(requiredChecks.length&&(!Array.isArray(p.regimenChecks)||requiredChecks.some(c=>!p.regimenChecks.includes(c.id))))throw Error('Confirme as condições clínicas específicas deste esquema antes de calcular ou emitir.');
 const age=p.age||p,months=Number(age.years||0)*12+Number(age.months||0)+Number(age.days||0)/30.4375,weight=number(p.weight);
 const v=r.presentations[presentationIndex];if(!v)throw Error('Apresentação não encontrada.');
 if(v.minMonths!==undefined&&(months<v.minMonths||(v.minExclusive&&months===v.minMonths))||v.maxMonths!==undefined&&months>=v.maxMonths)throw Error('Apresentação fora da faixa etária.');
 if(v.minWeight!==undefined&&weight<v.minWeight||v.maxWeight!==undefined&&weight>v.maxWeight)throw Error('Apresentação fora da faixa de peso.');
 const selectedDuration=durationChoice||r.defaultDuration||'';
 if(r.durationOptions&&!r.durationOptions.includes(selectedDuration))throw Error('Selecione uma das durações documentadas.');
 const band=r.doseBands?.find(b=>(b.minMonths===undefined||months>=b.minMonths)&&(b.maxMonths===undefined||months<b.maxMonths)&&(b.maxMonthsInclusive===undefined||months<=b.maxMonthsInclusive)&&(b.monthsAbove===undefined||months>b.monthsAbove)&&(b.minWeight===undefined||weight>=b.minWeight)&&(b.maxWeight===undefined||weight<=b.maxWeight)&&(b.weightAbove===undefined||weight>b.weightAbove));
 if(r.doseBands&&!band)throw Error('Não há faixa posológica compatível com idade e peso.');
 const effective={...r,...band},duration=selectedDuration||effective.duration;
 const phases=(effective.phases||[{}]).map(phase=>{
  const f={...effective,...phase,weight};let result;
  if(f.delivery==='topical'||f.delivery==='instruction')result={kind:f.delivery,text:f.directions||r.instructions,mathOk:null};
  else if(f.delivery==='fluid')result=calculateFluidVolume(f);
  else if(v.quantityUnit)result=calculateQuantityDose({...f,strength:v.amount,quantityUnit:v.quantityUnit,step:v.step||1});
  else result={kind:'liquid',...calculateDose({...f,concentrationUnit:f.unit,amount:v.amount,volume:v.volume||1,interval:f.times?24/f.times:f.interval,step:v.step||.1,dropFactor:v.dropFactor||''})};
  if(f.injection){
   if(result.kind!=='liquid'||!['intravenosa','intramuscular','intramuscular na face ântero-lateral da coxa','subcutânea'].includes(f.injection.route)||!f.injection.method?.trim()||!v.preparation?.trim()||f.infusion||f.nebulizerVolume!==undefined)throw Error('Injeção exige líquido, preparo, via e técnica explícitas, sem preparo de infusão/nebulização simultâneo.');
   if(f.injection.route==='intravenosa'&&!r.route?.includes('IV')||f.injection.route.startsWith('intramuscular')&&!r.route?.includes('INTRAMUSCULAR')||f.injection.route==='subcutânea'&&!r.route?.includes('SUBCUTÂNEA'))throw Error('Via de injeção incompatível com o esquema.');
   result.injection={route:f.injection.route,method:f.injection.method,preparation:v.preparation||''};
  }
  if(f.nebulizerVolume!==undefined){
   if(result.kind!=='liquid')throw Error('Nebulização exige apresentação líquida.');
   const finalVolume=number(f.nebulizerVolume),drugVolume=result.practicalVolume,diluentVolume=finalVolume-drugVolume;
   if(!Number.isFinite(finalVolume)||finalVolume<=0||diluentVolume < -1e-8)throw Error('Volume final de nebulização incompatível com a apresentação.');
   result.nebulization={drugVolume,diluentVolume:Math.max(0,diluentVolume),finalVolume,finalConcentration:result.administered/finalVolume,unit:f.unit,reverseDose:result.administered/finalVolume*finalVolume};
  }
  if(f.infusion){
   if(result.kind!=='liquid'||!r.route?.includes('IV'))throw Error('Infusão requer apresentação líquida e via intravenosa explícita.');
   const targetConcentration=number(f.infusion.concentration),minutes=number(f.infusion.minutes),drugVolume=result.practicalVolume,exactFinalVolume=result.administered/targetConcentration;
   const finalStep=f.infusion.step?number(f.infusion.step):null,finalVolume=finalStep?Number((Math.ceil((exactFinalVolume-1e-12)/finalStep)*finalStep).toPrecision(12)):exactFinalVolume;
   const concentration=result.administered/finalVolume,diluentVolume=finalVolume-drugVolume,rate=finalVolume*60/minutes;
   if(![concentration,minutes,finalVolume,rate].every(n=>Number.isFinite(n)&&n>0)||diluentVolume < -1e-8||!f.infusion.diluent)throw Error('Preparo de infusão incompatível: conferir concentração, volume final e tempo.');
   if(f.infusion.maxMgPerHour!==undefined&&(f.unit!=='mg'||result.administered*60/minutes>number(f.infusion.maxMgPerHour)+1e-8))throw Error('Velocidade de infusão excede o limite documentado.');
   if(v.concentrated&&(v.readyToUse||diluentVolume<=0||targetConcentration>=number(v.amount)/number(v.volume||1)))throw Error('Apresentação concentrada exige diluição para concentração menor antes da infusão.');
   if(v.containerLabel&&!['frasco(s)','ampola(s)'].includes(v.containerLabel))throw Error('Recipiente de infusão inválido.');
   result.infusion={targetConcentration,drugVolume,finalVolume,diluentVolume:Math.max(0,diluentVolume),concentration,minutes,rate,diluent:f.infusion.diluent,reverseDose:concentration*finalVolume,preparation:v.preparation||'',readyToUse:!!v.readyToUse,concentrated:!!v.concentrated,containerLabel:v.containerLabel||'frasco(s)',vials:v.vialAmount?Math.ceil((result.administered-1e-9)/v.vialAmount):null};
  }
  if(f.doseComponent){
   if(!Number.isFinite(result.administered)||!f.companion?.name)throw Error('Associação exige dose e componentes definidos.');
   const ratio=number(f.companion.ratio);
   result.components=[{name:f.doseComponent,amount:result.administered},{name:f.companion.name,amount:result.administered*ratio}];
   if(result.infusion)result.infusion.components=result.components.map(c=>({...c,concentration:c.amount/result.infusion.finalVolume}));
  }
  if(f.doseLabel)result.doseLabel=f.doseLabel;
  const schedule=f.schedule||(['topical','instruction'].includes(f.delivery)?'':f.single?'dose única':'a cada '+fmt(f.interval)+' horas');
  return {label:phase.label||'',duration:phase.duration??duration,schedule,result};
 });
 const course=effective.acuteCourse?{window:effective.acuteCourse,maximumAdministrations:phases.length,maximumTotal:phases.reduce((sum,x)=>sum+x.result.administered,0),unit:phases[0].result.unit}:null;
 if(course&&(!phases.every(x=>x.result.single&&x.result.unit===course.unit)||!Number.isFinite(course.maximumTotal)))throw Error('Etapas de curso agudo incompatíveis.');
 const snapshot={regimenId:r.id,version:r.reviewedAt,presentationIndex,durationChoice:selectedDuration,ageMonths:months,weight,phases,...(requiredChecks.length?{clinicalChecks:requiredChecks.map(c=>c.id)}:{}),...(course?{course}:{}),...(effective.acuteRescue?{acuteRescue:true}:{})};
 return {...effective,presentation:v.label,duration,phases,result:phases[0].result,course,calculation:snapshot,reference:r.sources.join(' · ')+' · revisão documental '+r.reviewedAt};
}

export function administrationText(result){
 if(['topical','instruction'].includes(result.kind))return result.text;
 if(result.kind==='fluid')return result.targetVolume===null?`${fmt(result.minVolume,2)}–${fmt(result.maxVolume,2)} mL`:`${fmt(result.targetVolume,2)} mL de solução preparada como volume inicial`;
 const quantity=result.kind==='quantity'?`${fmt(result.practicalQuantity,4)} ${result.quantityUnit}`:result.dropFactor?`${fmt(result.exactDrops,4)} gota(s), equivalentes a ${fmt(result.practicalVolume,4)} mL`:`${fmt(result.practicalVolume,4)} mL`;
 const unit=result.unit==='U'?'UI':result.unit;
 const mass=result.components?result.components.map(c=>`${fmt(c.amount,4)} ${unit} de ${c.name}`).join(' + '):`${fmt(result.administered,4)} ${unit}${result.doseLabel?' de '+result.doseLabel:''}`;
 return `${quantity} (${mass})`;
}

export function preparedPrescriptionText(p){
 const phases=p.phases||[{result:p.result,schedule:p.result.single?'dose única':'a cada '+fmt(p.result.interval)+' horas',duration:p.duration}];
 const text=phases.map(phase=>{
  if(['topical','instruction'].includes(phase.result.kind))return `${phase.result.text}${phase.duration?'; '+phase.duration:''}.`;
  const iv=phase.result.infusion;
  const mass=phase.result.components?phase.result.components.map(c=>`${fmt(c.amount,4)} ${phase.result.unit} de ${c.name}`).join(' + '):`${fmt(phase.result.administered,4)} ${phase.result.unit}`;
  const injection=phase.result.injection;
  if(injection)return `${phase.label?phase.label+': ':''}${injection.preparation} Retirar ${fmt(phase.result.practicalVolume,4)} mL (${mass}). Via ${injection.route}: ${injection.method}. ${phase.schedule}${phase.duration?'; '+phase.duration:''}.`;
  const concentrationText=iv?.components?iv.components.map(c=>`${fmt(c.concentration,4)} ${phase.result.unit} de ${c.name}/mL`).join(' + '):iv?`${fmt(iv.concentration,4)} ${phase.result.unit}/mL`:'';
  if(iv){
   const dilution=iv.diluentVolume>1e-8?`Acrescentar ${fmt(iv.diluentVolume,4)} mL de ${iv.diluent}, obtendo ${fmt(iv.finalVolume,4)} mL a ${concentrationText}.`:`Usar sem diluente adicional: volume final ${fmt(iv.finalVolume,4)} mL a ${concentrationText}.`;
   return `${phase.label?phase.label+': ':''}${iv.preparation}${iv.vials?` Preparar ${iv.vials} ${iv.containerLabel||'frasco(s)'} para esta dose.`:''} Retirar ${fmt(iv.drugVolume,4)} mL da solução ${iv.concentrated?'concentrada':iv.readyToUse?'pronta':'reconstituída'} (${mass}). ${dilution} Infundir por via intravenosa em ${fmt(iv.minutes)} minutos, a ${fmt(iv.rate,4)} mL/h, ${phase.schedule}${phase.duration?'; '+phase.duration:''}.`;
  }
  const n=phase.result.nebulization,preparation=n?`Colocar no nebulizador ${administrationText(phase.result)}. ${n.diluentVolume?`Acrescentar ${fmt(n.diluentVolume,4)} mL de solução de cloreto de sódio 0,9%, completando para ${fmt(n.finalVolume,4)} mL`:`Volume final ${fmt(n.finalVolume,4)} mL, sem diluente adicional`}. Nebulizar`:`${p.route?.startsWith('HOSPITALAR')?'Volume da apresentação a preparar:':'Administrar'} ${administrationText(phase.result)}`;
  return `${phase.label?phase.label+': ':''}${preparation}, ${phase.schedule}${phase.duration?'; '+phase.duration:''}.`;
 }).join('\n');
 return p.course?`ADMINISTRAÇÃO EXCLUSIVA NA UNIDADE ASSISTENCIAL. ${p.duration}. Somar doses já recebidas e executar repetições apenas se necessárias.\n${text}\nLimite deste curso: ${p.course.maximumAdministrations} administrações, somando até ${fmt(p.course.maximumTotal,4)} ${p.course.unit}; não corresponde a esquema domiciliar ou total diário contínuo.`:text;
}
