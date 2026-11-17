# Servidores dos sites (Cloudflare) — como funciona

Atualizado em 16/11/2026.

Esta pasta **não é um site**. Ela documenta e guarda o código do adaptador que devolveu
o lado de servidor a sete sites que, na cópia de 15/11/2026, só tinham as páginas, e a ponte de IA
(`ia-sites`) que faz as funções de IA funcionarem sem senha e sem chave da OpenAI (seção 10).

## 1. Resumo

| Peça | Endereço | Para que serve |
|---|---|---|
| `acesso-sites` | https://acesso-sites.sites-pediatria.workers.dev/ | Entrada por senha (vale para todos os sites, 30 dias por aparelho). Guarda a senha de acesso e a chave da OpenAI. |
| `abordagem-clinica` | https://abordagem-clinica.sites-pediatria.workers.dev/ | Páginas + `/api/status`, `/api/chat` |
| `atlas-preservacao` | https://atlas-preservacao.sites-pediatria.workers.dev/ | Páginas + `/api/acervo` |
| `dermatologia` | https://dermatologia.sites-pediatria.workers.dev/ | Páginas + `/api/analyze` |
| `guideliness` | https://guideliness.sites-pediatria.workers.dev/ | Páginas + `/api/research`, `/mcp` |
| `laboratorioeradiografia` | https://laboratorioeradiografia.sites-pediatria.workers.dev/ | Páginas + `/api/upload`, `/api/report`, `/api/file` |
| `revisao-pediatrica-continua` | https://revisao-pediatrica-continua.sites-pediatria.workers.dev/ | Páginas + `/api/workspace` |
| `prescricao-integral` | https://prescricao-integral.sites-pediatria.workers.dev/ | Páginas + `/api/clinical`, `/api/protocols`, `/api/whatsapp/*` |
| `ia-sites` | (sem página pública; só ligação interna) | Ponte de IA: atende as chamadas à OpenAI com Cloudflare Workers AI quando não há chave paga ou quando a OpenAI recusa |

- As **páginas** continuam vindo do repositório (`sites/<site>/`), com as mesmas regras de antes:
  `src/estatico.mjs` reproduz o programa estático que estes seis sites já usavam (o de 2.819 bytes, com
  os tipos xlsx/docx/gz). O teste `teste/t11-estatico.mjs` compara, arquivo por arquivo, as respostas do
  programa anterior com as dos pacotes novos.
- As **rotas de servidor** são atendidas pelo **código original** de cada site (o mesmo que rodava
  no ChatGPT Sites), montado junto com o adaptador (`src/adaptador.mjs`).
- Nada foi mudado nas páginas, no layout ou na organização dos sites.

## 2. O que o adaptador troca em relação ao original

| No ChatGPT Sites | Aqui |
|---|---|
| "Entrar com ChatGPT" (`/signin-with-chatgpt`) | Redireciona para a entrada por senha do `acesso-sites` e volta ao site. |
| Identidade do usuário (cabeçalhos `oai-authenticated-user-*` postos pela plataforma) | O adaptador descarta qualquer cabeçalho `oai-*` vindo de fora e só põe a identidade depois de conferir a sessão. Há um único usuário: o proprietário. |
| Chave da OpenAI em variável do site | A chave fica só no `acesso-sites`; cada site a lê por ligação interna (service binding) a cada requisição. |
| Armazenamento R2 (anexos temporários do Laboratório e Raio X) | Workers KV com a mesma interface (`src/shims/balde-kv.mjs`); cada parte expira sozinha. |
| `next/headers`, `next/navigation`, `cloudflare:workers` | Substitutos mínimos em `src/shims/`. |

## 3. Quem pode usar o quê

| Site | Rota | Sem entrada | Com entrada |
|---|---|---|---|
| Dermatologia | `/api/analyze` | 401 (mensagem original) | Análise por IA |
| Guideliness | `/api/research` | 401 (mensagem original, com link de entrada) | Pesquisa em duas etapas |
| Guideliness | `/mcp` | Público (só consulta ao framework; não usa a chave) | idem |
| Revisão Pediátrica Contínua | `/api/workspace` | 401 (mensagem original) | Fila persistente (banco D1) |
| Arquivo Atlas | `/api/acervo` | 401 (mensagem original) | Histórico de revisões (banco D1) |
| Abordagens Clínicas | `/api/status` | Público | idem |
| Abordagens Clínicas | `/api/chat` | **Protegido por senha** (no original era aberto, com limite de 8 consultas/hora por conexão; o limite continua) | Pesquisa clínica |
| Laboratório e Raio X | `/api/upload`, `/api/report` | **Protegido por senha** (no original era aberto) | Envio de anexos e laudo |
| Laboratório e Raio X | `/api/file` | Público, mas só com o código temporário de cada anexo (é por onde a OpenAI lê o arquivo) | idem |

As duas proteções marcadas existem para que ninguém gaste os créditos da chave do proprietário.
Para voltar ao comportamento original nesses dois sites, basta mudar a variável `ACESSO_IA`
do Worker do site de `senha` para `aberto`.

**Desde 16/11/2026, o envoltório (seção 10) decide antes do adaptador:**

| Situação | Identidade | IA usada |
|---|---|---|
| Senha **não** definida | Proprietário (uso livre; `ACESSO_LIVRE=nao` desliga) | Workers AI (ponte `ia-sites`), mesmo com chave paga cadastrada |
| Senha definida, aparelho sem entrada | Nenhuma (proteção original: 401 com link de entrada) | Workers AI nas rotas abertas; a chave paga nunca sai sem sessão |
| Aparelho com entrada e chave paga | Proprietário | OpenAI, modelo original do site; se a OpenAI recusar (sem crédito, chave inválida, limite, erro ou falha de rede), o mesmo pedido é refeito no Workers AI (`IA_RESERVA=desligada` desliga) |
| Aparelho com entrada, sem chave paga | Proprietário | Workers AI |

Prescrição Integral: as rotas `/api/clinical`, `/api/protocols`, `/api/whatsapp/status` e `/api/whatsapp/profile`
seguem a regra do original (401 sem identidade); `/api/whatsapp/webhook` é aberta (a Meta a chama; a mensagem
é conferida pela assinatura `x-hub-signature-256`). O motor clínico é determinístico e não usa IA.

## 4. O que só o proprietário faz (painel da Cloudflare)

Workers & Pages → **acesso-sites** → Settings → Variables and Secrets:

1. Editar **SENHA_DE_ACESSO**: a senha de entrada (8 caracteres ou mais).
2. Editar **OPENAI_API_KEY**: a chave da API da OpenAI (começa com `sk-`).

Os dois foram criados com o valor provisório `PENDENTE`, que o programa trata como "não configurado".
**Desde 16/11/2026, os dois são opcionais:** sem eles, as funções de IA usam o Workers AI (seção 10).
A chave da OpenAI só é usada em aparelho com entrada; por isso, cadastrar a chave sem definir a senha
não muda nada até a senha ser definida.
A senha e a chave **nunca** devem ser escritas em conversa, documento, questionário ou repositório.

Conferência rápida (sem revelar nada): https://acesso-sites.sites-pediatria.workers.dev/estado
responde `{"sessao":…,"senha":true|false,"chave":true|false}`.

Trocar a senha encerra todas as sessões abertas.

## 5. Recursos criados na Cloudflare (conta `109fe541339b709f730adfdb48e0b512`)

| Recurso | Nome | Identificador |
|---|---|---|
| Banco D1 | `acesso-sites` (tabela `tentativas`) | `8dff599c-5ffc-458c-bc4f-3c9b8198ea69` |
| Banco D1 | `abordagem-clinica` | `9e5444d2-d958-4c79-8469-84908f61afdf` |
| Banco D1 | `guideliness` | `1abd12cc-c358-4104-a30b-31acdf13ff61` |
| Banco D1 | `revisao-pediatrica-continua` | `ad586262-e9dd-409e-a195-e54758d0e4ab` |
| Banco D1 | `atlas-preservacao` | `d913dfd6-f92c-4d9c-b125-f9f08f6bd0bc` |
| KV | `laboratorioeradiografia-envios` | `76c119e9e7ff4353b69e5687a4a024df` |
| Banco D1 | `prescricao-integral` (migrações `0000_dear_dakota_north` e `0001_easy_norman_osborn`) | `7fc32c3e-466d-435a-a06e-ea51b85e5757` |
| Worker | `ia-sites` (Durable Object `TrabalhoIA`, armazenamento SQLite, migração `v1`) | — |

Os bancos foram criados com as migrações originais de cada site (`drizzle/*.sql`).

Vínculos de cada Worker de site: `REPO`, `REF` (como antes), `ACESSO_URL`, `ACESSO_IA`,
`ACESSO` (serviço `acesso-sites`, ponto de entrada `Interno`) e, conforme o site, `DB` (D1) ou `ENVIOS` (KV).
Segredos: `acesso-sites` tem `OPENAI_API_KEY`, `SENHA_DE_ACESSO` e `SEGREDO_SESSAO` (aleatório, gerado na
instalação); `abordagem-clinica` tem `AI_RATE_LIMIT_SALT` (aleatório). Cada Worker com servidor tem ainda
`IA` (serviço `ia-sites`, ponto de entrada `Interno`), `SITE_NOME` e o segredo `IA_CHAVE_INTERNA` (aleatório,
gerado na instalação). `prescricao-integral` tem `WHATSAPP_DATA_KEY` (aleatório; cifra os números de WhatsApp
cadastrados — **nunca regenerar**, senão os cadastros ficam ilegíveis) e `WHATSAPP_ENABLED=false`.
Data de compatibilidade `2026-05-15`, com `nodejs_compat` (a mesma dos sites originais).

Modelos: são os padrões do código original — `gpt-5.4-2026-03-05` (Dermatologia), `gpt-6.1-sol`
(Abordagens Clínicas), `gpt-5.5` (Guideliness) e `gpt-5.6` (Laboratório e Raio X). Para trocar sem mexer no
código: variável de texto `OPENAI_MODEL` (ou `OPENAI_REPORT_MODEL` no Laboratório) no Worker do site.
Em 16/11/2026, a chave cadastrada não aceitou o nome curto `gpt-5.6` (404 `model_not_found`); o Laboratório
passou a usar `OPENAI_REPORT_MODEL=gpt-5.6-sol`, o modelo para o qual esse nome curto aponta. Os demais modelos
(`gpt-6.1-sol`, `gpt-5.5`, `gpt-5.4-2026-03-05`) estão liberados para a chave.

## 6. Limites conhecidos

- **Dados antigos não vieram.** Os bancos são novos. A fila da Revisão começa do estado inicial, o Atlas
  começa sem revisões salvas e o histórico de pesquisas do Abordagens Clínicas começa vazio (a exportação
  disponível das 49 pesquisas antigas está com os textos cortados e não foi importada).
- **Um único usuário.** A entrada por senha identifica sempre o proprietário.
- **Custos.** O uso de IA é cobrado na conta da OpenAI do proprietário, por uso.
- **Plano gratuito da Cloudflare.** Limites diários: 100.000 requisições, 1.000 gravações no KV
  (cada parte de 768 KB de um anexo é uma gravação) e 100.000 linhas gravadas no D1.
- **Workers AI gratuito:** 10.000 neurônios por dia, renovados às 00:00 UTC (21h em Brasília). Um laudo do
  Laboratório e Raio X gasta cerca de 2.200 (≈ 4 laudos por dia). Ao esgotar, a mensagem é "Limite diário
  gratuito da IA da Cloudflare atingido".
- **Ponte de IA:** a busca na web é feita no PubMed (não há busca geral na web); PDF digitalizado sem camada de
  texto não é lido (enviar como foto); modelos abertos têm qualidade inferior aos da OpenAI.
- **WhatsApp da Prescrição Integral:** depende de credenciais da Meta que só o proprietário pode cadastrar
  (`WHATSAPP_APP_SECRET`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_WABA_ID`, `WHATSAPP_GRAPH_VERSION`) e de `WHATSAPP_ENABLED=true`. Até lá, `/api/whatsapp/status`
  informa o que falta e o webhook responde 503.

## 7. Código-fonte e reconstrução

- Nesta pasta: adaptador, serviço de acesso, substitutos, ponto de entrada de cada site, programa de
  montagem (`build.mjs`) e testes.
- **Não está neste repositório** (que é público): o código de servidor original de cada site. Ele está
  no Google Drive do proprietário, na subpasta "Extração completa (Colab)" da pasta de cada site, e os
  programas montados ficam na própria Cloudflare.

Para remontar:

1. Extrair os pacotes originais em uma pasta com esta forma (`PACOTES`):
   `dermatologia/dermatologia/source`, `abordagem-clinica/abordagem-clinica/source`,
   `guideliness/guideliness/source`, `laboratorioeradiografia/laboratorioeradiografia/codigo_publicado`,
   `revisao-pediatrica-continua`, `atlas-preservacao`, `prescricao-integral/prescricao-integral/codigo_publicado`.
2. `npm install` e `PACOTES=<pasta> node build.mjs` → gera `dist/<worker>.js`.
3. `CLONE=<clone deste repositório> PACOTES=<pasta> npm test` (60 verificações de servidor e a comparação de 508 respostas estáticas com o programa anterior) e, com Chrome e Playwright,
   `python3 teste/gerar-arquivos.py && npm run test:navegador` (13 verificações com as telas reais dos sites e
   a OpenAI simulada).
4. Enviar pela API da Cloudflare (`PUT /accounts/{conta}/workers/scripts/{worker}`), **sempre** com
   `keep_bindings: ["secret_text"]` e **sem** listar segredos no envio, para não apagar nem sobrescrever a
   senha e a chave do proprietário.

5. Sites com servidor (desde 16/11/2026): enviar **dois módulos** — `principal.js` (cópia de
   `src/ia/envoltorio.mjs`) como `main_module` e `worker.js` (o programa montado) — com os vínculos `IA`
   e `SITE_NOME` e `keep_bindings: ["secret_text"]`.
6. Ponte de IA: `npx esbuild src/ia/ia-sites.mjs --bundle --format=esm --platform=neutral --minify
   --external:cloudflare:* --external:node:* --outfile=dist/ia-sites.js`; enviar com os vínculos `AI` (Workers AI),
   `TRABALHOS` (Durable Object `TrabalhoIA`) e `TESTE_HASH`. A migração `v1` (`new_sqlite_classes: ["TrabalhoIA"]`)
   só vai no primeiro envio. Testes: `node teste/t9-ia.mjs` (16) e `node teste/t10-envoltorio.mjs` (13).

## 8. Como desfazer

- Voltar um site ao modo "só páginas": reenviar ao Worker o programa estático (o mesmo do Worker `portal`),
  com os vínculos `REPO` e `REF`. Os bancos e o KV podem ficar; não custam nada parados.
- O ramo `claude/servidores-pacotes-2026-11-16` contém apenas pacotes cifrados usados no transporte de
  16/11/2026. Não deve ser unido ao `main` e pode ser apagado pelo proprietário.

## 9. Verificação feita em 16/11/2026

- Local (mesmos programas, no `workerd`): 60 verificações de servidor e 13 de navegador (Chrome em modo
  celular, telas reais publicadas, OpenAI simulada): entrada e saída por senha, sessão única para todos os
  sites, identidade forjada recusada, pesquisa/análise/laudo de ponta a ponta, envio de PDF de 1,9 MB em
  partes e leitura idêntica do arquivo, gravação nos bancos e bloqueios de origem.
- Parte estática: 508 respostas comparadas (todos os arquivos publicados dos seis sites e casos de borda,
  com GET, HEAD e POST) entre o programa anterior e os pacotes novos — todas idênticas. Casos que os
  arquivos publicados não cobrem (tipos xlsx/docx/gz/traineddata e colisão `nome.html` × `nome/index.html`)
  ficam em `teste/t12-estatico-casos.mjs`, com árvore sintética; o teste falha se qualquer um dos dois
  comportamentos for desfeito (conferido).
- Na Cloudflare: páginas dos seis sites carregando; rotas sem entrada respondendo 401/503 com as mensagens
  esperadas; com uma sessão de teste (criada e desfeita na hora), cada rota chegou ao ponto "falta a chave"
  ou devolveu os dados do banco. Não foi feita nenhuma chamada real à OpenAI (ainda não há chave).
- Carga: 15 requisições de teste de 0,4 a 5 MB (o tamanho de uma análise com 5 fotografias) passaram sem
  corte por limite de processamento.

## 10. Ponte de IA (`ia-sites`) e envoltório (16/11/2026)

**Por quê.** Sem senha e sem chave cadastradas, as funções de IA respondiam "Função protegida: o proprietário
ainda não definiu a senha de acesso dos sites". A ponte faz essas funções funcionarem com o Workers AI da
própria conta, sem custo, e continua usando a chave da OpenAI quando ela existir e o aparelho tiver entrada.

**Como.**

- `src/ia/envoltorio.mjs` é o módulo principal de cada Worker com servidor. Ele envolve, sem alterá-lo, o
  programa já montado (`worker.js`) e escolhe a chave de cada requisição (tabela da seção 3). As chamadas que o
  código original faz a `https://api.openai.com/v1/responses` com a chave interna (`IA_CHAVE_INTERNA`) são
  desviadas, por ligação interna, para o `ia-sites`. Anexos do próprio site são lidos ali mesmo e enviados
  embutidos (data URL), também para a OpenAI.
- `src/ia/ia-sites.mjs` emula a API de respostas da OpenAI (`POST /v1/responses`, `background`,
  `GET /v1/responses/{id}`, `/cancel`, chamadas de função, saída em JSON Schema, itens `web_search_call` com
  fontes e anotações `url_citation`). Pedidos em segundo plano rodam num Durable Object (`TrabalhoIA`).
  Identificadores das respostas da ponte começam com `resp_wai` e são sempre consultados na ponte.
- `src/ia/nucleo.mjs`: leitura de anexos (visão para imagens; `toMarkdown` para PDF e documentos), busca no
  PubMed (E-utilities), geração com conferência do esquema e ajuste ao formato. `src/ia/ajustes.mjs`: limites
  de tamanho e correções por tipo de laudo (laboratório, radiografia, dermatologia), tirados das conferências
  zod do código original de cada site.
- Modelos (Workers AI): texto `@cf/openai/gpt-oss-120b` (reserva `@cf/meta/llama-3.3-70b-instruct-fp8-fast`);
  visão `@cf/google/gemma-4-26b-a4b-it` (rápida `@cf/meta/llama-4-scout-17b-16e-instruct`; reserva
  `@cf/mistralai/mistral-small-3.1-24b-instruct`). Variáveis `IA_MODELO_*` no `ia-sites` trocam os padrões.

**Pausa da chave paga (16/11/2026).** Se a OpenAI recusar por conta (sem crédito, chave inválida ou
desativada: HTTP 401/403 ou códigos `credit_balance_exhausted`, `insufficient_quota` e semelhantes), a chave
fica 10 minutos sem uso e o proprietário é atendido direto pelo `ia-sites`. A pausa fica no Durable Object do
`ia-sites` (instância `estado-openai`, rota interna `/estado-openai`), por impressão da chave (8 bytes do
SHA-256, nunca a chave): uma chave nova volta a ser usada na hora. Antes de um pedido em segundo plano, a
chave é sondada com uma chamada mínima (`max_output_tokens: 16`, `store: false`), porque a OpenAI aceita o
pedido (`queued`) e só depois o falha; uma resposta em segundo plano que falhe por conta também pausa a chave.

**Variáveis dos sites:** `IA_ALTERNATIVA` (`ligada`|`desligada`), `IA_RESERVA` (`ligada`|`desligada`),
`ACESSO_LIVRE` (`sim`|`nao`), `DONO_ID`, `DONO_EMAIL`, `DONO_NOME`.

**Conferência de 16/11/2026.** Locais: 17 verificações da ponte (`t9-ia`), 18 do envoltório (`t10-envoltorio`)
e 10 da Prescrição Integral no `workerd` (`t8-prescricao-integral`). Na Cloudflare: texto, visão, função, busca
no PubMed e segundo plano respondendo; laudo do Laboratório e Raio X concluído de ponta a ponta pelo site;
Prescrição Integral com `/api/protocols` 200, `/api/whatsapp/status` 200 (banco pronto) e `/api/clinical` 200.
Com a chave real cadastrada (conta sem crédito, `credit_balance_exhausted`), num site de teste temporário com o
envoltório publicado: 1ª chamada pela chave paga → recusa → resposta do Workers AI e pausa de 10 minutos;
2ª chamada direto pela chave interna; pedido em segundo plano concluído pela ponte (`resp_wai…`).

## 11. Versão do zod

Os programas foram montados e testados com **zod 3.25.76**, a versão declarada pelos sites
originais. Existe aviso de segurança para versões anteriores à 4.6.6 (GHSA-mrhx-c7xc-m3w5: consumo de
memória ao validar listas muito grandes). Aqui o risco é baixo: em todas as rotas que usam zod a validação
só acontece depois da entrada por senha (ou da checagem de sessão do código original), e cada requisição
roda isolada com limite de memória. Passar para zod 4 exige adaptar o código original dos sites (a API
mudou) e refazer todos os testes; por isso o `package.json` continua em 3.25.76 — trocar só o número
aqui não mudaria o que está na Cloudflare.
