import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus, ExternalLink, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
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
      
      // Try fallback data
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
      // Use fallback history data
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
        <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-[#a1a7bb] text-xs mb-1">{data.date}</p>
          <p className="text-white font-bold">{formatPrice(data.price)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-[#1a2332] rounded w-48 mb-4"></div>
          <div className="h-64 bg-[#1a2332] rounded-2xl mb-6"></div>
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
        <div className="bg-[#1a2332] border border-white/5 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#ea3943]/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying...' : 'Try Again'}
            </button>
            <Link
              to="/coins"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#242d3d] hover:bg-[#2a3548] text-white rounded-lg transition-all"
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
        className="inline-flex items-center gap-2 text-[#a1a7bb] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Coins
      </Link>

      {/* Fallback Data Notice - only show if not in demo mode and using fallback */}
      {isUsingFallback && !USE_MOCK_DATA && (
        <div className="bg-[#f7931a]/10 border border-[#f7931a]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#f7931a]" />
            <p className="text-[#f7931a] text-sm">
              Showing demo data. Live data is temporarily unavailable.
            </p>
          </div>
          <button
            onClick={() => loadCoin(true)}
            disabled={retrying}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#f7931a] hover:bg-[#f7931a]/20 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
      )}

      {/* Coin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={coin.image?.large}
            alt={coin.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
              <span className="px-2 py-0.5 bg-[#242d3d] rounded text-[#a1a7bb] text-sm uppercase">
                {coin.symbol}
              </span>
              <span className="px-2 py-0.5 bg-[#3861fb]/20 rounded text-[#3861fb] text-xs">
                Rank #{coin.market_cap_rank}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-white">
                {formatPrice(coin.market_data?.current_price?.usd || 0)}
              </span>
              <span
                className={`flex items-center gap-1 text-lg font-medium ${
                  isPositive ? 'text-[#00d4aa]' : 'text-[#ea3943]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {formatChange(Math.abs(priceChange))}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWatchlist(coin.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isInWatchlist(coin.id)
                ? 'bg-[#f7931a]/20 border-[#f7931a] text-[#f7931a]'
                : 'bg-[#1a2332] border-white/10 text-[#a1a7bb] hover:text-white hover:border-white/20'
            }`}
          >
            <Star className={`w-4 h-4 ${isInWatchlist(coin.id) ? 'fill-current' : ''}`} />
            {isInWatchlist(coin.id) ? 'Watchlisted' : 'Add to Watchlist'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add to Portfolio
          </button>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Price Chart</h3>
          <div className="flex gap-1 bg-[#0d1421] rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.days}
                onClick={() => setTimeRange(range.days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === range.days
                    ? 'bg-[#3861fb] text-white'
                    : 'text-[#a1a7bb] hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {historyLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#00d4aa' : '#ea3943'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isPositive ? '#00d4aa' : '#ea3943'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a7bb', fontSize: 11 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return timeRange <= 7 ? date.toLocaleDateString('en-US', { weekday: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a7bb', fontSize: 11 }}
                  tickFormatter={(value) => formatPrice(value)}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#00d4aa' : '#ea3943'}
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
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
          value={`${(coin.market_data?.circulating_supply || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} ${coin.symbol?.toUpperCase()}`}
        />
        <StatCard
          label="All-Time High"
          value={formatPrice(coin.market_data?.ath?.usd || 0)}
          subValue={`${formatChange(Math.abs(coin.market_data?.ath_change_percentage?.usd || 0))} from ATH`}
          negative
        />
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
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
              className="inline-flex items-center gap-2 text-[#3861fb] hover:underline mt-4 text-sm"
            >
              Official Website
              <ExternalLink className="w-3 h-3" />
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

function StatCard({ label, value, subValue, isChange, positive, negative }) {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5">
      <p className="text-[#a1a7bb] text-xs font-medium mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          isChange
            ? positive
              ? 'text-[#00d4aa]'
              : 'text-[#ea3943]'
            : 'text-white'
        }`}
      >
        {isChange && (positive ? '↑ ' : '↓ ')}
        {value}
      </p>
      {subValue && (
        <p className={`text-xs mt-1 ${negative ? 'text-[#ea3943]' : 'text-[#a1a7bb]'}`}>
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a2332] rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <img src={coin.image?.small} alt={coin.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="text-lg font-bold text-white">Add {coin.name} to Portfolio</h3>
            <p className="text-[#a1a7bb] text-sm">{coin.symbol?.toUpperCase()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#a1a7bb] text-sm mb-2">Quantity</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-lg text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb]"
                required
              />
            </div>
            <div>
              <label className="block text-[#a1a7bb] text-sm mb-2">Buy Price (USD)</label>
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#0d1421] border border-white/10 rounded-lg text-white placeholder-[#a1a7bb] focus:outline-none focus:border-[#3861fb]"
                required
              />
            </div>
            <div className="pt-2">
              <p className="text-[#a1a7bb] text-sm">
                Total Value: <span className="text-white font-medium">
                  ${((parseFloat(quantity) || 0) * (parseFloat(buyPrice) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#0d1421] text-[#a1a7bb] rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#3861fb] text-white rounded-lg hover:bg-[#3861fb]/80 transition-colors"
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
