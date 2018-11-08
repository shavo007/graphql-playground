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
    messages: [Message!]!
    message(id: ID!): Message!
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

const users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    firstname: 'Robin',
    lastname: 'Wieruch',
    moody: true,
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstname: 'Dave',
    lastname: 'Davids',
    moody: false,
    messageIds: [2]
  }
};

const messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
};

// const me = users[1];
//
// TODO to combine resolver maps check out https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing

const resolvers = {
  Query: {
    // (parent, args, context, info) => { ... }
    me: (parent, args, { me }) => me,
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
    }),
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id]
  },
  // resolve per field level
  //  flexibility to add your own data mapping
  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: parent => Object.values(messages).filter(
        message => message.userId === parent.id
      )
  },
  Message: {
    user: parent => users[parent.userId]
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // context: ({ req }) => ({
  //    authScope: getScope(req.headers.authorization)
  //  })
  context: {
    me: users[1]
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
