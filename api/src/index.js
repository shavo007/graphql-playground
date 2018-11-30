import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
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

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React'
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
          text: 'Happy to release ...'
        },
        {
          text: 'Published a complete ...'
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
  context: async ({ req }) => {
    // TODO showcase auth
    // get the user token from the headers
    const token = req.headers.authorization || '';
    // try to retrieve a user with the token
    //
    // const user = getUser(token);
    // optionally block the user
    // we could also check user roles/permissions here
    // if (!user) throw new AuthorizationError('you must be logged in');
    return {
      me: await models.User.findByLogin('rwieruch'),
      // me: models.users[1],
      // user,
      models,
      secret: process.env.SECRET
    };
  }
});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql 😛 🚀 🚀🚀');
  });
});
