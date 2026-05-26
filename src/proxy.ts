import { NextResponse, type NextRequest } from "next/server";

/**
 * İstek yolunu (pathname) bir header olarak iletir; admin layout bu sayede
 * login sayfasını guard'dan muaf tutabilir.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
