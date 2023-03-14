/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 11
 *
 * Given the array below, use the `map` method to return a new array identical
 * in structure to the original, but with each number incremented by 1.
 *
 * Do not modify the original structure.
 *
 */

let arr = [{ a: 1 }, { b: 2, c: 3 }, { d: 4, e: 5, f: 6 }];

let incrementedArr = arr.map((el) => {
  return Object.fromEntries(
    Object.entries(el).map(([key, val]) => [key, val + 1])
  );
});

console.log(arr);
console.log(incrementedArr);
