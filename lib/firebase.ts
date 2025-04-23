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
// import { getAuth } from "firebase/auth"; // No longer needed globally here
import { setDoc, doc, collection, getDocs, query, where, getDoc, collectionGroup } from "firebase/firestore"; // Added Firestore

// 필수 환경변수 목록 (참고용)
// const requiredEnvVars = [
//   'NEXT_PUBLIC_FIREBASE_API_KEY',
//   'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
//   'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
//   'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
//   'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
//   'NEXT_PUBLIC_FIREBASE_APP_ID'
// ];

// 환경 변수 디버깅 로그 제거 (클라이언트 측 로드 시점 혼란 야기)
// console.log('=== 환경 변수 디버깅 시작 ===');
// console.log('실행 환경:', typeof window !== 'undefined' ? '클라이언트' : '서버');
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('process.env 키 목록:', Object.keys(process.env).filter(key => key.includes('NEXT_PUBLIC')));
// requiredEnvVars.forEach(envVar => {
//   console.log(`${envVar}:`, process.env[envVar] ? '설정됨' : '설정되지 않음');
// });
// console.log('=== 환경 변수 디버깅 끝 ===');

// 환경 변수 검증 로직 제거 (Next.js 빌드 프로세스가 처리하도록 위임)
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     // 이 부분에서 클라이언트 사이드 실행 시 process.env가 비어있어 오류 발생 가능성 있음
//     console.error(`${envVar} is not set. Check your .env file.`);
//     // throw new Error(`${envVar}가 설정되지 않았습니다. .env 파일을 확인해주세요.`);
//   }
// }

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

// firebaseConfig 객체를 export 합니다.
// export { firebaseConfig }; // Already exported above

// --- Helper functions for lazy initialization ---

// Function to get the initialized Firebase app
const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    // If no app is initialized (e.g., called from a non-auth page before AuthProvider), initialize it.
    // console.warn("Firebase app not initialized yet. Initializing now."); // Remove warning
    return initializeApp(firebaseConfig);
  }
  // Otherwise, return the already initialized app (likely by AuthProvider)
  return getApps()[0];
};

// Function to get the initialized Firestore instance
const getDb = (): Firestore => {
  const app = getFirebaseApp();
  return getFirestore(app);
}

// Function to get initialized Analytics instance (client-side only)
const getAnalyticsInstance = () => {
  if (typeof window !== 'undefined') {
    const app = getFirebaseApp();
    return getAnalytics(app);
  }
  return null;
}

// Export the function to get analytics instance lazily, instead of the instance itself.
// export const getAnalyticsInstance = getAnalyticsInstance; // Remove redundant export causing redeclaration error
// export const analytics = getAnalyticsInstance(); // Remove top-level initialization

// --- Firestore Utility Functions (using lazy db initialization) ---

/**
 * 사용자의 아이디어를 Firestore에 저장하는 함수
 * @param userId - 사용자 ID
 * @param ideaId - 아이디어 ID
 * @param ideaData - 저장할 아이디어 데이터
 */
export async function saveUserIdea(userId: string, ideaId: string, ideaData: any) {
  const db = getDb(); // Get db instance lazily
  try {
    // 사용자의 ideas 하위 컬렉션에 아이디어 데이터 저장
    await setDoc(doc(db, 'users', userId, 'ideas', ideaId), {
      ...ideaData,
      createdAt: new Date().toISOString()  // 생성 시간 추가
    });
  } catch (error) {
    console.error('Error saving idea:', error);
    throw error;
  }
}

/**
 * 사용자의 모든 아이디어를 Firestore에서 가져오는 함수
 * @param userId - 사용자 ID
 * @returns 아이디어 배열
 */
export async function getUserIdeas(userId: string) {
  const db = getDb(); // Get db instance lazily
  try {
    // 사용자의 ideas 컬렉션 참조 생성
    const ideasRef = collection(db, 'users', userId, 'ideas');
    const querySnapshot = await getDocs(ideasRef);

    // 문서 데이터를 배열로 변환
    const ideas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return ideas;
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }
}

/**
 * 특정 아이디어를 ID로 조회하는 함수
 * @param userId - 사용자 ID
 * @param ideaId - 아이디어 ID
 * @returns 아이디어 데이터 또는 null
 */
export async function getIdeaById(userId: string, ideaId: string) {
  const db = getDb(); // Get db instance lazily
  try {
    // 특정 아이디어 문서 참조 생성
    const ideaRef = doc(db, 'users', userId, 'ideas', ideaId);
    const ideaDoc = await getDoc(ideaRef);

    // 문서가 존재하지 않으면 null 반환
    if (!ideaDoc.exists()) {
      return null;
    }
    
    // 문서 데이터 반환
    return {
      id: ideaDoc.id,
      ...ideaDoc.data()
    };
  } catch (error) {
    console.error('Error getting idea:', error);
    throw error;
  }
}

/**
 * 분석 결과를 공유 가능한 형태로 저장하는 함수
 * @param userId - 사용자 ID
 * @param resultData - 저장할 분석 결과 데이터
 * @returns 생성된 결과 ID
 */
export async function saveSharedResult(userId: string, resultData: any) {
  const db = getDb(); // Get db instance lazily
  try {
    // sharedResults 컬렉션 참조 생성
    const sharedResultsRef = collection(db, 'users', userId, 'sharedResults');
    const newResultRef = doc(sharedResultsRef);

    // 결과 데이터 저장
    await setDoc(newResultRef, {
      ...resultData,
      createdAt: new Date().toISOString(),  // 생성 시간 추가
      userId                                  // 사용자 ID 추가
    });
    
    return newResultRef.id;  // 생성된 결과 ID 반환
  } catch (error) {
    console.error('Error saving shared result:', error);
    throw error;
  }
}

/**
 * 공유된 분석 결과를 조회하는 함수
 * @param resultId - 결과 ID
 * @returns 분석 결과 데이터
 */
export async function getSharedResult(resultId: string) {
  const db = getDb(); // Get db instance lazily
  try {
    // 모든 사용자의 sharedResults 컬렉션에서 결과를 찾습니다
    const sharedResultsRef = collectionGroup(db, 'sharedResults');
    const q = query(sharedResultsRef, where('__name__', '==', resultId));
    const querySnapshot = await getDocs(q);

    // 결과가 없으면 null 반환
    if (querySnapshot.empty) {
      return null;
    }
    
    // 첫 번째 결과 반환
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting shared result:', error);
    throw error;
  }
}

export { app, db, auth, storage };
