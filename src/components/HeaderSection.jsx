const HeaderSection = () => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header with Period Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif', marginBottom: '12px' }}>
            ADI Chain Intelligence Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8fad', fontFamily: 'Inter, sans-serif', lineHeight: '1.5', maxWidth: '600px', marginBottom: '12px' }}>
            A real-time analytics layer for ADI Chain — tracking network activity, token metrics, and ecosystem growth since mainnet launch.
          </p>
          <p style={{ fontSize: '12px', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
            Data Sources: CoinGecko · ADI Block Explorer · ADI RPC
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeaderSection
