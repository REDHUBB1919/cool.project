/**
 * 로깅 시스템
 * 이 파일은 애플리케이션 전체에서 사용되는 로깅 시스템을 제공합니다.
 * 
 * 주요 기능:
 * 1. 구조화된 로깅 (JSON 형식)
 * 2. 로그 레벨 관리
 * 3. 에러 추적
 * 4. 운영 환경 로깅 (Sentry/Firebase Crashlytics)
 */

// 로그 레벨 정의
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 로그 엔트리 인터페이스
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: Error;
  metadata?: Record<string, any>;
  traceId?: string;
  userId?: string;
}

// 운영 환경 로깅 서비스 인터페이스
interface LoggingService {
  captureException(error: Error, metadata?: Record<string, any>): void;
  captureMessage(message: string, level: LogLevel, metadata?: Record<string, any>): void;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private loggingService: LoggingService | null = null;
  private readonly MAX_LOGS = 1000; // 메모리에 저장할 최대 로그 수

  private constructor() {
    this.initializeLoggingService();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private initializeLoggingService(): void {
    // 운영 환경에서만 로깅 서비스 초기화
    if (process.env.NODE_ENV === 'production') {
      // TODO: 실제 운영 환경에서는 Sentry나 Firebase Crashlytics 초기화
      // 예시: this.loggingService = new SentryService();
    }
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      metadata,
      traceId: this.generateTraceId(),
      // TODO: 현재 사용자 ID 추가 (인증 컨텍스트에서 가져오기)
      // userId: getCurrentUserId(),
    };

    // 로그 저장 (최대 개수 제한)
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift(); // 가장 오래된 로그 제거
    }

    return entry;
  }

  private formatLogEntry(entry: LogEntry): string {
    const baseInfo = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      traceId: entry.traceId,
      userId: entry.userId,
    };

    if (entry.error) {
      return JSON.stringify({
        ...baseInfo,
        error: {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.error.stack,
        },
        metadata: entry.metadata,
      });
    }

    return JSON.stringify({
      ...baseInfo,
      metadata: entry.metadata,
    });
  }

  debug(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('debug', message, undefined, metadata);
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLogEntry(entry));
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, undefined, metadata);
    console.info(this.formatLogEntry(entry));
    
    if (this.loggingService) {
      this.loggingService.captureMessage(message, 'info', metadata);
    }
  }

  warn(message: string, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, undefined, metadata);
    console.warn(this.formatLogEntry(entry));
    
    if (this.loggingService) {
      this.loggingService.captureMessage(message, 'warn', metadata);
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, error, metadata);
    console.error(this.formatLogEntry(entry));
    
    if (this.loggingService && error) {
      this.loggingService.captureException(error, {
        ...metadata,
        message,
        traceId: entry.traceId,
      });
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByTraceId(traceId: string): LogEntry[] {
    return this.logs.filter(log => log.traceId === traceId);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 