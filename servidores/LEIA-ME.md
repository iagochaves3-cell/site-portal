# Servidores dos sites (Cloudflare) — como funciona

Atualizado em 16/11/2026.

Esta pasta **não é um site**. Ela documenta e guarda o código do adaptador que devolveu
o lado de servidor a seis sites que, na cópia de 15/11/2026, só tinham as páginas.

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

- As **páginas** continuam vindo do repositório (`sites/<site>/`), com as mesmas regras de antes:
  `src/estatico.mjs` reproduz o programa estático que estes seis sites já usavam (o de 2.819 bytes, com
  os tipos xlsx/docx/gz). O teste `teste/t8-estatico.mjs` compara, arquivo por arquivo, as respostas do
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

## 4. O que só o proprietário faz (painel da Cloudflare)

Workers & Pages → **acesso-sites** → Settings → Variables and Secrets:

1. Editar **SENHA_DE_ACESSO**: a senha de entrada (8 caracteres ou mais).
2. Editar **OPENAI_API_KEY**: a chave da API da OpenAI (começa com `sk-`).

Os dois foram criados com o valor provisório `PENDENTE`, que o programa trata como "não configurado".
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

Os bancos foram criados com as migrações originais de cada site (`drizzle/*.sql`).

Vínculos de cada Worker de site: `REPO`, `REF` (como antes), `ACESSO_URL`, `ACESSO_IA`,
`ACESSO` (serviço `acesso-sites`, ponto de entrada `Interno`) e, conforme o site, `DB` (D1) ou `ENVIOS` (KV).
Segredos: `acesso-sites` tem `OPENAI_API_KEY`, `SENHA_DE_ACESSO` e `SEGREDO_SESSAO` (aleatório, gerado na
instalação); `abordagem-clinica` tem `AI_RATE_LIMIT_SALT` (aleatório).
Data de compatibilidade `2026-05-15`, com `nodejs_compat` (a mesma dos sites originais).

Modelos: são os padrões do código original — `gpt-5.4-2026-03-05` (Dermatologia), `gpt-6.1-sol`
(Abordagens Clínicas), `gpt-5.5` (Guideliness) e `gpt-5.6` (Laboratório e Raio X). Para trocar sem mexer no
código: variável de texto `OPENAI_MODEL` (ou `OPENAI_REPORT_MODEL` no Laboratório) no Worker do site.

## 6. Limites conhecidos

- **Dados antigos não vieram.** Os bancos são novos. A fila da Revisão começa do estado inicial, o Atlas
  começa sem revisões salvas e o histórico de pesquisas do Abordagens Clínicas começa vazio (a exportação
  disponível das 49 pesquisas antigas está com os textos cortados e não foi importada).
- **Um único usuário.** A entrada por senha identifica sempre o proprietário.
- **Custos.** O uso de IA é cobrado na conta da OpenAI do proprietário, por uso.
- **Plano gratuito da Cloudflare.** Limites diários: 100.000 requisições, 1.000 gravações no KV
  (cada parte de 768 KB de um anexo é uma gravação) e 100.000 linhas gravadas no D1.
- **Sem chave ou sem senha**, as funções respondem com a mensagem de configuração pendente; as páginas
  funcionam normalmente.

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
   `revisao-pediatrica-continua`, `atlas-preservacao`.
2. `npm install` e `PACOTES=<pasta> node build.mjs` → gera `dist/<worker>.js`.
3. `CLONE=<clone deste repositório> PACOTES=<pasta> npm test` (60 verificações de servidor e a comparação de 508 respostas estáticas com o programa anterior) e, com Chrome e Playwright,
   `python3 teste/gerar-arquivos.py && npm run test:navegador` (13 verificações com as telas reais dos sites e
   a OpenAI simulada).
4. Enviar pela API da Cloudflare (`PUT /accounts/{conta}/workers/scripts/{worker}`), **sempre** com
   `keep_bindings: ["secret_text"]` e **sem** listar segredos no envio, para não apagar nem sobrescrever a
   senha e a chave do proprietário.

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
  com GET, HEAD e POST) entre o programa anterior e os pacotes novos — todas idênticas.
- Na Cloudflare: páginas dos seis sites carregando; rotas sem entrada respondendo 401/503 com as mensagens
  esperadas; com uma sessão de teste (criada e desfeita na hora), cada rota chegou ao ponto "falta a chave"
  ou devolveu os dados do banco. Não foi feita nenhuma chamada real à OpenAI (ainda não há chave).
- Carga: 15 requisições de teste de 0,4 a 5 MB (o tamanho de uma análise com 5 fotografias) passaram sem
  corte por limite de processamento.

## 10. Programas implantados em 16/11/2026

Para conferir se o que está na Cloudflare é o que foi testado (`GET …/workers/scripts/<worker>/content/v2`,
SHA-256 do arquivo `worker.js`):

| Worker | Bytes | SHA-256 (início) |
|---|---|---|
| `acesso-sites` | 13.970 | `7383edbeab7b0ff7…` |
| `dermatologia` | 223.947 | `da8a6584111a02d0…` |
| `abordagem-clinica` | 86.049 | `4f5ca87960106868…` |
| `guideliness` | 445.246 | `3d4aa11b1d7d78ee…` |
| `laboratorioeradiografia` | 579.283 | `e33c0aefd9d9ed99…` |
| `revisao-pediatrica-continua` | 170.737 | `e203ecf1740b7d53…` |
| `atlas-preservacao` | 135.279 | `a4cdb20b7fe0277f…` |
