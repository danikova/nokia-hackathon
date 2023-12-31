import { NextRequest, NextResponse } from 'next/server';
import { getPB } from '@/lib/pocketbase';

const staffRoutes = ['/ranking'];

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

  if (staffRoutes.includes(request.nextUrl.pathname) && pb.authStore.model?.role !== 'staff') {
    const url = request.nextUrl.clone();
    url.pathname = '/info';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const cookieStr = pb.authStore.exportToCookie();
  response.headers.append('set-cookie', cookieStr.replace('pb_auth', process.env.NEXT_PUBLIC_PB_COOKIE_KEY as string));
  return response;
}

export const config = {
  matcher: [
    '/info/:path*',
    '/code/:path*',
    '/results/:path*',
    '/scoreboard/:path*',
    '/settings/:path*',

    '/ranking/:path*',
  ],
};
