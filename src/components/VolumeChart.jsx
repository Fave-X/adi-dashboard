import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useData } from '../contexts/DataContext'
import { filterByPeriod } from '../services/unifiedApiService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const VolumeChart = () => {
  const chartRef = useRef(null)
  const { state } = useData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get filtered data based on selected period
  const chartData = filterByPeriod(state.blockscout.volume, state.selectedPeriod)

  // Generate labels from actual data
  const labels = chartData.map(d => {
    const date = new Date(d.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Volume (USD)',
        data: chartData.map(d => d.value),
        backgroundColor: 'rgba(232, 184, 75, 0.6)',
        borderColor: '#e8b84b',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
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
            return `$${(context.parsed.y / 1_000_000).toFixed(2)}M`
          },
        },
      },
      datalabels: {
        display: false // Hide data point labels
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
          display: false, // Remove horizontal grid lines
          drawBorder: false,
        },
        ticks: {
          display: false // Hide y-axis labels (numbers)
        },
      },
    },
  }

  // Show stat card for 24H if insufficient data
  if (!state.blockscout.loading && !state.blockscout.error && state.selectedPeriod === '24H' && chartData.length <= 1) {
    const todayValue = chartData[0]?.value ?? 0
    const todayDate = chartData[0]?.date
      ? new Date(chartData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Today'
    
    return (
      <div style={{ height: '256px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', borderRadius: '8px', padding: '24px' }}>
        <div style={{ color: '#7a8fad', fontSize: '12px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>{todayDate}</div>
        <div style={{ color: '#e8b84b', fontSize: '48px', fontWeight: 'bold', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
          ${(todayValue / 1_000_000).toFixed(2)}M
        </div>
        <div style={{ color: '#7a8fad', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>volume today</div>
      </div>
    )
  }

  // Show loading state
  if (state.blockscout.loading) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>Loading volume data...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e8b84b', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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

  // Show chart
  return (
    <div className="h-64">
      <Bar ref={chartRef} data={chartConfig} options={options} />
    </div>
  )
}

export default VolumeChart