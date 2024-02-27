import axios from "axios";
import { RunStatisticResponse, RunResultResponse } from "./customViews.types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { WorkspaceRecord } from "./workspaces.types";

export function useRunStatistic(
  options?: Partial<UseQueryOptions<RunStatisticResponse, Error>>
) {
  return useQuery({
    queryKey: ["runStatistic"],
    queryFn: async () => {
      const response = await axios.get("/run_statistics/");
      return response.data;
    },
    ...options,
  });
}

export function useBestRuns(
  workspace: WorkspaceRecord,
  options?: Partial<UseQueryOptions<RunResultResponse, Error>>
) {
  return useQuery({
    queryKey: ["bestRuns"],
    queryFn: async () => {
      const response = await axios.get(
        `/run_result_sum/?workspaceId=${workspace.id}`
      );
      return response.data;
    },
    ...options,
  });
}
