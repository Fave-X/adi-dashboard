import { useState, useEffect } from 'react'
import { useBlockchain } from '../hooks/useBlockchain'

const BlockchainStatus = () => {
  const { status, error } = useBlockchain()
  const [isVisible, setIsVisible] = useState(false)

  // Auto-hide after 5 seconds if no errors
  useEffect(() => {
    if (status === 'connected' && !error) {
      const timer = setTimeout(() => setIsVisible(false), 5000)
      return () => clearTimeout(timer)
    } else if (error || status === 'error') {
      setIsVisible(true)
    }
  }, [status, error])

  // Show on initial load or errors
  useEffect(() => {
    if (status && status !== 'connected') {
      setIsVisible(true)
    }
  }, [status])

  if (!isVisible) return null

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#4ade80'
      case 'connecting': return '#e8b84b'
      case 'error': return '#f87171'
      case 'degraded': return '#f59e0b'
      default: return '#7a8fad'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Blockchain Connected'
      case 'connecting': return 'Connecting to Blockchain...'
      case 'error': return 'Blockchain Connection Error'
      case 'degraded': return 'Blockchain Connection Unstable'
      default: return 'Blockchain Status Unknown'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '●'
      case 'connecting': return '○'
      case 'error': return '●'
      case 'degraded': return '●'
      default: return '○'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: '#111827',
      border: `1px solid ${getStatusColor()}`,
      borderRadius: '8px',
      padding: '12px 16px',
      minWidth: '200px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: error ? '8px' : '0'
      }}>
        <span style={{
          color: getStatusColor(),
          fontSize: '16px',
          lineHeight: '1'
        }}>
          {getStatusIcon()}
        </span>
        <span style={{
          color: '#eef2ff',
          fontWeight: '500'
        }}>
          {getStatusText()}
        </span>
      </div>
      
      {error && (
        <div style={{
          color: '#f87171',
          fontSize: '11px',
          lineHeight: '1.3',
          marginTop: '4px',
          padding: '8px',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(248, 113, 113, 0.2)'
        }}>
          Error: {error}
        </div>
      )}
      
      {status === 'degraded' && (
        <div style={{
          color: '#f59e0b',
          fontSize: '11px',
          lineHeight: '1.3',
          marginTop: '4px',
          padding: '8px',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          Connection unstable - using fallback RPC
        </div>
      )}
    </div>
  )
}

export default BlockchainStatus
