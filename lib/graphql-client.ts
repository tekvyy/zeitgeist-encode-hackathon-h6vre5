import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(
  'https://processor.rpc-0.zeitgeist.pm/graphql'
);

export default client;
