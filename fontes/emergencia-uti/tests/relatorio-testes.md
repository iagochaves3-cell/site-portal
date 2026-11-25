# Emergência & UTI: relatório de testes

Versão testada: `dist/index.html`, SHA-256 `ad16e49a1d83f03cc0ae9eb6b3d84c7543644e088f831624bc4629a6bfd5eff8`, com o acervo em `dist/acervo/`. Data: 25/11/2026.

## Resultado

| Teste | O que confere | Resultado |
|---|---|---|
| Oráculo, 48 pacientes | Cada dose, volume, gota, vazão, dose tóxica, volume corrente e conta de soroterapia (trilhas OMS, RCH e NICE, plano gradual, preparo) exibida, recalculada a partir de uma tabela digitada à parte | 36.619 conferências, 0 divergências |
| Oráculo, varredura de peso | O mesmo, em 201 pesos de 0,5 a 150 kg | 151.435 conferências, 0 divergências |
| Oráculo, 10 pacientes de referência | O mesmo, nos pacientes do teste em delta | 7.600 conferências, 0 divergências |
| Mutação | 16 erros de dose injetados de propósito no código | 16 de 16 detectados |
| Funcional | 30 abas, busca (também no acervo), paciente, painéis novos, exemplos resolvidos do Guia de soroterapia, busca do Tratado por sinais, leitor do acervo, calculadora de escores embutida, cópia, impressão, tema, celular em 390 e 320 px, nenhuma requisição fora do site | 245 verificações aprovadas, no servidor local e no endereço público |
| Acervo | Índice × arquivos, contagens das 8 coleções (110, 362, 87, 266, 498, 486, 161, 15), 577 linhas e 315 diagnósticos do Manual PPS, 160 combinações do Tratado, links internos, 486 escores × calculadora embutida idêntica à de origem, figuras, ausência de conteúdo ativo | 12.879 conferências, 0 falhas |
| Delta | Original × nova versão, campo a campo, em 10 pacientes | 1.250 comparações; toda diferença tem motivo registrado |

## Limite do que os testes provam

O oráculo e o site foram escritos pela mesma revisão clínica. O teste garante que o site calcula e exibe exatamente o que a tabela de referência manda, e que os tetos e as restrições de idade são aplicados; ele não substitui a conferência das doses de referência com a bula e o protocolo da instituição. O acervo integrado é reproduzido como está na origem: os testes conferem a integridade e a segurança da exibição, não o conteúdo clínico de cada tema.

## Erros injetados (teste de mutação)

- amiodarona 5→6 mg/kg: 80 divergências
- paracetamol 15→20 gotas/mL: 46 divergências
- noradrenalina 4→8 mg em 50 mL: 153 divergências
- Holliday-Segar 50→40 mL/kg: 169 divergências
- ibuprofeno liberado aos 3 meses: 2 divergências
- teto da adrenalina 1→2 mg: 6 divergências
- ampola de atropina 0,5 lida como 0,25 mg/mL: 96 divergências
- cetamina para procedimento 1–2→1–3 mg/kg: 62 divergências
- limiar tóxico do paracetamol 150→140 mg/kg: 78 divergências
- volume corrente do modo 6–8→7–8 mL/kg: 30 divergências
- succinilcolina sem a faixa acima de 2 anos: 68 divergências
- NICE após choque 100→90 mL/kg na vazão: 48 divergências
- plano gradual: manutenção dividida por 20 h: 240 divergências
- preparo: NaCl calculado com 8 mg/mL: 96 divergências
- RCH sonda rápida sem o limite de 300 mL/h: 31 divergências
- amoxicilina na pneumonia 80–90→50–90 mg/kg/dia: 44 divergências

## Delta: original × nova versão

Texto idêntico: 354 comparações. Mesmo número com formato diferente: 177. Diferente, com motivo registrado: 719.

| Campo | Idêntico | Mesmo número | Diferente | Motivo |
|---|---|---|---|---|
| `altCopy` | 0 | 0 | 10 | Receita refeita: gotas calculadas (o original dava paracetamol em mL sem gotas, intervalo de 6–8 h e ibuprofeno para qualquer idade, sem alerta de dengue). Dipirona de 10 mg/kg/dose (0,4 gota/kg), como no Manual PPS do autor. |
| `altIdade` | 9 | 1 | 0 | Idade passa a ser lida e normalizada (dias, meses, anos). |
| `altPeso` | 1 | 9 | 0 | Só formato (18,0 kg → 18 kg). |
| `atbSind` | 0 | 0 | 10 | Lista de síndromes ampliada e reordenada; a primeira passou a ser sepse comunitária. |
| `atbTab` | 0 | 0 | 10 | Coluna Dose total passou a ser calculada (o original repetia a dose máxima); doses revistas por síndrome. Amoxicilina de 80–90 mg/kg/dia como 1ª linha na pneumonia e na otite (Manual PPS); benzatina com os dois cortes de peso. |
| `atbTit` | 0 | 0 | 10 | Idem. |
| `cartaDrogas` | 0 | 0 | 10 | Mesmas doses onde o original estava certo; corrigidos o volume da atropina (mostrava a dose em mg como mL), tetos ausentes e 4 linhas acrescentadas (adrenalina ET, adenosina 1ª e 2ª, naloxona). Volumes nas duas apresentações de atropina, lidocaína e magnésio (folha ABRAMEDE-MG). |
| `chAlvo` | 0 | 3 | 7 | Alvos passam a depender da idade (o original usava alvos de adulto para todos). |
| `chDetail` | 0 | 0 | 10 | Conduta revista (SSC 2026, AHA 2025). |
| `chExp` | 0 | 0 | 10 | Mostra a faixa de 10–20 mL/kg por alíquota e limita a 1.000 mL; recém-nascido 10 mL/kg. |
| `chExpCap` | 0 | 0 | 10 | Texto revisto. |
| `chRecon` | 0 | 0 | 10 | Idem (critérios Phoenix). |
| `chVaso` | 8 | 2 | 0 | Mesma vazão para noradrenalina onde aplicável; agora o primeiro fármaco depende do tipo de choque e da idade (anafilaxia: adrenalina IM). |
| `chVasoCap` | 0 | 0 | 10 | Texto revisto; removido 'gotas/min' de vasoativo. |
| `coAgua` | 9 | 0 | 1 | Idem. |
| `coDef` | 4 | 2 | 4 | Mesmo valor com 1 casa; fração de água agora varia com idade e sexo. |
| `coFrac` | 0 | 0 | 10 | Fração por idade e sexo (o original usava 0,6 para todos). |
| `coTab` | 0 | 0 | 10 | Sódio em NaCl 3% (o original indicava NaCl 20% puro); potássio em mEq/mL correto; fósforo conforme bula (1,1 mmol/mL); magnésio 25–50 mg/kg. |
| `coVel` | 0 | 0 | 10 | Passa a calcular o limite em mEq e em mL/h de NaCl 3%. |
| `defH` | 0 | 0 | 10 | O original repunha todo o déficit em 8 h; agora metade em 8 h e metade em 16 h. |
| `defMl` | 0 | 10 | 0 | Só formato. |
| `diagChecks` | 0 | 0 | 10 | Cinco sinais acrescentados. |
| `diagOut` | 0 | 0 | 10 | Texto de orientação. |
| `docTxt` | 0 | 10 | 0 | Peso, idade, sexo e data já preenchidos; edição preservada. |
| `dvCap` | 0 | 0 | 10 | Mostra concentração e preparo; removido 'gotas/min'. |
| `dvDose` | 0 | 0 | 10 | Dose inicial passa a ser o mínimo da faixa do fármaco. |
| `dvOut` | 0 | 0 | 10 | Idem (0,05 em vez de 0,1 mcg/kg/min); mesma fórmula. |
| `dvTable` | 0 | 0 | 10 | Soluções padronizadas e conferidas (o original trazia dexmedetomidina 10 vezes mais concentrada e dopamina com massa impossível em 50 mL). |
| `equipTab` | 0 | 0 | 10 | Tamanhos por faixa de peso (o original repetia fórmulas e trazia agulha intraóssea errada). Quatro itens acrescentados da folha ABRAMEDE-MG do autor: cateter central, cateter arterial, descompressão torácica e bougie. |
| `fcRef` | 3 | 3 | 4 | Faixas por idade em vigília e sono (PALS). |
| `formDose` | 0 | 0 | 10 | Só formato. |
| `formVol` | 6 | 3 | 1 | Só formato. |
| `frRef` | 4 | 0 | 6 | Faixas por idade (MS 2023). |
| `intoxTab` | 0 | 0 | 10 | Tetos acrescentados, pralidoxima na apresentação brasileira, insulina diluída a 1 U/mL (o original pedia 0,1 mL de insulina pura) e 7 antídotos acrescentados. |
| `itCarv` | 0 | 0 | 10 | Diluição 1:10 em água. |
| `itNac1` | 0 | 0 | 10 | Mesma dose; acrescentado o volume. |
| `itNac2` | 0 | 0 | 10 | Idem. |
| `itNac3` | 0 | 0 | 10 | Idem. |
| `lamRef` | 0 | 3 | 7 | Lâmina por idade revista. |
| `mCont` | 0 | 0 | 10 | ERRO CORRIGIDO: o original calculava 54 mL/h para 18 kg (solução de 5 mg em 50 mL); o correto, a 1 mg/mL, é 5,4 mL/h. |
| `mFb` | 0 | 10 | 0 | Faixa de 15–20 mg/kg. |
| `mFen` | 0 | 1 | 9 | Mesma dose; teto de 1.500 mg e tempo mínimo de infusão. |
| `mIM` | 0 | 0 | 10 | Mesma dose; volume com 2 casas. |
| `mIV` | 0 | 1 | 9 | Faixa de 0,1–0,2 mg/kg. |
| `mLev` | 0 | 1 | 9 | Faixa de 40–60 mg/kg com teto. |
| `mRet` | 0 | 5 | 5 | Mesma dose; acrescentados volume e teto de 20 mg. |
| `mVal` | 0 | 0 | 10 | Faixa de 20–40 mg/kg com teto e restrição de idade. |
| `meCa` | 0 | 0 | 10 | Mesmo valor; volume com 1 casa (o original arredondava 10,8 mL para 11 mL). |
| `meExp` | 0 | 7 | 3 | Só formato; limite de 1.000 mL. |
| `meG10` | 0 | 6 | 4 | Recém-nascido 2 mL/kg; teto de 250 mL. |
| `meGlu` | 0 | 0 | 10 | ERRO CORRIGIDO: 'glicose 1 g/kg a cada 2 h' não existe no tratamento da cetoacidose; agora glicose no soro (ISPAD 2022). |
| `meIns` | 0 | 10 | 0 | Só formato. |
| `meK` | 0 | 0 | 10 | ERRO CORRIGIDO: o volume usava 1,5 mEq/mL, concentração que não existe; KCl 19,1% tem 2,56 mEq/mL. |
| `meNa` | 4 | 2 | 4 | Mesmo cálculo; fração de água por idade e sexo e valores vindos da aba Correção. |
| `pAde` | 0 | 7 | 3 | Só formato. |
| `pAde2` | 0 | 8 | 2 | Só formato. |
| `pAtro` | 0 | 10 | 0 | Só formato; teto por idade. |
| `pCa` | 0 | 0 | 10 | Mesmo valor; volume com 1 casa (o original arredondava 10,8 mL para 11 mL). |
| `pCaCl` | 0 | 0 | 10 | Só formato (ordem dos números). |
| `pMg` | 0 | 0 | 10 | Acrescentada a ampola a 10%. |
| `paRef` | 6 | 3 | 1 | Só formato. |
| `posTab` | 0 | 0 | 10 | ERRO CORRIGIDO: amoxicilina 90 mg/kg era aplicada por dose (3 vezes a dose diária); coluna de gotas mostrava mL/h. Tabela passou de 9 para 56 linhas. |
| `repTab` | 0 | 0 | 10 | Mesmos erros corrigidos; restrições de idade aplicadas; de 16 para 67 medicamentos. |
| `sCardio` | 0 | 7 | 3 | Só formato. |
| `sCardio2` | 7 | 0 | 3 | Limite na carga de adulto. |
| `sDesf` | 7 | 0 | 3 | Limite na carga de adulto. |
| `sDesf2` | 0 | 7 | 3 | Acrescentado o limite de 10 J/kg. |
| `sG10` | 0 | 6 | 4 | Só formato. |
| `sPcr` | 0 | 0 | 10 | Só formato. |
| `sSF` | 0 | 6 | 4 | Só formato; limite de 1.000 mL. |
| `scRef` | 1 | 8 | 1 | Fórmula por peso (o original chamava de Mosteller um cálculo com altura suposta). |
| `so421t` | 0 | 8 | 2 | Só formato; teto de 100 mL/h. |
| `soExp` | 6 | 0 | 4 | Recém-nascido 10 mL/kg; limite de 1.000 mL. |
| `soK` | 0 | 0 | 10 | Valor inicial: 13 mEq (solução isotônica usual). |
| `soKF` | 0 | 0 | 10 | ERRO CORRIGIDO: o original tratava o mesmo campo como mEq em uma linha e como mL em outra. |
| `soMan` | 0 | 0 | 10 | Só formato. |
| `soManCap` | 0 | 0 | 10 | Texto. |
| `soNa` | 0 | 0 | 10 | Valor inicial: 68 mEq (o original partia de solução muito hipotônica). |
| `soNaF` | 0 | 0 | 10 | Idem. |
| `soVol` | 0 | 0 | 10 | Idem. |
| `totCom` | 4 | 0 | 6 | Idem. |
| `totSem` | 3 | 0 | 7 | Recém-nascido e lactente por faixa; limites no adolescente. |
| `trMan` | 0 | 0 | 10 | Mostra a faixa de volume para 0,5–1 g/kg. |
| `trSH` | 0 | 0 | 10 | Faixa de 2–5 mL/kg (diretriz de TCE pediátrico 2019). |
| `trTr` | 0 | 6 | 4 | Mostra 10–20 mL/kg. |
| `trTxa` | 0 | 0 | 10 | Teto de 1 g e manutenção limitada a 125 mg/h. |
| `trVol` | 0 | 7 | 3 | Só formato; limite de 1.000 mL. |
| `tubCm` | 0 | 1 | 9 | Profundidade por idade (idade ÷ 2 + 12); o original usava 3 × tubo, que superestima na criança maior. |
| `viaCom` | 0 | 0 | 10 | ERRO CORRIGIDO: campo ficava vazio. |
| `viaProf` | 0 | 0 | 10 | Idem. |
| `viaSem` | 0 | 0 | 10 | Idem. |
| `viaTab` | 0 | 0 | 10 | ERRO CORRIGIDO: a tabela de indução e bloqueio não era preenchida no original. Conferida com a folha ABRAMEDE-MG: etomidato 0,2–0,3, propofol 1–2,5, succinilcolina por idade, cisatracúrio e atropina nas ampolas de 0,5 e 0,25 mg/mL. |
| `vmPeso` | 0 | 2 | 8 | ERRO CORRIGIDO: o original aplicava peso predito de adulto a crianças (18 kg virava 36,9 kg). |
| `vmTab` | 0 | 0 | 10 | Parâmetros por faixa revistos. |
| `vmVt` | 2 | 0 | 8 | Idem: 221 mL para uma criança de 18 kg; o correto é 108 mL. |
| `vnE` | 0 | 2 | 8 | Valores iniciais por idade. |
| `vnI` | 0 | 0 | 10 | Idem. |
| `wBtns` | 0 | 0 | 10 | Rótulos sem a casa decimal. |

Campos sem nenhuma diferença: btnAnalisa, chTitulo, choqueSel, coNa, coNaAlvo, desPct, docSel, docTit, dvDrug, dvVol, gaAG, gaCl, gaDD, gaGlic, gaHco, gaNa, gaNaC, idade, imgOut, imgTexto, navSearch, peso, repBusca, sexo, so421a, so421b, so421c