"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

const navItems = {
  en: [
    { href: "/", label: "Input Form" },
    { href: "/summary", label: "Summary" },
    { href: "/analysis", label: "Analysis" },
    { href: "/examples", label: "Examples" },
    { href: "/improve", label: "Improve" },
  ],
  ko: [
    { href: "/", label: "아이디어 입력" },
    { href: "/summary", label: "요약" },
    { href: "/analysis", label: "분석" },
    { href: "/examples", label: "예시" },
    { href: "/improve", label: "개선" },
  ],
  ja: [
    { href: "/", label: "アイデア入力" },
    { href: "/summary", label: "概要" },
    { href: "/analysis", label: "分析" },
    { href: "/examples", label: "例" },
    { href: "/improve", label: "改善" },
  ],
  zh: [
    { href: "/", label: "创意输入" },
    { href: "/summary", label: "摘要" },
    { href: "/analysis", label: "分析" },
    { href: "/examples", label: "示例" },
    { href: "/improve", label: "改进" },
  ],
}

export function MainNav() {
  const pathname = usePathname()
  const { language } = useLanguage()
  const items = navItems[language]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
