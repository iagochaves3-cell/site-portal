/** Own factual adapter; frozen literal wPCDAI reference remains separate. */
import {PROFILE,evaluateWpcdai} from './wpcdai-reference.mjs';
export {PROFILE};
const select=(id,label,options,hint,group)=>({id,label,type:'select',noPoints:true,options:options.map(([value,label])=>({value,label})),hint,group});
const confirmations=[
 {
  "id": "crohnDiagnosisEstablished",
  "label": "Doença de Crohn já estabelecida?",
  "hint": "O diagnóstico foi estabelecido antes de aplicar este índice; pode ter sido confirmado nesta mesma avaliação. O índice não faz o diagnóstico nem estima a probabilidade de Crohn."
 },
 {
  "id": "professionalAdjudicationConfirmed",
  "label": "Categorias e preparo revisados por profissional?",
  "hint": "Profissional apto adjudicou relato, exame e exames laboratoriais. Categorias não são inferidas automaticamente de texto livre."
 },
 {
  "id": "sameAssessmentConfirmed",
  "label": "Todos os componentes pertencem à mesma avaliação?",
  "hint": "Mesma pessoa e avaliação clínica, com fontes identificadas; não misturar visitas. Não é necessário registrar identificadores pessoais nesta ficha."
 },
 {
  "id": "historyPast7DaysConfirmed",
  "label": "História referente à semana precedente confirmada?",
  "hint": "Dor, funcionamento/bem-estar e evacuações resumem os sete dias precedentes. Evacuações são descritas por dia. Não se importa média de diário de outro protocolo."
 },
 {
  "id": "labsClinicallyContemporaneousConfirmed",
  "label": "VHS e albumina medidos e pertinentes à avaliação?",
  "hint": "Datas e fontes laboratoriais conhecidas, com pertinência clínica confirmada. Não há prazo máximo universal de validade adotado aqui. PCR não substitui VHS."
 },
 {
  "id": "weightReferenceKnownConfirmed",
  "label": "Referência ponderal conhecida e documentada?",
  "hint": "Origem e período do peso de referência identificados. Basal ausente não vira estabilidade, ganho ou normalidade."
 },
 {
  "id": "weightReferenceIntervalReviewed",
  "label": "Intervalo de comparação ponderal revisado?",
  "hint": "Intervalo clinicamente pertinente documentado; não impor sete dias ao peso nem inventar basal normal. A ficha não recebe datas ou pesos brutos e não verifica o calendário."
 },
 {
  "id": "clinicalCriteriaUnambiguousConfirmed",
  "label": "Categorias clínicas inequivocamente estabelecidas?",
  "hint": "Padrões mistos ou incertos precisam de adjudicação. Esta confirmação não transforma opção desconhecida em categoria válida nem resolve lacunas numéricas."
 },
 {
  "id": "noMissingNormalImputationConfirmed",
  "label": "Nenhum dado ausente foi imputado como normal ou zero?",
  "hint": "Exige confirmação explícita de nenhuma imputação, inclusive externa, de componente não medido, desconhecido ou impossível de avaliar para normal/zero. Ausência ou negativa impede calcular. Não solicitar exames apenas para completar o índice."
 }
];
const categories={
 "pain": [
  "Dor abdominal · semana precedente",
  [
   [
    "none",
    "Ausência de dor estabelecida"
   ],
   [
    "mild",
    "Breve e leve, sem limitar atividades"
   ],
   [
    "moderate-severe",
    "Categoria moderada/grave adjudicada"
   ]
  ],
  "Categoria de maior intensidade/impacto: padrão diário, prolongado, limitante ou noturno conforme rubrica profissional. A enumeração não é algoritmo booleano; caso incerto deve permanecer desconhecido."
 ],
 "function": [
  "Funcionamento e bem-estar · semana precedente",
  [
   [
    "well",
    "Bem-estar e atividades habituais preservados"
   ],
   [
    "occasional-limitation",
    "Limitação ocasional de atividades"
   ],
   [
    "frequent-limitation",
    "Limitação frequente e bem-estar muito comprometido"
   ]
  ],
  "Julgar atividades compatíveis com a idade; não inferir normalidade de ausência de relato."
 ],
 "stools": [
  "Evacuações · padrão diário na semana precedente",
  [
   [
    "lowest",
    "Até uma líquida/dia, sem sangue"
   ],
   [
    "intermediate",
    "Até duas semiformadas com pouco sangue, ou duas a cinco líquidas/dia"
   ],
   [
    "highest",
    "Sangramento franco, ≥6 líquidas/dia ou diarreia noturna"
   ]
  ],
  "Rubrica profissional, sem inventar volume de sangue ou frequência noturna mínima. Padrão misto sem enquadramento inequívoco fica desconhecido."
 ],
 "perirectal": [
  "Doença perirretal · exame adjudicado",
  [
   [
    "none",
    "Sem doença ou apenas apêndices cutâneos assintomáticos"
   ],
   [
    "indolent",
    "Uma ou duas fístulas pouco ativas, drenagem escassa e sem sensibilidade"
   ],
   [
    "active",
    "Doença ativa adjudicada: fístula/drenagem/sensibilidade/abscesso"
   ]
  ],
  "Categoria ativa requer enquadramento clínico da rubrica; relato incompleto não basta. Pouca representação de doença perianal nas coortes limita generalização."
 ]
};
const numbers=[
 {id:'ageYears',label:'Idade na avaliação (anos)',type:'number',min:0,max:120,step:'any',noPoints:true,hint:'Até seis casas decimais. Recorte local pontuável de 4 a menos de 18 anos, sem arredondar. Não é limite universal do instrumento; as coortes incluíram participantes de 4–19 anos.',group:'Contexto e medidas'},
 {id:'esrMmH',label:'VHS medido (mm/h)',type:'number',min:0,max:300,step:'any',noPoints:true,hint:'<20: 0; 20–50 inclusive: 7,5; >50: 15 pontos. Teto 300 é guarda técnica local, não plausibilidade clínica certificada. PCR não substitui este exame.',group:'Contexto e medidas'},
 {id:'albuminGdL',label:'Albumina medida (g/dL)',type:'number',min:0,max:10,step:'any',noPoints:true,hint:'≥3,5: 0; 3,1–3,4: 10; ≤3,0: 20 pontos. (3,0;3,1) e (3,4;3,5) são lacunas literais: sem total, sem arredondar. Se a fonte usa g/L, converter explicitamente fora da ficha ÷10, preservando precisão. Teto 10 é guarda local.',group:'Contexto e medidas'}
];
export const wpcdaiFields=[
 select('danger_signs','Há instabilidade atual ou piora que exige avaliação imediata?',[[1,'Sim'],[0,'Não, após avaliação atual'],[-1,'Desconhecido / não avaliado']],'Guarda local de segurança independente do índice. Não deduzir urgência pelo total, por categoria perirretal ou por fisiologia histórica; não aguardar completar a ficha diante de emergência.','Segurança atual'),
 select('profile','Perfil pontual',[[PROFILE,'wPCDAI · rubrica/pesos NASPGHAN 2014 · cortes Turner 2012 · literal restrito']],'Versão fixa de oito domínios. Não é PCDAI clássico, abbrPCDAI, shPCDAI, modPCDAI nem protocolo de diário; não trocar de versão por falta de dados.','Versão'),
 ...confirmations.map(f=>select(f.id,f.label,[[1,'Sim, confirmado por profissional'],[0,'Não, requisito não satisfeito'],[-1,'Desconhecido / preparo incompleto']],f.hint,'Preparo profissional')),
 ...numbers,
 ...Object.entries(categories).map(([id,[label,options,hint]])=>select(id,label,[...options,[-1,'Desconhecido / categoria não estabelecida']],hint,'Categorias clínicas')),
 select('eimPresent','Há manifestação extraintestinal qualificada?',[[1,'Sim, pelo menos uma'],[0,'Não, ausência estabelecida'],[-1,'Desconhecido / não foi possível estabelecer']],'10 pontos por uma ou mais: febre ≥38,5 °C por 3 dias na semana, artrite definida, uveíte, eritema nodoso ou pioderma gangrenoso. Múltiplas manifestações não somam pontos adicionais. Não usar sintoma inespecífico como diagnóstico automático.','Categorias clínicas'),
 select('weightChange','Evolução ponderal adjudicada',[['gain','Ganho de peso'],['voluntary-stable','Estabilidade voluntária'],['involuntary-stable','Estabilidade involuntária'],['voluntary-loss','Perda voluntária'],['involuntary-loss','Perda involuntária'],[-1,'Desconhecida / referência insuficiente']],'Ganho/estabilidade voluntária: 0; estabilidade involuntária: 5 pontos. Em perda, usar percentual e ramo literal abaixo. Referência e intervalo precisam ser conhecidos; nenhuma ausência vira estabilidade.','Peso'),
 {id:'weightLossPercent',label:'Perda de peso (%) · preencher somente nos ramos de perda',type:'number',min:0,max:100,step:'any',noPoints:true,placeholder:'Vazio em ganho/estabilidade; percentual em perda',hint:'Percentual externo = 100×(peso de referência − peso atual)/peso de referência, mesmas unidades e precisão preservada. Perda voluntária: 0<p<10 dá 0; ≥10 é conflito literal, sem total. Involuntária: 1–9 inclusive dá 5; 10≤p<100 dá 10; (0;1) e (9;10) ficam sem total. Perda declarada com 0 é incompatível. Em ganho/estabilidade, deixe vazio: qualquer residual, inclusive 0, bloqueia; limpe explicitamente ao mudar o estado.',group:'Peso'}
];
const bools=new Set([...confirmations.map(f=>f.id),'eimPresent']);
function capture(raw){
 const data=Object.create(null),issues=[],allowed=new Set(wpcdaiFields.map(f=>f.id));const invalid=(field,reason)=>issues.push({field,kind:'invalid',reason});
 if(raw===null||typeof raw!=='object')return {data,issues:[{field:'profile',kind:'invalid',reason:'Objeto de dados obrigatório.'}],safeDanger:false};
 try{const p=Object.getPrototypeOf(raw);if(Array.isArray(raw)||(p!==Object.prototype&&p!==null))invalid('profile','Protótipo não admitido.');}catch{invalid('profile','Falha ao ler protótipo.');}
 // Independent, single own safety descriptor: may preserve an alert, never recover completeness.
 let safetyDescriptor,safetyReadFailed=false;
 try{safetyDescriptor=Object.getOwnPropertyDescriptor(raw,'danger_signs');}catch{safetyReadFailed=true;invalid('danger_signs','Falha ao ler descritor próprio de segurança.');}
 const safeDanger=!!(safetyDescriptor&&Object.hasOwn(safetyDescriptor,'value')&&(safetyDescriptor.value===1||safetyDescriptor.value==='1'));
 let keys;try{keys=Reflect.ownKeys(raw);}catch{invalid('profile','Falha na primeira lista de chaves.');return {data,issues,safeDanger};}
 for(const k of keys){let d;if(k==='danger_signs'){if(safetyReadFailed)continue;d=safetyDescriptor;}else try{d=Object.getOwnPropertyDescriptor(raw,k);}catch{invalid(typeof k==='string'&&allowed.has(k)?k:'profile','Falha ao ler descritor.');continue;}
  if(typeof k!=='string'||!allowed.has(k)){invalid('profile','Campo não previsto.');continue;}if(!d||!Object.hasOwn(d,'value')){invalid(k,'Accessor recusado sem invocação.');continue;}data[k]=d.value;
 }
 return {data,issues,safeDanger};
}
function selection(v,f){if(typeof v!=='string'&&typeof v!=='number')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const o=f.options.find(o=>v===o.value||(typeof v==='string'&&v===String(o.value)));return o?{ok:true,value:o.value}:{ok:false};}
function decimal(v){if(typeof v!=='number'&&typeof v!=='string')return {ok:false};if(typeof v==='number'&&(!Number.isFinite(v)||Object.is(v,-0)))return {ok:false};const t=String(v);if(!/^(?:0|[1-9]\d*)(?:[.,]\d{1,6})?$/.test(t))return {ok:false};return {ok:true,value:Number(t.replace(',','.'))};}
const urgent='Priorize avaliação e suporte clínico imediato; não aguarde completar o wPCDAI. Alerta de perigo atual informado, independente do total ou da categoria de atividade.';
const statusLabel={invalid:'Entrada inválida',inconsistent:'Dados incompatíveis',outside_profile:'Fora do recorte local / preparo não confirmado',unresolved_source:'Lacuna literal da fonte · sem total',incomplete:'Informação insuficiente'};
const labels={'index-remission':'Remissão pelo índice · cortes 2012',mild:'Atividade leve pelo índice',moderate:'Atividade moderada pelo índice',severe:'Atividade grave pelo índice'};
const pt=n=>String(n).replace('.',',');
export function evaluateWpcdaiAdapter(raw){
 const {data,issues,safeDanger}=capture(raw),input=Object.create(null);let danger=safeDanger,safety='desconhecida / não avaliada';
 for(const f of wpcdaiFields){const v=data[f.id];if(v===undefined||v===null||v===''){if(f.id==='danger_signs')issues.push({field:f.id,kind:'missing',reason:'Segurança atual não informada.'});else input[f.id]=null;continue;}const p=f.type==='number'?decimal(v):selection(v,f);if(!p.ok){issues.push({field:f.id,kind:'invalid',reason:'Entrada canônica da ficha obrigatória; sem coerção ou arredondamento.'});if(f.id!=='danger_signs')input[f.id]=null;continue;}if(f.id==='danger_signs'){danger=p.value===1;safety=p.value===1?'perigo atual informado':p.value===0?'sem perigo após avaliação atual':'desconhecida / não avaliada';}else input[f.id]=f.type==='select'&&p.value===-1?null:bools.has(f.id)?p.value===1:p.value;}
 const r=evaluateWpcdai(input),all=[...issues,...r.issues.map(i=>({...i,field:i.field==='input'?'profile':i.field}))],complete=issues.length===0&&r.complete,order=['invalid','inconsistent','outside_profile','unresolved_source','missing'],status=complete?'scored':order.find(s=>all.some(i=>i.kind===s))||'missing',finalStatus=status==='missing'?'incomplete':status,errors=[...new Set(all.map(i=>i.field))],alerts=danger?[urgent]:[],level=danger?'high':'neutral';
 if(!complete){const reason=[statusLabel[finalStatus]+': nenhum total ou classe de atividade foi emitido.',...all.map(i=>(wpcdaiFields.find(f=>f.id===i.field)?.label??i.field)+': '+i.reason),...alerts].join(' ');return {...r,status:finalStatus,complete:false,totalComplete:false,classificationAvailable:false,total:null,components:null,classification:null,interpretation:null,issues:all,errors,alerts,level,label:statusLabel[finalStatus],reason,action:reason,audit:'wPCDAI: pesos/rubrica NASPGHAN 2014, cortes Turner 2012, avaliação pontual literal restrita. Dados ausentes, preparo não confirmado, lacunas de albumina/peso ou resíduos incompatíveis impedem total e classificação; não prorratear, imputar normal/zero ou mudar de versão. Subconjunto local sem validação própria; não solicitar exames apenas para calcular.',breakdown:[]};}
 const names={pain:'Dor abdominal',function:'Funcionamento/bem-estar',stools:'Evacuações',esr:'VHS',albumin:'Albumina',weight:'Peso',perirectal:'Doença perirretal',eim:'Manifestações extraintestinais'},weight=wpcdaiFields.find(f=>f.id==='weightChange').options.find(o=>o.value===input.weightChange).label,weightDetail=input.weightChange.endsWith('-loss')?`${weight}, perda ${pt(input.weightLossPercent)}% sobre referência conhecida`:`${weight}; percentual de perda não aplicável e campo sem residual`;
 const audit=`wPCDAI: rubrica e pesos corroborados NASPGHAN 2014, página 5; classificação Turner 2012, tabela 5. Perfil ${PROFILE}, avaliação pontual. Idade ${pt(input.ageYears)} anos na avaliação; faixa 4–<18 é local, não limite universal do instrumento. Crohn já estabelecido; preparo profissional, mesma avaliação e história da semana precedente confirmados. VHS ${pt(input.esrMmH)} mm/h e albumina ${pt(input.albuminGdL)} g/dL medidos, com fontes/datas conhecidas e pertinência clínica confirmada, sem prazo universal inventado. Peso: ${weightDetail}; origem e intervalo da referência documentados, sem impor sete dias ao peso. Categorias inequivocamente adjudicadas. Nenhuma imputação de dado não medido, desconhecido ou impossível de avaliar como normal/zero, inclusive externa. Soma exata dos oito domínios: ${Object.entries(r.components).map(([k,n])=>names[k]+' '+pt(n)).join(' + ')} = ${pt(r.total)}/125. ${labels[r.classification]}. Cortes: <12,5 remissão pelo índice; 12,5–40 leve; >40–57,5 moderada; >57,5 grave. Remissão pelo índice não significa cura, ausência de inflamação ou cicatrização endoscópica. Recorte local sem validação própria; idade, tetos e precisão são guardas locais, não plausibilidade clínica certificada. Não há comparação/resposta longitudinal, diagnóstico ou tratamento automático. Não solicitar exames apenas para o índice. Segurança atual: ${safety}.`;
 return {...r,notApplicable:input.weightChange.endsWith('-loss')?[]:['weightLossPercent'],displayValue:pt(r.total),errors:[],issues:[],alerts,level,label:labels[r.classification],reason:null,action:r.limitations+' Remissão pelo índice não é cura, ausência de inflamação ou cicatrização endoscópica; não usar isoladamente para inferir essas condições. Recorte local mais restrito, sem validação específica própria. A avaliação clínica atual tem prioridade.',audit,breakdown:Object.entries(r.components).map(([key,n])=>({label:names[key],points:n,detail:pt(n)+' pontos'}))};
}
export const wpcdaiScore={id:'wpcdai-2012-literal',name:'wPCDAI · Crohn pediátrico ponderado',subtitle:'Rubrica/pesos NASPGHAN 2014 · cortes Turner 2012 · pontual literal restrito',specialty:'Gastroenterologia',specialties:['Gastroenterologia','Pediatria'],aliases:['wPCDAI','Weighted Pediatric Crohn Disease Activity Index','PCDAI ponderado','Crohn pediátrico','Turner 2012'],population:'Crohn estabelecido · recorte local de 4 a <18 anos na avaliação',range:'0–125 pontos',max:125,reviewDate:'11/10/2026',scope:'Atividade clínica pontual de Crohn previamente estabelecido. Oito domínios da versão ponderada, rubrica/pesos corroborados pela fonte institucional NASPGHAN 2014 e cortes de Turner 2012; não se alega inspeção do suplemento original D1 não recuperado. A faixa 4–<18 anos é recorte local conservador: estudos incluíram participantes de 4–19, sem contraindicação universal aos 18–19. Exige preparo completo sem imputação normal/zero; subconjunto local sem validação própria. História da semana precedente; laboratórios contemporâneos e peso de referência com intervalo profissionalmente documentado, sem transformar tudo em janela de sete dias.',fields:wpcdaiFields,
 formula:'Somar oito domínios: dor 0/10/20; funcionamento/bem-estar 0/10/20; evacuações 0/7,5/15; VHS 0/7,5/15; albumina 0/10/20; peso 0/5/10; perirretal 0/7,5/15; manifestação extraintestinal ausente 0/presente 10, sem somar múltiplas. VHS mm/h: <20=0, 20–50=7,5, >50=15. Albumina g/dL: ≥3,5=0, 3,1–3,4=10, ≤3,0=20; intervalos (3,0;3,1) e (3,4;3,5) sem ramo, não arredondar. Peso: ganho ou estabilidade voluntária=0; estabilidade involuntária=5; perda voluntária positiva <10%=0, ≥10% sem total por conflito literal; perda involuntária 1–9%=5, 10≤p<100%=10, (0;1)/(9;10) sem ramo. Percentual externo=100×(referência−atual)/referência, unidades iguais e referência conhecida. Total 0–125, exato em múltiplos de 2,5; 49 totais atingíveis, exceto 2,5 e 122,5. Cortes 2012: <12,5 remissão pelo índice; 12,5≤total≤40 leve; 40<total≤57,5 moderada; total >57,5 grave. Não há resposta longitudinal implementada.',
 limits:'Fórmula pontual literal restrita. Ausências ou categorias incertas bloqueiam; não prorratear, supor estabilidade/normalidade ou trocar por versão curta. Confirmação genérica não preenche categoria desconhecida nem resolve lacunas de albumina ou peso. Faixa etária, VHS≤300 mm/h, albumina≤10 g/dL e precisão até seis casas são políticas técnicas locais, não plausibilidade certificada ou limites universais. Albumina em g/L deve ser convertida explicitamente fora da ficha ÷10, sem arredondar. Peso residual em ganho/estabilidade bloqueia e deve ser limpo explicitamente. Não impor prazo universal de laboratório ou sete dias ao peso; calendário e prontuário não são verificados automaticamente. Remissão pelo índice não confirma cura, ausência de inflamação ou cicatrização intestinal. Perianal pouco representado nas coortes. Não usar para diagnóstico, probabilidade, tratamento/alta automática ou resposta longitudinal. PCDAI clássico continua apenas documental por lacunas e divergências de fonte; não é sinônimo. AbbrPCDAI, shPCDAI, modPCDAI, PUCAI e diários de protocolos não substituem esta versão. Hematócrito, crescimento e exame abdominal foram retirados por definição do wPCDAI, não por ausência de dados de um paciente. PCR não substitui VHS. Não solicitar exames apenas para calcular. Redação factual própria; não é tradução validada/autorizada do formulário nem reprodução integral.',
 sources:[{title:'Turner et al. 2012 · desenvolvimento e cortes · tabela 5 · DOI 10.1002/ibd.21649',url:'https://naspghan.org/files/documents/pdfs/training/curriculum-resources/ibd/weighted_PCDAI.pdf'},{title:'NASPGHAN 2014 · rubrica e pesos wPCDAI corroborados · página 5; fonte institucional, não Appendix D1',url:'https://naspghan.org/files/documents/pdfs/cme/On_line_version_CDAssessment_Newsltr_WEB_4-25-14.pdf'},{title:'ESPGHAN–NASPGHAN 2026 · limites dos índices para cicatrização intestinal · seção 6.2.1',url:'https://onlinelibrary.wiley.com/doi/10.1002/jpn3.70275?af=R'}],reuse:{attribution:'Síntese factual e implementação próprias, com atribuição a Turner 2012 e NASPGHAN 2014. Sem reprodução do formulário, PDF, figuras ou código de terceiros; não é tradução validada/autorizada e não há licença geral de redistribuição presumida.'},safeCalculate:evaluateWpcdaiAdapter,safeValidate:raw=>evaluateWpcdaiAdapter(raw).errors,assessPartial:raw=>{const r=evaluateWpcdaiAdapter(raw);return {level:r.level,alert:r.alerts[0]||null};}};
export const wpcdaiScores=[wpcdaiScore];
