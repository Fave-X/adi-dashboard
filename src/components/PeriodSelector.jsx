import { useData } from '../contexts/DataContext'

// Fixed period options - exactly as specified
const PERIOD_OPTIONS = ['24H', '7D', '30D', 'ALL']

const PeriodSelector = () => {
  const { state, actions } = useData()

  const handlePeriodChange = (period) => {
    // Prevent duplicate selections
    if (period !== state.selectedPeriod) {
      actions.setSelectedPeriod(period)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      marginBottom: '8px'
    }}>
      {PERIOD_OPTIONS.map((period) => (
        <button
          key={period}
          onClick={() => handlePeriodChange(period)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: state.selectedPeriod === period 
              ? '1px solid #e8b84b' 
              : '1px solid #374151',
            backgroundColor: state.selectedPeriod === period 
              ? '#e8b84b' 
              : 'transparent',
            color: state.selectedPeriod === period 
              ? '#ffffff' 
              : '#9ca3af',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            outline: 'none',
            boxShadow: state.selectedPeriod === period 
              ? '0 2px 8px rgba(232, 184, 75, 0.2)' 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (state.selectedPeriod !== period) {
              e.target.style.backgroundColor = 'rgba(55, 65, 81, 0.5)'
              e.target.style.borderColor = '#4b5563'
            }
          }}
          onMouseLeave={(e) => {
            if (state.selectedPeriod !== period) {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = '#374151'
            }
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'scale(0.95)'
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        >
          {period}
        </button>
      ))}
    </div>
  )
}

export default PeriodSelector
