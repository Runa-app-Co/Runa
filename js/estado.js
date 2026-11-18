/* =========================================================
   RUNA · Estado de la app
   Guarda en el celular (localStorage) lo que la persona hace:
   favoritos, reservas y "me gusta". Así, si cierra y vuelve
   a abrir la app, todo sigue ahí.
   En React Native se usaría AsyncStorage o un store (Zustand).
   ========================================================= */

const CLAVE = 'runa:estado:v1';

// Favoritos iniciales para que la pantalla no arranque vacía
const inicial = {
  favoritos: ['biorefugios', 'telar', 'alfareria'],
  reservas: [],
  meGusta: [],
  comentarios: {},
  publicaciones: [],
};

function leer() {
  try {
    return { ...inicial, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') };
  } catch {
    return { ...inicial };
  }
}

let estado = leer();
const oyentes = new Set();

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  oyentes.forEach((fn) => fn(estado));
}

/** Escucha cambios del estado. Devuelve una función para dejar de escuchar. */
export function alCambiarEstado(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

/* ---------- Favoritos ---------- */
export const esFavorito = (id) => estado.favoritos.includes(id);
export const listaFavoritos = () => [...estado.favoritos];

/** Agrega o quita un favorito. Devuelve true si quedó guardado. */
export function alternarFavorito(id) {
  if (esFavorito(id)) {
    estado.favoritos = estado.favoritos.filter((f) => f !== id);
  } else {
    estado.favoritos = [id, ...estado.favoritos];
  }
  guardar();
  return esFavorito(id);
}

/* ---------- Reservas ---------- */
export const listaReservas = () => [...estado.reservas];

export function agregarReserva(reserva) {
  const nueva = { codigo: 'RUNA-' + Math.random().toString(36).slice(2, 7).toUpperCase(), creada: Date.now(), ...reserva };
  estado.reservas = [nueva, ...estado.reservas];
  guardar();
  return nueva;
}

/* ---------- Me gusta (comunidad) ---------- */
export const meGusta = (id) => estado.meGusta.includes(id);
export function alternarMeGusta(id) {
  estado.meGusta = meGusta(id) ? estado.meGusta.filter((m) => m !== id) : [...estado.meGusta, id];
  guardar();
  return meGusta(id);
}

/* ---------- Comunidad: comentarios y publicaciones propias ---------- */
export const comentariosDe = (id) => (estado.comentarios && estado.comentarios[id]) || [];

export function agregarComentario(id, comentario) {
  estado.comentarios = estado.comentarios || {};
  estado.comentarios[id] = [...comentariosDe(id), comentario];
  guardar();
}

export const publicacionesPropias = () => estado.publicaciones || [];

export function agregarPublicacion(pub) {
  estado.publicaciones = [pub, ...publicacionesPropias()];
  guardar();
}

/** Borra todo (útil entre sesiones de testeo). */
export function reiniciarEstado() {
  estado = { ...inicial, favoritos: [...inicial.favoritos], comentarios: {}, publicaciones: [] };
  guardar();
}
