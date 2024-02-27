import { pb } from './client';
import { AuthMethodsList, RecordAuthResponse } from 'pocketbase';
import { sw } from '@/lib/utils';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { UserRecord } from './users.types';

export function useAuthMethods(
  options?: Partial<UseQueryOptions<AuthMethodsList, Error>>
) {
  return useQuery({
    queryKey: ['authMethods'],
    queryFn: async () => await sw(pb.collection('users').listAuthMethods()),
    ...options,
  });
}

interface AuthWithPasswordProps {
  usernameOrEmail: string;
  password: string;
}

export function useAuthWithPassword(
  options?: Partial<
    UseMutationOptions<
      RecordAuthResponse<UserRecord>,
      Error,
      AuthWithPasswordProps
    >
  >
) {
  return useMutation({
    mutationKey: ['auth', 'password'],
    mutationFn: async ({ usernameOrEmail, password }) =>
      await sw(
        pb
          .collection('users')
          .authWithPassword<UserRecord>(usernameOrEmail, password)
      ),
    ...options,
  });
}

interface AuthWithOAuth2Props {
  provider: string;
}

export function useAuthWithOAuth2(
  options?: Partial<
    UseMutationOptions<
      RecordAuthResponse<UserRecord>,
      Error,
      AuthWithOAuth2Props
    >
  >
) {
  return useMutation({
    mutationKey: ['auth', 'oauth2'],
    mutationFn: async ({ provider }) =>
      await sw(pb.collection('users').authWithOAuth2<UserRecord>({ provider })),
    ...options,
  });
}
