import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataProvider } from '../contexts/DataContext'
import PeriodSelector from '../components/PeriodSelector'
import LastUpdated from '../components/LastUpdated'
import LiveStatusBar from '../components/LiveStatusBar'

// Mock data context
const mockState = {
  selectedPeriod: '24H',
  connectionStatus: {
    coingecko: 'success',
    blockscout: 'success',
    rpc: 'success'
  },
  globalLastUpdated: Date.now(),
  coingecko: { loading: false, lastUpdated: Date.now() },
  blockscout: { loading: false, lastUpdated: Date.now() },
  rpc: { loading: false, lastUpdated: Date.now() }
}

const mockActions = {
  setSelectedPeriod: vi.fn(),
  setConnectionStatus: vi.fn(),
  setGlobalLastUpdated: vi.fn()
}

// Test wrapper component
const TestWrapper = ({ children }) => (
  <DataProvider>
    {children}
  </DataProvider>
)

describe('Data Feeds Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PeriodSelector', () => {
    it('renders all period options correctly', () => {
      render(
        <TestWrapper>
          <PeriodSelector />
        </TestWrapper>
      )

      // Check all period buttons are present
      expect(screen.getByText('24H')).toBeInTheDocument()
      expect(screen.getByText('7D')).toBeInTheDocument()
      expect(screen.getByText('30D')).toBeInTheDocument()
      expect(screen.getByText('ALL')).toBeInTheDocument()
    })

    it('highlights selected period correctly', () => {
      render(
        <TestWrapper>
          <PeriodSelector />
        </TestWrapper>
      )

      const selectedButton = screen.getByText('24H')
      expect(selectedButton).toHaveStyle({
        backgroundColor: '#e8b84b',
        color: '#ffffff'
      })
    })

    it('calls setSelectedPeriod when period is clicked', async () => {
      render(
        <TestWrapper>
          <PeriodSelector />
        </TestWrapper>
      )

      const periodButton = screen.getByText('7D')
      fireEvent.click(periodButton)

      await waitFor(() => {
        expect(mockActions.setSelectedPeriod).toHaveBeenCalledWith('7D')
      })
    })

    it('prevents duplicate selections', () => {
      mockState.selectedPeriod = '7D'
      
      render(
        <TestWrapper>
          <PeriodSelector />
        </TestWrapper>
      )

      const selectedButton = screen.getByText('7D')
      fireEvent.click(selectedButton)

      // Should not call setSelectedPeriod again
      expect(mockActions.setSelectedPeriod).not.toHaveBeenCalled()
    })
  })

  describe('LastUpdated Component', () => {
    it('displays last updated timestamp', () => {
      render(
        <TestWrapper>
          <LastUpdated />
        </TestWrapper>
      )

      expect(screen.getByText(/updated/)).toBeInTheDocument()
    })

    it('shows loading state when no data', () => {
      mockState.globalLastUpdated = null
      
      render(
        <TestWrapper>
          <LastUpdated />
        </TestWrapper>
      )

      expect(screen.getByText('Initializing data...')).toBeInTheDocument()
    })

    it('animates when data updates', async () => {
      const { rerender } = render(
        <TestWrapper>
          <LastUpdated />
        </TestWrapper>
      )

      // Update timestamp
      mockState.globalLastUpdated = Date.now() + 1000
      rerender(
        <TestWrapper>
          <LastUpdated />
        </TestWrapper>
      )

      await waitFor(() => {
        const timestampElement = screen.getByText(/updated/)
        expect(timestampElement).toHaveStyle({
          fontWeight: '600'
        })
      })
    })
  })

  describe('LiveStatusBar', () => {
    it('shows overall system health', () => {
      render(
        <TestWrapper>
          <LiveStatusBar />
        </TestWrapper>
      )

      expect(screen.getByText('All Systems Healthy')).toBeInTheDocument()
    })

    it('displays all service statuses', () => {
      render(
        <TestWrapper>
          <LiveStatusBar />
        </TestWrapper>
      )

      expect(screen.getByText('CoinGecko API')).toBeInTheDocument()
      expect(screen.getByText('Blockscout API')).toBeInTheDocument()
      expect(screen.getByText('ADI RPC')).toBeInTheDocument()
    })

    it('expands to show details', async () => {
      render(
        <TestWrapper>
          <LiveStatusBar />
        </TestWrapper>
      )

      const statusBar = screen.getByText('All Systems Healthy').closest('div')
      fireEvent.click(statusBar)

      await waitFor(() => {
        expect(screen.getByText('api.coingecko.com')).toBeInTheDocument()
        expect(screen.getByText('explorer-bls.adifoundation.ai')).toBeInTheDocument()
        expect(screen.getByText('rpc.adifoundation.ai')).toBeInTheDocument()
      })
    })

    it('shows error state when services fail', () => {
      mockState.connectionStatus.coingecko = 'error'
      
      render(
        <TestWrapper>
          <LiveStatusBar />
        </TestWrapper>
      )

      expect(screen.getByText('System Issues Detected')).toBeInTheDocument()
    })
  })

  describe('Data Feed Integration', () => {
    it('handles period changes across components', async () => {
      render(
        <TestWrapper>
          <PeriodSelector />
          <LastUpdated />
        </TestWrapper>
      )

      // Change period
      const periodButton = screen.getByText('30D')
      fireEvent.click(periodButton)

      await waitFor(() => {
        expect(mockActions.setSelectedPeriod).toHaveBeenCalledWith('30D')
      })
    })

    it('maintains consistent state across components', () => {
      render(
        <TestWrapper>
          <PeriodSelector />
          <LastUpdated />
          <LiveStatusBar />
        </TestWrapper>
      )

      // All components should reflect the same selected period
      expect(screen.getByText('24H')).toBeInTheDocument()
      expect(screen.getByText(/updated/)).toBeInTheDocument()
      expect(screen.getByText('All Systems Healthy')).toBeInTheDocument()
    })
  })
})
