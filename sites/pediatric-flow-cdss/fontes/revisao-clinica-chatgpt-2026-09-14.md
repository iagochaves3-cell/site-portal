> Registro histórico de uma etapa anterior. Para o estado atual dos nove esquemas, consulte [a revisão complementar](./nove-esquemas-revisao-2026-09-14.json) e o PDF de posologias atualizado. Classificações desta etapa não equivalem a validação clínica atual.

> Atualização posterior desta mesma data: as conclusões sobre as nove lacunas abaixo são históricas e foram substituídas pela [revisão dirigida dos nove esquemas](nove-esquemas-revisao-2026-09-14.json). Ondansetrona VO foi configurada; verapamil tem dois ramos assistidos e dantroleno/SNM tem manutenção assistida. Os seis demais ramos foram omitidos dos seletores. As cinco correções anteriores permanecem vigentes.

# Revisão incremental — 14/09/2026

Projeto: Emergência Pediátrica — Doses e Cálculos.
Baseline: versão 100, commit `63383410f4250ef9da0222f82184ab9141f4b9d7`.

Esta revisão trata de divergências comprovadas em quatro medicamentos. Preserva os PDFs originais, suas 498 monografias e 1.263 esquemas, além dos registros anteriores de revisão. Não representa validação clínica integral do catálogo.

| Medicamento | Divergência efetiva | Correção |
| --- | --- | --- |
| Amoxicilina/clavulanato | Dose alta vinculada à suspensão 7:1 e teto genérico de 2 g/dose | Ramo de suspensão 14:1, com teto usual UCSF de 1 g/dose, indicação, idade e peso explícitos; troca automática por outra proporção impedida. O ramo XR de sinusite permanece distinto. |
| Metronidazol | Teto ausente, apendicite misturada a outros abscessos, clone odontogênico EV e concentração do éster usada como base | Separação dos regimes e tetos; suspensão equivalente a 25 mg/mL de base; retirada do clone EV sem protocolo específico, mantendo esquema periodontal oral qualificado. |
| Somatropina | PIG agrupado com Turner/DRC | PIG separado a partir de quatro anos no ramo brasileiro; Turner e DRC conservam regimes próprios. |
| Tadalafila | Dose ponderal antiga e fronteira de 40 kg incorreta | Faixas EMA para HAP de 2 a <18 anos, com 40 kg incluídos na faixa maior; referência europeia e restrições identificadas. |

## Checagem clínica, matemática e reversa

Exemplos sintéticos de verificação, sem representar prescrição de um paciente:

- Amoxicilina/clavulanato, 20 kg: 45 × 20 = 900 mg de amoxicilina/dose; 900/120 = 7,5 mL. Reversa: 7,5 × 120 = 900 mg. O segundo componente é calculado separadamente. A partir do teto deste ramo, o volume exato é 1.000/120 mL.
- Metronidazol EV, 80 kg: no esquema de 8/8 h, aplica-se o teto de 500 mg, correspondendo a 100 mL da solução 5 mg/mL. Na apendicite de 24/24 h, teto de 1.500 mg corresponde a 300 mL. Reversa: volume × 5. O preparo conserva o padrão de 60 minutos e o limite simultâneo de 25 mg/min.
- Metronidazol oral, amebíase, 20 kg: 15 × 20 = 300 mg de base; 300/25 = 12 mL. Reversa: 12 × 25 = 300 mg. Os 40 mg/mL do éster não são usados como concentração da base.
- Somatropina em PIG, 20 kg: 0,035 × 20 = 0,7 mg/dia; reversa 0,7/20 = 0,035 mg/kg/dia. A graduação da caneta e o volume dependem do produto.
- Tadalafila em HAP: exatamente 40 kg pertence ao ramo de 40 mg/dia; dois comprimidos de 20 mg totalizam 40 mg. A faixa abaixo de 40 kg é distinta.

## Regressão permanente

`tests/clinical-delta-2026-09-14.test.mjs` verifica resultados renderizados, idade, peso, tetos, concentração, cálculo reverso e rejeição de apresentação incompatível. Inclui fronteiras de 1 mês, 1 ano, 2 anos, 4 anos, 18 anos e 40 kg. Os testes de integridade preservam os PDFs e todos os esquemas originais.

A folha de estilos da consulta foi movida para o layout global, preservando o desenho e permitindo que os testes importem as calculadoras reais. A revisão técnica abrange tipagem, lint, construção de produção, regressão e smoke do artefato. Não houve ensaio clínico nem teste de uso assistencial real.

## Limites preservados

- Os regimes UCSF, PCH, AAPD e as bulas de produtos continuam identificados separadamente; não são fundidos em uma faixa universal.
- A aprovação pediátrica brasileira da tadalafila para HAP não foi confirmada. A referência operacional é europeia.
- A indicação odontogênica EV genérica de metronidazol continua sem protocolo específico confirmado nesta revisão e não gera dose automática. O esquema periodontal oral não a substitui.
- As demais lacunas registradas em 13/09/2026 não foram revalidadas integralmente nesta manutenção. Os estados de suporte do catálogo são declarados pelo documento.

## Fontes por medicamento

### Amoxicilina + Clavulanato de potássio

- [GSK Brasil — Clavulin ES, bula profissional, seções 1 e 8](https://br.gsk.com/media/o31pswrk/clavulin-es-suspens%C3%A3o-oral.pdf)
- [UCSF — Otite média aguda](https://idmp.ucsf.edu/content/acute-otitis-media)
- [UCSF — Máximos e formulações de amoxicilina/clavulanato](https://idmp.ucsf.edu/content/maximum-dosing-for-amoxicillin-and-amoxicillin-clavulanate-0)
- [UCSF — Rinossinusite bacteriana aguda](https://idmp.ucsf.edu/guidelines-empiric-therapy-categories/respiratory-head-and-neck-infections)

### Somatropina (Hormônio do crescimento recombinante - rhGH)

- [Pfizer Brasil — Genotropin, bula do paciente de 10/09/2025, tabela posológica](https://www.pfizer.com.br/files/Genotropin_Paciente_22.pdf)
- [EMA — Omnitrope, SmPC, seções 4.1–4.4](https://www.ema.europa.eu/en/documents/product-information/omnitrope-epar-product-information_en.pdf)

### Tadalafila

- [EMA — ADCIRCA, SmPC atualizado em 27/01/2026, seções 4.1–4.4](https://www.ema.europa.eu/en/documents/product-information/adcirca-epar-product-information_en.pdf)

### Metronidazol / Benzoilmetronidazol

- [UCSF — doses antimicrobianas para lactentes e crianças acima de 1 mês; esquema usual e apendicite distintos](https://idmp.ucsf.edu/pediatric-antimicrobial-dosing-benioff-childrens-hospitals)
- [PCH ChAMP — metronidazol, revisão novembro/2024: giardíase, amebíase e administração IV](https://pch.health.wa.gov.au/~/media/Files/Hospitals/PCH/General-documents/Health-professionals/ChAMP-Monographs/Metronidazole.pdf)
- [AAPD — Useful Medications for Oral Conditions: doença periodontal e ausência de recomendação infantil para infecção odontogênica genérica](https://www.aapd.org/globalassets/media/policies_guidelines/r_usefulmeds.pdf)
- [EMS — página oficial de benzoilmetronidazol e acesso à bula digital](https://www.ems.com.br/medicamentos/benzoilmetronidazol/)
- [EMS — bula digital vinculada pelo fabricante: 40 mg do éster equivalem a 25 mg de metronidazol por mL](https://www.sara.com.br/bula-do-paciente-benzoilmetronidazol-40mg-ml-suspensao-oral-com-120ml-copo-dosador-ems/7896004702049/pdf)
- [AEP — Parasitosis intestinales, protocolo 2022: duração de 10 dias na colite e no abscesso hepático amebianos](https://staging.static.aeped.es/11_parasitosis_c5d7ded232.pdf)
- [Hospital Sírio-Libanês — metronidazol: infusão padrão de 60 minutos e equivalência base/éster](https://guiafarmaceutico.hsl.org.br/metronidazol)

[Correções estruturadas desta revisão](revisao-clinica-chatgpt-2026-09-14.json) · [Revisão anterior](revisao-clinica-chatgpt-2026-09-13.md)
