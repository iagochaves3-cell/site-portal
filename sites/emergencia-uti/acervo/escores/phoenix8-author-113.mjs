/** Independently written UI adapter. The separate author-profile kernel is frozen.
 * No Phoenix-4 module is used; no diagnostic/mortality/treatment thresholds.
 */
import {PROFILE,PREPARATION,AGE_BANDS,calculatePhoenix8} from './phoenix8-contract.mjs';
const missing=v=>v===undefined||v===null||v==='';
const s=(id,label,options,hint,group)=>({id,label,type:'select',noPoints:true,options:options.map(([value,label])=>({value,label})),hint,group});
const n=(id,label,min,max,precision,hint,group,allowNA=false)=>({id,label,type:'number',noPoints:true,min,max,precision,step:precision?10**-precision:1,hint,group,allowNA});
const yn=(id,label,hint,group)=>({...s(id,label,[[1,'Sim'],[0,'Não'],[2,'Desconhecido / não avaliado']],hint,group),booleanValue:true});
export const phoenix8Fields=[
 s('danger_signs','Há instabilidade, piora clínica importante ou sinais de emergência que exigem avaliação imediata?',[[1,'Sim'],[0,'Não, após avaliação'],[2,'Desconhecido / não avaliado']],'Guarda local independente da fórmula. Se houver urgência, não aguarde completar o escore.','Segurança'),
 s('profile','Perfil de cálculo',[[PROFILE,'Autoral 1.1.3 + completude local estrita']],'Perfil descritivo/pesquisa, 0–17. Diverge da tabela clínica em P/F=200, S/F=220 e algumas PAMs decimais. Não substitui a ficha Phoenix de quatro órgãos.','Perfil e população'),
 s('preparation','Preparo dos dados',[[PREPARATION,'Uma observação manual contemporânea · release 1.1.3']],'Não seleciona dados de prontuário, não carrega exames e não calcula máximo de 24 h.','Perfil e população'),
 n('ageMonths','Idade cronológica no início do encontro (meses)',0,216,6,'Aplicável a <216 meses (<18 anos). Não corrigir prematuridade nem usar mês de 30 dias. Confira a idade/faixa antes de inserir.','Perfil e população'),
 n('postConceptionalWeeks','Idade pós-concepcional no início do encontro (semanas)',0,10000,6,'Exige ≥37 semanas. Não é idade gestacional ao nascer. O preparo manual deve conferir coerência com a idade cronológica; a calculadora não processa datas de nascimento.','Perfil e população'),
 yn('birthHospitalization','Ainda na internação do nascimento, antes da primeira alta?','Essa internação é excluída. Prematuridade anterior não é exclusão permanente após os demais critérios.','Perfil e população'),
 yn('suspectedInfection','Há infecção suspeita ou confirmada neste encontro?','Contexto de pesquisa com infecção. Não esperar cultura positiva, doses futuras de antibiótico ou total para reconhecer deterioração.','Perfil e população'),
 n('hoursSinceEncounter','Tempo desde o início do encontro hospitalar (h)',0,24,6,'Janela local explícita: 0 ≤ h <24; não é tempo desde admissão na UTI. Não equivale ao pior total em 24 h.','Tempo e preparo'),
 yn('contemporaneousConfirmed','Confirmei dados contemporâneos, unidades e preparo desta observação?','Não somar piores valores de órgãos em horários diferentes. Confira procedência, idades e razão respiratória; não excluir uma razão válida pior. Sem validação automática de timestamps/carreamento.','Tempo e preparo'),
 yn('supportNotPerioperativeOnly','Não há suporte, ou o suporte registrado não é exclusivamente perioperatório?','Suporte exclusivamente perioperatório ou não mapeado não é interpretável neste preparo local. Não suspender suporte para pontuar.','Tempo e preparo'),
 s('respiratorySupport','Suporte respiratório no instante',[[ 'none','Nenhum suporte respiratório, após avaliação'],['noninvasive','Oxigênio/CNAF/VNI ou suporte sem ventilação invasiva'],['invasive','Ventilação mecânica invasiva']],'Ausente/desconhecido não significa nenhum. FiO₂ >0,21 contradiz a opção nenhum suporte.','Respiratório'),
 s('respiratoryBasis','Razão respiratória preparada',[[ 'not_applicable','Não se aplica: nenhum suporte'],['pf','P/F · PaO₂ arterial/FiO₂'],['sf','S/F · SpO₂/FiO₂, com SpO₂ ≤97%'],['both','Ambas contemporâneas · maior critério (OR)']],'Se duas razões válidas forem fornecidas, ambas são obrigatórias no OR autoral. NA só quando o valor não pertencer à observação; nunca para esconder a razão pior. Notas EHR prospectivas de 2026 escolhem por tempo e não são executadas aqui.','Respiratório'),
 n('pao2Mmhg','PaO₂ arterial (mmHg)',0,2000,6,'Obrigatória para P/F ou ambas. Não usar PvO₂. Sem suporte ou fora da observação, vazio/NA. Valor válido fornecido com S/F exige ambas.','Respiratório',true),
 n('spo2Percent','SpO₂ (%)',0,100,6,'Obrigatória para S/F ou ambas, somente ≤97%. Exemplo 95, não 0,95. >97% não é reduzida a 97 e só pode permanecer como não aplicável sob P/F.','Respiratório',true),
 n('fio2Fraction','FiO₂ (fração)',0.21,1,3,'Exemplo 0,30, não 30. Obrigatória com suporte; até três casas. Sem suporte: vazio/NA ou 0,21 confirmado, nunca >0,21. Não estimar a partir do fluxo.','Respiratório',true),
 n('vasoactiveCount','Número de agentes vasoativos distintos listados',0,6,0,'Dopamina, dobutamina, epinefrina, norepinefrina, milrinona e vasopressina. Preparo local: suporte sistêmico contínuo no instante; sem bolus isolado/via local. Dose não pondera pontos; não usar VIS, bolsas, fenilefrina ou esperar duração mínima de uma hora.','Cardiovascular'),
 n('lactateMmolL','Lactato arterial ou venoso (mmol/L)',0,50,6,'<5 = 0; 5 a <11 = 1; ≥11 = 2. Não arredondar.','Cardiovascular'),
 n('mapMmhg','PAM preparada e confiável (mmHg)',0,300,6,'Preferir medida. Este perfil recebe PAM pronta, não calcula PAS/PAD nem certifica seu pareamento. Limites etários autorais contínuos, sem arredondamento.','Cardiovascular'),
 n('platelets10e9L','Plaquetas (×10⁹/L; mesmo número em ×10³/µL)',0,1e9,6,'<100 pontua. Não inserir contagem absoluta /µL nesta unidade; converter explicitamente antes, fora da ficha.','Coagulação'),
 n('inr','INR',0,1e9,6,'>1,3 pontua; exatamente 1,3 não.','Coagulação'),
 n('dDimerMgLFEU','D-dímero (mg/L FEU)',0,1e9,6,'>2 pontua. DDU não é FEU; não converter sem ensaio/fator confirmado.','Coagulação'),
 n('fibrinogenMgDl','Fibrinogênio (mg/dL)',0,1e9,6,'<100 pontua. Todos os quatro exames são obrigatórios nesta adaptação mesmo se o teto 2 já estiver atingido. Não pedir exames só para completar a ficha.','Coagulação'),
 n('gcsTotal','Glasgow total avaliado (3–15)',3,15,0,'≤10 vale 1. Não inserir 15 fictício sob sedação/intubação; dado desconhecido bloqueia.','Neurológico'),
 yn('bilateralFixedPupils','Pupilas bilateralmente fixas?','Vale 2 sem somar Glasgow. Não estabelece causa nem diagnóstico de morte encefálica.','Neurológico'),
 n('glucoseMgDl','Glicose (mg/dL)',0,2000,6,'<50 ou >150 vale 1; exatamente 50 e 150 não pontuam.','Endócrino'),
 n('ancCellsPerUl','Neutrófilos absolutos (células/µL)',0,1e9,6,'<500 vale 1. Não inserir milhares/µL: 0,5 mil equivale a 500 células.','Imunológico'),
 n('alcCellsPerUl','Linfócitos absolutos (células/µL)',0,1e9,6,'<1000 vale 1. Ambos os valores são obrigatórios, máximo 1.','Imunológico'),
 n('creatinineMgDl','Creatinina (mg/dL)',0,50,6,'≥limite etário autoral vale 1. Não substituir por diurese ou eGFR.','Renal'),
 n('totalBilirubinMgDl','Bilirrubina total (mg/dL)',0,100,6,'≥4 vale 1. Não substituir pela bilirrubina direta.','Hepático'),
 n('altUl','ALT (U/L)',0,1e9,6,'>102 vale 1. Não substituir por AST ou limite local do laboratório. Bilirrubina total e ALT são obrigatórias; máximo 1.','Hepático')
];
const known=new Set(phoenix8Fields.map(f=>f.id));
// Capture own descriptors once, retaining safe emergency data even if another key is hostile.
function snapshot(raw){
 const data=Object.create(null),errors=[];
 if(raw===null||typeof raw!=='object')return {data,errors:['profile']};
 try{if(Array.isArray(raw))errors.push('profile');const p=Object.getPrototypeOf(raw);if(p!==Object.prototype&&p!==null)errors.push('profile');}catch{errors.push('profile');}
 let keys;try{keys=Reflect.ownKeys(raw);}catch{return {data,errors:['profile']};}
 for(const k of keys){if(typeof k!=='string'||!known.has(k)){errors.push('profile');continue;}try{const d=Object.getOwnPropertyDescriptor(raw,k);if(!d||!Object.hasOwn(d,'value'))errors.push(k);else data[k]=d.value;}catch{errors.push(k);}}
 return {data,errors};
}
function precisionFits(v,p){const [m,e='0']=Number.prototype.toString.call(v).split('e');const places=(m.split('.')[1]?.length||0)-Number(e);return places<=p;}
function parse(field,v){
 if(field.type==='select'){
  if(typeof v!=='string'&&typeof v!=='number')return undefined;
  const option=field.options.find(o=>v===o.value||v===String(o.value));
  if(!option||option.value===2)return undefined;
  return field.booleanValue?option.value===1:option.value;
 }
 if(typeof v==='string'){
  if(v.length>40||!/^\d+(?:[.,]\d+)?$/.test(v)||(v.split(/[.,]/)[1]?.length||0)>field.precision)return undefined;
  v=Number(v.replace(',','.'));
 }
 if(typeof v!=='number'||!Number.isFinite(v)||Object.is(v,-0)||v<field.min||v>field.max||!precisionFits(v,field.precision))return undefined;
 return field.precision===0&&!Number.isInteger(v)?undefined:v;
}
const emergency='Priorize avaliação e suporte clínico imediato; não aguarde completar o escore.';
const descriptive='Descrição/pesquisa de oito domínios de disfunção e suporte. Zero não exclui infecção, sepse ou deterioração. Sem diagnóstico automático, probabilidade individual, tratamento ou alta. Completude local estrita: ausentes não recebem zero.';
const divergence='Perfil autoral 1.1.3: P/F=200 e S/F=220 sob ventilação invasiva podem valer 1, enquanto a tabela clínica principal inclui essas igualdades em 2. PAMs decimais também podem divergir. Não equiparar o subtotal de quatro domínios à ficha Phoenix vigente.';
const scopeReasons={ageMonths:'População <18 anos (<216 meses); confira a idade cronológica.',postConceptionalWeeks:'Exige idade pós-concepcional ≥37 semanas no início do encontro.',birthHospitalization:'Internação do nascimento até a primeira alta excluída.',suspectedInfection:'Contexto de infecção suspeita ou confirmada obrigatório para este perfil de pesquisa.',hoursSinceEncounter:'Uma observação nas primeiras 24 h: 0 ≤ h <24, desde o início do encontro hospitalar.',contemporaneousConfirmed:'Confirme observação contemporânea, unidades e preparo; não somar piores valores de horários diferentes.',supportNotPerioperativeOnly:'Suporte exclusivamente perioperatório ou não mapeado exige revisão fora deste preparo local.'};
function issueText(i){
 if(i.reason.startsWith('Known finite')||i.reason.startsWith('Explicit true'))return 'Informe '+(phoenix8Fields.find(f=>f.id===i.field)?.label||i.field)+' em sua unidade/faixa, sem presumir normalidade.';
 if(i.reason.startsWith('FiO2 above'))return 'Contradição: FiO₂ >0,21 não corresponde à ausência de qualquer suporte respiratório. Confira suporte e preparo; só remova/indique NA se o valor realmente não pertencer à observação. Total não emitido.';
 if(i.reason.startsWith('A second known'))return 'Duas razões respiratórias válidas contemporâneas foram fornecidas: selecione ambas no perfil OR. Não esconda a razão pior; NA/remoção só se o dado realmente não pertencer à observação, após conferir o preparo.';
 if(i.reason.startsWith('Inactive data'))return 'Dado respiratório não selecionado fora da unidade/faixa/precisão. Corrija o dado; não é normal nem zero.';
 if(i.field==='respiratoryBasis')return 'Confira a base respiratória: sem suporte exige não se aplica; com suporte selecione P/F, S/F ou ambas válidas.';
 if(i.field==='respiratorySupport')return 'Informe explicitamente o suporte respiratório presente.';
 if(i.field==='profile')return 'Selecione explicitamente o perfil autoral 1.1.3 com completude local estrita.';
 if(i.field==='preparation')return 'Selecione o preparo manual contemporâneo da release 1.1.3; não é seleção temporal EHR.';
 return scopeReasons[i.field]||'Dados inválidos ou não confirmados neste perfil.';
}
function warningText(w){if(w.startsWith('At P/F'))return divergence;if(w.startsWith('Both valid'))return 'Ambas as razões usam OR da release 1.1.3. Não se executa a seleção prospectiva por horários das notas EHR de 2026.';if(w.startsWith('Continuous MAP'))return 'PAM decimal em intervalo divergente da leitura literal da tabela clínica; aplicados limites autorais contínuos, sem arredondamento.';return 'Confira as limitações do perfil e preparo.';}
// Display only: derive the exact rational from the already validated decimal inputs.
// Never reuse a binary Number quotient, round the input, or feed this text into scoring.
function exactRatioText(numerator,denominator){
 const decimal=v=>{const [m,e='0']=Number.prototype.toString.call(v).split('e'),[w,f='']=m.split('.'),p=Number(e)-f.length,n=BigInt(w+f);return p>=0?[n*10n**BigInt(p),1n]:[n,10n**BigInt(-p)];};
 const [a,b]=decimal(numerator),[c,d]=decimal(denominator);let n=a*d,q=b*c,x=n,y=q;
 while(y){const r=x%y;x=y;y=r;}n/=x;q/=x;
 let finite=q;while(finite%2n===0n)finite/=2n;while(finite%5n===0n)finite/=5n;
 if(finite!==1n)return `${n}/${q} (fração exata)`;
 const whole=n/q;let remainder=n%q,digits='';
 while(remainder){remainder*=10n;digits+=String(remainder/q);remainder%=q;}
 return String(whole)+(digits?','+digits:'');
}
export function evaluatePhoenix8Adapter(raw){
 const snap=snapshot(raw),data=Object.create(null),errors=[...snap.errors],kernelInput=Object.create(null);
 for(const field of phoenix8Fields){const v=snap.data[field.id];if(field.allowNA&&(missing(v)||v==='NA'||v==='N/A'))data[field.id]=v;else{data[field.id]=parse(field,v);if(data[field.id]===undefined)errors.push(field.id);}if(field.id!=='danger_signs')kernelInput[field.id]=data[field.id];}
 const k=calculatePhoenix8(kernelInput),alerts=data.danger_signs===1?[emergency]:[];
 for(const i of k.issues)errors.push(known.has(i.field)?i.field:'profile');
 const allErrors=[...new Set(errors)],reasons=k.issues.map(issueText),contextReasons=k.issues.filter(i=>!i.reason.startsWith('Known finite')&&!i.reason.startsWith('Explicit true')&&!missing(data[i.field])).map(issueText);
 const common={complete:false,total:null,errors:allErrors,alerts,level:alerts.length?'high':'neutral',breakdown:[],notApplicable:k.notApplicable,profile:PROFILE,preparation:PREPARATION,components:k.components,phoenix4Subtotal:null,sepsis:null,septicShock:null,mortalityProbability:null,probability:null,treatmentRecommendation:null,dischargeRecommendation:null,warningNotes:k.warnings.map(warningText)};
 if(allErrors.length||k.total===null)return {...common,status:'incomplete',label:'Phoenix-8 não emitido',reason:reasons.join(' '),contextReasons,action:[...alerts,...contextReasons,'Há dados ausentes, inválidos ou fora deste contexto. Total indisponível.',descriptive].join(' '),audit:'Sem total nem subtotal final. Corrija as inconsistências antes de interpretar qualquer componente parcial.'};
 const names={respiratory:'Respiratório',cardiovascular:'Cardiovascular',coagulation:'Coagulação',neurologic:'Neurológico',endocrine:'Endócrino',immunologic:'Imunológico',renal:'Renal',hepatic:'Hepático'};
 const breakdown=Object.entries(k.components).map(([key,points])=>({label:names[key],points}));
 if(k.details.cardiovascular)breakdown.push({label:'Cardiovascular: agentes + lactato + PAM',points:k.components.cardiovascular,detail:Object.values(k.details.cardiovascular).join(' + ')+' = '+k.components.cardiovascular});
 if(k.details.coagulation)breakdown.push({label:'Coagulação: plaquetas + INR + D-dímero + fibrinogênio',points:k.components.coagulation,detail:k.details.coagulation.join(' + ')+'; teto 2 = '+k.components.coagulation});
 const band=AGE_BANDS.find(b=>data.ageMonths>=b.min&&data.ageMonths<b.max),ratios=[k.details.pfRatio!==null&&k.details.pfRatio!==undefined?'P/F '+exactRatioText(data.pao2Mmhg,data.fio2Fraction):'',k.details.sfRatio!==null&&k.details.sfRatio!==undefined?'S/F '+exactRatioText(data.spo2Percent,data.fio2Fraction):''].filter(Boolean).join('; ');
 return {...common,complete:true,status:'scored',total:k.total,displayValue:String(k.total),phoenix4Subtotal:k.phoenix4Subtotal,label:'Phoenix-8 · descrição de disfunção/suporte',breakdown,contextReasons:[],action:[...alerts,descriptive,...common.warningNotes].join(' '),audit:`Perfil computacional autoral 1.1.3 + completude local estrita. ${Object.values(k.components).join(' + ')} = ${k.total}. Observação manual contemporânea: ${data.hoursSinceEncounter} h desde início do encontro; não é máximo de 24 h. Idade ${data.ageMonths} meses, faixa ${band.min} a <${band.max}; PAM ${data.mapMmhg} mmHg (limites ${band.mapSevere}/${band.mapNormal}); creatinina ≥${band.creatinine} mg/dL pontua. Base respiratória: ${data.respiratoryBasis}; ${data.respiratorySupport==='none'?'sem suporte confirmado; oxigenação não aplicável.':ratios+'; decisões por racionais decimais exatos, sem arredondar razões.'} Subtotal de quatro domínios neste perfil: ${k.phoenix4Subtotal}/13; não equivale necessariamente à ficha Phoenix existente e não emite diagnóstico.`};
}
export const phoenix8Score={id:'phoenix8-author-113',name:'Phoenix-8 · autoral 1.1.3',shortName:'Phoenix-8',subtitle:'Perfil computacional descritivo/pesquisa · completude local estrita · 0–17',expanded:true,specialty:'Pediatria',specialties:['Pediatria','Emergência e UTI','Infectologia'],population:'<18 anos · infecção · fora da internação do nascimento',aliases:['Phoenix 8','Phoenix-8 autoral','oito órgãos','phoenix 1.1.3'],conditions:['Sepse','Disfunção de múltiplos órgãos'],purposes:['Disfunção orgânica'],keywords:['sepse','disfunção orgânica','oito órgãos','pesquisa'],searchTerms:['oito domínios','perfil computacional autoral'],reviewDate:'10/10/2026',range:'0–17',max:17,unit:'pontos',resultScale:true,
 scope:'Perfil computacional autoral CRAN 1.1.3, separado do Phoenix de quatro órgãos. Crianças <18 anos, idade pós-concepcional ≥37 semanas no início do encontro, fora da internação do nascimento, com infecção suspeita/confirmada. Uma observação manual contemporânea em 0 ≤ h <24 desde início do encontro hospitalar. Dados aplicáveis ausentes bloqueiam o total: adaptação local estrita, diferente do tratamento de ausentes do pacote de pesquisa. '+divergence,
 eligibilityConfirmation:'Conferi população, unidades, coerência das idades e preparo contemporâneo. Compreendo o perfil autoral 1.1.3, suas divergências da tabela clínica e a completude local; resultado descritivo, sem diagnóstico ou conduta automática.',
 formula:'Soma de oito domínios: respiratório (0–3) + cardiovascular (0–6) + coagulação (0–2) + neurológico (0–2) + endócrino, imunológico, renal e hepático (0–1 cada). Aplicam-se desigualdades estritas respiratórias da release 1.1.3; ambas as razões válidas usam OR. Respiração: sem suporte = 0; com qualquer suporte, 1 se P/F <400 ou S/F <292; com ventilação invasiva, 2 se P/F <200 ou S/F <220, ou 3 se P/F <100 ou S/F <148. Usar o maior critério; S/F somente com SpO₂ ≤97%. Cardiovascular soma agentes (0/1/≥2 valem 0/1/2), lactato (<5/5–<11/≥11 valem 0/1/2) e PAM. Faixas etárias em meses [0,1), [1,12), [12,24), [24,60), [60,144), [144,216): PAM vale 2 abaixo de 17/25/31/32/36/38 mmHg; vale 0 a partir de 31/39/44/45/49/52, respectivamente; entre esses limites vale 1. Nas mesmas faixas, creatinina ≥0,8/0,3/0,4/0,6/0,7/1,0 mg/dL vale 1. Coagulação: 1 por plaquetas <100 ×10⁹/L, INR >1,3, D-dímero >2 mg/L FEU ou fibrinogênio <100 mg/dL, teto 2. Neurológico: Glasgow ≤10 vale 1, pupilas bilateralmente fixas 2, sem somar. Endócrino: glicose <50 ou >150 mg/dL. Imunológico: neutrófilos <500 ou linfócitos <1000 células/µL. Hepático: bilirrubina total ≥4 mg/dL ou ALT >102 U/L. Máximo 1 em cada domínio adicional.',
 limits:descriptive+' '+divergence+' A completude local não foi validada como novo modelo; não pedir exames apenas para fechar a ficha. Este perfil não aplica ≥2 ao total de oito órgãos como diagnóstico do consenso Phoenix-4 de 2024. He 2026 estudou definição operacional Phoenix-8 ≥2 com adaptações locais, distinta desta release; não valida equivalência ou uso neonatal. Idade pós-concepcional não é idade gestacional ao nascer: datas, coerência biológica, procedência e disponibilidade temporal são conferidas no preparo manual, não certificadas automaticamente. Não há seleção de prontuário, carreamento, máximo de 24 h ou soma de máximos de órgãos. Com suporte, duas razões válidas fornecidas exigem ambas; NA só se o dado não pertencer à observação. S/F exige SpO₂ ≤97%. D-dímero FEU não é DDU; neutrófilos/linfócitos são células/µL. Preparo local de vasoativos: apenas agentes listados em suporte sistêmico contínuo no instante, sem bolus isolado/via local, duração mínima ou ponderação de dose. Suporte exclusivamente perioperatório não mapeado. Precisão local de até 6 casas, FiO₂ até 3; limites técnicos de formulário não são cortes de gravidade. O alerta explícito de emergência é local e independente da soma. Redação PT-BR editorial, sem validação transcultural. Divergência do suplemento impresso e identidade específica da correção editorial de março de 2024 permanecem ressalvas documentais, sem alterar a release fixada.',
 sources:[{title:'Schlapbach et al. · consenso Phoenix, JAMA 2024',url:'https://jamanetwork.com/journals/jama/fullarticle/2814297'},{title:'Sanchez-Pinto et al. · desenvolvimento, JAMA 2024',url:'https://jamanetwork.com/journals/jama/fullarticle/2814296'},{title:'Phoenix · código autoral release 1.1.3 fixada',url:'https://github.com/CU-DBMI-Peds/phoenix/tree/388b18e2d4dd236ad95b1e35b29dc7e62e33c50c'},{title:'DeWitt et al. · implementação Phoenix, JAMIA Open',url:'https://doi.org/10.1093/jamiaopen/ooae066'},{title:'He et al. 2026 · adaptação posterior, não equivalência à release',url:'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2849785'}],
 reuse:{kind:'independent-factual-method-implementation',attribution:'Código e síntese próprios a partir de critérios publicados e release autoral MIT; sem figuras/tabelas editoriais reproduzidas. Kernel local de implementação própria do perfil autoral, congelado com revisão independente; não executa código externo.'},fields:phoenix8Fields};
phoenix8Score.safeCalculate=evaluatePhoenix8Adapter;phoenix8Score.compute=evaluatePhoenix8Adapter;phoenix8Score.safeValidate=v=>evaluatePhoenix8Adapter(v).errors;phoenix8Score.validate=phoenix8Score.safeValidate;
phoenix8Score.assessPartial=v=>{const r=evaluatePhoenix8Adapter(v),a=[...r.alerts,...r.contextReasons];return a.length?{level:r.alerts.length?'high':'medium',alert:a.join(' ')}:null;};
export const phoenix8Scores=[phoenix8Score];
