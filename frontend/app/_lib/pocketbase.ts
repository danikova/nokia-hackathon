import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const POCKETBASE_AUTH_COOKIE = 'pb-auth';

export async function getPB(req?: NextRequest) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_HOST);

  const reqCookie = (req?.cookies || cookies()).get(POCKETBASE_AUTH_COOKIE);
  pb.authStore.loadFromCookie(reqCookie?.value as string);
  console.log(reqCookie?.value);

  return pb;
}
