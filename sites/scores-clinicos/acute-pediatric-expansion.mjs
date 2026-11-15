// Additional, version-specific pediatric instruments. Use the existing score and field contracts.
const src = (title, url) => ({ title, url });
const pub = (title, pmid) => src(title, 'https://pubmed.ncbi.nlm.nih.gov/' + pmid + '/');
const select = (id, label, choices, hint = '') => ({
  id, label, type: 'select', hint, noPoints: true, options: choices.map(([value, text]) => ({ value, label: text })),
});
const yn = (id, label, hint) => select(id, label, [[0, 'Não'], [1, 'Sim']], hint);
const numeric = (id, label, min, max, step = 'any', hint = '') => ({ id, label, type: 'number', min, max, step, hint });
const row = (label, points) => ({label, points});
const rated = (label, level = 'neutral') => ({label, level});
const reached = (cut, n) => n >= cut ? rated('Atinge o corte de risco do modelo', 'medium') : rated('Abaixo do corte do modelo');

function parse(field, raw) {
  if (!['number','string'].includes(typeof raw)) return undefined;
  if (field.type === 'select') return field.options.find(option => String(option.value) === String(raw))?.value;
  if (typeof raw === 'string' && !/^-?\d+(?:[.,]\d+)?$/.test(raw)) return undefined;
  const value = typeof raw === 'string' ? Number(raw.replace(',', '.')) : raw;
  if (!Number.isFinite(value) || value < field.min || value > field.max || (field.step === 1 && !Number.isInteger(value))) return undefined;
  return value;
}

function instrument(spec, contributions, interpretation, check = () => []) {
  const {action, ...score} = spec;
  function evaluate(input) {
    const x = Object.create(null), errors = [];
    for (const field of score.fields) {
      if (field.activeWhen && x[field.activeWhen.field] !== field.activeWhen.value) continue;
      let descriptor;
      try { descriptor = input && typeof input === 'object' && !Array.isArray(input) && Object.getOwnPropertyDescriptor(input, field.id); } catch { /* unavailable */ }
      x[field.id] = descriptor && Object.hasOwn(descriptor, 'value') ? parse(field, descriptor.value) : undefined;
      if (x[field.id] === undefined) errors.push(field.id);
    }
    if (errors.length) return { complete: false, errors };
    const conflicts = check(x);
    if (conflicts.length) return { complete: false, errors: conflicts };
    const breakdown = contributions(x);
    const arithmetic = breakdown.reduce((sum, item) => sum + item.points, 0);
    const total = score.reduction === 'any' ? Number(arithmetic > 0) : arithmetic;
    const {label, level, alerts = [], displayValue} = interpretation(total, x);
    const audit = score.ruleAudit ||
      breakdown.map(item => item.points).join(' + ') + ' = ' + +total.toFixed(4);
    return { complete: true, total: score.categorical ? null : +total.toFixed(4), label, level, alerts, action, breakdown, audit, errors: [],
      ...(displayValue !== undefined ? {displayValue} : {}) };
  }
  return {
    specialty: 'Pediatria', populationGroups: ['pediatria'], reviewDate: '13/11/2026',
    unit: 'pontos', resultScale: false, ...score,
    keywords: [...new Set([...(score.aliases || []), ...score.conditions, score.name])],
    safeCalculate: evaluate, safeValidate: x => evaluate(x).errors,
  };
}

const ns = 'Neonatologia', anest = 'Anestesiologia', ped = 'Pediatria', pulm = 'Pneumologia';
const infantAge = numeric('ageMonths', 'Idade em meses completos', 0, 215, 1);
const respiratoryRisk = 'Reavalie a via aérea, a ventilação e a oxigenação conforme o exame. Instabilidade exige atendimento imediato em qualquer pontuação.';
const preopRisk = 'Integre o resultado à avaliação pré-anestésica, ao tipo e à urgência do procedimento e à capacidade de monitorização.';
const kwScope = 'Doença de Kawasaki aguda em criança, antes da primeira imunoglobulina intravenosa (IGIV). Usar os exames basais e o dia de doença na primeira infusão; dia de início da febre = dia 1.';
const kwLimits = 'Modelos japoneses de resistência à IGIV têm desempenho variável em outras populações. Um total baixo não afasta resistência ou risco coronariano. Não usar o total isolado para mudar a terapêutica ou o seguimento ecocardiográfico.';
const kwAction = 'Reavalie resposta clínica após IGIV e achados coronarianos com a equipe assistente. O escore basal não confirma resistência.';
const kwProfile = {specialties: [ped, 'Cardiologia'], population: 'Crianças com Kawasaki antes da primeira IGIV', conditions: ['Doença de Kawasaki'], purposes: ['Estratificação prognóstica'], scope: kwScope, limits: kwLimits, action: kwAction};
const kwValidation = src('Korean Circ J 2016 · aplicação comparativa, fatores e ponderações, tabela 3', 'https://doi.org/10.4070/kcj.2016.46.4.542');
const kwRegistry = src('Registro de Kawasaki · tabelas de estratificação japonesas', 'https://kwsd.info/zsp_ivig_scores.html');
const kwDay = numeric('day', 'Dia de doença ao iniciar IGIV', 1, 99, 1);
const kwPlt = numeric('platelets', 'Plaquetas (mil/µL)', 0, 3000, 'any', '300 equivale a 300.000/µL.');
const kwCrp = numeric('crp', 'Proteína C reativa (mg/dL)', 0, 200, 'any', 'Quando o laboratório informa mg/L, dividir por 10.');
const kwAst = numeric('ast', 'AST/TGO (U/L)', 0, 100000);
const kwAge = numeric('ageMonths', 'Idade na avaliação (meses completos)', 0, 215, 1);
const kawasaki = [
  instrument({...kwProfile, id:'kobayashi-gunma-2006', name:'Kobayashi · Gunma', subtitle:'Resistência à IGIV na doença de Kawasaki',
    range:'0–11', max:11, aliases:['Kobayashi score', 'Gunma', 'IVIG'],
    fields:[kwAge, kwDay, numeric('sodium','Sódio (mmol/L)',1,250), kwAst, numeric('neutrophils','Neutrófilos (%)',0,100), kwCrp, kwPlt],
    formula:'2 pontos por Na ≤133, dia ≤4, AST ≥100 e neutrófilos ≥80%. 1 ponto por idade ≤12 meses, PCR ≥10 mg/dL e plaquetas ≤300 mil/µL.',
    limits:kwLimits + ' O artigo de derivação usou ≥4; perfis subsequentes como o usado no RAISE adotaram ≥5. A ficha identifica a fronteira discrepante.',
    sources:[pub('Kobayashi et al. 2006 · derivação',16735679), kwValidation, kwRegistry]},
    x=>[row('Idade',+(x.ageMonths<=12)),row('Dia',2*(x.day<=4)),row('Sódio',2*(x.sodium<=133)),row('AST',2*(x.ast>=100)),row('Neutrófilos',2*(x.neutrophils>=80)),row('PCR',+(x.crp>=10)),row('Plaquetas',+(x.platelets<=300))],
    n=>n===4?rated('Alto no corte original ≥4; abaixo de ≥5', 'medium'):reached(4,n)),
  instrument({...kwProfile, id:'egami-kurume', name:'Egami · Kurume', subtitle:'Resistência à primeira IGIV',
    range:'0–6', max:6, aliases:['Egami score', 'Kurume', 'IVIG'], fields:[kwAge, {...kwDay,max:9}, kwPlt, kwCrp, numeric('alt','ALT/TGP (U/L)',0,100000)],
    scope:kwScope + ' A coorte de derivação recebeu IGIV até o nono dia.',
    formula:'ALT ≥80 U/L vale 2. Idade ≤6 meses, tratamento até o dia 4, plaquetas ≤300 mil/µL e PCR ≥8 mg/dL valem 1 cada. Corte ≥3.',
    sources:[pub('Egami et al. 2006 · população e derivação',16887442),kwRegistry,kwValidation]},
    x=>[row('Idade',+(x.ageMonths<=6)),row('Dia',+(x.day<=4)),row('Plaquetas',+(x.platelets<=300)),row('PCR',+(x.crp>=8)),row('ALT',2*(x.alt>=80))], n=>reached(3,n)),
  instrument({...kwProfile, id:'sano-osaka', name:'Sano · Osaka', subtitle:'Resistência à primeira IGIV',
    range:'0–3', max:3, aliases:['Sano score','Osaka','IVIG'], fields:[kwAst, kwCrp, numeric('bilirubin','Bilirrubina total (mg/dL)',0,100)],
    formula:'Soma de AST ≥200 U/L, PCR ≥7 mg/dL e bilirrubina total ≥0,9 mg/dL. 1 ponto por critério; corte ≥2.',
    sources:[pub('Sano et al. 2007 · coorte japonesa',16896641),kwRegistry,kwValidation]},
    x=>[row('AST',+(x.ast>=200)),row('PCR',+(x.crp>=7)),row('Bilirrubina total',+(x.bilirubin>=0.9))], n=>reached(2,n)),
  instrument({id:'son-coronary-kawasaki-2019', name:'Son · risco coronariano em Kawasaki', subtitle:'Aneurisma coronariano em 2–8 semanas',
    aliases:['Son risk score','coronárias','aneurisma coronariano'], specialties:[ped,'Cardiologia'], conditions:['Doença de Kawasaki','Aneurisma coronariano'], purposes:['Risco de complicações'], population:'Crianças com doença de Kawasaki', range:'0–5', max:5,
    scope:'Avaliação basal da doença de Kawasaki. Informar escores Z já medidos nas coronárias descendente anterior e direita; a variável étnico-racial do modelo corresponde à informação referida, sem inferência por aparência.',
    fields:[numeric('onsetMonths','Idade em meses completos no início da febre',0,215,1),numeric('ladZ','Escore Z basal da descendente anterior',-30,100),numeric('rcaZ','Escore Z basal da coronária direita',-30,100),kwCrp,yn('asian','Origem asiática referida conforme o registro do estudo?')],
    formula:'Maior Z basal (DA ou CD) ≥2 vale 2. Idade ao início <6 meses, origem asiática referida e PCR ≥13 mg/dL valem 1 cada.',
    limits:'Derivado em população norte-americana. Validação japonesa observou desempenho diferente. A classificação é prognóstica e exige ecocardiografia. Um dado demográfico desconhecido não deve ser presumido.',
    action:'Integrar com ecocardiograma basal e seriado. O resultado não define sozinho a intensidade do tratamento.',
    sources:[src('Son et al. 2019 · modelo e tabela 5','https://pmc.ncbi.nlm.nih.gov/articles/PMC6585355/'),pub('Validação em coorte japonesa',34147499)]},
    x=>[row('Maior escore Z basal',2*(Math.max(x.ladZ,x.rcaZ)>=2)),row('Idade ao início',+(x.onsetMonths<6)),row('Origem referida',x.asian),row('PCR',+(x.crp>=13))],
    n=>n<=1?rated('Estrato baixo do modelo'):n===2?rated('Estrato intermediário','medium'):rated('Estrato alto','high')),
];

const diva = instrument({id:'diva-yen-four', name:'DIVA · Yen (4 itens)', subtitle:'Dificuldade da primeira punção venosa periférica', aliases:['Difficult Intravenous Access','punção venosa','DIVA pediátrico'],
  specialties:[ped,anest], conditions:['Acesso venoso periférico difícil'], purposes:['Risco de complicações'], population:'Crianças em pronto atendimento que precisam de acesso periférico', range:'0–10',max:10,
  scope:'Avaliação antes da primeira tentativa. Examinar visibilidade e palpabilidade da veia com o garrote aplicado. A idade gestacional do nascimento usa o corte histórico peculiar deste perfil.',
  fields:[infantAge,yn('notVisible','A veia permanece invisível sob garrote?'),yn('notPalpable','A veia permanece impalpável sob garrote?'),yn('bornBefore38','Nasceu antes de 38 semanas completas?','Critério operacional da DIVA de 4 itens; não redefine prematuridade clínica.')],
  formula:'Veia invisível +2, impalpável +2, nascimento <38 semanas +3; idade <12 meses +3, 12–35 meses +1, ≥36 meses zero. Corte ≥4.',
  limits:'A pesquisa estimou dificuldade com a primeira tentativa; técnica, operador e ultrassom modificam o resultado. Em emergência, não adiar a via de acesso necessária para obter um escore.',
  action:'Avaliar apoio de profissional experiente e ultrassom conforme a necessidade e os recursos disponíveis.',
  sources:[pub('Yen et al. 2008 · derivação',18347490),pub('Riker et al. · validação e versões alternativas',22092893),src('Anales de Pediatría · validação e limite gestacional do perfil original','https://analesdepediatria.org/es-download-pdf-S2341287925004053')]},
  x=>[row('Idade',x.ageMonths<12?3:x.ageMonths<36?1:0),row('Visibilidade',2*x.notVisible),row('Palpação',2*x.notPalpable),row('Nascimento <38 sem',3*x.bornBefore38)],n=>reached(4,n));

const apnea = instrument({id:'stbur-perioperative', name:'STBUR', subtitle:'Triagem de risco respiratório perioperatório', aliases:['snoring trouble breathing unrefreshed','apneia do sono'], specialties:[ped,anest,pulm], population:'Crianças a partir de 2 anos em avaliação pré-anestésica', conditions:['Distúrbio respiratório do sono','Complicação respiratória perioperatória'],purposes:['Triagem','Avaliação perioperatória'], range:'0–5',max:5,
  scope:'Sintomas durante o sono informados pelo responsável antes de procedimento eletivo sob anestesia geral. Confirmar idade e contexto na preparação.',
  fields:[yn('frequent','Ronca em mais da metade das ocasiões em que dorme?'),yn('loud','O ronco tem intensidade elevada?'),yn('breathing','Há dificuldade para respirar enquanto dorme?'),yn('pauses','Já foram observadas pausas respiratórias durante o sono?'),yn('tired','Costuma acordar pela manhã sem parecer descansada?')],
  formula:'Um ponto por manifestação. Com três ou mais, a triagem é positiva para maior risco respiratório perioperatório.',
  limits:'A contagem não estabelece diagnóstico de apneia obstrutiva nem substitui polissonografia ou avaliação da via aérea. Sintoma desconhecido permanece sem resposta. Síntese em português para consulta profissional.',
  action:preopRisk,sources:[src('Tait et al. 2013 · derivação','https://pmc.ncbi.nlm.nih.gov/articles/PMC3648590/'),pub('Huerta et al. · avaliação em procedimentos eletivos',34823651),src('Society for Ambulatory Anesthesia · posicionamento','https://doi.org/10.1213/ANE.0000000000006645')]},
  x=>[row('Frequência do ronco',x.frequent),row('Volume do ronco',x.loud),row('Esforço respiratório',x.breathing),row('Pausas',x.pauses),row('Despertar',x.tired)],n=>reached(3,n));

const ten = instrument({id:'ten4facesp-2021',name:'TEN-4-FACESp',subtitle:'Triagem de equimoses suspeitas em menores de 4 anos',aliases:['TEN-4 FACESp','violência','maus-tratos','equimose'],specialties:[ped,'Emergência'],conditions:['Equimoses','Suspeita de violência física'],purposes:['Triagem'],population:'Menores de 4 anos com equimose identificada',range:'Positiva / negativa',max:1,reduction:'any',ruleAudit:'Triagem positiva quando pelo menos um dos quatro domínios é positivo.',unit:'classificação',categorical:true,
  scope:'Aplicar após exame da pele em criança com ao menos uma equimose. Ausência de equimose torna a regra inaplicável. Considerar a possibilidade de doenças hemorrágicas e o contexto da lesão.',
  fields:[numeric('ageMonths','Idade em meses completos',0,47,1),yn('bruising','Há pelo menos uma equimose confirmada ao exame?'),yn('region','Há equimose em tronco (inclui tórax, abdome, dorso, nádegas e área geniturinária), orelha ou pescoço?'),yn('face','Há equimose em frênulo, ângulo da mandíbula, parte carnosa da bochecha, pálpebra ou subconjuntiva?'),yn('pattern','Há equimose com desenho reconhecível, como mão, preensão ou alça?')],
  formula:'Positiva se qualquer equimose em idade <5 meses completos, se topografia TEN ou FACES, ou se equimose com padrão.',
  limits:'Um resultado positivo solicita avaliação clínica e protetiva; não identifica autoria nem confirma agressão. Um resultado negativo não elimina a possibilidade de violência.',
  action:'Interpretar com relato, desenvolvimento, exame completo, diagnósticos diferenciais e avaliação da equipe de proteção quando pertinente.',
  sources:[src('Pierce et al. · validação multicêntrica','https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2778559'),src('Lurie Children’s Hospital · algoritmo dos autores','https://www.luriechildrens.org/globalassets/media/pages/research/tricam/ten-4/4_2022-lch-2514-ten-4-facesp-24x36-poster_print.pdf')]},
  x=>[row('Qualquer equimose antes de 5 meses',+(x.ageMonths<5)),row('TEN',x.region),row('FACES',x.face),row('Padrão',x.pattern)],
  n=>({...rated(n?'Triagem positiva':'Critérios não identificados',n?'medium':'neutral'),displayValue:n?'Positiva':'Negativa'}),x=>x.bruising?[]:['bruising']);

const brue = instrument({id:'brue-aap-lower-risk',name:'BRUE · critérios AAP de menor risco',subtitle:'Estratificação após evento breve, resolvido e inexplicado',aliases:['evento breve resolvido inexplicado','ALTE'],specialties:[ped,'Emergência'],conditions:['BRUE'],purposes:['Estratificação prognóstica'],population:'Lactentes menores de 1 ano com BRUE reconhecido',range:'Critérios de menor risco',max:1,reduction:'any',categorical:true,ruleAudit:'O perfil de menor risco exige que nenhum requisito esteja ausente.',unit:'classificação',
  scope:'Confirmar idade <1 ano, retorno ao estado basal e ausência de causa após anamnese e exame. O episódio súbito e breve deve ter envolvido cor (palidez/cianose), respiração, tônus ou responsividade. Se há causa definida ou alteração persistente, usar a avaliação da condição específica.',
  fields:[yn('brue','O episódio satisfaz a definição de BRUE acima em lactente menor de um ano?'),yn('age','Tem mais de 60 dias de vida?'),yn('maturity','Nasceu com ≥32 semanas e atualmente tem idade pós-menstrual ≥45 semanas?'),yn('first','Foi o único episódio, sem ocorrência em agrupamento?'),yn('brief','Durou menos de 60 segundos?'),yn('noCpr','Dispensou RCP por profissional de saúde treinado?'),yn('history','A história é livre de características preocupantes?'),yn('exam','O exame físico é livre de achados preocupantes?')],
  formula:'Todos os requisitos devem estar presentes para satisfazer o perfil de menor risco. Não existe pontuação numérica cumulativa de gravidade.',
  limits:'A diretriz específica de menor risco não deve ser extrapolada para quem descumpre qualquer critério. Não estima, individualmente, a probabilidade de doença grave.',
  action:'Interpretar a classificação com anamnese detalhada, exame, evolução e contexto familiar. Presença de instabilidade exige abordagem imediata.',
  sources:[src('AAP · diretriz e critérios explícitos','https://publications.aap.org/pediatrics/article/137/5/e20160591/52194/'),src('Children’s Hospital of Philadelphia · via de atendimento','https://www.chop.edu/clinical-pathway/brief-resolved-unexplained-event-clinical-pathway')]},
  x=>[row('Idade ≤60 dias',1-x.age),row('Critério de maturidade ausente',1-x.maturity),row('Evento recorrente',1-x.first),row('Duração ≥1 minuto',1-x.brief),row('RCP profissional necessária',1-x.noCpr),row('História preocupante',1-x.history),row('Exame preocupante',1-x.exam)],
  n=>({...rated(n?'Um ou mais critérios de menor risco ausentes':'Todos os critérios de menor risco presentes',n?'medium':'neutral'),displayValue:n?'Fora do perfil':'Menor risco'}),x=>x.brue?[]:['brue']);

const submersion = instrument({id:'pediatric-submersion-shenoi',name:'Pediatric Submersion Score',subtitle:'Avaliação inicial após submersão',aliases:['afogamento','Shenoi'],specialties:[ped,'Emergência'],conditions:['Afogamento'],purposes:['Apoio à definição do local de cuidado'],population:'Crianças avaliadas no PS após submersão',range:'0–5',max:5,
  scope:'Usar os achados iniciais ao chegar ao PS. O desfecho estudado foi a condição para alta após observação de oito horas; a decisão clínica é feita depois da reavaliação.',
  fields:[yn('normalMental','Estado mental normal para idade e condição basal?'),yn('normalRate','Frequência respiratória normal para a idade?'),yn('noDyspnea','Ausência de dispneia?'),yn('noSupport','Sem necessidade de suporte da via aérea?'),yn('noHypotension','Sem hipotensão para a idade?')],
  formula:'Um ponto por cada critério favorável. Na coorte, o ponto de corte ≥4 se associou à condição para alta após observação.',
  limits:'O corte pode ser atingido mesmo com um sinal grave. Hipoxemia, alteração de consciência, dispneia, necessidade de suporte ou instabilidade requerem avaliação individual, independentemente do total.',
  action:'Observar e reavaliar oxigenação em ar ambiente, exame respiratório, sinais vitais, estado mental e segurança antes de cogitar alta. Escore isolado não autoriza alta.',
  sources:[pub('Shenoi et al. · derivação e validação',28833853),src('Wilderness Medical Society · diretriz 2024 e limites','https://doi.org/10.1177/10806032241227460'),src('Royal Children’s Hospital · critérios clínicos de alta','https://www.rch.org.au/clinicalguide/guideline_index/Drowning/')]},
  x=>[row('Estado mental',x.normalMental),row('FR',x.normalRate),row('Dispneia ausente',x.noDyspnea),row('Suporte dispensado',x.noSupport),row('Pressão preservada',x.noHypotension)],
  (n,x)=>({...rated(n>=4?'Atinge o corte prognóstico de quatro achados':'Abaixo do corte prognóstico',n<5?'medium':'neutral'),alerts:n<5?['Há achado inicial desfavorável. Reavalie sua gravidade independentemente da soma.']:[]}));

const brodsky = instrument({id:'brodsky-tonsillar-size',name:'Brodsky · tamanho tonsilar',subtitle:'Ocupação orofaríngea pelas tonsilas palatinas',aliases:['amígdalas','hipertrofia adenotonsilar','Brodsky'],specialties:[ped,'Otorrinolaringologia'],conditions:['Hipertrofia tonsilar'],purposes:['Classificação e estadiamento'],population:'Crianças com exame orofaríngeo interpretável',range:'Grau 0–4',max:4,unit:'grau',
  scope:'Selecionar a relação entre tonsilas palatinas e largura da orofaringe observada ao exame, na escala de cinco graus estudada por Ng et al.',
  fields:[select('view','Achado anatômico',[[0,'Tonsilas contidas nas fossas'],[1,'Além das fossas, ocupando até 25% da largura'],[2,'Mais de 25% até 50%'],[3,'Mais de 50% até 75%'],[4,'Mais de 75%']])],
  formula:'A categoria anatômica corresponde diretamente ao grau de 0 a 4.',
  limits:'A inspeção está sujeita a variação entre observadores. O tamanho não determina isoladamente apneia do sono, gravidade funcional ou indicação cirúrgica.',
  action:'Registrar assimetria e correlacionar com sintomas obstrutivos e avaliação otorrinolaringológica.',
  sources:[src('Ng et al. · cinco categorias e reprodutibilidade','https://jamanetwork.com/journals/jamaotolaryngology/fullarticle/495945'),pub('Kumar et al. · concordância em crianças',25317509)]}, x=>[row('Ocupação orofaríngea',x.view)],n=>rated('Grau '+n+' de Brodsky'));

const press = instrument({id:'press-miyaji-2015',name:'PRESS · Miyaji',subtitle:'Gravidade de infecção respiratória aguda',aliases:['Pediatric Respiratory Severity Score','IVAS','infecção respiratória'],specialties:[ped,pulm],conditions:['Infecção respiratória aguda'],purposes:['Gravidade clínica'],population:'3 meses a 14 anos · sintomas respiratórios agudos',range:'0–5',max:5,
  scope:'Avaliação inicial em repouso e em ar ambiente quando essa medida já estiver disponível. O perfil usa a faixa de 3 meses a 14 anos também estudada em validação prospectiva.',
  fields:[numeric('months','Idade em meses completos',3,179,1,'Aos 35 meses, o perfil segue a tabela 1 da validação de Bangkok.'),numeric('rr','FR em repouso, em ar ambiente (irpm)',1,250,1),numeric('spo2','SpO₂ em ar ambiente (%)',1,100),yn('wheeze','Sibilo expiratório agudo à ausculta?'),yn('muscles','Uso visível de musculatura acessória ou retrações?'),yn('refusal','Recusa alimentar?')],
  formula:'1 por SpO₂ <95%, sibilância, retração/uso de musculatura acessória, recusa alimentar e FR elevada. FR >60 até 11 meses, >40 aos 12–35 meses, >30 aos 36–155 meses e >20 a partir de 156 meses.',
  limits:'A tabela original imprime <35 meses; a tabela da validação prospectiva explicita <36 meses e esclarece a faixa aos 35 meses. A pontuação não substitui avaliação de hipóxia, apneia, exaustão, doença de base ou necessidade de suporte. Não retirar O₂ para pontuar.',
  action:respiratoryRisk, sources:[src('Miyaji et al. · tabela 1, equação e faixas','https://www.austinpublishinggroup.com/virology/fulltext/avrv-v2-id1009.pdf'),src('Thokngaen e Karoonboonyanan · validação prospectiva, tabela 1','https://he05.tci-thaijo.org/index.php/CMJ/article/download/273/243/239')]},
  x=>{const limit=x.months<12?60:x.months<36?40:x.months<156?30:20;return [row('FR acima da faixa',+(x.rr>limit)),row('SpO₂',+(x.spo2<95)),row('Sibilos',x.wheeze),row('Musculatura acessória',x.muscles),row('Recusa alimentar',x.refusal)];},
  (n,x)=>({...rated(n<=1?'Leve pelo PRESS':n<=3?'Moderada pelo PRESS':'Grave pelo PRESS',n>=4||x.spo2<90?'high':n>=2?'medium':'neutral'),alerts:x.spo2<90?['Hipoxemia importante. Avalie e trate imediatamente, independentemente da soma.']:[]}));

const riscSources = [src('Reed et al. · tabelas 1–3 e interação saturação/tiragem','https://pmc.ncbi.nlm.nih.gov/articles/PMC3251620/'),src('Validação externa no Malawi · critérios originais por status de HIV, tabela 2','https://pmc.ncbi.nlm.nih.gov/articles/PMC5193399/'),src('Validação multicêntrica de RISC · coortes PREPARE','https://pmc.ncbi.nlm.nih.gov/articles/PMC8542381/')];
function risc(infected) {
  const status = infected?'com HIV':'sem HIV';
  return instrument({id:infected?'risc-reed-hiv-positive':'risc-reed-hiv-negative',name:'RISC · África do Sul · '+status,subtitle:'Risco de mortalidade em infecção respiratória baixa',
    aliases:['Respiratory Index of Severity in Children','pneumonia','Reed'],specialties:[ped,pulm,'Infectologia'],conditions:['Infecção respiratória baixa','Pneumonia'],purposes:['Prognóstico de mortalidade'],population:'Menores de 24 meses '+status+' hospitalizados por infecção respiratória baixa',range:infected?'−1 a 7':'−2 a 6',max:infected?7:6,
    scope:'Aplicar apenas a crianças '+status+' conforme diagnóstico documentado. Medir os dados à admissão; se o status do HIV for desconhecido, não selecionar um perfil por suposição. Usar oximetria em ar ambiente já disponível, sem suspender oxigênio necessário.',
    fields:[numeric('months','Idade em meses completos',0,23,1),numeric('spo2','SpO₂ em ar ambiente (%)',1,100),yn('indrawing','Há tiragem de parede torácica?'),yn('wheeze','Há sibilância?'),yn('refusal','Há recusa alimentar?'),infected?select('hiv','Categoria clínica pediátrica do HIV (CDC histórica)',[[0,'N · assintomática'],[1,'A ou B · leve ou moderada'],[2,'C · grave']]):numeric('waz','Escore Z de peso para idade (OMS)',-15,15)],
    formula:(infected?'SpO₂ baixa +2 ou, alternativamente, tiragem +1; sibilância −1, recusa +1. Idade 0–2 meses +2; 3–12 meses +1. HIV A/B +1, C +2.':'SpO₂ baixa +3 ou, alternativamente, tiragem +2; sibilância −2 e recusa +1. Z peso/idade ≤−3 vale +2, entre >−3 e ≤−2 vale +1.')+' SpO₂ baixa é ≤90% em ar ambiente. Saturação e tiragem não acumulam.',
    limits:'Modelo sul-africano de hospitalização, período 1998–2001. A tabela de regressão usa SpO₂ <90%; a tabela prática usa ≤90%. Este perfil emprega ≤90%, como na tabela operacional e na validação externa no Malawi. Escores negativos podem ocorrer. Não fornece probabilidade individual calibrada para o Brasil, nem se aplica ao RISC-Malawi.',
    action:'Integrar o total com oxigenação, perfusão e evolução clínica. Sibilância pode subtrair pontos, mas não atenua a necessidade de tratar hipoxemia.',
    sources:riscSources}, x=>{const points=[row('Saturação ou tiragem',x.spo2<=90?(infected?2:3):x.indrawing*(infected?1:2)),row('Sibilância',-x.wheeze*(infected?1:2)),row('Recusa alimentar',x.refusal)];
      if(infected)points.push(row('Idade',x.months<=2?2:x.months<=12?1:0),row('HIV clínico',x.hiv));
      else points.push(row('Peso para idade',x.waz<=-3?2:x.waz<=-2?1:0));return points;},
    (n,x)=>({...rated('Escore prognóstico de admissão',x.spo2<=90?'high':'neutral'),alerts:x.spo2<=90?['Hipoxemia importante: avaliação e suporte imediatos, independentemente do escore.']:[]}));
}

const neonatal = {specialties:[ns,ped,'Terapia Intensiva'],specialty:ns,populationGroups:['neonatal']};
const jensen = instrument({...neonatal,id:'bpd-jensen-2019',name:'Jensen · displasia broncopulmonar',subtitle:'Classificação pelo suporte às 36 semanas',aliases:['BPD','DBP','Jensen'],conditions:['Displasia broncopulmonar'],purposes:['Classificação e estadiamento'],population:'Nascidos antes de 32 semanas, vivos às 36 semanas de idade pós-menstrual',range:'Grau 0–3',max:3,unit:'grau',
  scope:'A classificação de Jensen usa o suporte respiratório às 36 semanas de idade pós-menstrual em muito prematuros. Confirmar o momento da avaliação; não aplicar a uma medida avulsa de outra semana.',
  fields:[yn('eligibleTime','Nascimento <32 semanas e suporte conhecido às 36 semanas pós-menstruais?'),select('support','Suporte respiratório às 36 semanas de idade pós-menstrual',[[0,'Nenhum'],[1,'Cânula nasal com fluxo ≤2 L/min'],[2,'Cânula nasal >2 L/min ou pressão positiva não invasiva (CPAP/NIPPV)'],[3,'Ventilação mecânica invasiva']])],
  formula:'O tipo de suporte define o grau. O fluxo de exatamente 2 L/min por cânula nasal corresponde ao grau 1. A FiO₂ não altera o grau nesta definição.',
  limits:'Usar esta definição e sua janela temporal ao comparar coortes. Não extrapolar para recém-nascidos a termo ou a quem morreu antes da avaliação. Não define, isoladamente, a estratégia ventilatória.',
  action:'Documentar modalidade, fluxo e idade pós-menstrual usados. Interpretar junto à evolução pulmonar do prematuro.',sources:[pub('Jensen et al. · definição baseada em desfechos',30995069),src('BMJ · comparação de definições','https://www.bmj.com/content/375/bmj.n1974')]},x=>[row('Nível de suporte',x.support)],n=>rated(n?'DBP grau '+n:'Sem DBP pelo critério de Jensen'),x=>x.eligibleTime?[]:['eligibleTime']);

const rss = instrument({...neonatal,id:'rss-neonatal-map-fio2',name:'RSS neonatal · MAP × FiO₂',subtitle:'Intensidade do suporte ventilatório',aliases:['Respiratory Severity Score','gravidade respiratória','extubação'],conditions:['Ventilação mecânica neonatal'],purposes:['Gravidade clínica','Avaliação da oxigenação'],population:'Prematuros de muito baixo peso em ventilação invasiva',range:'Índice contínuo',unit:'RSS',
  scope:'Perfil com pressão média de vias aéreas medida durante ventilação invasiva. Usar pressão e FiO₂ do mesmo momento. Coorte de extubação estudou recém-nascidos de muito baixo peso.',
  fields:[numeric('map','Pressão média de vias aéreas (cmH₂O)',0.01,100),numeric('fio2','FiO₂ como fração de 0,21 a 1,00',0.21,1,'any','Exemplo: 40% equivale a 0,40.')],
  formula:'RSS = pressão média de vias aéreas (cmH₂O) × FiO₂ em fração.',
  limits:'Não confundir MAP das vias aéreas com pressão arterial média, PIP ou PEEP. Não usar substitutos de fluxo em cânula ou transformar o resultado em indicação automática de extubação.',
  action:'Registrar o valor e a tendência junto com exame, gases e parâmetros do ventilador.',sources:[src('Estudo em recém-nascidos de muito baixo peso · extubação','https://doi.org/10.1016/j.pedneo.2016.12.006'),src('Rivero et al. · cálculos respiratórios neonatais','https://respiratorytherapy.ca/pdf/RT-18-1-Winter-2023-R21-web.pdf')]},
  x=>[row(x.map+' cmH₂O × '+x.fio2,x.map*x.fio2)],()=>rated('Intensidade do suporte no momento avaliado'));

const skin = instrument({...neonatal,id:'nscs-neonatal-skin',name:'NSCS · condição da pele neonatal',subtitle:'Secura, eritema e lesão cutânea',aliases:['Neonatal Skin Condition Score','escala de condição da pele do recém-nascido'],conditions:['Lesão cutânea neonatal'],purposes:['Gravidade clínica'],population:'Recém-nascidos hospitalizados, prematuros ou a termo',range:'3–9',max:9,
  scope:'Exame direto da pele neonatal. O perfil segue a ficha AWHONN reproduzida com o limiar de metade da superfície corporal incluído no grau máximo de eritema.',
  fields:[select('dry','Ressecamento',[[1,'Sem ressecamento'],[2,'Seca, com descamação visível'],[3,'Muito seca e fissurada']]),select('red','Eritema',[[1,'Ausente'],[2,'Presente em menos de metade da superfície corporal'],[3,'Atinge pelo menos metade da superfície corporal']]),select('breakdown','Perda da integridade da pele',[[1,'Ausente'],[2,'Limitada a pequenas áreas'],[3,'Extensa']])],
  formula:'Somar três categorias de 1 a 3. O mínimo 3 representa pele sem alteração nos três domínios; 9 corresponde ao máximo observado.',
  limits:'Descreve condição cutânea atual. Não prediz lesão por pressão e não identifica a etiologia de uma lesão.',action:'Documentar áreas afetadas e acompanhar evolução entre exames.',
  sources:[src('AWHONN · ficha clínica reproduzida por Tampa General Hospital','https://cpmedcarepoints.tgh.org/Neonatal_Skin_Condition_Score_Fall2014.pdf'),src('Adaptação brasileira · Revista Latino-Americana de Enfermagem','https://revistas.usp.br/rlae/article/download/99302/97762/172960'),src('Indian Academy of Pediatrics · cuidados neonatais','https://pmc.ncbi.nlm.nih.gov/articles/PMC12199448/')]},
  x=>[row('Secura',x.dry),row('Eritema',x.red),row('Integridade',x.breakdown)],n=>rated(n===3?'Sem alteração nos três domínios':'Alteração cutânea presente'));

const ventilatorField = field => ({ ...field, activeWhen:{field:'invasive',value:1} });
const vvr = instrument({id:'vvr-cardiac-postop',name:'VVR · vasoativo, ventilatório e renal',subtitle:'Suporte após cirurgia de cardiopatia congênita',aliases:['vasoactive ventilation renal score','VI','cirurgia cardíaca pediátrica'],specialties:[ped,'Cardiologia','Terapia Intensiva'],populationGroups:['neonatal','pediatria'],conditions:['Pós-operatório de cirurgia cardíaca congênita'],purposes:['Estratificação prognóstica'],population:'Pós-operatório pediátrico de cardiopatia congênita',range:'Índice contínuo',unit:'VVR',
  scope:'Usar dados simultâneos no pós-operatório e a creatinina basal pré-operatória. Aceita ventilação convencional invasiva ou ausência de ventilação mecânica. O VIS de Gaies deve ter sido conferido no mesmo momento.',
  fields:[numeric('vis','VIS de Gaies contemporâneo (pontos)',0,10000,'any','Usar o instrumento VIS do catálogo. Informar zero somente com ausência de suporte vasoativo confirmada.'),{...select('invasive','Ventilação no instante da gasometria',[[0,'Sem ventilação mecânica'],[1,'Ventilação invasiva convencional']]),refreshFields:true},ventilatorField(numeric('rr','FR ajustada no ventilador (irpm)',1,250)),ventilatorField(numeric('pip','Pressão de pico (cmH₂O)',1,150)),ventilatorField(numeric('peep','PEEP (cmH₂O)',0,100)),ventilatorField(numeric('paco2','PaCO₂ arterial (mmHg)',1,300)),numeric('baseline','Creatinina pré-operatória (mg/dL)',0.01,40),numeric('post','Creatinina pós-operatória (mg/dL)',0.01,40)],
  formula:'VVR = VIS + FR ajustada × (PIP − PEEP) × PaCO₂/1000 + 10 × máximo(0, creatinina pós − pré). O termo ventilatório é zero apenas quando não há ventilação mecânica.',
  limits:'O total reflete suporte e disfunção no instante avaliado. Uso associado a desfechos de coorte, sem uma previsão individual de duração da internação. Não extrapolar para ECMO, alta frequência ou ventilação não invasiva neste perfil.',
  action:'Identificar o tempo pós-operatório e comparar valores obtidos sob as mesmas condições. Não ajustar droga ou ventilador com base apenas neste número.',
  sources:[src('Schere et al. · definições de VI e creatinina','https://www.jtcvs.org/article/S0022522316309436/pdf'),src('Indiana University · calculadora de referência','https://medicine.iu.edu/pediatrics/clinical-care/vasoactive-ventilation-renal-score-calculator')]},
  x=>[row('VIS informado',x.vis),row('Índice ventilatório',x.invasive?x.rr*(x.pip-x.peep)*x.paco2/1000:0),row('Componente renal',10*Math.max(0,x.post-x.baseline))],()=>rated('Valor pontual de suporte e disfunção'),x=>x.invasive&&x.pip<=x.peep?['pip','peep']:[]);

const cormack = instrument({id:'cormack-lehane-yentis',name:'Cormack–Lehane · Yentis e Lee',subtitle:'Visão glótica durante laringoscopia direta',aliases:['via aérea difícil','classificação de laringoscopia','Cormack Lehane'],specialties:[ped,anest,'Emergência'],populationGroups:['pediatria','adultos'],conditions:['Manejo da via aérea'],purposes:['Classificação e estadiamento'],population:'Crianças e adultos submetidos a laringoscopia direta',range:'I, IIa, IIb, III ou IV',unit:'grau',categorical:true,ruleAudit:'Classificação anatômica observacional; sem soma de pontos.',
  scope:'Classificação do que foi visto durante laringoscopia direta. Registrar a melhor visão obtida e as condições de exposição. Esta versão subdivide somente o grau II.',
  fields:[select('view','Visualização pelo operador',[[1,'Glote em toda a sua extensão'],[2,'Parte das pregas vocais, além de sua inserção posterior'],[3,'Apenas aritenoides ou inserção posterior extrema das pregas'],[4,'Somente epiglote'],[5,'Não se vê epiglote nem glote']])],
  formula:'Mapear o achado observado para I, IIa, IIb, III ou IV. Não somar pontos.',
  limits:'Classifica a visualização, não a posição do tubo, a ventilação, o êxito da intubação ou a dificuldade antecipada. Vídeo e visão direta não são intercambiáveis.',
  action:'Documentar aparelho, lâmina, manobras e relação entre visualização e passagem do tubo. Priorizar oxigenação conforme a situação clínica.',
  sources:[pub('Yentis e Lee · subdivisão IIa/IIb',10023271),src('Revisão pediátrica · uso em via aérea','https://pmc.ncbi.nlm.nih.gov/articles/PMC6260357/')]},
  x=>[{label:'Grau anatômico',points:x.view,detail:['','I','IIa','IIb','III','IV'][x.view]}],(n)=>({ ...rated('Visão laringoscópica documentada'),displayValue:['','I','IIa','IIb','III','IV'][n] }));

const hrRrThresholds = [
  // Upper age in completed months (exclusive), then HR and RR at the 99th percentile.
  [3,186,76],[6,182,71],[9,178,67],[12,176,63],[18,173,60],[24,170,57],[36,167,54],
  [48,164,52],[72,161,50],[96,155,46],[144,147,41],[180,138,35],[192,132,32],
];
const lqsofa = instrument({id:'lqsofa-liverpool-2020',name:'LqSOFA · Liverpool',subtitle:'Criança febril e risco de admissão em cuidados críticos',aliases:['Liverpool quick SOFA','qSOFA pediátrico Liverpool'],specialties:[ped,'Emergência','Terapia Intensiva'],populationGroups:['neonatal','pediatria'],conditions:['Febre','Infecção pediátrica'],purposes:['Estratificação prognóstica'],population:'Crianças febris menores de 16 anos no PS',range:'0–4',max:4,
  scope:'Febre aferida ≥38 °C no PS ou relatada nos últimos três dias. Na validação usaram-se as piores observações documentadas no PS para prever admissão em cuidados críticos em até 48 h.',
  fields:[numeric('months','Idade em meses completos',0,191,1),numeric('hr','Frequência cardíaca (bpm)',1,400,1),numeric('rr','Frequência respiratória (irpm)',1,250,1),numeric('crt','Tempo de enchimento capilar (s)',0,60),select('avpu','Melhor resposta (AVPU) no exame considerado',[[0,'Alerta'],[1,'Responde à voz'],[2,'Responde à dor'],[3,'Sem resposta']])],
  formula:'1 ponto por FC >p99, FR >p99 (tabela suplementar 7), enchimento capilar ≥3 segundos e resposta AVPU diferente de alerta. O limiar estudado foi ≥2.',
  limits:'O desfecho original é necessidade de cuidados críticos; LqSOFA não diagnostica ou exclui sepse. A sensibilidade a um limiar alto é insuficiente para descartar deterioração. Interprete cada sinal e intervenha prontamente se houver instabilidade.',
  action:'Quando houver alterações, reavaliar perfusão, respiração e consciência, com escalonamento conforme o quadro. Não aguardar a soma para tratar instabilidade.',
  sources:[src('Romaine et al. · tabela 1 e suplemento, tabela 7','https://pmc.ncbi.nlm.nih.gov/articles/PMC7786830/'),src('Validação externa em infecções respiratórias','https://pmc.ncbi.nlm.nih.gov/articles/PMC10624658/'),src('Desempenho em atenção primária','https://pmc.ncbi.nlm.nih.gov/articles/PMC11497154/')]},
  x=>{const [,hr,rr]=hrRrThresholds.find(([months])=>x.months<months);return [row('FC >'+hr,+(x.hr>hr)),row('FR >'+rr,+(x.rr>rr)),row('Enchimento capilar ≥3 s',+(x.crt>=3)),row('Resposta abaixo de alerta',+(x.avpu>0))];},
  (n,x)=>({...reached(2,n),alerts:x.avpu>0?['Alteração de responsividade. Avaliação clínica imediata independentemente do total.']:[]}));

export const acutePediatricExpansion = [...kawasaki, diva, apnea, ten, brue, submersion, brodsky, press, risc(false), risc(true), jensen, rss, skin, vvr, cormack, lqsofa];
