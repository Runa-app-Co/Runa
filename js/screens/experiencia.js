/* =========================================================
   RUNA · Detalle de experiencia
   Figma: marco "RUNA - Chicha artesanal con Muiscas"
   - Galería de fotos deslizable con etiquetas y calificación
   - Barra de precio + "Reservar cupo" (se queda fija al bajar)
   - Anfitrión, datos clave, descripción, itinerario,
     qué llevar, lugar de encuentro (mapa), reseñas y
     economía de reciprocidad
   Ruta: #/experiencia/:id
   ========================================================= */

import { crearPantalla, escapar, pesos } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal } from '../modal.js';
import { buscarExperiencia, buscarAnfitrion, experiencias } from '../../data/datos.js';
import { botonFavorito } from '../componentes/tarjetas.js';

export function pantallaExperiencia({ id }) {
  const exp = buscarExperiencia(id) || experiencias[0];
  const anfitrion = buscarAnfitrion(exp.anfitrion);
  const pocosCupos = exp.cuposRestantes <= 3;

  const el = crearPantalla(
    'experiencia',
    `
    <!-- Galería -->
    <div class="galeria">
      <div class="galeria__pista" data-galeria>
        ${exp.galeria.map((src, i) => `<img src="${src}" alt="Foto ${i + 1} de ${escapar(exp.titulo)}" ${i ? 'loading="lazy"' : ''} />`).join('')}
      </div>
      <div class="galeria__arriba">
        <button class="boton-icono boton-icono--vidrio" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
        <div class="galeria__etiquetas">
          <span class="etiqueta etiqueta--terracota">${icono('olla')} ${escapar(exp.etiquetas[0])}</span>
          ${exp.etiquetas[1] ? `<span class="etiqueta">${icono('sello')} ${escapar(exp.etiquetas[1])}</span>` : ''}
        </div>
        ${botonFavorito(exp.id, 'boton-favorito--vidrio')}
      </div>
      <div class="galeria__abajo">
        ${exp.sello ? `<span class="etiqueta">${icono('checkCirculo')} ${escapar(exp.sello)}</span>` : '<span></span>'}
        <span class="etiqueta etiqueta--calificacion">${icono('estrellaLlena')} ${exp.rating.toFixed(1)} <small>(${exp.numResenas})</small></span>
      </div>
      <div class="galeria__puntos" data-puntos>
        ${exp.galeria.map((_, i) => `<i class="${i === 0 ? 'es-activo' : ''}"></i>`).join('')}
      </div>
    </div>

    <!-- Barra de precio (fija al hacer scroll) -->
    <div class="barra-precio">
      <div>
        <strong>${exp.precio ? pesos(exp.precio) : 'Libre'} <small>${exp.precio ? 'COP' : ''}</small></strong>
        <span>${escapar(exp.precio ? exp.aporte : 'Aporte libre consciente')}</span>
      </div>
      <button class="boton boton--claro" data-ir="/reservar/${exp.id}">Reservar cupo</button>
    </div>

    <div class="contenido detalle">
      <p class="detalle__tipo">${icono('sello')} ${escapar(exp.tipo)}</p>
      <h1 class="detalle__titulo">${escapar(exp.tituloLargo || exp.titulo)}</h1>
      <p class="detalle__lema">${escapar(exp.lema)}</p>

      <!-- Anfitrión -->
      <button class="tarjeta-anfitrion" data-ver-anfitrion>
        <span class="tarjeta-anfitrion__foto">
          <img src="${anfitrion.foto}" alt="" />
          ${anfitrion.verificado ? `<span class="tarjeta-anfitrion__verificado">${icono('verificado')}</span>` : ''}
        </span>
        <span class="tarjeta-anfitrion__texto">
          <strong>${escapar(anfitrion.nombre)}</strong>
          <span>${escapar(anfitrion.comunidad)}</span>
          <small>${escapar(anfitrion.titulo)}</small>
        </span>
        ${icono('chevron')}
      </button>

      <!-- Datos clave -->
      <div class="datos">
        <div class="dato">
          <p class="dato__titulo">${icono('reloj')} Duración</p>
          <strong>${escapar(exp.duracion)}</strong>
          <small>${escapar(exp.duracionNota)}</small>
        </div>
        <div class="dato">
          <p class="dato__titulo">${icono('calendario')} Horarios</p>
          <strong>${escapar(exp.horariosTexto)}</strong>
          <small>${escapar(exp.horarioRango)}</small>
        </div>
        <div class="dato">
          <p class="dato__titulo">${icono('ubicacion')} Territorio</p>
          <strong>${escapar(exp.ubicacion.corto)}</strong>
          <small>${escapar(exp.ubicacion.referencia)}</small>
        </div>
        <div class="dato ${pocosCupos ? 'dato--urgente' : ''}">
          <p class="dato__titulo">${icono('personas')} Círculo íntimo</p>
          <strong>Máx. ${exp.cuposMax} cupos</strong>
          <small>${pocosCupos ? `¡Quedan ${exp.cuposRestantes} cupos!` : `${exp.cuposRestantes} cupos disponibles`}</small>
        </div>
      </div>

      <!-- Acerca de -->
      <h2 class="detalle__subtitulo">Acerca de este Saber</h2>
      <p class="detalle__parrafo">${escapar(exp.descripcion)}</p>

      <!-- Itinerario -->
      <div class="detalle__fila-titulo">
        <h2 class="detalle__subtitulo">Itinerario del Círculo</h2>
        <span>${exp.itinerario.length} momentos</span>
      </div>
      <ol class="itinerario">
        ${exp.itinerario
          .map(
            (paso, i) => `
          <li class="paso">
            <span class="paso__numero">${String(i + 1).padStart(2, '0')}</span>
            <div class="paso__texto">
              <small>${escapar(paso.hora)}</small>
              <strong>${escapar(paso.titulo)}</strong>
              <p>${escapar(paso.texto)}</p>
            </div>
            <span class="paso__icono">${icono(paso.icono)}</span>
          </li>`
          )
          .join('')}
      </ol>

      <!-- Qué llevar -->
      <div class="llevar">
        <h3>${icono('regalo')} ¿Qué llevar a la experiencia?</h3>
        <div class="llevar__lista">
          ${exp.llevar.map((l) => `<span>${icono(l.icono)} ${escapar(l.texto)}</span>`).join('')}
        </div>
      </div>

      <!-- Lugar de encuentro -->
      <div class="detalle__fila-titulo detalle__fila-titulo--arriba">
        <h2 class="detalle__subtitulo">Lugar de encuentro</h2>
        <span class="texto-terracota">${icono('navegar')} ${escapar(exp.ubicacion.municipio)}, ${escapar(exp.ubicacion.depto)}</span>
      </div>
      <p class="detalle__parrafo detalle__parrafo--corto">${escapar(exp.ubicacion.detalle)}</p>
      <div class="mini-mapa">
        <div class="mini-mapa__lienzo" data-mapa></div>
        <div class="mini-mapa__tarjeta">
          <span class="mini-mapa__icono">${icono('casa')}</span>
          <span><strong>${escapar(exp.ubicacion.lugar)}</strong><small>Punto exacto tras confirmar</small></span>
          <a class="texto-terracota" href="https://www.google.com/maps/search/?api=1&query=${exp.ubicacion.lat},${exp.ubicacion.lng}" target="_blank" rel="noopener" aria-label="Abrir en mapas">${icono('navegar')}</a>
        </div>
      </div>

      <!-- Reseñas -->
      <div class="detalle__fila-titulo">
        <h2 class="detalle__subtitulo">Reseñas</h2>
        <span class="calificacion">${icono('estrellaLlena')} ${exp.rating.toFixed(1)} · ${exp.numResenas} reseñas</span>
      </div>
      <div class="resenas">
        ${exp.resenas
          .map(
            (r) => `
          <article class="resena">
            <header>
              <img src="${r.foto}" alt="" loading="lazy" />
              <div><strong>${escapar(r.autor)}</strong><small>${escapar(r.fecha)}</small></div>
              <span class="resena__estrellas" aria-label="${r.estrellas} de 5 estrellas">${icono('estrellaLlena').repeat(r.estrellas)}</span>
            </header>
            <p>${escapar(r.texto)}</p>
          </article>`
          )
          .join('')}
      </div>

      <!-- Reciprocidad -->
      <div class="reciprocidad">
        <h3>${icono('grupo')} Economía de reciprocidad (Ayni)</h3>
        <p>${escapar(exp.reciprocidad)}</p>
      </div>
    </div>`
  );

  /* ---------- Puntos de la galería ---------- */
  const pista = el.querySelector('[data-galeria]');
  const puntos = el.querySelectorAll('[data-puntos] i');
  pista.addEventListener(
    'scroll',
    () => {
      const indice = Math.round(pista.scrollLeft / pista.clientWidth);
      puntos.forEach((p, i) => p.classList.toggle('es-activo', i === indice));
    },
    { passive: true }
  );

  /* ---------- Hoja con la información del anfitrión ---------- */
  el.querySelector('[data-ver-anfitrion]').addEventListener('click', () => {
    abrirModal({
      tipo: 'hoja',
      contenido: `
        <div class="perfil-anfitrion">
          <img src="${anfitrion.foto}" alt="" />
          <h2>${escapar(anfitrion.nombre)}</h2>
          <p class="perfil-anfitrion__titulo">${escapar(anfitrion.titulo)}</p>
          <p class="perfil-anfitrion__comunidad">${icono('ubicacion')} ${escapar(anfitrion.comunidad)}</p>
          <div class="perfil-anfitrion__datos">
            <span><strong>${anfitrion.anos}</strong> años compartiendo</span>
            <span><strong>${exp.rating.toFixed(1)}</strong> calificación</span>
          </div>
          <p class="perfil-anfitrion__bio">${escapar(anfitrion.bio)}</p>
          <button class="boton boton--oscuro boton--bloque" data-ir="/chat/${anfitrion.id}">${icono('mensaje')} Enviar mensaje</button>
        </div>`,
    });
  });

  /* ---------- Mini mapa (Leaflet + OpenStreetMap) ---------- */
  el.alMostrar = () => {
    const contenedor = el.querySelector('[data-mapa]');
    if (!window.L || !contenedor) return;
    const { lat, lng } = exp.ubicacion;
    const mapa = L.map(contenedor, {
      zoomControl: false,
      attributionControl: true,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    }).setView([lat - 0.012, lng], 12); // centro un poco al sur para que el marcador no quede bajo la tarjeta
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
      className: 'teselas-runa', // filtro de color cálido (ver CSS)
    }).addTo(mapa);
    L.marker([lat, lng], {
      icon: L.divIcon({ className: 'marcador-runa', html: `<span>${icono('casa')}</span>`, iconSize: [40, 40], iconAnchor: [20, 20] }),
    }).addTo(mapa);
    // Recalcula tamaño cuando termina la animación de entrada
    setTimeout(() => mapa.invalidateSize(), 400);
  };

  return el;
}
