/** Independent factual implementation. No dosing advice or prognostic model. */
const REVIEW_DATE='10/10/2026';
const ref=(title,url)=>({title,url});
const cardiacSource=ref('Gaies et al. 2014 · validação multicêntrica · fórmula no Box 1','https://pmc.ncbi.nlm.nih.gov/articles/PMC4159673/');
const originalIS=ref('Wernovsky et al. 1995 · origem do IS · troca arterial antes de 3 meses','https://pubmed.ncbi.nlm.nih.gov/7554206/');
const originalVIS=ref('Gaies et al. 2010 · VIS original · lactentes e máximo em 48 h','https://pubmed.ncbi.nlm.nih.gov/19794327/');
const sepsisSource=ref('McIntosh et al. 2017 · aplicação do VIS em sepse pediátrica','https://pmc.ncbi.nlm.nih.gov/articles/PMC5548505/');
const select=(id,label,options,hint='',group='Contexto da observação')=>({id,label,type:'select',noPoints:true,group,hint,options:[...options.map(([value,label])=>({value,label})),{value:-1,label:'Não confirmado / desconhecido'}]});
const number=(id,label,min,max,precision=0,hint='',group='Contexto da observação')=>({id,label,type:'number',noPoints:true,min,max,step:precision?10**-precision:1,precision,hint,group});
const DRUGS=[
 {id:'dopamine',label:'Dopamina',weight:1,unit:'µg/kg/min',max:1000,precision:6},
 {id:'dobutamine',label:'Dobutamina',weight:1,unit:'µg/kg/min',max:1000,precision:6},
 {id:'epinephrine',label:'Epinefrina / adrenalina',weight:100,unit:'µg/kg/min',max:1000,precision:6},
 {id:'milrinone',label:'Milrinona',weight:10,unit:'µg/kg/min',max:1000,precision:6},
 {id:'norepinephrine',label:'Norepinefrina / noradrenalina',weight:100,unit:'µg/kg/min',max:1000,precision:6},
 {id:'vasopressin',label:'Vasopressina',weight:10000,unit:'U/kg/min',max:1,precision:9}
];
const emergency='Instabilidade, hipoperfusão importante, piora aguda ou parada exigem avaliação clínica imediata. Não aguardar este cálculo. O valor do índice não exclui choque nem doença grave.';
const interpretation='Índice descritivo de suporte farmacológico naquele instante. Não é probabilidade de mortalidade, diagnóstico de sepse/choque, alvo terapêutico, equivalência farmacológica universal ou orientação para iniciar, titular ou suspender medicamentos.';
const sampling='Doses simultâneas de infusões contínuas, com horário e unidades nativas conferidos. Campo vazio nunca vale zero. Zero só representa ausência confirmada daquela droga no instante. Não incluir bolus, dose diária, U/min, mU/kg/min ou mL/h; não há conversão de unidades. Não somar máximos de drogas de horários diferentes. Este cálculo pontual não calcula máximo, média ou área sob a curva.';
const cardiacEligibility='Aplicação cardíaca de Gaies 2014: idade <1 ano, cirurgia cardíaca com circulação extracorpórea e observação nas primeiras 48 h após admissão pós-operatória na UTI cardíaca; episódio cirúrgico ainda não incluído na coorte, sem suporte circulatório mecânico ao retornar da cirurgia e sem transferência precoce a instituição externa. Para comparação com a pesquisa, usar apenas observações anteriores a desfecho adverso.';
const sepsisEligibility='Aplicação McIntosh 2017: >60 dias e <18 anos, suspeita clínica de sepse identificada na emergência, pelo menos um vasoativo/inotrópico nas primeiras 48 h da chegada à emergência ou UTI. Excluir UTIN, cirurgia nas primeiras 6 h, diagnóstico alternativo definitivo para o suporte, ECMO antes do início das drogas e suporte iniciado apenas após cirurgia. Observação anterior a cirurgia, parada, ECMO ou óbito. Aqui, somente 6, 12, 24 ou 48 h após admissão na UTIP; não usar o início da primeira droga como marco.';
function own(record,key){
 try {if(record===null||typeof record!=='object'||Array.isArray(record))return undefined;const d=Object.getOwnPropertyDescriptor(record,key);return d&&Object.hasOwn(d,'value')?d.value:undefined;}catch{return undefined;}
}
function parse(field,raw){
 if(typeof raw!=='string'&&typeof raw!=='number')return undefined;
 if(field.type==='select')return field.options.find(o=>raw===o.value||raw===String(o.value))?.value;
 let text;
 if(typeof raw==='number'){
  if(!Number.isFinite(raw)||Object.is(raw,-0)||raw<field.min||raw>field.max)return undefined;
  text=raw.toFixed(field.precision);
  if(Number(text)!==raw)return undefined;
 }else{
  // One decimal separator only, no exponent, whitespace, units, prefix or coercion.
  if(!/^-?\d+(?:[.,]\d+)?$/.test(raw))return undefined;
  text=raw.replace(',','.');
  if((text.split('.')[1]?.length||0)>field.precision)return undefined;
 }
 const value=Number(text);
 if(!Number.isFinite(value)||value<field.min||value>field.max||Object.is(value,-0))return undefined;
 if(field.precision===0&&!Number.isInteger(value))return undefined;
 return value;
}
function read(score,values){
 const data=Object.create(null),errors=[];
 for(const field of score.fields){const value=parse(field,own(values,field.id));data[field.id]=value;if(value===undefined||(field.type==='select'&&value===-1))errors.push(field.id);}
 // Validate calendar date without silently normalizing 31 April / non-leap 29 February.
 if(data.observed_date!==undefined){const y=Math.floor(data.observed_date/10000),m=Math.floor(data.observed_date/100)%100,d=data.observed_date%100;const date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()+1!==m||date.getUTCDate()!==d)errors.push('observed_date');}
 if(score.includesVIS&&data.age_years>=1&&data.age_over60_days===0)errors.push('age_over60_days');
 return {data,errors:[...new Set(errors)]};
}
const pad=(v,n=2)=>String(v).padStart(n,'0');
function moment(data){const s=String(data.observed_date),offset=data.utc_offset_minutes,sign=offset<0?'-':'+';return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${pad(data.observed_hour)}:${pad(data.observed_minute)}${sign}${pad(Math.floor(Math.abs(offset)/60))}:${pad(Math.abs(offset)%60)}`;}
function scaled(value,precision){const t=value.toFixed(precision);const [a,b='']=t.split('.');return BigInt(a)*1000000000n+BigInt(b.padEnd(9,'0'));}
function decimal(value){const whole=value/1000000000n,frac=String(value%1000000000n).padStart(9,'0').replace(/0+$/,'');return String(whole)+(frac?'.'+frac:'');}
function evaluate(score,values){
 const {data,errors}=read(score,values),reasons=[],alerts=[];
 const context=score.includesVIS?data.clinical_context:0;
 if(data.danger_signs===1||data.danger_signs===2)alerts.push(emergency);
 if(data.danger_signs===2)reasons.push('Parada/ECMO/desfecho adverso informado: não usar observações após o evento para extrapolar resultados prognósticos dos estudos.');
 if(data.observation_kind===0)reasons.push('Doses de momentos diferentes, máximos isolados ou bolus não constituem uma observação pontual válida.');
 if(data.native_units===0)reasons.push('Unidades não confirmadas: conferir o registro original. Nenhuma conversão automática é realizada.');
 if(data.zero_absence_confirmed===0)reasons.push('Zeros não confirmados como ausência de droga; não emitir índice.');
 if(data.cohort_eligibility===0)reasons.push('Critérios clínicos da coorte selecionada não atendidos.');
 if(data.cohort_eligibility>0&&((context===0&&data.cohort_eligibility!==1)||(context===1&&data.cohort_eligibility!==2)))reasons.push('Confirmação de critérios pertence a outro contexto. Confira e confirme novamente a aplicação selecionada.');
 if(context===2)reasons.push('Contexto fora das aplicações pediátricas verificadas nesta ficha.');
 if(context===0&&data.age_years!==undefined&&data.age_years!==0)reasons.push('Aplicação cardíaca restrita a menores de 1 ano, conforme limite conservador local da coorte 2014.');
 if(context===1){
  if(data.age_years>=18||data.age_over60_days===0)reasons.push('Aplicação em sepse restrita a >60 dias e <18 anos; os extremos ficam fora deste contrato conservador.');
  if(data.hours_from_icu_admission!==undefined&&![6,12,24,48].includes(data.hours_from_icu_admission))reasons.push('Nesta aplicação de sepse, usar uma observação em 6, 12, 24 ou 48 h após admissão na UTIP.');
 }
 if(context===0&&data.hours_from_icu_admission>48)reasons.push('Observação cardíaca fora das primeiras 48 h após admissão pós-operatória na UTI cardíaca.');
 const common={total:null,breakdown:[],errors,alerts,level:alerts.length?'high':'medium',complete:false};
 if(reasons.length)return {...common,complete:errors.length===0,status:'ineligible',displayValue:'Não aplicável',label:'Índice não emitido',reason:reasons.join(' '),action:[...alerts,...reasons,interpretation].join(' '),audit:'Sem total: contexto, segurança ou natureza da observação incompatíveis.'};
 if(errors.length)return {...common,status:'incomplete',label:'Dados insuficientes ou inválidos',reason:'Complete os dados e confirmações. Campo ausente ou desconhecido não representa zero.',action:interpretation,audit:'Sem total: dados incompletos ou inválidos.'};
 const breakdown=score.drugs.map(drug=>{const exact=scaled(data[drug.id],drug.precision)*BigInt(drug.weight);return {label:drug.label,points:Number(decimal(exact)),detail:`${data[drug.id]} ${drug.unit} × ${drug.weight} = ${decimal(exact)}`,exact};});
 const exact=breakdown.reduce((sum,b)=>sum+b.exact,0n),display=decimal(exact),total=Number(display),observedAt=moment(data);
 const contextName=context===0?'pós-operatório cardíaco · Gaies 2014':'sepse pediátrica · McIntosh 2017';
 return {...common,level:alerts.length?'high':'neutral',complete:true,status:'scored',total,displayValue:display.replace('.',','),label:score.shortName+(alerts.length?' pontual · alerta clínico prioritário':' pontual · suporte registrado'),breakdown:breakdown.map(({exact,...item})=>item),observedAt,application:contextName,elapsedHours:data.hours_from_icu_admission,action:(alerts.length?alerts.join(' ')+' ':'')+interpretation+' Zero não significa ausência de gravidade. '+(score.includesVIS?'O VIS só contempla os seis fármacos da fórmula.':'O IS não inclui milrinona, norepinefrina, vasopressina nem outros suportes; zero não significa ausência de suporte cardiovascular.'),audit:`${score.shortName} pontual = ${breakdown.map(b=>decimal(b.exact)).join(' + ')} = ${display}. Observação: ${observedAt}; ${data.hours_from_icu_admission} h após admissão ${context===0?'pós-operatória na UTI cardíaca':'na UTIP'}. Contexto: ${contextName}. Não é máximo, média nem probabilidade de desfecho.`};
}
function createScore(includesVIS){
 const drugs=DRUGS.slice(0,includesVIS?6:3),shortName=includesVIS?'VIS':'IS';
 const score={
  id:includesVIS?'vis-gaies-2010':'is-wernovsky-1995',name:includesVIS?'VIS · Gaies':'IS · Wernovsky',shortName,includesVIS,drugs,expanded:true,
  subtitle:includesVIS?'Suporte vasoativo-inotrópico pontual · aplicações pediátricas':'Suporte inotrópico pontual · aplicação cardíaca pediátrica',
  specialty:'Pediatria',specialties:includesVIS?['Pediatria','Cardiologia','Emergência e UTI','Infectologia']:['Pediatria','Cardiologia','Emergência e UTI'],
  population:includesVIS?'Cardíaca <1 ano; sepse >60 dias e <18 anos':'Pós-operatório cardíaco · <1 ano',
  aliases:includesVIS?['Vasoactive-Inotropic Score','Vasoactive Inotropic Score','Escore vasoativo inotrópico','VIS Gaies 2010','VIS Gaies 2014','VIS McIntosh 2017']:['Inotropic Score','Inotrope Score','Escore inotrópico','IS Wernovsky 1995'],
  conditions:includesVIS?['Cirurgia cardíaca','Sepse','Choque séptico']:['Cirurgia cardíaca'],purposes:['Avaliação hemodinâmica'],
  keywords:includesVIS?['suporte cardiovascular','drogas vasoativas','sepse pediátrica']:['suporte inotrópico','cirurgia cardíaca pediátrica'],searchTerms:['dopamina','dobutamina','adrenalina',...(includesVIS?['milrinona','noradrenalina','vasopressina','choque séptico']:[])],
  reviewDate:REVIEW_DATE,range:'≥0 · sem teto clínico definido',max:null,unit:'índice',resultScale:false,categoricalOnIneligible:true,
  scope:cardiacEligibility+(includesVIS?' '+sepsisEligibility:' O IS foi originalmente descrito por Wernovsky 1995 em troca arterial planejada antes dos 3 meses; esta ficha usa a fórmula conferida na aplicação de Gaies 2014, sem reproduzir o protocolo prognóstico histórico.')+' '+sampling,
  eligibilityConfirmation:'Conferi a população e o contexto, o horário e as unidades. Estes números são doses observadas, não doses recomendadas; o resultado não orienta titulação.',
  formula:includesVIS?'VIS = dopamina + dobutamina + 100 × epinefrina + 10 × milrinona + 100 × norepinefrina + 10.000 × vasopressina. As cinco primeiras doses em µg/kg/min; vasopressina em U/kg/min.':'IS = dopamina + dobutamina + 100 × epinefrina, com todas as doses em µg/kg/min.',
  limits:interpretation+' '+sampling+' Os cortes e associações de máximos/médias com desfechos não são aplicados a este valor pontual. As janelas dependem da coorte e do marco da admissão. A coleta cardíaca 2014 foi horária; não se afirma que qualquer instante reproduza seu modelo. A sepse 2017 incluiu medidas a partir da emergência e da UTI; esta ficha fixa o marco UTIP. O resumo e os métodos diferem nas igualdades etárias; os limites <1 ano, >60 dias e <18 anos são conservadores locais. A urgência mantém alerta prioritário mesmo com índice zero; parada/suporte circulatório mecânico suspende o total neste perfil local. Essas guardas editoriais não fazem parte da equação. Limites técnicos de entrada (1.000 µg/kg/min e 1 U/kg/min), precisão de seis/nove casas e calendário 1900–2199 são guardas locais contra dados inválidos, nunca limites de dose segura, doses recomendadas ou máximos clínicos. Os pesos não estabelecem equivalência farmacológica. Sem validação transcultural da redação PT-BR.',
  sources:includesVIS?[originalVIS,cardiacSource,sepsisSource,originalIS]:[originalIS,cardiacSource],
  reuse:{kind:'independent-factual-method-implementation',attribution:'Fórmulas atribuídas a Wernovsky/Gaies; aplicação em sepse atribuída a McIntosh. Código e redação próprios; nenhuma figura, tabela formatada, texto integral ou software autoral reproduzidos. Licença específica irrestrita do algoritmo não identificada. Artigo McIntosh 2017: CC BY-NC-ND 4.0; nenhuma figura foi reutilizada ou adaptada; compartilhamento inalterado tem as condições dessa licença. Sem aquisição de licença paga.'},
  fields:[
   ...(includesVIS?[select('clinical_context','Aplicação clínica',[[0,'Cardíaca · Gaies 2014 · menor de 1 ano'],[1,'Sepse · McIntosh 2017 · >60 dias e <18 anos'],[2,'Outra situação']], 'As duas aplicações compartilham a fórmula; populações e tempos não são intercambiáveis.')]:[]),
   number('age_years','Idade (anos completos)',0,120,0,'Use a idade no aniversário mais recente. Aplicação cardíaca somente antes do primeiro aniversário.'),
   ...(includesVIS?[select('age_over60_days','Idade maior que 60 dias',[[1,'Sim, maior que 60 dias'],[0,'Não, 60 dias ou menos']],'Conferência etária registrada em ambos os contextos; somente a sepse exige resposta Sim. No contexto cardíaco, neonatos podem ser elegíveis. Não arredondar 60 dias para meses.')]:[]),
   select('cohort_eligibility','Demais critérios da aplicação selecionada',[ [1,'Critérios cardíacos conferidos e atendidos'],...(includesVIS?[[2,'Critérios de sepse conferidos e atendidos']]:[]),[0,'Um ou mais critérios não atendidos'] ],cardiacEligibility+(includesVIS?' '+sepsisEligibility:'')),
   number('hours_from_icu_admission','Horas desde a admissão na UTI da aplicação',0,1000,3,'Cardíaca: 0–48 h desde admissão pós-operatória na UTI cardíaca. Sepse: 6, 12, 24 ou 48 h desde admissão na UTIP. Nunca desde a primeira droga.'),
   number('observed_date','Data da observação (AAAAMMDD)',19000101,21991231,0,'Exemplo de formato: 20261010. Data local do horário informado; não inserir data de nascimento.','Momento único das doses'),
   number('observed_hour','Hora da observação (0–23)',0,23,0,'Relógio de 24 horas.','Momento único das doses'),
   number('observed_minute','Minuto da observação (0–59)',0,59,0,'Mesmo instante para todas as doses.','Momento único das doses'),
   number('utc_offset_minutes','Fuso: diferença em minutos para UTC',-840,840,0,'Exemplos: UTC = 0; UTC−03:00 = −180. Apenas registro do fuso; não converte doses.','Momento único das doses'),
   select('danger_signs','Urgência clínica ou evento adverso',[[0,'Sem os sinais/eventos listados, após avaliação'],[1,'Instabilidade, hipoperfusão importante ou piora aguda'],[2,'Parada ou suporte circulatório mecânico / evento adverso']],emergency,'Segurança da observação'),
   select('observation_kind','Doses simultâneas e infusões contínuas',[[1,'Todas pertencem ao mesmo instante; somente infusões contínuas'],[0,'Incluem horários diferentes, máximos isolados ou bolus']],sampling,'Segurança da observação'),
   select('native_units','Unidades nativas conferidas',[[1,'µg/kg/min; vasopressina em U/kg/min, quando aplicável'],[0,'Outras unidades ou conversão ainda não conferida']],'Não inserir U/min, mU/kg/min, mg/h, mL/h ou doses por dia. Não há conversão automática.','Segurança da observação'),
   select('zero_absence_confirmed','Significado de cada zero',[[1,'Cada zero é ausência da respectiva droga, confirmada no instante'],[0,'Há zero usado para dose desconhecida ou não confirmada']],'Se todas as doses forem positivas, confirme que nenhuma droga da fórmula está omitida.','Segurança da observação'),
   ...drugs.map(d=>number(d.id,`${d.label} (${d.unit})`,0,d.max,d.precision,`Dose observada na infusão contínua, sem arredondar. Zero somente se ausente confirmado; vazio é desconhecido. Unidade: ${d.unit}. O limite da entrada é técnico, não uma dose recomendada.`, 'Doses observadas, não recomendações'))
  ]
 };
 score.safeCalculate=values=>evaluate(score,values);score.compute=score.safeCalculate;score.safeValidate=values=>evaluate(score,values).errors;score.validate=score.safeValidate;
 score.countCompleted=values=>score.fields.length-read(score,values).errors.length;
 score.assessPartial=values=>{const result=evaluate(score,values);return result.alerts.length||result.status==='ineligible'?{level:result.alerts.length?'high':'medium',alert:[...result.alerts,...(result.reason?[result.reason]:[])].join(' ')}:null;};
 return score;
}
export const inotropicScore=createScore(false);
export const vasoactiveInotropicScore=createScore(true);
export const vasoactiveScores=[inotropicScore,vasoactiveInotropicScore];
export function calculateVasoactiveScore(id,values){const score=vasoactiveScores.find(s=>s.id===id);return score?score.safeCalculate(values):{complete:false,status:'unknown',total:null,errors:[],alerts:[],breakdown:[],level:'medium',label:'Instrumento desconhecido',action:'Selecione IS ou VIS.',audit:'Sem cálculo.'};}
