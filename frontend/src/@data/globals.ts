import { sw } from '@/lib/utils';
import { pb } from './client';
import { GlobalRecord, Globals } from './globals.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useGlobals(options?: Partial<UseQueryOptions<Globals, Error>>) {
  const { data } = useQuery({
    queryKey: ['globals'],
    queryFn: async () => {
      const globals: Globals = {};
      const response = await sw(
        pb.collection('globals').getFullList<GlobalRecord>(options)
      );
      for (const item of response) {
        globals[item.key] = item.value;
      }
      return globals;
    },
    ...options,
  });
  return data ?? {};
}

pb.collection('globals').getFullList();
