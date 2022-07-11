import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname == '/') {
    return NextResponse.rewrite(new URL('/auth/signIn', request.url));
  }
  return NextResponse.rewrite(url);
}
