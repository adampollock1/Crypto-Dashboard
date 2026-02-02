import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

const STORAGE_KEY_PREFIX = 'cryptovue_watchlist';
const ANONYMOUS_KEY = 'cryptovue_watchlist_anonymous';

export function WatchlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  // Get the storage key based on user authentication status
  const getStorageKey = useCallback(() => {
    if (isAuthenticated && user?.id) {
      return `${STORAGE_KEY_PREFIX}_${user.id}`;
    }
    return ANONYMOUS_KEY;
  }, [isAuthenticated, user?.id]);

  // Load watchlist from localStorage when user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    try {
      const stored = localStorage.getItem(storageKey);
      setWatchlist(stored ? JSON.parse(stored) : []);
    } catch {
      setWatchlist([]);
    }
  }, [getStorageKey]);

  // Persist to localStorage whenever watchlist changes
  useEffect(() => {
    const storageKey = getStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err);
    }
  }, [watchlist, getStorageKey]);

  // Migrate anonymous data to user account on login
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const userKey = `${STORAGE_KEY_PREFIX}_${user.id}`;
      const anonymousData = localStorage.getItem(ANONYMOUS_KEY);
      const userData = localStorage.getItem(userKey);

      // If user has no data but anonymous data exists, migrate it
      if (anonymousData && !userData) {
        try {
          const anonymousWatchlist = JSON.parse(anonymousData);
          if (anonymousWatchlist.length > 0) {
            // Automatically migrate anonymous data to user account
            localStorage.setItem(userKey, anonymousData);
            setWatchlist(anonymousWatchlist);
            // Clear anonymous data after migration
            localStorage.removeItem(ANONYMOUS_KEY);
          }
        } catch {
          // Ignore migration errors
        }
      }
    }
  }, [isAuthenticated, user?.id]);

  const addToWatchlist = (coinId) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) {
        return prev;
      }
      return [...prev, coinId];
    });
  };

  const removeFromWatchlist = (coinId) => {
    setWatchlist((prev) => prev.filter((id) => id !== coinId));
  };

  const toggleWatchlist = (coinId) => {
    setWatchlist((prev) => {
      if (prev.includes(coinId)) {
        return prev.filter((id) => id !== coinId);
      }
      return [...prev, coinId];
    });
  };

  const isInWatchlist = (coinId) => {
    return watchlist.includes(coinId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
