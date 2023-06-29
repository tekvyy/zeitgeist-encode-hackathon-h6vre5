import { useQuery } from '@tanstack/react-query';
import getMarketRewards from './get-market-rewards';

const useGetMarketRewards = async (address: string) => {
  return useQuery(['marketRewards'], async () => {
    getMarketRewards(address);
  });
};
