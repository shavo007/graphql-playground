import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import http from 'http';
import schema from './schema';
import resolvers from './resolvers';
// import models from './models';
import models, { sequelize } from './models';

const app = express();
app.use(cors());

const getUser = token => {
  const user = models.users[1];
  return user;
};

const getMe = async token => {
  if (token) {
    const bearerToken = token.split(' ')[1];
    console.log(`bearerToken is ${bearerToken}`);
    try {
      return await jwt.verify(bearerToken, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
  return undefined;
};

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds(+1))
        }
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds(+1))
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds(+5))
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
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
        secret: process.env.SECRET
      };
    }
  }
});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }

  server.applyMiddleware({ app, path: '/graphql' });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql 😛 🚀 🚀🚀');
  });
});
