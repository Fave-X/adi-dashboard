import { useRef, useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useData } from '../contexts/DataContext'
import { filterByPeriod } from '../services/unifiedApiService'

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

const CumulativeAddressesChart = () => {
  const chartRef = useRef(null)
  const { state } = useData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get filtered data based on selected period
  const chartData = filterByPeriod(state.blockscout.addresses, state.selectedPeriod)

  const chartConfig = {
    labels: chartData.map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Cumulative Unique Addresses',
        data: chartData.map(d => d.value),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#4ade80',
        pointHoverBorderColor: '#1e293b',
        pointHoverBorderWidth: 2,
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
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        titleFont: {
          size: 12,
          weight: 'bold',
          family: 'Inter',
        },
        bodyFont: {
          size: 11,
          family: 'Inter',
        },
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Addresses: ${context.parsed.y.toLocaleString()}`
          },
        },
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
          maxTicksLimit: state.selectedPeriod === '24H' ? 24 : state.selectedPeriod === '7D' ? 7 : 8,
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
            family: 'Inter',
          },
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M'
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K'
            }
            return value.toLocaleString()
          },
        },
      },
    },
  }

  // Show loading state
  if (state.blockscout.loading) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>Loading address data...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #4ade80', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    )
  }

  // Show error state
  if (state.blockscout.error) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        {state.blockscout.error}
      </div>
    )
  }

  return (
    <div style={{ height: '256px' }}>
      <Line ref={chartRef} data={chartConfig} options={options} />
    </div>
  )
}

export default CumulativeAddressesChart
