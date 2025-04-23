"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import IdeaCardWithAiSuggestion from "@/components/idea-card-with-ai-suggestion"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/contexts/AuthContext"
import RequireAuthOverlay from "@/app/components/RequireAuthOverlay"

export default function ImprovePage() {
  const { language } = useLanguage()
  const { currentUser } = useAuth()
  const router = useRouter()

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  // 아이디어 카드 내용 상태
  const [ideaCards, setIdeaCards] = useState([
    {
      id: "solution",
      title: "솔루션 개요",
      content: "AI 기반 맞춤형 학습 경로를 제공하는 교육 플랫폼을 개발합니다.",
    },
    {
      id: "market",
      title: "시장 기회",
      content: "온라인 교육 플랫폼의 부족한 개인화 경험을 해결하고자 합니다.",
    },
    {
      id: "target",
      title: "목표 고객",
      content: "코딩을 배우고자 하는 18-35세 사이의 초보자와 중급자를 대상으로 합니다.",
    },
  ])

  // 로컬 스토리지에서 아이디어 데이터 가져오기
  useEffect(() => {
    const storedIdeas = localStorage.getItem("startupIdeas")
    if (storedIdeas) {
      try {
        const parsedIdeas = JSON.parse(storedIdeas)
        // 저장된 아이디어 중 처음 3개만 사용
        const firstThreeIdeas = parsedIdeas.slice(0, 3)
        const newIdeaCards = firstThreeIdeas.map((idea: any, index: number) => ({
          id: `idea-${index}`,
          title: idea.title || ideaCards[index % ideaCards.length].title,
          content: idea.description || ideaCards[index % ideaCards.length].content,
        }))
        setIdeaCards(newIdeaCards)
      } catch (error) {
        console.error("Error parsing stored ideas:", error)
      }
    }
  }, [])

  // 아이디어 카드 내용 업데이트 핸들러
  const handleContentUpdate = (id: string, newContent: string) => {
    setIdeaCards((prevCards) => prevCards.map((card) => (card.id === id ? { ...card, content: newContent } : card)))
  }

  // 언어별 페이지 제목
  const pageTitle = {
    en: "AI Improvement Suggestions",
    ko: "AI 개선 제안",
    ja: "AI改善提案",
    zh: "AI改进建议",
  }

  // 로그인하지 않은 경우 빈 페이지 반환 (리다이렉트 전에 잠시 표시됨)
  if (!currentUser) {
    return null
  }

  return (
    <RequireAuthOverlay>
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">{pageTitle[language]}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ideaCards.map((card) => (
              <IdeaCardWithAiSuggestion
                key={card.id}
                id={card.id}
                title={card.title}
                content={card.content}
                onContentUpdate={handleContentUpdate}
              />
            ))}
          </div>
        </div>
      </main>
    </RequireAuthOverlay>
  )
}
