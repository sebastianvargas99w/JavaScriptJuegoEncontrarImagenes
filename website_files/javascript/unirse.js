const PORT = '8080';
let server = '';
let codigoEmisor = '';

function saveSessionInfo() {
  window.sessionStorage.codigoEmisor = JSON.stringify(codigoEmisor);
}

function sendMessage(text) {
  server.send(text);
  console.log(`mensaje enviado: ${text}`);
}

/**
Envia el mensaje que se tiene que enviar despues de establecer la conexion.
 */
function buildUnirse() {
  const messageJoin = {
    nombreMensaje: 'Unirse',
    codigo: document.getElementById('codigo').value,
    nombreInvitado: document.getElementById('nombreNuevo').value,
  };
  window.sessionStorage.setItem('codigo', document.getElementById('codigo').value);
  // window.sessionStorage.setItem('nombre', document.getElementById('nombreNuevo').value);
  sendMessage(JSON.stringify(messageJoin));
}

function cerrarVentanaError(idVentana) {
  document.getElementById(idVentana).classList.toggle('show');
}

function dibujarVentana(idVentana) {
  const popup = document.getElementById(idVentana);
  popup.classList.toggle('show');
}

function mostrarVentanaError() {
  dibujarVentana('codigo-invalido', 'button-codigo-invalido');
}

/*
Funcion que se ejecuta cuando llega un mensaje del servidor.
 */
function messageArrived(event) {
  const message = JSON.parse(event.data);
  if (message.nombreMensaje === 'AgregadoASesion') {
    codigoEmisor = message.codigoEmisor;
    saveSessionInfo();
    window.sessionStorage.setItem('sesionAbierta', 'true');
    window.sessionStorage.setItem('id', codigoEmisor);
    window.location.replace('../html/esperando.xhtml');
  } else if (message.nombreMensaje === 'ErrorCodigoInvalido') {
    mostrarVentanaError();
  }
}

/*
Se conecta con el servidor y agrega los escuha necesario.
 */
function connect() {
  server = new WebSocket(`ws://localhost:${PORT}`);
  server.addEventListener('message', messageArrived);
}

function cargarDatosDesdeStorage() {
  if (window.sessionStorage.getItem('name') !== null) {
    document.getElementById('nombreNuevo').value = window.sessionStorage.getItem('name');
  }
}
function guardarDatosEnStorage() {
  window.sessionStorage.setItem('name', document.getElementById('nombreNuevo').value);
}

function empezarAction() {
  guardarDatosEnStorage();
  const form = document.getElementById('formulario-empezar');
  if (form.checkValidity()) {
    connect();
    server.onopen = buildUnirse;
  } else {
    document.getElementById('hidden-submit').click();
  }
}

function setup() {
  cargarDatosDesdeStorage();
  document.getElementById('empezar').addEventListener('click', empezarAction);
  document.getElementById('button-codigo-invalido').addEventListener('click', () => { cerrarVentanaError('codigo-invalido'); });
}

window.addEventListener('load', setup);
