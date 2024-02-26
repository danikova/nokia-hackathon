import { useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
import { useAuthMethods } from "@/@data/users";
import { PasswordLogin } from "./-components/forms";
import { createFileRoute } from "@tanstack/react-router";
import { GithubLogIn, GoogleLogIn } from "./-components/oauth";

export const Route = createFileRoute("/_public/login")({
  component: Login,
});

function Login() {
  const [loading, setLoading] = useState(false);
  const { data: authMethods, status } = useAuthMethods();

  const OAuthButtons = useMemo(() => {
    const oAuthButtons = [];
    const providerNames = (authMethods?.authProviders ?? []).map((i) => i.name);
    if (providerNames.includes("google")) oAuthButtons.push(GoogleLogIn);
    if (providerNames.includes("github")) oAuthButtons.push(GithubLogIn);
    return oAuthButtons;
  }, [authMethods]);

  const Forms = useMemo(() => {
    const forms = [];
    if (authMethods?.usernamePassword || authMethods?.emailPassword)
      forms.push(PasswordLogin);
    return forms;
  }, [authMethods]);

  return (
    <div
      className={`max-w-[500px] ${loading ? "pointer-events-none opacity-70" : ""}`}
    >
      {status === "pending" && (
        <div className="mt-12 h-12 flex content-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      )}
      <div className="flex flex-col gap-8 max-md:gap-2">
        {OAuthButtons.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
      {OAuthButtons.length && Forms.length ? (
        <h2 className="font-bold my-12 max-md:my-4 text-center">OR</h2>
      ) : null}
      <div>
        {Forms.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
    </div>
  );
}
