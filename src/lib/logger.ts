/**
 * Simple logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const shouldLog = (level: LogLevel): boolean => {
  const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };
  
  const currentLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  return levels[level] >= levels[currentLevel as LogLevel];
};

export const logger = {
  debug: (message: string, data?: any) => {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
  
  info: (message: string, data?: any) => {
    if (shouldLog('info')) {
      console.info(`[INFO] ${message}`, data || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  }
};
