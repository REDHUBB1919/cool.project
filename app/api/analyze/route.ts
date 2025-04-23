import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AIAnalysisResult, Idea } from '@/lib/ai';
import { logger } from '@/lib/logger';
import { 
  ApiKeyError, 
  ExternalServiceError, 
  InternalServerError, 
  DataValidationError,
  AppError
} from '@/lib/app-errors';

// OpenAI 클라이언트 초기화 (빌드 시 환경 변수 없을 때 오류 방지)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null; // 빌드 시에만 null, 실제 API 호출 시에는 키 필요

export async function POST(request: Request) {
  try {
    const { ideas } = await request.json();

    // 입력 데이터 검증
    if (!Array.isArray(ideas) || ideas.length === 0) {
      throw new DataValidationError('유효하지 않은 아이디어 목록입니다.');
    }

    // OpenAI API 호출을 위한 프롬프트 생성
    const prompt = `다음 창업 아이디어를 분석해주세요. 각 아이디어에 대해 SWOT 분석을 수행하고, 
    전반적인 점수(0-100)와 개선 제안을 제공해주세요.

    아이디어 목록:
    ${ideas.map((idea: Idea, index: number) => `
    ${index + 1}. ${idea.title}
    설명: ${idea.description}
    `).join('\n')}

    다음 형식으로 JSON 응답을 제공해주세요:
    {
      "overallScore": number,
      "swotAnalysis": {
        "strengths": string[],
        "weaknesses": string[],
        "opportunities": string[],
        "threats": string[]
      },
      "suggestions": [
        {
          "ideaId": string,
          "suggestion": string
        }
      ]
    }`;

    // OpenAI API 호출 (API 키 확인)
    if (!openai) {
      throw new ApiKeyError('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "당신은 스타트업 아이디어 분석 전문가입니다. 주어진 아이디어를 객관적으로 분석하고 건설적인 피드백을 제공합니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // API 응답 파싱
    const content = response.choices[0].message.content;
    if (!content) {
      throw new ExternalServiceError('OpenAI API 응답에서 content가 비어있습니다.');
    }
    
    try {
      const result = JSON.parse(content) as AIAnalysisResult;
      return NextResponse.json(result);
    } catch (parseError) {
      logger.error('OpenAI API 응답 파싱 실패', parseError as Error, { content });
      throw new ExternalServiceError('OpenAI API 응답을 파싱하는데 실패했습니다.');
    }
  } catch (error: unknown) {
    // 커스텀 에러 처리
    if (error instanceof AppError) {
      logger.error(error.message, error, error.metadata);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    
    // 기타 예상치 못한 에러
    const unknownError = error instanceof Error ? error : new Error(String(error));
    logger.error('아이디어 분석 중 예상치 못한 오류 발생', unknownError);
    return NextResponse.json(
      { error: '아이디어 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
