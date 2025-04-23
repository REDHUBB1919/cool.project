/**
 * 아이디어 요약/분석 페이지
 * 이 페이지는 사용자의 아이디어를 Firestore에서 가져와 표시합니다.
 * 
 * 주요 기능:
 * 1. 사용자의 아이디어 목록 표시 (최대 10개)
 * 2. AI 생성 요약 표시
 * 3. 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserIdeas } from '@/lib/firebase';
import StartupSummary from '@/components/startup-summary';
import RequireAuthOverlay from '@/app/components/RequireAuthOverlay';

// 아이디어 타입 정의
interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function SummaryPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();

  // 사용자가 로그인하지 않았으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // 사용자의 아이디어 가져오기
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userIdeas = await getUserIdeas(currentUser.uid);
        // 타입 단언을 사용하여 Idea[] 타입으로 변환
        setIdeas(userIdeas as Idea[]);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError('아이디어를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [currentUser]);

  // 로그인하지 않은 경우 빈 페이지 반환 (리다이렉트 전에 잠시 표시됨)
  if (!currentUser) {
    return null;
  }

  return (
    <RequireAuthOverlay>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          아이디어 요약
        </h1>
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="text-xl font-semibold">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="text-xl font-semibold text-red-600">{error}</div>
          </div>
        ) : (
          <StartupSummary />
        )}
      </main>
    </RequireAuthOverlay>
  );
}
