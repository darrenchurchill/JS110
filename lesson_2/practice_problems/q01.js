/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 1
 *
 * How would you order the array of strings below by descending numeric value?
 *
 */

let arr = ['10', '11', '9', '7', '8'];

console.log(arr.sort((a, b) => Number(b) - Number(a)));