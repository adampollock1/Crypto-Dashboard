import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown, Eye, Sparkles, BarChart3, ArrowRight } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchTopCoins } from '../services/api';
import { formatPrice, formatChange, formatNumber } from '../data/mockData';

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const allCoins = await fetchTopCoins(100);
        const watchlistedCoins = allCoins.filter((coin) =>
          watchlist.includes(coin.id)
        );
        setCoins(watchlistedCoins);
      } catch (err) {
        console.error('Failed to fetch watchlist coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistCoins();
    const interval = setInterval(fetchWatchlistCoins, 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const gainersCount = coins.filter((c) => c.change24h >= 0).length;
  const losersCount = coins.filter((c) => c.change24h < 0).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-[#f7931a]/20 to-[#f7931a]/10 rounded-xl flex items-center justify-center">
          <Star className="w-5 h-5 text-[#f7931a]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-[#a1a7bb] text-sm">Track your favorite cryptocurrencies</p>
        </div>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-12 border border-white/5 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Sparkles className="w-64 h-64" />
          </div>
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#f7931a]/20 to-[#f7931a]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float">
              <Eye className="w-10 h-10 text-[#f7931a]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-[#a1a7bb] mb-8 max-w-sm mx-auto">
              Start tracking your favorite cryptocurrencies by adding them to your watchlist.
            </p>
            <Link
              to="/coins"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#f7931a] to-[#f7931a]/80 hover:from-[#ffa940] hover:to-[#f7931a] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#f7931a]/20"
            >
              <Star className="w-5 h-5" />
              Browse Coins
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3861fb]/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <BarChart3 className="w-5 h-5 text-[#3861fb]" />
                </div>
                <div>
                  <p className="text-[#a1a7bb] text-sm font-medium">Total Coins</p>
                  <p className="text-2xl font-bold text-white tabular-nums">{watchlist.length}</p>
                </div>
              </div>
            </div>
            <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
                </div>
                <div>
                  <p className="text-[#a1a7bb] text-sm font-medium">Gainers (24h)</p>
                  <p className="text-2xl font-bold text-[#00d4aa] tabular-nums">{gainersCount}</p>
                </div>
              </div>
            </div>
            <div className="group bg-[#1a2332]/80 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ea3943]/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <TrendingDown className="w-5 h-5 text-[#ea3943]" />
                </div>
                <div>
                  <p className="text-[#a1a7bb] text-sm font-medium">Losers (24h)</p>
                  <p className="text-2xl font-bold text-[#ea3943] tabular-nums">{losersCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coins Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#242d3d] rounded-full shimmer" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#242d3d] rounded w-24 mb-2 shimmer" />
                      <div className="h-3 bg-[#242d3d] rounded w-16 shimmer" />
                    </div>
                  </div>
                  <div className="h-8 bg-[#242d3d] rounded w-32 mb-2 shimmer" />
                  <div className="h-4 bg-[#242d3d] rounded w-20 shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coins.map((coin, index) => (
                <div
                  key={coin.id}
                  className="group relative bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover-lift overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: coin.change24h >= 0 
                        ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, transparent 60%)'
                        : 'linear-gradient(135deg, rgba(234, 57, 67, 0.05) 0%, transparent 60%)',
                    }}
                  />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <Link to={`/coin/${coin.id}`} className="flex items-center gap-4 group/coin">
                        <div className="relative">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-12 h-12 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover/coin:scale-110"
                          />
                          {/* Ambient glow */}
                          <div 
                            className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover/coin:opacity-40 transition-opacity duration-300 -z-10 scale-150"
                            style={{ background: `url(${coin.image})`, backgroundSize: 'cover' }}
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold group-hover/coin:text-[#3861fb] transition-colors">
                            {coin.name}
                          </p>
                          <p className="text-[#a1a7bb] text-sm uppercase tracking-wide">{coin.symbol}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeFromWatchlist(coin.id)}
                        className="p-2 text-[#f7931a] hover:bg-[#f7931a]/10 rounded-lg transition-all btn-icon"
                        title="Remove from watchlist"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <Link to={`/coin/${coin.id}`} className="block">
                      <p className="text-3xl font-bold text-white mb-3 tabular-nums tracking-tight">
                        {formatPrice(coin.price)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-lg ${
                          coin.change24h >= 0 
                            ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                            : 'text-[#ea3943] bg-[#ea3943]/10'
                        }`}
                      >
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="tabular-nums">{formatChange(Math.abs(coin.change24h))}</span>
                        <span className="text-[#a1a7bb] font-normal ml-1">24h</span>
                      </span>

                      <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[#a1a7bb] text-xs font-medium mb-1 uppercase tracking-wide">Market Cap</p>
                          <p className="text-white text-sm font-semibold tabular-nums">
                            {formatNumber(coin.marketCap)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#a1a7bb] text-xs font-medium mb-1 uppercase tracking-wide">Volume (24h)</p>
                          <p className="text-white text-sm font-semibold tabular-nums">
                            {formatNumber(coin.volume)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default WatchlistPage;
