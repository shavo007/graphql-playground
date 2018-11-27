// import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findById(id)
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      // const id = uuidv4();

      models.Message.create({
        text,
        userId: me.id
      });
    },
    deleteMessage: async (parent, { id }, { models }) => {
      models.Message.destroy({ where: { id } });
    },
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
    user: async (parent, args, { models }) =>
      models.User.findById(parent.userId)
  }
};
