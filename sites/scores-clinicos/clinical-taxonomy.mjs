/**
 * Taxonomia editorial explícita do catálogo 255 (base pública v49 + nSOFA neonatal).
 * Fonte: import estático de scores.mjs, após todos os overrides do candidato.
 * Somente descoberta: não muda elegibilidade, fórmula, resultado, fonte ou conduta.
 * IDs novos exigem revisão e entrada explícita; não há inferência nem fallback.
 */
export const CLINICAL_TAXONOMY_VERSION = '2026-10-10.catalog-255.v49-nsofa.v7';

import {PURPOSES} from "./clinical-purposes.mjs";
export {PURPOSES};

export const PURPOSE_DEFINITIONS = Object.freeze({
  [PURPOSES.DIAGNOSTIC_CRITERIA]: 'Verificação de critérios clínicos de uma definição diagnóstica específica. Não representa probabilidade calibrada, gravidade ou exclusão absoluta quando negativos.',
  [PURPOSES.PRETEST]: 'História e exame clínico apoiam a suspeita antes do exame confirmatório. O rótulo não garante uma probabilidade percentual.',
  [PURPOSES.AFTER_TESTS]: 'Apoio à investigação ou probabilidade diagnóstica que incorpora laboratório, imagem, ECG ou outro exame. Não significa diagnóstico confirmado nem pós-teste bayesiano universal.',
  [PURPOSES.SEVERITY]: 'Descrição ou classificação da intensidade do quadro atual; não implica uma estimativa de morte.',
  [PURPOSES.ANATOMIC_SEVERITY]: 'Carga anatômica de lesões já identificadas e codificadas.',
  [PURPOSES.ORGAN_DYSFUNCTION]: 'Descrição de disfunção em um ou mais órgãos no período especificado.',
  [PURPOSES.COMPLICATIONS]: 'Estratificação de eventos adversos ou complicações especificados pelo instrumento; não confundir com probabilidade diagnóstica.',
  [PURPOSES.PROGNOSIS]: 'Estratificação prognóstica do contrato identificado, sem afirmar probabilidade de morte calibrada ou previsão funcional.',
  [PURPOSES.MORTALITY]: 'Estimativa de mortalidade ou categorias identificadas desse desfecho. A população e a calibração continuam limitadas à ficha; o rótulo não autoriza previsão individual determinista.',
  [PURPOSES.FUNCTION]: 'Estado funcional observado, dependência ou impacto atual/retrospectivo nas atividades.',
  [PURPOSES.FUNCTIONAL_PROGNOSIS]: 'Predição de um desfecho funcional futuro, no horizonte de tempo e na população indicados para cada instrumento.',
  [PURPOSES.SCREENING]: 'Rastreio que seleciona necessidade de avaliação complementar; não confirma a doença.',
  [PURPOSES.ACTIVITY]: 'Atividade de doença já estabelecida e comparação entre avaliações.',
  [PURPOSES.CLASSIFICATION]: 'Critérios de classificação ou estadiamento dentro de uma população elegível; não equivale a diagnóstico universal.',
  [PURPOSES.CONSCIOUSNESS]: 'Registro do nível de consciência ou resposta neurológica observável.',
  [PURPOSES.APPEARANCE]: 'Observação padronizada da aparência; não exclui infecção nem substitui sinais vitais.',
  [PURPOSES.PAIN]: 'Registro de dor ou de comportamento associado à dor, respeitando capacidade de autorrelato e limitações.',
  [PURPOSES.SEDATION]: 'Registro da sedação e/ou agitação observadas, sem calcular doses.',
  [PURPOSES.SYMPTOMS]: 'Quantidade ou intensidade de sinais/sintomas em janela especificada; sem inferir diagnóstico ou prognóstico.',
  [PURPOSES.OXYGENATION]: 'Índice fisiológico de oxigenação que depende das condições de coleta e do suporte.',
  [PURPOSES.HEMODYNAMICS]: 'Índice hemodinâmico complementar; valor baixo não exclui choque.',
  [PURPOSES.ORGAN_FUNCTION]: 'Estimativa de função ou reserva de órgão, com equação e limites próprios.',
  [PURPOSES.MATURITY]: 'Estimativa neonatal de idade gestacional por exame clínico.',
  [PURPOSES.PERIOPERATIVE]: 'Estado físico, risco ou recuperação relacionados a anestesia/cirurgia, conforme a variante.',
  [PURPOSES.OBSTETRIC]: 'Avaliação obstétrica contextual, como favorabilidade cervical antes da indução; não indica o procedimento por si só.',
  [PURPOSES.DISPOSITION]: 'Apoio à avaliação do local de cuidado em doença confirmada; não é autorização automática de alta ou internação.',
  [PURPOSES.SUPPORT]: 'Avaliação do risco de precisar de suporte ou de falha da modalidade de suporte especificada.',
  [PURPOSES.ANTIBIOTIC_ROUTE]: 'Apoio contextual à escolha da via oral ou intravenosa do antibiótico na população específica; não é prescrição, decisão automática de internação ou diagnóstico da infecção.',
  [PURPOSES.COMORBIDITY]: 'Carga ponderada de doenças documentadas; não a converte em mortalidade/sobrevida individual.',
});

const P = PURPOSES;
const entries = [];
function add(ids, conditions, purposes, note = '') {
  for (const id of ids) entries.push([id, Object.freeze({
    conditions: Object.freeze([...conditions]),
    purposes: Object.freeze([...purposes]),
    note,
  })]);
}

add(['jadas10-esr-2021','cjadas10-2021'], ['Artrite idiopática juvenil'], [P.ACTIVITY], 'Atividade de AIJ já estabelecida. Fórmulas JADAS10-VHS e cJADAS10 distintas; estados 2021 opcionais e dependentes do curso confirmado, sem diagnóstico ou remissão automática.');
add(['trips-neonatal-2001'], ['Transporte neonatal', 'Doença crítica neonatal'], [P.SEVERITY], 'Instabilidade fisiológica na origem/destino de transporte neonatal inter-hospitalar. Perfil literal 2001, lacunas explícitas; não é TRIPS-II/California, diagnóstico, decisão de transporte ou probabilidade individual.');
add(['pcpc-pediatric-br2023', 'popc-pediatric-br2023'], ['Doença crítica'], [P.FUNCTION], 'Classificação funcional manual cerebral/global no contexto de UTIP ou história relacionada, perfil factual BR2023. Registro pontual ordinal; sem soma, conversão, diagnóstico de morte, risco ou prognóstico individual.');
add(['fss-pediatric-cpccrn'], ['Doença crítica'], [P.FUNCTION], 'Estado funcional observado na alta da UTIP/hospital, perfil TOPICC 2011. Comparação opcional com basal pré-doença reconstruído, descritiva; sem previsão de recuperação, mortalidade ou diagnóstico automático.');
add(['phoenix8-author-113'], ['Sepse','Disfunção de múltiplos órgãos'], [P.ORGAN_DYSFUNCTION], 'Perfil computacional autoral 1.1.3 de pesquisa; completude local estrita, sem diagnóstico automático ou mortalidade individual. Separado do Phoenix de quatro órgãos.');

add(['nsofa-neonatal'], ['Sepse','Disfunção orgânica neonatal'], [P.ORGAN_DYSFUNCTION], 'Uma tabela neonatal em três aplicações explícitas; descrição de disfunção/suporte, sem diagnóstico de sepse ou probabilidade individual de óbito.');

// Respiratório: somente o diagnóstico/contexto alvo, não cada sinal do formulário.
add(['pram'], ['Asma'], [P.SEVERITY]);
add(["mpis-maekawa-2018", "pass-gorelick-2004", "aairs-arnold-2012", "cas-parkin-1996"], ['Asma'], [P.SEVERITY], 'Quatro versões pediátricas identificadas; gravidade observada, sem diagnóstico, mortalidade ou bandas terapêuticas universais. PRAM permanece separado.');
add(['chandler-orbital'], ['Celulite orbitária','Celulite pré-septal','Complicações orbitárias da sinusite'], [P.CLASSIFICATION]);
add(['ispad-dka-acidosis-2022'], ['Cetoacidose diabética'], [P.CLASSIFICATION]);
add(['mas-sjia-2016'], ['Artrite idiopática juvenil sistêmica', 'Síndrome de ativação macrofágica'], [P.CLASSIFICATION]);
add(['alt70-cellulitis-2017'], ['Celulite de membro inferior'], [P.AFTER_TESTS]);
add(['kawasaki-complete-aha2024'], ['Doença de Kawasaki'], [P.DIAGNOSTIC_CRITERIA]);
add(['niaid-faan-anaphylaxis-2006'], ['Anafilaxia'], [P.DIAGNOSTIC_CRITERIA]);
add(['pbmst-child-bloem2026'], ['Constipação'], [P.SYMPTOMS]);
add(['edc-dengue-2015-literal'], ['Dengue'], [P.AFTER_TESTS]);
add(['westley','westley-rcht-2023'], ['Crupe'], [P.SEVERITY]);
add(['wang','kristjansson','rdai','tal-modified'], ['Bronquiolite'], [P.SEVERITY]);
add(['curb65','crb65'], ['Pneumonia'], [P.SEVERITY,P.MORTALITY,P.DISPOSITION], 'Pneumonia comunitária em adultos já diagnosticada; categorias de risco do contrato NICE. Não são testes diagnósticos de pneumonia nem escores pediátricos.');
add(['psi-port'], ['Pneumonia'], [P.SEVERITY,P.MORTALITY,P.DISPOSITION], 'Pneumonia comunitária adulta; apenas a etapa de pontuação/classes II–V. Classe I não implementada. As classes prognósticas não definem UTI nem alta isoladamente.');
add(['smart-cop'], ['Pneumonia'], [P.SUPPORT], 'Prediz necessidade de suporte respiratório intensivo/vasopressor na pneumonia comunitária adulta; não é modelo de mortalidade.');
add(['idsa-ats-minor','adrop'], ['Pneumonia'], [P.SEVERITY], 'Pneumonia adquirida na comunidade em adultos. Manter critérios maiores separados na ficha IDSA/ATS e a variante original de A-DROP.');
add(['mmrc'], ['Dispneia','Doença pulmonar obstrutiva crônica'], [P.FUNCTION,P.SYMPTOMS]);
add(['bode'], ['Doença pulmonar obstrutiva crônica'], [P.PROGNOSIS], 'DPOC estável: índice multidimensional; esta ficha não fornece probabilidade de sobrevida nem previsão funcional futura.');
add(['decaf'], ['Doença pulmonar obstrutiva crônica'], [P.PROGNOSIS], 'Exacerbação hospitalizada; as faixas da ficha descrevem risco prognóstico. Não se acrescenta uma taxa de mortalidade.');
add(['stopbang'], ['Apneia obstrutiva do sono'], [P.SCREENING]);
add(['rox'], ['Insuficiência respiratória','Oxigenoterapia de alto fluxo'], [P.OXYGENATION,P.SUPPORT], 'CNAF em adultos com insuficiência hipoxêmica; índice sem limiar universal de sucesso nesta implementação.');
add(['hacor'], ['Insuficiência respiratória','Ventilação não invasiva'], [P.SUPPORT], 'Variante original hipoxêmica após 1 h de VNI; não aplicar automaticamente a DPOC.');
add(['rsbi'], ['Ventilação mecânica e desmame'], [P.SUPPORT], 'Medida complementar do desmame; não decide extubação.');
add(['pf-ratio','sf-ratio'], ['Insuficiência respiratória','Síndrome do desconforto respiratório agudo'], [P.OXYGENATION], 'Índices não diagnosticam ou graduam SDRA isoladamente; suporte e demais critérios continuam necessários.');
add(['oxygenation-index','osi'], ['Insuficiência respiratória','Síndrome do desconforto respiratório agudo'], [P.OXYGENATION], 'Contrato pediátrico em ventilação invasiva; PARDS depende de critérios clínicos adicionais.');
add(['murray-lis'], ['Insuficiência respiratória','Síndrome do desconforto respiratório agudo'], [P.SEVERITY], 'Quatro componentes obrigatórios na variante CESAR; não substitui definição atual de SDRA.');
add(['silverman','downes'], ['Desconforto respiratório neonatal'], [P.SEVERITY]);

// Neurologia, consciência, traumatismos e regras de investigação.
add(['glasgow'], ['Alteração do nível de consciência','Traumatismo cranioencefálico'], [P.CONSCIOUSNESS], 'O contrato convencional inclui uso em TCE, mantendo as restrições de resposta verbal; não é prognóstico isolado.');
add(['four'], ['Alteração do nível de consciência'], [P.CONSCIOUSNESS]);
add(['pediatric-gcs','raimondi'], ['Alteração do nível de consciência','Traumatismo cranioencefálico'], [P.CONSCIOUSNESS], 'Cada adaptação pediátrica mantém sua faixa etária e seus descritores.');
add(['gcs-p'], ['Traumatismo cranioencefálico'], [P.CONSCIOUSNESS,P.SEVERITY], 'Soma de Glasgow e pupilas observados. Não há nomograma de mortalidade nem prognóstico funcional individual nesta ficha.');
add(['nihss'], ['Acidente vascular cerebral'], [P.SEVERITY]);
add(['mrs'], ['Acidente vascular cerebral'], [P.FUNCTION], 'Registra incapacidade atual/pós-evento. Não prediz função futura nem estima mortalidade; a categoria óbito não transforma a escala em modelo de morte.');
add(['ich'], ['Hemorragia intracerebral'], [P.SEVERITY,P.PROGNOSIS], 'Graduação de grupo após TC; não se acrescentam taxas históricas de morte nem previsão funcional individual.');
add(['hunt-hess','wfns'], ['Hemorragia subaracnóidea'], [P.SEVERITY,P.PROGNOSIS]);
add(['fisher-modified'], ['Hemorragia subaracnóidea'], [P.COMPLICATIONS], 'TC na HSA; associação com vasoespasmo, não diagnóstico de isquemia tardia.');
add(['ottawa-sah'], ['Cefaleia','Hemorragia subaracnóidea'], [P.PRETEST], 'Regra clínica de seleção para investigação na população estrita; não é probabilidade percentual.');
add(['rosier'], ['Acidente vascular cerebral'], [P.SCREENING]);
add(['lams'], ['Acidente vascular cerebral'], [P.SCREENING,P.SEVERITY], 'Escala motora pré-hospitalar; não confirma oclusão de grande vaso.');
add(['abcd2'], ['Ataque isquêmico transitório'], [P.PROGNOSIS], 'Instrumento histórico com restrição expressa da ficha: não utilizar para estimar risco subsequente ou definir urgência segundo NICE NG128. Inclusão é para consulta de registros, não recomendação de uso.');
add(['pedmidas'], ['Cefaleia','Enxaqueca'], [P.FUNCTION], 'Impacto retrospectivo em atividades em 3 meses; não diagnóstico de enxaqueca ou prognóstico funcional futuro.');
add(['thompson-hie'], ['Encefalopatia neonatal'], [P.SEVERITY], 'Soma seriada de sinais na variante TNS 2018, sem bandas universais, indicação de hipotermia ou previsão neurofuncional implementada.');
add(['pts','trts'], ['Trauma'], [P.SEVERITY,P.SCREENING]);
add(['rts','gap','mgap'], ['Trauma'], [P.SEVERITY,P.PROGNOSIS], 'Contratos fisiológicos identificados; não implementam a probabilidade de sobrevida TRISS.');
add(['iss','niss'], ['Trauma'], [P.ANATOMIC_SEVERITY]);
add(['pecarn-cervical-lee2025'], ['Trauma cervical'], [P.PRETEST], 'Regra hierárquica de critérios clínicos de lesão cervical após trauma fechado pediátrico, apresentação Lee 2025/gráfico 2024. Ramo determinado separado de todos os achados conhecidos; sem soma, probabilidade individual ou imagem/liberação/alta automáticas.');
add(['nexus-cspine','canadian-cspine'], ['Trauma cervical'], [P.PRETEST]);
add(['ottawa-knee'], ['Trauma de joelho'], [P.PRETEST]);
add(['ottawa-ankle'], ['Trauma de tornozelo e pé'], [P.PRETEST]);
add(['pecarn-under2','pecarn-over2','canadian-headct','nexus-headct'], ['Traumatismo cranioencefálico'], [P.PRETEST], 'Regras clínicas de seleção para investigação após trauma. PECARN aqui é exclusivamente trauma craniano, sem relação com febre.');
add(['pecarn-abdominal'], ['Trauma abdominal'], [P.PRETEST], 'Regra de lesão intra-abdominal com intervenção no trauma fechado; não é instrumento de febre ou apendicite.');

// Infecção, febre, sepse e disfunção orgânica. Nenhuma associação por substring.
add(['centor','feverpain','mcisaac'], ['Faringoamigdalite'], [P.PRETEST], 'História/exame apoiam investigação de estreptococo. Preservar faixa etária e variante; não prometem probabilidade percentual, diagnóstico bacteriano ou antibiótico automático.');
add(['qsofa'], ['Infecção','Sepse'], [P.PROGNOSIS], 'Risco de desfecho desfavorável em adultos com suspeita de infecção; não é teste isolado de triagem/diagnóstico/exclusão de sepse nem taxa calibrada de morte.');
add(['news2','mews'], ['Deterioração clínica'], [P.SCREENING,P.SEVERITY], 'Alerta precoce geral. Não atribuir infecção específica ou mortalidade à presença de temperatura entre os componentes.');
add(['sofa-original','sofa2'], ['Doença crítica','Disfunção de múltiplos órgãos','Sepse'], [P.ORGAN_DYSFUNCTION], 'Disfunção orgânica de adultos; total isolado não confirma sepse. SOFA original e SOFA-2 permanecem variantes distintas.');
add(['phoenix'], ['Sepse','Choque','Choque séptico','Disfunção de múltiplos órgãos'], [P.ORGAN_DYSFUNCTION,P.CLASSIFICATION], 'Classificação pediátrica exige contexto infeccioso e elegibilidade. Não é detecção precoce.');
add(['psofa'], ['Doença crítica','Disfunção de múltiplos órgãos','Sepse'], [P.ORGAN_DYSFUNCTION], 'Vínculo contextual com sepse pediátrica identificado no estudo de 2017. Variante parcial: não é diagnóstico vigente, alerta precoce ou probabilidade de morte individual.');
add(['pelod2'], ['Doença crítica','Disfunção de múltiplos órgãos'], [P.ORGAN_DYSFUNCTION], 'Contrato pediátrico geral de educação/pesquisa. A documentação local não sustenta um vínculo específico adicional de descoberta por Sepse; não fornece probabilidade de morte individual.');
add(['sirs-adult','pediatric-sirs'], ['Resposta inflamatória sistêmica','Sepse'], [P.CLASSIFICATION], 'Contagem histórica de resposta inflamatória, incluída em Sepse somente para consulta contextual. Não é definição atual, triagem ou prognóstico de sepse.');
add(['snap2','snappe2'], ['Doença crítica neonatal'], [P.SEVERITY], 'Carga fisiológica neonatal e fatores perinatais conforme a variante; sem conversão para mortalidade individual nesta ficha.');
add(['saps2','apache2'], ['Doença crítica'], [P.SEVERITY], 'Somas de gravidade em UTI. As fichas não implementam uma estimativa de mortalidade calibrada; APACHE II exige modelo diagnóstico adicional para tal uso.');
add(['feast-pet-2015'], ['Admissão hospitalar pediátrica','Doença crítica'], [P.MORTALITY], 'Soma prognóstica descritiva de mortalidade precoce na admissão hospitalar ou HDU selecionada, Tabela3/2015. Recorte local completo, ≥2meses e antes de12anos; não diagnostica sepse/choque, não fornece probabilidade/bandas/conduta, e mantém ressalva autoral de validação adicional antes da implementação.');
add(['pim3'], ['Doença crítica'], [P.MORTALITY], 'Modelo probabilístico de mortalidade na admissão de UTI pediátrica; educação, pesquisa e ajuste de risco de grupos. Não aplicar como previsão individual ou decisão terapêutica.');
add(['rems'], ['Deterioração clínica'], [P.SEVERITY], 'Carga fisiológica na emergência; não há categorias universais 6/10 nem probabilidade individual implementadas.');
add(['pecarn-febrile-cps2026'], ['Febre','Infecção bacteriana em lactentes'], [P.AFTER_TESTS], 'PECARN febril atualizada CPS 2026, até 60 dias, urina combinada, ANC e PCT. Não é PECARN de trauma, regra de 61–90 dias ou porcentagem individual.');
add(['lab-score-fever'], ['Febre'], [P.AFTER_TESTS], 'Febre sem foco de 7 dias a 36 meses; PCT, PCR e fita urinária. Não é probabilidade exclusivamente clínica nem confirmação de infecção.');
add(['nice-fever-traffic-light'], ['Febre'], [P.SEVERITY], 'Semáforo de sinais de risco em menores de 5 anos; a pior categoria prevalece. Não é estimativa de probabilidade de infecção.');
add(['yale-observation'], ['Febre'], [P.APPEARANCE], 'Aparência em crianças febris de 3–36 meses nesta ficha. Não exclui doença bacteriana e não estima probabilidade individual.');
add(['rochester','step-by-step'], ['Febre','Infecção bacteriana em lactentes'], [P.AFTER_TESTS], 'Estratificação da suspeita bacteriana após dados clínicos/laboratoriais. Preservar populações e janelas etárias próprias; baixo risco não confirma ausência nem autoriza alta.');
add(['prism-iv-prepared-2016'], ['Doença crítica','Cirurgia cardíaca'], [P.MORTALITY], 'Regressão PRISM IV 2016 restrita a subescores previamente preparados sem imputação normal/zero de dados ausentes, em UTIP não neonatal. Cirurgia cardíaca só nos contextos e janelas adjudicados; não avaliação pré-operatória genérica, motor fisiológico bruto, certeza individual ou decisão de suporte.');
add(['cisne-adult-finite2012'], ['Febre','Neutropenia febril'], [P.COMPLICATIONS], 'Adultos com tumor sólido e neutropenia febril aparentemente estável após avaliação integral; pesos2015/preparo FINITE2012 explícitos. Critérios adjudicados, sem diagnóstico, aplicação pediátrica, probabilidade individual ou alta automática.');
add(['mascc'], ['Febre','Neutropenia febril'], [P.COMPLICATIONS], 'Adultos com câncer e neutropenia febril. Inclusão em Febre é contextual; não extrapolar à febre infantil indiferenciada.');
add(['bacterial-meningitis-score'], ['Meningite'], [P.AFTER_TESTS], 'Aplicável após punção lombar com pleocitose, com exames e população elegível. Não é triagem apenas clínica de febre.');
add(['kocher','kocher-caird'], ['Artrite séptica do quadril','Quadril irritável'], [P.AFTER_TESTS], 'Contagem após exames; versões identificadas e sem probabilidade individual. Não aplicar ao joelho.');
add(['rodwell'], ['Sepse neonatal'], [P.AFTER_TESTS], 'Soma de domínios hematológicos previamente classificados; não substitui diagnóstico clínico.');
add(['lrinec'], ['Infecção necrosante de partes moles'], [P.AFTER_TESTS], 'Laboratório complementar; sensibilidade insuficiente para exclusão.');
add(['candida-score'], ['Candidíase invasiva'], [P.AFTER_TESTS], 'Exige culturas de colonização e contexto específico de UTI; não é diagnóstico de candidemia.');
add(['denova'], ['Endocardite infecciosa','Bacteremia por Enterococcus faecalis'], [P.AFTER_TESTS], 'Risco de endocardite após bacteremia monomicrobiana por E. faecalis documentada; não é prognóstico da endocardite já confirmada.');
add(['quick-pitt'], ['Bacteremia de foco urinário','Infecção urinária'], [P.SEVERITY], 'Variante Li 2022, bacteremia secundária à ITU. Não diagnostica sepse nem estima porcentagem de mortalidade.');
add(['sic'], ['Coagulopatia associada à sepse','Sepse'], [P.AFTER_TESTS,P.CLASSIFICATION]);
add(['isth-dic2025'], ['Coagulação intravascular disseminada'], [P.AFTER_TESTS,P.CLASSIFICATION]);

add(['melbourne-asset'], ['Celulite','Celulite pré-septal'], [P.ANTIBIOTIC_ROUTE], 'Celulite pediátrica de 6 meses a 18 anos. Apoio à escolha da via, com desempenho externo limitado. A localização pré-septal pode integrar a ficha; suspeita orbitária exclui sua aplicação. Não estima abscesso nem determina alta/internação.');

// Cardiovascular, tromboembolismo, síncope e avaliação de choque.
add(['wells-tvp'], ['Trombose venosa profunda'], [P.PRETEST]);
add(['wells-tep','geneva','perc'], ['Tromboembolismo pulmonar'], [P.PRETEST], 'PERC exige probabilidade clínica muito baixa previamente estabelecida; nenhuma das regras confirma TEP.');
add(['years'], ['Tromboembolismo pulmonar'], [P.AFTER_TESTS], 'Estratégia clínica combinada a D-dímero; não classificar como avaliação apenas clínica.');
add(['spesi','pesi'], ['Tromboembolismo pulmonar'], [P.MORTALITY,P.PROGNOSIS], 'TEP agudo confirmado: classes de risco prognóstico/mortalidade do contrato identificado. Não são probabilidade pré-teste nem autorização isolada de alta.');
add(['bova'], ['Tromboembolismo pulmonar'], [P.COMPLICATIONS,P.PROGNOSIS], 'Complicações do TEP agudo confirmado em normotensos; não inventar mortalidade ou risco diagnóstico.');
add(['hestia'], ['Tromboembolismo pulmonar'], [P.DISPOSITION], 'Elegibilidade para cuidado ambulatorial de TEP confirmado, com requisitos clínicos e sociais.');
add(['padua','improve-vte'], ['Tromboembolismo venoso','Internação clínica'], [P.COMPLICATIONS]);
add(['improve-bleed'], ['Sangramento','Internação clínica'], [P.COMPLICATIONS]);
add(['cha2ds2va','chads2'], ['Fibrilação atrial'], [P.COMPLICATIONS], 'Risco embólico, não diagnóstico de FA nem mortalidade; CHADS₂ é histórico.');
add(['has-bled','orbit','atria-bleeding'], ['Fibrilação atrial','Sangramento'], [P.COMPLICATIONS]);
add(['mehra'], ['Fibrilação atrial'], [P.SYMPTOMS,P.FUNCTION]);
add(['edacs-clinical-2014'], ['Dor torácica','Síndrome coronariana aguda'], [P.COMPLICATIONS], 'Componente clínico de estratificação de eventos na possível apresentação coronariana; soma EDACS sem executar ADP, ECG/troponina ou probabilidade individual. Limiar numérico não define baixo risco/diagnóstico/alta.');
add(['heart'], ['Dor torácica','Síndrome coronariana aguda'], [P.COMPLICATIONS], 'Estratificação de eventos na dor torácica após avaliação que inclui ECG/troponina; não é probabilidade diagnóstica pré-teste apenas clínica.');
add(['timi-nstemi'], ['Síndrome coronariana aguda'], [P.COMPLICATIONS,P.PROGNOSIS], 'Eventos compostos em angina instável/IAM sem supra; não chamar o desfecho composto de mortalidade isolada.');
add(['timi-stemi'], ['Infarto agudo do miocárdio'], [P.PROGNOSIS], 'Associação à mortalidade em 30 dias no modelo histórico de fibrinólise. A ficha entrega pontuação, sem probabilidade recalibrada ou classes específicas adicionais de mortalidade.');
add(['killip'], ['Infarto agudo do miocárdio','Insuficiência cardíaca'], [P.SEVERITY]);
add(['h2fpef'], ['Insuficiência cardíaca com fração de ejeção preservada','Dispneia'], [P.AFTER_TESTS], 'Investigação de ICFEp inclui dados ecocardiográficos; não é probabilidade apenas clínica.');
add(['nyha'], ['Insuficiência cardíaca'], [P.FUNCTION]);
add(['ccs-angina'], ['Angina','Doença arterial coronariana'], [P.FUNCTION]);
add(['sgarbossa','modified-sgarbossa'], ['Infarto agudo do miocárdio','Bloqueio de ramo esquerdo'], [P.AFTER_TESTS], 'Medidas profissionais de ECG com BRE confirmado; não são índices de gravidade/mortalidade.');
add(['duke-treadmill','duke-alexander-1998','duke-mark-1991'], ['Doença arterial coronariana','Dor torácica'], [P.PROGNOSIS], 'Estratificação histórica após teste ergométrico no Bruce padrão; variantes e cortes próprios, sem nomograma de sobrevida implementado.');
add(['add-rs'], ['Síndrome aórtica aguda'], [P.PRETEST]);
add(['sfsr','csrs'], ['Síncope'], [P.COMPLICATIONS], 'Após avaliação inicial; o desfecho é evento grave, não confirmação da causa nem mortalidade isolada.');
add(['oesil'], ['Síncope'], [P.PROGNOSIS], 'Índice prognóstico histórico em um ano; não converter a soma em probabilidade individual contemporânea.');
add(['is-wernovsky-1995'], ['Cirurgia cardíaca'], [P.HEMODYNAMICS], 'Índice pontual de suporte inotrópico na aplicação cardíaca pediátrica identificada; sem classificação prognóstica.');
add(['vis-gaies-2010'], ['Cirurgia cardíaca','Sepse','Choque séptico'], [P.HEMODYNAMICS], 'Uma fórmula VIS com contexto explicitamente selecionado; descreve suporte, sem diagnóstico ou mortalidade individual.');
add(['shock-index','modified-shock-index'], ['Choque','Instabilidade hemodinâmica'], [P.HEMODYNAMICS]);
add(['age-shock-index','sipa'], ['Trauma','Choque','Instabilidade hemodinâmica'], [P.HEMODYNAMICS], 'Idade ajusta a interpretação apenas nas populações de trauma especificadas; ASI e SIPA têm fórmulas/faixas distintas.');
add(['4ts'], ['Trombocitopenia induzida por heparina'], [P.AFTER_TESTS], 'Probabilidade pré-imunoensaio baseada em curva de plaquetas e clínica. Por depender de hemograma, não integra a categoria apenas clínica.');

// Gastrointestinal, hepatologia, rim e cirurgia.
add(['air','pas','alvarado','parc'], ['Apendicite'], [P.AFTER_TESTS], 'As quatro fichas incorporam hemograma/marcadores. pARC requer ANC medido e gera probabilidade; não é ferramenta pré-teste apenas clínica nem risco de perfuração.');
add(['dhaka-2015','cds','gorelick-10','gorelick-4','who-dehydration'], ['Desidratação','Gastroenterite'], [P.SEVERITY]);
add(['vesikari','vesikari-modificado'], ['Gastroenterite'], [P.SEVERITY], 'Gravidade global do episódio, incluindo tratamento recebido; não é escala isolada de desidratação.');
add(['oakland-complete-bsg2019'], ['Hemorragia digestiva baixa'], [P.PROGNOSIS], 'Desfecho composto após apresentação com HDB aguda em adultos; sete parcelas iniciais BSG 2019 incluindo toque retal. Soma completa separada da interpretação contextual do limiar, sem probabilidade individual, diagnóstico etiológico ou alta automática.');
add(['gbs'], ['Hemorragia digestiva alta'], [P.COMPLICATIONS,P.DISPOSITION], 'Risco de necessidade de intervenção antes da endoscopia, com laboratório; não é teste diagnóstico pré-teste.');
add(['rockall-clinical','rockall-full'], ['Hemorragia digestiva alta'], [P.PROGNOSIS,P.COMPLICATIONS], 'Associação à mortalidade/ressangramento; versão clínica pré-endoscópica e completa pós-endoscópica. Não acrescenta taxa individual nem converte pré-endoscópico em pré-teste diagnóstico.');
add(['aims65'], ['Hemorragia digestiva alta'], [P.PROGNOSIS]);
add(['bisap','haps','glasgow-imrie'], ['Pancreatite aguda'], [P.COMPLICATIONS,P.PROGNOSIS], 'Pancreatite já confirmada; respectivas janelas e desfechos não substituem a classificação atual de falência orgânica persistente.');
add(['child-pugh'], ['Cirrose'], [P.SEVERITY,P.CLASSIFICATION]);
add(['meld3','meld-na'], ['Cirrose','Doença hepática avançada'], [P.SEVERITY,P.PROGNOSIS], 'Índices prognósticos identificados; não acrescentar percentuais de outra variante nem política atual de alocação.');
add(['albi'], ['Carcinoma hepatocelular','Doença hepática crônica'], [P.ORGAN_FUNCTION], 'Reserva hepática; não é estadiamento tumoral.');
add(['fib4'], ['Fibrose hepática','Doença hepática esteatótica metabólica'], [P.SCREENING,P.AFTER_TESTS], 'Triagem laboratorial de fibrose avançada em suspeita de MASLD; não diagnóstico definitivo.');
add(['apri'], ['Fibrose hepática','Hepatite C','Doença hepática crônica'], [P.AFTER_TESTS]);
add(['nafld-fibrosis-score'], ['Fibrose hepática','Doença hepática esteatótica não alcoólica'], [P.SCREENING,P.AFTER_TESTS], 'População histórica NAFLD/DHGNA da ficha; não estender automaticamente a toda MASLD.');
add(['fatty-liver-index'], ['Esteatose hepática'], [P.SCREENING,P.AFTER_TESTS], 'Triagem de esteatose com exames; não define etiologia, esteato-hepatite ou fibrose.');
add(['maddrey','gahs'], ['Hepatite associada ao álcool'], [P.SEVERITY,P.PROGNOSIS]);
add(['ckdepi2021','cockcroft-gault','schwartz2009'], ['Função renal','Doença renal crônica'], [P.ORGAN_FUNCTION], 'Estimativas em creatinina estável; Cockcroft–Gault estima clearance não indexado, CKD-EPI/Schwartz estimam TFG. Não diagnosticar DRC nem aplicar à LRA pelo seletor.');
add(['kdigo-aki'], ['Lesão renal aguda'], [P.CLASSIFICATION,P.SEVERITY]);
add(['kdigo-ckd'], ['Doença renal crônica'], [P.CLASSIFICATION], 'Categorias G/A dependem de cronicidade/contexto; não são percentual de risco.');
add(['twist'], ['Torção testicular'], [P.PRETEST]);
add(['mannheim-peritonitis'], ['Peritonite'], [P.SEVERITY,P.PROGNOSIS], 'Achados clínicos e operatórios; o corte de coorte permanece identificado, sem probabilidade de morte individual.');
add(['asa'], ['Anestesia e cirurgia'], [P.PERIOPERATIVE,P.CLASSIFICATION], 'Classifica estado físico; ASA não quantifica isoladamente mortalidade/risco operatório.');
add(['rcri'], ['Cirurgia não cardíaca'], [P.PERIOPERATIVE,P.COMPLICATIONS]);
add(['ariscat'], ['Anestesia e cirurgia','Complicações pulmonares pós-operatórias'], [P.PERIOPERATIVE,P.COMPLICATIONS]);
add(['apfel'], ['Anestesia e cirurgia','Náuseas e vômitos pós-operatórios'], [P.PERIOPERATIVE,P.COMPLICATIONS]);
add(['aldrete'], ['Recuperação pós-anestésica'], [P.PERIOPERATIVE], 'Recuperação pós-anestésica; não é instrumento de alta domiciliar.');
add(['surgical-apgar'], ['Anestesia e cirurgia'], [P.PERIOPERATIVE,P.COMPLICATIONS], 'Avaliação ao término de cirurgia geral/vascular; não é risco pré-operatório nem Apgar neonatal.');
add(['acef-original'], ['Cirurgia cardíaca'], [P.PERIOPERATIVE,P.PROGNOSIS], 'Índice contínuo pré-operatório. A ficha identifica calibração inadequada na validação brasileira; não criar classes ou porcentagem de mortalidade.');

// Sintomas, saúde mental, delirium, sedação, dor e abstinência.
add(['rass','ramsay','riker-sas','comfort-b','sbs','umss'], ['Sedação e agitação'], [P.SEDATION], 'Preservar população e versão de cada escala; não converter sedação em dose ou analgesia.');
add(['bps','flacc','nips','cpot'], ['Dor'], [P.PAIN]);
add(['phq9','phq2'], ['Sintomas depressivos'], [P.SCREENING,P.SYMPTOMS]);
add(['gad7','gad2'], ['Sintomas ansiosos'], [P.SCREENING,P.SYMPTOMS]);
add(['capd','4at','cam-icu','icdsc'], ['Delirium'], [P.SCREENING]);
add(['paed'], ['Delirium no despertar anestésico'], [P.SYMPTOMS], 'Observação no despertar; não substituir CAPD/CAM-ICU nem medida de profundidade de sedação.');
add(['cows'], ['Abstinência de opioides'], [P.SYMPTOMS]);
add(['wat1'], ['Abstinência iatrogênica'], [P.SYMPTOMS], 'Desmame após exposição prolongada a opioides/benzodiazepínicos; não atribuir a toda abstinência espontânea.');
add(['finnegan-qld','finnegan-simplificado-devlin-2020'], ['Abstinência neonatal'], [P.SYMPTOMS], 'Queensland permanece com cálculo suspenso. Devlin 2020 é pontuação consultiva de pesquisa; nenhuma variante vira diagnóstico, risco individual ou regra de medicamento.');
add(['auditc-va'], ['Uso de álcool'], [P.SCREENING]);
add(['cage'], ['Uso de álcool'], [P.SCREENING], 'Consulta histórica; a ficha informa que CAGE não é rastreio contemporâneo recomendado pela NIAAA.');
add(['fagerstrom'], ['Dependência de nicotina'], [P.SYMPTOMS]);

// Funcionalidade, fragilidade, nutrição, comorbidade e cuidado continuado.
add(['ecog','karnofsky'], ['Câncer'], [P.FUNCTION], 'Estado funcional atual em oncologia. Sem conversão automática para prognóstico de sobrevida ou função futura.');
add(['katz','lawton-9'], ['Dependência nas atividades diárias'], [P.FUNCTION]);
add(['sarcf'], ['Sarcopenia'], [P.SCREENING]);
add(['mrc-sum'], ['Fraqueza muscular','Doença crítica'], [P.FUNCTION], 'Força atual em paciente cooperativo; diagnóstico de fraqueza adquirida na UTI exige contexto.');
add(['clinical-frailty-scale'], ['Fragilidade'], [P.CLASSIFICATION,P.FUNCTION], 'Fragilidade basal em adultos ≥65 anos; não pontuar aparência durante doença aguda nem inferir previsão individual.');
add(['frail-scale'], ['Fragilidade'], [P.SCREENING]);
add(['isar-br'], ['Vulnerabilidade da pessoa idosa'], [P.SCREENING], 'Adaptação brasileira de rastreio; a ficha não afirma validação prognóstica brasileira.');
add(['nrs2002','must','conut','mst','mnutric','strongkids'], ['Desnutrição'], [P.SCREENING], 'Cada instrumento mantém seu cenário/população; CONUT usa laboratório e mNUTRIC usa gravidade em UTI, sem diagnóstico nutricional isolado.');
add(['braden'], ['Lesão por pressão'], [P.COMPLICATIONS]);
add(['morse'], ['Quedas'], [P.SCREENING,P.COMPLICATIONS]);
add(['charlson-mdcalc-restrito','charlson-original-1987'], ['Multimorbidade'], [P.COMORBIDITY], 'Contagem ponderada de comorbidades. Nenhuma variante implementa probabilidade individual de mortalidade/sobrevida em dez anos. Não indexar por cada doença que seja apenas um item do somador.');

// Dermatologia, reumatologia e condições gineco-obstétricas/neonatais.
add(['pasi'], ['Psoríase'], [P.SEVERITY,P.ACTIVITY]);
add(['scorad','easi'], ['Dermatite atópica'], [P.SEVERITY,P.ACTIVITY]);
add(['ihs4'], ['Hidradenite supurativa'], [P.ACTIVITY]);
add(['hurley'], ['Hidradenite supurativa'], [P.CLASSIFICATION], 'Estágio estrutural; não medida dinâmica de atividade inflamatória.');
add(['uas7'], ['Urticária'], [P.ACTIVITY,P.SYMPTOMS]);
add(['salt'], ['Alopecia areata'], [P.SEVERITY], 'Extensão da perda capilar no couro cabeludo, não impacto funcional ou psicossocial.');
add(['gags'], ['Acne'], [P.SEVERITY]);
add(['tvasi'], ['Vitiligo'], [P.SEVERITY], 'Índice de extensão ponderada pela despigmentação, sem classe automática de gravidade; preservar a delimitação corporal da versão.');
add(['scorten'], ['Síndrome de Stevens–Johnson e necrólise epidérmica tóxica'], [P.SEVERITY,P.PROGNOSIS], 'A ficha pontua gravidade sem apresentar probabilidades históricas como previsão individual atual.');
add(['prepare-pneumonia-mortality-2022'], ['Pneumonia'], [P.MORTALITY], 'Mortalidade hospitalar por pneumonia pediátrica em 2–59 meses; Tabela 3 de 2022 com SpO₂ e dez dados basais conhecidos. Pontuação e limiar histórico, sem probabilidade individual, diagnóstico ou conduta; recorte literal sem imputação, distinto de versões sem oximetria e WHO 2023 incompleta.');
add(['risc-malawi-muac-2016'], ['Pneumonia'], [P.MORTALITY], 'Prognóstico histórico de mortalidade na internação por pneumonia clínica em 2–59 meses, variante MUAC 2016. Pontuação e limiares históricos sem probabilidade individual; recorte literal completo, sem imputação e sem resolver bordas conflitantes. Não é diagnóstico ou risco pós-alta.');
add(['wpcdai-2012-literal'], ['Doença de Crohn'], [P.ACTIVITY], 'Crohn previamente estabelecido, avaliação pontual ponderada com rubrica/pesos NASPGHAN 2014 e cortes Turner 2012. Recorte literal local de 4–<18 anos sem imputação; lacunas de albumina/peso recusadas. Não é diagnóstico, cicatrização, resposta longitudinal ou substituto do PCDAI clássico.');
add(['pucai'], ['Retocolite ulcerativa'], [P.ACTIVITY]);
add(['das28-esr','das28-crp','cdai','sdai'], ['Artrite reumatoide'], [P.ACTIVITY]);
add(['asdas-crp','asdas-esr'], ['Espondiloartrite axial'], [P.ACTIVITY]);
add(['dapsa','cdapsa'], ['Artrite psoriásica'], [P.ACTIVITY]);
add(['acr-eular-ra2010'], ['Artrite reumatoide'], [P.CLASSIFICATION], 'Critérios de classificação com sinovite e critérios de entrada, não rastreio universal, atividade da doença ou diagnóstico automático.');
add(['amsel','nugent'], ['Vaginose bacteriana'], [P.AFTER_TESTS], 'Amsel requer exame vaginal/microscopia; Nugent depende da leitura de Gram.');
add(['bishop'], ['Gestação e parto'], [P.OBSTETRIC], 'Favorabilidade cervical antes de indução; contexto obstétrico, sem indicação automática de indução.');
add(['puqe24'], ['Náuseas e vômitos na gestação'], [P.SYMPTOMS], 'Carga nas últimas 24 h; não confirma hiperêmese.');
add(['apgar'], ['Adaptação neonatal'], [P.SEVERITY], 'Registro da adaptação após nascimento; não prediz função futura, diagnostica asfixia ou decide iniciar reanimação.');
add(['capurro-a','capurro-b'], ['Maturidade neonatal'], [P.MATURITY]);

import {novemberScores} from './november-catalog.mjs';
for (const score of novemberScores) add([score.id], score.conditions, score.purposes);

const seen = new Set();
for (const [id, item] of entries) {
  if (seen.has(id)) throw new Error(`Taxonomia: ID duplicado: ${id}`);
  seen.add(id);
  if (!item.conditions.length || !item.purposes.length) throw new Error(`Taxonomia incompleta: ${id}`);
  if (item.purposes.some(p => !Object.values(P).includes(p))) throw new Error(`Finalidade desconhecida: ${id}`);
}
export const CLINICAL_TAXONOMY = Object.freeze(Object.fromEntries(entries));
export const TAXONOMY_SCORE_IDS = Object.freeze([...seen].sort());
export const CONDITION_LABELS = Object.freeze(
  [...new Set(entries.flatMap(([, item]) => item.conditions))]
    .sort((a,b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
);
export const PURPOSE_LABELS = Object.freeze(
  [...new Set(entries.flatMap(([, item]) => item.purposes))]
    .sort((a,b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
);

/**
 * Acrescenta somente conditions e purposes, copiando arrays em cada score.
 * Aceita o catálogo ou qualquer subconjunto conhecido, preservando ordem e objetos.
 * Valida todo o lote antes de mutar: ID não revisado/duplicado falha explicitamente.
 */
export function applyClinicalTaxonomy(scores) {
  if (!Array.isArray(scores)) throw new TypeError('Taxonomia exige um array de escores.');
  const inputIds = new Set();
  const resolved = scores.map(score => {
    if (!score || typeof score.id !== 'string' || !Object.hasOwn(CLINICAL_TAXONOMY, score.id)) {
      throw new Error(`Taxonomia clínica sem revisão explícita para ID: ${score?.id ?? '(ausente)'}`);
    }
    if (inputIds.has(score.id)) throw new Error(`ID repetido no catálogo: ${score.id}`);
    inputIds.add(score.id);
    return CLINICAL_TAXONOMY[score.id];
  });
  scores.forEach((score, i) => {
    score.conditions = [...resolved[i].conditions];
    score.purposes = [...resolved[i].purposes];
  });
  return scores;
}
