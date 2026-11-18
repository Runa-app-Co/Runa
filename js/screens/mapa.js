/* =========================================================
   RUNA · Mapa de experiencias cercanas
   Figma: marcos "Mapa" y "FLOATING BOTTOM CARD"
   - Mapa interactivo Leaflet + OpenStreetMap (sin clave)
   - Marcadores redondos con el icono de cada saber
   - "Tú estás aquí" con la ubicación real (si hay permiso)
   - Al tocar un marcador: se ilumina, aparece una línea
     punteada desde tu ubicación y sube una tarjeta flotante
   - Filtro por categoría
   Ruta: #/mapa   (opcional ?categoria=gastronomia)
   ========================================================= */

import { crearPantalla, escapar, aviso, vibrar, textoDistancia } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal, cerrarModal } from '../modal.js';
import { experiencias, categorias, regiones, buscarCategoria } from '../../data/datos.js';
import { botonFavorito, distanciaA } from '../componentes/tarjetas.js';
import { ubicacionActual, esUbicacionReal, pedirUbicacion, tiemposViaje } from '../ubicacion.js';

export function pantallaMapa({ consulta = {} }) {
  let filtro = consulta.categoria || 'todas';
  let seleccionada = null;

  const el = crearPantalla(
    'mapa',
    `
    <div class="mapa__lienzo" data-mapa></div>

    <!-- Controles superiores -->
    <div class="mapa__arriba">
      <div class="mapa__titulo">
        <button class="boton-icono" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
        <div>
          <small>Territorio</small>
          <strong data-territorio>Cerca de ti</strong>
        </div>
      </div>
      <button class="mapa__filtros" data-filtros>${icono('ajustes')} <span data-texto-filtro>Filtros</span></button>
    </div>

    <div class="mapa__botones">
      <button class="boton-icono" data-ubicarme aria-label="Usar mi ubicación">${icono('objetivo')}</button>
      <button class="boton-icono" data-ver-todas aria-label="Ver todas las experiencias">${icono('capas')}</button>
    </div>

    <!-- Tarjeta flotante (aparece al tocar un marcador) -->
    <div class="tarjeta-mapa" data-tarjeta aria-live="polite"></div>`
  );

  const $ = (s) => el.querySelector(s);
  let mapa, capaMarcadores, marcadorYo, linea;
  const marcadores = new Map(); // id → marcador de Leaflet

  /* ---------- Iconos de los marcadores ---------- */
  const iconoMarcador = (exp, activo) =>
    L.divIcon({
      className: `marcador-saber ${activo ? 'es-activo' : ''}`,
      html: `<span class="marcador-saber__punto">${icono(buscarCategoria(exp.categoria).icono)}</span>
             ${activo ? `<span class="marcador-saber__nombre">${escapar(exp.titulo)}</span>` : ''}`,
      iconSize: activo ? [64, 64] : [40, 40],
      iconAnchor: activo ? [32, 32] : [20, 20],
    });

  const iconoYo = () =>
    L.divIcon({
      className: 'marcador-yo',
      html: `<span class="marcador-yo__punto"></span><span class="marcador-yo__texto">Tú estás aquí</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  /* ---------- Dibuja / actualiza ---------- */
  function visibles() {
    return filtro === 'todas' ? experiencias : experiencias.filter((e) => e.categoria === filtro);
  }

  function pintarMarcadores() {
    capaMarcadores.clearLayers();
    marcadores.clear();
    visibles().forEach((exp) => {
      const m = L.marker([exp.ubicacion.lat, exp.ubicacion.lng], {
        icon: iconoMarcador(exp, seleccionada === exp.id),
        zIndexOffset: seleccionada === exp.id ? 1000 : 0,
        keyboard: true,
        title: exp.titulo,
      });
      m.on('click', () => seleccionar(exp.id));
      m.addTo(capaMarcadores);
      marcadores.set(exp.id, m);
    });
    const cat = buscarCategoria(filtro);
    $('[data-texto-filtro]').textContent = cat ? cat.nombre.split(' ')[0] : 'Filtros';
    $('[data-filtros]').classList.toggle('es-activo', !!cat);
  }

  function pintarYo() {
    const { lat, lng } = ubicacionActual();
    if (marcadorYo) marcadorYo.setLatLng([lat, lng]);
    else marcadorYo = L.marker([lat, lng], { icon: iconoYo(), interactive: false, zIndexOffset: -100 }).addTo(mapa);
  }

  /** Nombre del territorio más cercano (para el título superior). */
  function actualizarTerritorio() {
    const cercana = [...visibles()].sort((a, b) => distanciaA(a) - distanciaA(b))[0];
    if (!cercana) return;
    const region = regiones.find((r) => r.id === cercana.region);
    $('[data-territorio]').textContent = region ? region.nombre : cercana.ubicacion.depto;
  }

  /** Encuadra el mapa para ver tu ubicación + las experiencias más cercanas. */
  function encuadrar(todas = false) {
    const lista = [...visibles()].sort((a, b) => distanciaA(a) - distanciaA(b));
    const puntos = (todas ? lista : lista.slice(0, 3)).map((e) => [e.ubicacion.lat, e.ubicacion.lng]);
    const { lat, lng } = ubicacionActual();
    if (!todas) puntos.push([lat, lng]);
    if (!puntos.length) return;
    mapa.flyToBounds(L.latLngBounds(puntos), {
      paddingTopLeft: [30, 170],
      paddingBottomRight: [30, 200],
      maxZoom: 12,
      duration: 0.8,
    });
  }

  /* ---------- Selección de un marcador ---------- */
  function seleccionar(id) {
    const exp = experiencias.find((e) => e.id === id);
    if (!exp) return;
    seleccionada = id;
    vibrar();
    pintarMarcadores();

    // Línea punteada desde "Tú estás aquí"
    const { lat, lng } = ubicacionActual();
    if (linea) linea.remove();
    linea = L.polyline([[lat, lng], [exp.ubicacion.lat, exp.ubicacion.lng]], {
      color: '#B03C0D',
      weight: 2.5,
      opacity: 0.8,
      dashArray: '6 8',
      interactive: false,
    }).addTo(mapa);

    // Centra el marcador un poco arriba para que no lo tape la tarjeta
    const destino = mapa.project([exp.ubicacion.lat, exp.ubicacion.lng], Math.max(mapa.getZoom(), 10));
    destino.y += 110;
    mapa.flyTo(mapa.unproject(destino, Math.max(mapa.getZoom(), 10)), Math.max(mapa.getZoom(), 10), { duration: 0.6 });

    mostrarTarjeta(exp);
  }

  function deseleccionar() {
    seleccionada = null;
    if (linea) linea.remove();
    linea = null;
    pintarMarcadores();
    $('[data-tarjeta]').classList.remove('es-visible');
    document.getElementById('fab-mapa').classList.remove('esta-oculto');
  }

  /* ---------- Tarjeta flotante (componente de Figma) ---------- */
  function mostrarTarjeta(exp) {
    const km = distanciaA(exp);
    const t = tiemposViaje(km);
    const cat = buscarCategoria(exp.categoria);
    const tarjeta = $('[data-tarjeta]');
    tarjeta.innerHTML = `
      <span class="tarjeta-mapa__asa" aria-hidden="true"></span>
      <button class="tarjeta-mapa__cerrar" data-cerrar-tarjeta aria-label="Cerrar">${icono('cerrar')}</button>
      <div class="tarjeta-mapa__fila" data-ir="/experiencia/${exp.id}">
        <img src="${exp.imagen}" alt="" />
        <div class="tarjeta-mapa__texto">
          <div class="tarjeta-mapa__etiquetas">
            <span class="etiqueta">${escapar(cat.nombre.split(' ')[0])}</span>
            ${exp.cuposRestantes <= 4 ? `<span class="etiqueta etiqueta--durazno">¡Últimos ${exp.cuposRestantes} cupos!</span>` : ''}
          </div>
          <h3>${escapar(exp.titulo)}</h3>
          <p>${icono('ubicacion')} ${escapar(exp.ubicacion.corto)}</p>
        </div>
      </div>
      <div class="tarjeta-mapa__distancia">
        <span>${icono('navegar')} ${textoDistancia(km)}</span>
        <i>•</i>
        <span>${icono('carro')} ${t.carro}</span>
        <i>•</i>
        <span>${icono('caminar')} ${t.pie || 'Lejos a pie'}</span>
      </div>
      <div class="tarjeta-mapa__acciones">
        ${botonFavorito(exp.id, 'boton-favorito--cuadrado')}
        <button class="boton boton--primario" data-ir="/experiencia/${exp.id}">Ver experiencia ${icono('flecha')}</button>
      </div>`;
    tarjeta.classList.remove('es-visible');
    void tarjeta.offsetWidth;
    tarjeta.classList.add('es-visible');
    // El botón flotante del mapa taparía la tarjeta: se esconde mientras está abierta
    document.getElementById('fab-mapa').classList.add('esta-oculto');
  }

  /* ---------- Deslizar la tarjeta hacia abajo para cerrarla ---------- */
  let inicioY = null;
  const tarjeta = $('[data-tarjeta]');
  tarjeta.addEventListener('touchstart', (e) => (inicioY = e.touches[0].clientY), { passive: true });
  tarjeta.addEventListener(
    'touchmove',
    (e) => {
      if (inicioY === null) return;
      const dy = Math.max(0, e.touches[0].clientY - inicioY);
      tarjeta.style.transform = `translateY(${dy}px)`;
    },
    { passive: true }
  );
  tarjeta.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - (inicioY ?? 0);
    tarjeta.style.transform = '';
    inicioY = null;
    if (dy > 70) deseleccionar();
  });

  /* ---------- Filtros por categoría ---------- */
  function abrirFiltros() {
    const opcion = (id, nombre, icon) => `
      <button class="opcion ${filtro === id ? 'es-activa' : ''}" data-filtro="${id}">
        <span class="opcion__icono">${icono(filtro === id ? 'checkCirculo' : icon)}</span>
        ${escapar(nombre)}
        <small>${id === 'todas' ? experiencias.length : experiencias.filter((e) => e.categoria === id).length}</small>
      </button>`;
    const { el: modal } = abrirModal({
      titulo: '¿Qué saber buscas cerca?',
      clase: 'modal-opciones',
      contenido: `<div class="opciones">
        ${opcion('todas', 'Todos los saberes', 'capas')}
        ${categorias.map((c) => opcion(c.id, c.nombre, c.icono)).join('')}
      </div>`,
    });
    modal.addEventListener('click', (e) => {
      const b = e.target.closest('[data-filtro]');
      if (!b) return;
      filtro = b.dataset.filtro;
      deseleccionar();
      actualizarTerritorio();
      encuadrar(true);
      cerrarModal();
    });
  }

  /* ---------- Eventos de la pantalla ---------- */
  el.addEventListener('click', async (e) => {
    if (e.target.closest('[data-cerrar-tarjeta]')) deseleccionar();
    if (e.target.closest('[data-filtros]')) abrirFiltros();
    if (e.target.closest('[data-ver-todas]')) {
      deseleccionar();
      encuadrar(true);
    }
    const ubicarme = e.target.closest('[data-ubicarme]');
    if (ubicarme) {
      ubicarme.classList.add('esta-buscando');
      try {
        await pedirUbicacion();
        aviso('Ubicación actualizada');
        pintarYo();
        actualizarTerritorio();
        mapa.flyTo([ubicacionActual().lat, ubicacionActual().lng], 11, { duration: 0.8 });
        if (seleccionada) seleccionar(seleccionada);
      } catch {
        aviso('No pudimos acceder a tu ubicación. Usamos una de ejemplo.');
      } finally {
        ubicarme.classList.remove('esta-buscando');
      }
    }
  });

  /* ---------- Crear el mapa cuando la pantalla ya está visible ---------- */
  el.alMostrar = () => {
    if (!window.L) {
      $('[data-mapa]').innerHTML = '<div class="vacio">No se pudo cargar el mapa. Revisa tu conexión.</div>';
      return;
    }
    const { lat, lng } = ubicacionActual();
    mapa = L.map($('[data-mapa]'), { zoomControl: false, attributionControl: true }).setView([lat, lng], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
      className: 'teselas-runa',
    }).addTo(mapa);
    capaMarcadores = L.layerGroup().addTo(mapa);
    mapa.on('click', () => seleccionada && deseleccionar());

    pintarMarcadores();
    pintarYo();
    actualizarTerritorio();
    setTimeout(() => {
      mapa.invalidateSize();
      encuadrar();
      if (consulta.experiencia) seleccionar(consulta.experiencia);
    }, 380);

    if (!esUbicacionReal()) {
      setTimeout(() => aviso('Toca ◎ para usar tu ubicación real'), 1200);
    }
  };

  return el;
}
