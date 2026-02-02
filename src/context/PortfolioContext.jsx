import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext(null);

const STORAGE_KEY_PREFIX = 'cryptovue_portfolio';
const ANONYMOUS_KEY = 'cryptovue_portfolio_anonymous';

export function PortfolioProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [holdings, setHoldings] = useState([]);

  // Get the storage key based on user authentication status
  const getStorageKey = useCallback(() => {
    if (isAuthenticated && user?.id) {
      return `${STORAGE_KEY_PREFIX}_${user.id}`;
    }
    return ANONYMOUS_KEY;
  }, [isAuthenticated, user?.id]);

  // Load holdings from localStorage when user changes
  useEffect(() => {
    const storageKey = getStorageKey();
    try {
      const stored = localStorage.getItem(storageKey);
      setHoldings(stored ? JSON.parse(stored) : []);
    } catch {
      setHoldings([]);
    }
  }, [getStorageKey]);

  // Persist to localStorage whenever holdings change
  useEffect(() => {
    const storageKey = getStorageKey();
    try {
      localStorage.setItem(storageKey, JSON.stringify(holdings));
    } catch (err) {
      console.error('Failed to save portfolio to localStorage:', err);
    }
  }, [holdings, getStorageKey]);

  // Migrate anonymous data to user account on login
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const userKey = `${STORAGE_KEY_PREFIX}_${user.id}`;
      const anonymousData = localStorage.getItem(ANONYMOUS_KEY);
      const userData = localStorage.getItem(userKey);

      // If user has no data but anonymous data exists, offer to migrate
      if (anonymousData && !userData) {
        try {
          const anonymousHoldings = JSON.parse(anonymousData);
          if (anonymousHoldings.length > 0) {
            // Automatically migrate anonymous data to user account
            localStorage.setItem(userKey, anonymousData);
            setHoldings(anonymousHoldings);
            // Clear anonymous data after migration
            localStorage.removeItem(ANONYMOUS_KEY);
          }
        } catch {
          // Ignore migration errors
        }
      }
    }
  }, [isAuthenticated, user?.id]);

  const addHolding = (holding) => {
    setHoldings((prev) => {
      // Check if coin already exists in portfolio
      const existingIndex = prev.findIndex((h) => h.coinId === holding.coinId);
      
      if (existingIndex >= 0) {
        // Update existing holding (average the buy price)
        const existing = prev[existingIndex];
        const totalQuantity = existing.quantity + holding.quantity;
        const avgBuyPrice =
          (existing.quantity * existing.buyPrice + holding.quantity * holding.buyPrice) /
          totalQuantity;

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: totalQuantity,
          buyPrice: avgBuyPrice,
        };
        return updated;
      }

      // Add new holding
      return [...prev, holding];
    });
  };

  const removeHolding = (coinId) => {
    setHoldings((prev) => prev.filter((h) => h.coinId !== coinId));
  };

  const updateHolding = (coinId, updates) => {
    setHoldings((prev) =>
      prev.map((h) =>
        h.coinId === coinId
          ? { ...h, ...updates }
          : h
      )
    );
  };

  const getHolding = (coinId) => {
    return holdings.find((h) => h.coinId === coinId);
  };

  const clearPortfolio = () => {
    setHoldings([]);
  };

  const value = {
    holdings,
    addHolding,
    removeHolding,
    updateHolding,
    getHolding,
    clearPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
