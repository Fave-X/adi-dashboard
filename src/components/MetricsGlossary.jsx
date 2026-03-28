const MetricsGlossary = () => {
  const glossaryItems = [
    {
      id: 'adi-price',
      term: 'ADI Price',
      definition: 'The current USD price of ADI token sourced from CoinGecko'
    },
    {
      id: 'market-cap',
      term: 'Market Cap',
      definition: 'Circulating supply multiplied by current ADI price'
    },
    {
      id: '24h-volume',
      term: '24H Volume',
      definition: 'Total USD value of ADI traded in the last 24 hours across all exchanges'
    },
    {
      id: 'total-transactions',
      term: 'Total Transactions',
      definition: 'Cumulative number of transactions processed on ADI Chain since mainnet launch Dec 9 2025'
    },
    {
      id: 'unique-addresses',
      term: 'Unique Addresses',
      definition: 'Total number of wallets that have ever interacted with ADI Chain'
    },
    {
      id: 'active-addresses',
      term: 'Active Addresses',
      definition: 'Wallets that sent or received a transaction in the last 24 hours'
    },
    {
      id: 'velocity-ratio',
      term: 'Velocity Ratio',
      definition: '30d trading volume divided by average market cap. High = real transactional use. Low = holding'
    },
    {
      id: 'transaction-momentum',
      term: 'Transaction Momentum',
      definition: 'Compares 7-day average transactions to 30-day average to show if network activity is accelerating or slowing'
    },
    {
      id: 'network-growth-rate',
      term: 'Network Growth Rate',
      definition: 'New unique addresses created per day as a 7-day rolling average'
    },
    {
      id: 'days-since-mainnet',
      term: 'Days Since Mainnet',
      definition: 'Number of days since ADI Chain launched on December 9 2025'
    }
  ]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif', marginBottom: '24px' }}>
          Metrics Glossary
        </h2>
        <div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
        >
          {glossaryItems.map((item) => (
            <div 
              key={item.id}
              style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '4px solid #e8b84b',
                borderRadius: '8px',
                padding: '16px 20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#eef2ff', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
                {item.term}
              </div>
              <div style={{ fontSize: '13px', color: '#7a8fad', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', flex: '1' }}>
                {item.definition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MetricsGlossary
