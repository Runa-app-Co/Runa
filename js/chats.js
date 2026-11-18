/* =========================================================
   RUNA · Lógica de mensajes (simulada)
   Une los datos de ejemplo (data/mensajes.js) con lo que la
   persona escribe, y lo guarda en el celular.
   En la app real esto sería un servicio de chat en tiempo
   real (por ejemplo Firebase o Supabase).
   ========================================================= */

import { contactos, conversaciones, respuestasAnfitrion } from '../data/mensajes.js';
import { anfitriones } from '../data/datos.js';

const CLAVE = 'runa:chats:v1';

function leer() {
  try {
    return { extra: {}, leidas: [], indice: {}, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') };
  } catch {
    return { extra: {}, leidas: [], indice: {} };
  }
}
let guardado = leer();
const guardar = () => localStorage.setItem(CLAVE, JSON.stringify(guardado));

/** Hora actual en formato "10:45 am" */
export function horaActual() {
  return new Date()
    .toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace(/\s?a\.?\s?m\.?/i, ' am')
    .replace(/\s?p\.?\s?m\.?/i, ' pm');
}

/** Datos de la persona con quien se chatea (contacto o anfitrión). */
export function buscarPersona(id) {
  const c = contactos.find((x) => x.id === id);
  if (c) return { ...c, corto: c.corto || c.nombre.split(' ')[0] };
  const a = anfitriones.find((x) => x.id === id);
  if (a)
    return {
      id: a.id,
      nombre: a.nombre,
      corto: a.nombre.split(' ').slice(0, 2).join(' '),
      foto: a.foto,
      lugar: 'Anfitrión',
      tipo: 'anfitriones',
      enLinea: true,
      esAnfitrion: true,
      titulo: a.titulo,
    };
  return null;
}

/** Conversación completa: datos base + mensajes que escribió la persona. */
export function obtenerConversacion(id) {
  const persona = buscarPersona(id);
  if (!persona) return null;
  const base = conversaciones.find((c) => c.id === id);
  const inicial = base
    ? base.mensajes
    : persona.esAnfitrion
    ? [{ de: 'otro', texto: `¡Hola! Soy ${persona.nombre}. Gracias por tu interés en compartir este saber. ¿En qué te puedo ayudar?`, hora: 'Ahora', dia: 'Hoy' }]
    : [];
  const mensajes = [...inicial, ...(guardado.extra[id] || [])];
  const leida = guardado.leidas.includes(id);
  return {
    id,
    persona,
    mensajes,
    noLeidos: leida ? 0 : base ? base.noLeidos : 0,
    leidoPorOtro: base?.leidoPorOtro,
    escribiendo: base?.escribiendo && !leida,
    respuestas: base?.respuestas || respuestasAnfitrion,
  };
}

/** Todas las conversaciones para la lista (incluye chats nuevos con anfitriones). */
export function listaConversaciones() {
  const ids = [...conversaciones.map((c) => c.id)];
  Object.keys(guardado.extra).forEach((id) => !ids.includes(id) && ids.unshift(id));
  return ids.map(obtenerConversacion).filter(Boolean);
}

export const totalNoLeidos = () => listaConversaciones().reduce((t, c) => t + c.noLeidos, 0);

export function marcarLeida(id) {
  if (!guardado.leidas.includes(id)) {
    guardado.leidas.push(id);
    guardar();
  }
}

/** Guarda un mensaje nuevo (de la persona o la respuesta simulada). */
export function agregarMensaje(id, mensaje) {
  const nuevo = { hora: horaActual(), ...mensaje };
  guardado.extra[id] = [...(guardado.extra[id] || []), nuevo];
  guardar();
  return nuevo;
}

/** Siguiente respuesta automática del contacto (rota entre las disponibles). */
export function siguienteRespuesta(id) {
  const conv = obtenerConversacion(id);
  const n = guardado.indice[id] || 0;
  guardado.indice[id] = n + 1;
  guardar();
  return conv.respuestas[n % conv.respuestas.length];
}

/** Borra los mensajes escritos (útil entre sesiones de testeo). */
export function reiniciarChats() {
  guardado = { extra: {}, leidas: [], indice: {} };
  guardar();
}
