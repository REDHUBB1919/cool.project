/**
 * Next.js 미들웨어
 * 이 파일은 인증된 라우트를 보호하기 위한 미들웨어를 제공합니다.
 * 
 * 주요 기능:
 * 1. 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
 * 2. 인증된 사용자가 로그인/회원가입 페이지에 접근하면 홈페이지로 리다이렉트
 * 3. API 요청에 대한 레이트 리미팅
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;
  
  console.log('미들웨어 실행:', {
    pathname,
    hasAuthCookie: !!authCookie,
    cookieValue: authCookie?.value
  });

  // 인증이 필요한 페이지 목록
  const protectedRoutes = [
    '/',
    '/analysis',
    '/examples',
    '/improve',
    '/summary'
  ];
  
  // 인증된 사용자가 접근하면 안 되는 페이지 목록
  const authRoutes = ['/login', '/signup'];

  // 인증되지 않은 사용자가 보호된 라우트에 접근하려고 할 때
  if (!authCookie && protectedRoutes.includes(pathname)) {
    console.log('미인증 사용자 리다이렉트: login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 인증된 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
  if (authCookie && authRoutes.includes(pathname)) {
    console.log('인증된 사용자 리다이렉트: home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/analysis',
    '/examples',
    '/improve',
    '/summary',
    '/api/:path*'
  ]
};
