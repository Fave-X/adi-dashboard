import { TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const InsightsTab = ({ data }) => {
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

  const getSignalBadge = (signal) => {
    const badges = {
      BULLISH: 'bg-green-500/20 text-green-500 border-green-500/30',
      NEUTRAL: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
      BEARISH: 'bg-red-500/20 text-red-500 border-red-500/30',
    }
    return badges[signal] || badges.NEUTRAL
  }

  const getStatusBadge = (status) => {
    const badges = {
      LIVE: 'bg-green-500/20 text-green-500 border-green-500/30',
      'IN PROGRESS': 'bg-[#e8b84b]/20 text-[#e8b84b] border-[#e8b84b]/30',
      ANNOUNCED: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
    }
    return badges[status] || badges.ANNOUNCED
  }

  const insights = [
    {
      title: 'VELOCITY RATIO',
      value: '1.26',
      signal: 'BULLISH',
      description: 'The velocity ratio of 1.26 indicates that money is moving efficiently through the ADI Chain ecosystem. With 30-day volume representing 126% of market cap, this suggests strong transactional utility rather than pure speculation. High velocity typically correlates with active DeFi protocols, frequent payments, and robust network utilization.',
      source: 'Calculated from CoinGecko',
    },
    {
      title: 'TRANSACTION MOMENTUM',
      value: '+12.3%',
      signal: 'BULLISH',
      description: 'Transaction momentum is strongly positive with the 7-day average 12.3% higher than the 30-day average. This accelerating trend indicates growing network adoption and usage. The consistent upward trajectory suggests that ADI Chain is gaining traction among users and applications, potentially driven by new partnerships or ecosystem developments.',
      source: 'ADI Explorer',
    },
    {
      title: 'NETWORK GROWTH RATE',
      value: '+2.3%',
      signal: 'NEUTRAL',
      description: 'The network is adding approximately 1,200-1,300 new addresses daily, representing a steady 2.3% growth rate. While this shows consistent user acquisition, the rate suggests room for expansion. This healthy growth indicates organic adoption without speculative bubbles, supporting sustainable long-term development.',
      source: 'ADI Explorer',
    },
    {
      title: 'SUPPLY UTILIZATION',
      value: '67.8%',
      signal: 'NEUTRAL',
      description: 'With 67.8% of total supply currently circulating, ADI Chain maintains a balanced distribution. This utilization rate suggests sufficient liquidity for trading while retaining tokens for future ecosystem development, partnerships, and incentives. The moderate level helps prevent excessive selling pressure while supporting network growth.',
      source: 'CoinGecko',
    },
  ]

  const partnerships = [
    {
      name: 'First Abu Dhabi Bank',
      project: 'AED Stablecoin',
      status: 'LIVE',
      description: 'Fully operational AED-pegged stablecoin facilitating Middle Eastern trade and remittances.',
    },
    {
      name: 'M-Pesa',
      project: 'Mobile Payments',
      status: 'IN PROGRESS',
      description: 'Integration with Africa\'s largest mobile money network, enabling cross-border payments.',
    },
    {
      name: 'Mastercard',
      project: 'Payment Rails',
      status: 'ANNOUNCED',
      description: 'Strategic partnership to connect ADI Chain with global payment infrastructure.',
    },
    {
      name: 'BlackRock',
      project: 'Tokenized RWAs',
      status: 'ANNOUNCED',
      description: 'Tokenization of real-world assets including real estate and commodities.',
    },
    {
      name: 'Franklin Templeton',
      project: 'Tokenized Funds',
      status: 'ANNOUNCED',
      description: 'Digital asset management and tokenized investment funds.',
    },
  ]

  const chainInfo = {
    type: 'ZK Rollup L2 on Ethereum (ZKSync Stack)',
    prover: 'Airbender',
    tpsCapacity: '8,000+',
    avgBlockTime: '~1 second',
    mainnetLaunch: 'December 9, 2025',
    chainId: '36900',
    focus: 'Institutional finance, RWAs, MENA + Africa + Asia',
  }

  return (
    <div className="space-y-6">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {insights.map((insight, index) => (
          <div
            key={insight.title}
            className={`bg-[#111827] border-2 border-[rgba(255,255,255,0.06)] rounded-[10px] p-6 hover:border-[rgba(232,184,75,0.3)] transition-all duration-300 ${
              insight.signal === 'BULLISH' ? 'border-l-4 border-l-green-500' :
              insight.signal === 'BEARISH' ? 'border-l-4 border-l-red-500' :
              'border-l-4 border-l-gray-500'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider mb-2">
                  {insight.title}
                </h3>
                <p className="text-[24px] font-mono font-bold text-white">
                  {insight.value}
                </p>
              </div>
              <span className={`px-3 py-1 text-[10px] font-medium rounded-full border ${getSignalBadge(insight.signal)}`}>
                {insight.signal}
              </span>
            </div>
            
            <p className="text-[13px] text-[#7a8fad] leading-relaxed mb-4">
              {insight.description}
            </p>
            
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#7a8fad] bg-[#0f1520] px-2 py-1 rounded border border-[rgba(255,255,255,0.06)]">
                {insight.source}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chain Context */}
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
        <h3 className="text-[18px] font-heading font-bold text-white mb-4">
          ADI Chain Context
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">Type</div>
            <div className="text-white">{chainInfo.type}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">Prover</div>
            <div className="text-white">{chainInfo.prover}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">TPS Capacity</div>
            <div className="text-white">{chainInfo.tpsCapacity}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">Avg Block Time</div>
            <div className="text-white">{chainInfo.avgBlockTime}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">Mainnet Launch</div>
            <div className="text-white">{chainInfo.mainnetLaunch}</div>
          </div>
          <div className="space-y-2">
            <div className="text-[11px] text-[#7a8fad] font-medium uppercase tracking-wider">Focus</div>
            <div className="text-white">{chainInfo.focus}</div>
          </div>
        </div>
      </div>

      {/* Ecosystem Partners */}
      <div>
        <h3 className="text-[18px] font-heading font-bold text-white mb-4">
          Ecosystem Partners
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="bg-[#111827] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-4 hover:border-[rgba(232,184,75,0.3)] transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[13px] font-medium text-white mb-1">
                    {partner.name}
                  </h4>
                  <div className="text-[11px] text-[#7a8fad]">
                    {partner.project}
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-medium rounded-full border ${getStatusBadge(partner.status)}`}>
                  {partner.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightsTab
