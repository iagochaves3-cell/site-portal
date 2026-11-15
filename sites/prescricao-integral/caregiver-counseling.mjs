// Orientações solicitadas pelo prescritor em 04/10/2026.
// Um único conteúdo por projeto alimenta exibição, cópia e impressão.
export const COLIC_TITLE = "ORIENTAÇÕES - CÓLICAS DO LACTENTE:";
export const COLIC_RECOMMENDATIONS = Object.freeze([
  "PEGAR O BEBÊ NO COLO (PODE SER TENTADO O CONTATO DIRETO DA BARRIGA DO BEBÊ COM A BARRIGA DA MÃE);",
  "ENROLAR O BEBÊ EM UMA MANTA OU COBERTOR;",
  "FLEXIONAR AS COXAS DO BEBÊ SOBRE A BARRIGA;",
  "BANHO MORNO OU COMPRESSAS NA BARRIGA PODEM AUXILIAR NA REDUÇÃO DA CÓLICA/CHORO NO LACTENTE;",
  "REDUZIR ESTÍMULOS PARA O BEBÊ (EVITAR LOCAIS COM MUITO BARULHO OU EXCESSO DE PESSOAS);",
  "PROCURAR UM AMBIENTE TRANQUILO, PODENDO SER USADA MÚSICA AMBIENTE SUAVE;",
  "ESTABELECER UMA ROTINA PARA BANHO, SONO, PASSEIO E OUTRAS ATIVIDADES;",
  "NÃO UTILIZAR CHÁS, TROCAR MARCAS DE FÓRMULA LEITE OU USAR MEDICAMENTOS SEM A ORIENTAÇÃO DO PEDIATRA;",
  "NUNCA INTERROMPER A AMAMENTAÇÃO EXCLUSIVA. SEMPRE PEDIR ORIENTAÇÃO AO PEDIATRA;",
  "SIGA SEMPRE AS RECOMENDAÇÕES DO PEDIATRA, QUE É QUEM REALMENTE SABE O QUE É MELHOR PARA A SAÚDE DO SEU BEBÊ.",
]);
export const COLIC_SAFETY = Object.freeze([
  "CONTATO BARRIGA COM BARRIGA: SOMENTE COM O ADULTO ACORDADO, SOB SUPERVISÃO E COM NARIZ E BOCA LIVRES. NÃO DORMIR COM O BEBÊ NESSA POSIÇÃO.",
  "MANTA: USAR TECIDO LEVE, SEM PESO, SEM COBRIR A CABEÇA, APERTAR O TÓRAX OU PRENDER AS PERNAS; EVITAR SUPERAQUECIMENTO. PARAR DE ENROLAR ASSIM QUE O BEBÊ MOSTRAR SINAIS DE TENTAR ROLAR.",
  "PARA TODO SONO, COLOCAR O BEBÊ DE BARRIGA PARA CIMA, EM BERÇO PRÓPRIO, SOBRE SUPERFÍCIE FIRME E PLANA, SEM MANTAS SOLTAS, TRAVESSEIROS OU OBJETOS.",
  "FLEXIONAR AS PERNAS SUAVEMENTE, SEM FORÇAR. BANHO E COMPRESSA DEVEM SER APENAS MORNOS, NUNCA QUENTES; NÃO USAR BOLSA DE ÁGUA QUENTE OU AQUECEDOR E MANTER SUPERVISÃO CONTÍNUA.",
]);
export const SKIN_TITLE = "CUIDADOS COM A PELE - OPÇÕES DE PRODUTOS:";
export const SKIN_RECOMMENDATIONS = Object.freeze([
  "SABONETES / PRODUTOS DE LIMPEZA: Epidrat® Sensi; Fisiogel® Liquid (sabonete líquido); Johnson’s® Cabeça aos Pés; Cetaphil® sabonete; Eucerin® pH5; Lipikar® Surgras; Nutratopic® gel de banho; Stelatopia® creme de limpeza; Xémose®.",
  "SHAMPOOS: Cetaphil®; Eucerin®; Fisiogel®; Kerium®.",
  "HIDRATANTES: Neutrogena® Body Care pele extrasseca; Neutrogena® Norwegian hidratante corporal; Fisiogel® AI; CeraVe® creme/loção; Cetaphil® Advanced; Cetaphil® creme/loção.",
  "ESCOLHER UM PRODUTO DE CADA CATEGORIA NECESSÁRIA COM ORIENTAÇÃO DO PEDIATRA OU DERMATOLOGISTA, CONFORME IDADE, TIPO DE PELE E TOLERÂNCIA. PRIORIZAR LIMPEZA SUAVE E VARIANTES SEM PERFUME; A MARCA, SOZINHA, NÃO GARANTE ADEQUAÇÃO À CRIANÇA.",
  "CONFERIR A VARIANTE, A COMPOSIÇÃO E A FAIXA ETÁRIA NA EMBALAGEM, ESPECIALMENTE EM BEBÊS. SHAMPOOS ANTICASPA OU COM ATIVOS EXIGEM INDICAÇÃO ESPECÍFICA; NÃO SUBSTITUIR UM PELO OUTRO APENAS PELA MARCA.",
  "EVITAR BANHO QUENTE, ESFREGAR A PELE E CONTATO DOS PRODUTOS COM OLHOS, MUCOSAS OU FERIDAS ABERTAS. USAR HIDRATANTE NAS ÁREAS RESSECADAS QUANDO INDICADO; NÃO APLICAR EM ACNE NEONATAL. SUSPENDER O PRODUTO SE HOUVER ARDOR, VERMELHIDÃO OU PIORA.",
  "ESTES CUIDADOS COMPLEMENTAM O TRATAMENTO DA AFECÇÃO DE PELE E NÃO SUBSTITUEM OS MEDICAMENTOS, OS SINAIS DE ALARME NEM O RETORNO ORIENTADO.",
]);
export const COUNSELING_SOURCES = Object.freeze({
  colic: Object.freeze([
    { title: "SBP — Cólica do lactente", url: "https://www.sbp.com.br/pediatria-para-familias/primeira-infancia/colica-do-lactente/", accessed: "2026-10-04" },
    { title: "SBP — Perguntas complementares sobre Cólica do Lactente", url: "https://www.sbp.com.br/pediatria-para-familias/primeira-infancia/perguntas-complementares-sobre-colica-do-lactente/", accessed: "2026-10-04" },
    { title: "AAP — Sono seguro e cuidados ao enrolar o bebê", url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx", accessed: "2026-10-04" },
  ]),
  skin: Object.freeze([
    { title: "SBP — Cuidados com a pele e anexos do recém-nascido", url: "https://www.sbp.com.br/fileadmin/user_upload/sbp/2024/abril/11/_24424L-GPA_ISBN_-_Cuidado_Pele_e_Anexos_do_RN.pdf", accessed: "2026-10-04" },
    { title: "Mustela — Linha Stelatopia de limpeza", url: "https://www.mustela.com.br/products/stelatopia-gel-lavante", accessed: "2026-10-04" },
    { title: "Megalabs — Fisiogel sabonete líquido", url: "https://www.megalabsbrasil.com.br/produtos/fisiogel-sabonete-liquido-400ml/", accessed: "2026-10-04" },
    { title: "Eucerin — Limpeza pH5", url: "https://www.eucerin.com.br/produtos/pele-sensivel/eucerin-ph5-gel-de-limpeza-400ml", accessed: "2026-10-04" },
  ]),
});
const normalize = (value) => typeof value === "string"
  ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim()
  : "";
export const isInfantColic = (diagnosis) => /\bcolicas? (?:do |dos |de )?lactentes?\b/.test(normalize(diagnosis));
export const isSkinCondition = (diagnosis, category = "") => {
  const text = normalize(diagnosis);
  if (/dermatomiosite|dermatopolimiosite|orbitaria|periorbitaria|pre-septal/.test(text)) return false;
  return /\b(?:dermatologia|dermatologica|pele)\b/.test(normalize(category))
    || /\b(?:dermatites?|fitofotodermatite|alteracoes dermatologicas|eczema\w*|xerose|ressecamento|pitiriase|psoriase|urticaria|impetigo|foliculite|furunc\w*|escabiose|pediculose|tinea|tinha|micoses?|acne|molusco contagioso|celulite|erisipela|candidiase (?:cutanea|de fraldas)|verrugas?)\b/.test(text);
};

export function caregiverCounselingFor(diagnosis, { category = "", ageMonths = NaN, hospital = false } = {}) {
  if (hospital) return [];
  if (isInfantColic(diagnosis)) {
    if (Number.isFinite(ageMonths) && (ageMonths < 0 || ageMonths >= 5)) {
      return [{
        id: "colic-age-review", title: COLIC_TITLE,
        lines: ["A CÓLICA DO LACTENTE HABITUAL OCORRE NOS PRIMEIROS MESES E DEVE DESAPARECER ANTES DOS 5 MESES. NESTA IDADE, REAVALIAR O DIAGNÓSTICO COM O PEDIATRA; NÃO ATRIBUIR DOR OU CHORO PERSISTENTE AUTOMATICAMENTE À CÓLICA DO LACTENTE."],
        sources: COUNSELING_SOURCES.colic,
      }];
    }
    return [{
      id: "infant-colic", title: COLIC_TITLE,
      lines: [...COLIC_RECOMMENDATIONS, ...COLIC_SAFETY],
      sources: COUNSELING_SOURCES.colic,
    }];
  }
  if (isSkinCondition(diagnosis, category)) {
    return [{ id: "skin-care", title: SKIN_TITLE, lines: [...SKIN_RECOMMENDATIONS], sources: COUNSELING_SOURCES.skin }];
  }
  return [];
}

export function caregiverCounselingCopyLines(sections) {
  return sections.flatMap((section) => [section.title, ...section.lines.map((line) => "- " + line), ""]);
}
