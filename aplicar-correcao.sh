#!/usr/bin/env bash
# Corrige o erro de hidratacao (React #418) do Revisao Pediatrica Continua.
#
# Uso (na raiz do repo site-portal):
#   bash aplicar-correcao.sh --dry-run   # confere, nao altera
#   bash aplicar-correcao.sh             # aplica
# Depois:
#   git add -A && git commit -m "corrige hidratacao React #418" && git push
set -euo pipefail

ARQ="sites/revisao-pediatrica-continua/_next/static/chunks/review-workspace-Y3S1qYmf.js"
DRY=0
[ "${1:-}" = "--dry-run" ] && DRY=1

if [ ! -f "$ARQ" ]; then
  echo "ERRO: arquivo nao encontrado: $ARQ" >&2
  echo "Rode este script na raiz do repositorio site-portal." >&2
  exit 1
fi

python3 - "$ARQ" "$DRY" <<'PY'
import sys, os
caminho, dry = sys.argv[1], sys.argv[2] == "1"
OLD = '(0,B.jsxs)(`span`,{className:`today`,children:['
NEW = '(0,B.jsxs)(`span`,{className:`today`,suppressHydrationWarning:!0,children:['
antes = open(caminho, encoding="utf-8").read()
n = antes.count(OLD)
print("ocorrencias do trecho: %d" % n)
print("tamanho atual: %d bytes" % len(antes.encode("utf-8")))
if "suppressHydrationWarning:!0,children:[" in antes:
    print("A correcao JA esta aplicada. Nada a fazer.")
    sys.exit(0)
if n != 1:
    print("ABORTADO: esperava 1 ocorrencia, achei %d." % n, file=sys.stderr)
    print("Nada foi alterado.", file=sys.stderr)
    sys.exit(2)
depois = antes.replace(OLD, NEW)
novo = len(depois.encode("utf-8"))
if novo != 95149:
    print("ABORTADO: resultado teria %d bytes, esperado 95149." % novo, file=sys.stderr)
    sys.exit(3)
if dry:
    print("DRY-RUN ok: resultado teria %d bytes. Nada foi alterado." % novo)
    sys.exit(0)
tmp = caminho + ".tmp"
open(tmp, "w", encoding="utf-8", newline="").write(depois)
os.replace(tmp, caminho)
print("OK: corrigido, %d bytes." % novo)
PY

echo
echo "Validando sintaxe..."
if node --input-type=module --check < "$ARQ"; then
  echo "Sintaxe OK."
else
  echo "ERRO de sintaxe. Reverta: git checkout -- $ARQ" >&2
  exit 4
fi

echo
echo "Pronto. Agora:"
echo "  git add -A"
echo "  git commit -m 'corrige hidratacao React #418'"
echo "  git push"
