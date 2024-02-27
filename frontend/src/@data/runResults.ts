import { sw } from '@/lib/utils';
import { pb } from './client';
import { RunResultRecord } from './runResults.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useRunResults(
  options?: Partial<UseQueryOptions<RunResultRecord[], Error>>
) {
  return useQuery({
    queryKey: ['runResults'],
    queryFn: async () =>
      await sw(pb.collection('run_results').getFullList<RunResultRecord>()),
    ...options,
  });
}
