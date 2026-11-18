/* =========================================================
   RUNA · Comunidad (feed)
   Figma: marco "COMUNIDAD"
   - Historias (con "Tu aporte" para publicar)
   - Pestañas Descubre / Amigos
   - Publicaciones a pantalla completa con me gusta,
     comentarios, compartir y saber vinculado
   El botón flotante de esta pantalla abre Mensajes.
   Ruta: #/comunidad
   ========================================================= */

import { crearPantalla, escapar, aviso, vibrar } from '../ui.js';
import { icono } from '../iconos.js';
import { abrirModal, cerrarModal } from '../modal.js';
import { historias, publicaciones } from '../../data/comunidad.js';
import { usuario } from '../../data/datos.js';
import { meGusta, alternarMeGusta, comentariosDe, agregarComentario, publicacionesPropias, agregarPublicacion } from '../estado.js';

const IMAGENES_APORTE = ['assets/img/exp/fogata.jpg', 'assets/img/exp/paramo.jpg', 'assets/img/exp/cacao-2.jpg', 'assets/img/exp/mercado.jpg'];

export function pantallaComunidad() {
  let pestana = 'descubre';

  const el = crearPantalla(
    'comunidad',
    `
    <div class="contenido">
      <h1 class="titulo-pantalla aparecer">Comunidad</h1>

      <div class="historias aparecer" style="--i:1">
        <button class="historia historia--aporte" data-aporte>
          <span class="historia__circulo">${icono('mas')}<i>${icono('mas')}</i></span>
          <span>Tu aporte</span>
        </button>
        ${historias
          .map(
            (h) => `
          <button class="historia ${h.destacada ? 'es-destacada' : ''}" data-historia="${h.id}">
            <span class="historia__circulo"><img src="${h.foto}" alt="" /></span>
            <span>${escapar(h.nombre)}</span>
          </button>`
          )
          .join('')}
      </div>

      <div class="segmentado aparecer" style="--i:2" role="tablist">
        <button data-pestana="descubre" role="tab">Descubre</button>
        <button data-pestana="amigos" role="tab">Amigos</button>
        <span class="segmentado__fondo" aria-hidden="true"></span>
      </div>

      <div class="feed" data-feed></div>
    </div>`
  );

  const feed = el.querySelector('[data-feed]');
  const todas = () => [...publicacionesPropias(), ...publicaciones];
  const buscar = (id) => todas().find((p) => p.id === id);
  const totalComentarios = (p) => p.comentarios.length + comentariosDe(p.id).length;
  const totalLikes = (p) => p.likes + (meGusta(p.id) ? 1 : 0);

  /* ---------- Una publicación ---------- */
  function publicacion(p, i) {
    const v = p.vinculo;
    return `
      <article class="post aparecer" style="--i:${i + 3}" data-post="${p.id}">
        <img class="post__foto" src="${p.imagen}" alt="" loading="lazy" />
        <div class="post__capa"></div>
        <div class="post__arriba">
          <span class="post__autor">
            <img src="${p.autor.foto}" alt="" />
            <span><strong>${escapar(p.autor.nombre)}</strong><small>${escapar(p.autor.usuario)}</small></span>
          </span>
          <span class="post__categoria post__categoria--${p.tono}">${icono('sello')} ${escapar(p.categoria)}</span>
        </div>
        <div class="post__acciones">
          <button class="post__accion ${meGusta(p.id) ? 'es-activo' : ''}" data-like aria-label="Me gusta">
            ${icono('corazonLleno')}<small data-num-likes>${totalLikes(p)}</small>
          </button>
          <button class="post__accion" data-comentar aria-label="Comentarios">
            ${icono('mensaje')}<small data-num-comentarios>${totalComentarios(p)}</small>
          </button>
          <button class="post__accion" data-compartir aria-label="Compartir">${icono('navegar')}</button>
        </div>
        <div class="post__texto">
          <h2>${escapar(p.titulo)}</h2>
          <p>${icono('ubicacion')} ${escapar(p.lugar)} • ${escapar(p.hace)}</p>
        </div>
        <span class="post__corazon" aria-hidden="true">${icono('corazonLleno')}</span>
        ${
          v
            ? `<div class="post__vinculo">
                <span class="post__vinculo-icono">${icono(v.icono)}</span>
                <span class="post__vinculo-texto"><small>${escapar(v.etiqueta)}</small>${escapar(v.texto)}</span>
                <button class="post__vinculo-boton" data-ir="${v.destino}">${escapar(v.accion)} ${icono('flecha')}</button>
              </div>`
            : ''
        }
      </article>`;
  }

  function pintar() {
    el.querySelectorAll('[data-pestana]').forEach((b) => {
      b.classList.toggle('es-activa', b.dataset.pestana === pestana);
      b.setAttribute('aria-selected', b.dataset.pestana === pestana);
    });
    el.querySelector('.segmentado').classList.toggle('en-amigos', pestana === 'amigos');
    const lista = pestana === 'amigos' ? todas().filter((p) => p.amigos) : todas();
    feed.innerHTML = lista.map(publicacion).join('');
  }

  /* ---------- Me gusta (botón o doble toque en la foto) ---------- */
  function darLike(post, forzar = false) {
    const id = post.dataset.post;
    if (forzar && meGusta(id)) return animarCorazon(post);
    const activo = alternarMeGusta(id);
    vibrar(activo ? 15 : 8);
    const boton = post.querySelector('[data-like]');
    boton.classList.toggle('es-activo', activo);
    boton.classList.remove('late');
    void boton.offsetWidth;
    boton.classList.add('late');
    post.querySelector('[data-num-likes]').textContent = totalLikes(buscar(id));
    if (activo) animarCorazon(post);
  }

  function animarCorazon(post) {
    const c = post.querySelector('.post__corazon');
    c.classList.remove('es-visible');
    void c.offsetWidth;
    c.classList.add('es-visible');
  }

  /* ---------- Comentarios (hoja inferior) ---------- */
  function abrirComentarios(post) {
    const p = buscar(post.dataset.post);
    const lista = () => [...p.comentarios, ...comentariosDe(p.id)];
    const filas = () =>
      lista().length
        ? lista()
            .map(
              (c) => `<div class="comentario"><img src="${c.foto}" alt="" /><p><strong>${escapar(c.autor)}</strong> ${escapar(c.texto)}</p></div>`
            )
            .join('')
        : '<p class="comentarios__vacio">Sé la primera persona en comentar 🌱</p>';

    const { el: modal } = abrirModal({
      tipo: 'hoja',
      titulo: 'Comentarios',
      contenido: `
        <p class="comentarios__post">${escapar(p.texto)}</p>
        <div class="comentarios" data-lista-comentarios>${filas()}</div>
        <form class="comentarios__form" data-form-comentario>
          <img src="${usuario.foto}" alt="" />
          <input type="text" placeholder="Agrega un comentario…" maxlength="200" required />
          <button type="submit" aria-label="Publicar">${icono('enviar')}</button>
        </form>`,
    });
    modal.querySelector('[data-form-comentario]').addEventListener('submit', (e) => {
      e.preventDefault();
      const campo = e.target.querySelector('input');
      const texto = campo.value.trim();
      if (!texto) return;
      agregarComentario(p.id, { autor: 'Tú', foto: usuario.foto, texto });
      campo.value = '';
      modal.querySelector('[data-lista-comentarios]').innerHTML = filas();
      post.querySelector('[data-num-comentarios]').textContent = totalComentarios(p);
      vibrar();
    });
  }

  /* ---------- Compartir ---------- */
  async function compartir(post) {
    const p = buscar(post.dataset.post);
    const datos = { title: p.titulo, text: `${p.titulo} — vivido en RUNA`, url: location.href.split('#')[0] };
    if (navigator.share) {
      try {
        await navigator.share(datos);
      } catch {
        /* la persona canceló */
      }
    } else {
      aviso('Enlace copiado para compartir');
      navigator.clipboard?.writeText(datos.url).catch(() => {});
    }
  }

  /* ---------- Historias (visor a pantalla completa) ---------- */
  function verHistoria(id) {
    const h = historias.find((x) => x.id === id);
    const { el: modal } = abrirModal({
      clase: 'historia-visor',
      contenido: `
        <div class="historia-visor__barra"><i></i></div>
        <div class="historia-visor__autor"><img src="${h.foto}" alt="" /><strong>${escapar(h.nombre)}</strong><small>hace 3 h</small></div>
        <img class="historia-visor__imagen" src="${h.imagen}" alt="" />
        <p class="historia-visor__texto">${escapar(h.texto)}</p>`,
    });
    modal.classList.add('modal--historia');
    const temporizador = setTimeout(cerrarModal, 5000);
    modal.addEventListener('click', () => {
      clearTimeout(temporizador);
      cerrarModal();
    });
  }

  /* ---------- Publicar "Tu aporte" (simulado) ---------- */
  function abrirAporte() {
    let imagen = IMAGENES_APORTE[0];
    const { el: modal } = abrirModal({
      tipo: 'hoja',
      titulo: 'Comparte lo que viviste',
      contenido: `
        <form class="aporte" data-form-aporte>
          <p class="aporte__ayuda">Elige una foto (en la app real se abriría tu galería):</p>
          <div class="aporte__fotos">
            ${IMAGENES_APORTE.map((src, i) => `<button type="button" class="${i === 0 ? 'es-activa' : ''}" data-foto="${src}"><img src="${src}" alt="" /></button>`).join('')}
          </div>
          <input class="campo" name="titulo" placeholder="Título (ej. Fogata de palabra)" maxlength="60" required />
          <input class="campo" name="lugar" placeholder="¿Dónde fue?" maxlength="40" required />
          <textarea class="campo" name="texto" rows="3" placeholder="Cuéntale a la comunidad qué aprendiste…" maxlength="280"></textarea>
          <button class="boton boton--primario boton--bloque" type="submit">Publicar ${icono('enviar')}</button>
        </form>`,
    });
    modal.addEventListener('click', (e) => {
      const f = e.target.closest('[data-foto]');
      if (!f) return;
      imagen = f.dataset.foto;
      modal.querySelectorAll('[data-foto]').forEach((b) => b.classList.toggle('es-activa', b === f));
    });
    modal.querySelector('[data-form-aporte]').addEventListener('submit', (e) => {
      e.preventDefault();
      const datos = new FormData(e.target);
      agregarPublicacion({
        id: 'mio-' + Date.now(),
        autor: { nombre: usuario.nombre, usuario: usuario.usuario, foto: usuario.foto },
        categoria: 'Mi aporte',
        tono: 'terracota',
        imagen,
        titulo: datos.get('titulo'),
        texto: datos.get('texto') || datos.get('titulo'),
        lugar: datos.get('lugar'),
        hace: 'Ahora',
        likes: 0,
        amigos: true,
        comentarios: [],
      });
      cerrarModal();
      pestana = 'descubre';
      pintar();
      el.scrollTo({ top: el.querySelector('.feed').offsetTop - 120, behavior: 'smooth' });
      aviso('¡Tu aporte ya es parte de la comunidad!');
    });
  }

  /* ---------- Eventos ---------- */
  let ultimoToque = 0;
  el.addEventListener('click', (e) => {
    const t = e.target;
    const pest = t.closest('[data-pestana]');
    if (pest) {
      pestana = pest.dataset.pestana;
      pintar();
      return;
    }
    if (t.closest('[data-aporte]')) return abrirAporte();
    const hist = t.closest('[data-historia]');
    if (hist) return verHistoria(hist.dataset.historia);

    const post = t.closest('[data-post]');
    if (!post) return;
    if (t.closest('[data-like]')) return darLike(post);
    if (t.closest('[data-comentar]')) return abrirComentarios(post);
    if (t.closest('[data-compartir]')) return compartir(post);
    // Doble toque sobre la foto = me gusta
    if (!t.closest('button')) {
      const ahora = Date.now();
      if (ahora - ultimoToque < 320) darLike(post, true);
      ultimoToque = ahora;
    }
  });

  pintar();
  return el;
}
