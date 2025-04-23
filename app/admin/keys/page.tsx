'use client';

import { useEffect, useState } from 'react';
// import { getApiKey, setApiKey, deleteApiKey } from '@/lib/apiKeyManager';
import { db } from '@/lib/firebase';

interface ApiKeyInfo {
  key: string;
  generatedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
}

// Redis 관련 함수 호출을 Firebase Firestore로 대체
async function getApiKey(userId: string) {
  const doc = await db.collection('apiKeys').doc(userId).get();
  return doc.exists ? doc.data()?.apiKey : null;
}

async function setApiKey(userId: string, apiKey: string) {
  await db.collection('apiKeys').doc(userId).set({ apiKey });
}

async function deleteApiKey(userId: string) {
  await db.collection('apiKeys').doc(userId).delete();
}

export default function ApiKeyManagement() {
  const [keys, setKeys] = useState<Map<string, ApiKeyInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // API 키 정보 로드
    const loadKeys = async () => {
      try {
        const keyInfo = await apiKeyManager.getAllKeys();
        setKeys(keyInfo);
        setError(null);
      } catch (err) {
        setError('API 키 정보를 불러오는데 실패했습니다.');
        console.error('API 키 로드 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKeys();
    // 1분마다 키 상태 확인
    const interval = setInterval(async () => {
      try {
        await apiKeyManager.checkKeyRotation();
      } catch (err) {
        console.error('키 순환 확인 에러:', err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API 키 관리</h1>
      
      <div className="grid gap-4">
        {Array.from(keys.entries()).map(([keyName, info]) => {
          const expiryDate = new Date(info.expiresAt);
          const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={keyName} className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold">{keyName}</h2>
              <div className="mt-2 space-y-1">
                <p>생성일: {new Date(info.generatedAt).toLocaleDateString()}</p>
                <p>만료일: {expiryDate.toLocaleDateString()}</p>
                <p>상태: {info.status}</p>
                <p className={daysUntilExpiry <= 30 ? 'text-red-500' : 'text-green-500'}>
                  만료까지 {daysUntilExpiry}일 남음
                </p>
              </div>
              {daysUntilExpiry <= 30 && (
                <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
                  ⚠️ 키 순환이 필요합니다
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 