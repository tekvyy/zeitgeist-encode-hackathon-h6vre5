import { gql } from 'graphql-request';
import client from './graphql-client';

export class Market {
  marketId: number | undefined;
  blockerNumber: string | undefined;
  historyId: string | undefined;
  rewardAccount: string | undefined;
  totalRewards: string | undefined;
}

const getMarketRewards = async (
  address: string
): Promise<{ marketId: number; totalRewards: string }[]> => {
  // ... implementation here

  let result:
    | Market[]
    | { marketId: number; totalRewards: string }[]
    | PromiseLike<{ marketId: number; totalRewards: string }[]> = [];

  const baseAsset = 'Ztg';
  const queryToFetchMarkets = gql`
  query QueryMarkets($address: String!) {
    markets(where: {creator_eq: $address, baseAsset_eq: "Ztg", status_eq: Resolved}) {
      marketId,
      baseAsset
    }
  }`;

  const fetchMarketsVariables = {
    address: address,
    baseAsset: baseAsset,
  };

  const marketData = await client.request(
    queryToFetchMarkets,
    fetchMarketsVariables
  );

  const marketsResponse = marketData.markets;

  let localMarketArray = [];
  for (let i = 0; i < marketsResponse.length; i++) {
    let marketElement = marketsResponse[i];
    let localMarket = new Market();
    localMarket.marketId = marketElement.marketId;

    localMarketArray.push(localMarket);
  }

  const queryToFetchMarketHistories = gql`
  query QueryHistories($marketIds: [Int!]) {
    historicalMarkets(where: {event_eq: MarketResolved, marketId_in: $marketIds}) {
      id
      blockNumber
      event,
      marketId
    }
  }`;

  let marketIds = localMarketArray.map((item) => item.marketId);
  const queryHistoriesVariables = {
    marketIds: marketIds,
  };

  const marketHistoryData = await client.request(
    queryToFetchMarketHistories,
    queryHistoriesVariables
  );

  let historyMarketResponse = marketHistoryData.historicalMarkets;
  for (let i = 0; i < historyMarketResponse.length; i++) {
    let historyElement = historyMarketResponse[i];
    localMarketArray.filter;
    localMarketArray
      .filter((item) => item.marketId == historyElement.marketId)
      .forEach((item) => {
        item.blockerNumber = historyElement.blockNumber;
        item.historyId = historyElement.id;
      });
  }

  const queryToFetchRewardAccounts = gql`
  query QueryRewardAccounts($marketIds: [Int!]) {
    accountBalances(where: {account: {marketId_in: $marketIds}}) {
      account {
        accountId
        marketId
      }
    }
  }`;

  const queryRewardVariables = {
    marketIds: marketIds,
  };

  const rewardAccountData = await client.request(
    queryToFetchRewardAccounts,
    queryRewardVariables
  );

  let accountBalancesResponse = rewardAccountData.accountBalances;

  for (let i = 0; i < accountBalancesResponse.length; i++) {
    let accountElement = accountBalancesResponse[i];
    localMarketArray.filter;
    localMarketArray
      .filter((item) => item.marketId == accountElement.account.marketId)
      .forEach((item) => {
        item.rewardAccount = accountElement.account.accountId;
      });
  }

  for (let i = 0; i < localMarketArray.length; i++) {
    let localMarket = localMarketArray[i];
    const getBalanceQuery = gql` query MyQuery($accountId: String!, $blockNumber:String!) {
      balanceInfo(
      accountId: $accountId,
      blockNumber: $blockNumber,
      assetId: "Ztg"
      ) {
        assetId
        balance
      }}`;

    const balanceVariables = {
      accountId: localMarket.rewardAccount,
      blockNumber: String(localMarket.blockerNumber),
    };

    const balanceData = await client.request(getBalanceQuery, balanceVariables);
    const balanceResponse = balanceData.balanceInfo;
    localMarket.totalRewards = balanceResponse.balance;
  }
  result = localMarketArray;

  return new Promise<{ marketId: number; totalRewards: string }[]>(
    (resolve) => {
      resolve(result);
    }
  );
};

export default getMarketRewards;
