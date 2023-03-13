/**
 * JS110 Lesson 1
 * Practice Problems
 * Question 11
 *
 * Create an object that expresses the frequency with which each letter occurs
 * in the string below.
 *
 * Example output:
 *
 * { T: 1, h: 1, e: 2, F: 1, l: 1, ...}
 *
 */

let statement = "The flintstones Rock";

let frequencies = {};
statement.split(' ')
  .join('')
  .split('')
  .forEach(char => {
    frequencies[char] = frequencies.hasOwnProperty(char)
      ? frequencies[char] += 1
      : 1;
  });

console.log(frequencies);