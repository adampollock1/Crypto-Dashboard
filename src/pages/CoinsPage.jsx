import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Star, Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchCoinsPage } from '../services/api';
import { formatNumber, formatPrice, formatChange } from '../data/mockData';
import { useWatchlist } from '../context/WatchlistContext';
import { TableRowSkeleton } from '../components/Skeleton';

const CoinsPage = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const perPage = 50;

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    const loadCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCoinsPage(page, perPage);
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCoins();
  }, [page]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const SortHeader = ({ column, children, align = 'left' }) => {
    const isActive = sortBy === column;
    return (
      <th
        onClick={() => handleSort(column)}
        className={`font-medium py-4 cursor-pointer transition-colors group ${
          align === 'right' ? 'text-right' : 'text-left'
        }`}
      >
        <div className={`flex items-center gap-1.5 ${align === 'right' ? 'justify-end' : ''}`}>
          <span className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
            {children}
          </span>
          <span className={`transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
            {isActive ? (
              sortOrder === 'asc' ? (
                <ArrowUp className="w-3 h-3 text-[#3861fb]" />
              ) : (
                <ArrowDown className="w-3 h-3 text-[#3861fb]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3861fb]/20 to-[#00d4aa]/20 rounded-xl flex items-center justify-center">
            <Coins className="w-5 h-5 text-[#3861fb]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cryptocurrency Prices</h1>
        </div>
        <p className="text-[#a1a7bb]">
          The global cryptocurrency market cap is displayed in real-time. Click headers to sort.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-[#ea3943]/10 border border-[#ea3943]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
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
                <th className="text-left font-medium p-4 w-12"></th>
                <SortHeader column="market_cap_rank">#</SortHeader>
                <th className="text-left font-medium py-4">Coin</th>
                <SortHeader column="current_price">Price</SortHeader>
                <SortHeader column="price_change_percentage_24h">24h %</SortHeader>
                <SortHeader column="market_cap">Market Cap</SortHeader>
                <SortHeader column="total_volume">Volume (24h)</SortHeader>
                <th className="text-right font-medium py-4 pr-4 hidden lg:table-cell">Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                sortedCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="group border-t border-white/5 transition-all duration-200 hover:bg-white/[0.03] table-row-hover"
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    {/* Star */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleWatchlist(coin.id)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          isInWatchlist(coin.id)
                            ? 'text-[#f7931a] bg-[#f7931a]/10'
                            : 'text-[#a1a7bb] hover:text-[#f7931a] hover:bg-[#f7931a]/10'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isInWatchlist(coin.id) ? 'fill-current scale-110' : 'hover:scale-110'
                          }`}
                        />
                      </button>
                    </td>
                    {/* Rank */}
                    <td className="py-4">
                      <span className="text-[#a1a7bb] text-sm font-medium tabular-nums">
                        {coin.market_cap_rank}
                      </span>
                    </td>
                    {/* Coin */}
                    <td className="py-4">
                      <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 group/coin">
                        <div className="relative">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-9 h-9 rounded-full ring-2 ring-white/10 transition-transform duration-200 group-hover/coin:scale-110"
                            loading="lazy"
                          />
                          {/* Hover glow */}
                          <div className="absolute inset-0 rounded-full bg-white/10 blur opacity-0 group-hover/coin:opacity-100 transition-opacity duration-200" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm group-hover/coin:text-[#3861fb] transition-colors">
                            {coin.name}
                          </p>
                          <p className="text-[#a1a7bb] text-xs uppercase tracking-wide">{coin.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    {/* Price */}
                    <td className="py-4">
                      <span className="text-white text-sm font-semibold tabular-nums">
                        {formatPrice(coin.current_price)}
                      </span>
                    </td>
                    {/* 24h Change */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-md ${
                          coin.price_change_percentage_24h >= 0 
                            ? 'text-[#00d4aa] bg-[#00d4aa]/10' 
                            : 'text-[#ea3943] bg-[#ea3943]/10'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="tabular-nums">{formatChange(Math.abs(coin.price_change_percentage_24h || 0))}</span>
                      </span>
                    </td>
                    {/* Market Cap */}
                    <td className="py-4">
                      <span className="text-white text-sm tabular-nums">{formatNumber(coin.market_cap)}</span>
                    </td>
                    {/* Volume */}
                    <td className="py-4">
                      <span className="text-[#a1a7bb] text-sm tabular-nums">{formatNumber(coin.total_volume)}</span>
                    </td>
                    {/* Circulating Supply */}
                    <td className="py-4 pr-4 text-right hidden lg:table-cell">
                      <span className="text-[#a1a7bb] text-sm tabular-nums">
                        {coin.circulating_supply?.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                        <span className="text-[#a1a7bb]/60 ml-1">{coin.symbol?.toUpperCase()}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-white/5 bg-[#0d1421]/30">
          <p className="text-[#a1a7bb] text-sm">
            Showing <span className="text-white font-medium">{(page - 1) * perPage + 1}</span> - <span className="text-white font-medium">{page * perPage}</span> coins
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#a1a7bb] hover:text-white bg-[#1a2332] hover:bg-[#242d3d] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1a2332]"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {page > 2 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="w-9 h-9 text-sm text-[#a1a7bb] hover:text-white hover:bg-[#242d3d] rounded-lg transition-all"
                  >
                    1
                  </button>
                  {page > 3 && <span className="text-[#a1a7bb] px-1">...</span>}
                </>
              )}
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  className="w-9 h-9 text-sm text-[#a1a7bb] hover:text-white hover:bg-[#242d3d] rounded-lg transition-all"
                >
                  {page - 1}
                </button>
              )}
              <span className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-[#3861fb] to-[#3861fb]/80 rounded-lg shadow-lg shadow-[#3861fb]/20">
                {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                className="w-9 h-9 text-sm text-[#a1a7bb] hover:text-white hover:bg-[#242d3d] rounded-lg transition-all"
              >
                {page + 1}
              </button>
            </div>
            
            <button
              onClick={() => setPage(page + 1)}
              className="group flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#a1a7bb] hover:text-white bg-[#1a2332] hover:bg-[#242d3d] rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoinsPage;
