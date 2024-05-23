let time;
let hh = (mm = ss = ms = 0);
let timeInInit = [];

const audioContext = new AudioContext();
let oscillator;

let pomodoro = {
  Pomodoro: 0, //25,
  ShortBreak: 0, //5,
  LongBreak: 0, // 15,
};

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
const puntos = document.querySelector(".puntos");

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

pom_trabajo.addEventListener("input", poneTimer);
pom_pausita.addEventListener("input", poneTimer);
pom_pausota.addEventListener("input", poneTimer);

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
    //run_crono();  // funcion de cronometro
    timeInInit = captura(); // variable necesaria para la funcioon colorete
    //run_countdown(); // funcion de timer
    runPomodoro();

    inicio_pausa.setAttribute("estado", "pausa");
    inicio_pausa.textContent = "Pausa";
  } else {
    stop_crono();
    enableInputPom();

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
  //alert("Cronómetro detenido");
}

function reset_crono() {
  clearInterval(time);
  hh = mm = ss = ms = "0" + 0;
  write_crono();
  tarjeta.style.background = "white";
}

// +++ funciones de temporizador +++

function calculaTiempo(ss, mm, hh) {
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

  return [hh, mm, ss];
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

  let arrayTime = calculaTiempo(ss, mm, hh);
  hh = arrayTime[0];
  mm = arrayTime[1];
  ss = arrayTime[2];
  write_crono();
}
/*
function run_countdown() {
  time = setInterval(() => {
    ms--;

    if (ms <= 0 && ss > 0) {
      ms = 99;
      ss--;
      ms = ms < 10 ? "0" + ms : ms;
      ss = ss < 10 ? "0" + ss : ss;
    } else if (ms <= 0 && ss < 0) {
      ms = 99;
      ss = 59;
      mm--;
      ms = ms < 10 ? "0" + ms : ms;
      ss = ss < 10 ? "0" + ss : ss;
      mm = mm < 10 ? "0" + mm : mm;
    }

    if (ss <= 0 && mm > 0) {
      ss = 59;
      mm--;
      ss = ss < 10 ? "0" + ss : ss;
      mm = mm < 10 ? "0" + mm : mm;
    } else if (ss <= 0 && mm < 0) {
      ss = 59;
      mm = 59;
      hh--;
      ss = ss < 10 ? "0" + ss : ss;
      mm = mm < 10 ? "0" + mm : mm;
      hh = hh < 10 ? "0" + hh : hh;
    }

    if (mm <= 0 && hh > 0) {
      mm = 59;
      hh--;
      mm = mm < 10 ? "0" + mm : mm;
      hh = hh < 10 ? "0" + hh : hh;
    } else if (mm <= 0 && hh < 0) {
      mm = 59;
      hh = 0;
      mm = mm < 10 ? "0" + mm : mm;
      hh = hh < 10 ? "0" + hh : hh;
    }

    if (hh == 0 && mm == 0 && ss == 0 && ms <= 0) {
      reset_crono();
      inicio_pausa.setAttribute("estado", "inicio");
      inicio_pausa.textContent = "Inicio";
      //bip(440 * 2, 0.5);
      reBip();
    }

    write_crono();
    colorete();
  }, 10);
}
*/
///*
function run_countdown() {
  return new Promise((resolve) => {
    time = setInterval(() => {
      ms--;

      if (ms <= 0 && ss > 0) {
        ms = 99;
        ss--;
        ms = ms < 10 ? "0" + ms : ms;
        ss = ss < 10 ? "0" + ss : ss;
      } else if (ms <= 0 && ss < 0) {
        ms = 99;
        ss = 59;
        mm--;
        ms = ms < 10 ? "0" + ms : ms;
        ss = ss < 10 ? "0" + ss : ss;
        mm = mm < 10 ? "0" + mm : mm;
      }

      if (ss <= 0 && mm > 0) {
        ss = 59;
        mm--;
        ss = ss < 10 ? "0" + ss : ss;
        mm = mm < 10 ? "0" + mm : mm;
      } else if (ss <= 0 && mm < 0) {
        ss = 59;
        mm = 59;
        hh--;
        ss = ss < 10 ? "0" + ss : ss;
        mm = mm < 10 ? "0" + mm : mm;
        hh = hh < 10 ? "0" + hh : hh;
      }

      if (mm <= 0 && hh > 0) {
        mm = 59;
        hh--;
        mm = mm < 10 ? "0" + mm : mm;
        hh = hh < 10 ? "0" + hh : hh;
      } else if (mm <= 0 && hh < 0) {
        mm = 59;
        hh = 0;
        mm = mm < 10 ? "0" + mm : mm;
        hh = hh < 10 ? "0" + hh : hh;
      }

      if (hh == 0 && mm == 0 && ss == 0 && ms <= 0) {
        reBip();
        clearInterval(time);
        reset_crono();
        inicio_pausa.setAttribute("estado", "inicio");
        inicio_pausa.textContent = "Inicio";
        //reBip();
        resolve();
      }
      write_crono();
      colorete();
    }, 10);
  });
}
//*/

function captura() {
  let segundos = parseInt(seg.innerHTML);
  let minutos = parseInt(min.innerHTML);
  let horas = parseInt(hr.innerHTML);

  return [horas, minutos, segundos];
}

function tiempo_a_seg(horas, minutos, segundos) {
  let min_seg = minutos * 60;
  let hor_seg = horas * 3600;
  let tts = segundos + min_seg + hor_seg; // timpo total en segundos

  //alert(`el tiempo total en segundos es de ${tts}`);
  return tts;
}

function colorete() {
  let tt = timeInInit;
  let tis = tiempo_a_seg(tt[0], tt[1], tt[2]); // tiempo al inicio en segundos
  let inicio = tis;

  let t_run = captura();
  let t_run_seg = tiempo_a_seg(t_run[0], t_run[1], t_run[2]); // tiempo actual en segundos

  let porcentaje = (t_run_seg / inicio) * 100;

  let color;

  let verde_amarillo = [
    "#00FF00",
    "#7FFF00",
    "#ADFF2F",
    "#DFFF00",
    "#FFFF00",
    "#FFFF33",
    "#FFD700",
    "#FFDB58",
    "#FFCC00",
    "#FFBF00",
  ];

  let amarillo_rojo = [
    "#FFFF00",
    "#FFA500",
    "#FF7F00",
    "#FF4500",
    "#FF2400",
    "#8B0000",
    "#FF0000",
    "#FF4500",
    "#DC143C",
    "#FF0000",
  ];

  const all_colors = verde_amarillo.concat(amarillo_rojo);

  function stepNumArray(tope, nPiezas) {
    let pasos = tope / nPiezas;
    let stepArray = [];

    for (let i = tope; i > 0; i -= pasos) {
      stepArray.push(i);
    }
    return stepArray;
  }

  const cambios = stepNumArray(100, 20);

  for (let i = 0; i < cambios.length; i++) {
    if (porcentaje > cambios[i]) {
      let nPorcentaje = porcentaje;
      nPorcentaje = cambios[i];
      tarjeta.style.background = all_colors[cambios.indexOf(nPorcentaje)];
      break;
    }
  }

  //tarjeta.style.background = all_colors[cambios.indexOf(porcentaje)];
  //console.log(porcentaje);
}

function bip(tone, duration) {
  return new Promise((resolve, reject) => {
    oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(tone, audioContext.currentTime);
    oscillator.type = "triangle";
    oscillator.connect(audioContext.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      resolve();
      reject("Ha habido un error con el sonido.");
    }, duration * 1000);
  });
}

function reBip() {
  bip(440 * 6, 0.125)
    .then(() => bip(440 * 3, 0.25))
    .then(() => bip(440 * 2, 0.125))
    .then(() => bip(440 * 1, 0.25))
    .catch((error) => {
      console.error("Error producido: " + error);
    });
}

// +++ funciones de pomodoro +++

function poneTimer(event) {
  const tipoTimer = event.target.id;
  const valorTimer = event.target.value;

  switch (tipoTimer) {
    case "in_trabajo":
      pomodoro.Pomodoro = valorTimer;
      //mm = pomodoro.Pomodoro;
      console.log("Tiempo de trabajo: " + valorTimer);
      write_pomodoro("Pomodoro", pomodoro.Pomodoro);

      break;
    case "in_p_corta":
      pomodoro.ShortBreak = valorTimer;
      //mm = pomodoro.ShortBreak;
      console.log("Pausa corta: " + valorTimer);
      write_pomodoro("Short break", pomodoro.ShortBreak);

      break;
    case "in_p_larga":
      pomodoro.LongBreak = valorTimer;
      //mm = pomodoro.LongBreak;
      console.log("Pausa larga: " + valorTimer);
      write_pomodoro("Longe break", pomodoro.LongBreak);

      break;
    default:
      console.log("timer no reconocido");
  }
}

function write_pomodoro(typeTimer, mm) {
  mseg.textContent = ms;
  seg.textContent = ss;
  min.textContent = mm;
  hr.textContent = typeTimer;
}

function write_txt(txt) {
  mseg.textContent = "";
  seg.textContent = "";
  min.textContent = "";
  puntos.textContent = "";
  hr.textContent = txt;
}

function disableInputPom() {
  pom_trabajo.disabled = true;
  pom_pausita.disabled = true;
  pom_pausota.disabled = true;
}

function enableInputPom() {
  pom_trabajo.disabled = false;
  pom_pausita.disabled = false;
  pom_pausota.disabled = false;
}

class PomodoroIterator {
  constructor(pomodoroTimes) {
    this.pomodoroTimes = pomodoroTimes;
    this.pomodoros = [
      "Pomodoro",
      "ShortBreak",
      "Pomodoro",
      "ShortBreak",
      "Pomodoro",
      "ShortBreak",
      "Pomodoro",
      "LongBreak",
    ];
    this.currentIndex = 0;
    this.resetCount = 4; // Reiniciar cada 4 pomodoros
    this.currentCount = 0;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.currentIndex >= this.pomodoros.length) {
      this.currentIndex = 0;
      this.currentCount = 0;
      return { done: true };
    }

    const currentStep = this.pomodoros[this.currentIndex];
    const stepTime = this.pomodoroTimes[currentStep];
    this.currentIndex++;

    if (this.currentIndex % 2 === 0) {
      this.currentCount++;
    }

    return { value: { step: currentStep, time: stepTime }, done: false };
  }

  reset() {
    this.currentIndex = 0;
    this.currentCount = 0;
  }

  getCurrentStep() {
    return this.pomodoros[this.currentIndex];
  }

  getNextStep() {
    if (this.currentIndex + 1 < this.pomodoros.length) {
      return this.pomodoros[this.currentIndex + 1];
    }
    return null;
  }
}

const pomodoroIterator = new PomodoroIterator(pomodoro);

async function runPomodoro() {
  disableInputPom();
  for (const step of pomodoroIterator) {
    console.log(`Doing ${step.step}`);
    mm = parseInt(step.time);
    //write_pomodoro(step.step, step.time);

    //console.log(`tiempo inicial: ${timeInInit}`);

    write_pomodoro(step.step, step.time);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Pausa de 1 segundo

    write_crono();
    timeInInit = captura();
    await run_countdown();

    await preguntaContinua(step.step);

    if (step.step === "LongBreak" && !pomodoroIterator.getNextStep()) {
      await preguntaRenueva();
    }
  }
}

async function preguntaRenueva() {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (confirm("Deceas continuar con otro ciclo pomodoro?")) {
        pomodoroIterator.reset();
        resolve();
      } else {
        enableInputPom();
        reset_crono();
      }
    }, 1000);
  });
}

async function preguntaContinua(step) {
  return new Promise((resolve) => {
    stop_crono();
    reset_crono();
    setTimeout(() => {
      alert(`Ha terminado el tiempo de ${step}`);
    }, 1000);
    //alert(`Ha terminado el tiempo de ${step}`);
    resolve();
  });
}
