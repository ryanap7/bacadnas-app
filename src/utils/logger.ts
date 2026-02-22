/**
 * Logger Utility
 * Provides structured logging for development and production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = __DEV__;

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const entry = this.formatMessage(level, message, data);
    const prefix = `[${level.toUpperCase()}] [${entry.timestamp}]`;

    switch (level) {
      case 'info':
        console.log(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
      case 'debug':
        console.log(prefix, message, data || '');
        break;
    }
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: any): void {
    this.log('error', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
    });
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  // API specific logging
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any): void {
    this.debug(`API Response: ${method} ${url} - ${status}`, data);
  }

  apiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, error);
  }

  // Auth specific logging
  authAction(action: string, data?: any): void {
    this.info(`Auth: ${action}`, data);
  }

  // Network specific logging
  networkStatus(isOnline: boolean, type?: string): void {
    this.info(`Network: ${isOnline ? 'Online' : 'Offline'}`, { type });
  }

  // Queue specific logging
  queueAction(action: string, data?: any): void {
    this.info(`Queue: ${action}`, data);
  }
}

export const logger = new Logger();