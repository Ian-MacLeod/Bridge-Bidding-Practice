


function Card(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.toString = function() {
    return (Card.prototype.SuitStrings[this.suit] + Card.prototype.RankStrings[this.rank]);
  }
}

Card.prototype.RankStrings = ["x", "x", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
Card.prototype.SuitStrings = ["C", "D", "H", "S", "N"];

/*
Card.prototype.RankStrings = Object.freeze({2: "2",
                    3: "3",
                    4: "4",
                    5: "5",
                    6: "6",
                    7: "7",
                    8: "8",
                    9: "9",
                    10: "T",
                    11: "J",
                    12: "Q",
                    13: "K",
                    14: "A"});
Card.prototype.RankStrings = Object.freeze({0: "C",
                    1: "D",
                    2: "H",
                    3: "S",
                    4: "N"});
*/
exports.Card = Card;
