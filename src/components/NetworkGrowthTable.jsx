import { useState } from 'react'
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const NetworkGrowthTable = ({ data, selectedPeriod }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  const formatLargeNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num?.toLocaleString() || '0'
  }

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0.00'}`
  }

  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const generateMockData = () => {
    const days = selectedPeriod === '7D' ? 7 : selectedPeriod === '30D' ? 30 : 30
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        newAddresses: Math.floor(1000 + Math.random() * 500),
        totalAddresses: 180000 + (days - i) * 100 + Math.floor(Math.random() * 50),
        dailyTxs: Math.floor(45000 + Math.random() * 10000),
        volume: Math.floor(4000000 + Math.random() * 2000000),
        txChange: (Math.random() - 0.5) * 20,
        addressChange: (Math.random() - 0.5) * 10,
      })
    }
    
    return data
  }

  const tableData = generateMockData()

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...tableData].sort((a, b) => {
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    }

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
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
      <h3 className="text-[18px] font-bold text-white font-syne mb-4">
        Network Growth
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)]">
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider font-dm-mono">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider font-dm-mono">
                <button
                  onClick={() => handleSort('newAddresses')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>New Addresses</span>
                  {getSortIcon('newAddresses')}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider font-dm-mono">
                <button
                  onClick={() => handleSort('totalAddresses')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Total Addresses</span>
                  {getSortIcon('totalAddresses')}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider font-dm-mono">
                <button
                  onClick={() => handleSort('dailyTxs')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Daily Txs</span>
                  {getSortIcon('dailyTxs')}
                </button>
              </th>
              <th className="text-left py-3 px-4 font-medium text-[11px] text-[#7a8fad] uppercase tracking-wider font-dm-mono">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <span>Volume</span>
                  {getSortIcon('volume')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr 
                key={row.date}
                className={`border-t border-[rgba(255,255,255,0.06)] transition-colors ${
                  index % 2 === 0 ? 'bg-[#111827]' : 'bg-[#0f1520]'
                } hover:bg-[#1a1f2e]`}
              >
                <td className="py-3 px-4 font-mono text-white text-sm">
                  {row.date}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-white text-sm">{formatLargeNumber(row.newAddresses)}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(row.addressChange)}
                      <span className={`text-xs font-medium ${
                        row.addressChange > 0 ? 'text-green-500' : row.addressChange < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {row.addressChange > 0 && '+'}{row.addressChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-white text-sm">
                  {formatLargeNumber(row.totalAddresses)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-white text-sm">{formatLargeNumber(row.dailyTxs)}</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(row.txChange)}
                      <span className={`text-xs font-medium ${
                        row.txChange > 0 ? 'text-green-500' : row.txChange < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {row.txChange > 0 && '+'}{row.txChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-white text-sm">
                  {formatNumber(row.volume)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NetworkGrowthTable
