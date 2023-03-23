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
const FACE_CARDS_SPECIAL_VALUE = 11;
const FACE_CARDS_SPECIAL_ALT_VALUE = 1;


function createCard(name, suit) {
  let value = Number(name);
  if (FACE_CARDS_REGULAR.includes(name)) value = FACE_CARDS_REGULAR_VALUE;
  else if (FACE_CARDS_SPECIAL.includes(name)) value = FACE_CARDS_SPECIAL_VALUE;

  return {
    name: name,
    value: value,
    altValue: FACE_CARDS_SPECIAL.includes(name)
      ? FACE_CARDS_SPECIAL_ALT_VALUE
      : value,
    suit: suit,
  };
}

function createSuit(suit) {
  let cards = NUMBER_CARDS.concat(FACE_CARDS_REGULAR, FACE_CARDS_SPECIAL);
  return cards.map((card) => createCard(card, suit));
}

function createDeck() {
  return SUITS.flatMap((suit) => createSuit(suit));
}

if (require.main === module) {
  console.log(createDeck());
}

module.exports = {
  NUMBER_CARDS,
  FACE_CARDS_REGULAR,
  FACE_CARDS_SPECIAL,
  SUITS,
  FACE_CARDS_REGULAR_VALUE,
  FACE_CARDS_SPECIAL_VALUE,
  FACE_CARDS_SPECIAL_ALT_VALUE,
  createCard,
  createSuit,
  createDeck,
};
