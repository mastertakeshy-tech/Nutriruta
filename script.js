/*
  Funcionamiento de la app
*/

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Datos reunidos
let preferenciaElegida = "";
let planElegido = "";
let diasElegidos = [];
let diaActual = 0;
let tipoMenu = "carne";
let menusElegidos = {};

// Opciones
const platos = {
  carne: [
    { nombre: "Pollo con arroz y vegetales", descripcion: "Una opción de almuerzo de ejemplo.", precio: 18000 },
    { nombre: "Carne con papa y ensalada", descripcion: "Una combinación para variar el menú.", precio: 18000 }
  ],
  veg: [
    { nombre: "Bowl de lentejas y vegetales", descripcion: "Una opción vegetariana de ejemplo.", precio: 18000 },
    { nombre: "Arroz con vegetales y garbanzos", descripcion: "Una combinación sin carne.", precio: 18000 }
  ]
};

// Cambia de pantalla y deja visible solo la que se necesita.
function mostrarPantalla(idPantalla) {
  const pantallas = document.querySelectorAll(".pantalla");

  pantallas.forEach(function(pantalla) {
    pantalla.classList.remove("activa");
  });

  document.getElementById(idPantalla).classList.add("activa");
  window.scrollTo(0, 0);
}

function guardarPreferencia() {
  const opcion = document.querySelector('input[name="preferencia"]:checked');

  if (!opcion) {
    alert("Selecciona una preferencia para continuar.");
    return;
  }

  preferenciaElegida = opcion.value;
  mostrarPantalla("planes");
}

function guardarPlan() {
  const opcion = document.querySelector('input[name="plan"]:checked');

  if (!opcion) {
    alert("Selecciona uno de los planes.");
    return;
  }

  planElegido = opcion.value;
  crearListaDias();
  mostrarPantalla("dias");
}

// Crea las casillas de los días a partir de la lista que está al inicio del archivo.
function crearListaDias() {
  const lista = document.getElementById("listaDias");
  lista.innerHTML = "";

  diasSemana.forEach(function(dia, indice) {
    const etiqueta = document.createElement("label");
    etiqueta.className = "opcion lista-dia";
    etiqueta.innerHTML = '<input type="checkbox" name="dia" value="' + indice + '"> <span><b>' + dia + '</b></span>';
    lista.appendChild(etiqueta);
  });
}

function prepararMenu() {
  const marcados = document.querySelectorAll('input[name="dia"]:checked');
  diasElegidos = Array.from(marcados).map(function(casilla) {
    return Number(casilla.value);
  });

  if (diasElegidos.length < 2) {
    alert("Selecciona al menos dos días.");
    return;
  }

  // Conserva solo las selecciones de los días que siguen marcados.
  Object.keys(menusElegidos).forEach(function(dia) {
    if (!diasElegidos.includes(Number(dia))) {
      delete menusElegidos[dia];
    }
  });

  diaActual = 0;
  tipoMenu = preferenciaElegida === "veg" ? "veg" : "carne";
  mostrarMenuDelDia();
  mostrarPantalla("menu");
}

function cambiarTipoMenu(tipo) {
  tipoMenu = tipo;
  mostrarMenuDelDia();
}

function mostrarMenuDelDia() {
  const numeroDia = diasElegidos[diaActual];
  document.getElementById("nombreDia").textContent = diasSemana[numeroDia];
  document.getElementById("fechaDia").textContent = "Menú " + (diaActual + 1) + " de " + diasElegidos.length;

  document.getElementById("pestanaCarne").classList.toggle("seleccionada", tipoMenu === "carne");
  document.getElementById("pestanaVeg").classList.toggle("seleccionada", tipoMenu === "veg");

  const contenedor = document.getElementById("opcionesMenu");
  contenedor.innerHTML = "";
  const platosDelTipo = platos[tipoMenu];
  const menuGuardado = menusElegidos[numeroDia];

  platosDelTipo.forEach(function(plato, indice) {
    const seleccionado = menuGuardado && menuGuardado.nombre === plato.nombre;
    const tarjeta = document.createElement("div");
    tarjeta.className = "plato";

       tarjeta.innerHTML =
      '<img src="fotos/figura1.png" alt="Imagen provisional del plato">' +
      '<label><input type="radio" name="platoDia" value="' + indice + '" ' + (seleccionado ? "checked" : "") + '>' +
      '<span><b>' + plato.nombre + '</b><small>' + plato.descripcion + '</small><small>$' + plato.precio.toLocaleString("es-CO") + '</small></span></label>';

    contenedor.appendChild(tarjeta);
  });

  const boton = document.getElementById("botonSiguienteDia");
  boton.textContent = diaActual === diasElegidos.length - 1 ? "Terminar menú" : "Guardar y continuar";
}

function cambiarDia(cambio) {
  diaActual += cambio;

  if (diaActual < 0) {
    diaActual = diasElegidos.length - 1;
  }
  if (diaActual >= diasElegidos.length) {
    diaActual = 0;
  }

  mostrarMenuDelDia();
}

function guardarMenuDelDia() {
  const opcion = document.querySelector('input[name="platoDia"]:checked');

  if (!opcion) {
    alert("Selecciona un plato para este día.");
    return;
  }

  const numeroDia = diasElegidos[diaActual];
  menusElegidos[numeroDia] = platos[tipoMenu][Number(opcion.value)];

  if (diaActual < diasElegidos.length - 1) {
    diaActual++;
    // Si no se ha guardado un menú para el nuevo día, usa el tipo de preferencia elegido.
    tipoMenu = preferenciaElegida === "veg" ? "veg" : "carne";
    mostrarMenuDelDia();
  } else {
    mostrarPantalla("snacks");
  }
}

function obtenerSnacks() {
  const seleccionados = document.querySelectorAll('input[name="snack"]:checked');
  return Array.from(seleccionados).map(function(casilla) {
    return {
      nombre: casilla.dataset.nombre,
      precio: Number(casilla.value)
    };
  });
}

function mostrarResumen() {
  const contenedor = document.getElementById("detalleResumen");
  let total = 0;
  contenedor.innerHTML = "";

  diasElegidos.forEach(function(numeroDia) {
    const plato = menusElegidos[numeroDia];
    if (plato) {
      total += plato.precio;
      contenedor.innerHTML += '<div class="fila-resumen"><span>' + diasSemana[numeroDia] + '</span><b>' + plato.nombre + '</b></div>';
    }
  });

  const snacks = obtenerSnacks();
  snacks.forEach(function(snack) {
    total += snack.precio;
    contenedor.innerHTML += '<div class="fila-resumen"><span>Snack</span><b>' + snack.nombre + '</b></div>';
  });

  document.getElementById("totalResumen").innerHTML =
    '<div>Plan: ' + (planElegido === "snack" ? "Almuerzo + snack" : "Semanal básico") + '</div>' +
    '<div>Almuerzos seleccionados: ' + Object.keys(menusElegidos).length + '</div>' +
    '<div>Snacks seleccionados: ' + snacks.length + '</div>' +
    '<div class="total-grande">Total estimado: $' + total.toLocaleString("es-CO") + ' COP</div>' +
    '<small>Precio ilustrativo del prototipo, no corresponde a una compra real.</small>';

  mostrarPantalla("resumen");
}

function confirmarPedido() {
  const punto = document.querySelector('input[name="punto"]:checked');
  const pago = document.querySelector('input[name="pago"]:checked');
  const resumen = document.getElementById("totalResumen").innerHTML;

  document.getElementById("ticketFinal").innerHTML =
    '<p><b>Punto de recogida:</b> ' + (punto ? punto.value : "No seleccionado") + '</p>' +
    '<p><b>Método seleccionado:</b> ' + (pago ? pago.value : "No seleccionado") + '</p>' +
    resumen +
    '<p><b>Estado:</b> demostración completada; no se realizó ningún pago.</p>';

  mostrarPantalla("confirmacion");
}


/*
  Eso es todo. 
*/




