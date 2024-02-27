import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import { RankingRecord } from './rankings.types';
import { sw } from '@/lib/utils';
import { pb } from './client';

export const query = {
  queryKey: ['rankings'],
  queryFn: async () =>
    await sw(
      pb.collection('rankings').getFullList<RankingRecord>({ expand: 'user' })
    ),
};

export function useRankings(
  options?: Partial<UseQueryOptions<RankingRecord[], Error>>
) {
  return useQueries({
    queries: [
      {
        ...query,
        ...options,
      },
    ],
  });
}
