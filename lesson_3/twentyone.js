/**
 * JS110 Lesson 3
 * twentyone.js
 *
 * Twenty-One
 *
 * A command-line game of Twenty-One (simplified BlackJack)
 *
 */

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

function doPlayerTurn(playerInfo) {

}

function doDealerTurn(dealerInfo) {

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

function getHandMinTotalValue(playerHand) {
  return playerHand.reduce((accum, card) => accum + card.minValue, 0);
}

function getHandMaxTotalValue(playerHand) {
  return playerHand.reduce((accum, card) => accum + card.maxValue, 0);
}

function getHandTotals(playerHand) {
  let normalCards = playerHand.filter((card) =>
    NUMBER_CARDS.includes(card.name) || FACE_CARDS_REGULAR.includes(card.name)
  );
  let specialCards = playerHand.filter((card) =>
    FACE_CARDS_SPECIAL.includes(card.name)
  );
  let totalValues = [
    normalCards.reduce((accum, card) => accum + card.minValue, 0),
  ];

  for (let card of specialCards) {
    let lastVal = totalValues.at(-1);
    totalValues = totalValues.map((val) => val + card.minValue);
    totalValues.push(lastVal + card.maxValue);
  }

  return totalValues;
}

if (require.main === module) {
  console.log(shuffle(createDeck()));
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
  createCard,
  createSuit,
  createDeck,
  shuffle,
  doPlayerTurn,
  doDealerTurn,
  dealCard,
  dealInitialHands,
  createPlayer,
  getHandMinTotalValue,
  getHandMaxTotalValue,
  getHandTotals,
};
