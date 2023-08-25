'use client';

import PocketBase, { Admin, ClientResponseError, Record } from 'pocketbase';
import { atom, useAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const pocketbaseAtom = atom(() => {
  return new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
});

export function usePocketBase() {
  const [pocketbase] = useAtom(pocketbaseAtom);
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

export function useUserModel() {
  const pb = usePocketBase();
  const [model, setModel] = useState<Record | Admin | null>(null);

  useEffect(() => {
    pb.authStore.onChange((_, model) => {
      setModel(model);
    });
  }, [pb]);

  return model;
}
