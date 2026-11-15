// Instrument-specific definitions for the existing calculator, search and references views.
import { PURPOSES as P } from './clinical-purposes.mjs';

const ref = (title, url) => ({title, url});
const pm = (title, id) => ref(title, 'https://pubmed.ncbi.nlm.nih.gov/' + id + '/');
const choose = (id, label, pairs, hint = '') => ({
  id, label, type:'select', hint, noPoints:true,
  options:pairs.map(([value, text]) => ({value:String(value), label:text})),
});
const yn = (id, label) => choose(id, label, [[0,'Não'],[1,'Sim']]);
const numeric = (id, label, min, max, step = 1, hint = '') => ({
  id, label, min, max, step, type:'number', hint,
  placeholder:max === Number.MAX_SAFE_INTEGER ? 'Valor documentado' : min + ' a ' + max,
});
const count = (id, label, min = 0) => numeric(id, label, min, Number.MAX_SAFE_INTEGER);
const measure = (id, label, min = 0) => numeric(id, label, min, Number.MAX_SAFE_INTEGER, 'any');
const scale = (id, label, items) => choose(id,label,items.map((item,index)=>[index,item]));
const sum = values => Object.values(values).reduce((total, value) => total + value, 0);
const round2 = value => Math.round(value * 100) / 100;
// Preserve the side of a decision threshold even when presentation normally rounds to it.
function showAtCutoff(value, thresholds){
  const rounded=round2(value), threshold=thresholds.find(t=>t===rounded && value!==t);
  return threshold===undefined ? {} : {displayValue:(value<threshold?'< ':'> ')+threshold};
}
const pediatric = ['pediatria'], adult = ['adultos'];
const assess = (total,label,action,audit,more={}) => ({total,label,action,audit,...more});

function readValues(fields, values) {
  const data = {}, errors = [];
  for (const f of fields) {
    let d;
    try {
      if (values && typeof values === 'object' && !Array.isArray(values)) {
        d = Object.getOwnPropertyDescriptor(values,f.id);
      }
    } catch { /* Reject inaccessible data properties. */ }
    const raw = d && Object.hasOwn(d,'value') ? d.value : undefined;
    const validToken = typeof raw === 'number' || (typeof raw === 'string' && /^\d+(\.\d+)?$/.test(raw));
    const value = validToken ? Number(raw) : NaN;
    const valid = f.type === 'select' ? validToken && f.options.some(o=>o.value===String(raw))
      : Number.isFinite(value) && value >= f.min && value <= f.max && (f.step!==1 || Number.isSafeInteger(value));
    if (valid) data[f.id]=value;
    else errors.push(f.id);
  }
  return {data, errors};
}

function instrument(meta, fields, evaluate, check) {
  const { groups = adult, conditions, purposes, specialties, sources, ...rest } = meta;
  function inputs(values) {
    const state=readValues(fields,values);
    if (check && !state.errors.length) state.errors.push(...check(state.data));
    return state;
  }
  return {
    ...rest, specialty:specialties[0], specialties, sources, fields, conditions, purposes,
    populationGroups:groups, keywords:[...conditions, ...(rest.aliases||[])], reviewDate:'13/11/2026',
    safeValidate: values => inputs(values).errors,
    safeCalculate(values) {
      const {data,errors}=inputs(values);
      if (errors.length) return {complete:false,total:null,errors,reason:'Confira a elegibilidade e os campos destacados.'};
      const result=evaluate(data);
      const breakdown=fields.map(f=>({label:f.label,detail:f.type==='select'
        ? f.options.find(o=>o.value===String(data[f.id])).label : String(data[f.id])}));
      return {complete:true,errors:[],level:'medium',alerts:[],breakdown,...result};
    }
  };
}
function additive(meta, fields, interpret) {
  return instrument(meta,fields,x=>{
    const total=sum(x);
    return assess(total,interpret(total),meta.limits,Object.values(x).join(' + ') + ' = ' + total);
  });
}

const povoc=additive({
  id:'povoc-eberhart',name:'POVOC · vômito pós-operatório pediátrico',aliases:['Eberhart','postoperative vomiting in children'],
  subtitle:'Eberhart 2004 · primeiros 24 h',groups:pediatric,specialties:['Anestesiologia','Pediatria'],
  population:'0–14 anos sob anestesia geral',conditions:['Vômito pós-operatório pediátrico'],purposes:[P.PERIOPERATIVE,P.COMPLICATIONS],
  max:4,range:'0–4',scope:'Crianças em cirurgia sob anestesia geral. A coorte original foi observada por 24 horas sem profilaxia antiemética.',
  formula:'1 ponto para cada um dos quatro fatores presentes.',limits:'A incidência observada no estudo não é previsão individual. A profilaxia pode alterar o risco.',
  sources:[pm('Eberhart et al. · desenvolvimento e validação multicêntrica',15562045)]
},[yn('age','Idade ≥3 anos, dentro da faixa de 0–14 anos'),yn('duration','Duração cirúrgica ≥30 min'),yn('strab','Cirurgia para estrabismo'),yn('history','Vômito pós-operatório prévio na criança ou vômito/náuseas e vômitos pós-operatórios em mãe, pai ou irmãos')],
n=>'Frequência de vômito na coorte original: '+[9,10,30,55,70][n]+'%');

const colds = additive({
  id:'colds-pediatric-uri',name:'COLDS · risco respiratório perioperatório',aliases:['COLDS score','IVAS e anestesia'],
  subtitle:'Anestesia pediátrica eletiva · infecção de vias aéreas superiores',groups:pediatric,specialties:['Anestesiologia','Pediatria'],
  population:'Menores de 18 anos com IVAS atual ou recente e cirurgia eletiva',conditions:['Infecção respiratória alta','Risco anestésico pediátrico'],purposes:[P.PERIOPERATIVE,P.COMPLICATIONS],
  max:25,range:'5–25',scope:'Estimar o risco relativo de eventos respiratórios em cirurgia eletiva sob anestesia geral. Classifique achados e plano anestésico conforme a folha COLDS.',
  formula:'Cada domínio recebe 1, 2 ou 5 pontos. Somar os cinco domínios.',
  limits:'Maior pontuação corresponde a maior risco; o valor isolado não determina adiamento. Validar o plano com anestesiologia.',
  sources:[pm('Kim et al. · validação pediátrica',36295501),ref('Jarraya et al. · apêndice, versão dos cinco domínios','https://wjps.bmj.com/content/wjps/6/2/e000524/DC1/embed/inline-supplementary-material-1.pdf')]
},[
  choose('symptoms','Sintomas atuais',[[1,'Ausentes'],[2,'Leves (p. ex., coriza, congestão, tosse seca)'],[5,'Moderados ou intensos (p. ex., tosse produtiva, febre alta, secreção purulenta)']]),
  choose('onset','Início dos sintomas',[[1,'Há mais de 4 semanas'],[2,'Há 2–4 semanas, inclusive'],[5,'Há menos de 2 semanas']]),
  choose('lung','Condição pulmonar/predisposição',[[1,'Sem condição associada'],[2,'Leve (p. ex., asma intermitente leve, exposição ao tabaco ou antecedente de VSR)'],[5,'Moderada/grave (p. ex., asma persistente moderada, apneia obstrutiva, hipertensão pulmonar)']]),
  choose('device','Dispositivo de via aérea previsto',[[1,'Nenhum ou máscara facial'],[2,'Supraglótico'],[5,'Tubo traqueal']]),
  choose('surgery','Tipo de cirurgia',[[1,'Outras, inclusive tubo de ventilação otológico'],[2,'Via aérea de menor porte, como adenotonsilectomia ou broncoscopia flexível'],[5,'Via aérea de maior porte, como palatoplastia, broncoscopia rígida ou cirurgia maxilofacial']])
],n=>'Risco respiratório perioperatório · '+n+' pontos');

const koivuranta = additive({
  id:'koivuranta-ponv',name:'Koivuranta · náuseas e vômitos pós-operatórios',aliases:['PONV','NVPO Koivuranta'],
  subtitle:'Versão simplificada · cinco preditores',specialties:['Anestesiologia'],population:'Adultos em cirurgia',
  conditions:['Náuseas e vômitos pós-operatórios'],purposes:[P.PERIOPERATIVE,P.COMPLICATIONS],max:5,range:'0–5',
  scope:'Avaliação de fatores associados a náusea e vômito após cirurgia. A história de cinetose é contada separadamente da história de NVPO.',
  formula:'Somar 1 por fator presente. Duração cirúrgica estritamente maior que 60 min.',
  limits:'A probabilidade depende da técnica anestésica e das medidas preventivas. Interpretar no contexto perioperatório.',
  sources:[pm('Koivuranta et al. · estudo original',9165963),ref('Anaesthesia · operacionalização da versão simplificada','https://doi.org/10.1046/j.1365-2044.2002.02782_4.x')]
},[yn('female','Sexo feminino no modelo original'),yn('ponv','Antecedente de náusea ou vômito pós-operatório'),yn('motion','Antecedente de cinetose'),yn('long','Cirurgia com duração >60 min'),yn('nonsmoker','Não fumante')],n=>n+' de 5 fatores de risco');

const myer = instrument({
  id:'myer-cotton-subglotica',name:'Myer–Cotton · estenose subglótica',aliases:['Cotton–Myer','grau de estenose subglótica'],
  groups:pediatric,specialties:['Otorrinolaringologia','Pediatria'],subtitle:'1994 · classificação anatômica endoscópica',population:'Crianças com estenose subglótica avaliada por especialista',
  conditions:['Estenose subglótica'],purposes:[P.ANATOMIC_SEVERITY,P.CLASSIFICATION],max:4,range:'I–IV',scope:'Converter a obstrução percentual de área determinada por avaliação endoscópica padronizada, usando o diâmetro externo do tubo e a referência para idade. Ausência completa de lúmen corresponde a grau IV.',
  formula:'I até 50%, II acima de 50% até 70%, III acima de 70% com lúmen residual, IV obliteração completa.',
  limits:'Aplicar apenas a estenose estabelecida. Confirmar a técnica e a referência de calibre; não extrapolar para escolha de tubo ou gravidade aguda de estridor.',
  sources:[pm('Myer, O’Connor e Cotton · definição original',8154776),pm('Influência do modelo de tubo na graduação',36688266)]
},[choose('narrow','Obstrução da área luminal documentada',[[1,'Até 50% em estenose existente'],[2,'>50% até 70%'],[3,'>70%, com lúmen residual'],[4,'Nenhum lúmen detectável']])],x=>assess(x.narrow,'Grau '+['','I','II','III','IV'][x.narrow],'Correlacionar com extensão, nível da lesão e repercussão clínica.','Grau anatômico pela área de obstrução.'));

const mirels = additive({
  id:'mirels-long-bone',name:'Mirels · risco de fratura patológica',aliases:['Metástase em osso longo','Mirels score'],
  specialties:['Ortopedia','Oncologia'],subtitle:'Lesão metastática em osso longo',population:'Adultos com metástase de osso longo sem fratura estabelecida',
  conditions:['Metástase óssea','Fratura patológica'],purposes:[P.COMPLICATIONS],max:12,range:'4–12',
  scope:'Pontuar uma única lesão de cada vez, correlacionando a radiografia e o padrão de dor da mesma lesão.',
  formula:'Somar quatro domínios de 1–3 pontos.',
  limits:'A avaliação ortopédica considera anatomia, impacto funcional e prognóstico. A coorte original foi pequena e retrospectiva; não utilizar na coluna vertebral.',
  sources:[pm('Mirels · derivação',2684463),ref('CECOG/SAKK · aplicação clínica e faixas','https://www.thebreastonline.com/article/S0960977614000964/pdf')]
},[choose('site','Local da lesão',[[1,'Membro superior'],[2,'Membro inferior fora da região peritrocantérica'],[3,'Região peritrocantérica']]),
  choose('pain','Dor associada à lesão',[[1,'Leve'],[2,'Moderada'],[3,'Dor funcional ao uso ou apoio']]),
  choose('type','Padrão radiográfico',[[1,'Blástico'],[2,'Misto'],[3,'Lítico']]),
  choose('size','Tamanho transversal relativo ao diâmetro ósseo',[[1,'<1/3'],[2,'1/3 até 2/3'],[3,'>2/3']])
],n=>n<=7?'Faixa até 7':n===8?'Faixa intermediária · 8':'Risco elevado · ≥9');

const phq4=instrument({
  id:'phq4-distress',name:'PHQ-4 · ansiedade e depressão',aliases:['Patient Health Questionnaire-4'],specialties:['Saúde mental','Clínica médica'],
  subtitle:'Rastreio conjunto · últimas duas semanas',population:'Adultos com ambas as subescalas respondidas',conditions:['Sintomas ansiosos e depressivos'],purposes:[P.SCREENING,P.SYMPTOMS],
  max:12,range:'0–12',scope:'Inserir os resultados completos das duas subescalas, aplicadas para o mesmo período de duas semanas.',
  formula:'PHQ-2 + GAD-2. Faixas de sofrimento: 0–2, 3–5, 6–8 e 9–12. Cada subescala é positiva a partir de 3.',
  limits:'A triagem não define diagnóstico. Avaliar segurança diretamente quando houver preocupação clínica.',
  sources:[ref('NIH · Patient Health Questionnaire 4','https://www.nih.gov/node/21506'),ref('NINDS · interpretação do PHQ-4','https://cde-fe.ninds.nih.gov/ninds/noc-report/F2495/Patient%20Health%20Questionnaire%20-%204%20%28PHQ-4%29')]
},[numeric('phq','PHQ-2 completo (0–6)',0,6),numeric('gad','GAD-2 completo (0–6)',0,6)],x=>{
  const t=sum(x);
  return assess(t,['Mínimo','Leve','Moderado','Intenso'][Math.floor(Math.min(t,9)/3)],
    'Subtriagem depressiva '+(x.phq>=3?'positiva':'abaixo de 3')+'; subtriagem ansiosa '+(x.gad>=3?'positiva':'abaixo de 3')+'. Avaliar o contexto clínico.',
    x.phq+' + '+x.gad+' = '+t);
});
const phqAds = additive({
  id:'phq-ads',name:'PHQ-ADS · intensidade de ansiedade e depressão',aliases:['PHQ Anxiety and Depression Scale'],specialties:['Saúde mental','Clínica médica'],
  subtitle:'Composto PHQ-9 + GAD-7',population:'Adultos com os dois questionários completos referentes às mesmas duas semanas',
  conditions:['Sintomas ansiosos e depressivos'],purposes:[P.SYMPTOMS],max:48,range:'0–48',scope:'Quantifica conjuntamente sintomas ansiosos e depressivos. Inserir somas originais das duas escalas.',
  formula:'PHQ-9 (0–27) + GAD-7 (0–21). Categorias mínimas (0–9), leves (10–19), moderadas (20–29) ou intensas (30–48).',
  limits:'Avaliar separadamente ideação ou autoagressão identificadas pelo PHQ-9, independentemente da soma. Validação inicial em adultos em atenção primária e oncologia.',
  sources:[ref('Kroenke et al. · validação inicial e pontos de corte','https://pmc.ncbi.nlm.nih.gov/articles/PMC4927366/')]
},[numeric('phq','PHQ-9 completo',0,27),numeric('gad','GAD-7 completo',0,21)],n=>['Sintomas mínimos','Sintomas leves','Sintomas moderados','Sintomas intensos'][Math.min(3,Math.floor(n/10))]);

const phq8 = additive({
  id:'phq8-depression',name:'PHQ-8 · sintomas depressivos',aliases:['Patient Health Questionnaire-8'],
  specialties:['Saúde mental','Clínica médica'],subtitle:'Oito itens · últimas duas semanas',population:'Adultos com os oito itens respondidos',
  conditions:['Sintomas depressivos'],purposes:[P.SCREENING,P.SYMPTOMS],max:24,range:'0–24',scope:'Registrar a frequência de cada domínio das últimas duas semanas, usando o formulário PHQ-8 aplicado. Esta ficha pontua os domínios em português.',
  formula:'Somar os oito itens (0–3). O limiar de rastreio avaliado no estudo foi 10.',
  limits:'Ausência de item sobre morte ou autoagressão: avaliar risco diretamente, inclusive se o rastreio estiver abaixo de 10.',
  sources:[pm('Kroenke et al. · PHQ-8 em população geral',18752852),ref('AHRQ · itens dos diferentes instrumentos PHQ','https://www.ncbi.nlm.nih.gov/books/NBK592801/table/appa.tab5/')]
},['Perda de interesse ou prazer','Humor deprimido ou desesperança','Sono reduzido ou excessivo','Cansaço ou falta de energia','Apetite diminuído ou aumentado','Autodepreciação ou sentimento de fracasso','Dificuldade de concentração','Lentificação ou inquietação psicomotora percebida por terceiros']
  .map((label,i)=>scale('i'+(i+1),label,['Nenhum dia','Vários dias','Mais da metade dos dias','Quase todos os dias'])),n=>n>=10?'Rastreio positivo (≥10)':'Abaixo do limiar de 10');

const who5 = instrument({
  id:'who5-wellbeing',name:'WHO-5 · bem-estar mental',aliases:['Índice de bem-estar da OMS'],specialties:['Saúde mental','Clínica médica'],
  subtitle:'OMS · pontuação percentual',population:'Adultos com formulário WHO-5 preenchido',conditions:['Bem-estar mental'],purposes:[P.SCREENING],
  max:100,range:'0–100',resultScale:false,unit:'%',scope:'Aplicar o formulário oficial para as últimas duas semanas e transcrever os cinco pontos individuais, já pontuados de 0 a 5.',
  formula:'Somar cinco itens (0–25) e multiplicar por quatro. Maior percentual significa maior bem-estar autorreferido.',
  limits:'O escore é uma medida de bem-estar; eventual investigação diagnóstica é clínica. A fonte da OMS disponibiliza formulário em português.',
  sources:[ref('OMS · WHO-5, publicação e formulários oficiais','https://www.who.int/publications/m/item/who-ucn-msd-mhe-2024.01')]
},['Ânimo','Tranquilidade','Disposição','Descanso ao despertar','Interesse no cotidiano'].map((l,i)=>numeric('i'+(i+1),'Item '+(i+1)+' · '+l+' (pontos)',0,5)),x=>assess(4*sum(x),'Percentual de bem-estar','Avaliar o relato atual e comparar com aplicações anteriores.','4 × '+sum(x)+' = '+4*sum(x)+'%'));

const k6 = additive({
  id:'kessler-k6',name:'K6 · sofrimento psíquico',aliases:['Kessler Psychological Distress Scale 6'],specialties:['Saúde mental'],
  subtitle:'Seis itens · últimos 30 dias',population:'Adultos com autorrelato válido',conditions:['Sofrimento psíquico'],purposes:[P.SCREENING],
  max:24,range:'0–24',scope:'Registrar a frequência dos seis domínios de sofrimento no período de 30 dias. Usar a aplicação do questionário K6.',
  formula:'Somar seis frequências, de 0 a 4. Limiar de sofrimento grave no rastreio: ≥13.',
  limits:'A pontuação orienta investigação de sofrimento psíquico. Diagnóstico, segurança e suporte necessário dependem da avaliação individual.',
  sources:[ref('SAMHSA · definição metodológica K6','https://www.samhsa.gov/data/sites/default/files/reports/rpt56484/NSDUHDetailedTabs2024/NSDUHDetailedTabs2024/2024-nsduh-detailed-tables-appa.htm'),ref('INSPQ · escore, interpretação e licença','https://www.inspq.qc.ca/en/post-disaster-mental-health-impacts-surveillance-toolkit/standardized-measurement-instruments/information-sheets-standardized-measurement-instruments-recommended/psychological-distress')]
},['Nervosismo','Desesperança','Inquietação','Tristeza tão intensa que nada animava','Tudo parecia exigir esforço','Sentimento de inutilidade'].map((l,i)=>scale('i'+i,l,['Nunca','Poucas vezes','Parte do tempo','Na maior parte do tempo','O tempo todo'])),n=>n>=13?'Sofrimento grave no rastreio (≥13)':'Abaixo de 13');

const audit=additive({
  id:'audit10-who',name:'AUDIT · uso de álcool',aliases:['AUDIT completo','AUDIT-10'],specialties:['Saúde mental','Clínica médica'],
  subtitle:'OMS · instrumento completo de 10 itens',population:'Adultos em rastreamento de consumo de álcool',conditions:['Uso de álcool'],purposes:[P.SCREENING],
  max:40,range:'0–40',scope:'Aplicar o formulário AUDIT da OMS. Transcrever os pontos dos dez itens, preservando o período e a definição de dose padrão da versão aplicada. Os dois últimos itens distinguem eventos recentes dos anteriores.',
  formula:'Somar itens 1–8 (0 a 4 cada) e itens 9–10 (somente 0, 2 ou 4 cada).',
  limits:'As zonas de referência da OMS orientam avaliação complementar; pontos de corte podem variar por população e contexto. A soma não determina dependência.',
  sources:[ref('OMS · AUDIT, diretrizes de uso em atenção primária','https://www.who.int/publications/i/item/who-msd-msb-01.6a'),ref('HSE · orientação de pontuação','https://www.drugs.ie/NDRICdocs/protocol1/templates/AUDIT.pdf')]
},['Frequência de consumo','Quantidade habitual','Consumo de seis ou mais doses','Dificuldade em parar','Compromissos não cumpridos','Bebida matinal','Culpa ou remorso','Falha de memória','Lesão associada ao consumo','Preocupação de terceiros'].map((l,i)=>i<8?numeric('i'+i,'Item '+(i+1)+' · '+l+' (pontos)',0,4):choose('i'+i,l,[[0,'Não'],[2,'Sim, anteriormente ao último ano'],[4,'Sim, no último ano']])),n=>n<8?'Zona I · 0–7':n<16?'Zona II · 8–15':n<20?'Zona III · 16–19':'Zona IV · 20–40');

const sarcCalf=instrument({
  id:'sarc-calf-br',name:'SARC-CalF · rastreio de sarcopenia',aliases:['SARC-F e circunferência da panturrilha','SARC-CalF Brasil'],specialties:['Geriatria','Nutrição'],
  subtitle:'Versão brasileira com circunferência da panturrilha',population:'Pessoas idosas · rastreio de sarcopenia',conditions:['Sarcopenia'],purposes:[P.SCREENING],
  max:20,range:'0–20',scope:'Registrar o SARC-F completo e a maior circunferência da panturrilha em centímetros, segundo a técnica padronizada. Usar os limiares sexoespecíficos da versão brasileira.',
  formula:'Somar 10 ao SARC-F quando a panturrilha for ≤34 cm em homens ou ≤33 cm em mulheres. Limiar de triagem: ≥11.',
  limits:'Edema e alterações de composição corporal afetam a circunferência. Avaliar força, massa muscular e desempenho para a investigação diagnóstica.',
  sources:[pm('Barbosa-Silva et al. · desenvolvimento no Brasil',27650212),pm('Mazocco et al. · validação externa brasileira',32919183)]
},[numeric('sarc','SARC-F completo (pontos)',0,10),choose('sex','Categoria de referência do estudo',[[0,'Mulher'],[1,'Homem']]),measure('calf','Maior circunferência da panturrilha (cm)',0.01)],x=>{
  const cut=x.sex===1?34:33, bonus=x.calf<=cut?10:0,t=x.sarc+bonus;
  return assess(t,t>=11?'Triagem positiva (≥11)':'Abaixo de 11','Integrar com força muscular e avaliação nutricional.',x.sarc+' + '+bonus+' = '+t+'; referência ≤'+cut+' cm.');
});

const sppb=additive({
  id:'sppb-4m',name:'SPPB · desempenho físico',aliases:['Short Physical Performance Battery'],specialties:['Geriatria','Reabilitação'],
  subtitle:'Protocolo de marcha de 4 metros',population:'Pessoas idosas com teste padronizado',conditions:['Limitação de desempenho físico'],purposes:[P.FUNCTION],
  max:12,range:'0–12',scope:'Avaliar equilíbrio em progressão, caminhada habitual de 4 m (melhor de duas tentativas) e cinco elevações da cadeira com braços cruzados. Usar cronômetro com centésimos de segundo.',
  formula:'Somar equilíbrio, marcha e teste da cadeira (0–4 cada). Menor pontuação indica pior desempenho.',
  limits:'Incapacidade observada conforme protocolo pontua zero. Exame não realizado ou desconhecido não equivale a incapacidade.',
  sources:[ref('National Institute on Aging · SPPB e manual','https://www.nia.nih.gov/research/resource/short-physical-performance-battery-sppb'),ref('NIA LIFE · formulário de pontuação','https://agingresearchbiobank.nia.nih.gov/studies/life/documents/download/Forms_Pilot/pL02_Short%20Physical%20Performance%20Battery.pdf/')]
},[scale('balance','Equilíbrio em pé, sem apoio',['Pés paralelos <10 s ou incapaz','Pés paralelos por 10 s; semitandem <10 s','Semitandem por 10 s; tandem <3 s','Semitandem por 10 s; tandem de 3 a <10 s','Tandem por 10 s após as etapas anteriores']),
  scale('walk','Marcha de 4 m, melhor tempo',['Incapaz','>8,70 s','6,21–8,70 s','4,82–6,20 s','<4,82 s']),
  scale('chair','Cinco elevações sem auxílio dos braços',['Incapaz ou tempo >60 s','16,70–60 s','13,70–16,69 s','11,20–13,69 s','≤11,19 s'])],n=>'Desempenho físico · '+n+'/12');
const tug=instrument({
  id:'tug-steadi',name:'Timed Up & Go · mobilidade',aliases:['TUG','Levantar e caminhar cronometrado'],specialties:['Geriatria','Reabilitação'],
  subtitle:'STEADI · percurso de 3 metros',population:'Pessoas idosas capazes de completar o trajeto com segurança',conditions:['Quedas em idosos','Mobilidade'],purposes:[P.FUNCTION,P.SCREENING],
  max:null,range:'segundos',resultScale:false,unit:'s',scope:'Cronometrar desde o comando de início até voltar a sentar após levantar da cadeira, caminhar 3 m no ritmo habitual, girar e retornar. Permitir o dispositivo de marcha habitual.',
  formula:'Tempo total em segundos; na triagem STEADI, ≥12 s indica risco aumentado de quedas.',
  limits:'Incapacidade de completar requer avaliação funcional individual. Testar com supervisão e condições seguras.',
  sources:[ref('CDC · protocolo STEADI — TUG','https://www.cdc.gov/steadi/media/pdfs/STEADI-Assessment-TUG-508.pdf'),pm('Podsiadlo e Richardson · teste original',1991946)]
},[measure('time','Tempo total do percurso completo (s)',0.01)],x=>assess(x.time,x.time>=12?'Risco de queda no critério STEADI':'Abaixo de 12 s','Correlacionar com marcha, equilíbrio e história de quedas.',x.time+' s; limiar ≥12 s.',showAtCutoff(x.time,[12])));
const chair30=instrument({
  id:'chair30-steadi',name:'Chair Stand · levantar da cadeira em 30 s',aliases:['STEADI 30-second chair stand'],specialties:['Geriatria','Reabilitação'],
  subtitle:'STEADI · referência por idade e sexo',population:'Pessoas de 60–94 anos',conditions:['Risco de queda','Força de membros inferiores'],purposes:[P.FUNCTION,P.SCREENING],
  max:null,range:'repetições',resultScale:false,unit:'repetições',scope:'Cadeira de 43 cm, sem braços; braços cruzados sobre o tórax. Contar elevações completas em 30 s; incluir a última se já ultrapassou metade da elevação. Se precisar usar braços, encerrar e atribuir zero.',
  formula:'Comparar a contagem com o limite inferior publicado para a idade em anos e o sexo de referência. Pontuação igual ao limite não está abaixo da referência.',
  limits:'Interpretar junto com marcha, medicações e histórico de quedas. A tabela disponível termina em 94 anos.',
  sources:[ref('CDC · protocolo e tabela STEADI','https://cdc.gov/steadi/media/pdfs/STEADI-Assessment-30Sec-508.pdf')]
},[numeric('age','Idade (anos completos)',60,94),choose('sex','Categoria da tabela',[[0,'Mulher'],[1,'Homem']]),count('reps','Número de elevações em 30 s')],x=>{
  const cut=[[12,11,10,10,9,8,4],[14,12,12,11,10,8,7]][x.sex][Math.floor((x.age-60)/5)];
  return assess(x.reps,x.reps<cut?'Abaixo da referência STEADI':'Alcança a referência STEADI','Investigar outros fatores de queda conforme a avaliação.',x.reps+' repetições; abaixo da referência quando <'+cut+'.');
});

const napFields=[];
for (const side of ['direita','esquerda']) for(let i=1;i<=5;i++){
  const prefix=side[0]+i, digit=['polegar','indicador','médio','anelar','mínimo'][i-1];
  napFields.push(numeric(prefix+'m',digit+' · mão '+side+' · quadrantes de matriz',0,4),
    numeric(prefix+'l',digit+' · mão '+side+' · quadrantes de leito',0,4));
}
const napsi=additive({
  id:'napsi-10-fingernails',name:'NAPSI · psoríase das unhas das mãos',aliases:['Nail Psoriasis Severity Index'],specialties:['Dermatologia','Reumatologia'],
  subtitle:'Versão original · dez unhas das mãos',population:'Adultos com psoríase ungueal e dez unhas avaliáveis',
  conditions:['Psoríase ungueal'],purposes:[P.ACTIVITY],max:80,range:'0–80',
  scope:'Dividir cada unha em quatro quadrantes. Para matriz, procurar depressões puntiformes, leuconíquia, pontos vermelhos na lúnula ou esfarelamento. Para leito, observar mancha salmão, onicólise, hiperqueratose subungueal ou hemorragia em estilhaço.',
  formula:'Somar, em cada unha, quadrantes com qualquer sinal de matriz (0–4) e de leito (0–4). Contar uma vez por domínio e quadrante; somar as dez unhas.',
  limits:'Descreve extensão ungueal em mãos. Comparar em série as mesmas unhas e avaliar diagnósticos diferenciais.',
  sources:[pm('Rich e Scher · índice original',12894066),ref('International Psoriasis Council · componentes do NAPSI','https://psoriasiscouncil.org/ipc-resources/clinical-assessments/napsi/')]
},napFields,n=>'Extensão ungueal · '+n+'/80');

const hiscr = instrument({
  id:'hiscr50',name:'HiSCR50 · resposta da hidradenite',aliases:['Hidradenitis Suppurativa Clinical Response'],specialties:['Dermatologia'],
  subtitle:'Comparação de duas avaliações',population:'Adultos com hidradenite e ≥3 abscessos + nódulos inflamatórios no basal',
  conditions:['Hidradenite supurativa'],purposes:[P.ACTIVITY],max:null,range:'resposta presente/ausente',categorical:true,
  scope:'Comparar contagens clínicas basais e de seguimento pelo mesmo método. Usar apenas nódulos inflamatórios na soma AN.',
  formula:'Resposta se AN cai ≥50% e não aumenta nenhuma das duas contagens individuais de abscessos e de fístulas drenantes.',
  limits:'Desfecho de resposta em estudo clínico. O indicador pode permanecer negativo mesmo com melhora parcial.',
  sources:[pm('Kimball et al. · definição e validação',25040429),pm('Ensaio clínico · aplicação do HiSCR50',41061970)]
},['Basal','Atual'].flatMap((p,i)=>[count('a'+i,p+' · abscessos'),count('n'+i,p+' · nódulos inflamatórios'),count('f'+i,p+' · fístulas drenantes')]),x=>{
  const before=x.a0+x.n0, after=x.a1+x.n1, ok=2*after<=before && x.a1<=x.a0 && x.f1<=x.f0;
  return assess(null,ok?'Critérios de resposta atingidos':'Critérios de resposta não atingidos','Interpretar a resposta em conjunto com dor, drenagem e função.',
    'AN de '+before+' para '+after+'; redução de '+round2(100*(before-after)/before)+'%. Abscessos de '+x.a0+' para '+x.a1+'; fístulas drenantes de '+x.f0+' para '+x.f1+'.',{displayValue:ok?'Sim':'Não'});
},x=>x.a0+x.n0<3?['a0','n0']:[]);

const ihs455=instrument({
  id:'ihs4-55-response',name:'IHS4-55 · resposta da hidradenite',aliases:['IHS4-55'],specialties:['Dermatologia'],
  subtitle:'Redução ≥55% entre avaliações',population:'Adultos com hidradenite e IHS4 basal positivo',conditions:['Hidradenite supurativa'],purposes:[P.ACTIVITY],
  max:null,range:'resposta presente/ausente',categorical:true,scope:'Usar dois escores IHS4 completos do mesmo paciente. No escore original, nódulos inflamatórios valem 1, abscessos 2 e túneis drenantes 4.',
  formula:'Redução percentual = (IHS4 basal − IHS4 atual) / IHS4 basal × 100. Resposta quando redução ≥55%, antes do arredondamento.',
  limits:'O desfecho é longitudinal e requer IHS4 basal maior que zero. O percentual pode ser negativo se houve piora.',
  sources:[pm('Tzellos et al. · validação do IHS4-55',36184889),pm('Zouboulis et al. · IHS4 original',28636793)]
},[count('base','IHS4 basal completo',1),count('now','IHS4 atual completo')],x=>{
  const pct=100*(x.base-x.now)/x.base, ok=100*(x.base-x.now)>=55*x.base;
  return assess(null,ok?'Resposta IHS4-55 atingida':'Resposta IHS4-55 não atingida','Documentar o intervalo entre as avaliações.',x.base+' → '+x.now+'; redução de '+round2(pct)+'%.',{displayValue:ok?'Sim':'Não'});
});

const lundFields=[];
for (const side of ['direito','esquerdo']){
  const sideID=side[0];
  for(const [i,site] of ['Maxilar','Etmoide anterior','Etmoide posterior','Esfenoide','Frontal'].entries())
    lundFields.push(scale(sideID+i,site+' · lado '+side,['Aerado','Opacificação parcial','Opacificação total']));
  lundFields.push(choose(sideID+'o','Complexo ostiomeatal · lado '+side,[[0,'Pérvio'],[2,'Obstruído']]));
}
const lund=additive({
  id:'lund-mackay-ct',name:'Lund–Mackay · tomografia dos seios paranasais',aliases:['LMK-CT','Lund Mackay'],
  specialties:['Otorrinolaringologia'],subtitle:'TC bilateral · 12 componentes',population:'Adultos com rinossinusite e anatomia avaliável',
  conditions:['Rinossinusite crônica'],purposes:[P.ANATOMIC_SEVERITY],max:24,range:'0–24',
  scope:'Registrar a opacificação de cinco regiões sinusais por lado e a permeabilidade dos dois complexos ostiomeatais.',
  formula:'Regiões sinusais: 0, 1 ou 2 cada. Complexo ostiomeatal: 0 ou 2 por lado. Somar ambos os lados (0–12 por lado).',
  limits:'Carga tomográfica não mede diretamente sintomas. Não pressupor normalidade de regiões hipoplásicas, ausentes ou não avaliáveis.',
  sources:[pm('Lund e Kennedy · estadiamento da rinossinusite',9334786),ref('National Jewish Health · graduação Lund–Mackay na TC','https://www.nationaljewish.org/NJH/media/ProEd/Keystone%202020/Kingdom-Chronic-Rhinosinusitis.pdf')]
},lundFields,n=>'Carga tomográfica · '+n+'/24');

const uroSources=[pm('Abrams · índices de função vesical',10444116),ref('EAU · avaliação diagnóstica em homens com sintomas do trato urinário inferior','https://uroweb.org/guidelines/management-of-non-neurogenic-male-luts/chapter/diagnostic-evaluation')];
const uroBase={specialties:['Urologia'],population:'Homens adultos com sintomas urinários baixos não neurogênicos',
  conditions:['Sintomas do trato urinário inferior'],max:null,resultScale:false,unit:'índice',sources:uroSources};
const uroFlow=[measure('pressure','Pressão detrusora no fluxo máximo, PdetQmáx (cmH₂O)'),measure('flow','Fluxo urinário máximo, Qmáx (mL/s)',0.001)];
const booi=instrument({...uroBase,id:'booi-abrams',name:'BOOI · obstrução infravesical',aliases:['Abrams-Griffiths','bladder outlet obstruction index'],
  subtitle:'Estudo pressão–fluxo',range:'índice contínuo',purposes:[P.AFTER_TESTS],
  scope:'Requer pressão detrusora medida no mesmo instante do fluxo máximo durante o estudo pressão–fluxo de uma micção válida.',
  formula:'BOOI = PdetQmáx − 2 × Qmáx. <20 sem obstrução pelo índice; 20–40 equívoco; >40 obstruído.',
  limits:'Valores negativos são possíveis. Interpretar o traçado urodinâmico completo; não utilizar pressão vesical isolada.'
},uroFlow,x=>{
  const n=x.pressure-2*x.flow;
  return assess(n,n>40?'Obstruído pelo índice':n>=20?'Equívoco':'Sem obstrução pelo índice','Considerar qualidade técnica e dados clínicos.',x.pressure+' − 2 × '+x.flow+' = '+Number(n.toPrecision(14)), showAtCutoff(n,[20,40]));
});
const bci=instrument({...uroBase,id:'bci-abrams',name:'BCI · contratilidade vesical',aliases:['Bladder Contractility Index'],
  subtitle:'Estudo pressão–fluxo',range:'índice contínuo',purposes:[P.ORGAN_FUNCTION],
  scope:'Medir pressão detrusora e fluxo máximo correspondentes à mesma micção no estudo urodinâmico.',
  formula:'BCI = PdetQmáx + 5 × Qmáx. <100 contratilidade fraca; 100–150 normal; >150 forte.',
  limits:'O índice é complementar e depende da qualidade do traçado. Suspeita de disfunção neurogênica requer avaliação própria.'
},uroFlow,x=>{
  const n=x.pressure+5*x.flow;
  return assess(n,n<100?'Contratilidade fraca':n<=150?'Contratilidade normal':'Contratilidade forte','Interpretar junto com os outros parâmetros do estudo.',x.pressure+' + 5 × '+x.flow+' = '+Number(n.toPrecision(14)), showAtCutoff(n,[100,150]));
});
const bve=instrument({...uroBase,id:'bve-abrams',name:'BVE · eficiência do esvaziamento vesical',aliases:['Bladder Voiding Efficiency'],
  subtitle:'Volume urinado e resíduo pós-miccional',max:100,range:'0–100%',unit:'%',purposes:[P.ORGAN_FUNCTION],
  scope:'Usar o volume urinado e a medida do resíduo pós-miccional referentes ao mesmo episódio. Os dois volumes precisam estar na mesma unidade.',
  formula:'BVE = 100 × volume urinado / (volume urinado + resíduo pós-miccional).',
  limits:'Ausência de volume vesical mensurável impede o cálculo. Não determina isoladamente obstrução ou necessidade de procedimento.'
},[measure('voided','Volume urinado (mL)'),measure('pvr','Resíduo pós-miccional (mL)')],x=>{
  const n=round2(100*x.voided/(x.voided+x.pvr));
  return assess(n,'Percentual do volume vesical eliminado','Comparar com a avaliação urológica e a representatividade da micção.',x.voided+' / ('+x.voided+' + '+x.pvr+') × 100 = '+n+'%');
},x=>x.voided+x.pvr===0?['voided','pvr']:[]);
const rmi=instrument({
  id:'rmi-i-ovario',name:'RMI I · massa anexial',aliases:['Índice de risco de malignidade I','Jacobs'],specialties:['Ginecologia','Oncologia'],
  subtitle:'Índice pré-operatório · CA125 e ultrassom',population:'Mulheres adultas em investigação de massa anexial',conditions:['Massa anexial'],purposes:[P.AFTER_TESTS],
  max:null,resultScale:false,unit:'índice',range:'índice contínuo',scope:'Nos achados ecográficos contar multilocularidade, áreas sólidas, metástases, ascite e bilateralidade (um por achado). Pelo NICE, pós-menopausa corresponde a mais de um ano sem menstruação, ou histerectomia com idade superior a 50 anos.',
  formula:'RMI I = U × M × CA125. U = 0 para zero achados, 1 para um e 3 para dois a cinco. M = 1 na pré-menopausa, 3 na pós-menopausa.',
  limits:'O limiar de encaminhamento NICE é ≥250. Resultado baixo ou zero não descarta malignidade; protocolos podem usar outros cortes.',
  sources:[pm('Jacobs et al. · índice original',2223684),ref('NICE · RMI I, cálculo e contexto de referência','https://www.nice.org.uk/guidance/dg31/documents/final-scope')]
},[numeric('us','Número de achados ultrassonográficos presentes entre os cinco listados',0,5,1,'Multilocularidade, área sólida, metástase, ascite e bilateralidade. Contar 1 por característica.'),choose('m','Estado menopausal',[[1,'Pré-menopausa'],[3,'Pós-menopausa']]),measure('ca','CA125 sérico (UI/mL)')],x=>{
  const u=x.us<2?x.us:3,t=u*x.m*x.ca;
  return assess(t,t>=250?'Atinge o limiar NICE (≥250)':'Abaixo do limiar NICE de 250','Integrar com achados de imagem e avaliação ginecológica.',u+' × '+x.m+' × '+x.ca+' = '+Number(t.toPrecision(14)), showAtCutoff(t,[250]));
});
const afi=instrument({
  id:'afi-phelan',name:'ILA · índice de líquido amniótico',aliases:['AFI','Phelan'],specialties:['Obstetrícia'],
  subtitle:'Ultrassonografia · quatro quadrantes',population:'Gestação única a partir de 18 semanas',conditions:['Volume de líquido amniótico'],purposes:[P.OBSTETRIC],
  max:null,range:'cm',resultScale:false,unit:'cm',scope:'Medir o maior bolsão vertical em cada quadrante uterino, livre de cordão e partes fetais. Registrar as quatro medidas em centímetros.',
  formula:'ILA (cm) = soma dos quatro bolsões verticais (cm).',
  limits:'Medida semiquantitativa. A ISUOG distingue o ILA do maior bolsão vertical isolado, que pode ser preferível na avaliação de oligodrâmnio.',
  sources:[pm('Phelan et al. · técnica dos quatro quadrantes',3305930),ref('ISUOG · diretriz técnica, segundo trimestre','https://doi.org/10.1002/uog.24888')]
},['Superior direito','Superior esquerdo','Inferior direito','Inferior esquerdo'].map((l,i)=>measure('q'+i,l+' · bolsão (cm)')),x=>assess(round2(sum(x)),'Índice de líquido amniótico','Interpretar segundo idade gestacional, técnica e achados obstétricos.',Object.values(x).join(' + ')+' = '+round2(sum(x))+' cm'));

const iota=instrument({
  id:'iota-simple-rules',name:'IOTA Simple Rules · massa anexial',aliases:['Regras simples IOTA'],specialties:['Ginecologia','Oncologia'],
  subtitle:'Regra categórica ultrassonográfica',population:'Mulheres adultas com massa anexial investigada por especialista',
  conditions:['Massa anexial'],purposes:[P.AFTER_TESTS],max:null,categorical:true,range:'benigna / maligna / inconclusiva',
  scope:'Aplicar a uma lesão de cada vez, com descrição morfológica e Doppler segundo a terminologia IOTA. A validação original foi pré-operatória.',
  formula:'≥1 critério B isolado: padrão benigno; ≥1 M isolado: padrão maligno. Ambos os grupos ou nenhum deles: inconclusivo.',
  limits:'Os padrões caracterizam a imagem. Achado inconclusivo requer avaliação especializada; confirmação de malignidade depende da investigação apropriada.',
  sources:[pm('Timmerman et al. · validação prospectiva pelo grupo IOTA',21156740),ref('Validação externa · definições ultrassonográficas','https://doi.org/10.1002/uog.15854')]
},[yn('b1','Cisto unilocular'),yn('b2','Componente sólido presente, com maior componente <7 mm'),yn('b3','Sombra acústica'),yn('b4','Lesão multilocular lisa com maior diâmetro <100 mm'),yn('b5','Fluxo intralesional ausente ao Doppler (cor 1)'),
  yn('m1','Lesão sólida irregular'),yn('m2','Ascite'),yn('m3','Quatro ou mais projeções papilares'),yn('m4','Lesão multilocular-sólida irregular com maior diâmetro ≥100 mm'),yn('m5','Fluxo intralesional muito intenso (cor 4)')],x=>{
  const b=x.b1+x.b2+x.b3+x.b4+x.b5,m=x.m1+x.m2+x.m3+x.m4+x.m5;
  const category=b && !m?'Benigno':m && !b?'Maligno':'Inconclusivo';
  return assess(null,'Padrão ultrassonográfico','Correlacionar com avaliação ginecológica. Para padrão inconclusivo, considerar ultrassonografia especializada.',
    b+' critérios B e '+m+' critérios M.',{displayValue:category});
},x=>x.b5 && x.m5 ? ['b5','m5'] : []);

const bpp=instrument({
  id:'bpp-sogc441',name:'Perfil biofísico fetal · completo',aliases:['PBF','BPP','Manning'],specialties:['Obstetrícia'],
  subtitle:'Cinco domínios · critérios SOGC 441',population:'Gestantes em vigilância fetal anteparto com US e cardiotocografia',
  conditions:['Vigilância da vitalidade fetal'],purposes:[P.OBSTETRIC],max:10,range:'0–10',
  scope:'Avaliar quatro achados ultrassonográficos e uma cardiotocografia anteparto. Usar laudos interpretados por profissional habilitado, conforme idade gestacional. Observar por 30 min antes de atribuir zero aos componentes dinâmicos do ultrassom.',
  formula:'Cada critério presente vale 2, cada critério avaliado e ausente vale 0. Esta ficha requer os cinco componentes completos.',
  limits:'Líquido reduzido exige avaliação obstétrica própria mesmo com soma de 8. Integrar com idade gestacional, rotura de membranas e contexto materno-fetal.',
  sources:[ref('SOGC · diretriz 441, quadro de componentes','https://www.sogc.org/common/Uploaded%20files/ACSC/ACSC2024/gui441CPG2309E.pdf'),ref('AAP/ACOG · Guidelines for Perinatal Care, avaliação fetal','https://hscsnhealthplan.org/sites/default/files/OB%20-%20ACOG%20Guidelines%20for%20Perinatal%20Care%20-%208th%20Edition.pdf')]
},[yn('breath','Ao menos um episódio de movimento respiratório fetal >30 s (SOGC)'),yn('move','Três ou mais movimentos distintos de tronco ou membros'),
  yn('tone','Extensão com retorno à flexão de tronco/membro ou abertura e fechamento da mão'),yn('fluid','Maior bolsão ≥2 cm × 1 cm livre de cordão e partes fetais'),
  yn('nst','Cardiotocografia anteparto normal pelo critério da diretriz para a idade gestacional')],x=>{
  const t=2*sum(x), label=t<=4?'Perfil anormal':t===6?'Perfil equívoco':x.fluid?'Perfil tranquilizador':'Líquido reduzido apesar da soma';
  return assess(t,label,'Revisar os componentes com a obstetrícia e definir seguimento conforme o quadro e a idade gestacional.',Object.values(x).map(v=>2*v).join(' + ')+' = '+t,{alerts:x.fluid?[]:['Critério de líquido amniótico não preenchido. Avaliar independentemente do total.']});
});

export const multidisciplinaryScores=[povoc,colds,koivuranta,myer,mirels,phq4,phqAds,phq8,who5,k6,audit,sarcCalf,sppb,tug,chair30,napsi,hiscr,ihs455,lund,booi,bci,bve,rmi,afi,iota,bpp];
