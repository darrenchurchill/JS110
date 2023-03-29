/**
 * JS110 Lesson 3
 * twentyone.js
 *
 * Twenty-One
 *
 * A command-line game of Twenty-One (simplified BlackJack)
 *
 */
const readline = require('readline-sync');

const NUMBER_CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
const FACE_CARDS_REGULAR = ['jack', 'queen', 'king'];
const FACE_CARDS_SPECIAL = ['ace'];
const SUITS = ['clubs', 'hearts', 'spades', 'diamonds'];

const FACE_CARDS_REGULAR_VALUE = 10;
const FACE_CARDS_SPECIAL_MIN_VALUE = 1;
const FACE_CARDS_SPECIAL_MAX_VALUE = 11;

const PLAYER_TYPE_PLAYER = 0;
const PLAYER_TYPE_DEALER = 1;
const INITIAL_HAND_SIZE = 2;
const DEALER_STAY_VALUE = 17;
const GAME_OBJECT_VALUE = 21;

let dealerTurnSleepDuration = 1000;  // milliseconds

function prompt(promptText) {
  return readline.questionInt(promptText);
}

function promptWithChoices(promptText, choices) {
  while (true) {
    let choice = readline.question(
      `${promptText.trim()} ` +
        `[${choices[0]} (default)` +
        `${choices.length > 1 ? ' | ' : ''}` +
        `${choices.slice(1).join(' | ')}] `
    );
    // Default to the first choice if the user chooses nothing
    if (choice === '') return choices[0];

    choice = getUnambiguousChoice(choices, choice);
    if (choice !== '') return choice;
    displayOutput('Invalid choice.');
  }
}

function getUnambiguousChoice(choices, choice) {
  let choicesLower = choices.map((choice) => choice.toLowerCase());
  let exactMatches = choices.filter(
    (candidate) => candidate.toLowerCase() === choice.toLowerCase()
  );
  if (exactMatches.length === 1) {
    return choices[choicesLower.indexOf(exactMatches[0])];
  }

  let shortenedChoices = choices.map(
    (str) => str.slice(0, choice.length).toLowerCase()
  );

  let idx = shortenedChoices.indexOf(choice.toLowerCase());
  let lastIdx = shortenedChoices.lastIndexOf(choice.toLowerCase());
  if (idx >= 0 && idx === lastIdx) return choices[idx];

  return '';
}

function displayOutput(output) {
  console.log(output);
}

function joinOr(array, delimiter = ', ', lastWord = 'or') {
  if (array.length <= 1) return `${array.join(delimiter)}`;

  let firstSlice = array.slice(0, array.length - 1).join(delimiter);
  if (!lastWord || array.length === 2) delimiter = ' ';
  let lastElem = array[array.length - 1];

  return `${firstSlice}${delimiter}${lastWord ? `${lastWord} ` : ''}${lastElem}`;
}

/**
 * Definition of a Card object's properties
 * @typedef {object} Card
 * @property {string} name - the card name (i.e. `'7'` or `'jack'`)
 * @property {number} maxValue - the card's maximum possible value. `maxValue`
 * === `minValue` for all cards except Ace's.
 * @property {number} minValue - the card's minimum possible value.
 * @property {string} suit - the card suit (i.e. `'hearts'` or `'clubs'`)
 */

/**
 * Create an individual Card with the name and suit
 * @param {string} name - the card name
 * @param {string} suit - the card suit
 * @returns {Card}
 */
function createCard(name, suit) {
  let value = Number(name);
  if (FACE_CARDS_REGULAR.includes(name)) value = FACE_CARDS_REGULAR_VALUE;
  else if (FACE_CARDS_SPECIAL.includes(name)) {
    value = FACE_CARDS_SPECIAL_MAX_VALUE;
  }

  return Object.freeze({
    name: name,
    maxValue: value,
    minValue: FACE_CARDS_SPECIAL.includes(name)
      ? FACE_CARDS_SPECIAL_MIN_VALUE
      : value,
    suit: suit,
  });
}

/**
 * Create a set of Cards all of one suit
 * @param {string} suit - the suit to create
 * @returns {Card[]} the Cards of this suit
 */
function createSuit(suit) {
  let cards = NUMBER_CARDS.concat(FACE_CARDS_REGULAR, FACE_CARDS_SPECIAL);
  return cards.map((card) => createCard(card, suit));
}

/**
 * Create an entire deck of Cards
 * @returns {Card[]} the deck of Cards
 */
function createDeck() {
  return SUITS.flatMap((suit) => createSuit(suit));
}

function shuffle(deck) {
  let endIdx = deck.length;

  while (endIdx > 0) {
    let randIdx = Math.floor(Math.random() * endIdx);
    endIdx -= 1;

    [deck[randIdx], deck[endIdx]] = [deck[endIdx], deck[randIdx]];
  }

  return deck;
}

/**
 * Display the current round score: each player's number of wins
 * @param {PlayerInfo} playerInfo - the user player
 * @param {PlayerInfo} dealerInfo - the computer dealer
 */
function displayRoundScore(playerInfo, dealerInfo) {
  displayOutput(
    `Round score: ` +
      `${playerInfo.name}: ${playerInfo.numWins} ` +
      `${dealerInfo.name}: ${dealerInfo.numWins}`
  );
}

/**
 * Display each player's hand contents and total value
 * @param {PlayerInfo} playerInfo - the user player
 * @param {PlayerInfo} dealerInfo - the computer dealer
 * @param {boolean} dealerFaceDown - whether to obscure the dealer's second Card
 * and total hand value.
 */
function displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown = true) {
  console.clear();
  displayRoundScore(playerInfo, dealerInfo);
  displayOutput(getPlayerHandString(dealerInfo, dealerFaceDown));
  displayOutput(getPlayerHandString(playerInfo));
}

/**
 * Return the string representation of a Player's hand
 * @param {PlayerInfo} playerInfo - the Player
 * @param {boolean} secondFaceDown - whether to obscure the Player's second Card
 * and total value. (used to hide the Dealer's second card and total)
 * @returns {string}
 */
function getPlayerHandString(playerInfo, secondFaceDown = false) {
  let cards = playerInfo.playerHand.map(
    (card) => card.name[0].toUpperCase() + card.name.slice(1)
  );

  secondFaceDown = cards.length === 2 && secondFaceDown;
  if (secondFaceDown) cards[1] = 'unknown card';
  cards = joinOr(cards, ', ', 'and');

  return (
    `${playerInfo.name} has: ${cards} ` +
    `${secondFaceDown ? '' : `(total: ${playerInfo.handTotal})`}`
  );
}

/**
 * Definition of a player turn callback function's parameters and return value
 * @callback playerTurnCallback
 * @param {Card[]} deck
 * @param {PlayerInfo} playerInfo
 * @param {PlayerInfo} dealerInfo
 * @returns {undefined}
 */

/**
 * Complete a user (Player) turn, prompting the user to hit or stay, and dealing
 * them card(s) accordingly.
 * @param {Card[]} deck - the current deck of Cards
 * @param {PlayerInfo} playerInfo - the Player
 * @param {PlayerInfo} dealerInfo - the Dealer
 */
function doPlayerTurn(deck, playerInfo, dealerInfo) {
  let dealerFaceDown = true;

  while (!isBusted(playerInfo.handTotal)) {
    displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
    let choice = promptWithChoices('Your choice?', ['hit', 'stay']);

    if (choice === 'stay') {
      return;
    }
    dealCard(deck, playerInfo);
  }

  displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
}

/**
 * Returns true if the Dealer should hit according to the rules
 * @param {PlayerInfo} dealerInfo - the Dealer
 * @returns {boolean}
 */
function shouldDealerHit(dealerInfo) {
  return dealerInfo.handTotal < DEALER_STAY_VALUE;
}

function setDealerTurnSleepDuration(ms) {
  dealerTurnSleepDuration = ms;
}

function sleep(ms) {
  const date = Date.now();
  while (true) {
    let currentDate = Date.now();
    if (currentDate - date > ms) return;
  }
}

/**
 * Complete a dealer turn, automatically hitting and staying according to the
 * dealer's rules.
 * @param {Card[]} deck - the current deck of Cards
 * @param {PlayerInfo} playerInfo - the Player
 * @param {PlayerInfo} dealerInfo - the Dealer
 */
function doDealerTurn(deck, playerInfo, dealerInfo) {
  let dealerFaceDown = false;

  while (!isBusted(dealerInfo.handTotal)) {
    displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);

    if (!shouldDealerHit(dealerInfo)) {
      return;
    }
    sleep(dealerTurnSleepDuration);
    dealCard(deck, dealerInfo);
  }

  displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
}

/**
 * Deal a card to a player, updating the `player.playerHand` and
 * `player.handTotal` properties accordingly
 * @param {Card[]} deck - the current deck of Cards
 * @param {PlayerInfo} player - the Player
 */
function dealCard(deck, player) {
  player.playerHand.push(deck.shift());
  player.handTotal = getHandTotal(player.playerHand);
}

/**
 * Deal the initial hand of 2 cards to the player and dealer
 * @param {Card[]} deck - the current deck of Cards
 * @param {PlayerInfo} player - the Player
 * @param {PlayerInfo} dealer - the Dealer
 */
function dealInitialHands(deck, player, dealer) {
  for (let _ = 0; _ < INITIAL_HAND_SIZE; _++) {
    dealCard(deck, player);
    dealCard(deck, dealer);
  }
}

/**
 * Definition of a Player object's properties
 * @typedef {object} PlayerInfo
 * @property {string} name - the player's name
 * @property {number} playerType - the player type, representing either a user
 * player or a computer dealer
 * @property {Card[]} playerHand - the player's current hand of Cards
 * @property {number} handTotal - the player's current calculated hand total
 * @property {number} numWins - the player's total number of wins in a best-of
 * round.
 * @property {playerTurnCallback} doTurnCallback - the callback function to
 * execute this user type's turn
 */

/**
 * Create a player given a `name` and `playerType`
 * @param {string} name - the player's name
 * @param {number} playerType - the player type, representing either a user
 * player or a computer dealer
 * @returns {PlayerInfo} the Player
 */
function createPlayer(name, playerType) {
  if (playerType !== PLAYER_TYPE_PLAYER && playerType !== PLAYER_TYPE_DEALER) {
    throw new RangeError(
      `The playerType arg must be === ` +
      `PLAYER_TYPE_PLAYER (${PLAYER_TYPE_PLAYER}) ` +
      `or === PLAYER_TYPE_DEALER (${PLAYER_TYPE_DEALER})`
    );
  }
  return {
    name: name,
    playerType: playerType,
    playerHand: [],
    handTotal: 0,
    numWins: 0,
    doTurnCallback:
      playerType === PLAYER_TYPE_PLAYER ? doPlayerTurn : doDealerTurn,
  };
}

/**
 * Returns an array of 1 or 2 arrays; each sub-array representing a list of
 * each card's value in the player's hand.
 * @param {Card[]} playerHand - the player hand as an array of Cards
 * @returns {Array.<number[]>}
 */
function getHandCardValues(playerHand) {
  let minValues = playerHand.map((card) => card.minValue);
  let result = [minValues];

  let idxOfSpecial = playerHand.findIndex((card) =>
    FACE_CARDS_SPECIAL.includes(card.name)
  );
  if (idxOfSpecial >= 0) {
    result.push([...result[0]]);
    result[1][idxOfSpecial] = playerHand[idxOfSpecial].maxValue;
  }

  return result;
}

/**
 * Returns an array of 1 or 2 hand total values; each representing a possible
 * total hand value, depending on how ace's (if any) are valued.
 * @param {Card[]} playerHand - the player hand as an array of Cards
 * @returns {number[]} the hand total values
 */
function getHandTotals(playerHand) {
  return getHandCardValues(playerHand).map((cardValues) =>
    cardValues.reduce((accum, cardValue) => accum + cardValue, 0)
  );
}

/**
 * Calculate the definitive total value of a player's hand. This is the highest
 * possible non-busting total value, if there is one; or, the lowest busting
 * value if all the values are busted.
 * @param {Card[]} playerHand - the player hand as an array of Cards
 * @returns {number} the hand total value
 */
function getHandTotal(playerHand) {
  let totals = getHandTotals(playerHand);
  if (totals.length === 1) return totals[0];
  if (!isBusted(totals[1])) return totals[1];
  return totals[0];
}

/**
 * Return true if the player hand (array of `Cards`) of player hand total
 * `number` is busted.
 * @param {Card[] | number} player - the player hand as an array of `Cards`, or
 * the player hand total (`number`)
 * @returns {boolean}
 */
function isBusted(playerHandOrHandTotal) {
  if (Array.isArray(playerHandOrHandTotal)) {
    return getHandTotal(playerHandOrHandTotal) > GAME_OBJECT_VALUE;
  } else if (typeof player === 'object') {
    return playerHandOrHandTotal.handTotal > GAME_OBJECT_VALUE;
  }
  return playerHandOrHandTotal > GAME_OBJECT_VALUE;
}

/**
 * Play a single game of Twenty-One. Prompts user for their choice to hit or
 * stay, outputs the hand values at each step, and displays the dealers's turn.
 * @param {PlayerInfo} playerInfo - the user player
 * @param {PlayerInfo} dealerInfo - the computer dealer
 * @returns {PlayerInfo | null} - the winner, or `null` if it's a tie
 */
// eslint-disable-next-line max-lines-per-function, max-statements
function playTwentyOne(playerInfo, dealerInfo) {
  let deck = createDeck();
  shuffle(deck);

  playerInfo.playerHand = [];
  dealerInfo.playerHand = [];

  dealInitialHands(deck, playerInfo, dealerInfo);
  let players = [playerInfo, dealerInfo];

  for (let curPlayer of players) {
    curPlayer.doTurnCallback(deck, ...players);
    if (isBusted(curPlayer.handTotal)) {
      displayOutput(`${curPlayer.name} busts.`);
      return curPlayer === playerInfo ? dealerInfo : playerInfo;
    }
  }

  if (playerInfo.handTotal > dealerInfo.handTotal) {
    displayOutput(`${playerInfo.name} wins!`);
    return playerInfo;
  } else if (dealerInfo.handTotal > playerInfo.handTotal) {
    displayOutput(`${dealerInfo.name} wins.`);
    return dealerInfo;
  } else {
    displayOutput("It's a tie.");
    return null;
  }
}

/**
 * Play a round of multiple games of Twenty-One, best of: `bestOf`
 * @param {PlayerInfo} player - the user player
 * @param {PlayerInfo} dealer - the computer dealer
 * @returns {PlayerInfo} the round winner
 */
function playRound(player, dealer, bestOf = 5) {
  player.numWins = 0;
  dealer.numWins = 0;

  while (true) {
    let winner = playTwentyOne(player, dealer);

    if (winner === player) {
      player.numWins += 1;
      if (player.numWins > Math.floor(bestOf / 2)) return player;
    } else if (winner === dealer) {
      dealer.numWins += 1;
      if (dealer.numWins > Math.floor(bestOf / 2)) return dealer;
    }

    readline.question('Press enter to continue.');
  }
}

function shouldPlayAgain() {
  let choices = ['yes', 'no'];
  let choice = promptWithChoices('Play again?', choices);
  return choice === choices[0];
}

function playUntilDone() {
  let player = createPlayer('Player', PLAYER_TYPE_PLAYER);
  let dealer = createPlayer('Dealer', PLAYER_TYPE_DEALER);

  while (true) {
    let winner = playRound(player, dealer);
    displayRoundScore(player, dealer);
    displayOutput(`${winner.name} wins the round!!!`);


    if (!shouldPlayAgain()) return;
  }
}

if (require.main === module) {
  playUntilDone();
}

module.exports = {
  NUMBER_CARDS,
  FACE_CARDS_REGULAR,
  FACE_CARDS_SPECIAL,
  SUITS,
  FACE_CARDS_REGULAR_VALUE,
  FACE_CARDS_SPECIAL_MAX_VALUE,
  FACE_CARDS_SPECIAL_MIN_VALUE,
  PLAYER_TYPE_PLAYER,
  PLAYER_TYPE_DEALER,
  INITIAL_HAND_SIZE,
  DEALER_STAY_VALUE,
  GAME_OBJECT_VALUE,
  prompt,
  promptWithChoices,
  getUnambiguousChoice,
  displayOutput,
  joinOr,
  createCard,
  createSuit,
  createDeck,
  shuffle,
  doPlayerTurn,
  shouldDealerHit,
  setDealerTurnSleepDuration,
  doDealerTurn,
  dealCard,
  dealInitialHands,
  createPlayer,
  getHandCardValues,
  getHandTotals,
  getHandTotal,
  isBusted,
};
