/**
 * AI 분석 API 호출 함수
 * 이 파일은 AI API(Groq)를 호출하여 아이디어를 분석하는 함수를 제공합니다.
 * 
 * 주요 기능:
 * 1. 아이디어 목록을 AI API로 전송
 * 2. 분석 결과(점수, SWOT 분석, 개선 제안) 수신
 * 
 * 보안:
 * - API 키는 서버사이드에서만 사용
 * - 클라이언트에서는 API 라우트를 통해서만 접근 가능
 */

import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 아이디어 타입 정의
export interface Idea {
  id: string;
  title: string;
  description: string;
}

// AI 분석 결과 데이터 구조 정의
export interface AIAnalysisResult {
  overallScore: number;  // 전체 점수 (0-100)
  swotAnalysis: {        // SWOT 분석 결과
    strengths: string[];    // 강점 목록
    weaknesses: string[];   // 약점 목록
    opportunities: string[]; // 기회 목록
    threats: string[];      // 위협 목록
  };
  suggestions: {         // 개선 제안 목록
    ideaId: string;      // 대상 아이디어 ID
    suggestion: string;  // 개선 제안 내용
  }[];
}

/**
 * 아이디어 목록을 API로 전송하여 분석 결과를 받는 함수
 * @param ideas - 분석할 아이디어 목록
 * @returns AI 분석 결과
 */
export async function analyzeIdeas(ideas: Idea[]): Promise<AIAnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ideas }),
    });

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing ideas:', error);
    throw new Error('아이디어 분석 중 오류가 발생했습니다.');
  }
} 