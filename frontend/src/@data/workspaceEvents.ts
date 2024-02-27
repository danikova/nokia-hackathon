import { useCallback, useMemo } from 'react';
import { pb, useRealtime } from './client';
import { WorkspaceEventRecord } from './workspaceEvents.types';
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { sw, updateList } from '@/lib/utils';
import { RecordSubscription } from 'pocketbase';

export function useWorkspaceEvenets(
  options?: Partial<UseQueryOptions<WorkspaceEventRecord[], Error>>
) {
  const queryClient = useQueryClient();
  const onMessage = useCallback(
    (data: RecordSubscription<WorkspaceEventRecord>) => {
      queryClient.setQueryData(
        ['workspaceEvents'],
        (oldList: WorkspaceEventRecord[]) => updateList(oldList, data.record)
      );
    },
    [queryClient]
  );
  useRealtime('workspace_events/*', onMessage);
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
  return useMemo(() => events && events[0]?.new_run_started, [events]);
}
