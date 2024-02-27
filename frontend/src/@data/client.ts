import PocketBase from 'pocketbase';
import { enqueueSnackbar } from 'notistack';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 48, // 48 hours
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      enqueueSnackbar(error.message, {
        variant: 'error',
        preventDuplicate: true,
      });
    },
  }),
});

export const queryClientPersister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const pb = new PocketBase();
