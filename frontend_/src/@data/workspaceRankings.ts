import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  WorkspaceRankingRecord,
  WorkspaceRankingResponse,
} from './workspaceRankings.types';

export function useWorkspaceRankings(
  options?: Partial<UseQueryOptions<WorkspaceRankingResponse, Error>>,
  onChange?: (data: WorkspaceRankingRecord) => void // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  return useQuery({
    queryKey: ['workspaceRankings'],
    queryFn: async () => {
      const response = await axios.get(
        '/api/collections/workspace_rankings/records'
      );
      return response.data;
    },
    ...options,
  });
}
