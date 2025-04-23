"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import StartupIdeaForm from "@/components/startup-idea-form"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { currentUser } = useAuth()
  const router = useRouter()

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  // 현재 선택된 언어 상태 (기본값: 한국어)
  // const [currentLanguage, setCurrentLanguage] = useState("ko")

  // return (
  //   <main className="relative min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-32">
  //     <div className="absolute top-4 right-4 z-10">
  //       <LanguageSelector onLanguageChange={setCurrentLanguage} />
  //     </div>

  //     <div className="container mx-auto py-8 px-4">
  //       <h1 className="text-3xl font-bold mb-8 text-center">AI 분석 리포트</h1>

  //       {/* 예시 콘텐츠 - 실제 구현에서는 실제 분석 결과로 대체 */}
  //       <div className="max-w-3xl mx-auto space-y-8">
  //         <p className="text-lg">
  //           이 페이지는 AI 분석 리포트 페이지의 예시입니다. 실제 구현에서는 이 부분에 분석 결과가 표시됩니다.
  //         </p>

  //         <div className="space-y-4">
  //           <h2 className="text-2xl font-semibold">주요 분석 결과</h2>
  //           <p>
  //             창업 아이디어에 대한 AI 분석 결과가 여기에 표시됩니다. 시장 적합성, 실행력, 팀 역량, 확장성 등 다양한
  //             측면에서의 평가와 SWOT 분석이 포함됩니다.
  //           </p>
  //         </div>

  //         <div className="space-y-4">
  //           <h2 className="text-2xl font-semibold">개선 제안</h2>
  //           <p>
  //             AI가 제안하는 아이디어 개선 방안이 여기에 표시됩니다. 각 영역별 구체적인 개선 방안과 실행 전략이
  //             포함됩니다.
  //           </p>
  //         </div>

  //         {/* 더미 콘텐츠 추가 - 스크롤 테스트용 */}
  //         {Array.from({ length: 5 }).map((_, i) => (
  //           <div key={i} className="space-y-4">
  //             <h2 className="text-2xl font-semibold">섹션 {i + 1}</h2>
  //             <p>
  //               이 섹션은 스크롤 테스트를 위한 더미 콘텐츠입니다. 실제 구현에서는 이 부분에 분석 결과의 세부 내용이
  //               표시됩니다.
  //             </p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* 리포트 액션 바 */}
  //     <ReportActionBar language={currentLanguage as "en" | "ko" | "ja" | "zh"} />

  //     {/* 토스트 메시지 표시용 */}
  //     <Toaster />
  //   </main>
  // )
  // 로그인하지 않은 경우 빈 페이지 반환 (리다이렉트 전에 잠시 표시됨)
  if (!currentUser) {
    return null
  }

  // 로그인한 경우에만 컨텐츠 표시
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        창업 아이디어 분석
      </h1>
      <StartupIdeaForm />
    </main>
  )
}
