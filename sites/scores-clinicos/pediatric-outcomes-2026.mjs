import { make, n, ref, s } from './expanded-scores.mjs';

const functional = 'Avaliação funcional';
const symptoms = 'Carga de sinais e sintomas';
const screening = 'Triagem';
const qol = 'Qualidade de vida relacionada à saúde';
const standard = {
  specialty: 'Pediatria', populationGroups: ['pediatria'], reviewDate: '13/11/2026',
  resultScale: false,
};
const scoringService = 'https://healthmeasures.net/implement/scoring/healthmeasures-scoring-service/';
const recommended = 'https://healthmeasures.net/select-measures/recommended-measures/short-forms/';
const domainList = 'https://healthmeasures.net/promis-basics/promis-domains/pediatric-domains/';
const manuals = {
  "84": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Anger_Irritability-Scoring-Manual_08Sept2023.pdf",
  "85": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Anxiety-Scoring-Manual_08Sept2023.pdf",
  "86": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Asthma-Impact-Scoring-Manual.pdf",
  "87": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Cognitive-Function-Scoring-Manual_03June2022.pdf",
  "89": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Depression-Scoring-Manual_05Dec2023.pdf",
  "93": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Fatigue-User-Manual-and-Scoring-Instructions_21Nov2025.pdf",
  "102": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Itch-Scoring-Manual_01May2024.pdf",
  "103": "https://www.healthmeasures.net/images/PROMIS/manuals/Scoring_Manuals_/PROMIS_Life_Satisfaction_Scoring_Manual.pdf",
  "105": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Meaning-and-Purpose-Scoring-Manual.pdf",
  "107": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Pain-Behavior-Scoring-Manual_08Sept2023.pdf",
  "109": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Pain-Interference-Scoring-Manual_05Dec2023.pdf",
  "110": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Pain-Quality-Scoring-Manual_08Sept2023.pdf",
  "111": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Physical-Activity-Scoring-Manual_06.01.2023.pdf",
  "112": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Physical-Function-User-Manual-and-Scoring-Instructions_24Nov2025.pdf",
  "113": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Pediatric-and-Parent-Proxy-Physical-Stress-Experiences-Scoring-Manual.pdf",
  "114": "https://healthmeasures.net/implement/scoring/manual-scoring-resources/promis-scoring-manuals/",
  "120": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Psychological-Stress-Experiences-Scoring-Manual.pdf",
  "127": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Sleep-Scoring-Manual_05Dec2023.pdf",
  "135": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Social-Relationships-Scoring-Manual_08Sept2023.pdf",
  "137": "https://www.healthmeasures.net/images/PROMIS/manuals/Scoring_Manual_Only/PROMIS_Stigma_Scoring_Manual_01May2024.pdf",
  "138": "https://healthmeasures.net/wp-content/uploads/2026/05/PROMIS-Strength-Impact-Scoring-Manual.pdf"
};

const promisDomains = [
  // ID, official English name, label, version and form, manual, condition, specialty, purpose, interpretation.
  ['anger', 'Anger', 'Raiva e irritabilidade', 'GenPop v3.0 · 5a', 84, 'Irritabilidade', 'Psiquiatria', symptoms, 'Frequência e intensidade percebidas da raiva.'],
  ['anxiety', 'Anxiety', 'Ansiedade', 'GenPop v3.0 · 8a', 85, 'Ansiedade', 'Psiquiatria', symptoms, 'Medo, preocupação e tensão percebidos pela criança.'],
  ['cognitive', 'Cognitive Function', 'Função cognitiva percebida', 'v1.0 · 7a', 87, 'Queixa cognitiva', 'Neurologia', functional, 'Dificuldades percebidas em atenção, memória e raciocínio no cotidiano.'],
  ['depression', 'Depressive Symptoms', 'Sintomas depressivos', 'GenPop v3.0 · 8a', 89, 'Sintomas depressivos', 'Psiquiatria', symptoms, 'Humor e perda de interesse. Suspeita de autoagressão exige investigação direta.'],
  ['life-satisfaction', 'Life Satisfaction', 'Satisfação com a vida', 'v1.0 · 8a', 103, qol, 'Pediatria', functional, 'Apreciação global da própria vida.'],
  ['meaning', 'Meaning and Purpose', 'Sentido e propósito', 'v1.0 · 8a', 105, qol, 'Pediatria', functional, 'Percepção de significado e direção na vida.'],
  ['positive-affect', 'Positive Affect', 'Afeto positivo', 'v1.0 · 8a', 114, 'Bem-estar emocional', 'Psiquiatria', functional, 'Experiências emocionais positivas relatadas pela criança.'],
  ['psych-stress', 'Psychological Stress Experiences', 'Estresse psicológico', 'v1.0 · 8a', 120, 'Estresse psicológico', 'Psiquiatria', symptoms, 'Percepção de sobrecarga e dificuldade para lidar com demandas.'],
  ['stigma', 'Stigma', 'Estigma percebido', 'v1.1 · 8a', 137, 'Estigma associado a doença', 'Pediatria', symptoms, 'Vivências de desvalorização relacionadas à condição de saúde.'],
  ['asthma', 'Asthma Impact', 'Impacto da asma', 'v2.0 · 8a', 86, 'Asma', 'Pneumologia', symptoms, 'Sintomas e limitação diária atribuídos à asma. A escala não classifica a gravidade de uma exacerbação.'],
  ['fatigue', 'Fatigue', 'Fadiga', 'GenPop v3.0 · 10a', 93, 'Fadiga', 'Pediatria', symptoms, 'Cansaço e impacto percebido nas atividades habituais.'],
  ['itch', 'Itch (PIQ-C)', 'Prurido', 'v1.0 · 8a', 102, 'Prurido', 'Dermatologia', symptoms, 'Incômodo associado à coceira em crianças com condições cutâneas.'],
  ['mobility', 'Mobility', 'Mobilidade', 'GenPop v3.0 · 7a', 112, 'Limitação da mobilidade', 'Ortopedia', functional, 'Capacidade percebida para levantar-se, caminhar e se deslocar.'],
  ['pain-behavior', 'Pain Behavior', 'Comportamento relacionado à dor', 'GenPop v3.0 · 8a', 107, 'Dor', 'Pediatria', 'Avaliação da dor', 'Expressões e comportamentos que a criança associa à própria dor.'],
  ['pain-interference', 'Pain Interference', 'Interferência da dor', 'GenPop v3.0 · 8a', 109, 'Dor', 'Pediatria', 'Avaliação da dor', 'Quanto a dor interfere na vida escolar, nas atividades e nas relações.'],
  ['pain-affective', 'Pain Quality – Affective', 'Qualidade afetiva da dor', 'GenPop v3.0 · 8a', 110, 'Dor', 'Pediatria', 'Avaliação da dor', 'Experiência emocional atribuída à dor.'],
  ['pain-sensory', 'Pain Quality – Sensory', 'Qualidade sensorial da dor', 'GenPop v3.0 · 8a', 110, 'Dor', 'Pediatria', 'Avaliação da dor', 'Descrição das sensações associadas à dor.'],
  ['activity', 'Physical Activity', 'Atividade física', 'v1.0 · 8a', 111, 'Atividade física', 'Pediatria', functional, 'Atividade corporal relatada no dia a dia.'],
  ['physical-stress', 'Physical Stress Experiences', 'Manifestações físicas de estresse', 'v1.0 · 8a', 113, 'Estresse e sintomas físicos', 'Pediatria', symptoms, 'Sensações corporais relacionadas a situações de estresse.'],
  ['strength', 'Strength Impact', 'Impacto da força física', 'v1.0 · 8a', 138, 'Limitação funcional', 'Neurologia', functional, 'Percepção da capacidade para executar tarefas que exigem força.'],
  ['upper-extremity', 'Upper Extremity', 'Função de membros superiores', 'GenPop v3.0 · 8a', 112, 'Limitação funcional dos membros superiores', 'Ortopedia', functional, 'Uso dos braços e das mãos em tarefas diárias.'],
  ['family', 'Family Relationships', 'Relações familiares', 'v1.0 · 8a', 135, 'Relações familiares', 'Pediatria', functional, 'Percepção de apoio e pertencimento no ambiente familiar.'],
  ['peers', 'Peer Relationships', 'Relações com pares', 'GenPop v3.0 · 8a', 135, 'Participação social', 'Pediatria', functional, 'Qualidade percebida da interação com amigos e colegas.'],
  ['sleep', 'Sleep Disturbance', 'Perturbação do sono', 'v1.0 · 8a', 127, 'Distúrbios do sono', 'Neurologia', symptoms, 'Problemas percebidos para iniciar ou manter um sono satisfatório.'],
  ['sleep-daytime', 'Sleep-Related Impairment', 'Repercussão diurna do sono', 'v1.0 · 8a', 127, 'Sonolência e dificuldade funcional diurna', 'Neurologia', functional, 'Impacto do sono insuficiente na disposição e no funcionamento durante o dia.'],
];

function externalRecord(spec) {
  const reason = spec.externalCalculationReason;
  return make({
    ...standard, fields: [], max: null, range: 'Consulta ao instrumento oficial',
    calculationSuspended: true, calculationSuspensionReason: reason,
    formula: reason, ...spec,
  });
}

const promisScores = promisDomains.map(([id, english, title, version, manual, condition, specialty, purpose, use]) => {
  const fullName = 'PROMIS Pediatric ' + english + ' ' + version;
  const reason = 'Selecione ' + fullName + ' nas referências e use a chave pediátrica ou o serviço HealthMeasures para obter o escore T. O resultado depende da calibração do domínio, do formulário e do respondente.';
  return externalRecord({
    id: 'promis-ped-' + id, name: 'PROMIS Pediátrico · ' + title,
    subtitle: 'Autorrelato · ' + version + ' · pontuação oficial externa',
    population: '8–17 anos · autorrelato', conditions: [condition], purposes: [purpose],
    scope: use + ' Aplicar o formulário de autorrelato para 8–17 anos, na versão indicada. Identificar idioma e respondente no acompanhamento.',
    limits: 'A forma preenchida por responsável tem calibração própria. Um resultado isolado não estabelece diagnóstico ou conduta.',
    specialties: [...new Set(['Pediatria', specialty])], aliases: [english, 'PROMIS', 'desfechos relatados pelo paciente', condition],
    sources: [
      ref('HealthMeasures · manual de pontuação · ' + english, manuals[manual]),
      ref('HealthMeasures · seleção da forma ' + version, manual === 127 ? manuals[127] : recommended),
      ref('HealthMeasures · domínios pediátricos e idades', domainList),
      ref('HealthMeasures · calculadora oficial por padrão de respostas', scoringService),
    ].filter((v,i,list)=>list.findIndex(x=>x.url===v.url)===i),
    externalCalculator: scoringService, externalCalculationReason: reason,
  });
});

const pedsqlManual = 'https://pedsql.org/PedsQL-Scoring.pdf';
const pedsqlAccess = 'https://www.pedsql.org/conditions.html';
const authorScoring = 'https://www.pedsql.org/score.html';

const pedsqlProfiles = [
  // Official scoring manual v21.3 for completed pediatric self-report age 8–18, unless specified.
  ['core','Qualidade de vida geral','4.0','Pediatria',qol,8,[['Função física',8],['Função emocional',5],['Função social',5],['Função escolar',5]]],
  ['arthritis','Artrite','3.0','Reumatologia','Artrite idiopática juvenil',22,[['Dor',4],['Atividades diárias',5],['Tratamento',7],['Preocupações',3],['Comunicação',3]]],
  ['asthma','Asma','3.0','Pneumologia','Asma',26,[['Asma',11],['Tratamento',11],['Preocupações',3],['Comunicação',3]]],
  ['brain-tumor','Tumor cerebral','1.0','Oncologia','Tumor cerebral',36,[['Cognição',7],['Dor',3],['Movimento e equilíbrio',3],['Ansiedade com procedimentos',3],['Náusea',5],['Preocupações',3]]],
  ['cancer','Câncer','3.0','Oncologia','Câncer na infância',42,[['Dor',2],['Náusea',5],['Ansiedade com procedimentos',3],['Ansiedade com tratamento',3],['Preocupações',3],['Cognição',5],['Aparência física',3],['Comunicação',3]]],
  ['cardiac','Cardiopatia','3.0','Cardiologia','Cardiopatia pediátrica',49,[['Problemas cardíacos e tratamento',7],['Tratamento II',5],['Aparência física',3],['Ansiedade com tratamento',4],['Cognição',5],['Comunicação',3]]],
  ['cp','Paralisia cerebral','3.0','Neurologia','Paralisia cerebral',53,[['Atividades diárias',9],['Atividades escolares',4],['Movimento e equilíbrio',5],['Dor',4],['Fadiga',4],['Alimentação',5],['Fala e comunicação',4]]],
  ['cognition','Função cognitiva','3.0','Neurologia','Queixa cognitiva',57,[['Função cognitiva',6]]],
  ['diabetes','Diabetes','3.2','Endocrinologia','Diabetes mellitus',67,[['Sintomas do diabetes',15],['Tratamento I',5],['Tratamento II',6],['Preocupações',3],['Comunicação',4]]],
  ['duchenne','Distrofia de Duchenne','3.0','Neurologia','Distrofia muscular de Duchenne',72,[['Atividades diárias',5],['Tratamento',4],['Preocupações',6],['Comunicação',3]]],
  ['renal','Doença renal em estágio terminal','3.0','Nefrologia','Doença renal crônica avançada',76,[['Fadiga geral',4],['Doença renal',5],['Problemas do tratamento',4],['Família e pares',3],['Preocupações',10],['Aparência física',3],['Comunicação',5]]],
  ['eoe','Esofagite eosinofílica','3.0','Gastroenterologia','Esofagite eosinofílica',83,[['Sintomas I',6],['Sintomas II',4],['Tratamento',5],['Preocupações',6],['Comunicação',5],['Alimentação',4],['Sentimentos sobre alimentos',3]]],
  ['epilepsy','Epilepsia','3.0','Neurologia','Epilepsia',97,[['Impacto',9],['Cognição',6],['Sono e repouso',3],['Funções executivas',6],['Humor e comportamento',5]]],
  ['fatigue','Fadiga multidimensional','3.0','Pediatria','Fadiga',134,[['Fadiga geral',6],['Fadiga associada ao sono e repouso',6],['Fadiga cognitiva',6]]],
  ['neuromuscular','Doença neuromuscular','3.0','Neurologia','Doença neuromuscular',143,[['Doença neuromuscular',17],['Comunicação',3],['Recursos familiares',5]]],
  ['oral','Saúde bucal','3.0','Pediatria','Saúde bucal',147,[['Saúde bucal',5]]],
  ['sickle','Doença falciforme','3.0','Hematologia','Doença falciforme',170,[['Dor',9],['Impacto da dor',10],['Manejo da dor',2],['Preocupações I',5],['Preocupações II',2],['Emoções',2],['Tratamento',7],['Comunicação I',3],['Comunicação II',3]]],
  ['spinal','Lesão medular','3.0','Neurologia','Lesão medular',175,[['Atividades diárias',6],['Mobilidade',6],['Função vesical',6],['Função intestinal',5],['Interferência da dor',3],['Participação social',4],['Preocupação com vida social',3],['Preocupação vesical e intestinal',3],['Lesão por pressão',2]]],
  ['stem-cell','Transplante de células-tronco hematopoéticas','1.0','Hematologia','Transplante de células-tronco hematopoéticas',182,[['Dor',2],['Sono e fadiga',5],['Náusea',4],['Preocupações',10],['Nutrição',5],['Cognição',4],['Comunicação',3],['Outras queixas',6]],'8–12 anos'],
  ['transplant','Transplante de órgão','3.0','Pediatria','Transplante de órgão sólido',189,[['Medicamentos I',9],['Medicamentos II',8],['Transplante e outras pessoas',8],['Dor',3],['Preocupações',7],['Ansiedade com tratamento',4],['Aparência física',3],['Comunicação',4]]],
];

// Accept only integer scalar data from ordinary own properties, including form strings.
function integerField(values, field) {
  if (values === null || typeof values !== 'object' || Array.isArray(values)) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(values, field.id);
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) return undefined;
  const value = descriptor.value;
  if (typeof value !== 'number' && !(typeof value === 'string' && /^\d+$/.test(value))) return undefined;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) return undefined;
  if (field.type === 'select') return field.options.some(o => o.value === parsed) ? parsed : undefined;
  return parsed >= field.min && parsed <= field.max ? parsed : undefined;
}

function arithmetic(spec, crossCheck = () => []) {
  const parse = raw => {
    const values = {}, errors = [];
    for (const field of spec.fields) {
      try { values[field.id] = integerField(raw,field); } catch { values[field.id] = undefined; }
      if (values[field.id] === undefined) errors.push(field.id);
    }
    return {values, errors: errors.length ? errors : crossCheck(values)};
  };
  return make({...standard, ...spec,
    safeValidate: raw => parse(raw).errors,
    safeCalculate: raw => {
      const {values,errors} = parse(raw);
      if (errors.length) return {complete:false, total:null, errors};
      return {complete:true, errors:[], alerts:[], ...spec.compute(values)};
    }
  });
}

const profilesWithTotal = new Set(['core','cancer','diabetes','renal','fatigue','neuromuscular','sickle','stem-cell','transplant']);
function pedsqlDomain([id, title, version, specialty, condition, page, domains, ages='8–18 anos']) {
  const domainCount = domains.length;
  const options = [...domains];
  if (id === 'core') options.push(['Síntese psicossocial · 3 domínios',15]);
  if (id === 'diabetes') options.push(['Síntese do manejo · 4 domínios',18]);
  if (profilesWithTotal.has(id)) options.push(['Total do módulo',domains.reduce((sum,[,count])=>sum+count,0)]);
  const hasSummaries = options.length > domainCount;
  const maxItems = Math.max(...options.map(([,count]) => count));
  return arithmetic({
    id:'pedsql-ped-'+id, name:'PedsQL · '+title,
    subtitle:'v'+version+(hasSummaries?' · domínios e escore de síntese':' · pontuação por domínio do formulário oficial'),
    conditions:[condition], purposes:[functional], specialties:[...new Set(['Pediatria',specialty])],
    population:ages+' · autorrelato', max:100, range:'0–100', unit:'pontos', precision:2,
    aliases:['Pediatric Quality of Life Inventory','PedsQL',qol,title,condition],
    scope:'Use o autorrelato PedsQL '+version+' de '+ages+' no módulo indicado. Escolha o domínio e some os códigos originais (0 a 4) das respostas válidas desse domínio, antes da inversão. Informe quantas foram respondidas.'+(hasSummaries?' Para a síntese, transcreva todos os itens que a compõem.':'')+(id==='core'?' A síntese psicossocial inclui apenas os itens emocionais, sociais e escolares.':'')+(id==='diabetes'?' A síntese do manejo inclui tratamento I e II, preocupações e comunicação.':''),
    limits:'O resultado representa a escala selecionada. Use a mesma versão, respondente e janela temporal nas comparações. Não misture itens entre domínios ou entre módulos. A folha original e sua tradução são obtidas pelo distribuidor.'+(id==='spinal'?' Calcule somente domínios cuja contagem de itens coincida com a folha aplicada. O manual descreve 42 itens, mas a tabela lista 38 ao somar os nove domínios, impedindo a conferência do total global.':''),
    sources:[ref('Varni / Mapi · estrutura e pontuação do módulo · p. '+page,pedsqlManual+'#page='+page),ref('PedsQL · regras para obtenção do instrumento oficial',pedsqlAccess),ref('PedsQL · método de transformação de itens',authorScoring)],
    formula:'Média dos itens invertidos = 100 − 25 × soma dos códigos originais / número respondido. É necessário responder a pelo menos metade dos itens do domínio.'+(hasSummaries?' Esta ficha calcula sínteses apenas quando todos os itens que compõem a síntese foram respondidos.':''),
    fields:[{...s('domain','Escala no formulário',options.map(([label,count],i)=>[i,label+' ('+count+' itens)'])),noPoints:true},
      n('answered','Itens respondidos no domínio',1,maxItems,1,'Informe a contagem das respostas válidas; deixe de fora os itens em branco.'),
      n('sum','Soma dos códigos originais, antes da inversão',0,4*maxItems,1,'Some somente as respostas do domínio escolhido, sem usar os valores já convertidos em 0–100.')],
    compute: ({domain,answered,sum}) => {
      const [label,count] = options[domain];
      const total = 100-25*sum/answered;
      return {total,level:'neutral',label:label,
        action:'Valores mais altos correspondem a melhor qualidade de vida ou menor impacto nesse domínio. Compare com a avaliação anterior do mesmo domínio e respondente.',
        breakdown:[{label:'Itens respondidos de '+count,points:answered},{label:'Soma bruta antes da inversão',points:sum}],
        audit:'100 − (25 × '+sum+' / '+answered+') = '+total.toFixed(2).replace('.',',')};
    },
  }, ({domain,answered,sum}) => {
    const count = options[domain][1];
    const errors = [];
    if (answered > count || 2*answered < count || (domain >= domainCount && answered !== count)) errors.push('answered');
    if (sum > 4*answered) errors.push('sum');
    return errors;
  });
}

const vancouverStudy='https://www.intbrazjurol.com.br/pdf/vol49n01/IBJU20220495.pdf';
const vancouver = arithmetic({
  id:'vancouver-bbd-br',name:'Vancouver · disfunção vesical e intestinal',subtitle:'VSS-BR · sintomas urinários e intestinais',
  population:'5–16 anos · versão brasileira', conditions:['Disfunção vesical e intestinal'],purposes:[screening,symptoms],
  specialties:['Pediatria','Urologia','Nefrologia'], aliases:['Vancouver Symptom Score','VSSDES','incontinência urinária','BBD','enurese'],
  max:52,range:'0–52',fields:[n('others','Soma dos itens 1–2 e 4–13',0,48,1,'Some os 12 itens do formulário em português, de 0 a 4 cada. Exclua o item 3 e a pergunta 14.'),
    {...s('urinations','Micções por dia · item 3',[[1,'1–2'],[2,'3–4'],[3,'5–6'],[4,'7–8'],[5,'Mais de 8']]),noPoints:true}],
  scope:'Aplicar a figura 3 da versão brasileira em crianças de 5–16 anos com sintomas vesicais/intestinais. Transcrever os 12 itens e a resposta de frequência miccional do mesmo formulário completo.',
  formula:'Somar itens 1–2 e 4–13 (0–48) com o item 3, que vale 4, 2, 0, 2 ou 4 pontos por faixa crescente de frequência. A pergunta 14 avalia compreensão e não entra no escore.',
  limits:'O corte (>11) é o do estudo brasileiro em amostra de casos e controles. Exige avaliação clínica e do hábito miccional e intestinal. Não identifica a etiologia da disfunção.',
  sources:[ref('Pinto et al. · adaptação e validação em Belo Horizonte · formulário, figura 3',vancouverStudy),ref('PubMed · coorte, faixa etária e ponto de corte','https://pubmed.ncbi.nlm.nih.gov/36512459/')],
  compute:({others,urinations})=>{
    const frequency=[4,2,0,2,4][urinations-1], total=others+frequency;
    return {total,level:total>11?'medium':'neutral',label:total>11?'Acima do corte brasileiro (>11)':'Até 11 pontos',
      action:'Integre sintomas, diário miccional e exame. O valor indica a carga de sintomas no formulário.',
      breakdown:[{label:'Itens 1–2 e 4–13',points:others},{label:'Frequência miccional',points:frequency}],audit:others+' + '+frequency+' = '+total};
  },
});

const dvss = arithmetic({
  id:'dvss-child-br',name:'DVSS · sintomas de disfunção miccional',subtitle:'Disfunção miccional · versão brasileira',
  population:'Crianças · 5–16 anos no estudo comparador brasileiro', conditions:['Disfunção vesical e intestinal'],purposes:[screening,symptoms],
  specialties:['Pediatria','Urologia','Nefrologia'], aliases:['Dysfunctional Voiding Symptom Score','DVSS-BR','incontinência urinária'],
  max:30,range:'0–30',fields:[n('symptoms','Soma dos nove itens de sintomas',0,27,1,'Use todos os itens 1–9 da versão brasileira, cada um de 0 a 3.'),s('stress','Item 10 · evento estressante nos últimos 30 dias',[[0,'Ausente'],[3,'Presente']]),{...s('sex','Sexo utilizado nos pontos de corte do estudo',[[0,'Feminino'],[1,'Masculino']]),noPoints:true}],
  scope:'Usar o questionário brasileiro dos últimos 30 dias. A tabela suplementar do estudo de Pinto et al. apresenta as dez perguntas. Para o corte, esta ficha segue o estudo brasileiro em participantes de 5–16 anos.',
  formula:'DVSS = soma dos nove itens (0–3 cada) + 3 se houve evento no item 10. No estudo comparador, >6 para meninas e >9 para meninos.',
  limits:'Resultado de triagem. O item 10 vale no máximo 3, independentemente do número de estressores. Resposta desconhecida não recebe zero.',
  sources:[ref('Calado et al. · versão brasileira, adaptação transcultural','https://pubmed.ncbi.nlm.nih.gov/20815952/'),ref('Pinto et al. · DVSS, suplemento 1 e corte',vancouverStudy),ref('Rizzini et al. · pré-teste e adaptação semântica brasileira','https://cadernos.ensp.fiocruz.br/ojs/index.php/csp/article/view/4046')],
  compute:({symptoms,stress,sex})=>{
    const total=symptoms+stress, cutoff=sex===0?6:9;
    return {total,label:total>cutoff?'Acima do corte do estudo':'Até o corte do estudo',level:total>cutoff?'medium':'neutral',
      action:'Avalie continência, constipação e diário miccional em conjunto com o escore.',
      breakdown:[{label:'Itens 1–9',points:symptoms},{label:'Item 10',points:stress}],audit:symptoms+' + '+stress+' = '+total+'; corte >'+cutoff};
  },
});

const pinqFields=[0,1,2,3,4].map(i=>n('n'+i,'Número de itens com '+i+(i===1?' ponto':' pontos'),0,20));
const pinq=arithmetic({
  id:'pinq-child-br',name:'PinQ-BR · incontinência pediátrica',subtitle:'Qualidade de vida · 20 itens',
  population:'6–18 anos · crianças alfabetizadas com disfunção do trato urinário inferior no estudo brasileiro',
  conditions:['Incontinência urinária'],purposes:[functional],specialties:['Pediatria','Urologia','Nefrologia'],
  aliases:['Pediatric Incontinence Questionnaire','qualidade de vida','disfunção do trato urinário inferior'],
  max:80,range:'0–80',fields:pinqFields,scope:'Use o autorrelato brasileiro completo de 20 itens. Conte quantos itens receberam cada valor marcado na chave do formulário. As cinco contagens devem somar 20.',
  formula:'Total = n₁ + 2n₂ + 3n₃ + 4n₄. A soma de n₀ a n₄ deve ser 20.',
  limits:'Total maior expressa maior impacto da disfunção sobre a qualidade de vida. A validação brasileira citada teve amostra pequena. O estudo não estabelece limiar diagnóstico.',
  sources:[ref('Quintino et al. · versão brasileira e interpretação, 2025','https://pmc.ncbi.nlm.nih.gov/articles/PMC12704936/'),ref('Adaptação brasileira · instrumento, tabelas','https://pmc.ncbi.nlm.nih.gov/articles/PMC10373139/'),ref('Bower et al. · validação original','https://pubmed.ncbi.nlm.nih.gov/18947606/')],
  compute:values=>{
    const components=pinqFields.map((f,i)=>({label:f.label,points:values[f.id]*i}));
    return {total:components.reduce((sum,c)=>sum+c.points,0),label:'Impacto percebido na qualidade de vida',level:'neutral',
      action:'Quanto maior o total, maior o impacto. Compare com a avaliação anterior do mesmo respondente.',
      breakdown:components, audit:pinqFields.map((f,i)=>values[f.id]+'×'+i).join(' + ')};
  },
},values=>pinqFields.reduce((sum,f)=>sum+values[f.id],0)===20?[]:pinqFields.map(f=>f.id));

const psc = arithmetic({
  id:'psc17-parent',name:'PSC-17',subtitle:'Triagem psicossocial pelo responsável · três domínios',
  population:'4–15 anos · amostra de replicação ambulatorial',conditions:['Dificuldades emocionais e comportamentais'],purposes:[screening],
  specialties:['Pediatria','Psiquiatria'],aliases:['Pediatric Symptom Checklist','comportamento','atenção','internalização','externalização'],
  fields:[n('internal','Soma da coluna I · sintomas internalizantes',0,10),n('attention','Soma da coluna A · atenção',0,10),n('external','Soma da coluna E · sintomas externalizantes',0,14)],
  max:34,range:'0–34',scope:'Formulário de 17 itens preenchido pelo responsável. Transcreva os subtotais das colunas I, A e E do formulário completo, sem transferir chaves de outras apresentações do PSC.',
  formula:'Total = I + A + E. Cortes do instrumento: total ≥15, I ≥5, A ≥7, E ≥7. Cada corte é avaliado separadamente.',
  limits:'Triagem positiva requer entrevista e avaliação do contexto. Subescala pode ultrapassar seu corte mesmo com total inferior a 15.',
  sources:[ref('Murphy et al. · replicação em 80.680 crianças e adolescentes','https://pmc.ncbi.nlm.nih.gov/articles/PMC5005018/'),ref('Formulário PSC-17 · colunas de pontuação e limites','https://irp.cdn-website.com/c6f8236d/files/uploaded/PSC-17.pdf'),ref('Massachusetts Child Psychiatry Access Program · pontuação','https://www.mcpap.com/pdf/Oct22CC2024.pdf')],
  compute:({internal,attention,external})=>{
    const total=internal+attention+external;
    const positives=[['internalizantes',internal>=5],['atenção',attention>=7],['externalizantes',external>=7]].filter(item=>item[1]).map(item=>item[0]);
    return {total,level:positives.length||total>=15?'medium':'neutral',label:total>=15?'Total no corte ou acima':'Total abaixo de 15',
      action:(positives.length?'Subescalas acima ou no corte: '+positives.join(', ')+'.':'Nenhuma subescala atingiu seu corte.')+' Interpretar com entrevista clínica.',
      breakdown:[{label:'Internalizantes',points:internal},{label:'Atenção',points:attention},{label:'Externalizantes',points:external}],audit:internal+' + '+attention+' + '+external+' = '+total};
  },
});

const referenceOnly = [
  ['rcads-ped','RCADS-47','Ansiedade e sintomas depressivos','8–18 anos','Psiquiatria',screening,'Use o autorrelato ou o formulário para responsáveis. Os 47 itens produzem escores por subescala. A conversão depende do respondente e das normas aplicadas.','Revised Child Anxiety and Depression Scale','https://rcads.ucla.edu/versions','https://rcads.ucla.edu/scoringdownloads'],
  ['kidscreen-52','KIDSCREEN-52',qol,'8–18 anos','Pediatria',functional,'Descreve dez dimensões de qualidade de vida. Utilize o manual, a sintaxe e os referenciais adequados à versão e ao país. Não há um único total KIDSCREEN-52.','qualidade de vida','https://www.kidscreen.org/english/questionnaires/kidscreen-52/','https://www.kidscreen.org/english/questionnaires/implementation-manual/'],
  ['sdq-ped','SDQ · capacidades e dificuldades','Dificuldades emocionais e comportamentais','4–17 anos · responsáveis ou professores','Psiquiatria',screening,'Use o formulário de 25 itens para o informante selecionado. Identifique domínios e impacto no relatório oficial, mantendo separadas as avaliações de família e escola.','Strengths and Difficulties Questionnaire','https://sdqinfo.org/a0.html','https://www.sdqinfo.org/py/sdqinfo/c0.py'],
  ['vanderbilt-adhd-ped','Vanderbilt NICHQ · avaliação inicial','Suspeita de TDAH','6–12 anos','Psiquiatria',screening,'Use a edição inicial distribuída pelo NICHQ. Reúna informações do responsável e da escola sobre sintomas e prejuízo funcional antes de interpretar o rastreamento.','transtorno do déficit de atenção e hiperatividade','https://nichq.org/downloadable/nichq-vanderbilt-assessment-scales/','https://aims.uw.edu/implementation-tool/measures/'],
  ['crafft21-ped','CRAFFT 2.1','Uso de álcool e outras substâncias','12–21 anos · formulário para jovens','Psiquiatria',screening,'Combine o roteiro inicial com as perguntas condicionais do manual. A versão 2.1 considera também o risco de deslocamento com condutor sob efeito de substâncias.','adolescência álcool drogas','https://crafft.org/get-the-crafft/','https://crafft.org/use-the-crafft/'],
  ['asq-nimh-youth','ASQ · rastreio de risco de suicídio','Risco de suicídio','8–24 anos · fluxo juvenil NIMH','Psiquiatria',screening,'Aplicar o instrumento e o fluxo juvenil do NIMH (versão 29/09/2025). Ideação suicida atual exige observação de segurança e avaliação imediata. O manejo de tentativas anteriores e da recusa segue a ramificação do formulário atualizado.','Ask Suicide-Screening Questions','https://www.nimh.nih.gov/sites/default/files/documents/research/research-conducted-at-nimh/asq-toolkit-materials/asq-tool/screening-tool-asq-nimh-toolkit.pdf','https://www.nimh.nih.gov/research/research-conducted-at-nimh/asq-toolkit-materials/youth-asq-toolkit'],
].map(([id,name,condition,population,specialty,purpose,scope,alias,form,guide])=>{
  const reason = 'O formulário e a chave de interpretação estão nas referências oficiais. '+scope;
  return externalRecord({id,name,population,subtitle:condition+' · consulta ao instrumento',conditions:[condition],purposes:[purpose],
    specialties:[...new Set(['Pediatria',specialty])],aliases:[alias,condition],scope,
    limits:'Interpretar no contexto clínico, respeitando idade, idioma, versão e informante da aplicação.',
    externalCalculationReason:reason,sources:[ref('Instrumento · '+name,form),ref('Manual e interpretação · '+name,guide)]});
});

const pediFabs=arithmetic({
  id:'hss-pedi-fabs',name:'HSS Pedi-FABS',subtitle:'Nível de atividade esportiva no último mês',
  population:'10–18 anos · jovens fisicamente ativos',conditions:['Atividade física'],purposes:[functional],
  specialties:['Pediatria','Ortopedia'],aliases:['Hospital for Special Surgery Pediatric Functional Activity Brief Scale','esporte','atividade esportiva'],
  fields:[n('activity','Subtotal das seis atividades do formulário',0,24),n('competition','Pontuação da competição',0,3),n('practice','Pontuação da prática supervisionada',0,3)],
  max:30,scope:'Transcreva do formulário de autorrelato os seis itens de atividade física (0–4 cada) e os dois itens sobre participação esportiva (0–3 cada). A janela é o último mês.',
  formula:'Pontuação esportiva = atividade + competição + prática supervisionada.',
  limits:'Maior atividade não equivale a recuperação plena nem autoriza retorno ao esporte após lesão.',
  sources:[ref('Fabricant et al. · estudo original','https://pubmed.ncbi.nlm.nih.gov/23893420/'),ref('HSS / PRiSM · instrumento e chave de pontuação','https://www.prismsports.org/UserFiles/file/HSSPedi-FABSPDFScoring.pdf')],
  compute:({activity,competition,practice})=>({total:activity+competition+practice,level:'neutral',label:'Atividade esportiva autorreferida',
    action:'Pontuação maior indica maior participação em atividade esportiva.',breakdown:[{label:'Atividades',points:activity},{label:'Competição',points:competition},{label:'Prática supervisionada',points:practice}],audit:[activity,competition,practice].join(' + ')}),
});

const pbsFields=[0,1,2,3,4].map(i=>n('n'+i,'Número de tarefas com '+i+(i===1?' ponto':' pontos'),0,14));
const pbs=arithmetic({
  id:'pbs-pediatric-balance',name:'PBS · Pediatric Balance Scale',subtitle:'Equilíbrio funcional pediátrico · 14 tarefas',
  population:'5–15 anos na validação original · alterações motoras leves a moderadas',conditions:['Alteração do equilíbrio'],purposes:[functional],
  specialties:['Pediatria','Neurologia','Ortopedia'],aliases:['escala de equilíbrio pediátrica','Pediatric Balance Scale','Berg pediátrico'],
  fields:pbsFields,max:56,scope:'Execute as 14 tarefas funcionais segundo o manual e registre o melhor desempenho permitido pela rubrica. Conte as tarefas em cada nível observado (0–4).',
  formula:'Somar os pontos das 14 tarefas. O número de tarefas em todas as categorias deve totalizar 14.',
  limits:'Efeitos de teto e idade influenciam a interpretação. Evitar usar pontos de corte de quedas em adultos.',
  sources:[ref('Franjoine et al. · desenvolvimento, amostra com deficiência motora','https://pubmed.ncbi.nlm.nih.gov/17057441/'),ref('Shirley Ryan AbilityLab · manual e folha de registro da PBS','https://www.sralab.org/sites/default/files/2017-06/PediatricBalanceScale_3.pdf'),ref('RehabMeasures · população e interpretação','https://www.sralab.org/rehabilitation-measures/pediatric-balance-scale')],
  compute:values=>{
    const parts=pbsFields.map((f,i)=>({label:f.label,points:values[f.id]*i}));
    return {total:parts.reduce((total,c)=>total+c.points,0),level:'neutral',label:'Equilíbrio nas tarefas avaliadas',action:'Um valor maior representa melhor desempenho observado nas tarefas.',breakdown:parts,audit:pbsFields.map((f,i)=>values[f.id]+'×'+i).join(' + ')};
  },
},values=>pbsFields.reduce((total,f)=>total+values[f.id],0)===14?[]:pbsFields.map(f=>f.id));

const scaredDomains=[['panic','Pânico e sintomas somáticos',13,7],['general','Ansiedade generalizada',9,9],['separation','Ansiedade de separação',8,5],['social','Ansiedade social',7,8],['school','Evitação escolar',4,3]];
const scared=arithmetic({
  id:'scared41-child',name:'SCARED-41 · autorrelato',subtitle:'Rastreio de ansiedade em cinco domínios',
  population:'8–18 anos · autorrelato',conditions:['Ansiedade'],purposes:[screening],
  specialties:['Pediatria','Psiquiatria'],aliases:['Screen for Child Anxiety Related Emotional Disorders','pânico','separação','evitação escolar'],
  max:82, fields:scaredDomains.map(([id,label,count])=>n(id,label+' · subtotal dos '+count+' itens',0,2*count)),
  scope:'Utilize os cinco subtotais da chave do autorrelato completo com 41 itens (0–2 cada). Confira os números dos itens na folha dos autores.',
  formula:'Total = soma dos cinco domínios. Triagem total ≥25. Cortes por domínio: pânico 7, ansiedade generalizada 9, separação 5, social 8 e evitação escolar 3.',
  limits:'Curso, prejuízo funcional e entrevista diagnóstica são independentes da pontuação. Não some autorrelato e escala dos responsáveis.',
  sources:[ref('Universidade de Pittsburgh · formulário de autorrelato','https://cabsresearch.pitt.edu/calculator/SCAREDC.PDF'),ref('Birmaher et al. · replicação','https://pubmed.ncbi.nlm.nih.gov/10517055/'),ref('APTA · versão autorizada pelos autores e chave','https://www.apta.org/siteassets/pdfs/test-and-measures/apta_screen-for-child-anxiety-related-disorders-scared-child-version.pdf')],
  compute:values=>{
    const parts=scaredDomains.map(([id,label])=>({label,points:values[id]}));
    const total=parts.reduce((sum,c)=>sum+c.points,0);
    const positive=scaredDomains.filter(([id,,,cutoff])=>values[id]>=cutoff).map(([,label])=>label);
    return {total,level:total>=25||positive.length?'medium':'neutral',label:total>=25?'Triagem global positiva':'Total abaixo de 25',
      action:positive.length?'Domínios que atingiram o corte: '+positive.join(', ')+'. Correlacionar com prejuízo funcional e entrevista.':'Nenhum domínio atingiu seu ponto de corte. Avaliar clinicamente se houver suspeita.',
      breakdown:parts,audit:parts.map(c=>c.points).join(' + ')+' = '+total};
  },
});

const psq=arithmetic({
  id:'psq-srbd-child',name:'PSQ · distúrbio respiratório do sono',subtitle:'Subescala SRBD · 22 itens',
  population:'2–18 anos · relato do responsável',conditions:['Distúrbio respiratório do sono'],purposes:[screening],
  specialties:['Pediatria','Pneumologia','Otorrinolaringologia'],aliases:['Pediatric Sleep Questionnaire','SRBD','apneia obstrutiva do sono','ronco'],
  max:1,range:'0–1',unit:'proporção',precision:3,
  fields:[n('yes','Respostas afirmativas',0,22),n('no','Respostas negativas',0,22)],
  scope:'Aplicar a subescala completa com 22 itens. Contar separadamente as respostas afirmativas e negativas. O restante corresponde a respostas desconhecidas ou indisponíveis.',
  formula:'SRBD = sim / (sim + não), excluindo as respostas desconhecidas. Ao menos uma resposta interpretável é necessária para calcular a proporção. Corte da apresentação ATS: >0,33.',
  limits:'Quanto mais itens faltantes, menor a informação clínica disponível. Suspeita clínica ou comorbidades podem justificar estudo do sono independentemente do escore. O questionário não mede o índice de apneia/hipopneia.',
  sources:[ref('Chervin et al. · instrumento original','https://pubmed.ncbi.nlm.nih.gov/10733617/'),ref('American Thoracic Society · fórmula, limiar e idade','https://site.thoracic.org/assemblies/srn/sleep-related-questionnaires/psq'),ref('Chervin et al. · seguimento e discussão dos limites','https://jamanetwork.com/journals/jamaotolaryngology/fullarticle/484678')],
  compute:({yes,no})=>{
    const count=yes+no,total=yes/count;
    return {total,level:total>.33?'medium':'neutral',label:total>.33?'Acima de 0,33':'Até 0,33',action:'Foram consideradas '+count+' de 22 respostas. A representatividade depende da completude da avaliação; interpretar junto à história respiratória e do sono.',
      breakdown:[{label:'Sim',points:yes},{label:'Não',points:no},{label:'Desconhecidas/ausentes',points:22-count}],audit:yes+' / '+count+' = '+total.toFixed(3).replace('.',',')};
  },
},({yes,no})=>yes+no>0&&yes+no<=22?[]:['yes','no']);

export const pediatricOutcomeScores = [
  ...pedsqlProfiles.map(pedsqlDomain), vancouver, dvss, pinq, psc, pediFabs, pbs, scared, psq,
  ...promisScores, ...referenceOnly,
];
