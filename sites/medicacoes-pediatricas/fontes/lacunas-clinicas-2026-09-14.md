> Registro histórico de uma etapa anterior. Para o estado atual dos nove esquemas, consulte [a revisão complementar](./nove-esquemas-revisao-2026-09-14.json) e o PDF de posologias atualizado. Classificações desta etapa não equivalem a validação clínica atual.

> Atualização posterior desta mesma data: as conclusões sobre as nove lacunas abaixo são históricas e foram substituídas pela [revisão dirigida dos nove esquemas](nove-esquemas-revisao-2026-09-14.json). Ondansetrona VO foi configurada; verapamil tem dois ramos assistidos e dantroleno/SNM tem manutenção assistida. Os seis demais ramos foram omitidos dos seletores. As cinco correções anteriores permanecem vigentes.

# Lacunas clínicas — revisão dirigida de 14/09/2026

Baseline da pesquisa: versão 102, commit `ce0c22ef469f13714ac86ea3fdd833f0376c38ab`. As correções foram conciliadas com a versão 103 antes da publicação, preservando suas revisões do catálogo e dos cálculos.

## Corrigido no fluxo de cálculo

| Medicamento | Alteração | Limite preservado |
| --- | --- | --- |
| Acetazolamida | Alcalose metabólica separada do edema cardíaco: intervalos próprios e populações neonatal/pediátrica distintas. | A fonte CHEO não define teto absoluto específico para alcalose. A titulação na hipertensão intracraniana idiopática continua exigindo conciliação entre protocolos; não se unificou peso real com peso ideal. |
| Manitol | Produto brasileiro 20%, frasco 250 mL, vinculado ao resgate de lesão cerebral na CAD; volume, preparo sem diluente, bomba e linha copiável. Corrigida também a restrição etária qualitativa que impedia cálculo em crianças. | O preparo em 20 minutos usa a faixa CPS de 15–20 minutos e não se aplica automaticamente a outras causas de hipertensão intracraniana ou glaucoma. |
| Trimebutina | Cápsula mole de maleato, esquema por tomada e teto diário acima de 12 anos, conforme bula brasileira. | Suspensão pediátrica brasileira não confirmada; não extrapolar o esquema aos menores. |
| Isavuconazol | Apresentações brasileiras e uso pediátrico off-label documentados; cápsula oral deixa de ser classificada como injetável. Protegida a conversão que confundia quantidade de pró-fármaco com quantidade ativa. | A tabela pediátrica FDA permanece internacional. Não há conversão automática para mL do frasco brasileiro enquanto as bases e o preparo não estiverem vinculados. |
| Vitamina E | Fibrose cística e colestase separadas por indicação, idade e forma química. | Tocoferol em UI não é convertido em mg de acetato sem equivalência do produto. Tocofersolano é referência internacional identificada, sem confirmação de disponibilidade brasileira. A suplementação neonatal permanece pendente de apuração do aporte total e formulação apropriada. |

## Checagem clínica, matemática e reversa

Exemplos sintéticos dos testes, não prescrições individuais:

- Acetazolamida, alcalose, 20 kg: 5 × 20 = 100 mg/dose; três ou quatro tomadas produzem 300 ou 400 mg/dia, respectivamente. Reversa: total diário ÷ número de tomadas ÷ peso = 5 mg/kg/dose. O esquema diurético diário não recebe esse total.
- Manitol, 20 kg, CAD: 10–20 g ÷ 0,2 g/mL = 50–100 mL. Em 20 minutos: 150–300 mL/h. Reversa independente: taxa × 20/60 × 0,2 = 10–20 g. Teto de 100 g respeitado em pesos elevados; sem repetição automática.
- Trimebutina: 200 mg ÷ 200 mg/cápsula = uma cápsula por tomada; duas ou três tomadas = 400 ou 600 mg/dia. Dose expressa em maleato, não na massa equivalente da base.
- Isavuconazol: 20 kg × 10 mg/kg do pró-fármaco = 200 mg de pró-fármaco; isso não corresponde a um frasco de 200 mg do fármaco ativo. O teste rejeita essa divisão incorreta mesmo se uma checagem reversa ingênua a reproduzir.
- Vitamina E: fibrose cística utiliza dose diária absoluta em UI. No regime exclusivo de tocofersolano da referência internacional, 20 kg × 0,34 mL/kg/dia = 6,8 mL/dia; 6,8 × 50 ÷ 20 = 17 mg/kg/dia de d-alfa-tocoferol nessa formulação. Não substituir pela cápsula de acetato.

## Pendências que não equivalem a erro de programação

Os nove esquemas classificados como lacuna pelo PDF são: escetamina na asma, clopidogrel em stents de crianças maiores, clorpromazina na coreia de Sydenham, dantroleno na síndrome neuroléptica maligna, ondansetrona em radioterapia, sucralfato na gastrite erosiva, verapamil em hipertensão/angina, venlafaxina no pânico e acetato de cálcio na DRC. Não foram substituídos por doses de outras indicações.

A pesquisa dirigida de clorpromazina, dantroleno, sucralfato e verapamil não estabeleceu esquema pediátrico específico suficiente para promover esses quatro ramos a cálculo automático. A ausência de protocolo encontrado nesta pesquisa não significa proibição universal de uso especializado.

Na triagem complementar dos outros cinco ramos, não se obteve documento integral suficiente para liberar nova dose automática. Em clopidogrel, foi localizado [consenso de neurointervenção pediátrica de junho/2026](https://pubmed.ncbi.nlm.nih.gov/42276776/): a conferência integral de população, cenário e duração permanece pendente. Para ondansetrona, [bula HPRA](https://assets.hpra.ie/products/Human/37847/Licence_PA2059-080-002_10012024151640.pdf) registra ausência de ensaios controlados pediátricos em radioterapia; isso não significa inexistência de qualquer estudo. Na DRC, a [PRNT](https://pmc.ncbi.nlm.nih.gov/articles/PMC6969014/) orienta individualizar quelantes pelo fósforo alimentar; não há dose fixa universal de acetato de cálcio para substituir essa avaliação.

Fontes da triagem dos quatro ramos anteriores: [Utah Poison Control — dantroleno/SNM](https://poisoncontrol.utah.edu/news/2025/05/utility-of-dantrolene-treating-neuroleptic-malignant-syndrome), [AEP — dantroleno](https://www.aeped.es/comites/cm/pediamecum/principios-activos/dantroleno), [AEP — sucralfato](https://www.aeped.es/comites/cm/pediamecum/principios-activos/sucralfato), [AAP — consenso Sydenham de 2025, acesso parcial](https://publications.aap.org/pediatrics/article/156/6/e2025072466/205465/Evaluation-Diagnosis-and-Treatment-of-Sydenham). Doses descritas para hipertermia maligna, agitação ou profilaxia de hemorragia não resolvem automaticamente SNM, coreia ou gastrite erosiva.

Os registros de 13/09 são históricos e não representam o estado final de cada campo revisto posteriormente. Este delta não certifica todas as indicações, apresentações, doses e interações dos 554 itens ativos. O histórico documental foi preservado; a consulta inclui o catálogo corrigido da versão 103 e os avisos desta revisão dirigida.

## Evidências e testes reproduzíveis

`tests/clinical-gaps-2026-09-14.test.mjs` cobre as cinco medicações, renderização real da posologia, limites de idade, dose diária, teto e unidades, preparação em bomba, checagem reversa, rejeição de apresentação incompatível e espelhos públicos dos dados. Executar com `node --import tsx --test tests/clinical-gaps-2026-09-14.test.mjs`.

Dados e fontes por correção: [registro estruturado](lacunas-clinicas-2026-09-14.json). Na consulta posológica, os avisos de revisão identificam as alterações e suas fontes.
