import axios, {AxiosResponse} from 'axios';

import {GraphQLTaggedNode} from 'relay-runtime';

import {UsersQuery} from '__generated__/UsersQuery.graphql';

export async function fetchGraphQL<T extends UsersQuery>(csrf: string, query: string | GraphQLTaggedNode, variables?: T['variables']): Promise<{
  data: T['response']
}> {
  const {data} = await axios({
    method: 'post',
    url: 'https://localhost:7602/graphql',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrf
    },
    responseType: 'json',
    data: {
      query,
      variables,
    }
  });

  return data;
}