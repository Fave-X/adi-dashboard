import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  // CoinGecko data
  coingecko: {
    current: null,
    history: {},
    loading: false,
    error: null,
    lastUpdated: null
  },
  
  // Blockscout data  
  blockscout: {
    stats: null,
    addresses: [],
    transactions: [],
    volume: [],
    loading: false,
    error: null,
    lastUpdated: null
  },
  
  // RPC data
  rpc: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  },
  
  // Global state
  selectedPeriod: '30D',
  globalLastUpdated: null,
  
  // Connection status
  connectionStatus: {
    coingecko: 'idle', // idle, loading, success, error
    blockscout: 'idle',
    rpc: 'idle'
  }
}

// Action types
const ACTIONS = {
  // CoinGecko actions
  SET_COINGECKO_LOADING: 'SET_COINGECKO_LOADING',
  SET_COINGECKO_CURRENT: 'SET_COINGECKO_CURRENT',
  SET_COINGECKO_HISTORY: 'SET_COINGECKO_HISTORY',
  SET_COINGECKO_ERROR: 'SET_COINGECKO_ERROR',
  SET_COINGECKO_LAST_UPDATED: 'SET_COINGECKO_LAST_UPDATED',
  
  // Blockscout actions
  SET_BLOCKSCOUT_LOADING: 'SET_BLOCKSCOUT_LOADING',
  SET_BLOCKSCOUT_STATS: 'SET_BLOCKSCOUT_STATS',
  SET_BLOCKSCOUT_ADDRESSES: 'SET_BLOCKSCOUT_ADDRESSES',
  SET_BLOCKSCOUT_TRANSACTIONS: 'SET_BLOCKSCOUT_TRANSACTIONS',
  SET_BLOCKSCOUT_VOLUME: 'SET_BLOCKSCOUT_VOLUME',
  SET_BLOCKSCOUT_ERROR: 'SET_BLOCKSCOUT_ERROR',
  SET_BLOCKSCOUT_LAST_UPDATED: 'SET_BLOCKSCOUT_LAST_UPDATED',
  
  // RPC actions
  SET_RPC_LOADING: 'SET_RPC_LOADING',
  SET_RPC_DATA: 'SET_RPC_DATA',
  SET_RPC_ERROR: 'SET_RPC_ERROR',
  SET_RPC_LAST_UPDATED: 'SET_RPC_LAST_UPDATED',
  
  // Global actions
  SET_SELECTED_PERIOD: 'SET_SELECTED_PERIOD',
  SET_GLOBAL_LAST_UPDATED: 'SET_GLOBAL_LAST_UPDATED',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS'
}

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_COINGECKO_LOADING:
      return {
        ...state,
        coingecko: {
          ...state.coingecko,
          loading: action.payload
        }
      }
    
    case ACTIONS.SET_COINGECKO_CURRENT:
      return {
        ...state,
        coingecko: {
          ...state.coingecko,
          current: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_COINGECKO_HISTORY:
      return {
        ...state,
        coingecko: {
          ...state.coingecko,
          history: {
            ...state.coingecko.history,
            [action.payload.period]: action.payload.data
          },
          error: null
        }
      }
    
    case ACTIONS.SET_COINGECKO_ERROR:
      return {
        ...state,
        coingecko: {
          ...state.coingecko,
          error: action.payload,
          loading: false
        }
      }
    
    case ACTIONS.SET_COINGECKO_LAST_UPDATED:
      return {
        ...state,
        coingecko: {
          ...state.coingecko,
          lastUpdated: action.payload
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_LOADING:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          loading: action.payload
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_STATS:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          stats: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_ADDRESSES:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          addresses: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_TRANSACTIONS:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          transactions: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_VOLUME:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          volume: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_ERROR:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          error: action.payload,
          loading: false
        }
      }
    
    case ACTIONS.SET_BLOCKSCOUT_LAST_UPDATED:
      return {
        ...state,
        blockscout: {
          ...state.blockscout,
          lastUpdated: action.payload
        }
      }
    
    case ACTIONS.SET_RPC_LOADING:
      return {
        ...state,
        rpc: {
          ...state.rpc,
          loading: action.payload
        }
      }
    
    case ACTIONS.SET_RPC_DATA:
      return {
        ...state,
        rpc: {
          ...state.rpc,
          data: action.payload,
          error: null
        }
      }
    
    case ACTIONS.SET_RPC_ERROR:
      return {
        ...state,
        rpc: {
          ...state.rpc,
          error: action.payload,
          loading: false
        }
      }
    
    case ACTIONS.SET_RPC_LAST_UPDATED:
      return {
        ...state,
        rpc: {
          ...state.rpc,
          lastUpdated: action.payload
        }
      }
    
    case ACTIONS.SET_SELECTED_PERIOD:
      return {
        ...state,
        selectedPeriod: action.payload
      }
    
    case ACTIONS.SET_GLOBAL_LAST_UPDATED:
      return {
        ...state,
        globalLastUpdated: action.payload
      }
    
    case ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        connectionStatus: {
          ...state.connectionStatus,
          [action.payload.source]: action.payload.status
        }
      }
    
    default:
      return state
  }
}

// Create context
const DataContext = createContext()

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  // Action creators
  const actions = {
    // CoinGecko actions
    setCoinGeckoLoading: (loading) => dispatch({ type: ACTIONS.SET_COINGECKO_LOADING, payload: loading }),
    setCoinGeckoCurrent: (data) => dispatch({ type: ACTIONS.SET_COINGECKO_CURRENT, payload: data }),
    setCoinGeckoHistory: (period, data) => dispatch({ type: ACTIONS.SET_COINGECKO_HISTORY, payload: { period, data } }),
    setCoinGeckoError: (error) => dispatch({ type: ACTIONS.SET_COINGECKO_ERROR, payload: error }),
    setCoinGeckoLastUpdated: (timestamp) => dispatch({ type: ACTIONS.SET_COINGECKO_LAST_UPDATED, payload: timestamp }),
    
    // Blockscout actions
    setBlockscoutLoading: (loading) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_LOADING, payload: loading }),
    setBlockscoutStats: (data) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_STATS, payload: data }),
    setBlockscoutAddresses: (data) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_ADDRESSES, payload: data }),
    setBlockscoutTransactions: (data) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_TRANSACTIONS, payload: data }),
    setBlockscoutVolume: (data) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_VOLUME, payload: data }),
    setBlockscoutError: (error) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_ERROR, payload: error }),
    setBlockscoutLastUpdated: (timestamp) => dispatch({ type: ACTIONS.SET_BLOCKSCOUT_LAST_UPDATED, payload: timestamp }),
    
    // RPC actions
    setRPCLoading: (loading) => dispatch({ type: ACTIONS.SET_RPC_LOADING, payload: loading }),
    setRPCData: (data) => dispatch({ type: ACTIONS.SET_RPC_DATA, payload: data }),
    setRPCError: (error) => dispatch({ type: ACTIONS.SET_RPC_ERROR, payload: error }),
    setRPCLastUpdated: (timestamp) => dispatch({ type: ACTIONS.SET_RPC_LAST_UPDATED, payload: timestamp }),
    
    // Global actions
    setSelectedPeriod: (period) => dispatch({ type: ACTIONS.SET_SELECTED_PERIOD, payload: period }),
    setGlobalLastUpdated: (timestamp) => dispatch({ type: ACTIONS.SET_GLOBAL_LAST_UPDATED, payload: timestamp }),
    setConnectionStatus: (source, status) => dispatch({ type: ACTIONS.SET_CONNECTION_STATUS, payload: { source, status } })
  }

  return (
    <DataContext.Provider value={{ state, actions }}>
      {children}
    </DataContext.Provider>
  )
}

// Hook to use the context
export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export default DataContext
