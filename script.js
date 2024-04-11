let hh = (mm = ss = ms = 0);

// elementos de menu de funcionaliades ----------------------------

const button_crono = document.querySelector(".modo_crono");
const button_timer = document.querySelector(".modo_timer");
const button_pom = document.querySelector(".modo_pom");
const button_metro = document.querySelector(".modo_metro");

// elementos de la tarjeta ------------------------------------------

const tarjeta = document.querySelector(".tarjeta");

// +++ display +++

const hr = document.querySelector(".horas");
const min = document.querySelector(".minutos");
const seg = document.querySelector(".segundos");
const mseg = document.querySelector(".miliseg");

// +++ controles +++

const op_crono = document.querySelector(".cronometro");
const inicio_pausa = document.querySelector(".inicio_pausa");
const reiniciar = document.querySelector(".reiniciar");

const op_timer = document.querySelector(".in_crono");
const timerH = document.querySelector("#in_horas");
const timerM = document.querySelector("#in_minutos");
const timerS = document.querySelector("#in_segundos");

const op_pom = document.querySelector(".in_pom");
const pom_trabajo = document.querySelector("#in_trabajo");
const pom_pausita = document.querySelector("#in_p_corta");
const pom_pausota = document.querySelector("#in_p_larga");

const op_metonomo = document.querySelector(".in_tempo");
const metro_bpm = document.querySelector("#in_bpm");

// listeners de opciones de funcionalidad --------------------------------

button_crono.addEventListener("click", show_crono);
button_timer.addEventListener("click", show_timer);
button_pom.addEventListener("click", show_pom);
button_metro.addEventListener("click", show_metro);

// listeners de elementos de la tarjeta ------------------------------------

inicio_pausa.addEventListener("click", playStop);
inicio_pausa.setAttribute("estado", "inicio");
reiniciar.addEventListener("click", mainReset);

timerH.addEventListener("input", poneTiempo);
timerM.addEventListener("input", poneTiempo);
timerS.addEventListener("input", poneTiempo);

// acciones de menu de opciones de funcionalidades ----------------------------

function show_crono() {
  op_crono.classList.remove("inactive");
  op_timer.classList.add("inactive");
  op_pom.classList.add("inactive");
  op_metonomo.classList.add("inactive");

  button_crono.classList.add("op_click");
  button_timer.classList.remove("op_click");
  button_pom.classList.remove("op_click");
  button_metro.classList.remove("op_click");
  reset_crono();
}

function show_timer() {
  //op_crono.classList.add("inactive");
  op_timer.classList.remove("inactive");
  op_pom.classList.add("inactive");
  op_metonomo.classList.add("inactive");

  button_crono.classList.remove("op_click");
  button_timer.classList.add("op_click");
  button_pom.classList.remove("op_click");
  button_metro.classList.remove("op_click");
  reset_crono();
}

function show_pom() {
  //op_crono.classList.add("inactive");
  op_timer.classList.add("inactive");
  op_pom.classList.remove("inactive");
  op_metonomo.classList.add("inactive");

  button_crono.classList.remove("op_click");
  button_timer.classList.remove("op_click");
  button_pom.classList.add("op_click");
  button_metro.classList.remove("op_click");
  reset_crono();
}

function show_metro() {
  //op_crono.classList.add("inactive");
  op_timer.classList.add("inactive");
  op_pom.classList.add("inactive");
  op_metonomo.classList.remove("inactive");

  button_crono.classList.remove("op_click");
  button_timer.classList.remove("op_click");
  button_pom.classList.remove("op_click");
  button_metro.classList.add("op_click");
  reset_crono();
}

// acciones de elementos de tarjeta ---------------------------------------

//  +++ funcion para boton de inicio y pausa +++

function playStop() {
  let estadoActual = inicio_pausa.getAttribute("estado");

  if (estadoActual === "inicio") {
    run_crono();
    inicio_pausa.setAttribute("estado", "pausa");
    inicio_pausa.textContent = "Pausa";
  } else {
    stop_crono();
    inicio_pausa.setAttribute("estado", "inicio");
    inicio_pausa.textContent = "Inicio";
  }
}

function mainReset() {
  reset_crono();
}

//  +++ funciones de cronometro +++

function write_crono() {
  mseg.textContent = ms;
  seg.textContent = ss;
  min.textContent = mm;
  hr.textContent = hh;
}

function run_crono() {
  time = setInterval(() => {
    ms++;
    ms = ms < 10 ? "0" + ms : ms;

    if (ms == 100) {
      ss++;
      ss = ss < 10 ? "0" + ss : ss;
      ms = "0" + 0;
    }

    if (ss == 60) {
      mm++;
      mm = mm < 10 ? "0" + mm : mm;
      ss = "0" + 0;
    }

    if (mm == 60) {
      hh++;
      hh = hh < 10 ? "0" + hh : hh;
      mm = "0" + 0;
    }

    write_crono();
  }, 10);
}

function stop_crono() {
  clearInterval(time);
  alert("Cronómetro detenido");
}

function reset_crono() {
  clearInterval(time);
  hh = mm = ss = ms = "0" + 0;
  write_crono();
}

// +++ funciones de temporizador +++

function calculaTiempo() {
  let mds = ss / 60;
  let hdm = mm / 60;
  let sr = (mds - Math.trunc(mds)) * 60;
  let mr = (hdm - Math.trunc(hdm)) * 60;
  if (ss > 60) {
    ss = sr;
    mm = mm + Math.trunc(mds);

    if (sr - Math.trunc(sr) >= 5) {
      ss = Math.ceil(sr);
    } else {
      ss = Math.floor(sr);
    }
  }
  if (mm > 60) {
    mm = mr;
    hh = parseInt(hh) + Math.trunc(hdm);
    if (mr - Math.trunc(mr) >= 5) {
      mm = Math.ceil(mr);
    } else {
      mm = Math.floor(mr);
    }
  }
}

function poneTiempo(event) {
  const tipoTiempo = event.target.id;
  const valorTiempo = event.target.value;

  switch (tipoTiempo) {
    case "in_horas":
      hh = valorTiempo;
      console.log("Horas: " + valorTiempo);
      break;
    case "in_minutos":
      mm = valorTiempo;
      console.log("Minutos: " + valorTiempo);
      break;
    case "in_segundos":
      ss = valorTiempo;
      console.log("Segundos: " + valorTiempo);
      break;
    default:
      console.log("Tipo de tiempo no reconocido");
  }

  calculaTiempo();
  write_crono();
}
