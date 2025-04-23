"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"

// 언어별 번역
const translations = {
  en: {
    getAiSuggestion: "Get AI Suggestion",
    aiSuggestionTitle: "AI Improvement Suggestion",
    originalContent: "Original Content",
    aiImprovedVersion: "AI Improved Version",
    yourRevision: "Your Revision",
    replaceWithRevision: "Replace with Revision",
    cancel: "Cancel",
    ideaImproved: "Idea Improved",
  },
  ko: {
    getAiSuggestion: "AI 제안 받기",
    aiSuggestionTitle: "AI 개선 제안",
    originalContent: "원본 내용",
    aiImprovedVersion: "AI 개선 버전",
    yourRevision: "수정 내용",
    replaceWithRevision: "수정 내용으로 교체",
    cancel: "취소",
    ideaImproved: "아이디어 개선됨",
  },
  ja: {
    getAiSuggestion: "AI提案を受ける",
    aiSuggestionTitle: "AI改善提案",
    originalContent: "元のコンテンツ",
    aiImprovedVersion: "AI改善バージョン",
    yourRevision: "あなたの修正",
    replaceWithRevision: "修正内容に置き換える",
    cancel: "キャンセル",
    ideaImproved: "アイデアが改善されました",
  },
  zh: {
    getAiSuggestion: "获取AI建议",
    aiSuggestionTitle: "AI改进建议",
    originalContent: "原始内容",
    aiImprovedVersion: "AI改进版本",
    yourRevision: "您的修改",
    replaceWithRevision: "用修改内容替换",
    cancel: "取消",
    ideaImproved: "创意已改进",
  },
}

// 아이디어 카드 타입 정의
interface IdeaCardProps {
  id: string
  title: string
  content: string
  onContentUpdate?: (id: string, newContent: string) => void
}

export default function IdeaCardWithAiSuggestion({ id, title, content, onContentUpdate }: IdeaCardProps) {
  const { language } = useLanguage()

  // 현재 언어에 맞는 번역 가져오기
  const t = translations[language]

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 수정 내용 상태
  const [revision, setRevision] = useState("")
  // 개선됨 상태
  const [isImproved, setIsImproved] = useState(false)

  // AI 개선 버전 (실제로는 API 호출 등을 통해 가져올 것)
  const aiImprovedVersion = `${content}

이 아이디어를 더 구체화하면, 우리는 AI 기반 맞춤형 학습 경로를 제공하는 플랫폼을 통해 학습자의 개인 학습 스타일과 속도에 맞춘 교육을 제공할 수 있습니다. 실시간 코드 분석을 통해 즉각적인 피드백을 제공하고, 학습자의 강점과 약점을 파악하여 최적화된 콘텐츠를 추천합니다. 

또한 게임화 요소를 도입하여 학습 동기를 유지하고, 커뮤니티 기능을 통해 동료 학습자들과의 협업을 촉진합니다. 이는 기존의 일방향적 온라인 교육과 차별화되는 핵심 가치입니다.`

  // AI 제안 받기 버튼 클릭 핸들러
  const handleGetAiSuggestion = () => {
    setRevision(aiImprovedVersion)
    setIsModalOpen(true)
  }

  // 수정 내용 변경 핸들러
  const handleRevisionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRevision(e.target.value)
  }

  // 수정 내용으로 교체 핸들러
  const handleReplaceWithRevision = () => {
    if (onContentUpdate) {
      onContentUpdate(id, revision)
      setIsImproved(true)
    }
    setIsModalOpen(false)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            {isImproved && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {t.ideaImproved}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{content}</p>
        </CardContent>
        <CardFooter className="pt-3">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-dashed"
            onClick={handleGetAiSuggestion}
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            {t.getAiSuggestion}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              {t.aiSuggestionTitle}
            </DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* 원본 내용 */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">{t.originalContent}</h3>
              <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">{content}</div>
            </div>

            {/* AI 개선 버전 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">{t.aiImprovedVersion}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-md text-sm whitespace-pre-wrap">
                {aiImprovedVersion}
              </div>
            </div>

            {/* 사용자 수정 */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t.yourRevision}</h3>
              <Textarea
                value={revision}
                onChange={handleRevisionChange}
                rows={8}
                className="resize-none"
                placeholder={aiImprovedVersion}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleReplaceWithRevision} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t.replaceWithRevision}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
