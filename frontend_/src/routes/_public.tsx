import { useEffect } from "react";
import { pb } from "@/@data/client";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: UnAuthenticated,
});

function UnAuthenticated() {
  useEffect(() => {
    pb.authStore.clear();
  }, []);

  return <Outlet />;
}
