/**
 * 커스텀 에러 클래스
 * 이 파일은 애플리케이션 전체에서 사용되는 커스텀 에러 클래스를 정의합니다.
 * 
 * 주요 기능:
 * 1. 에러 타입 정의
 * 2. 에러 코드 관리
 * 3. 에러 메시지 표준화
 * 4. 에러 추적을 위한 메타데이터 지원
 */

// 에러 코드 정의
export enum ErrorCode {
  // 인증 관련 에러 (1000-1999)
  AUTH_REQUIRED = 1000,
  INVALID_CREDENTIALS = 1001,
  TOKEN_EXPIRED = 1002,
  TOKEN_INVALID = 1003,
  
  // API 관련 에러 (2000-2999)
  API_KEY_INVALID = 2000,
  API_KEY_EXPIRED = 2001,
  API_RATE_LIMIT = 2002,
  API_SERVICE_UNAVAILABLE = 2003,
  
  // 데이터 관련 에러 (3000-3999)
  DATA_NOT_FOUND = 3000,
  DATA_VALIDATION_FAILED = 3001,
  DATA_ALREADY_EXISTS = 3002,
  
  // 시스템 관련 에러 (9000-9999)
  INTERNAL_SERVER_ERROR = 9000,
  EXTERNAL_SERVICE_ERROR = 9001,
  CONFIGURATION_ERROR = 9002,
}

// 기본 커스텀 에러 클래스
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly metadata?: Record<string, any>;
  public readonly traceId?: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    metadata?: Record<string, any>,
    traceId?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.traceId = traceId;
    
    // Error 프로토타입 체인 유지
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
      traceId: this.traceId,
      stack: this.stack,
    };
  }
}

// 인증 관련 에러
export class AuthenticationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.AUTH_REQUIRED, 401, metadata, traceId);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = '유효하지 않은 인증 정보입니다.', metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.INVALID_CREDENTIALS, 401, metadata, traceId);
  }
}

// API 관련 에러
export class ApiKeyError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.API_KEY_INVALID, 403, metadata, traceId);
  }
}

export class ApiRateLimitError extends AppError {
  constructor(message: string = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.', metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.API_RATE_LIMIT, 429, metadata, traceId);
  }
}

// 데이터 관련 에러
export class DataNotFoundError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.DATA_NOT_FOUND, 404, metadata, traceId);
  }
}

export class DataValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.DATA_VALIDATION_FAILED, 400, metadata, traceId);
  }
}

// 시스템 관련 에러
export class InternalServerError extends AppError {
  constructor(message: string = '서버 내부 오류가 발생했습니다.', metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR, 500, metadata, traceId);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.EXTERNAL_SERVICE_ERROR, 502, metadata, traceId);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>, traceId?: string) {
    super(message, ErrorCode.CONFIGURATION_ERROR, 500, metadata, traceId);
  }
} 