#!/usr/bin/env python3
"""Oráculo independente: recalcula, a partir de uma tabela digitada à parte
(sem ler o JavaScript do site), cada dose, volume, gota e vazão que o site
exibe para a matriz de pacientes, e compara com o que foi capturado da tela.
Uso: python3 oraculo.py matriz-novo.json"""
import json, math, re, sys

# ---------------- formatação (regras de exibição) ----------------
def arred(v, d):
    f = 10 ** d
    return math.floor((abs(v) + 1e-9) * f + 0.5) / f * (-1 if v < 0 else 1)

def _fmt(v, d):
    s = f"{arred(v, d):.{d}f}".replace(".", ",")
    if "," in s:
        s = s.rstrip("0").rstrip(",")
    return s

def num(v):
    a = abs(v)
    if a == 0: return "0"
    d = 3 if a < 0.1 else 2 if a < 10 else 1 if a < 100 else 0
    s = _fmt(v, d)
    if s == "0": s = _fmt(v, d + 2)
    return s

def mln(v):
    a = abs(v)
    if a == 0: return "0"
    d = 3 if a < 0.1 else 2 if a < 1 else 1 if a < 100 else 0
    s = _fmt(v, d)
    if s == "0": s = _fmt(v, 4)
    return s

def vaz(v):
    a = abs(v)
    d = 2 if a < 10 else 1 if a < 100 else 0
    s = _fmt(v, d)
    if s == "0" and a > 0: s = _fmt(v, 3)
    return s

def faixa(lo, hi, f=num):
    a, b = f(lo), f(hi)
    return [a] if a == b else [a, b]

def tokens(txt):
    t = str(txt).replace(" ", " ")
    t = re.sub(r"(?<=\d)[ ](?=\d{3})", "", t)
    return re.findall(r"\d+(?:,\d+)?", t)

def anos(txt):
    n = float(re.match(r"[\d.]+", txt).group())
    if "dia" in txt: return n / 365.25
    if "mes" in txt or "mês" in txt: return n / 12
    return n

# ---------------- motor de dose do oráculo ----------------
def dose(k, kg, mx=None, mxdia=None, n=1, dia=False, mn=None):
    lo, hi = (k if isinstance(k, (list, tuple)) else (k, k))
    div = n if dia else 1
    lo, hi = lo * kg / div, hi * kg / div
    teto = mx
    if mxdia is not None:
        teto = mxdia / div if teto is None else min(teto, mxdia / div)
    if teto is not None:
        lo, hi = min(lo, teto), min(hi, teto)
    if mn is not None:
        lo, hi = max(lo, mn), max(hi, mn)
    return lo, hi

falhas, total = [], 0
def confere(caso, onde, exibido, esperado):
    """esperado: lista de números já formatados, na ordem em que devem aparecer."""
    global total
    total += 1
    got = tokens(exibido)[:len(esperado)]
    if got != esperado:
        falhas.append(f"{caso['peso']} kg, {caso['idade']}, {caso['sexo']} | {onde}: esperado {esperado}, exibido {got} | texto: {str(exibido)[:110]}")

def linha(tab, nome):
    for r in tab:
        if r and r[0] == nome: return r
    return None

# ---------------- tabelas do oráculo (digitadas à parte) ----------------
def carta(kg, a):
    neo = a * 365.25 < 28
    return {
        "Adrenalina IV/IO (PCR)": (0.01, 1, None, 0.1),
        "Adrenalina endotraqueal": (0.1, 2.5, None, 1),
        "Amiodarona": (5, 300, None, 50),
        "Lidocaína sem vasoconstritor": (1, 100, None, 20),
        "Sulfato de magnésio": (50, 2000, None, 500),
        "Bicarbonato de sódio 8,4%": (1, 50, None, 1),
        "Gluconato de cálcio 10%": (60, 2000, None, 100),
        "Cloreto de cálcio 10%": (20, 1000, None, 100),
        "Atropina": (0.02, 1 if a >= 12 else 0.5, 0.1, 0.5),
        "Adenosina — 1ª dose": (0.1, 6, None, 3),
        "Adenosina — 2ª dose": (0.2, 12, None, 3),
        "Naloxona": (0.1, 2, None, 0.4),
        "Glicose 10%": (2 if neo else 5, 250, None, None),
        "Cristaloide (expansão)": (10 if neo else 20, 1000, None, None),
    }

def via(kg, a):
    return {
        "Atropina": (0.02, 0.5, 0.5), "Fentanil": ((1, 3), 150, 50), "Midazolam": ((0.1, 0.3), 10, 5),
        "Cetamina": ((1, 2), 200, 50), "Etomidato": ((0.2, 0.3), 40, 2), "Propofol": ((1, 2.5), 200, 10),
        "Succinilcolina (suxametônio)": (2 if a < 2 else (1, 1.5), 200, 10), "Rocurônio": ((1, 1.2), 120, 10),
        "Vecurônio": ((0.1, 0.2), 20, 1), "Cisatracúrio": ((0.1, 0.2), 20, 2), "Sugamadex": (16, None, 100),
    }

def antidotos(kg, a):
    return {
        "Naloxona": (0.1, 2, 0.4), "Flumazenil": (0.01, 0.2, 0.1), "Atropina": ((0.02, 0.05), 3, 0.5),
        "Pralidoxima": ((20, 40), 2000, 20), "Biperideno": (0.04, 5, 5), "Bicarbonato de sódio 8,4%": ((1, 2), None, 1),
        "Azul de metileno 1%": ((1, 2), None, 10), "Glucagon": ((0.05, 0.15), 5, 1), "Insulina regular em dose alta": (1, None, 1),
        "Gluconato de cálcio 10%": (60, 3000, 100), "Hidroxocobalamina": (70, 5000, 25), "Octreotida": ((1, 1.5), 100, 100),
        "Emulsão lipídica 20%": (1.5, 100, None), "Fomepizol": (15, None, 1000), "Fisostigmina": (0.02, 2 if a >= 12 else 0.5, 1),
    }

def proced(kg, a):
    m = a * 12
    return {
        "Cetamina IV": ((1, 2), 100, 50, m < 3), "Cetamina IM": ((4, 5), None, 50, m < 3),
        "Midazolam IV": ((0.05, 0.1) if a < 6 else (0.025, 0.05), 2.5, 5, False), "Midazolam intranasal": ((0.2, 0.5), 10, 5, False),
        "Midazolam oral": ((0.25, 0.5), 20, 2, False), "Propofol IV": (1, 100, 10, False), "Etomidato IV": ((0.1, 0.2), 20, 2, False),
        "Dexmedetomidina intranasal (off label)": ((2, 3), 200, 100, False), "Fentanil IV": ((1, 2), 50, 50, False),
        "Fentanil intranasal": ((1.5, 2), 100, 50, False), "Lidocaína sem vasoconstritor": (4.5, 300, 10, False),
        "Lidocaína com adrenalina": (7, 500, 10, False), "Naloxona, reversão titulada": ((0.001, 0.005), 0.4, 0.04, False),
        "Flumazenil": (0.01, 0.2, 0.1, False),
    }

# (nome, unidade, [(mg ou g por kg, limite absoluto, idade a partir da qual o limite vale)], [(quantidade por unidade, é volume em mL)])
ETANOL = 0.789
TOXICOS = [
    ("Paracetamol", "mg", [(150, 7500, None), (200, 10000, 6)], [(200, True), (500, False), (750, False)]),
    ("Ácido acetilsalicílico e salicilatos", "mg", [(150, 6500, None), (300, None, None), (500, None, None)], [(100, False), (500, False)]),
    ("Ferro elementar", "mg", [(20, None, None), (40, None, None), (60, None, None)], [(25, True), (40, False)]),
    ("Ibuprofeno", "mg", [(100, None, None), (400, None, None)], [(100, True), (50, True)]),
    ("Antidepressivos tricíclicos (amitriptilina, imipramina, clomipramina)", "mg", [(5, None, None), (10, None, None)], [(25, False)]),
    ("Difenidramina ou dimenidrinato", "mg", [(7.5, 300, 6)], [(50, False)]),
    ("Carbamazepina", "mg", [(20, None, None), (50, None, None)], [(200, False), (20, True)]),
    ("Isoniazida", "mg", [(20, None, None), (35, None, None), (80, None, None)], [(100, False)]),
    ("Etanol", "g", [(3, None, None)], [(ETANOL * 0.40, True), (ETANOL * 0.12, True), (ETANOL * 0.05, True)]),
]

def pbw_modo(kg, a, sx):
    if a >= 16: return (45.5 if sx == "F" else 50) + 0.91 * ((160 if sx == "F" else 170) - 152.4)
    return kg

# (unidade da dose, mínimo, máximo, quantidade em 50 mL, unidade da quantidade)
INFUSOES = {
    "Noradrenalina": ("mcg/kg/min", 0.05, 2, 4, "mg"), "Adrenalina": ("mcg/kg/min", 0.05, 1, 4, "mg"),
    "Dopamina": ("mcg/kg/min", 5, 20, 100, "mg"), "Dobutamina": ("mcg/kg/min", 2, 20, 250, "mg"),
    "Milrinona": ("mcg/kg/min", 0.25, 0.75, 10, "mg"), "Vasopressina": ("mU/kg/min", 0.3, 2, 20, "U"),
    "Fenilefrina": ("mcg/kg/min", 0.1, 1, 10, "mg"), "Nitroprussiato de sódio": ("mcg/kg/min", 0.5, 3, 25, "mg"),
    "Nitroglicerina": ("mcg/kg/min", 0.5, 5, 10, "mg"), "Alprostadil (PGE1)": ("mcg/kg/min", 0.01, 0.1, 500, "mcg"),
    "Amiodarona": ("mcg/kg/min", 5, 15, 100, "mg"), "Lidocaína": ("mcg/kg/min", 20, 50, 1000, "mg"),
    "Esmolol": ("mcg/kg/min", 50, 300, 500, "mg"), "Terbutalina": ("mcg/kg/min", 0.1, 4, 5, "mg"),
    "Salbutamol": ("mcg/kg/min", 0.5, 5, 5, "mg"), "Sulfato de magnésio": ("mg/kg/h", 10, 30, 2000, "mg"),
    "Midazolam": ("mg/kg/h", 0.05, 0.3, 50, "mg"), "Fentanil": ("mcg/kg/h", 1, 5, 500, "mcg"),
    "Morfina": ("mg/kg/h", 0.01, 0.1, 10, "mg"), "Remifentanil": ("mcg/kg/min", 0.05, 0.3, 2, "mg"),
    "Dexmedetomidina": ("mcg/kg/h", 0.2, 1.5, 200, "mcg"), "Cetamina": ("mg/kg/h", 0.1, 2, 500, "mg"),
    "Propofol": ("mg/kg/h", 1, 4, 500, "mg"), "Rocurônio": ("mg/kg/h", 0.3, 1, 50, "mg"),
    "Cisatracúrio": ("mcg/kg/min", 1, 3, 20, "mg"), "Insulina regular": ("U/kg/h", 0.05, 0.1, 50, "U"),
    "Furosemida": ("mg/kg/h", 0.05, 0.4, 50, "mg"),
}
def vazao(nome, d, kg, vol):
    un, _, _, q, uq = INFUSOES[nome]
    porh = d * kg * (60 if un.endswith("/min") else 1)
    base = un.split("/")[0]
    if (base, uq) in (("mcg", "mg"), ("mU", "U")): porh /= 1000
    return porh / (q / vol)

def posologias(kg, a):
    """nome -> (k, teto por dose, teto diário, doses/dia ou None, mínimo, [(conc, gotas/mL)], bloqueado)"""
    neo, m = a * 365.25 < 28, a * 12
    t = {}
    t["Paracetamol"] = ((10, 15), 466 if a < 12 else 1000, min((60 if neo else 75) * kg, 4000), None, None, [(200, 15), (32, None), (100, None)], False)
    t["Dipirona (oral)"] = ((10, 20), 1000, 4000, None, None, [(500, 20), (50, None)], m < 3 or kg < 5)
    t["Dipirona (injetável)"] = ((10, 20), 1000, 4000, None, None, [(500, None)], m < 3 or kg < 5)
    t["Ibuprofeno"] = ((5, 10), 200 if a < 12 else 400, min(40 * kg, 800) if a < 12 else 1200, None, None, [(50, 10), (100, 10)], m < 6)
    t["Cetoprofeno"] = (1, 25 if a < 12 else 50, 300, None, None, [(20, 20)], a < 1)
    t["Morfina"] = ((0.025, 0.05) if m < 6 else (0.05, 0.1), 5, None, None, None, [(1, None)], False)
    t["Fentanil (bolus ou intranasal)"] = ((1, 2), 100, None, None, None, [(50, None)], False)
    t["Tramadol"] = ((1, 2), 100, min(8 * kg, 400), None, None, [(50, None), (100, 40)], a < 1)
    t["Ondansetrona (injetável)"] = (0.15, 8, None, None, None, [(2, None)], m < 6)
    t["Bromoprida"] = ((0.5, 1), 10, None, 3, None, [(4, 24), (5, None)], a < 1)
    t["Dimenidrinato + piridoxina"] = (1.25, 50, 75 if a < 6 else 150 if a < 12 else 400, None, None, [(25, 20), (3, None)], a < 2)
    t["Adrenalina IM (anafilaxia)"] = (0.01, 0.5, None, None, None, [(1, None)], False)
    t["Hidroxizina"] = ((0.5, 1), 25, min(2 * kg, 100), None, None, [(2, None)], m < 6)
    t["Prometazina"] = ((0.25, 0.5), 25, None, None, None, [(25, None)], a < 2)
    t["Prednisolona"] = ((1, 2), None, 40, 1, None, [(3, None)], False)
    t["Dexametasona"] = ((0.15, 0.6), 16, None, None, None, [(4, None)], False)
    t["Hidrocortisona"] = ((2, 4), 100, None, None, None, [(50, None)], False)
    t["Metilprednisolona"] = ((1, 2), None, 60, 4, None, [(40, None)], False)
    t["Salbutamol para nebulização"] = (0.15, 5, None, None, 2.5, [(5, 20)], False)
    t["Sulfato de magnésio (asma)"] = ((25, 50), 2000, None, None, None, [(100, None), (500, None)], False)
    t["Terbutalina subcutânea"] = (0.01, 0.25, None, None, None, [(0.5, None)], False)
    t["Amoxicilina (dose padrão)"] = (50, 500, None, 3, None, [(50, None)], m < 2)
    t["Amoxicilina (dose alta)"] = ((80, 90), None, 4000, 2, None, [(80, None)], m < 2)
    t["Amoxicilina + clavulanato"] = (50, 875, None, 2, None, [(80, None)], m < 2)
    t["Cefalexina"] = ((50, 100), 1000, None, 4, None, [(50, None)], False)
    t["Cefuroxima axetil"] = ((20, 30), 500, None, 2, None, [(50, None)], m < 3)
    t["Azitromicina"] = (10, None, 500, 1, None, [(40, None)], False)
    t["Claritromicina"] = (15, 500, None, 2, None, [(50, None), (25, None)], m < 6)
    t["Sulfametoxazol + trimetoprima"] = ((8, 10), 160, None, 2, None, [(8, None)], m < 2)
    t["Ceftriaxona"] = ((50, 100), 2000, 4000, 1, None, [(100, None), (250, None)], neo)
    t["Ampicilina"] = (50, 2000, None, None, None, [(100, None)], False)
    t["Gentamicina"] = ((4, 5) if neo else (5, 7.5), None, None, 1, None, [(40, None)], False)
    t["Oxacilina"] = ((100, 200), 2000, None, 4, None, [(100, None)], False)
    t["Clindamicina"] = ((20, 40), 900, None, 3, None, [(150, None)], neo)
    t["Metronidazol"] = (30, 500, None, 3, None, [(40, None), (5, None)], neo)
    t["Aciclovir (injetável)"] = (20 if a * 365.25 < 90 else (10, 15), None, None, None, None, [(25, None)], False)
    t["Escopolamina (butilbrometo)"] = (1.5 if m < 3 else 0.7 if a < 1 else (0.3, 0.5), 20, None, None, None, [(10, 20), (20, None)], False)
    t["Omeprazol"] = (1, None, 40, 1, None, [(4, None)], neo)
    t["Midazolam (crise convulsiva)"] = (0.2, 10, None, None, None, [(5, None)], False)
    t["Diazepam"] = ((0.15, 0.2), 10, None, None, None, [(5, None)], neo)
    t["Fenitoína"] = (20, 1500, None, None, None, [(50, None)], False)
    t["Fenobarbital"] = ((15, 20), 1000, None, None, None, [(100, None)], False)
    t["Levetiracetam"] = ((40, 60), 4500, None, None, None, [(100, None)], False)
    t["Cetamina (procedimento)"] = ((1, 2), 100, None, None, None, [(50, None)], m < 3)
    t["Furosemida"] = ((0.5, 2), 40, None, None, None, [(10, None)], False)
    return t

def holliday(kg):
    d = 100 * kg if kg <= 10 else 1000 + 50 * (kg - 10) if kg <= 20 else 1500 + 20 * (kg - 20)
    return min(d, 2400)

def fracao(a, sexo):
    if a * 365.25 < 28: return 0.75
    if a < 1: return 0.7
    if a < 12: return 0.6
    if a >= 65: return 0.45 if sexo == "F" else 0.5
    return 0.5 if sexo == "F" else 0.6

def rj(x): return math.floor(x + 0.5)  # arredondamento do JavaScript

# ---------------- conferência ----------------
dados = json.load(open(sys.argv[1], encoding="utf-8"))
ruins = ("NaN", "undefined", "Infinity", "[object", "null")
for reg in dados["casos"]:
    c, b = reg["caso"], reg["base"]
    kg, a, sx = c["peso"], anos(c["idade"]), c["sexo"]
    neo, adulto = a * 365.25 < 28, a >= 16

    # textos inválidos em qualquer campo
    for k, v in b.items():
        s = json.dumps(v, ensure_ascii=False)
        total += 1
        if any(r in s for r in ruins):
            falhas.append(f"{kg} kg, {c['idade']} | {k}: texto inválido: {s[:90]}")

    # carta de parada
    for nome, (k, mx, mn, conc) in carta(kg, a).items():
        r = linha(b["cartaDrogas"], nome)
        lo, hi = dose(k, kg, mx, mn=mn)
        confere(c, f"carta/{nome}/dose", r[2], faixa(lo, hi))
        confere(c, f"carta/{nome}/volume", r[3], faixa(lo / conc, hi / conc, mln) if conc else faixa(lo, hi))
    r = linha(b["cartaDrogas"], "Atropina")
    lo, hi = dose(0.02, kg, 1 if a >= 12 else 0.5, mn=0.1)
    confere(c, "carta/atropina 0,25 mg/mL", r[3], faixa(lo / 0.5, hi / 0.5, mln) + ["0,5"] + faixa(lo / 0.25, hi / 0.25, mln))
    r = linha(b["cartaDrogas"], "Lidocaína sem vasoconstritor")
    lo, hi = dose(1, kg, 100)
    confere(c, "carta/lidocaína 1%", r[3], faixa(lo / 20, hi / 20, mln) + ["2"] + faixa(lo / 10, hi / 10, mln))
    r = linha(b["cartaDrogas"], "Sulfato de magnésio")
    lo, hi = dose(50, kg, 2000)
    confere(c, "carta/magnésio 10%", r[3], faixa(lo / 500, hi / 500, mln) + ["50"] + faixa(lo / 100, hi / 100, mln))
    lo, hi = dose(0.01, kg, 1)
    confere(c, "sPcr", b["sPcr"], faixa(lo, hi) + faixa(lo / 0.1, hi / 0.1, mln))

    # sequência rápida
    for nome, (k, mx, conc) in via(kg, a).items():
        r = linha(b["viaTab"], nome)
        lo, hi = dose(k, kg, mx)
        confere(c, f"via/{nome}/dose", r[2], faixa(lo, hi))
        confere(c, f"via/{nome}/volume", r[3], faixa(lo / conc, hi / conc, mln))

    # sedação e analgesia para procedimento
    for nome, (k, mx, conc, bloq) in proced(kg, a).items():
        r = linha(b["procTab"], nome)
        if r is None:
            falhas.append(f"{kg} kg | sedação ausente: {nome}"); continue
        total += 1
        if bloq:
            if not r[2].startswith("Não usar"): falhas.append(f"{kg} kg, {c['idade']} | sedação/{nome}: deveria estar bloqueada | {r[2]}")
            continue
        lo, hi = dose(k, kg, mx)
        confere(c, f"sedação/{nome}/dose", r[2], faixa(lo, hi))
        confere(c, f"sedação/{nome}/volume", r[3], faixa(lo / conc, hi / conc, mln))
    r = linha(b["procTab"], "Naloxona, reversão titulada"); lo, hi = dose((0.001, 0.005), kg, 0.4)
    confere(c, "sedação/naloxona ampola", r[3], faixa(lo / 0.04, hi / 0.04, mln) + ["0,04"] + faixa(lo / 0.4, hi / 0.4, mln))

    # doses tóxicas por peso
    linhas_tox = b["toxTab"]
    for nome, un, lims, aps in TOXICOS:
        ini = next((i for i, rr in enumerate(linhas_tox) if len(rr) == 1 and rr[0] == nome), None)
        if ini is None:
            falhas.append(f"{kg} kg | dose tóxica ausente: {nome}"); continue
        for j, (k, cap, cap_idade) in enumerate(lims):
            rr = linhas_tox[ini + 1 + j]
            v = k * kg
            if cap is not None and (cap_idade is None or a >= cap_idade) and v > cap: v = cap
            confere(c, f"tóxica/{nome}/{k}", rr[1], [num(v)] if un == "g" else ([num(v / 1000)] if v >= 1000 else [num(v)]))
            segs = rr[2].split("; ")
            total += 1
            esperado = []
            for q, eh_ml in aps:
                x = v / q
                esperado.append(num(x / 1000) if (eh_ml and x >= 1000) else (mln(x) if eh_ml else num(x)))
            obtido = [tokens(sg)[0] if tokens(sg) else "" for sg in segs]
            if obtido != esperado:
                falhas.append(f"{kg} kg | tóxica/{nome}/{k}/equivalência: esperado {esperado}, exibido {obtido}")

    # modo ventilatório (VCV, o primeiro da lista)
    if neo: esp_vt = ["4", "6", mln(4 * pbw_modo(kg, a, sx)), mln(6 * pbw_modo(kg, a, sx))]
    elif a >= 12:
        w = pbw_modo(kg, a, sx)
        esp_vt = ["6", f"{arred(w, 1):.1f}".replace(".", ","), mln(6 * w), "4", "8", mln(4 * w), mln(8 * w)]
    else: esp_vt = ["6", "8", mln(6 * kg), mln(8 * kg), "4", "6"]
    confere(c, "modoVt", b["modoVt"], esp_vt)

    # antídotos
    for nome, (k, mx, conc) in antidotos(kg, a).items():
        r = linha(b["intoxTab"], nome)
        lo, hi = dose(k, kg, mx)
        confere(c, f"antídoto/{nome}/dose", r[3], faixa(lo, hi))
        confere(c, f"antídoto/{nome}/volume", r[4], faixa(lo / conc, hi / conc, mln) if conc else faixa(lo, hi))

    # choque elétrico
    if adulto:
        confere(c, "sDesf", b["sDesf"], ["200"])
    else:
        confere(c, "sDesf", b["sDesf"], [num(min(2 * kg, 200))])
        confere(c, "sDesf2", b["sDesf2"], [num(min(4 * kg, 200)), "4", num(min(10 * kg, 200))])
        confere(c, "sCardio", b["sCardio"], faixa(min(0.5 * kg, 100), min(kg, 200)))
        confere(c, "sCardio2", b["sCardio2"], [num(min(2 * kg, 200))])

    # painel
    confere(c, "defMl", b["defMl"], [mln(kg * 50)])
    confere(c, "defH", b["defH"], [mln(kg * 25), mln(kg * 25 / 8)])
    confere(c, "defH2", b["defH2"], [mln(kg * 25), mln(kg * 25 / 16)])
    confere(c, "scRef", b["scRef"], [f"{arred((4 * kg + 7) / (kg + 90), 2):.2f}".replace(".", ",")])
    pas = 60 if neo else 70 if a < 1 else 70 + 2 * math.floor(a) if a < 10 else 90
    confere(c, "paRef", b["paRef"], [str(pas)])
    if 2 <= a < 16:
        com = min(a / 4 + 3.5, 7.0 if sx == "F" else 7.5)
        lo_t, hi_t = math.floor(com * 2 + 1e-9) / 2, math.ceil(com * 2 - 1e-9) / 2
        confere(c, "totCom", b["totCom"], [f"{lo_t:.1f}".replace(".", ",")] + ([f"{hi_t:.1f}".replace(".", ",")] if hi_t != lo_t else []))
        prof = min(a / 2 + 12, 21 if sx == "F" else 23)
        confere(c, "tubCm", b["tubCm"], [f"{arred(prof, 1):.1f}".replace(".", ",")])
    if neo:
        confere(c, "tubCm (RN)", b["tubCm"], [f"{arred(kg + 6, 1):.1f}".replace(".", ",")])

    # estado de mal
    def dvx(k, mx, conc):
        lo, hi = dose(k, kg, mx); return faixa(lo, hi) + faixa(lo / conc, hi / conc, mln)
    confere(c, "mIM", b["mIM"], dvx(0.2, 10, 5)); confere(c, "mIN", b["mIN"], dvx(0.2, 10, 5))
    confere(c, "mBuc", b["mBuc"], dvx(0.3, 10, 5)); confere(c, "mIV", b["mIV"], dvx((0.1, 0.2), 10, 5))
    if not neo:
        confere(c, "mDzIV", b["mDzIV"], dvx((0.15, 0.2), 10, 5)); confere(c, "mRet", b["mRet"], dvx(0.5, 20, 5))
    confere(c, "mLev", b["mLev"], dvx((40, 60), 4500, 100)); confere(c, "mFb", b["mFb"], dvx((15, 20), 1000, 100))
    lo, hi = dose(20, kg, 1500)
    confere(c, "mFen", b["mFen"], faixa(lo, hi) + faixa(lo / 50, hi / 50, mln) + ["50", str(rj(max(hi / min(kg, 50), 20)))])
    if a >= 2: confere(c, "mVal", b["mVal"], dvx((20, 40), 3000, 100))
    confere(c, "mCont", b["mCont"], [vaz(0.3 * kg), "1", "50", "50", "1", "10"] + faixa(0.06 * kg, 0.6 * kg, vaz))

    # trauma
    confere(c, "trVol", b["trVol"], faixa(min(10 * kg, 1000), min(20 * kg, 1000), mln))
    if 10 * kg < 300: confere(c, "trTr", b["trTr"], faixa(10 * kg, 20 * kg, mln))
    confere(c, "trTxa", b["trTxa"], [num(min(15 * kg, 1000))])
    confere(c, "trTxaCap", b["trTxaCap"], ["10", mln(min(15 * kg, 1000) / 50), "50", "15", "1", num(min(2 * kg, 125))])
    confere(c, "trSH", b["trSH"], faixa(min(2 * kg, 250), min(5 * kg, 250), mln))
    confere(c, "trMan", b["trMan"], faixa(0.5 * kg, kg) + faixa(2.5 * kg, 5 * kg, mln))

    # intoxicações
    g = min(kg, 50)
    confere(c, "itCarv", b["itCarv"], [num(g), mln(g * 10)])
    w = min(kg, 100)
    for i, f in enumerate((150, 50, 100), 1):
        confere(c, f"itNac{i}", b[f"itNac{i}"], [num(f * w), mln(f * w / 100)])
    dil = [3 * kg, 7 * kg, 14 * kg] if kg <= 20 else [100, 250, 500] if kg <= 40 else [200, 500, 1000]
    confere(c, "itNacDil", b["itNacDil"], ["5", "1", mln(dil[0]), "2", mln(dil[1]), "3", mln(dil[2])])

    # metabólicos
    confere(c, "meIns", b["meIns"], faixa(0.05 * kg, 0.1 * kg) + faixa(0.05 * kg, 0.1 * kg, vaz))
    fr = fracao(a, sx)
    confere(c, "meNa", b["meNa"], [num(fr * kg * 8)])
    confere(c, "meExp", b["meExp"], faixa(min(10 * kg, 1000), min(20 * kg, 1000), mln))
    if not adulto:
        hs = holliday(kg) / 24
        confere(c, "meHid", b["meHid"], [vaz(hs + 70 * kg / 48), "7", "5", vaz(hs + 50 * kg / 48), "10", vaz(hs + 100 * kg / 48)])
    lo, hi = dose(60, kg, 2000)
    confere(c, "meCa", b["meCa"], faixa(lo, hi) + faixa(lo / 100, hi / 100, mln))
    confere(c, "meInsK", b["meInsK"], [num(min(0.1 * kg, 10)), mln(min(5 * kg, 250))])
    k = min(0.5 * kg, 40)
    confere(c, "meK", b["meK"], [num(k), mln(k / 2.56), "19,1", mln(k / 1.34), "10", mln(k / 40 * 1000)])
    confere(c, "meG10", b["meG10"], [mln(min((2 if neo else 5) * kg, 250))])

    # diluições
    for nome, (un, dmin, dmax, q, uq) in INFUSOES.items():
        r = linha(b["dvTable"], nome)
        confere(c, f"infusão/{nome}/50 mL", r[4], faixa(vazao(nome, dmin, kg, 50), vazao(nome, dmax, kg, 50), vaz))
        confere(c, f"infusão/{nome}/100 mL", r[5], faixa(vazao(nome, dmin, kg, 100), vazao(nome, dmax, kg, 100), vaz))
    for i, regra in enumerate((0.3, 3, 0.6, 6)):
        confere(c, f"regra {regra} mg × peso", b["dvRegra"][i][1], [num(regra * kg)])
    confere(c, "dvOut (noradrenalina 0,05)", b["dvOut"], [vaz(vazao("Noradrenalina", 0.05, kg, 50))])

    # posologias
    for nome, (k, mx, mxdia, n, mn, apres, bloq) in posologias(kg, a).items():
        r = linha(b["posTab"], nome)
        if r is None:
            falhas.append(f"{kg} kg | posologia ausente: {nome}"); continue
        total += 1
        exib_bloq = bool(re.match(r"(Não usar|Recém-nascido|Menor de)", r[3]))
        if exib_bloq != bloq:
            falhas.append(f"{kg} kg, {c['idade']} | posologia/{nome}: bloqueio esperado {bloq}, exibido {exib_bloq} | {r[3][:70]}")
            continue
        if bloq: continue
        lo, hi = dose(k, kg, mx, mxdia, n or 1, dia=n is not None, mn=mn)
        confere(c, f"posologia/{nome}/dose", r[3], faixa(lo, hi))
        vols, gts = [], []
        for conc, gpm in apres:
            vols += faixa(lo / conc, hi / conc, mln) + [None]
            if gpm:
                x, y = rj(lo / conc * gpm), rj(hi / conc * gpm)
                gts.append([str(x)] if x == y else [str(x), str(y)])
        # volume: confere a 1ª apresentação (as demais têm números de rótulo no meio)
        confere(c, f"posologia/{nome}/volume", r[5], faixa(lo / apres[0][0], hi / apres[0][0], mln))
        com_gotas = [(cc, gg) for cc, gg in apres if gg]
        if com_gotas and rj(hi / com_gotas[0][0] * com_gotas[0][1]) >= 1:
            confere(c, f"posologia/{nome}/gotas", r[6], gts[0])

    # posologias por faixa
    r = linha(b["posTab"], "Ondansetrona (oral)")
    if kg >= 8: confere(c, "ondansetrona oral", r[3], ["2" if kg <= 15 else "4" if kg <= 30 else "8"])
    r = linha(b["posTab"], "Salbutamol spray")
    if not neo: confere(c, "salbutamol spray", r[3], [str(max(2, min(10, rj(kg / 3))))])
    r = linha(b["posTab"], "Ipratrópio")
    confere(c, "ipratrópio", r[3], ["0,25" if kg < 20 else "0,5"])
    r = linha(b["posTab"], "Oseltamivir")
    osel = (3 if a * 12 < 9 else 3.5) * kg if a < 1 else 30 if kg <= 15 else 45 if kg <= 23 else 60 if kg <= 40 else 75
    confere(c, "oseltamivir", r[3], [num(osel)]); confere(c, "oseltamivir/volume", r[5], [mln(osel / 10)])
    r = linha(b["posTab"], "Penicilina G benzatina")
    confere(c, "benzatina", r[3], [num(50000 * kg)] if kg < 10 else ["600000"] if kg < 20 else ["600000", "27", "1200000", "20"] if kg < 27 else ["1200000"])
    r = linha(b["posTab"], "Loratadina")
    if a >= 2: confere(c, "loratadina", r[3], ["5" if kg < 30 else "10"])
    r = linha(b["posTab"], "Dexclorfeniramina")
    if a >= 2: confere(c, "dexclorfeniramina", r[3], ["0,5" if a < 6 else "1" if a < 12 else "2"])
    r = linha(b["posTab"], "Desloratadina")
    if a >= 0.5: confere(c, "desloratadina", r[3], ["1" if a < 1 else "1,25" if a < 6 else "2,5" if a < 12 else "5"])

    # soroterapia
    confere(c, "soExp", b["soExp"], [mln(min((10 if neo else 20) * kg, 1000))])
    hs = holliday(kg)
    confere(c, "soMan", b["soMan"], [vaz(hs / 24)])
    confere(c, "soManCap", b["soManCap"], [num(hs)])
    p1, p2, p3 = 4 * min(kg, 10), 2 * max(0, min(kg - 10, 10)), max(kg - 20, 0)
    confere(c, "so421a", b["so421a"], [vaz(p1)]); confere(c, "so421b", b["so421b"], [vaz(p2)]); confere(c, "so421c", b["so421c"], [vaz(p3)])
    confere(c, "so421t", b["so421t"], [vaz(min(p1 + p2 + p3, 100))])
    vn, vk = 68 / 3.4, 13 / 2.56
    tot = 500 + vn + vk
    confere(c, "soVol", b["soVol"], [mln(vn), "20", mln(vk)])
    confere(c, "soNaF", b["soNaF"], [str(rj(68 / tot * 1000))]); confere(c, "soKF", b["soKF"], [str(rj(13 / tot * 1000))])
    confere(c, "soPlB", b["soPlB"], faixa(50 * kg, 100 * kg, mln))
    if neo: confere(c, "soPlC", b["soPlC"], [mln(10 * kg)])
    elif a < 1: confere(c, "soPlC", b["soPlC"], [mln(30 * kg), "1", mln(70 * kg), "5"])
    else: confere(c, "soPlC", b["soPlC"], [mln(30 * kg), "30", mln(70 * kg), "2", "30"])
    tx = (130 if kg <= 10 else 100 if kg <= 20 else 80) if a < 13 else 60
    confere(c, "dgOral", b["dgOral"], [mln(tx * kg), str(tx), mln(tx * kg / 3)])
    confere(c, "dgC", b["dgC"], [mln(10 * kg)]); confere(c, "dgD", b["dgD"], [mln(20 * kg)])
    confere(c, "dgCman", b["dgCman"], [mln(25 * kg), "6", vaz(25 * kg / 6), mln(25 * kg), "8", vaz(25 * kg / 8)])

    # correção
    confere(c, "coFrac", b["coFrac"], [str(rj(fr * 100))])
    confere(c, "coAgua", b["coAgua"], [f"{arred(fr * kg, 1):.1f}".replace(".", ",")])
    confere(c, "coDef", b["coDef"], [num(fr * kg * 8)])
    confere(c, "coVol3", b["coVol3"], [mln(fr * kg * 8 / 0.513)])
    confere(c, "coVel", b["coVel"], [num(fr * kg * 8), "24", vaz(fr * kg * 8 / 0.513 / 24)])
    confere(c, "coBolus", b["coBolus"], faixa(min(3 * kg, 150), min(5 * kg, 150), mln))
    reps = {"Potássio": ((0.5, 1), 40, 2.56), "Cálcio": ((50, 100), 2000, 100), "Magnésio": ((25, 50), 2000, 100),
            "Fósforo": ((0.15, 0.33), None, 1.1), "Bicarbonato": ((1, 2), None, 1)}
    for nome, (k, mx, conc) in reps.items():
        r = linha(b["coTab"], nome); lo, hi = dose(k, kg, mx)
        confere(c, f"reposição/{nome}/dose", r[2], faixa(lo, hi)); confere(c, f"reposição/{nome}/volume", r[4], faixa(lo / conc, hi / conc, mln))
    r = b["coTab"][0]; lo, hi = min(3 * kg, 150), min(5 * kg, 150)
    confere(c, "reposição/sódio/mEq", r[2], faixa(lo * 0.513, hi * 0.513)); confere(c, "reposição/sódio/volume", r[4], faixa(lo, hi))

    # ventilação e alto fluxo
    if a >= 16:
        pbw = (45.5 if sx == "F" else 50) + 0.91 * ((160 if sx == "F" else 170) - 152.4)
    else:
        pbw = kg
    confere(c, "vmPeso", b["vmPeso"], [f"{arred(pbw, 1):.1f}".replace(".", ",")])
    confere(c, "vmVt", b["vmVt"], [mln(6 * pbw)])
    fl = 2 * kg if kg < 13 else 30 if kg < 16 else 35 if kg < 31 else 40 if kg < 51 else 50
    confere(c, "vnCnaf", b["vnCnaf"], [num(fl)])

    # choques (variantes)
    fx = {"sep": (10, 20), "ana": (10, 20), "hipo": (20, 20), "card": (5, 10), "neu": (10, 20), "obs": (10, 20)}
    for tp, (x, y) in fx.items():
        v = reg["variantes"]["choque=" + tp]
        if neo: y = min(y, 10); x = min(x, y)
        confere(c, f"choque/{tp}/expansão", v["chExp"], faixa(min(x * kg, 1000), min(y * kg, 1000), mln))
    v = reg["variantes"]["choque=ana"]; lo, hi = dose(0.01, kg, 0.5)
    confere(c, "choque/anafilático/adrenalina IM", v["chVaso"], faixa(lo, hi) + faixa(lo, hi, mln))
    v = reg["variantes"]["choque=sep"]
    confere(c, "choque/séptico/vazão", v["chVaso"], [vaz(vazao("Noradrenalina" if adulto else "Adrenalina", 0.1, kg, 50))])
    v = reg["variantes"]["choque=card"]
    confere(c, "choque/cardiogênico/vazão", v["chVaso"], [vaz(vazao("Adrenalina", 0.05, kg, 50))])

    # antibióticos (amostra por síndrome)
    atb = reg["variantes"]["atb"]
    def ab(sind, linha_n, k, n, mx=None, mxdia=None):
        r = atb[sind][linha_n]; lo, hi = dose(k, kg, mx, mxdia, n, dia=True)
        confere(c, f"antibiótico/{sind[:22]}/{r[1]}", r[3], faixa(lo, hi))
    S = "Sepse e choque séptico comunitário (após o período neonatal)"
    ab(S, 0, 100, 2, 2000); ab(S, 1, 60, 4, 1000); ab(S, 2, 40, 3, 900); ab(S, 3, 150, 3, 2000); ab(S, 4, 60, 3, 1000)
    ab("Pneumonia comunitária", 0, (80, 90), 2, None, 4000); ab("Pneumonia comunitária", 3, 10, 1, None, 500)
    M = "Meningite bacteriana"
    ab(M, 0, 100, 2, 2000); ab(M, 1, (200, 300), 4, None, 12000); ab(M, 2, (300, 400), 4, None, 12000); ab(M, 4, 120, 3, 2000)
    F = "Faringoamigdalite estreptocócica"
    ab(F, 1, 50, 2, None, 1000); ab(F, 2, (40, 50), 2, 500); ab(F, 3, 12, 1, None, 500); ab(F, 4, 20, 3, 300)
    O = "Otite média aguda e rinossinusite bacteriana"
    ab(O, 0, (80, 90), 2, None, 4000); ab(O, 1, 50, 3, 500); ab(O, 3, 50, 1, None, 1000)

print(f"{total} conferências; {len(falhas)} divergências")
for f in falhas[:80]: print("  -", f)
sys.exit(1 if falhas else 0)
