/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 12
 *
 * Given the array below, use the a combination of methods, including `filter`,
 * to return a new array identical in structure to the original, but containing
 * only the numbers that are multiples of 3.
 *
 */

let arr = [[2], [3, 5, 7], [9], [11, 15, 18]];

function isMultOf(num, factor) {
  return num % factor === 0;
}

let multiples = arr.map((subArr) => subArr.filter((el) => isMultOf(el, 3)));
console.log(multiples);
