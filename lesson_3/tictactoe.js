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

function getSquare(board, row, col) {
  return board[row][col];
}

function isEmptySquare(board, row, col) {
  return getSquare(board, row, col) === ' ';
}

function isInBounds(row, col) {
  return row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS;
}

function isValidMove(board, row, col) {
  return isInBounds(row, col) && isEmptySquare(board, row, col);
}

function isBoardFull(board) {
  for (let [row, col] of genRowsCols()) {
    if (isEmptySquare(board, row, col)) return false;
  }
  return true;
}

function markBoard(board, row, col, mark) {
  board[row][col] = mark;
}

function getPlayerSquareChoice(board) {
  while (true) {
    let choice = prompt(`Choose a square (1-${NUM_ROWS * NUM_COLS}):`);
    let [choiceRow, choiceCol] = getRowCol(choice);

    if (isValidMove(board, choiceRow, choiceCol)) return [choiceRow, choiceCol];
    displayOutput('That is an invalid choice. Choose again.');
  }
}

let board = initializeBoard();
displayBoard(board);
let [choiceRow, choiceCol] = getPlayerSquareChoice(board);
markBoard(board, choiceRow, choiceCol, 'X');
displayBoard(board);
console.log(isBoardFull(board));
