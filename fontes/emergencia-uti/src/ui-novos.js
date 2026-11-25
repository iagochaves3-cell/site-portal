/* =====================================================================
   Interface do conteúdo acrescentado na integração
   ===================================================================== */

/* ---------- sedação e analgesia para procedimento (aba Via aérea) ---------- */
var PROCED_RESTR = {
  pKetIV: function (p) { return p.idade < 0.25 ? "Não usar abaixo de 3 meses" : null; },
  pKetIM: function (p) { return p.idade < 0.25 ? "Não usar abaixo de 3 meses" : null; }
};
function cProced() {
  var h = "", g = "";
  for (var i = 0; i < PROCED.length; i++) {
    var it = PROCED[i], r = calcItem(it), bloq = PROCED_RESTR[it.id] ? PROCED_RESTR[it.id](P) : null;
    if (it.g !== g) { g = it.g; h += tr([{ t: g, span: 5 }], "grp"); }
    h += tr([it.n, r.kg, bloq ? { t: bloq, c: "critico" } : K(r.dose), bloq ? "—" : K(r.vol), it.ap]);
  }
  corpo("procTab", h);
}

/* ---------- doses tóxicas por peso (aba Intoxicações) ---------- */
function qtdTox(v, u) {
  if (u === "g") return num(v) + " g";
  return v >= 1000 ? num(v / 1000) + " g" : num(v) + " mg";
}
function equivTox(v, ap) {
  var q = v / ap[0], rot = ap[1];
  if (/^mL /.test(rot)) return q >= 1000 ? num(q / 1000) + " L" + rot.slice(2) : mlNum(q) + " " + rot;
  return num(q) + " " + rot;
}
function limiarTox(L, kg, idade) {
  var v = L.k * kg, lim = L.cap != null && (L.capIdade == null || idade >= L.capIdade) && v > L.cap;
  return { v: lim ? L.cap : v, lim: lim };
}
function cToxicos() {
  var kg = P.peso, h = "";
  for (var i = 0; i < TOXICOS.length; i++) {
    var t = TOXICOS[i];
    h += tr([{ t: t.n, span: 3 }], "grp");
    for (var j = 0; j < t.lim.length; j++) {
      var L = t.lim[j], x = limiarTox(L, kg, P.idade), eq = [];
      for (var a = 0; a < t.ap.length; a++) eq.push(equivTox(x.v, t.ap[a]));
      h += tr([num(L.k) + " " + t.u + "/kg: " + L.t, K(qtdTox(x.v, t.u) + (x.lim ? " (limite absoluto)" : "")), K(eq.join("; "))]);
    }
    h += tr([{ t: t.obs, span: 3 }], "obs");
  }
  corpo("toxTab", h);
}

/* ---------- modos ventilatórios (aba Ventilação invasiva) ---------- */
function pesoVentilacao() {
  var alt = valorDe("vmAlt"), temAlt = isFinite(alt) && alt >= 100 && alt <= 230;
  if (P.idade >= 12 && (temAlt || P.idade >= 16)) {
    var padrao = P.sexo === "F" ? 160 : 170, a = temAlt ? alt : padrao;
    return { peso: (P.sexo === "F" ? 45.5 : 50) + 0.91 * (a - 152.4), predito: true, temAlt: temAlt, alt: a, padrao: padrao };
  }
  return { peso: P.peso, predito: false };
}
function faixaVm() {
  var k = faixaEtaria(P.idade).k, alvo = k === "c12" ? "pre" : (k === "ado" ? "adu" : k);
  for (var i = 0; i < VM_FAIXAS.length; i++) if (VM_FAIXAS[i][0] === alvo) return VM_FAIXAS[i];
  return VM_FAIXAS[2];
}
function paramModo(cod) {
  var f = faixaVm(), pv = pesoVentilacao(), w = pv.peso, kg = P.peso;
  if (cod === "vt") {
    if (f[0] === "neo") return ["Volume corrente", "4–6 mL/kg: " + faixaTxt(4 * w, 6 * w, mlNum) + " mL", "modoVt"];
    if (f[0] === "adu") return ["Volume corrente", "6 mL/kg do peso " + (pv.predito ? "predito" : "real") + " (" + nf(w, 1) + " kg): " + ml(6 * w) + "; faixa de 4–8 mL/kg: " + faixaTxt(4 * w, 8 * w, mlNum) + " mL", "modoVt"];
    return ["Volume corrente", "6–8 mL/kg: " + faixaTxt(6 * w, 8 * w, mlNum) + " mL (4–6 mL/kg se a complacência for muito baixa)", "modoVt"];
  }
  if (cod === "fr") return ["Frequência respiratória", f[4]];
  if (cod === "ti") return ["Tempo inspiratório", f[5]];
  if (cod === "peep") return ["PEEP", f[3]];
  if (cod === "fio2") return ["FiO₂", f[7]];
  if (cod === "hz") {
    var hz = ehNeo(P) ? "10–15 Hz" : (kg < 10 ? "10–12 Hz" : (kg < 20 ? "8–10 Hz" : (kg < 30 ? "6–8 Hz" : (P.idade < 16 ? "5–6 Hz" : "4–6 Hz"))));
    return ["Frequência de oscilação", hz + " para " + num(kg) + " kg; reduzir de 1 em 1 Hz se o CO₂ subir com a amplitude no máximo"];
  }
  return null;
}
function listaHTML(l) {
  var h = "<ul>";
  for (var i = 0; i < l.length; i++) h += "<li>" + nb(esc(l[i])) + "</li>";
  return h + "</ul>";
}
function cModos() {
  var sel = $("modoSel"), m = MODOS[0];
  for (var i = 0; i < MODOS.length; i++) if (MODOS[i].id === sel.value) m = MODOS[i];
  var aj = "";
  for (i = 0; i < m.aj.length; i++) {
    var calculado = typeof m.aj[i] === "string", p = calculado ? paramModo(m.aj[i]) : m.aj[i];
    if (!p) continue;
    aj += '<div class="kv"><span>' + esc(p[0]) + "</span><span" + (p[2] ? ' id="' + p[2] + '"' : "") + (calculado ? ' class="calc"' : "") + ">" + nb(esc(p[1])) + "</span></div>";
  }
  var f = faixaVm();
  setH("modoOut", "<h4>Como funciona</h4><p>" + esc(m.como) + "</p><h4>Quando usar</h4>" + listaHTML(m.quando) +
    "<h4>Ajuste inicial para " + esc(num(P.peso)) + " kg, " + esc(idadeNorm(P.idade)) + "</h4><p class=\"helper\">Faixa usada: " + esc(f[1]) + ". Titular pela gasometria, pela curva e pelo conforto.</p>" + aj +
    "<h4>Monitorização</h4>" + listaHTML(m.mon) + "<h4>Cuidados e armadilhas</h4>" + listaHTML(m.cuid));
}

/* =====================================================================
   Acervo integrado: índice e itens em JSON, carregados sob demanda
   ===================================================================== */
var AC = { idx: null, carregando: false, cb: [], erro: null, cache: {}, est: {} };
var AC_PASSO = 40;
function obterJSON(url, cb) {
  var x;
  try { x = new XMLHttpRequest(); x.open("GET", url, true); } catch (e) { cb(e); return; }
  x.onreadystatechange = function () {
    if (x.readyState !== 4) return;
    if (x.status === 200 || (x.status === 0 && x.responseText)) {
      var d; try { d = JSON.parse(x.responseText); } catch (e2) { cb(e2); return; }
      cb(null, d);
    } else cb(new Error("HTTP " + x.status));
  };
  try { x.send(); } catch (e3) { cb(e3); }
}
function acervoCarregar(cb) {
  if (AC.idx) { if (cb) cb(); return; }
  if (cb) AC.cb.push(cb);
  if (AC.carregando) return;
  AC.carregando = true; AC.erro = null;
  obterJSON("acervo/indice.json", function (err, d) {
    AC.carregando = false;
    if (err || !d || !d.itens) AC.erro = "O acervo não pôde ser carregado. Ele vem do endereço publicado na web: confira a conexão e recarregue a página.";
    else {
      var l = [];
      for (var i = 0; i < d.itens.length; i++) {
        var e = d.itens[i];
        l.push({ g: e[0], id: e[1], t: e[2], s: e[3] || "", tn: semAcento(e[2]), n: semAcento(e[2] + " " + (e[3] || "") + " " + (e[4] || "")) });
      }
      AC.idx = l; AC.gerado = d.gerado || ""; window.__acervoIdx = l;
    }
    var fila = AC.cb; AC.cb = [];
    for (var j = 0; j < fila.length; j++) fila[j]();
  });
}
function acervoBuscar(q, grupos) {
  var qn = semAcento(q || "").replace(/^\s+|\s+$/g, ""), termos = qn ? qn.split(/\s+/) : [], out = [];
  for (var i = 0; i < AC.idx.length; i++) {
    var e = AC.idx[i], ok = true, j;
    if (grupos && grupos.indexOf(e.g) < 0) continue;
    for (j = 0; j < termos.length; j++) if (e.n.indexOf(termos[j]) < 0) { ok = false; break; }
    if (!ok) continue;
    var sc = 4;
    if (qn) {
      if (e.tn.indexOf(qn) === 0) sc = 0;
      else if (e.tn.indexOf(qn) >= 0) sc = 1;
      else { sc = 2; for (j = 0; j < termos.length; j++) if (e.tn.indexOf(termos[j]) < 0) { sc = 3; break; } }
    }
    out.push({ e: e, sc: sc });
  }
  out.sort(function (a, b) { return a.sc - b.sc || (a.e.tn < b.e.tn ? -1 : (a.e.tn > b.e.tn ? 1 : 0)); });
  return out;
}
function abaDoGrupo(g) {
  for (var k in ACERVO_ABAS) if (ACERVO_ABAS.hasOwnProperty(k) && ACERVO_ABAS[k].grupos.indexOf(g) >= 0) return k;
  return null;
}
function acervoMontar() {
  for (var aba in ACERVO_ABAS) {
    if (!ACERVO_ABAS.hasOwnProperty(aba)) continue;
    var cfg = ACERVO_ABAS[aba], box = document.querySelector('.acervo[data-aba="' + aba + '"]'), ch = "";
    if (!box) continue;
    AC.est[aba] = { q: "", grupos: cfg.grupos.slice(), n: AC_PASSO, aberto: null };
    if (cfg.grupos.length > 1) {
      ch = '<button type="button" data-ac-g="*" aria-pressed="true">Todas as origens</button>';
      for (var i = 0; i < cfg.grupos.length; i++) ch += '<button type="button" data-ac-g="' + cfg.grupos[i] + '" aria-pressed="false">' + esc(ACERVO_GRUPOS[cfg.grupos[i]].n) + "</button>";
    }
    box.innerHTML = '<div class="ac-busca no-print">' +
      '<label for="acq-' + aba + '">' + esc(cfg.rotulo) + "</label>" +
      '<input type="search" id="acq-' + aba + '" class="ac-q" data-aba="' + aba + '" placeholder="' + esc(cfg.exemplo) + '" autocomplete="off">' +
      (ch ? '<div class="ac-chips" role="group" aria-label="Filtrar por origem">' + ch + "</div>" : "") +
      '<p class="helper" id="acn-' + aba + '" aria-live="polite">Abra esta aba para carregar o índice.</p>' +
      '<ol class="ac-lista" id="acl-' + aba + '"></ol>' +
      '<button class="btn-m ac-mais" type="button" id="acm-' + aba + '" data-aba="' + aba + '" hidden>Mostrar mais</button></div>' +
      '<article class="ac-leitor" id="acr-' + aba + '" tabindex="-1"><p class="helper">' + esc(cfg.vazio) + "</p></article>";
  }
  var h = "";
  for (i = 0; i < ACERVO_SITES.length; i++) {
    var s = ACERVO_SITES[i];
    h += "<tr><td><a href=\"" + esc(s[2]) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + esc(s[0]) + "</a></td><td>" + esc(s[1]) + "</td><td>" + esc(s[3] || "Consulta no site de origem") + "</td></tr>";
  }
  corpo("acSites", h);
  h = "";
  for (i = 0; i < ACERVO_DRIVE.length; i++) h += tr(ACERVO_DRIVE[i]);
  corpo("acDrive", h);
  h = "";
  for (i = 0; i < RECONCILIACAO.length; i++) h += tr(RECONCILIACAO[i]);
  corpo("acRecon", h);
  h = "";
  for (var g in ACERVO_GRUPOS) if (ACERVO_GRUPOS.hasOwnProperty(g)) {
    var G = ACERVO_GRUPOS[g], ab = abaDoGrupo(g);
    h += "<tr><td><a href=\"#" + ab + "\">" + esc(G.n) + "</a></td><td>" + esc(G.o) + "</td><td>" + esc(num(G.itens)) + "</td><td>" + esc(ROTULOS[ab] || "") + "</td></tr>";
  }
  corpo("acGrupos", h);
  h = "";
  for (i = 0; i < TOX_UM_COMPRIMIDO.length; i++) h += "<li>" + esc(TOX_UM_COMPRIMIDO[i]) + "</li>";
  setH("toxUm", h);
}
function acervoAtivar(aba, q) {
  var st = AC.est[aba];
  if (!st) return;
  if (q != null) { st.q = q; $("acq-" + aba).value = q; st.n = AC_PASSO; }
  if (AC.idx) { acervoListar(aba); return; }
  set("acn-" + aba, "Carregando o índice do acervo…");
  acervoCarregar(function () { acervoListar(aba); });
}
function acervoListar(aba) {
  var st = AC.est[aba], n = $("acn-" + aba);
  if (!AC.idx) { n.textContent = AC.erro || "Índice indisponível."; n.className = "helper aviso erro"; return; }
  n.className = "helper";
  var r = acervoBuscar(st.q, st.grupos), h = "", lim = Math.min(r.length, st.n);
  for (var i = 0; i < lim; i++) {
    var e = r[i].e, cur = st.aberto === e.g + "/" + e.id;
    h += '<li><button type="button" data-ac-abrir="' + e.g + "/" + e.id + '"' + (cur ? ' aria-current="true"' : "") + ">" + esc(e.t) +
      "<small>" + esc(ACERVO_GRUPOS[e.g].n + (e.s && e.s !== ACERVO_GRUPOS[e.g].n ? ". " + e.s : "")) + "</small></button></li>";
  }
  setH("acl-" + aba, h);
  n.textContent = r.length ? (st.q ? r.length + (r.length === 1 ? " resultado" : " resultados") + " para “" + st.q + "”." : r.length + " itens em ordem alfabética.") + (lim < r.length ? " Mostrando " + lim + "." : "")
    : "Nada encontrado para “" + st.q + "”. Tente outro termo ou outra origem.";
  mostra($("acm-" + aba), lim < r.length);
}
function acervoAbrir(aba, g, id, foco) {
  var R = $("acr-" + aba), st = AC.est[aba];
  if (!R || !st || !/^[a-z]+$/.test(g) || !/^[a-z0-9-]+$/.test(id) || !ACERVO_GRUPOS[g]) return;
  st.aberto = g + "/" + id;
  cada($("acl-" + aba).getElementsByTagName("button"), function (b) { if (b.getAttribute("data-ac-abrir") === st.aberto) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
  R.innerHTML = '<p class="helper">Carregando…</p>';
  var mostrar = function (d) {
    if (st.aberto !== g + "/" + id) return;
    R.innerHTML = acervoHTML(d, g);
    cada(R.querySelectorAll("table.ref tbody"), rotular);
    try { if (window.history && history.replaceState) history.replaceState(null, "", "#" + aba + "/" + g + "/" + id); } catch (e) {}
    document.title = d.t + " | Emergência & UTI";
    if (foco) { try { R.focus({ preventScroll: true }); } catch (e2) { R.focus(); } if (window.innerWidth <= 1000) R.scrollIntoView(); }
  };
  if (AC.cache[st.aberto]) { mostrar(AC.cache[st.aberto]); return; }
  obterJSON("acervo/" + g + "/" + id + ".json", function (err, d) {
    if (err || !d || !d.t) { if (st.aberto === g + "/" + id) R.innerHTML = '<p class="aviso erro">Não foi possível abrir este item. Confira a conexão e tente de novo.</p>'; return; }
    AC.cache[g + "/" + id] = d; mostrar(d);
  });
}
function urlSegura(u) { return /^https?:\/\/[^\s"<>]+$/.test(String(u || "")); }
function mdInline(t, g) {
  return t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, src) {
    var f = /^assets\/([a-z0-9-]+\.svg)$/.exec(src);
    return g === "neo" && f ? '<img src="acervo/neo/assets/' + f[1] + '" alt="' + alt + '" loading="lazy">' : "[" + alt + "]";
  }).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s"]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
function mdTabela(linhas, g) {
  function cel(l) { return l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|"); }
  var cab = cel(linhas[0]), resto = linhas.slice(1), h = '<div class="tbl"><table class="ref"><thead><tr>', i, j;
  if (resto.length && /^[\s|:\-]+$/.test(resto[0])) resto = resto.slice(1);
  for (i = 0; i < cab.length; i++) h += "<th>" + mdInline(esc(cab[i].replace(/^\s+|\s+$/g, "")), g) + "</th>";
  h += "</tr></thead><tbody>";
  for (i = 0; i < resto.length; i++) {
    var c = cel(resto[i]);
    h += "<tr>";
    for (j = 0; j < cab.length; j++) h += "<td>" + mdInline(esc((c[j] || "").replace(/^\s+|\s+$/g, "")), g) + "</td>";
    h += "</tr>";
  }
  return h + "</tbody></table></div>";
}
function md(txt, g) {
  var L = String(txt).split(/\r?\n/), h = "", i = 0, lista = null, m;
  function fecha() { if (lista) { h += "</" + lista + ">"; lista = null; } }
  while (i < L.length) {
    var t = L[i].replace(/^\s+|\s+$/g, "");
    if (!t) { fecha(); i++; continue; }
    if (t.charAt(0) === "|") {
      fecha(); var bl = [];
      while (i < L.length && /^\s*\|/.test(L[i])) { bl.push(L[i]); i++; }
      h += mdTabela(bl, g); continue;
    }
    if ((m = /^(#{1,6})\s+(.*)$/.exec(t))) { fecha(); var n = m[1].length < 3 ? 3 : (m[1].length === 3 ? 4 : 5); h += "<h" + n + ">" + mdInline(esc(m[2]), g) + "</h" + n + ">"; i++; continue; }
    if ((m = /^([-*+]|\d+[.)])\s+(.*)$/.exec(t))) {
      var tipo = /\d/.test(m[1]) ? "ol" : "ul";
      if (lista !== tipo) { fecha(); h += "<" + tipo + ">"; lista = tipo; }
      h += "<li>" + mdInline(esc(m[2]), g) + "</li>"; i++; continue;
    }
    fecha();
    if (t.charAt(0) === ">") h += "<blockquote>" + mdInline(esc(t.replace(/^>\s?/, "")), g) + "</blockquote>";
    else h += "<p>" + mdInline(esc(t), g) + "</p>";
    i++;
  }
  fecha();
  return h;
}
function acervoHTML(d, g) {
  var G = ACERVO_GRUPOS[g], h = '<header class="ac-cab"><p class="trilha">' + esc(G.n) + ". Origem: " + esc(d.o || G.o) + "</p><h2>" + esc(d.t) + "</h2>", i, j;
  if (d.m && d.m.length) { h += '<p class="ac-meta">'; for (i = 0; i < d.m.length; i++) h += '<span class="chip">' + esc(d.m[i]) + "</span>"; h += "</p>"; }
  if (d.st) h += '<p class="ac-st">Situação declarada na origem: ' + esc(d.st) + "</p>";
  var acoes = "";
  if (urlSegura(d.u)) acoes += '<a class="btn-m" href="' + esc(d.u) + '" target="_blank" rel="noopener noreferrer">Abrir no site de origem</a>';
  if (d.calc && /^[A-Za-z0-9_-]+$/.test(d.calc)) acoes += '<button class="btn-m" type="button" data-ac-calc="' + esc(d.calc) + '" data-ac-tit="' + esc(d.t) + '">Calcular este escore aqui</button>';
  if (acoes) h += '<div class="ac-acoes no-print">' + acoes + "</div>";
  h += '<div class="ac-calc" hidden></div></header>';
  var secs = d.s || [];
  for (i = 0; i < secs.length; i++) {
    var s = secs[i];
    if (s.h) h += "<h3>" + esc(s.h) + "</h3>";
    if (s.b && s.b.length) {
      h += "<ul>";
      for (j = 0; j < s.b.length; j++) h += "<li>" + mdInline(esc(s.b[j]), g) + "</li>";
      h += "</ul>";
      if (s.f && s.f.length) h += '<p class="helper">Referências: ' + esc(s.f.join(", ")) + "</p>";
    }
    if (s.md) h += md(s.md, g);
    if (s.kv && s.kv.length) for (j = 0; j < s.kv.length; j++) h += '<div class="kv"><span>' + esc(s.kv[j][0]) + "</span><span>" + mdInline(esc(s.kv[j][1]), g) + "</span></div>";
    if (s.tb && s.tb.c) {
      h += '<div class="tbl"><table class="ref"><thead><tr>';
      for (j = 0; j < s.tb.c.length; j++) h += "<th>" + esc(s.tb.c[j]) + "</th>";
      h += "</tr></thead><tbody>";
      for (j = 0; j < s.tb.r.length; j++) {
        h += "<tr>";
        for (var k = 0; k < s.tb.c.length; k++) h += "<td>" + mdInline(esc(s.tb.r[j][k] == null ? "" : String(s.tb.r[j][k])), g) + "</td>";
        h += "</tr>";
      }
      h += "</tbody></table></div>";
    }
    if (s.pre) h += '<pre class="ac-pre">' + esc(s.pre) + "</pre>";
  }
  if (d.r && d.r.length) {
    h += '<h3>Referências da origem</h3><ol class="ac-refs">';
    for (i = 0; i < d.r.length; i++) {
      var rr = d.r[i], tt = esc(rr[0] || rr[1] || "");
      h += "<li>" + (urlSegura(rr[1]) ? '<a href="' + esc(rr[1]) + '" target="_blank" rel="noopener noreferrer">' + tt + "</a>" : tt) + "</li>";
    }
    h += "</ol>";
  }
  if (d.nota) h += '<p class="helper">' + esc(d.nota) + "</p>";
  return h;
}
function acervoCalc(btn) {
  var cab = btn.parentNode.parentNode, box = cab.querySelector(".ac-calc"), id = btn.getAttribute("data-ac-calc");
  if (!box) return;
  if (!box.hasAttribute("hidden")) { mostra(box, false); box.innerHTML = ""; btn.textContent = "Calcular este escore aqui"; return; }
  box.innerHTML = '<iframe class="ac-frame" src="acervo/escores/index.html#score/' + encodeURIComponent(id) + '" title="Calculadora: ' + esc(btn.getAttribute("data-ac-tit")) + '"></iframe>' +
    '<p class="helper">Calculadora completa do site Escores Clínicos, com os mesmos critérios e faixas da origem.</p>';
  mostra(box, true); btn.textContent = "Fechar a calculadora";
}
// Busca do menu lateral: também procura no acervo.
function acervoNav(q) {
  var box = $("navAcervo");
  if (!box) return;
  q = (q || "").replace(/^\s+|\s+$/g, "");
  if (q.length < 3) { mostra(box, false); box.innerHTML = ""; return; }
  if (!AC.idx) {
    mostra(box, false);
    acervoCarregar(function () { if (AC.idx && $("navSearch").value.replace(/^\s+|\s+$/g, "") === q) acervoNav(q); });
    return;
  }
  var r = acervoBuscar(q, null), h = "<h2>No acervo integrado</h2>", lim = Math.min(r.length, 6);
  if (!r.length) { mostra(box, false); box.innerHTML = ""; return; }
  for (var i = 0; i < lim; i++) {
    var e = r[i].e, ab = abaDoGrupo(e.g);
    h += '<a href="#' + ab + "/" + e.g + "/" + e.id + '">' + esc(e.t) + "<small>" + esc(ACERVO_GRUPOS[e.g].n) + "</small></a>";
  }
  if (r.length > lim) {
    var cont = {}, mais = "";
    for (i = 0; i < r.length; i++) { var a2 = abaDoGrupo(r[i].e.g); cont[a2] = (cont[a2] || 0) + 1; }
    for (var k in cont) if (cont.hasOwnProperty(k)) mais += '<a class="ac-todos" href="#' + k + '" data-ac-q="' + esc(q) + '">Ver ' + cont[k] + " em " + esc(ROTULOS[k]) + "</a>";
    h += mais;
  }
  box.innerHTML = h; mostra(box, true);
}
function ligarAcervo() {
  document.addEventListener("click", function (e) {
    var b = e.target;
    while (b && b !== document && !(b.getAttribute && (b.getAttribute("data-ac-abrir") || b.getAttribute("data-ac-g") || b.getAttribute("data-ac-calc") || b.getAttribute("data-ac-q") || (b.className && String(b.className).indexOf("ac-mais") >= 0)))) b = b.parentNode;
    if (!b || b === document) return;
    var caixa = b; while (caixa && !(caixa.getAttribute && caixa.getAttribute("data-aba") && caixa.className === "acervo")) caixa = caixa.parentNode;
    var aba = caixa && caixa.getAttribute ? caixa.getAttribute("data-aba") : b.getAttribute("data-aba");
    if (b.getAttribute("data-ac-q") != null && b.tagName === "A") { AC.pendente = b.getAttribute("data-ac-q"); return; }
    if (b.getAttribute("data-ac-calc")) { acervoCalc(b); return; }
    if (!aba || !AC.est[aba]) return;
    var st = AC.est[aba];
    if (b.getAttribute("data-ac-abrir")) { var p = b.getAttribute("data-ac-abrir").split("/"); acervoAbrir(aba, p[0], p[1], true); return; }
    if (b.getAttribute("data-ac-g")) {
      var g = b.getAttribute("data-ac-g");
      st.grupos = g === "*" ? ACERVO_ABAS[aba].grupos.slice() : [g]; st.n = AC_PASSO;
      cada(b.parentNode.getElementsByTagName("button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      acervoListar(aba); return;
    }
    if (String(b.className).indexOf("ac-mais") >= 0) { st.n += AC_PASSO; acervoListar(aba); }
  });
  cada(document.querySelectorAll(".ac-q"), function (inp) {
    var tm = null;
    inp.oninput = function () {
      var aba = inp.getAttribute("data-aba"), st = AC.est[aba];
      if (tm) clearTimeout(tm);
      tm = setTimeout(function () { st.q = inp.value.replace(/^\s+|\s+$/g, ""); st.n = AC_PASSO; if (AC.idx) acervoListar(aba); else acervoAtivar(aba); }, 120);
    };
    inp.onkeydown = function (e) {
      if (e.key !== "Enter" && e.keyCode !== 13) return;
      var aba = inp.getAttribute("data-aba"), pri = $("acl-" + aba).getElementsByTagName("button")[0];
      if (pri) pri.click();
    };
  });
}
// Rota com item do acervo: #t-proto/proto/p-asma
function rota(h) {
  var p = String(h || "").split("/");
  return { aba: p[0], g: p.length === 3 ? p[1] : null, id: p.length === 3 ? p[2] : null };
}
