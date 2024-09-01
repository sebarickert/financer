import { NextRequest, NextResponse } from 'next/server';

const getBackendAddress = () =>
  process.env.INTERNAL_API_ROOT_ADDRESS ?? 'http://localhost:4000';

const isPrefetchRequest = (headers: Headers) => {
  const purpose = headers.get('purpose');
  const nextRouterPrefetch = headers.get('next-router-prefetch');

  return purpose === 'prefetch' || nextRouterPrefetch === 'true';
};

const isApiRequest = (req: NextRequest) => {
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
        `${getBackendAddress()}${request.nextUrl.pathname}${request.nextUrl.search}`,
      ),
      { request },
    );
  }

  const isPrefetch = isPrefetchRequest(request.headers);

  const requestHeaders = new Headers(request.headers);
  const responseHeaders = new Headers();

  // Pass path name to SSR components
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  // Pass query to SSR components
  requestHeaders.set('x-query', request.nextUrl.search);
  // Pass prefetch status to SSR components
  requestHeaders.set('x-is-prefetch', isPrefetch.valueOf().toString());

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
