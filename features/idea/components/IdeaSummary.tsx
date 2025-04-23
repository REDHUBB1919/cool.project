"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface Idea {
  title: string
  description: string
}

const translations = {
  en: {
    title: "Your Startup Ideas",
    noDescription: "No description provided",
  },
  ko: {
    title: "당신의 스타트업 아이디어",
    noDescription: "설명이 제공되지 않았습니다",
  },
  ja: {
    title: "あなたのスタートアップアイデア",
    noDescription: "説明が提供されていません",
  },
  zh: {
    title: "你的创业想法",
    noDescription: "未提供描述",
  },
}

export default function IdeaSummary() {
  const { language } = useLanguage()
  const t = translations[language]
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const savedIdeas = localStorage.getItem("startupIdeas")
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas))
    }
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center animate-fade-in">
        {t.title}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea, index) => (
          <Card 
            key={index} 
            className="animate-fade-in transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold line-clamp-2">
                {idea.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-4">
                {idea.description || t.noDescription}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {ideas.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground text-lg">
            {t.noDescription}
          </p>
        </div>
      )}
    </div>
  )
} 