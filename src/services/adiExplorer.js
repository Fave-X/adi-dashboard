// ADI Block Explorer API service

const ADI_EXPLORER_BASE = 'https://explorer-bls.adifoundation.ai/api/v2'
const ADI_EXPLORER_FALLBACK = 'https://explorer.adifoundation.ai/api/v2'

// Cache for API responses
const cache = new Map()
const CACHE_DURATION = 60000 // 60 seconds for current stats, 5 minutes for charts

const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

// Fetch current total addresses
export const fetchADIStats = async () => {
  const cacheKey = 'adi_stats'
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    console.log('Fetching from primary ADI Explorer...')
    const response = await fetch(`${ADI_EXPLORER_BASE}/stats`)
    
    if (!response.ok) {
      console.log('Primary failed, trying fallback...')
      // Try fallback URL
      const fallbackResponse = await fetch(`${ADI_EXPLORER_FALLBACK}/stats`)
      if (!fallbackResponse.ok) {
        throw new Error(`API Error: ${fallbackResponse.status} ${fallbackResponse.statusText}`)
      }
      const data = await fallbackResponse.json()
      console.log('Fallback data received:', data)
      setCachedData(cacheKey, data)
      return data
    }
    
    const data = await response.json()
    console.log('Primary data received:', data)
    setCachedData(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching ADI stats:', error)
    throw error
  }
}

// Fetch historical address growth chart data
export const fetchADIAddressChart = async () => {
  const cacheKey = 'adi_address_chart'
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    console.log('Fetching chart data from primary ADI Explorer...')
    const response = await fetch(`${ADI_EXPLORER_BASE}/stats/charts/addresses`)
    
    if (!response.ok) {
      console.log('Primary chart failed, trying fallback...')
      // Try fallback URL
      const fallbackResponse = await fetch(`${ADI_EXPLORER_FALLBACK}/stats/charts/addresses`)
      if (!fallbackResponse.ok) {
        throw new Error(`API Error: ${fallbackResponse.status} ${fallbackResponse.statusText}`)
      }
      const data = await fallbackResponse.json()
      console.log('Fallback chart data received:', data)
      setCachedData(cacheKey, data)
      return data
    }
    
    const data = await response.json()
    console.log('Primary chart data received:', data)
    setCachedData(cacheKey, data)
    return data
  } catch (error) {
    console.error('Error fetching ADI address chart:', error)
    throw error
  }
}

// Filter chart data by time period
export const filterChartDataByPeriod = (chartData, period) => {
  if (!chartData || !chartData.chart_data) return chartData
  
  const now = new Date()
  let startDate
  
  switch (period) {
    case '24H':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7D':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30D':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      return chartData // Return all data for unknown periods
  }
  
  const filteredData = chartData.chart_data.filter(item => {
    return new Date(item.date) >= startDate
  })
  
  return { ...chartData, chart_data: filteredData }
}
