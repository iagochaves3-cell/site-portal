/** Own UI adapter for six professionally adjudicated CISNE criteria. No raw clinical inference. */
import {PROFILE,CONFIRMATIONS,WEIGHTS,evaluateCisne} from './cisne-reference.mjs';
export {PROFILE};
const select=(id,label,options,hint,group)=>({id,label,type:'select',noPoints:true,options:options.map(([value,label])=>({value,label})),hint,group});
const preparation=[
 {
  "id": "adultConfirmed",
  "label": "Idade ≥18 anos na avaliação inicial confirmada?",
  "hint": "Idade ≥18 anos na avaliação inicial, confirmada pelo profissional. Não há verificação automática de calendário.",
  "group": "População e episódio"
 },
 {
  "id": "solidTumorConfirmed",
  "label": "Tumor sólido confirmado?",
  "hint": "Tumor sólido; este perfil não incorpora a exceção histórica de linfoma/CHOP do registro.",
  "group": "População e episódio"
 },
 {
  "id": "mildModerateChemotherapyConfirmed",
  "label": "Quimioterapia convencional de intensidade leve/moderada confirmada?",
  "hint": "Quimioterapia convencional de intensidade leve/moderada; não indução/consolidação de leucemia ou transplante.",
  "group": "População e episódio"
 },
 {
  "id": "outpatientOnsetConfirmed",
  "label": "Início ambulatorial deste episódio confirmado?",
  "hint": "O episódio começou fora de internação por outra doença; internação posterior para tratar este episódio não altera a origem.",
  "group": "População e episódio"
 },
 {
  "id": "febrileNeutropeniaConfirmed",
  "label": "Neutropenia febril já reconhecida clinicamente e compatível com o preparo FINITE?",
  "hint": "NF já reconhecida clinicamente e compatível com o preparo FINITE: febre ≥38°C por uma hora e neutrófilos ≤500/µL, ou ≤1000/µL com queda esperada a ≤500/µL. Não é algoritmo diagnóstico.",
  "group": "População e episódio"
 },
 {
  "id": "initialAssessmentConfirmed",
  "label": "Avaliação inicial integral pertinente concluída?",
  "hint": "Avaliação inicial pertinente concluída, incluindo exame, hemograma, bioquímica e avaliação radiográfica conforme protocolo; os dados não são apenas de triagem.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "initialWindowConfirmed",
  "label": "Enquadramento inicial concluído até 3 horas da chegada ao atendimento?",
  "hint": "Enquadramento inicial concluído em até 3 h da chegada ao atendimento, conforme a definição histórica FINITE. Confirmação manual, sem inferir hora de digitação. Não é pedido para aguardar três horas; é uma confirmação do enquadramento clínico informado.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "initialStabilityConfirmed",
  "label": "Aparente estabilidade na avaliação inicial confirmada?",
  "hint": "Na avaliação inicial não havia falência orgânica aguda/descompensada, choque/hipotensão, infecção grave ou outra complicação que exigisse internação por si.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "currentStabilityConfirmed",
  "label": "Aparente estabilidade mantida agora?",
  "hint": "Mantém aparente estabilidade agora. Deterioração posterior, inclusive depois de 3 h, impede usar esta saída clínica.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "noOtherAdmissionIndicationConfirmed",
  "label": "Ausência de outra indicação clínica independente de internação confirmada?",
  "hint": "Nenhuma outra indicação clínica de internação independente identificada; não é confirmação de logística para alta.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "sameEpisodeInitialDataConfirmed",
  "label": "Os seis critérios são da avaliação inicial do mesmo indivíduo e episódio?",
  "hint": "Os seis critérios pertencem à avaliação inicial do mesmo indivíduo/episódio; não misturar exames tardios, melhorados após intervenção, nem de outro episódio.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "professionalAdjudicationConfirmed",
  "label": "Os seis critérios foram adjudicados por profissional segundo este perfil?",
  "hint": "Profissional habilitado adjudicou os seis critérios conforme a definição declarada; ferramenta não infere diagnósticos/comorbidades por sintomas.",
  "group": "Avaliação inicial e estabilidade"
 },
 {
  "id": "initialGlucoseReviewed",
  "label": "Glicemia inicial efetivamente obtida e revisada na unidade correta?",
  "hint": "A glicemia inicial foi efetivamente obtida e revisada na unidade correta.",
  "group": "Preparo da hiperglicemia"
 },
 {
  "id": "diabetesStatusReviewed",
  "label": "Presença ou ausência de diabetes conhecida e revisada?",
  "hint": "Presença/ausência de diabetes conhecida e revisada para selecionar o limiar do protocolo.",
  "group": "Preparo da hiperglicemia"
 },
 {
  "id": "alternativeGlucoseCausesReviewed",
  "label": "Causas alternativas foram investigadas e a hiperglicemia pôde ser adjudicada sem incerteza?",
  "hint": "Causas farmacológicas e clínicas alternativas, inclusive corticoides, foram investigadas e o critério pôde ser adjudicado sem incerteza segundo FINITE 2012. Investigar não equivale a afastar; causalidade incerta impede confirmar.",
  "group": "Preparo da hiperglicemia"
 },
 {
  "id": "finite2012PreparationConfirmed",
  "label": "Preparo FINITE v4.0/2012 explicitamente adotado?",
  "hint": "Preparo adotado explicitamente FINITE v4.0/2012; não importar automaticamente a definição diabetes OU corticoide do nomograma 2016.",
  "group": "Preparo da hiperglicemia"
 }
];
const criteria=[
 {
  "id": "ecogGe2",
  "label": "ECOG Performance Status ≥2",
  "hint": "Grau ECOG documentado 2–4 em pessoa viva; 0–1 não pontua. Grau 5 não é avaliação prognóstica aplicável. Sem conversão automática de Karnofsky. Não foi estabelecida uma janela retrospectiva uniforme para o ECOG. Peso se presente: 2 pontos.",
  "weight": 2
 },
 {
  "id": "copd",
  "label": "DPOC documentada",
  "hint": "Critério clínico de DPOC previamente estabelecido. Tabagismo isolado não basta. Uma exacerbação aguda também exige rever estabilidade. Peso se presente: 1 ponto.",
  "weight": 1
 },
 {
  "id": "chronicCardiovascularDisease",
  "label": "Doença cardiovascular crônica",
  "hint": "Critério clínico de cardiopatia crônica adjudicado. Não converter hipertensão sem cardiopatia ou fator de risco em doença por conta própria. Descompensação aguda exclui aplicação. Peso se presente: 1 ponto.",
  "weight": 1
 },
 {
  "id": "oralMucositisGe2",
  "label": "Mucosite oral NCI/CTCAE v3 grau ≥2",
  "hint": "Grau previamente estabelecido segundo CTCAE v3. Não converter OMS/RTOG/CTCAE atual automaticamente. Incapacidade de ingestão e toxicidade grave também exigem avaliação de elegibilidade. Peso se presente: 1 ponto.",
  "weight": 1
 },
 {
  "id": "monocytesLt200",
  "label": "Monócitos absolutos <200 células/µL",
  "hint": "Contagem inicial absoluta, não porcentagem nem neutrófilos. 200/µL não pontua; equivale a <200/mm³ ou <0,2×10⁹/L. Unidade mg/mL ou células/mL não é substituta. Peso se presente: 1 ponto.",
  "weight": 1
 },
 {
  "id": "stressHyperglycemia",
  "label": "Hiperglicemia de estresse adjudicada, FINITE 2012",
  "hint": "Glicemia inicial ≥121 mg/dL, com causas farmacológicas/clínicas alternativas afastadas; em diabetes limiar ≥250 mg/dL. O erro tipográfico mg/m do protocolo não é unidade utilizável. Critério causal, não diagnóstico por valor isolado. Corticoide não ativa automaticamente ramo 250 neste perfil. Incerteza deixa critério desconhecido (null/undefined/sem propriedade), nunca false por falta de informação. Peso se presente: 2 pontos.",
  "weight": 2
 }
];
export const cisneFields=[select('profile','Perfil operacional',[[PROFILE,'Pesos CISNE 2015 · preparo manual FINITE v4.0/2012']],'Perfil local restrito com seis critérios previamente adjudicados. Não alega equivalência integral ao suplemento JCO 2015 não recuperado ou validação clínica própria; não é o nomograma 2016.','Versão'),...preparation.map(f=>select(f.id,f.label,[[1,'Sim, requisito confirmado'],[0,'Não, requisito não satisfeito'],[-1,'Desconhecido / informação insuficiente']],f.hint+' Estas confirmações são guardas locais de preparo, não questionário autoral validado.',f.group)),...criteria.map(f=>select(f.id,f.label,[[1,'Critério presente, adjudicado'],[0,'Critério comprovadamente não presente'],[-1,'Desconhecido / não foi possível adjudicar']],f.hint,'Seis critérios adjudicados'))];
function capture(raw){const data=Object.create(null),issues=[],allowed=new Set(cisneFields.map(f=>f.id));const add=(field,reason)=>issues.push({field,kind:'invalid',reason});if(raw===null||typeof raw!=='object')return {data,issues:[{field:'profile',kind:'invalid',reason:'Objeto de dados obrigatório.'}]};try{const p=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(p!==Object.prototype&&p!==null))add('profile','Protótipo não admitido.');}catch{add('profile','Falha ao ler protótipo.');}let keys;try{keys=Reflect.ownKeys(raw);}catch{add('profile','Falha na primeira lista de chaves.');return {data,issues};}for(const key of keys){let d;try{d=Object.getOwnPropertyDescriptor(raw,key);}catch{add(typeof key==='string'&&allowed.has(key)?key:'profile','Falha ao ler descritor.');continue;}if(typeof key!=='string'||!allowed.has(key)){add('profile','Campo não previsto.');continue;}if(!d||!Object.hasOwn(d,'value')){add(key,'Accessor ou descritor ausente recusado sem invocação.');continue;}data[key]=d.value;}return {data,issues};}
function selection(v,f){if(typeof v!=='string'&&typeof v!=='number')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const option=f.options.find(o=>v===o.value||(typeof v==='string'&&v===String(o.value)));return option?{ok:true,value:option.value}:{ok:false};}
const glucosePreparation='Preparo glicêmico FINITE 2012: glicemia inicial ≥121 mg/dL com causas farmacológicas/clínicas alternativas afastadas; em diabetes, limiar ≥250 mg/dL. Corticoide não ativa automaticamente o ramo de 250 mg/dL neste perfil. Causalidade incerta impede confirmar o critério e calcular.';
const labels={I:'Classe I · menor risco pelo CISNE; risco não nulo',II:'Classe II · risco intermediário pelo CISNE',III:'Classe III · maior risco pelo CISNE'};
export function evaluateCisneAdapter(raw){
 const {data,issues}=capture(raw),input=Object.create(null);
 for(const f of cisneFields){const v=data[f.id];if(v===undefined||v===null||v===''){input[f.id]=null;continue;}const p=selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Selecione uma opção canônica da ficha; sem coerção de dados.'});input[f.id]=null;continue;}input[f.id]=f.id==='profile'?p.value:p.value===-1?null:p.value===1;}
 const r=evaluateCisne(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,status=all.some(i=>i.kind==='invalid')?'invalid':all.some(i=>i.kind==='outside_profile')?'outside_profile':all.length?'incomplete':'scored',errors=[...new Set(all.map(i=>i.field))],alerts=[r.clinicalAlert.message],level=r.clinicalAlert.priority==='instability'?'high':'neutral';
 if(!complete){const reason=[status==='invalid'?'Entrada inválida: nenhum total ou classe foi emitido.':status==='outside_profile'?'Um ou mais requisitos de preparo/elegibilidade não foram satisfeitos: este perfil não pode ser aplicado.':'Informação insuficiente: nenhum total ou classe pode ser atribuído.',...errors.map(id=>cisneFields.find(f=>f.id===id)?.label??id),r.clinicalAlert.message].join(' ');return {...r,status,complete:false,total:null,riskClass:null,components:null,interpretation:null,issues:all,errors,alerts,level,label:status==='outside_profile'?'Fora do perfil / preparo não satisfeito':'Sem total válido',reason,action:reason,audit:'Pesos CISNE 2015; preparo manual FINITE v4.0/2012. Não houve soma parcial, classe por padrão, imputação de ausência ou inferência clínica por dados brutos. As confirmações são guardas locais não validadas como questionário autoral. '+glucosePreparation,breakdown:[]};}
 const names=criteria.map(f=>`${f.label}: ${input[f.id]?'presente':'comprovadamente não presente'} (${r.components[f.id]} pontos)`),audit=`Pesos CISNE 2015; preparo manual FINITE v4.0/2012. Dezesseis confirmações profissionais de elegibilidade/preparo satisfeitas; não são um questionário autoral validado. Adulto com tumor sólido, quimioterapia leve/moderada, início ambulatorial, avaliação inicial integral até 3 h da chegada, estabilidade inicial e atual e ausência de outra indicação independente de internação informadas. Dados iniciais do mesmo episódio, glicemia, diabetes e causas alternativas revistos e adjudicados sem incerteza. ${glucosePreparation} ${names.join('; ')}. Soma: ${Object.values(r.components).join(' + ')} = ${r.total}. ${labels[r.riskClass]}. Não se certificam idade, calendário, identidade, causalidade ou veracidade dos critérios pelo software. Não alega equivalência integral ao suplemento JCO 2015 não recuperado; não incorpora nomograma 2016. Sem probabilidade individual ou alta/prescrição automática.`;
 return {...r,errors:[],issues:[],alerts,level,label:labels[r.riskClass],reason:null,action:r.interpretation+' Neutropenia febril continua exigindo avaliação urgente. O total não autoriza alta, escolha de antibiótico ou via de tratamento; avaliação integral e critérios adicionais são indispensáveis.',audit,breakdown:criteria.map(f=>({label:f.label,points:r.components[f.id],detail:`${r.components[f.id]} pontos · ${input[f.id]?'presente':'comprovadamente não presente'}`}))};
}
export const cisneScore={id:'cisne-adult-finite2012',name:'CISNE adulto · perfil FINITE 2012',subtitle:'Pesos CISNE 2015 · seis critérios adjudicados · risco de complicações',specialty:'Oncologia',specialties:['Oncologia','Infectologia','Emergência e UTI'],aliases:['CISNE','Clinical Index of Stable Febrile Neutropenia','FINITE','Carmona-Bayonas'],population:'Adultos ≥18 anos com tumor sólido e neutropenia febril aparentemente estável',range:'0–8',max:8,unit:'pontos',reviewDate:'11/10/2026',scope:'Pesos CISNE 2015 com preparo manual FINITE v4.0/2012. Adulto com tumor sólido, quimioterapia leve/moderada e episódio de neutropenia febril de início ambulatorial, após avaliação inicial integral pertinente concluída até 3 h da chegada, com aparente estabilidade inicial e atual. Não aguardar três horas para avaliar ou tratar. Sem outra indicação clínica independente de internação. Não aplicar a pediatria, instabilidade, leucemia em indução/consolidação, transplante ou neoplasia hematológica neste perfil. Dezesseis confirmações profissionais são guardas locais, não questionário validado nem verificação automática de calendário, idade ou identidade.',fields:cisneFields,
 formula:'CISNE = 2×ECOG Performance Status ≥2 + DPOC(1) + doença cardiovascular crônica(1) + mucosite oral NCI/CTCAE v3 grau≥2(1) + monócitos absolutos <200/µL(1) + hiperglicemia de estresse adjudicada FINITE 2012(2). Seis critérios previamente adjudicados; cada critério comprovadamente não presente soma 0. Total 0–8; classe I=0, II=1–2, III=3–8. ECOG documentado 2–4 em pessoa viva; não converter Karnofsky. Mucosite sem conversão automática OMS/RTOG/CTCAE atual. Monócitos 200/µL não pontuam; equivalência <0,2×10⁹/L, não porcentagem/neutrófilos. Hiperglicemia: glicemia inicial≥121 mg/dL após afastar causas farmacológicas/clínicas alternativas; em diabetes, limiar≥250 mg/dL. Corticoide não ativa automaticamente o ramo 250 neste preparo 2012. Causalidade incerta impede adjudicar e calcular. Não recebe nem calcula a partir de glicemia bruta.',
 limits:'Perfil editorial restrito: pesos publicados em 2015 e preparo FINITE v4.0/2012 explícitos. Íntegra/suplemento JCO 2015 não recuperados; não se alega equivalência integral nem validação clínica própria deste recorte. Critérios profissionais e unidades devem ser conferidos; a ferramenta não estabelece diagnósticos, causalidade da hiperglicemia ou estabilidade. Revisão uniforme de diabetes/causas alternativas é guarda local conservadora, não necessidade matemática universal quando o valor já está abaixo do limiar. Causas investigadas não significam causas afastadas: incerteza impede confirmação. Não importar regra diabetes OU corticoide do nomograma 2016, sua escala ou probabilidades. Não há janela retrospectiva ECOG uniforme inventada. Quadro instável, informações insuficientes, outro motivo de internação ou deterioração posterior impedem total/classe. Baixo risco não é risco nulo nem alta segura. Não informa porcentagem individual, antibiótico, dose, via oral/IV, diagnóstico de sepse ou disposição automática. MASCC permanece distinto, sem soma/conversão entre instrumentos. Redação factual e código próprios, sem formulário reproduzido, endosso ou tradução validada.',
 sources:[{title:'Carmona-Bayonas et al. 2015 · CISNE/FINITE · resumo primário; suplemento não recuperado · DOI 10.1200/JCO.2014.57.2347',url:'https://ascopubs.org/doi/10.1200/JCO.2014.57.2347'},{title:'SEOM · protocolo FINITE, versão 4.0 de 12/04/2012 na capa (nome do arquivo v5)',url:'https://www.seom.org/seomcms/images/stories/recursos/infopublico/publicaciones/FINITE_v5_duplex-rev.pdf'},{title:'SEOM 2018 · manejo da neutropenia febril em tumores sólidos · CC BY 4.0',url:'https://link.springer.com/article/10.1007/s12094-018-1983-4'},{title:'ASCO/IDSA 2018 · avaliação integral e critérios além dos escores',url:'https://www.idsociety.org/practice-guideline/fever-and-neutropenia-in-adults-with-cancer/'},{title:'Moon et al. 2018 · validação externa do CISNE · PLoS ONE',url:'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0210019'},{title:'ECOG-ACRIN · ECOG Performance Status Scale · Oken et al. 1982',url:'https://ecog-acrin.org/resources/ecog-performance-status/'},{title:'NCI · Common Terminology Criteria for Adverse Events v3.0',url:'https://dctd.cancer.gov/research/ctep-trials/for-sites/adverse-events/ctcae-v3.pdf'}],reuse:{attribution:'Pesos e relações factuais em redação e implementação próprias, com preparo FINITE 2012 explícito. ECOG Performance Status Scale: crédito ECOG-ACRIN/Oken 1982. Não se alega licença geral dos artigos ou endosso autoral.'},safeCalculate:evaluateCisneAdapter,safeValidate:raw=>evaluateCisneAdapter(raw).errors,assessPartial:raw=>{const r=evaluateCisneAdapter(raw);return {level:r.level,alert:r.clinicalAlert.message};}};
export const cisneScores=[cisneScore];
