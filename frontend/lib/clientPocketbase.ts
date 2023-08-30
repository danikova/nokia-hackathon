'use client';

import { atom, useAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import PocketBase, { Admin, ClientResponseError, Record } from 'pocketbase';

export const clientPocketbaseAtom = atom(() => {
  return new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
});
export const userModelAtom = atom<Record | Admin | null>(null);

export function usePocketBase() {
  const [pocketbase] = useAtom(clientPocketbaseAtom);
  return pocketbase;
}

export async function snackbarWrapper<T extends Object>(pbPromise: T, successMessage?: string): Promise<T> {
  try {
    const result = await pbPromise;
    successMessage && enqueueSnackbar(successMessage, { variant: 'success' });
    return result;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      enqueueSnackbar(error.message, { variant: 'error', preventDuplicate: true });
    } else {
      enqueueSnackbar('Some unexpected error occured, sorry :(', { variant: 'error', preventDuplicate: true });
    }
    throw error;
  }
}
