import axios from 'axios';
import { RuntTasksResponse } from './runTasks.types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export function useRunTasks(
  options?: Partial<UseQueryOptions<RuntTasksResponse, Error>>
) {
  return useQuery({
    queryKey: ['runTasks'],
    queryFn: async () => {
      const response = await axios.get('/api/collections/run_tasks/records');
      return response.data;
    },
    ...options,
  });
}
