'use client';

import PocketBase from 'pocketbase';
import Button from '../_components/inputs/Button';
import Textfield from '../_components/inputs/Textfield';
import { FaGithub, FaGoogle, FaRegCircleUser } from 'react-icons/fa6';
import { Dispatch, SetStateAction, SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setPBCookie } from '../_lib/clientPocketbase';

type CompProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export default function Login() {
  const [loading, setLoading] = useState(false);

  const OAuthButtons = useMemo(() => {
    const btns = [];
    if (process.env.NEXT_PUBLIC_GOOGLE_LOGIN) btns.push(GoogleLogIn);
    if (process.env.NEXT_PUBLIC_GITHUB_LOGIN) btns.push(GithubLogIn);
    return btns;
  }, []);

  const Forms = useMemo(() => {
    const btns = [];
    if (process.env.NEXT_PUBLIC_USERNAME_LOGIN) btns.push(UsernameLogIn);
    return btns;
  }, []);

  return (
    <div className={`max-w-[500px] ${loading ? 'pointer-events-none opacity-70' : ''}`}>
      <div className="flex flex-col md:mb-12 mb-4 md:gap-8 gap-2">
        {OAuthButtons.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
      <h2 className="font-bold m-0 text-center">OR</h2>
      <div>
        {Forms.map((Comp, i) => (
          <Comp key={`${i}`} setLoading={setLoading} />
        ))}
      </div>
    </div>
  );
}

function GithubLogIn({ setLoading }: CompProps) {
  return (
    <button
      type="button"
      className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 justify-center"
    >
      <FaGithub className="text-lg mr-2" />
      Log in with Github
    </button>
  );
}

function GoogleLogIn({ setLoading }: CompProps) {
  return (
    <button
      type="button"
      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 justify-center"
    >
      <FaGoogle className="text-lg mr-2" />
      Log in with Google
    </button>
  );
}

function UsernameLogIn({ setLoading }: CompProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
        await pb.collection('users').authWithPassword(email, password);
        setPBCookie(pb);
        router.push('/info');
      } catch (_) {}
      setLoading(false);
    },
    [setLoading, email, password, router]
  );

  return (
    <form className="md:mt-12 mt-4" onSubmit={handleSubmit}>
      <Textfield
        autoComplete="new-email"
        type="text"
        placeholder="Email"
        className="md:mb-8 mb-2"
        value={email}
        onChange={(e: SyntheticEvent) => {
          //@ts-ignore
          setEmail(e.target.value);
        }}
      />
      <Textfield
        autoComplete="new-password"
        type="password"
        placeholder="Password"
        className="md:mb-8 mb-2"
        value={password}
        onChange={(e: SyntheticEvent) => {
          //@ts-ignore
          setPassword(e.target.value);
        }}
      />
      <Button type="submit" className="min-w-full" disabled={email.length === 0 || password.length === 0}>
        <div className="flex justify-center">
          <FaRegCircleUser className="text-lg mr-2" />
          <p>Log in</p>
          <p className="max-md:hidden ml-1"> with email and password</p>
        </div>
      </Button>
    </form>
  );
}
