/* Alcalá — carta.js: la página de las cartas.
   Sin ?c= enseña el selector: las seis cartas (window.CARTAS) para elegir. Con ?c=<carta> pinta esa carta desde
   window.CARTA (sus categorías llevan carta:'…'): cabecera, pestañas pegajosas, buscador, platos y alérgenos.
   Los enlaces antiguos a una categoría (carta/#bocadillos) siguen valiendo: se abre la carta a la que pertenece.
   Los platos con foto llevan un botón de cámara que abre el diálogo de foto (cinco tiras que componen la imagen,
   como el menú y el telón), con el nombre y los alérgenos encima. */
(function(){
  var CARTAS = window.CARTAS || [], CARTA = window.CARTA || [], ALG = window.ALERGENOS || [], ETQ = window.ETIQUETAS || {};
  /* si el panel (/administracion) ha guardado datos en este navegador, la carta los usa */
  try{
    var D = JSON.parse(localStorage.getItem('alcala.datos.2') || 'null');
    if(D && D.categorias){
      CARTA = D.categorias.filter(function(c){ return c.visible; }).sort(function(a, b){ return a.orden - b.orden; }).map(function(c){
        return { id: c.id, carta: c.carta || 'general', n: c.n, d: c.d, foto: c.foto, platos: D.platos.filter(function(p){ return p.cat === c.id && p.visible; }).sort(function(a, b){ return a.orden - b.orden; }) };
      }).filter(function(c){ return c.platos.length; });
    }
  }catch(e){}
  var cont = document.getElementById('cartaCont'), tabs = document.getElementById('tabs'), buscar = document.getElementById('buscar');
  if(!cont) return;
  var algNombre = {}; ALG.forEach(function(a){ algNombre[a.id] = a.n; });
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function el(id){ return document.getElementById(id); }
  function deCarta(id){ return CARTA.filter(function(c){ return (c.carta || 'general') === id; }); }
  function cartaPor(id){ return CARTAS.filter(function(k){ return k.id === id; })[0]; }
  var nav = el('nav'); if(nav) nav.classList.add('nav--fondo');

  /* ---------- qué carta toca ---------- */
  var actual = cartaPor(new URLSearchParams(location.search).get('c'));
  if(!actual && location.hash){ var catHash = CARTA.filter(function(c){ return c.id === location.hash.slice(1); })[0]; if(catHash) actual = cartaPor(catHash.carta || 'general'); }

  /* ---------- selector: las seis cartas ---------- */
  if(!actual){
    document.body.classList.add('carta-pag--elige');
    var NUM = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho'];
    var cuantas = NUM[CARTAS.length] || String(CARTAS.length);
    el('cabTexto').textContent = cuantas.charAt(0).toUpperCase() + cuantas.slice(1) + ' cartas. Elige la que te apetece ver.';
    el('eligeLista').innerHTML = CARTAS.map(function(k, i){
      var cs = deCarta(k.id), n = cs.reduce(function(s, c){ return s + c.platos.length; }, 0);
      var que = k.id === 'vinos' ? ' vinos' : k.id === 'cervezas' ? ' cervezas' : k.id === 'cocteles' ? ' cócteles' : ' platos';
      return '<li class="rv" style="--d:' + (i * .08).toFixed(2) + 's"><a class="elige__carta" href="?c=' + esc(k.id) + '">'
        + '<img src="../media/carta/' + esc(k.foto) + '.webp" alt="" width="800" height="603"' + (i > 2 ? ' loading="lazy"' : '') + '>'
        + '<span class="elige__num">' + ('0' + (i + 1)).slice(-2) + '</span>'
        + '<span class="elige__txt"><b>' + esc(k.corto || k.n) + '</b><small>' + esc(k.d) + '</small><em>' + n + que + (cs.length > 1 ? '<i> · ' + cs.length + ' secciones</i>' : '') + '</em></span></a></li>';
    }).join('');
    el('elige').hidden = false;
    return;
  }

  /* ---------- una carta ---------- */
  var cats = deCarta(actual.id), PLATOS = [];
  document.body.classList.add('carta-pag--' + actual.id);
  document.title = (actual.id === 'general' ? 'Carta' : 'Carta de ' + actual.n.toLowerCase()) + ' · Alcalá Cafetería Baristas, Cullera';
  el('cabTitulo').textContent = actual.n + '.';
  el('cabTexto').textContent = actual.d + ' Precios con IVA incluido.';
  el('cabSellos').hidden = actual.id !== 'general';
  el('cabOtras').innerHTML = '<span>Otras cartas</span>' + CARTAS.filter(function(k){ return k.id !== actual.id; }).map(function(k){ return '<a href="?c=' + esc(k.id) + '">' + esc(k.corto || k.n) + '</a>'; }).join('') + '<a class="carta__otras-todas" href="./">Ver todas</a>';
  el('cabOtras').hidden = false;

  function icono(id){ return '<i title="' + esc(algNombre[id] || id) + '" aria-label="' + esc(algNombre[id] || id) + '"><svg><use href="#alg-' + id + '"/></svg></i>'; }
  function precio(p){
    var chico = [p.e || '', p.p2 ? (p.e2 || '') + ' ' + p.p2 + ' €' : ''].filter(function(x){ return x.trim(); }).join(' · ');
    return '<div class="plato__precio">' + esc(p.p) + ' €' + (chico ? '<small>' + esc(chico) + '</small>' : '') + '</div>';
  }
  var CAMARA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h3l1.6-2.3h6.8L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.4" r="3.4"/></svg>';
  function plato(p, c){
    var i = PLATOS.push({ p: p, c: c }) - 1;
    var tags = (p.t || []).map(function(t){ return '<span class="tag tag--' + t + '">' + esc(ETQ[t] || t) + '</span>'; }).join('');
    var algs = (p.a || []).length ? '<span class="alg">' + p.a.map(icono).join('') + '</span>' : '';
    var foto = p.foto ? '<button class="plato__foto" type="button" data-foto="' + i + '" aria-label="Ver la foto de ' + esc(p.n) + '" title="Ver la foto">' + CAMARA + '</button>' : '';
    return '<article class="plato' + (p.foto ? ' plato--foto' : '') + '" data-busca="' + esc((p.n + ' ' + (p.d || '')).toLowerCase()) + '">'
      + '<h3 class="plato__nom">' + esc(p.n) + '</h3>' + precio(p)
      + (p.d ? '<p class="plato__desc">' + esc(p.d) + '</p>' : '')
      + ((foto || tags || algs) ? '<div class="plato__pie">' + foto + tags + algs + '</div>' : '')
      + '</article>';
  }
  var html = '', tabsHtml = '';
  cats.forEach(function(c){
    tabsHtml += '<a href="#' + c.id + '" data-tab="' + c.id + '">' + esc(c.n) + '</a>';
    html += '<section class="cat-sec" id="' + c.id + '" data-cat>'
      + '<div class="caja"><div class="cat-sec__cab"><div><h2 class="titular t-l">' + esc(c.n) + '</h2>' + (c.d ? '<p>' + esc(c.d) + '</p>' : '') + '</div>'
      + (c.foto ? '<div class="cat-sec__foto"><img src="../media/carta/' + esc(c.foto) + '.webp" alt="" width="800" height="603" loading="lazy"></div>' : '') + '</div>'
      + '<div class="platos">' + c.platos.map(function(p){ return plato(p, c); }).join('') + '</div></div></section>';
  });
  cont.innerHTML = html;
  if(tabs){ tabs.insertAdjacentHTML('afterbegin', tabsHtml); if(cats.length < 2) tabs.classList.add('tabs__in--una'); }
  el('vista').hidden = false;

  /* leyenda de alérgenos: sólo en las cartas que los traen; en las demás, el aviso de consultarlos */
  var ley = el('leyenda');
  if(ley){
    if(actual.sinAlg) ley.innerHTML = '<div class="caja"><h2 class="titular t-m">Alérgenos</h2><p class="leyenda__aviso">Esta carta no detalla los alérgenos plato a plato. Si tienes alguna alergia o intolerancia, pregunta al personal antes de pedir: te informamos de cada producto. Si eres celíaco, díselo al camarero.</p></div>';
    else el('leyendaLista').innerHTML = ALG.map(function(a){ return '<li><span class="alg"><i><svg><use href="#alg-' + a.id + '"/></svg></i></span>' + esc(a.n) + '</li>'; }).join('');
  }

  /* pestaña activa según scroll */
  var secs = [].slice.call(document.querySelectorAll('[data-cat]')), enlaces = tabs ? [].slice.call(tabs.querySelectorAll('[data-tab]')) : [];
  function arriba(e){ var y = 0; while(e){ y += e.offsetTop; e = e.offsetParent; } return y; }
  function activa(){
    if(!secs.length) return;
    var y = scrollY + innerHeight * .35, act = secs[0];
    secs.forEach(function(s){ if(s.style.display !== 'none' && arriba(s) <= y) act = s; });
    enlaces.forEach(function(a){
      var es = a.dataset.tab === act.id;
      if(es){ if(!a.hasAttribute('aria-current')){ a.setAttribute('aria-current', 'true'); a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } }
      else a.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', activa, { passive: true }); activa();
  function ir(id, suave){
    var s = el(id); if(!s) return;
    var y = arriba(s) - (el('tabsWrap').offsetHeight + 72) + 2;
    if(suave && window._lenis) window._lenis.scrollTo(y, { duration: 1 }); else scrollTo({ top: y, behavior: suave ? 'smooth' : 'auto' });
  }
  enlaces.forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); ir(a.dataset.tab, true); history.replaceState(null, '', location.search + '#' + a.dataset.tab); }); });
  if(location.hash && el(location.hash.slice(1))) setTimeout(function(){ ir(location.hash.slice(1), false); }, 80);

  /* buscador */
  if(buscar) buscar.addEventListener('input', function(){
    var q = buscar.value.trim().toLowerCase();
    document.querySelectorAll('.plato').forEach(function(p){ p.style.display = !q || p.dataset.busca.indexOf(q) >= 0 ? '' : 'none'; });
    secs.forEach(function(s){ var hay = [].some.call(s.querySelectorAll('.plato'), function(p){ return p.style.display !== 'none'; }); s.style.display = hay ? '' : 'none'; });
  });

  /* ---------- diálogo de foto ----------
     <dialog> con la forma del logo. Al abrir, la foto llega en cinco tiras que entran de lado (impares por la
     izquierda, pares por la derecha; .735s, 65 ms entre ellas) y componen la imagen; luego sube el pie con el
     nombre, el precio y los alérgenos. Se cierra con la ✕, Esc o tocando fuera: las tiras se van y el diálogo
     se apaga. Mientras está abierto el scroll de detrás queda parado. */
  var dlg = el('fotoDlg'); if(!dlg) return;
  var tiras = el('fotoTiras'), cerrando = null, vuelve = null;
  var REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function abrir(i, boton){
    var x = PLATOS[i]; if(!x) return; var p = x.p, src = '../media/carta/platos/' + p.foto + '.webp';
    clearTimeout(cerrando); vuelve = boton || null;
    dlg.classList.remove('abierto', 'lista'); dlg.classList.toggle('fotodlg--llena', !!p.fotoLlena);
    tiras.style.setProperty('--foto', 'url("' + src + '")'); tiras.setAttribute('aria-label', 'Foto de ' + p.n);
    el('fotoCat').textContent = x.c.n; el('fotoNom').textContent = p.n;
    el('fotoPrecio').textContent = p.p + ' €' + (p.e ? ' · ' + p.e : '');
    el('fotoAlg').innerHTML = (p.a || []).map(icono).join(''); el('fotoAlg').hidden = !(p.a || []).length;
    if(dlg.showModal){ if(!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    document.documentElement.style.overflow = 'clip'; if(window._lenis) window._lenis.stop();
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ dlg.classList.add('abierto'); }); });
    /* las tiras entran cuando la foto está descargada (o al cabo de 1,2 s, lo que llegue antes) */
    var hecho = false, lista = function(){ if(hecho) return; hecho = true; if(dlg.open) dlg.classList.add('lista'); };
    var im = new Image(); im.onload = im.onerror = lista; im.src = src; if(im.complete) lista(); setTimeout(lista, 1200);
  }
  function fin(){ clearTimeout(cerrando); if(dlg.open){ if(dlg.close) dlg.close(); else dlg.removeAttribute('open'); } }
  function cerrar(){
    if(!dlg.open) return;
    dlg.classList.remove('abierto', 'lista');
    cerrando = setTimeout(fin, REDUCIR ? 0 : 480);
  }
  dlg.addEventListener('close', function(){ dlg.classList.remove('abierto', 'lista'); document.documentElement.style.overflow = ''; if(window._lenis) window._lenis.start(); if(vuelve && vuelve.focus) vuelve.focus(); });
  dlg.addEventListener('cancel', function(e){ e.preventDefault(); cerrar(); });           /* Esc: con la salida animada */
  dlg.addEventListener('click', function(e){ if(e.target === dlg) cerrar(); });           /* clic fuera del marco */
  el('fotoCerrar').addEventListener('click', cerrar);
  cont.addEventListener('click', function(e){ var b = e.target.closest && e.target.closest('[data-foto]'); if(b) abrir(+b.dataset.foto, b); });
})();
