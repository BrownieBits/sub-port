import { geolocation, ipAddress } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  const geo = geolocation(request);
  const ipAddy = ipAddress(request);
  const ip = ipAddy === undefined ? '0.0.0.0' : ipAddy;
  const city = geo.city === undefined ? 'Mos Eisley' : geo.city;
  const country = geo.country === undefined ? 'SW' : geo.country;
  const region = geo.countryRegion === undefined ? 'TAT' : geo.countryRegion;
  requestHeaders.set('x-geo-country', country!);
  requestHeaders.set('x-geo-city', city!);
  requestHeaders.set('x-geo-region', region!);
  requestHeaders.set('x-ip', ip!);
  if (request.nextUrl.pathname.startsWith('/dashboard') && request.cookies.get('user_id') === undefined) {
    return NextResponse.redirect(new URL(`/sign-in?redirect=${request.nextUrl.pathname}`, request.url))
  }
  if (request.nextUrl.pathname.startsWith('/sign-in') && request.cookies.get('user_id') !== undefined) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (request.nextUrl.pathname.startsWith('/sign-up') && request.cookies.get('user_id') !== undefined) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
