import { useEffect, useRef, useState, useCallback } from 'react'
import blockchainService, { getBlockchainStatus, cleanupBlockchain } from '../services/blockchainService'

// React hook for blockchain service with proper lifecycle management
export const useBlockchain = () => {
  const [status, setStatus] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const mountedRef = useRef(false)

  // Initialize blockchain service
  const initialize = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      setError(null)
      setStatus('initializing')

      const provider = await blockchainService.initializeProvider()
      setIsInitialized(true)
      setStatus(provider ? 'connected' : 'disconnected')

      console.log(provider ? '✅ Blockchain service initialized successfully' : '⚠️ Blockchain service initialized with no provider')
    } catch (err) {
      console.error('❌ Blockchain service initialization failed:', err)
      setError(err.message)
      setStatus('error')
    }
  }, [])

  // Setup event listeners
  const setupEventListeners = useCallback(() => {
    if (!mountedRef.current) return

    // Listen for reconnection events
    blockchainService.on('reconnected', (data) => {
      console.log('🔄 Blockchain reconnected:', data)
      if (mountedRef.current) {
        setStatus('connected')
        setError(null)
      }
    })

    blockchainService.on('reconnectionFailed', (data) => {
      console.error('❌ Blockchain reconnection failed:', data)
      if (mountedRef.current) {
        setError(data.error.message)
        setStatus('error')
      }
    })
  }, [])

  // Get current status
  const getCurrentStatus = useCallback(() => {
    return getBlockchainStatus()
  }, [])

  // Safe RPC call wrapper
  const safeCall = useCallback(async (method, ...args) => {
    if (!mountedRef.current || !isInitialized) {
      throw new Error('Blockchain service not initialized')
    }
    
    try {
      return await blockchainService.safeCall(method, ...args)
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message)
      }
      throw err
    }
  }, [isInitialized])

  // Initialize on mount
  useEffect(() => {
    mountedRef.current = true
    
    const init = async () => {
      setupEventListeners()
      await initialize()
    }
    
    init()

    // Cleanup on unmount
    return () => {
      mountedRef.current = false
      
      // Cleanup blockchain resources
      try {
        cleanupBlockchain()
        console.log('✅ Blockchain service cleanup completed')
      } catch (cleanupError) {
        console.error('❌ Error during blockchain cleanup:', cleanupError)
      }
      
      setIsInitialized(false)
      setStatus(null)
    }
  }, [initialize, setupEventListeners])

  // Periodic status updates
  useEffect(() => {
    if (!isInitialized) return

    const statusInterval = setInterval(() => {
      if (mountedRef.current) {
        const currentStatus = getCurrentStatus()
        setStatus(currentStatus.isConnected ? 'connected' : 'disconnected')
      }
    }, 5000) // Update status every 5 seconds

    return () => clearInterval(statusInterval)
  }, [isInitialized, getCurrentStatus])

  return {
    // State
    status,
    isInitialized,
    error,
    
    // Methods
    initialize,
    getCurrentStatus,
    safeCall,
    
    // Convenience methods
    getProvider: () => blockchainService.getProvider(),
    getChainInfo: () => blockchainService.getChainInfo()
  }
}
