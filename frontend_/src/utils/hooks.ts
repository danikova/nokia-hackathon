import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { rootRouter } from "../router";
import { tokenAtom } from "../@atoms/user";

export function useLogout() {
  const setToken = useSetAtom(tokenAtom);
  return () => {
    setToken(RESET);
    rootRouter.invalidate();
  };
}
