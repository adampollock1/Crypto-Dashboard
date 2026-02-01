// CoinGecko API Service
// Configured to use mock data for demo purposes (no API key needed)

import {
  USE_MOCK_DATA,
  topCoins as mockTopCoins,
  marketStats as mockMarketStats,
  topGainers as mockGainers,
  topLosers as mockLosers,
  fearGreedIndex as mockFearGreed,
  dominanceData as mockDominance,
  gasData as mockGasData,
  getMockCoinsPage,
  getCoinDetailsFallback,
  getCoinHistoryFallback,
  searchCoinsMock,
} from '../data/mockData';

// Optional API key for higher rate limits (only used if USE_MOCK_DATA is false)
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const FEAR_GREED_BASE = 'https://api.alternative.me/fng';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 60000; // 60 seconds

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Simulate network delay for realistic mock data experience
 */
async function simulateDelay(min = 100, max = 300) {
  const delay = Math.random() * (max - min) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Fetch with retry logic and exponential backoff for rate limiting
 * Only used when USE_MOCK_DATA is false
 */
async function fetchWithRetry(url, retries = 3) {
  const headers = {};
  
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers });
      
      if (response.status === 429) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        console.warn(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (err) {
      if (i === retries - 1) {
        throw err;
      }
      const waitTime = 1000 * (i + 1);
      console.warn(`Fetch error, waiting ${waitTime}ms before retry ${i + 1}/${retries}:`, err.message);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error('Max retries exceeded - API unavailable');
}

/**
 * Fetch top cryptocurrencies by market cap
 * @param {number} limit - Number of coins to fetch (default 20)
 * @returns {Promise<Array>} Array of coin data
 */
export async function fetchTopCoins(limit = 20) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockTopCoins.slice(0, limit);
  }

  const cacheKey = `topCoins_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  const transformed = data.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h || 0,
    marketCap: coin.market_cap,
    volume: coin.total_volume,
    image: coin.image,
  }));

  setCache(cacheKey, transformed);
  return transformed;
}

/**
 * Fetch global cryptocurrency market data
 * @returns {Promise<Object>} Global market statistics
 */
export async function fetchGlobalData() {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockMarketStats;
  }

  const cacheKey = 'globalData';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(`${COINGECKO_BASE}/global`);

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const { data } = await response.json();
  
  const transformed = {
    totalMarketCap: data.total_market_cap.usd,
    totalMarketCapChange: data.market_cap_change_percentage_24h_usd,
    total24hVolume: data.total_volume.usd,
    total24hVolumeChange: 0,
    btcDominance: data.market_cap_percentage.btc,
    ethDominance: data.market_cap_percentage.eth,
    activeCoins: data.active_cryptocurrencies,
    activePairs: data.markets,
  };

  setCache(cacheKey, transformed);
  return transformed;
}

/**
 * Fetch top gainers (coins sorted by 24h price change descending)
 * @param {number} limit - Number of coins to fetch
 * @returns {Promise<Array>} Array of top gaining coins
 */
export async function fetchTopGainers(limit = 5) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockGainers.slice(0, limit);
  }

  const cacheKey = `topGainers_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  const gainers = data
    .filter((coin) => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, limit)
    .map((coin, index) => ({
      rank: index + 1,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      image: coin.image,
    }));

  setCache(cacheKey, gainers);
  return gainers;
}

/**
 * Fetch top losers (coins sorted by 24h price change ascending)
 * @param {number} limit - Number of coins to fetch
 * @returns {Promise<Array>} Array of top losing coins
 */
export async function fetchTopLosers(limit = 5) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockLosers.slice(0, limit);
  }

  const cacheKey = `topLosers_${limit}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  const losers = data
    .filter((coin) => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, limit)
    .map((coin, index) => ({
      rank: index + 1,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      image: coin.image,
    }));

  setCache(cacheKey, losers);
  return losers;
}

/**
 * Fetch Fear & Greed Index from Alternative.me
 * @returns {Promise<Object>} Fear & Greed index data
 */
export async function fetchFearGreedIndex() {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockFearGreed;
  }

  const cacheKey = 'fearGreed';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${FEAR_GREED_BASE}/?limit=8`);

  if (!response.ok) {
    throw new Error(`Fear & Greed API error: ${response.status}`);
  }

  const { data } = await response.json();
  
  const current = data[0];
  const previous = data[1];
  
  const transformed = {
    value: parseInt(current.value, 10),
    label: current.value_classification,
    previousValue: parseInt(previous.value, 10),
    previousLabel: previous.value_classification,
    history: data.slice(1, 8).reverse().map((item) => ({
      date: new Date(parseInt(item.timestamp, 10) * 1000).toISOString().split('T')[0],
      value: parseInt(item.value, 10),
      label: item.value_classification,
    })),
  };

  setCache(cacheKey, transformed);
  return transformed;
}

/**
 * Fetch Bitcoin dominance data for pie chart
 * @returns {Promise<Array>} Dominance data for pie chart
 */
export async function fetchDominanceData() {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockDominance;
  }

  const cacheKey = 'dominance';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(`${COINGECKO_BASE}/global`);

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const { data } = await response.json();
  
  const btcDominance = data.market_cap_percentage.btc;
  const ethDominance = data.market_cap_percentage.eth;
  const othersDominance = 100 - btcDominance - ethDominance;

  const transformed = [
    { name: 'Bitcoin', value: parseFloat(btcDominance.toFixed(1)), color: '#f7931a' },
    { name: 'Ethereum', value: parseFloat(ethDominance.toFixed(1)), color: '#627eea' },
    { name: 'Others', value: parseFloat(othersDominance.toFixed(1)), color: '#8884d8' },
  ];

  setCache(cacheKey, transformed);
  return transformed;
}

/**
 * Fetch paginated list of coins
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Coins per page (default 50)
 * @returns {Promise<Array>} Array of coin data
 */
export async function fetchCoinsPage(page = 1, perPage = 50) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return getMockCoinsPage(page, perPage);
  }

  const cacheKey = `coinsPage_${page}_${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch detailed information for a specific coin
 * @param {string} id - Coin ID (e.g., 'bitcoin')
 * @returns {Promise<Object>} Detailed coin data
 */
export async function fetchCoinDetails(id) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay(150, 400);
    const mockData = getCoinDetailsFallback(id);
    if (mockData) {
      return mockData;
    }
    throw new Error(`Coin not found: ${id}`);
  }

  const cacheKey = `coinDetails_${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch price history for a coin
 * @param {string} id - Coin ID (e.g., 'bitcoin')
 * @param {number} days - Number of days of history (default 7)
 * @returns {Promise<Array>} Price history data
 */
export async function fetchCoinHistory(id, days = 7) {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay(100, 300);
    return getCoinHistoryFallback(id, days);
  }

  const cacheKey = `coinHistory_${id}_${days}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  const transformed = data.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString(),
    price,
  }));

  setCache(cacheKey, transformed);
  return transformed;
}

/**
 * Search for coins by name or symbol
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching coins
 */
export async function searchCoins(query) {
  if (!query || query.length < 2) return [];

  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay(50, 150);
    return searchCoinsMock(query);
  }

  const cacheKey = `search_${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await fetchWithRetry(
    `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  const results = data.coins.slice(0, 10).map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    image: coin.large || coin.thumb,
    marketCapRank: coin.market_cap_rank,
  }));

  setCache(cacheKey, results);
  return results;
}

/**
 * Fetch Ethereum gas prices
 * Uses Etherscan API or falls back to mock data
 * @returns {Promise<Object>} Gas price data
 */
export async function fetchGasPrice() {
  // Use mock data for demo
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return mockGasData;
  }

  const cacheKey = 'gasPrice';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      'https://api.etherscan.io/api?module=gastracker&action=gasoracle'
    );

    if (!response.ok) {
      throw new Error('Etherscan API error');
    }

    const data = await response.json();
    
    if (data.status !== '1') {
      throw new Error('Etherscan API returned error');
    }

    // Get ETH price for USD conversion
    const ethPriceResponse = await fetchWithRetry(
      `${COINGECKO_BASE}/simple/price?ids=ethereum&vs_currencies=usd`
    );
    const ethPriceData = await ethPriceResponse.json();
    const ethPrice = ethPriceData.ethereum?.usd || 2000;

    // Calculate USD cost for a standard 21000 gas transaction
    const gasLimit = 21000;
    const gweiToEth = 1e-9;

    const transformed = {
      slow: {
        price: parseInt(data.result.SafeGasPrice, 10),
        time: '~10 min',
        costUsd: parseInt(data.result.SafeGasPrice, 10) * gasLimit * gweiToEth * ethPrice,
      },
      standard: {
        price: parseInt(data.result.ProposeGasPrice, 10),
        time: '~3 min',
        costUsd: parseInt(data.result.ProposeGasPrice, 10) * gasLimit * gweiToEth * ethPrice,
      },
      fast: {
        price: parseInt(data.result.FastGasPrice, 10),
        time: '~30 sec',
        costUsd: parseInt(data.result.FastGasPrice, 10) * gasLimit * gweiToEth * ethPrice,
      },
      baseFee: parseInt(data.result.suggestBaseFee, 10) || parseInt(data.result.ProposeGasPrice, 10),
      lastBlock: parseInt(data.result.LastBlock, 10) || 0,
    };

    setCache(cacheKey, transformed);
    return transformed;
  } catch (error) {
    console.warn('Failed to fetch gas prices from Etherscan:', error);
    // Return null to signal fallback to mock data
    return null;
  }
}

/**
 * Clear all cached data
 */
export function clearCache() {
  cache.clear();
}
