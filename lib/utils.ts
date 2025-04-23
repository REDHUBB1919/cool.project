/**
 * 유틸리티 함수 모음
 * 이 파일은 프로젝트 전반에서 사용되는 유틸리티 함수들을 제공합니다.
 */

// clsx와 tailwind-merge 라이브러리 import
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 사용하여 클래스 이름을 병합하고 충돌을 해결합니다.
 * 
 * @param inputs - 병합할 클래스 이름들
 * @returns 병합된 클래스 문자열
 * 
 * 사용 예시:
 * cn('text-red-500', 'bg-blue-500', { 'hidden': isHidden })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
