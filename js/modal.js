/* =========================================================
   RUNA · Ventanas emergentes (pop-ups y hojas inferiores)
   - tipo 'centro': tarjeta centrada (como el pop-up de
     categorías y el de confirmación en Figma)
   - tipo 'hoja': sube desde abajo (bottom sheet)
   Se cierran tocando fuera, con la X o con la tecla Esc.
   ========================================================= */

import { icono } from './iconos.js';

let abierto = null;

/**
 * Abre una ventana emergente.
 * @param {object} op
 * @param {string} op.titulo
 * @param {string} op.contenido  HTML interno
 * @param {'centro'|'hoja'} [op.tipo='centro']
 * @param {Function} [op.alCerrar]
 * @returns {{el: HTMLElement, cerrar: Function}}
 */
export function abrirModal({ titulo = '', contenido = '', tipo = 'centro', alCerrar, clase = '' }) {
  cerrarModal();

  const capa = document.createElement('div');
  capa.className = `modal modal--${tipo}`;
  capa.innerHTML = `
    <div class="modal__fondo" data-cerrar></div>
    <div class="modal__caja ${clase}" role="dialog" aria-modal="true" aria-label="${titulo}">
      ${tipo === 'hoja' ? '<span class="modal__asa" aria-hidden="true"></span>' : ''}
      ${
        titulo
          ? `<div class="modal__cabecera">
              <h2 class="modal__titulo">${titulo}</h2>
              <button class="modal__cerrar" data-cerrar aria-label="Cerrar">${icono('cerrar')}</button>
            </div>`
          : `<button class="modal__cerrar modal__cerrar--flotante" data-cerrar aria-label="Cerrar">${icono('cerrar')}</button>`
      }
      <div class="modal__contenido">${contenido}</div>
    </div>`;

  document.getElementById('app').appendChild(capa);
  requestAnimationFrame(() => capa.classList.add('esta-abierto'));

  const cerrar = () => {
    if (!capa.isConnected) return;
    capa.classList.remove('esta-abierto');
    capa.classList.add('esta-cerrando');
    setTimeout(() => capa.remove(), 280);
    document.removeEventListener('keydown', teclado);
    if (abierto && abierto.el === capa) abierto = null;
    alCerrar && alCerrar();
  };

  const teclado = (e) => e.key === 'Escape' && cerrar();
  document.addEventListener('keydown', teclado);
  capa.addEventListener('click', (e) => {
    if (e.target.closest('[data-cerrar]')) cerrar();
  });

  // Si se navega a otra pantalla, la ventana se cierra sola
  window.addEventListener('hashchange', cerrar, { once: true });

  abierto = { el: capa, cerrar };
  return abierto;
}

/** Cierra la ventana que esté abierta (si hay alguna). */
export function cerrarModal() {
  if (abierto) abierto.cerrar();
}
