var Card = require("./card.js").Card;

function Deck() {
  this.cards = [];
  for (var rank = 2; rank <= 14; rank++) {
    for (var suit = 0; suit <= 3; suit++) {
      this.cards.push(new Card(rank, suit));
    }
  }
  this.toString = function() {
    var result = "";
    for (c of this.cards) {
      result+= c.toString() + "\n";
    }
    return result;
  }
}

exports.Deck = Deck;
