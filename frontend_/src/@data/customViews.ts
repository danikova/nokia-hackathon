import axios from 'axios';
import {
  RunStatisticResponse,
  RunResultSumResponse,
} from './customViews.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { WorkspaceRecord } from './workspaces.types';

export function useRunStatistics(
  options?: Partial<UseQueryOptions<RunStatisticResponse, Error>>
) {
  return useQuery({
    queryKey: ['runStatistic'],
    queryFn: async () => {
      const response = await axios.get('/custom_api/run_statistics/');
      return response.data;
    },
    ...options,
  });
}

export function useBestRuns(
  workspace: WorkspaceRecord,
  options?: Partial<UseQueryOptions<RunResultSumResponse, Error>>
) {
  return useQuery({
    queryKey: ['bestRuns'],
    queryFn: async () => {
      const response = await axios.get(
        `/custom_api/run_result_sum/?workspaceId=${workspace.id}`
      );
      return response.data;
    },
    ...options,
  });
}
