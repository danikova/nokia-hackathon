import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/settings/")({
  component: Settings,
});

function Settings() {
  return <div className="p-2">Hello from Settings!</div>;
}
