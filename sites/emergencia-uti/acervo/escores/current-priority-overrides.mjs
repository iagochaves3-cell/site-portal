// Regras operacionais identificadas: Di Marco 2020, Table S1 e correção de 2020.
// Mantém os IDs históricos; não implementa o índice ponderado integral 0–10.
export function applyCurrentPriorityOverrides(priorityScores,{s,n,ref,meta,result}) {
 const incomplete=reason=>({total:null,label:'Não calculável',action:'Conferir o ECG e o contexto clínico. Não preencher ausência de informação como zero.',audit:reason,level:'medium',breakdown:[],context_error:reason});
 const sources=[ref('Di Marco et al. · JAHA 2020 · Métodos e Table S1','https://pmc.ncbi.nlm.nih.gov/articles/PMC7660719/'),ref('Material suplementar original · Table S1, página 4','https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7660719/supplementaryFiles'),ref('Correção original · definição da polaridade QRS · 2020','https://pmc.ncbi.nlm.nih.gov/articles/PMC7763719/')];
 const commonFields=()=>[
  meta(n('age','Idade em anos completos',18,120,1,'Aplicação restrita a adultos nesta interface; não é um limite etário de derivação extraído do artigo.')),
  meta(s('eligible','BRE e suspeita clínica de infarto confirmados?',[[0,'Não confirmado ou fora do escopo'],[1,'Sim · adulto com BRE e suspeita clínica de infarto']],'Não aplicar a BRD, QRS largo inespecífico ou ritmo ventricular estimulado.')),
  meta(s('ecg_checked','Avaliação completa dos critérios no ECG confirmada?',[[0,'Não confirmado ou avaliação incompleta'],[1,'Sim · ECG de 12 derivações e medidas conferidos']],'Calibração 10 mm/mV, velocidade 25 mm/s; ST no ponto J em relação ao início do QRS. Critério presente em mais de metade dos batimentos de uma mesma derivação. Polaridade elegível: deflexão dominante supera a oposta em ≥1,5 mm. Diferença ≤1 mm não é avaliada; faixa >1 a <1,5 mm ou dúvida impede esta aplicação. Medidas >1 mm devem ser conferidas no incremento de 0,5 mm do estudo; não arredondamos silenciosamente.')),
  meta(n('concordant','Maior elevação de ST concordante elegível (mm)',0,200,.01,'Após conferir todas as derivações elegíveis de QRS positivo, registrar a maior elevação no ponto J. ≥1 mm torna este critério positivo. Zero somente se ausência efetivamente constatada.')),
  meta(n('depression','Maior depressão de ST em V1–V3 (mm)',0,200,.01,'Magnitude positiva da maior depressão conferida em V1, V2 ou V3. ≥1 mm torna este critério positivo. A Table S1 não acrescenta um gate de concordância a este critério. Zero somente se ausência constatada.'))
 ];
 const commonScope='Regra operacional da Table S1 de Di Marco et al. (2020), com sua correção de polaridade QRS. Adultos com BRE confirmado e suspeita clínica de infarto, após avaliação profissional completa do ECG. Usa medidas manuais conferidas; não interpreta traçado, não faz triagem pelo próprio paciente e não estende o contrato a ritmo estimulado.';
 const limits='Regra binária identificada, não escore de gravidade nem estimativa de mortalidade. Resultado negativo não exclui infarto/oclusão coronária; resultado positivo não confirma anatomia coronária. Integrar sintomas, ECG seriado, exame e biomarcadores, sem atrasar assistência na instabilidade ou forte suspeita. Informação ausente, polaridade/medida incerta ou população incompatível retorna não calculável. O protocolo da fonte é explicitamente restrito; não misturar variantes ou limiares de outras versões.';
 const rounded=values=>values.every(v=>v<=1||Math.abs(v*2-Math.round(v*2))<1e-8);
 const guard=x=>{
  if(x.eligible!==1||x.ecg_checked!==1)return 'População, BRE, suspeita clínica ou leitura completa/medidas do ECG não confirmados.';
  if(!rounded([x.concordant,x.depression]))return 'Medida >1 mm não está no incremento de 0,5 mm do contrato examinado; conferir o traçado, sem arredondamento automático.';
  return null;
 };
 const output=(positive,parts,audit)=>result(positive?1:0,positive?'Regra positiva':'Regra negativa',positive?'Avaliação imediata para possível infarto/oclusão conforme contexto clínico; a regra não prescreve reperfusão isoladamente.':'Não exclui infarto/oclusão: integrar avaliação clínica, ECG seriado e biomarcadores.',audit,positive?'high':'medium',parts);
 const classic=priorityScores.find(score=>score.id==='sgarbossa');
 Object.assign(classic,{name:'Sgarbossa · regra para limiar ≥3',population:'Adultos · BRE confirmado · suspeita clínica de infarto',subtitle:'Decisão binária · Table S1, Di Marco 2020',max:1,range:'Negativa ou positiva',unit:'regra',resultScale:false,reviewDate:'02/10/2026',scope:commonScope+' Implementa somente a decisão para o limiar ≥3. Não calcula o índice integral ponderado de 0–10; elevação discordante isolada ≥5 mm não torna esta regra positiva.',fields:commonFields(),formula:'Positiva se elevação de ST concordante ≥1 mm em alguma derivação OU depressão de ST ≥1 mm em V1–V3.',compute:x=>{const reason=guard(x);if(reason)return incomplete(reason);const c=x.concordant>=1,d=x.depression>=1;return output(c||d,[{label:'Elevação concordante ≥1 mm',points:c?1:0},{label:'Depressão ≥1 mm em V1–V3',points:d?1:0}],`Decisão para ≥3, sem soma ponderada; ST concordante=${x.concordant} mm; depressão V1–V3=${x.depression} mm.`);},limits,sources});
 delete classic.bands;
 const modified=priorityScores.find(score=>score.id==='modified-sgarbossa');
 Object.assign(modified,{name:'Sgarbossa modificado · Smith regra III',population:'Adultos · BRE confirmado · suspeita clínica de infarto',subtitle:'Decisão binária e proporção ST/S · Table S1, 2020',max:1,range:'Negativa ou positiva',unit:'regra',resultScale:false,reviewDate:'02/10/2026',scope:commonScope+' Regra III: critério proporcional com ST ≥1 mm e ST/S ≤−0,25. Selecionar a derivação elegível com maior ST/|S| após avaliar todas; ST, S e R devem ser da mesma derivação. As regras IV/V de −0,30 e outras populações não estão implementadas.',fields:[...commonFields(),
  meta(s('candidate','Há elevação discordante ≥1 mm em QRS negativo elegível?',[[0,'Não · ausência confirmada em todas as derivações elegíveis'],[1,'Sim · maior ST/|S| elegível selecionado e conferido']],'Desconhecido não equivale a Não. Se não houver candidato, confirmar a ausência e registrar derivação/medidas como zero; nenhum dado obrigatório pode ficar vazio.')),
  meta(s('lead','Derivação do candidato proporcional',[[0,'Sem candidato · ausência confirmada'],...[ 'I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'].map((label,i)=>[i+1,label])],'Mesma derivação para ST, profundidade S e amplitude R.')),
  meta(n('ste','Elevação discordante de ST no ponto J (mm)',0,200,.01,'Magnitude positiva, ≥1 mm quando há candidato. Não inserir depressão nem medida de outra derivação.')),
  meta(n('s_depth','Profundidade da onda S (mm, magnitude positiva)',0,200,.01,'S assinado = −profundidade. Deve ser >0 com candidato; não inserir amplitude R no denominador.')),
  meta(n('r_height','Amplitude da onda R na mesma derivação (mm)',0,200,.01,'Confirmar QRS negativo: profundidade S − amplitude R ≥1,5 mm. Zero representa ausência de R efetivamente constatada.'))
 ],formula:'Positiva se regra ≥3 positiva OU (ST discordante ≥1 mm E ST/(−profundidade S) ≤−0,25). Sem pesos; basta um critério.',compute:x=>{
  const reason=guard(x);if(reason)return incomplete(reason);
  let proportional=false,ratio=null;
  if(x.candidate===0){if(x.lead!==0||x.ste!==0||x.s_depth!==0||x.r_height!==0)return incomplete('Ausência de candidato declarada, mas derivação ou medidas não são zero: esclarecer os dados; não descartar medidas automaticamente.');}
  else if(x.candidate===1){
   if(x.lead===0||x.ste<1||x.s_depth<=0)return incomplete('Candidato exige derivação identificada, ST ≥1 mm e profundidade S >0 na mesma derivação.');
   if(!rounded([x.ste,x.s_depth,x.r_height]))return incomplete('Medidas >1 mm do candidato precisam seguir o incremento de 0,5 mm documentado, sem arredondamento automático.');
   if(x.s_depth-x.r_height<1.5)return incomplete('QRS negativo elegível não confirmado: profundidade S deve superar R em ≥1,5 mm.');
   ratio=-x.ste/x.s_depth;proportional=4*x.ste>=x.s_depth;
  } else return incomplete('Avaliação do candidato proporcional não confirmada.');
  const c=x.concordant>=1,d=x.depression>=1;
  return output(c||d||proportional,[{label:'Elevação concordante ≥1 mm',points:c?1:0},{label:'Depressão ≥1 mm em V1–V3',points:d?1:0},{label:'ST ≥1 mm e ST/S ≤−0,25',points:proportional?1:0}],`Decisão binária da regra III; ST concordante=${x.concordant} mm; depressão V1–V3=${x.depression} mm; candidato=${x.candidate}; derivação=${x.lead}; ST=${x.ste} mm; S assinado=−${x.s_depth} mm; R=${x.r_height} mm; ST/S=${ratio===null?'não se aplica (ausência confirmada)':ratio}; comparação reversa 4×ST≥|S|=${proportional}.`);
 },limits:limits+' Seleção da derivação e ausência de outros candidatos são confirmações clínicas obrigatórias. Não dividir por zero ou confundir S assinado com profundidade positiva. Não é um total de 0–3 pontos.',sources});
 delete modified.bands;
}
