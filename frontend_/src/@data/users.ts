import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useAuthWithPassword() {
  return useMutation({
    mutationKey: ["authWithPassword"],
    mutationFn: async ({
      identity,
      password,
    }: {
      identity: string;
      password: string;
    }) => {
      const response = await axios.post(
        "/api/collections/users/auth-with-password",
        { identity, password }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
}
