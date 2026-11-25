/* =====================================================================
   Interface: leitura do paciente, cálculo de cada aba, navegação,
   cópia, impressão e tema. ES5.
   ===================================================================== */

/* ---------- utilidades de página ---------- */
function set(id, t) { var e = $(id); if (e) e.textContent = t; }
function setH(id, h) { var e = $(id); if (e) e.innerHTML = h; }
function cada(l, fn) { for (var i = 0; i < l.length; i++) fn(l[i], i); }
function mostra(el, sim) { if (!el) return; if (sim) el.removeAttribute("hidden"); else el.setAttribute("hidden", ""); }
function semAcento(s) {
  s = String(s).toLowerCase();
  return s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s;
}
function valorDe(id) { var v = parseFloat(String($(id).value).replace(",", ".")); return v; }
var toastT;
function toast(msg) {
  var t = $("toast"); t.textContent = msg; mostra(t, true);
  clearTimeout(toastT); toastT = setTimeout(function () { mostra(t, false); }, 3600);
}
// Espaço que não quebra entre o número e a unidade, para "0,18 mg" não se dividir em duas linhas.
function nb(s) { return s.replace(/(\d) (mg|mcg|mL|mEq|mmol|kg|g|J|U|UI|L|cm|mm|gotas?|jatos?)(?![A-Za-zÀ-ú])/g, "$1\u00A0$2"); }
// Linha de tabela. Célula: texto simples (escapado) ou { t: texto, c: classe, span: n }.
function tr(cells, cls) {
  var h = "<tr" + (cls ? ' class="' + cls + '"' : "") + ">";
  for (var i = 0; i < cells.length; i++) {
    var c = cells[i];
    if (c == null) c = "—";
    if (typeof c === "string") h += "<td>" + nb(esc(c)) + "</td>";
    else h += "<td" + (c.c ? ' class="' + c.c + '"' : "") + (c.span ? ' colspan="' + c.span + '"' : "") + ">" + nb(esc(c.t)) + (c.s ? "<small>" + esc(c.s) + "</small>" : "") + "</td>";
  }
  return h + "</tr>";
}
function K(t, s) { return { t: t, c: "calc", s: s }; }
function N(t, s) { return { t: t, s: s }; }
// Copia o texto do cabeçalho para cada célula: no celular a tabela vira ficha rotulada.
function rotular(tb) {
  var t = tb;
  while (t && t.tagName !== "TABLE") t = t.parentNode;
  if (!t) return;
  var ths = t.getElementsByTagName("th"), rows = tb.rows;
  for (var i = 0; i < rows.length; i++) {
    var cs = rows[i].cells;
    if (cs.length !== ths.length) continue;
    for (var j = 0; j < cs.length; j++) cs[j].setAttribute("data-th", ths[j].textContent);
  }
}
function corpo(id, html) { var tb = $(id); tb.innerHTML = html; rotular(tb); }
function achar(lista, id) { for (var i = 0; i < lista.length; i++) if (lista[i].id === id || lista[i].n === id) return lista[i]; return null; }
function ehNeo(p) { return p.idade * 365.25 < 28; }
function sexoTxt(p) { return p.sexo === "F" ? "feminino" : "masculino"; }
function pacienteTxt() { return num(P.peso) + " kg, " + idadeNorm(P.idade) + ", " + sexoTxt(P); }
function dataTxt(comHora) {
  var d = new Date();
  function z(n) { return (n < 10 ? "0" : "") + n; }
  var s = z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear();
  return comHora ? s + " " + z(d.getHours()) + ":" + z(d.getMinutes()) : s;
}
function horaTxt() { var d = new Date(); return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes(); }

/* ---------- item de dose (carta, via aérea, antídotos) ---------- */
function calcItem(it) {
  var c = doseCalc(it.d, P);
  var dose = doseTxt(c) + (c.cap ? " (teto)" : "") + (c.minAp ? " (dose mínima)" : "");
  var vol;
  if (it.cs) {
    var ps = [];
    for (var j = 0; j < it.cs.length; j++) ps.push(volTxt(c, it.cs[j][0]) + " (" + it.cs[j][1] + ")");
    vol = ps.join(" ou ");
    if (c.hi / it.c < 0.2) vol += "; volume pequeno: seringa de 1 mL ou diluir";
  } else if (it.c) {
    vol = volTxt(c, it.c);
    if (c.hi / it.c < 0.2) vol += " (volume pequeno: seringa de 1 mL ou diluir)";
  } else vol = c.u === "mL" ? doseTxt(c) : "—";
  return { c: c, dose: dose, vol: vol, kg: porKgTxt(it.d, P) };
}
function resumo(lista, id) {
  var it = achar(lista, id), r = calcItem(it);
  return it.c ? r.dose + " = " + r.vol : r.dose;
}
// Dose avulsa: especificação + concentração → "X mg = Y mL".
function dv(spec, conc, sufixo) {
  var c = doseCalc(spec, P);
  return doseTxt(c) + (c.cap ? " (teto)" : "") + (conc ? " = " + volTxt(c, conc) : "") + (sufixo ? " " + sufixo : "");
}

/* ---------- 1. Painel ---------- */
function cPainel() {
  var v = viaAerea(P), f = faixaEtaria(P.idade), pam = pamAlvo(P.idade), z = zona(P.peso);
  set("totSem", v.sem); set("totSemCap", v.semCap);
  set("totCom", v.com); set("totComCap", v.comCap);
  set("tubCm", v.profTxt); set("tubCmCap", v.profCap);
  set("fxNome", f.nome);
  set("fcRef", f.fc); set("frRef", f.fr);
  set("paRef", f.pas + " mmHg" + (P.idade >= 1 && P.idade < 10 ? " (70 + 2 × idade)" : ""));
  set("pamRef", pam.txt);
  set("lamRef", v.lam);
  set("scRef", nf(superficie(P.peso), 2) + " m²");
  set("zonaRef", z.nome);
  var pct = parseFloat($("desPct").value), def = P.peso * pct * 10;
  set("defMl", ml(def) + " (" + num(pct * 10) + " mL/kg)");
  set("defH", ml(def / 2) + " = " + ml(def / 2 / 8) + "/h");
  set("defH2", ml(def / 2) + " = " + ml(def / 2 / 16) + "/h");
  set("formDose", num(0.1 * P.peso) + " mg");
  set("formVol", ml(0.1 * P.peso));
}

/* ---------- 2. Estabilização ---------- */
function diureseMin() { return P.idade >= 12 ? 0.5 : 1; }
function cEstab() {
  var f = faixaEtaria(P.idade), sf = achar(CARTA, "sf"), g = achar(CARTA, "g10");
  set("estBolus", calcItem(sf).dose + " (" + porKgTxt(sf.d, P) + ")");
  set("estG10", calcItem(g).dose + " (" + porKgTxt(g.d, P) + ")");
  set("estPas", f.pas + " mmHg");
  set("estDiur", ml(diureseMin() * P.peso) + "/h (" + num(diureseMin()) + " mL/kg/h)");
}

/* ---------- 3. Sala vermelha ---------- */
function energia() {
  var kg = P.peso, r = {};
  if (ehAdulto(P)) {
    r.d1 = "200 J bifásico (120–200 J conforme o fabricante) ou 360 J monofásico";
    r.d2 = "200 J bifásico ou 360 J monofásico";
    r.c1 = "50–100 J na TSV e no flutter; 100 J na TV com pulso; 120–200 J na fibrilação atrial";
    r.c2 = "Aumentar a cada tentativa, até 200 J bifásico";
  } else {
    r.d1 = num(Math.min(2 * kg, 200)) + " J (2 J/kg)";
    r.d2 = num(Math.min(4 * kg, 200)) + " J (4 J/kg); pode subir até " + num(Math.min(10 * kg, 200)) + " J";
    r.c1 = faixaTxt(Math.min(0.5 * kg, 100), Math.min(kg, 200)) + " J (0,5–1 J/kg)";
    r.c2 = num(Math.min(2 * kg, 200)) + " J (2 J/kg)";
  }
  return r;
}
function cSala() {
  set("sPcr", resumo(CARTA, "adr"));
  var h = "";
  for (var i = 0; i < CARTA.length; i++) {
    var it = CARTA[i], r = calcItem(it);
    h += tr([it.n, r.kg, K(r.dose), K(r.vol), it.ap], it.crit ? "crit" : "");
  }
  corpo("cartaDrogas", h);
  var e = energia();
  set("sDesf", e.d1); set("sDesf2", e.d2); set("sCardio", e.c1); set("sCardio2", e.c2);
  var g = achar(CARTA, "g10"), sf = achar(CARTA, "sf");
  set("sG10", calcItem(g).dose + " (" + porKgTxt(g.d, P) + ")");
  set("sSF", calcItem(sf).dose + " (" + porKgTxt(sf.d, P) + ")");
  var z = zona(P.peso), eq = EQUIP[z.k];
  set("equipZona", "Faixa " + z.nome.toLowerCase() + ". Se o comprimento da criança indicar outra faixa na fita, seguir a fita.");
  h = "";
  for (i = 0; i < EQUIP_ITENS.length; i++) h += tr([EQUIP_ITENS[i], K(eq[i])]);
  corpo("equipTab", h);
}

/* ---------- 4. Via aérea ---------- */
function cVia() {
  var h = "", g = "";
  for (var i = 0; i < VIA.length; i++) {
    var it = VIA[i], r = calcItem(it);
    if (it.g !== g) { g = it.g; h += tr([{ t: g, span: 5 }], "grp"); }
    h += tr([it.n, r.kg, K(r.dose), K(r.vol), it.ap]);
  }
  corpo("viaTab", h);
  var v = viaAerea(P);
  set("viaSem", v.sem); set("viaCom", v.com); set("viaProf", v.profTxt + " (" + v.profCap + ")");
}

/* ---------- 5. PCR ---------- */
function cPcr() {
  set("pcrJ1", energia().d1);
  set("pcrAdr", resumo(CARTA, "adr"));
  set("pcrAmio", resumo(CARTA, "amio"));
  set("pMg", resumo(CARTA, "mg"));
  set("pCa", resumo(CARTA, "caglu"));
  set("pCaCl", resumo(CARTA, "cacl"));
  set("pAdr", resumo(CARTA, "adr"));
  set("pAtro", resumo(CARTA, "atro"));
  set("pAde", resumo(CARTA, "ade1"));
  set("pAde2", resumo(CARTA, "ade2"));
}

/* ---------- infusões contínuas ---------- */
// Quantidade por hora na unidade de q (mg, mcg ou U).
function porHora(inf, dose) {
  var x = dose * P.peso, u = inf.un, ud = u.split("/")[0];
  if (u.indexOf("/min") > 0) x *= 60;
  if (ud === "mcg" && inf.uq === "mg") x /= 1000;
  else if (ud === "mU" && inf.uq === "U") x /= 1000;
  else if (ud === "mg" && inf.uq === "mcg") x *= 1000;
  return x;
}
function vazao(inf, dose, vol) { return porHora(inf, dose) / (inf.q / vol); }
function concTxt(inf, vol) {
  var c = inf.q / vol;
  if (inf.uq === "mg" && c < 1) return num(c * 1000) + " mcg/mL";
  return num(c) + " " + inf.uq + "/mL";
}
function preparoTxt(inf, vol) {
  var f = inf.q / inf.amp, d = vol - f;
  if (d < 0.05) return mlNum(f) + " mL do fármaco puro (" + inf.apr + ")";
  return mlNum(f) + " mL do fármaco (" + inf.apr + ") + " + mlNum(d) + " mL de diluente";
}
// Vazão de bomba: duas casas abaixo de 10 mL/h (bomba de seringa), uma até 100, inteiro acima.
function vazNum(v) {
  if (!isFinite(v)) return "—";
  var a = Math.abs(v), d = a < 10 ? 2 : (a < 100 ? 1 : 0), s = trim0(nf(v, d));
  if (s === "0" && a > 0) s = trim0(nf(v, 3));
  return milhar(s);
}
function mlh(v) { return vazNum(v) + " mL/h"; }

/* ---------- 6. Choques ---------- */
var CH_FAIXA = { sep: [10, 20], ana: [10, 20], hipo: [20, 20], card: [5, 10], neu: [10, 20], obs: [10, 20] };
function cChoque() {
  var k = $("choqueSel").value, ch = CHOQUES[k], kg = P.peso, fx = CH_FAIXA[k].slice();
  if (ehNeo(P)) { fx[1] = Math.min(fx[1], 10); fx[0] = Math.min(fx[0], fx[1]); }
  set("chExp", faixaTxt(Math.min(fx[0] * kg, 1000), Math.min(fx[1] * kg, 1000), mlNum) + " mL");
  set("chExpCap", faixaTxt(fx[0], fx[1]) + " mL/kg por alíquota" + (ehNeo(P) ? " (recém-nascido: até 10 mL/kg)" : "") + ", no máximo 1.000 mL por vez. " + ch.ex);
  var lbl, val, cap;
  if (!ch.vaso) {
    lbl = "Vasoativo"; val = "Não é a primeira medida";
    cap = "Controlar a perda e repor volume ou hemocomponentes; vasoativo apenas como ponte.";
  } else if (ch.vaso.im) {
    var a = achar(REPERTORIO, "Adrenalina IM (anafilaxia)"), c = doseCalc(a.d, P);
    lbl = "Adrenalina IM, ampola de 1 mg/mL sem diluir";
    val = doseTxt(c) + " = " + volTxt(c, 1);
    cap = "0,01 mg/kg no vasto lateral da coxa" + (c.cap ? "; teto de 0,5 mg atingido" : "; teto de 0,5 mg") + ". " + ch.vaso.alt;
  } else {
    var vs = ehAdulto(P) && ch.vaso.adulto ? ch.vaso.adulto : ch.vaso;
    var inf = achar(INFUSOES, vs.n), v = vazao(inf, vs.dose, 50);
    lbl = inf.n + " a " + num(vs.dose) + " " + inf.un;
    val = mlh(v);
    cap = "Solução de " + num(inf.q) + " " + inf.uq + " em 50 mL (" + concTxt(inf, 50) + "). Faixa de " + faixaTxt(inf.f[0], inf.f[1]) + " " + inf.un + ": " + faixaTxt(vazao(inf, inf.f[0], 50), vazao(inf, inf.f[1], 50), vazNum) + " mL/h. " + vs.alt + (v < 0.5 ? " Vazão baixa para a bomba: usar a regra por peso da aba Diluições." : "");
  }
  set("chVasoLbl", lbl); set("chVaso", val); set("chVasoCap", cap);
  set("chTitulo", ch.t); set("chRecon", ch.r);
  var h = "";
  for (var i = 0; i < ch.d.length; i++) h += "<li>" + esc(ch.d[i]) + "</li>";
  setH("chDetail", h);
  var pam = pamAlvo(P.idade), f = faixaEtaria(P.idade), di = diureseMin();
  set("chAlvo", "Pressão arterial média " + pam.txt + "; sistólica de " + f.pas + " mmHg ou mais; enchimento capilar até 2 s; pulsos cheios; sensório normal; diurese de " + num(di) + " mL/kg/h ou mais (" + ml(di * kg) + "/h); lactato em queda.");
  var hd = doseCalc({ k: [2, 4], per: "dia", n: 4, maxDia: 200 }, P);
  set("chHidro", doseTxt(hd) + " a cada 6 h");
}

/* ---------- 7. Estado de mal ---------- */
function cMal() {
  set("mIM", dv({ k: 0.2, max: 10 }, 5, "da ampola 5 mg/mL"));
  set("mIN", dv({ k: 0.2, max: 10 }, 5, "da ampola 5 mg/mL, metade em cada narina"));
  set("mBuc", dv({ k: 0.3, max: 10 }, 5, "da ampola 5 mg/mL, entre a bochecha e a gengiva"));
  set("mIV", dv({ k: [0.1, 0.2], max: 10 }, 5, "da ampola 5 mg/mL"));
  if (ehNeo(P)) { set("mDzIV", "Evitar no recém-nascido: preferir fenobarbital ou midazolam"); set("mRet", "Evitar no recém-nascido: preferir fenobarbital ou midazolam"); }
  else {
    set("mDzIV", dv({ k: [0.15, 0.2], max: 10 }, 5, "da ampola 5 mg/mL, sem diluir, lento"));
    set("mRet", dv({ k: 0.5, max: 20 }, 5, "da ampola 5 mg/mL"));
  }
  set("mLev", dv({ k: [40, 60], max: 4500 }, 100, "do frasco 100 mg/mL"));
  var fen = doseCalc({ k: 20, max: 1500 }, P), vel = Math.min(P.peso, 50);
  set("mFen", doseTxt(fen) + (fen.cap ? " (teto)" : "") + " = " + volTxt(fen, 50) + " da ampola 50 mg/mL, em " + nf(Math.max(fen.hi / vel, 20), 0) + " min ou mais");
  set("mVal", (P.idade < 2 ? "Evitar em menores de 2 anos. Se indispensável: " : "") + dv({ k: [20, 40], max: 3000 }, 100, "do frasco 100 mg/mL"));
  set("mFb", dv({ k: [15, 20], max: 1000 }, 100, "da ampola 100 mg/mL"));
  var kg = P.peso;
  set("mCont", mlh(0.3 * kg) + " da solução de 1 mg/mL (50 mg em 50 mL); faixa de 1–10 mcg/kg/min: " + faixaTxt(0.06 * kg, 0.6 * kg, vazNum) + " mL/h");
}

/* ---------- 8. Trauma ---------- */
function cTrauma() {
  var kg = P.peso;
  set("trVol", faixaTxt(Math.min(10 * kg, 1000), Math.min(20 * kg, 1000), mlNum) + " mL");
  set("trTr", 10 * kg >= 300 ? "1–2 unidades" : faixaTxt(10 * kg, 20 * kg, mlNum) + " mL");
  var at = Math.min(15 * kg, 1000), man = Math.min(2 * kg, 125);
  set("trTxa", num(at) + " mg");
  set("trTxaCap", "Ataque em 10 min: " + ml(at / 50) + " da ampola 50 mg/mL, diluídos em SF (15 mg/kg, teto de 1 g). Depois " + num(man) + " mg/h por 8 h (2 mg/kg/h, teto de 125 mg/h).");
  set("trSH", faixaTxt(Math.min(2 * kg, 250), Math.min(5 * kg, 250), mlNum) + " mL");
  set("trMan", faixaTxt(0.5 * kg, kg) + " g = " + faixaTxt(2.5 * kg, 5 * kg, mlNum) + " mL");
}

/* ---------- 9. Intoxicações ---------- */
function cIntox() {
  var h = "";
  for (var i = 0; i < ANTIDOTOS.length; i++) {
    var it = ANTIDOTOS[i], r = calcItem(it);
    h += tr([it.n, it.ind, r.kg, K(r.dose), K(r.vol), N(it.ap, it.obs)]);
  }
  corpo("intoxTab", h);
  var kg = P.peso, g = Math.min(kg, 50);
  set("itCarv", num(g) + " g, em cerca de " + ml(g * 10) + " de água");
  var w = Math.min(kg, 100), f = [150, 50, 100], ids = ["itNac1", "itNac2", "itNac3"];
  for (i = 0; i < 3; i++) set(ids[i], num(f[i] * w) + " mg = " + ml(f[i] * w / 100) + " da ampola 100 mg/mL");
  var dil = kg <= 20 ? [3 * kg, 7 * kg, 14 * kg] : (kg <= 40 ? [100, 250, 500] : [200, 500, 1000]);
  set("itNacDil", "Diluir em SG 5%: fase 1 em " + ml(dil[0]) + ", fase 2 em " + ml(dil[1]) + ", fase 3 em " + ml(dil[2]) + "." + (kg > 100 ? " Dose calculada para 100 kg, que é o teto." : "") + " Reação anafilactoide na fase 1: pausar, anti-histamínico e reiniciar mais lento.");
  var tox = 150 * kg;
  set("itPara", tox >= 7500 ? "7,5 g ou mais" : (tox >= 1000 ? num(tox / 1000) + " g" : num(tox) + " mg"));
}

/* ---------- 10. Metabólicos ---------- */
function holliday(kg) {
  var d = kg <= 10 ? 100 * kg : (kg <= 20 ? 1000 + 50 * (kg - 10) : 1500 + 20 * (kg - 20));
  return Math.min(d, 2400);
}
function fracaoAgua(p) {
  if (ehNeo(p)) return 0.75;
  if (p.idade < 1) return 0.7;
  if (p.idade < 12) return 0.6;
  if (p.idade >= 65) return p.sexo === "F" ? 0.45 : 0.5;
  return p.sexo === "F" ? 0.5 : 0.6;
}
function cMetab() {
  var kg = P.peso;
  set("meIns", faixaTxt(0.05 * kg, 0.1 * kg) + " U/h = " + faixaTxt(0.05 * kg, 0.1 * kg, vazNum) + " mL/h");
  var fr = fracaoAgua(P), na = valorDe("coNa"), alvo = valorDe("coNaAlvo");
  if (isFinite(na) && isFinite(alvo) && alvo > na) {
    set("meNa", num(fr * kg * (alvo - na)) + " mEq");
    set("meNaCap", nf(fr, 2) + " × " + num(kg) + " kg × (" + num(alvo) + " − " + num(na) + "). Ajuste os valores de sódio na aba Correção.");
  } else {
    set("meNa", "—");
    set("meNaCap", "Informe sódio atual e sódio alvo (maior que o atual) na aba Correção.");
  }
  set("meExp", faixaTxt(Math.min(10 * kg, 1000), Math.min(20 * kg, 1000), mlNum) + " mL");
  var hs = holliday(kg) / 24;
  function hid(pct) { return hs + pct * 10 * kg / 48; }
  set("meHid", ehAdulto(P) ? "Adulto: SF 0,9% 15–20 mL/kg na 1ª hora e depois 250–500 mL/h, conforme sódio e volemia" :
    mlh(hid(7)) + " com déficit de 7% (5%: " + mlh(hid(5)) + "; 10%: " + mlh(hid(10)) + ")");
  set("meGlu", "Acrescentar glicose 5% quando a glicemia chegar a 250–300 mg/dL; 10% se preciso, sem reduzir a insulina");
  set("meEdema", "Manitol 20%: " + faixaTxt(2.5 * kg, 5 * kg, mlNum) + " mL (0,5–1 g/kg); ou NaCl 3%: " + faixaTxt(Math.min(2.5 * kg, 250), Math.min(5 * kg, 250), mlNum) + " mL (2,5–5 mL/kg, teto de 250 mL); em 10–15 min");
  var g = achar(CARTA, "g10");
  set("meG10", calcItem(g).dose + " (" + porKgTxt(g.d, P) + ")");
  var tig = P.idade < 1 ? [6, 8] : (P.idade < 12 ? [4, 6] : [2, 4]);
  set("meTig", ehAdulto(P) ? "75–100 mL/h, ajustando pela glicemia" : faixaTxt(tig[0] * 0.6 * kg, tig[1] * 0.6 * kg, vazNum) + " mL/h (" + tig[0] + "–" + tig[1] + " mg/kg/min)");
  set("meGluc", kg < 25 ? "0,5 mg (abaixo de 25 kg)" : "1 mg (25 kg ou mais)");
  set("meCa", resumo(CARTA, "caglu"));
  var ins = Math.min(0.1 * kg, 10), gl = Math.min(5 * kg, 250);
  set("meInsK", num(ins) + " U de insulina + " + ml(gl) + " de glicose 10%");
  set("meSalb", kg < 25 ? "2,5 mg = 0,5 mL da solução 5 mg/mL" : "5 mg = 1 mL da solução 5 mg/mL");
  var k = Math.min(0.5 * kg, 40);
  set("meK", num(k) + " mEq = " + ml(k / 2.56) + " de KCl 19,1% (ou " + ml(k / 1.34) + " de KCl 10%), em pelo menos " + ml(k / 40 * 1000) + " de soro na veia periférica");
}

/* ---------- 11. Diluições ---------- */
function infSel() { return INFUSOES[parseInt($("dvDrug").value, 10) || 0]; }
function aoTrocarFarmaco() {
  var inf = infSel();
  $("dvDose").value = String(inf.f[0]);
  cDil();
}
function cDil() {
  var kg = P.peso, h = "";
  var regras = [[0.3, 50, "0,1"], [3, 50, "1"], [0.6, 100, "0,1"], [6, 100, "1"]];
  for (var i = 0; i < regras.length; i++) {
    var r = regras[i];
    h += tr([num(r[0]) + " mg × peso", K(num(r[0] * kg) + " mg"), r[1] + " mL", r[2] + " mcg/kg/min"]);
  }
  corpo("dvRegra", h);
  var inf = infSel(), dose = valorDe("dvDose"), vol = parseFloat($("dvVol").value);
  set("dvDoseLbl", "Dose (" + inf.un + ")");
  set("dvDoseHlp", "Faixa usual: " + faixaTxt(inf.f[0], inf.f[1]) + " " + inf.un);
  var out = $("dvOut").parentNode;
  if (!isFinite(dose) || dose <= 0) {
    set("dvOut", "—"); set("dvCap", "Informe uma dose maior que zero.");
    out.className = "hero-result";
  } else {
    var v = vazao(inf, dose, vol), fora = dose < inf.f[0] - 1e-9 || dose > inf.f[1] + 1e-9;
    set("dvOut", mlh(v));
    var cap = inf.n + ": " + num(inf.q) + " " + inf.uq + " em " + vol + " mL (" + concTxt(inf, vol) + "). Preparo: " + preparoTxt(inf, vol) + " (" + inf.dil + "). Dose de " + num(dose) + " " + inf.un + " para " + num(kg) + " kg.";
    if (fora) cap += " ATENÇÃO: dose fora da faixa usual (" + faixaTxt(inf.f[0], inf.f[1]) + " " + inf.un + ").";
    if (v < 0.1) cap += " Vazão abaixo de 0,1 mL/h: usar solução mais diluída ou a regra por peso.";
    set("dvCap", cap);
    out.className = fora ? "hero-result crit" : "hero-result";
  }
  h = ""; var g = "";
  for (i = 0; i < INFUSOES.length; i++) {
    var f = INFUSOES[i];
    if (f.t !== g) { g = f.t; h += tr([{ t: g, span: 7 }], "grp"); }
    h += tr([f.n, num(f.q) + " " + f.uq + " em 50 mL (" + concTxt(f, 50) + ")", preparoTxt(f, 50) + "; " + f.dil,
      faixaTxt(f.f[0], f.f[1]) + " " + f.un,
      K(faixaTxt(vazao(f, f.f[0], 50), vazao(f, f.f[1], 50), vazNum) + " mL/h"),
      K(faixaTxt(vazao(f, f.f[0], 100), vazao(f, f.f[1], 100), vazNum) + " mL/h"), f.obs]);
  }
  corpo("dvTable", h);
}

/* ---------- 12 e 14. Repertório e posologias ---------- */
function calcRep(m) {
  var bloq = RESTRICAO[m.n] ? RESTRICAO[m.n](P) : null;
  if (bloq) return { kg: m.d ? porKgTxt(m.d, P) : "—", dose: /^[A-ZÀ-Ú]/.test(bloq) ? bloq : "Não usar: " + bloq, vol: "—", gotas: "—", teto: "—", bloq: true };
  if (m.f) { var x = m.f(P); x.bloq = /^(não|evitar|contraindicad|sem )/.test(x.dose); return x; }
  var c = doseCalc(m.d, P), vols = [], gts = [];
  for (var i = 0; i < m.v.length; i++) {
    var v = m.v[i];
    vols.push(volTxt(c, v.c) + " (" + v.r + ")");
    if (v.g) gts.push(gotasTxt(c, v.c, v.g) + " (" + v.r.replace(/^gotas /, "frasco de ") + ")");
  }
  return { kg: porKgTxt(m.d, P), dose: doseTxt(c) + (m.d.per === "dia" ? " por dose" : "") + (c.cap ? " (teto)" : "") + (c.minAp ? " (dose mínima)" : ""),
    vol: vols.length ? vols.join("; ") : "—", gotas: gts.length ? gts.join("; ") : "—", teto: tetoTxt(c), bloq: false };
}
function cRep() {
  var q = semAcento($("repBusca").value).replace(/^\s+|\s+$/g, ""), h = "", n = 0;
  for (var i = 0; i < REPERTORIO.length; i++) {
    var m = REPERTORIO[i];
    if (q && semAcento(m.n + " " + m.c + " " + m.ind + " " + m.ap).indexOf(q) < 0) continue;
    var r = calcRep(m); n++;
    var vg = r.vol + (r.gotas && r.gotas !== "—" ? "; " + r.gotas : "");
    h += tr([N(m.n, m.c), m.ap, m.ind, r.kg, { t: r.dose, c: r.bloq ? "critico" : "calc" }, K(vg), m.via + "; " + m.int + "; " + m.dur, r.teto, m.obs]);
  }
  corpo("repTab", h || tr([{ t: "Nenhum medicamento encontrado para esse termo.", span: 9 }]));
  set("repCont", n + " de " + REPERTORIO.length + " medicamentos. Volumes recalculados para " + num(P.peso) + " kg.");
}
function cPos() {
  var h = "", g = "";
  for (var i = 0; i < REPERTORIO.length; i++) {
    var m = REPERTORIO[i];
    if (!m.pos) continue;
    var r = calcRep(m);
    h += tr([m.n, m.c, r.kg, { t: r.dose, c: r.bloq ? "critico" : "calc" }, r.teto, K(r.vol), K(r.gotas), m.ap + ". " + m.via + ", " + m.int + "."]);
  }
  corpo("posTab", h);
}

/* ---------- 13. Antibióticos ---------- */
function atbDose(d) {
  var c = doseCalc(d, P), t = doseTxt(c);
  if (d.per === "dia") {
    t += " por dose";
    if (c.div > 1) t += " (" + qtdTxt(c.lo * c.div, c.hi * c.div, c.u) + "/dia)";
  } else t += " por dose";
  if (c.cap) t += ", no teto";
  return { kg: porKgTxt(d, P), dose: t, teto: tetoTxt(c) };
}
function cAtb() {
  var s = SINDROMES[$("atbSind").value], h = "";
  set("atbTit", s.t);
  set("atbNota", (ehNeo(P) && $("atbSind").value !== "neo" ? "PACIENTE RECÉM-NASCIDO: doses e intervalos são próprios do período neonatal; usar a síndrome Sepse neonatal e o protocolo da unidade. " : "") + s.nota);
  for (var i = 0; i < s.linhas.length; i++) {
    var l = s.linhas[i], nome, kg, dose, teto;
    if (l.f) {
      var x = l.f(P); nome = l.n; kg = x.kg; dose = x.dose; teto = x.teto;
    } else if (l.comp) {
      var ns = [], ks = [], ds = [], ts = [];
      for (var j = 0; j < l.comp.length; j++) {
        var c = l.comp[j], a = atbDose(c.d), curto = c.n.replace(/^(\+|ou) /, "");
        ns.push(c.n); ks.push(curto + " " + a.kg); ds.push(curto + ": " + a.dose); ts.push(curto + ": " + a.teto);
      }
      nome = ns.join(" "); kg = ks.join("; "); dose = ds.join("; ");
      teto = ts.join("; ");
      if (!/\d/.test(teto)) teto = "—";
    } else {
      var b = atbDose(l.d); nome = l.n; kg = b.kg; dose = b.dose; teto = b.teto;
    }
    h += tr([l.l, nome, kg, K(dose), teto, l.int, l.via, l.dur, l.renal, l.esp]);
  }
  corpo("atbTab", h);
}

/* ---------- 15. Soroterapia ---------- */
function cSoro() {
  var kg = P.peso, neo = ehNeo(P);
  set("soExp", ml(Math.min((neo ? 10 : 20) * kg, 1000)));
  var d = holliday(kg), bruto = kg <= 10 ? 100 * kg : (kg <= 20 ? 1000 + 50 * (kg - 10) : 1500 + 20 * (kg - 20));
  set("soMan", mlh(d / 24));
  set("soManCap", num(d) + " mL/dia por Holliday-Segar" + (bruto > 2400 ? " (teto de 2.400 mL/dia)" : "") + ". " + gotasMacro(d / 24) + " em macrogotas; " + gotasMicro(d / 24) + "." +
    (neo ? " No recém-nascido, usar a taxa hídrica por dia de vida: 60–80 mL/kg/dia no 1º dia, subindo 10–20 mL/kg/dia até 150." : ""));
  var a = 4 * Math.min(kg, 10), b = 2 * clamp(kg - 10, 0, 10), c = Math.max(kg - 20, 0), t = a + b + c;
  set("so421a", mlh(a)); set("so421b", mlh(b)); set("so421c", mlh(c));
  set("so421t", mlh(Math.min(t, 100)) + (t > 100 ? " (teto)" : "") + "; " + gotasMacro(Math.min(t, 100)));
  var na = valorDe("soNa"), k = valorDe("soK");
  if (!isFinite(na) || na < 0 || !isFinite(k) || k < 0) {
    set("soVol", "—"); set("soNaF", "—"); set("soKF", "—"); set("soGli", "—");
    set("soTon", "Informe valores de zero ou mais nos dois campos.");
  } else {
    var vn = na / 3.4, vk = k / 2.56, tot = 500 + vn + vk, naF = na / tot * 1000, kF = k / tot * 1000;
    set("soVol", ml(vn) + " de NaCl 20% e " + ml(vk) + " de KCl 19,1%");
    set("soNaF", nf(naF, 0) + " mEq/L");
    set("soKF", nf(kF, 0) + " mEq/L");
    set("soGli", nf(25 / tot * 100, 1) + "% em " + nf(tot, 0) + " mL");
    var naR = Math.round(naF);
    var m = naR < 130 ? "Solução hipotônica (sódio abaixo de 130 mEq/L): não usar como manutenção habitual, pelo risco de hiponatremia." :
      (naR <= 160 ? "Solução isotônica: adequada para manutenção de 28 dias a 18 anos." : "Solução hipertônica (sódio acima de 160 mEq/L): conferir a prescrição.");
    if (kF > 40) m += " Potássio acima de 40 mEq/L: só com monitor e, de preferência, em acesso central.";
    if (k === 0) m += " Sem potássio: adequado apenas enquanto não houver diurese ou se o potássio estiver alto.";
    set("soTon", m);
  }
  set("soPlA", P.idade < 1 ? "50–100 mL" : (P.idade <= 10 ? "100–200 mL" : "O quanto aceitar"));
  set("soPlB", faixaTxt(50 * kg, 100 * kg, mlNum) + " mL (50–100 mL/kg)" + (kg > 40 ? "; no adulto, ajustar à sede e à aceitação" : ""));
  set("soPlC", neo ? ml(10 * kg) + " (10 mL/kg) e reavaliar" :
    (P.idade < 1 ? ml(30 * kg) + " em 1 h e " + ml(70 * kg) + " em 5 h" : ml(30 * kg) + " em 30 min e " + ml(70 * kg) + " em 2 h 30 min") + " (30 + 70 mL/kg)");
  var tx = P.idade < 13 ? (kg <= 10 ? 130 : (kg <= 20 ? 100 : 80)) : 60, oral = tx * kg;
  set("dgOral", ml(oral) + " (" + tx + " mL/kg/dia), sendo " + ml(oral / 3) + " de soro de reidratação oral");
  set("dgC", ml(10 * kg) + " (10 mL/kg)");
  set("dgCman", ml(25 * kg) + " em 6 h (" + mlh(25 * kg / 6) + "); depois " + ml(25 * kg) + " em 8 h (" + mlh(25 * kg / 8) + ")");
  set("dgD", ml(20 * kg) + " (20 mL/kg)");
}

/* ---------- 16. Correção ---------- */
function cCorr() {
  var kg = P.peso, fr = fracaoAgua(P), agua = fr * kg;
  set("coFrac", nf(fr * 100, 0) + "% do peso");
  set("coAgua", nf(agua, 1) + " L");
  var na = valorDe("coNa"), alvo = valorDe("coNaAlvo");
  var maxDia = agua * 8;
  set("coVel", "Até " + num(maxDia) + " mEq em 24 h = " + mlh(maxDia / 0.513 / 24) + " de NaCl 3%");
  set("coBolus", faixaTxt(Math.min(3 * kg, 150), Math.min(5 * kg, 150), mlNum) + " mL em 10–20 min (3–5 mL/kg, teto de 150 mL)");
  var base = "NaCl 3% = 0,513 mEq/mL. Preparo de 100 mL: 15 mL de NaCl 20% + 85 mL de água destilada, ou 30 mL de NaCl 10% + 70 mL de água destilada.";
  if (!isFinite(na) || !isFinite(alvo)) {
    set("coDef", "—"); set("coVol3", "—"); set("coAviso", "Informe sódio atual e sódio alvo. " + base);
  } else if (alvo <= na) {
    set("coDef", "Sem déficit a calcular"); set("coVol3", "—");
    set("coAviso", "O sódio alvo deve ser maior que o atual. " + base);
  } else {
    var def = agua * (alvo - na);
    set("coDef", num(def) + " mEq");
    set("coVol3", ml(def / 0.513));
    set("coAviso", (alvo - na > 8 ? "O alvo está mais de 8 mEq/L acima do atual: programar essa correção em mais de 24 h. " : "") + base);
  }
  var h = "";
  function linha(ion, spec, sol, conc, como, kgTxt) {
    var c = doseCalc(spec, P);
    h += tr([ion, kgTxt || porKgTxt(spec, P), K(doseTxt(c) + (c.cap ? " (teto)" : "")), sol, K(conc ? volTxt(c, conc) : doseTxt(c)), como]);
  }
  var s3 = doseCalc({ k: [3, 5], max: 150, u: "mL" }, P);
  h += tr(["Sódio (hiponatremia com sintomas graves)", "3–5 mL/kg", K(faixaTxt(s3.lo * 0.513, s3.hi * 0.513) + " mEq"), "NaCl 3% (0,513 mEq/mL)", K(doseTxt(s3)), "Em 10–20 min; pode repetir até 2 vezes, para subir 4–6 mEq/L"]);
  linha("Potássio", { k: [0.5, 1], max: 40, u: "mEq", unica: true }, "KCl 19,1% (2,56 mEq/mL)", 2.56, "Em 1–2 h, até 0,5 mEq/kg/h, diluído (até 40 mEq/L em veia periférica)");
  linha("Cálcio", { k: [50, 100], max: 2000, unica: true }, "Gluconato de cálcio 10% (100 mg/mL)", 100, "Em 10–20 min, com monitor; 1 mL tem 9,3 mg de cálcio elementar");
  linha("Magnésio", { k: [25, 50], max: 2000, unica: true }, "Sulfato de magnésio 10% (100 mg/mL)", 100, "Em 2–4 h na hipomagnesemia; em 15–20 min se houver arritmia ou convulsão");
  linha("Fósforo", { k: [0.15, 0.33], u: "mmol", unica: true }, "Fosfato de potássio 2 mEq/mL (1,1 mmol de fósforo por mL)", 1.1, "Em 6 h; cada mL leva 2 mEq de potássio; não misturar com cálcio");
  linha("Bicarbonato", { k: [1, 2], u: "mEq", unica: true }, "Bicarbonato de sódio 8,4% (1 mEq/mL)", 1, "Lento, diluído 1:1 em água destilada; déficit = 0,3 × peso × excesso de base, repor metade");
  corpo("coTab", h);
}

/* ---------- 17. Ventilação ---------- */
var VM_FAIXAS = [
  ["neo", "Recém-nascido", "4–6", "5–6 cmH₂O", "40–60/min", "0,30–0,40 s", "6–8 L/min (fluxo contínuo)", "A menor para SpO₂ 90–95%", "Fluxo 0,5–1 L/min"],
  ["lac", "Lactente (1–12 meses)", "6–8", "5 cmH₂O", "25–40/min", "0,5–0,6 s", "Ajustado ao tempo inspiratório", "Iniciar em 1,0 e reduzir para SpO₂ 92–97%", "Fluxo 1–2 L/min ou pressão −1 a −2 cmH₂O"],
  ["pre", "Criança de 1–5 anos", "6–8", "5 cmH₂O", "20–30/min", "0,6–0,8 s", "Ajustado ao tempo inspiratório", "Iniciar em 1,0 e reduzir para SpO₂ 92–97%", "Fluxo 1–2 L/min ou pressão −1 a −2 cmH₂O"],
  ["esc", "Escolar (6–11 anos)", "6–8", "5 cmH₂O", "16–25/min", "0,8–1,0 s", "Ajustado ao tempo inspiratório", "Iniciar em 1,0 e reduzir para SpO₂ 92–97%", "Fluxo 2 L/min ou pressão −2 cmH₂O"],
  ["adu", "Adolescente e adulto", "6 (4–8) do peso predito", "5–8 cmH₂O", "12–20/min", "0,9–1,2 s", "40–60 L/min em volume controlado", "Iniciar em 1,0 e reduzir para SpO₂ 92–96%", "Fluxo 2–3 L/min ou pressão −2 cmH₂O"]
];
function cVm() {
  var alt = valorDe("vmAlt"), temAlt = isFinite(alt) && alt >= 100 && alt <= 230, peso, cap;
  if (P.idade >= 12 && (temAlt || P.idade >= 16)) {
    var padrao = P.sexo === "F" ? 160 : 170, a = temAlt ? alt : padrao;
    peso = (P.sexo === "F" ? 45.5 : 50) + 0.91 * (a - 152.4);
    cap = "Peso predito para " + num(a) + " cm, sexo " + sexoTxt(P) + ": " + (P.sexo === "F" ? "45,5" : "50") + " + 0,91 × (altura − 152,4)." +
      (temAlt ? "" : " Altura não informada: usada a altura típica de " + padrao + " cm. Informe a altura real.");
  } else {
    peso = P.peso;
    cap = "Na criança, usar o peso real; se obesa, o peso ideal para a estatura.";
  }
  set("vmPeso", nf(peso, 1) + " kg"); set("vmPesoCap", cap);
  set("vmVt", ml(6 * peso));
  set("vmVtCap", "Faixa de 4–8 mL/kg: " + faixaTxt(4 * peso, 8 * peso, mlNum) + " mL. Na criança, 6–8 mL/kg: " + faixaTxt(6 * peso, 8 * peso, mlNum) + " mL.");
  var k = faixaEtaria(P.idade).k, alvo = k === "c12" ? "pre" : (k === "ado" ? "adu" : k), h = "";
  for (var i = 0; i < VM_FAIXAS.length; i++) h += tr(VM_FAIXAS[i].slice(1), VM_FAIXAS[i][0] === alvo ? "atual" : "");
  corpo("vmTab", h);
}

/* ---------- 18. VNI ---------- */
function cVni() {
  var k = faixaEtaria(P.idade).k, kg = P.peso, grande = P.idade >= 12;
  set("vnI", grande ? "10–12 cmH₂O" : "8–10 cmH₂O");
  set("vnE", grande ? "4–5 cmH₂O (8–10 no edema agudo de pulmão)" : "4–5 cmH₂O");
  set("vnFr", k === "neo" || k === "lac" ? "25–30/min" : (k === "c12" || k === "pre" ? "20–25/min" : (k === "esc" ? "15–20/min" : "12–16/min")));
  var fl = kg < 13 ? 2 * kg : (kg < 16 ? 30 : (kg < 31 ? 35 : (kg < 51 ? 40 : 50)));
  set("vnCnaf", num(fl) + " L/min" + (kg < 13 ? " (2 L/kg/min)" : ""));
}

/* ---------- 21. Diagnóstico ---------- */
function cDiag() {
  var marc = {}, n = 0;
  cada($("diagChecks").getElementsByTagName("input"), function (c) { if (c.checked) { marc[c.value] = true; n++; } });
  if (!n) { setH("diagOut", '<p class="helper">Marque ao menos um sinal ou sintoma para ver as hipóteses.</p>'); return; }
  var lista = [];
  for (var i = 0; i < HIPOTESES.length; i++) {
    var hp = HIPOTESES[i], m = 0;
    for (var j = 0; j < hp.sinais.length; j++) if (marc[hp.sinais[j]]) m++;
    if (m) lista.push({ h: hp, m: m, f: m / hp.sinais.length, i: i });
  }
  lista.sort(function (a, b) { return b.m - a.m || b.f - a.f || a.i - b.i; });
  if (!lista.length) { setH("diagOut", '<p class="helper">Nenhuma síndrome da lista combina com os achados marcados.</p>'); return; }
  var h = "";
  for (i = 0; i < lista.length && i < 5; i++) {
    var x = lista[i], p = x.h;
    h += '<div class="hip"><h4>' + (i + 1) + ". " + esc(p.sind) + " <small>" + esc(p.sis) + "; " + x.m + " de " + p.sinais.length + " achados</small></h4><dl>" +
      "<dt>Etiologias</dt><dd>" + esc(p.etio) + "</dd><dt>Confirmam</dt><dd>" + esc(p.conf) + "</dd><dt>Afastam</dt><dd>" + esc(p.afasta) + "</dd>" +
      "<dt>Exames</dt><dd>" + esc(p.exame) + "</dd><dt>Próximos passos</dt><dd>" + esc(p.prox) + "</dd></dl></div>";
  }
  setH("diagOut", h);
}

/* ---------- 22. Gasometria ---------- */
function cGaso() {
  var na = valorDe("gaNa"), cl = valorDe("gaCl"), hco = valorDe("gaHco"), gl = valorDe("gaGlic");
  if (!isFinite(na) || !isFinite(cl) || !isFinite(hco)) {
    set("gaAG", "—"); set("gaDD", "—"); set("gaWinter", "—"); set("gaInt", "Informe sódio, cloro e bicarbonato.");
  } else {
    var ag = na - (cl + hco), m = [];
    set("gaAG", nf(ag, 1) + " mEq/L");
    m.push(ag > 12 ? "Ânion gap alto: acidose lática, cetoacidose, insuficiência renal ou intoxicação." : (ag < 8 ? "Ânion gap baixo: conferir albumina e possíveis erros de medida." : "Ânion gap normal."));
    if (ag > 12 && hco < 24) {
      var dd = (ag - 12) / (24 - hco);
      set("gaDD", nf(dd, 2));
      m.push(dd < 0.4 ? "Delta-delta abaixo de 0,4: acidose hiperclorêmica predominante." : (dd < 0.8 ? "Delta-delta de 0,4–0,8: acidose mista, de ânion gap alto com hiperclorêmica." : (dd <= 2 ? "Delta-delta de 0,8–2: acidose de ânion gap alto isolada." : "Delta-delta acima de 2: alcalose metabólica associada.")));
    } else set("gaDD", "Não se aplica");
    if (hco < 22) {
      var w = 1.5 * hco + 8;
      set("gaWinter", nf(w - 2, 0) + "–" + nf(w + 2, 0) + " mmHg");
      m.push("PaCO₂ acima do esperado indica acidose respiratória associada; abaixo, alcalose respiratória.");
    } else set("gaWinter", "Não se aplica (bicarbonato de 22 mEq/L ou mais)");
    set("gaInt", m.join(" "));
  }
  if (isFinite(na) && isFinite(gl)) set("gaNaC", gl > 100 ? nf(na + 1.6 * (gl - 100) / 100, 1) + " mEq/L" : nf(na, 1) + " mEq/L (glicemia até 100: sem correção)");
  else set("gaNaC", "—");
}

/* ---------- 23. Imagens ---------- */
function analisar() {
  var t = $("imgTexto").value.toLowerCase(), h = "";
  if (!t.replace(/\s/g, "")) { setH("imgOut", '<p class="helper">Descreva o exame no campo acima.</p>'); return; }
  for (var i = 0; i < ACHADOS.length; i++) if (ACHADOS[i][0].test(t)) h += "<li>" + esc(ACHADOS[i][1]) + "</li>";
  setH("imgOut", h ? "<ul>" + h + "</ul>" : '<p class="helper">Nenhum termo reconhecido. Use palavras do laudo, como consolidação, derrame, pneumotórax, cardiomegalia, níveis hidroaéreos, supra de ST ou QT longo.</p>');
}

/* ---------- 24. Receita de alta ---------- */
function linhaParacetamol() {
  var kg = P.peso, teto = P.idade < 12 ? 35 : 55;
  var n = Math.max(1, Math.min(Math.round(kg), Math.floor(15 * kg / (200 / 15)), teto));
  return "Paracetamol gotas 200 mg/mL: dar " + n + (n === 1 ? " gota" : " gotas") + " pela boca a cada 6 horas se houver febre (37,8 °C ou mais) ou dor. Não passar de 5 doses em 24 horas.";
}
function linhaDipirona() {
  if (P.idade < 0.25 || P.peso < 5) return null;
  var n = Math.max(1, Math.min(Math.round(0.4 * P.peso), 40));
  return "Dipirona gotas 500 mg/mL: dar " + n + (n === 1 ? " gota" : " gotas") + " pela boca a cada 6 horas se houver febre ou dor.";
}
function linhasFebre(L) {
  var d = linhaDipirona();
  L.push(linhaParacetamol());
  if (d) { L.push("OU"); L.push(d); L.push("Escolher um dos dois. Não é preciso alternar os remédios."); }
  if ($("altIbu").checked) {
    if (P.idade < 0.5) L.push("Ibuprofeno: não usar antes dos 6 meses de idade.");
    else {
      var n = Math.min(Math.round(P.peso), P.idade < 12 ? 20 : 40);
      L.push("Ibuprofeno gotas 100 mg/mL: dar " + n + " gotas pela boca a cada 8 horas, depois de comer, por no máximo 3 dias. No frasco de 50 mg/mL, dar " + 2 * n + " gotas. Não usar se houver suspeita de dengue.");
    }
  }
}
function receita() {
  var cen = $("altCen").value, L = [], kg = P.peso, a = P.idade;
  if (cen === "sib" && a < 1) cen = "bronq";
  var tit = { febre: "Febre e dor", ivas: "Resfriado e tosse", gea: "Diarreia e vômitos", sib: "Crise de chiado", bronq: "Bronquiolite (chiado no bebê)" }[cen];
  if (P.exemplo) { L.push("ATENÇÃO: PACIENTE DE EXEMPLO. Informe o peso e a idade reais no topo da página antes de usar esta receita."); L.push(""); }
  L.push("RECEITA E ORIENTAÇÕES DE ALTA: " + tit);
  L.push("Peso: " + num(kg) + " kg. Idade: " + idadeNorm(a) + ". Data: " + dataTxt() + ".");
  L.push("");
  var lav = a < 1 ? 5 : (a < 6 ? 10 : 20);
  if (cen === "febre") {
    L.push("Remédios"); linhasFebre(L); L.push("");
    L.push("Cuidados");
    L.push("- Oferecer líquidos várias vezes ao dia e manter a alimentação habitual.");
    L.push("- Roupas leves e ambiente arejado. Não dar banho frio nem usar álcool na pele.");
    L.push("- Não dar ácido acetilsalicílico (AAS). Na suspeita de dengue, também não dar anti-inflamatórios.");
    L.push("");
    L.push("Voltar imediatamente se houver");
    L.push("- Dificuldade para respirar, gemência ou lábios arroxeados.");
    L.push("- Sonolência excessiva, irritabilidade que não melhora ou convulsão.");
    L.push("- Manchas vermelhas ou roxas na pele que não somem ao apertar.");
    L.push("- Recusa de líquidos, vômitos repetidos ou mais de 8 horas sem urinar.");
    L.push("- Dor forte na barriga, sangramento ou rigidez na nuca.");
    L.push("- Febre por mais de 3 dias, ou qualquer febre em bebê com menos de 3 meses.");
    L.push(""); L.push("Retorno: reavaliar em 48 a 72 horas se a febre continuar.");
  } else if (cen === "ivas") {
    L.push("Tratamento");
    L.push("1. Lavagem nasal com soro fisiológico 0,9%: " + lav + " mL em cada narina, com seringa, 3 a 6 vezes ao dia, principalmente antes de mamar ou comer e antes de dormir.");
    L.push("2. Depois da lavagem, spray nasal de cloreto de sódio 3%: 1 a 2 jatos em cada narina, 3 vezes ao dia.");
    L.push(a >= 1 ? "3. Para a tosse: mel, meia colher de chá (2,5 mL) à noite." : "3. Não dar mel a menores de 1 ano.");
    L.push("4. Se houver febre ou dor:"); linhasFebre(L); L.push("");
    L.push("Cuidados");
    L.push("- Oferecer líquidos e manter a alimentação. Deixar a cabeceira um pouco elevada.");
    L.push("- Manter a criança longe de fumaça de cigarro.");
    L.push("- Não usar xarope para tosse, descongestionante ou antialérgico sem receita médica.");
    L.push("");
    L.push("Voltar imediatamente se houver");
    L.push("- Respiração rápida ou com esforço, chiado ou lábios arroxeados.");
    L.push("- Febre por mais de 3 dias, ou febre que volta depois de um dia sem febre.");
    L.push("- Dor de ouvido, recusa de líquidos ou sonolência excessiva.");
    L.push("- Qualquer febre em bebê com menos de 3 meses.");
    L.push(""); L.push("Retorno: reavaliar se não houver melhora em 5 a 7 dias.");
  } else if (cen === "gea") {
    var sro = a < 1 ? "50 a 100 mL" : (a <= 10 ? "100 a 200 mL" : "o quanto aceitar");
    L.push("Tratamento");
    L.push("1. Soro de reidratação oral: oferecer " + sro + " depois de cada evacuação ou vômito, em pequenos goles, com colher ou seringa. Se vomitar, esperar 10 minutos e recomeçar mais devagar.");
    L.push("2. Manter o leite materno e a alimentação habitual. Não dar refrigerante, suco de caixinha nem bebida isotônica.");
    var i = 3;
    if (a < 5) L.push(i++ + ". Zinco: " + (a < 0.5 ? 10 : 20) + " mg pela boca, 1 vez ao dia, por 10 a 14 dias.");
    if (a >= 0.5 && kg >= 8) {
      var mg = kg <= 15 ? 2 : (kg <= 30 ? 4 : 8);
      L.push(i++ + ". Ondansetrona " + mg + " mg (" + (mg === 2 ? "meio comprimido de 4 mg" : "1 comprimido de " + mg + " mg") + " que dissolve na boca): 1 dose se os vômitos impedirem o soro; repetir depois de 8 horas somente se os vômitos voltarem. Uso off label na gastroenterite.");
    }
    L.push(i++ + ". Se houver febre ou dor:"); linhasFebre(L); L.push("");
    L.push("Não usar remédio para prender o intestino.");
    L.push("");
    L.push("Voltar imediatamente se houver");
    L.push("- Piora da diarreia ou vômitos repetidos.");
    L.push("- Muita sede, boca seca, olhos fundos ou choro sem lágrimas.");
    L.push("- Recusa de líquidos ou pouca urina.");
    L.push("- Sangue nas fezes.");
    L.push("- Sonolência excessiva ou febre que não cede.");
    L.push(""); L.push("Retorno: reavaliar em 48 horas se a diarreia continuar.");
  } else if (cen === "bronq") {
    L.push("Tratamento");
    L.push("1. Lavagem nasal com soro fisiológico 0,9%: 5 mL em cada narina, com seringa, antes de mamar e antes de dormir.");
    L.push("2. Oferecer o peito ou a mamadeira em menor quantidade e mais vezes ao dia.");
    L.push("3. Se houver febre:"); L.push(linhaParacetamol());
    L.push("");
    L.push("Cuidados");
    L.push("- Deixar a cabeceira um pouco elevada e o bebê longe de fumaça de cigarro.");
    L.push("- Lavar as mãos antes de pegar o bebê e evitar contato com pessoas resfriadas.");
    L.push("- Não usar xarope, bombinha ou corticoide sem receita médica.");
    L.push("");
    L.push("Voltar imediatamente se houver");
    L.push("- Respiração rápida, gemência, ou afundamento entre as costelas ou no pescoço.");
    L.push("- Pausas na respiração ou lábios arroxeados.");
    L.push("- Mamar menos da metade do habitual, ou poucas fraldas molhadas.");
    L.push("- Sonolência excessiva ou febre em bebê com menos de 3 meses.");
    L.push(""); L.push("Retorno: reavaliar em 24 a 48 horas. O chiado costuma piorar até o 3º ao 5º dia e a tosse pode durar 2 a 3 semanas.");
  } else {
    var pred = Math.min(kg, a < 2 ? 20 : (a < 6 ? 30 : (a < 12 ? 40 : 50)));
    L.push("Tratamento");
    L.push("1. Salbutamol spray 100 mcg, sempre com espaçador" + (a < 5 ? " e máscara" : "") + ": 4 jatos, um de cada vez, com 10 respirações em cada jato. Fazer a cada 4 horas por 2 dias; depois, a cada 6 horas por mais 3 dias. Agitar o frasco antes de cada jato. Bebês pequenos: 2 jatos.");
    L.push("2. Prednisolona 3 mg/mL: dar " + mlNum(pred / 3) + " mL pela boca, 1 vez ao dia, pela manhã, por 5 dias.");
    L.push("3. Lavagem nasal com soro fisiológico 0,9%: " + lav + " mL em cada narina, 3 a 6 vezes ao dia.");
    L.push("");
    L.push("Cuidados");
    L.push("- Manter a criança longe de fumaça de cigarro, poeira e cheiros fortes.");
    L.push("- Oferecer líquidos e manter a alimentação.");
    L.push("");
    L.push("Voltar imediatamente se houver");
    L.push("- Respiração rápida, ou afundamento entre as costelas ou no pescoço.");
    L.push("- Dificuldade para falar, mamar ou andar.");
    L.push("- Lábios arroxeados ou sonolência.");
    L.push("- Necessidade do salbutamol antes de 3 horas, ou falta de melhora depois dele.");
    L.push(""); L.push("Retorno: reavaliar em 24 a 48 horas e manter o acompanhamento na unidade de saúde.");
  }
  L.push(""); L.push("Em caso de piora, voltar à unidade ou ligar 192 (SAMU).");
  L.push(""); L.push("Médico: ____________________  CRM: __________");
  return L.join("\n");
}
function cAlta() {
  set("altPeso", num(P.peso) + " kg");
  set("altIdade", idadeNorm(P.idade));
  set("altCopy", receita());
  var cen = $("altCen").value, a = P.idade, nota = "";
  if (a < 0.25 && cen !== "gea") nota = "Menor de 3 meses: febre ou sintoma respiratório pede avaliação completa e, em geral, observação ou internação antes da alta.";
  else if (cen === "sib" && a < 1) nota = "Menor de 1 ano: o texto segue as orientações de bronquiolite, sem broncodilatador nem corticoide de rotina.";
  else if (cen === "sib" && a < 2) nota = "Entre 1 e 2 anos, o primeiro episódio de chiado também pode ser bronquiolite: confirme a indicação de salbutamol e de corticoide.";
  else if (cen === "gea" && a < 0.25) nota = "Menor de 3 meses com diarreia: avaliar hidratação com cuidado e considerar observação antes da alta.";
  set("altNota", nota); mostra($("altNota"), !!nota);
}

/* ---------- 25. Documentos ---------- */
var docEstado = {};
// Com o paciente de exemplo, peso, idade e sexo ficam como marcadores: só entram dados reais.
function modeloTxt(k) {
  var x = DOCS[k].x;
  if (!P.exemplo) x = x.split("[PESO]").join(num(P.peso)).split("[IDADE]").join(idadeNorm(P.idade)).split("[SEXO]").join(sexoTxt(P));
  return x.split("[DATA HORA]").join(dataTxt(true)).split("[DATA]").join(dataTxt()).split("[HORA]").join(horaTxt());
}
function cDocs() {
  var k = $("docSel").value, st = docEstado[k], ta = $("docTxt"), assin = pacienteTxt();
  set("docTit", DOCS[k].t);
  if (!st || !st.sujo) {
    var t = modeloTxt(k);
    if (ta.value !== t) ta.value = t;
    docEstado[k] = { txt: t, sujo: false, pac: assin };
    set("docAviso", "Paciente de exemplo: informe o peso e a idade no topo da página para preencher o modelo.");
    mostra($("docAviso"), P.exemplo);
  } else {
    if (ta.value !== st.txt) ta.value = st.txt;
    set("docAviso", "Os dados do paciente mudaram depois da sua edição. Use \"Restaurar modelo\" para atualizar peso e idade.");
    mostra($("docAviso"), st.pac !== assin);
  }
}

/* ---------- cabeçalho de impressão ---------- */
var abaAtual = "t-painel", ROTULOS = {};
function cPrint() {
  set("printHead", "");
  $("printHead").innerHTML = "<b>Emergência &amp; UTI: " + esc(ROTULOS[abaAtual] || "") + "</b><br>Paciente: " + esc(pacienteTxt()) + ". Faixa " + esc(zona(P.peso).nome.toLowerCase()) +
    ". Impresso em " + esc(dataTxt(true)) + ". Conferir cada dose antes de administrar (tripla checagem)." + (P.exemplo ? " PACIENTE DE EXEMPLO: dados não informados." : "");
}

/* ---------- recálculo geral ---------- */
var CALCS = [["Painel", cPainel], ["Estabilização", cEstab], ["Sala vermelha", cSala], ["Via aérea", cVia], ["PCR", cPcr], ["Choques", cChoque],
  ["Estado de mal", cMal], ["Trauma", cTrauma], ["Intoxicações", cIntox], ["Metabólicos", cMetab], ["Diluições", cDil], ["Repertório", cRep],
  ["Antibióticos", cAtb], ["Posologias", cPos], ["Soroterapia", cSoro], ["Correção", cCorr], ["Ventilação", cVm], ["VNI", cVni],
  ["Sedação para procedimento", cProced], ["Doses tóxicas", cToxicos], ["Modos ventilatórios", cModos],
  ["Trilhas de soroterapia", cTrilhas], ["Plano gradual", cPlano], ["Preparo de soro", cPreparo],
  ["Gasometria", cGaso], ["Receita de alta", cAlta], ["Documentos", cDocs], ["Impressão", cPrint]];
window.__erros = [];
function recalc() {
  var falhas = [];
  for (var i = 0; i < CALCS.length; i++) {
    try { CALCS[i][1](); } catch (e) { falhas.push(CALCS[i][0]); window.__erros.push(CALCS[i][0] + ": " + (e && e.message)); if (window.console) console.error(CALCS[i][0], e); }
  }
  if (falhas.length) {
    var av = $("pacAviso");
    av.className = "aviso erro"; mostra(av, true);
    av.textContent = "Falha interna ao calcular: " + falhas.join(", ") + ". Não use os valores dessas abas; recarregue a página.";
  }
}

/* ---------- paciente ---------- */
function lerPaciente() {
  var pv = valorDe("peso"), okP = isFinite(pv) && pv >= 0.4 && pv <= 250;
  var id = parseIdade($("idade").value), av = $("pacAviso");
  $("peso").className = okP ? "" : "invalido";
  $("idade").className = id.ok ? "" : "invalido";
  P.sexo = $("sexo").value === "F" ? "F" : "M";
  if (!okP || !id.ok) {
    document.body.className = "sem-paciente";
    av.className = "aviso erro"; mostra(av, true);
    av.textContent = !okP ? "Informe um peso entre 0,4 e 250 kg. Os cálculos ficam suspensos até lá." : "Idade não reconhecida. Exemplos: 4 anos, 18 meses, 20 dias, RN. Os cálculos ficam suspensos até lá.";
    set("pacPeso", okP ? num(pv) + " kg" : "Peso?");
    set("pacTxt", "Dados incompletos. Toque para corrigir");
    $("topbar").className = "topbar no-print aberta";
    $("pacResumo").setAttribute("aria-expanded", "true");
    return false;
  }
  document.body.className = "";
  P.peso = pv; P.idade = id.anos; P.idadeTxt = $("idade").value; P.idadeOk = true;
  var z = zona(P.peso), f = faixaEtaria(P.idade);
  $("topbar").style.setProperty ? $("topbar").style.setProperty("--zona", z.cor) : 0;
  $("zonaBar").style.background = z.cor;
  set("pacZona", "Faixa " + z.nome.toLowerCase());
  set("pacIdade", "Idade lida: " + idadeNorm(P.idade) + ". " + f.nome + ".");
  set("pacPeso", num(P.peso) + " kg");
  set("pacTxt", idadeNorm(P.idade) + ", " + sexoTxt(P) + (P.exemplo ? " (exemplo)" : "") + ". Toque para editar");
  mostra($("pacExemplo"), P.exemplo);
  var inc = incoerencia(P);
  if (inc) {
    av.className = "aviso"; mostra(av, true);
    av.innerHTML = "Peso e idade não combinam: para " + esc(idadeNorm(P.idade)) + ", o esperado é perto de " + esc(num(inc.esperado)) + " kg. Confira os dois campos. " +
      '<button class="btn-m" type="button" id="btnIdadeTip">Usar idade típica de ' + esc(num(P.peso)) + " kg: " + esc(inc.tipica) + "</button>";
    $("btnIdadeTip").onclick = function () { $("idade").value = inc.tipica; atualizar(); };
  } else { mostra(av, false); av.textContent = ""; }
  cada($("wBtns").getElementsByTagName("button"), function (b) { b.setAttribute("aria-pressed", parseFloat(b.getAttribute("data-kg")) === P.peso ? "true" : "false"); });
  return true;
}
function atualizar() { if (lerPaciente()) recalc(); }
function editou() { P.exemplo = false; atualizar(); }
function pesoRapido(kg) {
  $("peso").value = String(kg);
  var antes = $("idade").value, id = parseIdade(antes), tmp = { peso: kg, idade: id.anos, idadeOk: id.ok, sexo: $("sexo").value };
  if (P.exemplo || !id.ok || incoerencia(tmp)) {
    var tip = idadeTipica(kg);
    if (tip !== antes) { $("idade").value = tip; toast("Idade ajustada para " + tip + ", típica de " + num(kg) + " kg. Confira."); }
  }
  P.exemplo = false; atualizar();
}

/* ---------- navegação ---------- */
function mostrarAba(id, foco) {
  var r = rota(id);
  if (r.g) { var abg = abaDoGrupo(r.g); if (abg) r.aba = abg; }
  id = r.aba;
  if (!$(id) || !ROTULOS[id]) { id = "t-painel"; r.g = null; }
  abaAtual = id;
  cada(document.querySelectorAll("section.tab"), function (s) { s.className = s.id === id ? "tab active" : "tab"; });
  cada($("navGroups").getElementsByTagName("a"), function (a) {
    var on = a.getAttribute("href") === "#" + id;
    a.className = on ? "active" : "";
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.title = ROTULOS[id] + " | Emergência & UTI";
  try { localStorage.setItem("eu.aba", id); } catch (e) {}
  fecharMenu();
  window.scrollTo(0, 0);
  try { cPrint(); } catch (e2) {}
  if (foco && !r.g) { var h = $(id).getElementsByTagName("h1")[0]; if (h) { h.setAttribute("tabindex", "-1"); try { h.focus({ preventScroll: true }); } catch (e3) { h.focus(); } } }
  if (AC.est[id]) {
    var pend = AC.pendente; AC.pendente = null;
    acervoAtivar(id, pend);
    if (r.g) acervoAbrir(id, r.g, r.id, true);
  }
}
function abrirMenu() { $("side").className = "side no-print open"; mostra($("veu"), true); $("btnMenu").setAttribute("aria-expanded", "true"); }
function fecharMenu() { $("side").className = "side no-print"; mostra($("veu"), false); $("btnMenu").setAttribute("aria-expanded", "false"); }
function filtrarNav() {
  var q = semAcento($("navSearch").value).replace(/^\s+|\s+$/g, ""), total = 0, primeiro = null;
  cada($("navGroups").querySelectorAll(".nav-g"), function (g) {
    var vis = 0;
    cada(g.getElementsByTagName("a"), function (a) {
      var id = a.getAttribute("href").slice(1), s = $(id);
      var ok = !q || semAcento(a.textContent + " " + s.getAttribute("data-title") + " " + s.textContent).indexOf(q) >= 0;
      mostra(a, ok);
      if (ok) { vis++; total++; if (!primeiro) primeiro = id; }
    });
    mostra(g, vis > 0);
  });
  mostra($("navVazio"), total === 0);
  acervoNav($("navSearch").value);
  return primeiro;
}

/* ---------- copiar ---------- */
function limpa(s) { return String(s).replace(/\s+/g, " ").replace(/^ | $/g, ""); }
function bloco(el, out) {
  if (el.nodeType !== 1) return;
  var cl = " " + (el.getAttribute("class") || "") + " ", tag = el.tagName;
  if (cl.indexOf(" no-print ") >= 0 || cl.indexOf(" pn ") >= 0 || cl.indexOf(" so-leitor ") >= 0 || el.hasAttribute("hidden") || tag === "BUTTON" || tag === "IMG" || tag === "SCRIPT") return;
  var i;
  if (tag === "H1") { out.push(limpa(el.textContent)); return; }
  if (tag === "H3" || tag === "H4") { out.push(""); out.push(limpa(el.textContent)); return; }
  if (tag === "TABLE") {
    cada(el.rows, function (r) { var c = []; cada(r.cells, function (x) { c.push(limpa(x.textContent)); }); out.push(c.join(" | ")); });
    return;
  }
  if (cl.indexOf(" kv ") >= 0) { out.push(limpa(el.children[0].textContent) + ": " + limpa(el.children[el.children.length - 1].textContent)); return; }
  if (cl.indexOf(" hero-result ") >= 0) {
    var p = []; cada(el.children, function (c) { var t = limpa(c.textContent); if (t) p.push(t); });
    out.push(p[0] + ": " + p.slice(1).join(". ")); return;
  }
  if (cl.indexOf(" copybox ") >= 0) { out.push(el.textContent); return; }
  if (cl.indexOf(" field ") >= 0 || cl.indexOf(" marca-check ") >= 0) {
    var ctl = el.querySelector("select,input,textarea"), lb = el.querySelector("label") || el;
    if (!ctl || ctl.type === "file") return;
    if (ctl.type === "checkbox") { if (ctl.checked) out.push(limpa(lb.textContent) + ": sim"); return; }
    var v = ctl.tagName === "SELECT" ? (ctl.options[ctl.selectedIndex] ? ctl.options[ctl.selectedIndex].text : "") : ctl.value;
    if (limpa(v)) out.push(limpa(lb.textContent) + ": " + (ctl.tagName === "TEXTAREA" ? v : limpa(v)));
    return;
  }
  if (cl.indexOf(" checks ") >= 0) {
    var m = []; cada(el.getElementsByTagName("input"), function (c) { if (c.checked) m.push(limpa(c.parentNode.textContent)); });
    out.push("Marcados: " + (m.length ? m.join("; ") : "nenhum")); return;
  }
  if (tag === "TEXTAREA") { out.push(el.value); return; }
  if (tag === "LI") { out.push("- " + limpa(el.textContent)); return; }
  if (tag === "DT") { out.push(limpa(el.textContent) + ": " + (el.nextElementSibling ? limpa(el.nextElementSibling.textContent) : "")); return; }
  if (tag === "DD") return;
  if (tag === "P") { var t2 = limpa(el.textContent); if (t2 && t2 !== "—") out.push(t2); return; }
  for (i = 0; i < el.children.length; i++) bloco(el.children[i], out);
}
function textoDaAba(id) {
  var s = $(id), alvo = s.getAttribute("data-alvo");
  if (alvo) return $(alvo).textContent;
  var out = [];
  bloco(s, out);
  return "Emergência & UTI\nPaciente: " + pacienteTxt() + (P.exemplo ? " (exemplo)" : "") + ". " + dataTxt(true) + "\n\n" + out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n\nConferir cada dose antes de administrar.";
}
function copiar(txt, ok) {
  function reserva() {
    var ta = document.createElement("textarea"), feito = false;
    ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { ta.setSelectionRange(0, txt.length); feito = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    toast(feito ? ok : "Não foi possível copiar automaticamente. Selecione o texto e copie.");
  }
  window.__copiado = txt;
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast(ok); }, reserva);
  else reserva();
}
function copyTab(id) { copiar(textoDaAba(id), "Copiado para a área de transferência."); }
window.copyTab = copyTab;

/* ---------- tema ---------- */
function aplicarTema(t, salvar) {
  document.documentElement.setAttribute("data-theme", t);
  set("btnTema", t === "dark" ? "Tema claro" : "Tema escuro");
  var mt = document.querySelector('meta[name="theme-color"]');
  if (mt) mt.setAttribute("content", t === "dark" ? "#111921" : "#1B2631");
  if (salvar) try { localStorage.setItem("eu.tema", t); } catch (e) {}
}

/* ---------- montagem ---------- */
function montar() {
  var h = "", i, j, ordem = [];
  for (i = 0; i < GRUPOS.length; i++) {
    h += '<div class="nav-g"><h2>' + esc(GRUPOS[i].g) + "</h2>";
    for (j = 0; j < GRUPOS[i].tabs.length; j++) {
      var t = GRUPOS[i].tabs[j];
      ROTULOS[t[0]] = t[1]; ordem.push(t[0]);
      h += '<a href="#' + t[0] + '">' + esc(t[1]) + "</a>";
      var s = $(t[0]), hh = s.querySelector(".hero-head"), d1 = hh.children[0];
      var tri = document.createElement("p"); tri.className = "trilha"; tri.textContent = GRUPOS[i].g;
      d1.insertBefore(tri, d1.firstChild);
      var ac = document.createElement("div"); ac.className = "actions no-print";
      ac.innerHTML = '<button class="btn-m" type="button" data-print="' + t[0] + '">' + esc(s.getAttribute("data-imprimir") || "Imprimir esta aba") + "</button>" +
        '<button class="btn-m" type="button" data-copy="' + t[0] + '">' + esc(s.getAttribute("data-copiar") || "Copiar") + "</button>";
      hh.appendChild(ac);
    }
    h += "</div>";
  }
  setH("navGroups", h + '<p class="nav-vazio" id="navVazio" hidden>Nenhuma seção contém esse termo.</p>');
  for (i = 0; i < ordem.length; i++) {
    var pn = document.createElement("nav"); pn.className = "pn no-print"; pn.setAttribute("aria-label", "Seção anterior e próxima");
    pn.innerHTML = (i > 0 ? '<a href="#' + ordem[i - 1] + '">Anterior: ' + esc(ROTULOS[ordem[i - 1]]) + "</a>" : "<span></span>") +
      (i < ordem.length - 1 ? '<a href="#' + ordem[i + 1] + '">Próxima: ' + esc(ROTULOS[ordem[i + 1]]) + "</a>" : "<span></span>");
    $(ordem[i]).appendChild(pn);
  }
  h = "";
  for (i = 0; i < PESOS_RAPIDOS.length; i++) {
    var kg = PESOS_RAPIDOS[i], z = zona(kg);
    h += '<button type="button" data-kg="' + kg + '" style="--c:' + z.cor + '" aria-pressed="false" aria-label="' + num(kg) + ' kg, faixa ' + esc(z.nome.toLowerCase()) + '">' + num(kg) + "</button>";
  }
  setH("wBtns", h);
  h = ""; var g = "";
  for (i = 0; i < INFUSOES.length; i++) {
    if (INFUSOES[i].t !== g) { if (g) h += "</optgroup>"; g = INFUSOES[i].t; h += '<optgroup label="' + esc(g) + '">'; }
    h += '<option value="' + i + '">' + esc(INFUSOES[i].n) + "</option>";
  }
  setH("dvDrug", h + "</optgroup>");
  $("dvDose").value = String(INFUSOES[0].f[0]);
  h = "";
  for (i = 0; i < SIND_ORDEM.length; i++) h += '<option value="' + SIND_ORDEM[i] + '">' + esc(SINDROMES[SIND_ORDEM[i]].t) + "</option>";
  setH("atbSind", h);
  h = "";
  for (i = 0; i < DOC_ORDEM.length; i++) h += '<option value="' + DOC_ORDEM[i] + '">' + esc(DOCS[DOC_ORDEM[i]].t) + "</option>";
  setH("docSel", h);
  h = "";
  for (i = 0; i < SINAIS.length; i++) h += '<label><input type="checkbox" value="' + SINAIS[i].id + '"> ' + esc(SINAIS[i].l) + "</label>";
  setH("diagChecks", h);
  h = "";
  for (i = 0; i < MODOS.length; i++) h += '<option value="' + MODOS[i].id + '">' + esc(MODOS[i].n) + "</option>";
  setH("modoSel", h);
  acervoMontar();
  cada(document.querySelectorAll("table.ref tbody"), rotular);
}
function ligar() {
  $("peso").oninput = editou; $("idade").oninput = editou; $("sexo").onchange = editou;
  $("wBtns").onclick = function (e) { var b = e.target; while (b && b.tagName !== "BUTTON") b = b.parentNode; if (b) pesoRapido(parseFloat(b.getAttribute("data-kg"))); };
  $("desPct").onchange = function () { cPainel(); };
  $("choqueSel").onchange = function () { cChoque(); };
  $("dvDrug").onchange = aoTrocarFarmaco; $("dvDose").oninput = cDil; $("dvVol").onchange = cDil;
  $("repBusca").oninput = cRep;
  $("atbSind").onchange = cAtb;
  $("soNa").oninput = cSoro; $("soK").oninput = cSoro;
  $("coNa").oninput = function () { cCorr(); cMetab(); }; $("coNaAlvo").oninput = function () { cCorr(); cMetab(); };
  $("vmAlt").oninput = function () { cVm(); cModos(); };
  $("modoSel").onchange = cModos;
  ligarAcervo(); ligarNovos();
  cada(["gaNa", "gaCl", "gaHco", "gaGlic"], function (id) { $(id).oninput = cGaso; });
  $("diagChecks").onchange = cDiag;
  $("diagLimpar").onclick = function () { cada($("diagChecks").getElementsByTagName("input"), function (c) { c.checked = false; }); cDiag(); };
  $("btnAnalisa").onclick = analisar;
  $("imgArq").onchange = function () {
    var f = this.files && this.files[0], im = $("imgPrev");
    if (!f || !window.URL || !URL.createObjectURL) { mostra(im, false); return; }
    im.src = URL.createObjectURL(f); mostra(im, true);
  };
  $("altCen").onchange = cAlta; $("altIbu").onchange = cAlta;
  $("docSel").onchange = cDocs;
  $("docTxt").oninput = function () { docEstado[$("docSel").value] = { txt: this.value, sujo: true, pac: pacienteTxt() }; };
  $("docCopiar").onclick = function () { copiar($("docTxt").value, "Documento copiado."); };
  $("docRestaurar").onclick = function () { docEstado[$("docSel").value] = null; cDocs(); toast("Modelo restaurado com os dados atuais do paciente."); };
  $("btnTema").onclick = function () { aplicarTema(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true); };
  $("btnMenu").onclick = function () { if ($("side").className.indexOf("open") >= 0) fecharMenu(); else { abrirMenu(); $("navSearch").focus(); } };
  $("veu").onclick = fecharMenu;
  $("pacResumo").onclick = function () {
    var tb = $("topbar"), ab = tb.className.indexOf("aberta") >= 0;
    tb.className = ab ? "topbar no-print" : "topbar no-print aberta";
    this.setAttribute("aria-expanded", ab ? "false" : "true");
    if (!ab) $("peso").focus();
  };
  $("navSearch").oninput = filtrarNav;
  $("navSearch").onkeydown = function (e) { if (e.key === "Enter" || e.keyCode === 13) { var p = filtrarNav(); if (p) location.hash = "#" + p; } };
  document.onkeydown = function (e) { if (e.key === "Escape" || e.keyCode === 27) fecharMenu(); };
  document.addEventListener("click", function (e) {
    var b = e.target;
    while (b && b !== document && !(b.getAttribute && (b.getAttribute("data-print") || b.getAttribute("data-copy")))) b = b.parentNode;
    if (!b || b === document) return;
    if (b.getAttribute("data-copy")) copyTab(b.getAttribute("data-copy"));
    else { cPrint(); window.print(); }
  });
  window.onhashchange = function () { mostrarAba(location.hash.slice(1), true); };
  // No celular, o editor do paciente recolhe ao rolar a página, para não cobrir o conteúdo.
  window.addEventListener("scroll", function () {
    var tb = $("topbar");
    if (window.innerWidth > 1000 || tb.className.indexOf("aberta") < 0 || document.body.className === "sem-paciente") return;
    if ($("pacEdit").contains(document.activeElement) || window.scrollY < 80) return;
    tb.className = "topbar no-print"; $("pacResumo").setAttribute("aria-expanded", "false");
  });
}
function iniciar() {
  var t = null, aba = null;
  try { t = localStorage.getItem("eu.tema"); aba = localStorage.getItem("eu.aba"); } catch (e) {}
  if (t !== "dark" && t !== "light") t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  montar(); aplicarTema(t, false); ligar();
  atualizar(); cDiag();
  mostrarAba(location.hash.slice(1) || aba || "t-painel", false);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
