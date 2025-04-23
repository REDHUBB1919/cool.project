"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

type LanguageOption = {
  code: "en" | "ko" | "ja" | "zh"
  name: string
  nativeName: string
  flag: string
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languages.find((lang) => lang.code === language) || languages[1],
  )

  useEffect(() => {
    setCurrentLanguage(languages.find((lang) => lang.code === language) || languages[1])
  }, [language])

  const changeLanguage = (lang: LanguageOption) => {
    setCurrentLanguage(lang)
    setLanguage(lang.code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage.nativeName}</span>
          <span className="inline-block sm:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
            {currentLanguage.code === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
