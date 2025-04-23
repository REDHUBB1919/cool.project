import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/language-context'
import '../styles/components.css'

interface AnalysisData {
  score: number
  feedback: string
  details: {
    marketFit: number
    innovation: number
    feasibility: number
    scalability: number
  }
}

interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export default function StartupAnalysis() {
  const { language } = useLanguage()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [swot, setSwot] = useState<SwotData | null>(null)

  useEffect(() => {
    const loadData = () => {
      // 분석 데이터 로드
      const storedAnalysis = localStorage.getItem("startupAnalysis")
      if (storedAnalysis) {
        try {
          const parsedAnalysis = JSON.parse(storedAnalysis)
          setAnalysis(parsedAnalysis)
          // CSS 변수 업데이트
          const root = document.documentElement
          root.style.setProperty('--market-fit-width', `${parsedAnalysis.details.marketFit}%`)
          root.style.setProperty('--innovation-width', `${parsedAnalysis.details.innovation}%`)
          root.style.setProperty('--feasibility-width', `${parsedAnalysis.details.feasibility}%`)
          root.style.setProperty('--scalability-width', `${parsedAnalysis.details.scalability}%`)
        } catch (error) {
          console.error("Error parsing stored analysis:", error)
          setAnalysis(null)
        }
      } else {
        setAnalysis(null)
      }

      // SWOT 데이터 로드
      const storedSwot = localStorage.getItem("swotAnalysis")
      if (storedSwot) {
        try {
          setSwot(JSON.parse(storedSwot))
        } catch (error) {
          console.error("Error parsing stored SWOT:", error)
          setSwot(null)
        }
      } else {
        setSwot(null)
      }
    }

    // 초기 로드
    loadData()

    // localStorage 변경 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "startupAnalysis" || e.key === "swotAnalysis" || e.key === null) {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // 데이터가 없을 때의 UI
  if (!analysis && !swot) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">분석 결과</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">종합 점수</h2>
            <div className="text-4xl font-bold text-center mb-4">0점</div>
            <p className="text-gray-600 dark:text-gray-300">아이디어를 입력하면 분석 결과가 여기에 표시됩니다.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">상세 분석</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>시장 적합성</span>
                  <span>0점</span>
                </div>
                <div className="analysis-progress-container">
                  <div className="analysis-progress-market"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>혁신성</span>
                  <span>0점</span>
                </div>
                <div className="analysis-progress-container">
                  <div className="analysis-progress-innovation"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>실현 가능성</span>
                  <span>0점</span>
                </div>
                <div className="analysis-progress-container">
                  <div className="analysis-progress-feasibility"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>확장성</span>
                  <span>0점</span>
                </div>
                <div className="analysis-progress-container">
                  <div className="analysis-progress-scalability"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">SWOT 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-green-600">강점 (Strengths)</h3>
              <p className="text-gray-500">아이디어를 입력하면 강점이 여기에 표시됩니다.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-red-600">약점 (Weaknesses)</h3>
              <p className="text-gray-500">아이디어를 입력하면 약점이 여기에 표시됩니다.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-blue-600">기회 (Opportunities)</h3>
              <p className="text-gray-500">아이디어를 입력하면 기회가 여기에 표시됩니다.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-orange-600">위협 (Threats)</h3>
              <p className="text-gray-500">아이디어를 입력하면 위협이 여기에 표시됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">분석 결과</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">종합 점수</h2>
          <div className="text-4xl font-bold text-center mb-4">{analysis?.score || 0}점</div>
          <p className="text-gray-600 dark:text-gray-300">{analysis?.feedback || "아이디어를 입력하면 분석 결과가 여기에 표시됩니다."}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">상세 분석</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>시장 적합성</span>
                <span>{analysis?.details.marketFit || 0}점</span>
              </div>
              <div className="analysis-progress-container">
                <div className="analysis-progress-market"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>혁신성</span>
                <span>{analysis?.details.innovation || 0}점</span>
              </div>
              <div className="analysis-progress-container">
                <div className="analysis-progress-innovation"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>실현 가능성</span>
                <span>{analysis?.details.feasibility || 0}점</span>
              </div>
              <div className="analysis-progress-container">
                <div className="analysis-progress-feasibility"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>확장성</span>
                <span>{analysis?.details.scalability || 0}점</span>
              </div>
              <div className="analysis-progress-container">
                <div className="analysis-progress-scalability"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">SWOT 분석</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-green-600">강점 (Strengths)</h3>
            {swot?.strengths && swot.strengths.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {swot.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">아이디어를 입력하면 강점이 여기에 표시됩니다.</p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-red-600">약점 (Weaknesses)</h3>
            {swot?.weaknesses && swot.weaknesses.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {swot.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{weakness}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">아이디어를 입력하면 약점이 여기에 표시됩니다.</p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-blue-600">기회 (Opportunities)</h3>
            {swot?.opportunities && swot.opportunities.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {swot.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{opportunity}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">아이디어를 입력하면 기회가 여기에 표시됩니다.</p>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-orange-600">위협 (Threats)</h3>
            {swot?.threats && swot.threats.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {swot.threats.map((threat, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{threat}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">아이디어를 입력하면 위협이 여기에 표시됩니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 