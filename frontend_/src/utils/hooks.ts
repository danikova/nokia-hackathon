import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { rootRouter } from "../router";
import { tokenAtom } from "../atoms/user";
import { useNavigate } from "@tanstack/react-router";
import { useAuthWithPassword } from "@/@data/users";

export function useLogout() {
  const setToken = useSetAtom(tokenAtom);
  return () => {
    setToken(RESET);
    rootRouter.invalidate();
  };
}

export function useFormLogin(setLoading: (value: boolean) => void) {
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);
  return useAuthWithPassword({
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setToken(data.token);
      setLoading(false);
      navigate({
        to: "/",
        replace: false,
      });
    },
  });
}
