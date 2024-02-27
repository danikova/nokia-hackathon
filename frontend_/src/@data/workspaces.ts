import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { WorkspaceRecord, WorkspacesResponse } from './workspaces.types';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';

export function useWorkspaces(
  options?: Partial<UseQueryOptions<WorkspacesResponse, Error>>
) {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await axios.get('/api/collections/workspaces/records');
      return response.data;
    },
    ...options,
  });
}

export function useUserWorkspace() {
  const { data } = useWorkspaces();
  return useMemo(() => data?.items![0] ?? undefined, [data]);
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
    mutationFn: async ({ workspaceId, data }) => {
      const response = await axios.patch(
        `/api/collections/workspaces/records/${workspaceId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Workspace updated', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    ...options,
  });
}
