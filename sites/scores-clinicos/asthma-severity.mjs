/**
 * Escores de gravidade da exacerbação asmática, contratos independentes.
 * Implementação e redação PT-BR próprias, sem reprodução de figuras.
 * Não integrado ao catálogo: ver manifesto de integração e QA no relatório.
 */
const DATE = '10/10/2026';
const ref = (title, url) => ({title, url});
const unknown = {value:-1,label:'Não avaliado / desconhecido'};
const select = (id,label,options,hint='',group='Componentes do escore') => ({id,label,type:'select',noPoints:true,group,options:[...options.map(([value,label])=>({value,label})),{...unknown}],hint});
const numeric = (id,label,min,max,hint='',group='Componentes do escore') => ({id,label,type:'number',noPoints:true,min,max,step:1,hint,group});
const severityWarning = 'Sinais de alarme exigem avaliação clínica imediata e prevalecem sobre a soma, inclusive zero. Não aguardar a conclusão do formulário.';
const noTreatment = 'O total descreve os achados nesta avaliação. Não confirma asma, não fornece probabilidade individual de internação e não determina medicamento, suporte, internação ou alta.';
const contextFields = () => [
 numeric('age_years','Idade (anos completos)',0,120,'Informe a idade no aniversário mais recente, em anos completos. Não usar meses nem arredondar a idade.','Contexto da avaliação'),
 select('asthma_context','Exacerbação asmática estabelecida clinicamente',[[1,'Sim'],[0,'Não / outro diagnóstico']], 'Não usar para diagnosticar asma nem para pontuar bronquiolite ou pneumonia.','Contexto da avaliação'),
 select('assessment_moment','Momento da avaliação',[[0,'Antes do tratamento inicial'],[1,'Após o tratamento inicial'],[2,'Reavaliação durante a evolução']], 'Todos os componentes devem pertencer à mesma avaliação. Para comparar, registre o horário e os tratamentos entre avaliações no prontuário.','Contexto da avaliação'),
 select('respiratory_support','Suporte respiratório no momento dos achados',[[0,'Ar ambiente, sem suporte'],[1,'Oxigênio suplementar, sem pressão positiva'],[2,'Alto fluxo ou suporte não invasivo'],[3,'Ventilação invasiva']], 'Não interromper oxigênio nem suporte para obter uma pontuação. Os achados sob suporte não equivalem à observação espontânea sem suporte.','Contexto da avaliação'),
 select('danger_signs','Sinais de alarme observados',[[0,'Nenhum dos sinais de alarme listados'],[1,'Tórax silencioso por troca aérea mínima ou ausente'],[2,'Apneia, cianose, exaustão ou alteração da consciência'],[3,'Tórax silencioso e outro sinal de alarme']], 'Este campo não soma pontos. Avaliação incompleta não equivale à ausência de sinais graves.','Segurança clínica')
];

// Own data properties only; ordinary input accessors and value coercion are not
// invoked. Reflection on an arbitrary Proxy can itself run its metadata trap;
// exceptions are contained, but this is not a sandbox for executable objects.
function ownValue(record,key) {
 try {
  if(record===null||typeof record!=='object'||Array.isArray(record))return undefined;
  const descriptor=Object.getOwnPropertyDescriptor(record,key);
  return descriptor&&Object.hasOwn(descriptor,'value')?descriptor.value:undefined;
 } catch {return undefined;}
}
function parse(field,value) {
 if(typeof value!=='number'&&typeof value!=='string')return undefined;
 if(field.type==='select') {
  const option=field.options.find(option=>value===option.value||value===String(option.value));
  return option?.value;
 }
 if(typeof value==='string'&&!/^\d+$/.test(value))return undefined;
 const number=typeof value==='number'?value:Number(value);
 return Number.isFinite(number)&&Number.isInteger(number)&&number>=field.min&&number<=field.max?number:undefined;
}
function snapshot(score,values) {
 const data=Object.create(null),observations=Object.create(null),errors=[];
 for(const field of score.fields) {
  const raw=ownValue(values,field.id),value=parse(field,raw);
  data[field.id]=value;
  // A plausible decimal vital may be unsuitable for the integer score while
  // still carrying a safety signal. Do not round it or coerce arbitrary objects.
  if(field.type==='number'&&(typeof raw==='number'||typeof raw==='string'&&/^\d+(\.\d+)?$/.test(raw))) {
   const observed=typeof raw==='number'?raw:Number(raw);
   if(Number.isFinite(observed)&&observed>=field.min&&observed<=field.max)observations[field.id]=observed;
  }
  if(value===undefined||value===-1)errors.push(field.id);
 }
 return {data,observations,errors};
}
function safety(score,data) {
 const alerts=[];
 if(data.danger_signs===1||data.danger_signs===3||data.wheeze===4)
  alerts.push('Tórax silencioso por troca aérea mínima ou ausente é sinal de alarme, não ausência de obstrução. '+severityWarning);
 if(data.danger_signs===2||data.danger_signs===3)
  alerts.push('Apneia, cianose, exaustão ou alteração da consciência informadas. '+severityWarning);
 if(score.id==='aairs-arnold-2012'&&data.air_entry===3)
  alerts.push('Entrada de ar mínima ou ausente. '+severityWarning);
 if(typeof data.spo2==='number'&&data.spo2<92)
  alerts.push('SpO₂ informada abaixo de 92%. Verifique a medida e avalie imediatamente a oxigenação no contexto clínico; a elegibilidade do escore não elimina este alerta.');
 if(data.respiratory_rate===0||data.heart_rate===0)
  alerts.push('Frequência respiratória ou cardíaca igual a zero: confirmar imediatamente a observação e avaliar a pessoa. O valor não pode gerar uma pontuação tranquilizadora.');
 if(data.respiratory_support===2||data.respiratory_support===3)
  alerts.push('Há suporte por alto fluxo, pressão positiva ou ventilação invasiva. A avaliação da gravidade e do suporte prevalece; esta implementação não interpreta sinais modificados por esse suporte.');
 return [...new Set(alerts)];
}
function ineligibility(score,data) {
 const reasons=[];
 if(typeof data.age_years==='number'&&(data.age_years<score.ageRange[0]||data.age_years>score.ageRange[1]))reasons.push(`Idade fora da faixa documentada de ${score.ageRange[0]}–${score.ageRange[1]} anos completos.`);
 if(data.asthma_context===0)reasons.push('Não há exacerbação asmática estabelecida clinicamente para aplicar este instrumento.');
 if(data.respiratory_support===2||data.respiratory_support===3)reasons.push('Alto fluxo/pressão positiva/ventilação invasiva: contexto não interpretado nesta implementação.');
 if(score.requiresRoomAir&&data.respiratory_support===1)reasons.push('Esta versão exige SpO₂ em ar ambiente na mesma avaliação. Não substituir pela medida sob oxigênio e não retirar oxigênio para calcular.');
 if(score.id==='mpis-maekawa-2018'&&data.mpis_exclusions>0)reasons.push('Cardiopatia cianótica, traqueostomia ou oxigênio domiciliar: excluídos da coorte de Maekawa 2018.');
 if(score.id==='cas-parkin-1996'&&data.inpatient===0)reasons.push('O CAS de Parkin foi estudado em crianças hospitalizadas; outro ambiente não é interpretado neste contrato.');
 if(score.id==='cas-parkin-1996'&&data.resting===0)reasons.push('O CAS exige observação em repouso, sem choro. Aguardar avaliação apropriada sem atrasar cuidado necessário.');
 if(score.id==='cas-parkin-1996'&&data.cas_study_context>0)reasons.push('Condições da coorte de Parkin não atendidas: exige episódio prévio de sibilância e broncodilatador inalado nas últimas 8 horas; exclui comorbidades crônicas especificadas e pneumonia radiográfica.');
 if(score.id==='cas-parkin-1996'&&(data.danger_signs===2||data.danger_signs===3))reasons.push('A coorte CAS excluiu sinais graves como cianose ou obnubilação. Esta implementação não emite total na presença dos sinais críticos agrupados neste campo.');
 if((score.id==='mpis-maekawa-2018'||score.id==='cas-parkin-1996')&&(data.danger_signs===1||data.danger_signs===3||data.wheeze===4))reasons.push('Tórax silencioso não tem categoria expressa na tabela desta versão. Guarda editorial: total suspenso, sem inventar pontos para ausência de sibilos.');
 if(data.respiratory_rate===0||data.heart_rate===0)reasons.push('Frequência zero não é interpretada pelo escore nesta implementação.');
 return reasons;
}
function conflicts(score,data) {
 const errors=[];
 const silent=data.danger_signs===1||data.danger_signs===3;
 if(score.id==='pass-gorelick-2004'&&silent&&typeof data.wheeze==='number'&&data.wheeze>=0&&data.wheeze!==2)errors.push('wheeze');
 if(score.id==='aairs-arnold-2012') {
  if(silent&&typeof data.wheeze==='number'&&data.wheeze>=0&&data.wheeze!==3)errors.push('wheeze');
  if(silent&&typeof data.air_entry==='number'&&data.air_entry>=0&&data.air_entry!==3)errors.push('air_entry');
  if(data.air_entry===3&&data.wheeze===0)errors.push('wheeze');
 }
 return errors;
}
function evaluate(score,values) {
 const {data,observations,errors}=snapshot(score,values),alerts=safety(score,{...data,...observations}),reasons=ineligibility(score,data),inconsistent=conflicts(score,data);
 const allErrors=[...new Set([...errors,...inconsistent])];
 const common={total:null,breakdown:[],alerts,level:alerts.length?'high':'medium',errors:allErrors};
 if(reasons.length)return {...common,complete:allErrors.length===0,status:'ineligible',displayValue:'Não aplicável',label:'Não interpretar como '+score.shortName,reason:reasons.join(' '),action:[...alerts,...reasons].join(' '),audit:'Total não emitido: contexto fora do contrato ou observação não interpretável.'};
 if(allErrors.length)return {...common,complete:false,status:'incomplete',label:'Dados insuficientes ou inconsistentes',reason:inconsistent.length?'Há conflito entre tórax silencioso/entrada de ar e a categoria de sibilos. Reavalie os achados sem corrigir pontos automaticamente.':'Complete todos os dados; desconhecido não vale zero.',action:alerts.length?alerts.join(' '):'Complete a avaliação observada, sem presumir respostas.',audit:'Total não emitido.'};
 const breakdown=score.components(data).map(([id,points])=>({label:score.fields.find(field=>field.id===id).label,points}));
 const total=breakdown.reduce((sum,item)=>sum+item.points,0);
 return {...common,complete:true,status:'scored',total,label:`${score.shortName} · gravidade observada`,action:alerts.length?alerts.join(' ')+' '+noTreatment:noTreatment,breakdown,audit:breakdown.map(item=>item.points).join(' + ')+' = '+total};
}
function createScore(config) {
 const score={...config,expanded:true,specialty:'Pediatria',specialties:['Pneumologia'],reviewDate:DATE,range:`0–${config.max}`,unit:'pontos',categoricalOnIneligible:true,resultScale:true,
  eligibilityConfirmation:'Confirmei a população, a versão e as condições da observação; a pontuação não determina tratamento nem alta.',
  fields:[...contextFields(),...config.fields],
  limits:config.limits+' '+noTreatment+' '+severityWarning+' A redação em português é editorial, não uma versão transcultural validada. Os limites etários usam anos completos. Valores de FR, FC e SpO₂ devem ser inteiros registrados; não há arredondamento automático.',
 };
 score.safeCalculate=values=>evaluate(score,values);
 score.compute=score.safeCalculate;
 score.safeValidate=values=>evaluate(score,values).errors;
 score.validate=score.safeValidate;
 score.countCompleted=values=>score.fields.length-snapshot(score,values).errors.length;
 score.assessPartial=values=>{const result=evaluate(score,values);return result.alerts.length||result.status==='ineligible'?{level:result.alerts.length?'high':'medium',alert:[...result.alerts,...(result.status==='ineligible'?[result.reason]:[])].join(' ')}:null;};
 return score;
}

export const mpisMaekawa2018=createScore({
 id:'mpis-maekawa-2018',shortName:'MPIS',name:'MPIS · Carroll/Maekawa',subtitle:'Asma aguda · tabela Maekawa 2018 · 0–18',max:18,ageRange:[1,18],requiresRoomAir:true,
 aliases:['Modified Pulmonary Index Score','Índice pulmonar modificado','MPIS Carroll 2005','MPIS Maekawa 2018'],population:'Pediatria · 1–18 anos · exacerbação asmática',
 scope:'Gravidade observada e comparação seriada na exacerbação asmática pediátrica. Contrato da tabela de Maekawa 2018, derivado do MPIS de Carroll 2005. Coorte de 1–18 anos; excluir cardiopatia cianótica, traqueostomia e oxigênio domiciliar. Requer SpO₂ em ar ambiente na mesma observação.',
 fields:[
  select('mpis_exclusions','Exclusões da coorte de Maekawa',[[0,'Nenhuma, após conferência'],[1,'Cardiopatia congênita cianótica'],[2,'Traqueostomia'],[3,'Oxigênio domiciliar'],[4,'Mais de uma dessas condições']],'Qualquer condição listada impede interpretação nesta população.','Contexto da avaliação'),
  numeric('spo2','SpO₂ em ar ambiente (%)',0,100,'Medida em percentual inteiro na mesma avaliação. Não retirar oxigênio para medir.'),
  select('accessory','Uso de musculatura acessória',[[0,'Não observado'],[1,'Discreto'],[2,'Moderado'],[3,'Intenso']]),
  select('ie_ratio','Relação entre tempo inspiratório e expiratório (I:E)',[[0,'2:1'],[1,'1:1'],[2,'1:2'],[3,'1:3']],'Categorias da tabela original. Seleção clínica; não calcular nem interpolar outras razões.'),
  select('wheeze','Sibilância e aeração',[[0,'Sem sibilos, sem tórax silencioso'],[1,'Sibilos ao final da expiração'],[2,'Sibilos inspiratórios e expiratórios, com boa aeração'],[3,'Sibilos inspiratórios e expiratórios, com aeração reduzida'],[4,'Tórax silencioso por troca aérea mínima ou ausente']],'Tórax silencioso não recebe zero: a tabela não define essa categoria; o total fica suspenso.'),
  numeric('heart_rate','Frequência cardíaca (batimentos/minuto)',0,350,'Inteiro. A faixa muda no aniversário de 3 anos.'),
  numeric('respiratory_rate','Frequência respiratória (respirações/minuto)',0,200,'Inteiro. A faixa muda no aniversário de 6 anos.')
 ],
 formula:'Seis componentes de 0 a 3, total 0–18. SpO₂: >95=0;93–95=1;90–92=2;<90=3. FC <3 anos: <120/120–140/141–160/>160; ≥3 anos: <100/100–120/121–140/>140. FR <6 anos: ≤30/31–45/46–60/>60; ≥6 anos: ≤20/21–35/36–50/>50. Usar uma faixa de idade por sinal vital, sem somar faixas.',
 components:data=>[['spo2',data.spo2>95?0:data.spo2>=93?1:data.spo2>=90?2:3],['accessory',data.accessory],['ie_ratio',data.ie_ratio],['wheeze',data.wheeze],['heart_rate',data.age_years<3?(data.heart_rate<120?0:data.heart_rate<=140?1:data.heart_rate<=160?2:3):(data.heart_rate<100?0:data.heart_rate<=120?1:data.heart_rate<=140?2:3)],['respiratory_rate',data.age_years<6?(data.respiratory_rate<=30?0:data.respiratory_rate<=45?1:data.respiratory_rate<=60?2:3):(data.respiratory_rate<=20?0:data.respiratory_rate<=35?1:data.respiratory_rate<=50?2:3)]],
 limits:'Adaptação editorial em português da tabela de Maekawa et al. (2018), CC BY 4.0, com código, interface e guardas de segurança próprios. A validação de utilidade de Maekawa incluiu 2.242 atendimentos em uma emergência. O corte ≥8 foi estudado nessa coorte e não é apresentado como regra universal. Não confundir com PI, Pulmonary Score ou PASS. A tabela não especifica tórax silencioso; sua suspensão é guarda editorial de segurança.',
 sources:[ref('Maekawa et al. · JMA Journal 2018 · tabela 1 e população · CC BY 4.0','https://www.jstage.jst.go.jp/article/jmaj/1/1/1_57/_pdf/-char/ja'),ref('Carroll et al. · MPIS original · 2005','https://pubmed.ncbi.nlm.nih.gov/15801246/'),ref('Maekawa 2018 · licença editorial e atribuição','https://www.jstage.jst.go.jp/article/jmaj/1/1/1_57/_article/-char/en'),ref('Creative Commons Attribution 4.0','https://creativecommons.org/licenses/by/4.0/')],
 reuse:{kind:'CC-BY-4.0',attribution:'Maekawa T et al., JMA Journal 2018, DOI 10.31662/jmaj.2018-0010. Código próprio e adaptação editorial PT-BR; interface, validação de dados e guardas de segurança acrescentadas. Sem reprodução de figuras.'}
});

export const passGorelick2004=createScore({
 id:'pass-gorelick-2004',shortName:'PASS Gorelick',name:'PASS · Gorelick 2004',subtitle:'Três componentes · asma aguda · 0–6',max:6,ageRange:[1,18],
 aliases:['Pediatric Asthma Severity Score','PASS 0–6','PASS Gorelick'],population:'Pediatria · 1–18 anos · emergência',
 scope:'Exacerbação asmática de 1–18 anos. Variante original de Gorelick, com três componentes e total 0–6, observada na emergência. Descreve intensidade e mudança dos achados; não é a PASS de cinco componentes e 5–15 pontos.',
 fields:[
  select('work_breathing','Intensidade do esforço respiratório',[[0,'Ausente ou discreto'],[1,'Moderado'],[2,'Intenso']]),
  select('wheeze','Intensidade da sibilância',[[0,'Ausente ou discreta, sem tórax silencioso'],[1,'Moderada'],[2,'Intensa; ou ausente por troca aérea muito reduzida']],'Silêncio por troca aérea mínima pertence à categoria de 2 pontos, não à ausência de sibilância com aeração preservada.'),
  select('expiration','Prolongamento da fase expiratória',[[0,'Normal ou discreto'],[1,'Moderado'],[2,'Muito acentuado']])
 ],
 formula:'Esforço respiratório + sibilância + prolongamento da expiração; cada componente 0, 1 ou 2. Total 0–6. Idade, contexto, suporte e sinais de alarme não somam pontos.',
 components:data=>[['work_breathing',data.work_breathing],['wheeze',data.wheeze],['expiration',data.expiration]],
 limits:'Gorelick estudou duas coortes, com 852 e 369 participantes. A associação com internação não é convertida em probabilidade individual. Não foram adotadas faixas universais de gravidade, internação ou alta. Cortes 7, 11 ou 12 pertencem a outra variante e não se aplicam a este total.',
 sources:[ref('Gorelick et al. · PASS original · Acad Emerg Med 2004','https://pubmed.ncbi.nlm.nih.gov/14709423/'),ref('Johnson et al. · comparação primária de escores · tabela PASS · 2017','https://pmc.ncbi.nlm.nih.gov/articles/PMC5425314/')],
 reuse:{kind:'independent-method-implementation',attribution:'Método atribuído a Gorelick et al. (2004); tabela operacional conferida em Johnson et al. (2017). Código e redação PT-BR próprios, sem figuras nem reprodução do texto do artigo. Não foi identificada exigência específica de pagamento pelo algoritmo; não se afirma licença irrestrita sobre a publicação.'}
});

export const aairsArnold2012=createScore({
 id:'aairs-arnold-2012',shortName:'AAIRS',name:'AAIRS · Arnold 2012/2015',subtitle:'Asma aguda · sete componentes · 0–16',max:16,ageRange:[5,17],requiresRoomAir:true,
 aliases:['Acute Asthma Intensity Research Score','AAIRS 0–16','AAIRS Arnold'],population:'Pediatria · 5–17 anos · exacerbação asmática',
 scope:'Gravidade e mudança dos sinais da exacerbação asmática, conforme Arnold 2012 e avaliação de 2015, em pacientes de 5–17 anos. Nesses estudos em pronto-socorro pediátrico terciário, o AAIRS foi avaliado inicialmente e após 2 horas de tratamento. Esses momentos descrevem o desenho dos estudos, não um intervalo obrigatório de reavaliação; a soma em outros momentos descreve os achados observados, sem equivaler à validação da resposta em 2 horas. Três locais de retração são independentes. Requer SpO₂ em ar ambiente na mesma avaliação.',
 fields:[
  select('scm_retractions','Retração supraesternal / uso do esternocleidomastoideo',[[0,'Ausente'],[2,'Presente']],'Um único componente, não dois. Não acrescentar o item de escalenos do PRAM.'),
  select('intercostal_retractions','Retrações intercostais',[[0,'Ausentes'],[2,'Presentes']]),
  select('subcostal_retractions','Retrações subcostais',[[0,'Ausentes'],[2,'Presentes']]),
  select('air_entry','Entrada de ar',[[0,'Preservada'],[1,'Reduzida apenas nas bases'],[2,'Reduzida de forma difusa'],[3,'Mínima ou ausente']]),
  select('wheeze','Sibilância',[[0,'Ausente, sem tórax silencioso'],[1,'Na expiração'],[2,'Na inspiração e expiração'],[3,'Audível sem estetoscópio; ou silêncio com entrada mínima de ar']],'Tórax silencioso com entrada mínima não recebe zero.'),
  numeric('spo2','SpO₂ em ar ambiente (%)',0,100,'Percentual inteiro. Não usar saturação sob oxigênio e não retirar oxigênio para medir.'),
  select('expiration','Fase expiratória',[[0,'Sem prolongamento'],[1,'Prolongada'],[2,'Muito prolongada']],'Categorias clínicas originais. Não interpolar razões numéricas I:E de outros protocolos.')
 ],
 formula:'Três retrações (0 ou 2 cada) + entrada de ar (0–3) + sibilância (0–3) + SpO₂ (≥95%=0;92–94%=1;<92%=2) + fase expiratória (0–2). Total 0–16: há 17 valores inteiros possíveis, mas o máximo não é 17.',
 components:data=>[['scm_retractions',data.scm_retractions],['intercostal_retractions',data.intercostal_retractions],['subcostal_retractions',data.subcostal_retractions],['air_entry',data.air_entry],['wheeze',data.wheeze],['spo2',data.spo2>=95?0:data.spo2>=92?1:2],['expiration',data.expiration]],
 limits:'A avaliação de 2015 analisou 806 participantes únicos. A utilização em pathways a partir de 2 anos não amplia a faixa validada de 5–17 anos. Faixas de gravidade e condutas do pathway Vanderbilt não foram importadas para este contrato de pesquisa. Não é PRAM e não acrescenta contração dos escalenos.',
 sources:[ref('Arnold et al. · AAIRS · tabela original · 2012','https://pmc.ncbi.nlm.nih.gov/articles/PMC3769961/'),ref('Arnold et al. · desempenho atualizado · 2015','https://pmc.ncbi.nlm.nih.gov/articles/PMC4490084/')],
 reuse:{kind:'independent-method-implementation',attribution:'Método atribuído a Arnold et al. (2012/2015). Código e redação PT-BR próprios; não reproduz figuras, diagramação ou o pathway. Não foi identificada exigência específica de pagamento pelo algoritmo; não se afirma licença irrestrita sobre a publicação.'}
});

export const casParkin1996=createScore({
 id:'cas-parkin-1996',shortName:'CAS Parkin',name:'CAS · Parkin 1996',subtitle:'Asma hospitalizada · 1–5 anos · 0–10',max:10,ageRange:[1,5],
 aliases:['Clinical Asthma Score Parkin','CAS 0–10','CAS Parkin'],population:'Pediatria · 1–5 anos · hospitalizados',
 scope:'Avaliação seriada dos sinais de asma em crianças hospitalizadas de 1–5 anos. Avaliar em repouso, sem choro. A coorte exigia episódio prévio de sibilância e broncodilatador inalado nas últimas 8 horas; excluía comorbidades crônicas especificadas, pneumonia radiográfica, cianose ou obnubilação. Versão de Parkin 1996, com cinco componentes; não é o Childhood Asthma Score de outros protocolos nem o SCAS.',
 fields:[
  select('inpatient','Criança hospitalizada',[[1,'Sim'],[0,'Não']], 'A população original é de pacientes internados.','Contexto da avaliação'),
  select('resting','Observação em repouso, sem choro',[[1,'Sim'],[0,'Não']], 'Não presumir equivalência de observação durante choro.','Contexto da avaliação'),
  select('cas_study_context','Outras condições da coorte original CAS',[[0,'História, tratamento recente e ausência das exclusões confirmados'],[1,'Sem episódio prévio de sibilância'],[2,'Sem broncodilatador inalado nas últimas 8 horas'],[3,'Comorbidade crônica entre as exclusões'],[4,'Pneumonia radiográfica conhecida']],'Exige sibilância prévia e broncodilatador inalado nas últimas 8 horas. Exclui outra doença pulmonar crônica, doença cardíaca ou neurológica, imunossupressão e pneumonia radiográfica. Esta lista não solicita radiografia para calcular. Fonte das condições: síntese institucional Children’s Mercy, página 13.','Contexto da avaliação'),
  numeric('respiratory_rate','Frequência respiratória (respirações/minuto)',0,200,'Contagem inteira em repouso, sem choro. 40 e 60 pertencem à categoria intermediária.'),
  select('wheeze','Sibilância com estetoscópio',[[0,'Ausente, sem tórax silencioso'],[1,'Apenas expiratória'],[2,'Inspiratória e expiratória'],[4,'Tórax silencioso por troca aérea mínima ou ausente']],'A tabela não atribui pontos ao tórax silencioso; este achado suspende o total e mantém alerta.'),
  select('indrawing','Tiragem',[[0,'Ausente'],[1,'Somente subcostal'],[2,'Subcostal e intercostal']]),
  select('dyspnea','Dispneia observada',[[0,'Não observada'],[1,'Discreta'],[2,'Acentuada']],'Avaliação clínica da dificuldade para respirar, feita pelo observador.'),
  select('ie_ratio','Tempo de inspiração comparado ao de expiração',[[0,'Inspiração mais longa'],[1,'Tempos iguais'],[2,'Expiração mais longa']])
 ],
 formula:'FR (<40=0;40–60=1;>60=2) + sibilância + tiragem + dispneia observada + relação I:E. Cinco componentes de 0 a 2, total 0–10.',
 components:data=>[['respiratory_rate',data.respiratory_rate<40?0:data.respiratory_rate<=60?1:2],['wheeze',data.wheeze],['indrawing',data.indrawing],['dyspnea',data.dyspnea],['ie_ratio',data.ie_ratio]],
 limits:'Estudo original com 58 hospitalizados de 1–5 anos. A síntese institucional Children’s Mercy documenta as condições e exclusões da coorte; não foi obtido o artigo original integral nesta revisão. Não há faixas universais de alta, probabilidade de internação ou equivalência automática com emergência, adultos ou bronquiolite. Tórax silencioso não tem categoria expressa; sua suspensão e a extensão conservadora da suspensão a todos os sinais críticos do campo de segurança são guardas editoriais, não novos pesos do CAS.',
 sources:[ref('Parkin et al. · desenvolvimento do Clinical Asthma Score · 1996','https://pubmed.ncbi.nlm.nih.gov/8699199/'),ref('Children’s Mercy · tabela CAS Parkin · página 40 · 2020','https://www.childrensmercy.org/siteassets/media-documents-for-depts-section/documents-for-health-care-providers/evidence-based-practice/critically-appraised-topics/respiratory-scores.pdf')],
 reuse:{kind:'independent-method-implementation',attribution:'Método atribuído a Parkin et al. (1996), tabela conferida na síntese institucional Children’s Mercy (2020). Código e redação PT-BR próprios, sem reprodução de figura ou texto do artigo. Não foi identificada exigência específica de pagamento pelo algoritmo; não se afirma licença irrestrita sobre a publicação.'}
});

export const asthmaScores=[mpisMaekawa2018,passGorelick2004,aairsArnold2012,casParkin1996];
const documentaryRecords={
 'mpis-maekawa-2018':{url:'https://www.jstage.jst.go.jp/article/jmaj/1/1/1_57/_pdf/-char/ja',entity:'Maekawa et al. / JMA Journal',version_or_date:'2018',locator:'Página 58: Methods, Data collection e Table 1; licença CC BY 4.0 na página editorial J-STAGE.',evidence_kind:'primary_article_pdf_and_publisher_license'},
 'pass-gorelick-2004':{url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC5425314/',entity:'Johnson et al., comparação primária de escores; Gorelick et al. 2004, derivação',version_or_date:'Gorelick 2004 / tabela Johnson 2017',locator:'Tabela comparativa PASS de três itens; população e coortes confirmadas no resumo primário de Gorelick, PMID 14709423.',evidence_kind:'primary_comparison_table_and_original_abstract'},
 'aairs-arnold-2012':{url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC3769961/',entity:'Arnold et al.',version_or_date:'2012; desempenho atualizado em 2015',locator:'Tabela original AAIRS em conteúdo indexado e confronto institucional Vanderbilt; população 5–17 anos e máximo 16 confirmados. Sem importar cortes terapêuticos do pathway.',evidence_kind:'indexed_primary_table_and_institutional_crosscheck'},
 'cas-parkin-1996':{url:'https://www.childrensmercy.org/siteassets/media-documents-for-depts-section/documents-for-health-care-providers/evidence-based-practice/critically-appraised-topics/respiratory-scores.pdf',entity:'Children’s Mercy, síntese institucional de Parkin et al. 1996',version_or_date:'Síntese 2020 / CAS Parkin 1996',locator:'Página 40: tabela CAS; página 13: população, critérios de inclusão e exclusão. Artigo original integral não obtido nesta revisão.',evidence_kind:'institutional_evidence_synthesis_with_operational_table'}
};
for(const score of asthmaScores)score.source_validation={references:[{...documentaryRecords[score.id],examined:true,checked_at:'2026-10-10',reliable_because:'Contrato operacional e escopo conferidos documentalmente e revisados de forma independente por agente; testes numéricos não substituem homologação clínica humana.'}]};
export function calculateAsthmaScore(id,values) {
 const score=typeof id==='string'?asthmaScores.find(item=>item.id===id):undefined;
 return score?score.safeCalculate(values):{complete:false,total:null,status:'unknown-score',errors:[],alerts:[],reason:'Instrumento desconhecido.',level:'medium',breakdown:[],audit:'Total não emitido.'};
}
