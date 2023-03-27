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
        expect(card.minValue).toBe(twentyone.FACE_CARDS_SPECIAL_MIN_VALUE);
      } else if (twentyone.FACE_CARDS_REGULAR.includes(card.name)) {
        expect(card.minValue).toBe(twentyone.FACE_CARDS_REGULAR_VALUE);
      } else {
        expect(card.minValue).toBe(Number(card.name));
      }
    }
  });

  it('should contain cards with minValue === maxValue, except for special cards', () => {
    for (let card of deck) {
      if (twentyone.FACE_CARDS_SPECIAL.includes(card.name)) {
        expect(card.minValue).toBe(twentyone.FACE_CARDS_SPECIAL_MIN_VALUE);
        expect(card.maxValue).toBe(twentyone.FACE_CARDS_SPECIAL_MAX_VALUE);
      } else {
        expect(card.minValue).toBe(card.maxValue);
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

describe('test card initialization', () => {
  it('each card should be immutable', () => {
    expect(() => {
      "use strict";
      deck[0].value = -1;
    }).toThrow(TypeError);
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

  it('everyone should be dealt the initial hand size to begin', () => {
    twentyone.dealInitialHands(deck, player, dealer);
    expect(player.playerHand).toHaveLength(twentyone.INITIAL_HAND_SIZE);
    expect(dealer.playerHand).toHaveLength(twentyone.INITIAL_HAND_SIZE);
  });
});

describe('calculating player hand total values', () => {
  beforeEach(() => {
    player.playerHand = [
      twentyone.createCard(twentyone.NUMBER_CARDS[0], twentyone.SUITS[0]),
      twentyone.createCard(twentyone.NUMBER_CARDS[1], twentyone.SUITS[0]),
    ];
  });

  it('min hand value === max hand value when there are no aces', () => {
    expect(twentyone.getHandMinTotalValue(player.playerHand))
      .toBe(twentyone.getHandMaxTotalValue(player.playerHand));
  });

  it('max hand value is larger than min hand value by multiple of # aces', () => {
    let numAces = 0;

    for (let suit of twentyone.SUITS) {
      let ace = twentyone.createCard(twentyone.FACE_CARDS_SPECIAL[0], suit);
      player.playerHand.push(ace);

      numAces += 1;
      let aceDiff = ace.maxValue - ace.minValue;

      expect(
        twentyone.getHandMaxTotalValue(player.playerHand) -
          twentyone.getHandMinTotalValue(player.playerHand)
      ).toBe(aceDiff * numAces);
    }
  });
});