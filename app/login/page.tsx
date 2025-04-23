/**
 * 로그인 페이지
 * 이 페이지는 사용자의 이메일/비밀번호 로그인을 처리합니다.
 * 
 * 주요 기능:
 * 1. 이메일/비밀번호 입력 폼
 * 2. 로그인 처리
 * 3. 에러 메시지 표시
 * 4. 로그인 성공 시 홈페이지로 리다이렉트
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, login } = useAuth();

  // 이미 로그인된 사용자는 홈페이지로 리다이렉트
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
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
        
        {/* 페이지 컨텐츠 미리보기 */}
        <div className="container mx-auto px-4 py-8 blur-sm opacity-70">
          <div className="w-full h-10 bg-gray-700 rounded mb-8 mx-auto max-w-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
            <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
            <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
            <div className="bg-gray-800 p-6 rounded-lg h-64"></div>
          </div>
        </div>
      </div>
      
      {/* 로그인 폼 */}
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl z-10 relative">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            로그인
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
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? '처리 중...' : '로그인'}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <p className="text-gray-300">계정이 없으신가요? 
              <Link href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 ml-1">
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
