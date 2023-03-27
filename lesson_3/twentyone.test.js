/* eslint-disable max-lines-per-function */
/**
 * JS110 Lesson 3
 * twentyone.test.js
 *
 * Tests for twenty one game.
 */

const twentyone = require('./twentyone');

let deck;
let player;
let dealer;

beforeEach(() => {
  deck = twentyone.createDeck();

  player = twentyone.createPlayer(
    'test player',
    twentyone.PLAYER_TYPE_PLAYER
  );

  dealer = twentyone.createPlayer(
    'test dealer',
    twentyone.PLAYER_TYPE_DEALER
  );
});

describe('test deck initialization', () => {
  it('should have the correct total number of cards', () => {
    expect(deck).toHaveLength(
      (twentyone.NUMBER_CARDS.length
        + twentyone.FACE_CARDS_REGULAR.length
        + twentyone.FACE_CARDS_SPECIAL.length)
      * twentyone.SUITS.length
    );
  });

  it('should have equal number of cards for each suit', () => {
    twentyone.SUITS.forEach((suit) => {
      let filtered = deck.filter((card) => card.suit === suit);
      expect(filtered).toHaveLength(deck.length / twentyone.SUITS.length);
    });
  });

  it('should have equal number of each type/name of card', () => {
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
    for (let card of deck) {
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
    for (let card of deck) {
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
    expect(player).toHaveProperty('name', 'test player');
    expect(player).toHaveProperty('playerType', twentyone.PLAYER_TYPE_PLAYER);
    expect(player).toHaveProperty('playerHand', []);
    expect(player).toHaveProperty('doTurnCallback', twentyone.doPlayerTurn);

    expect(dealer).toHaveProperty('name', 'test dealer');
    expect(dealer).toHaveProperty('playerType', twentyone.PLAYER_TYPE_DEALER);
    expect(dealer).toHaveProperty('playerHand', []);
    expect(dealer).toHaveProperty('doTurnCallback', twentyone.doDealerTurn);
  });
});

describe('dealing cards', () => {
  it('dealing a card should reduce deck size and increase player hand size', () => {
    let playerHandSizeOrig = player.playerHand.length;

    let deck = twentyone.createDeck();
    let deckSizeOrig = deck.length;

    twentyone.dealCard(deck, player);
    expect(player.playerHand).toHaveLength(playerHandSizeOrig + 1);
    expect(deck).toHaveLength(deckSizeOrig - 1);
  });
});