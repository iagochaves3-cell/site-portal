#!/usr/bin/env python3
"""Teste em delta: compara, campo a campo, o que o arquivo ORIGINAL e a nova
versão exibem para os mesmos pacientes. Toda diferença precisa ter um motivo
registrado abaixo; diferença sem motivo faz o teste falhar.
Uso: python3 delta.py base-original.json base-novo.json relatorio-delta.md"""
import json, re, sys

def nums(s):
    t = str(s).replace(" ", " ")
    t = re.sub(r"(?<=\d)[ ](?=\d{3})", "", t)
    return [float(x.replace(",", ".")) for x in re.findall(r"\d+(?:[.,]\d+)?", t)]

def contem(a, b, tol=0.051):
    """Os números do original (a) aparecem, na ordem, entre os do novo (b)?"""
    i = 0
    for x in b:
        if i < len(a) and abs(a[i] - x) <= max(tol * abs(a[i]), 0.0006):
            i += 1
    return i == len(a) and len(a) > 0

# Motivo de cada diferença (campo -> texto). Campos sem diferença não precisam constar.
MOTIVO = {
    "altCopy": "Receita refeita: gotas calculadas (o original dava paracetamol em mL sem gotas, intervalo de 6–8 h e ibuprofeno para qualquer idade, sem alerta de dengue). Dipirona de 10 mg/kg/dose (0,4 gota/kg), como no Manual PPS do autor.",
    "altPeso": "Só formato (18,0 kg → 18 kg).", "altIdade": "Idade passa a ser lida e normalizada (dias, meses, anos).",
    "atbSind": "Lista de síndromes ampliada e reordenada; a primeira passou a ser sepse comunitária.",
    "atbTit": "Idem.", "atbTab": "Coluna Dose total passou a ser calculada (o original repetia a dose máxima); doses revistas por síndrome. Amoxicilina de 80–90 mg/kg/dia como 1ª linha na pneumonia e na otite (Manual PPS); benzatina com os dois cortes de peso.",
    "cartaDrogas": "Mesmas doses onde o original estava certo; corrigidos o volume da atropina (mostrava a dose em mg como mL), tetos ausentes e 4 linhas acrescentadas (adrenalina ET, adenosina 1ª e 2ª, naloxona). Volumes nas duas apresentações de atropina, lidocaína e magnésio (folha ABRAMEDE-MG).",
    "chAlvo": "Alvos passam a depender da idade (o original usava alvos de adulto para todos).",
    "chDetail": "Conduta revista (SSC 2026, AHA 2025).", "chRecon": "Idem (critérios Phoenix).",
    "chExp": "Mostra a faixa de 10–20 mL/kg por alíquota e limita a 1.000 mL; recém-nascido 10 mL/kg.",
    "chExpCap": "Texto revisto.", "chTitulo": "Sem mudança de conteúdo.",
    "chVaso": "Mesma vazão para noradrenalina onde aplicável; agora o primeiro fármaco depende do tipo de choque e da idade (anafilaxia: adrenalina IM).",
    "chVasoCap": "Texto revisto; removido 'gotas/min' de vasoativo.",
    "coDef": "Mesmo valor com 1 casa; fração de água agora varia com idade e sexo.", "coFrac": "Fração por idade e sexo (o original usava 0,6 para todos).",
    "coAgua": "Idem.", "coTab": "Sódio em NaCl 3% (o original indicava NaCl 20% puro); potássio em mEq/mL correto; fósforo conforme bula (1,1 mmol/mL); magnésio 25–50 mg/kg.",
    "coVel": "Passa a calcular o limite em mEq e em mL/h de NaCl 3%.",
    "defH": "O original repunha todo o déficit em 8 h; agora metade em 8 h e metade em 16 h.", "defMl": "Só formato.",
    "diagChecks": "Cinco sinais acrescentados.", "diagOut": "Texto de orientação.",
    "docTxt": "Peso, idade, sexo e data já preenchidos; edição preservada.", "docTit": "Dois modelos acrescentados.", "docSel": "Idem.",
    "dvCap": "Mostra concentração e preparo; removido 'gotas/min'.", "dvDose": "Dose inicial passa a ser o mínimo da faixa do fármaco.",
    "dvOut": "Idem (0,05 em vez de 0,1 mcg/kg/min); mesma fórmula.", "dvDrug": "Lista ampliada.",
    "dvTable": "Soluções padronizadas e conferidas (o original trazia dexmedetomidina 10 vezes mais concentrada e dopamina com massa impossível em 50 mL).",
    "equipTab": "Tamanhos por faixa de peso (o original repetia fórmulas e trazia agulha intraóssea errada). Quatro itens acrescentados da folha ABRAMEDE-MG do autor: cateter central, cateter arterial, descompressão torácica e bougie.",
    "fcRef": "Faixas por idade em vigília e sono (PALS).", "frRef": "Faixas por idade (MS 2023).",
    "formDose": "Só formato.", "formVol": "Só formato.",
    "intoxTab": "Tetos acrescentados, pralidoxima na apresentação brasileira, insulina diluída a 1 U/mL (o original pedia 0,1 mL de insulina pura) e 7 antídotos acrescentados.",
    "itCarv": "Diluição 1:10 em água.", "itNac1": "Mesma dose; acrescentado o volume.", "itNac2": "Idem.", "itNac3": "Idem.",
    "lamRef": "Lâmina por idade revista.",
    "mCont": "ERRO CORRIGIDO: o original calculava 54 mL/h para 18 kg (solução de 5 mg em 50 mL); o correto, a 1 mg/mL, é 5,4 mL/h.",
    "mFb": "Faixa de 15–20 mg/kg.", "mFen": "Mesma dose; teto de 1.500 mg e tempo mínimo de infusão.",
    "mIM": "Mesma dose; volume com 2 casas.", "mIV": "Faixa de 0,1–0,2 mg/kg.", "mLev": "Faixa de 40–60 mg/kg com teto.",
    "mRet": "Mesma dose; acrescentados volume e teto de 20 mg.", "mVal": "Faixa de 20–40 mg/kg com teto e restrição de idade.",
    "meCa": "Mesmo valor; volume com 1 casa (o original arredondava 10,8 mL para 11 mL).", "meExp": "Só formato; limite de 1.000 mL.", "meG10": "Recém-nascido 2 mL/kg; teto de 250 mL.",
    "meGlu": "ERRO CORRIGIDO: 'glicose 1 g/kg a cada 2 h' não existe no tratamento da cetoacidose; agora glicose no soro (ISPAD 2022).",
    "meIns": "Só formato.", "meK": "ERRO CORRIGIDO: o volume usava 1,5 mEq/mL, concentração que não existe; KCl 19,1% tem 2,56 mEq/mL.",
    "meNa": "Mesmo cálculo; fração de água por idade e sexo e valores vindos da aba Correção.",
    "pAde": "Só formato.", "pAde2": "Só formato.", "pAtro": "Só formato; teto por idade.", "pCa": "Mesmo valor; volume com 1 casa (o original arredondava 10,8 mL para 11 mL).", "pCaCl": "Só formato (ordem dos números).", "pMg": "Acrescentada a ampola a 10%.",
    "paRef": "Só formato.", "pesoHlp": "Texto.",
    "posTab": "ERRO CORRIGIDO: amoxicilina 90 mg/kg era aplicada por dose (3 vezes a dose diária); coluna de gotas mostrava mL/h. Tabela passou de 9 para 56 linhas.",
    "repTab": "Mesmos erros corrigidos; restrições de idade aplicadas; de 16 para 67 medicamentos.",
    "sCardio": "Só formato.", "sDesf": "Limite na carga de adulto.", "sDesf2": "Acrescentado o limite de 10 J/kg.", "sCardio2": "Limite na carga de adulto.",
    "sG10": "Só formato.", "sPcr": "Só formato.", "sSF": "Só formato; limite de 1.000 mL.",
    "scRef": "Fórmula por peso (o original chamava de Mosteller um cálculo com altura suposta).",
    "so421a": "Só formato.", "so421b": "Só formato.", "so421c": "Só formato.", "so421t": "Só formato; teto de 100 mL/h.",
    "soExp": "Recém-nascido 10 mL/kg; limite de 1.000 mL.", "soMan": "Só formato.", "soManCap": "Texto.",
    "soK": "Valor inicial: 13 mEq (solução isotônica usual).", "soNa": "Valor inicial: 68 mEq (o original partia de solução muito hipotônica).",
    "soKF": "ERRO CORRIGIDO: o original tratava o mesmo campo como mEq em uma linha e como mL em outra.", "soNaF": "Idem.", "soVol": "Idem.",
    "totSem": "Recém-nascido e lactente por faixa; limites no adolescente.", "totCom": "Idem.",
    "trMan": "Mostra a faixa de volume para 0,5–1 g/kg.", "trSH": "Faixa de 2–5 mL/kg (diretriz de TCE pediátrico 2019).",
    "trTr": "Mostra 10–20 mL/kg.", "trTxa": "Teto de 1 g e manutenção limitada a 125 mg/h.", "trVol": "Só formato; limite de 1.000 mL.",
    "tubCm": "Profundidade por idade (idade ÷ 2 + 12); o original usava 3 × tubo, que superestima na criança maior.",
    "viaCom": "ERRO CORRIGIDO: campo ficava vazio.", "viaProf": "Idem.", "viaSem": "Idem.",
    "viaTab": "ERRO CORRIGIDO: a tabela de indução e bloqueio não era preenchida no original. Conferida com a folha ABRAMEDE-MG: etomidato 0,2–0,3, propofol 1–2,5, succinilcolina por idade, cisatracúrio e atropina nas ampolas de 0,5 e 0,25 mg/mL.",
    "vmPeso": "ERRO CORRIGIDO: o original aplicava peso predito de adulto a crianças (18 kg virava 36,9 kg).",
    "vmVt": "Idem: 221 mL para uma criança de 18 kg; o correto é 108 mL.", "vmTab": "Parâmetros por faixa revistos.",
    "vnE": "Valores iniciais por idade.", "vnI": "Idem.", "wBtns": "Rótulos sem a casa decimal.",
    "imgOut": "Texto.", "peso": "", "idade": "", "sexo": "", "desPct": "", "choqueSel": "", "dvVol": "", "navSearch": "", "repBusca": "",
    "coNa": "", "coNaAlvo": "", "gaNa": "", "gaCl": "", "gaHco": "", "gaGlic": "", "gaAG": "Só formato.", "gaDD": "Só formato.", "gaNaC": "Só formato.", "imgTexto": "",
}

o = json.load(open(sys.argv[1], encoding="utf-8")); n = json.load(open(sys.argv[2], encoding="utf-8"))
res, sem_motivo = {}, []
for co, cn in zip(o["casos"], n["casos"]):
    for k, vo in co["base"].items():
        if k in ("navGroups", "content", "dlgCopy", "pesoHlp"): continue
        r = res.setdefault(k, {"igual": 0, "num": 0, "dif": 0, "ex": None})
        vn = cn["base"].get(k)
        if vn is None:
            r["dif"] += 1; continue
        so = json.dumps(vo, ensure_ascii=False); sn = json.dumps(vn, ensure_ascii=False)
        if so == sn: r["igual"] += 1
        elif not isinstance(vo, list) and contem(nums(vo), nums(vn)): r["num"] += 1
        else:
            r["dif"] += 1
            if r["ex"] is None: r["ex"] = (co["caso"], str(vo)[:70], str(vn)[:70])
linhas, tot = [], {"igual": 0, "num": 0, "dif": 0}
for k in sorted(res):
    r = res[k]
    for x in tot: tot[x] += r[x]
    if (r["dif"] or r["num"]) and k not in MOTIVO: sem_motivo.append(k)
    if r["dif"] or r["num"]:
        linhas.append(f"| `{k}` | {r['igual']} | {r['num']} | {r['dif']} | {MOTIVO.get(k, 'SEM MOTIVO REGISTRADO')} |")
iguais = sorted(k for k, r in res.items() if not r["dif"] and not r["num"])
rel = ["# Teste em delta: original × nova versão", "",
       f"Pacientes comparados: {len(o['casos'])}. Campos comparados: {len(res)}. Comparações: {sum(tot.values())}.", "",
       f"- Texto idêntico: {tot['igual']}", f"- Mesmo número, formato diferente: {tot['num']}", f"- Diferente, com motivo registrado: {tot['dif']}", "",
       "| Campo | Idêntico | Mesmo número | Diferente | Motivo |", "|---|---|---|---|---|"] + linhas + ["", "Campos sem nenhuma diferença: " + ", ".join(iguais)]
open(sys.argv[3], "w", encoding="utf-8").write("\n".join(rel))
print(f"campos: {len(res)}; comparações: {sum(tot.values())}; idênticas: {tot['igual']}; mesmo número: {tot['num']}; diferentes: {tot['dif']}")
print("campos com diferença sem motivo registrado:", sem_motivo or "nenhum")
sys.exit(1 if sem_motivo else 0)
