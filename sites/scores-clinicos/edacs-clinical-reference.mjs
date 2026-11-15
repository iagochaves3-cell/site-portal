/** Síntese funcional própria: EDACS clínico, Box 3, Than 2014; explicitação clínica Than 2016.
 * Não implementa EDACS-ADP, ECG, troponina, probabilidade ou decisão de alta. */
export const PROFILE = 'edacs-clinical-2014-2016-manual-v1';
export const CONFIRMATIONS = Object.freeze([
  'emergencyDepartmentAssessmentConfirmed', 'possibleCardiacSymptomsConfirmed',
  'symptomsAtLeastFiveMinutesConfirmed', 'initialPresentationAssessmentConfirmed',
  'sameEpisodeConfirmed', 'professionalRubricReviewConfirmed',
  'patientReportReliableConfirmed', 'noMissingImputationConfirmed'
]);
export const RISK_FACTORS = Object.freeze([
  'prematureFamilyHistory', 'dyslipidaemia', 'diabetes', 'hypertension', 'currentSmoking'
]);
export const SYMPTOMS = Object.freeze([
  'diaphoresis', 'armOrShoulderRadiation', 'inspiratoryPain', 'palpationReproducesPain'
]);
export const RED_FLAGS = Object.freeze(['abnormalVitalSigns', 'ongoingPain', 'crescendoPain']);
const BOOLEAN_FIELDS = [...RISK_FACTORS, ...SYMPTOMS, 'maleSex', 'knownCoronaryDisease', ...RED_FLAGS, 'redFlagAssessmentValidConfirmed'];
const KEYS = new Set(['profile', 'ageYearsCompleted', ...CONFIRMATIONS, ...BOOLEAN_FIELDS]);
const LIMITATIONS = 'EDACS clínico: pesos 2014, explicitação autoral 2016 e rubricas citadas 2010. Soma descritiva para adultos com possível quadro coronariano no pronto atendimento. A comparação com 16 é apenas a parcela numérica do protocolo: não estabelece baixo risco, não exclui SCA e não autoriza alta ou omissão de exames. ECG, troponinas, ADP e probabilidade individual não são calculados. Preparo local sem imputação é mais estrito que o estudo original e não tem calibração própria. Não atrasar avaliação ou cuidado para preencher o escore.';
const missing = x => x === null || x === undefined;
function capture(input) {
  const values = Object.create(null), issues = [];
  if (input === null || typeof input !== 'object') return {values, issues:[{field:'input',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};
  try { const p = Object.getPrototypeOf(input); if (p !== Object.prototype && p !== null) issues.push({field:'input',kind:'invalid',reason:'Protótipo não admitido.'}); }
  catch { issues.push({field:'input',kind:'invalid',reason:'Falha de protótipo; só preservar dados próprios efetivamente capturados.'}); }
  let keys;
  try { keys = Reflect.ownKeys(input); }
  catch { issues.push({field:'input',kind:'invalid',reason:'Enumeração falhou; achados não capturados permanecem desconhecidos.'}); return {values,issues}; }
  for (const key of keys) {
    if (typeof key !== 'string' || !KEYS.has(key)) { issues.push({field:'input',kind:'invalid',reason:'Campo não previsto.'}); continue; }
    let d;
    try { d = Object.getOwnPropertyDescriptor(input,key); }
    catch { issues.push({field:key,kind:'invalid',reason:'Descritor falhou; sem repetição.'}); continue; }
    if (!d || !Object.hasOwn(d,'value')) { issues.push({field:key,kind:'invalid',reason:'Exige propriedade própria de dados; getter não executado.'}); continue; }
    values[key] = d.value;
  }
  return {values,issues};
}

export function evaluateEdacsClinical(input) {
  const {values:v,issues} = capture(input);
  const add = (field,kind,reason) => issues.push({field,kind,reason});
  if (missing(v.profile)) add('profile','missing','Versão obrigatória.');
  else if (v.profile !== PROFILE) add('profile','invalid','Perfil incompatível; nenhuma conversão de versão.');
  const canonicalAge = typeof v.ageYearsCompleted === 'number' && Number.isInteger(v.ageYearsCompleted) && !Object.is(v.ageYearsCompleted,-0) && v.ageYearsCompleted >= 0 && v.ageYearsCompleted <= 120;
  if (missing(v.ageYearsCompleted)) add('ageYearsCompleted','missing','Idade em anos completos não estabelecida.');
  else if (!canonicalAge) add('ageYearsCompleted','invalid','Idade inteira canônica de 0–120; teto técnico local, sem arredondar/coagir.');
  else if (v.ageYearsCompleted < 18) add('ageYearsCompleted','outside_profile','Perfil adulto a partir do 18º aniversário.');
  for (const f of CONFIRMATIONS) {
    if (missing(v[f])) add(f,'missing','Preparo não estabelecido.');
    else if (typeof v[f] !== 'boolean') add(f,'invalid','Confirmação booleana obrigatória.');
    else if (!v[f]) add(f,'outside_profile','Preparo requerido recusado; não imputar normalidade.');
  }
  for (const f of BOOLEAN_FIELDS) if (!missing(v[f]) && typeof v[f] !== 'boolean') add(f,'invalid','Booleano canônico; desconhecido é null/undefined/sem propriedade.');
  const requiredMissingFields = [];
  for (const f of ['maleSex',...SYMPTOMS]) if (missing(v[f])) { requiredMissingFields.push(f); add(f,'missing','Parcela obrigatória desconhecida.'); }
  const validAdultAge = canonicalAge && v.ageYearsCompleted >= 18;
  const agePoints = validAdultAge ? (v.ageYearsCompleted <= 45 ? 2 : v.ageYearsCompleted >= 86 ? 20 : 4 + 2*Math.floor((v.ageYearsCompleted-46)/5)) : null;
  const lower = RISK_FACTORS.filter(f=>v[f]===true).length;
  const unknownRiskFields = RISK_FACTORS.filter(f=>typeof v[f]!=='boolean');
  const upper = lower + unknownRiskFields.length;
  let historyPoints = null, historyResolution = 'unresolved';
  if (validAdultAge && v.ageYearsCompleted > 50) { historyPoints=0; historyResolution='structurally_not_applicable_over_50'; }
  else if (validAdultAge && (v.knownCoronaryDisease===true || lower>=3)) { historyPoints=4; historyResolution=v.knownCoronaryDisease===true?'known_coronary_disease':'at_least_three_established_risk_factors'; }
  else if (validAdultAge && v.knownCoronaryDisease===false && upper<3) { historyPoints=0; historyResolution='fewer_than_three_even_if_unknown_factors_positive'; }
  if (validAdultAge && historyPoints===null) {
    const fields=[...(missing(v.knownCoronaryDisease)?['knownCoronaryDisease']:[]), ...(upper>=3 ? RISK_FACTORS.filter(f=>missing(v[f])) : [])];
    for (const f of fields) { requiredMissingFields.push(f); add(f,'missing','Desconhecido do grupo ainda não resolvido; preencher uma via suficiente não exige inventar os demais.'); }
  }
  const point = (f,w) => typeof v[f]==='boolean' ? (v[f]?w:0) : null;
  const components = {age:agePoints,maleSex:point('maleSex',6),conditionalHistory:historyPoints,
    diaphoresis:point('diaphoresis',3),armOrShoulderRadiation:point('armOrShoulderRadiation',5),
    inspiratoryPain:point('inspiratoryPain',-4),palpationReproducesPain:point('palpationReproducesPain',-6)};
  const numericalDetermined = Object.values(components).every(x=>x!==null);
  const status = issues.some(x=>x.kind==='invalid')?'invalid':issues.some(x=>x.kind==='outside_profile')?'outside_profile':issues.length||!numericalDetermined?'incomplete':'scored';
  const scoreComplete = status==='scored';
  const total = scoreComplete ? Object.values(components).reduce((a,b)=>a+b,0) : null;
  const unknownHistoryFields=['knownCoronaryDisease',...RISK_FACTORS].filter(f=>missing(v[f]));
  const allHistoryFieldsKnown=['knownCoronaryDisease',...RISK_FACTORS].every(f=>typeof v[f]==='boolean');
  const unresolvedFields=['maleSex',...SYMPTOMS,'knownCoronaryDisease',...RISK_FACTORS].filter(f=>missing(v[f]));
  const reportedRedFlags=RED_FLAGS.filter(f=>v[f]===true);
  const redFlagAssessmentComplete = RED_FLAGS.every(f=>typeof v[f]==='boolean') && v.redFlagAssessmentValidConfirmed===true &&
    CONFIRMATIONS.every(f=>v[f]===true) && validAdultAge && v.profile===PROFILE && !issues.some(x=>x.kind==='invalid');
  const reportedRedFlagPresent = reportedRedFlags.length?true:redFlagAssessmentComplete?false:null;
  return {
    profile:PROFILE,status,complete:scoreComplete,scoreComplete,total,
    components,scoreThreshold:scoreComplete?(total<16?'below_16':'at_least_16'):null,
    lowRisk:null,adpComplete:false,adpClassification:null,individualProbability:null,
    automaticDisposition:null,automaticTreatment:null,
    historyResolution,historyApplicable:validAdultAge?v.ageYearsCompleted<=50:null,
    riskFactorCountBounds:{minimum:lower,maximum:upper},allHistoryFieldsKnown,
    findingsComplete:scoreComplete && (v.ageYearsCompleted>50 || allHistoryFieldsKnown),
    applicableScoreFindingsComplete:scoreComplete && (v.ageYearsCompleted>50 || allHistoryFieldsKnown),
    unknownHistoryFields,unresolvedFields,requiredMissingFields,issues,
    reportedRedFlags,reportedRedFlagAssessmentComplete:redFlagAssessmentComplete,
    reportedRedFlagPresent,urgentReviewRecommended:reportedRedFlagPresent,
    urgencyScope:'reported_presentation_red_flags_only',
    limitations:LIMITATIONS,interpretation:scoreComplete?LIMITATIONS:null,
    sourceDataValidated:false,calendarValidated:false,currentDangerAssessed:false
  };
}
