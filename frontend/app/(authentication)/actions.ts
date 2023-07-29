'use server';

import { cookies } from 'next/headers';
import cookie from 'cookie';

export async function loginFlow(cookieValueStr: string) {
  const cookieKey = process.env.NEXT_PUBLIC_PB_COOKIE_KEY as string;
  const cookieValue = cookie.parse(cookieValueStr);
  cookies().set({
    name: cookieKey,
    value: cookieValue[cookieKey],
    path: cookieValue['Path'],
    expires: new Date(cookieValue['Expires']),
    sameSite: 'strict',
  });
}

export async function logoutFlow() {
  const cookieKey = process.env.NEXT_PUBLIC_PB_COOKIE_KEY as string;
  cookies().delete(cookieKey);
}
