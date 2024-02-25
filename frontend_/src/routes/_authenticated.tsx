import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

function isAuthenticated() {
  return false;
}

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "",
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
    <div className="p-2">
      Hello from Authenticated!
      <Outlet />
    </div>
  );
}
