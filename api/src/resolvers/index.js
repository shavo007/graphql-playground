//
// NOTE to combine resolver maps check out https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
// NOTE  extract resolvers into their own files/connectors https://www.apollographql.com/docs/graphql-tools/connectors.html#connectors
import uuidv4 from 'uuid/v4';

export default {
  Query: {
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me,
    messages: (parent, args, { models }) => Object.values(models.messages),
    message: (parent, { id }, { models }) => models.messages[id]
  },
  Mutation: {
    createMessage(parent, { text }, { me, models }) {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id
      };
      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage(parent, { id }, { models }) {
      const { [id]: message, ...otherMessages } = models.messages;

      if (!message) {
        return false;
      }

      models.messages = otherMessages;

      return true;
    },
    updateMessage(parent, { id, text }, { models }) {
      if (models.messages[id]) {
        models.messages[id].text = text;
        return true;
      }
      return false;
    }
  },
  // resolve per field level
  //  flexibility to add your own data mapping
  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: (parent, args, { models }) =>
      Object.values(models.messages).filter(
        message => message.userId === parent.id
      )
  },
  Message: {
    user: (parent, args, { models }) => models.users[parent.userId]
  }
};
