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

describe('test getting an unambiguous choice from a list of choices', () => {
  let choices;

  beforeEach(() => {
    choices = ['hit', 'stay'];
  });

  it("should return '' when there is no match", () => {
    expect(twentyone.getUnambiguousChoice(choices, '')).toBe('');
    expect(twentyone.getUnambiguousChoice(choices, 'zebra')).toBe('');
    expect(twentyone.getUnambiguousChoice(choices, 'hite')).toBe('');
    expect(twentyone.getUnambiguousChoice(choices, 'stays')).toBe('');
  });

  it('should be case-insensitive', () => {
    expect(twentyone.getUnambiguousChoice(choices, 'Hit')).toBe('hit');
    expect(twentyone.getUnambiguousChoice(choices, 'HiT')).toBe('hit');
    expect(twentyone.getUnambiguousChoice(choices, 'STay')).toBe('stay');
    expect(twentyone.getUnambiguousChoice(choices, 'stAy')).toBe('stay');
  });

  it('should match partial words when there is only one match', () => {
    expect(twentyone.getUnambiguousChoice(choices, 'H')).toBe('hit');
    expect(twentyone.getUnambiguousChoice(choices, 'st')).toBe('stay');
  });

  describe('when one choice is a substring of another choice', () => {
    beforeEach(() => {
      choices = ['yellow', 'yell'];
    });

    it('should NOT match partial words when there is more than one match', () => {
      expect(twentyone.getUnambiguousChoice(choices, 'yel')).toBe('');
      expect(twentyone.getUnambiguousChoice(choices, 'yello')).toBe('yellow');
      expect(twentyone.getUnambiguousChoice(choices, 'yEllo')).toBe('yellow');
    });

    it('should match whole words when one choice is a substring of another', () => {
      expect(twentyone.getUnambiguousChoice(choices, 'yell')).toBe('yell');
      expect(twentyone.getUnambiguousChoice(choices, 'yellow')).toBe('yellow');
    });
  });
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

describe('calculating player hands', () => {
  beforeEach(() => {
    player.playerHand = [
      twentyone.createCard(twentyone.NUMBER_CARDS[0], twentyone.SUITS[0]),
      twentyone.createCard(twentyone.NUMBER_CARDS[1], twentyone.SUITS[0]),
    ];
  });

  describe('player hand card values', () => {
    describe('when there are no aces', () => {
      it('there is only one possible set of card values', () => {
        expect(twentyone.getHandCardValues(player.playerHand)).toHaveLength(1);
      });

      it('should have the correct card values, in the same order as cards of hand', () => {
        expect(twentyone.getHandCardValues(player.playerHand))
          .toEqual([[2, 3]]);
      });
    });

    describe('when there is one ace', () => {
      beforeEach(() => {
        player.playerHand = [
          twentyone.createCard('7', twentyone.SUITS[0]),
          twentyone.createCard('ace', twentyone.SUITS[0]),
        ];
      });

      it('there are two possible sets of card values', () => {
        expect(twentyone.getHandCardValues(player.playerHand)).toHaveLength(2);
      });

      it('should have the correct card values, in the same order as cards of hand', () => {
        expect(twentyone.getHandCardValues(player.playerHand))
          .toEqual([[7, 1], [7, 11]]);
      });
    });

    describe('when there are two or more aces', () => {
      beforeEach(() => {
        player.playerHand = [
          twentyone.createCard('10', twentyone.SUITS[0]),
          twentyone.createCard('ace', twentyone.SUITS[0]),
          twentyone.createCard('ace', twentyone.SUITS[1]),
        ];
      });

      it('there are two possible sets of card values', () => {
        expect(twentyone.getHandCardValues(player.playerHand)).toHaveLength(2);
      });

      it('should have the correct card values, in the same order as cards of hand', () => {
        expect(twentyone.getHandCardValues(player.playerHand))
          .toEqual([[10, 1, 1], [10, 11, 1]]);

        player.playerHand.push(
          twentyone.createCard('ace', twentyone.SUITS[2]),
        );
        expect(twentyone.getHandCardValues(player.playerHand))
          .toEqual([[10, 1, 1, 1], [10, 11, 1, 1]]);
      });
    });
  });

  describe('player hand total values', () => {
    describe('when there are no aces', () => {
      it('min hand value === max hand value', () => {
        expect(twentyone.getHandMinTotal(player.playerHand))
          .toBe(twentyone.getHandMaxTotal(player.playerHand));
      });

      it('there is only one possible total hand value', () => {
        expect(twentyone.getHandTotals(player.playerHand)).toHaveLength(1);
      });
    });

    describe('when there are one or more aces', () => {
      it('there are (numAces + 1) possible total hand values', () => {
        let count = 0;
        for (let suit of twentyone.SUITS) {
          player.playerHand.push(
            twentyone.createCard(twentyone.FACE_CARDS_SPECIAL[0], suit)
          );
          count += 1;
          expect(twentyone.getHandTotals(player.playerHand))
            .toHaveLength(count + 1);
        }
      });
    });

    it('max hand value is larger than min hand value by multiple of # aces', () => {
      let numAces = 0;

      for (let suit of twentyone.SUITS) {
        let ace = twentyone.createCard(twentyone.FACE_CARDS_SPECIAL[0], suit);
        player.playerHand.push(ace);

        numAces += 1;
        let aceDiff = ace.maxValue - ace.minValue;

        expect(
          twentyone.getHandMaxTotal(player.playerHand) -
            twentyone.getHandMinTotal(player.playerHand)
        ).toBe(aceDiff * numAces);
      }
    });

    it('max hand value === final value in hand total values', () => {
      for (let suit of twentyone.SUITS) {
        player.playerHand.push(
          twentyone.createCard(twentyone.FACE_CARDS_SPECIAL[0], suit)
        );
      }
      expect(twentyone.getHandMaxTotal(player.playerHand))
        .toBe(twentyone.getHandTotals(player.playerHand).at(-1));
    });
  });
});

describe('calculating non-busting hand values', () => {
  beforeEach(() => {
    player.playerHand = [
      twentyone.createCard(twentyone.NUMBER_CARDS[0], twentyone.SUITS[0]),
      twentyone.createCard(twentyone.NUMBER_CARDS[1], twentyone.SUITS[0]),
    ];
  });

  describe('when there are no aces', () => {
    it('there is only one possible total hand value', () => {
      expect(twentyone.getNonBustedHandTotals(player.playerHand))
        .toHaveLength(1);
    });
  });

  describe('when there are one or more aces', () => {
    it('there are two possible total hand values', () => {
      for (let suit of twentyone.SUITS) {
        player.playerHand.push(
          twentyone.createCard(twentyone.FACE_CARDS_SPECIAL[0], suit)
        );
        expect(twentyone.getNonBustedHandTotals(player.playerHand))
          .toHaveLength(2);
      }
    });
  });

  it('should calculate the correct hand values', () => {
    player.playerHand = [
      twentyone.createCard('jack', twentyone.SUITS[0]),
      twentyone.createCard('ace', twentyone.SUITS[0]),
    ];
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(0))
      .toBe(11);
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(-1))
      .toBe(twentyone.GAME_OBJECT_VALUE);

    player.playerHand = [
      twentyone.createCard('2', twentyone.SUITS[0]),
      twentyone.createCard('3', twentyone.SUITS[0]),
      twentyone.createCard('jack', twentyone.SUITS[0]),
    ];
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(0))
      .toBe(15);
  });

  it('max hand total is <= GAME_OBJECT_VALUE', () => {
    player.playerHand = [
      twentyone.createCard('jack', twentyone.SUITS[0]),
      twentyone.createCard('ace', twentyone.SUITS[0]),
    ];
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(-1))
      .toBeLessThanOrEqual(twentyone.GAME_OBJECT_VALUE);

    player.playerHand.push(
      twentyone.createCard('queen', twentyone.SUITS[0]),
    );
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(-1))
      .toBeLessThanOrEqual(twentyone.GAME_OBJECT_VALUE);

    player.playerHand = [
      twentyone.createCard('2', twentyone.SUITS[0]),
      twentyone.createCard('3', twentyone.SUITS[0]),
      twentyone.createCard('jack', twentyone.SUITS[0]),
    ];
    expect(twentyone.getNonBustedHandTotals(player.playerHand).at(-1))
      .toBeLessThanOrEqual(twentyone.GAME_OBJECT_VALUE);
  });

  it('busted hand has zero possible total hand values', () => {
    player.playerHand = [
      twentyone.createCard('jack', twentyone.SUITS[0]),
      twentyone.createCard('queen', twentyone.SUITS[0]),
      twentyone.createCard('2', twentyone.SUITS[0]),
    ];
    expect(twentyone.getNonBustedHandTotals(player.playerHand)).toHaveLength(0);
  });
});

describe('doing the dealer turn', () => {
  describe('should hit until hand total >= DEALER_STAY_VALUE', () => {
    it('should stay at hand total === DEALER_STAY_VALUE', () => {
      dealer.playerHand = [
        twentyone.createCard('5', twentyone.SUITS[0]),
        twentyone.createCard('2', twentyone.SUITS[0]),
      ];
      deck = [
        twentyone.createCard('10', twentyone.SUITS[0]),
        twentyone.createCard('2', twentyone.SUITS[0]),
      ];
      expect(twentyone.doDealerTurn(deck, dealer))
        .toBe(twentyone.DEALER_STAY_VALUE);

      dealer.playerHand = [
        twentyone.createCard('jack', twentyone.SUITS[0]),
        twentyone.createCard('7', twentyone.SUITS[0]),
      ];
      deck = [
        twentyone.createCard('2', twentyone.SUITS[0]),
        twentyone.createCard('10', twentyone.SUITS[0]),
      ];
      expect(twentyone.doDealerTurn(deck, dealer))
        .toBe(twentyone.DEALER_STAY_VALUE);

    });

    it('should hit when hand total === DEALER_STAY_VALUE - 1', () => {
      dealer.playerHand = [
        twentyone.createCard('10', twentyone.SUITS[0]),
        twentyone.createCard('6', twentyone.SUITS[0]),
      ];
      deck = [
        twentyone.createCard('2', twentyone.SUITS[0]),
        twentyone.createCard('10', twentyone.SUITS[0]),
      ];
      expect(twentyone.doDealerTurn(deck, dealer))
        .toBeGreaterThan(twentyone.DEALER_STAY_VALUE);

      dealer.playerHand = [
        twentyone.createCard('7', twentyone.SUITS[0]),
        twentyone.createCard('3', twentyone.SUITS[0]),
      ];
      deck = [
        twentyone.createCard('6', twentyone.SUITS[0]),
        twentyone.createCard('2', twentyone.SUITS[0]),
      ];
      expect(twentyone.doDealerTurn(deck, dealer))
        .toBeGreaterThan(twentyone.DEALER_STAY_VALUE);
    });

    it('should stay when hand total > DEALER_STAY_VALUE', () => {
      dealer.playerHand = [
        twentyone.createCard('10', twentyone.SUITS[0]),
        twentyone.createCard('jack', twentyone.SUITS[0]),
      ];
      deck = [
        twentyone.createCard('10', twentyone.SUITS[0]),
      ];
      expect(twentyone.doDealerTurn(deck, dealer))
        .toBeGreaterThan(twentyone.DEALER_STAY_VALUE);
    });
  });

  it('dealer bust returns GAME_RESULT_PLAYER_BUST', () => {
    dealer.playerHand = [
      twentyone.createCard('7', twentyone.SUITS[0]),
      twentyone.createCard('3', twentyone.SUITS[0]),
    ];
    deck = [
      twentyone.createCard('6', twentyone.SUITS[0]),
      twentyone.createCard('6', twentyone.SUITS[0]),
    ];
    expect(twentyone.doDealerTurn(deck, dealer))
      .toBe(twentyone.GAME_RESULT_PLAYER_BUST);
  });
});