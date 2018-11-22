import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    book: Book
  }

  extend type Mutation {
    addBook(title: String, author: String): Book
  }

  type Book {
    title: String
    author: Author
  }

  type Author {
    name: String
    books: [Book]
  }
`;
