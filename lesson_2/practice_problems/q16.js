/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 16
 *
 * Given the array below, write some code that defines an object where the key
 * is the first item in each subarray, and the value is the second item.
 *
 */

let arr = [
  ['a', 1],
  ['b', 'two'],
  ['sea', { c: 3 }],
  ['D', ['a', 'b', 'c']],
];
// expected value of object
// { a: 1, b: 'two', sea: { c: 3 }, D: [ 'a', 'b', 'c' ] }
let obj = Object.fromEntries(arr);
console.log(obj);
