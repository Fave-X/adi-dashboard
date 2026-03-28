const Footer = () => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Disclaimer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '32px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <p style={{ fontSize: '12px', color: '#7a8fad', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>
            This dashboard is provided for informational purposes only and does not constitute financial advice. All data is sourced from public APIs including CoinGecko and ADI Block Explorer. Metrics may be delayed and should not be used as sole basis for any investment decision. ADI Chain data reflects mainnet activity from December 9, 2025 onwards.
          </p>
        </div>
      </div>

      {/* Credits */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
            Built by FaveDigitals (@FaveDigitalsHQ) · Powered by CoinGecko · ADI Block Explorer
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
