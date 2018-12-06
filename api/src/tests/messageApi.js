import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';

export const message = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        message(id: $id) {
          text
    id
    user{
      username
    }
        }
      }
    `,
    variables
  });

export const signIn = async variables =>
  axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables
  });

export const createMessage = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($text: String!) {
          createMessage(text: $text) {
			text
			id
			}
        }
      `,
      variables
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
