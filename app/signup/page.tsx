/**
 * 회원가입 페이지
 * 이 페이지는 새로운 사용자의 이메일/비밀번호 회원가입을 처리합니다.
 * 
 * 주요 기능:
 * 1. 이메일/비밀번호 입력 폼
 * 2. 회원가입 처리
 * 3. 에러 메시지 표시
 * 4. 회원가입 성공 시 홈페이지로 리다이렉트
 */

'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('비밀번호가 일치하지 않습니다.');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      router.push('/');
    } catch (error) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* 뒷 배경 - 페이지 미리보기 */}
      <div className="fixed inset-0">
        {/* 상단 네비게이션 바 미리보기 */}
        <div className="w-full h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6">
          <div className="flex space-x-4">
            <div className={`w-32 h-4 ${pathname === '/' ? 'bg-indigo-600' : 'bg-gray-700'} rounded`}>아이디어 입력</div>
            <div className={`w-20 h-4 ${pathname === '/summary' ? 'bg-indigo-600' : 'bg-gray-700'} rounded`}>요약</div>
            <div className={`w-24 h-4 ${pathname === '/analysis' ? 'bg-indigo-600' : 'bg-gray-700'} rounded`}>분석</div>
            <div className={`w-16 h-4 ${pathname === '/examples' ? 'bg-indigo-600' : 'bg-gray-700'} rounded`}>예시</div>
            <div className={`w-28 h-4 ${pathname === '/improve' ? 'bg-indigo-600' : 'bg-gray-700'} rounded`}>개선</div>
          </div>
        </div>
        
        {/* 페이지 컨텐츠 미리보기 - 경로에 따라 다른 미리보기 표시 */}
        <div className="container mx-auto px-4 py-8 blur-sm opacity-70">
          {pathname === '/' && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-white">창업 아이디어 분석</h1>
              <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-12 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {pathname === '/summary' && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-white">아이디어 요약</h1>
              <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
                  <div className="h-32 bg-gray-700 rounded"></div>
                  <div className="h-32 bg-gray-700 rounded"></div>
                </div>
              </div>
            </>
          )}
          
          {pathname === '/analysis' && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-white">아이디어 분석</h1>
              <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-24 bg-gray-700 rounded"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-24 bg-gray-700 rounded"></div>
                </div>
              </div>
            </>
          )}
          
          {pathname === '/examples' && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-white">아이디어 예시</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <div className="bg-gray-800 p-6 rounded-lg h-64">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-700 rounded"></div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg h-64">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-700 rounded"></div>
                </div>
              </div>
            </>
          )}
          
          {pathname === '/improve' && (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center text-white">아이디어 개선</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="bg-gray-800 p-6 rounded-lg h-64">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-700 rounded"></div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg h-64">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-700 rounded"></div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg h-64">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-40 bg-gray-700 rounded"></div>
                </div>
              </div>
            </>
          )}
          
          {/* 기본 미리보기 (다른 경로인 경우) */}
          {!['/', '/summary', '/analysis', '/examples', '/improve'].includes(pathname) && (
            <>
              <div className="w-full h-10 bg-gray-700 rounded mb-8 mx-auto max-w-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
                <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
                <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
                <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 회원가입 폼 */}
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl z-10 relative">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                이메일
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                비밀번호 확인
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <p className="text-gray-300">이미 계정이 있으신가요? 
              <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 ml-1">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
