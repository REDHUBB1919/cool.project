"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDown, Link, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useLanguage } from "@/context/language-context"

// 언어별 번역
const translations = {
  en: {
    downloadPdf: "Download PDF Report",
    copyLink: "Copy Shareable Link",
    includePersonalInfo: "Include personal information",
    downloading: "Downloading...",
    linkCopied: "Link copied to clipboard!",
  },
  ko: {
    downloadPdf: "PDF 리포트 다운로드",
    copyLink: "공유 링크 복사",
    includePersonalInfo: "개인 정보 포함",
    downloading: "다운로드 중...",
    linkCopied: "링크가 클립보드에 복사되었습니다!",
  },
  ja: {
    downloadPdf: "PDFレポートをダウンロード",
    copyLink: "共有リンクをコピー",
    includePersonalInfo: "個人情報を含める",
    downloading: "ダウンロード中...",
    linkCopied: "リンクがクリップボードにコピーされました！",
  },
  zh: {
    downloadPdf: "下载PDF报告",
    copyLink: "复制分享链接",
    includePersonalInfo: "包含个人信息",
    downloading: "下载中...",
    linkCopied: "链接已复制到剪贴板！",
  },
}

interface ReportActionBarProps {
  reportId?: string
}

export default function ReportActionBar({ reportId = "demo-report" }: ReportActionBarProps) {
  const { language } = useLanguage()

  // 현재 언어에 맞는 번역 가져오기
  const t = translations[language]

  // 상태 관리
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  // 모바일 화면 여부 확인
  const isMobile = useMediaQuery("(max-width: 640px)")

  // PDF 다운로드 핸들러
  const handleDownloadPdf = async () => {
    setIsDownloading(true)

    // 실제 구현에서는 여기에 PDF 생성 및 다운로드 로직 추가
    // 예: API 호출을 통한 PDF 생성 및 다운로드

    // 데모를 위한 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsDownloading(false)

    // 성공 메시지 표시
    toast({
      title: "PDF 다운로드 완료",
      description: `리포트 ID: ${reportId}${includePersonalInfo ? " (개인 정보 포함)" : ""}`,
    })
  }

  // 공유 링크 복사 핸들러
  const handleCopyLink = async () => {
    setIsCopying(true)

    // 공유 링크 생성 (실제 구현에서는 API를 통해 생성할 수 있음)
    const shareableLink = `https://startup-analyzer.example/report/${reportId}${includePersonalInfo ? "?include_personal=1" : ""}`

    try {
      await navigator.clipboard.writeText(shareableLink)

      // 성공 메시지 표시
      toast({
        title: t.linkCopied,
        description: shareableLink,
      })
    } catch (err) {
      // 클립보드 API 실패 시 대체 방법
      console.error("클립보드 복사 실패:", err)

      // 실패 메시지 표시
      toast({
        title: "링크 복사 실패",
        description: "클립보드 접근 권한이 없습니다.",
        variant: "destructive",
      })
    }

    setIsCopying(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      {/* 그라데이션 페이드 효과 */}
      <div className="h-16 bg-gradient-to-t from-background to-transparent" />

      {/* 액션 바 */}
      <div className="bg-background/80 backdrop-blur-md border-t border-border p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center flex-1 flex-wrap gap-3">
          {/* 개인 정보 포함 체크박스 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-personal-info"
              checked={includePersonalInfo}
              onCheckedChange={(checked) => setIncludePersonalInfo(checked === true)}
            />
            <label
              htmlFor="include-personal-info"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t.includePersonalInfo}
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* 공유 링크 복사 버튼 */}
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleCopyLink}
            disabled={isCopying}
            className="whitespace-nowrap"
          >
            {isCopying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>{t.linkCopied}</span>
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                <span>{t.copyLink}</span>
              </>
            )}
          </Button>

          {/* PDF 다운로드 버튼 */}
          <Button
            variant="default"
            size={isMobile ? "sm" : "default"}
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="whitespace-nowrap"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>{t.downloading}</span>
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                <span>{t.downloadPdf}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
