"use client"

import { AlertTriangle, CheckCircle, XCircle, MessageSquare, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { analyzeIdeas } from "@/lib/ai"

// 아이디어 상태 타입 정의
type IdeaStatus = "good" | "needs-improvement" | "critical"

// 아이디어 타입 정의
interface IdeaItem {
  id: number
  title: string
  content: string
  feedback: string
  status: IdeaStatus
}

// 언어별 번역
const translations = {
  en: {
    pageTitle: "Startup Ideas Summary",
    aiSummary: "Your startup concept shows promise, but needs more focus on market validation and revenue model.",
    statusLabels: {
      good: "Good",
      "needs-improvement": "Needs Improvement",
      critical: "Critical Issue",
    },
    feedbackLabel: "AI Feedback",
    resetData: "Reset Data",
    resetConfirm: "Are you sure you want to reset all data?",
    resetSuccess: "All data has been reset successfully.",
    noIdeas: "No ideas have been entered yet. Please input your ideas.",
    inputIdea: "Please input an idea.",
    aiAnalysisPlaceholder: "AI analysis results will be displayed here once you input an idea.",
    analyzing: "AI is analyzing your ideas...",
    error: "Error occurred while analyzing ideas. Please try again."
  },
  ko: {
    pageTitle: "창업 아이디어 요약",
    aiSummary: "당신의 창업 개념은 가능성을 보여주지만, 시장 검증과 수익 모델에 더 집중할 필요가 있습니다.",
    statusLabels: {
      good: "좋음",
      "needs-improvement": "개선 필요",
      critical: "중요 문제",
    },
    feedbackLabel: "AI 피드백",
    resetData: "데이터 초기화",
    resetConfirm: "모든 데이터를 초기화하시겠습니까?",
    resetSuccess: "모든 데이터가 성공적으로 초기화되었습니다.",
    noIdeas: "아직 입력된 아이디어가 없습니다. 아이디어를 입력해주세요.",
    inputIdea: "아이디어를 입력해주세요.",
    aiAnalysisPlaceholder: "아이디어를 입력하면 AI 분석 결과가 여기에 표시됩니다.",
    analyzing: "AI가 아이디어를 분석 중입니다...",
    error: "아이디어 분석 중 오류가 발생했습니다. 다시 시도해주세요."
  },
  ja: {
    pageTitle: "スタートアップアイデアの概要",
    aiSummary: "あなたのスタートアップコンセプトは有望ですが、市場検証と収益モデルにもっと焦点を当てる必要があります。",
    statusLabels: {
      good: "良い",
      "needs-improvement": "改善が必要",
      critical: "重大な問題",
    },
    feedbackLabel: "AIフィードバック",
    resetData: "データをリセット",
    resetConfirm: "すべてのデータをリセットしますか？",
    resetSuccess: "すべてのデータが正常にリセットされました。",
    noIdeas: "まだアイデアが入力されていません。アイデアを入力してください。",
    inputIdea: "アイデアを入力してください。",
    aiAnalysisPlaceholder: "アイデアを入力すると、AI分析結果がここに表示されます。",
    analyzing: "AIがアイデアを分析中です...",
    error: "アイデア分析中にエラーが発生しました。もう一度お試しください。"
  },
  zh: {
    pageTitle: "创业点子摘要",
    aiSummary: "您的创业概念显示出潜力，但需要更多关注市场验证和收入模式。",
    statusLabels: {
      good: "良好",
      "needs-improvement": "需要改进",
      critical: "关键问题",
    },
    feedbackLabel: "AI反馈",
    resetData: "重置数据",
    resetConfirm: "确定要重置所有数据吗？",
    resetSuccess: "所有数据已成功重置。",
    noIdeas: "尚未输入任何点子。请输入您的点子。",
    inputIdea: "请输入点子。",
    aiAnalysisPlaceholder: "输入点子后，AI分析结果将显示在此处。",
    analyzing: "AI正在分析您的点子...",
    error: "分析点子时发生错误。请再试一次。"
  },
}

// 샘플 아이디어 데이터
const sampleIdeas: IdeaItem[] = [
  {
    id: 1,
    title: "시장 기회",
    content: "온라인 교육 플랫폼의 부족한 개인화 경험을 해결하고자 합니다.",
    feedback: "교육 시장은 경쟁이 치열합니다. 더 구체적인 틈새 시장을 찾아보세요.",
    status: "needs-improvement",
  },
  {
    id: 2,
    title: "솔루션 개요",
    content: "AI 기반 맞춤형 학습 경로를 제공하는 교육 플랫폼을 개발합니다.",
    feedback: "기술적 차별화가 명확하게 보입니다. 구현 방법에 대한 더 자세한 계획이 필요합니다.",
    status: "good",
  },
  {
    id: 3,
    title: "목표 고객",
    content: "대학생과 직장인을 대상으로 합니다.",
    feedback: "타겟이 너무 넓습니다. 더 구체적인 고객 세그먼트를 정의하세요.",
    status: "critical",
  },
  {
    id: 4,
    title: "수익 모델",
    content: "월 구독제와 프리미엄 콘텐츠에 대한 추가 요금을 부과합니다.",
    feedback: "구독 모델은 적절하지만, 가격 전략과 수익성 분석이 필요합니다.",
    status: "needs-improvement",
  },
  {
    id: 5,
    title: "경쟁 우위",
    content: "개인화된 학습 경로와 실시간 피드백 시스템이 경쟁사와 차별화됩니다.",
    feedback: "경쟁 우위가 명확합니다. 이를 유지할 방법에 대한 전략도 고려하세요.",
    status: "good",
  },
  {
    id: 6,
    title: "초기 투자",
    content: "개발 및 마케팅을 위해 약 5천만원이 필요합니다.",
    feedback: "초기 투자 금액이 현실적이지 않을 수 있습니다. 더 자세한 비용 분석이 필요합니다.",
    status: "critical",
  },
  {
    id: 7,
    title: "팀 구성",
    content: "개발자 2명, 교육 전문가 1명, 마케팅 담당자 1명으로 시작합니다.",
    feedback: "핵심 역할이 잘 정의되어 있습니다. 각 역할의 구체적인 책임도 고려하세요.",
    status: "good",
  },
  {
    id: 8,
    title: "성장 전략",
    content: "소셜 미디어 마케팅과 교육 기관과의 파트너십을 통해 성장할 계획입니다.",
    feedback: "파트너십 전략은 좋지만, 사용자 유지 및 확장 전략도 필요합니다.",
    status: "needs-improvement",
  },
  {
    id: 9,
    title: "주요 위험 요소",
    content: "기술 개발의 지연과 경쟁사의 유사 서비스 출시가 위험 요소입니다.",
    feedback: "주요 위험을 잘 인식하고 있습니다. 각 위험에 대한 대응 계획도 수립하세요.",
    status: "good",
  },
  {
    id: 10,
    title: "성공 지표",
    content: "첫 해 사용자 1,000명 확보와 월 구독 유지율 70% 달성을 목표로 합니다.",
    feedback: "구체적인 지표가 좋습니다. 재무적 성공 지표도 추가하면 좋을 것 같습니다.",
    status: "needs-improvement",
  },
]

// 상태에 따른 배지 스타일 및 아이콘 정의
const statusConfig = {
  good: {
    icon: CheckCircle,
    badgeClass: "bg-green-500 hover:bg-green-600",
    emoji: "✅",
  },
  "needs-improvement": {
    icon: AlertTriangle,
    badgeClass: "bg-yellow-500 hover:bg-yellow-600",
    emoji: "⚠️",
  },
  critical: {
    icon: XCircle,
    badgeClass: "bg-red-500 hover:bg-red-600",
    emoji: "❌",
  },
}

export default function StartupSummary() {
  const { language } = useLanguage()
  const [ideas, setIdeas] = useState<IdeaItem[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 로컬 스토리지에서 아이디어 데이터 가져오기
  useEffect(() => {
    const loadIdeas = async () => {
      const storedIdeas = localStorage.getItem("startupIdeas")
      if (storedIdeas) {
        try {
          const parsedIdeas = JSON.parse(storedIdeas)
          setIsAnalyzing(true)
          setError(null)

          try {
            // AI 분석 수행
            const analysisResult = await analyzeIdeas(
              parsedIdeas.map((idea: any) => ({
                id: String(idea.id),
                title: idea.title,
                description: idea.content
              }))
            )

            // 분석 결과를 아이디어와 결합
            const ideasWithAnalysis = parsedIdeas.map((idea: any, index: number) => {
              const suggestion = analysisResult.suggestions.find(s => s.ideaId === String(idea.id))
              const score = analysisResult.overallScore
              let status: IdeaStatus = "needs-improvement"

              if (score >= 80) status = "good"
              else if (score < 50) status = "critical"

              return {
                ...idea,
                feedback: suggestion?.suggestion || "분석 결과를 불러올 수 없습니다.",
                status
              }
            })

            setIdeas(ideasWithAnalysis)
          } catch (error) {
            console.error("Error analyzing ideas:", error)
            setError(t.error)
            // 에러 발생 시 기본 상태로 설정
            setIdeas(parsedIdeas.map((idea: any) => ({
              ...idea,
              feedback: t.error,
              status: "needs-improvement" as IdeaStatus
            })))
          } finally {
            setIsAnalyzing(false)
          }
        } catch (error) {
          console.error("Error parsing stored ideas:", error)
          setIdeas([])
        }
      } else {
        setIdeas([])
      }
    }

    // 초기 로드
    loadIdeas()

    // localStorage 변경 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "startupIdeas" || e.key === null) {
        loadIdeas()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // 데이터 초기화 함수
  const resetData = () => {
    localStorage.removeItem("startupIdeas")
    localStorage.removeItem("startupAnalysis")
    localStorage.removeItem("marketFitAnalysis")
    localStorage.removeItem("swotAnalysis")
    localStorage.removeItem("startupScore")
    setIdeas([])
    setShowResetConfirm(false)
    window.location.reload() // 페이지 새로고침
  }

  // 현재 언어에 맞는 번역 가져오기
  const t = translations[language]

  // 데이터가 없을 때 표시할 메시지
  if (ideas.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.pageTitle}</h1>
          <Button variant="destructive" onClick={() => setShowResetConfirm(true)} disabled>
            <Trash2 className="w-4 h-4 mr-2" />
            {t.resetData}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(10).fill(null).map((_, index) => (
            <Card key={index} className="overflow-hidden opacity-50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">아이디어 {index + 1}</CardTitle>
                  <Badge className="bg-gray-500 hover:bg-gray-600">
                    <span className="mr-1">-</span>
                    점수: 0
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">{t.inputIdea}</p>
                <Alert className="bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium mb-1">{t.feedbackLabel}</p>
                      <AlertDescription>{t.aiAnalysisPlaceholder}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t.pageTitle}</h1>
        <Button variant="destructive" onClick={() => setShowResetConfirm(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          {t.resetData}
        </Button>
      </div>

      {isAnalyzing && (
        <Alert className="mb-6">
          <AlertDescription>{t.analyzing}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <Card key={idea.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{idea.title}</CardTitle>
                <Badge className={
                  idea.status === "good" ? "bg-green-500 hover:bg-green-600" :
                  idea.status === "needs-improvement" ? "bg-yellow-500 hover:bg-yellow-600" :
                  "bg-red-500 hover:bg-red-600"
                }>
                  {t.statusLabels[idea.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{idea.content}</p>
              <Alert className={`
                ${idea.status === "good" ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" : ""}
                ${idea.status === "needs-improvement" ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900" : ""}
                ${idea.status === "critical" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900" : ""}
              `}>
                <div className="flex gap-3">
                  <MessageSquare className={`
                    h-5 w-5 mt-0.5
                    ${idea.status === "good" ? "text-green-500" : ""}
                    ${idea.status === "needs-improvement" ? "text-yellow-500" : ""}
                    ${idea.status === "critical" ? "text-red-500" : ""}
                  `} />
                  <div>
                    <p className="font-medium mb-1">{t.feedbackLabel}</p>
                    <AlertDescription>{idea.feedback}</AlertDescription>
                  </div>
                </div>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t.resetConfirm}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={resetData}>
                초기화
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
