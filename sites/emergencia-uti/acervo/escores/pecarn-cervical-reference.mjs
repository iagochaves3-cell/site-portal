/** Referência própria: apresentação PECARN cervical de Lee 2025, Box;
 * hierarquia do gráfico autoral PECARN atualizado em 04/06/2024.
 * Critérios previamente adjudicados, com desconhecidos explícitos.
 */
export const PROFILE = 'pecarn-cervical-lee2025-manual-v1';
export const CONFIRMATIONS = Object.freeze([
  'bluntTraumaConfirmed',
  'emergencyDepartmentAssessmentConfirmed',
  'referenceCohortCriteriaConfirmed',
  'beforeCervicalImagingResultsConfirmed',
  'sameEpisodeAssessmentConfirmed',
  'professionalAdjudicationConfirmed',
  'knownFindingsValidConfirmed',
  'examinationLimitationsReviewedConfirmed',
  'noMissingImputationConfirmed'
]);
export const FINDINGS = Object.freeze([
  'consciousnessRisk', 'abnormalAirwayBreathingCirculation',
  'focalNeurologicDeficit', 'selfReportedNeckPain', 'neckTenderness',
  'substantialHeadInjury', 'substantialTorsoInjury'
]);
const BOOLEAN_FINDINGS = FINDINGS.slice(1);
const KEYS = new Set(['profile', 'ageYearsCompleted', ...CONFIRMATIONS, ...FINDINGS]);
const LIMITATION = 'PECARN cervical: apresentação Lee 2025 / gráfico autoral 2024, critérios manualmente adjudicados. Categoria hierárquica para avaliação profissional após trauma fechado; não é soma, probabilidade individual ou diagnóstico. Nenhum ramo autoriza automaticamente imagem, retirada de imobilização, alta ou dispensa de avaliação. Ausência de fatores não exclui lesão. Os dados podem descrever uma avaliação anterior e não certificam a condição clínica atual.';

function capture(input) {
  const values = Object.create(null);
  const issues = [];
  if (input === null || typeof input !== 'object') {
    return {values, issues: [{field:'input', kind:'invalid', reason:'Objeto de dados obrigatório.'}]};
  }
  try {
    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) {
      issues.push({field:'input', kind:'invalid', reason:'Protótipo não admitido.'});
    }
  } catch {
    issues.push({field:'input', kind:'invalid', reason:'Falha de protótipo; preservar apenas achados próprios efetivamente capturados.'});
  }
  let keys;
  try { keys = Reflect.ownKeys(input); }
  catch {
    issues.push({field:'input', kind:'invalid', reason:'Enumeração falhou; dados não capturados permanecem desconhecidos.'});
    return {values, issues};
  }
  for (const key of keys) {
    if (typeof key !== 'string' || !KEYS.has(key)) {
      issues.push({field:'input', kind:'invalid', reason:'Campo não previsto.'});
      continue;
    }
    let descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(input, key); }
    catch {
      issues.push({field:key, kind:'invalid', reason:'Descritor falhou; sem releitura.'});
      continue;
    }
    if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
      issues.push({field:key, kind:'invalid', reason:'Descritor próprio de dados obrigatório; accessor não invocado.'});
      continue;
    }
    values[key] = descriptor.value;
  }
  return {values, issues};
}

const missing = value => value === null || value === undefined;

export function evaluatePecarnCervical(input) {
  const {values:v, issues} = capture(input);
  const add = (field, kind, reason) => issues.push({field, kind, reason});
  if (missing(v.profile)) add('profile', 'missing', 'Perfil obrigatório.');
  else if (v.profile !== PROFILE) add('profile', 'invalid', 'Perfil incompatível; nenhuma troca automática entre regras ou versões.');

  if (missing(v.ageYearsCompleted)) add('ageYearsCompleted', 'missing', 'Idade cronológica em anos completos não estabelecida.');
  else if (typeof v.ageYearsCompleted !== 'number' || !Number.isInteger(v.ageYearsCompleted) ||
           Object.is(v.ageYearsCompleted, -0) || v.ageYearsCompleted < 0 || v.ageYearsCompleted > 120) {
    add('ageYearsCompleted', 'invalid', 'Anos completos em número inteiro canônico, sem coerção ou arredondamento.');
  } else if (v.ageYearsCompleted >= 18) {
    add('ageYearsCompleted', 'outside_profile', 'Perfil pediátrico até antes do 18º aniversário.');
  }
  for (const field of CONFIRMATIONS) {
    if (missing(v[field])) add(field, 'missing', 'Preparo necessário não estabelecido.');
    else if (typeof v[field] !== 'boolean') add(field, 'invalid', 'Confirmação deve ser booleano.');
    else if (!v[field]) add(field, 'outside_profile', 'Preparo ou contexto necessário não confirmado.');
  }

  const known = Object.create(null);
  known.consciousnessRisk = ['high','altered','none'].includes(v.consciousnessRisk);
  if (!missing(v.consciousnessRisk) && !known.consciousnessRisk) {
    add('consciousnessRisk', 'invalid', 'Categoria de consciência não prevista; sem conversão automática de GCS/AVPU.');
  }
  for (const field of BOOLEAN_FINDINGS) {
    known[field] = typeof v[field] === 'boolean';
    if (!missing(v[field]) && !known[field]) add(field, 'invalid', 'Achado deve ser booleano; desconhecido é null/undefined/sem propriedade.');
  }

  const highPositive = v.consciousnessRisk === 'high' ||
    v.abnormalAirwayBreathingCirculation === true || v.focalNeurologicDeficit === true;
  const allHighNegative = known.consciousnessRisk && v.consciousnessRisk !== 'high' &&
    v.abnormalAirwayBreathingCirculation === false && v.focalNeurologicDeficit === false;
  const intermediatePositive = v.consciousnessRisk === 'altered' ||
    ['selfReportedNeckPain','neckTenderness','substantialHeadInjury','substantialTorsoInjury'].some(k => v[k] === true);
  const findingsComplete = FINDINGS.every(k => known[k]);
  const unresolvedFields = FINDINGS.filter(k => !known[k] && missing(v[k]));
  let candidate = null;
  if (highPositive) candidate = 'high_risk_criterion';
  else if (allHighNegative && intermediatePositive) candidate = 'cart_criterion_without_high_risk';
  else if (allHighNegative && findingsComplete) candidate = 'no_listed_factors';

  const requiredMissingFields = [];
  if (candidate === null) {
    const highUnknown = ['consciousnessRisk','abnormalAirwayBreathingCirculation','focalNeurologicDeficit']
      .filter(k => !known[k] && missing(v[k]));
    requiredMissingFields.push(...(highUnknown.length ? highUnknown : unresolvedFields));
    for (const field of requiredMissingFields) add(field, 'missing', 'Desconhecido pode mudar o ramo; não substituir por negativo.');
  }

  const reportedFindings = [];
  if (v.consciousnessRisk === 'high') reportedFindings.push('reported_high_risk_consciousness');
  if (v.consciousnessRisk === 'altered') reportedFindings.push('reported_altered_mental_status');
  for (const field of BOOLEAN_FINDINGS) if (v[field] === true) reportedFindings.push('reported_' + field);
  const status = issues.some(x => x.kind === 'invalid') ? 'invalid' :
    issues.some(x => x.kind === 'outside_profile') ? 'outside_profile' :
    issues.length || candidate === null ? 'incomplete' : 'classified';
  const complete = status === 'classified';
  const classification = complete ? candidate : null;
  const assessmentComplete = complete && findingsComplete;
  const reportedHighRiskAssessmentComplete =
    ['consciousnessRisk','abnormalAirwayBreathingCirculation','focalNeurologicDeficit'].every(k => known[k]) &&
    CONFIRMATIONS.every(k => v[k] === true) &&
    typeof v.ageYearsCompleted === 'number' && Number.isInteger(v.ageYearsCompleted) &&
    !Object.is(v.ageYearsCompleted,-0) && v.ageYearsCompleted >= 0 && v.ageYearsCompleted < 18 &&
    v.profile === PROFILE && !issues.some(x => x.kind === 'invalid');
  const urgentReviewRecommended = highPositive ? true : reportedHighRiskAssessmentComplete ? false : null;

  return {
    profile:PROFILE, status, complete, classificationComplete:complete,
    branchDetermined:complete, findingsComplete, assessmentComplete,
    classification, rulePositive:complete ? candidate !== 'no_listed_factors' : null,
    total:null, components:null, individualProbability:null,
    automaticImaging:null, automaticClearance:null, automaticDisposition:null,
    issues, unresolvedFields, requiredMissingFields, reportedFindings,
    knownRiskFloor:highPositive ? 'high_risk_criterion' : intermediatePositive ? 'cart_criterion' : null,
    reportedHighRiskAssessmentComplete, urgentReviewRecommended,
    reportedHighRiskCriterionPresent:urgentReviewRecommended,
    urgencyScope:'reported_upper_branch_criteria_only',
    interpretation:complete ? LIMITATION : null, limitations:LIMITATION,
    sourceDataValidated:false, calendarValidated:false, currentDangerAssessed:false
  };
}
