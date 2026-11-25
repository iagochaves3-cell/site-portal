// Variante consultiva restrita; não altera os instrumentos já publicados.
export function applyRound4Overrides(priorityScores,{s,y,n,ref,make,meta,result}) {
  priorityScores.push(make({
    id:'charlson-mdcalc-restrito',
    name:'Charlson com idade · MDCalc · aplicação restrita',
    specialty:'Clínica médica',
    population:'Adultos ≥18 anos · comorbidades documentadas',
    subtitle:'Soma de comorbidades · variante editorial identificada',
    max:36,range:'0–36 nesta aplicação restrita',wave4:true,
    scope:'Contagem consultiva dos pesos da ficha editorial MDCalc CCI, versão 1, publicada em 21/04/2022 e examinada em 30/09/2026. Esta interface restringe a aplicação a adultos com diagnósticos documentados e recusa a combinação de AVC/AIT e hemiplegia, cuja classificação precisa ser esclarecida. Não é a implementação integral da variante de 1994 com ajuste por idade nem estimativa de sobrevida individual em dez anos.',
    fields:[
      meta(y('eligible','Adulto com idade e todos os diagnósticos confirmados',1,'Ausência de informação não equivale a ausência de doença. Confirmar a classificação e distinguir diagnósticos; não contar a mesma neoplasia como leucemia e linfoma. Se não for possível, selecionar Não.')),
      meta(n('age_years','Idade em anos completos',18,120,1,'Restrição operacional desta interface: 18–120 anos. Idade <50=0; 50–59=1; 60–69=2; 70–79=3; ≥80=4.')),
      y('mi','Infarto do miocárdio documentado',1,'História de infarto definido ou provável, com alterações de ECG e/ou marcadores de necrose.'),
      y('chf','Insuficiência cardíaca documentada',1,'Dispneia aos esforços ou paroxística noturna com resposta a tratamento de insuficiência cardíaca, conforme a ficha editorial.'),
      y('pvd','Doença vascular periférica',1,'Claudicação, bypass por insuficiência arterial crônica, gangrena, insuficiência arterial aguda ou aneurisma aórtico torácico/abdominal não tratado ≥6 cm.'),
      y('cvd','AVC com nenhuma/sequela menor ou AIT',1,'Não classificar hemiplegia como sequela menor. Se também houver hemiplegia, esta aplicação retorna Não calculável até esclarecer o contrato neurológico; não deduz pontos automaticamente.'),
      y('dementia','Demência com déficit cognitivo crônico'),
      y('copd','Doença pulmonar crônica documentada'),
      y('ctd','Doença do tecido conjuntivo documentada'),
      y('ulcer','Doença ulcerosa péptica',1,'História de tratamento de doença ulcerosa ou sangramento por úlcera.'),
      meta(s('liver','Doença hepática',[[0,'Ausente'],[1,'Leve'],[3,'Moderada ou grave']],'Uma categoria apenas. Leve: hepatite crônica ou cirrose sem hipertensão portal. Moderada/grave: cirrose com hipertensão portal, sem/com sangramento por varizes.')),
      meta(s('diabetes','Diabetes mellitus',[[0,'Ausente ou controlado apenas com dieta'],[1,'Sem lesão de órgão'],[2,'Com lesão de órgão']],'Uma categoria apenas, conforme a classificação documental. Não somar diabetes sem complicações e com lesão de órgão.')),
      y('hemiplegia','Hemiplegia documentada',2,'Nesta aplicação restrita, AVC/AIT e hemiplegia positivos simultaneamente impedem o cálculo; rever a classificação sem presumir que um diagnóstico deve ser apagado.'),
      y('renal','Doença renal moderada ou grave',2,'Moderada: creatinina >3 mg/dL. Grave: diálise, transplante renal ou uremia. Não substituir por outro limite de creatinina ou eGFR.'),
      meta(s('cancer','Tumor sólido',[[0,'Ausente'],[2,'Localizado'],[6,'Metastático']],'Uma categoria apenas; não somar tumor localizado e metastático. Esta ficha editorial não especifica prazo de cinco anos: não importar esse prazo de outra variante.')),
      y('leukemia','Leucemia documentada',2,'Diagnóstico próprio, distinto de linfoma; não duplicar a mesma doença hematológica.'),
      y('lymphoma','Linfoma documentado',2,'Diagnóstico próprio, distinto de leucemia; não duplicar a mesma doença hematológica.'),
      y('aids','AIDS documentada',6,'AIDS, não simples soropositividade para HIV. O peso é histórico e anterior à ampla disponibilidade de terapia antirretroviral; não fornece prognóstico contemporâneo individual.')
    ],
    formula:'Soma de 16 categorias clínicas e idade (0–4), 17 componentes. Fígado, diabetes e tumor sólido usam uma única categoria cada. A combinação AVC/AIT + hemiplegia não é calculada nesta aplicação restrita; máximo matemático dos dados aceitos = 36, sem atribuir esse máximo ao índice original.',
    compute:x=>{
      const unavailable=(reason)=>({...result(null,'Charlson restrito · não calculável','Rever documentação e classificação; não converter dado desconhecido ou combinação excluída em zero, nem retirar um diagnóstico para obter resultado.',reason,'medium',[]),displayValue:'Não calculável',context_error:reason});
      if(x.eligible!==1)return unavailable('População, idade ou diagnósticos não confirmados.');
      if(x.cvd>0&&x.hemiplegia>0)return unavailable('AVC/AIT e hemiplegia simultâneos: contrato neurológico fora desta aplicação restrita.');
      const age=x.age_years<50?0:x.age_years<60?1:x.age_years<70?2:x.age_years<80?3:4;
      const ids=['mi','chf','pvd','cvd','dementia','copd','ctd','ulcer','liver','diabetes','hemiplegia','renal','cancer','leukemia','lymphoma','aids'];
      const breakdown=[{label:'Idade',points:age},...ids.map(id=>({label:id,points:x[id]}))];
      const total=breakdown.reduce((sum,part)=>sum+part.points,0);
      return result(total,'Charlson restrito · '+total+' pontos','Usar para descrever carga de comorbidades e apoiar avaliação contextual. Não fornece sobrevida, tratamento, limitação de cuidado ou decisão autônoma.',breakdown.map(part=>part.label+'='+part.points).join('; '),'medium',breakdown);
    },
    limits:'Aplicação parcial identificada da ficha editorial MDCalc versão 1. Casos simultâneos de AVC/AIT e hemiplegia ficam sem cálculo; não interpretar essa recusa como exclusão clínica universal nem remover diagnósticos verdadeiros. As variantes CHUV, CAPC, codificações ICD e estudos com idade 41–50 possuem contratos diferentes e não foram combinadas. Não estima mortalidade/sobrevida, não valida a equação de dez anos, não orienta prescrição e não fecha a lacuna do Charlson integral. Diagnósticos e classificação devem estar documentados; dados ausentes ou contexto não confirmado impedem o resultado.',
    sources:[ref('MDCalc · Charlson Comorbidity Index · versão editorial 1 · publicada 21/04/2022; aplicação restrita, sem sobrevida','https://www.mdcalc.com/calc/3917/charlson-comorbidity-index-cci')]
  }));
}
