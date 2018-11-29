export default {
  Query: {
    users: async (parent, args, { models }) => models.User.findAll(),
    user: (parent, { id }, { models }) => models.User.findByPk(id),
    me: (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return models.User.findByPk(me.id);
    }
  },
  // resolve per field level
  //  flexibility to add your own data mapping

  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: async (parent, args, { models }) =>
      models.Message.findAll({
        where: {
          userId: parent.id
        }
      })
  }
};
