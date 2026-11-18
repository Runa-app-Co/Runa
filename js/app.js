/* =========================================================
   RUNA · Punto de entrada de la app
   1. Registra las rutas (pantallas)
   2. Dibuja la barra inferior y el botón del mapa
   3. Escucha toques globales (data-ir, data-accion)
   4. Registra el service worker (PWA)
   ========================================================= */

import { ruta, ir, volver, iniciarRouter } from './router.js';
import { icono } from './iconos.js';
import { vibrar, aviso } from './ui.js';
import { alternarFavorito } from './estado.js';
import './ubicacion.js'; // carga la última ubicación real guardada (si existe)
import { pantallaMapa } from './screens/mapa.js';
import { pantallaFavoritos } from './screens/favoritos.js';
import { pantallaComunidad } from './screens/comunidad.js';
import { pantallaDigital } from './screens/digital.js';
import { pantallaPerfil } from './screens/perfil.js';
import { pantallaMensajes } from './screens/mensajes.js';
import { pantallaChat } from './screens/chat.js';
import { pantallaExplorar } from './screens/explorar.js';
import { pantallaCategoria } from './screens/categoria.js';
import { pantallaExperiencia } from './screens/experiencia.js';
import { pantallaReservar } from './screens/reservar.js';
import { pantallaReserva } from './screens/reserva.js';

/* ---------------------------------------------------------
   1. Rutas
   pestana → qué ítem de la barra inferior se ilumina
   nivel   → profundidad (0 = pestaña principal)
   fab     → muestra el botón flotante del mapa
   sinNav  → oculta la barra inferior
   --------------------------------------------------------- */

ruta('/explorar', {
  pestana: 'explorar',
  fab: true,
  pantalla: pantallaExplorar,
});

ruta('/favoritos', {
  pestana: 'favoritos',
  fab: true,
  pantalla: pantallaFavoritos,
});

ruta('/comunidad', {
  pestana: 'comunidad',
  fab: 'mensajes', // en Comunidad el botón flotante abre Mensajes (como en Figma)
  pantalla: pantallaComunidad,
});

ruta('/digital', {
  pestana: 'digital',
  pantalla: pantallaDigital,
});

ruta('/mapa', {
  pestana: 'explorar',
  nivel: 1,
  fab: true,
  fabActivo: true,
  pantalla: pantallaMapa,
});

ruta('/mensajes', {
  pestana: 'comunidad',
  nivel: 1,
  pantalla: pantallaMensajes,
});

ruta('/chat/:id', {
  pestana: 'comunidad',
  nivel: 2,
  sinNav: true,
  pantalla: pantallaChat,
});

ruta('/perfil', {
  pestana: null,
  nivel: 1,
  pantalla: pantallaPerfil,
});

ruta('/categoria/:id', {
  pestana: 'explorar',
  nivel: 1,
  fab: true,
  pantalla: pantallaCategoria,
});

ruta('/experiencia/:id', {
  pestana: 'explorar',
  nivel: 2,
  fab: true,
  pantalla: pantallaExperiencia,
});

ruta('/reservar/:id', {
  pestana: 'explorar',
  nivel: 3,
  sinNav: true,
  pantalla: pantallaReservar,
});

ruta('/reserva/:codigo', {
  pestana: 'explorar',
  nivel: 3,
  pantalla: pantallaReserva,
});

/* ---------------------------------------------------------
   2. Barra inferior (4 pestañas, igual que en Figma)
   --------------------------------------------------------- */

const pestanas = [
  { id: 'explorar', texto: 'Explorar', icono: 'maloca', ruta: '/explorar' },
  { id: 'favoritos', texto: 'Favoritos', icono: 'marcador', ruta: '/favoritos' },
  { id: 'comunidad', texto: 'Comunidad', icono: 'piedras', ruta: '/comunidad', contador: 3 },
  { id: 'digital', texto: 'Digital', icono: 'solEspiral', ruta: '/digital' },
];

const nav = document.getElementById('nav-inferior');
nav.innerHTML = pestanas
  .map(
    (p) => `
    <a class="nav-inferior__item" href="#${p.ruta}" data-pestana="${p.id}">
      <span class="nav-inferior__icono">
        ${icono(p.icono)}
        ${p.contador ? `<span class="contador">${p.contador}</span>` : ''}
      </span>
      <span>${p.texto}</span>
    </a>`
  )
  .join('');

const fab = document.getElementById('fab-mapa');
fab.innerHTML = icono('mapa');
fab.addEventListener('click', () => {
  vibrar();
  // En Comunidad el botón abre Mensajes
  if (fab.dataset.modo === 'mensajes') return ir('/mensajes');
  // Si ya estamos en el mapa, el botón regresa a la lista
  if (location.hash.startsWith('#/mapa')) volver();
  else {
    // Si venimos de una categoría o una experiencia, el mapa abre ya filtrado / seleccionado
    const cat = location.hash.match(/^#\/categoria\/([^/?]+)/);
    const exp = location.hash.match(/^#\/experiencia\/([^/?]+)/);
    if (cat && cat[1] !== 'todas') ir(`/mapa?categoria=${cat[1]}`);
    else if (exp) ir(`/mapa?experiencia=${exp[1]}`);
    else ir('/mapa');
  }
});

const avatar = document.getElementById('avatar-perfil');

/** Se ejecuta cada vez que cambia la pantalla. */
function actualizarInterfaz(rutaActiva) {
  nav.querySelectorAll('.nav-inferior__item').forEach((item) => {
    const activo = item.dataset.pestana === rutaActiva.pestana;
    item.classList.toggle('es-activo', activo);
    item.setAttribute('aria-current', activo ? 'page' : 'false');
  });
  nav.classList.toggle('esta-oculta', !!rutaActiva.sinNav);
  fab.classList.toggle('esta-oculto', !rutaActiva.fab);
  fab.classList.toggle('es-activo', !!rutaActiva.fabActivo || rutaActiva.fab === 'mensajes');
  // El mismo botón flotante cambia de icono según la pantalla
  const modo = rutaActiva.fab === 'mensajes' ? 'mensajes' : 'mapa';
  if (fab.dataset.modo !== modo) {
    fab.dataset.modo = modo;
    fab.innerHTML = icono(modo === 'mensajes' ? 'mensaje' : 'mapa');
    fab.setAttribute('aria-label', modo === 'mensajes' ? 'Abrir mensajes' : 'Ver mapa');
  }
  avatar.classList.toggle('es-activo', rutaActiva.camino === '/perfil');
}

/* ---------------------------------------------------------
   3. Toques globales
   Cualquier elemento con data-ir="/ruta" navega,
   y con data-accion="volver" regresa.
   --------------------------------------------------------- */

document.addEventListener('click', (evento) => {
  // Corazón de favoritos (va antes que data-ir porque suele estar dentro de una tarjeta)
  const favorito = evento.target.closest('[data-favorito]');
  if (favorito) {
    evento.preventDefault();
    evento.stopPropagation();
    const id = favorito.dataset.favorito;
    const guardado = alternarFavorito(id);
    vibrar(guardado ? 18 : 8);
    // Actualiza todos los corazones de esa experiencia en pantalla
    document.querySelectorAll(`[data-favorito="${id}"]`).forEach((b) => {
      b.classList.toggle('es-activo', guardado);
      b.setAttribute('aria-pressed', guardado);
      b.classList.remove('late');
      void b.offsetWidth; // reinicia la animación
      b.classList.add('late');
    });
    aviso(guardado ? 'Guardado en tus favoritos' : 'Quitado de favoritos');
    return;
  }

  const destino = evento.target.closest('[data-ir]');
  if (destino) {
    evento.preventDefault();
    vibrar();
    ir(destino.dataset.ir);
    return;
  }
  const accion = evento.target.closest('[data-accion="volver"]');
  if (accion) {
    evento.preventDefault();
    volver();
  }
});

nav.addEventListener('click', () => vibrar());

/* ---------------------------------------------------------
   Arranque
   --------------------------------------------------------- */

iniciarRouter(document.getElementById('vistas'), actualizarInterfaz);

/* ---------------------------------------------------------
   4. PWA: service worker para funcionar como app instalable
   --------------------------------------------------------- */

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('No se pudo registrar el service worker:', error);
    });
  });
}
