// import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: async (parent, args, { models }) => models.Message.findAll(),
    message: async (parent, { id }, { models }) => models.Message.findByPk(id)
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      try {
        return await models.Message.create({
          text,
          userId: me.id
        });
      } catch (error) {
        console.log(`error is ${error}`);
        throw new Error(error);
      }
    },

    deleteMessage: async (parent, { id }, { models }) =>
      models.Message.destroy({ where: { id } }),
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
      models.User.findByPk(parent.userId)
  }
};
