/**
 * Given an array of strings, return a new array where the strings are sorted to
 * the highest number of adjacent consonants a particular string contains.  If
 * two strings contain the same highest number of adjacent consonants they
 * should retain their original order in relation to each other.
 *
 * Consonants are considered adjacent if they are next to each other in the same
 * word or if there is a space between two consonants in adjacent words.
 */

function sortStringsByConsonants(strings) {
  let result = [...strings];

  // sort ascending order by adjacent counts
  return result.sort(
    (a, b) => countMaxAdjacentConsonants(b) - countMaxAdjacentConsonants(a)
  );
}


function* adjacentConsonants(string) {
  string = string.split(' ').join('');

  let curIdx = 0;
  let nxtIdx = 1;

  while (nxtIdx < string.length) {
    let curChar = string[curIdx];
    let nxtChar = string[nxtIdx];

    if (isConsonant(curChar) && isConsonant(nxtChar)) {
      yield [curChar, nxtChar];
    }

    curIdx = nxtIdx;
    nxtIdx += 1;
  }
}


function countMaxAdjacentConsonants(string) {
  let maxCount = 0;
  let curCount = 0;

  for (let _ of adjacentConsonants(string)) {
    curCount = curCount === 0 ? 2 : curCount + 1;
    if (curCount > maxCount) maxCount = curCount;
  }

  return maxCount;
}


function isConsonant(char) {
  return !isVowel(char);
}


function isVowel(char) {
  return 'aeiou'.includes(char);
}


// test cases
console.log('Tests for ', countMaxAdjacentConsonants, ':');
console.log(countMaxAdjacentConsonants('aa') === 0);
console.log(countMaxAdjacentConsonants('baa') === 0);
console.log(countMaxAdjacentConsonants('ccaa') === 2);
console.log(countMaxAdjacentConsonants('dddaa') === 3);

console.log(countMaxAdjacentConsonants('can can') === 2);
console.log(countMaxAdjacentConsonants('toucan') === 0);
console.log(countMaxAdjacentConsonants('batman') === 2);
console.log(countMaxAdjacentConsonants('salt pan') === 3);

console.log(countMaxAdjacentConsonants('bar') === 0);
console.log(countMaxAdjacentConsonants('car') === 0);
console.log(countMaxAdjacentConsonants('far') === 0);
console.log(countMaxAdjacentConsonants('jar') === 0);

console.log(countMaxAdjacentConsonants('day') === 0);
console.log(countMaxAdjacentConsonants('week') === 0);
console.log(countMaxAdjacentConsonants('month') === 3);
console.log(countMaxAdjacentConsonants('year') === 0);


console.log('Tests for ', sortStringsByConsonants, ':');
console.log(
  JSON.stringify(sortStringsByConsonants(['aa', 'baa', 'ccaa', 'dddaa']))
  === JSON.stringify(['dddaa', 'ccaa', 'aa', 'baa'])
);

console.log(
  JSON.stringify(sortStringsByConsonants(['can can', 'toucan', 'batman', 'salt pan']))
  === JSON.stringify(['salt pan', 'can can', 'batman', 'toucan'])
);

console.log(
  JSON.stringify(sortStringsByConsonants(['bar', 'car', 'far', 'jar']))
  === JSON.stringify(['bar', 'car', 'far', 'jar'])
);

console.log(
  JSON.stringify(sortStringsByConsonants(['day', 'week', 'month', 'year']))
  === JSON.stringify(['month', 'day', 'week', 'year'])
);