import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { formatCount, formatCurrency } from '../services/unifiedApiService'

const KeyMetricsBar = () => {
  const { state } = useData()
  const [loading, setLoading] = useState(false)

  // Get latest address count from unified state
  const latestAddressCount = state.blockscout.addresses.length > 0
    ? state.blockscout.addresses[state.blockscout.addresses.length - 1].value
    : 0

  // Format functions
  const formatLargeNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num?.toLocaleString() || '0'
  }

  const formatPercent = (num) => {
    if (num === undefined || num === null) return '0.0%'
    const numValue = Number(num)
    if (isNaN(numValue)) return '0.0%'
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`
  }

  const metrics = [
    {
      label: 'ADI Price',
      value: loading || state.coingecko.loading ? '—' : formatCurrency(state.coingecko.current?.price),
      change: state.coingecko.current ? null : state.coingecko.history[state.selectedPeriod]?.prices?.[1]?.[1] - state.coingecko.history[state.selectedPeriod]?.prices?.[0]?.[1],
      isPrice: true,
    },
    {
      label: 'Market Cap',
      value: loading || state.coingecko.loading ? '—' : formatCurrency(state.coingecko.current?.marketCap),
      change: state.coingecko.current ? null : 0, // Would need historical data for this
    },
    {
      label: '24H Volume',
      value: loading || state.blockscout.loading ? '—' : formatCurrency(state.blockscout.volume.length > 0 ? state.blockscout.volume[state.blockscout.volume.length - 1].value : 0),
      change: 8.5, // Mock data - would need historical comparison
    },
    {
      label: 'Total Txs',
      value: loading || state.blockscout.loading ? '—' : formatLargeNumber(state.blockscout.stats?.totalTransactions),
      change: 12.3, // Mock data - would need historical comparison
    },
    {
      label: 'Unique Addresses',
      value: formatCount(latestAddressCount),
      change: 15.7, // Mock data - would need historical comparison
    },
    {
      label: 'Days Live',
      value: 104, // Static value - could calculate from genesis block
      change: null,
    },
  ]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 24px' }}>
      {/* Section Label */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
          KEY METRICS
        </h2>
      </div>

      {/* Horizontal Metrics Bar */}
      <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', overflowX: 'auto' }}>
          {metrics.map((metric, index) => (
            <div key={metric.label} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Divider */}
              {index > 0 && (
                <div style={{ width: '1px', height: '48px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
              )}
              
              {/* Metric Card */}
              <div style={{ 
                minWidth: '140px', 
                backgroundColor: '#111827', 
                border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '8px', 
                padding: '14px 18px' 
              }}>
                <div style={{ fontSize: '11px', color: '#7a8fad', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'DM Mono, monospace' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'DM Mono, monospace', color: '#eef2ff', marginBottom: '8px' }}>
                  <span style={{ color: metric.isPrice ? '#e8b84b' : 'inherit' }}>
                    {metric.value}
                  </span>
                </div>
                {metric.change !== null && (
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    fontFamily: 'DM Mono, monospace',
                    color: metric.change > 0 ? '#4ade80' : metric.change < 0 ? '#f87171' : '#7a8fad'
                  }}>
                    {formatPercent(metric.change)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KeyMetricsBar
