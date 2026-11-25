# Emergência & UTI: fontes e testes

O site publicado é um arquivo único: `sites/emergencia-uti/index.html`. Ele é gerado a partir desta pasta.

Endereço público: https://emergencia-uti.sites-pediatria.workers.dev/

## Estrutura

- `src/core.js`: formatação de números, leitura da idade, faixas etárias, faixas de peso, tubo traqueal e motor de dose (dose por kg, teto, mínimo).
- `src/data-farmacos.js`: carta de parada, sequência rápida, antídotos, infusões contínuas, repertório e restrições de idade.
- `src/data-clinica.js`: choques, equipamentos por faixa de peso, antibióticos por síndrome, hipóteses diagnósticas, achados de laudo e modelos de documentos.
- `src/ui.js`: cálculo de cada aba, navegação, cópia, impressão e tema.
- `src/body1.html` e `src/body2.html`: texto das 26 abas.
- `src/styles.css`: desenho, tema claro e escuro, celular e impressão.
- `fonts/`: Barlow Semi Condensed (SIL Open Font License 1.1), embutida no arquivo final.

## Gerar o site

```
python3 build.py
cp dist/index.html ../../sites/emergencia-uti/index.html
```

O site vai ao ar quando o arquivo chega ao ramo `main` (o Worker `emergencia-uti` lê `main/sites/emergencia-uti`, com cache de até 5 minutos).

## Testar antes de publicar

Requer Node com Playwright e o Chrome (variável `CHROME` para outro caminho).

```
node tests/funcional.js
node tests/captura.js dist/index.html tests/matriz-novo.json tests/matriz.json && python3 tests/oraculo.py tests/matriz-novo.json
node tests/captura.js dist/index.html tests/varredura-novo.json tests/varredura.json && python3 tests/oraculo.py tests/varredura-novo.json
node tests/captura.js dist/index.html tests/base-novo.json && python3 tests/delta.py tests/base-original.json tests/base-novo.json tests/relatorio-delta.md
```

- `oraculo.py` recalcula cada dose, volume, gota e vazão a partir de uma tabela própria, digitada à parte, e compara com o que a tela mostra. Ao mudar uma dose em `src/`, a mesma mudança precisa ser feita no oráculo; se as duas não baterem, o teste falha.
- `delta.py` compara a versão nova com o arquivo original (`tests/base-original.json`) e exige um motivo escrito para cada diferença.
- `funcional.js` percorre as 26 abas, a busca, o paciente, a cópia, a impressão e o celular.
- `tests/relatorio-testes.md` traz o resultado da versão publicada em 24/11/2026.

## Regras que o código segue

- Nenhum dado do paciente é salvo; só o tema e a última aba ficam no navegador.
- Com peso ou idade inválidos, os cálculos ficam suspensos.
- Toda dose passa pelo motor de dose, que aplica teto e mínimo; restrição de idade bloqueia a linha em vez de mostrar dose.
- JavaScript em ES5, sem dependência externa.
