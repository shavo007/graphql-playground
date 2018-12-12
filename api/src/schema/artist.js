import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    myFavoriteArtist(id: ID!): Artist
  }

  type Artist {
    id: ID
    name: String
    image: String
    twitterUrl: String
    events: [Event]
  }
  type Event {
    name: String
    image: String
    startDateTime: String
  }
`;
