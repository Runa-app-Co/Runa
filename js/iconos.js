/* =========================================================
   RUNA · Iconos SVG en línea
   Se usan como texto para insertarlos en las plantillas.
   Todos usan `currentColor`, así toman el color del texto.
   En React Native se reemplazarían por react-native-svg.
   ========================================================= */

const trazo = (contenido, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${contenido}</svg>`;

export const iconos = {
  /* ---------- Barra inferior ---------- */

  // Maloca (Explorar)
  maloca: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16 3.5c-1.2 0-2.3.5-3 1.4L3.6 16.3c-.6.7-.1 1.7.8 1.7H6v8.5c0 .8.7 1.5 1.5 1.5h17c.8 0 1.5-.7 1.5-1.5V18h1.6c.9 0 1.4-1 .8-1.7L19 4.9c-.7-.9-1.8-1.4-3-1.4z" opacity=".95"/>
    <path d="M9 9.5h14M7 13h18M13.5 28v-5.5a2.5 2.5 0 0 1 5 0V28" stroke="#122C1F" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M10.5 18v6M21.5 18v6" stroke="#122C1F" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,

  // Marcador (Favoritos)
  marcador: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M9 4h14a2 2 0 0 1 2 2v21.2c0 .8-.9 1.3-1.6.8L16 22.6 8.6 28c-.7.5-1.6 0-1.6-.8V6a2 2 0 0 1 2-2z"/>
  </svg>`,

  // Piedras apiladas (Comunidad)
  piedras: `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <ellipse cx="16" cy="25" rx="11.5" ry="3.6"/>
    <ellipse cx="16" cy="18.2" rx="8.8" ry="3"/>
    <ellipse cx="16" cy="12.2" rx="6.2" ry="2.5"/>
    <ellipse cx="16" cy="7.2" rx="3.6" ry="2"/>
  </svg>`,

  // Sol en espiral (Digital)
  solEspiral: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
    <path d="M16 16.5c.6 0 1-.5.9-1.1-.2-1.1-1.5-1.6-2.4-1-1.4.9-1.2 3 .2 3.8 1.9 1.1 4.3-.1 4.7-2.2.5-2.6-1.6-4.9-4.2-4.9-3.3 0-5.6 3.1-5 6.2.7 3.6 4.5 5.5 7.8 4.4"/>
    <path d="M16 2.5v2.6M16 26.9v2.6M2.5 16h2.6M26.9 16h2.6M6.5 6.5l1.8 1.8M23.7 23.7l1.8 1.8M6.5 25.5l1.8-1.8M23.7 8.3l1.8-1.8M10.8 3.6l.9 2.3M20.3 26.1l.9 2.3M3.6 21.2l2.3-.9M26.1 11.7l2.3-.9M3.6 10.8l2.3.9M26.1 20.3l2.3.9M10.8 28.4l.9-2.3M20.3 5.9l.9-2.3"/>
  </svg>`,

  // Mapa plegado (botón flotante)
  mapa: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 8.5l7-3 10 3 7-3v18l-7 3-10-3-7 3z"/>
    <path d="M11 5.5v18M21 8.5v18"/>
    <circle cx="16" cy="13.5" r="2.4" fill="currentColor" stroke="none"/>
    <path d="M16 20s-4-3.4-4-6.5a4 4 0 0 1 8 0c0 3.1-4 6.5-4 6.5z" fill="none"/>
  </svg>`,

  /* ---------- Generales (trazo) ---------- */
  atras: trazo('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
  flecha: trazo('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  chevron: trazo('<path d="M9 6l6 6-6 6"/>'),
  buscar: trazo('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  ajustes: trazo('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
  filtro: trazo('<path d="M4 7h16M7 12h10M10 17h4"/>'),
  corazon: trazo('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  ubicacion: trazo('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  navegar: trazo('<path d="M20 4L4 11l7 2 2 7z"/>'),
  reloj: trazo('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2"/>'),
  personas: trazo('<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="10" r="2.3"/><path d="M15.5 14.6A4.5 4.5 0 0 1 21 19"/>'),
  calendario: trazo('<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
  estrella: trazo('<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>'),
  cerrar: trazo('<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>'),
  check: trazo('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  mensaje: trazo('<path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v7a2.5 2.5 0 0 1-2.5 2.5H8z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" stroke-width="2.6"/>'),
  enviar: trazo('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  compartir: trazo('<circle cx="17" cy="5.5" r="2.3"/><circle cx="7" cy="12" r="2.3"/><circle cx="17" cy="18.5" r="2.3"/><path d="M9 11l6-4M9 13l6 4"/>'),
  sobre: trazo('<rect x="3.5" y="6" width="17" height="12.5" rx="2.5"/><path d="M4 7.5l8 5.5 8-5.5"/>'),
  editar: trazo('<path d="M5 19h4l10-10-4-4L5 15z"/><path d="M13.5 6.5l4 4"/>'),
  mas: trazo('<path d="M12 5v14M5 12h14"/>'),
  menos: trazo('<path d="M5 12h14"/>'),
  camara: trazo('<path d="M4 8.5A2 2 0 0 1 6 6.5h2l1.5-2h5l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.4"/>'),
  puntos: trazo('<path d="M12 5.5h.01M12 12h.01M12 18.5h.01" stroke-width="3"/>'),
  corazonLleno: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5S4.5 15.8 4.5 9.9A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.6c0 5.9-7.5 10.6-7.5 10.6z"/></svg>`,
  estrellaLlena: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.7-4.4 4 1.2 5.8L12 16.5l-5.3 2.9 1.2-5.8-4.4-4 5.9-.7z"/></svg>`,
  verificado: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.3l3 3 6-6.3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  checkCirculo: trazo('<circle cx="12" cy="12" r="8.5"/><path d="M8.3 12.3l2.6 2.6 5-5.3"/>'),
  sello: trazo('<circle cx="12" cy="10" r="5.5"/><path d="M9 15l-1.5 5.5L12 18l4.5 2.5L15 15"/>'),
  cupos: trazo('<circle cx="12" cy="8" r="3.2"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/>'),

  /* ---------- Categorías y detalle ---------- */
  olla: trazo('<path d="M4 10h16M5 10v5a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-5M2.5 10H4M20 10h1.5M9 6.5c0-1 1-1.2 1-2.2M13 6.5c0-1 1-1.2 1-2.2"/>'),
  hoja: trazo('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19l8-8"/>'),
  casa: trazo('<path d="M4 11l8-6.5 8 6.5M6 9.5V19h12V9.5"/><path d="M10 19v-5h4v5"/>'),
  montana: trazo('<path d="M3 19l6-10 3.5 5 2.5-3.5L21 19z"/>'),
  tejido: trazo('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>'),
  planta: trazo('<path d="M12 20V10M12 13c-4 0-6-3-6-6 3 0 6 2 6 6zM12 11c0-4 3-6 6-6 0 3-2 6-6 6zM7 20h10"/>'),
  vasija: trazo('<path d="M9 4h6M10 4v3c-3 1.5-4.5 4-4.5 7a6.5 6.5 0 0 0 13 0c0-3-1.5-5.5-4.5-7V4"/>'),
  sol: trazo('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>'),
  maiz: trazo('<path d="M12 3c2.5 2 3.5 5 3.5 8.5S14 19 12 21c-2-2-3.5-6-3.5-9.5S9.5 5 12 3z"/><path d="M10 8h4M9.5 11.5h5M10 15h4M12 3v18"/>'),
  matraz: trazo('<path d="M9.5 3.5h5M10.5 3.5v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5.5-9.5v-6"/><path d="M7.5 15h9"/>'),
  cubiertos: trazo('<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 21V3c-2 1.5-3 4-3 7v3h3"/>'),
  nube: trazo('<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>'),
  taza: trazo('<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5v2M11 3.5v2"/>'),
  regalo: trazo('<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-3.5-5-1.5S10 9 12 9zM12 9c1.5-3 5-3.5 5-1.5S14 9 12 9z"/>'),
  caminar: trazo('<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2.5-6.5L15 17v4M12.5 14.5l.8-5.5L9 11v3.5M13.3 9l2.7 3h3"/>'),
  manos: trazo('<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5-2.7L3.5 14a1.5 1.5 0 0 1 2.4-1.8L8 14.5"/>'),
  fuego: trazo('<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 3.5-3 5.5-1-.5-1.5-1.5-1.8-2.5C7.5 10 6 12 6 15a6 6 0 0 0 6 6z"/>'),
  camisa: trazo('<path d="M8 4l-4 3 2 4 2-1v10h8V10l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4z"/>'),
  agua: trazo('<path d="M12 3.5s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>`,
  pausa: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>`,
  carro: trazo('<path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5M4 12h16M7 16.5v1.5M17 16.5v1.5M4.5 16.5h15"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>'),
  brujula: trazo('<circle cx="12" cy="12" r="8.5"/><path d="M12 6.5l2 5.5h-4z" fill="currentColor"/><path d="M12 17.5l-2-5.5h4z"/>'),
  capas: trazo('<path d="M12 4l8 4.5-8 4.5-8-4.5z"/><path d="M4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/>'),
  grupo: trazo('<circle cx="12" cy="7" r="2.6"/><circle cx="5.5" cy="10" r="2"/><circle cx="18.5" cy="10" r="2"/><path d="M7.5 19a4.5 4.5 0 0 1 9 0M2 18a3.5 3.5 0 0 1 5-3M22 18a3.5 3.5 0 0 0-5-3"/>'),
  objetivo: trazo('<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>'),
};

/** Devuelve el SVG de un icono por nombre (o vacío si no existe). */
export const icono = (nombre) => iconos[nombre] || '';
