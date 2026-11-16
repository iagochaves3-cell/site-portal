# Gera os dois arquivos usados pelos testes de navegador (não ficam no repositório):
#   teste/arquivos/foto.jpg   fotografia sintética (~200 KB)
#   teste/arquivos/exame.pdf  PDF de ~1,9 MB (acima de 1,25 MB, para forçar o envio em partes)
# Uso: python3 teste/gerar-arquivos.py   (requer Pillow)
import os, random
from PIL import Image

os.makedirs('teste/arquivos', exist_ok=True)
random.seed(7)
w, h = 900, 700
img = Image.new('RGB', (w, h))
px = img.load()
for y in range(h):
    for x in range(w):
        dentro = (x - 450) ** 2 + (y - 350) ** 2 < 120 ** 2
        px[x, y] = (200 + random.randint(-20, 20), 150 + 60 * dentro + random.randint(-15, 15), 140 + random.randint(-15, 15))
img.save('teste/arquivos/foto.jpg', quality=90)
random.seed(11)
Image.frombytes('RGB', (1500, 1100), random.randbytes(1500 * 1100 * 3)).save('teste/arquivos/exame.pdf', quality=95)
for nome in ('foto.jpg', 'exame.pdf'):
    print(nome, os.path.getsize('teste/arquivos/' + nome))
