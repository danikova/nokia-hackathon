'use client';

import PocketBase, { ClientResponseError } from 'pocketbase';
import { atom, useAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';

const pocketbaseAtom = atom(() => {
  return new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
});

export function usePocketBase() {
  const [pocketbase] = useAtom(pocketbaseAtom);
  return pocketbase;
}

export function setPBCookie(pb: PocketBase) {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false }, process.env.NEXT_PUBLIC_PB_COOKIE_KEY);
}

export async function snackbarWrapper<T extends Object>(pbPromise: T, successMessage?: string): Promise<T> {
  try {
    const result = await pbPromise;
    successMessage && enqueueSnackbar(successMessage, { variant: 'success' });
    return result;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      enqueueSnackbar(error.message, { variant: 'error', preventDuplicate: true });
    }
    throw error;
  }
}
