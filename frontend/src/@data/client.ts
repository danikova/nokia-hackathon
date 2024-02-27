import PocketBase, { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { enqueueSnackbar } from 'notistack';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useEffect } from 'react';

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

const activeTopics = new Set<string>();
export function useRealtime<T>(
  topic: string,
  onMessage: (data: RecordSubscription<T>) => void,
  force = false
) {
  useEffect(() => {
    if (!force && activeTopics.has(topic)) {
      return;
    }

    activeTopics.add(topic);
    let unsubscribe: UnsubscribeFunc;
    const subscribe = async () => {
      unsubscribe = await pb.realtime.subscribe(topic, onMessage);
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      activeTopics.delete(topic);
    };
  }, [onMessage, topic, force]);
}
