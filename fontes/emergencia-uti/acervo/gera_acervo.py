#!/usr/bin/env python3
"""Gera o acervo integrado do site Emergência & UTI a partir dos outros sites
do repositório (conteúdo do próprio autor). Nada é reescrito: os textos entram
como estão na origem, com rótulo de procedência e situação de revisão.

Uso: python3 gera_acervo.py <pasta sites do repositório> <manual.txt> <escores.json> <saída>
Saída: <saída>/indice.json, <saída>/manifesto.json e <saída>/<grupo>/<id>.json
"""
import json, os, re, sys, unicodedata, collections, datetime, shutil

SITES, MANUAL_TXT, ESCORES_JSON, SAIDA = sys.argv[1:5]
HOJE = datetime.date.today().strftime("%d/%m/%Y")
BASE = "https://%s.sites-pediatria.workers.dev/"

indice, grupos, vistos = [], collections.OrderedDict(), set()


def slug(s, pre=""):
    s = unicodedata.normalize("NFD", str(s)).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:70] or "item"
    b, n = pre + s, 2
    while b in vistos:
        b = "%s%s-%d" % (pre, s, n); n += 1
    vistos.add(b)
    return b


def limpa(s):
    return re.sub(r"[ \t]+", " ", str(s or "")).strip()


def grava(g, ident, item, sub="", kw=""):
    os.makedirs(os.path.join(SAIDA, g), exist_ok=True)
    item["g"] = g
    with open(os.path.join(SAIDA, g, ident + ".json"), "w", encoding="utf-8") as f:
        json.dump(item, f, ensure_ascii=False, separators=(",", ":"))
    indice.append([g, ident, item["t"], limpa(sub)[:90], limpa(kw)[:160]])
    grupos[g]["itens"] += 1


def grupo(k, nome, origem, site, obs):
    grupos[k] = {"k": k, "n": nome, "origem": origem, "url": BASE % site if site else "", "obs": obs, "itens": 0}


# ------------------------------------------------------------------ protocolos
grupo("proto", "Protocolos clínicos por diagnóstico", "Estudo Continuado", "estudo-continuado",
      "Temas no modelo de 25 componentes, com referências. Adulto e pediatria.")
cat = json.load(open(os.path.join(SITES, "estudo-continuado/data/catalog.json"), encoding="utf-8"))
for t in cat["topics"]:
    secs = []
    resumo = [x for x in (t.get("description"), t.get("takeaway")) if x]
    if resumo:
        secs.append({"h": "Em resumo", "b": [limpa(x) for x in resumo]})
    for s in t.get("sections", []):
        bl = []
        for b in s.get("bullets", []):
            bl.append(limpa(b if isinstance(b, str) else b.get("text") or json.dumps(b, ensure_ascii=False)))
        sec = {"h": limpa(s.get("title")), "b": bl}
        if s.get("refs"):
            sec["f"] = s["refs"]
        secs.append(sec)
    for cb in t.get("copyBlocks") or []:
        if isinstance(cb, dict) and (cb.get("text") or cb.get("content")):
            secs.append({"h": "Texto para copiar: " + limpa(cb.get("title") or cb.get("label") or ""), "pre": cb.get("text") or cb.get("content")})
    refs = []
    for r in t.get("references", []):
        tit = " · ".join(x for x in (limpa(r.get("title")), limpa(r.get("organization")), limpa(r.get("year"))) if x)
        refs.append([("[%s] " % r.get("id") if r.get("id") is not None else "") + tit, r.get("url") or ""])
    item = {"t": limpa(t["title"]), "o": "Estudo Continuado", "u": BASE % "estudo-continuado",
            "m": [x for x in (limpa(t.get("category")), "População: " + limpa(t.get("population")) if t.get("population") else "",
                              "Verificado na origem em " + limpa(t.get("verifiedAt")) if t.get("verifiedAt") else "",
                              "Versão " + limpa(t.get("version")) if t.get("version") else "") if x],
            "st": "Síntese assistida por IA com referências; sem homologação médica humana declarada", "s": secs, "r": refs}
    if t.get("note"):
        item["nota"] = limpa(t["note"])
    grava("proto", slug(t["title"], "p-"), item, t.get("category", ""), " ".join(t.get("aliases") or []))

# ------------------------------------------------------------------ terapêuticas (PedWB)
grupo("tera", "Terapêuticas pediátricas", "Terapêuticas (PedWB)", "terapeuticas",
      "Temas pediátricos por especialidade e anexos operacionais.")
ROT = {"documentary": "registro documental, revisão clínica pendente", "partial": "revisão parcial", "reviewed": "revisado por IA na origem",
       "researched": "pesquisa dirigida por IA"}
idx = {x["id"]: x for x in json.load(open(os.path.join(SITES, "terapeuticas/data/index.json"), encoding="utf-8"))["items"]}
rec_dir = os.path.join(SITES, "terapeuticas/data/records")
for nome in sorted(os.listdir(rec_dir), key=lambda n: (n[0], int(re.sub(r"\D", "", n) or 0))):
    if nome[0] not in "ta":
        continue
    r = json.load(open(os.path.join(rec_dir, nome), encoding="utf-8"))
    meta = idx.get(r["id"], {})
    anexo = nome[0] == "a"
    item = {"t": limpa(r["title"]), "o": "Terapêuticas (PedWB)", "u": BASE % "terapeuticas",
            "m": [x for x in ("Anexo operacional" if anexo else limpa(r.get("category")), "Fonte: " + limpa(r.get("source")) if r.get("source") else "") if x],
            "st": ROT.get(r.get("stage"), limpa(r.get("stage"))) + "; sem homologação médica humana declarada",
            "s": [{"md": r.get("body") or ""}], "r": []}
    grava("tera", slug(r["title"], "t-"), item, "Anexo" if anexo else r.get("category", ""), "")

# ------------------------------------------------------------------ neonatologia
grupo("neo", "Neonatologia", "Neonatologia: cuidados com o RN", "neonatologia", "Compêndio neonatal por áreas, edição de 05/11/2026.")
s = open(os.path.join(SITES, "neonatologia/content.js"), encoding="utf-8").read()
neo = json.loads(s[s.index("{"):s.rindex("}") + 1])
for a in neo["articles"]:
    item = {"t": limpa(a["title"]), "o": "Neonatologia", "u": BASE % "neonatologia", "m": [limpa(a.get("groupTitle")), "Edição " + limpa(neo.get("edition"))],
            "st": "Compêndio do autor; conferir a fonte citada em cada tema", "s": [{"md": a.get("markdown") or ""}], "r": []}
    grava("neo", slug(a["title"], "n-"), item, a.get("groupTitle", ""), "")
item = {"t": "Fontes do compêndio de neonatologia", "o": "Neonatologia", "u": BASE % "neonatologia", "m": ["%d fontes" % len(neo["sources"])],
        "st": "Lista de referências do compêndio", "s": [],
        "r": [["[%s] %s · %s · %s" % (x.get("id"), limpa(x.get("title")), limpa(x.get("organization")), limpa(x.get("year"))), x.get("url") or ""] for x in neo["sources"]]}
grava("neo", slug("fontes do compendio", "n-"), item, "Referências", "")

# ------------------------------------------------------------------ manual PPS (seção 11)
grupo("pps", "Manual de Prescrição Pediátrica Segura", "Manual Integral PPS, versão de 15/08/2026", "",
      "Linhas farmacológicas do manual do autor, por princípio ativo: indicação, via, apresentação, dose, máximo, intervalo e cautelas.")
txt = open(MANUAL_TXT, encoding="utf-8", errors="replace").read()
i11 = txt.rindex("11. Inventário farmacológico integral")
i12 = txt.index("12. Matriz de apresentações prioritárias", i11)
CAMPOS = ["Indicação", "Via", "Apresentação", "Dose", "Máximo", "Intervalo", "Preparo/administração", "Monitorização", "Cautelas", "Situação", "Marcadores"]
re_item = re.compile(r"^\s{0,3}(\d{3})\.\s+(\S.*?)\s*$")
re_campo = re.compile(r"^\s{4,8}(" + "|".join(re.escape(c) for c in CAMPOS) + r")\s{2,}(\S.*?)\s*$")
linhas, atual, campo = [], None, None
for ln in txt[i11:i12].split("\n"):
    if "PRESCRIÇÃO PEDIÁTRICA SEGURA · MANUAL INTEGRAL" in ln or re.match(r"^\s*Página \d+\s*$", ln) or "\f" in ln and not ln.strip("\f \t"):
        continue
    ln = ln.replace("\f", "")
    m = re_item.match(ln)
    if m and not re_campo.match(ln):
        atual = {"n": m.group(1), "farmaco": limpa(m.group(2)), "c": collections.OrderedDict()}
        linhas.append(atual); campo = None
        continue
    if atual is None:
        continue
    m = re_campo.match(ln)
    if m:
        campo = m.group(1); atual["c"][campo] = limpa(m.group(2)); continue
    if campo and ln.strip() and re.match(r"^\s{20,}\S", ln):
        atual["c"][campo] += " " + limpa(ln)
por_farmaco = collections.OrderedDict()
for l in linhas:
    por_farmaco.setdefault(l["farmaco"], []).append(l)
for nome, ls in por_farmaco.items():
    secs = []
    for l in ls:
        c = l["c"]
        secs.append({"h": "Linha %s: %s" % (l["n"], c.get("Indicação", "indicação não informada")),
                     "kv": [[k, c[k]] for k in CAMPOS[1:] if c.get(k)]})
    marc = " ".join(l["c"].get("Marcadores", "") for l in ls)
    m = ["%d %s no manual" % (len(ls), "linha" if len(ls) == 1 else "linhas")]
    if re.search(r"Alta vigilância:\s*sim", marc, re.I): m.append("Alta vigilância")
    if re.search(r"Off-label:\s*sim", marc, re.I): m.append("Off label em ao menos uma linha")
    item = {"t": nome, "o": "Manual Integral PPS", "u": "", "m": m, "st": "Manual do autor, versão consolidada de 15/08/2026; cada linha deve ser confrontada com a bula vigente",
            "s": secs, "r": []}
    grava("pps", slug(nome, "m-"), item, "Manual PPS", " ".join(l["c"].get("Indicação", "") for l in ls))
i10 = txt.rindex("10. Catálogo de diagnósticos e síndromes")
diag = [limpa(m.group(2)) for m in re.finditer(r"^\s{0,3}(\d{3})\.\s+(\S.*?)\s*$", txt[i10:i11], re.M)]
item = {"t": "Catálogo de diagnósticos e síndromes do manual", "o": "Manual Integral PPS", "u": "", "m": ["%d diagnósticos" % len(diag)],
        "st": "Lista do manual; inclusão não equivale a protocolo validado", "s": [{"h": "Diagnósticos e síndromes", "b": diag}], "r": []}
grava("pps", slug("catalogo de diagnosticos", "m-"), item, "Manual PPS", "")
json.dump([{"n": l["n"], "farmaco": l["farmaco"], **l["c"]} for l in linhas], open(os.path.join(os.path.dirname(SAIDA), "pps-linhas.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)

# ------------------------------------------------------------------ monografias (catálogo posológico)
grupo("mono", "Monografias pediátricas", "Catálogo posológico pediátrico, revisão de 14/09/2026", "medicacoes-pediatricas",
      "Monografias com indicações, apresentações, esquemas por indicação, cautelas e fontes.")
ST = {"documentary_extraction_only": "extração documental, sem validação clínica independente",
      "sourced_focal_revision_not_universal_clinical_certification": "revisão focal com fontes; não é certificação clínica universal"}
mono = json.load(open(os.path.join(SITES, "folha-de-parada/fontes/catalogo-posologico-dados.json"), encoding="utf-8"))
for e in mono["entries"]:
    linhas_r = []
    for r in e.get("regimens") or []:
        linhas_r.append([limpa(r.get("indication")), limpa(r.get("population")), limpa(r.get("dose_text")), limpa(r.get("notes"))])
    secs = [{"kv": [[k, v] for k, v in (("Indicações", limpa(e.get("indications_original"))), ("Apresentações", limpa(e.get("presentations_original")))) if v]}]
    if linhas_r:
        secs.append({"h": "Esquemas por indicação", "tb": {"c": ["Indicação", "População", "Dose, intervalo e duração", "Observações"], "r": linhas_r}})
    if e.get("monitoring_and_precautions"):
        secs.append({"h": "Monitorização e cautelas", "b": [limpa(e["monitoring_and_precautions"])]})
    item = {"t": limpa(e["name"]), "o": "Catálogo posológico pediátrico", "u": BASE % "medicacoes-pediatricas",
            "m": ["Monografia %s" % e.get("number"), "%d %s" % (len(linhas_r), "esquema" if len(linhas_r) == 1 else "esquemas")],
            "st": ST.get(e.get("clinical_validation_status"), limpa(e.get("clinical_validation_status"))), "s": secs,
            "r": [["[%s] %s" % (x.get("id"), limpa(x.get("title"))), x.get("url") or ""] for x in e.get("sources") or []]}
    grava("mono", slug(e["name"], "f-"), item, "Monografia pediátrica", limpa(e.get("indications_original"))[:150])

# ------------------------------------------------------------------ escores
grupo("esc", "Escores clínicos", "Escores Clínicos, catálogo de novembro de 2026", "scores-clinicos",
      "Critérios, pontuação, faixas de interpretação, limites e fontes; a calculadora original abre dentro da aba.")
for e in json.load(open(ESCORES_JSON, encoding="utf-8")):
    secs = []
    if e.get("scope"):
        secs.append({"h": "Quando usar", "b": [limpa(e["scope"])]})
    if e.get("suspenso"):
        secs.append({"h": "Cálculo suspenso na origem", "b": [limpa(e["suspenso"])]})
    itens = []
    for f in e.get("fields") or []:
        if f.get("options"):
            itens.append([limpa(f["label"]), "; ".join("%s = %s" % (limpa(o[1]), o[0]) for o in f["options"])])
        else:
            itens.append([limpa(f["label"]), "valor numérico" + (" de %s a %s" % (f.get("min"), f.get("max")) if f.get("min") is not None else "") + (" (%s)" % limpa(f["hint"]) if f.get("hint") else "")])
    if itens:
        secs.append({"h": "Itens e pontuação", "tb": {"c": ["Item", "Opções e pontos"], "r": itens}})
    if e.get("bands"):
        secs.append({"h": "Interpretação", "tb": {"c": ["Até", "Classificação", "Conduta sugerida na origem"], "r": [[str(b[0]), limpa(b[1]), limpa(b[3] if len(b) > 3 else "")] for b in e["bands"]]}})
    kv = [[k, limpa(e.get(c))] for k, c in (("Fórmula", "formula"), ("Limites", "limits")) if e.get(c)]
    if kv:
        secs.append({"kv": kv})
    item = {"t": limpa(e["name"]), "o": "Escores Clínicos", "u": BASE % "scores-clinicos" + "#score/" + e["id"], "calc": e["id"],
            "m": [x for x in (limpa(e.get("subtitle")), limpa(e.get("specialty")), "População: " + limpa(e.get("population")) if e.get("population") else "",
                              "Faixa: " + limpa(e.get("range")) if e.get("range") else "") if x],
            "st": e.get("status") or "Catálogo do autor; conferir a fonte primária", "s": secs,
            "r": [[limpa(x.get("title")), x.get("url") or ""] for x in e.get("sources") or []]}
    grava("esc", "e-" + re.sub(r"[^a-z0-9-]", "-", e["id"].lower()), item, " · ".join(x for x in (e.get("subtitle"), e.get("specialty")) if x),
          " ".join((e.get("aliases") or []) + (e.get("keywords") or []) + (e.get("conditions") or [])))

# ------------------------------------------------------------------ índice e manifesto
indice.sort(key=lambda r: (list(grupos).index(r[0]), unicodedata.normalize("NFD", r[2]).encode("ascii", "ignore").decode().lower()))
json.dump({"gerado": HOJE, "itens": indice}, open(os.path.join(SAIDA, "indice.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump({"gerado": HOJE, "grupos": list(grupos.values()), "total": len(indice), "manual": {"linhas": len(linhas), "farmacos": len(por_farmaco), "diagnosticos": len(diag)}},
          open(os.path.join(SAIDA, "manifesto.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
tam = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(SAIDA) for f in fs)
print("itens:", len(indice), "|", ", ".join("%s %d" % (g["k"], g["itens"]) for g in grupos.values()), "| manual: %d linhas, %d fármacos, %d diagnósticos" % (len(linhas), len(por_farmaco), len(diag)),
      "| índice %d KB | total %.1f MB" % (os.path.getsize(os.path.join(SAIDA, "indice.json")) // 1024, tam / 1e6))
