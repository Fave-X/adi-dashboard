import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const ByMetricTab = ({ data, selectedPeriod }) => {
  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0.00'}`
  }

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

  const getSignal = (value) => {
    if (value > 15) return { label: 'GROWING', color: '#4ade80' }
    if (value > 5) return { label: 'STABLE', color: '#6b7280' }
    if (value > -5) return { label: 'COOLING', color: '#f97316' }
    return { label: 'DECLINING', color: '#f87171' }
  }

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const Sparkline = ({ data, color }) => {
    const width = 80
    const height = 30
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * height
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      </svg>
    )
  }

  const metrics = [
    {
      name: 'ADI Price',
      value: formatNumber(data?.coinGecko?.price),
      change: data?.coinGecko?.priceChange24h,
      sparklineData: [0.85, 0.87, 0.86, 0.89, 0.88, 0.91, 0.89],
      color: '#e8b84b',
    },
    {
      name: 'Market Cap',
      value: formatNumber(data?.coinGecko?.marketCap),
      change: data?.coinGecko?.priceChange24h,
      sparklineData: [100, 102, 98, 105, 103, 108, 106],
      color: '#e8b84b',
    },
    {
      name: '24H Volume',
      value: formatNumber(data?.coinGecko?.volume24h),
      change: 8.5,
      sparklineData: [5000, 5200, 4800, 5500, 5300, 5800, 5600],
      color: '#e8b84b',
    },
    {
      name: 'Total Transactions',
      value: formatLargeNumber(data?.explorer?.totalTransactions),
      change: 12.3,
      sparklineData: [4500, 4600, 4400, 4800, 4700, 5000, 4900],
      color: '#2dd4bf',
    },
    {
      name: 'Unique Addresses',
      value: formatLargeNumber(data?.explorer?.uniqueAddresses),
      change: 15.7,
      sparklineData: [180, 185, 182, 190, 188, 195, 192],
      color: '#2dd4bf',
    },
    {
      name: 'Daily Active Addresses',
      value: formatLargeNumber(25000),
      change: 8.2,
      sparklineData: [200, 210, 195, 220, 215, 235, 225],
      color: '#2dd4bf',
    },
    {
      name: 'Gas Price',
      value: '15.2 Gwei',
      change: -8.5,
      sparklineData: [20, 19, 18, 16, 17, 15, 14],
      color: '#8b5cf6',
    },
    {
      name: 'Network Utilization',
      value: '67.3%',
      change: 5.8,
      sparklineData: [60, 62, 58, 65, 63, 68, 67],
      color: '#8b5cf6',
    },
    {
      name: 'Transaction Success Rate',
      value: '99.8%',
      change: 0.2,
      sparklineData: [99.5, 99.6, 99.4, 99.7, 99.6, 99.8, 99.7],
      color: '#4ade80',
    },
    {
      name: 'Volume/Market Cap Ratio',
      value: '0.042',
      change: -2.3,
      sparklineData: [0.045, 0.043, 0.041, 0.042, 0.044, 0.043, 0.042],
      color: '#e8b84b',
    },
    {
      name: '% Below All-Time High',
      value: '23.5%',
      change: -5.2,
      sparklineData: [25, 24, 26, 25, 24, 23, 23.5],
      color: '#e8b84b',
    },
    {
      name: 'Daily Transactions',
      value: formatLargeNumber(data?.explorer?.totalTransactions ? data.explorer.totalTransactions / 104 : 48000),
      change: 3.2,
      sparklineData: [45000, 46000, 47000, 48000, 47500, 48500, 49000],
      color: '#2dd4bf',
    },
    {
      name: 'Transaction Momentum',
      value: '+12.3%',
      change: 12.3,
      sparklineData: [8, 9, 10, 11, 12, 11, 12],
      color: '#2dd4bf',
    },
    {
      name: 'New Addresses Per Day',
      value: '1,234',
      change: 5.7,
      sparklineData: [1100, 1150, 1200, 1180, 1220, 1250, 1234],
      color: '#2dd4bf',
    },
    {
      name: 'Active Addresses 24h',
      value: '8,456',
      change: 2.1,
      sparklineData: [8000, 8100, 8200, 8300, 8400, 8350, 8456],
      color: '#2dd4bf',
    },
    {
      name: 'Average Block Time',
      value: '1.2s',
      change: -3.1,
      sparklineData: [1.3, 1.25, 1.2, 1.15, 1.2, 1.18, 1.2],
      color: '#8b5cf6',
    },
    {
      name: 'Latest Block Number',
      value: formatLargeNumber(data?.calculated?.latestBlockNumber || 12345678),
      change: null,
      sparklineData: [12345000, 12345200, 12345400, 12345600, 12345500, 12345700, 12345678],
      color: '#8b5cf6',
    },
    {
      name: 'Velocity Ratio',
      value: '1.26',
      change: 4.2,
      sparklineData: [1.2, 1.22, 1.24, 1.23, 1.25, 1.24, 1.26],
      color: '#4ade80',
    },
    {
      name: 'Network Growth Rate',
      value: '+2.3%',
      change: 2.3,
      sparklineData: [2.0, 2.1, 2.2, 2.1, 2.3, 2.2, 2.3],
      color: '#4ade80',
    },
  ]

  return (
    <div className="min-h-screen bg-[#080c14]">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {metrics.map((metric, index) => {
            const signal = getSignal(metric.change)
            return (
              <div
                key={metric.name}
                className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-lg p-5 hover:border-[rgba(232,184,75,0.3)] transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="text-[14px] font-bold text-white mb-3 font-inter">
                    {metric.name}
                  </div>
                  <div className="text-[22px] font-bold font-dm-mono text-white mb-3">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[13px] font-medium font-dm-mono ${
                      metric.change > 0 ? 'text-green-500' : metric.change < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {formatPercent(metric.change)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <Sparkline data={metric.sparklineData} color={metric.color} />
                  </div>
                  <div className="mt-auto">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded ${signal.color} text-white`}>
                      {signal.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ByMetricTab
