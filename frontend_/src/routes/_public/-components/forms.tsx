import * as z from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaRegCircleUser } from 'react-icons/fa6';
import ClientForm from '@/components/ui/clientForm';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { pb } from '@/@data/client';
import { UserRecord } from '@/@data/users.types';
import { useNavigate } from '@tanstack/react-router';
import { pbSnackbarWrapper } from '@/lib/utils';
import { LoginComponentProps } from './type';

const formSchema = z
  .object({
    userIdentifier: z.string().min(1, {
      message: 'Email or username is required.',
    }),
    password: z.string().min(1, {
      message: 'Password is required.',
    }),
  })
  .required();

function useOnSubmit(setLoading: LoginComponentProps['setLoading']) {
  const navigate = useNavigate();

  return useCallback(
    async ({ userIdentifier, password }: z.infer<typeof formSchema>) => {
      setLoading(true);
      await pbSnackbarWrapper(
        pb
          .collection('users')
          .authWithPassword<UserRecord>(userIdentifier, password),
        'Successful login'
      );
      setLoading(false);
      navigate({
        to: '/',
        replace: false,
      });
    },
    [setLoading, navigate]
  );
}

export function PasswordLogin({ setLoading }: LoginComponentProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = useOnSubmit(setLoading);

  return (
    <ClientForm
      form={form}
      onSubmit={onSubmit}
      className=" mt-4 flex flex-col gap-8 max-md:gap-2 md:mt-12"
    >
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
          <FaRegCircleUser className="mr-2 text-lg" />
          <p>Log in</p>
          <p className="ml-1 max-md:hidden"> with email and password</p>
        </div>
      </Button>
    </ClientForm>
  );
}
