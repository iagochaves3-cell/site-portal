export const prioritySourceValidation={
  "charlson-mdcalc-restrito": {
    "status": "DOCUMENTAL_VALIDADO",
    "variant": "Aplicação restrita consultiva MDCalc editorial versão1 publicada2022-04-21, sem sobrevida; combinação AVC/AIT+hemiplegia sem resultado. Não fecha Charlson integral.",
    "partial": true,
    "references": [
      {
        "url": "https://www.mdcalc.com/calc/3917/charlson-comorbidity-index-cci",
        "title": "Charlson Comorbidity Index (CCI), ficha e fórmula editorial integral",
        "entity": "MDCalc, editora profissional de instrumentos clínicos; criadora citada Mary Charlson, sem afirmar aprovação autoral desta implementação",
        "version_or_date": "versionNumber1; publishedAt2022-04-21T20:29:24.688Z; documento consultado2026-09-30",
        "checked_at": "2026-09-30T23:31:30.984472+00:00",
        "retrieved_at": "2026-09-30T23:31:30.984472+00:00",
        "sha256": "cb2e728a7d712be5548359bd95710d9eb230edee0476f8d7c74def1d9849b30c",
        "examined": true,
        "locator": "__NEXT_DATA__.props.pageProps.calc.input_schema (17componentes), content.about.formula_en (tabela integral, soma, notaexclusões); content.next_steps.advice_en e content.about.more_info_en",
        "excerpt": "Idade <50=0; 50–59=1; 60–69=2; 70–79=3; ≥80=4. Oito condições de 1 ponto; fígado 0/1/3; diabetes 0/1/2; hemiplegia 2; doença renal 2; tumor sólido 0/2/6; leucemia 2; linfoma 2; AIDS 6. AVC/AIT com nenhuma ou sequela menor; diabetes controlado apenas com dieta=0. Soma dos pesos. As categorias de gravidade dentro de fígado são mutuamente exclusivas; as categorias dentro de diabetes também. Doença hepática e diabetes podem coexistir e seus pontos são somados. O formulário de tumor sólido usa seleção única.",
        "reliability": "Ficha editorial integral de editora médica especializada, metadados de versão e formulário/fórmula confirmados no documento original atual. Sustenta os pesos e as perguntas desta aplicação explicitamente identificada, sem importar validação estatística ou critérios de outras variantes.",
        "integrity_check": "HTTP200 HTML completo com título,canonical,17campos,fórmula,evidências e metadadosdepublicação. Extração __NEXT_DATA__ integral preservada para revisão; sem executar código externo.",
        "retraction_or_supersession_check": "Ficha nativa disabled:false,replacement_calc_id:null,versionNumber1; documento permanece publicado. Não há alegação de vigilância universal de erratas desconhecidas.",
        "applicability": "Somente contagem consultiva em Escores Clínicos, adulto18–120anos operacionalmente,diagnósticosconfirmados,semprobabilidade,prescrição ou limitação de cuidado.",
        "implementation_application": "Nova ficha separada charlson-mdcalc-restrito. Preserva o candidato charlson-age em quarentena. Restrição adicional recusa qualquer combinação AVC/AIT+hemiplegia, evitando somar classificação neurológica ambígua; máximo 36 apenas para dados aceitos, sem atribuí-lo ao índice original.",
        "known_conflicts": "CHUVexcluihemiplegia noCVA eagrupahematológicos;CAPCmodificadoalterafígado;LWW2024usaidades41–50. Não foram combinados. O formulárioMDCalcpermiteamboscampos; estaaplicação os recusa conservadoramente. Casosassimficamabertos; não se confirma máximo37clínicouniversal."
      }
    ]
  },
  "hacor": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://link.springer.com/article/10.1007/s00134-016-4601-3",
        "title": "Assessment of heart rate, acidosis, consciousness, oxygenation, and respiratory rate to predict noninvasive ventilation failure in hypoxemic patients",
        "entity": "Duan et al.; Intensive Care Medicine / Springer",
        "version_or_date": "2017 (online2016-11-03)",
        "checked_at": "2026-09-30T19:07:55.297154+00:00",
        "locator": "Supplementary Table2 original publisher MOESM4.doc; Table3; abstract",
        "excerpt": "HR≤120=0/≥121=1;pH≥7.35=0/7.30–7.34=2/7.25–7.29=3/<7.25=4;GCS15=0/13–14=2/11–12=5/≤10=10;PF≥201=0/176–200=2/151–175=3/126–150=4/101–125=5/≤100=6;RR≤30=0/31–35=1/36–40=2/41–45=3/≥46=4;cutoff>5at1h",
        "reliability": "Documento original especializado ou revisão integral revisada por pares examinada no dossiê da rodada anterior; trecho e população sustentam este instrumento.",
        "sha256": "1036ad3352dd64bf52a0ace797630949267a30c1c969af72e8b931353132ba3f",
        "examined": true
      }
    ]
  },
  "gahs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4509754/",
        "title": "Prognostic models for alcoholic hepatitis",
        "entity": "Original publisher/institution document or peer-reviewed full review; originalGAHS fulltext blocked500/403, adequate fullreview table used.",
        "version_or_date": "2015-07-21",
        "checked_at": "2026-09-30T19:07:55.297154+00:00",
        "locator": "Table1 GAHS",
        "excerpt": "Age<50=1/≥50=2;WBC<15=1/≥15=2;Urea<5mmol/L=1/≥5=2;PTratio<1.5=1/1.5–2=2/>2=3;Bili<125=1/125–250=2/>250=3;severe≥9",
        "reliability": "Original publisher/institution document or peer-reviewed full review; originalGAHS fulltext blocked500/403, adequate fullreview table used.",
        "sha256": "be24890ecc3025715db0f69806327944492f4bb2839ef57beb6108672301f13e",
        "examined": true
      }
    ]
  },
  "haps": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9727576/",
        "title": "Diagnosis, severity stratification and management of adult acute pancreatitis–current evidence and controversies",
        "entity": "World Journal of Gastrointestinal Surgery; Chan Kai Siang, Shelat Vishal G",
        "version_or_date": "2022-11-27",
        "checked_at": "2026-09-30T20:34:00.486377+00:00",
        "locator": "Table1 HAPS",
        "excerpt": "No rebound/guarding;normalHctmales≤43%,females≤39.6%;normalcreatinine≤2mg/dL; all3 absent favors harmlesscourse",
        "reliability": "Documento original especializado ou revisão integral revisada por pares examinada no dossiê da rodada anterior; trecho e população sustentam este instrumento.",
        "sha256": "473730057d7ea8d4c3f5dd0ec762ae570633589d9ce0917ca2bc5f8470fbb006",
        "examined": true,
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9727576/fullTextXML"
      }
    ]
  },
  "idsa-ats-minor": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6812437/",
        "title": "Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An Official Clinical Practice Guideline of the American Thoracic Society and Infectious Diseases Society of America",
        "entity": "American Journal of Respiratory and Critical Care Medicine; Metlay Joshua P., Waterer Grant W., Long Ann C.",
        "version_or_date": "2019-10-01",
        "checked_at": "2026-09-30T20:34:00.498409+00:00",
        "locator": "Table1; scope",
        "excerpt": "RR≥30;PF≤250;multilobar;confusion;BUN≥20;WBC<4000duetoinfection(notchemotherapy);platelets<100000;coretemp<36;hypotensionrequiringaggressivefluids. Severe:one major or≥3minor.",
        "reliability": "Documento original especializado ou revisão integral revisada por pares examinada no dossiê da rodada anterior; trecho e população sustentam este instrumento.",
        "sha256": "cf6cf99dec6a4a5d3dc56b8ab0a8536f32fcf74cdf166cd71565e6669ed7369e",
        "examined": true,
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6812437/fullTextXML"
      }
    ]
  },
  "mrc-sum": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7224132/",
        "title": "ICU-acquired weakness",
        "entity": "Vanhorebeek, Latronico, Van den Berghe; Intensive Care Medicine",
        "version_or_date": "2020",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Table 1; Diagnosis section",
        "excerpt": "Bilateral six muscle groups; significant weakness <48/60, severe <36/60; awake, cooperative and comprehend testing.",
        "reliability": "Vanhorebeek, Latronico, Van den Berghe; Intensive Care Medicine",
        "sha256": "4d97336e262649f85ad66e96ecd95e4beb33d6062786a2e613055696da383673",
        "examined": true
      }
    ]
  },
  "cam-icu": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://cdn.prod.website-files.com/5b0849daec50243a0a1e5e0c/656f9d329df092cd23ca69bf_CAM-ICU-tools-2023_flowsheet.pdf",
        "title": "CAM-ICU Flowsheet",
        "entity": "E. Wesley Ely / Vanderbilt University; official CIBS portal",
        "version_or_date": "2023 version filename",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Page 1",
        "excerpt": "Must have Feature 1 and Feature 2 and either Feature 3 or Feature 4. Attention errors >2; disorganized thinking >1 error.",
        "reliability": "E. Wesley Ely / Vanderbilt University; official CIBS portal",
        "sha256": "e91438ee05bdc36db6b28794aa2191201d1466eb73451047ea1f2741d4bd2c9a",
        "examined": true
      },
      {
        "url": "https://cdn.prod.website-files.com/5b0849daec50243a0a1e5e0c/64494326d62bbde72c3bafc4_CAM-ICU-Pocket-Cards.pdf",
        "title": "CAM-ICU Pocket Cards and RASS",
        "entity": "Vanderbilt University; official CIBS portal",
        "version_or_date": "2023 current portal artifact",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "RASS page",
        "excerpt": "Proceed at RASS +4 to −3; STOP at RASS −4 and −5, recheck later.",
        "reliability": "Vanderbilt University; official CIBS portal",
        "sha256": "8975e6c8dc3c74707cdb25e962287e3de8e9560478256f3673bbe8d3e583df8a",
        "examined": true
      }
    ]
  },
  "icdsc": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://cdn.prod.website-files.com/5b0849daec50243a0a1e5e0c/5bad3e04cc14601f7c2dc05f_2013-Tufts-ICU-Delirium-Screening-Checklist.pdf",
        "title": "Intensive Care Delirium Screening Checklist Worksheet (ICDSC)",
        "entity": "Tufts worksheet, adapted from Bergeron2001/Ouimet2007; linked official Vanderbilt/CIBS portal",
        "version_or_date": "2013 filename",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Page 1, instructions, component 1 and score table",
        "excerpt": "Score over entire shift; unassessable in coma; light sedation counts one if no recent sedatives, zero if recent sedatives; scores0/1–3/4–8.",
        "reliability": "Tufts worksheet, adapted from Bergeron2001/Ouimet2007; linked official Vanderbilt/CIBS portal",
        "sha256": "dc5842fbc02f8809cb495f61a200a19a9f3b2bd109fe8520c3761c7fb6097c12",
        "examined": true
      }
    ]
  },
  "clinical-frailty-scale": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.dal.ca/sites/gmr/our-tools/clinical-frailty-scale.html",
        "title": "Clinical Frailty Scale",
        "entity": "Dalhousie University Geriatric Medicine Research",
        "version_or_date": "Current page v2.0",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Current official introduction and CFS guidance/training links",
        "excerpt": "CFS expanded to9 in2007; v2.0 in2020 changed level4 from Vulnerable to Living with Very Mild Frailty and5–8 Living with...",
        "reliability": "Dalhousie University Geriatric Medicine Research",
        "sha256": "81afc052c9581a16a26447d1251bb7a97a13b62196d8d5c658ee685a9975d370",
        "examined": true
      },
      {
        "url": "https://cdn.dal.ca/content/dam/dalhousie/pdf/sites/gmr/CFS-Top-Tips_2020Jun05_EN_Letter.pdf",
        "title": "Top tips to help you use the Clinical Frailty Scale",
        "entity": "Rockwood, Fay, Theou, Dykes; Dalhousie University",
        "version_or_date": "v2.0 2020-06-05",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Tips1,4,5",
        "excerpt": "CFS not validated under65 or stable single-system disabilities; terminalcurrentstate trumps baseline.",
        "reliability": "Rockwood, Fay, Theou, Dykes; Dalhousie University",
        "sha256": "26a3b302bb6da4c96133f7710585a91920d8ccbc99c78d443b5cd1017214cdf9",
        "examined": true
      },
      {
        "url": "https://cdn.dal.ca/content/dam/dalhousie/pdf/sites/gmr/CFS-Guidance-for-Use_2020Apr06_EN.pdf",
        "title": "Using the Clinical Frailty Scale to Rapidly Assay Grades of Fitness and Frailty",
        "entity": "Dalhousie University Geriatric Medicine Research",
        "version_or_date": "2020-04-06",
        "checked_at": "2026-09-30T19:05:09.448901+00:00",
        "locator": "Pages1–2",
        "excerpt": "Judgement-based summary; baseline2weeks prior illness; ninelevel operational function descriptions and terminal exception. Labels in thisApril2020 document predate current v2.0 page labels.",
        "reliability": "Dalhousie University Geriatric Medicine Research",
        "sha256": "c7d34e3153ffd47f3d11c2f3af215c5ff0e808dba3c374317312f4b1c01ce873",
        "examined": true
      }
    ]
  },
  "hestia": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8408662/",
        "title": "Triaging acute pulmonary embolism for home treatment by Hestia or simplified PESI criteria: the HOME-PE randomized trial",
        "entity": "European Heart Journal / Roy et al.",
        "version_or_date": "2021-08-07",
        "locator": "Table 2 and footnotes a–d; Methods / Patients / Procedures",
        "excerpt": "Severe pain needing intravenous pain medication for more than 24 h? ... If the answer to all the questions is no ... home treatment. If the answer to one ... is yes ... in-hospital treatment.",
        "reliability": "Original multicentre randomized trial, peer-reviewed; complete checklist including operational notes was read.",
        "sha256": "d97cf8cbc05ee0622b9039a1106bfb1f6ba6ec93f573848814c1bf7fbaa7171b",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      }
    ]
  },
  "csrs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.cmaj.ca/content/188/12/E289",
        "title": "Development of the Canadian Syncope Risk Score to predict serious adverse events after emergency department assessment of syncope",
        "entity": "CMAJ / Thiruganasambandamoorthy et al.",
        "version_or_date": "2016-07-04",
        "locator": "Methods/Study population; final model paragraph; Figure 2 caption",
        "excerpt": "Triggered by being in a warm crowded place, prolonged standing, fear, emotion or pain. ... Includes coronary or valvular heart disease, cardiomyopathy, congestive heart failure and non-sinus rhythm ... Includes blood pressure values from triage until disposition from the emergency department.",
        "reliability": "Original derivation paper read from publisher; complete text accessible, original point diagram image returned403.",
        "sha256": "8e08186ebdaf41f1463da33566f76c13a8438026ed088094d38aae8889728f4f",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      },
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/32202605/",
        "title": "Multicenter Emergency Department Validation of the Canadian Syncope Risk Score",
        "entity": "JAMA Internal Medicine / Thiruganasambandamoorthy et al.",
        "version_or_date": "2020-05-01",
        "locator": "Original abstract / participants and conclusions",
        "excerpt": "patients 16 years and older ... within 24 hours of syncope ... guide ED management ... when serious causes are not identified during index ED evaluation.",
        "reliability": "Original peer-reviewed validation abstract inspected; fullTextXML500 and publisher403, so full text was not certified.",
        "sha256": "5b83ab33d6997057cf7822675a9b67c47b8b00911d5e94a4f007eaa933d24df6",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8224075/",
        "title": "A Rational Evaluation of the Syncope Patient: Optimizing the Emergency Department Visit",
        "entity": "Medicina / Hatoum and Sheldon",
        "version_or_date": "2021-05-21",
        "locator": "Table4, Figure1 (image viewed directly from publisher)",
        "excerpt": "Table4: VVS −1, CVD1, SBP2, troponin2, axis1, QRS1, QTc2, VVS diagnosis−2, cardiac diagnosis2. Figure1: −3to−2 very low; −1to0 low;1to3 intermediate;4to5 high;6to11 very high.",
        "reliability": "Peer-reviewed full review, table and figure reproduce original model; read to resolve inaccessible original score image.",
        "sha256": "d2326159f5824ae5ebdf0b9e8c36ffa7d40d84142b622b5303f8bd7b9f09e807",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      }
    ]
  },
  "sfsr": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/16631985/",
        "title": "Prospective validation of the San Francisco Syncope Rule to predict patients with serious outcomes",
        "entity": "Annals of Emergency Medicine / Quinn et al.",
        "version_or_date": "2006-01-18",
        "locator": "Original abstract / Study objective and Methods",
        "excerpt": "history of congestive heart failure, Hematocrit <30%, abnormal ECG result [new changes or non-sinus rhythm], complaint of shortness of breath, and systolic blood pressure <90 mm Hg during triage ... syncope or near syncope ... trauma, alcohol, or drug-associated loss of consciousness and definite seizures were excluded.",
        "reliability": "Original peer-reviewed validation abstract explicitly defines all five fields, ECG, population and exclusions. No score-specific probabilities displayed in current implementation.",
        "sha256": "32b40ef94348b1e4a7a1ab0970aa7a7b9dc68d9d3e996a9a4f559d5b344772f9",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5052859/",
        "title": "Syncope: a review of emergency department management and disposition",
        "entity": "Clinical and Experimental Emergency Medicine / Patel and Quinn",
        "version_or_date": "2015-06-30",
        "locator": "San Francisco Syncope Rule section",
        "excerpt": "Patients that meet any of these 5 criteria are predicted to be at higher risk ... Subsequent studies ... resulted in lower sensitivities.",
        "reliability": "Peer-reviewed review supports binary positive rule and limits; text contains erroneous inversion of sensitivity/specificity, so those rates must not be copied.",
        "sha256": "d1686ff0b9dd94486a5e71a86b35e42c65cf5c67aeb587d0dabb6f524e7ea158",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      }
    ]
  },
  "oesil": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/12727148/",
        "title": "Development and prospective validation of a risk stratification system for patients with syncope in the emergency department: the OESIL risk score",
        "entity": "European Heart Journal / Colivicchi et al.",
        "version_or_date": "2003-05-01",
        "locator": "Original abstract / Methods and results",
        "excerpt": "(1) age >65 years; (2) cardiovascular disease in clinical history; (3) syncope without prodromes; and (4) abnormal electrocardiogram ... simple arithmetic sum ... total mortality within the first12months ... increasing mortality with increasing score.",
        "reliability": "Original peer-reviewed derivation+prospective validation abstract sufficient for all four displayed binary criteria, sum0–4 and conservative association statement; detailed original ECG operational definitions not read.",
        "sha256": "27b93a102f8715fb17663fdf5490991126ecb7496b13680a31150a51e6b65b3d",
        "examined": true,
        "checked_at": "2026-09-30T19:07:01.578914+00:00"
      }
    ]
  },
  "who-dehydration": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.who.int/publications/i/item/978-92-4-154837-3",
        "title": "Pocket book of hospital care for children, second edition",
        "entity": "World Health Organization",
        "version_or_date": "2013",
        "checked_at": "2026-09-30T18:52:15Z",
        "locator": "Chapter5, Table12, p128; section5.2.2,p132",
        "excerpt": "Severe dehydration: two or more ... lethargy or unconsciousness; sunken eyes; unable to drink or drinks poorly; skin pinch goes back very slowly (≥2s).",
        "reliability": "Documento institucional primário integral obtido por link da própria OMS; tabela exatamente pertinente à classificação.",
        "examined": true,
        "sha256": "e17581cf0829bea6dd4711dda95a727cc298a4ffbd16d37fa2bb89a7b4b0fb65"
      }
    ],
    "observations": [
      "A Table12 do documento2013 apresenta ≥2s; seção de exame apresenta longerthan2s. O campo operacional conserva categoria muito lentamente sem converter tempo numérico; a regra de classificação usa os sinais da Table12."
    ]
  },
  "rdai": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1142326/",
        "title": "Racemic epinephrine compared to salbutamol in hospitalized young children with bronchiolitis; a randomized controlled clinical trial",
        "entity": "Langley JM et al.; BMC Pediatrics",
        "version_or_date": "2005-05-05",
        "checked_at": "2026-09-30T18:52:15Z",
        "locator": "Table1, reproduzindo Lowell etal1987; Methods",
        "excerpt": "Expiration: None, End, 1/2, 3/4, All; maximum4. Wheezing maximum8; retractions maximum9; total17.",
        "reliability": "Pesquisa primária revisada por pares com instrumento integral e atribuição à derivação original; fullTextXML do mesmo artigo examinado.",
        "examined": true,
        "sha256": "920cbad554fe732424beb443b4a079a72a965f2edfe95e2314cd09cbf506efa4"
      }
    ]
  },
  "strongkids": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12829223/",
        "title": "A comprehensive mobile nutritional application is associated with improved time efficiency and user experience in managing hospitalized children with malnutrition",
        "entity": "Maholarnkij S, Visuthranukul C etal.; BMC Pediatrics",
        "version_or_date": "2025-12-16",
        "checked_at": "2026-09-30T18:52:15Z",
        "locator": "Table1; Methods",
        "excerpt": "Subjective1; underlying highrisk disease/major surgery2; intake/loss1; weight loss/poor weightgain1. 0low,1–3moderate,4–5high.",
        "reliability": "Pesquisa primária revisada por pares em pacientes pediátricos internados1mês–18anos com ferramenta íntegra; distingue triagem de diagnóstico.",
        "examined": true,
        "sha256": "79a45fa3e8633dd3568681ba747c666834ab1517a0d1e3aef035cd8726409c85"
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11929289/",
        "title": "Comparison of two nutritional risk screening tools in hospitalized children with Japanese encephalitis",
        "entity": "Italian Journal of Pediatrics; autores do estudo de2025",
        "version_or_date": "2025-03-22",
        "checked_at": "2026-09-30T18:52:15Z",
        "locator": "Appendix,Table8",
        "excerpt": "Diarrhoea≥5/day; vomiting>3/day; not elective fasting; poor weight gain infants<1year.",
        "reliability": "Pesquisa primária que reproduz o formulário integral; utilizada para descritores, não para extrapolar prognóstico de encefalite a toda pediatria.",
        "examined": true,
        "sha256": "166dd4e3247ab8959a3e4cfb5ed31459d4981f87b11b9ba90ab5c51da8ba5088"
      }
    ]
  },
  "pediatric-gcs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.rch.org.au/clinicalguide/guideline_index/Head_injury/",
        "title": "Clinical Practice Guidelines: Head injury",
        "entity": "Royal Children’s Hospital Melbourne",
        "version_or_date": "Last Updated November 2021; current institutional URL examined2026-09-30",
        "checked_at": "2026-09-30T20:21:22.930527+00:00",
        "locator": "Primary survey and resuscitation, Glasgow Coma Score table, column<4years; neuroimaging indications",
        "excerpt": "<4years verbal5 alert/babbles/coosusualability;4lessusualwords/spontaneousirritablecry;3criesonlytopain;2moanstopain;1none.Motor5localisestopainorwithdrawstotouch. GCS≤13 moderate/severe injury; persistently14 needs observation/investigation.",
        "reliability": "Official pediatric hospital operational guideline; exact age-specific adaptation retained, no borrowing verbal descriptions from competing variants.",
        "sha256": "76ef27a2d9d312f434f7342ed0b3355dcebb1f0a3f4b4e381f5cc3dedd217690",
        "examined": true,
        "local_artifact": "sources/rch-gcs.html",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee."
      }
    ]
  },
  "yale-observation": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5495524/",
        "title": "The Yale Observation Scale Score and the Risk of Serious Bacterial Infections in Febrile Infants",
        "entity": "Nigrovic LE etal.; Pediatrics/PECARN",
        "version_or_date": "2017-07; doi10.1542/peds.2017-0695",
        "checked_at": "2026-09-30T20:22:10.034830+00:00",
        "locator": "Table1 entire six-domain YOS; Introduction; Methods/YOS score; Results and Conclusions",
        "excerpt": "Sixdomainsqualitycry,parentreaction,statevariation,color,hydration,socialresponse;each1,3,5;total6–30;≤10normalappearance. Derivedfebrilechildren<2years. ≤60dayinfantswithYOS≤10stillhadSBI9.6%/invasiveinfection1.8%; doesnotexclude.",
        "reliability": "Original multicentre peer-reviewed prospective cohort reproduces the complete instrument and documents its limitations. Unsupported11–15 riskcategory removed.",
        "sha256": "e5a581217ed6141e19c34c713f0b2bb39057f09efb51605cf57ed1980e6105e6",
        "examined": true,
        "local_artifact": "sources/yos-study-html.html",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee."
      }
    ]
  },
  "gorelick-10": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3182880/fullTextXML",
        "title": "Comparing the accuracy of the three popular clinical dehydration scales in children with diarrhea",
        "entity": "Pringle K etal.; International Journal of Emergency Medicine",
        "version_or_date": "2011-09-09; doi10.1186/1865-1380-4-58",
        "checked_at": "2026-09-30T20:24:02.503539+00:00",
        "locator": "Table2 complete10and4pointGorelick scale and footnotes; Methods/Discussion",
        "excerpt": "Tenbinarysigns:generalappearance,capillaryrefill,tears,mucousmembranes,eyes,breathing,pulses,skinelasticity,heartrate,urineoutput. HR=tachycardia withoutuniversal150; ≥3signs≥5%weightloss;≥7≥10%. Intended1month–5years; performance limited in observed Rwanda cohort.",
        "reliability": "Original peer-reviewed external validation contains all10 descriptors and explicit cutoffs; numerical source table read directly, avoids incomplete8signTable3 from prior source.",
        "sha256": "965af02a21017b04a7ca317b9248a45d66f686648e99dbd9f86719eeb719fe8e",
        "examined": true,
        "local_artifact": "sources/gorelick-original-validation.xml",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee."
      }
    ]
  },
  "downes": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11151355/fullTextXML",
        "title": "Management of neonates with respiratory distress syndrome in resource-limited settings",
        "entity": "Singh R, Munian LP, Memela NA; South African Family Practice",
        "version_or_date": "2024-05-22; doi10.4102/safp.v66i1.5938",
        "checked_at": "2026-09-30T20:29:00.165270+00:00",
        "locator": "Table1 entire Downes chart and footnotes",
        "excerpt": "RR<60/60–80/>80;retractionsnone/mild/severe;cyanosisnone/relievedbyO2/onO2;airentrygoodbilateral/milddecrease/none;gruntnone/stethoscope/ear;0–2each; <4no/mild,4–7respdistress,>7impendingfailure.",
        "reliability": "Peer-reviewed clinical review reproduces complete chart with original1970 attribution. Specific2024chart declared, without silently blending2020cyanosis40% or apnea variants. No oxygen prescription or unsupported surfactant cutoff inferred.",
        "sha256": "089e73973994a5d5aa7d0676c42e1a0c0d4270ed22cde29494a5df7ae152e3cd",
        "examined": true,
        "local_artifact": "sources/downes-management-review.xml",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee."
      }
    ]
  },
  "bacterial-meningitis-score": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12359784&format=json&resultType=core",
        "title": "Development and validation of a multivariable predictive model to distinguish bacterial from aseptic meningitis in children in the post-Haemophilus influenzae era",
        "entity": "Nigrovic LE,Kuppermann N,Malley R; Pediatrics",
        "version_or_date": "2002-10; doi10.1542/peds.110.4.712",
        "checked_at": "2026-09-30T20:25:36.934728+00:00",
        "locator": "Original structured abstract: Patients/Intervention/Results",
        "excerpt": "Previouslyhealthy29days–19years; Gram2points, ANC LCR≥1000,protein≥80mg/dL, peripheralANC≥10000,seizurebefore/atpresentation each1;max6;BMS0lowrisk in derivation/validation.",
        "reliability": "Original derivation abstract atEuropePMC supplies the complete5 predictors, inclusive boundaries, exact weights and original population. Full publisher manuscript was not obtained; exact claims are supported by inspected abstract.",
        "sha256": "849a5af59df8aaf7f96eca4d3921ba0d5ae1aa5aed96e5a7ab018d5c5a7ff00e",
        "examined": true,
        "local_artifact": "sources/bms-original2002-correct.html",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee.",
        "canonical_url": "https://pubmed.ncbi.nlm.nih.gov/12359784/"
      },
      {
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17200475&format=json&resultType=core",
        "title": "Clinical prediction rule for identifying children with cerebrospinal fluid pleocytosis at very low risk of bacterial meningitis",
        "entity": "Nigrovic LE etal.; JAMA/20USacademicEDs",
        "version_or_date": "2007-01-03; doi10.1001/jama.297.1.52",
        "checked_at": "2026-09-30T20:22:09.940259+00:00",
        "locator": "Original structured abstract: Context/Design,setting,andpatients/Results",
        "excerpt": "29days–19years; CSF WBC≥10cells/µL;noantibiotictreatmentbeforeLP; lowriskifallfivepredictorsabsent. Twofalse-negativebacterialmeningitispatientswereboth<2monthsold; riskverylow0.1%notzero.",
        "reliability": "Original multicentre validation defines eligible pleocytosis and antibiotic restriction, and concretely resolves infancy false-negative risk; no invented risk-free discharge.",
        "sha256": "ab1549a09e2b025c46f08080a0bd6d39acd753ae39b25e35ce669f99fb78cbfb",
        "examined": true,
        "local_artifact": "sources/bms2007ebi.html",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee.",
        "canonical_url": "https://pubmed.ncbi.nlm.nih.gov/17200475/"
      },
      {
        "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4543184/fullTextXML",
        "title": "Applying the bacterial meningitis score in children with cerebrospinal fluid pleocytosis: a single center’s experience",
        "entity": "Lee J etal.; Korean Journal of Pediatrics/Severance Hospital",
        "version_or_date": "2015-07-22; doi10.3345/kjp.2015.58.7.251",
        "checked_at": "2026-09-30T20:23:59.714823+00:00",
        "locator": "Table1 BMS; Methods/subjects,definitions,exclusioncriteria",
        "excerpt": "Gram2; otherfour1;BMS0verylow/>0notlow. Clinicalexclusionsincludecriticalillness/immunosuppression,CNSdevice/recentneurosurgery,otherbacterialinfection,suspectedencephalitis,CSFRBC≥10000; pleocytosis≥10.",
        "reliability": "Peer-reviewed original external validation provides operational exclusions and point diagram. Exclusions adopted conservatively and identified as2015validation additions, not claimed identical original2002 inclusion criteria.",
        "sha256": "6633ba1da9242e441033351ed158bb3a0848ef5e4a99cdb6f9c348c1e262b2aa",
        "examined": true,
        "local_artifact": "sources/bms-korea.xml",
        "integrity": "Full document or original structured abstract bytes saved; hash rechecked.",
        "correction_check": "No retraction/replacement notice identified in the examined document/current metadata; not an exhaustive bibliographic guarantee."
      }
    ]
  },
  "rsbi": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12304996/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC12304996/unicode",
        "title": "Predicting weaning failure from invasive mechanical ventilation: The promise and pitfalls of clinical prediction scores",
        "entity": "Gaddam et al.; World Journal of Critical Care Medicine; peer-reviewed narrative review",
        "version_or_date": "2025-09-09",
        "checked_at": "2026-09-30T20:23:54.186898+00:00",
        "locator": "RSBI section; Table1",
        "excerpt": "RSBI = respiratory frequency / tidal volume; 1-minute spontaneous measure; published threshold <105, affected by fever, pain, support method and neurological/cardiac factors. Value equal105 is not <105.",
        "reliability": "The full peer-reviewed review directly reproduces formula, original threshold and limitations; not extrapolated from unrelated score entries.",
        "sha256": "7fa7d6efbd3f794811917a74481600d10afbf4a9cc113a3cb801377eb2a662f4",
        "examined": true,
        "status_check": {
          "method": "EuropePMC core metadata of examined article",
          "checked_at": "2026-09-30T20:28:23.057056+00:00",
          "sha256": "36a95e0342080cbc40dbb43945a5483b26623aec40af8699036d4910dadda3e6",
          "comment_correction_list": null,
          "result": "No Erratum in/Retraction in exposed metadata. Comments, when present, are distinct from corrections; no material contradiction identified in read contract."
        }
      },
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/38443142/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE%3A%22AARC%20Clinical%20Practice%20Guideline%3A%20Spontaneous%20Breathing%20Trials%20for%20Liberation%20From%20Adult%20Mechanical%20Ventilation%22&format=json&resultType=core&pageSize=5",
        "title": "AARC Clinical Practice Guideline: Spontaneous Breathing Trials for Liberation From Adult Mechanical Ventilation.",
        "entity": "AARC clinicalpracticeguideline; Roberts etal; RespiratoryCare",
        "version_or_date": "2024-06-28",
        "checked_at": "2026-09-30T20:22:24.363687+00:00",
        "locator": "Originalindexedabstract, recommendations1and4",
        "excerpt": "We suggest that calculation of a rapid shallow breathing index is not needed to determine readiness for a spontaneous breathing trial. FiO2 shouldnotbeincreasedduringSBT.",
        "reliability": "Originalguidelineabstract directlysupports limited recommendation used; fulltext500/403, notclaimedread.",
        "sha256": "3dbc05c4cd257756d5759209b9c58f89d216ff7da21c2556a4713f4181131ec1",
        "examined": true,
        "status_check": {
          "result": "TwoCommentinrecords, nocorrection/retractionreported inexaminedcurrentmetadata"
        }
      }
    ]
  },
  "pf-ratio": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10870872/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC10870872/unicode",
        "title": "A New Global Definition of Acute Respiratory Distress Syndrome",
        "entity": "Matthay et al.; international consensus authors; American Journal of Respiratory and Critical Care Medicine",
        "version_or_date": "2024-01-01 journal; online2023",
        "checked_at": "2026-09-30T20:21:05.948621+00:00",
        "locator": "Table1; footnotes; oxygenation section",
        "excerpt": "Intubated ARDS P/F mild200<PF≤300, moderate100<PF≤200, severePF≤100 with PEEP≥5; all criteria required. Nonintubated requires HFNO≥30L/min or NIV/CPAPPEEP≥5. Measure at least30minutes after position/FiO2/flow changes. Altitude>1000m requires correction.",
        "reliability": "Original complete consensus report, read via NCBI BioC; numerical ratio card preserves neutral ranges and does not diagnose SDRA.",
        "sha256": "977e3e68e58a44dc48d8bd46c2c747457c69624e7172016abf338a71d2450845",
        "examined": true,
        "status_check": {
          "method": "EuropePMC current original PMID37487152 core metadata read",
          "checked_at": "2026-09-30T20:22:24.464279+00:00",
          "sha256": "6272db26b4bfdf2fb6f126391e269419a3ab00403155433364a5713b8e2240af",
          "result": "Four Comment in records; no Erratum in/Retraction in exposed metadata. No known correction/retraction identified in reads. This is a consensus proposal, not a formal society endorsement."
        }
      }
    ]
  },
  "sf-ratio": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10870872/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC10870872/unicode",
        "title": "A New Global Definition of Acute Respiratory Distress Syndrome",
        "entity": "Matthay et al.; international consensus authors; American Journal of Respiratory and Critical Care Medicine",
        "version_or_date": "2024-01-01 journal; online2023",
        "checked_at": "2026-09-30T20:21:05.948621+00:00",
        "locator": "Table1; footnotes; Oxygenation section; discussion oximetry limitations",
        "excerpt": "SpO2/FiO2 ranges315/235/148 valid onlySpO2≤97%; adequate waveform/placement, rest and30min after adjustments. Suspected dyshemoglobinemia invalidates oximetry; dark skin/poorperfusion can cause error, considerABG when diagnosis/managementaffected.",
        "reliability": "Original complete definition directly sustains formula thresholds and mandatory validity guard; no claim exactPF equivalence.",
        "sha256": "977e3e68e58a44dc48d8bd46c2c747457c69624e7172016abf338a71d2450845",
        "examined": true,
        "status_check": {
          "method": "EuropePMC current original PMID37487152 core metadata read",
          "checked_at": "2026-09-30T20:22:24.464279+00:00",
          "sha256": "6272db26b4bfdf2fb6f126391e269419a3ab00403155433364a5713b8e2240af",
          "result": "Four Comment in records; no Erratum in/Retraction in exposed metadata. No known correction/retraction identified in reads. This is a consensus proposal, not a formal society endorsement."
        }
      }
    ]
  },
  "murray-lis": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1766357/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC1766357/unicode",
        "title": "CESAR: conventional ventilatory support vs extracorporeal membrane oxygenation for severe adult respiratory failure",
        "entity": "Peek et al.; UK CESAR original trial protocol; BMC Health Services Research",
        "version_or_date": "2006-12-23",
        "checked_at": "2026-09-30T20:23:54.146912+00:00",
        "locator": "Appendix1 Murray score; inclusion section",
        "excerpt": "Adults18–65; all4parameters required andsum/4. PF≥300=0,225–299=1,175–224=2,100–174=3,<100=4; PEEP≤5/6–8/9–11/12–14/≥15; compliance≥80/60–79/40–59/20–39/≤19; CXR0–4quadrants. P/F protocolFiO2=1atleast20min. LIS>2.5 triggersdiscussion, not treatment.",
        "reliability": "Original protocol publishes fulloperational chart afterknown1989erratum of historical1988paper; validation is specifically CESAR4componentadult18–65version, not allhistorical LISversions.",
        "sha256": "9df46b16821f3c0529d308ddf0dc70da37ec7797cd5fb3d6319a5c6a80c1fd4a",
        "examined": true,
        "status_check": {
          "method": "EuropePMC core metadata of examined article",
          "checked_at": "2026-09-30T20:28:23.391294+00:00",
          "sha256": "1a0415b0d523aebd39181999afc76ea7c5284c62fdfdf24eb6fb7ffaf94fc2c4",
          "comment_correction_list": null,
          "result": "No Erratum in/Retraction in exposed metadata. Comments, when present, are distinct from corrections; no material contradiction identified in read contract."
        }
      }
    ]
  },
  "years": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10231008/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC10231008/unicode",
        "title": "Implementation of the YEARS algorithm to optimise pulmonary embolism diagnostic workup in the emergency department",
        "entity": "Duffy et al.; BMJ Open Quality; original implementation study",
        "version_or_date": "2023-05-01",
        "checked_at": "2026-09-30T20:24:48.205941+00:00",
        "locator": "Introduction paragraphs YEARS criteria; Methods and assay definition",
        "excerpt": "Adults>18; DVT signs,hemoptysis,PEmostlikely; noitemsnegativeD-dimer<1000µg/LFEU, ≥1item<500µg/LFEU; INNOVANCE Siemensassay reportingFEU; thesameassay wasusedoriginalderivation. ng/mL=µg/L numerically.",
        "reliability": "Original peer-reviewed implementation explicitly sustainsFEUandfullgeneralcontract; laterthan2017originalknownerratum. It doesnot substantiate pregnancy-adaptedcontract, which remains excluded.",
        "sha256": "ff1dd30d95a58d8ec7dba9c0e1c09195e45095a42885eac90b6ca3eacf0fa9d8",
        "examined": true,
        "status_check": {
          "method": "EuropePMC core metadata of examined article",
          "checked_at": "2026-09-30T20:28:23.095860+00:00",
          "sha256": "6e618b9d26c84abb4b46cdf9c411981ab6474f48506555d4c161da85ade8e7a1",
          "comment_correction_list": null,
          "result": "No Erratum in/Retraction in exposed metadata. Comments, when present, are distinct from corrections; no material contradiction identified in read contract."
        }
      }
    ]
  },
  "nafld-fibrosis-score": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5418560/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC5418560/unicode",
        "title": "Age as a Confounding Factor for the Accurate Non-Invasive Diagnosis of Advanced NAFLD Fibrosis",
        "entity": "McPherson et al.; American Journal of Gastroenterology; original multicentre agevalidation study",
        "version_or_date": "2016-10-11",
        "checked_at": "2026-09-30T20:23:53.945115+00:00",
        "locator": "Table1; Abstract/Methods cohort; Figure4 and Discussion",
        "excerpt": "NFS−1.675+.037age+.094BMI+1.13IFG/DM+.99AST/ALT−.013platelets−.66albumin. Lower−1.455, upper.676; age≥65validatedlower.12; originalupperunchanged. Cohort≤35performspoorly, AUROC.52. NAFLD excludesotherliverdisease/excessivealcohol.",
        "reliability": "Original multicentre studyreproducescompleteclassicformulaandvalidatesagecorrection; narrowficha>35conservativelyavoidscohort≤35 despiteFigurecaption<35.",
        "sha256": "4cbdecfb584a2dad4180d4a2d55e001e3210f04e2bebe315171cb6cd4b5ac108",
        "examined": true,
        "status_check": {
          "method": "EuropePMC core metadata of examined article",
          "checked_at": "2026-09-30T20:28:23.181903+00:00",
          "sha256": "6d2939aa25eeab82a7408a84bde78b657b8bafdb38e8152070b8e0d42338667b",
          "comment_correction_list": {
            "commentCorrection": [
              {
                "source": "MED",
                "id": "28381853",
                "reference": "Am J Gastroenterol. 2017 Apr;112(4):653-654. doi: 10.1038/ajg.2017.28",
                "type": "Comment in",
                "orderIn": 1
              },
              {
                "source": "MED",
                "id": "28381858",
                "reference": "Am J Gastroenterol. 2017 Apr;112(4):652-653. doi: 10.1038/ajg.2016.596",
                "type": "Comment in",
                "orderIn": 2
              },
              {
                "source": "MED",
                "id": "28469217",
                "reference": "Am J Gastroenterol. 2017 May;112(5):752-754. doi: 10.1038/ajg.2017.60",
                "type": "Comment in",
                "orderIn": 3
              }
            ]
          },
          "result": "No Erratum in/Retraction in exposed metadata. Comments, when present, are distinct from corrections; no material contradiction identified in read contract."
        }
      }
    ]
  },
  "psi-port": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.merckmanuals.com/professional/multimedia/table/risk-stratification-for-community-acquired-pneumonia-the-pneumonia-severity-index",
        "retrieval_url": "https://www.merckmanuals.com/professional/multimedia/table/risk-stratification-for-community-acquired-pneumonia-the-pneumonia-severity-index",
        "title": "Risk Stratification for Community-Acquired Pneumonia (the Pneumonia Severity Index)",
        "entity": "Merck Manual Professional; medically edited reference; tableadaptedFineMJ etal NEJM1997",
        "version_or_date": "Currenttable read2026-09-30; table-specificpublicationdate notexposed",
        "checked_at": "2026-09-30T20:25:26.677057+00:00",
        "locator": "Fulltabledemographics,comorbidities,exam,labanddisposition; footnotes",
        "excerpt": "Maleage/femaleage−10;nursing10,cancer30,liver20,CHF/CVD/renal10;mental20,RR≥30=20,SBP<90=20,temp≥40or<35=15,HR≥125=10;pH<7.35=30,BUN≥30=20,Na<130=20,glucose≥250=10,Hct<30=10,PaO2<60orSpO2<90=10,effusion10; bands≤70/71–90/91–130/>130. Hypoxemia can requireadmission independently.",
        "reliability": "Authoritative medically editedcompletechart, withlinktooriginalFine1997; operationalvalidationlimitedtoscoringstage. No inventedorfulloriginalclassIalgorithm.",
        "sha256": "2523aa0b76c952d2fdfb680bed17dc025366af9dc03d8dbd7d1a42c33e5d368a",
        "examined": true,
        "status_check": {
          "method": "CurrentnativeMerckManualtable+parentCAParticle read",
          "checked_at": "2026-09-30T20:28:24.671483+00:00",
          "result": "No correction/retractionnotice in currenttable; originalFine1997currentEuropePMCmetadataonlyCommentinrecords. Originalfulltext403; scoringstagetable sufficient, classIexcluded."
        }
      }
    ]
  },
  "modified-shock-index": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4129788/",
        "retrieval_url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4129788/",
        "title": "Modified shock index and mortality rate of emergency patients",
        "entity": "Liu YC et al.; World Journal of Emergency Medicine; Peking Union Medical College Hospital",
        "version_or_date": "2012;3(2):114–117; DOI10.5847/wjem.j.issn.1920-8642.2012.02.006",
        "locator": "Introduction; Methods/Selection and thresholds; Results/Multivariate analysis",
        "excerpt": "MSI is HR divided by MAP; patients10–100receivingIVfluids; exclude arrest without triage; MSI>1.3 or<0.7 predicts mortality in derivation cohort.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Excluída qualquer inferência fisiológica não necessária; cortes específicos da coorte, não normalidade universal.",
        "sha256": "a669be8ff3ead8ff2744f85215fde98659d655034123866a03260ca7274b83a4",
        "checked_at": "2026-09-30T20:23:59.099109+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      }
    ]
  },
  "age-shock-index": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5102870/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5102870/fullTextXML",
        "title": "Validation of the Shock Index, Modified Shock Index, and Age Shock Index for Predicting Mortality of Geriatric Trauma Patients in Emergency Departments",
        "entity": "Kim SY et al.; Journal of Korean Medical Science; national20EDinjurysurveillance",
        "version_or_date": "2016-12;31(12); DOI10.3346/jkms.2016.31.12.2026",
        "locator": "Abstract; Methods/Selection and Measurements; Discussion paragraphs on cutoff50",
        "excerpt": "AgeSI=age×SI; SI=HR/SBP. Injured patients≥65; excludeDOA,isolatedTBI,burn,drowning,intoxication,injury>6h. PrespecifiedAgeSI≥50; discussion states50overestimatedseverity in some geriatric patients.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Índice com interpretação restrita à população examinada e advertência de superestimação; não generalizar50.",
        "sha256": "fef034b9ac6abf76784a23798da7c14b7ead33428231160c1aefd8955624ffa1",
        "checked_at": "2026-09-30T20:24:47.248456+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      }
    ]
  },
  "add-rs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9860464/",
        "retrieval_url": "https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_xml/PMC9860464/unicode",
        "title": "2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease",
        "entity": "ACC/AHA; Isselbacher et al.",
        "version_or_date": "2022; DOI10.1016/j.jacc.2022.08.004",
        "locator": "Table24/ADD-RSItems and footnote; Section7.2/Diagnostic evaluation",
        "excerpt": "Riskcategory1pointif≥1factors;0–3;0low,1moderate,2–3high. Conditions include thoracicaneurysm; focalneurologicaldeficitWITHpain and newARmurmurWITHpain.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Um ponto por grupo, não por fator; nenhuma regra autônoma de exclusão.",
        "sha256": "119ec2972ae6b9e86afa3a570e5581a561be086df3810238092eb32442e51e1c",
        "checked_at": "2026-09-30T20:26:48.407764+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      }
    ]
  },
  "rems": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5665602/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC5665602/fullTextXML",
        "title": "Comparison of the Mortality in Emergency Department Sepsis Score, Modified Early Warning Score, Rapid Emergency Medicine Score and Rapid Acute Physiology Score for predicting the outcomes of adult splenic abscess patients in the emergency department",
        "entity": "Hung et al.; PLoS ONE; original multicentre ED study",
        "version_or_date": "2017-11-01; DOI10.1371/journal.pone.0187495",
        "locator": "Table2/RapidEmergencyMedicineScore; introduction and methods",
        "excerpt": "Age<45/45–54/55–64/65–74/>74=0/2/3/5/6;HR70–109=0,55–69or110–139=2,40–54or140–179=3,≤39or>179=4;MAP70–109=0,50–69or110–129=2,130–159=3,≤49or>159=4;RR12–24=0,10–11or25–34=1,6–9=2,35–49=3,≤5or>49=4;SpO₂>89=0,86–89=1,75–85=3,<75=4;GCS14–15=0,11–13=1,8–10=2,5–7=3,3–4=4.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Texto integral de estudo original reproduz tabela completa; categorias universais6/10 e probabilidades não sustentadas foram retiradas. A coorte específica não foi generalizada como calibração prognóstica.",
        "sha256": "f89495e66553d7d473d9ee3f3df18bfd85192d65c17e03f26ceb63c9189f98d2",
        "checked_at": "2026-09-30T20:21:33.001950+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      }
    ]
  },
  "rosier": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/16239179/",
        "retrieval_url": "https://pubmed.ncbi.nlm.nih.gov/16239179/",
        "title": "The Recognition of Stroke in the Emergency Room (ROSIER) scale: development and validation of a stroke recognition instrument",
        "entity": "Nor AM et al.; Lancet Neurology",
        "version_or_date": "2005; DOI10.1016/S1474-4422(05)70201-5",
        "locator": "Original abstract/Methods and Findings",
        "excerpt": "Sevenitems;score−2to+5;LOC,convulsion;face/arm/legweakness,speech,visualfield;stroke likely at>0;excludeTIAwithoutsigns/symptomswhenassessed.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Resumo da derivação examinado; não foi alegada leitura do fulltext Lancet bloqueado.",
        "sha256": "fc287326ee3f94956d62e1bce0306bd616795e45d067d6a2a753cd2e667fc3fc",
        "checked_at": "2026-09-30T20:22:45.753442+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7864127/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7864127/fullTextXML",
        "title": "The validity of recognition of stroke in the emergency room (ROSIER) scale in the diagnosis of Iranian patients with acute ischemic stroke in the emergency department",
        "entity": "Zangi et al.; Journal of Emergencies Trauma and Shock",
        "version_or_date": "2021Jan–Mar; DOI10.4103/2452-2473.301914",
        "locator": "Table1/ROSIERcalculation; its footnote",
        "excerpt": "LOC/syncope−1,seizure−1,newasymmetricface/arm/legweakness+1each,new speechdisturbance+1,new visualfielddefect+1;positive>0;≤0doesnotexclude.",
        "reliability": "Documento original da entidade/autores indicados; texto operacional efetivamente examinado, com limites de aplicabilidade. Tabela operacional sustenta critérios, confirmados por resumo original. Taxas de acurácia não copiadas: Tabela4 e discussão contêm inconsistências entre>0/≥1 em escore inteiro e entre AUCs.",
        "sha256": "1f8d43e8c5321c1a1a1c4a1caaa88b0ca85b4f5893965409efcaa5931f2fc73e",
        "checked_at": "2026-09-30T20:29:30.563275+00:00",
        "examined": true,
        "retraction_or_supersession_check": "Texto e metadados acessíveis examinados; documento não identificado como retratado nem substituído quanto a esta definição histórica do instrumento. Não foi alegada busca exaustiva de todos os registros de retratação.",
        "metadata_check": "Metadados atuais dos registros primários lidos quando disponíveis; nenhuma retratação/correção identificada para a definição usada neste candidato. Consultas de metadados e limites registrados em sources/metadata-checks.json."
      }
    ]
  },
  "comfort-b": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.comfortassessment.nl/web/files/4114/2919/4154/COMFORT_behavior_scale___final_version_April_2015.pdf",
        "sha256": "8a4ad18df32d2c5a10a93d1a0cdaeb1ee699758c2403bfa5a370b2f22d59c6ad",
        "checked_at": "2026-09-30T20:27:05.186328+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/comfort-official-2015.pdf",
        "title": "COMFORT Behavior Scale",
        "entity": "Monique van Dijk e Erwin Ista; Erasmus MC Sophia / portal COMFORTassessment",
        "version_or_date": "April 2015",
        "locator": "p.1: seis componentes e resposta respiratória alternativa a choro",
        "excerpt": "Total 6–30; physical movement: occasional (three or fewer), frequent (more than three); respiratory response only in mechanically ventilated children; crying only in spontaneously breathing children.",
        "reliability": "Formulário no próprio portal dos autores/desenvolvedores; identidade conferida também no About us e portal atual de instrumentos.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4846705/",
        "sha256": "a93f9be0712404a1820a0d102d500f2fe8a65ea5af2ec1fccf70fe5769aad489",
        "checked_at": "2026-09-30T20:20:38.518341+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/espnic-consensus.html",
        "title": "Clinical recommendations for pain, sedation, withdrawal and delirium assessment in critically ill infants and children",
        "entity": "ESPNIC / Intensive Care Medicine; Harris et al.",
        "version_or_date": "2016",
        "locator": "Table 4; sedation assessment discussion",
        "excerpt": "COMFORT behaviour: 0–16 years; <11 oversedation, 11–22 adequate sedation, >22 undersedation.",
        "reliability": "Consenso de sociedade europeia especialista em terapia intensiva pediátrica, revisado por pares; sustenta população e cortes, sem transformar corte em ajuste automático.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      }
    ],
    "variant": "Instrumento e população como descritos no patch",
    "implementation_status": "PATCH_LOCAL_TESTADO; publicação pertence ao coordenador root"
  },
  "sbs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.marthaaqcurley.com/uploads/8/9/8/6/8986925/sbs-eng_version_2024.09.25.pdf",
        "sha256": "85340d6ecd7197320edf1845a62b7dce6170ab6731c84271f58f942c7a7a21b1",
        "checked_at": "2026-09-30T20:24:33.400330+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/sbs-2024.pdf",
        "title": "State Behavioral Scale (SBS)",
        "entity": "Martha A. Q. Curley, autora do instrumento",
        "version_or_date": "2024-09-25 filename; copyright2023",
        "locator": "p.1: score −3 to +2; sete dimensões",
        "excerpt": "Score as patient response to voice then touch then noxious stimuli; −3 unresponsive; 0 awake and able to calm; +2 agitated.",
        "reliability": "Formulário vigente disponível no portal da própria autora; aberto integralmente, critérios confrontados com tabela 3 do estudo original.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://www.marthaaqcurley.com/sbs.html",
        "sha256": "5f0395b0042eead670ffd195f0e619bd5f146371b23491ddaffb82682078f747",
        "checked_at": "2026-09-30T20:23:20.602014+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/sbs-author.html",
        "title": "SBS — Guidelines and permission",
        "entity": "Martha A. Q. Curley",
        "version_or_date": "Página vigente consultada2026-09-30",
        "locator": "Scoring Method; Copyright and Permission",
        "excerpt": "Observe seven dimensions then assign a score from −3 to +2 that best describes patient state.",
        "reliability": "Fonte autoral normativa vigente. Foi feito resumo factual próprio com link; não se afirma autorização para republicação integral/tradução certificada do formulário.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1626525/?report=xml",
        "sha256": "0cc9168c1cb394b729570cb38883ef129e686b184b792534e073de5f362a6bfa",
        "checked_at": "2026-09-30T20:22:40.980918+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/sbs-alt.html",
        "title": "State Behavioral Scale (SBS) A Sedation Assessment Instrument for Infants and Young Children Supported on Mechanical Ventilation",
        "entity": "Curley, Harris, Fraser, Johnson, Arnold; Pediatric Critical Care Medicine",
        "version_or_date": "2006-03; DOI10.1097/01.PCC.0000200955.40962.38",
        "locator": "Table3; study population/Table1",
        "excerpt": "Original validation population 6 weeks to6 years, mechanically ventilated; ordinal score−3 to+2.",
        "reliability": "Artigo original completo lido via PMC; sustenta população original, não universalidade em todos os pacientes pediátricos.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      }
    ],
    "variant": "Instrumento e população como descritos no patch",
    "implementation_status": "PATCH_LOCAL_TESTADO; publicação pertence ao coordenador root"
  },
  "wat1": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://familynursing.ucsf.edu/file/permission-to-use-the-wat-1-and-guidelines-12223-ccpdf-0",
        "sha256": "655be2b440f98601055f79e66e9691f4b0a4c5f863b104f879d0993af5a44ba1",
        "checked_at": "2026-09-30T20:22:41.009420+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/wat-permission.pdf",
        "title": "Permission to use WAT-1 and Withdrawal Assessment Guidelines",
        "entity": "Linda S. Franck e Martha A. Q. Curley; UCSF Family Nursing",
        "version_or_date": "2023 file12223; copyright2007",
        "locator": "p.1 Interpretation; pp.2–3 Description and Scoring Method",
        "excerpt": "11 item/12 point scale; evidence identifies withdrawal as WAT-1≥3; startle to touch severe; temperature remains>37.8 more frequently than not.",
        "reliability": "Documento autoral integral atualmente disponibilizado pelo portal universitário; critérios operacionais 2023 utilizados explicitamente, sem misturar formulário/PT2013.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://familynursing.ucsf.edu/withdrawal-assessment-tool-1-wat-1",
        "sha256": "d424223858c65f2451e85d7a0f424c6509abcea7522e3b0680789095825243df",
        "checked_at": "2026-09-30T20:21:49.750499+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/wat-home.html",
        "title": "Withdrawal Assessment Tool-1 (WAT-1)",
        "entity": "UCSF Family Nursing",
        "version_or_date": "Página vigente2026-09-30",
        "locator": "Current Permission and Guidelines link; language forms",
        "excerpt": "Portal links permission/guidelines2023 and downloadable forms; current Box English/Brazilian file download returned401, not falsely examined.",
        "reliability": "Portal universitário da autora confirma origem e vigência do guia aberto; arquivos Box atuais não foram certificados por leitura.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      }
    ],
    "variant": "WAT-1 guia2023 explicitamente versionado",
    "implementation_status": "PATCH_LOCAL_TESTADO; publicação pertence ao coordenador root"
  },
  "pelod2": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.espnic.eu/calcolatori/Paediatric%20Logistic%20Organ%20Dysfunction%202%20Score%20Calculator%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC_files.htm",
        "sha256": "deb6d2e98db787e24d2b0d1e396a311ce58303bd5bb4cb9b4960ce37ecc32e64",
        "checked_at": "2026-09-30T20:28:45.494973+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/pelod-espnic.html",
        "title": "Paediatric Logistic Organ Dysfunction2 Score Calculator",
        "entity": "S. Leteurtre e JB. Baudelet; ESPNIC/GFRUP; Intensive Care Unit Lille University Hospital",
        "version_or_date": "Ferramenta autoral vigente consultada2026-09-30; snapshot2021 dates in UI",
        "locator": "Good to know before scoring; age strata; organ-specific HELP; footer authors",
        "excerpt": "Worst values in24h; mean BP not during crying/agitation; GCS before sedation; P/F normal convention in cyanotic congenital heart disease; education and research only.",
        "reliability": "Calculadora disponibilizada pela sociedade e assinada pelo autor original do PELOD-2; limites de aplicação preservados.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://www.espnic.eu/calcolatori/Paediatric%20Logistic%20Organ%20Dysfunction%202%20Score%20Calculator%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC_files/40c8f2556e4f9a5f1dd8d3bc65f4f155.js",
        "sha256": "6c5595bcfd3e975dc6ba0b64611bf34aba64b4e653c8e44f8a0bada4f8f1372e",
        "checked_at": "2026-09-30T20:29:50.747578+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/pelod-script-14.js",
        "title": "PELOD-2 author calculator algorithm",
        "entity": "ESPNIC/GFRUP / Leteurtre and Baudelet",
        "version_or_date": "Snapshot consulted2026-09-30",
        "locator": "LimitScoreMBP, LimitScoreCreatinin, LimitScoreGCS, LimitScoreLactate, LimitScorePlatelets; lines4414–4618",
        "excerpt": "MAP normal cutoffs46/55/60/62/65/67mmHg; creatinine2-point cutoffs70/23/35/51/59/93µmol/L in six age strata.",
        "reliability": "Código público da calculadora dos autores examinado como especificação operacional. O bug openupper=true em PCO₂94 foi identificado; não foi copiado.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      },
      {
        "url": "https://www.medbc.com/annals/review/vol_32/num_2/text/vol32n2p135.pdf",
        "sha256": "23214a81ec55fca5189d0017531c467fc377b5b2a32b85f516f2467e0911cde7",
        "checked_at": "2026-09-30T20:39:44.113912+00:00",
        "path": "/workspace/soberania-run-20260930T201750Z/escores-ped/icu-sources/pelod-burn-table.pdf",
        "title": "PELOD-2 score as a model for predicting mortality in pediatric burn injury",
        "entity": "Dewi, Christie, Wardhana, Fadhilah, Pardede; Annals of Burns and Fire Disasters",
        "version_or_date": "2019-06; accepted2019-06-17",
        "locator": "p.137 TableI, Respiratory PCO₂ row only",
        "excerpt": "PCO₂≤58→0;59–94→1;≥95→3.",
        "reliability": "Tabela revisada por pares que reproduz PELOD-2 original2013 e resolve a inclusividade de94 do bug da implementação pública. Não se adota seu novo modelo de mortalidade nem suas duas células de PAM com erros de transcrição; PAM e creatinina seguem fonte autoral ESPNIC.",
        "examined": true,
        "integrity_check": "Documento completo com título/autoria e tabela/trecho efetivamente lidos; não usar respostas reCAPTCHA como documentos.",
        "retraction_or_supersession_check": "Nenhum aviso de retratação/erratum observado no documento e portal consultados. Não representa pesquisa universal de retratações desconhecidas."
      }
    ],
    "variant": "Instrumento e população como descritos no patch",
    "implementation_status": "PATCH_LOCAL_TESTADO; publicação pertence ao coordenador root"
  },
  "pim3": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.espnic.eu/calcolatori/Paediatric%20Index%20of%20Mortality%203%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC.html",
        "title": "Paediatric Index of Mortality 3 — calculator and scoring definitions",
        "entity": "S. Leteurtre and JB. Baudelet, ESPNIC/GFRUP; Intensive Care Unit Lille University Hospital",
        "version_or_date": "Página autoral vigente consultada 2026-09-30; versão PIM3 de Straney et al.2013",
        "checked_at": "2026-09-30T20:32:52.694318+00:00",
        "locator": "Good to know before scoring; four HELP sections; all 16 diagnosis entries; footer; hierarchy note",
        "excerpt": "First face-to-face contact to 1 hour after ICU arrival, FIRST measurements; unknown values explicitly available; SBP=0 cardiac arrest and 30 shock unmeasurable; low/high/very-high diagnosis lists; very-high > high > low; education and research only.",
        "reliability": "Calculadora pública oficial da sociedade especialista com autoria identificada e critérios operacionais completos; sustenta coleta, defaults, categorias e finalidade. Não cria regra prescritiva nem validação humana.",
        "sha256": "922186f075d3a54168a0c8f70944a5e59daa8c6c0547aa94032f51c5f197b90d",
        "examined": true,
        "local_artifact": "icu-sources/pim3-espnic.html",
        "integrity": "Documento ou metadados originais completos salvos; SHA-256 dos bytes conferido.",
        "correction_check": "Sem aviso de retratação/substituição na página autoral e registro bibliográfico consultados; não é garantia de busca exaustiva.",
        "access_scope": "Full normative page / public authored algorithm / full article"
      },
      {
        "url": "https://www.espnic.eu/calcolatori/Paediatric%20Index%20of%20Mortality%203%20_%20Professional%20Resources%20_%20Education%20-%20European%20Society%20of%20Paediatric%20Neonatal%20Intensive%20Care%20-%20ESPNIC_files/a8e9b36704e17e9c0f2e3bdd29fc6e35.js.download",
        "title": "PIM3 authored calculator algorithm",
        "entity": "Leteurtre/Baudelet, ESPNIC/GFRUP",
        "version_or_date": "Algoritmo público da página autoral consultado 2026-09-30",
        "checked_at": "2026-09-30T20:36:26.661968+00:00",
        "locator": "Lines 4414–4518 LimitScore*; calcScoreValueByItemID; lines4909/4943",
        "excerpt": "Unknown SBP term −2.70096; known SBP −0.0430768*SBP+0.1715711*SBP²/1000. Unknown oxygen term0.096921862=0.4213994*0.23; known oxygen=0.4213994*(FiO2%/PaO2mmHg). BE term0.0671255*abs(BE), unknown0. Intercept−1.792793; pupil3.823309; ventilation0.9763; elective−0.5378016; procedure−1.224559/−0.8761848/−1.516403; risk−2.176649/1.072542/1.622484.",
        "reliability": "Código público carregado pela página autoral, aberto e examinado como contrato da versão ESPNIC. A convenção PAS ND usa coeficientes arredondados; difere ligeiramente de entrada120 com coeficientes de casas adicionais. Preservada explicitamente, sem misturar silenciosamente variantes.",
        "sha256": "87e749e0cf7505c4bbef159b901c0b940970120453dd5978a7562d4a6f38d457",
        "examined": true,
        "local_artifact": "icu-sources/pim-script.js",
        "integrity": "Documento ou metadados originais completos salvos; SHA-256 dos bytes conferido.",
        "correction_check": "Sem aviso de retratação/substituição na página autoral e registro bibliográfico consultados; não é garantia de busca exaustiva.",
        "access_scope": "Full normative page / public authored algorithm / full article"
      },
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/23863821/?format=pubmed",
        "title": "Paediatric index of mortality 3: an updated model for predicting mortality in pediatric intensive care",
        "entity": "Straney, Clements, Parslow, Pearson, Shann, Alexander, Slater; ANZICS Paediatric Study Group/PICANet; Pediatr Crit Care Med",
        "version_or_date": "2013-09; PMID23863821; DOI10.1097/PCC.0b013e31829760cf",
        "checked_at": "2026-09-30T20:24:33.291956+00:00",
        "locator": "MEDLINE AB, PATIENTS; CONCLUSIONS",
        "excerpt": "Children younger than18 at admission; 53,112 admissions in60 ICUs in Australia/New Zealand/Ireland/UK2010–2011. Patients transferred to another ICU excluded from model cohort. International standard for comparison of risk-adjusted mortality in groups.",
        "reliability": "Registro original MEDLINE com resumo estruturado lido integralmente; sustenta população de derivação, sem alegar leitura do texto pago nem performance universal.",
        "sha256": "5a5ab58387991e444f41839003f14171e39b380124d349310e962b329359d708",
        "examined": true,
        "local_artifact": "icu-sources/pim-original.html",
        "integrity": "Documento ou metadados originais completos salvos; SHA-256 dos bytes conferido.",
        "correction_check": "Sem aviso de retratação/substituição na página autoral e registro bibliográfico consultados; não é garantia de busca exaustiva.",
        "access_scope": "Original structured MEDLINE abstract, not full publisher article"
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11554295/",
        "title": "Clinical scoring systems in pediatric intensive care — practical guide",
        "entity": "Critical Care Science",
        "version_or_date": "2024; PMC11554295",
        "checked_at": "2026-09-30T20:20:38.282939+00:00",
        "locator": "Table2, PIM3 row, Special considerations",
        "excerpt": "Probability of death is not applicable at patient level and cannot be used for an individual diagnostic or therapeutic decision in patient management.",
        "reliability": "Artigo completo revisado por pares aberto, tabela e limites lidos; sustenta finalidade de grupo. Fórmula publicada arredondada identificada, implementação utiliza a variante autoral ESPNIC com casas adicionais.",
        "sha256": "93235e6b8ecac360d45210463b98558a3dfb23b552ef40132813067ef12e7678",
        "examined": true,
        "local_artifact": "icu-sources/icu-practical.html",
        "integrity": "Documento ou metadados originais completos salvos; SHA-256 dos bytes conferido.",
        "correction_check": "Sem aviso de retratação/substituição na página autoral e registro bibliográfico consultados; não é garantia de busca exaustiva.",
        "access_scope": "Full normative page / public authored algorithm / full article"
      }
    ],
    "variant": "PIM3 · algoritmo autoral ESPNIC; full-precision known terms, explicit native unknown defaults",
    "implementation_status": "PATCH_LOCAL_TESTADO; publicação exige integração e verificação pelo coordenador root",
    "authorization": "Correção contextual previamente autorizada pelo usuário; sem aprovação rotineira adicional",
    "review_limits": "A validação é documental/técnica. Não é homologação clínica oficial ou certificação profissional humana."
  },
  "smart-cop": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.mdcalc.com/calc/3914/smart-cop-score-pneumonia-severity",
        "entity": "MDCalc; referência médica editorial; conteúdo Jennifer Chen, MD. Criador nominal Patrick Charles, sem afirmar aprovação dele.",
        "title": "SMART-COP Score for Pneumonia Severity",
        "version_or_date": "MDCalc calculator versionNumber=1; publishedAt=2022-04-21T20:29:24.462Z; cmeLastReviewed='2025-04-15 00:00:00+00+00'; documento corrente lido2026-09-30",
        "checked_at": "2026-09-30T21:32:45.817847+00:00",
        "sha256": "a823f3fcffd90b76b4d0a858ed5709fac01de37b5577d06f4832d5ca14694ffc",
        "examined": true,
        "locator": "Tabela integral de pontuação, input_schema idade/condicionalidade e Instructions",
        "excerpt": "Adultos ≥18 anos com achados clínicos/radiológicos de CAP, sem imunossupressão significativa. PAS <90: 2; multilobar: 1; albumina <3,5: 1; FR ≥25 se idade ≤50 ou ≥30 se >50: 1; FC ≥125: 1; confusão nova: 1; oxigenação ≤50: PaO₂ <70 ou SaO₂ ≤93 ou P/F <333, e >50: <60 ou ≤90 ou <250: 2; pH arterial <7,35: 2. Faixas 0–2/3–4/5–6/≥7.",
        "reliability": "Contrato completo por entidade editorial médica pertinente; conflitos com tabelas secundárias pH7.30/PASpeso1 não são incorporados. Leitura do original Charles2008 limitou-se à metadata/abstract; não é rotulada texto original examinado.",
        "status_check": {
          "method": "Página/schema editorial corrente e metadata EuropePMC das referências primárias; comparação de finalidade atual",
          "checked_at": "2026-09-30T21:39:20.112375+00:00",
          "result": "Nenhuma indicação de retratação ou correção material encontrada na página atual. SMARTmetadata contém Comment in, não Erratum/Retraction; Imriemetadata não expõe Erratum/Retraction. MELD2016 foi substituído para determinadas políticas atuais e está limitado à reprodução histórica, sem alegação de política vigente."
        }
      }
    ]
  },
  "glasgow-imrie": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.mdcalc.com/calc/3287/glasgow-imrie-criteria-severity-acute-pancreatitis",
        "entity": "MDCalc; referência médica editorial, criador nominal Clem Imrie.",
        "title": "Glasgow-Imrie Criteria for Severity of Acute Pancreatitis",
        "version_or_date": "MDCalc calculator versionNumber=1; publishedAt=2022-04-21T20:29:14.592Z; cmeLastReviewed=None; documento corrente lido2026-09-30",
        "checked_at": "2026-09-30T21:33:37.151557+00:00",
        "sha256": "e4e70c0ff526012148f01fc672379d51ba5c1d40d67096bdf7e386415f183d2a",
        "examined": true,
        "locator": "Tabela integral de oito critérios; Formula/PANCREAS e Next steps/critical actions 48h",
        "excerpt": "Oito variáveis, LDH sem AST: PaO₂ <59,3 mmHg (publicado 7,9 kPa como aproximação), idade >55, WBC >15.000/µL, Ca <8 mg/dL, BUN >44,8 mg/dL (ureia >16 mmol/L), LDH >600 U/L, albumina <3,2 g/dL, glicose >180 mg/dL. Soma de 1 por critério; ≥3 aumenta probabilidade de gravidade histórica. Valores mais anormais na janela inicial de 48 h; aplicar somente após concluí-la.",
        "reliability": "Variante editorial integral e identificada de oito variáveis/LDH, corroborada pela tabela1 Chan/Shelat2022 aberta; não combina AST alternativa e não converte 7.9kPa aproximado em novo corte. Fonte primária Blamey1984 metadata confirma retirada de um fator de nove; PDF/textointegral não acessível, sem alegação de leitura.",
        "status_check": {
          "method": "Página/schema editorial corrente e metadata EuropePMC das referências primárias; comparação de finalidade atual",
          "checked_at": "2026-09-30T21:39:20.112544+00:00",
          "result": "Nenhuma indicação de retratação ou correção material encontrada na página atual. SMARTmetadata contém Comment in, não Erratum/Retraction; Imriemetadata não expõe Erratum/Retraction. MELD2016 foi substituído para determinadas políticas atuais e está limitado à reprodução histórica, sem alegação de política vigente."
        }
      }
    ]
  },
  "meld-na": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.mdcalc.com/calc/78/meld-score-model-end-stage-liver-disease-12-older",
        "entity": "MDCalc; referência médica editorial; conteúdo Pranav Patel, MD; criador Patrick S. Kamath tem entrevista aprovada na página (não aprovação regulatória).",
        "title": "MELD Na (UNOS/OPTN) – contrato histórico janeiro 2016",
        "version_or_date": "MDCalc calculator versionNumber=1; publishedAt=2022-04-21T20:29:46.465Z; cmeLastReviewed='2025-04-15 00:00:00+00+00'; documento corrente lido2026-09-30",
        "checked_at": "2026-09-30T21:28:39.307937+00:00",
        "sha256": "f88242034a86322d1c32b18727804d95aae9a5662c95a365c87917926576934b",
        "examined": true,
        "locator": "Evidence/About/Formula: texto integral que identifica OPTNpolicyjan2016p4–5; inputSchema dialysis; calculador de exemplos sintéticos na página pública",
        "excerpt": "Expressão = 0,957 ln(Cr) + 0,378 ln(bili) + 1,120 ln(INR) + 0,643; arredondar à décima antes de ×10. Ajuste Na só se MELD(i)>11: Mi + 1,32(137−Na) − 0,033 Mi(137−Na). Cr/bili/INR mínimo 1; Cr=4 se >4, ≥2 diálises em 7 dias ou CVVHD ≥24 h em 7 dias. Na 125–137; máximo 40. Referência ≥12 anos; ficha preserva adultos. Resultado final inteiro observado em oito exemplos sintéticos do calculador público.",
        "reliability": "Documento editorial completo com autoria médica e versão confirmadas sustenta a fórmula histórica específica. O PDF original OPTN redireciona para homeHRSA, não foi lido; referências institucionais UW/Stanford atuais passaram aMELD3.0. Aplicação é histórica/descritiva, sem regras de alocação atual, mortalidade individual ou exceções.",
        "status_check": {
          "method": "Página/schema editorial corrente e metadata EuropePMC das referências primárias; comparação de finalidade atual",
          "checked_at": "2026-09-30T21:39:20.112732+00:00",
          "result": "Documento editorial histórico completo lido. PDF original OPTN não acessível e não usado como evidência examinada. Fórmulas institucionais UW/Stanford atuais passaram a MELD 3.0; o contrato de 2016 fica identificado como histórico, sem alegar política de alocação vigente. Nenhuma nota de retratação encontrada na página editorial corrente."
        },
        "functional_verification": {
          "url": "https://www.mdcalc.com/calc/78/meld-score-model-end-stage-liver-disease-12-older",
          "checked_at": "2026-09-30T21:39:39.272140+00:00",
          "cases_checked": 8,
          "result": "Oito exemplos sintéticos observados em navegador; confirmei piso6, corte inicial11/12, resultado inteiro após ajuste e diálise. O caso extremo Cr12/bili80/INR10/Na100 não forneceu resultado externo e não foi contado como oracle. Máximo40 tem suporte no texto documental."
        }
      }
    ]
  },
  "lams": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://file.lacounty.gov/SDSInter/dhs/1040516_1232StrokeCVATIA.pdf",
        "title": "Treatment Protocol: Stroke/CVA/TIA, ref.1232",
        "entity": "Los Angeles County Department of Health Services",
        "version_or_date": "Revised 07-01-25 (2025-07-01)",
        "checked_at": "2026-09-30T21:27:37.671466+00:00",
        "retrieved_at": "2026-09-30T21:27:37.671466+00:00",
        "locator": "pp.1–3, item 8, item 10, considerations2–3",
        "excerpt": "Facial droop absent0/present1; arm absent0/drifts down1/falls rapidly2; grip normal0/weak1/no grip2. Score 4–5 raises routing priority in this local network; suspected stroke remains evaluable despite negative mLAPSS.",
        "reliability": "Documento institucional operacional vigente no arquivo consultado; sustenta categorias, contexto e limites de aplicação local.",
        "sha256": "54afe35dbc01b4e738355ad4bb2eddcd9c68ffc24883c0a0c1a4aa7b8c3f2c39",
        "examined": true
      },
      {
        "url": "https://www.strokenetworkseo.ca/sites/default/files/files/lams_scorecard_for_south_east_8.5_x_5.5_print_version_jan_13_2021.pdf",
        "title": "LAMS Scorecard",
        "entity": "Southeastern Ontario Regional Stroke Network",
        "version_or_date": "2021-01-13",
        "checked_at": "2026-09-30T21:27:37.672363+00:00",
        "retrieved_at": "2026-09-30T21:27:37.672363+00:00",
        "locator": "pp.1–2, steps 1–4 and key messages",
        "excerpt": "Arm(s) at 90° and held 10seconds; 0absent/1drifts down/2falls rapidly; hand grip0normal/1weak/2none; total5, positive≥4.",
        "reliability": "Formulário operacional da rede regional de AVC; complementa técnica de exame, sem importar protocolo de transporte canadense.",
        "sha256": "1220fce28fd3544182a8e59ecd32d0e9929047fffd7f9682bb93dc50415a2bd4",
        "examined": true
      }
    ],
    "operational_version_explicit": true,
    "clinical_scope": "Instrumento consultivo, sem prescrição ou autorização autônoma de procedimentos."
  },
  "morse": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://download.lww.com/docucare/assets/morse-fall-scale.pdf",
        "title": "S.5 Morse Fall Scale, adapted with permission SAGE",
        "entity": "LWW DocuCare; SAGE Publications",
        "version_or_date": "Documento S.5, sem data de revisão informada; consultado 2026-09-30",
        "checked_at": "2026-09-30T21:27:37.668554+00:00",
        "retrieved_at": "2026-09-30T21:27:37.668554+00:00",
        "locator": "pp.1–3, six items, scoring definitions and sample risk level",
        "excerpt": "Fall immediate/within3months25; secondary diagnosis15; aid0/15/30; IV20; gait0/10/20; ability self-assessment0/15. Sample bands0–24,25–50,≥51. Calibrate by facility/unit.",
        "reliability": "Editora médica identificada, instrumento adaptado com permissão SAGE e descritores completos. Os cortes são explicitamente um exemplo e não validade universal.",
        "sha256": "e44af294cc21c50d5043e89fbdf457b4135bc72e9b78edc689d8cb1e5c9434fa",
        "examined": true
      },
      {
        "url": "https://www.patientsafety.va.gov/docs/fallsToolkit/morse_falls_pocket_card.pdf",
        "title": "Morse Fall Scale pocket card",
        "entity": "US Department of Veterans Affairs, National Center for Patient Safety",
        "version_or_date": "Sem data de revisão informada; consultado 2026-09-30",
        "checked_at": "2026-09-30T21:27:37.666432+00:00",
        "retrieved_at": "2026-09-30T21:27:37.666432+00:00",
        "locator": "p.1, factor-based assessment and completion times",
        "excerpt": "Complete on admission, at change of condition, transfer to new unit and after a fall; risk is more than a total score.",
        "reliability": "Instituição pública especializada em segurança do paciente; confirma avaliação por fatores e periodicidade contextual.",
        "sha256": "f22f05c14f3551d8b6b9b09a484e21f71cf4085cf1ad1eb2f099c34eba34c7ac",
        "examined": true
      }
    ],
    "operational_version_explicit": true,
    "clinical_scope": "Instrumento consultivo, sem prescrição ou autorização autônoma de procedimentos."
  },
  "frail-scale": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.slu.edu/medicine/internal-medicine/geriatric-medicine/aging-successfully/-pdf/rapid-geriatric-assessment.pdf",
        "title": "Rapid Geriatric Assessment: The Simple FRAIL Questionnaire Screening Tool",
        "entity": "Saint Louis University, geriatric medicine",
        "version_or_date": "Revised 8/15/2016",
        "checked_at": "2026-09-30T21:29:45.113762+00:00",
        "retrieved_at": "2026-09-30T21:29:45.113762+00:00",
        "locator": "p.1, FRAIL upper-left instrument and footer",
        "excerpt": "Fatigue; cannot walk up one flight; cannot walk one block; more than5 illnesses; lost more than5% in last6months. Score≥3frailty,1or2prefrail.",
        "reliability": "Fonte autoral/institucional da variante SLU-RGA 2016. Cinco perguntas operacionais completas; não tratada como o contrato da coorte 2012. A fonte permite incorporação gratuita ao EHR.",
        "sha256": "5bcbf497ffa67eea29055562269329fc0fa497f72d942c8054e15045960c63d9",
        "examined": true
      }
    ],
    "operational_version_explicit": true,
    "clinical_scope": "Instrumento consultivo, sem prescrição ou autorização autônoma de procedimentos."
  },
  "braden": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.in.gov/health/files/Braden_Scale.pdf",
        "title": "Braden Scale for Predicting Pressure Sore Risk, form 3166P R304",
        "entity": "Indiana Department of Health; Barbara Braden and Nancy Bergstrom; Briggs",
        "version_or_date": "Classical scale 1988, form 3166P R304",
        "checked_at": "2026-09-30T21:27:37.690600+00:00",
        "retrieved_at": "2026-09-30T21:27:37.690600+00:00",
        "locator": "p.1, six-domain complete instrument, risk header, copyright/permission footer",
        "excerpt": "Five1–4domains plus friction/shear1–3; severe≤9, high10–12, moderate13–14, mild15–18. Sensory/moisture/activity/mobility/nutrition/friction descriptions are fully present.",
        "reliability": "Formulário clássico integral publicado por órgão público de saúde, com autoria e reimpressão autorizada identificadas. Conferido por extração de texto e imagem; não confundido com Scale II.",
        "sha256": "7a66047a070129e5f3d29c7e9f5e96b6d5ee1a01fcb2f9adb8d137686d00a0c4",
        "examined": true
      }
    ],
    "operational_version_explicit": true,
    "clinical_scope": "Instrumento consultivo, sem prescrição ou autorização autônoma de procedimentos."
  },
  "mews": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.med.upenn.edu/uphscovid19education/assets/user-content/documents/curricula/lgh-nursing-to-inpatient/modified-early-warning-system-(mews).pdf",
        "title": "Modified Early Warning System: This is policy at LGH",
        "entity": "Penn Medicine/LGH; Sue McDonald MSN RN CCRN, Clinical Educator",
        "version_or_date": "2020, printed date 04/03/2020",
        "checked_at": "2026-09-30T21:29:45.058586+00:00",
        "retrieved_at": "2026-09-30T21:29:45.058586+00:00",
        "locator": "p. 3 complete chart, pp.4–6 local action bands",
        "excerpt": "SBP≤70/71–80/81–100/101–159/160–199/200–220/>220; HR≤40/.../≥130; RR≤7/8/9–17/18–20/21–29/≥30; temperature°F one-decimal bands; LOC includes new agitation/confusion1. Bands0–1/2–3/4–6/7–8/>8.",
        "reliability": "Material institucional completo de enfermagem para a variante histórica LGH 2020. Conferência visual do quadro evita falhas de OCR; não atribui validação Subbe 2001 ou vigência universal 2026.",
        "sha256": "5985828d27399c5ca632320bcef15cc5492ea90c806f9b00907df748f8f3c2f1",
        "examined": true
      }
    ],
    "operational_version_explicit": true,
    "clinical_scope": "Instrumento consultivo, sem prescrição ou autorização autônoma de procedimentos."
  },
  "kocher": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://www.mdcalc.com/kocher-criteria-septic-arthritis",
        "retrieval_url": "https://www.mdcalc.com/kocher-criteria-septic-arthritis",
        "title": "Kocher Criteria for Septic Arthritis Calculator",
        "entity": "MDCalc professional clinical calculator; Creator profile Dr.Mininder S.Kocher and content contributor Calvin Hwang,MD displayed",
        "version_or_date": "Current form examined2026-09-30; no separate scoring-form version date exposed",
        "checked_at": "2026-09-30T21:31:41.936898+00:00",
        "retrieved_at": "2026-09-30T21:31:41.936898+00:00",
        "locator": "Calculator four labeled inputs; description; creator/contributor; Advice",
        "excerpt": "Child with an inflamed hip; four one-point inputs: non weight-bearing, temp>38.5°C/101.3°F, ESR>40mm/hr, WBC>12,000cells/mm3. This current form differs from the ≥40mm/h comparator described for1999 derivation in published literature. Implementation explicitly identifies this form and suppresses imported historical percent-risk/discharge advice.",
        "reliability": "Opened entire current clinical form with professional editorial provenance, specific score creator and named physician contributor. Sufficient for this exact identified numeric count; not claimed to be the untouched1999 derivation, a regulatory endorsement, or an autonomous clinical decision.",
        "sha256": "8f1beaf753fd3ef6995ed5d6a893d57241296b5ffb631250e78067f5f26dbfa5",
        "examined": true,
        "local_artifact": "escores-ped/sources/mdcalc-kocher-alias.html",
        "identity_note": "Alias really requested; redirect ended at1817 and full body was Kocher. Earlier guessedID10063 ended atLicurse and was excluded as unrelated, not relied on."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9254023/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9254023/fullTextXML",
        "title": "The modified Kocher criteria for septic hip: Does it apply to the knee?",
        "entity": "Bisht RU, Burns JD, Smith CL, Kang P, Shrader MW, Belthur MV; Journal of Children’s Orthopaedics / SAGE; PMID35800650",
        "version_or_date": "2022-06-30; DOI10.1177/18632521221106383",
        "checked_at": "2026-09-30T21:30:22.575800+00:00",
        "retrieved_at": "2026-09-30T21:30:22.575800+00:00",
        "locator": "Methods; Table1 demographic and clinical characteristics; Tables2–3 explicit regression predictors",
        "excerpt": "Modified operational study: body temperature >38.5°C; inability to bear weight; WBC >12,000/mm3; ESR >40mm/h; CRP >2.0mg/dL. Methods: pediatric patients with irritable hip or knee who underwent arthrocentesis; calculator restricts combination to hip. Introduction separately describes historical1999 ESR≥40, which is not mixed with this study’s >40 criterion.",
        "reliability": "Opened primary peer-reviewed full study with explicit repeated comparators in three tables, units and clinical population. Sufficient for identified 2022 five-criterion count; study percentages/individual diagnostic probabilities are not imported.",
        "sha256": "e036cc85883888de928f79e17d87d9655b03116b84ac44516151d572be7a7b24",
        "examined": true,
        "local_artifact": "escores-ped/sources/kocher-2022-original.xml",
        "correction_check": "Current EuropePMC core metadata PMID35800650 reread 2026-09-30T21:39:11.627637+00:00; matching title/authors/DOI; no commentCorrectionList entry exposed. No retraction/correction notice in the full XML examined."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12566418/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12566418/fullTextXML",
        "title": "Inefficiency of Kocher and Caird’s Criteria in Septic Arthritis of the Hip Due to Kingella kingae: A Multicenter Retrospective Cohort Study",
        "entity": "De Marco et al.; Microorganisms; 17 hospitals in7countries; PMID41156783",
        "version_or_date": "2025-10-07; DOI10.3390/microorganisms13102323",
        "checked_at": "2026-09-30T21:30:23.414991+00:00",
        "retrieved_at": "2026-09-30T21:30:23.414991+00:00",
        "locator": "Methods; Results; Discussion/Conclusions",
        "excerpt": "Confirmed Kingella kingae septic hip cohort; combinations of Kocher/Caird criteria had insufficient sensitivity. Lower criterion counts and mild laboratory abnormalities do not reliably exclude septic hip due to Kingella. Model is not an autonomous diagnostic exclusion or discharge rule.",
        "reliability": "Opened primary multicenter peer-reviewed full study specifically testing limitations in the target pediatric hip population. Used for the clinical caution, not to generate a new probability band.",
        "sha256": "7411757499d0ed4c585745d1fb96b03b43ae7eef105187612529d9cde681fcab",
        "examined": true,
        "local_artifact": "escores-ped/sources/kocher-2025-kingella.xml",
        "correction_check": "Current metadata PMID41156783 reread 2026-09-30T21:39:11.541507+00:00; title/authors/DOI match; no commentCorrectionList entry exposed."
      }
    ]
  },
  "kocher-caird": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9254023/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9254023/fullTextXML",
        "title": "The modified Kocher criteria for septic hip: Does it apply to the knee?",
        "entity": "Bisht RU, Burns JD, Smith CL, Kang P, Shrader MW, Belthur MV; Journal of Children’s Orthopaedics / SAGE; PMID35800650",
        "version_or_date": "2022-06-30; DOI10.1177/18632521221106383",
        "checked_at": "2026-09-30T21:30:22.575800+00:00",
        "retrieved_at": "2026-09-30T21:30:22.575800+00:00",
        "locator": "Methods; Table1 demographic and clinical characteristics; Tables2–3 explicit regression predictors",
        "excerpt": "Modified operational study: body temperature >38.5°C; inability to bear weight; WBC >12,000/mm3; ESR >40mm/h; CRP >2.0mg/dL. Methods: pediatric patients with irritable hip or knee who underwent arthrocentesis; calculator restricts combination to hip. Introduction separately describes historical1999 ESR≥40, which is not mixed with this study’s >40 criterion.",
        "reliability": "Opened primary peer-reviewed full study with explicit repeated comparators in three tables, units and clinical population. Sufficient for identified 2022 five-criterion count; study percentages/individual diagnostic probabilities are not imported.",
        "sha256": "e036cc85883888de928f79e17d87d9655b03116b84ac44516151d572be7a7b24",
        "examined": true,
        "local_artifact": "escores-ped/sources/kocher-2022-original.xml",
        "correction_check": "Current EuropePMC core metadata PMID35800650 reread 2026-09-30T21:39:11.627637+00:00; matching title/authors/DOI; no commentCorrectionList entry exposed. No retraction/correction notice in the full XML examined."
      },
      {
        "url": "https://pubmed.ncbi.nlm.nih.gov/16757758/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:16757758&format=json&resultType=core",
        "title": "Factors distinguishing septic arthritis from transient synovitis of the hip in children. A prospective study.",
        "entity": "Caird MS, Flynn JM, Leung YL, Millman JE, D’Italia JG, Dormans JP; Journal of Bone and Joint Surgery Am",
        "version_or_date": "2006-06-01; DOI10.2106/JBJS.E.00216",
        "checked_at": "2026-09-30T21:39:11.439414+00:00",
        "retrieved_at": "2026-09-30T21:39:11.439414+00:00",
        "locator": "Original abstract Conclusions and Methods; primary full text not exposed here",
        "excerpt": "Children in whom suspicion warranted hip aspiration; original abstract specifies oral temperature>38.5°C and CRP>2.0mg/dL (>20mg/L). It does not expose every original comparator; full contract is therefore taken from explicitly identified2022 primary tables, not asserted to be reconstructed2006 original.",
        "reliability": "Original authors’ abstract corroborates population, oral temperature and dimensional PCR equivalence. Not used alone for missing 2006 details; the complete identified2022 table supplies the implemented version.",
        "sha256": "ca0ab229def20b1cca7b79dfda0d054d882401d45f3e90f681d07c7c916b7038",
        "examined": true,
        "local_artifact": "escores-ped/sources/caird-2006-current.json"
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12566418/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12566418/fullTextXML",
        "title": "Inefficiency of Kocher and Caird’s Criteria in Septic Arthritis of the Hip Due to Kingella kingae: A Multicenter Retrospective Cohort Study",
        "entity": "De Marco et al.; Microorganisms; 17 hospitals in7countries; PMID41156783",
        "version_or_date": "2025-10-07; DOI10.3390/microorganisms13102323",
        "checked_at": "2026-09-30T21:30:23.414991+00:00",
        "retrieved_at": "2026-09-30T21:30:23.414991+00:00",
        "locator": "Methods; Results; Discussion/Conclusions",
        "excerpt": "Confirmed Kingella kingae septic hip cohort; combinations of Kocher/Caird criteria had insufficient sensitivity. Lower criterion counts and mild laboratory abnormalities do not reliably exclude septic hip due to Kingella. Model is not an autonomous diagnostic exclusion or discharge rule.",
        "reliability": "Opened primary multicenter peer-reviewed full study specifically testing limitations in the target pediatric hip population. Used for the clinical caution, not to generate a new probability band.",
        "sha256": "7411757499d0ed4c585745d1fb96b03b43ae7eef105187612529d9cde681fcab",
        "examined": true,
        "local_artifact": "escores-ped/sources/kocher-2025-kingella.xml",
        "correction_check": "Current metadata PMID41156783 reread 2026-09-30T21:39:11.541507+00:00; title/authors/DOI match; no commentCorrectionList entry exposed."
      }
    ]
  },
  "pediatric-sirs": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6351458/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6351458/fullTextXML",
        "title": "Sepsis: Changing Definitions, Unchanging Treatment",
        "entity": "Obonyo NG, Schlapbach LJ, Fraser JF; Frontiers in Pediatrics / Pediatric Critical Care",
        "version_or_date": "2019-01-23; DOI10.3389/fped.2018.00425; corrigendum2020 checked",
        "checked_at": "2026-09-30T21:33:33.000207+00:00",
        "retrieved_at": "2026-09-30T21:33:33.000207+00:00",
        "locator": "Table1A Pediatric Sepsis Consensus Conference2005; PSCC definitions paragraph immediately preceding table",
        "excerpt": "2–5yr: HR>140/min; RR>22/min; WBC>15.5 or<6x10^9/L.6–12yr: HR>130;RR>18;WBC>13.5 or<4.5.13–<18yr:HR>110;RR>14;WBC>11 or<4.5. Core temp>38.5 or<36°C. Tachycardia has clinical qualifiers; ventilation must be an acute process excluding underlying neuromuscular disease/general anesthesia; chemotherapy-induced leukopenia excluded; >10% immature neutrophils supports leukocyte component. Infant1–2yr operational boundary unresolved, not applied.",
        "reliability": "Opened full specialist peer-reviewed review reproducing complete age-table and general qualifications. It supports only this explicitly narrowed historical2–17yr implementation; no claim of current pediatric sepsis definition or infant coverage.",
        "sha256": "98726d6a26d9e7452a7dbbc4fe1e8fbb48828669cd4ab54b91e0eebcdaaf75b4",
        "examined": true,
        "local_artifact": "escores-ped/sources/sirs-review2018.xml",
        "correction_check": "Metadata PMID30729101 reveals Erratum in PMID32039108. Full corrigendum PMC6990096 opened: only funding and author-affiliation corrections; authors explicitly state no scientific conclusions changed. This concrete correction was examined rather than ignored.",
        "correction_evidence": {
          "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6990096/",
          "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6990096/fullTextXML",
          "title": "Corrigendum: Sepsis: Changing Definitions, Unchanging Treatment",
          "entity": "Obonyo, Schlapbach, Fraser; Frontiers in Pediatrics",
          "version_or_date": "2020-01-23; DOI10.3389/fped.2019.00538",
          "sha256": "4dfeb1ded5f7fda202a85fb69856d9e9cb4c776dc717cb4643f527070fbe172d",
          "examined": true,
          "retrieved_at": "2026-09-30T21:39:29.310154+00:00",
          "locator": "Entire corrigendum body",
          "excerpt": "Funding and affiliation corrections; authors state this does not change scientific conclusions; original article updated.",
          "checked_at": "2026-09-30T21:43:47.637841+00:00",
          "retrieval_timestamp_basis": "Local receipt file timestamp after actual HTTP download; checked_at is this reread/hash confirmation"
        },
        "supported_clause": "Age-specific threshold table and qualitative physiological/leukocyte qualifications only; ≥2 and mandatoryT/WBC supplied by separately registered2023Table1."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10169116/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10169116/fullTextXML",
        "title": "Pediatric Sepsis: a Summary of Current Definitions and Management Recommendations.",
        "entity": "Miranda Mariana, Nadel Simon; Current Pediatrics Reports / Springer",
        "version_or_date": "2023-05-09; DOI10.1007/s40124-023-00286-3",
        "checked_at": "2026-09-30T21:33:32.270839+00:00",
        "retrieved_at": "2026-09-30T21:33:32.270839+00:00",
        "locator": "Table1; 2005 International Pediatric Sepsis Definition Consensus conference / SIRS row",
        "excerpt": "SIRS meets≥2 of four criteria, one of which must be temperature or WBC count. Temperature>38.5°C or<36°C; age-dependent HR; tachypnea/mechanical ventilation; abnormal WBC or>10% immature neutrophils. This is the historical2005 rule, not currentPhoenix definition.",
        "reliability": "Opened complete specialist peer-reviewed article; Table1 supplies the explicit≥2/T-WBC requirement omitted in the other review’s table/text. Added to resolve this concrete documentary gap, not as a minimum number of sources.",
        "sha256": "e73ff4f3fa523d44cf5d321a90c6dab7f5033fca96381fc7bf3a94655d92d070",
        "examined": true,
        "local_artifact": "escores-ped/sources/sirs-review2023.xml",
        "correction_check": "Current EuropePMC core PMID37252329 read2026-09-30T21:46:53.563289+00:00; matching title/authors/DOI; exposed commentCorrectionList=null. No retraction notice identified in the full XML."
      }
    ],
    "validated_scope": "Only ages2–17completedyears; full four-component historical contract; no current sepsis diagnosis",
    "coverage_limited": true,
    "original_pending_item_must_remain_open": true,
    "remaining_quarantine": "<2yr age-band boundary and infant/neonatal operational contract not sufficiently demonstrated; do not interpolate",
    "publication_delta_id": "escores-sirs-historico-2a17-20260930"
  },
  "thompson-hie": {
    "status": "DOCUMENTAL_VALIDADO",
    "references": [
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6568287/",
        "retrieval_url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6568287/fullTextXML",
        "title": "Turkish Neonatal Society Guideline on neonatal encephalopathy",
        "entity": "Turkish Neonatal Society; Akisu M, Kumral A, Canpolat FE; Ege/Dokuz Eylül University neonatal specialists; Turkish Archives of Pediatrics",
        "version_or_date": "2018-12-25; volume53(Suppl1); DOI10.5152/TurkPediatriArs.2018.01805; identified historical scoring-table version, not a declaration of current treatment protocol",
        "checked_at": "2026-09-30T21:29:54.761839+00:00",
        "locator": "Table 1b (XML table-wrap T2), nine rows Tone through Fontanel; Introduction (NE population ≥35 gestational weeks); diagnostic staging paragraph (daily clinical scoring)",
        "excerpt": "Table 1b Thompson Score (Thompson CM, Puterman AS, Linley LL, et al. The value of a scoring system for hypoxic ischemic encepha¬lopathy in predicting neurodevelopmental outcome. Acta Paediatr 1997; 86: 757-61.) Symptom 0 1 2 3 Tone normal hypertonic hypotonic flaccid Consciousness normal hyper-alert lethargic comatose Fits none <3 per day >2 per day Posture normal fisting, cycling distal flexion decerebrated Moro normal partial absent Grasp normal poor absent Suck normal poor absent Respiration normal hyperventilation apnea respiratory support Fontanel normal full tense Date Time Tone Conscious-ness Fits Posture Moro Grasp Suck Respiration Fontanel TOTAL Introduction: NE occurs in the early neonatal period in newborns born at the 35th gestational week and later. Daily scoring is performed. EEG may help detect subclinical seizures.",
        "reliability": "A published neonatal society guideline written by academic neonatologists reproduces the complete table and directly cites Thompson et al.1997. Sufficient for this explicitly identified nine-sign numeric instrument. No unsupported severity bands, hypothermia rule, drug regimen or individual prognosis is derived from it.",
        "applicability": "Only the neonatal ≥35-week early-encephalopathy population described by this document; an explicit eligibility/examinability field yields null outside confirmed scope. Numeric clinical-trend tool in Escores, not a prescribing engine or treatment selector.",
        "sha256": "1b2a628a7435250be8ed24af5bce34289a329ee2a769edce6030d60489618ab8",
        "examined": true,
        "local_artifact": "escores-ped/thompson/PMC6568287.xml",
        "integrity": "Full original published XML opened and table cells independently extracted. Exact bytes/hash preserved, not a search snippet.",
        "correction_check": "Europe PMC current core metadata for PMID31236017 read at 2026-09-30T21:32:07.319859+00:00: matching authors/title/DOI and no commentCorrectionList entries. No retraction/correction notice identified in full document. Version is explicitly 2018; contemporary treatment recommendations are not imported or claimed."
      }
    ]
  },
  "psofa": {
    "status": "DOCUMENTAL_VALIDADO",
    "variant": "pSOFA parcial manual identificado: original2017 com fronteiras operacionais explícitas do código público autoral Boston de2023; sem EHR/imputação. Sem diagnóstico/mortalidade ou equivalência com o algoritmo completo do estudo2024.",
    "references": [
      {
        "url": "https://raw.githubusercontent.com/alireza-akhondi-asl/pSOFA/c60137de9ee805af456f9548d0dac16534d5fdce/R/Respiratory.R",
        "title": "pSOFA — algoritmo autoral Respiratory.R",
        "entity": "Alireza Akhondi-Asl / Boston Children’s Hospital, laboratório acadêmico do autor",
        "version_or_date": "commit c60137de9ee805af456f9548d0dac16534d5fdce de2023-06-21; do mesmo autor da publicação2024, sem comprovação do commit exato avaliado nessa publicação DOI10.1097/PCC.0000000000003458",
        "checked_at": "2026-09-30T21:29:29.510390+00:00",
        "sha256": "ec7342eaebef31f0d5a21cd71de48b771c55ea943c4627bd46fff7136f1b3ba3",
        "locator": "th_1..th_4 e teste r<th_2; linhas160–199",
        "excerpt": "S/F:th_1=292,th_2=264,th_3=221,th_4=148; r<th_2→2, r<th_1→1. Portanto264→1. P/F:400/300/200/100. SpO₂t≤97 selecionado.",
        "reliability": "Código público do autor de um algoritmo publicado e validado; resolve o conflito numérico concreto do limite264. Não é errata oficial do artigo2017 nem autorização para copiar comportamento EHR inteiro.",
        "examined": true,
        "integrity_check": "Arquivo fonte R completo aberto; origem GitHub confirmada por link no portal oficial Boston Children’s. Commit relido via API; sem EHR de pacientes ou dados privados.",
        "retraction_or_supersession_check": "Fonte ainda é o head do repositório autoral em2026-09-30; portal mantém link. Crossref/EuropePMC não mostraram correção/retratação do original nem do estudo2024 nas leituras realizadas; isso não é garantia universal.",
        "applicability": "Contrato manual identificado, sem extração EHR, sem heurísticas ou categorias respiratórias fracionárias.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://raw.githubusercontent.com/alireza-akhondi-asl/pSOFA/c60137de9ee805af456f9548d0dac16534d5fdce/R/Hepatic.R",
        "title": "pSOFA — algoritmo autoral Hepatic.R",
        "entity": "Alireza Akhondi-Asl / Boston Children’s Hospital, laboratório acadêmico do autor",
        "version_or_date": "commit c60137de9ee805af456f9548d0dac16534d5fdce de2023-06-21; do mesmo autor da publicação2024, sem comprovação do commit exato avaliado nessa publicação DOI10.1097/PCC.0000000000003458",
        "checked_at": "2026-09-30T21:29:29.518785+00:00",
        "sha256": "4f382a979e6465505f6dd258a8e59e5decbcf4eb0598202a93dd5742e8df60ba",
        "locator": "cut(max(V),breaks=c(-Inf,1.2,2.0,6.0,12.0,Inf),labels=FALSE,right=FALSE)-1",
        "excerpt": "Intervalos fechados à esquerda:≥12,0mg/dL→4;11,9999→3.",
        "reliability": "Especificação operacional autoral explícita; resolve o vazio editorial em12,0 da tabela2017. Não se afirma publicação de errata.",
        "examined": true,
        "integrity_check": "Arquivo fonte R completo aberto; origem GitHub confirmada por link no portal oficial Boston Children’s. Commit relido via API; sem EHR de pacientes ou dados privados.",
        "retraction_or_supersession_check": "Fonte ainda é o head do repositório autoral em2026-09-30; portal mantém link. Crossref/EuropePMC não mostraram correção/retratação do original nem do estudo2024 nas leituras realizadas; isso não é garantia universal.",
        "applicability": "Contrato manual identificado, sem extração EHR, sem heurísticas ou categorias respiratórias fracionárias.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://raw.githubusercontent.com/alireza-akhondi-asl/pSOFA/c60137de9ee805af456f9548d0dac16534d5fdce/R/Renal.R",
        "title": "pSOFA — algoritmo autoral Renal.R",
        "entity": "Alireza Akhondi-Asl / Boston Children’s Hospital, laboratório acadêmico do autor",
        "version_or_date": "commit c60137de9ee805af456f9548d0dac16534d5fdce de2023-06-21; do mesmo autor da publicação2024, sem comprovação do commit exato avaliado nessa publicação DOI10.1097/PCC.0000000000003458",
        "checked_at": "2026-09-30T21:29:29.553219+00:00",
        "sha256": "71f20a9f3bdd7289234146195afab1a6bc58fb3352fd7ae41acc4bdbd6ab697b",
        "locator": "sete ramos etários e cut(...right=FALSE)",
        "excerpt": "Idade<1,<12,<24,<60,<144,≤216,>216m. Limiares:[.8,1,1.2,1.6];[.3,.5,.8,1.2];[.4,.6,1.1,1.5];[.6,.9,1.6,2.3];[.7,1.1,1.8,2.6];[1,1.7,2.9,4.2];[1.2,2,3.5,5].",
        "reliability": "Especificação autoral de intervalos contínuos conferida contra sete faixas do original;mg/dL e conversão÷88,4 preservadas.",
        "examined": true,
        "integrity_check": "Arquivo fonte R completo aberto; origem GitHub confirmada por link no portal oficial Boston Children’s. Commit relido via API; sem EHR de pacientes ou dados privados.",
        "retraction_or_supersession_check": "Fonte ainda é o head do repositório autoral em2026-09-30; portal mantém link. Crossref/EuropePMC não mostraram correção/retratação do original nem do estudo2024 nas leituras realizadas; isso não é garantia universal.",
        "applicability": "Contrato manual identificado, sem extração EHR, sem heurísticas ou categorias respiratórias fracionárias.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://raw.githubusercontent.com/alireza-akhondi-asl/pSOFA/c60137de9ee805af456f9548d0dac16534d5fdce/R/Cardiovascular.R",
        "title": "pSOFA — algoritmo autoral Cardiovascular.R",
        "entity": "Alireza Akhondi-Asl / Boston Children’s Hospital, laboratório acadêmico do autor",
        "version_or_date": "commit c60137de9ee805af456f9548d0dac16534d5fdce de2023-06-21; do mesmo autor da publicação2024, sem comprovação do commit exato avaliado nessa publicação DOI10.1097/PCC.0000000000003458",
        "checked_at": "2026-09-30T21:29:29.550541+00:00",
        "sha256": "a8ad104c84483668830607500f0db591ea4600955e262d9f7c65bb4f4d419fa1",
        "locator": "Age e MAP branches; dopamine/epinephrine/norepinephrine gates",
        "excerpt": "PAM limiares46,55,60,62,65,67,70; igualdade normal. Dopamina>15 ou epinefrina/norepinefrina>0,1→4; positivas≤0,1→3;dopamina>0≤5/dobutamina>0→2.",
        "reliability": "Código confirma operadores e faixas; duração contínua≥1h segue nota d original. NÃO copiar soma dos tempos do código para tratar episódios curtos como contínuos.",
        "examined": true,
        "integrity_check": "Arquivo fonte R completo aberto; origem GitHub confirmada por link no portal oficial Boston Children’s. Commit relido via API; sem EHR de pacientes ou dados privados.",
        "retraction_or_supersession_check": "Fonte ainda é o head do repositório autoral em2026-09-30; portal mantém link. Crossref/EuropePMC não mostraram correção/retratação do original nem do estudo2024 nas leituras realizadas; isso não é garantia universal.",
        "applicability": "Contrato manual identificado, sem extração EHR, sem heurísticas ou categorias respiratórias fracionárias.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://labs.childrenshospital.org/akhondi-asl/software/psofa",
        "title": "pSOFA — portal do laboratório Alireza Akhondi-Asl",
        "entity": "Boston Children’s Hospital",
        "version_or_date": "Página vigente consultada2026-09-30",
        "checked_at": "2026-09-30T21:28:47.581664+00:00",
        "sha256": "67373a74100bab88a587cc2cae0b6bcdebcbc1cdad9a145509329aac81ee5e69",
        "locator": "Software pSOFA; linkpSOFA(Github)",
        "excerpt": "An automated method for calculating the pSOFA score. Based on Matics,T.J.and Sanchez-Pinto,L.N.,2017. pSOFA(Github).",
        "reliability": "Página institucional oficial fornece vínculo de origem entre laboratório/autor e o repositório usado; não se confia em um GitHub de origem não identificada.",
        "examined": true,
        "integrity_check": "Página efetivamente aberta e texto/link examinados; não é resposta reCAPTCHA.",
        "retraction_or_supersession_check": "Portal acessível mantém descrição e link; metadados atuais do estudo2024 examinados.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6583375/?page=1",
        "title": "Adaptation and Validation of a Pediatric Sequential Organ Failure Assessment Score",
        "entity": "Matics TJ e Sanchez-Pinto LN / JAMA Pediatrics",
        "version_or_date": "2017;DOI10.1001/jamapediatrics.2017.2352",
        "checked_at": "2026-09-30T20:25:38.935184+00:00",
        "retrieved_at": "2026-09-30T20:25:38.935184+00:00",
        "retrieval_kind": "releitura local do documento original completo observado na rodada2; nova consultaHTTP nesta rodada retornou desafio reCAPTCHA, não foi tratada como documento",
        "sha256": "3d039e1c02ed5c64fbd99955ff11ab9ff4504166e4a0be2a3322003f92955745",
        "locator": "Tabela1 e notas a–f;Methods/população",
        "excerpt": "Piores valores de cada órgão em24h; seis subscores0–4;total0–24;SpO₂≤97%;PaO₂mmHg;MAPmmHg;vasoativosµg/kg/min por pelo menos1h contínua;idade≤21anos;Glasgow pediátrico;creatinina mg/dL,conversão×88,4;plaquetas×10³/µL.",
        "reliability": "Documento de derivação original completo preservado e novamente examinado localmente. Data de leitura externa integral permanece a da rodada2; releitura local da rodada3 é registrada separadamente. Os limites264/12,0 são resolvidos na variante manual pelo código autoral externo recém-aberto, sem afirmar errata oficial.",
        "examined": true,
        "integrity_check": "Arquivo completo do artigo, com autoria/título/tabela/notas; hashigual à rodada2. Metadados bibliográficos externos atuais verificam identidade; acessoHTTP novo ao textooriginal falhou.",
        "retraction_or_supersession_check": "EuropePMC resultTypecore2026-09-30 mostra Comment in 29704146,sem erratum/retraction nos metadados lidos;Crossrefrelationvazio. Não equivale a certeza sobrecorreçõesdesconhecidas.",
        "applicability": "Contrato manual de pacientes criticamente enfermos até21anos; não diagnósticoautônomo de sepse nem mortalidadeindividual. Imputação normal original foi explicitamente excluída desta interface.",
        "reexamined_at": "2026-09-30T21:40:39.607379+00:00",
        "current_external_access_attempt": {
          "checked_at": "2026-09-30T21:41:51.252147+00:00",
          "result": "HTTP Error 500: Internal Server Error"
        },
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      },
      {
        "url": "https://www.ovid.com/jnls/pccmjournal/fulltext/10.1097/pcc.0000000000003458~automated-calculator-for-the-pediatric-sequential-organ",
        "title": "Automated Calculator for the Pediatric Sequential Organ Failure Assessment Score: Development and External Validation in a Single-Center7-Year Cohort,2015–2021",
        "entity": "Akhondi-Asl A,Luchette M,Mehta NM,Geva A / Pediatric Critical Care Medicine",
        "version_or_date": "2024May25(5):434–442;DOI10.1097/PCC.0000000000003458;PMID38695692",
        "checked_at": "2026-09-30T21:29:30.735276+00:00",
        "sha256": "868e294a47a6b2d47cf474286bbd25811c3adc669a3f271f4e28b814074e7073",
        "locator": "Somente resumo aberto/identidade;texto completo pago não lido",
        "excerpt": "77 registros;automated  precisão geral97%;dois casos respiratórios calculados incorretamente;9146 pacientes na coorte externa;mortalidade hospitalarAUC0.79.",
        "reliability": "Fonte original do editor sustenta a existência/identidade e limites da validação;não sustenta texto completo que não foi lido. O código e portal oficiais, integralmente abertos, sustentam os operadores utilizados.",
        "examined": true,
        "integrity_check": "Resumo do editor completo aberto; fulltextflagsisEntitledfalse. Nenhuma alegação de leitura do texto completo ou suplementos.",
        "retraction_or_supersession_check": "EuropePMC2026-09-30 não expõecommentCorrectionList.",
        "applicability": "Identificação/proveniência da variante do código,sem afirmar que a interface manual desta aplicação foi clinicamente validada no estudo.",
        "implementation_application": "Variante parcial exclusiva: suporte ausente confirmado ou VM invasiva confirmada;0–252 meses; contexto contrário retorna null, sem classificar outros dispositivos."
      }
    ],
    "clinical_checks_passed": true,
    "implementation_status": "PATCH_LOCAL_TESTADO; motor público/API integrado ainda requer testes do coordenador; nenhuma publicação realizada pelo subagente.",
    "limits": [
      "Aplicação parcial não fecha o item original escores-pendente-psofa.",
      "Não aplicar a outros suportes/desconhecidos, inclusive categorias0–2.",
      "Não afirma errata oficial ou nova validação clínica.",
      "Não copia extraçãoEHR, categorias2,5/3,5 ou imputação.",
      "Texto completo2024 não foi aberto; código público autoral foi aberto e o commit exato estudado não foi confirmado."
    ],
    "implementation_limits": {
      "age": "Faixa conservadora0–252meses; não interpretar “21yearsor younger” como21,999 anos sem dado autoral.",
      "respiratory_support": "Somente ausência confirmada ou VM invasiva confirmada. Outras modalidades CPAP/BiPAP/HFNO/O₂ por dispositivo e desconhecidos: sempre total:null, mesmo em categorias0–2. Sem suporte comP/F<200 ouS/F<221: total:null. Campo/categoria manual e índice têm conferência obrigatória.",
      "date_provenance": "Original completo foi externamente observado na rodada2; releitura local registrada separadamente. EuropePMC retornou500 e PMCdesafio na rodada3; código autoral público, portal e metadados foram efetivamente reabertos externamente na rodada3."
    },
    "validation_scope": "PARCIAL: idade0–252 meses; ausência de suporte confirmada ou ventilação mecânica invasiva confirmada. Outros suportes ou desconhecidos não calculáveis em qualquer categoria.",
    "original_item_state": "QUARENTENA",
    "original_item_id": "escores-pendente-psofa",
    "suggested_delta_id": "escores-psofa-parcial-vmi-sem-suporte-20260930",
    "coverage_limited": true,
    "validated_scope": "Age0–252months; respiratory support ABSENT CONFIRMED or INVASIVE MECHANICAL VENTILATION CONFIRMED only. Other modalities or unknown support always return null/NAO_CALCULAVEL even with higher ratios; no-support P/F<200 orS/F<221 also returnsnull. Original pending item remains open for remaining modalities.",
    "original_pending_item_must_remain_open": true,
    "publication_delta_id": "escores-psofa-parcial-vmi-sem-suporte-20260930",
    "implementation_checks": "15938 source/compute checks+143 realpubliccalculate checks+59 actualapp.mjsregisteredWebMCP/DOM checks; context failure returnsnull, empty breakdown, explicitcontext_error/status; no undefined errors.join or breakdown.map failure."
  }
};
// Releitura corrente e mudança incremental: não redata a validação histórica.
prioritySourceValidation.psofa.current_round_review={checked_at:'2026-10-02T01:33:37.062544+00:00',source:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6583375/',source_sha256:'123506db6f62943e650c78cca296204b9e85078a6e1584daf99e67b722e2e11e',locator:'Table1, notas a–f',scope:'PARCIAL preservado; S/F264 e bilirrubina12,0 não calculáveis; demais modalidades ainda em quarentena',change:'Fronteiras primárias ambíguas recusadas; não interpretar algoritmo posterior como errata.'};

// Contrato corrente identificado; a correção da mesma referência foi examinada.
prioritySourceValidation["sgarbossa"]={"references":[{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7660719/fullTextXML","entity":"Di Marco et al., primary multicentre study published by Journal of the American Heart Association 2020","title":"New Electrocardiographic Algorithm for the Diagnosis of Acute Myocardial Infarction in Patients With Left Bundle Branch Block","version_or_date":"2020-07-04, read with its 2020-11-06 erratum","locator":"Methods / Electrocardiographic Analysis and Table S1 of author supplementary material","excerpt":"The Sgarbossa and Modified Sgarbossa Criteria were applied according to previously published definitions (Table S1). All ECGs were recorded at 25 mm/s speed, 10 mm/mV amplitude. ST deviation was measured at the J point relative to QRS onset ... criterion positive when present in >50% of beats in 1 lead.","checked_at":"2026-10-02T01:33:09.281337+00:00","sha256":"538e669607240fda589677093e214c14d9d1e38dcc03426603603f870bd6ae67","trust_reason":"Primary study explicitly states and tests the operational comparison rules; exact supplementary table has been downloaded and examined. Its own erratum was obtained and reconciled. This validates the bounded operational versions below, not the Barcelona algorithm or universal ECG interpretation.","trusted":true,"supports_claim":true,"applicable":true,"current":true},{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7660719/supplementaryFiles","entity":"Di Marco et al., original supplementary PDF served by EuropePMC","title":"Supplemental Material — Table S1. Definition of previously described algorithms","version_or_date":"2020 author supplement Table S1","locator":"PDF page 4, Table S1","excerpt":"Sgarbossa score ≥3: ST elevation ≥1mm in any lead concordant with QRS and/or ST depression ≥1mm in V1-V3. Modified Sgarbossa rule III: Sgarbossa score ≥3 and/or ST elevation/S ≤-0.25 in any lead with ST elevation ≥1mm.","checked_at":"2026-10-02T01:39:35.938785+00:00","sha256":"a3de4b4ac786760f90232ea1071335accac1397ed597e3441c407e5aa4afd002","trust_reason":"The actual primary-study supplement supplies exact >=, <= comparators, minimum absolute ST and logical OR; no inference from citation links alone.","trusted":true,"supports_claim":true,"applicable":true,"current":true},{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7763719/fullTextXML","entity":"JAHA publisher original erratum 2020","title":"Correction to: New Electrocardiographic Algorithm for the Diagnosis of Acute Myocardial Infarction in Patients With Left Bundle Branch Block","version_or_date":"2020-11-06","locator":"Original 2020 correction, Methods","excerpt":"QRS polarity was considered as positive or negative whenever the largest deflection of the QRS was ≥1.5 mm higher as compared to the opposite deflection. Leads where the difference between voltages of R wave and Q or S waves were ≤1 mm were not taken into account.","checked_at":"2026-10-02T01:40:26.454600+00:00","sha256":"2882ec20290dad6329fb486eabc74f9a5b8f72cd0fd2ade33e915be06114f994","trust_reason":"The correction itself was obtained and read; it adds the QRS-polarity operational rule, so this rule must accompany clinical/manual interpretation instead of pretending any wide QRS or infinitesimal R/S difference qualifies.","trusted":true,"supports_claim":true,"applicable":true,"current":true}],"checked_at":"2026-10-02T01:42:00+00:00","clinical_scope":"Adult-only Site restriction: confirmed LBBB and suspected AMI, complete clinician-manual calibrated ECG. Original Table S1 identified binary >=3 and modified III rules only; not integral 0–10, paced rhythm or ruleIV/V. Same-package erratum reviewed.","implementation_checks":"Mandatory context/age/all measurements; unassessed is not absent. ST/S signed conversion, S>0, polarity>=1.5mm, no silent rounding; exact ratio <=-0.25 via reverse4*ST>=Sdepth. Publication and independent tests recorded separately."};
prioritySourceValidation["modified-sgarbossa"]={"references":[{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7660719/fullTextXML","entity":"Di Marco et al., primary multicentre study published by Journal of the American Heart Association 2020","title":"New Electrocardiographic Algorithm for the Diagnosis of Acute Myocardial Infarction in Patients With Left Bundle Branch Block","version_or_date":"2020-07-04, read with its 2020-11-06 erratum","locator":"Methods / Electrocardiographic Analysis and Table S1 of author supplementary material","excerpt":"The Sgarbossa and Modified Sgarbossa Criteria were applied according to previously published definitions (Table S1). All ECGs were recorded at 25 mm/s speed, 10 mm/mV amplitude. ST deviation was measured at the J point relative to QRS onset ... criterion positive when present in >50% of beats in 1 lead.","checked_at":"2026-10-02T01:33:09.281337+00:00","sha256":"538e669607240fda589677093e214c14d9d1e38dcc03426603603f870bd6ae67","trust_reason":"Primary study explicitly states and tests the operational comparison rules; exact supplementary table has been downloaded and examined. Its own erratum was obtained and reconciled. This validates the bounded operational versions below, not the Barcelona algorithm or universal ECG interpretation.","trusted":true,"supports_claim":true,"applicable":true,"current":true},{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7660719/supplementaryFiles","entity":"Di Marco et al., original supplementary PDF served by EuropePMC","title":"Supplemental Material — Table S1. Definition of previously described algorithms","version_or_date":"2020 author supplement Table S1","locator":"PDF page 4, Table S1","excerpt":"Sgarbossa score ≥3: ST elevation ≥1mm in any lead concordant with QRS and/or ST depression ≥1mm in V1-V3. Modified Sgarbossa rule III: Sgarbossa score ≥3 and/or ST elevation/S ≤-0.25 in any lead with ST elevation ≥1mm.","checked_at":"2026-10-02T01:39:35.938785+00:00","sha256":"a3de4b4ac786760f90232ea1071335accac1397ed597e3441c407e5aa4afd002","trust_reason":"The actual primary-study supplement supplies exact >=, <= comparators, minimum absolute ST and logical OR; no inference from citation links alone.","trusted":true,"supports_claim":true,"applicable":true,"current":true},{"examined":true,"url":"https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7763719/fullTextXML","entity":"JAHA publisher original erratum 2020","title":"Correction to: New Electrocardiographic Algorithm for the Diagnosis of Acute Myocardial Infarction in Patients With Left Bundle Branch Block","version_or_date":"2020-11-06","locator":"Original 2020 correction, Methods","excerpt":"QRS polarity was considered as positive or negative whenever the largest deflection of the QRS was ≥1.5 mm higher as compared to the opposite deflection. Leads where the difference between voltages of R wave and Q or S waves were ≤1 mm were not taken into account.","checked_at":"2026-10-02T01:40:26.454600+00:00","sha256":"2882ec20290dad6329fb486eabc74f9a5b8f72cd0fd2ade33e915be06114f994","trust_reason":"The correction itself was obtained and read; it adds the QRS-polarity operational rule, so this rule must accompany clinical/manual interpretation instead of pretending any wide QRS or infinitesimal R/S difference qualifies.","trusted":true,"supports_claim":true,"applicable":true,"current":true}],"checked_at":"2026-10-02T01:42:00+00:00","clinical_scope":"Adult-only Site restriction: confirmed LBBB and suspected AMI, complete clinician-manual calibrated ECG. Original Table S1 identified binary >=3 and modified III rules only; not integral 0–10, paced rhythm or ruleIV/V. Same-package erratum reviewed.","implementation_checks":"Mandatory context/age/all measurements; unassessed is not absent. ST/S signed conversion, S>0, polarity>=1.5mm, no silent rounding; exact ratio <=-0.25 via reverse4*ST>=Sdepth. Publication and independent tests recorded separately."};
prioritySourceValidation["pediatric-sirs"].current_round_review={
  checked_at:"2026-10-19T04:18:34+00:00",
  source:"https://www.cpccrn.org/documents/PUD_CQI_definitions.pdf",
  identity:"Goldstein, Giroir, Randolph et al.; Pediatric Critical Care Medicine 2005;6:2–8; DOI 10.1097/01.PCC.0000149131.72248.E6",
  locator:"Table 2 (definição) e Table 3 (limites por idade)",
  scope:"Faixas primárias 0–<1 semana, 1 semana–<1 mês, 1 mês–<1 ano, 2–5, 6–12 e 13–<18 anos; critérios de FC/FR/leucócitos e qualificadores gerais.",
  change:"Cobertura ampliada de modo literal para 0–<1 ano, inclusive bradicardia. Faixa 1–<2 anos permanece não calculável porque a tabela salta de 1 mês–1 ano para 2–5 anos. Nenhuma interpolação.",
  status:"DOCUMENTAL_VALIDADO_PARCIAL",
  calculator_contract_changed:true,
  phoenix_changed:false
};

export const priorityQuarantineReasons={
  "glasgow-imrie": "Fullreview2022Table1 opened supports8variableLDH-onlyvariant, BUN>44.8(urea16mmol/L), PaO2<59.3mmHg. ExistingASTalternative, totalurea45mg/dLandPaO2<60 cannotbesafelymixedwiththiscontract. ConfirmauthoritativefulloperationalvariantandactualPaO2conversion; donotreleasebycopyingconflictinglimits.",
  "smart-cop": "OriginalCharles2008metadata/abstract opened, fullchart403; publishedsecondarytables conflictonpH7.30vs7.35, SBPweight1vs2, age-adjustedFR/O2andboundaries. SBP90/pH7.30 documentedpartly; nofullactivationuntilcompleteoriginaltableormaterialconflictsresolved.",
  "meld-na": "Current2020Eurotransplantvalidationread: UNOSallocationonlyMELD≥12, butNa125–140 differsexisting125–137; currentHRSArefMELD3.0 andredirectedpolicyHTMLisnotclassicformulaPDF. FullclassicOPTN2016contractneedsroundingordering, Na125–137, CVVHD24h/2dialysis7d andconditionMELD>11. Keephelduntilfullmatchingpolicy/versionexamined.",
  "mews": "Original Subbe2001 OUP403; tabelas completas de estudos secundários PMC3219360/PMC5665602 deixam PAS70 eFC40 sem categoria. Gatilho intermediário≥3 não comprovado. Retomar quando quadro original ou institucional coerente definir as igualdades; não presumir categoria para fechar.",
  "lams": "Originais2004/2018 e estudos2021/2026 sustentam3domínios,0–5 e corte≥4, mas páginas2018/BioC não apresentam quadro completo dos descritores1/2 para braço/preensão. Revisão2026 aberta fornece intervalos0–1/0–2, sem definições operacionais completas. Retomar com formulário oficial/autoral completo. Não ativar apenas pelo somatório ou referência de doença extracraniana.",
  "frail-scale": "OriginalMorley2012PMC4515112 reafirma métodos perda≥5%/12meses, Appendix1>5%(igualdadeomitida), marcha centenasdejardas,5oumaisde11doenças,fadiga4semanas. SLU formulárioRGArev15/08/2016 aberto diverge:maisde5doenças,umquarteirão,>5%em6meses. Não misturar versões nem tratar conflito operacional como resolvido; retomar versão definida com sustentação completa.",
  "braden": "AHRQ403; documento oficial BradenScaleII atual e estudos de sua derivação abertos, porém não apresentam o instrumento clássico completo. PMC9690319 confirma soma6–23,cortes≤9/10–12/13–14/15–18/19–23 e3subescalas; não sustenta todos os descritores sensorial/umidade/nutrição/fricção. Quarentena até formulário autorizado completo; não substituir silenciosamente por ScaleII.",
  "morse": "AHRQ403; caminhos BWH tentados retornaram página genérica Sobre, não formulário. PMC10619231 original de AVC confirma seis componentes, mas não tabela operacional completa de pesos/definições; estudos previamente examinados possuem erros. Retomar instrumento integral institucional/autoral, inclusive definições de história/diagnóstico/marcha/consciência.",
  "charlson-age": "Documento institucional CHUV clássico integral e calculadora profissional MDCalc foram abertos, porém não formam um contrato único confirmado: CHUV não informa a idade e agrupa diagnósticos hematológicos; MDCalc separa pesos/idade, mas a exclusão CVA versus hemiplegia da fonte autoral/institucional torna o máximo 37 do candidato inconsistente. Documento autoral CAPC é variante modificada (doença hepática leve 2 e condições adicionais), suplemento LWW 2024 usa idades 41–50/51–60/61–70/≥71. Não combinar variantes para eliminar a lacuna. Retomar com contrato clínico completo e versão identificada que sustente pesos, hierarquias, idade e máximo, ou variante coerente explicitamente definida.",
  "pediatric-sirs": "Aplicação parcial usa literalmente as faixas da Table3 original IPSCC2005:0–<1semana,1semana–<1mês,1mês–<1ano,2–5,6–12e13–<18anos. A tabela não publica linha1–<2anos; essa faixa permanece QUARENTENA e retorna não calculável. Não interpolar nem afirmar cobertura pediátrica universal.",
  "kocher": "Referência alheia; limiar de febre ≥38,5 versus >38,5 requer reconciliação original.",
  "kocher-caird": "Referência alheia; critérios/exclusões originais Caird e comparadores ainda incompletos.",
  "thompson-hie": "Nove domínios e máximo22 documentados; corte de convulsões não integralmente examinado; população Adultos errada.",
  "psofa": "Aplicação PARCIAL separada cobre somente0–252 meses, ausência de suporte confirmada ou VM invasiva confirmada. A definição operacional original de outros dispositivos/modos não foi confirmada; CPAP/BiPAP/HFNO/O₂ por dispositivo e contexto desconhecido permanecem sem cálculo, inclusive categorias0–2. Ausência de suporte comP/F<200/S/F<221 também permanece sem cálculo. A tabela original repeteS/F264 e não classifica bilirrubina12,0; ambas igualdades são recusadas. Código posterior não é errata e não fecha essa lacuna integral."
};
