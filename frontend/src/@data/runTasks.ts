import { sw } from '@/lib/utils';
import { pb } from './client';
import { RunTaskRecord } from './runTasks.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useRunTasks(
  options?: Partial<UseQueryOptions<RunTaskRecord[], Error>>
) {
  return useQuery({
    queryKey: ['runTasks'],
    queryFn: async () =>
      await sw(pb.collection('run_tasks').getFullList<RunTaskRecord>()),
    ...options,
  });
}
