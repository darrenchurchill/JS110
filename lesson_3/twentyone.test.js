/* eslint-disable max-lines-per-function */
/**
 * JS110 Lesson 3
 * twentyone.test.js
 *
 * Tests for twenty one game.
 */

const twentyone = require('./twentyone');


describe('test deck initialization', () => {
  it('should have the correct total number of cards', () => {
    expect(twentyone.createDeck().length).toBe(
      (twentyone.NUMBER_CARDS.length
        + twentyone.FACE_CARDS_REGULAR.length
        + twentyone.FACE_CARDS_SPECIAL.length)
      * twentyone.SUITS.length
    );
  });

  it('should have equal number of cards for each suit', () => {
    let deck = twentyone.createDeck();
    twentyone.SUITS.forEach((suit) => {
      let filtered = deck.filter((card) => card.suit === suit);
      expect(filtered.length).toBe(deck.length / twentyone.SUITS.length);
    });
  });

  it('should have equal number of each type/name of card', () => {
    let deck = twentyone.createDeck();
    let cardNames = twentyone.NUMBER_CARDS.concat(
      twentyone.FACE_CARDS_REGULAR,
      twentyone.FACE_CARDS_SPECIAL
    );

    let numOfEachType = [];
    cardNames.forEach((name) => {
      numOfEachType.push({
        name: name,
        num: deck.filter((card) => card.name === name).length
      });
    });

    let first = numOfEachType[0];
    numOfEachType.forEach((count) => {
      expect(count.num).toBe(first.num);
    });
  });
});

describe('test suit initialization', () => {
  it('should have exactly one of each type of card', () => {
    for (let suit of twentyone.SUITS) {
      let cards = twentyone.createSuit(suit);
      for (let card of cards) {
        expect(cards.filter((fCard) => fCard.name === card.name).length)
          .toBe(1);
      }
    }
  });
});
