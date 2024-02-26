import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/scoreboard/")({
  component: Scoreboard,
});

function Scoreboard() {
  return <div className="p-2">Hello from Scoreboard!</div>;
}
