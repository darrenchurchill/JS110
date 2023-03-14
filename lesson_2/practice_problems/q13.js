/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 13
 *
 * Given the array below, sort the array so that the sub-arrays are ordered
 * based on the sum of the odd numbers that they contain.
 *
 */

let arr = [
  [1, 6, 7],
  [1, 5, 3],
  [1, 8, 3],
];

function sumOfOdds(arr) {
  return arr.reduce((accum, el) => {
    if (el % 2 !== 0) return accum + el;
    return accum;
  }, 0);
}

arr.sort((a, b) => sumOfOdds(a) - sumOfOdds(b));
console.log(arr);
