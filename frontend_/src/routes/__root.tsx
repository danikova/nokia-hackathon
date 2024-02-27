import "../globals.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.min.css";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { pb } from "@/@data/client";
import { userAtom } from "@/atoms/user";
import { UserRecord } from "@/@data/users.types";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <UserUpdater />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools />
    </>
  ),
});

function UserUpdater() {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    return pb.authStore.onChange((_, model) => {
      setUser(model as UserRecord);
    });
  }, [setUser]);

  return null;
}
