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

function getRowColNum(squareNum) {
  squareNum -= 1;

  let row = Math.floor(squareNum / NUM_COLS);
  let col = squareNum % NUM_COLS;

  return [row, col];
}

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

function promptPlayerSquareChoice(board) {
  while (true) {
    let choice = prompt(`Choose a square (1-${NUM_ROWS * NUM_COLS}):`);
    let [choiceRow, choiceCol] = getRowColNum(choice);

    if (isValidMove(board, choiceRow, choiceCol)) return [choiceRow, choiceCol];
    displayOutput('That is an invalid choice. Choose again.');
  }
}

function getEmptySquares(board) {
  let result = [];

  for (let [row, col] of genRowColNums()) {
    if (isEmptySquare(board, row, col)) result.push([row, col]);
  }

  return result;
}

function getComputerSquareChoice(board) {
  let empty = getEmptySquares(board);
  let choice = Math.floor(Math.random() * empty.length);
  return empty[choice];
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

function inspect(squares) {
  let first = squares[0];
  if (first === ' ') return '';
  return squares.every((square) => square === first) ? first : '';
}

function inspectRow(board, row) {
  let squares = [...genColNums()].map((col) =>
    getSquareContents(board, row, col)
  );
  return inspect(squares);
}

function inspectCol(board, col) {
  let squares = [...genRowNums()].map((row) =>
    getSquareContents(board, row, col)
  );
  return inspect(squares);
}

function inspectDiagonals(board) {
  let squares = [...genDiagonalTopLeftToBottomRight()].map(
    ([row, col]) => getSquareContents(board, row, col)
  );
  let result = inspect(squares);
  if (result) return result;

  squares = [...genDiagonalTopRightToBottomLeft()].map(
    ([row, col]) => getSquareContents(board, row, col)
  );
  return inspect(squares);
}

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

    if (isBoardFull(board)) {
      displayOutput("It's a tie.");
      displayBoard(board);
      return;
    }

    let curResult = inspectForWinner(board);
    if (curResult) {
      displayOutput('We have a winner!!!');
      displayBoard(board);
      displayOutput(`${curResult} wins!!!`);
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
