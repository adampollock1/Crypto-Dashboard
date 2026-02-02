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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { WatchlistProvider } from './context/WatchlistContext';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="account/:tab" element={<AccountPage />} />
              </Route>
            </Routes>
          </PortfolioProvider>
        </WatchlistProvider>
      </AuthProvider>
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
