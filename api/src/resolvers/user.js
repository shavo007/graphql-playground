import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return jwt.sign({ id, email, username, role }, secret, { expiresIn });
};
export default {
  Query: {
    users: async (parent, args, { models }) => models.User.findAll(),
    user: (parent, { id }, { models }) => models.User.findByPk(id),
    me: (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return models.User.findByPk(me.id);
    },
  },
  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },
    deleteUser: combineResolvers(isAdmin, async (parent, { id }, { models }) =>
      models.User.destroy({
        where: { id },
      })
    ),
  },
  // resolve per field level
  //  flexibility to add your own data mapping

  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: async (parent, args, { models }) =>
      models.Message.findAll({
        where: {
          userId: parent.id,
        },
      }),
  },
};
