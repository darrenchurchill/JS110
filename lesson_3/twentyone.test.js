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
    expect(twentyone.createDeck()).toHaveLength(
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
      expect(filtered).toHaveLength(deck.length / twentyone.SUITS.length);
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

  it('should contain cards with the correct value, according to their name', () => {
    for (let card of twentyone.createDeck()) {
      if (twentyone.FACE_CARDS_SPECIAL.includes(card.name)) {
        expect(card.value).toBe(twentyone.FACE_CARDS_SPECIAL_VALUE);
      } else if (twentyone.FACE_CARDS_REGULAR.includes(card.name)) {
        expect(card.value).toBe(twentyone.FACE_CARDS_REGULAR_VALUE);
      } else {
        expect(card.value).toBe(Number(card.name));
      }
    }
  });

  it('should contain cards with value === altValue, except for special cards', () => {
    for (let card of twentyone.createDeck()) {
      if (twentyone.FACE_CARDS_SPECIAL.includes(card.name)) {
        expect(card.value).toBe(twentyone.FACE_CARDS_SPECIAL_VALUE);
        expect(card.altValue).toBe(twentyone.FACE_CARDS_SPECIAL_ALT_VALUE);
      } else {
        expect(card.value).toBe(card.altValue);
      }
    }
  });
});

describe('test suit initialization', () => {
  it('should have exactly one of each type of card', () => {
    for (let suit of twentyone.SUITS) {
      let cards = twentyone.createSuit(suit);
      for (let card of cards) {
        expect(cards.filter((fCard) => fCard.name === card.name))
          .toHaveLength(1);
      }
    }
  });
});

describe('creating players', () => {
  it('should throw an exception for invalid player types', () => {
    expect(() => {
      twentyone.createPlayer('player name', undefined);
    }).toThrow(RangeError);
    expect(() => {
      twentyone.createPlayer('player name', -1);
    }).toThrow(RangeError);
  });

  it('should have the correct properties', () => {
    let player = twentyone.createPlayer(
      'player name',
      twentyone.PLAYER_TYPE_PLAYER
    );
    expect(player).toHaveProperty('name', 'player name');
    expect(player).toHaveProperty('playerType', twentyone.PLAYER_TYPE_PLAYER);
    expect(player).toHaveProperty('doTurnCallback', twentyone.doPlayerTurn);

    let dealer = twentyone.createPlayer(
      'dealer name',
      twentyone.PLAYER_TYPE_DEALER
    );
    expect(dealer).toHaveProperty('name', 'dealer name');
    expect(dealer).toHaveProperty('playerType', twentyone.PLAYER_TYPE_DEALER);
    expect(dealer).toHaveProperty('doTurnCallback', twentyone.doDealerTurn);
  });
});
