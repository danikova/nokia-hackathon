import axios from 'axios';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { WorkspaceEventsResponse } from './workspaceEvents.types';
import { useMemo } from 'react';

export function useWorkspaceEvenets(
  options?: Partial<UseQueryOptions<WorkspaceEventsResponse, Error>>
) {
  return useQuery({
    queryKey: ['workspaceEvents'],
    queryFn: async () => {
      const response = await axios.get(
        '/api/collections/workspace_events/records'
      );
      return response.data;
    },
    ...options,
  });
}

export function useIsWorkspaceBusy() {
  const { data: events } = useWorkspaceEvenets();
  return useMemo(() => events?.items[0]?.new_run_started, [events]);
}
