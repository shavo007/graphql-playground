import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import DataLoader from 'dataloader';
import compression from 'compression';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import seedData from './models/seed';
import loaders from './loaders';
import ArtistsAPI from './datasource/artists';

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
// ⛏ gzip compression https://graphql.github.io/learn/best-practices/#json-with-gzip
app.use(compression());

const getUser = token => {
  const user = models.users[1];
  return user;
};

const getMe = async token => {
  if (token) {
    const bearerToken = token.split(' ')[1];
    // console.log(`bearerToken is ${bearerToken}`);
    if (bearerToken) {
      try {
        return await jwt.verify(bearerToken, process.env.SECRET);
      } catch (e) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
    }
  }
  return undefined;
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: () => ({
    artistsAPI: new ArtistsAPI()
  }),
  // global error handling
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message
    };
  },
  // subscriptions: {
  //   onConnect: (connectionParams, webSocket, context) => {
  //     // TODO auth over websocket https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#Authentication-Over-WebSocket
  //     console.log(`onConnect: `);
  //   },
  //   onDisconnect: (webSocket, context) => {
  //     // ...
  //   }
  // },
  tracing: true,
  cacheControl: process.env.NODE_ENV !== 'production',
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
  // ⚠️ Useful for graphql first approach 👇🏻
  // mocks: true,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
        }
      };
    }
    if (req) {
      const token = req.headers.authorization || '';
      // try to retrieve a user with the token
      //
      // const user = getUser(token);
      // optionally block the user
      // we could also check user roles/permissions here
      // if (!user) throw new AuthorizationError('you must be logged in');

      return {
        me: await getMe(token),
        models,
        secret: process.env.SECRET,
        tmApiKey: process.env.TM_API_KEY,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
        }
      };
    }
  }
});

const isTest = !!process.env.TEST_DATABASE;
// const eraseDatabaseOnSync = true;
sequelize.sync({ force: isTest }).then(async () => {
  if (isTest) {
    seedData(new Date());
  }

  server.applyMiddleware({ app, path: '/graphql' });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql 😛 🚀 🚀🚀
 Subscriptions ready at ws://localhost:${port}${
      server.subscriptionsPath
    } 😃😈`);
  });
});
