import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';
import { getJwtPublicKey } from '@/utils/auth-config';

const PUBLIC_ROUTES = ['/login', '/register'];
const publicKey = getJwtPublicKey();
const secretPromise = importSPKI(publicKey, 'RS256');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (pathname === '/' || PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = await secretPromise
    await jwtVerify(refreshToken, secret);
    return NextResponse.next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT verification failed in middleware', error);
    } else {
      console.error('JWT verification failed in middleware');
    }
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('refresh_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|watch|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};