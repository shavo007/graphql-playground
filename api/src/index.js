import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

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

let messages = {
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

const getUser = token => {
  const user = users[1];
  return user;
};

// const me = users[1];
//
// NOTE to combine resolver maps check out https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
// NOTE  extract resolvers into their own files/connectors https://www.apollographql.com/docs/graphql-tools/connectors.html#connectors
const resolvers = {
  Query: {
    // (parent, args, context, info) => { ... }
    me: (parent, args, { me }) => me,
    user: (parent, { id }, { user }) => {
      console.log(`parent ${parent}`);
      console.log(`user ${JSON.stringify(user)}`);
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
  Mutation: {
    createMessage(parent, { text }, { me }) {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };
      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage(parent, { id }) {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
    updateMessage(parent, { id, text }) {
      if (messages[id]) {
        messages[id].text = text;
        return true;
      } 
        return false;
      
    }
  },
  // resolve per field level
  //  flexibility to add your own data mapping
  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: parent =>
      Object.values(messages).filter(message => message.userId === parent.id)
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
  context: ({ req }) => {
    // TODO showcase auth
    // get the user token from the headers
    const token = req.headers.authorization || '';
    // try to retrieve a user with the token
    //
    const user = getUser(token);
    // optionally block the user
    // we could also check user roles/permissions here
    // if (!user) throw new AuthorizationError('you must be logged in');
    return {
      me: users[1],
      user
    };
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
