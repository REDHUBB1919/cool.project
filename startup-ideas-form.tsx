"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function StartupIdeasForm() {
  const [formData, setFormData] = useState({
    idea1: "",
    idea2: "",
    idea3: "",
    idea4: "",
    idea5: "",
    idea6: "",
    idea7: "",
    idea8: "",
    idea9: "",
    idea10: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("제출된 아이디어:", formData)
    // 여기에 데이터 제출 로직 추가
  }

  const ideaFields = [
    {
      id: "idea1",
      title: "시장 기회",
      description: "해결하려는 시장 문제나 기회는 무엇인가요?",
    },
    {
      id: "idea2",
      title: "솔루션 개요",
      description: "어떤 제품이나 서비스를 제공할 계획인가요?",
    },
    {
      id: "idea3",
      title: "목표 고객",
      description: "주요 타겟 고객층은 누구인가요?",
    },
    {
      id: "idea4",
      title: "수익 모델",
      description: "어떻게 수익을 창출할 계획인가요?",
    },
    {
      id: "idea5",
      title: "경쟁 우위",
      description: "경쟁사와 비교했을 때 귀하의 차별점은 무엇인가요?",
    },
    {
      id: "idea6",
      title: "초기 투자",
      description: "시작하기 위해 필요한 초기 자금은 얼마인가요?",
    },
    {
      id: "idea7",
      title: "팀 구성",
      description: "필요한 핵심 팀원과 역할은 무엇인가요?",
    },
    {
      id: "idea8",
      title: "성장 전략",
      description: "어떻게 사업을 확장할 계획인가요?",
    },
    {
      id: "idea9",
      title: "주요 위험 요소",
      description: "예상되는 주요 도전과 위험은 무엇인가요?",
    },
    {
      id: "idea10",
      title: "성공 지표",
      description: "성공을 측정하기 위한 주요 지표는 무엇인가요?",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">창업 아이디어 입력 폼</h1>
      <p className="text-center mb-8 text-muted-foreground">아래 10가지 항목에 대한 창업 아이디어를 입력해주세요.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {ideaFields.map((field, index) => (
          <Card key={field.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="bg-gray-100 dark:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="font-semibold">{index + 1}</span>
                </div>
                <Label htmlFor={field.id} className="text-xl font-medium">
                  {field.title}
                </Label>
              </div>
              <p className="text-muted-foreground mb-4 ml-11">{field.description}</p>
              <div className="ml-11">
                <Input
                  id={field.id}
                  name={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={`${field.title}에 대한 아이디어를 입력하세요`}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center mt-8">
          <Button type="submit" size="lg" className="px-8">
            아이디어 제출하기
          </Button>
        </div>
      </form>
    </div>
  )
}
