/* =========================================================
   RUNA · Datos de ejemplo de Mensajes
   - contactos: viajeros, amigos y comunidades
   - conversaciones: historial inicial de cada chat
   - respuestas: frases que el contacto "responde" en el
     chat simulado (se eligen en orden)
   Los anfitriones (data/datos.js) también pueden chatear.
   ========================================================= */

const GENTE = 'assets/img/gente/';

/* ---------------------------------------------------------
   Personas "en ruta ahora" (fila de avatares)
   --------------------------------------------------------- */
export const enRuta = ['mateo', 'camila', 'julian', 'nicolas', 'valentina', 'estefania'];

/* ---------------------------------------------------------
   Contactos
   tipo: 'viajeros' | 'amigos' | 'comunidades'
   --------------------------------------------------------- */
export const contactos = [
  { id: 'camila', nombre: 'Camila Rendón', foto: GENTE + 'camila.jpg', lugar: 'Farallones', tipo: 'viajeros', enLinea: true },
  { id: 'simon', nombre: 'Simon Torres', corto: 'Simon T.', foto: GENTE + 'simon.jpg', lugar: 'Cali', tipo: 'amigos', enLinea: true, lugarDestacado: true },
  { id: 'nicolas', nombre: 'Nicolás & Sofía', foto: GENTE + 'nicolas.jpg', lugar: 'Guatavita', tipo: 'amigos', enLinea: true },
  { id: 'valentina', nombre: 'Valentina Ríos', foto: GENTE + 'valentina.jpg', lugar: 'Pance', tipo: 'viajeros', enLinea: true },
  { id: 'julian', nombre: 'Julián Morales', foto: GENTE + 'julian.jpg', lugar: 'Sasaima', tipo: 'viajeros', enLinea: false },
  { id: 'estefania', nombre: 'Estefanía Castro', foto: GENTE + 'estefania.jpg', lugar: 'Leticia', tipo: 'comunidades', enLinea: false },
  { id: 'mateo', nombre: 'Mateo Vargas', corto: 'Mateo', foto: GENTE + 'mateo.jpg', lugar: 'Bogotá', tipo: 'amigos', enLinea: true },
  { id: 'guardianes', nombre: 'Guardianes del Río Cali', foto: 'assets/img/exp/rio.jpg', lugar: '28 miembros', tipo: 'comunidades', enLinea: false },
];

/* ---------------------------------------------------------
   Conversaciones iniciales
   de: 'yo' | 'otro'
   tipo (opcional): 'experiencia' → tarjeta de experiencia
   noLeidos: cuántos mensajes nuevos tiene
   --------------------------------------------------------- */
export const conversaciones = [
  {
    id: 'camila',
    noLeidos: 1,
    mensajes: [
      { de: 'yo', texto: '¡Camila! ¿Al final sí vas a la minga?', hora: '08:50 am', dia: 'Hoy' },
      { de: 'otro', texto: '¿A qué hora van a la minga de bio-construcción mañana?', hora: '09:15 am', dia: 'Hoy' },
    ],
    respuestas: [
      'Perfecto, yo llevo el almuerzo para compartir 🌽',
      '¿Nos vemos en la entrada de Pance?',
      '¡Qué emoción! Nunca he construido con bambú.',
    ],
  },
  {
    id: 'simon',
    noLeidos: 2,
    mensajes: [
      { de: 'otro', texto: '¡Hola! ¿Te acuerdas de lo que nos dijo el Taita sobre el ciclo del barro?', hora: '10:38 am', dia: 'Hoy, 24 de octubre' },
      { de: 'otro', tipo: 'experiencia', experiencia: 'biorefugios', texto: '¿Vas a subir a la minga este fin de semana? Quedan pocos cupos:', hora: '10:40 am' },
      { de: 'yo', texto: '¡De una! Ya tengo listos los guantes y herramientas. Cuenta conmigo.', hora: '10:44 am' },
      { de: 'yo', texto: '¿Nos vemos en Pance para subir juntos?', hora: '10:45 am' },
      { de: 'otro', texto: '¡Qué buena experiencia la de ayer en el río! Te mandé el mapa.', hora: '10:46 am' },
    ],
    escribiendo: true,
    respuestas: [
      '¡Listo! Te espero a las 6:30 am en el puente de Pance 🙌',
      'Lleva bloqueador y una muda de ropa, que allá llueve.',
      'Luna dice que vamos a terminar el techo del segundo refugio.',
    ],
  },
  {
    id: 'nicolas',
    noLeidos: 0,
    mensajes: [
      { de: 'yo', texto: '¿Cómo les fue con el Taita Jerónimo?', hora: 'Ayer', dia: 'Ayer' },
      { de: 'otro', texto: 'Te compartí las fotos del taller de arcilla 🙌 quedaron hermosas.', hora: 'Ayer' },
    ],
    leidoPorOtro: true,
    respuestas: ['Sí, tienes que ir. La vasija de Sofía quedó perfecta 😄', '¡Vamos juntos la próxima!'],
  },
  {
    id: 'valentina',
    noLeidos: 0,
    mensajes: [{ de: 'otro', texto: 'Nos vemos en la fogata al atardecer para cantar y compartir.', hora: 'Ayer', dia: 'Ayer' }],
    leidoPorOtro: true,
    respuestas: ['¡Trae tu guitarra!', 'Yo llevo agua de panela caliente ☕'],
  },
  {
    id: 'julian',
    noLeidos: 0,
    mensajes: [{ de: 'otro', texto: 'Llegamos bien al refugio de montaña, la vista es increíble.', hora: '12 oct', dia: '12 de octubre' }],
    respuestas: ['Te mando fotos cuando tenga señal 🏔️'],
  },
  {
    id: 'estefania',
    noLeidos: 0,
    mensajes: [{ de: 'otro', texto: 'Ya coordinamos el transporte fluvial para el grupo el viernes.', hora: '9 oct', dia: '9 de octubre' }],
    respuestas: ['El bote sale a las 7:00 am del muelle de Leticia.'],
  },
];

/** Frase del "Consejo de sabiduría RUNA" que aparece entre los chats. */
export const consejo = {
  texto: '“La palabra verdadera se teje con tiempo, escucha y respeto por la tierra que nos sostiene.”',
  autor: 'Consejo de sabiduría RUNA',
};

/** Respuestas genéricas para anfitriones que no tienen chat previo. */
export const respuestasAnfitrion = [
  '¡Con mucho gusto! Aquí te esperamos con el fogón encendido 🔥',
  'Recuerda traer abrigo, que en la mañana hace frío.',
  'Cualquier duda me escribes. Que la tierra te acompañe.',
];
