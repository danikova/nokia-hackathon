import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export function getPB(req?: NextRequest) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);
  const pbCookie = (req?.cookies || cookies()).get(process.env.NEXT_PUBLIC_PB_COOKIE_KEY as string);
  const pbData = JSON.parse(pbCookie?.value || '{}');
  pb.authStore.save(pbData.token || '', pbData.model || null);
  return pb;
}
