// Documented indication × population × exact product contracts.
// Clinical declarations belong to the individual prescription, never to a global approval.
export const closureRegimens = [
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 6,
    "maxMonths": 216,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 12,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "levetiracetam-focal-adjunct-init",
    "medicationId": "med-268",
    "name": "Levetiracetam",
    "ingredient": "levetiracetam",
    "family": "antiepileptic",
    "maxWeight": 50,
    "title": "Epilepsia focal · início adjuvante, ≥6 meses e<50 kg",
    "diagnoses": [
      "epilepsia focal",
      "epilepsia parcial",
      "epilepsia focal - inicio adjuvante com levetiracetam"
    ],
    "dose": 10,
    "maxDose": 500,
    "maxDay": 1000,
    "maxKgDay": 20,
    "duration": "uso contínuo; reavaliar em 2 semanas, sem suspender por conta própria",
    "presentations": [
      {
        "label": "Antara solução oral 100 mg/mL — frasco 150 mL",
        "amount": 100,
        "volume": 1
      }
    ],
    "conditions": "Início de terapia adjuvante para epilepsia focal previamente diagnosticada, após definição do plano do especialista; não é monoterapia pediátrica, tratamento de primeira crise isolada ou estado de mal. Outros anticonvulsivantes do plano não devem ser retirados automaticamente.",
    "instructions": "Medir com seringa oral; não trocar por liberação prolongada nem injetável. Não dobrar dose esquecida. Se em uso de macrogol, separar por 1 hora antes/depois. Rever humor, agressividade, sono e controle das crises; piora importante exige avaliação. Retirada precisa ser gradual.",
    "contraindications": "Alergia ao levetiracetam/piracetam/derivados pirrolidona. Disfunção renal ou hepatopatia grave requer outro plano. Alteração de comportamento relevante/ideação suicida requer avaliação imediata.",
    "allergyTerms": [
      "piracetam",
      "pirrolidona"
    ],
    "avoidTerms": [
      "estado de mal",
      "primeira crise",
      "ideacao suicida",
      "autoagressao",
      "agressividade grave",
      "dialise",
      "metotrexato"
    ],
    "offLabel": "Dose e apresentação da bula brasileira Antara. Este ramo limita-se à dose inicial 20 mg/kg/dia; não automatiza a titulação da bula até 60 mg/kg/dia. ≥50 kg, menores de 6 meses, ajuste renal e outras indicações ficam fora do escopo. Revisão 2 semanas coincide com intervalo mínimo de ajustes.",
    "sources": [
      "https://eurofarma.com.br/produtos/bulas/healthcare/pt/bula-antara-solucao.pdf"
    ],
    "maxWeightExclusive": true,
    "requiredClinicalChecks": [
      {
        "id": "levetiracetam-focal-adjunct-init:1",
        "label": "Confirmei epilepsia focal e plano de início ADJUVANTE definido pelo especialista; este esquema não atende crise aguda nem monoterapia pediátrica."
      },
      {
        "id": "levetiracetam-focal-adjunct-init:2",
        "label": "Avaliei função renal, alergias, comportamento e interações; os dados atuais permitem este esquema sem ajuste."
      },
      {
        "id": "levetiracetam-focal-adjunct-init:3",
        "label": "Combinei seguimento em duas semanas e informei que não se deve aumentar, retirar ou trocar o anticonvulsivante por conta própria."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 72,
    "maxMonths": 179.999,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 24,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "furosemide-cardiac-edema-oral",
    "medicationId": "med-212",
    "name": "Furosemida",
    "ingredient": "furosemida",
    "family": "loop-diuretic",
    "minWeight": 20,
    "dose": 2,
    "maxDose": 40,
    "maxDay": 40,
    "maxKgDay": 2,
    "requiresMeasurableQuantity": true,
    "title": "Edema cardíaco estável · furosemida oral, ≥6 anos/20 kg",
    "diagnoses": [
      "edema de origem cardiaca",
      "edema de origem cardiaca estavel"
    ],
    "duration": "duração e reavaliação conforme plano individual definido na consulta, com peso, diurese, pressão, eletrólitos e creatinina",
    "presentations": [
      {
        "label": "Furosemida Aché/Biosintética comprimido 40 mg — inteiro",
        "amount": 40,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Edema cardíaco documentado, paciente estável, tolerando via oral, com dose/plano de monitoramento determinados. Excluir desidratação, anúria, distúrbiosNa/K e descompensação respiratória. Não é tratamento de edema pulmonar agudo, crisehipertensiva ou esquema IV.",
    "instructions": "Ingerir comprimido inteiro com água, estômago vazio, pela manhã. Não preparar suspensão caseira nem trocar por injetável. Acompanhar peso, urina, tontura e sede; redução de urina,desmaio,piora respiratória ou arritmia exigem avaliação.",
    "contraindications": "Alergia furosemida/sulfonamidas, anúria, encefalopatiahepática, hipocalemia/hiponatremia importantes, hipovolemia/desidratação. Rever eletrólitos e função renal/hepática, anti-hipertensivos/AINEs/ototóxicos/digoxina/lítio.",
    "allergyTerms": [
      "sulfonamida"
    ],
    "avoidTerms": [
      "anuria",
      "desidratacao",
      "hipovolemia",
      "hipocalemia",
      "hiponatremia",
      "edema pulmonar agudo",
      "hipotensao",
      "crise hipertensiva",
      "insuficiencia cardiaca descompensada",
      "encefalopatia hepatica",
      "litio",
      "gentamicina",
      "amicacina",
      "cisplatina",
      "digoxina",
      "ibuprofeno",
      "naproxeno",
      "captopril",
      "enalapril",
      "losartana",
      "gestante",
      "gravidez",
      "amamentacao",
      "ma absorcao de glicose",
      "galactose",
      "ciclosporina",
      "carbamazepina",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Dose 2 mg/kg/dia e máximo 40 mg/dia da bula brasileira. Escopo ≥6 anos/20 kg e comprimido inteiro foi limitado operacionalmente; não representa contraindicação em criançasmenores. O seguimento deve estar definido no plano individual da consulta; este ramo não fixa intervalo numérico de revisão da bula. Não inferir partição apenas pelo vinco. Precisa de monitoramento clínico/laboratorial registrado.",
    "sources": [
      "https://www.ache.com.br/wp-content/uploads/application/pdf/BU-FUROSEMIDA.pdf"
    ],
    "requiredClinicalChecks": [
      {
        "id": "furosemide-cardiac-edema-oral:1",
        "label": "Confirmei edema cardíaco estável, indicação de diurético e capacidade de ingerir o comprimido inteiro de 40 mg."
      },
      {
        "id": "furosemide-cardiac-edema-oral:2",
        "label": "Avaliei pressão, hidratação, diurese, sódio, potássio e creatinina; excluí contraindicações e interações pertinentes."
      },
      {
        "id": "furosemide-cardiac-edema-oral:3",
        "label": "Defini controle de peso/diurese e reavaliação clínica e laboratorial conforme plano individual definido na consulta."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 12,
    "maxMonths": 216,
    "basis": "fixed",
    "unit": "mcg",
    "interval": 24,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "levothyroxine-chronic-acquired-init",
    "medicationId": "med-275",
    "name": "Levotiroxina",
    "ingredient": "levotiroxina",
    "family": "thyroid-hormone",
    "dose": 25,
    "maxDose": 25,
    "maxDay": 25,
    "title": "Hipotireoidismo adquirido crônico · início cauteloso 25 mcg/dia",
    "diagnoses": [
      "hipotireoidismo adquirido",
      "hipotireoidismo adquirido cronico",
      "hipotireoidismo adquirido cronico - inicio cauteloso"
    ],
    "duration": "uso contínuo; revisar TSH/T 4 livre e clínica em 2 semanas antes de ajustar",
    "presentations": [
      {
        "label": "Synthroid comprimido 25 microgramas — inteiro",
        "amount": 25,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Hipotireoidismo adquirido crônico confirmado em criança≥1 ano, plano inicial conservador definido e função adrenal previamente avaliada. Não aplicar em neonatal/congênito, supressão de TSH, obesidade,eutireoidismo,hipotireoidismo central ou dose de manutenção já estabilizada.",
    "instructions": "Tomar comprimido inteiro 30–60 min antes do café. Se não consegue deglutir, triturar INTEIRO em 5–10 mL de água e ingerir toda a preparação imediatamente; não estocar ou fracionar líquido. Separar 4 h de ferro/cálcio/antiácidos. Não mudar marca sem reavaliação. Palpitações ou tremores exigem revisão.",
    "contraindications": "Tireotoxicose/hipertireoidismo não tratados, infartoagudo, insuficiência adrenal não corrigida, alergia/excipientes. Rever doença cardíaca, hipofisária, diabetes,biotina e interações. Janela terapêutica estreita exige laboratório e acompanhamento.",
    "avoidTerms": [
      "hipertireoidismo",
      "tireotoxicose",
      "insuficiencia adrenal",
      "hipofis",
      "hipotireoidismo congenito",
      "infarto",
      "insuficiencia cardiaca",
      "arritmia",
      "obesidade",
      "emagrecer",
      "biotina",
      "amiodarona",
      "varfarina",
      "digoxina",
      "carbamazepina",
      "fenobarbital",
      "rifampicina",
      "ritonavir",
      "sertralina"
    ],
    "offLabel": "Bula fabricante prevê 25 mcg/dia para início em crianças com hipotireoidismo crônico/grave e revisão 2–4 semanas. Este ramo aplica somentecrônico adquirido≥1 ano; não afirma dose universal de reposição ou teto máximo da molécula. UnidadeMCG;25 mcg=0,025 mg. A página abertaBU 18/29-03-2023 não comprova latestregulatory. Não substitui determinação individual da manutenção. A primeira revisão deste ramo foi fixada em 2 semanas, dentro da janela documental de 2–4 semanas; a revisão não é uma data automática de suspensão.",
    "sources": [
      "https://www.abbottbrasil.com.br/nossas-bulas/synthroid.html"
    ],
    "requiredClinicalChecks": [
      {
        "id": "levothyroxine-chronic-acquired-init:1",
        "label": "Confirmei hipotireoidismo adquirido crônico e indicação de início cauteloso de 25 microgramas/dia; este esquema não atende hipotireoidismo congênito/neonatal."
      },
      {
        "id": "levothyroxine-chronic-acquired-init:2",
        "label": "Avaliei TSH, T4 livre, função adrenal, condição cardíaca e interações; não há insuficiência adrenal não corrigida."
      },
      {
        "id": "levothyroxine-chronic-acquired-init:3",
        "label": "Defini revisão clínica e de TSH/T4 livre em 2–4 semanas, antes de qualquer ajuste."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 72,
    "maxMonths": 216,
    "basis": "fixed",
    "unit": "mg",
    "interval": 24,
    "renalAdjustment": false,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "amlodipine-hypertension-init",
    "medicationId": "med-34",
    "name": "Anlodipino",
    "ingredient": "anlodipino",
    "family": "calcium-channel-blocker",
    "dose": 2.5,
    "maxDose": 2.5,
    "maxDay": 2.5,
    "title": "Hipertensão arterial pediátrica · início 2,5 mg/dia,6–17 anos",
    "diagnoses": [
      "hipertensao arterial pediatrica",
      "hipertensao arterial",
      "hipertensao arterial pediatrica confirmada - inicio ambulatorial"
    ],
    "duration": "uso contínuo; reavaliar pressão/clínica em 2 semanas antes de ajustar",
    "presentations": [
      {
        "label": "Cordarex comprimido 2,5 mg de anlodipino base — inteiro",
        "amount": 2.5,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Hipertensão confirmada/investigada, estágio/etiologia e indicação de farmacoterapia definidos, paciente estável. Não usar para emergênciahipertensiva. Monoterapia inicial em baixa dose; revisão 2–4 semanas.",
    "instructions": "Ingerir comprimido inteiro diariamente, com água, com ou sem alimento. Não dividir comprimido 5 mg para fabricar 2,5 mg e não trocar por levanlodipino/associações. Não dobrar dose esquecida. Rever tontura,edema e controle de pressão.",
    "contraindications": "Alergia anlodipino/dihidropiridinas. Rever hipotensão,obstrução saída ventricular,insuficiência cardíaca,doençahepática e interaçõesCYP 3 A 4/transplante.",
    "allergyTerms": [
      "dihidropiridina"
    ],
    "avoidTerms": [
      "hipotensao",
      "choque",
      "emergencia hipertensiva",
      "crise hipertensiva",
      "estenose aortica",
      "insuficiencia cardiaca",
      "claritromicina",
      "eritromicina",
      "itraconazol",
      "cetoconazol",
      "ritonavir",
      "diltiazem",
      "rifampicina",
      "erva de sao joao",
      "ciclosporina",
      "tacrolimo",
      "sirolimo",
      "everolimo",
      "sinvastatina",
      "gestante",
      "gravidez",
      "amamentacao",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Uso pediátrico é fora da bula brasileira Cordarex, que afirma eficácia/segurança não estabelecidas em crianças. Dose 2,5–5 mg/dia em 6–17 anos é documentação PfizerUS; DBHA 2025 apoiaCCB longo e início dosebaixa/revisão 2–4 semanas. Somentedose inicial 2,5 mg é proposta, não aumentar automaticamente até 10 mg (teto adulto brasileiro). Requer decisãoofflabel registrada. A primeira revisão deste ramo foi fixada em 2 semanas, dentro da janela documental de 2–4 semanas; a revisão não é uma data automática de suspensão.",
    "sources": [
      "https://www.ache.com.br/wp-content/uploads/Cordarex-25-mg_BU03_VPS_374-1.pdf",
      "https://labeling.pfizer.com/ShowLabeling.aspx?id=562",
      "https://www.scielo.br/j/abc/a/BXT7Vk4B9VKQnJFsJhgJ4Hn/?format=html&lang=pt&ilang=en"
    ],
    "requiredClinicalChecks": [
      {
        "id": "amlodipine-hypertension-init:1",
        "label": "Confirmei hipertensão pediátrica, investigação, indicação de farmacoterapia e estabilidade para início ambulatorial."
      },
      {
        "id": "amlodipine-hypertension-init:2",
        "label": "Avaliei função hepática, condição cardíaca, pressão e interações; não há emergência hipertensiva ou hipotensão."
      },
      {
        "id": "amlodipine-hypertension-init:3",
        "label": "Registrei a decisão de uso pediátrico fora da bula brasileira, informei o responsável e combinei revisão em 2–4 semanas."
      }
    ],
    "patientContextScope": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "requiresReason": true,
    "group": "etiologic",
    "id": "silver-sulfadiazine-selected-burn",
    "medicationId": "med-405",
    "name": "Sulfadiazina de prata dermatológica",
    "ingredient": "sulfadiazina de prata",
    "family": "topical-antimicrobial",
    "route": "TÓPICO",
    "minMonths": 2,
    "minExclusive": true,
    "maxMonths": 216,
    "delivery": "topical",
    "observedOnly": true,
    "exactDiagnosis": true,
    "diagnoses": [
      "queimadura de segundo grau",
      "queimadura de espessura parcial",
      "queimadura de segundo grau com indicacao individual de antimicrobiano topico"
    ],
    "presentations": [
      {
        "label": "Dermazine — creme DERMATOLÓGICO 10 mg/g (1%); sem nitrato de cério"
      }
    ],
    "directions": "Após limpeza da lesão, aplicar uma camada no local selecionado uma vez ao dia e cobrir com gaze",
    "duration": "até cicatrizar, com revisão assistencial do curativo e da indicação a cada atendimento",
    "conditions": "Ferida/queimadura avaliada pela equipe, alto potencial de infecção e opção tópica selecionada; não é cuidado automático de toda queimadura ou eczema. Este ramo oferece uma aplicação diária; maior exsudação exige nova avaliação. Não substituir por produto vaginal ou associação com cério.",
    "instructions": "Evitar olhos; manipular sem contaminar o recipiente. Suspender e avaliar se alergia, febre, piora ou aumento da área.",
    "contraindications": "Sulfas ou excipientes; prematuridade; idade ≤2 meses neste ramo. Área extensa, G 6 PD, disfunção renal/hepática, gestação/lactação exigem plano específico.",
    "allergyTerms": [
      "sulfa",
      "sulfadiazina",
      "parabeno"
    ],
    "avoidTerms": [
      "prematuro",
      "prematuridade",
      "g6pd",
      "grande queimado",
      "queimadura extensa",
      "insuficiencia renal",
      "doenca renal",
      "insuficiencia hepatica",
      "gestacao",
      "gravida",
      "amamentacao",
      "lactacao",
      "cimetidina",
      "colagenase",
      "desbridante enzimatico",
      "gestante",
      "lactante",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Apresentação, frequência e duração da bula Cristália. Restrição ao ambiente assistencial e >2 meses são limites operacionais conservadores. Não há dose em mg/kg ou mg/mL: aplicação tópica por área selecionada.",
    "sources": [
      "https://www.cristalia.com.br/produto/407/bula-profissional",
      "https://www.gov.br/anvisa/pt-br/assuntos/farmacopeia/formulario-nacional/arquivos/8065json-file-1"
    ],
    "requiredClinicalChecks": [
      {
        "id": "silver-sulfadiazine-selected-burn:1",
        "label": "Avaliei área, profundidade e potencial de infecção da queimadura; a equipe definiu indicação individual de sulfadiazina de prata dermatológica."
      },
      {
        "id": "silver-sulfadiazine-selected-burn:2",
        "label": "Excluí prematuridade, alergia a sulfas, deficiência de G6PD e situações renais/hepáticas ou de grande área que exigem outro plano."
      },
      {
        "id": "silver-sulfadiazine-selected-burn:3",
        "label": "Defini local, curativo e revisão assistencial; o esquema não será usado como cuidado de rotina de toda queimadura."
      }
    ],
    "unit": "mg",
    "patientContextScope": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "requiresReason": true,
    "group": "etiologic",
    "id": "benznidazole-chagas-pediatric-12-5-small",
    "medicationId": "med-57",
    "name": "Benznidazol pediátrico",
    "ingredient": "benznidazol",
    "family": "antiparasitic",
    "route": "ORAL",
    "minMonths": 0,
    "maxMonths": 144,
    "maxMonthsExclusive": true,
    "minWeight": 2.5,
    "maxWeight": 10,
    "maxWeightExclusive": true,
    "basis": "fixed",
    "unit": "mg",
    "dose": 12.5,
    "interval": 12,
    "maxDose": 12.5,
    "maxDay": 25,
    "doseBands": [
      {
        "minWeight": 5,
        "maxWeight": 10,
        "dose": 25,
        "maxDose": 25,
        "maxDay": 50
      },
      {
        "minWeight": 2.5,
        "maxWeight": 5,
        "dose": 12.5,
        "maxDose": 12.5,
        "maxDay": 25
      }
    ],
    "exactDiagnosis": true,
    "diagnoses": [
      "doenca de chagas congenita confirmada",
      "doenca de chagas aguda confirmada"
    ],
    "presentations": [
      {
        "label": "LAFEPE BENZNIDAZOL pediátrico 12,5 mg — comprimido(s) inteiro(s)",
        "amount": 12.5,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "duration": "por 60 dias, com acompanhamento clínico e hemograma durante o curso",
    "conditions": "Infecção por T. cruzi confirmada, menor de 12 anos, 2,5 a <10 kg; tratamento etiológico escolhido e acompanhado. As bandas de bula fornecem 5–10 mg/kg/DIA. Não usar comprimido adulto de 100 mg ou dose fixa de 12,5 mg para todos os pesos.",
    "instructions": "Desintegrar a dose de comprimidos inteiros em 5–10 mL de água potável ou suco de laranja no copo e administrar todo o conteúdo imediatamente. Enxaguar o copo com igual volume e ingerir. Não armazenar nem retirar fração desse líquido como suspensão em mg/mL.",
    "contraindications": "Alergia/excipientes; alterações hematológicas, renais/hepáticas ou neurológicas exigem outro plano. Evitar álcool; rever aspirina/varfarina.",
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "avoidTerms": [
      "alteracao hematologica",
      "pancitopenia",
      "neutropenia",
      "neuropatia",
      "convuls",
      "epilepsia",
      "alcool",
      "etanol",
      "aspirina",
      "aas",
      "varfarina",
      "gestacao",
      "gravida",
      "amamentacao",
      "lactacao",
      "gestante",
      "lactante",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Bandas de peso e comprimido pediátrico da bula LAFEPE, com 60 dias do PCDT. Peso ≥10 kg não é automatizado neste candidato por erros documentais no terceiro intervalo; não é contraindicação clínica do fármaco.",
    "sources": [
      "https://www.lafepe.pe.gov.br/wp-content/uploads/2018/08/benznidazol_bula_profissional_bilingue.pdf",
      "https://www.gov.br/saude/pt-br/assuntos/pcdt/d/doenca-de-chagas"
    ],
    "requiredClinicalChecks": [
      {
        "id": "benznidazole-chagas-pediatric-12-5-small:1",
        "label": "Confirmei doença de Chagas congênita/aguda e plano etiológico para este paciente, com peso atual de 2,5 a menos de 10 kg."
      },
      {
        "id": "benznidazole-chagas-pediatric-12-5-small:2",
        "label": "Avaliei hemograma, funções renal/hepática, condição neurológica, alergias e interações; defini acompanhamento durante os 60 dias."
      },
      {
        "id": "benznidazole-chagas-pediatric-12-5-small:3",
        "label": "Conferi a apresentação pediátrica LAFEPE de 12,5 mg e a administração de TODO o preparo de comprimidos inteiros, sem fracionar o líquido."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "requiresReason": true,
    "group": "etiologic",
    "id": "cephalothin-cellulitis-selected-iv",
    "medicationId": "med-95",
    "name": "Cefalotina IV",
    "ingredient": "cefalotina",
    "family": "beta-lactam",
    "route": "HOSPITALAR — IV",
    "observedOnly": true,
    "minMonths": 3,
    "minExclusive": true,
    "maxMonths": 144,
    "maxWeight": 50,
    "basis": "kg-dose",
    "unit": "mg",
    "dose": 25,
    "interval": 6,
    "maxDose": 2000,
    "maxDay": 8000,
    "renalAdjustment": true,
    "nonSevereOnly": true,
    "exactDiagnosis": true,
    "diagnoses": [
      "celulite bacteriana",
      "celulite bacteriana moderada",
      "celulite bacteriana moderada sem suspeita de mrsa com indicacao de cefalotina iv"
    ],
    "presentations": [
      {
        "label": "Cefalotina Blau IV 1 g — concentração APROXIMADA declarada 175 mg/mL",
        "amount": 175,
        "volume": 1,
        "step": 0.1,
        "vialAmount": 1000,
        "preparation": "Reconstituir cada frasco Blau 1 g com 5 mL de água para injetáveis. Bula: volume final aproximado 5,7 mL, concentração aproximada 175 mg/mL; usar a concentração declarada, não 1000/5."
      }
    ],
    "infusion": {
      "concentration": 9.5,
      "minutes": 30,
      "step": 0.1,
      "diluent": "solução de cloreto de sódio 0,9%"
    },
    "duration": "fase IV com revisão diária e transição oral ao melhorar; total de 5–10 dias segundo evolução e controle do foco",
    "conditions": "Celulite bacteriana moderada que requer IV, opção cefalotina selecionada entre alternativas para germes sensíveis. Não é troca automática da cefazolina e não cobre MRSA, infecção necrosante, mordeduras/água ou foco profundo.",
    "instructions": "Usar preparo recém-feito e separado de outros medicamentos, sobretudo aminoglicosídeos. Vigiar alergia, flebite, diarreia e função renal. Drenar coleção quando presente.",
    "contraindications": "Betalactâmicos/penicilamina; prematuridade; disfunção renal ou restrição hídrica exige novo preparo/plano.",
    "allergyTerms": [
      "penicilamina"
    ],
    "avoidTerms": [
      "prematuro",
      "prematuridade",
      "restricao hidrica",
      "mrsa",
      "necrosante",
      "necrose",
      "sepse",
      "choque",
      "mordida",
      "mordedura",
      "agua doce",
      "agua do mar",
      "endocardite",
      "meningite",
      "imunossupressao",
      "probenecida"
    ],
    "offLabel": "25 mg/kg a cada 6 h está na faixa pediátrica de bula 20–40 mg/kg/dose. Teto operacional 2 g/dose/8 g/dia é inferior ao máximo adulto 12 g/dia; com limite de peso 50 kg não atua sobre a dose de 25 mg/kg. 9,5 mg/mL/30 min é preparo de infusão declarado pelo fabricante. Duração e revisão usam RCH, sem afirmar que RCH elege cefalotina. O preparo do frasco inteiro descrito na bula permanece para consulta. Retirada de alíquota e diluição proporcional pediátrica não são automatizadas neste ramo: precisam de contrato institucional verificável e dupla conferência humana antes da administração.",
    "sources": [
      "https://www.blau.com/media/leaflet/9078ed15-59e2-48e9-ba40-42728fc45401-4c1966fb-f71d-4ffd-a03d-b466e7727b5b/2.2_Bu_SD3JnnC.pdf",
      "https://www.rch.org.au/clinicalguide/guideline_index/Cellulitis_and_Skin_Infections/"
    ],
    "maxMonthsExclusive": true,
    "requiredClinicalChecks": [
      {
        "id": "cephalothin-cellulitis-selected-iv:1",
        "label": "A equipe selecionou cefalotina IV para celulite moderada por germes sensíveis, sem suspeita de MRSA, foco profundo ou infecção necrosante."
      },
      {
        "id": "cephalothin-cellulitis-selected-iv:2",
        "label": "Avaliei função renal e balanço hídrico; qualquer preparo deve seguir o plano do serviço assistencial para este paciente."
      },
      {
        "id": "cephalothin-cellulitis-selected-iv:3",
        "label": "Conferi o preparo do frasco inteiro descrito na bula, com concentração aproximada de 175 mg/mL após reconstituição e infusão a aproximadamente 9,5 mg/mL durante 30 minutos; alíquota pediátrica não é automatizada e exige contrato institucional verificável e dupla conferência humana antes da administração."
      },
      {
        "id": "cephalothin-cellulitis-selected-iv:4",
        "label": "Defini revisão diária, controle do foco e transição oral conforme resposta; o curso total de 5–10 dias será individualizado."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "durationOptions": [
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 5 dias, incluindo a fase oral",
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 6 dias, incluindo a fase oral",
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 7 dias, incluindo a fase oral",
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 8 dias, incluindo a fase oral",
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 9 dias, incluindo a fase oral",
      "fase IV até melhora e transição oral, com revisão diária; tratamento total de 10 dias, incluindo a fase oral"
    ],
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "A bula sustenta o preparo do frasco inteiro, mas este fluxo calculava automaticamente alíquota e diluição proporcional pediátrica sem contrato institucional verificável. Emissão prescritiva e cálculo automático de mL/infusão bloqueados; preparo original permanece consultivo. Reabrir somente com contrato institucional específico validado, apresentação/concentração conferidas e dupla conferência humana na administração real."
  },
  {
    "id": "benzydamine-lozenge-3",
    "ingredient": "benzidamina",
    "salt": "cloridrato de benzidamina",
    "basis": "fixed",
    "dose": 3,
    "interval": 12,
    "maxDose": 3,
    "maxDay": 6,
    "labelMaxDay": 30,
    "labelMaxUnitsDay": 10,
    "minMonths": 72,
    "minExclusive": true,
    "route": "BUCAL — PASTILHA",
    "family": "local-oropharyngeal-analgesic",
    "group": "adjunct",
    "requiresReason": true,
    "nonSevereOnly": true,
    "diagnoses": [
      "faringite viral",
      "dor de garganta",
      "aftas",
      "estomatite aftosa"
    ],
    "presentations": [
      {
        "label": "Flogoral menta — pastilha dura com 3 mg de cloridrato de benzidamina (equivale a 2,7 mg da base)",
        "amount": 3,
        "quantityUnit": "pastilha(s)",
        "step": 1
      }
    ],
    "duration": "somente enquanto houver dor, por no máximo 7 dias; reavaliar antes se persistir ou piorar",
    "directions": "Dissolver uma pastilha na boca duas vezes ao dia (cerca de 12/12 horas); não partir, mastigar nem engolir inteira. Suspender quando a dor cessar.",
    "contraindications": "Alergia à benzidamina/excipientes, suspeita de dengue ou úlcera. Doença renal, queixas gástricas, diabetes, disfagia, risco de engasgo, gestação ou lactação exigem avaliação específica. Contém açúcares e corantes. Contraindicado na síndrome de má-absorção de glicose-galactose e na insuficiência de sacarose-isomaltase.",
    "avoidTerms": [
      "dengue",
      "ulcera",
      "doenca renal",
      "insuficiencia renal",
      "disfagia",
      "engasgo",
      "doenca gastrica",
      "ma absorcao de glicose",
      "insuficiencia de sacarose",
      "gestacao",
      "gravidez",
      "amamentacao",
      "galactose",
      "sacarase",
      "sacarose-isomaltase",
      "sacarose isomaltase",
      "gestante",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "allergyTerms": [
      "benzidamina",
      "flogoral",
      "quinolina",
      "azul brilhante",
      "sacarose",
      "glicose"
    ],
    "instructions": "Dissolver uma pastilha na boca, sem partir, mastigar ou engolir inteira. Alívio local não substitui o tratamento da causa. Falta de ar, dificuldade para engolir líquidos/saliva, voz abafada, edema cervical ou piora rápida exigem avaliação imediata.",
    "offLabel": "Dose mínima de duas pastilhas/dia escolhida dentro da bula: uma a cada 12 horas, total de 6 mg do cloridrato/dia. O limite de 10 pastilhas/dia da bula não autoriza escalonamento automático. Limite operacional acima de 6 anos e curso de até 7 dias. Não intercambiar com gotas, spray ou bochecho.",
    "medicationId": "med-53",
    "name": "Cloridrato de benzidamina — pastilha",
    "title": "Dor orofaríngea · Flogoral 3 mg, acima de 6 anos",
    "sources": [
      "https://www.ache.com.br/wp-content/uploads/Flogoral-pastilha-BU11_VPS_768-4.pdf"
    ],
    "maxMonths": 216,
    "renalAdjustment": true,
    "hepaticAdjustment": false,
    "conditions": "Dor/inflamação orofaríngea avaliada, sem gravidade. Adjuvante local opcional em paciente acima de 6 anos capaz de dissolver a pastilha com segurança.",
    "requiredClinicalChecks": [
      {
        "id": "benzydamine-lozenge-3:1",
        "label": "Confirmei dor/inflamação local e capacidade de dissolver a pastilha sem engasgo, em paciente acima de 6 anos."
      },
      {
        "id": "benzydamine-lozenge-3:2",
        "label": "Excluí contraindicações, sinais de gravidade e necessidade de tratamento específico da causa; escolhi este adjuvante local."
      }
    ],
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "unit": "mg",
    "exactDiagnosis": true,
    "patientContextScope": true,
    "requiresNormalRenal": true
  },
  {
    "id": "benzyl-benzoate-nativita-scabies",
    "ingredient": "benzoato de benzila",
    "family": "scabicide",
    "group": "adjunct",
    "route": "TÓPICO — USO EXTERNO",
    "delivery": "topical",
    "minMonths": 24,
    "minExclusive": true,
    "maxMonths": 216,
    "maxMonthsExclusive": true,
    "nonSevereOnly": true,
    "requiresReason": true,
    "exactDiagnosis": true,
    "diagnoses": [
      "escabiose",
      "escabiose localizada"
    ],
    "presentations": [
      {
        "label": "Benzoato de benzila Nativita — emulsão 250 mg/mL; diluir 1 parte do produto em 2 partes de água"
      }
    ],
    "directions": "Após prova de toque sem irritação, agitar e misturar 1 parte do produto com 2 partes de água. À noite, após banho sem água quente, aplicar na pele ainda úmida do pescoço para baixo. Deixar secar e aplicar a segunda camada na mesma sessão; não enxugar. Retirar no banho da manhã seguinte e trocar roupas do corpo e da cama",
    "duration": "uma sessão noturna; repetir após 24 horas somente se necessário, por até duas sessões neste ramo, e reavaliar",
    "contraindications": "Alergia aos componentes, lesões/feridas na pele ou irritação na prova de toque. Gestação, lactação, escabiose crostosa, infectada ou extensa exigem outro plano. Não ingerir.",
    "avoidTerms": [
      "ferida aberta",
      "queimadura",
      "pele lesionada",
      "escabiose crostosa",
      "escabiose norueguesa",
      "infeccao de pele",
      "lesao no couro cabeludo",
      "lesao na face",
      "gestacao",
      "amamentacao",
      "acido salicilico",
      "hidroquinona",
      "ferida",
      "escoriacao",
      "pele ferida",
      "lesao aberta",
      "gestante",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "instructions": "Uso exclusivamente externo. Não aplicar em rosto, olhos, mucosas, feridas ou queimaduras. Tratar os contatos conforme orientação e higienizar roupas/lençóis. Suspender se houver ardor ou vermelhidão. Duas camadas constituem uma única sessão; no máximo uma sessão por 24 horas.",
    "offLabel": "Diluição de 1 parte de Nativita 250 mg/mL com 2 partes de água consta na bula para maiores de 2 anos: concentração final aproximada 83,33 mg/mL. Não transferir a diluição para Benzoderm. Duas sessões é o limite operacional deste curso, não teto universal do princípio ativo.",
    "medicationId": "med-58",
    "name": "Benzoato de benzila",
    "title": "Escabiose corporal · Nativita diluído, acima de 2 anos",
    "sources": [
      "https://bula.nativita.ind.br/index.php?p=benzoato_de_benzila",
      "https://pharmascience.com.br/produto/remedio-para-piolhos-benzoderm/"
    ],
    "renalAdjustment": false,
    "hepaticAdjustment": false,
    "conditions": "Escabiose corporal avaliada em paciente acima de 2 anos, com pele íntegra. Alternativa selecionada quando opção menos irritante for inadequada. Não atende escabiose crostosa, infectada, extensa, de face ou couro cabeludo.",
    "requiredClinicalChecks": [
      {
        "id": "benzyl-benzoate-nativita-scabies:1",
        "label": "Confirmei escabiose corporal, pele sem feridas e adequação desta alternativa em paciente acima de 2 anos."
      },
      {
        "id": "benzyl-benzoate-nativita-scabies:2",
        "label": "Conferi o produto Nativita 250 mg/mL, a diluição de uma parte mais duas partes de água e o plano de tratamento dos contatos."
      }
    ],
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "unit": "mg",
    "patientContextScope": true
  },
  {
    "id": "collagenase-necrotic-wound",
    "ingredient": "colagenase",
    "family": "enzymatic-debridement",
    "group": "adjunct",
    "route": "TÓPICO — POMADA",
    "delivery": "topical",
    "requiresReason": true,
    "nonSevereOnly": true,
    "exactDiagnosis": true,
    "diagnoses": [
      "ferida superficial com tecido necrotico",
      "desbridamento enzimatico de ferida"
    ],
    "presentations": [
      {
        "label": "Kollagenase — pomada dermatológica com colagenase 0,6 U/g, sem cloranfenicol"
      }
    ],
    "directions": "Limpar com soro fisiológico estéril. Aplicar uma camada uniforme de aproximadamente 2 mm somente na área superficial com tecido desvitalizado, uma vez ao dia. Cobrir com gaze mantendo a umidade e proteger as bordas conforme o plano profissional",
    "duration": "até remover a necrose e estabelecer tecido de granulação; reavaliação conforme plano individual definido na consulta; suspender e reavaliar se não melhorar em 14 dias",
    "contraindications": "Alergia aos componentes. Evitar olhos e mucosas. Gangrena, isquemia, diabetes, ferida profunda/extensa/infectada ou queimadura grave ficam fora deste esquema.",
    "avoidTerms": [
      "gangrena seca",
      "gangrena umida",
      "diabetes",
      "isquemia",
      "insuficiencia arterial",
      "ferida profunda",
      "fasceite",
      "infeccao de ferida",
      "celulite",
      "queimadura extensa",
      "queimadura profunda",
      "metal pesado",
      "prata",
      "iodo",
      "detergente",
      "hexaclorofeno",
      "tirotricina",
      "gramicidina",
      "tetraciclina topica"
    ],
    "instructions": "Seguir o plano de curativo. Cortes ou desbridamento com instrumentos devem ser feitos por profissional. Evitar antissépticos, metais pesados, detergentes e sabões que inativam a enzima. Febre, pus, mau odor, dor forte ou vermelhidão progressiva exigem retorno antecipado.",
    "offLabel": "Bula brasileira de uso adulto e pediátrico. 0,6 U/g exprime atividade enzimática, sem conversão para mg/g ou mg/kg. Camada de cerca de 2 mm uma vez/dia e suspensão se falha em 14 dias constam na bula; a reavaliação segue o plano individual definido na consulta, sem intervalo numérico universal neste ramo. Não intercambiar com colagenase injetável ou associação com cloranfenicol.",
    "medicationId": "med-136",
    "name": "Colagenase dermatológica",
    "title": "Ferida superficial necrótica · colagenase 0,6 U/g",
    "sources": [
      "https://www.cristalia.com.br/produto/113/bula-profissional"
    ],
    "maxMonths": 216,
    "renalAdjustment": false,
    "hepaticAdjustment": false,
    "conditions": "Ferida superficial com necrose examinada e indicação de desbridamento enzimático definida por profissional. Não usar em ferida limpa ou pele íntegra. Isquemia, gangrena, infecção, diabetes, lesão extensa/profunda ou queimadura grave exigem plano especializado.",
    "requiredClinicalChecks": [
      {
        "id": "collagenase-necrotic-wound:1",
        "label": "Examinei a ferida e confirmei tecido necrótico superficial com indicação de desbridamento enzimático."
      },
      {
        "id": "collagenase-necrotic-wound:2",
        "label": "Defini área e plano de curativo, excluí lesão isquêmica/profunda/infectada e verifiquei produtos locais incompatíveis."
      }
    ],
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "minMonths": 0,
    "unit": "U",
    "patientContextScope": true,
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  },
  {
    "contraindications": "Alergia ao princípio ou AINEs/broncoespasmo; úlcera ou sangramento gastrointestinal; desidratação/lesão renal; doença hepática, renal ou cardíaca significativa; suspeita de dengue; gestação/lactação fora deste ramo. Não somar outro AINE.",
    "avoidTerms": [
      "dengue",
      "desidratacao",
      "sangramento",
      "ulcera",
      "doenca renal",
      "insuficiencia renal",
      "doenca hepatica",
      "insuficiencia hepatica",
      "insuficiencia cardiaca",
      "gestacao",
      "gravidez",
      "amamentacao",
      "varfarina",
      "heparina",
      "metotrexato",
      "litio",
      "acido acetilsalicilico",
      "aspirina",
      "ibuprofeno",
      "naproxeno",
      "diclofenaco",
      "nimesulida",
      "cetoprofeno",
      "cetorolaco",
      "mefenamico",
      "varicela",
      "oliguria",
      "aine",
      "anti-inflamatorio",
      "gestante",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "allergyTerms": [
      "acido acetilsalicilico",
      "aspirina",
      "ibuprofeno",
      "naproxeno",
      "diclofenaco",
      "nimesulida",
      "cetoprofeno",
      "cetorolaco",
      "mefenamico"
    ],
    "id": "ketoprofen-7-11-fixed",
    "ingredient": "cetoprofeno",
    "family": "nsaid",
    "group": "adjunct",
    "route": "ORAL",
    "basis": "fixed",
    "dose": 25,
    "interval": 8,
    "maxDose": 25,
    "maxDay": 75,
    "minMonths": 84,
    "maxMonths": 144,
    "maxMonthsExclusive": true,
    "nonSevereOnly": true,
    "requiresReason": true,
    "diagnoses": [
      "dor musculoesqueletica",
      "dor apos trauma leve",
      "dor pos operatoria avaliada"
    ],
    "presentations": [
      {
        "label": "Cetoprofeno Eurofarma — solução oral 20 mg/mL; gotejador original 20 gotas/mL, 1 mg/gota",
        "amount": 1,
        "quantityUnit": "gota(s)",
        "step": 1
      },
      {
        "label": "Cetoprofeno Eurofarma — solução oral 20 mg/mL; medir com seringa oral em mL",
        "amount": 20,
        "volume": 1,
        "step": 0.05
      }
    ],
    "duration": "somente enquanto houver dor, por no máximo 3 dias; reavaliar se persistir",
    "instructions": "Diluir as gotas em água filtrada e oferecer todo o preparo. Na opção em mL, medir com seringa oral. Não somar outro AINE. Suspender quando cessar a dor. Vômito com sangue, fezes escuras, pouca urina ou falta de ar exigem avaliação imediata.",
    "offLabel": "Bula Eurofarma: 25 gotas em crianças de 7–11 anos, a cada 6 ou 8 horas. Este ramo escolhe 8 horas e limita a 75 mg/dia por até 3 dias; são limites do curso escolhido. Não transpor o máximo adulto de 300 mg/dia. Não intercambiar com lisinato de cetoprofeno.",
    "medicationId": "med-110",
    "name": "Cetoprofeno base",
    "title": "Dor musculoesquelética · cetoprofeno, 7–11 anos",
    "sources": [
      "https://bulas.eurofarma.com.br/storage/media/14658/dXcS7VbuRvUw1NMzq0xHrlV0FOhbA9n5qVxwRMiM.pdf"
    ],
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "conditions": "Dor aguda com componente inflamatório avaliada em paciente de 7–11 anos, sem gravidade. Selecionar a alternativa após avaliar benefício e riscos; não aplicar ao lisinato nem a outra concentração.",
    "requiredClinicalChecks": [
      {
        "id": "ketoprofen-7-11-fixed:1",
        "label": "Confirmei indicação de AINE em paciente de 7–11 anos e avaliei alternativa analgésica com melhor perfil de risco."
      },
      {
        "id": "ketoprofen-7-11-fixed:2",
        "label": "Excluí desidratação, dengue, varicela, doença renal, úlcera/sangramento, alergia a AINE e uso concomitante de outro AINE ou anticoagulante."
      }
    ],
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "unit": "mg",
    "exactDiagnosis": true,
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "contraindications": "Alergia ao princípio ou AINEs/broncoespasmo; úlcera ou sangramento gastrointestinal; inflamação crônica do trato gastrintestinal superior ou inferior; desidratação/lesão renal; doença hepática, renal ou cardíaca significativa; suspeita de dengue; gestação/lactação fora deste ramo. Não somar outro AINE.",
    "avoidTerms": [
      "dengue",
      "desidratacao",
      "sangramento",
      "ulcera",
      "doenca renal",
      "insuficiencia renal",
      "doenca hepatica",
      "insuficiencia hepatica",
      "insuficiencia cardiaca",
      "gestacao",
      "gravidez",
      "amamentacao",
      "varfarina",
      "heparina",
      "metotrexato",
      "litio",
      "acido acetilsalicilico",
      "aspirina",
      "ibuprofeno",
      "naproxeno",
      "diclofenaco",
      "nimesulida",
      "cetoprofeno",
      "cetorolaco",
      "mefenamico",
      "varicela",
      "aine",
      "anti-inflamatorio",
      "gestante",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite",
      "doenca inflamatoria intestinal",
      "dii",
      "crohn",
      "retocolite",
      "colite cronica",
      "colite ulcerativa",
      "inflamacao cronica do trato gastrintestinal",
      "inflamacao cronica do trato gastrointestinal",
      "inflamacao cronica gastrointestinal",
      "inflamacao gastrointestinal cronica",
      "inflamacao gastrintestinal cronica",
      "inflamacao intestinal cronica",
      "doenca gastrointestinal inflamatoria cronica",
      "doenca gastrintestinal inflamatoria cronica"
    ],
    "allergyTerms": [
      "acido acetilsalicilico",
      "aspirina",
      "ibuprofeno",
      "naproxeno",
      "diclofenaco",
      "nimesulida",
      "cetoprofeno",
      "cetorolaco",
      "mefenamico",
      "tartrazina",
      "ponstan"
    ],
    "id": "mefenamic-acid-primary-dysmenorrhea",
    "minMonths": 168,
    "minExclusive": true,
    "route": "ORAL",
    "basis": "fixed",
    "dose": 500,
    "interval": 8,
    "maxDose": 500,
    "maxDay": 1500,
    "requiresReason": true,
    "nonSevereOnly": true,
    "diagnoses": [
      "dismenorreia primaria"
    ],
    "presentations": [
      {
        "label": "Ponstan — comprimido de ácido mefenâmico 500 mg, inteiro",
        "amount": 500,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "duration": "somente durante os dias com dor, por no máximo 3 dias; reavaliar se persistir",
    "instructions": "Iniciar quando começar a dor menstrual. Engolir o comprimido inteiro com água. Não somar outro AINE. Suspender se houver diarreia. Dor intensa/progressiva, sangramento anormal ou possibilidade de gestação exigem avaliação.",
    "offLabel": "Dose de 500 mg três vezes/dia e indicação de dismenorreia constam na bula brasileira Pfizer. Acima de 14 anos é o recorte conservador do cabeçalho. Curso de até 3 dias é limite operacional; a bula alerta para maior risco com uso acima de 7 dias. Não pressupõe suspensão pediátrica 10 mg/mL.",
    "medicationId": "med-11",
    "name": "Ácido mefenâmico",
    "title": "Dismenorreia primária · ácido mefenâmico, acima de 14 anos",
    "sources": [
      "https://www.pfizer.com.br/files/Ponstan_Profissional_de_Saude_21.pdf"
    ],
    "maxMonths": 216,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "unit": "mg",
    "ingredient": "acido mefenamico",
    "family": "nsaid",
    "group": "adjunct",
    "conditions": "Dismenorreia primária avaliada em adolescente acima de 14 anos, com indicação individual de AINE e sem sinais de causa secundária.",
    "requiredClinicalChecks": [
      {
        "id": "mefenamic-acid-primary-dysmenorrhea:1",
        "label": "Confirmei dismenorreia primária e indicação individual do AINE em adolescente acima de 14 anos."
      },
      {
        "id": "mefenamic-acid-primary-dysmenorrhea:2",
        "label": "Excluí possibilidade de gestação da própria paciente e confirmei que ela não está amamentando ou doando leite; avaliei hidratação, alergias, função renal/hepática e interações, sem outro AINE."
      },
      {
        "id": "mefenamic-acid-primary-dysmenorrhea:3",
        "label": "Excluí úlcera ativa e inflamação crônica do trato gastrintestinal superior ou inferior antes de selecionar ácido mefenâmico."
      }
    ],
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "exactDiagnosis": true,
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 12,
    "maxMonths": 216,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 12,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "famotidine-gerd-famox-start",
    "medicationId": "med-191",
    "name": "Famotidina",
    "ingredient": "famotidina",
    "family": "h2-blocker",
    "title": "DRGE confirmada≥1 ano · Famox início",
    "dose": 0.5,
    "maxDose": 40,
    "maxDay": 80,
    "maxKgDay": 1,
    "duration": "6 semanas inicialmente; individualizar/reavaliar antes de prolongar até 12 semanas",
    "presentations": [
      {
        "label": "Famox pó para suspensão oral 8 mg/mL após preparo — frasco final 50 mL",
        "amount": 8,
        "volume": 1,
        "step": 0.05
      }
    ],
    "diagnoses": [
      "doenca do refluxo gastroesofagico",
      "drge",
      "doenca do refluxo gastroesofagico confirmada - inicio com famotidina"
    ],
    "conditions": "DRGE diagnosticada com sintomas típicos e indicação de supressão ácida definida. Para esofagite erosiva, usarH 2 RA quando IBP não disponível/contraindicado. Função renal normal confirmada. Não tratar cólica, choro, regurgitação fisiológica nem tosse/asma isoladas.",
    "instructions": "Reconstituir usando água filtrada até a marca do copo fornecido, transferir ao frasco e agitar 3 minutos. Não inventar volume de água. Agitar 5–10 segundos antes de cada tomada; medir em seringa adequada. Após preparo conservar 15–30°C, não congelar, descartar 30 dias. Curso>30 dias requer novo frasco/preparo.",
    "contraindications": "Alergia à famotidina/H 2 RA/componentes. Insuficiência renal pediátrica: dose não estabelecida, bloquear ramo. Rever tizanidina e medicamentos cuja absorção depende de pH.",
    "avoidTerms": [
      "insuficiencia renal",
      "doenca renal",
      "tizanidina",
      "dasatinibe",
      "delavirdina",
      "cefditoreno",
      "fosamprenavir",
      "atazanavir",
      "erlotinibe",
      "cetoconazol",
      "itraconazol",
      "ledipasvir",
      "sofosbuvir",
      "nilotinibe",
      "rilpivirina",
      "colica do lactente",
      "regurgitacao fisiologica",
      "cimetidina",
      "ranitidina",
      "nizatidina",
      "famotidina",
      "omeprazol",
      "esomeprazol",
      "lansoprazol",
      "pantoprazol",
      "rabeprazol"
    ],
    "offLabel": "BulaBR sustenta 1–17 anos e dose/máximo/duração. Critério diagnóstico e preferência porIBP em erosiva provêm guideline. Não extrapolar comprimidos, máximo 80 mg/dia para úlcera nem ramo 0–3 meses sem teto. Teto 40 mg/dose é da bula, não inventado.",
    "sources": [
      "https://www.ache.com.br/wp-content/uploads/Famox_sus-oral_BU-01_VPS-3.pdf",
      "https://www.naspghan.org/files/Pediatric_Gastroesophageal_Reflux_Clinical.33.pdf"
    ],
    "requiredClinicalChecks": [
      {
        "id": "famotidine-gerd-famox-start:1",
        "label": "Confirmei a indicação específica deste esquema e a necessidade de supressão ácida; não se trata de regurgitação fisiológica ou cólica do lactente."
      },
      {
        "id": "famotidine-gerd-famox-start:2",
        "label": "Avaliei função renal, alergia a antagonistas H2, sinais de alarme e interações; este esquema de função renal normal é adequado."
      },
      {
        "id": "famotidine-gerd-famox-start:3",
        "label": "Conferi a suspensão Famox reconstituída a 8 mg/mL, validade de 30 dias após preparo e necessidade de novo frasco para completar o curso."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "allergyTerms": [
      "famotidina",
      "famox",
      "cimetidina",
      "ranitidina",
      "nizatidina",
      "antagonista h2",
      "bloqueador h2"
    ]
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 12,
    "maxMonths": 216,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 24,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "famotidine-ulcer-famox-start",
    "medicationId": "med-191",
    "name": "Famotidina",
    "ingredient": "famotidina",
    "family": "h2-blocker",
    "title": "Úlcera péptica confirmada≥1 ano · Famox início",
    "dose": 0.5,
    "maxDose": 40,
    "maxDay": 40,
    "maxKgDay": 0.5,
    "duration": "8 semanas, individualizar/reavaliar; não aumentar automaticamente",
    "presentations": [
      {
        "label": "Famox pó para suspensão oral 8 mg/mL após preparo — frasco final 50 mL",
        "amount": 8,
        "volume": 1,
        "step": 0.05
      }
    ],
    "diagnoses": [
      "ulcera peptica",
      "ulcera gastrica",
      "ulcera duodenal",
      "ulcera peptica confirmada - inicio com famotidina"
    ],
    "conditions": "Úlcera diagnosticada e etiologia/plano definido; ramo inicial, não erradicação deH.pylori isoladamente. Função renal normal.",
    "instructions": "Mesmo preparo Famox: água filtrada medida no copo da embalagem, agitar 3 minutos; agitar 5–10 segundos cada uso. Tomar antes de dormir.15–30°C; não congelar; descartar 30 dias após preparo;8 semanas exige novos frascos/reconstituição.",
    "contraindications": "AlergiaH 2 RA/componentes, insuficiência renal pediátrica e interações pH/tizanidina como ramoDRGE.",
    "avoidTerms": [
      "insuficiencia renal",
      "doenca renal",
      "tizanidina",
      "dasatinibe",
      "delavirdina",
      "cefditoreno",
      "fosamprenavir",
      "atazanavir",
      "erlotinibe",
      "cetoconazol",
      "itraconazol",
      "ledipasvir",
      "sofosbuvir",
      "nilotinibe",
      "rilpivirina",
      "hemorragia digestiva",
      "perfuracao",
      "cimetidina",
      "ranitidina",
      "nizatidina",
      "famotidina",
      "omeprazol",
      "esomeprazol",
      "lansoprazol",
      "pantoprazol",
      "rabeprazol"
    ],
    "offLabel": "Início 0,5 mg/kg 1 vez/dia; máximo absoluto 40 mg/dia. Não herdar 80 mg/dia do ramoDRGE.",
    "sources": [
      "https://www.ache.com.br/wp-content/uploads/Famox_sus-oral_BU-01_VPS-3.pdf"
    ],
    "requiredClinicalChecks": [
      {
        "id": "famotidine-ulcer-famox-start:1",
        "label": "Confirmei a indicação específica deste esquema e a necessidade de supressão ácida; não se trata de regurgitação fisiológica ou cólica do lactente."
      },
      {
        "id": "famotidine-ulcer-famox-start:2",
        "label": "Avaliei função renal, alergia a antagonistas H2, sinais de alarme e interações; este esquema de função renal normal é adequado."
      },
      {
        "id": "famotidine-ulcer-famox-start:3",
        "label": "Conferi a suspensão Famox reconstituída a 8 mg/mL, validade de 30 dias após preparo e necessidade de novo frasco para completar o curso."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "allergyTerms": [
      "famotidina",
      "famox",
      "cimetidina",
      "ranitidina",
      "nizatidina",
      "antagonista h2",
      "bloqueador h2"
    ]
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "adjunct",
    "route": "ORAL",
    "minMonths": 24,
    "maxMonths": 84,
    "basis": "fixed",
    "unit": "mg",
    "interval": 8,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "hedera-abrilar-thick-secretion-2to7",
    "medicationId": "med-224",
    "name": "Hedera helix",
    "ingredient": "extrato seco de Hedera helix",
    "family": "mucoactive",
    "title": "Secreção brônquica espessa · Abrilar 2–7 anos",
    "dose": 17.5,
    "maxDose": 17.5,
    "maxDay": 52.5,
    "duration": "mínimo 7 dias; manter 2–3 dias após redução dos sintomas, duração individualizada e reavaliação",
    "presentations": [
      {
        "label": "Abrilar solução oral 7 mg/mL de extrato seco — frasco 100 mL",
        "amount": 7,
        "volume": 1
      },
      {
        "label": "Abrilar solução oral 7 mg/mL de extrato seco — frasco 200 mL",
        "amount": 7,
        "volume": 1
      }
    ],
    "diagnoses": [
      "tosse produtiva",
      "secrecao bronquica espessa",
      "secrecao bronquica espessa - adjuvante com hedera helix"
    ],
    "conditions": "Doença broncopulmonar inflamatória diagnosticada, paciente estável com secreção espessa e expectoração preservada. Opção sintomática individualizada. Não acionar por IVAS, bronquiolite, pneumonia ou asma por nome genérico. Não é resgate de asma.",
    "instructions": "2,5 mL por tomada usando medidor. Conservar 15–30°C na embalagem original, proteger luz/umidade; após aberto 3 meses. Sintoma persistente, dispneia, febre ou secreção com sangue/pus exige avaliação.",
    "contraindications": "<2 anos, alergia aos componentes. Sorbitol: verificar intolerância hereditária à frutose antes de liberar. Bula relata nenhuma interação conhecida, sem comprovar ausência; rever combinação com medicamentos que dificultem eliminação de secreções.",
    "avoidTerms": [
      "intolerancia hereditaria a frutose",
      "bronquiolite",
      "insuficiencia respiratoria",
      "sangue no escarro",
      "expectoracao purulenta",
      "codeina",
      "dextrometorfano",
      "cloperastina",
      "levodropropizina",
      "crise de asma",
      "dropropizina",
      "coqueluche"
    ],
    "ceilingKind": "usual_selected_regimen_not_absolute_product_maximum",
    "offLabel": "ExatamenteAbrilar 7 mg/mL; não substituir extratos de outra padronização. Faixa literal 2–7 anos:24≤idadeMeses≤84; idade>84 usa ramo acima 7 anos. Não aumentar aos 6 anos e não elevar ao triplo a posologia usual.",
    "sources": [
      "https://www.fqmgrupo.com.br/fqmfarma/userfiles/products/176306452569163acd64ad2.pdf"
    ],
    "requiresProductiveCough": true,
    "requiredClinicalChecks": [
      {
        "id": "hedera-abrilar-thick-secretion-2to7:1",
        "label": "Confirmei secreção espessa e capacidade de eliminá-la; este adjuvante é uma decisão individual, sem sinais de gravidade."
      },
      {
        "id": "hedera-abrilar-thick-secretion-2to7:2",
        "label": "Excluí bronquiolite, broncoespasmo que necessita resgate, retenção de secreções, contraindicações e associação com antitussígeno."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "allergyTerms": [
      "hedera",
      "abrilar",
      "hera"
    ],
    "durationOptions": [
      "pelo menos 7 dias e até 2 dias após o desaparecimento dos sintomas; reavaliar se persistir, piorar ou surgirem sinais de alarme",
      "pelo menos 7 dias e até 3 dias após o desaparecimento dos sintomas; reavaliar se persistir, piorar ou surgirem sinais de alarme"
    ]
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "adjunct",
    "route": "ORAL",
    "minMonths": 84,
    "maxMonths": 216,
    "basis": "fixed",
    "unit": "mg",
    "interval": 8,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "hedera-abrilar-thick-secretion-over7",
    "medicationId": "med-224",
    "name": "Hedera helix",
    "ingredient": "extrato seco de Hedera helix",
    "family": "mucoactive",
    "title": "Secreção brônquica espessa · Abrilar>7 anos",
    "dose": 35,
    "maxDose": 35,
    "maxDay": 105,
    "duration": "mínimo 7 dias; manter 2–3 dias após redução dos sintomas, individualizar",
    "presentations": [
      {
        "label": "Abrilar solução oral 7 mg/mL de extrato seco — frasco 100 mL",
        "amount": 7,
        "volume": 1
      },
      {
        "label": "Abrilar solução oral 7 mg/mL de extrato seco — frasco 200 mL",
        "amount": 7,
        "volume": 1
      }
    ],
    "diagnoses": [
      "tosse produtiva",
      "secrecao bronquica espessa",
      "secrecao bronquica espessa - adjuvante com hedera helix"
    ],
    "conditions": "Mesmo contexto respiratório condicional do ramo 2–7 anos, mesmas exclusões. Idade estritamente>84 meses; a fronteira 84 exata permanece na menor dose.",
    "instructions": "5 mL por tomada.15–30°C, proteger luz/umidade, embalagem original; aberto 3 meses.",
    "contraindications": "Alergia/excipientes, intolerância hereditária à frutose; mesmos bloqueios clínicos do ramo anterior.",
    "avoidTerms": [
      "intolerancia hereditaria a frutose",
      "bronquiolite",
      "insuficiencia respiratoria",
      "sangue no escarro",
      "expectoracao purulenta",
      "codeina",
      "dextrometorfano",
      "cloperastina",
      "levodropropizina",
      "crise de asma",
      "dropropizina",
      "coqueluche"
    ],
    "ceilingKind": "usual_selected_regimen_not_absolute_product_maximum",
    "offLabel": "Não usar 5 mL aos 6 anos. Ramo literal da bula acima 7 anos: idade>84 meses; motor deve manter o sinal estrito ou mínimo 84.001 meses.",
    "sources": [
      "https://www.fqmgrupo.com.br/fqmfarma/userfiles/products/176306452569163acd64ad2.pdf"
    ],
    "requiresProductiveCough": true,
    "requiredClinicalChecks": [
      {
        "id": "hedera-abrilar-thick-secretion-over7:1",
        "label": "Confirmei secreção espessa e capacidade de eliminá-la; este adjuvante é uma decisão individual, sem sinais de gravidade."
      },
      {
        "id": "hedera-abrilar-thick-secretion-over7:2",
        "label": "Excluí bronquiolite, broncoespasmo que necessita resgate, retenção de secreções, contraindicações e associação com antitussígeno."
      }
    ],
    "minExclusive": true,
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "allergyTerms": [
      "hedera",
      "abrilar",
      "hera"
    ],
    "durationOptions": [
      "pelo menos 7 dias e até 2 dias após o desaparecimento dos sintomas; reavaliar se persistir, piorar ou surgirem sinais de alarme",
      "pelo menos 7 dias e até 3 dias após o desaparecimento dos sintomas; reavaliar se persistir, piorar ou surgirem sinais de alarme"
    ]
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "adjunct",
    "route": "ORAL",
    "minMonths": 24,
    "maxMonths": 216,
    "basis": "fixed",
    "unit": "mg",
    "interval": 8,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "id": "acetylcysteine-eurofarma-thick-secretion-5days",
    "medicationId": "med-3",
    "name": "Acetilcisteína",
    "ingredient": "acetilcisteina",
    "family": "mucoactive",
    "title": "Secreção espessa · acetilcisteína 20 mg/mL curso 5 dias",
    "dose": 100,
    "maxDose": 100,
    "maxDay": 300,
    "duration": "5 dias inicialmente; bula permite 5–10 dias em formas agudas, reavaliar antes de prolongar",
    "presentations": [
      {
        "label": "Acetilcisteína Eurofarma xarope pediátrico 20 mg/mL — frasco 120 mL",
        "amount": 20,
        "volume": 1
      }
    ],
    "diagnoses": [
      "tosse produtiva",
      "secrecao bronquica espessa",
      "secrecao bronquica espessa - adjuvante com acetilcisteina"
    ],
    "conditions": "Paciente≥2 anos, doença broncopulmonar diagnosticada, secreção densa e expectoração preservada, sem gravidade. Seleção 3 tomadas/dia cabe nos intervalos de todas as faixas; não é rotina paraIVAS nem antídoto de paracetamol.",
    "instructions": "5 mL por tomada, seringa dosadora adequada.15–30°C, proteger luz/umidade, embalagem original; descartar 14 dias após abertura. Não misturar com outros medicamentos; separar antibiótico oral por 2 horas.",
    "contraindications": "<2 anos, alergia e intolerância hereditária à frutose/sorbitol. Não usar antitussígenos; cautela asma/úlcera e secreção sem capacidade de eliminação. Rever carbamazepina, nitroglicerina e carvão ativado.",
    "avoidTerms": [
      "intolerancia hereditaria a frutose",
      "bronquiolite",
      "insuficiencia respiratoria",
      "codeina",
      "dextrometorfano",
      "cloperastina",
      "levodropropizina",
      "carbamazepina",
      "nitroglicerina",
      "carvao ativado",
      "dropropizina",
      "coqueluche"
    ],
    "ceilingKind": "usual_selected_regimen_not_absolute_product_maximum",
    "offLabel": "Curso 5 dias e 100 mg 3 vezes/dia sustentados por bula atual ligada no fabricanteV 06 padrão 28/11/2025. Teto 100 mg/dose 300 mg/dia é do esquema escolhido, não maior dose permitida. PPS atual tem 3 dias explícitosofflabel/individualizados; não afirmar que a bula apoia 3 dias. FormulaçãoEurofarma exata não empresta validade 14 dias a outras marcas.",
    "sources": [
      "https://eurofarma.com.br/produtos/bulas/healthcare/pt/bula-acetilcisteina-adulto.pdf"
    ],
    "requiresProductiveCough": true,
    "requiredClinicalChecks": [
      {
        "id": "acetylcysteine-eurofarma-thick-secretion-5days:1",
        "label": "Confirmei secreção espessa e capacidade de eliminá-la; este adjuvante é uma decisão individual, sem sinais de gravidade."
      },
      {
        "id": "acetylcysteine-eurofarma-thick-secretion-5days:2",
        "label": "Excluí bronquiolite, broncoespasmo que necessita resgate, retenção de secreções, contraindicações e associação com antitussígeno."
      }
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 144,
    "maxMonths": 216,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 8,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "ingredient": "captopril",
    "family": "ace-inhibitor",
    "minWeight": 50,
    "maxWeight": 83.33,
    "dose": 0.5,
    "maxDose": 25,
    "maxDay": 75,
    "maxKgDay": 6,
    "title": "Hipertensão arterial confirmada · início de captopril fora de bula pediátrica",
    "diagnoses": [
      "hipertensao arterial pediatrica",
      "hipertensao arterial",
      "hipertensao arterial pediatrica confirmada - inicio com captopril"
    ],
    "duration": "uso contínuo; reavaliação de pressão, creatinina e potássio conforme plano individual definido na consulta; não aumentar ou suspender sem orientação",
    "presentations": [
      {
        "label": "Geolab captopril 25 mg — comprimido inteiro",
        "amount": 25,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Adolescente de 12 a menos de 18 anos, 50–83,33 kg, com HAS confirmada e indicação farmacológica; documentar escolha fora de bula pediátrica com base em diretriz SBC. Confirmar função renal, potássio, volemia e risco reprodutivo, e ausência de troca recente de sacubitril/valsartana. Sem diurético recente, hipotensão ou descompensação.",
    "instructions": "Dose-alvo de início de 0,5 mg/kg a cada 8 horas, limitada operacionalmente a 25 mg por tomada e 75 mg por dia. No recorte de peso o teto produz 0,3–0,5 mg/kg/DOSE, dentro da faixa inicial da SBC. Administrar uma hora antes das refeições. Não gerar metade/quarto nem suspensão caseira. Não aumentar automaticamente. Angioedema, desmaio ou oligúria exigem assistência imediata.",
    "contraindications": "Alergia ou angioedema com IECA, gestação; excluir hipercalemia, estenose renal, hipovolemia, hipotensão e doença renal significativa. Troca de sacubitril/valsartana exige washout comprovado de 36 horas; não liberar só por ausência na lista atual.",
    "allergyTerms": [
      "ieca",
      "inibidor eca"
    ],
    "avoidTerms": [
      "angioedema",
      "hipercalemia",
      "estenose arteria renal",
      "desidratacao",
      "hipotensao",
      "hipovolemia",
      "sacubitril",
      "enalapril",
      "losartana",
      "valsartana",
      "alisquireno",
      "espironolactona",
      "eplerenona",
      "amilorida",
      "triamtereno",
      "potassio",
      "heparina",
      "trimetoprima",
      "litio",
      "ibuprofeno",
      "indometacina",
      "gestante",
      "gravidez",
      "amamentacao",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "A bula Geolab é de uso adulto e não estabelece segurança/eficácia infantil. Uso fora de bula apoiado em dose pediátrica da SBC 2016 e classe IECA na SBC 2025, limitado a adolescente e apresentação inteira. Teto 75 mg/dia é inicial operacional; máximo de 6 mg/kg/dia da diretriz não autoriza titulação automática. A revisão de pressão, creatinina e potássio deve seguir o plano individual definido na consulta; não há intervalo numérico universal definido neste ramo. Este ramo foi limitado a adolescentes com comprimido inteiro mensurável.",
    "id": "captopril-hypertension-initial-whole-tablet",
    "medicationId": "med-84",
    "name": "Captopril",
    "sources": [
      "https://www.geolab.com.br/wp-content/uploads/2021/05/bula_1769005727834.pdf",
      "https://www.scielo.br/j/abc/a/9fCp7wjFQhRYmqDbSTRvn3L/?lang=pt",
      "https://www.scielo.br/j/abc/a/BXT7Vk4B9VKQnJFsJhgJ4Hn/?format=html&lang=pt&ilang=en",
      "https://www.organon.com/brazil/wp-content/uploads/sites/33/2023/06/renitec_bula_profissional.pdf"
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "requiresMeasurableQuantity": true,
    "requiredClinicalChecks": [
      {
        "id": "captopril-hypertension-initial-whole-tablet:1",
        "label": "Confirmei hipertensão e indicação de início ambulatorial deste IECA, com dose mensurável pelo comprimido inteiro selecionado."
      },
      {
        "id": "captopril-hypertension-initial-whole-tablet:2",
        "label": "Avaliei pressão, creatinina, potássio e volemia; não há doença renal, hipercalemia, depleção de volume ou uso recente de diurético que exija outro início."
      },
      {
        "id": "captopril-hypertension-initial-whole-tablet:3",
        "label": "Conferi medicamentos atuais e suspensos: não houve sacubitril/valsartana nas últimas 36 horas; o plano evita seu uso nas 36 horas posteriores à última dose deste IECA."
      },
      {
        "id": "captopril-hypertension-initial-whole-tablet:4",
        "label": "Excluí angioedema, gravidez e lactação da própria paciente; quando aplicável, avaliei risco reprodutivo. Registrei a adequação à bula/diretriz e informei o responsável."
      },
      {
        "id": "captopril-hypertension-initial-whole-tablet:5",
        "label": "Combinei revisão de pressão, creatinina e potássio conforme plano individual definido na consulta, antes de qualquer aumento."
      }
    ],
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 144,
    "maxMonths": 192,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 24,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "ingredient": "enalapril",
    "family": "ace-inhibitor",
    "minWeight": 62.5,
    "dose": 0.08,
    "maxDose": 5,
    "maxDay": 5,
    "maxKgDay": 0.58,
    "title": "Hipertensão arterial confirmada · início de enalapril em subgrupo mensurável",
    "diagnoses": [
      "hipertensao arterial pediatrica",
      "hipertensao arterial",
      "hipertensao arterial pediatrica confirmada - inicio com enalapril"
    ],
    "duration": "uso contínuo; reavaliação de pressão, creatinina e potássio conforme plano individual definido na consulta; não aumentar ou suspender sem orientação",
    "presentations": [
      {
        "label": "Renitec maleato de enalapril 5 mg — comprimido inteiro",
        "amount": 5,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Recorte de 6 até 16 anos e peso ≥62,5 kg, candidato a monoterapia ambulatorial inicial, sem doença renal/hepática, depleção volêmica ou tratamento diurético recente. Confirmar PA seriada, eletrólitos/creatinina basais e risco reprodutivo. Documentar ausência de sacubitril/valsartana nas 36 horas anteriores e plano que evite associação posterior nesse intervalo.",
    "instructions": "Dose inicial de 0,08 mg/kg a cada 24 horas, limitada a 5 mg por dia; neste recorte o cálculo alcança exatamente o comprimido inteiro 5 mg. Não partir Renitec. Não extrapolar para insuficiência cardíaca ou usar manutenção escalonada automática. Evitar suplementos de potássio e substitutos de sal com potássio. Inchaço de lábios/língua, desmaio ou redução importante da urina exigem avaliação imediata.",
    "contraindications": "Angioedema prévio com IECA ou hereditário/idiopático; alergia; sacubitril/valsartana atual ou nas 36 horas antes/depois; alisquireno com diabetes; gestação. Excluir TFG <30, estenose de artérias renais, hipercalemia, hipovolemia e hipotensão.",
    "allergyTerms": [
      "inibidor eca",
      "ieca"
    ],
    "avoidTerms": [
      "angioedema",
      "estenose arteria renal",
      "hipercalemia",
      "desidratacao",
      "hipovolemia",
      "hipotensao",
      "sacubitril",
      "valsartana",
      "alisquireno",
      "losartana",
      "captopril",
      "espironolactona",
      "eplerenona",
      "amilorida",
      "triamtereno",
      "potassio",
      "trimetoprima",
      "litio",
      "ibuprofeno",
      "indometacina",
      "vildagliptina",
      "sirolimo",
      "everolimo",
      "gestante",
      "gravidez",
      "amamentacao",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Dose inicial numérica apoiada na SBC; teto inicial de 5 mg confirmado adversarialmente em fonte regulatória primária. Renitec documenta estudo pediátrico e dose de 5 mg/dia em ≥50 kg. Teto operacional inicial de 5 mg não é máximo universal da molécula. Fora do recorte mensurável não prescrever fração ou solução suposta. A revisão de pressão, creatinina e potássio deve seguir o plano individual definido na consulta; não há intervalo numérico universal definido neste ramo. Este ramo foi limitado a adolescentes com comprimido inteiro mensurável.",
    "id": "enalapril-hypertension-initial-whole-tablet",
    "medicationId": "med-176",
    "name": "Enalapril",
    "sources": [
      "https://www.organon.com/brazil/wp-content/uploads/sites/33/2023/06/renitec_bula_profissional.pdf",
      "https://www.scielo.br/j/abc/a/9fCp7wjFQhRYmqDbSTRvn3L/?lang=pt",
      "https://www.scielo.br/j/abc/a/BXT7Vk4B9VKQnJFsJhgJ4Hn/?format=html&lang=pt&ilang=en",
      "https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=c7934b45-eb6b-44c1-bd2c-ef0fa10850c1"
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "requiresMeasurableQuantity": true,
    "requiredClinicalChecks": [
      {
        "id": "enalapril-hypertension-initial-whole-tablet:1",
        "label": "Confirmei hipertensão e indicação de início ambulatorial deste IECA, com dose mensurável pelo comprimido inteiro selecionado."
      },
      {
        "id": "enalapril-hypertension-initial-whole-tablet:2",
        "label": "Avaliei pressão, creatinina, potássio e volemia; não há doença renal, hipercalemia, depleção de volume ou uso recente de diurético que exija outro início."
      },
      {
        "id": "enalapril-hypertension-initial-whole-tablet:3",
        "label": "Conferi medicamentos atuais e suspensos: não houve sacubitril/valsartana nas últimas 36 horas; o plano evita seu uso nas 36 horas posteriores à última dose deste IECA."
      },
      {
        "id": "enalapril-hypertension-initial-whole-tablet:4",
        "label": "Excluí angioedema, gravidez e lactação da própria paciente; quando aplicável, avaliei risco reprodutivo. Registrei a adequação à bula/diretriz e informei o responsável."
      },
      {
        "id": "enalapril-hypertension-initial-whole-tablet:5",
        "label": "Combinei revisão de pressão, creatinina e potássio conforme plano individual definido na consulta, antes de qualquer aumento."
      }
    ],
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "group": "etiologic",
    "route": "ORAL",
    "minMonths": 72,
    "maxMonths": 144,
    "basis": "kg-dose",
    "unit": "mg",
    "interval": 12,
    "renalAdjustment": true,
    "hepaticAdjustment": true,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "ingredient": "hidroclorotiazida",
    "family": "thiazide",
    "minWeight": 24,
    "dose": 1,
    "maxDose": 25,
    "maxDay": 50,
    "maxKgDay": 3,
    "title": "Hipertensão arterial confirmada · início de hidroclorotiazida oral",
    "diagnoses": [
      "hipertensao arterial pediatrica",
      "hipertensao arterial",
      "hipertensao arterial pediatrica confirmada - inicio com hidroclorotiazida"
    ],
    "duration": "tratamento contínuo individualizado; reavaliação clínica e laboratorial conforme plano individual definido na consulta",
    "presentations": [
      {
        "label": "Cimed hidroclorotiazida 25 mg — somente comprimido inteiro",
        "amount": 25,
        "quantityUnit": "comprimido(s)",
        "step": 1
      }
    ],
    "conditions": "Criança de 6 a menos de 12 anos, peso mínimo 24 kg, hipertensão confirmada com indicação farmacológica e função renal/hepática avaliadas. Confirmar volemia, PA, sódio, potássio e creatinina. Excluir crise hipertensiva e causas que exijam intervenção urgente. A dispensação exige dose mensurável com comprimido inteiro e erro máximo de arredondamento de 5%.",
    "instructions": "Dose-alvo inicial de 1 mg/kg por tomada a cada 12 horas, limitada a 25 mg por tomada e 50 mg por dia. Administrar somente comprimido inteiro 25 mg após validar mensurabilidade. Evitar última dose ao deitar. Reavaliar PA, diurese, sódio, potássio e função renal conforme plano individual definido na consulta; revisão anterior se tontura, fraqueza, pouca urina ou vômitos. Proteger a pele do sol e avisar sobre lesões novas. Não suspender ou aumentar por conta própria.",
    "contraindications": "Alergia ao fármaco/sulfonamidas; anúria, TFG <30, doença hepática grave, icterícia infantil, desidratação/hipotensão, distúrbio eletrolítico significativo ou reação respiratória anterior a tiazida. Síndrome de má-absorção de glicose-galactose.",
    "allergyTerms": [
      "sulfonamida",
      "tiazida"
    ],
    "avoidTerms": [
      "anuria",
      "desidratacao",
      "hipotensao",
      "ictericia",
      "hipocalemia",
      "hiponatremia",
      "hipercalcemia",
      "hipomagnesemia",
      "litio",
      "digoxina",
      "amiodarona",
      "sotalol",
      "quinidina",
      "ibuprofeno",
      "indometacina",
      "ciclosporina",
      "metotrexato",
      "corticoide",
      "antidepressivo triciclico",
      "gestante",
      "gravidez",
      "amamentacao",
      "gravida",
      "lactante",
      "lactacao",
      "amamentando",
      "doacao de leite",
      "doa leite"
    ],
    "offLabel": "Recorte conservador de população e apresentação. A bula Cimed fornece 2–3 mg/kg/DIA dividido; este início corresponde a 2 mg/kg/DIA antes do teto da SBC de 50 mg/DIA. Máximo de 50 mg/dia é do cenário de HAS pediátrica da diretriz, não máximo universal de todos os usos da molécula.",
    "id": "hydrochlorothiazide-hypertension-init",
    "medicationId": "med-227",
    "name": "Hidroclorotiazida",
    "sources": [
      "https://bula.cimedremedios.com.br/008/001/001/007/100125/100125-B.pdf",
      "https://www.scielo.br/j/abc/a/9fCp7wjFQhRYmqDbSTRvn3L/?lang=pt",
      "https://www.scielo.br/j/abc/a/BXT7Vk4B9VKQnJFsJhgJ4Hn/?format=html&lang=pt&ilang=en"
    ],
    "patientContextScope": true,
    "requiresNormalRenal": true,
    "requiresNormalHepatic": true,
    "requiresMeasurableQuantity": true,
    "maxMonthsExclusive": true,
    "requiredClinicalChecks": [
      {
        "id": "hydrochlorothiazide-hypertension-init:1",
        "label": "Confirmei hipertensão pediátrica e indicação de início ambulatorial com hidroclorotiazida, sem crise ou hipotensão."
      },
      {
        "id": "hydrochlorothiazide-hypertension-init:2",
        "label": "Avaliei pressão, hidratação, sódio, potássio, creatinina e funções renal/hepática; excluí contraindicações e interações."
      },
      {
        "id": "hydrochlorothiazide-hypertension-init:3",
        "label": "Conferi comprimido inteiro de 25 mg e combinei revisão clínica/laboratorial conforme plano individual definido na consulta, sem titulação automática."
      }
    ],
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  },
  {
    "catalogNew": true,
    "reviewedAt": "2026-10-05",
    "status": "source-reviewed",
    "id": "dornase-fc-pulmozyme-pari-eflow-maintenance",
    "medicationId": "med-21",
    "name": "Alfadornase (Pulmozyme)",
    "ingredient": "alfadornase",
    "family": "dornase-fc-maintenance",
    "group": "etiologic",
    "route": "INALATÓRIA",
    "minMonths": 72,
    "maxMonths": 216,
    "basis": "fixed",
    "unit": "mg",
    "dose": 2.5,
    "interval": 24,
    "maxDose": 2.5,
    "maxDay": 2.5,
    "nebulizerVolume": 2.5,
    "renalAdjustment": false,
    "hepaticAdjustment": false,
    "exactDiagnosis": true,
    "requiresReason": true,
    "nonSevereOnly": true,
    "title": "Fibrose cística confirmada · Pulmozyme com PARI E-FLOW RAPID, manutenção ≥6 anos",
    "diagnoses": [
      "fibrose cistica",
      "fibrose cistica confirmada - manutencao com pulmozyme e pari e-flow rapid"
    ],
    "duration": "uso diário contínuo; reavaliação de técnica, tolerância e resposta conforme plano individual definido na consulta; não interromper sem orientação da equipe de fibrose cística",
    "presentations": [
      {
        "label": "Pulmozyme solução para inalação 1 mg/mL — ampola de dose única de 2,5 mL; caixa com 6 ampolas",
        "amount": 1,
        "volume": 1,
        "step": 0.1
      }
    ],
    "conditions": "Fibrose cística confirmada, capacidade vital forçada acima de 40% do previsto e plano de manutenção definido pela equipe especializada. Criança/adolescente entre 6 e 17 anos, clinicamente estável, capaz de usar o bocal do nebulizador PARI E-FLOW RAPID, com dispositivo e cadeia de refrigeração conferidos. Este ramo não cobre outras doenças respiratórias, mudança de dose, nebulizador diferente ou resgate de broncoespasmo.",
    "instructions": "Nebulizar o conteúdo inteiro de uma ampola: 2,5 mL = 2,5 mg, uma vez ao dia, no PARI E-FLOW RAPID. Não diluir, não misturar com outros medicamentos e não conservar sobra da ampola aberta. Seguir limpeza/manutenção do equipamento conforme seu fabricante. Manter a terapia convencional e a fisioterapia respiratória do plano de fibrose cística. Guardar e transportar entre 2 e 8 °C, protegido de luz intensa; evitar exposição ambiente superior a 24 horas. Ampola turva ou com coloração alterada deve ser descartada. Registrar a marca Pulmozyme no prontuário para rastreabilidade.",
    "contraindications": "Hipersensibilidade à alfadornase ou aos componentes. Este contrato exclui CVF de 40% ou menos, impossibilidade de usar o bocal do dispositivo escolhido, ausência de plano especializado, dispositivo diferente/não identificado e deterioração respiratória aguda. Outras terapias convencionais da fibrose cística podem acompanhar, conforme o plano; não misturar medicamentos dentro do nebulizador. Não foram realizados estudos formais de interação.",
    "allergyTerms": [
      "alfadornase",
      "alfa-dornase",
      "dornase",
      "pulmozyme"
    ],
    "avoidTerms": [
      "nebulizador ultrassonico",
      "nebulizador desconhecido",
      "nebulizador nao identificado",
      "cvf inferior a 40",
      "cvf abaixo de 40",
      "cvf 40%",
      "crise de asma",
      "estado de mal asmatico"
    ],
    "offLabel": "Bula brasileira Roche aprovada em 23/06/2025 sustenta Pulmozyme 1 mg/mL, uma ampola de 2,5 mg por dia e o dispositivo PARI E-FLOW RAPID. ≥6 anos, estabilidade e dispositivo único são recortes operacionais conservadores, não contraindicações gerais da bula. Teto de 2,5 mg/dia é o esquema selecionado, não máximo absoluto do medicamento. A indicação neste ramo exige CVF acima de 40% do previsto. Não aplicar curso finito de 5–7 dias nem aumentar para duas ampolas por dia. O seguimento de técnica, tolerância e resposta deve seguir o plano individual definido na consulta; este ramo não fixa intervalo numérico de revisão.",
    "sources": [
      "https://dialogoroche.com.br/content/dam/roche-dialogo/dialogo-brazil-assets/downloadable-assets/produtos/bulas/pulmozyme/Pulmozyme_Bula_Profissionais.pdf"
    ],
    "requiredClinicalChecks": [
      {
        "id": "dornase-fc-pulmozyme-pari-eflow-maintenance:1",
        "label": "Confirmei fibrose cística, CVF acima de 40% do previsto e um plano diário de manutenção com Pulmozyme definido pela equipe especializada."
      },
      {
        "id": "dornase-fc-pulmozyme-pari-eflow-maintenance:2",
        "label": "Conferi o nebulizador PARI E-FLOW RAPID, sua manutenção e a capacidade do paciente de usar corretamente o bocal; este ramo não permite substituir o equipamento."
      },
      {
        "id": "dornase-fc-pulmozyme-pari-eflow-maintenance:3",
        "label": "Confirmei a ampola Pulmozyme 1 mg/mL de 2,5 mL, a cadeia de refrigeração e a administração integral sem diluição ou mistura."
      },
      {
        "id": "dornase-fc-pulmozyme-pari-eflow-maintenance:4",
        "label": "Avaliei alergias, o estado respiratório e o restante do plano de fibrose cística; combinei seguimento, fisioterapia habitual e critérios de retorno."
      }
    ],
    "patientContextScope": true,
    "prescriptionEmissionBlocked": true,
    "prescriptionEmissionBlockReason": "O intervalo numérico de primeira revisão não foi sustentado exatamente pelas fontes examinadas e não há plano de seguimento concreto por medicamento capturado neste fluxo. Emissão prescritiva bloqueada; dados sustentados permanecem para consulta. Reabrir após referência suficiente para o campo ou plano individual concreto registrado e validado, sem relaxar os gates de duração."
  }
];
