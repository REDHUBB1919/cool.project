"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"

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

export default function StartupIdeaForm() {
  const { language } = useLanguage()
  const router = useRouter()

  // 현재 언어에 맞는 번역 가져오기
  const t = translations[language]

  // State for tracking current step (1-10 for input steps, 11 for summary)
  const [currentStep, setCurrentStep] = useState(1)

  // Update progress width when currentStep changes
  useEffect(() => {
    document.documentElement.style.setProperty('--progress-width', `${(currentStep / 11) * 100}%`);
  }, [currentStep]);

  // State for storing all 10 ideas
  const [ideas, setIdeas] = useState(Array(10).fill({ title: "", description: "" }))

  // Handle input changes
  const handleChange = (index: number, field: string, value: string) => {
    const updatedIdeas = [...ideas]
    updatedIdeas[index] = {
      ...updatedIdeas[index],
      [field]: value,
    }
    setIdeas(updatedIdeas)
  }

  // Navigate to next step
  const handleNext = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Submit all ideas
  const handleSubmit = () => {
    console.log("Submitted ideas:", ideas)
    // 아이디어를 로컬 스토리지에 저장
    localStorage.setItem("startupIdeas", JSON.stringify(ideas))
    // 요약 페이지로 이동
    router.push("/summary")
  }

  // Render input step
  const renderStep = (stepIndex: number) => {
    const index = stepIndex - 1
    const idea = ideas[index]
    const placeholder = t.placeholders[index]

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {t.step} {stepIndex} {t.of} 10
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              {t.inputTitle}
            </label>
            <Input
              id="title"
              placeholder={placeholder.title}
              value={idea.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t.inputDescription}
            </label>
            <Textarea
              id="description"
              placeholder={placeholder.description}
              value={idea.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={stepIndex === 1}>
            {t.previous}
          </Button>
          <Button onClick={handleNext}>{stepIndex === 10 ? t.review : t.next}</Button>
        </CardFooter>
      </Card>
    )
  }

  // Render summary page
  const renderSummary = () => {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">{t.summary}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {ideas.map((idea, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg">
                {index + 1}. {idea.title || `${t.placeholders[index].title}`}
              </h3>
              <p className="text-muted-foreground mt-1">{idea.description || t.noDescription}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            {t.backToEdit}
          </Button>
          <Button onClick={handleSubmit}>{t.submit}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t.title}</h1>

      <div className="mb-8">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-blue-600 rounded-full progress-bar-width"></div>
        </div>
        <p className="text-center mt-2 text-sm text-muted-foreground">
          {currentStep <= 10 ? `${t.step} ${currentStep} ${t.of} 10` : t.review}
        </p>
      </div>

      {currentStep <= 10 ? renderStep(currentStep) : renderSummary()}
    </div>
  )
}
