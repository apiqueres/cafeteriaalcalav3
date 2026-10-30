/* Alcalá Cafetería · Baristas — base.js
   Lo común de todas las páginas: telón de entrada, titulares palabra a palabra, scroll suave (Lenis),
   láminas apiladas con --entra / --cubre, snap suave en escritorio, entradas al asomar,
   barra de arriba, menú de móvil, selector de idioma, cintas y año del pie. */
(function(){
  var REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lim = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };
  var raiz = document.documentElement;
  /* transiciones por bandas (el CSS está en base.css): dentro de la página con startViewTransition,
     entre páginas con @view-transition (el navegador la hace solo si sabe; si no, respaldo con .bandas) */
  var VT = !REDUCIR && typeof document.startViewTransition === 'function';
  var VT_PAGINAS = VT && ('onpagereveal' in window);
  var cerrarMenu = null;
  var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();

  /* ---------- titulares: cada palabra en su ventanita ---------- */
  document.querySelectorAll('.titular').forEach(function(t){
    var i = 0;
    [].slice.call(t.childNodes).forEach(function(n){
      if(n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function(trozo){
        if(!trozo) return;
        if(/^\s+$/.test(trozo)){ frag.appendChild(document.createTextNode(' ')); return; }
        var fuera = document.createElement('span'); fuera.className = 'pal';
        var dentro = document.createElement('span'); dentro.textContent = trozo; dentro.style.setProperty('--i', i++);
        fuera.appendChild(dentro); frag.appendChild(fuera);
      });
      t.replaceChild(frag, n);
    });
  });
  /* --l: número de línea de cada palabra (por su offsetTop), para que cada línea entre entera */
  function lineas(){
    [].slice.call(document.querySelectorAll('.titular')).forEach(function(t){
      if(t.classList.contains('in')) return;
      var top = null, l = -1;
      [].slice.call(t.querySelectorAll('.pal')).forEach(function(p){
        var y = p.offsetTop; if(top === null || Math.abs(y - top) > 4){ top = y; l++; }
        p.style.setProperty('--l', l);
      });
    });
  }
  lineas(); addEventListener('resize', lineas);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(lineas);

  /* ---------- scroll suave ---------- */
  var lenis = null;
  if(window.Lenis && !REDUCIR){
    try{ lenis = new Lenis({ lerp: .09 }); window._lenis = lenis; (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0); }
    catch(e){ document.documentElement.style.scrollBehavior = 'smooth'; }
  } else document.documentElement.style.scrollBehavior = REDUCIR ? 'auto' : 'smooth';

  /* ---------- láminas ---------- */
  var laminas = [].slice.call(document.querySelectorAll('.lamina'));
  var avance = document.getElementById('avance'), nav = document.getElementById('nav'), pagina = document.getElementById('pagina');
  var navFondo = false;
  var SEL_ENTRA = '.rv, .foto, .titular, .raya, [data-entra]';
  var pendientes = REDUCIR ? [] : [].slice.call(document.querySelectorAll(SEL_ENTRA));
  function mostrar(el){
    if(el.classList.contains('in')) return; el.classList.add('in');
    if(el.dataset.entra){ var fn = window[el.dataset.entra]; if(typeof fn === 'function') fn(el); }
  }
  if(REDUCIR) [].slice.call(document.querySelectorAll(SEL_ENTRA)).forEach(mostrar);
  window.__mostrarTodo = function(){ pendientes.forEach(mostrar); pendientes.length = 0; if(observador) observador.disconnect(); };
  /* un solo observador: cada entrada se dispara una vez al asomar (8 % del elemento dentro, 6 % de margen abajo) */
  var observador = null;
  if(pendientes.length && 'IntersectionObserver' in window){
    observador = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        observador.unobserve(e.target); mostrar(e.target);
        var k = pendientes.indexOf(e.target); if(k > -1) pendientes.splice(k, 1);
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    pendientes.forEach(function(el){ observador.observe(el); });
  } else window.__mostrarTodo();

  function sitioDe(el){
    if(!el) return 0;
    if(el.id === 'inicio') return 0;
    var i = laminas.indexOf(el); if(i < 0 || !pagina) return el.getBoundingClientRect().top + scrollY;
    var y = pagina.offsetTop;
    for(var k = 0; k < i; k++) y += laminas[k].offsetHeight;
    return y;
  }
  window.__sitioDe = sitioDe;

  /* enlaces de sección: con view transitions, salto inmediato barrido por bandas; si no, scroll suave */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if(!a) return;
    var id = a.getAttribute('href').slice(1); var el = id ? document.getElementById(id) : null; if(!el) return;
    e.preventDefault(); var y = sitioDe(el);
    if(VT){
      var tr = document.startViewTransition(function(){
        if(cerrarMenu) cerrarMenu(true);
        if(lenis) lenis.scrollTo(y, { immediate: true, force: true });
        if(Math.abs(scrollY - y) > 2) scrollTo(0, y);
        try{ history.pushState(null, '', id === 'inicio' ? location.pathname + location.search : '#' + id); }catch(err){}
        actualizar();
      });
      /* si otra transición o una navegación la interrumpe, el navegador la salta: no es un error */
      ['ready', 'finished', 'updateCallbackDone'].forEach(function(k){ if(tr && tr[k] && tr[k].catch) tr[k].catch(function(){}); });
      return;
    }
    if(cerrarMenu) cerrarMenu(false);
    if(lenis){ lenis.scrollTo(y, { duration: 1.3 }); setTimeout(function(){ if(Math.abs(scrollY - y) > 6 && !lenis.isScrolling) scrollTo(0, y); }, 1900); }
    else scrollTo({ top: y, behavior: REDUCIR ? 'auto' : 'smooth' });
  });

  /* enlaces a otra página del sitio: se apunta la salida (la página de llegada no enseña el telón) y, si el
     navegador no sabe hacer la transición entre páginas, se tapa con bandas burdeos antes de cambiar */
  document.addEventListener('click', function(e){
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if(!a) return;
    var h = a.getAttribute('href') || '';
    if(h.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return;
    if(a.pathname === location.pathname && a.search === location.search) return;
    try{ sessionStorage.setItem('llegada', String(Date.now())); }catch(err){}
    if(REDUCIR || VT_PAGINAS) return;
    e.preventDefault();
    var tapa = document.createElement('div'); tapa.className = 'bandas'; tapa.setAttribute('aria-hidden', 'true');
    for(var i = 0; i < 5; i++){ var b = document.createElement('i'); b.style.setProperty('--i', i); tapa.appendChild(b); }
    document.body.appendChild(tapa);
    try{ sessionStorage.setItem('llegada-bandas', '1'); }catch(err){}
    setTimeout(function(){ location.href = a.href; }, 1000);
  });
  /* llegada con el respaldo: la página se destapa con la misma máscara de bandas sobre body */
  (function(){
    var con = false; try{ con = sessionStorage.getItem('llegada-bandas') === '1'; sessionStorage.removeItem('llegada-bandas'); }catch(err){}
    if(!con || REDUCIR) return;
    raiz.classList.add('llegada--bandas');
    var quitar = function(){ raiz.classList.remove('llegada--bandas'); };
    document.body.addEventListener('animationend', function(e){ if(e.animationName === 'banda4') quitar(); });
    setTimeout(quitar, 1500);
  })();

  /* snap suave: sólo en escritorio, donde las láminas se apilan */
  var apilado = matchMedia('(min-width:900px) and (min-height:600px)');
  if(lenis) (function(){
    var espera = null, encajando = false, dir = 1;
    function puntos(){ var p = [0]; laminas.forEach(function(l){ if(!l.classList.contains('lamina--libre')) p.push(sitioDe(l)); }); return p; }
    function encajar(){
      if(!apilado.matches || encajando || lenis.isStopped || raiz.style.overflow === 'clip') return;
      var y = lenis.animatedScroll, P = puntos(), ultimo = P[P.length - 1];
      if(y >= ultimo - 2) return;
      for(var i = 0; i < P.length - 1; i++){
        var a = P[i], b = P[i + 1]; if(y < a - 2 || y >= b) continue;
        var d = y - a, umbral = (b - a) * .1; if(d < 3 || b - y < 3) return;
        var destino = dir > 0 ? (d > umbral ? b : a) : (b - y > umbral ? a : b);
        encajando = true;
        lenis.scrollTo(destino, { duration: .9, easing: function(t){ return 1 - Math.pow(1 - t, 3); }, onComplete: function(){ encajando = false; } });
        setTimeout(function(){ encajando = false; }, 1400);
        return;
      }
    }
    lenis.on('scroll', function(l){ if(l.direction) dir = l.direction; clearTimeout(espera); if(!encajando) espera = setTimeout(encajar, 160); });
  })();

  function actualizar(){
    var H = innerHeight, max = document.documentElement.scrollHeight - H;
    if(avance) avance.style.transform = 'scaleX(' + (max > 0 ? lim(scrollY / max) : 0).toFixed(4) + ')';
    var cajas = laminas.map(function(s){ return s.getBoundingClientRect(); });
    laminas.forEach(function(s, i){
      var entra = lim(1 - cajas[i].top / H), cubre = 0;
      if(!REDUCIR && i < laminas.length - 1 && apilado.matches) cubre = lim(1 - cajas[i + 1].top / H);
      s.style.setProperty('--entra', REDUCIR ? 1 : entra.toFixed(3));
      s.style.setProperty('--cubre', cubre.toFixed(3));
    });
    if(nav && pagina){
      var sobre = pagina.getBoundingClientRect().top <= H * .08;
      if(sobre !== navFondo){ navFondo = sobre; nav.classList.toggle('nav--fondo', sobre); if(window.__hero && window.__hero.pausar) window.__hero.pausar(sobre); }
    }
  }
  window.__actualizar = actualizar;
  var pedido = false;
  /* en pestañas en segundo plano requestAnimationFrame no se dispara: entonces se calcula directamente */
  function pedir(){ if(document.hidden){ actualizar(); return; } if(!pedido){ pedido = true; requestAnimationFrame(function(){ pedido = false; actualizar(); }); } }
  addEventListener('scroll', pedir, { passive: true }); addEventListener('resize', pedir);
  addEventListener('load', actualizar); addEventListener('pageshow', actualizar);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) actualizar(); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(actualizar);
  setTimeout(actualizar, 60); setTimeout(actualizar, 600);

  /* ---------- menú de móvil: <dialog> con persianas (CSS en base.css) ----------
     Se abre con showModal (lo de detrás queda inerte), html con overflow:clip (clip y no hidden, para que los sticky
     sigan atados a la pantalla) y Lenis parado. La clase .abierto lleva la coreografía; al cerrar se quita y el
     diálogo se cierra de verdad cuando acaban las persianas (980 ms). */
  var menu = document.getElementById('menu'), mb = document.getElementById('menuBtn'), mc = document.getElementById('menuCerrar');
  if(menu && mb){
    var CIERRE_MS = 980, cerrando = null;
    [].slice.call(menu.querySelectorAll(':scope > a, :scope > .idiomas-fila, :scope > .menu__redes')).forEach(function(el, i){ el.style.setProperty('--i', i); });
    function mostrarDialogo(v){
      if(v){ if(menu.open) return; if(menu.showModal) menu.showModal(); else menu.setAttribute('open', ''); }
      else { if(!menu.open) return; if(menu.close) menu.close(); else menu.removeAttribute('open'); }
    }
    function abrir(v, inmediato){
      clearTimeout(cerrando); mb.setAttribute('aria-expanded', v ? 'true' : 'false');
      if(v){
        mostrarDialogo(true); raiz.style.overflow = 'clip'; if(lenis) lenis.stop();
        void menu.offsetWidth; menu.classList.add('abierto');
        if(mc) mc.focus();
        return;
      }
      menu.classList.remove('abierto');
      var fin = function(){ mostrarDialogo(false); raiz.style.overflow = ''; if(lenis) lenis.start(); mb.focus(); };
      if(inmediato) fin(); else cerrando = setTimeout(fin, CIERRE_MS);
    }
    mb.addEventListener('click', function(){ abrir(true); });
    if(mc) mc.addEventListener('click', function(){ abrir(false); });
    menu.addEventListener('cancel', function(e){ e.preventDefault(); abrir(false); });   /* Escape: cierre con coreografía */
    menu.addEventListener('close', function(){ clearTimeout(cerrando); menu.classList.remove('abierto'); raiz.style.overflow = ''; if(lenis) lenis.start(); mb.setAttribute('aria-expanded', 'false'); });
    /* los enlaces de sección los cierra el manejador de arriba (al instante dentro de la transición); los de otra
       página del sitio dejan el menú abierto para que la transición por bandas entre encima de él */
    menu.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a'); if(!a) return;
      var h = a.getAttribute('href') || ''; if(h.charAt(0) === '#') return;
      if(a.target === '_blank' || a.origin !== location.origin) abrir(false);
    });
    cerrarMenu = function(inmediato){
      if(!menu.open) return;
      if(!inmediato){ abrir(false); return; }
      menu.classList.add('sin-transicion'); abrir(false, true); void menu.offsetWidth; menu.classList.remove('sin-transicion');
    };
  }

  /* ---------- selector de idioma ---------- */
  [].slice.call(document.querySelectorAll('[data-idiomas]')).forEach(function(caja){
    var btn = caja.querySelector('.idiomas__btn'); if(!btn) return;
    function abrir(v){ caja.classList.toggle('abierto', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); }
    btn.addEventListener('click', function(e){ e.stopPropagation(); abrir(!caja.classList.contains('abierto')); });
    document.addEventListener('click', function(e){ if(!caja.contains(e.target)) abrir(false); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') abrir(false); });
  });

  /* ---------- telón de entrada: persianas con el logo (CSS en base.css) ----------
     Sólo la primera vez en la sesión (el guion de la cabecera pone html.sin-telon o html.llegada si no toca).
     La animación del logo dura ~2,4 s; después las cinco persianas salen de lado. Se salta con scroll, tecla o clic. */
  var telon = document.getElementById('telon');
  /* el logo del hero aterriza (CSS: .hero--entra) cuando el telón se va, o al momento si no hay telón */
  var aterrizar = function(){ var h = document.querySelector('.hero'); if(h) h.classList.add('hero--entra'); };
  if(!telon) aterrizar();
  else if(raiz.classList.contains('llegada') || raiz.classList.contains('sin-telon')){ telon.classList.add('quitado'); try{ sessionStorage.setItem('telon', '1'); }catch(e){} aterrizar(); }
  else {
    var primera = telon.querySelector('.telon__persiana');
    if(primera) for(var np = 1; np < 5; np++){ var copia = primera.cloneNode(true); copia.style.setProperty('--n', np); telon.appendChild(copia); }
    var t0 = performance.now(), cerrado = false;
    var abrirTelon = function(){
      if(cerrado) return; cerrado = true;
      try{ sessionStorage.setItem('telon', '1'); }catch(e){}
      telon.classList.add('fuera'); aterrizar(); setTimeout(function(){ telon.classList.add('quitado'); }, 1100);
    };
    void telon.offsetWidth; telon.classList.add('telon--va');          // arrancan las cinco a la vez
    var listo = document.readyState === 'complete';
    if(!listo) addEventListener('load', function(){ listo = true; });
    var espera = setInterval(function(){ if(performance.now() - t0 >= 2450 && listo){ clearInterval(espera); abrirTelon(); } }, 50);
    setTimeout(abrirTelon, 5000);                                       // tope por si la carga se alarga
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function(ev){ addEventListener(ev, abrirTelon, { once: true, passive: true }); });
  }

  /* ---------- cintas: se mueven solas y más deprisa con el scroll ---------- */
  var cintas = [].slice.call(document.querySelectorAll('.cinta__pista')).map(function(p, i){
    var uno = p.innerHTML; p.innerHTML = uno + uno + uno + uno; return { el: p, x: 0, dir: i % 2 ? 1 : -1, ancho: 0 };
  });
  var marquee = document.getElementById('reelsMarquee');
  if(cintas.length || marquee){
    var visibles = false, caja = document.querySelector('.cintas');
    if(caja && 'IntersectionObserver' in window) new IntersectionObserver(function(es){ visibles = es[0].isIntersecting; }).observe(caja);
    var ultY = scrollY, velS = 0, ultT = performance.now();
    (function bucle(t){
      var dt = Math.min(.05, (t - ultT) / 1000); ultT = t;
      var dy = scrollY - ultY; ultY = scrollY; velS += (dy - velS) * .12; if(Math.abs(velS) < .01) velS = 0;
      if(!REDUCIR && visibles) cintas.forEach(function(c){
        if(!c.ancho) c.ancho = c.el.scrollWidth / 4;
        c.x += c.dir * (50 + Math.min(Math.abs(velS), 60) * 18) * dt; if(c.x < -c.ancho) c.x += c.ancho; if(c.x > 0) c.x -= c.ancho;
        c.el.style.transform = 'translate3d(' + c.x.toFixed(1) + 'px,0,0)';
      });
      if(marquee && !REDUCIR) marquee.style.transform = velS ? 'skewX(' + Math.max(-5, Math.min(5, velS * -.2)).toFixed(2) + 'deg)' : '';
      requestAnimationFrame(bucle);
    })(performance.now());
  }
})();
