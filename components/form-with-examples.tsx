"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lightbulb, CheckCircle, HelpCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// 폼 필드 데이터 타입 정의
interface FormField {
  id: string
  title: string
  description: string
  placeholder: string
  example: {
    content: string
    tips: string[]
    importance: string
  }
  inputType: "text" | "textarea"
}

// 언어별 번역
const translations = {
  en: {
    pageTitle: "Startup Idea Form",
    showExample: "Show Example",
    exampleTitle: "Example",
    tipsTitle: "Writing Tips",
    importanceTitle: "Why This Matters",
    submitButton: "Submit Form",
  },
  ko: {
    pageTitle: "창업 아이디어 폼",
    showExample: "예시 보기",
    exampleTitle: "예시",
    tipsTitle: "작성 팁",
    importanceTitle: "중요한 이유",
    submitButton: "폼 제출하기",
  },
  ja: {
    pageTitle: "スタートアップアイデアフォーム",
    showExample: "例を見る",
    exampleTitle: "例",
    tipsTitle: "作成のヒント",
    importanceTitle: "重要な理由",
    submitButton: "フォームを提出する",
  },
  zh: {
    pageTitle: "创业点子表单",
    showExample: "查看示例",
    exampleTitle: "示例",
    tipsTitle: "写作提示",
    importanceTitle: "为什么重要",
    submitButton: "提交表单",
  },
}

// 샘플 폼 필드 데이터
const formFields: FormField[] = [
  {
    id: "market-opportunity",
    title: "시장 기회",
    description: "해결하려는 시장 문제나 기회는 무엇인가요?",
    placeholder: "현재 시장에서 발견한 문제점이나 기회를 설명해주세요.",
    example: {
      content:
        "현재 온라인 교육 시장은 일방향적인 콘텐츠 전달에 집중되어 있어, 학습자의 개인적인 학습 스타일과 속도를 고려하지 못합니다. 특히 프로그래밍 교육에서는 실시간 피드백과 맞춤형 학습 경로가 부족하여 초보자들이 쉽게 좌절하고 포기하는 경우가 많습니다.",
      tips: [
        "구체적인 시장 통계나 트렌드를 언급하세요.",
        "경쟁사가 해결하지 못하는 문제점에 집중하세요.",
        "왜 지금이 이 문제를 해결하기 좋은 시점인지 설명하세요.",
        "목표 시장의 규모와 성장 가능성을 고려하세요.",
      ],
      importance:
        "명확한 시장 기회 파악은 창업의 기반입니다. 실제로 존재하는 문제를 해결하지 않는 제품은 아무리 기술적으로 뛰어나도 성공하기 어렵습니다.",
    },
    inputType: "textarea",
  },
  {
    id: "solution",
    title: "솔루션 개요",
    description: "어떤 제품이나 서비스를 제공할 계획인가요?",
    placeholder: "귀하의 솔루션에 대해 간략히 설명해주세요.",
    example: {
      content:
        "AI 기반 맞춤형 코딩 교육 플랫폼을 개발하여, 학습자의 실시간 코드 분석을 통해 개인화된 피드백과 학습 경로를 제공합니다. 사용자의 코딩 스타일, 실수 패턴, 학습 속도를 분석하여 최적화된 학습 콘텐츠를 추천하고, 게임화 요소를 통해 학습 동기를 유지합니다.",
      tips: [
        "솔루션의 핵심 가치를 명확하게 설명하세요.",
        "기술적 세부사항보다는 문제 해결 방식에 집중하세요.",
        "경쟁사와의 차별점을 강조하세요.",
        "사용자 관점에서 어떤 경험을 제공하는지 설명하세요.",
      ],
      importance:
        "솔루션은 귀하의 비즈니스 모델의 핵심입니다. 투자자와 고객 모두에게 귀하의 제품이나 서비스가 어떻게 가치를 창출하는지 명확하게 전달해야 합니다.",
    },
    inputType: "textarea",
  },
  {
    id: "target-customers",
    title: "목표 고객",
    description: "주요 타겟 고객층은 누구인가요?",
    placeholder: "귀하의 제품이나 서비스를 사용할 주요 고객층을 설명해주세요.",
    example: {
      content:
        "우리의 주요 타겟 고객은 18-35세 사이의 코딩 입문자와 초급 개발자입니다. 특히 전통적인 교육 방식에 만족하지 못하고, 자기주도적 학습을 선호하는 직장인과 대학생이 주요 타겟입니다. 이들은 기술적 역량 향상을 통해 취업이나 이직을 준비하고 있으며, 효율적인 학습 방법을 찾고 있습니다.",
      tips: [
        "인구통계학적 특성(나이, 직업, 소득 등)을 포함하세요.",
        "고객의 행동 패턴과 선호도를 설명하세요.",
        "고객의 페인 포인트(pain points)를 구체적으로 언급하세요.",
        "초기 얼리어답터와 장기적 타겟을 구분하세요.",
      ],
      importance:
        "명확한 타겟 고객 정의는 효과적인 마케팅과 제품 개발의 기초입니다. 모든 사람을 대상으로 하는 제품은 결국 아무도 만족시키지 못합니다.",
    },
    inputType: "textarea",
  },
]

export default function FormWithExamples() {
  const { language } = useLanguage()

  // 현재 언어에 맞는 번역 가져오기
  const t = translations[language]

  // 폼 데이터 상태
  const [formData, setFormData] = useState<Record<string, string>>(
    formFields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {}),
  )

  // 입력 변경 핸들러
  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("제출된 데이터:", formData)
    // 여기에 데이터 제출 로직 추가
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t.pageTitle}</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
        {formFields.map((field) => (
          <Card key={field.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{field.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{field.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {field.inputType === "textarea" ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              ) : (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    {t.showExample}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{field.title}</DialogTitle>
                    <DialogDescription>{field.description}</DialogDescription>
                  </DialogHeader>

                  {/* 예시 내용 */}
                  <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3>{t.exampleTitle}</h3>
                      </div>
                      <div className="bg-secondary/50 p-4 rounded-md text-sm">{field.example.content}</div>
                    </div>

                    {/* 작성 팁 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <h3>{t.tipsTitle}</h3>
                      </div>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {field.example.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 중요성 설명 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-medium">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                        <h3>{t.importanceTitle}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{field.example.importance}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center mt-8">
          <Button type="submit" size="lg" className="px-8">
            {t.submitButton}
          </Button>
        </div>
      </form>
    </div>
  )
}
