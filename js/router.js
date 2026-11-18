/* =========================================================
   RUNA · Enrutador de una sola página (SPA)
   Usa el "hash" de la URL (#/explorar, #/experiencia/3…)
   para cambiar de pantalla sin recargar.
   - Funciona en GitHub Pages / Netlify sin configuración.
   - Decide la animación según el "nivel" de cada pantalla:
       nivel 0 = pestaña principal (fundido)
       nivel 1+ = pantalla interna (desliza desde la derecha)
   En React Native esto equivale a React Navigation
   (Tab Navigator + Stack Navigator).
   ========================================================= */

const rutas = [];
let pantallaActual = null;   // elemento DOM visible
let rutaActual = null;       // definición de la ruta visible
let caminoActual = null;     // texto de la ruta visible (ej. '/explorar')
let contenedor = null;
let alCambiar = () => {};

/**
 * Registra una ruta.
 * @param {string} patron   Ej: '/experiencia/:id'
 * @param {object} opciones { pantalla, pestana, nivel, sinNav, sinFab }
 *   - pantalla(params) → devuelve un HTMLElement
 *   - pestana: qué pestaña de la barra inferior se marca
 */
export function ruta(patron, opciones) {
  const nombres = [];
  const regex = new RegExp(
    '^' +
      patron.replace(/:(\w+)/g, (_, nombre) => {
        nombres.push(nombre);
        return '([^/]+)';
      }) +
      '/?$'
  );
  rutas.push({ patron, regex, nombres, nivel: 0, ...opciones });
}

/** Navega a una ruta: ir('/experiencia/2') */
export function ir(camino) {
  if (location.hash === '#' + camino) return;
  location.hash = camino;
}

/** Navega reemplazando la pantalla actual en el historial
 *  (al tocar "atrás" no se vuelve a ella). */
export function reemplazar(camino) {
  location.replace('#' + camino);
}

/** Vuelve a la pantalla anterior (o a Explorar si no hay historial). */
export function volver() {
  if (history.length > 1 && sessionStorage.getItem('runa:navego')) {
    history.back();
  } else {
    ir('/explorar');
  }
}

function buscarRuta(caminoCompleto) {
  // Separa los parámetros opcionales: /categoria/todas?region=andina
  const [camino, consulta = ''] = caminoCompleto.split('?');
  for (const r of rutas) {
    const m = camino.match(r.regex);
    if (m) {
      const params = { consulta: Object.fromEntries(new URLSearchParams(consulta)) };
      r.nombres.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1])));
      return { definicion: r, params };
    }
  }
  return null;
}

/** Elige la animación comparando la pantalla nueva con la anterior. */
function tipoTransicion(anterior, nueva) {
  if (!anterior) return null;
  if (nueva.nivel > anterior.nivel) return 'adelante';
  if (nueva.nivel < anterior.nivel) return 'atras';
  if (nueva.nivel > 0) return 'adelante';
  return 'pestana';
}

function mostrar() {
  const camino = location.hash.replace(/^#/, '') || '/explorar';
  if (camino === caminoActual) return; // ya estamos en esa pantalla
  const encontrada = buscarRuta(camino);

  if (!encontrada) {
    ir('/explorar');
    return;
  }

  const { definicion, params } = encontrada;
  const nueva = definicion.pantalla(params);
  nueva.classList.add('pantalla');
  if (definicion.sinNav) nueva.classList.add('pantalla--sin-nav');

  const anterior = pantallaActual;
  const transicion = tipoTransicion(rutaActual, definicion);

  contenedor.appendChild(nueva);

  if (anterior && transicion) {
    nueva.classList.add(`anim-entrar-${transicion}`);
    anterior.classList.add(`anim-salir-${transicion}`);
    // Al volver, la pantalla que sale debe quedar encima
    if (transicion === 'atras') contenedor.appendChild(anterior);
    const limpiar = () => anterior.remove();
    anterior.addEventListener('animationend', limpiar, { once: true });
    setTimeout(limpiar, 600); // por si el navegador no dispara el evento
    nueva.addEventListener(
      'animationend',
      () => nueva.classList.remove(`anim-entrar-${transicion}`),
      { once: true }
    );
  } else if (anterior) {
    anterior.remove();
  }

  pantallaActual = nueva;
  rutaActual = definicion;
  caminoActual = camino;
  alCambiar({ ...definicion, params, camino });

  // Las pantallas pueden exponer una función `alMostrar` (p. ej. el mapa)
  if (typeof nueva.alMostrar === 'function') {
    // setTimeout (y no requestAnimationFrame) para que funcione aunque la pestaña esté en segundo plano
    setTimeout(() => nueva.alMostrar(), 0);
  }
}

/**
 * Inicia el enrutador.
 * @param {HTMLElement} elemento contenedor de pantallas
 * @param {Function} callback se llama en cada cambio (para la barra inferior, etc.)
 */
export function iniciarRouter(elemento, callback) {
  contenedor = elemento;
  alCambiar = callback || alCambiar;
  window.addEventListener('hashchange', () => {
    sessionStorage.setItem('runa:navego', '1');
    mostrar();
  });
  mostrar();
}
