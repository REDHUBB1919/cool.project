"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, BarChart3, CheckCircle, XCircle, Lightbulb, AlertTriangle, type LucideIcon } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import '../styles/components.css';

type SubScoreKey = 'marketFit' | 'execution' | 'team' | 'scalability';

interface AnalysisData {
  overallScore: number;
  subScores: Record<SubScoreKey, number>;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface SubScoreItem {
  key: SubScoreKey;
  label: string;
  icon: LucideIcon;
  score: number;
}

// 언어별 번역
const translations = {
  en: {
    pageTitle: "AI Analysis Results",
    overallScore: "Overall Score",
    subScores: {
      marketFit: "Market Fit",
      execution: "Execution",
      team: "Team",
      scalability: "Scalability",
    },
    swot: {
      title: "SWOT Analysis",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      opportunities: "Opportunities",
      threats: "Threats",
    },
  },
  ko: {
    pageTitle: "AI 분석 결과",
    overallScore: "종합 점수",
    subScores: {
      marketFit: "시장 적합성",
      execution: "실행력",
      team: "팀 역량",
      scalability: "확장성",
    },
    swot: {
      title: "SWOT 분석",
      strengths: "강점",
      weaknesses: "약점",
      opportunities: "기회",
      threats: "위협",
    },
  },
  ja: {
    pageTitle: "AI分析結果",
    overallScore: "総合スコア",
    subScores: {
      marketFit: "市場適合性",
      execution: "実行力",
      team: "チーム力",
      scalability: "拡張性",
    },
    swot: {
      title: "SWOT分析",
      strengths: "強み",
      weaknesses: "弱み",
      opportunities: "機会",
      threats: "脅威",
    },
  },
  zh: {
    pageTitle: "AI分析结果",
    overallScore: "总体评分",
    subScores: {
      marketFit: "市场契合度",
      execution: "执行力",
      team: "团队能力",
      scalability: "可扩展性",
    },
    swot: {
      title: "SWOT分析",
      strengths: "优势",
      weaknesses: "劣势",
      opportunities: "机会",
      threats: "威胁",
    },
  },
}

// 점수에 따른 색상 결정 함수
const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-blue-500"
  if (score >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

// 점수에 따른 배경 그라데이션 결정 함수
const getScoreGradient = (score: number) => {
  if (score >= 80) return "from-green-500 to-green-700"
  if (score >= 60) return "from-blue-500 to-blue-700"
  if (score >= 40) return "from-yellow-500 to-yellow-700"
  return "from-red-500 to-red-700"
}

const ScoreCircle = ({ score }: { score: number }) => {
  const gradientColors = getScoreGradient(score).split(' ');
  const startColor = gradientColors[0].replace('from-', '');
  const endColor = gradientColors[2].replace('to-', '');
  
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--gradient-start', `var(--${startColor})`);
    root.style.setProperty('--gradient-end', `var(--${endColor})`);
    root.style.setProperty('--clip-path', `polygon(0 0, ${score}% 0, ${score}% 100%, 0 100%)`);
  }, [score, startColor, endColor]);

  return (
    <div className="score-circle">
      <div className="score-circle-background"></div>
      <div className="score-circle-progress"></div>
      <div className="score-circle-inner">
        <span className="score-circle-value">{score}</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ score }: { score: number }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--progress-width', `${score}%`);
  }, [score]);

  return (
    <div className="progress-bar">
      <div className={`progress-bar-fill ${getScoreColor(score)}`}></div>
    </div>
  );
};

const AnalysisContent = ({ analysis, t }: { analysis: AnalysisData; t: typeof translations[keyof typeof translations] }) => {
  const subScoreItems: SubScoreItem[] = [
    {
      key: 'marketFit',
      label: t.subScores.marketFit,
      icon: Target,
      score: analysis.subScores.marketFit,
    },
    {
      key: 'execution',
      label: t.subScores.execution,
      icon: BarChart3,
      score: analysis.subScores.execution,
    },
    {
      key: 'team',
      label: t.subScores.team,
      icon: Users,
      score: analysis.subScores.team,
    },
    {
      key: 'scalability',
      label: t.subScores.scalability,
      icon: TrendingUp,
      score: analysis.subScores.scalability,
    },
  ];

  const swotItems = [
    {
      key: "strengths",
      label: t.swot.strengths,
      icon: CheckCircle,
      items: analysis.swot.strengths,
      bgClass: "bg-green-950/30 border-green-800/30",
      iconClass: "text-green-500",
    },
    {
      key: "weaknesses",
      label: t.swot.weaknesses,
      icon: XCircle,
      items: analysis.swot.weaknesses,
      bgClass: "bg-red-950/30 border-red-800/30",
      iconClass: "text-red-500",
    },
    {
      key: "opportunities",
      label: t.swot.opportunities,
      icon: Lightbulb,
      items: analysis.swot.opportunities,
      bgClass: "bg-blue-950/30 border-blue-800/30",
      iconClass: "text-blue-500",
    },
    {
      key: "threats",
      label: t.swot.threats,
      icon: AlertTriangle,
      items: analysis.swot.threats,
      bgClass: "bg-yellow-950/30 border-yellow-800/30",
      iconClass: "text-yellow-500",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">{t.overallScore}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <ScoreCircle score={analysis.overallScore} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{t.subScores.marketFit}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {subScoreItems.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium">{item.score}/100</span>
                </div>
                <ProgressBar score={item.score} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SWOT 분석 섹션 */}
      <h2 className="text-2xl font-bold mb-4">{t.swot.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {swotItems.map((item) => (
          <Card key={item.key} className={`border ${item.bgClass}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <item.icon className={`h-5 w-5 ${item.iconClass}`} />
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {item.items.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-lg leading-none mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="chart-container">
        {/* Chart content */}
      </div>

      <div className="sidebar-container">
        {/* Sidebar content */}
      </div>
    </>
  );
};

export default function AIAnalysisResults() {
  const { language } = useLanguage()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const t = translations[language]

  useEffect(() => {
    const loadAnalysis = () => {
      const storedAnalysis = localStorage.getItem("startupAnalysis")
      if (storedAnalysis) {
        try {
          const parsedAnalysis = JSON.parse(storedAnalysis)
          setAnalysis(parsedAnalysis as AnalysisData)
        } catch (error) {
          console.error("Error parsing stored analysis:", error)
          setAnalysis(null)
        }
      } else {
        setAnalysis(null)
      }
    }

    // 초기 로드
    loadAnalysis()

    // localStorage 변경 이벤트 리스너 추가
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "startupAnalysis" || e.key === null) {
        loadAnalysis()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // 데이터가 없을 때의 UI
  if (!analysis) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">{t.pageTitle}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">{t.overallScore}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-4">
              <ScoreCircle score={0} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{t.subScores.marketFit}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(t.subScores).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {key === "marketFit" && <Target className="h-5 w-5 text-muted-foreground" />}
                      {key === "execution" && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
                      {key === "team" && <Users className="h-5 w-5 text-muted-foreground" />}
                      {key === "scalability" && <TrendingUp className="h-5 w-5 text-muted-foreground" />}
                      <span>{label}</span>
                    </div>
                    <span className="font-medium">0/100</span>
                  </div>
                  <ProgressBar score={0} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{t.pageTitle}</h1>
      <AnalysisContent analysis={analysis} t={t} />
    </div>
  )
}
