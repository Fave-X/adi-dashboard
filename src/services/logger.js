// Structured Logging Service - Production-ready error and performance logging
// Implements SRE observability patterns with proper categorization

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

const LOG_CATEGORIES = {
  API: 'api',
  BLOCKCHAIN: 'blockchain',
  UI: 'ui',
  PERFORMANCE: 'performance',
  USER: 'user',
  SYSTEM: 'system'
}

class StructuredLogger {
  constructor() {
    this.logBuffer = []
    this.maxBufferSize = 100
    this.flushInterval = 5000 // 5 seconds
    this.isDevelopment = process.env.NODE_ENV === 'development'
    
    // Start flush interval
    this.startFlushInterval()
  }

  // Core logging method
  log(level, category, message, metadata = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: Object.keys(LOG_LEVELS)[level],
      category,
      message,
      metadata: {
        ...metadata,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        sessionId: this.getSessionId()
      }
    }

    // Add to buffer
    this.logBuffer.push(logEntry)

    // Immediately flush for errors and warnings
    if (level <= LOG_LEVELS.WARN) {
      this.flush()
    }

    // Console output in development
    if (this.isDevelopment) {
      this.consoleOutput(logEntry)
    }
  }

  // Convenience methods
  error(category, message, metadata) {
    this.log(LOG_LEVELS.ERROR, category, message, metadata)
  }

  warn(category, message, metadata) {
    this.log(LOG_LEVELS.WARN, category, message, metadata)
  }

  info(category, message, metadata) {
    this.log(LOG_LEVELS.INFO, category, message, metadata)
  }

  debug(category, message, metadata) {
    this.log(LOG_LEVELS.DEBUG, category, message, metadata)
  }

  // Performance logging
  performance(operation, duration, metadata = {}) {
    this.info(LOG_CATEGORIES.PERFORMANCE, `${operation} completed`, {
      duration,
      operation,
      ...metadata
    })
  }

  // API call logging
  apiCall(service, endpoint, method, duration, status, error = null) {
    const metadata = {
      service,
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300
    }

    if (error) {
      metadata.error = error.message
      metadata.errorType = this.categorizeError(error)
      this.error(LOG_CATEGORIES.API, `API call failed: ${service} ${method} ${endpoint}`, metadata)
    } else {
      this.info(LOG_CATEGORIES.API, `API call successful: ${service} ${method} ${endpoint}`, metadata)
    }
  }

  // Blockchain operation logging
  blockchainOperation(operation, duration, success, error = null) {
    const metadata = {
      operation,
      duration,
      success,
      chainId: 36900 // ADI Chain
    }

    if (error) {
      metadata.error = error.message
      metadata.errorType = this.categorizeError(error)
      this.error(LOG_CATEGORIES.BLOCKCHAIN, `Blockchain operation failed: ${operation}`, metadata)
    } else {
      this.info(LOG_CATEGORIES.BLOCKCHAIN, `Blockchain operation successful: ${operation}`, metadata)
    }
  }

  // UI interaction logging
  uiInteraction(component, action, metadata = {}) {
    this.info(LOG_CATEGORIES.UI, `UI interaction: ${component} ${action}`, {
      component,
      action,
      ...metadata
    })
  }

  // Error categorization
  categorizeError(error) {
    if (!error) return 'unknown'
    
    const message = error.message?.toLowerCase() || ''
    
    if (message.includes('network') || message.includes('connection')) {
      return 'network'
    } else if (message.includes('timeout')) {
      return 'timeout'
    } else if (message.includes('rate limit') || message.includes('429')) {
      return 'rate_limit'
    } else if (message.includes('parse') || message.includes('json')) {
      return 'parse'
    } else if (message.includes('circuit')) {
      return 'circuit_breaker'
    } else {
      return 'application'
    }
  }

  // Session management
  getSessionId() {
    if (typeof window === 'undefined') return 'server-session'
    
    let sessionId = sessionStorage.getItem('adi_log_session')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('adi_log_session', sessionId)
    }
    return sessionId
  }

  // Console output for development
  consoleOutput(logEntry) {
    const { timestamp, level, category, message, metadata } = logEntry
    const style = this.getConsoleStyle(level)
    
    console.group(
      `%c[${timestamp}] %c${level.toUpperCase()} %c[${category}]`,
      'color: #999; font-size: 11px;',
      style,
      'color: #666; font-weight: bold;'
    )
    
    console.log(`%c${message}`, 'color: #333;')
    
    if (Object.keys(metadata).length > 0) {
      console.log('%cMetadata:', 'color: #666; font-weight: bold;')
      console.log(metadata)
    }
    
    console.groupEnd()
  }

  getConsoleStyle(level) {
    switch (level) {
      case 'ERROR': return 'color: #f44336; font-weight: bold;'
      case 'WARN': return 'color: #f59e0b; font-weight: bold;'
      case 'INFO': return 'color: #3b82f6; font-weight: bold;'
      case 'DEBUG': return 'color: #6b7280;'
      default: return 'color: #333;'
    }
  }

  // Buffer management
  startFlushInterval() {
    if (typeof window !== 'undefined') {
      this.flushTimer = setInterval(() => {
        this.flush()
      }, this.flushInterval)
    }
  }

  flush() {
    if (this.logBuffer.length === 0) return

    const logs = [...this.logBuffer]
    this.logBuffer = []

    // In production, send to logging service
    if (!this.isDevelopment) {
      this.sendToLoggingService(logs)
    }
  }

  sendToLoggingService(logs) {
    // This would integrate with your logging service (e.g., Datadog, LogRocket, etc.)
    // For now, we'll store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('adi_error_logs') || '[]')
      const combinedLogs = [...existingLogs, ...logs].slice(-500) // Keep last 500 logs
      localStorage.setItem('adi_error_logs', JSON.stringify(combinedLogs))
    } catch (error) {
      console.error('Failed to store logs:', error)
    }
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush() // Flush remaining logs
  }
}

// Singleton instance
const logger = new StructuredLogger()

export default logger

// Export convenience functions
export const logError = (category, message, metadata) => logger.error(category, message, metadata)
export const logWarn = (category, message, metadata) => logger.warn(category, message, metadata)
export const logInfo = (category, message, metadata) => logger.info(category, message, metadata)
export const logPerformance = (operation, duration, metadata) => logger.performance(operation, duration, metadata)
export const logApiCall = (service, endpoint, method, duration, status, error) => 
  logger.apiCall(service, endpoint, method, duration, status, error)
export const logBlockchainOperation = (operation, duration, success, error) => 
  logger.blockchainOperation(operation, duration, success, error)
export const logUiInteraction = (component, action, metadata) => 
  logger.uiInteraction(component, action, metadata)

// Export constants
export { LOG_CATEGORIES, LOG_LEVELS }
