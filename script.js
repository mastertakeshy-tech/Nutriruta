//configuración del sistema 
// Opciones del menú: nombre, descripción, precio y ruta de la imagen
const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const PLATOS = {
  carne: [['Bowl de pollo','Con quinoa y rugula, tomate cherry, pepino',18000,'fotos/figura1.png'],
          ['Res salteada','Con arroz integral y ensalada(pepino, zanahoria, tomate y aguacate)',18000,'fotos/figura1.png'],
          ['Ensalada de atún','Con garbanzos y aguacate',18000,'fotos/figura1.png'],
          ['Pescado a la plancha','Con puré de papa y pepino cohombro, tomate y aguacate',18000,'fotos/figura1.png'],
          ['Lasaña de pollo','Con espinaca y queso',18000,'fotos/figura1.png'],
          ['Wrap de pollo','Con manzana verde y lechuga',18000,'fotos/figura1.png']],
  veg:   [['Curry de garbanzos','Con quinua',17000,'fotos/figura1.png'],
          ['Burritos de champiñones','Con guacamole',18000,'fotos/figura1.png'],
          ['Pasta de sukini','Con zanahoria, pepino cohombro, pepinillos',17000,'fotos/figura1.png'],
          ['Hamburguesa de lentejas','Con tomate, lechuga, cebolla',18000,'fotos/figura1.png'],
          ['Lasaña de berenjena','Con queso y tomate',19000,'fotos/figura1.png'],
          ['Wrap de hummus','Con rugula, tomate cherry, pepino',17000,'fotos/figura1.png']]
};
// Luego cambiare las fotos de cada plato, por ahora todos con el prototipo figura1.

// Fechas de lunes a sábado de la semana actual.
const fechas = [];
{ const hoy = new Date(), lun = new Date(hoy);
  lun.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  for (let i = 0; i < 6; i++) {
    const f = new Date(lun); f.setDate(lun.getDate() + i);
    fechas.push(f.toLocaleDateString('es-CO', {day:'numeric', month:'long'}));
  }
}
document.querySelectorAll('.fechaDia').forEach((s, i) => s.textContent = fechas[i]);

// Selecciones realizadas durante el recorrido.
let tipo = 'carne';      // pestana activa: carne o veg
let diasSel = [];        // indices de DIAS elegidos
let menus = {};          // indiceDia -> {tab, nombre, precio}
let diaActual = 0;       // dia que se muestra en la pantalla 5

const $ = id => document.getElementById(id);
const dinero = n => '$ ' + n.toLocaleString('es-CO');

// Navegación entre pantallas
function ir(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  $(id).classList.add('activa');
  window.scrollTo(0, 0);
}
function elegirPref() {
  const p = document.querySelector('[name=pref]:checked');
  if (!p) return alert('Elige una opción');
  tipo = p.value;   // la pestana del menu arranca con tu preferencia
  ir('p3');
}
function elegirPlan() {
  if (!document.querySelector('[name=plan]:checked')) return alert('Elige un plan');
  ir('p4');
}

// Menú disponible para cada día seleccionado.
function verMenu() {
  diasSel = [...document.querySelectorAll('[name=dia]:checked')].map(c => +c.value);
  if (diasSel.length < 2) return alert('Elige mínimo 2 días');
  diaActual = 0;
  pintarMenu();
  ir('p5');
}
function opcionesDe(d) { return [PLATOS[tipo][d], PLATOS[tipo][(d + 3) % 6]]; }
function pintarMenu() {
  const d = diasSel[diaActual];
  $('mDia').textContent = DIAS[d];
  $('mFecha').textContent = fechas[d];
  $('tabCarne').className = tipo == 'carne' ? 'on' : '';
  $('tabVeg').className = tipo == 'veg' ? 'on' : '';
  const ops = opcionesDe(d);
  if (!menus[d] || menus[d].tab != tipo)           // opcion 1 por defecto
    menus[d] = {tab: tipo, nombre: ops[0][0], precio: ops[0][2]};
  $('mOpciones').innerHTML = ops.map((o, i) => `
    <label class="opcion plato"><input type="radio" name="op" ${menus[d].nombre == o[0] ? 'checked' : ''} onclick="elegir(${i})">
    <img class="imagen-plato" src="${o[3]}" alt="${o[0]}">
    <b>${o[0]}</b><small>${o[1]}</small><span class="precio">${dinero(o[2])}</span></label>`).join('');
  $('btnMenu').textContent = diaActual == diasSel.length - 1 ? 'Continuar' : 'Siguiente día';
}
function elegir(i) {
  const d = diasSel[diaActual], o = opcionesDe(d)[i];
  menus[d] = {tab: tipo, nombre: o[0], precio: o[2]};
}
function tab(t) { tipo = t; pintarMenu(); }
function cambiarDia(n) {
  diaActual = Math.min(Math.max(diaActual + n, 0), diasSel.length - 1);
  pintarMenu();
}
function siguienteDia() {
  if (diaActual < diasSel.length - 1) { diaActual++; pintarMenu(); }
  else ir('p6');
}

// Resumen de almuerzos y snacks seleccionados.
function snacksSel() {
  return [...document.querySelectorAll('[name=snack]:checked')].map(s => ({n: s.dataset.n, p: +s.value}));
}
function pintarResumen() {
  $('resumen').innerHTML = diasSel.filter(d => menus[d]).map(d => `
    <div class="fila"><b>${DIAS[d].slice(0,3)}</b> ${menus[d].nombre}
    <span>${dinero(menus[d].precio)}</span>
    <button class="x" onclick="quitar(${d})">×</button></div>`).join('');
  const tA = diasSel.reduce((a, d) => a + (menus[d] ? menus[d].precio : 0), 0);
  const sn = snacksSel(), tS = sn.reduce((a, s) => a + s.p, 0);
  $('totales').innerHTML = `Total estimado<br>
    ${diasSel.length} almuerzos — ${dinero(tA)}<br>
    ${sn.length ? sn.length + ' snack(s) — ' + dinero(tS) + '<br>' : ''}
    <div class="grande">Total: ${dinero(tA + tS)}</div>`;
}
function quitar(d) {
  diasSel = diasSel.filter(x => x != d);
  delete menus[d];
  document.querySelectorAll('[name=dia]')[d].checked = false;
  pintarResumen();
}
function irRecogida() {
  if (diasSel.length < 2) { alert('Elige mínimo 2 días'); ir('p4'); }
  else ir('p8');
}

// Datos que aparecen en la confirmación del pedido.
function pintarConfirm() {
  const sn = snacksSel();
  const tA = diasSel.reduce((a, d) => a + menus[d].precio, 0);
  const tS = sn.reduce((a, s) => a + s.p, 0);
  $('ticket').innerHTML = `Resumen<br>
    ${diasSel.length} almuerzos${sn.length ? ' · ' + sn.length + ' snack(s)' : ''}<br>
    Punto de recogida: <b>${document.querySelector('[name=punto]:checked').value}</b><br>
    Pago: <b>${document.querySelector('[name=pago]:checked').value}</b>
    <div class="grande">Valor total: ${dinero(tA + tS)}</div>`;
}

//Nada más.