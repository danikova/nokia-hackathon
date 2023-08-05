'use client';

import * as z from "zod"
import { CompProps } from './Login';
import { useCallback } from 'react';
import { loginFlow } from '../actions';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { FaRegCircleUser } from 'react-icons/fa6';
import { zodResolver } from "@hookform/resolvers/zod";
import ClientForm from '../../_components/inputs/ClientForm';
import { snackbarWrapper, usePocketBase } from '../../_lib/clientPocketbase';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  userIdentifier: z.string().min(1, {
    message: 'Email or username is required.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  })
}).required();

export function PasswordLogin({ setLoading }: CompProps) {
  const pb = usePocketBase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = useCallback(
    async ({ userIdentifier, password }: z.infer<typeof formSchema>) => {
      setLoading(true);
      try {
        await snackbarWrapper(pb.collection('users').authWithPassword(userIdentifier, password), 'Successful login');
        loginFlow(pb.authStore.exportToCookie({}, process.env.NEXT_PUBLIC_PB_COOKIE_KEY));
        router.push('/info');
      } catch (_) { }
      setLoading(false);
    },
    [pb, setLoading, router]
  );

  return (
    <ClientForm form={form} onSubmit={onSubmit} className=" flex flex-col gap-8 max-md:gap-2 md:mt-12 mt-4">
      <FormField
        control={form.control}
        name="userIdentifier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User identifier</FormLabel>
            <FormControl>
              <Input placeholder="Email or Username" {...field} />
            </FormControl>
            <FormDescription>
              User identifier can be username or email address
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">
        <div className="flex justify-center">
          <FaRegCircleUser className="text-lg mr-2" />
          <p>Log in</p>
          <p className="max-md:hidden ml-1"> with email and password</p>
        </div>
      </Button>
    </ClientForm>
  );
}
