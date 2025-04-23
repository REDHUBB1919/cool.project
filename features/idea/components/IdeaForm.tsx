"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { useIdeaForm } from "../hooks/useIdeaForm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// 다국어 지원을 위한 번역 객체
const translations = {
  en: {
    title: "Startup Idea Generator",
    step: "Step",
    of: "of",
    review: "Review",
    previous: "Previous",
    next: "Next",
    submit: "Submit All Ideas",
    backToEdit: "Back to Edit",
    summary: "Summary of Your Startup Ideas",
    noDescription: "No description provided.",
    inputTitle: "Title",
    inputDescription: "Description",
    loading: "Analyzing your ideas...",
    error: "Error",
    placeholders: [
      {
        title: "Market opportunity",
        description: "What market problem or opportunity are you addressing?",
      },
      {
        title: "Solution overview",
        description: "What product or service will you provide to solve this problem?",
      },
      {
        title: "Target customers",
        description: "Who are your primary target customers?",
      },
      {
        title: "Revenue model",
        description: "How will you generate revenue?",
      },
      {
        title: "Competitive advantage",
        description: "What makes your solution better than existing alternatives?",
      },
      {
        title: "Initial investment",
        description: "How much funding do you need to get started?",
      },
      {
        title: "Team composition",
        description: "What key team members and roles do you need?",
      },
      {
        title: "Growth strategy",
        description: "How do you plan to scale your business?",
      },
      {
        title: "Key risks",
        description: "What are the main challenges and risks you anticipate?",
      },
      {
        title: "Success metrics",
        description: "How will you measure success?",
      },
    ],
  },
  ko: {
    title: "창업 아이디어 생성기",
    step: "단계",
    of: "중",
    review: "검토",
    previous: "이전",
    next: "다음",
    submit: "모든 아이디어 제출",
    backToEdit: "수정하러 돌아가기",
    summary: "창업 아이디어 요약",
    noDescription: "설명이 없습니다.",
    inputTitle: "제목",
    inputDescription: "설명",
    loading: "아이디어 분석 중...",
    error: "오류",
    placeholders: [
      {
        title: "시장 기회",
        description: "어떤 시장 문제나 기회를 해결하려고 하나요?",
      },
      {
        title: "솔루션 개요",
        description: "이 문제를 해결하기 위해 어떤 제품이나 서비스를 제공할 예정인가요?",
      },
      {
        title: "목표 고객",
        description: "주요 타겟 고객은 누구인가요?",
      },
      {
        title: "수익 모델",
        description: "어떻게 수익을 창출할 계획인가요?",
      },
      {
        title: "경쟁 우위",
        description: "기존 대안보다 귀하의 솔루션이 더 나은 점은 무엇인가요?",
      },
      {
        title: "초기 투자",
        description: "시작하기 위해 얼마의 자금이 필요한가요?",
      },
      {
        title: "팀 구성",
        description: "어떤 핵심 팀원과 역할이 필요한가요?",
      },
      {
        title: "성장 전략",
        description: "비즈니스를 어떻게 확장할 계획인가요?",
      },
      {
        title: "주요 위험",
        description: "예상되는 주요 도전과 위험은 무엇인가요?",
      },
      {
        title: "성공 지표",
        description: "성공을 어떻게 측정할 계획인가요?",
      },
    ],
  },
  ja: {
    title: "スタートアップアイデアジェネレーター",
    step: "ステップ",
    of: "の",
    review: "レビュー",
    previous: "前へ",
    next: "次へ",
    submit: "すべてのアイデアを提出",
    backToEdit: "編集に戻る",
    summary: "スタートアップアイデアの概要",
    noDescription: "説明がありません。",
    inputTitle: "タイトル",
    inputDescription: "説明",
    loading: "アイデアを分析中...",
    error: "エラー",
    placeholders: [
      {
        title: "市場機会",
        description: "どのような市場問題や機会に対処していますか？",
      },
      {
        title: "ソリューション概要",
        description: "この問題を解決するためにどのような製品やサービスを提供する予定ですか？",
      },
      {
        title: "ターゲット顧客",
        description: "主なターゲット顧客は誰ですか？",
      },
      {
        title: "収益モデル",
        description: "どのように収益を生み出す計画ですか？",
      },
      {
        title: "競争優位性",
        description: "既存の代替品よりもあなたのソリューションが優れている点は何ですか？",
      },
      {
        title: "初期投資",
        description: "開始するためにどれくらいの資金が必要ですか？",
      },
      {
        title: "チーム構成",
        description: "どのような主要チームメンバーと役割が必要ですか？",
      },
      {
        title: "成長戦略",
        description: "ビジネスをどのように拡大する計画ですか？",
      },
      {
        title: "主要リスク",
        description: "予想される主な課題とリスクは何ですか？",
      },
      {
        title: "成功指標",
        description: "成功をどのように測定する予定ですか？",
      },
    ],
  },
  zh: {
    title: "创业点子生成器",
    step: "步骤",
    of: "共",
    review: "审查",
    previous: "上一步",
    next: "下一步",
    submit: "提交所有创意",
    backToEdit: "返回编辑",
    summary: "创业点子摘要",
    noDescription: "没有提供描述。",
    inputTitle: "标题",
    inputDescription: "描述",
    loading: "正在分析您的创意...",
    error: "错误",
    placeholders: [
      {
        title: "市场机会",
        description: "您正在解决什么市场问题或机会？",
      },
      {
        title: "解决方案概述",
        description: "您将提供什么产品或服务来解决这个问题？",
      },
      {
        title: "目标客户",
        description: "您的主要目标客户是谁？",
      },
      {
        title: "收入模式",
        description: "您计划如何产生收入？",
      },
      {
        title: "竞争优势",
        description: "与现有替代方案相比，您的解决方案有何优势？",
      },
      {
        title: "初始投资",
        description: "开始需要多少资金？",
      },
      {
        title: "团队组成",
        description: "您需要哪些关键团队成员和角色？",
      },
      {
        title: "增长战略",
        description: "您计划如何扩展业务？",
      },
      {
        title: "主要风险",
        description: "您预计的主要挑战和风险是什么？",
      },
      {
        title: "成功指标",
        description: "您将如何衡量成功？",
      },
    ],
  },
}

export default function IdeaForm() {
  const { language } = useLanguage()
  const t = translations[language]
  const {
    currentStep,
    ideas,
    ideaSteps,
    loading,
    error,
    handleChange,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useIdeaForm()

  // Render input step
  const renderStep = (stepIndex: number) => {
    const idea = ideas[stepIndex - 1]
    const placeholder = ideaSteps[stepIndex - 1]

    return (
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {t.step} {stepIndex} {t.of} 10
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-slide-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.inputTitle}</label>
            <Input
              value={idea.title}
              onChange={(e) => handleChange(stepIndex - 1, "title", e.target.value)}
              placeholder={placeholder.title}
              disabled={loading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.inputDescription}</label>
            <Textarea
              value={idea.description}
              onChange={(e) => handleChange(stepIndex - 1, "description", e.target.value)}
              placeholder={placeholder.description}
              rows={5}
              disabled={loading}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            className="w-full sm:w-auto transition-all duration-200 hover:bg-secondary/80"
          >
            {t.previous}
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={loading}
            className="w-full sm:w-auto transition-all duration-200 hover:bg-primary/90"
          >
            {currentStep === 10 ? t.review : t.next}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Render summary step
  const renderSummary = () => {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl sm:text-3xl font-bold">{t.summary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-slide-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6">
            {ideas.map((idea, index) => (
              <div 
                key={index} 
                className="space-y-2 p-4 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted/70"
              >
                <h3 className="font-medium text-lg">{idea.title || ideaSteps[index].title}</h3>
                <p className="text-sm text-muted-foreground">
                  {idea.description || t.noDescription}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={loading}
            className="w-full sm:w-auto transition-all duration-200 hover:bg-secondary/80"
          >
            {t.backToEdit}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full sm:w-auto transition-all duration-200 hover:bg-primary/90"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.loading}
              </div>
            ) : (
              t.submit
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center animate-fade-in">
        {t.title}
      </h1>
      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-primary rounded-full transition-all duration-500 ease-out ${currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-[10%]' : currentStep === 3 ? 'w-[20%]' : currentStep === 4 ? 'w-[30%]' : currentStep === 5 ? 'w-[40%]' : currentStep === 6 ? 'w-[50%]' : currentStep === 7 ? 'w-[60%]' : currentStep === 8 ? 'w-[70%]' : currentStep === 9 ? 'w-[80%]' : currentStep === 10 ? 'w-[90%]' : 'w-full'}`}
          />
        </div>
      </div>
      <div className="animate-fade-in">
        {currentStep === 11 ? renderSummary() : renderStep(currentStep)}
      </div>
    </div>
  )
} 