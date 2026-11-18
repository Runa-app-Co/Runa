/* =========================================================
   RUNA · Service worker (PWA)
   - Guarda los archivos de la app para que abra rápido
     y funcione aunque la conexión sea mala.
   - Estrategia "red primero" para los archivos propios:
     si hay internet se usa lo más nuevo; si no, la copia.
   - Imágenes, fuentes y mapas: "caché primero".
   IMPORTANTE: al publicar cambios, sube el número de VERSION
   para que los celulares de los testers se actualicen.
   ========================================================= */

const VERSION = 'runa-v7';
const CACHE_APP = `${VERSION}-app`;
const CACHE_RECURSOS = `${VERSION}-recursos`;

// Archivos esenciales que se guardan al instalar
const ARCHIVOS_APP = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tema.css',
  './css/base.css',
  './css/componentes.css',
  './css/pantallas.css',
  './js/app.js',
  './js/router.js',
  './js/iconos.js',
  './js/ui.js',
  './js/estado.js',
  './js/modal.js',
  './js/componentes/tarjetas.js',
  './js/screens/explorar.js',
  './js/screens/favoritos.js',
  './js/screens/comunidad.js',
  './js/screens/digital.js',
  './js/screens/perfil.js',
  './data/comunidad.js',
  './js/screens/categoria.js',
  './js/screens/experiencia.js',
  './js/screens/reservar.js',
  './js/screens/reserva.js',
  './js/screens/mapa.js',
  './js/ubicacion.js',
  './js/chats.js',
  './js/screens/mensajes.js',
  './js/screens/chat.js',
  './data/mensajes.js',
  './data/datos.js',
  './assets/img/logo-simbolo.png',
  './assets/img/logo-texto.png',
  './assets/img/avatar-usuario.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_APP).then((cache) => cache.addAll(ARCHIVOS_APP)).then(() => self.skipWaiting())
  );
});

// Borra cachés de versiones anteriores
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => !c.startsWith(VERSION)).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const { request } = evento;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const esPropio = url.origin === self.location.origin;
  const esImagenOFuente = ['image', 'font', 'style'].includes(request.destination) && !esPropio;

  if (esPropio && !['image'].includes(request.destination)) {
    // Red primero → caché si no hay conexión.
    // cache: 'no-cache' obliga a preguntar al servidor si hay versión nueva
    // (así los testers siempre ven los últimos cambios publicados).
    const fresca = request.mode === 'navigate' ? request : new Request(request, { cache: 'no-cache' });
    evento.respondWith(
      fetch(fresca)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE_APP).then((cache) => cache.put(request, copia));
          return respuesta;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  if (esPropio || esImagenOFuente) {
    // Caché primero → red (imágenes, fuentes, teselas del mapa)
    evento.respondWith(
      caches.match(request).then(
        (guardada) =>
          guardada ||
          fetch(request).then((respuesta) => {
            if (respuesta.ok || respuesta.type === 'opaque') {
              const copia = respuesta.clone();
              caches.open(CACHE_RECURSOS).then((cache) => cache.put(request, copia));
            }
            return respuesta;
          })
      )
    );
  }
});
