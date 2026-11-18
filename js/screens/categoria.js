/* =========================================================
   RUNA · Listado por categoría
   Figma: marco "RUNA - Gastronomía Ancestral"
   - Título y descripción de la categoría
   - Píldoras: "Todos" + regiones con experiencias
   - Tarjetas verdes con foto, anfitrión y "Ver experiencia"
   Ruta: #/categoria/:id   (id = 'todas' muestra todo)
   Opcional: ?region=andina
   ========================================================= */

import { crearPantalla, escapar } from '../ui.js';
import { icono } from '../iconos.js';
import { experiencias, regiones, buscarCategoria } from '../../data/datos.js';
import { tarjetaCategoria } from '../componentes/tarjetas.js';
import { abrirCategorias } from './explorar.js';

export function pantallaCategoria({ id, consulta = {} }) {
  const categoria =
    id === 'todas'
      ? { id: 'todas', nombre: 'Todos los saberes', descripcion: 'Experiencias vivas en todos los territorios de Colombia.' }
      : buscarCategoria(id) || buscarCategoria('gastronomia');

  const base = categoria.id === 'todas' ? experiencias : experiencias.filter((e) => e.categoria === categoria.id);

  // Solo se muestran las regiones que tienen experiencias en esta categoría
  const regionesDisponibles = regiones.filter((r) => base.some((e) => e.region === r.id));
  let regionActiva = consulta.region || 'todas';

  const el = crearPantalla(
    'categoria',
    `
    <div class="contenido">
      <button class="enlace-atras aparecer" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
      <div class="categoria__cabecera aparecer" style="--i:1">
        <h1 class="titulo-pantalla">${escapar(categoria.nombre)}</h1>
        <button class="boton-icono" data-cambiar-categoria aria-label="Cambiar categoría">${icono('ajustes')}</button>
      </div>
      <p class="categoria__descripcion aparecer" style="--i:2">${escapar(categoria.descripcion)}</p>

      <div class="pildoras pildoras--rellenas aparecer" style="--i:3" role="tablist">
        <button class="pildora" data-region="todas" role="tab">${categoria.id === 'gastronomia' ? 'Todos los sabores' : 'Todos'}</button>
        ${regionesDisponibles.map((r) => `<button class="pildora" data-region="${r.id}" role="tab">${escapar(r.nombre)}</button>`).join('')}
      </div>

      <div class="lista-verde" data-lista></div>
    </div>`
  );

  const lista = el.querySelector('[data-lista]');

  function pintar() {
    const filtradas = regionActiva === 'todas' ? base : base.filter((e) => e.region === regionActiva);
    el.querySelectorAll('[data-region]').forEach((b) => {
      const activa = b.dataset.region === regionActiva;
      b.classList.toggle('es-activa', activa);
      b.setAttribute('aria-selected', activa);
    });
    lista.innerHTML = filtradas.length
      ? filtradas.map((e, i) => `<div class="aparecer" style="--i:${i + 3}">${tarjetaCategoria(e)}</div>`).join('')
      : `<div class="vacio"><strong>Pronto habrá saberes aquí</strong>Estamos tejiendo alianzas con comunidades de este territorio.</div>`;
  }

  el.addEventListener('click', (e) => {
    const region = e.target.closest('[data-region]');
    if (region) {
      regionActiva = region.dataset.region;
      pintar();
      // Centra la píldora tocada dentro de su fila (sin mover el resto de la pantalla)
      const fila = region.parentElement;
      fila.scrollTo({ left: region.offsetLeft - (fila.clientWidth - region.offsetWidth) / 2, behavior: 'smooth' });
    }
    if (e.target.closest('[data-cambiar-categoria]')) abrirCategorias(categoria.id);
  });

  pintar();
  return el;
}
