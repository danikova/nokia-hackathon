import { createFileRoute } from "@tanstack/react-router";
import { useAuthWithPassword } from "../../@data/users";

export const Route = createFileRoute("/_public/login")({
  component: Login,
});

function Login() {
  const { data, mutate } = useAuthWithPassword();

  console.log(data);

  return (
    <div className="p-2">
      Hello from Login!
      <button
        onClick={() => {
          mutate({ identity: "asd", password: "123qweasd" });
        }}
      >
        login
      </button>
    </div>
  );
}
