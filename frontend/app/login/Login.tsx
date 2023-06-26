'use client';

import PocketBase from 'pocketbase';
import Button from '../_components/inputs/Button';
import Textfield from '../_components/inputs/Textfield';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { SyntheticEvent, useCallback, useState } from 'react';
import { redirect } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
        await pb.collection('users').authWithPassword(email, password);
        setEmail('');
        setPassword('');
        document.cookie = pb.authStore.exportToCookie();
        redirect('/info');
      } catch (_) {}
      setLoading(false);
    },
    [setLoading, setEmail, setPassword]
  );

  return (
    <div className={`max-w-[500px] ${loading ? 'pointer-events-none' : ''}`}>
      <div className="flex flex-col md:mb-12 mb-4 md:gap-8 gap-2">
        <button
          type="button"
          className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30"
        >
          <FaGithub className="text-lg mr-2" />
          Log in with Github
        </button>
        <button
          type="button"
          className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
        >
          <FaGoogle className="text-lg mr-2" />
          Log in with Google
        </button>
      </div>
      <h2 className="font-bold m-0 text-center">OR</h2>
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
        <Button type="submit" className="min-w-full">
          log in
        </Button>
      </form>
    </div>
  );
}
