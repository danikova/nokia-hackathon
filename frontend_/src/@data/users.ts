import axios from "axios";
import { AuthMethodsResponse } from "./users.types";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useAuthMethods(
  options?: Partial<UseQueryOptions<AuthMethodsResponse, Error>>
) {
  return useQuery({
    queryKey: ["authMethods"],
    queryFn: async () => {
      const response = await axios.get("/api/collections/users/auth-methods");
      return response.data;
    },
    ...options,
  });
}
