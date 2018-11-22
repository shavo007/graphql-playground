import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
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
`;
