import { useMemo } from 'react';
import { pb } from './client';
import { WorkspaceEventRecord } from './workspaceEvents.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { sw } from '@/lib/utils';

export function useWorkspaceEvenets(
  options?: Partial<UseQueryOptions<WorkspaceEventRecord[], Error>>
) {
  return useQuery({
    queryKey: ['workspaceEvents'],
    queryFn: async () =>
      await sw(
        pb.collection('workspace_events').getFullList<WorkspaceEventRecord>()
      ),
    ...options,
  });
}

export function useIsWorkspaceBusy() {
  const { data: events } = useWorkspaceEvenets();
  return useMemo(() => events![0]?.new_run_started, [events]);
}
