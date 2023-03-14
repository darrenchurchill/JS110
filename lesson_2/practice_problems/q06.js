/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 6
 *
 * Given the family object below, print the name, age, and gender of each family
 * member.
 *
 * Each output line should follow this pattern:
 * (Name) is a (age)-year-old (male or female).
 *
 */

let munsters = {
  Herman: { age: 32, gender: 'male' },
  Lily: { age: 30, gender: 'female' },
  Grandpa: { age: 402, gender: 'male' },
  Eddie: { age: 10, gender: 'male' },
  Marilyn: { age: 23, gender: 'female' },
};

Object.entries(munsters).forEach(([name, info]) => {
  console.log(`${name} is a ${info.age}-year-old ${info.gender}.`);
});
