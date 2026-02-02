import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { fetchTopGainers, fetchTopLosers } from '../services/api';
import { formatPrice, formatChange, formatNumber } from '../data/mockData';
import { TableRowSkeleton } from '../components/Skeleton';

const TopMoversPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isGainers = type === 'gainers';

  useEffect(() => {
    // Redirect if invalid type
    if (type !== 'gainers' && type !== 'losers') {
      navigate('/movers/gainers', { replace: true });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = isGainers 
          ? await fetchTopGainers(20) 
          : await fetchTopLosers(20);
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, isGainers, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = isGainers 
        ? await fetchTopGainers(20) 
        : await fetchTopLosers(20);
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#a1a7bb] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {isGainers ? (
              <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#00d4aa]" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#ea3943]/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#ea3943]" />
              </div>
            )}
            Top {isGainers ? 'Gainers' : 'Losers'}
          </h1>
          <p className="text-[#a1a7bb] mt-2">
            Cryptocurrencies with the {isGainers ? 'highest' : 'lowest'} 24-hour price change
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Buttons */}
          <div className="flex gap-1 bg-[#1a2332] rounded-lg p-1 border border-white/5">
            <Link
              to="/movers/gainers"
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isGainers
                  ? 'bg-[#00d4aa]/20 text-[#00d4aa]'
                  : 'text-[#a1a7bb] hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Gainers
            </Link>
            <Link
              to="/movers/losers"
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !isGainers
                  ? 'bg-[#ea3943]/20 text-[#ea3943]'
                  : 'text-[#a1a7bb] hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Losers
            </Link>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#a1a7bb] hover:text-white bg-[#1a2332] hover:bg-[#242d3d] rounded-lg border border-white/5 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-[#ea3943]/10 border border-[#ea3943]/20 rounded-xl p-4 mb-6">
          <p className="text-[#ea3943]">Error loading data: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#a1a7bb] text-xs border-b border-white/5">
                <th className="text-left font-medium py-4 pl-6">#</th>
                <th className="text-left font-medium py-4">Coin</th>
                <th className="text-right font-medium py-4">Price</th>
                <th className="text-right font-medium py-4">24h Change</th>
                <th className="text-right font-medium py-4 hidden sm:table-cell">Volume (24h)</th>
                <th className="text-right font-medium py-4 pr-6 hidden md:table-cell">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                coins.map((coin) => (
                  <tr
                    key={coin.symbol}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-4 pl-6 text-[#a1a7bb] text-sm">{coin.rank}</td>
                    
                    {/* Coin */}
                    <td className="py-4">
                      <Link 
                        to={`/coin/${coin.id || coin.symbol.toLowerCase()}`} 
                        className="flex items-center gap-3 group"
                      >
                        {coin.image ? (
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              isGainers
                                ? 'bg-gradient-to-br from-[#00d4aa] to-[#3861fb]'
                                : 'bg-gradient-to-br from-[#ea3943] to-[#f7931a]'
                            }`}
                          >
                            {coin.symbol?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm group-hover:text-[#3861fb] transition-colors">
                            {coin.name}
                          </p>
                          <p className="text-[#a1a7bb] text-xs uppercase">{coin.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    
                    {/* Price */}
                    <td className="py-4 text-right">
                      <span className="text-white text-sm font-medium">
                        {formatPrice(coin.price)}
                      </span>
                    </td>
                    
                    {/* 24h Change */}
                    <td className="py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 text-sm font-medium ${
                          isGainers ? 'text-[#00d4aa]' : 'text-[#ea3943]'
                        }`}
                      >
                        {isGainers ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {formatChange(Math.abs(coin.change24h || 0))}
                      </span>
                    </td>
                    
                    {/* Volume */}
                    <td className="py-4 text-right hidden sm:table-cell">
                      <span className="text-[#a1a7bb] text-sm">
                        {formatNumber(coin.volume || 0)}
                      </span>
                    </td>
                    
                    {/* Market Cap */}
                    <td className="py-4 pr-6 text-right hidden md:table-cell">
                      <span className="text-[#a1a7bb] text-sm">
                        {formatNumber(coin.marketCap || 0)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results Count */}
        {!loading && coins.length > 0 && (
          <div className="p-4 border-t border-white/5">
            <p className="text-[#a1a7bb] text-sm">
              Showing {coins.length} {isGainers ? 'gaining' : 'losing'} cryptocurrencies
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default TopMoversPage;
