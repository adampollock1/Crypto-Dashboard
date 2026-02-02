import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import CoinsPage from './pages/CoinsPage';
import CoinDetailPage from './pages/CoinDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import WatchlistPage from './pages/WatchlistPage';
import TopMoversPage from './pages/TopMoversPage';

// Context Providers
import { PortfolioProvider } from './context/PortfolioContext';
import { WatchlistProvider } from './context/WatchlistContext';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <WatchlistProvider>
        <PortfolioProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="coins" element={<CoinsPage />} />
              <Route path="coin/:id" element={<CoinDetailPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              <Route path="movers/:type" element={<TopMoversPage />} />
            </Route>
          </Routes>
        </PortfolioProvider>
      </WatchlistProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
