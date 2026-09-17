import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from '@/features/user/user-session';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const sessionId = crypto.randomUUID();
  request.cookies.set(SESSION_COOKIE, sessionId);
  const response = NextResponse.next({ request });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
