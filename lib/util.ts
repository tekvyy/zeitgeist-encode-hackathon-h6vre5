import { gql } from 'graphql-request';
import client from './graphql-client';

export const pingClient = async () => {
  const res = client.request(gql`
  query pingQuery {
    markets(limit: 1) {
      id
    }
  }`);
  return res;
};
