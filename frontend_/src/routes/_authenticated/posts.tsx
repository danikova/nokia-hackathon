import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/posts")({
  component: Posts,
});

function Posts() {
  return <div className="p-2">Hello from Posts!</div>;
}
