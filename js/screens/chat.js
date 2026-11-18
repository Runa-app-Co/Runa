/* =========================================================
   RUNA · Vista de chat (simulado)
   Figma: marco "CHAT"
   - Cabecera con nombre y "En línea"
   - Burbujas recibidas (gris) y enviadas (terracota)
   - Tarjeta de experiencia compartida dentro del chat
   - "… está escribiendo" y respuesta automática
   - Barra para escribir: +, cámara, texto y enviar
   Ruta: #/chat/:id   (id de contacto o de anfitrión)
   ========================================================= */

import { crearPantalla, escapar, vibrar, aviso } from '../ui.js';
import { icono } from '../iconos.js';
import { buscarExperiencia } from '../../data/datos.js';
import { obtenerConversacion, agregarMensaje, siguienteRespuesta, marcarLeida } from '../chats.js';

export function pantallaChat({ id }) {
  const conv = obtenerConversacion(id);
  if (!conv) {
    return crearPantalla('chat', `<div class="contenido"><div class="vacio"><strong>Chat no encontrado</strong></div></div>`);
  }
  const p = conv.persona;
  marcarLeida(id);

  const el = crearPantalla(
    'chat',
    `
    <header class="chat__cabecera">
      <button class="boton-icono boton-icono--plano" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
      <div class="chat__persona">
        <strong>${escapar(p.nombre)}</strong>
        <small class="${p.enLinea ? 'en-linea' : ''}">${p.enLinea ? 'En línea' : 'Activo hace un rato'}</small>
      </div>
      <button class="boton-icono boton-icono--plano" data-mas aria-label="Más opciones">${icono('puntos')}</button>
    </header>

    <div class="chat__mensajes" data-mensajes role="log" aria-live="polite"></div>

    <form class="chat__barra" data-formulario autocomplete="off">
      <button type="button" class="boton-icono boton-icono--plano" data-adjuntar aria-label="Adjuntar">${icono('mas')}</button>
      <button type="button" class="boton-icono boton-icono--plano" data-adjuntar aria-label="Enviar foto">${icono('camara')}</button>
      <input type="text" placeholder="Comparte la palabra con ${escapar(p.corto)}" data-campo enterkeyhint="send" />
      <button type="submit" class="chat__enviar" aria-label="Enviar" disabled>${icono('enviar')}</button>
    </form>`
  );

  const contenedor = el.querySelector('[data-mensajes]');
  const campo = el.querySelector('[data-campo]');
  const enviar = el.querySelector('.chat__enviar');

  /* ---------- Dibujar mensajes ---------- */
  const avatar = `<img class="chat__avatar" src="${p.foto}" alt="" />`;

  function burbuja(m, siguiente) {
    const mio = m.de === 'yo';
    // El avatar solo aparece en el último mensaje seguido del contacto
    const conAvatar = !mio && (!siguiente || siguiente.de !== m.de || siguiente.dia);
    const pie = `<span class="burbuja__hora">${escapar(m.hora)}${mio ? `<span class="burbuja__check">${icono('check')}${icono('check')}</span>` : ''}</span>`;

    let contenido = `<p>${escapar(m.texto)}</p>`;
    if (m.tipo === 'experiencia') {
      const exp = buscarExperiencia(m.experiencia);
      contenido = `
        <p>${escapar(m.texto)}</p>
        <a class="chat-experiencia" href="#/experiencia/${exp.id}">
          <span class="chat-experiencia__foto">
            <img src="${exp.imagen}" alt="" />
            <span class="etiqueta etiqueta--terracota"><i></i> ${exp.cuposRestantes} cupos restantes</span>
            <span class="chat-experiencia__titulo">
              <small>Territorio sagrado ${escapar(exp.ubicacion.municipio)}</small>
              ${escapar(exp.tituloLargo || exp.titulo)}
            </span>
          </span>
          <span class="chat-experiencia__pie">
            <span class="chat-experiencia__icono">${icono('montana')}</span>
            <span>${escapar(exp.horariosTexto)} · ${escapar(exp.horas[0])}</span>
            <span class="boton boton--oscuro boton--pequeno">Ver detalle</span>
          </span>
        </a>`;
    }

    return `
      ${m.dia ? `<div class="chat__dia"><span>${escapar(m.dia)}</span></div>` : ''}
      <div class="fila-burbuja ${mio ? 'es-mia' : ''} ${m.nuevo ? 'es-nueva' : ''}">
        ${!mio ? (conAvatar ? avatar : '<span class="chat__avatar-vacio"></span>') : ''}
        <div class="burbuja ${mio ? 'burbuja--mia' : ''}">${contenido}${pie}</div>
      </div>`;
  }

  function pintar(mensajes) {
    contenedor.innerHTML = mensajes.map((m, i) => burbuja(m, mensajes[i + 1])).join('');
  }

  function bajarAlFinal(suave = true) {
    el.scrollTo({ top: el.scrollHeight, behavior: suave ? 'smooth' : 'auto' });
  }

  let mensajes = [...conv.mensajes];
  pintar(mensajes);

  /* ---------- "Está escribiendo…" ---------- */
  const escribiendo = document.createElement('div');
  escribiendo.className = 'fila-burbuja escribiendo';
  escribiendo.innerHTML = `${avatar}<div class="burbuja burbuja--escribiendo"><span class="puntos"><i></i><i></i><i></i></span> ${escapar(p.corto)} está escribiendo…</div>`;

  function mostrarEscribiendo(si) {
    if (si) contenedor.appendChild(escribiendo);
    else escribiendo.remove();
    bajarAlFinal();
  }

  /** Simula que el contacto contesta después de unos segundos. */
  function responder() {
    setTimeout(() => mostrarEscribiendo(true), 700);
    setTimeout(() => {
      if (!el.isConnected) return;
      mostrarEscribiendo(false);
      const r = agregarMensaje(id, { de: 'otro', texto: siguienteRespuesta(id) });
      mensajes.push({ ...r, nuevo: true });
      pintar(mensajes);
      vibrar(15);
      bajarAlFinal();
    }, 2600);
  }

  /* ---------- Enviar ---------- */
  campo.addEventListener('input', () => (enviar.disabled = !campo.value.trim()));

  el.querySelector('[data-formulario]').addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;
    const m = agregarMensaje(id, { de: 'yo', texto });
    mensajes.push({ ...m, nuevo: true });
    pintar(mensajes);
    campo.value = '';
    enviar.disabled = true;
    vibrar();
    bajarAlFinal();
    responder();
  });

  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-adjuntar]')) aviso('Adjuntar fotos estará disponible pronto');
    if (e.target.closest('[data-mas]')) aviso('Opciones del chat (simulado)');
  });

  // Al abrir: baja al último mensaje y, si el contacto estaba escribiendo, responde
  el.alMostrar = () => {
    bajarAlFinal(false);
    if (conv.escribiendo) {
      mostrarEscribiendo(true);
      setTimeout(() => mostrarEscribiendo(false), 2500);
    }
  };

  return el;
}
