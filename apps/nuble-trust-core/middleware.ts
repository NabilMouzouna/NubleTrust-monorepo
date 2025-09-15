import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const responseHeaders = new Headers();
  responseHeaders.set('Access-Control-Allow-Origin', 'http://localhost:3001'); // Hardcoded for debugging
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  responseHeaders.set('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: responseHeaders });
  }

  // Handle actual request
  const response = NextResponse.next();
  responseHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};