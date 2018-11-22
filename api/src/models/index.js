const users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    firstname: 'Robin',
    lastname: 'Wieruch',
    moody: true,
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstname: 'Dave',
    lastname: 'Davids',
    moody: false,
    messageIds: [2]
  }
};

const messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
};

export default {
  users,
  messages
};
