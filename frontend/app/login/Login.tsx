'use client';

import { UsernameLogIn } from './UsernameLogIn';
import { usePocketBase } from "../_lib/clientPocketbase"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { GithubLogIn, GoogleLogIn } from './Oauth';
import Spinner from '../_components/Spinner';

export type CompProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
};

type AuthMethods = {
  usernamePassword?: boolean
  emailPassword?: boolean
  authProviders?: {
    name: string;
  }[]
}

function useAuthMethods() {
  const pb = usePocketBase();
  const [authMethods, setAuthMethods] = useState<AuthMethods>({});

  useEffect(() => {
    const _ = async () => {
      const result = await pb.collection('users').listAuthMethods();
      setAuthMethods(result);
    }
    _();
  }, [pb, setAuthMethods]);

  return authMethods;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const authMethods = useAuthMethods();

  const OAuthButtons = useMemo(() => {
    const btns = [];
    for (const iterator of authMethods.authProviders || []) {
      if (iterator.name === 'google') btns.push(GoogleLogIn);
      if (iterator.name === 'github') btns.push(GithubLogIn);
    }
    return btns;
  }, [authMethods]);

  const Forms = useMemo(() => {
    const forms = [];
    if (authMethods.usernamePassword || authMethods.emailPassword) forms.push(UsernameLogIn);
    return forms;
  }, [authMethods]);

  return (
    <div className={`max-w-[500px] ${loading ? 'pointer-events-none opacity-70' : ''}`}>
      {!Object.keys(authMethods).length &&
        <div className='mt-12 h-12 flex content-center justify-center'>
          <Spinner className='h-12 w-12' />
        </div>
      }
      <div className="flex flex-col gap-8 max-md:gap-2">
        {OAuthButtons.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
      {
        (OAuthButtons.length && Forms.length)
          ? <h2 className="font-bold my-12 max-md:my-4 text-center">OR</h2>
          : null
      }
      <div>
        {Forms.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
    </div>
  );
}



