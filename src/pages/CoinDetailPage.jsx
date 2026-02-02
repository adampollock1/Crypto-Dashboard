import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, ExternalLink, TrendingUp, TrendingDown, RefreshCw, AlertCircle, LineChart, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCoinDetails, fetchCoinHistory } from '../services/api';
import { formatNumber, formatPrice, formatChange, getCoinDetailsFallback, getCoinHistoryFallback, USE_MOCK_DATA } from '../data/mockData';
import { useWatchlist } from '../context/WatchlistContext';
import { usePortfolio } from '../context/PortfolioContext';
import { ChartSkeleton } from '../components/Skeleton';

const CoinDetailPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(7);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { addHolding } = usePortfolio();

  const loadCoin = useCallback(async (useRetry = false) => {
    if (useRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }
    setError(null);
    setIsUsingFallback(false);
    
    try {
      const data = await fetchCoinDetails(id);
      setCoin(data);
      setIsUsingFallback(false);
    } catch (err) {
      console.error('API error, trying fallback:', err.message);
      
      const fallbackData = getCoinDetailsFallback(id);
      if (fallbackData) {
        setCoin(fallbackData);
        setIsUsingFallback(true);
        setError(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [id]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchCoinHistory(id, timeRange);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load price history, using fallback:', err);
      const fallbackHistory = getCoinHistoryFallback(id, timeRange);
      setHistory(fallbackHistory);
    } finally {
      setHistoryLoading(false);
    }
  }, [id, timeRange]);

  useEffect(() => {
    loadCoin();
  }, [loadCoin]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const timeRanges = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card-solid rounded-xl p-4 shadow-2xl shadow-black/30 border border-white/10 min-w-[140px]">
          <p className="text-[#a1a7bb] text-xs mb-2 font-medium">{data.date}</p>
          <p className="text-white font-bold text-lg tabular-nums">{formatPrice(data.price)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-[#1a2332] rounded w-32 mb-6"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#1a2332] rounded-full"></div>
            <div>
              <div className="h-8 bg-[#1a2332] rounded w-48 mb-2"></div>
              <div className="h-10 bg-[#1a2332] rounded w-36"></div>
            </div>
          </div>
          <div className="h-96 bg-[#1a2332] rounded-2xl mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#1a2332] rounded-xl"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !coin) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#ea3943]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#ea3943]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Coin Data</h2>
          <p className="text-[#a1a7bb] mb-2">
            {error?.includes('429') || error?.includes('rate')
              ? 'The API is rate limited. Please wait a moment and try again.'
              : error?.includes('API error')
              ? 'The CoinGecko API is temporarily unavailable.'
              : 'Unable to fetch data for this cryptocurrency.'}
          </p>
          <p className="text-[#a1a7bb] text-sm mb-6 opacity-75">
            Error: {error || 'Unknown error'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => loadCoin(true)}
              disabled={retrying}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#3861fb]/90 hover:to-[#3861fb]/70 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-[#3861fb]/20"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying...' : 'Try Again'}
            </button>
            <Link
              to="/coins"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#242d3d] hover:bg-[#2a3548] text-white font-medium rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Coins
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const priceChange = coin.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        to="/coins"
        className="group inline-flex items-center gap-2 text-[#a1a7bb] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Coins
      </Link>

      {/* Fallback Data Notice */}
      {isUsingFallback && !USE_MOCK_DATA && (
        <div className="bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-xl p-4 mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#f7931a]" />
            <p className="text-[#f7931a] text-sm font-medium">
              Showing demo data. Live data is temporarily unavailable.
            </p>
          </div>
          <button
            onClick={() => loadCoin(true)}
            disabled={retrying}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f7931a] hover:bg-[#f7931a]/20 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
      )}

      {/* Coin Header - Enhanced with glow */}
      <div className="relative mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Coin image with ambient glow */}
            <div className="relative">
              <img
                src={coin.image?.large}
                alt={coin.name}
                className="w-20 h-20 rounded-2xl ring-2 ring-white/10"
              />
              {/* Ambient glow */}
              <div 
                className="absolute inset-0 rounded-2xl blur-xl opacity-40 -z-10 scale-150"
                style={{ background: `url(${coin.image?.large})`, backgroundSize: 'cover' }}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
                <span className="px-2.5 py-1 bg-[#242d3d] rounded-lg text-[#a1a7bb] text-sm font-medium uppercase tracking-wide">
                  {coin.symbol}
                </span>
                <span className="px-2.5 py-1 bg-[#3861fb]/20 rounded-lg text-[#3861fb] text-xs font-semibold">
                  Rank #{coin.market_cap_rank}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                  {formatPrice(coin.market_data?.current_price?.usd || 0)}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-lg font-semibold px-3 py-1 rounded-lg ${
                    isPositive 
                      ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                      : 'text-[#ea3943] bg-[#ea3943]/10'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="tabular-nums">{formatChange(Math.abs(priceChange))}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleWatchlist(coin.id)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-medium transition-all duration-200 ${
                isInWatchlist(coin.id)
                  ? 'bg-[#f7931a]/10 border-[#f7931a]/50 text-[#f7931a]'
                  : 'bg-[#1a2332]/50 border-white/10 text-[#a1a7bb] hover:text-white hover:border-white/20 hover:bg-[#1a2332]'
              }`}
            >
              <Star className={`w-4 h-4 transition-transform duration-200 ${
                isInWatchlist(coin.id) ? 'fill-current' : 'group-hover:scale-110'
              }`} />
              {isInWatchlist(coin.id) ? 'Watchlisted' : 'Add to Watchlist'}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#4a73ff] hover:to-[#3861fb] text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#3861fb]/20 hover:shadow-[#3861fb]/30"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
              Add to Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6 relative overflow-hidden group">
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${isPositive ? 'from-[#00d4aa]/5' : 'from-[#ea3943]/5'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${isPositive ? 'bg-[#00d4aa]/10' : 'bg-[#ea3943]/10'} rounded-lg flex items-center justify-center`}>
              <LineChart className={`w-4 h-4 ${isPositive ? 'text-[#00d4aa]' : 'text-[#ea3943]'}`} />
            </div>
            <h3 className="text-lg font-bold text-white">Price Chart</h3>
          </div>
          <div className="flex gap-1 bg-[#0d1421]/80 rounded-xl p-1.5 backdrop-blur-sm">
            {timeRanges.map((range) => (
              <button
                key={range.days}
                onClick={() => setTimeRange(range.days)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  timeRange === range.days
                    ? 'text-white'
                    : 'text-[#a1a7bb] hover:text-white'
                }`}
              >
                {timeRange === range.days && (
                  <span className={`absolute inset-0 bg-gradient-to-r ${isPositive ? 'from-[#00d4aa] to-[#00d4aa]/80' : 'from-[#ea3943] to-[#ea3943]/80'} rounded-lg`} />
                )}
                <span className="relative z-10">{range.label}</span>
              </button>
            ))}
          </div>
        </div>

        {historyLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositive ? '#00d4aa' : '#ea3943'} stopOpacity={0.4} />
                    <stop offset="50%" stopColor={isPositive ? '#00d4aa' : '#ea3943'} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={isPositive ? '#00d4aa' : '#ea3943'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a7bb', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return timeRange <= 7 ? date.toLocaleDateString('en-US', { weekday: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a7bb', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => formatPrice(value)}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: isPositive ? '#00d4aa' : '#ea3943', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#00d4aa' : '#ea3943'}
                  strokeWidth={2.5}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ r: 6, fill: isPositive ? '#00d4aa' : '#ea3943', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-white">Market Statistics</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Market Cap"
          value={formatNumber(coin.market_data?.market_cap?.usd || 0)}
        />
        <StatCard
          label="24h Volume"
          value={formatNumber(coin.market_data?.total_volume?.usd || 0)}
        />
        <StatCard
          label="Circulating Supply"
          value={`${(coin.market_data?.circulating_supply || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          suffix={coin.symbol?.toUpperCase()}
        />
        <StatCard
          label="All-Time High"
          value={formatPrice(coin.market_data?.ath?.usd || 0)}
          subValue={`${formatChange(Math.abs(coin.market_data?.ath_change_percentage?.usd || 0))} from ATH`}
          negative
        />
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="24h High"
          value={formatPrice(coin.market_data?.high_24h?.usd || 0)}
        />
        <StatCard
          label="24h Low"
          value={formatPrice(coin.market_data?.low_24h?.usd || 0)}
        />
        <StatCard
          label="7d Change"
          value={formatChange(Math.abs(coin.market_data?.price_change_percentage_7d || 0))}
          isChange
          positive={coin.market_data?.price_change_percentage_7d >= 0}
        />
        <StatCard
          label="30d Change"
          value={formatChange(Math.abs(coin.market_data?.price_change_percentage_30d || 0))}
          isChange
          positive={coin.market_data?.price_change_percentage_30d >= 0}
        />
      </div>

      {/* Description */}
      {coin.description?.en && (
        <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
          <h3 className="text-lg font-bold text-white mb-4">About {coin.name}</h3>
          <div
            className="text-[#a1a7bb] text-sm leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split('. ').slice(0, 5).join('. ') + '.',
            }}
          />
          {coin.links?.homepage?.[0] && (
            <a
              href={coin.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#3861fb] hover:text-[#4a73ff] mt-4 text-sm font-medium transition-colors group"
            >
              Official Website
              <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      )}

      {/* Add to Portfolio Modal */}
      {showAddModal && (
        <AddToPortfolioModal
          coin={coin}
          onClose={() => setShowAddModal(false)}
          onAdd={addHolding}
        />
      )}
    </main>
  );
};

function StatCard({ label, value, subValue, suffix, isChange, positive, negative }) {
  return (
    <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-200 hover-lift">
      <p className="text-[#a1a7bb] text-xs font-medium mb-1.5 uppercase tracking-wide">{label}</p>
      <p
        className={`text-lg font-bold tabular-nums ${
          isChange
            ? positive
              ? 'text-[#00d4aa]'
              : 'text-[#ea3943]'
            : 'text-white'
        }`}
      >
        {isChange && (
          <span className="inline-flex items-center gap-1">
            {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </span>
        )}
        {value}
        {suffix && <span className="text-[#a1a7bb] text-sm font-normal ml-1">{suffix}</span>}
      </p>
      {subValue && (
        <p className={`text-xs mt-1.5 ${negative ? 'text-[#ea3943]' : 'text-[#a1a7bb]'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
}

function AddToPortfolioModal({ coin, onClose, onAdd }) {
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState(coin.market_data?.current_price?.usd?.toString() || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !buyPrice) return;

    onAdd({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image?.small,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
    });
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-backdrop-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl shadow-black/50 animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={coin.image?.small} alt={coin.name} className="w-12 h-12 rounded-xl ring-2 ring-white/10" />
              <div 
                className="absolute inset-0 rounded-xl blur-lg opacity-30 -z-10 scale-125"
                style={{ background: `url(${coin.image?.small})`, backgroundSize: 'cover' }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add to Portfolio</h3>
              <p className="text-[#a1a7bb] text-sm">{coin.name} ({coin.symbol?.toUpperCase()})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a1a7bb] hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#a1a7bb] text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 transition-all tabular-nums"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[#a1a7bb] text-sm font-medium mb-2">Buy Price (USD)</label>
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-xl text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 transition-all tabular-nums"
                required
              />
            </div>
            
            {/* Total Value Preview */}
            <div className="bg-[#0d1421]/50 rounded-xl p-4 border border-white/5">
              <p className="text-[#a1a7bb] text-sm mb-1">Total Value</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                ${((parseFloat(quantity) || 0) * (parseFloat(buyPrice) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#242d3d] text-[#a1a7bb] hover:text-white font-medium rounded-xl transition-all hover:bg-[#2a3548]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 hover:from-[#4a73ff] hover:to-[#3861fb] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#3861fb]/20"
            >
              Add to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoinDetailPage;
