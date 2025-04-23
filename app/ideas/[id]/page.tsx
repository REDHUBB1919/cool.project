'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getIdeaById } from '@/lib/firebase';

interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function IdeaDetailPage() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchIdea = async () => {
      try {
        setLoading(true);
        // params.id는 string | string[] | undefined 이므로 string으로 단언
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setError('잘못된 접근입니다.');
          return;
        }
        const ideaData = await getIdeaById(currentUser.uid, id);
        if (!ideaData) {
          setError('아이디어를 찾을 수 없습니다.');
          return;
        }
        setIdea(ideaData as Idea);
      } catch (err) {
        console.error('Error fetching idea:', err);
        setError('아이디어를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [currentUser, params, router]);

  if (loading) {
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

  if (!idea) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← 목록으로 돌아가기
          </button>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
          <div className="text-sm text-gray-500 mb-6">
            작성일: {new Date(idea.createdAt).toLocaleDateString()}
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{idea.description}</p>
          </div>
        </article>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.push(`/ideas/${idea.id}/edit`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            수정하기
          </button>
          <button
            onClick={() => router.push('/ideas')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-colors"
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
