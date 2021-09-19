import {join} from 'path';

import * as core from 'express-serve-static-core';

import {graphqlHTTP} from 'express-graphql';

import {loadSchemaSync} from '@graphql-tools/load';
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';

import {User} from 'models/user';

import DB from './mongo';

const schema = loadSchemaSync(join(__dirname, '/../data/schema.graphql'), {
  loaders: [
    new GraphQLFileLoader(),
  ]
});

const rootValue = {
  users: async () => {
    const db = await DB();
    const result = await db.collection('users').find().toArray();
    return result.map((user: User) => ({
      id: user._id.toString(),
      ...user
    }));
  }
};

export default (APP: core.Express) => {
  APP.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: false,
  }));
};