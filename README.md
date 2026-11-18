# RUNA · Prototipo funcional (PWA)

App para reservar experiencias turísticas auténticas y culturales en Colombia.
Prototipo para **testeo de usuarios**: todo es simulado (sin pagos reales ni servidor).

Hecho en **HTML, CSS y JavaScript puro**, sin frameworks ni instalación.

---

## 📁 Estructura

```
index.html              → Página única de la app (marco, encabezado, barra inferior)
manifest.webmanifest    → Datos para "instalar" la app en el celular (PWA)
sw.js                   → Service worker: funciona offline y se actualiza solo
css/
  tema.css              → Colores, tipografías, espaciados (tokens de Figma)
  base.css              → Estructura, marco de celular y transiciones
  componentes.css       → Botones, píldoras, etiquetas, pop-ups, barra inferior
  pantallas.css         → Estilos de cada pantalla (por etapas)
js/
  app.js                → Punto de entrada: rutas, barra inferior, botón flotante
  router.js             → Navegación entre pantallas sin recargar (#/ruta)
  iconos.js             → Iconos SVG
  ui.js                 → Utilidades (avisos, formato de pesos, distancias…)
  estado.js             → Favoritos, reservas, likes… guardados en el celular
  chats.js              → Lógica del chat simulado
  ubicacion.js          → Ubicación real (GPS) o simulada
  modal.js              → Pop-ups y hojas inferiores
  componentes/          → Tarjetas reutilizables
  screens/              → Una pantalla por archivo
data/
  datos.js              → Experiencias, anfitriones, categorías
  mensajes.js           → Conversaciones de ejemplo
  comunidad.js          → Publicaciones, historias y perfil
assets/
  img/                  → Logo, fotos de experiencias (exp/) y personas (gente/)
  icons/                → Iconos de la app instalada
```

**¿Quieres cambiar textos, precios o fotos?** Edita los archivos de `data/`.
**¿Quieres cambiar colores?** Edita `css/tema.css`.

---

## 🚀 Publicarlo gratis con un link

> Después de cada cambio que publiques, abre `sw.js` y sube el número de
> `VERSION` (por ejemplo de `runa-v7` a `runa-v8`). Así los celulares de los
> testers descargan la versión nueva.

### Opción A · Netlify Drop (la más fácil, 2 minutos, sin cuenta de GitHub)

1. Entra a **https://app.netlify.com/drop**
2. Crea una cuenta gratis (con tu correo o Google).
3. **Arrastra la carpeta completa del proyecto** (la que contiene `index.html`) a la zona punteada.
4. Espera unos segundos: Netlify te da un link tipo `https://nombre-raro-123.netlify.app`.
5. (Opcional) En **Site configuration → Change site name** ponle un nombre fácil, por ejemplo `runa-prototipo` → `https://runa-prototipo.netlify.app`.
6. Para actualizar: en tu sitio de Netlify ve a **Deploys** y vuelve a arrastrar la carpeta.

### Opción B · GitHub Pages (ideal si vas a seguir trabajando en el código)

1. Crea una cuenta en **https://github.com** (gratis).
2. Arriba a la derecha: **+ → New repository**. Nombre: `runa`. Márcalo **Public**. Clic en **Create repository**.
3. En la página del repositorio: **uploading an existing file** → arrastra **todo el contenido** de la carpeta (no la carpeta en sí, sino lo que hay dentro: `index.html`, `css`, `js`, etc.) → **Commit changes**.
4. Ve a **Settings → Pages**. En *Branch* elige **main** y **/ (root)** → **Save**.
5. Espera 1–2 minutos y recarga: aparecerá tu link `https://TU-USUARIO.github.io/runa/`.
6. Para actualizar: sube de nuevo los archivos cambiados (Add file → Upload files).

### Opción C · Vercel

1. Entra a **https://vercel.com** y crea una cuenta (puedes usar la de GitHub).
2. **Add New → Project** → importa el repositorio de GitHub de la opción B.
3. *Framework Preset*: **Other**. No cambies nada más → **Deploy**.
4. Link: `https://runa.vercel.app` (o similar). Cada cambio en GitHub se publica solo.

---

## 📱 Instrucciones para los testers

Envíales el link y este mensaje:

**En iPhone (Safari):** abre el link → botón **Compartir** (cuadro con flecha) → **Agregar a pantalla de inicio**.
**En Android (Chrome):** abre el link → menú **⋮** → **Instalar app** o **Agregar a pantalla principal**.

La app se abrirá a pantalla completa como una app nativa.

**Consejos para la sesión de testeo**
- Los datos (reservas, favoritos, mensajes, publicaciones) quedan guardados **solo en el celular de cada persona**.
- Para empezar de cero entre un tester y otro en el mismo celular: **Perfil (foto arriba a la derecha) → Reiniciar datos de prueba**.
- El botón ◎ del mapa pide permiso de ubicación: solo funciona con el link publicado (https).

---

## 💻 Verlo en tu computador

Los navegadores no permiten abrir esta app con doble clic sobre `index.html`
(usa módulos de JavaScript). Necesitas un mini servidor local, por ejemplo:

```bash
ruby -run -e httpd . -p 8080
```

y luego abre `http://localhost:8080`.

---

## 🔁 Migrar a React Native más adelante

- `css/tema.css` → objeto `theme` (colores, tipografías, radios).
- Cada archivo de `js/screens/` → una pantalla de React Navigation.
- `js/router.js` → Tab Navigator (4 pestañas) + Stack Navigator.
- `js/estado.js` y `js/chats.js` → AsyncStorage / Zustand.
- `js/ubicacion.js` → `expo-location`. Mapa Leaflet → `react-native-maps`.
- `data/*.js` → se reemplazan por llamadas a una API real.

## Créditos

Fotos de referencia: Unsplash (licencia libre). Ver `assets/img/CREDITOS.md`.
Mapas: © colaboradores de OpenStreetMap.
