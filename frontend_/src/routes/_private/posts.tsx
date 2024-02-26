import { useLogout } from "../../lib/hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/posts")({
  component: Posts,
});

function Posts() {
  const logout = useLogout();

  return (
    <div className="p-2">
      Hello from Posts!<button onClick={logout}>logout</button>
    </div>
  );
}
