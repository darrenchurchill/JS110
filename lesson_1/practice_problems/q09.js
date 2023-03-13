/**
 * JS110 Lesson 1
 * Practice Problems
 * Question 9
 *
 * Add up all of the ages from the Munster family object.
 *
 */

let ages = {
  Herman: 32,
  Lily: 30,
  Grandpa: 5843,
  Eddie: 10,
  Marilyn: 22,
  Spot: 237
};

console.log(Object.values(ages).reduce((accum, age) => accum + age));