/* =========================================================
   RUNA · Perfil
   Figma: marco "PERFIL - PAU G"
   - Foto, nombre, usuario, ciudad y biografía
   - Estadísticas y botones (Caminar juntas, mensaje, compartir)
   - Insignias de saberes (carrusel)
   - Pestañas: Momentos en territorio · Mis reservas
   - Opción para reiniciar los datos entre testers
   Ruta: #/perfil
   ========================================================= */

import { crearPantalla, escapar, aviso, pesos } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal, cerrarModal } from '../modal.js';
import { usuario, buscarExperiencia } from '../../data/datos.js';
import { perfil } from '../../data/comunidad.js';
import { listaReservas, reiniciarEstado } from '../estado.js';
import { reiniciarChats } from '../chats.js';
import { usarUbicacionSimulada } from '../ubicacion.js';
import { fechaLarga } from './reservar.js';

export function pantallaPerfil({ consulta = {} } = {}) {
  // Si se llega con #/perfil?pestana=reservas se abre esa pestaña
  let pestana = consulta.pestana === 'reservas' ? 'reservas' : 'momentos';
  const { saberes, encuentros, territorios } = perfil.estadisticas;

  const el = crearPantalla(
    'perfil',
    `
    <div class="contenido">
      <div class="perfil__cabecera aparecer">
        <span class="perfil__foto">
          <img src="${usuario.foto}" alt="" />
          <i>${icono('planta')}</i>
        </span>
        <h1>${escapar(usuario.nombre)}</h1>
        <p class="perfil__meta"><span>${escapar(usuario.usuario)}</span> • ${icono('ubicacion')} ${escapar(usuario.ciudad)}</p>
        <p class="perfil__bio">${escapar(perfil.bio)}</p>
      </div>

      <div class="perfil__stats aparecer" style="--i:1">
        <span><i></i>${saberes} Saberes activos</span>
        <span>${encuentros} Encuentros</span>
        <span>${territorios} Territorios</span>
      </div>

      <div class="perfil__botones aparecer" style="--i:2">
        <button class="boton boton--oscuro" data-caminar>${icono('grupo')} Caminar Juntas</button>
        <button class="boton-cuadrado boton-cuadrado--claro" data-ir="/mensajes" aria-label="Mensajes">${icono('sobre')}</button>
        <button class="boton-cuadrado boton-cuadrado--claro" data-compartir aria-label="Compartir perfil">${icono('compartir')}</button>
      </div>

      <div class="titulo-seccion titulo-seccion--con-sub aparecer" style="--i:3">
        <div>
          <h2>Insignias de Saberes</h2>
          <p>Reconocimientos de custodia otorgados por ancianos y colectivos</p>
        </div>
        <span class="texto-terracota perfil__contador">${perfil.insignias.length}/5</span>
      </div>
      <div class="insignias aparecer" style="--i:4">
        ${perfil.insignias
          .map(
            (b) => `
          <button class="insignia" data-insignia="${escapar(b.nombre)}">
            <span class="insignia__icono insignia__icono--${b.color}">${icono(b.icono)}</span>
            <small class="${b.nivel ? 'es-nivel' : ''}">${escapar(b.elemento)}${b.nivel ? ` • ${escapar(b.nivel)}` : ''}</small>
            <strong>${escapar(b.nombre)}</strong>
          </button>`
          )
          .join('')}
      </div>

      <div class="perfil__pestanas aparecer" style="--i:5">
        <button data-pestana="momentos">Momentos en territorio</button>
        <button data-pestana="reservas">Mis reservas</button>
      </div>
      <div data-contenido-pestana></div>

      <button class="perfil__reiniciar" data-reiniciar>${icono('capas')} Reiniciar datos de prueba</button>
    </div>`
  );

  const zona = el.querySelector('[data-contenido-pestana]');

  function momentos() {
    return `<div class="momentos">
      ${perfil.momentos
        .map(
          (m) => `
        <figure class="momento ${m.alto ? 'momento--alto' : ''} ${m.ancho ? 'momento--ancho' : ''}">
          <img src="${m.imagen}" alt="" loading="lazy" />
          <figcaption>
            ${m.etiqueta ? `<small>${escapar(m.etiqueta)}</small>` : ''}
            <strong>${escapar(m.titulo)}</strong>
            ${m.lugar ? `<span>${escapar(m.lugar)}</span>` : ''}
          </figcaption>
        </figure>`
        )
        .join('')}
    </div>`;
  }

  function reservas() {
    const lista = listaReservas();
    if (!lista.length) {
      return `<div class="vacio"><strong>Aún no tienes reservas</strong>Explora un saber y reserva tu cupo.<br/><br/>
        <button class="boton boton--primario" data-ir="/explorar">Explorar saberes ${icono('flecha')}</button></div>`;
    }
    return `<div class="mis-reservas">
      ${lista
        .map((r) => {
          const exp = buscarExperiencia(r.experiencia);
          return `<a class="tarjeta-compacta" href="#/reserva/${r.codigo}">
            <img src="${exp.imagen}" alt="" />
            <div class="tarjeta-compacta__texto">
              <h3>${escapar(exp.titulo)}</h3>
              <p>${fechaLarga(new Date(r.fecha))} · ${escapar(r.hora)}</p>
              <strong>${r.personas} ${r.personas === 1 ? 'persona' : 'personas'} · ${pesos(r.total)}</strong>
            </div>
            ${icono('chevron')}
          </a>`;
        })
        .join('')}
    </div>`;
  }

  function pintar() {
    el.querySelectorAll('[data-pestana]').forEach((b) => b.classList.toggle('es-activa', b.dataset.pestana === pestana));
    zona.innerHTML = pestana === 'momentos' ? momentos() : reservas();
  }

  el.addEventListener('click', async (e) => {
    const t = e.target;
    const p = t.closest('[data-pestana]');
    if (p) {
      pestana = p.dataset.pestana;
      pintar();
    }
    if (t.closest('[data-caminar]')) aviso('Invitación para caminar juntas enviada (simulado)');
    const insignia = t.closest('[data-insignia]');
    if (insignia) aviso(`Insignia: ${insignia.dataset.insignia}`);
    if (t.closest('[data-compartir]')) {
      if (navigator.share) {
        try {
          await navigator.share({ title: `${usuario.nombre} en RUNA`, url: location.href.split('#')[0] });
        } catch {
          /* cancelado */
        }
      } else aviso('Enlace del perfil copiado');
    }
    if (t.closest('[data-reiniciar]')) {
      const { el: modal } = abrirModal({
        titulo: '¿Reiniciar datos?',
        contenido: `<p class="modal__texto">Se borrarán las reservas, favoritos, mensajes y publicaciones hechas en este celular. Útil para empezar una nueva sesión de prueba.</p>
          <div class="modal__acciones">
            <button class="boton boton--contorno" data-cerrar>Cancelar</button>
            <button class="boton boton--primario" data-confirmar-reinicio>Reiniciar</button>
          </div>`,
      });
      modal.querySelector('[data-confirmar-reinicio]').addEventListener('click', () => {
        reiniciarEstado();
        reiniciarChats();
        usarUbicacionSimulada();
        cerrarModal();
        aviso('Datos reiniciados');
        pestana = 'momentos';
        pintar();
      });
    }
  });

  pintar();
  return el;
}
