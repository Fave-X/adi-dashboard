import { ethers } from 'ethers'

// ADI Chain Configuration
const ADI_CHAIN_CONFIG = {
  chainId: 36900,
  chainName: 'ADI Chain',
  rpcUrls: [
    'https://rpc.adifoundation.ai',
    'https://rpc-mainnet.adifoundation.ai', // Fallback RPC
    'https://adi.rpc.thirdweb.com' // Additional fallback
  ],
  blockExplorerUrls: [
    'https://explorer-bls.adifoundation.ai',
    'https://explorer.adifoundation.ai' // Fallback explorer
  ]
}

// Connection state management
class BlockchainService {
  constructor() {
    this.provider = null
    this.isConnecting = false
    this.connectionAttempts = 0
    this.lastConnectionTime = 0
    this.circuitBreakerState = 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    this.circuitBreakerOpenTime = 0
    this.connectionHealthCheckInterval = null
    this.eventListeners = new Map()
    
    // Connection quality metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastSuccessfulRequest: 0,
      connectionDrops: 0
    }
  }

  // Exponential backoff calculation
  calculateBackoffDelay(attempt) {
    const baseDelay = 1000 // 1 second base
    const maxDelay = 30000 // 30 second max
    const exponentialDelay = baseDelay * Math.pow(2, attempt)
    const jitter = Math.random() * 1000 // Add jitter to avoid thundering herd
    return Math.min(exponentialDelay + jitter, maxDelay)
  }

  // Circuit breaker logic
  checkCircuitBreaker() {
    const now = Date.now()
    
    if (this.circuitBreakerState === 'OPEN') {
      // Check if circuit breaker should be half-open
      if (now - this.circuitBreakerOpenTime > 60000) { // 60 second timeout
        this.circuitBreakerState = 'HALF_OPEN'
        console.log('🔄 Circuit breaker transitioning to HALF_OPEN')
        return true // Allow one test request
      }
      return false // Block requests
    }
    
    return true // Allow requests
  }

  recordSuccess() {
    this.metrics.successfulRequests++
    this.metrics.lastSuccessfulRequest = Date.now()
    this.connectionAttempts = 0
    
    // Close circuit breaker on success
    if (this.circuitBreakerState === 'HALF_OPEN') {
      this.circuitBreakerState = 'CLOSED'
      console.log('✅ Circuit breaker CLOSED after successful request')
    }
  }

  recordFailure(error) {
    this.metrics.failedRequests++
    this.connectionAttempts++
    
    // Open circuit breaker after 3 consecutive failures
    if (this.connectionAttempts >= 3) {
      this.circuitBreakerState = 'OPEN'
      this.circuitBreakerOpenTime = Date.now()
      console.log('🚫 Circuit breaker OPENED after 3 consecutive failures')
    }
  }

  // Initialize provider with retry logic
  async initializeProvider(retryCount = 0) {
    if (this.isConnecting) {
      console.log('🔄 Provider initialization already in progress')
      return this.provider
    }

    if (!this.checkCircuitBreaker()) {
      throw new Error('Circuit breaker is OPEN - blocking provider initialization')
    }

    this.isConnecting = true
    
    try {
      console.log(`🔌 Initializing provider (attempt ${retryCount + 1}/3)`)
      
      // Try RPC URLs in order with fallback
      for (const rpcUrl of ADI_CHAIN_CONFIG.rpcUrls) {
        try {
          const provider = new ethers.JsonRpcProvider(rpcUrl, {
            chainId: `0x${ADI_CHAIN_CONFIG.chainId.toString(16)}`,
            name: ADI_CHAIN_CONFIG.chainName,
          })

          // Test connection with a simple call
          const startTime = Date.now()
          await provider.getNetwork()
          const responseTime = Date.now() - startTime
          
          // Configure provider with performance settings
          provider.pollingInterval = 4000 // 4 second polling
          provider._getConnection().timeout = 10000 // 10 second timeout
          
          this.provider = provider
          this.lastConnectionTime = Date.now()
          this.isConnecting = false
          
          // Update metrics
          this.metrics.totalRequests++
          this.metrics.successfulRequests++
          this.metrics.averageResponseTime = 
            (this.metrics.averageResponseTime + responseTime) / 2
          
          console.log(`✅ Provider initialized successfully with ${rpcUrl} (${responseTime}ms)`)
          
          // Start health monitoring
          this.startHealthMonitoring()
          
          return provider
          
        } catch (rpcError) {
          console.warn(`⚠️ RPC ${rpcUrl} failed:`, rpcError.message)
          continue // Try next RPC URL
        }
      }
      
      throw new Error('All RPC URLs failed')
      
    } catch (error) {
      this.isConnecting = false
      this.recordFailure(error)
      
      if (retryCount < 2) {
        const delay = this.calculateBackoffDelay(retryCount)
        console.log(`🔄 Retrying provider initialization in ${delay}ms...`)
        
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.initializeProvider(retryCount + 1))
          }, delay)
        })
      } else {
        console.error('❌ Provider initialization failed after 3 attempts:', error)
        throw error
      }
    }
  }

  // Health monitoring with automatic reconnection
  startHealthMonitoring() {
    if (this.connectionHealthCheckInterval) {
      clearInterval(this.connectionHealthCheckInterval)
    }
    
    this.connectionHealthCheckInterval = setInterval(async () => {
      try {
        const startTime = Date.now()
        await this.provider.getNetwork()
        const responseTime = Date.now() - startTime
        
        // Update metrics
        this.metrics.totalRequests++
        this.metrics.successfulRequests++
        this.metrics.averageResponseTime = 
          (this.metrics.averageResponseTime + responseTime) / 2
        this.metrics.lastSuccessfulRequest = Date.now()
        
        // Log health status
        if (responseTime > 5000) {
          console.warn(`⚠️ Slow RPC response: ${responseTime}ms`)
        }
        
      } catch (error) {
        console.error('❌ Health check failed:', error)
        this.metrics.failedRequests++
        this.metrics.connectionDrops++
        
        // Attempt reconnection on health check failure
        if (this.circuitBreakerState === 'CLOSED') {
          console.log('🔄 Connection drop detected, attempting reconnection...')
          this.reconnect()
        }
      }
    }, 30000) // Health check every 30 seconds
  }

  // Reconnection logic
  async reconnect() {
    try {
      // Cleanup existing provider
      this.cleanup()
      
      // Reset circuit breaker to allow reconnection
      this.circuitBreakerState = 'HALF_OPEN'
      this.connectionAttempts = 0
      
      // Initialize new provider
      await this.initializeProvider()
      
      // Notify listeners of reconnection
      this.emit('reconnected', {
        timestamp: Date.now(),
        provider: this.provider
      })
      
    } catch (error) {
      console.error('❌ Reconnection failed:', error)
      this.emit('reconnectionFailed', { error, timestamp: Date.now() })
    }
  }

  // Event system for connection status updates
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event).add(callback)
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback)
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error)
        }
      })
    }
  }

  // Safe RPC call with retry and circuit breaker
  async safeCall(method, ...args) {
    if (!this.provider) {
      throw new Error('Provider not initialized')
    }

    if (!this.checkCircuitBreaker()) {
      throw new Error('Circuit breaker is OPEN - blocking RPC call')
    }

    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      const result = await this.provider[method](...args)
      const responseTime = Date.now() - startTime
      
      this.recordSuccess()
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + responseTime) / 2
      
      return result
      
    } catch (error) {
      this.recordFailure(error)
      
      // If it's a connection error, try reconnection
      if (this.isConnectionError(error)) {
        console.log('🔄 Connection error detected, attempting reconnection...')
        await this.reconnect()
      }
      
      throw error
    }
  }

  // Detect connection errors vs application errors
  isConnectionError(error) {
    const connectionErrorMessages = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'ECONNRESET',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'could not detect network',
      'missing provider',
      'missing response'
    ]
    
    const errorMessage = error.message?.toLowerCase() || ''
    return connectionErrorMessages.some(msg => 
      errorMessage.includes(msg.toLowerCase())
    )
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.provider !== null,
      circuitBreakerState: this.circuitBreakerState,
      lastConnectionTime: this.lastConnectionTime,
      metrics: { ...this.metrics },
      provider: this.provider
    }
  }

  // Get chain information
  getChainInfo() {
    return ADI_CHAIN_CONFIG
  }

  // Cleanup resources and prevent memory leaks
  cleanup() {
    console.log('🧹 Cleaning up blockchain service resources...')
    
    // Clear health monitoring interval
    if (this.connectionHealthCheckInterval) {
      clearInterval(this.connectionHealthCheckInterval)
      this.connectionHealthCheckInterval = null
    }
    
    // Clear all event listeners
    this.eventListeners.clear()
    
    // Cleanup provider if it exists
    if (this.provider) {
      try {
        // Remove all provider event listeners
        this.provider.removeAllListeners()
        
        // Clear any pending polling
        if (this.provider.polling) {
          this.provider.polling = false
        }
        
        console.log('✅ Provider cleanup completed')
      } catch (error) {
        console.error('❌ Error during provider cleanup:', error)
      }
      
      this.provider = null
    }
    
    // Reset state
    this.isConnecting = false
    this.connectionAttempts = 0
    this.circuitBreakerState = 'CLOSED'
  }

  // Get provider (initializes if needed)
  async getProvider() {
    if (!this.provider) {
      return await this.initializeProvider()
    }
    return this.provider
  }
}

// Singleton instance
const blockchainService = new BlockchainService()

export default blockchainService

// Export convenience functions
export const getBlockchainProvider = () => blockchainService.getProvider()
export const getBlockchainStatus = () => blockchainService.getConnectionStatus()
export const getChainInfo = () => blockchainService.getChainInfo()
export const cleanupBlockchain = () => blockchainService.cleanup()
