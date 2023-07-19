'use client';

import Button from '../_components/inputs/Button';
import Textfield from '../_components/inputs/Textfield';
import { FaRegCircleUser } from 'react-icons/fa6';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { errSnackbar, setPBCookie, usePocketBase } from '../_lib/clientPocketbase';
import { CompProps } from './Login';

export function UsernameLogIn({ setLoading }: CompProps) {
  const pb = usePocketBase();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await errSnackbar(pb.collection('users').authWithPassword(email, password));
        setPBCookie(pb);
        router.push('/info');
      } catch (_) { }
      setLoading(false);
    },
    [pb, setLoading, email, password, router]
  );

  return (
    <form className="md:mt-12 mt-4" onSubmit={handleSubmit}>
      <Textfield
        autoComplete="new-email"
        type="text"
        label="User identifier"
        placeholder="Email or Username"
        className="md:mb-8 mb-2"
        value={email}
        onChange={(e: SyntheticEvent) => {
          //@ts-ignore
          setEmail(e.target.value);
        }} />
      <Textfield
        autoComplete="new-password"
        type="password"
        label="Password"
        className="md:mb-8 mb-2"
        value={password}
        onChange={(e: SyntheticEvent) => {
          //@ts-ignore
          setPassword(e.target.value);
        }} />
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
