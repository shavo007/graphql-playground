import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express();
app.use(cors());

const getUser = token => {
  const user = models.users[1];
  return user;
};

// const me = users[1];

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
      me: models.users[1],
      user,
      models
    };
  }
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
