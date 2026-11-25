// Pediatric subspecialty instruments, 13 November 2026. Labels describe factual
// variables in Portuguese. Source forms and measurement protocols are linked.
const ref = (title, url) => ({title, url});
const select = (id, label, rows, hint = '') => ({
  id, label, type:'select', options:rows.map(([value,label]) => ({value,label})), hint,
});
const binary = (id,label,weight=1,hint='') => select(id,label,[[0,'Ausente'],[weight,'Presente']],hint);
const number = (id,label,max,step=1,hint='') => ({id,label,type:'number',min:0,max,step,noPoints:true,hint});
const purpose = {activity:'Atividade da doença', classification:'Classificação e estadiamento',
  prognosis:'Estratificação prognóstica',pain:'Avaliação da dor',function:'Avaliação funcional',
  pretest:'Apoio pré-teste clínico',severity:'Gravidade clínica',diagnosis:'Critérios diagnósticos'};
const sum = rows => Number(rows.reduce((sum,row) => sum+row.points,0).toFixed(6));
const category = (label,action,level='medium') => ({label,action,level});
function read(fields, values) {
  const data={}, errors=[], missing=[];
  for (const f of fields) {
    let raw, descriptor;
    try {
      if (values && typeof values==='object' && !Array.isArray(values))
        descriptor=Object.getOwnPropertyDescriptor(values,f.id);
      raw=descriptor?.value;
      if (!descriptor || ('value' in descriptor && (raw==null || raw===''))) missing.push(f.id);
    } catch { /* unavailable observation */ }
    const validType=typeof raw==='number' || (typeof raw==='string' && /^\d+(\.\d+)?$/.test(raw));
    const n=validType ? Number(raw) : NaN;
    const valid=f.type==='select' ? f.options.some(o=>o.value===n) :
      n>=f.min && n<=f.max && Math.abs(n/f.step-Math.round(n/f.step))<1e-7;
    if (!Number.isFinite(n)||!valid) errors.push(f.id);
    else data[f.id]=n;
  }
  return {data,errors,missing};
}
function record({specialty,condition,aim,interpret,points,aliases=[],...definition}) {
  const fields=definition.fields;
  const validate=values=>read(fields,values).errors;
  function evaluate(values) {
    const {data,errors}=read(fields,values);
    if (errors.length) return {complete:false,total:null,errors};
    const breakdown=fields.map(f=>({label:f.label,points:points?.(f.id,data) ?? data[f.id]}));
    const total=sum(breakdown);
    return {complete:true,total,errors:[],breakdown,audit:breakdown.map(r=>r.points).join(' + ')+' = '+total,
      ...interpret(total,data)};
  }
  return {specialty,specialties:[specialty,'Pediatria'],populationGroups:['pediatria'],unit:'pontos',
    resultScale:false,reviewDate:'13/11/2026',conditions:[condition],purposes:[aim],aliases,
    keywords:[condition,...aliases],searchTerms:[condition,...aliases],safeCalculate:evaluate,safeValidate:validate,
    range:'0–'+definition.max,...definition};
}
const jadasSources=[
  ref('Consolaro et al. · desenvolvimento do JADAS, contagens de 10, 27 e 71 articulações','https://iris.unige.it/bitstream/11567/248261/2/JADAS.pdf'),
  ref('Ministério da Saúde · PCDT de artrite idiopática juvenil','https://www.gov.br/conitec/pt-br/midias/protocolos/resumidos/PCDTResumidoAIJ.pdf'),
  ref('Mourão et al. · JADAS27 e normalização de VHS/PCR no registro Reuma.pt','https://rihuc.huc.min-saude.pt/bitstreams/2fcb3937-d580-44b4-8739-c06371ed4593/download'),
];
const clinicalSource=ref('McErlane et al. · validação das variantes de três componentes','https://www.sciencedirect.com/science/article/pii/S000349672421284X');
const systemicSource=ref('Tibaldi et al. · desenvolvimento do sJADAS e suas variantes','https://www.pedrheumatology.com/pdf/sJADAS_Rheumatology_pdf.pdf');
const systemicCutoffs=ref('Rosina et al. · estados de atividade da AIJ sistêmica pelo sJADAS10','https://doi.org/10.1002/art.42865');
const systemicFields=[
  select('temp','Maior temperatura da janela documentada',[[0,'Até 37,5 °C'],[1,'Acima de 37,5 até 38 °C'],[2,'Acima de 38 até 39 °C'],[3,'Acima de 39 até 40 °C'],[4,'Acima de 40 °C']],'Usar o maior valor na janela clínica adotada (24 horas, 3 dias ou uma semana). Manter a mesma janela nas comparações.'),
  binary('rash','Exantema eritematoso evanescente'),binary('nodes','Linfonodos aumentados em mais de três cadeias'),
  binary('organ','Hepato ou esplenomegalia (ou ambas)'),binary('serosa','Pleurite, pericardite ou peritonite'),
  binary('anemia','Hemoglobina <9 g/dL'),binary('plateletsFerritin','Plaquetas >600.000/µL ou ferritina >500 ng/mL (ou ambas)'),
];
function jadas(count,marker,systemic=false) {
  const clinical=marker==='clinical', crp=marker==='crp';
  const prefix=systemic?'sJADAS':clinical?'cJADAS':'JADAS';
  const title=prefix+count+(clinical?'':crp?' · PCR':' · VHS');
  const max=count+(clinical?20:30)+(systemic?10:0);
  const jointHint=count===27?'Coluna cervical mais cotovelos, punhos, MCP 1–3, interfalângicas proximais das mãos (incluindo a IP dos polegares), quadris, joelhos e tornozelos bilateralmente.':
    count===10?'Inserir a contagem completa. São computadas até dez articulações ativas, sem lista prefixada.':
    'Usar a contagem articular completa de 71 posições do JADAS. Não utilizar DAS28 ou uma contagem abreviada.';
  const fields=[number('joints','Articulações ativas no exame',count===10?71:count,1,jointHint),
    number('doctor','Atividade global pelo médico · 0 a 10',10,systemic ? .5 : .1,'Zero = sem atividade. Dez = máxima atividade.'),
    number('patient','Bem-estar global da criança pelo paciente ou responsável · 0 a 10',10,systemic ? .5 : .1,'Zero = melhor estado. Dez = pior estado.')];
  if (!clinical) fields.push(number('marker',crp?'Proteína C reativa (mg/L)':'VHS (mm/h)',crp?2000:300,crp ? .1 : 1,crp?'Multiplicar mg/dL por 10 para obter mg/L.':'VHS da mesma avaliação clínica.'));
  if (systemic) fields.push(...systemicFields);
  const norm=crp?'(PCR em mg/L − 10)/10':'(VHS em mm/h − 20)/10';
  return record({id:(prefix+count+'-'+marker).toLowerCase(),name:title,specialty:'Reumatologia',condition:systemic?'Artrite idiopática juvenil sistêmica':'Artrite idiopática juvenil',
    aim:purpose.activity,max,aliases:[prefix+'-'+count,systemic?'doença de Still juvenil':'AIJ',crp?'proteína C reativa':clinical?'JADAS3':'velocidade de hemossedimentação'],
    subtitle:'Atividade da artrite idiopática juvenil'+(systemic?' sistêmica':'')+' · '+(clinical?'clínico':crp?'PCR':'VHS'),
    population:systemic?'Crianças e adolescentes com AIJ sistêmica estabelecida':'Crianças e adolescentes com AIJ estabelecida',
    scope:'Seguimento reumatológico, com articulações e avaliações globais documentadas na mesma visita. Sinovite ativa: tumefação não óssea, ou restrição de movimento com dor/sensibilidade. '+jointHint,
    fields,formula:'Somar os dois globais e a contagem articular'+(count===10?' limitada a 10':'')+
      (clinical?'':', mais '+norm+' limitada entre 0 e 10')+(systemic?', mais manifestações sistêmicas (0–10)':'')+'.',
    limits:'Não diagnostica AIJ. Compare tendências na mesma variante, população e contexto clínico. Outras fontes de inflamação e manifestações extra-articulares requerem avaliação própria.'+
      (systemic?' Suspeita de síndrome de ativação macrofágica exige investigação imediata.':''),
    sources:[...jadasSources,...(clinical?[clinicalSource]:[]),...(systemic?[systemicSource,systemicCutoffs]:[])],
    points:(id,x)=>id==='marker'?Math.max(0,Math.min(10,(x.marker-(crp?10:20))/10)):id==='joints'?Math.min(count,x.joints):x[id],
    interpret:t=>systemic && count===10?category(t<=2.9?'Faixa de doença inativa':t<=10?'Atividade mínima':t<=20.6?'Atividade moderada':'Atividade alta','Faixas de Rosina para sJADAS10. Integrar manifestações sistêmicas, evolução e exame reumatológico.'):
      category('Atividade registrada em '+max+' pontos possíveis','Escores maiores correspondem a maior atividade. Interpretar em série com a mesma variante.'),
  });
}
const jadasRecords=[
  jadas(27,'esr'),jadas(71,'esr'),jadas(27,'clinical'),jadas(71,'clinical'),jadas(27,'crp'),
  ...[10,27,71].map(n=>jadas(n,'esr',true))
];
const spaFields=[
  select('arthritis','Número de articulações com artrite ativa',[[0,'Nenhuma'],[.5,'Uma ou duas'],[1,'Três ou mais']]),
  select('enthesitis','Número de enteses dolorosas ao exame',[[0,'Nenhuma'],[.5,'Uma ou duas'],[1,'Três ou mais']]),
  select('pain','Dor referida na última semana · escala de 0 a 10',[[0,'Zero'],[.5,'De 1 a 4'],[1,'De 5 a 10']]),
  binary('stiff','Rigidez matinal >15 minutos'),
  binary('sacro','Sacroiliíte clínica',1,'Ao menos dois dos três: dor à palpação sacroilíaca, FABER/Patrick positivo, dor lombar inflamatória.'),
  binary('uveitis','Uveíte presente, aguda ou crônica, inclusive assintomática'),
];
function jspada(short) {
  const n=short?6:8;
  return record({id:short?'jspada6-carra':'jspada-weiss',name:short?'JSpADA6 · CARRA':'JSpADA · Weiss',
    subtitle:'Atividade da espondiloartrite juvenil · '+n+' domínios',max:n,specialty:'Reumatologia',
    scope:short?'Versão clínica modificada avaliada em artrite relacionada à entesite no registro CARRA.':'Avaliar atividade da espondiloartrite juvenil já estabelecida.',
    population:'Pacientes pediátricos com '+(short?'artrite relacionada à entesite':'espondiloartrite juvenil'),
    condition:'Espondiloartrite juvenil',aim:purpose.activity,aliases:['artrite relacionada à entesite','JSpA'],
    fields:short?spaFields:[...spaFields,
      select('acute','VHS ou PCR atribuível à espondiloartrite',[[0,'Dentro da referência'],[.5,'Acima da referência, até 2 vezes o limite superior'],[1,'Acima de 2 vezes o limite superior']],'Se ambos foram medidos e discordam, confirme com reumatologia o reagente pertinente à avaliação.'),
      binary('schober','Schober modificado <20 cm em flexão',1,'Aferição final pelo método de 15 cm em posição neutra.')],
    formula:'Somar '+n+' domínios (cada domínio contribui no máximo 1).',
    limits:'Instrumento de atividade, para comparação seriada na mesma versão. Não define diagnóstico ou tratamento. Uveíte depende de avaliação oftalmológica.',
    sources:[ref('Weiss et al. · JSpADA original','https://pmc.ncbi.nlm.nih.gov/articles/PMC4245319/'),ref('SickKids · guia da avaliação clínica do JSpADA','https://lab.research.sickkids.ca/wp-content/uploads/sites/56/2017/08/Appendix-III_Clinical-Tools.pdf'),ref('CARRA · desenvolvimento e validação de JSpADA6','https://pmc.ncbi.nlm.nih.gov/articles/PMC10066819/')],
    interpret:()=>category('Atividade da espondiloartrite juvenil','Maior pontuação indica maior atividade. Avaliar evolução com o mesmo conjunto de domínios.')});
}
const pirani=record({id:'pirani-clubfoot',name:'Pirani · pé torto congênito',subtitle:'Gravidade da deformidade durante o tratamento de Ponseti',specialty:'Ortopedia',
  population:'Lactentes com pé torto congênito não operado',condition:'Pé torto congênito',aim:purpose.severity,max:6,aliases:['talipes equinovarus','Ponseti'],
  scope:'Examinar um pé por vez e registrar os seis sinais antes das manipulações em cada visita. Consultar os critérios visuais do manual Ponseti.',
  fields:[['border','Mediopé · curvatura da borda lateral'],['medial','Mediopé · prega medial'],['talus','Mediopé · cabeça lateral do tálus palpável'],
    ['posterior','Retropé · prega posterior'],['equinus','Retropé · equino rígido'],['heel','Retropé · calcâneo vazio à palpação']]
    .map(([id,label])=>select(id,label,[[0,'Aspecto normal'],[.5,'Alteração moderada/intermediária'],[1,'Alteração acentuada']])),
  formula:'Somar os três sinais do mediopé (0–3) e os três do retropé (0–3).',
  limits:'Maior soma corresponde a deformidade mais acentuada. Indicações de tenotomia e número de gessos dependem do exame e da evolução.',
  sources:[ref('University of Iowa · manual do método Ponseti','https://ponseti.medicine.uiowa.edu/sites/ponseti.medicine.uiowa.edu/files/2025-09/RedBook-Ponseti.pdf'),ref('POSNA · sinais de Pirani, figura 40','https://posna.org/POSNA/media/Documents/Events/IPOS%202023/ponseti/Global-Help-Ponseti-method_2023.pdf')],
  interpret:(_,x)=>category('Deformidade observada','Mediopé '+(x.border+x.medial+x.talus)+'/3. Retropé '+(x.posterior+x.equinus+x.heel)+'/3. Comparar o mesmo pé em visitas sucessivas.')});
const beighton=record({id:'beighton-ped-2023',name:'Beighton · hipermobilidade pediátrica',subtitle:'Mobilidade articular generalizada a partir dos cinco anos',specialty:'Reumatologia',
  population:'A partir de 5 anos, antes da maturidade biológica',condition:'Hipermobilidade articular',aim:purpose.classification,max:9,aliases:['hipermobilidade generalizada','hiperlaxidez'],
  scope:'Aplicar o corte pediátrico apenas antes da maturidade biológica. Realizar as manobras de modo padronizado e medir ângulos quando necessário.',
  fields:[['fifth','Extensão passiva da 5ª metacarpofalângica >90°'],['thumb','Polegar toca passivamente a face flexora do antebraço'],
    ['elbow','Hiperextensão do cotovelo >10°'],['knee','Hiperextensão do joelho >10°']]
    .map(([id,label])=>select(id,label,[[0,'Nenhum lado'],[1,'Um lado'],[2,'Ambos os lados']]))
    .concat(binary('palms','Ambas as palmas apoiam-se inteiramente no chão, com joelhos estendidos')),
  formula:'Até dois pontos por manobra pareada e um ponto pela flexão anterior do tronco.',
  limits:'Não diagnostica síndrome de Ehlers-Danlos. Uma pontuação inferior ao corte não exclui hipermobilidade regional ou sintomas que mereçam investigação.',
  sources:[ref('Tofts et al. · estrutura diagnóstica pediátrica de 2023','https://doi.org/10.1186/s13023-023-02717-2'),ref('Ehlers-Danlos Society · avaliação da hipermobilidade pediátrica','https://www.ehlers-danlos.com/diagnosis/new-diagnostic-framework-for-pediatric-joint-hypermobility-v2/')],
  interpret:t=>category(t>=6?'Atinge o critério de hipermobilidade generalizada':'Abaixo do corte pediátrico de 6/9','Correlacionar com sintomas musculoesqueléticos, exame de outras articulações e história clínica.')});
const muscleGroups=[['deltoid','Deltoide médio'],['biceps','Bíceps'],['wrist','Extensores do punho'],['quad','Quadríceps'],
  ['ankle','Dorsiflexores do tornozelo'],['medius','Glúteo médio'],['maximus','Glúteo máximo']];
function mmt(bilateral) {
  const fields=[number('neck','Flexores cervicais · componente axial',10)];
  for(const [id,label] of muscleGroups){
    if (bilateral) fields.push(number(id+'R',label+' · direita',10),number(id+'L',label+' · esquerda',10));
    else fields.push(number(id,label+' · lado avaliado',10));
  }
  return record({id:'mmt8-'+(bilateral?'bilateral':'unilateral'),name:'MMT8 · '+(bilateral?'bilateral':'unilateral'),subtitle:'Força muscular nas miopatias inflamatórias',
    population:'Miopatias inflamatórias juvenis ou do adulto, com cooperação para exame formal',populationGroups:['pediatria','adultos'],specialty:'Reumatologia',
    condition:'Miopatia inflamatória',aim:purpose.function,max:bilateral?150:80,aliases:['dermatomiosite juvenil','teste muscular manual','IMACS'],
    scope:'Inserir os graus de 0 a 10 já obtidos com a técnica MMT8 do manual IMACS/NIH. '+(bilateral?'Examinar cada lado e registrar a força cervical uma única vez.':'Examinar à direita; se inviável, documentar a substituição pelo lado esquerdo.'),
    fields,formula:'Somar '+(bilateral?'sete grupos bilaterais':'sete grupos de um lado')+' e um componente axial.',
    limits:'Maior valor corresponde a maior força. Idade, colaboração, dor, contraturas e técnica influenciam o exame. Não converter diretamente da escala MRC de 0 a 5 nem lançar músculo não testável como zero.',
    sources:[ref('NIH/IMACS · folha oficial de pontuação MMT8','https://www.niehs.nih.gov/sites/default/files/2024-08/Manual_Muscle_Testing_8__MMT_8__Scoring_Sheet_form_508.pdf'),ref('NIH/IMACS · técnica e graduação dos grupos musculares','https://www.niehs.nih.gov/sites/default/files/research/resources/assets/docs/mmt8_grading_and_testing_procedures_for_the_abbreviated_8_muscle_groups_508.pdf'),ref('Rider et al. · estudo de validação','https://pubmed.ncbi.nlm.nih.gov/20391500/')],
    interpret:()=>category('Força muscular examinada','Comparar a mesma versão e os mesmos grupos musculares em avaliações padronizadas.')});
}
const sheffield=record({id:'sheffield-pediatric-ugib',name:'Sheffield · hemorragia digestiva alta',subtitle:'Necessidade de hemostasia endoscópica na infância',
  condition:'Hemorragia digestiva alta',aim:purpose.prognosis,specialty:'Gastroenterologia',max:24,population:'Crianças com hemorragia digestiva alta aguda',
  aliases:['hematêmese','melena','sangramento digestivo'],scope:'Aplicar após avaliação clínica, com história e medidas de estabilização conhecidas. O estudo de derivação incluiu crianças submetidas à endoscopia.',
  fields:[binary('comorb','Doença prévia clinicamente relevante'),binary('melena','Melena'),binary('hematemesis','História de hematêmese volumosa'),
    binary('hr','FC excede em mais de 20 bpm a média para a idade'),binary('crt','Enchimento capilar >2 segundos',4),
    binary('hb','Queda de hemoglobina >2 g/dL',3,'Comparar com Hb prévia ou, se desconhecida, com o limite inferior para idade.'),
    binary('bolus','Houve necessidade de bolus de fluido',3),binary('blood','Houve necessidade de transfusão de hemácias',6),
    binary('otherBlood','Houve necessidade de outro hemocomponente',4)],
  formula:'Soma ponderada de nove observações, de 0 a 24. A ficha usa a especificação clínica do serviço de Sheffield.',
  limits:'Instrumento retrospectivo de derivação pequena. Medidas de ressuscitação entram como dados já observados. Pontuação baixa não dispensa avaliação urgente de sangramento importante. Não esperar a pontuação para estabilizar.',
  sources:[ref('Thomson et al. · derivação original e tabela 6','https://www.naspghan.org/files/documents/pdfs/cme/jpgn/Acute_Upper_Gastrointestinal_Bleeding_in.14.pdf'),ref('Sheffield Children’s NHS · diretriz e apêndice de pontuação','https://www.sheffieldchildrens.nhs.uk/download/1018/circulation/23444/management-of-upper-gastro-intestinal-bleeding.pdf')],
  interpret:t=>category(t>8?'Acima do limiar de Sheffield':t===8?'No ponto de corte da publicação original':'Abaixo de 8 pontos','A diretriz do centro utiliza >8. Discutir a necessidade e a urgência de endoscopia conforme sangramento, perfusão e evolução.',t>=8?'high':'medium')});
const pancreasSources=[ref('NASPGHAN · manejo da pancreatite aguda em crianças','https://www.naspghan.org/files/Management_of_Acute_Pancreatitis_in_the_Pediatric.33.pdf'),
  ref('INSPPIRE · definições pediátricas e avaliação causal','https://pmc.ncbi.nlm.nih.gov/articles/5191966/'),
  ref('NASPGHAN e SPR · diagnóstico e estadiamento por gravidade','https://doi.org/10.1097/MPG.0000000000002964')];
const insp=record({id:'insppire-acute-pancreatitis',name:'INSPPIRE · pancreatite aguda',subtitle:'Critérios diagnósticos de pancreatite aguda pediátrica',
  specialty:'Gastroenterologia',condition:'Pancreatite aguda',aim:purpose.diagnosis,max:3,aliases:['INSPPIRE','lipase','amilase'],
  population:'Crianças e adolescentes com suspeita de pancreatite',scope:'Registrar os três domínios do episódio avaliado. As enzimas utilizam o limite superior do laboratório.',
  fields:[binary('pain','Dor abdominal compatível com pancreatite'),binary('enzymes','Amilase ou lipase sérica ≥3 vezes o limite superior'),
    binary('imaging','Imagem com achados compatíveis com pancreatite aguda')],formula:'Dois dos três domínios sustentam a definição de pancreatite aguda.',
  limits:'A amilase e a lipase constituem um único domínio. Imagem pode ser dispensada se os dois outros critérios já foram satisfeitos. A gravidade e a etiologia exigem avaliação separada.',
  sources:pancreasSources,interpret:t=>category(t>=2?'Critérios preenchidos':'Menos de dois critérios','Integrar ao contexto clínico. Se há suspeita e a investigação ainda está incompleta, reavaliar a evolução.')});
// When two domains are positive, the remaining investigation is unnecessary for classification.
insp.safeValidate=values=>{
  const {data,errors,missing}=read(insp.fields,values);
  if (!errors.length) return [];
  if (Object.values(data).reduce((n,x)=>n+x,0)>=2 && errors.every(id=>missing.includes(id))) return [];
  return errors;
};
const fullInsp=insp.safeCalculate;
insp.safeCalculate=values=>{
  const full=fullInsp(values);
  if (full.complete || insp.safeValidate(values).length) return full;
  const {data}=read(insp.fields,values);
  return {complete:true,total:2,displayValue:'≥2',errors:[],label:'Critérios preenchidos',level:'medium',
    action:'Dois domínios documentados bastam. O terceiro não foi avaliado.',audit:'Ao menos 2/3 critérios documentados.',
    breakdown:insp.fields.map(f=>Object.hasOwn(data,f.id) ? {label:f.label,points:data[f.id]} : {label:f.label,points:'NT',detail:'Não informado'})};
};
const debanto=record({id:'debanto-pancreatitis-48h',name:'DeBanto · pancreatite pediátrica',subtitle:'Pediatric Acute Pancreatitis Severity Score · primeira janela de 48 h',
  specialty:'Gastroenterologia',condition:'Pancreatite aguda',aim:purpose.prognosis,max:8,aliases:['PAPS','pancreatite grave','DeBanto'],
  population:'Crianças hospitalizadas com pancreatite aguda',scope:'Quatro critérios de apresentação e quatro obtidos ao longo das primeiras 48 horas. Registrar dados completos após esta janela.',
  fields:[binary('age','Idade <7 anos'),binary('weight','Peso <23 kg'),binary('wbc','Leucócitos à admissão >18.500/µL'),
    binary('ldh','DHL à admissão >2.000 U/L'),binary('ca','Menor cálcio total em 48 h <8,3 mg/dL'),
    binary('alb','Menor albumina em 48 h <2,6 g/dL'),binary('fluid','Sequestro de líquidos em 48 h >75 mL/kg',1,'Usar o sequestro documentado, não o volume de líquidos infundido.'),
    binary('bun','Elevação do BUN em 48 h >5 mg/dL',1,'BUN = nitrogênio ureico. Ureia em mg/dL não é a mesma medida.')],
  formula:'Um ponto por critério de DeBanto presente (0–8).',
  limits:'Modelo prognóstico histórico com sensibilidade limitada. Para classificação clínica vigente, avaliar disfunção orgânica e complicações. Não aguardar 48 horas para tratar deterioração.',
  sources:[ref('DeBanto et al. · derivação e validação multicêntrica','https://pubmed.ncbi.nlm.nih.gov/12135026/'),ref('Suzuki et al. · revisão de escores de gravidade','https://pmc.ncbi.nlm.nih.gov/articles/PMC4231506/'),...pancreasSources.slice(0,1)],
  interpret:t=>category(t>=3?'Atinge o corte prognóstico do estudo':'Abaixo do corte de três critérios','O estudo utilizou ≥3 critérios para prever curso grave. Reavaliar diretamente perfusão, função orgânica e complicações.',t>=3?'high':'medium')});
const shortPcdai=record({id:'short-pcdai-kappelman',name:'Short PCDAI · Kappelman',subtitle:'Atividade da doença de Crohn pediátrica · versão curta sem laboratório',
  specialty:'Gastroenterologia',condition:'Doença de Crohn',aim:purpose.activity,max:90,population:'Crianças e adolescentes com doença de Crohn já estabelecida',
  aliases:['shPCDAI','sPCDAI','DII pediátrica'],scope:'Sintomas da última semana, evolução do peso e exame. Versão desenvolvida para estudos observacionais e melhoria da qualidade.',
  fields:[select('pain','Dor abdominal referida',[[0,'Ausente'],[10,'Breve, sem interferir nas atividades'],[20,'Diária, prolongada, noturna ou limita atividades']]),
    select('general','Bem-estar e atividade',[[0,'Atividade habitual preservada'],[10,'Limitação ocasional'],[20,'Limitação frequente ou estado muito ruim']]),
    select('weight','Evolução ponderal',[[0,'Ganho ou estabilidade/perda voluntária'],[10,'Estabilidade involuntária ou perda de 1–9%'],[20,'Perda ≥10%']]),
    select('stool','Evacuações por dia',[[0,'0–1 líquida e sem sangue'],[5,'Até 2 semiformadas com pouco sangue, ou 2–5 líquidas'],[10,'Sangramento evidente, ≥6 líquidas ou diarreia noturna']]),
    select('abd','Exame abdominal',[[0,'Sem dor à palpação ou massa'],[5,'Dor leve ou massa sem dor'],[10,'Dor com defesa involuntária ou massa definida']]),
    select('extra','Número de manifestações extraintestinais',[[0,'Nenhuma'],[5,'Uma'],[10,'Duas ou mais']],'Considerar febre ≥38,5 °C em três dias da semana, artrite, uveíte, eritema nodoso ou pioderma gangrenoso.')],
  formula:'Pontuação máxima de 20 cada para dor, bem-estar e peso, e 10 cada para fezes, exame abdominal e manifestações extraintestinais.',
  limits:'Os pontos de corte seguem Kappelman. Não avalia diretamente cicatrização de mucosa e não substitui investigação de complicações ou endoscopia.',
  sources:[ref('Kappelman et al. · pesos e pontos de corte do Short PCDAI','https://pmc.ncbi.nlm.nih.gov/articles/PMC2998542/'),ref('Crohn’s & Colitis Foundation · medidas pediátricas','https://www.crohnscolitisfoundation.org/sites/default/files/2023-08/Pediatric%20Assessment%20Tools%20-%20Feb.%202023_KC.pdf'),ref('GEDIIB · descritores clínicos dos componentes do PCDAI','https://www.scielo.br/j/ag/a/KL5Vpy5S8QWgVtfH73vdG7h/')],
  interpret:t=>category(t<15?'Faixa inativa':t<30?'Atividade leve':'Atividade moderada a grave','Interpretar com crescimento, exame, marcadores objetivos de inflamação e seguimento especializado.')});
const etv=record({id:'etvss-kulkarni',name:'ETVSS · ventriculostomia endoscópica',subtitle:'Estimativa de sucesso em seis meses na hidrocefalia pediátrica',specialty:'Neurocirurgia',
  condition:'Hidrocefalia',aim:purpose.prognosis,max:90,aliases:['ETV Success Score','terceiroventriculostomia','hidrocefalia obstrutiva'],population:'Crianças com hidrocefalia candidatas à terceiroventriculostomia endoscópica',
  scope:'Aplicar antes do procedimento, com confirmação neurocirúrgica da etiologia. Mede sucesso da ventriculostomia endoscópica do terceiro ventrículo em seis meses.',
  fields:[select('age','Idade no procedimento',[[0,'Menos de 1 mês'],[10,'1 a <6 meses'],[30,'6 a <12 meses'],[40,'1 a <10 anos'],[50,'10 anos ou mais (pediatria)']]),
    select('cause','Causa estabelecida da hidrocefalia',[[0,'Pós-infecciosa'],[20,'Mielomeningocele, hemorragia intraventricular ou tumor não tectal'],[30,'Estenose aquedutal, tumor tectal ou outra etiologia definida']]),
    select('shunt','Histórico de derivação liquórica',[[0,'Já teve derivação'],[10,'Sem derivação prévia']])],
  formula:'Somar idade (0–50), etiologia (0–30) e ausência de derivação prévia (10).',
  limits:'O total aproxima uma probabilidade de sucesso de grupo em seis meses. Zero não torna o sucesso impossível. Não substitui avaliação anatômica e não assegura permeabilidade tardia.',
  sources:[ref('Kulkarni et al. · derivação em hidrocefalia pediátrica, figura 2','https://med-fom-neuroethics.sites.olt.ubc.ca/files/2016/06/Endoscopic-third-ventriculostomy-in-the-treatment-of-childhood-hydrocephalus.pdf'),ref('Lane e Akbari · revisão e tabela do ETVSS','https://pmc.ncbi.nlm.nih.gov/articles/PMC9205383/')],
  interpret:t=>category('Estimativa em seis meses','O ETVSS de '+t+' aproxima a porcentagem de sucesso do procedimento na população estudada. Discutir opções e incerteza com a neurocirurgia.')});
const cheops=record({id:'cheops-postoperative',name:'CHEOPS · dor pós-operatória',subtitle:'Escala comportamental de dor em crianças pequenas',
  specialty:'Anestesiologia',condition:'Dor pós-operatória pediátrica',aim:purpose.pain,max:13,range:'4–13',aliases:['dor infantil','Children’s Hospital of Eastern Ontario Pain Scale'],
  population:'Crianças de 1 a 7 anos em pós-operatório',scope:'Observar seis comportamentos simultaneamente quando o autorrelato não puder ser utilizado. Adotar a CHEOPS original.',
  fields:[select('cry','Choro',[[1,'Sem choro'],[2,'Gemido ou choro'],[3,'Grito ou soluço intenso']]),
    select('face','Expressão facial',[[0,'Sorriso'],[1,'Neutra'],[2,'Careta evidente']]),
    select('talk','Verbalização',[[0,'Comentários positivos'],[1,'Silêncio ou queixa sem relação com dor'],[2,'Refere dor, isoladamente ou com outra queixa']]),
    select('body','Tronco',[[1,'Em repouso'],[2,'Move-se inquieto, rígido, treme, ergue-se ou está contido']]),
    select('touch','Mãos e local operado',[[1,'Não se dirige à área operada'],[2,'Tenta alcançar, toca, agarra a ferida ou requer contenção']]),
    select('legs','Pernas',[[1,'Relaxadas'],[2,'Agitadas, encolhidas, tensas, em pé/ajoelhado ou contidas']])],
  formula:'Choro 1–3, face e fala 0–2, tronco, toque e pernas 1–2 cada. O menor total possível é 4.',
  limits:'Maior soma indica mais comportamentos associados à dor. Medo, sedação e dificuldade motora alteram a observação. Não somar com FLACC nem calcular dose analgésica a partir do resultado.',
  sources:[ref('SMS Rio · guia de urgência pediátrica e CHEOPS','https://www.coronavirus.rio/wp-content/uploads/2021/06/GuiaOrientadorRedeUrgenciaEmergencia_VersaoDigital_20210601_.pdf'),ref('PCICS · avaliação pediátrica de dor, inclusive CHEOPS','https://pcics.org/wp-content/uploads/Neonatal-and-Pediatric-Developmental-Guidelines-in-the-Care-of-the-NeonateChildAdolescent-Cardiovascular-Patient.pdf')],
  interpret:()=>category('Intensidade comportamental observada','Reavaliar dor no mesmo contexto e após as intervenções. Buscar o autorrelato quando possível.')});
const ankara=ref('Özen et al. · critérios pediátricos EULAR/PRINTO/PRES, Ankara 2008, tabelas 1–4','https://www.pres.eu/files/EULARPRINTOPREScriteriavasculits2008partII.pdf');
const ankaraAlt=ref('EULAR/PRINTO/PRES · registro da validação por consenso internacional','https://iris.unicampania.it/handle/11591/186801');
const classLimit='Critérios de classificação pediátricos para avaliação especializada. Um resultado negativo não exclui doença em evolução. Avaliar outras causas antes de atribuir manifestações à vasculite.';
function classification({check,pre=[],...definition}) {
  const score=record({...definition,aim:purpose.classification,specialty:'Reumatologia',unit:'domínios',
    points:(id,x)=>pre.includes(id)?0:x[id],interpret:(t,x)=>category(check(t,x)?'Preenche os critérios de classificação':'Critérios de classificação não preenchidos','Total exibido corresponde aos domínios pontuáveis. '+definition.formula)});
  for (const f of score.fields) if (pre.includes(f.id)) f.noPoints=true;
  return score;
}
const renalHint='Proteinúria significativa conforme a definição de Ankara (p.ex. >0,3 g/24 h), hematúria >5 hemácias por campo, cilindros hemáticos ou fita ≥2+.';
const iga=classification({id:'ankara-iga-2008',name:'Ankara · vasculite por IgA',subtitle:'Classificação pediátrica EULAR/PRINTO/PRES',max:4,
  condition:'Vasculite por IgA',population:'Crianças com suspeita clínica de vasculite por IgA',scope:'Confirmar se há púrpura ou petéquias sem relação com trombocitopenia e documentar sua distribuição.',
  limits:classLimit,aliases:['Henoch-Schönlein','púrpura de Henoch','IgAV'],sources:[ankara,ankaraAlt,ref('IPNA · nefropatia e nefrite associadas a IgA','https://www.erknet.org/fileadmin/Guidelines/Vivarelli_et_al.__2024_IPNA_IgA_CPR.pdf')],
  fields:[select('skin','Púrpura/petéquias sem causa trombocitopênica',[[0,'Ausentes'],[1,'Predominam em membros inferiores'],[2,'Distribuição atípica']]),
    binary('abd','Dor abdominal cólica difusa de início agudo'),binary('biopsy','Vasculite leucocitoclástica ou glomerulonefrite proliferativa com depósito predominante de IgA'),
    binary('joints','Artrite ou artralgia de início agudo'),binary('renal','Comprometimento renal conforme Ankara',1,renalHint)],
  formula:'Púrpura/petéquias e ≥1 dos quatro domínios. Se a distribuição for atípica, exige-se comprovação do depósito de IgA em biópsia.',pre:['skin'],check:(t,x)=>x.skin!==0&&t>=1&&(x.skin===1||x.biopsy===1)});
const pan=classification({id:'ankara-pan-2008',name:'Ankara · poliarterite nodosa infantil',subtitle:'Classificação pediátrica EULAR/PRINTO/PRES',max:5,condition:'Poliarterite nodosa',
  population:'Crianças com doença inflamatória sistêmica e suspeita de poliarterite nodosa',scope:'Verificar evidência em artéria pequena ou média e as manifestações clínicas adicionais.',limits:classLimit,aliases:['c-PAN','poliarterite nodosa sistêmica'],sources:[ankara,ankaraAlt],
  fields:[binary('gate','Histologia ou angiografia compatível',1,'Vasculite necrosante em artéria pequena/média ou aneurisma, estenose ou oclusão angiográfica dessas artérias, excluídas causas não inflamatórias.'),
    binary('skin','Livedo reticular, nódulos subcutâneos dolorosos ou infartos cutâneos'),binary('muscle','Mialgia ou dor muscular à palpação'),
    binary('bp','PA sistólica ou diastólica >percentil 95 para estatura'),binary('nerves','Neuropatia periférica sensitiva ou mononeurite múltipla com déficit motor'),
    binary('renal','Comprometimento renal conforme Ankara',1,renalHint+' Também inclui TFG <50% do normal.')],
  formula:'Exige histologia ou angiografia compatível e ≥1 de cinco manifestações.',pre:['gate'],check:(t,x)=>x.gate===1&&t>=1});
const gpa=classification({id:'ankara-gpa-2008',name:'Ankara · granulomatose com poliangiite',subtitle:'Classificação pediátrica EULAR/PRINTO/PRES',condition:'Granulomatose com poliangiite',max:6,
  population:'Crianças em investigação especializada de vasculite sistêmica',scope:'Registrar os seis domínios de Ankara após exame e investigação dirigida.',limits:classLimit,aliases:['Wegener','GPA pediátrica','c-WG'],sources:[ankara,ankaraAlt],
  fields:[binary('biopsy','Inflamação granulomatosa na parede arterial ou em região peri/extravascular'),binary('upper','Doença nasal ou sinusal compatível',1,'Secreção nasal crônica purulenta/sanguinolenta, epistaxe/crostas/granulomas recorrentes, perfuração septal, nariz em sela ou sinusite crônica/recorrente.'),
    binary('airway','Estenose subglótica, traqueal ou brônquica'),binary('lung','Nódulos, cavidades ou infiltrados fixos pulmonares em RX/TC'),
    binary('anca','ANCA positivo por imunofluorescência ou ELISA (MPO/PR3)'),binary('renal','Comprometimento renal conforme Ankara',1,renalHint+' Também inclui glomerulonefrite necrosante pauci-imune.')],
  formula:'Pelo menos três dos seis domínios.',check:t=>t>=3});
const takayasu=classification({id:'ankara-takayasu-2008',name:'Ankara · arterite de Takayasu infantil',subtitle:'Classificação pediátrica EULAR/PRINTO/PRES',condition:'Arterite de Takayasu',max:5,
  population:'Crianças em investigação especializada de vasculite de grandes vasos',scope:'Exige lesão arterial compatível em angiografia convencional, angio-TC ou angio-RM.',limits:classLimit,aliases:['c-TA','Takayasu pediátrica'],sources:[ankara,ankaraAlt],
  fields:[binary('gate','Angiografia com lesão compatível',1,'Aorta, ramos principais ou artérias pulmonares com aneurisma/dilatação, estreitamento, oclusão ou espessamento de parede. Excluir displasia fibromuscular e outras causas não inflamatórias.'),
    binary('pulse','Déficit ou assimetria de pulsos, ou claudicação de esforço'),binary('diff','Diferença de pressão sistólica >10 mmHg na medida dos quatro membros'),
    binary('bruit','Sopro ou frêmito sobre grande artéria'),binary('bp','PA sistólica ou diastólica >percentil 95 para estatura'),
    binary('acute','VHS >20 mm/h ou PCR acima da referência local')],
  formula:'Angiografia compatível e pelo menos um dos cinco domínios adicionais.',pre:['gate'],check:(t,x)=>x.gate===1&&t>=1});
const behcet=classification({id:'pedbd-behcet',name:'PEDBD · doença de Behçet',subtitle:'Critérios internacionais de classificação pediátrica',condition:'Doença de Behçet',max:6,
  population:'Crianças e adolescentes com manifestações sugestivas de Behçet',scope:'Considerar manifestações documentadas ao longo da evolução. Aftose oral não é obrigatória nos critérios PEDBD.',
  limits:classLimit,aliases:['PEDBD','Behcet','aftose recorrente'],sources:[ref('Koné-Paut et al. · coorte internacional de PEDBD','https://pubmed.ncbi.nlm.nih.gov/26698843/'),ref('Sociedade Espanhola de Reumatologia Pediátrica · PEDBD','https://reumaped.es/images/site/doc/Enf_Behcet_Pediatrica_PEDBD_2016.pdf')],
  fields:[binary('oral','Aftose oral em ≥3 episódios/ano'),binary('genital','Ulceração ou aftose genital, frequentemente com cicatriz'),
    binary('skin','Foliculite necrótica, lesões acneiformes ou eritema nodoso'),binary('eye','Uveíte anterior/posterior ou vasculite retiniana'),
    binary('neuro','Manifestação neurológica além de cefaleia isolada'),binary('vessel','Trombose venosa/arterial ou aneurisma arterial')],
  formula:'Três ou mais das seis categorias. Cada categoria conta uma vez.',check:t=>t>=3});
const gmfmDimensions=[['lying','A · deitar e rolar',51],['sit','B · sentar',60],['crawl','C · engatinhar e ajoelhar',42],['stand','D · ficar em pé',39],['walk','E · andar, correr e saltar',72]];
const gmfm=record({id:'gmfm88-global',name:'GMFM-88 · função motora grossa',subtitle:'Média das cinco dimensões da avaliação padronizada',
  specialty:'Neurologia',condition:'Paralisia cerebral',aim:purpose.function,max:100,unit:'%',aliases:['Gross Motor Function Measure','reabilitação pediátrica'],
  population:'Crianças com paralisia cerebral avaliadas pelo protocolo GMFM-88',scope:'Inserir os subtotais brutos das cinco dimensões da GMFM-88 obtidos com o manual e a folha oficial. A ficha calcula exclusivamente o escore global.',
  fields:gmfmDimensions.map(([id,label,max])=>number(id,label+' · subtotal bruto',max)),
  formula:'Cada dimensão contribui com 20 × subtotal/máximo. Somar as cinco contribuições para o percentual global.',
  limits:'Não calcula a GMFM-66, escore de metas, percentil ou mudança clinicamente importante. Avaliações seriadas requerem protocolo e condições comparáveis.',
  sources:[ref('CanChild · GMFM scoring e orientação de uso','https://canchild.ca/resources/321-gmfm-scoring/'),ref('CanChild · folha de pontuação GMFM-88 em português','https://www.canchild.ca/system/tenon/assets/attachments/000/002/572/original/Folha_de_Pontua%C3%A7%C3%A3o_GMFM_88_e_GMFM_66_atualizada2.pdf')],
  points:(id,x)=>20*x[id]/gmfmDimensions.find(([key])=>key===id)[2],
  interpret:()=>category('Escore global GMFM-88','Maior percentual corresponde a mais tarefas motoras realizadas segundo a escala. Todos os cinco domínios têm o mesmo peso.')});
const hine=record({id:'hine-section1-global',name:'HINE · exame neurológico global',subtitle:'Seção 1 · soma dos subtotais documentados',
  specialty:'Neurologia',condition:'Avaliação do desenvolvimento neurológico',aim:purpose.function,max:78,aliases:['Hammersmith Infant Neurological Examination','desenvolvimento do lactente'],
  population:'Lactentes de 2 a 24 meses em avaliação neuroevolutiva',scope:'Inserir os cinco subtotais obtidos na seção neurológica da HINE por examinador treinado. Documentar idade corrigida quando pertinente e examinar assimetrias em separado.',
  fields:[['cranial','Função dos nervos cranianos',15],['posture','Postura',18],['movements','Movimentos',6],['tone','Tônus',24],['reflex','Reflexos e reações',15]].map(([id,label,max])=>number(id,label+' · subtotal',max,.5)),
  formula:'Soma dos cinco domínios, máximo de 78. As demais seções e o escore de assimetria ficam fora do total.',
  limits:'O total depende da idade. Não diagnostica paralisia cerebral ou substitui a aplicação completa. Não imputar itens ausentes como zero nem usar o total isolado para tranquilizar diante de assimetria ou regressão.',
  sources:[ref('Mac Keith Press · HINE, ficha de março de 2026','https://www.mackeith.co.uk/wp-content/uploads/2026/03/HINE-proforma_EN_-09.03.26.pdf'),ref('University of Queensland · HINE e distribuição dos subtotais','https://qcprrc.centre.uq.edu.au/files/1286/HINE-proforma_08_02_19.pdf')],
  interpret:()=>category('Escore global neurológico','Interpretar com a idade e o padrão dos domínios, assimetrias, história clínica e evolução.')});
export const pediatricSubspecialtyScores = [...jadasRecords,jspada(false),jspada(true),pirani,beighton,mmt(false),mmt(true),
  sheffield,insp,debanto,shortPcdai,etv,cheops,iga,pan,gpa,takayasu,behcet,gmfm,hine];

const aims=record({id:'aims-alberta-raw',name:'AIMS · desenvolvimento motor do lactente',subtitle:'Soma bruta das quatro posturas examinadas',
  specialty:'Neurologia',condition:'Desenvolvimento motor do lactente',aim:purpose.function,max:58,aliases:['Alberta Infant Motor Scale','maturação motora'],
  population:'Lactentes da idade equivalente ao termo até a marcha independente, em geral até 18 meses',
  scope:'Inserir os subtotais da AIMS após observação profissional, com os itens anteriores à janela motora e os itens observados dentro dela conforme o manual.',
  fields:[number('prone','Prono · subtotal',21),number('supine','Supino · subtotal',9),number('sitting','Sentado · subtotal',12),number('standing','Em pé · subtotal',16)],
  formula:'Somar os quatro subtotais documentados. Máximo global de 58.',
  limits:'É o total bruto. Para percentil, consultar a referência normativa apropriada à população e à idade corrigida quando indicada. O total isolado não define atraso.',
  sources:[ref('Piper et al. · desenvolvimento e validação da AIMS','https://pubmed.ncbi.nlm.nih.gov/1468050/'),ref('Jornal de Pediatria · curvas brasileiras e composição das quatro posturas','https://www.scielo.br/j/jped/a/6PN8nTn3Pvt3qQfZsPLFnFq/?format=html&lang=pt')],
  interpret:()=>category('Escore bruto de desenvolvimento motor','Comparar com a idade e a referência normativa correspondente. Registrar também a qualidade dos movimentos observados.')});
const hfmse=record({id:'hfmse-sma',name:'HFMSE · função motora na AME',subtitle:'Hammersmith expandida · escore dos dois blocos',specialty:'Neurologia',condition:'Atrofia muscular espinhal',
  aim:purpose.function,max:66,aliases:['Hammersmith Functional Motor Scale Expanded','AME 5q'],
  population:'Pessoas com atrofia muscular espinhal, especialmente tipos II e III',populationGroups:['pediatria','adultos'],
  scope:'Aplicar a escala padronizada com examinador treinado. Transcrever o subtotal dos 20 itens do bloco original e dos 13 itens da expansão. Cada item admite 0 a 2.',
  fields:[number('base','Itens 1 a 20 · subtotal bruto',40),number('expanded','Itens 21 a 33 · subtotal bruto',26)],
  formula:'HFMSE global = subtotal dos 20 primeiros itens + subtotal dos 13 últimos.',
  limits:'Varia com a capacidade funcional, cooperação e presença de contraturas. Não imputar itens incompletos nem usar isoladamente para avaliar resposta a medicamento.',
  sources:[ref('O’Hagen et al. · desenvolvimento da HFMSE','https://pubmed.ncbi.nlm.nih.gov/17658255/'),ref('Glanzman et al. · validação em AME II e III','https://pubmed.ncbi.nlm.nih.gov/21940700/'),ref('POD-NMD · aplicação e estrutura da HFMSE','https://pod-nmd.org/assessment/hfmse/')],
  interpret:()=>category('Função motora grossa pela HFMSE','Escores maiores refletem maior capacidade nas tarefas testadas. Interpretar mudanças com a evolução funcional e o contexto da avaliação.')});
const chopNames=['Movimento espontâneo dos braços','Movimento espontâneo das pernas','Preensão manual','Cabeça na linha média','Adutores do quadril',
  'Rolar a partir das pernas','Rolar a partir dos braços','Ombro e cotovelo com abdução horizontal','Flexão de ombro e cotovelo','Extensão do joelho','Flexão do quadril e dorsiflexão do pé',
  'Controle da cabeça','Flexão do cotovelo durante a tração','Flexão cervical durante a tração','Extensão cervical · Landau','Incurvação da coluna · Galant'];
const chopRestricted={5:[0,2,4],10:[0,1,2,4],11:[0,2,3,4],13:[0,2,4],14:[0,2,4],15:[0,2,4],16:[0,2,4]};
const numberedRatings=values=>values.map(n=>[n,n+' ponto'+(n===1?'':'s')]);
const chop=record({id:'chop-intend-2010',name:'CHOP INTEND · função neuromuscular',subtitle:'Dezesseis manobras para lactentes com fraqueza muscular',specialty:'Neurologia',
  condition:'Atrofia muscular espinhal',aim:purpose.function,max:64,aliases:['CHOP-INTEND','doença neuromuscular infantil','AME tipo I'],
  population:'Lactentes com fraqueza neuromuscular importante, especialmente AME tipo I',
  scope:'Transcrever os graus obtidos nas 16 manobras padronizadas do CHOP INTEND. Respeitar o posicionamento, a regra de melhor resposta nas manobras bilaterais e os graus específicos de cada item.',
  fields:chopNames.map((name,i)=>select('chop'+(i+1),(i+1)+'. '+name,numberedRatings(chopRestricted[i+1]||[0,1,2,3,4]))),
  formula:'Somar as dezesseis notas. Cada manobra vale até quatro, com categorias intermediárias próprias.',
  limits:'Um item não observado não equivale a ausência de movimento. O total não mede função respiratória, bulbar ou sobrevida.',
  sources:[ref('Glanzman et al. · desenvolvimento do CHOP INTEND','https://pubmed.ncbi.nlm.nih.gov/20074952/'),ref('Ministério da Saúde · versão brasileira no PCDT da AME 5q','https://www.gov.br/conitec/pt-br/midias/protocolos/20230522_portariaconjuntano6atrofiamuscularespinhal5qtipos1e2.pdf/@@display-file/file'),ref('Manual CHOP INTEND · graduações por manobra','https://hcp.togetherinsma.tw/content/dam/commercial-tw/specialty/sma/hcp/tw_tw/pdf/sma-assessment-tool/CHOP%20INTEND-manual.pdf')],
  interpret:()=>category('Escore motor CHOP INTEND','Pontuação maior expressa mais habilidades nas manobras avaliadas. Comparar resultados padronizados do mesmo paciente.')});
const rulmActivities=['Transferência das mãos para a mesa','Traçado com lápis','Pegar moedas/fichas','Colocar ficha em recipiente','Alcance lateral','Acionar botão com uma mão',
  'Rasgar papel','Abrir recipiente','Elevar copo com 200 g à boca','Transferir 200 g na horizontal','Transferir 500 g na horizontal','Transferir 200 g em diagonal',
  'Elevar 500 g com ambas as mãos','Abdução de ambos os braços sobre a cabeça','Abdução com 500 g','Abdução com 1 kg','Flexão do ombro sem carga','Flexão com 500 g','Flexão com 1 kg'];
const rulm=record({id:'rulm-sma',name:'RULM · função dos membros superiores',subtitle:'Revised Upper Limb Module na atrofia muscular espinhal',specialty:'Neurologia',
  condition:'Atrofia muscular espinhal',aim:purpose.function,max:37,aliases:['Revised Upper Limb Module','AME','função de membros superiores'],populationGroups:['pediatria','adultos'],
  population:'Crianças e adultos com AME, avaliados pelo protocolo RULM',
  scope:'Transcrever os itens B a T da ficha oficial de um lado de teste documentado. O item A descreve a capacidade de entrada e não pontua no total. Usar sua informação para o item O conforme o manual.',
  fields:rulmActivities.map((s,i)=>{const code=String.fromCharCode(66+i);return select(code,code+' · '+s,numberedRatings(code==='I'?[0,1]:[0,1,2]));}),
  formula:'Somar os 19 itens B–T. O item I admite 0 ou 1. Cada um dos outros 18 admite 0, 1 ou 2.',
  limits:'Avaliar cada braço conforme o manual, sem somar lados. Manter o mesmo lado e técnica na comparação longitudinal. A soma não mede diretamente marcha ou função respiratória.',
  sources:[ref('Mazzone et al. · desenvolvimento do RULM','https://pubmed.ncbi.nlm.nih.gov/27701745/'),ref('RULM · ficha de pontuação e item de entrada','https://hcp.togetherinsma.tw/content/dam/commercial-tw/specialty/sma/hcp/tw_tw/pdf/sma-assessment-tool/RULM-scale.pdf'),ref('University College London · uso longitudinal do RULM','https://discovery.ucl.ac.uk/id/eprint/10066945/1/Revised%20Upper%20Limb%20Module%2017%20July%202018-2.pdf')],
  interpret:()=>category('Função dos membros superiores pela RULM','Uma soma maior indica melhor desempenho nas tarefas avaliadas. Documentar o lado testado.')});
const hine2=record({id:'hine2-sma-milestones',name:'HINE-2 · marcos motores na AME',subtitle:'Oito domínios motores · versão pontuada para estudos de AME',specialty:'Neurologia',
  condition:'Atrofia muscular espinhal',aim:purpose.function,max:26,aliases:['HINE seção 2','marcos de desenvolvimento','SMA motor milestones'],
  population:'Lactentes com atrofia muscular espinhal, na janela de avaliação correspondente à HINE',
  scope:'Pontuação dos marcos motores documentados na versão HINE-2 empregada em AME. Aplicar as instruções da ficha de marcos motores. A seção neurológica HINE de 78 pontos é uma avaliação distinta.',
  fields:[['head','Sustentação cefálica',2],['sit','Sedestação',4],['grasp','Preensão voluntária',3],['kick','Chutes em supino',4],
    ['roll','Rolamento',3],['crawl','Engatinhar',4],['stand','Postura em pé',3],['walk','Marcha',3]]
    .map(([id,label,max])=>number(id,label+' · grau documentado',max)),
  formula:'Somar os oito domínios. Não adicionar o escore neurológico global ou confundir o total com a definição de respondedor de um ensaio.',
  limits:'Idade, contexto clínico e aquisições individuais são essenciais. Não determina tratamento nem oferece percentis de desenvolvimento.',
  sources:[ref('Conitec · avaliação dos marcos motores em AME e HINE-2','https://www.gov.br/conitec/pt-br/midias/consultas/relatorios/2018/relatrio_nusinersena_5q_tipo_i_2018_cp.pdf'),ref('SMA UK · HINE e marcos motores','https://smauk.org.uk/treatments-research/measures-used-to-assess-a-drugs-effectiveness/hine/'),ref('Arizona Department of Health Services · seção 2 modificada nos estudos de AME','https://www.azdhs.gov/documents/preparedness/state-laboratory/newborn-screening/committee/2018/final-compiled-sma-rusp-nomination.pdf')],
  interpret:()=>category('Marcos motores documentados','Comparar os mesmos domínios entre visitas. O total isolado não diferencia modos de aquisição ou perda de marcos.')});
const pancreatitisSeverity=record({id:'naspghan-pancreatitis-severity',name:'NASPGHAN · gravidade da pancreatite',subtitle:'Classificação clínica pediátrica por disfunção orgânica e complicações',
  specialty:'Gastroenterologia',condition:'Pancreatite aguda',aim:purpose.classification,max:3,range:'Leve a grave',categorical:true,
  population:'Crianças e adolescentes com pancreatite aguda estabelecida',aliases:['pancreatite grave','NASPGHAN','falência orgânica'],
  scope:'Estadiar o episódio a partir de disfunção orgânica com critérios pediátricos e da duração desde o início da disfunção. Documentar complicações locais ou sistêmicas já atribuídas ao episódio.',
  fields:[select('organs','Disfunção orgânica pela avaliação pediátrica',[[0,'Ausente'],[1,'Resolvida em até 48 horas'],[2,'Persiste por mais de 48 horas'],[3,'Ainda presente, acompanhada por até 48 horas']]),
    binary('local','Complicação local pancreática/peripancreática',1,'Por exemplo, coleção peripancreática ou necrose.'),
    binary('systemic','Descompensação de comorbidade prévia atribuída à pancreatite')],
  formula:'Falência orgânica persistente por >48 h classifica como grave. Se transitória (resolvida em ≤48 h) ou houver complicação local/sistêmica, o quadro é moderadamente grave. Sem esses achados, leve.',
  limits:'Um quadro em evolução pode mudar de categoria. Não considerar leve uma disfunção em curso. Distinto do prognóstico pelo escore de DeBanto.',
  sources:[ref('NASPGHAN Pancreas Committee · classificação de gravidade pediátrica','https://pubmed.ncbi.nlm.nih.gov/28333771/'),ref('NASPGHAN/SPR · aplicação dos critérios em pediatria','https://doi.org/10.1097/MPG.0000000000002964')],
  interpret:()=>category('Classificação clínica','Reavaliar a disfunção e suas complicações em série.')});
const standardSeverity=pancreatitisSeverity.safeCalculate;
pancreatitisSeverity.safeCalculate=values=>{
  const result=standardSeverity(values);
  if (!result.complete) return result;
  const {data:x}=read(pancreatitisSeverity.fields,values);
  if (x.organs===3) return {complete:true,total:null,displayValue:'Em evolução',label:'Disfunção orgânica ainda presente',
    level:'high',action:'A disfunção ainda não se resolveu e não ultrapassou 48 h. Monitorar e tratar imediatamente. Se persistir além de 48 h, reclassificar como grave.',
    errors:[],audit:'Duração final da disfunção orgânica em aberto.',breakdown:[]};
  const grade=x.organs===2?'Grave':x.organs===1||x.local||x.systemic?'Moderadamente grave':'Leve';
  return {complete:true,total:null,displayValue:grade,label:'Classificação pediátrica NASPGHAN',level:grade==='Leve'?'low':grade==='Grave'?'high':'medium',
    action:'Reavaliar disfunção orgânica e complicações conforme o episódio evolui.',errors:[],audit:'Classificação categórica conforme duração da disfunção e complicações.',breakdown:[]};
};
pediatricSubspecialtyScores.push(aims,hfmse,chop,rulm,hine2,pancreatitisSeverity);
