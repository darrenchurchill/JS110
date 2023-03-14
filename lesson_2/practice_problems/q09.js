/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 9
 *
 * Given the array below, return a new array with the same data structure, but
 * with the values in each subarray ordered -- alphabetically or numerically,
 * as appropriate -- in ascending order.
 *
 */

let arr = [
  ['b', 'c', 'a'],
  [2, 11, -3],
  ['blue', 'black', 'green'],
];

let orderedArr = arr.map((subArr) => {
  return subArr.slice().sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
});

console.log(orderedArr);
