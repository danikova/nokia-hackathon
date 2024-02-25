import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_un_authenticated/login")({
  component: Login,
});

function Login() {
  return <div className="p-2">Hello from Login!</div>;
}
