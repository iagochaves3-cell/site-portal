# Registro de fontes definitivas — RECEITA PED

Data de incorporação: 21/08/2026

## Fontes incorporadas

1. **Guia Completo de Farmacoterapia Pediátrica.docx**
   - Escopo declarado e conferido: 413 monografias farmacoterapêuticas pediátricas.
   - Papel no projeto: fonte clínica complementar para apresentações, indicações, doses, intervalos, duração, contraindicações, precauções e monitorização descritas individualmente.
   - SHA-256: `6894fe7b9b15cb3c4cdcfafa8146bbc751f7fd057360c1f6989bfb83978d7177`

2. **Guia_Farmacoterapia_Pediatrica.pdf**
   - Escopo conferido: 96 páginas, índice de 413 fármacos/apresentações.
   - Papel no projeto: edição paginada, estrutura alfabética, apresentações da base e regras de governança/segurança.
   - SHA-256: `d381edd5ec69d799763fc20224e1c1caa2669c405f3352291ff2037c5e2e19bd`

## Regra de integração

- Os dois arquivos são preservados integralmente e consultados em conjunto; nenhum deles substitui os arquivos-mestre ou as instruções gerais do projeto.
- Para conteúdo clínico individualizado, prevalece a monografia específica sustentada por fonte verificável. Campos genéricos do PDF que orientam “consultar indicação específica” não serão convertidos automaticamente em indicação ou dose.
- Divergências de dose, idade, indicação, apresentação, via, diluição, máximo, ajuste renal/hepático, interação, contraindicação, estabilidade ou compatibilidade exigem validação atual antes do uso clínico.
- Hierarquia operacional do projeto: protocolos RMBH → SES-MG → SBP → Ministério da Saúde → ANVISA/bula vigente → diretrizes e fontes primárias internacionais quando necessárias.
- Em receituários pediátricos, toda dose deve passar por tripla checagem: cálculo ponderal; conversão pela apresentação brasileira; validação de dose terapêutica, máximos, intervalo, idade e contraindicações.
- Informações históricas, desatualizadas, internamente conflitantes ou sem referência rastreável permanecem como material documental e não prevalecem sobre fontes atuais de maior autoridade.

## Auditoria de incorporação

- DOCX: 413 títulos numerados identificados.
- PDF: 413 itens no catálogo e 96 páginas.
- Os arquivos não são duplicatas byte a byte e têm funções complementares.
- O DOCX apresenta maior densidade de conteúdo clínico; o PDF contém numerosos registros com campos deliberadamente genéricos e governança explícita contra extrapolação.
- Inclusão definitiva não equivale a validação prospectiva de todas as 413 monografias. Cada prescrição continua exigindo conferência atual e individualizada para o paciente e a indicação.
