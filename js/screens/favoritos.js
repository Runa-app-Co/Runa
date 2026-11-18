/* =========================================================
   RUNA · Mis favoritos
   Figma: marco "FAVORITOS"
   - Experiencias guardadas, ordenadas por urgencia
     (menos cupos primero)
   - Filtros por categoría
   - Tarjetas inmersivas con aviso de urgencia y CTA
   Ruta: #/favoritos
   ========================================================= */

import { crearPantalla, escapar, pesos } from '../ui.js';
import { icono } from '../iconos.js';
import { buscarExperiencia, buscarAnfitrion, buscarCategoria } from '../../data/datos.js';
import { listaFavoritos, alCambiarEstado } from '../estado.js';
import { botonFavorito } from '../componentes/tarjetas.js';

/** Texto y estilo del aviso de urgencia según los cupos. */
function urgencia(exp) {
  if (exp.cuposRestantes <= 2) return { clase: 'terracota', texto: `¡${exp.cuposRestantes} ${exp.cuposRestantes === 1 ? 'cupo' : 'cupos'}! Cierra pronto`, icono: 'reloj' };
  if (exp.cuposRestantes <= 4) return { clase: 'claro', texto: `Quedan ${exp.cuposRestantes} cupos`, punto: true };
  return { clase: 'oscuro', texto: 'Convocatoria abierta', icono: 'reloj' };
}

export function pantallaFavoritos() {
  let filtro = 'todos';

  const el = crearPantalla(
    'favoritos',
    `
    <div class="contenido">
      <div class="favoritos__cabecera aparecer">
        <h1 class="titulo-pantalla">Mis favoritos</h1>
        <span class="etiqueta etiqueta--durazno" data-conteo></span>
      </div>
      <p class="favoritos__ayuda aparecer" style="--i:1">${icono('reloj')} Priorizadas por urgencia de convocatoria y cupos disponibles</p>
      <div class="pildoras pildoras--blancas aparecer" style="--i:2" data-filtros></div>
      <div class="lista-favoritos" data-lista></div>
    </div>`
  );

  const lista = el.querySelector('[data-lista]');

  function tarjeta(exp, i) {
    const u = urgencia(exp);
    const cat = buscarCategoria(exp.categoria);
    const anfitrion = buscarAnfitrion(exp.anfitrion);
    // Tres variantes de pie de tarjeta, como en Figma
    const pies = [
      `<div><small>Aporte comunitario</small><strong>${exp.precio ? pesos(exp.precio) : 'Libre'} <em>/ ${escapar(exp.duracion)}</em></strong></div>
       <span class="boton boton--claro">Asegurar cupo ${icono('flecha')}</span>`,
      `<div class="favorito__anfitrion"><img src="${anfitrion.foto}" alt="" /><span><strong>${escapar(anfitrion.nombre)}</strong><small>${escapar(anfitrion.titulo)}</small></span></div>
       <div class="favorito__desde"><small>Desde</small><strong>${exp.precio ? pesos(exp.precio) : 'Libre'}</strong></div>`,
      `<div><small>Convocatoria</small><strong class="texto-normal">${escapar(exp.horariosTexto)}</strong></div>
       <span class="boton boton--claro boton--blanco">Ver programa ${icono('chevron')}</span>`,
    ];
    return `
      <article class="favorito aparecer" style="--i:${i + 3}" data-ir="/experiencia/${exp.id}" data-id="${exp.id}">
        <img class="favorito__foto" src="${exp.imagen}" alt="" loading="lazy" />
        <div class="favorito__capa"></div>
        <div class="favorito__arriba">
          <span class="urgencia urgencia--${u.clase}">${u.punto ? '<i></i>' : icono(u.icono)} ${escapar(u.texto)}</span>
          ${botonFavorito(exp.id, 'boton-favorito--claro')}
        </div>
        <div class="favorito__texto">
          <span class="etiqueta">${icono(cat.icono)} ${escapar(cat.nombre.split(' ')[0])}</span>
          <h2>${escapar(exp.titulo)}</h2>
          <p><span>${icono('ubicacion')} ${escapar(exp.ubicacion.corto)}</span><span>${icono('calendario')} ${escapar(exp.horariosTexto)}</span></p>
        </div>
        <div class="favorito__pie">${pies[i % 3]}</div>
      </article>`;
  }

  function pintar() {
    const favoritos = listaFavoritos()
      .map(buscarExperiencia)
      .filter(Boolean)
      .sort((a, b) => a.cuposRestantes - b.cuposRestantes);

    el.querySelector('[data-conteo]').textContent = `${favoritos.length} ${favoritos.length === 1 ? 'experiencia' : 'experiencias'}`;

    // Filtros: solo categorías que existen entre los favoritos
    const cats = [...new Set(favoritos.map((e) => e.categoria))];
    if (filtro !== 'todos' && !cats.includes(filtro)) filtro = 'todos';
    el.querySelector('[data-filtros]').innerHTML =
      `<button class="pildora ${filtro === 'todos' ? 'es-activa' : ''}" data-filtro="todos">Todos <i></i></button>` +
      cats
        .map((c) => `<button class="pildora ${filtro === c ? 'es-activa' : ''}" data-filtro="${c}">${escapar(buscarCategoria(c).nombre.split(' ')[0])}</button>`)
        .join('');

    const visibles = filtro === 'todos' ? favoritos : favoritos.filter((e) => e.categoria === filtro);
    lista.innerHTML = visibles.length
      ? visibles.map(tarjeta).join('')
      : `<div class="vacio"><strong>Aún no guardas saberes</strong>Toca el corazón en cualquier experiencia para guardarla aquí.<br/><br/>
         <button class="boton boton--primario" data-ir="/explorar">Explorar saberes ${icono('flecha')}</button></div>`;
  }

  el.addEventListener('click', (e) => {
    const f = e.target.closest('[data-filtro]');
    if (f) {
      filtro = f.dataset.filtro;
      pintar();
    }
  });

  // Si se quita un favorito, la tarjeta sale con animación
  const dejar = alCambiarEstado(() => {
    if (!el.isConnected) return dejar();
    const ids = listaFavoritos();
    const saliendo = [...lista.querySelectorAll('[data-id]')].filter((t) => !ids.includes(t.dataset.id));
    if (!saliendo.length) return;
    saliendo.forEach((t) => t.classList.add('esta-saliendo'));
    setTimeout(pintar, 380);
  });

  pintar();
  return el;
}
