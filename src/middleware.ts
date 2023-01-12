import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }

  return NextResponse.next();
}
