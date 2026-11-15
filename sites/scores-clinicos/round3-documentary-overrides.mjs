export function applyRound3Overrides(priorityScores,helpers){
const {s,y,n,ref,b,make,ordinal,meta,result,continuous,pmc}=helpers;
const priorityById=id=>priorityScores.find(score=>score.id===id);

{ // adult
// Soberania rodada 3: somente SMART-COP, Glasgow–Imrie (oito variáveis/LDH)
// e MELD-Na histórico de 2016. Este fragmento requer os helpers do catálogo.
Object.assign(priorityById('smart-cop'),{
  name:'SMART-COP · contrato Charles/MDCalc',
  population:'Adultos ≥18 anos com pneumonia comunitária',
  scope:'Adultos ≥18 anos com achados clínicos e radiográficos compatíveis com pneumonia adquirida na comunidade, sem imunossupressão significativa. Usar dados da avaliação inicial e escolher os critérios de FR e oxigenação de acordo com a idade real. Não transforma o escore em diagnóstico de pneumonia nem em prescrição.',
  fields:[
    meta(n('age','Idade (anos)',18,110,1,'A idade define os limiares de FR e de oxigenação; não acrescenta pontos.')),
    y('sbp','PAS <90 mmHg',2,'Mesmo limiar em todas as idades adultas; não ajustar a PAS pela idade.'),
    y('multilobar','Infiltrado multilobar no RX de tórax'),
    y('albumin','Albumina <3,5 g/dL (35 g/L)'),
    meta(n('rr','Frequência respiratória (respirações/min)',0,100,.1,'1 ponto se ≥25 em idade ≤50 anos ou ≥30 em idade >50 anos.')),
    y('tachy','FC ≥125 bpm'),
    y('confusion','Confusão de início recente'),
    y('oxygen','Critério de baixa oxigenação positivo para a faixa etária',2,'Idade ≤50: PaO₂ <70 mmHg OU SaO₂ ≤93% OU P/F <333. Idade >50: PaO₂ <60 mmHg OU SaO₂ ≤90% OU P/F <250. Confirmar a faixa etária e unidades; não presumir ausência/normalidade quando os dados não são conhecidos.'),
    y('ph','pH arterial <7,35',2,'O contrato editorial Charles/MDCalc usa <7,35; não substituir por <7,30.')
  ],
  compute:x=>{
    if(x.age<18)return {total:null,complete:false,errors:['age'],displayValue:'Não aplicável',label:'SMART-COP fora da população adulta',level:'medium',action:'Não calcular esta variante em menores de 18 anos.',audit:'População documental ≥18 anos',breakdown:[]};
    const rr=x.rr>=(x.age<=50?25:30)?1:0;
    const breakdown=[{label:'PAS <90',points:x.sbp},{label:'Multilobar',points:x.multilobar},{label:'Albumina <3,5',points:x.albumin},{label:`FR ≥${x.age<=50?25:30}`,points:rr},{label:'FC ≥125',points:x.tachy},{label:'Confusão recente',points:x.confusion},{label:'Oxigenação por idade',points:x.oxygen},{label:'pH <7,35',points:x.ph}];
    const total=breakdown.reduce((sum,v)=>sum+v.points,0);
    const label=total<=2?'Baixo risco pelo SMART-COP':total<=4?'Risco moderado pelo SMART-COP':total<=6?'Alto risco pelo SMART-COP':'Risco muito alto pelo SMART-COP';
    return result(total,label,'Integrar necessidade atual de suporte, evolução, comorbidades e objetivos de cuidado. Choque e insuficiência respiratória exigem atendimento independentemente da pontuação.',`Idade ${x.age}; corte FR=${x.age<=50?25:30}; soma dos oito componentes`,total>=5?'high':total>=3?'medium':'low',breakdown);
  },
  limits:'Prediz necessidade de suporte respiratório intensivo ou vasopressor (IRVS), não mortalidade individual. Contrato Charles/MDCalc: PAS <90 vale 2, pH arterial <7,35 vale 2; idade modifica apenas FR e oxigenação. Oxigenação é um critério composto de alternativas: não somar PaO₂, SaO₂ e P/F separadamente e não marcar “Não” quando a classificação não puder ser estabelecida. Não aplicar a imunossupressão significativa nem extrapolar automaticamente a COVID/SDRA ou pneumonia hospitalar. Escore baixo não autoriza alta, e alto não determina UTI isoladamente.',
  sources:[ref('MDCalc · SMART-COP · tabela completa Charles, editorial Jennifer Chen, MD · versão 1','https://www.mdcalc.com/calc/3914/smart-cop-score-pneumonia-severity')]
});
Object.assign(priorityById('glasgow-imrie'),{
  name:'Glasgow–Imrie · oito variáveis (LDH)',
  population:'Adultos com pancreatite aguda · avaliação em 48 horas',
  scope:'Pancreatite aguda confirmada em adulto. Variante de oito variáveis com LDH, sem AST alternativa: completar a avaliação após 48 h da admissão usando os valores mais anormais obtidos na janela inicial de 48 h. Esta ficha reproduz os limiares em unidades convencionais da tabela MDCalc; não mistura a variante que adiciona AST.',
  fields:[
    meta(y('window48','Janela inicial de 48 horas concluída e dados mais anormais disponíveis',1,'Não marcar “Sim” apenas para obter resultado; falência orgânica exige avaliação imediata antes de 48 h.')),
    y('pao2','PaO₂ <59,3 mmHg',1,'Limiar literal da variante editorial examinada, que publica 7,9 kPa como aproximação; não substituir por 60 mmHg nem converter um ponto de corte arredondado como se fosse exato.'),
    y('age','Idade >55 anos'),
    y('wbc','Leucócitos >15.000/µL (15 × 10⁹/L)'),
    y('calcium','Cálcio total <8 mg/dL'),
    y('urea','Nitrogênio ureico (BUN) >44,8 mg/dL',1,'Analito BUN. A fonte também publica ureia >16 mmol/L; ureia total em mg/dL não é BUN. Não usar o antigo limiar “ureia >45 mg/dL”.'),
    y('enzymes','LDH >600 U/L',1,'Somente LDH nesta variante de oito variáveis; AST >200 U/L não é substituto.'),
    y('albumin','Albumina <3,2 g/dL'),
    y('glucose','Glicose >180 mg/dL')
  ],
  compute:x=>{
    if(x.window48!==1)return {total:null,complete:false,errors:['window48'],displayValue:'Avaliação incompleta',label:'Glasgow–Imrie exige janela de 48 horas concluída',level:'medium',action:'Prosseguir avaliação clínica e de falência orgânica imediatamente; retomar a pontuação quando os dados da janela estiverem completos.',audit:'Janela de 48 h não confirmada',breakdown:[]};
    const ids=['pao2','age','wbc','calcium','urea','enzymes','albumin','glucose'];
    const breakdown=ids.map(id=>({label:priorityById('glasgow-imrie').fields.find(f=>f.id===id).label,points:x[id]}));
    const total=breakdown.reduce((sum,v)=>sum+v.points,0);
    return result(total,total>=3?'≥3 critérios · maior probabilidade de gravidade histórica':'<3 critérios nesta avaliação de 48 h','Integrar falência orgânica, evolução e complicações. O escore não define a classificação de Atlanta revisada nem autoriza tranquilização ou alta.', 'Soma dos oito componentes LDH; janela 48 h confirmada',total>=3?'high':'low',breakdown);
  },
  limits:'Variante de oito variáveis/LDH conforme MDCalc e tabela 1 de Chan/Shelat 2022, com limiares convencionais explicitados. Não acrescenta AST. PaO₂ <59,3 mmHg é o corte literal desta ficha; 7,9 kPa publicado é aproximado, não conversão exata. BUN, ureia e suas unidades não são intercambiáveis; confirmar o laudo antes de responder. Completar a janela de 48 h; não atrasar suporte em falência orgânica para aguardar escore. Dados não medidos não equivalem a zero. A gravidade histórica do estudo de 1984 não equivale automaticamente à definição atual de pancreatite grave por falência orgânica persistente.',
  sources:[ref('MDCalc · Glasgow–Imrie · variante de oito critérios/LDH, unidades e janela de 48 h · versão 1','https://www.mdcalc.com/calc/3287/glasgow-imrie-criteria-severity-acute-pancreatitis')]
});
Object.assign(priorityById('meld-na'),{
  name:'MELD-Na · histórico 2016',
  population:'Adultos com cirrose · fórmula histórica UNOS/OPTN de 2016',
  scope:'Reprodução descritiva da fórmula clássica MELD-Na de 2016 em adultos com cirrose/contexto hepatológico compatível. A referência editorial admite ≥12 anos, mas esta ficha preserva a finalidade adulta do projeto. Usar exames colhidos nas últimas 48 horas e após tratar condições agudas reversíveis, como peritonite bacteriana espontânea ou azotemia pré-renal, conforme o contrato examinado. Valores contemporâneos: bilirrubina e creatinina em mg/dL, sódio em mmol/L (numericamente mEq/L para Na⁺) e INR sem unidade. Não representa política atual de alocação ou MELD 3.0.',
  formula:'MELD(i)=10×arredondar à décima[0,957 ln(Cr)+0,378 ln(bili)+1,120 ln(INR)+0,643]. Só se MELD(i)>11: MELD-Na=MELD(i)+1,32×(137−Na)−0,033×MELD(i)×(137−Na). Arredondar o resultado final ao inteiro e limitar a 40.',
  compute:x=>{
    const bili=Math.max(1,x.bili),inr=Math.max(1,x.inr),creat=x.dialysis===1?4:Math.min(4,Math.max(1,x.creat)),na=Math.min(137,Math.max(125,x.sodium));
    const expression=.957*Math.log(creat)+.378*Math.log(bili)+1.120*Math.log(inr)+.643;
    const initial=Math.round(expression*10);
    const adjusted=initial>11?initial+1.32*(137-na)-.033*initial*(137-na):initial;
    const total=Math.min(40,Math.round(adjusted));
    return result(total,`MELD-Na histórico 2016: ${total} pontos`,'Usar para descrição/reprodutibilidade histórica, com avaliação hepatológica. Conferir fórmula e políticas vigentes do serviço de transplante; esta ficha não decide prioridade atual, inscrição ou exceções.',`bili=${bili}; INR=${inr}; Cr=${creat}; Na limitado=${na}; expressão=${expression.toFixed(6)}; MELD(i) arredondado=${initial}; ajuste Na=${initial>11?'aplicado':'não aplicado (MELD(i)≤11)'}; pré-arredondamento final=${adjusted.toFixed(6)}`,'medium');
  },
  limits:'Contrato histórico de 2016, obtido no documento editorial MDCalc; o PDF original OPTN não foi acessível nesta rodada e a política vigente pode usar MELD 3.0. Bilirrubina, INR e creatinina <1 usam 1; creatinina >4 ou ≥2 sessões de diálise nos 7 dias anteriores OU CVVHD por ≥24 h nos 7 dias anteriores usa 4. Na é limitado a 125–137. Primeiro arredondar a expressão à décima e multiplicar por 10; ajustar Na somente quando MELD(i)>11; arredondar o final e limitar a 40. Não misturar fórmula de Eurotransplant com Na até 140, MELD 3.0, exceções ou percentuais de mortalidade de outro contrato. INR por anticoagulante/interferência e condições fora da população exigem cautela.',
  sources:[ref('MDCalc · MELD Na (UNOS/OPTN) · contrato histórico janeiro de 2016 transcrito; editorial Pranav Patel, MD · versão 1','https://www.mdcalc.com/calc/78/meld-score-model-end-stage-liver-disease-12-older')]
});
priorityById('meld-na').fields.find(f=>f.id==='dialysis').label='≥2 diálises em 7 dias OU CVVHD por ≥24 h nos últimos 7 dias';
priorityById('meld-na').fields.find(f=>f.id==='dialysis').hint='Se qualquer uma das alternativas documentadas for verdadeira, usar creatinina 4 mg/dL. Confirmar duração e janela; não contar uma única sessão isolada como ≥2.';

}

{ // misc
// Soberania, rodada 2026-09-30T21:23:55Z: contratos operacionais identificados.
// Fragmento aplicado após as 53 declarações originais e antes da validação documental.
{
  const score=priorityById('lams');
  score.source_history=[...score.sources];
  score.name='LAMS · DHS Los Angeles 2025';
  score.scope='Suspeita pré-hospitalar de AVC. Versão do protocolo DHS Los Angeles, ref. 1232, revisão 01/07/2025. Calcular mesmo se a triagem mLAPSS for negativa quando a suspeita clínica permanecer; verificar glicemia e registrar o último momento conhecido sem déficit. Comparar força e movimento dos dois lados.';
  score.fields.find(f=>f.id==='face').hint='Solicitar sorriso ou movimento facial e identificar assimetria nova. Na afasia, encorajar o movimento por demonstração; evitar estímulos dolorosos.';
  score.fields.find(f=>f.id==='arm').hint='Braços a 90° e sustentados por 10 segundos, conforme scorecard SEO2021: sem queda=0; desce lentamente=1; cai rapidamente=2. O protocolo DHS permite comparar tônus/força passivamente quando não consegue executar a solicitação.';
  score.fields.find(f=>f.id==='grip').hint='Solicitar que aperte as mãos do examinador; comparar lados: normal=0, preensão reduzida=1, sem preensão=2.';
  score.bands=[b(3,'LAMS 0–3','medium','O valor não exclui AVC; comunicar achados e seguir o protocolo de transporte da rede local.'),b(5,'LAMS 4–5 · triagem positiva','high','Maior suspeita de oclusão de grande vaso; comunicar imediatamente à rede de AVC. O escore isolado não indica trombectomia nem determina destino fora de um protocolo local.')];
  score.limits='Instrumento motor de três itens, total 0–5. Pode não reconhecer afasia isolada, ataxia, vertigem ou apresentações de circulação posterior. A regra de transporte do condado de Los Angeles não é aplicada automaticamente no Brasil. Suspeita persistente exige avaliação mesmo com mLAPSS ou LAMS negativos. Não é uma confirmação de oclusão nem autorização de reperfusão.';
  score.sources=[ref('DHS Los Angeles · protocolo Stroke/CVA/TIA ref. 1232 · rev.01/07/2025','https://file.lacounty.gov/SDSInter/dhs/1040516_1232StrokeCVATIA.pdf'),ref('Southeastern Ontario Regional Stroke Network · LAMS scorecard · 13/01/2021','https://www.strokenetworkseo.ca/sites/default/files/files/lams_scorecard_for_south_east_8.5_x_5.5_print_version_jan_13_2021.pdf')];
}
{
  const score=priorityById('morse');
  score.source_history=[...score.sources];
  score.name='Morse · formulário LWW/SAGE';
  score.scope='Triagem de queda em adultos hospitalizados ou internados em cuidado prolongado. Versão educacional LWW S.5, adaptada com permissão SAGE; o PDF não informa data de revisão. Usar os seis itens completos e calibrar os cortes por unidade. Os cortes exibidos são o exemplo do formulário, não um protocolo universal vigente.';
  score.fields.find(f=>f.id==='history').label='Queda na internação, imediata ou nos últimos 3 meses';
  score.fields.find(f=>f.id==='history').hint='Uma primeira queda durante a internação muda este item imediatamente para 25; sem história pertinente=0.';
  score.fields.find(f=>f.id==='secondary').label='Mais de um diagnóstico médico no prontuário';
  score.fields.find(f=>f.id==='secondary').hint='Diagnóstico secundário significa mais de um diagnóstico médico registrado: sim=15, não=0.';
  score.fields.find(f=>f.id==='aid').hint='Sem dispositivo, assistência de enfermagem, cadeira de rodas ou repouso sem sair da cama=0; muleta/bengala/andador=15; sustenta-se no mobiliário ao caminhar=30.';
  score.fields.find(f=>f.id==='gait').hint='0: marcha habitual sem hesitação, ou repouso/imobilidade. 10: postura inclinada e passos curtos/arrastados, mas consegue erguer a cabeça sem perder equilíbrio. 20: dificuldade para levantar, olha para o chão e depende de apoio para se equilibrar/caminhar.';
  score.fields.find(f=>f.id==='mental').label='Avaliação própria da marcha incompatível com suas limitações';
  score.fields.find(f=>f.id==='mental').hint='Perguntar se consegue ir ao banheiro sozinho e comparar a resposta à capacidade/plano de assistência documentados. Resposta compatível=0; superestima a capacidade ou esquece limitações=15. Orientação no tempo/espaço isolada não define este item.';
  delete score.bands;
  score.compute=x=>{const total=Object.values(x).reduce((a,v)=>a+v,0);return result(total,total<=24?'Morse 0–24 · faixa inicial do exemplo':total<=50?'Morse 25–50 · baixo risco no exemplo':'Morse ≥51 · alto risco no exemplo','Aplicar prevenção básica a todos e intervenções aos fatores individuais; calibrar cortes e intensidade das medidas no protocolo da unidade.',Object.entries(x).map(([k,v])=>`${k}=${v}`).join('; '),total>=51?'high':total>=25?'medium':'low');};
  score.limits='Soma 0–125. O exemplo LWW/SAGE usa 0–24, 25–50 e ≥51, distinto de outros protocolos que usam 45. Não interpretar 0–24 como ausência de risco. Reavaliar na admissão, mudança de condição, transferência e após queda; delirium, fármacos e riscos ambientais exigem avaliação independente. Não misturar estes cortes com outra versão.';
  score.sources=[ref('LWW DocuCare · S.5 Morse Fall Scale · adaptado com permissão SAGE · instrumento e exemplo de cortes','https://download.lww.com/docucare/assets/morse-fall-scale.pdf'),ref('US Department of Veterans Affairs · Morse Fall Scale pocket card · avaliação por fatores','https://www.patientsafety.va.gov/docs/fallsToolkit/morse_falls_pocket_card.pdf')];
}
{
  const score=priorityById('frail-scale');
  score.source_history=[...score.sources];
  score.name='FRAIL · SLU-RGA 2016';
  score.subtitle='Triagem de fragilidade · variante SLU';
  score.population='Adultos mais velhos · triagem basal';
  score.scope='Questionário simples FRAIL da Rapid Geriatric Assessment da Saint Louis University, revisão 15/08/2016. Cada resposta positiva vale 1. Esta variante usa mais de cinco doenças, incapacidade para um quarteirão e perda >5% em seis meses; não é o contrato do estudo Morley 2012.';
  score.fields.find(f=>f.id==='fatigue').label='Apresenta fadiga?';
  score.fields.find(f=>f.id==='fatigue').hint='Pergunta simples da variante SLU-RGA 2016; não acrescentar o período de quatro semanas ou as categorias de frequência da versão 2012.';
  score.fields.find(f=>f.id==='resistance').label='Não consegue subir um lance de escadas?';
  score.fields.find(f=>f.id==='ambulation').label='Não consegue caminhar um quarteirão?';
  score.fields.find(f=>f.id==='illness').label='Tem mais de cinco doenças?';
  score.fields.find(f=>f.id==='illness').hint='Mais de cinco significa seis ou mais; exatamente cinco não pontua nesta variante. A fonte não impõe a lista de onze doenças da versão 2012.';
  score.fields.find(f=>f.id==='loss').label='Perdeu mais de 5% do peso nos últimos 6 meses?';
  score.fields.find(f=>f.id==='loss').hint='Usar o período de seis meses e desigualdade estrita >5%; exatamente 5% não pontua. Não substituir por doze meses.';
  score.bands=[b(0,'FRAIL 0 · nenhum critério nesta triagem','low','Reavaliar conforme evolução; zero não comprova ausência de vulnerabilidade.'),b(2,'FRAIL 1–2 · pré-fragilidade','medium','Avaliar funcionalidade, nutrição, mobilidade e causas reversíveis.'),b(5,'FRAIL 3–5 · fragilidade na triagem','high','Realizar avaliação geriátrica multidimensional e planejamento individualizado.')];
  score.limits='Variante institucional SLU-RGA 2016, com cinco perguntas próprias. Não atribuir a esta versão a validação quantitativa do Morley 2012 nem intercambiar cortes de doenças, distância ou período de peso. Não substitui avaliação geriátrica, cognição, nutrição e funcionalidade, nem deve definir limitações de cuidado.';
  score.sources=[ref('Saint Louis University · Rapid Geriatric Assessment · revisão 15/08/2016 · FRAIL','https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/aging-successfully/-pdf/rapid-geriatric-assessment.pdf')];
}
{
  const score=priorityById('braden');
  score.source_history=[...score.sources];
  score.name='Braden clássico · 1988';
  score.scope='Adultos: instrumento clássico de Braden e Bergstrom (1988), formulário 3166P R304 hospedado pelo Indiana Department of Health. Resumo operacional dos seis domínios; consultar o formulário institucional original para treinamento. Cinco domínios 1–4 e fricção/cisalhamento 1–3; total 6–23.';
  score.fields.find(f=>f.id==='sensory').hint='1: não reage à dor por rebaixamento/sedação, ou perda sensitiva na maior parte do corpo. 2: responde apenas à dor sem comunicar o desconforto além de gemido/agitação, ou limitação sensitiva em mais da metade do corpo. 3: responde à fala, mas nem sempre comunica necessidade de mudar posição, ou comprometimento em um/dois membros. 4: entende a fala e sente/comunica o desconforto sem déficit impeditivo.';
  score.fields.find(f=>f.id==='moisture').hint='1: pele úmida em praticamente toda mudança de posição. 2: umidade frequente exige troca de roupa de cama pelo menos uma vez por turno. 3: requer uma troca adicional aproximadamente diária. 4: pele habitualmente seca e trocas rotineiras.';
  score.fields.find(f=>f.id==='activity').hint='1: permanece no leito. 2: marcha muito limitada/ausente, sem sustentar o peso ou precisando de ajuda para a cadeira. 3: percursos curtos ocasionais, com ou sem ajuda; passa a maior parte do turno no leito/cadeira. 4: caminha fora do quarto ≥2 vezes/dia e dentro do quarto pelo menos a cada 2 h enquanto acordado.';
  score.fields.find(f=>f.id==='mobility').hint='1: não faz pequenas mudanças de posição sem ajuda. 2: mudanças pequenas ocasionais, sem conseguir movimentos frequentes/significativos sozinho. 3: pequenas mudanças frequentes independentes. 4: mudanças amplas e frequentes sem ajuda.';
  score.fields.find(f=>f.id==='nutrition').hint='1: não completa refeições; geralmente ≤1/3, proteína ≤2 porções/dia, baixa ingestão de líquidos e sem suplemento; OU jejum/líquidos claros/IV >5 dias. 2: raramente completa, cerca de 1/2, proteína 3 porções, suplemento ocasional; OU dieta líquida/enteral insuficiente. 3: ingere >1/2 da maioria, proteína 4 porções/dia e aceita suplemento quando precisa; OU enteral/NP que atende à maior parte das necessidades. 4: consome quase toda refeição, não recusa, proteína habitualmente ≥4 porções, lanches ocasionais e sem precisar de suplemento.';
  score.fields.find(f=>f.id==='friction').hint='1: ajuda moderada/máxima, difícil elevar sem arrastar, desliza com frequência ou apresenta fricção quase contínua por espasticidade/contratura/agitação. 2: mobilidade frágil/ajuda mínima, algum deslizamento da pele e mantém posição na maior parte do tempo. 3: movimenta-se e eleva o corpo sozinho, mantendo boa posição no leito/cadeira.';
  score.compute=x=>{const total=Object.values(x).reduce((a,v)=>a+v,0),label=total<=9?'Braden ≤9 · risco muito alto':total<=12?'Braden 10–12 · risco alto':total<=14?'Braden 13–14 · risco moderado':total<=18?'Braden 15–18 · risco leve':'Braden 19–23 · acima dos cortes do formulário';return result(total,label,'Planejar prevenção e reavaliação por domínio com inspeção da pele e protocolo da unidade; um total maior não elimina risco clínico.',Object.entries(x).map(([k,v])=>`${k}=${v}`).join('; '),total<=12?'high':total<=18?'medium':'low');};
  score.limits='Versão clássica 1988; não é Braden Scale II. Estes descritores são um resumo clínico factual, não reprodução do formulário autorizado para treinamento. Os cortes ≤9/10–12/13–14/15–18 pertencem ao formulário consultado. Contexto, perfusão, lesão existente e mudança clínica prevalecem; não usar o total para omitir prevenção, inspeção ou reposicionamento.';
  score.sources=[ref('Indiana Department of Health · Braden/Bergstrom 1988 · formulário 3166P R304, reimpresso com permissão','https://www.in.gov/health/files/Braden_Scale.pdf')];
}
{
  const score=priorityById('mews');
  score.source_history=[...score.sources];
  score.name='MEWS · LGH 2020';
  score.subtitle='Modified Early Warning System · variante histórica LGH';
  score.scope='Adultos hospitalizados: variante institucional histórica LGH, aula de Sue McDonald (data impressa 04/03/2020), hospedada na Penn Medicine. Utiliza PAS/FC/FR inteiras, temperatura registrada em °F com uma casa decimal e consciência. Não é o quadro original Subbe 2001 e não declara um protocolo vigente em 2026.';
  score.fields.find(f=>f.id==='temp').label='Temperatura (°F) · variante LGH';
  Object.assign(score.fields.find(f=>f.id==='temp'),{min:80,max:114,step:.1,hint:'Medida em °F registrada com uma casa decimal. Não inserir °C; não há conversão automática. Cortes publicados: <95/95,0–96,8/96,9–100,4/100,5–101,3/≥101,4°F.'});
  score.fields.find(f=>f.id==='sbp').hint='Quadro LGH: ≤70=3 ;71–80=2;81–100=1;101–159=0;160–199=1;200–220=2;>220=3. Valores inteiros em mmHg.';
  score.fields.find(f=>f.id==='hr').hint='Quadro LGH: ≤40=2;41–50=1;51–100=0;101–110=1;111–129=2;≥130=3. Valores inteiros em bpm.';
  score.fields.find(f=>f.id==='rr').hint='Quadro LGH: ≤7=2;8=1;9–17=0;18–20=1;21–29=2;≥30=3. Contagem inteira por minuto.';
  score.fields.find(f=>f.id==='avpu').label='Consciência · quadro LGH';
  score.fields.find(f=>f.id==='avpu').options=[{value:0,label:'Alerta'},{value:1,label:'Responde à fala'},{value:2,label:'Responde à dor'},{value:3,label:'Não responde'},{value:4,label:'Nova agitação ou nova confusão'}];
  score.fields.find(f=>f.id==='avpu').hint='Alerta=0; nova agitação/confusão ou resposta à fala=1; resposta à dor=2; sem resposta=3. Registrar situação basal e mudanças clínicas.';
  score.formula='Quadro LGH 2020: PAS+FC+FR+temperatura°F+consciência; total 0–14.';
  score.compute=x=>{const sbp=x.sbp<=70?3:x.sbp<=80?2:x.sbp<=100?1:x.sbp<=159?0:x.sbp<=199?1:x.sbp<=220?2:3,hr=x.hr<=40?2:x.hr<=50?1:x.hr<=100?0:x.hr<=110?1:x.hr<=129?2:3,rr=x.rr<=7?2:x.rr===8?1:x.rr<=17?0:x.rr<=20?1:x.rr<=29?2:3,temp=x.temp<95?2:x.temp<=96.8?1:x.temp<=100.4?0:x.temp<=101.3?1:2,loc=x.avpu===4?1:x.avpu,total=sbp+hr+rr+temp+loc,label=total<=1?'LGH 0–1 · faixa inicial':total<=3?'LGH 2–3 · faixa baixa':total<=6?'LGH 4–6 · faixa intermediária':total<=8?'LGH 7–8 · faixa alta':'LGH >8 · faixa crítica';return result(total,label,'Integrar preocupação clínica, fatores individuais e protocolo vigente da unidade. Os rótulos são do material histórico LGH 2020; não importam automaticamente a agenda de monitorização ou equipes da instituição.',`PAS=${sbp}; FC=${hr}; FR=${rr}; T°F=${temp}; consciência=${loc}`,total>=7?'high':total>=4?'medium':'low');};
  score.limits='Instrumento e gatilhos históricos LGH 2020. Exige todas as cinco medidas; não substituir dado ausente por zero. Não misturar com Subbe 2001, NEWS2 ou MEWS de outras instituições. Temperatura em °F, PAS/FC/FR inteiras e temperatura com uma decimal; o validador rejeita entradas de outra precisão. Um sinal grave ou preocupação clínica exige ação independente da soma. Não é estimativa universal de mortalidade, indicação de alta ou protocolo vigente brasileiro.';
  score.sources=[ref('Penn Medicine/LGH · Sue McDonald · Modified Early Warning System · aula datada 04/03/2020 · quadro e protocolo locais','https://www.med.upenn.edu/uphscovid19education/assets/user-content/documents/curricula/lgh-nursing-to-inpatient/modified-early-warning-system-(mews).pdf')];
}

}

{ // hip
// Contratos identificados por versão; contagem consultiva, sem probabilidades.
for (const id of ['kocher','kocher-caird']) {
  const score=priorityById(id),caird=id==='kocher-caird';
  score.name=caird?'Kocher–Caird · operacionalização 2022':'Kocher · formulário MDCalc examinado';
  score.population='Crianças com quadril agudamente doloroso';
  score.subtitle=caird?'Cinco critérios · variante publicada em 2022':'Quatro critérios · variante de formulário identificada';
  score.scope=caird
    ?'Contagem de cinco critérios com os comparadores explícitos das Tabelas 1–3 do estudo de Bisht et al. (2022), aplicado a crianças avaliadas por quadril irritável e submetidas a artrocentese. Esta ficha fica restrita ao quadril; não aplica a combinação ao joelho nem apresenta probabilidade individual.'
    :'Contagem de quatro critérios do formulário MDCalc de Kocher examinado em 30/09/2026, para crianças com quadril agudamente irritável no diagnóstico diferencial com sinovite transitória. O formulário usa VHS >40 mm/h; essa versão é identificada porque a derivação histórica de 1999 é também descrita com VHS ≥40 mm/h. Não intercambiar variantes nem atribuir os percentuais históricos a esta ficha.';
  score.fields=[
    meta(y('eligible','Contexto do quadril e dados completos confirmados',1,'Criança com quadril agudamente irritável; diagnóstico diferencial de artrite séptica/sinovite transitória. Não aplicar a outra articulação, não converter dado desconhecido em normal e não retardar avaliação urgente.')),
    meta(n('temp','Temperatura (°C)',25,45,0.1,'Um ponto somente se >38,5 °C. Registrar presença/história de febre e método da medida; em Caird a referência original especifica temperatura oral.')),
    meta(y('weight','Incapacidade ou recusa de apoiar o membro')),
    meta(n('esr','VHS (mm/h)',0,200,0.1,'Esta variante usa >40 mm/h: exatamente 40 não pontua. Não misturar com VHS ≥40 da descrição histórica.')),
    meta(n('wbc','Leucócitos sanguíneos (células/µL)',0,300000,1,'Um ponto somente se >12.000 células/µL. Células/µL e células/mm³ são numericamente iguais.'))
  ];
  if(caird)score.fields.push(meta(n('crp','PCR (mg/L)',0,1000,0.1,'Um ponto somente se >20 mg/L. Equivalência: 2 mg/dL =20 mg/L; exatamente 20 não pontua.')));
  score.max=caird?5:4;
  score.range=`0–${score.max}`;
  score.unit='critérios';
  score.resultScale=false;
  delete score.bands;
  score.formula='Um ponto por critério presente: T >38,5 °C; não apoiar; VHS >40 mm/h; leucócitos >12.000/µL'+(caird?'; PCR >20 mg/L.':'.');
  score.compute=x=>{
    if(!x.eligible)return {...result(null,'Não aplicável · contexto/dados não confirmados','Confirmar população, articulação e dados; suspeita de artrite séptica requer avaliação urgente independentemente da contagem.','elegibilidade não confirmada','high'),displayValue:'Não aplicável'};
    const parts=[['T >38,5',Number(x.temp>38.5)],['não apoiar',x.weight],['VHS >40',Number(x.esr>40)],['leucócitos >12.000',Number(x.wbc>12000)]];
    if(caird)parts.push(['PCR >20 mg/L',Number(x.crp>20)]);
    const total=parts.reduce((a,[,v])=>a+v,0);
    return result(total,`${total} de ${caird?5:4} critérios presentes`,'Integrar exame, evolução, imagem, microbiologia e avaliação ortopédica. Nenhuma contagem exclui artrite séptica ou autoriza alta, sobretudo em possível infecção por Kingella kingae.',parts.map(([k,v])=>`${k}=${v}`).join('; '),'medium',parts.map(([label,points])=>({label,points})));
  };
  score.limits='Formulário consultivo de contagem com versão explícita, sem probabilidade calibrada, categoria universal de risco, escolha de antibiótico ou decisão automática de artrocentese/alta. Não aplicar ao joelho nem a outra articulação. Os estudos diferem em comparadores e populações; não combinar versões. Crianças pequenas com Kingella kingae podem ter poucas alterações e poucos critérios: resultado zero ou baixo não exclui infecção. Osteomielite adjacente, trauma, imunossupressão e outros diagnósticos exigem avaliação específica. Dados desconhecidos não equivalem a ausência.';
  score.sources=caird
    ?[ref('Bisht et al. · estudo primário de Kocher modificado · 2022 · Tabelas 1–3','https://pmc.ncbi.nlm.nih.gov/articles/PMC9254023/'),ref('Caird et al. · derivação prospectiva 2006 · temperatura oral e PCR · PMID16757758','https://pubmed.ncbi.nlm.nih.gov/16757758/'),ref('De Marco et al. · Kingella e limitações dos critérios · estudo multicêntrico 2025','https://pmc.ncbi.nlm.nih.gov/articles/PMC12566418/')]
    :[ref('MDCalc · Kocher Criteria for Septic Arthritis · formulário examinado 30/09/2026','https://www.mdcalc.com/kocher-criteria-septic-arthritis'),ref('Bisht et al. · descrição dos critérios históricos e variante · 2022','https://pmc.ncbi.nlm.nih.gov/articles/PMC9254023/'),ref('De Marco et al. · Kingella e limitações dos critérios · estudo multicêntrico 2025','https://pmc.ncbi.nlm.nih.gov/articles/PMC12566418/')];
}

}

{ // sirs
// Aplicação PARCIAL: a fonte primária fecha 0–<1 ano e ≥2–<18 anos.
// A faixa 1–<2 anos permanece em quarentena porque não existe linha correspondente
// na tabela do consenso; não há interpolação. Phoenix permanece inalterado.
const sirs=priorityById('pediatric-sirs');
sirs.name='SIRS pediátrico · IPSCC 2005 · faixas tabeladas';
sirs.population='0–<1 ano e 2–<18 anos · critérios históricos verificados';
sirs.subtitle='Contagem histórica de resposta inflamatória · faixa restrita';
sirs.scope='Aplicação parcial dos critérios históricos IPSCC 2005 nas seis faixas efetivamente impressas na Table 3 do consenso original: 0–<1 semana, 1 semana–<1 mês, 1 mês–<1 ano, 2–5 anos, 6–12 anos e 13–<18 anos. A tabela salta de 1 mês–1 ano para 2–5 anos; por isso 1–<2 anos permanece não calculável, sem interpolação. Esta ficha não implementa Phoenix nem diagnostica a sepse pediátrica atual.';
sirs.fields=[
  meta(y('eligible','Faixa etária tabelada e dados/condições confirmados',1,'Faixa comprovada; temperatura central e médias de FC/FR medidas; hemograma e percentual de neutrófilos imaturos disponíveis. Não presumir ausência quando um critério/condição não foi avaliado. A faixa 1–<2 anos permanece fora desta versão.')),
  meta(s('age','Faixa etária IPSCC 2005',[[0,'0 dias–<1 semana'],[1,'1 semana–<1 mês'],[2,'1 mês–<1 ano'],[3,'1–<2 anos · sem linha na tabela'],[4,'2–5 anos'],[5,'6–12 anos'],[6,'13–<18 anos']],'Escolher a faixa pela idade cronológica real. A opção 1–<2 anos retorna não calculável porque a tabela original não publica limites para esse intervalo; não aproximar nem interpolar.')),
  meta(n('temp','Temperatura central (°C)',25,45,0.1,'Um critério se >38,5 ou <36 °C; exatamente 38,5 ou 36 não satisfazem o critério.')),
  meta(n('hr','Frequência cardíaca média (bpm)',10,300,0.1,'Taquicardia estrita: >180 até <1 ano; >140 aos 2–5; >130 aos 6–12; >110 aos 13–<18. Em menores de 1 ano, bradicardia estrita: <100 até <1 mês ou <90 de 1 mês–<1 ano.')),
  meta(y('hr_valid','Qualificadores clínicos da FC confirmados',1,'Taquicardia: média elevada sem estímulo externo, fármaco crônico ou dor, ou persistente por 0,5–4 h. Bradicardia em <1 ano: média baixa sem estímulo vagal externo, beta-bloqueador ou cardiopatia congênita, ou persistente por 0,5 h. Só o número de FC não confirma o componente.')),
  meta(n('rr','Frequência respiratória média (/min)',1,150,0.1,'Limites estritos por faixa: >50, >40, >34, >22, >18 e >14, respectivamente nas seis faixas calculáveis.')),
  meta(y('mv_acute','Ventilação mecânica por processo agudo qualificável',1,'Ventilação mecânica por processo agudo, não atribuída somente a doença neuromuscular subjacente ou anestesia geral. Não marcar Sim apenas pela presença de dispositivo.')),
  meta(n('wbc','Leucócitos sanguíneos (células/µL)',0,300000,1,'0–<1 semana: >34.000, sem limite inferior impresso; 1 semana–<1 mês: >19.500 ou <5.000; 1 mês–<1 ano: >17.500 ou <5.000; 2–5: >15.500 ou <6.000; 6–12: >13.500 ou <4.500; 13–<18: >11.000 ou <4.500. Igualdades não pontuam.')),
  meta(n('immature','Neutrófilos imaturos (%)',0,100,0.1,'Um componente leucocitário se >10%; exatamente 10% não satisfaz este critério. Registrar percentual realmente examinado.')),
  meta(y('chemo_leukopenia','Leucopenia atribuída à quimioterapia',1,'Uma contagem baixa explicada por leucopenia secundária à quimioterapia não satisfaz esse componente por si só. Leucocitose ou formas imaturas exigem interpretação do exame e contexto.'))
];
sirs.max=4;
sirs.range='0–4';
sirs.unit='critérios';
sirs.resultScale=false;
delete sirs.bands;
sirs.formula='Quatro componentes binários: temperatura; FC com qualificadores (taquicardia ou bradicardia apenas em <1 ano); FR/ventilação aguda; leucócitos/formas imaturas. SIRS histórico exige ≥2 componentes e obrigatoriamente temperatura ou leucócitos.';
sirs.compute=x=>{
  if(!x.eligible||x.age===3)return {...result(null,'SIRS histórico não aplicável · faixa ou dados não confirmados','Confirmar faixa/documentação e avaliar sinais clínicos sem aguardar a soma. A lacuna 1–<2 anos continua aberta; não adaptar os limiares por interpolação.','elegibilidade/faixa não confirmada','high'),displayValue:'Não aplicável'};
  const rows={0:[180,100,50,34000,null],1:[180,100,40,19500,5000],2:[180,90,34,17500,5000],4:[140,null,22,15500,6000],5:[130,null,18,13500,4500],6:[110,null,14,11000,4500]};
  const row=rows[x.age];
  const t=Number(x.temp>38.5||x.temp<36),hr=Number(!!x.hr_valid&&(x.hr>row[0]||(row[1]!==null&&x.hr<row[1]))),resp=Number(x.rr>row[2]||!!x.mv_acute),wbc=Number(x.wbc>row[3]||(row[4]!==null&&!x.chemo_leukopenia&&x.wbc<row[4])||x.immature>10);
  const total=t+hr+resp+wbc,qualifies=total>=2&&!!(t||wbc),parts=[{label:'Temperatura',points:t},{label:'FC qualificada',points:hr},{label:'FR/ventilação aguda',points:resp},{label:'Leucócitos/formas imaturas',points:wbc}];
  return result(total,qualifies?'SIRS histórico · critérios atendidos':'SIRS histórico · critérios não atendidos','Esta contagem não diagnostica nem exclui sepse. Integrar infecção, perfusão, disfunção orgânica e critérios pediátricos vigentes; sinais clínicos de alarme exigem avaliação imediata independentemente da soma.',`faixa IPSCC=${x.age}; FC>${row[0]}${row[1]===null?'':` ou <${row[1]}`}; FR>${row[2]}; WBC>${row[3]}${row[4]===null?'':` ou <${row[4]}`}; temperatura=${t}; FC=${hr}; respiratório=${resp}; leucócitos=${wbc}; requisito T/WBC=${!!(t||wbc)}`,'medium',parts);
};
sirs.limits='Instrumento histórico de resposta inflamatória, não definição atual de sepse, ferramenta de prognóstico, prescrição ou regra de alta. Faixas documentalmente aplicadas: 0–<1 ano e 2–<18 anos. A faixa 1–<2 anos permanece em quarentena porque não há linha correspondente na Table 3 original; não interpolar nem importar limites adultos. No recém-nascido de 0–<1 semana, a tabela não imprime limite leucocitário inferior e esta aplicação não inventa um. A fonte descreve temperatura central, médias fisiológicas, qualificadores de taquicardia/bradicardia, ventilação aguda e exclusão de leucopenia secundária à quimioterapia; dados ausentes não são normais. Pressão arterial não é um dos quatro critérios de SIRS. Dois critérios sem temperatura ou leucócitos não atendem o requisito histórico. A ausência de SIRS não exclui doença grave e sua presença pode ocorrer sem infecção.';
sirs.sources=[ref('Goldstein et al. · consenso internacional de sepse pediátrica · Table 2 e Table 3 · 2005','https://www.cpccrn.org/documents/PUD_CQI_definitions.pdf'),ref('Obonyo, Schlapbach e Fraser · Sepsis: Changing Definitions, Unchanging Treatment · 2019 · reprodução IPSCC','https://pmc.ncbi.nlm.nih.gov/articles/PMC6351458/'),ref('Miranda e Nadel · Pediatric Sepsis · 2023 · ≥2 e temperatura/leucócitos obrigatórios','https://pmc.ncbi.nlm.nih.gov/articles/PMC10169116/')];

}

{ // thompson
// Thompson 22: contrato da Table 1b/T2 da Turkish Neonatal Society Guideline, 2018.
// Fragmento seletivo para applyDocumentedOverrides; sem mudar motor, catálogo basal ou audiência.
const thompson=priorityById('thompson-hie');
thompson.name='Thompson · encefalopatia neonatal · TNS 2018';
thompson.population='Neonatologia · ≥35 semanas gestacionais · versão TNS 2018';
thompson.subtitle='Nove sinais clínicos; soma seriada de 0–22 pontos';
thompson.max=22;
thompson.range='0–22';
thompson.unit='pontos';
thompson.scope='Recém-nascidos de ≥35 semanas gestacionais com encefalopatia no período neonatal precoce, conforme a população descrita na diretriz TNS de 2018. Usar a tabela identificada de nove sinais para registrar o exame clínico seriado, com data/hora e intervenções em curso. A soma quantifica sinais e não confirma isoladamente etiologia hipóxico-isquêmica, prognóstico individual ou indicação de hipotermia.';
thompson.fields=[
  meta(y('eligible','População e nove sinais avaliáveis confirmados',1,'Recém-nascido de ≥35 semanas gestacionais com encefalopatia no período neonatal precoce; os nove sinais foram efetivamente examinados e a frequência de convulsões foi documentada. Fora desse escopo, ou com sinal não avaliável/desconhecido, selecionar Não e não presumir normalidade.')),
  s('tone','Tônus',[[0,'Normal'],[1,'Hipertonia'],[2,'Hipotonia'],[3,'Flácido']]),
  s('conscious','Consciência',[[0,'Normal'],[1,'Hiperalerta'],[2,'Letárgico'],[3,'Comatoso']]),
  s('seizure','Convulsões por dia',[[0,'Nenhuma'],[1,'1–2 por dia (<3)'],[2,'≥3 por dia (>2)']],'A tabela usa none / <3 per day / >2 per day. Nenhuma = 0; 1 ou 2 episódios = 1 ponto; exatamente 3 ou mais = 2 pontos. Não converter frequência desconhecida em ausência nem usar a categoria para dispensar EEG ou tratamento.'),
  s('posture','Postura',[[0,'Normal'],[1,'Punhos fechados ou movimentos de ciclagem'],[2,'Flexão distal'],[3,'Descerebração']]),
  s('moro','Reflexo de Moro',[[0,'Normal'],[1,'Parcial'],[2,'Ausente']]),
  s('grasp','Preensão',[[0,'Normal'],[1,'Fraca'],[2,'Ausente']]),
  s('suck','Sucção',[[0,'Normal'],[1,'Fraca'],[2,'Ausente']]),
  s('resp','Respiração',[[0,'Normal'],[1,'Hiperventilação'],[2,'Apneia'],[3,'Suporte respiratório (tabela TNS)']],'Versão TNS 2018: normal / hyperventilation / apnea / respiratory support. O descritor de 3 pontos é suporte respiratório; não foi restringido a ventilação invasiva. Registrar o suporte em curso e não intercambiar descritores de outras variantes.'),
  s('fontanel','Fontanela',[[0,'Normal'],[1,'Cheia'],[2,'Tensa']])
];
delete thompson.bands;
thompson.formula='Soma dos nove sinais: tônus 0–3, consciência 0–3, convulsões 0–2, postura 0–3, Moro 0–2, preensão 0–2, sucção 0–2, respiração 0–3 e fontanela 0–2. Faixa 0–22; elegibilidade não pontua.';
thompson.compute=x=>{
  if(!x.eligible)return {...result(null,'Thompson não aplicável · população ou exame não confirmado','Confirmar idade gestacional, contexto e observação dos nove sinais; não preencher dado desconhecido como normal. Avaliar e tratar prontamente os sinais clínicos de alarme.','elegibilidade/exame não confirmado','high'),displayValue:'Não aplicável'};
  const keys=['tone','conscious','seizure','posture','moro','grasp','suck','resp','fontanel'];
  const total=keys.reduce((sum,key)=>sum+x[key],0);
  return result(total,'Thompson · soma clínica seriada (TNS 2018)','Registrar data/hora, componentes e tendência; integrar exame neonatal, gasometria, EEG/aEEG e imagem conforme contexto. Convulsões, apneia ou coma exigem avaliação neonatal imediata. Não aguardar ou usar esta soma isoladamente para decidir hipotermia.',keys.map(key=>`${key}=${x[key]}`).join('; '),'medium');
};
thompson.action='Registrar exame e tendência seriados; integrar avaliação neonatal e exames complementares. Não definir conduta ou prognóstico individual pela soma isolada.';
thompson.limits='Contrato identificado da Table 1b da diretriz TNS 2018; nove sinais e máximo 22. Não corresponde à variante modificada de máximo 13. Não são apresentadas bandas universais leve/moderado/grave nem percentual de risco: tabela e população não validam essa conversão automática. A confirmação de etiologia e a elegibilidade para hipotermia têm critérios próprios e dependem de protocolo vigente; a consulta desta versão histórica não define tratamento atual. Sedação, bloqueio neuromuscular, suporte respiratório e condições que impeçam exame devem ser documentados; sinal não avaliável mantém o resultado não aplicável. Ausência de convulsões observadas ou soma baixa não exclui crises subclínicas/evolução de encefalopatia. Não atrasar avaliação/tratamento de emergência nem neuroproteção quando indicada.';
thompson.sources=[ref('Akisu, Kumral e Canpolat · Turkish Neonatal Society Guideline · Table 1b/T2 · 2018','https://pmc.ncbi.nlm.nih.gov/articles/PMC6568287/')];

}

{ // psofa
// pSOFA integral: fonte original2017 relida; fronteiras ambíguas não calculáveis.
// Este bloco não implementa extração EHR, imputação ou categorias fracionárias.
const psofa=priorityById('psofa');
const psofaMeta=f=>({...f,noPoints:true});
const psofaIncomplete=(reason)=>({total:null,breakdown:[],context_error:reason,status:'NAO_CALCULAVEL',displayValue:'Não avaliável',label:'pSOFA não confirmado',level:'medium',action:'Completar a classificação e o contexto documental; não atribuir zero a dado ausente.',audit:reason});
const psofaAgeIndex=months=>months<1?0:months<12?1:months<24?2:months<60?3:months<144?4:months<=216?5:6;
const psofaCreatBreaks=[[.8,1,1.2,1.6],[.3,.5,.8,1.2],[.4,.6,1.1,1.5],[.6,.9,1.6,2.3],[.7,1.1,1.8,2.6],[1,1.7,2.9,4.2],[1.2,2,3.5,5]];
Object.assign(psofa,{
 name:'pSOFA integral · Matics 2017',population:'UTI pediátrica · 0–252 meses',range:'0–24',max:24,unit:'pontos',resultScale:true,
 scope:'Contrato manual integral do pSOFA 2017 para idade de0–252 meses: usar os piores valores de cada um dos seis órgãos em uma mesma janela de 24 h e Glasgow pediátrico efetivamente examinado. A tabela primária exige suporte respiratório documentado apenas para as categorias respiratórias3–4; não o restringe a ventilação invasiva e não define modalidades específicas. As categorias0–2 dependem do índice e podem ser classificadas mesmo quando o estado de suporte não foi documentado. Confirmar elegibilidade, índice, unidades e contexto; PAM e creatinina são classificadas por idade. A tabela primária repete S/F=264 em duas categorias e não classifica bilirrubina=12,0 mg/dL. Esses valores exatos retornam não calculável; não adotar limites de outro algoritmo como errata do original.',
 fields:[
  psofaMeta(s('eligible','População/contexto confirmados?',[[0,'Não confirmado ou fora do escopo'],[1,'Paciente criticamente enfermo≤21 anos em UTI pediátrica']])),
  psofaMeta(s('window','Piores valores dos seis órgãos em uma mesma janela de 24 h confirmados?',[[0,'Não confirmado'],[1,'Sim · janela e registros conferidos']])),
  psofaMeta(s('units_confirmed','Unidades e possibilidade de exame dos seis órgãos confirmadas?',[[0,'Não confirmado / campo ou Glasgow não examinável'],[1,'Sim · unidades originais e exame confirmados']],'Confirmar PaO₂ em mmHg, FiO₂ em fração no índice, SpO₂ em percentual quando S/F, plaquetas em × 10³/µL, bilirrubina/creatinina em mg/dL, PAM em mmHg e vasoativos em µg/kg/min. Não transformar ausência ou Glasgow não testável em valor numérico.')),
  psofaMeta(n('age','Idade em meses',0,252,.01,'Usar idade cronológica confirmada; limites: <1; 1–<12; 12–<24; 24–<60; 60–<144; 144–216; >216 meses. Escopo conservador desta interface:0–252 meses, sem presumir que21 anos significa anos completos.')),
  psofaMeta(s('basis','Índice respiratório e unidades confirmados?',[[-1,'Não confirmado'],[0,'P/F · PaO₂ arterial em mmHg / FiO₂ em fração'],[1,'S/F · SpO₂ em percentual / FiO₂ em fração']])),
  psofaMeta(n('ratio','Índice P/F ou S/F conferido',0,5000,.01,'Valor já calculado com medidas contemporâneas. Ex.: PaO₂80 mmHg/FiO₂0,40=P/F 200 mmHg. S/F 94/0,50=188. Não inserir FiO₂40 no denominador nem trocar PaO₂kPa por mmHg.')),
  psofaMeta(s('sf_valid','Se S/F: SpO₂≤97% e oximetria/FiO₂ confirmadas?',[[0,'Não confirmado, SpO₂>97% ou não se aplica a P/F'],[1,'Sim · SpO₂≤97% e medidas contemporâneas confirmadas']])),
  psofaMeta(s('resp_support','Suporte respiratório documentado?',[[0,'Ausência de suporte respiratório confirmada'],[1,'Suporte respiratório presente e confirmado'],[2,'Estado de suporte não documentado / desconhecido']],'A tabela original escreve “com suporte respiratório” nas categorias3/4 e não restringe o termo a ventilação invasiva nem enumera modalidades. Categorias0–2 não dependem desse requisito. Para categorias3/4, selecionar Presente somente quando algum suporte respiratório em curso estiver documentado; ausência ou estado desconhecido impedem o cálculo. Não inferir suporte pelo valor do índice.')),
  psofaMeta(s('resp','Categoria respiratória pré-classificada e conferida',[[0,'0: P/F ≥400 ou S/F ≥292'],[1,'1: P/F300–399 ou S/F >264 a <292'],[2,'2: P/F200–299 ou S/F221–<264'],[3,'3: P/F 100–199 ou S/F 148–220, COM suporte respiratório'],[4,'4: P/F<100 ou S/F<148, COM suporte respiratório']],'Faixas operacionais conferidas pelo índice; S/F=264 não calculável por ambiguidade da fonte primária: P/F[400,∞),[300,400),[200,300),[100,200),<100; S/F[292,∞),(264,292),[221,264),[148,221),<148. Não arredondar para escolher categoria.')),
  psofaMeta(s('resp_checked','Categoria respiratória e limitações efetivamente conferidas?',[[0,'Não confirmado'],[1,'Sim · índice, unidade, saturação quando S/F e suporte conferidos']])),
  psofaMeta(n('platelets','Plaquetas (× 10³/µL, numericamente igual a× 10⁹/L)',0,5000,.01,'0≥150; 1:[100,150); 2:[50,100); 3:[20,50); 4:<20. Ex.:150.000/µL=150 × 10³/µL, não 150.000 neste campo.')),
  psofaMeta(n('bilirubin','Bilirrubina total (mg/dL)',0,200,.01,'0:<1,2; 1:[1,2,2); 2:[2,6); 3:[6,12); 4:>12,0. Exatamente 12,0 não calculável: a tabela primária não classifica essa igualdade. Não inserir µmol/L.')),
  psofaMeta(n('map','Menor PAM (mmHg)',0,250,.01,'Sem infusão qualificante, recebe 1 se PAM<46/55/60/62/65/67/70 conforme sete faixas etárias; igualdade recebe 0. Não inserir PAS como PAM.')),
  psofaMeta(s('vaso','Categoria vasoativa documentada (µg/kg/min)',[[-1,'Não confirmado'],[0,'Nenhuma infusão qualificante'],[2,'2: dopamina>0 a≤5 OU dobutamina>0, por≥1 h contínua'],[3,'3: dopamina>5 a≤15 OU epinefrina/norepinefrina>0 a≤0,1, por≥1 h contínua'],[4,'4: dopamina>15 OU epinefrina/norepinefrina>0,1, por≥1 h contínua']],'Escolher a maior categoria documentada em uma infusão contínua de pelo menos 1 h. Doses em µg/kg/min, não µg/min nem mL/h. Infusão ausente não é uma dose zero de epinefrina/norepinefrina que receba 3. Não somar episódios curtos para obter 1 h.')),
  psofaMeta(n('vaso_hours','Duração contínua comprovada da categoria vasoativa escolhida (horas)',0,24,.01,'Quando vaso=0, registrar 0. Para categorias 2–4, exigir≥1,00 h contínua; 0,99 h não basta. Não é cálculo nem recomendação de dose.')),
  psofaMeta(n('gcs','Glasgow pediátrico examinado',3,15,1,'15→0; 13–14→1; 10–12→2; 6–9→3; 3–5→4. Registrar limitações por sedação, bloqueio e deficiência basal; se não testável, não calcular.')),
  psofaMeta(n('creatinine','Creatinina sérica (mg/dL)',0,100,.001,'Limiares para pontos 1/2/3/4, por idade: <1 m:0,8/1,0/1,2/1,6; 1–<12 m:0,3/0,5/0,8/1,2; 12–<24 m:0,4/0,6/1,1/1,5; 24–<60 m:0,6/0,9/1,6/2,3; 60–<144 m:0,7/1,1/1,8/2,6; 144–216 m:1,0/1,7/2,9/4,2; >216 m:1,2/2,0/3,5/5,0. Não inserir µmol/L (conversão documental:÷88,4).'))
 ],
 formula:'Soma de seis subscores inteiros 0–4: respiratório, coagulação, hepático, cardiovascular, neurológico e renal. Categoria respiratória manual conferida; demais conforme dados/categoria documentados. Não fornece probabilidade de morte.',
 compute:x=>{
  const required=['eligible','window','units_confirmed','age','basis','ratio','sf_valid','resp_support','resp','resp_checked','platelets','bilirubin','map','vaso','vaso_hours','gcs','creatinine'];
  if(required.some(k=>typeof x[k]!=='number'||!Number.isFinite(x[k])))return psofaIncomplete('Dado ausente/inválido: não imputado.');
  if(x.eligible!==1||x.window!==1||x.units_confirmed!==1||x.resp_checked!==1)return psofaIncomplete('Elegibilidade, janela 24 h, unidades/exame ou pré-classificação respiratória não confirmados.');
  if(x.age<0||x.age>252||![0,1].includes(x.basis)||x.ratio<0||![0,1,2].includes(x.resp_support)||![0,1,2,3,4].includes(x.resp)||![-1,0,2,3,4].includes(x.vaso)||x.vaso<0||x.vaso_hours<0||x.vaso_hours>24||x.platelets<0||x.bilirubin<0||x.map<0||x.creatinine<0||!Number.isInteger(x.gcs)||x.gcs<3||x.gcs>15)return psofaIncomplete('Dados fora do contrato ou categoria vasoativa não confirmada.');
  if(x.basis===1&&x.sf_valid!==1)return psofaIncomplete('S/F exige SpO₂≤97% e medidas contemporâneas confirmadas.');
  if(x.bilirubin===12||(x.basis===1&&x.ratio===264))return psofaIncomplete('Fronteira ambígua na tabela primária de 2017: S/F=264 ou bilirrubina=12,0 mg/dL. Não atribuir pontuação sem contrato original inequívoco.');
  const r=x.ratio,resp=x.basis===0?(r>=400?0:r>=300?1:r>=200?2:r>=100?3:4):(r>=292?0:r>=264?1:r>=221?2:r>=148?3:4);
  if(resp!==x.resp)return psofaIncomplete('Categoria respiratória selecionada diverge do índice conferido.');
  if(resp>=3&&x.resp_support!==1)return psofaIncomplete('Categorias respiratórias3/4 exigem suporte respiratório presente e documentado. Ausência ou estado desconhecido impedem o cálculo.');
  if(x.vaso>0&&x.vaso_hours<1)return psofaIncomplete('Infusão da categoria escolhida não completou 1 h contínua. Não somar episódios.');
  if(x.vaso===0&&x.vaso_hours!==0)return psofaIncomplete('Vaso=0 exige duração 0; reconciliar categoria/duração.');
  const i=psofaAgeIndex(x.age),coag=x.platelets>=150?0:x.platelets>=100?1:x.platelets>=50?2:x.platelets>=20?3:4,hep=x.bilirubin<1.2?0:x.bilirubin<2?1:x.bilirubin<6?2:x.bilirubin<12?3:4,cv=x.vaso>0?x.vaso:x.map<[46,55,60,62,65,67,70][i]?1:0,neu=x.gcs===15?0:x.gcs>=13?1:x.gcs>=10?2:x.gcs>=6?3:4,renal=psofaCreatBreaks[i].filter(cut=>x.creatinine>=cut).length;
  const parts=[resp,coag,hep,cv,neu,renal],total=parts.reduce((a,v)=>a+v,0);
  return result(total,'pSOFA: '+total+' pontos','Registrar a evolução da disfunção; integrar exame e contexto. Não diagnostica sepse nem indica tratamento ou mortalidade individual.',`Resp=${resp}; coagulação=${coag}; hepático=${hep}; cardiovascular=${cv}; Glasgow=${neu}; renal=${renal}; idade=${x.age}meses; janela24h confirmada; sem imputação.`,'medium',parts.map((points,j)=>({label:['Respiratório','Coagulação','Hepático','Cardiovascular','Neurológico','Renal'][j],points})));
 },
 action:'Registrar a evolução dos seis órgãos em contexto clínico; não usar como prescrição, detector precoce ou definição autônoma de sepse.',
 limits:'Versão clínica manual integral para idade de0–252 meses, separada de extração automática de EHR. Original 2017: pacientes criticamente enfermos≤21 anos; piores valores em 24 h; SpO₂≤97% para S/F; suporte respiratório documentado nas categorias3/4; infusão vasoativa contínua≥1 h; Glasgow pediátrico. A fonte não restringe “suporte respiratório” a ventilação invasiva nem enumera dispositivos: esta ficha confirma presença, sem atribuir modalidade inexistente na tabela. Categorias0–2 não exigem confirmação do suporte; categorias3/4 ficam não calculáveis quando suporte está ausente ou desconhecido. A ficha exige os demais dados e confirmações: não adota a imputação normal/zero empregada na pesquisa original, nem categorias respiratórias 2,5/3,5 ou heurísticas para dados ausentes do código Boston. A releitura integral da tabela primária confirmou sobreposição em S/F=264 e lacuna em bilirrubina=12,0. Essas igualdades ficam não calculáveis; o código Boston posterior não é errata nem corrige a fonte original nesta interface. Não fornece mortalidade individual, probabilidade universal, diagnóstico de sepse ou substitui definição pediátrica vigente/avaliação profissional. Não alterar suporte, medicação ou dose para obter um escore. Em estudo observacional de uma UTI pediátrica quaternária, o pSOFA eletrônico associou-se a eventos críticos subsequentes, mas não mostrou desempenho adequado para orientar sozinho a vigilância clínica. Essa evidência de 2025 não valida o cálculo manual desta ficha nem resolve as fronteiras ambíguas da tabela de 2017.',
 sources:[ref('Matics e Sanchez-Pinto · pSOFA original 2017 · tabela 1 e notas','https://pmc.ncbi.nlm.nih.gov/articles/PMC6583375/'),ref('Boston Children’s · laboratório Akhondi-Asl · fonte autoral pSOFA','https://labs.childrenshospital.org/akhondi-asl/software/psofa'),ref('Código autoral pSOFA · commit c60137de9ee805af456f9548d0dac16534d5fdce · fronteiras e faixas etárias','https://github.com/alireza-akhondi-asl/pSOFA/tree/c60137de9ee805af456f9548d0dac16534d5fdce'),ref('Akhondi-Asl et al. · validação do algoritmo 2024 · somente resumo aberto','https://doi.org/10.1097/PCC.0000000000003458'),ref('Badke et al. · pSOFA eletrônico e eventos críticos em UTI pediátrica · estudo2025 · resumo original','https://journals.sagepub.com/doi/10.1177/08850666241307630')]
});
delete psofa.bands;

}
}
