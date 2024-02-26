import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/posts")({
  component: Posts,
});

function Posts() {
  return <div className="p-2">Hello from Posts!</div>;
}
