/**
 * AI 분석 결과 표시 컴포넌트
 * 이 컴포넌트는 AI 분석 결과를 시각적으로 표시합니다.
 * 
 * 주요 기능:
 * 1. 전반적인 점수 표시 (점수 바)
 * 2. SWOT 분석 표시 (박스 형태)
 * 3. 아이디어별 개선 제안 표시 (카드 형태)
 */

'use client';

import { useState, useEffect } from 'react';
import { Idea, AIAnalysisResult, analyzeIdeas } from '@/lib/ai';
import '../styles/AIAnalysis.css';
import ShareActions from './ShareActions';

// 컴포넌트 props 타입 정의
interface AIAnalysisProps {
  ideas: Idea[];  // 분석할 아이디어 목록
}

export default function AIAnalysis({ ideas }: AIAnalysisProps) {
  // 상태 관리
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);  // 분석 결과
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState<string | null>(null);  // 에러 메시지

  // 아이디어가 변경될 때마다 분석 실행
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (ideas.length === 0) return;  // 아이디어가 없으면 분석하지 않음
      
      try {
        setLoading(true);  // 로딩 시작
        setError(null);    // 에러 초기화
        
        // 서버 API 라우트를 통해 분석 요청
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ideas }),
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const result = await response.json();
        setAnalysisResult(result);  // 결과 저장
      } catch (err) {
        console.error('Error analyzing ideas:', err);
        setError('아이디어 분석 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);  // 로딩 종료
      }
    };

    fetchAnalysis();
  }, [ideas]);

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">AI가 아이디어를 분석 중입니다...</p>
      </div>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-red-700 mb-2">오류 발생</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // 분석 결과가 없을 때
  if (!analysisResult) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* 전반적인 점수 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">전체 점수</h2>
        <div className="score-bar-container">
          <div 
            className={`score-bar-fill score-${Math.round(analysisResult.overallScore / 10) * 10}`}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span>{analysisResult.overallScore}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* SWOT 분석 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">SWOT 분석</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 강점 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">강점 (Strengths)</h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              {analysisResult.swotAnalysis.strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          {/* 약점 */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">약점 (Weaknesses)</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {analysisResult.swotAnalysis.weaknesses.map((weakness: string, index: number) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          {/* 기회 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">기회 (Opportunities)</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              {analysisResult.swotAnalysis.opportunities.map((opportunity: string, index: number) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
          {/* 위협 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">위협 (Threats)</h3>
            <ul className="list-disc list-inside text-yellow-700 space-y-1">
              {analysisResult.swotAnalysis.threats.map((threat: string, index: number) => (
                <li key={index}>{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 개선 제안 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">개선 제안</h2>
        <div className="space-y-4">
          {analysisResult.suggestions.map((suggestion: { ideaId: string; suggestion: string }) => {
            const idea = ideas.find(i => i.id === suggestion.ideaId);
            return (
              <div key={suggestion.ideaId} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  {idea ? idea.title : '아이디어'}에 대한 제안
                </h3>
                <p className="text-gray-700">{suggestion.suggestion}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 공유 액션 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">공유하기</h2>
        <ShareActions ideas={ideas} analysisResult={analysisResult} />
      </div>
    </div>
  );
} 