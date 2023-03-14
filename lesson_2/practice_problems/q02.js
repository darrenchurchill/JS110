/**
 * JS110 Lesson 2
 * Practice Problems
 * Question 2
 *
 * How would you order the array of objects below based on the year of book
 * publication, from earliest to latest?
 *
 */

let books = [
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel Garcia Marquez',
    published: '1967',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    published: '1925',
  },
  {
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    published: '1869',
  },
  {
    title: 'Ulysses',
    author: 'James Joyce',
    published: '1922',
  },
  {
    title: 'The Book of Kells',
    author: 'Multiple Authors',
    published: '800',
  },
];

books.sort((a, b) => Number(a.published) - Number(b.published));
console.log(books);
