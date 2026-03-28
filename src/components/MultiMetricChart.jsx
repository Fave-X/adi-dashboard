import { useEffect, useRef } from 'react'
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

const MultiMetricChart = ({ timeframe }) => {
  const chartRef = useRef(null)

  // Generate mock data for multiple metrics
  const generateMockData = () => {
    const days = timeframe === '30D' ? 30 : 365
    const labels = []
    const priceData = []
    const volumeData = []
    const addressesData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Generate realistic data
      const basePrice = 0.85 + (Math.random() - 0.5) * 0.1
      const baseVolume = 5000000 + (Math.random() - 0.5) * 2000000
      const baseAddresses = 180000 + i * 50 + (Math.random() - 0.5) * 100
      
      priceData.push(basePrice)
      volumeData.push(baseVolume / 1000000) // Convert to millions
      addressesData.push(baseAddresses / 1000) // Convert to thousands
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    
    return { labels, priceData, volumeData, addressesData }
  }

  const { labels, priceData, volumeData, addressesData } = generateMockData()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Price (USD)',
        data: priceData,
        borderColor: '#e8b84b',
        backgroundColor: 'rgba(232, 184, 75, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y',
      },
      {
        label: 'Volume (M)',
        data: volumeData,
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y1',
      },
      {
        label: 'Addresses (K)',
        data: addressesData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y2',
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
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#7a8fad',
          font: {
            size: 11,
            family: 'Inter',
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#eef2ff',
        bodyColor: '#7a8fad',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
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
          maxTicksLimit: timeframe === '30D' ? 8 : 24,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#e8b84b',
          font: {
            size: 10,
            family: 'DM Mono',
          },
          callback: function (value) {
            return '$' + value.toFixed(2)
          },
        },
      },
      y1: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: 'linear',
        display: false,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return (
    <div className="h-64">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}

export default MultiMetricChart
