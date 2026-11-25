#!/usr/bin/env python3
"""Integridade do acervo publicado: índice × arquivos, contagens por coleção,
linhas do Manual PPS, escores × calculadora embutida, figuras e segurança do conteúdo.
Uso: python3 tests/acervo.py dist/acervo [pasta-de-origem-do-app-de-escores]"""
import hashlib, json, pathlib, re, sys

base = pathlib.Path(sys.argv[1])
origem_escores = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else None
ESPERADO = {"proto": 110, "tera": 362, "neo": 87, "pps": 266, "mono": 498, "esc": 486, "trat": 161, "soro": 15}
falhas, total = [], 0

def ok(cond, msg):
    global total
    total += 1
    if not cond: falhas.append(msg)

idx = json.loads((base / "indice.json").read_text(encoding="utf-8"))
man = json.loads((base / "manifesto.json").read_text(encoding="utf-8"))
itens = idx["itens"]
chaves = [(e[0], e[1]) for e in itens]
ok(len(chaves) == len(set(chaves)), "itens repetidos no índice")
cont = {}
for e in itens: cont[e[0]] = cont.get(e[0], 0) + 1
ok(cont == ESPERADO, f"contagem por coleção: {cont}")
ok({g["k"]: g["itens"] for g in man["grupos"]} == ESPERADO, "manifesto difere das contagens")

ruim = re.compile(r"<\s*(script|iframe|object|embed|style)\b|javascript:|<[^>]+\son[a-z]+\s*=", re.I)  # o leitor ainda escapa todo texto
linhas_pps, calcs, figuras = set(), set(), set()
for g, i, titulo, *_ in itens:
    ok(re.fullmatch(r"[a-z]+", g) and re.fullmatch(r"[a-z0-9-]+", i), f"id fora do padrão: {g}/{i}")
    f = base / g / f"{i}.json"
    if not f.exists():
        falhas.append(f"arquivo ausente: {g}/{i}"); continue
    texto = f.read_text(encoding="utf-8")
    d = json.loads(texto)
    ok(d.get("t") == titulo and d.get("g") == g, f"título ou coleção não conferem: {g}/{i}")
    ok(isinstance(d.get("s"), list) and (len(d["s"]) > 0 or len(d.get("r") or []) > 0), f"item sem conteúdo: {g}/{i}")
    ok(not ruim.search(texto), f"conteúdo ativo no item: {g}/{i}")
    for r in d.get("r") or []:
        ok(isinstance(r, list) and len(r) == 2 and (not r[1] or str(r[1]).startswith(("https://", "http://"))), f"referência inválida em {g}/{i}: {r}")
    if d.get("u"): ok(str(d["u"]).startswith("https://"), f"origem sem https: {g}/{i}")
    if g == "pps":
        for s in d["s"]:
            m = re.match(r"Linha (\d+)", s.get("h", ""))
            if m: linhas_pps.add(int(m.group(1)))
    if d.get("calc"): calcs.add(d["calc"])
    for s in d["s"]:
        for t, h in s.get("ln", []):
            m = re.fullmatch(r"#t-[a-z]+(?:/([a-z]+)/([a-z0-9-]+))?", h)
            ok(bool(m) and (m.group(1) is None or (base / m.group(1) / (m.group(2) + ".json")).exists()), f"link interno inválido em {g}/{i}: {h}")
    for m in re.finditer(r"\]\((assets/[a-z0-9-]+\.svg)\)", texto): figuras.add(m.group(1))
ok(linhas_pps == set(range(1, 578)), f"linhas do Manual PPS: {len(linhas_pps)} de 577")
comb = json.loads((base / "trat" / "combinacoes.json").read_text(encoding="utf-8"))
ok([c[0] for c in comb] == list(range(1, 161)), "Tratado: combinações fora da sequência 1 a 160")
for n, combo, diag, dif, cid in comb:
    f = base / "trat" / f"{cid}.json"
    ok(f.exists() and json.loads(f.read_text(encoding="utf-8"))["t"] == diag and combo and dif, f"Tratado: combinação {n} incoerente")
ok((base / "trat" / "c-correcoes.json").exists(), "Tratado: tabela de correções ausente")
cat = json.loads((base / "pps" / "m-catalogo-de-diagnosticos.json").read_text(encoding="utf-8")) if (base / "pps" / "m-catalogo-de-diagnosticos.json").exists() else None
if cat is None:
    cat = next(json.loads(p.read_text(encoding="utf-8")) for p in (base / "pps").glob("*.json") if "Catálogo de diagnósticos" in p.read_text(encoding="utf-8")[:200])
ok(sum(len(s.get("b", [])) for s in cat["s"]) == 315, "catálogo de diagnósticos do manual difere de 315")
for fig in figuras: ok((base / "neo" / fig).exists(), f"figura ausente: {fig}")
ok(len(figuras) == 2, f"figuras neonatais: {figuras}")

# escores: cada item com calculadora aponta para um escore do app embutido, idêntico ao de origem
app = base / "escores"
import subprocess, tempfile
with tempfile.TemporaryDirectory() as tmp:
    saida = pathlib.Path(tmp) / "escores.json"
    subprocess.run(["node", str(pathlib.Path(__file__).resolve().parent.parent / "acervo" / "dump_escores.mjs"), str(app.resolve()), str(saida)], check=True, capture_output=True)
    ids_app = {e["id"] for e in json.loads(saida.read_text(encoding="utf-8"))}
ok(len(ids_app) == ESPERADO["esc"], f"o app embutido carrega {len(ids_app)} escores")
faltam = sorted(c for c in calcs if c not in ids_app)
ok(not faltam, f"escores sem calculadora no app embutido: {faltam[:5]}")
ok(len(calcs) == ESPERADO["esc"], f"itens de escore com calculadora: {len(calcs)}")
if origem_escores:
    for p in sorted(origem_escores.glob("*")):
        if p.suffix in (".mjs", ".html", ".css"):
            q = app / p.name
            ok(q.exists() and hashlib.sha256(q.read_bytes()).hexdigest() == hashlib.sha256(p.read_bytes()).hexdigest(), f"app de escores difere da origem: {p.name}")
print(f"{total} conferências do acervo; {len(falhas)} falhas")
for f in falhas[:30]: print("  -", f)
sys.exit(1 if falhas else 0)
