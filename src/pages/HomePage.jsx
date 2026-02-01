import TickerBar from '../components/TickerBar';
import MarketCapChart from '../components/MarketCapChart';
import VolumeChart from '../components/VolumeChart';
import DominanceChart from '../components/DominanceChart';
import FearGreedIndex from '../components/FearGreedIndex';
import GasTracker from '../components/GasTracker';
import TopMovers from '../components/TopMovers';
import { StatCardSkeleton, DataStatusBadge } from '../components/Skeleton';
import { useCryptoData } from '../hooks/useCryptoData';
import { formatNumber, USE_MOCK_DATA } from '../data/mockData';
import { RefreshCw } from 'lucide-react';

function HomePage() {
  const {
    topCoins,
    marketStats,
    topGainers,
    topLosers,
    fearGreed,
    dominance,
    loading,
    error,
    lastUpdated,
    isUsingMockData,
    refresh,
  } = useCryptoData();

  return (
    <>
      {/* Ticker Bar */}
      <TickerBar coins={topCoins} loading={loading} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Status Bar */}
        <div className="flex items-center justify-between mb-6">
          <DataStatusBadge
            isUsingMockData={isUsingMockData}
            lastUpdated={lastUpdated}
            error={error}
          />
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#a1a7bb] hover:text-white bg-[#1a2332] hover:bg-[#242d3d] rounded-lg border border-white/5 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Market Cap"
                value={formatNumber(marketStats.totalMarketCap)}
                change={marketStats.totalMarketCapChange}
              />
              <StatCard
                label="24h Volume"
                value={formatNumber(marketStats.total24hVolume)}
                change={marketStats.total24hVolumeChange}
              />
              <StatCard
                label="BTC Dominance"
                value={`${marketStats.btcDominance?.toFixed(1) || 0}%`}
              />
              <StatCard
                label="Active Coins"
                value={marketStats.activeCoins?.toLocaleString() || '0'}
              />
            </>
          )}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 stagger-children">
          {/* Market Cap Chart - Full width on large screens */}
          <div className="lg:col-span-2">
            <MarketCapChart marketStats={marketStats} />
          </div>

          {/* Fear & Greed Index */}
          <div className="lg:col-span-1">
            <FearGreedIndex data={fearGreed} loading={loading} />
          </div>

          {/* Volume Chart */}
          <div className="lg:col-span-1">
            <VolumeChart marketStats={marketStats} />
          </div>

          {/* Dominance Chart */}
          <div className="lg:col-span-1">
            <DominanceChart data={dominance} />
          </div>

          {/* Gas Tracker */}
          <div className="lg:col-span-1">
            <GasTracker />
          </div>

          {/* Top Movers - Full width */}
          <div className="lg:col-span-3">
            <TopMovers gainers={topGainers} losers={topLosers} loading={loading} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#a1a7bb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span>CryptoVue Dashboard</span>
            </div>
            <p>© 2026 Portfolio Project. Powered by CoinGecko API.</p>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${USE_MOCK_DATA ? 'bg-[#00d4aa]' : isUsingMockData ? 'bg-[#f7931a]' : 'bg-[#00d4aa]'}`} />
              <span>{USE_MOCK_DATA ? 'Live Data' : isUsingMockData ? 'Demo Mode' : 'Live Data'}</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// Stat Card Component
function StatCard({ label, value, change }) {
  const hasChange = change !== undefined && change !== 0;
  const isPositive = change >= 0;

  return (
    <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200">
      <p className="text-[#a1a7bb] text-xs font-medium mb-1">{label}</p>
      <p className="text-white text-lg sm:text-xl font-bold">{value}</p>
      {hasChange && (
        <p
          className={`text-xs font-medium mt-1 ${
            isPositive ? 'text-[#00d4aa]' : 'text-[#ea3943]'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
        </p>
      )}
    </div>
  );
}

export default HomePage;
