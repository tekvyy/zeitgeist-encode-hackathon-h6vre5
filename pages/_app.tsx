import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import getMarketRewards from '../lib/get-market-rewards';

// Uncomment 2 lines bellow to test graphql connection
// import { pingClient } from '../lib/util';
// pingClient().then((res) => console.log(res));
// `{ markets: [ { id: '0002096416-000005-5a272-89' } ] }` should appear in terminal bellow

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [rewards, setRewards] = useState<
    { marketId: number; totalRewards: string }[]
  >([]);

  useEffect(() => {
    // Finish implementation of `getMarketRewards`in `lib/get-market-rewards.ts` file
    getMarketRewards('dE3h9GgLGEhpmTDx9eXdGkoT2SMJHo8ny2BLS4kgN6rSGeAkV').then(
      (res) => setRewards(res)
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div>getMarketRewards result:</div>
      <div>{JSON.stringify(rewards, undefined, 2)}</div>

      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
