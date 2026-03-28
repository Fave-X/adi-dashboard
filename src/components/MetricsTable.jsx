import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MetricsTable = ({ data }) => {
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
    if (value > 0) return <TrendingUp className="w-4 h-4 text-growth" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-decline" />
    return <Minus className="w-4 h-4 text-muted-text" />
  }

  const getTrendColor = (value) => {
    if (value > 0) return 'text-growth'
    if (value < 0) return 'text-decline'
    return 'text-muted-text'
  }

  const metrics = [
    {
      name: 'ADI Price',
      current: formatNumber(data?.coinGecko?.price),
      change24h: data?.coinGecko?.priceChange24h || 0,
      change7d: data?.coinGecko?.priceChange7d || 0,
      change30d: data?.coinGecko?.priceChange30d || 0,
      change180d: data?.coinGecko?.priceChange180d || 0,
      ath: formatNumber(data?.coinGecko?.ath),
      source: 'CoinGecko',
    },
    {
      name: 'Market Cap',
      current: formatNumber(data?.coinGecko?.marketCap),
      change24h: data?.coinGecko?.priceChange24h || 0,
      change7d: data?.coinGecko?.priceChange7d || 0,
      change30d: data?.coinGecko?.priceChange30d || 0,
      change180d: data?.coinGecko?.priceChange180d || 0,
      ath: formatNumber(data?.coinGecko?.ath * 10), // Mock ATH calculation
      source: 'CoinGecko',
    },
    {
      name: '24h Volume',
      current: formatNumber(data?.coinGecko?.volume24h),
      change24h: 8.5,
      change7d: 12.3,
      change30d: -5.2,
      change180d: 23.7,
      ath: formatNumber(500000000), // Mock ATH
      source: 'CoinGecko',
    },
    {
      name: 'Total Transactions',
      current: formatLargeNumber(data?.explorer?.totalTransactions),
      change24h: 3.2,
      change7d: 8.7,
      change30d: 15.3,
      change180d: 45.8,
      ath: formatLargeNumber(10000000), // Mock ATH
      source: 'ADI Explorer',
    },
    {
      name: 'Unique Addresses',
      current: formatLargeNumber(data?.explorer?.uniqueAddresses),
      change24h: 1.8,
      change7d: 6.2,
      change30d: 12.5,
      change180d: 38.9,
      ath: formatLargeNumber(500000), // Mock ATH
      source: 'ADI Explorer',
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-text">Metric</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">Current Value</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">24h %</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">7d %</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">30d %</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">180d %</th>
            <th className="text-right py-3 px-4 font-medium text-muted-text">ATH</th>
            <th className="text-center py-3 px-4 font-medium text-muted-text">Source</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr
              key={metric.name}
              className="border-b border-border hover:bg-background/50 transition-colors"
            >
              <td className="py-3 px-4 font-medium text-primary-text">{metric.name}</td>
              <td className="py-3 px-4 text-right font-mono text-primary-text">
                {metric.current}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getTrendIcon(metric.change24h)}
                  <span className={`font-mono ${getTrendColor(metric.change24h)}`}>
                    {formatPercent(metric.change24h)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getTrendIcon(metric.change7d)}
                  <span className={`font-mono ${getTrendColor(metric.change7d)}`}>
                    {formatPercent(metric.change7d)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getTrendIcon(metric.change30d)}
                  <span className={`font-mono ${getTrendColor(metric.change30d)}`}>
                    {formatPercent(metric.change30d)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-1">
                  {getTrendIcon(metric.change180d)}
                  <span className={`font-mono ${getTrendColor(metric.change180d)}`}>
                    {formatPercent(metric.change180d)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono text-primary-text">
                {metric.ath}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="text-xs text-muted-text bg-background px-2 py-1 rounded">
                  {metric.source}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MetricsTable
