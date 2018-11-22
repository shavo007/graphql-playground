import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    me: User
    book: Book
    user(id: ID!): User
    users: [User]
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    addBook(title: String, author: String): Book
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }

  type User {
    """
    Description for field
    Supports **multi-line** description for your [API](http://example.com)!
    """
    username: String!
    id: ID!
    password: Int
    moody: Boolean
    messages: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    user: User!
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
