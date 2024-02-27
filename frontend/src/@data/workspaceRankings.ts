import { pb } from './client';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { WorkspaceRankingRecord } from './workspaceRankings.types';
import { sw } from '@/lib/utils';

export function useWorkspaceRankings(
  options?: Partial<UseQueryOptions<WorkspaceRankingRecord[], Error>>,
  onChange?: (data: WorkspaceRankingRecord) => void
) {
  onChange && onChange({} as WorkspaceRankingRecord);
  return useQuery({
    queryKey: ['workspaceRankings'],
    queryFn: async () =>
      await sw(
        pb
          .collection('workspace_rankings')
          .getFullList<WorkspaceRankingRecord>()
      ),
    ...options,
  });
}
