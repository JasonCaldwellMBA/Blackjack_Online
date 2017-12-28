// Starting game stats
var cards = [];
var hand_num = 1;
var score = 0;

// Create player and dealer
var player = {
  name : 'Player',
  bankroll : 100.00,
  bet_size : 2.00,
  hand : [],
  wins : false,
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

// Create new shuffled deck
function create_shuffled_deck(){
  // Create ranks and suits
  var rank = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
  var suit = ["c", "d", "h", "s"];

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
  return shuffle(new_deck);
}

// Deal initial cards (2 for the player and one for the dealer)
function dealHand(){
  return cards.shift();
}

// Show card image
function displayCard(card) {
  var image_location = '<img src="images/cards/' + card + '.png" alt=Playing card ' + card + '>';
  return image_location;
}

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

// Player blackjack check
function player_bj_check(pv){
  if (pv === 21){
    document.write("Congrats, you win with blackjack!");
    player.bankroll += player.bet_size * 1.5;
    player.wins === true;
  }
}

// Offer insurance if dealer's first card was an A
function insurance_offer(){
  if (dealer.hand[0][0] === 'A') {
    if (confirm("Do you want to buy insurance?")){
      document.write("Hint: You never want to buy insurance in blackjack. It is always unprofitable and therefore you cannot buy it in this game.");
    }
    else {
      document.write("Good decision. Buying insurance in blackjack is a losing play over the long run.");
    }
  }
}

// Check to see if the dealer has blackjack
function dealer_bj_check(dv){
  if (dv === 21){
    document.write("Sorry, the dealer has blackjack.");
    player.bankroll -= player.bet_size;
    dealer.wins === true;
  }
}

// Create stand button
function stand_button(){
  var button_stand = document.createElement("button");
  button_stand.innerHTML = "Stand";

  $("#stand").append(button_stand);

  button_stand.addEventListener ("click", function() {
    dealer_turn();
  });
}

// Create hit button
function hit_button(){
  var button_hit = document.createElement("button");
  button_hit.innerHTML = "Hit";

  $("#hit").append(button_hit);

  button_hit.addEventListener ("click", function() {
    console.log("hit");
    dealHand();
    console.log(cards);
  });
}

// Create double button - only available first round
function double_button(){
  var button_double = document.createElement("button");
  button_double.innerHTML = "Double";

  $("#double").append(button_double);

  button_double.addEventListener ("click", function() {
    player.hand.push(dealHand());
    $('#player_hand').append(displayCard(player.hand[2]));
    var pv = handValue(player.hand);
    $('#player_name').append(' -> ' + pv);
    dealer_turn();
  });
}

// Create split button
function split_button(){
  var button_split = document.createElement("button");
  button_split.innerHTML = "Split";

  $("#split").append(button_split);

  button_split.addEventListener ("click", function() {
    alert("split");
  });
}

// Create hint button
function hint_button(){
  var button_hint = document.createElement("button");
  button_hint.innerHTML = "Hint";

  $("#hint").append(button_hint);

  button_hint.addEventListener ("click", function() {
    alert("hint");
  });
}

// Create stats section
function stats() {
  $('#bet').children().append(placeBet());
  $('#score').children().append(score);
  $('#hand_num').children().append(hand_num);
  $('#bankroll').children().append(player.bankroll);
}

// Setup game
var initial_deal = function() {
  create_shuffled_deck();

  $('#dealer_name').text(dealer.name + "'s Hand Value: ");
  $('#player_name').text(player.name + "'s Hand Value: ");

  // Deal first three cards face up (2 to player and 1 to dealer)
  player.hand.push(dealHand());
  dealer.hand.push(dealHand());
  player.hand.push(dealHand());
  console.log(player.hand);
  console.log(dealer.hand);

  $('#player_hand').append(displayCard(player.hand[0]));
  $('#dealer_hand').append(displayCard(dealer.hand[0]));
  $('#player_hand').append(displayCard(player.hand[1]));

  var pv = handValue(player.hand);
  var dv = handValue(dealer.hand);

  $('#player_name').append(pv);
  $('#dealer_name').append(dv);

  player_bj_check(pv);

  // Deal final dealer card
  dealer.hand.push(dealHand());
  console.log(dealer.hand);
  dv = handValue(dealer.hand);

  insurance_offer()
  dealer_bj_check(dv)

  stand_button();
  hit_button();
  double_button();
  if (player.hand[0][0] === player.hand[1][0]){
    split_button();
  }
  hint_button();

  stats();
};

function dealer_turn() {
  $('#dealer_hand').append(displayCard(dealer.hand[1]));
  var dv = handValue(dealer.hand);
  $('#dealer_name').append(' -> ' + dv);
  var i = 2;
  while (dv < 17) {
    dealer.hand.push(dealHand());
    $('#dealer_hand').append(displayCard(dealer.hand[i]));
    var dv = handValue(dealer.hand);
    $('#dealer_name').append(' -> ' + dv);
    i++;
  }
}

// Start game
initial_deal();


console.log("Remaining deck: ");
console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
