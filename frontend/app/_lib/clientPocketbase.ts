import PocketBase from 'pocketbase';
import { useMemo } from 'react';

export function usePocketBase() {
  const pb = useMemo(() => {
    return new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
  }, []);
  return pb;
}

export function setPBCookie(pb: PocketBase) {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false }, process.env.NEXT_PUBLIC_PB_COOKIE_KEY);
}
