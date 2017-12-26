var rank = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
var suit = ["c", "d", "h", "s"];
var cards = [];

var player = {
  name : 'Player',
  bankroll : 100,
  bet_size : 2,
  hand : []
};

var dealer = {
  name : 'Jason',
  hand : []
};

$('#dealer_name').text(dealer.name + ", the Dealer's Hand");
$('#player_name').text(player.name + "'s Hand");

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

player.hand.push(dealHand());
dealer.hand.push(dealHand());
player.hand.push(dealHand());
console.log(player.hand);
console.log(dealer.hand);

dealer.hand.push(dealHand());
console.log(dealer.hand);


function displayCard(card) {
  var image_location = '<img src="images/cards/' + card + '.png" alt=Playing card ' + card + '>';
  return image_location;
}

$('#player_hand').append(displayCard(player.hand[0]));
$('#dealer_hand').append(displayCard(dealer.hand[0]));
$('#player_hand').append(displayCard(player.hand[1]));
//document.write(displayCard(player.hand[0]));


console.log("Remaining deck: ");
console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
