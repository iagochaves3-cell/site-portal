import {s,n,ref,make} from './expanded-scores.mjs';
// Proposed identified Alexander et al. (1998) historical contract.
// LOCAL_ONLY candidate; never merge CathPCI ST<1 mm zeroing into this variant.
// Decimal arithmetic stays rational until serialization. No ECG interpretation.
const ids=['age','criteria_confirmed','minutes','st','angina'];
const rational=(value)=>{
 if(typeof value!=='string'&&typeof value!=='number')return null;
 if(typeof value==='number'&&(!Number.isFinite(value)||value<0))return null;
 let text=String(value);
 // A numeric API argument can stringify in exponent notation; user text cannot.
 if(typeof value==='number'&&text.includes('e')){
  const [coefficient,exponent]=text.split('e'),[whole,fraction='']=coefficient.split('.');
  const digits=whole+fraction,position=whole.length+Number(exponent);
  text=position<=0?'0.'+'0'.repeat(-position)+digits:position>=digits.length?digits+'0'.repeat(position-digits.length):digits.slice(0,position)+'.'+digits.slice(position);
 }
 // 256 characters is an operational input limit, not a clinical precision rule.
 if(text.length>256||!/^\d+(\.\d+)?$/.test(text))return null;
 const [whole,fraction='']=text.split('.');
 return {numerator:BigInt(whole+fraction),denominator:10n**BigInt(fraction.length)};
};
const compare=(a,b)=>a.numerator*b.denominator-b.numerator*a.denominator;
const integer=n=>({numerator:BigInt(n),denominator:1n});
const multiply=(a,n)=>({numerator:a.numerator*BigInt(n),denominator:a.denominator});
const subtract=(a,b)=>({numerator:a.numerator*b.denominator-b.numerator*a.denominator,denominator:a.denominator*b.denominator});
const decimal=a=>{
 const negative=a.numerator<0n,absolute=negative?-a.numerator:a.numerator;
 let whole=absolute/a.denominator,remainder=absolute%a.denominator,fraction='';
 while(remainder){remainder*=10n;fraction+=String(remainder/a.denominator);remainder%=a.denominator;}
 return (negative?'-':'')+String(whole)+(fraction?'.'+fraction:'');
};
export function validateDukeAlexander1998(values){
 if(!values||typeof values!=='object'||Array.isArray(values))return [...ids];
 const errors=[],parsed=Object.fromEntries(ids.map(id=>[id,rational(values[id])]));
 for(const id of ids)if(!parsed[id])errors.push(id);
 const inRange=(id,min,max,inclusive=true)=>{const value=parsed[id];if(value&&(compare(value,integer(min))<0n||(inclusive?compare(value,integer(max))>0n:compare(value,integer(max))>=0n)))errors.push(id);};
 inRange('age',18,75,false);inRange('minutes',0,40);inRange('st',0,20);
 if(parsed.criteria_confirmed&&compare(parsed.criteria_confirmed,integer(1))!==0n)errors.push('criteria_confirmed');
 if(parsed.angina&&![0,1,2].some(n=>compare(parsed.angina,integer(n))===0n))errors.push('angina');
 return [...new Set(errors)];
}
export function calculateDukeAlexander1998(values){
 const errors=validateDukeAlexander1998(values);
 if(errors.length)return {complete:false,total:null,errors,breakdown:[],audit:'Dados obrigatórios ausentes, inválidos ou fora do contexto desta variante histórica.'};
 const time=rational(values.minutes),rawST=rational(values.st),angina=rational(values.angina);
 const effectiveST=rawST; // No <1 mm floor in the 1998 DTS definition.
 const stPenalty=multiply(effectiveST,5),anginaPenalty=multiply(angina,4);
 const total=subtract(subtract(time,stPenalty),anginaPenalty),exactTotal=decimal(total);
 const level=compare(total,integer(-11))<=0n?'high':compare(total,integer(5))>=0n?'low':'medium';
 const category={high:'alto',medium:'intermediário',low:'baixo'}[level];
 return {complete:true,total:Number(exactTotal),exactTotal,displayValue:exactTotal.replace('.',','),level,
  label:`Alexander et al. (1998) · risco ${category}`,
  action:'Categoria histórica de Alexander et al. (1998), para consulta profissional no contexto da coorte e do teste descritos. Integrar avaliação cardiológica completa; não fornece diagnóstico, conduta terapêutica ou probabilidade individual de sobrevida.',
  breakdown:[{label:'Duração no Bruce padrão (min)',points:Number(decimal(time))},{label:'−5 × maior desvio líquido de ST (mm)',points:stPenalty.numerator===0n?0:-Number(decimal(stPenalty))},{label:'−4 × índice de angina',points:anginaPenalty.numerator===0n?0:-Number(decimal(anginaPenalty))}],
  audit:`Alexander et al. (1998): ${decimal(time)} − 5×${decimal(rawST)} − 4×${decimal(angina)}; ST líquido ${decimal(rawST)} mm, sem zerar valores <1 mm; cálculo decimal exato, sem arredondamento para classificar`,
  contractId:'duke-treadmill-alexander1998-historical',netST:decimal(rawST),historical:true};
}

const meta=f=>({...f,noPoints:true});
const R={
 original:ref('Alexander et al. · JACC 1998 · métodos, fórmula e faixas históricas','https://www.jacc.org/doi/10.1016/S0735-1097%2898%2900451-3'),
 originalPdf:ref('Alexander et al. · PDF original JACC 1998 · p.1658','https://www.jacc.org/doi/pdf/10.1016/S0735-1097%2898%2900451-3'),
 correction:ref('JACC 1999 · correção apenas de autoria · p.289','https://www.jacc.org/doi/10.1016/S0735-1097%2898%2900655-X'),
 ageLimit:ref('Kwok et al. · JACC 2002 · limitação prognóstica em ≥75 anos','https://www.sciencedirect.com/science/article/pii/S0735109702017692')
};
export const dukeAlexander1998=make({
 id:'duke-alexander-1998',name:'Duke · Alexander et al. (1998)',specialty:'Cardiologia',subtitle:'Variante histórica identificada · Bruce padrão · ST a 60 ms',
 population:'Coorte de dor torácica com cateterismo diagnóstico · formulário restrito a 18–<75 anos',max:40,range:'Índice contínuo histórico · menor é pior',unit:'índice',resultScale:false,precision:2,reviewDate:'07/10/2026',wave7:true,
 aliases:['Duke Alexander 1998','Alexander et al 1998','DTS Alexander 1998','Bruce Alexander 1998'],
 scope:'Consulta profissional da variante histórica avaliada em 3.225 pacientes com dor torácica e cateterismo diagnóstico até 90 dias após teste, em Duke, 1984–1994 (976 mulheres/2.249 homens). Excluídos cateterismo ou revascularização anteriores, cardiopatia valvar ou congênita significativa, infarto agudo na apresentação e alteração basal de ST-T que impede interpretação. Exige paciente apto a caminhar, teste supervisionado e limitado por sintomas no Bruce padrão e ECG interpretável. O formulário conserva a restrição de 18 a <75 anos do destino; ela não é um critério etário declarado no estudo de 1998. O profissional deve fornecer o maior desvio líquido de ST, depressão ou elevação, em qualquer derivação exceto aVR, medido 60 ms após J em relação ao segmento PR, e avaliar angina. Não converter outro protocolo ou interpretar ECG automaticamente.',
 eligibilityConfirmation:'Confirmei a compatibilidade com a coorte descrita, suas exclusões e o preparo profissional do teste Bruce padrão, ST e angina.',
 fields:[
  meta(n('age','Idade (anos)',18,75,'any','Restrição conservadora deste formulário: ≥18 e <75 anos; não é corte etário declarado por Alexander 1998.')),
  meta(s('criteria_confirmed','Coorte e preparo profissional confirmados',[[0,'Não confirmados / não avaliados'],[1,'Confirmados: dor torácica, cateterismo diagnóstico ≤90 dias após teste, exclusões ausentes, Bruce padrão, ECG interpretável, ST líquido e angina avaliados']],'Se qualquer critério ou dado estiver desconhecido, não confirmar e não calcular.')),
  meta(n('minutes','Duração no Bruce padrão (minutos)',0,40,'any','Tempo real em minutos. 0–40 é limite operacional do formulário, não máximo clínico validado.')),
  meta(n('st','Maior desvio líquido de ST (mm)',0,20,'any','Magnitude não negativa preparada por profissional: depressão ou elevação, exceto aVR, a 60 ms após J, em relação ao PR. Não inserir mV. Preservar valores <1 mm; não usar a regra CathPCI que os zera. 0–20 mm é limite operacional.')),
  meta(s('angina','Angina durante o exercício',[[0,'Ausente, após avaliação clínica'],[1,'Presente, sem limitar o exercício'],[2,'Angina limitou o exercício']],'Distinguir angina de dor não anginosa por avaliação profissional.'))
 ],
 calculationSuspended:false,review_status:'VALIDADO_CONTRATO_IDENTIFICADO',validate:validateDukeAlexander1998,
 sourceContractReview:{"status":"VALIDADO_CONTRATO_IDENTIFICADO","contractId":"duke-treadmill-alexander1998-historical","historical":true,"currentRegistryCoding":false,"copyright":"©1998 American College of Cardiology; Free Access segundo o editor. Nenhuma licença CC inferida; patch factual próprio, sem copiar artigo/tabela/figura.","exactContinuousVariantValidated":true,"automaticECGInterpretationValidated":false,"checkedAt":"2026-10-07T12:46:22.424656+00:00","sourceOriginalTextRetrievedBy":"HTML e PDF originais do editor extraídos integralmente por Exa; PDF binário e renderização não obtidos.","originalBodySha256":"e60accbd7867d9709122a2a605bd019ae987fc7021795463a4f48970ca733a53","originalPdfExtractedTextSha256":"3623f79a4218fed52bd767852f923fe2b185eb0464acbc0b2de7cb41813ffb5f","erratumBodySha256":"43d710bf90ba5f446163b11c071e7b3268457770a55c798575d0ceef82b8fe1b","locator":"Alexander 1998, p.1658 Methods/DTS; Fig.2/3; Study limitations. Erratum1999, p.289 altera apenas autoria.","identifiedBranchRecovery":{"previousBranchId":"clinical-duke-continuous-variant-contract-quarantine-r16","recoveredSourceContract":"duke-treadmill-alexander1998-historical","continuousGap4to5ResolvedForThisVariant":true,"publishedVerificationRequired":true},"generalVariantQuarantine":{"status":"QUARENTENA","closedByThisVariant":false,"reason":"Esta variante identificada define os intervalos contínuos históricos de Alexander 1998. Permanecem não reconciliadas as faixas literais de Nishime 2000 e SBC 2024. Kwok 1999 e CathPCI 4.4 conservam contratos separados; não declarar consenso Duke geral nem modificar o CathPCI já verificado."}},
 source_validation:{"validated":true,"scope":"Somente contrato histórico identificado Alexander 1998: coorte, Bruce padrão, desvio líquido de ST a 60 ms, angina 0/1/2, equação e faixas contínuas; restrição etária do produto declarada separadamente.","references":[{"entity":"JACC / American College of Cardiology; Duke University original authors incl. Daniel B. Mark","title":"Value of exercise treadmill testing in women","url":"https://www.jacc.org/doi/10.1016/S0735-1097%2898%2900451-3","body_sha256":"e60accbd7867d9709122a2a605bd019ae987fc7021795463a4f48970ca733a53","checked_at":"2026-10-07T12:46:22.424656+00:00","examined":true,"supports_claim":true,"locator":"Methods: Patient population / Exercise treadmill testing / Duke Treadmill Score; Fig2/3 captions; Discussion: Study limitations","retrieved_by":"Texto integral extraído do editor por Exa; não arquivo binário nem renderização visual."},{"entity":"JACC / American College of Cardiology; Duke University original authors incl. Daniel B. Mark","title":"Value of Exercise Treadmill Testing in Women (original PDF extraction)","url":"https://www.jacc.org/doi/pdf/10.1016/S0735-1097%2898%2900451-3","body_sha256":"3623f79a4218fed52bd767852f923fe2b185eb0464acbc0b2de7cb41813ffb5f","checked_at":"2026-10-07T12:46:22.424656+00:00","examined":true,"supports_claim":true,"locator":"p1658 Methods/DTS formula; p1662 Study limitations","retrieved_by":"Texto integral extraído do editor por Exa; não arquivo binário nem renderização visual."},{"entity":"JACC / American College of Cardiology; Duke University original authors incl. Daniel B. Mark","title":"Correction (author-list printing error only)","url":"https://www.jacc.org/doi/10.1016/S0735-1097%2898%2900655-X","body_sha256":"43d710bf90ba5f446163b11c071e7b3268457770a55c798575d0ceef82b8fe1b","checked_at":"2026-10-07T12:46:22.424656+00:00","examined":true,"supports_claim":true,"locator":"JACC33(1)January1999p289 complete correction body","retrieved_by":"Texto integral extraído do editor por Exa; não arquivo binário nem renderização visual."},{"entity":"Kwok et al. / JACC","title":"Prognostic value of the Duke treadmill score in the elderly","url":"https://www.sciencedirect.com/science/article/pii/S0735109702017692","version":"01/05/2002; DOI 10.1016/S0735-1097(02)01769-2","locator":"Methods: Patient populations / Exercise testing; Discussion: Study limitations","examined":true,"supports_claim":true,"checked_at":"2026-10-05T08:37:20.780Z","scope":"Referência de população já presente no destino; sustenta apenas restrição conservadora ≥75 anos, sem importar cortes, ST ou protocolos."}]},
 formula:'Alexander et al. (1998): D = tempo no Bruce padrão (min) −5×maior desvio líquido de ST (mm) −4×índice de angina (0/1/2). Não zerar ST <1 mm. Alto D≤−11; intermediário −11<D<5; baixo D≥5. Classificar o valor contínuo sem arredondamento; 4<D<5 é intermediário.',
 compute:calculateDukeAlexander1998,
 limits:'Coorte histórica selecionada de pacientes internados com dor torácica e cateterismo até 90 dias, sujeita a viés de encaminhamento/verificação. Não extrapolar a assintomáticos, pediatria, idade ≥75, instabilidade aguda, ECG basal não interpretável, teste tecnicamente inadequado, bicicleta, Bruce modificado, Naughton ou estresse farmacológico. Respeitar as exclusões e o contexto descritos acima. Não interpreta ECG, corrige ST basal, diagnostica SCA, decide tratamento ou cateterismo, nem fornece mortalidade/sobrevida individual. A faixa usual observada −25 a +15 não é limite de validade. Idade 18–<75 e entradas 0–40 min/0–20 mm são restrições conservadoras/operacionais do destino. Variante separada de CathPCI 4.4, Kwok 1999 e Nishime 2000; não consenso Duke geral nem codificação atualCathPCI 5.1.',
 sources:[R.original,R.originalPdf,R.correction,R.ageLimit]
});
