//
// NOTE to combine resolver maps check out https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
// NOTE  extract resolvers into their own files/connectors https://www.apollographql.com/docs/graphql-tools/connectors.html#connectors
//
//

import userResolvers from './user';
import messageResolvers from './message';

export default [userResolvers, messageResolvers];
