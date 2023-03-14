/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 15
 *
 * Given the array below, write some code to return an array containing only the
 * objects where all the numbers are even.
 *
 */

let arr = [
  { a: [1, 2, 3] },
  { b: [2, 4, 6], c: [3, 6], d: [4] },
  { e: [8], f: [6, 10] },
];

let filtered = arr.filter((obj) => {
  return Object.values(obj).every((subArr) => {
    return subArr.every((val) => val % 2 === 0);
  });
});
console.log(filtered);
