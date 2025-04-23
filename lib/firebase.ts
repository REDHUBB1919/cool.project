/**
 * Firebase 초기화 및 설정 파일
 * 이 파일은 Firebase 서비스의 초기화와 설정을 담당합니다.
 * 
 * 주요 기능:
 * 1. Firebase 앱 초기화
 * 2. Analytics 설정 (클라이언트 사이드에서만 동작)
 * 3. Authentication 설정
 * 4. Firestore 설정
 * 
 * 사용 방법:
 * 다른 파일에서 이 파일을 import하여 Firebase 서비스를 사용할 수 있습니다.
 * 예: import { app, auth, db } from '@/lib/firebase';
 */

// Firebase SDK에서 필요한 함수들을 import
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

/**
 * Firebase 프로젝트 설정
 * 환경변수에서 가져온 프로젝트 설정값들입니다.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics는 클라이언트 사이드에서만 초기화
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, auth, storage, analytics };
