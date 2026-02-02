import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, ArrowLeft, RefreshCw, Flame } from 'lucide-react';
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
        className="group inline-flex items-center gap-2 text-[#a1a7bb] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isGainers 
              ? 'bg-gradient-to-br from-[#00d4aa]/20 to-[#00d4aa]/10' 
              : 'bg-gradient-to-br from-[#ea3943]/20 to-[#ea3943]/10'
          }`}>
            {isGainers ? (
              <TrendingUp className="w-6 h-6 text-[#00d4aa]" />
            ) : (
              <TrendingDown className="w-6 h-6 text-[#ea3943]" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Top {isGainers ? 'Gainers' : 'Losers'}
            </h1>
            <p className="text-[#a1a7bb] text-sm">
              {isGainers ? 'Highest' : 'Lowest'} 24h price change
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Buttons */}
          <div className="flex gap-1 bg-[#0d1421]/80 rounded-xl p-1.5 backdrop-blur-sm border border-white/5">
            <Link
              to="/movers/gainers"
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isGainers
                  ? 'text-white'
                  : 'text-[#a1a7bb] hover:text-white'
              }`}
            >
              {isGainers && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#00d4aa] to-[#00d4aa]/80 rounded-lg" />
              )}
              <TrendingUp className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Gainers</span>
            </Link>
            <Link
              to="/movers/losers"
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                !isGainers
                  ? 'text-white'
                  : 'text-[#a1a7bb] hover:text-white'
              }`}
            >
              {!isGainers && (
                <span className="absolute inset-0 bg-gradient-to-r from-[#ea3943] to-[#ea3943]/80 rounded-lg" />
              )}
              <TrendingDown className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Losers</span>
            </Link>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#a1a7bb] hover:text-white bg-[#1a2332]/80 hover:bg-[#1a2332] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-[#ea3943]/10 border border-[#ea3943]/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 bg-[#ea3943]/20 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-[#ea3943]" />
          </div>
          <p className="text-[#ea3943]">Error loading data: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a2332]/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#a1a7bb] text-xs border-b border-white/5 bg-[#0d1421]/50">
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
                coins.map((coin, index) => (
                  <tr
                    key={coin.symbol}
                    className="group border-t border-white/5 transition-all duration-200 hover:bg-white/[0.03] table-row-hover"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {/* Rank */}
                    <td className="py-4 pl-6 text-[#a1a7bb] text-sm font-medium tabular-nums">{coin.rank}</td>
                    
                    {/* Coin */}
                    <td className="py-4">
                      <Link 
                        to={`/coin/${coin.id || coin.symbol.toLowerCase()}`} 
                        className="flex items-center gap-3 group/coin"
                      >
                        {coin.image ? (
                          <div className="relative">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-9 h-9 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover/coin:scale-110"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 ${
                              isGainers
                                ? 'bg-gradient-to-br from-[#00d4aa] to-[#3861fb]'
                                : 'bg-gradient-to-br from-[#ea3943] to-[#f7931a]'
                            }`}
                          >
                            {coin.symbol?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm group-hover/coin:text-[#3861fb] transition-colors">
                            {coin.name}
                          </p>
                          <p className="text-[#a1a7bb] text-xs uppercase tracking-wide">{coin.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    
                    {/* Price */}
                    <td className="py-4 text-right">
                      <span className="text-white text-sm font-semibold tabular-nums">
                        {formatPrice(coin.price)}
                      </span>
                    </td>
                    
                    {/* 24h Change */}
                    <td className="py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-md ${
                          isGainers 
                            ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                            : 'text-[#ea3943] bg-[#ea3943]/10'
                        }`}
                      >
                        {isGainers ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span className="tabular-nums">{formatChange(Math.abs(coin.change24h || 0))}</span>
                      </span>
                    </td>
                    
                    {/* Volume */}
                    <td className="py-4 text-right hidden sm:table-cell">
                      <span className="text-[#a1a7bb] text-sm tabular-nums">
                        {formatNumber(coin.volume || 0)}
                      </span>
                    </td>
                    
                    {/* Market Cap */}
                    <td className="py-4 pr-6 text-right hidden md:table-cell">
                      <span className="text-[#a1a7bb] text-sm tabular-nums">
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
          <div className="p-4 border-t border-white/5 bg-[#0d1421]/30 flex items-center justify-between">
            <p className="text-[#a1a7bb] text-sm">
              Showing <span className="text-white font-medium">{coins.length}</span> {isGainers ? 'gaining' : 'losing'} cryptocurrencies
            </p>
            <div className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${
              isGainers ? 'bg-[#00d4aa]/10 text-[#00d4aa]' : 'bg-[#ea3943]/10 text-[#ea3943]'
            }`}>
              <Flame className="w-3 h-3" />
              <span>24h Movers</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default TopMoversPage;
