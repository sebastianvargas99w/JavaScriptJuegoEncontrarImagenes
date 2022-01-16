let server = '';
const PORT = '8080';

function addNames(names) {
  const namespace = document.getElementById('playersList');
  namespace.innerHTML = '';
  const cantidad = document.getElementById('cantidad');
  cantidad.innerHTML = '';
  cantidad.innerHTML = `Total de jugadores: ${names.length}`;
  for (let iterator = 0; iterator < names.length; iterator += 1) {
    namespace.innerHTML += `<p>${names[iterator].name} </p>`;
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

function connectionEstablished() {
  server.onopen = actualizarSocket();
}

function cerrarVentanaYSalir(redirect) {
  window.location.replace(redirect);
}

function dibujarVentana(idVentana, idBoton, redirect) {
  const popup = document.getElementById(idVentana);
  popup.classList.toggle('show');
  document.getElementById(idBoton).addEventListener('click', () => { cerrarVentanaYSalir(redirect); });
}

function mostrarVentanaDesconexion() {
  dibujarVentana('host-disconnected', 'button-host-disconnected', '../html/unirse.xhtml');
}

function messageArrived(event) {
  const message = JSON.parse(event.data);
  if (message.nombreMensaje === 'AgregadoASesion') {
    addNames(message.jugadores);
  }
  if (message.nombreMensaje === 'Ronda') {
    window.sessionStorage.setItem('ronda', JSON.stringify(message));
    window.location.replace('../html/partida.xhtml');
  }
  if (message.nombreMensaje === 'HostDesconectado') {
    // limpia todas las variables del sessionStorage
    window.sessionStorage.removeItem('codigo');
    window.sessionStorage.removeItem('codigoEmisor');
    window.sessionStorage.removeItem('host');
    window.sessionStorage.setItem('sesionAbierta', false);
    mostrarVentanaDesconexion();
  }
  if (message.nombreMensaje === 'SalioSesion') {
    addNames(message.jugadores);
  }
}

function connect() {
  server = new WebSocket(`ws://localhost:${PORT}`);
  server.addEventListener('open', connectionEstablished);
  server.addEventListener('message', messageArrived);
}

function setupWindow() {
  connect();
}

window.addEventListener('load', setupWindow);

/**
 * //from: clients
//to: server
//when: el cliente cambia de pagina y crea un nuevo socket o conexion
{
    "nombreMensaje": "ActualizarCodigo",
    "codigo": 12345,
    "codigoEmisor": 2135612,
    "estado":"listoPartida",
}
 */
