import axios from 'axios';
import { RunResultsResponse } from './runResults.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useRunResults(
  options?: Partial<UseQueryOptions<RunResultsResponse, Error>>
) {
  return useQuery({
    queryKey: ['runResults'],
    queryFn: async () => {
      const response = await axios.get('/api/collections/run_results/records');
      return response.data;
    },
    ...options,
  });
}
