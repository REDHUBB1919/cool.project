'use client';

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import FormWithExamples from "@/components/form-with-examples"
import RequireAuthOverlay from "@/app/components/RequireAuthOverlay"

export default function ExamplesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  // 로그인하지 않은 경우 빈 페이지 반환 (리다이렉트 전에 잠시 표시됨)
  if (!currentUser) {
    return null
  }

  return (
    <RequireAuthOverlay>
      <main className="flex-1">
        <FormWithExamples />
      </main>
    </RequireAuthOverlay>
  )
}
