/* =====================================================================
   Base de fármacos. Cada número aqui é conferido pelo teste independente
   (tests/oraculo.py). Fontes: bulas ANVISA, AHA/AAP 2025, SBP, MS, ISPAD.
   ===================================================================== */

/* ---------- 1. Carta de parada (aba Sala vermelha) ---------- */
var CARTA = [
  { id: "adr", n: "Adrenalina IV/IO (PCR)", d: { k: 0.01, max: 1, unica: true }, c: 0.1, crit: true,
    ap: "Ampola 1 mg/mL: 1 mL + 9 mL de SF = 0,1 mg/mL (1:10.000). 0,1 mL/kg; repetir a cada 3–5 min." },
  { id: "adrEt", n: "Adrenalina endotraqueal", d: { k: 0.1, max: 2.5, unica: true }, c: 1, crit: true,
    ap: "Ampola 1 mg/mL pura (0,1 mL/kg) + 5 mL de SF e 5 ventilações. Só se não houver acesso IV/IO." },
  { id: "amio", n: "Amiodarona", d: { k: 5, max: 300, unica: true }, c: 50, crit: true,
    ap: "Ampola 50 mg/mL (0,1 mL/kg). FV/TV sem pulso refratária; pode repetir até 3 doses (máx. 15 mg/kg/dia)." },
  { id: "lido", n: "Lidocaína sem vasoconstritor", d: { k: 1, max: 100, unica: true }, c: 20, cs: [[20, "ampola 2%"], [10, "ampola 1%"]], crit: false,
    ap: "Ampola 2% = 20 mg/mL (0,05 mL/kg); ampola 1% = 10 mg/mL (0,1 mL/kg). Alternativa à amiodarona; manutenção 20–50 mcg/kg/min." },
  { id: "mg", n: "Sulfato de magnésio", d: { k: 50, max: 2000, unica: true }, c: 500, cs: [[500, "ampola 50%"], [100, "ampola 10%"]], crit: true,
    ap: "Ampola 50% (500 mg/mL) ou 10% (100 mg/mL). Torsades e hipomagnesemia: 25–50 mg/kg; em bolus se sem pulso, em 10–20 min se com pulso." },
  { id: "bic", n: "Bicarbonato de sódio 8,4%", d: { k: 1, max: 50, u: "mEq", unica: true }, c: 1, crit: false,
    ap: "Ampola 8,4% = 1 mEq/mL; diluir 1:1 com água destilada em menores de 2 anos. Não é rotina na PCR: hipercalemia, tricíclicos, acidose grave documentada." },
  { id: "caglu", n: "Gluconato de cálcio 10%", d: { k: 60, max: 2000, unica: true }, c: 100, crit: true,
    ap: "Ampola 10% = 100 mg/mL (0,6 mL/kg), lento. Hipocalcemia, hipercalemia, hipermagnesemia, bloqueador de canal de cálcio. Não é rotina na PCR." },
  { id: "cacl", n: "Cloreto de cálcio 10%", d: { k: 20, max: 1000, unica: true }, c: 100, crit: false,
    ap: "Ampola 10% = 100 mg/mL (0,2 mL/kg), lento, de preferência em acesso central. A AHA admite até 2 g por dose." },
  { id: "atro", n: "Atropina", d: { k: 0.02, min: 0.1, max: function (p) { return p.idade >= 12 ? 1 : 0.5; }, unica: true }, c: 0.5, cs: [[0.5, "ampola 0,5 mg/mL"], [0.25, "ampola 0,25 mg/mL"]], crit: true,
    ap: "Ampolas de 0,5 mg/mL e de 0,25 mg/mL: conferir o rótulo antes de aspirar. Bradicardia por tônus vagal ou bloqueio AV; pode repetir uma vez." },
  { id: "ade1", n: "Adenosina — 1ª dose", d: { k: 0.1, max: 6, unica: true }, c: 3, crit: false,
    ap: "Ampola 3 mg/mL. Bolus rápido em acesso proximal + flush de 5–10 mL de SF (técnica das duas seringas)." },
  { id: "ade2", n: "Adenosina — 2ª dose", d: { k: 0.2, max: 12, unica: true }, c: 3, crit: false,
    ap: "Ampola 3 mg/mL. Mesma técnica; se falhar, cardioversão sincronizada." },
  { id: "nalox", n: "Naloxona", d: { k: 0.1, max: 2, unica: true }, c: 0.4, crit: false,
    ap: "Ampola 0,4 mg/mL. Depressão respiratória por opioide; repetir a cada 2–3 min." },
  { id: "g10", n: "Glicose 10%", d: { k: function (p) { return p.idade * 365.25 < 28 ? 2 : 5; }, max: 250, u: "mL", unica: true }, c: null, crit: false,
    ap: "5 mL/kg = 0,5 g/kg (recém-nascido: 2 mL/kg). Preparo a partir da glicose 50%: 1 mL/kg de G50% + 4 mL/kg de água destilada (10 mL + 40 mL = 50 mL a 10%)." },
  { id: "sf", n: "Cristaloide (expansão)", d: { k: function (p) { return p.idade * 365.25 < 28 ? 10 : 20; }, max: 1000, u: "mL", unica: true }, c: null, crit: false,
    ap: "SF 0,9% ou Ringer lactato, 20 mL/kg em 5–20 min; 10 mL/kg em recém-nascido, cardiopata e cetoacidose. Reavaliar a cada alíquota." }
];

/* ---------- 2. Sequência rápida (aba Via aérea) ---------- */
var VIA = [
  { id: "vAtro", g: "Pré-medicação", n: "Atropina", d: { k: 0.02, max: 0.5, unica: true }, c: 0.5, cs: [[0.5, "ampola 0,5 mg/mL"], [0.25, "ampola 0,25 mg/mL"]],
    ap: "Ampolas de 0,5 mg/mL e de 0,25 mg/mL: conferir o rótulo. Considerar em lactentes, bradicardia ou 2ª dose de succinilcolina. Sem dose mínima na pré-medicação (AHA 2025)." },
  { id: "vFent", g: "Pré-medicação", n: "Fentanil", d: { k: [1, 3], max: 150, u: "mcg", unica: true }, c: 50,
    ap: "Ampola 50 mcg/mL. Lento (1–2 min): risco de rigidez torácica e hipotensão." },
  { id: "vMida", g: "Indução", n: "Midazolam", d: { k: [0.1, 0.3], max: 10, unica: true }, c: 5,
    ap: "Ampola 5 mg/mL. Hipotensão; evitar como agente único no choque." },
  { id: "vCet", g: "Indução", n: "Cetamina", d: { k: [1, 2], max: 200, unica: true }, c: 50,
    ap: "Frasco 50 mg/mL. Primeira escolha no choque e no broncoespasmo." },
  { id: "vEto", g: "Indução", n: "Etomidato", d: { k: [0.2, 0.3], max: 40, unica: true }, c: 2,
    ap: "Ampola 2 mg/mL (10 mL). A folha ABRAMEDE-MG usa 0,2 mg/kg. Evitar na sepse: supressão adrenal (SSC 2026 sugere não usar)." },
  { id: "vProp", g: "Indução", n: "Propofol", d: { k: [1, 2.5], max: 200, unica: true }, c: 10,
    ap: "Frasco 10 mg/mL. Hipotensão e apneia; só no paciente hemodinamicamente estável. A folha ABRAMEDE-MG usa 2,5 mg/kg; começar pela dose menor e titular." },
  { id: "vSucc", g: "Bloqueio", n: "Succinilcolina (suxametônio)", d: { k: function (p) { return p.idade < 2 ? 2 : [1, 1.5]; }, max: 200, unica: true }, c: 10,
    ap: "Frasco-ampola 100 mg (pó): reconstituir com 10 mL = 10 mg/mL. Menor de 2 anos: 2 mg/kg; criança maior e adulto: 1–1,5 mg/kg (a folha ABRAMEDE-MG usa 1 mg/kg). Contraindicada em hipercalemia, queimadura ou esmagamento > 48 h, doença neuromuscular, hipertermia maligna." },
  { id: "vRoc", g: "Bloqueio", n: "Rocurônio", d: { k: [1, 1.2], max: 120, unica: true }, c: 10,
    ap: "Ampola 10 mg/mL. Início em 45–60 s; duração 30–60 min. Reversão: sugamadex 16 mg/kg." },
  { id: "vVec", g: "Bloqueio", n: "Vecurônio", d: { k: [0.1, 0.2], max: 20, unica: true }, c: 1,
    ap: "Frasco 4 mg ou 10 mg (pó): reconstituir para 1 mg/mL. Início lento (2–3 min): só se não houver rocurônio ou succinilcolina." },
  { id: "vCis", g: "Bloqueio", n: "Cisatracúrio", d: { k: [0.1, 0.2], max: 20, unica: true }, c: 2,
    ap: "Ampola 2 mg/mL. Início em 2–3 min; eliminação independente de rim e fígado. A folha ABRAMEDE-MG usa 0,15 mg/kg." },
  { id: "vSug", g: "Reversão", n: "Sugamadex", d: { k: 16, unica: true }, c: 100,
    ap: "Frasco 100 mg/mL. Reversão imediata do rocurônio ou vecurônio em não intubo, não ventilo." }
];

/* ---------- 3. Antídotos (aba Intoxicações) ---------- */
var ANTIDOTOS = [
  { id: "iNal", n: "Naloxona", ind: "Opioides", d: { k: 0.1, max: 2, unica: true }, c: 0.4, ap: "Ampola 0,4 mg/mL",
    obs: "Repetir a cada 2–3 min. Dependente de opioide ou sem PCR: 0,01 mg/kg. Efeito curto: vigiar recorrência." },
  { id: "iFlu", n: "Flumazenil", ind: "Benzodiazepínicos", d: { k: 0.01, max: 0.2, unica: true }, c: 0.1, ap: "Ampola 0,1 mg/mL",
    obs: "Repetir a cada minuto até 1 mg no total. Evitar em uso crônico, epilepsia e coingestão de tricíclico (convulsão)." },
  { id: "iAtr", n: "Atropina", ind: "Organofosforado e carbamato", d: { k: [0.02, 0.05], max: 3, unica: true }, c: 0.5, cs: [[0.5, "ampola 0,5 mg/mL"], [0.25, "ampola 0,25 mg/mL"]], ap: "Ampola 0,5 mg/mL ou 0,25 mg/mL",
    obs: "Dobrar a dose a cada 5 min até secar a secreção brônquica. Taquicardia não contraindica." },
  { id: "iPra", n: "Pralidoxima", ind: "Organofosforado", d: { k: [20, 40], max: 2000, unica: true }, c: 20, ap: "Contrathion® 200 mg (pó) + 10 mL de SF = 20 mg/mL",
    obs: "EV em 15–30 min, o mais cedo possível, sempre com atropina. Manutenção 10–20 mg/kg/h." },
  { id: "iBip", n: "Biperideno", ind: "Distonia aguda (bromoprida, metoclopramida, haloperidol)", d: { k: 0.04, max: 5, unica: true }, c: 5, ap: "Ampola 5 mg/mL",
    obs: "IM ou EV lento. Repetir após 30 min se preciso; máximo de 4 doses ao dia." },
  { id: "iBic", n: "Bicarbonato de sódio 8,4%", ind: "Tricíclicos (QRS > 100 ms), salicilatos", d: { k: [1, 2], u: "mEq", unica: true }, c: 1, ap: "Ampola 8,4% = 1 mEq/mL",
    obs: "Em bolus, repetir até QRS < 100 ms; alvo de pH 7,45–7,55. Nos salicilatos, alcalinizar a urina." },
  { id: "iAzul", n: "Azul de metileno 1%", ind: "Metemoglobinemia sintomática ou > 20–30%", d: { k: [1, 2], unica: true }, c: 10, ap: "Ampola 1% = 10 mg/mL",
    obs: "EV em 5 min; repetir em 30–60 min (máx. total 7 mg/kg). Contraindicado na deficiência de G6PD." },
  { id: "iGlu", n: "Glucagon", ind: "Betabloqueador, bloqueador de canal de cálcio", d: { k: [0.05, 0.15], max: 5, unica: true }, c: 1, ap: "Frasco 1 mg + 1 mL de diluente",
    obs: "EV em 1–2 min; vômitos são frequentes. Manutenção 0,05–0,1 mg/kg/h." },
  { id: "iIns", n: "Insulina regular em dose alta", ind: "Betabloqueador, bloqueador de canal de cálcio", d: { k: 1, u: "U", unica: true }, c: 1, ap: "Frasco 100 U/mL: diluir para 1 U/mL",
    obs: "Bolus com glicose 0,5 g/kg; manter 0,5–1 U/kg/h (titular até 10 U/kg/h). Glicemia a cada 15–30 min; repor potássio." },
  { id: "iCa", n: "Gluconato de cálcio 10%", ind: "Bloqueador de canal de cálcio, ácido fluorídrico", d: { k: 60, max: 3000, unica: true }, c: 100, ap: "Ampola 10% = 100 mg/mL",
    obs: "EV em 5–10 min com monitor; repetir a cada 10–20 min conforme resposta." },
  { id: "iHidro", n: "Hidroxocobalamina", ind: "Cianeto, inalação de fumaça com acidose lática", d: { k: 70, max: 5000, unica: true }, c: 25, ap: "Frasco 5 g: reconstituir com 200 mL de SF = 25 mg/mL",
    obs: "EV em 15 min; pode repetir uma vez. Urina e pele ficam vermelhas." },
  { id: "iOct", n: "Octreotida", ind: "Sulfonilureias (hipoglicemia recorrente)", d: { k: [1, 1.5], max: 100, u: "mcg", unica: true }, c: 100, ap: "Ampola 0,1 mg/mL (100 mcg/mL)",
    obs: "SC ou EV a cada 6 h, junto com glicose EV." },
  { id: "iLip", n: "Emulsão lipídica 20%", ind: "Anestésico local (toxicidade sistêmica)", d: { k: 1.5, max: 100, u: "mL", unica: true }, c: null, ap: "Frasco de emulsão lipídica a 20%",
    obs: "Bolus em 1 min (pode repetir 2 vezes); depois 0,25 mL/kg/min por 30–60 min. Máx. total 12 mL/kg." },
  { id: "iFom", n: "Fomepizol", ind: "Metanol, etilenoglicol", d: { k: 15, unica: true }, c: 1000, ap: "Frasco 1 g/mL: diluir em 100 mL",
    obs: "Ataque em 30 min; depois 10 mg/kg a cada 12 h. Disponibilidade restrita: acionar o CIATox. Alternativa: etanol; hemodiálise nos casos graves." },
  { id: "iFis", n: "Fisostigmina", ind: "Síndrome anticolinérgica grave", d: { k: 0.02, max: function (p) { return p.idade >= 12 ? 2 : 0.5; }, unica: true }, c: 1, ap: "Ampola 1 mg/mL",
    obs: "EV em 5 min com monitor e atropina à mão. Não usar com tricíclicos. Disponibilidade limitada no Brasil." }
];

/* ---------- 4. Infusões contínuas (aba Diluições) ----------
   q = quantidade do fármaco no volume final; uq = unidade de q; un = unidade da dose.
   amp = concentração da ampola (para calcular os mL de fármaco). */
var INFUSOES = [
  { n: "Noradrenalina", t: "Vasoativos", un: "mcg/kg/min", f: [0.05, 2], q: 4, uq: "mg", amp: 1, apr: "ampola 1 mg/mL (4 mL)", dil: "SG 5%", obs: "Pode iniciar em veia periférica calibrosa enquanto se obtém acesso central." },
  { n: "Adrenalina", t: "Vasoativos", un: "mcg/kg/min", f: [0.05, 1], q: 4, uq: "mg", amp: 1, apr: "ampola 1 mg/mL", dil: "SG 5% ou SF", obs: "Choque frio e pós-PCR; doses > 0,3 têm efeito alfa predominante." },
  { n: "Dopamina", t: "Vasoativos", un: "mcg/kg/min", f: [5, 20], q: 100, uq: "mg", amp: 5, apr: "ampola 5 mg/mL (10 mL)", dil: "SG 5% ou SF", obs: "Só se não houver adrenalina ou noradrenalina (AHA 2025, SSC)." },
  { n: "Dobutamina", t: "Vasoativos", un: "mcg/kg/min", f: [2, 20], q: 250, uq: "mg", amp: 12.5, apr: "ampola 12,5 mg/mL (20 mL)", dil: "SG 5% ou SF", obs: "Inotrópico; pode causar hipotensão e taquiarritmia." },
  { n: "Milrinona", t: "Vasoativos", un: "mcg/kg/min", f: [0.25, 0.75], q: 10, uq: "mg", amp: 1, apr: "ampola 1 mg/mL (10 mL)", dil: "SG 5% ou SF", obs: "Ataque opcional de 50 mcg/kg em 30–60 min (hipotensão). Ajustar na insuficiência renal." },
  { n: "Vasopressina", t: "Vasoativos", un: "mU/kg/min", f: [0.3, 2], q: 20, uq: "U", amp: 20, apr: "ampola 20 U/mL", dil: "SG 5% ou SF", obs: "0,3–2 mU/kg/min = 0,0003–0,002 U/kg/min. Associar quando a catecolamina está em dose alta (SSC 2026)." },
  { n: "Fenilefrina", t: "Vasoativos", un: "mcg/kg/min", f: [0.1, 1], q: 10, uq: "mg", amp: 10, apr: "ampola 10 mg/mL", dil: "SG 5% ou SF", obs: "Vasoconstritor puro; crise hipoxêmica da tetralogia de Fallot." },
  { n: "Nitroprussiato de sódio", t: "Vasoativos", un: "mcg/kg/min", f: [0.5, 3], q: 25, uq: "mg", amp: 25, apr: "frasco 50 mg/2 mL", dil: "SG 5% (proteger da luz)", obs: "Até 8–10 mcg/kg/min por curto período; risco de cianeto e tiocianato." },
  { n: "Nitroglicerina", t: "Vasoativos", un: "mcg/kg/min", f: [0.5, 5], q: 10, uq: "mg", amp: 5, apr: "ampola 5 mg/mL", dil: "SG 5% em frasco de vidro ou polietileno", obs: "Não ultrapassar 400 mcg/mL." },
  { n: "Alprostadil (PGE1)", t: "Vasoativos", un: "mcg/kg/min", f: [0.01, 0.1], q: 500, uq: "mcg", amp: 500, apr: "ampola 500 mcg/mL", dil: "SG 5% ou SF", obs: "Cardiopatia dependente de canal: iniciar 0,05–0,1 e reduzir para 0,01–0,025. Risco de apneia: material de via aérea pronto." },
  { n: "Amiodarona", t: "Antiarrítmicos", un: "mcg/kg/min", f: [5, 15], q: 100, uq: "mg", amp: 50, apr: "ampola 50 mg/mL (3 mL)", dil: "somente SG 5%", obs: "Após ataque de 5 mg/kg em 20–60 min. Acima de 2 mg/mL, só em acesso central." },
  { n: "Lidocaína", t: "Antiarrítmicos", un: "mcg/kg/min", f: [20, 50], q: 1000, uq: "mg", amp: 20, apr: "frasco 2% = 20 mg/mL", dil: "pura ou em SG 5%", obs: "Após bolus de 1 mg/kg." },
  { n: "Esmolol", t: "Antiarrítmicos", un: "mcg/kg/min", f: [50, 300], q: 500, uq: "mg", amp: 10, apr: "frasco 10 mg/mL", dil: "puro", obs: "Ataque de 500 mcg/kg em 1 min." },
  { n: "Terbutalina", t: "Broncodilatadores", un: "mcg/kg/min", f: [0.1, 4], q: 5, uq: "mg", amp: 0.5, apr: "ampola 0,5 mg/mL", dil: "SG 5% ou SF", obs: "Ataque de 10 mcg/kg em 10–20 min. Monitorar potássio, lactato e ritmo." },
  { n: "Salbutamol", t: "Broncodilatadores", un: "mcg/kg/min", f: [0.5, 5], q: 5, uq: "mg", amp: 0.5, apr: "ampola 0,5 mg/mL", dil: "SG 5% ou SF", obs: "Ataque de 15 mcg/kg em 10–15 min. Monitorar potássio, lactato e ritmo." },
  { n: "Sulfato de magnésio", t: "Broncodilatadores", un: "mg/kg/h", f: [10, 30], q: 2000, uq: "mg", amp: 100, apr: "ampola 10% = 100 mg/mL", dil: "SG 5% ou SF", obs: "Asma grave, após ataque de 25–75 mg/kg em 20 min. Vigiar reflexos, pressão e respiração." },
  { n: "Midazolam", t: "Sedação e analgesia", un: "mg/kg/h", f: [0.05, 0.3], q: 50, uq: "mg", amp: 5, apr: "ampola 5 mg/mL (10 mL)", dil: "SG 5% ou SF", obs: "No estado de mal refratário: até 1–2 mg/kg/h em UTI." },
  { n: "Fentanil", t: "Sedação e analgesia", un: "mcg/kg/h", f: [1, 5], q: 500, uq: "mcg", amp: 50, apr: "ampola 50 mcg/mL (10 mL)", dil: "SG 5% ou SF", obs: "Tolerância e abstinência após 5–7 dias." },
  { n: "Morfina", t: "Sedação e analgesia", un: "mg/kg/h", f: [0.01, 0.1], q: 10, uq: "mg", amp: 10, apr: "ampola 10 mg/mL", dil: "SG 5% ou SF", obs: "Menores de 6 meses: iniciar com 0,005–0,01 mg/kg/h." },
  { n: "Remifentanil", t: "Sedação e analgesia", un: "mcg/kg/min", f: [0.05, 0.3], q: 2, uq: "mg", amp: 1, apr: "frasco 2 mg (pó): reconstituir com 2 mL", dil: "SG 5% ou SF", obs: "Sem efeito residual: garantir analgesia antes de suspender." },
  { n: "Dexmedetomidina", t: "Sedação e analgesia", un: "mcg/kg/h", f: [0.2, 1.5], q: 200, uq: "mcg", amp: 100, apr: "frasco 100 mcg/mL (2 mL)", dil: "SF (4 mcg/mL)", obs: "Bradicardia e hipotensão. Preferida ao propofol para sedação leve em adultos (PADIS 2025)." },
  { n: "Cetamina", t: "Sedação e analgesia", un: "mg/kg/h", f: [0.1, 2], q: 500, uq: "mg", amp: 50, apr: "frasco 50 mg/mL (10 mL)", dil: "SG 5% ou SF", obs: "Analgesia 0,1–0,5; sedação 0,5–2; estado de mal refratário até 5–10 mg/kg/h." },
  { n: "Propofol", t: "Sedação e analgesia", un: "mg/kg/h", f: [1, 4], q: 500, uq: "mg", amp: 10, apr: "frasco 10 mg/mL (50 mL)", dil: "puro (para 100 mL: SG 5%)", obs: "Evitar > 4 mg/kg/h por mais de 48 h em crianças: síndrome da infusão do propofol." },
  { n: "Rocurônio", t: "Bloqueio neuromuscular", un: "mg/kg/h", f: [0.3, 1], q: 50, uq: "mg", amp: 10, apr: "ampola 10 mg/mL (5 mL)", dil: "SG 5% ou SF", obs: "Sempre com sedação e analgesia adequadas; monitorar com sequência de quatro estímulos." },
  { n: "Cisatracúrio", t: "Bloqueio neuromuscular", un: "mcg/kg/min", f: [1, 3], q: 20, uq: "mg", amp: 2, apr: "ampola 2 mg/mL (10 mL)", dil: "SG 5% ou SF", obs: "Eliminação independente de rim e fígado." },
  { n: "Insulina regular", t: "Metabólico", un: "U/kg/h", f: [0.05, 0.1], q: 50, uq: "U", amp: 100, apr: "frasco 100 U/mL", dil: "SF (1 U/mL)", obs: "Cetoacidose: iniciar ao menos 1 h após a hidratação, sem bolus (ISPAD 2022). Desprezar os primeiros 20 mL pelo equipo." },
  { n: "Furosemida", t: "Metabólico", un: "mg/kg/h", f: [0.05, 0.4], q: 50, uq: "mg", amp: 10, apr: "ampola 10 mg/mL (2 mL)", dil: "SF", obs: "Proteger da luz; não misturar com soluções ácidas." }
];

/* ---------- 5. Repertório (abas Repertório e Posologias) ----------
   v = apresentações usadas no cálculo: { r: rótulo, c: concentração por mL, g: gotas por mL } */
function porFaixa(txtDose, txtVol, txtKg, txtTeto) { return { dose: txtDose, vol: txtVol || "—", kg: txtKg || "dose por faixa", teto: txtTeto || "—", gotas: "—" }; }

var REPERTORIO = [
  /* --- analgésicos e antitérmicos --- */
  { n: "Paracetamol", c: "Analgésico e antitérmico", ap: "Gotas 200 mg/mL; suspensão 32 mg/mL ou 100 mg/mL; comprimido 500 e 750 mg",
    ind: "Febre e dor", via: "VO", int: "4–6 h (máx. 5 doses/dia)", dur: "Enquanto houver sintoma; reavaliar em 48–72 h",
    d: { k: [10, 15], max: function (p) { return p.idade < 12 ? 466 : 1000; }, maxDia: function (p) { return Math.min((p.idade * 365.25 < 28 ? 60 : 75) * p.peso, 4000); } },
    v: [{ r: "gotas 200 mg/mL", c: 200, g: 15 }, { r: "suspensão 32 mg/mL", c: 32 }, { r: "suspensão 100 mg/mL", c: 100 }],
    obs: "Bula: 1 gota/kg, até 35 gotas (≈ 466 mg) por dose em menores de 12 anos; abaixo de 2 anos ou 11 kg, só com orientação médica. Recém-nascido: intervalo de 6–8 h e até 60 mg/kg/dia. Hepatotoxicidade acima de 150 mg/kg em dose única.", pos: true },
  { n: "Dipirona (oral)", c: "Analgésico e antitérmico", ap: "Gotas 500 mg/mL; solução oral 50 mg/mL; comprimido 500 mg e 1 g",
    ind: "Febre e dor", via: "VO", int: "6 h", dur: "Enquanto houver sintoma",
    d: { k: [10, 20], max: 1000, maxDia: 4000 },
    v: [{ r: "gotas 500 mg/mL", c: 500, g: 20 }, { r: "solução 50 mg/mL", c: 50 }],
    obs: "Contraindicada em menores de 3 meses ou com menos de 5 kg. A bula traz dose única de 8–16 mg/kg, em tabela por peso; na prática pediátrica usa-se até 25 mg/kg. Risco raro de agranulocitose e de hipotensão; evitar na deficiência de G6PD.", pos: true },
  { n: "Dipirona (injetável)", c: "Analgésico e antitérmico", ap: "Ampola 500 mg/mL (2 mL = 1 g)",
    ind: "Febre e dor sem via oral", via: "EV lento ou IM", int: "6 h", dur: "Curta",
    d: { k: [10, 20], max: 1000, maxDia: 4000 }, v: [{ r: "ampola 500 mg/mL", c: 500 }],
    obs: "EV diluída e lenta (até 1 mL/min), com o paciente deitado. De 3 a 11 meses (5–8 kg), a bula orienta apenas a via IM.", pos: true },
  { n: "Ibuprofeno", c: "Anti-inflamatório não esteroide", ap: "Gotas 50 mg/mL ou 100 mg/mL; suspensão 20 e 30 mg/mL; comprimido 200–600 mg",
    ind: "Febre e dor", via: "VO", int: "6–8 h", dur: "Até 3 dias",
    d: { k: [5, 10], max: function (p) { return p.idade < 12 ? 200 : 400; }, maxDia: function (p) { return p.idade < 12 ? Math.min(40 * p.peso, 800) : 1200; } },
    v: [{ r: "gotas 50 mg/mL", c: 50, g: 10 }, { r: "gotas 100 mg/mL", c: 100, g: 10 }],
    obs: "A partir de 6 meses. NÃO usar na suspeita de dengue, na desidratação, na doença renal ou na varicela. Tomar após alimento.", pos: true },
  { n: "Cetoprofeno", c: "Anti-inflamatório não esteroide", ap: "Gotas 20 mg/mL (1 gota = 1 mg); xarope 1 mg/mL; ampola EV 100 mg",
    ind: "Dor e inflamação", via: "VO", int: "6–8 h", dur: "Até 3–5 dias",
    d: { k: 1, max: function (p) { return p.idade < 7 ? 25 : (p.idade < 12 ? 25 : 50); }, maxDia: 300 },
    v: [{ r: "gotas 20 mg/mL", c: 20, g: 20 }],
    obs: "A partir de 1 ano: 1 gota/kg; 7–11 anos: 25 gotas; adulto: 50 gotas. Mesmas restrições dos anti-inflamatórios (dengue, desidratação, doença renal).", pos: true },
  { n: "Morfina", c: "Opioide", ap: "Ampola 10 mg/mL; 1 mg/mL (2 mL)",
    ind: "Dor intensa", via: "EV lento", int: "2–4 h", dur: "Titular",
    d: { k: function (p) { return p.idade < 0.5 ? [0.025, 0.05] : [0.05, 0.1]; }, max: 5 }, v: [{ r: "diluída a 1 mg/mL: 1 mL da ampola de 10 mg/mL + 9 mL de SF", c: 1 }],
    obs: "Menores de 6 meses: 0,025–0,05 mg/kg. Monitorar respiração e sedação; naloxona disponível.", pos: true },
  { n: "Fentanil (bolus ou intranasal)", c: "Opioide", ap: "Ampola 50 mcg/mL",
    ind: "Dor intensa, procedimento", via: "EV lento ou intranasal", int: "30–60 min", dur: "Titular",
    d: { k: [1, 2], max: 100, u: "mcg" }, v: [{ r: "ampola 50 mcg/mL", c: 50 }],
    obs: "Intranasal: 1,5–2 mcg/kg com atomizador, metade em cada narina (até 1 mL por narina). EV em 1–2 min para evitar rigidez torácica.", pos: true },
  { n: "Tramadol", c: "Opioide fraco", ap: "Gotas 100 mg/mL (≈ 40 gotas/mL); ampola 50 mg/mL; cápsula 50 mg",
    ind: "Dor moderada a intensa", via: "VO ou EV lento", int: "6–8 h", dur: "Curta",
    d: { k: [1, 2], max: 100, maxDia: function (p) { return Math.min(8 * p.peso, 400); } },
    v: [{ r: "ampola 50 mg/mL", c: 50 }, { r: "gotas 100 mg/mL", c: 100, g: 40 }],
    obs: "Bula brasileira: a partir de 1 ano. A FDA (2017) contraindica abaixo de 12 anos pelo risco de depressão respiratória em metabolizadores ultrarrápidos: preferir outra opção nessa faixa. Náusea; convulsão em dose alta.", pos: true },

  /* --- antieméticos --- */
  { n: "Ondansetrona (injetável)", c: "Antiemético", ap: "Ampola 2 mg/mL (2 e 4 mL)",
    ind: "Vômitos", via: "EV em 2–5 min ou IM", int: "8 h", dur: "1–3 doses",
    d: { k: 0.15, max: 8 }, v: [{ r: "ampola 2 mg/mL", c: 2 }],
    obs: "A partir de 6 meses. Na gastroenterite o uso é off label; prolonga o QT (cuidado com hipocalemia e outros fármacos).", pos: true },
  { n: "Ondansetrona (oral)", c: "Antiemético", ap: "Comprimido orodispersível 4 e 8 mg",
    ind: "Vômitos na gastroenterite, para viabilizar a hidratação oral (off label)", via: "VO", int: "Dose única; repetir em 8 h se preciso", dur: "1–3 doses",
    f: function (p) {
      if (p.peso < 8) return porFaixa("evitar abaixo de 8 kg", "—", "8–15 kg: 2 mg; 15–30 kg: 4 mg; > 30 kg: 8 mg");
      var mg = p.peso <= 15 ? 2 : (p.peso <= 30 ? 4 : 8);
      return porFaixa(mg + " mg", mg === 2 ? "½ comprimido de 4 mg" : (mg === 4 ? "1 comprimido de 4 mg" : "1 comprimido de 8 mg"), "8–15 kg: 2 mg; 15–30 kg: 4 mg; > 30 kg: 8 mg", "8 mg/dose");
    },
    obs: "Oferecer o soro de reidratação oral 15–30 min depois.", pos: true },
  { n: "Bromoprida", c: "Antiemético e procinético", ap: "Gotas pediátricas 4 mg/mL (24 gotas/mL); ampola 5 mg/mL (2 mL)",
    ind: "Náusea e vômito", via: "VO, IM ou EV", int: "8 h", dur: "Curta",
    d: { k: [0.5, 1], per: "dia", n: 3, max: 10 }, v: [{ r: "gotas 4 mg/mL", c: 4, g: 24 }, { r: "ampola 5 mg/mL", c: 5 }],
    obs: "Contraindicada em menores de 1 ano. Pode causar distonia aguda (tratar com biperideno).", pos: true },
  { n: "Dimenidrinato + piridoxina", c: "Antiemético", ap: "Gotas 25 mg/mL (1 gota = 1,25 mg); ampola EV 3 mg/mL (10 mL)",
    ind: "Náusea, vômito e vertigem", via: "VO ou EV lento", int: "6–8 h", dur: "Curta",
    d: { k: 1.25, max: 50, maxDia: function (p) { return p.idade < 6 ? 75 : (p.idade < 12 ? 150 : 400); } },
    v: [{ r: "gotas 25 mg/mL", c: 25, g: 20 }, { r: "ampola EV 3 mg/mL", c: 3 }],
    obs: "Contraindicado em menores de 2 anos. 1 gota/kg por dose; sonolência.", pos: true },

  /* --- alergia e anafilaxia --- */
  { n: "Adrenalina IM (anafilaxia)", c: "Emergência", ap: "Ampola 1 mg/mL",
    ind: "Anafilaxia", via: "IM no vasto lateral da coxa", int: "Repetir em 5–15 min", dur: "Até 3 doses",
    d: { k: 0.01, max: 0.5 }, v: [{ r: "ampola 1 mg/mL pura", c: 1 }],
    obs: "Primeira linha, sem diluir. Alguns consensos limitam a 0,3 mg em crianças pré-púberes.", pos: true },
  { n: "Dexclorfeniramina", c: "Anti-histamínico", ap: "Solução 0,4 mg/mL (2 mg/5 mL); comprimido 2 mg",
    ind: "Urticária, prurido, rinite", via: "VO", int: "8 h", dur: "3–5 dias",
    f: function (p) {
      if (p.idade < 2) return porFaixa("não usar abaixo de 2 anos", "—", "0,15 mg/kg/dia ÷ 3");
      var mg = p.idade < 6 ? 0.5 : (p.idade < 12 ? 1 : 2);
      return porFaixa(num(mg) + " mg", ml(mg / 0.4), "2–5 anos 0,5 mg; 6–11 anos 1 mg; ≥ 12 anos 2 mg", "12 mg/dia");
    },
    obs: "Sonolência; pode causar excitação paradoxal.", pos: true },
  { n: "Hidroxizina", c: "Anti-histamínico", ap: "Solução 2 mg/mL; comprimido 25 mg",
    ind: "Urticária, prurido", via: "VO", int: "6–8 h", dur: "3–7 dias",
    d: { k: [0.5, 1], max: 25, maxDia: function (p) { return Math.min(2 * p.peso, 100); } }, v: [{ r: "solução 2 mg/mL", c: 2 }],
    obs: "Sonolência; prolonga o QT.", pos: true },
  { n: "Loratadina", c: "Anti-histamínico", ap: "Xarope 1 mg/mL; comprimido 10 mg",
    ind: "Urticária, rinite alérgica", via: "VO", int: "24 h", dur: "5–10 dias",
    f: function (p) {
      if (p.idade < 2) return porFaixa("não usar abaixo de 2 anos");
      var mg = p.peso < 30 ? 5 : 10;
      return porFaixa(mg + " mg", ml(mg), "< 30 kg: 5 mg; ≥ 30 kg: 10 mg", "10 mg/dia");
    }, obs: "Pouco sedativo.", pos: true },
  { n: "Desloratadina", c: "Anti-histamínico", ap: "Xarope 0,5 mg/mL; comprimido 5 mg",
    ind: "Urticária, rinite alérgica", via: "VO", int: "24 h", dur: "5–10 dias",
    f: function (p) {
      if (p.idade < 0.5) return porFaixa("não usar abaixo de 6 meses");
      var mg = p.idade < 1 ? 1 : (p.idade < 6 ? 1.25 : (p.idade < 12 ? 2.5 : 5));
      return porFaixa(num(mg) + " mg", ml(mg / 0.5), "6–11 meses 1 mg; 1–5 anos 1,25 mg; 6–11 anos 2,5 mg; ≥ 12 anos 5 mg", "5 mg/dia");
    }, obs: "Pouco sedativo.", pos: true },
  { n: "Prometazina", c: "Anti-histamínico", ap: "Ampola 25 mg/mL",
    ind: "Reação alérgica, sem via oral", via: "IM profundo", int: "Dose única; 6–8 h se preciso", dur: "Curta",
    d: { k: [0.25, 0.5], max: 25 }, v: [{ r: "ampola 25 mg/mL", c: 25 }],
    obs: "Contraindicada em menores de 2 anos (depressão respiratória). Não substitui a adrenalina na anafilaxia. Manual PPS: 0,25 mg/kg na alergia e 0,25–0,5 mg/kg na náusea.", pos: true },

  /* --- corticoides --- */
  { n: "Prednisolona", c: "Corticoide", ap: "Solução 3 mg/mL (também 1 mg/mL e gotas 11 mg/mL)",
    ind: "Crise de asma, crupe (alternativa), urticária extensa", via: "VO", int: "24 h (ou ÷ 2)", dur: "3–5 dias",
    d: { k: [1, 2], per: "dia", n: 1, maxDia: 40 }, v: [{ r: "solução 3 mg/mL", c: 3 }],
    obs: "Na asma grave do adolescente e do adulto, até 60 mg/dia. Sem necessidade de desmame em cursos de até 5–7 dias.", pos: true },
  { n: "Dexametasona", c: "Corticoide", ap: "Ampola 4 mg/mL (pode ser dada por via oral); comprimido 4 mg; elixir 0,1 mg/mL",
    ind: "Crupe (dose única); asma (2 doses com 24 h de intervalo)", via: "VO, IM ou EV", int: "Dose única", dur: "1–2 doses",
    d: { k: [0.15, 0.6], max: 16 }, v: [{ r: "ampola 4 mg/mL", c: 4 }],
    obs: "Crupe: dose única; 0,15 mg/kg tem efeito semelhante a 0,6 mg/kg nos quadros leves a moderados, com máximo habitual de 10–12 mg. Asma: 0,6 mg/kg, máx. 16 mg.", pos: true },
  { n: "Hidrocortisona", c: "Corticoide", ap: "Frasco 100 mg e 500 mg (pó): 100 mg + 2 mL = 50 mg/mL",
    ind: "Asma grave sem via oral, anafilaxia (adjuvante), insuficiência adrenal", via: "EV", int: "6 h", dur: "Até via oral",
    d: { k: [2, 4], max: 100 }, v: [{ r: "50 mg/mL", c: 50 }],
    obs: "Choque séptico refratário ou insuficiência adrenal: 50–100 mg/m²/dia (≈ 2–4 mg/kg/dia) ÷ 6/6 h.", pos: true },
  { n: "Metilprednisolona", c: "Corticoide", ap: "Frasco 40 mg, 125 mg e 500 mg (pó): 40 mg/mL",
    ind: "Asma grave sem via oral", via: "EV", int: "6–12 h", dur: "Até via oral",
    d: { k: [1, 2], per: "dia", n: 4, maxDia: 60 }, v: [{ r: "40 mg/mL", c: 40 }],
    obs: "Equivalência: 4 mg de metilprednisolona = 5 mg de prednisolona = 20 mg de hidrocortisona.", pos: true },
  { n: "Budesonida inalatória", c: "Corticoide", ap: "Suspensão para nebulização 0,25 mg/mL e 0,5 mg/mL (2 mL)",
    ind: "Crupe, quando não há via oral", via: "Nebulização", int: "Dose única", dur: "1 dose",
    f: function () { return porFaixa("2 mg", "4 mL da suspensão 0,5 mg/mL (ou 8 mL da 0,25 mg/mL)", "dose fixa", "2 mg"); },
    obs: "Efeito semelhante ao da dexametasona oral, com custo maior.", pos: false },

  /* --- respiratório --- */
  { n: "Salbutamol spray", c: "Broncodilatador", ap: "Aerossol 100 mcg/jato, sempre com espaçador (máscara até 4–5 anos)",
    ind: "Crise de sibilância ou asma", via: "Inalatória", int: "A cada 20 min na 1ª hora; depois 1–4 h", dur: "Conforme resposta",
    f: function (p) {
      var j = clamp(Math.round(p.peso / 3), 2, 10);
      return porFaixa(j + " jatos (" + j * 100 + " mcg)", "1 jato por vez, 5–10 respirações cada", "1 jato para cada 2–3 kg (mín. 2, máx. 10)", "10 jatos/dose");
    },
    obs: "Via preferida na crise leve a moderada (GINA, SBP). Em casa: 2–4 jatos a cada 4–6 h por 5–7 dias.", pos: true },
  { n: "Salbutamol para nebulização", c: "Broncodilatador", ap: "Solução 5 mg/mL (20 gotas/mL)",
    ind: "Crise grave ou sem espaçador", via: "Nebulização com O₂ 6–8 L/min", int: "A cada 20 min na 1ª hora", dur: "Conforme resposta",
    d: { k: 0.15, min: 2.5, max: 5 }, v: [{ r: "solução 5 mg/mL", c: 5, g: 20 }],
    obs: "Completar 3–4 mL com SF. Contínuo na crise grave: 0,5 mg/kg/h (máx. 15 mg/h).", pos: true },
  { n: "Ipratrópio", c: "Broncodilatador", ap: "Solução 0,25 mg/mL (20 gotas/mL)",
    ind: "Crise moderada a grave, junto com o salbutamol", via: "Nebulização", int: "A cada 20 min na 1ª hora (3 doses)", dur: "1ª hora",
    f: function (p) {
      var mg = p.peso < 20 ? 0.25 : 0.5;
      return porFaixa(num(mg) + " mg", ml(mg / 0.25) + " (" + Math.round(mg / 0.25 * 20) + " gotas)", "< 20 kg: 0,25 mg; ≥ 20 kg: 0,5 mg", "0,5 mg/dose");
    }, obs: "Sem benefício comprovado depois da primeira hora.", pos: true },
  { n: "Sulfato de magnésio (asma)", c: "Broncodilatador", ap: "Ampola 10% (100 mg/mL) ou 50% (500 mg/mL)",
    ind: "Crise grave sem resposta na 1ª hora", via: "EV em 20 min", int: "Dose única", dur: "1 dose",
    d: { k: [25, 50], max: 2000 }, v: [{ r: "ampola 10%", c: 100 }, { r: "ampola 50%", c: 500 }],
    obs: "Diluir até 60 mg/mL ou menos. Monitorar pressão arterial. Manual PPS: 25–50 mg/kg; algumas diretrizes aceitam até 75 mg/kg.", pos: true },
  { n: "Adrenalina para nebulização", c: "Emergência", ap: "Ampola 1 mg/mL",
    ind: "Crupe moderado a grave; edema de via aérea", via: "Nebulização", int: "Repetir em 15–20 min se preciso", dur: "Observar 2–4 h (efeito rebote)",
    d: { k: 0.5, max: 5, u: "mL" }, v: [],
    obs: "0,5 mL/kg da ampola 1 mg/mL pura (máx. 5 mL), sempre com corticoide. Na anafilaxia não substitui a adrenalina IM.", pos: true },
  { n: "Terbutalina subcutânea", c: "Broncodilatador", ap: "Ampola 0,5 mg/mL",
    ind: "Crise grave sem entrada de ar ou sem inalatório", via: "SC", int: "A cada 20 min, até 3 doses", dur: "1ª hora",
    d: { k: 0.01, max: 0.25 }, v: [{ r: "ampola 0,5 mg/mL", c: 0.5 }], obs: "Taquicardia, tremor e hipocalemia.", pos: true },
  { n: "Acetilcisteína", c: "Mucolítico", ap: "Xarope pediátrico 20 mg/mL; adulto 40 mg/mL; granulado 100, 200 e 600 mg",
    ind: "Secreção espessa", via: "VO", int: "8–12 h", dur: "5–10 dias",
    f: function (p) {
      if (p.idade < 2) return porFaixa("contraindicada abaixo de 2 anos");
      if (p.idade < 4) return porFaixa("100 mg, 2–3 vezes ao dia", "5 mL do xarope 20 mg/mL", "dose por idade", "300 mg/dia");
      if (p.idade < 12) return porFaixa("100 mg, 3–4 vezes ao dia", "5 mL do xarope 20 mg/mL", "dose por idade", "400 mg/dia");
      return porFaixa("600 mg, 1 vez ao dia", "15 mL do xarope 40 mg/mL", "dose por idade", "600 mg/dia");
    },
    obs: "Benefício clínico modesto nas infecções agudas; hidratação e lavagem nasal vêm primeiro.", pos: false },
  { n: "Dextrometorfano", c: "Antitussígeno", ap: "Xarope (conferir a concentração no rótulo; ex.: 3 mg/mL)",
    ind: "Tosse seca que atrapalha o sono (uso restrito)", via: "VO", int: "6–8 h", dur: "Até 5–7 dias",
    f: function (p) {
      if (p.idade < 6) return porFaixa("não usar abaixo de 6 anos");
      if (p.idade < 12) return porFaixa("5–10 mg", "1,7–3,3 mL de xarope 3 mg/mL", "dose por idade", "60 mg/dia");
      return porFaixa("10–20 mg", "3,3–6,7 mL de xarope 3 mg/mL", "dose por idade", "120 mg/dia");
    },
    obs: "Sociedades pediátricas desaconselham antitussígenos em crianças pequenas. Acima de 1 ano, mel (2,5–5 mL à noite) tem evidência melhor. Não associar a IMAO.", pos: false },

  /* --- antibióticos de pronto atendimento --- */
  { n: "Amoxicilina (dose padrão)", c: "Antibiótico", ap: "Suspensão 250 mg/5 mL (50 mg/mL) e 400 mg/5 mL (80 mg/mL); cápsula 500 mg",
    ind: "Alternativa de 50 mg/kg/dia (SBP 2022) na pneumonia e na otite sem fator de risco; faringoamigdalite", via: "VO", int: "8 h (ou 12 h)", dur: "5–10 dias conforme o foco",
    d: { k: 50, per: "dia", n: 3, max: 500 }, v: [{ r: "suspensão 50 mg/mL", c: 50 }],
    obs: "Pneumonia: 7 dias (SBP 2022). Faringoamigdalite estreptocócica: 50 mg/kg/dia em 1–2 tomadas (máx. 1 g/dia) por 10 dias.", pos: true },
  { n: "Amoxicilina (dose alta)", c: "Antibiótico", ap: "Suspensão 400 mg/5 mL (80 mg/mL)",
    ind: "Otite média, rinossinusite bacteriana e pneumonia comunitária: esquema do Manual PPS", via: "VO", int: "12 h", dur: "5–10 dias",
    d: { k: [80, 90], per: "dia", n: 2, maxDia: 4000 }, v: [{ r: "suspensão 80 mg/mL", c: 80 }],
    obs: "Manual PPS e AAP/IDSA: 80–90 mg/kg/dia de 12/12 h, máx. 4 g/dia. A SBP 2022 aceita 50 mg/kg/dia na pneumonia não grave.", pos: true },
  { n: "Amoxicilina + clavulanato", c: "Antibiótico", ap: "Suspensão 400 + 57 mg/5 mL (80 mg/mL de amoxicilina); 250 + 62,5 mg/5 mL; ES 600 + 42,9 mg/5 mL",
    ind: "Falha da amoxicilina, mordedura, sinusite ou otite recorrente, celulite periorbitária", via: "VO", int: "12 h", dur: "7–10 dias",
    d: { k: 50, per: "dia", n: 2, max: 875 }, v: [{ r: "suspensão 80 mg/mL (400 + 57)", c: 80 }],
    obs: "Dose em amoxicilina. Dose alta (90 mg/kg/dia) apenas com a formulação ES 600 + 42,9. Diarreia frequente: tomar com alimento.", pos: true },
  { n: "Cefalexina", c: "Antibiótico", ap: "Suspensão 250 mg/5 mL (50 mg/mL); cápsula 500 mg",
    ind: "Pele e partes moles, infecção urinária baixa", via: "VO", int: "6 h", dur: "5–10 dias",
    d: { k: [50, 100], per: "dia", n: 4, max: 1000 }, v: [{ r: "suspensão 50 mg/mL", c: 50 }],
    obs: "Impetigo e celulite sem gravidade: 50 mg/kg/dia.", pos: true },
  { n: "Cefuroxima axetil", c: "Antibiótico", ap: "Suspensão 250 mg/5 mL (50 mg/mL); comprimido 250 e 500 mg",
    ind: "Infecção urinária febril (via oral), alergia não grave à penicilina", via: "VO", int: "12 h", dur: "7–10 dias",
    d: { k: [20, 30], per: "dia", n: 2, max: 500 }, v: [{ r: "suspensão 50 mg/mL", c: 50 }], obs: "Tomar com alimento.", pos: true },
  { n: "Azitromicina", c: "Antibiótico", ap: "Suspensão 200 mg/5 mL (40 mg/mL); comprimido 500 mg",
    ind: "Pneumonia atípica, coqueluche, alergia grave à penicilina, disenteria (MS 2023)", via: "VO", int: "24 h", dur: "3–5 dias",
    d: { k: 10, per: "dia", n: 1, maxDia: 500 }, v: [{ r: "suspensão 40 mg/mL", c: 40 }],
    obs: "Pneumonia atípica: 10 mg/kg/dia por 5 dias, ou 10 mg/kg no 1º dia (máx. 500 mg) e 5 mg/kg/dia do 2º ao 5º dia (máx. 250 mg), como no Manual PPS. Disenteria (até 30 kg): 10 mg/kg no 1º dia e 5 mg/kg/dia por mais 4 dias.", pos: true },
  { n: "Claritromicina", c: "Antibiótico", ap: "Suspensão 25 mg/mL e 50 mg/mL; comprimido 500 mg",
    ind: "Pneumonia atípica, alergia à penicilina", via: "VO", int: "12 h", dur: "7–10 dias",
    d: { k: 15, per: "dia", n: 2, max: 500 }, v: [{ r: "suspensão 50 mg/mL", c: 50 }, { r: "suspensão 25 mg/mL", c: 25 }], obs: "Muitas interações (CYP3A4); prolonga o QT.", pos: true },
  { n: "Sulfametoxazol + trimetoprima", c: "Antibiótico", ap: "Suspensão 200 + 40 mg/5 mL (8 mg/mL de trimetoprima); comprimido 400 + 80 mg",
    ind: "Infecção urinária sensível, abscesso por S. aureus comunitário", via: "VO", int: "12 h", dur: "5–10 dias",
    d: { k: [8, 10], per: "dia", n: 2, max: 160 }, v: [{ r: "suspensão 8 mg/mL de trimetoprima", c: 8 }],
    obs: "Dose em trimetoprima. Não usar em menores de 2 meses nem na deficiência de G6PD.", pos: true },
  { n: "Penicilina G benzatina", c: "Antibiótico", ap: "Frasco 600.000 UI e 1.200.000 UI",
    ind: "Faringoamigdalite estreptocócica, escarlatina, impetigo", via: "IM profundo", int: "Dose única", dur: "1 dose",
    f: function (p) {
      if (p.peso < 10) return porFaixa(num(50000 * p.peso) + " UI", "fração do frasco de 600.000 UI", "abaixo de 10 kg: 50.000 UI/kg", "600.000 UI");
      var corte = "até 20 kg: 600.000 UI; a partir de 27 kg: 1.200.000 UI; entre 20 e 27 kg as fontes divergem";
      if (p.peso < 20) return porFaixa("600 000 UI", "1 frasco de 600.000 UI", corte, "1.200.000 UI");
      if (p.peso < 27) return porFaixa("600 000 UI (corte de 27 kg: Manual PPS e AAP) ou 1 200 000 UI (corte de 20 kg: Ministério da Saúde)", "1 frasco de 600.000 UI ou de 1.200.000 UI", corte, "1.200.000 UI");
      return porFaixa("1 200 000 UI", "1 frasco de 1.200.000 UI", corte, "1.200.000 UI");
    }, obs: "Nunca por via endovenosa.", pos: true },
  { n: "Ceftriaxona", c: "Antibiótico", ap: "Frasco 500 mg e 1 g (pó). EV: 1 g + 10 mL = 100 mg/mL. IM: 1 g + 3,5 mL de lidocaína 1% ≈ 250 mg/mL",
    ind: "Infecção grave, infecção urinária febril, pneumonia grave", via: "EV ou IM", int: "24 h (12 h na meningite)", dur: "Conforme o foco",
    d: { k: [50, 100], per: "dia", n: 1, max: 2000, maxDia: 4000 }, v: [{ r: "EV 100 mg/mL", c: 100 }, { r: "IM 250 mg/mL", c: 250 }],
    obs: "Meningite: 100 mg/kg/dia ÷ 12/12 h. Não misturar com cálcio; evitar no recém-nascido (preferir cefotaxima).", pos: true },
  { n: "Ampicilina", c: "Antibiótico", ap: "Frasco 500 mg e 1 g (pó): 1 g + 10 mL = 100 mg/mL",
    ind: "Pneumonia com internação (SBP), sepse neonatal", via: "EV", int: "6 h", dur: "Conforme o foco",
    d: { k: 50, max: 2000 }, v: [{ r: "100 mg/mL", c: 100 }], obs: "Meningite: 300–400 mg/kg/dia.", pos: true },
  { n: "Gentamicina", c: "Antibiótico", ap: "Ampola 40 mg/mL e 10 mg/mL",
    ind: "Infecção urinária febril, sepse neonatal (com ampicilina)", via: "EV em 30 min ou IM", int: "24 h", dur: "Conforme o foco",
    d: { k: function (p) { return p.idade * 365.25 < 28 ? [4, 5] : [5, 7.5]; }, per: "dia", n: 1 }, v: [{ r: "ampola 40 mg/mL", c: 40 }], obs: "Recém-nascido: 4–5 mg/kg a cada 24–48 h conforme a idade gestacional. No obeso, calcular pelo peso ajustado. Ajustar à função renal; nefro e ototóxica.", pos: true },
  { n: "Oxacilina", c: "Antibiótico", ap: "Frasco 500 mg (pó): 500 mg + 5 mL = 100 mg/mL",
    ind: "Celulite com internação, osteomielite, artrite séptica", via: "EV", int: "6 h", dur: "Conforme o foco",
    d: { k: [100, 200], per: "dia", n: 4, max: 2000 }, v: [{ r: "100 mg/mL", c: 100 }], obs: "Flebite: diluir e infundir em 30–60 min.", pos: true },
  { n: "Clindamicina", c: "Antibiótico", ap: "Ampola 150 mg/mL; cápsula 300 mg",
    ind: "Pele e partes moles, osteoarticular, alergia à penicilina", via: "EV em 30–60 min ou VO", int: "8 h", dur: "Conforme o foco",
    d: { k: [20, 40], per: "dia", n: 3, max: 900 }, v: [{ r: "ampola 150 mg/mL", c: 150 }], obs: "Diluir até 18 mg/mL ou menos; nunca em bolus. Via oral: máx. 600 mg/dose.", pos: true },
  { n: "Metronidazol", c: "Antibiótico e antiparasitário", ap: "Suspensão 40 mg/mL; bolsa EV 5 mg/mL; comprimido 250 e 400 mg",
    ind: "Anaeróbios, giardíase, amebíase", via: "VO ou EV", int: "8 h", dur: "5–10 dias",
    d: { k: 30, per: "dia", n: 3, max: 500 }, v: [{ r: "suspensão 40 mg/mL", c: 40 }, { r: "EV 5 mg/mL", c: 5 }], obs: "Giardíase: 15 mg/kg/dia ÷ 3 por 5–7 dias.", pos: true },
  { n: "Oseltamivir", c: "Antiviral", ap: "Cápsula 30, 45 e 75 mg (abrir e diluir: 75 mg em 7,5 mL de água = 10 mg/mL)",
    ind: "Síndrome gripal com fator de risco e SRAG (MS 2023)", via: "VO", int: "12 h", dur: "5 dias",
    f: function (p) {
      var mg, kg;
      if (p.idade < 1) { var k = p.idade * 12 < 9 ? 3 : 3.5; mg = k * p.peso; kg = num(k) + " mg/kg/dose (0–8 meses 3; 9–11 meses 3,5)"; }
      else { mg = p.peso <= 15 ? 30 : (p.peso <= 23 ? 45 : (p.peso <= 40 ? 60 : 75)); kg = "≤ 15 kg 30 mg; > 15–23 kg 45 mg; > 23–40 kg 60 mg; > 40 kg 75 mg"; }
      return porFaixa(num(mg) + " mg", ml(mg / 10) + " da diluição 10 mg/mL", kg, "75 mg/dose");
    }, obs: "Iniciar de preferência nas primeiras 48 h; nos graves, a qualquer tempo. Ajustar na insuficiência renal.", pos: true },
  { n: "Aciclovir (injetável)", c: "Antiviral", ap: "Frasco 250 mg (pó): 250 mg + 10 mL = 25 mg/mL",
    ind: "Encefalite herpética, varicela grave ou em imunossuprimido", via: "EV em 1 h", int: "8 h", dur: "7–21 dias conforme o quadro",
    d: { k: function (p) { return p.idade * 365.25 < 90 ? 20 : [10, 15]; } }, v: [{ r: "25 mg/mL (diluir para ≤ 7 mg/mL)", c: 25 }],
    obs: "Até 3 meses: 20 mg/kg/dose. Encefalite: 14–21 dias. Hidratar bem (nefrotoxicidade).", pos: true },
  { n: "Albendazol", c: "Antiparasitário", ap: "Suspensão 40 mg/mL (10 mL); comprimido 400 mg",
    ind: "Helmintíases intestinais", via: "VO", int: "Dose única", dur: "1 dia (repetir em 14 dias se indicado)",
    f: function (p) {
      if (p.idade < 1) return porFaixa("não usar abaixo de 1 ano");
      return p.idade < 2 ? porFaixa("200 mg", "5 mL da suspensão 40 mg/mL", "1–2 anos 200 mg; ≥ 2 anos 400 mg", "400 mg")
        : porFaixa("400 mg", "10 mL da suspensão 40 mg/mL", "1–2 anos 200 mg; ≥ 2 anos 400 mg", "400 mg");
    }, obs: "Giardíase: 400 mg/dia por 5 dias.", pos: false },
  { n: "Ivermectina", c: "Antiparasitário", ap: "Comprimido 6 mg",
    ind: "Escabiose, pediculose, estrongiloidíase", via: "VO", int: "Dose única", dur: "Repetir em 7–14 dias na escabiose",
    f: function (p) {
      if (p.peso < 15) return porFaixa("não usar abaixo de 15 kg");
      var c = p.peso <= 24 ? "½" : (p.peso <= 35 ? "1" : (p.peso <= 50 ? "1½" : (p.peso <= 65 ? "2" : (p.peso <= 79 ? "2½" : null))));
      if (!c) return porFaixa(num(0.2 * p.peso) + " mg", num(0.2 * p.peso / 6) + " comprimidos de 6 mg", "200 mcg/kg");
      return porFaixa(c + " comprimido" + (c === "½" || c === "1" ? "" : "s") + " de 6 mg", "—", "≈ 200 mcg/kg por faixa de peso");
    }, obs: "Faixas da bula: 15–24 kg ½; 25–35 kg 1; 36–50 kg 1½; 51–65 kg 2; 66–79 kg 2½ comprimidos.", pos: false },

  /* --- gastrointestinal e hidratação --- */
  { n: "Soro de reidratação oral — plano B", c: "Hidratação", ap: "Sachê para 1 litro de água",
    ind: "Desidratação sem gravidade (MS 2023)", via: "VO, em pequenos volumes", int: "Em 4–6 h, na unidade", dur: "Até hidratar",
    d: { k: [50, 100], u: "mL" }, v: [],
    obs: "Plano A, em casa, após cada evacuação: menor de 1 ano 50–100 mL; 1–10 anos 100–200 mL; maiores, à vontade.", pos: true },
  { n: "Zinco", c: "Hidratação", ap: "Solução oral de sulfato de zinco; comprimido dispersível",
    ind: "Diarreia aguda em menores de 5 anos (MS 2023, OMS)", via: "VO", int: "24 h", dur: "10–14 dias",
    f: function (p) {
      if (p.idade >= 5) return porFaixa("não indicado de rotina acima de 5 anos");
      var mg = p.idade < 0.5 ? 10 : 20;
      return porFaixa(mg + " mg de zinco elementar", "conforme a concentração do produto", "< 6 meses 10 mg/dia; 6 meses–5 anos 20 mg/dia", "20 mg/dia");
    }, obs: "Reduz a duração e a recorrência da diarreia.", pos: false },
  { n: "Racecadotrila", c: "Antidiarreico antissecretor", ap: "Sachê 10 mg e 30 mg; cápsula 100 mg",
    ind: "Diarreia aguda aquosa, junto com a reidratação", via: "VO", int: "8 h", dur: "Até 7 dias",
    f: function (p) {
      if (p.idade < 0.25) return porFaixa("não usar abaixo de 3 meses");
      var mg = 1.5 * p.peso, s;
      if (p.peso < 9) s = "1 sachê de 10 mg"; else if (p.peso < 13) s = "2 sachês de 10 mg"; else if (p.peso <= 27) s = "1 sachê de 30 mg"; else s = "2 sachês de 30 mg";
      if (p.idade >= 12 && p.peso > 40) return porFaixa("100 mg", "1 cápsula de 100 mg", "adulto: 100 mg por dose", "300 mg/dia");
      return porFaixa(num(Math.min(mg, 100)) + " mg", s, "1,5 mg/kg/dose", "—");
    }, obs: "Não reduz a motilidade; não usar na disenteria.", pos: false },
  { n: "Probiótico", c: "Hidratação", ap: "Saccharomyces boulardii 200–250 mg; Lactobacillus rhamnosus GG; L. reuteri",
    ind: "Diarreia aguda (adjuvante)", via: "VO", int: "12–24 h", dur: "5–7 dias",
    f: function () { return porFaixa("S. boulardii 250 mg", "1 sachê ou cápsula", "dose fixa", "500 mg/dia"); },
    obs: "Efeito modesto: encurta a diarreia em cerca de um dia. Evitar em imunossuprimido e com cateter central.", pos: false },
  { n: "Escopolamina (butilbrometo)", c: "Antiespasmódico", ap: "Gotas 10 mg/mL (1 gota = 0,5 mg); ampola 20 mg/mL",
    ind: "Cólica abdominal", via: "VO, EV ou IM", int: "8 h", dur: "Curta",
    d: { k: function (p) { return p.idade < 0.25 ? 1.5 : (p.idade < 1 ? 0.7 : [0.3, 0.5]); }, max: 20 },
    v: [{ r: "gotas 10 mg/mL", c: 10, g: 20 }, { r: "ampola 20 mg/mL", c: 20 }],
    obs: "Doses da bula por peso: até 3 meses 1,5 mg/kg; 3–11 meses 0,7 mg/kg; 1–6 anos 0,3–0,5 mg/kg. Não usar na diarreia aguda da criança. Investigar a causa da dor.", pos: true },
  { n: "Simeticona", c: "Antiflatulento", ap: "Gotas 75 mg/mL",
    ind: "Gases e distensão", via: "VO", int: "8 h", dur: "Curta",
    f: function (p) {
      var g = p.idade < 2 ? "4–6 gotas" : (p.idade < 12 ? "6–12 gotas" : "16 gotas");
      return porFaixa(g, "—", "lactente 4–6; até 12 anos 6–12; maiores 16 gotas", "—");
    }, obs: "Segura; eficácia limitada na cólica do lactente.", pos: false },
  { n: "Lactulose", c: "Laxativo", ap: "Xarope 667 mg/mL",
    ind: "Constipação", via: "VO", int: "12–24 h", dur: "Conforme resposta",
    d: { k: [1, 3], per: "dia", n: 1, u: "mL", maxDia: 60 }, v: [], obs: "Ajustar para fezes pastosas; flatulência no início.", pos: true },
  { n: "Omeprazol", c: "Inibidor da bomba de prótons", ap: "Cápsula 10 e 20 mg; frasco EV 40 mg",
    ind: "Doença péptica, hemorragia digestiva alta", via: "VO em jejum ou EV", int: "24 h", dur: "Conforme o quadro",
    d: { k: 1, per: "dia", n: 1, maxDia: 40 }, v: [{ r: "EV 4 mg/mL (40 mg + 10 mL)", c: 4 }], obs: "Não usar para regurgitação fisiológica do lactente.", pos: true },

  /* --- neurologia e sedação --- */
  { n: "Midazolam (crise convulsiva)", c: "Anticonvulsivante", ap: "Ampola 5 mg/mL (3 e 10 mL)",
    ind: "Crise convulsiva", via: "IM, intranasal, bucal ou EV", int: "Repetir uma vez em 5 min", dur: "Até 2 doses",
    d: { k: 0.2, max: 10 }, v: [{ r: "ampola 5 mg/mL", c: 5 }],
    obs: "IM e intranasal 0,2 mg/kg; bucal 0,3–0,5 mg/kg; EV 0,1–0,2 mg/kg. Ter material de via aérea e flumazenil.", pos: true },
  { n: "Diazepam", c: "Anticonvulsivante", ap: "Ampola 5 mg/mL (2 mL)",
    ind: "Crise convulsiva", via: "EV lento ou retal", int: "Repetir uma vez em 5 min", dur: "Até 2 doses",
    d: { k: [0.15, 0.2], max: 10 }, v: [{ r: "ampola 5 mg/mL", c: 5 }],
    obs: "Retal: 0,5 mg/kg (máx. 20 mg) com a solução injetável. Não usar por via IM (absorção errática).", pos: true },
  { n: "Fenitoína", c: "Anticonvulsivante", ap: "Ampola 50 mg/mL (5 mL)",
    ind: "Estado de mal — 2ª linha", via: "EV", int: "Dose única de ataque", dur: "20–30 min",
    d: { k: 20, max: 1500 }, v: [{ r: "ampola 50 mg/mL", c: 50 }],
    obs: "Diluir só em SF; infundir até 1 mg/kg/min (máx. 50 mg/min) com monitor. Muitos protocolos nacionais limitam o ataque a 1 g.", pos: true },
  { n: "Fenobarbital", c: "Anticonvulsivante", ap: "Ampola 100 mg/mL (2 mL)",
    ind: "Estado de mal — 2ª linha (1ª no recém-nascido)", via: "EV", int: "Dose única de ataque", dur: "20 min",
    d: { k: [15, 20], max: 1000 }, v: [{ r: "ampola 100 mg/mL", c: 100 }], obs: "Até 1 mg/kg/min (máx. 30 mg/min em crianças). Depressão respiratória e hipotensão.", pos: true },
  { n: "Levetiracetam", c: "Anticonvulsivante", ap: "Frasco 100 mg/mL (5 mL)",
    ind: "Estado de mal — 2ª linha", via: "EV em 5–15 min", int: "Dose única de ataque", dur: "15 min",
    d: { k: [40, 60], max: 4500 }, v: [{ r: "frasco 100 mg/mL", c: 100 }], obs: "Poucas interações; ajustar na insuficiência renal.", pos: true },
  { n: "Cetamina (procedimento)", c: "Sedação e analgesia", ap: "Frasco 50 mg/mL",
    ind: "Sedação e analgesia para procedimento", via: "EV em 1 min ou IM", int: "Repetir meia dose se preciso", dur: "Procedimento",
    d: { k: [1, 2], max: 100 }, v: [{ r: "frasco 50 mg/mL", c: 50 }],
    obs: "IM: 4–5 mg/kg. Laringoespasmo é raro; vômitos na recuperação. Evitar em menores de 3 meses.", pos: true },

  /* --- outros --- */
  { n: "Furosemida", c: "Diurético", ap: "Ampola 10 mg/mL (2 mL); comprimido 40 mg",
    ind: "Congestão, edema agudo de pulmão", via: "EV lento ou VO", int: "6–12 h", dur: "Conforme resposta",
    d: { k: [0.5, 2], max: 40 }, v: [{ r: "ampola 10 mg/mL", c: 10 }], obs: "Até 0,5 mg/kg/min (ototoxicidade). Vigiar potássio.", pos: true },
  { n: "Vitamina K (fitomenadiona)", c: "Vitamina", ap: "Ampola 10 mg/mL e 2 mg/0,2 mL",
    ind: "Profilaxia da doença hemorrágica do recém-nascido", via: "IM", int: "Dose única ao nascer", dur: "1 dose",
    f: function (p) { return p.peso < 1.5 ? porFaixa("0,5 mg", "0,05 mL da ampola 10 mg/mL", "< 1,5 kg 0,5 mg; ≥ 1,5 kg 1 mg") : porFaixa("1 mg", "0,1 mL da ampola 10 mg/mL", "< 1,5 kg 0,5 mg; ≥ 1,5 kg 1 mg"); },
    obs: "Sangramento por antagonista da vitamina K: 1–5 mg EV lento em crianças.", pos: false },
  { n: "Vitamina D (colecalciferol)", c: "Vitamina", ap: "Gotas (conferir UI por gota no rótulo; ex.: 200 UI/gota)",
    ind: "Suplementação (SBP)", via: "VO", int: "24 h", dur: "Até 2 anos",
    f: function (p) {
      if (p.idade >= 2) return porFaixa("sem suplementação de rotina após 2 anos");
      var ui = p.idade < 1 ? 400 : 600;
      return porFaixa(ui + " UI", ui / 200 + " gotas de produto com 200 UI/gota", "< 1 ano 400 UI/dia; 1–2 anos 600 UI/dia", ui + " UI/dia");
    }, obs: "Dose fixa por idade; não ajustar por peso.", pos: false }
];

/* ---------- 6. Restrições de idade e peso ----------
   Quando a função devolve um texto, a tabela mostra o aviso no lugar da dose. */
var RESTRICAO = {
  "Dipirona (oral)": function (p) { return (p.idade < 0.25 || p.peso < 5) ? "contraindicada em menores de 3 meses ou com menos de 5 kg" : null; },
  "Dipirona (injetável)": function (p) { return (p.idade < 0.25 || p.peso < 5) ? "contraindicada em menores de 3 meses ou com menos de 5 kg" : null; },
  "Ibuprofeno": function (p) { return p.idade < 0.5 ? "não usar em menores de 6 meses" : null; },
  "Cetoprofeno": function (p) { return p.idade < 1 ? "não usar em menores de 1 ano" : null; },
  "Tramadol": function (p) { return p.idade < 1 ? "não usar em menores de 1 ano" : null; },
  "Ondansetrona (injetável)": function (p) { return p.idade < 0.5 ? "evitar em menores de 6 meses" : null; },
  "Bromoprida": function (p) { return p.idade < 1 ? "contraindicada em menores de 1 ano" : null; },
  "Dimenidrinato + piridoxina": function (p) { return p.idade < 2 ? "contraindicado em menores de 2 anos" : null; },
  "Prometazina": function (p) { return p.idade < 2 ? "contraindicada em menores de 2 anos" : null; },
  "Hidroxizina": function (p) { return p.idade < 0.5 ? "evitar em menores de 6 meses" : null; },
  "Sulfametoxazol + trimetoprima": function (p) { return p.idade < 2 / 12 ? "não usar em menores de 2 meses" : null; },
  "Amoxicilina (dose padrão)": function (p) { return p.idade < 2 / 12 ? "Menor de 2 meses com infecção bacteriana: internar e tratar por via endovenosa" : null; },
  "Amoxicilina (dose alta)": function (p) { return p.idade < 2 / 12 ? "Menor de 2 meses com infecção bacteriana: internar e tratar por via endovenosa" : null; },
  "Amoxicilina + clavulanato": function (p) { return p.idade < 2 / 12 ? "Menor de 2 meses com infecção bacteriana: internar e tratar por via endovenosa" : null; },
  "Metronidazol": function (p) { return p.idade * 365.25 < 28 ? "Recém-nascido: dose e intervalo próprios, conforme a idade gestacional" : null; },
  "Clindamicina": function (p) { return p.idade * 365.25 < 28 ? "Recém-nascido: dose e intervalo próprios, conforme a idade gestacional" : null; },
  "Diazepam": function (p) { return p.idade * 365.25 < 28 ? "Recém-nascido: evitar; preferir fenobarbital ou midazolam" : null; },
  "Salbutamol spray": function (p) { return p.idade * 365.25 < 28 ? "Recém-nascido: sem indicação habitual" : null; },
  "Ceftriaxona": function (p) { return p.idade * 365.25 < 28 ? "evitar no recém-nascido: preferir cefotaxima" : null; },
  "Claritromicina": function (p) { return p.idade < 0.5 ? "evitar em menores de 6 meses" : null; },
  "Cefuroxima axetil": function (p) { return p.idade < 0.25 ? "evitar em menores de 3 meses" : null; },
  "Cetamina (procedimento)": function (p) { return p.idade < 0.25 ? "evitar em menores de 3 meses" : null; },
  "Lactulose": function (p) { return p.idade * 365.25 < 28 ? "não usar no recém-nascido sem orientação do especialista" : null; },
  "Omeprazol": function (p) { return p.idade * 365.25 < 28 ? "não usar no recém-nascido sem orientação do especialista" : null; }
};
