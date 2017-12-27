// Starting game stats
var cards = [];
var hand_num = 1;
var score = 0;

// Create player and dealer
var player = {
  name : 'Player',
  bankroll : 100,
  bet_size : 2,
  hand : [],
  wins : false
};

var dealer = {
  name : 'Dealer',
  hand : [],
  wins : false
};

// Place bet - Will be interactive in future
function placeBet(){
  var bet = player.bet_size;
  return bet;
}

// Setup game
var initialDeal = function() {
  // Create ranks and suits
  var rank = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  var suit = ["c", "d", "h", "s"];

  $('#dealer_name').text(dealer.name + "'s Hand Value: ");
  $('#player_name').text(player.name + "'s Hand Value: ");

  // Create deck
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

  // Deal initial cards (2 for the player and one for the dealer)
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

  // Evaluate hand values
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

  var pv = handValue(player.hand);
  var dv = handValue(dealer.hand);

  $('#player_name').append(pv);
  $('#dealer_name').append(dv);

  // Player blackjack check
  if (pv === 21){
    document.write("Congrats, you win with blackjack!");
    player.bankroll += player.bet_size * 1.5;
    player.wins === true;
  }

  // Deal final dealer card
  dealer.hand.push(dealHand());
  console.log(dealer.hand);
  dv = handValue(dealer.hand);

  // Offer insurance if dealer's first card was an A
  if (dealer.hand[0][0] === 'A') {
    if (confirm("Do you want to buy insurance?")){
      document.write("Hint: You never want to buy insurance in blackjack. It is always unprofitable and therefore you cannot buy it in this game.");
    }
    else {
      document.write("Good decision. Buying insurance in blackjack is a losing play over the long run.");
    }
  }

  // Check to see if the dealer has blackjack
  if (dv === 21){
    document.write("Sorry, the dealer has blackjack.");
    player.bankroll -= player.bet_size;
    dealer.wins === true;
  }


  // Create action buttons - some of these are only available on first action
  var button_stand = document.createElement("button");
  button_stand.innerHTML = "Stand";
  var button_hit = document.createElement("button");
  button_hit.innerHTML = "Hit";
  var button_double = document.createElement("button");
  button_double.innerHTML = "Double";
  var button_split = document.createElement("button");
  button_split.innerHTML = "Split";

  $("#stand").append(button_stand);
  $("#hit").append(button_hit);
  $("#double").append(button_double);
  $("#split").append(button_split);


};

// Start game
initialDeal();

// Create stats section
$('#bet').children().append(placeBet());
$('#score').children().append(score);
$('#hand_num').children().append(hand_num);
$('#bankroll').children().append(player.bankroll);


console.log("Remaining deck: ");
console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
