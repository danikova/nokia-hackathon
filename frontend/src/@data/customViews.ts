import { RunStatisticRecord } from './customViews.types';
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { WorkspaceRecord } from './workspaces.types';
import { pb, useRealtime } from './client';
import { sw } from '@/lib/utils';
import { RunResultRecord } from './runResults.types';
import { useCallback } from 'react';

export function useRunStatistics(
  options?: Partial<UseQueryOptions<RunStatisticRecord[], Error>>
) {
  const queryClient = useQueryClient();
  const onMessage = useCallback(
    (msg: { action: string }) => {
      if (msg.action === 'create')
        queryClient.invalidateQueries({ queryKey: ['runStatistic'] });
    },
    [queryClient]
  );
  useRealtime('run_statistics/*', onMessage);

  return useQuery({
    queryKey: ['runStatistic'],
    queryFn: async () =>
      await sw(
        pb.send<RunStatisticRecord[]>('/custom_api/run_statistics/', {
          method: 'GET',
        })
      ),
    ...options,
  });
}

export function useBestRuns(
  workspace: WorkspaceRecord,
  options?: Partial<UseQueryOptions<RunResultRecord[], Error>>
) {
  return useQuery({
    queryKey: ['bestRuns'],
    queryFn: async () =>
      await sw(
        pb.send<RunResultRecord[]>('/custom_api/run_result_sum/', {
          method: 'GET',
          query: { workspaceId: workspace.id },
        })
      ),
    ...options,
  });
}
