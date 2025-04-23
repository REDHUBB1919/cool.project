"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/context/language-context"

const translations = {
  en: {
    logout: "Logout",
  },
  ko: {
    logout: "로그아웃",
  },
  ja: {
    logout: "ログアウト",
  },
  zh: {
    logout: "退出登录",
  },
}

export default function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()
  const { language } = useLanguage()
  const t = translations[language]

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline-block">{t.logout}</span>
    </Button>
  )
} 