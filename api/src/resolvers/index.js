//
// NOTE to combine resolver maps check out https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
// NOTE  extract resolvers into their own files/connectors https://www.apollographql.com/docs/graphql-tools/connectors.html#connectors
//
//
import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import messageResolvers from './message';
import artistResolvers from './artist';

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  artistResolvers
];
