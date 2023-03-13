/**
 * JS110 Lesson 1
 * Practice Problems
 * Question 8
 *
 * Given the array defined below, write a program that uses this array to create
 * an object where the names are the keys and the values are the positions in
 * the array:
 *
 * `{ Fred: 0, Barney: 1, Wilma: 2, Betty: 3, Pebbles: 4, Bambam: 5 }`
 *
 */

let flintstones = ["Fred", "Barney", "Wilma", "Betty", "Pebbles", "Bambam"];

let result = {};
flintstones.forEach((name, idx) => {
  result[name] = idx;
});

console.log(result);