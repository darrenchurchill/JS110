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


function createCard(name, suit) {
  let value = Number(name);
  if (FACE_CARDS_REGULAR.includes(name)) value = 10;
  else if (FACE_CARDS_SPECIAL.includes(name)) value = 11;

  return {
    name: name,
    value: value,
    altValue: FACE_CARDS_SPECIAL.includes(name) ? 1 : value,
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
  createCard,
  createSuit,
  createDeck,
};
