const MarketsTab = ({ data, selectedPeriod }) => {
  const exchanges = [
    { name: "Kraken", pair: "ADI/USD" },
    { name: "Kraken", pair: "ADI/EUR" },
    { name: "KuCoin", pair: "ADI/USDT" },
    { name: "MEXC", pair: "ADI/USDT" },
    { name: "Crypto.com", pair: "ADI/USDT" },
    { name: "Bilaxy", pair: "ADI/USDT" },
  ]

  return (
    <div style={{ backgroundColor: '#080c14', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Section Title and Subtitle */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif', marginBottom: '12px' }}>
            ADI Token Markets
          </h2>
          <p style={{ fontSize: '13px', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
            Exchanges where ADI is currently listed
          </p>
        </div>

        {/* Markets Table */}
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '500', fontSize: '11px', color: '#7a8fad', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Mono, monospace', backgroundColor: '#0f1520' }}>
                    Exchange
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '500', fontSize: '11px', color: '#7a8fad', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Mono, monospace', backgroundColor: '#0f1520' }}>
                    Trading Pair
                  </th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((exchange, index) => (
                  <tr 
                    key={`${exchange.name}-${index}`}
                    style={{ 
                      borderTop: '1px solid rgba(255,255,255,0.06)', 
                      transition: 'all 0.3s',
                      backgroundColor: index % 2 === 0 ? '#111827' : '#0f1520'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a1f2e'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#111827' : '#0f1520'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#eef2ff', fontSize: '14px' }}>
                      {exchange.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#eef2ff', fontSize: '14px', fontFamily: 'DM Mono, monospace' }}>
                      {exchange.pair}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Note below table */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '11px', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
              For live volume data visit CoinGecko
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketsTab
