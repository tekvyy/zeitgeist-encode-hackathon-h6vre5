import { gql } from 'graphql-request';
import client from './graphql-client';

const getMarketRewards = async (
  address: string
): Promise<{ marketId: number; totalRewards: string }[]> => {
  // ... implementation here

  const baseAsset = 'Ztg';
  const queryToFetchMarkets = gql`
  query QueryMarkets($address: String!) {
    markets(where: {creator_eq: $address, baseAsset_eq: "Ztg", status_eq: Resolved}) {
      marketId,
      baseAsset
    }
  }`;

  const variables = {
    address: address,
    baseAsset: baseAsset,
  };

  const marketData = await client.request(queryToFetchMarkets, variables);

  return marketData;
};

export default getMarketRewards;
