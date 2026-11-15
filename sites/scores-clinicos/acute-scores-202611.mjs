// Adições adultas em português, com descrições próprias. As opções carregam
// contribuições observadas. Sem preenchimento padrão ou total para dados incompletos.
import { PURPOSES as P } from './clinical-purposes.mjs';

const source = (title, url) => ({title, url});
const pub = (title, pmid) => source(title, 'https://pubmed.ncbi.nlm.nih.gov/' + pmid + '/');
const field = (id, label, choices, hint = '') => ({
  id, label, hint, type: 'select',
  options: choices.map(([value, label]) => ({value, label}))
});
const binary = (id, label, points = 1, hint = '') =>
  field(id, label, [[0, 'Não'], [points, 'Sim']], hint);
const grades = (id, label, levels, hint) => field(id, label, levels.map((s, i) => [i, s]), hint);
const threshold = (cut, name) => n => n >= cut ? name : 'Abaixo do limiar de triagem';
const threeBands = (lowerMax, middleMax, labels) => n =>
  n <= lowerMax ? labels[0] : n <= middleMax ? labels[1] : labels[2];
const roman = ['0','I','II','III','IV','V','VI'];
const gradeName = n => 'Grau ' + roman[n];

function readOption(values, f) {
  try {
    if (!values || typeof values !== 'object' || Array.isArray(values)) return;
    const descriptor = Object.getOwnPropertyDescriptor(values, f.id);
    if (!descriptor || !Object.hasOwn(descriptor, 'value')) return;
    const value = descriptor.value;
    if (typeof value !== 'number' && typeof value !== 'string') return;
    return f.options.find(option => String(option.value) === String(value));
  } catch { return; }
}

function instrument(spec) {
  const {start = 0, subtract = false, interpret, action, criteria = false, ...record} = spec;
  const fields = subtract || criteria ? spec.fields.map(f => ({...f, noPoints:true})) : spec.fields;
  const max = spec.max ?? (subtract ? start : fields.reduce((acc, f) =>
    acc + Math.max(...f.options.map(o => o.value)), start));
  function safeCalculate(values) {
    const options = fields.map(f => readOption(values, f));
    const errors = fields.filter((_, i) => !options[i]).map(f => f.id);
    if (errors.length) return {complete:false, errors};
    const breakdown = fields.map((f, i) => ({label:f.label, points:options[i].value, detail: options[i].label + ' (' + options[i].value + ')'}));
    const sum = breakdown.reduce((acc, r) => acc + r.points, 0);
    const total = subtract ? start - sum : start + sum;
    const audit = subtract ? start + ' − (' + breakdown.map(r => r.points).join(' + ') + ') = ' + total :
      (start ? start + ' + ' : '') + breakdown.map(r => r.points).join(' + ') + ' = ' + total;
    const label = interpret(total);
    return {complete:true, errors:[], total, label, action, audit, breakdown, level:'medium',
      ...(criteria ? {total:null, displayValue: total === 0 ? 'Ausentes' : 'Presentes'} : {})};
  }
  return {...record, fields, max, range:spec.range ?? '0–' + max, reviewDate:'13/11/2026',
    population: spec.population ?? 'Adultos', populationGroups:['adultos'],
    specialties:spec.specialties ?? [spec.specialty], keywords:[...spec.conditions, ...spec.aliases],
    ...(criteria ? {resultScale:false, unit:'',categorical:true} : {}),
    safeCalculate, safeValidate:values => fields.filter(f => !readOption(values, f)).map(f => f.id)};
}

const aha = source('American Heart Association / American Stroke Association · escalas de AVC para equipes pré-hospitalares',
  'https://www.stroke.org/-/media/Stroke-Files/EMS-Resources/Stroke-Screening-and-Severity-Tools-for-LVO-PDF-ucm492585.pdf');
const canadianStroke = source('Canadian Stroke Best Practices · tabela de escalas pré-hospitalares',
  'https://www.strokebestpractices.ca/-/media/1-stroke-best-practices/acute-stroke-management/csbpr2018-acute-stroke-module-final-17jul2018-en.ashx');
const stroke = {specialty:'Neurologia', specialties:['Neurologia','Medicina de urgência'], conditions:['Acidente vascular cerebral'],
  purposes:[P.SCREENING], scope:'Adultos com déficit neurológico agudo suspeito de AVC na avaliação pré-hospitalar.',
  limits:'O exame pode perder oclusões de grande vaso e AVC da circulação posterior. Afasia, intubação, déficits prévios ou item não testável impedem presumir normalidade.',
  action:'Registrar o horário em que foi visto bem pela última vez e acionar o fluxo de AVC conforme a rede, independentemente do total. A confirmação de oclusão exige imagem vascular.'};
const arms = 'Avaliar o braço mais afetado.';
const strokeScores = [
  instrument({...stroke,id:'cpss-cincinnati',name:'CPSS · Cincinnati',subtitle:'Reconhecimento pré-hospitalar de AVC',
    aliases:['Cincinnati Prehospital Stroke Scale','triagem Cincinnati'],formula:'Um ponto por sinal anormal, com triagem positiva a partir de um.',
    fields:[binary('face','Assimetria ao sorrir ou mostrar os dentes'),binary('arm','Queda ou ausência de movimento de um braço em relação ao outro ao estender ambos por 10 segundos'),
      binary('speech','Fala anormal ao repetir uma frase (palavras erradas, disartria ou incapacidade de falar)')],
    interpret:threshold(1,'Triagem positiva para AVC'),sources:[pub('Kothari et al. · validação da CPSS',10092713),aha]}),
  instrument({...stroke,id:'pass-stroke-hastrup',name:'PASS · AVC',subtitle:'Suspeita de oclusão arterial de grande vaso',
    aliases:['Prehospital Acute Stroke Severity Scale','Hastrup'],formula:'Um ponto por item. Limiar estudado ≥2 de 3.',
    fields:[binary('orientation','Erra o mês atual ou a própria idade'),binary('gaze','Paresia ou desvio conjugado do olhar'),binary('arm','Déficit motor em um braço (NIHSS motor do braço >0)')],
    interpret:threshold(2,'Triagem positiva para possível oclusão de grande vaso'),sources:[canadianStroke]}),
  instrument({...stroke,id:'c-stat-cpsss',name:'C-STAT · Cincinnati',subtitle:'Gravidade de AVC e suspeita de oclusão de grande vaso',
    aliases:['Cincinnati Stroke Triage Assessment Tool','CPSSS','Cincinnati Prehospital Stroke Severity Scale'],
    formula:'Desvio do olhar ×2 + falha combinada em perguntas e ordens ×1 + déficit do braço ×1. Limiar ≥2.',
    fields:[binary('gaze','Desvio conjugado do olhar (NIHSS ≥1)',2),
      binary('loc','Erra ao menos uma pergunta E falha ao menos uma ordem',1,'Perguntar idade e mês. Pedir para fechar os olhos e abrir/fechar a mão. Os dois grupos precisam ter falha.'),
      binary('arm','Pelo menos um braço cai no leito em até 10 segundos (NIHSS motor ≥2)')],
    interpret:threshold(2,'Triagem positiva para AVC grave / possível oclusão de grande vaso'),
    sources:[source('Katz et al. · desenvolvimento e validação','https://doi.org/10.1161/STROKEAHA.115.008804'),aha]}),
  instrument({...stroke,id:'fast-ed-stroke',name:'FAST-ED',subtitle:'Triagem pré-hospitalar de oclusão arterial de grande vaso',
    aliases:['Field Assessment Stroke Triage for Emergency Destination'],formula:'Somar os cinco achados neurológicos. O tempo não soma pontos. Limiar estudado ≥4.',
    fields:[grades('face','Paralisia facial',['Ausente ou discreta','Parcial ou completa']),
      grades('arm','Déficit motor do braço',['Sem queda','Queda ou algum esforço contra a gravidade','Sem esforço contra a gravidade ou sem movimento'],arms),
      grades('language','Linguagem (afasia)',['Preservada','Afasia leve ou moderada','Afasia grave/global ou mutismo']),
      grades('eyes','Desvio do olhar',['Ausente','Parcial','Desvio forçado']),
      grades('neglect','Negligência/extinção',['Ausente','Extinção à estimulação bilateral simultânea','Não reconhece a própria mão ou orienta-se apenas a um lado'])],
    interpret:threshold(4,'Triagem positiva para possível oclusão de grande vaso'),sources:[aha,source('FAST-ED · folha técnica da AHA','https://cpr.heart.org/en/-/media/CPR2-Files/Course-Materials/ASLS/Course-Materials/Student-Stroke-Scale-Checklists.pdf')]}),
  instrument({...stroke,id:'race-prehospital-stroke',name:'RACE · AVC',subtitle:'Oclusão arterial de grande vaso no atendimento pré-hospitalar',
    aliases:['Rapid Arterial Occlusion Evaluation'],formula:'Face + braço + perna + desvio cefalo-ocular + uma única avaliação cortical conforme a lateralidade. Limiar ≥5.',
    fields:[grades('face','Paralisia facial',['Ausente','Discreta (assimetria leve)','Moderada/grave (assimetria acentuada)']),
      grades('arm','Braço mais afetado a 90° sentado ou 45° em decúbito',['Sustenta por 10 segundos','Eleva, mas cai antes de 10 segundos','Não consegue elevar contra a gravidade']),
      grades('leg','Perna mais afetada a 30° em decúbito',['Sustenta por 5 segundos','Eleva, mas cai antes de 5 segundos','Não consegue elevar contra a gravidade']),
      binary('gaze','Desvio conjugado cefalo-ocular para um lado'),
      grades('cortex','Afasia à direita OU agnosia à esquerda',['Cumpre duas ordens ou reconhece braço e déficit','Cumpre uma ordem ou falha em reconhecer braço ou déficit','Não cumpre nenhuma ordem ou não reconhece nem braço nem déficit'],
        'Hemiparesia direita: pedir fechar os olhos e fazer um punho. Hemiparesia esquerda: verificar reconhecimento do braço e do déficit. Pontuar apenas o lado aplicável.')],
    scope:stroke.scope+' Nesta ficha, use quando a lateralidade puder ser definida para o componente cortical.',
    interpret:threshold(5,'Triagem positiva para possível oclusão de grande vaso'),sources:[source('Autores da RACE · instruções','https://racescale.org/how-to-use/table/'),aha]})
];

const imaging = {specialty:'Neurologia',specialties:['Neurologia','Radiologia'],conditions:['Acidente vascular cerebral'],purposes:[P.ANATOMIC_SEVERITY],
  start:10,subtract:true,action:'Quanto menor o total, maior a extensão topográfica observada. Interpretar com horário, exame clínico, modalidade e equipe de AVC.',
  limits:'Exige interpretação da imagem por profissional treinado. O total não mede volume diretamente nem decide sozinho indicação ou recusa de reperfusão.'};
const tcRef=source('Journal of NeuroInterventional Surgery · definição dos territórios ASPECTS e pc-ASPECTS',
  'https://jnis.bmj.com/content/neurintsurg/18/5/1202/DC2/embed/inline-supplementary-material-2.pdf?download=true');
const neuroScores = [
  instrument({...imaging,id:'aspects-mca',name:'ASPECTS · circulação anterior',subtitle:'Alterações isquêmicas precoces na TC sem contraste',aliases:['Alberta Stroke Programme Early CT Score','ACM'],
    formula:'10 menos o número de regiões afetadas no mesmo hemisfério da artéria cerebral média.',
    scope:'Adulto com AVC isquêmico agudo em território da artéria cerebral média. Avaliar um único hemisfério na TC sem contraste.',
    fields:[['c','Núcleo caudado'],['l','Núcleo lentiforme'],['ic','Cápsula interna'],['i','Ínsula'],['m1','M1 · córtex anterior no nível ganglionar'],
      ['m2','M2 · córtex lateral no nível ganglionar'],['m3','M3 · córtex posterior no nível ganglionar'],['m4','M4 · anterior supraganglionar'],['m5','M5 · lateral supraganglionar'],['m6','M6 · posterior supraganglionar']].map(([k,l])=>binary(k,l+' com alteração isquêmica precoce')),
    interpret:n=>n===10?'Sem alteração nas regiões examinadas':'Extensão isquêmica na ACM',sources:[pub('Barber et al. · validação original',10905241),tcRef]}),
  instrument({...imaging,id:'pc-aspects',name:'pc-ASPECTS',subtitle:'Extensão isquêmica na circulação posterior',aliases:['posterior circulation ASPECTS','oclusão basilar'],
    formula:'10 menos 1 por tálamo, hemisfério cerebelar ou território da cerebral posterior afetado e 2 por ponte ou mesencéfalo afetado (uma vez por estrutura).',
    scope:'Adulto com suspeita de isquemia posterior, particularmente oclusão basilar. Contrato de imagem-fonte da angio-TC.',
    fields:[binary('thalL','Tálamo esquerdo afetado'),binary('thalR','Tálamo direito afetado'),binary('cerL','Hemisfério cerebelar esquerdo afetado'),
      binary('cerR','Hemisfério cerebelar direito afetado'),binary('pcaL','Território cortical da cerebral posterior esquerda afetado'),binary('pcaR','Território cortical da cerebral posterior direita afetado'),
      binary('midbrain','Mesencéfalo afetado, unilateral ou bilateralmente',2),binary('pons','Ponte afetada, unilateral ou bilateralmente',2)],
    interpret:n=>n===10?'Sem alteração nos territórios examinados':'Extensão isquêmica na circulação posterior',
    sources:[source('Puetz et al. · imagem-fonte da angio-TC','https://pmc.ncbi.nlm.nih.gov/articles/PMC7051302/'),tcRef]}),
  instrument({id:'func-ich',name:'FUNC · hemorragia intracerebral',subtitle:'Prognóstico de independência funcional em 90 dias',specialty:'Neurologia',
    conditions:['Hemorragia intracerebral'],purposes:[P.FUNCTIONAL_PROGNOSIS],aliases:['Functional Outcome in Patients With Primary Intracerebral Hemorrhage','Rost'],
    scope:'Adulto com hemorragia intracerebral primária espontânea. Usar os achados da apresentação inicial e a cognição anterior ao evento.',
    fields:[field('volume','Volume do hematoma na imagem (mL)',[[0,'>60'],[2,'30–60 inclusive'],[4,'<30']]),
      field('age','Idade em anos',[[0,'≥80'],[1,'70–79'],[2,'<70']]),grades('site','Localização do hematoma',['Infratentorial','Profunda','Lobar']),
      field('gcs','Glasgow inicial avaliável',[[0,'3–8'],[2,'9–15']]),binary('cognition','Ausência confirmada de comprometimento cognitivo prévio')],
    formula:'Somar volume, idade, localização, Glasgow e cognição prévia; maiores pontuações se associaram a maior independência.',
    interpret:()=> 'Prognóstico funcional em 90 dias',action:'Usar em conjunto com evolução e condições prévias. O valor descreve associação populacional.',
    limits:'Não aplicar à hemorragia traumática, secundária ou à decisão isolada de limitar suporte. GCS não testável e cognição prévia desconhecida impedem o cálculo.',
    sources:[pub('Rost et al. · coorte original',18556582),source('Penn Neurocritical Care Guide · componentes','https://www.med.upenn.edu/uphscovid19education/assets/user-content/documents/curricula/penn-neurocritical-care-guide-04.07.2020.pdf')]}),
  instrument({id:'paash',name:'PAASH',subtitle:'Gravidade inicial da hemorragia subaracnóidea aneurismática',specialty:'Neurologia',
    conditions:['Hemorragia subaracnóidea'],purposes:[P.PROGNOSIS],aliases:['Prognosis on Admission of Aneurysmal Subarachnoid Hemorrhage'],
    scope:'Adulto com HSA aneurismática confirmada e Glasgow de admissão interpretável.',range:'I–V',
    fields:[field('gcs','Glasgow na admissão',[[1,'15'],[2,'11–14'],[3,'8–10'],[4,'4–7'],[5,'3']])],
    formula:'O Glasgow de admissão define um dos cinco graus da PAASH.',interpret:gradeName,action:'Graus mais altos indicam pior prognóstico de grupo. Registrar o momento do exame e possíveis fatores de confusão.',
    limits:'Sedação, bloqueio neuromuscular ou componente não testável impedem inferir o Glasgow. Não usar o grau para limitar tratamento.',
    sources:[pub('Van Heuven et al. · validação externa',18309166),source('Validação prospectiva e limites de cada faixa','https://www.nature.com/articles/s41598-023-33798-5')]})
];
const avmRef=source('Chinese Stroke Association · graus microcirúrgicos das MAVs cerebrais','https://www.frontiersin.org/journals/neurology/articles/10.3389/fneur.2021.651663/full');
const avm = {specialty:'Neurocirurgia',specialties:['Neurocirurgia','Neurologia'],conditions:['Malformação arteriovenosa cerebral'],purposes:[P.PERIOPERATIVE],
  scope:'Adulto com malformação arteriovenosa cerebral (MAV) já caracterizada por imagem. Avaliação pré-operatória por equipe neurovascular.',
  limits:'São modelos de risco microcirúrgico. A graduação não estima isoladamente a história natural nem define a estratégia terapêutica.',
  action:'Discutir risco microcirúrgico com a equipe neurovascular, integrando anatomia, apresentação clínica e evolução.'};
const avmScores=[
  instrument({...avm,id:'spetzler-martin',name:'Spetzler–Martin',subtitle:'Complexidade microcirúrgica da MAV cerebral',
    aliases:['Spetzler Martin','SM grade'],range:'I–V',
    fields:[field('size','Maior diâmetro do nidus',[[1,'<3 cm'],[2,'3–6 cm inclusive'],[3,'>6 cm']]),binary('eloquent','Adjacente a área cerebral eloquente',1,'Áreas funcionais críticas motoras, sensitivas, visuais, de linguagem e estruturas profundas definidas pela classificação.'),
      binary('deep','Qualquer componente de drenagem venosa profunda, mesmo com drenagem superficial associada')],
    formula:'Tamanho (1–3) + eloquência (0–1) + drenagem profunda (0–1).',interpret:gradeName,
    sources:[pub('Spetzler e Martin · artigo original',3760956),avmRef]}),
  instrument({...avm,id:'lawton-young-supplementary',name:'Lawton–Young · grau suplementar',subtitle:'Complemento ao Spetzler–Martin para microcirurgia de MAV',
    aliases:['supplementary AVM grade','Lawton Young'],range:'I–V',
    fields:[field('age','Idade em anos nesta ficha adulta',[[1,'18–19'],[2,'20–40 inclusive'],[3,'>40']]),binary('unruptured','Apresentação sem hemorragia da MAV'),binary('diffuse','Nidus difuso, com parênquima interposto')],
    formula:'Idade + ausência de apresentação hemorrágica + nidus difuso. O resultado corresponde ao componente suplementar (1–5), sem somar o Spetzler–Martin.',
    interpret:gradeName,sources:[pub('Lawton et al. · escala suplementar original',20190666),avmRef]}),
  instrument({...avm,id:'hdvl-avm',name:'HDVL · MAV cerebral',subtitle:'Risco microcirúrgico anatômico e funcional',aliases:['hemorrhage diffuseness venous drainage lesion-to-eloquence distance'],
    range:'1–6',scope:avm.scope+' Requer distância a área/trato eloquente medida no planejamento por imagem funcional e tractografia.',
    fields:[field('led','Menor distância da lesão à estrutura eloquente',[[1,'>10 mm'],[2,'5–10 mm inclusive'],[3,'<5 mm']]),
      binary('diffuse','Nidus difuso'),binary('deep','Drenagem venosa profunda'),binary('unruptured','Sem hemorragia pré-operatória da MAV')],
    formula:'Distância à eloquência (1–3) + nidus difuso + drenagem profunda + ausência de hemorragia.',interpret:()=> 'Risco microcirúrgico pela HDVL',sources:[pub('Escala suplementar HDVL · estudo original',28362235),avmRef]})
];

const cardio = {specialty:'Cardiologia',conditions:['Fibrilação atrial']};
const afGuideline=source('ACC/AHA/ACCP/HRS · diretriz de fibrilação atrial, tabelas 9 e 10','https://doi.org/10.1161/CIR.0000000000001193');
const cardiacScores=[
  instrument({...cardio,id:'cha2ds2-vasc',name:'CHA₂DS₂-VASc',subtitle:'Risco tromboembólico na fibrilação atrial',aliases:['CHA2DS2-VASc','FA anticoagulação'],
    purposes:[P.COMPLICATIONS],scope:'Adulto com fibrilação atrial. Selecionar a variante de escore apropriada à diretriz adotada.',
    fields:[binary('hf','Insuficiência cardíaca ou disfunção sistólica ventricular esquerda'),binary('hypertension','Hipertensão arterial documentada ou em tratamento'),
      grades('age','Idade em anos',['18–64','65–74','≥75']),binary('dm','Diabetes mellitus'),
      binary('stroke','AVC, AIT ou embolia sistêmica prévios',2),binary('vascular','Doença vascular documentada (IAM prévio, arteriopatia periférica ou placa aórtica)'),
      binary('sex','Sexo feminino no modelo original')],
    formula:'Somar os fatores. Idade ≥75 e AVC/AIT/embolia prévia valem 2 pontos cada. As categorias de idade são excludentes.',
    interpret:()=> 'Risco tromboembólico · variante com categoria de sexo',action:'Integrar a decisão à diretriz e à avaliação individual. Sexo feminino isolado é modificador de risco e não indica anticoagulação por si.',
    limits:'Distinguir do CHA₂DS₂-VA usado pela ESC 2024. Cenários como prótese mecânica ou estenose mitral reumática moderada/grave exigem conduta específica independente do total.',
    sources:[afGuideline,source('ESC 2024 · manejo da fibrilação atrial','https://doi.org/10.1093/eurheartj/ehae176')]}),
  instrument({...cardio,id:'ccs-saf',name:'CCS-SAF',subtitle:'Impacto dos sintomas da fibrilação atrial',aliases:['Canadian Cardiovascular Society Severity of Atrial Fibrillation'],
    purposes:[P.SYMPTOMS],scope:'Adulto com FA. Identificar sintomas, correlacioná-los com a arritmia e avaliar seu efeito na qualidade de vida.',
    fields:[grades('symptoms','Impacto atribuível à FA',['Sem sintomas','Mínimo: episódios infrequentes ou único episódio sem síncope/IC','Leve: discreto incômodo persistente ou episódios raros',
      'Moderado: incômodo na maioria dos dias ou crises mais intensas ou frequentes','Grave: sintomas intensos e muito limitantes, síncope ou insuficiência cardíaca atribuíveis à FA'])],
    formula:'Classe ordinal pela repercussão dos sintomas, de 0 a 4.',interpret:n=>'Classe '+n,action:'Registrar o impacto percebido e acompanhar a evolução. Avaliar prontamente sinais de instabilidade.',
    limits:'A relação sintoma–ritmo deve ser plausível. A classe não estima risco embólico.',
    sources:[source('CCS · guia de bolso','https://ccs.ca/app/uploads/2021/08/AF-Gui-Pocket-Guide-2021-EN.pdf'),source('British Columbia · aplicação da CCS-SAF','https://www2.gov.bc.ca/assets/gov/health/practitioner-pro/bc-guidelines/appendixc.pdf')]}),
  instrument({...cardio,id:'c2hest-af',name:'C₂HEST',subtitle:'Risco de desenvolver fibrilação atrial',aliases:['C2HEST','FA incidente'],purposes:[P.PROGNOSIS],
    scope:'Adulto sem FA prévia. O estudo de derivação excluiu cardiopatia estrutural definida pelo protocolo, como valvopatia ou cardiomiopatia.',
    fields:[binary('cad','Doença arterial coronariana'),binary('copd','DPOC'),binary('hypertension','Hipertensão arterial'),binary('elderly','Idade ≥75 anos',2),
      binary('systolic','Insuficiência cardíaca sistólica',2),binary('thyroid','Hipertireoidismo')],
    formula:'Coronariopatia + DPOC + hipertensão + 2 × idade ≥75 + 2 × IC sistólica + hipertireoidismo.',
    interpret:threeBands(1,3,['Menor risco na coorte','Risco intermediário na coorte','Maior risco na coorte']),
    action:'Estratificação de FA incidente. Confirmar suspeita de arritmia com registro do ritmo.',
    limits:'Derivado e avaliado em populações asiáticas, com desempenho menor na coorte externa. Não diagnostica FA nem define anticoagulação.',sources:[pub('Li et al. · derivação e validação',30292759),afGuideline]})
];

const bronch={specialty:'Pneumologia',conditions:['Bronquiectasias'],purposes:[P.PROGNOSIS],
  scope:'Adulto com bronquiectasias não relacionadas à fibrose cística, avaliado em estabilidade clínica.',
  action:'Usar a faixa como referência prognóstica e correlacionar com a trajetória clínica e microbiologia.',
  limits:'Espirometria deve estar disponível. A pontuação crônica não orienta isoladamente internação ou antibiótico durante uma exacerbação.'};
const bronchBR=source('Sociedade Brasileira de Pneumologia e Tisiologia · consenso de bronquiectasias','https://pmc.ncbi.nlm.nih.gov/articles/PMC6733718/');
const facedRef=source('Martínez-García et al. · componentes e gradação de FACED/E-FACED','https://www.nature.com/articles/s41533-022-00297-5');
const fv=[binary('fev','VEF₁ pós-broncodilatador <50% do previsto',2),binary('age','Idade ≥70 anos',2),binary('pseudomonas','Infecção brônquica crônica por Pseudomonas aeruginosa'),
  binary('lobes','Mais de 2 lobos comprometidos na TCAR',1,'Contar a língula como lobo próprio.'),binary('dyspnea','Dispneia mMRC 3 ou 4 (escala 0–4)')];
const pulmScores=[
  instrument({...bronch,id:'faced-bronchiectasis',name:'FACED',subtitle:'Gravidade de bronquiectasias não fibrocísticas',aliases:['FACED bronquiectasias'],
    fields:fv,formula:'Somar VEF₁ (0/2), idade (0/2), Pseudomonas crônica, extensão na TC e dispneia (0/1 cada).',interpret:threeBands(2,4,['Leve','Moderada','Grave']),sources:[pub('Martínez-García et al. · FACED original, tabela 6',24232697),facedRef,bronchBR]}),
  instrument({...bronch,id:'e-faced-bronchiectasis',name:'E-FACED',subtitle:'Bronquiectasias, incluindo exacerbação grave prévia',aliases:['EFACED bronquiectasias'],
    fields:[...fv,binary('hospital','Pelo menos uma exacerbação com hospitalização no ano anterior',2)],formula:'Somar os cinco componentes FACED e acrescentar 2 pontos se houve exacerbação com internação no ano anterior.',
    interpret:threeBands(3,6,['Leve','Moderada','Grave']),sources:[pub('Martínez-García et al. · E-FACED original',28182132),bronchBR,facedRef]}),
  instrument({id:'gap-ipf',name:'GAP · fibrose pulmonar idiopática',subtitle:'Estadiamento prognóstico da FPI',specialty:'Pneumologia',aliases:['Gender Age Physiology','GAP-IPF'],
    conditions:['Fibrose pulmonar idiopática'],purposes:[P.MORTALITY],scope:'Adulto com fibrose pulmonar idiopática confirmada. Usar CVF e DLCO basais em porcentagem do previsto.',
    fields:[binary('sex','Sexo masculino no modelo'),grades('age','Idade em anos',['18–60','61–65','>65']),
      grades('fvc','CVF em % do previsto',['>75%','50–75%','<50%']),grades('dlco','DLCO em % do previsto',['>55%','>35% a 55%','≤35%','Incapaz de executar a manobra por limitação respiratória'])],
    formula:'Somar sexo, idade, CVF e DLCO. Estágio I (0–3), II (4–5), III (6–8).',interpret:threeBands(3,5,['Estágio I','Estágio II','Estágio III']),
    action:'Comunicar o estágio e integrar à trajetória clínica, saturação e evolução funcional.',
    limits:'DLCO não solicitada, indisponível ou não realizada por motivo não respiratório impede calcular. A estimativa de grupo não prevê individualmente a sobrevida.',
    sources:[pub('Ley et al. · derivação do índice GAP',22586007),source('ClinicalTrials.gov · protocolo, apêndice 6','https://cdn.clinicaltrials.gov/large-docs/89/NCT01872689/Prot_SAP_000.pdf')]}),
  instrument({id:'baces-ntm',name:'BACES',subtitle:'Prognóstico de doença pulmonar por micobactérias não tuberculosas',specialty:'Pneumologia',specialties:['Pneumologia','Infectologia'],
    conditions:['Micobacteriose pulmonar não tuberculosa'],purposes:[P.MORTALITY],aliases:['BACES NTM-PD','micobactéria não tuberculosa'],
    scope:'Adulto com doença pulmonar por micobactéria não tuberculosa confirmada, na avaliação basal.',
    fields:[binary('bmi','IMC <18,5 kg/m²'),binary('age','Idade ≥65 anos'),binary('cavity','Cavitação pulmonar na TC'),
      binary('esr','VHS ≥15 mm/h (homens) ou ≥20 mm/h (mulheres)'),binary('sex','Sexo masculino')],
    formula:'Cada achado vale um ponto. Faixas de 0–1, 2–3 e 4–5.',interpret:threeBands(1,3,['Menor gravidade','Gravidade moderada','Maior gravidade']),
    action:'Interpretar como prognóstico de grupo após confirmar doença, espécie e contexto clínico.',
    limits:'Cultura positiva isolada não estabelece doença. O escore não seleciona o tratamento nem substitui julgamento sobre início de terapia.',
    sources:[pub('Kim et al. · artigo original',32721164),source('European Respiratory Society · definição e validação externa','https://publications.ersnet.org/content/erjor/11/6/00550-2025')]})
];
const trauma={specialty:'Trauma',specialties:['Trauma','Medicina de urgência'],conditions:['Trauma'],purposes:[P.SUPPORT],
  scope:'Adulto traumatizado na chegada à emergência; avaliar risco de transfusão maciça no contexto de hemorragia.',
  action:'Limiar atingido aumenta a suspeita de necessidade transfusional. Integrar com sangramento, instabilidade e protocolo local. Hemorragia crítica exige ação imediata em qualquer pontuação.',
  limits:'FAST não realizado ou inconclusivo não equivale a negativo. O escore não é prescrição de hemocomponentes e não exclui hemorragia com valor baixo.'};
const bleedFields=[binary('penetrating','Mecanismo penetrante'),binary('fast','FAST abdominal positivo para líquido livre')];
const bloodSource=source('Trauma Services BC · diretriz de hemorragia maciça em trauma','https://www.phsa.ca/Documents/Trauma-Services/2024-04-10_Massive_Hemorrhage.pdf');
const chest={specialty:'Trauma',specialties:['Trauma','Medicina de urgência'],conditions:['Trauma torácico'],purposes:[P.SCREENING],criteria:true,
  scope:'Adulto acordado, examinável e hemodinamicamente estável após trauma contuso ocorrido nas 6 horas que precederam a chegada, quando o médico já cogita imagem do tórax.',
  formula:'Regra binária: a possibilidade de dispensar o exame requer ausência de todos os critérios. Cada resposta positiva sinaliza um critério presente.',
  limits:'Fora do escopo em instabilidade, intubação com exame não confiável ou trauma penetrante. A presença de critério por si só não indica imagem. Não confundir RX e TC nem aplicar a um doente em ressuscitação.',
  interpret:n=>n===0?'Nenhum critério da regra':'Pelo menos um critério presente'};
const rapid=binary('rapid','Desaceleração rápida',1,'Queda >20 pés (6,096 m) ou colisão de veículo motorizado >40 mph (64,37 km/h).');
const distract=binary('distraction','Outra lesão dolorosa que prejudica o exame');
const tenderness=binary('wall','Dor à palpação da parede torácica');
const chestCTFields=[binary('cxr','RX inicial de tórax anormal',1,'Lesão torácica, inclusive clavícula, ou mediastino alargado.'),distract,tenderness,
  binary('sternum','Dor à palpação do esterno'),binary('spine','Dor à palpação da coluna torácica'),binary('scapula','Dor à palpação da escápula')];
const ctSource=source('Rodriguez et al. · derivação e validação prospectiva multicêntrica das duas regras de TC','https://doi.org/10.1371/journal.pmed.1001883');
const chestSource=source('Autores do NEXUS Chest · aplicação clínica das regras','https://stacks.cdc.gov/view/cdc/43322/cdc_43322_DS1.pdf');
const traumaScores=[
  instrument({...trauma,id:'abc-massive-transfusion',name:'ABC · transfusão maciça',subtitle:'Assessment of Blood Consumption na chegada do traumatizado',
    aliases:['Assessment of Blood Consumption','protocolo de transfusão maciça'],
    fields:[...bleedFields,binary('sbp','Pressão arterial sistólica ≤90 mmHg na chegada'),binary('hr','Frequência cardíaca ≥120 bpm na chegada')],
    formula:'Um ponto por mecanismo penetrante, FAST positivo, PAS ≤90 e FC ≥120. Limiar do estudo ≥2 de 4.',interpret:threshold(2,'Maior risco de transfusão maciça'),
    sources:[pub('Nunez et al. · derivação do ABC',19204506),bloodSource]}),
  instrument({...trauma,id:'rabt-trauma',name:'RABT',subtitle:'Risco de transfusão maciça após trauma',aliases:['Revised Assessment of Bleeding and Transfusion'],
    fields:[...bleedFields,binary('shock','Índice de choque (FC/PAS) >1,0 na chegada',1,'Usar FC em bpm e PAS em mmHg do mesmo momento. Um índice exatamente igual a 1 não pontua.'),binary('pelvis','Fratura pélvica')],
    formula:'Somar mecanismo penetrante, FAST positivo, FC/PAS >1,0 e fratura pélvica. Limiar ≥2.',
    interpret:threshold(2,'Maior risco de transfusão maciça'),sources:[source('Estudo original · derivação da RABT','https://doi.org/10.1007/s00268-018-4674-y')]}),
  instrument({...chest,id:'nexus-chest-xray',name:'NEXUS Chest · radiografia',subtitle:'Seleção de radiografia após trauma torácico contuso',aliases:['NEXUS Chest X-ray','RX de tórax no trauma'],
    fields:[binary('age','Idade >60 anos'),rapid,binary('pain','Dor torácica'),binary('intoxication','Intoxicação'),distract,tenderness,binary('alert','Alteração do estado mental ou do nível de alerta')],
    action:'Na ausência de todos os critérios, pode-se considerar dispensar RX em pessoa elegível; com algum presente, avaliar a indicação individualmente.',
    sources:[pub('Rodriguez et al. · validação NEXUS Chest',23925583),chestSource]}),
  instrument({...chest,id:'nexus-chest-ct-major',name:'NEXUS Chest CT-Major',subtitle:'Lesões torácicas maiores após trauma contuso',aliases:['NEXUS CT Major'],
    fields:chestCTFields,action:'Ausência de critérios identifica baixo risco de lesão torácica maior para ponderar dispensar TC. Lesões menores podem passar despercebidas.',sources:[ctSource,chestSource]}),
  instrument({...chest,id:'nexus-chest-ct-all',name:'NEXUS Chest CT-All',subtitle:'Lesões torácicas maiores ou menores após trauma contuso',aliases:['NEXUS CT All'],
    fields:[...chestCTFields,rapid],action:'Ausência de critérios identifica baixo risco de lesões maiores ou menores para ponderar dispensar TC. Reavaliar sinais clínicos e evolução.',sources:[ctSource,chestSource]})
];

const headTrauma={specialty:'Trauma',specialties:['Trauma','Neurologia','Neurocirurgia'],conditions:['Traumatismo cranioencefálico'],
  scope:'Adulto com traumatismo cranioencefálico e TC de crânio disponível para avaliação especializada.',
  limits:'Não seleciona quem precisa de TC. Correlacionar com o exame, sedação, tendência clínica e evolução radiológica.',
  action:'Registrar o padrão tomográfico e correlacionar com os demais achados. O prognóstico de grupo não define decisões individuais sobre tratamento.'};

const criticalScores=[
  instrument({...headTrauma,id:'rotterdam-ct-tbi',name:'Rotterdam · TC no TCE',subtitle:'Prognóstico tomográfico no trauma craniano',aliases:['Rotterdam CT score','Maas'],
    purposes:[P.PROGNOSIS],start:1,range:'1–6',
    fields:[grades('cisterns','Cisternas basais',['Preservadas','Comprimidas','Ausentes']),binary('shift','Desvio da linha média >5 mm'),
      binary('epiduralAbsent','Ausência de lesão expansiva epidural',1,'Hematoma epidural presente vale zero neste componente.'),binary('sahIvh','Hemorragia subaracnóidea traumática ou sangue intraventricular')],
    formula:'1 + cisternas (0–2) + desvio >5 mm + ausência de lesão expansiva epidural + HSA traumática ou hemorragia intraventricular.',
    interpret:()=> 'Classificação prognóstica de Rotterdam',sources:[pub('Maas et al. · desenvolvimento',16331165),source('World Federation of Neurology · classificação de Rotterdam','https://wfneurology.org/public/documents/PeEmr/TC48_Vos_Hall%20J_Wed%20%5BRead%20Only%5D.pdf')]}),
  instrument({...headTrauma,id:'marshall-ct-tbi',name:'Marshall · TC no TCE',subtitle:'Classificação morfológica do Traumatic Coma Data Bank',aliases:['Marshall CT','TCDB'],
    purposes:[P.CLASSIFICATION],range:'I–VI',
    fields:[field('pattern','Padrão da TC e informação sobre evacuação da lesão',[
      [1,'Sem lesão intracraniana visível'],[2,'Lesão difusa, cisternas presentes, desvio ≤5 mm e nenhuma lesão hiperdensa/mista >25 mL'],
      [3,'Cisternas comprimidas ou ausentes, desvio ≤5 mm e nenhuma lesão hiperdensa/mista >25 mL'],
      [4,'Desvio >5 mm, sem lesão hiperdensa/mista >25 mL'],[5,'Lesão expansiva submetida a evacuação cirúrgica'],
      [6,'Lesão expansiva hiperdensa ou mista >25 mL sem evacuação cirúrgica']])],
    formula:'Identificar uma das seis classes. Lesão expansiva evacuada é V. Lesão hiperdensa/mista >25 mL não evacuada é VI.',
    interpret:gradeName,sources:[source('NIH/NINDS · definição das seis classes','https://cde.nlm.nih.gov/deView?tinyId=DW300DwRkgk'),pub('Maas e Marshall et al. · avaliação comparativa',16331165)]}),
  instrument({id:'macocha-icu',name:'MACOCHA',subtitle:'Risco de intubação difícil na UTI',specialty:'Terapia intensiva',
    specialties:['Terapia intensiva','Anestesiologia'],conditions:['Via aérea difícil'],purposes:[P.COMPLICATIONS],aliases:['MACOCHA intubação','De Jong'],
    scope:'Adulto crítico antes da intubação traqueal em UTI. O treinamento do operador integra a previsão original.',
    fields:[binary('mallampati','Mallampati III ou IV',5),binary('osa','Síndrome de apneia obstrutiva do sono',2),
      binary('neck','Mobilidade cervical limitada'),binary('mouth','Abertura da boca <3 cm'),binary('coma','Coma na avaliação anterior à indução'),
      binary('hypoxia','Hipoxemia grave (SpO₂ <80%)'),binary('operator','Intubação a ser realizada por profissional não anestesiologista')],
    formula:'Somar Mallampati (5), apneia obstrutiva (2) e os outros cinco fatores (1 cada). Limiar ≥3.',
    interpret:threshold(3,'Maior risco de intubação difícil'),action:'Integrar ao plano de via aérea, otimizar oxigenação e mobilizar equipe e equipamentos conforme o risco observado.',
    limits:'Mallampati não aferível ou fator desconhecido impede obter o total nesta ficha. Não atrasar manejo de via aérea ameaçada para completar o escore. Baixa pontuação não exclui dificuldade.',
    sources:[pub('De Jong et al. · estudo multicêntrico em UTI',23348979),source('DAS/ICS/FICM/RCoA · intubação do adulto crítico','https://pure.manchester.ac.uk/ws/files/75540494/DAS_ICU_Guidelines_for_the_management_of_tracheal_intubation_in_the_critically_ill_adult._On_behalf_of_DAS_ICS_FICM_RCoA._10.10.17_BAM_.pdf')]})
];
export const acuteScores=[...strokeScores,...neuroScores,...avmScores,...cardiacScores,...pulmScores,...traumaScores,...criticalScores];
