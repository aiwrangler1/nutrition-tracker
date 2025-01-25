import { AuthError } from '@supabase/supabase-js';

interface LogEntry {
  timestamp: string;
  method: string;
  type: 'error' | 'info' | 'warning';
  message: string;
  code?: string;
  userId?: string;
}

class AuthLogger {
  private static instance: AuthLogger;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  public logAuthError(
    method: string, 
    error: AuthError | null, 
    userId?: string
  ): void {
    if (error) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        method,
        type: 'error',
        message: error.message,
        code: error.code,
        userId
      };

      this.logs.push(logEntry);
      
      // Console logging
      console.error(`Auth Error in ${method}:`, logEntry);

      // Optional: Send to monitoring service
      this.sendToMonitoringService(logEntry);
    }
  }

  public logAuthEvent(
    method: string, 
    message: string, 
    type: 'info' | 'warning' = 'info',
    userId?: string
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      method,
      type,
      message,
      userId
    };

    this.logs.push(logEntry);
    
    // Console logging
    console.log(`Auth Event in ${method}:`, logEntry);
  }

  private sendToMonitoringService(logEntry: LogEntry): void {
    // Placeholder for future implementation
    // Could integrate with services like Sentry, LogRocket, etc.
    // For now, just a console log
    console.log('Monitoring Service Log:', logEntry);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

export const authLogger = AuthLogger.getInstance(); 