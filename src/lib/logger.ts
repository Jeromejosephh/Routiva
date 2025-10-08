type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, userId, error, metadata } = entry;
    
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (userId) {
      logMessage += ` | User: ${userId}`;
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }
    
    if (metadata && Object.keys(metadata).length > 0) {
      logMessage += ` | Metadata: ${JSON.stringify(metadata)}`;
    }
    
    return logMessage;
  }

  // Allow additional arbitrary properties in options to avoid strict object literal errors
  private log(level: LogLevel, message: string, options?: {
    userId?: string;
    error?: Error;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  }) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...options,
    };

    const formattedLog = this.formatLog(entry);

    //Console output
    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formattedLog);
        break;
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }

    //Send errors to external logger in production
    if (!this.isDevelopment && level === 'error') {
      //Send to external logging service
      this.sendToExternalLogger(entry);
    }
  }

  private sendToExternalLogger(entry: LogEntry) {
    // TODO: Integrate with external logging service (e.g., Sentry, LogRocket)
    // Example: Sentry.captureException(entry.error)
    console.error('External logging not configured:', entry.error);
  }

  debug(message: string, options?: { userId?: string; metadata?: Record<string, unknown>; [key: string]: unknown }) {
    this.log('debug', message, options);
  }

  info(message: string, options?: { userId?: string; metadata?: Record<string, unknown>; [key: string]: unknown }) {
    this.log('info', message, options);
  }

  warn(message: string, options?: { userId?: string; metadata?: Record<string, unknown>; [key: string]: unknown }) {
    this.log('warn', message, options);
  }

  error(message: string, options?: { 
    userId?: string; 
    error?: Error; 
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  }) {
    this.log('error', message, options);
  }
}

export const logger = new Logger();
