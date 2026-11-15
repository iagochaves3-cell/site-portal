// Original Mark 1991 scalar formula; continuous risk groups explicitly documented by Kwok 1999.
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
export function validateDukeMark1991(values){
 if(!values||typeof values!=='object'||Array.isArray(values))return [...ids];
 const errors=[],parsed=Object.fromEntries(ids.map(id=>[id,rational(values[id])]));
 for(const id of ids)if(!parsed[id])errors.push(id);
 const inRange=(id,min,max,inclusive=true)=>{const value=parsed[id];if(value&&(compare(value,integer(min))<0n||(inclusive?compare(value,integer(max))>0n:compare(value,integer(max))>=0n)))errors.push(id);};
 inRange('age',18,75,false);inRange('minutes',0,40);inRange('st',0,20);
 if(parsed.criteria_confirmed&&compare(parsed.criteria_confirmed,integer(1))!==0n)errors.push('criteria_confirmed');
 if(parsed.angina&&![0,1,2].some(n=>compare(parsed.angina,integer(n))===0n))errors.push('angina');
 return [...new Set(errors)];
}
export function calculateDukeMark1991(values){
 const errors=validateDukeMark1991(values);
 if(errors.length)return {complete:false,total:null,errors,breakdown:[],audit:'Dados obrigatórios ausentes, inválidos ou fora do contexto desta fórmula.'};
 const time=rational(values.minutes),st=rational(values.st),angina=rational(values.angina);
 const stPenalty=multiply(st,5),anginaPenalty=multiply(angina,4);
 const total=subtract(subtract(time,stPenalty),anginaPenalty),exactTotal=decimal(total);
 const level=compare(total,integer(-10))<0n?'high':compare(total,integer(5))>=0n?'low':'medium';
 return {complete:true,total:Number(exactTotal),exactTotal,displayValue:exactTotal.replace('.',','),level,
  label:`Mark 1991 / Kwok 1999 · risco ${{high:'alto',medium:'intermediário',low:'baixo'}[level]}`,
  action:'Categoria prognóstica da fórmula identificada, para avaliação cardiológica. Integrar sintomas, qualidade do teste e contexto clínico; não determina diagnóstico, alta, cateterismo ou tratamento isoladamente.',
  breakdown:[{label:'Tempo no Bruce padrão (min)',points:Number(decimal(time))},{label:'−5 × maior desvio de ST (mm)',points:stPenalty.numerator===0n?0:-Number(decimal(stPenalty))},{label:'−4 × índice de angina',points:anginaPenalty.numerator===0n?0:-Number(decimal(anginaPenalty))}],
  audit:`Mark 1991 / faixas Kwok 1999: ${decimal(time)} − 5×${decimal(st)} − 4×${decimal(angina)}; classificação decimal exata sem arredondamento; ST informado preservado`,
  contractId:'duke-mark1991-continuous-kwok1999',effectiveST:decimal(st),historical:true};
}

import {make} from "./expanded-scores.mjs";
export const dukeMark1991=make({...{
  "id": "duke-mark-1991",
  "name": "Duke · Mark 1991 / Kwok 1999",
  "specialty": "Cardiologia",
  "subtitle": "Fórmula integral · dados preparados por profissional",
  "population": "Adultos sintomáticos · restrição local: 18 a <75 anos",
  "max": 40,
  "range": "Índice contínuo · menor é pior",
  "unit": "pontos",
  "resultScale": false,
  "precision": 2,
  "reviewDate": "08/10/2026",
  "aliases": [
    "DTS",
    "Duke Treadmill Score",
    "Mark 1991",
    "Kwok 1999",
    "teste de esforço",
    "Bruce",
    "DAC"
  ],
  "scope": "Fórmula prognóstica original de Mark et al. (1991), com faixas contínuas explicitadas em Kwok et al. (1999), para adultos sintomáticos com suspeita de doença coronariana após teste supervisionado em esteira pelo Bruce padrão e ECG interpretável. Inserir tempo em minutos, maior desvio de ST durante ou após exercício em mm e angina 0/1/2, todos preparados e avaliados por profissional. O motor aplica integralmente a equação a esses dados; não interpreta ECG nem prepara a medida. Idade 18 a <75 anos é restrição conservadora do destino, não faixa de derivação afirmada pelo resumo de 1991.",
  "eligibilityConfirmation": "Confirmei população, Bruce padrão supervisionado, ECG interpretável e preparo profissional de todos os dados desta fórmula identificada.",
  "fields": [
    {
      "id": "age",
      "label": "Idade (anos)",
      "type": "number",
      "min": 18,
      "max": 75,
      "step": "any",
      "hint": "Restrição conservadora local: ≥18 e <75 anos; não extrapolar o prognóstico para ≥75 anos.",
      "noPoints": true
    },
    {
      "id": "criteria_confirmed",
      "label": "Contexto e preparo profissional confirmados",
      "type": "select",
      "options": [
        {
          "value": 0,
          "label": "Não confirmados / não avaliados"
        },
        {
          "value": 1,
          "label": "Confirmados: adulto sintomático, Bruce padrão, ECG interpretável, ST preparado e angina avaliada"
        }
      ],
      "hint": "Se houver exclusão, teste inadequado, dado ausente ou preparo não verificado, não calcular.",
      "noPoints": true
    },
    {
      "id": "minutes",
      "label": "Duração no Bruce padrão (minutos)",
      "type": "number",
      "min": 0,
      "max": 40,
      "step": "any",
      "hint": "Duração real, sem conversão automática de Naughton, bicicleta ou outro protocolo. 0–40 min é limite operacional local, não máximo clínico do modelo.",
      "noPoints": true
    },
    {
      "id": "st",
      "label": "Maior desvio de ST durante ou após exercício (mm)",
      "type": "number",
      "min": 0,
      "max": 20,
      "step": "any",
      "hint": "Medida preparada por profissional, em mm. Informar magnitude não negativa; não inserir mV. Esta fórmula mantém ST <1 mm e não aplica os agrupamentos de banco de dados de 1999. 0–20 mm é limite operacional local.",
      "noPoints": true
    },
    {
      "id": "angina",
      "label": "Angina durante o exercício",
      "type": "select",
      "options": [
        {
          "value": 0,
          "label": "Ausente, após avaliação"
        },
        {
          "value": 1,
          "label": "Presente, sem limitar o exercício"
        },
        {
          "value": 2,
          "label": "Angina limitou o exercício"
        }
      ],
      "noPoints": true
    }
  ],
  "calculationSuspended": false,
  "review_status": "VALIDADO_CONTRATO_IDENTIFICADO",
  "sourceContractReview": {
    "status": "VALIDADO_CONTRATO_IDENTIFICADO",
    "contractId": "duke-mark1991-continuous-kwok1999",
    "checkedAt": "2026-10-08T07:43:59.182711+00:00",
    "exactContinuousVariantValidated": true,
    "automaticECGInterpretationValidated": false,
    "survivalNomogramImplemented": false,
    "sourceScope": "Resumo original integral no repositório institucional Duke para equação e índice de angina; métodos originais JAMA1999 para Bruce e três intervalos contínuos. Não reproduz todo o protocolo/banco de dados de 1999.",
    "priorOpenItem": "clinical-duke-continuous-variant-contract-quarantine-r16",
    "otherVariantsInterchangeable": false
  },
  "source_validation": {
    "validated": true,
    "scope": "Equação escalar original e significado dos três inputs; interpretação contínua identificada. Sem nomograma, mortalidade individual, conversão de protocolo ou interpretação automática do ECG.",
    "references": [
      {
        "url": "https://scholars.duke.edu/publication/734247",
        "entity": "Duke University Scholars; original MarkDB etal, NEJM",
        "title": "Prognostic value of a treadmill exercise score in outpatients with suspected coronary artery disease.",
        "version": "1991-09-19",
        "doi": "10.1056/NEJM199109193251204",
        "locator": "Original abstract methods/formula/inputcodes L25–26; low≥5/high<−10 L27–28; identityL17–23.",
        "examined": true,
        "supports_claim": true,
        "checked_at": "2026-10-08T07:41:17.325Z",
        "examined_scope": "Full original abstract and publication metadata exposed on author institutional repository; publisher fulltext not fetched (403); not full original nomogram or entire1991paper.",
        "reliability": "Original study authored by score creators, public author institutional scholarly record; exact formula and population."
      },
      {
        "url": "https://jamanetwork.com/journals/jama/fullarticle/191658?resultClick=1",
        "entity": "JAMA / Kwok JMF, MillerTD, ChristianTF, HodgeDO, GibbonsRJ (Mayo Clinic/Mayo Foundation)",
        "title": "Prognostic Value of a Treadmill Exercise Score in Symptomatic Patients With Nonspecific ST-T Abnormalities on Resting ECG",
        "version": "1999-09-15",
        "doi": "10.1001/jama.282.11.1047",
        "locator": "IdentityL48–80; entire methodsL134–157, especiallyL155; resultsL187–219; limitationsL223–234.",
        "examined": true,
        "supports_claim": true,
        "checked_at": "2026-10-08T07:42:00.564Z",
        "examined_scope": "Original pertinent fullmethods, results, restrictions, attribution to Duke1991ref26 and metadata, no pixel/PDF examination.",
        "reliability": "Peer-reviewed original validation research, exact prose states all three bands and links to priorDuke classification; sufficient precise operational boundary evidence, not secondary majority."
      }
    ]
  },
  "formula": "Mark 1991: D = tempo no Bruce padrão (min) −5×maior desvio de ST (mm) −4×índice de angina. Angina: 0 ausente; 1 presente sem limitar; 2 limitante. Faixas contínuas Kwok 1999: alto D<−10; intermediário −10≤D<5; baixo D≥5. Preservar ST <1 mm e classificar o resultado exato sem arredondamento.",
  "limits": "Avaliação cardiológica consultiva de população selecionada; não aplicar a assintomáticos, pediatria, idade ≥75, instabilidade aguda, ECG basal não interpretável (incluindo BRE, pré-excitação, marcapasso, efeito digitálico), teste tecnicamente inadequado ou dados não avaliados. Não extrapolar as coortes examinadas a cardiopatia valvar, congênita, miocardiopatia ou revascularização prévia. Não converte Naughton, Bruce modificado, bicicleta ou estresse farmacológico. Não fornece mortalidade/sobrevida individual, nomograma, diagnóstico de SCA ou decisão terapêutica. A faixa −25 a +15 descrita no resumo original é observada, não limite universal. Idade 18–<75 e inputs 0–40 min/0–20 mm são restrições locais. CathPCI 4.4 e Alexander 1998 conservam seus próprios cortes históricos; não combinar versões.",
  "sources": [
    {
      "title": "Mark et al. · NEJM 1991 · equação original e angina (resumo no Duke Scholars)",
      "url": "https://scholars.duke.edu/publication/734247"
    },
    {
      "title": "Kwok et al. · JAMA 1999 · métodos: três intervalos contínuos e Bruce padrão",
      "url": "https://jamanetwork.com/journals/jama/fullarticle/191658?resultClick=1"
    }
  ]
},validate:validateDukeMark1991,compute:calculateDukeMark1991});
