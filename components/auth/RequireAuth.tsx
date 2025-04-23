'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!currentUser) {
    // 컨텐츠를 블러 처리하고 로그인 모달 표시
    return (
      <>
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
        {showLoginModal ? (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        ) : (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="bg-background p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">로그인이 필요한 기능입니다</h2>
              <p className="text-muted-foreground mb-6">
                이 기능을 사용하려면 먼저 로그인해주세요.
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
} 