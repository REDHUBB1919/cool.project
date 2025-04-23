import { MainNav } from "@/components/main-nav"
import LanguageSelector from "@/components/language-selector"
import LogoutButton from "@/components/logout-button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <LanguageSelector />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
