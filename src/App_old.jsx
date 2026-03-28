import { useState } from 'react'
import HeaderSection from './components/HeaderSection'
import KeyMetricsBar from './components/KeyMetricsBar'
import OverviewTab from './components/OverviewTab'
import ByMetricTab from './components/ByMetricTab'
import MarketsTab from './components/MarketsTab'
import MetricsGlossary from './components/MetricsGlossary'
import Footer from './components/Footer'
import BlockchainStatus from './components/BlockchainStatus'
import PeriodSelector from './components/PeriodSelector'
import LastUpdated from './components/LastUpdated'
import { DataProvider } from './contexts/DataContext'
import { useDataSync } from './hooks/useDataSync'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const { syncAllData, isAnyLoading } = useDataSync()

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metric', label: 'By Metric' },
    { id: 'markets', label: 'Markets' },
  ]

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'metric':
        return <ByMetricTab />
      case 'markets':
        return <MarketsTab />
      default:
        return <OverviewTab />
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
    <DataProvider>
      <div style={{ backgroundColor: '#080c14', color: '#eef2ff', minHeight: '100vh' }}>
        {/* Blockchain Status Indicator */}
        <BlockchainStatus />
        
        {/* Header Section with Period Selector */}
        <HeaderSection />
        
        {/* Key Metrics Bar */}
        <KeyMetricsBar />
        
        {/* Global Time Frame Selector */}
        <div style={{ marginBottom: '16px' }}>
          <PeriodSelector />
          
          {/* Last Updated timestamp with animated spinner */}
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <LastUpdated />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ backgroundColor: '#080c14', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

        {/* Tab Content */}
        <main>
          {renderActiveTab()}
        </main>

        {/* Metrics Glossary - Only show on Overview tab */}
        {activeTab === 'overview' && <MetricsGlossary />}
        
        {/* Footer */}
        <Footer />
      </div>
    </DataProvider>
  )
}

// Extracted Period Button component to use the data context
const PeriodButton = ({ period }) => {
  const { state, actions } = useData()
  
  const handleClick = () => {
    actions.setSelectedPeriod(period)
  }
  
  return (
    <button
      onClick={handleClick}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: state.selectedPeriod === period ? '1px solid #e8b84b' : '1px solid #374151',
        backgroundColor: state.selectedPeriod === period ? '#e8b84b' : 'transparent',
        color: state.selectedPeriod === period ? '#ffffff' : '#9ca3af',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s',
        fontSize: '12px'
      }}
    >
      {period}
    </button>
  )
}

export default App