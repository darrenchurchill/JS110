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
const GAME_RESULT_PLAYER_BUST = -1;

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

function createSuit(suit) {
  let cards = NUMBER_CARDS.concat(FACE_CARDS_REGULAR, FACE_CARDS_SPECIAL);
  return cards.map((card) => createCard(card, suit));
}

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

function displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown = true) {
  console.clear();
  displayOutput(getPlayerHandString(dealerInfo, dealerFaceDown));
  displayOutput(getPlayerHandString(playerInfo));
}

function getPlayerHandString(playerInfo, secondFaceDown = false) {
  let total = isBusted(playerInfo.playerHand)
    ? getHandMinTotal(playerInfo.playerHand)
    : getMaxNonBustedHandTotal(playerInfo.playerHand);

  let cards = playerInfo.playerHand.map((card) => card.name);

  secondFaceDown = cards.length === 2 && secondFaceDown;
  if (secondFaceDown) cards[1] = 'unknown card';

  return (
    `${playerInfo.name} has: ${cards} ` +
    `${secondFaceDown ? '' : `(total: ${total})`}`
  );
}

function doPlayerTurn(deck, playerInfo, dealerInfo) {
  let dealerFaceDown = true;

  while (!isBusted(playerInfo.playerHand)) {
    displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
    let choice = promptWithChoices('Your choice?', ['hit', 'stay']);

    if (choice === 'stay') {
      return getMaxNonBustedHandTotal(playerInfo.playerHand);
    }
    dealCard(deck, playerInfo);
  }

  displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
  return GAME_RESULT_PLAYER_BUST;
}

function shouldDealerHit(dealerInfo) {
  return getMaxNonBustedHandTotal(dealerInfo.playerHand) < DEALER_STAY_VALUE;
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

function doDealerTurn(deck, playerInfo, dealerInfo) {
  let dealerFaceDown = false;

  while (!isBusted(dealerInfo.playerHand)) {
    displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);

    if (!shouldDealerHit(dealerInfo)) {
      return getMaxNonBustedHandTotal(dealerInfo.playerHand);
    }
    sleep(dealerTurnSleepDuration);
    dealCard(deck, dealerInfo);
  }

  displayPlayerHands(playerInfo, dealerInfo, dealerFaceDown);
  return GAME_RESULT_PLAYER_BUST;
}

function dealCard(deck, player) {
  player.playerHand.push(deck.shift());
}

function dealInitialHands(deck, player, dealer) {
  for (let _ = 0; _ < INITIAL_HAND_SIZE; _++) {
    dealCard(deck, player);
    dealCard(deck, dealer);
  }
}

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
    doTurnCallback:
      playerType === PLAYER_TYPE_PLAYER ? doPlayerTurn : doDealerTurn,
  };
}

// TODO: remove?
function getHandMinTotal(playerHand) {
  return getHandTotals(playerHand).at(0);
}

// TODO: remove?
function getHandMaxTotal(playerHand) {
  return getHandTotals(playerHand).at(-1);
}

function getMaxNonBustedHandTotal(playerHand) {
  let totals = getNonBustedHandTotals(playerHand);
  if (totals.length > 0) return totals.at(-1);
  return GAME_RESULT_PLAYER_BUST;
}

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

function getHandTotals(playerHand) {
  return getHandCardValues(playerHand).map((cardValues) =>
    cardValues.reduce((accum, cardValue) => accum + cardValue, 0)
  );
}

function getHandTotal(playerHand) {
  let totals = getHandTotals(playerHand);
  if (totals.length === 1 || totals[0] >= GAME_OBJECT_VALUE) return totals[0];
  return totals[1];
}

function getNonBustedHandTotals(playerHand) {
  return getHandTotals(playerHand).filter(
    (total) => total <= GAME_OBJECT_VALUE
  );
}

function isBusted(playerHand) {
  return getNonBustedHandTotals(playerHand).length === 0;
}

// eslint-disable-next-line max-lines-per-function
function playTwentyOne(playerInfo, dealerInfo) {
  let deck = createDeck();
  shuffle(deck);

  playerInfo.playerHand = [];
  dealerInfo.playerHand = [];

  dealInitialHands(deck, playerInfo, dealerInfo);
  let players = [playerInfo, dealerInfo];

  for (let curPlayer of players) {
    curPlayer.handTotal = curPlayer.doTurnCallback(deck, ...players);
    if (curPlayer.handTotal === GAME_RESULT_PLAYER_BUST) {
      displayOutput(`${curPlayer.name} busts.`);
      return;
    }
  }

  if (playerInfo.handTotal > dealerInfo.handTotal) {
    displayOutput(`${playerInfo.name} wins!`);
  } else if (dealerInfo.handTotal > playerInfo.handTotal) {
    displayOutput(`${dealerInfo.name} wins.`);
  } else {
    displayOutput("It's a tie.");
  }
}

function shouldPlayAgain() {
  let choices = ['no', 'yes'];
  let choice = promptWithChoices('Play again?', choices);
  return choice === choices[1];
}

function playUntilDone() {
  let player = createPlayer('player', PLAYER_TYPE_PLAYER);
  let dealer = createPlayer('dealer', PLAYER_TYPE_DEALER);

  while (true) {
    playTwentyOne(player, dealer);

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
  GAME_RESULT_PLAYER_BUST,
  prompt,
  promptWithChoices,
  getUnambiguousChoice,
  displayOutput,
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
  getHandMinTotal,
  getHandMaxTotal,
  getMaxNonBustedHandTotal,
  getHandCardValues,
  getHandTotals,
  getHandTotal,
  getNonBustedHandTotals,
  isBusted,
};
