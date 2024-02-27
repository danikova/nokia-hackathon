import { useMemo, useState } from 'react';
import Spinner from '@/components/spinner';
import { useAuthMethods } from '@/@data/users';
import { PasswordLogin } from './-components/forms';
import { createFileRoute } from '@tanstack/react-router';
import { GithubLogIn, GoogleLogIn } from './-components/oauth';
import { LoginLayout } from '@/layouts/login';
import { LoginComponent } from './-components/type';

export const Route = createFileRoute('/_public/login')({
  component: Login,
});

function Login() {
  return (
    <LoginLayout>
      <LoginLogic />
    </LoginLayout>
  );
}

function LoginLogic() {
  const [loading, setLoading] = useState(false);
  const { data: authMethods, status } = useAuthMethods();

  const OAuthButtons = useMemo<LoginComponent[]>(() => {
    const oAuthButtons = [];
    const providerNames = (authMethods?.authProviders ?? []).map(i => i.name);
    if (providerNames.includes('google')) oAuthButtons.push(GoogleLogIn);
    if (providerNames.includes('github')) oAuthButtons.push(GithubLogIn);
    return oAuthButtons;
  }, [authMethods]);

  const Forms = useMemo<LoginComponent[]>(() => {
    const forms = [];
    if (authMethods?.usernamePassword || authMethods?.emailPassword)
      forms.push(PasswordLogin);
    return forms;
  }, [authMethods]);

  return (
    <div
      className={`max-w-[500px] ${loading ? 'pointer-events-none opacity-70' : ''}`}
    >
      {status === 'pending' && (
        <div className="mt-12 flex h-12 content-center justify-center">
          <Spinner className="h-12 w-12" />
        </div>
      )}
      <div className="flex flex-col gap-8 max-md:gap-2">
        {OAuthButtons.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
      {OAuthButtons.length && Forms.length ? (
        <h2 className="my-12 text-center font-bold max-md:my-4">OR</h2>
      ) : null}
      <div>
        {Forms.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
    </div>
  );
}
