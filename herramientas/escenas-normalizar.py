# Recorta cada escena para que el logo quede exactamente en el mismo sitio y tamaño en todas.
# Medidas a ojo sobre cuadrícula del 5 %: caja exterior del marco del logo (x0, x1 en % del ancho; y0, y1 en % del alto).
import sys, os
from PIL import Image
S, OUT = sys.argv[1], sys.argv[2]
H = {  # apaisadas 2688x1520 -> destino: logo 39 % del ancho, centro (49.5 %, 48 %)
 '1': ('gpt-1-burdeos',   30, 69, 15, 81),
 '2': ('gpt-2-latte',     35, 63, 23, 68),
 '3': ('gpt-3b-azules',   30, 69, 16, 80),
 '4': ('gpt-4c-cerveza',  None, None, None, None),
 '5': ('gpt-5b-parrilla', 36, 65, 22, 64),
 '6': ('gpt-6-tostada',   35, 65, 25, 66),
 '7': ('gpt-7-acai',      35, 66, 25, 74),
}
V = {  # verticales 1520x2688 -> destino: logo 76 % del ancho, centro (50 %, 49.5 %)
 '1': ('gpt-11-burdeos-v',  12, 88, 29, 70),
 '2': ('gpt-12-latte-v',    22, 80, 32, 63),
 '3': ('gpt-13b-azules-v',  12, 88, 30, 71),
 '4': ('gpt-14c-cerveza-v', None, None, None, None),
 '5': ('gpt-15b-parrilla-v',17, 83, 30, 63),
 '6': ('gpt-16-tostada-v',  17, 83, 30, 66),
 '7': ('gpt-17-acai-v',     20, 80, 33, 66),
}
extra = {}
if len(sys.argv) > 3:  # medidas de la cerveza: "x0,x1,y0,y1;x0,x1,y0,y1" (apaisada;vertical)
    for k, txt in zip(('h','v'), sys.argv[3].split(';')): extra[k] = [float(t) for t in txt.split(',')]
    H['4'] = ('gpt-4c-cerveza',) + tuple(extra['h']); V['4'] = ('gpt-14c-cerveza-v',) + tuple(extra['v'])
def procesar(tabla, orient, rw_t, tcx, tcy, anchos):
    tot = 0
    for n, (f, x0, x1, y0, y1) in tabla.items():
        if x0 is None: print('falta', f); continue
        im = Image.open(os.path.join(S, 'escenas', f + '.png')).convert('RGB'); W, Hh = im.size
        rw = (x1 - x0) / 100.0; zoom = rw_t / rw
        if zoom < 1: print('AVISO: %s tendría que alejarse (logo %.0f%% > %.0f%%); se deja a 1' % (f, rw*100, rw_t*100)); zoom = 1
        ww, hh = W / zoom, Hh / zoom
        cx, cy = (x0 + x1) / 200.0 * W, (y0 + y1) / 200.0 * Hh
        left, top = cx - tcx * ww, cy - tcy * hh
        left = min(max(0, left), W - ww); top = min(max(0, top), Hh - hh)
        rec = im.crop((int(round(left)), int(round(top)), int(round(left + ww)), int(round(top + hh))))
        for w in anchos:
            out = os.path.join(OUT, 'escena-%s-%s-%d.webp' % (n, orient, w))
            r = rec.copy(); r.thumbnail((w, 100000)); r.save(out, 'WEBP', quality=78, method=6); tot += os.path.getsize(out)
        print('%-20s zoom %.2f  ventana %4d x %4d  ->  logo centro (%.1f%%, %.1f%%) ancho %.0f%%' % (f, zoom, ww, hh, tcx*100, tcy*100, rw_t*100))
    return tot
os.makedirs(OUT, exist_ok=True)
t = procesar(H, 'h', 0.39, 0.495, 0.48, [2048, 1280]) + procesar(V, 'v', 0.76, 0.50, 0.495, [1280, 800])
print('total KB', t // 1024)
