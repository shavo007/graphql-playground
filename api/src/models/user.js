const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING
    }
  });

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    let userByLogin = await User.findOne({
      where: { username: login }
    });

    if (!userByLogin) {
      userByLogin = await User.findOne({
        where: { email: login }
      });
    }

    return userByLogin;
  };

  return User;
};

export default user;
