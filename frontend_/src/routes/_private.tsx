import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredToken } from "../atoms/user";
import { DashboardLayout } from "@/layouts/dashboard";

function isAuthenticated() {
  const token = getStoredToken();
  return token !== null;
}

export const Route = createFileRoute("/_private")({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Authenticated,
});

function Authenticated() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
