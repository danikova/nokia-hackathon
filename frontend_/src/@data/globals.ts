import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Globals, GlobalsResponse } from "./globals.type";

export function useGlobals(options?: Partial<UseQueryOptions<Globals, Error>>) {
  const { data } = useQuery({
    queryKey: ["globals"],
    queryFn: async () => {
      const globals: Globals = {};
      const response = await axios.get<GlobalsResponse>(
        "/api/collections/globals/records"
      );
      for (const item of response.data.items) {
        globals[item.key] = item.value;
      }
      return globals;
    },
    ...options,
  });
  return data ?? {};
}
