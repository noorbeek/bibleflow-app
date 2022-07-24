import { QueryClient } from '@tanstack/react-query';

/**
 * React Query default options
 */

export const queryClientOptions = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: true,
      staleTime: 3600,
    },
  },
});
