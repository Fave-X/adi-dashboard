import { useState } from 'react'
import HeaderSection from './components/HeaderSection'
import KeyMetricsBar from './components/KeyMetricsBar'
import OverviewTab from './components/OverviewTab'
import ByMetricTab from './components/ByMetricTab'
import MarketsTab from './components/MarketsTab'
import MetricsGlossary from './components/MetricsGlossary'
import Footer from './components/Footer'
import BlockchainStatus from './components/BlockchainStatus'
import LiveStatusBar from './components/LiveStatusBar'
import ErrorBoundary from './components/ErrorBoundary'
import { DataProvider } from './contexts/DataContext'
import { useDataSync } from './hooks/useDataSync'

// Inner component — lives INSIDE DataProvider so useDataSync can access context
function AppContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isAnyLoading } = useDataSync()

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metric', label: 'By Metric' },
    { id: 'markets', label: 'Markets' },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />
      case 'metric': return <ByMetricTab />
      case 'markets': return <MarketsTab />
      default: return <OverviewTab />
    }
  }

  if (isAnyLoading) {
    return (
      <div style={{ backgroundColor: '#080c14', color: '#eef2ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px', fontSize: '18px', fontFamily: 'Syne, sans-serif' }}>Loading ADI Chain Analytics...</div>
          <div style={{ width: '48px', height: '48px', border: '3px solid #e8b84b', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#080c14', color: '#eef2ff', minHeight: '100vh' }}>
      <BlockchainStatus />
      <LiveStatusBar />
      <HeaderSection />
      <KeyMetricsBar />

      {/* Tab Navigation */}
      <div style={{ backgroundColor: '#080c14', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-button"
                style={{
                  position: 'relative',
                  padding: '16px 24px',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  color: activeTab === tab.id ? '#e8b84b' : '#7a8fad',
                  borderBottom: activeTab === tab.id ? '2px solid #e8b84b' : 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main>{renderActiveTab()}</main>
      {activeTab === 'overview' && <MetricsGlossary />}
      <Footer />
    </div>
  )
}

// Outer shell — just mounts the providers
function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ErrorBoundary>
  )
}

export default App