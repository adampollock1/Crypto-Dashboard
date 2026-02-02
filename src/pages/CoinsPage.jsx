import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpDown, Star } from 'lucide-react';
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

  const SortHeader = ({ column, children }) => (
    <th
      onClick={() => handleSort(column)}
      className="text-left font-medium py-4 cursor-pointer hover:text-white transition-colors group"
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${sortBy === column ? 'opacity-100' : ''}`} />
      </div>
    </th>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Cryptocurrency Prices by Market Cap</h1>
        <p className="text-[#a1a7bb]">
          The global cryptocurrency market cap is displayed in real-time.
        </p>
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
                sortedCoins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Star */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleWatchlist(coin.id)}
                        className="text-[#a1a7bb] hover:text-[#f7931a] transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${isInWatchlist(coin.id) ? 'fill-[#f7931a] text-[#f7931a]' : ''}`}
                        />
                      </button>
                    </td>
                    {/* Rank */}
                    <td className="py-4 text-[#a1a7bb] text-sm">{coin.market_cap_rank}</td>
                    {/* Coin */}
                    <td className="py-4">
                      <Link to={`/coin/${coin.id}`} className="flex items-center gap-3 group">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-white font-medium text-sm group-hover:text-[#3861fb] transition-colors">
                            {coin.name}
                          </p>
                          <p className="text-[#a1a7bb] text-xs uppercase">{coin.symbol}</p>
                        </div>
                      </Link>
                    </td>
                    {/* Price */}
                    <td className="py-4">
                      <span className="text-white text-sm font-medium">
                        {formatPrice(coin.current_price)}
                      </span>
                    </td>
                    {/* 24h Change */}
                    <td className="py-4">
                      <span
                        className={`text-sm font-medium ${
                          coin.price_change_percentage_24h >= 0 ? 'text-[#00d4aa]' : 'text-[#ea3943]'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
                        {formatChange(Math.abs(coin.price_change_percentage_24h || 0))}
                      </span>
                    </td>
                    {/* Market Cap */}
                    <td className="py-4">
                      <span className="text-white text-sm">{formatNumber(coin.market_cap)}</span>
                    </td>
                    {/* Volume */}
                    <td className="py-4">
                      <span className="text-[#a1a7bb] text-sm">{formatNumber(coin.total_volume)}</span>
                    </td>
                    {/* Circulating Supply */}
                    <td className="py-4 pr-4 text-right hidden lg:table-cell">
                      <span className="text-[#a1a7bb] text-sm">
                        {coin.circulating_supply?.toLocaleString(undefined, { maximumFractionDigits: 0 })} {coin.symbol?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-white/5">
          <p className="text-[#a1a7bb] text-sm">
            Showing {(page - 1) * perPage + 1} - {page * perPage} coins
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#a1a7bb] hover:text-white bg-[#0d1421] hover:bg-[#242d3d] rounded-lg border border-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-white bg-[#3861fb] rounded-lg">
              {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#a1a7bb] hover:text-white bg-[#0d1421] hover:bg-[#242d3d] rounded-lg border border-white/5 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CoinsPage;
