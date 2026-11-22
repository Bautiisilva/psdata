/* psData · Idioma (Español / English)
   El sitio está escrito en español. Si el usuario elige inglés, este archivo
   traduce lo que aparece en pantalla (textos, títulos, avisos) sin tocar los datos
   (nombres de pilotos, pistas, tipos de kart). La elección se guarda en el navegador. */
(function () {
  var LANG = 'es';
  try { LANG = localStorage.getItem('psdata-lang') || 'es'; } catch (e) {}
  window.LANG = LANG;

  var FLAGS = {
    es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.3" fill="#F6B40E" stroke="#85340A" stroke-width=".4"/></svg>',
    en: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#B22234"/><g fill="#fff"><rect y="1.54" width="30" height="1.54"/><rect y="4.62" width="30" height="1.54"/><rect y="7.69" width="30" height="1.54"/><rect y="10.77" width="30" height="1.54"/><rect y="13.85" width="30" height="1.54"/><rect y="16.92" width="30" height="1.54"/></g><rect width="13" height="10.77" fill="#3C3B6E"/><g fill="#fff"><circle cx="2.2" cy="2" r=".55"/><circle cx="5.4" cy="2" r=".55"/><circle cx="8.6" cy="2" r=".55"/><circle cx="11" cy="2" r=".55"/><circle cx="3.8" cy="4.2" r=".55"/><circle cx="7" cy="4.2" r=".55"/><circle cx="10.2" cy="4.2" r=".55"/><circle cx="2.2" cy="6.4" r=".55"/><circle cx="5.4" cy="6.4" r=".55"/><circle cx="8.6" cy="6.4" r=".55"/><circle cx="11" cy="6.4" r=".55"/><circle cx="3.8" cy="8.6" r=".55"/><circle cx="7" cy="8.6" r=".55"/><circle cx="10.2" cy="8.6" r=".55"/></g></svg>'
  };

  function addSwitch() {
    var h = document.querySelector('header');
    if (!h || h.querySelector('.lang')) return;
    var html = '<div class="lang" role="group" aria-label="Idioma / Language">';
    ['es', 'en'].forEach(function (k) {
      html += '<button type="button" data-l="' + k + '" aria-pressed="' + (k === LANG) + '" title="' + (k === 'es' ? 'Español' : 'English') + '">' + FLAGS[k] + '<span>' + k.toUpperCase() + '</span></button>';
    });
    h.insertAdjacentHTML('beforeend', html + '</div>');
    h.querySelector('.lang').addEventListener('click', function (e) {
      var b = e.target.closest('[data-l]');
      if (!b || b.dataset.l === LANG) return;
      try { localStorage.setItem('psdata-lang', b.dataset.l); } catch (err) {}
      location.reload();
    });
  }
  addSwitch();
  if (LANG !== 'en') { window.TR = function (s) { return s; }; return; }

  document.documentElement.lang = 'en';

  /* Textos exactos */
  var D = {
    'Telemetría y datos de karting': 'Karting telemetry and data',
    'Inicio': 'Home', 'Análisis': 'Analysis', 'Sesiones': 'Sessions',
    'Entendé cada vuelta de tu kart': 'Understand every lap of your kart',
    'Análisis de vueltas': 'Lap analysis',
    'Compará tu mejor vuelta con la de otro piloto y encontrá en qué curva ganás o perdés décimas.': 'Compare your best lap with another driver’s and find in which corner you gain or lose tenths.',
    'Abrir análisis': 'Open analysis',
    'Registro de sesiones': 'Session log',
    'Cargá cada tanda con piloto, fecha, pista, kart, motor y el archivo del logger.': 'Log every run with driver, date, track, kart, engine and the logger file.',
    'Cargar sesiones': 'Log sessions',
    'Cada piloto entra con su usuario y ve todas sus tandas, ordenadas por día.': 'Each driver signs in and sees all their runs, sorted by day.',
    'Ingresar': 'Sign in',
    'Mejores vueltas de cada día y récords de cada pista, separados por tipo de kart.': 'Best laps of each day and records for each track, split by kart class.',
    'Ver ranking': 'View ranking',
    'Los datos que ves son de ejemplo. psData todavía no lee archivos reales de loggers.': 'The data shown is sample data.',
    'Principal': 'Main', 'Trazado de la pista': 'Track layout', 'Qué podés hacer': 'What you can do',
    'psData · Telemetría y datos de karting': 'psData · Karting telemetry and data',
    'psData convierte los datos de tu logger en gráficos claros: dónde frenás, dónde perdés tiempo y contra quién te comparás. Funciona con exportaciones de MyChron y AiM.': 'psData turns your logger data into clear charts: where you brake, where you lose time and who you compare against. Works with MyChron and AiM exports.',
    'Abrí el CSV de la MyChron y mové el cursor sobre los datos: el punto en la pista muestra dónde estaba el kart en cada momento.': 'Open the MyChron CSV and move the cursor over the data: the dot on the track shows where the kart was at each moment.',
    'GPS de la tanda': 'Run GPS', 'Abrir CSV': 'Open CSV', 'Vuelta': 'Lap', 'Dato': 'Channel',
    'más lento': 'slower', 'más rápido': 'faster',
    'Abrí un CSV exportado de la MyChron. Si ingresás con tu usuario (en Drivers), también podés elegir tus sesiones guardadas.': 'Open a CSV exported from the MyChron. If you sign in (in Drivers), you can also pick your saved sessions.',
    'Elegí una sesión guardada con su CSV, o abrí un CSV de la compu.': 'Pick a saved session with its CSV, or open a CSV from your computer.',
    'Comparación de pilotos': 'Driver comparison',
    '(datos de ejemplo · ingresá en Drivers para comparar tus sesiones)': '(sample data · sign in on Drivers to compare your sessions)',
    'Deslizá sobre el gráfico para recorrer la vuelta': 'Slide over the chart to go through the lap',
    'Con tu usuario, la comparación usa las sesiones guardadas con su CSV. Sin ingresar, se muestran datos de ejemplo.': 'When signed in, the comparison uses saved sessions with their CSV. Otherwise sample data is shown.',
    'Sesión guardada': 'Saved session', 'Trazado GPS de la vuelta': 'GPS trace of the lap',
    'Piloto A': 'Driver A', 'Piloto B': 'Driver B', 'Piloto': 'Driver', 'Sesión': 'Session',
    '(fecha · tanda · vuelta · pista)': '(date · run · lap · track)',
    'Velocidad y diferencia de tiempo por metro': 'Speed and time difference per meter',
    'Análisis de vueltas de karting · psData': 'Karting lap analysis · psData',
    'Mejores vueltas de cada día y récords de cada pista. Se actualiza solo cada vez que se carga una sesión con su mejor vuelta.': 'Best laps of each day and records for each track. Updates automatically whenever a session with its best lap is logged.',
    'Ingresá para ver el ranking': 'Sign in to see the ranking',
    'Usá tu usuario y contraseña de psData.': 'Use your psData username and password.',
    'Usuario': 'Username', 'Contraseña': 'Password', 'Entrar': 'Sign in',
    'Los tiempos son los que carga el administrador en Sesiones.': 'Times are the ones the admin logs in Sessions.',
    'Ranking de pilotos de karting · psData': 'Karting driver ranking · psData',
    'Ranking del campeonato': 'Championship ranking',
    'Cargá cada salida a pista con su piloto, fecha, hora, pista, kart y motor. En Drivers sessions ves cada piloto con todas sus tandas.': 'Log every track outing with driver, date, time, track, kart and engine. In Drivers sessions you see each driver with all their runs.',
    'Ingresá como administrador': 'Sign in as admin',
    'La carga de sesiones es solo para el administrador. Los pilotos ven sus tandas en Drivers.': 'Logging sessions is admin only. Drivers see their runs in Drivers.',
    'Cada sesión se guarda automáticamente al tocar «Guardar sesión» y aparece en el perfil del piloto en Drivers.': 'Each session is saved automatically when you tap “Save session” and shows up in the driver’s profile in Drivers.',
    'Registro de sesiones de karting · psData': 'Karting session log · psData',
    'Cada piloto entra con su usuario y ve todas sus tandas, ordenadas por día. Se actualiza solo cada vez que se carga una sesión con su nombre.': 'Each driver signs in and sees all their runs, sorted by day. Updates automatically whenever a session with their name is logged.',
    'Ingresá a tu perfil': 'Sign in to your profile',
    'Usá el usuario y la contraseña que te dio tu entrenador.': 'Use the username and password your coach gave you.',
    '¿Te olvidaste la contraseña? Pedile una nueva a tu entrenador.': 'Forgot your password? Ask your coach for a new one.',
    'Elegí una tanda de los datos guardados: el Coach analiza la telemetría como un ingeniero y deja todo lo que hay que mejorar en Observaciones.': 'Pick a run from the saved data: the Coach analyzes the telemetry like an engineer and lists everything to improve in Notes.',
    'Ingresá para ver el Coach': 'Sign in to see the Coach',
    'El análisis es automático y sale de los datos del CSV: usalo como guía junto con lo que ves en la pista.': 'The analysis is automatic and comes from the CSV data: use it as a guide together with what you see on track.',
    'Elegí una sesión…': 'Pick a session…',
    'Mejor vuelta de cada sesión:': 'Best lap of each session:', 'contra': 'vs',
    'Mapa por sectores: cada sector va del color del piloto que fue más rápido ahí': 'Sector map: each sector takes the color of the driver who was faster there',
    'Sector': 'Sector', 'Dif.': 'Gap',
    'Velocidad de los dos pilotos y diferencia de tiempo': 'Speed of both drivers and time difference',
    'Mapa por sectores': 'Sector map',
    'Conectado como': 'Signed in as', 'Salir': 'Sign out',
    'Pista': 'Track', 'Tipo de kart': 'Kart class', 'Todas': 'All',
    'Ranking del día': 'Ranking of the day', 'Mejor vuelta': 'Best lap', 'Tandas': 'Runs',
    'Récord': 'Record', 'Récord de pista': 'Track record', 'Mejor personal': 'Personal best', 'Récords globales': 'All-time records',
    'La mejor vuelta de cada piloto en esta pista, separada por tipo de kart. Si alguien la baja, se actualiza sola.': 'Each driver’s best lap on this track, split by kart class. If someone beats it, it updates automatically.',
    'Fecha': 'Date', 'Día': 'Day', 'Sin días con tiempos': 'No days with times',
    'Todavía no hay tiempos cargados acá.': 'No times logged here yet.',
    'Nueva sesión': 'New session', '¿Quisiste decir': 'Did you mean', 'No, es otro piloto': 'No, it’s another driver',
    'Hora de la sesión': 'Session time', 'Elegí la pista': 'Pick the track', 'Número de kart': 'Kart number',
    'Número de tanda': 'Run number', 'Elegí': 'Pick', 'Elegí el tipo de kart': 'Pick the kart class',
    'Tipo de motor': 'Engine', '(se completa sola con el CSV)': '(filled in from the CSV)',
    'Archivo del logger': 'Logger file', '(opcional)': '(optional)',
    'Tocá para elegir el archivo exportado (MyChron, AiM…)': 'Tap to choose the exported file (MyChron, AiM…)',
    'Guardar sesión': 'Save session', 'Subiendo archivo…': 'Uploading file…',
    'Sesiones guardadas': 'Saved sessions', 'Todos los pilotos': 'All drivers', 'Exportar CSV': 'Export CSV',
    'Hora': 'Time', 'Tanda': 'Run', 'Kart': 'Kart', 'Tipo': 'Class', 'Archivo': 'File', 'Motor': 'Engine',
    '📎 Descargar': '📎 Download', '📎 Descargar archivo': '📎 Download file', 'Abriendo…': 'Opening…',
    'sin cuenta': 'no account', 'Última': 'Last', 'Kart habitual': 'Usual kart',
    'Elegí de la lista o escribí uno nuevo': 'Pick from the list or type a new one',
    'Elegí o escribí': 'Pick or type', 'Filtrar por piloto': 'Filter by driver',
    'Este nombre no tiene cuenta en Drivers': 'This name has no account in Drivers',
    'Piloto nuevo sin cuenta: se guarda igual y después le creás la cuenta en Drivers.': 'New driver without an account: it is saved anyway and you can create the account later in Drivers.',
    'Sin cuenta todavía: creásela en Drivers con este mismo nombre para que vea sus tandas.': 'No account yet: create one in Drivers with this exact name so they can see their runs.',
    '✓ Tiene cuenta: la sesión aparece en su perfil.': '✓ Has an account: the session shows up in their profile.',
    'Este archivo no es un CSV: no puedo leer los tiempos. Exportalo como CSV desde Race Studio 3 o escribí la mejor vuelta a mano.': 'This file is not a CSV: lap times can’t be read. Export it as CSV from Race Studio 3 or type the best lap by hand.',
    'No encontré tiempos de vuelta en este CSV. Escribí la mejor vuelta a mano.': 'No lap times found in this CSV. Type the best lap by hand.',
    'Revisá el nombre del piloto antes de guardar.': 'Check the driver’s name before saving.',
    'Todavía no cargaste ninguna sesión.': 'You haven’t logged any session yet.',
    'No hay sesiones de este piloto.': 'No sessions for this driver.',
    'Todavía no hay sesiones de este piloto.': 'No sessions for this driver yet.',
    'Cuando cargues sesiones, acá aparece cada piloto con todas sus tandas.': 'Once you log sessions, each driver shows up here with all their runs.',
    'Sincronizando con la nube…': 'Syncing with the cloud…',
    'Sesión borrada.': 'Session deleted.', 'Borrando archivo…': 'Deleting file…',
    'Nuevo driver': 'New driver', 'Nombre del piloto': 'Driver name', 'Generar': 'Generate', 'Crear cuenta': 'Create account',
    'Creando cuenta…': 'Creating account…', 'Entrando…': 'Signing in…',
    'Usuario o contraseña incorrectos.': 'Wrong username or password.',
    'No hay conexión. Probá de nuevo.': 'No connection. Try again.',
    'Con sesiones pero sin cuenta:': 'With sessions but no account:',
    'Todavía no creaste ninguna cuenta.': 'You haven’t created any account yet.',
    'Contraseña': 'Password', 'tandas': 'runs', 'tanda': 'run', 'día en pista': 'day on track', 'días en pista': 'days on track',
    'kart habitual': 'usual kart', 'mejor vuelta': 'best lap', 'última': 'last',
    'Última sesión:': 'Last session:', '· Pista habitual:': '· Usual track:', '· Tipo:': '· Class:', '· Motor:': '· Engine:',
    'Perfil': 'Profile', 'Tocá un driver de la lista para ver su perfil tal como lo ve él.': 'Tap a driver in the list to see their profile as they see it.',
    'Como lo cargás en Sesiones': 'As you log it in Sessions', 'Ej: tomas': 'e.g. tomas', 'Ej: 17': 'e.g. 17',
    'Ej: 49.123 o 1:05.300': 'e.g. 49.123 or 1:05.300', 'Mínimo 6 caracteres': 'At least 6 characters',
    'De 3 a 30 letras, números, punto, guion o guion bajo': '3 to 30 letters, numbers, dot, dash or underscore',
    'Solo para el administrador': 'Admin only', 'Tus tandas están en tu perfil.': 'Your runs are in your profile.', 'Ir a Drivers': 'Go to Drivers',
    'Datos': 'Data', 'Sesiones guardadas con su CSV, por piloto y día.': 'Saved sessions with their CSV, by driver and day.',
    'Comparar con': 'Compare with', 'Solo sus propias vueltas': 'Only their own laps',
    'vuelta ideal': 'ideal lap', 'para ganar': 'to gain', 'constancia': 'consistency',
    'Mapa de curvas': 'Corner map', 'Cada curva va del color de cuánto tiempo se pierde ahí.': 'Each corner is colored by how much time is lost there.',
    'sin pérdida': 'no loss', 'pierde algo': 'loses some', 'pierde más': 'loses more',
    'Vueltas': 'Laps', 'Tiempo': 'Time', 'mejor': 'best', 'fuera de ritmo': 'off pace',
    '📄 Observaciones': '📄 Notes', 'Descargar': 'Download', 'Analizando la telemetría…': 'Analyzing the telemetry…',
    'Cargando sesiones…': 'Loading sessions…', 'Cargando datos…': 'Loading data…', 'Bajando los CSV…': 'Downloading the CSVs…',
    '⭐ Lo que hiciste bien': '⭐ What you did well',
    '🎯 Para mejorar (lo más importante)': '🎯 To improve (most important)',
    '📝 Después, cuando lo anterior te salga': '📝 Next, once the above works',
    '🔁 ¿Fuiste parejo?': '🔁 Were you consistent?',
    '🛠️ Para el entrenador (datos técnicos)': '🛠️ For the coach (technical data)',
    'Tus vueltas son muy parecidas entre sí. ¡Eso es ser muy parejo! 👏': 'Your laps are very similar to each other. That’s being very consistent! 👏',
    'Sí, ¡muy parejo! Tus vueltas casi no cambian.': 'Yes, very consistent! Your laps barely change.',
    '¡Muy bien! No hay errores grandes: tus vueltas son muy parecidas. Para seguir bajando el tiempo, mirá cómo lo hace un piloto más rápido.': 'Great job! No big mistakes: your laps are very similar. To keep going faster, watch how a quicker driver does it.',
    'Tus vueltas cambian mucho entre una y otra. 👉 Elegí un lugar fijo para frenar en cada curva (un cono, una mancha, el cordón) y frená siempre ahí. Así cada vuelta te sale como la mejor.': 'Your laps change a lot from one to the next. 👉 Pick a fixed spot to brake at each corner (a cone, a mark, the curb) and always brake there. That way every lap comes out like your best.',
    'Curvas detectadas en la mejor vuelta (donde la velocidad baja y vuelve a subir). Vueltas más de 7% lentas no cuentan para los promedios.': 'Corners detected on the best lap (where speed drops and rises again). Laps more than 7% slower are left out of the averages.',
    'Coach · psData': 'Coach · psData', 'Drivers · psData': 'Drivers · psData',
    'Todavía no hay sesiones con CSV. Cuando cargues una en Sesiones con el archivo de la MyChron, acá aparece con sus observaciones.': 'No sessions with a CSV yet. Once you log one in Sessions with the MyChron file, it shows up here with its notes.',
    'Cuando cargues sesiones con su CSV de la MyChron (en Sesiones), acá vas a poder comparar dos pilotos, o dos tandas del mismo piloto, sector por sector.': 'Once you log sessions with their MyChron CSV (in Sessions), you can compare two drivers, or two runs of the same driver, sector by sector.',
    'Ojo: son pistas distintas.': 'Careful: these are different tracks.',
    'Para usar cuentas de pilotos hace falta conectar la base de datos (pasos en LEEME.txt).': 'Driver accounts need the database connected (steps in LEEME.txt).',
    'Mejores vueltas de cada día y récords de cada pista. Se actualiza solo cada vez que se carga una sesión con su mejor vuelta': 'Best laps of each day and records for each track.',
    '🎯 Para mejorar': '🎯 To improve', '💪 ¡Vos podés!': '💪 You can do it!',
    'frená acá': 'brake here', '✓ frená acá': '✓ brake here', 'frená siempre acá': 'always brake here', '¡a fondo!': 'full throttle!',
    '1 afuera → 2 adentro → 3 afuera': '1 outside → 2 inside → 3 outside',
    'Camino por la curva: de afuera hacia adentro y otra vez afuera': 'Line through the corner: outside to inside and back outside',
    'Frená más cerca de la curva': 'Brake closer to the corner', 'Frená un poco antes': 'Brake a bit earlier',
    'A fondo al salir de la curva': 'Full throttle out of the corner', 'Elegí una marca para frenar siempre en el mismo lugar': 'Pick a mark to always brake at the same spot',
    'Vuelta teórica': 'Theoretical lap', 'Teórica': 'Theoretical', 'vuelta teórica': 'theoretical lap', 'vueltas': 'laps',
    'Juntando los mejores microsectores de todas las vueltas de una tanda: la vuelta más rápida que el piloto ya hizo por partes.': 'Putting together the best microsectors from every lap of a run: the fastest lap the driver has already done in pieces.',
    'Microsector': 'Microsector', 'Mejor tiempo': 'Best time', 'En la vuelta': 'On lap', 'En su mejor vuelta': 'On their best lap', 'Total': 'Total',
    'Calculando con el CSV…': 'Calculating from the CSV…',
    'Cuando guardes una sesión con el CSV de la MyChron, acá aparece su vuelta teórica.': 'Once you save a session with the MyChron CSV, its theoretical lap shows up here.',
    'Este CSV no trae vueltas completas para calcular la vuelta teórica.': 'This CSV has no complete laps to calculate the theoretical lap.',
    'Microsectores configurados en la MyChron.': 'Microsectors set up on the MyChron.',
    'El CSV no trae los splits de la MyChron: la vuelta se dividió en 10 tramos iguales.': 'The CSV doesn’t include the MyChron splits: the lap was split into 10 equal parts.',
    'El CSV no trae microsectores ni GPS: la vuelta teórica es la mejor vuelta.': 'The CSV has no microsectors or GPS: the theoretical lap is the best lap.',
    'Ingresá con tu usuario (en Drivers) para ver la vuelta teórica de tus sesiones.': 'Sign in (in Drivers) to see the theoretical lap of your sessions.',
    'Velocidad GPS (km/h)': 'GPS speed (km/h)', 'Altitud (m)': 'Altitude (m)', 'Satélites GPS': 'GPS satellites', 'Distancia (m)': 'Distance (m)',
    'Elegí el piloto': 'Pick the driver', '➕ Nuevo piloto…': '➕ New driver…', 'Nombre del piloto nuevo': 'New driver’s name',
    'Escribí el nombre del piloto nuevo.': 'Type the new driver’s name.', 'Elegí el piloto.': 'Pick the driver.',
    'Editar sesión': 'Edit session', 'Guardar cambios': 'Save changes', 'Cancelar': 'Cancel', 'Guardando…': 'Saving…', 'Editar': 'Edit',
    'El archivo de esta sesión se mantiene: no hace falta volver a subirlo.': 'This session’s file is kept: no need to upload it again.',
    'Práctica': 'Practice', 'Carrera': 'Race', 'Elegí el motor': 'Pick the engine',
    'Neumáticos': 'Tyres', 'Condición de pista': 'Track condition', 'Slicks': 'Slicks', 'Wets': 'Wets', 'Seco': 'Dry', 'Mojado': 'Wet', 'Húmedo': 'Damp',
    'Ninguna': 'None',
    '📂 Abrir otro CSV…': '📂 Open another CSV…', 'Esta tanda': 'This run', 'Sesiones guardadas': 'Saved sessions',
    'Ese CSV no tiene vueltas completas para comparar.': 'That CSV has no complete laps to compare.',
    'Ojo: las dos vueltas tienen distinto largo. ¿Son de la misma pista?': 'Careful: the two laps have different lengths. Are they from the same track?',
    'Ordenar o agrupar': 'Sort or group', 'Orden de carga': 'Order added', 'Por fecha y hora': 'By date and time', 'Por piloto': 'By driver',
    'Ranking': 'Ranking', 'Drivers': 'Drivers', 'Coach': 'Coach', 'Drivers sessions': 'Drivers sessions'
  };

  var DIAS = { lunes: 'Monday', martes: 'Tuesday', 'miércoles': 'Wednesday', jueves: 'Thursday', viernes: 'Friday', 'sábado': 'Saturday', domingo: 'Sunday' };
  var MES = { enero: 'January', febrero: 'February', marzo: 'March', abril: 'April', mayo: 'May', junio: 'June', julio: 'July', agosto: 'August', septiembre: 'September', octubre: 'October', noviembre: 'November', diciembre: 'December' };
  var dec = function (x) { return x.replace(',', '.'); };
  var pl = function (n, s, p) { return n === '1' ? s : p; };

  /* Frases con números o nombres (se aplican en orden) */
  var R = [
    [/\b(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo) (\d{1,2}) de (\w+) de (\d{4})/g, function (m, d, n, me, y) { return DIAS[d.toLowerCase()] + ', ' + (MES[me] || me) + ' ' + n + ', ' + y; }],
    [/^Vuelta (\d+) · ([\d:.]+) \(mejor\)$/, 'Lap $1 · $2 (best)'],
    [/^Vuelta (\d+) · /, 'Lap $1 · '],
    [/^Toda la sesión$/, 'Whole session'],
    [/ · (\d+) vueltas? · (\d+) puntos de GPS\. Mové el cursor sobre el gráfico \(o tocá la pista\) para ver dónde estaba el kart\./, function (m, a, b) { return ' · ' + a + ' ' + pl(a, 'lap', 'laps') + ' · ' + b + ' GPS points. Move the cursor over the chart (or tap the track) to see where the kart was.'; }],
    [/^Leyendo (.+)…$/, 'Reading $1…'],
    [/^Bajando el CSV de (.+)…$/, 'Downloading $1’s CSV…'],
    [/Diferencia de tiempo \(s\): arriba, (.+) va más rápido/, 'Time difference (s): up means $1 is faster'],
    [/Diferencia de tiempo: arriba, (.+) va adelante/, 'Time difference: up means $1 is ahead'],
    [/^Mapa de velocidad de (.+) · rojo frena, verde agua acelera$/, '$1’s speed map · red brakes, aqua accelerates'],
    [/^mejor vuelta \(V(\d+)\)$/, 'best lap (L$1)'],
    [/^vuelta (\d+)$/, 'lap $1'],
    [/\(vuelta (\d+), /g, '(lap $1, '],
    [/^Dif\.: positivo = (.+) más rápido en ese sector\.$/, 'Gap: positive = $1 faster in that sector.'],
    [/(.+) más rápido$/, '$1 faster'],
    [/^Vuelta$/, 'Lap'],
    [/^Guardado en la nube · (\d+) sesi(ón|ones)$/, function (m, n) { return 'Saved in the cloud · ' + n + ' ' + pl(n, 'session', 'sessions'); }],
    [/^Sin conexión con la base de datos \((.*)\)\. Las sesiones quedan en este dispositivo y se suben solas cuando vuelva la conexión\.$/, 'No connection to the database ($1). Sessions stay on this device and upload automatically when the connection is back.'],
    [/^Guardadas solo en este navegador\..*$/, 'Saved only in this browser. To keep them forever, connect the database (steps in LEEME.txt).'],
    [/^Hay (\d+) sesi(ón guardada|ones guardadas) solo en este navegador\. Ingresá como administrador y se suben solas\. No borres los datos del navegador hasta que se suban\.$/, function (m, n) { return 'There ' + pl(n, 'is ', 'are ') + n + ' ' + pl(n, 'session', 'sessions') + ' saved only in this browser. Sign in as admin and they upload automatically. Don’t clear browser data until they do.'; }],
    [/^Sesión de (.+) guardada con su archivo\.$/, '$1’s session saved with its file.'],
    [/^Sesión de (.+) guardada\.$/, '$1’s session saved.'],
    [/^Se agregó a la tabla, pero este navegador no permite guardarla\.$/, 'Added to the table, but this browser doesn’t allow saving it.'],
    [/^La mejor vuelta no se entiende\..*$/, 'The best lap can’t be read. Type it in seconds (49.123) or minutes and seconds (1:05.300).'],
    [/^El archivo pesa (.+)\. El máximo es 50 MB\.$/, 'The file is $1. The maximum is 50 MB.'],
    [/^No se pudo subir el archivo\. Revisá la conexión y probá de nuevo\. \((.*)\)$/, 'The file could not be uploaded. Check the connection and try again. ($1)'],
    [/^Para adjuntar archivos hace falta la base de datos conectada\.$/, 'Attaching files needs the database connected.'],
    [/^No se pudo borrar: no hay conexión con la base de datos\. Probá de nuevo en un rato\.$/, 'Could not delete: no connection to the database. Try again later.'],
    [/^Leído del archivo: /, 'Read from the file: '],
    [/(\d+) vueltas?, la mejor fue la (\d+)ª con ([\d:.]+)/, function (m, n, b, t) { return n + ' ' + pl(n, 'lap', 'laps') + ', best was lap ' + b + ' with ' + t; }],
    [/(\d+) vueltas?, la mejor fue la vuelta (\d+) con ([\d:.]+)/, function (m, n, b, t) { return n + ' ' + pl(n, 'lap', 'laps') + ', best was lap ' + b + ' with ' + t; }],
    [/ · fecha (\d)/g, ' · date $1'], [/ · hora (\d)/g, ' · time $1'], [/^fecha (\d)/, 'date $1'], [/^hora (\d)/, 'time $1'],
    [/ No encontré tiempos de vuelta: escribí la mejor vuelta a mano\./, ' No lap times found: type the best lap by hand.'],
    [/^Usar (.+)$/, 'Use $1'],
    [/^Tanda (\d+) · ([\d:]+)$/, 'Run $1 · $2'],
    [/^Tanda (\d+)$/, 'Run $1'],
    [/ · Tanda (\d+) · /g, ' · Run $1 · '],
    [/ · Tanda (\d+)$/, ' · Run $1'], [/ · tanda (\d+)/g, ' · run $1'], [/ · sin tanda · /g, ' · no run · '], [/ · sin pista$/, ' · no track'],
    [/^· (\d+) sesi(ón|ones)$/, function (m, n) { return '· ' + n + ' ' + pl(n, 'session', 'sessions'); }],
    [/^· (\d+) pilotos?$/, function (m, n) { return '· ' + n + ' ' + pl(n, 'driver', 'drivers'); }],
    [/^· (\d+) tandas?$/, function (m, n) { return '· ' + n + ' ' + pl(n, 'run', 'runs'); }],
    [/^(\d+) tandas?$/, function (m, n) { return n + ' ' + pl(n, 'run', 'runs'); }],
    [/^@(.+) · (\d+) tandas?$/, function (m, u, n) { return '@' + u + ' · ' + n + ' ' + pl(n, 'run', 'runs'); }],
    [/· administrador$/, '· admin'],
    [/^Actualizado a las (\d+:\d+)\. Se actualiza solo\.$/, 'Updated at $1. Updates automatically.'],
    [/^Sin conexión: mostrando lo último guardado\.$/, 'Offline: showing the last saved data.'],
    [/^Borrar sesión de (.+) del (.+)$/, 'Delete $1’s session from $2'],
    [/^Editar la sesión de (.+) del (.+)$/, 'Edit $1’s session from $2'],
    [/^Cambios guardados en la sesión de (.+)\.$/, 'Changes saved to $1’s session.'],
    [/^No se pudo guardar: (.*)$/, 'Could not save: $1'],
    [/ · sin tanda$/, ' · no run'],
    [/^Borrar la cuenta de (.+)$/, 'Delete $1’s account'],
    [/^Cuenta creada\. Pasale a (.+): usuario (.+) · contraseña (.+)$/, 'Account created. Give $1: username $2 · password $3'],
    [/^Cuenta de (.+) borrada\.$/, '$1’s account deleted.'],
    [/^Contraseña de (.+) cambiada a (.+)\.$/, '$1’s password changed to $2.'],
    [/^No se pudo (crear|cambiar|borrar): (.*)$/, function (m, v, e) { return 'Could not ' + ({ crear: 'create', cambiar: 'change', borrar: 'delete' })[v] + ': ' + e; }],
    [/^Ese usuario ya existe$/, 'That username already exists'],
    [/^Ese piloto ya tiene una cuenta$/, 'That driver already has an account'],
    [/^Comparando contra la mejor vuelta de (.+): ([\d:.]+) \((.+)\)\.$/, 'Comparing against $1’s best lap: $2 ($3).'],
    [/^No se pudo (analizar|comparar): (.*)$/, function (m, v, e) { return 'Could not ' + (v === 'analizar' ? 'analyze' : 'compare') + ': ' + e; }],
    [/^No se pudo bajar el archivo: (.*)$/, 'Could not download the file: $1'],
    [/^No se pudo calcular: (.*)$/, 'Could not calculate: $1'],
    [/ \(sugerido\)$/, ' (suggested)'],
    // Observaciones del Coach
    [/^Tu mejor vuelta fue la número (\d+): ([\d:.]+)\. ¡Ese es tu tiempo para mejorar!$/, 'Your best lap was number $1: $2. That’s the time to beat!'],
    [/^(La curva|Las curvas) ([\d, ]+) (te sale|te salen) siempre bien\. ✅$/, function (m, a, n, b) { return (a === 'La curva' ? 'Corner ' : 'Corners ') + n + ' always ' + (a === 'La curva' ? 'goes' : 'go') + ' well. ✅'; }],
    [/^Si juntás las mejores partes de todas tus vueltas, harías ([\d:.]+): ([\d,]+) segundos menos\. ¡Ya lo hiciste por partes, así que podés!$/, function (m, t, s) { return 'If you put together the best parts of all your laps, you’d do ' + t + ': ' + dec(s) + ' seconds less. You already did it in pieces, so you can!'; }],
    [/^Curva (\d+) \(mirando a (.+?)\): /, 'Corner $1 (watching $2): '],
    [/^Curva (\d+): /, 'Corner $1: '],
    [/^Curva (\d+)$/, 'Corner $1'],
    [/Frenás muy temprano: (\d+) metros \(como (\d+) karts?\) antes de lo que hace falta\./, function (m, a, k) { return 'You brake too early: ' + a + ' meters (about ' + k + ' ' + pl(k, 'kart', 'karts') + ') before you need to.'; }],
    [/Frenás muy tarde: (\d+) metros \(como (\d+) karts?\) después de lo que hace falta, y te pasás de la curva\./, function (m, a, k) { return 'You brake too late: ' + a + ' meters (about ' + k + ' ' + pl(k, 'kart', 'karts') + ') after you should, and you overshoot the corner.'; }],
    [/Entrás muy rápido y después salís lento\./, 'You go in too fast and then come out slow.'],
    [/Vas muy despacio en el medio de la curva \((\d+) km\/h menos\)\./, 'You’re too slow in the middle of the corner ($1 km/h less).'],
    [/Acelerás tarde al salir de la curva \(salís (\d+) km\/h más lento\)\./, 'You get on the throttle late on the exit (you come out $1 km/h slower).'],
    [/Perdés un poquito en toda la curva\./, 'You lose a little through the whole corner.'],
    [/👉 Esperá un poquito más antes de frenar\./, '👉 Wait a little longer before braking.'],
    [/👉 Frená un poquito antes así doblás mejor\./, '👉 Brake a little earlier so you turn better.'],
    [/👉 Entrá un poquito más despacio para poder acelerar antes\./, '👉 Go in a little slower so you can accelerate sooner.'],
    [/👉 Soltá antes el freno: el kart puede doblar más rápido\./, '👉 Release the brake earlier: the kart can turn faster.'],
    [/👉 Apenas ves la salida de la curva, ¡a fondo!/, '👉 As soon as you see the corner exit, full throttle!'],
    [/👉 Hacé la curva igual que en tu mejor vuelta: misma frenada y mismo camino\./, '👉 Take the corner like on your best lap: same braking and same line.'],
    [/ Podés ganar ([\d,]+) segundos\./, function (m, s) { return ' You can gain ' + dec(s) + ' seconds.'; }],
    [/ (.+) ahí es ([\d,]+) segundos más rápido\./, function (m, n, s) { return ' ' + n + ' is ' + dec(s) + ' seconds faster there.'; }],
    [/^Bastante parejo\. Tus vueltas cambian unos ([\d,]+) segundos\. La meta es que cambien menos de 0,25 segundos\.$/, function (m, s) { return 'Fairly consistent. Your laps vary by about ' + dec(s) + ' seconds. The goal is less than 0.25 seconds.'; }],
    [/^No mucho todavía: tus vueltas cambian unos ([\d,]+) segundos\. Primero tratá de hacer siempre la misma vuelta; la velocidad viene después\.$/, function (m, s) { return 'Not yet: your laps vary by about ' + dec(s) + ' seconds. First try to do the same lap every time; speed comes later.'; }],
    [/^Las vueltas ([\d, ]+) fueron mucho más lentas \(tráfico o un error\), así que no las tuve en cuenta\.$/, 'Laps $1 were much slower (traffic or a mistake), so I left them out.'],
    [/^Mejor vuelta ([\d:.]+) · vuelta ideal ([\d:.]+) · promedio ([\d:.]+) · desvío ([\d.]+) s\.$/, 'Best lap $1 · ideal lap $2 · average $3 · std dev $4 s.'],
    [/^Curva (\d+) \((\d+) m\): frenada a (\d+) m del vértice, entrada (\d+), mínima (\d+), salida (\d+) km\/h/, 'Corner $1 ($2 m): braking $3 m before apex, entry $4, minimum $5, exit $6 km/h'],
    [/ · resto de las vueltas /, ' · other laps '],
    [/^OBSERVACIONES · /, 'NOTES · '],
    [/ \(mejor\)$/, ' (best)'],
    [/^vuelta (\d+)$/, 'lap $1'],
    [/: vuelta (\d+) y vuelta (\d+)$/, ': lap $1 and lap $2'],
    [/\bVuelta (\d+)(?=[: ])/g, 'Lap $1'], [/ · iguales$/, ' · even'],
    [/ · Práctica(?= ·|$)/g, ' · Practice'], [/ · Carrera(?= ·|$)/g, ' · Race'], [/ · Seco(?= ·|$)/g, ' · Dry'], [/ · Mojado(?= ·|$)/g, ' · Wet'], [/ · Húmedo(?= ·|$)/g, ' · Damp'],
    [/^¡Muy bien, (.+)! 🙌 Tu mejor vuelta fue la número (\d+): ([\d:.]+)\.$/, 'Great job, $1! 🙌 Your best lap was number $2: $3.'],
    [/^Tus vueltas son casi iguales\. ¡Eso es ser muy parejo, como los grandes! 👏$/, 'Your laps are almost the same. That’s being very consistent, like the pros! 👏'],
    [/^(La curva|Las curvas) ([\d, ]+) (te sale|te salen) siempre bien\. ¡Genial! ✅$/, function (m, a, n) { return (a === 'La curva' ? 'Corner ' + n + ' always goes' : 'Corners ' + n + ' always go') + ' well. Awesome! ✅'; }],
    [/ siempre bien\. ¡Genial! ✅$/, ' always well. Awesome! ✅'],
    [/(te sale|te salen) always/, 'always'],
    [/^Si juntás las mejores partes de tus vueltas, harías ([\d:.]+)\. ¡Ya lo hiciste por partes, así que podés! ⭐$/, 'If you put together the best parts of your laps, you’d do $1. You already did it in pieces, so you can! ⭐'],
    [/frenás muy temprano \((\d+) metros, ¡como (\d+) karts?!\)\./, function (m, a, k) { return 'you brake too early (' + a + ' meters, like ' + k + ' ' + pl(k, 'kart', 'karts') + '!).'; }],
    [/👉 Animate a frenar más tarde: esperá un poquito más y frená más cerca de la curva\./, '👉 Dare to brake later: wait a little longer and brake closer to the corner.'],
    [/frenás muy tarde y te pasás de la curva\./, 'you brake too late and overshoot the corner.'],
    [/👉 Frená un poquito antes\. Así el kart dobla mejor y salís más rápido\./, '👉 Brake a little earlier. That way the kart turns better and you come out faster.'],
    [/entrás muy rápido y después salís lento\./, 'you go in too fast and then come out slow.'],
    [/👉 Entrá más abierto: empezá la curva bien desde afuera, pasá cerca del cordón de adentro en el medio y salí otra vez hacia afuera\. ¡De afuera, adentro, afuera!/, '👉 Go in wider: start the corner from the outside, pass close to the inside curb in the middle and come out to the outside again. Outside, inside, outside!'],
    [/en el medio de la curva vas muy despacio\./, 'you’re too slow in the middle of the corner.'],
    [/👉 Soltá el freno antes de doblar y usá todo el ancho de la pista: de afuera hacia adentro\./, '👉 Let go of the brake before turning and use the whole width of the track: from outside to inside.'],
    [/al salir tardás en acelerar\./, 'you’re late on the throttle at the exit.'],
    [/👉 Apenas ves la salida y el volante se endereza, ¡pisá a fondo!/, '👉 As soon as you see the exit and the steering wheel straightens, floor it!'],
    [/podés ir un poquito más rápido\./, 'you can go a little faster.'],
    [/👉 Entrá más abierto, de afuera hacia adentro, y frená en el mismo lugar que en tu mejor vuelta\./, '👉 Go in wider, from outside to inside, and brake at the same spot as on your best lap.'],
    [/ Si lo hacés, ganás ([\d,]+) segundos\. 🏁/, function (m, s) { return ' If you do it, you gain ' + dec(s) + ' seconds. 🏁'; }],
    [/ \(Así lo hace (.+), que ahí es ([\d,]+) segundos más rápido\.\)/, function (m, n, s) { return ' (That’s how ' + n + ' does it, ' + dec(s) + ' seconds faster there.)'; }],
    [/^Tus vueltas cambian mucho entre una y otra\. 👉 Buscá una marca para frenar en cada curva \(un cono, una mancha, el cordón\) y frená siempre ahí\. ¡Así todas tus vueltas salen como la mejor!$/, 'Your laps change a lot from one to the next. 👉 Find a mark to brake at in each corner (a cone, a spot, the curb) and always brake there. That way all your laps come out like your best!'],
    [/^¡Excelente! No hay errores grandes.*$/, 'Excellent! No big mistakes: your laps are very similar. To go even faster, watch how a quicker driver does it. 🚀'],
    [/^¡Sí, muy parejo! Tus vueltas casi no cambian\. 👏$/, 'Yes, very consistent! Your laps barely change. 👏'],
    [/^¡Bastante parejo! Tus vueltas cambian unos ([\d,]+) segundos\. La meta es que cambien menos de 0,25 segundos\.$/, function (m, s) { return 'Fairly consistent! Your laps vary by about ' + dec(s) + ' seconds. The goal is less than 0.25 seconds.'; }],
    [/^Todavía no, pero no pasa nada: tus vueltas cambian unos ([\d,]+) segundos\. Primero tratá de hacer siempre la misma vuelta; la velocidad viene sola después\.$/, function (m, s) { return 'Not yet, but that’s OK: your laps vary by about ' + dec(s) + ' seconds. First try to do the same lap every time; speed comes on its own later.'; }],
    [/^Las vueltas ([\d, ]+) fueron mucho más lentas \(tráfico o un error\), así que no las conté\. ¡Errores tenemos todos!$/, 'Laps $1 were much slower (traffic or a mistake), so I didn’t count them. Everybody makes mistakes!'],
    [/^Practicá de a una cosa por vez: primero la número 1\. Cuando te salga, pasá a la siguiente\. ¡Cada vuelta aprendés algo nuevo, (.+)! 🏎️$/, 'Practice one thing at a time: number 1 first. When you get it, move on to the next. Every lap you learn something new, $1! 🏎️'],
    [/ · mejor vuelta$/, ' · best lap'],
    [/^· (\d+) vueltas?$/, function (m, n) { return '· ' + n + ' ' + pl(n, 'lap', 'laps'); }],
    [/ · (\d+) vueltas?$/, function (m, n) { return ' · ' + n + ' ' + pl(n, 'lap', 'laps'); }],
    [/^(.+) durante la vuelta$/, '$1 during the lap'],
    [/ · Velocidad GPS: /, ' · GPS speed: '], [/ · Distancia: /, ' · Distance: '],
    [/^mejor vuelta · (.+)$/, 'best lap · $1'],
    [/^Dif\. ?$/, 'Gap']
  ];

  function tr(s) {
    if (!s) return s;
    var t = s.trim();
    if (!t) return s;
    if (Object.prototype.hasOwnProperty.call(D, t)) return s.replace(t, D[t]);
    if (t === t.toUpperCase() && t !== t.toLowerCase()) { for (var k in D) { if (k.toUpperCase() === t) return s.replace(t, D[k].toUpperCase()); } }
    var out = t;
    for (var i = 0; i < R.length; i++) out = out.replace(R[i][0], R[i][1]);
    return out === t ? s : s.replace(t, out);
  }
  window.TR = tr;

  var ATTR = ['placeholder', 'title', 'aria-label', 'label'];
  function fixNode(n) {
    if (n.nodeType === 3) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
      if (p.nodeName === 'OPTION' && !p.hasAttribute('value')) p.setAttribute('value', p.textContent);
      var v = tr(n.nodeValue);
      if (v !== n.nodeValue) n.nodeValue = v;
      return;
    }
    if (n.nodeType !== 1) return;
    if (n.closest && n.closest('.lang')) return;
    ATTR.forEach(function (a) {
      if (n.hasAttribute && n.hasAttribute(a)) { var v = n.getAttribute(a), w = tr(v); if (w !== v) n.setAttribute(a, w); }
    });
    if (n.nodeName === 'OPTION' && !n.hasAttribute('value')) n.setAttribute('value', n.textContent);
    var w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), x;
    while ((x = w.nextNode())) {
      if (x.nodeType === 3) fixNode(x);
      else ATTR.forEach(function (a) { if (x.hasAttribute(a)) { var v = x.getAttribute(a), y = tr(v); if (y !== v) x.setAttribute(a, y); } });
      if (x.nodeType === 1 && x.nodeName === 'OPTION' && !x.hasAttribute('value')) x.setAttribute('value', x.textContent);
    }
  }
  document.title = tr(document.title);
  fixNode(document.body);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === 'characterData') fixNode(m.target);
      else if (m.type === 'attributes') { var v = m.target.getAttribute(m.attributeName), y = tr(v); if (y !== v) m.target.setAttribute(m.attributeName, y); }
      else m.addedNodes.forEach(fixNode);
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });

  ['alert', 'confirm', 'prompt'].forEach(function (k) {
    var f = window[k];
    window[k] = function (msg, d) { return f.call(window, tr(String(msg == null ? '' : msg)), d); };
  });
  var R2 = [
    [/^¿Borrar la sesión de (.+) del (.+) a las (.+)\?$/, 'Delete $1’s session from $2 at $3?'],
    [/^¿Borrar la cuenta de (.+)\? Ya no va a poder entrar\. Sus sesiones no se borran\.$/, 'Delete $1’s account? They won’t be able to sign in. Their sessions are kept.'],
    [/^Nueva contraseña para (.+) \(mínimo 6 caracteres\):$/, 'New password for $1 (at least 6 characters):'],
    [/^No se pudo descargar el archivo: (.*)$/, 'Could not download the file: $1']
  ];
  R2.forEach(function (r) { R.push(r); });
})();
