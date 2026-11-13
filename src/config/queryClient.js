import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:                   30_000,
      gcTime:                      5 * 60_000,
      refetchOnWindowFocus:        true,
      refetchOnReconnect:          true,
      refetchIntervalInBackground: false,
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

export default queryClient;