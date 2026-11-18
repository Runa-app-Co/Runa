/* =========================================================
   RUNA · Utilidades de interfaz
   Pequeñas funciones compartidas por todas las pantallas.
   ========================================================= */

/**
 * Crea un elemento a partir de un texto HTML.
 * Ej: crearPantalla(`<section>…</section>`)
 */
export function crearElemento(html) {
  const plantilla = document.createElement('template');
  plantilla.innerHTML = html.trim();
  return plantilla.content.firstElementChild;
}

/** Crea el contenedor de una pantalla con su contenido. */
export function crearPantalla(nombre, html) {
  const el = document.createElement('section');
  el.className = `pantalla-${nombre}`;
  el.dataset.pantalla = nombre;
  el.innerHTML = html;
  return el;
}

/** Muestra un aviso breve en la parte superior. */
let temporizadorAviso;
export function aviso(texto) {
  const el = document.getElementById('aviso');
  if (!el) return;
  el.textContent = texto;
  el.classList.add('es-visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => el.classList.remove('es-visible'), 2200);
}

/** Vibración corta (solo en celulares que la soportan). */
export function vibrar(ms = 10) {
  // Solo vibra si la persona ya tocó la pantalla (el navegador lo exige)
  const activo = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  if (navigator.vibrate && activo) navigator.vibrate(ms);
}

/** Formatea un número como pesos colombianos: 120000 → $120.000 */
export function pesos(valor) {
  return '$' + Math.round(Number(valor)).toLocaleString('es-CO');
}

/** Formato corto: 95000 → $95k */
export function pesosCorto(valor) {
  return valor >= 1000 ? `$${Math.round(valor / 1000)}k` : pesos(valor);
}

/** Distancia en km entre dos puntos {lat, lng} (fórmula de Haversine). */
export function distanciaKm(a, b) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Texto amigable de distancia: "A 1.8 km" o "A 47 km". */
export function textoDistancia(km) {
  return km < 10 ? `A ${km.toFixed(1)} km` : `A ${Math.round(km)} km`;
}

/** Evita que textos de datos rompan el HTML. */
export function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Quita tildes y pasa a minúsculas (para buscar sin importar acentos). */
export function normalizar(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
