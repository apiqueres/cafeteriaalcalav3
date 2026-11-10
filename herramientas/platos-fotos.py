"""Fotos de plato para el diálogo de la carta, sacadas de los PDF de las cartas (carpeta cartas/).
Uso: python herramientas/platos-fotos.py <carpeta con los PNG extraídos> <salida = site/media/carta/platos>
Los PNG salen de las imágenes incrustadas en los PDF (pypdf: page.images), con su máscara ya aplicada. Aquí se
recortan al contenido, se dejan a 1100 px de lado mayor como mucho y se guardan en WebP con transparencia.
Las que vienen sobre fondo blanco (croquetas) pasan el blanco a transparente.
Ya no pisa una foto que exista en la salida (ahora son las fotos sobre la mesa con azulejos), salvo con --forzar."""
import sys, os
from PIL import Image, ImageChops
ORIGEN = {
  'chivito': 'gen-p05-0', 'sandwich-primavera': 'gen-p06-0', 'sandwich-alcala': 'gen-p06-1',
  'huevos-rotos': 'gen-p07-0', 'torreta-patatas': 'gen-p07-1', 'lasana-bolonesa': 'gen-p09-1',
  'croquetas': 'gen-p10-1', 'calamares-romana': 'gen-p11-0', 'pulpo-gallega': 'gen-p11-1', 'torrija': 'gen-p12-0', 'flan': 'gen-p12-1',
  'nuggets-veganos': 'gen-p14-2', 'falafel': 'gen-p15-1', 'salteado-vegano': 'gen-p16-1', 'bocadillo-pollo-vegano': 'gen-p16-2',
  'batido-amix': 'des-p01-2', 'tostada-rustica': 'des-p01-3', 'tostada-merrick': 'des-p02-1' }
def blanco_a_alfa(im):
    im = im.convert('RGB'); r, g, b = im.split()
    minimo = ImageChops.darker(ImageChops.darker(r, g), b)
    alfa = minimo.point(lambda v: max(0, min(255, int((255 - v) * 3.2))))
    px = im.load(); al = alfa.load(); out = Image.new('RGBA', im.size)
    po = out.load()
    for y in range(im.height):
        for x in range(im.width):
            a = al[x, y]
            if a == 0: po[x, y] = (0, 0, 0, 0); continue
            f = a / 255.0; R, G, B = px[x, y]
            po[x, y] = (max(0, min(255, int((R - (1 - f) * 255) / f))), max(0, min(255, int((G - (1 - f) * 255) / f))), max(0, min(255, int((B - (1 - f) * 255) / f))), a)
    return out
def main(src, dst):
    for nombre, base in ORIGEN.items():
        if os.path.exists(os.path.join(dst, nombre + '.webp')) and '--forzar' not in sys.argv: continue
        im = Image.open(os.path.join(src, base + '.png'))
        if im.mode != 'RGBA': im = blanco_a_alfa(im)
        a = im.split()[3]
        lleno = a.getextrema()[0] > 200          # sin transparencia: foto entera
        if lleno: im = im.convert('RGB')
        else:
            caja = a.point(lambda v: 255 if v > 10 else 0).getbbox()
            if caja:
                m = int(max(caja[2] - caja[0], caja[3] - caja[1]) * .03)
                caja = (max(0, caja[0] - m), max(0, caja[1] - m), min(im.width, caja[2] + m), min(im.height, caja[3] + m)); im = im.crop(caja)
        im.thumbnail((1400 if lleno else 1100,) * 2, Image.LANCZOS)
        out = os.path.join(dst, nombre + '.webp'); im.save(out, 'WEBP', quality=84, method=6)
        print('%-24s %4dx%-4d %s %4d KB' % (nombre, im.width, im.height, im.mode, os.path.getsize(out) // 1024))
if __name__ == '__main__': main(sys.argv[1], sys.argv[2])
