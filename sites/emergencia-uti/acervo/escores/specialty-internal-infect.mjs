import {make, y, n, b, ref} from './expanded-scores.mjs';

// Proposed additions: reviewed primary sources and explicit population/versions.
// ALBI and FLI use original SI inputs to avoid hidden conversion or log-base ambiguity.
export const specialtyExpansionPart = [
  make({
    id:'albi', name:'ALBI · grau original', specialty:'Clínica médica', specialties:['Clínica médica','Hepatologia','Oncologia'],
    subtitle:'Reserva funcional hepática por albumina e bilirrubina',
    range:'Índice contínuo; graus 1–3', resultScale:false, unit:'índice', precision:3,
    population:'Adultos com hepatopatia crônica, especialmente carcinoma hepatocelular',
    scope:'Modelo original de Johnson et al., 2015, desenvolvido em carcinoma hepatocelular e testado em hepatopatia crônica sem tumor.',
    fields:[{...n('albumin','Albumina (g/L)',1,80,.1,'Unidade original: g/L. Se o laboratório informa g/dL, multiplicar por 10.'),noPoints:true},{...n('bilirubin','Bilirrubina total (µmol/L)',.01,2000,.01,'Unidade original: µmol/L. Não inserir diretamente um resultado em mg/dL.'),noPoints:true}],
    formula:'ALBI = 0,66 × log₁₀(bilirrubina total em µmol/L) − 0,085 × albumina em g/L. Grau 1: ≤−2,60; grau 2: >−2,60 a ≤−1,39; grau 3: >−1,39.',
    compute:x=>{const total=.66*Math.log10(x.bilirubin)-.085*x.albumin;const grade=total<=-2.6?1:total<=-1.39?2:3;return {total,label:`ALBI grau ${grade}`,level:grade===1?'low':grade===2?'medium':'high',action:'Integrar grau à hepatopatia, estado clínico e planejamento especializado. Não fornece probabilidade individual de morte.',breakdown:[],audit:`0,66×log₁₀(${x.bilirubin})−0,085×${x.albumin}; grau ${grade}`};},
    limits:'Não mede estágio tumoral, não diagnostica cirrose e não decide tratamento isoladamente. Hipoalbuminemia extra-hepática e causas não hepáticas de hiperbilirrubinemia influenciam o resultado. Cortes calculados antes do arredondamento.',
    sources:[ref('Johnson et al. · desenvolvimento e validação do ALBI · JCO 2015','https://pmc.ncbi.nlm.nih.gov/articles/PMC4322258/'),ref('Murray et al. · ALBI em CHC após radioterapia · fórmula e graus, p. 8 · 2018','https://eprints.whiterose.ac.uk/id/eprint/131758/1/ALBI%20manuscript%20accepted.pdf')]
  }),
  make({
    id:'fatty-liver-index',name:'Fatty Liver Index · FLI',specialty:'Clínica médica',specialties:['Clínica médica','Hepatologia'],
    subtitle:'Triagem de esteatose hepática em adultos',max:100,range:'0–100',resultScale:false,unit:'índice',precision:2,
    population:'Adultos; estudo original com participantes de 18–75 anos',
    scope:'Modelo de Bedogni et al., 2006, desenvolvido na população geral italiana usando ultrassonografia como referência.',
    fields:[{...n('bmi','IMC (kg/m²)',10,80,.01),noPoints:true},{...n('waist','Circunferência da cintura (cm)',30,250,.1),noPoints:true},{...n('triglycerides','Triglicerídeos (mg/dL)',1,10000,.1,'Coleta em jejum no estudo original. Não usar mmol/L sem converter.'),noPoints:true},{...n('ggt','GGT (U/L)',1,10000,.1),noPoints:true}],
    formula:'L = 0,953×ln(triglicerídeos em mg/dL) + 0,139×IMC + 0,718×ln(GGT em U/L) + 0,053×cintura em cm − 15,745. FLI = 100/(1+exp(−L)).',
    compute:x=>{const l=.953*Math.log(x.triglycerides)+.139*x.bmi+.718*Math.log(x.ggt)+.053*x.waist-15.745;const total=100/(1+Math.exp(-l));return {total,label:total<30?'FLI <30 · abaixo do limiar de triagem':total>=60?'FLI ≥60 · esteatose mais provável':'FLI 30 a <60 · indeterminado',level:total<30?'low':total>=60?'high':'medium',action:'Integrar ao contexto metabólico e à avaliação hepática; considerar ultrassonografia ou exame indicado. O índice não confirma nem exclui esteatose isoladamente.',breakdown:[],audit:`L = 0,953×ln(${x.triglycerides})+0,139×${x.bmi}+0,718×ln(${x.ggt})+0,053×${x.waist}−15,745 = ${l}; FLI = 100/(1+exp(−L))`};},
    limits:'Não identifica etiologia, esteato-hepatite ou estágio de fibrose. Desempenho e cortes variam entre populações; não extrapolar para crianças. Utiliza logaritmo natural e triglicerídeos em mg/dL. Classificação usa valor não arredondado.',
    sources:[ref('Bedogni et al. · Fatty Liver Index original · BMC Gastroenterology 2006','https://pmc.ncbi.nlm.nih.gov/articles/PMC1636651/')]
  }),
  make({
    id:'denova',name:'DENOVA',specialty:'Infectologia',specialties:['Infectologia','Cardiologia'],
    subtitle:'Risco de endocardite na bacteremia monomicrobiana por E. faecalis',max:6,
    population:'Adultos com bacteremia monomicrobiana por Enterococcus faecalis',
    scope:'Seis componentes com 1 ponto cada. Modelo desenvolvido especificamente para bacteremia monomicrobiana por E. faecalis. Considerar informações disponíveis quando o clínico recebe o resultado positivo da hemocultura.',
    fields:[y('duration','D · sintomas compatíveis por ≥7 dias antes da coleta da primeira hemocultura positiva'),y('embolization','E · embolização séptica compatível ao exame ou à imagem'),y('cultures','N · ≥2 hemoculturas positivas para E. faecalis',1,'Considerar coletas independentes; não contar apenas dois frascos da mesma coleta como duas hemoculturas.'),y('unknownOrigin','O · origem da bacteremia desconhecida',1,'No estudo original, origem conhecida exige infecção focal com pelo menos dois: sinais/sintomas típicos; E. faecalis isolado no foco; imagem compatível com foco provável de entrada.'),y('valve','V · doença valvar predisponente, prótese valvar ou endocardite prévia',1,'Condição cardíaca prévia com risco moderado ou alto de endocardite, incluindo doença valvar nativa, prótese valvar ou endocardite prévia.'),y('murmur','A · sopro cardíaco à ausculta',1,'Qualquer sopro documentado no estudo original.')],
    bands:[b(2,'DENOVA <3 · não exclui endocardite','medium','Avaliar contexto, persistência/recorrência da bacteremia e suspeita clínica. Resultado abaixo do corte não autoriza dispensar ecocardiografia isoladamente.'),b(6,'DENOVA ≥3 · risco aumentado','high','Priorizar avaliação de endocardite e ecocardiografia apropriada com infectologia/cardiologia.')],
    limits:'Não usar para excluir endocardite em crianças, outras espécies ou bacteremia polimicrobiana. Suspeita clínica, embolização, prótese/dispositivo intracardíaco ou bacteremia persistente exigem avaliação independente da soma. Validação multicêntrica recente encontrou casos de endocardite classificados abaixo do corte.',
    sources:[ref('Berge et al. · DENOVA original · Infection 2019, métodos e definições','https://link.springer.com/article/10.1007/s15010-018-1208-3'),ref('Zimmermann et al. · validação multicêntrica NOVA/DENOVA · OFID, tabela 2','https://pmc.ncbi.nlm.nih.gov/articles/PMC12784196/')]
  }),
  make({
    id:'quick-pitt',name:'quick Pitt · ITU/Li 2022',specialty:'Infectologia',specialties:['Infectologia','Emergência e UTI'],
    subtitle:'Gravidade na bacteremia secundária à infecção urinária',max:5,
    population:'Adultos hospitalizados com infecção da corrente sanguínea secundária à infecção urinária',
    scope:'Versão empregada por Li et al., 2022, na bacteremia secundária à ITU: cinco variáveis binárias, 1 ponto cada. Coletar sinais vitais e estado clínico da admissão; não somar piores valores de dias distintos.',
    fields:[y('hypothermia','Temperatura <36 °C na admissão'),y('hypotension','PAS ≤90 mmHg na admissão',1,'Versão Li 2022 inclui PAS exatamente de 90. Uso de vasopressor, isoladamente, não é acrescentado ao item nesta versão.'),y('respiratory','FR ≥25 irpm ou ventilação mecanicamente assistida na admissão'),y('arrest','Parada cardíaca na avaliação de admissão'),y('mental','Estado mental alterado na admissão')],
    bands:[b(1,'quick Pitt <2','medium','Pontuação menor não afasta deterioração, sepse ou necessidade de tratamento. Integrar perfusão, função orgânica e evolução.'),b(5,'quick Pitt ≥2 · risco aumentado','high','Priorizar estabilização, investigação do foco, controle de foco e antimicrobiano apropriado; não aguardar o escore.')],
    limits:'Não diagnostica sepse, não fornece porcentagem individual de mortalidade e não seleciona antimicrobiano. Estudo retrospectivo; não extrapolar automaticamente para crianças ou outros focos. Preserva a versão Li 2022, com PAS ≤90 e sinais da admissão, distinta do corte <90 ou vasopressor do modelo original de Battle 2019.',
    sources:[ref('Li et al. · quick Pitt na bacteremia secundária à ITU · 2022, métodos','https://pmc.ncbi.nlm.nih.gov/articles/PMC9375986/'),ref('Battle et al. · derivação original quick Pitt · Infection 2019 · PMID 30737765','https://pubmed.ncbi.nlm.nih.gov/30737765/')]
  })
];

// Independent examples and boundaries to include in meaningful implementation tests.
export const specialtyExpansionFixtures = [
  {id:'albi',input:{albumin:40,bilirubin:10},total:-2.74,label:'ALBI grau 1'},
  {id:'albi',input:{albumin:30,bilirubin:10},total:-1.89,label:'ALBI grau 2'},
  {id:'albi',input:{albumin:20,bilirubin:10},total:-1.04,label:'ALBI grau 3'},
  {id:'fatty-liver-index',input:{bmi:20,waist:70,triglycerides:100,ggt:20},total:6.207439547045293,label:'FLI <30 · abaixo do limiar de triagem'},
  {id:'fatty-liver-index',input:{bmi:25,waist:85,triglycerides:150,ggt:30},total:36.63738515985425,label:'FLI 30 a <60 · indeterminado'},
  {id:'fatty-liver-index',input:{bmi:30,waist:100,triglycerides:200,ggt:50},total:82.96471998235441,label:'FLI ≥60 · esteatose mais provável'},
  {id:'denova',input:{duration:0,embolization:0,cultures:1,unknownOrigin:1,valve:0,murmur:0},total:2,label:'DENOVA <3 · não exclui endocardite'},
  {id:'denova',input:{duration:1,embolization:0,cultures:1,unknownOrigin:1,valve:0,murmur:0},total:3,label:'DENOVA ≥3 · risco aumentado'},
  {id:'quick-pitt',input:{hypothermia:1,hypotension:0,respiratory:0,arrest:0,mental:0},total:1,label:'quick Pitt <2'},
  {id:'quick-pitt',input:{hypothermia:1,hypotension:1,respiratory:0,arrest:0,mental:0},total:2,label:'quick Pitt ≥2 · risco aumentado'}
];
