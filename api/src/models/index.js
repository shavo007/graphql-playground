import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.TEST_DATABASE || process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST
  }
);

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;

// const users = {
//   1: {
//     id: '1',
//     username: 'Robin Wieruch',
//     firstname: 'Robin',
//     lastname: 'Wieruch',
//     moody: true,
//     messageIds: [1]
//   },
//   2: {
//     id: '2',
//     username: 'Dave Davids',
//     firstname: 'Dave',
//     lastname: 'Davids',
//     moody: false,
//     messageIds: [2]
//   }
// };
//
// const messages = {
//   1: {
//     id: '1',
//     text: 'Hello World',
//     userId: '1'
//   },
//   2: {
//     id: '2',
//     text: 'By World',
//     userId: '2'
//   }
// };
//
// export default {
//   users,
//   messages
// };
