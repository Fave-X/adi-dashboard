// API service for ADI Chain analytics dashboard

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
// Note: Explorer API is blocked by CORS, using mock data for now
const EXPLORER_BASE = null; // Disabled due to CORS issues
const RPC_BASE = 'https://rpc.adifoundation.ai';

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// CoinGecko API
export const fetchCoinGeckoData = async () => {
  const cacheKey = 'coingecko';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${COINGECKO_BASE}/coins/adi-token`);
    if (!response.ok) throw new Error('CoinGecko API failed');
    
    const data = await response.json();
    const processedData = {
      price: data.market_data.current_price.usd,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      fdv: data.market_data.fully_diluted_valuation.usd,
      priceChange24h: data.market_data.price_change_percentage_24h,
      priceChange7d: data.market_data.price_change_percentage_7d,
      priceChange30d: data.market_data.price_change_percentage_30d,
      priceChange180d: data.market_data.price_change_percentage_200d,
      ath: data.market_data.ath.usd,
      athDate: data.market_data.ath_date.usd,
      atl: data.market_data.atl.usd,
      atlDate: data.market_data.atl_date.usd,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
      maxSupply: data.market_data.max_supply,
      markets: data.tickers?.slice(0, 10).map(ticker => ({
        exchange: ticker.market?.name || 'Unknown',
        pair: `${ticker.base}/${ticker.target}`,
        volume: ticker.converted_volume.usd,
        price: ticker.converted_last.usd,
        spread: ticker.bid_ask_spread_percentage,
        trust_score: ticker.trust_score
      })) || [],
      lastUpdated: data.last_updated,
    };
    
    setCachedData(cacheKey, processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return null;
  }
};

export const fetchCoinGeckoHistory = async (days = 30) => {
  const cacheKey = `coingecko_history_${days}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${COINGECKO_BASE}/coins/adi-token/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    if (!response.ok) throw new Error('CoinGecko history API failed');
    
    const data = await response.json();
    const processedData = data.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toISOString().split('T')[0],
    }));
    
    setCachedData(cacheKey, processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching CoinGecko history:', error);
    return [];
  }
};

// ADI Explorer API
export const fetchExplorerStats = async () => {
  const cacheKey = 'explorer_stats';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Return realistic mock data for demo purposes
    const mockData = {
      totalTransactions: 4850000 + Math.floor(Math.random() * 10000),
      uniqueAddresses: 189000 + Math.floor(Math.random() * 1000),
      averageBlockTime: 1.2 + (Math.random() - 0.5) * 0.2,
      latestBlockNumber: 12345678 + Math.floor(Math.random() * 100),
      totalBlocks: 12345678 + Math.floor(Math.random() * 100),
      totalGasUsed: 987654321 + Math.floor(Math.random() * 1000000),
      dailyTransactionThroughput: 45000 + Math.floor(Math.random() * 5000), // New metric
      tps: 8000 + Math.floor(Math.random() * 1000), // Transactions per second
    };
    
    setCachedData(cacheKey, mockData);
    return mockData;
  } catch (error) {
    console.error('Error fetching explorer stats:', error);
    return null;
  }
};

export const fetchTransactions = async (limit = 100) => {
  const cacheKey = `transactions_${limit}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Return realistic mock transactions for demo purposes
    const mockTransactions = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      hash: `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
      from: `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
      to: `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`,
      value: Math.floor(Math.random() * 1000000) / 1000000,
      timestamp: Date.now() - (i * 60000), // 1 minute intervals
    }));
    
    setCachedData(cacheKey, mockTransactions);
    return mockTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// ADI RPC API
export const fetchRPCData = async () => {
  const cacheKey = 'rpc_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Fetch latest block number
    const blockNumberResponse = await fetch(RPC_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    });

    // Fetch gas price
    const gasPriceResponse = await fetch(RPC_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 2,
      }),
    });

    if (!blockNumberResponse.ok || !gasPriceResponse.ok) {
      throw new Error('RPC API failed');
    }

    const [blockNumberData, gasPriceData] = await Promise.all([
      blockNumberResponse.json(),
      gasPriceResponse.json(),
    ]);

    const processedData = {
      latestBlockNumber: parseInt(blockNumberData.result, 16),
      gasPrice: parseInt(gasPriceData.result, 16) / 1e9, // Convert to Gwei
    };

    setCachedData(cacheKey, processedData);
    return processedData;
  } catch (error) {
    console.error('Error fetching RPC data:', error);
    return null;
  }
};

// Calculated metrics
export const calculateMetrics = (coinGeckoData, explorerData, rpcData) => {
  if (!coinGeckoData || !explorerData) return {};

  const daysSinceMainnet = Math.floor((Date.now() - new Date('2025-12-09').getTime()) / (1000 * 60 * 60 * 24));
  const volumeMarketCapRatio = coinGeckoData.volume24h / coinGeckoData.marketCap;
  const percentBelowATH = ((coinGeckoData.ath - coinGeckoData.price) / coinGeckoData.ath) * 100;
  const supplyUtilization = (coinGeckoData.circulatingSupply / coinGeckoData.totalSupply) * 100;
  const velocityRatio = (coinGeckoData.volume24h * 30) / coinGeckoData.marketCap;

  return {
    daysSinceMainnet,
    volumeMarketCapRatio,
    percentBelowATH,
    supplyUtilization,
    velocityRatio,
    averageGasPrice: rpcData?.gasPrice || 0,
    latestBlockNumber: rpcData?.latestBlockNumber || explorerData?.latestBlockNumber || 0,
    averageBlockTime: explorerData?.averageBlockTime || 0,
  };
};

// Combined data fetch
export const fetchAllData = async () => {
  try {
    const [coinGeckoData, explorerData, rpcData] = await Promise.all([
      fetchCoinGeckoData(),
      fetchExplorerStats(),
      fetchRPCData(),
    ]);

    const calculatedMetrics = calculateMetrics(coinGeckoData, explorerData, rpcData);

    return {
      coinGecko: coinGeckoData,
      explorer: explorerData,
      rpc: rpcData,
      calculated: calculatedMetrics,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    return null;
  }
};
