// NICE NG143: classificação pelo achado de maior risco, nunca uma soma.
import {make,ref} from './expanded-scores.mjs';
const source='https://www.nice.org.uk/guidance/ng143/chapter/recommendations';
const select=(id,label,options,group,hint='')=>({id,label,type:'select',noPoints:true,group,hint,options:options.map(([value,label])=>({value,label}))});
const flag=(id,label,level,group,hint='')=>select(id,label,[[0,'Ausente, após avaliação'],[level,'Presente']],group,hint);
const number=(id,label,min,max,step,group,hint='')=>({id,label,type:'number',min,max,step,group,hint,noPoints:true});
const fields=[
 number('ageMonths','Idade em meses',0,216,.01,'Idade e sinais vitais','Use idade cronológica exata, com fração quando necessário. Não arredondar nem converter mês para 30 dias; esclareça a idade se houver dúvida na fronteira. Aplicação NICE somente abaixo de 60 meses; 3 e 6 meses são limites relevantes.'),
 number('temperature','Maior temperatura documentada neste episódio (°C)',30,45,.1,'Idade e sinais vitais','Não apagar febre prévia após antitérmico. Vacinação recente não deve automaticamente anular o risco da idade.'),
 number('heartRate','Frequência cardíaca (batimentos/min)',20,300,1,'Idade e sinais vitais'),
 number('respiratoryRate','Frequência respiratória (incursões/min)',1,150,1,'Idade e sinais vitais'),
 number('oxygenSaturation','Saturação de oxigênio EM AR AMBIENTE (%)',40,100,.1,'Idade e sinais vitais','Se não medida em ar ambiente, deixe sem preencher. Oxigênio suplementar pode mascarar hipoxemia; não interromper suporte para preencher o formulário.'),
 number('capillaryRefill','Tempo de enchimento capilar (segundos)',0,20,.1,'Idade e sinais vitais'),
 number('feverDays','Duração da febre (dias)',0,60,.01,'Idade e sinais vitais','Cinco dias completos já configuram sinal amarelo; avaliar doença de Kawasaki conforme contexto.'),
 select('colour','Cor da pele, lábios e língua',[[0,'Cor normal'],[1,'Palidez relatada por pais ou cuidadores'],[2,'Palidez observada, pele mosqueada, acinzentada ou azulada']], 'Aparência e atividade'),
 select('social','Resposta às interações sociais',[[0,'Resposta normal às interações'],[1,'Resposta diferente do habitual'],[2,'Sem resposta às interações']], 'Aparência e atividade'),
 select('wakefulness','Vigília e despertar',[[0,'Permanece acordada ou desperta rapidamente'],[1,'Desperta somente após estímulo prolongado'],[2,'Não desperta ou, se acordada, não permanece desperta']], 'Aparência e atividade'),
 select('smile','Expressão e sorriso',[[0,'Contente ou sorri, conforme desenvolvimento habitual'],[1,'Não sorri / expressão diferente do habitual']], 'Aparência e atividade','Interpretar em relação à idade e desenvolvimento; não confundir uma limitação basal com mudança aguda.'),
 flag('activity','Atividade reduzida',1,'Aparência e atividade'),
 flag('illAppearance','Parece doente ao profissional de saúde',2,'Aparência e atividade'),
 select('cry','Qualidade do choro',[[0,'Choro forte/normal ou não chora estando contente'],[2,'Choro fraco, agudo ou contínuo']], 'Aparência e atividade'),
 flag('nasalFlaring','Batimento de asa nasal',1,'Respiração'),
 flag('grunting','Gemido expiratório',2,'Respiração'),
 flag('chestIndrawing','Retração torácica moderada ou importante',2,'Respiração'),
 flag('crackles','Crepitações à ausculta',1,'Respiração'),
 select('skinEyes','Pele e olhos: confirmação de normalidade',[[0,'Pele e olhos normais, após exame']], 'Hidratação','Confirmação necessária para verde. Se não avaliados ou não normais, deixe vazio e examine os sinais de hidratação e gravidade. Um vermelho conhecido continua gerando alerta mesmo sem esta confirmação.'),
 flag('dryMucosa','Mucosas secas',1,'Hidratação'),
 select('poorFeeding','Alimentação do lactente',[[0,'Alimentação preservada ou critério não aplicável à idade'],[1,'Alimentação reduzida no lactente']], 'Hidratação','Marque ausência somente após avaliar a alimentação; desconhecida deve permanecer sem seleção.'),
 flag('reducedUrine','Diurese reduzida',1,'Hidratação'),
 flag('reducedTurgor','Turgor cutâneo reduzido',2,'Hidratação'),
 flag('nonBlanchingRash','Exantema que não desaparece à pressão',2,'Outros sinais'),
 flag('bulgingFontanelle','Fontanela abaulada',2,'Outros sinais','Ausente inclui fontanela já fechada, quando confirmado no exame.'),
 flag('neckStiffness','Rigidez de nuca',2,'Outros sinais'),
 flag('statusEpilepticus','Estado de mal epiléptico',2,'Outros sinais'),
 flag('focalNeurology','Sinais neurológicos focais',2,'Outros sinais'),
 flag('focalSeizure','Convulsão focal',2,'Outros sinais'),
 flag('jointSwelling','Inchaço de membro ou articulação',1,'Outros sinais'),
 flag('notUsingLimb','Não sustenta peso ou não usa um membro',1,'Outros sinais','Mudança patológica em relação à capacidade esperada para o desenvolvimento. Não marcar apenas porque um bebê ainda não anda.'),
 flag('rigors','Calafrios intensos / rigores',1,'Outros sinais')
];
const colours=['Verde','Amarelo','Vermelho'];
function criteria(x){
 const findings=[];
 const add=(condition,level,label)=>{if(condition)findings.push({level,label,detail:colours[level]});};
 for(const f of fields.filter(f=>f.type==='select'))add(x[f.id]>0,x[f.id],f.label);
 const age=x.ageMonths;
 add(age<3&&x.temperature>=38,2,'Idade <3 meses e temperatura ≥38 °C');
 add(age>=3&&age<=6&&x.temperature>=39,1,'Idade de 3 a 6 meses e temperatura ≥39 °C');
 add(x.respiratoryRate>60,2,'Frequência respiratória >60/min');
 add(age>=6&&age<=12&&x.respiratoryRate>50,1,'Idade de 6 a 12 meses e FR >50/min');
 add(age>12&&x.respiratoryRate>40,1,'Idade >12 meses e FR >40/min');
 const heartLimit=age<12?160:age<24?150:age<60?140:undefined;
 add(heartLimit!==undefined&&x.heartRate>heartLimit,1,`Taquicardia para a idade: FC >${heartLimit}/min`);
 add(x.oxygenSaturation<=95,1,'SpO₂ ≤95% em ar ambiente');
 add(x.capillaryRefill>=3,1,'Enchimento capilar ≥3 segundos');
 add(x.feverDays>=5,1,'Febre há 5 dias ou mais');
 return findings;
}
const guidance=[
 'Sem sinais amarelos ou vermelhos na avaliação completa. Verde não exclui infecção ou doença grave e não autoriza alta automaticamente. Na febre sem foco, pesquisar ITU e avaliar sinais de pneumonia; exames de sangue e radiografia de tórax não são de rotina no grupo verde em avaliação pediátrica. Definir orientação de retorno e seguimento.',
 'Ao menos risco intermediário: avaliação clínica presencial, investigação e observação conforme idade, foco e contexto. Sem diagnóstico definido, assegurar reavaliação e orientações de alarme. A categoria não prescreve exames ou tratamento automaticamente.',
 'Alto risco de doença grave: avaliação pediátrica urgente. Sinais de ameaça à vida exigem atendimento emergencial imediato. Menores de 3 meses com febre têm via própria de investigação; não aguardar completar este instrumento para prestar assistência.'
];
function assessPartial(values){
 if(values===null||typeof values!=='object'||Array.isArray(values))return null;
 const x={};
 // Só critérios individualmente válidos participam do alerta parcial. Ausente nunca vira zero.
 for(const f of fields){const v=values[f.id];if(v===undefined||v===null||v===''||!['string','number'].includes(typeof v))continue;const n=Number(v);if(f.type==='select'){if(['string','number'].includes(typeof v)&&f.options.some(o=>String(o.value)===String(v)))x[f.id]=n;}else if((typeof v==='number'||typeof v==='string'&&/^\d+(\.\d+)?$/.test(v))&&Number.isFinite(n)&&n>=f.min&&n<=f.max&&(f.step!==1||Number.isInteger(n))&&(f.step!==.1||Math.abs(n*10-Math.round(n*10))<1e-7))x[f.id]=n;}
 const findings=criteria(x),risk=Math.max(0,...findings.map(f=>f.level));
 if(!risk)return null;
 const highest=findings.filter(f=>f.level===risk).map(f=>f.label).join('; ');
 if(x.ageMonths===undefined)return {level:risk===2?'high':'medium',alert:`${risk===2?'Sinal de alto risco identificado':'Sinal de risco identificado'}: ${highest}. Confirmar a faixa etária de aplicação NICE; a idade está ausente ou inválida. ${risk===2?'Não aguardar completar o formulário para avaliação urgente.':'Avaliação incompleta não permite classificar como verde.'}`};
 if(x.ageMonths>=60)return {level:risk===2?'high':'medium',alert:`Achado clínico relevante: ${highest}. Fora do escopo NICE (<5 anos); não atribuir uma cor validada. ${risk===2?'Avaliação urgente conforme o quadro.':'Integrar à avaliação clínica apropriada à idade.'}`};
 return {level:risk===2?'high':'medium',riskFloor:colours[risk],alert:`${risk===2?'Vermelho já identificado':'Ao menos risco intermediário (amarelo)'}: ${highest}. ${risk===2?'Não aguardar completar o formulário para avaliação urgente.':'Avaliação incompleta pode revelar maior risco; não classificar como verde.'}`};
}
export const niceFeverTrafficLight=make({
 id:'nice-fever-traffic-light',name:'NICE · semáforo da febre',subtitle:'Febre em menores de 5 anos · maior sinal de risco',specialty:'Pediatria',specialties:['Infectologia'],population:'Crianças febris · <5 anos',wave10:true,reviewDate:'10/10/2026',range:'Verde · amarelo · vermelho',unit:' ',max:0,resultScale:false,categorical:true,
 aliases:['NICE NG143','traffic light','semáforo','febre','febre sem foco','criança febril'],fields,assessPartial,
 scope:'Avaliação de crianças com febre abaixo de 5 anos, pela tabela 2 da NICE NG143. Primeiro reconhecer instabilidade e ameaças à vida. Avaliar TODOS os campos: verde exige ausência confirmada de qualquer sinal amarelo ou vermelho. Registrar medidas e achados deste episódio; desconhecido permanece vazio. A pior categoria prevalece, sem somar pontos.',
 eligibilityConfirmation:'Confirmei a população febril, o exame clínico completo e que a saturação informada foi medida em ar ambiente.',
 formula:'Qualquer sinal vermelho → vermelho. Sem vermelho, qualquer amarelo → amarelo. Verde somente com todos os critérios avaliados e sem amarelo/vermelho. Os códigos internos das opções não são pontos. FC: >160 (<12 meses), >150 (12 a <24 meses), >140 (24 a <60 meses). FR: >60 em qualquer idade; >50 dos 6 aos 12 meses; >40 acima de 12 meses. SpO₂ ≤95% em ar ambiente e TRC ≥3 segundos são amarelos. Febre ≥5 dias é amarela.',
 limits:'Não é diagnóstico etiológico nem escore numérico. Verde não exclui ITU, infecção bacteriana invasiva ou doença grave. Não confundir com Yale nem usar resposta ao antitérmico para excluir gravidade. Não extrapolar para ≥5 anos. SpO₂ sob oxigênio suplementar não pode ser tratada como medida normal em ar ambiente. A confirmação de todos os campos é uma guarda conservadora deste formulário, não uma nova obrigação universal de oximetria da NICE. O contexto clínico, a preocupação do cuidador e a evolução podem exigir ação além da categoria. A indicação de exames depende da avaliação pediátrica e do foco; não há solicitação automática.',
 sources:[ref('De S et al. · BMJ 2013 · limitações do semáforo, especialmente ITU','https://www.bmj.com/content/346/bmj.f866'),ref('NICE NG143 · tabela 2: semáforo da febre em menores de 5 anos',source+'#assessment-of-risk-of-serious-illness'),ref('NICE NG143 · avaliação pediátrica, lactentes <3 meses e febre sem foco',source+'#management-by-the-paediatric-specialist')],
 compute:x=>{if(x.ageMonths>=60)return {total:null,displayValue:'Não aplicável',label:'Fora da faixa etária NICE <5 anos',level:assessPartial(x)?.level||'medium',action:'Use avaliação e instrumentos apropriados à idade. Sinais de gravidade exigem atendimento independentemente desta tabela.',audit:`Idade informada: ${x.ageMonths} meses`,breakdown:[],alerts:assessPartial(x)?.alert?[assessPartial(x).alert]:[]};const findings=criteria(x),risk=Math.max(0,...findings.map(f=>f.level));return {total:null,displayValue:colours[risk],label:`${colours[risk]} · ${risk===2?'alto risco':risk===1?'risco intermediário':'menor risco pela tabela'}`,level:['low','medium','high'][risk],action:guidance[risk],audit:'Maior categoria observada; sem soma de pontos',breakdown:findings.length?findings:[{label:'Todos os critérios avaliados; nenhum amarelo ou vermelho',detail:'Verde'}],alerts:x.ageMonths<3?['Lactente menor de 3 meses: integrar a via específica de febre e avaliação pediátrica; aparência preservada não exclui infecção invasiva.']:[]};}
});

export function applyYaleObservationReview(scores){
 const score=scores.find(s=>s.id==='yale-observation');
 if(!score)throw new Error('Yale Observation Scale existente não encontrada; não criar duplicata.');
 const domains=score.fields.filter(f=>/^item[0-5]$/.test(f.id));
 if(domains.length!==6)throw new Error('Contrato Yale inesperado.');
 // Partial warnings use only explicit own data, never inherited values or accessors.
 const ownValue=(values,key)=>{
  try{
   if(values===null||typeof values!=='object'||Array.isArray(values))return undefined;
   const descriptor=Object.getOwnPropertyDescriptor(values,key);
   return descriptor&&Object.hasOwn(descriptor,'value')?descriptor.value:undefined;
  }catch{return undefined;}
 };
 const validValue=(field,value)=>{
  if(!['number','string'].includes(typeof value))return false;
  if(field.type==='select')return field.options.some(option=>String(option.value)===String(value));
  return (typeof value==='number'||/^\d+(\.\d+)?$/.test(value))&&Number.isFinite(Number(value))&&Number(value)>=field.min&&Number(value)<=field.max;
 };
 Object.assign(score,{
  population:'Crianças febris · 3–36 meses',categoricalOnIneligible:true,reviewDate:'10/10/2026',aliases:[...new Set([...(score.aliases||[]),'YOS','Yale','febre sem foco'])],
  scope:'Escala observacional da aparência de crianças febris. Esta implementação restringe a interpretação a 3–36 meses, faixa de validação posterior; a derivação histórica incluiu crianças até 24 meses. Fora de 3–36 meses, não fornecer classificação. Seis domínios de 1, 3 ou 5 pontos; idade apenas confirma aplicabilidade e não pontua.',
  fields:[number('ageMonths','Idade em meses',0,216,.01,'Aplicabilidade','Interpretação disponível somente de 3 a 36 meses, inclusive. Menores de 3 meses exigem protocolo próprio de lactente febril.'),...domains],
  formula:'Somar exclusivamente os seis domínios, cada um com 1, 3 ou 5 pontos. Totais possíveis: números pares de 6 a 30. Faixas históricas: ≤10, >10 e <16 (somente 12 ou 14), e ≥16. A idade não acrescenta pontos.',
  limits:'Aparência de menor risco pelo YOS não exclui infecção bacteriana grave ou invasiva, nem autoriza alta, dispensa de exames ou interrupção de investigação. Desempenho particularmente inadequado para exclusão em lactentes jovens; menores de 3 meses não recebem interpretação neste formulário. Faixas são históricas, sem probabilidade individual calculada. Não substituir idade, sinais vitais, perfusão, foco e evolução. Não preencher domínio desconhecido com 1.',
  sources:[ref('McCarthy et al. · derivação YOS, Pediatrics 1982 · limiares ≤10 e ≥16','https://pubmed.ncbi.nlm.nih.gov/7133831/'),ref('Bang e Chaturvedi · validação em crianças de 3–36 meses, 2009','https://pubmed.ncbi.nlm.nih.gov/19390817/'),ref('Nigrovic et al. · Pediatrics 2017 · seis domínios e limitações em lactentes ≤60 dias','https://pmc.ncbi.nlm.nih.gov/articles/PMC5495524/')],
  safeValidate:values=>score.fields.filter(field=>!validValue(field,ownValue(values,field.id))).map(field=>field.id),
  assessPartial:values=>{
   const age=ownValue(values,'ageMonths'),alerts=[];
   if(validValue(score.fields[0],age)&&Number(age)<3)alerts.push('Não interpretar aparência preservada como baixo risco. Aplicar a via de lactente febril e avaliação pediátrica urgente.');
   const severe=domains.filter(field=>[5,'5'].includes(ownValue(values,field.id)));
   if(severe.length)alerts.push('Achado observacional importante: '+severe.map(field=>field.label).join('; ')+'. Avaliação urgente conforme o quadro, independentemente da soma YOS. Não aguardar completar o formulário.');
   return alerts.length?{level:'high',alert:alerts.join(' ')}:null;
  },
  compute:x=>{if(x.ageMonths<3||x.ageMonths>36)return {total:null,displayValue:'Não aplicável',label:'Fora da faixa de interpretação YOS (3–36 meses)',level:x.ageMonths<3||domains.some(f=>x[f.id]===5)?'high':'medium',alerts:domains.some(f=>x[f.id]===5)?['Achado observacional importante: '+domains.filter(f=>x[f.id]===5).map(f=>f.label).join('; ')+'. Avaliação urgente conforme o quadro, independentemente da faixa etária e sem interpretar uma pontuação YOS.']:[],action:x.ageMonths<3?'Não interpretar aparência preservada como baixo risco. Aplicar a via de lactente febril e avaliação pediátrica urgente.':'Não extrapolar faixas históricas do YOS a esta idade; integrar avaliação clínica e instrumento apropriado.',breakdown:[],audit:`Idade ${x.ageMonths} meses; pontuação não emitida`};const breakdown=domains.map(f=>({label:f.label,points:x[f.id]})),total=breakdown.reduce((sum,f)=>sum+f.points,0);return {total,label:total<=10?'YOS ≤10 · menor risco histórico':total<16?'YOS 12–14 · faixa intermediária histórica':'YOS ≥16 · maior risco histórico',level:domains.some(f=>x[f.id]===5)?'high':total<=10?'low':total<16?'medium':'high',scoreBand:total<=10?'low':total<16?'medium':'high',action:'Não exclui infecção grave. Integrar idade, sinais vitais, perfusão, foco e protocolo da criança febril; a soma não autoriza alta nem define exames ou tratamento isoladamente.',breakdown,audit:breakdown.map(f=>f.points).join(' + '),alerts:[...(domains.some(f=>x[f.id]===5)?['Achado observacional importante: '+domains.filter(f=>x[f.id]===5).map(f=>f.label).join('; ')+'. Avaliação urgente conforme o quadro, independentemente do total YOS.']:[]),'Classificação histórica de aparência, sem probabilidade individual. Sinais de gravidade prevalecem sobre o total.']};}
 });
 delete score.bands;
}
