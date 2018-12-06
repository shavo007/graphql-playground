import { expect } from 'chai';
import * as messageApi from '../tests/messageApi';

describe('messages', () => {
  describe('message(id: ID!): Message', () => {
    it('returns a message when message can be found', async () => {
      const expectedResult = {
        message: {
          text: 'Published the Road to learn React',
          id: '1',
          user: {
            username: 'rwieruch'
          }
        }
      };

      const result = await messageApi.message({ id: 1 });

      expect(result.data.data).to.eql(expectedResult);
    });
    it('returns null when message cannot be found', async () => {
      const expectedResult = {
        message: null
      };

      const result = await messageApi.message({ id: 42 });
      expect(result.data.data).to.eql(expectedResult);
    });
  });
  describe('createMessage(text: String!): Message!', () => {
    it('returns an error because only logged in user can create a message', async () => {
      const {
        data: { errors }
      } = await messageApi.createMessage({ text: 'Shanes message' }, ' ');

      expect(errors[0].message).to.eql('Not authenticated as user.');
    });
    it('returns a message after successful creation', async () => {
      const expectedResult = {
        createMessage: {
          id: '4',
          text: 'Shanes message'
        }
      };
      const {
        data: {
          data: {
            signIn: { token }
          }
        }
      } = await messageApi.signIn({
        login: 'ddavids',
        password: 'ddavids'
      });

      const result = await messageApi.createMessage(
        { text: 'Shanes message' },
        token
      );
      expect(result.data.data).to.eql(expectedResult);
    });
  });
});
