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

  private log(level: LogLevel, message: string, options?: {
    userId?: string;
    error?: Error;
    metadata?: Record<string, unknown>;
  }) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...options,
    };

    const formattedLog = this.formatLog(entry);

    // Console output
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

    // In production, you might want to send to external logging service
    if (!this.isDevelopment && level === 'error') {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket, etc.)
      this.sendToExternalLogger(entry);
    }
  }

  private sendToExternalLogger(_entry: LogEntry) {
    // Placeholder for external logging service integration
    // Example: Sentry.captureException(entry.error);
  }

  debug(message: string, options?: { userId?: string; metadata?: Record<string, unknown> }) {
    this.log('debug', message, options);
  }

  info(message: string, options?: { userId?: string; metadata?: Record<string, unknown> }) {
    this.log('info', message, options);
  }

  warn(message: string, options?: { userId?: string; metadata?: Record<string, unknown> }) {
    this.log('warn', message, options);
  }

  error(message: string, options?: { 
    userId?: string; 
    error?: Error; 
    metadata?: Record<string, unknown> 
  }) {
    this.log('error', message, options);
  }
}

export const logger = new Logger();
