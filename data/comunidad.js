/* =========================================================
   RUNA · Datos de ejemplo de Comunidad y Perfil
   - historias: círculos de la parte superior
   - publicaciones: lo que otras personas están viviendo
   - perfil: insignias y momentos del usuario de prueba
   ========================================================= */

const IMG = 'assets/img/exp/';
const GENTE = 'assets/img/gente/';

/* ---------------------------------------------------------
   Historias (fila de círculos)
   --------------------------------------------------------- */
export const historias = [
  { id: 'paula-c', nombre: 'Paula C.', foto: GENTE + 'paula-c.jpg', imagen: IMG + 'guadua.jpg', texto: 'Hoy terminamos la cúpula 🎋' },
  { id: 'pau', nombre: 'Pau G.', foto: 'assets/img/avatar-usuario.png', imagen: IMG + 'paramo.jpg', texto: 'Amanecer en el páramo', destacada: true },
  { id: 'simon', nombre: 'Simon T.', foto: GENTE + 'simon.jpg', imagen: IMG + 'rio.jpg', texto: 'El río Cali nos enseña' },
  { id: 'flor', nombre: 'Abuela Flor', foto: GENTE + 'blanca.jpg', imagen: IMG + 'chicha-2.jpg', texto: 'Tinajas listas para la chicha' },
  { id: 'mateo', nombre: 'Mateo', foto: GENTE + 'mateo.jpg', imagen: IMG + 'fogata.jpg', texto: 'Fogata de palabra 🔥' },
];

/* ---------------------------------------------------------
   Publicaciones
   vinculo: tarjeta inferior que conecta con un saber o un anfitrión
   amigos: true → aparece también en la pestaña "Amigos"
   --------------------------------------------------------- */
export const publicaciones = [
  {
    id: 'p1',
    autor: { nombre: 'Paula Cuéllar', usuario: '@pauuu', foto: GENTE + 'paula-c.jpg' },
    categoria: 'Bioconstrucción',
    tono: 'dorado',
    imagen: IMG + 'guadua.jpg',
    titulo: 'Haciendo Yurtaaas',
    texto: 'Tres días levantando la estructura en guadua con Luna y la minga de Pance. Las manos cansadas y el corazón lleno.',
    lugar: 'Tierra Mágica, Pance',
    hace: 'Hace 2h',
    likes: 128,
    amigos: true,
    vinculo: { etiqueta: 'Saber vinculado', texto: 'Curado de Guadua con Luna', accion: 'Aprender', destino: '/experiencia/guadua', icono: 'casa' },
    comentarios: [
      { autor: 'Simon T.', foto: GENTE + 'simon.jpg', texto: '¡Qué belleza! El domingo subo a ayudar.' },
      { autor: 'Camila R.', foto: GENTE + 'camila.jpg', texto: '¿Cuántos días tarda el curado de la guadua?' },
    ],
  },
  {
    id: 'p2',
    autor: { nombre: 'Paula Gallego', usuario: '@miscojones33', foto: 'assets/img/avatar-usuario.png' },
    categoria: 'Soberanía',
    tono: 'terracota',
    imagen: IMG + 'arepa.jpg',
    titulo: 'Molienda en fogón y siembra viva',
    texto: 'Don Julio nos enseñó a moler el maíz al amanecer. Volví a sentir el tiempo lento.',
    lugar: 'San Antonio',
    hace: 'Hace 5h',
    likes: 86,
    amigos: false,
    vinculo: { etiqueta: 'Anfitrión guía', texto: 'Taita Don Julio • Finca El Arrayán', accion: 'Conversar', destino: '/chat/efrain', icono: 'manos' },
    comentarios: [{ autor: 'Valentina R.', foto: GENTE + 'valentina.jpg', texto: 'Ese fogón se ve mágico 🔥' }],
  },
  {
    id: 'p3',
    autor: { nombre: 'Simon Torres', usuario: '@monsi', foto: GENTE + 'simon.jpg' },
    categoria: 'Arte vivo',
    tono: 'verde',
    imagen: IMG + 'telar-2.jpg',
    titulo: 'Pigmentos de achiote y corteza de nogal',
    texto: 'Teñimos fibras con lo que nos da el monte: achiote, nogal y barro rojo.',
    lugar: 'Pichindé',
    hace: 'Ayer',
    likes: 214,
    amigos: true,
    vinculo: { etiqueta: 'Círculo comunitario', texto: 'Guardianes del Río Cali (28 miembros)', accion: 'Unirme', destino: '/chat/guardianes', icono: 'grupo' },
    comentarios: [
      { autor: 'Mateo V.', foto: GENTE + 'mateo.jpg', texto: 'Necesito aprender esto ya.' },
      { autor: 'Julián M.', foto: GENTE + 'julian.jpg', texto: 'Los colores quedaron brutales.' },
      { autor: 'Estefanía C.', foto: GENTE + 'estefania.jpg', texto: '¿Cuándo es el próximo círculo?' },
    ],
  },
  {
    id: 'p4',
    autor: { nombre: 'Nicolás & Sofía', usuario: '@nicoysofi', foto: GENTE + 'nicolas.jpg' },
    categoria: 'Barro vivo',
    tono: 'dorado',
    imagen: IMG + 'alfareria-2.jpg',
    titulo: 'Nuestra primera vasija',
    texto: 'Torcida, imperfecta y hermosa. Gracias Taita Jerónimo por la paciencia.',
    lugar: 'Guatavita',
    hace: 'Hace 2 días',
    likes: 97,
    amigos: true,
    vinculo: { etiqueta: 'Saber vinculado', texto: 'Alfarería y barro sagrado', accion: 'Aprender', destino: '/experiencia/alfareria', icono: 'vasija' },
    comentarios: [],
  },
  {
    id: 'p5',
    autor: { nombre: 'Estefanía Castro', usuario: '@estefi.selva', foto: GENTE + 'estefania.jpg' },
    categoria: 'Selva',
    tono: 'verde',
    imagen: IMG + 'rio.jpg',
    titulo: 'Río arriba con la Maestra Aurora',
    texto: 'Dos horas en bote para llegar a la maloca. Aquí el tiempo lo marca el agua.',
    lugar: 'Leticia, Amazonas',
    hace: 'Hace 3 días',
    likes: 153,
    amigos: false,
    vinculo: { etiqueta: 'Saber vinculado', texto: 'Cestería viva en fibra de cumare', accion: 'Aprender', destino: '/experiencia/cesteria', icono: 'tejido' },
    comentarios: [{ autor: 'Camila R.', foto: GENTE + 'camila.jpg', texto: 'Sueño con ir 💚' }],
  },
];

/* ---------------------------------------------------------
   Perfil del usuario de prueba
   --------------------------------------------------------- */
export const perfil = {
  bio: 'Exploradora de territorios vivos, aprendiz de barro, bioconstrucción y saberes de la tierra. Tejiendo memoria junto a los abuelos y comunidades de Colombia.',
  estadisticas: { saberes: 5, encuentros: 8, territorios: 3 },
  insignias: [
    { elemento: 'Fuego', nivel: 'Nivel 2', nombre: 'Custodia del Fogón Sagrado', icono: 'fuego', color: 'terracota' },
    { elemento: 'Agua viva', nivel: '', nombre: 'Guardiana de Cuencas', icono: 'agua', color: 'verde' },
    { elemento: 'Tierra', nivel: 'Nivel 1', nombre: 'Aprendiz del Barro', icono: 'vasija', color: 'dorado' },
    { elemento: 'Semilla', nivel: '', nombre: 'Sembradora de Maíz', icono: 'maiz', color: 'verde' },
    { elemento: 'Tejido', nivel: '', nombre: 'Hilandera de Palabra', icono: 'tejido', color: 'terracota' },
  ],
  momentos: [
    { imagen: IMG + 'alfareria.jpg', etiqueta: 'Taller de barro', titulo: 'Ráquira con la Maestra…', alto: true },
    { imagen: IMG + 'telar.jpg', titulo: 'Telar Guambiano', lugar: 'Silvia, Cauca' },
    { imagen: IMG + 'guadua-2.jpg', titulo: 'Bambú' },
    { imagen: IMG + 'paramo.jpg', etiqueta: 'Territorio sagrado', titulo: 'Paso por el Páramo de las Hermosas', lugar: 'Hace 4 días · Con Colectivo Kankuamo', ancho: true },
    { imagen: IMG + 'chicha-3.jpg', etiqueta: 'Fogón', titulo: 'Agua de hierbas', lugar: 'Con Abuela Clementina' },
    { imagen: IMG + 'cacao-2.jpg', etiqueta: 'Semillero', titulo: 'Siembra de Roble', lugar: 'Vereda La Leonera, Cali' },
  ],
};
