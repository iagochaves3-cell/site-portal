/** Independent factual research reference. No diagnostic or treatment output.
 * JADAS10-ESR (Consolaro 2009); cJADAS10/JADAS3-10 (McErlane 2013).
 * 2021 cutoffs are a separately labelled interpretation. See contract.json.
 */
export const PROFILE = 'jadas10-esr-cjadas10-manual-2021-v1';
const FIELDS = new Set(['version','jiaEstablished','pediatricContextConfirmed','professionalAssessmentConfirmed','sameAssessmentConfirmed','activeJointCount','physicianGlobal','physicianScale','wellbeingGlobal','wellbeingScale','wellbeingInformant','esrMmHour','course','systemicFeatures']);
const SCALE = 1000000n;
const CUTOFFS = Object.freeze({
  'jadas10-esr': Object.freeze({oligo:[14000000n,40000000n,130000000n],poly:[27000000n,60000000n,170000000n]}),
  'cjadas10': Object.freeze({oligo:[11000000n,40000000n,120000000n],poly:[25000000n,50000000n,160000000n]})
}); // Total arithmetic uses 10^-7 units (ESR division by 10).
function snapshot(input) {
  if (input === null || typeof input !== 'object') return null;
  try {
    if (Array.isArray(input)) return null;
    const proto = Object.getPrototypeOf(input);
    if (proto !== Object.prototype && proto !== null) return null;
    const descriptors = Object.getOwnPropertyDescriptors(input);
    const out = Object.create(null);
    for (const key of Reflect.ownKeys(descriptors)) {
      if (typeof key !== 'string' || !FIELDS.has(key)) return null;
      const d = descriptors[key];
      if (!Object.hasOwn(d,'value')) return null;
      out[key] = d.value;
    }
    return out;
  } catch { return null; }
}
// Exact canonical decimal representation, with at most six fractional places.
// This is a technical input policy, not a clinically validated precision claim.
function millionths(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null;
  const [mantissa,expText='0'] = String(value).toLowerCase().split('e');
  const [whole,frac=''] = mantissa.split('.');
  const exp = Number(expText);
  let digits = BigInt(whole+frac);
  const shift = 6 + exp - frac.length;
  if (shift >= 0) return digits * (10n ** BigInt(shift));
  const divisor = 10n ** BigInt(-shift);
  return digits % divisor === 0n ? digits / divisor : null;
}
function exactText(units) {
  const integer = units / 10000000n;
  const fraction = String(units % 10000000n).padStart(7,'0').replace(/0+$/,'');
  return String(integer) + (fraction ? '.'+fraction : '');
}
function result(errors=[], warnings=[]) {
  return {profile:PROFILE,version:null,status:'incomplete',complete:false,totalComplete:false,total:null,totalExact:null,range:null,components:null,classificationAvailable:false,classification:null,classificationStatus:'total_incomplete',classificationIssues:[],errors,warnings};
}
export function evaluateJadas(input) {
  const out = result([],['O estado pelo índice não estabelece remissão, ausência de artrite/uveíte ou conduta. Manifestações extra-articulares exigem avaliação própria.']);
  const x = snapshot(input);
  if (!x) { out.errors.push({field:'input',code:'invalid_data_object'}); return out; }
  const error=(field,code)=>out.errors.push({field,code});
  const clinical = x.version === 'cjadas10';
  if (!clinical && x.version !== 'jadas10-esr') error('version','explicit_supported_version_required');
  else {out.version=x.version;out.range=[0,clinical?30:40];}
  for (const key of ['jiaEstablished','pediatricContextConfirmed','professionalAssessmentConfirmed','sameAssessmentConfirmed']) {
    if (x[key] !== true) error(key,'confirmation_required');
  }
  if (!Number.isInteger(x.activeJointCount) || x.activeJointCount < 0 || x.activeJointCount > 71) error('activeJointCount','integer_0_to_71_required');
  const globals={};
  for (const [key,scaleKey] of [['physicianGlobal','physicianScale'],['wellbeingGlobal','wellbeingScale']]) {
    const n=millionths(x[key]);
    if (n===null || n>10n*SCALE) error(key,'number_0_to_10_max_6_decimals_required');
    else globals[key]=n;
    if (x[scaleKey] !== 'vas-0-10-cm' && x[scaleKey] !== 'nrs-21') error(scaleKey,'supported_scale_required');
    else if (x[scaleKey]==='nrs-21' && n!==null && n % 500000n!==0n) error(key,'nrs_21_requires_half_point_steps');
  }
  if (x.wellbeingInformant !== 'patient' && x.wellbeingInformant !== 'parent') error('wellbeingInformant','one_informant_required');
  let esr=null;
  if (!clinical) {
    esr=millionths(x.esrMmHour);
    if (esr===null) error('esrMmHour','nonnegative_finite_number_max_6_decimals_required');
  } else if (Object.hasOwn(x,'esrMmHour') && x.esrMmHour !== undefined && x.esrMmHour !== null) {
    // No silent inclusion or substitution of an inactive laboratory field.
    if (millionths(x.esrMmHour)===null) error('esrMmHour','invalid_inactive_residual');
    else out.warnings.push('VHS residual fornecida foi desconsiderada: a versão selecionada é cJADAS10, sem laboratório.');
  }
  for (const [key,values] of [['course',['persistent-oligo','extended-oligo','rf-negative-poly','other','unknown']],['systemicFeatures',['absent','present','unknown']]]) {
    if (x[key] !== undefined && x[key] !== null && !values.includes(x[key])) error(key,'invalid_context_enum');
  }
  const courseConflict=x.course==='persistent-oligo' && Number.isInteger(x.activeJointCount) && x.activeJointCount>4;
  if (courseConflict) out.classificationIssues.push('Curso persistente oligo contradiz mais de quatro articulações ativas; rever categoria sem conversão automática para poli.');
  const courseGroup = x.course==='persistent-oligo'?'oligo':(x.course==='extended-oligo'||x.course==='rf-negative-poly')?'poly':null;
  if (!courseGroup) out.classificationIssues.push('Curso fora do recorte 2021, ausente ou desconhecido; não inferir grupo pela contagem atual.');
  if (x.systemicFeatures!=='absent') out.classificationIssues.push('Ausência de manifestações sistêmicas ativas não confirmada; este perfil não atribui estado 2021.');
  if (x.systemicFeatures==='present') out.warnings.push('Há manifestações sistêmicas ativas: JADAS/cJADAS não quantificam integralmente a atividade sistêmica; sJADAS é instrumento distinto.');
  if (out.errors.length) return out;
  const active = BigInt(Math.min(x.activeJointCount,10))*10000000n;
  const physician=globals.physicianGlobal*10n;
  const wellbeing=globals.wellbeingGlobal*10n;
  const lab=clinical?0n:(esr<=20n*SCALE?0n:esr>=120n*SCALE?100000000n:esr-20n*SCALE);
  const total=active+physician+wellbeing+lab;
  out.complete=out.totalComplete=true;out.status='scored';
  out.totalExact=exactText(total);out.total=Number(out.totalExact);
  out.components={activeJoints:Number(active)/1e7,physicianGlobal:Number(physician)/1e7,wellbeingGlobal:Number(wellbeing)/1e7,esrNormalized:clinical?null:Number(lab)/1e7};
  out.classificationStatus=courseConflict?'inconsistent_context':'unavailable_context';
  if (courseGroup && !courseConflict && x.systemicFeatures==='absent') {
    const cuts=CUTOFFS[x.version][courseGroup];
    const codes=['ID','MiDA','MoDA','HDA'];
    const labels=['Faixa inativa pelo índice','Atividade mínima pelo índice','Atividade moderada pelo índice','Atividade alta pelo índice'];
    const idx=total<=cuts[0]?0:total<=cuts[1]?1:total<=cuts[2]?2:3;
    out.classification={scheme:'ACR-2021-continuous-thresholds',group:courseGroup,code:codes[idx],label:labels[idx],thresholds:cuts.map(v=>Number(exactText(v)))};
    out.classificationAvailable=true;out.classificationStatus='classified';
    if (idx===0 && x.activeJointCount>0) out.warnings.push('A faixa ID pelo índice coexiste com articulações ativas nesta entrada; não significa ausência clínica de artrite.');
  }
  return out;
}
