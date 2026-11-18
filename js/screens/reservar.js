/* =========================================================
   RUNA · Flujo de reserva (simulado, sin pagos reales)
   No estaba en Figma: se diseñó con el mismo estilo visual.
   Paso 1: elegir fecha (calendario), hora y número de personas
   Paso 2: resumen, aporte y confirmación
   Al confirmar: pop-up "¡Reserva confirmada!" (este sí es de Figma)
   Ruta: #/reservar/:id
   ========================================================= */

import { crearPantalla, escapar, pesos, vibrar } from '../ui.js';
import { icono } from '../iconos.js';
import { ir, volver, reemplazar } from '../router.js';
import { abrirModal } from '../modal.js';
import { buscarExperiencia, buscarAnfitrion, experiencias } from '../../data/datos.js';
import { agregarReserva } from '../estado.js';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS_CORTOS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

// Montos sugeridos cuando la experiencia es de "aporte libre"
const APORTES_LIBRES = [30000, 50000, 80000];

/** "sábado 15 de noviembre" */
export function fechaLarga(fecha) {
  return `${DIAS_LARGOS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
}

export function pantallaReservar({ id }) {
  const exp = buscarExperiencia(id) || experiencias[0];
  const anfitrion = buscarAnfitrion(exp.anfitrion);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Estado local de la reserva
  const reserva = {
    fecha: null,
    hora: exp.horas.length === 1 ? exp.horas[0] : null,
    personas: 1,
    aporteLibre: APORTES_LIBRES[1],
    mensaje: '',
  };
  let mesVisible = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  let paso = 1;

  /** ¿Se puede reservar ese día? (día de la semana habilitado y a partir de mañana) */
  const disponible = (fecha) => fecha > hoy && exp.diasSemana.includes(fecha.getDay());

  // Primera fecha disponible: se preselecciona para agilizar
  for (let i = 1; i < 60 && !reserva.fecha; i++) {
    const f = new Date(hoy);
    f.setDate(hoy.getDate() + i);
    if (disponible(f)) reserva.fecha = f;
  }
  if (reserva.fecha) mesVisible = new Date(reserva.fecha.getFullYear(), reserva.fecha.getMonth(), 1);

  const precioUnitario = () => exp.precio || reserva.aporteLibre;
  const total = () => precioUnitario() * reserva.personas;

  const el = crearPantalla(
    'reservar',
    `
    <div class="contenido">
      <div class="reservar__cabecera">
        <button class="boton-icono" data-atras aria-label="Volver">${icono('atras')}</button>
        <div>
          <h1>Reservar cupo</h1>
          <p data-texto-paso>Paso 1 de 2 · Fecha y personas</p>
        </div>
      </div>
      <div class="progreso"><span data-progreso></span></div>

      <!-- Mini tarjeta de la experiencia -->
      <div class="reservar__experiencia">
        <img src="${exp.imagen}" alt="" />
        <div>
          <strong>${escapar(exp.titulo)}</strong>
          <span>${icono('ubicacion')} ${escapar(exp.ubicacion.corto)} · ${escapar(exp.duracion)}</span>
          <small>Con ${escapar(anfitrion.nombre)}</small>
        </div>
      </div>

      <div class="pasos" data-pasos>
        <!-- ===== PASO 1 ===== -->
        <section class="paso-reserva" data-paso="1">
          <h2 class="reservar__titulo">${icono('calendario')} Elige la fecha</h2>
          <div class="calendario" data-calendario></div>
          <p class="reservar__ayuda">Esta experiencia se realiza: <strong>${escapar(exp.horariosTexto)}</strong></p>

          <h2 class="reservar__titulo">${icono('reloj')} Elige la hora</h2>
          <div class="horas" data-horas></div>

          <h2 class="reservar__titulo">${icono('personas')} ¿Cuántas personas?</h2>
          <div class="contador-personas">
            <div>
              <strong>Personas</strong>
              <small>${exp.cuposRestantes <= 3 ? `¡Solo quedan ${exp.cuposRestantes} cupos!` : `Hasta ${exp.cuposRestantes} cupos disponibles`}</small>
            </div>
            <div class="contador-personas__control">
              <button class="boton-icono" data-personas="-1" aria-label="Quitar persona">${icono('menos')}</button>
              <output data-num-personas aria-live="polite">1</output>
              <button class="boton-icono" data-personas="1" aria-label="Agregar persona">${icono('mas')}</button>
            </div>
          </div>

          ${
            exp.precio
              ? ''
              : `<h2 class="reservar__titulo">${icono('grupo')} Tu aporte libre consciente</h2>
                 <p class="reservar__ayuda">Esta minga no tiene precio fijo. Elige cuánto aportar por persona:</p>
                 <div class="horas" data-aportes>
                   ${APORTES_LIBRES.map((a) => `<button class="chip" data-aporte="${a}">${pesos(a)}</button>`).join('')}
                 </div>`
          }
        </section>

        <!-- ===== PASO 2 ===== -->
        <section class="paso-reserva" data-paso="2" hidden>
          <h2 class="reservar__titulo">${icono('checkCirculo')} Revisa tu reserva</h2>
          <div class="resumen" data-resumen></div>

          <h2 class="reservar__titulo">${icono('mensaje')} Mensaje para tu anfitrión <small>(opcional)</small></h2>
          <textarea class="campo" rows="3" maxlength="280" placeholder="Cuéntale algo: alergias, si vienes con niños, por qué te interesa este saber…" data-mensaje></textarea>

          <div class="aviso-prototipo">
            ${icono('sello')}
            <p><strong>Esto es un prototipo.</strong> No se realizará ningún cobro. En la versión real, el aporte se paga de forma segura y el ${exp.precio ? '85%' : '100%'} llega directo a la comunidad.</p>
          </div>
        </section>
      </div>
    </div>

    <!-- Barra inferior con total y botón principal -->
    <div class="barra-reserva">
      <div>
        <small data-detalle-total></small>
        <strong data-total></strong>
      </div>
      <button class="boton boton--primario" data-continuar>Continuar ${icono('flecha')}</button>
    </div>`
  );

  const $ = (sel) => el.querySelector(sel);

  /* ---------- Calendario ---------- */
  function pintarCalendario() {
    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();
    const primerDia = (new Date(anio, mes, 1).getDay() + 6) % 7; // lunes = 0
    const diasMes = new Date(anio, mes + 1, 0).getDate();
    const esMesActual = anio === hoy.getFullYear() && mes === hoy.getMonth();

    let celdas = '';
    for (let i = 0; i < primerDia; i++) celdas += '<span></span>';
    for (let d = 1; d <= diasMes; d++) {
      const fecha = new Date(anio, mes, d);
      const ok = disponible(fecha);
      const elegido = reserva.fecha && fecha.getTime() === reserva.fecha.getTime();
      const esHoy = fecha.getTime() === hoy.getTime();
      celdas += `<button class="dia ${ok ? 'es-disponible' : ''} ${elegido ? 'es-elegido' : ''} ${esHoy ? 'es-hoy' : ''}"
        ${ok ? `data-dia="${d}"` : 'disabled'} aria-label="${d} de ${MESES[mes]}${ok ? '' : ', no disponible'}">${d}</button>`;
    }

    $('[data-calendario]').innerHTML = `
      <div class="calendario__cabecera">
        <button class="boton-icono" data-mes="-1" ${esMesActual ? 'disabled' : ''} aria-label="Mes anterior">${icono('atras')}</button>
        <strong>${MESES[mes][0].toUpperCase() + MESES[mes].slice(1)} ${anio}</strong>
        <button class="boton-icono" data-mes="1" aria-label="Mes siguiente">${icono('flecha')}</button>
      </div>
      <div class="calendario__semana">${DIAS_CORTOS.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="calendario__dias">${celdas}</div>`;
  }

  function pintarHoras() {
    $('[data-horas]').innerHTML = exp.horas
      .map((h) => `<button class="chip ${reserva.hora === h ? 'es-activo' : ''}" data-hora="${h}">${h}</button>`)
      .join('');
    el.querySelectorAll('[data-aporte]').forEach((b) => b.classList.toggle('es-activo', Number(b.dataset.aporte) === reserva.aporteLibre));
  }

  function pintarTotal() {
    $('[data-num-personas]').textContent = reserva.personas;
    $('[data-total]').textContent = `${pesos(total())} COP`;
    $('[data-detalle-total]').textContent = `${reserva.personas} ${reserva.personas === 1 ? 'persona' : 'personas'} × ${pesos(precioUnitario())}`;
    const listo = reserva.fecha && reserva.hora;
    $('[data-continuar]').disabled = !listo;
    el.querySelector('[data-personas="-1"]').disabled = reserva.personas <= 1;
    el.querySelector('[data-personas="1"]').disabled = reserva.personas >= exp.cuposRestantes;
  }

  function pintarResumen() {
    $('[data-resumen]').innerHTML = `
      <div class="resumen__fila">${icono('calendario')}<span>Fecha</span><strong>${fechaLarga(reserva.fecha)}</strong></div>
      <div class="resumen__fila">${icono('reloj')}<span>Hora</span><strong>${reserva.hora} · ${escapar(exp.duracion)}</strong></div>
      <div class="resumen__fila">${icono('personas')}<span>Personas</span><strong>${reserva.personas}</strong></div>
      <div class="resumen__fila">${icono('ubicacion')}<span>Encuentro</span><strong>${escapar(exp.ubicacion.lugar)}</strong></div>
      <hr />
      <div class="resumen__fila resumen__fila--simple"><span>${exp.precio ? 'Aporte recíproco' : 'Aporte libre'} × ${reserva.personas}</span><strong>${pesos(total())}</strong></div>
      <div class="resumen__fila resumen__fila--simple"><span>Tarifa de servicio RUNA</span><strong>$0</strong></div>
      <div class="resumen__fila resumen__total"><span>Total</span><strong>${pesos(total())} COP</strong></div>
      <button class="enlace-editar" data-ir-paso="1">${icono('editar')} Cambiar fecha o personas</button>`;
  }

  /* ---------- Cambiar de paso (con animación) ---------- */
  function irAPaso(nuevo) {
    const sentido = nuevo > paso ? 'adelante' : 'atras';
    const actual = el.querySelector(`[data-paso="${paso}"]`);
    const siguiente = el.querySelector(`[data-paso="${nuevo}"]`);
    actual.hidden = true;
    siguiente.hidden = false;
    siguiente.classList.remove('paso-entra-adelante', 'paso-entra-atras');
    void siguiente.offsetWidth;
    siguiente.classList.add(`paso-entra-${sentido}`);
    paso = nuevo;
    if (paso === 2) pintarResumen();
    $('[data-texto-paso]').textContent = paso === 1 ? 'Paso 1 de 2 · Fecha y personas' : 'Paso 2 de 2 · Resumen';
    $('[data-progreso]').style.width = paso === 1 ? '50%' : '100%';
    $('[data-continuar]').innerHTML = paso === 1 ? `Continuar ${icono('flecha')}` : `Confirmar ${icono('check')}`;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Confirmar (simulado) ---------- */
  function confirmar() {
    const boton = $('[data-continuar]');
    boton.disabled = true;
    boton.innerHTML = '<span class="cargando"></span> Confirmando…';
    reserva.mensaje = $('[data-mensaje]').value.trim();

    // Simula la espera de un servidor
    setTimeout(() => {
      const guardada = agregarReserva({
        experiencia: exp.id,
        fecha: reserva.fecha.toISOString(),
        hora: reserva.hora,
        personas: reserva.personas,
        total: total(),
        mensaje: reserva.mensaje,
      });
      vibrar([20, 60, 30]);
      mostrarConfirmacion(guardada);
    }, 1200);
  }

  function mostrarConfirmacion(guardada) {
    abrirModal({
      clase: 'modal-confirmacion',
      contenido: `
        <div class="confirmacion">
          <span class="confirmacion__check">${icono('check')}</span>
          <h2>¡Reserva confirmada!</h2>
          <div class="confirmacion__tarjeta">
            <small>Experiencia</small>
            <strong>${escapar(exp.titulo)}</strong>
            <span>${fechaLarga(reserva.fecha)} · ${reserva.hora}</span>
          </div>
          <button class="boton boton--contorno boton--bloque" data-detalles>Ver detalles de la reserva</button>
          <button class="boton boton--contorno boton--bloque" data-inicio>Volver al inicio</button>
        </div>`,
      alCerrar: () => {
        // Si cierra con la X, también lo llevamos a su reserva
        if (location.hash.startsWith('#/reservar')) reemplazar(`/reserva/${guardada.codigo}`);
      },
    }).el.addEventListener('click', (e) => {
      if (e.target.closest('[data-detalles]')) reemplazar(`/reserva/${guardada.codigo}`);
      if (e.target.closest('[data-inicio]')) ir('/explorar');
    });
  }

  /* ---------- Eventos ---------- */
  el.addEventListener('click', (e) => {
    const t = e.target;
    const dia = t.closest('[data-dia]');
    if (dia) {
      reserva.fecha = new Date(mesVisible.getFullYear(), mesVisible.getMonth(), Number(dia.dataset.dia));
      vibrar();
      pintarCalendario();
      pintarTotal();
    }
    const mes = t.closest('[data-mes]');
    if (mes && !mes.disabled) {
      mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + Number(mes.dataset.mes), 1);
      pintarCalendario();
    }
    const hora = t.closest('[data-hora]');
    if (hora) {
      reserva.hora = hora.dataset.hora;
      vibrar();
      pintarHoras();
      pintarTotal();
    }
    const aporte = t.closest('[data-aporte]');
    if (aporte) {
      reserva.aporteLibre = Number(aporte.dataset.aporte);
      pintarHoras();
      pintarTotal();
    }
    const personas = t.closest('[data-personas]');
    if (personas && !personas.disabled) {
      reserva.personas = Math.min(exp.cuposRestantes, Math.max(1, reserva.personas + Number(personas.dataset.personas)));
      vibrar();
      const salida = $('[data-num-personas]');
      salida.classList.remove('rebote');
      void salida.offsetWidth;
      salida.classList.add('rebote');
      pintarTotal();
    }
    if (t.closest('[data-ir-paso="1"]')) irAPaso(1);
    if (t.closest('[data-atras]')) (paso === 2 ? irAPaso(1) : volver());
    if (t.closest('[data-continuar]')) (paso === 1 ? irAPaso(2) : confirmar());
  });

  pintarCalendario();
  pintarHoras();
  pintarTotal();
  return el;
}
