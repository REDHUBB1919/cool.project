"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Analysis, SWOT } from "../types/idea"

const translations = {
  en: {
    title: "Analysis Results",
    score: "Overall Score",
    details: "Detailed Analysis",
    swot: "SWOT Analysis",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    opportunities: "Opportunities",
    threats: "Threats",
    noData: "No analysis data available.",
    loading: "Loading analysis...",
    error: "Error loading analysis data.",
  },
  ko: {
    title: "분석 결과",
    score: "종합 점수",
    details: "상세 분석",
    swot: "SWOT 분석",
    strengths: "강점",
    weaknesses: "약점",
    opportunities: "기회",
    threats: "위협",
    noData: "분석 데이터가 없습니다.",
    loading: "분석 데이터 로딩 중...",
    error: "분석 데이터를 불러오는 중 오류가 발생했습니다.",
  },
  ja: {
    title: "分析結果",
    score: "総合スコア",
    details: "詳細分析",
    swot: "SWOT分析",
    strengths: "強み",
    weaknesses: "弱み",
    opportunities: "機会",
    threats: "脅威",
    noData: "分析データがありません。",
    loading: "分析データを読み込み中...",
    error: "分析データの読み込み中にエラーが発生しました。",
  },
  zh: {
    title: "分析结果",
    score: "总分",
    details: "详细分析",
    swot: "SWOT分析",
    strengths: "优势",
    weaknesses: "劣势",
    opportunities: "机会",
    threats: "威胁",
    noData: "没有分析数据。",
    loading: "正在加载分析数据...",
    error: "加载分析数据时出错。",
  },
}

export default function IdeaAnalysis() {
  const { language } = useLanguage()
  const t = translations[language]
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [swot, setSwot] = useState<SWOT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const savedAnalysis = localStorage.getItem("startupAnalysis")
        const savedSwot = localStorage.getItem("startupSwot")
        
        if (savedAnalysis) {
          setAnalysis(JSON.parse(savedAnalysis))
        }
        if (savedSwot) {
          setSwot(JSON.parse(savedSwot))
        }
        
        if (!savedAnalysis || !savedSwot) {
          setError(t.noData)
        }
      } catch (err) {
        console.error("Error loading analysis data:", err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [t])

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t.loading}</span>
        </CardContent>
      </Card>
    )
  }

  if (error || !analysis || !swot) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error || t.noData}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{t.score}</h3>
            <p className="text-2xl font-bold">{analysis.score}/100</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">{t.details}</h3>
            <p className="text-muted-foreground">{analysis.details}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t.swot}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">{t.strengths}</h3>
            <ul className="list-disc list-inside space-y-1">
              {swot.strengths.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">{t.weaknesses}</h3>
            <ul className="list-disc list-inside space-y-1">
              {swot.weaknesses.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">{t.opportunities}</h3>
            <ul className="list-disc list-inside space-y-1">
              {swot.opportunities.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">{t.threats}</h3>
            <ul className="list-disc list-inside space-y-1">
              {swot.threats.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 