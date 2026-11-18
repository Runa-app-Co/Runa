/* =========================================================
   RUNA · Experiencia digital (versión básica)
   Figma: marco "EXPERIENCIA DIGITAL"
   - Círculo "432 Hz · Frecuencia Andina" + "Desliza para sintonizar"
   - Paisajes sonoros (suenan de verdad: tonos generados con
     Web Audio, sin archivos de audio)
   - Visuales y meditativas: ejercicio de respiración guiada
   - Dinámicas de saberes (anunciadas como "próximamente")
   Ruta: #/digital
   ========================================================= */

import { crearPantalla, escapar, aviso, vibrar } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal } from '../modal.js';

const SONIDOS = [
  { id: 's1', tipo: 'sonoros', etiqueta: '432 Hz', min: 14, titulo: 'Canto de páramo y viento andino', texto: 'Resonancia fría de Chingaza con cuencos de barro', nota: 'Grabación de campo pura', imagen: 'assets/img/exp/paramo.jpg', frecuencias: [216, 324, 432] },
  { id: 's2', tipo: 'sonoros', etiqueta: 'Armonía Kamëntsá', min: 21, titulo: 'Flauta quena en el Valle de Sibundoy', texto: 'Maestro Taita Jacanamijoy · Respiración circular', nota: 'Melodía de introspección', imagen: 'assets/img/exp/telar-2.jpg', frecuencias: [196, 294, 392] },
  { id: 's3', tipo: 'meditativos', etiqueta: 'Ruido marrón', min: 32, titulo: 'El susurro del fogón en la noche', texto: 'Crujido de leña seca, grillos y viento suave', nota: 'Ideal para inducir el sueño', imagen: 'assets/img/exp/fogata.jpg', frecuencias: [110, 165, 220] },
];

/* ---------- Motor de sonido muy simple (Web Audio) ---------- */
let audio = null;
let sonando = null; // { id, nodos }

function detener() {
  if (!sonando) return;
  const { ganancia, osciladores } = sonando;
  const t = audio.currentTime;
  ganancia.gain.cancelScheduledValues(t);
  ganancia.gain.setValueAtTime(ganancia.gain.value, t);
  ganancia.gain.linearRampToValueAtTime(0, t + 0.6);
  osciladores.forEach((o) => o.stop(t + 0.7));
  sonando = null;
}

/** Toca un acorde suave con las frecuencias dadas (con entrada gradual). */
function tocar(id, frecuencias) {
  audio = audio || new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
  detener();
  const ganancia = audio.createGain();
  ganancia.gain.value = 0;
  ganancia.connect(audio.destination);
  const t = audio.currentTime;
  ganancia.gain.linearRampToValueAtTime(0.06, t + 1.5);

  const osciladores = [];
  frecuencias.forEach((f, i) => {
    const o = audio.createOscillator();
    o.type = i === 0 ? 'sine' : 'triangle';
    o.frequency.value = f;
    // Leve vibrato para que suene orgánico
    const lfo = audio.createOscillator();
    const prof = audio.createGain();
    lfo.frequency.value = 0.15 + i * 0.07;
    prof.gain.value = 1.2;
    lfo.connect(prof).connect(o.frequency);
    lfo.start();
    const g = audio.createGain();
    g.gain.value = 1 / (i + 1.5);
    o.connect(g).connect(ganancia);
    o.start();
    osciladores.push(o, lfo); // se guardan para poder detenerlos después
  });
  sonando = { id, ganancia, osciladores };
}

export function pantallaDigital() {
  let filtro = 'todos';

  const el = crearPantalla(
    'digital',
    `
    <div class="contenido">
      <div class="digital__intro aparecer">
        <p class="detalle__tipo">${icono('sol')} Espacio sensorial</p>
        <h1>Bienvenido a la experiencia digital RUNA</h1>
        <p>Sintoniza tu mente con los saberes vivos de la tierra a través de resonancias, geometrías ancestrales y quietud.</p>
      </div>

      <div class="frecuencia aparecer" style="--i:1" data-frecuencia>
        <span class="frecuencia__orbita"><i>${icono('fuego')}</i><i>${icono('agua')}</i><i>${icono('hoja')}</i></span>
        <div class="frecuencia__circulo">
          <span class="frecuencia__ondas"><i></i><i></i><i></i><i></i><i></i></span>
          <strong>432 Hz</strong>
          <small>Frecuencia Andina</small>
        </div>
      </div>

      <label class="deslizador aparecer" style="--i:2">
        <input type="range" min="0" max="100" value="0" data-sintonizar aria-label="Desliza para sintonizar" />
        <span class="deslizador__texto" data-texto-deslizador>Desliza para sintonizar</span>
      </label>

      <div class="pildoras pildoras--rellenas aparecer" style="--i:3">
        <button class="pildora" data-filtro="todos">${icono('capas')} Todos</button>
        <button class="pildora" data-filtro="sonoros">${icono('sol')} Sonoros</button>
        <button class="pildora" data-filtro="meditativos">${icono('nube')} Meditativos</button>
      </div>

      <div class="titulo-seccion titulo-seccion--con-sub">
        <div><h2 class="con-punto">Paisajes Sonoros y Frecuencias</h2><p>Grabaciones binaurales en territorios sagrados para restaurar la calma.</p></div>
      </div>
      <div class="sonidos" data-sonidos></div>

      <div class="titulo-seccion titulo-seccion--con-sub">
        <div><h2 class="con-punto">Visuales &amp; Meditativas</h2><p>Ejercicios visuales y de compás vital basados en los ritmos botánicos.</p></div>
      </div>
      <article class="meditacion">
        <img src="assets/img/exp/biorefugios.jpg" alt="" loading="lazy" />
        <div>
          <small>${icono('hoja')} Respiración 4 · 4 · 6</small>
          <h3>Latido del bosque de niebla</h3>
          <p>Sincroniza tus inhalaciones con la expansión visual de la humedad de las hojas y la neblina.</p>
          <footer><span>${icono('reloj')} 3 minutos · Guiada</span><button class="boton boton--primario boton--pequeno" data-respirar>Comenzar ${icono('flecha')}</button></footer>
        </div>
      </article>

      <div class="titulo-seccion titulo-seccion--con-sub">
        <div><h2 class="con-punto">Dinámicas de Saberes</h2><p>Aprende interactuando de forma lúdica con la memoria ancestral.</p></div>
      </div>
      <div class="dinamicas">
        ${[
          ['Test', 'Descubre tu elemento territorial', 'Un viaje de 6 preguntas que revela tu afinidad: Agua de páramo, Fuego de maloca o Raíz de selva.', 'montana', 'Iniciar cuestionario'],
          ['Táctil', 'Telar digital: teje tu pensamiento', 'Arrastra tramas vegetales en pantalla para componer tu amuleto personal de protección.', 'tejido', 'Entrar al telar'],
          ['Herbarium', 'Mapeo botánico sensorial', 'Explora plantas maestras (Yagé, Frailejón, Tabaco cimarrón) con sonidos microscópicos.', 'planta', 'Explorar atlas de plantas'],
        ]
          .map(
            ([tag, titulo, texto, ic, boton]) => `
          <article class="dinamica">
            <header><span class="dinamica__icono">${icono(ic)}</span><span class="etiqueta">${tag}</span></header>
            <h3>${titulo}</h3>
            <p>${texto}</p>
            <button class="boton boton--bloque boton--suave" data-pronto>${boton}</button>
          </article>`
          )
          .join('')}
      </div>

      <blockquote class="cita-final">${icono('hoja')}<p>“El territorio no se visita únicamente con los pies, se habita con la memoria.”</p></blockquote>
    </div>`
  );

  /* ---------- Lista de sonidos ---------- */
  function pintar() {
    el.querySelectorAll('[data-filtro]').forEach((b) => b.classList.toggle('es-activa', b.dataset.filtro === filtro));
    const lista = SONIDOS.filter((s) => filtro === 'todos' || s.tipo === filtro);
    el.querySelector('[data-sonidos]').innerHTML = lista
      .map(
        (s) => `
      <article class="sonido ${sonando?.id === s.id ? 'esta-sonando' : ''}" data-sonido="${s.id}">
        <button class="sonido__play" aria-label="Reproducir ${escapar(s.titulo)}">
          <img src="${s.imagen}" alt="" />
          <span>${icono(sonando?.id === s.id ? 'pausa' : 'play')}</span>
        </button>
        <div class="sonido__texto">
          <p><span class="etiqueta etiqueta--durazno">${escapar(s.etiqueta)}</span> <small>${s.min} min</small></p>
          <h3>${escapar(s.titulo)}</h3>
          <p class="sonido__desc">${escapar(s.texto)}</p>
          <p class="sonido__onda"><span class="onda"><i></i><i></i><i></i><i></i><i></i><i></i></span> ${escapar(s.nota)}</p>
        </div>
      </article>`
      )
      .join('');
  }

  /* ---------- Deslizador "sintonizar" ---------- */
  const deslizador = el.querySelector('[data-sintonizar]');
  const textoDeslizador = el.querySelector('[data-texto-deslizador]');
  const frecuencia = el.querySelector('[data-frecuencia]');

  deslizador.addEventListener('input', () => {
    deslizador.style.setProperty('--avance', deslizador.value + '%');
    textoDeslizador.style.opacity = 1 - deslizador.value / 60;
  });
  deslizador.addEventListener('change', () => {
    if (deslizador.value > 85) {
      deslizador.value = 100;
      vibrar(25);
      if (sonando?.id === 'frecuencia') {
        detener();
        frecuencia.classList.remove('esta-sonando');
        deslizador.value = 0;
        textoDeslizador.textContent = 'Desliza para sintonizar';
      } else {
        tocar('frecuencia', [216, 432, 648]);
        frecuencia.classList.add('esta-sonando');
        textoDeslizador.textContent = 'Sintonizado · desliza para detener';
        deslizador.value = 0;
        pintar();
      }
    } else {
      deslizador.value = 0;
    }
    deslizador.style.setProperty('--avance', deslizador.value + '%');
    textoDeslizador.style.opacity = 1;
  });

  /* ---------- Respiración guiada ---------- */
  function abrirRespiracion() {
    const { el: modal } = abrirModal({
      clase: 'respiracion',
      contenido: `
        <div class="respiracion__circulo" data-circulo><span data-fase>Prepárate…</span></div>
        <p class="respiracion__ayuda">Sigue el círculo: inhala cuando crece, sostén, exhala cuando se encoge.</p>
        <button class="boton boton--contorno boton--bloque" data-cerrar>Terminar</button>`,
    });
    const circulo = modal.querySelector('[data-circulo]');
    const fase = modal.querySelector('[data-fase]');
    const pasos = [
      ['Inhala', 4000, 'crece'],
      ['Sostén', 4000, 'crece'],
      ['Exhala', 6000, ''],
    ];
    let i = 0;
    let activo = true;
    const ciclo = () => {
      if (!activo || !modal.isConnected) return;
      const [texto, ms, clase] = pasos[i % 3];
      fase.textContent = texto;
      circulo.className = `respiracion__circulo ${clase}`;
      circulo.style.transitionDuration = ms + 'ms';
      i++;
      setTimeout(ciclo, ms);
    };
    setTimeout(ciclo, 900);
    modal.addEventListener('click', (e) => e.target.closest('[data-cerrar]') && (activo = false));
  }

  el.addEventListener('click', (e) => {
    const t = e.target;
    const f = t.closest('[data-filtro]');
    if (f) {
      filtro = f.dataset.filtro;
      pintar();
    }
    const s = t.closest('[data-sonido]');
    if (s && t.closest('.sonido__play')) {
      const datos = SONIDOS.find((x) => x.id === s.dataset.sonido);
      if (sonando?.id === datos.id) detener();
      else {
        tocar(datos.id, datos.frecuencias);
        aviso('Muestra sonora generada en vivo 🎧');
      }
      frecuencia.classList.remove('esta-sonando');
      vibrar();
      pintar();
    }
    if (t.closest('[data-respirar]')) abrirRespiracion();
    if (t.closest('[data-pronto]')) aviso('Esta dinámica llega en la próxima versión 🌱');
  });

  // Al salir de la pantalla se apaga el sonido
  window.addEventListener(
    'hashchange',
    () => {
      detener();
    },
    { once: true }
  );

  pintar();
  return el;
}
