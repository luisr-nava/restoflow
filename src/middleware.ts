import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "./lib/supabase/middleware";

const STAFF_SESSION_COOKIE = "restoflow_staff_session";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/staff/login")) {
    return await updateSession(request);
  }

  if (pathname.startsWith("/staff")) {
    const staffSession = request.cookies.get(STAFF_SESSION_COOKIE);

    if (!staffSession?.value) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }

    return await updateSession(request);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
