var rank = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var suit = ["c", "d", "h", "s"];
var cards = [];

var deck = function(){
  for (var r = 0; r < rank.length; r++) {
    for (var s = 0; s < suit.length; s++) {
      cards.push(rank[r] + suit[s]);
    }
  }
  return cards;
}

var new_deck = deck();
console.log(new_deck.length);

// Ref accepted answer from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array on 12/25/17
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

shuffle(new_deck);
console.log(new_deck);

function dealHand(){
  return cards.shift();
}

var c1 = dealHand();
var c2 = dealHand();
var c3 = dealHand();
var c4 = dealHand();

console.log("Players's hand: " + c1 + c3);
console.log("Dealer's hand: " + c2 + c4);

console.log("Remaining deck: ");
console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
