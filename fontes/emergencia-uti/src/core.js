/* =====================================================================
   Emergência & UTI — Referência Clínica Integrada
   Núcleo: formatação numérica, paciente, faixas etárias e zonas de peso.
   Escrito em ES5 para funcionar em navegadores antigos de hospital.
   ===================================================================== */
var $ = function (id) { return document.getElementById(id); };

/* ---------- números ---------- */
// Arredondamento decimal sem o erro binário de 1,005 → 1,00.
function rnd(v, d) {
  if (!isFinite(v)) return NaN;
  var f = Math.pow(10, d || 0);
  var s = v < 0 ? -1 : 1;
  return s * Math.round((Math.abs(v) + 1e-9) * f) / f;
}
// Casas fixas com vírgula decimal.
function nf(v, d) {
  if (!isFinite(v)) return "—";
  return rnd(v, d || 0).toFixed(d || 0).replace(".", ",");
}
function trim0(s) {
  if (s.indexOf(",") < 0) return s;
  return s.replace(/0+$/, "").replace(/,$/, "");
}
// Separador de milhar só a partir de 10 000 e com espaço fino (nunca ponto,
// que pode ser lido como decimal em uma dose).
function milhar(s) {
  var p = s.split(",");
  if (p[0].replace("-", "").length < 5) return s;
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return p.join(",");
}
// Número de dose: casas conforme a grandeza; nunca mostra "0" para valor não nulo.
function num(v) {
  if (!isFinite(v)) return "—";
  var a = Math.abs(v), d;
  if (a === 0) return "0";
  if (a < 0.1) d = 3; else if (a < 10) d = 2; else if (a < 100) d = 1; else d = 0;
  var s = trim0(nf(v, d));
  if (s === "0" || s === "-0") s = trim0(nf(v, d + 2));
  return milhar(s);
}
// Volume em mL: 2 casas abaixo de 1 mL, 1 casa até 100 mL, inteiro acima.
function mlNum(v) {
  if (!isFinite(v)) return "—";
  var a = Math.abs(v), d;
  if (a === 0) return "0";
  if (a < 0.1) d = 3; else if (a < 1) d = 2; else if (a < 100) d = 1; else d = 0;
  var s = trim0(nf(v, d));
  if (s === "0") s = trim0(nf(v, 4));
  return milhar(s);
}
function ml(v) { return mlNum(v) + " mL"; }
function faixaTxt(a, b, f) {
  f = f || num;
  var x = f(a), y = f(b);
  return x === y ? x : x + "–" + y;
}
function clamp(v, lo, hi) {
  if (lo != null && v < lo) v = lo;
  if (hi != null && v > hi) v = hi;
  return v;
}
function gotasMacro(mlh) { return nf(mlh / 3, 0) + " gotas/min"; }   // 20 gotas/mL
function gotasMicro(mlh) { return nf(mlh, 0) + " microgotas/min"; }  // 60 microgotas/mL
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---------- paciente ---------- */
var P = { peso: 18, idadeTxt: "4 anos", idade: 4, idadeOk: true, sexo: "M", exemplo: true };

// Aceita "4 anos", "4a", "4", "18 meses", "18m", "2a 6m", "1 ano e meio",
// "15 dias", "3 semanas", "RN". Sem unidade = anos.
function parseIdade(txt) {
  var s = String(txt == null ? "" : txt).toLowerCase().replace(/,/g, ".").trim();
  if (!s) return { anos: NaN, ok: false };
  if (/^(rn|rec[eé]m)/.test(s) && !/\d/.test(s)) return { anos: 0, ok: true };
  var re = /(\d+(?:\.\d+)?)\s*(anos?|a(?![a-zà-ú])|meses|m[eê]s|m(?![a-zà-ú])|semanas?|sem(?![a-zà-ú])|s(?![a-zà-ú])|dias?|d(?![a-zà-ú]))?/g;
  var m, anos = 0, achou = false, ultima = 1;
  while ((m = re.exec(s))) {
    var n = parseFloat(m[1]), u = m[2] || "";
    achou = true;
    if (/^d/.test(u)) ultima = 1 / 365.25;
    else if (/^s/.test(u)) ultima = 7 / 365.25;
    else if (/^m/.test(u)) ultima = 1 / 12;
    else ultima = 1;
    anos += n * ultima;
  }
  if (achou && /\be\s+mei[oa]\b/.test(s)) anos += 0.5 * ultima;
  if (!achou || anos > 120) return { anos: NaN, ok: false };
  return { anos: anos, ok: true };
}
function plural(n, s, p) { return n + " " + (n === 1 ? s : p); }
// Texto de conferência da idade interpretada.
function idadeNorm(anos) {
  if (!isFinite(anos)) return "idade não reconhecida";
  var dias = anos * 365.25;
  if (dias < 28) return plural(Math.round(dias), "dia", "dias") + " (recém-nascido)";
  var meses = anos * 12;
  if (meses < 24) return plural(Math.round(meses * 10) / 10 === Math.round(meses) ? Math.round(meses) : Math.floor(meses), "mês", "meses");
  var a = Math.floor(anos + 1e-9), m = Math.round((anos - a) * 12);
  if (m === 12) { a += 1; m = 0; }
  return plural(a, "ano", "anos") + (m > 0 && a < 12 ? " e " + plural(m, "mês", "meses") : "");
}

// Faixas etárias com sinais vitais (PALS/AHA; FR igual à do Guia de Influenza MS 2023).
function faixaEtaria(anos) {
  if (!isFinite(anos)) anos = 4;
  var dias = anos * 365.25;
  if (dias < 28) return { k: "neo", nome: "Recém-nascido (0–28 dias)", fc: "100–205/min acordado; 90–160 dormindo", fr: "30–60/min", pas: 60 };
  if (anos < 1) return { k: "lac", nome: "Lactente (1–12 meses)", fc: "100–180/min acordado; 90–160 dormindo", fr: "30–53/min", pas: 70 };
  if (anos < 3) return { k: "c12", nome: "Criança de 1–2 anos", fc: "98–140/min acordado; 80–120 dormindo", fr: "22–37/min", pas: 70 + 2 * Math.floor(anos) };
  if (anos < 6) return { k: "pre", nome: "Pré-escolar (3–5 anos)", fc: "80–120/min acordado; 65–100 dormindo", fr: "20–28/min", pas: 70 + 2 * Math.floor(anos) };
  if (anos < 12) return { k: "esc", nome: "Escolar (6–11 anos)", fc: "75–118/min acordado; 58–90 dormindo", fr: "18–25/min", pas: anos < 10 ? 70 + 2 * Math.floor(anos) : 90 };
  if (anos < 16) return { k: "ado", nome: "Adolescente (12–15 anos)", fc: "60–100/min acordado; 50–90 dormindo", fr: "12–20/min", pas: 90 };
  return { k: "adu", nome: "Adulto (16 anos ou mais)", fc: "60–100/min", fr: "12–20/min", pas: 90 };
}
function ehAdulto(p) { return p.idade >= 16; }

// PAM mínima (percentil 5) e mediana (percentil 50): 40 + 1,5 × idade e 55 + 1,5 × idade.
function pamAlvo(anos) {
  if (!isFinite(anos)) anos = 4;
  if (anos >= 16) return { p5: 65, p50: 85, txt: "≥ 65 mmHg" };
  var a = Math.min(anos, 15);
  var p5 = 40 + 1.5 * a, p50 = 55 + 1.5 * a;
  if (anos * 365.25 < 28) return { p5: 40, p50: 50, txt: "≥ 40 mmHg (RN a termo; no pré-termo, ≈ idade gestacional em semanas)" };
  return { p5: p5, p50: p50, txt: nf(p5, 0) + "–" + nf(p50, 0) + " mmHg (P5–P50)" };
}

// Peso esperado para a idade (APLS): serve só para alertar incoerência.
function pesoEsperado(anos, sexo) {
  if (!isFinite(anos)) return NaN;
  if (anos < 1) return anos * 12 / 2 + 4;
  if (anos < 6) return 2 * anos + 8;
  if (anos < 13) return 3 * anos + 7;
  if (anos < 16) return 3 * anos + 7;
  return sexo === "F" ? 60 : 70;
}
// Idade típica para um peso (inverso da fórmula acima), usada nos pesos rápidos.
function idadeTipica(peso) {
  if (peso < 4.5) return "RN";
  if (peso < 10) return Math.max(1, Math.round((peso - 4) * 2)) + " meses";
  if (peso <= 18) return Math.max(1, Math.round((peso - 8) / 2)) + " anos";
  if (peso <= 43) return Math.round((peso - 7) / 3) + " anos";
  if (peso < 60) return "14 anos";
  return "30 anos";
}
function incoerencia(p) {
  if (!p.idadeOk) return null;
  var e = pesoEsperado(p.idade, p.sexo);
  if (!isFinite(e)) return null;
  var r = p.peso / e;
  var fora = p.idade >= 16 ? p.peso < 35 : (r < 0.6 || r > 1.75);
  if (!fora) return null;
  return { esperado: e, tipica: idadeTipica(p.peso) };
}

// Superfície corporal sem altura: (4 × peso + 7) / (peso + 90).
function superficie(peso) { return (4 * peso + 7) / (peso + 90); }

/* ---------- zonas de peso (código de cores das fitas de emergência pediátrica) ---------- */
var ZONAS = [
  { k: "sub", min: 0, max: 3, nome: "Abaixo de 3 kg", cor: "#8A929B", tinta: "#fff", rot: "< 3 kg" },
  { k: "cinza", min: 3, max: 6, nome: "Cinza (3–5 kg)", cor: "#9AA3AB", tinta: "#111", rot: "3–5 kg" },
  { k: "rosa", min: 6, max: 8, nome: "Rosa (6–7 kg)", cor: "#F2A2BC", tinta: "#111", rot: "6–7 kg" },
  { k: "vermelha", min: 8, max: 10, nome: "Vermelha (8–9 kg)", cor: "#D5303B", tinta: "#fff", rot: "8–9 kg" },
  { k: "roxa", min: 10, max: 12, nome: "Roxa (10–11 kg)", cor: "#7C55B3", tinta: "#fff", rot: "10–11 kg" },
  { k: "amarela", min: 12, max: 15, nome: "Amarela (12–14 kg)", cor: "#F0C02C", tinta: "#111", rot: "12–14 kg" },
  { k: "branca", min: 15, max: 19, nome: "Branca (15–18 kg)", cor: "#FFFFFF", tinta: "#111", rot: "15–18 kg" },
  { k: "azul", min: 19, max: 24, nome: "Azul (19–23 kg)", cor: "#2E7DCE", tinta: "#fff", rot: "19–23 kg" },
  { k: "laranja", min: 24, max: 30, nome: "Laranja (24–29 kg)", cor: "#EE8722", tinta: "#111", rot: "24–29 kg" },
  { k: "verde", min: 30, max: 37, nome: "Verde (30–36 kg)", cor: "#3C9A4D", tinta: "#fff", rot: "30–36 kg" },
  { k: "adulto", min: 37, max: 1e9, nome: "Acima de 36 kg", cor: "#3B4856", tinta: "#fff", rot: "> 36 kg" }
];
function zona(peso) {
  for (var i = 0; i < ZONAS.length; i++) if (peso >= ZONAS[i].min && peso < ZONAS[i].max) return ZONAS[i];
  return ZONAS[ZONAS.length - 1];
}

/* ---------- via aérea ---------- */
function meio(v) { return Math.round(v * 2) / 2; }
// Tamanhos vizinhos quando a fórmula cai entre dois tubos (ex.: 5,25 → 5,0–5,5).
function tuboTxt(v) {
  var lo = Math.floor(v * 2 + 1e-9) / 2, hi = Math.ceil(v * 2 - 1e-9) / 2;
  return lo === hi ? nf(lo, 1) : nf(lo, 1) + "–" + nf(hi, 1);
}
function viaAerea(p) {
  var a = p.idade, kg = p.peso, r = {};
  if (!isFinite(a)) a = 4;
  var dias = a * 365.25;
  if (dias < 28) {
    var s = kg < 1 ? 2.5 : (kg < 2 ? 3.0 : 3.5);
    r.sem = nf(s, 1) + " mm"; r.semN = s;
    r.com = kg >= 3 ? "3,0 mm" : "não usar"; r.comN = kg >= 3 ? 3.0 : NaN;
    r.prof = kg + 6; r.profTxt = nf(kg + 6, 1) + " cm";
    r.semCap = "RN por peso: < 1 kg 2,5; 1–2 kg 3,0; > 2 kg 3,5";
    r.comCap = "RN a termo ≥ 3 kg: 3,0 com cuff";
    r.profCap = "RN: peso (kg) + 6 cm no lábio";
    r.lam = kg < 3 ? "Reta nº 0 (00 no prematuro extremo)" : "Reta nº 0–1";
  } else if (a < 1) {
    r.sem = "3,5 mm"; r.semN = 3.5; r.com = "3,0 mm"; r.comN = 3.0;
    r.prof = 10.5; r.profTxt = "10–11 cm";
    r.semCap = "Lactente < 1 ano: 3,5 sem cuff";
    r.comCap = "Lactente < 1 ano: 3,0 com cuff";
    r.profCap = "3 × diâmetro do tubo sem cuff";
    r.lam = "Reta nº 1";
  } else if (a < 2) {
    r.sem = "4,0 mm"; r.semN = 4.0; r.com = "3,5 mm"; r.comN = 3.5;
    r.prof = a / 2 + 12; r.profTxt = nf(r.prof, 1) + " cm";
    r.semCap = "1–2 anos: 4,0 sem cuff";
    r.comCap = "1–2 anos: 3,5 com cuff";
    r.profCap = "idade ÷ 2 + 12, para tubo oral";
    r.lam = "Reta nº 1";
  } else if (a < 16) {
    var sem = a / 4 + 4, com = a / 4 + 3.5;
    var teto = p.sexo === "F" ? 7.0 : 7.5;
    if (com > teto) com = teto;
    r.semN = sem; r.comN = com;
    r.sem = a <= 10 ? tuboTxt(sem) + " mm" : "preferir com cuff";
    r.com = tuboTxt(com) + " mm";
    r.prof = Math.min(a / 2 + 12, p.sexo === "F" ? 21 : 23); r.profTxt = nf(r.prof, 1) + " cm";
    r.semCap = "(idade ÷ 4) + 4, a partir de 2 anos";
    r.comCap = "(idade ÷ 4) + 3,5, a partir de 2 anos";
    r.profCap = "idade ÷ 2 + 12, para tubo oral";
    r.lam = a < 4 ? "Reta nº 2 (ou curva nº 2)" : (a < 10 ? "Reta ou curva nº 2" : "Curva nº 3");
  } else {
    r.sem = "não usar"; r.semN = NaN;
    r.com = p.sexo === "F" ? "7,0–7,5 mm" : "7,5–8,0 mm"; r.comN = p.sexo === "F" ? 7.0 : 7.5;
    r.prof = p.sexo === "F" ? 21 : 23; r.profTxt = r.prof + " cm";
    r.semCap = "Adolescente/adulto: sempre com cuff";
    r.comCap = "Adulto: mulher 7,0–7,5; homem 7,5–8,0";
    r.profCap = "Adulto: 21 cm (mulher) ou 23 cm (homem) na arcada dentária";
    r.lam = "Curva nº 3–4";
  }
  return r;
}

/* ---------- motor de dose ----------
   d = { k:[mín,máx] por kg, per:"dose"|"dia", n: doses/dia, u: unidade,
         max: teto por dose (número ou função do paciente), maxDia, min }
   Devolve a dose POR TOMADA já limitada pelos tetos. */
function val(x, p) { return typeof x === "function" ? x(p) : x; }
function doseCalc(d, p) {
  var k = val(d.k, p);
  if (!(k instanceof Array)) k = [k, k];
  var div = d.per === "dia" ? (val(d.n, p) || 1) : 1;
  var lo = k[0] * p.peso / div, hi = k[k.length - 1] * p.peso / div;
  var max = val(d.max, p), maxDia = val(d.maxDia, p), min = val(d.min, p);
  var teto = max != null ? max : null;
  if (maxDia != null) teto = teto == null ? maxDia / div : Math.min(teto, maxDia / div);
  var cap = false;
  if (teto != null) {
    if (hi > teto + 1e-9) { hi = teto; cap = true; }
    if (lo > teto + 1e-9) { lo = teto; }
  }
  var minAp = false;
  if (min != null) { if (lo < min) { lo = min; minAp = true; } if (hi < min) hi = min; }
  return { lo: lo, hi: hi, cap: cap, minAp: minAp, teto: teto, div: div, k: k, u: d.u || "mg", max: max, maxDia: maxDia, min: min };
}
// Quantidade com unidade; unidades internacionais a partir de 1 milhão são lidas em milhões.
function qtdTxt(lo, hi, u) {
  if (u === "UI" && hi >= 1e6) return faixaTxt(lo / 1e6, hi / 1e6) + (hi / 1e6 < 2 && lo === hi ? " milhão de UI" : " milhões de UI");
  return faixaTxt(lo, hi) + " " + u;
}
function doseTxt(c) { return qtdTxt(c.lo, c.hi, c.u); }
function porKgTxt(d, p) {
  var k = val(d.k, p);
  if (!(k instanceof Array)) k = [k, k];
  var u = d.u || "mg";
  var t = faixaTxt(k[0], k[k.length - 1]) + " " + u + "/kg";
  if (d.per === "dia") t += (val(d.n, p) || 1) > 1 ? "/dia ÷ " + val(d.n, p) : "/dia, em 1 tomada";
  else if (d.per === "h") t += "/h";
  else t += d.unica ? "" : "/dose";
  return t;
}
function tetoTxt(c) {
  var t = [];
  if (c.max != null) t.push(qtdTxt(c.max, c.max, c.u) + "/dose");
  if (c.maxDia != null) t.push(qtdTxt(c.maxDia, c.maxDia, c.u) + "/dia");
  if (c.min != null) t.push("mín. " + num(c.min) + " " + c.u);
  return t.length ? t.join("; ") : "—";
}
function volTxt(c, conc) { return faixaTxt(c.lo / conc, c.hi / conc, mlNum) + " mL"; }
function gotasTxt(c, conc, gpm) {
  var a = Math.round(c.lo / conc * gpm), b = Math.round(c.hi / conc * gpm);
  if (b < 1) return "< 1 gota";
  return (a === b ? String(a) : a + "–" + b) + (b === 1 ? " gota" : " gotas");
}
