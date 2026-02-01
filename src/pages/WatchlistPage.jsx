import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown, Eye } from 'lucide-react';
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
        // Fetch top 100 coins and filter for watchlisted ones
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Watchlist</h1>
        <p className="text-[#a1a7bb]">
          Track your favorite cryptocurrencies in one place.
        </p>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="bg-[#1a2332] rounded-2xl p-12 border border-white/5 text-center">
          <div className="w-16 h-16 bg-[#242d3d] rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-[#a1a7bb]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Your watchlist is empty</h3>
          <p className="text-[#a1a7bb] mb-6">
            Start adding cryptocurrencies to your watchlist to track them here.
          </p>
          <Link
            to="/coins"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3861fb] hover:bg-[#3861fb]/80 text-white rounded-lg transition-all"
          >
            <Star className="w-4 h-4" />
            Browse Coins
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5">
              <p className="text-[#a1a7bb] text-sm">Total Coins</p>
              <p className="text-2xl font-bold text-white">{watchlist.length}</p>
            </div>
            <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5">
              <p className="text-[#a1a7bb] text-sm">Gainers (24h)</p>
              <p className="text-2xl font-bold text-[#00d4aa]">
                {coins.filter((c) => c.change24h >= 0).length}
              </p>
            </div>
            <div className="bg-[#1a2332] rounded-xl p-4 border border-white/5">
              <p className="text-[#a1a7bb] text-sm">Losers (24h)</p>
              <p className="text-2xl font-bold text-[#ea3943]">
                {coins.filter((c) => c.change24h < 0).length}
              </p>
            </div>
          </div>

          {/* Coins Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 animate-pulse"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#242d3d] rounded-full" />
                    <div>
                      <div className="h-4 bg-[#242d3d] rounded w-24 mb-2" />
                      <div className="h-3 bg-[#242d3d] rounded w-16" />
                    </div>
                  </div>
                  <div className="h-8 bg-[#242d3d] rounded w-32 mb-2" />
                  <div className="h-4 bg-[#242d3d] rounded w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Link to={`/coin/${coin.id}`} className="flex items-center gap-4">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-white font-bold group-hover:text-[#3861fb] transition-colors">
                          {coin.name}
                        </p>
                        <p className="text-[#a1a7bb] text-sm uppercase">{coin.symbol}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => removeFromWatchlist(coin.id)}
                      className="p-2 text-[#f7931a] hover:bg-[#f7931a]/10 rounded-lg transition-all"
                      title="Remove from watchlist"
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <Link to={`/coin/${coin.id}`}>
                    <p className="text-2xl font-bold text-white mb-2">
                      {formatPrice(coin.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 text-sm font-medium ${
                          coin.change24h >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
                        }`}
                      >
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatChange(Math.abs(coin.change24h))}
                      </span>
                      <span className="text-[#a1a7bb] text-sm">24h</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[#a1a7bb] text-xs mb-1">Market Cap</p>
                        <p className="text-white text-sm font-medium">
                          {formatNumber(coin.marketCap)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#a1a7bb] text-xs mb-1">Volume (24h)</p>
                        <p className="text-white text-sm font-medium">
                          {formatNumber(coin.volume)}
                        </p>
                      </div>
                    </div>
                  </Link>
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
