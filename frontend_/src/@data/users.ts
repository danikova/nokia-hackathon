import axios from "axios";
import { AuthResponse } from "./users.type";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

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
