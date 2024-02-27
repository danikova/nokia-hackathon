import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { pb } from './client';
import { useMemo } from 'react';
import { sw } from '@/lib/utils';
import { WorkspaceRecord } from './workspaces.types';

export function useWorkspaces(
  options?: Partial<UseQueryOptions<WorkspaceRecord[], Error>>
) {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () =>
      await sw(pb.collection('workspaces').getFullList<WorkspaceRecord>()),
    ...options,
  });
}

export function useUserWorkspace() {
  const { data } = useWorkspaces();
  return useMemo(() => data![0] ?? undefined, [data]);
}

interface UpdateWorkspaceProps {
  workspaceId: WorkspaceRecord['id'];
  data: Partial<WorkspaceRecord>;
}

export function useUpdateWorkspace(
  options?: Partial<
    UseMutationOptions<WorkspaceRecord, Error, UpdateWorkspaceProps>
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['workspace', 'update'],
    mutationFn: async ({ workspaceId, data }) =>
      await sw(
        pb.collection('workspaces').update<WorkspaceRecord>(workspaceId, data),
        'Workspace updated'
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    ...options,
  });
}
