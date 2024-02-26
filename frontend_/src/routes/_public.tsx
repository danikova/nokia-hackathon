import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: UnAuthenticated,
});

function UnAuthenticated() {
  return (
    <div className="p-2">
      Hello from UnAuthenticated!
      <Outlet />
    </div>
  );
}
