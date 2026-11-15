// Clinical definitions for each instrument live beside its fields and source references.
const pick = (id, label, options) => ({
  id, label, type: 'select', noPoints: true,
  options: options.map(([value, text]) => ({value, label: text})),
});
const number = (id, label, min, max, step) => ({id, label, min, max, step, type: 'number'});
const yesNo = (id, label) => pick(id, label, [[0, 'Ausente'], [1, 'Presente']]);
const source = (title, url) => ({title, url});
const pub = (title, id) => source(title, 'https://pubmed.ncbi.nlm.nih.gov/'+id+'/');
const rch = source('Royal Children’s Hospital Melbourne · tabela modificada de Buchanan', 'https://www.rch.org.au/clinicalguide/guideline_index/Immune_thrombocytopenic_purpura/');
const niddk = source('NIDDK · equações e unidades para TFG pediátrica e neonatal','https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/children-adolescents-young-adults');
const infection = 'Infectologia';
const renal = 'Nefrologia';
const eye = 'Oftalmologia';
const ped = ['pediatria'];
const mixed = ['pediatria','adultos'];
const neo = ['neonatal'];
const unitGfr = 'mL/min/1,73 m²';
const result = (total,label,action,audit,level='low') => ({total,label,action,audit,level});
const category = (displayValue,action,audit,level='medium') => ({...result(null,displayValue,action,audit,level),displayValue});

function interpret(field, values) {
  if (values === null || typeof values !== 'object' || Array.isArray(values)) return;
  const descriptor = Object.getOwnPropertyDescriptor(values, field.id);
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) return;
  const input = descriptor.value;
  if (typeof input !== 'string' && typeof input !== 'number') return;
  if (field.type === 'select') return field.options.find(option => String(option.value) === String(input))?.value;
  if (typeof input === 'string' && !/^\d+(\.\d+)?$/.test(input)) return;
  const v = Number(input);
  if (Number.isFinite(v) && v >= field.min && v <= field.max && (field.step !== 1 || Number.isInteger(v))) return v;
}

function instrument(data, evaluate) {
  const fields = data.fields;
  function read(values) {
    const x = {}, errors = [];
    for (const field of fields) {
      try { x[field.id] = interpret(field, values); } catch { x[field.id] = undefined; }
      if (x[field.id] === undefined) errors.push(field.id);
    }
    return {x, errors};
  }
  return {
    aliases: [], reviewDate: '13/11/2026', specialties: [data.specialty,'Pediatria'], unit: 'pontos', resultScale: false,
    ...data,
    safeValidate: values => read(values).errors,
    safeCalculate(values) {
      const {x, errors} = read(values);
      if (errors.length) return {complete:false,total:null,errors};
      const calculated = evaluate(x);
      const breakdown = fields.map(f => ({
        label:f.label, points:x[f.id],
        detail:f.type==='select' ? f.options.find(option => option.value===x[f.id]).label : String(x[f.id]),
      }));
      return {complete:true, errors:[], alerts:[], breakdown,...calculated};
    },
  };
}

const coma = instrument({
  id:'blantyre-malaria',name:'Blantyre · coma na malária pediátrica',specialty:infection,
  subtitle:'Resposta motora, vocalização e direção do olhar em crianças pequenas.',population:'Crianças até 5 anos com suspeita de malária grave',populationGroups:ped,
  conditions:['Malária','Alteração do nível de consciência'],purposes:['Nível de consciência'],keywords:['malária cerebral','coma','Blantyre'],
  scope:'Avaliar a melhor resposta em criança pequena, inclusive pré-verbal, no contexto de malária. Interpretar após correção de hipoglicemia e considerar convulsões recentes e sedação.',
  formula:'Somar resposta motora (0–2), resposta verbal (0–2) e olhar (0–1).',range:'0–5',max:5,
  limits:'Coma exige estabilização e investigação imediatas. A escala não identifica a causa do rebaixamento e não substitui a avaliação neurológica.',
  fields:[pick('motor','Melhor resposta motora',[[0,'Resposta inespecífica ou ausente'],[1,'Retira o membro ao estímulo doloroso'],[2,'Localiza o estímulo doloroso']]),
    pick('voice','Melhor resposta verbal',[[0,'Sem vocalização'],[1,'Gemido ou choro inadequado'],[2,'Choro ou resposta apropriada']]),
    pick('gaze','Movimentos oculares',[[0,'Sem direcionar o olhar'],[1,'Dirige o olhar para um alvo']])],
  sources:[pub('Molyneux et al. · coorte de malária cerebral',2690177),source('OMS · manual de campo, anexo VIII','https://www.who.int/docs/default-source/documents/publications/gmp/malaria-control-in-humanitarian-emergencies-an-inter-agency-field-handbook.pdf')],
}, x => {
  const t=x.motor+x.voice+x.gaze;
  return result(t,t<=2?'Coma não despertável pelo critério da OMS':t===5?'Pontuação máxima':'Resposta reduzida','Documentar componentes, investigar fatores reversíveis e acompanhar a evolução.',[x.motor,x.voice,x.gaze].join(' + ')+' = '+t,t<=2?'high':t<5?'medium':'low');
});

const lods = instrument({
  id:'lods-malaria-pediatrica',name:'Lambaréné · disfunção orgânica na malária',specialty:infection,
  subtitle:'Três achados à admissão para estratificar gravidade em malária pediátrica.',population:'Crianças hospitalizadas com malária por P. falciparum',populationGroups:ped,
  conditions:['Malária'],purposes:['Prognóstico de mortalidade'],keywords:['malária grave','LODS','prostração'],
  scope:'Derivado em crianças hospitalizadas em seis centros africanos. Utilizar o exame de admissão e o desenvolvimento prévio para avaliar prostração.',
  formula:'Um ponto para cada um de três achados. O critério de coma usa Blantyre <3.',range:'0–3',max:3,
  limits:'Pontuação prognóstica de coorte. Zero não exclui malária grave. Calibração individual para o Brasil não estabelecida.',
  fields:[number('blantyre','Escore de Blantyre documentado',0,5,1),yesNo('prostration','Incapacidade de mamar, sentar, ficar em pé ou andar, conforme capacidade prévia'),yesNo('breathing','Respiração anormalmente profunda ao exame')],
  sources:[pub('Helbok et al. · derivação do LODS',19911989),pub('Conroy et al. · validação prospectiva',25879892),source('BMJ Paediatrics Open · definições clínicas','https://bmjpaedsopen.bmj.com/content/10/1/e004856')],
}, x => {
  const components=[Number(x.blantyre<3),x.prostration,x.breathing], t=components.reduce((a,b)=>a+b);
  return result(t,t?'Marcador de maior risco na coorte':'Nenhum dos três achados','Integrar com glicemia, anemia, perfusão e demais critérios de gravidade.',components.join(' + ')+' = '+t,t?'high':'low');
});

const bleedingGrades=[
  ['0','Nenhum sangramento novo'],['1','Até 100 petéquias e/ou até 5 equimoses pequenas (até 3 cm), sem sangramento de mucosa'],
  ['2','Mais de 100 petéquias e/ou mais de 5 equimoses grandes (>3 cm), sem sangramento de mucosa'],
  ['3a','Sangue nas narinas, epistaxe até 5 min, petéquias orais/palatinas, púrpura oral indolor ou limitada aos molares'],
  ['3b','Epistaxe >5 min, hematúria, hematoquezia, púrpura oral dolorosa ou menorragia importante'],
  ['4','Hemorragia mucosa grave ou suspeita de hemorragia interna que exige intervenção imediata'],
  ['5','Hemorragia intracraniana documentada ou sangramento com ameaça à vida em qualquer sítio'],
];
const itp=instrument({
  id:'buchanan-modificado-rch',name:'Buchanan modificado · sangramento na PTI',specialty:'Hematologia',
  subtitle:'Graduação pediátrica de sangramento com distinção entre os graus 3a e 3b.',population:'Crianças com trombocitopenia imune',populationGroups:ped,
  conditions:['Trombocitopenia imune'],purposes:['Gravidade clínica'],keywords:['PTI','sangramento','Buchanan'],
  scope:'Selecionar o grau mais alto cujos descritores estejam presentes. A contagem de plaquetas não participa da classificação.',
  range:'0–5, com 3a e 3b',categorical:true,formula:'Classificação ordinal pela pior manifestação observada na versão do RCH.',
  limits:'A versão modificada difere da rubrica original. Em quadro não classificável, descrever os achados. Suspeita de hemorragia interna exige atendimento imediato.',
  fields:[pick('grade','Manifestação mais grave',bleedingGrades)],sources:[rch,pub('Buchanan e Adix · instrumento precursor',12410198),source('Blood Advances · uso multicêntrico da classificação','https://pmc.ncbi.nlm.nih.gov/articles/PMC13342808/')],
},x=>category('Grau '+x.grade,['4','5'].includes(x.grade)?'Avaliação e intervenção de emergência.':x.grade==='3b'?'Avaliação hospitalar urgente pelo risco hemorrágico.':'Integrar sangramento atual, evolução e condições de seguimento.',bleedingGrades.find(([id])=>id===x.grade)[1],['4','5','3b'].includes(x.grade)?'high':x.grade==='3a'?'medium':'low'));

const etrop=instrument({
  id:'etrop-prematuridade',name:'ETROP · retinopatia da prematuridade',specialty:eye,
  subtitle:'Classificação pré-limiar em tipos 1 e 2 após exame de retina.',population:'Prematuros em acompanhamento oftalmológico',populationGroups:neo,specialties:[eye,'Neonatologia','Pediatria'],
  conditions:['Retinopatia da prematuridade'],purposes:['Classificação e estadiamento'],keywords:['ETROP','retinopatia da prematuridade','doença plus'],
  scope:'Classificar cada olho separadamente a partir de zona, estágio e doença plus documentados pelo oftalmologista. Aplicável aqui a ROP nos estágios 1–3 em zonas I ou II, sem forma agressiva.',
  limits:'Pre-plus isolado não satisfaz o critério plus. Doença agressiva, descolamento ou progressão exigem avaliação especializada imediata, mesmo fora desta tabela.',
  range:'Tipo 1 / tipo 2 / fora dos critérios',categorical:true,formula:'Cruzar zona, estágio e presença de doença plus conforme o ensaio ETROP.',
  fields:[pick('zone','Zona',[[1,'Zona I'],[2,'Zona II']]),pick('stage','Estágio',[[1,'Estágio 1'],[2,'Estágio 2'],[3,'Estágio 3']]),yesNo('plus','Doença plus')],
  sources:[pub('ETROP Cooperative Group · ensaio randomizado e definições',14662586),source('AAP · recomendações de avaliação e tratamento','https://publications.aap.org/pediatrics/article/142/6/e20183061/37478/Screening-Examination-of-Premature-Infants-for'),source('Sociedade Brasileira de Pediatria · diretriz de retinopatia da prematuridade','https://www.sbp.com.br/fileadmin/user_upload/pdfs/39-guideline-for-the-screening.pdf')],
},x=>{
  const type1=x.zone===1?(x.plus===1||x.stage===3):(x.stage>=2&&x.plus===1);
  const type2=!x.plus&&(x.zone===1||x.stage===3);
  return category(type1?'ETROP tipo 1':type2?'ETROP tipo 2':'Fora dos critérios ETROP 1/2',type1?'Acionar o oftalmologista com urgência para tratamento oportuno.':'Manter seguimento oftalmológico seriado com intervalo ajustado ao exame.','Zona '+x.zone+', estágio '+x.stage+', '+(x.plus?'com':'sem')+' plus.',type1?'high':'medium');
});

const renalLimits='TFG estimada e indexada à superfície corporal. Creatinina em rápida mudança limita a interpretação. Não usar esta estimativa isolada para ajuste de doses.';
const height=number('height','Comprimento ou estatura (cm)',1,300,0.01);
const creat=number('creatinine','Creatinina sérica (mg/dL, padronizada por IDMS)',0.001,100,0.001);
const u25=instrument({
  id:'ckid-u25-creatinina',name:'CKiD U25 · TFG por creatinina',specialty:renal,subtitle:'Equação de Pierce com coeficiente que varia conforme sexo e idade.',
  population:'1 a 25 anos · doença renal crônica',populationGroups:mixed,conditions:['Doença renal crônica'],purposes:['Estimativa de função de órgão'],keywords:['TFG','CKiD U25','creatinina'],
  scope:'Para indivíduos de 1 a 25 anos com DRC leve a moderada. Usar idade em anos decimais e creatinina enzimática. Quando a cistatina C também está disponível, o NIDDK prefere a média das duas estimativas U25.',
  limits:renalLimits,range:'TFG estimada',unit:unitGfr,
  formula:'κ × altura em metros / creatinina em mg/dL. Antes dos 12 anos, κ = base × 1,008^(idade−12). Dos 12 aos <18 anos, usar 1,023 (feminino) ou 1,045 (masculino), com bases 36,1 e 39,0. A partir dos 18 anos, κ = 41,4 ou 50,8, respectivamente.',
  fields:[number('age','Idade em anos decimais',1,25,0.01),pick('sex','Sexo na equação',[[0,'Feminino'],[1,'Masculino']]),height,creat],
  sources:[niddk,pub('Pierce et al. · equações CKiD U25',33301749)],
},x=>{
  const base=x.sex?39:36.1;
  const factor=x.age<12?1.008:x.sex?1.045:1.023;
  const k=x.age>=18?(x.sex?50.8:41.4):base*factor**(x.age-12);
  const t=k*(x.height/100)/x.creatinine;
  return result(Number(t.toFixed(2)),'TFG estimada pela CKiD U25','Interpretar a tendência junto com o contexto clínico e a albuminúria.',k.toFixed(4)+' × '+x.height+'/100 ÷ '+x.creatinine+' = '+t.toFixed(2)+' '+unitGfr);
});

const neonatalGfr=instrument({
  id:'tfg-neonatal-smeets',name:'TFG neonatal · Smeets',specialty:renal,specialties:[renal,'Neonatologia','Pediatria'],
  subtitle:'Filtração glomerular estimada por comprimento e creatinina no recém-nascido a termo.',population:'RN a termo até 4 semanas',populationGroups:neo,
  conditions:['Avaliação da função renal neonatal'],purposes:['Estimativa de função de órgão'],keywords:['TFG neonatal','creatinina','rim neonatal'],
  scope:'Restringir a recém-nascidos a termo nas primeiras quatro semanas. Usar comprimento em centímetros e creatinina sérica padronizada em mg/dL.',
  formula:'0,31 × comprimento (cm) / creatinina (mg/dL).',limits:renalLimits+' Nos primeiros dias a creatinina ainda reflete parcialmente a materna.',unit:unitGfr,range:'TFG estimada',
  fields:[height,creat],sources:[niddk,pub('Smeets et al. · metanálise individual',35474022)],
},x=>{const t=0.31*x.height/x.creatinine;return result(Number(t.toFixed(2)),'TFG estimada no RN a termo','Interpretar pela idade pós-natal, diurese e evolução da creatinina.','0,31 × '+x.height+' ÷ '+x.creatinine+' = '+t.toFixed(2)+' '+unitGfr);});

const sun=instrument({
  id:'sun-uveite-anterior',name:'SUN · atividade da uveíte anterior',specialty:eye,
  subtitle:'Gradua separadamente células e flare na câmara anterior de cada olho.',population:'Crianças e adultos com exame em lâmpada de fenda',populationGroups:mixed,
  conditions:['Uveíte anterior'],purposes:['Atividade da doença'],keywords:['uveíte','câmara anterior','flare'],
  scope:'Exame biomicroscópico de um olho por vez. Contar células em um campo de feixe de 1 × 1 mm e selecionar o aspecto do flare.',
  formula:'Classificar células e flare em escalas ordinais independentes do grupo SUN.',range:'Células 0–4+ e flare 0–4+',categorical:true,
  limits:'Documentar hipópio separadamente. Esses dois componentes não classificam vítreo, prognóstico visual ou etiologia.',
  fields:[pick('cells','Células em um campo de 1 × 1 mm',[[0,'Nenhuma'],[1,'1 a 5'],[2,'6 a 15'],[3,'16 a 25'],[4,'26 a 50'],[5,'Mais de 50']]),
    pick('flare','Flare na câmara anterior',[[0,'Ausente'],[1,'Discreto'],[2,'Moderado, detalhes da íris e do cristalino nítidos'],[3,'Marcado, detalhes pouco nítidos'],[4,'Intenso, com fibrina ou aspecto plástico']])],
  sources:[pub('Grupo SUN · primeiro workshop internacional',16196117),source('ClinicalTrials.gov · Protocolo BP41321, apêndice 6','https://cdn.clinicaltrials.gov/large-docs/61/NCT04265261/Prot_SAP_000.pdf')],
},x=>{const cells=['0','0,5+','1+','2+','3+','4+'][x.cells],flare=x.flare?x.flare+'+':'0';const label='Células '+cells+' · flare '+flare;return category(label,'Registrar o olho examinado e comparar cada componente nas avaliações seriadas.',label);});

export const pediatricClinicalAdditions=[coma,lods,itp,etrop,u25,neonatalGfr,sun];
