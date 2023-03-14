/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 5
 *
 * Given the object below, compute and display the total age of the male members
 * of the family.
 *
 */

let munsters = {
  Herman: { age: 32, gender: 'male' },
  Lily: { age: 30, gender: 'female' },
  Grandpa: { age: 402, gender: 'male' },
  Eddie: { age: 10, gender: 'male' },
  Marilyn: { age: 23, gender: 'female' },
};

let totalAge = Object.entries(munsters).reduce((totalAge, [_, info]) => {
  if (info.gender === 'male') return totalAge + info.age;
  return totalAge;
}, 0);

console.log(totalAge);
