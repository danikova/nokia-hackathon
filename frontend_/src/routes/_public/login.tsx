import { useSetAtom } from "jotai";
import { tokenAtom } from "../../@atoms/user";
import { useAuthWithPassword } from "../../@data/users";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);
  const { mutate } = useAuthWithPassword({
    onSuccess: (data) => {
      setToken(data.token);
      navigate({
        to: "/",
        replace: false,
      });
    },
  });

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
