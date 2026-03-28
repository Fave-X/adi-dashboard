import { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle, AlertCircle, WifiOff } from 'lucide-react'
import { useData } from '../contexts/DataContext'

const LastUpdated = () => {
  const { state } = useData()
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Animate when data updates
  useEffect(() => {
    if (state.globalLastUpdated) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [state.globalLastUpdated])

  // Get connection status for all services
  const getConnectionStatus = () => {
    const statuses = [
      { service: 'coingecko', status: state.connectionStatus.coingecko },
      { service: 'blockscout', status: state.connectionStatus.blockscout },
      { service: 'rpc', status: state.connectionStatus.rpc }
    ]
    
    if (statuses.every(s => s.status === 'success')) {
      return { status: 'healthy', color: '#4ade80', icon: CheckCircle }
    } else if (statuses.some(s => s.status === 'error')) {
      return { status: 'error', color: '#f87171', icon: AlertCircle }
    } else if (statuses.some(s => s.status === 'loading')) {
      return { status: 'loading', color: '#e8b84b', icon: RefreshCw }
    } else {
      return { status: 'degraded', color: '#f59e0b', icon: WifiOff }
    }
  }

  const connectionStatus = getConnectionStatus()
  const StatusIcon = connectionStatus.icon

  if (!state.globalLastUpdated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: '#7a8fad',
        fontFamily: 'Inter, sans-serif'
      }}>
        <StatusIcon 
          size={14} 
          style={{ 
            color: connectionStatus.color,
            opacity: 0.6
          }} 
        />
        <span>Initializing data...</span>
      </div>
    )
  }

  const formatLastUpdated = () => {
    const now = new Date()
    const updated = new Date(state.globalLastUpdated)
    const diffMs = now - updated
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)

    if (diffSeconds < 60) {
      return `Updated ${diffSeconds}s ago`
    } else if (diffMinutes < 60) {
      return `Updated ${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `Updated ${diffHours}h ago`
    } else {
      return updated.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'inline-block'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: connectionStatus.status === 'healthy' ? '#6b7280' : connectionStatus.color,
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
        transition: 'color 0.3s ease'
      }}>
        <StatusIcon 
          size={14} 
          style={{ 
            color: connectionStatus.color,
            animation: isAnimating ? 'spin 1s linear infinite' : 'none',
            display: 'inline-block'
          }} 
        />
        <span style={{
          fontWeight: isAnimating ? '600' : '400',
          transition: 'font-weight 0.3s ease'
        }}>
          {formatLastUpdated()}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          marginTop: '8px',
          backgroundColor: '#111827',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          padding: '12px',
          minWidth: '200px',
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#eef2ff' 
          }}>
            Data Sources Status
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: state.connectionStatus.coingecko === 'success' ? '#4ade80' : 
                                 state.connectionStatus.coingecko === 'error' ? '#f87171' : 
                                 state.connectionStatus.coingecko === 'loading' ? '#e8b84b' : '#7a8fad'
              }} />
              <span style={{ color: '#eef2ff' }}>CoinGecko API</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: state.connectionStatus.blockscout === 'success' ? '#4ade80' : 
                                 state.connectionStatus.blockscout === 'error' ? '#f87171' : 
                                 state.connectionStatus.blockscout === 'loading' ? '#e8b84b' : '#7a8fad'
              }} />
              <span style={{ color: '#eef2ff' }}>Blockscout API</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: state.connectionStatus.rpc === 'success' ? '#4ade80' : 
                                 state.connectionStatus.rpc === 'error' ? '#f87171' : 
                                 state.connectionStatus.rpc === 'loading' ? '#e8b84b' : '#7a8fad'
              }} />
              <span style={{ color: '#eef2ff' }}>ADI RPC</span>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '8px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '10px',
            color: '#7a8fad'
          }}>
            Last updated: {new Date(state.globalLastUpdated).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}

export default LastUpdated
