'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserIdeas } from '@/lib/firebase';

interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true); // Renamed to avoid conflict
  const [error, setError] = useState('');
  const { currentUser, loading: authLoading } = useAuth(); // Get auth loading state
  const router = useRouter();

  useEffect(() => {
    // Wait until auth loading is finished
    if (authLoading) {
      return;
    }

    // If auth is loaded but no user, redirect to login
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Fetch ideas only when auth is loaded and user exists
    const fetchIdeas = async () => {
      try {
        setIdeasLoading(true); // Start ideas loading
        const userIdeas = await getUserIdeas(currentUser.uid);
        setIdeas(userIdeas as Idea[]);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError('아이디어를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIdeasLoading(false); // Finish ideas loading
      }
    };

    fetchIdeas();
    // Depend on authLoading as well
  }, [currentUser, router, authLoading]);

  // Show loading state while auth is loading OR ideas are loading
  if (authLoading || ideasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">내 아이디어 목록</h1>
        <button
          onClick={() => router.push('/submit')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          새 아이디어 작성
        </button>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg mb-4">아직 저장된 아이디어가 없습니다.</p>
          <button
            onClick={() => router.push('/submit')}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            첫 아이디어 작성하기 →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{idea.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{idea.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => router.push(`/ideas/${idea.id}`)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
