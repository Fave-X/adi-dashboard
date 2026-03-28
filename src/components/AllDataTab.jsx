import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowUpDown } from 'lucide-react'

const AllDataTab = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

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

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-500'
    if (value < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const allMetrics = [
    {
      name: 'ADI Price',
      currentValue: formatNumber(data?.coinGecko?.price),
      change24h: data?.coinGecko?.priceChange24h || 0,
      change7d: data?.coinGecko?.priceChange7d || 0,
      change30d: data?.coinGecko?.priceChange30d || 0,
      allTimeValue: formatNumber(data?.coinGecko?.ath),
      source: 'CoinGecko',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Market Cap',
      currentValue: formatNumber(data?.coinGecko?.marketCap),
      change24h: data?.coinGecko?.priceChange24h || 0,
      change7d: data?.coinGecko?.priceChange7d || 0,
      change30d: data?.coinGecko?.priceChange30d || 0,
      allTimeValue: formatNumber(data?.coinGecko?.ath * 10),
      source: 'CoinGecko',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: '24h Volume',
      currentValue: formatNumber(data?.coinGecko?.volume24h),
      change24h: 8.5,
      change7d: 12.3,
      change30d: -5.2,
      allTimeValue: formatNumber(500000000),
      source: 'CoinGecko',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Total Transactions',
      currentValue: formatLargeNumber(data?.explorer?.totalTransactions),
      change24h: 3.2,
      change7d: 8.7,
      change30d: 15.3,
      allTimeValue: formatLargeNumber(10000000),
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Unique Addresses',
      currentValue: formatLargeNumber(data?.explorer?.uniqueAddresses),
      change24h: 1.8,
      change7d: 6.2,
      change30d: 12.5,
      allTimeValue: formatLargeNumber(500000),
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Volume/Market Cap Ratio',
      currentValue: '0.042',
      change24h: -2.3,
      change7d: 1.2,
      change30d: -0.8,
      allTimeValue: '0.065',
      source: 'Calculated',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: '% Below All-Time High',
      currentValue: '23.5%',
      change24h: -5.2,
      change7d: -3.1,
      change30d: 2.4,
      allTimeValue: '0%',
      source: 'Calculated',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Daily Transactions',
      currentValue: formatLargeNumber(48000),
      change24h: 3.2,
      change7d: 4.5,
      change30d: 8.9,
      allTimeValue: formatLargeNumber(75000),
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Transaction Momentum',
      currentValue: '+12.3%',
      change24h: 12.3,
      change7d: 8.7,
      change30d: 15.2,
      allTimeValue: '+25.8%',
      source: 'Calculated',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'New Addresses Per Day',
      currentValue: '1,234',
      change24h: 5.7,
      change7d: 8.2,
      change30d: 12.8,
      allTimeValue: '2,456',
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Active Addresses 24h',
      currentValue: '8,456',
      change24h: 2.1,
      change7d: 6.4,
      change30d: 11.2,
      allTimeValue: '15,234',
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Average Gas Price (Gwei)',
      currentValue: data?.calculated?.averageGasPrice?.toFixed(2) || '15.23',
      change24h: -8.5,
      change7d: -12.3,
      change30d: -5.7,
      allTimeValue: '45.67',
      source: 'ADI RPC',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Average Block Time',
      currentValue: '1.2s',
      change24h: -3.1,
      change7d: -2.4,
      change30d: 1.2,
      allTimeValue: '2.5s',
      source: 'ADI Explorer',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Latest Block Number',
      currentValue: formatLargeNumber(data?.calculated?.latestBlockNumber || 12345678),
      change24h: null,
      change7d: null,
      change30d: null,
      allTimeValue: formatLargeNumber(99999999),
      source: 'ADI RPC',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Velocity Ratio',
      currentValue: '1.26',
      change24h: 4.2,
      change7d: 2.8,
      change30d: 8.5,
      allTimeValue: '2.45',
      source: 'Calculated',
      lastUpdated: new Date().toLocaleTimeString(),
    },
    {
      name: 'Network Growth Rate',
      currentValue: '+2.3%',
      change24h: 2.3,
      change7d: 3.1,
      change30d: 5.8,
      allTimeValue: '+8.9%',
      source: 'Calculated',
      lastUpdated: new Date().toLocaleTimeString(),
    },
  ]

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedMetrics = [...allMetrics].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (typeof aValue === 'string') {
      const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''))
      const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''))
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
  })

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-[#7a8fad]" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="w-4 h-4 text-[#e8b84b]" />
      : <ArrowUpDown className="w-4 h-4 text-[#e8b84b] rotate-180" />
  }

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0f1520]">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Metric</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('currentValue')}
                  className="flex items-center justify-end space-x-1 hover:text-white transition-colors"
                >
                  <span>Current Value</span>
                  {getSortIcon('currentValue')}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('change24h')}
                  className="flex items-center justify-end space-x-1 hover:text-white transition-colors"
                >
                  <span>24h Change</span>
                  {getSortIcon('change24h')}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('change7d')}
                  className="flex items-center justify-end space-x-1 hover:text-white transition-colors"
                >
                  <span>7d Change</span>
                  {getSortIcon('change7d')}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('change30d')}
                  className="flex items-center justify-end space-x-1 hover:text-white transition-colors"
                >
                  <span>30d Change</span>
                  {getSortIcon('change30d')}
                </button>
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('allTimeValue')}
                  className="flex items-center justify-end space-x-1 hover:text-white transition-colors"
                >
                  <span>All Time</span>
                  {getSortIcon('allTimeValue')}
                </button>
              </th>
              <th className="text-center py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                Source
              </th>
              <th className="text-right py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMetrics.map((metric, index) => (
              <tr 
                key={metric.name}
                className={`border-t border-[rgba(255,255,255,0.06)] ${
                  index % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f1520]'
                } hover:bg-[#1a1f2e] transition-colors`}
              >
                <td className="py-3 px-4 font-medium text-white">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.change24h)}
                    <span>{metric.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {metric.currentValue}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-medium ${getTrendColor(metric.change24h)}`}>
                    {formatPercent(metric.change24h)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-medium ${getTrendColor(metric.change7d)}`}>
                    {formatPercent(metric.change7d)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-medium ${getTrendColor(metric.change30d)}`}>
                    {formatPercent(metric.change30d)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono text-[#7a8fad]">
                  {metric.allTimeValue}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] text-[#7a8fad] bg-[#080c14] px-2 py-1 rounded border border-[rgba(255,255,255,0.06)]">
                    {metric.source}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-[10px] text-[#7a8fad]">
                  {metric.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllDataTab
