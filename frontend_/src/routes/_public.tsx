import { tokenAtom } from "@/atoms/user";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useEffect } from "react";

export const Route = createFileRoute("/_public")({
  component: UnAuthenticated,
});

function UnAuthenticated() {
  const setToken = useSetAtom(tokenAtom);
  useEffect(() => {
    setToken(RESET);
  }, [setToken]);

  return <Outlet />;
}
