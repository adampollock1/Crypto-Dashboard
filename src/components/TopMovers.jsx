import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice, formatChange, formatNumber } from '../data/mockData';
import { TableRowSkeleton } from './Skeleton';

const TopMovers = ({ gainers = [], losers = [], loading = false }) => {
  const [activeTab, setActiveTab] = useState('gainers');

  const data = activeTab === 'gainers' ? gainers : losers;
  const isGainers = activeTab === 'gainers';

  return (
    <div className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Top Movers</h3>
        
        <div className="flex gap-1 bg-[#0d1421] rounded-lg p-1">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === 'gainers'
                ? 'bg-[#00d4aa]/20 text-[#00d4aa]'
                : 'text-[#a1a7bb] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === 'losers'
                ? 'bg-[#ea3943]/20 text-[#ea3943]'
                : 'text-[#a1a7bb] hover:text-white'
            }`}
          >
            <TrendingDown className="w-3 h-3" />
            Losers
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#a1a7bb] text-xs">
              <th className="text-left font-medium pb-3">#</th>
              <th className="text-left font-medium pb-3">Coin</th>
              <th className="text-right font-medium pb-3">Price</th>
              <th className="text-right font-medium pb-3">24h</th>
              <th className="text-right font-medium pb-3 hidden sm:table-cell">Volume</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Show skeleton loaders while loading
              [...Array(5)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : (
              data.map((coin) => (
                <tr
                  key={coin.symbol}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 text-[#a1a7bb] text-sm">{coin.rank}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {/* Coin icon - use API image or fallback */}
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
                          {coin.symbol}
                        </p>
                        <p className="text-[#a1a7bb] text-xs">{coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-white text-sm font-medium">
                      {formatPrice(coin.price)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
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
                  <td className="py-3 text-right hidden sm:table-cell">
                    <span className="text-[#a1a7bb] text-sm">
                      {formatNumber(coin.volume || 0)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <button className="text-[#3861fb] text-sm font-medium hover:text-[#00d4aa] transition-colors">
          View All {isGainers ? 'Gainers' : 'Losers'} →
        </button>
      </div>
    </div>
  );
};

export default TopMovers;
