const PORT = '8080';
let server = '';
const myId = parseInt(window.sessionStorage.getItem('id'), 10);
let resetRevealCounter = 'true';
/* prueba de version */
/*
 Objeto que tiene la configuración de la partida y otros datos adicionales para poder jugar.
 */
const game = {
  files: [],
  players: [],
  score: [],
  Rug: [],
  cards: [],
  numberOfCards: 3,
  chancesToReveal: 5,
  revealTimer: 1,
  numberOfImages: 80,
  estado: 'esperandoPartida',
  cardIdCounter: 1,
  currentCard: 3,
  round: 1,
  mode: 0,
  cardsCompartidas: [],
  users: [],
  jugadores: [],
  gris: 0,
};
let showChances = [];

/*
// require nombre and isOwner defined
function Player(name, isOwner, ...cards) {
  this.name = name;
  this.score = 0;
  this.isOwner = isOwner;
  this.cards = [];
  if (typeof (cards) !== 'undefined') {
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex += 1) {
      this.cards[cardIndex].push(cards[cardIndex]);
    }
  }
  return this;
}
*/

/*
Esta funcion retorna un numero aleatorio entre el min y max que se pasan como
parametro
*/
// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
Devuelve un numero al azar para enontrar la carta
*/
function cardToFind() {
  const numAleat = randomInteger(0, (game.Rug.length) - 1);
  return game.Rug[numAleat];
}

/*
Muestra la carta
 */
/*
const displayCard = function showCard() {
  const it = showChances.find((element) => element[0] === this.getAttribute('alt'));
  if (it[1] > 0) {
    it[1] -= 1;
    this.classList.add('showingCard');
    this.classList.remove('card');
    setTimeout(() => { hide(this.id); }, game.revealTimer * 1000);
  }
};
*/
let setCardlistener = function tmpFunction() {
  alert('Notifique al administrador');
};

function revealCard() {
  const it = showChances.find((element) => element[0] === this.firstChild.getAttribute('alt'));
  it[1] = parseInt(it[1], 10);
  console.assert(typeof (it[1]) === 'number');
  if (it[1] === -1) {
    if (game.revealTimer !== 0) {
      this.firstChild.removeEventListener('click', setCardlistener);
      document.getElementById(`${this.firstChild.id}marco`).removeEventListener('click', revealCard);
      setTimeout(() => { setCardlistener(this.firstChild.id); }, game.revealTimer * 1000);
    }
  } else if (it[1] > 0) {
    it[1] -= 1;
    this.firstChild.classList.toggle('hideElement');
    if (game.revealTimer !== 0) {
      this.firstChild.removeEventListener('click', setCardlistener);
      document.getElementById(`${this.firstChild.id}marco`).removeEventListener('click', revealCard);
      setTimeout(() => { setCardlistener(this.firstChild.id); }, game.revealTimer * 1000);
    }
  }
}

function hide(id) {
  document.getElementById(id).classList.toggle('hideElement');
  // document.getElementById(id).addEventListener('click', revealCard);
  document.getElementById(`${id}marco`).addEventListener('click', revealCard);
}

setCardlistener = hide;
/*
Le agrega listener a todas las cartas
Para al primera entrega solo a una
 */
/*
function setCardlistener(id) {
  document.getElementById(id).addEventListener('click', revealCard);
}
*/
/*
Esta funcion coloca la imagen que el jugador va buscar en el xhtml
*/
function addCardToFind(indice) {
  let item = '';
  if (game.mode === 1) {
    item = cardToFind();
  } else {
    item = game.cardsCompartidas[indice];
  }
  const card = document.createElement('div');
  const objImagen = new Image();
  objImagen.src = `../images/${item}`;
  objImagen.width = 50;
  objImagen.height = 50;
  objImagen.alt = `carta${game.cardIdCounter}`;
  objImagen.id = `carta${game.cardIdCounter}`;
  card.setAttribute('id', `carta${game.cardIdCounter}marco`);
  objImagen.classList.toggle('hideElement');
  // objImagen.classList.add('card');
  card.appendChild(objImagen);
  const zona = document.getElementById('cartasBuscadas');
  zona.appendChild(card);

  card.addEventListener('click', revealCard);
  // ESTO LE AGREGA UN LISTENER A TODAS LAS CARTAS, SE QUITA EN FUTURAS ENTREGAS
  // setCardlistener(`carta${game.cardIdCounter}`);
  game.cards.push(`carta${game.cardIdCounter}`);
  game.cardIdCounter += 1;
}

/*
Elimina la carta recibida del arreglo de cartas jugables
*/
function deleteCard(item) {
  const i = game.Rug.indexOf(item);
  if (i > -1) {
    game.Rug.splice(i, 1);
  }
}

/*
Agrega un punto al jugador actual
*/
/*
function addPoint(who = 'yo') {
  const puntaje = document.getElementById(who);
  let puntos = puntaje.innerHTML.substr(-3);
  puntaje.innerHTML = puntaje.innerHTML.slice(0, -3);
  puntos = Number(puntos) + 1;
  puntaje.append(String(puntos).padEnd(3, ' '));
  document.getElementById('carta1').remove();
}
*/

/*
 elimina la clase de mal del objeto
*/
function changeClass(objeto) {
  objeto.classList.remove('mal');
}

/*
Envia un mensaje al servidor
 */
function sendMessage(text) {
  server.send(text);
  // console.log('mensaje enviado');
}

function buildCartaEncontrada() {
  const objectCartaEncontrada = {
    nombreMensaje: 'encontrarCarta',
    codigo: window.sessionStorage.getItem('codigo'),
    codigoEmisor: window.sessionStorage.getItem('codigoEmisor'),
  };
  return JSON.stringify(objectCartaEncontrada);
}

/* function buildFinishRound(nombre, id) {
  const objectFinRonda = {
    nombreMensaje: 'encontrarCarta',
  };
  return JSON.stringify(objectFinRonda);
}
*/

/*
Esta función elimina las cartas a buscar de los jugadores, esto sucede cuando
termina una ronda e inicia otra
*/
function clearCardsToFind() {
  const cardIndex = 0;
  const cartasBuscadas = document.getElementById('cartasBuscadas');
  while (cartasBuscadas.firstChild) {
    cartasBuscadas.removeChild(cartasBuscadas.firstChild);
  }
  while (cardIndex < game.cards.length) {
    game.cards.splice(cardIndex, 1);
  }
}

/*
Esta función revisa si la figura elegida por el usuario es la que debe buscar
y si lo es solicita el aumento de puntos respectivo y la eliminación de la figura
*/

function found() {
  let incorrecta = 'true';
  let cardIndex = 0;
  while (cardIndex < game.cards.length && incorrecta === 'true') {
    const card = document.getElementById(game.cards[cardIndex]);
    if (card.src === this.src) {
      incorrecta = 'false';
      document.getElementById(game.cards[cardIndex]).remove(); // Elimina la carta a buscar html
      document.getElementById(`${game.cards[cardIndex]}marco`).remove(); // Elimina la carta a buscar html
      sendMessage(buildCartaEncontrada());
      deleteCard(this.alt); /// Elimina la carta del arreglo game.RUG
      game.cards.splice(cardIndex, 1);
      document.getElementById('goal').play();
    }
    cardIndex += 1;
  }
  if (incorrecta !== 'false') {
    document.getElementById('wrong').play();
    this.classList.add('mal');
    setTimeout(() => { changeClass(this); }, 700);
  }
}

/*
Esta funcion genera la manta, llena el array Rug que contiene los nombre
de los elementos en la manta además coloca las imágenes de la manta en el xhtml.
*/
function generateRug() {
  let numItems = (game.numberOfImages) - 1;
  while (numItems >= 0) {
    const item = game.Rug[numItems];
    numItems -= 1;
    const objImagen = new Image();
    objImagen.src = `../images/${item}`;
    objImagen.width = 70;
    objImagen.height = 70;
    objImagen.onclick = found;
    if (game.gris === 1) {
      objImagen.classList.add('gris');
    }
    // objImagen.classList.add('gris');
    objImagen.alt = item;
    const zona = document.getElementById('zonaDeJuego');
    zona.appendChild(objImagen);
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

/**
Envia el mensaje que se tiene que enviar despues de establecer la conexion.
 */
/*
function connectionEstablished() {
  const messageJoin = {
    nombreMensaje: 'Unirse',
    codigo: 124146,
    nombreInvitado: 'Juan',
  };
  sendMessage(JSON.stringify(messageJoin));
}
*/
/*
Crea un arreglo de cartas en el que almacena tambien la cantidad de pistas que le queda a cada carta
*/
function setMapChances() {
  if (resetRevealCounter === 'true') {
    showChances = game.cards.map((obj) => {
      const item = ['card', game.chancesToReveal];
      item[0] = obj;
      return item;
    });
  }
}

/*
Esta función fija los parametros del juego con los recibidos del servidor
*/
function setGame(message, updateChances) {
  game.Rug = message.Rug;
  game.files = message.files;
  game.numberOfImages = message.numberOfImages;
  game.numberOfCards = message.numberOfCards;
  game.players = message.players;
  game.score = message.score;
  game.round = message.round;
  game.mode = message.mode;
  game.cardsCompartidas = message.cards;
  if (updateChances === 'true') {
    game.chancesToReveal = message.chancesToReveal;
  }
  game.revealTimer = message.revealTimer;
  game.users = message.users;
  game.jugadores = message.jugadores;
  window.sessionStorage.setItem('ronda', JSON.stringify(message));
}

/*
Esta función actualiza el valor de los puntajes, cuando alguno de los jugadores
logra un punto
*/
function updateScore() {
  const myScoreHTML = document.getElementById('me');
  const scoresHTML = document.getElementById('others');
  scoresHTML.innerHTML = '';
  myScoreHTML.innerHTML = '';
  game.jugadores = game.jugadores.sort(((a, b) => b.score - a.score));
  for (let messageIndex = 0; messageIndex < game.jugadores.length; messageIndex += 1) {
    const content = document.createElement('p');
    const salto = document.createElement('br');
    content.setAttribute('id', messageIndex);
    content.setAttribute('class', 'primero');
    const p = document.createTextNode(`${game.jugadores[messageIndex].name}`);
    const p2 = document.createTextNode(`${game.jugadores[messageIndex].score}`);
    content.appendChild(p);
    content.appendChild(salto);
    content.appendChild(p2);
    // content.createTextNode(`${game.players[messageIndex]}<br />${game.score[messageIndex]}`);
    if (game.jugadores[messageIndex].id !== myId) {
      scoresHTML.appendChild(content);
    } else {
      myScoreHTML.appendChild(content);
    }
  }
}

/*
Esta función actualiza el número de la ronda, según en la ronda que se este
*/
function updateRound() {
  const ronda = document.getElementById('ronda');
  ronda.innerHTML = '';
  const rondaValue = document.createTextNode(`Ronda ${game.round}`);
  ronda.appendChild(rondaValue);
  game.estado = 'esperandoJugadores';
}

function actualizarPantalla() {
  setMapChances(game.cards);
  updateRound();
  updateScore();
}

function cerrarVentanaYSalir(redirect) {
  window.location.replace(redirect);
}

function dibujarVentanaDesconexion(idVentana, idBoton, redirect) {
  const popup = document.getElementById(idVentana);
  popup.classList.toggle('show');
  document.getElementById('zonaDeJuego').classList.toggle('hideElement');
  document.getElementById(idBoton).addEventListener('click', () => { cerrarVentanaYSalir(redirect); });
}

function mostrarVentanaDesconexion() {
  dibujarVentanaDesconexion('host-disconnected', 'button-host-disconnected', '../index.xhtml');
}

function updateTimer(currentTime) {
  document.getElementById('starting-timer').innerHTML = currentTime;
}

function resolveAfterSeconds(timer) {
  let timerCopy = timer;
  return new Promise(() => {
    if (timerCopy === 0) {
      timerCopy -= 1;
      document.getElementById('zonaDeJuego').classList.toggle('hideElement');
      document.getElementById('end-round-notification').classList.toggle('show');
    } else {
      timerCopy -= 1;
      updateTimer(timerCopy.toString());
      setTimeout(() => {
        resolveAfterSeconds(timer - 1);
      }, 1000);
    }
  });
}

async function startEndOfRoundTimer() {
  const timer = 5;
  await resolveAfterSeconds(timer);
}

async function mostrarVentanaFinRonda() {
  const popup = document.getElementById('end-round-notification');
  popup.classList.toggle('show');
  document.getElementById('zonaDeJuego').classList.toggle('hideElement');
  startEndOfRoundTimer();
}

/*
Funcion que se ejecuta cuando llega un mensaje del servidor.
 */
function messageArrived(event) {
  const message = JSON.parse(event.data);
  // console.log(message.nombreMensaje);
  if (message.nombreMensaje === 'Ronda') {
    resetRevealCounter = 'false';
    setGame(message, resetRevealCounter);
    actualizarPantalla();
  }
  if (message.nombreMensaje === 'RondaTerminada') {
    resetRevealCounter = 'true';
    document.getElementById('finalRound').play();
    mostrarVentanaFinRonda();
    setGame(message, 'true');
    clearCardsToFind();
    for (let cardIndex = 0; cardIndex < game.numberOfCards; cardIndex += 1) {
      addCardToFind(cardIndex);
    }
    setMapChances(game.cards);
    updateRound();
    actualizarPantalla();
    resetRevealCounter = 'false';
  }
  if (message.nombreMensaje === 'Terminar') {
    // to do: limpiar session storage de datos inutiles?
    document.getElementById('finalRound').play();
    window.sessionStorage.setItem('host', message.host);
    window.sessionStorage.setItem('names', JSON.stringify(message.name));
    window.sessionStorage.setItem('scores', JSON.stringify(message.score));
    window.sessionStorage.setItem('jugadores', JSON.stringify(message.jugadores));
    setTimeout(() => { window.location.replace('../html/fin-de-partida.xhtml'); }, 1200);
  }
  if (message.nombreMensaje === 'HostDesconectado') {
    window.sessionStorage.removeItem('codigo');
    window.sessionStorage.removeItem('codigoEmisor');
    window.sessionStorage.removeItem('host');
    window.sessionStorage.setItem('sesionAbierta', 'false');
    mostrarVentanaDesconexion();
  }
  if (message.nombreMensaje === 'ErrorCodigoInvalido') {
    window.location.replace('../index.xhtml');
  }
  updateScore();
}

/*
Se conecta con el servidor y agrega los escuha necesario.
 */
function connect() {
  server = new WebSocket(`ws://localhost:${PORT}`);
  // server.addEventListener('open', connectionEstablished);
  server.addEventListener('message', messageArrived);
}

// Esta funcion es la que se encarga de preparar lo necesario para empezar el juego
function gameSetup() {
  resetRevealCounter = 'true';
  connect(); // EN EL FUTURO EL CONNECT SE CAMBIARA EL CONNECT A OTRO SCRIPT
  server.onopen = actualizarSocket;
  const obj = JSON.parse(window.sessionStorage.getItem('ronda'));
  game.gris = obj.gris;
  // console.log(obj);
  setGame(obj, resetRevealCounter);
  generateRug();
  // console.log(game);
  game.currentCard = game.numberOfCards;
  for (let cardIndex = 0; cardIndex < game.numberOfCards; cardIndex += 1) {
    addCardToFind(cardIndex);
  }
  actualizarPantalla();
  resetRevealCounter = 'false';
}

window.addEventListener('load', gameSetup);
