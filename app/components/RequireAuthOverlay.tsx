'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';

interface RequireAuthOverlayProps {
  children: React.ReactNode;
}

export default function RequireAuthOverlay({ children }: RequireAuthOverlayProps) {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setShowModal(true);
    }
  }, [currentUser]);

  const handleCloseModal = () => {
    if (currentUser) {
      setShowModal(false);
    }
  };

  return (
    <div className="relative">
      <div className={currentUser ? '' : 'blur-sm opacity-30 pointer-events-none'}>
        {children}
      </div>
      {showModal && !currentUser && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <LoginModal onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}
