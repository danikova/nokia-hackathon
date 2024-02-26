import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/info/")({
  component: Info,
});

function Info() {
  return <div className="p-2">Hello from Info!</div>;
}
