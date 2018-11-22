import uuidv4 from 'uuid/v4';

export default {
  Query: {
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

  Message: {
    user: (parent, args, { models }) => models.users[parent.userId]
  }
};
