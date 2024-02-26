import axios from "axios";
import { AuthMethodsResponse, AuthResponse } from "./users.type";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

interface AuthProps {
  identity: string;
  password: string;
}

export function useAuthWithPassword(
  options?: Partial<UseMutationOptions<AuthResponse, Error, AuthProps>>
) {
  return useMutation({
    mutationKey: ["authWithPassword"],
    mutationFn: async ({ identity, password }: AuthProps) => {
      const response = await axios.post(
        "/api/collections/users/auth-with-password",
        { identity, password }
      );
      return response.data;
    },
    ...options,
  });
}

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
