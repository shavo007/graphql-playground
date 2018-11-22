export default {
  Query: {
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
    me: (parent, args, { me }) => me
  },

  // resolve per field level
  //  flexibility to add your own data mapping

  User: {
    // username: parent => `${parent.firstname} ${parent.lastname}`
    messages: (parent, args, { models }) =>
      Object.values(models.messages).filter(
        message => message.userId === parent.id
      )
  }
};
