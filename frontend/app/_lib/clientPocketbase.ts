'use client';

import PocketBase from 'pocketbase';
import { atom, useAtom } from 'jotai';

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
