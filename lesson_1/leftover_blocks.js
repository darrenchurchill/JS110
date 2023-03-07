/**
 * You have a number of building blocks that can be used to build a valid
 * structure.  There are certain rules about what determines a structure's
 * validity.
 *
 * - The building blocks are cubes
 * - The structure is built in layers
 * - The top layer is a single block
 * - A block in an upper layer must be supported by four blocks in a lower layer
 * - A block in a lower layer can support more than one block in an upper layer
 * - You cannot leave gaps between blocks
 *
 * Write a program that, given a specific number of cubes, calculates the number
 * of blocks left over after building the tallest possible structure.
 */

function calculateLeftoverBlocks(numBlocks) {
  let curLayer = 1;
  let blocksRemaining = numBlocks;
  let blocksNeeded = curLayer ** 2;

  while (blocksNeeded <= blocksRemaining) {
    blocksRemaining -= blocksNeeded;
    curLayer += 1;
    blocksNeeded = curLayer ** 2;
  }

  return blocksRemaining;
}


// Test cases:
console.log(calculateLeftoverBlocks(0) === 0); //true
console.log(calculateLeftoverBlocks(1) === 0); //true
console.log(calculateLeftoverBlocks(2) === 1); //true
console.log(calculateLeftoverBlocks(4) === 3); //true
console.log(calculateLeftoverBlocks(5) === 0); //true
console.log(calculateLeftoverBlocks(6) === 1); //true
console.log(calculateLeftoverBlocks(14) === 0); //true