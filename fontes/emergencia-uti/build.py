#!/usr/bin/env python3
"""Monta dist/index.html: um único arquivo, sem dependências externas."""
import base64, pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent
SRC = RAIZ / "src"
FONTES = RAIZ / "fonts"
if not (FONTES / "barlow-semi-condensed-latin-500-normal.woff2").exists():
    FONTES = RAIZ / "fonts/node_modules/@fontsource/barlow-semi-condensed/files"


def ler(nome):
    return (SRC / nome).read_text(encoding="utf-8")


def fonte(peso):
    dados = (FONTES / f"barlow-semi-condensed-latin-{peso}-normal.woff2").read_bytes()
    b64 = base64.b64encode(dados).decode("ascii")
    return ("@font-face{font-family:\"Barlow Semi Condensed\";font-style:normal;font-weight:%d;font-display:swap;"
            "src:url(data:font/woff2;base64,%s) format(\"woff2\");}" % (peso, b64))


css = ("/* Barlow Semi Condensed: (c) The Barlow Project Authors, SIL Open Font License 1.1 */\n"
       + fonte(500) + "\n" + fonte(600) + "\n" + ler("styles.css"))
js = "\n".join(ler(n) for n in ["core.js", "data-farmacos.js", "data-clinica.js", "ui.js"])
corpo = ler("body1.html") + ler("body2.html")
assert "</script" not in js.lower(), "o JS não pode conter </script"

icone = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
         "%3Crect width='32' height='32' rx='5' fill='%2313212E'/%3E"
         "%3Crect x='4' y='6' width='4' height='20' fill='%23F2A2BC'/%3E%3Crect x='8' y='6' width='4' height='20' fill='%23D5303B'/%3E"
         "%3Crect x='12' y='6' width='4' height='20' fill='%23F0C02C'/%3E%3Crect x='16' y='6' width='4' height='20' fill='%23FFFFFF'/%3E"
         "%3Crect x='20' y='6' width='4' height='20' fill='%232E7DCE'/%3E%3Crect x='24' y='6' width='4' height='20' fill='%233C9A4D'/%3E%3C/svg%3E")

html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Emergência &amp; UTI — Referência Clínica Integrada</title>
<meta name="description" content="Referência clínica de emergência e terapia intensiva, adulto e pediátrica: doses, diluições, vazões e condutas calculadas pelo peso e pela idade. Uso profissional.">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="{icone}">
<script>(function(){{try{{var t=localStorage.getItem("eu.tema");if(t!=="dark"&&t!=="light")t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}}catch(e){{}}}})();</script>
<style>
{css}
</style>
</head>
<body>
<noscript><p style="padding:16px;font:16px system-ui">Esta ferramenta precisa de JavaScript para calcular as doses. Ative o JavaScript no navegador.</p></noscript>
{corpo}
<script>
(function () {{
"use strict";
{js}
}})();
</script>
</body>
</html>
"""

saida = RAIZ / "dist/index.html"
saida.parent.mkdir(exist_ok=True)
saida.write_text(html, encoding="utf-8")
ids = re.findall(r'id="([^"]+)"', corpo)
dup = sorted({i for i in ids if ids.count(i) > 1})
print(f"dist/index.html: {len(html.encode('utf-8'))/1024:.0f} KB; {len(ids)} ids; duplicados: {dup or 'nenhum'}")
sys.exit(1 if dup else 0)
