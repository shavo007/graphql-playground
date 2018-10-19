import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

const schema = gql`
  type Query {
    me: User
    book: Book
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    addBook(title: String, author: String): Book
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

const users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    moody: true
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    moody: false
  }
};

const me = users[1];

const resolvers = {
  Query: {
    me: () => me,
    user: (parent, { id }) => {
      console.log(`parent ${parent}`);
      // console.log(`args ${JSON.stringify(args)}`);
      return users[id];
    },
    users: () => Object.values(users),
    book: () => ({
        title: 'Barefoot Investor',
        author: {
          name: 'somebody'
        }
      })
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
