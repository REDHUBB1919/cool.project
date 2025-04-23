'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveSharedResult } from '@/lib/firebase';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ShareActionsProps {
  ideas: any[];
  analysisResult: any;
}

export default function ShareActions({ ideas, analysisResult }: ShareActionsProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser } = useAuth();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // 제목
    doc.setFontSize(20);
    doc.text('아이디어 분석 보고서', 20, 20);
    
    // 날짜
    doc.setFontSize(12);
    doc.text(`생성일: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // 전체 점수
    doc.setFontSize(16);
    doc.text('전체 점수', 20, 45);
    doc.setFontSize(12);
    doc.text(`${analysisResult.overallScore}%`, 20, 55);
    
    // SWOT 분석
    doc.setFontSize(16);
    doc.text('SWOT 분석', 20, 70);
    doc.setFontSize(12);
    
    const swotData = [
      ['강점', ...analysisResult.swotAnalysis.strengths],
      ['약점', ...analysisResult.swotAnalysis.weaknesses],
      ['기회', ...analysisResult.swotAnalysis.opportunities],
      ['위협', ...analysisResult.swotAnalysis.threats],
    ];
    
    (doc as any).autoTable({
      startY: 75,
      head: [['구분', '내용']],
      body: swotData,
      theme: 'grid',
    });
    
    // 아이디어 목록
    doc.setFontSize(16);
    doc.text('아이디어 목록', 20, (doc as any).lastAutoTable.finalY + 20);
    
    const ideaData = ideas.map(idea => [
      idea.title,
      idea.description,
      new Date(idea.createdAt).toLocaleDateString()
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['제목', '설명', '작성일']],
      body: ideaData,
      theme: 'grid',
    });
    
    // PDF 저장
    doc.save('아이디어_분석_보고서.pdf');
  };

  const shareResult = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setSuccessMessage('');
      
      const resultId = await saveSharedResult(currentUser.uid, {
        ideas,
        analysisResult,
      });
      
      const shareUrl = `${window.location.origin}/share/${resultId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setSuccessMessage('공유 링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('Error sharing result:', error);
      setSuccessMessage('공유 링크 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          PDF 다운로드
        </button>
        
        <button
          onClick={shareResult}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          )}
          공유 링크 생성
        </button>
      </div>
      
      {successMessage && (
        <div className="text-green-400 text-sm">{successMessage}</div>
      )}
    </div>
  );
} 