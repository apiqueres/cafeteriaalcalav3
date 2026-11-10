/* Alcalá — carta-pdf.js: la carta lista para imprimir o guardar en PDF, desde el panel de administración.
   Dos variantes según ?v=: «impresa» (idéntica a la carta impresa del local: rojo, Oswald, tres columnas, una
   categoría por página) y «web» (la misma carta con el estilo de la web: burdeos, hueso, oro, Fraunces y Manrope).
   Los datos son los del panel (localStorage «alcala.datos»); si no hay nada guardado, los de carta-datos.js.
   Sólo salen las categorías y platos visibles, en su orden. Las fotos de categoría van en JPEG reducido
   (media/carta/pdf) porque el navegador mete las imágenes sin comprimir en el PDF y con los WebP pesaba 15 MB. El PDF lo hace el navegador (Ctrl+P → «Guardar como
   PDF»): sale vectorial, con texto seleccionable y las mismas fuentes que la web. Con ?sinimprimir no se abre el
   diálogo de impresión al cargar (para revisar la vista previa). */
(function(){
  var q = new URLSearchParams(location.search), V = q.get('v') === 'web' ? 'web' : 'impresa';
  var ALG = window.ALERGENOS || [], ETQ = window.ETIQUETAS || {}, CARTAS = window.CARTAS || [{ id: 'general', n: 'La carta', corto: 'Carta general' }];
  var K = CARTAS.filter(function(k){ return k.id === q.get('c'); })[0] || CARTAS[0];   /* ?c=<carta>: cuál de las cartas sale en el PDF (por defecto, la general) */
  var algNombre = {}; ALG.forEach(function(a){ algNombre[a.id] = a.n; });
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

  /* ---------- datos ---------- */
  function datos(){
    var cats = null, local = null;
    try{
      var D = JSON.parse(localStorage.getItem('alcala.datos.2') || 'null');
      if(D && D.categorias && D.platos){
        local = D.local || null;
        cats = D.categorias.filter(function(c){ return c.visible; }).sort(function(a, b){ return a.orden - b.orden; }).map(function(c){
          return { id: c.id, carta: c.carta || 'general', n: c.n, d: c.d || '', foto: c.foto || '',
            platos: D.platos.filter(function(p){ return p.cat === c.id && p.visible; }).sort(function(a, b){ return a.orden - b.orden; }) };
        }).filter(function(c){ return c.platos.length; });
      }
    }catch(e){}
    if(!cats) cats = (window.CARTA || []).map(function(c){ return { id: c.id, carta: c.carta || 'general', n: c.n, d: c.d || '', foto: c.foto || '', platos: c.platos || [] }; });
    cats = cats.filter(function(c){ return c.carta === K.id; });
    local = local || {};
    return { cats: cats, local: {
      tel: local.tel || '961 72 50 98', ig: local.ig || 'cafeteriaalcala', fb: local.fb || 'cafeteria.alcala', tiktok: local.tiktok || 'cafeteriaalcala',
      dir: local.dir || 'Carrer del Pintor Ferrer Cabrera, 3', cp: local.cp || '46400 Cullera (València)', frase: local.frase || 'Tu punto de encuentro desde 1987.' } };
  }

  /* ---------- piezas ---------- */
  function precio(p){ return esc(p).replace(/\s*€\s*$/, '') + (V === 'web' ? ' €' : '€'); }
  function icono(id){ var n = algNombre[id] || id; return '<i class="alg alg--' + esc(id) + '" title="' + esc(n) + '"><svg aria-hidden="true"><use href="#alg-' + esc(id) + '"/></svg><span class="oculto">' + esc(n) + '</span></i>'; }
  function tags(p){ return (p.t || []).map(function(t){ return '<span class="tag tag--' + esc(t) + '">' + esc(ETQ[t] || t) + '</span>'; }).join(''); }
  function plato(p){
    return '<article class="plato">'
      + '<header class="plato__cab"><h3 class="plato__nom">' + esc(p.n) + (tags(p) ? ' ' + tags(p) : '') + '</h3><span class="plato__raya"></span><span class="plato__precio">' + precio(p.p) + '</span></header>'
      + ((p.e || p.p2) ? '<p class="plato__p2">' + [p.e ? esc(p.e) : '', p.p2 ? esc(p.e2 || '') + ' ' + precio(p.p2) : ''].filter(Boolean).join(' · ') + '</p>' : '')
      + (p.d ? '<p class="plato__desc">' + esc(p.d) + '</p>' : '')
      + ((p.a || []).length ? '<div class="plato__alg">' + p.a.map(icono).join('') + '</div>' : '')
      + '</article>';
  }
  function pie(num){
    return V === 'web'
      ? '<footer class="pag__num"><span>Alcalá · Cafetería · Baristas · Cullera</span><span>' + num + '</span></footer>'
      : '<footer class="pag__num">- ' + num + ' -</footer>';
  }
  function portada(L){
    if(V === 'web') return '<section class="pag pag--portada">'
      + '<div><img class="portada__logo" src="../media/logo-oro.webp" alt="Alcalá · Cafetería · Baristas" width="600" height="600"><p class="portada__ceja">Cafetería · Baristas · Cullera</p><h1 class="portada__titulo">' + esc(K.n) + '.</h1><p class="portada__frase">' + esc(L.frase) + '</p></div>'
      + '<div class="portada__pie"><span>' + esc(L.dir) + ' · ' + esc(L.cp) + '</span><span>' + esc(L.tel) + '</span><span>@' + esc(L.ig) + '</span><span>alcalacullera.com</span></div></section>';
    return '<section class="pag pag--portada">'
      + '<img class="portada__logo" src="../media/logo-blanco.webp" alt="Alcalá · Cafetería · Baristas" width="600" height="600">'
      + '<h1 class="portada__titulo">' + esc(K.n) + '</h1>'
      + '<div class="portada__pie"><span>f @' + esc(L.fb) + '</span><span>www.cafeteriaalcala.es</span><span>◎ @' + esc(L.ig) + '</span><span>✆ ' + esc(L.tel) + '</span></div></section>';
  }
  function categoria(c, num){
    return '<section class="pag pag--cat" id="' + esc(c.id) + '">'
      + '<header class="cat__cab"><div><h2>' + esc(c.n) + '</h2>' + (V === 'web' && c.d ? '<p>' + esc(c.d) + '</p>' : '') + '</div>'
      + (c.foto ? '<img class="cat__foto" src="../media/carta/pdf/' + esc(c.foto) + '.jpg" alt="" width="800" height="603">' : '') + '</header>'
      + '<div class="platos">' + c.platos.map(plato).join('') + '</div>' + pie(num) + '</section>';
  }
  function leyenda(num){
    return '<section class="pag pag--leyenda"><header class="cat__cab"><div><h2>Alérgenos</h2></div></header>'
      + '<ul class="leyenda">' + ALG.map(function(a){ return '<li>' + icono(a.id) + '<span>' + esc(a.n) + '</span></li>'; }).join('') + '</ul>'
      + '<p class="leyenda__nota">La información de los alérgenos se ha realizado en base a los datos proporcionados por los proveedores, no siendo responsable Cafetería Alcalá (Embrumar SLU) de la exactitud de dicha información.</p>'
      + '<p class="leyenda__nota">Por los procesos de elaboración de nuestros productos, no podemos excluir la presencia de trazas de otros alérgenos distintos a los señalados en cada plato. Si eres celíaco, díselo al camarero.</p>'
      + pie(num) + '</section>';
  }

  /* ---------- montar ---------- */
  var d = datos(), html = portada(d.local);
  d.cats.forEach(function(c, i){ html += categoria(c, i + 1); });
  if(!K.sinAlg) html += leyenda(d.cats.length + 1);   /* la leyenda de alérgenos sólo en las cartas que los detallan */
  document.getElementById('doc').innerHTML = html;
  document.body.classList.add('v-' + V);
  var hoy = new Date(), fecha = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
  document.title = 'Carta Alcalá ' + (K.corto || K.n).toLowerCase() + ' ' + (V === 'web' ? 'estilo web' : 'impresa') + ' ' + fecha;   /* nombre que propone el navegador para el PDF */
  /* paginar: cada .pag mide exactamente un A4; si una categoría no cabe, los últimos platos pasan a una página
     de continuación (misma categoría, cabecera baja) hasta que todo cabe. Así no dependemos de cómo parta el
     navegador una rejilla, y los números de página quedan bien. */
  function paginar(){
    var pags = [].slice.call(document.querySelectorAll('.pag--cat'));
    pags.forEach(function(pag){
      var actual = pag, guard = 0;
      while(actual.scrollHeight > actual.clientHeight + 1 && guard++ < 400){
        var lista = actual.querySelector('.platos'), ultimo = lista && lista.lastElementChild;
        if(!ultimo) break;
        var sig = actual.nextElementSibling;
        if(!sig || !sig.classList.contains('pag--sigue') || sig.dataset.de !== pag.id){
          sig = document.createElement('section'); sig.className = 'pag pag--cat pag--sigue'; sig.dataset.de = pag.id;
          sig.innerHTML = '<header class="cat__cab"><div><h2>' + actual.querySelector('h2').innerHTML + '</h2></div></header><div class="platos"></div>' + pie(0);
          actual.parentNode.insertBefore(sig, actual.nextElementSibling);
        }
        sig.querySelector('.platos').insertBefore(ultimo, sig.querySelector('.platos').firstChild);
        if(actual.scrollHeight <= actual.clientHeight + 1) actual = sig;   /* esta ya cabe: a comprobar la siguiente */
      }
    });
    var n = 0;
    [].slice.call(document.querySelectorAll('.pag')).forEach(function(pag){
      var num = pag.querySelector('.pag__num'); if(!num) return; n++;
      num.innerHTML = V === 'web' ? '<span>Alcalá · Cafetería · Baristas · Cullera</span><span>' + n + '</span>' : '- ' + n + ' -';
    });
  }
  var fuentesListas = document.fonts ? document.fonts.ready : Promise.resolve();
  fuentesListas.then(paginar);
  var cuenta = document.getElementById('cuenta'); if(cuenta) cuenta.textContent = d.cats.length + ' categorías · ' + d.cats.reduce(function(n, c){ return n + c.platos.length; }, 0) + ' platos';
  var otra = document.getElementById('otra'); if(otra){ otra.href = '?v=' + (V === 'web' ? 'impresa' : 'web') + '&c=' + K.id + (q.has('sinimprimir') ? '&sinimprimir' : ''); otra.textContent = V === 'web' ? 'Ver la variante impresa' : 'Ver la variante estilo web'; }

  /* imprimir: botón, y automático al cargar cuando fuentes e imágenes están listas (salvo ?sinimprimir) */
  var btn = document.getElementById('imprimir'); if(btn) btn.addEventListener('click', function(){ print(); });
  var listo = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve()].concat([].slice.call(document.images).map(function(im){ return im.decode ? im.decode().catch(function(){}) : Promise.resolve(); })));
  if(!q.has('sinimprimir')) listo.then(function(){ paginar(); setTimeout(function(){ print(); }, 250); });
})();
