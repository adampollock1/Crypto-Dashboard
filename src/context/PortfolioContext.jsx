import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext(null);

const STORAGE_KEY = 'cryptovue_portfolio';

export function PortfolioProvider({ children }) {
  const [holdings, setHoldings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever holdings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    } catch (err) {
      console.error('Failed to save portfolio to localStorage:', err);
    }
  }, [holdings]);

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
