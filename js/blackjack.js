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
  blackjack : false
};

var dealer = {
  name : 'Dealer',
  hand : [],
  wins : false,
  blackjack : false
};

//Create action/event buttons
var button_stand = document.createElement("button");
button_stand.innerHTML = "Stand";
var button_hit = document.createElement("button");
button_hit.innerHTML = "Hit";
var button_double = document.createElement("button");
button_double.innerHTML = "Double";
var button_split = document.createElement("button");
button_split.innerHTML = "Split";
var button_hint = document.createElement("button");
button_hint.innerHTML = "Hint";

// Place bet - Will be interactive in future
function place_bet(multiple){
  var bet = player.bet_size * multiple;
  $('#bet').children().text('');
  $('#bet').children().text('Bet Amount: $' + bet);
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

function disable_all_buttons() {
  button_stand.disabled = true;
  button_hit.disabled = true;
  button_double.disabled = true;
  button_split.disabled = true;
  button_hint.disabled = true;
}

// Player blackjack check
function player_bj_check(pv){
  if (pv === 21){
    player.blackjack = true;
    player.wins = true;
    disable_all_buttons()
    determine_winner();
  }
}

// Display insurance message if dealer's first card was an A
function insurance_offer(){
  if (dealer.hand[0][0] === 'A') {
    $('#winner').text('');
    $('#winner').text("Usually you would be offerred insurance since the dealer has an ace showing. This is almost always unprofitable and therefore isn't offerred.");
  }
}

// Check to see if the dealer has blackjack
function dealer_bj_check(dv){
  if (dv === 21){
    dealer.blackjack = true;
    dealer.wins = true;
    disable_all_buttons()
    determine_winner();
  }
}

// Create stand event
function stand_button(){
  $("#stand").append(button_stand);

  button_stand.addEventListener ("click", function() {
    disable_all_buttons()
    dealer_turn();
  });
}

// Create hit event
function hit_button(){
  $("#hit").append(button_hit);

  button_hit.addEventListener ("click", function() {
    player.hand.push(dealHand());
    $('#player_hand').append(displayCard(player.hand[player.hand.length-1]));
    var pv = handValue(player.hand);
    $('#player_name').append(' -> ' + pv);
    button_double.disabled = true;
    button_split.disabled = true;
    player_turn();
  });
}

// Create double event - only available first round
function double_button(){
  $("#double").append(button_double);

  button_double.addEventListener ("click", function() {
    place_bet(2);
    player.hand.push(dealHand());
    $('#player_hand').append(displayCard(player.hand[player.hand.length-1]));
    var pv = handValue(player.hand);
    $('#player_name').append(' -> ' + pv);
    disable_all_buttons()
    player_turn();
    dealer_turn();
  });
}

// Create split event
function split_button(){
  $("#split").append(button_split);

  button_split.addEventListener ("click", function() {
    alert("split");
    // This is going to be complicated
  });
}

// Create hint event
function hint_button(){
  $("#hint").append(button_hint);

  button_hint.addEventListener ("click", function() {
    // Note: player soft hand has slightly different odds; but for this game we are using the same hints for both.
		// Same for split hands.
		var pv = handValue(player.hand);
		var dv = handValue(dealer.hand[0][0]);
		// Player hard hand recommendations
		// https://wizardofodds.com/games/blackjack/strategy/1-deck/ ref 10/29/17
		if (pv >= 4 && pv <= 7) {
				hint = "hitting";
		}
		else if	(pv === 8) {
			if (dv >= 2 && dv <= 4) {
				hint = "hitting";
			}
			else if (dv >= 5 && dv <= 6) {
					hint = "doubling or hitting";
			}
			else if (dv >= 7 && dv <= 11) {
				hint = "hitting";
			}
		}
		else if	(pv === 9) {
			if (dv >= 2 && dv <= 6) {
				hint = "doubling or hitting";
			}
			else if (dv >= 7 && dv <= 11) {
				hint = "hitting";
			}
		}
		else if	(pv === 10) {
			if (dv >= 2 && dv <= 9) {
				hint = "doubling or hitting";
			}
			else if (dv >= 10 && dv <= 11) {
				hint = "hitting";
			}
		}
		else if	(pv === 11) {
			hint = "doubling or hitting";
		}
		else if	(pv === 12) {
			if (dv >= 2 && dv <= 3) {
				hint = "hitting";
			}
			else if (dv >= 4 && dv <= 6) {
				hint = "standing";
			}
			else if (dv >= 7 && dv <= 11) {
				hint = "hitting";
			}
		}
		else if	(pv >= 13 && pv <= 16) {
			if (dv >= 2 && dv <= 6) {
				hint = "standing";
			}
			else if (dv >= 7 && dv <= 11) {
				hint = "hitting";
			}
		}
		else if	(pv >= 17) {
			hint = "standing";
		}
		$('#winner').text("The odds recommend: " + hint);
  });
}

// Create stats section
function stats() {
  $('#score').children().text('');
  $('#score').children().text('Score: ' + score);
  $('#hand_num').children().text('');
  $('#hand_num').children().text('Hand Number: ' + hand_num);
  $('#bankroll').children().text('');
  $('#bankroll').children().text('Bankroll: $' + player.bankroll);
}

// Setup game
var initial_deal = function() {
  place_bet(1);
  create_shuffled_deck();

  $('#dealer_name').text(dealer.name + "'s Hand Value: ");
  $('#player_name').text(player.name + "'s Hand Value: ");

  // Deal first three cards face up (2 to player and 1 to dealer)
  player.hand.push(dealHand());
  $('#player_hand').append(displayCard(player.hand[player.hand.length-1]));
  dealer.hand.push(dealHand());
  $('#dealer_hand').append(displayCard(dealer.hand[dealer.hand.length-1]));
  player.hand.push(dealHand());
  $('#player_hand').append(displayCard(player.hand[player.hand.length-1]));

  console.log(player.hand);
  console.log(dealer.hand);

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
  split_button();
  if (!(player.hand[0][0] === player.hand[1][0])){
    button_split.disabled = true;
  }
  hint_button();

  stats();
};

function player_turn(){
  $('#winner').text('');
  if (handValue(player.hand) > 21) {
    dealer.wins = true;
    disable_all_buttons()
    determine_winner();
  }
}

function dealer_turn() {
  if (!(dealer.wins)) {
    $('#dealer_hand').append(displayCard(dealer.hand[dealer.hand.length-1]));
    var dv = handValue(dealer.hand);
    $('#dealer_name').append(' -> ' + dv);
    while (dv < 17) {
      dealer.hand.push(dealHand());
      $('#dealer_hand').append(displayCard(dealer.hand[dealer.hand.length-1]));
      var dv = handValue(dealer.hand);
      $('#dealer_name').append(' -> ' + dv);
    }
    if (dv > 21) {
      player.wins = true;
    }
  }
  determine_winner();
}

function determine_winner() {
  if (player.blackjack) {
    var amount = player.bet_size * 1.5;
    $('#winner').text("Congrats, you win $" + amount + " with blackjack!")
    player.bankroll += amount;
  }
  else if (dealer.blackjack) {
    $('#winner').append(" Sorry, dealer wins with blackjack.")
    player.bankroll -= player.bet_size;
  }
  else if (dealer.wins) {
    $('#winner').text("Sorry, dealer wins.")
    player.bankroll -= player.bet_size;
  }
  else if (player.wins){
    $('#winner').text("Player wins!")
    player.bankroll += player.bet_size;
  }
  else if (handValue(dealer.hand) > handValue(player.hand)) {
    $('#winner').text("Sorry, dealer wins.")
    player.bankroll -= player.bet_size;
  }
  else if (handValue(dealer.hand) < handValue(player.hand)) {
    $('#winner').text("Player wins!")
    player.bankroll += player.bet_size;
  }
  else if (handValue(dealer.hand) === handValue(player.hand)) {
    $('#winner').text("It's a push (tie).")
    // No change to bankroll
  }
  else{
    console.log("unknown winner")
  }

  hand_num++;
  stats();
  // while (hand_num < 10){
  //   var cards = [];
  //   player.hand = [];
  //   dealer.hand = [];
  //   player.blackjack = false;
  //   dealer.blackjack = false;
  //   player.wins = false;
  //   dealer.wins = false;
  //   button_stand.disabled = false;
  //   button_hit.disabled = false;
  //   button_double.disabled = false;
  //   button_split.disabled = false;
  //   button_hint.disabled = false;
  //   initial_deal();
  // }
}

// Start game
initial_deal();

// For testing
// console.log("Remaining deck: ");
// console.log(cards);

// console.log("Validate count of deck")
// while( (i = cards.shift()) !== undefined ) {
//     console.log(i);
// }
