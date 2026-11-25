/** PCPC/POPC: registro manual pontual, síntese factual própria do perfil BR2023.
 * Não classifica vinhetas, soma itens, diagnostica morte ou implementa comparação.
 */
export const PERFORMANCE_PROFILE='pcpc-popc-br2023-factual';
export const performanceCategories={"PCPC":[{"value":1,"label":"Função cerebral esperada para a idade","ownDescription":"Desenvolvimento e funcionamento cerebral compatíveis com a idade; quando pertinente, participação escolar habitual sem déficit identificado.","caution":"Não exige que a criança já esteja matriculada ou tenha idade escolar.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"},{"value":2,"label":"Comprometimento cerebral leve","ownDescription":"Permanece consciente e alerta, interagindo de modo adequado à idade; déficit neurológico leve pode coexistir com ensino regular e eventual defasagem escolar.","caution":"A defasagem isolada, sem atribuição funcional neurológica, não determina a categoria.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"},{"value":3,"label":"Comprometimento cerebral moderado","ownDescription":"Consciente e com capacidade cerebral suficiente para autonomia nas atividades diárias esperadas para a idade; quando pertinente à etapa de desenvolvimento, há comprometimento de aprendizagem ou necessidade de ensino adaptado por essa função.","caution":"Não exige referência escolar de lactente ou pré-escolar; o tipo administrativo de escola, sozinho, não constitui avaliação clínica.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"},{"value":4,"label":"Comprometimento cerebral grave","ownDescription":"Consciente, mas necessita ajuda cotidiana além da esperada para a idade em decorrência do comprometimento cerebral.","caution":"Limitação exclusivamente física não deve ser atribuída à PCPC como disfunção cerebral.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"},{"value":5,"label":"Coma ou estado vegetativo","ownDescription":"Coma ou estado vegetativo clinicamente estabelecido pelo profissional. No estado vegetativo, pode haver vigília sem interação com o ambiente; reflexos, abertura dos olhos ou ciclos sono–vigília podem persistir.","caution":"Baixa interação isolada não determina categoria 5. Não derivar de ventilação, sedação, EEG ou Glasgow; não representa diagnóstico automatizado, morte ou irreversibilidade.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"},{"value":6,"label":"Morte cerebral já formalmente documentada","ownDescription":"Registro de diagnóstico formal de morte cerebral/encefálica estabelecido por processo clínico próprio, válido no momento representado.","caution":"Guarda local: a escala não diagnostica morte encefálica. Não operacionalizar a lista histórica de sinais/exames nem converter qualquer óbito em 6.","source":"br2023: tabela 3; tabela 5/Discussion para contexto"}],"POPC":[{"value":1,"label":"Função global esperada para a idade","ownDescription":"Função cerebral na categoria 1 e atividades diárias globalmente compatíveis com a idade.","caution":"Necessário revisar também limitações não neurológicas.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"},{"value":2,"label":"Comprometimento global leve","ownDescription":"Limitação global leve por alteração cerebral e/ou física, mantendo consciência e independência funcional esperada para a idade.","caution":"PCPC pode ser melhor que POPC; não copiar uma escala para a outra.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"},{"value":3,"label":"Comprometimento global moderado","ownDescription":"Limitação moderada, cerebral e/ou de outros sistemas, com consciência e autonomia nas atividades diárias preservadas para a idade, mas prejuízo do desempenho funcional, incluindo desempenho escolar quando aplicável.","caution":"O grau é adjudicado pelas descrições; doença não cerebral isolada pode ser a causa.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"},{"value":4,"label":"Comprometimento global grave","ownDescription":"Limitação grave, cerebral e/ou de outros sistemas, com consciência, mas dependência cotidiana acima da esperada para a idade.","caution":"Pode haver PCPC 1 e POPC 4 quando a limitação grave for exclusivamente não cerebral.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"},{"value":5,"label":"Coma ou estado vegetativo","ownDescription":"A tabela deste perfil remete à PCPC 5 do mesmo momento.","caution":"Exigir confirmação explícita de ambas quando o par for solicitado; não preencher POPC automaticamente.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"},{"value":6,"label":"Morte cerebral já formalmente documentada","ownDescription":"A tabela deste perfil remete à PCPC 6 do mesmo momento e com o mesmo diagnóstico formal prévio.","caution":"Óbito sem diagnóstico formal de morte cerebral não é automaticamente esta categoria no perfil selecionado.","source":"br2023: tabela 4; tabela 5/Discussion para contexto"}]};
const sel=(id,label,options,hint,group='Preparo da classificação')=>({id,label,type:'select',noPoints:true,options:options.map(([value,label])=>({value,label})),hint,group});
const yes=(id,label,hint)=>sel(id,label,[[1,'Sim, confirmado'],[0,'Não / ainda não confirmado'],[-1,'Desconhecido']],hint);
const commonFields=[
 sel('danger_signs','Há perigo atual ou piora clínica importante que exige avaliação imediata?',[[1,'Sim'],[0,'Não, após avaliação atual'],[-1,'Desconhecido / não avaliado']], 'Guarda local de segurança atual, independente do período histórico e da categoria. Não deduzir urgência de um basal grave.','Segurança atual'),
 sel('profile','Perfil da classificação',[[PERFORMANCE_PROFILE,'PCPC/POPC · síntese factual BR2023']], 'Base: Chiarastelli et al., 2023. Redação própria, não formulário oficial integral nem validação psicométrica nova.'),
 {id:'ageMonths',label:'Idade no período funcional representado (meses)',type:'number',min:0,max:216,step:0.000001,precision:6,noPoints:true,group:'População e período',hint:'Recorte local desta ficha: 0 a menos de 216 meses, não limite universal do instrumento. Não usar idade na entrevista retrospectiva nem arredondar para enquadrar. Até seis casas decimais.'},
 yes('picu_context','O período pertence ao contexto de UTIP, ou à história/seguimento relacionado a esse cuidado?','Inclui reconstrução pré-doença e seguimento relacionados à UTIP. Não equivale à CPC adulta nem a exclusão clínica universal fora do recorte.'),
 sel('assessment_role','Qual período funcional esta classificação representa?',[
  ['premorbid_baseline','Basal anterior à doença aguda, reconstruído'],['acute_picu_admission','Estado já agudo na admissão à UTIP'],['picu_discharge','Alta da UTIP'],['hospital_discharge','Alta hospitalar após UTIP'],['specified_followup','Seguimento especificado no registro clínico'],['previous_assessment_reference','Avaliação anterior identificada como referência']
 ],'São referências distintas. A data da entrevista não é o período representado. Esta ficha registra só uma observação, sem comparação ou delta.','População e período'),
 yes('represented_period_known','O período funcional representado está identificado de forma suficiente no registro clínico?','Confirmação manual. Não inventar hora exata do basal, importar janelas FSS de 4/12/24 h ou misturar observações distintas. A ferramenta não recebe datas e não certifica cronologia.'),
 sel('information_source','Fonte da informação funcional',[
  ['medical_record','Prontuário'],['parent_or_guardian','Pais ou responsáveis'],['clinical_caregiver','Profissional ou cuidador informado sobre a criança'],['multidisciplinary_assessment','Avaliação multiprofissional'],['combined','Fontes combinadas']
 ],'Uma fonte suficiente pode bastar; informações familiares e de cuidadores precisam ser adjudicadas por profissional familiarizado com desenvolvimento infantil.'),
 yes('source_sufficient','A informação é suficiente e coerente para atribuir a categoria solicitada?','Incerteza impeditiva, conflito de fontes ou observação insuficiente não se tornam categoria 1.'),
 yes('professional_adjudication','A categoria foi adjudicada por profissional familiarizado com desenvolvimento infantil?','A calculadora registra a escolha manual. Não substitui a avaliação clínica nem exige especialidade profissional exclusiva.'),
 yes('development_reviewed','Idade, desenvolvimento, atribuição cerebral/não cerebral e interferências foram revisados?','Dependência fisiológica da idade não é incapacidade grave. Escola é referência quando pertinente, não teste por matrícula ou acesso educacional. Sedação, bloqueio e doença aguda não têm correção numérica; não modificar suporte para preencher a escala.'),
 sel('vital_status','Estado vital no período funcional representado',[
  ['alive','Em vida, sem diagnóstico formal de morte encefálica nesse período'],['brain_death_formally_documented','Morte cerebral/encefálica formalmente documentada nesse período'],['other_death','Outro óbito, sem esse diagnóstico formal documentado'],['unknown','Desconhecido / período não esclarecido']
 ],'Óbito posterior não apaga automaticamente uma classificação anterior em vida. Categoria 5 não significa morte ou irreversibilidade. Este perfil não usa 6 para qualquer óbito. A confirmação formal abaixo só se aplica ao estado documentado; ao mudar para outro estado, seu rascunho canônico fica inativo e não integra a classificação, a memória ou a cópia.'),
 {...yes('brain_death_documentation','Confirmei diagnóstico formal de morte encefálica previamente estabelecido e válido nesse período?','Guarda local: a escala não realiza o diagnóstico, não recebe lista de sinais/exames e não substitui o processo clínico próprio. Fora do estado documentado, uma resposta residual é apenas rascunho inativo, nunca confirmação aplicada.'),activeWhen:{field:'vital_status',value:'brain_death_formally_documented'}},
];
// Only the conditional visibility controller refreshes the form; it imputes no clinical answer.
commonFields.find(f=>f.id==='vital_status').refreshFields=true;
const categoryField=(instrument,id,label)=>sel(id,label,[...performanceCategories[instrument].map(c=>[c.value,`${c.value} · ${c.label}: ${c.ownDescription}`]),[-1,'Indeterminado / informação insuficiente']],instrument==='PCPC'?'Seleção clínica manual da pior descrição aplicável ao período definido; não deriva de Glasgow, FSS, sedação, ventilação ou diagnóstico isolado. Coma/estado vegetativo devem estar clinicamente estabelecidos; baixa interação isolada não basta.':'Seleção global própria, incluindo função cerebral e não cerebral. Não copiar a PCPC nem calcular pelo máximo. Categorias 5/6 remetem à PCPC correspondente neste perfil.','Categoria manual');
export const pcpcFields=[...commonFields.map(f=>({...f})),categoryField('PCPC','pcpc_category','Categoria PCPC adjudicada')];
export const popcFields=[...commonFields.map(f=>({...f})),yes('pcpc_same_context','A PCPC revisada pertence à mesma pessoa, período funcional e perfil BR2023 desta POPC?','Confirmação manual, sem nome ou identificador sensível. Todas as confirmações de fonte, suficiência, desenvolvimento e adjudicação desta ficha abrangem ambas as categorias.'),categoryField('PCPC','pcpc_category','PCPC contemporânea revisada'),categoryField('POPC','popc_category','Categoria POPC adjudicada')];
const definitions={PCPC:pcpcFields,POPC:popcFields};
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar a classificação funcional. Este alerta refere-se ao perigo atual informado, não à categoria histórica.';
function capture(raw,fields){
 const data=Object.create(null),errors=new Set(),allowed=new Set(fields.map(f=>f.id));let invalidRecord=false;
 if(raw===null||typeof raw!=='object')return {data,errors:new Set(['profile']),invalidRecord:true};
 try{const prototype=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(prototype!==Object.prototype&&prototype!==null)){invalidRecord=true;errors.add('profile');}}catch{invalidRecord=true;errors.add('profile');}
 let keys;try{keys=Reflect.ownKeys(raw);}catch{return {data,errors:new Set(['profile']),invalidRecord:true};}
 for(const key of keys){
  let descriptor;try{descriptor=Object.getOwnPropertyDescriptor(raw,key);}catch{errors.add(typeof key==='string'&&allowed.has(key)?key:'profile');continue;}
  if(typeof key!=='string'||!allowed.has(key)){errors.add('profile');continue;}
  if(!descriptor||!Object.hasOwn(descriptor,'value')){errors.add(key);continue;}
  data[key]=descriptor.value;
 }
 return {data,errors,invalidRecord};
}
function parseSelect(value,field){
 if(typeof value!=='string'&&typeof value!=='number')return null;
 if(typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))return null;
 const option=field.options.find(o=>value===o.value||(typeof value==='string'&&value===String(o.value)));
 return option?option.value:null;
}
function parseAge(value){
 if(typeof value!=='string'&&typeof value!=='number')return null;
 if(typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))return null;
 const text=typeof value==='number'?String(value):value;
 if(!/^(?:0|[1-9]\d*)(?:[.,]\d{1,6})?$/.test(text))return null;
 const n=Number(text.replace(',','.'));return Number.isFinite(n)&&n>=0&&n<216?n:null;
}
const describe=(fields,id,value)=>fields.find(f=>f.id===id)?.options?.find(o=>o.value===value)?.label??String(value);
export function evaluatePerformance(instrument,raw){
 if(typeof instrument!=='string'||!Object.hasOwn(definitions,instrument))return {complete:false,total:null,category:null,displayValue:'Não classificado',errors:['profile'],status:'invalid_request',level:'neutral',alerts:[],reason:'Instrumento desconhecido.',label:'Classificação não emitida',action:'Escolha PCPC ou POPC.',audit:'Nenhuma categoria emitida.',breakdown:[]};
 const fields=definitions[instrument],snap=capture(raw,fields),errors=snap.errors,data=snap.data,parsed=Object.create(null),reasons=[];
 const add=(id,message)=>{errors.add(id);if(message)reasons.push(message);};
 for(const field of fields){
  const v=data[field.id];
  // An inactive field may be absent, but hostile data never becomes a harmless default.
  const active=!field.activeWhen||data[field.activeWhen.field]===field.activeWhen.value;
  if(!active&&(v===undefined||v===null||v===''))continue;
  const p=field.type==='number'?parseAge(v):parseSelect(v,field);
  if(p===null){add(field.id);continue;}parsed[field.id]=p;
 }
 if(snap.invalidRecord)add('profile','Entrada estrutural inválida; use somente dados próprios de um objeto simples.');
 const danger=parsed.danger_signs===1,alerts=danger?[urgent]:[];
 const documentationApplicable=snap.invalidRecord?null:parsed.vital_status==='brain_death_formally_documented'?true:parsed.vital_status==='alive'||parsed.vital_status==='other_death'?false:null;
 if(documentationApplicable!==true)delete parsed.brain_death_documentation;
 for(const id of ['picu_context','represented_period_known','source_sufficient','professional_adjudication','development_reviewed'])if(parsed[id]!==1)add(id);
 if(instrument==='POPC'&&parsed.pcpc_same_context!==1)add('pcpc_same_context','Confirme mesma pessoa, período e perfil da PCPC revisada.');
 if(parsed.ageMonths===undefined)add('ageMonths','Idade ausente, inválida ou fora do recorte local de 0 a menos de 216 meses no período representado.');
 const pcpc=parsed.pcpc_category,popc=parsed.popc_category,requested=instrument==='PCPC'?pcpc:popc;
 if(!Number.isInteger(pcpc)||pcpc<1||pcpc>6)add('pcpc_category');
 if(instrument==='POPC'&&(!Number.isInteger(popc)||popc<1||popc>6))add('popc_category');
 const categories=instrument==='PCPC'?[pcpc]:[pcpc,popc];
 if(parsed.vital_status==='alive'){
  if(categories.includes(6))add(instrument==='POPC'&&popc===6?'popc_category':'pcpc_category','Categoria 6 é incompatível com estado em vida sem diagnóstico formal nesse período.');
 }else if(parsed.vital_status==='brain_death_formally_documented'){
  if(parsed.brain_death_documentation!==1)add('brain_death_documentation','Categoria 6 exige diagnóstico formal prévio confirmado no período representado.');
  if(pcpc!==6)add('pcpc_category','Diagnóstico formal de morte encefálica é incompatível com PCPC 1–5 neste perfil.');
  if(instrument==='POPC'&&popc!==6)add('popc_category','Diagnóstico formal de morte encefálica é incompatível com POPC 1–5 neste perfil.');
 }else add('vital_status','Estado vital desconhecido ou outro óbito não permite emitir categoria funcional neste perfil. Não converter automaticamente em 6.');
 if(instrument==='POPC'&&Number.isInteger(pcpc)&&pcpc>=1&&pcpc<=6&&Number.isInteger(popc)&&popc>=1&&popc<=6){
  const consistent=(pcpc>=5||popc>=5)?pcpc===popc:popc>=pcpc;
  if(!consistent)add('popc_category','PCPC/POPC discordantes pela guarda local BR2023. Revise o contexto e as duas escolhas; não há preenchimento automático pelo máximo.');
 }
 const complete=errors.size===0;
 if(!complete){
  const missing=[...errors];const reason=[...new Set([...reasons,'Preencha ou revise: '+missing.map(id=>fields.find(f=>f.id===id)?.label??id).join('; ')+'.',...alerts])].join(' ');
  return {complete:false,total:null,category:null,displayValue:'Não classificado',status:'incomplete',instrument,documentationApplicable,formalDocumentationConfirmed:null,profileId:parsed.profile??null,assessmentRole:parsed.assessment_role??null,errors:missing,level:danger?'high':'neutral',alerts,reason,label:'Classificação não emitida',action:reason,audit:'Nenhuma categoria adjudicada foi emitida; dados ausentes ou incoerentes não foram substituídos.',breakdown:[]};
 }
 const category=performanceCategories[instrument].find(c=>c.value===requested);
 const timing=describe(fields,'assessment_role',parsed.assessment_role),source=describe(fields,'information_source',parsed.information_source),vital=describe(fields,'vital_status',parsed.vital_status);
 const audit=`${instrument}, perfil factual BR2023. Categoria manual ${requested}; não há soma. Período: ${timing}, identificado e adjudicado manualmente no registro clínico; sem data/hora inventada ou certificação automática de cronologia. Idade nesse período: ${parsed.ageMonths} meses; recorte local <216 meses, não limite universal da escala. Fonte: ${source}. Contexto UTIP, suficiência, desenvolvimento/atribuição e adjudicação profissional confirmados. Estado vital: ${vital}.${requested!==6?' Confirmação formal de morte encefálica: não aplicável; eventual rascunho inativo não foi usado.':''}${requested===6?' Diagnóstico formal de morte cerebral/encefálica previamente estabelecido e válido nesse período, confirmado pelo avaliador; a escala não realizou diagnóstico.':''}${instrument==='POPC'?` PCPC contemporânea revisada ${pcpc}; mesma pessoa, período e perfil confirmados. Guarda local de consistência atendida; POPC ${popc} foi selecionada separadamente.`:''} Registro pontual; comparação e delta não implementados.`;
 return {complete:true,total:null,category:requested,displayValue:`Categoria ${requested}`,status:'classified',instrument,documentationApplicable,formalDocumentationConfirmed:documentationApplicable?true:null,profileId:PERFORMANCE_PROFILE,assessmentRole:parsed.assessment_role,errors:[],level:danger?'high':'neutral',alerts,label:category.label,action:`${category.ownDescription} ${category.caution} Registro ordinal: não representa probabilidade, diagnóstico automático, recomendação de alta ou limitação de suporte.`,audit,breakdown:[{label:`${instrument} adjudicada`,detail:`Categoria ${requested} · ${category.label}`}],...(instrument==='POPC'?{reviewedPcpcCategory:pcpc}:{})};
}
const source={title:'Chiarastelli et al. · adaptação transcultural PCPC/POPC-BR · Rev Paul Pediatr. 2023;41:e2022030 · tabelas 3–5 · CC BY 4.0',url:'https://www.scielo.br/j/rpp/a/hsxQ4MvVCxbt8pGKxbyZdCy/?lang=en'};
function score(instrument){
 const id=instrument==='PCPC'?'pcpc-pediatric-br2023':'popc-pediatric-br2023',fields=definitions[instrument];
 return {id,aliases:[instrument, instrument==='PCPC'?'Pediatric Cerebral Performance Category':'Pediatric Overall Performance Category'],name:`${instrument} pediátrica · perfil BR2023`,subtitle:instrument==='PCPC'?'Categoria de desempenho cerebral · registro manual pontual':'Categoria de desempenho global · registro manual pontual',specialty:'Pediatria',specialties:['Pediatria','Emergência e UTI'],population:'UTIP/história relacionada · <18 anos no período avaliado (recorte local)',range:'1–6',max:6,unit:'categoria',categorical:true,resultScale:false,reviewDate:'11/10/2026',scope:`${instrument}: avaliação funcional manual no contexto de UTIP ou sua história/seguimento. Recorte operacional local de 0 a <216 meses no período representado, não faixa universal de validação. Perfil factual baseado nas tabelas brasileiras de 2023; uma única observação.`,fields,
 formula:`Não há soma. O profissional escolhe a pior categoria aplicável às descrições do período definido, conforme idade/desenvolvimento. ${performanceCategories[instrument].map(c=>`${c.value}: ${c.ownDescription}`).join(' ')}${instrument==='POPC'?' Guarda local de consistência: nas categorias 1–4, POPC não pode ser melhor que a PCPC contemporânea; se qualquer uma for 5 ou 6, as duas devem coincidir. Não é fórmula de conversão, não escolhe a categoria pelo máximo e não dispensa julgamento clínico.':''}`,
 limits:'Classificação ordinal de baixa granularidade: os intervalos não são unidades iguais, e uma categoria não mede risco individual. Dependência esperada pela idade não é incapacidade patológica. Referência escolar é contextual; não inferir pelo tipo de escola, acesso ou matrícula. Categoria 5 exige coma/estado vegetativo clinicamente estabelecido e não significa morte ou irreversibilidade. Categoria 6 neste perfil requer diagnóstico formal prévio de morte cerebral/encefálica válido no período, sem testes diagnósticos pela escala; outros perfis usam óbito mais amplo e não são intercambiáveis. Sedação, bloqueio e demais interferências precisam de adjudicação; não retirar suporte para classificar. Não converter FSS, Glasgow ou CPC adulta. Registro pontual histórico não implementa comparação/delta. Recorte <18 anos é política local. Síntese própria da adaptação BR2023: não reproduz o original integral de 1992, não é o formulário traduzido integral, não alega endosso nem validação psicométrica brasileira nova.',sources:[source,{title:'Creative Commons Attribution 4.0 · licença da fonte brasileira',url:'https://creativecommons.org/licenses/by/4.0/'}],reuse:{license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',attribution:'Síntese editorial baseada em Chiarastelli et al., Rev Paul Pediatr. 2023;41:e2022030, adaptação das escalas de Debra H. Fiser (1992). Descrições reescritas e guardas locais; sem endosso ou nova validação psicométrica.'},
 safeCalculate:raw=>evaluatePerformance(instrument,raw),safeValidate:raw=>evaluatePerformance(instrument,raw).errors,assessPartial:raw=>{const r=evaluatePerformance(instrument,raw);return {level:r.level,alert:r.alerts[0]||null};}};
}
export const pcpcScore=score('PCPC');
export const popcScore=score('POPC');
export const pediatricPerformanceScores=[pcpcScore,popcScore];
