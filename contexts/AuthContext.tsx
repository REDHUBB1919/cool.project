'use client';

/**
 * Firebase Authentication Context
 * 이 파일은 Firebase 인증 상태를 전역적으로 관리하는 Context를 제공합니다.
 * 
 * 주요 기능:
 * 1. 사용자 인증 상태 관리 (currentUser)
 * 2. 회원가입 (signup)
 * 3. 로그인 (login)
 * 4. 로그아웃 (logout)
 * 
 * 사용 방법:
 * 1. AuthProvider로 앱을 감싸기
 * 2. useAuth 훅을 사용하여 인증 기능 접근
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '@/lib/firebase';

import { UserCredential } from 'firebase/auth'; // UserCredential import 추가

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>; // 반환 타입 수정
  login: (email: string, password: string) => Promise<UserCredential>; // 반환 타입 수정
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    // Firebase 초기화
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const authInstance = getAuth(app);
    setAuth(authInstance);

    // 인증 상태 변경 감지
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth가 초기화되지 않았습니다.");
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth가 초기화되지 않았습니다.");
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Strict; Secure; HttpOnly`;
      return result;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('존재하지 않는 이메일입니다.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('비밀번호가 올바르지 않습니다.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('유효하지 않은 이메일 형식입니다.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const logout = async () => {
    if (!auth) throw new Error("Auth가 초기화되지 않았습니다.");
    await signOut(auth);
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
