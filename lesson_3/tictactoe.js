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

function* genRows() {
  for (let i = 0; i < NUM_ROWS; i++) {
    yield i;
  }
}

function* genCols() {
  for (let i = 0; i < NUM_COLS; i++) {
    yield i;
  }
}

function* genRowsCols() {
  for (let row of genRows()) {
    for (let col of genCols()) {
      yield [row, col];
    }
  }
}

function initializeBoard() {
  let board = [];

  for (let row of genRows()) {
    board.push([]);

    for (let _ of genCols()) {
      board[row].push(' ');
    }
  }

  return board;
}

function getRowCol(squareNum) {
  squareNum -= 1;

  let row = Math.floor(squareNum / NUM_COLS);
  let col = squareNum % NUM_COLS;

  return [row, col];
}

function getSquare(board, squareNum) {
  let [row, col] = getRowCol(squareNum);
  debugger;
  return board[row][col];
}

function isEmptySquare(board, squareNumOrRowNum, colNum) {
  let square =
    colNum === undefined
      ? getSquare(board, squareNumOrRowNum)
      : board[squareNumOrRowNum][colNum];

  return square === ' ';
}

function isInBounds(squareNum) {
  return squareNum > 0 && squareNum < NUM_ROWS * NUM_COLS;
}

function isValidMove(board, squareNum) {
  return isInBounds(squareNum) && isEmptySquare(board, squareNum);
}

function isBoardFull(board) {
  for (let [row, col] of genRowsCols()) {
    if (isEmptySquare(board, row, col)) return false;
  }
  return true;
}

function markBoard(board, squareNum, mark) {
  let [row, col] = getRowCol(squareNum);
  board[row][col] = mark;
}

function getPlayerSquareChoice(board) {
  while (true) {
    let choice = prompt(`Choose a square (1-${NUM_ROWS * NUM_COLS}):`);
    if (isValidMove(board, choice)) return choice;
    displayOutput('That is an invalid choice. Choose again.');
  }
}

let board = initializeBoard();
displayBoard(board);
let choice = getPlayerSquareChoice(board);
markBoard(board, choice, 'X');
displayBoard(board);
console.log(isBoardFull(board));
