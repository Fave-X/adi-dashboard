import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
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

const TransactionsChart = () => {
  const chartRef = useRef(null)
  const { state } = useData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get filtered data based on selected period
  const chartData = filterByPeriod(state.blockscout.transactions, state.selectedPeriod)

  // Generate labels from actual data
  const labels = chartData.map(d => {
    const date = new Date(d.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Daily Transactions',
        data: chartData.map(d => d.value),
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#2dd4bf',
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
            return `${context.parsed.y.toLocaleString()} txs`
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
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          display: false // Hide y-axis labels (numbers)
        },
      },
    },
  }

  // Show stat card for 24H if insufficient data points for meaningful chart
  if (!state.blockscout.loading && !state.blockscout.error && state.selectedPeriod === '24H' && chartData.length <= 2) {
    const todayValue = chartData[0]?.value ?? 0
    const todayDate = chartData[0]?.date
      ? new Date(chartData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Today'
    
    return (
      <div style={{ height: '256px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', borderRadius: '8px', padding: '24px' }}>
        <div style={{ color: '#7a8fad', fontSize: '12px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>{todayDate}</div>
        <div style={{ color: '#2dd4bf', fontSize: '48px', fontWeight: 'bold', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
          {todayValue.toLocaleString()}
        </div>
        <div style={{ color: '#7a8fad', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>transactions today</div>
      </div>
    )
  }

  // For 24H with sufficient data points, show individual hourly distribution
  if (!state.blockscout.loading && !state.blockscout.error && state.selectedPeriod === '24H' && chartData.length > 2) {
    return (
      <div style={{ height: '256px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', borderRadius: '8px', padding: '24px' }}>
        <div style={{ color: '#7a8fad', fontSize: '12px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>24H Transaction Distribution</div>
        <div style={{ color: '#2dd4bf', fontSize: '48px', fontWeight: 'bold', fontFamily: 'DM Mono, monospace', marginBottom: '8px' }}>
          {chartData.length} hourly data points
        </div>
        <div style={{ color: '#7a8fad', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>showing individual hours</div>
      </div>
    )
  }

  // Show loading state
  if (state.blockscout.loading) {
    return (
      <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8fad', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '8px' }}>Loading transaction data...</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #2dd4bf', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
      <Line ref={chartRef} data={chartConfig} options={options} />
    </div>
  )
}

export default TransactionsChart