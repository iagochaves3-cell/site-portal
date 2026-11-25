// Descoberta por tema e por especialidades compartilhadas, sem duplicar instrumentos.
const aliases={
 alvarado:['MANTRELS','apendicite','appendicitis','abdome agudo','dor abdominal','cirurgia pediátrica'],
 pas:['Pediatric Appendicitis Score','Samuel','apendicite','abdome agudo','dor abdominal'],
 air:['Appendicitis Inflammatory Response','apendicite','abdome agudo'],
 pram:['Pediatric Respiratory Assessment Measure','asma','broncoespasmo','sibilância'],
 westley:['crupe','laringite','estridor'],
 wang:['bronquiolite','sibilância'],kristjansson:['bronquiolite','sibilância'],rdai:['Respiratory Distress Assessment Instrument','bronquiolite'],
 cds:['Clinical Dehydration Scale','desidratação','gastroenterite'],
 'gorelick-10':['gorelick10','desidratação','gastroenterite','diarreia'],
 'who-dehydration':['OMS','WHO','desidratação','gastroenterite','diarreia'],
 'pediatric-gcs':['Glasgow pediátrico','GCS','consciência','trauma craniano','TCE'],
 'pecarn-under2':['PECARN','TCE','trauma craniano','tomografia','menor de 2 anos'],
 'pecarn-over2':['PECARN','TCE','trauma craniano','tomografia','maior de 2 anos'],
 phoenix:['sepse','sepsis','disfunção orgânica'],psofa:['pSOFA','sepse','disfunção orgânica'],pelod2:['PELOD-2','disfunção orgânica'],pim3:['PIM-3','mortalidade','UTI pediátrica'],
 'pediatric-sirs':['SIRS','sepse','resposta inflamatória'],
 'bacterial-meningitis-score':['BMS','meningite','LCR','pleocitose'],
 kocher:['artrite séptica','quadril','sinovite'], 'kocher-caird':['artrite séptica','quadril','sinovite','Caird'],
 'yale-observation':['YOS','febre','infecção'],pts:['Pediatric Trauma Score','trauma pediátrico'],
 flacc:['Face Legs Activity Cry Consolability','dor pediátrica'],nips:['Neonatal Infant Pain Scale','dor neonatal'],
 capd:['Cornell Assessment of Pediatric Delirium','delirium','delírio'],
 'comfort-b':['sedação','conforto','dor'],sbs:['State Behavioral Scale','sedação'],wat1:['WAT-1','Withdrawal Assessment Tool','abstinência'],
 strongkids:['risco nutricional','desnutrição'],
 schwartz2009:['Schwartz','TFG','função renal','creatinina'],
 pucai:['Pediatric Ulcerative Colitis Activity Index','colite ulcerativa','retocolite'],twist:['torção testicular','escroto agudo'],
 apgar:['APGAR','nascimento','vitalidade'],silverman:['Silverman Andersen','Silverman Anderson','desconforto respiratório'],downes:['desconforto respiratório','neonato'],
 'thompson-hie':['Thompson','encefalopatia hipóxico isquêmica','asfixia'],snap2:['SNAP-II','SNAP2','neonato'],snappe2:['SNAPPE-II','SNAPPE2','neonato'],
 'oxygenation-index':['OI','IO','índice de oxigenação'],osi:['OSI','ISO','índice de saturação de oxigênio'],
 mcisaac:['Centor modificado','faringite','amigdalite','estreptococo'],
 'gcs-p':['Glasgow pupilar','Glasgow pupillary','GCS P'],nihss:['National Institutes of Health Stroke Scale','AVC','acidente vascular cerebral'],
 'sofa-original':['SOFA','sepse'],rass:['Richmond','agitação','sedação']
};
const sharedPediatric=new Set(['alvarado','scorad','easi','mcisaac','schwartz2009','kdigo-aki','pucai','twist','oxygenation-index','osi','pim3','pelod2','psofa']);
// Mesma normalização da busca global; mantém o primeiro rótulo de cada alias.
const normalizeAlias=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[₂]/g,'2').replace(/[^a-z0-9]+/g,' ').trim();
export function enrichCatalog(scores){
 for(const score of scores){
  score.aliases=[...new Set([...(score.aliases||[]),...(aliases[score.id]||[])])];
  const pediatric=score.specialty==='Pediatria'||score.specialty==='Neonatologia'||sharedPediatric.has(score.id);
  score.specialties=[...new Set([score.specialty,...(score.specialties||[]),...(pediatric?['Pediatria']:[])])];
  if(pediatric)score.aliases.push('pediátrico','pediátrica','criança');
  const seen=new Set();
  score.aliases=score.aliases.filter(alias=>{const key=normalizeAlias(alias);if(seen.has(key))return false;seen.add(key);return true;});
 }
 const alvarado=scores.find(s=>s.id==='alvarado');
 Object.assign(alvarado,{population:'Adultos e crianças · suspeita de apendicite',reviewDate:'01/10/2026',scope:'Suspeita de apendicite com história, exame e hemograma disponíveis. Alvarado completo de oito itens, com os critérios de temperatura e hemograma da tabela de 2017. Uso pediátrico exige cautela, especialmente em pré-escolares: sintomas podem ser difíceis de obter e o resultado não confirma nem exclui o diagnóstico isoladamente.',limits:alvarado.limits+' Em crianças, integrar exame seriado, laboratório e imagem; considerar os instrumentos pediátricos PAS e pARC nas respectivas populações. Não usar Alvarado isolado para decidir alta ou cirurgia.'});
 alvarado.sources.push({title:'WSES · diretriz de apendicite 2020 · uso e limites em crianças',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC7386163/'});
}
