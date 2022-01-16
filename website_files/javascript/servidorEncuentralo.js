const PORT = 8080;
const WebSocket = require('ws');
// const fs = require('fs');
const Jugador = require('./players.js');
// var newInstance = new Logs();

const usersGlobal = []; // {id, sesion}

let contadorNombres = 0; // VARIABLES PARA GENERAR NOMBRE DE USUARIOS

const server = new WebSocket.Server({ port: PORT });
console.log(`Chat websocket server listening on ${PORT}...`);
let sesiones = [];
class Session {
  constructor(conexionHost, code) {
    this.conexiones = [];
    this.conexiones.push(conexionHost);
    this.game = {
      files: [],
      players: [],
      score: [],
      Rug: [],
      cards: [],
      cardsLeft: [],
      numberOfCards: 3,
      chancesToReveal: 2,
      revealTimer: 1,
      numberOfImages: 80,
      currentCard: 3,
      round: 1,
      id: code,
      mode: 0,
      totalRondas: 2,
      rondasJugar: 2,
      gris: 0,
    };
    this.users = [];
    this.wanted = [];
    this.jugadores = [];
    this.id = code;
  }
}

function assingIds(session) {
  usersGlobal.push([contadorNombres, session]);
  contadorNombres += 1;
}

/*
Genera un numero aleatorio dentro de un rango.
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
Busca dentro de la lista de jugadores el que tenga
el codigo que recibe como parametro, si lo encuentra
retorna la posicion del jugador dentro del arreglo de
jugadores sino retorna -1
*/
function buscaJugador(code, itera) {
  let posicion = -1;
  for (let jugador = 0; jugador < sesiones[itera].jugadores.length; jugador += 1) {
    if (Number(sesiones[itera].jugadores[jugador].id) === Number(code)) {
      posicion = jugador;
    }
  }
  return posicion;
}
/*
Setea las cartas a buscar en todos los jugadores
*/
function setNumberOfCards(itera, numberOfCards) {
  for (let jugador = 0; jugador < sesiones[itera].jugadores.length; jugador += 1) {
    sesiones[itera].jugadores[jugador].cardsLeft = numberOfCards;
  }
}

/*
Selecciona las imagenes para la zona de juego
usando la lista con los nombres archivos con las imagenes.
*/
function generateRug(game) {
  const gameCopy = game;
  let numItems = (gameCopy.numberOfImages) - 1;
  while (numItems >= 0) {
    const numAleat = randomInteger(0, (gameCopy.files.length) - 1);
    const item = gameCopy.files[numAleat];
    if (gameCopy.Rug.indexOf(item) < 0) {
      gameCopy.Rug[numItems] = item;
      numItems -= 1;
    }
  }
  return gameCopy;
}

/*
Esta funcion retorna el array con los nombres de las imagenes de todos los objetos
disponibles para ser colocados en la manta
*/
function generateFilesList() {
  const imageArray = ['001-jet.svg', '002-army.svg', '003-award.svg', '004-axe.svg', '005-backpack.svg', '006-no-bomb.svg', '007-bomb.svg', '008-no-weapons.svg', '009-baton.svg', '010-bazooka.svg', '011-binoculars.svg', '012-bomb.svg', '013-bomb.svg', '014-bow.svg', '015-bullet.svg', '016-bulletproof vest.svg', '017-cannon.svg', '018-death.svg', '019-antenna.svg', '020-dynamite.svg', '021-fighting.svg', '022-flag.svg', '022-observatory.svg', '023-earth.svg', '023-flight.svg', '024-gun.svg', '024-telescope.svg', '025-antenna.svg', '025-hand-grenade.svg', '026-helmet.svg', '026-satellite-dish.svg', '027-pirate.svg', '027-space-station.svg', '028-half-moon.svg', '028-knife.svg', '029-knot.svg', '029-space-station.svg', '030-astronomy.svg', '030-mace.svg', '031-machine-gun.svg', '031-moon-phases.svg', '032-galaxy.svg', '032-vehicle.svg', '033-galaxy.svg', '033-monitor.svg', '034-army.svg', '034-planet.svg', '035-parachute.svg', '035-radio.svg', '036-moon-rover.svg', '036-quill.svg', '037-radar.svg', '037-robot.svg', '038-planets.svg', '038-rocket.svg', '039-scroll.svg', '039-space-ship.svg', '040-ship.svg', '040-spaceship.svg', '041-spear.svg', '041-stars.svg', '042-searching.svg', '042-submarine.svg', '043-meteor-shower.svg', '043-sword.svg', '044-alien.svg', '044-tank.svg', '045-black-hole.svg', '045-target.svg', '046-space-station.svg', '046-telescope.svg', '047-sun.svg', '047-tent.svg', '048-full-moon.svg', '048-military vehicle.svg', '049-planet.svg', '049-walkie talkie.svg', '050-atmosphere.svg', '050-watchtower.svg', 'abejas.svg', 'aeropuerto.svg', 'arana.svg', 'Asteroid.svg', 'astronaut.svg', 'ataud_cafe.svg', 'badoo.svg', 'ballena.svg', 'ballena_celeste.svg', 'behance.svg', 'black-hole.svg', 'bomba-petroleo.svg', 'bosque.svg', 'buho_cafe.svg', 'candado_negro.svg', 'caracol.svg', 'casa.svg', 'casa_celeste.svg', 'cerdo.svg', 'cocodrilo.svg', 'colon.svg', 'comet.svg', 'constellation.svg', 'costa-rica.svg', 'cuadrado_verde.svg', 'cuchara_negra.svg', 'delfin.svg', 'destroyed-planet.svg', 'deviantart.svg', 'dribbble.svg', 'dromedario_azul.svg', 'dropbox.svg', 'earth.svg', 'edificio_negro.svg', 'elefante.svg', 'elefante_gris.svg', 'empires-state.svg', 'erizo_cafe.svg', 'facebook.svg', 'flickr.svg', 'foursquare.svg', 'galaxy (2).svg', 'galaxy.svg', 'gato_amarillo.svg', 'gato_verde.svg', 'google-plus.svg', 'granero_azul.svg', 'guitarra_cafe.svg', 'hormiga.svg', 'hospital.svg', 'instagram.svg', 'lastfm.svg', 'lince.svg', 'line.svg', 'linkedin.svg', 'llave_gris.svg', 'loro_rojo.svg', 'manzana_roja.svg', 'mapache_gris.svg', 'meteor.svg', 'molino.svg', 'mono.svg', 'moon-landing.svg', 'murcielago.svg', 'myspace.svg', 'oro_amarillo.svg', 'paloma.svg', 'path.svg', 'pc_gris.svg', 'peces.svg', 'pera_verde.svg', 'perro.svg', 'perro_naranja.svg', 'perro_verde.svg', 'pez-payaso_naranja.svg', 'pez_amarillo.svg', 'pez_rojo.svg', 'piedra_blanca.svg', 'pina_amarilla.svg', 'pinterest.svg', 'pisa-torre.svg', 'planet-(2).svg', 'planet-(3).svg', 'planet.svg', 'planets.svg', 'planta-energia.svg', 'queso_amarillo.svg', 'quora.svg', 'radar.svg', 'reno.svg', 'skype.svg', 'snapchat.svg', 'solar-system (2).svg', 'solar-system (3).svg', 'solar-system.svg', 'sombrero_verde.svg', 'soundcloud.svg', 'spaceship.svg', 'spotify.svg', 'swarm.svg', 'taj-mahal.svg', 'taza_cafe.svg', 'telegram.svg', 'tienda.svg', 'torre.svg', 'tortuga.svg', 'trofeo_amarillo.svg', 'tumblr.svg', 'twitter.svg', 'ufo.svg', 'universidad.svg', 'uvas_moradas.svg', 'viber.svg', 'vimeo.svg', 'vine.svg', 'vk.svg', 'whatsapp.svg', 'yelp.svg', 'youtube.svg', '001-2021.svg',
    '001-croissant.svg',
    '001-mail inbox app.svg',
    '001-red bean soup.svg',
    '002-congee.svg',
    '002-extractor hood.svg',
    '002-garlands.svg',
    '002-speech bubble.svg',
    '003-container.svg',
    '003-dress.svg',
    '003-fried rice.svg',
    '003-telephone.svg',
    '004-camera.svg',
    '004-christmas tree.svg',
    '004-noodles.svg',
    '004-sink.svg',
    '005-image.svg',
    '005-sausage.svg',
    '005-sour soup.svg',
    '005-subwoofer.svg',
    '006-barbeque.svg',
    '006-gift box.svg',
    '006-soy eggs.svg',
    '006-weather app.svg',
    '007-bottle opener.svg',
    '007-clock.svg',
    '007-tangyuan.svg',
    '007-vinyl record.svg',
    '008-bread.svg',
    '008-cocktail.svg',
    '008-mapo tofu.svg',
    '008-maps.svg',
    '009-burger.svg',
    '009-calendar.svg',
    '009-sesame ball.svg',
    '009-tv app.svg',
    '010-christmas bell.svg',
    '010-donut.svg',
    '010-notes.svg',
    '010-popiah.svg',
    '011-champagne glass.svg',
    '011-dim sum.svg',
    '011-house.svg',
    '011-pizza.svg',
    '012-cheese.svg',
    '012-daily health app.svg',
    '012-dandan noodles.svg',
    '012-shopping bag.svg',
    '013-chef.svg',
    '013-christmas lights.svg',
    '013-news.svg',
    '013-peking duck.svg',
    '014-chicken.svg',
    '014-music.svg',
    '014-wine glass.svg',
    '014-zongzi.svg',
    '015-calendar.svg',
    '015-egg tart.svg',
    '015-folder.svg',
    '015-martini.svg',
    '016-bar counter.svg',
    '016-stock exchange app.svg',
    '016-tau sar pau.svg',
    '016-winter hat.svg',
    '017-coffee maker.svg',
    '017-dumpling.svg',
    '017-martini.svg',
    '017-web browser.svg',
    '018-calendar.svg',
    '018-christmas card.svg',
    '018-dumplings.svg',
    '018-restaurant.svg',
    '019-alarm clock.svg',
    '019-fried tofu curd balls.svg',
    '019-reminders.svg',
    '019-signboard.svg',
    '020-alarm clock.svg',
    '020-ice cream cone.svg',
    '020-tau sar pau.svg',
    '020-video calling app.svg',
    '021-cooking.svg',
    '021-dinner table.svg',
    '021-podcast.svg',
    '021-spring rolls.svg',
    '022-ice bucket.svg',
    '022-mantou.svg',
    '022-saucepan.svg',
    '022-wallet passes app.svg',
    '023-app store.svg',
    '023-christmas ball.svg',
    '023-fried egg.svg',
    '023-moon cake.svg',
    '024-balloons.svg',
    '024-books.svg',
    '024-food truck.svg',
    '024-soy sauce.svg',
    '025-french fries.svg',
    '025-grass jelly.svg',
    '025-message.svg',
    '025-settings.svg',
    '026-gas.svg',
    '026-noodles.svg',
    '026-party hat.svg',
    '026-tips.svg',
    '027-Oven glove.svg',
    '027-party trumpets.svg',
    '027-remote control.svg',
    '027-teapot.svg',
    '028-cheese grater.svg',
    '028-christmas card.svg',
    '028-fish.svg',
    '028-voice message app.svg',
    '029-find my gadget app.svg',
    '029-green tea.svg',
    '029-microphone.svg',
    '029-peach.svg',
    '030-horn.svg',
    '030-mushrooms.svg',
    '030-satay.svg',
    '030-shortcut script app.svg',
    '031-butcher knife.svg',
    '031-crystal ball.svg',
    '031-dim sum.svg',
    '031-translate.svg',
    '032-2021.svg',
    '032-cabbage.svg',
    '032-lamp.svg',
    '032-smartwatch app.svg',
    '033-calculator.svg',
    '033-cong you bing.svg',
    '033-matchbox.svg',
    '033-vip.svg',
    '034-champagne.svg',
    '034-mantou.svg',
    '034-menu.svg',
    '034-music store app.svg',
    '035-christmas ball.svg',
    '035-contacts.svg',
    '035-milk.svg',
    '035-xiao long bao.svg',
    '036-beer.svg',
    '036-browser.svg',
    '036-fish.svg',
    '036-Paper cup.svg',
    '037-bank.svg',
    '037-dumpling.svg',
    '037-moustache.svg',
    '037-pie.svg',
    '038-cake.svg',
    '038-candle.svg',
    '038-like.svg',
    '038-popiah.svg',
    '039-egg tart.svg',
    '039-pizza.svg',
    '039-santa claus.svg',
    '039-twitter.svg',
    '040-new year.svg',
    '040-popcorn.svg',
    '040-spring rolls.svg',
    '040-youtube.svg',
    '041-moon cake.svg',
    '041-popsicle.svg',
    '041-spray bottle.svg',
    '041-whatsapp.svg',
    '042-leek.svg',
    '042-mittens.svg',
    '042-tea pot.svg',
    '042-transport.svg',
    '043-century egg.svg',
    '043-sauce.svg',
    '043-snowflake.svg',
    '043-streaming tv app.svg',
    '044-peking duck.svg',
    '044-sausage.svg',
    '044-search.svg',
    '044-sparkler.svg',
    '045-cocktail shaker.svg',
    '045-instagram.svg',
    '045-silverware.svg',
    '045-sweet and sour pork.svg',
    '046-dumpling.svg',
    '046-muffin.svg',
    '046-shopping.svg',
    '046-soup.svg',
    '047-cake.svg',
    '047-pin.svg',
    '047-shaobing.svg',
    '047-tenderizer.svg',
    '048-barbecue.svg',
    '048-strainer.svg',
    '048-tiktok.svg',
    '048-youtiao.svg',
    '049-chicken.svg',
    '049-hourglass.svg',
    '049-messenger.svg',
    '049-tea.svg',
    '050-dumpling.svg',
    '050-edition.svg',
    '050-glasses.svg',
    '050-whisk.svg',
    '051-drive.svg',
    '052-snapchat.svg',
    '053-reddit.svg',
    '054-twitch.svg',
    '055-spotify.svg',
    '056-video editing app.svg',
    '057-music maker app.svg',
    '058-tinder.svg',
    '059-slack.svg',
    '060-telegram.svg',
    '061-discord.svg',
    '062-tumblr.svg',
    '063-slide show app.svg',
    '064-movies app.svg',
    '065-pages.svg',
    '066-spreadsheet app.svg',
    '067-mortarboard.svg',
    '068-waze.svg',
    '069-linkedin.svg',
    '070-file hosting.svg'];
  return imageArray;
}
const file = generateFilesList();
// generateRug();

/*
Esta función recibe el número de carta a buscar y el arreglo de cartas buscadas
para revisar i la carta ya está siendo buscada por algún jugador o no
*/
function isWanted(card, wanted) {
  let isWantedBool = false;
  if (wanted.find((element) => element === card) === undefined) {
    isWantedBool = false;
  } else {
    isWantedBool = true;
  }
  return isWantedBool;
}

/*
Elige una carta aleatoriamente del arreglo de dibujos (Rug) y lo inserta al jugador recibido
*/
function pushCard(player, rug, wanted) {
  let card = randomInteger(0, rug.length);
  while (isWanted(card, wanted) === true) {
    card = randomInteger(0, rug.length);
  }
  player.cards.push(rug[card]);
  wanted.push(card);
}

/*
Setea los marcadores en 0
*/
function setReady(itera) {
  for (let jugador = 0; jugador < sesiones[itera].jugadores.length; jugador += 1) {
    sesiones[itera].jugadores[jugador].ready = 0;
  }
}

/*
Setea los marcadores en 0
*/
function setScore(itera) {
  for (let jugador = 0; jugador < sesiones[itera].jugadores.length; jugador += 1) {
    sesiones[itera].jugadores[jugador].score = 0;
  }
}
/*
En caso de querer usar las mismas cartas en todos los jugadores, inserta las cartas elegidas
previamente y almacenadas en wanted y las inserta en el jugador recibido
*/
/*
function selectSharedCards(player, rug, wanted) {
  for (let i = 0; i < wanted.size; i += 1) {
    player.cardsLeft.push(wanted[i]);
  }
}
*/
function searchItera(code) {
  let codEnc = 'undefined';
  for (let itera = 0; itera < sesiones.length; itera += 1) {
    if (Number(sesiones[itera].id) === Number(code)) {
      codEnc = itera;
    }
  }
  return codEnc;
}

/*
Elige 3 cartas, o las que permita el Rug, aleatoriamente y las inserta en el player recibido.
*/
function selectCards(player, rug, wanted) {
  pushCard(player, rug, wanted);
  pushCard(player, rug, wanted);
  pushCard(player, rug, wanted);
}

function connection(ws) {
/*
  game.players.push(`Jugador${contadorNombres}`);
  game.cardsLeft.push(game.numberOfCards);
  */
  // console.log(server.clients);
  console.log('A client just connected');
  ws.on('message', (message) => {
    let mensaje = '';
    const messageReceived = JSON.parse(message);
    console.log('received: %s', messageReceived.nombreMensaje);
    console.log('received: %s', messageReceived);
    const existeCodigo = searchItera(messageReceived.codigo);
    if (existeCodigo === 'undefined' && typeof (messageReceived.codigo) !== 'undefined') {
      const respuesta = {
        nombreMensaje: 'ErrorCodigoInvalido',
      };
      mensaje = JSON.stringify(respuesta);
      server.clients.forEach((client) => {
        if (client === ws) {
          client.send(mensaje);
          console.log(mensaje);
        }
      });
    } else {
      if (messageReceived.nombreMensaje === 'encontrarCarta') {
        const itera = searchItera(messageReceived.codigo);
        const ronda = sesiones[itera].game;
        ronda.users = sesiones[itera].users;
        ronda.jugadores = sesiones[itera].jugadores;
        // METODO NUEVO
        const posicion = buscaJugador(messageReceived.codigoEmisor, itera);
        sesiones[itera].jugadores[posicion].score += 1;
        sesiones[itera].jugadores[posicion].cardsLeft -= 1;
        if (sesiones[itera].jugadores[posicion].cardsLeft === 0) {
          sesiones[itera].game.round += 1;
          ronda.nombreMensaje = 'RondaTerminada';
          ronda.cards = [];
          if (sesiones[itera].game.mode === 2) {
            selectCards(sesiones[itera].game, sesiones[itera].game.Rug, sesiones[itera].wanted);
          }
          setNumberOfCards(itera, sesiones[itera].game.numberOfCards);
          sesiones[itera].game.totalRondas -= 1;
        } else {
          ronda.nombreMensaje = 'Ronda';
        }
        if (sesiones[itera].game.totalRondas === 0) {
          setReady(itera);
          const respuesta = {
            nombreMensaje: 'Terminar',
            name: sesiones[itera].game.players,
            score: sesiones[itera].game.score,
            host: sesiones[itera].jugadores[0].id,
            jugadores: sesiones[itera].game.jugadores,
          };
          sesiones[itera].game.round = 1;
          sesiones[itera].game.totalRondas = sesiones[itera].game.rondasJugar;
          sesiones[itera].game.Rug = [];
          mensaje = JSON.stringify(respuesta);
        } else {
          mensaje = JSON.stringify(ronda);
        }
        for (let it = 0; it < sesiones[itera].conexiones.length; it += 1) {
          const client = sesiones[itera].conexiones[it];
          if (client.readyState === WebSocket.OPEN) {
            client.send(mensaje);// AQUI SE MANDA EL MENSAJE DE TERMINAR
          }
        }
      }
      // FIN DE (messageReceived.nombreMensaje === 'encontrarCarta')
      if (messageReceived.nombreMensaje === 'ActualizarSocket') {
        if (messageReceived.estado === 'esperandoJugadores') {
          let guestList = [];
          let posicion = 0;
          const itera = searchItera(messageReceived.codigo);
          guestList = sesiones[itera].game.players;
          posicion = itera;
          const respuesta = {
            nombreMensaje: 'AgregadoASesion',
            guest: guestList,
            codigoEmisor: usersGlobal.length - 1,
            jugadores: sesiones[itera].jugadores,
          };
          mensaje = JSON.stringify(respuesta);
          server.clients.forEach((client) => {
            if (client === ws) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(mensaje);
                sesiones[posicion].conexiones.push(client);
              }
            }
          });
        } // if estado == esperandoJugadores
        if (messageReceived.estado === 'iniciandoPartida') {
          const itera = searchItera(messageReceived.code);
          sesiones[itera].conexiones.push();
        } // estado iniciandoPartida
        if (messageReceived.estado === 'finPartida') {
          const itera = searchItera(messageReceived.codigo);
          // limpia puntajes
          setScore(itera);
          server.clients.forEach((client) => {
            if (client === ws) {
              if (client.readyState === WebSocket.OPEN) {
                sesiones[itera].conexiones.push(client);
              }
            }
          }); // cerrandoSesion
        }
        if (messageReceived.estado === 'cerrandoSesion') {
          const itera = searchItera(messageReceived.codigo);
          if (itera !== 'undefined') {
            server.clients.forEach((client) => {
              if (client === ws) {
                if (client.readyState === WebSocket.OPEN) {
                  sesiones[itera].conexiones.push(client);
                }
              }
            }); // cerrandoSesion
          }
        }
      } // Actualizar socket
      if (messageReceived.nombreMensaje === 'Crear') {
        let conexion = '';
        server.clients.forEach((client) => {
          if (client === ws) {
            conexion = client;
          }
        });
        const session = new Session(conexion, randomInteger(1, 1000000));
        assingIds(session.id);
        session.game.files = file;
        session.game.cardsLeft.push(session.game.numberOfCards);
        sesiones.push(session);
        const respuesta = {
          nombreMensaje: 'SesionCreada',
          codigo: session.game.id,
          codigoEmisor: usersGlobal.length - 1,
          players: session.jugadores,
        };
        // de la nueva forma
        const player = new Jugador((usersGlobal.length - 1), 'Anfitrión', 0, session.game.numberOfCards, session.id);
        session.jugadores.push(player);
        // fin de nueva forma
        mensaje = JSON.stringify(respuesta);
        server.clients.forEach((client) => {
          if (client === ws) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(mensaje);
              console.log(mensaje);
            }
          }
        });
      }
      if (messageReceived.nombreMensaje === 'nombreAnfitrion') {
        const itera = searchItera(messageReceived.codigo);
        sesiones[itera].jugadores[0].name = messageReceived.nombreA;
      }
      if (messageReceived.nombreMensaje === 'Unirse') {
        let conexion = '';
        server.clients.forEach((client) => {
          if (client === ws) {
            conexion = client;
          }
        });

        const iterador = searchItera(messageReceived.codigo);
        if (iterador === 'undefined') {
          const respuesta = {
            nombreMensaje: 'ErrorCodigoInvalido',
          };
          mensaje = JSON.stringify(respuesta);
          server.clients.forEach((client) => {
            if (client === ws) {
              client.send(mensaje);
              console.log(mensaje);
            }
          });
        } else {
          for (let itera = 0; itera < sesiones.length; itera += 1) {
            if (Number(sesiones[itera].id) === Number(messageReceived.codigo)) {
              assingIds(messageReceived.codigo);
              const newID = usersGlobal.length - 1;
              const newName = messageReceived.nombreInvitado;
              const newScore = sesiones[itera].game.numberOfCards;
              const player = new Jugador(newID, newName, 0, newScore, sesiones[itera].id);
              sesiones[itera].jugadores.push(player);
              sesiones[itera].conexiones.push(conexion);
              const respuesta = {
                nombreMensaje: 'AgregadoASesion',
                guest: sesiones[itera].game.players,
                codigoEmisor: usersGlobal.length - 1,
                jugadores: sesiones[itera].jugadores,
              };
              mensaje = JSON.stringify(respuesta);
              for (let players = 0; players < sesiones[itera].conexiones.length; players += 1) {
                sesiones[itera].conexiones[players].send(mensaje);
              }
            }
          }
        }
      } if (messageReceived.nombreMensaje === 'Iniciar') {
        const itera = searchItera(messageReceived.code);
        sesiones[itera].game.mode = messageReceived.mode;
        sesiones[itera].game.numberOfCards = messageReceived.numberOfCards;
        if (messageReceived.chancesToReveal === '0' || messageReceived.chancesToReveal === 0) {
          sesiones[itera].game.chancesToReveal = -1;
        } else {
          sesiones[itera].game.chancesToReveal = messageReceived.chancesToReveal;
        }
        sesiones[itera].game.revealTimer = messageReceived.revealTimer;
        sesiones[itera].game.numberOfImages = messageReceived.numberOfImages;
        sesiones[itera].game.rondasJugar = messageReceived.rondasJugar;
        sesiones[itera].game.totalRondas = messageReceived.rondasJugar;
        sesiones[itera].game.gris = messageReceived.gris;
        sesiones[itera].game = generateRug(sesiones[itera].game);
        if (sesiones[itera].game.mode === 2) {
          selectCards(sesiones[itera].game, sesiones[itera].game.Rug, sesiones[itera].wanted);
        }
        const respuesta = {
          nombreMensaje: 'Ronda',
          players: sesiones[itera].game.players,
          score: sesiones[itera].game.score,
          Rug: sesiones[itera].game.Rug,
          chancesToReveal: sesiones[itera].game.chancesToReveal,
          revealTimer: sesiones[itera].game.revealTimer,
          numberOfImages: sesiones[itera].game.numberOfImages,
          numberOfCards: sesiones[itera].game.numberOfCards,
          round: sesiones[itera].game.round,
          cards: sesiones[itera].game.cards,
          cardsLeft: [],
          mode: sesiones[itera].game.mode,
          users: sesiones[itera].users,
          jugadores: sesiones[itera].jugadores,
          gris: sesiones[itera].game.gris,
        };
        for (let players = 0; players < sesiones[itera].conexiones.length; players += 1) {
          mensaje = JSON.stringify(respuesta);
          sesiones[itera].conexiones[players].send(mensaje);
        }
      }
      if (messageReceived.nombreMensaje === 'Desconectar') { // Desconectar lo envia guest
      // codigo emisor
      // Desconecta al juador y lo borra de la lista de jugadores
        const itera = searchItera(messageReceived.codigo);
        if (itera !== 'undefined') {
          const posicion = buscaJugador(messageReceived.codigoEmisor, itera);
          sesiones[itera].jugadores.splice(posicion, 1);
          console.log(`Jugador desconectado con codigo ${messageReceived.codigoEmisor}`);
        }
        const respuesta = {
          nombreMensaje: 'SalioSesion',
          jugadores: sesiones[itera].jugadores,
        };
        mensaje = JSON.stringify(respuesta);
        for (let players = 0; players < sesiones[itera].conexiones.length; players += 1) {
          sesiones[itera].conexiones[players].send(mensaje);
        }
      } // Salir lo envia Host
      if (messageReceived.nombreMensaje === 'Salir') {
        const itera = searchItera(messageReceived.codigo);
        if (itera !== 'undefined') {
          const respuesta = {
            nombreMensaje: 'HostDesconectado',
          };
          mensaje = JSON.stringify(respuesta);
          for (let players = 0; players < sesiones[itera].conexiones.length; players += 1) {
            sesiones[itera].conexiones[players].send(mensaje);
          }
          if (sesiones.length > 1) {
            sesiones.splice(itera, 1);
          } else {
            sesiones = [];
          }
          // Envía mensaje de desconexion a todos los jugadores y cierra la sesion
          // message.codigo
          console.log(`Sesion cerrada con codigo ${messageReceived.codigo}`);
        }
      } // ultimo de verificacion de mensajes
      if (messageReceived.nombreMensaje === 'Listo') {
        const itera = searchItera(messageReceived.codigo);
        const posicion = buscaJugador(messageReceived.codigoEmisor, itera);
        sesiones[itera].jugadores[posicion].ready = 1;
        const respuesta = {
          nombreMensaje: 'Listo',
          jugadores: sesiones[itera].jugadores,
        };
        mensaje = JSON.stringify(respuesta);
        for (let players = 0; players < sesiones[itera].conexiones.length; players += 1) {
          sesiones[itera].conexiones[players].send(mensaje);
        }
      }
    }
  });
}

process.on('SIGINT', () => {
  server.close();
  console.log('Se cerro el servidor');
});

server.on('connection', connection);
