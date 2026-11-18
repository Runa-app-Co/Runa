/* =========================================================
   RUNA · Tarjetas de experiencia
   Varias versiones de la misma tarjeta, tal como aparecen
   en Figma. Cada función recibe una experiencia (de
   data/datos.js) y devuelve HTML.
   ========================================================= */

import { icono } from '../iconos.js';
import { buscarAnfitrion, buscarCategoria, usuario } from '../../data/datos.js';
import { esFavorito } from '../estado.js';
import { pesos, pesosCorto, distanciaKm, textoDistancia, escapar } from '../ui.js';

/** Texto del precio según el tipo de aporte. */
export function textoPrecio(exp, corto = false) {
  if (!exp.precio) return 'Aporte libre consciente';
  return corto ? `${pesosCorto(exp.precio)} COP` : pesos(exp.precio);
}

/** Distancia desde la ubicación de la persona hasta la experiencia. */
export function distanciaA(exp) {
  return distanciaKm(usuario.ubicacion, exp.ubicacion);
}

/** Botón de corazón para guardar en favoritos. */
export function botonFavorito(id, clase = '') {
  const activo = esFavorito(id);
  return `
    <button class="boton-favorito ${clase} ${activo ? 'es-activo' : ''}"
      data-favorito="${id}" aria-pressed="${activo}"
      aria-label="${activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}">
      <span class="boton-favorito__vacio">${icono('corazon')}</span>
      <span class="boton-favorito__lleno">${icono('corazonLleno')}</span>
    </button>`;
}

/* ---------------------------------------------------------
   1) "Cerca de ti" — tarjeta horizontal pequeña
   --------------------------------------------------------- */
export function tarjetaCerca(exp) {
  const anfitrion = buscarAnfitrion(exp.anfitrion);
  return `
    <article class="tarjeta-cerca" data-ir="/experiencia/${exp.id}" tabindex="0">
      <div class="tarjeta-cerca__foto">
        <img src="${exp.imagen}" alt="" loading="lazy" />
        <span class="etiqueta tarjeta-cerca__distancia">${textoDistancia(distanciaA(exp))}</span>
        <span class="tarjeta-cerca__lugar">${icono('ubicacion')} ${escapar(exp.ubicacion.municipio)}</span>
      </div>
      <div class="tarjeta-cerca__cuerpo">
        <h3 class="tarjeta-cerca__titulo">${escapar(exp.titulo)}</h3>
        <p class="tarjeta-cerca__anfitrion">Con ${escapar(anfitrion.nombre)}</p>
        <div class="tarjeta-cerca__precio">
          <span>${exp.precio ? 'Aporte recíproco' : 'Minga'}</span>
          <strong>${textoPrecio(exp, true)}</strong>
        </div>
      </div>
    </article>`;
}

/* ---------------------------------------------------------
   2) "Recomendados" — tarjeta inmersiva con foto de fondo
   --------------------------------------------------------- */
export function tarjetaInmersiva(exp) {
  const categoria = buscarCategoria(exp.categoria);
  const segunda = exp.destacada || exp.etiquetas[1];
  const pie = exp.precio
    ? `<span>${icono('ubicacion')} ${escapar(exp.ubicacion.municipio)} • ${escapar(exp.ubicacion.referencia)}</span><strong class="texto-blanco">${pesos(exp.precio)} COP</strong>`
    : `<span>${icono('calendario')} ${escapar(exp.horariosTexto)} • ${escapar(exp.duracion)}</span><strong>${textoPrecio(exp)}</strong>`;
  return `
    <article class="tarjeta-inmersiva" data-ir="/experiencia/${exp.id}" tabindex="0">
      <img class="tarjeta-inmersiva__fondo" src="${exp.imagen}" alt="" loading="lazy" />
      <div class="tarjeta-inmersiva__capa"></div>
      <div class="tarjeta-inmersiva__arriba">
        <div class="tarjeta-inmersiva__etiquetas">
          <span class="etiqueta">${icono(categoria.icono)} ${escapar(exp.etiquetas[0])}</span>
          ${segunda ? `<span class="etiqueta etiqueta--durazno">${escapar(segunda)}</span>` : ''}
        </div>
        ${botonFavorito(exp.id)}
      </div>
      <div class="tarjeta-inmersiva__texto">
        <h3>${escapar(exp.titulo)}</h3>
        <p>${escapar(exp.resumen)}</p>
      </div>
      <div class="tarjeta-inmersiva__pie">${pie}</div>
    </article>`;
}

/* ---------------------------------------------------------
   3) Listado por categoría — tarjeta verde con foto arriba
   --------------------------------------------------------- */
export function tarjetaCategoria(exp) {
  const anfitrion = buscarAnfitrion(exp.anfitrion);
  const etiquetaExtra = exp.destacada
    ? `<span class="etiqueta etiqueta--durazno">${icono('estrella')} ${escapar(exp.destacada)}</span>`
    : '';
  return `
    <article class="tarjeta-verde" data-ir="/experiencia/${exp.id}" tabindex="0">
      <div class="tarjeta-verde__foto">
        <img src="${exp.imagen}" alt="" loading="lazy" />
        <div class="tarjeta-verde__etiquetas">
          ${etiquetaExtra}
          <span class="etiqueta">${escapar(exp.tipo)}</span>
        </div>
        <div class="tarjeta-verde__datos">
          <span class="tarjeta-verde__chip">${icono('reloj')} ${escapar(exp.duracion)} <i></i> ${icono('personas')} ${exp.cuposRestantes} cupos</span>
          <span class="tarjeta-verde__precio">${exp.precio ? pesos(exp.precio) : 'Libre'}<small>${exp.precio ? 'COP' : ''}</small></span>
        </div>
      </div>
      <div class="tarjeta-verde__cuerpo">
        <p class="tarjeta-verde__lugar">${icono('ubicacion')} ${escapar(exp.ubicacion.municipio)}, ${escapar(exp.ubicacion.depto)}</p>
        <h3 class="tarjeta-verde__titulo">${escapar(exp.titulo)}</h3>
        <div class="tarjeta-verde__anfitrion">
          <img src="${anfitrion.foto}" alt="" loading="lazy" />
          <div>
            <small>${escapar(anfitrion.titulo)}</small>
            <span>${escapar(anfitrion.nombre)}</span>
          </div>
        </div>
        <p class="tarjeta-verde__resumen">${escapar(exp.resumen)}</p>
        <div class="tarjeta-verde__pie">
          <em>${escapar(exp.lema)}</em>
          <span class="boton boton--claro boton--pequeno">Ver experiencia ${icono('flecha')}</span>
        </div>
      </div>
    </article>`;
}

/* ---------------------------------------------------------
   4) Resultado de búsqueda — fila compacta
   --------------------------------------------------------- */
export function tarjetaCompacta(exp) {
  const anfitrion = buscarAnfitrion(exp.anfitrion);
  return `
    <article class="tarjeta-compacta" data-ir="/experiencia/${exp.id}" tabindex="0">
      <img src="${exp.imagen}" alt="" loading="lazy" />
      <div class="tarjeta-compacta__texto">
        <h3>${escapar(exp.titulo)}</h3>
        <p>${escapar(anfitrion.nombre)} · ${escapar(exp.ubicacion.municipio)}</p>
        <strong>${textoPrecio(exp, true)}</strong>
      </div>
      ${icono('chevron')}
    </article>`;
}
