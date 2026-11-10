/* Alcalá — datos de las cartas.
   Seis cartas, transcritas de los PDF que el local tiene publicados (carpeta cartas/, noviembre de 2026): la general,
   desayunos, cafés, vinos, cervezas y cócteles. Nombres, descripciones y precios son los de esos PDF.
   ALÉRGENOS: sólo la carta general los trae (iconos junto a cada plato) y aquí van tal cual están impresos; las otras
   cinco cartas no los indican, así que van sin alérgenos y la web avisa de que se consulten en el local (sinAlg).
   ETIQUETAS: «nuevo» donde el PDF lo marca, «vegano» en la carta vegana, «sin gluten» en la selección de la página
   «Carta sin gluten» y «picante» donde el nombre o la descripción lo dicen.
   FOTOS de plato (foto:'…' → media/carta/platos/….webp): las que vienen dentro de los PDF, recortadas; fotoLlena
   marca las que no son un recorte y llenan el marco. fotoMesa marca las fotos reales del cliente llevadas a una mesa
   oscura con el fondo de azulejos azules (cuadradas, 1400 px; originales en imagenes/platos-mesa).
   Precio: p es el principal (e dice de qué: botella, doble…), p2 el segundo (e2 dice de qué: copa, media ración…).
   CARTAS dice qué cartas hay; cada categoría de CARTA dice a cuál pertenece (carta:'…').
   Cuando exista el panel con servidor, este fichero lo generará el servidor desde la base de datos. */
window.ALERGENOS = [
  { id:'gluten',     n:'Gluten' },        { id:'crustaceos', n:'Crustáceos' },  { id:'huevos',  n:'Huevos' },
  { id:'pescado',    n:'Pescado' },       { id:'cacahuetes', n:'Cacahuetes' },  { id:'soja',    n:'Soja' },
  { id:'lacteos',    n:'Lácteos' },       { id:'cascara',    n:'Frutos de cáscara' }, { id:'apio', n:'Apio' },
  { id:'mostaza',    n:'Mostaza' },       { id:'sesamo',     n:'Sésamo' },      { id:'sulfitos', n:'Sulfitos' },
  { id:'altramuces', n:'Altramuces' },    { id:'moluscos',   n:'Moluscos' }
];
window.ETIQUETAS = { nuevo:'Nuevo', reco:'Recomendado', vegano:'Vegano', singluten:'Sin gluten', picante:'Picante' };
window.CARTAS = [
  { id:'general',   n:'La carta',  corto:'Carta general', foto:'hamburguesas', d:'Hamburguesas, bocadillos, ensaladas, carnes, pescados, postres y carta vegana. Cocina abierta todo el día.' },
  { id:'desayunos', n:'Desayunos', corto:'Desayunos',     foto:'desayunos',    d:'Almuerzo valenciano, tostadas, bowls, huevos y bollería para empezar el día.', sinAlg:true },
  { id:'cafes',     n:'Cafés',     corto:'Cafés',         foto:'cafes',        d:'Cafés de barista, especialidades de la casa, frappés, infusiones y tés helados.', sinAlg:true },
  { id:'vinos',     n:'Vinos',     corto:'Vinos',         foto:'vinos',        d:'Seleccionamos el vino para dar a nuestros clientes experiencias enológicas de la máxima calidad.', sinAlg:true },
  { id:'cervezas',  n:'Cervezas',  corto:'Cervezas',      foto:'cervezas',     d:'De barril y en botella, con su nota de cata, graduación y amargor.', sinAlg:true },
  { id:'cocteles',  n:'Cócteles',  corto:'Cócteles',      foto:'cocteles',     d:'Spritz, mojitos, frozen y los clásicos de la casa.', sinAlg:true }
];
window.CARTA = [
  /* ======================= carta general ======================= */
  { id:'hamburguesas', carta:'general', n:'Hamburguesas y tacos', foto:'hamburguesas', d:'Todas las hamburguesas se pueden acompañar con huevo o con queso de cabra, +1 €. Pan sin gluten, +1,20 €.', platos:[
    { n:'Taco Pulled Pork', p:'13,50', d:'Carne desmigada de cerdo, lechuga, tomate, aguacate, cilantro, salsa agria, queso fresco y pepinillos.', a:['gluten','crustaceos','huevos','pescado','soja','lacteos','apio','mostaza','sesamo','sulfitos','moluscos'], foto:'taco-pulled-pork', fotoMesa:true },
    { n:'Taco Alcalá', p:'14,00', d:'Solomillo de pollo rebozado, lechuga, tomate, queso cheddar, cebolla, pimiento, salsa agria y salsa sweet chili (ligeramente picante).', a:['gluten','huevos','cacahuetes','soja','lacteos','mostaza','sesamo'], t:['picante'] },
    { n:'Burger de pollo', p:'12,35', d:'Hamburguesa de pollo de 180 g acompañada de tomate, ensalada, bacon y queso. Con guarnición de patatas fritas.', a:['gluten','huevos','soja','lacteos','sesamo','sulfitos'] },
    { n:'Burger de vacuno y cerdo', p:'12,50', d:'Hamburguesa de vacuno y cerdo de 140 g acompañada de tomate, ensalada, bacon y queso. Con guarnición de patatas fritas.', a:['gluten','huevos','soja','lacteos','sesamo','sulfitos'] },
    { n:'Burger de buey', p:'14,85', d:'Hamburguesa de buey de 250 g acompañada de tomate, ensalada, bacon y queso. Con guarnición de patatas fritas.', a:['gluten','huevos','soja','lacteos','sesamo','sulfitos'] },
    { n:'Burger Pulled Pork', p:'13,50', d:'Carne desmigada de cerdo acompañada de tomate, ensalada, bacon y queso. Con guarnición de patatas fritas.', a:['gluten','huevos','soja','lacteos','sesamo','sulfitos'] },
    { n:'Beyond Burger', p:'13,80', d:'La hamburguesa de Beyond Meat, creada directamente de las plantas. Complementos: patatas fritas 1,25 €, verduras a la plancha 2,50 €, láminas de boniato 1,60 €.', a:[], t:['singluten'], foto:'beyond', fotoMesa:true }
  ]},
  { id:'ensaladas', carta:'general', n:'Ensaladas y entrantes', foto:'ensaladas', d:'Para empezar o para compartir.', platos:[
    { n:'Ensalada griega', p:'12,00', d:'Tomates, aceitunas negras, pimiento verde y rojo, cebolla y queso fresco sobre una mezcla de lechugas, aliñada con nuestra vinagreta griega.', a:['mostaza'] },
    { n:'Ensalada César', p:'13,00', d:'Tomate cherry, queso parmesano, picatostes y pechuga rebozada. Con queso de cabra, +1 €.', a:['gluten','huevos','cacahuetes','lacteos','mostaza','sesamo'], foto:'ensalada-cesar' },
    { n:'Ensalada especial', p:'12,45', d:'Lechuga, tomate, atún, huevo duro, pimiento asado y espárragos.', a:['huevos','pescado'], t:['singluten'] },
    { n:'Ensalada temporada', p:'12,45', d:'Elaborada con hortalizas de temporada.', a:[] },
    { n:'Ensaladilla rusa', p:'9,50', a:['huevos','pescado','lacteos'] },
    { n:'Plato de jamón', p:'16,00', d:'100 g de jamón de bellota ibérico, 50 % raza ibérica.', a:[], t:['singluten'] },
    { n:'Plato de queso', p:'9,50', d:'Premiado con la medalla de oro en los World Cheese Awards 2023 y durante 15 años seguidos.', a:['lacteos'], t:['singluten'] },
    { n:'Plato de cecina León', p:'10,50', d:'Cecina Suprema Premium: las mejores piezas, con el nivel perfecto de infiltración para aportar todo el sabor.', a:[] },
    { n:'Plato de surtido ibéricos', p:'12,00', d:'Salchichón, chorizo y lomo 100 % bellota. Embutido premium de raza 100 % ibérica autóctona.', a:[] },
    { n:'Cesta de panes variados', p:'3,50', d:'Con tomate y aceite.', a:['gluten','huevos','cacahuetes','lacteos','cascara','sesamo','altramuces'] },
    { n:'Cesta de pan normal', p:'1,50', a:['gluten'] }
  ]},
  { id:'bocadillos', carta:'general', n:'Bocadillos', foto:'bocadillos', d:'Suplementos: patatas fritas 1,25 €, verduras a la plancha 2,50 €, láminas de boniato 1,60 €.', platos:[
    { n:'Jamón bellota ibérico', p:'6,50', d:'Bocadillo frío.', a:['gluten'] },
    { n:'Queso manchego', p:'5,50', d:'Bocadillo frío.', a:['gluten','huevos','lacteos'] },
    { n:'Chivito', p:'7,00', d:'Lomo, queso, cebolla frita y bacon. Bocadillo caliente.', a:['gluten','huevos','soja','lacteos'], foto:'chivito' },
    { n:'Atún', p:'5,50', d:'Bocadillo frío.', a:['gluten','pescado'] },
    { n:'Sobrasada', p:'5,50', d:'Bocadillo frío.', a:['gluten','soja','lacteos','sulfitos'] },
    { n:'Atún especial', p:'6,00', d:'Atún, anchoas, aceitunas y tomate. Bocadillo frío.', a:['gluten','pescado'] },
    { n:'Lomo', p:'6,00', d:'Bocadillo caliente.', a:['gluten','soja','lacteos'] },
    { n:'Pechuga de pollo', p:'6,00', d:'Bocadillo caliente.', a:['gluten'] },
    { n:'Bacon', p:'5,50', d:'Bocadillo caliente.', a:['gluten','soja'] },
    { n:'Longanizas (3)', p:'5,65', d:'Bocadillo caliente.', a:['gluten','soja','sulfitos'] },
    { n:'Tortilla francesa', p:'4,85', d:'Bocadillo caliente.', a:['gluten','huevos'] },
    { n:'Tortilla a elegir', p:'5,50', d:'Bocadillo caliente.', a:['gluten','huevos'] },
    { n:'Calamares', p:'6,75', d:'Bocadillo caliente.', a:['gluten','huevos','pescado','lacteos'] }
  ]},
  { id:'sandwiches', carta:'general', n:'Sándwiches', foto:'sandwiches', d:'Suplementos: patatas fritas 1,25 €, verduras a la plancha 2,50 €, láminas de boniato 1,60 €.', platos:[
    { n:'Alcalá', p:'13,40', d:'Tres pisos de pechuga de pollo con bacon crujiente, lechuga, tomate y huevo. El precio incluye la ración de patatas.', a:['gluten','huevos','soja','lacteos'], foto:'sandwich-alcala' },
    { n:'Primavera', p:'12,80', d:'Frío. Jamón York, queso, lechuga, tomate, pollo y salsa César. El precio incluye la ración de patatas.', a:['gluten','huevos','pescado','cacahuetes','soja','lacteos','mostaza','sesamo'], foto:'sandwich-primavera' },
    { n:'Mixto', p:'4,80', d:'Sándwich de jamón York y queso.', a:['gluten','soja','lacteos'] },
    { n:'Jamón serrano y queso', p:'5,20', d:'Sándwich de jamón serrano y queso.', a:['gluten','soja','lacteos'] },
    { n:'Mixto con huevo frito', p:'6,00', d:'Sándwich de jamón York, queso y huevo frito.', a:['gluten','huevos','soja'] },
    { n:'Pollo', p:'8,00', d:'Sándwich de lechuga, tomate, pollo, queso y huevo duro. Incluye ración de patatas.', a:['gluten','huevos','soja','lacteos','sesamo'] },
    { n:'Vegetal', p:'8,00', d:'Sándwich de lechuga, tomate, atún, mahonesa, huevo duro y espárrago. Incluye ración de patatas.', a:['gluten','huevos','pescado','soja','lacteos','sesamo'] }
  ]},
  { id:'patatas', carta:'general', n:'Especialidades con patatas', foto:'patatas', d:'Para picar entre varios.', platos:[
    { n:'Huevos rotos', p:'10,50', d:'Huevos rotos con jamón, chorizo y patatas.', a:['gluten','huevos','soja'], foto:'huevos-rotos' },
    { n:'Torreta semipicante de patatas', p:'9,60', d:'Torre de patatas caseras.', a:['gluten','huevos','soja','sulfitos'], t:['picante'], foto:'torreta-patatas' },
    { n:'Patatas Alcalá', p:'10,50', d:'Patatas fritas con beicon y queso fundido.', a:['gluten','huevos','soja','lacteos'] },
    { n:'Patatas dipear', p:'9,50', d:'Patatas con variedad de salsas.', a:['gluten','huevos','soja','sulfitos'] },
    { n:'Láminas de boniato', p:'7,95', d:'Láminas de boniato para picotear.', a:['gluten','huevos','soja','sulfitos'] },
    { n:'Patatas bravas', p:'6,95', a:['gluten','mostaza'] },
    { n:'Cesta de patatas', p:'5,80', a:['gluten'] }
  ]},
  { id:'infantil', carta:'general', n:'Menú infantil', foto:'infantil', d:'Válido para niños hasta 12 años. El precio incluye agua, refresco o zumo.', platos:[
    { n:'Menú infantil', p:'11,40', d:'Primero a elegir entre spaghetti boloñesa o hamburguesa con patatas. Postre: helado de vainilla con lacasitos. Los alérgenos son la suma de los tres platos.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara','mostaza','sesamo','sulfitos'] }
  ]},
  { id:'pastas', carta:'general', n:'Pastas', foto:'pastas', d:'Suplemento de queso en los spaghetti, +1 €.', platos:[
    { n:'Lasaña boloñesa', p:'8,80', a:['gluten','huevos','lacteos'], foto:'lasana-bolonesa' },
    { n:'Spaghetti boloñesa', p:'9,00', a:['gluten','huevos','mostaza'], foto:'spaghetti-bolonesa' },
    { n:'Moussaka', p:'9,40', d:'Lasaña griega de berenjenas con mezcla de carnes de ternera, cerdo y ave, cebolla, tomate y un toque de salsa.', a:['gluten','soja','lacteos'] },
    { n:'Spaghetti carbonara', p:'8,70', a:['gluten','huevos','mostaza'] }
  ]},
  { id:'carnes', carta:'general', n:'Carnes', foto:'carnes', d:'Suplementos: patatas fritas 1,25 €, verduras a la plancha 2,50 €, láminas de boniato 1,60 €.', platos:[
    { n:'Croqueta de jamón ibérico', p:'2,00', d:'1 unidad.', a:['gluten','huevos','soja','lacteos'] },
    { n:'Croquetas', p:'8,00', d:'De setas y jamón serrano. 6 unidades.', a:['gluten','huevos','soja','lacteos'], foto:'croquetas' },
    { n:'Codillo', p:'16,30', d:'Acompañado de patatas fritas.', a:[], t:['singluten'] },
    { n:'Brochetas de pollo', p:'13,30', d:'Acompañadas de patata hervida.', a:[], t:['singluten'] },
    { n:'Costillas barbacoa', p:'18,40', p2:'14,80', e2:'Media ración', d:'Acompañadas de patata hervida. Ración completa.', a:[] },
    { n:'Carrillera de cerdo', p:'15,40', d:'Acompañada de patata hervida.', a:[] },
    { n:'Pollo con curry y arroz', p:'13,50', a:['gluten','lacteos','mostaza'] },
    { n:'Alitas de pollo', p:'7,80', d:'Alitas de pollo a la barbacoa.', a:['gluten','soja'] },
    { n:'Cordero', p:'19,20', d:'Acompañado de patata hervida.', a:[], foto:'cordero', fotoMesa:true },
    { n:'Nuggets', p:'11,00', d:'De solomillo de pollo, caseros.', a:['gluten','huevos'] },
    { n:'Rabo de toro', p:'16,10', d:'Acompañado de arroz.', a:['gluten','soja','lacteos','sulfitos'] },
    { n:'Pechuga de pollo', p:'11,30', d:'Empanada. Acompañada con pasta y patatas fritas.', a:['gluten','huevos','lacteos'] },
    { n:'Secreto ibérico', p:'13,00', d:'Acompañado de salsa chimichurri (mezcla de pimiento, ajo, cebolla…).', a:[] }
  ]},
  { id:'pescados', carta:'general', n:'Pescados', foto:'pescados', d:'', platos:[
    { n:'Calamar entero', p:'13,00', a:['gluten','huevos','pescado'] },
    { n:'Pulpo a la gallega', p:'21,00', a:['pescado'], foto:'pulpo-gallega', fotoLlena:true },
    { n:'Tostada de ahumados', p:'7,50', a:['gluten','huevos','pescado'] },
    { n:'Bacalao con tomate', p:'15,40', d:'Acompañado de patata hervida.', a:['pescado'], t:['singluten'] },
    { n:'Sepia', p:'13,75', a:['pescado'] },
    { n:'Emperador', p:'14,95', a:['gluten','pescado'] },
    { n:'Calamares a la romana', p:'11,00', a:['gluten','huevos','pescado'], foto:'calamares-romana' },
    { n:'Chipirones', p:'11,90', a:['gluten','huevos','pescado'] }
  ]},
  { id:'postres', carta:'general', n:'Postres', foto:'postres', d:'', platos:[
    { n:'Flan casero', p:'4,20', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'], foto:'flan' },
    { n:'Coulant de chocolate', p:'4,80', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Torrija casera', p:'5,30', d:'Con helado de leche merengada.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'], foto:'torrija' },
    { n:'Bowl Alcalá', p:'7,10', d:'Yogur griego con frutas de temporada y muesli.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Helado de leche merengada', p:'4,90', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Tarta Tatín', p:'5,30', d:'Tarta de manzana caliente con helado de vainilla.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Tarta 3 chocolates', p:'5,30', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Tarta de queso', p:'5,50', d:'Con frutos rojos.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] },
    { n:'Tortitas con miel', p:'5,30', d:'Con chocolate o con caramelo, +0,50 €.', a:['gluten','huevos','cacahuetes','soja','lacteos','cascara'] }
  ]},
  { id:'vegana', carta:'general', n:'Carta vegana', foto:'vegana', d:'Entrantes, ensaladas, principales y postres sin productos de origen animal.', platos:[
    { n:'Láminas de boniato', p:'7,95', d:'Boniatos dulces cortados en finas láminas, dorados y con un ligero toque de sal.', a:[], t:['vegano'] },
    { n:'Peruvian Salad', p:'11,50', d:'Nuestra ensalada más fresca: quinoa cocida, pimiento verde y rojo, garbanzos, maíz dulce, nueces y pasas, aromatizada con aceite de oliva y nuestra vinagreta especial. Los ingredientes pueden variar según la temporada.', a:['cacahuetes','soja','cascara','mostaza'], t:['vegano'] },
    { n:'Season Green Salad', p:'11,95', d:'Ensalada de hortalizas y verduras de temporada, frescas y preparadas al momento, acompañadas de vuna (atún vegano).', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'] },
    { n:'Nuggets veganos', p:'7,25', d:'Nuestra versión vegana de un clásico: crujientes y con todo el sabor, a partir de proteínas vegetales de soja y trigo.', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'], foto:'nuggets-veganos' },
    { n:'Hamburguesa Penélope', p:'9,50', d:'Nuestra hamburguesa vegana, servida con pan especial de semillas, tomate, cebolla y pepinillos, con un toque de mostaza. Acompañada de nuestra patata asada.', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'], foto:'hamburguesa-penelope' },
    { n:'Sándwich Pitágoras', p:'9,85', d:'Pan con semillas, tofu, brotes verdes, espinacas, láminas de tomate y aguacate. Puedes acompañarlo con nuestras patatas.', a:['gluten','cascara','sesamo'], t:['vegano'] },
    { n:'Falafel', p:'7,85', d:'Albóndigas especiadas de garbanzos y remolacha, para comer solas o como acompañantes.', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'], foto:'falafel' },
    { n:'Salteado vegano de pollo', p:'10,50', d:'Salteado con todo el sabor del pollo y nuestras verduras frescas, pero totalmente vegano.', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'], foto:'salteado-vegano' },
    { n:'Bocadillo de pollo vegano', p:'7,10', d:'Pollo empanado crujiente, lechuga, tomate, pan y mayonesa, pero totalmente vegano.', a:['gluten','huevos','soja','apio','mostaza','sesamo'], t:['vegano','nuevo'], foto:'bocadillo-pollo-vegano' },
    { n:'Batido Natalie Portman', p:'7,30', d:'Green Detox Smoothie: manzana, pepino, apio, espinacas, jengibre y zumo de naranja.', a:['apio'], t:['vegano'] },
    { n:'Season Fruits Salad', p:'7,90', d:'Ensalada de frutas de temporada, frescas y preparadas al momento, acompañada de zumo natural.', a:[], t:['vegano'] }
  ]},

  /* ======================= desayunos ======================= */
  { id:'almuerzo', carta:'desayunos', n:'Almuerzo valenciano', foto:'desayunos', d:'Ambos almuerzos van acompañados de cacahuetes y aceitunas. Precios válidos hasta las 12:00.', platos:[
    { n:'Almuerzo con 2 variantes', p:'9,00', d:'Bocadillo con 2 variantes, 1 bebida y café.', a:[] },
    { n:'Almuerzo con 3 variantes', p:'10,00', d:'Bocadillo con 3 variantes, 1 bebida y café.', a:[] }
  ]},
  { id:'especialidades', carta:'desayunos', n:'Desayunos', foto:'', d:'Suplemento de pan sin gluten, +1,20 €.', platos:[
    { n:'Tostada rústica', p:'4,90', d:'Pan de pueblo con tomate valenciano, jamón serrano ibérico, albahaca y aceite virgen extra.', a:[], foto:'tostada-rustica' },
    { n:'Tostada Merrick', p:'5,90', d:'Recomendación desde Kentucky: pan de semilla, aguacate, huevo revuelto y bacon horneado a 140 grados con semillas de cereales y paprika.', a:[], t:['reco'], foto:'tostada-merrick' },
    { n:'Açaí Bowl', p:'8,50', d:'Açaí, arándanos, coco, fresas, plátano, granola y salsa de pistacho. Las frutas pueden variar según temporada.', a:[], foto:'acai-bowl' },
    { n:'Bowl Alcalá', p:'8,00', d:'Yogur griego con fruta de temporada y muesli.', a:[] },
    { n:'Bol de frutas de temporada', p:'7,90', d:'Variedad de frutas de temporada cortadas al momento.', a:[] },
    { n:'Huevos Benedict', p:'7,70', d:'Huevos pochados con jamón serrano bañados en una cremosa salsa holandesa sobre pan tierno y un toque de perejil.', a:[] },
    { n:'Huevos Benedict al estilo noruego', p:'7,85', d:'Huevos pochados con salmón ahumado bañados en una cremosa salsa holandesa sobre pan tierno y un toque de perejil.', a:[] },
    { n:'English Breakfast', p:'9,50', d:'Clásico desayuno inglés: huevos fritos o revueltos con bacon ahumado, judías, champiñones, tomate a la plancha, longaniza y 2 rebanadas de pan de molde recién tostado.', a:[] },
    { n:'Aguacate toast', p:'6,90', d:'Tostadas de aguacate en pan de cereales con huevo revuelto, queso y tomate seco.', a:[] },
    { n:'Tortitas con miel y nata', p:'5,90', d:'Tortitas americanas de tres pisos servidas con nata y miel.', a:[] },
    { n:'Desayuno vegano', p:'7,20', d:'Café y tostada de pan de cereales con lechuga, tomate, láminas de aguacate y tofu.', a:[], t:['vegano'] },
    { n:'Desayuno sin gluten dulce', p:'6,35', d:'Café y fajita de maíz (sin gluten) rellena de frutos secos, miel y plátano.', a:[], t:['singluten'] },
    { n:'Desayuno sin gluten salado', p:'6,70', d:'Café y fajita de maíz (sin gluten) con aguacate, huevos revueltos, queso y tomate seco.', a:[], t:['singluten'] },
    { n:'Croissant relleno', p:'4,90', d:'Croissant caliente relleno de jamón York y queso.', a:[] },
    { n:'Croissant relleno especial', p:'5,20', d:'Croissant caliente relleno de jamón serrano y queso.', a:[] },
    { n:'Sándwich mixto', p:'4,90', d:'Sándwich de jamón York y queso.', a:[] },
    { n:'Sándwich jamón serrano y queso', p:'5,40', d:'Sándwich de jamón serrano y queso.', a:[] },
    { n:'Batido de proteína AMIX', p:'5,50', d:'Batido AMIX alto en proteína. Sabores: chocolate, vainilla, tarta de queso y fresa. Elige entre leche de soja, almendra, entera, sin lactosa o agua. Suplemento de creatina, +1 €.', a:[], foto:'batido-amix' }
  ]},
  { id:'tostadas', carta:'desayunos', n:'Tostadas', foto:'', d:'Entera o media.', platos:[
    { n:'Tostada pan normal', p:'1,45', p2:'1,40', e2:'1/2 tostada', a:[] },
    { n:'Tostada pan especial', p:'1,80', p2:'1,75', e2:'1/2 tostada', d:'Pueblo, centeno o avena.', a:[] },
    { n:'Tostada pan integral', p:'1,70', p2:'1,65', e2:'1/2 tostada', a:[] },
    { n:'Tostada pan sin gluten', p:'2,60', a:[], t:['singluten'] },
    { n:'Tostada pan de molde', p:'1,45', p2:'1,40', e2:'1/2 tostada', a:[] }
  ]},
  { id:'bolleria', carta:'desayunos', n:'Bollería', foto:'', d:'', platos:[
    { n:'Croissant', p:'1,80', a:[] }, { n:'Ensaimada', p:'1,80', a:[] }, { n:'Cuerno de chocolate', p:'2,30', a:[] }
  ]},
  { id:'suplementos', carta:'desayunos', n:'Suplementos', foto:'', d:'Para acompañar el café o la tostada.', platos:[
    { n:'Café tocado', p:'0,20', a:[] }, { n:'Carajillo', p:'1,00', a:[] }, { n:'Cremaet', p:'1,50', d:'Carajillo quemado.', a:[] },
    { n:'Mantequilla', p:'0,20', a:[] }, { n:'Mermelada', p:'0,25', a:[] },
    { n:'Mermelada gourmet', p:'0,80', d:'Naranja, arándanos, fresa o melocotón.', a:[] },
    { n:'Tomate', p:'0,60', a:[] }, { n:'Miel', p:'0,35', a:[] }, { n:'Aceite', p:'0,25', a:[] }
  ]},

  /* ======================= cafés ======================= */
  { id:'cafes', carta:'cafes', n:'Cafés', foto:'cafes', d:'', platos:[
    { n:'Café solo', p:'1,45', a:[] }, { n:'Café con leche', p:'2,15', a:[] },
    { n:'Expresso Gelato', p:'3,05', d:'Café con helado de vainilla.', a:[] },
    { n:'Café irlandés', p:'5,80', d:'Café con whisky y azúcar de caña quemado, servido con nata.', a:[] },
    { n:'Café escocés', p:'6,30', d:'Café con whisky y azúcar de caña quemado, servido con helado de vainilla.', a:[] },
    { n:'Capuchino', p:'2,25', d:'Con crema de leche o con nata.', a:[] },
    { n:'Americano infusión', p:'2,05', d:'Doble ración de café servido con nuestra cafetera de émbolo.', a:[] },
    { n:'Latte macchiato', p:'2,15', a:[] },
    { n:'Café Alcalalito', p:'3,05', d:'Café con nuestro toque de chocolate, leche condensada y nata.', a:[] },
    { n:'Café Alcalalote', p:'4,05', d:'Café con nuestro toque de chocolate, leche condensada, nata y licor.', a:[] },
    { n:'Bombón', p:'1,90', d:'Café con leche condensada.', a:[] },
    { n:'Bombón tentación', p:'2,25', d:'Café con dulce de leche y nata montada.', a:[] },
    { n:'Café señorial', p:'3,35', d:'Café con nuestro toque de licor de arroz Señorial de Cullera, servido con nata.', a:[] },
    { n:'Café Borja', p:'2,75', d:'Café con un toque de licor Baileys y whisky.', a:[] }
  ]},
  { id:'frappes', carta:'cafes', n:'Frappés y smoothies', foto:'', d:'Con agua o con leche (entera, soja, sin lactosa, arroz o de almendras).', platos:[
    { n:'Strawberry Split', p:'4,75', d:'Fresa y plátano.', a:[] },
    { n:'Pash’n Shoot', p:'4,75', d:'Fruta de la pasión, mango y piña.', a:[] },
    { n:'Caramel Coffee', p:'4,75', d:'Café, leche y nuestro toque de caramelo, batido y servido granizado.', a:[] },
    { n:'Dolze Inizio', p:'4,75', d:'Café, leche y nuestro toque de galletas, batido y servido granizado.', a:[] }
  ]},
  { id:'infusiones', carta:'cafes', n:'Infusiones', foto:'', d:'', platos:[
    { n:'Tila', p:'2,45', a:[] },
    { n:'Chai Masala', p:'2,45', d:'Té negro, canela, jengibre, cardamomo y clavo.', a:[] },
    { n:'English Breakfast', p:'2,45', d:'Té negro.', a:[] },
    { n:'Té negro con canela', p:'2,45', d:'Té negro y canela.', a:[] },
    { n:'China Gunpowder', p:'2,45', d:'Té verde.', a:[] },
    { n:'Té verde mango', p:'2,45', d:'Té verde, mango y pétalos de girasol.', a:[] },
    { n:'Pu Erh', p:'2,45', d:'Té rojo.', a:[] },
    { n:'Té rojo naranja limón', p:'2,45', d:'Té rojo, naranja, limón y hierba limón.', a:[] },
    { n:'China Pai Mu Tan', p:'2,45', d:'Té blanco.', a:[] },
    { n:'Rooibos floral', p:'2,45', d:'Rooibos, jackfruit, pétalos de girasol, rosas y pétalos de aciano.', a:[] },
    { n:'Noches tropicales', p:'2,45', a:[] },
    { n:'Frutas del bosque', p:'2,45', d:'Moras, hibisco, escaramujo, remolacha y rosas silvestres.', a:[] },
    { n:'Piña colada', p:'2,45', d:'Piña, coco, manzana y escaramujo.', a:[] },
    { n:'Limón y jengibre', p:'2,45', d:'Limón, hierba limón, manzana, hibisco, escaramujo y jengibre.', a:[] },
    { n:'Manzana y canela', p:'2,45', d:'Manzana, hibisco, escaramujo y canela.', a:[] },
    { n:'Frutas del Caribe', p:'2,45', d:'Papaya, mango, piña y escaramujo.', a:[] },
    { n:'Manzanilla', p:'2,45', a:[] }, { n:'Menta', p:'2,45', a:[] }
  ]},
  { id:'lattes', carta:'cafes', n:'Latte moments', foto:'', d:'', platos:[
    { n:'Chai latte', p:'2,50', a:[] }, { n:'Matcha latte', p:'2,50', a:[] }, { n:'Cúrcuma latte', p:'2,50', a:[] }, { n:'Remolacha latte', p:'2,50', a:[] }
  ]},
  { id:'tes-helados', carta:'cafes', n:'Tés helados', foto:'', d:'', platos:[
    { n:'Té negro con melocotón', p:'2,50', a:[] }, { n:'Té negro con frutos del bosque', p:'2,50', a:[] }
  ]},

  /* ======================= vinos ======================= */
  { id:'tintos', carta:'vinos', n:'Tintos', foto:'vinos', d:'Precio por botella; por copa donde se indica.', platos:[
    { n:'Dominio de Calles', p:'15,50', e:'Botella', p2:'3,30', e2:'Copa', d:'Garnacha / Syrah · Crianza · Valencia.', a:[] },
    { n:'Venta del Puerto Nº12', p:'19,00', e:'Botella', d:'Tempranillo / Cabernet · Crianza · Valencia.', a:[] },
    { n:'Nodus', p:'17,50', e:'Botella', p2:'3,80', e2:'Copa', d:'Bobal · Crianza · Utiel-Requena.', a:[] },
    { n:'Viña Amezqueta', p:'15,50', e:'Botella', p2:'3,30', e2:'Copa', d:'Tempranillo · Crianza · Rioja.', a:[] },
    { n:'Viña Pomal', p:'17,50', e:'Botella', d:'Tempranillo · Crianza · Rioja.', a:[] },
    { n:'Vega Mazcán', p:'16,50', e:'Botella', p2:'3,50', e2:'Copa', d:'Tinta fina · Roble · Ribera del Duero.', a:[] },
    { n:'Cantovera', p:'19,50', e:'Botella', d:'Tinta fina · 9 meses · Ribera del Duero.', a:[] },
    { n:'Pago de Capellanes', p:'35,00', e:'Botella', d:'Tinta fina · Crianza · Ribera del Duero.', a:[] }
  ]},
  { id:'blancos', carta:'vinos', n:'Blancos', foto:'', d:'Precio por botella; por copa donde se indica.', platos:[
    { n:'Nuviana', p:'13,50', e:'Botella', p2:'2,90', e2:'Copa', d:'Chardonnay · V. Cinca.', a:[] },
    { n:'Di Wine', p:'13,50', e:'Botella', p2:'2,90', e2:'Copa', d:'Verdejo · Rueda.', a:[] },
    { n:'Dominio de Calles', p:'15,50', e:'Botella', p2:'3,30', e2:'Copa', d:'Verdejo afrutado · Valencia.', a:[] },
    { n:'Lamua', p:'16,50', e:'Botella', d:'Sauvignon blanc · Valencia.', a:[] },
    { n:'Lagares', p:'17,50', e:'Botella', d:'Verdil · Valencia.', a:[] },
    { n:'Beio', p:'18,00', e:'Botella', d:'Godello · Bierzo.', a:[] },
    { n:'Pepito Grillo', p:'19,00', e:'Botella', d:'Godello / Albariño · Ribeiro.', a:[] },
    { n:'Uxiña', p:'22,50', e:'Botella', d:'Albariño · Utiel-Requena.', a:[] }
  ]},
  { id:'rosados', carta:'vinos', n:'Rosado', foto:'', d:'', platos:[
    { n:'Laderas de Unx', p:'13,50', e:'Botella', p2:'2,90', e2:'Copa', d:'Garnacha · Navarra.', a:[] }
  ]},
  { id:'espumosos', carta:'vinos', n:'Espumosos', foto:'', d:'Precio por botella.', platos:[
    { n:'Prima Vides', p:'16,00', e:'Botella', d:'Cava Brut especial.', a:[] },
    { n:'Vegamar Rosé', p:'17,50', e:'Botella', d:'Cava Brut Nature Rosé.', a:[] },
    { n:'Insomnie', p:'45,00', e:'Botella', d:'Champagne Brut Edición Limitada.', a:[] }
  ]},
  { id:'vermouth', carta:'vinos', n:'Vermouth', foto:'', d:'Precio por copa.', platos:[
    { n:'Vittore rosso', p:'3,15', e:'Copa', d:'Vermouth rosso.', a:[] },
    { n:'Vittore bianco', p:'3,15', e:'Copa', d:'Vermouth bianco.', a:[] }
  ]},

  /* ======================= cervezas ======================= */
  { id:'barril', carta:'cervezas', n:'De barril', foto:'cervezas', d:'', platos:[
    { n:'Alhambra Especial', p:'2,65', e:'Doble', p2:'3,50', e2:'Pinta', d:'Aroma de perfil seco con suaves notas afrutadas y un reflejo a levadura. En boca, amargor suave, con cuerpo y muy equilibrada. ABV 5,4 · IBU 23.', a:[] }
  ]},
  { id:'botella', carta:'cervezas', n:'En botella', foto:'', d:'', platos:[
    { n:'Magna de San Miguel', p:'2,75', e:'33 cl', d:'Perfil aromático muy equilibrado, con frutas blancas y maduras, lúpulo fresco y malta tostada. En boca tiene cuerpo, amargor moderado y textura sedosa. ABV 5,7 · IBU 26,5.', a:[] },
    { n:'San Miguel Especial', p:'2,65', e:'33 cl', d:'Delicados aromas a frutas blancas, plátano y manzana, con un suave toque a pan blanco. Cuerpo en equilibrio con un amargor moderado y fondo seco. ABV 5,4 · IBU 27.', a:[] },
    { n:'Budweiser', p:'2,85', e:'33 cl', d:'Lager de perfil ligeramente afrutado, con aromas a grano tostado y caramelo. Ligera de cuerpo, de amargor bajo y muy refrescante. ABV 4,8 · IBU 10.', a:[] },
    { n:'Stella Artois', p:'2,85', e:'33 cl', d:'Perfil aromático equilibrado, con notas a frutas blancas y cereal sobre el aroma herbal del lúpulo. Suave, ligera de amargor y refrescante. ABV 5,0 · IBU 19.', a:[] },
    { n:'Corona', p:'3,00', e:'35,5 cl', d:'Aromas ligeramente afrutados. En boca es ligeramente dulce, con recuerdos a cereal y un amargor limpio y ligero. Fresca y muy fácil de beber. ABV 4,5 · IBU 18.', a:[] },
    { n:'Alhambra Radler', p:'2,75', e:'35,5 cl', d:'Fresca y elegante, con destacadas notas cítricas a limón y recuerdos herbales y especiados. Suave, de cuerpo ligero, con equilibrio de acidez y dulzor. ABV 3,0 · IBU 12,5.', a:[] },
    { n:'San Miguel Gluten Free', p:'3,00', e:'35,5 cl', d:'Delicados aromas a frutas blancas, plátano y manzana, con un suave toque a pan blanco. Cuerpo en equilibrio con un amargor moderado y fondo seco. ABV 5,4 · IBU 27.', a:[], t:['singluten'] },
    { n:'Alhambra Reserva Citra IPA', p:'3,60', e:'35,5 cl', d:'Perfil lupulado y fresco, con notas resinosas, cítricas y frutales. De amargor moderado, ligeramente persistente, y cuerpo algo ligero. ABV 6,5 · IBU 32.', a:[] },
    { n:'Alhambra Reserva 1925', p:'3,00', e:'33 cl', d:'Compleja en nariz: lúpulo floral y fresco, plátano y manzana roja, con tostados y caramelo de las maltas. Muy equilibrada, con cuerpo, plena y aterciopelada. ABV 6,4 · IBU 23.', a:[] },
    { n:'Alhambra Reserva Roja', p:'3,25', e:'33 cl', d:'Aroma complejo de cereal tostado y notas afrutadas intensas. Amargor pronunciado pero fino, textura plena y agradable persistencia amarga. ABV 7,2 · IBU 27.', a:[] },
    { n:'San Miguel Selecta', p:'2,90', e:'33 cl', d:'Fruta fresca mezclada con los tostados suaves de la malta. Amargor pronunciado, sensación plena y equilibrada, con recuerdos a malta. ABV 6,2 · IBU 32.', a:[] },
    { n:'Leffe Blonde', p:'3,15', e:'33 cl', d:'De notable intensidad aromática, con toques especiados a clavo y afrutados de plátano y frutas maduras. Amargor moderado, punto dulce y final seco. ABV 6,6 · IBU 21,5.', a:[] },
    { n:'Franziskaner Naturtrüb', p:'3,15', e:'50 cl', d:'Marcado carácter especiado a clavo, con intenso aroma a plátano y ligeras notas de caramelo y cereal tostado. Ligera, con toques de acidez y dulzor, muy refrescante. ABV 5,0 · IBU 12.', a:[] }
  ]},
  { id:'sin-alcohol', carta:'cervezas', n:'Sin alcohol', foto:'', d:'', platos:[
    { n:'San Miguel Magna Tostada 0,0', p:'2,75', e:'33 cl', d:'Intenso carácter maltoso, a mosto, caramelo y cereales tostados, con aromas herbales de lúpulo. Ligera de cuerpo y amargor, con final ligeramente dulce. ABV 0,0 · IBU 18.', a:[] },
    { n:'San Miguel 0,0', p:'2,75', e:'33 cl', d:'Intenso carácter maltoso, a mosto, caramelo y cereales tostados, con aromas herbales de lúpulo. Ligera de cuerpo y amargor, con final ligeramente dulce. ABV 0,0 · IBU 22.', a:[] }
  ]},

  /* ======================= cócteles ======================= */
  { id:'cocteles', carta:'cocteles', n:'Cócteles', foto:'cocteles', d:'', platos:[
    { n:'Alcalá Spritz', p:'5,00', d:'¡Nuestro aperitivo de la casa! Select aperitivo, soda y cava.', a:[] },
    { n:'Aperol Spritz', p:'6,00', d:'¡El aperitivo perfecto! Aperol, soda y cava.', a:[] },
    { n:'Mojito classic', p:'7,00', d:'Ron Plantation 3 Stars, lima, hierbabuena, azúcar líquido y refresco.', a:[] },
    { n:'Mojito Le Fruit', p:'8,00', d:'¡Elige tu sabor! Fresa, mango, maracuyá, piña o coco.', a:[] },
    { n:'Margarita Frozen', p:'7,00', d:'Tequila, triple sec y lima. Sabores: fresa, mango, maracuyá, piña o coco.', a:[] },
    { n:'Daiquiri Frozen', p:'7,00', d:'Ron Plantation 3 Stars, azúcar y lima. Sabores: fresa, mango, maracuyá, piña o coco.', a:[] },
    { n:'Bloody Mary', p:'5,50', d:'Vodka, zumo de tomate, sal, pimienta, limón y apio.', a:[] },
    { n:'Piña Colada', p:'7,00', d:'Ron Plantation 3 Stars, piña y coco.', a:[] },
    { n:'San Francisco', p:'4,25', d:'Zumo de naranja, zumo de piña, zumo de melocotón y granadina.', a:[] },
    { n:'San Francisco Premium', p:'5,50', d:'Ginebra, Licor 43, zumo de naranja, zumo de piña, zumo de melocotón y granadina.', a:[] },
    { n:'Smoothie Le Fruit', p:'5,00', d:'Vainilla, leche, Le Fruit y muesli.', a:[] },
    { n:'Agua de Valencia', p:'8,50', e:'1/2 litro', p2:'13,00', e2:'1 litro', d:'Gin, whisky, Licor 43, zumo de naranja y cava.', a:[] }
  ]}
];
