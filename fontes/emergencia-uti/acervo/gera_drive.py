#!/usr/bin/env python3
"""Acrescenta ao acervo os documentos do Drive do autor:
- Tratado de Combinações Semiológicas e Diagnósticos em Pediatria (Tratado Mestre, Partes I a III; 160 combinações), coleção "trat";
- Guia de Soroterapia Pediátrica OMS, RCH e NICE (25/10/2026; 15 páginas), coleção "soro".
O texto do Tratado está em tratado.tsv (n, combinação, diagnóstico, diferenciais), já com as correções listadas em CORRECOES.
Uso: python3 gera_drive.py <pasta do acervo gerado (dist/acervo)>"""
import json, os, re, sys, unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = sys.argv[1]

def sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")

def grava(g, i, d):
    os.makedirs(os.path.join(SAIDA, g), exist_ok=True)
    d["g"] = g
    json.dump(d, open(os.path.join(SAIDA, g, i + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# ---------------------------------------------------------------- Tratado
CORRECOES = {
    3: "“Crise histérica conversiva” passou a “transtorno conversivo”.",
    24: "“Malformação adenomatosa cística pulmonar” recebeu o nome atual, malformação congênita das vias aéreas pulmonares.",
    35: "“Cristais hexagonais de cistina na córnea” passou a “cristais de cistina na córnea”: os cristais hexagonais são os da urina, na cistinúria.",
    44: "“Hipoglicemia pós-prandial curta” passou a “hipoglicemia após jejum curto (3–4 h)”, que é o padrão da glicogenose tipo I.",
    55: "Diferencial “hemiatrofia isolada” passou a “hemi-hiperplasia isolada”.",
    61: "“Prega palmar única (simiesca)” passou a “prega palmar transversa única”.",
    66: "“Parestesias distales” passou a “parestesias distais”.",
    77: "Linfopenia “abaixo de 1.500/mm³” passou a “abaixo de 3.000/mm³ no lactente”, limiar usado para suspeitar de SCID nessa idade.",
    84: "“Clonidina/brinzolamida” passou a “clonidina e imidazolinas (brimonidina, nafazolina)”: a brinzolamida não causa esse quadro.",
    87: "“Hipertermia maligna” passou a “hipertermia”: hipertermia maligna é outra doença (combinação 160).",
    89: "Dapsona acrescentada às causas.",
    100: "“Janela auro-pulmonar” passou a “janela aortopulmonar”.",
    102: "“Sopro ejetivo sistêmico” passou a “sopro sistólico ejetivo na borda esternal esquerda alta”; “crise hiperxêmica” passou a “crise hipoxêmica (hipercianótica)”.",
    111: "“Osteomielite crônica de Brodeur” passou a “abscesso de Brodie (osteomielite subaguda)”.",
    122: "Acrescentada a febre e separada a apresentação do lactente, que raramente tem sinais meníngeos e não relata cefaleia.",
    126: "Diferencial “glioblastoma” passou a “tumores do sistema nervoso central”.",
    128: "“Enxaqueca basilar” recebeu o nome atual, enxaqueca com aura de tronco.",
    129: "“Puberdade precoce central” passou a “atraso do crescimento ou da puberdade (raramente puberdade precoce)”, apresentação mais comum do craniofaringioma; perda de campo temporal descrita como hemianopsia bitemporal.",
    132: "Diferencial “crise pneumotóxica” passou a “pneumotórax espontâneo”.",
    133: "“Dor retroesternal em aperto” passou a dor em pontada, que piora ao deitar e melhora ao inclinar o tronco, típica da pericardite.",
    136: "“Febre reumática prévia” passou a “faringoamigdalite estreptocócica 2 a 4 semanas antes”, o desencadeante do primeiro surto.",
    141: "Glicemia “acima de 250 mg/dL” passou a “acima de 200 mg/dL”, critério da ISPAD 2022.",
    142: "“Hipoglicemia em jejum com cetonúria intensa” passou a vômitos e hipoglicemia logo após ingerir frutose, sacarose ou sorbitol, que é o padrão da doença.",
    144: "“Ponderoponderal” passou a “pôndero-estatural”.",
    147: "“Macrófagica” passou a “macrofágica”.",
    148: "Diferencial “leucemia mieloide crônica juvenil” passou a “leucemia mielomonocítica juvenil”.",
    151: "Calcificações “periventriculares” passaram a “subcorticais”, padrão do Zika (as periventriculares sugerem citomegalovírus); retirada a hepatoesplenomegalia, rara nessa síndrome.",
    160: "Rigidez “em cano de espingarda” passou a “em cano de chumbo”; desencadeantes especificados.",
}
COMPLEMENTOS = {
    25: "Na triagem de cardiopatia crítica com oximetria, diferença acima de 3% entre membro superior direito e membro inferior já é alterada.",
}
PARTE = lambda n: "Parte I" if n <= 125 else ("Parte II" if n <= 150 else "Parte III")
ORIGEM_T = "Tratado de Combinações Semiológicas e Diagnósticos em Pediatria"
ST_T = "Documento do autor (Tratado Mestre e Partes II e III, novembro de 2026), revisado nesta integração"

# índice já gerado (para ligar cada combinação aos temas do acervo)
indice = json.load(open(os.path.join(SAIDA, "indice.json"), encoding="utf-8"))
indice["itens"] = [e for e in indice["itens"] if e[0] not in ("trat", "soro")]
ABA = {"proto": "t-proto", "tera": "t-proto", "neo": "t-proto"}
temas = [(e[0], e[1], e[2], sem_acento(e[2])) for e in indice["itens"] if e[0] in ABA]
VAZIAS = set("trauma traumatismo aguda agudo agudas doenca sindrome infeccao infeccoes crise tipo congenita congenito pediatria pediatrica grave graves cronica cronico viral virais bacteriana primaria intoxicacao deficiencia neonatal infantil juvenil adquirida acidental sistemica intencional mais forte exemplo associada transitoria ligada classica tipica".split())

def relacionados(diag):
    base = sem_acento(re.split(r"[(/]", diag)[0])
    palavras = list(dict.fromkeys(w for w in re.findall(r"[a-z0-9-]+", base) if len(w) >= 6 and w not in VAZIAS))
    achados = []
    for g, i, t, tn in temas:
        pontos = sum(1 for w in palavras if re.search(r"\b" + re.escape(w), tn))
        if pontos and pontos >= min(2, len(palavras)):
            achados.append((-pontos, len(tn), t, "#" + ABA[g] + "/" + g + "/" + i))
    achados.sort()
    return [[t, h] for _, _, t, h in achados[:3]]

linhas = [l.rstrip("\n").split("\t") for l in open(os.path.join(AQUI, "tratado.tsv"), encoding="utf-8") if l.strip()]
comb = []
for n_txt, combo, diag, dif in linhas:
    n = int(n_txt)
    i = "c-%03d" % n
    s = [{"h": "Combinação de sinais e sintomas", "b": [combo]}, {"h": "Diagnóstico mais provável", "b": [diag]}, {"h": "Diferenciais críticos", "b": [dif]}]
    rel = relacionados(diag)
    if rel: s.append({"h": "Temas relacionados no acervo", "ln": rel})
    nota = []
    if n in CORRECOES: nota.append("Correção desta integração: " + CORRECOES[n])
    if n in COMPLEMENTOS: nota.append("Complemento: " + COMPLEMENTOS[n])
    item = {"t": diag, "o": ORIGEM_T, "u": "", "m": ["Combinação %d" % n, PARTE(n)], "st": ST_T, "s": s}
    if nota: item["nota"] = " ".join(nota)
    grava("trat", i, item)
    indice["itens"].append(["trat", i, diag, "Tratado, combinação %d" % n, sem_acento(combo + " " + dif)])
    comb.append([n, combo, diag, dif, i])
corr_rows = [["%d" % n, txt] for n, txt in sorted(CORRECOES.items())]
grava("trat", "c-correcoes", {"t": "Correções feitas no Tratado nesta integração", "o": ORIGEM_T, "u": "",
      "m": ["%d combinações corrigidas" % len(CORRECOES)], "st": "Revisão desta integração, 25/11/2026",
      "s": [{"h": "Como o Tratado entrou no site", "b": [
          "Base: Tratado Mestre (combinações 1 a 125, 12/11/2026), Parte II (126 a 150, 15/11/2026) e Parte III (151 a 160). A versão “Tratado de Combinações” de 15/11/2026 repete as combinações 1 a 120 com menos detalhe e foi usada só para conferência.",
          "Grafia, nomenclatura e tradução para o português foram padronizadas sem mudar o sentido. As correções de conteúdo estão na tabela e também na nota de cada combinação.",
          "A versão curta termina na combinação 120; as combinações 121 a 125 vêm do Tratado Mestre."]},
            {"h": "Correções de conteúdo", "tb": {"c": ["Combinação", "O que mudou"], "r": corr_rows}}]})
indice["itens"].append(["trat", "c-correcoes", "Correções feitas no Tratado nesta integração", "Tratado", "correcoes revisao tratado"])
json.dump(comb, open(os.path.join(SAIDA, "trat", "combinacoes.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# ---------------------------------------------------------------- Guia de soroterapia
ORIGEM_G = "Guia de Soroterapia Pediátrica: OMS, RCH e NICE"
ST_G = "Guia do autor, 25/10/2026, com fontes primárias consultadas nessa data; contas conferidas nesta integração"
REFS_G = [
    ["[1] OMS. The treatment of diarrhoea: a manual for physicians and other senior health workers. 2005", "https://iris.who.int/handle/10665/43209"],
    ["[1a] OMS/OPAS. Plano C: etapas por idade e reavaliação. 2022", "https://www.paho.org/sites/default/files/who_2022_phc_children_adolescents_1.pdf"],
    ["[2] Royal Children's Hospital Melbourne. Clinical Practice Guidelines: Intravenous fluids", "https://www.rch.org.au/clinicalguide/guideline_index/Intravenous_fluids/"],
    ["[3] Royal Children's Hospital Melbourne. Clinical Practice Guidelines: Nasogastric fluids", "https://www.rch.org.au/clinicalguide/guideline_index/Nasogastric_fluids/"],
    ["[4] NICE CG84. Diarrhoea and vomiting caused by gastroenteritis in under 5s", "https://www.nice.org.uk/guidance/cg84/chapter/recommendations"],
    ["[5] NICE NG29. Intravenous fluid therapy in children and young people in hospital", "https://www.nice.org.uk/guidance/ng29/chapter/recommendations"],
    ["[6] Farmace. Cloreto de sódio: bula profissional", "https://farmace.com.br/wp-content/uploads/2024/03/cloreto20_profissional.pdf"],
    ["[7] Samtec. Bulas e apresentações de NaCl, KCl e glicose", "https://www.samtec.com.br/bulas/"],
]
CALC = ["Calcular para o paciente na aba Soroterapia", "#t-soro"]
GUIA = [
 ("s-01-dados", "Dados antes de escolher a conduta", """
- Identificação, data e hora; idade em meses (no recém-nascido, dia de vida e idade gestacional).
- Peso atual, já depois dos líquidos recebidos, e peso antes da doença com a data, se houver.
- Causa e início de vômitos e diarreia; desidratação clínica e déficit residual estimado (%).
- Classe da OMS na diarreia (A, B ou C) e perfusão atual.
- Se houve choque tratado e o total de bolus; tolerância ao soro de reidratação oral (SRO).
- Líquidos já recebidos: solução, volume, horário e finalidade.
- Novas perdas (volume e intervalo) e diurese (mL em quantas horas, tendência).
- Outros aportes contínuos (mL/h) e condições especiais: doença renal ou cardíaca, cetoacidose, desnutrição.
- Sódio (hora da coleta), potássio, glicemia, creatinina e ureia, cloro e bicarbonato.

**Avaliar:** consciência, frequência cardíaca, pressão, pulsos, enchimento capilar, mucosas, prega, sede, respiração, edema e acesso. Sem peso, use só as fórmulas. Exames pesam mais na via venosa, mas não atrasam a ressuscitação do choque.
"""),
 ("s-02-trilha", "Escolha da trilha: OMS, RCH ou NICE", """
As diretrizes têm populações e critérios diferentes; não são escores intercambiáveis. P = peso (kg); M = manutenção ajustada (mL/h).

| Decisão | OMS | RCH | NICE CG84 |
|---|---|---|---|
| Contexto | Diarreia; classe A, B ou C | Fluido venoso de 1 mês a 18 anos sem via enteral | Gastroenterite abaixo de 5 anos |
| Reidratação enteral | B: 75 × P em 4 h | Via oral preferida; sonda rápida ou lenta conforme o caso | 50 × P + 4 × M, em 4 h |
| Reidratação venosa | C: 30 + 70 mL/kg em 3 ou 6 h, pela idade | M + até 5% de déficit em 24 h | M + déficit de 50 ou 100 mL/kg, no prazo escolhido |
| Manutenção | Depois de reclassificar; não somar outra manutenção ao Plano C | Somada ao déficit venoso | Incluída na oral; somada ao déficit venoso |
| Novas perdas | SRO e reavaliação; medir se importantes | Repor perdas medidas em janela própria | SRO depois de reidratar; na venosa, balanço e ajuste |
| Checar | Classe, idade e perfusão | Déficit residual, balanço e exames | Choque inicial, via, sódio e prazo |

### Choque agora: estabilizar antes do plano de reidratação
- NICE CG84 e NG29: soro fisiológico 0,9%, 10 mL/kg rapidamente (NG29: em menos de 10 min), e reavaliar; se o choque persistir, nova avaliação e conduta do protocolo.
- RCH: alíquota de soro fisiológico 0,9% de 10–20 mL/kg e reavaliação; chamar avaliação sênior se a necessidade acumulada chegar a 20 mL/kg ou mais.
- Equivalência, não repetição: 10 kg, alíquota de 100 mL em 5 min = 1.200 mL/h durante só 5 min. Programar também o limite de volume. Depois de cada alíquota: perfusão, consciência, pulmões, fígado e resposta circulatória.
- O Plano C da OMS é uma sequência de reidratação da diarreia grave. Se já houve bolus, ver sua relação com a etapa de 30 mL/kg antes de reiniciar. Os bolus de ressuscitação da RCH e do NICE ficam registrados à parte do déficit.

**Trilhas próprias:** neonatos e prematuros, cetoacidose, desnutrição grave, doença cardíaca, renal ou hepática, queimaduras, disnatremias relevantes e sobrecarga. Este guia não dá prescrição automática para essas condições.
"""),
 ("s-03-oms", "OMS: planos A, B e C", """
Confirmar diarreia e a classificação clínica da OMS; uma estimativa “leve” ou “moderada” em outra escala não leva automaticamente ao Plano B.

| Plano | Reidratar | Manter | Repor novas perdas |
|---|---|---|---|
| A: sem desidratação | Sem déficit a corrigir | Aleitamento e alimentação habituais | SRO após cada evacuação: abaixo de 2 anos, 50–100 mL; de 2 a 10 anos, 100–200 mL; maiores, conforme a sede |
| B: alguma desidratação | SRO 75 × P mL em 4 h, em pequenas porções | Continuar o aleitamento; reclassificar em 4 h | SRO para perdas adicionais; se importantes, medir e reavaliar |
| C: desidratação grave | Ringer lactato (soro fisiológico se não houver): 100 × P no total, nas etapas abaixo | Não somar manutenção nem outro déficit completo à sequência; reclassificar ao final | SRO assim que puder beber, cerca de 5 × P mL/h |

### Plano C: quanto e em quanto tempo
| Idade | Primeira etapa | Segunda etapa | Total |
|---|---|---|---|
| Abaixo de 12 meses | 30 × P mL em 1 h (30 × P mL/h) | 70 × P mL em 5 h (14 × P mL/h) | 100 × P em 6 h |
| A partir de 12 meses | 30 × P mL em 30 min (60 × P mL/h) | 70 × P mL em 2 h 30 min (28 × P mL/h) | 100 × P em 3 h |

**Exemplo fictício, 18 meses e 10 kg:** Plano B = 750 mL em 4 h (média de 187,5 mL/h). Se for Plano C: 300 mL em 30 min (600 mL/h) e depois 700 mL em 2 h 30 min (280 mL/h). São alternativas; não se somam.

- No Plano C, reavaliar a cada 15–30 min no início e reclassificar ao fim das 3 ou 6 h. Pulso ainda muito fraco ou ausente exige rever logo a primeira etapa; piora respiratória ou sinais de sobrecarga exigem rever a vazão.
- Depois de corrigir: parar a reposição do déficit, manter a via enteral e repor as perdas que continuarem. Se a via enteral seguir inviável, calcular necessidade basal e perdas do novo período, sem repetir os 100 mL/kg.
- O Ministério da Saúde adota o mesmo Plano C desde 2023.
"""),
 ("s-04-rch", "RCH: déficit residual, sonda e via venosa", """
Usar o peso de antes da doença quando for confiável; sem ele, registrar a estimativa com o peso atual. A via oral ou por sonda é a preferida quando segura.

| Via | Reidratação | Manutenção | Perdas |
|---|---|---|---|
| Venosa | Até 5% de déficit nas primeiras 24 h; reavaliar o restante | Somar a basal ajustada, em geral NaCl 0,9% com glicose 5% | Medir e repor no período seguinte (hora a hora ou a cada 4 h), em separado |
| Sonda rápida | 10–25 mL/kg/h por 4 h, na desidratação moderada, em casos selecionados a partir de 6 meses | Depois de reavaliar, retomar dieta ou suporte basal | SRO adicional conforme perdas e tolerância |
| Sonda lenta | Até 5% de déficit em 6 h | Depois de reavaliar, manutenção nas 18 h seguintes | Registrar em separado; ajustar pela resposta |

**Sonda rápida:** a desidratação grave segue a avaliação venosa. Evitar no choque, na doença crítica, com risco de aspiração ou obstrução, dor abdominal importante, doença respiratória ou neurológica relevante ou distúrbio eletrolítico importante. Abaixo de 6 meses, avaliação pediátrica. Confirmar a posição da sonda e a capacidade da bomba. A tabela da RCH limita a vazão de 25 mL/kg/h a 300 mL/h acima de 12 kg, prolongando o tempo; o guia do autor lembra que 300 mL/h não é teto clínico universal.

### Exemplo fictício venoso: 18 meses, 10 kg, déficit residual de 5%
Sem disnatremia, perfusão estável, via enteral inviável; manutenção de 100%; sem outros aportes. Déficit de 500 mL; manutenção de 1.000 mL/dia; novas perdas de 80 mL a repor em 4 h.

| Parcela | Conta | Taxa |
|---|---|---|
| Manutenção | 1.000 ÷ 24 | 41,67 mL/h |
| Déficit | 500 ÷ 24 | 20,83 mL/h |
| Perdas, só nas primeiras 4 h | 80 ÷ 4 | 20 mL/h |

Primeiras 4 h: 82,5 mL/h = 330 mL (basal e déficit 62,5 mL/h + perdas 20 mL/h, em programações separadas). 20 h seguintes: 62,5 mL/h = 1.250 mL. Total planejado de 1.580 mL, se a reavaliação mantiver o plano.

A tabela arredondada da RCH dá cerca de 60 mL/h para 10 kg com 5%; o cálculo diário exato dá 62,5, e a regra 4-2-1, 60,83. Identificar o método e não somar as alternativas. Peso, perfusão e balanço seriados; exames em 4–6 h se grave ou com grandes perdas, e ao menos diariamente se a via venosa continuar.
"""),
 ("s-05-nice", "NICE: via de reidratação e choque inicial", """
O CG84 vale para gastroenterite abaixo de 5 anos. O SRO é a primeira opção quando indicado; gravidade genérica não substitui os critérios para via venosa.

| Esquema | Reidratar | Manter | Repor perdas |
|---|---|---|---|
| Oral ou sonda | 50 × P mL em 4 h | Somar 4 × M, descontando outros aportes basais | Depois de reidratar, nos de maior risco, considerar 5 mL/kg após cada evacuação líquida volumosa |
| Venosa sem choque inicial | Déficit de 50 × P mL | M + déficit ÷ prazo escolhido | Medir, reavaliar e ajustar em janela própria |
| Venosa após choque tratado | Déficit de 100 × P mL | M + déficit ÷ prazo escolhido; bolus registrados à parte | Idem, sem duplicar líquidos destinados ao mesmo déficit |

**Via venosa indicada:** choque, piora apesar da reidratação oral em criança com sinais de alerta, ou vômitos persistentes do SRO, inclusive por sonda. Usar solução isotônica, como NaCl 0,9% com ou sem glicose 5%. Dosar sódio, potássio, ureia, creatinina e glicemia e ajustar pela evolução.

### Exemplo fictício: 18 meses, 10 kg; M = 41,67 mL/h
| Cenário | Volume e taxa | Prazo |
|---|---|---|
| Oral, sem choque | 500 + 166,67 = 666,67 mL; média de 166,67 mL/h | 4 h |
| Venosa sem choque | 500 + 1.000 = 1.500 mL; 62,5 mL/h antes de perdas e aportes | 24 h, escolhido para o exemplo |
| Venosa após choque | 1.000 + 1.000 = 2.000 mL; 83,33 mL/h antes de perdas e aportes | 24 h, escolhido para o exemplo |

- O CG84 não fixa 24 h para todos os esquemas venosos.
- Hipernatremia com indicação venosa: avaliação especializada, déficit em geral em 48 h e queda do sódio menor que 0,5 mmol/L por hora.
- Reavaliar com frequência: resposta clínica, diurese, balanço e eletrólitos. Introduzir o SRO durante a via venosa; se tolerado, completar por via enteral e encerrar a parcela venosa correspondente.
- Maior risco de recorrência: idade abaixo de 1 ano, mais de 5 evacuações ou mais de 2 vômitos em 24 h.
"""),
 ("s-06-manutencao", "Manutenção, déficit e perdas", """
Manutenção, déficit e perdas são parcelas diferentes; todos os aportes contam.

| Peso | Manutenção teórica (mL/24 h) |
|---|---|
| Até 10 kg | 100 × P |
| 10 a 20 kg | 1.000 + 50 × (P − 10) |
| Acima de 20 kg | 1.500 + 20 × (P − 20), com limites conforme idade e condição |

- **M (mL/h)** = manutenção diária × fração escolhida ÷ 24. A fração pode ser 100%, 2/3 ou outra, depois de avaliar volemia e risco de ADH. Não restringir automaticamente o déficit ativo. A regra 4-2-1 é aproximação e não substitui o método documentado.
- **Taxa gradual** = M + déficit residual programado ÷ prazo + perdas medidas ÷ prazo de reposição − outros aportes basais. Perdas de 80 mL em 4 h: somar 20 mL/h por 4 h, medir de novo e não prolongar sem reavaliar.
- **Déficit:** com dois pesos, diferença (kg) × 1.000 = mL, e percentual = diferença ÷ peso anterior × 100. Sem peso anterior: peso atual × % estimado × 10. O peso já medido depois dos líquidos representa o déficit residual, sem novo desconto dos mesmos líquidos.
- **Taxa de infusão de glicose (TIG)** = glicose (mg/mL) × mL/h ÷ (P × 60). Glicose 5% = 50 mg/mL. Exemplo, 10 kg com 62,5 mL/h de G5: 5,21 mg/kg/min. As perdas repostas em solução sem glicose não entram nessa conta.

### Que solução usar em cada parcela
| Parcela | Opção prática |
|---|---|
| Manutenção e déficit venoso gradual | NaCl 0,9% com glicose 5% pronto é opção comum; o NICE aceita NaCl 0,9% sem glicose conforme a glicemia. Preferir bolsa industrializada |
| Perdas gastrointestinais por via enteral | SRO, preparado com o volume de água indicado no sachê |
| Perdas gastrointestinais por via venosa | Soro fisiológico 0,9%; a RCH descreve com frequência KCl 20 mmol/L, só depois de avaliar potássio, função renal e diurese, com prescrição explícita |
| Glicose e aditivos | Ajustar pela glicemia e pela TIG. Potássio, cálcio, magnésio e bicarbonato não entram automaticamente |
"""),
 ("s-07-apresentacoes", "Apresentações de sódio e glicose", """
O estoque serve para compor a solução final prescrita. Concentrações iguais exigem volumes diferentes. NaCl 10% e 20% nunca são expansão direta.

| Apresentação | Conteúdo | Papel |
|---|---|---|
| Soro fisiológico (NaCl 0,9%) | 9 mg/mL de NaCl; sódio de cerca de 154 mEq/L | Fluido pronto para expansão, déficit e perdas; base de preparo |
| NaCl 10% | 100 mg/mL; sódio de cerca de 1,711 mEq/mL | Concentrado para diluir no volume final |
| NaCl 20% | 200 mg/mL; sódio de cerca de 3,422 mEq/mL | Mesmo sal, o dobro da concentração do 10% |
| Soro glicosado 5% e 10% | 50 e 100 mg/mL de glicose | Fonte de glicose; sozinhos não dão sódio isotônico |
| Glicose 25% e 50% | 250 e 500 mg/mL | Concentrados para preparo quando indicado |
| Ringer lactato | Cristaloide balanceado, composição conforme o rótulo | Plano C da OMS; não equivale a soro fisiológico com glicose e não traz glicose |
| SRO de baixa osmolaridade | Eletrólitos e glicose, formulação oral | Reidratação e perdas por boca ou sonda; nunca na veia |

- 1 mL de NaCl 20% tem o sal de 2 mL de NaCl 10%. Ao trocar a apresentação, completar o novo volume final e recalcular a diluição.
- NaCl 3% é tratamento específico, como na hiponatremia sintomática, e não alternativa de rotina para manter ou reidratar. Glicose concentrada e água para injeção não substituem o cristaloide isotônico de expansão.
"""),
 ("s-08-preparo", "Mesmo alvo, vários preparos: NaCl 0,9% com glicose 5%", """
Alvo de todos os esquemas: 500 mL finais de NaCl 0,9% com glicose 5%, sem potássio. Balanço de massa para preparo pela farmácia, não instrução de mistura domiciliar.

| Estoque | Base | Glicose | NaCl |
|---|---|---|---|
| SF + G10 + NaCl 10% | SF 0,9%: 225,275 mL | G10%: 250 mL | NaCl 10%: 24,725 mL |
| SF + G10 + NaCl 20% | SF 0,9%: 238,220 mL | G10%: 250 mL | NaCl 20%: 11,780 mL |
| SF + G25 + NaCl 10% | SF 0,9%: 390,110 mL | G25%: 100 mL | NaCl 10%: 9,890 mL |
| SF + G25 + NaCl 20% | SF 0,9%: 395,288 mL | G25%: 100 mL | NaCl 20%: 4,712 mL |
| SF + G50 + NaCl 10% | SF 0,9%: 445,055 mL | G50%: 50 mL | NaCl 10%: 4,945 mL |
| SF + G50 + NaCl 20% | SF 0,9%: 447,644 mL | G50%: 50 mL | NaCl 20%: 2,356 mL |
| SG5 + G50 + NaCl 10% | SG 5%: 450 mL | G50%: 5 mL | NaCl 10%: 45 mL |
| SG5 + G50 + NaCl 20% | SG 5%: 475 mL | G50%: 2,5 mL | NaCl 20%: 22,5 mL |

- Para 250 mL finais, multiplicar tudo por 0,5; para 1.000 mL, por 2. Os números com 3 casas são referências aritméticas: a farmácia define o arredondamento e refaz a conferência.
- Preferir bolsa pronta de NaCl 0,9% com glicose 5%, sem acrescentar concentrados.
- **Fórmula com soro fisiológico e glicose concentrada:** Vg = Vfinal × Gfinal ÷ Gestoque; VNaCl = 9 × Vg ÷ (CNaCl − 9); VSF = Vfinal − Vg − VNaCl (G em %; CNaCl em mg/mL, 100 ou 200). Com outros aditivos, recalcular.
- **Conferência:** 4.500 mg de NaCl em 500 mL = 9 mg/mL (0,9%); 25.000 mg de glicose em 500 mL = 50 mg/mL (5%). Os volumes finais incluem os aditivos.
"""),
 ("s-09-aditivos", "Potássio e folha de plano", """
Preencher só o esquema escolhido. Não somar as propostas da OMS, da RCH e do NICE. Aditivos mudam o volume final e exigem novo balanço.

- **KCl, se prescrito:** volume = dose (mEq) ÷ concentração do rótulo (mEq/mL). Para 10 mEq: KCl 10% (cerca de 1,341 mEq/mL) = 7,455 mL; KCl 15% (2,012) = 4,970 mL; KCl 19,1% (2,56) = 3,906 mL.
- Nunca na veia direto ou em bolus; avaliar potássio, diurese e função renal antes de indicar.
- Em 500 mL finais, 10 mEq correspondem a 20 mEq/L. Somar sobre 500 mL muda esse alvo: usar o volume final exato e rever também sódio e glicose. Preferir bolsa com potássio pronta ou composição preparada pela farmácia.

### Folha de plano
Diretriz adotada; início e reavaliação programada; déficit desta etapa (mL e horas); manutenção (% , mL/h e horas); reposição de novas perdas; outros aportes descontados; solução final, concentração e via; volume, taxa e duração da etapa; componentes com o volume de cada um; conferência reversa (taxa × horas, soma dos volumes, sódio, glicose e potássio finais); prescritor e revisão de enfermagem e farmácia.

Reavaliar sinais vitais, perfusão, aceitação, perdas, diurese, peso e sódio, potássio e glicemia conforme a gravidade. Reduzir ou parar diante de sobrecarga. Passar para a via oral ou sonda assim que possível.
"""),
 ("s-10-bolsas", "Programar bolsas e bomba", """
A duração de cada bolsa depende do volume dela e da taxa prescrita. Não dividir o tempo por igual se a última bolsa tiver volume menor.

- Taxa = volume ÷ duração. Número de bolsas = volume ÷ capacidade da bolsa, arredondado para cima. Tempo de cada bolsa = volume dela ÷ taxa. Conferir: soma dos volumes = volume total; soma dos tempos = duração.
- Exemplo, 1.500 mL em 24 h: três bolsas de 500 mL a 62,5 mL/h, 8 h cada.
- Exemplo, 750 mL em 12 h com bolsas de 500 mL: 500 mL em 8 h e 250 mL em 4 h, ambas a 62,5 mL/h. A última não dura 6 h.
- Bolsas de volumes diferentes: recalcular os componentes proporcionalmente ao volume final, sem repetir as mesmas quantidades de concentrados.
- **Quando a taxa muda por novas perdas:** no exemplo de 1.580 mL, 330 mL nas primeiras 4 h (82,5 mL/h: basal e déficit 62,5 + perdas 20, em soluções ou programações separadas) e depois 1.250 mL em 20 h (62,5 mL/h). A parcela das perdas pode correr em via ou bomba separada; somar tudo no balanço.

| Conferência da bomba | Registrar |
|---|---|
| Unidades e horário | mL/h, volume a infundir, hora de início e de revisão |
| Bolus | Taxa alta só pelo tempo ou volume da alíquota; reavaliar antes de repetir |
| Equipo por gravidade | Gotas/min = mL/h × fator real do equipo ÷ 60; preferir bomba para vazões pequenas |
"""),
 ("s-11-glicose", "Glicose e concentração final", """
A concentração do estoque é uma escolha de preparo; a concentração final e a TIG são escolhas clínicas. Não aumentar a glicose nem restringir volume sem avaliar o paciente.

| Glicose final | mg/mL | TIG a 50 mL/h em 10 kg |
|---|---|---|
| 2,5% | 25 | 2,08 mg/kg/min |
| 5% | 50 | 4,17 mg/kg/min |
| 10% | 100 | 8,33 mg/kg/min |

TIG = (% × 10 × mL/h) ÷ (60 × kg). Se a glicemia pedir mais glicose, aumentar a concentração pode evitar excesso de volume; avaliar acesso, solução final e protocolo.

### Alvos em 500 mL com soro fisiológico, G50 e NaCl concentrado
| Alvo | NaCl de estoque | SF (mL) | G50 (mL) | NaCl (mL) |
|---|---|---|---|---|
| G2,5 + NaCl 0,9% | 10% | 472,527 | 25 | 2,473 |
| G2,5 + NaCl 0,9% | 20% | 473,822 | 25 | 1,178 |
| G5 + NaCl 0,9% | 10% | 445,055 | 50 | 4,945 |
| G5 + NaCl 0,9% | 20% | 447,644 | 50 | 2,356 |
| G10 + NaCl 0,9% | 10% | 390,110 | 100 | 9,890 |
| G10 + NaCl 0,9% | 20% | 395,288 | 100 | 4,712 |

- **Erro frequente:** 450 mL de soro fisiológico + 50 mL de G50 dão glicose 5%, mas NaCl 0,81%. Para 0,9% com 5%, usar bolsa pronta ou os três componentes. Nunca corrigir uma bolsa pronta acrescentando NaCl sem recalcular o volume.
- SG 2,5% como estoque só com produto estéril identificado e protocolo local. Exemplo para 500 mL de NaCl 0,9% com glicose 5%: SG 2,5% 450 mL + G50 27,5 mL + NaCl 20% 22,5 mL (11,25 + 13,75 = 25 g de glicose; 4,5 g de NaCl).
- Os alvos de 2,5% e 10% não substituem automaticamente a glicose 5%; dependem da glicemia, da TIG, da idade e da oferta. Não acrescentar cálcio, magnésio, bicarbonato ou outros fármacos sem análise específica.
"""),
 ("s-12-casos", "Casos resolvidos", """
Casos fictícios com premissas explícitas. A mesma criança pode ter alternativas elegíveis; escolher uma, acompanhar a resposta e mudar o plano quando preciso.

### A. 18 meses, 10 kg, gastroenterite, SRO tolerado
Perfusão estável, sem choque, alguma desidratação (OMS), sem condições especiais, exames sem alterações relevantes, manutenção de 100%, sem outros aportes nem reidratação prévia.

| Alternativa | Reidratação | Depois e perdas |
|---|---|---|
| OMS, Plano B | 750 mL de SRO em 4 h; média de 187,5 mL/h | Reclassificar em 4 h; aleitamento; SRO para novas perdas |
| NICE, oral | 500 mL + 166,67 mL de manutenção = 666,67 mL em 4 h | Não somar outra manutenção às mesmas 4 h; depois, SRO para perdas e risco |
| RCH, sonda, se a via oral não bastar | Se elegível e com 20 mL/kg/h: 200 mL/h por 4 h = 800 mL | Reavaliar a tolerância; retomar dieta e manutenção |

Se surgirem 80 mL de perdas medidas, planejar a parcela adicional (por exemplo, 20 mL/h nas 4 h seguintes) pela via tolerada e reavaliar. Isso não transforma as três alternativas em um esquema combinado.

### B. Peso anterior 10 kg; atual 9 kg depois do atendimento inicial
Déficit residual medido = (10 − 9) × 1.000 = 1.000 mL (10%). Estável, via enteral inviável, sódio normal, manutenção de 100%, sem outros aportes nem novas perdas. Estratégia da RCH, peso de referência 10 kg.

| Período | Déficit programado | Manutenção | Taxa |
|---|---|---|---|
| Primeiras 24 h | 500 mL (5%) | 1.000 mL | 62,5 mL/h |
| 24 h seguintes, se ainda indicado | Até 500 mL restantes, depois de reavaliar | Recalcular | Não fixar sem reavaliar |

Se 400 mL já tinham sido recebidos antes da pesagem atual, não subtrair os 400 mL de novo desse déficit residual.
"""),
 ("s-13-excecoes", "Situações que mudam a conduta", """
| Situação | Ação inicial | Implicação no esquema |
|---|---|---|
| Choque ou piora da perfusão | ABCDE, cristaloide isotônico em alíquotas, reavaliar; investigar a causa se a resposta for inadequada | Não programar só manutenção para tratar choque |
| Sódio acima de 145 mmol/L | Rever duração, sintomas e perdas; sódio seriado; avaliação especializada se via venosa | NICE: déficit em geral em 48 h, com queda menor que 0,5 mmol/L por hora |
| Sódio baixo com sintomas neurológicos | Avaliação urgente; protocolo de hiponatremia sintomática e monitorização | NaCl 3% é tratamento específico, não substituto das bolsas de rotina |
| Oligúria ou disfunção renal | Reavaliar perfusão, creatinina, potássio, balanço e obstrução | Não repor urina escassa com bolus nem acrescentar potássio automaticamente |
| Sobrecarga ou cardiopatia | Rever infusão, ausculta, hepatomegalia, edema e função cardíaca | Reduzir ou parar conforme o quadro; estratégia própria |
| Neonato ou prematuro | Dia de vida, idade gestacional, peso ao nascer e atual, diurese, sódio e glicemia | Usar manutenção neonatal e TIG específicas; não extrapolar Holliday-Segar |
| Cetoacidose, desnutrição grave, queimadura | Confirmar e acionar o protocolo próprio | Reposição, eletrólitos e monitorização têm regras próprias |
| Vômitos biliosos, distensão ou rebaixamento | Investigar obstrução ou outra causa; avaliar proteção da via aérea | Evitar oferta enteral insegura; não assumir gastroenterite |

### Dados ausentes: o que ainda dá para calcular
- Sem peso: só as fórmulas, sem volume individual.
- Sem prazo da via venosa do NICE: expressão M + déficit ÷ prazo, sem mL/h fechado.
- Sem déficit residual: só a manutenção teórica.
- Sem sódio: comparação condicional, com coleta para definir o regime venoso.
- Sem potássio, diurese ou função renal: não acrescentar KCl.

Exames isolados não substituem a avaliação: creatinina sem contexto não confirma função renal normal, e sódio ausente não significa sódio normal.
"""),
 ("s-14-acompanhar", "Acompanhar e encerrar", """
Reidratação é um processo com reavaliação. Registrar o volume efetivamente administrado, não só o prescrito.

| Momento | Rever | Decisão |
|---|---|---|
| Depois de cada bolus | Perfusão, consciência, frequência cardíaca, pressão, pulmões e fígado | Repetir só se indicado; rever causa e sobrecarga |
| Durante a reidratação | Aceitação, vômitos e fezes, bomba, acesso, diurese e balanço | Ajustar perdas e via |
| Em 4–6 h, se grave ou com grandes perdas | Clínica, eletrólitos e glicemia | Recalcular se a tendência mudar |
| Ao completar o plano | Peso, perfusão, sede, aceitação e déficit residual | Parar o déficit resolvido; decidir manutenção e perdas |
| Antes da alta | Aceita líquidos, perfusão estável, plano para perdas e retorno | Orientar a família e o seguimento |

**Orientação à família:** oferecer SRO em pequenas porções, manter o aleitamento e retomar a alimentação conforme o plano; preparar o sachê no volume de água indicado. Procurar atendimento se houver prostração, dificuldade para beber, vômitos repetidos, menos urina, sangue nas fezes ou piora geral.

**Antes de encerrar a prescrição:** confirmar solução final, volume, mL/h, duração, via, componente de perdas e horário de revisão. Identificar a parcela que termina e os líquidos que continuam, para não repetir um déficit já corrigido.
"""),
 ("s-15-referencias", "Referências e uso do guia", """
Fontes primárias consultadas pelo autor em 25/10/2026; a lista completa está abaixo. O site Soroterapia Pediátrica do autor orientou a organização das apresentações e das contas de composição.

**Como usar:** registrar os dados da primeira página e escolher a diretriz aplicável; calcular reidratação, manutenção e perdas no período certo; escolher a solução final e, quando preciso, a apresentação de estoque; registrar só o plano escolhido e fazer a conferência reversa.

Neste site, os cálculos para o paciente ficam na aba Soroterapia: trilhas da OMS, da RCH e do NICE, plano gradual com manutenção, déficit e perdas, e preparo de NaCl 0,9% com glicose no volume final exato. Ler a bula do produto disponível: a mesma concentração não garante intercambialidade de marcas, compatibilidade ou prazo da mistura.
"""),
]
for n, (i, titulo, texto) in enumerate(GUIA, 1):
    grava("soro", i, {"t": titulo, "o": ORIGEM_G, "u": "", "m": ["Página %d de 15" % n, "25/10/2026"], "st": ST_G,
                      "s": [{"md": texto.strip()}, {"h": "No site", "ln": [CALC]}], "r": REFS_G if n in (2, 15) else []})
    indice["itens"].append(["soro", i, titulo, "Guia de soroterapia", sem_acento(texto)[:1200]])

indice["itens"].sort(key=lambda e: (e[0], sem_acento(e[2])))
json.dump(indice, open(os.path.join(SAIDA, "indice.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
man = json.load(open(os.path.join(SAIDA, "manifesto.json"), encoding="utf-8"))
man["grupos"] = [g for g in man["grupos"] if g["k"] not in ("trat", "soro")] + [
    {"k": "trat", "n": "Tratado de combinações semiológicas", "origem": ORIGEM_T + " (Google Drive do autor)", "url": "",
     "obs": "160 combinações de sinais e sintomas com diagnóstico provável e diferenciais, mais a tabela de correções.", "itens": len(comb) + 1},
    {"k": "soro", "n": "Guia de soroterapia", "origem": ORIGEM_G + " (Google Drive do autor)", "url": "",
     "obs": "As 15 páginas do guia de plantão, com tabelas e exemplos conferidos.", "itens": len(GUIA)}]
json.dump(man, open(os.path.join(SAIDA, "manifesto.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("trat:", len(comb) + 1, "itens; soro:", len(GUIA), "itens; índice:", len(indice["itens"]))
