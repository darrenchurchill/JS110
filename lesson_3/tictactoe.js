/**
 * JS110 Lesson 3
 * tictactoe.js
 *
 * Tic Tac Toe
 *
 * A command-line tic tac toe game against the computer
 */
const BOARD_SIZE = 3;
const EMPTY_SQUARE = ' ';
const NO_WINNER = '';
const readline = require('readline-sync');

function prompt(promptText) {
  return readline.questionInt(promptText);
}

function displayOutput(output) {
  console.log(output);
}

function displayBoard(board) {
  // TODO: make this nicer looking
  for (let i = 0; i < BOARD_SIZE; i++) {
    let rowStart = i * BOARD_SIZE;
    console.log(getRowSlice(board, rowStart));
  }
}

function* genRowStartIndexes() {
  for (let i = 0; i < BOARD_SIZE ** 2; i += BOARD_SIZE) {
    yield i;
  }
}

function* genColStartIndexes() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    yield i;
  }
}

function getRowSlice(board, rowStart) {
  return board.slice(rowStart, rowStart + BOARD_SIZE);
}

function* genColIndexes(colStart) {
  for (let i = colStart; i < BOARD_SIZE ** 2; i += BOARD_SIZE) {
    yield i;
  }
}

function getColSlice(board, colStart) {
  let col = [];
  for (let colIdx of genColIndexes(colStart)) {
    col.push(board[colIdx]);
  }
  return col;
}

function* genDiagonalIndexesTopLeftToBottomRight() {
  let curIdx = 0;

  while (curIdx < BOARD_SIZE ** 2) {
    yield curIdx;
    curIdx += BOARD_SIZE + 1;
  }
}

function* genDiagonalIndexesTopRightToBottomLeft() {
  let curIdx = BOARD_SIZE - 1;

  while (curIdx < BOARD_SIZE ** 2) {
    yield curIdx;
    curIdx += BOARD_SIZE - 1;
  }
}

function initializeBoard() {
  let board = [];

  for (let i = 0; i < BOARD_SIZE ** 2; i++) {
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

function isInBounds(idx) {
  return idx >= 0 && idx < BOARD_SIZE ** 2;
}

function isValidMove(board, idx) {
  return isInBounds(idx) && isEmptySquareAt(board, idx);
}

function isBoardFull(board) {
  return board.every((square) => isEmptySquare(square));
}

function markBoard(board, idx, mark) {
  board[idx] = mark;
}

/**
 * Prompt the user for their next choice and validate their input, re-prompting
 * if necessary.
 * @param {Array<string>} board the current game board
 * @returns {number} the user's choice
 */
function promptPlayerSquareChoice(board) {
  // TODO: change the prompt output to show only the available valid choices
  while (true) {
    let choice = prompt(`Choose a square (1-${BOARD_SIZE * BOARD_SIZE}):`);
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
function getComputerSquareChoice(board) {
  let options = getEmptySquareIndexes(board);
  let choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function doUserTurn(board) {
  displayBoard(board);
  let choice = promptPlayerSquareChoice(board);
  markBoard(board, choice, 'X');
}

function doComputerTurn(board) {
  let choice = getComputerSquareChoice(board);
  displayOutput(
    `Computer chooses square ${getSquareNum(choice)}.`
  );
  markBoard(board, choice, 'O');
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
  let squares = [...genDiagonalIndexesTopLeftToBottomRight()].map((idx) =>
    board[idx]
  );
  let result = inspect(squares);
  if (result) return result;

  squares = [...genDiagonalIndexesTopRightToBottomLeft()].map((idx) =>
    board[idx]
  );
  return inspect(squares);
}

/**
 * Inspect the game board for a winner.
 * @param {Array<string>} board the current game board
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectForWinner(board) {
  for (let rowStartIdx of genRowStartIndexes()) {
    let result = inspectRow(board, rowStartIdx);
    if (result) return result;
  }

  for (let colStartIdx of genColStartIndexes()) {
    let result = inspectCol(board, colStartIdx);
    if (result) return result;
  }

  return inspectDiagonals(board);
}

// eslint-disable-next-line max-lines-per-function, max-statements
function playTicTacToe() {
  let board = initializeBoard();
  const USER_TURN = 0;
  const COMPUTER_TURN = 1;
  let curTurn = USER_TURN;
  // TODO: add variables for the user and computer markers
  // TODO: let user choose their marker

  while (true) {
    if (curTurn === USER_TURN) {
      doUserTurn(board);
      curTurn = COMPUTER_TURN;
    } else if (curTurn === COMPUTER_TURN) {
      doComputerTurn(board);
      curTurn = USER_TURN;
    }

    let curResult = inspectForWinner(board);
    if (curResult) {
      displayOutput('We have a winner!!!');
      displayBoard(board);
      displayOutput(`${curResult} wins!!!`);
      return;
    }

    if (isBoardFull(board)) {
      displayOutput("It's a tie.");
      displayBoard(board);
      return;
    }
  }
}

function shouldPlayAgain() {
  let input = readline.question('Play Again? [yN] ');
  return input.toLowerCase() === 'y';
}

function playRounds() {
  while (true) {
    playTicTacToe();
    if (!shouldPlayAgain()) return;
  }
}

playRounds();
