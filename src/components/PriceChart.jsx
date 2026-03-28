import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { useData } from '../contexts/DataContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const PriceChart = () => {
  const chartRef = useRef(null)
  const { state } = useData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get price history data based on selected period
  const priceHistory = state.coingecko.history[state.selectedPeriod]?.prices || []
  
  // Generate labels and data from actual price history
  const labels = priceHistory.map(([timestamp, price]) => {
    const date = new Date(timestamp)
    if (state.selectedPeriod === '24H') {
      // For 24H, show time labels
      return format(date, 'ha')
    } else {
      // For 7D, 30D, ALL, show date labels
      return format(date, 'MMM d')
    }
  })
  
  const prices = priceHistory.map(([timestamp, price]) => price)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'ADI Price (USD)',
        data: prices,
        borderColor: '#e8b84b',
        backgroundColor: 'rgba(232, 184, 75, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#e8b84b',
        pointBorderColor: '#080c14',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#eef2ff',
        bodyColor: '#7a8fad',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y.toFixed(4)}`
          },
        },
      },
      datalabels: {
        display: false
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#7a8fad',
          font: {
            size: 10,
            family: 'Inter',
          },
          maxTicksLimit: state.selectedPeriod === '24H' ? 8 : state.selectedPeriod === '7D' ? 7 : state.selectedPeriod === '30D' ? 8 : 12,
        },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#7a8fad',
          font: {
            size: 10,
            family: 'DM Mono',
          },
          callback: function (value) {
            return '$' + value.toFixed(2)
          },
        },
      },
    },
  }

  // Show loading state
  if (state.coingecko.loading || !state.coingecko.current) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>Loading price data...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e8b84b', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    )
  }

  // Show error state
  if (state.coingecko.error) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        {state.coingecko.error}
      </div>
    )
  }

  return (
    <div style={{ height: '256px' }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}

export default PriceChart
