/* web sockets */
const PORT = '8080';
let server = '';

// const host = window.sessionStorage.getItem('host');
let players = JSON.parse(window.sessionStorage.getItem('names'));
const jugadores = JSON.parse(window.sessionStorage.getItem('jugadores'));
// const countPlayers = players.length;
let scores = JSON.parse(window.sessionStorage.getItem('scores'));
const mvp = [-1, -1, -1];
const mvpColors = ['first', 'second', 'third'];
const mvpIds = ['first', 'second', 'third'];

function hacerScores() {
  scores = [];
  for (let jugador = 0; jugador < jugadores.length; jugador += 1) {
    scores.push(jugadores[jugador].score);
  }
}

function hacerPlayers() {
  players = [];
  for (let jugador = 0; jugador < jugadores.length; jugador += 1) {
    players.push(jugadores[jugador].name);
  }
}

function actualizarSocket() {
  const response = {
    nombreMensaje: 'ActualizarSocket',
    codigo: window.sessionStorage.getItem('codigo'),
    codigoEmisor: window.sessionStorage.getItem('codigoEmisor'),
    estado: 'finPartida',
  };
  const message = JSON.stringify(response);
  server.send(message);
}

function connectionEstablished() {
  server.onopen = actualizarSocket();
}

function cerrarVentanaYSalir(idVentana) {
  document.getElementById(idVentana).classList.toggle('show');
}

function dibujarVentana(idVentana, idBoton) {
  const popup = document.getElementById(idVentana);
  popup.classList.toggle('show');
  document.getElementById(idBoton).addEventListener('click', () => { cerrarVentanaYSalir(idVentana); });
}

function mostrarVentanaDesconexion() {
  dibujarVentana('host-disconnected', 'button-host-disconnected', '../html/unirse.xhtml');
}

function messageArrived(event) {
  const message = JSON.parse(event.data);
  if (message.nombreMensaje === 'HostDesconectado') {
    // to do: cambiar el comportamiento de botones de volver a jugar

    // limpia todas las variables del sessionStorage
    window.sessionStorage.removeItem('codigo');
    window.sessionStorage.removeItem('codigoEmisor');
    window.sessionStorage.removeItem('host');
    window.sessionStorage.setItem('sesionAbierta', 'false');

    mostrarVentanaDesconexion();
  }
  if (message.nombreMensaje === 'ErrorCodigoInvalido') {
    window.location.replace('../index.xhtml');
  }
}

function connect() {
  server = new WebSocket(`ws://localhost:${PORT}`);
  server.addEventListener('open', connectionEstablished);
  server.addEventListener('message', messageArrived);
}

// const isHost = true;
function playAgainButtonAction(isHost) {
  const response = {
    nombreMensaje: 'Listo',
    codigo: window.sessionStorage.getItem('codigo'),
    codigoEmisor: window.sessionStorage.getItem('codigoEmisor'),
  };
  const message = JSON.stringify(response);
  server.send(message);
  if (isHost === 'true') {
    window.sessionStorage.setItem('sesionAbierta', 'true');
    window.location.replace('../html/crear.xhtml');
  } else if (window.sessionStorage.getItem('sesionAbierta') === 'true') {
    window.location.replace('../html/esperando.xhtml');
  } else {
    window.location.replace('../index.xhtml');
  }
}

/*
  Agrega los puntajes de los jugadores al HTML de fin de partida
*/
function appendScores() {
  this.jugadores = jugadores.sort(((a, b) => b.score - a.score));
  const table = document.getElementById('playersList');
  for (let it = 0; it < jugadores.length; it += 1) {
    const player = document.createElement('p');
    player.innerHTML = `${jugadores[it].name}: ${jugadores[it].score}`;
    for (let x = 0; x < 3; x += 1) {
      if (it === mvp[x]) {
        player.setAttribute('class', mvpColors[x]);
      }
    }
    table.appendChild(player);
  }
}

/*
Recorre el arreglo de jugadores para acomodar los mejores 3 jugadores
*/
function assignPosition(player) {
  let draw = false;
  for (let it = 0; it < 3; it += 1) {
    if (mvp[it] === -1) {
      mvp[it] = player;
      if (draw === true) {
        mvpColors[it] = mvpColors[it - 1];
        draw = false;
      }
      it = 5;
    }
    if (scores[mvp[it]] < scores[player]) {
      const x = player;
      player = mvp[it];
      mvp[it] = x;
      if (draw === true) {
        mvpColors[it] = mvpColors[it - 1];
        draw = false;
      }
    }
    if (mvp[it] !== player && scores[mvp[it]] === scores[player]) {
      draw = true;
    }
  }
  // console.log(mvp);
}

/*
Agrega el jugador más valioso a su posición en el HTML
*/
function appendMvp(list, it, id, color) {
  const player = document.createElement('p');
  if (it !== -1) {
    player.innerHTML = list[it];
  } else {
    players.innerHTML = '-----';
  }
  player.setAttribute('id', id);
  player.setAttribute('class', color);
  return player;
}

/*
Muestra en pantalla los jugadores más valiosos ordenados por puntajes
*/
function setMVP() {
  for (let it = 0; it < scores.length; it += 1) {
    assignPosition(it);
  }
  const mvpPlayers = document.getElementById('topPlayerList');
  mvpPlayers.appendChild(appendMvp(players, mvp[1], mvpIds[1], mvpColors[1]));
  mvpPlayers.appendChild(appendMvp(players, mvp[0], mvpIds[0], mvpColors[0]));
  mvpPlayers.appendChild(appendMvp(players, mvp[2], mvpIds[2], mvpColors[2]));

  const mvpScores = document.getElementById('topPlayerScoreList');
  const tittle = document.createElement('p');
  tittle.innerHTML = 'Puntos';
  mvpScores.appendChild(tittle);

  mvpScores.appendChild(appendMvp(scores, mvp[1], 'secondPlayerPoints'));
  mvpScores.appendChild(appendMvp(scores, mvp[0], 'firstPlayerPoints'));
  mvpScores.appendChild(appendMvp(scores, mvp[2], 'thirdPlayerPoints'));
}

function setup() {
  connect();
  this.jugadores = jugadores.sort(((a, b) => b.score - a.score));
  // document.getElementById('finalRound').play();
  let isHost = 'false';
  if (window.sessionStorage.getItem('codigoEmisor') === window.sessionStorage.getItem('host')) {
    isHost = 'true';
  } else {
    isHost = 'false';
  }
  document.getElementById('playAgain').addEventListener('click', () => {
    playAgainButtonAction(isHost);
  });
  hacerScores();
  hacerPlayers();
  setMVP();
  appendScores();
}

window.addEventListener('load', setup);
