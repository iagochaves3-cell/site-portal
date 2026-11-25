#!/usr/bin/env python3
"""Teste de mutação: injeta, uma de cada vez, um erro de dose no código-fonte,
monta a página mutante, captura a matriz de pacientes e confirma que o oráculo
independente acusa a divergência. Se algum erro passar sem ser acusado, o teste falha.
Uso: python3 tests/mutacao.py"""
import pathlib, shutil, subprocess, sys, tempfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
MUTACOES = [
    ("amiodarona 5→6 mg/kg", "data-farmacos.js", 'n: "Amiodarona", d: { k: 5, max: 300', 'n: "Amiodarona", d: { k: 6, max: 300'),
    ("paracetamol 15→20 gotas/mL", "data-farmacos.js", '{ r: "gotas 200 mg/mL", c: 200, g: 15 }', '{ r: "gotas 200 mg/mL", c: 200, g: 20 }'),
    ("noradrenalina 4→8 mg em 50 mL", "data-farmacos.js", 'f: [0.05, 2], q: 4, uq: "mg"', 'f: [0.05, 2], q: 8, uq: "mg"'),
    ("Holliday-Segar 50→40 mL/kg", "ui.js", "var d = kg <= 10 ? 100 * kg : (kg <= 20 ? 1000 + 50 * (kg - 10)", "var d = kg <= 10 ? 100 * kg : (kg <= 20 ? 1000 + 40 * (kg - 10)"),
    ("ibuprofeno liberado aos 3 meses", "data-farmacos.js", '"Ibuprofeno": function (p) { return p.idade < 0.5', '"Ibuprofeno": function (p) { return p.idade < 0.25'),
    ("teto da adrenalina 1→2 mg", "data-farmacos.js", 'd: { k: 0.01, max: 1, unica: true }, c: 0.1, crit: true', 'd: { k: 0.01, max: 2, unica: true }, c: 0.1, crit: true'),
    ("ampola de atropina 0,5 lida como 0,25 mg/mL", "data-farmacos.js", 'return p.idade >= 12 ? 1 : 0.5; }, unica: true }, c: 0.5, cs: [[0.5,', 'return p.idade >= 12 ? 1 : 0.5; }, unica: true }, c: 0.5, cs: [[0.25,'),
    ("cetamina para procedimento 1–2→1–3 mg/kg", "data-novos.js", 'n: "Cetamina IV", d: { k: [1, 2], max: 100', 'n: "Cetamina IV", d: { k: [1, 3], max: 100'),
    ("limiar tóxico do paracetamol 150→140 mg/kg", "data-novos.js", '{ k: 150, t: "potencialmente tóxica", cap: 7500 }', '{ k: 140, t: "potencialmente tóxica", cap: 7500 }'),
    ("volume corrente do modo 6–8→7–8 mL/kg", "ui-novos.js", '"6–8 mL/kg: " + faixaTxt(6 * w, 8 * w, mlNum)', '"6–8 mL/kg: " + faixaTxt(7 * w, 8 * w, mlNum)'),
    ("succinilcolina sem a faixa acima de 2 anos", "data-farmacos.js", "return p.idade < 2 ? 2 : [1, 1.5];", "return p.idade < 2 ? 2 : 1.5;"),
    ("NICE após choque 100→90 mL/kg na vazão", "ui-novos.js", 'K(mlh((100 * kg + hs) / 24))', 'K(mlh((90 * kg + hs) / 24))'),
    ("plano gradual: manutenção dividida por 20 h", "ui-novos.js", "M = hs * frac / 24;", "M = hs * frac / 20;"),
    ("preparo: NaCl calculado com 8 mg/mL", "ui-novos.js", "Vna = 9 * (Vg + VK) / (C - 9);", "Vna = 8 * (Vg + VK) / (C - 9);"),
    ("RCH sonda rápida sem o limite de 300 mL/h", "ui-novos.js", "faixaTxt(10 * kg, Math.min(25 * kg, 300), vazNum)", "faixaTxt(10 * kg, 25 * kg, vazNum)"),
    ("amoxicilina na pneumonia 80–90→50–90 mg/kg/dia", "data-clinica.js", '{ l: "1ª", n: "Amoxicilina", d: { k: [80, 90], per: "dia", n: 2, maxDia: 4000 }', '{ l: "1ª", n: "Amoxicilina", d: { k: [50, 90], per: "dia", n: 2, maxDia: 4000 }'),
]

falhas = []
for nome, arq, antes, depois in MUTACOES:
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp)
        shutil.copytree(RAIZ / "src", t / "src")
        shutil.copy(RAIZ / "build.py", t / "build.py")
        if (RAIZ / "fonts").exists():
            shutil.copytree(RAIZ / "fonts", t / "fonts", symlinks=True)
        f = t / "src" / arq
        s = f.read_text(encoding="utf-8")
        if s.count(antes) != 1:
            falhas.append(f"{nome}: trecho não encontrado uma única vez ({s.count(antes)})"); continue
        f.write_text(s.replace(antes, depois), encoding="utf-8")
        subprocess.run([sys.executable, str(t / "build.py")], check=True, capture_output=True)
        cap = t / "cap.json"
        subprocess.run(["node", str(RAIZ / "tests/captura.js"), str(t / "dist/index.html"), str(cap), str(RAIZ / "tests/matriz.json")], check=True, capture_output=True)
        r = subprocess.run([sys.executable, str(RAIZ / "tests/oraculo.py"), str(cap)], capture_output=True, text=True)
        linha = r.stdout.strip().splitlines()[0] if r.stdout.strip() else "?"
        n = int(linha.split("; ")[1].split()[0]) if "divergências" in linha else 0
        print(f"{nome}: {n} divergências")
        if n == 0:
            falhas.append(f"{nome}: o oráculo não acusou")
print("mutações não detectadas:", falhas or "nenhuma")
sys.exit(1 if falhas else 0)
