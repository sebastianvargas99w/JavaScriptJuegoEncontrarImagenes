let secondaryServer = '';
const secondaryPORT = '8080';
// to do: actualizar tomando en cuenta vacíos de session storage

function disconnect() {
  let nombreMensaje = '';
  window.sessionStorage.setItem('sesionAbierta', 'false');
  if (window.sessionStorage.getItem('codigoEmisor') === window.sessionStorage.getItem('host')) {
    // si es host
    nombreMensaje = 'Salir';
  } else {
    // si no es host
    nombreMensaje = 'Desconectar';
  }
  const messageBody = {
    nombreMensaje,
    codigo: window.sessionStorage.getItem('codigo'),
    codigoEmisor: window.sessionStorage.getItem('codigoEmisor'),
    estado: 'saliendo',
  };
  const message = JSON.stringify(messageBody);
  secondaryServer.send(message);
  secondaryServer.close();
  window.sessionStorage.removeItem('codigo');
  window.sessionStorage.removeItem('codigoEmisor');
  window.sessionStorage.removeItem('host');
  secondaryServer.onclose = () => { window.location.replace('../index.xhtml'); };
}

function cerrarSesion() {
  const codigo = window.sessionStorage.getItem('codigo');
  const codigoEmisor = window.sessionStorage.getItem('codigoEmisor');
  console.assert(codigoEmisor !== null);
  console.assert(codigoEmisor !== 'undefined');
  const cuerpoMensaje = {
    nombreMensaje: 'ActualizarSocket',
    codigo,
    codigoEmisor,
    estado: 'cerrandoSesion',
  };
  const message = JSON.stringify(cuerpoMensaje);
  secondaryServer.send(message);
  disconnect();
}

function secondaryServerEstablished() {
  secondaryServer.onopen = cerrarSesion();
}

function connectSecondaryServer() {
  secondaryServer = new WebSocket(`ws://localhost:${secondaryPORT}`);
  secondaryServer.addEventListener('open', secondaryServerEstablished);
}

function exitAction() {
  const codigo = window.sessionStorage.getItem('codigo');
  if (codigo !== null) {
    connectSecondaryServer();
  } else {
    window.location.replace('../index.xhtml');
  }
}

function exitSetup() {
  document.getElementById('exit').addEventListener('click', exitAction);
  const mainPageButton = document.getElementById('mainPageButton');
  if (mainPageButton !== null) {
    mainPageButton.addEventListener('click', exitAction);
  }
}

window.addEventListener('load', exitSetup);
