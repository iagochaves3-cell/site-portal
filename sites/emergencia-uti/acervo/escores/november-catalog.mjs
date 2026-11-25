// Additions keep their source-specific implementation and clinical metadata together.
import {pediatricOutcomeScores} from './pediatric-outcomes-2026.mjs';
import {pediatricSubspecialtyScores} from './pediatric-subspecialties-nov2026.mjs';
import {pediatricClinicalAdditions} from './pediatric-clinical-november.mjs';
import {acutePediatricExpansion} from './acute-pediatric-expansion.mjs';
import {acuteScores} from './acute-scores-202611.mjs';
import {adultMedicineScores} from './adult-medicine-expansion.mjs';
import {multidisciplinaryScores} from './multispecialty-clinical-2026.mjs';

export const novemberScores = [
  ...pediatricClinicalAdditions, ...acutePediatricExpansion, ...pediatricSubspecialtyScores,
  ...acuteScores, ...adultMedicineScores, ...multidisciplinaryScores, ...pediatricOutcomeScores,
];

function uniqueTerms(values) {
  const seen = new Set();
  return values.filter(value => {
    if (typeof value !== 'string' || !value.trim()) return false;
    const key = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const novemberDiscovery = Object.fromEntries(novemberScores.map(score => {
  const terms = uniqueTerms([...score.conditions, ...(score.keywords || []), ...(score.aliases || []), score.name]);
  const keywords = terms.filter(term => term.length <= 60).slice(0, 4);
  const searchTerms = uniqueTerms(score.searchTerms || []).filter(term => term.length <= 60);
  return [score.id, [keywords, searchTerms]];
}));
