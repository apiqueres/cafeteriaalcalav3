/* Alcalá — portada.js: carrusel de clips de redes.
   Los clips salen de window.CLIPS (los pondrá el servidor desde el panel); mientras no haya vídeo,
   se enseña el póster. El mp4 sólo se asigna cuando el carrusel entra en pantalla. */
(function(){
  var track = document.getElementById('reelsTrack'), sec = document.getElementById('redes');
  if(!track) return;
  var clips = window.CLIPS || [];
  var GLYPH = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>';
  var TXT = (window.I18N && window.I18N.verEn) || 'Ver en Instagram';
  function make(c, dupe){
    var a = document.createElement('a');
    a.className = 'reel'; a.href = c.destino; a.target = '_blank'; a.rel = 'noopener';
    if(dupe) a.setAttribute('aria-hidden', 'true'); else a.setAttribute('aria-label', TXT);
    var media = c.video
      ? '<video muted loop playsinline preload="none" poster="' + c.poster + '" data-src="' + c.video + '"></video>'
      : '<img src="' + c.poster + '" alt="" loading="lazy" width="384" height="848">';
    a.innerHTML = media + '<span class="reel__ring"></span><span class="reel__ig">' + GLYPH + '</span>'
      + '<span class="reel__ov"><span>' + TXT + '</span><span>↗</span></span>';
    return a;
  }
  var frag = document.createDocumentFragment();
  clips.forEach(function(c){ frag.appendChild(make(c, false)); });
  clips.forEach(function(c){ frag.appendChild(make(c, true)); });   // 2ª copia: bucle sin costuras
  track.appendChild(frag);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if(reduce || saveData) sec.classList.add('reels--still');

  var vids = [].slice.call(track.querySelectorAll('video'));
  if(!vids.length || saveData) return;
  function ensure(v){ if(!v.getAttribute('src') && v.dataset.src) v.setAttribute('src', v.dataset.src); }
  function play(v){ ensure(v); var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting) vids.forEach(play); else vids.forEach(function(v){ v.pause(); }); });
    }, { threshold: .15 }).observe(sec);
  } else vids.forEach(play);
})();

/* ---------- escena: --escena (0 → 1) mientras la primera pantalla se va ----------
   La portada enseña una sola foto (la elige el guion de la cabecera de index.html). Aquí sólo se escribe en la
   sección cuánto se ha ido ya (--escena, para apagar la flecha de scroll) y, en navegadores sin
   animation-timeline, --hero-travel en <html> (0 → 1 mientras el arco cruza la pantalla) para aplanarlo. */
(function(){
  var sec = document.querySelector('.escenas'); if(!sec) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var raiz = document.documentElement, arco = document.querySelector('.hero-arco');
  var conTimeline = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  var e = 0, viaje = 0, pedido = false;
  function lim(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function pintar(){
    pedido = false;
    sec.style.setProperty('--escena', e.toFixed(4));
    if(!conTimeline && arco) raiz.style.setProperty('--hero-travel', viaje.toFixed(4));
  }
  function medir(){
    var H = innerHeight;
    e = lim(-sec.getBoundingClientRect().top / H);
    if(!conTimeline && arco){ var r = arco.getBoundingClientRect(); viaje = lim((H - r.top) / (H + r.height)); }
    if(!pedido){ pedido = true; requestAnimationFrame(pintar); }
  }
  addEventListener('scroll', medir, { passive: true }); addEventListener('resize', medir); medir();
})();

/* ---------- presentación: el párrafo grande se «lee» al bajar ----------
   Cada palabra va en un span.lee con --word-fill (0 → 1). Una línea de lectura al 58 % de la pantalla marca el
   progreso de cada renglón (se rellena mientras cruza una franja del 12 % de la pantalla) y dentro del renglón las
   palabras se rellenan en secuencia: progreso × nº de palabras − posición. En escritorio las láminas quedan ancladas,
   así que la guía baja del 58 % al 100 % conforme la lámina termina de entrar y al quedar fija está todo leído.
   Los valores se suavizan con valor += (objetivo - valor) * (1 - exp(-dt/95)). */
(function(){
  var parrafo = document.querySelector('#presentacion .grande'); if(!parrafo) return;
  var palabras = [];
  (function trocear(nodo){
    [].slice.call(nodo.childNodes).forEach(function(n){
      if(n.nodeType === 1){ trocear(n); return; }
      if(n.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(function(t){
        if(!t) return;
        if(/^\s+$/.test(t)){ frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span'); s.className = 'lee'; s.textContent = t; frag.appendChild(s); palabras.push(s);
      });
      nodo.replaceChild(frag, n);
    });
  })(parrafo);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;   /* el CSS lo deja leído */
  var apilado = matchMedia('(min-width:900px) and (min-height:600px)'), lamina = parrafo.closest('.lamina');
  var lineas = [], valores = [], objetivo = [], activo = false, ultT = 0;
  function lim(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function agrupar(){
    lineas = []; var top = null, actual = null;
    palabras.forEach(function(s){
      var y = s.offsetTop; if(top === null || Math.abs(y - top) > 4){ top = y; actual = []; lineas.push(actual); }
      actual.push(s);
    });
    medir();
  }
  function medir(){
    var H = innerHeight, guia = H * .58;
    if(apilado.matches && lamina){ var entra = lim(1 - lamina.getBoundingClientRect().top / H); guia = H * (.58 + .42 * entra); }
    var franja = H * (apilado.matches ? .18 : .12);   /* en escritorio la lectura ocurre mientras la lámina termina de entrar: franja algo más ancha */
    lineas.forEach(function(l, i){ objetivo[i] = lim((guia - l[0].getBoundingClientRect().top) / franja); if(valores[i] === undefined) valores[i] = 0; });
    if(!activo){ activo = true; ultT = performance.now(); requestAnimationFrame(paso); }
  }
  function paso(t){
    var dt = Math.min(100, t - ultT), k = 1 - Math.exp(-dt / 95), quieto = true; ultT = t;
    lineas.forEach(function(l, i){
      var v = valores[i] + (objetivo[i] - valores[i]) * k;
      if(Math.abs(objetivo[i] - v) < .002) v = objetivo[i]; else quieto = false;
      if(v === valores[i]) return;
      valores[i] = v;
      var n = l.length;
      l.forEach(function(s, j){ s.style.setProperty('--word-fill', lim(v * n - j).toFixed(3)); });
    });
    if(quieto) activo = false; else requestAnimationFrame(paso);
  }
  addEventListener('scroll', medir, { passive: true }); addEventListener('resize', agrupar);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(agrupar);
  agrupar();
})();
