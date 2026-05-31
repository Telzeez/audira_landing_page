import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n/routing";

// This function gets the locale from cookie, path, or default
function getLocale(request: NextRequest): string {
  // 1. Check if the URL already has a locale in the path
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    // Extract locale from pathname
    const locale = pathname.split('/')[1];
    return locale;
  }

  // 2. Check cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as "en" | "de" | "fr";
  if (cookieLocale && i18n.locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Fallback to default locale
  return i18n.defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip internal paths
  const shouldSkip = /^\/(api|_next|images|favicon.ico)/.test(pathname);
  if (shouldSkip) return;

  const locale = getLocale(request);
  const pathnameHasLocale = i18n.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // If the locale is in the path, just set the cookie and continue
  if (pathnameHasLocale) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 }); // 1 year
    return response;
  }

  // Otherwise, redirect to the same path with the chosen locale prefixed
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  const response = NextResponse.redirect(newUrl);
  response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
