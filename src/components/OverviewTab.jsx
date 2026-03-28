import { useState } from 'react'
import VolumeChart from './VolumeChart'
import TransactionsChart from './TransactionsChart'
import SupplyChart from './SupplyChart'
import PriceChart from './PriceChart'
import CumulativeAddressesChart from './CumulativeAddressesChart'
import { useData } from '../contexts/DataContext'

const OverviewTab = () => {
  const { state } = useData()

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0.00'}`
  }

  return (
    <div style={{ backgroundColor: '#080c14', minHeight: '100vh' }}>
      {/* Charts Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Row 1: Three Charts in Single Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '20px' }}>
          {/* Daily Volume USD (Bar Chart) */}
          <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
                Daily Volume USD
              </h3>
            </div>
            <div style={{ height: '256px', marginBottom: '16px' }}>
              <VolumeChart />
            </div>
          </div>

          {/* Daily Transactions (Bar Chart) */}
          <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
                Daily Transactions
              </h3>
            </div>
            <div style={{ height: '256px', marginBottom: '16px' }}>
              <TransactionsChart />
            </div>
          </div>

          {/* Supply Distribution Pie Chart */}
          <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
                Supply Distribution
              </h3>
            </div>
            <div style={{ height: '400px', marginBottom: '16px' }}>
              <SupplyChart data={state.coingecko.current} />
            </div>
          </div>
        </div>

        {/* Row 2: Full Width Price Chart */}
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
              ADI Price History
            </h3>
          </div>
          <div style={{ height: '256px', marginBottom: '16px' }}>
            <PriceChart />
          </div>
        </div>

        {/* Row 3: Full Width Cumulative Addresses */}
        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#eef2ff', fontFamily: 'Syne, sans-serif' }}>
              Cumulative Unique Addresses Growth
            </h3>
          </div>
          <div style={{ height: '256px', marginBottom: '16px' }}>
            <CumulativeAddressesChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
