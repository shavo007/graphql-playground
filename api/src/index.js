import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import DataLoader from 'dataloader';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import seedData from './models/seed';

const app = express();
app.use(cors());

const getUser = token => {
  const user = models.users[1];
  return user;
};
const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys
      }
    }
  });

  return keys.map(key => users.find(user => user.id === key));
};

const getMe = async token => {
  if (token) {
    const bearerToken = token.split(' ')[1];
    console.log(`bearerToken is ${bearerToken}`);
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

// const me = users[1];

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      // TODO auth over websocket https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#Authentication-Over-WebSocket
      console.log(`onConnect: `);
    },
    onDisconnect: (webSocket, context) => {
      // ...
    }
  },
  tracing: true,
  cacheControl: true,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
  // ⚠️ Useful for graphql first approach 👇🏻
  // mocks: true,
  // context: ({ req }) => ({
  //    authScope: getScope(req.headers.authorization)
  //  })
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models
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
        // me: await models.User.findByLogin('rwieruch'),
        // me: models.users[1],
        // user,
        models,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys => batchUsers(keys, models))
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
  httpServer.listen({ port: 8000 }, () => {
    console.log(`Apollo Server on http://localhost:8000/graphql 😛 🚀 🚀🚀
Subscriptions ready at ws://localhost:${8000}${server.subscriptionsPath} 😃😈`);
  });
});
