# Emergência & UTI: fontes e testes

O site publicado fica em `sites/emergencia-uti/`: a página `index.html` (arquivo único, com o núcleo calculado) e a pasta `acervo/` (conteúdo integrado, carregado sob demanda). Os dois são gerados a partir desta pasta.

Endereço público: https://emergencia-uti.sites-pediatria.workers.dev/

## Duas camadas

- Núcleo calculado: 26 abas de Estabilização, Fármacos, Suporte, Raciocínio e Alta. Toda dose passa pelo motor de dose e é conferida pelo oráculo.
- Acervo integrado: 4 abas (Protocolos por diagnóstico, Monografias e Manual PPS, Calculadoras de escores, Acervo e fontes) com 1.985 itens dos sites e documentos do autor. Os sites entram como estão na origem; o Tratado de combinações semiológicas e o Guia de soroterapia, do Drive, foram revisados na integração (correções listadas no próprio acervo).

## Estrutura

- `src/core.js`: formatação de números, leitura da idade, faixas etárias, faixas de peso, tubo traqueal e motor de dose (dose por kg, teto, mínimo).
- `src/data-farmacos.js`: carta de parada, sequência rápida, antídotos, infusões contínuas, repertório e restrições de idade.
- `src/data-clinica.js`: choques, equipamentos por faixa de peso, antibióticos por síndrome, hipóteses diagnósticas, achados de laudo, modelos de documentos e grupos de abas.
- `src/data-novos.js`: sedação para procedimento, doses tóxicas por peso, modos ventilatórios, configuração do acervo, sites e documentos do autor e tabela de conferência com o Manual PPS e a folha ABRAMEDE-MG.
- `src/ui-novos.js`: cálculo dos painéis novos e leitor do acervo (busca, filtros, leitura, calculadora de escores embutida, busca no menu e links diretos `#aba/coleção/item`).
- `src/ui.js`: cálculo de cada aba do núcleo, navegação, cópia, impressão e tema.
- `src/body1.html` e `src/body2.html`: texto das 30 abas.
- `src/styles.css`: desenho (cromado escuro na navegação, conteúdo claro), tema escuro, celular e impressão.
- `fonts/`: Barlow Semi Condensed (SIL Open Font License 1.1), embutida no arquivo final.
- `acervo/gera_acervo.py`: gera `dist/acervo/` a partir dos sites do portal e do texto do Manual PPS.
- `acervo/dump_escores.mjs`: lista os escores do app Escores Clínicos (usado pelo gerador e pelo teste do acervo).
- `acervo/gera_drive.py` e `acervo/tratado.tsv`: acrescentam ao acervo o Tratado (160 combinações, com as correções) e as 15 páginas do Guia de soroterapia.

## Gerar o site

```
python3 build.py
node acervo/dump_escores.mjs ../../sites/scores-clinicos /tmp/escores.json
pdftotext -layout ../../sites/laboratorioeradiografia/nexo/Manual_Integral_Prescricao_Pediatrica_Segura.pdf /tmp/manual.txt
python3 acervo/gera_acervo.py ../../sites /tmp/manual.txt /tmp/escores.json dist/acervo
python3 acervo/gera_drive.py dist/acervo
cp ../../sites/scores-clinicos/{*.mjs,index.html,style.css} dist/acervo/escores/
cp ../../sites/neonatologia/assets/reanimacao-*.svg dist/acervo/neo/assets/
cp dist/index.html ../../sites/emergencia-uti/index.html
cp -r dist/acervo ../../sites/emergencia-uti/
```

O site vai ao ar quando os arquivos chegam ao ramo `main` (o Worker `emergencia-uti` lê `main/sites/emergencia-uti`, com cache de até 5 minutos).

## Testar antes de publicar

Requer Node com Playwright e o Chrome (variável `CHROME` para outro caminho). O acervo é lido por HTTP, então os testes funcionais rodam contra um servidor local ou contra o endereço público.

```
(cd dist && python3 -m http.server 8765 --bind 127.0.0.1 &)
node tests/funcional.js http://127.0.0.1:8765/index.html
node tests/captura.js dist/index.html tests/matriz-novo.json tests/matriz.json && python3 tests/oraculo.py tests/matriz-novo.json
node tests/captura.js dist/index.html tests/varredura-novo.json tests/varredura.json && python3 tests/oraculo.py tests/varredura-novo.json
node tests/captura.js dist/index.html tests/base-novo.json && python3 tests/delta.py tests/base-original.json tests/base-novo.json tests/relatorio-delta.md
python3 tests/acervo.py dist/acervo ../../sites/scores-clinicos
python3 tests/mutacao.py
```

- `oraculo.py` recalcula cada dose, volume, gota, vazão, dose tóxica, volume corrente e conta de soroterapia a partir de uma tabela própria, digitada à parte, e compara com o que a tela mostra. Ao mudar uma dose em `src/`, a mesma mudança precisa ser feita no oráculo; se as duas não baterem, o teste falha.
- `mutacao.py` injeta 16 erros de dose, um de cada vez, e exige que o oráculo acuse cada um.
- `delta.py` compara a versão nova com o arquivo original (`tests/base-original.json`) e exige um motivo escrito para cada diferença.
- `acervo.py` confere índice, arquivos, contagens, linhas do Manual PPS, escores e figuras, e procura conteúdo ativo.
- `funcional.js` percorre as 30 abas, a busca, o paciente, os painéis novos, o leitor do acervo, a cópia, a impressão e o celular.
- `tests/relatorio-testes.md` traz o resultado da versão publicada em 25/11/2026.

## Regras que o código segue

- Nenhum dado do paciente é salvo; só o tema e a última aba ficam no navegador.
- Com peso ou idade inválidos, os cálculos ficam suspensos.
- Toda dose do núcleo passa pelo motor de dose, que aplica teto e mínimo; restrição de idade bloqueia a linha em vez de mostrar dose.
- O leitor do acervo escapa todo texto antes de formatar; links só com http ou https; figuras só da pasta do próprio acervo.
- JavaScript em ES5, sem dependência externa; o acervo e a calculadora de escores vêm do mesmo endereço do site.
