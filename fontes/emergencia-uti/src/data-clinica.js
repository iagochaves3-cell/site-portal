/* =====================================================================
   Dados clínicos: choques, antibióticos por síndrome, equipamentos por
   zona de peso, hipóteses diagnósticas, documentos e orientações de alta.
   ===================================================================== */

/* ---------- choques ---------- */
var CHOQUES = {
  sep: { t: "Choque séptico",
    r: "Infecção suspeita com disfunção cardiovascular: hipotensão para a idade, lactato > 5 mmol/L ou necessidade de vasoativo (critérios Phoenix 2024). Sinais precoces: taquicardia, enchimento capilar > 2 s ou em flush, pulsos finos ou amplos, alteração do sensório, oligúria.",
    k: 20, kTxt: "10–20 mL/kg por alíquota",
    ex: "Cristaloide balanceado (Ringer lactato) em alíquotas de 10–20 mL/kg, até 40–60 mL/kg na 1ª hora onde há UTI; sem UTI, até 40 mL/kg e só se houver hipotensão (SSC 2026). Parar se surgirem crepitações, hepatomegalia ou piora respiratória.",
    vaso: { n: "Adrenalina", dose: 0.1, alt: "Alternativa: noradrenalina 0,05–0,1 mcg/kg/min. Pode iniciar em veia periférica enquanto se obtém o acesso central.",
      adulto: { n: "Noradrenalina", dose: 0.1, alt: "No adulto, a noradrenalina é a primeira escolha (SSC 2021); associar vasopressina 0,03 U/min se a dose ficar alta. Pode iniciar em veia periférica." } },
    d: ["Antibiótico na 1ª hora (em até 3 h se não houver choque), após hemocultura quando isso não atrasar.",
        "Dosar lactato; guiar a ressuscitação por frequência cardíaca, pressão, enchimento capilar, pulsos, sensório e diurese.",
        "Vasoativo se o choque persistir após 40–60 mL/kg, ou antes se houver sobrecarga. Catecolamina em dose alta: associar vasopressina.",
        "Hidrocortisona só no choque refratário a fluido e catecolamina ou na suspeita de insuficiência adrenal.",
        "Controlar o foco: drenar abscesso, retirar cateter infectado."] },
  ana: { t: "Choque anafilático",
    r: "Início súbito, após exposição provável a alérgeno, de sintomas de pele ou mucosa com comprometimento respiratório ou circulatório; ou hipotensão, broncoespasmo ou edema de laringe após alérgeno conhecido, mesmo sem lesões de pele.",
    k: 20, kTxt: "10–20 mL/kg se houver hipotensão",
    ex: "Decúbito dorsal com pernas elevadas. Cristaloide 10–20 mL/kg em bolus se a hipotensão persistir após a adrenalina.",
    vaso: { im: true, n: "Adrenalina IM", alt: "Repetir a cada 5–15 min. Refratário: adrenalina EV contínua 0,1–1 mcg/kg/min." },
    d: ["Adrenalina IM na coxa é a primeira medida; não atrasar por anti-histamínico ou corticoide.",
        "Oxigênio em alto fluxo; salbutamol se broncoespasmo; adrenalina nebulizada se estridor.",
        "Em uso de betabloqueador e sem resposta: glucagon 0,02–0,03 mg/kg EV (máx. 1 mg em crianças).",
        "Observar 4–6 h (12–24 h nos graves): risco de reação bifásica. Alta com plano de ação e encaminhamento ao alergista."] },
  hipo: { t: "Choque hipovolêmico",
    r: "Perda de volume (diarreia, vômitos, hemorragia, queimadura): taquicardia, extremidades frias, enchimento capilar > 2 s, mucosas secas, oligúria. Hipotensão é sinal tardio.",
    k: 20, kTxt: "20 mL/kg por alíquota",
    ex: "Cristaloide 20 mL/kg em 5–20 min, repetindo conforme reavaliação. Na hemorragia: 10–20 mL/kg e passar cedo para hemocomponentes.",
    vaso: null,
    d: ["Controlar a perda: compressão, torniquete, cirurgia; ou corrigir a causa da desidratação.",
        "Hemorragia: concentrado de hemácias 10–20 mL/kg; ácido tranexâmico nas primeiras 3 h.",
        "Vasoativo apenas como ponte, se a hipotensão persistir apesar da reposição adequada.",
        "Dengue com choque: 20 mL/kg em até 20 min, até 3 vezes (MS 2024)."] },
  card: { t: "Choque cardiogênico",
    r: "Má perfusão com congestão: hepatomegalia, crepitações, ritmo de galope, turgência jugular, cardiomegalia, linhas B ao ultrassom. Piora após volume.",
    k: 5, kTxt: "5–10 mL/kg, com cautela",
    ex: "Alíquotas de 5–10 mL/kg em 10–20 min somente se não houver congestão, reavaliando o fígado e a ausculta.",
    vaso: { n: "Adrenalina", dose: 0.05, alt: "Alternativas: dobutamina 5–10 mcg/kg/min ou, se a pressão permitir, milrinona 0,25–0,75 mcg/kg/min." },
    d: ["Ecocardiograma ou ultrassom à beira do leito para função ventricular e derrame.",
        "Recém-nascido em choque nas duas primeiras semanas: pensar em cardiopatia dependente de canal e iniciar alprostadil.",
        "Tratar arritmia; ventilação com pressão positiva reduz a pós-carga do ventrículo esquerdo.",
        "Suspeita de miocardite: transferir cedo para centro com suporte circulatório."] },
  neu: { t: "Choque neurogênico",
    r: "Lesão medular cervical ou torácica alta: hipotensão com bradicardia e pele quente e seca abaixo da lesão.",
    k: 20, kTxt: "10–20 mL/kg, sem excesso",
    ex: "Cristaloide 10–20 mL/kg; evitar sobrecarga, pois o problema é vasodilatação.",
    vaso: { n: "Noradrenalina", dose: 0.1, alt: "Atropina se houver bradicardia sintomática." },
    d: ["Excluir hemorragia antes de atribuir o choque à lesão medular.",
        "Manter a pressão arterial média no limite superior da faixa para a idade, para perfusão medular.",
        "Imobilizar a coluna e prevenir hipotermia."] },
  obs: { t: "Choque obstrutivo",
    r: "Pneumotórax hipertensivo, tamponamento cardíaco, embolia pulmonar ou obstrução de via de saída: hipotensão com turgência jugular, pulso paradoxal, murmúrio abolido ou bulhas abafadas.",
    k: 10, kTxt: "10–20 mL/kg como ponte",
    ex: "Cristaloide 10–20 mL/kg enquanto se resolve a causa mecânica.",
    vaso: { n: "Noradrenalina", dose: 0.1, alt: "Apenas como ponte até a desobstrução." },
    d: ["Pneumotórax hipertensivo: descompressão imediata com agulha e drenagem torácica.",
        "Tamponamento: pericardiocentese guiada por ultrassom.",
        "Embolia pulmonar maciça: anticoagulação e trombólise conforme protocolo.",
        "Ultrassom à beira do leito para o diagnóstico rápido."] }
};

/* ---------- equipamentos por zona de peso ---------- */
var EQUIP_ITENS = ["Tubo traqueal sem cuff", "Tubo traqueal com cuff", "Lâmina do laringoscópio", "Cânula orofaríngea", "Máscara laríngea", "Sonda de aspiração", "Sonda gástrica", "Sonda vesical", "Dreno de tórax", "Cateter venoso", "Bolsa-válvula-máscara", "Agulha intraóssea (EZ-IO®)", "Pás do desfibrilador"];
var EQUIP = {
  sub:      ["2,5–3,0 mm", "não usar", "Reta nº 0", "30–40 mm", "nº 1", "5–6 Fr", "5 Fr", "5 Fr", "8–10 Fr", "24 G", "Neonatal (250 mL)", "Agulha manual 18 G (EZ-IO® não indicada abaixo de 3 kg)", "Infantis"],
  cinza:    ["3,0–3,5 mm", "3,0 mm", "Reta nº 0–1", "40–50 mm", "nº 1", "6–8 Fr", "5–8 Fr", "5–8 Fr", "10–12 Fr", "22–24 G", "Lactente (450–500 mL)", "15 mm (rosa)", "Infantis"],
  rosa:     ["3,5 mm", "3,0 mm", "Reta nº 1", "50 mm", "nº 1,5", "8 Fr", "5–8 Fr", "8 Fr", "10–12 Fr", "22–24 G", "Lactente (450–500 mL)", "15 mm (rosa)", "Infantis"],
  vermelha: ["3,5 mm", "3,0 mm", "Reta nº 1", "50 mm", "nº 1,5", "8 Fr", "5–8 Fr", "8 Fr", "10–12 Fr", "22–24 G", "Criança (450–500 mL)", "15 mm (rosa)", "Infantis"],
  roxa:     ["4,0 mm", "3,5 mm", "Reta nº 1", "60 mm", "nº 2", "8–10 Fr", "8–10 Fr", "8–10 Fr", "16–20 Fr", "20–24 G", "Criança (450–500 mL)", "15 mm (rosa)", "Adulto (acima de 10 kg)"],
  amarela:  ["4,5 mm", "4,0 mm", "Reta nº 2", "60 mm", "nº 2", "10 Fr", "10 Fr", "10 Fr", "20–24 Fr", "18–22 G", "Criança (450–500 mL)", "15 mm (rosa)", "Adulto"],
  branca:   ["5,0 mm", "4,5 mm", "Reta ou curva nº 2", "60 mm", "nº 2", "10 Fr", "10 Fr", "10–12 Fr", "20–24 Fr", "18–22 G", "Criança (450–500 mL)", "15 mm (rosa)", "Adulto"],
  azul:     ["5,5 mm", "5,0 mm", "Reta ou curva nº 2", "70 mm", "nº 2–2,5", "10 Fr", "12–14 Fr", "10–12 Fr", "24–32 Fr", "18–20 G", "Criança (450–500 mL)", "15 mm (rosa)", "Adulto"],
  laranja:  ["preferir com cuff", "5,5–6,0 mm", "Reta ou curva nº 2", "80 mm", "nº 2,5", "10 Fr", "14–18 Fr", "12 Fr", "28–32 Fr", "18–20 G", "Criança ou adulto", "15 mm (rosa)", "Adulto"],
  verde:    ["preferir com cuff", "6,0–6,5 mm", "Reta ou curva nº 3", "80 mm", "nº 3", "10–12 Fr", "16–18 Fr", "12 Fr", "32–38 Fr", "16–20 G", "Adulto (1.600 mL)", "15 mm (rosa)", "Adulto"],
  adulto:   ["não usar", "7,0–8,0 mm", "Curva nº 3–4", "80–100 mm", "nº 3 (30–50 kg); nº 4 (50–70 kg); nº 5 (> 70 kg)", "12–14 Fr", "14–18 Fr", "14–16 Fr", "28–36 Fr", "14–18 G", "Adulto (1.600 mL)", "25 mm (azul); 45 mm (amarela) no úmero ou com tecido espesso", "Adulto"]
};

// Tuberculose: mg/kg até 10 anos; a partir daí, comprimido de dose fixa (linha E).
function tbLinha(k, max) {
  return function (p) {
    if (p.idade >= 10) return { kg: "em comprimido de dose fixa (RHZE)", dose: "ver a linha E", teto: "—" };
    var c = doseCalc({ k: k, per: "dia", n: 1, maxDia: max }, p);
    return { kg: faixaTxt(k[0], k[1]) + " mg/kg/dia, em 1 tomada", dose: doseTxt(c) + (c.cap ? " (teto)" : "") + ", 1 vez ao dia" + (p.peso >= 25 ? "; com 25 kg ou mais, conferir o quadro por faixa de peso" : ""), teto: num(max) + " mg/dia" };
  };
}

/* ---------- antibióticos por síndrome ----------
   linha = { l, n, d | comp:[{n,d}] | f, int, via, dur, renal, esp } */
var UI_MI = 1e6;
var SINDROMES = {
  sepse: { t: "Sepse e choque séptico comunitário (após o período neonatal)", nota: "Antibiótico na 1ª hora no choque e em até 3 h na sepse sem choque (SSC 2026). Colher hemocultura antes, sem atrasar. De 1 a 3 meses: cefotaxima + ampicilina.", linhas: [
    { l: "1ª", n: "Ceftriaxona", d: { k: 100, per: "dia", n: 2, max: 2000 }, int: "12/12 h", via: "EV", dur: "7–10 dias, conforme foco e cultura", renal: "Não", esp: "Pneumococo, meningococo, Haemophilus, enterobactérias" },
    { l: "2ª", n: "+ Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "Até a cultura", renal: "Sim; dosar nível", esp: "Associar no choque, na meningite, com foco em pele, osso ou cateter" },
    { l: "3ª", n: "+ Clindamicina", d: { k: 40, per: "dia", n: 3, max: 900 }, int: "8/8 h", via: "EV", dur: "Até estabilizar", renal: "Não", esp: "Choque tóxico e fasciíte: bloqueio de toxina" },
    { l: "4ª", n: "Cefepime", d: { k: 150, per: "dia", n: 3, max: 2000 }, int: "8/8 h", via: "EV", dur: "7–14 dias", renal: "Sim", esp: "Imunossuprimido, internação recente, Pseudomonas" },
    { l: "5ª", n: "Meropenem", d: { k: 60, per: "dia", n: 3, max: 1000 }, int: "8/8 h", via: "EV", dur: "7–14 dias", renal: "Sim", esp: "Risco de ESBL ou falha; 120 mg/kg/dia se sistema nervoso central" }
  ]},
  neo: { t: "Sepse neonatal", nota: "Doses para recém-nascido a termo. Intervalos mudam com a idade gestacional e pós-natal: conferir o protocolo da unidade neonatal.", linhas: [
    { l: "1ª", comp: [{ n: "Ampicilina", d: { k: [50, 100] } }, { n: "+ gentamicina", d: { k: [4, 5] } }], int: "Ampicilina 12/12 h (8/8 h após 7 dias); gentamicina 24/24 h", via: "EV", dur: "7–10 dias (14–21 na meningite)", renal: "Sim (gentamicina: nível)", esp: "Estreptococo do grupo B, E. coli, Listeria. Meningite: ampicilina 100 mg/kg/dose" },
    { l: "2ª", n: "Cefotaxima", d: { k: 50 }, int: "12/12 h (8/8 h após 7 dias)", via: "EV", dur: "14–21 dias na meningite", renal: "Sim", esp: "Substitui a gentamicina na meningite; evitar ceftriaxona no recém-nascido" },
    { l: "3ª", n: "Vancomicina", d: { k: 15 }, int: "8–12 h", via: "EV em 1 h", dur: "Conforme cultura", renal: "Sim; dosar nível", esp: "Sepse tardia hospitalar: estafilococo coagulase-negativo, MRSA" },
    { l: "4ª", n: "Meropenem", d: { k: [20, 40] }, int: "8/8 h (12/12 h se < 14 dias e < 32 semanas)", via: "EV", dur: "Conforme cultura", renal: "Sim", esp: "Gram-negativo resistente; 40 mg/kg/dose na meningite" },
    { l: "5ª", n: "Polimixina B", d: { k: [15000, 40000], per: "dia", n: 2, u: "UI" }, int: "12/12 h", via: "EV", dur: "Conforme cultura", renal: "Não (nefrotóxica)", esp: "Gram-negativo multirresistente, só com a comissão de infecção. Fora do período neonatal: 15.000–25.000 UI/kg/dia" }
  ]},
  pneu: { t: "Pneumonia comunitária", nota: "SBP 2022. Menores de 2 meses: internar e tratar com ampicilina ou penicilina cristalina + gentamicina 7,5 mg/kg/dia. Internar se SpO₂ < 92%, desconforto moderado a grave, recusa alimentar ou toxemia.", linhas: [
    { l: "1ª", n: "Amoxicilina", d: { k: 50, per: "dia", n: 3, maxDia: 4000 }, int: "8/8 h (ou 12/12 h)", via: "VO", dur: "7 dias (5 se não grave e com boa evolução)", renal: "Sim", esp: "Pneumococo. Ambulatorial, de 2 meses a 5 anos e também nos maiores" },
    { l: "2ª", comp: [{ n: "Ampicilina", d: { k: 50, max: 2000 } }, { n: "ou penicilina cristalina", d: { k: 150000, per: "dia", n: 4, u: "UI" } }], int: "6/6 h", via: "EV", dur: "7–10 dias; passar para via oral ao melhorar", renal: "Sim", esp: "Primeira escolha no internado" },
    { l: "3ª", n: "Ceftriaxona", d: { k: [50, 100], per: "dia", n: 1, max: 2000, maxDia: 4000 }, int: "24 h (ou 12/12 h)", via: "EV ou IM", dur: "7–10 dias", renal: "Não", esp: "Grave, vacinação incompleta, HIV, falha em 48–72 h" },
    { l: "4ª", n: "Azitromicina", d: { k: 10, per: "dia", n: 1, maxDia: 500 }, int: "24 h", via: "VO", dur: "5 dias", renal: "Não", esp: "Suspeita de Mycoplasma ou Chlamydophila: associar ou substituir. Claritromicina 15 mg/kg/dia ÷ 2 por 7–10 dias" },
    { l: "5ª", comp: [{ n: "Oxacilina", d: { k: 200, per: "dia", n: 4, max: 2000 } }, { n: "ou vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 } }], int: "6/6 h", via: "EV", dur: "14–21 dias na complicada", renal: "Vancomicina: sim", esp: "Suspeita de S. aureus: pneumatocele, empiema, evolução fulminante" }
  ]},
  mening: { t: "Meningite bacteriana", nota: "Dexametasona 0,15 mg/kg/dose 6/6 h por 2–4 dias (máx. 10 mg/dose), antes ou junto da 1ª dose de antibiótico, a partir de 6 semanas de vida. Notificação imediata e quimioprofilaxia dos contatos (rifampicina).", linhas: [
    { l: "1ª", n: "Ceftriaxona", d: { k: 100, per: "dia", n: 2, max: 2000 }, int: "12/12 h", via: "EV", dur: "Meningococo 5–7 dias; Haemophilus 7–10; pneumococo 10–14", renal: "Não", esp: "Acima de 3 meses" },
    { l: "2ª", n: "Cefotaxima", d: { k: [200, 300], per: "dia", n: 4, maxDia: 12000 }, int: "6/6 h", via: "EV", dur: "14–21 dias no lactente jovem", renal: "Sim", esp: "Até 3 meses, com ampicilina" },
    { l: "3ª", n: "Ampicilina", d: { k: [300, 400], per: "dia", n: 4, maxDia: 12000 }, int: "6/6 h", via: "EV", dur: "14–21 dias", renal: "Sim", esp: "Até 3 meses: Listeria e estreptococo do grupo B" },
    { l: "4ª", n: "+ Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "Até o antibiograma", renal: "Sim; dosar nível", esp: "Associar se houver risco de pneumococo resistente" },
    { l: "5ª", n: "Meropenem", d: { k: 120, per: "dia", n: 3, max: 2000 }, int: "8/8 h", via: "EV", dur: "10–21 dias", renal: "Sim", esp: "Gram-negativo resistente; alergia grave a cefalosporina" }
  ]},
  pielo: { t: "Infecção urinária febril (pielonefrite)", nota: "Colher urina por sondagem ou jato médio antes do antibiótico. Tratamento total de 7–10 dias; via oral desde o início se a criança tem mais de 2–3 meses, está bem e aceita.", linhas: [
    { l: "1ª", n: "Ceftriaxona", d: { k: [50, 75], per: "dia", n: 1, max: 2000 }, int: "24 h", via: "EV ou IM", dur: "Até 24–48 h afebril; completar 7–10 dias por via oral", renal: "Não", esp: "Enterobactérias" },
    { l: "2ª", comp: [{ n: "Cefalexina", d: { k: [50, 100], per: "dia", n: 4, max: 1000 } }, { n: "ou cefuroxima axetil", d: { k: [20, 30], per: "dia", n: 2, max: 500 } }], int: "Cefalexina 6/6 h; cefuroxima 12/12 h", via: "VO", dur: "7–10 dias", renal: "Sim", esp: "Via oral, conforme a sensibilidade local" },
    { l: "3ª", comp: [{ n: "Gentamicina", d: { k: [5, 7.5], per: "dia", n: 1 } }, { n: "ou amicacina", d: { k: 15, per: "dia", n: 1, maxDia: 1500 } }], int: "24 h", via: "EV ou IM", dur: "Até a troca por via oral", renal: "Sim; dosar nível", esp: "Alergia a betalactâmico ou resistência; nefrotóxicas" },
    { l: "4ª", n: "Ciprofloxacino", d: { k: [20, 30], per: "dia", n: 2, max: 750 }, int: "12/12 h", via: "VO (EV: máx. 400 mg/dose)", dur: "7–10 dias", renal: "Sim", esp: "Pseudomonas ou resistência documentada; uso restrito em menores de 18 anos" },
    { l: "5ª", n: "Meropenem", d: { k: 60, per: "dia", n: 3, max: 1000 }, int: "8/8 h", via: "EV", dur: "7–10 dias", renal: "Sim", esp: "Enterobactéria produtora de ESBL" }
  ]},
  celul: { t: "Celulite e infecção de pele e partes moles", nota: "Abscesso: drenar. Celulite periorbitária, mordedura e sinais sistêmicos pedem cobertura ampliada ou internação.", linhas: [
    { l: "1ª", n: "Cefalexina", d: { k: [50, 100], per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "VO", dur: "5–7 dias (até 10)", renal: "Sim", esp: "Estreptococo e S. aureus sensível" },
    { l: "2ª", n: "Clindamicina", d: { k: [20, 40], per: "dia", n: 3, max: 900 }, int: "8/8 h", via: "VO (máx. 600 mg/dose) ou EV", dur: "5–10 dias", renal: "Não", esp: "Alergia à penicilina; suspeita de S. aureus resistente comunitário" },
    { l: "3ª", comp: [{ n: "Oxacilina", d: { k: [100, 200], per: "dia", n: 4, max: 2000 } }, { n: "ou cefazolina", d: { k: [50, 100], per: "dia", n: 3, max: 2000 } }], int: "Oxacilina 6/6 h; cefazolina 8/8 h", via: "EV", dur: "Até melhorar; completar por via oral", renal: "Cefazolina: sim", esp: "Internado, sem fator de risco para resistência" },
    { l: "4ª", n: "Vancomicina", d: { k: [40, 60], per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "7–10 dias", renal: "Sim; dosar nível", esp: "Grave com suspeita de MRSA" },
    { l: "5ª", n: "Linezolida", d: { k: 10, max: 600 }, int: "8/8 h (≥ 12 anos: 600 mg 12/12 h)", via: "VO ou EV", dur: "7–10 dias", renal: "Não", esp: "MRSA com intolerância à vancomicina. Sulfametoxazol-trimetoprima 8–12 mg/kg/dia é opção oral" }
  ]},
  osteo: { t: "Osteomielite aguda", nota: "Colher hemocultura e, se possível, material ósseo. Passar para via oral após melhora clínica e queda da proteína C reativa; total de 3–4 semanas no caso não complicado.", linhas: [
    { l: "1ª", n: "Oxacilina", d: { k: [150, 200], per: "dia", n: 4, max: 2000 }, int: "6/6 h", via: "EV", dur: "3–4 semanas (4–6 se complicada)", renal: "Não", esp: "S. aureus sensível" },
    { l: "2ª", n: "Cefazolina", d: { k: [100, 150], per: "dia", n: 3, max: 2000 }, int: "8/8 h", via: "EV", dur: "3–4 semanas", renal: "Sim", esp: "S. aureus sensível e Kingella kingae (menores de 4 anos)" },
    { l: "3ª", n: "Clindamicina", d: { k: [30, 40], per: "dia", n: 3, max: 900 }, int: "8/8 h", via: "EV ou VO", dur: "3–4 semanas", renal: "Não", esp: "Suspeita de S. aureus resistente comunitário, sem gravidade" },
    { l: "4ª", n: "Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "4–6 semanas", renal: "Sim; dosar nível", esp: "MRSA ou sepse associada" },
    { l: "5ª", n: "Daptomicina", f: function (p) {
        if (p.idade < 1) return { kg: "não usar abaixo de 1 ano", dose: "—", teto: "—" };
        var k = p.idade < 7 ? 12 : (p.idade < 12 ? 9 : (p.idade < 18 ? 7 : 8));
        return { kg: k + " mg/kg/dia (1–6 anos 12; 7–11 anos 9; 12–17 anos 7; adulto 6–10)", dose: num(k * p.peso) + " mg, 1 vez ao dia", teto: "—" };
      }, int: "24 h", via: "EV", dur: "4–6 semanas", renal: "Sim", esp: "MRSA com falha ou intolerância; não usar em pneumonia" }
  ]},
  artri: { t: "Artrite séptica", nota: "Urgência ortopédica: drenagem e lavagem articular. Total de 2–3 semanas (mínimo de 10–14 dias se a evolução for boa).", linhas: [
    { l: "1ª", n: "Oxacilina", d: { k: [150, 200], per: "dia", n: 4, max: 2000 }, int: "6/6 h", via: "EV", dur: "2–3 semanas no total", renal: "Não", esp: "S. aureus sensível. Menores de 4 anos: preferir cefazolina (Kingella)" },
    { l: "2ª", n: "Ceftriaxona", d: { k: [50, 100], per: "dia", n: 1, max: 2000, maxDia: 4000 }, int: "24 h", via: "EV", dur: "2–3 semanas", renal: "Não", esp: "Não vacinado para Haemophilus, gonococo no adolescente, Salmonella na doença falciforme" },
    { l: "3ª", n: "Clindamicina", d: { k: [30, 40], per: "dia", n: 3, max: 900 }, int: "8/8 h", via: "EV ou VO", dur: "2–3 semanas", renal: "Não", esp: "Suspeita de S. aureus resistente comunitário (não cobre Kingella)" },
    { l: "4ª", n: "Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "3–4 semanas", renal: "Sim; dosar nível", esp: "MRSA ou sepse" },
    { l: "5ª", n: "Linezolida", d: { k: 10, max: 600 }, int: "8/8 h (≥ 12 anos: 600 mg 12/12 h)", via: "VO ou EV", dur: "2–3 semanas", renal: "Não", esp: "MRSA com intolerância à vancomicina" }
  ]},
  endo: { t: "Endocardite infecciosa", nota: "Três hemoculturas antes do antibiótico se o paciente estiver estável. Esquema definitivo guiado por cultura, com cardiologia e infectologia.", linhas: [
    { l: "1ª", n: "Penicilina G cristalina", d: { k: [200000, 300000], per: "dia", n: 6, u: "UI", maxDia: 24 * UI_MI }, int: "4/4 h", via: "EV", dur: "4 semanas", renal: "Sim", esp: "Estreptococo do grupo viridans sensível" },
    { l: "2ª", n: "Ceftriaxona", d: { k: 100, per: "dia", n: 1, maxDia: 4000 }, int: "24 h", via: "EV", dur: "4 semanas", renal: "Não", esp: "Estreptococo sensível; grupo HACEK" },
    { l: "3ª", n: "Oxacilina", d: { k: 200, per: "dia", n: 6, maxDia: 12000 }, int: "4/4 h", via: "EV", dur: "4–6 semanas", renal: "Não", esp: "S. aureus sensível em valva nativa" },
    { l: "4ª", n: "Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "6 semanas", renal: "Sim; dosar nível", esp: "MRSA, alergia grave, prótese (esquema combinado)" },
    { l: "5ª", n: "Gentamicina", d: { k: 3, per: "dia", n: 3, maxDia: 240 }, int: "8/8 h", via: "EV", dur: "2 semanas", renal: "Sim; dosar nível", esp: "Sinergismo em enterococo e em prótese" }
  ]},
  abdome: { t: "Infecção intra-abdominal (abdome agudo inflamatório)", nota: "Controle cirúrgico do foco é o tratamento principal. Após controle adequado, 4–7 dias de antibiótico.", linhas: [
    { l: "1ª", comp: [{ n: "Ceftriaxona", d: { k: [50, 75], per: "dia", n: 1, max: 2000 } }, { n: "+ metronidazol", d: { k: 30, per: "dia", n: 3, max: 500 } }], int: "Ceftriaxona 24 h; metronidazol 8/8 h", via: "EV", dur: "4–7 dias após o controle do foco", renal: "Não", esp: "Comunitária: Gram-negativos e anaeróbios" },
    { l: "2ª", comp: [{ n: "Ampicilina", d: { k: 200, per: "dia", n: 4, max: 2000 } }, { n: "+ gentamicina", d: { k: [5, 7.5], per: "dia", n: 1 } }, { n: "+ metronidazol", d: { k: 30, per: "dia", n: 3, max: 500 } }], int: "6/6 h; 24 h; 8/8 h", via: "EV", dur: "4–7 dias", renal: "Gentamicina: sim", esp: "Esquema tríplice clássico; cobre enterococo" },
    { l: "3ª", n: "Piperacilina + tazobactam", d: { k: 300, per: "dia", n: 4, max: 4000 }, int: "6/6 h", via: "EV", dur: "4–7 dias", renal: "Sim", esp: "Complicada ou hospitalar; dose em piperacilina" },
    { l: "4ª", comp: [{ n: "Cefepime", d: { k: 150, per: "dia", n: 3, max: 2000 } }, { n: "+ metronidazol", d: { k: 30, per: "dia", n: 3, max: 500 } }], int: "8/8 h", via: "EV", dur: "4–7 dias", renal: "Cefepime: sim", esp: "Risco de Pseudomonas" },
    { l: "5ª", n: "Meropenem", d: { k: 60, per: "dia", n: 3, max: 1000 }, int: "8/8 h", via: "EV", dur: "4–7 dias", renal: "Sim", esp: "Multirresistente ou sepse grave. Ertapenem: 15 mg/kg 12/12 h de 3 meses a 12 anos (máx. 1 g/dia)" }
  ]},
  neut: { t: "Neutropenia febril", nota: "Emergência: antibiótico na 1ª hora, após hemoculturas (periférica e de cada via do cateter).", linhas: [
    { l: "1ª", n: "Cefepime", d: { k: 150, per: "dia", n: 3, max: 2000 }, int: "8/8 h", via: "EV", dur: "Até 48 h afebril e recuperação medular", renal: "Sim", esp: "Gram-negativos, incluindo Pseudomonas" },
    { l: "2ª", n: "Piperacilina + tazobactam", d: { k: [300, 400], per: "dia", n: 4, max: 4000 }, int: "6/6 h", via: "EV", dur: "Idem", renal: "Sim", esp: "Alternativa de 1ª linha; dose em piperacilina" },
    { l: "3ª", n: "Meropenem", d: { k: 60, per: "dia", n: 3, max: 1000 }, int: "8/8 h", via: "EV", dur: "Idem", renal: "Sim", esp: "Instável ou colonizado por ESBL" },
    { l: "4ª", n: "+ Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "Suspender em 48–72 h se culturas negativas", renal: "Sim; dosar nível", esp: "Só se instável, infecção de cateter ou pele, mucosite grave, MRSA" },
    { l: "5ª", n: "Anfotericina B lipossomal", d: { k: [3, 5], per: "dia", n: 1 }, int: "24 h", via: "EV em 2 h", dur: "Conforme investigação", renal: "Não (nefrotóxica)", esp: "Febre persistente por 96 h ou mais em alto risco; alternativa: equinocandina" }
  ]},
  icorrente: { t: "Infecção de corrente sanguínea relacionada a cateter", nota: "Colher hemoculturas pareadas e decidir sobre a retirada do cateter (obrigatória em S. aureus, Candida, Pseudomonas e sepse).", linhas: [
    { l: "1ª", n: "Vancomicina", d: { k: 60, per: "dia", n: 4, max: 1000 }, int: "6/6 h", via: "EV em 1 h", dur: "7–14 dias conforme o agente", renal: "Sim; dosar nível", esp: "Empírico para Gram-positivos" },
    { l: "2ª", comp: [{ n: "Oxacilina", d: { k: 200, per: "dia", n: 4, max: 2000 } }, { n: "ou cefazolina", d: { k: 100, per: "dia", n: 3, max: 2000 } }], int: "6/6 h; 8/8 h", via: "EV", dur: "14 dias no S. aureus não complicado", renal: "Cefazolina: sim", esp: "Descalonar se o S. aureus for sensível" },
    { l: "3ª", n: "+ Cefepime", d: { k: 150, per: "dia", n: 3, max: 2000 }, int: "8/8 h", via: "EV", dur: "7–14 dias", renal: "Sim", esp: "Cobrir Gram-negativos no grave, neutropênico ou com cateter femoral" },
    { l: "4ª", n: "Meropenem", d: { k: 60, per: "dia", n: 3, max: 1000 }, int: "8/8 h", via: "EV", dur: "7–14 dias", renal: "Sim", esp: "Gram-negativo resistente" },
    { l: "5ª", n: "Micafungina", d: { k: [2, 4], per: "dia", n: 1, maxDia: 100 }, int: "24 h", via: "EV em 1 h", dur: "14 dias após a 1ª hemocultura negativa", renal: "Não", esp: "Candidemia; recém-nascido 4–10 mg/kg/dia" }
  ]},
  faringo: { t: "Faringoamigdalite estreptocócica", nota: "Tratar com teste rápido ou cultura positivos, ou quadro típico acima de 3 anos. Objetivo principal: prevenir febre reumática.", linhas: [
    { l: "1ª", n: "Penicilina G benzatina", f: function (p) {
        return p.peso < 20 ? { kg: "< 20 kg: 600.000 UI", dose: "600 000 UI", teto: "1.200.000 UI" } : { kg: "≥ 20 kg: 1.200.000 UI", dose: "1 200 000 UI", teto: "1.200.000 UI" };
      }, int: "Dose única", via: "IM profundo", dur: "1 dose", renal: "Não", esp: "Garante adesão" },
    { l: "2ª", n: "Amoxicilina", d: { k: 50, per: "dia", n: 2, maxDia: 1000 }, int: "12/12 h (ou 1 vez ao dia)", via: "VO", dur: "10 dias", renal: "Sim", esp: "Estreptococo do grupo A" },
    { l: "3ª", n: "Cefalexina", d: { k: [40, 50], per: "dia", n: 2, max: 500 }, int: "12/12 h", via: "VO", dur: "10 dias", renal: "Sim", esp: "Alergia não anafilática à penicilina" },
    { l: "4ª", n: "Azitromicina", d: { k: 12, per: "dia", n: 1, maxDia: 500 }, int: "24 h", via: "VO", dur: "5 dias", renal: "Não", esp: "Alergia grave à penicilina" },
    { l: "5ª", n: "Clindamicina", d: { k: 20, per: "dia", n: 3, max: 300 }, int: "8/8 h", via: "VO", dur: "10 dias", renal: "Não", esp: "Alergia grave; recorrência" }
  ]},
  oma: { t: "Otite média aguda e rinossinusite bacteriana", nota: "Otite: analgesia sempre; observar 48–72 h é opção acima de 2 anos, unilateral e sem gravidade. Duração: menores de 2 anos 10 dias; 2–5 anos 7 dias; maiores 5–7 dias. Sinusite: 10–14 dias.", linhas: [
    { l: "1ª", n: "Amoxicilina", d: { k: 50, per: "dia", n: 3, max: 500 }, int: "8/8 h (ou 12/12 h)", via: "VO", dur: "Conforme idade e foco", renal: "Sim", esp: "Sem fator de risco para pneumococo resistente" },
    { l: "2ª", n: "Amoxicilina em dose alta", d: { k: [80, 90], per: "dia", n: 2, maxDia: 4000 }, int: "12/12 h", via: "VO", dur: "Idem", renal: "Sim", esp: "Menor de 2 anos, creche, antibiótico nos últimos 30 dias" },
    { l: "3ª", n: "Amoxicilina + clavulanato", d: { k: [50, 90], per: "dia", n: 2, maxDia: 4000 }, int: "12/12 h", via: "VO", dur: "Idem", renal: "Sim", esp: "Falha em 48–72 h, conjuntivite associada. 90 mg/kg/dia só com a formulação ES (600 + 42,9)" },
    { l: "4ª", n: "Ceftriaxona", d: { k: 50, per: "dia", n: 1, maxDia: 1000 }, int: "24 h", via: "IM ou EV", dur: "1–3 doses", renal: "Não", esp: "Vômitos, falha ou sem via oral" },
    { l: "5ª", comp: [{ n: "Cefuroxima axetil", d: { k: 30, per: "dia", n: 2, max: 500 } }, { n: "ou claritromicina", d: { k: 15, per: "dia", n: 2, max: 500 } }], int: "12/12 h", via: "VO", dur: "Idem", renal: "Sim", esp: "Alergia à penicilina: não grave (cefuroxima) ou grave (macrolídeo)" }
  ]},
  tb: { t: "Tuberculose (esquema básico do Ministério da Saúde)", nota: "Menores de 10 anos: 2 meses de RHZ + 4 meses de RH, em tomada única diária. Forma meningoencefálica ou osteoarticular: 2 RHZ + 10 RH, com corticoide. A partir de 10 anos: RHZE em comprimido de dose fixa. Notificar e tratar na atenção básica ou referência.", linhas: [
    { l: "R", n: "Rifampicina", f: tbLinha([10, 20], 600), int: "24 h", via: "VO em jejum", dur: "6 meses", renal: "Não", esp: "Abaixo de 25 kg, por mg/kg; acima, pelo quadro de faixas de peso do Manual" },
    { l: "H", n: "Isoniazida", f: tbLinha([7, 15], 300), int: "24 h", via: "VO", dur: "6 meses", renal: "Não", esp: "Piridoxina 5–10 mg/dia se desnutrição ou HIV" },
    { l: "Z", n: "Pirazinamida", f: tbLinha([30, 40], 2000), int: "24 h", via: "VO", dur: "2 meses", renal: "Sim", esp: "Hepatotoxicidade: orientar sinais de alarme" },
    { l: "E", n: "Etambutol", f: function (p) {
        if (p.idade < 10) return { kg: "15–25 mg/kg/dia, só em situações especiais", dose: faixaTxt(15 * p.peso, Math.min(25 * p.peso, 1200)) + " mg, 1 vez ao dia", teto: "1200 mg/dia" };
        var c = p.peso < 20 ? null : (p.peso <= 35 ? 2 : (p.peso <= 50 ? 3 : (p.peso <= 70 ? 4 : 5)));
        return { kg: "RHZE 150/75/400/275 mg por faixa de peso", dose: c ? c + " comprimidos de RHZE ao dia, por 2 meses; depois RH por 4 meses" : "abaixo de 20 kg: doses individualizadas", teto: "5 comprimidos/dia" };
      }, int: "24 h", via: "VO", dur: "2 meses", renal: "Sim", esp: "A partir de 10 anos: 20–35 kg 2; 36–50 kg 3; 51–70 kg 4; > 70 kg 5 comprimidos" },
    { l: "Resistente", n: "Levofloxacino", d: { k: [15, 20], per: "dia", n: 1, maxDia: 1000 }, int: "24 h", via: "VO", dur: "Conforme referência terciária", renal: "Sim", esp: "Somente em esquema de tuberculose resistente, com especialista" }
  ]},
  fungo: { t: "Infecção fúngica invasiva", nota: "Candidemia: retirar cateter, fundoscopia, hemoculturas diárias até negativar. Tratar por 14 dias após a 1ª cultura negativa.", linhas: [
    { l: "1ª", n: "Micafungina", d: { k: [2, 4], per: "dia", n: 1, maxDia: 100 }, int: "24 h", via: "EV em 1 h", dur: "14 dias após negativar", renal: "Não", esp: "Candidemia no instável ou neutropênico (equinocandina)" },
    { l: "2ª", n: "Fluconazol", d: { k: [6, 12], per: "dia", n: 1, maxDia: 800 }, int: "24 h", via: "EV ou VO", dur: "14 dias após negativar", renal: "Sim", esp: "Candida sensível, paciente estável; ataque de 12 mg/kg" },
    { l: "3ª", n: "Anfotericina B lipossomal", d: { k: [3, 5], per: "dia", n: 1 }, int: "24 h", via: "EV em 2 h", dur: "Conforme o agente", renal: "Não (nefrotóxica)", esp: "Amplo espectro; mucormicose, criptococose" },
    { l: "4ª", n: "Voriconazol", f: function (p) {
        if (p.idade < 2) return { kg: "não estabelecido abaixo de 2 anos", dose: "—", teto: "—" };
        if (p.idade < 12 || (p.idade < 15 && p.peso < 50)) return { kg: "ataque 9 mg/kg/dose (2 doses); depois 8 mg/kg/dose", dose: "ataque " + num(9 * p.peso) + " mg; manutenção " + num(8 * p.peso) + " mg por dose", teto: "350 mg/dose por via oral" };
        return { kg: "ataque 6 mg/kg/dose (2 doses); depois 4 mg/kg/dose", dose: "ataque " + num(6 * p.peso) + " mg; manutenção " + num(4 * p.peso) + " mg por dose", teto: "—" };
      }, int: "12/12 h", via: "EV (VO após melhora)", dur: "6–12 semanas", renal: "EV: evitar se depuração < 50 mL/min", esp: "Aspergilose invasiva; dosar nível sérico" },
    { l: "5ª", n: "Caspofungina", f: function (p) {
        if (p.idade >= 18) return { kg: "adulto: ataque 70 mg; depois 50 mg/dia", dose: "ataque 70 mg; manutenção " + (p.peso > 80 ? 70 : 50) + " mg/dia", teto: "70 mg/dia" };
        var sc = superficie(p.peso);
        return { kg: "ataque 70 mg/m²; depois 50 mg/m²/dia", dose: "ataque " + num(Math.min(70 * sc, 70)) + " mg; manutenção " + num(Math.min(50 * sc, 70)) + " mg/dia (superfície " + nf(sc, 2) + " m²)", teto: "70 mg/dia" };
      }, int: "24 h", via: "EV em 1 h", dur: "14 dias após negativar", renal: "Não", esp: "Candidemia; resgate em aspergilose" }
  ]},
  viru: { t: "Infecções virais com tratamento específico", nota: "Influenza: tratar síndrome gripal com fator de risco (menores de 5 anos, sobretudo de 2) e toda síndrome respiratória aguda grave, sem esperar exame.", linhas: [
    { l: "1ª", n: "Oseltamivir", f: function (p) {
        var mg, kg;
        if (p.idade < 1) { var k = p.idade * 12 < 9 ? 3 : 3.5; mg = k * p.peso; kg = num(k) + " mg/kg/dose"; }
        else { mg = p.peso <= 15 ? 30 : (p.peso <= 23 ? 45 : (p.peso <= 40 ? 60 : 75)); kg = "por faixa de peso"; }
        return { kg: kg, dose: num(mg) + " mg por dose", teto: "75 mg/dose" };
      }, int: "12/12 h", via: "VO", dur: "5 dias (10 no grave ou imunossuprimido)", renal: "Sim", esp: "Influenza A e B (MS 2023)" },
    { l: "2ª", n: "Aciclovir", d: { k: [10, 15] }, int: "8/8 h", via: "EV em 1 h", dur: "Encefalite 14–21 dias; varicela grave 7–10", renal: "Sim", esp: "Encefalite herpética (iniciar na suspeita), varicela grave ou em imunossuprimido" },
    { l: "3ª", n: "Aciclovir no recém-nascido", d: { k: 20 }, int: "8/8 h", via: "EV em 1 h", dur: "14 dias (21 se sistema nervoso central ou disseminada)", renal: "Sim", esp: "Herpes neonatal" },
    { l: "4ª", n: "Ganciclovir", d: { k: 5 }, int: "12/12 h", via: "EV em 1 h", dur: "Indução 14–21 dias", renal: "Sim", esp: "Citomegalovírus em imunossuprimido; mielotóxico" },
    { l: "5ª", n: "Aciclovir oral", d: { k: 20, max: 800 }, int: "6/6 h", via: "VO", dur: "5 dias", renal: "Sim", esp: "Varicela com indicação: acima de 12 anos, doença cutânea ou pulmonar crônica, uso de corticoide, 2º caso no domicílio" }
  ]}
};
var SIND_ORDEM = ["sepse", "neo", "pneu", "mening", "pielo", "celul", "osteo", "artri", "endo", "abdome", "neut", "icorrente", "faringo", "oma", "tb", "fungo", "viru"];

/* ---------- diagnóstico sindrômico ---------- */
var SINAIS = [
  { id: "febre", l: "Febre" }, { id: "dispneia", l: "Dispneia ou esforço respiratório" }, { id: "tosse", l: "Tosse" },
  { id: "sibilo", l: "Sibilância" }, { id: "estridor", l: "Estridor ou tosse ladrante" }, { id: "dorToracica", l: "Dor torácica" },
  { id: "cefaleia", l: "Cefaleia" }, { id: "rigidez", l: "Rigidez de nuca" }, { id: "convulsao", l: "Convulsão" },
  { id: "alteracaoCons", l: "Alteração de consciência" }, { id: "vomito", l: "Vômito" }, { id: "diarreia", l: "Diarreia" },
  { id: "dorAbdominal", l: "Dor abdominal" }, { id: "disuria", l: "Disúria ou urina com odor forte" }, { id: "poliuria", l: "Poliúria e sede intensa" },
  { id: "artralgia", l: "Dor articular ou recusa em apoiar o membro" }, { id: "mialgia", l: "Mialgia ou dor retro-orbitária" },
  { id: "rash", l: "Exantema ou petéquias" }, { id: "urticaria", l: "Urticária ou edema de lábios e face" },
  { id: "sangramento", l: "Sangramento" }, { id: "exposicao", l: "Exposição a tóxico ou medicamento" }
];
var HIPOTESES = [
  { sind: "Pneumonia", sis: "respiratório", sinais: ["febre", "tosse", "dispneia"], etio: "Pneumococo, vírus respiratórios, Mycoplasma (acima de 5 anos)", conf: "Taquipneia, crepitações, opacidade alveolar na radiografia", afasta: "Frequência respiratória normal, ausculta e radiografia limpas", exame: "Radiografia de tórax e oximetria; hemograma e proteína C reativa se for internar", prox: "Amoxicilina 50 mg/kg/dia por 7 dias; oxigênio se SpO₂ < 92%; internar conforme critérios" },
  { sind: "Bronquiolite ou crise de sibilância", sis: "respiratório", sinais: ["sibilo", "tosse", "dispneia"], etio: "Vírus sincicial respiratório e outros vírus (lactente); asma (maiores)", conf: "Primeiro episódio de sibilância em menor de 2 anos com pródromo viral; ou história de crises", afasta: "Febre alta persistente com toxemia; estridor", exame: "Diagnóstico clínico; oximetria. Radiografia só se grave ou atípico", prox: "Bronquiolite: suporte, oxigênio, hidratação, alto fluxo se grave. Asma: salbutamol, ipratrópio e corticoide" },
  { sind: "Crupe (laringotraqueíte viral)", sis: "respiratório", sinais: ["estridor", "tosse", "febre"], etio: "Parainfluenza e outros vírus", conf: "Tosse ladrante, rouquidão, estridor inspiratório, de 6 meses a 5 anos", afasta: "Sialorreia, postura em tripé e toxemia (epiglotite, traqueíte); início súbito sem pródromo (corpo estranho)", exame: "Diagnóstico clínico; escore de Westley", prox: "Dexametasona 0,15–0,6 mg/kg em dose única; adrenalina nebulizada se estridor em repouso" },
  { sind: "Anafilaxia", sis: "sistêmico", sinais: ["urticaria", "dispneia", "sibilo", "vomito", "estridor"], etio: "Alimentos, medicamentos, insetos, látex", conf: "Início súbito de sintomas de pele ou mucosa com comprometimento respiratório, circulatório ou gastrointestinal", afasta: "Urticária isolada sem outros sistemas", exame: "Diagnóstico clínico; não atrasar o tratamento", prox: "Adrenalina IM 0,01 mg/kg na coxa, imediatamente; observar 4–6 h" },
  { sind: "Sepse", sis: "sistêmico", sinais: ["febre", "alteracaoCons", "dispneia", "rash"], etio: "Bactérias gram-positivas e gram-negativas; foco pulmonar, urinário, abdominal ou de pele", conf: "Taquicardia e perfusão alterada, lactato elevado, hipotensão, disfunção de órgão (Phoenix ≥ 2)", afasta: "Perfusão e sensório normais com lactato normal", exame: "Lactato, hemocultura, gasometria, hemograma, coagulograma, urina", prox: "Antibiótico na 1ª hora no choque; fluido em alíquotas de 10–20 mL/kg; vasoativo se refratário" },
  { sind: "Meningite ou encefalite", sis: "neurológico", sinais: ["febre", "cefaleia", "rigidez", "alteracaoCons", "convulsao", "vomito"], etio: "Pneumococo, meningococo, Haemophilus; enterovírus e herpes simples", conf: "Rigidez de nuca, fontanela abaulada, líquor com pleocitose", afasta: "Exame neurológico normal e líquor normal", exame: "Punção lombar (após imagem se houver sinal focal ou coma), hemocultura, glicemia", prox: "Ceftriaxona imediata, sem esperar o líquor; dexametasona; aciclovir se encefalite" },
  { sind: "Convulsão febril ou crise epiléptica", sis: "neurológico", sinais: ["convulsao", "febre"], etio: "Febre por infecção viral (6 meses a 5 anos); epilepsia; distúrbio metabólico", conf: "Crise generalizada breve com retorno ao estado basal", afasta: "Déficit focal, crise > 15 min ou repetida em 24 h, sonolência persistente", exame: "Glicemia capilar; sódio e cálcio se houver motivo; líquor se sinais meníngeos ou menor de 12 meses sem vacina", prox: "Benzodiazepínico se a crise passar de 5 min; investigar o foco da febre" },
  { sind: "Gastroenterite aguda", sis: "gastrointestinal", sinais: ["vomito", "diarreia", "dorAbdominal", "febre"], etio: "Rotavírus, norovírus, bactérias", conf: "Diarreia aquosa, com ou sem sinais de desidratação", afasta: "Dor localizada com defesa, vômito bilioso, sangue vivo nas fezes com toxemia", exame: "Nenhum de rotina; eletrólitos e função renal se houver desidratação grave", prox: "Planos A, B ou C do Ministério da Saúde; ondansetrona se os vômitos impedem a via oral; zinco" },
  { sind: "Apendicite aguda", sis: "gastrointestinal", sinais: ["dorAbdominal", "vomito", "febre"], etio: "Obstrução da luz apendicular", conf: "Dor que migra para a fossa ilíaca direita, descompressão dolorosa, dor ao pular", afasta: "Abdome flácido e indolor em exames seriados", exame: "Hemograma, proteína C reativa, ultrassom de abdome; escore pediátrico de apendicite", prox: "Jejum, hidratação, analgesia e avaliação cirúrgica" },
  { sind: "Cetoacidose diabética", sis: "metabólico", sinais: ["poliuria", "vomito", "dorAbdominal", "dispneia", "alteracaoCons"], etio: "Diabetes tipo 1 em abertura ou omissão de insulina", conf: "Glicemia > 200 mg/dL, pH < 7,30 ou bicarbonato < 18 mmol/L, cetonemia ou cetonúria", afasta: "Glicemia e gasometria normais", exame: "Glicemia, gasometria venosa, cetonas, eletrólitos, função renal", prox: "Expansão de 10 mL/kg, depois hidratação em 24–48 h; insulina 0,05–0,1 U/kg/h após 1 h; potássio" },
  { sind: "Infecção urinária febril", sis: "urinário", sinais: ["febre", "disuria", "dorAbdominal", "vomito"], etio: "E. coli e outras enterobactérias", conf: "Leucocitúria e nitrito positivo; urocultura positiva", afasta: "Exame de urina normal", exame: "Urina tipo 1 e urocultura por sondagem ou jato médio", prox: "Cefalosporina por via oral ou ceftriaxona, por 7–10 dias" },
  { sind: "Artrite séptica ou osteomielite", sis: "osteoarticular", sinais: ["artralgia", "febre"], etio: "S. aureus; Kingella kingae em menores de 4 anos", conf: "Recusa em apoiar, febre > 38,5 °C, VHS > 40 mm/h, leucócitos > 12.000 (critérios de Kocher)", afasta: "Sem febre, marcadores normais e apoio preservado (sinovite transitória)", exame: "Hemograma, proteína C reativa, VHS, hemocultura, ultrassom, punção articular", prox: "Avaliação ortopédica urgente; drenagem e oxacilina" },
  { sind: "Dengue", sis: "infeccioso", sinais: ["febre", "mialgia", "cefaleia", "rash", "vomito", "dorAbdominal", "sangramento"], etio: "Vírus da dengue (considerar chikungunya e zika)", conf: "Febre de 2–7 dias com mialgia, cefaleia, dor retro-orbitária, exantema; prova do laço positiva", afasta: "Foco bacteriano evidente", exame: "Hemograma (hematócrito e plaquetas); NS1 até o 5º dia ou sorologia depois", prox: "Classificar em A, B, C ou D; hidratar conforme o grupo; não usar anti-inflamatório nem AAS. Sinais de alarme: internar" },
  { sind: "Doença meningocócica ou exantema febril", sis: "infeccioso", sinais: ["rash", "febre", "sangramento", "alteracaoCons"], etio: "Meningococo; viroses exantemáticas; escarlatina; doença de Kawasaki", conf: "Petéquias ou púrpura que não desaparecem à pressão, com febre e toxemia", afasta: "Exantema que desaparece à pressão em criança em bom estado", exame: "Hemograma, coagulograma, hemocultura, lactato", prox: "Petéquias com febre e mau estado: ceftriaxona imediata e medidas de choque" },
  { sind: "Sangramento ou anemia aguda", sis: "hematológico", sinais: ["sangramento", "dispneia"], etio: "Perda aguda, hemólise, plaquetopenia imune, coagulopatia", conf: "Palidez, taquicardia, hemoglobina e plaquetas baixas", afasta: "Hemograma e coagulograma normais", exame: "Hemograma, reticulócitos, coagulograma, tipagem sanguínea", prox: "Controlar o sangramento; transfundir conforme a clínica" },
  { sind: "Síndrome coronariana aguda", sis: "cardiovascular", sinais: ["dorToracica", "dispneia"], etio: "Aterosclerose no adulto; na criança, pensar em miocardite, pericardite e Kawasaki", conf: "Alteração do segmento ST; troponina elevada", afasta: "ECG e troponina seriados normais", exame: "ECG em até 10 min, troponina seriada", prox: "Protocolo de dor torácica; reperfusão conforme indicação no adulto" },
  { sind: "Insuficiência cardíaca descompensada ou miocardite", sis: "cardiovascular", sinais: ["dispneia", "dorToracica", "vomito"], etio: "Miocardite viral, cardiopatia congênita, arritmia, valvopatia", conf: "Hepatomegalia, ritmo de galope, crepitações, cardiomegalia, linhas B", afasta: "Ecocardiograma normal", exame: "ECG, radiografia, ecocardiograma, troponina, BNP", prox: "Oxigênio, diurético, inotrópico se choque; evitar volume em excesso" },
  { sind: "Intoxicação exógena", sis: "toxicológico", sinais: ["exposicao", "alteracaoCons", "vomito", "convulsao"], etio: "Medicamentos, produtos de limpeza, pesticidas, plantas, animais peçonhentos", conf: "História de exposição e síndrome tóxica compatível", afasta: "Sem exposição e sem quadro compatível", exame: "Glicemia, gasometria, eletrólitos, ECG; níveis séricos conforme o agente", prox: "Suporte, descontaminação se indicada, antídoto; ligar para o CIATox (0800 722 6001)" }
];

/* ---------- análise de texto de laudo (aba Imagens) ---------- */
var ACHADOS = [
  [/opacidade|consolida|condensa|broncograma/, "Consolidação: pneumonia (broncograma aéreo), atelectasia ou contusão conforme o contexto"],
  [/derrame|seio costofr[eê]nico (obliterado|velado)|menisco/, "Derrame pleural: quantificar; ultrassom e toracocentese se volumoso ou febril"],
  [/pneumot[óo]rax|sem deslizamento|aus[êe]ncia de deslizamento|linha pleural/, "Pneumotórax: se houver instabilidade, descomprimir sem esperar exame"],
  [/hiperinsufla|retifica[çc][ãa]o (do )?diafragma|aprisionamento/, "Hiperinsuflação: bronquiolite, asma ou corpo estranho (se unilateral)"],
  [/infiltrado intersticial|peribr[ôo]nquic|linhas? b/, "Padrão intersticial: infecção viral ou atípica, edema pulmonar"],
  [/atelectasia/, "Atelectasia: desvio do mediastino para o lado acometido; fisioterapia e broncoscopia se persistir"],
  [/cardiomeg|[íi]ndice cardiotor[áa]cico|[áa]rea card[íi]aca aumentada/, "Cardiomegalia: índice cardiotorácico > 0,5 (> 0,6 no lactente); pedir ecocardiograma"],
  [/alargamento (do )?mediastino|mediastino alargado/, "Mediastino alargado: timo no lactente; massa, adenomegalia ou lesão de aorta nos demais"],
  [/pneumomediastino|enfisema subcut/, "Ar extra-alveolar: pneumomediastino ou enfisema subcutâneo; procurar pneumotórax"],
  [/n[íi]veis? hidroa[ée]reos?|distens[ãa]o de al[çc]as|empilhamento/, "Padrão obstrutivo: obstrução intestinal ou íleo; sonda gástrica e avaliação cirúrgica"],
  [/ar livre|pneumoperit[ôo]nio|ar subdiafragm/, "Pneumoperitônio: perfuração de víscera oca; cirurgia de urgência"],
  [/alvo|pseudo-?rim|invagina|intussuscep/, "Sinal do alvo: invaginação intestinal; redução por enema ou cirurgia"],
  [/pneumatose|portograma/, "Pneumatose intestinal: enterocolite necrosante no recém-nascido"],
  [/l[íi]quido livre|morrison|fast positivo/, "Líquido livre abdominal: no trauma, hemoperitônio até prova em contrário"],
  [/supra(desnivelamento)?( de)? ?st|supra st/, "Supradesnivelamento de ST: infarto, pericardite (difuso, com infra de PR) ou repolarização precoce"],
  [/qt longo|qtc? (prolongado|aumentado)|qtc? ?[>≥] ?4[6-9]\d|qtc? ?[>≥] ?5\d\d/, "QT longo: suspender fármacos que prolongam o QT; corrigir potássio, magnésio e cálcio"],
  [/onda delta|pr curto|wolff|pr[ée]-excita/, "Pré-excitação (Wolff-Parkinson-White): evitar bloqueadores do nó AV na fibrilação atrial pré-excitada"],
  [/onda t (apiculada|em tenda)|t apiculada/, "Onda T apiculada: hipercalemia até prova em contrário; dosar potássio e dar cálcio se houver alargamento do QRS"],
  [/bloqueio (atrioventricular|av)|bav/, "Bloqueio atrioventricular: definir o grau; atropina ou marca-passo se houver instabilidade"],
  [/fratura/, "Fratura: avaliar o mecanismo; em menor de 2 anos sem história compatível, pensar em trauma não acidental"],
  [/corpo estranho/, "Corpo estranho: bateria em esôfago é emergência (remoção em até 2 h)"]
];

/* ---------- modelos de documentos ---------- */
var DOCS = {
  transf: { t: "Relatório de transferência", x: "RELATÓRIO DE TRANSFERÊNCIA\n\nPaciente: [NOME]\nIdade: [IDADE]   Peso: [PESO] kg   Sexo: [SEXO]\nOrigem: [UNIDADE DE ORIGEM]   Destino: [UNIDADE DE DESTINO]\nData e hora: [DATA HORA]\n\nMotivo da transferência: [MOTIVO]\nDiagnóstico principal: [DIAGNÓSTICO]\nHistória resumida: [HISTÓRIA]\nSinais vitais na saída: FC [FC]  FR [FR]  PA [PA]  SpO₂ [SPO2]  T [TEMP]  Glicemia [GLICEMIA]\nMedicações em uso (dose e horário da última administração): [MEDICAÇÕES]\nSuporte em curso (oxigênio, ventilação, acessos, infusões): [SUPORTE]\nExames realizados: [EXAMES]\nAlergias: [ALERGIAS]\nContato do responsável: [CONTATO]\nRegulação (número e médico regulador): [REGULAÇÃO]\n\nMédico responsável: [NOME DO MÉDICO] · CRM [CRM]\nAssinatura: __________________" },
  encam: { t: "Encaminhamento (referência)", x: "ENCAMINHAMENTO\n\nAo serviço de: [ESPECIALIDADE OU UNIDADE]\n\nPaciente: [NOME]   Idade: [IDADE]   Peso: [PESO] kg\nData: [DATA]\n\nMotivo do encaminhamento: [MOTIVO]\nResumo clínico: [RESUMO]\nExames e tratamentos realizados: [EXAMES E TRATAMENTOS]\nHipótese diagnóstica: [HIPÓTESE]\nSolicito: [AVALIAÇÃO, SEGUIMENTO OU PROCEDIMENTO]\n\nMédico: [NOME] · CRM [CRM]\nAssinatura: __________________" },
  atest: { t: "Atestado médico", x: "ATESTADO MÉDICO\n\nAtesto, para os devidos fins, que [NOME DO PACIENTE] foi atendido(a) neste serviço em [DATA], às [HORA], e necessita de afastamento de suas atividades por [NÚMERO] dia(s), a partir desta data.\n\nCID (somente com autorização do paciente ou responsável): [CID]\n\nLocal e data: [CIDADE], [DATA].\n\nMédico: [NOME] · CRM [CRM]\nAssinatura: __________________" },
  acomp: { t: "Atestado de acompanhamento para o responsável", x: "ATESTADO DE ACOMPANHAMENTO\n\nAtesto, para os devidos fins, que [NOME DO RESPONSÁVEL], portador(a) do documento [DOCUMENTO], acompanhou [NOME DO PACIENTE] durante o atendimento realizado em [DATA].\n\nPeríodo de acompanhamento: [PERÍODO].\n\nLocal e data: [CIDADE], [DATA].\n\nMédico: [NOME] · CRM [CRM]\nAssinatura: __________________" },
  resumo: { t: "Resumo de alta", x: "RESUMO DE ALTA\n\nPaciente: [NOME]   Idade: [IDADE]   Peso: [PESO] kg\nPermanência: [DATA ENTRADA] a [DATA ALTA]\nDiagnóstico de alta: [DIAGNÓSTICO]\nEvolução: [EVOLUÇÃO]\nProcedimentos realizados: [PROCEDIMENTOS]\nExames relevantes: [EXAMES]\nMedicações para uso em casa (dose, intervalo e duração): [MEDICAÇÕES]\nOrientações e sinais de alarme: [ORIENTAÇÕES]\nRetorno: [DATA E LOCAL DE RETORNO]\n\nMédico: [NOME] · CRM [CRM]\nAssinatura: __________________" },
  evol: { t: "Ficha de evolução", x: "FICHA DE EVOLUÇÃO\n\nData e hora: [DATA HORA]\nPaciente: [NOME]   Leito: [LEITO]   Peso: [PESO] kg\nSubjetivo: [QUEIXA]\nObjetivo: FC [FC]  FR [FR]  PA [PA]  SpO₂ [SPO2]  T [TEMP] · Exame físico: [EXAME]\nExames: [EXAMES]\nAvaliação: [ANÁLISE]\nPlano: [PLANO]\n\nMédico: [NOME] · CRM [CRM]\nAssinatura: __________________" },
  consent: { t: "Termo de consentimento", x: "TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO\n\nEu, [NOME DO RESPONSÁVEL], documento [DOCUMENTO], responsável por [NOME DO PACIENTE], declaro que fui informado(a) de forma clara sobre o procedimento [PROCEDIMENTO], seus benefícios, riscos e alternativas, e que tive oportunidade de tirar dúvidas.\n\nAutorizo a realização do procedimento.\n\nData: [DATA]\nAssinatura do responsável: __________________\nAssinatura do médico: __________________   CRM [CRM]\nTestemunha: __________________" },
  decl: { t: "Declaração de comparecimento", x: "DECLARAÇÃO DE COMPARECIMENTO\n\nDeclaro que [NOME], portador(a) do documento [DOCUMENTO], compareceu a este serviço no dia [DATA], às [HORA], para atendimento de [MOTIVO], permanecendo pelo período de [PERÍODO].\n\n[CIDADE], [DATA].\n\nAssinatura e carimbo: __________________" }
};
var DOC_ORDEM = ["transf", "encam", "atest", "acomp", "resumo", "evol", "consent", "decl"];

/* ---------- grupos e abas ---------- */
var GRUPOS = [
  { g: "Estabilização", n: 1, tabs: [["t-painel", "Painel"], ["t-estab", "Estabilização inicial"], ["t-sala", "Sala vermelha"], ["t-via", "Via aérea"], ["t-pcr", "PCR e arritmias"], ["t-choques", "Choques"], ["t-mal", "Estado de mal"], ["t-trauma", "Trauma e TCE"], ["t-intox", "Intoxicações"], ["t-metab", "Distúrbios metabólicos"]] },
  { g: "Fármacos", n: 2, tabs: [["t-dil", "Diluições calculadas"], ["t-repertorio", "Repertório ANVISA"], ["t-atb", "Antibióticos por linha"], ["t-pos", "Posologias por peso"]] },
  { g: "Suporte", n: 3, tabs: [["t-soro", "Soroterapia"], ["t-corr", "Correção hidroeletrolítica"], ["t-vm", "Ventilação invasiva"], ["t-vni", "VNI e CPAP"], ["t-desmame", "Desmame e assincronia"]] },
  { g: "Raciocínio", n: 4, tabs: [["t-escores", "Escores"], ["t-diag", "Diagnóstico sindrômico"], ["t-exames", "Exames iniciais"], ["t-img", "Imagens e laudos"]] },
  { g: "Alta e documentos", n: 5, tabs: [["t-alta", "Receita de alta"], ["t-docs", "Modelos de documentos"], ["t-novidades", "Novidades"]] }
];
var PESOS_RAPIDOS = [3.5, 5, 9, 13, 18, 28, 50, 70];
