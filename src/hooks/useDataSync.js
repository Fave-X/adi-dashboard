import { useEffect, useCallback, useRef } from 'react'
import { useData } from '../contexts/DataContext'
import { useBlockchain } from './useBlockchain'
import {
  fetchCoinGeckoCurrent,
  fetchCoinGeckoHistory,
  fetchCoinGeckoMarkets,
  fetchBlockscoutStats,
  fetchBlockscoutChart,
  fetchRPCData,
  getBlockchainStatus
} from '../services/unifiedApiService'

// Custom hook to coordinate all data fetching with race condition prevention
export const useDataSync = () => {
  const { state, actions } = useData()
  const blockchain = useBlockchain()
  const isInitialized = useRef(false)
  const fetchPromises = useRef(new Map())
  const lastDataRef = useRef({})

  // Generic fetch wrapper to prevent duplicate requests
  const fetchWithDeduplication = useCallback(async (key, fetchFunction, ...args) => {
    // Check if already fetching
    if (fetchPromises.current.has(key)) {
      return fetchPromises.current.get(key)
    }

    // Create and store promise
    const promise = fetchFunction(...args)
    fetchPromises.current.set(key, promise)

    try {
      const result = await promise
      return result
    } finally {
      // Clean up after completion
      fetchPromises.current.delete(key)
    }
  }, [])

  // Fetch CoinGecko data
  const fetchCoinGeckoData = useCallback(async () => {
    try {
      actions.setConnectionStatus('coingecko', 'loading')
      
      // Fetch current price and history in parallel
      const [currentData, historyData, marketsData] = await Promise.all([
        fetchWithDeduplication('coingecko_current', fetchCoinGeckoCurrent),
        fetchWithDeduplication(`coingecko_history_${state.selectedPeriod}`, fetchCoinGeckoHistory, state.selectedPeriod),
        fetchWithDeduplication('coingecko_markets', fetchCoinGeckoMarkets)
      ])
      
      // Update state
      actions.setCoinGeckoCurrent(currentData)
      actions.setCoinGeckoHistory(state.selectedPeriod, historyData)
      actions.setCoinGeckoLastUpdated(currentData.lastUpdated)
      actions.setConnectionStatus('coingecko', 'success')
      actions.setGlobalLastUpdated(Date.now())
      
    } catch (error) {
      console.error('CoinGecko sync failed:', error)
      actions.setCoinGeckoError(error.message)
      actions.setConnectionStatus('coingecko', 'error')
    }
  }, [state.selectedPeriod, actions])

  // Fetch Blockscout data
  const fetchBlockscoutData = useCallback(async () => {
    try {
      actions.setConnectionStatus('blockscout', 'loading')
      
      // Fetch all blockscout data in parallel
      const [statsData, addressesData, transactionsData, volumeData] = await Promise.all([
        fetchWithDeduplication('blockscout_stats', fetchBlockscoutStats),
        fetchWithDeduplication('blockscout_addresses', fetchBlockscoutChart, 'addresses'),
        fetchWithDeduplication('blockscout_transactions', fetchBlockscoutChart, 'transactions'),
        fetchWithDeduplication('blockscout_volume', fetchBlockscoutChart, 'daily_volume')
      ])
      
      // Update state
      actions.setBlockscoutStats(statsData)
      actions.setBlockscoutAddresses(addressesData.data)
      actions.setBlockscoutTransactions(transactionsData.data)
      actions.setBlockscoutVolume(volumeData.data)
      actions.setBlockscoutLastUpdated(statsData.lastUpdated)
      actions.setConnectionStatus('blockscout', 'success')
      actions.setGlobalLastUpdated(Date.now())
      
    } catch (error) {
      console.error('Blockscout sync failed:', error)
      actions.setBlockscoutError(error.message)
      actions.setConnectionStatus('blockscout', 'error')
    }
  }, [actions])

  // Fetch RPC data using hardened blockchain service
  const fetchRPCDataSync = useCallback(async () => {
    try {
      actions.setConnectionStatus('rpc', 'loading')
      
      // Use hardened blockchain service for RPC calls
      const rpcData = await fetchWithDeduplication('rpc_data', fetchRPCData)
      
      // Update state
      actions.setRPCData(rpcData)
      actions.setRPCLastUpdated(rpcData.lastUpdated)
      actions.setConnectionStatus('rpc', 'success')
      actions.setGlobalLastUpdated(Date.now())
      
    } catch (error) {
      console.error('RPC sync failed:', error)
      actions.setRPCError(error.message)
      actions.setConnectionStatus('rpc', 'error')
    }
  }, [actions])

  // Master sync function - coordinates all data fetching
  const syncAllData = useCallback(async () => {
    try {
      actions.setBlockscoutLoading(true)
      actions.setCoinGeckoLoading(true)
      actions.setRPCLoading(true)
      
      // Fetch all data sources in parallel for maximum efficiency
      await Promise.all([
        fetchCoinGeckoData(),
        fetchBlockscoutData(),
        fetchRPCDataSync()
      ])
      
    } finally {
      actions.setBlockscoutLoading(false)
      actions.setCoinGeckoLoading(false)
      actions.setRPCLoading(false)
    }
  }, [fetchCoinGeckoData, fetchBlockscoutData, fetchRPCDataSync, actions])

  // Initial data fetch
  useEffect(() => {
    if (!isInitialized.current && blockchain.isInitialized) {
      isInitialized.current = true
      syncAllData()
    }
  }, [syncAllData, blockchain.isInitialized])

  // Set up polling intervals
  useEffect(() => {
    if (!blockchain.isInitialized) return

    const intervals = []
    
    // CoinGecko: Poll every 60 seconds for current price, 5 minutes for history
    const coinGeckoCurrentInterval = setInterval(() => {
      fetchWithDeduplication('coingecko_current', fetchCoinGeckoCurrent)
        .then(data => {
          actions.setCoinGeckoCurrent(data)
          actions.setCoinGeckoLastUpdated(data.lastUpdated)
          actions.setGlobalLastUpdated(Date.now())
        })
        .catch(error => {
          console.error('CoinGecko current poll failed:', error)
          actions.setCoinGeckoError(error.message)
        })
    }, 60000)
    
    intervals.push(coinGeckoCurrentInterval)
    
    // Blockscout: Poll every 60 seconds
    const blockscoutInterval = setInterval(() => {
      fetchWithDeduplication('blockscout_stats', fetchBlockscoutStats)
        .then(data => {
          actions.setBlockscoutStats(data)
          actions.setBlockscoutLastUpdated(data.lastUpdated)
          actions.setGlobalLastUpdated(Date.now())
        })
        .catch(error => {
          console.error('Blockscout poll failed:', error)
          actions.setBlockscoutError(error.message)
        })
    }, 60000)
    
    intervals.push(blockscoutInterval)
    
    // RPC: Poll every 30 seconds using blockchain service status
    const rpcInterval = setInterval(() => {
      const blockchainStatus = getBlockchainStatus()
      
      // Only poll if blockchain service is healthy
      if (blockchainStatus.isConnected && blockchainStatus.circuitBreakerState === 'CLOSED') {
        fetchWithDeduplication('rpc_data', fetchRPCData)
          .then(data => {
            actions.setRPCData(data)
            actions.setRPCLastUpdated(data.lastUpdated)
            actions.setGlobalLastUpdated(Date.now())
          })
          .catch(error => {
            console.error('RPC poll failed:', error)
            actions.setRPCError(error.message)
          })
      }
    }, 30000)
    
    intervals.push(rpcInterval)
    
    return () => {
      intervals.forEach(clearInterval)
    }
  }, [blockchain.isInitialized, actions, fetchWithDeduplication])

  // Refetch when period changes
  useEffect(() => {
    if (isInitialized.current && blockchain.isInitialized) {
      fetchCoinGeckoData()
    }
  }, [state.selectedPeriod, fetchCoinGeckoData, blockchain.isInitialized])

  return {
    syncAllData,
    fetchCoinGeckoData,
    fetchBlockscoutData,
    fetchRPCDataSync,
    isAnyLoading: state.coingecko.loading || state.blockscout.loading || state.rpc.loading,
    lastGlobalUpdate: state.globalLastUpdated,
    blockchainStatus: blockchain.status
  }
}
