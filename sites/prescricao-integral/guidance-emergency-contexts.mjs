const S={ana:'https://www.rch.org.au/clinicalguide/guideline_index/Anaphylaxis/',sbp:'https://www.sbp.com.br/fileadmin/user_upload/AAAI_V9_n1_a_03.pdf',sbp2021:'https://www.sbp.com.br/fileadmin/user_upload/22970c-GPA-Anafilaxia_-_Atualizacao_2021.pdf',croup:'https://www.rch.org.au/clinicalguide/guideline_index/Croup_Laryngotracheobronchitis/',cps:'https://cps.ca/en/documents/position/acute-management-of-croup',svt:'https://www.rch.org.au/clinicalguide/guideline_index/Supraventricular_Tachycardia_SVT/',brady:'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Bradycardia-250121.pdf?sc_lang=en'};
const sources=(...urls)=>urls.map(url=>({title:'Diretriz de emergência, acompanhamento e cuidados',url,accessed:'2026-09-27'}));
const anaphylaxis={
 general:'Anafilaxia é uma emergência. Informar o possível desencadeante e o horário dos sintomas e medicamentos. O tratamento imediato é adrenalina intramuscular e suporte assistencial; anti-histamínico ou corticoide não substitui nem deve atrasar a adrenalina.',
 diagnosis:'Manter deitado ou, se necessário para respirar, sentado com pernas estendidas; não levantar nem caminhar durante a reação. Evitar nova exposição ao desencadeante suspeito até investigação. Na alta, levar plano escrito de emergência e informar escola/cuidadores; treinar uso de autoinjetor quando indicado e disponível.',
 expected:'Pode haver melhora rápida após o tratamento, mas os sintomas podem reaparecer horas depois sem nova exposição. Desaparecimento de manchas não confirma resolução: respiração, circulação e estado geral precisam permanecer estáveis.',
 alarm:'Avisar imediatamente se retornarem tosse persistente, voz alterada, chiado, inchaço de língua/garganta, vômitos repetidos, palidez ou tontura. Anafilaxia também pode ocorrer sem urticária.',
 immediate:'Falta de ar, desmaio, fraqueza intensa, confusão ou dificuldade para despertar exigem emergência imediata: chamar a equipe ou SAMU 192 e executar o plano de adrenalina previamente prescrito. Não aguardar ação de antialérgico oral nem ir caminhando ao atendimento.',
 return:'Permanecer em observação assistencial: SBP orienta 6–8 horas nos quadros leves resolvidos e 24–48 horas nos graves, com extensão conforme risco e resposta. RCH estabelece ao menos 4 horas após a última adrenalina; doses repetidas, alteração circulatória, asma mal controlada ou acesso difícil justificam internação prolongada. A alta depende de estabilidade e plano de emergência. Encaminhar para alergologia/pediatria o mais breve possível; recorrência de sintomas exige retorno imediato.',
 urls:[S.sbp,S.sbp2021,S.ana]
};
const croup={
 general:'Manter a criança calma e em posição de conforto junto ao responsável. Oferecer líquidos se conseguir engolir sem dificuldade. Evitar fumaça, vapor quente e medicamentos sedativos para tosse.',
 diagnosis:'Observar o esforço para respirar e se há ruído ao inspirar em repouso. Não forçar exame da garganta. Adrenalina nebulizada é tratamento assistencial de obstrução; não usar o volume da nebulização como injeção nem programar doses domiciliares.',
 expected:'A tosse rouca pode durar 3–7 dias e piorar à noite. O corticoide age ao longo de algumas horas. A melhora com adrenalina pode ser transitória; o retorno do ruído ou do esforço respiratório exige nova avaliação.',
 alarm:'Estridor em repouso, retrações, dificuldade para beber ou sintomas que reaparecem após melhora exigem atendimento. Necessidade de várias nebulizações ou resposta insuficiente requer avaliação especializada.',
 immediate:'Procurar emergência se houver exaustão, sonolência, lábios azulados, saliva escorrendo com dificuldade de engolir, aparência muito doente ou início após engasgo. Ruído que diminui junto com maior cansaço pode indicar piora.',
 return:'Após adrenalina nebulizada, observar na unidade por pelo menos 3 horas depois da última dose, conforme RCH; só considerar alta sem estridor em repouso. Prolongar observação se houver recorrência, apresentação noturna, acesso difícil ou fatores de risco. Após alta, retornar prontamente se voltar estridor em repouso ou dificuldade respiratória. Crises repetidas, evolução prolongada ou início antes de 6 meses precisam de investigação.',
 urls:[S.croup,S.cps]
};
export const emergencyGuidanceRecords=[
 {name:'Anafilaxia',aliases:[],status:'source-reviewed',setting:'urgent',revisedAt:'2026-09-27',reviewNotes:'Perfil específico de anafilaxia, separado do termo genérico reação alérgica. Observação brasileira e divergência RCH explícitas; não adiciona corticoide/anti-histamínico como prevenção rotineira de reação bifásica.',...anaphylaxis,sources:sources(...anaphylaxis.urls)},
 {name:'Bradicardia sintomática por hipertonia vagal ou bloqueio AV primário',aliases:[],status:'source-reviewed',setting:'hospital',revisedAt:'2026-09-27',reviewNotes:'Perfil de bradicardia com pulso e repercussão; não representa bradicardia fisiológica, hipóxia isolada, parada ou intoxicação. A evolução e o acompanhamento dependem da causa e da resposta, não de prazo fixo de cura.',
 general:'Necessita atendimento monitorizado. Informar medicamentos, possível ingestão acidental, cardiopatia, procedimentos recentes e episódios de desmaio. Não oferecer líquidos ou alimentos se houver rebaixamento da consciência.',
 diagnosis:'A equipe acompanha frequência, ritmo, pressão, perfusão, oxigenação e ventilação, procurando causas reversíveis. Atropina tem indicação específica no aumento do tônus vagal ou bloqueio AV primário; não substitui suporte respiratório, compressões ou outros recursos quando necessários.',
 expected:'A resposta deve ser avaliada imediatamente e de forma contínua. O ritmo pode melhorar após corrigir a causa; bloqueios persistentes podem precisar de marca-passo e avaliação especializada. Não há prazo único de recuperação nem garantia de resposta à atropina.',
 alarm:'Avisar imediatamente se houver palidez, suor frio, fraqueza, confusão, dor no peito, falta de ar ou nova redução da frequência acompanhada de mal-estar.',
 immediate:'Desmaio, dificuldade para despertar, respiração ausente/anormal ou piora da perfusão exigem acionamento imediato da equipe. Após alta, chamar SAMU 192 diante desses sinais e seguir as instruções de reanimação do serviço de emergência.',
 return:'Manter reavaliação contínua durante o episódio e monitorização até estabilidade da circulação e esclarecimento da causa. A equipe deve organizar seguimento pediátrico/cardiológico antes da alta, conforme o distúrbio identificado; bloqueio persistente ou recorrência exige avaliação hospitalar. Novo desmaio, falta de ar ou mal-estar com frequência baixa exige retorno imediato, sem aguardar consulta marcada.',sources:sources(S.brady)}
];
export const emergencyGuidanceSupplements={
 'Anafilaxia alimentar':anaphylaxis,
 'Anafilaxia por medicamentos':{...anaphylaxis,diagnosis:anaphylaxis.diagnosis+' Registrar o medicamento suspeito e a reação nos documentos de saúde; não realizar teste ou reexposição por conta própria. A necessidade de autoinjetor depende da avaliação do risco, não é automática em alergia medicamentosa.'},
 'Crupe em Pediatria':croup,
 'Crupe espasmódico':croup,
 'Laringotraqueobronquite aguda (Crupe viral)':croup,
 'Taquicardia Supraventricular na Pediatria':{
  general:'Informar episódios prévios, cardiopatia e medicamentos/estimulantes em uso. Durante o episódio, permanecer em avaliação com monitorização. Não apertar o pescoço nem os olhos e não realizar manobras sem instrução da equipe.',
  diagnosis:'O ECG confirma o ritmo e deve ser registrado antes e após o tratamento. Em criança estável, a equipe pode realizar manobras vagais apropriadas; medicamentos e cardioversão dependem do ritmo e da repercussão. Após alta, seguir o plano específico e não iniciar ou repetir antiarrítmicos por conta própria.',
  expected:'A reversão pode ocorrer rapidamente com o tratamento, mas a arritmia pode retornar. Em lactentes, recusa alimentar, irritabilidade, palidez e suor podem ser manifestações mesmo sem queixa de palpitação. Persistência ou instabilidade exige outra abordagem imediatamente.',
  alarm:'Nova palpitação sustentada, cansaço, suor, palidez, menor aceitação alimentar ou tontura exigem reavaliação. Informar se os episódios ficam mais frequentes ou prolongados.',
  immediate:'Procurar emergência diante de desmaio, dor no peito, falta de ar, confusão, prostração ou má perfusão. Não tentar manobras caseiras para adiar atendimento se houver qualquer sinal de instabilidade.',
  return:'Após reversão, manter observação e discutir seguimento com pediatria/cardiologia. O RCH admite alta de casos selecionados após pelo menos 90 minutos de observação, com recuperação e seguimento assegurados; primeiro episódio, idade <3 meses, insuficiência cardíaca ou necessidade de cardioversão geralmente indicam internação. Recorrência exige retorno conforme o plano, imediatamente se houver repercussão.',urls:[S.svt]
 }
};
