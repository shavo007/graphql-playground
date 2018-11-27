export default {
  Query: {
    users: async (parent, args, { models }) => models.User.findAll(),
    user: (parent, { id }, { models }) => models.User.findById(id),
    me: (parent, args, { models, me }) => models.User.findById(me.id)
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
