/**
 * API 키 관리 유틸리티
 * 이 파일은 API 키의 순환과 관리를 담당합니다.
 * 
 * 주요 기능:
 * 1. API 키 생성일 확인
 * 2. 키 순환 필요성 검사
 * 3. 키 순환 알림
 * 4. Firebase Firestore를 사용한 영구 저장
 */

import { logger } from './logger';
import { db } from './firebase';

interface ApiKeyInfo {
  key: string;
  generatedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
}

class ApiKeyManager {
  private static instance: ApiKeyManager;
  private readonly COLLECTION_NAME = 'apiKeys';

  private constructor() {
    this.initializeKeys();
  }

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  private async initializeKeys() {
    // 환경 변수에서 API 키 정보 로드
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (groqKey) {
      await this.setKey('GROQ_API_KEY', {
        key: groqKey,
        generatedAt: this.extractGenerationDate(groqKey) || new Date().toISOString(),
        expiresAt: this.calculateExpiryDate(),
        status: 'active'
      });
    }

    // Firebase 키들도 관리
    const firebaseKeys = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    for (const keyName of firebaseKeys) {
      const key = process.env[keyName];
      if (key) {
        await this.setKey(keyName, {
          key,
          generatedAt: this.extractGenerationDate(key) || new Date().toISOString(),
          expiresAt: this.calculateExpiryDate(),
          status: 'active'
        });
      }
    }
  }

  private async setKey(keyName: string, info: ApiKeyInfo): Promise<void> {
    await db.collection(this.COLLECTION_NAME).doc(keyName).set(info);
  }

  private async getKey(keyName: string): Promise<ApiKeyInfo | null> {
    const doc = await db.collection(this.COLLECTION_NAME).doc(keyName).get();
    return doc.exists ? doc.data() as ApiKeyInfo : null;
  }

  private extractGenerationDate(key: string): string | null {
    // 키에서 생성일 추출 (예: key_20240321_...)
    const match = key.match(/_(\d{8})_/);
    if (match) {
      const dateStr = match[1];
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return null;
  }

  private calculateExpiryDate(): string {
    // 3개월 후 만료
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString();
  }

  public async checkKeyRotation(): Promise<void> {
    const now = new Date();
    const keys = await this.getAllKeys();
    
    for (const [keyName, info] of keys.entries()) {
      const expiryDate = new Date(info.expiresAt);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 30) {
        logger.warn(`API 키 순환 필요: ${keyName}`, {
          daysUntilExpiry,
          generatedAt: info.generatedAt,
          expiresAt: info.expiresAt
        });
        
        // 관리자에게 알림 전송 (실제 구현 필요)
        await this.sendRotationNotification(keyName, daysUntilExpiry);
      }
    }
  }

  private async sendRotationNotification(keyName: string, daysUntilExpiry: number): Promise<void> {
    // 관리자 알림 전송 로직 (예: 이메일, Slack 등)
    // TODO: 실제 알림 시스템 구현
    logger.info(`API 키 순환 알림 전송: ${keyName}`, { daysUntilExpiry });
  }

  public async getKeyInfo(keyName: string): Promise<ApiKeyInfo | null> {
    return this.getKey(keyName);
  }

  public async getAllKeys(): Promise<Map<string, ApiKeyInfo>> {
    const keys = new Map<string, ApiKeyInfo>();
    const snapshot = await db.collection(this.COLLECTION_NAME).get();
    
    snapshot.forEach(doc => {
      keys.set(doc.id, doc.data() as ApiKeyInfo);
    });
    
    return keys;
  }
}

export const apiKeyManager = ApiKeyManager.getInstance();

// Firebase Firestore를 사용한 API 키 관리 함수
export async function getApiKey(userId: string) {
  const doc = await db.collection('apiKeys').doc(userId).get();
  return doc.exists ? doc.data()?.apiKey : null;
}

export async function setApiKey(userId: string, apiKey: string) {
  await db.collection('apiKeys').doc(userId).set({ apiKey });
}

export async function deleteApiKey(userId: string) {
  await db.collection('apiKeys').doc(userId).delete();
} 