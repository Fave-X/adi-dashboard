import { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useBlockchain } from '../hooks/useBlockchain'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react'

const LiveStatusBar = () => {
  const { state } = useData()
  const { status: blockchainStatus } = useBlockchain()
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Get status for each data source
  const getStatusInfo = (service, status) => {
    const statusMap = {
      'success': { color: '#10b981', icon: CheckCircle, label: 'Healthy' },
      'loading': { color: '#f59e0b', icon: Loader2, label: 'Loading' },
      'error': { color: '#ef4444', icon: XCircle, label: 'Error' },
      'degraded': { color: '#f97316', icon: AlertTriangle, label: 'Degraded' }
    }
    return statusMap[status] || statusMap['error']
  }

  // Calculate overall health
  const getOverallHealth = () => {
    const statuses = [
      state.connectionStatus.coingecko,
      state.connectionStatus.blockscout,
      state.connectionStatus.rpc
    ]
    
    if (statuses.every(s => s === 'success')) {
      return { color: '#10b981', label: 'All Systems Healthy' }
    } else if (statuses.some(s => s === 'error')) {
      return { color: '#ef4444', label: 'System Issues Detected' }
    } else if (statuses.some(s => s === 'loading')) {
      return { color: '#f59e0b', label: 'Systems Loading' }
    } else {
      return { color: '#f97316', label: 'Systems Degraded' }
    }
  }

  const services = [
    {
      name: 'CoinGecko API',
      status: state.connectionStatus.coingecko,
      icon: Activity,
      lastUpdated: state.coingecko.lastUpdated,
      endpoint: 'api.coingecko.com'
    },
    {
      name: 'Blockscout API',
      status: state.connectionStatus.blockscout,
      icon: Wifi,
      lastUpdated: state.blockscout.lastUpdated,
      endpoint: 'explorer-bls.adifoundation.ai'
    },
    {
      name: 'ADI RPC',
      status: blockchainStatus === 'connected' ? 'success' : 
              blockchainStatus === 'error' ? 'error' : 'loading',
      icon: blockchainStatus === 'connected' ? Wifi : WifiOff,
      lastUpdated: state.rpc.lastUpdated,
      endpoint: 'rpc.adifoundation.ai'
    }
  ]

  const overallHealth = getOverallHealth()
  const StatusIcon = overallHealth.icon || CheckCircle

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: '#111827',
      border: `1px solid ${overallHealth.color}`,
      borderRadius: '8px',
      padding: '12px',
      minWidth: '280px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '11px',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '12px' : '0',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusIcon size={16} style={{ color: overallHealth.color }} />
          <span style={{ color: '#eef2ff', fontWeight: '600' }}>
            {overallHealth.label}
          </span>
        </div>
        <div style={{ 
          color: '#7a8fad', 
          fontSize: '10px',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '12px' 
        }}>
          {services.map((service, index) => {
            const statusInfo = getStatusInfo(service.name, service.status)
            const ServiceIcon = service.icon
            const timeAgo = service.lastUpdated 
              ? `${Math.floor((Date.now() - service.lastUpdated) / 1000)}s ago`
              : 'Never'

            return (
              <div 
                key={service.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: index < services.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ServiceIcon size={12} style={{ color: statusInfo.color }} />
                  <div>
                    <div style={{ color: '#eef2ff', fontWeight: '500', fontSize: '10px' }}>
                      {service.name}
                    </div>
                    <div style={{ color: '#7a8fad', fontSize: '9px' }}>
                      {service.endpoint}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: statusInfo.color,
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {statusInfo.label}
                  </div>
                  <div style={{ color: '#7a8fad', fontSize: '9px' }}>
                    {timeAgo}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Last Update */}
          <div style={{
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            color: '#7a8fad',
            fontSize: '9px',
            textAlign: 'center'
          }}>
            Status updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveStatusBar
