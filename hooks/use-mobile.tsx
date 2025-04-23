"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // 초기 상태 설정
    setMatches(media.matches)

    // 변경 이벤트 리스너 추가
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // 클린업 함수
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// 모바일 환경 여부를 반환하는 커스텀 훅
export function useIsMobile(): boolean {
  // 768px 이하를 모바일로 간주
  return useMediaQuery("(max-width: 768px)")
}
