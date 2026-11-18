/* =========================================================
   RUNA · Detalle de una reserva confirmada
   Se abre desde "Ver detalles de la reserva".
   Muestra un "pase" con código, fecha, punto de encuentro
   y acciones (escribir al anfitrión, cómo llegar).
   Ruta: #/reserva/:codigo
   ========================================================= */

import { crearPantalla, escapar, pesos, aviso } from '../ui.js';
import { icono } from '../iconos.js';
import { buscarExperiencia, buscarAnfitrion } from '../../data/datos.js';
import { listaReservas } from '../estado.js';
import { fechaLarga } from './reservar.js';

/** Patrón decorativo tipo "código QR" (no es un QR real). */
function patronCodigo(texto) {
  let semilla = [...texto].reduce((a, c) => a + c.charCodeAt(0), 0);
  const aleatorio = () => ((semilla = (semilla * 9301 + 49297) % 233280) / 233280);
  let celdas = '';
  for (let i = 0; i < 121; i++) {
    const fila = Math.floor(i / 11);
    const col = i % 11;
    const esquina = (fila < 3 && col < 3) || (fila < 3 && col > 7) || (fila > 7 && col < 3);
    celdas += `<i class="${esquina || aleatorio() > 0.5 ? 'on' : ''}"></i>`;
  }
  return `<div class="patron-codigo" aria-hidden="true">${celdas}</div>`;
}

export function pantallaReserva({ codigo }) {
  const reserva = listaReservas().find((r) => r.codigo === codigo);

  if (!reserva) {
    return crearPantalla(
      'reserva',
      `<div class="contenido">
        <button class="enlace-atras" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
        <div class="vacio"><strong>No encontramos esta reserva</strong>Puede que se haya borrado de este celular.</div>
      </div>`
    );
  }

  const exp = buscarExperiencia(reserva.experiencia);
  const anfitrion = buscarAnfitrion(exp.anfitrion);
  const fecha = new Date(reserva.fecha);

  const el = crearPantalla(
    'reserva',
    `
    <div class="contenido">
      <button class="enlace-atras aparecer" data-accion="volver" aria-label="Volver">${icono('atras')}</button>
      <h1 class="titulo-pantalla aparecer" style="--i:1">Tu reserva</h1>

      <article class="pase aparecer" style="--i:2">
        <div class="pase__foto">
          <img src="${exp.imagen}" alt="" />
          <span class="etiqueta etiqueta--terracota">${icono('checkCirculo')} Confirmada</span>
        </div>
        <div class="pase__cuerpo">
          <small>${escapar(exp.tipo)}</small>
          <h2>${escapar(exp.titulo)}</h2>
          <div class="pase__datos">
            <div><span>Fecha</span><strong>${fechaLarga(fecha)}</strong></div>
            <div><span>Hora</span><strong>${escapar(reserva.hora)}</strong></div>
            <div><span>Personas</span><strong>${reserva.personas}</strong></div>
            <div><span>Aporte</span><strong>${pesos(reserva.total)}</strong></div>
          </div>
        </div>
        <div class="pase__corte" aria-hidden="true"></div>
        <div class="pase__codigo">
          ${patronCodigo(reserva.codigo)}
          <div>
            <span>Código de reserva</span>
            <strong>${escapar(reserva.codigo)}</strong>
            <small>Muéstralo al llegar al territorio</small>
          </div>
        </div>
      </article>

      <div class="reserva__lugar aparecer" style="--i:3">
        <span class="mini-mapa__icono">${icono('casa')}</span>
        <div>
          <strong>${escapar(exp.ubicacion.lugar)}</strong>
          <small>${escapar(exp.ubicacion.detalle)}</small>
        </div>
      </div>

      <div class="reserva__acciones aparecer" style="--i:4">
        <button class="boton boton--oscuro" data-ir="/chat/${anfitrion.id}">${icono('mensaje')} Escribir a ${escapar(anfitrion.nombre.split(' ').slice(0, 2).join(' '))}</button>
        <a class="boton boton--contorno" href="https://www.google.com/maps/dir/?api=1&destination=${exp.ubicacion.lat},${exp.ubicacion.lng}" target="_blank" rel="noopener">${icono('navegar')} Cómo llegar</a>
        <button class="boton boton--contorno" data-calendario>${icono('calendario')} Agregar al calendario</button>
      </div>

      ${
        reserva.mensaje
          ? `<div class="reciprocidad aparecer" style="--i:5"><h3>${icono('mensaje')} Tu mensaje al anfitrión</h3><p>"${escapar(reserva.mensaje)}"</p></div>`
          : ''
      }
    </div>`
  );

  el.querySelector('[data-calendario]').addEventListener('click', () => aviso('Agregado a tu calendario (simulado)'));
  return el;
}
