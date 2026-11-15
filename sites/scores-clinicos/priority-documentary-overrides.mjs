export function applyDocumentedOverrides(priorityScores,helpers){
const {s,y,n,ref,b,make,ordinal,meta,result,continuous,pmc}=helpers;
const priorityById=id=>priorityScores.find(score=>score.id===id);
{
// Soberania 2026-09-30: correções documentais incrementais; inserir após priorityById e antes de review_status.
const gcsPed=priorityById('pediatric-gcs');
gcsPed.name='Glasgow pediátrico · RCH <4 anos';
gcsPed.population='Crianças <4 anos · versão RCH';
gcsPed.range='3–15';
gcsPed.scope='Crianças menores de 4 anos em avaliação de traumatismo craniano; adaptação da tabela RCH (novembro de 2021). Registrar E, V e M separadamente e comparar com a capacidade basal do desenvolvimento.';
gcsPed.fields.find(f=>f.id==='verbal').options=[{value:5,label:'Alerta; balbucia ou usa palavras na capacidade habitual'},{value:4,label:'Menos palavras que o habitual; choro irritável espontâneo'},{value:3,label:'Chora apenas à dor'},{value:2,label:'Geme à dor'},{value:1,label:'Sem resposta à dor'}];
gcsPed.fields.find(f=>f.id==='motor').options.find(o=>o.value===5).label='Localiza a dor ou retira ao toque';
gcsPed.fields.find(f=>f.id==='motor').options.find(o=>o.value===4).label='Retira à dor';
gcsPed.bands=[b(8,'Rebaixamento importante','high','Avaliar imediatamente via aérea, ventilação, perfusão e causas reversíveis; integrar todo o exame.'),b(13,'Consciência alterada (≤13)','medium','No trauma craniano, GCS ≤13 exige avaliação urgente e manejo de lesão moderada/grave conforme quadro.'),b(15,'Registrar E, V e M','medium','GCS 14 persistente exige observação/investigação conforme contexto; 15 não exclui lesão grave.')];
gcsPed.limits='Usar a versão RCH <4 anos; não misturar descritores de outras adaptações pediátricas. Sedação, bloqueio neuromuscular, deficiência neurológica basal e barreiras de exame devem ser registrados. Não converter componente não testável em valor presumido. Esta soma não autoriza alta nem decide imagem isoladamente.';
gcsPed.sources=[ref('Royal Children’s Hospital Melbourne · Head injury · GCS <4 anos · novembro 2021','https://www.rch.org.au/clinicalguide/guideline_index/Head_injury/')];
const yos=priorityById('yale-observation');
yos.population='Crianças febris <2 anos · observacional';
yos.scope='Formulário observacional Yale de seis domínios. A derivação citada ocorreu em crianças febris <2 anos; o estudo PECARN de 2017 reproduz o instrumento e demonstra que ele não exclui infecção bacteriana grave/invasiva em lactentes ≤60 dias.';
const yosDescriptions=[
 ['Forte, com tonalidade normal, ou contente sem chorar','Lamentação ou soluços','Fraco, gemido ou agudo'],
 ['Chora brevemente e para, ou contente sem chorar','Chora intermitentemente','Choro contínuo ou quase não responde'],
 ['Permanece acordada; se dorme, desperta rapidamente ao estímulo','Fecha os olhos brevemente; desperta com estímulo prolongado','Adormece ou não desperta'],
 ['Rósea','Extremidades pálidas ou acrocianose','Pálida, cianótica, mosqueada ou acinzentada'],
 ['Pele/olhos normais; mucosas úmidas','Pele/olhos normais; boca discretamente seca','Pele pastosa/com prega e mucosas secas e/ou olhos encovados'],
 ['Sorri','Sorri brevemente','Não sorri; face ansiosa, apática ou inexpressiva']
];
yos.fields.forEach((f,i)=>{f.options=yosDescriptions[i].map((label,j)=>({value:[1,3,5][j],label}));});
delete yos.bands;
yos.compute=x=>{const total=Object.values(x).reduce((sum,p)=>sum+p,0);return result(total,total<=10?'YOS ≤10 · não exclui infecção grave':'YOS >10 · aparência comprometida','Integrar idade, sinais vitais, perfusão, exame e protocolo da criança febril; não usar a soma para excluir infecção bacteriana ou autorizar alta.',Object.entries(x).map(([key,p])=>`${key}=${p}`).join('; '),total>10?'high':'medium');};
yos.limits='Escala de aparência, sem probabilidade universal. No estudo PECARN, valores ≤10 não excluíram infecção bacteriana grave ou invasiva em ≤60 dias; aplicar protocolos específicos por idade. Não preencher domínio desconhecido com 1. Os cortes intermediários 11–15 e percentuais históricos não são apresentados como risco validado contemporâneo.';
yos.sources=[ref('Nigrovic et al. · Yale Observation Scale · Pediatrics 2017 · Table1 e resultados PECARN','https://pmc.ncbi.nlm.nih.gov/articles/PMC5495524/')];
const gorelick=priorityById('gorelick-10');
gorelick.scope='Crianças de 1 mês a 5 anos com diarreia/vômitos; versão de dez sinais reproduzida na Table2 de Pringle et al. 2011. Cada sinal anormal vale 1 ponto; ≥3 e ≥7 sinais foram associados a perdas ≥5% e ≥10%, respectivamente, sem substituir avaliação clínica.';
gorelick.fields.find(f=>f.id==='sign7').label='Taquicardia (avaliada segundo idade e contexto)';
gorelick.fields.find(f=>f.id==='sign7').hint='O quadro examinado usa taquicardia; não estabelece FC >150 bpm como limite universal para todas as idades.';
gorelick.fields.find(f=>f.id==='sign3').label='Respiração profunda ou profunda e rápida';
gorelick.fields.find(f=>f.id==='sign6').label='Pulso fraco, filiforme ou impalpável';
gorelick.fields.find(f=>f.id==='sign9').label='Aspecto inquieto, letárgico ou inconsciente';
gorelick.fields.find(f=>f.id==='sign1').hint='Retorno da prega lento ou >2 segundos, conforme quadro reproduzido.';
gorelick.fields.find(f=>f.id==='sign8').hint='Diurese reduzida ou sem urinar por várias horas; integrar perdas e ingestão.';
gorelick.limits='Acurácia e calibração variam entre populações; a validação de 2011 encontrou desempenho limitado em hospitais de baixo recurso. Sinais isolados não excluem desidratação. Choque, sepse, cardiopatia, desnutrição aguda grave e idade alteram a interpretação. Não determina sozinho via, volume ou solução de reposição. A derivação original excluiu malnutrição, tratamento recente em outro serviço, sintomas por mais de 5 dias e hipo/hipernatremia; não presumir o mesmo desempenho nessas situações. Sódio não medido não significa sódio normal; não é necessário solicitar exame apenas para somar os sinais.';
gorelick.sources=[ref('Gorelick, Shaw e Murphy · derivação original 1997 · critérios de inclusão/exclusão no resumo','https://pubmed.ncbi.nlm.nih.gov/9113963/'),ref('Pringle et al. · validação primária · Int J Emerg Med 2011 · Table2, dez sinais e cortes','https://pmc.ncbi.nlm.nih.gov/articles/PMC3182880/')];
// OMS/IMCI: a danger observation is independent of the dehydration classification.
const who=priorityById('who-dehydration');
const whoOwnValue=(values,key)=>{
 try {
  if(values===null||typeof values!=='object'||Array.isArray(values))return undefined;
  const descriptor=Object.getOwnPropertyDescriptor(values,key);
  return descriptor&&Object.hasOwn(descriptor,'value')?descriptor.value:undefined;
 }catch{return undefined;}
};
who.safeValidate=values=>who.fields.filter(field=>{
 const value=whoOwnValue(values,field.id);
 return !['number','string'].includes(typeof value)||!field.options.some(option=>String(option.value)===String(value));
}).map(field=>field.id);
who.assessPartial=values=>{
 const observations=[];
 if([2,'2'].includes(whoOwnValue(values,'general')))observations.push('Letárgica ou inconsciente');
 if([2,'2'].includes(whoOwnValue(values,'drink')))observations.push('Não consegue beber ou bebe mal');
 return observations.length?{level:'high',alert:'Achado informado: '+observations.join('; ')+'. Requer avaliação clínica imediata, independentemente da categoria de desidratação. Não aguarde completar o formulário. A categoria hídrica isolada não autoriza Plano A isolado nem alta.'}:null;
};
const whoCompute=who.compute;
who.compute=values=>{
 const classification=whoCompute(values),danger=who.assessPartial(values);
 return danger?{...classification,level:'high',alerts:[danger.alert],action:'Priorizar avaliação clínica imediata do achado informado e definir o cuidado conforme exame e contexto. A classificação de desidratação não afasta gravidade nem autoriza Plano A isolado ou alta.'}:classification;
};
who.limits+=' Letargia/inconsciência é sinal geral de perigo OMS/IMCI. A opção composta “Não consegue beber ou bebe mal” mantém alerta conservador de avaliação imediata, sem afirmar incapacidade de beber em todos os casos. O alerta não altera os critérios nem a categoria hídrica e persiste com dados incompletos; não gera prescrição.';
who.sources.push(ref('OMS/EMRO · IMCI · sinais gerais de perigo e atenção urgente','https://www.emro.who.int/child-adolescent-health/imci/organization-of-work-at-the-health-facility.html'),ref('OMS · IMCI Chart Booklet · sinais gerais de perigo, página 1','https://cdn.who.int/media/docs/default-source/mca-documents/child/imci-integrated-management-of-childhood-illness/imci-in-service-training/imci-chart-booklet.pdf?sfvrsn=f63af425_1'));
const bms=priorityById('bacterial-meningitis-score');
// Clinical finding only: this partial alert neither applies nor completes BMS.
bms.assessPartial=function bmsGramAlert(values) {
 try {
  if(values===null||typeof values!=='object'||Array.isArray(values))return null;
  const descriptor=Object.getOwnPropertyDescriptor(values,'gram');
  if(!descriptor||!Object.hasOwn(descriptor,'value')||!(descriptor.value===2||descriptor.value==='2'))return null;
  return {level:'high',alert:'Gram do LCR positivo: avaliação clínica urgente. Não aguarde completar o escore para avaliar e conduzir a suspeita de meningite bacteriana conforme protocolo. BMS ainda não calculado.'};
 } catch {return null;}
};
bms.population='29 dias–19 anos · pleocitose e elegibilidade confirmadas';
bms.scope='BMS original: crianças previamente saudáveis de 29 dias a 19 anos com pleocitose liquórica (leucócitos ≥10 células/µL), sem antibiótico antes da punção lombar e sem condição de exclusão. Os dois casos falsamente negativos da validação multicêntrica de 2007 tinham menos de 2 meses; zero não exclui meningite nem autoriza alta.';
bms.fields.unshift(meta(y('eligible','Caso elegível e dados/exclusões confirmados',1,'29 dias–19 anos; LCR ≥10 leucócitos/µL; sem antibiótico antes da PL, doença crítica/sepse, imunossupressão, púrpura, dispositivo do SNC ou neurocirurgia recente, outra infecção bacteriana ou suspeita maior de encefalite. PL muito traumática (≥10.000 hemácias/mm³) fica fora da validação operacional examinada. Não presumir dados ausentes.')));
delete bms.bands;
bms.compute=x=>{if(!x.eligible)return {...result(null,'BMS não aplicável · elegibilidade não confirmada','Confirmar população, pleocitose, antibiótico prévio, exclusões e dados necessários; tratar suspeita clínica grave sem aguardar escore.','elegibilidade não confirmada','high'),displayValue:'Não aplicável'};const total=x.gram+x.seizure+x.csfanc+x.protein+x.bloodanc;return result(total,total===0?'Muito baixo risco pelo BMS · não exclui meningite':'BMS >0 · não é muito baixo risco','Integrar avaliação clínica, microbiologia e protocolo. Zero não autoriza alta ou suspensão de antibiótico; em lactentes <2 meses o desempenho exige especial cautela.',`Gram=${x.gram}; convulsão=${x.seizure}; ANC LCR=${x.csfanc}; proteína=${x.protein}; ANC sangue=${x.bloodanc}`,total===0?'medium':'high');};
bms.limits='Não aplicar fora da população elegível nem converter dado desconhecido em ausência. Gram positivo vale 2; demais critérios 1; total 0–6. Os limites dos neutrófilos e proteína incluem a igualdade. Células/mm³ e células/µL são numericamente equivalentes. Não usar um escore zero para excluir meningite bacteriana, sobretudo em <2 meses, ou para atrasar tratamento de doença grave. Exclusões operacionais adicionais da validação de 2015 são declaradas de modo conservador.';
bms.sources=[ref('Nigrovic et al. · BMS original 2002 · PMID12359784','https://pubmed.ncbi.nlm.nih.gov/12359784/'),ref('Nigrovic et al. · validação multicêntrica BMS2007 · PMID17200475','https://pubmed.ncbi.nlm.nih.gov/17200475/'),ref('Korean J Pediatr 2015 · BMS Table1, Methods e exclusões','https://pmc.ncbi.nlm.nih.gov/articles/PMC4543184/')];
const downes=priorityById('downes');
downes.name='Downes · quadro clínico 2024';
downes.population='Recém-nascidos com desconforto respiratório';
downes.scope='Versão do quadro Downes reproduzida na Table1 de Singh, Munian e Memela (2024). Cinco sinais 0–2, total 0–10. Registrar suporte em curso e reavaliar a evolução; não intercambiar descritores de variantes sem identificá-las.';
downes.fields.find(f=>f.id==='rr').options.find(o=>o.value===2).label='>80/min';
downes.fields.find(f=>f.id==='cyanosis').options=[{value:0,label:'Ausente'},{value:1,label:'Cianose aliviada por O₂'},{value:2,label:'Cianose apesar de O₂'}];
downes.fields.find(f=>f.id==='cyanosis').hint='Quadro examinado não especifica FiO₂; registrar suporte/FiO₂ observados. Não é recomendação de concentração de oxigênio.';
downes.fields.find(f=>f.id==='air').options=[{value:0,label:'Boa entrada bilateral'},{value:1,label:'Discretamente diminuída'},{value:2,label:'Ausente'}];
downes.fields.find(f=>f.id==='retraction').options=[{value:0,label:'Ausentes'},{value:1,label:'Leves'},{value:2,label:'Graves'}];
downes.bands=[b(3,'Sem/desconforto leve pelo quadro','medium','Monitorar evolução, oxigenação, perfusão e causa; apneia ou exaustão exigem ação independente da soma.'),b(7,'Desconforto respiratório pelo quadro','medium','Avaliar suporte e etiologia; não definir conduta somente pelo total.'),b(10,'Risco de falência respiratória pelo quadro','high','Avaliação e suporte neonatal imediatos conforme sinais clínicos.')];
downes.limits='Este quadro usa <4, 4–7 e >7, não cortes 4–6/≥7 de outras fichas. Apneia não vira apenas >80/min: exige intervenção independente da soma e não deve ser pontuada por uma categoria ausente no quadro. Cianose persistente, ausência de entrada de ar ou exaustão são sinais de emergência. Não define etiologia, SpO₂-alvo, indicação isolada de CPAP/intubação ou dose/volume/concentração de fármaco.';
downes.sources=[ref('Singh et al. · Management of neonates with respiratory distress syndrome in resource-limited settings · S Afr Fam Pract2024 · Table1','https://pmc.ncbi.nlm.nih.gov/articles/PMC11151355/')];

}
{
// Soberania rodada 2026-09-30: revisão adulta por ID; nenhum baseline é alterado.
Object.assign(priorityById('rsbi'),{
  scope:'Adultos em avaliação de liberação da ventilação mecânica invasiva. Medir FR e volume corrente espontâneos nas mesmas condições padronizadas; o método/suporte da medida devem ser registrados.',
  unit:'respirações/min/L',
  compute:x=>{const total=x.rr/(x.vt/1000),below=total<105,at=total===105;return result(total,below?'Abaixo do corte histórico <105':at?'Exatamente no corte histórico 105':'Acima do corte histórico 105',below?'Valor historicamente favorável, sem comprovar sucesso individual; integrar ao teste de respiração espontânea e avaliação de extubação.':'Não classificar como abaixo do corte. Integrar causas reversíveis, técnica de medida e teste de respiração espontânea.',`FR ${x.rr} /min ÷ VT ${(x.vt/1000).toFixed(3)} L`,below?'low':'medium');},
  limits:'RSBI não decide extubação nem deve ser um obstáculo isolado ao teste de respiração espontânea. Febre, dor, ansiedade, método de suporte, tosse, secreções, proteção de via aérea e condição cardíaca/neurológica alteram a interpretação. A igualdade 105 não é classificada como <105.',
  sources:[ref('Gaddam et al. · revisão de índices de desmame · RSBI · 2025','https://pmc.ncbi.nlm.nih.gov/articles/PMC12304996/')]
});
Object.assign(priorityById('pf-ratio'),{
  unit:'mmHg',
  scope:'Adultos: calcular PaO₂/FiO₂ com PaO₂ arterial e FiO₂ contemporâneas e unidades confirmadas. Medir em repouso, após estabilização de posição/FiO₂/fluxo; a definição global recomenda pelo menos 30 minutos após mudanças. Registrar PEEP, dispositivo e altitude.',
  compute:x=>{const total=100*x.pao2/x.fio2;return result(total,total<=100?'P/F ≤100 mmHg':total<=200?'P/F >100 a ≤200 mmHg':total<=300?'P/F >200 a ≤300 mmHg':'P/F >300 mmHg','Índice de oxigenação: integrar suporte respiratório, PEEP, imagem, tempo de início e origem do edema; o valor isolado não diagnostica SDRA.',`${x.pao2} mmHg ÷ ${(x.fio2/100).toFixed(3)}`,total<=200?'high':total<=300?'medium':'low');},
  limits:'Não diagnostica ou gradua SDRA isoladamente. Na definição global, as faixas leve/moderada/grave se aplicam a SDRA intubada com PEEP ≥5 cmH₂O e todos os outros critérios; não-intubados exigem HFNO ≥30 L/min ou NIV/CPAP com pressão expiratória ≥5 cmH₂O. FiO₂ em baixo fluxo é estimada e imprecisa; acima de 1.000 m de altitude a definição exige correção por pressão barométrica (não calculada nesta ficha).',
  sources:[ref('Matthay et al. · definição global de SDRA · tabela 1 e notas · 2024','https://pmc.ncbi.nlm.nih.gov/articles/PMC10870872/')]
});
Object.assign(priorityById('sf-ratio'),{
  scope:'Adultos: SpO₂ e FiO₂ contemporâneas, em repouso e pelo menos 30 minutos após mudança de posição, FiO₂ ou fluxo. Exigir curva de oximetria confiável e SpO₂ ≤97%. Inserir FiO₂ em percentual, não em fração.',
  compute:x=>{if(x.spo2>97)return {total:null,complete:false,displayValue:'Não interpretável',label:'S/F não válido com SpO₂ >97%',level:'medium',action:'Usar gasometria arterial se disponível quando a classificação puder afetar diagnóstico ou manejo; não atribuir faixa de S/F.',audit:'SpO₂ >97%: limite de validade documental'};const total=100*x.spo2/x.fio2;return result(total,total<=148?'S/F ≤148':total<=235?'S/F >148 a ≤235':total<=315?'S/F >235 a ≤315':'S/F >315','Índice de oxigenação: integrar suporte, imagem, tempo de início e origem do edema; não diagnostica SDRA por si só.',`${x.spo2}% ÷ ${(x.fio2/100).toFixed(3)}`,total<=235?'high':total<=315?'medium':'low');},
  limits:'Não utilizar com SpO₂ >97%, onda inadequada, dis-hemoglobinemia suspeita ou FiO₂ incerta. Pigmentação da pele e má perfusão podem causar erro de oximetria; considerar gasometria se suspeita clínica alta ou erro de classificação puder afetar conduta. Limiares 315/235/148 não são equivalentes exatos de P/F e não graduam SDRA sem os demais critérios e suporte da definição global.',
  sources:[ref('Matthay et al. · definição global de SDRA · tabela 1, notas e seção de oximetria · 2024','https://pmc.ncbi.nlm.nih.gov/articles/PMC10870872/')]
});
priorityById('sf-ratio').fields.find(f=>f.id==='spo2').max=97;
Object.assign(priorityById('murray-lis'),{
  name:'Murray Lung Injury Score · quatro componentes',
  population:'Adultos de 18–65 anos · contrato CESAR',
  scope:'Versão com quatro componentes exigidos, como no protocolo CESAR: radiografia, P/F, PEEP e complacência. Calcular apenas com todos os valores disponíveis e contemporâneos; não substituir ausência por zero. O protocolo de pesquisa media P/F após FiO₂ 1 por 20 minutos: não alterar suporte só para obter esta ficha.',
  compute:x=>{const pf=x.pf>=300?0:x.pf>=225?1:x.pf>=175?2:x.pf>=100?3:4,peep=x.peep<=5?0:x.peep<=8?1:x.peep<=11?2:x.peep<=14?3:4,comp=x.compliance>=80?0:x.compliance>=60?1:x.compliance>=40?2:x.compliance>=20?3:4,total=(x.cxr+pf+peep+comp)/4;return result(total,total>2.5?'LIS >2,5':total===0?'Zero nos quatro componentes':'LIS >0 a ≤2,5','Escore histórico: interpretar com definição atual de SDRA, evolução e avaliação especializada. Não determina indicação de ECMO.',`RX=${x.cxr}; P/F=${pf}; PEEP=${peep}; Cst=${comp}; soma/4`,total>2.5?'high':total>0?'medium':'low');},
  limits:'Fonte operacional: CESAR, adultos 18–65 anos, média obrigatória de quatro componentes. LIS >2,5 justificava discussão de elegibilidade no estudo; isto não é indicação terapêutica automática. Valores de PEEP em números inteiros conforme as faixas publicadas. Zero é diferente de LIS positivo <1; o escore não exclui lesão pulmonar clínica nem substitui definição atual de SDRA.',
  sources:[ref('Peek et al. · CESAR · apêndice 1: Murray score completo · 2006','https://pmc.ncbi.nlm.nih.gov/articles/PMC1766357/')]
});
Object.assign(priorityById('years'),{
  population:'Adultos >18 anos · suspeita de TEP',
  scope:'Adultos >18 anos em avaliação de TEP na emergência, clinicamente estáveis e dentro do protocolo diagnóstico. Três critérios: sinais de TVP, hemoptise e TEP como diagnóstico mais provável. D-dímero por ensaio de alta sensibilidade em ng/mL FEU (numericamente igual a µg/L FEU).',
  limits:'Este é o YEARS geral, sem ajuste pela idade: 0 itens <1.000, ≥1 item <500 ng/mL FEU. Igualdade ao limiar exige imagem pelo algoritmo. FEU e DDU não são intercambiáveis: não inserir resultado DDU nem converter sem regra confirmada do ensaio. Não aplicar automaticamente a instabilidade, anticoagulação ou gestação; pregnancy-adapted YEARS é outro contrato e não está implementado nesta ficha.',
  sources:[ref('Duffy et al. · implementação do YEARS com unidade FEU e ensaio definido · BMJ Open Quality 2023','https://pmc.ncbi.nlm.nih.gov/articles/PMC10231008/')]
});
Object.assign(priorityById('nafld-fibrosis-score'),{
  precision:4,
  population:'Adultos >35 anos com NAFLD/DHGNA · ajuste de idade ≥65',
  scope:'Adultos >35 anos com NAFLD/DHGNA, sem outra hepatopatia ou uso excessivo de álcool. Triagem não invasiva de fibrose F3–F4, com valores contemporâneos. A fórmula histórica NFS não identifica toda MASLD indiscriminadamente; confirmar população compatível.',
  formula:'−1,675 + 0,037×idade + 0,094×IMC + 1,13×glicemia de jejum alterada/diabetes + 0,99×AST/ALT − 0,013×plaquetas − 0,66×albumina. Corte baixo <−1,455 (36–64 anos) ou <0,12 (≥65); alto >0,676.',
  compute:x=>{if(x.age<=35)return {total:null,complete:false,displayValue:'Não interpretável',label:'NFS inadequado para idade ≤35 anos',level:'medium',action:'Usar outro método de avaliação da fibrose adequado ao contexto; não atribuir faixa NFS.',audit:'População com desempenho insuficiente na coorte ≤35 anos'};const total=-1.675+.037*x.age+.094*x.bmi+1.13*x.diabetes+.99*(x.ast/x.alt)-.013*x.platelet-.66*x.albumin,low=x.age>=65?.12:-1.455,label=total<low?'Baixa probabilidade de fibrose avançada':total>.676?'Alta probabilidade de fibrose avançada':'Zona indeterminada';return result(total,label,total<low?'Integrar à avaliação clínica e seguimento; baixa faixa não comprova ausência de fibrose.':'Método de segunda linha/elastografia e avaliação hepatológica conforme contexto.',`AST/ALT=${(x.ast/x.alt).toFixed(3)}; corte baixo=${low}; corte alto=0.676`,total>.676?'high':total>=low?'medium':'low');},
  limits:'NAFLD histórico, não hepatite aguda nem qualquer hepatopatia/metabolismo. Idade ≤35: ficha bloqueia a interpretação; ≥65: usa limiar baixo validado 0,12 e preserva alto 0,676. Os valores exatamente nos limiares permanecem indeterminados. Não substitui segundo método ou diagnóstico definitivo; diretrizes vigentes podem preferir FIB-4 como primeiro passo.',
  sources:[ref('McPherson et al. · fórmula NFS, tabela 1 e validação de cortes por idade · 2016','https://pmc.ncbi.nlm.nih.gov/articles/PMC5418560/')]
});
priorityById('nafld-fibrosis-score').fields.find(f=>f.id==='age').min=36;
priorityById('nafld-fibrosis-score').fields.find(f=>f.id==='diabetes').label='Glicemia de jejum alterada ou diabetes';
Object.assign(priorityById('psi-port'),{
  name:'PSI/PORT · etapa de pontuação',
  max:395,range:'Pontuação · faixas II–V',resultScale:false,
  scope:'Adultos com pneumonia adquirida na comunidade: etapa de pontuação do PSI, classes II–V. Esta ficha não implementa a triagem prévia da classe I. Só pontuar dados conhecidos; não presumir resultado normal quando não medido.',
  compute:x=>{const total=x.age+Object.entries(x).filter(([k])=>k!=='age').reduce((a,[,v])=>a+v,0),label=total<=70?'≤70 pontos · faixa II por pontuação':total<=90?'Classe III por pontuação':total<=130?'Classe IV por pontuação':'Classe V por pontuação';return result(total,label,total<=70?'Pode apoiar avaliação ambulatorial quando apropriado; confirmar a etapa prévia da classe I separadamente e contraindicações clínicas/sociais.':total<=90?'Considerar observação ou internação breve conforme avaliação clínica.':'Maior risco pelo PSI: avaliar internação e suporte necessário.',Object.entries(x).map(([k,v])=>`${k}=${v}`).join('; '),total>90?'high':total>70?'medium':'low');},
  limits:'Não atribui classe I; ≤50 pontos não equivalem a classe I. Faixas desta etapa: ≤70, 71–90, 91–130 e >130. Idade pesa muito; pneumonia grave em jovem pode pontuar pouco. Hipoxemia pode indicar internação independentemente da soma. BUN é nitrogênio ureico, diferente de ureia total; não inserir ureia em mg/dL como BUN. Não define UTI, alta ou tratamento isoladamente.',
  sources:[ref('Merck Manual Professional · tabela PSI adaptada do original Fine1997 · página vigente','https://www.merckmanuals.com/professional/multimedia/table/risk-stratification-for-community-acquired-pneumonia-the-pneumonia-severity-index')]
});
priorityById('psi-port').fields.find(f=>f.id==='bun').label='Nitrogênio ureico (BUN) ≥30 mg/dL';
priorityById('psi-port').fields.find(f=>f.id==='bun').hint='BUN, não ureia total em mg/dL. Confirmar o analito/unidade no laudo.';

}
{
// Soberania: cinco candidatos suficientemente verificados; integração e publicação pelo root.
{
  const score=priorityById('modified-shock-index');
  score.scope='Adultos em emergência; calcular com FC e PAM contemporâneas. Os cortes aqui descritos foram derivados retrospectivamente em pacientes de 10–100 anos que receberam fluidos intravenosos em um único hospital em 2009; esta ficha restringe o uso a adultos.';
  score.compute=x=>{const total=x.hr/x.map;return result(total,total>1.3?'Acima do corte observacional de 1,3':total<0.7?'Abaixo do corte observacional de 0,7':'Entre os cortes da coorte de 2012','Investigar perfusão, causa e tendência; agir sobre instabilidade independentemente do índice.',`${x.hr} bpm ÷ ${x.map} mmHg`,total>1.3?'high':total<.7?'medium':'low');};
  score.limits='Cortes observacionais de uma coorte retrospectiva; valores entre 0,7 e 1,3 não excluem doença grave nem estabelecem normalidade. Não generalizar a gestação ou pediatria. Betabloqueio, marcapasso e arritmia alteram a interpretação.';
  score.sources=[ref('Liu et al. · Modified shock index and mortality rate of emergency patients · original 2012','https://pmc.ncbi.nlm.nih.gov/articles/PMC4129788/')];
}
{
  const score=priorityById('age-shock-index');
  score.population='Adultos ≥65 anos · trauma';
  score.scope='Pacientes com ≥65 anos atendidos na emergência por trauma ocorrido até 6 h antes. Usar idade em anos e FC/PAS iniciais contemporâneas. A coorte examinada excluiu trauma craniano isolado, morte à chegada, queimaduras, afogamento e intoxicação.';
  score.fields.find(f=>f.id==='age').min=65;
  score.compute=x=>{const total=x.age*x.hr/x.sbp;return result(total,total>=50?'Igual/acima do corte observacional de 50':'Abaixo do corte observacional de 50','Integrar perfusão, lesões e evolução. O corte de 50 superestimou gravidade em parte da coorte geriátrica; não classifica sozinho choque nem determina tratamento.',`${x.age} anos × (${x.hr} bpm ÷ ${x.sbp} mmHg)`,total>=50?'medium':'low');};
  score.limits='Fórmula idade × FC/PAS; corte 50 estudado em trauma geriátrico. A idade aumenta o índice e pode superestimar gravidade. Desempenho depende do desfecho/coorte; não aplicar como corte universal a adultos jovens, gestantes ou crianças. Betabloqueio e arritmia podem mascarar a resposta cronotrópica.';
  score.sources=[ref('Kim et al. · Age Shock Index em trauma geriátrico · validação original 2016','https://pmc.ncbi.nlm.nih.gov/articles/PMC5102870/')];
}
{
  const score=priorityById('add-rs');
  score.fields.find(f=>f.id==='conditions').hint='Marfan/outra conectivopatia, história familiar de doença aórtica, valvopatia aórtica conhecida, aneurisma torácico conhecido ou manipulação recente da aorta.';
  score.fields.find(f=>f.id==='pain').hint='Dor torácica, dorsal ou abdominal com início abrupto, intensidade grave ou caráter rasgando/dilacerante.';
  score.fields.find(f=>f.id==='exam').hint='Déficit de pulso ou diferença de PAS; déficit neurológico focal COM dor; novo sopro de insuficiência aórtica COM dor; ou hipotensão/choque. Cada categoria vale no máximo um ponto.';
  score.sources=[ref('ACC/AHA · diretriz de doença aórtica 2022 · tabela 24 ADD-RS','https://pmc.ncbi.nlm.nih.gov/articles/PMC9860464/')];
}
{
  const score=priorityById('rems');
  score.scope='Adultos atendidos na emergência clínica. REMS soma idade, PAM, FC, FR, SpO₂ e Glasgow. Os pesos estão documentados; esta ficha não impõe categorias universais de risco nem probabilidades individuais.';
  score.compute=x=>{const age=x.age<45?0:x.age<55?2:x.age<65?3:x.age<75?5:6,map=x.map<50||x.map>=160?4:x.map>=130?3:x.map<70||x.map>=110?2:0,hr=x.hr<40||x.hr>=180?4:x.hr<55||x.hr>=140?3:x.hr<70||x.hr>=110?2:0,rr=x.rr<6||x.rr>=50?4:x.rr>=35?3:x.rr<10?2:x.rr<12||x.rr>=25?1:0,spo2=x.spo2<75?4:x.spo2<=85?3:x.spo2<=89?1:0,gcs=x.gcs<=4?4:x.gcs<=7?3:x.gcs<=10?2:x.gcs<=13?1:0,total=age+map+hr+rr+spo2+gcs;return result(total,`REMS: ${total} pontos`,'Priorizar estabilização e interpretar tendência e componentes com a avaliação clínica. Não há corte universal de destino ou alta nesta ficha.',`idade=${age}; PAM=${map}; FC=${hr}; FR=${rr}; SpO₂=${spo2}; GCS=${gcs}`,'medium');};
  score.limits='Soma 0–26, maior pontuação indica maior carga fisiológica. Faixas 6/10 não foram comprovadas como categorias universais e não são exibidas. Oxigênio suplementar, intoxicação e doença crônica afetam a interpretação. Não determina destino individual.';
  score.sources=[ref('Hung et al. · tabela 2 REMS completa · estudo multicêntrico original 2017','https://pmc.ncbi.nlm.nih.gov/articles/PMC5665602/')];
}
{
  const score=priorityById('rosier');
  score.scope='Adultos com suspeita de AVC na emergência e sinais/sintomas presentes durante a avaliação, após verificar glicemia. Pontuar déficits focais novos, incluindo quando surgem ao acordar. AIT sem sinais/sintomas na avaliação ficou fora da derivação.';
  for(const id of ['face','arm','leg']){score.fields.find(f=>f.id===id).label=({face:'Fraqueza facial nova assimétrica',arm:'Fraqueza de braço nova assimétrica',leg:'Fraqueza de perna nova assimétrica'})[id];}
  score.fields.find(f=>f.id==='speech').hint='Distúrbio da fala de início novo, incluindo ao acordar.';
  score.fields.find(f=>f.id==='visual').hint='Defeito de campo visual de início novo, incluindo ao acordar.';
  score.limits='Triagem, não diagnóstico nem distinção entre AVC isquêmico e hemorrágico. Resultado ≤0 não exclui AVC, especialmente circulação posterior. Convulsão pode acompanhar AVC; déficits prévios dificultam o uso. Não copiar taxas de acurácia como probabilidade individual.';
  score.sources=[ref('Nor et al. · ROSIER original 2005 · sete itens, população e corte >0','https://pubmed.ncbi.nlm.nih.gov/16239179/'),ref('Zangi et al. · validação ROSIER original · tabela 1 operacional · 2021','https://pmc.ncbi.nlm.nih.gov/articles/PMC7864127/')];
}

}
{
// Metadados corrigidos de candidatos ainda em quarentena; NÃO concedem source_validation/ativação.
priorityById('pediatric-sirs').population='Crianças · IPSCC 2005 histórico';
priorityById('pediatric-sirs').sources=[ref('Goldstein et al. · IPSCC2005 original · PMID15636651','https://pubmed.ncbi.nlm.nih.gov/15636651/'),ref('J-SSCG2016 · publicação2018 · Table1 reproduzindo SIRS pediátrico2005','https://pmc.ncbi.nlm.nih.gov/articles/PMC5797365/')];
priorityById('kocher').population='Crianças com quadril agudamente doloroso';
priorityById('kocher').sources=[ref('Kocher et al. · derivação original1999 · PMID10608376','https://pubmed.ncbi.nlm.nih.gov/10608376/'),ref('Valisena et al. · revisão Kocher–Caird2024 e limitações Kingella','https://pmc.ncbi.nlm.nih.gov/articles/PMC10974044/')];
priorityById('kocher-caird').population='Crianças com suspeita de artrite séptica do quadril';
priorityById('kocher-caird').sources=[ref('Caird et al. · coorte prospectiva2006 · PMID16757758','https://pubmed.ncbi.nlm.nih.gov/16757758/'),ref('Valisena et al. · revisão Kocher–Caird2024 e limitações Kingella','https://pmc.ncbi.nlm.nih.gov/articles/PMC10974044/')];
priorityById('thompson-hie').population='Recém-nascidos com encefalopatia';
priorityById('thompson-hie').sources=[ref('Revisão crítica de encefalopatia neonatal2020','https://pmc.ncbi.nlm.nih.gov/articles/PMC7704551/'),ref('Horn et al. · validação clínica Thompson2013','https://pmc.ncbi.nlm.nih.gov/articles/PMC3635928/')];

}
{

{
  const priorityById=id=>{const value=priorityScores.find(score=>score.id===id);if(!value)throw new Error(`Instrumento ausente: ${id}`);return value;};
// Candidatos locais para revisão. Não ativa instrumentos nem modifica a fonte principal.
const meta=f=>({...f,noPoints:true});
const reference=(title,url)=>ref(title,url);
const result=(total,label,action,audit,level='medium',breakdown=[])=>({total,label,action,audit,level,breakdown});
const cbSource='https://www.comfortassessment.nl/web/files/4114/2919/4154/COMFORT_behavior_scale___final_version_April_2015.pdf';
const espnicStatement='https://pmc.ncbi.nlm.nih.gov/articles/PMC4846705/';
const choices=labels=>labels.map((label,i)=>[i+1,label]);
const comfortB=make({id:'comfort-b',name:'COMFORT-B',specialty:'Pediatria',population:'0–16 anos · UTI pediátrica',subtitle:'Sedação e desconforto comportamental',max:30,range:'6–30',scope:'Observação por avaliador treinado durante 2 minutos. São seis componentes. No terceiro, usar somente a descrição correspondente: resposta respiratória em ventilação mecânica ou choro em respiração espontânea.',fields:[
 s('item0','Alerta',choices(['Sono profundo, sem reação ao ambiente','Sono leve, com respostas ocasionais','Sonolência, fecha frequentemente os olhos e responde menos','Acordado e atento ao ambiente','Acordado com reações exageradas aos estímulos'])),
 s('item1','Calma/agitação',choices(['Calmo','Ansiedade discreta','Ansioso/agitado, com controle do comportamento','Agitação acentuada, mantendo controle com dificuldade','Pânico ou sofrimento intenso, sem controle'])),
 s('item2','Resposta respiratória (ventilado) OU choro (espontâneo)',choices(['Ventilado: sem respiração espontânea | Espontâneo: respiração tranquila, sem choro','Ventilado: respiração espontânea junto à ventilação | Espontâneo: soluços/gemidos ocasionais','Ventilado: inquietação/resistência ao ventilador | Espontâneo: choramingo monótono','Ventilado: respira ativamente contra o ventilador ou tosse regular | Espontâneo: choro','Ventilado: luta com o ventilador | Espontâneo: gritos/choro agudo']),'Escolher somente a metade correspondente ao tipo de respiração; não pontuar respiração e choro separadamente.'),
 s('item3','Movimentos corporais',choices(['Sem movimento','Até três movimentos discretos','Mais de três movimentos discretos','Movimentos vigorosos somente das extremidades','Movimentos vigorosos também do tronco e da cabeça'])),
 s('item4','Tônus muscular',choices(['Ausência de tônus; relaxamento completo','Tônus reduzido; resistência menor que a habitual','Tônus normal','Tônus aumentado, com flexão de dedos das mãos/pés','Rigidez extrema, com flexão de dedos das mãos/pés'])),
 s('item5','Tensão facial',choices(['Músculos faciais totalmente relaxados','Tônus facial habitual','Tensão intermitente em alguns músculos','Tensão sustentada por toda a face','Face contraída, com caretas']))
 ],bands:[b(10,'Possível sedação excessiva','high','Reavaliar alvo individual, exame e segurança; não ajustar medicamento automaticamente.'),b(22,'Faixa intermediária','low','Correlacionar com alvo individual e avaliação de enfermagem da sedação.'),b(30,'Possível sedação insuficiente/desconforto','high','Avaliar dor, delirium, ventilação e causas de desconforto.')],formula:'Soma de seis componentes comportamentais, 1–5 cada; total 6–30.',limits:'Descrições factuais resumidas do formulário Erasmus de abril de 2015; consultar formulário e treinamento originais. Cortes do consenso ESPNIC: <11 e >22; a faixa 11–22 não assegura alvo individual. Não confundir com COMFORT original de oito itens nem interpretar isoladamente como dor. Bloqueio neuromuscular e condições neurológicas podem impedir avaliação comportamental.',sources:[reference('van Dijk e Ista · formulário COMFORT-B oficial · abril de 2015',cbSource),reference('ESPNIC · sedação pediátrica · tabela 4 · 2016',espnicStatement)]});

const sbsOfficial='https://www.marthaaqcurley.com/sbs.html';
const sbs={...ordinal('sbs','State Behavioral Scale · SBS','Pediatria',[[-3,'Não responsivo'],[-2,'Responsivo a estímulo nocivo'],[-1,'Responsivo a toque suave ou voz'],[0,'Acordado e capaz de acalmar-se'],[1,'Inquieto e difícil de acalmar'],[2,'Agitado']],'Atribuir a categoria que melhor representa conjuntamente resposta respiratória/ventilação, tosse, resposta a estímulos, atenção ao cuidador, tolerância aos cuidados, consolabilidade e movimento após consolo. Usar o formulário integral da autora e julgamento de avaliador treinado, considerando desenvolvimento e contexto.',[reference('Curley · SBS · orientações autorais vigentes e formulário 25/09/2024',sbsOfficial),reference('Curley et al. · desenvolvimento e validação original · 2006','https://pmc.ncbi.nlm.nih.gov/articles/PMC1626525/')],'Auxílio para registro da categoria atribuída pela avaliação padronizada. Não é soma de sete componentes, não é escala de dor e não indica dose. Não atribuir categoria com bloqueio neuromuscular ou impossibilidade de observação. Usar progressão voz/toque e procedimento nocivo planejado apenas quando a avaliação for clinicamente necessária. O formulário integral em inglês permanece no site da autora; este resumo não afirma tradução validada nem licença de republicação do formulário. Copyright 2023 Martha A. Q. Curley.','nível'),population:'Validação original: 6 semanas–6 anos em ventilação mecânica',formula:'Categoria global observacional −3 a +2; não somar dimensões.'};
sbs.fields[0]={...sbs.fields[0],hint:'−3: ausência de esforço respiratório, movimento e resposta nociva; −2: resposta nociva, pouca atenção; −1: resposta a toque/voz, atenção transitória e acalma após retirada do estímulo; 0: respiração eficaz, atenção espontânea e acalma com consolo; +1: inquietação, segurança intermitentemente comprometida e não acalma de forma consistente em 5 minutos; +2: agitação com comportamento inseguro e inconsolável. Conferir conjuntamente todas as dimensões no formulário oficial; estas notas resumem fatos, sem substituí-lo.'};

const watGuide='https://familynursing.ucsf.edu/file/permission-to-use-the-wat-1-and-guidelines-12223-ccpdf-0';
const wat1=make({id:'wat1',name:'WAT-1',specialty:'Pediatria',population:'Faixa etária validada: de 2 semanas após nascimento a termo até 18 anos · Recorte do app: UTI',subtitle:'Abstinência iatrogênica · guia autoral de 2023',max:12,scope:'Aplicar desde o primeiro dia de desmame após exposição prolongada a opioides e/ou benzodiazepínicos (p.ex., ≥5 dias). Avaliar ao menos a cada 12 horas até 72 horas após a última dose. Rever 12 horas de registros; observar em repouso por 2 minutos, durante estímulo progressivo e após estímulo. Os critérios abaixo seguem especificamente o guia autoral disponibilizado pela UCSF em 2023.',fields:[
 y('stool','Fezes aquosas/diarreia incompatíveis com padrão basal nas últimas 12 h',1,'Excluir explicação por idade e condição de base.'),
 y('vomit','Vômito, ânsia ou engasgo nas últimas 12 h não atribuíveis a outra causa/intervenção'),
 y('fever','Temperatura >37,8 °C na maioria das aferições das últimas 12 h, sem atribuição a infecção',1,'Não pontuar somente por uma aferição isolada; usar predominância documentada.'),
 y('state','Acordado e agitado no repouso pré-estímulo (SBS ≥+1)',1,'Sono ou estado acordado e calmo/SBS ≤0 vale zero.'),
 y('tremor','Tremor moderado/intenso no repouso pré-estímulo',1,'Ausente ou leve vale zero; excluir outra causa clínica.'),
 y('sweat','Sudorese no repouso não explicada por termorregulação apropriada'),
 y('movement','Movimentos descoordenados/repetitivos moderados ou intensos no repouso',1,'Movimentos leves valem zero; considerar cabeça, membros e arqueamento do tronco.'),
 y('yawn','Dois ou mais bocejos/espirros durante os 2 minutos pré-estímulo'),
 y('startle','Sobressalto intenso ao toque durante o estímulo',1,'Guia autoral 2023: intenso. Esta aplicação não usa o critério moderado/intenso do formulário de 2008 ou da versão portuguesa de 2013.'),
 y('tone','Tônus muscular aumentado durante o estímulo'),
 s('recovery','Tempo para voltar ao estado calmo após estímulo',[[0,'<2 minutos'],[1,'2–5 minutos'],[2,'>5 minutos']],'Estado calmo: SBS ≤0 ou observação correspondente ao desenvolvimento.')
 ],bands:[b(2,'Abaixo de 3','low','Manter avaliação seriada e correlação com exposição e evolução.'),b(12,'Sinais compatíveis com abstinência','medium','≥3 identifica sinais de abstinência iatrogênica no guia autoral; investigar causas alternativas e evolução.')],formula:'Dez critérios 0/1 mais recuperação 0/1/2: 11 itens, total 0–12.',limits:'Critérios operacionais factuais resumidos do guia autoral 2023; consultar o documento integral. A versão está identificada porque o formulário original/PT2013 pontua sobressalto moderado/intenso, enquanto o guia 2023 descreve intenso. Não misturar versões em seguimento longitudinal; comparabilidade deve ser documentada. Não é prescrição nem diagnóstico etiológico isolado. ©2007 Linda S. Franck e Martha A.Q. Curley; CC BY-ND 2.0. Referência original: Franck et al., Pediatr Crit Care Med. 2008;9(6):573–580. Não afirmar tradução certificada do instrumento.',sources:[reference('Franck e Curley/UCSF · diretrizes autorais WAT-1 · arquivo 2023',watGuide),reference('ESPNIC · avaliação de abstinência pediátrica · 2016',espnicStatement)]});

const peSource='https://www.espnic.eu/calcolatori/Paediatric%20Logistic%20Organ%20Dysfunction%202%20Score%20Calculator%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC_files.htm';
const mapLimits=[[17,31,46],[25,39,55],[31,44,60],[32,45,62],[36,49,65],[38,52,67]];
const creatLimits=[70,23,35,51,59,93];
const pelod2=make({id:'pelod2',name:'PELOD-2',specialty:'Terapia intensiva',population:'Pediatria · UTI',subtitle:'Disfunção de órgãos pediátrica',max:33,scope:'Avaliação educacional e de pesquisa em crianças criticamente enfermas. Selecionar os piores valores pertinentes nas 24 horas; repetir segundo o protocolo. Idade determina os limites de PAM e creatinina. Não medir PAM durante choro/agitação iatrogênica. Quando sedado, considerar Glasgow antes da sedação; não inventar exame não disponível.',fields:[
 meta(s('age','Faixa etária',[[0,'<1 mês'],[1,'1–11 meses'],[2,'12–23 meses'],[3,'24–59 meses'],[4,'60–143 meses'],[5,'≥144 meses']])),
 s('gcs','Glasgow',[[0,'≥11'],[1,'5–10'],[4,'3–4']]),
 s('pupil','Pupilas',[[0,'Não preenche critério'],[5,'Ambas fixas e >3 mm, sem dilatação iatrogênica']]),
 s('lactate','Lactato',[[0,'<5 mmol/L'],[1,'≥5 e <11 mmol/L'],[4,'≥11 mmol/L']]),
 meta(n('map','PAM mais baixa (mmHg)',0,200,1,'Usar valor inteiro documentado; não arredondar para mudar categoria. Limites de zero ponto por faixa etária: 46, 55, 60, 62, 65, 67 mmHg.')),
 meta(n('creat','Creatinina mais alta (µmol/L)',0,4000,1,'Valor inteiro em µmol/L. Limites de 2 pontos por faixa etária: 70, 23, 35, 51, 59, 93 µmol/L. Não inserir mg/dL.')),
 s('pf','PaO₂/FiO₂ arterial',[[0,'>60'],[2,'≤60']],'FiO₂ em fração. Na cardiopatia congênita cianótica, o formulário autoral considera o componente normal; verificar condição.'),
 s('pco2','PCO₂',[[0,'<59 mmHg'],[1,'59–94 mmHg'],[3,'≥95 mmHg']],'Arterial, venosa ou capilar segundo a orientação autoral; usar categoria documentada. Não arredondar nem interpolar uma medida fracionária em lacuna, como 94,5 mmHg entre 59–94 e ≥95, para escolher categoria: confirmar registro conforme o protocolo.'),
 y('vent','Ventilação invasiva',3,'Ventilação por máscara não conta como invasiva.'),
 s('wbc','Leucócitos',[[0,'>2 ×10⁹/L'],[2,'≤2 ×10⁹/L']]),
 s('platelet','Plaquetas · categoria em ×10⁹/L',[[0,'≥142'],[1,'77–141'],[2,'≤76']],'Categorias publicadas em valores inteiros de ×10⁹/L; não converter seleção em contagem decimal presumida.')
 ],compute:x=>{if(!Number.isInteger(x.age)||x.age<0||x.age>5||!Number.isInteger(x.map)||!Number.isInteger(x.creat))throw new Error('Confirmar faixa etária e valores inteiros documentados de PAM e creatinina em µmol/L.');const [low,mid,normal]=mapLimits[x.age],map=x.map<low?6:x.map<mid?3:x.map<normal?2:0,creat=x.creat>=creatLimits[x.age]?2:0,other=['gcs','pupil','lactate','pf','pco2','vent','wbc','platelet'].reduce((v,k)=>v+x[k],0),total=other+map+creat;return result(total,'Disfunção orgânica quantificada pelo PELOD-2','Interpretar tendência e contexto. Não define tratamento nem prognóstico individual.',`PAM=${x.map} mmHg → ${map}; creatinina=${x.creat} µmol/L → ${creat}; faixa=${x.age+1}; demais=${other}`,'medium',[{label:'PAM por idade',points:map},{label:'Creatinina por idade',points:creat},{label:'Demais componentes',points:other}]);},formula:'Soma de dez componentes; PAM pontua 0/2/3/6 por idade e creatinina 0/2 por idade; total 0–33.',limits:'Ferramenta autoral da ESPNIC destinada à educação e pesquisa. Não é alerta precoce, prescrição ou probabilidade de morte individual. Esta implementação requer valores observados; a convenção de variável não medida considerada normal no estudo não transforma dado desconhecido em prova de normalidade clínica. Não avaliar componentes neurológicos sob bloqueio neuromuscular. PAM: por faixa, 6 pontos abaixo de 17/25/31/32/36/38, 3 pontos até 30/38/43/44/48/51, 2 até 45/54/59/61/64/66, zero a partir de 46/55/60/62/65/67 mmHg. Fonte original e regras autorais devem acompanhar o registro. Dewi 2019 avaliou retrospectivamente queimados hospitalizados de 0–18 anos em um centro indonésio; PELOD-2 foi calculado nas primeiras 24 h em 133 dos 148 elegíveis. A estimativa prognóstica original subestimou a mortalidade dessa coorte. O modelo combinado local do artigo não está implementado e não substitui os pontos PELOD-2. Essa população não representa queimaduras ambulatoriais.',sources:[reference('Leteurtre e Baudelet/ESPNIC-GFRUP · PELOD-2 autoral',peSource),reference('Dewi et al. 2019 · tabela PELOD-2 e avaliação contextual em queimados pediátricos','https://www.medbc.com/annals/review/vol_32/num_2/text/vol32n2p135.pdf')]});
const icuCandidates=[comfortB,sbs,wat1,pelod2];
for(const candidate of icuCandidates) Object.assign(priorityById(candidate.id),candidate);
}

}
{
// PIM3: versão operacional ESPNIC; ND só é aceito nos quatro campos numéricos marcados.
const pim=priorityById('pim3');
const pimUnknown=f=>({...meta(f),allowND:true});
const pimSource='https://www.espnic.eu/calcolatori/Paediatric%20Index%20of%20Mortality%203%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC.html';
pim.name='PIM3 · algoritmo ESPNIC';
pim.population='Crianças <18 anos · admissão em UTI';
pim.scope='Pediatria na admissão em UTI; educação, pesquisa e ajuste de risco de grupos. Registrar os primeiros valores a partir do primeiro contato presencial com médico da UTI/equipe especializada de transporte até uma hora após chegada à UTI. Não trocar por piores valores posteriores. ND indica explicitamente dado não disponível e aplica a convenção do modelo, sem afirmar medição normal.';
pim.fields=[
 pimUnknown(n('sbp','PAS (mmHg), ou ND se não disponível',0,300,1,'Parada cardíaca: 0; choque com pressão tão baixa que não pode ser medida: 30. Preferir linha arterial com curva adequada. ND aplica a convenção do modelo equivalente à PAS padrão de 120 com coeficientes publicados arredondados, e fica registrado como não medido.')),
 meta(s('pupil','Ambas pupilas fixas >3 mm à luz forte',[[0,'Não ou reação desconhecida'],[1,'Sim, não explicado por fármaco, toxina ou lesão ocular local']],'Não pontuar como anormal se explicado por fármaco, toxina ou lesão ocular.')),
 pimUnknown(n('fio2','FiO₂ (%), ou ND se não disponível',21,100,.1,'Usar percentual: ar ambiente=21; não inserir fração 0,21. Usar medida contemporânea à PaO₂; valor conhecido em máscara selada/CPAP/BiPAP pode ser usado.')),
 pimUnknown(n('pao2','PaO₂ arterial (mmHg), ou ND se não disponível',1,800,.1,'Não substituir por SpO₂ ou PvO₂. Se PaO₂ ou FiO₂ estiver ND, aplica-se o termo padrão de oxigenação 0,23, explicitamente registrado no cálculo.')),
 pimUnknown(n('be','Valor absoluto do excesso de base (mmol/L), ou ND',0,40,.1,'Somente amostra arterial ou capilar. Inserir magnitude absoluta, por exemplo 10 para BE −10. ND aplica termo 0 do modelo e fica identificado como desconhecido.')),
 meta(y('vent','Ventilação mecânica em qualquer momento da primeira hora',1,'Inclui ventilação invasiva, CPAP/BiPAP nasal ou por máscara e pressão negativa. Traqueostomia em respiração espontânea ou T-piece sem ventilador não contam.')),
 meta(y('elective','Admissão eletiva',1,'Planejada/previsível e adiável por mais de 6 horas sem efeito adverso; inclui procedimento eletivo, monitorização eletiva ou revisão da ventilação domiciliar.')),
 meta(s('procedure','Recuperação de procedimento é o motivo principal',[[0,'Não'],[1,'Cardíaco com circulação extracorpórea'],[2,'Cardíaco sem circulação extracorpórea'],[3,'Não cardíaco']],'Procedimento radiológico/cateterismo pode contar. Ir ao centro cirúrgico para colocar monitor de PIC em trauma não transforma o motivo principal de admissão em recuperação cirúrgica.')),
 meta(s('low','Diagnóstico de baixo risco: motivo principal',[[0,'Nenhum'],[1,'Asma'],[2,'Bronquiolite'],[3,'Crupe'],[4,'Apneia obstrutiva do sono'],[5,'Cetoacidose diabética'],[6,'Distúrbio convulsivo']],'Bronquiolite inclui apneia central. Apneia obstrutiva como motivo após adeno/amigdalectomia também conta recuperação de cirurgia. Distúrbio convulsivo: controlar convulsões ou recuperar seus efeitos/tratamento.')),
 meta(s('high','Diagnóstico de alto risco: motivo principal',[[0,'Nenhum'],[1,'Hemorragia intracerebral espontânea'],[2,'Cardiomiopatia ou miocardite'],[3,'Síndrome do coração esquerdo hipoplásico'],[4,'Doença neurodegenerativa'],[5,'Enterocolite necrosante']],'Hemorragia traumática ou não intracerebral, como subdural, não preenche o primeiro item. Hipoplasia do coração esquerdo requer Norwood/equivalente neonatal para manter vida. Neurodegenerativa: perda progressiva de marcos ou evolução inevitável documentada.')),
 meta(s('veryhigh','Diagnóstico de risco muito alto: motivo principal',[[0,'Nenhum'],[1,'Parada cardíaca antes da admissão'],[2,'Imunodeficiência combinada grave'],[3,'Leucemia/linfoma após primeira indução'],[4,'Receptor de transplante de medula óssea'],[5,'Insuficiência hepática']],'Parada exige pulso ausente documentado ou compressões torácicas, não história remota. Leucemia/linfoma: admissão relacionada à doença ou terapia. Insuficiência hepática é motivo principal; excluir admissão após transplante hepático eletivo.')),
 meta(y('classified','Motivo principal e categorias diagnósticas foram confirmados',1,'Não converter classificação desconhecida em “Nenhum”. Se mais de uma categoria estiver presente, muito alto prevalece sobre alto; alto prevalece sobre baixo.'))
];
pim.compute=x=>{
 if(!x.classified)return {...result(null,'PIM3 não calculável · classificação não confirmada','Confirmar motivo principal e categorias; não presumir diagnóstico ausente.','classificação não confirmada','medium'),displayValue:'Não calculável'};
 const sbpUnknown=x.sbp==='ND',oxygenUnknown=x.fio2==='ND'||x.pao2==='ND',beUnknown=x.be==='ND';
 // Convenções/casas adicionais da implementação autoral, preservadas de forma explícita.
 const sbpTerm=sbpUnknown?-2.70096:-0.0430768*x.sbp+0.1715711*(x.sbp*x.sbp/1000);
 const oxygenTerm=oxygenUnknown?0.096921862:0.4213994*x.fio2/x.pao2;
 const beTerm=beUnknown?0:0.0671255*Math.abs(x.be);
 const proc=x.procedure===1?-1.224559:x.procedure===2?-0.8761848:x.procedure===3?-1.516403:0;
 const selectedRisk=x.veryhigh>0?3:x.high>0?2:x.low>0?1:0;
 const riskTerm=selectedRisk===3?1.622484:selectedRisk===2?1.072542:selectedRisk===1?-2.176649:0;
 const logit=-1.792793+3.823309*x.pupil-0.5378016*x.elective+0.9763*x.vent+sbpTerm+oxygenTerm+beTerm+proc+riskTerm;
 const p=100/(1+Math.exp(-logit));
 return result(p,'Estimativa populacional pelo PIM3','Usar em pesquisa, educação e comparação de grupos. Não usar esta estimativa para prognóstico, decisão diagnóstica/terapêutica ou limitação de suporte individual.',`logit=${logit.toFixed(7)}; PAS=${sbpUnknown?'ND (convenção do modelo)':x.sbp+' mmHg'}; oxigenação=${oxygenUnknown?'ND (termo 0,23)':x.fio2+'% / '+x.pao2+' mmHg'}; BE=${beUnknown?'ND (termo 0)':Math.abs(x.be)+' mmol/L'}; classe=${selectedRisk}; procedimento=${x.procedure}`,'medium',[{label:'Termo PAS',points:sbpTerm},{label:'Termo oxigenação',points:oxygenTerm},{label:'Termo BE',points:beTerm},{label:'Termo diagnóstico',points:riskTerm},{label:'Termo procedimento',points:proc}]);
};
pim.formula='Logit PIM3 com coeficientes e convenções do algoritmo autoral ESPNIC; probabilidade=100/(1+exp(−logit)). Uma única categoria diagnóstica pontua, com precedência muito alto > alto > baixo.';
pim.limits='Versão identificada: implementação autoral ESPNIC, com casas adicionais de coeficientes; não misturar coeficientes de variantes arredondadas. Dado ND é uma convenção estatística, não medição normal: PAS usa termo −2,70096; oxigenação usa 0,096921862 (coeficiente×0,23); excesso de base usa 0. A convenção PAS desconhecida coincide com 120 mmHg usando coeficientes publicados arredondados, mas difere ligeiramente da entrada 120 com casas adicionais da calculadora autoral; isso é registrado, não ocultado. População/calibração variam entre serviços/épocas. Ferramenta de educação e pesquisa; a probabilidade não é aplicável ao paciente individual. Sem prescrição de medicação, volume ou infusão.';
pim.sources=[ref('Leteurtre e Baudelet/ESPNIC-GFRUP · PIM3 autoral, definições e algoritmo',pimSource),ref('Critical Care Science 2024 · guia prático de escores pediátricos · PIM3','https://pmc.ncbi.nlm.nih.gov/articles/PMC11554295/')];

}
}
