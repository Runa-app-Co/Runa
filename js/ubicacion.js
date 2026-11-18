/* =========================================================
   RUNA · Ubicación de la persona
   - Por defecto usa una ubicación simulada (Bogotá).
   - Si la persona da permiso, usa la ubicación real del
     celular (GPS) y la recuerda para la próxima vez.
   - Funciona solo en https (GitHub Pages, Netlify…) o localhost.
   En React Native: expo-location.
   ========================================================= */

import { usuario } from '../data/datos.js';

const CLAVE = 'runa:ubicacion';
const SIMULADA = { ...usuario.ubicacion };

// Al abrir la app, recupera la última ubicación real conocida
try {
  const guardada = JSON.parse(localStorage.getItem(CLAVE) || 'null');
  if (guardada) Object.assign(usuario.ubicacion, guardada, { real: true });
} catch {
  /* sin ubicación guardada */
}

/** Ubicación actual {lat, lng, real?} */
export const ubicacionActual = () => usuario.ubicacion;

/** ¿La ubicación viene del GPS? */
export const esUbicacionReal = () => !!usuario.ubicacion.real;

/**
 * Pide la ubicación real al celular.
 * @returns {Promise<{lat:number,lng:number,real:boolean}>}
 */
export function pedirUbicacion() {
  return new Promise((resolver, rechazar) => {
    if (!navigator.geolocation) {
      rechazar(new Error('Este navegador no permite ubicación'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nueva = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        Object.assign(usuario.ubicacion, nueva, { real: true });
        localStorage.setItem(CLAVE, JSON.stringify(nueva));
        resolver(usuario.ubicacion);
      },
      (error) => rechazar(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/** Vuelve a la ubicación simulada (útil en sesiones de testeo). */
export function usarUbicacionSimulada() {
  localStorage.removeItem(CLAVE);
  Object.assign(usuario.ubicacion, SIMULADA, { real: false });
}

/** Tiempos aproximados de viaje a partir de los km en línea recta. */
export function tiemposViaje(km) {
  const formato = (min) => {
    if (min < 60) return `${Math.max(1, Math.round(min))} min`;
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return m ? `${h} h ${m} min` : `${h} h`;
  };
  // Por carretera las distancias son ~35% más largas que en línea recta
  const kmVia = km * 1.35;
  return {
    carro: formato((kmVia / 45) * 60), // promedio 45 km/h en vías rurales
    pie: km > 25 ? null : formato((kmVia / 4.5) * 60), // 4.5 km/h caminando
  };
}
