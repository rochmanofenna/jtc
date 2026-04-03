import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Minimal proxy (Next.js 16 replacement for middleware).
 *
 * We use cookie-based locale detection (not URL prefixes), so this proxy
 * simply reads the "locale" cookie and forwards it as a request header
 * so that next-intl's getRequestConfig can access it server-side.
 */
export function proxy(request: NextRequest) {
  const locale = request.cookies.get('locale')?.value ?? 'id';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
