/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 14
 *
 * Given the object below, write some code to return an array containing the
 * fruit colors and the vegetable sizes. The sizes should be uppercase and the
 * colors should be capitalized.
 *
 */

let obj = {
  grape: { type: 'fruit', colors: ['red', 'green'], size: 'small' },
  carrot: { type: 'vegetable', colors: ['orange'], size: 'medium' },
  apple: { type: 'fruit', colors: ['red', 'green'], size: 'medium' },
  apricot: { type: 'fruit', colors: ['orange'], size: 'medium' },
  marrow: { type: 'vegetable', colors: ['green'], size: 'large' },
};

let arr = Object.values(obj).map((info) => {
  if (info.type === 'fruit') {
    return info.colors.map((color) => {
      return color[0].toUpperCase() + color.slice(1);
    });
  }
  return info.size.toUpperCase();
});
console.log(arr);
