/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 17
 *
 * A UUID consists of 32 hexadecimal characters (digits 0-9 and letters a-f)
 * represented as a string. The value is typically broken into 5 sections in an
 * 8-4-4-4-12 pattern. For example `'f65c57f6-a6aa-17a8-faa1-a67f2dc9fa91'`.
 *
 * Write a function that takes no arguments and returns a string containing a
 * UUID.
 *
 */

function genUUID() {
  const BASE = 16;
  const LENGTH = 32;
  let result = [];

  for (let i = 0; i < LENGTH; i++) {
    result.push(Math.floor(Math.random() * BASE).toString(BASE));
  }
  result = result.join('');

  return (
    `${result.slice(0, 8)}-` +
    `${result.slice(8, 12)}-${result.slice(12, 16)}-${result.slice(16, 20)}-` +
    `${result.slice(20)}`
  );
}

console.log(genUUID());
