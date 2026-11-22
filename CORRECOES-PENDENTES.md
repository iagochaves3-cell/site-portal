# Correções pendentes — auditoria de 22/11/2026

Relatório completo: `artifacts/relatorio-auditoria-acervo-2026-11-22.md` (no workspace do agente).

## 1. Erro de hidratação — `revisao-pediatrica-continua` (React #418)

**Sintoma:** `Uncaught Error: Minified React error #418` no console, reproduzível em toda carga.

**Causa raiz:** o componente do cabeçalho renderiza a data atual durante o render:

```
sites/revisao-pediatrica-continua/_next/static/chunks/review-workspace-Y3S1qYmf.js
```

Trecho (buscar por `className:`today``):

```js
(0,B.jsxs)(`span`,{className:`today`,children:[
  (0,B.jsx)(pe,{size:14}),
  new Date().toLocaleDateString(`pt-BR`,{day:`numeric`,month:`long`,timeZone:`America/Sao_Paulo`})
]})
```

O HTML é pré-renderizado no build, quando `new Date()` valia a data da compilação (15/11/2026).
No navegador, `new Date()` vale a data de hoje (22/11/2026) → o texto diverge do HTML do servidor →
o React aborta a hidratação da árvore.

**Correção mínima (1 linha):** acrescentar `suppressHydrationWarning:!0` ao `<span>`:

```js
(0,B.jsxs)(`span`,{className:`today`,suppressHydrationWarning:!0,children:[
```

**Correção correta (recomendada, exige o fonte):** não calcular a data no render. Renderizar vazio
no servidor e preencher no efeito:

```js
const [hoje, setHoje] = useState('');
useEffect(() => {
  setHoje(new Date().toLocaleDateString('pt-BR',
    { day:'numeric', month:'long', timeZone:'America/Sao_Paulo' }));
}, []);
// no JSX: <span className="today">{hoje}</span>
```

A segunda forma elimina o erro na origem e mantém o texto sempre atualizado. A primeira apenas
silencia o aviso — o texto continuará sendo o do build até a próxima compilação.

---

## 2. Links externos que devolvem 403

| Site | URL | Status |
|---|---|---|
| `medicacoes-pediatricas` | `https://www.drugs.com/monograph/aminocaproic-acid.html` | 403 (o site bloqueia acesso automatizado) |
| `briefings-diarios` | `https://www.cdc.gov/botulism/hcp/clinical-overview/infant-botulism.html` | 403 com User-Agent de navegador; 200 sem |

Não são links mortos: os dois destinos existem. O `drugs.com` exige sessão de navegador real; o CDC
bloqueia por User-Agent. Ação: manter e, se quiser, trocar o do CDC por uma cópia em `www.cdc.gov`
sem o prefixo de idioma, ou aceitar como referência que o leitor abre manualmente.

---

## 3. Lacunas de conteúdo (a decisão é clínica, não técnica)

Estas exigem revisão médica antes de entrar em qualquer site. Listadas em ordem de risco:

1. **AAP — ITU em crianças de 8 dias a 5 anos (publicado 28/09/2026, 1ª atualização desde 2011).**
   Muda duração de antibiótico e indicação de ultrassonografia.
   Presente em: Receita PED, Prescrição Pediátrica Segura, Orientações aos Pais.
   **Ausente em: Guideliness, Terapêuticas, Emergências e Terapêutica, Medicações Pediátricas.**
2. **Guideliness** não tem nenhum protocolo populado. O endpoint `/mcp` devolve apenas o framework
   editorial (`prompt-mestre`); nenhuma diretriz específica foi carregada.
3. **Dermatologia** — última marca de revisão em 11/09/2026 (72 dias).
4. **Drogas CardioPapers** — 05/10/2026 (48 dias).
5. **Emergências e Terapêutica** — 03/10/2026 (50 dias).
