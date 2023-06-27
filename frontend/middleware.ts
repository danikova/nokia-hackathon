import { NextRequest, NextResponse } from 'next/server';
import { getPB } from './app/_lib/pocketbase';

export async function middleware(request: NextRequest) {
  const pb = getPB(request);

  try {
    pb.authStore.isValid && (await pb.collection('users').authRefresh());
  } catch (e) {
    pb.authStore.clear();
  }

  if (!pb.authStore.isValid && !request.nextUrl.pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: ['/info/:path*', '/code/:path*', '/results/:path*', '/settings/:path*'],
};
