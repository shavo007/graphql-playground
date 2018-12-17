import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';
import pubsub, { EVENTS } from '../subscription';

import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor)
              }
            }
          }
        : {};
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions
      });
      console.log(`messages length is ${messages.length}`);
      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges,
        pageInfo: {
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toISOString()
          ),
          hasNextPage
        }
      };
    },
    message: async (parent, { id }, { models }) => models.Message.findByPk(id)
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        try {
          const message = await models.Message.create({
            text,
            userId: me.id
          });
          pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message }
          });
          return message;
        } catch (error) {
          console.log(`error is ${error}`);
          throw new Error(error);
        }
      }
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) =>
        models.Message.destroy({ where: { id } })
    ),
    updateMessage(parent, { id, text }, { models }) {
      // TODO update this to sql update query
      if (models.messages[id]) {
        models.messages[id].text = text;
        return true;
      }
      return false;
    }
  },

  // resolve per field level
  //  flexibility to add your own data mapping

  Message: {
    // ❓ before you use batching/caching
    // user: async (parent, args, { models }) =>
    //   models.User.findByPk(parent.userId)
    //   ⚠️ after using batching and caching with dataloader
    user: async (parent, args, { loaders }) => loaders.user.load(parent.userId)
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
    }
  }
};
