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

$('#dealer_name').text(dealer.name + ", the Dealer's Hand Value: ");
$('#player_name').text(player.name + "'s Hand Value: ");

var deck = function(){
  for (var r = 0; r < rank.length; r++) {
    for (var s = 0; s < suit.length; s++) {
      cards.push(rank[r] + suit[s]);
    }
  }
  return cards;
}

var new_deck = deck();

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



function displayCard(card) {
  var image_location = '<img src="images/cards/' + card + '.png" alt=Playing card ' + card + '>';
  return image_location;
}

$('#player_hand').append(displayCard(player.hand[0]));
$('#dealer_hand').append(displayCard(dealer.hand[0]));
$('#player_hand').append(displayCard(player.hand[1]));

function handValue(hand){
  var value = 0;
  var aces = 0;
  for (var i = 0; i < hand.length; i++){
    switch (hand[i][0]) {
      case '2':
        value += 2; break;
      case '3':
        value += 3; break;
      case '4':
        value += 4; break;
      case '5':
        value += 5; break;
      case '6':
        value += 6; break;
      case '7':
        value += 7; break;
      case '8':
        value += 8; break;
      case '9':
        value += 9; break;
      default:
        value += 10; break;
      case 'A':
        value += 11;
        aces += 1;
        break;
    }
  }
  while (aces > 0){
    if (value > 21){
      value -= 10;
    }
    aces--;
  }
  console.log(value);
  console.log(aces);
  return value;
}

$('#player_name').append(handValue(player.hand));
$('#dealer_name').append(handValue(dealer.hand));

dealer.hand.push(dealHand());
console.log(dealer.hand);

console.log("Remaining deck: ");
console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
