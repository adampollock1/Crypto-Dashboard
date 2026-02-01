import { useState, useEffect, useCallback } from 'react';
import {
  fetchTopCoins,
  fetchGlobalData,
  fetchTopGainers,
  fetchTopLosers,
  fetchFearGreedIndex,
  fetchDominanceData,
} from '../services/api';

// Import mock data as fallback
import {
  USE_MOCK_DATA,
  topCoins as mockTopCoins,
  marketStats as mockMarketStats,
  topGainers as mockGainers,
  topLosers as mockLosers,
  fearGreedIndex as mockFearGreed,
  dominanceData as mockDominance,
} from '../data/mockData';

const REFRESH_INTERVAL = 60000; // 60 seconds

/**
 * Custom hook to fetch and manage cryptocurrency data
 * Features:
 * - Auto-refresh every 60 seconds
 * - Graceful fallback to mock data on API failure
 * - Loading and error states
 */
export function useCryptoData() {
  const [data, setData] = useState({
    topCoins: mockTopCoins,
    marketStats: mockMarketStats,
    topGainers: mockGainers,
    topLosers: mockLosers,
    fearGreed: mockFearGreed,
    dominance: mockDominance,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(USE_MOCK_DATA);

  const fetchAllData = useCallback(async () => {
    try {
      setError(null);

      // Fetch all data in parallel
      const [coins, global, gainers, losers, fearGreed, dominance] = await Promise.all([
        fetchTopCoins(20).catch(() => null),
        fetchGlobalData().catch(() => null),
        fetchTopGainers(5).catch(() => null),
        fetchTopLosers(5).catch(() => null),
        fetchFearGreedIndex().catch(() => null),
        fetchDominanceData().catch(() => null),
      ]);

      // Check if any API calls succeeded
      const hasRealData = coins || global || gainers || losers || fearGreed || dominance;

      if (!hasRealData) {
        throw new Error('All API calls failed');
      }

      setData({
        topCoins: coins || mockTopCoins,
        marketStats: global || mockMarketStats,
        topGainers: gainers || mockGainers,
        topLosers: losers || mockLosers,
        fearGreed: fearGreed || mockFearGreed,
        dominance: dominance || mockDominance,
      });

      setIsUsingMockData(USE_MOCK_DATA);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError(err.message);
      setIsUsingMockData(true);
      
      // Keep using mock data on error
      setData({
        topCoins: mockTopCoins,
        marketStats: mockMarketStats,
        topGainers: mockGainers,
        topLosers: mockLosers,
        fearGreed: mockFearGreed,
        dominance: mockDominance,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Auto-refresh (only if not using mock data exclusively)
  useEffect(() => {
    if (USE_MOCK_DATA) {
      // For demo mode, just set a periodic "update" to refresh the timestamp
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
    
    const interval = setInterval(fetchAllData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true);
    return fetchAllData();
  }, [fetchAllData]);

  return {
    ...data,
    loading,
    error,
    lastUpdated,
    isUsingMockData,
    refresh,
  };
}

/**
 * Hook for just the top coins data (for ticker bar)
 */
export function useTopCoins() {
  const [coins, setCoins] = useState(mockTopCoins);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await fetchTopCoins(10);
        if (mounted) {
          setCoins(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching top coins:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Only set up refresh interval if not in mock mode
    if (!USE_MOCK_DATA) {
      const interval = setInterval(fetchData, REFRESH_INTERVAL);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { coins, loading, error };
}

/**
 * Hook for Fear & Greed Index data
 */
export function useFearGreed() {
  const [fearGreed, setFearGreed] = useState(mockFearGreed);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const data = await fetchFearGreedIndex();
        if (mounted) {
          setFearGreed(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching Fear & Greed:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    if (!USE_MOCK_DATA) {
      const interval = setInterval(fetchData, REFRESH_INTERVAL * 5);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { fearGreed, loading, error };
}

/**
 * Hook for Top Movers (gainers and losers)
 */
export function useTopMovers() {
  const [gainers, setGainers] = useState(mockGainers);
  const [losers, setLosers] = useState(mockLosers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [gainersData, losersData] = await Promise.all([
          fetchTopGainers(5),
          fetchTopLosers(5),
        ]);
        
        if (mounted) {
          setGainers(gainersData);
          setLosers(losersData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching top movers:', err);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    if (!USE_MOCK_DATA) {
      const interval = setInterval(fetchData, REFRESH_INTERVAL);
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  return { gainers, losers, loading, error };
}
