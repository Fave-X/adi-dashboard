import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

const Header = ({ data, lastUpdated }) => {
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setUtcTime(now.toUTCString().split(' ').slice(4, 5).join(' '))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0.00'}`
  }

  const formatPercent = (num) => {
    if (num === undefined || num === null) return '0.0%'
    const numValue = Number(num)
    if (isNaN(numValue)) return '0.0%'
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(1)}%`
  }

  const getTopGainingMetric = () => {
    if (!data?.coinGecko) return { name: 'Loading', value: '0.0%' }
    
    const metrics = [
      { name: 'Price', value: data.coinGecko.priceChange30d },
      { name: 'Volume', value: data.coinGecko.priceChange30d * 1.2 }, // Mock calculation
      { name: 'Transactions', value: 15.3 }, // Mock data
    ]
    
    return metrics.reduce((max, current) => 
      (current.value > max.value) ? current : max
    )
  }

  const getTopDecliningMetric = () => {
    if (!data?.coinGecko) return { name: 'Loading', value: '0.0%' }
    
    const metrics = [
      { name: 'Gas Price', value: -5.2 }, // Mock data
      { name: 'Block Time', value: -2.1 }, // Mock data
      { name: 'Active Addresses', value: -8.7 }, // Mock data
    ]
    
    return metrics.reduce((min, current) => 
      (current.value < min.value) ? current : min
    )
  }

  const topGaining = getTopGainingMetric()
  const topDeclining = getTopDecliningMetric()

  return (
    <header className="sticky top-0 z-50 bg-[#080c14] border-b border-[rgba(255,255,255,0.06)] backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#e8b84b] rounded-xl flex items-center justify-center shadow-lg shadow-[#e8b84b]/25">
                <span className="text-[#080c14] font-bold font-heading text-xl">ADI</span>
              </div>
              <div className="h-8 w-px bg-[rgba(255,255,255,0.06)]"></div>
              <h1 className="text-2xl font-heading font-bold text-white tracking-tight">
                Chain Analytics
              </h1>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Market Cap</div>
              <div className="text-[20px] font-mono font-bold text-white">
                {formatNumber(data?.coinGecko?.marketCap)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">30d Volume</div>
              <div className="text-[20px] font-mono font-bold text-white">
                {formatNumber(data?.coinGecko?.volume24h * 30)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Top Gainer</div>
              <div className="text-[20px] font-mono font-bold text-white">
                {topGaining.name} {formatPercent(topGaining.value)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Top Decliner</div>
              <div className="text-[20px] font-mono font-bold text-white">
                {topDeclining.name} {formatPercent(topDeclining.value)}
              </div>
            </div>
          </div>

          {/* Live Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-green-500 font-bold text-sm uppercase tracking-wider">Live</span>
            </div>
            
            <div className="text-[13px] font-mono text-[#7a8fad] font-medium">
              {utcTime} UTC
            </div>
          </div>
        </div>

        {/* Mobile Metrics */}
        <div className="lg:hidden grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Market Cap</div>
            <div className="text-[24px] font-mono font-bold text-white">
              {formatNumber(data?.coinGecko?.marketCap)}
            </div>
          </div>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">30d Volume</div>
            <div className="text-[24px] font-mono font-bold text-white">
              {formatNumber(data?.coinGecko?.volume24h * 30)}
            </div>
          </div>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Top Gainer</div>
            <div className="text-[24px] font-mono font-bold text-white">
              {topGaining.name} {formatPercent(topGaining.value)}
            </div>
          </div>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-1">Top Decliner</div>
            <div className="text-[24px] font-mono font-bold text-white">
              {topDeclining.name} {formatPercent(topDeclining.value)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
