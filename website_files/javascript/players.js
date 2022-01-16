module.exports = class player {
  constructor(id, name, score, cardsLeft, codPartida) {
    this.id = id;
    this.name = name;
    this.score = score;
    this.cardsLeft = cardsLeft;
    this.codPartida = codPartida;
    this.ready = 1;
  }
};
