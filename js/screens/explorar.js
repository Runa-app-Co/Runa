/* =========================================================
   RUNA · Pantalla Explorar (Inicio)
   Figma: marco "HOME"
   - Buscador "¿Qué Saber quieres descubrir?"
   - Filtros "Descubre por": Lugares · Saber · Sabio · Aprende y ayuda
   - Carrusel "Cerca de ti" (ordenado por distancia)
   - "Recomendados" (tarjetas inmersivas)
   ========================================================= */

import { crearPantalla, normalizar, escapar } from '../ui.js';
import { icono } from '../iconos.js';
import { ir } from '../router.js';
import { abrirModal } from '../modal.js';
import { experiencias, categorias, regiones, anfitriones, buscarAnfitrion, buscarCategoria } from '../../data/datos.js';
import { tarjetaCerca, tarjetaInmersiva, tarjetaCompacta, distanciaA } from '../componentes/tarjetas.js';

// Experiencias que aparecen en "Recomendados"
const RECOMENDADAS = ['biorefugios', 'cesteria', 'chicha', 'cacao'];

export function pantallaExplorar() {
  const cercanas = [...experiencias].sort((a, b) => distanciaA(a) - distanciaA(b)).slice(0, 5);
  const recomendadas = RECOMENDADAS.map((id) => experiencias.find((e) => e.id === id));

  const el = crearPantalla(
    'explorar',
    `
    <div class="contenido">
      <h1 class="titulo-pantalla aparecer">Explorar</h1>

      <!-- Buscador -->
      <label class="buscador aparecer" style="--i:1">
        <span class="buscador__icono">${icono('buscar')}</span>
        <input type="search" placeholder="¿Qué Saber quieres descubrir?" autocomplete="off" enterkeyhint="search" data-buscador />
        <button type="button" class="buscador__ajustes" data-abrir="saber" aria-label="Filtrar por categoría">${icono('ajustes')}</button>
      </label>

      <!-- Resultados de búsqueda (ocultos hasta escribir) -->
      <section class="resultados" data-resultados hidden></section>

      <div data-secciones>
        <!-- Descubre por -->
        <div class="descubre aparecer" style="--i:2">
          <div class="descubre__cabecera">
            <h2>Descubre por</h2>
            <span>Filtro temático</span>
          </div>
          <div class="pildoras">
            <button class="pildora" data-abrir="lugares">Lugares</button>
            <button class="pildora" data-abrir="saber">Saber</button>
            <button class="pildora" data-abrir="sabio">Sabio</button>
            <button class="pildora" data-abrir="aprende">Aprende y ayuda</button>
          </div>
        </div>

        <!-- Cerca de ti -->
        <div class="titulo-seccion aparecer" style="--i:3">
          <h2 class="con-icono">${icono('navegar')} Cerca de ti</h2>
          <a class="enlace-ver-todo" href="#/mapa">Ver todo ${icono('chevron')}</a>
        </div>
        <div class="carrusel aparecer" style="--i:4">
          ${cercanas.map(tarjetaCerca).join('')}
        </div>

        <!-- Recomendados -->
        <div class="titulo-seccion titulo-seccion--con-sub aparecer" style="--i:5">
          <div>
            <h2>Recomendados</h2>
            <p>Saberes que restauran el tejido social y la tierra</p>
          </div>
          <button class="boton-icono" data-abrir="saber" aria-label="Filtrar">${icono('filtro')}</button>
        </div>
        <div class="lista-inmersiva">
          ${recomendadas.map((e, i) => `<div class="aparecer" style="--i:${6 + i}">${tarjetaInmersiva(e)}</div>`).join('')}
        </div>
      </div>
    </div>`
  );

  /* ---------- Buscador en vivo ---------- */
  const campo = el.querySelector('[data-buscador]');
  const resultados = el.querySelector('[data-resultados]');
  const secciones = el.querySelector('[data-secciones]');

  campo.addEventListener('input', () => {
    const texto = normalizar(campo.value.trim());
    if (!texto) {
      resultados.hidden = true;
      secciones.hidden = false;
      return;
    }
    // Busca en título, resumen, lugar, anfitrión y categoría
    const encontrados = experiencias.filter((e) => {
      const a = buscarAnfitrion(e.anfitrion);
      const c = buscarCategoria(e.categoria);
      return normalizar(
        [e.titulo, e.resumen, e.ubicacion.municipio, e.ubicacion.depto, a.nombre, c.nombre, ...e.etiquetas].join(' ')
      ).includes(texto);
    });
    secciones.hidden = true;
    resultados.hidden = false;
    resultados.innerHTML = encontrados.length
      ? `<p class="resultados__conteo">${encontrados.length} ${encontrados.length === 1 ? 'saber encontrado' : 'saberes encontrados'}</p>
         ${encontrados.map(tarjetaCompacta).join('')}`
      : `<div class="vacio">
           <strong>No encontramos ese saber… todavía</strong>
           Prueba con "maíz", "barro", "Boyacá" o el nombre de un sabedor.
         </div>`;
  });

  /* ---------- Filtros "Descubre por" ---------- */
  el.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-abrir]');
    if (!boton) return;
    e.preventDefault();
    const tipo = boton.dataset.abrir;
    if (tipo === 'saber') abrirCategorias();
    if (tipo === 'lugares') abrirLugares();
    if (tipo === 'sabio') abrirSabios();
    if (tipo === 'aprende') ir('/categoria/bioconstruccion');
  });

  return el;
}

/* ---------------------------------------------------------
   Pop-up "Selecciona una categoría" (igual a Figma)
   --------------------------------------------------------- */
export function abrirCategorias(seleccionada = 'gastronomia') {
  abrirModal({
    titulo: 'Selecciona una categoría',
    clase: 'modal-opciones',
    contenido: `
      <div class="opciones">
        ${categorias
          .map(
            (c) => `
          <button class="opcion ${c.id === seleccionada ? 'es-activa' : ''}" data-ir="/categoria/${c.id}">
            <span class="opcion__icono">${icono(c.id === seleccionada ? 'checkCirculo' : c.icono)}</span>
            ${escapar(c.nombre)}
          </button>`
          )
          .join('')}
      </div>`,
  });
}

/** Pop-up de regiones: lleva al listado filtrado por lugar. */
function abrirLugares() {
  abrirModal({
    titulo: 'Explora por territorio',
    clase: 'modal-opciones',
    contenido: `
      <div class="opciones">
        ${regiones
          .map((r) => {
            const total = experiencias.filter((e) => e.region === r.id).length;
            return `<button class="opcion" data-ir="/categoria/todas?region=${r.id}">
              <span class="opcion__icono">${icono('montana')}</span>
              ${escapar(r.nombre)} <small>${total}</small>
            </button>`;
          })
          .join('')}
      </div>`,
  });
}

/** Pop-up de sabedores: lleva a la experiencia de cada anfitrión. */
function abrirSabios() {
  abrirModal({
    titulo: 'Aprende de un sabio',
    clase: 'modal-opciones',
    contenido: `
      <div class="opciones">
        ${anfitriones
          .map((a) => {
            const exp = experiencias.find((e) => e.anfitrion === a.id);
            return `<button class="opcion opcion--persona" data-ir="/experiencia/${exp.id}">
              <img src="${a.foto}" alt="" />
              <span><strong>${escapar(a.nombre)}</strong><small>${escapar(a.titulo)}</small></span>
            </button>`;
          })
          .join('')}
      </div>`,
  });
}
