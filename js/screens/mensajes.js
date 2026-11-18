/* =========================================================
   RUNA · Lista de Mensajes
   Figma: marco "MENSAJES"
   - Título con contador "4 nuevos" y botón de nuevo mensaje
   - Buscador y filtros: Todos · Viajeros · Amigos · Comunidades
   - "En ruta ahora": avatares de personas activas
   - Tarjetas de conversación + "Consejo de sabiduría RUNA"
   Ruta: #/mensajes
   ========================================================= */

import { crearPantalla, escapar, normalizar } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal } from '../modal.js';
import { enRuta, consejo, contactos } from '../../data/mensajes.js';
import { anfitriones } from '../../data/datos.js';
import { listaConversaciones, totalNoLeidos, buscarPersona } from '../chats.js';

const FILTROS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'viajeros', nombre: 'Viajeros' },
  { id: 'amigos', nombre: 'Amigos' },
  { id: 'comunidades', nombre: 'Comunidades' },
  { id: 'anfitriones', nombre: 'Anfitriones' },
];

export function pantallaMensajes() {
  let filtro = 'todos';
  let texto = '';
  const nuevos = totalNoLeidos();

  const el = crearPantalla(
    'mensajes',
    `
    <div class="contenido">
      <div class="mensajes__cabecera aparecer">
        <h1 class="titulo-pantalla">Mensajes</h1>
        ${nuevos ? `<span class="insignia-nuevos">${nuevos} ${nuevos === 1 ? 'nuevo' : 'nuevos'}</span>` : ''}
        <button class="boton-cuadrado" data-nuevo aria-label="Nuevo mensaje">${icono('editar')}</button>
      </div>

      <label class="buscador buscador--blanco aparecer" style="--i:1">
        <span class="buscador__icono">${icono('buscar')}</span>
        <input type="search" placeholder="Buscar amigos, viajeros o comunidades." data-buscar autocomplete="off" />
        <span class="buscador__icono buscador__icono--gris">${icono('ajustes')}</span>
      </label>

      <div class="pildoras pildoras--grises aparecer" style="--i:2">
        ${FILTROS.map((f) => `<button class="pildora" data-filtro="${f.id}">${f.nombre}</button>`).join('')}
      </div>

      <div class="titulo-seccion titulo-seccion--mini aparecer" style="--i:3">
        <h2>En ruta ahora</h2>
        <button class="enlace-ver-todo" data-ver-activos>Ver activos</button>
      </div>
      <div class="en-ruta aparecer" style="--i:3">
        ${enRuta
          .map((id, i) => {
            const p = buscarPersona(id);
            return `<button class="en-ruta__persona ${i === 0 ? 'es-destacada' : ''}" data-ir="/chat/${id}">
              <span class="avatar avatar--grande">
                <img src="${p.foto}" alt="" />
                ${p.enLinea ? '<i class="punto-en-linea"></i>' : ''}
              </span>
              <span>${escapar(p.corto)}</span>
            </button>`;
          })
          .join('')}
      </div>

      <div class="lista-chats" data-lista></div>
    </div>`
  );

  const lista = el.querySelector('[data-lista]');

  function tarjeta(conv, i) {
    const p = conv.persona;
    const ultimo = conv.mensajes[conv.mensajes.length - 1];
    const vista = ultimo
      ? `${ultimo.de === 'yo' ? 'Tú: ' : ''}${ultimo.tipo === 'experiencia' ? '📍 Compartió una experiencia' : ultimo.texto}`
      : 'Escribe el primer mensaje';
    const derecha = conv.noLeidos
      ? `<span class="chat-item__hora es-nueva">${escapar(ultimo.hora)}</span><span class="chat-item__contador">${conv.noLeidos}</span>`
      : `<span class="chat-item__hora">${escapar(ultimo?.hora || '')}</span>
         <span class="chat-item__check ${conv.leidoPorOtro ? 'es-leido' : ''}">${icono('check')}${conv.leidoPorOtro ? icono('check') : ''}</span>`;
    return `
      <a class="chat-item aparecer" style="--i:${i + 4}" href="#/chat/${conv.id}">
        <span class="avatar">
          <img src="${p.foto}" alt="" />
          ${p.enLinea ? '<i class="punto-en-linea"></i>' : ''}
        </span>
        <span class="chat-item__centro">
          <span class="chat-item__nombre">
            <strong>${escapar(p.nombre)}</strong>
            <span class="etiqueta-lugar ${p.lugarDestacado ? 'es-destacada' : ''}">${escapar(p.lugar)}</span>
          </span>
          <span class="chat-item__texto ${conv.noLeidos ? 'es-nuevo' : ''}">${escapar(vista)}</span>
        </span>
        <span class="chat-item__derecha">${derecha}</span>
      </a>`;
  }

  function pintar() {
    el.querySelectorAll('[data-filtro]').forEach((b) => b.classList.toggle('es-activa', b.dataset.filtro === filtro));
    const t = normalizar(texto);
    const convs = listaConversaciones().filter(
      (c) =>
        (filtro === 'todos' || c.persona.tipo === filtro) &&
        (!t || normalizar(c.persona.nombre + ' ' + c.persona.lugar + ' ' + c.mensajes.map((m) => m.texto).join(' ')).includes(t))
    );
    if (!convs.length) {
      lista.innerHTML = `<div class="vacio"><strong>Sin conversaciones aquí</strong>Escribe a un anfitrión desde cualquier experiencia o toca ✎ para empezar.</div>`;
      return;
    }
    // La frase del consejo se intercala después del segundo chat (como en Figma)
    lista.innerHTML = convs
      .map(
        (c, i) =>
          tarjeta(c, i) +
          (i === 1 && filtro === 'todos' && !t
            ? `<blockquote class="consejo aparecer" style="--i:6">${icono('sol')}<p>${escapar(consejo.texto)}<cite>${escapar(consejo.autor)}</cite></p></blockquote>`
            : '')
      )
      .join('');
  }

  /* ---------- Hoja "Nuevo mensaje" ---------- */
  function abrirNuevo(soloActivos = false) {
    const personas = [
      ...contactos.filter((c) => !soloActivos || c.enLinea).map((c) => buscarPersona(c.id)),
      ...(soloActivos ? [] : anfitriones.map((a) => buscarPersona(a.id))),
    ];
    abrirModal({
      tipo: 'hoja',
      titulo: soloActivos ? 'En ruta ahora' : 'Nuevo mensaje',
      clase: 'modal-opciones',
      contenido: `<div class="opciones">
        ${personas
          .map(
            (p) => `<button class="opcion opcion--persona" data-ir="/chat/${p.id}">
              <img src="${p.foto}" alt="" />
              <span><strong>${escapar(p.nombre)}</strong><small>${escapar(p.esAnfitrion ? p.titulo : p.lugar)}</small></span>
            </button>`
          )
          .join('')}
      </div>`,
    });
  }

  el.addEventListener('click', (e) => {
    const f = e.target.closest('[data-filtro]');
    if (f) {
      filtro = f.dataset.filtro;
      pintar();
    }
    if (e.target.closest('[data-nuevo]')) abrirNuevo();
    if (e.target.closest('[data-ver-activos]')) abrirNuevo(true);
  });
  el.querySelector('[data-buscar]').addEventListener('input', (e) => {
    texto = e.target.value.trim();
    pintar();
  });

  pintar();
  return el;
}
