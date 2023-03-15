/**
 * JS110 Lesson 3
 * tictactoe.js
 *
 * Tic Tac Toe
 *
 * A command-line tic tac toe game against the computer
 */
const NUM_ROWS = 3;
const NUM_COLS = 3;
const readline = require('readline-sync');

function prompt(promptText) {
  return readline.questionInt(promptText);
}

function displayOutput(output) {
  console.log(output);
}

function displayBoard(board) {
  // TODO: make this nicer looking
  board.forEach((row) => {
    console.log(row);
  });
}

function* genRowNums() {
  for (let i = 0; i < NUM_ROWS; i++) {
    yield i;
  }
}

function* genColNums() {
  for (let i = 0; i < NUM_COLS; i++) {
    yield i;
  }
}

function* genRowColNums() {
  for (let row of genRowNums()) {
    for (let col of genColNums()) {
      yield [row, col];
    }
  }
}

function* genDiagonalTopLeftToBottomRight() {
  let row = 0;
  let col = 0;

  while (row < NUM_ROWS && col < NUM_COLS) {
    yield [row, col];
    row += 1;
    col += 1;
  }
}

function* genDiagonalTopRightToBottomLeft() {
  let row = 0;
  let col = NUM_COLS - 1;

  while (row < NUM_ROWS && col >= 0) {
    yield [row, col];
    row += 1;
    col -= 1;
  }
}

function initializeBoard() {
  let board = [];

  for (let row of genRowNums()) {
    board.push([]);

    for (let _ of genColNums()) {
      board[row].push(' ');
    }
  }

  return board;
}

/**
 * Given a square number (ex: 1-9 for a 3x3 game), return the board row and
 * column number.
 * @param {*} squareNum The square number, in the user's representation
 * @returns {Array<number>} An array containing the board row and column number
 */
function getRowColNum(squareNum) {
  squareNum -= 1;

  let row = Math.floor(squareNum / NUM_COLS);
  let col = squareNum % NUM_COLS;

  return [row, col];
}

/**
 * Given a row and column number, return the user-representation board square
 * number (ex: 1-9 for a 3x3 game).
 * @param {number} row the board row number
 * @param {number} col the board column number
 * @returns {number} the user-representation square number
 */
function getSquareNum(row, col) {
  let squareNum = 1;
  squareNum += row * NUM_COLS;
  squareNum += col;
  return squareNum;
}

function getSquareContents(board, row, col) {
  return board[row][col];
}

function isEmptySquare(board, row, col) {
  return getSquareContents(board, row, col) === ' ';
}

function isInBounds(row, col) {
  return row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS;
}

function isValidMove(board, row, col) {
  return isInBounds(row, col) && isEmptySquare(board, row, col);
}

function isBoardFull(board) {
  for (let [row, col] of genRowColNums()) {
    if (isEmptySquare(board, row, col)) return false;
  }
  return true;
}

function markBoard(board, row, col, mark) {
  board[row][col] = mark;
}

/**
 * Prompt the user for their next choice and validate their input, re-prompting
 * if necessary.
 * @param {Array<Array<string>>} board the current game board
 * @returns {undefined}
 */
function promptPlayerSquareChoice(board) {
  while (true) {
    let choice = prompt(`Choose a square (1-${NUM_ROWS * NUM_COLS}):`);
    let [choiceRow, choiceCol] = getRowColNum(choice);

    if (isValidMove(board, choiceRow, choiceCol)) return [choiceRow, choiceCol];
    displayOutput('That is an invalid choice. Choose again.');
  }
}

/**
 * Return an array containing the `[row, col]` locations of empty squares on
 * the game board. Returns an empty array if there are no empty squares.
 * @param {Array<Array<string>>} board the current game board
 * @returns {Array<Array<number>>} the `[row, col]` empty square locations
 */
function getEmptySquares(board) {
  let result = [];

  for (let [row, col] of genRowColNums()) {
    if (isEmptySquare(board, row, col)) result.push([row, col]);
  }

  return result;
}

/**
 * Generate the computer's next game choice from the available empty squares.
 * @param {Array<Array<string>>} board the current game board
 * @returns {Array<Array<number>>} the `[row, col]` choice
 */
function getComputerSquareChoice(board) {
  let options = getEmptySquares(board);
  let choice = Math.floor(Math.random() * options.length);
  return options[choice];
}

function doUserTurn(board) {
  displayBoard(board);
  let [choiceRow, choiceCol] = promptPlayerSquareChoice(board);
  markBoard(board, choiceRow, choiceCol, 'X');
}

function doComputerTurn(board) {
  let [choiceRow, choiceCol] = getComputerSquareChoice(board);
  displayOutput(
    `Computer chooses square ${getSquareNum(choiceRow, choiceCol)}.`
  );
  markBoard(board, choiceRow, choiceCol, 'O');
}

/**
 * Inspect an array of adjacent game board squares for a winner.
 * @param {Array<string>} squares An array representing adjacent board squares
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspect(squares) {
  let first = squares[0];
  if (first === ' ') return '';
  return squares.every((square) => square === first) ? first : '';
}

/**
 * Inspect a single game board column for a winner.
 * @param {Array<Array<string>>} board the current game board
 * @param {number} row The row number to inspect
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectRow(board, row) {
  let squares = [...genColNums()].map((col) =>
    getSquareContents(board, row, col)
  );
  return inspect(squares);
}

/**
 * Inspect a single game board column for a winner.
 * @param {Array<Array<string>>} board the current game board
 * @param {number} col The column number to inspect
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectCol(board, col) {
  let squares = [...genRowNums()].map((row) =>
    getSquareContents(board, row, col)
  );
  return inspect(squares);
}

/**
 * Inspect the game board diagonals for a winner.
 * @param {Array<Array<string>>} board the current game board
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectDiagonals(board) {
  let squares = [...genDiagonalTopLeftToBottomRight()].map(([row, col]) =>
    getSquareContents(board, row, col)
  );
  let result = inspect(squares);
  if (result) return result;

  squares = [...genDiagonalTopRightToBottomLeft()].map(([row, col]) =>
    getSquareContents(board, row, col)
  );
  return inspect(squares);
}

/**
 * Inspect the game board for a winner.
 * @param {Array<Array<string>>} board the current game board
 * @returns {string} The game winner's board character. `''` if there is no
 * winner.
 */
function inspectForWinner(board) {
  for (let row of genRowNums()) {
    let result = inspectRow(board, row);
    if (result) return result;
  }

  for (let col of genColNums()) {
    let result = inspectCol(board, col);
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
