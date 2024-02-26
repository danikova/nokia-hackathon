import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { rootRouter } from "../router";
import { tokenAtom, userAtom } from "../atoms/user";
import { useAuthWithPassword } from "@/@data/users";
import { MutableRefObject, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function useOutsideClickObserver(
  ref: MutableRefObject<any>,
  onNotClick: (event: MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onNotClick(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onNotClick]);
}

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
  const setUser = useSetAtom(userAtom);

  return useAuthWithPassword({
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.record);
      setLoading(false);
      navigate({
        to: "/",
        replace: false,
      });
    },
  });
}
