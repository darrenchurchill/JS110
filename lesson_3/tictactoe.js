/**
 * JS110 Lesson 3
 * tictactoe.js
 *
 * Tic Tac Toe
 *
 * A command-line tic tac toe game against the computer
 */
const DEFAULT_BOARD_SIZE = 3;
const DEFAULT_NUM_GAMES_PER_MATCH = 5;
const DEFAULT_MAX_GAMES_PER_MATCH = 7;
const MIN_BOARD_SIZE = 3;
const MAX_BOARD_SIZE = 8;
const GAME_RESULT_TIE = 0;
const GAME_PLAYER_TYPE_USER = 0;
const GAME_PLAYER_TYPE_COMPUTER = 1;
const EMPTY_SQUARE = ' ';
const NO_WINNER = '';
const readline = require('readline-sync');

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

function displayBoard(board) {
  // TODO: make this nicer looking
  for (let i = 0; i < Math.sqrt(board.length); i++) {
    let rowStart = i * Math.sqrt(board.length);
    console.log(getRowSlice(board, rowStart));
  }
}

function* genRowStartIndexes(board) {
  for (let i = 0; i < board.length; i += Math.sqrt(board.length)) {
    yield i;
  }
}

function* genColStartIndexes(board) {
  for (let i = 0; i < Math.sqrt(board.length); i++) {
    yield i;
  }
}

/**
 *
 * @param {Array<string>} board
 * @param {Generator} sliceGenerator
 * @returns
 */
function getBoardSlice(board, sliceGenerator) {
  return [...sliceGenerator].map((idx) => board[idx]);
}

function* genRowIndexes(board, rowStart) {
  for (let i = rowStart; i < rowStart + Math.sqrt(board.length); i++) {
    yield i;
  }
}

function getRowSlice(board, rowStart) {
  return getBoardSlice(board, genRowIndexes(board, rowStart));
}

function* genColIndexes(board, colStart) {
  for (let i = colStart; i < board.length; i += Math.sqrt(board.length)) {
    yield i;
  }
}

function getColSlice(board, colStart) {
  return getBoardSlice(board, genColIndexes(board, colStart));
}

function* genDiagonalIndexesTopLeftToBottomRight(board) {
  let curIdx = 0;

  while (curIdx < board.length) {
    yield curIdx;
    curIdx += Math.sqrt(board.length) + 1;
  }
}

function* genDiagonalIndexesTopRightToBottomLeft(board) {
  let curIdx = Math.sqrt(board.length) - 1;

  while (curIdx < board.length - 1) {
    yield curIdx;
    curIdx += Math.sqrt(board.length) - 1;
  }
}

function initializeBoard(boardSize) {
  let board = [];

  for (let i = 0; i < boardSize ** 2; i++) {
    board[i] = EMPTY_SQUARE;
  }

  return board;
}

/**
 * Given a square number (ex: 1-9 for a 3x3 game), return corresponding board
 * array index.
 * @param {number} squareNum The square number, in the user's representation
 * @returns {number} the board index
 */
function getBoardIndex(squareNum) {
  return squareNum - 1;
}

/**
 * Given a board array index, return the user-representation board square
 * number (ex: 1-9 for a 3x3 game).
 * @param {number} idx the board array index
 * @returns {number} the user-representation square number
 */
function getSquareNum(idx) {
  return idx + 1;
}

function isEmptySquareAt(board, idx) {
  return isEmptySquare(board[idx]);
}

function isEmptySquare(square) {
  return square === EMPTY_SQUARE;
}

function isInBounds(board, idx) {
  return idx >= 0 && idx < board.length;
}

function isValidMove(board, idx) {
  return isInBounds(board, idx) && isEmptySquareAt(board, idx);
}

function isBoardFull(board) {
  return board.every((square) => !isEmptySquare(square));
}

function markBoard(board, idx, mark) {
  board[idx] = mark;
}

/**
 * Return an array's string representation, joining elements with the delimiter
 * string, and inserting the lastWord before the final element.
 * @param {Array} array the array of elements
 * @param {string} delimiter the delimiter string
 * @param {string} lastWord the last word to insert (ex: `'or'` or `'and'`)
 * @returns {string} the joined string
 */
function joinOr(array, delimiter = ', ', lastWord = 'or') {
  if (array.length <= 1) return `${array.join(delimiter)}`;

  let firstSlice = array.slice(0, array.length - 1).join(delimiter);
  let lastElem = array[array.length - 1];

  return `${firstSlice}${delimiter}${lastWord ? `${lastWord} ` : ''}${lastElem}`;
}

/**
 * Prompt the user for their next choice and validate their input, re-prompting
 * if necessary.
 * @param {Array<string>} board the current game board
 * @returns {number} the user's choice
 */
function promptPlayerSquareChoice(board) {
  while (true) {
    let choices = joinOr(
      getEmptySquareIndexes(board).map((idx) => getSquareNum(idx))
    );
    let choice = prompt(`Choose a square (${choices}): `);
    let choiceIdx = getBoardIndex(choice);

    if (isValidMove(board, choiceIdx)) return choiceIdx;
    displayOutput('That is an invalid choice. Choose again.');
  }
}

/**
 * Return an array containing the `[idx]` locations of empty squares on
 * the game board. Returns an empty array if there are no empty squares.
 * @param {Array<string>} board the current game board
 * @returns {<Array<number>} the `[idx,...]` empty square locations
 */
function getEmptySquareIndexes(board) {
  return Object.keys(board)
    .map((squareIdx) => Number(squareIdx))
    .filter((squareIdx) => isEmptySquareAt(board, squareIdx));
}

/**
 * Generate the computer's next game choice from the available empty squares.
 * @param {Array<string>} board the current game board
 * @returns {number} the choice board index
 */
function getComputerSquareChoice(board, playerInfo, otherPlayerInfo) {
  // Offense: Check if there are any squares at risk to the other player.
  let atRiskSquareIdx = findAtRiskSquareIndex(board, playerInfo.mark);
  if (atRiskSquareIdx >= 0) return atRiskSquareIdx;

  // Defense: Check if there are any squares at risk to the computer.
  atRiskSquareIdx = findAtRiskSquareIndex(board, otherPlayerInfo.mark);
  if (atRiskSquareIdx >= 0) return atRiskSquareIdx;

  // Pick middle square if there is a middle square and it's empty
  if (board.length % 2 === 1) {
    let midIdx = Math.floor(board.length / 2);
    if (isEmptySquareAt(board, midIdx)) return midIdx;
  }

  // Otherwise: Just pick randomly.
  let options = getEmptySquareIndexes(board);
  let choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function doUserTurn(board, playerInfo) {
  displayBoard(board);
  let choice = promptPlayerSquareChoice(board);
  console.clear();
  markBoard(board, choice, playerInfo.mark);
  return `${playerInfo.name} chooses square ${getSquareNum(choice)}.`;
}

function sleep(ms) {
  const date = Date.now();
  while (true) {
    let currentDate = Date.now();
    if (currentDate - date > ms) return;
  }
}

function doComputerTurn(board, playerInfo, otherPlayerInfo) {
  displayBoard(board);
  displayOutput(`${playerInfo.name} making their choice...`);
  let choice = getComputerSquareChoice(board, playerInfo, otherPlayerInfo);
  sleep(1000);
  console.clear();
  markBoard(board, choice, playerInfo.mark);
  return `${playerInfo.name} chooses square ${getSquareNum(choice)}.`;
}

/**
 * Inspect an array of adjacent game board squares for a winner.
 * @param {Array<string>} squares An array representing adjacent board squares
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspect(squares) {
  let first = squares[0];
  if (first === EMPTY_SQUARE) return NO_WINNER;
  return squares.every((square) => square === first) ? first : NO_WINNER;
}

/**
 * Inspect a single game board column for a winner.
 * @param {Array<string>} board the current game board
 * @param {number} rowStartIdx The row number to inspect
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectRow(board, rowStartIdx) {
  return inspect(getRowSlice(board, rowStartIdx));
}

/**
 * Inspect a single game board column for a winner.
 * @param {Array<string>} board the current game board
 * @param {number} colStartIdx The column number to inspect
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectCol(board, colStartIdx) {
  return inspect(getColSlice(board, colStartIdx));
}

/**
 * Inspect the game board diagonals for a winner.
 * @param {Array<string>} board the current game board
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectDiagonals(board) {
  let squares = getBoardSlice(
    board,
    genDiagonalIndexesTopLeftToBottomRight(board)
  );

  let result = inspect(squares);
  if (result) return result;

  squares = getBoardSlice(board, genDiagonalIndexesTopRightToBottomLeft(board));

  return inspect(squares);
}

/**
 * Inspect the game board for a winner.
 * @param {Array<string>} board the current game board
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectForWinner(board) {
  for (let rowStartIdx of genRowStartIndexes(board)) {
    let result = inspectRow(board, rowStartIdx);
    if (result) return result;
  }

  for (let colStartIdx of genColStartIndexes(board)) {
    let result = inspectCol(board, colStartIdx);
    if (result) return result;
  }

  return inspectDiagonals(board);
}

function indexOfSingleEmptySquare(board, squareIndexes) {
  let indexesOfEmpties = squareIndexes.filter((squareIdx) =>
    isEmptySquareAt(board, squareIdx)
  );
  if (indexesOfEmpties.length === 1) return indexesOfEmpties[0];

  return -1;
}

function hasOtherPlayerMark(board, squareIndexes, playerMark) {
  return squareIndexes.some(
    (idx) => !isEmptySquareAt(board, idx) && board[idx] !== playerMark
  );
}

function findAtRiskSquareIndexOfIndexSlice(board, squareIndexes, playerMark) {
  if (hasOtherPlayerMark(board, squareIndexes, playerMark)) return -1;
  return indexOfSingleEmptySquare(board, squareIndexes);
}

function findAtRiskSquareIndexOfRow(board, rowStartIdx, playerMark) {
  let squareIndexes = [...genRowIndexes(board, rowStartIdx)];

  if (hasOtherPlayerMark(board, squareIndexes, playerMark)) return -1;

  return indexOfSingleEmptySquare(board, squareIndexes);
}

function findAtRiskSquareIndexOfCol(board, colStartIdx, playerMark) {
  let squareIndexes = [...genColIndexes(board, colStartIdx)];

  if (hasOtherPlayerMark(board, squareIndexes, playerMark)) return -1;

  return indexOfSingleEmptySquare(board, squareIndexes);
}

// eslint-disable-next-line max-lines-per-function
function findAtRiskSquareIndex(board, playerMark) {
  let atRiskSquareIdx = -1;

  for (let rowStartIdx of genRowStartIndexes(board)) {
    atRiskSquareIdx = findAtRiskSquareIndexOfRow(
      board,
      rowStartIdx,
      playerMark
    );
    if (atRiskSquareIdx >= 0) return atRiskSquareIdx;
  }

  for (let colStartIdx of genColStartIndexes(board)) {
    atRiskSquareIdx = findAtRiskSquareIndexOfCol(
      board,
      colStartIdx,
      playerMark
    );
    if (atRiskSquareIdx >= 0) return atRiskSquareIdx;
  }

  atRiskSquareIdx = findAtRiskSquareIndexOfIndexSlice(
    board,
    [...genDiagonalIndexesTopLeftToBottomRight(board)],
    playerMark
  );
  if (atRiskSquareIdx >= 0) return atRiskSquareIdx;

  return findAtRiskSquareIndexOfIndexSlice(
    board,
    [...genDiagonalIndexesTopRightToBottomLeft(board)],
    playerMark
  );
}

function getWinner(winnerMark, player1, player2) {
  return winnerMark === player1.mark ? player1 : player2;
}

function displayWinnerResult(board, winner) {
  displayOutput('We have a winner!!!');
  displayBoard(board);
  displayOutput(`${winner.name} wins!!!`);
  readline.question('Press enter to continue.');
}

function displayTieResult(board) {
  displayOutput("It's a tie.");
  displayBoard(board);
  readline.question('Press enter to continue.');
}

// eslint-disable-next-line max-lines-per-function, max-statements
function playTicTacToe(
  boardSize,
  player1,
  player2,
  gameHeader = 'Tic Tac Toe!'
) {
  let board = initializeBoard(boardSize);
  let curPlayer = player1;
  let otherPlayer = player2;
  let gameSubheader = `${curPlayer.name} goes first!`;

  displayOutput(`${gameHeader}\n`);
  displayOutput(gameSubheader);

  while (true) {
    gameSubheader = curPlayer.gameChoiceCallback(board, curPlayer, otherPlayer);
    let curResult = inspectForWinner(board);

    if (curResult) {
      let winner = getWinner(curResult, player1, player2);
      displayOutput(`${gameHeader}\n`);
      displayWinnerResult(board, winner);
      return winner === player1 ? player1 : player2;
    }

    if (isBoardFull(board)) {
      displayOutput(`${gameHeader}\n`);
      displayTieResult(board);
      return GAME_RESULT_TIE;
    }

    [curPlayer, otherPlayer] =
      curPlayer === player1 ? [player2, player1] : [player1, player2];

    displayOutput(`${gameHeader}\n`);
    displayOutput(gameSubheader);
  }
}

function shouldPlayAgain() {
  let choices = ['no', 'yes'];
  let choice = promptWithChoices('Play again?', choices);
  return choice === choices[1];
}

function matchScoreHeader(player1, player2) {
  return (
    `###### Match Score: ` +
    `${player1.name}: ${player1.numWins} ` +
    `${player2.name}: ${player2.numWins} ` +
    '######'
  );
}

function displayMatchWinner(winnerInfo) {
  displayOutput('!!!!!! We have a Match Winner !!!!!!');
  displayOutput(`${winnerInfo.name} wins the match!!!\n`);
}

// eslint-disable-next-line max-lines-per-function, max-statements
function playMatch(matchSize = 5, boardSize, player1, player2) {
  let player1NumWinsOrig = player1.numWins;
  let player2NumWinsOrig = player2.numWins;
  player1.numWins = 0;
  player2.numWins = 0;
  let curOrder = [player1, player2];
  let matchWinner = null;

  while (!matchWinner) {
    console.clear();
    let gameWinner = playTicTacToe(
      boardSize,
      ...curOrder,
      matchScoreHeader(player1, player2)
    );

    if (gameWinner === GAME_RESULT_TIE) continue;

    gameWinner.numWins += 1;
    curOrder = gameWinner === player1 ? [player2, player1] : [player1, player2];
    if (gameWinner.numWins === matchSize) matchWinner = gameWinner;
  }

  matchScoreHeader(player1, player2);
  displayMatchWinner(matchWinner);

  player1.numWins = player1NumWinsOrig;
  player2.numWins = player2NumWinsOrig;
}

function genIntegerChoicesList(minChoice, maxChoice, defaultChoice) {
  let choices = [...Array(maxChoice).keys()].map((el) => String(el + 1));
  choices = choices.slice(choices.indexOf(`${minChoice}`));
  return choices.splice(choices.indexOf(`${defaultChoice}`), 1).concat(choices);
}

function promptBoardSize(defaultSize = DEFAULT_BOARD_SIZE) {
  let choices = genIntegerChoicesList(
    MIN_BOARD_SIZE,
    MAX_BOARD_SIZE,
    defaultSize
  );
  return promptWithChoices('How wide should the board be?', choices);
}

function promptNumGamesPerMatch(defaultNumGames = DEFAULT_NUM_GAMES_PER_MATCH) {
  let choices = genIntegerChoicesList(
    1,
    DEFAULT_MAX_GAMES_PER_MATCH,
    defaultNumGames
  );
  return promptWithChoices(
    'How many games per match would you like to play?',
    choices
  );
}

/**
 *
 * @param {string} mark
 * @param {string} otherUserMark
 * @returns {boolean}
 */
function isValidUserMark(mark, otherUserMark) {
  return mark.length === 1 && !otherUserMark.includes(mark);
}

/**
 *
 * @param {string} otherUserMark
 */
function getDefaultUserMark(otherUserMark) {
  if (otherUserMark === '' || otherUserMark === 'O') return 'X';
  return 'O';
}

function promptUserMark(otherUserMark) {
  let defaultUserMark = getDefaultUserMark(otherUserMark);
  let mark;

  while (true) {
    mark = readline.question(`User board mark? [${defaultUserMark}]: `);
    if (mark === '' || isValidUserMark(mark, otherUserMark)) break;

    displayOutput('That is an invalid user board mark.');
    displayOutput("Must be 1 character, and NOT the other player's mark.");
  }
  return mark ? mark : defaultUserMark;
}

function promptUserName(defaultName) {
  let name = readline.question(`User name? [${defaultName}]: `);

  return name ? name : defaultName;
}

function promptUserType(defaultUserType = GAME_PLAYER_TYPE_USER) {
  let otherUserType;
  let choices = ['user', 'computer'];

  if (defaultUserType === GAME_PLAYER_TYPE_USER) {
    otherUserType = GAME_PLAYER_TYPE_COMPUTER;
  } else {
    otherUserType = GAME_PLAYER_TYPE_USER;
    choices = [choices[1], choices[0]];
  }

  let type = promptWithChoices('User type?', choices);

  return type === choices[0] ? defaultUserType : otherUserType;
}

function promptConfigureUser(userNum, defaultUserType, otherUser) {
  let user = {};
  let defaultName = `User ${userNum}`;

  displayOutput(`User ${userNum} Setup:`);

  user.name = promptUserName(defaultName);

  let otherUserMark = otherUser ? otherUser.mark : '';
  user.mark = promptUserMark(otherUserMark);

  let userType = promptUserType(defaultUserType);
  if (userType === GAME_PLAYER_TYPE_USER) {
    user.gameChoiceCallback = doUserTurn;
  } else if (userType === GAME_PLAYER_TYPE_COMPUTER) {
    user.gameChoiceCallback = doComputerTurn;
  }

  return user;
}

function promptPlayerOrder(player1, player2) {
  let choices = [player1.name, player2.name, 'random'];
  let choice = promptWithChoices(
    'Which player should go first?',
    choices
  );

  if (choice === choices[0]) return [player1, player2];
  if (choice === choices[1]) return [player2, player1];

  return Math.floor(Math.random() * 2) === 0
    ? [player1, player2]
    : [player2, player1];
}

function promptConfigureGame() {
  // TODO: add board size to this configuration prompt
  // TODO: add match number of games to this configuration prompt
  let boardSize = promptBoardSize(DEFAULT_BOARD_SIZE);
  let numGamesPerMatch = promptNumGamesPerMatch(DEFAULT_NUM_GAMES_PER_MATCH);

  let player1 = promptConfigureUser(1, GAME_PLAYER_TYPE_USER);
  let player2 = promptConfigureUser(2, GAME_PLAYER_TYPE_COMPUTER, player1);

  [player1, player2] = promptPlayerOrder(player1, player2);

  return {
    numGamesPerMatch: numGamesPerMatch,
    boardSize: boardSize,
    players: [player1, player2],
  };
}

function play() {
  console.clear();
  let game = promptConfigureGame();

  while (true) {
    playMatch(game.numGamesPerMatch, game.boardSize, ...game.players);

    if (!shouldPlayAgain()) return;
  }
}

play();
