'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSharedResult } from '@/lib/firebase';
import AIAnalysis from '@/app/components/AIAnalysis';

interface SharedResult {
  id: string;
  ideas: any[];
  analysisResult: any;
  createdAt: string;
  userId: string;
}

export default function SharedResultPage() {
  const [result, setResult] = useState<SharedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        // params.id는 string | string[] | undefined 이므로 string으로 단언
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setError('잘못된 접근입니다.');
          return;
        }
        const resultData = await getSharedResult(id);
        if (!resultData) {
          setError('공유된 결과를 찾을 수 없습니다.');
          return;
        }
        setResult(resultData as SharedResult);
      } catch (err) {
        console.error('Error fetching shared result:', err);
        setError('결과를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl font-semibold text-white">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl font-semibold text-red-400">{error}</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">공유된 아이디어 분석</h1>
            <p className="text-gray-400">
              공유일: {new Date(result.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <AIAnalysis ideas={result.ideas} />
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
