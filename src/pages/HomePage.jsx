import { AreaChart, Area, ResponsiveContainer } from 'recharts';
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
import { RefreshCw, TrendingUp } from 'lucide-react';

function HomePage() {
  const {
    topCoins,
    marketStats,
    topGainers,
    topLosers,
    fearGreed,
    dominance,
    marketCapHistory,
    volumeHistory,
    dominanceHistory,
    activeCoinsHistory,
    loading,
    error,
    lastUpdated,
    isUsingMockData,
    refresh,
  } = useCryptoData();

  // Define stat card configurations with sparkline data
  const statCards = [
    {
      label: 'Market Cap',
      value: formatNumber(marketStats.totalMarketCap),
      change: marketStats.totalMarketCapChange,
      history: marketCapHistory,
      color: '#3861fb',
    },
    {
      label: '24h Volume',
      value: formatNumber(marketStats.total24hVolume),
      change: marketStats.total24hVolumeChange,
      history: volumeHistory,
      color: '#00d4aa',
    },
    {
      label: 'BTC Dominance',
      value: `${marketStats.btcDominance?.toFixed(1) || 0}%`,
      history: dominanceHistory,
      color: '#f7931a',
    },
    {
      label: 'Active Coins',
      value: marketStats.activeCoins?.toLocaleString() || '0',
      history: activeCoinsHistory,
      color: '#a855f7',
    },
  ];

  return (
    <>
      {/* Ticker Bar */}
      <TickerBar coins={topCoins} loading={loading} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Status Bar */}
        <div className="flex items-center justify-between mb-8">
          <DataStatusBadge
            isUsingMockData={isUsingMockData}
            lastUpdated={lastUpdated}
            error={error}
          />
          <button
            onClick={refresh}
            disabled={loading}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#a1a7bb] hover:text-white bg-[#1a2332]/80 hover:bg-[#1a2332] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-300 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            Refresh Data
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            statCards.map((card, index) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                change={card.change}
                history={card.history}
                color={card.color}
                delay={index * 0.05}
              />
            ))
          )}
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">Market Overview</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Cap Chart - Full width on large screens */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <MarketCapChart marketStats={marketStats} />
          </div>

          {/* Fear & Greed Index */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <FearGreedIndex data={fearGreed} loading={loading} />
          </div>

          {/* Volume Chart */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <VolumeChart marketStats={marketStats} />
          </div>

          {/* Dominance Chart */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <DominanceChart data={dominance} />
          </div>

          {/* Gas Tracker */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <GasTracker />
          </div>

          {/* Section Divider */}
          <div className="lg:col-span-3 flex items-center gap-4 mt-4">
            <h2 className="text-lg font-semibold text-white">Top Movers</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {/* Top Movers - Full width */}
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <TopMovers gainers={topGainers} losers={topLosers} loading={loading} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#a1a7bb]">
            <div className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00d4aa] to-[#3861fb] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4aa]/10 transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-semibold text-white">CryptoVue</span>
                <p className="text-[10px] text-[#a1a7bb]">Market Dashboard</p>
              </div>
            </div>
            <p className="text-center">© 2026 Portfolio Project. Powered by CoinGecko API.</p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a2332]/50 rounded-full">
              <span className={`w-2 h-2 rounded-full pulse-dot ${USE_MOCK_DATA ? 'bg-[#00d4aa]' : isUsingMockData ? 'bg-[#f7931a]' : 'bg-[#00d4aa]'}`} />
              <span className="text-xs font-medium">{USE_MOCK_DATA ? 'Live Data' : isUsingMockData ? 'Demo Mode' : 'Live Data'}</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// Data-rich Stat Card Component with Sparkline
function StatCard({ label, value, change, history = [], color = '#3861fb', delay = 0 }) {
  const hasChange = change !== undefined && change !== 0;
  const isPositive = change >= 0;
  
  // Calculate trend from history data
  const hasTrend = history.length >= 2;
  const trendIsPositive = hasTrend 
    ? history[history.length - 1]?.value >= history[0]?.value 
    : true;
  
  // Use trend color for sparkline (green for up, red for down)
  const sparklineColor = trendIsPositive ? '#00d4aa' : '#ea3943';

  return (
    <div 
      className="group relative bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 hover-lift overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative">
        {/* Label */}
        <p className="text-[#a1a7bb] text-xs font-medium mb-2 tracking-wide uppercase">{label}</p>
        
        {/* Value and Change Row */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-white text-xl sm:text-2xl font-bold tabular-nums tracking-tight">{value}</p>
          {hasChange && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
              isPositive 
                ? 'bg-[#00d4aa]/10 text-[#00d4aa]' 
                : 'bg-[#ea3943]/10 text-[#ea3943]'
            }`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span className="tabular-nums">{Math.abs(change).toFixed(2)}%</span>
            </div>
          )}
        </div>
        
        {/* Sparkline Chart */}
        {history.length > 0 && (
          <div className="h-10 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparklineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${label.replace(/\s/g, '')})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
