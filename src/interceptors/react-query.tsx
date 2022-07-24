import { QueryClient } from 'react-query';

/**
 * React Query default options
 */

export const queryClientOptions = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 3600,
    },
  },
});
