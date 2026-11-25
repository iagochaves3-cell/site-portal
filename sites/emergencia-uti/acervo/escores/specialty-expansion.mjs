import {specialtyExpansionPart as pediatricDermatology} from './specialty-ped-derm.mjs';
import {specialtyExpansionPart as surgeryRheumatology} from './specialty-surgery-rheum.mjs';
import {specialtyExpansionPart as cardiologyPulmonology} from './specialty-cardio-pulm.mjs';
import {specialtyExpansionPart as internalInfectious} from './specialty-internal-infect.mjs';
// Esta rodada preserva flags e contratos das sete expansões históricas.
export const specialtyExpansion=[...pediatricDermatology,...surgeryRheumatology,...cardiologyPulmonology,...internalInfectious].map(score=>({...score,wave7:false,wave8:true,reviewDate:(score.id==='step-by-step'||score.id==='duke-treadmill'||score.id==='duke-alexander-1998'||score.id==='duke-mark-1991')?score.reviewDate:'04/10/2026'}));
