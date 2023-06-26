import { NextRequest, NextResponse } from 'next/server';
import { POCKETBASE_AUTH_COOKIE, getPB } from './app/_lib/pocketbase';

export async function middleware(request: NextRequest) {
  const pb = await getPB(request);

  try {
    pb.authStore.isValid && (await pb.collection('users').authRefresh());
  } catch (_) {
    pb.authStore.clear();
  }

  if (!pb.authStore.isValid && !request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  const resCookie = pb.authStore.exportToCookie();
  response.cookies.set(POCKETBASE_AUTH_COOKIE, resCookie);

  return response;
}

export const config = {
  matcher: ['/info/:path*'],
};
