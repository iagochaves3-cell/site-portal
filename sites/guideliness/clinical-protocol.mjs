export const revision = '08/10/2026';
export const sources = [
  ['SBP · Pneumonia não complicada · 2022', 'https://www.sbp.com.br/fileadmin/user_upload/23358c-DC-Pneumonias_Adquiridas_Nao_Complicadas.pdf'],
  ['Royal Children’s Hospital · Bronchiolitis · 2023', 'https://www.rch.org.au/clinicalguide/guideline_index/Bronchiolitis/'],
  ['NICE NG9 · Bronquiolite · atualização 2021', 'https://www.nice.org.uk/guidance/ng9/chapter/recommendations'],
  ['SBP · Pneumonia complicada · 2024', 'https://www.sbp.com.br/fileadmin/user_upload/24347d-DC_PneumoniaAdquiridas_ComunidadeComplicada-Atualiza2024.pdf'],
  ['GSK · Salbutamol aerossol · bula profissional', 'https://br.gsk.com/media/5wtj4ekh/aerolin-spray.pdf'],
  ['Hospital Sírio-Libanês · Salbutamol · guia farmacêutico', 'https://guiafarmaceutico.hsl.org.br/salbutamol'],
  ['GSK · Amoxicilina 250 e 500 mg/5 mL · bula 2025', 'https://br.gsk.com/media/6249/amoxil-suspens%C3%A3o-oral.pdf'],
  ['Eurofarma · Amoxicilina 400 mg/5 mL · bula profissional', 'https://eurofarma.com.br/produtos/bulas/healthcare/pt/bula-sinot-po.pdf'],
  ['Blau · Ampicilina (Cilinon) · bula profissional', 'https://www.blau.com/media/leaflet/d28e5055-0ebe-4896-910c-784055a9f9a5-7df174b1-0e88-498e-af44-9620180397d0/Cilino_lbGiVdo.pdf'],
  ['Blau · Ceftriaxona · bula atualizada em 25/03/2026', 'https://www.blau.com/media/leaflet/ff29a2f2-2dba-41de-bafe-b2dcf0981f11-41d1e49d-7ee1-4cf9-be95-7b11dca4b625/Ceftri_9uoMT45.pdf'],
  ['NICE NG250 · Pneumonia · 2025', 'https://www.nice.org.uk/guidance/NG250/chapter/recommendations'],
  ['Canadian Paediatric Society · Exacerbação de asma · 2021', 'https://cps.ca/en/documents/position/managing-an-acute-asthma-exacerbation']
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const fmt = (n, digits = 2) => n.toLocaleString('pt-BR', {maximumFractionDigits:digits});
const ul = items => '<ul>' + items.map(s => `<li>${s}</li>`).join('') + '</ul>';
const table = (headers, rows) => `<div class="clinical-table"><table><thead><tr>${headers.map(s=>`<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>'<tr>'+r.map(s=>`<td>${s}</td>`).join('')+'</tr>').join('')}</tbody></table></div>`;
const ref = ids => `<p class="clinical-refs">Fontes: ${ids.map(i=>`<a href="#clinical-source-${i}">[${i}] ${esc(sources[i-1][0])}</a>`).join(' · ')}</p>`;

export function parseWeight(input) {
  const raw = String(input ?? '').trim().replace(/\s*kg$/i,'').trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(raw)) return null;
  const weight = Number(raw.replace(',','.'));
  return Number.isFinite(weight) && weight > 0 && weight <= 40 ? weight : null;
}
export function ageInMonths(value) {
  const age = norm(value).trim();
  if (!age || /[-−]/.test(age)) return null;
  const tokens = [...age.matchAll(/(\d+(?:[.,]\d+)?)\s*(anos?|a\b|mes(?:es)?|m\b|dias?|d\b)/g)];
  if (!tokens.length) return null;
  const rest = age.replace(/(\d+(?:[.,]\d+)?)\s*(anos?|a\b|mes(?:es)?|m\b|dias?|d\b)/g,'').replace(/\s|,|\be\b/g,'');
  if (rest) return null;
  return tokens.reduce((sum,m)=>sum+Number(m[1].replace(',','.'))*(m[2].startsWith('a')?12:m[2].startsWith('d')?1/30.4375:1),0);
}
export function calculateDoses(weight) {
  if (!Number.isFinite(weight) || weight <= 0 || weight > 40) throw new Error('Peso fora do escopo do módulo de lactentes.');
  const amoxicillin = Math.min(weight*25,2000);
  const ampicillin = Math.min(weight*50,3000);
  const ceftriaxone = weight*50;
  return {weight, amoxicillin, amoxicillinDaily:amoxicillin*2,
    amox50:amoxicillin/50, amox80:amoxicillin/80, amox100:amoxicillin/100,
    ampicillin, ampicillinConcentration:1000/3.4, ampicillinVolume:ampicillin/(1000/3.4),
    ceftriaxone, ceftriaxoneConcentration:1000/10.72, ceftriaxoneVolume:ceftriaxone/(1000/10.72),
    ceftriaxoneFinalVolume:ceftriaxone/50, ceftriaxoneRate:(ceftriaxone/50)/0.5};
}
export function readVitals(input) {
  const text = norm(input.context);
  const patterns = {spo2:/(?:spo2|sat(?:uracao)?)\s*[:=]?\s*(\d{2,3})(?:\s*%|\b)/,
    pulse:/\bfc\s*[:=]?\s*(\d{2,3})/, rr:/\bfr\s*[:=]?\s*(\d{1,3})/};
  const limits = {spo2:[1,100],pulse:[20,300],rr:[1,150]};
  const result = {inferred:[],air:/(?:\bar\s*ambiente\b|\baa\b|%\s*em\s*aa)/.test(text)};
  for (const key of Object.keys(patterns)) {
    const explicit = String(input[key] ?? '').trim();
    const match = text.match(patterns[key]);
    const raw = explicit || (match && match[1]);
    const n = raw && /^\d+(?:[.,]\d+)?$/.test(raw) ? Number(raw.replace(',','.')) : null;
    result[key] = n !== null && n >= limits[key][0] && n <= limits[key][1] ? n : null;
    if (!explicit && result[key] !== null) result.inferred.push(key);
  }
  return result;
}

function dosingContent(data, months) {
  const weight = parseWeight(data.weight);
  const eligible = months !== null && months >= 2 && months < 24 && weight !== null;
  const d = eligible ? calculateDoses(weight) : null;
  const dose = (key, unit='mg') => d ? `<strong>${fmt(d[key])} ${unit}</strong>` : 'cálculo após idade e peso';
  let html = `<p><strong>Esquemas alternativos, conforme diagnóstico e via tolerada. Não associar os três antibióticos automaticamente.</strong> Cálculos para 2 a &lt;24 meses; doses totais dependem do peso, não de um caso fixo; não contemplam insuficiência renal, meningite, sepse ou infecção complicada.</p>`;
  html += d ? `<p class="dose-basis">Peso informado: <strong>${fmt(weight)} kg</strong>. Valores exatos abaixo; arredondamento de administração depende da seringa e da conferência do profissional.</p>` : '<p class="notice">Informe idade em meses/anos e peso válido para os totais em mg e mL. Os esquemas de referência continuam disponíveis abaixo.</p>';
  html += table(['Medicamento / indicação','Regime de referência','Dose e apresentação'],[
    ['<strong>Amoxicilina VO</strong><br>Pneumonia bacteriana sem complicações, criança estável e tolerando via oral. Não é tratamento isolado suficiente para uma criança hipoxêmica sem avaliação hospitalar.',
      '25 mg/kg/dose de 12/12 h (= 50 mg/kg/dia). SBP: 7 dias, reavaliar em 48–72 h. Máximo do regime: 4 g/dia (2 g/dose). Dose protocolar; duração individualizada conforme evolução.',
      `${dose('amoxicillin')} por dose; ${dose('amoxicillinDaily')} por dia.<br>250 mg/5 mL = 50 mg/mL: ${dose('amox50','mL')}/dose.<br>400 mg/5 mL = 80 mg/mL: ${dose('amox80','mL')}/dose.<br>500 mg/5 mL = 100 mg/mL: ${dose('amox100','mL')}/dose.<br>Escolher UMA apresentação.`],
    ['<strong>Ampicilina IV</strong><br>Primeira linha hospitalar quando pneumonia bacteriana, necessidade de via IV e cobertura pneumocócica apropriada.',
      '50 mg/kg/dose de 6/6 h (= 200 mg/kg/dia). Teto SBP hospitalar: 12 g/dia. Rever diariamente e trocar para VO após estabilização; duração total segundo diagnóstico e resposta.',
      `${dose('ampicillin')} por dose.<br>Exemplo específico: Cilinon 1 g, adicionar 3 mL de água para injetáveis → volume final 3,4 mL → 294,12 mg/mL. Aspirar ${dose('ampicillinVolume','mL')}. IV lenta; bula do frasco de 1 g: 10–15 min. Não extrapolar esse preparo para outro fabricante.`],
    ['<strong>Ceftriaxona IV</strong><br>Alternativa hospitalar quando maior gravidade, vacinação incompleta ou necessidade de espectro ampliado; não automática para toda PAC.',
      'Regime inicial selecionado: 50 mg/kg/dose de 24/24 h (até 2 g/dia neste esquema). Bula pediátrica geral: 20–80 mg/kg/dia, não usar o limite inferior como dose de PAC. Infundir ≥30 min. PAC complicada tem regime próprio.',
      `${dose('ceftriaxone')} por dose. Frasco IV 1 g + 10 mL água para injetáveis → 10,72 mL finais, 93,28 mg/mL (Blau). Aspirar ${dose('ceftriaxoneVolume','mL')}. Não usar diluente IM com lidocaína na veia.`]
  ]);
  if (d) {
    html += `<h5>Ceftriaxona — preparo calculado e bomba</h5><p>Para ${fmt(d.ceftriaxone)} mg: retirar ${fmt(d.ceftriaxoneVolume,3)} mL da solução de 93,28 mg/mL e completar com SF 0,9% até <strong>${fmt(d.ceftriaxoneFinalVolume)} mL finais</strong> (adicionar ${fmt(d.ceftriaxoneFinalVolume-d.ceftriaxoneVolume,3)} mL). Concentração final: 50 mg/mL. Administrar em 30 minutos a <strong>${fmt(d.ceftriaxoneRate)} mL/h</strong>. É infusão intermitente, não BIC.</p><details><summary>Conferência matemática e reversa</summary>${ul([
      `Amoxicilina: 25 × ${fmt(weight)} = ${fmt(d.amoxicillin)} mg/dose; ${fmt(d.amox80,4)} mL × 80 mg/mL = ${fmt(d.amoxicillin)} mg; 2 doses ÷ ${fmt(weight)} kg = ${fmt(d.amoxicillinDaily/weight)} mg/kg/dia.`,
      `Ampicilina: ${fmt(d.ampicillinVolume,4)} mL × (1.000 ÷ 3,4) mg/mL = ${fmt(d.ampicillin)} mg; ÷ ${fmt(weight)} kg = ${fmt(d.ampicillin/weight)} mg/kg/dose.`,
      `Ceftriaxona: ${fmt(d.ceftriaxoneRate)} mL/h × 0,5 h × 50 mg/mL = ${fmt(d.ceftriaxone)} mg; ÷ ${fmt(weight)} kg = 50 mg/kg/dose. Velocidade durante 30 min = 100 mg/kg/h; isso não é dose para infusão contínua.`
    ])}</details>`;
  }
  html += ul(['As bulas confirmam apresentações; disponibilidade no estoque local não é presumida. Reconstituir suspensões até a marca, agitar e medir com seringa oral. Não converter mL em gotas sem fator do produto.',
    'Ampicilina: usar imediatamente após reconstituição; não misturar com aminoglicosídeo na mesma seringa. Administrar lentamente devido ao risco de convulsões.',
    'Ceftriaxona: usar solução sem cálcio; não misturar em Y com cálcio, Ringer/Hartmann ou nutrição parenteral com cálcio. Lavar a via entre infusões incompatíveis conforme protocolo. Considerar o volume morto da linha para entregar a dose integral.',
    'Alergia imediata grave a betalactâmicos ou reação cutânea grave prévia exige alternativa individualizada. Insuficiência renal: ajustar amoxicilina/ampicilina; função renal e hepática simultaneamente comprometidas requerem revisão da ceftriaxona. Não há ajuste individual automático neste módulo.',
    'Monitorar alergia, diarreia importante, função renal, resposta clínica e acesso venoso. Na ceftriaxona, avaliar efeitos biliares e incompatibilidade com cálcio. Não extrapolar doses de meningite ou limites de adultos para este lactente.']);
  return html;
}

export function buildProtocol(data = {}) {
  const diagnosis = norm(data.diagnosis);
  const months = ageInMonths(data.age);
  const population = norm(data.population);
  const respiratory = /pneumonia|broncoespasmo|sibil|bronquiolite/.test(diagnosis);
  const excluded = /adulto|gestante|idoso|adolescente|neonato/.test(population) || (months !== null && (months < 2 || months >= 24));
  const identified = population === 'lactente' || (months !== null && months >= 2 && months < 24);
  if (!respiratory || excluded || !identified) {
    return {supported:false,title:data.diagnosis||'Pesquisa de protocolo',html:'<div class="clinical-empty"><h4>Pesquisa online pelo Guideliness</h4><p>A pesquisa aceita qualquer diagnóstico ou síndrome e considera os dados informados. O protocolo completo será exibido aqui após a consulta às fontes e a revisão clínica e farmacêutica.</p></div>'};
  }
  const v = readVitals(data);
  const pneumonia = /pneumonia/.test(diagnosis);
  const lowOxygen = v.spo2 !== null && v.spo2 < (pneumonia ? 92 : 90);
  const interpreted = [];
  if (v.spo2 !== null) interpreted.push(`SpO₂ ${fmt(v.spo2)}%${v.air?' em ar ambiente':' (condição de oxigênio não informada)'}`);
  if (v.pulse !== null) interpreted.push(`FC ${fmt(v.pulse)} bpm`);
  if (v.rr !== null) interpreted.push(`FR ${fmt(v.rr)} irpm`);
  let intro = `<div class="clinical-intro"><p><strong>Escopo:</strong> lactentes de 2 a &lt;24 meses com infecção respiratória baixa e sibilância. A expressão “broncoespasmo secundário à pneumonia” é uma hipótese que exige confirmação; não demonstra etiologia bacteriana nem resposta a broncodilatador.</p>`;
  if (interpreted.length) intro += `<p><strong>Dados utilizados:</strong> ${interpreted.map(esc).join(' · ')}.${v.inferred.length?' Valores extraídos do texto; confira-os nos campos de sinais vitais.':''}</p>`;
  if (lowOxygen) intro += `<div class="clinical-alert" role="alert"><strong>Prioridade respiratória: SpO₂ ${fmt(v.spo2)}%.</strong> Confirmar sinal e perfusão, iniciar avaliação ABCDE e monitorização. ${pneumonia?'Na suspeita de pneumonia, SpO₂ persistente <92% em ar ambiente indica oxigênio e avaliação para internação.':'Na bronquiolite, SpO₂ persistente <90% indica oxigênio; comorbidades podem exigir limiar maior.'} Se já recebe oxigênio, investigar falha do suporte. Não atrasar estabilização para concluir exames.</div>`;
  if (v.pulse !== null && v.pulse >= 160) intro += '<p><strong>Taquicardia:</strong> avaliar febre, choro, perfusão, desidratação, hipoxemia e efeito de β₂-agonista. Repetir em repouso e monitorar durante broncodilatação.</p>';
  if (v.rr !== null && months !== null && v.rr >= (months < 12 ? 50 : 40)) intro += '<p><strong>Taquipneia para a idade:</strong> confirmar frequência em repouso e interpretar junto ao esforço, oxigenação e estado geral; o achado isolado não define etiologia bacteriana.</p>';
  intro += '<p class="clinical-meta">Síntese clínica por fontes · revisão documental em '+revision+' · não equivale a homologação institucional. Fontes e divergências ao final.</p></div>';
  const sections = [];
  const add = (title, html, refs) => sections.push({title,html:html+ref(refs)});
  add('Resumo executivo e decisões imediatas',ul([
    '<strong>Primeiro, gravidade:</strong> via aérea, trabalho respiratório, oxigenação, perfusão, consciência e capacidade de mamar. Apneia, exaustão, cianose ou choque exigem ressuscitação e suporte avançado.',
    '<strong>Depois, mecanismo:</strong> bronquiolite típica → suporte; pneumonia bacteriana provável → antibiótico; obstrução reversível com diagnóstico alternativo à bronquiolite → broncodilatador e avaliação de resposta.',
    'Sibilância difusa isolada não confirma bactéria. Pneumonia e doença obstrutiva podem coexistir; tratar cada componente quando houver fundamento.'
  ]),[1,2,3]);
  add('Definição, classificação e registro diagnóstico',ul([
    'Pneumonia: infecção/inflamação do parênquima. Bronquiolite: infecção viral das pequenas vias aéreas, geralmente no primeiro ano. Broncoespasmo: contração reversível da musculatura brônquica; sibilância também resulta de edema e secreções.',
    'Separar provável etiologia viral/bacteriana, presença de obstrução e pneumonia não complicada/complicada. Registrar o diagnóstico sustentado pelo exame; não transformar o texto digitado em diagnóstico confirmado.',
    'CID-10, conforme documentação: J18.9 (pneumonia não especificada), J15.9 (pneumonia bacteriana não especificada), J21.9 (bronquiolite aguda não especificada), R06.2 (sibilância). O código não determina a terapêutica.'
  ]),[1,2]);
  add('Epidemiologia e etiologia',ul([
    'Vírus são frequentes nos lactentes; o vírus sincicial respiratório é causa importante de bronquiolite. Pneumococo é alvo central na pneumonia bacteriana comunitária; vacinação, estação e doença de base alteram probabilidades.',
    'Coinfecção existe. Febre, ausculta e radiografia têm sobreposição; não há teste simples capaz de estabelecer com segurança a etiologia em todos os casos.'
  ]),[1,2]);
  add('Fisiopatologia aplicada',ul([
    'Edema, muco e debris estreitam bronquíolos pequenos, provocando aprisionamento de ar, atelectasia e desequilíbrio ventilação/perfusão. Isso explica hipoxemia e esforço mesmo sem broncoespasmo reversível.',
    'Consolidação alveolar reduz a oxigenação. Broncodilatar pode aliviar contração muscular, mas não resolve consolidação, secreções ou uma complicação pleural.'
  ]),[1,2]);
  add('Fatores de risco, proteção e prevenção',ul([
    'Baixa idade, prematuridade, cardiopatia, doença pulmonar crônica, imunodeficiência, doença neuromuscular, desnutrição e dificuldade de acesso ao retorno favorecem evolução grave.',
    'Rever vacinação, aleitamento, exposição à fumaça e contatos doentes. Orientar higiene de mãos e evitar tabagismo; prevenção específica do VSR depende de elegibilidade e programa vigente.'
  ]),[1,2,3]);
  add('Anamnese: apresentação típica e atípica',ul([
    'Perguntar início e evolução da coriza, tosse, febre, esforço, apneia, ingestão e diurese; documentar prematuridade, vacinas, comorbidades, antibiótico recente e alergias.',
    'Primeiro episódio após pródromo viral favorece bronquiolite. Episódios repetidos, sintomas entre crises e resposta anterior documentada à broncodilatação favorecem outra doença obstrutiva; atopia isolada não autoriza salbutamol na bronquiolite.',
    'Início abrupto durante alimentação/brincadeira sugere aspiração; crise de tosse com apneia ou exposição sugere coqueluche. Ausência de febre não exclui doença grave.'
  ]),[1,2,3]);
  add('Exame físico dirigido e sinais vitais',ul([
    'Avaliar estado geral, interação, hidratação, perfusão, tiragens, gemência, batimento nasal, simetria da expansão, entrada de ar, sibilos e estertores; buscar foco extrapulmonar.',
    'Contar FR durante um minuto, idealmente calmo. Taquipneia na AIDPI: ≥50 irpm dos 2 a <12 meses; ≥40 irpm de 12 meses a 5 anos. Não usar esses cortes isoladamente como diagnóstico de pneumonia bacteriana.',
    'Repetir oximetria com sensor apropriado e sinal consistente. Documentar ar ambiente ou dispositivo/fluxo de oxigênio. Ausculta silenciosa com esforço e redução de consciência é alarme, não melhora.'
  ]),[1,3]);
  add('Triagem, gravidade e destino inicial',ul([
    'Emergência imediata: apneia, cianose central, exaustão, redução de esforço com piora clínica, alteração de consciência, choque ou hipoxemia refratária.',
    'Pneumonia com SpO₂ <92% em ar ambiente, recusa hídrica, esforço significativo ou complicação: avaliação hospitalar. Não aplicar o limiar permissivo de bronquiolite automaticamente a pneumonia.',
    'Bronquiolite: considerar observação/internação mesmo com sintomas inicialmente leves em lactentes com fatores de risco, como prematuridade (<37 semanas), idade cronológica <10 semanas ou doença cardiopulmonar. Apneias podem justificar observação mesmo sem necessidade de oxigênio ou hidratação assistida; não decidir o destino apenas pela saturação.',
    'Na bronquiolite, ingestão oral menor que metade do habitual acompanhada de desidratação clínica exige avaliação pela equipe pediátrica. Fonte [2], tópicos de risco, tratamento e consulta pediátrica; complemento documental conferido em 15/10/2026.',
    'Considerar UTI e transporte assistido quando houver apneias, falha do suporte de oxigênio, necessidade de ventilação, deterioração rápida ou instabilidade circulatória.'
  ]),[1,2,3]);
  add('Diagnósticos diferenciais que mudam a conduta',table(['Hipótese','Pistas e ação'],[
    ['Bronquiolite viral','Pródromo viral, primeiro episódio, sibilos/estertores difusos; suporte e avaliação de hidratação.'],
    ['Pneumonia bacteriana ou coinfecção','Febre e comprometimento sistêmico, achados focais/complicação; avaliar antibiótico conforme conjunto clínico.'],
    ['Sibilância recorrente / asma provável','História recorrente e obstrução reversível; confirmar resposta objetiva. Diagnóstico de asma é menos seguro no primeiro ano.'],
    ['Corpo estranho, pneumotórax','Início súbito, assimetria ou ausência unilateral de entrada de ar; avaliação urgente de via aérea/pleura.'],
    ['Cardiopatia, insuficiência cardíaca, sepse','Má perfusão, hepatomegalia, sudorese às mamadas, sopro ou toxemia; investigação e estabilização dirigidas.'],
    ['Coqueluche, aspiração recorrente, malformação','Tosse paroxística/apneia, relação com alimentação ou recorrência no mesmo local; investigação específica.']
  ]),[1,2,4]);
  add('Critérios diagnósticos e probabilidade clínica',ul([
    'Integrar cronologia, idade, sinais vitais, esforço, ausculta e risco. Reavaliar o diagnóstico após estabilização e, quando indicada por suspeita alternativa, broncodilatação.',
    'Resposta ao salbutamol favorece componente reversível, mas não confirma asma nem exclui pneumonia. PCR elevada ou opacidade radiográfica isolada não comprova etiologia bacteriana.',
    'Dados ausentes devem continuar ausentes. Não assumir alergias negativas, normalidade renal, vacinação completa ou ausência de apneia para gerar uma prescrição.'
  ]),[1,2,3]);
  add('Exames laboratoriais: quando solicitar',ul([
    'Bronquiolite típica ou pneumonia leve ambulatorial: não solicitar hemograma, PCR ou painel viral por rotina.',
    'Gravidade/internação: hemograma, eletrólitos e função renal conforme desidratação, infusão e antibióticos; hemocultura se infecção bacteriana grave, sem atrasar tratamento.',
    'Gasometria se exaustão, falha respiratória ou piora no suporte; lactato conforme hipoperfusão. Teste viral quando muda isolamento, antiviral ou decisão assistencial. Resultado viral positivo não exclui coinfecção.'
  ]),[1,2,3]);
  add('Imagem e procedimentos diagnósticos',ul([
    'Radiografia de tórax quando há hipoxemia, suspeita de complicação, diagnóstico incerto ou evolução desfavorável; não é rotina na bronquiolite típica ou PAC leve.',
    'Ultrassom pulmonar/pleural por operador habilitado ajuda a caracterizar derrame e orientar drenagem. Tomografia é reservada a questões específicas, como necrose/abscesso, ponderando radiação e necessidade de sedação.',
    'Não realizar radiografia seriada de controle em recuperação clínica simples. Persistência de achados ou recorrência focal exige reavaliação.'
  ]),[1,4]);
  add('Escores e prognóstico',ul([
    'Registrar tendência de esforço, oxigenação, consciência, perfusão e alimentação. Escore institucional de deterioração pode ajudar, mas não substitui avaliação clínica.',
    'Não usar CURB-65 em crianças. Não extrapolar automaticamente PRAM ou outros escores de asma para bronquiolite ou lactentes sem diagnóstico estabelecido de asma. Nenhum escore deve converter SpO₂ baixa em alta automática.'
  ]),[1,2,12]);
  add('Medidas imediatas e suporte respiratório',ul([
    'Posicionar, minimizar manipulação, manter via aérea pérvia; higiene/aspiração nasal superficial se secreção interfere na alimentação ou respiração. Evitar aspiração profunda rotineira.',
    'Pneumonia: oferecer oxigênio se SpO₂ persistente <92% em ar ambiente. Titular dispositivo/fluxo conforme saturação e esforço, documentando a meta institucional.',
    'Bronquiolite isolada: NICE/RCH usam <90% persistente para iniciar oxigênio em ≥6 semanas sem comorbidades; NICE mantém <92% em menores de 6 semanas ou comorbidades. O limiar de encaminhamento pode ser diferente.',
    'Falha de baixo fluxo ou agravamento: discutir alto fluxo; exaustão/apneia/hipoxemia persistente exigem suporte avançado e UTI. Não retardar intubação diante de falha clínica.'
  ]),[1,2,3]);
  add('Hidratação, alimentação e cuidados gerais',ul([
    'Manter aleitamento e pequenas ofertas se deglutição segura. Na incapacidade de ingestão, considerar sonda nasogástrica/orogástrica; via IV se enteral inviável ou insuficiência respiratória.',
    'Se necessário soro IV, utilizar solução isotônica com glicose apropriada ao caso. Prescrever após avaliar déficit, glicemia, sódio, balanço e risco de retenção hídrica; não infundir manutenção plena automaticamente.',
    'Reavaliar diurese, peso e eletrólitos. Não fazer bolus por taquicardia isolada. Tratar dor/febre se desconforto; evitar sedativos e antitussígenos para “acalmar” lactente dispneico.'
  ]),[2,3]);
  add('Salbutamol: indicação, dose e avaliação de resposta',ul([
    '<strong>Não usar rotineiramente na bronquiolite típica</strong>, inclusive apenas por história familiar de atopia. Não corrige pneumonia ou edema bronquiolar.',
    'Se a avaliação sustenta obstrução reversível por diagnóstico alternativo, salbutamol aerossol <strong>100 mcg/jato</strong>, inalatório com espaçador valvulado e máscara bem adaptada. Bula: 1 jato (100 mcg), podendo aumentar para 2 jatos (200 mcg). Um jato por vez, com técnica do dispositivo; não há conversão para mL ou mL/h.',
    'Exacerbação asmática: guia HSL descreve 2–4 jatos (200–400 mcg) a cada 20 min por 2–3 administrações, sob supervisão. No primeiro ano, a evidência específica para sibilância inespecífica é limitada; não extrapolar protocolos de asma de crianças maiores. É regime agudo protocolar, off-label quanto à dose/frequência quando excede a bula, e não um esquema automático para todo lactente sibilante.',
    'Reavaliar esforço, entrada de ar, FR, FC e SpO₂ antes/depois. Interromper se não há benefício objetivo ou se há piora/efeito adverso. Não repetir apenas porque persiste um ruído à ausculta.',
    'Taquicardia, tremor, hipocalemia e lactato elevado podem ocorrer com doses repetidas. Considerar ECG e potássio em uso intensivo. Betabloqueadores não seletivos antagonizam o efeito; broncoespasmo paradoxal exige suspensão.',
    'Bula usual: até 200 mcg, 4 vezes/dia; esse limite domiciliar não define resgate hospitalar. Nebulização tem evidência incerta abaixo de 18 meses; não substituir spray por mL de solução de concentração diferente.'
  ]),[2,5,6]);
  add('Corticoide, ipratrópio e intervenções sem indicação rotineira',ul([
    'Corticoide sistêmico/inalatório e ipratrópio não são tratamento de rotina da bronquiolite nem da pneumonia bacteriana simples.',
    'Se houver exacerbação asmática moderada/grave sustentada por avaliação clínica, o corticoide e o ipratrópio podem pertencer ao protocolo de asma, com dose e limites próprios; não deduzir essa indicação de “sibilos difusos” isolados.',
    'Evitar antibiótico em bronquiolite isolada, adrenalina nebulizada, solução hipertônica e fisioterapia respiratória rotineira. Não usar macrolídeo como anti-inflamatório de sibilância aguda.'
  ]),[2,3]);
  add('Antibioticoterapia: doses, apresentações e preparo',dosingContent(data,months),[1,4,7,8,9,10]);
  add('Alternativas, duração e uso racional de antimicrobianos',ul([
    'Escolher espectro pelo provável agente, gravidade, vacinação, alergia e resistência local. Falha de amoxicilina não implica adicionar automaticamente clavulanato, macrolídeo ou ceftriaxona.',
    'Amoxicilina-clavulanato/ampicilina-sulbactam podem ser alternativas quando houver fundamento para betalactamase ou outro foco; não são “mais fortes” por definição. Suspeita de estafilococo, necrose ou empiema exige cobertura específica e avaliação especializada.',
    'Alergia: diferenciar intolerância, exantema tardio benigno, anafilaxia e reação cutânea grave. Na última situação, evitar reexposição; selecionar tratamento alternativo individualmente, considerando sensibilidade e sítio.',
    'SBP 2022: 7 dias para PAC não complicada, admitindo esquemas mais curtos em casos leves selecionados. NICE 2025: 3 dias em 3 meses–11 anos com PAC não grave, sem complicações/doença de base. Não aplicar essa duração curta automaticamente à criança hipoxêmica deste cenário.',
    'Rever diariamente necessidade, cultura, via e duração. Converter IV para VO quando estável e tolerando; pneumonia complicada necessita curso individualizado, frequentemente mais prolongado.'
  ]),[1,4,11]);
  add('Falha terapêutica e resgate',ul([
    'Piora em qualquer momento exige reavaliação imediata. Falta de melhora em 48–72 h de antibiótico: confirmar dose, adesão, absorção, diagnóstico e agente; procurar complicação.',
    'Repetir exame e oximetria; imagem/ultrassom conforme hipótese. Considerar corpo estranho, derrame, necrose, abscesso, resistência e doença de base antes de ampliar o antibiótico.',
    'Aumentar suporte respiratório e transferir se a necessidade excede os recursos do serviço. Broncoespasmo refratário com resposta inicial documentada deve seguir protocolo de asma grave; magnésio, β₂-agonista IV e sedação não são resgate inespecífico da bronquiolite.'
  ]),[1,2,4]);
  add('Complicações: reconhecimento e manejo',table(['Complicação','Reconhecer / confirmar','Resposta e destino'],[
    ['Insuficiência respiratória / apneia','Exaustão, redução de consciência, oxigenação inadequada; gasometria se altera suporte.','Via aérea, oxigênio/ventilação, equipe experiente e UTI. Não aguardar exame para estabilizar.'],
    ['Derrame / empiema','Febre persistente, piora, redução focal do murmúrio; ultrassom pleural.','Antibiótico IV, cultura do líquido quando drenado, pneumologia/cirurgia; drenagem conforme volume, loculações e repercussão.'],
    ['Necrose / abscesso','Toxemia ou falha persistente; imagem dirigida.','Internação, cobertura orientada por microbiologia e equipe especializada; procedimento se indicado, seguimento para sequelas.'],
    ['Sepse / choque','Perfusão ruim, alteração mental, oligúria, instabilidade.','Ativar protocolo de sepse, culturas sem atraso, antibiótico e ressuscitação individualizada; UTI.'],
    ['Desidratação / distúrbio do sódio','Recusa, oligúria, balanço inadequado; eletrólitos conforme risco.','Corrigir via e oferta, monitorar balanço e sódio; evitar excesso de fluidos.'],
    ['Toxicidade medicamentosa','Taquicardia desproporcional, hipocalemia/lactato com β₂; alergia/diarreia com antibióticos.','Suspender/rever agente conforme gravidade, tratar evento e registrar para evitar reexposição.']
  ]),[2,4,5,7,10]);
  add('Populações e cenários especiais',ul([
    'Menores de 2 meses e neonatos requerem protocolo próprio, investigação de sepse e posologia específica. Este módulo não calcula doses para eles.',
    'Prematuridade, cardiopatia, imunodeficiência e doença neuromuscular reduzem o limiar de internação; ajustar metas de oxigênio à doença de base.',
    'Insuficiência renal/hepática e alergias demandam revisão do regime. Em unidade sem suporte, estabilizar, comunicar achados e resposta, assegurar transporte assistido e transferência precoce.'
  ]),[1,2,3,9,10]);
  add('Monitorização e reavaliação',ul([
    'Durante instabilidade: acompanhamento contínuo de oxigenação e observação frequente de esforço, frequência respiratória/cardíaca, perfusão e consciência; repetir após cada intervenção.',
    'A melhora precisa incluir menor esforço e necessidade de oxigênio, alimentação e hidratação adequadas. Menos sibilância sem melhora da entrada de ar não comprova resposta.',
    'Registrar doses e horários, dispositivo de oxigênio, entradas/saídas e efeitos adversos. Reavaliar indicação do antibiótico e do broncodilatador separadamente.'
  ]),[1,2,5]);
  add('Alta, seguimento e orientações à família',ul([
    'Alta só após estabilidade respiratória sustentada, alimentação/hidratação adequadas, cuidadores orientados e acesso ao retorno. Persistência de hipoxemia em pneumonia exige manejo hospitalar.',
    'Bronquiolite: observar estabilidade em ar ambiente incluindo sono; NICE utiliza >90% por 4 h (ou >92% nos grupos de maior risco). Não transferir automaticamente esse critério para pneumonia com outra meta.',
    'PAC em casa: reavaliar em 48–72 h, antes se piora. Tosse pode persistir além da fase aguda; nova febre ou piora do esforço é motivo de reavaliação.',
    '<strong>Orientação aos responsáveis:</strong> oferecer mamadas menores e frequentes; manter nariz desobstruído; evitar fumaça e remédios para tosse. Voltar imediatamente se pausas respiratórias, coloração azulada, sonolência incomum, piora para respirar, dificuldade para mamar ou redução importante da urina.'
  ]),[1,2,3]);
  add('Evidência, limites e atualização',ul([
    'Síntese para apoio à decisão, baseada em documentos de sociedades, hospitais e bulas do fabricante. A prioridade editorial do framework não é grau de evidência. Não foi realizada avaliação GRADE própria ou revisão humana independente.',
    'As recomendações para bronquiolite não devem ser transpostas para asma; as doses de asma não devem ser transpostas para todo lactente. A indicação clínica é decidida antes do cálculo.',
    'Verificação: indicação/população e fontes; apresentação, concentração e preparo; cálculo dimensional e reverso. A conferência documental não substitui dupla checagem no preparo e administração.',
    'Revisar diante de alerta regulatório, nova diretriz, mudança de resistência/estoque ou evento adverso. Indicadores úteis: reconhecimento de hipoxemia, resposta após intervenção, adequação do antibiótico e retorno planejado.',
    'Esta referência local corresponde à revisão indicada. A pesquisa online é executada separadamente e apresenta sua própria data, fontes e limitações.'
  ]),[1,2,3,4,5,6,7,8,9,10,11]);
  const priorityModes = {'Resumo de decisão':[0,7,13,15,17,23], 'Escores relacionados':[12], 'Orientações à família':[23]};
  const selected = priorityModes[data.mode];
  const ordered = selected ? sections.filter((_,i)=>selected.includes(i)) : sections;
  const sectionHtml = (s,i) => {const n=sections.indexOf(s)+1;return `<section class="clinical-section" id="clinical-section-${n}"><h4><span>${String(n).padStart(2,'0')}</span> ${s.title}</h4>${s.html}</section>`;};
  const toc = `<nav class="clinical-toc" aria-label="Tópicos do protocolo">${ordered.map(s=>`<a href="#clinical-section-${sections.indexOf(s)+1}">${String(sections.indexOf(s)+1).padStart(2,'0')} · ${s.title}</a>`).join('')}</nav>`;
  const remaining = selected ? `<details class="clinical-complete"><summary>Ler protocolo completo — todos os ${sections.length} tópicos</summary>${sections.filter((_,i)=>!selected.includes(i)).map(sectionHtml).join('')}</details>` : '';
  const bibliography = `<section class="clinical-section"><h4>Referências e documentos consultados</h4><ol class="clinical-bibliography">${sources.map(([title,url],i)=>`<li id="clinical-source-${i+1}"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a></li>`).join('')}</ol><p>Consultas realizadas em ${revision}. PAC: pneumonia adquirida na comunidade; SpO₂: saturação periférica de oxigênio; FC: frequência cardíaca; FR: frequência respiratória; VO: via oral; IV: intravenosa; UTI: unidade de terapia intensiva; SF: solução fisiológica; BIC: bomba de infusão contínua; VSR: vírus sincicial respiratório; PCR: proteína C reativa; AIDPI: Atenção Integrada às Doenças Prevalentes na Infância.</p></section>`;
  return {supported:true,title:'Pneumonia e sibilância no lactente',sectionCount:sections.length,html:intro+toc+ordered.map(sectionHtml).join('')+remaining+bibliography};
}
