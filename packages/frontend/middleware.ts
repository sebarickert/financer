import { NextRequest, NextResponse } from 'next/server';

import { getInternalApiRootAddress } from '$utils/address.helper';
import { CustomHeader } from 'src/types/custom-headers';

const isPrefetchRequest = (headers: Headers) => {
  const purpose = headers.get('purpose');
  const nextRouterPrefetch = headers.get('next-router-prefetch');

  return purpose === 'prefetch' || nextRouterPrefetch === 'true';
};

const isApiRequest = (req: NextRequest) => {
  const nextApiEndpointPrefixes = ['/api/revalidate-cache'];

  if (
    nextApiEndpointPrefixes.some((prefix) =>
      req.nextUrl.pathname.startsWith(prefix),
    )
  ) {
    return false;
  }

  return (
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/auth')
  );
};

export async function middleware(request: NextRequest) {
  if (request.method === 'GET' && request.nextUrl.pathname === '/healthz/') {
    return NextResponse.json({ status: 'ok' });
  }

  if (isApiRequest(request)) {
    return NextResponse.rewrite(
      new URL(
        `${getInternalApiRootAddress()}${request.nextUrl.pathname}${request.nextUrl.search}`,
      ),
      { request },
    );
  }

  const isPrefetch = isPrefetchRequest(request.headers);

  const requestHeaders = new Headers(request.headers);
  const responseHeaders = new Headers();

  // Pass path name to SSR components
  requestHeaders.set(CustomHeader.PATHNAME, request.nextUrl.pathname);
  // Pass query to SSR components
  requestHeaders.set(CustomHeader.QUERY, request.nextUrl.search);
  // Pass prefetch status to SSR components
  requestHeaders.set(CustomHeader.IS_PREFETCH, isPrefetch.valueOf().toString());

  return NextResponse.next({
    headers: responseHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - fonts (font files)
     * - favicon.ico (favicon file)
     * - service-worker.js (service worker file)
     */
    '/((?!_next/static|_next/image|fonts|favicon.ico|service-worker.js).*)',
  ],
};
