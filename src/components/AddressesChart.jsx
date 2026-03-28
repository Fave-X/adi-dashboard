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

const AddressesChart = () => {
  const chartRef = useRef(null)

  // Generate mock cumulative data
  const generateMockData = () => {
    const days = 90
    const data = []
    const labels = []
    let cumulativeAddresses = 150000 // Starting point
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Generate realistic growth
      const newAddresses = Math.floor(800 + Math.random() * 1200)
      cumulativeAddresses += newAddresses
      
      data.push(cumulativeAddresses)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    
    return { labels, data }
  }

  const { labels, data } = generateMockData()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cumulative Unique Addresses',
        data,
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointBackgroundColor: '#4ade80',
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
            return `${context.parsed.y.toLocaleString()} addresses`
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
          maxTicksLimit: 12,
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
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M'
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'K'
            }
            return value.toLocaleString()
          },
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

export default AddressesChart
