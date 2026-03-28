import { useEffect, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const SupplyChart = ({ data }) => {
  const chartRef = useRef(null)

  // Mock supply distribution data with correct percentages
  const supplyData = {
    labels: ['Circulating Supply', 'Team & Advisors', 'Ecosystem Fund', 'Treasury', 'Locked'],
    datasets: [
      {
        data: [9.7, 15, 10, 5, 60.3],
        backgroundColor: [
          '#e8b84b', // Gold for circulating
          '#2dd4bf', // Teal for team
          '#8b5cf6', // Purple for ecosystem
          '#f59e0b', // Amber for treasury
          '#6b7280', // Gray for locked
        ],
        borderColor: '#080c14',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%', // Smaller cutout for larger donut
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#ffffff',
          font: {
            size: 14,
            family: 'DM Mono'
          },
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label} - ${data.datasets[0].data[i]}%`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].backgroundColor[i],
              pointStyle: 'circle',
              fontColor: '#ffffff'
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#eef2ff',
        bodyColor: '#7a8fad',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${percentage}%`
          },
        },
      },
      // Remove datalabels from pie chart (don't show numbers on slices)
      datalabels: {
        display: false // Hide percentage labels on the chart slices
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
    },
  }

  return (
    <div style={{ height: '400px', position: 'relative' }}>
      <Doughnut ref={chartRef} data={supplyData} options={options} />
    </div>
  )
}

export default SupplyChart
