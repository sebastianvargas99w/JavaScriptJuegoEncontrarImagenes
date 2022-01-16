const PORT = '8080';
let server = '';
// let id = 0;

const game = {
  nombreMensaje: 'Iniciar',
  files: [],
  mode: [],
  numberOfCards: 3,
  chancesToReveal: [],
  revealTimer: [],
  numberOfImages: [],
  code: 0,
  rondasJugar: 2,
  jugadores: [],
  gris: 0,
};

function addNames(names) {
  const namespace = document.getElementById('playersList');
  game.jugadores = names;
  const cantidad = document.getElementById('cantidad');
  cantidad.innerHTML = '';
  cantidad.innerHTML = `Total de jugadores: ${names.length}`;
  namespace.innerHTML = '';
  let listo = '';
  for (let iterator = 0; iterator < names.length; iterator += 1) {
    if (names[iterator].ready) {
      listo = '✔';
    }
    namespace.innerHTML += `<p>${names[iterator].name} ${listo}</p>`;
    listo = '';
  }
}

function connectionEstablished() {
  const messageJoin = {
    nombreMensaje: 'Unirse',
    nombreInvitado: 'Host',
  };
  server.send(JSON.stringify(messageJoin));
}

function messageArrived(event) {
  const message = JSON.parse(event.data);
  // console.log(message);
  if (message.nombreMensaje === 'AgregadoASesion') {
    addNames(message.jugadores);
  }
  if (message.nombreMensaje === 'SesionCreada') {
    window.sessionStorage.setItem('host', message.codigoEmisor);
    document.getElementById('link').value = message.codigo;
    window.sessionStorage.setItem('codigo', message.codigo);
    addNames(message.players);
    game.code = message.codigo;
    window.sessionStorage.setItem('codigoEmisor', message.codigoEmisor);
    window.sessionStorage.setItem('id', message.codigoEmisor);
  }
  if (message.nombreMensaje === 'Ronda') {
    window.sessionStorage.setItem('ronda', JSON.stringify(message));
    window.location.replace('../html/partida.xhtml');
  }
  if (message.nombreMensaje === 'SalioSesion') {
    addNames(message.jugadores);
  }
  if (message.nombreMensaje === 'Listo') {
    addNames(message.jugadores);
  }
}

function connect() {
  server = new WebSocket(`ws://localhost:${PORT}`);
  server.addEventListener('open', connectionEstablished);
  server.addEventListener('message', messageArrived);
}

function getConfiguration() {
  if (document.getElementById('traditional-mode').checked === true) {
    game.mode = 1;
  } else {
    game.mode = 2;
  }
  game.chancesToReveal = document.getElementById('amount-reveal').value;
  game.revealTimer = document.getElementById('reveal-timer').value;
  game.numberOfImages = document.getElementById('number-images').value;
  game.rondasJugar = document.getElementById('number-rounds').value;
  const gris = document.getElementById('gris');
  if (gris.checked) {
    game.gris = 1;
  } else {
    game.gris = 0;
  }
}

function cargarDato(elemento) {
  if (window.sessionStorage.getItem(elemento) !== null) {
    document.getElementById(elemento).value = window.sessionStorage.getItem(elemento);
  }
}

function cargarDatosDesdeStorage() {
  if (window.sessionStorage.getItem('name') !== null) {
    document.getElementById('owner').value = window.sessionStorage.getItem('name');
  }
  if (window.sessionStorage.getItem('game-mode') !== null) {
    if (window.sessionStorage.getItem('game-mode') === '1') {
      document.getElementById('traditional-mode').checked = true;
    } else if (window.sessionStorage.getItem('game-mode') === '2') {
      document.getElementById('shared-mode').checked = true;
    }
  }
  if (window.sessionStorage.getItem('gris') !== null) {
    if (window.sessionStorage.getItem('gris') === '1') {
      document.getElementById('gris').checked = true;
    }
  }
  cargarDato('amount-reveal');
  cargarDato('reveal-timer');
  cargarDato('number-images');
  cargarDato('number-rounds');
}

function guardarEnStorage() {
  window.sessionStorage.setItem('name', document.getElementById('owner').value);

  // guarda el modo de juego
  if (document.getElementById('traditional-mode').checked === true) {
    window.sessionStorage.setItem('game-mode', 1);
  } else {
    window.sessionStorage.setItem('game-mode', 2);
  }
  // guarda la opcion de grises
  if (document.getElementById('gris').checked === true) {
    window.sessionStorage.setItem('gris', 1);
  } else {
    window.sessionStorage.setItem('gris', 0);
  }
  window.sessionStorage.setItem('amount-reveal', document.getElementById('amount-reveal').value);
  window.sessionStorage.setItem('reveal-timer', document.getElementById('reveal-timer').value);
  window.sessionStorage.setItem('number-images', document.getElementById('number-images').value);
  window.sessionStorage.setItem('number-rounds', document.getElementById('number-rounds').value);
}

function empezarAction() {
  guardarEnStorage();
  const form = document.getElementById('formulario-empezar');
  if (form.checkValidity()) {
    getConfiguration();
    const message = JSON.stringify(game);
    server.send(message);
  } else {
    document.getElementById('hidden-submit').click();
  }
}

function actualizarSocket() {
  const response = {
    nombreMensaje: 'ActualizarSocket',
    codigo: window.sessionStorage.getItem('codigo'),
    codigoEmisor: window.sessionStorage.getItem('codigoEmisor'),
    estado: 'esperandoJugadores',
  };
  const message = JSON.stringify(response);
  server.send(message);
}

function crear() {
  if (window.sessionStorage.getItem('sesionAbierta') === 'false'
  || window.sessionStorage.getItem('sesionAbierta') === null
  || typeof (window.sessionStorage.getItem('sesionAbierta')) === 'undefined') {
    const respuesta = {
      nombreMensaje: 'Crear',
    };
    const mensaje = JSON.stringify(respuesta);
    server.send(mensaje);
    window.sessionStorage.setItem('sesionAbierta', 'true');
  } else {
    game.code = window.sessionStorage.getItem('codigo');
    actualizarSocket();
    document.getElementById('link').value = window.sessionStorage.getItem('codigo');
    document.getElementById('link').readOnly = true;
  }
}
function copiar() {
  const codigo = document.getElementById('link');
  codigo.select();
  document.execCommand('copy');
}
function nombre() {
  const nombreOwner = document.getElementById('owner').value;
  // window.sessionStorage.setItem('nombre', nombreOwner);
  const respuesta = {
    nombreMensaje: 'nombreAnfitrion',
    codigo: window.sessionStorage.getItem('codigo'),
    nombreA: nombreOwner,
  };
  const message = JSON.stringify(respuesta);
  server.send(message);
}

function traditionalInfoAction() {
  document.getElementById('traditional-info-popup').classList.toggle('show');
}

function sharedInfoAction() {
  document.getElementById('shared-info-popup').classList.toggle('show');
}

function gameSetup() {
  connect(); // EN EL FUTURO EL CONNECT SE CAMBIARA EL CONNECT A OTRO SCRIPT
  server.onopen = crear;
  cargarDatosDesdeStorage();
  document.getElementById('copiar').addEventListener('click', copiar);
  document.getElementById('owner').addEventListener('focusout', nombre);
  document.getElementById('empezar').addEventListener('click', empezarAction);

  document.getElementById('traditional-info').addEventListener('focus', traditionalInfoAction);
  document.getElementById('traditional-info').addEventListener('focusout', traditionalInfoAction);

  document.getElementById('shared-info').addEventListener('focus', sharedInfoAction);
  document.getElementById('shared-info').addEventListener('focusout', sharedInfoAction);
}

window.addEventListener('load', gameSetup);
