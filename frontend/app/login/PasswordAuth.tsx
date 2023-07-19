'use client';

import Button from '../_components/inputs/Button';
import Textfield from '../_components/inputs/Textfield';
import { FaRegCircleUser } from 'react-icons/fa6';
import { SyntheticEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { errSnackbar, setPBCookie, usePocketBase } from '../_lib/clientPocketbase';
import { CompProps } from './Login';
import { useForm } from 'react-hook-form';
import ErrorText from '../_components/inputs/ErrorText';
import { enqueueSnackbar } from 'notistack';

export function UsernameLogIn({ setLoading }: CompProps) {
  const pb = usePocketBase();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    async (data: any) => {
      const { identifier, password } = data;
      setLoading(true);
      try {
        await errSnackbar(pb.collection('users').authWithPassword(identifier, password));
        setPBCookie(pb);
        router.push('/info');
        enqueueSnackbar('Successful login', { variant: 'success' });
      } catch (_) { }
      setLoading(false);
    },
    [pb, setLoading, router]
  );

  return (
    <form className=" flex flex-col gap-8 max-md:gap-2 md:mt-12 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div >
        <Textfield
          autoComplete="new-email"
          type="text"
          label="User identifier"
          placeholder="Email or Username"
          {...register('identifier', { required: true })}
        />
        {errors.identifier?.type === 'required' && <ErrorText>User identifier is required.</ErrorText>}
      </div>
      <div>
        <Textfield
          autoComplete="new-password"
          type="password"
          label="Password"
          {...register('password', { required: true })}
        />
        {errors.password?.type === 'required' && <ErrorText>Password is required.</ErrorText>}
      </div>
      <Button type="submit" className="min-w-full">
        <div className="flex justify-center">
          <FaRegCircleUser className="text-lg mr-2" />
          <p>Log in</p>
          <p className="max-md:hidden ml-1"> with email and password</p>
        </div>
      </Button>
    </form>
  );
}
